'use strict';
// Short paper-and-ink hit accents. No digital glow or permanent full-screen blur.
const impactPalette=['#f6d08b','#d0b4d9','#e6a69d','#a9c8d8'];
function hitFeedback(e,crit,damage){if(!visible(e.x,e.y,80))return;if(game.fx.length<150&&((crit&&Math.random()<.65)||Math.random()<.17)){game.fx.push({type:'inkhit',x:e.x,y:e.y-e.r*.4,life:.2,max:.2,r:crit?25:17,seed:e.id+game.t,color:impactPalette[e.id%4],crit});}if(crit&&damage>80&&game.impactCooldown<=0){game.hitStop=.026;game.impactCooldown=.22;game.shake=Math.max(game.shake,3.5);}}
function renderImpact(f){if(f.type!=='inkhit')return false;let u=1-f.life/f.max;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.seed);ctx.globalAlpha=1-u;let r=f.r*(.65+u*.6);for(let i=0;i<7;i++){let a=i*TAU/7,inner=r*.38,outer=r*(i%2?.8:1);Art.line(ctx,[[Math.cos(a)*inner,Math.sin(a)*inner],[Math.cos(a)*outer,Math.sin(a)*outer]],i%2?'#fdf3d6':f.color,critWidth(f,i));}Art.ellipse(ctx,0,0,r*.27,r*.18,'#fff0bf',null);ctx.restore();return true;}
function critWidth(f,i){return f.crit?2.8-(i%2)*.9:1.6;}
