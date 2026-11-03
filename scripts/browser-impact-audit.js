// Evaluate in an independent silent QA page after the start gesture and Sound.ready().
window.qaImpactAudioStress=async function(seconds=6){
 await Sound.ready();const before=Sound.diagnostics();let begun=performance.now(),lastBurst=-99,peak=0,maxVoices=0,maxImpact=0,frames=0;
 const cues=['impactPencil','impactCut','impactGlass','impactInk','impactBloom','impactCrush'];
 const result=await new Promise(resolve=>{function tick(now){let age=(now-begun)/1000;if(age-lastBurst>=.1){lastBurst=age;for(let j=0;j<35;j++)Sound.play(cues[j%cues.length],.4,1,.025);Sound.play('heavyhit',.5);Sound.play('impactDefeat',.48);Sound.play('pencilShot',.28);}
 const d=Sound.diagnostics();peak=Math.max(peak,d.outputPeak);maxVoices=Math.max(maxVoices,d.activeVoices);maxImpact=Math.max(maxImpact,d.activeImpactVoices);frames++;if(age<seconds)requestAnimationFrame(tick);else resolve({seconds:age,frames,peak,maxVoices,maxImpact,before,after:d});}requestAnimationFrame(tick);});return result;
};
