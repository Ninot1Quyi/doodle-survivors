'use strict';
// True object-level defocus, baked once. Characters, enemies and projectiles stay sharp.
// Only background scenery is eligible; runtime uses one cached drawImage, no filter.
const FOCUS_LIMITS=Object.freeze({sources:10,variants:20,pixels:2500000});
const focusSources=['tree','pillar','arch','rock','stump','bigMushroom','paperHouse'];
const focusVariants=new Map();
let focusEnabled=true,focusReady=false,focusPixels=0,focusVariantCount=0,focusFallback=false;
function focusBake(source,blur){let ratio=source.img.width/source.w||2,pad=Math.ceil(blur*ratio*3)+2,width=source.img.width+pad*2,height=source.img.height+pad*2;if(focusVariantCount>=FOCUS_LIMITS.variants||focusPixels+width*height>FOCUS_LIMITS.pixels)return null;let image=document.createElement('canvas');image.width=width;image.height=height;let g=image.getContext('2d');if(!g)return null;
 if('filter' in g){g.filter=`blur(${blur*ratio}px)`;g.drawImage(source.img,pad,pad);g.filter='none';}
 else { // A fixed nine-tap softening fallback for browsers without canvas filters.
  focusFallback=true;g.globalCompositeOperation='lighter';g.globalAlpha=1/9;let step=blur*ratio*.85;for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)g.drawImage(source.img,pad+x*step,pad+y*step);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 }
 focusVariantCount++;focusPixels+=width*height;return{img:image,w:width/ratio,h:height/ratio,pad:pad/ratio};
}
function initFocus(){if(focusReady)return;focusReady=true;try{let saved=localStorage.getItem('paperFocus');focusEnabled=saved===null||saved!=='false'&&saved!=='0';}catch{}for(let name of focusSources.slice(0,FOCUS_LIMITS.sources)){let source=Art.sprites[name];if(!source?.img||!(source.w>0&&source.h>0))continue;let soft=focusBake(source,1.2),deep=focusBake(source,2);if(soft)focusVariants.set(name,{soft,deep:deep||soft});}setupFocusUI();}
function renderFocusedProp(o,coveredAlpha=1){if(!focusEnabled||!focusReady||!game?.hero)return false;let variants=focusVariants.get(o.name),source=Art.sprites[o.name];if(!variants||!source)return false;let p=game.hero,scale=o.scale||1,dx=o.x-p.x,dy=o.y-p.y,dist2=dx*dx+dy*dy;
 // Keep both the nearby ground and any canopy overlapping the player in focus.
 let half=source.w*scale*.5,top=o.y-source.h*scale,nearX=Math.max(o.x-half,Math.min(p.x,o.x+half)),nearY=Math.max(top,Math.min(p.y-35,o.y));if(dist2<320*320||(nearX-p.x)**2+(nearY-(p.y-35))**2<155*155){o.focusBand=0;return false;}
 let edge=Math.max(Math.abs(o.x-cam.x)/(viewW*.5),Math.abs(o.y-source.h*scale*.5-cam.y)/(viewH*.5)),reduced=typeof reducedEffects!=='undefined'&&reducedEffects;
 let previous=o.focusBand||0,softDistance=previous?380:410,softEdge=previous?.69:.75,deepDistance=previous===2?600:650,deepEdge=previous===2?.88:.94;
 let band=dist2>deepDistance*deepDistance||edge>deepEdge?2:dist2>softDistance*softDistance||edge>softEdge?1:0;if(reduced)band=dist2>650*650&&edge>.85?1:0;o.focusBand=band;if(!band)return false;
 let sprite=band===2?variants.deep:variants.soft;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.name==='tree'?Math.sin(realTime*.5+o.x)*.008:0);ctx.scale(scale,scale);ctx.globalAlpha=coveredAlpha;ctx.drawImage(sprite.img,-source.w/2-sprite.pad,-source.h-sprite.pad,sprite.w,sprite.h);ctx.restore();return true;
}
function setupFocusUI(){let container=document.getElementById('atmosphere-settings');if(!container||document.getElementById('scenery-focus'))return;let label=document.createElement('label'),input=document.createElement('input'),caption=document.createElement('span'),hint=document.createElement('small');input.id='scenery-focus';input.type='checkbox';input.checked=focusEnabled;input.style.width='auto';input.style.marginRight='8px';caption.textContent='景物柔焦';hint.textContent='远处与画面边缘的景物轻微模糊，人物附近保持清晰。';hint.style.display='block';hint.style.fontSize='12px';hint.style.opacity='.75';label.style.display='block';label.style.margin='14px 0 6px';label.append(input,caption);container.append(label,hint);input.onchange=()=>{focusEnabled=input.checked;try{localStorage.setItem('paperFocus',String(focusEnabled));}catch{}if(typeof renderDirty!=='undefined')renderDirty=true;};}
function getFocusStats(){return{sources:focusVariants.size,variants:focusVariantCount,pixels:focusPixels,bytes:focusPixels*4,enabled:focusEnabled,fallback:focusFallback};}
