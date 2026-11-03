const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('assert'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'}),page=await browser.newPage({viewport:{width:1360,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/api/stats',r=>r.fulfill({json:{runs:3,activeMs:30000}}));
 await page.goto('http://127.0.0.1:4175/?edition=adventure');await page.click('#start');await page.waitForTimeout(500);
 const geometry=await page.evaluate(()=>{
  state='cameraqa';game.t=0;realTime=0;game.shake=0;game.hero.x=0;game.hero.y=70;game.hero.moving=false;game.hero.walk=0;game.hero.inv=0;game.hero.dash=0;game.hero.hp=game.hero.maxHp;cam={x:0,y:45};
  for(const key of ['enemies','bullets','enemyBullets','tornadoes','fx','constructs','particles','orbit','afterimages','numbers','gems','pickups','burns','corpses'])game[key]=[];
  const result={k:PaperCamera.k,viewH,expectedViewH:H/(zoom*PaperCamera.k),matrices:{}};
  const m=()=>{let t=ctx.getTransform();return{a:t.a,b:t.b,c:t.c,d:t.d,e:t.e,f:t.f,xScale:Math.hypot(t.a,t.b),yScale:Math.hypot(t.c,t.d)};};
  ctx.save();ctx.setTransform(2,0,0,2*PaperCamera.k,40,60);PaperCamera.begin(ctx);result.matrices.ground=m();
  PaperCamera.upright(ctx,100,200,()=>{result.matrices.upright=m();PaperCamera.upright(ctx,0,0,()=>result.matrices.nested=m());PaperCamera.ground(ctx,()=>result.matrices.groundAgain=m());});
  ctx.save();ctx.rotate(.63);PaperCamera.upright(ctx,20,30,()=>result.matrices.rotated=m());ctx.restore();
  const draw=ctx.drawImage,images=[];ctx.drawImage=function(...args){if(args[0]===Art.sprites.hero0.img||args[0]===Art.sprites.book.img)images.push({matrix:m(),width:args[3],height:args[4]});return draw.apply(this,args);};
  Art.image(ctx,'hero0',100,200,1);drawCenteredSprite('book',100,200,1);renderActor('hero0',{...game.hero,x:100,y:200},1,1,true);ctx.drawImage=draw;result.images=images;
  let bursts=[];const originalBurst=paperBurst;paperBurst=(x,y,...rest)=>{const t=ctx.getTransform();bursts.push({x:t.a*x+t.c*y+t.e,y:t.b*x+t.d*y+t.f});return originalBurst(x,y,...rest);};
  renderBattleBolt({type:'bolt',x:100,y:200,life:.4,max:.5,seed:12});paperBurst=originalBurst;result.boltGround=bursts[0];
  PaperCamera.end();ctx.restore();render();return result;
 });
 assert.equal(geometry.k,.74);assert(Math.abs(geometry.viewH-geometry.expectedViewH)<1e-8);
 const {ground,upright,nested,groundAgain,rotated}=geometry.matrices;
 assert(Math.abs(ground.yScale/ground.xScale-.74)<1e-8);for(const p of [upright,nested,rotated])assert(Math.abs(p.yScale/p.xScale-1)<1e-8,'upright aspect preserved, including rotated parents and nesting');
 assert.equal(upright.e,240);assert.equal(upright.f,356);assert(Math.abs(groundAgain.yScale/groundAgain.xScale-.74)<1e-8);
 assert.equal(geometry.images.length,3);for(const p of geometry.images){assert(Math.abs(p.matrix.xScale-p.matrix.yScale)<1e-8);assert.equal(p.matrix.e,240);assert.equal(p.matrix.f,356);}
 assert(Math.abs(geometry.boltGround.x-240)<1e-4&&Math.abs(geometry.boltGround.y-356)<1e-4);
 await page.evaluate(()=>{$('banner').classList.remove('show');$('tip').style.opacity=0;});
 await page.screenshot({path:'qa/camera-ground74.png'});
 await page.evaluate(()=>{
  game.t=2;realTime=2;game.tornadoes=[{x:-270,y:180,r:95,life:3,max:4}];game.fx=[{type:'bolt',x:250,y:160,life:.4,max:.5,seed:12}];
  construct('meteor','stamp',-200,340,.3,3,{r:70,age:.4,delay:.8,life:1,max:1.4});construct('stamp','stamp',60,300,0,3,{r:60,age:.3,delay:.7,life:1,max:1.3});
  construct('umbrella','rain',260,370,0,3,{r:80,age:.5,life:1,max:1.5});construct('turret','turret',-380,-50,.4,3,{age:.4,life:2,max:3});
  game.orbit=[{x:80,y:20,cx:0,cy:39,rx:90,ry:60,a:.6,sweep:.7}];
  game.bullets=[{kind:'rocket',x:-100,y:-30,vx:120,vy:120,life:1,max:2,id:1},{kind:'bubble',x:180,y:-30,vx:-120,vy:0,life:1,max:2,id:2}];
  render();
 });
 await page.screenshot({path:'qa/camera-ground74-effects.png'});
 // Every presentation path still renders with the same collision coordinates.
 const effects=await page.evaluate(()=>{
  const checked=[];for(const [kind,d] of Object.entries(weaponData)){if(!(MORE_WEAPONS[kind]||EVOLVED_PATTERNS[kind]))continue;game.constructs=[];advancedCast(kind,d.evolved?5:3,{x:220,y:150});for(const o of game.constructs){o.age=Math.max(.1,o.delay*.6);o.life=Math.max(1,o.life);render();o.age=o.delay+.2;render();}checked.push(kind);}return checked;
 });
 assert(effects.length>40);assert.deepEqual(errors,[]);
 fs.writeFileSync('qa/camera-ground74-report.json',JSON.stringify({geometry,effects,errors},null,2));console.log(JSON.stringify({projection:geometry.k,images:geometry.images.length,effectKinds:effects.length,boltGround:geometry.boltGround,errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
