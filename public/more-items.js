'use strict';
// 26 more found objects. Timers refresh, charges are capped, permanent gifts have run limits.
// Integrate metadata into PICKUP_TYPES / BUFF_TYPES; call update/render after existing items.
const MORE_ITEMS={
 bomb:{name:'纸壳炸弹',art:'bomb',color:'#c19bbd',sound:'explosion',text:'炸开周围 340 米内的敌人，造成重击'},
 phoenix:{name:'凤凰折纸',art:'phoenix',color:'#e7b08e',sound:'victory',text:'本局首次回满生命并无敌 4 秒；再次拾取回复 30'},
 pocketwatch:{name:'发条怀表',art:'pocketwatch',color:'#e0c48c',sound:'bell',text:'全部武器立即就绪，风暴充能 +30%'},
 mirrorShard:{name:'月镜碎片',art:'mirrorShard',color:'#b7c9dc',sound:'bell',text:'12 秒内将靠近的敌方弹幕折返为追击星星'},
 eraser:{name:'大块橡皮',art:'eraser',color:'#d5a4bd',sound:'wind',text:'擦除所有敌方弹幕和地面危险预警'},
 lanternGuide:{name:'引路星灯',art:'lanternGuide',color:'#e2c798',sound:'event',text:'18 秒内星灯自动点射附近最强的敌人'},
 seedPacket:{name:'一包好梦种子',art:'seedPacket',color:'#b5c8a0',sound:'heal',text:'种下一片 14 秒花圃，站在其中每秒恢复 4 生命'},
 decoy:{name:'稻草小替身',art:'decoy',color:'#b2c6d6',sound:'event',text:'留下 10 秒纸人，牵引周围普通敌人远离你'},
 sugarCube:{name:'勇气方糖',art:'sugarCube',color:'#e7d8bc',sound:'pickup',text:'8 秒内武器冷却速度额外提高 50%'},
 moonCheese:{name:'月亮奶酪',art:'moonCheese',color:'#e8c780',sound:'heal',text:'生命上限 +6 并回复 15；本局上限奖励最多 +36'},
 luckyDice:{name:'六面幸运骰',art:'luckyDice',color:'#d9b4c1',sound:'level',text:'随机一件已持有武器升一级，不超过其等级上限'},
 paperCrown:{name:'纸国王冠',art:'paperCrown',color:'#e0bf7d',sound:'star',text:'15 秒内每 2 秒降下一次必暴击星雨，优先打击强敌'},
 armorPlate:{name:'小小甲片',art:'armorPlate',color:'#afc6d6',sound:'confirm',text:'抵挡一次伤害，12 秒内每 2 秒震退近敌'},
 map:{name:'折叠探险图',art:'map',color:'#c8c4a3',sound:'event',text:'折跃至最近未完成奇遇附近，获得 2 秒保护'},
 coupon:{name:'灵感优惠券',art:'coupon',color:'#dba7ba',sound:'confirm',text:'兑换 2 次重抽；重抽最多储存 10 次'},
 chestKey:{name:'秘密小钥匙',art:'chestKey',color:'#e5c086',sound:'chest',text:'发现一个双重灵感宝箱；每局最多开出 3 个'},
 piggyBank:{name:'粉红储蓄罐',art:'piggyBank',color:'#daa1b6',sound:'coin',text:'获得 18 金币；本局储蓄罐赠币最多 120'},
 coinMagnet:{name:'零钱磁铁',art:'coinMagnet',color:'#cf9daf',sound:'coin',text:'15 秒内持续吸引 1600 米范围内的纸金币'},
 starDust:{name:'一瓶星尘',art:'starDust',color:'#c6b0dc',sound:'star',text:'15 秒内每秒获得 2 点经验'},
 springShoes:{name:'弹簧鞋',art:'springShoes',color:'#abc4d8',sound:'dash',text:'立即重置冲刺；12 秒内冲刺冷却速度提高 80%'},
 redRibbon:{name:'回程红缎带',art:'redRibbon',color:'#dda1ba',sound:'ribbon',text:'12 秒内移动会留下短暂的伤害丝带'},
 paintJar:{name:'泼彩颜料罐',art:'paintJar',color:'#b9bdd8',sound:'bubble',text:'脚下形成 10 秒颜料池，减速并伤害经过的敌人'},
 windChime:{name:'晚风风铃',art:'windChime',color:'#c0cfc1',sound:'bell',text:'12 秒内每 3 秒释放一次击退音波'},
 thornBadge:{name:'荆棘徽章',art:'thornBadge',color:'#c1b18e',sound:'rose',text:'10 秒内荆棘环持续刺伤贴近你的敌人'},
 rocketBoots:{name:'火箭纸靴',art:'rocketBoots',color:'#d9b393',sound:'dash',text:'立即冲刺；12 秒内每次冲刺都会留下爆裂火花'},
 prismLens:{name:'彩虹放大镜',art:'prismLens',color:'#b7bddb',sound:'star',text:'12 秒内每秒额外射出三枚可穿透的冰晶'}
};
const MORE_BUFFS={
 mirrorReflect:{name:'月镜折返',art:'mirrorShard'},guideLight:{name:'引路星灯',art:'lanternGuide'},sugarRush:{name:'方糖火力',art:'sugarCube'},royalRain:{name:'王冠星雨',art:'paperCrown'},platePulse:{name:'甲片震退',art:'armorPlate'},coinPull:{name:'零钱磁力',art:'coinMagnet'},stardust:{name:'星尘经验',art:'starDust'},springDash:{name:'弹簧冲刺',art:'springShoes'},ribbonTrail:{name:'回程缎带',art:'redRibbon'},chimePulse:{name:'晚风音波',art:'windChime'},thornAura:{name:'荆棘环',art:'thornBadge'},rocketTrail:{name:'火箭冲刺',art:'rocketBoots'},prismVolley:{name:'彩虹冰晶',art:'prismLens'}
};
function moreItemState(){
 if(!game.moreItems)game.moreItems={phoenixUsed:false,cheeseBonus:0,keyCount:0,piggyCoins:0,clocks:{},zones:[],decoys:[],trails:[],lastX:game.hero.x,lastY:game.hero.y};
 for(const key in MORE_BUFFS)if(!Number.isFinite(game.buffs[key]))game.buffs[key]=0;
 return game.moreItems;
}
function moreItemRing(x,y,r,color,life=.6){if(game.fx.length<220)game.fx.push({type:'ring',x,y,r,color,life,max:life});}
function moreItemArea(kind,x,y,r,damage,knock=60,crit=false){for(const e of game.enemies)if(e.hp>0&&Math.hypot(e.x-x,e.y-y)<r+e.r)hit(e,damage,x,y,knock,crit,'item:'+kind);}
function moreItemProjectile(kind,x,y,angle,speed,damage,pierce,cause){const before=game.bullets.length;fireBullet(kind,x,y,angle,speed,damage,pierce);const b=game.bullets.length>before?game.bullets[game.bullets.length-1]:null;if(b)b.cause='item:'+cause;}
function applyMoreItem(kind){
 if(!MORE_ITEMS[kind])return false;
 const s=moreItemState(),p=game.hero,b=game.buffs,lv=Math.min(30,game.level||1);
 const timed=(key,duration)=>{b[key]=Math.max(b[key]||0,duration);s.clocks[key]=0;};
 if(kind==='bomb'){moreItemArea(kind,p.x,p.y,340,190+lv*7,220);moreItemRing(p.x,p.y,340,'#d4a8c6',.8);particleBurst(p.x,p.y,40,'#dab1c2',260);game.shake=Math.max(game.shake,5);}
 else if(kind==='phoenix'){if(!s.phoenixUsed){s.phoenixUsed=true;p.hp=p.maxHp;p.inv=Math.max(p.inv,4);}else p.hp=Math.min(p.maxHp,p.hp+30);}
 else if(kind==='pocketwatch'){for(const key in game.clocks)game.clocks[key]=Math.min(game.clocks[key],.01);p.storm=Math.min(100,p.storm+30);}
 else if(kind==='mirrorShard')timed('mirrorReflect',12);
 else if(kind==='eraser'){game.enemyBullets.length=0;game.hazards.length=0;moreItemRing(p.x,p.y,500,'#f2dbd5',.7);}
 else if(kind==='lanternGuide')timed('guideLight',18);
 else if(kind==='seedPacket'){s.zones=s.zones.filter(z=>z.kind!=='seed');s.zones.push({kind:'seed',x:p.x,y:p.y,r:95,life:14,max:14,tick:0});}
 else if(kind==='decoy'){s.decoys=[{x:p.x-p.dirX*80,y:p.y-p.dirY*80,life:10,max:10}];}
 else if(kind==='sugarCube')timed('sugarRush',8);
 else if(kind==='moonCheese'){const amount=Math.min(6,36-s.cheeseBonus);s.cheeseBonus+=amount;p.maxHp+=amount;p.hp=Math.min(p.maxHp,p.hp+15);}
 else if(kind==='luckyDice'){
  const pool=Object.keys(game.weapons).filter(k=>game.weapons[k]>0&&weaponData[k]&&!weaponData[k].passive&&game.weapons[k]<weaponData[k].max);
  if(pool.length){const k=pool[Math.floor(Math.random()*pool.length)];game.weapons[k]++;game.clocks[k]=.05;if(typeof updateWeaponUI==='function')updateWeaponUI();if(typeof banner==='function')banner('幸运骰 · '+weaponData[k].name+' Lv.'+game.weapons[k]);}
  else game.xp+=Math.ceil(game.need*.4);
 }
 else if(kind==='paperCrown')timed('royalRain',15);
 else if(kind==='armorPlate'){b.shield=Math.max(b.shield,12);game.shieldCharges=Math.min(4,Math.max(1,game.shieldCharges));timed('platePulse',12);}
 else if(kind==='map'){
  const events=typeof worldEvents==='undefined'?[]:worldEvents.filter(e=>!game.completedEvents.has(e.id));events.sort((a,z)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(z.x-p.x,z.y-p.y));
  if(events.length){const target=events[0];p.x=target.x;p.y=target.y+85;p.inv=Math.max(p.inv,2);p.knockX=p.knockY=0;if(typeof refreshWorld==='function')refreshWorld();}
  else{for(const gem of game.gems)gem.attracted=true;game.xp+=12;}
 }
 else if(kind==='coupon')game.rerolls=Math.min(10,game.rerolls+2);
 else if(kind==='chestKey'){if(s.keyCount<3){s.keyCount++;game.pickups.push({x:p.x+45,y:p.y+10,kind:'chest',life:120});}else game.xp+=Math.ceil(game.need*.4);}
 else if(kind==='piggyBank'){const amount=Math.min(18,120-s.piggyCoins);s.piggyCoins+=amount;game.coins=(game.coins||0)+amount;game.totalCoins=(game.totalCoins||0)+amount;}
 else if(kind==='coinMagnet')timed('coinPull',15);
 else if(kind==='starDust')timed('stardust',15);
 else if(kind==='springShoes'){p.dashCd=0;timed('springDash',12);}
 else if(kind==='redRibbon'){timed('ribbonTrail',12);s.lastX=p.x;s.lastY=p.y;}
 else if(kind==='paintJar'){s.zones=s.zones.filter(z=>z.kind!=='paint');s.zones.push({kind:'paint',x:p.x,y:p.y,r:135,life:10,max:10,tick:0});}
 else if(kind==='windChime')timed('chimePulse',12);
 else if(kind==='thornBadge')timed('thornAura',10);
 else if(kind==='rocketBoots'){timed('rocketTrail',12);p.dash=Math.max(p.dash,.25);p.inv=Math.max(p.inv,.6);p.dashCd=2.4;}
 else if(kind==='prismLens')timed('prismVolley',12);
 return true;
}
function updateMoreItems(dt){
 if(!game?.buffs)return;const s=moreItemState(),p=game.hero,b=game.buffs,lv=Math.min(30,game.level||1);
 for(const key in s.clocks)s.clocks[key]=Math.max(0,s.clocks[key]-dt);
 const pulse=(key,interval)=>{if(!(b[key]>0)||s.clocks[key]>0)return false;s.clocks[key]=interval;return true;};
 if(b.sugarRush>0)for(const key in game.clocks)game.clocks[key]=Math.max(-3,game.clocks[key]-dt*.5);
 if(b.springDash>0)p.dashCd=Math.max(0,p.dashCd-dt*.8);
 if(b.stardust>0)game.xp+=dt*2;
 if(b.coinPull>0)for(const coin of game.coinDrops||[])if(Math.hypot(coin.x-p.x,coin.y-p.y)<1600)coin.attracted=true;
 if(b.mirrorReflect>0&&pulse('mirrorReflect',.10)){
  let reflected=0;for(const shot of game.enemyBullets){if(shot.life<=0||Math.hypot(shot.x-p.x,shot.y-p.y)>105)continue;shot.life=0;const target=nearest(p.x,p.y,800);const angle=target?Math.atan2(target.y-shot.y,target.x-shot.x):Math.atan2(-shot.vy,-shot.vx);moreItemProjectile('star',shot.x,shot.y,angle,350,24+lv*2,3,'mirrorShard');moreItemRing(shot.x,shot.y,22,'#bfd4e2',.3);if(++reflected>=3)break;}
  if(reflected){game.enemyBullets=game.enemyBullets.filter(shot=>shot.life>0);Sound.play('bell',.3,1.05,.18);}
 }
 if(pulse('guideLight',.8)){
  let target=null;for(const e of game.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<700&&(!target||e.maxHp>target.maxHp))target=e;
  if(target){moreItemProjectile('star',p.x,p.y-50,Math.atan2(target.y-p.y,target.x-p.x),410,22+lv*2,2,'lanternGuide');Sound.play('star',.25,.9,.2);}
 }
 if(pulse('royalRain',2)){
  const targets=game.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<470).sort((a,z)=>z.maxHp-a.maxHp).slice(0,3);
  for(const target of targets){hit(target,28+lv*2,p.x,p.y,80,true,'item:paperCrown');game.fx.push({type:'bolt',x:target.x,y:target.y,life:.35,max:.35,seed:target.id||1,width:3});}if(targets.length)Sound.play('star',.35,.9,.3);
 }
 if(pulse('platePulse',2)){moreItemArea('armorPlate',p.x,p.y,90,10,180);moreItemRing(p.x,p.y,90,'#b3ccdd');}
 if(pulse('chimePulse',3)){moreItemArea('windChime',p.x,p.y,210,18+lv,240);moreItemRing(p.x,p.y,210,'#e4d19a',.8);Sound.play('bell',.45,.8,.4);}
 if(pulse('thornAura',.4)){moreItemArea('thornBadge',p.x,p.y,80,7+lv,25);}
 if(b.rocketTrail>0&&p.dash>0&&pulse('rocketTrail',.12)){moreItemArea('rocketBoots',p.x,p.y,65,22+lv*2,80);particleBurst(p.x,p.y,7,'#e9bc7e',100);moreItemRing(p.x,p.y,65,'#e7b38d',.3);}
 if(pulse('prismVolley',1)){
  const target=nearest(p.x,p.y,700),a=target?Math.atan2(target.y-p.y,target.x-p.x):game.t;
  for(let i=0;i<3;i++)moreItemProjectile('frost',p.x,p.y-20,a+(i-1)*.24,310,18+lv*1.5,3,'prismLens');Sound.play('star',.3,1.05,.3);
 }
 if(b.ribbonTrail>0&&Math.hypot(p.x-s.lastX,p.y-s.lastY)>22){s.trails.push({x:p.x,y:p.y,x2:s.lastX,y2:s.lastY,life:2,max:2,tick:0});s.lastX=p.x;s.lastY=p.y;if(s.trails.length>32)s.trails.shift();}
 for(const trail of s.trails){trail.life-=dt;trail.tick-=dt;if(trail.tick<=0){trail.tick=.4;const x=(trail.x+trail.x2)*.5,y=(trail.y+trail.y2)*.5;moreItemArea('redRibbon',x,y,36,11+lv,20);}}
 s.trails=s.trails.filter(t=>t.life>0);
 for(const zone of s.zones){zone.life-=dt;zone.tick-=dt;if(zone.kind==='seed'&&Math.hypot(zone.x-p.x,zone.y-p.y)<zone.r)p.hp=Math.min(p.maxHp,p.hp+dt*4);if(zone.kind==='paint'&&zone.tick<=0){zone.tick=.5;for(const e of game.enemies)if(e.hp>0&&Math.hypot(e.x-zone.x,e.y-zone.y)<zone.r+e.r){e.slow=Math.max(e.slow||0,1);hit(e,8+lv,zone.x,zone.y,0,false,'item:paintJar');}}}
 s.zones=s.zones.filter(z=>z.life>0);
 for(const decoy of s.decoys){decoy.life-=dt;for(const e of game.enemies){if(e.hp<=0||e.boss||e.elite)continue;const dx=decoy.x-e.x,dy=decoy.y-e.y,d=Math.hypot(dx,dy);if(d>32&&d<270){const speed=Math.min(140,(e.speed||45)*2.2);e.x+=dx/d*speed*dt;e.y+=dy/d*speed*dt;e.slow=Math.max(e.slow||0,.2);}}}
 s.decoys=s.decoys.filter(d=>d.life>0);
}
function renderMoreItems(){
 if(!game?.moreItems)return;const s=game.moreItems,p=game.hero,b=game.buffs;ctx.save();
 for(const z of s.zones){if(!visible(z.x,z.y,180))continue;ctx.globalAlpha=Math.min(.5,z.life*.4);Art.ellipse(ctx,z.x,z.y,z.r,z.r*.65,z.kind==='seed'?'#c5d1a74d':'#b5aed34d',z.kind==='seed'?'#9bad88':'#aaa0c7',2);ctx.globalAlpha=Math.min(1,z.life);for(let i=0;i<6;i++){const a=i*TAU/6;Art.image(ctx,z.kind==='seed'?'daisy':'paintJar',z.x+Math.cos(a)*z.r*.65,z.y+Math.sin(a)*z.r*.5,.25,1,0,.8);}}
 for(const d of s.decoys)if(visible(d.x,d.y,100)){Art.shadow(ctx,d.x,d.y,23,8);Art.image(ctx,'decoy',d.x,d.y,.7,1,Math.sin(realTime*3)*.05,Math.min(1,d.life));}
 for(const t of s.trails){ctx.globalAlpha=Math.min(.7,t.life*.5);Art.line(ctx,[[t.x,t.y-3],[(t.x+t.x2)*.5,(t.y+t.y2)*.5-7],[t.x2,t.y2-3]],'#d998b5',5);}
 ctx.globalAlpha=1;
 if(b.mirrorReflect>0){Art.ellipse(ctx,p.x,p.y-20,100,65,null,'#b5cedd77',1.5);for(let i=0;i<3;i++){const a=realTime+i*TAU/3;Art.image(ctx,'mirrorShard',p.x+Math.cos(a)*80,p.y-20+Math.sin(a)*50,.23,1,a*.25);}}
 if(b.guideLight>0)Art.image(ctx,'lanternGuide',p.x+Math.cos(realTime*.8)*38,p.y-70+Math.sin(realTime*2)*5,.4);
 if(b.royalRain>0)Art.image(ctx,'paperCrown',p.x,p.y-92,.35,1,Math.sin(realTime)*.08);
 if(b.thornAura>0)for(let i=0;i<8;i++){const a=realTime*.7+i*TAU/8;Art.image(ctx,'rose',p.x+Math.cos(a)*72,p.y+Math.sin(a)*47,.2,1,a);}
 ctx.restore();
}
