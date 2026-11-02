'use strict';
// Second edition: preserve identical rules, add handmade paper layers to original Canvas art.
if(EDITION==='paper'){
 const processed=new Map();
 for(const [name,sprite]of Object.entries(Art.sprites)){
  if(processed.has(sprite)){Art.sprites[name]=processed.get(sprite);continue;}
  const src=sprite.img,w=src.width,h=src.height;
  const mask=Art.canvas(w,h),m=mask.getContext('2d');m.drawImage(src,0,0);m.globalCompositeOperation='source-in';m.fillStyle='#fff8e9';m.fillRect(0,0,w,h);
  const out=Art.canvas(w,h),g=out.getContext('2d');
  // Slightly irregular scissor border. The lower edge is a second layer of kraft paper.
  g.globalAlpha=.55;for(let i=0;i<12;i++){let a=i*Math.PI/6;g.drawImage(mask,Math.cos(a)*4+1.4,Math.sin(a)*4+3.1);}g.globalCompositeOperation='source-in';g.fillStyle='#a89b86';g.fillRect(0,0,w,h);g.globalCompositeOperation='source-over';g.globalAlpha=1;
  for(let i=0;i<16;i++){let a=i*Math.PI/8,r=3.1+(i%3)*.55;g.drawImage(mask,Math.cos(a)*r,Math.sin(a)*r);}g.drawImage(src,0,-.6);
  // Fibres and soft crayon stippling are clipped to the illustration, generated once.
  const paint=Art.canvas(w,h),p=paint.getContext('2d');p.drawImage(src,0,0);p.globalCompositeOperation='source-atop';let seed=Art.hash(name.replace(/\d+$/,''));const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<w*h/55;i++){let x=random()*w,y=random()*h;p.fillStyle=i%3?'#604b7524':'#fffaf04d';p.fillRect(x,y,1+random()*2,.6+random());}
  p.lineWidth=.65;p.strokeStyle='#fffbed40';for(let i=0;i<w*h/240;i++){let x=random()*w,y=random()*h;p.beginPath();p.moveTo(x,y);p.lineTo(x+3+random()*5,y-2-random()*7);p.stroke();}g.drawImage(paint,0,-.6);
  const next={...sprite,img:out};processed.set(sprite,next);Art.sprites[name]=next;
 }
 // Warm sketchbook paper with fibres, pale watercolor islands and crosshatched pencil specks.
 const g=Art.ground.getContext('2d'),w=Art.ground.width,h=Art.ground.height;g.fillStyle='#f6e8d4';g.globalAlpha=.38;g.fillRect(0,0,w,h);g.globalAlpha=1;
 let seed=73;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<350;i++){let x=rand()*w,y=rand()*h;g.strokeStyle=i%3?'#a796a325':'#fff7e957';g.lineWidth=.4;g.beginPath();g.moveTo(x,y);g.lineTo(x+rand()*9,y+rand()*2);g.stroke();}
}
