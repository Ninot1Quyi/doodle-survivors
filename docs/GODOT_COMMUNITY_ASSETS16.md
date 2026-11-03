# Godot 社区素材核验 · Stage 16

核验日期：2026-11-03。只做资料、下载和独立预览；没有迁移引擎、没有修改游戏代码、没有使用参考游戏原音乐。

## 1. 官方入口现状

Godot 确实已有官方 [Asset Store](https://store.godotengine.org/)，[2026-05-22官方公告](https://godotengine.org/article/introducing-the-godot-asset-store/)介绍了新商店及迁移方向；旧 [Asset Library](https://godotengine.org/asset-library/asset)仍有可访问条目。当前商店页面页脚仍写beta，与公告“live and stable”表述存在差异，因此这里仅确认网站与条目可访问，不据此断言所有功能、付费交易或稳定性。

“在Godot市场找到”不等于“必须用Godot”。原始WAV、OGG、PNG与JSON可由浏览器直接读取；`.tscn`、`.tres`、GDScript、Godot shader或GDExtension需要Godot运行时，不能直接塞进当前Canvas项目。每个资源自己的许可独立于Godot引擎许可。

## 2. 八项候选与核验结论

| 资源与官方/作者来源 | 具体许可 | 格式和直接可用性 | 本项目适用点与限制 |
|---|---|---|---|
| **1. Kenney Interface Sounds，Calinou的Godot包装**：[Asset Library 794](https://godotengine.org/asset-library/asset/794)、[Kenney原作者页](https://kenney.nl/assets/interface-sounds)、[包装仓库](https://github.com/Calinou/kenney-interface-sounds) | **CC0**；已读包内LICENSE，明确可商用、署名非强制 | **100个WAV**，本地实际检查44.1kHz、16-bit、单/双声道；浏览器WebAudio直接可读，不依赖Godot | 最值得优先试听并小范围接入。`drop`、`bong`、`tick`、`confirmation`可作为轻触、弹性短事件和确认的候选；它是界面音库，不能预设它覆盖所有武器音色 |
| **2. Kenney Particle Pack，Calinou的Godot包装**：[Asset Library 784](https://godotengine.org/asset-library/asset/784)、[原作者页](https://kenney.nl/assets/particle-pack)、[包装仓库](https://github.com/Calinou/kenney-particle-pack) | **CC0**；包内许可证已保留，可商用、修改 | 主素材目录**80张512×512 PNG**，调色板透明；Canvas `drawImage`直接可用 | 可作星光、纸屑、魔法、烟尘、刀弧蒙版。它们主要是**静态粒子贴图，不是80段完成动画**；寿命、缩放、旋转、颜色、数量仍需游戏控制。柔光纹理较多，不能无差别替换当前清晰纸边 |
| **3. Signal Sparks**：[作者itch页](https://elinora.itch.io/signal-sparks) | **CC0 1.0**，作者限定“to the extent rights are held”；包内LICENSE已读。作者披露代码/文字AI辅助，非图像模型画图 | **72张透明192×192逐帧PNG + 6张2304×192横向图集 + JSON**；普通straight alpha，直接适配Canvas | impact/heal/shield/poison/pickup/cast各12帧。默认12fps、1秒一次性效果；不是无缝循环。下载名和README明确是**实验/CANDIDATE**，不可叫成熟完整战斗库 |
| **4. Free Pixel Effects**：[Godot Asset Store作者条目](https://store.godotengine.org/asset/cs5475/free-pixel-effects/) | **CC0**，作者页明确可商用、无需署名；本轮只核到页面，未下载到包内许可 | 作者描述30个效果，PNG图集、JSON帧表、Godot SpriteFrames `.tres`；PNG+JSON理论上可直接用于Canvas，`.tres`不可以 | 命中火花、爆发可参考，但16–64px像素风与当前手绘纸艺差异大。条目标为unstable并披露AI辅助程序绘图。下载重定向/403失败，**未取得或验证图集** |
| **5. Soft UI SFX Free**：[作者itch页](https://heyheythere.itch.io/soft-ui-sfx-free) | **CC BY 4.0**：允许商用、改编、分享；需署名、许可证链接及改动说明。作者提供具体署名行 | 当前作者页写25个声音，WAV **48kHz/24-bit**与OGG，可用于任意引擎；本轮未下载 | 主题直接对口cozy/casual。但作者披露代码、声音、文字AI辅助；历史页也说明程序合成。不能冒称真人录制，也不以“Soft”名称代替主观听审。本轮不优先替换现有手工素材 |
| **6. Sprite Juice Kit Lite**：[官方Asset Library 5558](https://godotengine.org/asset-library/asset/5558)、[作者页](https://reeboolabs.itch.io/sprite-juice-kit-lite) | **MIT**；复制/改编实质代码时保留版权和许可声明；官方条目及作者页一致 | Godot4.4+插件、GDScript、canvas_item shader、Camera2D逻辑；**不是音频/透明帧素材，不能直接在Canvas运行** | 可借鉴局部hit flash、trauma平方震动和不叠加hit-stop的设计。当前游戏已有类似机制，应对照差异而非迁移引擎。作者明确测试平台范围有限，且披露AI辅助代码 |
| **7. Wind VFX**：[Godot Asset Store作者条目](https://store.godotengine.org/asset/vefects/wind-vfx/) | **Vefects Free EULA，自定义许可，非CC0**。作者页允许商业产品内使用和修改；禁止把原始/衍生效果作为独立素材、资产包、模板或素材库再分发。完整包内LICENSE本轮未取得 | Godot4.7+原生`.tscn`、ShaderMaterial、网格及风循环声；Forward+推荐。**没有验证可直接读的PNG序列/音频文件** | 树叶、花瓣、风带方向很贴题，但当前Canvas不能直接运行场景/着色器。不可把整个原包作为可下载的公共资源库上传；暂列视觉参考，不接入 |
| **8. Pixelpart for Godot**：[官方Store条目](https://store.godotengine.org/asset/soerenml/pixelpart/)、[作者插件仓库](https://github.com/soeren-m/pixelpart-plugin-godot4)、[实际LICENSE](https://github.com/soeren-m/pixelpart-plugin-godot4/blob/develop/LICENSE) | **MIT只覆盖这个插件代码**，版权2022–2026 Sören Möllers；不自动覆盖编辑器或另行获取的效果素材 | `.ppfx`效果资源 + Godot原生插件/GDExtension，支持Godot Web导出；**“支持Web”不等于普通Canvas能读取.ppfx** | 若以后做独立效果制作工具可进一步研究导出，但本轮不装引擎/插件，不把工具许可当效果素材许可，不为它改当前架构 |

以上条目是候选与技术适配评估，不是八项全部已下载、已听审、已接入。特别是自定义EULA和未取得包内许可的项目，不提升为可直接发布的素材。

## 3. 真正下载到本地的内容

目录：`/Users/quyi/NinotQuyi/doodle-survivors-audio-research/godot-community16/`。

| 压缩包 | 字节数 | 取得方式与完整性 |
|---|---:|---|
| `kenney-interface-sounds.zip` | 1,727,059 | 从Godot条目所指Calinou仓库下载；ZIP CRC检查全部通过 |
| `kenney-particle-pack.zip` | 5,022,675 | 同上；ZIP CRC检查全部通过 |
| `signal-sparks.zip` | 1,535,822 | 实际打开作者itch页并点击免费Download，收到浏览器下载事件；ZIP CRC检查通过 |

这次使用官方Godot条目所指的社区包装来源，解决了上一轮Kenney主站ZIP返回403的问题；不声称这些是Kenney官网新下载的原始ZIP。WAV包装是从Kenney的OGG转换而来，转WAV不会恢复OGG之前已经丢失的信息。

许可证位于：

- `kenney-interface-sounds/kenney-interface-sounds-master/addons/kenney_interface_sounds/LICENSE.txt`
- `kenney-particle-pack/kenney-particle-pack-master/addons/kenney_particle_pack/LICENSE.txt`
- `signal-sparks/signal-sparks-v0.1.1/LICENSE.txt`

`validation.json`保留三个下载包的SHA-256、字节数、PNG尺寸/颜色格式和WAV格式检查。`downloads.json`保留首轮下载结果；Free Pixel Effects失败已明确记录，不存在伪装成ZIP的错误页。

## 4. 实际独立验证

- **100个WAV全部在Chrome WebAudio成功解码**。
- **175张PNG成功解码**，包含80张Kenney主粒子、包装里的辅助图像，以及Signal Sparks的72帧、6张图集和联系表；不能把175统称为175种可用特效。
- 80张Kenney主粒子PNG均有透明信息；Signal Sparks72帧为192×192 RGBA。
- 实际播放了`drop_001`、`drop_002`、`bong_001`、`tick_001`、`confirmation_001`、`glass_001`，WebAudio分析器检测到每项非零输出，浏览器无页面错误。**这是播放管线验证，不是主观听感结论**；未声称已经确认“柔和、弹性、舒服”。
- 独立预览把6张Kenney纹理作为淡紫色蒙版画在纸色背景，已目视检查。星光/烟尘偏柔、刀弧较干净；用作局部辅层比整屏堆发光更接近当前风格。
- 未运行Godot，也未验证Wind VFX、Sprite Juice或Pixelpart在其目标引擎的行为。

可打开 `preview.html` 查看原始音效播放器、粒子蒙版预览和作者Signal Sparks离线动画入口。`preview.png`是实际浏览器截图，`browser-validation.json`记录解码、alpha范围与播放输出。

## 5. 最值得先接入的一项

**首选 Kenney Interface Sounds 的小范围A/B，而不是一次换完全部声音。** 原因是来源链、商用许可、100个原始文件和当前浏览器解码已经落实，不需要新增引擎或转换程序；它还补齐了上一轮直接下载失败的一个音库。

建议先试听`drop_001/002/003/004`、`bong_001`和`tick_001/002`，挑出1组承担轻触/落下/弹性短命中，另用`confirmation_001..004`作为确认/奖励候选。这是按作者命名和使用角色挑选的试听顺序，**不是对实际音色的承诺**。不要把scratch、glitch、error类因为同属一个包就塞进普通命中。

具体限制：

1. 界面音库不等于完整战斗录音库；刀剑、爆炸、风、持续激光仍需适合各自材料的声音。
2. 本轮没有做同响度、重复触发或多武器实战听审；不能直接说某个样本解决了用户所说的刺耳/没质感。
3. 先用一次、每秒3次、8声部并发及30秒实战四种情景比较，再决定替换；保证参考和候选按相近响度比较。
4. 它是Godot社区包装的作者资源，Canvas可直接用WAV；不需要安装Godot、运行任何GDScript或引入商店插件。

视觉方面的第二选择是Kenney Particle Pack：取少量`slash`、`star`、`smoke`蒙版，用游戏已有的寿命/旋转/缩放驱动；保留纸片轮廓。Signal Sparks虽已有透明序列帧，但属于实验小样且1秒默认时长不一定适合快速命中，应先做本地比较。

## 6. 授权与风格提醒

CC0、CC BY 4.0、MIT和Vefects EULA是不同许可，不因都叫“Free”而互换。Soft UI SFX Free若未来采用，可使用作者给出的署名行，并另标注我们做过的裁切、归一化或格式转换：

`Soft UI SFX Free by heyheythere - https://heyheythere.itch.io/soft-ui-sfx-free - CC BY 4.0`

“Godot市场中有资源”这一建议有实际价值：已取得可脱离Godot使用的音频与粒子图像。但当前最稳妥的方向是提取许可明确的引擎无关素材，并保持原创纸艺风格；不是为了使用一个插件而迁移整个游戏，也不是复用参考游戏的音乐。
