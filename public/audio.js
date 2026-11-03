'use strict';
// Recorded music and designer-authored CC0 samples. No runtime oscillators.
const Sound=(()=>{
  let context,master,musicGain,sfxGain,compressor,lowpass,analyser,capture,musicSource,musicEQ,musicLow,trackGains,combatGain,combatLow;
  let started=false,muted=false,ducked=false,musicVolume=.38,sfxVolume=.56,loading,fadeTimer=null,crossfading=false,loopTransitions=0,activeTrack=0,musicGeneration=0;
  let pendingImpact=null,impactFlushTimer=null,lastImpactAt=-99;const impactStats={merged:0,budgetSkipped:0,emitted:0};
  const buffers={},levels={},lastPlayed={},lastGroupPlayed={},voices=new Set(),loaded=new Map(),played={};
  const weaponAudio=typeof WEAPON_AUDIO==='undefined'?{}:WEAPON_AUDIO;
  const names=['slotTick','slotStop','slotRise','slotBurst','slotReveal','slotJackpot',...new Set(Object.values(weaponAudio).flatMap(d=>d.variants||[d.sample])),'hit','hurt','shoot','pickup','level','explosion','dash','wind','lightning','confirm','heal','storm','victory',...['wood','snap','glass','metal','soft','body','paper','warmHit','warmHeavy','warmFinish','warmCut','warmShot','warmParry'].flatMap(k=>[k+'0',k+'1',k+'2'])];
  let music=new Audio('audio/music.mp3');
  const musicPlayers=[music,new Audio('audio/music.mp3')];
  for(let i=0;i<2;i++){let audio=musicPlayers[i];audio.id='background-music'+(i?'-overlap':'');audio.hidden=true;audio.loop=true;audio.preload='auto';audio.volume=musicVolume;audio.addEventListener('timeupdate',()=>{if(audio===music)advanceMusicLoop();});document.body.append(audio);}
  const variations={};
  // A cue's layers are gently pitched recordings, with independent timing and gain.
  const cues={
    reelTick:{layers:[['slotTick',1,1]],priority:3,group:'reward',boost:.68,tail:.06},
    reelStop0:{layers:[['slotStop',1,1]],priority:5,group:'reward',boost:.72,tail:.23},
    reelStop1:{layers:[['slotStop',1,1.12246]],priority:5,group:'reward',boost:.77,tail:.23},
    reelStop2:{layers:[['slotStop',1,1.33484]],priority:5,group:'reward',boost:.84,tail:.23},
    chestRise:{layers:[['slotRise',1,1]],priority:4,group:'reward',boost:.62,tail:.7},
    chestBurst:{layers:[['slotBurst',1,1]],priority:5,group:'reward',boost:.8,tail:.55},
    chestReveal:{layers:[['slotReveal',1,1]],priority:5,group:'reward',boost:.9,tail:.8},
    jackpot:{layers:[['slotJackpot',1,1],['slotReveal',.6,1.18,.92]],priority:6,group:'reward',boost:.95,tail:2.2},
    heavyhit:{layers:[['warmHeavy$',1,1]],priority:3,group:'impact',rank:2,boost:1,tail:.215},
    impactDefeat:{layers:[['warmFinish$',1,1]],priority:3,group:'impact',rank:3,boost:1,tail:.24},
    parry:{layers:[['warmParry$',.8,1]],priority:2,group:'impact',rank:2,boost:.9,tail:.15},
    hit:{layers:[['warmHit$',1,1]],priority:2,group:'impact',rank:1,boost:1,tail:.145},
    impactPencil:{layers:[['warmHit$',1,1.04]],priority:2,group:'impact',rank:1,boost:1,tail:.145},
    impactCut:{layers:[['warmCut$',1,1]],priority:2,group:'impact',rank:1,boost:1,tail:.155},
    impactGlass:{layers:[['warmParry$',.9,1.04]],priority:2,group:'impact',rank:1,boost:1,tail:.15},
    impactInk:{layers:[['warmHit$',1,.92]],priority:2,group:'impact',rank:1,boost:1,tail:.16},
    impactBloom:{layers:[['warmCut$',.9,.96]],priority:2,group:'impact',rank:1,boost:1,tail:.16},
    impactErase:{layers:[['warmCut$',.85,1.04]],priority:2,group:'impact',rank:1,boost:1,tail:.15},
    impactCrush:{layers:[['warmHit$',1,.9]],priority:2,group:'impact',rank:1,boost:1,tail:.16},
    impactFire:{layers:[['warmHit$',1,.96]],priority:2,group:'impact',rank:1,boost:1,tail:.16},
    shoot:{layers:[['warmShot$',1,1]],priority:0,group:'shot',boost:.65,tail:.095},
    pickup:{layers:[['warmParry$',.72,1.22]],priority:2,group:'pickup',boost:.85,tail:.105},
    hurt:{layers:[['hurt',1,.84],['hit',.35,.75,.045]],priority:4,boost:1.45,tail:.42},
    fusion:{layers:[['level',.75,.8],['victory',.6,1,.20],['pickup',.6,1.2,.43]],priority:5,boost:1.25,tail:1.4},
    event:{layers:[['heal',.8,.9],['pickup',.55,1,.15]],priority:3,boost:1.15,tail:.85},
    boss:{layers:[['storm',.7,.7],['hurt',.55,.6,.18]],priority:5,boost:1.1,tail:1.2},
    level:{layers:[['level',1,.9]],priority:4,boost:.95,tail:1.1},
    victory:{layers:[['victory',1,.9]],priority:5,boost:1,tail:1.4},
    heal:{layers:[['heal',1,1]],priority:3,boost:1.1,tail:.8},
    confirm:{layers:[['confirm',1,1]],priority:3,boost:1.2,tail:.3},
    explosion:{layers:[['warmHeavy$',1,.85]],priority:1,group:'cast',boost:1,tail:.25},
    storm:{layers:[['storm',1,1]],priority:4,boost:.9,tail:.9},
    wind:{layers:[['warmCut$',.8,.72]],priority:0,group:'cast',boost:.85,tail:.21},
    dash:{layers:[['warmCut$',.9,1]],priority:2,group:'cast',boost:1,tail:.18}
  };
  for(const [name,d] of Object.entries(weaponAudio))cues[name]={layers:[[d.sample,1,1]],variants:d.variants,priority:2,group:'weapon',boost:d.gain,tail:d.tail,interval:d.interval};
  const aliases={pencilShot:'pencil',bossTell:'boss',boss_tell:'boss',chest:'event',coin:'pickup',reelStop:'reelStop0'};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function status(text){const e=document.getElementById('audio-status');if(e)e.textContent=text;}
  function syncSliders(){for(const [name,value]of [['music',musicVolume],['sfx',sfxVolume]]){const slider=document.getElementById(name+'-volume'),label=document.getElementById(name+'-value');if(slider)slider.value=Math.round(value*100);if(label)label.value=Math.round(value*100)+'%';}}
  try{const saved=JSON.parse(localStorage.getItem('doodle-audio')||'null');if(saved){musicVolume=clamp(Number(saved.music)||0,0,1);sfxVolume=clamp(Number(saved.sfx)||0,0,1);}}catch{}
  syncSliders();
  function init(){
    if(context)return;
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)throw new Error('Web Audio unavailable');
    context=new AudioContext();master=context.createGain();master.gain.value=muted?0:.82;
    compressor=context.createDynamicsCompressor();compressor.threshold.value=-5;compressor.knee.value=5;compressor.ratio.value=12;compressor.attack.value=.001;compressor.release.value=.09;
    analyser=context.createAnalyser();analyser.fftSize=512;analyser.smoothingTimeConstant=.7;
    master.connect(compressor);compressor.connect(analyser);analyser.connect(context.destination);
    capture=context.createMediaStreamDestination();analyser.connect(capture);
    musicGain=context.createGain();musicGain.gain.value=musicVolume*.43;
    musicEQ=context.createBiquadFilter();musicEQ.type='peaking';musicEQ.frequency.value=3000;musicEQ.Q.value=.65;musicEQ.gain.value=0;
    musicLow=context.createBiquadFilter();musicLow.type='lowpass';musicLow.frequency.value=20000;musicLow.Q.value=.3;
    musicGain.connect(musicEQ);musicEQ.connect(musicLow);musicLow.connect(master);
    trackGains=musicPlayers.map((audio,i)=>{const source=context.createMediaElementSource(audio),gain=context.createGain();gain.gain.value=i?0:1;source.connect(gain);gain.connect(musicGain);audio.volume=1;return gain;});
    sfxGain=context.createGain();sfxGain.gain.value=sfxVolume;
    const highpass=context.createBiquadFilter();highpass.type='highpass';highpass.frequency.value=105;highpass.Q.value=.45;
    lowpass=context.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=11200;lowpass.Q.value=.45;
    const sfxCompressor=context.createDynamicsCompressor();sfxCompressor.threshold.value=-17;sfxCompressor.knee.value=10;sfxCompressor.ratio.value=3;sfxCompressor.attack.value=.008;sfxCompressor.release.value=.075;
    combatGain=context.createGain();combatGain.gain.value=.40;combatLow=context.createBiquadFilter();combatLow.type='lowpass';combatLow.frequency.value=4200;combatLow.Q.value=.45;combatGain.connect(combatLow);combatLow.connect(sfxGain);
    sfxGain.connect(highpass);highpass.connect(lowpass);lowpass.connect(sfxCompressor);sfxCompressor.connect(master);
    loading=Promise.all(names.map(async name=>{
      try{
        const response=await fetch('audio/'+name+'.ogg');if(!response.ok)throw new Error('HTTP '+response.status);
        const buffer=await context.decodeAudioData(await response.arrayBuffer());buffers[name]=buffer;
        let peak=0,sum=0,n=0;
        // Measure only the useful onset, not a long silent file tail.
        const end=Math.min(buffer.length,Math.floor(buffer.sampleRate*.22));
        for(let ch=0;ch<buffer.numberOfChannels;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<end;i++){const sample=data[i];peak=Math.max(peak,Math.abs(sample));sum+=sample*sample;n++;}}
        const rms=Math.sqrt(sum/Math.max(1,n));
        levels[name]={peak,rms,gain:(name.startsWith('warm')||name.startsWith('weapons/')||name.startsWith('slot'))?1:clamp(Math.min(.75/Math.max(peak,.001),.16/Math.max(rms,.005)),.4,3.5)};
        loaded.set(name,true);
      }catch{loaded.set(name,false);}
    })).then(()=>{if([...loaded.values()].some(v=>!v))status('部分采样未加载；刷新页面可重试。');});
  }
  async function activate(restart){
    try{
      init();
      // Both activation-sensitive calls happen synchronously inside the click gesture.
      const resumed=context.resume();if(restart){musicGeneration++;clearTimeout(fadeTimer);crossfading=false;activeTrack=0;music=musicPlayers[0];musicPlayers.forEach((p,i)=>{p.pause();p.currentTime=0;trackGains[i].gain.cancelScheduledValues(context.currentTime);trackGains[i].gain.setValueAtTime(i?0:1,context.currentTime);});}
      const playing=music.play();started=true;
      const [resumeResult,musicResult]=await Promise.allSettled([resumed,playing]);
      if(resumeResult.status==='rejected')throw resumeResult.reason;
      if(musicResult.status==='rejected'){status('音乐尚未开启，请点击“开启声音”；战斗音效可继续播放。');document.getElementById('audio-unlock')?.classList.remove('hidden');return;}
      document.getElementById('audio-unlock')?.classList.add('hidden');status('');
    }catch{status('点击开启声音以重试音频。');document.getElementById('audio-unlock')?.classList.remove('hidden');}
  }
  function advanceMusicLoop(){
    const loopEnd=Math.min(music.duration,220.7);
    if(!context||crossfading||music.paused||!Number.isFinite(loopEnd)||loopEnd-music.currentTime>2.4)return;
    const from=activeTrack,to=1-from,next=musicPlayers[to],old=music,generation=musicGeneration;crossfading=true;next.currentTime=0;
    next.play().then(()=>{if(!crossfading||generation!==musicGeneration)return;const now=context.currentTime,duration=Math.min(2.1,Math.max(.25,loopEnd-old.currentTime-.08));trackGains[from].gain.cancelScheduledValues(now);trackGains[to].gain.cancelScheduledValues(now);trackGains[from].gain.setValueAtTime(1,now);trackGains[to].gain.setValueAtTime(0,now);trackGains[from].gain.linearRampToValueAtTime(0,now+duration);trackGains[to].gain.linearRampToValueAtTime(1,now+duration);fadeTimer=setTimeout(()=>{old.pause();activeTrack=to;music=next;crossfading=false;loopTransitions++;},duration*1000+30);}).catch(()=>{crossfading=false;});
  }
  async function start(){clearTimeout(impactFlushTimer);impactFlushTimer=null;pendingImpact=null;lastImpactAt=-99;for(const key in lastPlayed)delete lastPlayed[key];for(const key in lastGroupPlayed)delete lastGroupPlayed[key];duck(false);await activate(true);duck(false);}
  async function unlock(){await activate(false);duck(ducked);}
  function voice(sample,volume,rate,delay,priority,tail,group){
    const buffer=buffers[sample];if(!buffer)return false;
    const groupLimit={impact:3,cast:3,shot:2,pickup:2,weapon:6,reward:6}[group];
    if(groupLimit&&[...voices].filter(v=>v.group===group).length>=groupLimit)return false;
    // Ordinary attacks cannot occupy the slots reserved for player feedback.
    const limit=priority>=3?24:priority>=2?19:10;
    if(voices.size>=limit){
      const victim=[...voices].find(v=>v.priority<priority);
      if(!victim)return false;
      victim.gain.gain.setTargetAtTime(0,context.currentTime,.012);try{victim.source.stop(context.currentTime+.05);}catch{}
      voices.delete(victim);
    }
    const source=context.createBufferSource(),gain=context.createGain(),now=context.currentTime+delay;
    source.buffer=buffer;source.playbackRate.value=clamp(rate,.65,1.7);
    const level=clamp(volume*(levels[sample]?.gain||1),0,.9);
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+(group?.003:.0008));
    const duration=Math.min(buffer.duration/source.playbackRate.value,tail);
    gain.gain.setValueAtTime(level,now+Math.max(.006,(group==='weapon'||group==='reward')?duration-.025:duration*.28));gain.gain.exponentialRampToValueAtTime(.0001,now+Math.max(.025,duration+.035));
    source.connect(gain);gain.connect(group&&group!=='weapon'&&group!=='reward'?combatGain:sfxGain);
    const record={source,gain,priority,group};voices.add(record);
    source.onended=()=>{voices.delete(record);source.disconnect();gain.disconnect();};
    source.start(now);source.stop(now+duration+.045);return true;
  }
  function playNow(name,volume=.3,rate=1,minInterval=.08){
    if(!started||muted||!context||context.state!=='running')return false;
    name=aliases[name]||name;const cue=cues[name];if(!cue)return false;
    const now=context.currentTime;
    if(cue.group==='weapon'){if(ducked)return false;volume=1;rate=1+(Math.random()-.5)*.025;minInterval=Math.max(minInterval,cue.interval);}
    const groupInterval={shot:.14,pickup:.18,cast:.12}[cue.group]||0;
    if(now-(lastGroupPlayed[cue.group]??-99)<groupInterval||now-(lastPlayed[name]??-99)<Math.max(.025,minInterval))return false;
    const variant=variations[name]||0;const chosen=cue.variants?.[variant%cue.variants.length];const layers=cue.layers.map(([sample,...rest])=>[chosen||sample.replace('$',String(variant%3)),...rest]);if(!layers.some(([sample])=>buffers[sample]))return false;
    let audible=false;
    for(const [sample,mix,pitch,delay=0]of layers)audible=voice(sample,clamp(volume,0,1)*cue.boost*mix,rate*pitch,delay,cue.priority,cue.tail,cue.group)||audible;
    if(audible){variations[name]=variant+1;lastPlayed[name]=now;if(cue.group)lastGroupPlayed[cue.group]=now;played[name]=(played[name]||0)+1;}
    if(audible&&cue.priority>=4&&!ducked){musicGain.gain.cancelScheduledValues(now);musicGain.gain.setTargetAtTime(musicVolume*.26,now,.05);musicGain.gain.setTargetAtTime(musicVolume*.43,now+.35,.16);}
    return audible;
  }
  // A 14 ms collection window chooses one representative contact per burst.
  // Death > critical/parry > ordinary. This is audio only; every hit still deals damage.
  function play(name,volume=.3,rate=1,minInterval=.08){
    name=aliases[name]||name;const cue=cues[name];
    if(!cue||!started||muted||!context||context.state!=='running'||ducked&&cue.group&&cue.group!=='reward')return false;
    if(cue.group!=='impact')return playNow(name,volume,rate,minInterval);
    if(pendingImpact){impactStats.merged++;if(cue.rank>pendingImpact.rank||cue.rank===pendingImpact.rank&&volume>pendingImpact.volume)pendingImpact={name,volume,rate,rank:cue.rank};return true;}
    pendingImpact={name,volume,rate,rank:cue.rank};
    impactFlushTimer=setTimeout(()=>{const hit=pendingImpact;pendingImpact=null;impactFlushTimer=null;if(!hit||!context)return;const now=context.currentTime;
      if(now-lastImpactAt<.105){impactStats.budgetSkipped++;return;}
      if(playNow(hit.name,hit.volume,hit.rate,.105)){lastImpactAt=now;impactStats.emitted++;}
    },14);return true;
  }
  function duck(on){ducked=!!on;if(ducked&&context){clearTimeout(impactFlushTimer);impactFlushTimer=null;pendingImpact=null;for(const v of [...voices])if(v.group&&v.group!=='reward'){v.gain.gain.setTargetAtTime(0,context.currentTime,.008);try{v.source.stop(context.currentTime+.03);}catch{}voices.delete(v);}}if(musicGain&&context){const now=context.currentTime;musicGain.gain.cancelScheduledValues(now);musicGain.gain.setTargetAtTime(musicVolume*(ducked?.15:.43),now,.2);musicLow.frequency.setTargetAtTime(ducked?5800:20000,now,.3);}}
  function volumes(m,s){musicVolume=clamp(Number(m)||0,0,1);sfxVolume=clamp(Number(s)||0,0,1);duck(ducked);if(sfxGain&&context)sfxGain.gain.setTargetAtTime(sfxVolume,context.currentTime,.06);try{localStorage.setItem('doodle-audio',JSON.stringify({music:musicVolume,sfx:sfxVolume}));}catch{}}
  function toggle(){muted=!muted;if(master&&context)master.gain.setTargetAtTime(muted?0:.82,context.currentTime,.06);return muted;}
  function diagnostics(){let rms=0,peak=0;if(analyser){const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);for(const sample of samples){rms+=sample*sample;peak=Math.max(peak,Math.abs(sample));}rms=Math.sqrt(rms/samples.length);}return{started,muted,contextState:context?.state||'uninitialized',musicPaused:music.paused,musicTrack:'Master of the Feast',musicLoopEnd:220.7,loopTransitions,crossfading,sfxLowpass:lowpass?.frequency.value,combatLowpass:combatLow?.frequency.value,musicReady:music.readyState,musicVolume,sfxVolume,activeVoices:voices.size,weaponIdentities:Object.keys(weaponAudio).length,activeWeaponVoices:[...voices].filter(v=>v.group==='weapon').length,activeImpactVoices:[...voices].filter(v=>v.group==='impact').length,impactMix:{...impactStats},samples:loaded.size,failed:[...loaded].filter(([,ok])=>!ok).map(([name])=>name),played:{...played},outputRms:rms,outputPeak:peak};}
  // Only the game sound bus is exposed: no microphone or device capture.
  function captureStream(){return capture?.stream||null;}
  function ready(){return loading||Promise.resolve();}
  return{start,play,duck,volumes,toggle,unlock,diagnostics,captureStream,ready};
})();
