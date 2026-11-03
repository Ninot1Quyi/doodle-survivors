# 武器音色材质审计

2026-11-03：保留 63 个武器键，按真实动作和材质组织发声；30 处替换来源。共 67 个武器 OGG：63 个主音、2 个额外翻页、2 个额外鞭击。

彩铅从轻木块敲击换成 artisticdude 的短促实录掠风，时长约 89 ms；220 Hz 低通后的能量占整体从 30.56% 降到 2.03%。此数字是统一低通测量口径，不是理想砖墙频谱分带。

软鞭使用 Joseph SARDIN 的三条独立录音，不再把 knifeSlice 改名为鞭。石珠与弹珠台使用石质短碰；齿轮、纸城、织机使用机械扣动或拉线；纸龙、秋叶与纸壁画回归布纸展开。允许同类动作共享合适来源。

爆竹保留已审定的实录文件与原 SHA，烟火盛典共享其来源。光尺、棱镜、彩虹光束保留电声，持续发声周期由主音频引擎处理。

材质分类为 cut / paper / ink / fire / electric / crush / frost / nature / music。material 用于命中路由，发射层可用纸布原声表达纸鲸、纸龙等形态，不要求每个虚构物体都有现实录音。

处理为首端静音裁切、单声道 44.1 kHz、按材质高通、7.2 kHz 低通、轻压缩、活跃样本 RMS 对齐、峰值保护和淡边。火与重击活跃 RMS 目标 -21 dBFS，其余 -20 dBFS；尖瞬态优先峰值上限，故部分声音低于目标。没有自行合成新声、叠层或随机变调。

验证：`node scripts/verify-weapon-timbres.cjs` 检查 63 个 key、9 类材质、全部文件容器、文件哈希、来源授权与包络。`python3 scripts/normalize-weapon-timbres.py` 校验保留素材库的原始文件哈希；传入 `--write` 与 FFMPEG 可按来源清单重建处理后的 65 个文件，爆竹与烟火文件保持不变。

限制：已完成来源语义、数值波形与文件一致性检查；不能把这些检查称作人工试听批准。最终游戏里的音量关系、同时发声和用户主观听感仍由主线程验收。

