'use strict';
// One frame-driven reward session; no timers survive a selection or a new run.
let rewardSession=null;
function experienceForLevel(level){return 2*(level===1?26:Math.round((16+level*6.5+level**1.33)*1.9));}
const REWARD_AUTO_SECONDS=3;
const REWARD_ROLES={
 pencil:'ranged',ribbon:'ranged',star:'ranged',plane:'ranged',marble:'ranged',rocket:'ranged',music:'ranged',leaf:'ranged',compass:'control',
 book:'guard',scissors:'melee',saber:'melee',lance:'melee',whip:'melee',yoyo:'melee',gear:'melee',shield:'guard',
 tornado:'area',fire:'area',ink:'area',rose:'area',firecracker:'area',stamp:'area',mine:'area',roller:'area',meteor:'area',umbrella:'area',
 lightning:'chain',thread:'chain',kite:'chain',ruler:'beam',prism:'beam',camera:'control',bubble:'control',bell:'control',frost:'control',chalk:'control',magnetArm:'control',portal:'control',void:'control',turret:'summon',foxspirit:'summon'
};
function rewardRoles(key){
 if(REWARD_ROLES[key])return [REWARD_ROLES[key]];
 const recipe=RECIPES.find(r=>r[2]===key);
 return recipe?[...new Set(recipe.slice(0,2).flatMap(k=>rewardRoles(k)))]:[];
}
function rewardBuildContext(){
 const active=Object.keys(game.weapons).filter(k=>game.weapons[k]>0&&!weaponData[k].passive);
 const roles=new Set(active.flatMap(k=>rewardRoles(k)));
 return {active,roles,early:game.t<90&&active.length<4&&!game.fusions.length};
}
function rewardNewCandidates(fresh){
 const {early,roles}=rewardBuildContext();
 if(early){const novel=fresh.filter(k=>rewardRoles(k).some(role=>!roles.has(role)));return novel.length?novel:fresh;}
 const partners=fresh.filter(k=>RECIPES.some(([a,b,c])=>!game.fusions.includes(c)&&((a===k&&game.weapons[b]>0)||(b===k&&game.weapons[a]>0))));
 return partners.length&&Math.random()<.75?partners:fresh;
}
function rewardRecommendation(choices,rarities=upgradeRarity){
 const hp=game.hero.hp/game.hero.maxHp,{active,roles,early}=rewardBuildContext();
 let best={index:0,score:-Infinity,reason:'强化当前火力',stage:early?'diversify':'build'};
 choices.forEach((key,index)=>{
  let score=0,reason='强化现有构筑',d=weaponData[key],lv=game.weapons[key]||0,gain=d?Math.min(rarities[index]||1,d.max-lv):0;
  if(key.startsWith('fusion:')){score=150;reason='材料已齐 · 进化并释放一个武器槽';}
  else if(key==='restore'){score=hp<.3?180:hp<.6?100:5;reason='恢复生命，继续战斗';}
  else if(d){
   const partner=RECIPES.filter(([a,b,c])=>!game.fusions.includes(c)&&(a===key||b===key)).map(([a,b])=>a===key?b:a).filter(k=>!game.consumed.has(k)).sort((a,b)=>game.weapons[b]-game.weapons[a])[0];
   const partnerLevel=partner?game.weapons[partner]||0:0,newRole=rewardRoles(key).some(role=>!roles.has(role));
   if(d.passive){score=35;if(['crown','candle'].includes(key)){score=early?38:55+active.length*4;reason='后期构筑 · 增益覆盖已装备武器';}else if(key==='heart'&&hp<.6){score=hp<.3?180:hp<.45?125:80;reason='生命偏低 · 增加上限并立即回血';}else if(['regen','armor'].includes(key)&&hp<.55){score=hp<.3?105:70;reason='生存补强 · 支持持续战斗';}else reason='补充随身护符';}
   else if(early){
    score=lv?42+Math.min(lv,5)*3+gain*2:(newRole?100:73)+gain*2;
    reason=lv?'早期火力 · 强化已有武器':newRole?'前期多元化 · 补充新的攻击方式':'前期多元化 · 增加一件武器';
    if(!lv&&partnerLevel>0){score+=5;reason+='，兼顾合成搭档';}
   }else{
    score=lv?65+Math.min(lv,5)*4+gain*3:15;
    reason=lv?'后期构筑 · 集中强化已装备主力':'当前构筑外的新武器';
    if(d.evolved&&lv){score+=24;reason='后期构筑 · 强化已进化武器';}
    if(partnerLevel>0){
     if(lv){score+=10+partnerLevel*3;if(lv+gain>=d.max){score+=20;reason=partnerLevel>=weaponData[partner].max?'本次满级 · 下一次即可合成':'合成准备 · 将现有材料升至满级';}else reason='后期构筑 · 推进已有合成路线';}
     else if(partnerLevel>=3){score=80+partnerLevel*4+gain*2;reason='后期构筑 · 补齐主力的合成搭档';}
    }
    if(!lv&&active.length<2&&newRole){score=95;reason='补足攻击覆盖 · 当前武器数量仍少';}
   }
  }
  if(score>best.score)best={index,score,reason,stage:early?'diversify':'build'};
 });return best;
}
function closeRewardSession(){rewardSession=null;}
function beginRewardSession(chest){
 initRewardArt();
 rewardSession={chest,age:0,remaining:REWARD_AUTO_SECONDS,locked:chest,burst:false,particles:[],recommended:0,lastSecond:-1,stops:0,nextTick:.82,tickIndex:0,jackpot:null};
 const overlay=$('upgrades');overlay.classList.toggle('treasure-mode',chest);overlay.classList.toggle('opening-chest',chest);overlay.classList.remove('rewards-ready','chest-open','jackpot-won');overlay.classList.toggle('reduced-rewards',reducedEffects);$('reward-time-fill').style.transform='scaleX(1)';
 $('chest-stage').classList.toggle('hidden',!chest);$('skip-chest').onclick=()=>{if(rewardSession?.locked){rewardSession.skip=true;rewardSession.age=reducedEffects?1.05:3.65;updateRewardSession(0);}};$('reward-subtitle').textContent=chest?'宝藏正在苏醒…':'选择一个灵感，继续你的冒险。';
 $('reward-status').textContent=chest?'开启宝箱…':'3 秒后自动选择推荐';
 Sound.play(chest?'chestRise':'level',chest?.65:.5,1,.1);
}
function prepareRewardChoices(){
 if(!rewardSession||state!=='upgrade')return;
 const rec=rewardRecommendation(upgradeChoices);rewardSession.recommended=rec.index;rewardSession.remaining=REWARD_AUTO_SECONDS;rewardSession.lastSecond=-1;
 const cards=document.querySelectorAll('#choices .choice');
 cards.forEach((card,i)=>{card.querySelectorAll('.recommend-badge,.recommend-reason,.fusion-materials').forEach(n=>n.remove());card.style.setProperty('--reveal-delay',`${i*.14}s`);card.classList.toggle('recommended',i===rec.index);card.disabled=rewardSession.locked;card.setAttribute('aria-label',`${i===rec.index?'推荐：':''}${card.textContent}`);
  if(i===rec.index){const badge=document.createElement('span');badge.className='recommend-badge';badge.textContent=rec.reason.startsWith('生命偏低')||rec.reason.startsWith('恢复生命')?'✦ 先照顾自己':rec.stage==='diversify'?'✦ 多元灵感':'✦ 构筑推荐';card.append(badge);const why=document.createElement('span');why.className='recommend-reason';why.textContent=rec.reason;card.append(why);}
  const key=upgradeChoices[i];if(key.startsWith('fusion:')){const recipe=RECIPES.find(r=>r[2]===key.slice(7));if(recipe){const row=document.createElement('div');row.className='fusion-materials';row.innerHTML=`<span class="consume-label">消耗材料</span><span><img src="${icon(recipe[0])}" alt="${weaponData[recipe[0]].name}"><small>${weaponData[recipe[0]].name}</small></span><b>＋</b><span><img src="${icon(recipe[1])}" alt="${weaponData[recipe[1]].name}"><small>${weaponData[recipe[1]].name}</small></span><b>→</b><img src="${icon(recipe[2])}" alt="${weaponData[recipe[2]].name}">`;card.append(row);}}
 });
 $('reroll').disabled=rewardSession.locked||game.rerolls<=0;
 if(!rewardSession.locked){$('reward-status').textContent='3 秒后自动选择推荐 · 1 / 2 / 3 可立即选择';$('upgrades').classList.add('rewards-ready');cards[rec.index]?.focus();}
}
function rewardBurst(){
 const session=rewardSession;if(!session)return;session.burst=true;if(!session.jackpot)Sound.play('chestBurst',.48,1,.1);
 const count=reducedEffects?32:100;
 for(let i=0;i<count;i++){const side=i%2?-1:1;session.particles.push({x:side<0?.18:.82,y:.66,vx:-side*(.12+Math.random()*.5),vy:-.35-Math.random()*.7,angle:Math.random()*6,spin:(Math.random()-.5)*9,size:4+Math.random()*8,ribbon:i%4===0,color:['#ffcd65','#e693b9','#a5c9ec','#b8d4a6','#e6b0ed'][i%5],life:3.6+Math.random()});}
}
function drawRewardConfetti(dt){
 const session=rewardSession,c=$('reward-confetti'),g=c.getContext('2d'),rect=$('upgrades').getBoundingClientRect();
 if(c.width!==Math.round(rect.width)||c.height!==Math.round(rect.height)){c.width=Math.round(rect.width);c.height=Math.round(rect.height);}
 g.clearRect(0,0,c.width,c.height);
 for(const p of session.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.42*dt;p.vx*=Math.exp(-dt*.5);p.angle+=p.spin*dt;p.life-=dt;g.save();g.translate(p.x*c.width,p.y*c.height);g.rotate(p.angle);g.globalAlpha=Math.min(1,p.life);g.fillStyle=p.color;g.strokeStyle=p.color;if(p.ribbon){g.lineWidth=3;g.beginPath();g.moveTo(0,0);g.bezierCurveTo(16,-16,-12,-28,6,-48);g.stroke();}else{g.scale(1,.35+Math.abs(Math.sin(p.angle))*.65);g.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65);}g.restore();}
 session.particles=session.particles.filter(p=>p.life>0&&p.y<1.2);
}
// Three matching reel results grant ONE three-level award, without a choice click.
function chestTripleKey(){
 const key=upgradeChoices[0];
 return upgradeChoices.length===3&&upgradeChoices.every(k=>k===key)&&weaponData[key]&&!game.consumed.has(key)&&game.weapons[key]<weaponData[key].max?key:null;
}
function awardChestTriple(s){
 const key=chestTripleKey();if(!key||s.jackpot)return false;
 const before=game.weapons[key]||0,gain=Math.min(3,weaponData[key].max-before);
 s.jackpot={key,before,gain,after:before+gain,remaining:2.2};s.locked=false;
 game.weapons[key]=before+gain;game.clocks[key]=.1;game.luckyNext=false;
 if(key==='heart'){game.hero.maxHp+=25*gain;game.hero.hp=Math.min(game.hero.maxHp,game.hero.hp+50*gain);}
 updateWeaponUI();updateHUD();
 $('upgrades').classList.remove('opening-chest');$('upgrades').classList.add('jackpot-won');
 document.querySelector('.up-top h2').textContent='三连大奖！';$('upgrade-level').textContent='JACKPOT';
 $('reward-subtitle').textContent=weaponData[key].name+' · Lv.'+before+' → Lv.'+(before+gain);
 $('reward-status').textContent=gain===3?'三个相同！已直接连升三级':'三个相同！已升至满级（+'+gain+'）';
 $('reroll').disabled=true;document.querySelectorAll('#choices .choice').forEach(c=>c.disabled=true);
 Sound.play('jackpot',.65,1,.1);return true;
}
function finishChestTriple(){
 if(!rewardSession?.jackpot)return;
 const j=rewardSession.jackpot;closeRewardSession();state='playing';$('upgrades').classList.add('hidden');Sound.duck(false);canvas.focus();
 banner('三连大奖 · '+weaponData[j.key].name+' +'+j.gain+' 级！');
}
function updateRewardSession(dt){
 const s=rewardSession;if(!s||state!=='upgrade'||document.hidden)return;
 s.age+=dt;
 if(s.jackpot){s.jackpot.remaining=Math.max(0,s.jackpot.remaining-dt);$('reward-time-fill').style.transform=`scaleX(${s.jackpot.remaining/2.2})`;drawChestCinema();drawRewardConfetti(dt);if(s.jackpot.remaining<=0)finishChestTriple();return;}
 if(s.locked){
  if(s.age>=.55)$('upgrades').classList.add('chest-open');
  const stops=reducedEffects?[.65,.75,.85]:[1.8,2.35,2.9];
  while(s.stops<3&&s.age>=stops[s.stops]){if(!s.skip)Sound.play('reelStop'+s.stops,.40,1,.02);s.stops++;}
  if(s.age>=s.nextTick&&s.age<2.87&&!reducedEffects&&!s.skip){Sound.play('reelTick',.16,.94+(s.tickIndex%4)*.035,.055);s.tickIndex++;s.nextTick=s.age+.065+.16*Math.pow((s.age-.8)/2.1,2);}
  if(s.age>=(reducedEffects?.9:3.05)&&!s.burst){if(chestTripleKey()){awardChestTriple(s);const j=s.jackpot;rewardBurst();s.jackpot=j;}else rewardBurst();}
  if(s.jackpot){drawChestCinema();drawRewardConfetti(dt);return;}
  if(s.age>=(reducedEffects?1.05:3.65)){s.locked=false;$('upgrades').classList.remove('opening-chest');$('reward-subtitle').textContent='带上一份灵感，继续你的旅程';prepareRewardChoices();Sound.play('chestReveal',.55,1,.1);}
 }
 else {s.remaining=Math.max(0,s.remaining-dt);const sec=Math.ceil(s.remaining);if(sec!==s.lastSecond){s.lastSecond=sec;$('reward-status').textContent=`${sec} 秒后自动选择推荐 · 1 / 2 / 3 可立即选择`;}$('reward-time-fill').style.transform=`scaleX(${s.remaining/REWARD_AUTO_SECONDS})`;if(s.remaining<=0){chooseUpgrade(s.recommended);return;}}
 if(s.chest){if(s.locked)drawChestCinema();drawRewardConfetti(dt);}
}

