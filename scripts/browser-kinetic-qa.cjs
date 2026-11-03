const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1360,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/api/stats',r=>r.fulfill({json:{runs:3,activeMs:30000}}));
 await page.goto('http://127.0.0.1:4175/?edition=adventure');await page.click('#start');await page.evaluate(()=>Sound.ready());
 assert.equal(await page.locator('#menu .github-note').getAttribute('href'),'https://github.com/Ninot1Quyi/doodle-survivors');
 const decoded=await page.evaluate(()=>Sound.diagnostics());assert.deepEqual(decoded.failed,[]);assert.equal(decoded.weaponIdentities,63);
 await page.evaluate(()=>{state='audioqa';Sound.duck(false);Sound.volumes(0,.56);});await page.waitForTimeout(1500);
 const simultaneous=await page.evaluate(()=>{const keys=['pencil','book','whip','marble','fire','ruler','bell','rocket'],before=Sound.diagnostics().played;keys.forEach(k=>Sound.play(k));return{keys,missing:keys.filter(k=>(Sound.diagnostics().played[k]||0)===(before[k]||0)),voices:Sound.diagnostics().activeWeaponVoices};});assert.deepEqual(simultaneous.missing,[]);assert(simultaneous.voices>=8);
 await page.waitForTimeout(1300);
 const contacts=await page.evaluate(()=>{const before=Sound.diagnostics().contactMix.emitted;for(let i=0;i<9;i++)Sound.contact(i%3?'impactCut':'impactDefeat',.4,1,{variant:i%3});return Sound.diagnostics().contactMix.emitted-before;});assert.equal(contacts,9);
 await page.waitForTimeout(1000);
 // Actual audio-bus recording: eight voices, sustained laser, pickups, and real firecracker sequence.
 const clip=await page.evaluate(async()=>{const chunks=[],rec=new MediaRecorder(Sound.captureStream(),{mimeType:'audio/webm;codecs=opus'});const done=new Promise(resolve=>rec.onstop=async()=>{const b=new Uint8Array(await new Blob(chunks).arrayBuffer());let s='';for(const v of b)s+=String.fromCharCode(v);resolve(btoa(s));});rec.ondataavailable=e=>chunks.push(e.data);rec.start();Sound.sustain('laser',.4);await new Promise(r=>setTimeout(r,2400));Sound.sustain('laser',0);await new Promise(r=>setTimeout(r,500));Sound.play('level',.5);await new Promise(r=>setTimeout(r,1600));Sound.play('chest',.5);await new Promise(r=>setTimeout(r,800));for(let i=0;i<6;i++){Sound.play('firecracker');await new Promise(r=>setTimeout(r,150));}await new Promise(r=>setTimeout(r,700));rec.stop();return done;});fs.writeFileSync('qa/kinetic13-audio.webm',Buffer.from(clip,'base64'));
 await page.evaluate(()=>Sound.sustain('laser',.4));await page.waitForTimeout(350);assert.deepEqual(await page.evaluate(()=>Sound.diagnostics().activeSustains),['laser']);
 const sustainRms=[];for(let i=0;i<15;i++){await page.waitForTimeout(100);sustainRms.push(await page.evaluate(()=>Sound.diagnostics().outputRms));}assert(Math.max(...sustainRms)>.001);assert(sustainRms.filter(v=>v>.0003).length>=13,'sustain must not fall silent at its loop seam');
 await page.evaluate(()=>Sound.duck(true));await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>Sound.diagnostics().activeSustains.length),0);assert(await page.evaluate(()=>Sound.diagnostics().outputRms)<.001);
 // Real construct, not just an audio API: all six rainbow spokes share one sustained player voice.
 await page.evaluate(()=>{start();game.enemies=[];game.need=1e9;game.spawnClock=game.advancedSpawnClock=999;game.hero.hp=game.hero.maxHp=1e6;for(const k in game.weapons)game.weapons[k]=0;spawnEnemy('snail',game.hero.x+200,game.hero.y);game.enemies[0].hp=1e6;advancedCast('rainbowLaser',5,game.enemies[0]);Sound.volumes(0,.56);});await page.waitForTimeout(800);
 assert((await page.evaluate(()=>Sound.diagnostics().activeSustains)).includes('laser'));await page.screenshot({path:'qa/kinetic13-rainbow.png'});
 await page.keyboard.press('Escape');await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>Sound.diagnostics().activeSustains.length),0);await page.keyboard.press('Escape');await page.waitForTimeout(200);assert((await page.evaluate(()=>Sound.diagnostics().activeSustains)).includes('laser'));await page.waitForTimeout(3000);assert(!(await page.evaluate(()=>Sound.diagnostics().activeSustains)).includes('laser'));
 await page.evaluate(()=>{state='audioqa';Sound.duck(false);Sound.volumes(.38,.56);});const music=[];
 for(const key of ['whale','ruins','dunes','kites','mushroom','greenhouse']){
  await page.waitForTimeout(7500);await page.evaluate(k=>{for(let i=0;i<30;i++)Sound.biome(k,.1);},key);
  await page.waitForFunction(k=>Sound.diagnostics().musicBiome===k&&!Sound.diagnostics().crossfading,key,{timeout:16000});
  const d=await page.evaluate(()=>Sound.diagnostics());assert(!d.musicPaused);music.push({key,title:d.musicTrack,gains:d.musicGains});
 }
 // Short boundary visits must not restart music.
 const before=await page.evaluate(()=>Sound.diagnostics().loopTransitions);await page.evaluate(()=>{for(let i=0;i<20;i++)Sound.biome(i%2?'whale':'dunes',.1);});assert.equal(await page.evaluate(()=>Sound.diagnostics().loopTransitions),before);
 await page.evaluate(()=>goHome());assert.equal(await page.evaluate(()=>Sound.diagnostics().activeSustains.length),0);
 assert.deepEqual(errors,[]);fs.writeFileSync('qa/kinetic13-browser.json',JSON.stringify({decoded,simultaneous,contacts,sustainRms,music,errors},null,2));console.log(JSON.stringify({samples:decoded.samples,simultaneous,contacts,sustainMin:Math.min(...sustainRms),music,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