| 武器键 | 材质 | 旧来源 | 新来源 | 决策 |
| --- | --- | --- | --- | --- |
| pencil | paper | impactWood_light_000.ogg | swish-11.wav | 更换来源 |
| book | paper | bookFlip1.ogg | bookFlip1.ogg | 保留来源并统一音量和尾部 |
| lightning | electric | zap1.ogg | zap1.ogg | 保留来源并统一音量和尾部 |
| tornado | paper | cloth4.ogg | cloth4.ogg | 保留来源并统一音量和尾部 |
| fire | fire | thrusterFire_000.ogg | spell_fire_01.ogg | 更换来源 |
| scissors | cut | drawKnife1.ogg | blade_01.ogg | 更换来源 |
| ink | ink | slime_000.ogg | slime_000.ogg | 保留来源并统一音量和尾部 |
| rose | nature | clothBelt.ogg | clothBelt.ogg | 保留来源并统一音量和尾部 |
| star | music | pepSound1.ogg | DM-CGS-34.wav | 更换来源 |
| plane | paper | cloth1.ogg | cloth1.ogg | 保留来源并统一音量和尾部 |
| bubble | ink | slime_001.ogg | slime_001.ogg | 保留来源并统一音量和尾部 |
| bell | music | DM-CGS-34.wav | DM-CGS-34.wav | 保留来源并统一音量和尾部 |
| ribbon | paper | cloth2.ogg | cloth2.ogg | 保留来源并统一音量和尾部 |
| frost | frost | spaceTrash1.ogg | item_gem_01.ogg | 更换来源 |
| saber | cut | knifeSlice.ogg | sword.4.ogg | 更换来源 |
| lance | cut | drawKnife3.ogg | swish-3.wav | 更换来源 |
| marble | crush | metalPot1.ogg | item_stone_01.ogg | 更换来源 |
| yoyo | cut | phaserDown1.ogg | swish-4.wav | 更换来源 |
| rocket | fire | thrusterFire_003.ogg | spell_fire_04.ogg | 更换来源 |
| firecracker | fire | 原实录 | Whistle and Explosion Single_Firework - Rudmer_Rotteveel | 爆竹原样保留 |
| ruler | electric | laser1.ogg | laser1.ogg | 保留来源并统一音量和尾部 |
| prism | electric | laser2.ogg | laser2.ogg | 保留来源并统一音量和尾部 |
| turret | paper | metalClick.ogg | metalClick.ogg | 保留来源并统一音量和尾部 |
| foxspirit | nature | cloth3.ogg | cloth3.ogg | 保留来源并统一音量和尾部 |
| mine | fire | DM-CGS-21.wav | DM-CGS-21.wav | 保留来源并统一音量和尾部 |
| stamp | crush | bookPlace3.ogg | bookPlace3.ogg | 保留来源并统一音量和尾部 |
| whip | cut | knifeSlice2.ogg | 2961.flac | 更换来源 |
| thread | paper | beltHandle1.ogg | beltHandle1.ogg | 保留来源并统一音量和尾部 |
| roller | paper | handleSmallLeather.ogg | handleSmallLeather.ogg | 保留来源并统一音量和尾部 |
| chalk | paper | handleSmallLeather2.ogg | handleSmallLeather2.ogg | 保留来源并统一音量和尾部 |
| camera | crush | metalLatch.ogg | metalLatch.ogg | 保留来源并统一音量和尾部 |
| music | music | threeTone1.ogg | threeTone1.ogg | 保留来源并统一音量和尾部 |
| meteor | fire | lowFrequency_explosion_001.ogg | lowFrequency_explosion_001.ogg | 保留来源并统一音量和尾部 |
| compass | crush | pepSound4.ogg | metalClick.ogg | 更换来源 |
| magnetArm | electric | phaserDown3.ogg | phaserDown3.ogg | 保留来源并统一音量和尾部 |
| gear | crush | beltHandle2.ogg | metalLatch.ogg | 更换来源 |
| umbrella | paper | bookOpen.ogg | bookOpen.ogg | 保留来源并统一音量和尾部 |
| kite | paper | clothBelt2.ogg | clothBelt2.ogg | 保留来源并统一音量和尾部 |
| leaf | cut | drawKnife2.ogg | swish-6.wav | 更换来源 |
| shield | electric | forceField_000.ogg | forceField_000.ogg | 保留来源并统一音量和尾部 |
| portal | electric | forceField_002.ogg | forceField_002.ogg | 保留来源并统一音量和尾部 |
| void | ink | forceField_003.ogg | forceField_003.ogg | 保留来源并统一音量和尾部 |
| comet | fire | powerUp1.ogg | spell_fire_03.ogg | 更换来源 |
| garden | nature | DM-CGS-33.wav | clothBelt.ogg | 更换来源 |
| aurora | electric | zapThreeToneUp.ogg | zap1.ogg | 更换来源 |
| tempest | paper | engineCircular_002.ogg | swish-10.wav | 更换来源 |
| nova | fire | explosionCrunch_003.ogg | explosionCrunch_003.ogg | 保留来源并统一音量和尾部 |
| dragon | paper | phaserUp7.ogg | cloth4.ogg | 更换来源 |
| mirror | frost | DM-CGS-45.wav | DM-CGS-45.wav | 保留来源并统一音量和尾部 |
| paladin | cut | powerUp3.ogg | sword.1.ogg | 更换来源 |
| pinball | crush | pepSound5.ogg | item_stone_02.ogg | 更换来源 |
| festival | fire | DM-CGS-08.wav | Whistle and Explosion Single_Firework - Rudmer_Rotteveel | 更换来源 |
| rainbowLaser | electric | laser9.ogg | laser9.ogg | 保留来源并统一音量和尾部 |
| clockwork | crush | powerUp7.ogg | metalLatch.ogg | 更换来源 |
| printingPress | crush | bookClose.ogg | bookClose.ogg | 保留来源并统一音量和尾部 |
| loom | paper | phaserUp5.ogg | beltHandle1.ogg | 更换来源 |
| livingMural | paper | powerUp10.ogg | bookFlip3.ogg | 更换来源 |
| spotlight | electric | powerUp4.ogg | metalClick.ogg | 更换来源 |
| orrery | music | threeTone2.ogg | threeTone2.ogg | 保留来源并统一音量和尾部 |
| scrapColossus | crush | metalPot3.ogg | metal_02.ogg | 更换来源 |
| skyWhale | ink | spaceEngineLow_002.ogg | cloth4.ogg | 更换来源 |
| autumnGuardian | nature | powerUp9.ogg | clothBelt2.ogg | 更换来源 |
| paperCosmos | electric | forceField_004.ogg | bookOpen.ogg | 更换来源 |
