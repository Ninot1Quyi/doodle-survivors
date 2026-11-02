'use strict';
// Screen-space paper atmosphere. Call after restoring the world/camera transform.
// No ctx.filter, readback, extra animation loop, gameplay RNG, or input mutations.
const ATMOSPHERE_LIMITS=Object.freeze({rain:48,flashAlpha:.055,flashInterval:12,hurtSeconds:.42});
const atmosphereModes=[
 {id:'cloudy',name:'纸上阴天',duration:55,speed:1,hint:'敌我移动速度正常'},
 {id:'rain',name:'轻轻落雨',duration:70,speed:.97,hint:'湿润纸地 · 敌我移动速度均 −3%'},
 {id:'storm',name:'远方雷雨',duration:35,speed:.96,hint:'雨势渐浓 · 敌我移动速度均 −4%'}
];
let atmosphere=null,reducedEffects=false,atmosphereEdges=null,atmosphereDamage=null,atmosphereStatus='',atmosphereStorageLoaded=false;
function atmospherePreference(){if(atmosphereStorageLoaded)return;atmosphereStorageLoaded=true;try{let stored=localStorage.getItem('reducedEffects');reducedEffects=stored===null?(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches):stored==='true'||stored==='1';}catch{reducedEffects=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;}}
function atmosphereRandom(){atmosphere.seed=(Math.imul(atmosphere.seed,1664525)+1013904223)>>>0;return atmosphere.seed/4294967296;}
function initAtmosphere(){atmospherePreference();atmosphere={mode:0,phase:0,time:0,notice:4,hurt:0,hurtGate:0,flash:0,nextFlash:14,seed:68361,rain:[]};for(let i=0;i<ATMOSPHERE_LIMITS.rain;i++)atmosphere.rain.push({x:atmosphereRandom(),y:atmosphereRandom(),speed:.29+atmosphereRandom()*.16,length:7+atmosphereRandom()*9});atmosphereStatus='';atmospherePublish();}
function weatherSpeed(){return atmosphere?atmosphereModes[atmosphere.mode].speed:1;}
function atmospherePublish(){if(!atmosphere)return;let mode=atmosphereModes[atmosphere.mode],text=mode.name+' · '+mode.hint;if(text===atmosphereStatus)return;atmosphereStatus=text;let label=document.getElementById('weather-status');if(label){label.textContent=text;label.title=text;}}
function updateAtmosphere(dt){if(!atmosphere||!Number.isFinite(dt)||dt<=0)return;let a=atmosphere;a.time+=dt;a.phase+=dt;a.notice=Math.max(0,a.notice-dt);a.hurt=Math.max(0,a.hurt-dt);a.hurtGate=Math.max(0,a.hurtGate-dt);a.flash=Math.max(0,a.flash-dt);while(a.phase>=atmosphereModes[a.mode].duration){a.phase-=atmosphereModes[a.mode].duration;a.mode=(a.mode+1)%atmosphereModes.length;a.notice=4;a.flash=0;a.nextFlash=14;atmospherePublish();}if(a.mode===2){a.nextFlash-=dt;if(a.nextFlash<=0){if(!reducedEffects)a.flash=.7;a.nextFlash=ATMOSPHERE_LIMITS.flashInterval+atmosphereRandom()*8;}}if(a.mode&&!reducedEffects){let drift=a.mode===2?.055:.025;for(let r of a.rain){r.x=(r.x+drift*dt)%1;r.y=(r.y+r.speed*dt)%1;}}}
function atmosphereHurt(){if(!atmosphere||atmosphere.hurtGate>0)return;atmosphere.hurt=ATMOSPHERE_LIMITS.hurtSeconds;atmosphere.hurtGate=.6;}
function atmosphereBake(){if(atmosphereEdges)return;let width=512,height=320;
 const layer=()=>{let c=document.createElement('canvas');c.width=width;c.height=height;return c;};
 atmosphereEdges=layer();let g=atmosphereEdges.getContext('2d'),v=g.createRadialGradient(width*.5,height*.48,95,width*.5,height*.48,295);v.addColorStop(0,'rgba(62,56,75,0)');v.addColorStop(.58,'rgba(62,56,75,0)');v.addColorStop(1,'rgba(62,56,75,.17)');g.fillStyle=v;g.fillRect(0,0,width,height);
 // Paper fibres stay in a narrow border; the combat area remains sharp.
 g.strokeStyle='rgba(249,236,209,.23)';g.lineWidth=.6;g.beginPath();for(let i=0;i<120;i++){let horizontal=i%2===0,x=horizontal?((i*73)%width):(i%4===1?4:width-9),y=horizontal?(i%4===0?4:height-8):((i*53)%height);g.moveTo(x,y);g.lineTo(x+(horizontal?4:2),y+(horizontal?2:5));}g.stroke();
 atmosphereDamage=layer();g=atmosphereDamage.getContext('2d');v=g.createRadialGradient(width*.5,height*.5,100,width*.5,height*.5,290);v.addColorStop(0,'rgba(167,75,102,0)');v.addColorStop(.6,'rgba(167,75,102,0)');v.addColorStop(1,'rgba(167,75,102,.48)');g.fillStyle=v;g.fillRect(0,0,width,height);
}
function renderAtmosphere(){if(!atmosphere||!(W>0&&H>0))return;atmosphereBake();let a=atmosphere,mode=atmosphereModes[a.mode];ctx.save();ctx.globalAlpha=reducedEffects?.4:1;ctx.drawImage(atmosphereEdges,0,0,W,H);
 if(a.mode&&!reducedEffects){ctx.globalAlpha=a.mode===2?.21:.14;ctx.strokeStyle='#a2a9b9';ctx.lineWidth=.85;ctx.beginPath();for(let r of a.rain){let x=r.x*(W+40)-20,y=r.y*(H+40)-20;ctx.moveTo(x,y);ctx.lineTo(x+(a.mode===2?4:2),y+r.length);}ctx.stroke();}
 // A single broad, soft pulse; no repeated lightning flicker or bright bolt.
 if(a.flash>0&&!reducedEffects){ctx.globalAlpha=Math.sin(Math.PI*a.flash/.7)*ATMOSPHERE_LIMITS.flashAlpha;ctx.fillStyle='#fff7df';ctx.fillRect(0,0,W,H);}
 if(a.hurt>0){let strength=a.hurt/ATMOSPHERE_LIMITS.hurtSeconds;ctx.globalAlpha=strength*(reducedEffects?.45:1);ctx.drawImage(atmosphereDamage,0,0,W,H);if(!reducedEffects){let drift=Math.sin((1-strength)*Math.PI*2)*3*strength;ctx.globalAlpha=strength*.34;ctx.drawImage(atmosphereEdges,-4+drift,-3,W+8,H+6);}}
 if(a.notice>0&&!document.getElementById('weather-status')){ctx.globalAlpha=Math.min(1,a.notice)*.88;ctx.textAlign='center';ctx.font='12px sans-serif';let label=mode.name+' · '+mode.hint,tw=Math.min(W-24,ctx.measureText(label).width+24);ctx.fillStyle='#f4e7ce';ctx.fillRect((W-tw)/2,61,tw,27);ctx.fillStyle='#746379';ctx.fillText(label,W/2,79,Math.max(20,W-36));}
 ctx.restore();
}
function setupAtmosphereUI(){atmospherePreference();let container=document.getElementById('atmosphere-settings');if(!container||document.getElementById('reduced-effects'))return;let label=document.createElement('label'),input=document.createElement('input'),caption=document.createElement('span'),hint=document.createElement('small');input.id='reduced-effects';input.type='checkbox';input.checked=reducedEffects;input.style.width='auto';input.style.marginRight='8px';caption.textContent='减少动态与闪光';hint.textContent='关闭雨线与雷光，减轻受伤晕影；天气规则不变。';hint.style.display='block';hint.style.fontSize='12px';hint.style.opacity='.75';label.style.display='block';label.style.margin='14px 0 6px';label.append(input,caption);container.append(label,hint);input.onchange=()=>{reducedEffects=input.checked;if(atmosphere)atmosphere.flash=0;try{localStorage.setItem('reducedEffects',String(reducedEffects));}catch{}if(typeof renderDirty!=='undefined')renderDirty=true;};}
