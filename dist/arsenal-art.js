'use strict';
// Expanded stationery arsenal. Original Canvas drawings; shared pencil/wax pigments.
// Load after art.js and before paper.js so both editions receive identical silhouettes.
(()=>{
 const {make,pencil,path,line,ellipse}=Art;
 const C={ink:'#4a3c52',gold:'#e8bb65',rose:'#d995a9',blue:'#9ebed1',mint:'#a7bba0',lilac:'#b6a1c9',cream:'#f8e8bf',steel:'#bac7ce',dark:'#786682',red:'#c77678',wood:'#ba9273'};
 const P=(g,d,c,count=80)=>pencil(g,d,c,[3,3,74,74],count,'#705570');
 const L=(g,p,c=C.ink,w=1.3)=>line(g,p,c,w);
 const E=(g,x,y,rx,ry,c,stroke=C.ink,w=1.2)=>ellipse(g,x,y,rx,ry,c,stroke,w);
 function star(g,x,y,r,c=C.gold,n=5){const pts=[];for(let i=0;i<n*2;i++){const a=-Math.PI/2+i*Math.PI/n,rr=i%2?r*.44:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}P(g,'M'+pts.map(p=>p.join(' ')).join(' L')+'Z',c,24);}
 function gear(g,x,y,r,c=C.gold){const pts=[];for(let i=0;i<40;i++){const a=i*Math.PI/20,rr=i%4<2?r:r*.78;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}P(g,'M'+pts.map(p=>p.join(' ')).join(' L')+'Z',c,80);E(g,x,y,r*.48,r*.48,C.cream);E(g,x,y,r*.18,r*.18,C.dark);}
 function leaf(g,x,y,s=1,c=C.mint){g.save();g.translate(x,y);g.scale(s,s);P(g,'M0 15 Q-17 4 -10 -12 Q3 -13 14 -24 Q21 -5 0 15Z',c,46);L(g,[[0,16],[3,-8],[13,-23]],'#677d6d');L(g,[[1,5],[-6,-2],[3,-4],[9,-4]],'#83947d',.8);g.restore();}
 function sword(g,x,y,a=0,s=1){g.save();g.translate(x,y);g.rotate(a);g.scale(s,s);P(g,'M-5 10 L-7 -24 0 -38 7 -24 5 10Z',C.steel);path(g,'M0 -34 L0 8 5 8 6 -23Z','#e9e5d9',null);P(g,'M-17 8 Q0 14 17 8 L15 17 4 15 4 33 -4 33 -4 15 -15 17Z',C.gold,50);L(g,[[-3,20],[3,22],[-3,25],[3,27]],'#99765e');E(g,0,35,5,4,C.rose);g.restore();}
 function rocket(g,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);P(g,'M-10 10 L-17 22 -17 4 -9 -7 9 -7 17 4 17 22 10 10Z',C.red);P(g,'M-9 17 Q-18 -10 0 -29 Q18 -10 9 17Z',C.cream);P(g,'M-10 -8 Q-8 -20 0 -29 Q8 -20 10 -8Z',C.rose);E(g,0,1,6,7,C.blue);P(g,'M-7 18 L-5 31 0 25 5 34 8 18Z',C.gold,24);g.restore();}
 function bottle(g,x,y,c=C.blue){g.save();g.translate(x,y);P(g,'M-7 -21 L7 -21 7 -11 Q19 -6 17 14 L13 22 -13 22 -17 14 Q-19 -6 -7 -11Z',c);P(g,'M-10 -28 L10 -28 10 -19 -10 -19Z',C.wood,20);path(g,'M-10 -1 Q-3 -5 12 -2 L12 13 -10 13Z',C.cream);star(g,1,6,7,C.gold);L(g,[[-11,-6],[-13,3]],'#fff8e8',2);g.restore();}
 function fox(g,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);P(g,'M-17 6 L-22 -20 -5 -10 12 -14 24 -25 22 7 6 20 -6 19Z',C.rose);P(g,'M-17 0 L-3 8 18 -1 7 17 -3 18Z',C.cream,24);E(g,-10,-2,1.7,2.2,C.dark,null);E(g,12,-5,1.7,2.2,C.dark,null);E(g,2,13,3,2,C.dark,null);g.restore();}
 function bell(g,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);E(g,0,-22,4,4,C.gold);P(g,'M-16 10 Q-12 3 -12 -8 Q-11 -20 0 -20 Q12 -19 12 -8 Q12 3 17 10 L20 14 -20 14Z',C.gold);L(g,[[-10,8],[11,8]],'#b68953');E(g,0,16,5,4,C.wood);g.restore();}
 function shield(g,x,y,s=1,c=C.blue){g.save();g.translate(x,y);g.scale(s,s);P(g,'M-23 -24 Q0 -15 23 -24 L20 8 Q15 22 0 29 Q-15 22 -20 8Z',c,100);P(g,'M-16 -14 Q0 -8 16 -14 L13 7 Q8 17 0 21 Q-8 17 -13 7Z',C.cream,40);star(g,0,2,10,C.gold);g.restore();}
 const icons={
 saber(g){sword(g,39,43,.65,.89);star(g,17,17,5,C.rose);},
 lance(g){P(g,'M17 65 L56 17 61 21 22 70Z',C.wood);P(g,'M46 22 L69 6 64 34 56 24Z',C.steel);L(g,[[56,24],[67,10]],'#f8f0d9',2);P(g,'M46 28 L38 30 37 46 47 39 55 41 57 30Z',C.rose);},
 marble(g){E(g,40,42,25,25,C.blue);path(g,'M19 32 Q40 43 58 21 Q64 43 40 50 Q21 56 25 63 Q12 52 19 32Z',C.rose);path(g,'M31 19 Q40 38 60 44 L62 52 Q41 44 27 24Z',C.gold);E(g,30,29,7,4,'#fff7e7',null);},
 yoyo(g){path(g,'M45 8 Q10 3 19 24 Q28 36 41 22 Q51 11 55 30 Q59 40 45 44',null,C.dark,1.8);E(g,40,52,24,17,C.rose);E(g,37,49,21,16,C.gold);E(g,37,49,14,11,C.cream);star(g,37,49,8,C.rose);},
 rocket(g){g.save();g.translate(40,40);g.rotate(.5);rocket(g,0,0,.95);g.restore();},
 firecracker(g){L(g,[[30,14],[33,5],[45,6],[48,13]],C.wood,2);star(g,49,13,8,C.gold);for(let i=0;i<3;i++){const x=19+i*14,y=25+i%2*12;P(g,`M${x} ${y} L${x+12} ${y-3} ${x+17} ${y+28} ${x+4} ${y+32}Z`,i%2?C.gold:C.red,35);L(g,[[x+2,y+4],[x+14,y+1],[x+5,y+25],[x+16,y+22]],C.cream,2);} },
 ruler(g){g.save();g.translate(40,40);g.rotate(.65);P(g,'M-13 -32 L13 -32 13 32 -13 32Z',C.gold);for(let i=0;i<10;i++){const y=-26+i*6;L(g,[[-12,y],[i%2?-4:2,y]],'#816149',1.3);}E(g,7,-25,2,2,C.cream);g.restore();},
 prism(g){P(g,'M40 8 L69 64 12 64Z',C.blue);P(g,'M40 8 L41 54 12 64Z','#bfd5dd');path(g,'M41 54 L69 64 40 8Z','#b3a4cd',C.ink);L(g,[[4,39],[32,39]],C.cream,5);for(let i=0;i<3;i++)L(g,[[49,39],[75,31+i*10]],[C.rose,C.gold,C.mint][i],4);},
 turret(g){gear(g,40,59,18,C.wood);P(g,'M23 37 L53 37 56 60 22 60Z',C.blue);P(g,'M35 34 L45 17 70 18 70 30 47 31 43 40Z',C.steel);E(g,68,24,4,7,C.dark);E(g,38,47,7,7,C.gold);P(g,'M23 64 L17 71 60 71 56 64Z',C.wood,25);},
 foxspirit(g){P(g,'M39 62 Q72 52 63 16 Q81 38 64 63 Q54 77 30 70Z',C.cream);fox(g,35,39,.96);star(g,58,14,6,C.gold);},
 mine(g){E(g,40,53,29,16,C.wood);E(g,40,47,28,15,C.lilac);P(g,'M28 42 L30 23 49 23 52 42Z',C.rose);E(g,40,25,10,6,C.gold);for(let i=0;i<5;i++)E(g,17+i*11,51+Math.sin(i)*5,2,2,C.gold);L(g,[[40,18],[40,9]],C.dark);},
 stamp(g){P(g,'M15 51 L65 51 68 66 12 66Z',C.wood);P(g,'M25 42 L55 42 61 54 18 54Z',C.rose);P(g,'M31 42 L34 26 Q22 20 29 10 Q39 1 51 10 Q58 22 46 26 L49 42Z',C.gold);L(g,[[19,62],[61,62]],C.dark,2);},
 whip(g){P(g,'M13 63 L23 68 37 43 28 38Z',C.wood,35);path(g,'M32 39 C5 15 39 2 58 14 C79 28 54 47 43 29 C34 13 65 14 69 41 Q74 63 57 69',null,C.ink,5);path(g,'M32 39 C5 15 39 2 58 14 C79 28 54 47 43 29 C34 13 65 14 69 41 Q74 63 57 69',null,C.gold,2.7);},
 thread(g){P(g,'M23 20 L53 20 55 61 20 61Z',C.rose);E(g,38,21,22,8,C.wood);E(g,38,60,22,8,C.wood);for(let i=0;i<7;i++)L(g,[[23,28+i*4],[53,25+i*4]],'#edbac7',2);path(g,'M56 49 Q79 41 67 29 Q59 24 72 9',null,C.rose,2);E(g,39,19,5,2,C.dark);},
 roller(g){P(g,'M28 51 L39 52 41 73 27 73Z',C.wood);L(g,[[33,51],[33,40],[64,40],[64,25],[54,25]],C.dark,4);P(g,'M10 10 Q33 5 58 11 L58 31 Q34 37 10 31Z',C.blue,95);E(g,11,21,5,10,C.lilac);L(g,[[18,13],[49,13]],'#d9e9e7',2);},
 chalk(g){P(g,'M13 58 L55 13 66 22 24 69Z',C.cream);P(g,'M13 58 L16 67 24 69 25 61Z',C.rose,25);L(g,[[24,56],[58,21]],'#fffdfa',3);for(let i=0;i<5;i++)E(g,12+i*8,74-i%2*3,1.7,1,C.cream,C.wood,.6);},
 camera(g){P(g,'M10 25 L25 25 29 16 48 16 54 25 69 25 70 64 10 64Z',C.lilac,110);P(g,'M15 19 L25 19 25 25 15 25Z',C.gold,20);E(g,40,45,18,18,C.dark);E(g,40,45,13,13,C.blue);E(g,37,41,6,6,C.cream);P(g,'M58 29 L65 29 65 36 58 36Z',C.gold,20);},
 music(g){P(g,'M27 15 L62 7 62 50 55 53 55 23 34 28 34 59 27 62Z',C.lilac);E(g,23,60,12,8,C.rose);E(g,52,51,12,8,C.gold);L(g,[[33,20],[55,14]],C.cream,2);},
 meteor(g){P(g,'M8 59 L11 29 27 37 43 6 46 30 71 11 63 47 43 70Z',C.gold,100);P(g,'M17 57 L27 34 35 45 57 26 51 55 38 68Z',C.rose,70);P(g,'M14 53 L23 43 40 47 48 59 37 71 22 70Z',C.lilac,70);E(g,25,57,4,3,C.dark);L(g,[[35,51],[41,58]],C.cream,2);},
 compass(g){E(g,40,42,29,29,C.gold);E(g,40,42,23,23,C.cream);P(g,'M40 17 L47 41 40 66 33 41Z',C.rose,40);path(g,'M40 17 L40 66 33 41Z',C.blue);E(g,40,42,4,4,C.wood);for(let i=0;i<4;i++){const a=i*Math.PI/2;L(g,[[40+Math.cos(a)*22,42+Math.sin(a)*22],[40+Math.cos(a)*18,42+Math.sin(a)*18]],C.dark);}E(g,40,10,5,5,null);},
 magnetArm(g){gear(g,25,59,14,C.wood);P(g,'M25 54 L36 32 45 37 35 62Z',C.steel);P(g,'M36 31 L48 14 55 21 46 40Z',C.gold);P(g,'M46 12 L51 5 67 18 62 25 55 19 51 24 60 31 55 38 40 25Z',C.rose);L(g,[[64,9],[72,6],[68,34],[75,36]],C.gold,2);},
 gear(g){gear(g,40,41,31,C.gold);L(g,[[40,23],[40,33],[40,49],[40,59],[22,41],[32,41],[48,41],[58,41]],C.wood,3);},
 umbrella(g){P(g,'M8 39 Q17 6 40 9 Q65 8 72 39 Q61 29 51 39 Q40 29 29 39 Q17 29 8 39Z',C.blue);path(g,'M40 9 L40 66 Q39 77 29 69',null,C.wood,3);},
 kite(g){P(g,'M37 6 L65 29 44 54 14 32Z',C.gold);path(g,'M37 6 L39 31 14 32Z',C.rose);path(g,'M39 31 L65 29 44 54Z',C.blue);L(g,[[37,6],[44,54],[14,32],[65,29]],C.wood);path(g,'M44 54 Q65 63 42 66 Q25 74 55 75',null,C.dark,1.4);P(g,'M37 61 L45 65 50 59 49 70 44 66 39 70Z',C.rose,20);},
 leaf(g){leaf(g,39,49,1.6);L(g,[[39,72],[40,58]],C.wood,3);},
 shield(g){shield(g,40,39,1.08);},
 portal(g){E(g,40,41,26,33,C.lilac);E(g,40,41,19,26,C.dark);path(g,'M33 23 Q58 21 53 45 Q48 62 33 53 Q19 43 39 33 Q49 34 43 43',null,C.blue,3);star(g,20,15,8,C.gold);star(g,61,63,7,C.rose);},
 void(g){for(let i=0;i<3;i++){g.save();g.translate(40,40);g.rotate(i*Math.PI/3);E(g,0,0,33,13,null,i%2?C.rose:C.lilac,3);g.restore();}E(g,40,40,18,18,C.dark);E(g,40,40,10,10,'#473b60');star(g,58,16,7,C.gold);}
 };
 for(const [name,draw]of Object.entries(icons)){if(name==='umbrella'&&Art.sprites.umbrella)continue;make(name,80,80,draw,2);}
 const evos={
 paladin(g){sword(g,26,37,-.47,.85);sword(g,56,37,.47,.85);shield(g,40,44,.86,C.gold);P(g,'M26 16 L22 6 34 10 40 3 46 10 58 6 54 16Z',C.gold,30);},
 pinball(g){P(g,'M19 7 L60 7 72 72 6 72Z',C.lilac,100);P(g,'M25 13 L55 13 63 63 15 63Z',C.cream,80);E(g,29,31,7,7,C.rose);E(g,49,40,8,8,C.blue);E(g,43,23,5,5,C.gold);P(g,'M21 52 L37 58 34 63 18 59Z',C.red,20);P(g,'M57 52 L42 58 45 63 61 59Z',C.red,20);E(g,38,44,5,5,C.steel);},
 festival(g){P(g,'M13 39 L62 39 66 67 9 67Z',C.rose);for(let i=0;i<3;i++){g.save();g.translate(25+i*15,29);g.rotate((i-1)*.5);rocket(g,0,0,.47);g.restore();}L(g,[[14,49],[62,49]],C.gold,5);star(g,38,55,8,C.cream);},
 rainbowLaser(g){P(g,'M10 48 L38 26 51 41 26 66Z',C.steel);P(g,'M36 26 L45 13 62 31 51 42Z',C.blue);E(g,51,27,9,13,C.cream);for(let i=0;i<4;i++)L(g,[[53,22],[66+i*3,5+i*6]],[C.rose,C.gold,C.mint,C.lilac][i],4);gear(g,24,52,10,C.gold);},
 clockwork(g){gear(g,40,43,30,C.gold);E(g,40,43,19,19,C.cream);L(g,[[40,28],[40,43],[51,49]],C.dark,2.5);P(g,'M15 17 L7 10 11 4 24 14Z',C.blue,20);P(g,'M61 19 L73 9 69 4 55 14Z',C.rose,20);P(g,'M22 65 L17 74 25 74 31 66 52 66 58 74 65 73 60 63Z',C.wood,40);},
 printingPress(g){P(g,'M9 13 L20 13 20 62 61 62 61 13 71 13 71 73 9 73Z',C.wood,110);P(g,'M5 10 L75 10 75 20 5 20Z',C.gold,35);L(g,[[40,20],[40,42]],C.dark,6);for(let i=0;i<4;i++)L(g,[[35,24+i*4],[45,22+i*4]],C.cream,1);P(g,'M23 40 L57 40 61 49 19 49Z',C.rose);P(g,'M24 55 L57 55 64 67 17 67Z',C.cream);star(g,40,61,7,C.blue);},
 loom(g){P(g,'M9 7 L18 7 18 71 9 71Z',C.wood);P(g,'M61 7 L70 7 70 71 61 71Z',C.wood);P(g,'M9 10 L70 10 70 19 9 19Z',C.gold);P(g,'M9 61 L70 61 70 70 9 70Z',C.gold);for(let i=0;i<8;i++)L(g,[[22+i*5,18],[22+i*5,62]],C.cream,1.4);for(let i=0;i<7;i++)L(g,[[20,27+i*4],[59,27+i*4]],[C.rose,C.blue,C.lilac][i%3],3);P(g,'M14 39 L56 26 67 31 24 45Z',C.wood,30);},
 livingMural(g){P(g,'M8 12 L69 8 72 65 11 70Z',C.cream,100);P(g,'M16 59 Q29 30 40 49 Q56 25 65 58 L65 62 16 65Z',C.mint);E(g,26,28,9,9,C.gold);P(g,'M30 64 L42 36 58 62Z',C.lilac);g.save();g.translate(62,40);g.rotate(.25);P(g,'M-4 12 L4 12 4 34 -4 34Z',C.wood);P(g,'M-8 -11 L8 -11 8 13 -8 13Z',C.blue);g.restore();},
 spotlight(g){P(g,'M17 11 L65 28 55 54 8 36Z',C.dark);E(g,58,40,10,15,C.gold);P(g,'M66 29 L77 21 77 65 63 53Z',C.cream,55);L(g,[[31,46],[31,62],[18,73],[31,62],[45,73]],C.wood,4);E(g,31,42,8,8,C.rose);star(g,71,44,5,C.gold);},
 orrery(g){P(g,'M35 51 L45 51 47 68 60 72 19 72 33 67Z',C.wood);E(g,40,36,31,13,null,C.gold,2);g.save();g.translate(40,36);g.rotate(-.6);E(g,0,0,30,15,null,C.lilac,2);g.restore();E(g,40,36,12,12,C.gold);E(g,14,29,7,7,C.blue);E(g,66,37,8,8,C.rose);E(g,53,13,5,5,C.mint);star(g,24,10,5,C.cream);},
 scrapColossus(g){P(g,'M22 29 L56 29 61 59 19 59Z',C.steel,100);P(g,'M25 8 L54 8 58 29 22 29Z',C.gold);E(g,32,20,4,5,C.blue);E(g,47,20,4,5,C.rose);gear(g,40,44,10,C.wood);P(g,'M18 31 L7 33 4 54 14 58 23 40Z',C.rose);P(g,'M61 30 L72 35 75 54 64 58 57 42Z',C.blue);P(g,'M22 59 L19 72 34 72 36 59 44 59 47 72 62 72 58 59Z',C.wood);},
 skyWhale(g){P(g,'M7 36 Q12 15 39 20 Q57 23 61 39 L74 28 74 53 61 47 Q48 70 23 61 Q9 55 7 36Z',C.blue,150);P(g,'M10 43 Q33 55 59 44 Q46 64 25 58 Q14 55 10 43Z',C.cream,60);P(g,'M35 38 Q53 35 47 55 L38 49Z',C.lilac,30);E(g,20,34,2,3,C.dark,null);path(g,'M29 20 Q23 9 30 7 Q38 4 35 20 M35 20 Q38 7 44 12',null,C.blue,3);star(g,60,13,7,C.gold);},
 autumnGuardian(g){shield(g,40,44,.95,C.wood);leaf(g,19,29,.85,C.gold);leaf(g,60,30,.85,C.rose);leaf(g,41,19,.8,C.red);L(g,[[17,57],[8,68],[63,57],[73,68]],C.wood,4);star(g,40,47,10,C.gold);},
 paperCosmos(g){g.save();g.translate(40,40);g.rotate(-.4);E(g,0,0,35,13,null,C.gold,3);g.restore();E(g,40,40,23,25,C.lilac);P(g,'M23 24 L38 18 39 32 56 39 46 47 43 61 28 52 31 38 19 37Z',C.blue,70);E(g,61,16,8,8,C.rose);star(g,15,62,8,C.gold);star(g,65,65,6,C.cream);L(g,[[21,10],[25,10],[23,8],[23,12]],C.gold,2);}
 };
 for(const [name,draw]of Object.entries(evos))make(name,96,96,g=>{g.scale(1.2,1.2);draw(g);},2.2);
 const pickups={
 bomb(g){P(g,'M45 25 L49 16 59 19 55 30Z',C.wood,25);path(g,'M54 19 Q53 6 65 10',null,C.wood,2);star(g,66,10,7,C.gold);E(g,35,48,25,25,C.dark);E(g,26,38,7,4,C.lilac,null);P(g,'M23 52 L34 45 47 54 36 63Z',C.rose,25);},
 phoenix(g){P(g,'M37 62 Q4 53 6 18 L22 31 18 9 36 31 45 22 59 9 56 30 73 19 Q69 51 47 60 L49 73 39 67 28 74Z',C.rose,150);P(g,'M25 38 L38 49 40 30 51 34 45 52 39 62Z',C.gold,60);E(g,45,31,2,2,C.dark,null);P(g,'M48 34 L57 37 49 40Z',C.gold,15);},
 pocketwatch(g){E(g,40,12,8,8,null,C.wood,2.2);P(g,'M33 14 L47 14 47 21 33 21Z',C.gold,20);E(g,40,47,27,27,C.gold);E(g,40,47,21,21,C.cream);L(g,[[40,31],[40,47],[52,53]],C.dark,2.3);for(let i=0;i<4;i++){const a=i*Math.PI/2;E(g,40+Math.cos(a)*17,47+Math.sin(a)*17,1.5,1.5,C.wood,null);}},
 mirrorShard(g){P(g,'M21 10 L56 8 69 34 50 65 28 73 9 44Z',C.lilac);P(g,'M25 17 L51 15 61 34 45 58 29 65 17 42Z',C.blue);L(g,[[22,39],[45,19],[30,51],[54,30]],C.cream,3);L(g,[[50,62],[39,46],[43,32]],C.dark,.9);},
 eraser(g){P(g,'M9 42 L49 13 72 37 31 68Z',C.rose);P(g,'M9 42 L31 68 31 74 9 48Z',C.red);P(g,'M31 68 L72 37 72 44 31 74Z',C.dark,30);P(g,'M27 29 L49 13 72 37 50 53Z',C.blue);L(g,[[14,43],[32,62]],C.cream,2);},
 lanternGuide(g){path(g,'M29 19 Q26 3 41 4 Q54 5 52 19',null,C.wood,2.5);P(g,'M22 18 L58 18 64 26 16 26Z',C.dark);P(g,'M21 26 L59 26 62 60 53 69 27 69 18 60Z',C.gold,95);P(g,'M28 30 L51 30 51 60 28 60Z',C.cream,35);path(g,'M40 58 Q27 49 39 34 Q54 49 40 58Z',C.rose);L(g,[[21,61],[59,61]],C.wood,3);},
 seedPacket(g){P(g,'M17 11 L62 14 61 70 15 67Z',C.cream);P(g,'M17 11 L62 14 54 25 23 22Z',C.wood,40);P(g,'M22 31 L55 33 54 59 21 57Z',C.mint,45);L(g,[[38,57],[39,42]],'#74876b',2);leaf(g,35,44,.42,C.mint);leaf(g,44,42,.4,C.gold);E(g,36,63,3,2,C.wood);E(g,46,64,3,2,C.wood);},
 decoy(g){P(g,'M34 50 L43 50 45 74 31 74Z',C.wood);P(g,'M17 29 L9 43 21 49 26 40 26 60 54 60 54 40 62 49 71 42 62 29Z',C.blue);E(g,40,22,15,15,C.cream);P(g,'M19 14 L30 6 49 8 61 17 18 19Z',C.gold);L(g,[[30,21],[35,25],[35,21],[30,25],[45,21],[50,25],[50,21],[45,25]],C.dark,1.5);L(g,[[32,31],[48,31]],C.rose,1.5);},
 sugarCube(g){P(g,'M13 28 L40 11 66 26 66 56 40 73 13 57Z',C.cream,180);path(g,'M13 28 L40 44 66 26 M40 44 L40 73',null,'#ad99aa',1.3);for(let i=0;i<11;i++){const x=19+(i*13)%39,y=31+(i*7)%26;E(g,x,y,.8,.8,'#c6b7c4',null);}star(g,67,11,5,C.gold);},
 moonCheese(g){P(g,'M15 49 Q16 16 50 10 L68 41 15 64Z',C.gold,110);P(g,'M15 49 L68 28 68 47 15 68Z','#f0d187',70);E(g,35,34,5,6,'#c7a265');E(g,49,22,4,4,'#c7a265');E(g,29,57,4,3,'#c7a265');E(g,55,45,5,4,'#c7a265');},
 luckyDice(g){P(g,'M13 23 L43 8 69 25 68 57 39 73 12 55Z',C.cream);path(g,'M13 23 L40 40 69 25 M40 40 L39 73',null,C.wood,1.5);for(const [x,y]of [[33,19],[47,27],[22,34],[29,53],[48,48],[59,39],[48,62],[59,54]])E(g,x,y,3,3,C.rose);},
 paperCrown(g){P(g,'M9 23 L24 34 28 10 41 29 55 9 59 34 72 22 64 65 17 65Z',C.gold,100);P(g,'M16 53 L65 53 64 65 17 65Z',C.rose,35);star(g,41,44,10,C.cream);L(g,[[22,58],[59,58]],'#f4d9a8',1.5);},
 armorPlate(g){P(g,'M17 17 L29 8 39 16 51 8 63 17 57 37 63 65 40 74 17 65 23 37Z',C.steel,130);P(g,'M29 25 L50 25 53 51 40 61 27 51Z',C.blue,50);L(g,[[23,20],[28,35],[21,57],[31,62],[55,20],[51,35],[59,57],[50,62]],C.cream,2);},
 map(g){P(g,'M7 16 L28 9 51 18 72 9 68 65 47 72 26 63 8 71Z',C.cream,120);path(g,'M28 9 L26 63 M51 18 L47 72',null,C.wood,1.2);path(g,'M13 53 Q29 34 35 49 Q50 65 62 27',null,C.rose,3);for(let i=0;i<3;i++)P(g,`M${14+i*14} ${33-i*4} L${20+i*14} ${20-i*4} ${27+i*14} ${33-i*4}Z`,C.mint,15);star(g,61,26,6,C.gold);},
 coupon(g){P(g,'M8 17 L71 17 71 32 Q57 40 71 48 L71 64 8 64 8 48 Q23 40 8 32Z',C.rose,95);g.save();g.setLineDash([3,3]);L(g,[[54,22],[54,59]],C.cream,1.5);g.restore();star(g,34,41,16,C.gold);},
 chestKey(g){E(g,27,26,17,17,C.gold);E(g,27,26,9,9,C.cream);P(g,'M37 34 L65 61 59 68 52 62 48 68 42 62 47 56 31 40Z',C.gold,65);E(g,27,26,3,3,C.rose);},
 piggyBank(g){P(g,'M15 53 L14 69 25 69 29 57 46 59 51 70 61 68 59 53Z',C.rose);E(g,39,42,28,22,C.rose);P(g,'M47 25 L46 12 59 20 61 33Z',C.rose,35);E(g,62,43,10,8,'#e8b4bd');E(g,61,43,1.4,2,C.dark,null);E(g,66,43,1.4,2,C.dark,null);E(g,53,32,2,2.5,C.dark,null);L(g,[[29,22],[43,22]],C.dark,2);path(g,'M13 39 Q2 34 5 27 Q11 21 13 30 Q13 34 7 33',null,C.rose,3);E(g,36,10,8,8,C.gold);},
 coinMagnet(g){P(g,'M15 15 L26 15 26 43 Q26 58 42 58 Q58 58 58 43 L58 15 69 15 69 44 Q68 71 42 71 Q14 69 15 44Z',C.rose);P(g,'M15 15 L26 15 26 27 15 27Z',C.cream,20);P(g,'M58 15 L69 15 69 27 58 27Z',C.cream,20);E(g,42,30,10,10,C.gold);L(g,[[42,23],[42,37]],C.wood,2);},
 starDust(g){bottle(g,40,44,C.lilac);star(g,13,20,6,C.gold);star(g,66,30,7,C.gold);star(g,62,60,4,C.cream);},
 springShoes(g){P(g,'M20 16 L39 16 40 35 55 40 60 49 18 49Z',C.blue);L(g,[[25,22],[35,23],[25,27],[35,28]],C.cream,2);path(g,'M22 51 L52 55 23 59 52 63 23 67 54 71',null,C.dark,3);L(g,[[18,73],[59,73]],C.gold,4);},
 redRibbon(g){P(g,'M38 32 Q14 1 7 23 Q4 46 34 43 L19 70 35 65 40 72 46 44 Q78 45 72 22 Q64 4 43 32Z',C.rose,125);P(g,'M36 30 L46 30 48 45 34 45Z',C.red,35);L(g,[[14,25],[34,36],[66,25],[47,36]],'#f0b8c4',2);},
 paintJar(g){P(g,'M18 21 L61 21 65 66 Q42 77 15 67Z',C.blue,130);E(g,40,22,23,8,C.wood);E(g,40,21,17,5,C.lilac);P(g,'M23 38 L55 38 55 60 23 60Z',C.cream,35);path(g,'M39 42 Q24 59 39 59 Q53 59 39 42Z',C.rose);P(g,'M49 28 L59 4 65 7 56 30Z',C.wood,30);},
 windChime(g){path(g,'M39 6 L39 17',null,C.wood,2);P(g,'M10 25 Q40 5 70 25 L10 25Z',C.blue,60);for(let i=0;i<4;i++){const x=20+i*13,y=41+(i%2)*8;L(g,[[x,25],[x,y]],C.wood,1);P(g,`M${x-3} ${y} L${x+4} ${y} ${x+4} ${y+20} ${x-3} ${y+20}Z`,[C.gold,C.rose,C.lilac,C.mint][i],20);} },
 thornBadge(g){for(let i=0;i<8;i++){const a=i*Math.PI/4;P(g,`M${40+Math.cos(a-.2)*22} ${40+Math.sin(a-.2)*22} L${40+Math.cos(a)*35} ${40+Math.sin(a)*35} ${40+Math.cos(a+.2)*22} ${40+Math.sin(a+.2)*22}Z`,C.mint,12);}E(g,40,40,23,23,C.rose);E(g,40,40,16,16,C.cream);P(g,'M30 42 Q27 25 40 32 Q54 25 51 42 L40 52Z',C.red,25);},
 rocketBoots(g){P(g,'M13 21 L34 21 34 40 53 44 58 56 11 56Z',C.blue);rocket(g,59,31,.5);P(g,'M15 59 L17 74 25 66 32 76 36 59Z',C.gold,35);L(g,[[18,29],[29,30],[18,34],[29,35]],C.cream,2);},
 prismLens(g){E(g,33,31,24,24,C.gold);E(g,33,31,18,18,C.blue);P(g,'M48 47 L55 42 73 64 65 72Z',C.wood,40);P(g,'M33 14 L45 35 21 35Z',C.lilac,35);L(g,[[18,28],[30,20]],C.cream,3);for(let i=0;i<3;i++)L(g,[[42,35],[53+i*4,24+i*5]],[C.rose,C.gold,C.mint][i],2);}
 };
 for(const [name,draw]of Object.entries(pickups))make(name,80,80,draw,2);
})();
