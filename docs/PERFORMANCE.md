# Rendering and simulation budget

The first optimization pass reuses spatial-hash buckets and query storage, compares squared separation distances, compacts expired arrays in place, caches weapon metadata and ground patterns, reuses depth-sort entries, and bakes confetti shapes once. Rendering skips covered ground and offscreen effects. HUD text writes occur only when values change.

The canvas starts at a maximum device-pixel ratio of 1.5 and approximately 2.1 million backing pixels for ordinary window sizes. Sustained heavy work can lower that ratio toward 1.0. Gameplay renders at up to 60 Hz, the animated menu at 30 Hz, and paused/modal states redraw only on transition or resize. Hidden documents skip work. Resolution changes do not change simulation populations or hit detection.

## CPU-only regression measurement

`scripts/performance-benchmark.cjs` runs three seeded 600-frame workloads with 220 initial enemies and eight equipped weapons. Canvas and DOM calls are stubs inside Node's VM: these timings **are not browser FPS or GPU measurements**. Reports are `qa/performance-before.json` and `qa/performance-after.json`.

| Metric | Before | After |
| --- | ---: | ---: |
| Median CPU workload time per simulated frame | 86.038 ms | 71.801 ms |
| Canvas calls per 600 frames | 6,007,193 | 5,886,593–5,886,665 |
| Final enemies / bullets / particles / effects | 226 / 4 / 35 / 366 | 226 / 4 / 35 / 366 |

The observed median reduction is about 16.5%. Timing varied widely between runs; this is directional local evidence, not a portable guarantee. The identical final entity counts help detect unintended changes to the seeded scenario but do not prove every gameplay path equivalent. Real-browser raster, refresh-rate and input-latency measurements remain necessary after expanded combat integration.

## Proposed expanded-combat limits

These are initial engineering budgets, not experimentally established FPS thresholds. They are recommendations for the new scheduler; this optimization pass does not impose them.

| Population | Suggested cap |
| --- | ---: |
| Normal enemies | 220 |
| Bosses | 3 |
| Equipped active weapons | 8 |
| Player projectiles | 160 total, 24 per family |
| Enemy projectiles | 100 |
| Persistent damage fields | 24 total, 3 per family |
| Tornadoes / beams | 12 |
| Cosmetic effects / particles | 240 each |
| Damage labels | 80 |
| Gems | 650; merge while preserving total value |

Use spatial queries for damage and separation. Reacquire homing targets at 10–12 Hz rather than scanning every enemy for every bullet every frame. Stagger field ticks at roughly 4 Hz and explicitly bound chain depth. Do not cap collision checks by dropping arbitrary potential hits: cap spawned entities, and preserve committed gameplay damage when suppressing cosmetic effects. Sample frame work and long frames in a browser before raising these limits.
