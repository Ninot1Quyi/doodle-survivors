'use strict';
// Original, procedurally drawn artwork. Every silhouette, pencil mark and texture is Canvas.
const Art=(()=>{
const TAU=Math.PI*2,ink='#3c3347',paper='#fff8e7',sprites={},frames={};let seed=47;
function rng(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;}
function canvas(w,h){let c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function path(g,d,fill,stroke=ink,lw=1.05){let p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p);}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke(p);}return p;}
function line(g,pts,color=ink,lw=.8){g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.lineWidth=lw;g.strokeStyle=color;g.lineCap='round';g.lineJoin='round';g.stroke();}
function ellipse(g,x,y,rx,ry,fill,stroke=ink,lw=.9){g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}}
const waxEdition=typeof EDITION!=='undefined'&&EDITION==='paper';
function texture(g,p,bounds,color='#5a4565',count=100){g.save();g.clip(p);g.strokeStyle=color;g.globalAlpha=.20;g.lineWidth=.45;for(let i=0;i<count;i++){let x=bounds[0]+rng()*bounds[2],y=bounds[1]+rng()*bounds[3],len=2+rng()*9;g.beginPath();g.moveTo(x,y);g.lineTo(x+len*.65,y-len);g.stroke();}
 g.globalAlpha=.08;for(let i=0;i<count/4;i++){let x=bounds[0]+rng()*bounds[2],y=bounds[1]+rng()*bounds[3];ellipse(g,x,y,4+rng()*13,3+rng()*8,color,null);}
 // Wax sticks skip over toothy paper. These directional patches are baked into sprites once.
 if(waxEdition){let strokes=Math.min(100,Math.max(5,count*.22));for(let i=0;i<strokes;i++){let x=bounds[0]+rng()*bounds[2],y=bounds[1]+rng()*bounds[3],length=4+rng()*Math.min(17,bounds[2]*.6),slope=.35+rng()*.5;g.globalAlpha=.13+rng()*.12;g.strokeStyle=i%4===0?'#fff3d4':color;g.lineWidth=1.2+rng()*2.1;g.beginPath();g.moveTo(x,y);g.lineTo(x+length*.4,y-length*slope*.4);g.moveTo(x+length*.48,y-length*slope*.48);g.lineTo(x+length,y-length*slope);g.stroke();g.globalAlpha=.23;g.strokeStyle='#fff7e6';g.lineWidth=.45;for(let j=0;j<2;j++){let off=(j-.5)*1.3;g.beginPath();g.moveTo(x,y+off);g.lineTo(x+length*.65,y-length*slope*.65+off);g.stroke();}}
 }
 g.restore();}
