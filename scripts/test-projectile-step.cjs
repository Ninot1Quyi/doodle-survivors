const assert=require('assert'),fs=require('fs'),vm=require('vm'),{performance}=require('perf_hooks');
const events=[];
const sandbox={Math,Number,Set,Map,console,game:null,
 hit(e,damage,x,y){events.push(['enemy',e.id]);e.hp-=damage;},
 onBulletHit(){},
 explode(x,y,r,damage){events.push(['explosion',x,y]);sandbox.game.parryPulses.push({x,y,r,left:.07});for(let e of sandbox.game.enemies)if(Math.hypot(e.x-x,e.y-y)<r+e.r)e.hp-=damage;},
 playerHurt(damage){events.push(['player']);sandbox.game.hero.hp-=damage;},
 breakEnemyBullet(b,power,key){if(b.life<=0)return false;b.clashedBy??=new Set();if(b.clashedBy.has(key))return false;b.clashedBy.add(key);b.guard=(b.guard||1)-power;if(b.guard>0)return false;b.life=0;events.push(['clash',b.id]);return true;}
};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../public/kinetic-combat.js','utf8'),sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../public/projectile-step.js','utf8'),sandbox);const run=s=>vm.runInContext(s,sandbox);
function reset(){events.length=0;sandbox.game={bullets:[],enemyBullets:[],enemies:[],hero:{x:0,y:1000,r:16,hp:100},buffs:{slow:0},weapons:{fire:0},burns:[],parryPulses:[],enemyShotSerial:100};}
function friendly(x=0,y=0,vx=520,vy=0,pierce=1,damage=10,kind='pencil',life=1){let b={id:sandbox.game.bullets.length+1,x,y,vx,vy,life,pierce,damage,kind,hit:new Set(),size:8};sandbox.game.bullets.push(b);return b;}
function hostile(x,y,vx=0,vy=0,guard=1,life=1){let b={id:100+sandbox.game.enemyBullets.length,x,y,vx,vy,guard,life,r:6,damage:7};sandbox.game.enemyBullets.push(b);return b;}
function enemy(x,y=0,r=14){let e={id:sandbox.game.enemies.length+1,x,y,r,hp:100};sandbox.game.enemies.push(e);return e;}
function step(dt=.05){run(`stepProjectiles(${dt})`);}
// Repro: nearer hostile shot must be intercepted before a farther body can consume a pencil.
reset();let b=friendly(),s=hostile(13,0),e=enemy(38);step();assert.equal(s.life,0);assert.equal(e.hp,100);assert.equal(b.life,0);
// The inverse ordering: a front body stops a one-pierce shot before a farther hostile shot.
reset();b=friendly(0,0,2000);e=enemy(30);s=hostile(80,0);step();assert.equal(e.hp,90);assert.equal(s.life,.95);assert.equal(b.life,0);
// Pierce allows both events, in distance order even if array order is reversed.
reset();b=friendly(0,0,2000,0,3);let far=enemy(80),near=enemy(30);s=hostile(55,0);step();assert.deepEqual(events.map(x=>x[0]),['enemy','clash','enemy']);assert.equal(near.hp,90);assert.equal(far.hp,90);assert.equal(b.life,0);
// Opposing fast shots cross between endpoints. The relative sweep must catch them.
reset();b=friendly(-100,0,4000);s=hostile(100,0,-4000);step();assert.equal(s.life,0);assert.equal(b.life,0);
// Overlapping sweep bounds alone are insufficient: the bodies pass at different times.
reset();b=friendly(-100,0,4000);s=hostile(0,-200,0,4000);step();assert(b.life>0&&s.life>0);
// Very long sweeps take the bounded-grid fallback and still collide across many cells.
reset();b=friendly(-100000,0,4000000);s=hostile(0,0);step();assert.equal(s.life,0);
reset();b=friendly(0,0,0);s=hostile(-100000,0,4000000);step();assert.equal(s.life,0);
// A pair occupying several cells must enter the queue only once.
reset();b=friendly(-100,0,4000);s=hostile(100,0,-4000);step();assert.equal(run('getProjectileStepStats().pairTests'),1);
// Spatial lookup receives enough padding to include a large body beyond the endpoint.
reset();b=friendly();e=enemy(90,0,60);sandbox.around=(x,y,r)=>sandbox.game.enemies.filter(e=>Math.hypot(e.x-x,e.y-y)<=r);run('stepProjectiles(.05,around)');assert.equal(e.hp,90);
// Armor consumes a weak projectile but survives; a second distinct projectile finishes it.
reset();let b1=friendly(0,0,2000),b2=friendly(-10,0,2000);s=hostile(50,0,0,0,2);step();assert.equal(b1.life,0);assert.equal(b2.life,0);assert.equal(s.life,0);assert.equal(s.clashedBy.size,2);
reset();b=friendly(0,0,2000,0,1,50);s=hostile(50,0,0,0,2);step();assert.equal(s.life,0);
// Player contact earlier than a later potential clash is not retroactively cancelled.
reset();sandbox.game.hero.y=0;s=hostile(-100,0,4000);b=friendly(100,0,0);step();assert.equal(sandbox.game.hero.hp,93);assert.equal(b.life,.95);assert.equal(s.life,0);
// An earlier interception prevents a swept enemy shot from hurting the player.
reset();sandbox.game.hero.y=0;s=hostile(-100,0,4000);b=friendly(-50,0,0);step();assert.equal(sandbox.game.hero.hp,100);assert.equal(s.life,0);
// Lifetime clipping: ignore paths after expiry, but resolve valid final-frame collisions.
reset();b=friendly(0,0,1000,0,1,10,'pencil',.01);e=enemy(50,0,1);step();assert.equal(e.hp,100);assert.equal(b.life,0);assert.equal(b.x,10);
reset();b=friendly(0,0,1000,0,1,10,'pencil',.01);e=enemy(15,0,1);step();assert.equal(e.hp,90);assert.equal(b.life,0);assert(Math.abs(b.x-6)<1e-8);
// Fire explodes at contact, not at the far endpoint, and its new pulse can stop later damage.
reset();sandbox.game.hero.x=100;sandbox.game.hero.y=0;b=friendly(0,0,2000,0,1,20,'fire');e=enemy(30);s=hostile(60,0,1000);step();assert.equal(events[0][0],'explosion');assert(Math.abs(events[0][1]-8)<1e-8);assert.equal(s.life,0);assert.equal(sandbox.game.hero.hp,100);assert.equal(sandbox.game.burns.length,1);
// A supplied passive-defense hook sees advanced endpoints and runs before player damage.
reset();sandbox.game.hero.y=0;s=hostile(-100,0,4000);sandbox.defend=()=>{assert.equal(s.x,100);s.life=0;};run('stepProjectiles(.05,null,defend)');assert.equal(sandbox.game.hero.hp,100);
// Dead enemy events don't consume pierce; this shot reaches the next live body instead.
reset();b=friendly(0,0,2000);e=enemy(20);e.hp=0;let second=enemy(70);step();assert.equal(second.hp,90);
// Population-bound workload (not browser FPS): broadphase rejection and event-pool reuse.
reset();for(let i=0;i<245;i++)enemy(1000+(i%20)*50,1000+Math.floor(i/20)*50);for(let i=0;i<180;i++)friendly(i*8,0,100,0,9,10,'pencil',100);for(let i=0;i<130;i++)hostile(i*8,500,100,0,2,100);
sandbox.game.hero.y=-1000;let started=performance.now();for(let i=0;i<120;i++)run('stepProjectiles(1/60)');let stats=run('getProjectileStepStats()');assert.equal(stats.pairTests,0,'swept-grid broadphase rejects separated factions');assert.equal(stats.events,0);
let fallbackMs=performance.now()-started,poolBefore=stats.eventPool;sandbox.around=()=>[];started=performance.now();for(let i=0;i<120;i++)run('stepProjectiles(1/60,around)');let spatialMs=performance.now()-started;assert.equal(run('getProjectileStepStats().eventPool'),poolBefore);
console.log('PASS: chronological body/clash/player events, piercing, armor, relative sweeps, expiration, impact-position explosions, same-step pulses and passive-defense hook.');
console.log(JSON.stringify({note:'CPU-only VM; no rendering/GPU measurement',fallback120StepsMs:+fallbackMs.toFixed(2),emptySpatialGrid120StepsMs:+spatialMs.toFixed(2),...stats}));
