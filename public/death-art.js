'use strict';
// Bounded, pre-baked-sprite death vignettes. No per-death canvas, filters or image readback.
const DeathFX=(()=>{
const MAX_BODIES=12,MAX_PIECES=120,TAU=Math.PI*2;
const bodies=[];let pieceCount=0;
const aliases={pencil:'confetti',scissors:'confetti',plane:'confetti',star:'confetti',fire:'burn',flame:'burn',ash:'burn',burned:'burn',ink:'soak',bubble:'soak',water:'soak',soaked:'soak',tornado:'crumple',wind:'crumple',crushed:'crumple',eraser:'erase',erased:'erase',ice:'freeze',rose:'petals',garden:'petals'};
function reset(){bodies.length=0;pieceCount=0;}
function spawn(e,cause='confetti'){
 if(!e||!Number.isFinite(e.x)||!Number.isFinite(e.y)||bodies.length>=MAX_BODIES)return false;
 if(typeof visible==='function'&&!visible(e.x,e.y,150))return false;
 const kind=aliases[cause]||cause;if(!['confetti','burn','soak','crumple','erase','freeze','petals'].includes(kind))return spawn(e,'confetti');
 const boss=!!e.boss||String(e.kind).startsWith('boss');
 const name=boss?e.kind:e.kind==='knight'?'knight':e.kind+(Math.floor(e.frame||0)%8);
 const sprite=Art.sprites[name]||Art.sprites[e.kind];if(!sprite?.img)return false;
 const base=boss?1:(typeof enemyTypes!=='undefined'&&enemyTypes[e.kind]?.scale)||.82;
 const variant=Number.isFinite(e.variantScale)&&e.variantScale>0?e.variantScale:1;
 const scale=base*variant,w=sprite.w*scale,h=sprite.h*scale;
 const count=kind==='confetti'||kind==='petals'||kind==='freeze'?9:kind==='crumple'?6:7;
 if(pieceCount+count>MAX_PIECES)return false;
 const life=boss?1.1:kind==='erase'?.82:kind==='burn'?.84:kind==='soak'?.8:.72;
 const b={kind,x:e.x,y:e.y,w,h,img:sprite.img,age:0,life,flip:e.facing===-1?-1:typeof game!=='undefined'&&game?.hero&&e.x>game.hero.x?-1:1,pieces:[],seed:Math.random()*TAU};
 // Every cutout references a region of the existing sprite; its original artwork colors survive.
 for(let i=0;i<count;i++){
  const col=i%3,row=Math.floor(i/3),rows=Math.ceil(count/3),sx=col*sprite.img.width/3,sy=row*sprite.img.height/rows;
  const angle=i/count*TAU+b.seed;
  b.pieces.push({sx,sy,sw:sprite.img.width/3,sh:sprite.img.height/rows,dx:(col/3-.5)*w,dy:(row/rows-1)*h,dw:w/3,dh:h/rows,
   vx:Math.cos(angle)*(35+Math.random()*65),vy:-35-Math.random()*80,spin:(Math.random()-.5)*9,angle:(Math.random()-.5)*.25,
   ax:(Math.random()-.5)*w,ay:-Math.random()*h*.75,size:1.5+Math.random()*2.5});
 }
 bodies.push(b);pieceCount+=count;return true;
}
function update(dt){if(!Number.isFinite(dt)||dt<=0)return;for(let i=bodies.length-1;i>=0;i--){let b=bodies[i];b.age+=dt;if(b.age>=b.life){pieceCount-=b.pieces.length;bodies.splice(i,1);}}}
function sprite(g,b,alpha=1){g.globalAlpha*=alpha;g.drawImage(b.img,-b.w/2,-b.h,b.w,b.h);}
function cut(g,b,p,x,y,angle,scale=1){g.save();g.translate(x+p.dw/2,y+p.dh/2);g.rotate(angle);g.drawImage(b.img,p.sx,p.sy,p.sw,p.sh,-p.dw*scale/2,-p.dh*scale/2,p.dw*scale,p.dh*scale);g.restore();}
function ripple(g,x,y,rx,ry,color,width){g.beginPath();g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);g.strokeStyle=color;g.lineWidth=width;g.stroke();}
function flame(g,x,y,size,phase){g.beginPath();g.moveTo(x-size*.5,y);g.quadraticCurveTo(x-size,y-size*.7,x-size*.15,y-size*1.7);g.quadraticCurveTo(x+size*.2,y-size*1.1,x+Math.sin(phase)*size*.3,y-size*2.1);g.quadraticCurveTo(x+size,y-size*.8,x+size*.5,y);g.closePath();g.fillStyle='#e7af73';g.fill();g.strokeStyle='#b78474';g.lineWidth=.8;g.stroke();g.beginPath();g.moveTo(x-size*.22,y-size*.1);g.lineTo(x+size*.04,y-size*1.15);g.lineTo(x+size*.22,y-size*.12);g.strokeStyle='#f6dfac';g.lineWidth=1.8;g.stroke();}
function render(g){for(let i=0;i<bodies.length;i++){
 const b=bodies[i];if(typeof visible==='function'&&!visible(b.x,b.y,180))continue;
 const u=b.age/b.life,fade=Math.min(1,(1-u)*3),t=b.age;
 PaperCamera.upright(g,b.x,b.y,()=>{g.scale(b.flip,1);g.globalAlpha*=fade;g.lineCap='round';g.lineJoin='round';
 if(b.kind==='confetti'||b.kind==='petals'||b.kind==='freeze'){
  for(let j=0;j<b.pieces.length;j++){let p=b.pieces[j],x=p.dx+p.vx*t,y=p.dy+p.vy*t+100*t*t,angle=p.angle+p.spin*t;
   cut(g,b,p,x,y,angle,1-u*.35);
   if(b.kind==='freeze'){g.save();g.translate(x+p.dw/2,y+p.dh/2);g.rotate(angle);g.strokeStyle='#b0ceda';g.lineWidth=1.3;g.strokeRect(-p.dw*.38,-p.dh*.38,p.dw*.76,p.dh*.76);g.restore();}
   else if(b.kind==='petals'){g.fillStyle=j%2?'#dca5b9':'#efd0cd';g.beginPath();g.ellipse(x,y,3.5,6,angle,0,TAU);g.fill();}
  }
 }else if(b.kind==='burn'){
  const remain=Math.max(0,1-u*1.55),sh=b.img.height*remain;
  if(sh>0)g.drawImage(b.img,0,b.img.height-sh,b.img.width,sh,-b.w/2,-b.h*remain,b.w,b.h*remain);
  for(let j=0;j<b.pieces.length;j++){let p=b.pieces[j];g.fillStyle=j%2?'#9f929b':'#b8a9aa';g.save();g.translate(p.ax+p.vx*t*.22,p.ay-55*t);g.rotate(p.spin*t);g.fillRect(-p.size/2,-p.size/2,p.size,p.size*.7);g.restore();if(u<.76)flame(g,p.ax,-b.h*remain+3,Math.min(12,b.w*.14)*(1-u*.6),t*9+j);}
 }else if(b.kind==='soak'){
  const squash=Math.max(.06,1-u*1.8);g.save();g.scale(1+u*.3,squash);sprite(g,b,Math.max(0,1-u*1.25));g.restore();
  PaperCamera.ground(g,()=>{ripple(g,0,0,b.w*(.25+u*.6),b.w*(.08+u*.15),'#8dacc7',2);ripple(g,-3,2,b.w*(.16+u*.45),b.w*(.05+u*.11),'#c9dce2',1.4);});
  for(let j=0;j<b.pieces.length;j++){let p=b.pieces[j],x=p.ax+p.vx*t*.35,y=-Math.sin(Math.min(1,u*1.5)*Math.PI)*(12+j*3);g.fillStyle=j%2?'#a8c7d8':'#d5dfdf';g.beginPath();g.ellipse(x,y,2.2,3.5,0,0,TAU);g.fill();}
 }else if(b.kind==='crumple'){
  const gather=Math.max(0,1-u*1.8),sc=Math.max(.12,1-u*1.4);
  for(let j=0;j<b.pieces.length;j++){let p=b.pieces[j];cut(g,b,p,p.dx*gather,p.dy*gather-10*u,p.angle+p.spin*t*.5,sc);}
  if(u>.35){let r=Math.min(11,b.w*.16)*(1-u*.35),y=-8;g.beginPath();for(let j=0;j<9;j++){let a=j*TAU/9,rr=r*(j%2?.8:1);let x=Math.cos(a)*rr,yy=y+Math.sin(a)*rr;if(j===0)g.moveTo(x,yy);else g.lineTo(x,yy);}g.closePath();g.fillStyle='#e4d7c7';g.fill();g.strokeStyle='#9d8b9c';g.lineWidth=.9;g.stroke();g.beginPath();g.moveTo(-r*.7,y-r*.3);g.lineTo(r*.2,y);g.lineTo(-r*.3,y+r*.7);g.moveTo(r*.5,y-r*.7);g.lineTo(r*.2,y);g.lineTo(r*.8,y+r*.4);g.stroke();}
 }else if(b.kind==='erase'){
  const boundary=Math.min(1,u*1.6),strips=7;
  for(let j=0;j<strips;j++){let jag=(j%3-1)*.04,remaining=Math.max(0,1-boundary-jag);if(remaining<=0)continue;g.drawImage(b.img,b.img.width*(1-remaining),j*b.img.height/strips,b.img.width*remaining,b.img.height/strips,-b.w/2+b.w*(1-remaining),-b.h+j*b.h/strips,b.w*remaining,b.h/strips);}
  if(u<.78){let x=-b.w/2+b.w*boundary,y=-b.h*.48;g.save();g.translate(x,y);g.rotate(-.3);const eraser=Art.sprites.eraser;if(eraser)g.drawImage(eraser.img,-15,-20,30,28);else{g.fillStyle='#dfb1c1';g.strokeStyle='#a07d96';g.lineWidth=1;g.fillRect(-12,-17,24,28);g.strokeRect(-12,-17,24,28);g.fillStyle='#eee0c5';g.fillRect(-12,-3,24,14);g.strokeRect(-12,-3,24,14);g.beginPath();g.moveTo(-8,-12);g.lineTo(8,-12);g.strokeStyle='#f5dbe0';g.stroke();}g.restore();}
  for(let j=0;j<b.pieces.length;j++){let p=b.pieces[j];g.fillStyle=j%2?'#d3bbc8':'#e9dccb';g.fillRect(-b.w*.3+p.vx*t*.45,p.ay+35*t,p.size*1.7,p.size*.65);}
 }
 });
}}
function diagnostics(){return{active:bodies.length,pieces:pieceCount,maxActive:MAX_BODIES,maxPieces:MAX_PIECES};}
return{reset,spawn,update,render,diagnostics};
})();
