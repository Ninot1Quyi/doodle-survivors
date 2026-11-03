'use strict';
function prepareEnemyIntent(e,q){
 q.sx=e.x;q.sy=e.y-(e.boss?24:18);q.duration=.65;
 if(q.type==='charge'){q.sy=e.y;q.speed=260;q.range=Math.min(350,Math.max(160,distance(e,game.hero)+35));q.speed=q.range/q.duration;q.r=e.r;q.a=Math.atan2(game.hero.y-q.sy,game.hero.x-e.x);}
 else q.a=Math.atan2(game.hero.y-q.sy,game.hero.x-e.x);
 q.spots=[];
 if(['leap','stomp','paint'].includes(q.type))q.spots.push({x:q.x,y:q.y,r:q.r,delay:q.type==='leap'?.55:0});
 if(q.type==='clock')for(let i=0;i<4;i++)for(let j=1;j<=3;j++){let a=q.a+i*TAU/4;q.spots.push({x:e.x+Math.cos(a)*j*90,y:e.y+Math.sin(a)*j*90,r:32,delay:(j-1)*.15});}
 if(q.type==='cloud')for(let i=0;i<q.n;i++){let a=i*TAU/q.n;q.spots.push({x:q.x+Math.cos(a)*100,y:q.y+Math.sin(a)*80,r:40,delay:i*.08});}
 if(q.type==='serpent')for(let i=0;i<5;i++)q.spots.push({x:q.x+(i-2)*70,y:q.y+Math.sin(i*1.4)*65,r:35,delay:i*.1});
 return q;
}
function advanceEnemyAction(e,dt){
 if(e.hp<=0)return false;
 if(game.buffs.freeze>0||e.stun>0)return true;
 if(e.intent){tickEnemyIntent(e,dt);return true;}
 if(e.chargeAttack){let q=e.chargeAttack,step=Math.min(dt,q.left);q.left-=step;e.x+=Math.cos(q.a)*q.speed*step;e.y+=Math.sin(q.a)*q.speed*step;if(q.left<=0)e.chargeAttack=null;return true;}
 if(e.leapLife>0){e.leapLife=Math.max(0,e.leapLife-dt);let u=1-e.leapLife/e.leapMax;e.x=e.leapFromX+(e.leapToX-e.leapFromX)*u;e.y=e.leapFromY+(e.leapToY-e.leapFromY)*u;e.visualLift=Math.sin(u*Math.PI)*(e.boss?95:65);return true;}e.visualLift=0;
 return false;
}
function warningCircle(x,y,r,u){
 if(!visible(x,y,r+20))return;ctx.save();ctx.translate(x,y);ctx.lineWidth=2.5;
 ctx.fillStyle=`rgba(208,48,67,${.08+u*.13})`;ctx.strokeStyle='#c74355';ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();
 ctx.save();ctx.clip();ctx.strokeStyle='#d1486244';ctx.lineWidth=6;for(let v=-r*2;v<r*2;v+=25){ctx.beginPath();ctx.moveTo(v-r,-r);ctx.lineTo(v+r,r);ctx.stroke();}ctx.restore();
 ctx.beginPath();ctx.arc(0,0,r*.96,-Math.PI/2,-Math.PI/2+TAU*u);ctx.strokeStyle='#fff0cf';ctx.lineWidth=4;ctx.stroke();
 Art.ellipse(ctx,0,0,Math.max(1,r*(1-u)),Math.max(1,r*(1-u)),null,'#ee8a8d',1.5);
 for(let i=0;i<4;i++){let a=i*TAU/4+game.t*.3;ctx.save();ctx.rotate(a);Art.path(ctx,`M${r-10} -4L${r-3} 0 ${r-10} 4Z`,'#bb3048',null);ctx.restore();}
 ctx.restore();
}
function warningLane(x,y,a,length,width,u,charge=false){
 if(!visible(x+Math.cos(a)*length*.5,y+Math.sin(a)*length*.5,length*.55+width))return;
 ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=`rgba(211,52,70,${.10+u*.14})`;ctx.strokeStyle='#c93c50';ctx.lineWidth=2;
 ctx.beginPath();ctx.rect(0,-width,length,width*2);ctx.fill();ctx.stroke();ctx.save();ctx.clip();ctx.fillStyle='#d5496050';ctx.fillRect(0,-width,length*u,width*2);
 ctx.strokeStyle='#ffe5c7';ctx.lineWidth=2;const phase=reducedEffects?0:(game.t*35)%40;
 for(let j=phase;j<length;j+=40){ctx.beginPath();ctx.moveTo(j-9,-width*.5);ctx.lineTo(j,0);ctx.lineTo(j-9,width*.5);ctx.stroke();}ctx.restore();
 ctx.fillStyle='#bd354b';ctx.beginPath();ctx.moveTo(length+9,0);ctx.lineTo(length-5,-width*.7);ctx.lineTo(length-5,width*.7);ctx.closePath();ctx.fill();ctx.restore();
}
function renderEnemyTelegraphs(){
 for(let e of game.enemies){if(e.hp<=0)continue;let q=e.intent;
  if(e.chargeAttack){let a=e.chargeAttack;warningLane(e.x,e.y,a.a,a.speed*a.left,e.r,1,true);}
  if(!q)continue;let u=clamp(1-q.left/q.max,0,1);
  if(q.spots.length){for(let s of q.spots)warningCircle(s.x,s.y,s.r,clamp(1-(q.left+s.delay)/(q.max+s.delay),0,1));}
  else if(q.type==='charge')warningLane(e.x,e.y,q.a,q.range,e.r,u,true);

 }
 for(let h of game.hazards)if(!h.done&&h.life>0)warningCircle(h.x,h.y,h.r,clamp(1-h.life/h.max,0,1));
}
