# 武器声音、材质接触与宝箱奖励（stage14）

本文描述 stage14 当前行为；voices12 的旧解码数量与截图保留在 QA 历史记录中，不代表当前样本总量。

## 当前声音分工

- 63 个主动武器键映射到 67 个 OGG 发射文件：63 个主文件、2 个额外翻页、2 个额外鞭击。按 cut / paper / ink / fire / electric / crush / frost / nature / music 分类；同类物理动作可以复用合适原声，不以源文件互不相同作为验收标准。
- 彩铅从木块敲击换为短促实录掠风；软鞭来自 Joseph SARDIN 的三条独立鞭录音；石珠、纸页、纸龙、织机、秋叶回归相应的碰撞、翻动或掠风动作。爆竹与烟火共享已保留的真实爆裂片段。电／光束武器保留电声。
- `public/weapon-audio.js` 记录来源入口、音量、尾长、间隔与材质。每种武器独立限频，武器发射最多十个声部。书页按绕行相位、长枪／相机／光束按释放、印章／陨星按落地、地雷按引爆、哨塔按发射、狐狸按扑咬发声。齐射不为每颗弹体重复叠声。
- 命中与发射独立。`public/audio/contacts/` 含 paper / ink / fire / electric / crush / frost 六族、各三变体；nature 借纸叶接触族，music 借晶体族，切割和击杀另有专用原声。命中路由按武器材质、暴击／击杀事件选择，视觉反馈不再重复补一次命中音。
- 持续光束由 `Sound.sustain` 管理循环生命周期，结束、暂停和离开战斗时收尾，不在每个伤害 tick 重新发射一个短音。Boss 声音有独立提示／施法／重击事件与声部预算。
- 发射样本只做单一来源的静音裁切、单声道重采样、按材质高低通、轻压缩、活跃 RMS 对齐与淡边，不自行生成振荡器、叠层或改调。原作者制作的电声／音乐效果可以是电子音源；这与项目自行生成占位音不同。历史 Kenney 预混文件及运行时播放变化另有记录，不能一概描述为“全库未混音”。

## 区域音乐与奖励

六个区域各有一首 Kevin MacLeod 成品曲目，跨区淡入淡出并保留曲目进度。包括 Enchanted Valley、Dreamy Flashback、Teller of the Tales、Fairytale Waltz、Desert City、Master of the Feast，均为 CC BY 4.0。完整署名和修改说明见 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) 与 [biomes/CREDITS.txt](../public/audio/biomes/CREDITS.txt)。

宝箱使用启动、滚动、递进停格、揭晓和大奖短乐句；三个相同的可升级结果只领取一次 +3，遵守该物品等级上限，非三连仍为三选一。合成卡与恢复卡不进入三连升级规则，跳过演出仍按已锁定结果发奖。经验／金币收集、灵感和礼物另有采样入口，避免借用重击声。

ESC 暂停页保留返回主菜单；封面保留模式、开始、手帐、版本、全服统计与源码入口。源码链接为 [Ninot1Quyi/doodle-survivors](https://github.com/Ninot1Quyi/doodle-survivors)。

## 素材与授权

Kenney、Dustyroom、rubberduck、artisticdude、StarNinjas、TinyWorlds、Independent.nu / qubodup、faxcorp、Joseph SARDIN / BigSoundBank、Rudmer_Rotteveel 的采样均按对应 CC0 来源记录保留；音乐单独采用 CC BY 4.0，字体单独采用 OFL。完整作者／来源链接、许可和修改范围见 [第三方署名](../THIRD_PARTY_NOTICES.md)。

逐文件记录：

- [WEAPON-AUDIO-PROVENANCE.json](../public/audio/WEAPON-AUDIO-PROVENANCE.json)：67 个发射文件及宝箱来源、原始／成品 SHA-256、处理参数；独立鞭子还保留中间准备文件哈希。
- [COMBAT-AUDIO-PROVENANCE.json](../public/audio/COMBAT-AUDIO-PROVENANCE.json)：刃、碎裂击杀、电流循环的原始来源和准备处理。
- [contacts/PROVENANCE.json](../public/audio/contacts/PROVENANCE.json)：18 个接触片段及裁切位置、EQ、增益、淡边。
- [REWARD-AUDIO-PROVENANCE.json](../public/audio/REWARD-AUDIO-PROVENANCE.json)：灵感、礼物与轻拾取。
- [weapon-timbre-audit.md](weapon-timbre-audit.md)：63 项逐一来源审计及波形测量边界。

## 验证边界

- `node scripts/verify-weapon-timbres.cjs`：63 个键、9 类材质、67 个 OGG 的容器／来源授权／文件哈希／峰值边界，以及三条真实鞭变体和爆竹字节保留。
- `python3 scripts/normalize-weapon-timbres.py`：在另行保留的素材库中核验 65 个处理样本所引用的源文件哈希；不下载、不改动文件。`--write` 加 `FFMPEG` 可重建，爆竹与烟火原样保留。
- `test-weapon-voices.cjs`、`test-impact-audio.cjs`：实际攻击路径发声、并发、材质接触与生命周期检查；以当次运行输出为准，不沿用旧版资源计数。
- `test-rewards.cjs`：三连 +3、上限、进化、护符副作用、一次领取、跳过／后台／重开、非三连与合成卡边界。
- 浏览器解码、录音和频谱检查可验证资源、触发、时序及输出；不能据此宣称用户主观听感已通过。历史 `qa/voices12-*` 不等于当前版本验收。

浏览器复测脚本可设置 `PLAYWRIGHT_MODULE` 指向已安装的 Playwright，`CHROME_PATH` 指向 Chrome 可执行文件；统计接口在隔离 QA 中使用替身，避免测试污染线上总量，不需要麦克风权限。
