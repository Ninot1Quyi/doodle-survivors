from pathlib import Path
import subprocess,json,hashlib,shutil,array,math
import argparse
p=argparse.ArgumentParser();p.add_argument('--source-dir',required=True,type=Path);p.add_argument('--ffmpeg',default='ffmpeg');p.add_argument('--impact-source',required=True,type=Path);args=p.parse_args()
root=Path(__file__).resolve().parent.parent;packs=args.source_dir;ff=args.ffmpeg
# One authored source per voice. No oscillator, layering, or offline timbre synthesis.
rows=[
('pencil','impact','impactWood_light_000',.20,.15,'短木质笔尖发射'),
('book','rpg','bookFlip1',.23,.40,'纸页翻动'),
('lightning','digital','zap1',.32,.30,'短电弧'),
('tornado','rpg','cloth4',.29,.75,'宽布料掠风'),
('fire','scifi','thrusterFire_000',.25,.35,'低沉火球喷发'),
('scissors','rpg','drawKnife1',.26,.35,'剪刃抽动'),
('ink','scifi','slime_000',.27,.50,'下沉墨滴'),
('rose','rpg','clothBelt',.25,.40,'叶片展开'),
('star','digital','pepSound1',.24,.32,'上扬星点'),
('plane','rpg','cloth1',.25,.42,'轻纸翼掠过'),
('bubble','scifi','slime_001',.23,.40,'弹性泡泡'),
('bell','dusty','DM-CGS-34',.22,.30,'短铃音'),
('ribbon','rpg','cloth2',.25,.50,'丝带滑动'),
('frost','digital','spaceTrash1',.23,.42,'冰晶碎光'),
('saber','rpg','knifeSlice',.29,.45,'宽刃切风'),
('lance','rpg','drawKnife3',.29,.38,'尖锐突刺'),
('marble','rpg','metalPot1',.22,.30,'圆润小珠敲击'),
('yoyo','digital','phaserDown1',.24,.43,'回旋滑音'),
('rocket','scifi','thrusterFire_003',.29,.65,'加速升调'),
('firecracker','digital','laser7',.25,.25,'短促爆豆'),
('ruler','digital','laser1',.26,.55,'直线光束'),
('prism','digital','laser2',.24,.55,'折射脉冲'),
('turret','rpg','metalClick',.22,.18,'哨塔扳机'),
('foxspirit','rpg','cloth3',.26,.38,'狐狸扑跃'),
('mine','dusty','DM-CGS-21',.29,.23,'地雷短爆'),
('stamp','rpg','bookPlace3',.34,.33,'厚重印章落地'),
('whip','rpg','knifeSlice2',.29,.38,'细鞭抽风'),
('thread','rpg','beltHandle1',.22,.30,'针线拉紧'),
('roller','rpg','handleSmallLeather',.27,.55,'滚筒擦纸'),
('chalk','rpg','handleSmallLeather2',.25,.45,'粉笔摩擦'),
('camera','rpg','metalLatch',.25,.28,'相机快门'),
('music','digital','threeTone1',.24,.60,'八音琴三音'),
('meteor','scifi','lowFrequency_explosion_001',.31,.75,'陨星落地'),
('compass','digital','pepSound4',.23,.38,'罗盘锁定提示'),
('magnetArm','digital','phaserDown3',.27,.65,'磁吸下滑音'),
('gear','rpg','beltHandle2',.24,.40,'齿轮扣动'),
('umbrella','rpg','bookOpen',.25,.55,'纸伞撑开'),
('kite','rpg','clothBelt2',.24,.55,'风筝牵线'),
('leaf','rpg','drawKnife2',.24,.40,'叶片切风'),
('shield','scifi','forceField_000',.24,.45,'盾面共鸣'),
('portal','scifi','forceField_002',.30,.75,'折门跃迁'),
('void','scifi','forceField_003',.28,.75,'墨洞吸入'),
('comet','digital','powerUp1',.32,.80,'彗星连奏'),
('garden','dusty','DM-CGS-33',.26,1.00,'花园渐盛'),
('aurora','digital','zapThreeToneUp',.29,.80,'极光电音上行'),
('tempest','scifi','engineCircular_002',.28,.85,'纸风暴旋涡'),
('nova','scifi','explosionCrunch_003',.32,.85,'星云爆发'),
('dragon','digital','phaserUp7',.30,.90,'纸龙长啸'),
('mirror','dusty','DM-CGS-45',.23,1.05,'长镜面铃响'),
('paladin','digital','powerUp3',.31,.85,'骑士登场'),
('pinball','digital','pepSound5',.25,.45,'弹珠台跳音'),
('festival','dusty','DM-CGS-08',.29,.84,'烟火连续绽放'),
('rainbowLaser','digital','laser9',.29,.90,'彩虹长光束'),
('clockwork','digital','powerUp7',.28,.85,'纸城齿轮乐句'),
('printingPress','rpg','bookClose',.33,.40,'印刷机压合'),
('loom','digital','phaserUp5',.27,.85,'织机穿梭'),
('livingMural','digital','powerUp10',.27,.90,'壁画生长乐句'),
('spotlight','digital','powerUp4',.28,.85,'剧场亮灯'),
('orrery','digital','threeTone2',.28,.95,'星系钟音'),
('scrapColossus','rpg','metalPot3',.31,.65,'巨人厚重金属共鸣'),
('skyWhale','scifi','spaceEngineLow_002',.28,1.00,'云鲸低吟'),
('autumnGuardian','digital','powerUp9',.28,.85,'秋叶护卫和音'),
('paperCosmos','scifi','forceField_004',.31,1.15,'宇宙展开长音')]
out=root/'public/audio/weapons';out.mkdir(exist_ok=True)
manifest=[];config={}
def source(pack,name):
 if pack=='jingles':return packs/'music-jingles/Audio/Pizzicato jingles'/(name+'.ogg')
 if pack=='impact':return args.impact_source/(name+'.ogg')
 if pack=='dusty':return packs/'dustyroom/DM-CGS/WAV'/(name+'.wav')
 return packs/{'rpg':'rpg-audio','digital':'digital-audio','scifi':'sci-fi-sounds'}[pack]/'Audio'/(name+'.ogg')
