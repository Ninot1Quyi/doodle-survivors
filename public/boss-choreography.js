'use strict';
// Boss actions own their locked aim, telegraph and collision geometry. No camera state.
const BOSS_CHOREOGRAPHY = Object.freeze({
 bossRose:[['荆棘花圃','disk'],['花瓣风轮','wave'],['藤蔓横剪','sweep'],['玫瑰箭雨','volley']],
 bossCrab:[['双钳夹击','disk'],['横行冲刺','rush'],['钳刃横扫','sweep'],['饼干碎浪','wave']],
 bossOwl:[['羽页齐射','volley'],['月读光束','beam'],['落羽书阵','disk'],['展翼旋斩','sweep']],
 bossClock:[['分针扫射','sweep'],['整点钟波','wave'],['时轨光束','beam'],['发条弹幕','volley']],
 bossMoon:[['月蚀光束','beam'],['月相陨落','disk'],['弦月涟漪','wave'],['流星突进','rush']]
});
const BOSS_CHOREOGRAPHY_COLORS={bossRose:'#dca6c3',bossCrab:'#e4aa96',bossOwl:'#c3b3d8',bossClock:'#d5bd91',bossMoon:'#b1c5e3'};
function bossChoreographyProfile(e){return BOSS_CHOREOGRAPHY[e.kind]||BOSS_CHOREOGRAPHY[({bossFrog:'bossCrab',bossCloud:'bossMoon',bossSerpent:'bossRose'})[e.kind]||'bossClock'];}
function bossChoreographyActive(){return typeof state==='undefined'||state==='playing'||state==='menu';}
function resetBossChoreography(){if(!game)return;game.bossChoreography={objects:[],serial:0};game.enemyBullets=(game.enemyBullets||[]).filter(b=>!b.bossOwner);for(const e of game.enemies||[])delete e.choreography;if(typeof Sound!=='undefined')Sound.sustain?.('bossLaser',0);}
function bossChoreographySound(e,phase){if(typeof Sound!=='undefined')Sound.bossAction?.(e.kind,phase);}
function bossCombatBehavior(e,dt,dx,dy,d){
 if(!e.boss)return false;
 if(!game.bossChoreography)resetBossChoreography();
 if(!e.choreography){e.intent=null;e.chargeAttack=null;e.leapLife=0;e.choreography={phase:'approach',age:0,duration:1.05,turn:0,rage:false,action:null};}
 return true;
}
function bossChoreographyBegin(e){
 const q=e.choreography,rage=e.hp<e.maxHp*.5;
 if(rage&&!q.rage){q.rage=true;bossChoreographySound(e,'rage');}
 const roster=bossChoreographyProfile(e),index=(q.turn+(q.rage?1:0))%roster.length,[name,type]=roster[index];q.turn++;
 const h=game.hero,a=Math.atan2(h.y-e.y,h.x-e.x),reach=Math.min(390,Math.hypot(h.x-e.x,h.y-e.y));
 const windup=type==='beam'?1.2:type==='rush'?1.1:type==='disk'?1.05:.95;
 const duration=({beam:1.45,sweep:1.65,wave:1.8,disk:.65,volley:.55,rush:.65})[type];
 const o={owner:e,kind:e.kind,name,type,x:e.x,y:e.y,a,angle:a,age:-windup,windup,duration,rage:q.rage,color:BOSS_CHOREOGRAPHY_COLORS[e.kind]||'#bca1d0',damage:Math.min(28,e.damage||20),length:type==='rush'?Math.max(130,Math.min(330,reach+75)):480,width:type==='rush'?e.r+5:15,r:type==='sweep'?225:q.rage?310:285,spread:type==='sweep'?(q.rage?1.7:1.4):.95,gap:.78,hitClock:0,emitted:false,spots:[]};
 if(type==='disk'){
  // Every impact site is frozen before the first warning frame; none track the player.
  const tx=e.x+Math.cos(a)*reach,ty=e.y+Math.sin(a)*reach,n=q.rage?5:3;
  for(let i=0;i<n;i++){const off=i-(n-1)/2;o.spots.push({x:tx+Math.cos(a+Math.PI/2)*off*103,y:ty+Math.sin(a+Math.PI/2)*off*103,r:q.rage?56:51,delay:0});}
 }
 if(type==='volley'){o.count=q.rage?9:7;o.spread=q.rage?1.65:1.35;o.length=450;o.width=7;}
 q.phase='windup';q.age=0;q.duration=windup;q.action=o;e.intent=null;e.kx=0;e.ky=0;
 if(game.bossChoreography.objects.length<24)game.bossChoreography.objects.push(o);
 else {q.phase='recover';q.duration=.9;q.action=null;}
 bossChoreographySound(e,'tell');
}
function bossChoreographySegment(p,x,y,a,length){const dx=p.x-x,dy=p.y-y,t=Math.max(0,Math.min(length,dx*Math.cos(a)+dy*Math.sin(a)));return Math.hypot(dx-Math.cos(a)*t,dy-Math.sin(a)*t);}
function bossChoreographyAngle(a){return Math.atan2(Math.sin(a),Math.cos(a));}
function bossChoreographyGeometry(o,age=o.age){
 const u=Math.max(0,Math.min(1,age/o.duration));
 return {u,a:o.type==='sweep'?o.a-o.spread/2+o.spread*u:o.a,r:o.type==='wave'?35+(o.r-35)*u:o.r};
}
function bossChoreographyContains(o,p,age=o.age){
 if(age<0||age>=o.duration)return false;
 const g=bossChoreographyGeometry(o,age),rr=p.r||0;
 if(o.type==='disk')return o.spots.some(s=>Math.hypot(p.x-s.x,p.y-s.y)<=s.r+rr);
 if(o.type==='beam')return bossChoreographySegment(p,o.x,o.y,o.a,o.length)<=o.width+rr;
 if(o.type==='sweep')return bossChoreographySegment(p,o.x,o.y,g.a,o.r)<=13+rr;
 if(o.type==='wave'){const a=Math.atan2(p.y-o.y,p.x-o.x);return Math.abs(bossChoreographyAngle(a-(o.a+Math.PI)))>o.gap/2&&Math.abs(Math.hypot(p.x-o.x,p.y-o.y)-g.r)<=12+rr;}
 if(o.type==='rush'){const prev=Math.max(0,Math.min(1,(age-(o.lastDt||0))/o.duration));return bossChoreographySegment(p,o.x+Math.cos(o.a)*o.length*prev,o.y+Math.sin(o.a)*o.length*prev,o.a,o.length*(g.u-prev))<=o.width+rr;}
 return false; // Volley damage belongs to the normal enemy projectile step.
}
function bossChoreographyVolley(o){
 for(let i=0;i<o.count&&game.enemyBullets.length<130;i++){
  const a=o.a+(i-(o.count-1)/2)*o.spread/(o.count-1),speed=o.rage?175:150;
  game.enemyBullets.push({id:game.enemyShotSerial++,bossOwner:o.owner,guard:2,x:o.x,y:o.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:7,life:3,color:'#e14755'});
 }
}
function updateBossChoreography(dt){
 if(!game?.bossChoreography)return;
 const b=game.bossChoreography;
 // Remove both effects and fired projectiles even on the frame their owner dies.
 b.objects=b.objects.filter(o=>o.owner.hp>0&&game.enemies.includes(o.owner));
 game.enemyBullets=game.enemyBullets.filter(o=>!o.bossOwner||(o.bossOwner.hp>0&&game.enemies.includes(o.bossOwner)));
 if(!bossChoreographyActive()||!(dt>0)||!Number.isFinite(dt)||game.buffs?.freeze>0){if(typeof Sound!=='undefined')Sound.sustain?.('bossLaser',0);return;}
 dt=Math.min(dt,.1);
 for(const e of game.enemies){
  const q=e.choreography;if(!q||e.hp<=0)continue;
  q.age+=dt;
  if(q.phase==='approach'){
   const dx=game.hero.x-e.x,dy=game.hero.y-e.y,d=Math.hypot(dx,dy);
   if(d>240){const move=Math.min(d-240,(e.speed||25)*1.1*dt);e.x+=dx/d*move;e.y+=dy/d*move;}
   if(q.age>=q.duration)bossChoreographyBegin(e);
  }else if(q.phase==='windup'&&q.age>=q.duration){q.phase='cast';q.age=0;q.duration=q.action.duration;q.action.age=0;bossChoreographySound(e,'cast');}
  else if(q.phase==='cast'&&q.age>=q.duration){if(q.action.type==='rush'){const o=q.action;e.x=o.x+Math.cos(o.a)*o.length;e.y=o.y+Math.sin(o.a)*o.length;}q.phase='recover';q.age=0;q.duration=q.rage?.85:1.1;q.action=null;}
  else if(q.phase==='recover'&&q.age>=q.duration){q.phase='approach';q.age=0;q.duration=q.rage?.4:.65;}
 }
 let laser=false;
 for(const o of b.objects){
  const q=o.owner.choreography;
  // The action clock is the sole authority for windup/cast visual and damage timing.
  if(q.action===o)o.age=q.phase==='windup'?q.age-o.windup:q.age;else o.age=o.duration;
  if(o.age<0||o.age>=o.duration)continue;
  o.lastDt=dt;
  if(!o.emitted){o.emitted=true;bossChoreographySound(o.owner,'impact');if(o.type==='volley')bossChoreographyVolley(o);}
  if(o.type==='rush'){const u=bossChoreographyGeometry(o).u;o.owner.x=o.x+Math.cos(o.a)*o.length*u;o.owner.y=o.y+Math.sin(o.a)*o.length*u;}
  if(o.type==='beam')laser=true;
  o.hitClock-=dt;if(o.hitClock<=0&&bossChoreographyContains(o,game.hero)){playerHurt(o.damage,o.x,o.y);o.hitClock=.28;}
 }
 b.objects=b.objects.filter(o=>o.age<o.duration);
 if(typeof Sound!=='undefined')Sound.sustain?.('bossLaser',laser?.3:0);
}
function bossChoreographyPose(e){
 const q=e.choreography;if(!q||q.phase==='approach')return {sx:1,sy:1,tilt:0,lift:0};
 const u=Math.min(1,q.age/q.duration),reduced=typeof reducedEffects!=='undefined'&&reducedEffects,m=reduced?.3:1;
 if(q.phase==='windup')return {sx:1+.07*u*m,sy:1-.09*u*m,tilt:Math.sin(u*Math.PI)*.045*m,lift:-4*u*m};
 if(q.phase==='cast')return {sx:1-.055*Math.sin(u*Math.PI)*m,sy:1+.1*Math.sin(u*Math.PI)*m,tilt:-.06*Math.sin(u*Math.PI)*m,lift:9*Math.sin(u*Math.PI)*m};
 return {sx:1+.025*(1-u)*m,sy:1-.04*(1-u)*m,tilt:.025*(1-u)*m,lift:0};
}
function bossChoreographyPath(o,warning=false){
 const g=bossChoreographyGeometry(o),t=Math.PI*2;ctx.beginPath();
 if(o.type==='disk'){for(const s of o.spots){ctx.moveTo(s.x+s.r,s.y);ctx.arc(s.x,s.y,s.r,0,t);}return;}
 if(o.type==='wave'){
  // The missing sector is a real safe route, both in preview and the active ring.
  const r=warning?o.r:g.r;ctx.arc(o.x,o.y,r,o.a+Math.PI+o.gap/2,o.a+Math.PI+t-o.gap/2);return;
 }
 if(o.type==='sweep'&&warning){ctx.moveTo(o.x,o.y);ctx.arc(o.x,o.y,o.r,o.a-o.spread/2,o.a+o.spread/2);ctx.closePath();return;}
 if(o.type==='volley'){for(let i=0;i<o.count;i++){const a=o.a+(i-(o.count-1)/2)*o.spread/(o.count-1);ctx.moveTo(o.x,o.y);ctx.lineTo(o.x+Math.cos(a)*o.length,o.y+Math.sin(a)*o.length);}return;}
 if(o.type==='rush'&&!warning){const u0=Math.max(0,(o.age-(o.lastDt||0))/o.duration),u1=g.u;ctx.moveTo(o.x+Math.cos(o.a)*o.length*u0,o.y+Math.sin(o.a)*o.length*u0);ctx.lineTo(o.x+Math.cos(o.a)*o.length*u1,o.y+Math.sin(o.a)*o.length*u1);return;}
 const a=o.type==='sweep'?g.a:o.a,l=o.type==='sweep'?o.r:o.length;
 ctx.moveTo(o.x,o.y);ctx.lineTo(o.x+Math.cos(a)*l,o.y+Math.sin(a)*l);
}
function renderBossChoreography(){
 if(!game?.bossChoreography)return;
 const reduced=typeof reducedEffects!=='undefined'&&reducedEffects;
 for(const o of game.bossChoreography.objects){
  const warning=o.age<0;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(warning){
   ctx.setLineDash([8,6]);ctx.strokeStyle='#c73d52';ctx.lineWidth=2.5;ctx.globalAlpha=.75;
   if(o.type==='beam'||o.type==='rush'){bossChoreographyPath(o,true);ctx.lineWidth=o.width*2;ctx.globalAlpha=.13;ctx.stroke();ctx.lineWidth=2.5;ctx.globalAlpha=.9;const nx=-Math.sin(o.a)*o.width,ny=Math.cos(o.a)*o.width;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(o.x+nx*side,o.y+ny*side);ctx.lineTo(o.x+Math.cos(o.a)*o.length+nx*side,o.y+Math.sin(o.a)*o.length+ny*side);ctx.stroke();}}
   else {bossChoreographyPath(o,true);if(o.type==='disk'||o.type==='sweep'){ctx.fillStyle='#d94a60';ctx.globalAlpha=.09;ctx.fill();ctx.globalAlpha=.8;}ctx.stroke();}
   ctx.setLineDash([]);ctx.fillStyle='#a33449';ctx.globalAlpha=.92;ctx.font='bold 13px "PaperHand",sans-serif';ctx.textAlign='center';ctx.fillText(o.name,o.owner.x,o.owner.y-o.owner.r*2-28);
  }else if(o.type!=='volley'){
   if(o.type==='disk'&&typeof BossChoreographyArt!=='undefined')BossChoreographyArt.attack(ctx,{...o,angle:o.a,reduced});
   else if(o.type==='beam'&&typeof KineticArt!=='undefined')KineticArt.beam(ctx,{x:o.x,y:o.y,x2:o.x+Math.cos(o.a)*o.length,y2:o.y+Math.sin(o.a)*o.length,width:o.width*2,age:o.age,color:o.color,reduced});
   bossChoreographyPath(o);ctx.strokeStyle='#c73d52';ctx.lineWidth=o.type==='disk'?2.5:o.type==='wave'?24:o.type==='rush'||o.type==='beam'?o.width*2:26;ctx.globalAlpha=o.type==='disk'?.9:.58;ctx.stroke();
   if(o.type!=='disk'){ctx.strokeStyle=o.color;ctx.lineWidth=o.type==='wave'?17:o.type==='rush'?o.width*2-6:20;ctx.globalAlpha=.9;ctx.stroke();ctx.strokeStyle='#fff1ce';ctx.lineWidth=3;ctx.stroke();}
  }
  ctx.restore();
 }
 if(typeof BossChoreographyArt!=='undefined')for(const e of game.enemies){const q=e.choreography;if(e.hp>0&&q&&q.phase!=='approach')BossChoreographyArt.pose(ctx,{kind:e.kind,x:e.x,y:e.y,phase:q.phase,progress:q.age/q.duration,scale:.72,facing:e.facing||1,reduced});}
}
