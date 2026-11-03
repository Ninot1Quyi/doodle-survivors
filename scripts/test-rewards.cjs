const assert=require('assert');const {run}=require('./test-harness.cjs');
run('start();game.enemies=[];');assert.equal(run('game.need'),52);for(let l=2;l<60;l++)assert.equal(run(`experienceForLevel(${l})`),2*Math.round((16+l*6.5+l**1.33)*1.9));
run("openUpgrade(false);upgradeChoices=['book','heart','fusion:comet'];upgradeRarity=[1,1,1];game.hero.hp=20;");assert.equal(run('rewardRecommendation(upgradeChoices).index'),1);run('game.hero.hp=120');assert.equal(run('rewardRecommendation(upgradeChoices).index'),2);
run("upgradeChoices=['pencil'];upgradeRarity=[1];prepareRewardChoices();");let lv=run('game.weapons.pencil');run('updateRewardSession(2.99)');assert.equal(run('game.weapons.pencil'),lv);run('updateRewardSession(.02)');assert.equal(run('game.weapons.pencil'),lv+1);assert.equal(run('rewardSession'),null);run('updateRewardSession(20)');assert.equal(run('game.weapons.pencil'),lv+1);
run("openUpgrade(true);upgradeChoices=['book'];upgradeRarity=[2];prepareRewardChoices();");lv=run('game.weapons.book');run('chooseUpgrade(0)');assert.equal(run('game.weapons.book'),lv);run('updateRewardSession(3.66)');assert.equal(run('rewardSession.remaining'),3);run('state="settings";updateRewardSession(10)');assert.equal(run('rewardSession.remaining'),3);run('state="upgrade";document.hidden=true;updateRewardSession(10)');assert.equal(run('rewardSession.remaining'),3);run('document.hidden=false;updateRewardSession(3)');assert.equal(run('game.weapons.book'),lv+2);
run('openUpgrade(false);updateRewardSession(2);rollChoices()');assert.equal(run('rewardSession.remaining'),3);run('start()');assert.equal(run('rewardSession'),null);
run("game.enemies=[];spawnEnemy('snail',100,70);game.enemies[0].hp=100000;advancedCast('pinball',5,game.enemies[0]);");assert.equal(run('game.constructs.length'),1);assert.equal(run('game.constructs[0].mode'),'pinballTable');run('for(let i=0;i<240;i++)updateConstructs(1/60)');assert.equal(run('game.constructs[0].x'),100);assert.equal(run('game.constructs[0].y'),70);assert(run('Math.abs(game.constructs[0].ballX-100)<=145&&Math.abs(game.constructs[0].ballY-70)<=105'));assert(run('game.enemies[0].hp<100000'));
run("game.enemies=[];spawnEnemy('owl',0,0);enemyWarn(game.enemies[0],'sniper',1);var warnings=0;warningLane=()=>warnings++;renderEnemyTelegraphs();");assert.equal(run('warnings'),0);run("game.enemies[0].intent=null;enemyWarn(game.enemies[0],'charge',1);renderEnemyTelegraphs();");assert.equal(run('warnings'),1);
console.log('PASS: increased XP, health/fusion recommendation, single automatic grant after 3s, chest reveal lock, hidden/settings pause, reroll/new-run reset, fixed pinball table with bounded moving ball, no projectile lanes and retained charge warning.');

run("start();game.t=20;upgradeChoices=['pencil','tornado','saber'];upgradeRarity=[1,1,1];");assert.equal(run('rewardRecommendation(upgradeChoices).index'),1);assert.equal(run('rewardRecommendation(upgradeChoices).stage'),'diversify');
run("game.t=180;game.weapons.pencil=4;game.weapons.star=4;upgradeChoices=['saber','pencil','crown'];upgradeRarity=[1,1,1];");assert.equal(run('rewardRecommendation(upgradeChoices).index'),1);assert.equal(run('rewardRecommendation(upgradeChoices).stage'),'build');
run("game.hero.hp=20;upgradeChoices=['fusion:comet','heart','saber'];");assert.equal(run('rewardRecommendation(upgradeChoices).index'),1);console.log('PASS: early attack diversity, late existing fusion route, emergency health override.');

// The offered cards must make the promised recommendation possible.
run("start();game.t=20;game.weapons.star=1;");
assert.deepEqual(Array.from(run("rewardNewCandidates(['plane','rose','ribbon'])")),['rose'],'early draft must offer a missing attack role, not another ranged partner');
assert(run("Object.keys(weaponData).filter(k=>!weaponData[k].passive).every(k=>rewardRoles(k).length>0)"),'all base and evolved weapons have a role');
run("game.weapons.pencil=5;game.weapons.star=5;fuseWeapon('comet');");
assert.equal(run('rewardBuildContext().early'),false,'fusion must not send a mature build back to the early phase');
assert(run("rewardBuildContext().roles.has('ranged')"),'evolution retains coverage of consumed ingredients');
run("start();game.t=340;game.weapons.pencil=5;upgradeChoices=['star','saber','armor'];upgradeRarity=[1,1,1]");
assert.equal(run('rewardRecommendation(upgradeChoices).index'),0,'a max-level weapon must retain access to its recommended fusion partner after five minutes');
run("game.hero.hp=20;rollChoices()");assert(run("upgradeChoices.includes('heart')"),'severe health needs recovery in actual offered choices');
run("start();game.t=160;game.weapons.pencil=4;game.weapons.star=4;game.weapons.saber=1;rollChoices()");
assert(run("upgradeChoices.includes('pencil')||upgradeChoices.includes('star')"),'late reserved upgrade should advance the established fusion route');
// Dense normal hits keep local feedback without repeatedly stopping the world.
run("start();game.enemies=[];spawnEnemy('snail',0,70);game.hitStop=0;game.shake=0;game.impactCooldown=0;hitFeedback(game.enemies[0],false,90,'confetti',0,0,150)");
assert.equal(run('game.hitStop'),0);assert.equal(run('game.shake'),0);assert(run('game.enemies[0].hitPulse>0'));
run("hitFeedback(game.enemies[0],true,150,'confetti',0,0,150)");assert(run('game.hitStop<=.018&&game.shake<=1.6'));assert.equal(run('game.impactCooldown'),.55);
console.log('PASS: actual draft diversity, all weapon roles, mature fusion stage, late partners, emergency recovery, and local-only ordinary impacts.');
