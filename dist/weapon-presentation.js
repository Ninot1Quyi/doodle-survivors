'use strict';
// Explicit visual vocabulary for every weapon. World-space shapes follow combat geometry.
const WEAPON_PRESENTATION={
 pencil:'pigment-dart',book:'turning-pages',lightning:'cut-paper-bolt',tornado:'folded-helix',fire:'flame-comet',scissors:'cutting-blades',ink:'bottle-splash',
 rose:'root-and-bloom',star:'star-comet',plane:'folded-flight',bubble:'glass-facets',bell:'bell-resonance',ribbon:'silk-return',frost:'ice-shards',
 saber:'blade-sweep',lance:'spear-extension',marble:'rolling-glass',yoyo:'corded-return',rocket:'rocket-exhaust',firecracker:'fuse-and-burst',ruler:'measuring-beam',prism:'split-spectrum',turret:'aimed-cannon',foxspirit:'running-familiar',mine:'armed-flower',stamp:'falling-seal',whip:'thorn-sweep',thread:'stitched-needles',roller:'wet-paint',chalk:'chalk-barricade',camera:'shutter-cone',music:'musical-flight',meteor:'falling-meteor',compass:'target-dial',magnetArm:'closing-claws',gear:'orbiting-teeth',umbrella:'paper-rain',kite:'bowed-string',leaf:'turning-leaf',shield:'folded-plates',portal:'paired-doors',void:'torn-vortex',
 paladin:'armored-swords',pinball:'bumpers-and-ball',festival:'firework-petals',rainbowLaser:'spectrum-wheel',clockwork:'walking-castle',printingPress:'moving-press',loom:'woven-collapse',livingMural:'living-vines',spotlight:'theatre-focus',orrery:'sun-and-planets',scrapColossus:'clapping-giant',skyWhale:'rain-whale',autumnGuardian:'leaf-guard',paperCosmos:'cosmic-fold',comet:'meteor-procession',garden:'rose-canopy',aurora:'prismatic-nodes',tempest:'airplane-helix',nova:'stellar-collapse',dragon:'ribbon-dragon',mirror:'crystal-arena'
};
function paperPolygon(points,fill,stroke='#775a80',width=1.3){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function paperBand(x,y,a,length,width,color,phase=0){ctx.save();ctx.translate(x,y);ctx.rotate(a);let top=[],bottom=[];for(let i=0;i<=8;i++){let u=i/8,w=width*(.28+.72*Math.sin(u*Math.PI/2)),ripple=Math.sin(u*8+phase)*width*.15;top.push([u*length,-w+ripple]);bottom.unshift([u*length,w+ripple]);}paperPolygon([...top,...bottom],color,'#85688e',1);ctx.globalAlpha*=.55;paperPolygon([[0,0],[length*.25,-width*.22],[length,width*.2],[length,0]],'#fff4cf',null);ctx.restore();}
function paperPetals(x,y,r,n,color,phase=0,inner=.2){ctx.save();ctx.translate(x,y);for(let i=0;i<n;i++){let a=i*TAU/n+phase;ctx.save();ctx.rotate(a);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(r*inner,0);ctx.bezierCurveTo(r*.62,-r*.22,r*.93,-r*.12,r,0);ctx.bezierCurveTo(r*.8,r*.16,r*.5,r*.16,r*inner,0);ctx.fill();ctx.strokeStyle='#816584';ctx.lineWidth=1;ctx.stroke();ctx.restore();}ctx.restore();}
function paperBurst(x,y,r,color,phase=0){paperPetals(x,y,r,7,color,phase);impactStar(x,y,r*.45,phase,'#fff0bf',7);for(let i=0;i<7;i++){let a=i*TAU/7+phase;paperPolygon([[x+Math.cos(a)*r*1.12,y+Math.sin(a)*r*1.12],[x+Math.cos(a+.06)*r*1.26,y+Math.sin(a+.06)*r*1.26],[x+Math.cos(a+.14)*r*1.12,y+Math.sin(a+.14)*r*1.12]],color,null);}}
function battleCutout(name,x,y,scale=1,angle=0,alpha=1){drawCenteredSprite(name,x,y,scale,angle,Math.min(ctx.globalAlpha,alpha));}
function fieldWash(x,y,r,col,alpha=.12){ctx.save();ctx.globalAlpha*=alpha;Art.ellipse(ctx,x,y,Math.max(.1,r),Math.max(.1,r),col,null);ctx.restore();}
function paintTrail(x,y,a,length,width,col,phase=0){paperBand(x,y,a,length,width,col,phase);ctx.save();ctx.translate(x,y);ctx.rotate(a);for(let i=1;i<6;i++){let xx=length*i/6;Art.ellipse(ctx,xx,Math.sin(i*12+phase)*width*.7,3+i%3,2,'#fff0c555',null);}ctx.restore();}
function crystal(x,y,r,a,col='#b9d5df'){ctx.save();ctx.translate(x,y);ctx.rotate(a);paperPolygon([[0,-r],[r*.55,-r*.3],[r*.4,r*.7],[0,r],[-r*.5,r*.3],[-r*.35,-r*.6]],col);paperPolygon([[0,-r],[r*.55,-r*.3],[0,r]],'#fff3d9',null);Art.line(ctx,[[0,-r],[0,r]],'#a18bb7',1);ctx.restore();}
function roseVines(x,y,r,age,fade=1,mural=false){ctx.save();ctx.globalAlpha*=fade;fieldWash(x,y,r,'#a6b58c',.12);let growth=clamp(age*2,0,1),n=reducedEffects?7:12;for(let i=0;i<n;i++){let a=i*TAU/n,rr=r*(.52+(i%3)*.2)*growth,px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#95a982';ctx.beginPath();ctx.moveTo(0,-3);ctx.quadraticCurveTo(rr*.45,-17,rr,0);ctx.quadraticCurveTo(rr*.5,-9,0,4);ctx.closePath();ctx.fill();ctx.restore();for(let j=1;j<3;j++)battleCutout('leaf',x+Math.cos(a)*rr*j/3,y+Math.sin(a)*rr*j/3,.24,a+j*.7);battleCutout(mural&&i%3===0?'plane':'rose',px,py,.36+growth*.13,Math.sin(age*2+i)*.15);}ctx.restore();}
function renderBattleBullet(b){
 if(b.kind==='pencil'){renderPigmentPencil(b);return;}
 let a=Math.atan2(b.vy,b.vx),speed=Math.hypot(b.vx,b.vy),col=weaponData[b.kind]?.color||'#b9c2db',tail=Math.min(85,speed*.17),age=(b.max||2.2)-b.life;
 ctx.save();
 if(b.kind==='bubble'||b.kind==='aurora'){let r=15+(b.id%3);fieldWash(b.x,b.y,r+5,'#a49acb',.2);Art.ellipse(ctx,b.x,b.y,r,r,'#dbd9ee99','#a398c7',2);ctx.save();ctx.beginPath();ctx.arc(b.x,b.y,r,0,TAU);ctx.clip();paperPolygon([[b.x-r,b.y-r],[b.x+r,b.y],[b.x-r,b.y+r]],'#e7cfdc66',null);ctx.restore();Art.ellipse(ctx,b.x-5,b.y-6,4,6,'#fff8eb',null);Art.ellipse(ctx,b.x+6,b.y+5,3,2,'#9ec9dc',null);}
 else if(b.kind==='fire'){ctx.translate(b.x,b.y);ctx.rotate(a);let flutter=Math.sin(game.t*27+b.id)*5;paperPolygon([[16,0],[5,-11],[-12,-15],[-35,-8],[-tail,flutter],[-30,9],[-10,16],[6,10]],'#d98969','#795473',1.5);paperPolygon([[10,0],[-6,-8],[-37,0],[-8,9]],'#f6ca85',null);paperPolygon([[8,0],[-7,-4],[-18,0],[-6,4]],'#fff2c8',null);}
 else {if(['ribbon','dragon'].includes(b.kind)){paperBand(b.x-Math.cos(a)*tail,b.y-Math.sin(a)*tail,a,tail,9,col,age*12);for(let j=1;j<4;j++)battleCutout('ribbon',b.x-Math.cos(a)*j*18,b.y-Math.sin(a)*j*18,.2,a+Math.sin(age*12+j)*.5);}
 else if(b.kind==='scissors'){paperBand(b.x-Math.cos(a)*tail,b.y-Math.sin(a)*tail,a,tail,5,'#c5b5d4',age*15);for(let i=1;i<4;i++){let x=b.x-Math.cos(a)*i*18,y=b.y-Math.sin(a)*i*18;crystal(x,y,3,a+i,'#f0d8a8');}}
 else if(b.kind==='frost'){paperBand(b.x-Math.cos(a)*tail*.65,b.y-Math.sin(a)*tail*.65,a,tail*.65,5,'#a2ccdc',age*12);crystal(b.x,b.y,19,a+Math.PI/2);crystal(b.x-Math.cos(a)*17,b.y-Math.sin(a)*17,9,a+1,'#c5c0e2');}
 else {paperBand(b.x-Math.cos(a)*tail,b.y-Math.sin(a)*tail,a,tail,b.kind==='pencil'?5:8,col,age*8);if(b.kind==='star'||b.kind==='comet')for(let i=1;i<3;i++)impactStar(b.x-Math.cos(a)*i*23,b.y-Math.sin(a)*i*23,6-i,a,col,5);}
 if(b.kind==='scissors'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);const open=.16+Math.sin(game.t*22+b.id)*.12;for(let side of [-1,1]){ctx.save();ctx.rotate(side*open);paperPolygon([[-5,side*3],[25,side*2],[4,-side*4]],'#d9d7e7');Art.ellipse(ctx,-12,side*7,8,6,null,'#ac85b4',4);ctx.restore();}Art.ellipse(ctx,0,0,3,3,'#eacb89','#795c82',1);ctx.restore();}
 else if(b.kind!=='frost'){let spin=['star','comet'].includes(b.kind)?game.t*4+b.id:a+(b.kind==='plane'?.64:b.kind==='pencil'?Math.PI:0);battleCutout({comet:'star',dragon:'dragon'}[b.kind]||b.kind,b.x,b.y,b.kind==='pencil'?.55:b.kind==='plane'?.62:.48,spin);}
 }ctx.restore();
}
function renderEnemyBullet(b){ctx.save();const a=Math.atan2(b.vy,b.vx),r=b.r||7;ctx.translate(b.x,b.y);ctx.rotate(a);paperPolygon([[-r,-r*.6],[-r-18,0],[-r,r*.6]],'#cb364f88',null);Art.ellipse(ctx,0,0,r+2,r+2,'#ffe5dc','#8b223c',1.4);Art.ellipse(ctx,0,0,r,r,'#e14755','#a2253e',1.2);paperPolygon([[r*.6,0],[-r*.35,-r*.5],[-r*.35,r*.5]],'#ffaaaa',null);ctx.restore();}
function renderBattleWind(w,evolved=false){
 const age=w.max-w.life,fade=Math.min(1,age*4,w.life*2),r=w.r,h=110+r*.45;
 ctx.save();ctx.globalAlpha=fade;fieldWash(w.x,w.y,r,'#a3b9cf',.12);
 for(let j=0;j<3;j++){let front=[],back=[];for(let i=0;i<=46;i++){let v=i/46,aa=game.t*4+v*TAU*2+j*TAU/3,rr=8+v*r*.75,x=w.x+Math.cos(aa)*rr,y=w.y-v*h+Math.sin(aa)*rr*.2,width=4+v*9;front.push([x,y-width]);back.unshift([x,y+width]);}paperPolygon([...front,...back],['#b8a3d1','#98bbce','#d8c491'][j],'#8b7b9a',.8);ctx.globalAlpha=fade*.7;Art.line(ctx,front,'#fff0cf',1.2);ctx.globalAlpha=fade;}
 for(let i=0;i<(evolved?8:5);i++){let a=game.t*3+i*2.4,rr=r*(.55+(i%2)*.2);battleCutout(evolved?'plane':'leaf',w.x+Math.cos(a)*rr,w.y-h*.45+Math.sin(a)*rr*.35,evolved?.38:.23,a+.64);}
 ctx.restore();
}
function renderBattleBolt(f){let u=1-f.life/f.max,sx=f.type==='chain'?f.x:f.x-28,sy=f.type==='chain'?f.y:f.y-245,ex=f.type==='chain'?f.x2:f.x,ey=f.type==='chain'?f.y2:f.y,dx=ex-sx,dy=ey-sy,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,pts=[],w=f.type==='chain'?6:12;ctx.save();ctx.globalAlpha=Math.min(1,(1-u)*2);for(let i=0;i<=7;i++){let t=i/7,j=i===0||i===7?0:Math.sin(f.seed+i*18)*18;pts.push([sx+dx*t+nx*j,sy+dy*t+ny*j]);}let left=pts.map(([x,y],i)=>[x+nx*w*(1-i*.07),y+ny*w*(1-i*.07)]),right=pts.map(([x,y],i)=>[x-nx*w*(1-i*.07),y-ny*w*(1-i*.07)]).reverse();paperPolygon([...left,...right],'#c0a2db','#806493',1.5);Art.line(ctx,pts,'#fff0b9',3);if(f.type==='bolt'){paperBurst(ex,ey,32+u*36,'#e6bd7e',u*.3);for(let j=-1;j<=1;j++)Art.ellipse(ctx,sx+j*16,sy+(j?3:-4),19,13,'#d1bfdc','#9a82ac',1);}else crystal(ex,ey,12,u,'#ead9a7');ctx.restore();}
function renderBattleFX(f){if(f.type==='pencilmuzzle'){renderPigmentMuzzle(f);return true;}let u=1-f.life/f.max;if(f.type==='enemyBurst'){ctx.save();ctx.globalAlpha=1-u;paperPetals(f.x,f.y,f.r*(.5+u*.5),8,'#e66a71',u*.2,.3);Art.ellipse(ctx,f.x,f.y,f.r,f.r,null,'#bc304b',3);ctx.restore();return true;}if(f.type==='bolt'||f.type==='chain'){renderBattleBolt(f);return true;}if(f.type==='lob'){let x=f.x+(f.x2-f.x)*u,y=f.y+(f.y2-f.y)*u-Math.sin(u*Math.PI)*150;fieldWash(f.x2,f.y2,f.r,'#baa1ce',.08);paperBand(x-25,y+8,-.25,30,7,'#b8a1cb',u*8);battleCutout('ink',x,y,.68,u*TAU);return true;}if(f.type==='soundwave'){ctx.save();ctx.globalAlpha=1-u;let r=f.r*(.15+.85*u);paperPetals(f.x,f.y,r,12,'#e4cc91',u*.2,.8);Art.ellipse(ctx,f.x,f.y,r,r,null,'#c7a4c8',5);battleCutout('bell',f.x,f.y-26,.7,Math.sin(u*22)*.22);for(let i=0;i<6;i++){let a=i*TAU/6;battleCutout('music',f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,.3,a*.1);}ctx.restore();return true;}return false;}
function renderBattleFields(){renderItemFX();for(let f of game.fields){if(!visible(f.x,f.y,f.r+50))continue;f.visualBorn??=game.t;roseVines(f.x,f.y,f.r,game.t-f.visualBorn,Math.min(1,f.life*1.5));}}
function renderWeaponSwing(o){let g=attackGeometry(o);if(o.mode==='cone'){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.a);let u=g.u,ready=o.age>=o.delay;ctx.globalAlpha*=ready?Math.max(0,1-u):.2;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,o.r,-o.width,o.width);ctx.closePath();ctx.fillStyle=ready?'#f4dfb3':'#c3b5d4';ctx.fill();ctx.strokeStyle='#ae8eb4';ctx.lineWidth=2;ctx.stroke();for(let i=-1;i<=1;i++)crystal(Math.cos(i*.45)*o.r,Math.sin(i*.45)*o.r,9,0,'#e6cb96');ctx.restore();battleCutout('camera',o.x,o.y,.7,o.a);return;}
 if(o.mode==='whip'){let pts=[];for(let i=0;i<=12;i++){let v=i/12,a=g.head-.4*(1-v);pts.push([o.x+Math.cos(a)*o.r*v,o.y+Math.sin(a)*o.r*v]);}ctx.save();Art.line(ctx,pts,'#6e805e',8);Art.line(ctx,pts,'#c9d4a2',3);for(let i=3;i<pts.length;i+=3)battleCutout('leaf',...pts[i],.3,g.head+i);paperPetals(...pts.at(-1),22,4,'#d5a3ba',g.head);ctx.restore();}
 else {renderAlignedSwing(o);let ca=Math.cos(g.head),sa=Math.sin(g.head);ctx.save();ctx.translate(o.x,o.y);ctx.rotate(g.head);paperPolygon([[10,-4],[o.r-17,-8],[o.r,0],[o.r-17,7],[10,4]],'#e1dce8');paperPolygon([[20,0],[o.r,0],[o.r-17,7]],'#b0a9c6',null);paperPolygon([[18,-15],[26,-15],[26,15],[18,15]],'#e5c78c');ctx.restore();}
}
function renderWeaponLine(o){let ready=o.age>=o.delay,g=attackGeometry(o);if(!ready){fieldWash(o.x,o.y,16+o.age*30,o.color,.3);crystal(o.x,o.y,14+o.age*10,o.a,o.color);return;}
 if(o.mode==='thrust'){if(o.kind==='paladin'){let s=Art.sprites.battle_paladin_sword,length=Math.hypot(g.x2-g.x,g.y2-g.y);if(s){ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.a);ctx.drawImage(s.img,-length*26/(s.w-26), -31,length*s.w/(s.w-26),63);ctx.restore();}paperBand(g.x,g.y,g.a,Math.hypot(g.x2-g.x,g.y2-g.y),12,'#c9b0d8',o.age*8);}else renderAlignedLine(o,true);return;}
 let col=o.kind==='rainbowLaser'?PALETTE[o.id%5]:o.kind==='prism'?['#a7c9df','#c2a4d7','#e6c18d'][o.id%3]:o.color;
 paperBand(g.x,g.y,g.a,Math.hypot(g.x2-g.x,g.y2-g.y),g.width,col,o.age*9);crystal(g.x2,g.y2,g.width+8,g.a+Math.PI/2,col);
 if(o.kind==='ruler'){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(g.a);for(let x=20;x<o.r;x+=20)Art.line(ctx,[[x,-g.width],[x,-g.width+(x%40?5:9)]],'#846e8f',1);ctx.restore();battleCutout('ruler',o.x,o.y,.5,g.a);}
 else if(o.kind!=='comet')battleCutout(o.kind==='rainbowLaser'?'prism':o.kind,o.x,o.y,.65,0);
}
function renderFalling(o){let ready=o.age>=o.delay,u=clamp(o.age/Math.max(.01,o.delay),0,1),drop=(1-u)**2;fieldWash(o.x,o.y,o.r,o.color,ready?.13:.08);if(o.kind==='meteor'||o.kind==='comet'){if(!ready){let x=o.x-90*drop,y=o.y-270*drop;paperBand(x-50,y-100,Math.PI/2-.4,125,22,'#e9bc80',o.age*5);battleCutout('battle_meteor',x,y,.55,.8);}else{ctx.save();ctx.globalAlpha*=Math.min(1,o.life*3);paperBurst(o.x,o.y,o.r*.75,o.color,o.a);ctx.restore();}}
 else if(o.kind==='firecracker'||o.kind==='festival'){if(!ready){battleCutout('firecracker',o.x,o.y-20*(1-u),.55,Math.sin(o.age*12)*.1);impactStar(o.x+6,o.y-32,6+u*6,o.age*8,'#e9bf83');}else{ctx.save();ctx.globalAlpha*=Math.min(1,o.life*3);paperBurst(o.x,o.y,o.r*(.65+.35*Math.sin(o.age*9)),PALETTE[o.id%5],o.a);ctx.restore();}}
 else if(o.kind==='printingPress'){if(!ready)paperPolygon([[o.x-32,o.y-95*drop],[o.x+32,o.y-95*drop],[o.x+32,o.y+14-95*drop],[o.x-32,o.y+14-95*drop]],'#c7a7c8');else{ctx.save();ctx.globalAlpha*=.65;paperPolygon([[o.x-o.r*.7,o.y-o.r*.6],[o.x+o.r*.7,o.y-o.r*.6],[o.x+o.r*.7,o.y+o.r*.6],[o.x-o.r*.7,o.y+o.r*.6]],'#bfa5cf');battleCutout('book',o.x,o.y,.8);ctx.restore();}}
 else {battleCutout('stamp',o.x,o.y-160*drop,.9,0);if(ready){ctx.save();ctx.globalAlpha*=.4;paperPolygon([[o.x-48,o.y-36],[o.x+48,o.y-36],[o.x+48,o.y+36],[o.x-48,o.y+36]],'#ad89b9');impactStar(o.x,o.y,28,0,'#e7c495');ctx.restore();}}
}
function renderMovingConstruct(o){let dx=o.x-(o.px??o.x),dy=o.y-(o.py??o.y),a=Math.hypot(dx,dy)>.01?Math.atan2(dy,dx):o.a;
 if(o.mode==='yoyo'){ctx.save();ctx.strokeStyle='#987a9d';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(game.hero.x,game.hero.y-24);ctx.quadraticCurveTo((game.hero.x+o.x)/2,(game.hero.y+o.y)/2+Math.sin(o.age*8)*12,o.x,o.y);ctx.stroke();ctx.restore();}
 if(o.mode==='rocket'){paperBand(o.x-Math.cos(a)*65,o.y-Math.sin(a)*65,a,65,12,'#e9b475',o.age*26);paperBand(o.x-Math.cos(a)*36,o.y-Math.sin(a)*36,a,36,6,'#fff1c4',o.age*20);}
 else if(o.mode==='notes'){paperBand(o.x-Math.cos(a)*35,o.y-Math.sin(a)*35,a,35,5,o.color,o.age*12);for(let i=1;i<3;i++)battleCutout('music',o.x-Math.cos(a)*i*18,o.y-Math.sin(a)*i*18,.15+i*.04,Math.sin(o.age*8+i)*.2);}
 else if(o.mode==='bounce'){fieldWash(o.x,o.y,o.r+4,o.color,.25);crystal(o.x-10,o.y+10,4,o.age,'#d6b1d2');}
 else if(o.mode==='leaf'){paperBand(o.x-Math.cos(a)*40,o.y-Math.sin(a)*40,a,40,7,'#b2c290',o.age*9);}
 else if(o.mode==='gear'){paperPetals(o.x,o.y,32,9,'#dac598',o.age*9,.65);}
 renderMovingWeapon(o);
}
function renderThread(o){let pts=o.points;for(let i=1;i<pts.length;i++){let p=pts[i-1],q=pts[i],a=Math.atan2(q.y-p.y,q.x-p.x),len=distance(p,q);paperBand(p.x,p.y,a,len,o.collapse?9:3,o.collapse?'#c6a3c5':'#d8bc8c',o.age*6);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);for(let x=8;x<len;x+=20)Art.line(ctx,[[x,-5],[x+6,5]],'#fff0c6',1.6);ctx.restore();crystal(q.x,q.y,o.collapse?14:9,a+Math.PI/2,o.color);}if(o.collapse)battleCutout('battle_loom',o.x,o.y-25,.55,Math.sin(o.age*10)*.012);}
function renderRain(o){fieldWash(o.x,o.y,o.r,'#a5c2d5',.12);if(o.kind==='umbrella')battleCutout('battle_umbrella',o.x,o.y-90,.48,Math.sin(o.age*3)*.06);for(let i=0;i<(reducedEffects?8:18);i++){let a=i*2.39996,rr=Math.sqrt((i+.5)/18)*o.r,x=o.x+Math.cos(a)*rr,y=o.y+Math.sin(a)*rr;let t=(o.age*1.4+i*.27)%1,yy=y-75*(1-t);paperPolygon([[x,yy-9],[x+4,yy],[x,yy+4],[x-4,yy]],i%3?'#a8c7dc':'#d0b9de',null);if(t>.7)Art.ellipse(ctx,x,y,8*(t-.7)/.3,4,null,'#bbd1df',1.4);}}
function renderGarden(o){let age=o.age,r=o.mode==='mural'?o.r*clamp(age/o.max,0,1):o.r;roseVines(o.x,o.y,r,age,Math.min(1,o.life),o.mode==='mural');if(o.mode==='garden'){battleCutout('garden',o.x,o.y-25,.8,Math.sin(age)*.025);for(let i=0;i<5;i++){let a=i*TAU/5+age*.35;battleCutout('rose',o.x+Math.cos(a)*r*.7,o.y+Math.sin(a)*r*.7,.65,Math.sin(age*2+i)*.1);}}}
function renderBarrier(o){let leaf=o.kind==='autumnGuardian',n=leaf?10:o.mode==='mirrorArena'?8:6;fieldWash(o.x,o.y,o.r,leaf?'#c9bc94':'#bdb9d8',.09);for(let i=0;i<n;i++){let a=i*TAU/n+(leaf?o.age*.6:0),x=o.x+Math.cos(a)*o.r,y=o.y+Math.sin(a)*o.r;if(leaf)battleCutout('leaf',x,y,.75,a+Math.PI/2);else{ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);paperPolygon([[-24,-14],[-19,-40],[17,-40],[25,-14],[18,23],[-18,23]],i%2?'#b8c5dd':'#d2c1df');paperPolygon([[-15,-33],[10,-33],[-10,15]],'#fff2d688',null);ctx.restore();}}if(leaf)battleCutout('shield',o.x,o.y-25,.85,Math.sin(o.age*2)*.06);}
function renderPortal(o){for(let [x,y,side]of [[o.x,o.y,1],[o.outX,o.outY,-1]]){fieldWash(x,y,o.r,'#a596bf',.2);ctx.save();ctx.translate(x,y);ctx.rotate(o.age*.35*side);for(let j=0;j<3;j++){let r=o.r*(1-j*.18);paperPolygon([[-r,-r*.65],[r*.7,-r],[r,r*.7],[-r*.75,r]],j%2?'#e0d1df':'#b4a4cb','#88779f',2);}ctx.restore();fieldWash(x,y,o.r*.64,'#716180',.8);battleCutout('battle_gate',x,y-o.r*.2,o.cosmos?.66:.38,0,.95);for(let j=0;j<4;j++){let a=j*TAU/4+o.age*2;battleCutout('star',x+Math.cos(a)*o.r*.7,y+Math.sin(a)*o.r*.7,.2,a);}}}
function renderPull(o){fieldWash(o.x,o.y,o.r,o.color,.1);if(o.giant)battleCutout('battle_colossus',o.x,o.y-65,.9,Math.sin(o.age*6)*.02);let closure=1-clamp(o.age/o.max,0,1);for(let side of [-1,1]){let x=o.x+side*(30+o.r*.55*closure),y=o.y;ctx.save();ctx.translate(x,y);ctx.scale(side,1);paperPolygon([[-20,-27],[13,-30],[27,-15],[10,-9],[7,-18],[-4,-12],[-4,13],[8,20],[12,8],[29,16],[15,33],[-18,28]],o.giant?'#c5b4cc':'#c7a6c1');ctx.restore();}for(let i=0;i<9;i++){let a=i*2.4+o.age,r=o.r*(1-((o.age*.7+i*.13)%1));crystal(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r,4,a,o.color);}}
function renderVoid(o){ctx.save();let r=o.r*(.55+.12*Math.sin(o.age*2));fieldWash(o.x,o.y,o.r,'#9a8bad',.1);paperPetals(o.x,o.y,r,11,'#b6a3c5',o.age*.3,.45);Art.ellipse(ctx,o.x,o.y,r*.6,r*.6,'#6e5b7b','#d6bbda',4);for(let i=0;i<12;i++){let t=(o.age*.6+i*.13)%1,a=i*2.4+o.age*2,rr=o.r*(1-t);crystal(o.x+Math.cos(a)*rr,o.y+Math.sin(a)*rr,3+t*3,a,PALETTE[i%5]);}ctx.restore();}
function renderBattleConstruct(o){
 const u=clamp(o.age/o.max,0,1),a=o.a,ca=Math.cos(a),sa=Math.sin(a),p=game.hero;ctx.save();ctx.globalAlpha=Math.min(1,o.age*9,o.life*4);if(!visible(o.x,o.y,650)){ctx.restore();return;}
 switch(o.mode){
 case 'slash':case 'whip':case 'cone':renderWeaponSwing(o);break;
 case 'thrust':case 'beam':renderWeaponLine(o);break;
 case 'stamp':renderFalling(o);break;
 case 'bounce':case 'yoyo':case 'rocket':case 'notes':case 'leaf':case 'gear':renderMovingConstruct(o);break;
 case 'pinballTable':renderPinballTable(o);break;
 case 'mine':renderMine(o);break;
 case 'thread':renderThread(o);break;
 case 'paint':{let rr=o.r*Math.min(1,o.age*2);paintTrail(o.x,o.y,a,rr,o.width,o.color,o.age);battleCutout('roller',o.x+ca*rr,o.y+sa*rr,.7,a+Math.PI/2);break;}
 case 'wall':for(let i=-4;i<=4;i++){let x=o.x-sa*o.r*i/4,y=o.y+ca*o.r*i/4;crystal(x,y,24,a,'#e7d5d3');battleCutout('chalk',x,y-10,.42,a);}break;
 case 'turret':{battleCutout('turret',o.x,o.y,.8,0);ctx.save();ctx.translate(o.x,o.y-25);ctx.rotate(o.a);paperPolygon([[0,-7],[38,-7],[38,7],[0,7]],'#c4b5cf');paperPolygon([[27,-10],[39,-10],[39,10],[27,10]],'#e3c992');if(o.fireCd>.5)paperBurst(43,0,17,'#efd28c',o.age);ctx.restore();break;}
 case 'castle':battleCutout('battle_castle',o.x,o.y-65,.72,Math.sin(o.age*5)*.02);for(let i=-1;i<=1;i++)battleCutout('gear',o.x+i*33,o.y+15,.35,o.age*3);break;
 case 'friend':{let heading=o.targetEnemy?Math.atan2(o.targetEnemy.y-o.y,o.targetEnemy.x-o.x):o.a;Art.image(ctx,'fox'+(Math.floor(o.age*12)%8),o.x,o.y,.75,Math.cos(heading)<0?-1:1,Math.sin(o.age*12)*.08);for(let i=1;i<3;i++)crystal(o.x-Math.cos(heading)*i*20,o.y-Math.sin(heading)*i*20,4,heading,'#e6c098');break;}
 case 'mark':{ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.age*.5);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);paperPolygon([[o.r,0],[o.r+12,-7],[o.r+7,0],[o.r+12,7]],'#e2c58c');}ctx.restore();battleCutout('compass',o.x,o.y-o.r-25,.55,Math.sin(o.age*3)*.1);break;}
 case 'rain':renderRain(o);break;
 case 'kite':{paperBand(p.x,p.y-24,Math.atan2(o.y-(p.y-24),o.x-p.x),Math.hypot(o.x-p.x,o.y-(p.y-24)),2,'#c8a0b9',o.age*2);for(let j=1;j<4;j++)battleCutout('ribbon',p.x+(o.x-p.x)*j/4,p.y-24+(o.y-(p.y-24))*j/4,.25,0);battleCutout('kite',o.x,o.y,.9,Math.sin(o.age*3)*.1);break;}
 case 'shield':case 'mirrorArena':renderBarrier(o);break;
 case 'portal':renderPortal(o);break;
 case 'pull':renderPull(o);break;
 case 'void':renderVoid(o);break;
 case 'garden':case 'mural':renderGarden(o);break;
 case 'cyclone':renderBattleWind({x:o.x,y:o.y,r:o.r,life:o.life,max:o.max},true);break;
 case 'nova':{let rr=Math.max(1,o.r*Math.abs(Math.sin(u*Math.PI*2)));fieldWash(o.x,o.y,rr,'#dcb3d0',.15);paperPetals(o.x,o.y,rr,12,'#d5b1ce',o.age*.15,.72);paperPetals(o.x,o.y,rr*.85,9,'#ecc58e',-o.age*.1,.78);battleCutout('battle_sun',o.x,o.y,.25+.3*(1-rr/o.r),o.age*.1);for(let i=0;i<8;i++){let aa=i*TAU/8;crystal(o.x+Math.cos(aa)*rr,o.y+Math.sin(aa)*rr,12,aa+o.age,PALETTE[i%5]);}break;}
 case 'festival':{let ready=o.age>=o.delay;if(!ready){for(let i=-1;i<=1;i++)battleCutout('rocket',o.x+i*28,o.y-(o.age/o.delay)*120,.65, i*.1);}else{paperBurst(o.x,o.y-90,70+Math.sin(o.age*5)*12,'#dfb0c4',o.age*.15);battleCutout('festival',o.x,o.y-90,.8,0);}break;}
 case 'spotlight':{let r=o.r*(1-u*.6);fieldWash(o.x,o.y,r,'#e8d392',.35);ctx.save();ctx.globalAlpha*=.25;paperPolygon([[o.x-20,o.y-180],[o.x+20,o.y-180],[o.x+r,o.y],[o.x-r,o.y]],'#e8d39b',null);ctx.restore();battleCutout('battle_stage',o.x,o.y-105,.58,0);for(let i=0;i<4;i++){let aa=i*TAU/4+o.age*.3;battleCutout('star',o.x+Math.cos(aa)*r,o.y+Math.sin(aa)*r,.3,aa);}break;}
 case 'planet':{let aa=o.age*1.9+o.phase;fieldWash(o.x,o.y,o.r,'#e4c58e',.17);battleCutout(o.phase===0?'battle_sun':'planet',o.x,o.y,o.phase===0?.45:1.05,o.age*.3);for(let j=0;j<3;j++){let a=aa+j*TAU/3;crystal(o.x+Math.cos(a)*55,o.y+Math.sin(a)*55,8,a,PALETTE[j]);}break;}
 case 'whale':{paperBand(o.x-ca*150,o.y-sa*150,a,150,30,'#b7cbdc',o.age*3);battleCutout('battle_whale',o.x,o.y,.78,a+Math.sin(o.age*3)*.035);break;}
 case 'dragonSpirit':{for(let i=6;i>=1;i--){let x=o.x-ca*i*25-sa*Math.sin(o.age*5+i)*13,y=o.y-sa*i*25+ca*Math.sin(o.age*5+i)*13;paperPetals(x,y,24-i*1.6,4,'#d2b1ca',a+i*.1,.05);}battleCutout('battle_dragon',o.x,o.y,.68,a);break;}
 case 'bumper':{fieldWash(o.x,o.y,o.r+5,'#ddc795',.25);battleCutout('pinball',o.x,o.y,.8,Math.sin(o.age*7)*.04);crystal(o.x,o.y-20,12,o.age*.5,'#d6b1d2');break;}
 case 'stormNode':{fieldWash(o.x,o.y,o.r,'#b1c7de',.1);crystal(o.x,o.y-15,35,Math.sin(o.age)*.15,['#adcbdc','#ceb7dd','#d9ca9b'][o.phase%3]);for(let j=0;j<3;j++){let a=o.age*2+j*TAU/3;battleCutout('bubble',o.x+Math.cos(a)*35,o.y-15+Math.sin(a)*35,.25,a);}break;}
 case 'avatar':if(o.kind==='paladin')battleCutout('battle_paladin',o.x,o.y-60,.8,Math.sin(o.age*6)*.025);else if(o.kind==='printingPress')battleCutout('battle_press',o.x,o.y-95,.8,Math.sin(o.age*13)*.015);else if(o.kind==='rainbowLaser')battleCutout('prism',o.x,o.y-10,1.1,o.age*.2);break;
 default:throw new Error('Missing battle presentation: '+o.kind+'/'+o.mode);
 }ctx.restore();
}

