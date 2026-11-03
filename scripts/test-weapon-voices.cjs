const fs=require('fs'),vm=require('vm'),assert=require('assert');const {run,sandbox}=require('./test-harness.cjs');
const cfg={};vm.createContext(cfg);vm.runInContext(fs.readFileSync('public/weapon-audio.js','utf8')+';this.map=WEAPON_AUDIO;',cfg);
const active=Array.from(run('Object.keys(weaponData).filter(k=>!weaponData[k].passive)'));assert.equal(active.length,63);assert.deepEqual(Object.keys(cfg.map).sort(),active.slice().sort());
const provenance=JSON.parse(fs.readFileSync('public/audio/WEAPON-AUDIO-PROVENANCE.json'));assert(provenance.samples.length>=63,'every weapon needs traceable sample provenance');
for(const def of Object.values(cfg.map))for(const sample of def.variants||[def.sample])assert(fs.existsSync('public/audio/'+sample+'.ogg'));
let calls=[];sandbox.Sound.play=(name)=>calls.push(name);
for(const key of active){
 run(`start();game.enemies=[];game.fields=[];game.constructs=[];game.spawnClock=999;game.need=999999;game.hero.hp=game.hero.maxHp=100000;for(const k in game.weapons){game.weapons[k]=0;game.clocks[k]=0;}game.weapons[${JSON.stringify(key)}]=weaponData[${JSON.stringify(key)}].evolved?5:3;for(let i=0;i<12;i++){spawnEnemy('snail',game.hero.x+Math.cos(i)*100,game.hero.y+Math.sin(i)*100);game.enemies.at(-1).hp=game.enemies.at(-1).maxHp=100000;}`);
 calls=[];run('for(let i=0;i<180;i++){game.t+=1/60;castWeapons(1/60);}');
 if(key==='mine'){run("let o=game.constructs.find(o=>o.mode==='mine');game.enemies[0].x=o.x;game.enemies[0].y=o.y;updateConstructs(1);");}
 assert(calls.includes(key),key+' must emit its own attack cue from real combat, not just exist in a map');
}
console.log('PASS: all 63 active weapons map to licensed authored sample families and emit their own cue from actual attack logic, including delayed attacks, summons, book orbit and mine detonation.');
