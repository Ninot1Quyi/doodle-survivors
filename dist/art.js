'use strict';
// Original, procedurally drawn artwork. Every silhouette, pencil mark and texture is Canvas.
const Art=(()=>{
const TAU=Math.PI*2,ink='#3c3347',paper='#fff8e7',sprites={},frames={};let seed=47;
function rng(){seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;}
function canvas(w,h){let c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function path(g,d,fill,stroke=ink,lw=1.05){let p=new Path2D(d);if(fill){g.fillStyle=fill;g.fill(p);}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke(p);}return p;}
function line(g,pts,color=ink,lw=.8){g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.lineWidth=lw;g.strokeStyle=color;g.lineCap='round';g.lineJoin='round';g.stroke();}
function ellipse(g,x,y,rx,ry,fill,stroke=ink,lw=.9){g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke();}}
function texture(g,p,bounds,color='#5a4565',count=100){g.save();g.clip(p);g.strokeStyle=color;g.globalAlpha=.20;g.lineWidth=.45;for(let i=0;i<count;i++){let x=bounds[0]+rng()*bounds[2],y=bounds[1]+rng()*bounds[3],len=2+rng()*9;g.beginPath();g.moveTo(x,y);g.lineTo(x+len*.65,y-len);g.stroke();}g.globalAlpha=.08;for(let i=0;i<count/4;i++){let x=bounds[0]+rng()*bounds[2],y=bounds[1]+rng()*bounds[3];ellipse(g,x,y,4+rng()*13,3+rng()*8,color,null);}g.restore();}
function pencil(g,d,fill,bounds,count=80,shade='#594967'){let p=path(g,d,fill,ink,1.1);texture(g,p,bounds,shade,count);g.save();g.translate(.7,-.4);g.globalAlpha=.26;path(g,d,null,ink,.55);g.restore();return p;}
function make(name,w,h,draw,border=1.5){seed=hash(name);let c=canvas(w*2,h*2),g=c.getContext('2d');g.scale(2,2);g.lineCap='round';g.lineJoin='round';draw(g);let mask=canvas(w*2,h*2),m=mask.getContext('2d');m.drawImage(c,0,0);m.globalCompositeOperation='source-in';m.fillStyle=paper;m.fillRect(0,0,mask.width,mask.height);let out=canvas(w*2,h*2),o=out.getContext('2d');for(let a=0;a<TAU;a+=Math.PI/4)o.drawImage(mask,Math.cos(a)*border*2,Math.sin(a)*border*2);o.drawImage(c,0,0);sprites[name]={img:out,w,h};return sprites[name];}
function hash(str){let h=2166136261;for(let c of str)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function hero(g,f){let t=f/8*TAU,s=Math.sin(t),c=Math.cos(t),step=s*3.5;
 // Fluttering scarf and asymmetric coat, each foot has its own stride.
 pencil(g,`M35 41 Q17 ${43+s*5} 8 ${35+c*3} L13 49 Q26 57 37 51 Z`,'#b99aca',[7,35,33,24],38);
 pencil(g,`M28 69 L26 ${80+step} Q20 ${83+step} 21 ${85+step} L34 ${85+step} L37 70Z`,'#6c5969',[20,68,18,20],28);
 pencil(g,`M43 69 L43 ${81-step} L55 ${83-step} L56 ${87-step} L42 ${87-step} L37 71Z`,'#80616b',[36,69,20,20],28);
 pencil(g,'M27 40 Q36 34 47 40 L49 51 53 68 43 74 37 70 28 75 22 69 25 53Z','#f1dd9d',[21,36,33,39],110,'#a78b62');
 path(g,'M27 43 Q34 49 46 44 L47 48 Q36 55 26 48Z','#d6b471');line(g,[[34,48],[33,66]],'#9a785e');line(g,[[41,50],[45,66]],'#b59770');line(g,[[27,68],[33,69]],'#9e815d');ellipse(g,38,55,2,2,'#8c6e60');ellipse(g,39,61,1.5,1.5,'#8c6e60');
 pencil(g,`M26 46 Q17 47 ${15-s} ${56+s} L20 ${61+s} Q25 58 30 52Z`,'#e6d198',[14,44,18,19],25);ellipse(g,18-s,58+s,4,4,'#efd8bd');
 pencil(g,`M47 45 Q53 46 ${57+s} ${51-s} L55 ${60-s} L45 53Z`,'#e6d198',[44,44,18,18],25);ellipse(g,56+s,54-s,4,4,'#efd8bd');
 // Face, tousled pale hair, ink eyes, oversized brim.
 pencil(g,'M24 23 Q25 13 38 13 Q52 15 53 29 L49 41 Q42 49 31 41 L25 35Z','#f4dfc5',[23,14,31,31],42,'#c29a83');
 path(g,'M23 28 Q21 19 31 17 Q41 11 51 20 L54 29 50 27 47 32 44 23 40 29 36 22 31 30 30 24 26 32Z','#eee9d9');
 ellipse(g,33,33,1.6,2.1,'#332c3d',null);ellipse(g,44,32,1.6,2.1,'#332c3d',null);line(g,[[36,39],[40,40],[43,38]],'#956c61',.85);ellipse(g,29,37,2,1,'#e4b4a0',null);ellipse(g,47,36,2,1,'#e4b4a0',null);
 pencil(g,`M17 21 Q26 14 27 9 L33 2 45 5 49 13 Q56 16 63 22 L59 28 Q44 31 31 27 L13 29 9 25Z`,'#b6a6c6',[9,2,55,28],110,'#5c486e');
 path(g,'M27 15 Q36 19 49 16 L52 20 Q39 23 25 20Z','#eed49c');line(g,[[17,25],[31,24],[44,27],[58,25]],'#5a4669',.8);line(g,[[34,5],[32,12],[37,15]],'#756382',.65);ellipse(g,40,18,2,1.5,'#bd9a5d');
 // Large yellow pencil staff.
 g.save();g.translate(58+s,56-s);g.rotate(.18+s*.025);pencil(g,'M-3 7 L-3 -29 3 -29 3 7Z','#edc45d',[-3,-29,6,36],24,'#ac7738');path(g,'M-3 -29 L0 -38 3 -29Z','#dfbd97');path(g,'M-1 -35 L0 -38 1 -35Z',ink);path(g,'M-3 7 L3 7 3 12 -3 12Z','#d791a4');line(g,[[0,-27],[0,5]],'#fff0aa',.8);g.restore();
 path(g,'M17 58 L24 59 23 68 16 66Z','#b68d7f');line(g,[[18,60],[22,61]],'#f6e1c4');
}
for(let f=0;f<8;f++)make('hero'+f,76,96,g=>hero(g,f),1.6);sprites.hero=sprites.hero0;
for(let f=0;f<8;f++){
 let s=Math.sin(f/8*TAU),c=Math.cos(f/8*TAU);
 make('imp'+f,58,62,g=>{
 pencil(g,`M17 43 L${10+s*2} ${54-s} 24 54 28 47Z`,'#8a675c',[10,42,18,14],18);pencil(g,`M35 43 L36 ${54+s} 48 ${54+s} 43 45Z`,'#a07860',[34,43,15,13],18);
 pencil(g,`M15 28 Q6 32 8 ${44+s} L18 47 21 36Z`,'#765390',[7,27,17,21],28);pencil(g,`M39 28 Q50 32 51 ${43-s} L43 47 37 37Z`,'#795491',[38,27,16,21],28);
 pencil(g,`M15 25 L19 15 32 5 Q33 15 43 18 L46 28 42 42 46 49 36 47 29 51 23 47 13 49 16 38Z`,'#9770af',[12,5,36,46],140,'#503954');
 path(g,'M19 28 Q26 19 38 26 L40 34 Q30 40 19 34Z','#493a51');ellipse(g,25,29,2,2.8,'#edda9b',null);ellipse(g,34,29,2,2.8,'#edda9b',null);line(g,[[23,41],[29,43],[36,40]],'#c6a2cf',1);line(g,[[32,8],[28,17],[35,20]],'#563b68',.75);line(g,[[21,37],[19,44]],'#5d426e',.7);
 },1.5);
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
return {sprites,image,shadow,line,path,ellipse,texture,pencil,ground,river,platform,url,ink,paper};
})();
