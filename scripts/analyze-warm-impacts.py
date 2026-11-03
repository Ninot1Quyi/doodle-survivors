"""Compare the former layered pencil hit and new single mastered contact, pre mix bus."""
import argparse,array,json,math,subprocess
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--ffmpeg',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parent.parent;sr=48000;ffmpeg=args.ffmpeg
def decode(path):
 raw=subprocess.run([ffmpeg,'-v','error','-i',str(path),'-ac','1','-ar',str(sr),'-f','f32le','pipe:1'],stdout=subprocess.PIPE,check=True).stdout
 a=array.array('f');a.frombytes(raw);return a
def stats(a):
 energy=sum(v*v for v in a);raw=subprocess.run([ffmpeg,'-v','error','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-af','highpass=f=4000:poles=2','-f','f32le','pipe:1'],input=a.tobytes(),stdout=subprocess.PIPE,check=True).stdout
 high=array.array('f');high.frombytes(raw);return {'peak':max(map(abs,a)),'rms':math.sqrt(energy/len(a)),'above4kEnergyRatio':sum(v*v for v in high)/energy}
def render(layers,volume,boost,tail,mastered=False):
 result=array.array('f',[0])*round(sr*.35)
 for key,mix,rate in layers:
  data=decode(root/'public/audio'/key);peak=max(map(abs,data));end=data[:round(sr*.22)];rms=math.sqrt(sum(v*v for v in end)/len(end));gain=1 if mastered else min(3.5,max(.4,min(.75/max(peak,.001),.16/max(rms,.005))));duration=min(len(data)/sr/rate,tail);attack=.0008;decayStart=max(.006,duration*.28);decayEnd=max(.025,duration+.035)
  for i in range(min(len(result),round(sr*(duration+.045)))):
   pos=i*rate;k=int(pos)
   if k+1>=len(data):break
   t=i/sr;envelope=min(1,t/attack) if t<decayStart else math.exp(math.log(.0001/max(volume*mix*boost*gain,.001))*(t-decayStart)/(decayEnd-decayStart))
   result[i]+=(data[k]*(1-(pos-k))+data[k+1]*(pos-k))*volume*mix*boost*gain*envelope
 return result
rows=[]
for i in range(3):
 old=render([(f'snap{i}.ogg',.85,1.12),(f'wood{i}.ogg',.65,1.08),(f'body{i}.ogg',.48,1.04)],.36,1.05,.14)
 new=render([(f'warmHit{i}.ogg',1,1.04)],.4,1,.145,True)
 rows.append({'variant':i,'oldLayeredPencil':stats(old),'newPremixedPencil':stats(new)})
report={'note':'Deterministic offline cue rendering before WebAudio SFX bus/compression. Ratios measure energy after a 4 kHz two-pole high-pass; not a perceptual listening rating.','rows':rows,'newSamples':json.loads((root/'public/audio/WARM-IMPACT-PROVENANCE.json').read_text())['samples']}
(root/'qa/warm-impact-spectrum.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(rows,indent=2))
