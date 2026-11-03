'use strict';
let rewardPaperImage,rewardChestBody,rewardChestLid;
function initRewardArt(){
 if(rewardPaperImage)return;
 const sheet=Art.canvas(380,530),g=sheet.getContext('2d');
 const outline='M13 11 L72 8 131 12 190 7 251 11 312 8 365 14 369 88 365 159 370 239 366 314 370 396 364 514 299 519 237 516 170 521 103 516 14 521 9 456 13 382 8 311 12 230 8 161 12 85 Z';
 g.translate(3,5);Art.path(g,outline,'#866d803d',null);g.translate(-3,-5);Art.pencil(g,outline,'#f8eedb',[8,8,362,512],1000,'#c3afa9');
 g.globalAlpha=.4;Art.line(g,[[24,49],[23,24],[62,22]],'#8a7794',1.2);Art.line(g,[[320,500],[350,498],[352,469]],'#8a7794',1);g.globalAlpha=1;
 let seed=927;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<7000;i++){g.fillStyle=i%3?'#8a798b0c':'#fffdf58a';g.fillRect(14+rand()*347,14+rand()*495,.5+rand()*1.1,.4+rand());}
 rewardPaperImage=sheet;$('upgrades').style.setProperty('--reward-paper',`url("${sheet.toDataURL()}")`);
 rewardChestBody=Art.canvas(240,160);const b=rewardChestBody.getContext('2d');
 Art.pencil(b,'M21 44L214 41 208 135 127 149 26 131Z','#be9a86',[20,40,195,109],800,'#765c82');Art.pencil(b,'M26 59L127 72 211 58 208 77 128 92 27 78Z','#e5ca94',[25,58,185,35],180);Art.pencil(b,'M109 70L143 72 143 113 111 110Z','#d9bb85',[109,70,35,45],90);Art.path(b,'M121 85Q126 76 131 85L128 91 129 100 121 99 123 91Z','#7e6384',null);Art.line(b,[[34,119],[105,132],[196,119]],'#f8e6c1',2);Art.line(b,[[127,92],[127,142]],'#997d91',1.3);
 rewardChestLid=Art.canvas(240,100);const l=rewardChestLid.getContext('2d');Art.pencil(l,'M19 80Q18 22 105 15Q202 5 216 66L216 81 126 98Z','#d8bd8b',[18,12,201,86],650,'#967a82');Art.line(l,[[26,72],[124,88],[207,72]],'#fff0c3',3);Art.line(l,[[39,49],[121,60],[191,48]],'#b79b7f',2);Art.path(l,'M104 32L111 44 127 43 115 53 118 66 104 57 91 63 94 50 83 41 99 43Z','#eed795','#977e8d',1.2);
}
function rewardIcon(g,key,x,y,size=95){const k=key?.startsWith('fusion:')?key.slice(7):key,d=weaponData[k],sprite=Art.sprites[d?.art||'heart'];if(!sprite)return;const ratio=size/Math.max(sprite.w,sprite.h);g.drawImage(sprite.img,x-sprite.w*ratio/2,y-sprite.h*ratio/2,sprite.w*ratio,sprite.h*ratio);}
function drawChestCinema(){
 const s=rewardSession;if(!s?.chest)return;initRewardArt();const c=$('chest-cinema'),g=c.getContext('2d');if(c.width!==1000){c.width=1000;c.height=470;}
 g.clearRect(0,0,1000,470);const t=s.age,opened=t>.55;
 if(opened){g.save();g.translate(500,270);const reach=Math.min(1,(t-.55)*2)*490;for(let i=0;i<14;i++){let a=i*Math.PI*2/14+t*.13;g.rotate(a);g.globalAlpha=.12;Art.path(g,`M0 -6L${reach} -${18+i%3*8} ${reach*.9} ${8+i%2*14}Z`,i%2?'#f5d08e':'#dcc3d7',null);g.rotate(-a);}g.restore();}
 const showReels=t>.8||!s.locked;
 if(showReels){const reelCount=Math.min(3,upgradeChoices.length);const pool=Object.keys(weaponData).filter(k=>!weaponData[k].evolved),stops=reducedEffects?[.65,.75,.85]:[1.8,2.35,2.9];
  for(let i=0;i<reelCount;i++){let x=500+(i-(reelCount-1)/2)*245,stop=stops[i],done=t>=stop;g.save();g.translate(x,145);g.rotate((i-1)*.035);g.globalAlpha=Math.min(1,(t-.8)*4);if(reducedEffects)g.globalAlpha=1;g.drawImage(rewardPaperImage,-108,-121,216,242);g.save();g.beginPath();g.rect(-85,-93,170,165);g.clip();
   if(done){rewardIcon(g,upgradeChoices[i],0,-10,116);}
   else {let f=Math.min(1,Math.max(0,(t-.8)/(stop-.8))),distance=13*(1-(1-f)**3),row=Math.floor(distance),shift=(distance-row)*125;for(let j=-2;j<=2;j++){let index=row+j,winning=index===13,key=winning?upgradeChoices[i]:pool[((index*7+i*11)%pool.length+pool.length)%pool.length];rewardIcon(g,key,0,j*125-shift-10,105);}}
   g.restore();g.fillStyle='#8d7488';g.textAlign='center';g.font='17px PaperHand';g.fillText(done?'✦  星光停驻  ✦':'·  ·  ·',0,101);if(done){g.globalAlpha=.6;Art.line(g,[[-75,73],[-25,70],[27,74],[76,71]],['#d2ac6b','#b498cb','#98b5be'][i],4);}g.restore();}
 }
 const intro=Math.max(0,1-t/1.1),scale=.65+intro*.55,y=340-intro*85;
 g.save();g.translate(500+(s.locked&&t<.6?Math.sin(t*50)*5:0),y);g.scale(scale,scale);g.rotate(t<.55?Math.sin(t*42)*.035:0);g.drawImage(rewardChestBody,-120,-25);g.save();if(opened){g.translate(-65,-34);g.rotate(-Math.min(1,(t-.55)*3)*.56);g.translate(65,-18);}g.drawImage(rewardChestLid,-120,-83);g.restore();g.restore();
 if(!s.locked)return;g.font='20px PaperHand';g.textAlign='center';g.fillStyle='#f9ebcc';g.shadowColor='#644e72';g.shadowBlur=3;g.fillText(t<.8?'轻轻摇晃，听见星星的声音…':t<2.9?'星光正在落下…':'这一份好运，属于你。',500,459);g.shadowBlur=0;
}

