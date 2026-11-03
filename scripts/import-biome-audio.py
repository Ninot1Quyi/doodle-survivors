"""Transcode licensed finished music; preserve attribution and source checksums."""
import argparse,json,subprocess,hashlib,shutil
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--ffmpeg',required=True);a=p.parse_args()
out=Path(__file__).resolve().parent.parent/'public/audio/biomes';out.mkdir(exist_ok=True)
m=json.loads((a.source/'manifest.json').read_text());config={}
for t in m['tracks']:
 start=max(0,t['non_silent_start_seconds_at_minus55dbfs']-.1);end=t['non_silent_end_seconds_at_minus55dbfs'];duration=end-start
 gain=t['suggested_relative_gain_for_equal_rms']
 dst=out/t['file'];subprocess.run([a.ffmpeg,'-v','error','-y','-ss',str(start),'-i',str(a.source/t['file']),'-t',str(duration),'-af',f'volume={gain},afade=t=in:d=0.1','-codec:a','libmp3lame','-b:a','128k',str(dst)],check=True)
 config[t['biome']]={'title':t['title'],'file':'audio/biomes/'+t['file'],'end':round(duration-.3,2)}
 t['asset_modifications']=f'Trimmed {start:.2f}–{end:.2f}s, constant gain {gain}, 100ms onset fade, MP3 128k; runtime overlap crossfades.'
 t['source_sha256']=t.pop('sha256');t['sha256']=hashlib.sha256(dst.read_bytes()).hexdigest()
(out/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');shutil.copy2(a.source/'CC-BY-4.0.txt',out/'CC-BY-4.0.txt')
(out/'CREDITS.txt').write_text('\n\n'.join(t['attribution']+'\nSource: '+t['source_page_url']+'\nChanges: '+t['asset_modifications'] for t in m['tracks'])+'\n')
(out.parent.parent/'biome-audio.js').write_text("'use strict';\nconst BIOME_AUDIO="+json.dumps(config,ensure_ascii=False,indent=2)+';\n')
print('Prepared six attributed music tracks:',sum(p.stat().st_size for p in out.glob('*.mp3')),'bytes')
