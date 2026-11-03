"""Rebuild short Foley variants from the licensed originals (no synthesis)."""
import argparse, array, hashlib, json, math, subprocess, zipfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--impact-zip',required=True);p.add_argument('--ffmpeg',required=True);args=p.parse_args()
out=Path(__file__).resolve().parent.parent/'dist/audio';z=zipfile.ZipFile(args.impact_zip)
sources={
 'wood':('impactWood_light',170,.19),
 'snap':('impactPlate_light',300,.16),
 'glass':('impactGlass_light',420,.28),
 'metal':('impactMetal_light',300,.21),
 'soft':('impactGeneric_light',220,.18),
 'body':('impactPunch_medium',130,.20),
 'paper':('impactPlank_medium',240,.18),
}
manifest={'source':'https://kenney.nl/assets/impact-sounds','license':'CC0-1.0','samples':[]}
for key,(prefix,hp,tail) in sources.items():
 for i in range(3):
  filename=f'{prefix}_{i:03d}.ogg';raw=z.read('Audio/'+filename)
  pcm=subprocess.run([args.ffmpeg,'-v','error','-i','pipe:0','-ac','1','-ar','48000','-f','f32le','pipe:1'],input=raw,stdout=subprocess.PIPE,check=True).stdout
  data=array.array('f');data.frombytes(pcm);peak=max(abs(x) for x in data);start=next((i for i,x in enumerate(data) if abs(x)>peak*.015),0);start=max(0,start-24)
  selected=data[start:start+round(tail*48000)];duration=len(selected)/48000
  # Keep the recorded transient, cut sub-bass and expose the crisp wooden/glass attack.
  filters=f'highpass=f={hp},equalizer=f=2600:t=q:w=1.1:g=2.5,lowpass=f=10500,afade=t=in:d=0.0005,afade=t=out:st={max(0,duration-.035):.4f}:d=0.035'
  processed=subprocess.run([args.ffmpeg,'-v','error','-f','f32le','-ar','48000','-ac','1','-i','pipe:0','-af',filters,'-f','f32le','pipe:1'],input=selected.tobytes(),stdout=subprocess.PIPE,check=True).stdout
  a=array.array('f');a.frombytes(processed);scale=.55/max(.001,max(abs(x) for x in a));a=array.array('f',(x*scale for x in a));target=out/f'{key}{i}.ogg'
  subprocess.run([args.ffmpeg,'-y','-v','error','-f','f32le','-ar','48000','-ac','1','-i','pipe:0','-c:a','libvorbis','-q:a','5',str(target)],input=a.tobytes(),check=True)
  manifest['samples'].append({'output':target.name,'original':filename,'source_sha256':hashlib.sha256(raw).hexdigest(),'onset_trim_ms':round(start/48,2),'duration_ms':round(duration*1000,1),'filters':filters,'normalization_peak':.55})
(out/'MIX-PROVENANCE.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Prepared {len(manifest["samples"])} Foley variants.')
