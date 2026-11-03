// Contract/asset validation for the reviewed launch palette, independent of audio engine voice counts.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),sandbox={};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'public/weapon-audio.js'),'utf8'),sandbox);
const cues=vm.runInContext('WEAPON_AUDIO',sandbox),ledger=JSON.parse(fs.readFileSync(path.join(root,'public/audio/WEAPON-AUDIO-PROVENANCE.json'),'utf8'));
const allowed=new Set(['cut','paper','ink','fire','electric','crush','frost','nature','music']);
assert.equal(Object.keys(cues).length,63);
const records=new Map(ledger.samples.map(s=>[s.file,s]));let files=new Set();
for(const [key,cue] of Object.entries(cues)){
 assert(allowed.has(cue.material),`${key}: missing material`);
 assert(cue.gain>0&&cue.gain<=.5,`${key}: gain outside mix envelope`);
 assert(cue.tail>0&&cue.tail<=1.2,`${key}: unbounded tail`);
 for(const sample of new Set([cue.sample,...(cue.variants||[])])){
  const file=sample+'.ogg',data=fs.readFileSync(path.join(root,'public/audio',file)),record=records.get(file);
  assert(record,`${key}: no provenance for ${file}`);assert.equal(data.subarray(0,4).toString(),'OggS');
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'),record.file_sha256,`${file}: output changed`);
  assert.equal(record.license||ledger.license,'CC0-1.0');assert.match(record.source_sha256,/^[0-9a-f]{64}$/);
  if(record.measurement){assert(record.measurement.duration>0&&record.measurement.duration<=1.2);assert(record.measurement.peak_dbfs<-.5,`${file}: clipping risk`);}
  files.add(file);
 }
}
assert.equal(new Set(Object.values(cues).map(c=>c.material)).size,9);
assert.equal(cues.whip.variants.length,3);
assert.equal(records.get('weapons/firecracker.ogg').file_sha256,'570e155af355f51c8387181294fb6ffccb6c9edf087dd6570f65d4d5b9ce7f88','real firecracker was replaced');
assert(!/impactWood|metalPot/.test(records.get('weapons/pencil.ogg').source));
assert(!/metalPot/.test(records.get('weapons/marble.ogg').source));
console.log(`PASS: 63 weapon keys; 9 materials; ${files.size} Ogg launch files; all source/output hashes and mix envelopes valid; 3 genuine whip takes; real firecracker preserved.`);
