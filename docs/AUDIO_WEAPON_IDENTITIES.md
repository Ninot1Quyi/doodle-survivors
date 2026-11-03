# 武器声音、老虎机宝箱与三连奖励（voices12）

## 当前行为

- 63 种主动武器对应 63 份不同的设计师成品源文件，书页另有两份真实翻页变体。覆盖基本武器、28 种扩展武器与 21 种进化武器。`public/weapon-audio.js` 记录音色、音量、尾长及独立触发间隔。
- 书页在绕行相位触发翻页；长枪/相机/光束在蓄力结束时发声；印章/陨星在落地时发声；地雷在引爆时发声；哨塔在发射时、狐狸在扑咬时发声。普通投射物在齐射开始时发声，不为每颗弹体重叠播放。
- 每种武器独立限频，同时最多六个武器声音，取消旧版“所有施法共用 120ms，先到先得”的限制。武器音色不再经过敌人命中声的 4.2kHz 低通；命中声仍使用 14ms 合并、105ms 节奏，并降低背景增益。暂停时结束战斗声音。
- 素材仅裁掉开头静音、统一增益、3ms 淡入及转码，保留原有设计。没有运行时振荡器，也没有把同一音色改名成 63 种武器。BGM 文件和原播放逻辑保持不变。
- 宝箱去掉旧 wood/metal/glass 的多层组合。改成上扬启动声、逐渐减速的短音滚动、三次递进停格、成品揭晓声。三连使用 Kenney 的拨弦短乐句，再接一个 Dustyroom 奖励提示。
- 宝箱从原有合法候选中有放回地抽取三个转轮结果；三个结果相同，且是可升级的武器或护符时，开奖直接升三级。最高只能升到该物品上限；新物品从 0 升到 3；普通武器上限 5，进化上限 8。合成卡与恢复卡不进入三连升级规则。三个相同只发一次 +3，不能再点选重复领取。
- 三连领奖后展示 2.2 秒再自动回到战斗；跳过动画仍按相同结果发奖；后台不推进展示时间。非三连仍为三选一，普通升级候选仍保持不重复。
- ESC 暂停页新增“返回主菜单”，结束本局统计、清除移动输入并回到封面。封面与胜利/死亡结算页有统一纸片署名，链接到作者 `https://github.com/Ninot1Quyi`。

## 查阅的设计经验

Stephan Schütze 的 [Article on repetition](https://www.stephanschutze.com/listen-blog/article-on-repetition) 讨论了单一录音重复过响造成的疲劳，以及真实录音变体、小幅音高和音量变化的作用。这里采用独立武器身份、翻页录音变体和很小的播放变化，同时把敌人命中声退到辅助层。不同武器的具体选音与声音预算是本项目的设计判断，并非文章规定。

[Audiokinetic Wwise Project Adventure](https://www.audiokinetic.com/download/documents/WwiseProjectAdventure_en.pdf) 展示了用间隔与播放概率控制重复声音密度的思路。这里用单武器触发间隔和分组并发上限实现，不依赖 Wwise。

## 素材与授权

- [Kenney RPG Audio](https://kenney.nl/assets/rpg-audio)：翻页、布料、刃声及物件操作。
- [Kenney Digital Audio](https://kenney.nl/assets/digital-audio)：短电弧、光束、音阶与魔法提示。
- [Kenney Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds)：喷射、黏液、力场、低频爆发。
- [Kenney Music Jingles](https://kenney.nl/assets/music-jingles)：宝箱三连拨弦短乐句。
- [Dustyroom Free Casual Game Sounds](https://dustyroom.com/free-casual-game-sounds/)：铃音、转轮与奖励提示。官网明确标注 50 个成品音效、CC0。
- 彩铅保留一份 Kenney Impact Sounds 的木质原录音。

上述包均核对包内授权为 CC0；原许可证保存在 `public/audio/LICENSE-*`，逐文件来源、SHA-256 和处理增益在 `public/audio/WEAPON-AUDIO-PROVENANCE.json`。71 个新增文件包括 65 个武器文件（63 身份加两份翻页变体）和六个宝箱文件。未将整个素材包或外部游戏录音上传到仓库。

## 验证边界

- `test-weapon-voices.cjs`：63 个主动武器具有不同源文件，且实际战斗逻辑会发出对应武器事件，覆盖延迟攻击、召唤、书页和地雷。
- `test-impact-audio.cjs`：123 个声音资源入口，命中合并、互斥、防重复，四种同时施法可各自发声，宝箱不再使用旧金属/玻璃叠加。
- `test-rewards.cjs`：三连 +3、上限、进化、护符副作用、只领取一次、跳过/后台/重开、非三连和合成卡边界。
- Chrome 真正解码和播放 123 个资源，无失败，逐个触发 63 武器声音；封面、ESC、胜利/死亡、三连和手机横竖屏通过。统计接口在独立 QA 页被替身拦截，不污染线上累计数据。
- 自动化与录音确认加载、触发、时序和混音输出，不等于人工听感验收。

复测浏览器脚本可设置 `PLAYWRIGHT_MODULE` 指向已安装的 Playwright，`CHROME_PATH` 指向 Chrome 可执行文件，使用本地 4175 端口；不需要麦克风权限。