function renderMaterialImpact(f,r,u){
 const cause=f.cause;if(!cause||cause==='confetti')return false;
 const a=f.angle||0;
 if(cause==='freeze'){for(let i=0;i<5;i++){let aa=a+i*TAU/5;crystal(f.x+Math.cos(aa)*r*u,f.y+Math.sin(aa)*r*u,r*(.4-i*.04),aa,'#b5d2e1');}impactStar(f.x,f.y,r*.3,a,'#fff2d8',5);}
 else if(cause==='petals'){paperPetals(f.x,f.y,r,6,'#dca8bf',a+u,.1);paperPetals(f.x,f.y,r*.55,5,'#f0d1cb',a-u,.1);}
 else if(cause==='soak'){for(let i=0;i<6;i++){let aa=a+i*TAU/6,rr=r*(.35+u);Art.ellipse(ctx,f.x+Math.cos(aa)*rr,f.y+Math.sin(aa)*rr,r*.24,r*.2,'#a5bcd5','#88719e',1);}Art.ellipse(ctx,f.x,f.y,r*.45,r*.35,'#b4b1d3',null);}
 else if(cause==='erase'){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(a);for(let i=0;i<5;i++){let x=(i-2)*r*.4,y=Math.sin(i*5)*r*.4+u*r*.4;paperPolygon([[x-6,y-4],[x+6,y-3],[x+5,y+5],[x-4,y+6]],i%2?'#e7cfdf':'#fff0d4','#b89aba',.8);}ctx.restore();impactStar(f.x,f.y,r*.5,a,'#fff0cb',4);}
 else if(cause==='crumple'){for(let i=0;i<5;i++){let aa=a+i*TAU/5,x=f.x+Math.cos(aa)*r*u,y=f.y+Math.sin(aa)*r*u;paperPolygon([[x-7,y-4],[x+2,y-10],[x+9,y+1],[x+3,y+7],[x-7,y+5]],f.color);Art.line(ctx,[[x-7,y-4],[x,y],[x+3,y+7]],'#fff0d4',1);}impactStar(f.x,f.y,r*.45,a,'#efd19e',6);}
 else if(cause==='burn'){paperPetals(f.x,f.y,r,5,'#e6a475',a,.2);impactStar(f.x,f.y,r*.65,a+.3,'#f2cb8d',6);impactStar(f.x,f.y,r*.3,a,'#fff0c4',5);}
 else return false;
 return true;
}

