'use strict';
// Recorded music + CC0 Foley only. No synthesized tones or oscillators.
const Sound=(()=>{
  let context,master,musicGain,sfxGain,compressor,lowpass,analyser,capture,musicSource,musicEQ,musicLow,trackGains;
  let started=false,muted=false,ducked=false,musicVolume=.38,sfxVolume=.56,loading,fadeTimer=null,crossfading=false,loopTransitions=0,activeTrack=0,musicGeneration=0;
  const buffers={},levels={},lastPlayed={},voices=new Set(),loaded=new Map(),played={};
  const names=['hit','hurt','shoot','pickup','level','explosion','dash','wind','lightning','confirm','heal','storm','victory',...['wood','snap','glass','metal','soft','body','paper'].flatMap(k=>[k+'0',k+'1',k+'2'])];
  let music=new Audio('audio/music.mp3');
  const musicPlayers=[music,new Audio('audio/music.mp3')];
  for(let i=0;i<2;i++){let audio=musicPlayers[i];audio.id='background-music'+(i?'-overlap':'');audio.hidden=true;audio.loop=true;audio.preload='auto';audio.volume=musicVolume;audio.addEventListener('timeupdate',()=>{if(audio===music)advanceMusicLoop();});document.body.append(audio);}
  const variations={};
  // A cue's layers are gently pitched recordings, with independent timing and gain.
  const cues={
    chestRise:{layers:[['wind',.6,1.2],['metal$',.5,.9,.22],['paper$',.5,1.1,.38]],priority:5,boost:1.1,tail:.65},
    chestBurst:{layers:[['body$',.7,.88],['snap$',.8,1],['victory',.85,1.12,.08],['glass$',.6,1.35,.22]],priority:5,boost:1.1,tail:1.65},
    chestReveal:{layers:[['level',.65,1.18],['pickup',.6,1.35,.16],['glass$',.35,1.5,.32]],priority:5,boost:1.05,tail:.8},
    heavyhit:{layers:[['snap$',.9,1.02],['body$',.8,.94],['metal$',.25,1.18,.008]],priority:3,boost:1,tail:.17},
    parry:{layers:[['metal$',.62,1.28],['glass$',.3,1.3]],priority:2,boost:1,tail:.18},
    hit:{layers:[['snap$',.8,1.12],['body$',.5,1.08],['wood$',.35,1.18]],priority:2,boost:1.1,tail:.14},
    pencilShot:{layers:[['wood$',.58,1.48],['dash',.1,1.28]],priority:1,boost:.9,tail:.10},
    impactPencil:{layers:[['snap$',.85,1.12],['wood$',.65,1.08],['body$',.48,1.04]],priority:2,boost:1.05,tail:.14},
    impactCut:{layers:[['metal$',.55,1.26],['paper$',.5,1.15]],priority:2,boost:1,tail:.16},
    impactGlass:{layers:[['glass$',.8,1.13],['metal$',.16,1.4]],priority:2,boost:1,tail:.23},
    impactInk:{layers:[['soft$',.8,1.16],['wood$',.22,1.12]],priority:2,boost:1.1,tail:.16},
    impactBloom:{layers:[['paper$',.7,1.18],['glass$',.14,1.42]],priority:2,boost:1,tail:.17},
    impactErase:{layers:[['paper$',.7,1.3],['snap$',.18,1.25]],priority:2,boost:1,tail:.14},
    impactCrush:{layers:[['snap$',.7,1.08],['body$',.35,1.08]],priority:2,boost:1,tail:.17},
    impactFire:{layers:[['snap$',.72,1.12],['body$',.23,1.06]],priority:2,boost:1,tail:.18},
    shoot:{layers:[['shoot',1,1]],priority:0,boost:1.8,tail:.19},
    pickup:{layers:[['pickup',1,.9]],priority:2,boost:2.8,tail:.25},
    hurt:{layers:[['hurt',1,.84],['hit',.35,.75,.045]],priority:4,boost:1.45,tail:.42},
    rose:{layers:[['shoot',.7,.83],['wind',.27,1.2,.025]],priority:1,boost:1.2,tail:.30},
    star:{layers:[['pickup',.7,.95],['shoot',.55,1.1]],priority:1,boost:1.2,tail:.30},
    plane:{layers:[['dash',.8,1.15]],priority:1,boost:1.15,tail:.32},
    bubble:{layers:[['pickup',.8,.68]],priority:1,boost:1.25,tail:.24},
    bell:{layers:[['level',.65,.78],['pickup',.45,1,.09]],priority:2,boost:1,tail:.70},
    ribbon:{layers:[['wind',.7,1.12],['dash',.35,.85,.04]],priority:1,boost:1.2,tail:.40},
    fusion:{layers:[['level',.75,.8],['victory',.6,1,.20],['pickup',.6,1.2,.43]],priority:5,boost:1.25,tail:1.4},
    event:{layers:[['heal',.8,.9],['pickup',.55,1,.15]],priority:3,boost:1.15,tail:.85},
    boss:{layers:[['storm',.7,.7],['hurt',.55,.6,.18]],priority:5,boost:1.1,tail:1.2},
    level:{layers:[['level',1,.9]],priority:4,boost:.95,tail:1.1},
    victory:{layers:[['victory',1,.9]],priority:5,boost:1,tail:1.4},
    heal:{layers:[['heal',1,1]],priority:3,boost:1.1,tail:.8},
    confirm:{layers:[['confirm',1,1]],priority:3,boost:1.2,tail:.3},
    explosion:{layers:[['explosion',1,1]],priority:1,boost:.8,tail:.55},
    storm:{layers:[['storm',1,1]],priority:4,boost:.9,tail:.9},
    lightning:{layers:[['lightning',1,1]],priority:1,boost:1,tail:.45},
    wind:{layers:[['wind',1,1]],priority:0,boost:.9,tail:.6},
    dash:{layers:[['dash',1,1]],priority:2,boost:1.15,tail:.4}
  };
  const aliases={
    pencil:'pencilShot',frost:'bell',comet:'star',nova:'star',garden:'rose',aurora:'bell',tempest:'wind',dragon:'explosion',mirror:'bell',crown:'star',candle:'shoot',clover:'event',bossTell:'boss',boss_tell:'boss',chest:'event',coin:'pickup',
    saber:'dash',lance:'shoot',marble:'pickup',yoyo:'ribbon',rocket:'dash',firecracker:'explosion',ruler:'wind',prism:'bell',turret:'shoot',foxspirit:'rose',mine:'explosion',stamp:'hurt',whip:'dash',thread:'ribbon',roller:'wind',chalk:'shoot',camera:'lightning',music:'bell',meteor:'explosion',compass:'star',magnetArm:'wind',gear:'ribbon',umbrella:'bubble',kite:'wind',leaf:'dash',shield:'confirm',portal:'wind',void:'storm',
    paladin:'storm',pinball:'star',festival:'explosion',rainbowLaser:'bell',clockwork:'shoot',printingPress:'hurt',loom:'ribbon',livingMural:'rose',spotlight:'bell',orrery:'star',scrapColossus:'explosion',skyWhale:'wind',autumnGuardian:'dash',paperCosmos:'storm'
  };
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
        levels[name]={peak,rms,gain:clamp(Math.min(.75/Math.max(peak,.001),.16/Math.max(rms,.005)),.4,3.5)};
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
  async function start(){duck(false);await activate(true);duck(false);}
  async function unlock(){await activate(false);duck(ducked);}
  function voice(sample,volume,rate,delay,priority,tail){
    const buffer=buffers[sample];if(!buffer)return false;
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
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+.0008);
    const duration=Math.min(buffer.duration/source.playbackRate.value,tail);
    gain.gain.setValueAtTime(level,now+Math.max(.006,duration*.28));gain.gain.exponentialRampToValueAtTime(.0001,now+Math.max(.025,duration+.035));
    source.connect(gain);gain.connect(sfxGain);
    const record={source,gain,priority};voices.add(record);
    source.onended=()=>{voices.delete(record);source.disconnect();gain.disconnect();};
    source.start(now);source.stop(now+duration+.045);return true;
  }
  function play(name,volume=.3,rate=1,minInterval=.08){
    if(!started||muted||!context||context.state!=='running')return false;
    name=aliases[name]||name;const cue=cues[name];if(!cue)return false;
    const now=context.currentTime;
    if(now-(lastPlayed[name]??-99)<Math.max(.025,minInterval))return false;
    const variant=variations[name]||0;const layers=cue.layers.map(([sample,...rest])=>[sample.replace('$',String(variant%3)),...rest]);if(!layers.some(([sample])=>buffers[sample]))return false;
    let audible=false;
    for(const [sample,mix,pitch,delay=0]of layers)audible=voice(sample,clamp(volume,0,1)*cue.boost*mix,rate*pitch,delay,cue.priority,cue.tail)||audible;
    if(audible){variations[name]=variant+1;lastPlayed[name]=now;played[name]=(played[name]||0)+1;}
    if(audible&&cue.priority>=4&&!ducked){musicGain.gain.cancelScheduledValues(now);musicGain.gain.setTargetAtTime(musicVolume*.26,now,.05);musicGain.gain.setTargetAtTime(musicVolume*.43,now+.35,.16);}
    return audible;
  }
  function duck(on){ducked=!!on;if(musicGain&&context){const now=context.currentTime;musicGain.gain.cancelScheduledValues(now);musicGain.gain.setTargetAtTime(musicVolume*(ducked?.15:.43),now,.2);musicLow.frequency.setTargetAtTime(ducked?5800:20000,now,.3);}}
  function volumes(m,s){musicVolume=clamp(Number(m)||0,0,1);sfxVolume=clamp(Number(s)||0,0,1);duck(ducked);if(sfxGain&&context)sfxGain.gain.setTargetAtTime(sfxVolume,context.currentTime,.06);try{localStorage.setItem('doodle-audio',JSON.stringify({music:musicVolume,sfx:sfxVolume}));}catch{}}
  function toggle(){muted=!muted;if(master&&context)master.gain.setTargetAtTime(muted?0:.82,context.currentTime,.06);return muted;}
  function diagnostics(){let rms=0,peak=0;if(analyser){const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);for(const sample of samples){rms+=sample*sample;peak=Math.max(peak,Math.abs(sample));}rms=Math.sqrt(rms/samples.length);}return{started,muted,contextState:context?.state||'uninitialized',musicPaused:music.paused,musicTrack:'Master of the Feast',musicLoopEnd:220.7,loopTransitions,crossfading,sfxLowpass:lowpass?.frequency.value,musicReady:music.readyState,musicVolume,sfxVolume,activeVoices:voices.size,samples:loaded.size,failed:[...loaded].filter(([,ok])=>!ok).map(([name])=>name),played:{...played},outputRms:rms,outputPeak:peak};}
  // Only the game sound bus is exposed: no microphone or device capture.
  function captureStream(){return capture?.stream||null;}
  function ready(){return loading||Promise.resolve();}
  return{start,play,duck,volumes,toggle,unlock,diagnostics,captureStream,ready};
})();
