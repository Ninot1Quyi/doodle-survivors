'use strict';
// Anonymous run records only: no account, email, IP, or persistent player identifier.
const GlobalRuns = (() => {
  const endpoint='/api/stats',key='paper-stargazer-pending-runs';
  let current=null,last=performance.now(),wasPlaying=false,busy=false,known=null;
  let queue=new Map();
  try { const saved=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(saved))queue=new Map(saved.slice(-32).filter(x=>Array.isArray(x)&&typeof x[0]==='string'&&Number.isSafeInteger(x[1]))); } catch {}
  const byId=id=>document.getElementById(id);
  function persist(){try{localStorage.setItem(key,JSON.stringify([...queue].slice(-32)));}catch{}}
  function remember(){if(current)queue.set(current.id,Math.floor(current.activeMs));persist();}
  function display(data){
    if(!Number.isSafeInteger(data.runs)||!Number.isSafeInteger(data.activeMs))return;
    if(known&&(data.runs<known.runs||data.activeMs<known.activeMs))return;
    known=data;
    const runs=byId('global-runs'),time=byId('global-time'),note=byId('global-stats-note');
    if(runs)runs.textContent=data.runs.toLocaleString('zh-CN');
    const seconds=Math.floor(data.activeMs/1000),minutes=Math.floor(seconds/60),hours=Math.floor(minutes/60);
    if(time)time.textContent=hours?hours.toLocaleString('zh-CN')+' 小时 '+minutes%60+' 分':minutes?minutes+' 分 '+seconds%60+' 秒':seconds+' 秒';
    if(note)note.textContent='所有玩家一起留下的旅程 · 仅计战斗时间';
  }
  function unavailable(){const e=byId('global-stats-note');if(e)e.textContent=known?'统计暂未更新，稍后自动重试':'全服统计暂时连接不上，仍可正常游玩';}
  async function refresh(){try{const r=await fetch(endpoint,{cache:'no-store'});if(!r.ok)throw Error();display(await r.json());}catch{unavailable();}}
  async function flush(){
    remember();if(busy)return;busy=true;
    try{for(const [id,activeMs]of [...queue]){
      const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,activeMs}),keepalive:true});
      if(!r.ok)throw Error();display(await r.json());if(queue.get(id)===activeMs)queue.delete(id);persist();
    }}catch{unavailable();}finally{busy=false;}
  }
  function start(){remember();current={id:crypto.randomUUID(),activeMs:0};last=performance.now();wasPlaying=false;void flush();}
  function tick(now,playing){
    if(current&&wasPlaying&&playing)current.activeMs+=Math.min(250,Math.max(0,now-last));
    const stopped=wasPlaying&&!playing;last=now;wasPlaying=playing;
    if(stopped)void flush();
  }
  function finish(){remember();current=null;wasPlaying=false;void flush();}
  function leaving(){
    tick(performance.now(),false);remember();
    // Keep the pending record until an acknowledged retry. Duplicate delivery is safe.
    for(const [id,activeMs]of [...queue].slice(-4)){
      const body=new Blob([JSON.stringify({id,activeMs})],{type:'application/json'});
      if(navigator.sendBeacon)navigator.sendBeacon(endpoint,body);
    }
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)leaving();else{last=performance.now();wasPlaying=false;void flush();void refresh();}});
  window.addEventListener('pagehide',leaving);
  window.addEventListener('online',()=>{void flush();void refresh();});
  setInterval(()=>{if(!document.hidden){void flush();if(!current)void refresh();}},15000);
  void refresh();if(queue.size)void flush();
  return{start,tick,finish};
})();
