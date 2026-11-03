'use strict';
// Bounded combat constructs: trajectories, delayed attacks and persistent geometry.
const combatCause={saber:'confetti',lance:'confetti',marble:'crumple',yoyo:'crumple',rocket:'burn',firecracker:'burn',ruler:'erase',prism:'erase',turret:'confetti',foxspirit:'confetti',mine:'crumple',stamp:'crumple',whip:'petals',thread:'confetti',roller:'soak',chalk:'erase',camera:'erase',music:'crumple',meteor:'burn',compass:'erase',magnetArm:'crumple',gear:'confetti',umbrella:'soak',kite:'confetti',leaf:'petals',shield:'crumple',portal:'erase',void:'erase'};
function initCombat(){game.constructs=[];game.combatSerial=0;game.impactCooldown=0;game.deathCauses={};}
function lineDistance(e,x,y,x2,y2){let dx=x2-x,dy=y2-y,t=clamp(((e.x-x)*dx+(e.y-y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(e.x-x-dx*t,e.y-y-dy*t);}
function construct(kind,mode,x,y,a,lv,opts={}){if(game.constructs.length>=72||game.constructs.filter(o=>o.kind===kind).length>=24)return null;let d=weaponData[kind],o={id:++game.combatSerial,kind,mode,x,y,ox:x,oy:y,a,lv,age:0,life:1,max:1,tick:(game.combatSerial%4)*.035,delay:0,r:65,damage:15+lv*7,color:d?.color||'#c2acd5',cause:combatCause[kind]||'confetti',hit:new Set(),...opts};o.max=o.life;game.constructs.push(o);return o;}
function combatArea(o,x=o.x,y=o.y,r=o.r,damage=o.damage,knock=70){if(['stamp','mine','rocket','bounce'].includes(o.mode))addParryPulse(x,y,r);for(let e of game.enemies)if(e.hp>0&&distance(e,{x,y})<r+e.r){hit(e,damage,x,y,knock,false,o.cause);if(o.stun)e.stun=Math.max(e.stun||0,o.stun);}}
function combatLine(o,x,y,x2,y2,width=20,damage=o.damage){for(let e of game.enemies)if(e.hp>0&&lineDistance(e,x,y,x2,y2)<width+e.r){hit(e,damage,x,y,60,false,o.cause);if(o.stun)e.stun=Math.max(e.stun||0,o.stun);}}
function advancedCast(k,lv,target){let p=game.hero,d=weaponData[k],a=Math.atan2(target.y-(p.y-24),target.x-p.x),damage=15+lv*7,evo=!!d.evolved;
const put=(mode,opts={})=>{let held=['slash','whip','thrust','cone'].includes(mode),torso=held||['beam','bounce','rocket','notes','leaf','yoyo','gear'].includes(mode);return construct(k,mode,p.x,p.y-(torso?24:0),Math.atan2(target.y-(p.y-(torso?24:0)),target.x-p.x),lv,{damage,follow:held,...opts});};
const at=(mode,opts={})=>construct(k,mode,target.x,target.y,a,lv,{damage,...opts});
const ray=(ang=a,opts={})=>put('beam',{a:ang,life:1.1,delay:.22,r:460,width:10+lv,damage:damage*.38,...opts});
const shot=(mode,opts={})=>put(mode,{life:2.2,speed:300,r:15,...opts});
const delayed=(x,y,delay,r=95,cause='crumple')=>construct(k,'stamp',x,y,a,lv,{delay,life:delay+.45,r,damage:damage*1.6,cause});
switch(k){
case 'saber':put('slash',{life:.38,r:95+lv*9,width:1.5});break;
case 'lance':put('thrust',{life:.62,delay:.22,r:210+lv*20});break;
case 'marble':shot('bounce',{bounces:2+lv,speed:380,damage:damage*.7});break;
case 'yoyo':shot('yoyo',{life:1.6,r:23,speed:270});break;
case 'rocket':shot('rocket',{speed:100,r:16,life:3,damage:damage*1.5,target:target.id});break;
case 'firecracker':for(let i=0;i<4+lv;i++)delayed(p.x+Math.cos(a)*i*45,p.y+Math.sin(a)*i*45,.2+i*.14,55,'burn');break;
case 'ruler':ray();break;
case 'prism':for(let i=-1;i<=1;i++)ray(a+i*.42,{r:340,damage:damage*.23});break;
case 'turret':put('turret',{life:8,fireCd:0,r:45});break;
case 'foxspirit':put('friend',{life:9,r:38,speed:190});break;
case 'mine':placeMinefield(lv,damage);break;
case 'stamp':at('stamp',{delay:.7,life:1.2,r:90+lv*8,damage:damage*2,stun:.8});break;
case 'whip':put('whip',{life:.5,r:155+lv*12,a:a+(Math.floor(game.t)%2?.3:-.3)});break;
case 'thread':{let points=[{x:p.x,y:p.y}],used=new Set();for(let i=0;i<3+lv;i++){let last=points[points.length-1],e=nearest(last.x,last.y,350,used);if(!e)break;used.add(e.id);points.push({x:e.x,y:e.y});}put('thread',{life:1.4,points,damage:damage*.55});break;}
case 'roller':put('paint',{life:3.7,r:350,width:35+lv*5,damage:damage*.28});break;
case 'chalk':put('wall',{life:4.5,x:p.x+Math.cos(a)*130,y:p.y+Math.sin(a)*130,r:100+lv*12,damage:damage*.2});break;
case 'camera':put('cone',{life:.65,delay:.22,r:230+lv*15,width:1.05,stun:1,cause:'erase'});break;
case 'music':for(let i=-1;i<=1;i++)shot('notes',{a:a+i*.25,speed:190,phase:i*2,damage:damage*.6});break;
case 'meteor':at('stamp',{delay:1,life:1.6,r:125+lv*9,damage:damage*2.7,cause:'burn'});break;
case 'compass':target.mark=5;put('mark',{x:target.x,y:target.y,target:target.id,life:5,r:target.r+20,damage:damage*.3});break;
case 'magnetArm':at('pull',{life:1.4,r:130+lv*8,damage:damage*.5});break;
case 'gear':shot('gear',{life:2.5,r:22});break;
case 'umbrella':at('rain',{life:3.3,r:95+lv*8,damage:damage*.35});break;
case 'kite':put('kite',{life:4.4,r:210,damage:damage*.38});break;
case 'leaf':shot('leaf',{life:2.1,speed:290,r:20});break;
case 'shield':put('shield',{life:2.8,r:100,damage:damage*.5});break;
case 'portal':at('portal',{life:3.8,r:65,outX:p.x-Math.cos(a)*220,outY:p.y-Math.sin(a)*220});break;
case 'void':at('void',{life:2.3,r:150,damage:damage*.45});break;
// Evolutions use new geometry and timing, consuming the two parent weapons.
case 'paladin':put('avatar',{life:1.5,r:160});for(let i=-1;i<=1;i++)put('thrust',{a:a+i*Math.PI/2,delay:.35+Math.abs(i)*.22,life:1.3,r:420,damage:damage*1.8});break;
case 'pinball':for(let i=0;i<3;i++){let aa=i*TAU/3;put('bumper',{x:target.x+Math.cos(aa)*130,y:target.y+Math.sin(aa)*130,life:4,r:35});}shot('bounce',{life:4,speed:550,r:35,bounces:14,damage:damage*1.2,burst:true});break;
case 'festival':at('festival',{delay:.7,life:2.5,r:210,damage:damage*.9,cause:'burn'});break;
case 'rainbowLaser':for(let i=0;i<6;i++)ray(i*TAU/6,{life:3,delay:.4,r:380,spin:.65,color:PALETTE[i%5],damage:damage*.27,cause:'erase'});put('avatar',{life:3,r:65});break;
case 'clockwork':put('castle',{life:9,r:65,speed:70,damage:damage*.65});break;
case 'printingPress':put('avatar',{x:target.x,y:target.y,life:2.5,r:120});for(let i=0;i<5;i++)delayed(target.x+(i-2)*75,target.y,.3+i*.3,90);break;
case 'loom':{let points=[{x:target.x-180,y:target.y-120},{x:target.x+180,y:target.y-120},{x:target.x-180,y:target.y+120},{x:target.x+180,y:target.y+120},{x:target.x-180,y:target.y-120}];at('thread',{life:3.2,points,collapse:true,damage:damage*.4,stun:.25});break;}
case 'livingMural':put('mural',{life:4,r:330,damage:damage*.5,cause:'petals'});break;
case 'spotlight':at('spotlight',{life:3,target:target.id,r:160,damage:damage*.5,cause:'erase'});break;
case 'orrery':for(let i=0;i<3;i++)put('planet',{life:6,phase:i*TAU/3,r:40,damage:damage*.7,cause:'burn'});break;
case 'scrapColossus':at('pull',{life:2.4,r:260,damage:damage*.8,giant:true,cause:'crumple'});break;
case 'skyWhale':shot('whale',{life:4,speed:105,r:115,damage:damage*.5,cause:'soak'});break;
case 'autumnGuardian':put('shield',{life:4,r:170,reflect:true,damage:damage*.7,cause:'petals'});break;
case 'paperCosmos':at('portal',{life:3.5,r:170,outX:p.x-Math.cos(a)*270,outY:p.y-Math.sin(a)*270,cosmos:true,damage:damage*1.7,cause:'erase'});at('void',{life:3.2,r:270,damage:damage*.35,cause:'erase'});break;
case 'comet':for(let i=0;i<5;i++)delayed(target.x+(i-2)*70,target.y+(i%2)*70,.4+i*.17,95,'burn');put('beam',{life:1.8,delay:.6,r:640,width:24,damage:damage*.35,cause:'erase'});break;
case 'garden':put('garden',{life:5.5,r:230,damage:damage*.38,cause:'petals'});break;
case 'aurora':for(let i=0;i<5;i++){let aa=i*TAU/5;put('stormNode',{x:target.x+Math.cos(aa)*150,y:target.y+Math.sin(aa)*150,life:3.7,r:55,damage:damage*.6,phase:i,cause:'soak'});}break;
case 'tempest':put('cyclone',{life:4.6,r:220,damage:damage*.33,cause:'crumple'});break;
case 'nova':at('nova',{life:2.6,r:260,damage:damage,cause:'burn'});break;
case 'dragon':shot('dragonSpirit',{life:7,speed:155,r:65,damage:damage*.6,cause:'confetti'});break;
case 'mirror':put('mirrorArena',{life:4,r:240,damage:damage*.45,cause:'freeze'});break;
}
game.telemetry.casts[k]=(game.telemetry.casts[k]||0)+1;Sound.play(k,.42,.95,.15);if(evo){game.fx.push({type:'fusion',x:p.x,y:p.y,life:.6,max:.6,r:90,color:d.color});game.shake=Math.max(game.shake,2);}}
function castAdvancedWeapons(dt){for(let [k,d] of Object.entries(weaponData)){if(!(MORE_WEAPONS[k]||EVOLVED_PATTERNS[k])||!game.weapons[k]||game.clocks[k]>0)continue;let lv=game.weapons[k],target=selectWeaponTarget(k,game.hero.x,game.hero.y-24,weaponRange(k,lv),null,15+lv*7);if(!target&&k==='mine')target={x:game.hero.x+game.hero.dirX*120,y:game.hero.y+game.hero.dirY*120};if(!target)continue;game.clocks[k]=Math.max(.4,(d.cd||EVOLVED_PATTERNS[k]?.cd||3)*(1-(lv-(d.evolved?5:1))*.045));advancedCast(k,lv,target);}updateConstructs(dt);}
function constructTarget(o,max=650){
 let e=o.targetEnemy;
 if(!e||e.hp<=0||o.hit.has(e.id)||distance(e,o)>max){if(game.t<(o.nextAim||0))return null;o.nextAim=game.t+.1;e=o.targetEnemy=selectWeaponTarget(o.kind+':construct:'+o.id,o.x,o.y,max,o.hit,o.damage,o.kind);}
 else if(game.t>=(o.nextClaim||0)){o.nextClaim=game.t+.35;game.aimClaims.set(o.kind+':construct:'+o.id,{id:e.id,damage:o.damage,until:game.t+.7});}
 return e;
}
function updateConstructs(dt){let p=game.hero;for(let o of game.constructs){o.px=o.x;o.py=o.y;if(o.follow){o.x=p.x;o.y=p.y-24;}o.previousAge=o.age;o.age+=dt;o.life-=dt;o.tick-=dt;let active=o.age>=o.delay,tick=o.tick<=0;if(!active)continue;if(tick)o.tick=.25;let u=clamp((o.age-o.delay)/Math.max(.1,o.max-o.delay),0,1),a=o.a+(o.spin||0)*(o.age-o.delay),ca=Math.cos(a),sa=Math.sin(a),live=()=>game.enemies.filter(e=>e.hp>0);
switch(o.mode){
case 'slash':case 'whip':{let geometry=attackGeometry(o),from=o.lastSwing??geometry.start;for(let e of game.enemies)if(e.hp>0&&!o.hit.has(e.id)&&swingContains(e,o,geometry,from)){o.hit.add(e.id);hit(e,o.damage*(o.mode==='whip'&&distance(e,o)>o.r*.65?1.7:1),o.x,o.y,150,false,o.cause);if(o.stun)e.stun=o.stun;}o.lastSwing=geometry.head;}break;
case 'cone':if(!o.done){o.done=true;let g=attackGeometry(o);for(let e of game.enemies)if(e.hp>0&&swingContains(e,o,g,g.start)){hit(e,o.damage,o.x,o.y,150,false,o.cause);e.stun=o.stun;}}break;
case 'thrust':{let g=attackGeometry(o);for(let e of game.enemies)if(e.hp>0&&!o.hit.has(e.id)&&lineDistance(e,g.x,g.y,g.x2,g.y2)<g.width+e.r){o.hit.add(e.id);hit(e,o.damage,g.x,g.y,150,false,o.cause);}}break;
case 'beam':if(tick){let g=attackGeometry(o);combatLine(o,g.x,g.y,g.x2,g.y2,g.width);}break;
case 'bounce':case 'rocket':case 'notes':case 'leaf':case 'yoyo':case 'gear':{let target;if(o.mode==='bounce'||o.mode==='rocket')target=constructTarget(o,650);if(target){let aim=Math.atan2(target.y-o.y,target.x-o.x);o.a=o.mode==='bounce'?aim:o.a+Math.atan2(Math.sin(aim-o.a),Math.cos(aim-o.a))*Math.min(1,dt*3);}if(o.mode==='rocket')o.speed=Math.min(580,o.speed+dt*260);
let px=o.x,py=o.y;if(o.mode==='gear'){let rr=Math.sin(u*Math.PI)*220,aa=o.age*6;o.x=p.x+Math.cos(aa)*rr;o.y=p.y+Math.sin(aa)*rr;}else if(o.mode==='yoyo'){let rr=Math.sin(u*Math.PI)*290;o.x=p.x+Math.cos(o.a)*rr;o.y=p.y-24+Math.sin(o.a)*rr;if(u>.5&&!o.returned){o.hit.clear();o.returned=true;}}else {if(o.mode==='leaf'){if(u>.5){let aim=Math.atan2(p.y-o.y,p.x-o.x);o.a+=Math.atan2(Math.sin(aim-o.a),Math.cos(aim-o.a))*Math.min(1,dt*6);}else o.a+=dt;}let aa=o.a+(o.mode==='notes'?Math.sin(o.age*10+(o.phase||0))*.55:0);o.x+=Math.cos(aa)*o.speed*dt;o.y+=Math.sin(aa)*o.speed*dt;}
for(let e of game.enemies){if(e.hp<=0||o.hit.has(e.id)||lineDistance(e,px,py,o.x,o.y)>o.r+e.r)continue;o.hit.add(e.id);hit(e,o.damage,px,py,65,false,o.cause);if(o.mode==='bounce'){o.bounces--;o.damage*=1.06;if(o.burst)combatArea(o,o.x,o.y,55,o.damage*.3);if(o.bounces<=0)o.life=0;break;}if(o.mode==='rocket'){combatArea(o,o.x,o.y,110,o.damage,180);game.fx.push({type:'explosion',x:o.x,y:o.y,r:110,life:.5,max:.5,color:o.color});o.life=0;break;}}
}break;
case 'stamp':if(!o.done){o.done=true;combatArea(o,o.x,o.y,o.r,o.damage,170);game.shake=Math.max(game.shake,4);game.fx.push({type:'explosion',x:o.x,y:o.y,r:o.r,life:.5,max:.5,color:o.color});Sound.play('explosion',.35,.85,.15);}break;
case 'mine':if(o.age>=o.delay&&nearest(o.x,o.y,o.r)){combatArea(o,o.x,o.y,o.blastR,o.damage,170);o.life=0;game.fx.push({type:'explosion',x:o.x,y:o.y,r:o.blastR,life:.5,max:.5,color:o.color});}break;
case 'turret':case 'castle':case 'friend':{if(o.mode==='castle'){o.x+=(p.x-80-o.x)*dt*1.5;o.y+=(p.y+40-o.y)*dt*1.5;}let e=constructTarget(o,600);if(!e)break;o.a=Math.atan2(e.y-(o.y-25),e.x-o.x);if(o.mode==='friend'){let dist=distance(e,o);o.x+=(e.x-o.x)/Math.max(1,dist)*o.speed*dt;o.y+=(e.y-o.y)/Math.max(1,dist)*o.speed*dt;if(tick&&dist<o.r+e.r){hit(e,o.damage*.5,o.x,o.y,120,false,o.cause);o.x-=Math.cos(o.a)*22;o.y-=Math.sin(o.a)*22;}}else {o.fireCd=(o.fireCd||0)-dt;if(o.fireCd<=0){o.fireCd=o.mode==='castle'?.5:.65;fireBullet('pencil',o.x,o.y-25,o.a,450,o.damage,3);if(o.mode==='castle'&&Math.random()<.45)construct(o.kind,'friend',o.x,o.y,o.a,o.lv,{life:2.5,speed:240,r:30,damage:o.damage});}}}break;
case 'thread':if(o.collapse)for(let pt of o.points){pt.x+=(o.x-pt.x)*dt*.25;pt.y+=(o.y-pt.y)*dt*.25;}if(tick)for(let i=1;i<o.points.length;i++)combatLine(o,o.points[i-1].x,o.points[i-1].y,o.points[i].x,o.points[i].y,8);break;
case 'paint':if(tick)combatLine(o,o.x,o.y,o.x+ca*o.r*Math.min(1,o.age*2),o.y+sa*o.r*Math.min(1,o.age*2),o.width);break;
case 'wall':if(tick)combatLine(o,o.x-sa*o.r,o.y+ca*o.r,o.x+sa*o.r,o.y-ca*o.r,18);for(let e of game.enemies)if(e.hp>0&&lineDistance(e,o.x-sa*o.r,o.y+ca*o.r,o.x+sa*o.r,o.y-ca*o.r)<e.r+20){let sign=(e.x-o.x)*ca+(e.y-o.y)*sa>0?1:-1;e.x+=ca*sign*100*dt;e.y+=sa*sign*100*dt;}break;
case 'mark':{let e=game.enemies.find(e=>e.id===o.target&&e.hp>0);if(e){o.x=e.x;o.y=e.y;if(tick)hit(e,o.damage,o.x-10,o.y,0,false,'erase');}else o.life=0;}break;
case 'pull':case 'void':for(let e of game.enemies)if(e.hp>0&&distance(e,o)<o.r){let d=distance(e,o)||1,m=e.elite?.22:1;e.x+=(o.x-e.x)/d*dt*95*m;e.y+=(o.y-e.y)/d*dt*95*m;if(tick)hit(e,o.damage,o.x,o.y,0,false,o.cause);}if(o.life<.22&&!o.done){o.done=true;combatArea(o,o.x,o.y,o.r,o.damage*4,250);game.fx.push({type:'explosion',x:o.x,y:o.y,r:o.r,life:.5,max:.5,color:o.color});}break;
case 'rain':if(tick)combatArea(o);break;
case 'kite':o.x=p.x+Math.cos(o.age*1.7+o.a)*o.r;o.y=p.y+Math.sin(o.age*1.7+o.a)*o.r;if(tick)combatLine(o,p.x,p.y,o.x,o.y,12);break;
case 'shield':o.x=p.x;o.y=p.y;if(tick)combatArea(o,o.x,o.y,o.r,o.damage,160);for(let b of game.enemyBullets)if(b.life>0&&distance(b,o)<o.r){let blocked=breakEnemyBullet(b,3,'shield'+o.id);if(blocked&&o.reflect)fireBullet('frost',b.x,b.y,Math.atan2(-b.vy,-b.vx),330,o.damage*2,4);}break;
case 'portal':for(let e of game.enemies)if(e.hp>0&&!o.hit.has(e.id)&&distance(e,o)<o.r){o.hit.add(e.id);hit(e,o.damage,o.x,o.y,0,false,o.cause);if(!e.boss){e.x=o.outX+rnd(-35,35);e.y=o.outY+rnd(-35,35);e.stun=.5;}}if(o.cosmos&&o.life<.3&&!o.done){o.done=true;combatArea(o,o.outX,o.outY,200,o.damage*2,170);}break;
case 'festival':if(tick){let step=Math.floor((o.age-o.delay)*5);if(step!==o.step){o.step=step;for(let i=0;i<8;i++){let aa=i*TAU/8+step*.2;construct(o.kind,'stamp',o.x+Math.cos(aa)*step*38,o.y+Math.sin(aa)*step*38,aa,o.lv,{delay:.18,life:.5,r:45,damage:o.damage*.4,cause:'burn'});}}}break;
case 'mural':if(tick){let rr=o.r*u;for(let e of game.enemies)if(e.hp>0&&Math.abs(distance(e,o)-rr)<55)hit(e,o.damage,o.x,o.y,130,false,'petals');}break;
case 'spotlight':{let e=game.enemies.find(e=>e.id===o.target&&e.hp>0);if(e){o.x+=(e.x-o.x)*dt*2;o.y+=(e.y-o.y)*dt*2;}if(tick)combatArea(o,o.x,o.y,o.r*(1-u*.6));if(o.life<.25&&!o.done){o.done=true;for(let i=0;i<16;i++)fireBullet('star',o.x,o.y,i*TAU/16,330,o.damage*2,4);}}break;
case 'planet':{let rr=115+o.age*16,aa=o.age*1.9+o.phase;o.x=p.x+Math.cos(aa)*rr;o.y=p.y+Math.sin(aa)*rr;if(tick)combatArea(o);if(o.life<.25&&!o.done){o.done=true;combatArea(o,o.x,o.y,130,o.damage*4,180);}}break;
case 'whale':case 'dragonSpirit':{let e=constructTarget(o,700);if(e&&o.mode==='dragonSpirit'){let aa=Math.atan2(e.y-o.y,e.x-o.x);o.a+=Math.atan2(Math.sin(aa-o.a),Math.cos(aa-o.a))*dt*1.8;}o.x+=Math.cos(o.a)*o.speed*dt;o.y+=Math.sin(o.a)*o.speed*dt;if(tick){combatArea(o);if(o.mode==='whale')construct(o.kind,'rain',o.x,o.y,o.a,o.lv,{life:1.5,r:80,damage:o.damage*.25,cause:'soak'});}break;}
case 'garden':case 'cyclone':o.x=p.x;o.y=p.y;if(tick){for(let e of game.enemies)if(e.hp>0&&distance(e,o)<o.r){hit(e,o.damage,o.x,o.y,12,false,o.cause);e.slow=.3;if(o.mode==='cyclone'&&!e.elite){e.x+=(o.x-e.x)*.06;e.y+=(o.y-e.y)*.06;}}}break;
case 'stormNode':if(tick){let e=nearest(o.x,o.y,230);if(e){hit(e,o.damage,o.x,o.y,25,false,'soak');game.fx.push({type:'chain',x:o.x,y:o.y-45,x2:e.x,y2:e.y,life:.2,max:.2,seed:o.id});}}break;
case 'nova':if(tick){let r=o.r*Math.abs(Math.sin(u*Math.PI*2));for(let e of game.enemies)if(e.hp>0&&Math.abs(distance(e,o)-r)<42)hit(e,o.damage*.6,o.x,o.y,100,false,'burn');}break;
case 'mirrorArena':o.x=p.x;o.y=p.y;if(tick){for(let e of game.enemies)if(e.hp>0&&distance(e,o)<o.r){e.slow=.5;hit(e,o.damage,o.x,o.y,20,false,'freeze');}}for(let b of game.enemyBullets)if(b.life>0&&distance(b,o)<o.r){if(!breakEnemyBullet(b,3,'mirror'+o.id))continue;fireBullet('frost',b.x,b.y,Math.atan2(-b.vy,-b.vx),350,o.damage*2,4);}break;
}}
compact(game.constructs,o=>o.life>0&&distance(o,p)<1700);if(game.bullets.length>180)game.bullets.splice(0,game.bullets.length-180);if(game.enemyBullets.length>120)game.enemyBullets.splice(0,game.enemyBullets.length-120);
}
function renderConstructs(){for(let o of game.constructs)renderBattleConstruct(o);}