// One-time raster marks use the same pencil renderer as the world sprites.
let shopArtReady=false;
function initShopArt(){
 if(shopArtReady)return;shopArtReady=true;
 const c=Art.canvas(330,285),g=c.getContext('2d');
 Art.pencil(g,'M31 117Q17 70 73 49L117 28 168 36Q226 14 271 56L292 101 283 143Q306 191 256 220L217 247 164 238Q106 263 66 230L40 195 47 163Z','#efdfc1',[22,28,277,225],1100,'#c4ad95');
 g.globalAlpha=.6;Art.line(g,[[58,207],[108,222],[160,219],[214,226],[264,202]],'#ac91a3',1.4);g.globalAlpha=1;
 $('shop-modal').style.setProperty('--shop-swatch',`url("${c.toDataURL()}")`);
}

let interfaceArtReady=false;
function initInterfaceArt(){
 if(interfaceArtReady)return;interfaceArtReady=true;
 const paper=Art.canvas(620,680),g=paper.getContext('2d');
 Art.pencil(g,'M20 19L97 13 174 20 246 12 325 19 402 13 475 21 597 14 601 102 594 174 603 257 597 343 604 430 595 506 601 655 523 664 443 657 357 665 275 658 193 666 109 659 20 665 14 582 21 500 13 418 19 332 12 250 19 168 13 91Z','#f6ead1',[12,12,592,654],2100,'#ad91a4');
 g.globalAlpha=.25;Art.line(g,[[30,83],[34,31],[91,28]],'#8a708b',1.5);Art.line(g,[[526,649],[584,646],[588,591]],'#8a708b',1.5);g.globalAlpha=1;
 const stroke=Art.canvas(440,80),b=stroke.getContext('2d');
 Art.pencil(b,'M14 20Q87 10 152 17L220 12 284 17 359 12 425 20 429 57 368 65 287 60 212 67 144 61 71 67 10 59Z','#e5c388',[10,12,420,55],620,'#b18d79');
 for(const id of ['pause-menu','settings','end']){$(id).style.setProperty('--note-paper',`url("${paper.toDataURL()}")`);$(id).style.setProperty('--note-stroke',`url("${stroke.toDataURL()}")`);}
 $('pause-sticker').src=Art.url('tea');$('result-sticker').src=Art.url('star');
}
document.addEventListener('DOMContentLoaded',initInterfaceArt,{once:true});
