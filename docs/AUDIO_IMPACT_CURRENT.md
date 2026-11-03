# 历史记录 · 敌人命中音效重做

> 最新武器独立音效与宝箱声音见 [AUDIO_WEAPON_IDENTITIES.md](AUDIO_WEAPON_IDENTITIES.md)。下文记录旧版本；共享施法音色与旧开箱声已被替换。

本轮针对刺耳、持续碎裂的问题。原版《Master of the Feast》BGM 文件与播放逻辑保持不变；开箱、滚轮停驻、升级等已有声音接口保留。

## 实际变更

- 原普通彩铅命中会叠加 plate/snap、wood、punch 三层；暴击又追加三层重击，视觉反馈也可能再触发重击。改为一次接触只选普通、暴击或击杀之一，视觉反馈不再重复发声。
- 新增 18 个预混实录音色（每类 3 个变体）：普通冲击、重击、击杀、切割、发射、抵消。来自同一 Kenney CC0 包的 soft/punch/carpet/generic/light-wood 录音，短攻击包络、低中频主体与自然空气尾部。重复命中不使用 plate/glass/metal 碎裂层，也不使用合成振荡器。
- 保留低中频能量，定向削减 2.7kHz 刺耳段和 4.5kHz 以上高频。新样本离线定标后不再被运行时 RMS 归一化重新抬高。
- 14ms 收集窗口合并密集命中，优先保留击杀、然后暴击/抵消、最后普通命中。不同材质共用 105ms 节奏和最多 3 个命中声音上限。每个代表性接触仅一个预混声音；游戏伤害、击退和怪量不受影响。
- 发射限制在每 140ms 最多一次，拾取提示限制为每 180ms，并降低拾取增益，避免它覆盖低中频的命中主体。

## 验证与局限

`test-impact-audio.cjs` 通过：52 个资源入口、32 个同窗接触合并成 1 个击杀声音、跨材质共享预算、开箱不受命中预算阻塞、新局取消待发音、击杀/暴击/普通互斥、视觉反馈不再重复发声。

`test-pigment.cjs` 的首个场景固定为非暴击输入，保留“彩铅材质接入”的原检查目的；避免随机暴击现在正确地播放重击音而令旧断言随机失败。

离线对比按原运行时采样混合和包络构造，不含 SFX 总线压缩。3 个彩铅变体：

| 指标 | 原三层音色 | 新单声音色 |
| --- | --- | --- |
| RMS | 0.0263–0.0304 | 0.0284–0.0299 |
| 峰值 | 0.284–0.358 | 0.172–0.225 |
| 4kHz 高通后的能量占比 | 3.12%–4.52% | 0.00127%–0.00144% |

这表明近似 RMS 下，尖锐高频与峰值被显著减少，并非单纯把所有声音调小。全部 18 个编码后样本最大峰值为 0.575，无文件内削波。数据和逐文件授权来源分别保存在 `qa/warm-impact-spectrum.json` 与 `dist/audio/WARM-IMPACT-PROVENANCE.json`。

`browser-impact-audit.js` 可在独立静音 QA 页、`Sound.ready()` 后运行 `await qaImpactAudioStress(6)`，检查真实 Web Audio 混音峰值、并发和聚合数量。该脚本不启动麦克风。离线频谱或自动化检查不能证明用户主观认为更沉浸；仍需要实际体验。

重建：

```sh
python3 scripts/refine-warm-impacts.py --impact-zip /absolute/path/kenney-impact.zip --ffmpeg /absolute/path/ffmpeg
python3 scripts/analyze-warm-impacts.py --ffmpeg /absolute/path/ffmpeg
node scripts/test-impact-audio.cjs
node scripts/test-pigment.cjs
```

## 后续漏网调用修复（release10，线上 v8）

星星、弹珠、铃铛、雷电、落印与风系施法不再绕过温和素材。重复施法共享 120ms 节奏；战斗分组经 4.2kHz 低通，开箱庆祝与原 BGM 保留。前述本轮修改已部署，但用户主观听感与实时混音验收仍待确认。
