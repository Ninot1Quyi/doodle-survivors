'use strict';
// Found objects are distinct from permanent level-up charms. Timed effects do not stack exponentially.
const PICKUP_TYPES={
 heal:{name:'玫瑰茶',art:'tea',color:'#df9cad',text:'恢复 45 生命',sound:'heal'},
 cookie:{name:'星星饼干',art:'cookie',color:'#e7c58c',text:'恢复 25 生命，获得一点经验',sound:'heal'},
 magnet:{name:'星光磁铁',art:'magnet',color:'#bfabd7',text:'吸引地图上所有墨晶',sound:'pickup'},
 snowglobe:{name:'冬日雪球',art:'snowglobe',color:'#abd3df',text:'冻结敌人 5 秒，清除当前弹幕',sound:'bell'},
 umbrella:{name:'小纸伞',art:'umbrella',color:'#b3cbdc',text:'12 秒内抵挡 3 次伤害',sound:'bubble'},
 feather:{name:'风的羽毛',art:'feather',color:'#c7d3b2',text:'移动速度 +35%，持续 12 秒',sound:'wind'},
 hourglass:{name:'慢时沙漏',art:'hourglass',color:'#d3bee0',text:'敌人和敌方弹幕减速，持续 12 秒',sound:'bell'},
 rainbow:{name:'彩虹蜡笔盒',art:'rainbow',color:'#df9dbb',text:'全部武器伤害 +50%，持续 12 秒',sound:'star'},
 ticket:{name:'金色许愿券',art:'ticket',color:'#ebd18b',text:'重抽次数 +1，下次升级有双重灵感',sound:'level'},
 firefly:{name:'萤火虫灯',art:'firefly',color:'#d8d89f',text:'墨水风暴充能 +45%',sound:'event'},
 needle:{name:'针线修补包',art:'needle',color:'#daa9ba',text:'生命上限 +10，并恢复 20 生命',sound:'heal'},
 scroll:{name:'遗落的诗',art:'scroll',color:'#dac6aa',text:'获得相当于当前等级 70% 的经验',sound:'level'},
 honey:{name:'蜂蜜罐',art:'honey',color:'#e6bb7d',text:'每秒恢复 2 生命，持续 15 秒',sound:'heal'}
};
const BUFF_TYPES={shield:{name:'纸伞护盾',art:'umbrella'},speed:{name:'轻盈',art:'feather'},slow:{name:'慢时',art:'hourglass'},power:{name:'彩虹火力',art:'rainbow'},freeze:{name:'冬日',art:'snowglobe'},regen:{name:'蜂蜜恢复',art:'honey'}};
let worldCaches=[],lastBuffHUD='',lastItemHUD='',itemIcons={};
function itemIcon(name){return itemIcons[name]||(itemIcons[name]=Art.url(name));}
function initItems(){Object.assign(PICKUP_TYPES,MORE_ITEMS);Object.assign(BUFF_TYPES,MORE_BUFFS);game.buffs={shield:0,speed:0,slow:0,power:0,freeze:0,regen:0};game.shieldCharges=0;game.itemCount=0;game.luckyNext=false;lastBuffHUD=null;lastItemHUD=null;game.itemPopups=[];worldCaches=[];}
function randomItem(){let r=Math.random();if(r<.25)return 'cookie';if(r<.4)return 'heal';let keys=Object.keys(PICKUP_TYPES);return keys[Math.floor(Math.random()*keys.length)];}
function dropItem(x,y,kind=randomItem()){game.pickups.push({x,y,kind,life:45});}
function useItem(kind){let p=game.hero,b=game.buffs,d=PICKUP_TYPES[kind]||PICKUP_TYPES.heal;game.itemCount++;game.telemetry.items=(game.telemetry.items||0)+1;
if(kind==='heal')p.hp=Math.min(p.maxHp,p.hp+45);
else if(kind==='cookie'){p.hp=Math.min(p.maxHp,p.hp+25);game.xp+=8;}
else if(kind==='magnet'){for(let g of game.gems)g.attracted=true;}
else if(kind==='snowglobe'){b.freeze=5;game.enemyBullets=[];}
else if(kind==='umbrella'){b.shield=12;game.shieldCharges=3;}
else if(kind==='feather')b.speed=12;
else if(kind==='hourglass')b.slow=12;
else if(kind==='rainbow')b.power=12;
else if(kind==='ticket'){game.rerolls++;game.luckyNext=true;}
else if(kind==='firefly')p.storm=Math.min(100,p.storm+45);
else if(kind==='needle'){p.maxHp+=10;p.hp=Math.min(p.maxHp,p.hp+20);}
else if(kind==='scroll')game.xp+=Math.ceil(game.need*.7);
else if(kind==='honey')b.regen=15;else applyMoreItem(kind);
game.fx.push({type:'ring',x:p.x,y:p.y,r:85,life:.7,max:.7,color:d.color});particleBurst(p.x,p.y-20,10,d.color,110);game.itemPopups.push({name:d.name,text:d.text,life:3});game.itemPopups=game.itemPopups.slice(-3);Sound.play(d.sound,.6,1,.12);}
function updateItems(dt){updateMoreItems(dt);for(let k in game.buffs)game.buffs[k]=Math.max(0,game.buffs[k]-dt);if(game.buffs.shield<=0)game.shieldCharges=0;if(game.buffs.regen>0)game.hero.hp=Math.min(game.hero.maxHp,game.hero.hp+dt*2);for(let f of game.itemPopups)f.life-=dt;game.itemPopups=game.itemPopups.filter(f=>f.life>0);for(let c of worldCaches){if(game.completedEvents.has(c.id))continue;if(distance(c,game.hero)<50){game.completedEvents.add(c.id);dropItem(c.x-20,c.y);dropItem(c.x+22,c.y);particleBurst(c.x,c.y-20,20,'#d8b68e',135);game.fx.push({type:'ring',x:c.x,y:c.y,r:70,life:.6,max:.6,color:'#dfbd84'});Sound.play('chest',.6,1);}}}
function refreshCaches(cx,cy){worldCaches=[];for(let x=cx-2;x<=cx+2;x++)for(let y=cy-2;y<=cy+2;y++)if((x-y)%2!==0){worldCaches.push({id:'parcel:'+x+','+y,x:x*640+180+hashWorld(x,y,401)*220,y:y*640+130+hashWorld(x,y,402)*300});}worldCaches.push({id:'first-parcel',x:60,y:320});}
function renderCaches(){for(let c of worldCaches){if(!visible(c.x,c.y,120))continue;let done=game.completedEvents.has(c.id);if(done)continue;Art.shadow(ctx,c.x,c.y,22,8);Art.image(ctx,'parcel',c.x,c.y+Math.sin(realTime*2)*2,.75,1,Math.sin(realTime)*.025);if(distance(c,game.hero)<130){ctx.save();ctx.textAlign='center';outlinedText('触碰拆封 · 旅行补给',c.x,c.y+23,12,'#fff0d3','#96718b',2);ctx.restore();}}}
function renderItemFX(){renderMoreItems();let p=game.hero;if(game.buffs.shield>0){ctx.save();ctx.globalAlpha=.5+.15*Math.sin(realTime*3);Art.ellipse(ctx,p.x,p.y-27,36,45,null,'#9ccbe1',3);Art.ellipse(ctx,p.x,p.y-27,40,48,null,'#fff8dd',1);ctx.restore();}if(game.buffs.power>0){for(let i=0;i<5;i++){let a=realTime*2+i*TAU/5;Art.image(ctx,'star',p.x+Math.cos(a)*40,p.y-25+Math.sin(a)*32,.16,1,a,.65);}}if(game.buffs.freeze>0){ctx.save();ctx.globalAlpha=.45;for(let e of game.enemies)if(visible(e.x,e.y,80)){Art.ellipse(ctx,e.x,e.y-15,e.r+5,e.r+17,'#b5d9e533','#c6e8ef',1.3);}ctx.restore();}}
function updateItemHUD(){const b=game.buffs;let active=Object.keys(BUFF_TYPES).filter(k=>b[k]>0);let stamp=active.map(k=>k+Math.ceil(b[k])+game.shieldCharges).join(',');if(stamp!==lastBuffHUD){lastBuffHUD=stamp;$('buff-strip').innerHTML=active.map(k=>`<span title="${BUFF_TYPES[k].name}"><img src="${itemIcon(BUFF_TYPES[k].art)}" alt="${BUFF_TYPES[k].name}"><b>${k==='shield'?game.shieldCharges+'次':Math.ceil(b[k])+'s'}</b></span>`).join('');}let toast=game.itemPopups.map(f=>f.name).join(',');if(toast!==lastItemHUD){lastItemHUD=toast;$('item-toast').innerHTML=game.itemPopups.map(f=>`<span><strong>${f.name}</strong> ${f.text}</span>`).join('');}}
function fillItemJournal(){$('items-grid').innerHTML=Object.entries(PICKUP_TYPES).map(([k,d])=>`<article><img src="${Art.url(d.art)}" alt=""><div><strong>${d.name}</strong><small>${d.text}</small></div></article>`).join('');}
