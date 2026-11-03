#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Review/rebuild the soft15 contact and reward palette from retained CC0 source files.
No synthesis, layers, pitch shift, nonlinear limiting or time stretching. Only source selection,
linear EQ, gain, excerpt and cosine edge envelopes. Output checks are not a hearing approval.
"""
from pathlib import Path
import argparse,array,hashlib,html,json,math,shutil,subprocess

P=argparse.ArgumentParser(description=__doc__)
P.add_argument('--research',type=Path,required=True)
P.add_argument('--ffmpeg',required=True)
P.add_argument('--write',action='store_true')
P.add_argument('--contacts-only',action='store_true')
A=P.parse_args();ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/audio';REVIEW=A.research/'balanced-palette-stage15';SR=44100
REVIEW.mkdir(exist_ok=True)
SPEC=[]
def add(file,pack,name,length,hp=260,lp=8000,target=-22.5,peak=-7,start=None,attack=.003,release=.035,description=''):
 SPEC.append(dict(file=file,pack=pack,source=name,length=length,hp=hp,lp=lp,target=target,peak=peak,start=start,attack=attack,release=release,description=description))
for i in range(3):
 add(f'contacts/paper{i}.ogg','impact',f'impactGeneric_light_{i:03}.ogg',[.105,.115,.13][i],hp=320,description='Short dry light-object tap; no page ripping.')
 add(f'contacts/crush{i}.ogg','impact',f'impactGeneric_light_{i:03}.ogg',[.13,.14,.15][i],hp=230,target=-21.8,description='Small firmer object tap; no stones, bones or sub-bass thump.')
 add(f'contacts/frost{i}.ogg','impact',f'impactGlass_light_{i:03}.ogg',.12,hp=380,lp=7200,target=-23,release=.045,description='Brief light-glass touch, damped before ringing tail; no break/shatter layer.')
for family,names,lengths,hp,target in [
 ('ink',[13,47,41],[.16,.14,.17],240,-22.5),
 ('fire',[7,46,41],[.135,.135,.15],300,-22.5),
 ('electric',[41,46,47],[.14,.13,.14],360,-22.5)]:
 for i,(n,length)in enumerate(zip(names,lengths)):
  add(f'contacts/{family}{i}.ogg','dusty',f'DM-CGS-{n:02}.wav',length,hp=hp,target=target,description='Short authored casual-game pop/tap family; no slime tearing or electrical noise recording.')
for i,n in enumerate([11,12,13]):
 add(f'cut{i}.ogg','swish',f'swish-{n}.wav',[.115,.095,.095][i],hp=320,lp=7600,target=-22.5,peak=-8,attack=.004,release=.03,description='Recorded stick/hanger air swish replacing blade scraping.')
for i,n in enumerate([13,41,47]):
 add(f'defeat{i}.ogg','dusty',f'DM-CGS-{n:02}.wav',[.245,.225,.18][i],hp=230,lp=8000,target=-21,peak=-6.5,attack=.004,release=.06,description='One rounded casual-game release/pop replacing pumpkin/stone crunch.')
add('inspiration.ogg','jingles','jingles_PIZZI10.ogg',.80,hp=130,lp=8000,target=-20,peak=-6,attack=.008,release=.085,description='Short ascending plucked-string phrase; replaces descending PIZZI07. Pitch analysis indicates a rising phrase, not a subjective listening approval.')
add('giftPickup.ogg','jingles','jingles_PIZZI08.ogg',.57,hp=150,lp=8000,target=-21,peak=-7,attack=.006,release=.08,description='Short upward two-note plucked-string phrase replacing electronic highUp.')
add('softPickup.ogg','jingles','jingles_PIZZI08.ogg',.165,hp=180,lp=8000,target=-22.5,peak=-8,start=.125,attack=.006,release=.065,description='Single upper-note excerpt from the same plucked-string recording; replaces pepSound3.')
if A.contacts_only:SPEC=[s for s in SPEC if s['file'].startswith('contacts/')]

URLS={'impact':'https://kenney.nl/assets/impact-sounds','dusty':'https://dustyroom.com/free-casual-game-sounds/','swish':'https://opengameart.org/content/swishes-sound-pack','jingles':'https://kenney.nl/assets/music-jingles'}
AUTHORS={'impact':'Kenney','dusty':'Dustyroom','swish':'artisticdude','jingles':'Kenney'}
def src(spec):
 bases={'impact':REVIEW/'source-cache/kenney-impact','dusty':A.research/'dustyroom/DM-CGS/WAV','swish':A.research/'combat-library/originals/swishes-sound-pack/extracted/swishes','jingles':A.research/'music-jingles/Audio/Pizzicato jingles'}
 return bases[spec['pack']]/spec['source']
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def pcm(path,filters=None):
 cmd=[A.ffmpeg,'-v','error','-i',str(path),'-ac','1','-ar',str(SR)]
 if filters:cmd+=['-af',filters]
 v=array.array('f');v.frombytes(subprocess.check_output(cmd+['-f','f32le','pipe:1']));return v

def filtered(v,filters):
 d=subprocess.check_output([A.ffmpeg,'-v','error','-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0','-af',filters,'-f','f32le','pipe:1'],input=v.tobytes());a=array.array('f');a.frombytes(d);return a

def measure(v):
 peak=max(map(abs,v),default=0);energy=sum(x*x for x in v);rms=math.sqrt(energy/max(1,len(v)));active=[x for x in v if abs(x)>peak*.03];ar=math.sqrt(sum(x*x for x in active)/max(1,len(active)));db=lambda x:20*math.log10(max(x,1e-12))
 ratios={}
 for key,f in [('below_220hz','lowpass=f=220:p=2'),('above_4khz','highpass=f=4000:p=2'),('above_6khz','highpass=f=6000:p=2')]:
  band=filtered(v,f);ratios[key]=round(sum(x*x for x in band)/max(energy,1e-20),6)
 acc=0;early=late=0
 for i,x in enumerate(v):
  acc+=x*x
  if not early and acc>=energy*.05:early=i
  if acc>=energy*.95:late=i;break
 win=220
 envelope=[math.sqrt(sum(x*x for x in v[i:i+win])/max(1,len(v[i:i+win])))for i in range(0,len(v),win)]
 return {'duration_seconds':round(len(v)/SR,6),'peak_dbfs':round(db(peak),3),'rms_dbfs':round(db(rms),3),'active_rms_dbfs':round(db(ar),3),'crest_db':round(db(peak)-db(rms),3),'clipped_samples':sum(abs(x)>=.999 for x in v),'peak_time_ms':round(max(range(len(v)),key=lambda i:abs(v[i]))/SR*1000,2),'energy_5_to_95_ms':round((late-early)/SR*1000,2),'first_sample_abs':round(abs(v[0]),8),'last_sample_abs':round(abs(v[-1]),8),**ratios,'rms_envelope_5ms':[round(x,6)for x in envelope]}

def encode(v,path,codec='libvorbis'):
 path.parent.mkdir(parents=True,exist_ok=True)
 args=['-c:a',codec]+(['-q:a','5']if codec=='libvorbis'else ['-b:a','192k']if codec=='libmp3lame'else [])
 subprocess.run([A.ffmpeg,'-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','pipe:0',*args,str(path)],input=v.tobytes(),check=True)

rows=[]
for spec in SPEC:
 source=src(spec);assert source.is_file(),source
 original=pcm(source);peak=max(map(abs,original))
 start=round(spec['start']*SR) if spec['start'] is not None else max(0,next((i for i,x in enumerate(original)if abs(x)>peak*.012),0)-round(.004*SR))
 v=original[start:start+round(spec['length']*SR)]
 filters=f"highpass=f={spec['hp']}:p=2,lowpass=f={spec['lp']}:p=2"
 v=filtered(v,filters)
 attack=min(round(spec['attack']*SR),len(v)//4);release=min(round(spec['release']*SR),len(v)//2)
 for i in range(attack):v[i]*=.5-.5*math.cos(math.pi*i/max(1,attack-1))
 for i in range(release):v[len(v)-1-i]*=.5-.5*math.cos(math.pi*i/max(1,release-1))
 peak=max(map(abs,v));active=[x for x in v if abs(x)>peak*.03];ar=math.sqrt(sum(x*x for x in active)/len(active));gain=min(10**(spec['target']/20)/ar,10**(spec['peak']/20)/peak)
 v=array.array('f',(x*gain for x in v))
 destination=OUT/spec['file'];before=REVIEW/'before'/spec['file'];before.parent.mkdir(parents=True,exist_ok=True)
 if not before.exists():shutil.copy2(destination,before)
 target=destination if A.write else REVIEW/'proposed'/spec['file'];encode(v,target)
 after=REVIEW/'after'/spec['file'];after.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(target,after)
 decoded=pcm(target);metrics=measure(decoded)
 record={'file':spec['file'],'source':spec['source'],'source_file':str(source.relative_to(A.research)),'source_url':URLS[spec['pack']],'author':AUTHORS[spec['pack']],'license':'CC0-1.0','source_sha256':sha(source),'file_sha256':sha(target),'description':spec['description'],'changes':f"Excerpt {start/SR:.6f}–{(start+len(v))/SR:.6f}s; mono 44100Hz; {filters}; gain {gain:.8f}; {spec['attack']*1000:g}ms cosine onset and {release/SR*1000:.3f}ms cosine tail; Ogg Vorbis q5. Single source, no added layers/synthesis/pitch shift/nonlinear compression.",'analysis':metrics,'recipe':{**spec,'actual_start_seconds':start/SR,'gain':gain}}
 if spec['file'].startswith('contacts/'):record['material']=Path(spec['file']).stem[:-1]
 rows.append(record)
 assert metrics['clipped_samples']==0,(spec['file'],metrics['peak_dbfs'])
 print(spec['file'],metrics['duration_seconds'],metrics['peak_dbfs'],metrics['active_rms_dbfs'])

if A.write:
 contacts=[r for r in rows if r['file'].startswith('contacts/')]
 (OUT/'contacts/PROVENANCE.json').write_text(json.dumps(contacts,ensure_ascii=False,indent=2)+'\n')
 (OUT/'contacts/CREDITS.txt').write_text('soft15 material contacts — single-source short taps/pops. CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/\n\n'+'\n\n'.join(f"{r['file']}: {r['source']} — {r['author']} ({r['license']})\n{r['source_url']}\n{r['changes']}"for r in contacts)+'\n\nSource/metrics review only; no human hearing approval is claimed.\n')
 if not A.contacts_only:
  path=OUT/'REWARD-AUDIO-PROVENANCE.json';reward=json.loads(path.read_text())
  for r in reward:
   replacement=next((x for x in rows if x['file']==r['file']),None)
   if replacement:r.clear();r.update({'cue':Path(replacement['file']).stem,**replacement,'url':replacement['source_url']})
  path.write_text(json.dumps(reward,ensure_ascii=False,indent=2)+'\n')
  path=OUT/'COMBAT-AUDIO-PROVENANCE.json';combat=json.loads(path.read_text())
  for i,r in enumerate(combat['assets']):
   replacement=next((x for x in rows if x['file']==r['file']),None)
   if replacement:combat['assets'][i]={'id':Path(r['file']).stem,**replacement,'sha256':replacement['file_sha256'],'is_loop':False,'sample_rate_hz':SR,'channels':1,'duration_seconds':replacement['analysis']['duration_seconds'],'audition_status':'Revised after negative stage14 user feedback; objective validation only, not human listening approval.'}
  combat['revision']='soft15';path.write_text(json.dumps(combat,ensure_ascii=False,indent=2)+'\n')

# Repeat at identical schedule/gain, not runtime mixing. Distinct files are concatenated, never layered.
comparison=[]
for r in rows:
 before=measure(pcm(REVIEW/'before'/r['file']))
 comparison.append({'file':r['file'],'source':r['source'],'before':before,'after':r['analysis']})
report={'revision':'soft15','user_feedback':'stage14 level-up PIZZI07 disliked; ripping/breaking/distortion-like contact texture; palette needs cohesive paper-fairytale character. Root stress capture reported no numerical clipping, so this change does not claim to fix measured output clipping.','scope':len(rows),'limitations':'Objective waveform/source identity review, not subjective listening approval. Filter-band ratios are two-pole filter energy, not ideal FFT brick-wall bands. A/B montages use identical schedule and gain; no loudness normalization or runtime bus effects.','files':comparison}
(REVIEW/'comparison-analysis.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
(REVIEW/'new-source-ledger.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
order=['inspiration.ogg','giftPickup.ogg','softPickup.ogg','contacts/paper0.ogg','contacts/ink0.ogg','contacts/fire0.ogg','contacts/electric0.ogg','contacts/crush0.ogg','contacts/frost0.ogg','cut0.ogg','defeat0.ogg']
order=[f for f in order if any(r['file']==f for r in rows)]
for version in ['before','after']:
 montage=array.array('f');timeline=[]
 for f in order:
  clip=pcm(REVIEW/version/f);begin=len(montage)/SR
  # Fixed 1.6 s cue slot gives A/B the same timing even when the replacement is shorter.
  for repeat in range(3):
   take=clip[:round(1.4*SR)];montage.extend(x*.7 for x in take);montage.extend([0]*(round(1.6*SR)-len(take)))
  timeline.append({'file':f,'start_seconds':begin,'repeats':3});montage.extend([0]*round(.6*SR))
 encode(montage,REVIEW/f'{version}-repeated.mp3','libmp3lame')
 (REVIEW/f'{version}-timeline.json').write_text(json.dumps(timeline,indent=2)+'\n')
body=''.join(f'<tr><td>{html.escape(r["file"])}<small>{html.escape(r["source"])}</small></td><td><audio controls preload="none" src="before/{r["file"]}"></audio></td><td><audio controls preload="none" src="after/{r["file"]}"></audio></td></tr>'for r in rows)
(REVIEW/'audition.html').write_text('''<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>纸艺音色 A/B · soft15</title><style>body{font:15px/1.65 system-ui;background:#f4ecdd;color:#544657;max-width:1100px;margin:40px auto;padding:0 20px}h1{font-size:27px}p{max-width:780px}table{border-collapse:collapse;width:100%;background:#fff8eb}th,td{text-align:left;padding:12px;border-bottom:1px solid #ddcdd9}small{display:block;color:#897987}audio{max-width:100%;width:270px}.pair{display:flex;gap:30px;flex-wrap:wrap}code{font-size:12px}</style><h1>纸艺音色 · 前后对比</h1><p>根据 stage14 的听感差评，移除撕裂、碎裂与电噪声命中来源；升级改短上行拨弦。以下是候选成品对比，不代表人工听感已经通过。主线程原压力录音没有检测到数值削波，本次修改针对音色和瞬态。</p><div class="pair"><div><b>旧版 · 每项重复三次</b><br><audio controls src="before-repeated.mp3"></audio></div><div><b>新版 · 相同节奏、相同增益</b><br><audio controls src="after-repeated.mp3"></audio></div></div><p>顺序：升级、礼物、拾取、纸、墨、火、电、重击、冰、切割、击杀。每项占 5.4 秒。未对 A/B 单独归一化，也未模拟游戏混音链。</p><table><thead><tr><th>文件 / 新来源</th><th>旧版</th><th>新版</th></tr></thead><tbody>'''+body+'''</tbody></table><p>逐文件峰值、RMS、高频与包络：<a href="comparison-analysis.json">comparison-analysis.json</a>；作者、许可、来源与处理：<a href="new-source-ledger.json">new-source-ledger.json</a>。</p>''')
print('Wrote review:',REVIEW/'audition.html')