def convert(src,dst):
 raw=subprocess.run([ff,'-v','error','-i',str(src),'-ac','1','-ar','44100','-f','f32le','pipe:1'],stdout=subprocess.PIPE,check=True).stdout
 a=array.array('f');a.frombytes(raw);peak=max(map(abs,a));gain=min(2.5,.72/max(.01,peak))
 subprocess.run([ff,'-v','error','-i',str(src),'-af',f'silenceremove=start_periods=1:start_duration=0:start_threshold=-48dB,volume={gain:.6f},afade=t=in:d=0.003','-ac','1','-ar','44100','-c:a','libvorbis','-q:a','5','-y',str(dst)],check=True)
 return {'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'file_sha256':hashlib.sha256(dst.read_bytes()).hexdigest(),'gain':round(gain,6)}
for key,pack,name,gain,tail,desc in rows:
 src=source(pack,name);dst=out/(key+'.ogg');meta=convert(src,dst)
 config[key]={'sample':'weapons/'+key,'gain':gain,'tail':tail,'interval':.20 if key=='pencil' else .24,'label':desc}
 manifest.append({'weapon':key,'pack':pack,'source':src.name,'file':'weapons/'+dst.name,'description':desc,**meta})
# Give the most frequently repeated paper attack three real takes, rather than pitch-only clones.
for i in [2,3]:
 src=source('rpg','bookFlip'+str(i));dst=out/('book'+str(i)+'.ogg');meta=convert(src,dst);manifest.append({'weapon':'book','pack':'rpg','source':src.name,'file':'weapons/'+dst.name,**meta})
config['book']['variants']=['weapons/book','weapons/book2','weapons/book3']
# Slot cues are complete designer sounds, played in a timed sequence, never glass/metal layers.
for key,pack,name in [('slotTick','dusty','DM-CGS-40'),('slotStop','dusty','DM-CGS-44'),('slotRise','digital','highUp'),('slotBurst','dusty','DM-CGS-27'),('slotReveal','dusty','DM-CGS-28'),('slotJackpot','jingles','jingles_PIZZI01')]:
 dst=root/'public/audio'/(key+'.ogg');src=source(pack,name);meta=convert(src,dst);manifest.append({'cue':key,'pack':pack,'source':src.name,'file':dst.name,**meta})
(root/'public/weapon-audio.js').write_text("'use strict';\n// Authored CC0 samples; one distinctive voice for every active weapon.\nconst WEAPON_AUDIO="+json.dumps(config,ensure_ascii=False,indent=2)+';\n')
(root/'public/audio/WEAPON-AUDIO-PROVENANCE.json').write_text(json.dumps({'processing':'Only leading silence trim, gain adjustment, 3ms fade-in and OGG encoding. Runtime preserves source timbre; no synthesized/layered attacks.','sources':{'jingles':'https://kenney.nl/assets/music-jingles','scifi':'https://kenney.nl/assets/sci-fi-sounds','rpg':'https://kenney.nl/assets/rpg-audio','digital':'https://kenney.nl/assets/digital-audio','impact':'https://kenney.nl/assets/impact-sounds','dusty':'https://dustyroom.com/free-casual-game-sounds/'},'license':'CC0-1.0','samples':manifest},ensure_ascii=False,indent=2)+'\n')
for pack in ['rpg-audio','digital-audio','sci-fi-sounds','music-jingles']:shutil.copy2(packs/pack/'License.txt',root/'public/audio'/('LICENSE-'+pack+'.txt'))
shutil.copy2(packs/'dustyroom/DM-CGS/license.pdf',root/'public/audio/LICENSE-Dustyroom.pdf')
print('Created',len(rows),'weapon identities and',len(manifest),'recorded samples')
