# 星纸漫游 · Paper Stargazer

A single-player, hand-drawn paper survival game. Original Canvas 2D artwork, vanilla JavaScript, sampled Foley and licensed instrumental music. The Canvas game runs without a build; shared play statistics use a Vinext Worker and Cloudflare D1.

## Play locally (game only; global statistics unavailable)

```sh
python3 -m http.server 4174 --directory public
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

- `public/art.js`: original sprites, animation frames, scenery, textures.
- `public/game.js`: game loop, collisions, combat, particles and controls.
- `public/expansion.js`: weapons/fusions, bosses, infinite chunks, events, journal.
- `public/combat.js`, `public/combat-content.js`: 28 new attack behaviors and 21 evolved patterns.
- `public/enemies.js`, `public/creature-art.js`: differentiated AI, telegraphs, elite traits and original creatures.
- `public/biomes.js`: large cached landscape regions and fantasy fauna.
- `public/death-art.js`, `public/impact.js`, `public/atmosphere.js`, `public/focus.js`: bounded visual feedback.
- `public/economy.js`: run coins and a functional world shop.
- `public/more-items.js`, `public/arsenal-art.js`: extra pickup behaviors and original icons.
- `public/fonts/`: offline OFL-licensed PaperHand font subset and reproducible build inputs.
- `public/items.js`: collectible effects, timed buffs, supply parcels and item journal.
- `public/audio.js`: sampled mixer, browser activation, priority voices, capture diagnostics.
- `public/edition.js`, `public/paper.js`: independent visual edition selector and paper treatment.
- `public/style.css`, `public/index.html`: immersive responsive UI.
- `public/audio/CREDITS.txt`: music and sound licenses.

## Git and rollback

Public source: https://github.com/Ninot1Quyi/doodle-survivors . Sites deployment configuration belongs to this checkout; remove its project binding when deploying your own copy.

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

## Shared statistics backend

Node.js >=22.13.0 is required. Run `npm ci`, `npm run build`, apply the SQL migrations locally, then `npm start`. The complete commands and counting rules are in `docs/GLOBAL_STATS.md`. `public/` is authored game source; `dist/` is now generated deployment output.

```sh
node scripts/test-global-stats.mjs
node scripts/test-impact-audio.cjs
```

## Weapon voices and slot rewards

All 63 active weapons have their own authored CC0 sample identity. Chest reels use a rhythmic spin, rising stop notes and a separate jackpot jingle. Three matching upgradeable results automatically grant three levels, capped by the item's maximum. Escape opens a pause menu with a return-to-main-menu button.

Source licenses and per-file provenance are in `public/audio/`; design research and validation are in `docs/AUDIO_WEAPON_IDENTITIES.md`.

```sh
node scripts/test-weapon-voices.cjs
node scripts/test-rewards.cjs
```
