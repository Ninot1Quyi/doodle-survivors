const assert=require('assert'),{run,sandbox}=require('./test-harness.cjs');
let heard=[];sandbox.Sound.play=(...a)=>heard.push(a);
run(`Math.random=()=>.5;start();game.enemies=[];for(let k in game.weapons)game.weapons[k]=0;game.hero.x=0;game.hero.y=-300;spawnEnemy('snail',70,0);game.enemies[0].hp=10000;fireBullet('pencil',0,0,0,300,20,2);stepProjectiles(.25);`);
assert(run(`game.fx.some(f=>f.weapon==='pencil'&&f.color===PIGMENTS[1])`),'pencil contact receives its own pigment');assert(heard.some(c=>c[0]==='impactPencil'));
run(`game.enemies=[];game.bullets=[];fireBullet('pencil',0,0,0,300,20,2);for(let i=0;i<30;i++)stepProjectiles(.016);`);assert(run(`game.bullets[0].trail.length===5&&game.bullets[0].trail.every(p=>p.x<=game.bullets[0].x)`),'trail is bounded and follows actual travel');
run(`game.bullets=[];fireBullet('frost',0,0,0,300,20,2)`);assert.equal(run('game.bullets[0].tint'),run('weaponData.frost.color'),'ice retains its own palette');
run(`start();game.enemies=[];spawnEnemy('snail',100,46);game.enemies[0].hp=10000;advancedCast('saber',5,game.enemies[0]);for(let i=0;i<20;i++){game.t+=.016;updateConstructs(.016);}`);assert(run(`game.fx.some(f=>f.weapon==='saber')`),'blade contacts retain weapon identity');
const manifest=require('../dist/audio/MIX-PROVENANCE.json');assert.equal(manifest.samples.length,21);for(const s of manifest.samples){assert(s.duration_ms<=280);assert(require('fs').existsSync(__dirname+'/../dist/audio/'+s.output));}
console.log('PASS: pigment contact/source color, dedicated hit cue, bounded motion trail, ice palette, blade contact identity, 21 original-sample variants.');
