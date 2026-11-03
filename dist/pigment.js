'use strict';
const PIGMENTS=['#d9a649','#719ed2','#91b49b','#ae90cc','#cc9fbd'];
function renderPigmentPencil(b){
 const a=Math.atan2(b.vy,b.vx),col=b.tint||PIGMENTS[b.id%PIGMENTS.length],trail=b.trail||[];
 ctx.save();
 if(trail.length>1){let points=trail.slice(-5).concat([{x:b.x,y:b.y}]),left=[],right=[];for(let i=0;i<points.length;i++){let pt=points[i],next=points[Math.min(i+1,points.length-1)],prev=points[Math.max(0,i-1)],aa=Math.atan2(next.y-prev.y,next.x-prev.x),w=2.8*i/(points.length-1);left.push([pt.x-Math.sin(aa)*w,pt.y+Math.cos(aa)*w]);right.unshift([pt.x+Math.sin(aa)*w,pt.y-Math.cos(aa)*w]);}ctx.globalAlpha=.30;paperPolygon([...left,...right],col,null);ctx.globalAlpha=1;}
 ctx.translate(b.x,b.y);ctx.rotate(a);
 // A compact faceted pigment nib, with the pointed end on the velocity axis.
 ctx.fillStyle='#69597325';ctx.beginPath();ctx.ellipse(-2,4,13,3,0,0,TAU);ctx.fill();
 paperPolygon([[-13,-4],[-9,-6],[4,-5],[13,0],[4,5],[-10,5],[-13,2]],'#eee0bb','#716180',1.1);
 paperPolygon([[-12,-4],[4,-5],[4,0],[-12,1]],col,null);
 paperPolygon([[-12,1],[4,0],[4,5],[-10,5],[-13,2]],'#86759a',null);
 paperPolygon([[-10,1],[4,0],[4,3],[-10,4]],col,null);
 paperPolygon([[4,-5],[13,0],[4,5],[6,0]],'#ecd8ab','#987d86',.65);
 paperPolygon([[10,-1.7],[14,0],[10,1.7]],col,'#675674',.6);
 Art.line(ctx,[[-9,-3],[2,-3]],'#fff1cb',1.1);
 Art.line(ctx,[[-7,-.5],[-2,-.7]],'#fff0d866',.7);
 ctx.restore();
}
function renderPigmentMuzzle(f){
 let u=1-f.life/f.max,a=f.angle||0;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(a);ctx.globalAlpha=(1-u)*.8;
 paperPolygon([[0,-2],[14+u*9,-6*(1-u)],[22+u*15,0],[15+u*9,6*(1-u)],[0,2]],f.color||'#e6c37f',null);
 for(let i=-1;i<=1;i++){ctx.save();ctx.rotate(i*.45);paperPolygon([[7+u*20,-1],[10+u*24,-2],[15+u*28,0],[10+u*24,2]],PIGMENTS[(f.seed+i+6)%5],null);ctx.restore();}
 ctx.restore();
}
function renderPigmentContact(f,r,u){
 const a=f.angle||0,col=f.color||'#c6a0d3';ctx.save();ctx.translate(f.x,f.y);ctx.rotate(a);
 // White pressure point first; colored pigment and shavings unfold after the contact.
 let opening=Math.min(1,u*5),reach=r*(.25+u*.85);
 ctx.globalAlpha*=Math.max(0,1-u*.4);
 for(let i=0;i<7;i++){let aa=-1.35+i*.45,rr=reach*(.6+(i%3)*.2),x=Math.cos(aa)*rr,y=Math.sin(aa)*rr;ctx.save();ctx.translate(x,y);ctx.rotate(aa);paperPolygon([[-3,-2],[6+opening*5,0],[-2,3]],i%2?col:'#e8d7b7','#8f7796',.7);ctx.restore();}
 ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(0,0,r*(.22+.18*opening),r*(.14+.12*opening),0,0,TAU);ctx.fill();
 if(u<.38){ctx.globalAlpha*=1-u/.38;paperPolygon([[-r*.5,-3],[-4,-4],[2,-r*.45],[5,-4],[r*.6,0],[5,4],[2,r*.4],[-4,4]],'#fff5d9',null);}
 for(let side of [-1,1]){ctx.save();ctx.translate(8+u*r*.5,side*(6+u*r*.6));ctx.rotate(side*(.5+u*3));ctx.fillStyle='#e6c792';ctx.beginPath();ctx.moveTo(-6,-2);ctx.quadraticCurveTo(3,-8,8,-1);ctx.lineTo(7,3);ctx.quadraticCurveTo(1,-4,-5,2);ctx.closePath();ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.8;ctx.stroke();ctx.restore();}
 ctx.restore();
}
function renderCutContact(f,r,u){
 const a=(f.angle||0)-.55;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(a);let grow=.45+Math.min(1,u*5)*.65;
 ctx.scale(grow,grow);ctx.fillStyle=f.color||'#c8b2d5';ctx.beginPath();ctx.moveTo(-r*.9,r*.32);ctx.quadraticCurveTo(-r*.15,-r*.5,r*.95,-r*.35);ctx.quadraticCurveTo(r*.08,-r*.1,-r*.9,r*.32);ctx.fill();
 ctx.fillStyle='#fff2d0';ctx.beginPath();ctx.moveTo(-r*.75,r*.24);ctx.quadraticCurveTo(0,-r*.36,r*.9,-r*.34);ctx.quadraticCurveTo(0,-r*.17,-r*.75,r*.24);ctx.fill();
 for(let i=0;i<4;i++){let x=(i-1.5)*r*.5,y=(i%2?1:-1)*(6+u*r*.8);paperPolygon([[x-3,y-3],[x+7,y],[x-1,y+3]],i%2?'#dfc594':f.color,null);}
 ctx.restore();
}
function materialImpactSound(e,cause,crit,style={}){
 if(!visible(e.x,e.y,130))return;
 const k=style.weapon,cut=['saber','lance','scissors','gear','leaf','thread','whip','plane','paladin'].includes(k);
 // One outcome per contact: defeated enemies do not also trigger an ordinary hit and critical layer.
 const cue=e.hp<=0?'impactDefeat':crit?'heavyhit':k==='pencil'?'impactPencil':cut?'impactCut':({freeze:'impactGlass',soak:'impactInk',petals:'impactBloom',erase:'impactErase',crumple:'impactCrush',burn:'impactFire'}[cause]||'hit');
 Sound.play(cue,e.hp<=0?.48:crit?.5:.4,1+(e.id%3-1)*.018,.105);
}
function renderPolishedExplosion(f,r,u){
 const a=f.angle||0,col=f.color;ctx.save();ctx.translate(f.x,f.y);
 // One pressure core, a broken shock front, then separate curled paper chips.
 if(u<.48){ctx.globalAlpha*=Math.max(0,1-u/.48);ctx.fillStyle='#fff0c8';ctx.beginPath();ctx.ellipse(0,0,r*.6,r*.46,0,0,TAU);ctx.fill();}
 ctx.globalAlpha=Math.max(0,1-u)*.75;
 for(let i=0;i<8;i++){let aa=i*TAU/8+a,rr=r*(.55+u*.3),x=Math.cos(aa)*rr,y=Math.sin(aa)*rr;ctx.save();ctx.translate(x,y);ctx.rotate(aa+u*1.4);let sz=r*.14*(1-u*.4);paperPolygon([[-sz,-sz*.5],[sz*.8,-sz],[sz,sz*.5],[-sz*.6,sz]],col,'#9a7fa2',.9);paperPolygon([[-sz,-sz*.5],[0,0],[sz*.8,-sz]],'#f8e5c7',null);ctx.restore();}
 ctx.strokeStyle=col;ctx.lineWidth=4*(1-u)+1;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,Math.max(1,r),a+i*TAU/5,a+i*TAU/5+.9);ctx.stroke();}
 ctx.restore();
}

function renderBookContact(f,r,u){
 for(let i=0;i<5;i++){let a=i*TAU/5+(f.angle||0),travel=r*(.25+u*.9);renderLoosePage(f.x+Math.cos(a)*travel,f.y+Math.sin(a)*travel,7*(1-u*.4),a+u*2,u*7+i,1-u*.45);}
 if(u<.35){ctx.save();ctx.globalAlpha*=1-u/.35;paperPolygon([[f.x-r*.4,f.y],[f.x,f.y-5],[f.x+r*.5,f.y],[f.x,f.y+5]],'#fff1ce',null);ctx.restore();}
}
