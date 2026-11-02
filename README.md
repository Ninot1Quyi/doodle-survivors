# 星纸漫游 · Paper Stargazer

A single-player, hand-drawn paper survival game. Original Canvas 2D artwork, vanilla JavaScript, sampled Foley and licensed instrumental music. No build step or application dependencies.

## Play locally

```sh
python3 -m http.server 4174 --directory dist
```

- Adventure edition: `http://localhost:4174/?edition=adventure`
- Handmade paper edition (default): `http://localhost:4174/?edition=paper`

WASD / arrows move, Space dashes, E casts a charged storm, C opens the fusion journal, P / Escape pauses, F toggles fullscreen. Touch joystick and ability buttons work on touch devices.

Choose **火力开局** for four starting weapons, or **从零成长** for a pencil-only start. Reach six minutes and defeat the final guardian; continue into an endless run if desired. The map has no finite boundary.

## Content

14 base weapons, seven evolved weapons, eight charms, eight weapon slots. Max two matching base weapons at level V, then select the fusion card at a level-up or visit a workshop. Ingredients are consumed and the evolved weapon starts at V, with three additional levels through VIII. The journal shows every recipe and current ingredient progress.

12 non-boss enemy types (including the armored elite), three bosses with health phases, and six kinds of repeat-proof world encounters. Movement, stationary activation, guarding, healing, attraction, storm charging and treasure rewards use actual game simulation.

## Source layout

- `dist/art.js`: original sprites, animation frames, scenery, textures.
- `dist/game.js`: game loop, collisions, combat, particles and controls.
- `dist/expansion.js`: weapons/fusions, bosses, infinite chunks, events, journal.
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
node scripts/balance.cjs
```

Mechanics cover all fusion prerequisites, ingredient consumption, three extra levels, every new weapon actually dealing damage, unbounded movement, world event idempotence, boss timings, win gating and complete six-minute simulation. A separate normal-health scripted controller checks three seeded runs. These are simulation tests, not evidence of human completion or universally balanced difficulty.

`qa/` contains local browser footage, screenshots and measurements. Capture clips are explicitly labeled **preset mid-game equipment**, and test progression/fusion/Boss feedback rather than showing equipment earned through a normal run. They record the actual Canvas game and mixed game audio; the small QA overlay is added by the recording harness. They are not included in the production website.

See `docs/CHANGELOG.md` and `docs/QA.md` for scope and findings.

## Credits

Visual inspiration: the paper-world combat presentation of Rakuworld by SETO, and the user's request for a little-prince-like traveler. This independent game does not use the original game's code, extracted assets or branding. All visual assets are drawn procedurally; no image-generation tools were used. Audio source licenses remain in the distribution and in the in-game sound settings.
