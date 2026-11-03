const assert=require('assert'),{run}=require('./test-harness.cjs');
run(`start();game.enemies=[];game.hero.x=0;game.hero.y=0;for(let i=0;i<6;i++){spawnEnemy('snail',100+i*8,0);game.enemies.at(-1).hp=100;}`);
assert.equal(run(`new Set(['pencil','fire','star','rocket','plane','lance'].map(k=>selectWeaponTarget(k,0,0,700,null,50).id)).size`),6,'six casts distribute reserved damage among six comparable targets');
run('game.t+=3;selectWeaponTarget("expired",0,0)');assert.equal(run('game.aimClaims.size'),1);
run(`game.enemies=[];game.constructs=[];props=[];for(let i=0;i<10;i++)placeMinefield(5,40)`);
assert(run(`game.constructs.length>4&&game.constructs.length<=12`));
assert(run(`game.constructs.every((a,i)=>game.constructs.every((b,j)=>i===j||distance(a,b)>=82))`),'stationary casts preserve mine separation');
assert(run(`game.constructs.every(m=>m.delay===.6&&m.blastR>m.r)`));
run(`game.constructs=[];let mine=construct('mine','mine',150,0,0,5,{life:12,delay:.6,r:39,blastR:135,damage:80});spawnEnemy('snail',150,0);game.enemies[0].hp=10000;updateConstructs(.3)`);assert.equal(run('game.enemies[0].hp'),10000,'mines never detonate during arming');run('updateConstructs(.31)');assert(run('game.enemies[0].hp<10000&&game.constructs.length===0'));
run(`start();game.enemies=[];game.hero.x=200;game.hero.y=50;spawnEnemy('beetle',0,0);enemyWarn(game.enemies[0],'charge',.8);let intent=game.enemies[0].intent;game.hero.x=-200;game.hero.y=-100`);
assert(run('Math.abs(intent.a-Math.atan2(50,200))<1e-10'),'charge locks announced direction');run('advanceEnemyAction(game.enemies[0],.8);for(let i=0;i<65;i++)advanceEnemyAction(game.enemies[0],.01)');assert(run('Math.abs(Math.hypot(game.enemies[0].x,game.enemies[0].y)-intent.range)<1e-6'),'charge distance exactly matches warning lane');
for(let type of ['leap','stomp','paint','clock','cloud','serpent']){run(`start();game.enemies=[];game.hazards=[];spawnEnemy('bossFrog',0,0);enemyWarn(game.enemies[0],'${type}',.8,{x:120,y:75,r:65,n:5});var q=game.enemies[0].intent;resolveEnemyIntent(game.enemies[0],q)`);assert(run('q.spots.length>0&&q.spots.every(s=>game.hazards.some(h=>h.x===s.x&&h.y===s.y&&h.r===s.r))'),type+' warning/damage footprints match');}
run(`start();game.enemies=[];spawnEnemy('frog',0,0);enemyWarn(game.enemies[0],'leap',1);game.buffs.freeze=1;advanceEnemyAction(game.enemies[0],.4)`);assert.equal(run('game.enemies[0].intent.left'),1,'freeze pauses intent countdown');
run(`let swing={mode:'slash',x:50,y:30,a:0,r:120,width:1,max:1,delay:0,age:.1};let early=attackGeometry(swing)`);assert(!run('swingContains({x:150,y:90,r:1},swing,early,early.start)'),'unswept blade region cannot deal damage');run('swing.age=.95;let late=attackGeometry(swing)');assert(run('swingContains({x:150,y:90,r:1},swing,late,early.head)'));
run(`let thrust={mode:'thrust',x:20,y:40,a:Math.PI/2,r:200,max:1,delay:.2,age:.5};let tg=attackGeometry(thrust)`);assert(run('Math.abs(tg.x2-20)<1e-8&&tg.y2>tg.y&&tg.y2<=240'));
assert(run('Object.keys(WEAPON_PRESENTATION).length===63&&Object.keys(weaponData).filter(k=>!weaponData[k].passive).every(k=>WEAPON_PRESENTATION[k])'),'every selectable weapon has an explicit presentation');
run(`start();game.enemies=[];spawnEnemy('bossMoon',0,0);enemyShot(game.enemies[0],0,100,'#aaffff')`);assert.equal(run('game.enemyBullets[0].color'),'#e14755','hostile shot color ignores thematic palettes');
console.log('PASS: target reservations, mine spacing/arming/cap, locked charge geometry, six exact area warnings, frozen intent, swept melee, oriented thrust, 63 visual entries, red hostile shots.');
