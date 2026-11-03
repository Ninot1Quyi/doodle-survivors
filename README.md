# 星纸漫游 · Paper Stargazer

A single-player, hand-drawn paper survival game.

Source: https://github.com/Ninot1Quyi/doodle-survivors

Game source and original procedural artwork are MIT-licensed; bundled music, sound recordings and fonts retain their separate licenses. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Original Canvas 2D artwork, vanilla JavaScript, sampled Foley and licensed instrumental music. No build step or application dependencies.

## Play locally

```sh
git clone https://github.com/Ninot1Quyi/doodle-survivors.git
cd doodle-survivors
python3 -m http.server 4174 --bind 127.0.0.1 --directory dist
```

- Adventure edition: `http://localhost:4174/?edition=adventure`
- Handmade paper edition (default): `http://localhost:4174/?edition=paper`

WASD / arrows move, Space dashes, E casts a charged storm, C opens the fusion journal, B trades at a nearby paper shop, P / Escape pauses, F toggles fullscreen. Touch joystick and ability buttons work on touch devices.

Choose **火力开局** for four starting weapons, or **从零成长** for a pencil-only start. Reach six minutes and defeat the final guardian; continue into an endless run if desired. The map has no finite boundary.

## Content

42 base weapons, 21 evolved weapons, eight charms, eight weapon slots. Max two matching base weapons at level V, then select the fusion card at a level-up or visit a workshop. Ingredients are consumed and the evolved weapon starts at V, with three additional levels through VIII. The journal shows every recipe and current ingredient progress.

36 non-boss enemy types, eight elite modifiers, nine bosses in three randomized stage pools, six kinds of repeat-proof world encounters, 39 pickup items and touch-open supply parcels. Movement, stationary activation, guarding, healing, attraction, storm charging and treasure rewards use actual game simulation.

Six authored regions have distinct large landmarks, plants and passive fantasy animals: mushroom forest, whale lake, moon greenhouse, paper-city ruins, flowering dunes and kite fields. Coins fund run-local shop purchases. Cloud, rain and thunder weather, brief hurt feedback, cached scenery focus, and seven cause-dependent death animations share the paper visual language. Settings can reduce motion/flash and disable scenery focus.

## Source layout

- `dist/art.js`: original sprites, animation frames, scenery, textures.
- `dist/game.js`: game loop, collisions, combat, particles and controls.
- `dist/expansion.js`: weapons/fusions, bosses, infinite chunks, events, journal.
- `dist/combat.js`, `dist/combat-content.js`: 28 new attack behaviors and 21 evolved patterns.
- `dist/enemies.js`, `dist/creature-art.js`: differentiated AI, telegraphs, elite traits and original creatures.
- `dist/biomes.js`: large cached landscape regions and fantasy fauna.
- `dist/death-art.js`, `dist/impact.js`, `dist/atmosphere.js`, `dist/focus.js`: bounded visual feedback.
- `dist/economy.js`: run coins and a functional world shop.
- `dist/more-items.js`, `dist/arsenal-art.js`: extra pickup behaviors and original icons.
- `dist/fonts/`: offline OFL-licensed PaperHand font subset and reproducible build inputs.
- `dist/items.js`: collectible effects, timed buffs, supply parcels and item journal.
- `dist/audio.js`: sampled mixer, browser activation, priority voices, capture diagnostics.
- `dist/edition.js`, `dist/paper.js`: independent visual edition selector and paper treatment.
- `dist/style.css`, `dist/index.html`: immersive responsive UI.
- `dist/audio/CREDITS.txt`: music and sound licenses.

## Git and rollback

The public GitHub repository preserves the original development commits and release tags. Deployment-specific configuration is not needed to run the game locally. The source is served directly from `dist/`; no bundler is required.

Tags: `original-2026-11-03`, `adventure-v1`, `paper-v2`. Use `git log --oneline --decorate` to see checkpoints. To inspect an earlier version without losing current work, create a branch from its tag in a separate checkout. Do not hard-reset active work.

## Verification

```sh
node test-mechanics.cjs
node scripts/test-expansion.cjs
node scripts/test-atmosphere.cjs
node scripts/test-focus.cjs
node scripts/balance.cjs
```

Mechanics cover all fusion prerequisites, ingredient consumption, three extra levels, every new weapon actually dealing damage, unbounded movement, world event idempotence, boss timings, win gating and complete six-minute simulation. A separate normal-health scripted controller checks three seeded runs. These are simulation tests, not evidence of human completion or universally balanced difficulty.

`qa/` contains game screenshots, reproducible capture helpers and historical measurements. Reference videos and gameplay recordings are excluded from the repository. Some screenshots and measurements use preset mid-game equipment; they do not prove equipment was earned in normal play. The latest frame-pacing checks are synthetic timestamp tests, not a new live-browser FPS measurement. See the dated QA documents for the validation boundary of each change.

See `docs/CHANGELOG.md` and `docs/QA.md` for scope and findings.

## Credits

Visual inspiration: the paper-world combat presentation of Rakuworld by SETO, and the user's request for a little-prince-like traveler. This independent game does not use the original game's code, extracted assets or branding. All visual assets are drawn procedurally; no image-generation tools were used. Audio source licenses remain in the distribution and in the in-game sound settings.

## Development and contributions

Requires a modern browser with Canvas 2D and Web Audio. Python 3 is sufficient for local serving; Node.js runs the simulation checks. Optional font rebuilding requires Python `fonttools` and `brotli` as documented in `dist/fonts/README.md`. Audio reprocessing scripts require their documented source pack and local audio tooling; neither is needed to play the included distribution.

This project was developed with AI coding assistance. Contributions should preserve third-party notices, keep simulation and presentation checks distinct, and describe any browser testing actually performed. Do not commit credentials, deployment account configuration, reference footage or captured gameplay recordings.
