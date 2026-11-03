'use strict';
const AREA_TARGET_WEAPONS=new Set(['ink','rose','stamp','meteor','firecracker','magnetArm','void','festival','printingPress','loom','spotlight','paperCosmos','nova','aurora']);
const LINE_TARGET_WEAPONS=new Set(['lance','ruler','prism','plane','roller','comet']);
function initTactics(){game.aimClaims=new Map();game.mineSerial=0;game.enemyShotSerial=1;game.clashes=0;game.parryPulses=[];game.impactGate=0;game.enemyTelegraphs=[];}
function selectWeaponTarget(key,x,y,max=700,exclude,estimated=30,weapon=key.split(':')[0]){
 const claims=game.aimClaims,loads=new Map();
 for(let [k,c]of claims){if(c.until<game.t){claims.delete(k);continue;}if(k!==key){let l=loads.get(c.id)||{damage:0,n:0};l.damage+=c.damage;l.n++;loads.set(c.id,l);}}
 const area=AREA_TARGET_WEAPONS.has(weapon),line=LINE_TARGET_WEAPONS.has(weapon),candidates=[];
 for(let e of game.enemies){if(e.hp<=0||exclude?.has(e.id))continue;let dist=Math.hypot(e.x-x,e.y-y);if(dist>max+e.r)continue;let load=loads.get(e.id)||{damage:0,n:0},urgent=Math.hypot(e.x-game.hero.x,e.y-game.hero.y)<85;
  let score=dist+load.n*155+Math.min(3,load.damage/Math.max(1,e.hp))*230-(urgent?95:0)-(weapon==='compass'&&e.boss?250:0);
  candidates.push({e,score,dist});
 }
 candidates.sort((a,b)=>a.score-b.score);let best=null,bestScore=Infinity;
 for(let c of candidates.slice(0,area||line?12:1)){let score=c.score;if(area||line){let count=0;for(let n of game.enemies){if(n.hp<=0)continue;if(area?distance(n,c.e)<115:lineDistance(n,x,y,c.e.x,c.e.y)<28&&distance(n,{x,y})<c.dist+65)count++;}score-=Math.min(8,count)*65;}if(score<bestScore){bestScore=score;best=c.e;}}
 if(best){claims.set(key,{id:best.id,damage:estimated,until:game.t+.65+Math.min(.6,Math.hypot(best.x-x,best.y-y)/650)});if(claims.size>320)claims.delete(claims.keys().next().value);}
 return best;
}
function weaponRange(k,lv){return k==='saber'?95+lv*9:k==='whip'?155+lv*12:k==='camera'?230+lv*15:k==='lance'?210+lv*20:780;}
function placeMinefield(lv,damage){
 const p=game.hero,mines=game.constructs.filter(o=>o.mode==='mine'&&o.life>0),count=Math.min(1+Math.floor(lv/2),12-mines.length);
 for(let n=0;n<count;n++){
  let best=null,bestScore=-Infinity;
  for(let i=0;i<24;i++){
   const a=Math.atan2(p.dirY,p.dirX)+(game.mineSerial+i)*2.39996323,r=80+(i%4)*28,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;
   if(mines.some(m=>Math.hypot(m.x-x,m.y-y)<82)||props.some(o=>(o.name==='tree'||o.name==='pillar')&&Math.hypot(o.x-x,o.y-y)<55))continue;
   let nearestEnemy=Infinity;for(let e of game.enemies)if(e.hp>0)nearestEnemy=Math.min(nearestEnemy,Math.hypot(e.x-x,e.y-y));
   let score=120-(Number.isFinite(nearestEnemy)?Math.abs(nearestEnemy-95):95)+Math.cos(a-Math.atan2(p.dirY,p.dirX))*25+(i%5)*2;
   if(score>bestScore){bestScore=score;best={x,y};}
  }
  if(!best)break;
  const mine=construct('mine','mine',best.x,best.y,0,lv,{life:12,delay:.6,r:24+lv*3,blastR:75+lv*12,damage:damage*2});if(mine)mines.push(mine);game.mineSerial+=7;
 }
}
function attackGeometry(o){
 const span=Math.max(.01,o.max-o.delay),u=clamp((o.age-o.delay)/span,0,1),a=o.a+(o.spin||0)*Math.max(0,o.age-o.delay);
 if(o.mode==='cone')return{type:'swing',x:o.x,y:o.y,r:o.r,start:a-o.width,head:a+o.width,end:a+o.width,u};
 if(o.mode==='slash'||o.mode==='whip'){let width=o.width||1.1,head=a-width+width*2*(1-(1-u)**2);return{type:'swing',x:o.x,y:o.y,r:o.r,start:a-width,end:a+width,head,tail:Math.max(a-width,head-.85),u};}
 if(o.mode==='thrust'){let extension=u<.45?Math.min(1,u/.28):Math.max(.08,1-(u-.45)/.55);return{type:'line',x:o.x,y:o.y,x2:o.x+Math.cos(a)*o.r*extension,y2:o.y+Math.sin(a)*o.r*extension,width:17,a,u};}
 if(o.mode==='beam')return{type:'line',x:o.x,y:o.y,x2:o.x+Math.cos(a)*o.r,y2:o.y+Math.sin(a)*o.r,width:o.width||18,a,u};
 return null;
}
function swingContains(e,o,geometry,fromAngle){
 const dx=e.x-o.x,dy=e.y-o.y,d=Math.hypot(dx,dy);if(d>geometry.r+(e.r||0))return false;
 const angle=o.a+Math.atan2(Math.sin(Math.atan2(dy,dx)-o.a),Math.cos(Math.atan2(dy,dx)-o.a)),margin=Math.asin(Math.min(1,(e.r||0)/Math.max(1,d)));
 return angle>=fromAngle-margin&&angle<=geometry.head+margin;
}
function addParryPulse(x,y,r){game.parryPulses.push({x,y,r,left:.07});}
function breakEnemyBullet(b,power=1,key='pulse'){
 if(b.life<=0)return false;b.clashedBy||=new Set();if(b.clashedBy.has(key))return false;b.clashedBy.add(key);b.guard=(b.guard||1)-power;
 if(b.guard>0)return false;b.life=0;game.clashes++;
 if(game.fx.length<190)game.fx.push({type:'clash',x:b.x,y:b.y,r:22,life:.24,max:.24,color:'#f4d68d',seed:game.clashes});
 Sound.play('parry',.22,1.1,.075);return true;
}
function resolvePassiveClashes(dt){
 for(let e of game.enemyBullets){if(e.life<=0)continue;if(!e.id)e.id=game.enemyShotSerial++;
  for(let b of game.orbit)if(distance(e,b)<21+e.r){breakEnemyBullet(e,1,'book:'+Math.floor(game.t*6));break;}
  if(e.life<=0)continue;
  for(let w of game.tornadoes)if(distance(e,w)<w.r){breakEnemyBullet(e,1,'wind:'+Math.floor(game.t*4));break;}
  if(e.life<=0)continue;
  for(let pulse of game.parryPulses)if(distance(e,pulse)<pulse.r+e.r){breakEnemyBullet(e,3,'pulse');break;}
  if(e.life<=0)continue;
  for(let o of game.constructs){if(o.life<=0||o.age<o.delay)continue;let g=attackGeometry(o),contact=false;
   if(g?.type==='line')contact=lineDistance(e,g.x,g.y,g.x2,g.y2)<=g.width+e.r;
   else if(g?.type==='swing')contact=swingContains(e,o,g,Math.max(g.start,g.head-.85));
   else if(['bounce','rocket','notes','leaf','yoyo','gear','planet','whale','dragonSpirit'].includes(o.mode))contact=lineDistance(e,o.px??o.x,o.py??o.y,o.x,o.y)<=o.r+e.r;
   else if(['shield','mirrorArena','cyclone'].includes(o.mode))contact=distance(e,o)<o.r;
   else if(o.mode==='wall')contact=lineDistance(e,o.x-Math.sin(o.a)*o.r,o.y+Math.cos(o.a)*o.r,o.x+Math.sin(o.a)*o.r,o.y-Math.cos(o.a)*o.r)<18+e.r;
   if(contact){breakEnemyBullet(e,weaponData[o.kind]?.evolved?2:1,'o'+o.id+':'+Math.floor(game.t*5));if(e.life<=0)break;}
  }
 }
 compact(game.parryPulses,p=>(p.left-=dt)>0);
}
