# 星纸漫游 · Paper Stargazer

A single-player, hand-drawn paper survival game. Original Canvas 2D artwork, vanilla JavaScript, sampled Foley and licensed instrumental music. No build step or application dependencies.

## Play locally

```sh
python3 -m http.server 4174 --directory dist
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

This is the permanent local Git repository at `/Users/quyi/NinotQuyi/doodle-survivors`. Sites source synchronization preserves its commit history remotely. No separate GitHub repository has been created.

Tags: `original-2026-11-03`, `adventure-v1`, `paper-v2` (when the second edition is finalized). Use `git log --oneline --decorate` to see checkpoints. To inspect an earlier version without losing current work, create a branch from its tag in a separate checkout. Do not hard-reset active work.

## Verification and footage

```sh
node test-mechanics.cjs
node scripts/test-expansion.cjs
node scripts/test-atmosphere.cjs
node scripts/test-focus.cjs
node scripts/balance.cjs
```

Mechanics cover all fusion prerequisites, ingredient consumption, three extra levels, every new weapon actually dealing damage, unbounded movement, world event idempotence, boss timings, win gating and complete six-minute simulation. A separate normal-health scripted controller checks three seeded runs. These are simulation tests, not evidence of human completion or universally balanced difficulty.

`qa/` contains local browser footage, screenshots and measurements. Capture clips are explicitly labeled **preset mid-game equipment**, and test progression/fusion/Boss feedback rather than showing equipment earned through a normal run. They record the actual Canvas game and mixed game audio; the small QA overlay is added by the recording harness. They are not included in the production website.

See `docs/CHANGELOG.md` and `docs/QA.md` for scope and findings.

## Credits

Visual inspiration: the paper-world combat presentation of Rakuworld by SETO, and the user's request for a little-prince-like traveler. This independent game does not use the original game's code, extracted assets or branding. All visual assets are drawn procedurally; no image-generation tools were used. Audio source licenses remain in the distribution and in the in-game sound settings.
