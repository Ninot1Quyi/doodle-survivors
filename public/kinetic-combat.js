'use strict';
// Simulation-timed sequences pause with the world and are discarded on a new run.
function queueKinetic(kind,delay,data){game.kineticQueue||=[];if(game.kineticQueue.length<80)game.kineticQueue.push({kind,left:delay,...data});}
function updateKinetic(dt){
 const p=game.hero;game.kineticQueue||=[];
 for(const q of game.kineticQueue){q.left-=dt;if(q.left>0||q.done)continue;q.done=true;
  if(q.kind==='pencil'){
   if(!game.weapons.pencil)continue;const e=selectWeaponTarget('pencil:'+q.index,p.x,p.y-24,650,null,q.damage,'pencil');if(!e)continue;
   const a=Math.atan2(e.y-(p.y-24),e.x-p.x),side=q.index%2?1:-1;
   const b=fireBullet('pencil',p.x-Math.sin(a)*side*10,p.y-24+Math.cos(a)*side*10,a,590,q.damage,q.pierce);if(b){b.volley=q.index;b.tint=PIGMENTS[q.index%5];}
   game.fx.push({type:'pencilmuzzle',x:p.x+Math.cos(a)*17,y:p.y-24+Math.sin(a)*17,r:18,life:.18,max:.18,color:PIGMENTS[q.index%5],angle:a,seed:q.index});Sound.play('pencil',.24,1,.04);
  }else if(q.kind==='lightning'){
   let e=game.enemies.find(e=>e.id===q.target&&e.hp>0);if(!e)e=nearest(q.x,q.y,180,q.used);if(!e)continue;q.used.add(e.id);
   game.fx.push(q.first?{type:'bolt',x:e.x,y:e.y,life:.4,max:.4,seed:e.id,width:5}:{type:'chain',x:q.x,y:q.y,x2:e.x,y2:e.y,life:.25,max:.25,seed:e.id});
   addParryPulse(e.x,e.y,34);hit(e,q.damage,q.x,q.y,70,false,'erase',{weapon:'lightning'});Sound.play('lightning',.28,1,.09);
   if(q.hops>0){const n=nearest(e.x,e.y,q.range,q.used);if(n)queueKinetic('lightning',.075,{x:e.x,y:e.y,target:n.id,used:q.used,damage:q.damage*.88,hops:q.hops-1,range:q.range});}
  }else if(q.kind==='inkEcho'){
   if(!game.weapons.ink)continue;explode(q.x,q.y,q.r,q.damage,q.color,'soak');
  }
 }
 compact(game.kineticQueue,q=>!q.done);
 // Shared sustain follows visible beam lifetime. Zero beams releases the loop immediately.
 const beams=game.constructs.filter(o=>o.mode==='beam'&&o.life>0&&o.age>=o.delay&&visible(o.x,o.y,o.r));
 Sound.sustain?.('laser',beams.length?Math.min(.42,.20+beams.length*.035):0);
 const key=biomeAt(p.x,p.y).key;Sound.biome?.(key,dt);
}
function castCoreWeapons(dt){
 const p=game.hero,w=game.weapons,c=game.clocks;
 if(w.pencil&&c.pencil<=0&&nearest(p.x,p.y,650)){c.pencil=Math.max(.42,.84-w.pencil*.055);for(let i=0;i<w.pencil+2;i++)queueKinetic('pencil',i*.055,{index:i,damage:15+w.pencil*3.8,pierce:1+Math.floor(w.pencil/3)});}
 if(w.lightning&&c.lightning<=0){c.lightning=2.6-w.lightning*.2;let used=new Set();for(let i=0;i<1+Math.ceil(w.lightning/2);i++){const e=selectWeaponTarget('lightning:'+i,p.x,p.y,650,used,30+w.lightning*10,'lightning');if(!e)break;used.add(e.id);queueKinetic('lightning',i*.16,{first:true,x:e.x,y:e.y-180,target:e.id,used,damage:30+w.lightning*10,hops:2+Math.floor(w.lightning/2),range:160+w.lightning*18});}}
 if(w.tornado&&c.tornado<=0){c.tornado=5.8-w.tornado*.38;const e=selectWeaponTarget('tornado',p.x,p.y,650,null,45),a=e?Math.atan2(e.y-p.y,e.x-p.x):game.t;for(let i=0;i<1+Math.floor(w.tornado/2);i++){const aa=a+(i-Math.floor(w.tornado/2)/2)*.7;game.tornadoes.push({x:p.x+Math.cos(aa)*45,y:p.y+Math.sin(aa)*45,vx:Math.cos(aa)*110,vy:Math.sin(aa)*110,life:5.2,max:5.2,r:55+w.tornado*8,phase:i*2,seek:.2});}Sound.play('tornado',.25,1,.7);}
 if(w.fire&&c.fire<=0){const e=selectWeaponTarget('fire',p.x,p.y-25,650,null,24+w.fire*12);if(e){c.fire=1.9-w.fire*.15;const a=Math.atan2(e.y-(p.y-25),e.x-p.x);for(let i=0;i<w.fire;i++){const b=fireBullet('fire',p.x,p.y-25,a+(i-(w.fire-1)/2)*.22,140,24+w.fire*12,1);if(b){b.ignite=true;b.max=2.3;}}game.fx.push({type:'kineticCharge',x:p.x,y:p.y-24,r:38,life:.3,max:.3,color:'#e9b568'});Sound.play('fire',.2,1,.13);}}
 if(w.scissors&&c.scissors<=0){c.scissors=2.8-w.scissors*.17;const target=nearest(p.x,p.y,650),a=target?Math.atan2(target.y-p.y+24,target.x-p.x):game.t;for(let i=0;i<2+w.scissors;i++){const aa=a+(i-(1+w.scissors)/2)*.36,b=fireBullet('scissors',p.x,p.y-24,aa,340,20+w.scissors*6,12);if(b){b.returnCut=true;b.life=b.max=1.55;b.side=i%2?1:-1;}}Sound.play('scissors',.24,1,.25);}
 if(w.ink&&c.ink<=0){const e=selectWeaponTarget('ink',p.x,p.y-25,550,null,32+w.ink*13);if(e){c.ink=3.9-w.ink*.22;game.fx.push({type:'lob',x:p.x,y:p.y-25,x2:e.x,y2:e.y,life:.6,max:.6,r:78+w.ink*16,damage:32+w.ink*13,inkBloom:true});Sound.play('ink',.18,1,.2);}}
 updateBookOrbit();updateKinetic(dt);
}
function kineticProjectile(b,dt){
 if(b.returnCut){const age=b.max-b.life;if(age>.63){if(!b.returning){b.returning=true;b.hit.clear();Sound.play('scissors',.2,1.1,.25);}const p=game.hero,a=Math.atan2(p.y-24-b.y,p.x-b.x);b.vx=Math.cos(a)*430;b.vy=Math.sin(a)*430;if(age>.85&&Math.hypot(b.x-p.x,b.y-p.y+24)<22)b.life=0;}else{const a=Math.atan2(b.vy,b.vx)+b.side*dt*.8;b.vx=Math.cos(a)*340;b.vy=Math.sin(a)*340;}}
 if(b.ignite){const speed=Math.min(550,Math.hypot(b.vx,b.vy)+dt*550),a=Math.atan2(b.vy,b.vx);b.vx=Math.cos(a)*speed;b.vy=Math.sin(a)*speed;}
}
function kineticInkBloom(f){for(let i=0;i<3;i++){const a=i*TAU/3;queueKinetic('inkEcho',.13+i*.08,{x:f.x2+Math.cos(a)*f.r*.65,y:f.y2+Math.sin(a)*f.r*.65,r:f.r*.5,damage:f.damage*.24,color:['#bca4dc','#9cc9d6','#d8adc8'][i]});}}
function renderKineticEffect(f){
 if(f.type!=='kineticCharge')return false;
 KineticArt.eruption(ctx,{x:f.x,y:f.y,r:f.r,age:f.max-f.life,duration:f.max,color:f.color,reduced:reducedEffects});return true;
}