let bossCrayonReady=false;
function initBossCrayon(){
 if(bossCrayonReady)return;bossCrayonReady=true;
 const c=document.createElement('canvas');c.width=1200;c.height=62;const g=c.getContext('2d');let seed=747;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 // Separate, imperfect wax strokes. The paper shines through the pigment grain.
 const colors=['#cd3447','#c32b40','#df4650','#bd293c','#e44a50','#d43844'];
 g.lineCap='round';g.lineJoin='round';
 for(let j=0;j<35;j++){let y=12+rand()*38,x=8+rand()*17;g.strokeStyle=colors[j%colors.length];g.globalAlpha=.55+rand()*.35;g.lineWidth=2+rand()*6;g.beginPath();g.moveTo(x,y);for(let k=1;k<=24;k++)g.lineTo(x+(1170-x)*k/24,y+(rand()-.5)*5);g.stroke();}
 g.globalCompositeOperation='destination-out';
 for(let i=0;i<16500;i++){let x=rand()*1200,y=rand()*62;g.globalAlpha=.13+rand()*.65;g.fillRect(x,y,.35+rand()*1.5,.3+rand()*1.2);}
 // Longer pale scratches and uneven open edges are characteristic of a real crayon mark.
 for(let i=0;i<270;i++){let x=rand()*1200,y=rand()*62;g.globalAlpha=.15+rand()*.5;g.fillRect(x,y,2+rand()*7,.35+rand()*.6);}
 const url=c.toDataURL();$('boss-hud').style.setProperty('--boss-crayon',`url("${url}")`);
}
