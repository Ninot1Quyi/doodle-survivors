(async()=>{
await Sound.ready();
start();
// Scripted feature showcase, not a claim that this equipment was earned in a normal run.
game.t=115;game.level=20;game.need=1e7;game.enemies=[];
for(let k in game.weapons)game.weapons[k]=0;
Object.assign(game.weapons,{pencil:5,star:5,rose:4,book:3,bubble:3,plane:3,bell:3,ribbon:3});
for(let k in game.clocks)game.clocks[k]=.1+Math.random();
game.hero.hp=game.hero.maxHp=120;game.hero.inv=0;updateWeaponUI();
const kinds=['rabbit','snail','mushroom','jelly','fox','spider','beetle','bat'];
for(let i=0;i<70;i++){let a=i*TAU/70,r=270+Math.random()*320;spawnEnemy(kinds[i%kinds.length],Math.cos(a)*r,70+Math.sin(a)*r*.75);}
const capture=document.createElement('canvas');capture.width=1280;capture.height=720;const painter=capture.getContext('2d');
const stream=capture.captureStream(30);for(let t of Sound.captureStream().getAudioTracks())stream.addTrack(t);
const chunks=[];const type=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:3800000});
rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
let running=true,begin=performance.now(),frameTimes=[],prev=begin;
function paint(now){if(!running)return;frameTimes.push(now-prev);prev=now;painter.drawImage(canvas,0,0,1280,720);painter.fillStyle='#fff4dedf';painter.fillRect(18,16,555,64);painter.strokeStyle='#80637b';painter.strokeRect(18,16,555,64);painter.fillStyle='#604c67';painter.font='20px sans-serif';painter.fillText((EDITION==='paper'?'02 手作卡纸版':'01 冒险扩展版')+' · 预设中期装备试玩',32,43);painter.font='14px sans-serif';painter.fillText('HP '+Math.ceil(game.hero.hp)+' / '+game.hero.maxHp+'    '+game.kills+' 击败    '+game.fusions.map(k=>weaponData[k].name).join(' / '),32,67);if(now-begin<5000){painter.fillStyle='#fff1d5e8';painter.fillRect(450,605,380,65);painter.fillStyle='#93648d';painter.font='18px sans-serif';painter.fillText('彩铅 V ＋ 许愿星星 V → 绘梦彗星 V',466,643);}requestAnimationFrame(paint);}
requestAnimationFrame(paint);
window.qaController=setInterval(()=>{if(state==='upgrade')chooseUpgrade(0);if(state!=='playing')return;let p=game.hero,angle=game.t*.06,dx=(Math.cos(angle)*360-p.x)*.006,dy=(Math.sin(angle)*360-p.y)*.006;for(let e of game.enemies){let d=distance(e,p);if(d<130){dx+=(p.x-e.x)/Math.max(1,d)*(130-d)*.035;dy+=(p.y-e.y)/Math.max(1,d)*(130-d)*.035;}}let n=Math.hypot(dx,dy)||1;joy={x:dx/n,y:dy/n};},80);
rec.onstop=async()=>{running=false;clearInterval(window.qaController);joy={x:0,y:0};const blob=new Blob(chunks,{type});await fetch('/__qa/'+EDITION+'.webm',{method:'POST',body:blob});let sorted=frameTimes.slice(10).sort((a,b)=>a-b);window.qaRecording={edition:EDITION,bytes:blob.size,seconds:(performance.now()-begin)/1000,frames:frameTimes.length,medianFrameMs:sorted[Math.floor(sorted.length*.5)],p95FrameMs:sorted[Math.floor(sorted.length*.95)],sound:Sound.diagnostics(),kills:game.kills,hp:game.hero.hp};pause();};
rec.start(1000);setTimeout(()=>{openUpgrade(true);chooseUpgrade(0);},3500);setTimeout(()=>{game.hero.storm=100;storm();},14000);setTimeout(()=>dropItem(game.hero.x+15,game.hero.y,'umbrella'),6000);setTimeout(()=>dropItem(game.hero.x+15,game.hero.y,'rainbow'),9000);setTimeout(()=>dropItem(game.hero.x+15,game.hero.y,'snowglobe'),12000);setTimeout(()=>dropItem(game.hero.x+15,game.hero.y,'ticket'),21000);setTimeout(()=>rec.stop(),30000);return 'Recording 30 seconds of canvas combat and game audio.';
})()
