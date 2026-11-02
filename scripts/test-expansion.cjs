const assert=require('assert');const {run}=require('./test-harness.cjs');
assert.equal(run('Object.values(weaponData).filter(d=>!d.passive&&!d.evolved).length'),42);
assert.equal(run('RECIPES.length'),21);assert.equal(run('Object.keys(PICKUP_TYPES).length'),39);
assert.equal(run('Object.keys(enemyTypes).filter(k=>!k.startsWith("boss")).length'),36);
assert.equal(run('Object.keys(enemyTypes).filter(k=>k.startsWith("boss")).length'),9);
for(let [a,b,c]of run('RECIPES')){run(`start();game.weapons.${a}=5;game.weapons.${b}=5`);assert(run(`fuseWeapon('${c}')`));assert.equal(run(`game.weapons.${c}`),5);assert(run(`game.consumed.has('${a}')&&game.consumed.has('${b}')`));}
let results=[];
for(let k of run('Object.keys(weaponData).filter(k=>!weaponData[k].passive)')){
run(`start();game.enemies=[];game.spawnClock=999;game.advancedSpawnClock=999;game.need=1e8;game.hero.hp=game.hero.maxHp=99999;for(let k in game.weapons)game.weapons[k]=0;game.weapons['${k}']=weaponData['${k}'].evolved?8:5;game.clocks['${k}']=0;for(let i=0;i<36;i++){let a=i*TAU/36;spawnEnemy('snail',Math.cos(a)*(65+i*6),70+Math.sin(a)*(65+i*6));game.enemies[i].hp=game.enemies[i].maxHp=10000;}`);
let before=run('game.enemies.reduce((s,e)=>s+e.hp,0)');
run(`for(let i=0;i<360;i++){game.hero.inv=999;update(1/60);}`);
let damage=before-run('game.enemies.filter(e=>e.kind==="snail").reduce((s,e)=>s+e.hp,0)');
assert(damage>0, k+' must damage targets via its simulated behavior');assert(run('game.constructs.length<=72'));assert(run('game.constructs.every(o=>Number.isFinite(o.x)&&Number.isFinite(o.y))'));results.push({weapon:k,damage:Math.round(damage)});
}
run("start();game.enemies=[];spawnEnemy('imp',10,70);hit(game.enemies[0],999,0,0,50,false,'burn')");assert.equal(run('game.deathCauses.burn'),1);
run("start();game.coins=50;game.nearShop={id:'test'};toggleShop()");assert.equal(run('state'),'shop');assert(run("buyOffer('ticket')"));assert.equal(run('game.coins'),38);run("game.coins=0");assert.equal(run("buyOffer('ticket')"),false);run('toggleShop()');assert.equal(run('state'),'playing');
run('start();game.t=330;updateEncounters(.01)');assert(run('game.enemies.some(e=>e.kind===game.finalBossKind&&e.finalBoss)'));run('game.t=361;bossDefeated(game.enemies.find(e=>e.finalBoss))');assert.equal(run('state'),'ended');
run("start();game.enemies=[];spawnEnemy('bossMoon',0,0);game.hero.x=10000;game.hero.y=10000;game.hero.inv=100;update(.016)");assert(run("game.enemies.some(e=>e.boss&&distance(e,game.hero)<1500)"),'boss must pursue across infinite-world cells');
require('fs').writeFileSync(__dirname+'/../qa/weapon-verification.json',JSON.stringify(results,null,2));console.log('PASS: 42 base weapons + 21 evolutions each deal damage; all 21 fusion routes consume materials; 39 items / 36 normals / 9 bosses; causes, shop pricing and final boss identity.');
