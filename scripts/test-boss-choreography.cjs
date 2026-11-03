const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../public/boss-choreography.js','utf8');
function setup(kind='bossRose'){
 const sounds=[],hits=[],e={id:1,kind,boss:true,x:0,y:0,r:48,hp:1000,maxHp:1000,damage:22,speed:25};
 const g={enemies:[e],hero:{x:280,y:0,r:16},enemyBullets:[],enemyShotSerial:1,buffs:{freeze:0}};
 const painter=new Proxy({},{get:()=>()=>{},set:()=>true});
 const box={game:g,state:'playing',reducedEffects:false,ctx:painter,Math,Sound:{bossAction:(...a)=>sounds.push(a),sustain(){}},playerHurt:(...a)=>hits.push(a)};
 vm.createContext(box);for(const name of ['kinetic-art','boss-choreography-art'])vm.runInContext(fs.readFileSync(__dirname+'/../public/'+name+'.js','utf8'),box);vm.runInContext(source,box);box.bossCombatBehavior(e,0,280,0,280);
 return {box,g,e,hits,sounds,tick:n=>{for(let i=0;i<n;i++)box.updateBossChoreography(.025);}};
}
const kinds=['bossRose','bossCrab','bossOwl','bossClock','bossMoon'];
for(const kind of kinds){
 const {box,g,e,hits,sounds,tick}=setup(kind),seen=new Set();let previousPhase=e.choreography.phase;
 for(let i=0;i<1800;i++){
  const q=e.choreography,x=e.x,y=e.y,phase=q.phase;
  if(q.action){seen.add(q.action.type);if(q.phase==='windup')assert.equal(box.bossChoreographyContains(q.action,g.hero),false,'warnings cannot hurt');}
  tick(1);if(phase==='recover'&&q.phase==='recover')assert.deepEqual([e.x,e.y],[x,y],'recovery must not move');
  assert.ok(g.bossChoreography.objects.length<=24);assert.ok(g.enemyBullets.length<=130);
  box.renderBossChoreography();const pose=box.bossChoreographyPose(e);assert.ok(Object.values(pose).every(Number.isFinite));previousPhase=q.phase;
 }
 assert.equal(seen.size,4,kind+' must have four different attacks');
 assert.ok(sounds.some(s=>s[1]==='tell'));assert.ok(sounds.some(s=>s[1]==='cast'));
 e.hp=400;tick(240);assert.equal(e.choreography.rage,true);assert.equal(sounds.filter(s=>s[1]==='rage').length,1);
 // Pause and freeze stop all stage clocks, motion and projectile emission.
 const snapshot=()=>JSON.stringify({q:e.choreography.age,phase:e.choreography.phase,x:e.x,y:e.y,objects:g.bossChoreography.objects.map(o=>o.age),bullets:g.enemyBullets.length});
 box.state='paused';let before=snapshot();tick(100);assert.equal(snapshot(),before);box.state='playing';g.buffs.freeze=2;before=snapshot();tick(100);assert.equal(snapshot(),before);g.buffs.freeze=0;
 // Owner death clears fired projectiles as well as ongoing beams/telegraphs.
 g.enemyBullets.push({bossOwner:e,life:2});e.hp=0;tick(1);assert.equal(g.bossChoreography.objects.length,0);assert.equal(g.enemyBullets.length,0);
}
{
 const {box,g,e,tick}=setup('bossOwl');
 const base={owner:e,x:0,y:0,a:0,age:.5,duration:1,length:480,width:15,r:300,spread:1.4,gap:.78};
 const beam={...base,type:'beam'};
 assert.equal(box.bossChoreographyContains(beam,{x:200,y:0,r:0}),true);
 assert.equal(box.bossChoreographyContains(beam,{x:200,y:40,r:0}),false);
 assert.equal(box.bossChoreographyContains(beam,{x:510,y:0,r:0}),false,'beam must have finite reach');
 assert.equal(box.bossChoreographyContains(beam,{x:-30,y:0,r:0}),false);
 const wave={...base,type:'wave'},r=box.bossChoreographyGeometry(wave).r;
 assert.equal(box.bossChoreographyContains(wave,{x:r,y:0,r:0}),true);
 assert.equal(box.bossChoreographyContains(wave,{x:-r,y:0,r:0}),false,'wave safe opening must really be safe');
 assert.equal(box.bossChoreographyContains(wave,{x:0,y:0,r:0}),false,'wave is an annulus, not a filled disk');
 const sweep={...base,type:'sweep'};assert.equal(box.bossChoreographyContains(sweep,{x:150,y:0,r:0}),true);assert.equal(box.bossChoreographyContains(sweep,{x:0,y:150,r:0}),false);
 const disk={...base,type:'disk',spots:[{x:200,y:200,r:51}]};assert.equal(box.bossChoreographyContains(disk,{x:200,y:200,r:0}),true);assert.equal(box.bossChoreographyContains(disk,{x:0,y:0,r:0}),false);
 const rush={...base,type:'rush',lastDt:.1};assert.equal(box.bossChoreographyContains(rush,{x:220,y:0,r:0}),true);assert.equal(box.bossChoreographyContains(rush,{x:450,y:0,r:0}),false,'rush collision follows body, not whole preview');
 tick(43);const q=e.choreography,angle=q.action.a;g.hero.x=-500;g.hero.y=500;tick(10);assert.equal(q.action.a,angle,'aim locks for the whole warning');
 const anchor=[q.anchorX,q.anchorY];e.x+=150;e.y-=120;e.kx=800;e.ky=600;tick(1);assert.deepEqual([e.x,e.y],anchor,'external push cannot move the locked warning origin');assert.deepEqual([e.kx,e.ky],[0,0]);
 g.enemyBullets.push({bossOwner:e,life:2});e.x=800;e.y=500;box.cancelBossChoreography(e);assert.equal(g.bossChoreography.objects.length,0);assert.equal(g.enemyBullets.length,0);assert.equal(q.phase,'approach');assert.deepEqual([e.x,e.y],[800,500],'teleport cancellation preserves the new position');
 box.resetBossChoreography();assert.equal(g.bossChoreography.objects.length,0);assert.equal(e.choreography,undefined);
}
for(const kind of ['boss','bossFrog','bossCloud','bossSerpent','bossGolem','bossMoth','bossJelly','bossDragon','bossInk']){const {tick,e}=setup(kind);tick(200);assert.ok(e.choreography.turn>0,'legacy bosses must retain functioning attacks');}
// Exercise the real update loop as well as the isolated geometry/state machine.
{
 const {run}=require('./test-harness.cjs');
 for(const kind of kinds){
  run(`start();game.enemies=[];game.spawnClock=game.advancedSpawnClock=game.advancedEliteClock=999;game.need=1e9;game.hero.inv=999;for(const k in game.weapons)game.weapons[k]=0;spawnEnemy('${kind}',240,70);game.enemies[0].hp=game.enemies[0].maxHp=100000;`);
  const seen=run(`(()=>{const seen=new Set();for(let i=0;i<1600;i++){update(1/60);const q=game.enemies.find(e=>e.boss)?.choreography;if(q?.action)seen.add(q.action.type);}return Array.from(seen)})()`);
  assert.equal(seen.length,4,kind+' must reach all four actions through the real game loop');
  assert.equal(run('game.enemies.find(e=>e.boss).intent'),null,'legacy intents cannot run alongside choreography');
  run('(()=>{const e=game.enemies.find(e=>e.boss);game.enemyBullets.push({bossOwner:e,life:2});hit(e,1e9,0,0,0)})()');
  assert.equal(run('game.bossChoreography.objects.length'),0,'death clears active attacks in the same frame');
  assert.equal(run('game.enemyBullets.filter(b=>b.bossOwner).length'),0,'death clears fired boss bullets in the same frame');
 }
}
console.log('Boss choreography: five distinct four-action rosters, rage, finite collision, safe gaps, locked aim, recovery, pause/freeze, caps and owner cleanup pass.');
