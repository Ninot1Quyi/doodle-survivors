'use strict';
// Continuous projectile collisions. All times are normalized to this simulation step.
// One pooled priority queue orders projectile clashes, enemy hits and player hits.
const projectileHeap=[],projectileEventPool=[],projectileFriendlyPool=[],projectileHostilePool=[];
const projectileClashGrid=new Map(),projectileGridBuckets=[],projectileWideShots=[];
let projectileEventUsed=0,projectileSequence=0,projectileBucketUsed=0;
const projectileMetrics={friendly:0,hostile:0,pairTests:0,enemyTests:0,events:0};
function projectileTOI(rx,ry,dx,dy,r,limit=1){const c=rx*rx+ry*ry-r*r;if(c<=0)return 0;const a=dx*dx+dy*dy;if(a<1e-12)return null;const b=rx*dx+ry*dy;if(b>=0)return null;const disc=b*b-a*c;if(disc<0)return null;const t=(-b-Math.sqrt(disc))/a;return t>=0&&t<=limit?t:null;}
function projectileEarlier(a,b){return a.t<b.t||a.t===b.t&&((a.kind===3?-1:a.kind)<(b.kind===3?-1:b.kind)||(a.kind===b.kind&&a.seq<b.seq));}
function projectileEvent(kind,t,a,b){let event=projectileEventPool[projectileEventUsed]||(projectileEventPool[projectileEventUsed]={});projectileEventUsed++;event.kind=kind;event.t=t;event.a=a;event.b=b;event.seq=projectileSequence++;let i=projectileHeap.length;projectileHeap.push(event);while(i){let parent=(i-1)>>1;if(!projectileEarlier(event,projectileHeap[parent]))break;projectileHeap[i]=projectileHeap[parent];i=parent;}projectileHeap[i]=event;projectileMetrics.events++;}
function projectileNext(){const first=projectileHeap[0],last=projectileHeap.pop();if(projectileHeap.length){let i=0;while(true){let child=i*2+1;if(child>=projectileHeap.length)break;if(child+1<projectileHeap.length&&projectileEarlier(projectileHeap[child+1],projectileHeap[child]))child++;if(!projectileEarlier(projectileHeap[child],last))break;projectileHeap[i]=projectileHeap[child];i=child;}projectileHeap[i]=last;}return first;}
function projectileRecord(pool,index,b,dt,speed){let r=pool[index]||(pool[index]={});r.b=b;r.key='b'+b.id;r.x=b.x;r.y=b.y;r.dx=b.vx*dt*speed;r.dy=b.vy*dt*speed;r.until=Math.min(1,b.life/dt);r.endX=b.x+r.dx*r.until;r.endY=b.y+r.dy*r.until;b.px=b.x;b.py=b.y;if(b.kind==='pencil'){b.trail||=[];b.trail.push({x:b.x,y:b.y});if(b.trail.length>5)b.trail.shift();}b.x=r.endX;b.y=r.endY;return r;}
function projectileOverlap(a,b,r,limit){let rx=a.x-b.x,ry=a.y-b.y,dx=a.dx-b.dx,dy=a.dy-b.dy,ex=rx+dx*limit,ey=ry+dy*limit;if(Math.min(rx,ex)>r||Math.max(rx,ex)<-r||Math.min(ry,ey)>r||Math.max(ry,ey)<-r)return null;return projectileTOI(rx,ry,dx,dy,r,limit);}
function projectileGridKey(x,y){return((x&65535)<<16)^(y&65535);}
function projectileGridBuild(count){projectileClashGrid.clear();projectileWideShots.length=0;projectileBucketUsed=0;for(let i=0;i<count;i++){let e=projectileHostilePool[i];e.seenQuery=0;if(e.b.life<=0)continue;let r=e.b.r,x0=Math.floor((Math.min(e.x,e.endX)-r)/96),x1=Math.floor((Math.max(e.x,e.endX)+r)/96),y0=Math.floor((Math.min(e.y,e.endY)-r)/96),y1=Math.floor((Math.max(e.y,e.endY)+r)/96);if((x1-x0+1)*(y1-y0+1)>64){projectileWideShots.push(e);continue;}for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){let key=projectileGridKey(x,y),bucket=projectileClashGrid.get(key);if(!bucket){bucket=projectileGridBuckets[projectileBucketUsed]||(projectileGridBuckets[projectileBucketUsed]=[]);projectileBucketUsed++;bucket.length=0;projectileClashGrid.set(key,bucket);}bucket.push(e);}}}
function projectilePair(b,e,radius,query){if(e.seenQuery===query)return;e.seenQuery=query;if(e.b.life<=0||e.b.clashedBy?.has(b.key))return;projectileMetrics.pairTests++;let t=projectileOverlap(b,e,radius+e.b.r,Math.min(b.until,e.until));if(t!==null)projectileEvent(0,t,b,e);}
function projectileGridQuery(b,radius,query,count){let x0=Math.floor((Math.min(b.x,b.endX)-radius)/96),x1=Math.floor((Math.max(b.x,b.endX)+radius)/96),y0=Math.floor((Math.min(b.y,b.endY)-radius)/96),y1=Math.floor((Math.max(b.y,b.endY)+radius)/96);if((x1-x0+1)*(y1-y0+1)>128){for(let i=0;i<count;i++)projectilePair(b,projectileHostilePool[i],radius,query);return;}for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){let bucket=projectileClashGrid.get(projectileGridKey(x,y));if(bucket)for(let e of bucket)projectilePair(b,e,radius,query);}for(let e of projectileWideShots)projectilePair(b,e,radius,query);}
function projectilePulses(first,time,hostileCount){for(let i=first;i<game.parryPulses.length;i++){const pulse=game.parryPulses[i];for(let j=0;j<hostileCount;j++){const e=projectileHostilePool[j];if(e.b.life<=0||e.until<time)continue;let t=projectileTOI(e.x+e.dx*time-pulse.x,e.y+e.dy*time-pulse.y,e.dx,e.dy,pulse.r+e.b.r,e.until-time);if(t!==null)projectileEvent(3,time+t,e,pulse);}}}
function stepProjectiles(dt,around,defend){if(!(dt>0)||!Number.isFinite(dt)||!game)return;
 projectileHeap.length=0;projectileEventUsed=0;projectileSequence=0;projectileMetrics.pairTests=projectileMetrics.enemyTests=projectileMetrics.events=0;
 let friendlyCount=0,hostileCount=0,maxRadius=0;const slow=game.buffs.slow>0?.55:1;
 // Capture the initial population: reflected/new shots begin moving next step.
 const initialFriendly=game.bullets.length,initialHostile=game.enemyBullets.length;
 for(let i=0;i<initialFriendly;i++){let b=game.bullets[i];if(b.life>0)projectileRecord(projectileFriendlyPool,friendlyCount++,b,dt,1);}
 for(let i=0;i<initialHostile;i++){let b=game.enemyBullets[i];if(b.life>0){if(!b.id)b.id=game.enemyShotSerial++;projectileRecord(projectileHostilePool,hostileCount++,b,dt,slow);}}
 projectileMetrics.friendly=friendlyCount;projectileMetrics.hostile=hostileCount;
 // Root supplies book / wind / construct / existing pulse defenses here, after movement.
 if(defend)defend(dt);
 projectileGridBuild(hostileCount);
 for(let e of game.enemies)if(e.hp>0)maxRadius=Math.max(maxRadius,e.r||0);
 for(let i=0;i<friendlyCount;i++){const b=projectileFriendlyPool[i];if(b.b.life<=0)continue;const radius=b.b.size||8;
  // around must cover current enemy positions. Extra 65 units tolerate one old grid cell.
  const candidates=around?around((b.x+b.endX)*.5,(b.y+b.endY)*.5,Math.hypot(b.endX-b.x,b.endY-b.y)*.5+radius+maxRadius+65):game.enemies;
  for(let e of candidates){if(e.hp<=0||b.b.hit.has(e.id))continue;projectileMetrics.enemyTests++;let rx=b.x-e.x,ry=b.y-e.y,r=radius+e.r,ex=b.endX-e.x,ey=b.endY-e.y;if(Math.min(rx,ex)>r||Math.max(rx,ex)<-r||Math.min(ry,ey)>r||Math.max(ry,ey)<-r)continue;let t=projectileTOI(rx,ry,b.dx,b.dy,r,b.until);if(t!==null)projectileEvent(1,t,b,e);}
  projectileGridQuery(b,radius,i+1,hostileCount);
 }
 for(let j=0;j<hostileCount;j++){const e=projectileHostilePool[j];if(e.b.life<=0)continue;const p=game.hero,t=projectileTOI(e.x-p.x,e.y-p.y,e.dx,e.dy,e.b.r+p.r,e.until);if(t!==null)projectileEvent(2,t,e,p);}
 while(projectileHeap.length){const event=projectileNext(),a=event.a,t=event.t,b=a.b;if(b.life<=0)continue;
  if(event.kind===0){const enemy=event.b;if(enemy.b.life<=0||enemy.b.clashedBy?.has(a.key))continue;b.x=a.x+a.dx*t;b.y=a.y+a.dy*t;enemy.b.x=enemy.x+enemy.dx*t;enemy.b.y=enemy.y+enemy.dy*t;breakEnemyBullet(enemy.b,b.damage>=50?2:1,a.key);if(--b.pierce<=0)b.life=0;}
  else if(event.kind===1){const e=event.b;if(e.hp<=0||b.hit.has(e.id))continue;b.x=a.x+a.dx*t;b.y=a.y+a.dy*t;b.hit.add(e.id);const firstPulse=game.parryPulses.length;
   if(b.kind==='fire'){explode(b.x,b.y,65+game.weapons.fire*12,b.damage);game.burns.push({x:b.x,y:b.y,r:47+game.weapons.fire*8,life:2.3});b.life=0;}
   else{hit(e,b.damage,a.x,a.y,b.kind==='scissors'?65:40,false,b.cause||({frost:'freeze',bubble:'soak',aurora:'soak',ribbon:'crumple',fire:'burn'}[b.kind]||'confetti'),{weapon:b.kind,color:b.tint});onBulletHit(b,e);if(--b.pierce<=0)b.life=0;}
   // Explosion pulses produced during this step enter the same chronological queue.
   if(game.parryPulses.length>firstPulse)projectilePulses(firstPulse,t,hostileCount);
  }
  else if(event.kind===2){b.x=a.x+a.dx*t;b.y=a.y+a.dy*t;playerHurt(b.damage||7,b.x,b.y);b.life=0;}
  else {if(b.clashedBy?.has('pulse'))continue;b.x=a.x+a.dx*t;b.y=a.y+a.dy*t;breakEnemyBullet(b,3,'pulse');}
 }
 // Life expiration happens after collisions within the valid part of the frame.
 for(let pool of [projectileFriendlyPool,projectileHostilePool]){let count=pool===projectileFriendlyPool?friendlyCount:hostileCount;for(let i=0;i<count;i++){let r=pool[i];if(r.b.life>0){r.b.x=r.endX;r.b.y=r.endY;r.b.life=Math.max(0,r.b.life-dt);}}}
}
function getProjectileStepStats(){return{...projectileMetrics,eventPool:projectileEventPool.length};}
