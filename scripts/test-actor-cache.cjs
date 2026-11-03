const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/../public/immersion.js','utf8');
const actor=source.slice(source.indexOf('const actorPoseKinds'),source.indexOf('function renderProjectileRibbon'));
const sandbox={Math,Map,game:{t:1},reducedEffects:false};
vm.createContext(sandbox);const run=s=>vm.runInContext(s,sandbox);run(actor);
// Categories and numerical poses are identical for creature names, including substring variants.
for(const kind of ['bat','jelly','ghost','moth','lantern','cloud','slime','imp','mushroom','frog','rabbit','fox','puff','bossMoon','paperFox','batKing']){run(`actorPose({kind:${JSON.stringify(kind)},frame:1,phase:0,id:1})`);const expected=['bat','jelly','ghost','moth','lantern','cloud'].some(k=>kind.includes(k))?1:['slime','imp','mushroom','frog','rabbit','fox','puff'].some(k=>kind.includes(k))?2:0;assert.equal(run(`actorPoseKinds.get(${JSON.stringify(kind)})`),expected);}
console.log('PASS: cached pose classification matches every original substring rule.');
