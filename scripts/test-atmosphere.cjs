const assert=require('assert'),fs=require('fs'),vm=require('vm');
let draws=0,stored={},nodes=new Map();
const gradient={addColorStop(){}};
const painter=new Proxy({createRadialGradient:()=>gradient,measureText:s=>({width:s.length*12}),drawImage(){draws++;}},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function node(){let n={style:{},append(){},getContext:()=>painter};Object.defineProperty(n,'id',{set(value){nodes.set(value,n);}});return n;}
nodes.set('atmosphere-settings',node());
const sandbox={Math,Number,Object,document:{createElement:node,getElementById:id=>nodes.get(id)},localStorage:{getItem:k=>stored[k]??null,setItem:(k,v)=>stored[k]=v},matchMedia:()=>({matches:false}),ctx:painter,W:1280,H:720};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../public/atmosphere.js','utf8'),sandbox);const run=s=>vm.runInContext(s,sandbox);
run('initAtmosphere();setupAtmosphereUI()');assert.equal(run('weatherSpeed()'),1);assert.equal(run('atmosphere.rain.length'),48);
run('updateAtmosphere(55)');assert.equal(run('weatherSpeed()'),.97);run('updateAtmosphere(70)');assert.equal(run('weatherSpeed()'),.96);
// The effect never allocates more rain particles across weather cycles.
run('for(let i=0;i<7200;i++){updateAtmosphere(1/60);renderAtmosphere()}');assert.equal(run('atmosphere.rain.length'),48);assert.equal(draws,7200,'idle atmosphere uses one cached edge draw per frame');
run('atmosphereHurt();updateAtmosphere(.2);atmosphereHurt()');assert(run('atmosphere.hurt')<.3,'repeated hits cannot extend the first short hurt pulse');run('updateAtmosphere(.23)');assert.equal(run('atmosphere.hurt'),0);
let checkbox=nodes.get('reduced-effects');checkbox.checked=true;checkbox.onchange();assert.equal(stored.reducedEffects,'true');run('atmosphere.mode=2;atmosphere.nextFlash=0;updateAtmosphere(.016)');assert.equal(run('atmosphere.flash'),0);assert.equal(run('weatherSpeed()'),.96,'accessibility setting preserves gameplay rules');
run('initAtmosphere()');assert.equal(run('atmosphere.mode'),0);assert.equal(run('atmosphere.hurt'),0);assert.equal(run('reducedEffects'),true);
console.log('PASS: weather cycle, bounded rain, short non-stacking hurt, reduced effects persistence, unchanged weather rules, screen-space draw smoke.');
