(async()=>{
await Sound.ready();start();game.t=135;game.level=24;game.need=1e8;game.enemies=[];
for(let k in game.weapons)game.weapons[k]=0;
Object.assign(game.weapons,{paladin:5,skyWhale:5,paperCosmos:5,festival:5});
for(let k in game.clocks)game.clocks[k]=.2+Math.random();updateWeaponUI();
for(let i=0;i<80;i++){let a=i*TAU/80,r=250+Math.random()*280;spawnEnemy(NORMAL_EXPANSION_KEYS[i%24],Math.cos(a)*r,70+Math.sin(a)*r);}
atmosphere.mode=2;atmospherePublish();
const capture=document.createElement('canvas');capture.width=1280;capture.height=800;const g=capture.getContext('2d');
const stream=capture.captureStream(30);for(let t of Sound.captureStream()?.getAudioTracks()||[])stream.addTrack(t);
const type=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:3600000}),chunks=[],frameTimes=[];let begin=performance.now(),prev=begin,running=true;
rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
function paint(now){if(!running)return;frameTimes.push(now-prev);prev=now;g.drawImage(canvas,0,0,1280,800);g.fillStyle='#fff2dce8';g.fillRect(18,16,710,62);g.fillStyle='#65536e';g.font='20px PaperHand,serif';g.fillText((EDITION==='paper'?'02 手作卡纸版':'01 冒险扩展版')+' · 预设进化装备演示 / 正常生命',32,42);g.font='15px PaperHand,serif';g.fillText('HP '+Math.ceil(game.hero.hp)+' / '+game.hero.maxHp+' · '+game.kills+' 击败 · '+biomeAt(game.hero.x,game.hero.y).name,32,65);requestAnimationFrame(paint);}
window.qaController=setInterval(()=>{if(state==='upgrade')chooseUpgrade(0);if(state!=='playing')return;let p=game.hero,dx=Math.cos(game.t*.07)*2,dy=Math.sin(game.t*.07)*2;for(let e of game.enemies){let d=distance(e,p);if(d<140){dx+=(p.x-e.x)/Math.max(1,d)*(140-d)*.04;dy+=(p.y-e.y)/Math.max(1,d)*(140-d)*.04;}}for(let h of game.hazards){let d=distance(h,p);if(d<h.r+45){dx+=(p.x-h.x)/Math.max(d,1)*3;dy+=(p.y-h.y)/Math.max(d,1)*3;}}let n=Math.hypot(dx,dy)||1;joy={x:dx/n,y:dy/n};},80);
rec.onstop=async()=>{running=false;clearInterval(window.qaController);joy={x:0,y:0};let blob=new Blob(chunks,{type});await fetch('/__qa/'+EDITION+'.webm',{method:'POST',body:blob});let sorted=frameTimes.slice(10).sort((a,b)=>a-b);window.qaRecording={edition:EDITION,bytes:blob.size,seconds:(performance.now()-begin)/1000,frames:frameTimes.length,medianFrameMs:sorted[Math.floor(sorted.length*.5)],p95FrameMs:sorted[Math.floor(sorted.length*.95)],perf:getPerformanceStats(),sound:Sound.diagnostics(),kills:game.kills,hp:game.hero.hp,death:game.deathCauses};if(state==='playing')pause();};
rec.start(1000);requestAnimationFrame(paint);setTimeout(()=>dropItem(game.hero.x,game.hero.y,'prismLens'),6000);setTimeout(()=>dropItem(game.hero.x,game.hero.y,'piggyBank'),12000);setTimeout(()=>{if(state==='playing'){game.hero.storm=100;storm();}},19000);setTimeout(()=>rec.stop(),32000);return 'Recording 32 seconds of preset evolved weapons, normal HP, weather, biomes and sampled audio';
})()
