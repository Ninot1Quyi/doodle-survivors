const assert=require('assert'),fs=require('fs'),vm=require('vm');
let filterWrites=0,draws=0,canvases=0,nodes=new Map(),stored={};
function painter(){return new Proxy({filter:'none',drawImage(...args){draws++;if(args[0]?.width===360&&args[0]?.height===400)assert.deepEqual(args.slice(3),[180,200],'bake downsamples the 2x source to 1x');}},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>{if(k==='filter')filterWrites++;o[k]=v;return true;}});}
function node(){let n={style:{},append(){},getContext:painter};Object.defineProperty(n,'id',{set(v){nodes.set(v,n);}});return n;}
nodes.set('atmosphere-settings',node());
const sprites={};for(let key of ['tree','pillar','arch','rock','stump','bigMushroom','paperHouse'])sprites[key]={w:180,h:200,img:{width:360,height:400}};
const biomeSizes={mushroomArch:[320,330],whale:[390,236],glassPalace:[370,366],clockTower:[218,377],bookBridge:[327,185],duneFlower:[199,240],kiteMill:[238,322],kiteTree:[207,285],moonRose:[144,219]};for(let [name,[w,h]] of Object.entries(biomeSizes))sprites['biome_'+name]={w,h,img:{width:w*2,height:h*2}};
const sandbox={Math,Object,Map,Art:{sprites},document:{createElement:()=>{canvases++;return node();},getElementById:k=>nodes.get(k)},localStorage:{getItem:k=>stored[k]??null,setItem:(k,v)=>stored[k]=v},ctx:painter(),game:{hero:{x:0,y:70}},cam:{x:0,y:0},viewW:1200,viewH:800,realTime:0,reducedEffects:false};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/../dist/focus.js','utf8'),sandbox);let run=s=>vm.runInContext(s,sandbox);
run('initFocus()');let stats=run('getFocusStats()');assert.equal(stats.sources,16);assert(stats.variants<=40&&stats.pixels<=3000000);let initCanvases=canvases,initFilters=filterWrites;
run('initFocus()');assert.equal(canvases,initCanvases,'repeat run initialization reuses baked textures');
assert.equal(run("renderFocusedProp({name:'tree',x:80,y:70,scale:1})"),false,'hero vicinity stays crisp');
assert.equal(run("renderFocusedProp({name:'tree',x:750,y:70,scale:1},.35)"),true,'far scenery uses blurred texture');
assert.equal(run("renderFocusedProp({name:'hero',x:750,y:70,scale:1})"),false,'actors are excluded');
for(let key of Object.keys(biomeSizes)){assert.equal(run(`renderFocusedProp({name:'biome_${key}',x:850,y:70,scale:1})`),true,key+' supports far blur');assert.equal(run(`renderFocusedProp({name:'biome_${key}',x:80,y:70,scale:1})`),false,key+' stays clear near hero');}
run("for(let i=0;i<600;i++)renderFocusedProp({name:'tree',x:750,y:70,scale:1})");assert.equal(filterWrites,initFilters,'runtime never changes a canvas filter');assert.equal(canvases,initCanvases,'runtime never allocates a canvas');
run('reducedEffects=true');assert.equal(run("renderFocusedProp({name:'tree',x:450,y:70,scale:1})"),false,'reduced effects removes middle-distance blur');
let checkbox=nodes.get('scenery-focus');checkbox.checked=false;checkbox.onchange();assert.equal(stored.paperFocus,'false');assert.equal(run("renderFocusedProp({name:'tree',x:750,y:70,scale:1})"),false);
console.log('PASS: finite one-time focus cache, clear hero vicinity, scenery-only blur, zero runtime filter writes/canvas allocations, accessibility and preference toggle.');console.log(JSON.stringify(stats));
