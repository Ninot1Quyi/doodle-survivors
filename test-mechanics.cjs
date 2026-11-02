const fs=require('fs'),vm=require('vm'),assert=require('assert');
const painter=new Proxy({createPattern:()=>({})},{get:(t,k)=>k in t?t[k]:()=>{},set:(t,k,v)=>(t[k]=v,true)});
const nodes=new Map();function node(){return{style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},firstElementChild:{style:{},textContent:''},getContext:()=>painter,getBoundingClientRect:()=>({width:1350,height:800}),toDataURL:()=>'',focus(){},replaceChildren(){},append(){},addEventListener(){},setAttribute(){},querySelector:()=>node()};}
const sandbox={console,Math,Set,Map,EDITION:'adventure',document:{querySelectorAll:()=>[],getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},createElement:()=>node(),querySelector:()=>node(),body:node(),addEventListener(){}},window:{addEventListener(){}},devicePixelRatio:1,ResizeObserver:class{observe(){}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},HTMLInputElement:class{},Art:new Proxy({sprites:{},url:()=>'',ground:{}},{get:(t,k)=>k in t?t[k]:()=>{}}),Sound:{start(){},play(){},duck(){},volumes(){},toggle(){},unlock(){}}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/dist/items.js','utf8'),sandbox);vm.runInContext(fs.readFileSync(__dirname+'/dist/expansion.js','utf8'),sandbox);vm.runInContext(fs.readFileSync(__dirname+'/dist/game.js','utf8'),sandbox);const run=s=>vm.runInContext(s,sandbox);
run('start()');assert.equal(run('state'),'playing');assert.equal(run('game.enemies.length'),45);assert.equal(run('Object.keys(game.weapons).filter(k=>game.weapons[k]>0).length'),4);assert.equal(run('game.allies'),undefined);
run("keys.add('d');update(.1);keys.clear()");assert(run('game.hero.x')>0);run('dash()');let cd=run('game.hero.dashCd');run('dash()');assert.equal(run('game.hero.dashCd'),cd);
run('pause()');let t=run('game.t');run('update(1)');assert.equal(run('game.t'),t);run('pause()');
run('game.hero.inv=0;playerHurt(10,game.hero.x-5,game.hero.y)');let hp=run('game.hero.hp');assert(hp<120);run('playerHurt(10,0,0)');assert.equal(run('game.hero.hp'),hp);
run("start();game.hero.x=10000;game.hero.y=-12000;keys.add('d');update(.1);keys.clear()");assert(run('game.hero.x')>10000,'infinite world must not clamp player');assert(run('props.length')<600,'chunk props remain bounded');
for(const id of ['comet','garden','aurora','tempest','nova','dragon','mirror']){
 run(`start();{let r=RECIPES.find(r=>r[2]==='${id}');game.weapons[r[0]]=4;game.weapons[r[1]]=5;}`);assert.equal(run(`fuseWeapon('${id}')`),false);
 run(`{let r=RECIPES.find(r=>r[2]==='${id}');game.weapons[r[0]]=5;}`);assert.equal(run(`fuseWeapon('${id}')`),true);assert.equal(run(`game.weapons.${id}`),5);assert.equal(run(`fuseWeapon('${id}')`),false,'cannot duplicate fusion');
 assert(run(`RECIPES.find(r=>r[2]==='${id}').slice(0,2).every(k=>game.weapons[k]===0&&game.consumed.has(k))`));
 run(`state='upgrade';upgradeChoices=['${id}'];upgradeRarity=[2];chooseUpgrade(0)`);assert.equal(run(`game.weapons.${id}`),7);
 run(`state='upgrade';upgradeChoices=['${id}'];upgradeRarity=[2];chooseUpgrade(0)`);assert.equal(run(`game.weapons.${id}`),8);
}
run("start();game.enemies=[];game.spawnClock=999;game.hero.x=185;game.hero.y=70;game.hero.moving=false;updateWorld(1)");assert.equal(run('game.completedEvents.has("welcome")'),false);run('updateWorld(2.1)');assert(run('game.completedEvents.has("welcome")'));let ec=run('game.eventCount');run('updateWorld(5)');assert.equal(run('game.eventCount'),ec,'events reward only once');
run('start();game.enemies=[];spawnEnemy("imp",10,70);hit(game.enemies[0],999,0,0)');assert(run('game.gems.length')>0);assert(run('game.xp')>0);
run('game.enemies=[];game.spawnClock=100;game.xp=game.need;update(.016)');assert.equal(run('state'),'upgrade');run('chooseUpgrade(0)');assert.equal(run('state'),'playing');
run('game.hero.storm=100;storm()');assert.equal(run('game.hero.storm'),0);run('storm()');assert.equal(run('game.hero.storm'),0);
for(const at of [90,210,330]){run(`start();game.t=${at};update(.016)`);assert(run('game.enemies.some(e=>e.boss)'));}
run('start();game.enemies=[];game.spawnClock=100;game.t=360;game.bossKilled=false;update(.02)');assert.notEqual(run('state'),'ended');run('game.bossKilled=true;update(.02)');assert.equal(run('state'),'ended');
// Pickup effects, finite timers, shield charges and repeat-proof parcel loot.
run("start();game.hero.hp=40;useItem('heal')");assert.equal(run('game.hero.hp'),85);
run("useItem('cookie')");assert.equal(run('game.hero.hp'),110);assert(run('game.xp')>=8);
run("game.gems=[{x:5000,y:5000}];useItem('magnet')");assert(run('game.gems[0].attracted'));
run("useItem('umbrella');game.hero.inv=0;playerHurt(50,0,0)");assert.equal(run('game.hero.hp'),110);assert.equal(run('game.shieldCharges'),2);
run("game.hero.inv=0;playerHurt(50,0,0);game.hero.inv=0;playerHurt(50,0,0)");assert.equal(run('game.shieldCharges'),0);assert.equal(run('game.buffs.shield'),0);
for(let kind of ['feather','hourglass','rainbow','honey','snowglobe'])run(`useItem('${kind}')`);
assert(run('game.buffs.speed===12&&game.buffs.slow===12&&game.buffs.power===12&&game.buffs.regen===15&&game.buffs.freeze===5'));
run("game.hero.storm=10;useItem('firefly')");assert.equal(run('game.hero.storm'),55);
let maxhp=run('game.hero.maxHp');run("useItem('needle')");assert.equal(run('game.hero.maxHp'),maxhp+10);
let rerolls=run('game.rerolls');run("useItem('ticket')");assert.equal(run('game.rerolls'),rerolls+1);assert(run('game.luckyNext'));
run("useItem('scroll');worldCaches=[];updateItems(16)");assert(run('Object.values(game.buffs).every(v=>v===0)'));
run("start();game.hero.x=60;game.hero.y=320;updateItems(.1)");let loot=run('game.pickups.length');assert.equal(loot,2);run('updateItems(.1)');assert.equal(run('game.pickups.length'),loot);
// Every new weapon must create attack objects and reduce enemy health when simulated.
const newWeapons=run('Object.keys(EXTRA_WEAPONS).filter(k=>!EXTRA_WEAPONS[k].passive)');
for(const k of newWeapons){run(`start();game.enemies=[];game.spawnClock=999;for(let key in game.weapons)game.weapons[key]=0;game.weapons.${k}=5;game.clocks.${k}=0;for(let i=0;i<12;i++)spawnEnemy('snail',Math.cos(i)*100,70+Math.sin(i)*80);`);const health=run('game.enemies.reduce((s,e)=>s+e.hp,0)');run("for(let i=0;i<90;i++){game.hero.inv=100;game.need=999999;update(1/60)}");assert(run('game.enemies.reduce((s,e)=>s+e.hp,0)')<health,k+' must deal damage');}
run(`start();game.hero.hp=game.hero.maxHp=100000;for(let i=0;i<23000&&state!=='ended';i++){if(state==='upgrade'){let index=upgradeChoices.findIndex(k=>k.startsWith('fusion:'));chooseUpgrade(index<0?0:index);}else{keys.clear();keys.add(['d','s','a','w'][Math.floor(i/180)%4]);if(game.hero.storm>=100&&i%90===0)storm();update(1/60);}}`);
assert(run('game.t')>=360||run('state')==='ended');assert(run('game.level')>=15);assert(run('game.kills')>100);assert(run('game.enemies.length')<280);assert(run('Number.isFinite(game.hero.x)&&Number.isFinite(game.hero.hp)'));
console.log('PASS: single hero, movement, cooldowns, pause, hurt invulnerability, unbounded world, seven fusion prerequisites/consumption/extra levels, repeat-proof events, XP and upgrades, ultimate, all three boss spawns/victory gate, damage from every new weapon.');
console.log('360s scripted stability run (extra health, not normal balance):',run('JSON.stringify({time:Math.floor(game.t),kills:game.kills,level:game.level,enemies:game.enemies.length,bosses:game.bossesDefeated,fusions:game.fusions})'));
