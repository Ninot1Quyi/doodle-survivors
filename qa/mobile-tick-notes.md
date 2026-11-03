# Whole-screen controls and tick optimization

Baseline: 98976cee394866b72de7ebb52c346c44d62a1128. Native 3x ceiling and 4 MP pixel budget retained. Sustained frame stalls can now reduce raster scale toward 2x even when JavaScript work is low; recovery waits 900 rendered frames. No changes to enemy counts, weapons, hit detection, simulation frequency, effect counts or progression.

- Dynamic joystick starts anywhere on the canvas, not just its left half. Canvas listeners leave buttons and dialogs alone. Pointer ownership, cancellation and pause cleanup retained.
- Compute drag exponentials and weather speed once per tick.
- Skip neighborhood lookup when separation is disabled by the existing action state.
- Preserve pickup array in place instead of copying it every tick.
- Compute construct attack geometry once per passive-defense invocation; discard cache after that invocation.
- Stable linear selection replaces full sort for single-target weapons. Area and line target heuristics unchanged.

Run `node scripts/test-mobile-controls.cjs`, `node scripts/test-tactics-performance.cjs`, `node scripts/test-tactics.cjs`, `node scripts/test-projectile-step.cjs`, and `node scripts/test-frame-pacing.cjs`.

For full pre-change comparison, check the baseline commit out into a separate directory, then run `node scripts/benchmark-tick.cjs /absolute/baseline /absolute/current`. The harness uses 220 initial high-HP enemies, eight level-5 weapons, and 300 ticks per alternating round. All three final serialized game-state hashes matched, ending with 221 enemies. Timings are noisy: one round was slower, so do not promise a universal percentage speed-up.

In the separately reproducible 220-enemy/72-beam/130-hostile-shot stress test, median full-tick CPU time was 18.226 ms before and 8.479 ms after (-53.5%). Passive-defense geometry calls fell from 9,360 to 72 per tick. Exact game and PRNG state matched after 90 update ticks. This benchmark exercises a known worst-case repeated-geometry workload, not representative of every run.

All timings are Node VM CPU-only with Canvas/audio stubbed, not browser/GPU/phone FPS. Real mobile touch feel, thermal behavior and sustained FPS have not been measured. Browser developer tools are disabled in this environment. Production build and the above focused tests passed.
