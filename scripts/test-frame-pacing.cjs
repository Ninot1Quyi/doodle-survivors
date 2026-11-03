const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/../public/game.js','utf8');
const start=source.indexOf("const frameSchedule={");
const end=source.indexOf('function frame(now)',start);
assert(start>=0&&end>start,'load the production scheduler rather than a test copy');
const context=vm.createContext({});vm.runInContext(source.slice(start,end),context);
const ready=(time,mode='playing')=>vm.runInContext(`frameReady(${time},${JSON.stringify(mode)})`,context);
const reset=()=>vm.runInContext('resetFrameSchedule()',context);
const times=(hz,seconds,jitter=0)=>Array.from({length:hz*seconds},(_,i)=>(i+1)*1000/hz+Math.sin(i*1.77)*jitter);
function oldReplay(input,mode='playing'){const interval=1000/(mode==='menu'?30:60);let last=0;return input.filter(now=>{if(now-last<interval-.6)return false;last=now-((now-last)%interval);return true;});}
function replay(input,mode='playing'){reset();return input.filter(now=>ready(now,mode));}
function stats(output){const gaps=output.slice(1).map((t,i)=>t-output[i]);return{rendered:output.length,gapsAbove25ms:gaps.filter(t=>t>25).length,maxGapMs:+Math.max(...gaps).toFixed(3)};}
const result={note:'Deterministic synthetic rAF timestamp replay; not measured browser/device FPS.',rows:[]};
for(const hz of [60,90,120,144]){const input=times(hz,10,1.2),after=replay(input),before=oldReplay(input);assert(after.length>=599&&after.length<=601,`${hz} Hz should schedule about 600 renders in 10 seconds`);if(hz===60){assert.equal(after.length,600,'small timestamp jitter must not drop a 60 Hz callback');assert.equal(stats(after).gapsAbove25ms,0);}result.rows.push({inputHz:hz,jitterMs:1.2,before:stats(before),after:stats(after)});}
for(const hz of [60,90,120,144]){const input=times(hz,10,1.2),out=replay(input,'menu');assert(out.length>=299&&out.length<=301,'menu remains 30 Hz, including on faster displays');}
reset();assert(ready(10));assert(!ready(11),'same-deadline repeated callback cannot render twice');assert(ready(1000),'a stall renders once');assert(!ready(1001),'a stall does not cause a catch-up burst');assert(ready(1017));
reset();assert(ready(100,'menu'));assert(ready(101,'playing'),'switching to gameplay is immediate');assert(!ready(102,'playing'));reset();assert(ready(10000,'playing'),'resume uses a fresh deadline');assert(!ready(10001),'resume must not replay a background backlog');
// The live main-loop must reset both when hidden and in inactive screens.
assert(source.includes('if(document.hidden){last=now;resetFrameSchedule();return;}'));
assert(source.includes('if(!active){last=now;resetFrameSchedule();'));
assert(!source.includes('lastRenderAt'),'remove the obsolete modulo clock entirely');
console.log(JSON.stringify(result,null,2));
fs.writeFileSync(__dirname+'/../qa/performance-frame-pacing.json',JSON.stringify(result,null,2)+'\n');
console.log('PASS: jitter, high refresh cap, menu pacing, stalls, mode switches, visibility reset, no duplicate frames.');
