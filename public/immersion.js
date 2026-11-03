'use strict';
function updateBookOrbit(){
 const p=game.hero,lv=game.weapons.book,n=lv?lv+1:0;
 game.orbit.length=n;
 const soundCycle=Math.floor(game.t*(2+lv*.15)/Math.PI);if(n&&state==='playing'&&soundCycle!==game.bookSoundCycle){game.bookSoundCycle=soundCycle;Sound.play('book',.22,1,.5);}
 for(let i=0;i<n;i++){
  const a=game.t*(2+lv*.15)+i*TAU/n,b=game.orbit[i]||(game.orbit[i]={});
  const sweep=Math.max(0,Math.sin(game.t*2.4));Object.assign(b,{a,rx:76+lv*8+sweep*48,ry:48+lv*6+sweep*30,cx:p.x,cy:p.y-31,sweep});
  b.x=b.cx+Math.cos(a)*b.rx;b.y=b.cy+Math.sin(a)*b.ry;
 }
}
function drawCenteredSprite(name,x,y,scale,angle=0,alpha=1){
 const s=Art.sprites[name];if(!s)return;
 PaperCamera.upright(ctx,x,y,()=>{ctx.rotate(angle);ctx.globalAlpha=alpha;
 ctx.drawImage(s.img,-s.w*scale/2,-s.h*scale/2,s.w*scale,s.h*scale);});
}
function renderLoosePage(x,y,size,angle,fold,alpha=1){
 PaperCamera.upright(ctx,x,y,()=>{ctx.rotate(angle);ctx.globalAlpha*=alpha;
 const w=size,h=size*.72,curve=Math.sin(fold)*h*.45;
 ctx.beginPath();ctx.moveTo(-w,-h);ctx.quadraticCurveTo(0,-h+curve,w,-h*.8);ctx.lineTo(w*.82,h);ctx.quadraticCurveTo(0,h+curve,-w*.9,h*.8);ctx.closePath();ctx.fillStyle='#eee0bc';ctx.fill();ctx.strokeStyle='#947a9c';ctx.lineWidth=.9;ctx.stroke();
 ctx.beginPath();ctx.moveTo(w,-h*.8);ctx.lineTo(w*.5,-h*.4);ctx.lineTo(w*.82,h);ctx.closePath();ctx.fillStyle='#b4a0c7';ctx.fill();
 ctx.beginPath();ctx.moveTo(-w*.9,-h*.9);ctx.quadraticCurveTo(0,-h*.9+curve,w*.52,-h*.7);ctx.lineTo(w*.45,-h*.3);ctx.quadraticCurveTo(-w*.1,-h*.5+curve,-w*.85,-h*.5);ctx.closePath();ctx.fillStyle='#fff3d6';ctx.fill();
 // Tiny ink marks belong to the sheet face, never to an orbit guide line.
 for(let j=0;j<2;j++){ctx.fillStyle='#a58ca6';ctx.fillRect(-w*.55,-h*.2+j*h*.45,w*(j?.7:1),Math.max(.7,size*.065));}
 });
}
function renderOrbitBook(b){
 if(b.sweep>.3){ctx.save();ctx.translate(b.cx,b.cy);ctx.scale(1,b.ry/b.rx);ctx.strokeStyle='#c7b1e5';ctx.lineWidth=8;ctx.globalAlpha=.28+b.sweep*.22;ctx.beginPath();ctx.arc(0,0,b.rx,b.a-.6,b.a);ctx.stroke();ctx.strokeStyle='#fff3cb';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
 const n=reducedEffects?3:5;
 for(let j=n;j>=1;j--){let age=j/n,a=b.a-.11-j*.105,drift=Math.sin(game.t*4+j+b.a)*3*age,x=b.cx+Math.cos(a)*(b.rx+age*7),y=b.cy+Math.sin(a)*(b.ry+age*4)-age*5+drift,tangent=Math.atan2(Math.cos(a)*b.ry,-Math.sin(a)*b.rx);renderLoosePage(x,y,7.5-age*3,tangent+Math.sin(game.t*5+j)*.3,game.t*7+j,.68*(1-age*.72));}
 const flap=Math.sin(game.t*9+b.a),s=.65+Math.sin(b.a)*.06;
 drawCenteredSprite('book',b.x,b.y,s,Math.sin(b.a)*.28);
 PaperCamera.upright(ctx,b.x,b.y,()=>{ctx.rotate(Math.sin(b.a)*.28);ctx.scale(1,.8+flap*.13);
 Art.path(ctx,'M0 10Q-9 -9 -19 -12L-17 6Q-6 1 0 10M0 10Q9 -9 19 -12L17 6Q6 1 0 10','#fff6da','#b9a0bc',.9);
 });
}
const actorPoseKinds=new Map();
function actorPose(e,hero=false){
 const phase=hero?e.walk*Math.PI/4:e.frame*Math.PI/4+e.phase,t=game.t;
 let lift=0,sx=1,sy=1,tilt=0;
 if(hero){
  const hop=e.moving?Math.max(0,Math.sin(phase*2)):0;
  lift=hop*5;sx=1-hop*.035;sy=1+hop*.05;
  tilt=e.moving?e.facing*.045+Math.sin(phase)*.035:Math.sin(t*1.8)*.022;
  if(!e.moving){sx+=Math.sin(t*2.6)*.015;sy-=Math.sin(t*2.6)*.018;}
  if(e.dash>0){sx=1.12;sy=.88;tilt=e.facing*.17;}
 }else{
  let category=actorPoseKinds.get(e.kind);
  if(category===undefined){category=/bat|jelly|ghost|moth|lantern|cloud/.test(e.kind)?1:/slime|imp|mushroom|frog|rabbit|fox|puff/.test(e.kind)?2:0;actorPoseKinds.set(e.kind,category);}
  const flying=category===1,squishy=category===2;
  const hop=Math.max(0,Math.sin(phase));
  if(flying){lift=7+Math.sin(t*4+e.phase)*6;sx=1+Math.sin(phase)*.025;sy=1-Math.sin(phase)*.03;tilt=Math.sin(t*3+e.phase)*.09;}
  else if(squishy){lift=hop*(e.boss?3:9);sx=1+Math.cos(phase*2)*.075;sy=1-Math.cos(phase*2)*.085;tilt=Math.cos(phase)*.07;}
  else {lift=hop*(e.boss?1.5:3);tilt=Math.sin(phase)*(e.boss?.022:.045);sy=1+Math.sin(phase*2)*.025;}
  lift+=e.visualLift||0;
  if(e.windUp>0){sx*=1.1;sy*=.87;lift=0;}
  if(e.hitPulse>0||e.hitFlash>0){let recoil=Math.max(e.hitPulse||0,e.hitFlash)/.18;sx*=1+recoil*.15;sy*=1-recoil*.14;tilt+=Math.sin(e.id)*recoil*.12;}
 }
 const intensity=typeof reducedEffects!=='undefined'&&reducedEffects?.4:1;
 const pose={lift:lift*intensity,sx:1+(sx-1)*intensity,sy:1+(sy-1)*intensity,tilt:tilt*intensity};
 if(!hero&&e.boss&&typeof bossChoreographyPose==='function'){const cast=bossChoreographyPose(e);pose.sx*=cast.sx;pose.sy*=cast.sy;pose.tilt+=cast.tilt;pose.lift+=cast.lift;}
 return pose;
}
function renderActor(name,e,scale,flip,hero=false){
 const s=Art.sprites[name];if(!s)return;const pose=actorPose(e,hero);
 castShadow(name,e.x,e.y,scale*(1-pose.lift*.009),hero?.18:.14);
 PaperCamera.upright(ctx,e.x,e.y,()=>{ctx.translate(0,-pose.lift);ctx.rotate(pose.tilt);ctx.scale(flip*pose.sx,pose.sy);
 ctx.globalAlpha=hero&&e.inv>0?.55+.45*Math.sin(game.t*30)**2:e.kind==='ghost'?.86:1;
 ctx.drawImage(s.img,-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);
 if(!hero&&e.hitFlash>0&&flashImages[name]){ctx.globalAlpha=e.hitFlash/.1*.65;ctx.drawImage(flashImages[name],-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);}
 });
}
function renderProjectileRibbon(b){
 const speed=Math.hypot(b.vx,b.vy)||1,dx=b.vx/speed,dy=b.vy/speed,length=Math.min(88,speed*.14),col=b.kind==='fire'?'#e59368':PALETTE[b.id%5];
 ctx.save();ctx.globalAlpha=.62;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(b.x-dy*4,b.y+dx*4);ctx.quadraticCurveTo(b.x-dx*length*.5-dy*8,b.y-dy*length*.5+dx*8,b.x-dx*length,b.y-dy*length);ctx.quadraticCurveTo(b.x-dx*length*.5+dy*3,b.y-dy*length*.5-dx*3,b.x+dy*4,b.y-dx*4);ctx.closePath();ctx.fill();
 Art.line(ctx,[[b.x-dx*length*.75,b.y-dy*length*.75],[b.x,b.y]],'#fff3ca',1.5);ctx.restore();
}
function renderSpellSigil(o){
 if(o.delay<=0||o.age>=o.delay||o.mode==='beam')return;
 const u=clamp(o.age/o.delay,0,1),r=Math.min(100,o.r||45)*(1-.3*u);
 ctx.save();ctx.translate(o.x,o.y);ctx.scale(1,.7);ctx.rotate(o.age*.8);ctx.globalAlpha=.3+u*.35;ctx.setLineDash([6,5]);Art.ellipse(ctx,0,0,r,r,null,o.color,2);ctx.setLineDash([]);
 for(let i=0;i<6;i++){let a=i*TAU/6;Art.line(ctx,[[Math.cos(a)*r*.8,Math.sin(a)*r*.8],[Math.cos(a)*r*1.08,Math.sin(a)*r*1.08]],'#b48fba',2);}
 ctx.restore();
}
function renderCrescent(o,a,u){
 const r=o.r*(.65+u*.35),start=a-1.1+u*.8,end=a+1.1+u*.8;
 ctx.save();ctx.translate(o.x,o.y);ctx.globalAlpha=Math.max(0,1-u*.8);
 ctx.beginPath();ctx.arc(0,0,r,start,end);ctx.quadraticCurveTo(Math.cos(a+u*.8)*r*.35,Math.sin(a+u*.8)*r*.35,Math.cos(start)*r,Math.sin(start)*r);ctx.fillStyle=o.color;ctx.fill();
 for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(0,0,r-j*5,start+.08*j,end-.1*j);ctx.strokeStyle=j?'#fff6d8':'#95739f';ctx.lineWidth=j?1.6:2.3;ctx.stroke();}
 ctx.restore();drawCenteredSprite('star',o.x+Math.cos(end)*r,o.y+Math.sin(end)*r,.35*(1-u),end);
}
function renderBeamRibbon(o,a,ready){
 const ca=Math.cos(a),sa=Math.sin(a),width=ready?(o.width||18):2;
 ctx.save();ctx.translate(o.x,o.y);ctx.rotate(a);
 if(!ready){ctx.globalAlpha=.5;ctx.setLineDash([6,8]);Art.line(ctx,[[0,0],[o.r,0]],o.color,2);ctx.setLineDash([]);Art.ellipse(ctx,0,0,12+o.age*40,12+o.age*40,null,o.color,2);}
 else {ctx.globalAlpha=.68;ctx.fillStyle=o.color;ctx.beginPath();ctx.moveTo(0,-width);ctx.bezierCurveTo(o.r*.3,-width*1.4,o.r*.7,-width*.5,o.r,0);ctx.bezierCurveTo(o.r*.7,width*.5,o.r*.3,width*1.4,0,width);ctx.closePath();ctx.fill();for(let j=-1;j<=1;j++){ctx.beginPath();ctx.moveTo(0,j*width*.4);for(let x=0;x<=o.r;x+=28)ctx.lineTo(x,Math.sin(x*.035-o.age*15+j)*width*.15+j*width*.35);ctx.strokeStyle=j?'#ffe8bb':'#fff9eb';ctx.lineWidth=j?1.3:3;ctx.stroke();}}
 ctx.restore();if(ready)drawCenteredSprite('star',o.x+ca*o.r,o.y+sa*o.r,.4,a+o.age*3);
}
function renderThunderSeal(f){
 const u=clamp(1-f.life/f.max,0,1),r=24+u*56;
 ctx.save();ctx.globalAlpha=(1-u)*.85;
 Art.ellipse(ctx,f.x,f.y,r,r*.45,null,'#9b78b8',3);
 Art.ellipse(ctx,f.x,f.y,r*.8,r*.36,null,'#f7d78f',1.5);
 for(let i=0;i<6;i++){let a=i*TAU/6+u*.6;Art.line(ctx,[[f.x+Math.cos(a)*r*.9,f.y+Math.sin(a)*r*.4],[f.x+Math.cos(a)*r*1.25,f.y+Math.sin(a)*r*.56]],'#f1cb76',3);}
 const sx=f.x-25,sy=f.y-220;
 for(let i=0;i<3;i++){let side=i%2?1:-1,x=sx+i*7,y=sy+i*43;Art.line(ctx,[[x,y],[x+side*26,y+17],[x+side*14,y+28],[x+side*43,y+43]],'#aa8bd1',3);Art.line(ctx,[[x,y],[x+side*26,y+17],[x+side*14,y+28],[x+side*43,y+43]],'#fff3c7',1);}
 ctx.restore();
}
function renderWindRibbon(w){
 const age=w.max-w.life,fade=Math.min(1,age*3,w.life*2),h=100+w.r*.25;
 ctx.save();ctx.translate(w.x,w.y);
 for(let j=0;j<3;j++){
  ctx.beginPath();
  for(let i=0;i<=26;i++){let v=i/26,a=game.t*5+v*TAU*2+j*TAU/3,r=7+v*w.r*.75,x=Math.cos(a)*r,y=-v*h+Math.sin(a)*r*.18;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.globalAlpha=fade*.7;ctx.strokeStyle=['#8eabd0','#c0a2cf','#ebd59b'][j];ctx.lineWidth=5+j;ctx.stroke();ctx.globalAlpha=fade*.8;ctx.strokeStyle='#fff3dc';ctx.lineWidth=1.2;ctx.stroke();
 }
 ctx.restore();
}
function updateFootfalls(dt){
 const p=game.hero;game.footfalls||=[];game.footClock=(game.footClock||0)-dt;
 compact(game.footfalls,f=>(f.life-=dt)>0);
 if(p.moving&&p.dash<=0&&game.footClock<=0){
  game.footClock=.17;game.footSide=-(game.footSide||1);
  if(game.footfalls.length<28)game.footfalls.push({x:p.x-p.dirX*10-p.dirY*5*game.footSide,y:p.y-p.dirY*10+p.dirX*5*game.footSide,angle:Math.atan2(p.dirY,p.dirX),life:1.5,water:biomeAt(p.x,p.y).key==='whale'});
 }
}
function renderFootfalls(){
 for(let f of game.footfalls||[]){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle);ctx.globalAlpha=Math.min(.22,f.life*.2);if(f.water){let r=(1.5-f.life)*15+3;Art.ellipse(ctx,0,0,r,r*.55,null,'#f8f0d4',1.5);}else{Art.ellipse(ctx,0,0,4,2.2,'#947987',null);}ctx.restore();}
}
function renderAlignedSwing(o){
 const g=attackGeometry(o),r=g.r,head=g.head,tail=Math.max(g.start,head-1.05);
 ctx.save();ctx.translate(o.x,o.y);ctx.globalAlpha=Math.min(1,o.life*9);
 ctx.beginPath();ctx.arc(0,0,r,tail,head);ctx.lineTo(Math.cos(head)*r*.48,Math.sin(head)*r*.48);ctx.arc(0,0,r*.48,head,tail,true);ctx.closePath();ctx.fillStyle=o.color;ctx.fill();ctx.strokeStyle='#76547f';ctx.lineWidth=1.7;ctx.stroke();
 for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(0,0,r-j*7,tail+.07*j,head);ctx.strokeStyle=j?'#efd2a9':'#fff5d8';ctx.lineWidth=j?1.3:4;ctx.stroke();}
 ctx.rotate(head);ctx.fillStyle='#fff2c6';ctx.beginPath();ctx.moveTo(r+10,0);ctx.lineTo(r-16,-10);ctx.lineTo(r-5,0);ctx.lineTo(r-16,10);ctx.closePath();ctx.fill();ctx.restore();
}
function renderAlignedLine(o,ready){
 if(!ready){renderBeamRibbon(o,o.a,false);return;}
 const g=attackGeometry(o),length=Math.hypot(g.x2-g.x,g.y2-g.y);
 if(o.mode==='beam'){renderBeamRibbon({...o,r:length},g.a,true);drawCenteredSprite(weaponData[o.kind]?.art||'prism',o.x,o.y,.4,g.a);return;}
 ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.a);ctx.fillStyle='#a9b6ce';ctx.strokeStyle='#705a81';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(length-25,-7);ctx.lineTo(length-25,-15);ctx.lineTo(length,0);ctx.lineTo(length-25,15);ctx.lineTo(length-25,7);ctx.lineTo(0,5);ctx.closePath();ctx.fill();ctx.stroke();Art.line(ctx,[[10,0],[Math.max(10,length-7),0]],'#fff2cc',3);
 ctx.fillStyle=o.color;ctx.beginPath();ctx.moveTo(length*.3,-7);ctx.quadraticCurveTo(length*.1,-35,4,-14);ctx.lineTo(12,-5);ctx.closePath();ctx.fill();ctx.restore();
}
function renderMovingWeapon(o){
 const dx=o.x-(o.px??o.x),dy=o.y-(o.py??o.y),heading=Math.hypot(dx,dy)>.01?Math.atan2(dy,dx):o.a;
 let angle=PaperCamera.heading(heading),scale=.65;
 if(o.mode==='rocket')angle+=Math.PI/2-.5;
 else if(o.mode==='leaf')angle+=1.05;
 else if(o.mode==='gear'||o.mode==='bounce'||o.mode==='yoyo')angle=o.age*9;
 else if(o.mode==='notes')angle=Math.sin(o.age*7)*.12;
 if(o.mode==='rocket'){const facing=PaperCamera.heading(heading);PaperCamera.upright(ctx,o.x,o.y,()=>{ctx.rotate(facing);ctx.fillStyle='#e7ac6c';ctx.beginPath();ctx.moveTo(-18,-7);ctx.lineTo(-42-Math.sin(o.age*40)*8,0);ctx.lineTo(-18,7);ctx.closePath();ctx.fill();});}
 drawCenteredSprite(weaponData[o.kind]?.art||o.kind,o.x,o.y,scale,angle);
}
function renderMine(o){
 const armed=o.age>=o.delay,u=clamp(o.age/o.delay,0,1);
 ctx.save();ctx.globalAlpha=armed?.7:.45;ctx.setLineDash([3,5]);Art.ellipse(ctx,o.x,o.y,o.r,o.r,null,armed?'#af7987':'#9b8c9d',1.2);ctx.setLineDash([]);ctx.restore();
 drawCenteredSprite('mine',o.x,o.y,.56,0,armed?1:.6);
 ctx.save();ctx.beginPath();ctx.arc(o.x,o.y,24,-Math.PI/2,-Math.PI/2+TAU*u);ctx.strokeStyle=armed?'#edc778':'#b4b4c4';ctx.lineWidth=3;ctx.stroke();Art.ellipse(ctx,o.x,o.y-5,3,3,armed?'#f3cf82':'#a6a6b5',null);ctx.restore();
}

// Paper foundations expose a top and two vertical faces at the same ground anchor.
function renderPaperFoundation(o){
 if(!['biome_glassPalace','biome_clockTower','biome_kiteMill','paperHouse','pillar'].includes(o.name))return;
 const source=Art.sprites[o.name];if(!source)return;const scale=o.scale||1,w=source.w*scale*.46,d=17*scale,h=PaperCamera.height(10*scale),x=o.x,y=o.y-PaperCamera.height(9*scale);
 ctx.save();ctx.lineWidth=1;ctx.strokeStyle='#8d8291';
 Art.path(ctx,`M${x-w} ${y-d}L${x+w*.78} ${y-d} ${x+w} ${y+d} ${x-w*.78} ${y+d}Z`,'#d4c9b2','#968a96',1);
 Art.path(ctx,`M${x-w*.78} ${y+d}L${x+w} ${y+d} ${x+w} ${y+d+h} ${x-w*.78} ${y+d+h}Z`,'#aa9ca6','#897b8b',1);
 Art.path(ctx,`M${x-w} ${y-d}L${x-w*.78} ${y+d} ${x-w*.78} ${y+d+h} ${x-w} ${y-d+h}Z`,'#bdafa9','#897b8b',1);
 ctx.restore();
}
