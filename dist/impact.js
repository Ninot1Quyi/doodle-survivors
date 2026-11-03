'use strict';
const impactPalette=['#f2b865','#bc93d6','#e58c85','#82b9d5'];
function hitFeedback(e,crit,damage,cause='confetti',sx=e.x-1,sy=e.y,knock=0,style={}){
 if(!visible(e.x,e.y,100))return;
 e.hitPulse=.18;
 const heavy=crit||damage>=70||knock>=140;
 if(game.t>=(game.nextImpactAt||0)&&game.fx.length<190){
  game.nextImpactAt=game.t+(heavy?.025:.04);
  const pencil=style.weapon==='pencil',r=pencil?(crit?22:16):heavy?30+Math.min(16,damage*.05):20;
  game.fx.push({type:'inkhit',x:e.x,y:e.y-e.r*.35,life:heavy?.32:.22,max:heavy?.32:.22,r,seed:e.id+game.t,weapon:style.weapon,color:style.color||({burn:'#e9af75',freeze:'#a7cbdc',petals:'#cea3bb',soak:'#a7bdd3',erase:'#c7b5d9',crumple:'#d4b69c'}[cause]||impactPalette[e.id%4]),crit:heavy,cause,angle:Math.atan2(e.y-sy,e.x-sx)});
  particleBurst(e.x,e.y-e.r*.3,reducedEffects?2:heavy?9:3,impactPalette[e.id%4],heavy?230:130);
 }
 if(heavy&&game.impactCooldown<=0){game.hitStop=reducedEffects?.008:.045;game.impactCooldown=.18;game.shake=Math.max(game.shake,reducedEffects?.6:Math.min(6,3+damage*.015));if(!crit)Sound.play('heavyhit',.29,1,.2);}
}
function impactStar(x,y,r,angle,color,points=7){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.beginPath();
 for(let i=0;i<points*2;i++){let a=i*Math.PI/points,rr=i%2?r*.32:r*(i%3?.88:1.1),x=Math.cos(a)*rr,y=Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
 ctx.closePath();ctx.fillStyle=color;ctx.strokeStyle='#705273';ctx.lineWidth=1.8;ctx.fill();ctx.stroke();ctx.restore();
}
function renderImpact(f){
 if(!['inkhit','clash','explosion'].includes(f.type))return false;
 const u=clamp(1-f.life/f.max,0,1),burst=f.type==='explosion',clash=f.type==='clash',intensity=reducedEffects?.55:1;
 let r=f.r*(.55+Math.min(1,u*3)*.7)*intensity;
 ctx.save();ctx.globalAlpha=Math.min(1,(1-u)*2);
 if(!burst&&!clash&&f.weapon==='book'){renderBookContact(f,r,u);ctx.restore();return true;}
 if(!burst&&!clash&&f.weapon==='pencil'){renderPigmentContact(f,r,u);ctx.restore();return true;}
 if(!burst&&!clash&&['saber','lance','scissors','gear','leaf','thread','whip','plane','paladin'].includes(f.weapon)){renderCutContact(f,r,u);ctx.restore();return true;}
 if(!burst&&!clash&&renderMaterialImpact(f,r,u)){ctx.restore();return true;}
 if(burst){
  r=Math.min(205,f.r)*(.3+Math.sqrt(u)*.85);renderPolishedExplosion(f,r,u);
 }else{
  const a=f.angle??f.seed??0;
  impactStar(f.x+3,f.y+3,r,a,'#846079',clash?4:7);
  impactStar(f.x,f.y,r,a,f.color,clash?4:7);
  impactStar(f.x,f.y,r*.58,a+.2,'#fff3c7',clash?4:6);
  if(!reducedEffects)for(let i=0;i<5;i++){let aa=a+i*TAU/5,travel=r*(.6+u*1.3);ctx.save();ctx.translate(f.x+Math.cos(aa)*travel,f.y+Math.sin(aa)*travel);ctx.rotate(aa+u*2);ctx.fillStyle=i%2?'#f2ca80':f.color;ctx.strokeStyle='#96759a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-6);ctx.lineTo(6,-3);ctx.lineTo(3,5);ctx.lineTo(-5,3);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
 }
 ctx.restore();return true;
}

function queueDamageNumber(e,amount,crit){
 if(!visible(e.x,e.y,50))return;
 const previous=e.damageLabel;
 if(previous&&previous.life>0&&game.t<e.damageLabelUntil){previous.v+=Math.ceil(amount);if(crit){previous.big=true;previous.color='#f8d16b';}return;}
 if(game.numbers.length>=(reducedEffects?36:72))return;
 const label={x:e.x+rnd(-5,5),y:e.y-e.r-12,v:Math.ceil(amount),life:crit?.7:.5,max:crit?.7:.5,vy:crit?-56:-32,color:crit?'#f8d16b':'#fff7e1',big:crit};
 e.damageLabel=label;e.damageLabelUntil=game.t+.14;game.numbers.push(label);
}
