const assert=require('assert');const{run}=require('./test-harness.cjs');
run('start();game.enemies=[]');
assert.equal(run('ENCOUNTER_INDEX.size'),36);
assert.equal(run('EVENT_TYPES.musicBox.hold'),3);assert.equal(run('EVENT_TYPES.musicBox.radius'),105);
run("var chest={id:'qa-chest',type:'musicBox',x:0,y:0};game.hero.x=100;game.hero.y=0;game.hero.moving=true;for(let i=0;i<120;i++){game.t+=1/60;advanceWorldEvent(chest,1/60);}");
assert(Math.abs(run("game.eventProgress['qa-chest']")-2)<1e-8);assert(!run("game.completedEvents.has('qa-chest')"));
run('game.hero.x=200;for(let i=0;i<60;i++){game.t+=1/60;advanceWorldEvent(chest,1/60);}');assert(Math.abs(run("game.eventProgress['qa-chest']")-1.78)<1e-8);
run('game.hero.x=0;for(let i=0;i<73;i++){game.t+=1/60;advanceWorldEvent(chest,1/60);}');assert(!run("game.completedEvents.has('qa-chest')"));run('game.t+=1/60;advanceWorldEvent(chest,1/60)');assert(run("game.completedEvents.has('qa-chest')"));assert.equal(run('game.eventAmbushes.size'),1);
// Unloaded chunk must not preserve charge indefinitely, nor reset a short excursion.
run("start();game.enemies=[];game.eventProgress['qa-chest']=2;game.eventProgressAt['qa-chest']=0;game.t=5;game.hero.x=0;game.hero.y=0;advanceWorldEvent(chest,.1)");assert(Math.abs(run("game.eventProgress['qa-chest']")-1.022)<1e-8);
for(const t of [0,15,30,44,45,65,99,100,125,159,160,190,229,230,270,299,300,350]){
 run(`start();game.enemies=[];game.t=${t}`);const plan=run('encounterPlan(game.t)');
 for(let serial=0;serial<8;serial++){run(`var squad=encounterSquad(encounterPlan(game.t),${serial})`);const squad=run('squad');assert(squad.squad.length<=plan.batch);for(const kind of squad.squad){const info=run(`ENCOUNTER_INDEX.get('${kind}')`);assert(info.unlock<=t,`${kind} premature at ${t}`);assert.equal(info.family,squad.family.key);}}
}
run('start();game.enemies=[];game.t=20;var before=game.director.spawns;updateEncounterDirector(10)');assert.equal(run('game.director.spawns-before'),1,'rest beat has one ordinary arrival');
run("start();game.enemies=[];spawnEnemy('turtle',0,0);game.hero.x=100;game.hero.y=0;game.enemies[0].guarding=true");assert.equal(run('enemyDamageMultiplier(game.enemies[0],100,0)'),.4);assert.equal(run('enemyDamageMultiplier(game.enemies[0],-100,0)'),1);
run("spawnFamilyMinion(game.enemies[0],20,0)");assert.equal(run('game.enemies.at(-1).family'),'pond');
run('start();game.enemies=[];game.t=350;for(let i=0;i<500;i++)updateEncounterDirector(.2)');assert(run('game.enemies.length<=158'));
console.log('PASS: 36 categorized enemies, timed roster gates, themed squads, rest/caps, frontal guard, same-family summons, 3-second chest, 105 radius, gradual persistent decay.');

run("start();game.hero.x=0;game.hero.y=0;game.hero.moving=true;game.hero.hp=20;advanceWorldEvent({id:'qa-well',type:'well',x:0,y:0},.016)");assert(run("game.completedEvents.has('qa-well')"));assert.equal(run('game.hero.hp'),85);console.log('PASS: touch-only healing events still activate while walking.');
