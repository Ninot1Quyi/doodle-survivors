const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1360,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));await page.route('**/api/stats',r=>r.fulfill({json:{runs:124,activeMs:3600000}}));
await page.goto('http://127.0.0.1:4175/?edition=adventure');await page.click('#start');await page.evaluate(()=>Sound.ready());
await page.evaluate(()=>{Sound.volumes(0,.56);});
const samples=await page.evaluate(()=>Sound.diagnostics());assert.deepEqual(samples.failed,[]);
// Record the real combat path: cast, animate and make contact with a durable enemy row.
const clip=await page.evaluate(async()=>{
 const chunks=[],rec=new MediaRecorder(Sound.captureStream(),{mimeType:'audio/webm;codecs=opus'});const done=new Promise(resolve=>rec.onstop=async()=>{const b=new Uint8Array(await new Blob(chunks).arrayBuffer());let s='';for(const v of b)s+=String.fromCharCode(v);resolve(btoa(s));});rec.ondataavailable=e=>chunks.push(e.data);rec.start();
 for(const key of ['pencil','book','scissors','whip','firecracker','rainbowLaser']){
  start();await Sound.ready();Sound.volumes(0,.56);game.hero.hp=game.hero.maxHp=1e8;game.need=1e8;game.enemies=[];game.spawnClock=game.advancedSpawnClock=999;for(const k in game.weapons)game.weapons[k]=0;game.weapons[key]=3;game.clocks[key]=0;
  for(let i=0;i<7;i++){spawnEnemy('snail',game.hero.x+50+i*20,game.hero.y-30);game.enemies.at(-1).hp=game.enemies.at(-1).maxHp=1e7;game.enemies.at(-1).speed=0;}
  await new Promise(r=>setTimeout(r,key==='rainbowLaser'?3000:2200));
 }
 state='audioqa';Sound.duck(true);await new Promise(r=>setTimeout(r,350));rec.stop();return done;
});fs.writeFileSync('qa/stage14-combat-audio.webm',Buffer.from(clip,'base64'));
const played=await page.evaluate(()=>Sound.diagnostics().played);for(const key of ['pencil','book','scissors','whip','firecracker','rainbowLaser'])assert(played[key]>0,key+' real combat voice');assert(await page.evaluate(()=>Sound.diagnostics().contactMix.emitted)>15);
const bosses=[];
for(const kind of ['bossRose','bossCrab','bossOwl','bossClock','bossMoon']){
 await page.evaluate(kind=>{start();game.enemies=[];game.hero.hp=game.hero.maxHp=1e8;game.need=1e8;game.spawnClock=game.advancedSpawnClock=999;for(const k in game.weapons)game.weapons[k]=0;game.hero.x=0;game.hero.y=70;spawnEnemy(kind,190,-45);game.enemies.at(-1).speed=0;},kind);
 await page.waitForTimeout(1700);await page.screenshot({path:'qa/stage14-'+kind+'.png'});
 const info=await page.evaluate(()=>({kind:game.enemies[0].kind,phase:game.enemies[0].choreography.phase,action:game.enemies[0].choreography.action?.name,objects:game.bossChoreography.objects.length}));assert.equal(info.kind,kind);assert(info.objects>0);bosses.push(info);
 await page.waitForTimeout(900);
 if(kind==='bossOwl')await page.screenshot({path:'qa/stage14-boss-active.png'});
 await page.keyboard.press('Escape');const before=await page.evaluate(()=>game.enemies[0].choreography.age);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>game.enemies[0].choreography.age),before);await page.keyboard.press('Escape');
 await page.evaluate(()=>{let e=game.enemies[0];hit(e,1e9,e.x-1,e.y);});assert.equal(await page.evaluate(()=>game.bossChoreography.objects.length),0);
}
// Canvas projection: vertical objects keep their height while ground depth is foreshortened.
const matrix=await page.evaluate(()=>{ctx.save();ctx.setTransform(1,0,0,PaperCamera.k,0,0);PaperCamera.begin(ctx);let ground=ctx.getTransform().d,u;PaperCamera.upright(ctx,10,20,()=>u=ctx.getTransform().d);PaperCamera.end();ctx.restore();return {ground,u,k:PaperCamera.k,viewRatio:viewH/(H/zoom)};});assert(Math.abs(matrix.ground-.74)<1e-6);assert(Math.abs(matrix.u-1)<1e-6);assert(Math.abs(matrix.viewRatio-1/.74)<1e-6);
await page.evaluate(()=>{goHome();});await page.screenshot({path:'qa/stage14-home-final.png'});assert.deepEqual(errors,[]);
fs.writeFileSync('qa/stage14-browser.json',JSON.stringify({samples:samples.samples,played,bosses,matrix,errors},null,2));console.log(JSON.stringify({samples:samples.samples,bosses,matrix,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
