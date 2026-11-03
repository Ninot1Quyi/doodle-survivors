'use strict';
function updateBookOrbit(){
 const p=game.hero,lv=game.weapons.book,n=lv?lv+1:0;
 game.orbit.length=n;
 for(let i=0;i<n;i++){
  const a=game.t*(2+lv*.15)+i*TAU/n,b=game.orbit[i]||(game.orbit[i]={});
  Object.assign(b,{a,rx:76+lv*8,ry:48+lv*6,cx:p.x,cy:p.y-31});
  b.x=b.cx+Math.cos(a)*b.rx;b.y=b.cy+Math.sin(a)*b.ry;
 }
}
function drawCenteredSprite(name,x,y,scale,angle=0,alpha=1){
 const s=Art.sprites[name];if(!s)return;
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha;
 ctx.drawImage(s.img,-s.w*scale/2,-s.h*scale/2,s.w*scale,s.h*scale);ctx.restore();
}
function renderOrbitBook(b){
 ctx.save();ctx.beginPath();ctx.ellipse(b.cx,b.cy,b.rx,b.ry,0,b.a-.8,b.a);ctx.strokeStyle='#ab7eba75';ctx.lineWidth=8;ctx.stroke();ctx.strokeStyle='#fff1c5';ctx.lineWidth=2;ctx.stroke();ctx.restore();
 const flap=Math.sin(game.t*9+b.a),s=.65+Math.sin(b.a)*.06;
 drawCenteredSprite('book',b.x,b.y,s,Math.sin(b.a)*.28);
 ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(b.a)*.28);ctx.scale(1,.8+flap*.13);
 Art.path(ctx,'M0 10Q-9 -9 -19 -12L-17 6Q-6 1 0 10M0 10Q9 -9 19 -12L17 6Q6 1 0 10','#fff6da','#b9a0bc',.9);
 ctx.restore();
 for(let j=1;j<4;j++){let a=b.a-j*.2;drawCenteredSprite('star',b.cx+Math.cos(a)*b.rx,b.cy+Math.sin(a)*b.ry,.12-j*.02,a,.55-j*.12);}
}
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
  const flying=['bat','jelly','ghost','moth','lantern','cloud'].some(k=>e.kind.includes(k));
  const squishy=['slime','imp','mushroom','frog','rabbit','fox','puff'].some(k=>e.kind.includes(k));
  const hop=Math.max(0,Math.sin(phase));
  if(flying){lift=7+Math.sin(t*4+e.phase)*6;sx=1+Math.sin(phase)*.025;sy=1-Math.sin(phase)*.03;tilt=Math.sin(t*3+e.phase)*.09;}
  else if(squishy){lift=hop*(e.boss?3:9);sx=1+Math.cos(phase*2)*.075;sy=1-Math.cos(phase*2)*.085;tilt=Math.cos(phase)*.07;}
  else {lift=hop*(e.boss?1.5:3);tilt=Math.sin(phase)*(e.boss?.022:.045);sy=1+Math.sin(phase*2)*.025;}
  lift+=e.visualLift||0;
  if(e.windUp>0){sx*=1.1;sy*=.87;lift=0;}
  if(e.hitFlash>0){sx*=1.09;sy*=.91;tilt+=Math.sin(e.id)*.08;}
 }
 const intensity=typeof reducedEffects!=='undefined'&&reducedEffects?.4:1;
 return{lift:lift*intensity,sx:1+(sx-1)*intensity,sy:1+(sy-1)*intensity,tilt:tilt*intensity};
}
function renderActor(name,e,scale,flip,hero=false){
 const s=Art.sprites[name];if(!s)return;const pose=actorPose(e,hero);
 castShadow(name,e.x,e.y,scale*(1-pose.lift*.009),hero?.18:.14);
 ctx.save();ctx.translate(e.x,e.y-pose.lift);ctx.rotate(pose.tilt);ctx.scale(flip*pose.sx,pose.sy);
 ctx.globalAlpha=hero&&e.inv>0?.55+.45*Math.sin(game.t*30)**2:e.kind==='ghost'?.86:1;
 ctx.drawImage(s.img,-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);
 if(!hero&&e.hitFlash>0&&flashImages[name]){ctx.globalAlpha=e.hitFlash/.1*.65;ctx.drawImage(flashImages[name],-s.w*scale/2,-s.h*scale,s.w*scale,s.h*scale);}
 ctx.restore();
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
