const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('public/game.js','utf8');
function node(){return {style:{},firstElementChild:{style:{}},classList:{values:new Set(),add(v){this.values.add(v)},remove(v){this.values.delete(v)}},events:{},addEventListener(n,fn){this.events[n]=fn},getBoundingClientRect(){return {left:10,top:20,width:390,height:844}},setPointerCapture(id){this.capture=id},hasPointerCapture(id){return this.capture===id},releasePointerCapture(){this.capture=null}}}
const canvas=node(),joystick=node(),app=node(),window=node(),document=node();
const context=vm.createContext({canvas,window,document,$:id=>id==='joystick'?joystick:app,state:'playing',joy:{x:0,y:0}});
vm.runInContext(source.slice(source.indexOf('let joyId=null,'),source.indexOf('setupExpansionUI();')),context);
const read=s=>vm.runInContext(s,context),fire=(name,id,x,y,type='touch')=>canvas.events[name]({pointerId:id,clientX:x,clientY:y,pointerType:type,preventDefault(){}});
fire('pointerdown',1,100,400);assert.equal(read('joyId'),1);assert.equal(joystick.style.left,'90px');assert.equal(joystick.style.top,'380px');assert.equal(read('joy.x'),0);assert(joystick.classList.values.has('active'));
fire('pointermove',1,129,400);assert.equal(read('joy.x'),1);
fire('pointerdown',2,180,300);assert.equal(read('joyId'),1,'second finger cannot steal movement');fire('pointerup',2);assert.equal(read('joyId'),1,'other pointer release cannot stop movement');
fire('pointermove',1,390,400);assert.equal(read('joy.x'),1,'drag may leave left half');fire('pointerup',1);assert.equal(read('joyId'),null);assert.equal(read('joy.x'),0);assert(!joystick.classList.values.has('active'));
fire('pointerdown',3,300,400);assert.equal(read('joyId'),3,'right half can also start movement');assert.equal(joystick.style.left,'290px');fire('pointerup',3);fire('pointerdown',4,100,300,'mouse');assert.equal(read('joyId'),null,'mouse not hijacked');
fire('pointerdown',5,150,250);assert.equal(joystick.style.top,'230px','new touch moves origin');fire('pointercancel',5);assert.equal(read('joyId'),null);
fire('pointerdown',6,150,250);fire('lostpointercapture',6);assert.equal(read('joyId'),null);
fire('pointerdown',7,150,250);context.state='paused';fire('pointermove',7,170,250);assert.equal(read('joyId'),null,'interruption releases');fire('pointerdown',8,100,300);assert.equal(read('joyId'),null,'menus cannot start movement');context.state='playing';fire('pointerdown',9,100,300);window.events.resize();assert.equal(read('joyId'),null);
const scaleSource=source.slice(source.indexOf('function displayScale'),source.indexOf('function resize'));
vm.runInContext(scaleSource,context);const scale=(w,h,d,q=3)=>read(`displayScale(${w},${h},${d},${q})`);
assert.equal(scale(390,844,3),3);assert.equal(scale(844,390,3),3);assert.equal(scale(390,844,2),2);assert.equal(scale(390,844,3,2),2);assert.equal(scale(1440,900,1),1);assert(scale(2732,2048,3)**2*2732*2048<=4000001);
console.log('PASS: floating origin, bounded movement, repeated gestures, multi-touch ownership, whole-canvas initiation, mouse exclusion, cancellation, capture loss, paused state, resize, native 2x/3x mobile density and 4 MP budget.');
// A GPU-bound device can have slow frames while JS work remains low.
const adaptive=source.slice(source.indexOf("if(state==='playing'&&perfStats.frames%120===0)"),source.indexOf('\n}',source.indexOf("if(state==='playing'&&perfStats.frames%120===0)")));
const quality=vm.createContext({state:'playing',renderScale:3,resolutionRecoveryFrame:0,perfStats:{frames:120,frameMs:30,workMs:2},resize(){}});
vm.runInContext(adaptive,quality);assert.equal(quality.renderScale,2.75);assert.equal(quality.resolutionRecoveryFrame,1020);
quality.perfStats={frames:240,frameMs:16.7,workMs:2};vm.runInContext(adaptive,quality);assert.equal(quality.renderScale,2.75,'no immediate quality bounce');
quality.perfStats={frames:1080,frameMs:16.7,workMs:2};vm.runInContext(adaptive,quality);assert.equal(quality.renderScale,3);
quality.renderScale=2;quality.perfStats={frames:1200,frameMs:30,workMs:2};vm.runInContext(adaptive,quality);assert.equal(quality.renderScale,2,'2x minimum quality retained');
console.log('PASS: GPU-bound adaptive resolution, recovery cooldown and 2x quality floor.');
