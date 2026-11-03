'use strict';
// One frame-driven reward session; no timers survive a selection or a new run.
let rewardSession=null;
function experienceForLevel(level){return level===1?26:Math.round((16+level*6.5+level**1.33)*1.9);}
function rewardRecommendation(choices){
 const hp=game.hero.hp/game.hero.maxHp;
 let best={index:0,score:-Infinity,reason:'强化当前火力'};
 choices.forEach((key,index)=>{let score=0,reason='尝试新的攻击方式',d=weaponData[key],lv=game.weapons[key]||0;
  if(key.startsWith('fusion:')){score=110;reason='两件材料已满级，可立即进化';}
  else if((key==='heart'||key==='restore')&&hp<.42){score=140;reason='生命偏低，优先恢复生存能力';}
  else if(d){score=lv?55+lv*4:20;reason=lv?'强化已装备武器':'拓展攻击方式';if(d.passive){score=key==='crown'||key==='candle'?48:25;reason='加强整套构筑';}if(!d.passive&&lv+(upgradeRarity[index]||1)>=d.max){score+=20;reason='本次强化可升至满级';}if(!lv&&RECIPES.some(([a,b])=>(a===key&&game.weapons[b]>0)||(b===key&&game.weapons[a]>0))){score=64;reason='补齐现有武器的合成搭档';}}
  if(score>best.score)best={index,score,reason};
 });return best;
}
function closeRewardSession(){rewardSession=null;}
function beginRewardSession(chest){
 rewardSession={chest,age:0,remaining:5,locked:chest,burst:false,particles:[],recommended:0,lastSecond:-1};
 const overlay=$('upgrades');overlay.classList.toggle('treasure-mode',chest);overlay.classList.toggle('opening-chest',chest);overlay.classList.remove('rewards-ready','chest-open');overlay.classList.toggle('reduced-rewards',reducedEffects);$('reward-time-fill').style.transform='scaleX(1)';
 $('chest-stage').classList.toggle('hidden',!chest);$('reward-subtitle').textContent=chest?'宝藏正在苏醒…':'选择一个灵感，继续你的冒险。';
 $('reward-status').textContent=chest?'开启宝箱…':'5 秒后自动选择推荐';
 Sound.play(chest?'chestRise':'level',chest?.65:.5,1,.1);
}
function prepareRewardChoices(){
 if(!rewardSession||state!=='upgrade')return;
 const rec=rewardRecommendation(upgradeChoices);rewardSession.recommended=rec.index;rewardSession.remaining=5;rewardSession.lastSecond=-1;
 const cards=document.querySelectorAll('#choices .choice');
 cards.forEach((card,i)=>{card.querySelectorAll('.recommend-badge,.recommend-reason,.fusion-materials').forEach(n=>n.remove());card.style.setProperty('--reveal-delay',`${i*.14}s`);card.classList.toggle('recommended',i===rec.index);card.disabled=rewardSession.locked;card.setAttribute('aria-label',`${i===rec.index?'推荐：':''}${card.textContent}`);
  if(i===rec.index){const badge=document.createElement('span');badge.className='recommend-badge';badge.textContent='✦ 默认推荐';card.append(badge);const why=document.createElement('span');why.className='recommend-reason';why.textContent=rec.reason;card.append(why);}
  const key=upgradeChoices[i];if(key.startsWith('fusion:')){const recipe=RECIPES.find(r=>r[2]===key.slice(7));if(recipe){const row=document.createElement('div');row.className='fusion-materials';row.innerHTML=`<span class="consume-label">消耗材料</span><span><img src="${icon(recipe[0])}" alt="${weaponData[recipe[0]].name}"><small>${weaponData[recipe[0]].name}</small></span><b>＋</b><span><img src="${icon(recipe[1])}" alt="${weaponData[recipe[1]].name}"><small>${weaponData[recipe[1]].name}</small></span><b>→</b><img src="${icon(recipe[2])}" alt="${weaponData[recipe[2]].name}">`;card.append(row);}}
 });
 $('reroll').disabled=rewardSession.locked||game.rerolls<=0;
 if(!rewardSession.locked){$('reward-status').textContent='5 秒后自动选择推荐 · 1 / 2 / 3 可立即选择';$('upgrades').classList.add('rewards-ready');cards[rec.index]?.focus();}
}
function rewardBurst(){
 const session=rewardSession;if(!session)return;session.burst=true;Sound.play('chestBurst',.8,1,.1);
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
function updateRewardSession(dt){
 const s=rewardSession;if(!s||state!=='upgrade'||document.hidden)return;
 s.age+=dt;
 if(s.locked){if(s.age>=.55&&!s.burst){$('upgrades').classList.add('chest-open');rewardBurst();}if(s.age>=1.45){s.locked=false;$('upgrades').classList.remove('opening-chest');$('reward-subtitle').textContent='三份宝藏灵感 · 选择一份带走';prepareRewardChoices();Sound.play('chestReveal',.55,1,.1);}}
 else {s.remaining=Math.max(0,s.remaining-dt);const sec=Math.ceil(s.remaining);if(sec!==s.lastSecond){s.lastSecond=sec;$('reward-status').textContent=`${sec} 秒后自动选择推荐 · 1 / 2 / 3 可立即选择`;}$('reward-time-fill').style.transform=`scaleX(${s.remaining/5})`;if(s.remaining<=0){chooseUpgrade(s.recommended);return;}}
 if(s.chest)drawRewardConfetti(dt);
}
