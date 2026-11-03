"""Rebuild a cohesive, short impact palette from licensed CC0 recordings; no synthesis."""
import argparse,array,hashlib,json,math,subprocess,zipfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--impact-zip',required=True);p.add_argument('--ffmpeg',required=True);a=p.parse_args()
root=Path(__file__).resolve().parent.parent;out=root/'dist/audio';z=zipfile.ZipFile(a.impact_zip);sr=48000

def ff(raw,args):return subprocess.run([a.ffmpeg,'-v','error',*args],input=raw,stdout=subprocess.PIPE,check=True).stdout

def floats(raw):v=array.array('f');v.frombytes(raw);return v

def decode(raw):return floats(ff(raw,['-i','pipe:0','-ac','1','-ar',str(sr),'-f','f32le','pipe:1']))

def process(v,filters):return floats(ff(v.tobytes(),['-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-af',filters,'-f','f32le','pipe:1']))

specs={
 'warmHit':(.145,.92,[('impactSoft_medium',.72,0),('impactPunch_medium',.46,.002)]),
 'warmHeavy':(.215,.86,[('impactPunch_heavy',.73,0),('impactSoft_heavy',.38,.012)]),
 'warmFinish':(.24,.93,[('impactPunch_medium',.6,0),('impactSoft_heavy',.52,.028)]),
 'warmCut':(.155,1.04,[('impactSoft_medium',.65,0),('footstep_carpet',.32,.005)]),
 'warmShot':(.095,1.03,[('footstep_carpet',.65,0),('impactGeneric_light',.2,.005)]),
 'warmParry':(.15,1.05,[('impactSoft_medium',.6,0),('impactWood_light',.24,.003)])
}
manifest={'source':'https://kenney.nl/assets/impact-sounds','license':'CC0-1.0','sample_rate':sr,'design':'Premixed single voices. Soft/punch onset, short body, no plate/glass/metal crackle in repeated hits.','samples':[]}
for family,(duration,rate,layers) in specs.items():
 for variant in range(3):
  mix=array.array('f',[0])*round(sr*duration);sources=[]
  for prefix,gain,delay in layers:
   name=f'{prefix}_{variant:03d}.ogg';raw=z.read('Audio/'+name);v=decode(raw);peak=max(map(abs,v));start=max(0,next((i for i,x in enumerate(v)if abs(x)>peak*.02),0)-96);v=v[start:]
   v=process(v,f'asetrate={round(sr*rate)},aresample={sr},highpass=f=65,equalizer=f=2700:t=q:w=0.85:g=-7,highshelf=f=4500:g=-10,lowpass=f=7000')
   offset=round(delay*sr)
   for i,x in enumerate(v[:len(mix)-offset]):mix[i+offset]+=x*gain
   sources.append({'original':name,'gain':gain,'delay_ms':delay*1000,'source_sha256':hashlib.sha256(raw).hexdigest(),'onset_trim_ms':round(start/sr*1000,2)})
  for i in range(len(mix)):
   t=i/sr;envelope=min(1,t/.003)*min(1,(duration-t)/.045);mix[i]*=max(0,envelope)
  peak=max(map(abs,mix));rms=math.sqrt(sum(x*x for x in mix)/len(mix));gain=min(.57/max(peak,.001),.125/max(rms,.001));mix=array.array('f',(x*gain for x in mix));target=out/f'{family}{variant}.ogg'
  subprocess.run([a.ffmpeg,'-y','-v','error','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-c:a','libvorbis','-q:a','5',str(target)],input=mix.tobytes(),check=True)
  encoded=decode(target.read_bytes());high=process(encoded,'highpass=f=4000:poles=2');energy=sum(x*x for x in encoded);ratio=sum(x*x for x in high)/max(energy,1e-12)
  manifest['samples'].append({'output':target.name,'duration_ms':duration*1000,'playback_pitch':rate,'peak':round(max(map(abs,encoded)),5),'rms':round(math.sqrt(energy/len(encoded)),5),'above_4k_energy_ratio':round(ratio,6),'normalization_gain':round(gain,5),'layers':sources})
(out/'WARM-IMPACT-PROVENANCE.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'samples':len(manifest['samples']),'max_peak':max(s['peak']for s in manifest['samples']),'mean_above_4k_ratio':sum(s['above_4k_energy_ratio']for s in manifest['samples'])/len(manifest['samples'])},indent=2))
