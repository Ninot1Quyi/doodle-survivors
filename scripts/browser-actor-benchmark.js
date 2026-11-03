// Rejected shadow-cache experiment. Production retains the original shadow drawing.
// Evaluate only in an isolated QA tab; does not run until qaActorBenchmark() is called.
// Fixed scene and DPR. Real requestAnimationFrame intervals include browser raster work.
window.qaActorBenchmark=async function(rounds=2,frames=180){
 const originalActor=renderActor,oldRandom=Math.random,originalState=state,oldScale=renderScale;
 const shadowCache=new Map();let pixels=0;
 function getActorCacheStats(){return{shadows:shadowCache.size,pixels,limit:1800000};}
 function cachedShadow(name,s){let c=shadowCache.get(name);if(c)return c;const ratio=1.5,pad=2,left=-s.w*.5,top=-s.h*.36,w=Math.ceil((s.w+s.h*.72)*ratio)+4,h=Math.ceil(s.h*.36*ratio)+4;if(pixels+w*h>1800000)return null;const img=document.createElement('canvas');img.width=w;img.height=h;const g=img.getContext('2d');g.setTransform(ratio,0,0,ratio,pad-left*ratio,pad-top*ratio);g.transform(1,0,-.72,.36,0,0);g.drawImage(shadowImages[name],-s.w/2,-s.h,s.w,s.h);c={img,x:left-pad/ratio,y:top-pad/ratio,w:w/ratio,h:h/ratio};shadowCache.set(name,c);pixels+=w*h;return c;}
 function optimized(name,e,scale,flip,hero=false){const s=Art.sprites[name];if(!s)return;const pose=actorPose(e,hero),shadow=cachedShadow(name,s),ss=scale*(1-pose.lift*.009);ctx.save();if(shadow){ctx.globalAlpha=hero?.18:.14;ctx.drawImage(shadow.img,e.x+shadow.x*ss,e.y+shadow.y*ss,shadow.w*ss,shadow.h*ss);}else castShadow(name,e.x,e.y,ss,hero?.18:.14);ctx.translate(e.x,e.y-pose.lift);ctx.rotate(pose.tilt);ctx.scale(flip*pose.sx,pose.sy);ctx.globalAlpha=hero&&e.inv>0?.55+.45*Math.sin(game.t*30)**2:e.kind==='ghost'?.86:1;ctx.drawImage(s.img,-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);if(!hero&&e.hitFlash>0&&flashImages[name]){ctx.globalAlpha=e.hitFlash/.1*.65;ctx.drawImage(flashImages[name],-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);}ctx.restore();}

 function legacy(name,e,scale,flip,hero=false){const s=Art.sprites[name];if(!s)return;const pose=actorPose(e,hero);castShadow(name,e.x,e.y,scale*(1-pose.lift*.009),hero?.18:.14);ctx.save();ctx.translate(e.x,e.y-pose.lift);ctx.rotate(pose.tilt);ctx.scale(flip*pose.sx,pose.sy);ctx.globalAlpha=hero&&e.inv>0?.55+.45*Math.sin(game.t*30)**2:e.kind==='ghost'?.86:1;ctx.drawImage(s.img,-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);if(!hero&&e.hitFlash>0&&flashImages[name]){ctx.globalAlpha=e.hitFlash/.1*.65;ctx.drawImage(flashImages[name],-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);}ctx.restore();}
 const results=[];
 try{for(let round=0;round<rounds;round++)for(const cached of round%2?[true,false]:[false,true]){
  let seed=41;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  makeRun('action');state='qa';game.hero.hp=game.hero.maxHp=1e8;game.hero.inv=99;game.need=1e10;game.t=240;game.enemies=[];game.spawnClock=game.advancedSpawnClock=game.advancedEliteClock=1e7;game.completedEvents=new Set(worldEvents.map(e=>e.id));
  for(let k in game.weapons)game.weapons[k]=0;Object.assign(game.weapons,{comet:5,garden:5,aurora:5,tempest:5,nova:5,dragon:5,mirror:5,book:5});
  for(let i=0;i<230;i++){let a=i*TAU/230,r=180+(i%8)*35;spawnEnemy(['snail','imp','beetle','ghost','jelly'][i%5],Math.cos(a)*r,70+Math.sin(a)*r*.7);game.enemies.at(-1).hp=game.enemies.at(-1).maxHp=1e7;}
  renderScale=1.25;resize();renderActor=cached?optimized:legacy;
  // Warm one second so JIT, sprite upload, and lazy caches are not mistaken for steady-state work.
  for(let i=0;i<60;i++){state='playing';update(1/60);state='qa';render();}
  const row=await new Promise(resolve=>{let n=0,last=0,work=[],intervals=[],begin=performance.now();function sample(now){if(last)intervals.push(now-last);last=now;let t=performance.now();game.hero.inv=99;state='playing';update(1/60);state='qa';render();work.push(performance.now()-t);if(++n<frames)requestAnimationFrame(sample);else{work.sort((a,b)=>a-b);intervals.sort((a,b)=>a-b);const percentile=(list,p)=>list[Math.min(list.length-1,Math.floor(list.length*p))];resolve({cached,frames,wallMs:performance.now()-begin,workMedian:percentile(work,.5),workP95:percentile(work,.95),workMean:work.reduce((a,b)=>a+b,0)/work.length,intervalMedian:percentile(intervals,.5),intervalP95:percentile(intervals,.95),enemies:game.enemies.length,canvasPixels:canvas.width*canvas.height,cache:getActorCacheStats()});}}requestAnimationFrame(sample);});results.push(row);
 }}finally{renderActor=originalActor;Math.random=oldRandom;renderScale=oldScale;resize();state='qa';}
 return{note:'Independent controlled browser QA. High-HP enemies; not ordinary gameplay or phone evidence.',results};
};
