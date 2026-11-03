'use strict';
// A single director owns ordinary spawns. Families are authored rosters, not a growing random pool.
const ENCOUNTER_FAMILIES=[
 {key:'ink',name:'墨团游行',color:'#9c8ab1',icon:'imp0',at:0,roster:[['imp','chaser',0],['slime','brute',12],['scribble','weaver',18],['beetle','charger',25],['puff','hopper',32]]},
 {key:'garden',name:'花园来信',color:'#91aa80',icon:'mushroom0',at:45,roster:[['worm','weaver',0],['rabbit','runner',0],['mushroom','fan',8],['sprout','fan',15],['snail','brute',20],['hedgehog','charger',28],['dandelion','radial',38]]},
 {key:'pond',name:'水岸巡游',color:'#7eabb8',icon:'frog0',at:100,roster:[['crab','flanker',0],['starfish','weaver',0],['frog','leaper',8],['jelly','fan',16],['turtle','guard',25],['dragonfly','charger',35]]},
 {key:'toys',name:'午夜玩具',color:'#a78ea9',icon:'clockwork0',at:160,roster:[['skeleton','dodger',0],['mimic','charger',0],['painter','zone',8],['clockwork','cross',18],['stitch','healer',28],['doll','summoner',40],['knight','brute',45]]},
 {key:'dunes',name:'风与花种',color:'#bba36f',icon:'cactus0',at:230,roster:[['fox','runner',0],['bee','orbiter',0],['cactus','radial',8],['golem','stomper',18],['icecube','skater',28]]},
 {key:'dream',name:'星夜织梦',color:'#9c9dbd',icon:'moth0',at:300,roster:[['bat','runner',0],['spider','weaver',0],['balloon','orbiter',5],['ghost','sniper',10],['moth','orbitFan',18],['owl','sniper',28]]}
];
const ENCOUNTER_ROLES={chaser:'追逐',brute:'重装',weaver:'曲线移动',charger:'蓄力冲撞',hopper:'跳步',runner:'高速追逐',fan:'扇形弹幕',radial:'环形弹幕',flanker:'侧移包抄',leaper:'定点跃击',guard:'正面护盾',dodger:'受击闪步',zone:'落点封锁',cross:'十字延迟爆破',healer:'同族治疗',summoner:'同族召唤',orbiter:'绕行',stomper:'近身震地',skater:'加速滑行',sniper:'瞄准射击',orbitFan:'绕行扇射'};
const ENCOUNTER_INDEX=new Map();for(const f of ENCOUNTER_FAMILIES)for(const [kind,role,delay]of f.roster)ENCOUNTER_INDEX.set(kind,{family:f.key,role,unlock:f.at+delay});
function encounterChapter(t){let index=0;while(index<ENCOUNTER_FAMILIES.length-1&&t>=ENCOUNTER_FAMILIES[index+1].at)index++;return index;}
function encounterPlan(t){const chapter=encounterChapter(t),primary=ENCOUNTER_FAMILIES[chapter],age=t-primary.at,beat=age%24,rest=beat>=18,boss=game.enemies.some(e=>e.boss&&e.hp>0);return{chapter,primary,age,beat,rest,boss,cap:boss?28+chapter*10:48+chapter*22,batch:boss?2:3+chapter,interval:rest?3.2:Math.max(.85,1.35-chapter*.1),phase:rest?'rest':beat<10?'advance':'pressure'};}
function initEncounterDirector(){game.director={chapter:-1,clock:2,batch:0,eliteClock:42,history:[],spawns:0};}
function decorateEncounterEnemy(e){const entry=ENCOUNTER_INDEX.get(e.kind);if(entry){e.family=entry.family;e.role=entry.role;}else if(e.boss){e.family=({bossRose:'garden',bossCrab:'pond',bossFrog:'pond',bossOwl:'dream',bossClock:'toys',bossMoon:'dream',bossCloud:'dream',bossSerpent:'dream',boss:'ink'})[e.kind];}}
function familyMinionKind(e){const family=ENCOUNTER_FAMILIES.find(f=>f.key===e.family)||ENCOUNTER_FAMILIES[encounterChapter(game.t)];return family.roster[0][0];}
function spawnFamilyMinion(e,x,y){if(game.enemies.length>=200)return;spawnEnemy(familyMinionKind(e),x,y);const child=game.enemies.at(-1);child.summoned=true;child.xp=Math.min(child.xp,1);child.attackCd=2;return child;}
function seedOpeningEncounter(demo){const n=demo?22:12;for(let i=0;i<n;i++){const a=i/n*TAU,r=310+(i%4)*55;spawnEnemy('imp',game.hero.x+Math.cos(a)*r,game.hero.y+Math.sin(a)*r);}}
function spawnEncounterAmbush(event){const family=ENCOUNTER_FAMILIES[encounterChapter(game.t)];for(let i=0;i<4&&game.enemies.length<180;i++){const a=i*TAU/4;spawnEnemy(family.roster[0][0],event.x+Math.cos(a)*290,event.y+Math.sin(a)*290);}}
function encounterSquad(plan,serial){
 // One support family may accompany the primary after its introduction, never all six at once.
 const secondary=plan.chapter>0&&plan.age>16&&serial%4===3;
 const family=secondary?ENCOUNTER_FAMILIES[plan.chapter-1]:plan.primary;
 const roster=family.roster.filter(([, ,delay])=>game.t>=family.at+delay);
 const front=roster.filter(([,r])=>['chaser','brute','weaver','runner','hopper','flanker','dodger','skater','orbiter'].includes(r));
 const specialists=roster.filter(x=>!front.includes(x));
 const livingSpecial=game.enemies.filter(e=>e.hp>0&&['fan','radial','sniper','orbitFan','healer','summoner','cross','zone','leaper'].includes(e.role)).length;
 const count=plan.rest?1:plan.batch,squad=[];
 for(let i=0;i<count;i++){
  let choice=front[(serial+i)%front.length]||roster[0];
  if(i===count-1&&specialists.length&&livingSpecial<4+plan.chapter*2&&!plan.rest)choice=specialists[serial%specialists.length];
  squad.push(choice[0]);
 }
 return {family,squad};
}
function updateEncounterDirector(dt){
 const d=game.director;if(!d)initEncounterDirector();const director=game.director,plan=encounterPlan(game.t);
 if(director.chapter!==plan.chapter){director.chapter=plan.chapter;director.clock=Math.max(director.clock,1.5);director.history.push({at:game.t,family:plan.primary.key});director.history=director.history.slice(-12);$('wave').textContent=plan.primary.name;}
 director.clock-=dt;director.eliteClock-=dt;
 if(director.clock<=0){director.clock=plan.interval;const alive=game.enemies.filter(e=>e.hp>0).length;if(alive<plan.cap){const {family,squad}=encounterSquad(plan,director.batch),angle=(director.batch*2.399963)%TAU;
  // Adjacent arrivals form a readable front; alternate flanks leave an escape lane.
  for(let i=0;i<squad.length&&game.enemies.length<plan.cap;i++){const a=angle+(i-(squad.length-1)/2)*.115;const rx=viewW*.56+90,ry=viewH*.56+90;spawnEnemy(squad[i],game.hero.x+Math.cos(a)*rx,game.hero.y+Math.sin(a)*ry);director.spawns++;}
  director.batch++;
 }}
 if(!game.demo&&director.eliteClock<=0&&!plan.boss&&!plan.rest){director.eliteClock=38;const choices=game.enemies.filter(e=>e.hp>0&&!e.boss&&!e.elite&&e.family===plan.primary.key&&distance(e,game.hero)>260);const e=choices[0];if(e&&game.variantWatches.filter(e=>e.hp>0).length<3){const key=['giant','swift','armored','mender','stormcaller','summoner'][Math.min(5,plan.chapter)];applyEnemyVariant(e,key);}}
}
function enemyDamageMultiplier(e,sx,sy){
 let factor=e.variant==='armored'?.72:1;
 // Turtle only blocks frontal hits while braced; flanking or waiting opens its shell.
 if(e.guarding){const toHero=Math.atan2(game.hero.y-e.y,game.hero.x-e.x),toHit=Math.atan2(sy-e.y,sx-e.x);if(Math.cos(toHero-toHit)>.15)factor*=.4;}
 return factor;
}
function fillEncounterJournal(){const holder=document.getElementById('enemy-journal');if(!holder)return;holder.innerHTML=ENCOUNTER_FAMILIES.map(f=>`<section><h3><img src="${icon(f.icon)}" alt="">${f.name}<small>${timeText(f.at)} 起</small></h3><div class="enemy-roster">${f.roster.map(([kind,role,delay])=>{const spec=enemyTypes[kind];return `<article><img src="${icon(kind==='knight'?kind:kind+'0')}" alt=""><div><strong>${spec.name||({imp:'小墨团',slime:'软糖墨团',beetle:'墨甲虫',rabbit:'纸兔',snail:'小蜗牛',mushroom:'蘑菇',jelly:'水母',fox:'纸狐',spider:'小蜘蛛',bat:'夜蝠',ghost:'幽灵',knight:'黑甲守卫'})[kind]}</strong><small>${ENCOUNTER_ROLES[role]} · ${timeText(f.at+delay)}</small><small>体型 ${spec.r} · 速度 ${spec.speed} · 生命 ${spec.hp}</small></div></article>`;}).join('')}</div></section>`).join('');}
