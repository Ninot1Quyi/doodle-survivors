import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { handleStats } from '../app/stats-service.mjs';
const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../drizzle/0000_public_stepford_cuckoos.sql',import.meta.url),'utf8'));
const db={prepare(sql){let args=[];return{bind(...values){args=values;return this;},async first(){return sqlite.prepare(sql).get(...args);},run(){return sqlite.prepare(sql).run(...args);}};},async batch(statements){sqlite.exec('BEGIN');try{const results=statements.map(s=>s.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
const id='12345678-1234-4234-8234-123456789012',second='12345678-1234-4234-8234-123456789013';
async function post(data,now=100000,origin='https://example.com'){const r=await handleStats(new Request('https://example.com/api/stats',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(data)}),db,now);return{status:r.status,body:await r.json()};}
assert.deepEqual(await (await handleStats(new Request('https://example.com/api/stats'),db)).json(),{runs:0,activeMs:0,since:null});
assert.equal((await post({id,activeMs:0})).body.runs,1);
assert.equal((await post({id,activeMs:0})).body.runs,1);
assert.equal((await post({id,activeMs:12000},120000)).body.activeMs,12000);
assert.equal((await post({id,activeMs:12000},120100)).body.activeMs,12000,'retry cannot add twice');
assert.equal((await post({id,activeMs:4000},121000)).body.activeMs,12000,'out of order heartbeat cannot subtract');
const combined=await post({id:second,activeMs:7000},130000);assert.equal(combined.body.runs,2);assert.equal(combined.body.activeMs,19000);
const capped=await post({id,activeMs:10000000},131000);assert.equal(capped.body.activeMs,53000,'reported play cannot exceed server age plus delivery grace');
assert.equal((await post({id:'bad',activeMs:9})).status,400);assert.equal((await post({id,activeMs:-1})).status,400);assert.equal((await post({id,activeMs:1},140000,'https://wrong.example')).status,403);
// Exercise the actual browser tracker: menus, pauses, background, restart, and retries.
let clock=0,nextId=0,requests=[];const intervals=[],handlers={},elems=new Map();
const sandbox={console,Map,JSON,Number,Math,Blob,performance:{now:()=>clock},crypto:{randomUUID:()=>`12345678-1234-4234-8234-${String(++nextId).padStart(12,'0')}`},localStorage:{getItem:()=>null,setItem(){}},document:{hidden:false,getElementById:id=>{if(!elems.has(id))elems.set(id,{});return elems.get(id);},addEventListener:(k,f)=>handlers[k]=f},window:{addEventListener:(k,f)=>handlers[k]=f},navigator:{sendBeacon:(url,body)=>{requests.push({beacon:body});return true;}},setInterval:f=>intervals.push(f),fetch:async(url,opts)=>{if(opts?.body)requests.push(JSON.parse(opts.body));return{ok:true,json:async()=>({runs:2,activeMs:53000,since:100000})};}};
vm.createContext(sandbox);vm.runInContext(readFileSync(new URL('../public/global-stats.js',import.meta.url),'utf8'),sandbox);const run=code=>vm.runInContext(code,sandbox),settle=()=>new Promise(r=>setImmediate(r));await settle();
run('GlobalRuns.start()');await settle();clock=100;run('GlobalRuns.tick(100,true)');clock=200;run('GlobalRuns.tick(200,true)');clock=300;run('GlobalRuns.tick(300,false)');await settle();assert.equal(requests.at(-1).activeMs,100);
clock=10000;run('GlobalRuns.tick(10000,false)');clock=10100;run('GlobalRuns.tick(10100,true)');clock=10200;run('GlobalRuns.tick(10200,true)');clock=10300;sandbox.document.hidden=true;handlers.visibilitychange();await settle();assert.equal(requests.filter(x=>x.id).at(-1).activeMs,200,'pause and hidden gap excluded');
sandbox.document.hidden=false;clock=30000;handlers.visibilitychange();await settle();run('GlobalRuns.start()');await settle();assert.equal(requests.filter(x=>x.id).at(-1).activeMs,0);assert.equal(new Set(requests.filter(x=>x.id).map(x=>x.id)).size,2,'new game has a distinct run ID');
console.log('PASS: durable SQLite migrations/triggers; two-player totals; idempotent retry; out-of-order reports; elapsed-time cap; invalid/cross-origin input; real browser tracker pause/background/restart.');
