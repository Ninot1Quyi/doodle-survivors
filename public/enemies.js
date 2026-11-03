'use strict';
// Behaviour roster: 24 additional creatures, six bosses and eight mechanical elite traits.
const MORE_ENEMIES={
 scribble:{name:'彩毛团',hp:74,speed:44,r:22,xp:3,damage:8,scale:.85,ai:'wander'},puff:{name:'棉花糖',hp:53,speed:42,r:20,xp:2,damage:7,scale:.83,ai:'hop'},sprout:{name:'条纹芽芽',hp:95,speed:35,r:20,xp:4,damage:9,scale:.85,ai:'fan'},
 crab:{name:'饼干蟹',hp:130,speed:38,r:25,xp:4,damage:11,scale:.84,ai:'strafe'},owl:{name:'晚安猫头鹰',hp:90,speed:38,r:22,xp:4,damage:9,scale:.85,ai:'sniper'},hedgehog:{name:'卷卷刺猬',hp:115,speed:35,r:23,xp:4,damage:10,scale:.86,ai:'roll'},worm:{name:'苹果毛毛虫',hp:70,speed:45,r:19,xp:3,damage:8,scale:.9,ai:'snake'},frog:{name:'水洼小蛙',hp:95,speed:35,r:22,xp:4,damage:10,scale:.9,ai:'leap'},bee:{name:'蜜糖蜂',hp:40,speed:77,r:17,xp:2,damage:7,scale:.8,ai:'orbit'},turtle:{name:'背书小龟',hp:240,speed:22,r:26,xp:6,damage:12,scale:.9,ai:'guard'},golem:{name:'软石头',hp:280,speed:23,r:28,xp:7,damage:15,scale:.95,ai:'stomp'},mimic:{name:'零食宝箱',hp:165,speed:38,r:24,xp:6,damage:12,scale:.9,ai:'ambush'},moth:{name:'织梦飞蛾',hp:62,speed:50,r:21,xp:3,damage:8,scale:.85,ai:'orbitFan'},dandelion:{name:'蒲公英邮差',hp:75,speed:24,r:21,xp:4,damage:8,scale:.85,ai:'seed'},icecube:{name:'方糖冰块',hp:125,speed:32,r:22,xp:4,damage:10,scale:.88,ai:'skate'},cactus:{name:'盆栽刺刺',hp:155,speed:18,r:23,xp:5,damage:11,scale:.85,ai:'radial'},painter:{name:'糊涂画家',hp:105,speed:32,r:22,xp:5,damage:10,scale:.88,ai:'paint'},balloon:{name:'气球愿望',hp:45,speed:41,r:18,xp:3,damage:7,scale:.8,ai:'float'},clockwork:{name:'发条闹钟',hp:150,speed:32,r:23,xp:5,damage:11,scale:.88,ai:'tick'},skeleton:{name:'小骨架',hp:60,speed:55,r:19,xp:3,damage:9,scale:.85,ai:'dodge'},stitch:{name:'补丁布偶',hp:165,speed:32,r:23,xp:5,damage:11,scale:.88,ai:'mend'},dragonfly:{name:'蜻蜓信使',hp:45,speed:84,r:17,xp:3,damage:8,scale:.82,ai:'swoop'},starfish:{name:'海星饼',hp:85,speed:37,r:23,xp:4,damage:9,scale:.85,ai:'spin'},doll:{name:'纸裙娃娃',hp:110,speed:36,r:22,xp:5,damage:10,scale:.88,ai:'summon'},
 bossCrab:{name:'饼干蟹公爵',hp:4600,speed:26,r:51,xp:110,damage:21},bossOwl:{name:'织梦图书长',hp:8200,speed:29,r:48,xp:150,damage:22},bossFrog:{name:'雨靴王子',hp:4800,speed:25,r:49,xp:110,damage:20},bossClock:{name:'午夜发条师',hp:8600,speed:24,r:49,xp:150,damage:22},bossCloud:{name:'棉花云鲸',hp:11500,speed:27,r:53,xp:190,damage:24},bossSerpent:{name:'环星纸龙',hp:12000,speed:34,r:52,xp:190,damage:24}
};
const ELITE_VARIANTS={
 giant:{name:'大个子',color:'#d5a36e',hp:2.4,speed:.8,scale:1.3},swift:{name:'风跑跑',color:'#8ebfc8',hp:1.6,speed:1.4,scale:1.05},armored:{name:'厚纸甲',color:'#a5a3c8',hp:3.2,speed:.8,scale:1.15},mender:{name:'修补师',color:'#a6bb8e',hp:1.9,speed:1,scale:1.1},stormcaller:{name:'雷雨笔',color:'#b1a2d2',hp:1.9,speed:.9,scale:1.1},splitter:{name:'套娃纸',color:'#d3a4bb',hp:2,speed:.9,scale:1.2},berserker:{name:'急脾气',color:'#dc9e87',hp:2.1,speed:1,scale:1.1},summoner:{name:'呼朋伴',color:'#c9b37b',hp:2,speed:.85,scale:1.1}
};
const BOSS_POOLS={bossRose:['bossRose','bossCrab','bossFrog'],boss:['boss','bossOwl','bossClock'],bossMoon:['bossMoon','bossCloud','bossSerpent']};
const NORMAL_EXPANSION_KEYS=Object.keys(MORE_ENEMIES).filter(k=>!k.startsWith('boss'));
function initEnemyExpansion(){game.advancedSpawnClock=3;game.advancedEliteClock=48;game.variantWatches=[];game.creatureSeen=new Set();game.bossChoices={};game.finalBossKind=null;game.eliteCursor=0;game.encounterCursor=0;}
function chooseBoss(kind){let pool=BOSS_POOLS[kind];if(!pool)return kind;let chosen=pool[Math.floor(Math.random()*pool.length)];game.bossChoices[kind]=chosen;if(kind==='bossMoon')game.finalBossKind=chosen;return chosen;}
function decorateEnemy(e){e.intent=null;e.aiTick=0;e.variantClock=3+Math.random()*2;e.variantScale=1;e.finalBoss=e.boss&&e.kind===game.finalBossKind;game.creatureSeen?.add(e.kind);return e;}
function applyEnemyVariant(e,key){const v=ELITE_VARIANTS[key];if(!v||e.boss||e.variant)return false;e.variant=key;e.elite=true;e.variantScale=v.scale;e.r*=v.scale;e.maxHp*=v.hp;e.hp=e.maxHp;e.speed*=v.speed;e.damage*=1.2;e.xp=Math.ceil(e.xp*4);e.variantClock=2;e.variantRewarded=false;game.variantWatches.push(e);return true;}
function enemyWarn(e,type,seconds,opts={}){if(e.intent)return false;e.intent=prepareEnemyIntent(e,{type,left:seconds,max:seconds,x:opts.x??game.hero.x,y:opts.y??game.hero.y,a:Math.atan2(game.hero.y-e.y,game.hero.x-e.x),r:opts.r||65,n:opts.n||3,speed:opts.speed||135,kind:opts.kind||'imp',color:opts.color||'#b58fb8',...opts});return true;}
function enemyShot(e,a,speed,color,r=6){if(game.enemyBullets.length>=130)return;game.enemyBullets.push({id:game.enemyShotSerial++,guard:e.boss?2:1,x:e.x,y:e.y-(e.boss?24:18),vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r,life:4.2,color:'#e14755'});}
function enemyArea(x,y,r,delay,color='#be92b3',total=delay){if(game.hazards.length>=30)return;game.hazards.push({x,y,r,life:delay,max:total,done:false,color});}
function resolveEnemyIntent(e,q){
 const rage=e.boss&&e.hp<e.maxHp*.5;
 if(q.type==='fan'||q.type==='sniper'||q.type==='radial'||q.type==='spiral'){let radial=q.type==='radial'||q.type==='spiral',n=q.n;for(let i=0;i<n;i++){let a=radial?q.a+i*Math.PI*2/n:q.a+(i-(n-1)/2)*.22;enemyShot(e,a,q.speed,q.color,q.type==='sniper'?5:6);}}
 else if(q.type==='charge'){e.chargeAttack={a:q.a,speed:q.speed,left:q.duration};}
 else if(q.type==='leap'){e.leapFromX=e.x;e.leapFromY=e.y;e.leapToX=q.x;e.leapToY=q.y;e.leapLife=.55;e.leapMax=.55;}
 else if(q.type==='summon'){const cap=e.boss?2:1;for(let i=0;i<cap&&game.enemies.length<235;i++)spawnEnemy(q.kind,e.x+(i?40:-40),e.y+35);}
 else if(q.type==='mend'){let healed=0;for(let n of game.enemies){if(n!==e&&!n.boss&&n.hp>0&&(n.x-e.x)**2+(n.y-e.y)**2<160**2){n.hp=Math.min(n.maxHp,n.hp+n.maxHp*.12);if(++healed>=8)break;}}}

 for(let spot of q.spots||[])enemyArea(spot.x,spot.y,spot.r,Math.max(.025,spot.delay),q.color,q.max+spot.delay);
 if(game.fx.length<180)game.fx.push({type:'ring',x:e.x,y:e.y,r:Math.min(95,q.r),life:.35,max:.35,color:q.color});
}
function tickEnemyIntent(e,dt){if(!e.intent)return false;e.intent.left-=dt;if(e.intent.left<=0){const q=e.intent;e.intent=null;resolveEnemyIntent(e,q);}return true;}
function tickVariant(e,dt,d){if(!e.variant)return;e.variantClock-=dt;if(e.variantClock>0||e.intent||d>650)return;
 const kind=e.variant;e.variantClock=kind==='summoner'?9:kind==='mender'?5:4;
 if(kind==='mender')enemyWarn(e,'mend',.85,{color:'#9fbd91',r:160});
 if(kind==='stormcaller')enemyWarn(e,'fan',.8,{n:3,speed:125,color:'#b3a4cf'});
 if(kind==='summoner')enemyWarn(e,'summon',1,{kind:'puff',color:'#cdb784'});
}
function advancedEnemyBehavior(e,dt,dx,dy,d){
 const spec=MORE_ENEMIES[e.kind];if(!spec&&!e.variant)return null;
 if(game.buffs?.freeze>0){e.attackCd=Math.max(.2,e.attackCd);return 0;}
 const slow=game.buffs?.slow>0?.55:1;d=Math.max(1,d);tickVariant(e,dt,d);
 if(e.boss)return null;
 let ai=spec?.ai,m=1;
 if(ai==='wander'||ai==='snake'){e.x+=-dy/d*Math.sin(game.t*2.5+e.phase)*23*dt*slow;e.y+=dx/d*Math.sin(game.t*2.5+e.phase)*23*dt*slow;m=.85;}
 if(ai==='hop')m=.35+Math.max(0,Math.sin(game.t*3+e.phase))*1.7;
 if(ai==='strafe'){e.x+=-dy/d*35*dt*slow;e.y+=dx/d*35*dt*slow;m=d<190?.1:.8;}
 if(ai==='orbit'||ai==='orbitFan'||ai==='float'){if(d<260){e.x+=-dy/d*e.speed*.8*dt*slow;e.y+=dx/d*e.speed*.8*dt*slow;m=d<150?-.3:.2;}e.frame+=dt*3;}
 if(ai==='guard')m=e.hp<e.maxHp*.5?.6:.8;
 if(ai==='tick')m=Math.sin(game.t*2+e.phase)>.2?1.8:.15;
 if(ai==='dodge'&&e.hitFlash>0){e.x+=-dy/d*80*dt*slow;e.y+=dx/d*80*dt*slow;}
 if(ai==='skate')m=.7+Math.max(0,Math.sin(game.t*1.8+e.phase))*1.3;
 if(ai==='spin'){e.x+=-dy/d*Math.sin(game.t*4+e.phase)*42*dt*slow;e.y+=dx/d*Math.sin(game.t*4+e.phase)*42*dt*slow;}
 if(ai==='sniper'||ai==='seed'||ai==='radial'||ai==='paint'||ai==='mend'||ai==='summon')m=d<230?-.15:.7;
 if(e.attackCd<=0&&d<620){e.attackCd=4+Math.random()*2;
  if(ai==='fan'||ai==='orbitFan')enemyWarn(e,'fan',.8,{n:3,speed:118,color:'#a5bfb9'});
  else if(ai==='sniper')enemyWarn(e,'sniper',1.05,{n:1,speed:205,color:'#c3a1bd'});
  else if(ai==='roll'||ai==='swoop'||ai==='ambush'){if(d<430)enemyWarn(e,'charge',.85,{r:40,color:'#ceab90'});}
  else if(ai==='leap'){if(d<370)enemyWarn(e,'leap',.85,{r:42,color:'#acbd94'});}
  else if(ai==='stomp'){if(d<170)enemyWarn(e,'stomp',.85,{x:e.x,y:e.y,r:75,color:'#c2adc8'});}
  else if(ai==='seed'||ai==='radial')enemyWarn(e,'radial',1,{n:ai==='seed'?5:7,speed:85,color:'#c3c69c'});
  else if(ai==='paint')enemyWarn(e,'paint',.95,{r:47,color:'#d3a1bc'});
  else if(ai==='mend')enemyWarn(e,'mend',1,{r:160,color:'#b8b9a1'});
  else if(ai==='summon'){e.attackCd=10;enemyWarn(e,'summon',1.25,{kind:'puff',color:'#d6b2c5'});}
 }
 if(e.variant==='berserker'&&e.hp<e.maxHp*.4)m*=1.65;
 return e.intent?0:m*slow;
}
function advancedBossBehavior(e,dt,dx,dy,d){if(!e.boss)return false;if(game.buffs?.freeze>0)return true; if(e.attackCd>0)return true;const rage=e.hp<e.maxHp*.5;e.attackCd=rage?2.9:4.6;const turn=e.aiTick++%3,at={x:game.hero.x,y:game.hero.y};
 if(e.kind==='bossCrab')enemyWarn(e,turn===1?'stomp':'fan',1,{...at,n:rage?7:5,speed:135,r:85,color:'#daa795'});
 else if(e.kind==='bossOwl')enemyWarn(e,turn===2?'summon':'fan',1.1,{n:rage?9:5,speed:150,kind:'owl',color:'#b8a5c7'});
 else if(e.kind==='bossFrog')enemyWarn(e,turn===1?'radial':'leap',1,{...at,n:12,speed:100,r:80,color:'#b4c599'});
 else if(e.kind==='bossClock')enemyWarn(e,turn===1?'radial':'clock',1.15,{n:rage?16:12,speed:105,color:'#bda4bf'});
 else if(e.kind==='bossCloud')enemyWarn(e,turn===2?'radial':'cloud',1.1,{...at,n:rage?9:6,speed:100,color:'#acbbd5'});
 else if(e.kind==='bossSerpent')enemyWarn(e,turn===1?'fan':'serpent',1,{...at,n:rage?9:5,speed:155,color:'#a6c1b4'});
 else if(e.kind==='bossRose')enemyWarn(e,turn===2?'summon':turn===1?'cloud':'radial',1.05,{...at,n:rage?12:8,speed:100,kind:'mushroom',color:'#d2a0b8'});
 else if(e.kind==='bossMoon')enemyWarn(e,turn===1?'cloud':'spiral',1.1,{...at,n:rage?18:12,speed:120,color:'#abb8d8'});
 else enemyWarn(e,turn===2?'stomp':'radial',1,{...at,n:rage?16:12,speed:115,r:90,color:'#bd9ac7'});
 return true;
}
function updateAdvancedEncounters(dt){if(!game.creatureSeen)initEnemyExpansion();game.advancedSpawnClock-=dt;
 if(game.advancedSpawnClock<=0&&game.enemies.length<235){game.advancedSpawnClock=game.demo?2:Math.max(1.1,2.7-game.t*.0045);let unlocked=Math.min(NORMAL_EXPANSION_KEYS.length,6+Math.floor(game.t/12));let n=game.demo?2:Math.min(3,1+Math.floor(game.t/150));for(let i=0;i<n&&game.enemies.length<235;i++){let key=NORMAL_EXPANSION_KEYS[game.encounterCursor++%unlocked];spawnEnemy(key);}}
 game.advancedEliteClock-=dt;if(!game.demo&&game.advancedEliteClock<=0){game.advancedEliteClock=38;let living=game.variantWatches.filter(e=>e.hp>0);if(living.length<6){const eligible=game.enemies.filter(e=>!e.boss&&!e.elite&&e.hp>0&&Math.hypot(e.x-game.hero.x,e.y-game.hero.y)>230);let e=eligible[Math.floor(Math.random()*eligible.length)];if(e){let keys=Object.keys(ELITE_VARIANTS),key=keys[game.eliteCursor++%keys.length];applyEnemyVariant(e,key);if(typeof banner==='function')banner('奇想精英 · '+ELITE_VARIANTS[key].name);}}}
 for(let i=game.variantWatches.length-1;i>=0;i--){let e=game.variantWatches[i];if(e.hp<=0&&!e.variantRewarded){e.variantRewarded=true;if(e.variant==='splitter'&&game.enemies.length<232){for(let j=0;j<3;j++)spawnEnemy('puff',e.x+(j-1)*24,e.y+10);}game.pickups.push({x:e.x,y:e.y,kind:'chest',life:90});game.variantWatches.splice(i,1);}else if(Math.hypot(e.x-game.hero.x,e.y-game.hero.y)>2000)game.variantWatches.splice(i,1);}
 // Final-stage boss identity follows its randomised pool; victory never requires a specific skin.
 if(game.bossesDefeated>=game.bossGoal&&game.finalBossKind&&!game.bossKilled&&game.enemies.some(e=>e.finalBoss&&e.hp<=0))game.bossKilled=true;
}
function renderEnemyVariant(e){if(e.hp<=0)return;const v=ELITE_VARIANTS[e.variant],q=e.intent;ctx.save();
 if(v){ctx.strokeStyle=v.color;ctx.lineWidth=2.2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.ellipse(e.x,e.y+2,e.r+9,(e.r+9)*.55,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.font='bold 11px "PaperHand","Kaiti SC",serif';ctx.textAlign='center';ctx.strokeStyle='#fff1db';ctx.lineWidth=3;ctx.strokeText(v.name,e.x,e.y-e.r*2-12);ctx.fillStyle='#776178';ctx.fillText(v.name,e.x,e.y-e.r*2-12);}
 if(q){ctx.font='bold 20px PaperHand';ctx.textAlign='center';ctx.fillStyle=['mend','summon'].includes(q.type)?q.color:'#c73d52';ctx.fillText(q.type==='summon'?'♪':q.type==='mend'?'+':'!',e.x,e.y-e.r*2-8);}
 ctx.restore();}
