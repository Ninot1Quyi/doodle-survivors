# World16 verification — 2026-11-03

## Scope

The pre-change source state is preserved at `cfcf1930eeec0590dc31ad3485badea2241672e9`. This release includes the already prepared soft15 sound revision and global-stat labels, plus the world16 changes below.

- Exact 3× increase over the previous live XP curve: first level 52 → 156; later levels use six times the original unmultiplied formula. Below-threshold and overflow behavior are tested.
- Music-box treasure: three seconds, world radius 105 (previous interaction radius 65), 0.22 progress-seconds lost per second outside. Returning resumes the remaining progress; unloaded chunks decay using game time. Ambush happens once per event id. Touch-only healing and meteor events still work while moving.
- Six authored enemy families, 36 ordinary members, explicit role unlocks, one ordinary-spawn director, a 24-second pressure/recovery rhythm, previous-family support, specialist and elite caps, reduced pressure during bosses. Same-family healing and summons, directional turtle guarding, delayed clock cross attacks, and the existing locked charge/jump/area geometry are retained.
- An in-game roster journal and a complete companion table document actual behavior and base stats.
- Lower oblique view (`k=.62`), upright actors, slightly closer framing, stronger contact shadows, clearer regional ground colors, paper foundation side faces. Scenery is sharp by default; optional focus remains in settings. This is Canvas projection and hand-authored depth, not a full 3D reconstruction.
- Home edition links removed; both historical query links now enter the same adventure rules/presentation. The home still shows 全球局数 and 全球时长.
- World interaction labels, pickup/elite labels, exploration HUD, boss identity and announcements use pictures, symbols and progress. Details remain in journal/menu text, tooltips and accessible labels; numeric health/time/XP feedback remains readable. Keyboard hints are hidden on touch devices.

## Automated and browser checks

- `qa/world16-tests.json`: full current `scripts/test-*.cjs` suite, including real attack simulation, all 63 weapon identities, fusion/reward behavior, projectile collision, five boss action groups, audio routing, focus and pacing.
- `scripts/test-encounters.cjs`: complete 36-member classification, no premature role unlock, one-family squads, recovery beat, bounded spawns, frontal versus rear damage, same-family minions, precise 3-second completion, exit/return and unloaded-chunk decay, once-only ambush, touch-only healing while moving.
- `scripts/test-rewards.cjs`: first threshold at 156, no upgrade at 155, one upgrade at 161 with five XP carried forward; second threshold 360.
- `qa/world16-browser.json`: actual Chrome desktop render, six encounter stages, journal with 36 entries, mobile viewport, and no page errors.
- `qa/camera-ground62-report.json`: transformed ground, nested and rotated upright sprites, thunder ground contact and 49 visual-effect types. Geometry stays in world coordinates.
- `qa/world16-mobile-fresh.png`: fresh touch/mobile context at 390×844, app and viewport sizes agree. The earlier immediate-resize screenshot had a transient compositing artifact; fresh navigation verifies the actual mobile layout.
- `qa/audio-style-after.json`: revised sample mixer under repeated and simultaneous contacts, rewards and a sustained beam; sampled peak and decoding results are recorded. This measures the browser audio path, not human comfort or every possible output device.

## Source and listening boundaries

No reference-video music, audio rip, screenshots or game assets were copied into `public/`. The reference audio remains an analysis-only local file outside the repository. The current six biome music tracks are separately licensed Kevin MacLeod recordings with CC BY attribution; they are not claimed as original music. The soft15 effects use their documented independent licensed sample sources.

Godot community research produced a separate local asset library and preview: 100 Kenney interface sounds, 80 primary Kenney particle textures, and the Signal Sparks experimental frame pack. Those newly downloaded candidates are not silently installed in the game; their decode/playback verification is not a claim of subjective approval. The current release ships the finished soft15 mix. See `GODOT_COMMUNITY_ASSETS16.md` for sources, formats, license boundaries and integration candidates.

Long-session difficulty with the newly requested 3× XP curve remains a balancing question; tests establish implemented thresholds and encounter rules, not that all play styles can finish a run equally easily.