function renderPinballTable(o){
 ctx.save();ctx.translate(o.x,o.y);let unfold=Math.min(1,o.age*4);ctx.scale(unfold,unfold);
 ctx.globalAlpha*=.7;paperPolygon([[-166,-126],[166,-126],[178,129],[-178,129]],'#bea8c9','#85678d',3);paperPolygon([[-150,-111],[150,-111],[160,113],[-160,113]],'#f1e5cd','#a786aa',2);ctx.globalAlpha/= .7;
 ctx.save();ctx.globalAlpha*=.2;impactStar(0,0,82,0,'#c9a4c2',5);ctx.restore();
 for(const b of o.bumpers){let r=18+(b.flash||0)*22;Art.ellipse(ctx,b.x,b.y+5,r+4,r+2,'#866a8e',null);Art.ellipse(ctx,b.x,b.y,r,r,b.flash?'#fff2b9':'#d4adca','#8c698d',2);impactStar(b.x,b.y,9,0,'#fff1c8',5);}
 for(const side of [-1,1]){ctx.save();ctx.translate(side*73,86);ctx.rotate(side*(-.25+Math.sin(o.age*9)*.13));paperPolygon([[-31,-7],[26,-7],[32,0],[25,8],[-31,7]],'#dda0b0','#835c7e',2);ctx.restore();}
 if(o.wallFlash){ctx.globalAlpha*=o.wallFlash/.14;ctx.strokeStyle='#fff1af';ctx.lineWidth=5;ctx.strokeRect(-155,-116,310,232);}ctx.restore();
 const trail=o.ballTrail;for(let i=0;i<trail.length;i++){ctx.save();ctx.globalAlpha*=i/trail.length*.45;Art.ellipse(ctx,trail[i].x,trail[i].y,4+i,4+i,'#e7bd75',null);ctx.restore();}
 Art.ellipse(ctx,o.ballX+2,o.ballY+5,19,13,'#5f4b7533',null);Art.ellipse(ctx,o.ballX,o.ballY,17,17,'#a8c9dc','#695b81',2);Art.ellipse(ctx,o.ballX-4,o.ballY-5,7,6,'#fff6dd',null);Art.ellipse(ctx,o.ballX+6,o.ballY+6,4,3,'#828eb9',null);
}