function pencil(g,d,fill,bounds,count=80,shade='#594967'){let p=path(g,d,fill,ink,waxEdition?1.35:1.1);texture(g,p,bounds,shade,count);g.save();g.translate(waxEdition?1:.7,waxEdition?-.65:-.4);g.globalAlpha=waxEdition?.38:.26;path(g,d,null,ink,waxEdition?.75:.55);if(waxEdition){g.translate(-1.55,1.1);g.globalAlpha=.20;g.setLineDash([3.5,2.5,1,3]);path(g,d,null,shade,1.25);}g.restore();return p;}
function make(name,w,h,draw,border=1.5){seed=hash(name);let c=canvas(w*2,h*2),g=c.getContext('2d');g.scale(2,2);g.lineCap='round';g.lineJoin='round';draw(g);let mask=canvas(w*2,h*2),m=mask.getContext('2d');m.drawImage(c,0,0);m.globalCompositeOperation='source-in';m.fillStyle=paper;m.fillRect(0,0,mask.width,mask.height);let out=canvas(w*2,h*2),o=out.getContext('2d');for(let a=0;a<TAU;a+=Math.PI/4)o.drawImage(mask,Math.cos(a)*border*2,Math.sin(a)*border*2);o.drawImage(c,0,0);sprites[name]={img:out,w,h};return sprites[name];}
function hash(str){let h=2166136261;for(let c of str)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function hero(g,f){let t=f/8*TAU,s=Math.sin(t),c=Math.cos(t),step=s*4;
 // A tiny star traveller: tousled golden hair, blue tailcoat and a fluttering golden scarf.
 pencil(g,`M33 38 Q21 ${34+s*4} 5 ${25+c*6} L8 ${37+c*4} Q17 ${46+s*3} 34 46Z`,'#e9bf61',[4,24,34,23],50,'#a77a47');
 line(g,[[8,31+c*5],[18,39+s*3],[30,41]],'#fff0b6',1.4);
 pencil(g,`M29 66 L26 ${81+step} 21 ${84+step} 22 ${88+step} 34 ${87+step} 38 67Z`,'#cdb79d',[20,65,19,29],30);
 pencil(g,`M43 66 L42 ${81-step} 51 ${85-step} 54 ${88-step} 41 ${88-step} 36 68Z`,'#b9a38f',[36,65,20,29],30);
 pencil(g,`M27 39 Q37 34 48 40 L48 52 ${55+c*2} 76 43 72 38 66 32 73 ${20-c*2} 76 25 53Z`,'#80a6c9',[19,35,38,43],120,'#4e6688');
 path(g,'M32 42 L39 47 44 41 44 61 34 62Z','#f5e5bc');path(g,'M26 41 L33 37 36 48 30 52Z','#acc7dc');path(g,'M45 38 L49 42 47 52 39 47Z','#aac8dc');
 line(g,[[36,48],[36,67],[31,72]],'#4f6484',1);line(g,[[43,61],[47,70]],'#4f6484');
 for(let y of [53,59])ellipse(g,40,y,1.4,1.4,'#dfb85e',null);line(g,[[24,70],[30,68]],'#d4dce0',1);
 pencil(g,`M26 43 Q18 45 ${15-s} ${55+s} L21 ${59+s} 30 48Z`,'#8aafcf',[14,43,17,19],25);ellipse(g,18-s,58+s,3.8,4,'#f4d9b8');
 pencil(g,`M47 43 Q54 45 ${56+s} ${55-s} L51 ${59-s} 43 49Z`,'#8aafcf',[43,43,17,19],25);ellipse(g,54+s,58-s,3.8,4,'#f4d9b8');
 ellipse(g,25,29,3.5,5,'#f1cdaa');ellipse(g,52,28,3,5,'#f1cdaa');
 pencil(g,'M25 20 Q27 10 39 10 Q53 11 53 27 Q53 40 41 43 Q28 43 25 31Z','#f6dfbd',[24,10,31,34],32,'#bfa185');
 // The hair is the silhouette, not a hat; preserve little irregular pencil locks.
 pencil(g,'M24 29 L19 22 25 21 20 14 28 16 27 8 34 11 38 3 43 9 52 6 51 13 58 13 54 20 57 24 51 30 48 21 44 24 39 17 35 23 31 21 28 32Z','#edc567',[19,3,40,30],90,'#b38b45');
 line(g,[[29,17],[34,14],[39,10]],'#fff0a2',1.3);line(g,[[43,13],[49,16],[50,22]],'#ffe8a1',1.3);
 ellipse(g,33,30,1.45,2,'#3c3745',null);ellipse(g,45,30,1.45,2,'#3c3745',null);ellipse(g,30,35,2.5,1.2,'#e9b29e',null);ellipse(g,48,35,2.5,1.2,'#e9b29e',null);line(g,[[36,37],[40,38],[43,36]],'#a47c68',.8);
 pencil(g,'M27 40 Q39 44 49 39 L50 45 Q39 49 28 45Z','#f0c75e',[26,39,25,11],25,'#ae8247');
 path(g,'M45 44 L48 51 43 52 41 46Z','#e3b85b');
 // Small sketchbook carried at the hip, with a star clasp.
 pencil(g,'M18 58 L29 60 28 71 17 69Z','#d7b1a6',[17,58,13,14],18);line(g,[[20,61],[26,62],[25,68]],'#f7e6c7');
}
for(let f=0;f<8;f++)make('hero'+f,76,96,g=>hero(g,f),1.6);sprites.hero=sprites.hero0;
for(let f=0;f<8;f++){
 let s=Math.sin(f/8*TAU),c=Math.cos(f/8*TAU);
 make('imp'+f,62,67,g=>{
 pencil(g,`M20 48 L${14+s*2} 60 27 61 30 49Z`,'#b29bc0',[12,47,20,16],24);pencil(g,`M36 49 L${37-s*2} 61 50 60 46 48Z`,'#b29bc0',[34,47,20,17],24);
 g.save();g.translate(0,-Math.abs(s)*2);
 pencil(g,'M12 27 Q6 18 17 16 Q19 7 29 12 Q39 5 44 15 Q56 12 54 25 Q63 33 54 42 Q57 53 44 53 Q35 61 28 54 Q15 59 12 49 Q3 44 10 35Z','#c7b6da',[6,7,51,52],145,'#9a87b6');
 ellipse(g,23,31,8,10,'#fff3dc');ellipse(g,41,29,7,8,'#fff3dc');ellipse(g,24,33,2.8,4,'#726080',null);ellipse(g,41,30,2.5,3.5,'#726080',null);ellipse(g,23,31,1,1.3,'#fffaf0',null);ellipse(g,40,28,1,1,'#fffaf0',null);
 ellipse(g,16,42,3,1.8,'#d89fbd',null);ellipse(g,48,41,3,1.8,'#d89fbd',null);path(g,'M26 44 Q32 49 39 43',null,'#93749d',1.1);path(g,'M29 46 L33 46 32 49Z','#fff3dd');line(g,[[17,22],[21,19],[24,21]],'#eee0e8',1.3);g.restore();
 },2.2);
 make('beetle'+f,64,49,g=>{for(let i=0;i<3;i++){let y=22+i*7;line(g,[[23,y],[13,y-5+s*2],[7,y+5+s*3]],'#4b3a47',2);line(g,[[40,y],[51,y-5-s*2],[58,y+5-s*3]],'#4b3a47',2);}pencil(g,'M20 18 Q27 10 39 17 Q47 24 43 38 Q32 46 21 38 Q16 29 20 18Z','#b46e66',[16,12,30,32],100,'#593f4d');line(g,[[31,17],[31,40]],'#4d3546',1.4);ellipse(g,27,24,2,2,'#d9a081');ellipse(g,37,29,2,2,'#d9a081');pencil(g,'M23 17 Q20 10 26 6 L36 6 Q43 11 39 17Z','#655064',[21,5,21,14],30);line(g,[[27,8],[24,1],[20,3]],'#46364d',1);line(g,[[35,8],[40,1],[44,3]],'#46364d',1);ellipse(g,26,11,1.5,1.5,'#fff3c8',null);ellipse(g,36,11,1.5,1.5,'#fff3c8',null);},1.2);
 make('bat'+f,76,60,g=>{pencil(g,`M30 27 Q17 ${10+s*8} 4 ${16-s*9} L8 ${33-s*4} 17 ${30-s*2} 24 43 33 37Z`,'#aca3be',[3,3,33,42],60);pencil(g,`M44 27 Q59 ${10+s*8} 72 ${16-s*9} L68 ${33-s*4} 59 ${30-s*2} 52 43 42 37Z`,'#aba0b9',[42,3,33,42],60);pencil(g,'M29 20 L30 9 37 19 44 10 47 23 Q53 38 42 47 L32 46 Q23 38 29 20Z','#8a739a',[25,9,26,40],75);ellipse(g,33,28,2,2.5,'#ffedbe',null);ellipse(g,43,28,2,2.5,'#ffedbe',null);path(g,'M34 35 L37 41 39 36 41 40 44 34Z','#f7ead6');line(g,[[11,22-s*3],[26,32]],'#67516e',.8);line(g,[[65,22-s*3],[49,32]],'#67516e',.8);},1.4);
 make('ghost'+f,50,61,g=>{pencil(g,`M9 49 Q12 38 10 26 Q9 8 25 6 Q43 9 40 28 L44 ${52+s*3} 35 47 29 54 22 48 15 53Z`,'#e5dfdc',[9,6,35,48],160,'#8c88a2');path(g,'M16 23 Q20 18 23 24 L21 30 17 30Z','#6c627d');path(g,'M28 23 Q31 18 35 23 L34 29 29 30Z','#6c627d');path(g,'M23 35 Q29 31 31 38 L28 42 24 42Z','#a59ab0');line(g,[[14,19],[16,13],[22,10]],'#fff7df',1);},1.8);
 make('slime'+f,58,54,g=>{g.save();g.translate(29,48);g.scale(1+s*.07,1-s*.09);g.translate(-29,-48);pencil(g,'M6 39 Q7 18 18 12 Q26 6 35 12 Q49 17 51 37 Q54 45 42 46 L33 43 23 47 13 45Q5 46 6 39Z','#e4a16e',[5,8,49,39],100,'#ad655f');ellipse(g,18,22,4,5,'#ffe2ac',null);ellipse(g,21,32,1.6,2.4,'#5a3e4d',null);ellipse(g,35,32,1.6,2.4,'#5a3e4d',null);path(g,'M24 39 Q29 42 33 38',null,'#915957',1);g.restore();},1.4);
}
make('knight',80,92,g=>{pencil(g,'M22 64 L19 82 34 82 39 65Z','#686477',[18,61,24,24],45);pencil(g,'M44 63 L49 82 65 82 60 62Z','#686477',[42,61,26,24],45);pencil(g,'M22 35 Q41 23 59 35 L67 67 51 74 35 73 16 67Z','#8e88a4',[16,29,52,46],180);pencil(g,'M23 16 L30 7 53 9 61 20 57 40 24 40Z','#aaa4b9',[22,7,40,36],110);path(g,'M27 25 L56 24 55 33 28 34Z','#4c425d');line(g,[[33,27],[33,31],[39,27],[39,31],[46,27],[46,31]],'#e5be80',1.2);path(g,'M37 8 L43 2 49 7 47 14Z','#c5859e');pencil(g,'M3 39 L24 33 29 47 24 65 15 72 5 63Z','#b69ab6',[3,32,28,42],110);path(g,'M10 42 L20 40 23 49 18 60 11 56Z','#d4b777');path(g,'M65 54 L66 19 71 12 75 19 73 53Z','#d6d5e0');path(g,'M61 54 L77 53 77 57 61 58Z','#c0a575');});
make('boss',156,179,g=>{
 pencil(g,'M39 126 L30 161 52 166 67 137 84 137 98 168 124 161 113 124Z','#686078',[29,120,96,50],200);
 pencil(g,'M32 63 Q74 44 118 66 L134 127 117 139 105 130 84 143 68 135 50 143 39 130 22 135Z','#8e74a0',[21,45,114,102],400,'#503c64');
 pencil(g,'M31 65 L15 88 10 117 30 121 48 78Z','#9c84ad',[8,65,43,61],120);pencil(g,'M117 65 L143 84 149 118 128 120 105 77Z','#a08bb2',[103,65,48,58],120);
 pencil(g,'M40 30 Q43 14 76 13 Q112 16 115 40 L107 69 Q77 85 46 65Z','#c2aabf',[39,13,79,66],180);
 path(g,'M49 45 L67 41 68 53 52 56Z','#473549');path(g,'M82 41 L103 44 100 56 82 53Z','#473549');ellipse(g,60,48,3,3,'#f6dba0',null);ellipse(g,91,48,3,3,'#f6dba0',null);path(g,'M60 65 L67 59 74 65 82 60 89 66',null,'#664860',2);
 pencil(g,'M34 30 L27 7 50 19 60 2 76 18 94 2 104 20 126 7 116 34 77 40Z','#d4b876',[26,2,101,40],130,'#8c7055');path(g,'M48 27 Q78 33 109 27 L109 33 Q78 39 48 33Z','#e1ca92');ellipse(g,76,30,4,5,'#a487b5');
 pencil(g,'M63 88 L83 79 99 90 94 116 77 127 59 115Z','#d5bb81',[58,79,42,49],95,'#937752');path(g,'M72 91 L83 92 87 103 77 113 67 102Z','#aa81a3');line(g,[[44,82],[40,118],[48,128]],'#503b63',1.2);line(g,[[109,84],[117,120]],'#503b63',1.2);
});
// New paper creatures: deliberately different proportions and eight real pose drawings each.
function eyes(g,x,y,spread=10){ellipse(g,x-spread/2,y,1.8,2.4,ink,null);ellipse(g,x+spread/2,y,1.8,2.4,ink,null);line(g,[[x-2,y+6],[x,y+7],[x+3,y+5]],'#886474',.8);}
function starShape(g,x,y,r,fill='#efcd79'){let pts=[];for(let i=0;i<10;i++){let a=i*TAU/10-Math.PI/2,rr=i%2?r*.45:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}pencil(g,'M'+pts.map(p=>p.join(' ')).join(' L')+'Z',fill,[x-r,y-r,r*2,r*2],35,'#a68870');}
function roseFlower(g,x,y,r=16){for(let i=0;i<6;i++){let a=i*TAU/6;ellipse(g,x+Math.cos(a)*r*.42,y+Math.sin(a)*r*.4,r*.6,r*.53,i%2?'#d48ca3':'#e9b0bc',ink,.8);}path(g,`M${x-r*.4} ${y-r*.2}Q${x+r*.6} ${y-r*.6} ${x+r*.3} ${y+r*.3}Q${x-r*.3} ${y+r*.6} ${x-r*.2} ${y}L${x+r*.1} ${y+r*.1}`,null,'#995c7d',1.2);}
for(let f=0;f<8;f++){let s=Math.sin(f*TAU/8),c=Math.cos(f*TAU/8);
make('rabbit'+f,66,88,g=>{pencil(g,`M24 33 Q12 ${10-s*4} 21 6 Q31 4 31 31Z`,'#e8d2d8',[16,3,18,34],60);pencil(g,`M36 30 Q34 ${3+s*3} 45 8 Q52 13 44 34Z`,'#e8d2d8',[34,3,19,33],60);line(g,[[23,13],[26,28]],'#bf98b2',3);line(g,[[43,14],[40,28]],'#bf98b2',3);ellipse(g,33,56,20,22,'#e6d0db');pencil(g,`M17 67 L${10-s*3} 78 ${28-s*2} 78 30 67Z`,'#d0b4c9',[7,65,24,16],26);pencil(g,`M37 67 L${39+s*2} 79 ${56+s*2} 78 48 68Z`,'#d0b4c9',[36,65,23,17],26);pencil(g,'M15 37 Q30 23 47 35 L53 48 44 58 28 62 12 50Z','#f0dfe2',[12,25,42,38],95);eyes(g,33,44,15);path(g,'M18 33 L32 37 28 41Z','#b497b2');ellipse(g,24,49,3,1.4,'#d7a4b9',null);ellipse(g,44,49,3,1.4,'#d7a4b9',null);},2);
make('snail'+f,89,60,g=>{pencil(g,`M11 44 Q34 33 56 39 L63 31 75 32 79 ${47+s*2} 68 53 18 53 5 49Z`,'#c5c8ad',[5,30,76,26],100,'#758c7a');ellipse(g,36,29,24,23,'#dfb79f');let pts=[];for(let i=0;i<50;i++){let a=i*.22,r=19-i*.3;pts.push([36+Math.cos(a)*r,29+Math.sin(a)*r]);}line(g,pts,'#9a7584',1.3);line(g,[[65,34],[61-s*2,19]],ink,1.6);line(g,[[74,34],[79+s*2,20]],ink,1.6);ellipse(g,61-s*2,19,3.4,4,'#f3e7c9');ellipse(g,79+s*2,20,3.4,4,'#f3e7c9');ellipse(g,62-s*2,19,1.2,1.5,ink,null);ellipse(g,80+s*2,20,1.2,1.5,ink,null);line(g,[[68,42],[72,44],[75,42]],'#697c6c');},2);
make('mushroom'+f,73,78,g=>{pencil(g,`M23 43 Q20 56 24 ${67+s*2} L18 72 31 73 37 66 43 73 58 71 48 ${64-s*2} 48 42Z`,'#ead7ba',[18,40,42,34],80);pencil(g,`M6 ${40+s*2} Q11 11 34 8 Q61 8 67 ${40+s*2} Q39 54 6 ${40+s*2}Z`,'#c3838f',[5,7,64,46],140,'#83586f');for(let [x,y,r]of [[19,30,5],[34,19,6],[50,31,6]])ellipse(g,x,y,r,r*.8,'#fae8ce');eyes(g,36,56,15);},2);
make('jelly'+f,74,87,g=>{for(let i=0;i<5;i++){let x=17+i*10;path(g,`M${x} 47 Q${x+8*s} 60 ${x-4*c} 65 Q${x-7*s} 77 ${x+3*c} 79`,null,i%2?'#bd9bbf':'#a6a6ce',4);path(g,`M${x} 48 Q${x+8*s} 60 ${x-4*c} 65 Q${x-7*s} 77 ${x+3*c} 79`,null,'#efe2e3',1);}
pencil(g,`M6 43 Q8 ${9+s*2} 36 8 Q64 10 68 43 Q58 57 48 48 Q35 59 25 48 Q12 55 6 43Z`,'#c5b3d9',[5,6,65,51],140,'#8c7baf');ellipse(g,25,23,8,4,'#eee3e3',null);eyes(g,37,36,16);},2);
make('fox'+f,108,88,g=>{
 // A plump young fox with a broad wagging tail and a warm, readable face.
 g.save();g.translate(68,66);g.rotate(s*.12);g.translate(-68,-66);
 pencil(g,'M61 63 Q65 24 88 15 Q105 13 102 36 Q102 61 80 74 Q67 79 61 63Z','#df9459',[59,12,47,65],155,'#b46a4d');
 pencil(g,'M85 17 Q104 8 103 35 Q101 44 97 49 L93 40 87 43 86 34 79 35Z','#f7ead4',[77,12,29,40],45,'#cdb799');g.restore();
 pencil(g,`M36 56 Q62 43 77 58 Q83 75 65 79 L44 78 Q31 74 36 56Z`,'#e6a163',[31,44,50,36],125,'#bc7954');
 pencil(g,`M39 70 L${35+s*3} 79 Q${34+s*3} 84 ${46+s*3} 82 L51 72Z`,'#c58960',[32,69,23,16],24,'#a16f59');
 pencil(g,`M64 70 L${66-s*3} 79 Q${64-s*3} 84 ${77-s*3} 82 L78 71Z`,'#c58960',[62,69,20,16],24,'#a16f59');
 pencil(g,'M39 51 Q48 48 59 53 L60 69 53 73 47 69 43 72 36 64Z','#fbebd0',[35,48,27,27],40,'#c5a788');
 g.save();g.translate(0,Math.abs(s)*-2);
 pencil(g,'M18 33 Q9 19 15 9 Q26 9 31 23 L43 22 Q49 9 60 10 Q65 24 57 36Z','#e6a162',[12,8,52,31],85,'#b47151');
 path(g,'M18 15 Q25 16 28 26 L18 28Z','#eac1b1');path(g,'M52 17 L57 16 56 29 47 27Z','#eac1b1');
 pencil(g,'M14 34 Q15 22 34 23 Q55 21 61 37 Q66 52 49 60 Q30 67 16 55 Q9 47 14 34Z','#eda969',[10,21,56,43],130,'#c38152');
 pencil(g,'M14 42 Q23 36 36 47 Q49 35 61 41 Q62 56 44 61 Q24 65 14 52Z','#fbedd8',[12,36,51,29],42,'#cab397');
 ellipse(g,25,39,3.3,4.1,'#463c42',null);ellipse(g,48,38,3.3,4.1,'#463c42',null);ellipse(g,24.2,37.6,1.05,1.3,'#fff8ed',null);ellipse(g,47.3,36.7,1.05,1.3,'#fff8ed',null);
 ellipse(g,20,47,4,2.1,'#e9ada5',null);ellipse(g,54,46,4,2.1,'#e9ada5',null);
 path(g,'M32 47 Q36 44 40 47 Q37 53 34 50Z','#65504c');path(g,'M36 51 Q31 56 27 52 M36 51 Q42 56 46 51',null,'#9a7767',.9);
 line(g,[[30,29],[33,32],[35,28]],'#fbe1b3',1.4);g.restore();
},2.3);
make('spider'+f,86,62,g=>{for(let i=0;i<4;i++){let y=23+i*6,sw=Math.sin(f*TAU/8+i*1.5)*4;line(g,[[32,y],[17-i*2,y-9+sw],[5+i*2,y+12+sw]],ink,2.5);line(g,[[53,y],[69+i,y-9-sw],[80-i,y+12-sw]],ink,2.5);}pencil(g,'M27 23 Q27 5 43 5 Q62 8 61 28 L55 45 32 46Z','#8b899d',[25,5,38,43],150);ellipse(g,43,37,17,16,'#b7a8bf');eyes(g,43,37,13);ellipse(g,36,31,1.1,1.1,'#f4d7a5',null);ellipse(g,50,31,1.1,1.1,'#f4d7a5',null);starShape(g,44,18,7,'#d5bb99');},1.7);
}
// Friendly invented monsters, like a child's crayon drawings cut out with scissors.
for(let f=0;f<8;f++){let s=Math.sin(f*TAU/8),c=Math.cos(f*TAU/8);
make('scribble'+f,87,86,g=>{
 pencil(g,`M23 67 L${18+s*3} 78 33 79 36 67Z`,'#c692ad',[16,65,23,17],32);pencil(g,`M53 67 L${53-s*3} 80 69 78 66 66Z`,'#c692ad',[50,64,22,19],32);
 pencil(g,`M14 53 L6 ${46+s*4} 14 42 9 30 20 29 20 17 31 21 36 8 44 16 57 8 60 22 73 21 70 32 81 36 74 46 82 56 71 59 72 72 59 68 51 76 40 69 29 76 24 67 13 69Z`,'#b3bdd8',[5,7,78,70],240,'#8c86b0');
 let fur=new Path2D('M16 37Q20 13 43 18Q74 14 73 48Q78 72 46 72Q12 75 16 37Z');g.save();g.clip(fur);
 for(let i=0;i<16;i++){let x=15+i*4,y=25+(i%4)*5;line(g,[[x,y],[x-6,60+(i%3)*5]],['#d5a4c0','#b5cba4','#e7ca8d','#9dbfce'][i%4],4);line(g,[[x-1,y+3],[x-7,58]],'#f7e4db',.7);}g.restore();
 ellipse(g,31,38,11,13,'#f8f0df');ellipse(g,55,35,9,10,'#fcf3df');ellipse(g,32+s,40,4,5,'#51475e',null);ellipse(g,53+s,35,3,4,'#51475e',null);ellipse(g,31,38,1.3,1.6,'#fff8ea',null);ellipse(g,52,33,1,1,'#fff8ea',null);
 path(g,'M30 56 Q46 49 60 54 Q56 68 42 66 Q34 64 30 56Z','#75637f');path(g,'M34 55 L40 54 39 60 35 60Z','#fff0d8');path(g,'M48 54 L54 54 53 61 49 60Z','#fff0d8');
 line(g,[[11,44],[5,39],[3,44]],'#9d7c9d',2);line(g,[[77,46],[83,40],[84,44]],'#9d7c9d',2);
},2.5);
make('puff'+f,76,76,g=>{
 pencil(g,`M23 57 L${17+s*2} 68 31 69 34 59Z`,'#c997ae',[16,56,19,15],25);pencil(g,`M44 58 L${48-s*2} 69 61 68 56 56Z`,'#c997ae',[43,55,19,16],25);
 pencil(g,'M18 26 Q12 9 22 8 Q30 9 28 25Z','#d4b38c',[12,7,19,21],35);pencil(g,'M47 25 Q49 5 59 9 Q67 18 57 29Z','#d4b38c',[45,5,22,26],35);line(g,[[19,15],[26,16]],'#92798c',1);line(g,[[53,15],[60,17]],'#92798c',1);
 pencil(g,`M13 35 Q5 24 19 21 Q26 12 37 20 Q49 11 57 22 Q71 19 68 33 Q79 43 67 52 Q71 66 56 65 Q47 74 36 66 Q23 74 17 63 Q3 64 9 51 Q0 42 13 35Z`,'#e6b4cc',[3,13,69,59],170,'#b885ac');
 path(g,'M17 35 Q24 29 29 35 M47 33 Q54 27 60 34',null,'#f7dce1',2);ellipse(g,26,42,2.5,3.3,'#65506c',null);ellipse(g,51,41,2.5,3.3,'#65506c',null);ellipse(g,20,49,4,2,'#d38fae',null);ellipse(g,57,49,4,2,'#d38fae',null);
 path(g,'M31 51 Q39 48 47 51 Q44 61 37 58Z','#9b7397');path(g,'M35 51 L40 50 40 55 36 55Z','#fff0da');
},2.4);
make('sprout'+f,76,91,g=>{
 pencil(g,`M25 72 L${20+s*3} 83 33 84 36 71Z`,'#76a9a8',[18,70,20,17],35);pencil(g,`M44 71 L${46-s*3} 84 59 82 54 70Z`,'#76a9a8',[43,69,19,17],35);
 pencil(g,'M24 24 Q17 5 26 5 Q33 6 33 23Z','#e6cd94',[19,3,17,23],30);pencil(g,'M44 22 Q43 4 53 7 Q59 13 53 25Z','#e6cd94',[41,4,19,25],30);
 pencil(g,`M19 38 Q5 ${32+s*3} 5 ${49+s*3} L13 ${55+s*3} 25 46Z`,'#a2c8c0',[3,30,24,29],40);pencil(g,`M57 36 Q73 ${29-s*3} 72 ${47-s*3} L64 ${54-s*3} 52 45Z`,'#a2c8c0',[50,28,24,29],40);
 for(let i=0;i<3;i++){line(g,[[6+i*2,37+i*5+s*3],[13+i*2,39+i*5+s*3]],'#dcbd9d',3);line(g,[[64-i,35+i*5-s*3],[71-i,33+i*5-s*3]],'#dcbd9d',3);}
 pencil(g,'M20 34 Q18 17 38 17 Q59 16 60 37 L59 62 Q58 79 38 80 Q17 77 17 60Z','#a3c9bb',[15,15,47,68],200,'#6c9c99');
 pencil(g,'M28 55 Q41 48 50 58 L49 69 Q38 76 27 67Z','#d6d8b6',[25,49,27,25],38,'#a3b7a0');
 ellipse(g,29,36,6,8,'#f9efdc');ellipse(g,49,34,7,7,'#f9efdc');ellipse(g,30,37,2.4,3.3,'#4c6b70',null);ellipse(g,48,35,2.6,3.4,'#4c6b70',null);path(g,'M32 48 Q39 53 47 47',null,'#688b84',1.4);path(g,'M35 49 L40 49 39 53Z','#fff3d7');
 line(g,[[28,24],[33,21]],'#e5e7ca',1.5);
},2.4);
}
make('coin',42,46,g=>{pencil(g,'M7 17 Q9 5 22 5 Q35 7 37 20 L34 34 Q19 44 7 33Z','#bd965a',[5,4,34,37],45,'#906c48');ellipse(g,20,22,15,17,'#edca7d','#9c794d',1);ellipse(g,20,22,11,13,null,'#fff0ba',1.5);starShape(g,20,22,9,'#d7a85f');line(g,[[12,12],[16,9]],'#fff0bd',1.5);},2);
make('shop',130,145,g=>{
 ellipse(g,30,129,11,11,'#7d7085');ellipse(g,98,129,11,11,'#7d7085');ellipse(g,30,129,5,5,'#d6bd9f');ellipse(g,98,129,5,5,'#d6bd9f');
 pencil(g,'M15 49 L114 49 115 124 15 124Z','#d8bea2',[13,47,104,79],220,'#a18b7d');
 pencil(g,'M12 22 L115 22 121 59 8 59Z','#e7d6b4',[6,20,117,42],150,'#b29b87');
 for(let i=0;i<6;i++){let x=10+i*18;path(g,`M${x+3} 23 L${x+13} 23 ${x+16} 58 ${x} 58Z`,i%2?'#c399b1':'#b2c8c0',null);path(g,`M${x} 58 L${x+16} 58 Q${x+8} 73 ${x} 58Z`,i%2?'#c399b1':'#b2c8c0',ink,.7);}
 pencil(g,'M25 69 L104 69 104 105 25 105Z','#8b7a91',[23,67,83,40],90);path(g,'M28 73 L100 73 100 101 28 101Z','#f0dfbf');
 // A tiny smiling shopkeeper peeks above jars and star biscuits.
 ellipse(g,63,86,10,11,'#e6c596');ellipse(g,59,85,1.3,1.8,ink,null);ellipse(g,67,85,1.3,1.8,ink,null);path(g,'M60 91 Q64 94 68 90',null,'#9d796b');path(g,'M52 79 Q63 64 75 79Z','#b5a3be');
 path(g,'M34 88 L45 88 47 102 33 102Z','#d5af79');path(g,'M34 85 L45 85 45 89 34 89Z','#af907b');starShape(g,87,94,8,'#e1bd7e');
 pencil(g,'M18 104 L113 104 119 113 12 113Z','#bf9d87',[10,102,111,13],80);line(g,[[22,118],[103,118]],'#a68c7c',1);
 path(g,'M44 7 L85 7 87 20 43 20Z','#f2dfba');starShape(g,65,13,5,'#d6ad6e');line(g,[[48,13],[55,13]],'#b19880',1);line(g,[[74,13],[81,13]],'#b19880',1);
},2.8);

make('bossRose',150,170,g=>{pencil(g,'M42 110 Q18 128 15 157 L35 161 64 123 86 122 113 164 135 156 111 110Z','#899c8c',[14,108,123,58],180);pencil(g,'M46 57 Q28 78 34 112 L18 128 47 140 70 128 101 141 132 124 116 110 Q125 72 104 56Z','#a4ae93',[18,54,116,89],230);for(let i=0;i<7;i++){let a=i*TAU/7;roseFlower(g,75+Math.cos(a)*32,47+Math.sin(a)*27,23);}roseFlower(g,75,43,27);path(g,'M52 52 Q75 63 98 52 L94 75 Q76 87 57 74Z','#f2c4c8');eyes(g,75,67,25);path(g,'M61 20 L58 4 70 13 78 2 86 14 99 4 93 24Z','#e5c57e');pencil(g,'M43 83 Q17 80 6 106 L21 113 53 96Z','#b7bf9d',[5,79,50,37],70);pencil(g,'M105 82 Q132 79 144 103 L131 113 96 97Z','#b7bf9d',[95,79,50,37],70);roseFlower(g,75,106,19);line(g,[[45,113],[55,127]],'#5e7e70',2);line(g,[[104,110],[96,127]],'#5e7e70',2);},2.5);
make('bossMoon',150,170,g=>{pencil(g,'M42 99 L23 151 48 160 74 147 99 162 130 148 109 99Z','#8397b9',[22,96,110,67],270,'#526589');for(let [x,y]of [[40,135],[72,118],[104,141]])starShape(g,x,y,7,'#e4cf91');pencil(g,'M40 84 Q20 81 7 118 L22 127 51 99Z','#9badd1',[6,80,47,48],100);pencil(g,'M104 82 Q134 79 144 116 L128 125 97 97Z','#9badd1',[96,79,49,49],100);pencil(g,'M93 11 Q45 2 28 44 Q14 85 52 106 Q91 123 123 84 Q93 98 72 76 Q48 47 93 11Z','#e5d5a7',[22,8,105,106],350,'#a29587');ellipse(g,44,48,5,6,'#d0c2a3');ellipse(g,43,77,3,4,'#d0c2a3');ellipse(g,65,96,3,2,'#c7ba9f');line(g,[[51,56],[58,59],[65,55]],ink,1.8);path(g,'M56 75 Q68 81 77 74',null,'#8d7c80',1.5);starShape(g,111,38,19,'#f2d288');line(g,[[111,57],[111,96]],'#ad91bb',2);starShape(g,111,107,10,'#d1b1d4');},2.8);
// Inventory objects are also the visible projectile art.
make('rose',64,70,g=>{line(g,[[32,31],[30,63]],'#708a72',3);pencil(g,'M30 49 Q10 35 12 50 Q21 59 30 53Z','#a6b994',[10,35,22,25],35);roseFlower(g,32,24,22);},2);
make('star',64,64,g=>{starShape(g,32,32,27);eyes(g,32,32,12);},2);
make('plane',78,59,g=>{pencil(g,'M5 25 L70 5 48 53 34 34 23 47 24 31Z','#e6dfcf',[5,4,67,51],120,'#a8a0a9');path(g,'M24 31 L70 5 34 34 48 53',null,'#8b8199',1.3);path(g,'M24 31 L23 47 34 34Z','#b5bdd0');line(g,[[10,40],[18,37]],'#b79abd');},2);
make('bubble',65,66,g=>{ellipse(g,32,33,25,26,'#bad4df','#7c95b1',1.1);ellipse(g,32,35,21,21,null,'#ead5df',3);path(g,'M15 26 Q19 13 29 13',null,'#fff6e6',4);ellipse(g,45,47,4,2,'#f6eadb',null);starShape(g,34,34,9,'#f4e5be');},2);
make('bell',62,67,g=>{ellipse(g,31,10,6,6,'#c6a77f');pencil(g,'M16 26 Q17 13 31 13 Q46 13 47 27 L49 43 55 50 8 50 14 41Z','#dfc080',[8,12,49,40],110,'#a88960');ellipse(g,31,51,23,5,'#ad926e');ellipse(g,31,54,7,7,'#edd29a');line(g,[[22,22],[19,40]],'#fae9bd',2);},2);
make('ribbon',67,69,g=>{pencil(g,'M28 24 Q6 5 5 22 Q3 43 28 35 L16 59 27 55 32 65 36 36 44 62 49 53 61 58 44 33 Q65 38 61 17 Q59 5 37 23Z','#d698b2',[3,6,61,60],170);ellipse(g,33,29,8,9,'#edb1c3');line(g,[[13,21],[25,27]],'#ffe0db',1.5);line(g,[[43,27],[54,20]],'#ffe0db',1.5);},2);
make('comet',78,69,g=>{pencil(g,'M14 17 L70 5 57 27 72 24 50 44 59 44 30 62Z','#b1bbd5',[12,4,62,61],130);line(g,[[34,32],[59,15]],'#e5d9df',2);starShape(g,25,44,21,'#f0cb80');},2);
make('garden',70,70,g=>{pencil(g,'M9 44 L61 44 54 63 15 63Z','#aebc99',[9,44,54,21],60);for(let [x,y,r]of [[20,31,14],[45,24,19],[36,46,11]]){line(g,[[x,y],[35,56]],'#71876b',2);roseFlower(g,x,y,r);}},2);
make('aurora',76,67,g=>{for(let i=0;i<4;i++)path(g,`M${7+i*9} 48 Q${18+i*9} 5 ${29+i*9} 21 Q${39+i*9} 48 ${48+i*7} 12`,null,['#b9cedb','#ccafd1','#e5bfca','#ebd69d'][i],7);starShape(g,23,47,10,'#f3dc94');starShape(g,57,49,8,'#f3dc94');},2);
make('tempest',70,72,g=>{for(let i=0;i<5;i++)ellipse(g,34,13+i*9,27-i*4,6,null,i%2?'#b4a3cc':'#87abc6',4);path(g,'M38 20 L23 43 34 41 28 65 52 34 40 35 49 17Z','#efd18d');},2);
make('nova',70,70,g=>{starShape(g,35,35,31,'#d7b8d1');starShape(g,35,35,22,'#e8c16f');ellipse(g,35,35,9,9,'#fff2c5');},2);
make('dragon',82,71,g=>{pencil(g,'M31 43 L10 20 7 43 22 40 23 55Z','#b3c2c7',[6,18,28,39],65);pencil(g,'M45 43 L72 14 76 40 59 37 59 54Z','#b3c2c7',[43,14,35,42],65);pencil(g,'M26 59 Q42 38 30 28 L27 13 38 20 49 9 55 25 65 31 58 42 46 43 Q61 63 38 65 L17 63 7 54Z','#91b5b3',[6,8,61,59],150);ellipse(g,47,28,2,2,'#fff0bb');path(g,'M56 39 L73 36 66 45 77 47 61 53Z','#e7ad77');},2);
make('mirror',62,70,g=>{pencil(g,'M12 12 L48 8 53 48 14 53Z','#d3bc91',[10,7,45,47],80);path(g,'M18 18 L42 15 46 42 20 46Z','#b6c9d5');line(g,[[22,33],[36,20]],'#f9eedc',3);line(g,[[26,39],[40,25]],'#e8e8df',1.4);path(g,'M27 53 L39 52 41 64 25 65Z','#d3bc91');},2);
make('crown',70,58,g=>{pencil(g,'M9 12 L23 24 34 6 46 23 61 11 55 47 15 47Z','#e3c17e',[7,5,57,45],130);path(g,'M16 39 L55 39 55 47 16 47Z','#d4a86e');ellipse(g,34,33,4,5,'#b58caf');},2);
make('candle',56,71,g=>{pencil(g,'M17 29 L38 29 39 58 17 58Z','#ede1bd',[16,28,24,32],60);path(g,'M18 29 L18 38 Q23 44 25 35 L25 32 Q29 40 31 33 L36 30Z','#faf0d5');path(g,'M28 5 Q42 22 29 27 Q17 24 28 5Z','#e8b773');line(g,[[28,26],[28,31]],ink,1);ellipse(g,28,60,21,6,'#ae9cba');},2);
make('clover',64,65,g=>{line(g,[[32,32],[45,57]],'#77967e',3);for(let [x,y]of [[22,22],[42,22],[21,41],[42,41]])pencil(g,`M32 33 Q${x-17} ${y-13} ${x} ${y-8} Q${x+15} ${y-13} 32 33Z`,'#b5c5a1',[x-14,y-15,30,31],40,'#78967b');},2);
// Pocket treasures. Clear silhouettes stay legible when scattered across the paper world.
make('cookie',66,65,g=>{starShape(g,33,34,28,'#cba579');starShape(g,33,31,27,'#e7c491');starShape(g,33,31,20,'#f3dbae');for(let [x,y]of [[29,18],[21,30],[39,28],[33,41],[46,38]])ellipse(g,x,y,1.5,1.3,'#b68b65',null);line(g,[[20,39],[22,43],[27,43]],'#fff0cc',1);},2);
make('tea',77,68,g=>{ellipse(g,37,57,31,7,'#c9b2bc');ellipse(g,37,55,27,5,'#f1dce0');ellipse(g,62,37,10,11,'#ead5d7');ellipse(g,62,37,6,7,'#fff6e5');pencil(g,'M13 27 L60 27 56 47 Q37 64 18 48Z','#eacfd3',[12,26,50,29],100,'#aa879e');ellipse(g,37,27,23,7,'#b98e72');ellipse(g,36,26,19,4,'#d2ac7a');roseFlower(g,36,43,7);path(g,'M29 20 Q22 14 30 7 M41 20 Q49 14 42 5',null,'#c3adb5',1.3);},2);
make('snowglobe',70,78,g=>{ellipse(g,35,32,27,28,'#c6d9df','#8197ad',1.2);path(g,'M18 22 Q23 10 34 10',null,'#fff4e3',3);path(g,'M12 46 Q29 37 59 46 L54 54 18 55Z','#f6eddd');pencil(g,'M18 56 L53 56 58 69 14 69Z','#b9a7c1',[13,54,46,18],85);path(g,'M21 62 L50 62',null,'#e4cfb4',2);starShape(g,36,34,13,'#e9c478');for(let [x,y]of [[17,31],[49,22],[52,38],[27,43],[39,16]])ellipse(g,x,y,1.5,1.5,'#fff9ed',null);},2);
make('umbrella',76,81,g=>{path(g,'M39 8 L39 65 Q39 78 28 73 Q24 71 27 67',null,'#89768f',3);pencil(g,'M5 40 Q10 12 39 11 Q66 11 71 40 Q61 31 50 40 Q39 31 28 40 Q16 31 5 40Z','#b3bed6',[4,9,68,33],150);path(g,'M39 11 Q26 16 28 40 M39 11 Q51 20 50 40',null,'#7e819e',1);path(g,'M39 12 Q32 22 28 37 L38 34 48 37 Q46 22 39 12Z','#dac6d6');starShape(g,39,24,5,'#ead19d');},2);
make('feather',65,78,g=>{pencil(g,'M15 65 Q8 42 24 22 Q37 5 56 6 Q63 24 47 42 L37 43 41 48 28 54 29 60Z','#d5c5de',[9,5,52,64],170,'#9483ad');line(g,[[13,71],[28,48],[48,17]],'#867b9b',1.7);for(let i=0;i<5;i++)line(g,[[22+i*5,56-i*7],[17+i*6,41-i*6]],'#b1a0bf',.8);for(let i=0;i<4;i++)line(g,[[29+i*5,46-i*7],[40+i*4,42-i*7]],'#b1a0bf',.8);line(g,[[29,45],[46,19]],'#f6e9e5',1.2);},2);
make('hourglass',63,79,g=>{pencil(g,'M13 16 L49 16 Q50 31 35 40 Q49 52 49 65 L14 65 Q14 51 27 40 Q14 30 13 16Z','#ced9df',[12,15,39,52],80,'#a4adc3');path(g,'M18 21 L44 21 Q41 31 32 36 Q23 31 18 21Z','#e9cd91');path(g,'M18 61 Q23 52 31 48 Q40 51 45 61Z','#e6c486');line(g,[[31,35],[31,49]],'#c9a774',1.4);for(let y of [8,65])pencil(g,`M8 ${y}L54 ${y} 54 ${y+7} 8 ${y+7}Z`,'#ad94a6',[7,y,48,8],35);line(g,[[15,16],[16,65]],'#faf0df',1.5);},2);
make('rainbow',82,73,g=>{const colors=['#d8949f','#e1b982','#e8d39a','#a8bfa5','#9dbbd0','#baa4ce'];for(let i=0;i<6;i++){let x=12+i*10;pencil(g,`M${x} 40L${x} 18 ${x+4} 8 ${x+8} 18 ${x+8} 40Z`,colors[i],[x,7,9,35],28);line(g,[[x+2,20],[x+2,34]],'#f7e8d1',.8);}pencil(g,'M8 34 L75 34 72 63 12 64Z','#e4cfb2',[7,32,70,34],110);path(g,'M15 40 L67 40 65 57 17 58Z','#f6e9d0');for(let i=0;i<4;i++){g.beginPath();g.arc(41,55,13-i*3,Math.PI,TAU);g.strokeStyle=colors[i];g.lineWidth=3;g.stroke();}},2);
make('ticket',83,55,g=>{pencil(g,'M7 9 L75 7 76 17 Q65 23 77 29 L77 43 8 45 7 33 Q18 27 6 22Z','#e8c580',[5,6,74,41],145,'#b29166');path(g,'M17 14 L64 12 66 38 18 39Z',null,'#bc9969',.8);starShape(g,38,26,11,'#f8e3a7');for(let y=16;y<39;y+=5)line(g,[[58,y],[58,y+2]],'#b79267',1);},2);
make('firefly',65,82,g=>{pencil(g,'M19 20 L47 20 47 30 54 41 52 68 Q33 76 13 68 L12 41 19 30Z','#bbd0cc',[11,18,45,56],100,'#86a2a4');path(g,'M17 43 L17 63',null,'#edf0de',2);path(g,'M17 13 L49 13 49 23 17 23Z','#c1a886');line(g,[[23,15],[23,20],[43,20]],'#8e7d75');for(let [x,y]of [[28,42],[40,57],[26,61]]){ellipse(g,x,y,5,5,'#e7d59b',null);ellipse(g,x-3,y-2,3,2,'#ede8ce');ellipse(g,x+3,y-2,3,2,'#ede8ce');ellipse(g,x,y,1.5,3,'#b3a063',null);}line(g,[[47,31],[54,24],[54,10],[48,5]],'#9b8c90',1);},2);
make('needle',76,74,g=>{pencil(g,'M10 24 L55 20 63 60 17 65Z','#beadc8',[8,18,57,49],120);path(g,'M18 31 L48 27 54 54 23 58Z','#e7c9cf');for(let x=20;x<48;x+=6)line(g,[[x,29],[x+1,33]],'#947a94');for(let x=25;x<54;x+=6)line(g,[[x,53],[x+1,58]],'#947a94');path(g,'M32 48 L59 9 Q65 3 65 10 L35 51Z','#d4dbe0','#7c8298',.8);line(g,[[60,10],[58,15]],'#7c8298',1.2);path(g,'M62 9 Q72 8 69 26 Q63 33 69 42',null,'#c48eaa',1.6);ellipse(g,29,42,3,3,'#e9d4a5');},2);
make('parcel',79,80,g=>{pencil(g,'M9 26 L41 11 70 24 70 62 38 74 9 59Z','#c9ae8f',[7,9,65,66],200,'#977b70');path(g,'M9 26 L38 39 70 24 M38 39 L38 74',null,'#8a7371',1.4);path(g,'M22 20 L52 32 53 69 44 72 44 35 15 23Z','#dcb4bb');path(g,'M54 17 L62 21 31 35 31 69 23 66 23 31Z','#dcb4bb');pencil(g,'M26 22 Q10 5 23 5 Q35 5 37 23 Q47 4 58 10 Q66 22 39 26Z','#e3bac4',[15,3,47,26],55);ellipse(g,37,24,5,4,'#b78aa3');path(g,'M47 44 L62 39 62 52 47 57Z','#f2dfb9');starShape(g,54,48,4,'#c6a17c');},2.4);
make('scroll',76,68,g=>{pencil(g,'M22 12 L60 12 56 51 Q57 59 64 58 L24 60 Q14 60 16 50Z','#eedbb5',[14,10,51,53],135,'#b29779');ellipse(g,22,14,10,7,'#d1b68e');ellipse(g,22,14,5,3,'#f5e5c6');path(g,'M54 51 L65 51 Q74 58 64 62 Q55 64 54 51Z','#dec6a0');for(let y of [25,31,37])line(g,[[28,y],[48,y-1]],'#ae9383',1);starShape(g,36,49,6,'#c693ab');},2);
make('honey',65,76,g=>{pencil(g,'M19 20 L45 20 44 29 51 38 50 64 Q33 71 15 64 L14 38 20 28Z','#dfba79',[12,19,41,50],120,'#b48c61');path(g,'M17 10 L48 10 49 22 16 22Z','#c7ab91');line(g,[[20,14],[44,14]],'#8b736c',1);path(g,'M19 37 L46 37 46 58 19 58Z','#f7e5bd');ellipse(g,32,47,7,8,'#e4c583');line(g,[[26,44],[38,44]],'#9f8067',1.3);line(g,[[26,49],[38,49]],'#9f8067',1.3);ellipse(g,27,40,4,3,'#f8efdc');ellipse(g,37,40,4,3,'#f8efdc');line(g,[[19,29],[18,33]],'#f9dfa3',2);},2);

// Discoverable landmarks, all cut from the same illustrated sketchbook.
make('planet',145,119,g=>{pencil(g,'M22 58 Q19 21 64 15 Q105 9 120 51 Q132 92 87 109 Q37 124 22 58Z','#c0b7d1',[20,13,104,100],360);ellipse(g,52,40,12,8,'#a99ebd','#867f9a');ellipse(g,92,78,15,10,'#d6c9dc','#a399b4');ellipse(g,45,79,6,5,'#d4c8d8');ellipse(g,98,41,5,4,'#d7ccdd');g.save();g.translate(72,61);g.rotate(-.32);g.beginPath();g.ellipse(0,0,68,18,0,0,Math.PI);g.strokeStyle='#e4c68e';g.lineWidth=7;g.stroke();g.strokeStyle='#9f8b87';g.lineWidth=1;g.stroke();g.restore();starShape(g,31,16,8,'#eed394');},2.5);
make('telescope',115,132,g=>{pencil(g,'M52 68 L31 124 39 125 61 81 84 125 92 123 66 67Z','#b7a18b',[30,65,64,63],90);line(g,[[61,80],[61,119]],'#887788',4);g.save();g.translate(56,46);g.rotate(-.5);pencil(g,'M-36 -12 L34 -18 35 16 -36 12Z','#c0a580',[-38,-20,75,39],170);path(g,'M18 -17 L27 -18 29 16 20 15Z','#e6d1a7');ellipse(g,35,-1,8,17,'#89aabf');ellipse(g,37,-3,4,11,'#c1d5da');path(g,'M-41 -7 L-34 -8 -34 8 -41 7Z','#766b82');g.restore();ellipse(g,60,68,8,7,'#c5b18e');},2.5);
make('roseDome',108,134,g=>{pencil(g,'M13 115 L94 115 97 122 89 128 18 128 9 122Z','#b29c82',[9,113,90,18],80);pencil(g,'M17 115 L17 47 Q17 12 54 12 Q91 12 91 47 L91 115Z','#d4dfe0',[16,10,77,107],130,'#a8b8c6');line(g,[[27,99],[27,45],[31,31],[38,26]],'#fff4e2',3);ellipse(g,54,9,5,5,'#d8bd92');line(g,[[54,64],[54,110]],'#779077',3);pencil(g,'M54 87 Q33 72 35 88 Q44 97 54 91Z','#b5c69f',[33,73,25,26],30);roseFlower(g,54,60,20);ellipse(g,54,116,36,6,'#c6b296');},2.7);
make('well',130,132,g=>{pencil(g,'M22 85 L22 112 Q62 134 108 112 L108 85Z','#b9adbd',[21,84,90,42],180);ellipse(g,65,85,43,17,'#c6bbcb');ellipse(g,65,85,30,10,'#80778f');for(let y of [98,111])path(g,`M24 ${y}Q65 ${y+17} 106 ${y}`,null,'#8d819c',1);line(g,[[48,102],[48,114]],'#8d819c');line(g,[[82,104],[82,117]],'#8d819c');pencil(g,'M23 36 L30 36 30 86 23 84Z','#a78d7b',[23,35,8,52],30);pencil(g,'M99 36 L106 36 106 86 99 84Z','#a78d7b',[99,35,8,52],30);pencil(g,'M9 38 L64 6 121 38 113 43 64 19 17 44Z','#b79cab',[7,5,116,41],160);line(g,[[29,54],[103,54]],'#927b72',5);line(g,[[66,53],[66,81]],'#c9ad84',2);path(g,'M54 74 L78 74 74 92 58 92Z','#c7b497');},2.6);
make('lantern',70,114,g=>{path(g,'M25 25 Q18 4 36 5 Q53 5 45 25',null,'#71647d',3);pencil(g,'M20 28 L51 28 55 73 16 73Z','#c6b28b',[15,26,42,48],100);path(g,'M25 34 L45 34 47 65 22 65Z','#f5dd9c');path(g,'M32 61 L32 48 38 48 39 61Z','#efc788');path(g,'M35 37 Q44 46 35 49 Q29 45 35 37Z','#fff1c1');pencil(g,'M14 73 L56 73 52 80 19 80Z','#9e8b83',[12,72,47,11],50);line(g,[[35,80],[35,105]],'#84748d',3);},2);
make('bigMushroom',134,149,g=>{pencil(g,'M49 72 Q40 112 43 133 L32 139 60 142 71 135 94 140 104 131 89 121 84 69Z','#e6d4bd',[31,67,77,77],220);pencil(g,'M7 74 Q15 17 64 9 Q116 12 127 74 Q65 99 7 74Z','#c9949e',[6,8,123,88],400,'#8d657b');for(let [x,y,r]of [[30,54,10],[63,29,11],[91,47,13],[65,71,7]])ellipse(g,x,y,r,r*.7,'#f3e2ca');line(g,[[54,99],[52,127]],'#b5a294',1);ellipse(g,77,111,8,12,'#a89697');line(g,[[77,100],[77,121]],'#665969');},2.8);
make('paperHouse',157,166,g=>{pencil(g,'M30 67 L128 67 127 147 29 147Z','#e6d2b6',[28,64,102,85],300);pencil(g,'M16 73 L77 16 142 73 132 82 78 34 25 83Z','#b095b1',[15,15,130,70],270);path(g,'M111 46 L111 17 126 17 126 61Z','#aa95a9');path(g,'M34 80 L50 80 50 143 34 143Z','#ddc5a8');pencil(g,'M66 147 L66 109 Q79 94 92 109 L92 147Z','#b69687',[64,97,31,52],80);ellipse(g,86,129,2,2,'#e9cf94');for(let x of [39,101]){path(g,`M${x} 87L${x+17} 87 ${x+17} 105 ${x} 105Z`,'#a8bfce');line(g,[[x+8,88],[x+8,104]],'#f7ead1',2);line(g,[[x,96],[x+17,96]],'#f7ead1',2);}starShape(g,77,61,12,'#dfc681');path(g,'M18 148 L135 148 144 156 9 156Z','#b8a6a1');},2.7);
make('crystal',92,116,g=>{pencil(g,'M34 100 L22 30 44 5 68 29 63 100Z','#b6c8da',[20,4,50,99],230);path(g,'M44 5 L44 99 22 30Z','#d0d9de');line(g,[[44,5],[68,29],[44,43],[22,30]],'#8390ad',1);pencil(g,'M19 104 L5 65 19 48 35 68 33 106Z','#d1b7d2',[4,46,34,62],90);pencil(g,'M60 107 L58 59 74 42 87 59 79 107Z','#c8bad9',[57,41,32,68],110);line(g,[[74,44],[72,103]],'#f3e4e5',2);},2.5);
make('musicBox',105,111,g=>{pencil(g,'M12 65 L89 65 91 94 16 102Z','#a99dc0',[11,63,83,42],180);path(g,'M18 70 L83 70 84 90 21 96Z','#d2bad0');pencil(g,'M11 63 L17 26 86 24 90 64Z','#d4c4d8',[10,23,82,44],140);path(g,'M20 32 L78 31 81 57 17 57Z','#b5c9da');starShape(g,49,44,15,'#f0d290');ellipse(g,49,82,10,6,'#e6cb95');line(g,[[90,79],[99,77],[100,66]],'#978694',3);ellipse(g,99,64,3,5,'#d3b98d');},2.4);
make('fountain',147,147,g=>{ellipse(g,74,122,66,20,'#afa7bd');ellipse(g,74,115,61,19,'#d8d1d2');ellipse(g,74,112,53,13,'#a8c5d5');pencil(g,'M60 68 L58 109 Q75 120 91 109 L87 68Z','#c9becb',[57,66,36,51],130);ellipse(g,74,66,44,15,'#c8bdca');ellipse(g,74,61,40,12,'#a9c4d2');pencil(g,'M67 31 L67 59 80 59 80 31Z','#c9becb',[65,29,18,33],60);ellipse(g,74,28,23,9,'#c8bdca');ellipse(g,74,24,20,6,'#b8d2dc');starShape(g,74,12,8,'#efcf95');for(let [x,y]of [[42,67],[104,67],[58,28],[87,29]])path(g,`M${x} ${y} Q${x-5} ${y+20} ${x-3} ${y+40}`,null,'#cce1e4',3);},2.5);
make('meteor',118,113,g=>{pencil(g,'M26 62 L44 10 55 30 71 7 73 35 99 21 91 52 109 47 91 83Z','#e1be9b',[24,7,87,80],200);pencil(g,'M13 59 L29 45 58 47 83 64 85 87 60 105 28 102 10 82Z','#a7a3b7',[9,43,79,64],260);path(g,'M29 45 L42 65 63 65 60 105 45 84 28 102',null,'#79748e',1.2);ellipse(g,28,73,8,6,'#898298');ellipse(g,69,82,6,7,'#8f889f');line(g,[[48,26],[41,44]],'#f4dfb9',3);},2.5);

// Weapon and inventory drawings. Reused as projectiles and physical equipment.
make('pencil',72,30,g=>{pencil(g,'M11 8 L58 8 58 21 11 21Z','#e9bf55',[11,8,48,14],35,'#b28a3a');path(g,'M11 8 L2 14 11 21Z','#e7c395');path(g,'M2 14 L6 12 6 16Z',ink);path(g,'M58 8 L64 8 64 21 58 21Z','#c7bcd0');path(g,'M64 8 Q72 7 71 15 L70 21 64 21Z','#e3a3bb');line(g,[[13,12],[56,12]],'#ffe5a0',1.3);line(g,[[13,18],[56,18]],'#af833e',.7);},1.5);
make('book',62,57,g=>{pencil(g,'M5 10 L24 7 31 12 53 6 56 43 34 49 29 46 8 49Z','#b98581',[5,6,52,45],60);path(g,'M8 8 L25 5 31 10 51 5 52 39 33 45 29 41 10 44Z','#fff2cc');line(g,[[31,10],[30,39],[33,45]],'#695568',1);for(let i=0;i<6;i++){line(g,[[14,14+i*4],[25,13+i*4]],'#ae9e8d',.7);line(g,[[35,15+i*4],[47,12+i*4]],'#ae9e8d',.7);}path(g,'M37 8 L42 7 42 28 38 24 35 28Z','#b29aca');});
make('lightning',50,64,g=>{pencil(g,'M29 3 L8 33 24 32 17 59 44 23 28 25 38 3Z','#f3d16e',[8,3,38,59],75,'#ba9451');line(g,[[27,12],[16,29],[27,27],[24,42]],'#fff9ce',1.7);});
make('tornado',58,64,g=>{pencil(g,'M6 10 Q29 2 51 10 L48 20 42 29 35 39 32 55 23 58 21 40 14 30 10 20Z','#bfcbdd',[5,6,49,53],100,'#8595b2');for(let i=0;i<7;i++){let y=12+i*6,w=21-i*2.8;ellipse(g,29,y,w,3.5,null,i%2?'#f9f5e8':'#7586a3',1.1);}});
make('fire',57,64,g=>{pencil(g,'M28 3 Q43 18 35 27 L47 20 Q57 41 43 52 Q25 67 12 49 Q2 36 18 22 L18 35 Q31 29 28 3Z','#e7a16e',[7,3,45,56],85,'#b76963');path(g,'M30 29 Q39 41 33 50 Q22 59 18 46 Q19 39 25 38 L24 45 Q31 42 30 29Z','#ffe2a2');});
make('scissors',60,62,g=>{ellipse(g,18,44,9,10,'#b79fc5');ellipse(g,41,44,9,10,'#b79fc5');ellipse(g,18,44,5,6,'#fff3d8');ellipse(g,41,44,5,6,'#fff3d8');pencil(g,'M21 36 L41 3 41 19 27 39Z','#ced4dc',[20,3,24,38],35);pencil(g,'M36 37 L16 3 16 20 30 40Z','#e0dce0',[15,3,24,39],35);ellipse(g,29,29,2,2,'#b49b76');});
make('ink',52,60,g=>{pencil(g,'M14 16 L37 16 36 27 44 35 43 52 10 52 9 35 15 27Z','#9895be',[8,16,38,37],105);path(g,'M13 7 L38 7 38 18 13 18Z','#c4ab8b');line(g,[[17,10],[17,15],[33,15]],'#8e725e',.9);path(g,'M15 33 L37 32 37 46 15 47Z','#f7e7ca');path(g,'M26 35 Q17 44 26 44 Q34 44 26 35Z','#817099');});
make('magnet',58,58,g=>{g.lineWidth=14;g.strokeStyle=ink;g.beginPath();g.arc(29,29,16,0,Math.PI);g.lineTo(13,9);g.stroke();g.beginPath();g.moveTo(45,9);g.lineTo(45,29);g.stroke();g.lineWidth=11;g.strokeStyle='#c98f9b';g.beginPath();g.arc(29,29,16,0,Math.PI);g.lineTo(13,9);g.stroke();g.beginPath();g.moveTo(45,9);g.lineTo(45,29);g.stroke();path(g,'M7 9 L19 9 19 18 7 18Z','#e6decd');path(g,'M39 9 L51 9 51 18 39 18Z','#e6decd');});
make('heart',58,58,g=>{pencil(g,'M29 48 C-4 32 3 2 27 16 C47 -2 65 24 29 48Z','#d99ca8',[4,6,50,44],85,'#ad6b8d');line(g,[[13,22],[16,17],[21,17]],'#ffe2d2',2);path(g,'M25 20 L33 20 33 27 40 27 40 34 33 34 33 41 25 41 25 34 18 34 18 27 25 27Z','#fcebd3',null);});
make('boots',62,58,g=>{pencil(g,'M10 8 L27 10 26 31 32 39 29 49 5 48 5 39 11 29Z','#b89473',[4,7,29,43],65,'#806074');pencil(g,'M35 9 L50 7 49 30 56 39 54 48 31 49 30 39 35 29Z','#c7a385',[29,7,28,44],65,'#806074');line(g,[[15,15],[23,17],[15,20],[23,23],[15,25]],'#f9e5bb',1.2);line(g,[[38,15],[46,14],[38,20],[46,21],[38,26]],'#f9e5bb',1.2);});
make('chest',76,67,g=>{pencil(g,'M9 28 Q7 10 34 9 Q61 6 65 24 L66 53 39 62 10 53Z','#c9a174',[8,8,60,55],160,'#895d60');path(g,'M10 30 L40 37 65 28 65 35 40 43 10 36Z','#e1c27d');line(g,[[40,36],[40,60]],'#704e5d',1.4);path(g,'M32 36 L45 38 45 49 33 47Z','#f1d48b');ellipse(g,38,42,2,2,'#68475b');line(g,[[15,19],[39,24],[58,18]],'#efd19d',1.5);});
make('gem',22,28,g=>{path(g,'M11 3 L19 14 11 25 3 14Z','#99b4e5','#4e4e75',1);path(g,'M11 4 L11 24 4 14Z','#c9d8ef',null);line(g,[[11,5],[16,13]],'#fff2d4',1);},1);
make('gemPurple',26,32,g=>{path(g,'M13 3 L23 16 13 29 3 16Z','#b49ce0','#54446e',1.3);path(g,'M13 4 L13 28 4 16Z','#dfc8ee',null);},1.3);
// Architectural props use skewed planes and long cast shadows, like a paper diorama.
function block(g,x,y,w,h,d,front='#b5b1bd',top='#d0cad4',side='#9493a9'){
 pencil(g,`M${x} ${y-h} L${x+w} ${y-h} ${x+w} ${y} ${x} ${y}Z`,front,[x,y-h,w,h],Math.max(15,w*h/120));
 pencil(g,`M${x+w} ${y-h} L${x+w+d} ${y-h-d*.5} ${x+w+d} ${y-d*.5} ${x+w} ${y}Z`,side,[x+w,y-h-d*.5,d,h+d*.5],30);
 pencil(g,`M${x} ${y-h} L${x+d} ${y-h-d*.5} ${x+w+d} ${y-h-d*.5} ${x+w} ${y-h}Z`,top,[x,y-h-d*.5,w+d,d*.5],25);
}
make('arch',290,230,g=>{
 block(g,34,211,43,159,20);block(g,215,211,43,159,20);block(g,18,65,256,32,14,'#b7b1c3','#d3cbd4','#9b93ae');
 for(let y=85;y<207;y+=32){line(g,[[35,y],[77,y],[97,y-10]],'#746d84',.8);line(g,[[216,y],[258,y],[277,y-10]],'#746d84',.8);line(g,[[y%2?55:62,y],[y%2?55:62,y-30]],'#928a9c',.6);}
 for(let x=51;x<260;x+=42)line(g,[[x,33],[x,65]],'#81778e',.8);
 path(g,'M37 30 L63 30 67 38 58 43 50 38 39 40Z','#d7cdd5','#93889a',.5);
 line(g,[[225,100],[241,108],[232,124],[246,133]],'#82758f',.8);line(g,[[56,153],[45,162],[53,173]],'#877a92',.8);
 path(g,'M14 209 L34 204 43 211 30 217Z','#cac2c6','#8e8192',.8);path(g,'M244 217 L260 211 274 217 259 224Z','#c7bec8','#8e8192',.8);
},1.2);
make('pillar',97,137,g=>{pencil(g,'M18 34 L71 34 76 114 53 129 14 117Z','#aaa9ba',[14,31,64,100],250);pencil(g,'M71 34 L86 22 88 100 76 114Z','#9695aa',[69,21,20,96],70);pencil(g,'M18 34 L13 18 33 7 66 8 86 22 71 34Z','#cbc6d1',[13,7,74,29],95);line(g,[[13,18],[43,22],[66,8]],'#8b809a');line(g,[[43,22],[52,33],[53,127]],'#82748b',.75);line(g,[[18,72],[73,75],[87,64]],'#8b7e98');line(g,[[29,34],[30,70]],'#8e829b',.65);},1.2);
make('rock',72,51,g=>{pencil(g,'M7 32 L14 16 33 6 56 15 65 35 50 43 25 44Z','#bfc0c7',[7,6,60,38],130,'#80758f');path(g,'M14 16 L34 23 56 15 48 34 25 36Z','#d4d0d4','#92879b',.8);line(g,[[34,23],[33,33]],'#8a7e96',.7);});
make('stump',80,69,g=>{pencil(g,'M17 23 L15 52 7 59 29 58 43 64 60 55 74 57 65 45 65 22Z','#bfa185',[7,20,68,46],120,'#8d6976');ellipse(g,41,23,25,12,'#ead6ae');ellipse(g,41,23,18,8,null,'#af8d74',.9);ellipse(g,41,23,11,4,null,'#af8d74',.8);line(g,[[23,35],[23,49],[19,55]],'#8f7073');line(g,[[57,33],[58,48]],'#8f7073');});
make('sign',107,126,g=>{pencil(g,'M48 26 L57 26 60 116 48 119Z','#b49a7d',[46,25,16,96],55);pencil(g,'M12 21 L78 15 96 28 80 39 13 43Z','#d7bc8c',[10,14,88,31],90,'#907263');pencil(g,'M21 51 L88 45 90 67 28 74 8 64Z','#d7bd90',[8,44,83,32],95,'#907263');line(g,[[27,28],[60,24],[66,27],[62,32],[28,34]],'#947c69');line(g,[[75,54],[43,57],[35,62],[43,67],[74,63]],'#947c69');ellipse(g,51,29,1.5,1.5,'#675460');ellipse(g,53,60,1.5,1.5,'#675460');},2);
make('daisy',88,90,g=>{for(let i=0;i<3;i++){let x=20+i*23,y=28+(i%2)*19;line(g,[[x,83],[x+2,y]],'#798d78',1.2);pencil(g,`M${x} 69 Q${x-15} 55 ${x-16} 67 Q${x-9} 77 ${x} 75Z`,'#b7c4a8',[x-18,54,20,24],25,'#7c8c7b');for(let j=0;j<7;j++){let a=j*TAU/7;ellipse(g,x+Math.cos(a)*10,y+Math.sin(a)*8,6,8,'#f7eedc','#a9a0a1',.55);}ellipse(g,x,y,6,6,'#e8c565','#9d8965',.7);for(let j=0;j<10;j++){let a=rng()*TAU,r=rng()*4;ellipse(g,x+Math.cos(a)*r,y+Math.sin(a)*r,.5,.5,'#ac8b4c',null);}}},1.2);
make('lavender',88,76,g=>{for(let i=0;i<8;i++){let x=8+i*10,y=10+rng()*18;line(g,[[x+3,71],[x,y]],'#7a8c7c',1);for(let j=0;j<5;j++)ellipse(g,x+Math.sin(j*4)*3,y+j*4,3.6,3.5,j%2?'#b9a4c9':'#d5bdd7','#8e7a9b',.45);line(g,[[x+2,56],[x-4,47]],'#8b9c81',.8);}},1.1);
make('reeds',115,100,g=>{for(let i=0;i<10;i++){let x=10+i*10,h=30+rng()*56;line(g,[[x,96],[x-3,96-h]],'#8a9373',1.2);line(g,[[x,89],[x+7,74],[x+4,67]],'#a6ad85',.9);pencil(g,`M${x-6} ${96-h} Q${x-9} ${79-h} ${x-3} ${77-h} Q${x+3} ${80-h} ${x} ${96-h}Z`,'#9b7f6c',[x-9,76-h,12,21],15,'#665263');}},1);
make('tree',190,236,g=>{
 pencil(g,'M78 109 Q83 162 73 207 L57 222 84 217 99 229 107 221 125 224 112 207 Q107 151 114 111Z','#b99b85',[56,107,72,122],230,'#86647a');
 line(g,[[88,131],[91,181],[84,208],[77,214]],'#816775');line(g,[[105,139],[102,184],[108,211]],'#92737a',.8);
 pencil(g,'M14 92 Q-1 76 14 59 Q10 39 35 32 Q40 7 67 16 Q85 -1 107 16 Q132 6 147 25 Q179 26 176 57 Q194 79 176 98 Q171 119 144 116 Q131 136 110 124 Q89 140 72 123 Q42 134 36 115 Q13 119 14 92Z','#d6c0a0',[6,6,180,129],650,'#aa858e');
 path(g,'M30 73 Q25 55 45 51 M61 31 Q76 20 88 35 M112 24 Q131 23 138 40 M156 53 Q170 65 155 77 M47 102 Q63 111 76 101 M112 112 Q129 109 133 98',null,'#aa8a8f',.8);
 texture(g,new Path2D('M22 77Q80 105 160 70L166 105Q98 144 34 111Z'),[22,70,145,60],'#967994',220);
},1.3);
make('butterfly',38,30,g=>{path(g,'M19 16 Q2 -4 4 15 Q3 30 18 20Z','#d7b2cb','#76617e',.7);path(g,'M20 16 Q37 -4 35 15 Q36 29 21 20Z','#c4b1dc','#76617e',.7);line(g,[[19,11],[20,24]],'#71617e',1);});
function bridge(g,x,y){g.save();g.translate(x,y);g.rotate(-.035);path(g,'M-158 11 L153 11 170 40 -139 40Z','#b29c89','#594d65',.9);for(let i=0;i<17;i++){let xx=-153+i*18;block(g,xx,16,17,10,0,i%3?'#c9ae86':'#dec49a','#dcc29c','#b49d82');line(g,[[xx+4,-47],[xx+6,5]],'#a58c78',.7);pencil(g,`M${xx} -47L${xx+17} -47 ${xx+17} 8 ${xx} 8Z`,i%3?'#d7bd93':'#cbb18c',[xx,-47,18,55],22,'#947880');}
for(let side of [-44,12]){for(let i=0;i<6;i++){let xx=-145+i*57;block(g,xx,side+5,8,49,4,'#b29876','#e1c59a','#927a68');}pencil(g,`M-145 ${side-39}L150 ${side-39} 150 ${side-31} -145 ${side-31}Z`,'#cfb385',[-145,side-40,295,10],90,'#9b7b6e');line(g,[[-145,side-14],[150,side-14]],'#ad9070',4);}g.restore();}
// Neutral paper field with soft sage, ochre and lilac colored-pencil patches.
function tile(){let c=canvas(768,768),g=c.getContext('2d');g.fillStyle='#e6e1cf';g.fillRect(0,0,768,768);seed=3828;for(let i=0;i<470;i++){let x=rng()*768,y=rng()*768,rx=15+rng()*100,ry=10+rng()*50,color=['#c3ccb8','#d4c6ad','#c8c5d1','#d8d5bf','#b8c9be'][i%5];g.globalAlpha=.13;for(let xx of [-768,0,768])for(let yy of [-768,0,768])ellipse(g,x+xx,y+yy,rx,ry,color,null);}g.globalAlpha=1;for(let i=0;i<65000;i++){let x=rng()*768,y=rng()*768;g.fillStyle=i%2?'#453c4c09':'#fffbe92b';g.fillRect(x,y,1+rng(),.5+rng());}for(let i=0;i<700;i++){let x=rng()*768,y=rng()*768;line(g,[[x-2,y],[x-4,y-4],[x,y],[x+2,y-5]],'#7c8d7c3d',.55);}return c;}
const ground=tile();
function river(g,t){g.save();let p=path(g,'M-1200 -1000 L-650 -1000 Q-550 -450 -640 -250 Q-800 -50 -600 150 Q-400 360 -620 600 L-550 1300 -1300 1300Z','#a7b7d2','#778fab',1);g.clip(p);seed=182;for(let i=0;i<290;i++){let x=-1200+rng()*750,y=-1000+rng()*2300,w=8+rng()*30;g.globalAlpha=.23;ellipse(g,x,y,w,4,'#dce4e8',null);g.globalAlpha=.6;line(g,[[x+Math.sin(t*.6+i)*3,y],[x+w*.6,y+1],[x+w,y-1]],'#edeada',.8);}g.globalAlpha=1;for(let i=0;i<18;i++){let x=-1030+(i*71)%380,y=-600+(i*137)%1400;ellipse(g,x,y,12,5,'#b1bd9a','#81947f',.65);line(g,[[x,y],[x+9,y-3]],'#7f8c72',.6);}g.restore();bridge(g,-665,-180);}
function platform(g,x,y,w=440,h=290){g.save();g.translate(x,y);let d=15;pencil(g,`M${-w/2} ${-h/2}L${w/2} ${-h/2} ${w/2} ${h/2} ${-w/2} ${h/2}Z`,'#cbc8c5',[-w/2,-h/2,w,h],850,'#97919e');path(g,`M${-w/2} ${h/2}L${w/2} ${h/2} ${w/2+d} ${h/2+10} ${-w/2+d} ${h/2+10}Z`,'#aaa4b2','#81788d',1.3);path(g,`M${w/2} ${-h/2}L${w/2+d} ${-h/2+10} ${w/2+d} ${h/2+10} ${w/2} ${h/2}Z`,'#b4adbc','#81788d',1);for(let xx=-w/2;xx<w/2;xx+=55)line(g,[[xx,-h/2],[xx,h/2]],'#9a92a477',.8);for(let yy=-h/2;yy<h/2;yy+=48)line(g,[[-w/2,yy],[w/2,yy]],'#9a92a477',.8);line(g,[[-w/2+8,-h/2+8],[w/2-8,-h/2+8],[w/2-8,h/2-8],[-w/2+8,h/2-8],[-w/2+8,-h/2+8]],'#e3ddd6',2);g.restore();}
function image(g,name,x,y,s=1,flip=1,angle=0,alpha=1){let a=sprites[name];if(!a)return;g.save();g.translate(x,y);g.rotate(angle);g.scale(flip*s,s);g.globalAlpha=alpha;g.drawImage(a.img,-a.w/2,-a.h,a.w,a.h);g.restore();}
function shadow(g,x,y,w,h=14,long=false){g.save();g.translate(x,y);g.fillStyle='#49445626';if(long){g.transform(1,0,-.65,.34,0,0);ellipse(g,0,-h*.5,w,h,null,null);g.fill();}else ellipse(g,3,2,w,h,'#49445624',null);g.restore();}
function url(name){return sprites[name]?.img.toDataURL()||'';}
return {sprites,image,shadow,line,path,ellipse,texture,pencil,ground,river,platform,url,ink,paper,make,hash,canvas};
})();
