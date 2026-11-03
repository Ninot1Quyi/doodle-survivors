const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
 const page=await browser.newPage({viewport:{width:1360,height:900}}),errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/stats',r=>{if(r.request().method()==='POST')posts.push(JSON.parse(r.request().postData()));return r.fulfill({json:{runs:3,activeMs:30000}});});
 await page.goto('http://127.0.0.1:4175/?edition=adventure');await page.waitForFunction(()=>typeof Sound!=='undefined'&&typeof game!=='undefined');
 assert.equal(await page.locator('#menu .github-note').getAttribute('href'),'https://github.com/Ninot1Quyi');
 await page.screenshot({path:'qa/voices12-home.png'});
 await page.click('#start');await page.evaluate(()=>Sound.ready());
 const loaded=await page.evaluate(()=>Sound.diagnostics());assert.equal(loaded.weaponIdentities,63);assert.deepEqual(loaded.failed,[]);assert.equal(loaded.samples,123);
 await page.keyboard.press('Escape');assert(await page.locator('#pause-home').isVisible());await page.screenshot({path:'qa/voices12-pause.png'});
 await page.click('#pause-home');assert.equal(await page.evaluate(()=>state),'menu');assert.equal(await page.evaluate(()=>keys.size),0);
 await page.click('#start');await page.evaluate(()=>Sound.ready());
 await page.evaluate(()=>{game.weapons.pencil=1;openUpgrade(true);upgradeChoices=['pencil','pencil','pencil'];upgradeRarity=[2,2,2];});
 await page.waitForFunction(()=>rewardSession?.jackpot?.gain===3,{},{timeout:10000});
 assert.equal(await page.evaluate(()=>game.weapons.pencil),4);await page.screenshot({path:'qa/voices12-jackpot.png'});
 await page.waitForFunction(()=>state==='playing');assert.equal(await page.evaluate(()=>game.weapons.pencil),4);
 await page.evaluate(()=>finish(true));assert(await page.locator('#end .github-note').isVisible());await page.screenshot({path:'qa/voices12-victory.png'});
 await page.click('#again');await page.evaluate(()=>finish(false));assert(await page.locator('#end .github-note').isVisible());await page.screenshot({path:'qa/voices12-death.png'});
 // Solo cue audit through real WebAudio decoding/playback, with no microphone capture.
 const audit=await page.evaluate(async()=>{
  await Sound.ready();state='audioqa';Sound.duck(false);Sound.volumes(0,.56);
  const rows=[];
  for(const key of Object.keys(WEAPON_AUDIO)){
   const before=Sound.diagnostics().played[key]||0,ok=Sound.play(key);
   await new Promise(r=>setTimeout(r,80));const d=Sound.diagnostics();
   rows.push({key,accepted:ok,emitted:(d.played[key]||0)>before,peak:d.outputPeak});
   await new Promise(r=>setTimeout(r,320));
  }
  return {rows,diagnostics:Sound.diagnostics()};
 });assert(audit.rows.every(r=>r.emitted),'every weapon must emit its own cue');
 // A real, audible mix-bus recording for the chest timing; no device input.
 const clip=await page.evaluate(async()=>{
  Sound.duck(true);const chunks=[],rec=new MediaRecorder(Sound.captureStream(),{mimeType:'audio/webm;codecs=opus'});
  const done=new Promise(resolve=>rec.onstop=async()=>{const b=new Uint8Array(await new Blob(chunks).arrayBuffer());let s='';for(const v of b)s+=String.fromCharCode(v);resolve(btoa(s));});rec.ondataavailable=e=>chunks.push(e.data);rec.start();
  start();await Sound.ready();Sound.volumes(0,.56);game.weapons.pencil=1;openUpgrade(true);upgradeChoices=['pencil','pencil','pencil'];upgradeRarity=[2,2,2];
  await new Promise(r=>setTimeout(r,5200));rec.stop();return done;
 });fs.writeFileSync('qa/voices12-jackpot.webm',Buffer.from(clip,'base64'));
 for(const size of [{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(size);await page.evaluate(()=>goHome());assert(await page.locator('#menu .github-note').isVisible());await page.locator('#menu .github-note').scrollIntoViewIfNeeded();
  const box=await page.locator('#menu .github-note').boundingBox();assert(box.x>=0&&box.x+box.width<=size.width+2);
  await page.screenshot({path:`qa/voices12-menu-${size.width}.png`});
  await page.click('#start');await page.keyboard.press('Escape');await page.locator('#pause-home').scrollIntoViewIfNeeded();assert(await page.locator('#pause-home').isVisible());await page.click('#pause-home');assert.equal(await page.evaluate(()=>state),'menu');
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync('qa/voices12-browser.json',JSON.stringify({loaded,audit,errors,runPosts:posts.length,verified:['pause-home','home author link','victory author link','death author link','triple immediate award','triple exactly once','63 decoded weapon cues','mobile portrait/landscape']},null,2));
 console.log(JSON.stringify({samples:loaded.samples,weapons:audit.rows.length,failed:loaded.failed,errors,runPosts:posts.length}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
