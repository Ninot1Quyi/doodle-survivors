'use strict';
// Six authored landscape grammars, baked once. Chunk coordinates only choose and place templates.
const PaperBiomes=(()=>{
 const SIZE=960,TAU=Math.PI*2,grounds=new Map(),cache=new Map();let ready=false,lastKey='',active=[],props=[],fauna=[];
 const themes=[
 {key:'mushroom',name:'巨蘑菇林',hint:'沿着孢子小径穿过蘑菇拱门',color:'#cbbfc6',animal:'biome_snail'},
 {key:'whale',name:'漂浮鲸鱼湖',hint:'鲸鱼在水面上睡觉，荷叶连成浅滩',color:'#bfcfd9',animal:'biome_fish'},
 {key:'greenhouse',name:'月光温室',hint:'玻璃穹顶里，玫瑰长成了月亮',color:'#d3c7d8',animal:'biome_moth'},
 {key:'ruins',name:'纸城遗迹',hint:'沿旧街穿过钟楼、书页桥和断墙',color:'#ccc8c3',animal:'biome_bookbird'},
 {key:'dunes',name:'开花沙丘',hint:'花朵从沙纹里生长，绿洲藏在弧形坡后',color:'#e4cfb3',animal:'biome_deer'},
 {key:'kites',name:'云端风筝田',hint:'顺着风的线条，走进悬着风筝的麦田',color:'#cdd5c7',animal:'biome_cloudsheep'}
 ];
 const {make,pencil:P,path:Q,line:L,ellipse:E}=Art;
 function hash(x,y){return ((Math.imul(x,374761393)^Math.imul(y,668265263))>>>0);}
 function themeAt(cx,cy){if(cx===0&&cy===0)return 2;if(cx===1&&cy===0)return 1;if(cx===-1&&cy===0)return 0;if(cx===0&&cy===1)return 5;if(cx===0&&cy===-1)return 3;return hash(cx,cy)%6;}
 function cell(x){return Math.floor((x+SIZE/2)/SIZE);}
 function biomeAt(x,y){const t=themes[themeAt(cell(x),cell(y))];return{name:t.name,hint:t.hint,key:t.key};}
 function star(g,x,y,r,color='#e9ce92'){let a=[];for(let i=0;i<10;i++){let ang=i*TAU/10-Math.PI/2,rr=i%2?r*.45:r;a.push([x+Math.cos(ang)*rr,y+Math.sin(ang)*rr]);}P(g,'M'+a.map(q=>q.join(' ')).join('L')+'Z',color,[x-r,y-r,r*2,r*2],45);}
 function flower(g,x,y,r,color='#dbaac1'){for(let i=0;i<5;i++){let a=i*TAU/5;E(g,x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55,r*.47,r*.5,color,'#aa8c9c',.7);}E(g,x,y,r*.32,r*.32,'#edcf96');}
 function foliage(g,x,y,w,h,color){P(g,`M${x} ${y}Q${x-w} ${y-h*.5} ${x-w*.25} ${y-h}Q${x+w*.7} ${y-h*.8} ${x} ${y}Z`,color,[x-w,y-h,w*2,h],65);L(g,[[x,y],[x-w*.25,y-h*.85]],'#7d9a89',1);}
 function scenery(){
 make('biome_mushroomArch',320,330,g=>{P(g,'M52 140Q34 219 35 299L73 310 101 286 108 136Z','#dfc8b1',[32,134,80,180],330);P(g,'M212 141L215 287 245 310 277 298Q269 211 263 139Z','#dfc8b1',[210,134,70,180],320);P(g,'M6 154Q23 48 149 20Q280 20 313 151Q167 215 6 154Z','#c699ac',[4,17,310,200],850,'#8e6a85');for(let [x,y,r]of [[62,127,20],[120,70,24],[206,90,30],[260,133,17],[153,156,16]])E(g,x,y,r,r*.65,'#f3e3c9');Q(g,'M89 205Q153 177 223 204',null,'#c6b2aa',8);for(let x=104;x<222;x+=21)L(g,[[x,202],[x,217]],'#f4e3cc',3);for(let x of [49,236]){Q(g,`M${x} 227Q${x+25} 210 ${x+36} 230L${x+35} 266 ${x} 267Z`,'#ac939f');L(g,[[x+17,222],[x+17,266]],'#dec6b2',2);}foliage(g,301,305,30,78,'#b2bda0');},2);
 make('biome_sporeFern',105,121,g=>{for(let i=0;i<5;i++){let x=20+i*17;L(g,[[52,111],[x,32+i%2*15]],'#8ea18c',2);foliage(g,x,57+i%2*12,18,40,'#b4c0a5');E(g,x,24+i%2*15,7,10,'#d7c0d5');}flower(g,52,76,13,'#c3a3c8');},2.5);
 make('biome_sporeLamp',94,148,g=>{P(g,'M38 133L40 59 54 58 60 135Z','#c0b29d',[36,55,27,84],100);P(g,'M8 61Q19 12 46 8Q80 15 87 60Q51 83 8 61Z','#b6b8cf',[6,7,83,78],200);for(let x of [25,45,66])E(g,x,47-(x%3)*7,6,5,'#ede6cb');for(let x of [25,42,61,75])L(g,[[x,66],[x-3,91]],'#d3c9b7',1.2);},2.5);
 make('biome_whale',390,236,g=>{P(g,'M78 145Q58 91 114 70Q163 45 242 61Q284 69 305 99L339 74 376 83 355 115 373 136 334 144 302 128Q279 177 207 187Q123 198 78 145Z','#a8c3d5',[61,55,317,139],760,'#7391ad');P(g,'M82 136Q154 170 222 156Q265 152 293 134Q276 176 213 185Q130 197 82 145Z','#e1e5df',[79,131,218,63],250,'#a2b7bc');E(g,114,118,5,6,'#5a6f85');E(g,112,116,1.6,2,'#fff4df');Q(g,'M92 139Q109 148 126 141',null,'#8099a9',1.5);P(g,'M180 138Q192 188 236 206L242 191 214 133Z','#94b1c6',[176,130,69,81],150);Q(g,'M144 69Q126 20 114 30M144 69Q150 10 166 28M144 69Q174 32 183 42',null,'#c5dfe4',4);for(let i=0;i<5;i++){let x=119+i*19,y=26+(i%2)*9;E(g,x,y,3,5,'#c0d8e1');}for(let x of [142,167,190,214])Q(g,`M${x} 163L${x+5} 179`,null,'#a8b8bb',1);star(g,239,85,13);},2);
 make('biome_lotus',125,107,g=>{E(g,62,88,57,14,'#b7c8ae','#829d91',1);Q(g,'M62 88L110 83',null,'#809b89',1);for(let i=0;i<6;i++){let x=28+i*13;P(g,`M62 82Q${x-14} 55 ${x} 34Q${x+20} 52 62 82Z`,i%2?'#e1becd':'#ecd1d8',[x-14,32,40,52],50);}E(g,62,72,11,6,'#e8cc94');},3);
 make('biome_reedBoat',200,127,g=>{P(g,'M11 78Q102 113 187 75L165 111 37 114Z','#c3a77f',[9,73,181,45],220);L(g,[[102,86],[102,11]],'#9e876f',4);P(g,'M100 13L37 70 98 65Z','#f4e5c6',[34,10,69,64],140);P(g,'M108 20L153 63 109 65Z','#d9c6d7',[106,17,50,50],95);Q(g,'M19 83Q94 111 179 82',null,'#e8d2a7',2);star(g,78,53,9,'#cfad85');},3);
 make('biome_glassPalace',370,366,g=>{P(g,'M29 332L29 169Q32 28 182 17Q338 27 342 171L342 332Z','#d7dfe2',[27,15,318,320],680,'#a2afc2');P(g,'M30 295L342 295 350 338 22 338Z','#c1b4bd',[20,292,332,50],240);for(let x of [71,126,184,243,298])Q(g,`M${x} 295L${x} 164Q${x} 67 184 19`,null,'#a2a3b7',3);for(let y of [130,207,267])Q(g,`M34 ${y}Q185 ${y-17} 337 ${y}`,null,'#a2a3b7',2.5);Q(g,'M48 175Q49 58 146 40',null,'#f7f0df',4);for(let [x,y,r]of [[86,237,29],[275,248,34],[185,154,43]]){L(g,[[x,y+60],[x,y]],'#8da496',5);foliage(g,x,y+40,38,42,'#b3c3a4');flower(g,x,y,r,'#d5adc5');}P(g,'M144 334L144 269Q181 228 221 269L221 334Z','#e6d9c6',[141,240,83,98],170);Q(g,'M154 332L154 272Q183 248 211 272L211 332Z','#a8b7ca');L(g,[[182,258],[182,334]],'#d9c5aa',3);star(g,184,20,14);P(g,'M9 339L357 339 367 353 3 353Z','#c4b6aa',[1,336,368,20],160);},2);
 make('biome_moonRose',144,219,g=>{L(g,[[73,206],[75,79]],'#8eaa97',6);for(let y of [128,170]){foliage(g,74,y,40,52,'#b5c5ab');foliage(g,85,y+12,-34,49,'#c0c9af');}P(g,'M88 13Q32 5 25 59Q20 106 69 112Q108 111 122 78Q75 104 56 65Q46 32 88 13Z','#e5d5af',[20,9,105,107],270,'#aa9ba0');flower(g,105,105,24,'#d7aac5');flower(g,62,185,12,'#d7aac5');},3);
 make('biome_prismBush',138,112,g=>{for(let [x,y,h,col]of [[29,101,65,'#c7b6d8'],[62,104,91,'#b4c8d7'],[96,100,72,'#d3bed8']]){P(g,`M${x-14} ${y}L${x-18} ${y-h+22} ${x} ${y-h} ${x+16} ${y-h+20} ${x+12} ${y}Z`,col,[x-20,y-h,40,h+3],90);L(g,[[x,y-h],[x+2,y-4]],'#edf0de',2);}flower(g,33,91,13,'#dfb4c9');},2.7);
 make('biome_clockTower',218,377,g=>{P(g,'M47 350L49 87 162 87 171 350Z','#d6c5b0',[45,85,129,270],600);P(g,'M30 95L107 12 187 96Z','#afa0ba',[28,10,163,89],250);P(g,'M21 351L192 351 205 365 11 365Z','#bbaba6',[9,348,198,20],100);E(g,108,132,40,42,'#f1e1bf');E(g,108,132,34,36,null,'#a08ca1',2);L(g,[[108,107],[108,132],[131,145]],'#8e7893',4);for(let i=0;i<12;i++){let a=i*TAU/12;E(g,108+Math.cos(a)*29,132+Math.sin(a)*30,1.5,2,'#a48c88');}for(let y of [211,272]){Q(g,`M74 ${y}L74 ${y-28}Q107 ${y-57} 141 ${y-28}L141 ${y}Z`,'#a99cb3');L(g,[[107,y-46],[107,y]],'#d9c8b2',3);}Q(g,'M80 350L80 316Q109 287 137 316L137 350Z','#a592a4');for(let y of [183,234,295])L(g,[[51,y],[165,y]],'#b09c96',1);star(g,108,35,11);},2);
 make('biome_bookBridge',327,185,g=>{P(g,'M10 96Q94 43 164 81Q240 38 317 96L309 133Q227 85 169 128Q89 86 19 136Z','#c4ad99',[8,40,311,100],340);P(g,'M14 85Q93 32 162 70Q242 27 313 85L307 111Q239 65 166 105Q90 66 20 115Z','#ede0c6',[11,26,305,93],400);Q(g,'M163 71L166 106',null,'#998397',3);for(let i=0;i<5;i++){Q(g,`M30 ${86+i*4}Q94 ${47+i*4} 152 ${81+i*4}`,null,'#b9a592',1);Q(g,`M178 ${80+i*4}Q240 ${43+i*4} 299 ${84+i*4}`,null,'#b9a592',1);}P(g,'M39 119L44 169 65 171 65 109Z','#bca89c',[36,106,32,67],90);P(g,'M254 107L257 169 281 166 282 119Z','#bca89c',[251,103,35,69],90);},2);
 make('biome_brokenWall',210,142,g=>{P(g,'M12 124L12 62 37 62 39 27 78 26 79 63 106 63 108 14 143 16 143 52 174 53 174 83 197 84 197 124Z','#c7bac5',[9,12,192,115],350);for(let y of [56,87,113])L(g,[[15,y],[192,y]],'#a394a8',1);for(let x of [32,64,97,135,165])L(g,[[x,87],[x,113]],'#a394a8',1);foliage(g,32,128,30,61,'#b3c0a5');flower(g,169,89,14,'#d3b2c8');},3);
 make('biome_duneFlower',199,240,g=>{P(g,'M81 224L88 80 108 80 120 223Z','#c3b394',[79,76,43,151],210);for(let [x,y]of [[63,159],[129,184]]){P(g,`M98 ${y+24}Q${x-28} ${y-44} ${x} ${y-44}Q${x+31} ${y-33} 98 ${y+24}Z`,'#c0c4a3',[x-28,y-44,59,73],100);}for(let i=0;i<8;i++){let a=i*TAU/8;P(g,`M99 84Q${99+Math.cos(a)*103} ${84+Math.sin(a)*103} ${99+Math.cos(a)*71} ${84+Math.sin(a)*71}Q${99+Math.cos(a+.3)*84} ${84+Math.sin(a+.3)*84} 99 84Z`,i%2?'#e5ba9d':'#e6c796',[12,2,176,174],75);}E(g,99,84,31,31,'#cbb88c');for(let i=0;i<16;i++){let a=i*2.4,r=4+Math.sqrt(i)*5;E(g,99+Math.cos(a)*r,84+Math.sin(a)*r,2,2,'#a18e77');}},2);
 make('biome_sandCoral',158,168,g=>{for(let [x,y,w]of [[38,39,16],[78,13,20],[122,56,17]]){P(g,`M${x-w} 149L${x-w} ${y+15}Q${x-w} ${y-3} ${x} ${y}Q${x+w} ${y} ${x+w} ${y+18}L${x+w} 149Z`,'#d3b8ae',[x-w-2,y-2,w*2+4,154-y],140);for(let yy=y+21;yy<145;yy+=19)Q(g,`M${x-w+3} ${yy}Q${x} ${yy+6} ${x+w-3} ${yy}`,null,'#b5979e',1);}for(let [x,y]of [[38,42],[78,16],[122,58]])flower(g,x,y,15,'#dda8b5');},3);
 make('biome_oasisPot',133,131,g=>{P(g,'M21 54L111 54 99 115Q67 130 34 115Z','#c7a58d',[19,51,95,75],220);E(g,67,54,45,14,'#e3c2a2');E(g,67,52,35,8,'#accbd4');foliage(g,62,51,37,45,'#b7c3a0');flower(g,79,33,22,'#e6becb');Q(g,'M47 84L65 72 84 83 66 98Z',null,'#e8d0ab',3);},2.7);
 make('biome_kiteMill',238,322,g=>{P(g,'M80 297L90 113 152 113 167 297Z','#d5c4ac',[78,111,92,190],350);P(g,'M70 123L121 67 177 123Z','#b5a3bd',[68,64,111,62],180);Q(g,'M109 296L109 251Q128 233 144 251L144 296Z','#b29daf');for(let y of [160,204])Q(g,`M109 ${y}L109 ${y-20} 141 ${y-20} 141 ${y}Z`,'#a8bdc9');g.save();g.translate(123,117);g.rotate(-.23);for(let i=0;i<4;i++){g.rotate(Math.PI/2);P(g,'M0 -4L15 -103 42 -96 18 0Z',i%2?'#e6c2b5':'#c4d1c2',[0,-105,44,109],110);for(let y=-85;y<-10;y+=16)L(g,[[14,y],[33,y+3]],'#ab9b9d',1);}E(g,0,0,10,10,'#ccb98d');g.restore();P(g,'M62 298L181 298 194 311 51 311Z','#bdaa99',[49,295,147,19],80);},2);
 make('biome_kiteTree',207,285,g=>{P(g,'M91 266L88 126 62 78 71 73 104 119 145 55 154 61 113 144 118 267Z','#bea68e',[59,52,98,218],280);for(let [x,y,col]of [[50,64,'#d7adc3'],[148,44,'#b5cbd4'],[101,114,'#e4c58e'],[172,139,'#c1cba7']]){P(g,`M${x} ${y-32}L${x+27} ${y} ${x} ${y+42} ${x-27} ${y}Z`,col,[x-29,y-34,58,80],100);L(g,[[x,y-31],[x,y+40]],'#a18d9b',1);L(g,[[x-26,y],[x+26,y]],'#a18d9b',1);Q(g,`M${x} ${y+42}Q${x-22} ${y+62} ${x+1} ${y+84}`,null,'#b298ad',1.2);} },3);
 make('biome_wheat',122,135,g=>{for(let i=0;i<7;i++){let x=20+i*13,y=22+(i%3)*13;L(g,[[61,129],[x,y]],'#adab83',1.8);for(let j=0;j<4;j++){E(g,x-4,y+j*8,4,6,'#dac994');E(g,x+4,y+j*8+3,4,6,'#e2d0a0');}}},2.5);
 animals();
 }
 function animals(){
 make('biome_snail',74,49,g=>{P(g,'M8 32Q24 21 48 29L57 19 64 24 68 39 17 43 5 38Z','#b5c7ad',[4,18,66,27],90);E(g,32,23,19,18,'#cfb5cd');Q(g,'M22 19Q37 5 44 22Q45 35 31 33Q22 32 26 23Q32 17 36 25',null,'#987da7',1.2);L(g,[[57,24],[54,11],[50,10]],'#819783',1.5);E(g,60,26,1.5,2,'#56776c');},2);
 make('biome_fish',77,51,g=>{P(g,'M14 24Q34 4 55 18L69 9 68 36 54 29Q31 47 14 24Z','#b1cfda',[12,3,59,44],100);P(g,'M31 16L37 5 47 15Z','#d2bed5',[29,3,20,14],25);E(g,24,21,2,2.5,'#5e7992');Q(g,'M34 18L39 24 34 30',null,'#8aaabb',1);},2);
 make('biome_moth',78,58,g=>{P(g,'M37 31Q-1 -1 8 29Q5 48 35 37L24 52 38 46 43 34Z','#d3bfdc',[4,3,42,51],100);P(g,'M41 31Q79 -1 70 29Q73 48 43 37L54 52 40 46 35 34Z','#dfc9d5',[34,3,42,51],100);L(g,[[39,19],[40,44]],'#a893b0',4);E(g,20,26,5,6,'#ecdfc5');E(g,58,26,5,6,'#e8d2b2');},2);
 make('biome_bookbird',75,64,g=>{P(g,'M36 28Q17 7 4 17L15 40 35 39 42 25 69 12 68 36 45 43Z','#e4d7bc',[2,6,69,40],115);L(g,[[12,21],[31,32]],'#bfae9a');L(g,[[48,30],[63,20]],'#bfae9a');P(g,'M27 38Q40 25 51 38L45 53 31 55Z','#b7bbcf',[25,26,28,31],45);E(g,43,37,1.5,2,'#665d7b');Q(g,'M49 37L58 40 48 43Z','#d7b28a');},2);
 make('biome_deer',85,90,g=>{P(g,'M26 59L21 81 28 81 35 63 54 63 62 81 69 80 60 57Z','#c6b6a0',[19,55,52,29],70);P(g,'M24 59Q23 42 45 40L51 23 64 24 68 45 62 60Z','#d9c7ab',[22,22,48,42],100);P(g,'M49 29L40 15 53 17 59 10 66 18 77 13 69 31Z','#e0cbb0',[39,9,40,25],60);L(g,[[53,16],[49,4],[43,5]],'#b19c8e',1.5);L(g,[[66,17],[69,4],[75,6]],'#b19c8e',1.5);E(g,59,27,2,2.6,'#766673');E(g,71,30,2,2,'#766673');for(let [x,y]of [[31,48],[42,52],[51,46]])E(g,x,y,2,2,'#f3e8d0');},2);
 make('biome_cloudsheep',86,72,g=>{for(let x of [25,57])L(g,[[x,48],[x,64]],'#a99aa3',5);P(g,'M12 43Q1 26 15 23Q19 9 33 16Q45 4 57 17Q76 12 77 28Q87 40 73 48Q63 60 50 51Q31 62 25 51Q12 57 12 43Z','#eee4da',[5,8,77,54],180);P(g,'M60 25Q78 20 80 35Q81 46 69 49Q58 43 60 25Z','#c5b2c7',[58,19,25,32],50);E(g,71,33,2,3,'#776481');E(g,80,39,2,2,'#a789a0');},2);
 }
 function strokePath(g,points,color,width){g.beginPath();g.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)g.lineTo(points[i][0],points[i][1]);g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();}
 function bakeGround(type){const c=Art.canvas(SIZE,SIZE),g=c.getContext('2d');g.fillStyle=g.createPattern(Art.ground,'repeat');g.fillRect(0,0,SIZE,SIZE);g.globalAlpha=.62;g.fillStyle=['#a8b9a0','#b5cbd0','#b8c9ac','#b9bbb2','#d9bd92','#c0ca9c'][type];g.fillRect(0,0,SIZE,SIZE);g.globalAlpha=1;let t=themes[type];
 // Regional contours are irregular colored paper patches, not full-screen tint changes.
 g.globalAlpha=.35;for(let i=0;i<8;i++){let x=160+(i*137)%650,y=120+(i*193)%700;E(g,x,y,160+(i%3)*50,85+(i%4)*25,t.color,null);}g.globalAlpha=1;
 if(type===0){strokePath(g,[[0,500],[210,430],[410,510],[570,370],[760,430],[960,480]],'#e7d9c0',100);for(let i=0;i<28;i++){let x=80+(i*131)%820,y=80+(i*197)%800;g.globalAlpha=.16;E(g,x,y,35,17,'#b4a9c4',null);}g.globalAlpha=1;}
 if(type===1){let p=Q(g,'M100 170Q350 50 660 180Q906 229 845 550Q803 797 493 782Q183 828 87 596Q-8 372 100 170Z','#b5cbd8','#9aafbe',2);g.save();g.clip(p);for(let i=0;i<100;i++){let x=40+(i*83)%850,y=130+(i*137)%650;L(g,[[x,y],[x+35+(i%3)*8,y-2]],i%2?'#dce5df':'#a8bece',1.2);}g.restore();strokePath(g,[[0,530],[180,520],[320,570],[470,535],[620,573],[790,520],[960,530]],'#dfd8bd',80);for(let i=0;i<8;i++)E(g,180+i*84,540+Math.sin(i)*18,32,17,'#c7d3b9','#a2b49c',1);}
 if(type===2){
  Q(g,'M22 253Q99 128 275 180Q403 125 432 305Q385 395 199 377Q47 396 22 253Z','#c9cbb8',null);
  Q(g,'M523 104Q704 29 877 198Q945 359 767 390Q595 368 523 104Z','#d5c5d4',null);
  Q(g,'M89 642Q151 509 340 595Q462 738 324 873Q161 911 89 642Z','#c5ccbd',null);
  Q(g,'M563 614Q711 541 898 653Q968 813 794 914Q602 911 563 614Z','#c8c3d6',null);
  Q(g,'M-30 522C173 611 254 367 470 468S742 613 990 458',null,'#c9b79f',77);
  Q(g,'M-30 518C173 607 254 363 470 464S742 609 990 454',null,'#eee0c5',70);
  for(let [x,y,r]of [[224,311,74],[748,282,58],[267,738,66],[746,738,83]]){
   Q(g,`M${x-r} ${y}Q${x-r*.6} ${y-r*.7} ${x+r*.4} ${y-r*.35}Q${x+r*1.2} ${y} ${x+r*.5} ${y+r*.4}Q${x-r*.7} ${y+r*.6} ${x-r} ${y}Z`,'#b3c5b4','#9dad99',1);
   for(let i=0;i<14;i++){let a=i*2.399,rr=Math.sqrt(i)*r*.23;flower(g,x+Math.cos(a)*rr,y+Math.sin(a)*rr*.48,3+i%3,i%2?'#d6adc5':'#e4c794');}
  }
  for(let i=0;i<17;i++){let x=45+i*54,y=484+Math.sin(i*.7)*53;Q(g,`M${x-8} ${y}q8 -8 18 -2l-1 7q-11 5 -17 -5Z`,'#d9ccb6','#bdad9b66',.7);}
 }
 if(type===3){
  for(let [x,y,w,h]of [[65,104,265,220],[625,83,218,240],[89,669,240,195],[622,628,262,230]]){
   Q(g,`M${x} ${y+25}L${x+w*.45} ${y-12} ${x+w} ${y+17} ${x+w-12} ${y+h*.7} ${x+w*.7} ${y+h} ${x+22} ${y+h-12}Z`,'#ccc2c5','#baabb8',1);
   for(let i=0;i<18;i++){let px=x+20+(i*59)%(w-35),py=y+20+(i*83)%(h-30);Q(g,`M${px} ${py}l16 -3 7 10 -19 5Z`,i%2?'#c0b2bd':'#d8ccc5',null);}
  }
  Q(g,'M-30 500C220 341 330 651 521 514S722 338 990 500',null,'#c6b49e',91);
  Q(g,'M-30 500C220 341 330 651 521 514S722 338 990 500',null,'#e5d8bf',83);
  for(let i=0;i<22;i++){let x=70+(i*151)%830,y=100+(i*263)%760;Q(g,`M${x} ${y}l20 -4 12 12 -22 8Z`,'#d7ccc6','#b9a9b0',.6);}
 }

 if(type===4){for(let i=0;i<7;i++){let y=100+i*123;Q(g,`M0 ${y}Q240 ${y-135} 490 ${y}Q730 ${y+110} 960 ${y-20}L960 ${y+55}Q680 ${y+165} 460 ${y+55}Q220 ${y-75} 0 ${y+60}Z`,i%2?'#e4cdb1':'#e8d7bc',null);for(let j=0;j<4;j++)Q(g,`M0 ${y+j*10}Q240 ${y-80+j*10} 480 ${y+j*10}Q720 ${y+90+j*10} 960 ${y+j*10}`,null,'#ccb69e55',1);}E(g,710,270,140,90,'#b3c8ce','#a4b7bd',1);E(g,710,270,105,60,'#c0d5d9',null);strokePath(g,[[0,540],[270,460],[470,530],[760,530],[960,480]],'#eee1c7',70);}
 if(type===5){for(let i=0;i<6;i++){let x=45+i*155;Q(g,`M${x} 120L${x+100} 150 ${x+115} 840 ${x-10} 790Z`,i%2?'#d7d8b3':'#c9d1b5',null);for(let j=0;j<11;j++)L(g,[[x+8+j*8,170],[x+4+j*8,770]],'#aebc9e44',1);}strokePath(g,[[0,480],[960,480]],'#e9dfc9',105);for(let i=0;i<8;i++){let x=90+(i*173)%800,y=90+(i*197)%800;g.globalAlpha=.42;for(let j=0;j<4;j++)E(g,x+j*28,y+Math.sin(j)*8,34,16,'#fbf2e1',null);}g.globalAlpha=1;}
 for(let patch=0;patch<12;patch++){
  let bx=85+(patch*229+type*41)%790,by=70+(patch*167)%815;
  if(Math.abs(by-(500+Math.sin(bx*.009)*60))<55)continue;
  for(let j=0;j<18;j++){
   let a=j*2.399,r=8+Math.sqrt(j)*17,x=bx+Math.cos(a)*r,y=by+Math.sin(a)*r*.55;
   if(type===0){E(g,x,y,4+j%4,2,'#c4b5c377',null);L(g,[[x,y],[x-2,y-8]],'#a79ba8',1);E(g,x-2,y-9,4,2,'#d6b4c7','#a88eaa',.5);}
   if(type===1){E(g,x,y,6+j%4,3,'#a3bda88a',null);Q(g,`M${x} ${y}l5 -1 -3 3Z`,'#c6d7b8',null);}
   if(type===2){L(g,[[x,y],[x+2,y-8]],'#9bad9970',1);flower(g,x+2,y-10,3.5+j%3,j%2?'#d6b4c7':'#c4b3d3');}
   if(type===3){Q(g,`M${x} ${y}l10 -3 3 5 -11 3Z`,j%3?'#c5b9c1':'#dfcbb8','#ab9faa66',.7);if(j%4===0)foliage(g,x,y,6,12,'#b5bea3');}
   if(type===4){Q(g,`M${x-5} ${y}Q${x} ${y-5} ${x+8} ${y}`,null,'#c5ab91',.7);if(j%3===0)flower(g,x,y-4,4,'#e1b399');}
   if(type===5){for(let k=0;k<3;k++)L(g,[[x,y],[x-6+k*5,y-10-j%7]],k%2?'#cabd8b':'#acb58e',1.1);}
  }
 }
 // Dry crayon marks only at bake time. Sparse and directional to keep the battlefield readable.
 let seed=type+719;for(let i=0;i<600;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;let x=seed%960;seed=(Math.imul(seed,1664525)+1013904223)>>>0;let y=seed%960;L(g,[[x,y],[x+6+i%12,y-3-i%4]],i%2?'#786b7a12':'#fff4df30',.8);}
 g.save();g.globalCompositeOperation='destination-out';
 for(let edge=0;edge<4;edge++){g.save();g.translate(SIZE/2,SIZE/2);g.rotate(edge*Math.PI/2);g.translate(-SIZE/2,-SIZE/2);let fade=g.createLinearGradient(0,0,0,42);fade.addColorStop(0,'#000');fade.addColorStop(1,'#0000');g.fillStyle=fade;g.fillRect(0,0,SIZE,42);g.restore();}g.restore();return c;
 }
 // Template clusters preserve paths and central combat clearings. Heights create a visual scale hierarchy.
 const layouts=[
 [['biome_mushroomArch',-190,-135,1],['biome_sporeLamp',280,-200,1.4],['biome_sporeLamp',-340,220,1.1],['biome_sporeFern',-275,-100,1],['biome_sporeFern',-350,-250,.85],['biome_sporeFern',290,-90,1.1],['biome_sporeFern',245,280,.9],['bigMushroom',335,285,1.3],['bigMushroom',-300,310,1],['biome_sporeFern',335,330,.7]],
 [['biome_whale',65,-100,1.05],['biome_reedBoat',-210,255,1],['biome_lotus',-290,-170,1.2],['biome_lotus',295,230,1.1],['biome_lotus',260,-220,.9],['reeds',-370,150,1.6],['reeds',330,140,1.5],['biome_lotus',-170,280,.8]],
 [['biome_glassPalace',255,-125,1],['biome_moonRose',-255,-160,1.25],['biome_moonRose',-295,290,.95],['biome_prismBush',-150,-190,1.1],['biome_prismBush',285,300,1.2],['biome_prismBush',155,295,.9],['roseDome',-275,100,1.3],['fountain',-180,265,1.15],['biome_moonRose',370,-110,.7]],
 [['biome_clockTower',-235,-130,1],['biome_bookBridge',180,280,1],['biome_brokenWall',220,-195,1.2],['biome_brokenWall',330,-90,.8],['paperHouse',-260,270,1.3],['biome_brokenWall',-330,175,1],['pillar',-115,-210,1.2],['pillar',300,340,.9],['biome_prismBush',285,-260,.8]],
 [['biome_duneFlower',-220,-170,1.25],['biome_sandCoral',270,300,1.1],['biome_sandCoral',-300,290,1.3],['biome_duneFlower',325,-100,.8],['biome_oasisPot',200,-180,1.1],['biome_oasisPot',-245,170,.8],['biome_sandCoral',-100,-240,.8],['biome_duneFlower',90,320,.75]],
 [['biome_kiteMill',-240,-120,1],['biome_kiteTree',290,260,1.05],['biome_kiteTree',270,-170,.85],['biome_wheat',-290,250,1.15],['biome_wheat',-160,300,1.2],['biome_wheat',-360,-220,1],['biome_wheat',160,-230,.9],['biome_wheat',330,340,1],['paperHouse',-270,350,.85]]
 ];
 function init(){if(ready)return;ready=true;scenery();for(let i=0;i<6;i++)grounds.set(i,bakeGround(i));}
 function chunk(cx,cy){let key=cx+','+cy;if(cache.has(key))return cache.get(key);let type=themeAt(cx,cy),x=cx*SIZE,y=cy*SIZE,m={cx,cy,x,y,type,props:[],animals:[]},mirror=hash(cx,cy)%2?-1:1;
 for(let i=0;i<layouts[type].length;i++){let [name,px,py,scale]=layouts[type][i];m.props.push({x:x+px*mirror,y:y+py,name,scale,biomeProp:true,occluder:Art.sprites[name]?.h*scale>155});}
 const plants=[['biome_sporeFern','biome_sporeLamp','bigMushroom'],['biome_lotus','reeds','biome_lotus'],['biome_prismBush','biome_moonRose','lavender'],['biome_brokenWall','lavender','biome_prismBush'],['biome_sandCoral','biome_duneFlower','biome_oasisPot'],['biome_wheat','biome_wheat','biome_kiteTree']][type];
 let seed=hash(cx+41,cy-23);const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<32;i++){
  let cluster=i%4,anchor=layouts[type][(cluster+2)%layouts[type].length],a=random()*TAU,r=40+random()*105,px=anchor[1]*mirror+Math.cos(a)*r,py=anchor[2]+Math.sin(a)*r*.6;
  if(Math.abs(py-(20+Math.sin((px+480)*.009)*60))<55||Math.abs(px)>430||Math.abs(py)>430)continue;
  let name=plants[i%3],scale=.22+random()*.32;
  m.props.push({x:x+px,y:y+py,name,scale,biomeProp:true,occluder:false,sway:true});
 }
 for(let i=0;i<7;i++){let angle=random()*TAU;m.animals.push({x:x-290+random()*580,y:y-180+random()*500,name:themes[type].animal,phase:angle,type,scale:i===0?.95:.35+random()*.34});}cache.set(key,m);return m;
 }
 function refresh(cx,cy){init();let xx=cell(cx),yy=cell(cy),radius=typeof viewW==='number'?Math.max(1,Math.min(3,Math.ceil(Math.max(viewW,viewH)/SIZE/2))):1,key=xx+','+yy+','+radius;if(key===lastKey)return;lastKey=key;active=[];props=[];fauna=[];for(let y=yy-radius;y<=yy+radius;y++)for(let x=xx-radius;x<=xx+radius;x++){let c=chunk(x,y);active.push(c);props.push(...c.props);fauna.push(...c.animals);}for(let [k,c]of cache)if(Math.abs(c.cx-xx)>radius+1||Math.abs(c.cy-yy)>radius+1)cache.delete(k);}
 function renderGround(){if(!ready)return;for(let c of active){if(typeof visible==='function'&&!visible(c.x,c.y,SIZE*.8))continue;ctx.drawImage(grounds.get(c.type),c.x-SIZE/2,c.y-SIZE/2,SIZE,SIZE);}}
 function getProps(){return props;}
 function renderFauna(){
 const t=typeof game!=='undefined'&&game?game.t:realTime,p=typeof game!=='undefined'&&game?game.hero:null;
 for(let a of fauna){
  const flying=[1,2,3].includes(a.type),pace=a.type===0?.065:a.type===4?.45:.18,phase=t*pace+a.phase;
  let x=a.x+Math.sin(phase)*(flying?85:38),y=a.y+Math.cos(phase*.8)*24;
  if(p){let dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);if(d<100&&d>1){x+=dx/d*(100-d)*.42;y+=dy/d*(100-d)*.42;}}
  if(typeof visible==='function'&&!visible(x,y,85))continue;
  let hop=Math.max(0,Math.sin(t*(a.type===4?5:3)+a.phase)),bob=flying?8+Math.sin(t*3+a.phase)*5:a.type===0?0:hop*6;
  Art.shadow(ctx,x,y,16*a.scale,5*a.scale);
  ctx.save();ctx.translate(x,y-PaperCamera.height(bob));ctx.scale(flying?1:1+hop*.04,flying&&a.type!==1?.82+Math.abs(Math.sin(t*7+a.phase))*.25:1-hop*.04);
  Art.image(ctx,a.name,0,0,a.scale,Math.cos(phase)<0?-1:1,flying?Math.sin(t*2+a.phase)*.08:Math.sin(phase)*.04,.92);ctx.restore();
 }
 for(let c of active){
  if(!visible(c.x,c.y,SIZE*.7))continue;
  for(let i=0;i<8;i++){
   let phase=t*.25+i*2.4+c.type,x=c.x+Math.sin(phase*.27+i)*350,y=c.y+Math.cos(phase*.35+i)*300;
   if(!visible(x,y,30))continue;
   if(c.type===1){let r=5+(t*4+i*7)%19;Art.ellipse(ctx,x,y,r,r*.35,null,'#f5f1d080',1);}
   else {let col=['#e1c994','#b9d8df','#dbc2d9','#dbcdb3','#e2b58e','#d4c395'][c.type];ctx.save();ctx.translate(x,y);ctx.rotate(phase);ctx.globalAlpha=.45;Art.ellipse(ctx,0,0,c.type===3?4:2.5,c.type===3?6:1.5,col,null);ctx.restore();}
  }
 }
 }

 function diagnostics(){return{tileSize:SIZE,baked:grounds.size,cached:cache.size,active:active.length,props:props.length,fauna:fauna.length};}
 return{init,refresh,renderGround,getProps,renderFauna,biomeAt,diagnostics};
})();
function initBiomes(){PaperBiomes.init();}
function refreshBiomes(cx,cy){PaperBiomes.refresh(cx,cy);}
function renderBiomeGround(){PaperBiomes.renderGround();}
function getBiomeProps(){return PaperBiomes.getProps();}
function renderBiomeFauna(){PaperBiomes.renderFauna();}
function biomeAt(x,y){return PaperBiomes.biomeAt(x,y);}

initBiomes();

function biomeSpeed(x,y){if(biomeAt(x,y).key!=='whale')return 1;let lx=((x+480)%960+960)%960-480,ly=((y+480)%960+960)%960-480;return (lx/380)**2+((ly+15)/340)**2<1&&Math.abs(ly-55)>65?.86:1;}
