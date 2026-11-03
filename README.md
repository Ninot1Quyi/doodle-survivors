# 星纸漫游 · Paper Stargazer

A single-player, hand-drawn paper survival game. Original Canvas 2D artwork, vanilla JavaScript, sampled Foley and licensed instrumental music. The Canvas game runs without a build; shared play statistics use a Vinext Worker and Cloudflare D1.

## Play locally (game only; global statistics unavailable)

```sh
python3 -m http.server 4174 --directory public
```

- Adventure edition: `http://localhost:4174/?edition=adventure`
- Handmade paper edition (default): `http://localhost:4174/?edition=paper`

WASD / arrows move, Space dashes, E casts a charged storm, C opens the fusion journal, B trades at a nearby paper shop, P / Escape pauses, F toggles fullscreen. Touch joystick and ability buttons work on touch devices.

Choose **火力开局** for four starting weapons, or **从零成长** for a pencil-only start. Complete the five-guardian sequence and reach six minutes to finish the run; continue into an endless run if desired. The map has no finite boundary.

## Content

42 base weapons, 21 evolved weapons, eight charms, eight weapon slots. Max two matching base weapons at level V, then select the fusion card at a level-up or visit a workshop. Ingredients are consumed and the evolved weapon starts at V, with three additional levels through VIII. The journal shows every recipe and current ingredient progress.

36 non-boss enemy types, eight elite modifiers, five scheduled guardians with four attacks each, six kinds of repeat-proof world encounters, 39 pickup items and touch-open supply parcels. Movement, stationary activation, guarding, healing, attraction, storm charging and treasure rewards use actual game simulation.

Six authored regions have distinct large landmarks, plants, passive fantasy animals and their own Kevin MacLeod music tracks: mushroom forest, whale lake, moon greenhouse, paper-city ruins, flowering dunes and kite fields. Region changes crossfade between tracks; the full attribution and edits are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

A lower oblique Canvas view compresses ground depth while keeping paper characters upright. Animated beam cores, blade ribbons, burst petals and moving orbit hoops track actual attack lifetimes. Guardians telegraph their locked geometry, perform the attack, and recover before acting again. Cloud, rain and thunder weather, brief hurt feedback, cached scenery focus and cause-dependent death animations keep the paper style. Settings can reduce effects and disable scenery focus. The compact cover retains mode selection, start, journal, both editions, shared statistics and the GitHub link; keyboard/touch diagrams replace long instructions.

The default guardian sequence is fixed. A later guardian waits for the preceding one to be defeated, so these times are earliest spawn times rather than overlapping deadlines:

| Earliest time | Guardian | Four attacks |
| --- | --- | --- |
| 01:00 | 荆棘女王 · Thorn Queen | 荆棘花圃 / 花瓣风轮 / 藤蔓横剪 / 玫瑰箭雨 |
| 02:00 | 饼干蟹公爵 · Biscuit Crab Duke | 双钳夹击 / 横行冲刺 / 钳刃横扫 / 饼干碎浪 |
| 03:05 | 织梦图书长 · Dream Librarian | 羽页齐射 / 月读光束 / 落羽书阵 / 展翼旋斩 |
| 04:10 | 午夜发条师 · Midnight Clockmaker | 分针扫射 / 整点钟波 / 时轨光束 / 发条弹幕 |
| 05:30 | 月蚀之王 · Eclipse King | 月蚀光束 / 月相陨落 / 弦月涟漪 / 流星突进 |

Legacy boss definitions remain for compatibility and special spawning; they do not replace the default five encounters with random choices. Coins fund run-local paper-shop purchases.

## Source layout

- `public/art.js`: original sprites, animation frames, scenery, textures.
- `public/game.js`: game loop, collisions, combat, particles and controls.
- `public/expansion.js`: weapons/fusions, bosses, infinite chunks, events, journal.
- `public/combat.js`, `public/combat-content.js`: 28 new attack behaviors and 21 evolved patterns.
- `public/enemies.js`, `public/creature-art.js`: differentiated AI, telegraphs, elite traits and original creatures.
- `public/biomes.js`: large cached landscape regions and fantasy fauna.
- `public/boss-choreography.js`, `public/boss-choreography-art.js`: five four-action boss profiles, tells, collision geometry and casting poses.
- `public/kinetic-art.js`, `public/kinetic-combat.js`, `public/weapon-presentation.js`: attack movement, local effect shapes and matching lifetimes.
- `public/death-art.js`, `public/impact.js`, `public/atmosphere.js`, `public/focus.js`: bounded visual feedback.
- `public/economy.js`: run coins and a functional world shop.
- `public/more-items.js`, `public/arsenal-art.js`: extra pickup behaviors and original icons.
- `public/fonts/`: offline OFL-licensed PaperHand font subset and reproducible build inputs.
- `public/items.js`: collectible effects, timed buffs, supply parcels and item journal.
- `public/audio.js`: sampled mixer, material contacts, lifecycle-controlled loops, browser activation and capture diagnostics.
- `public/weapon-audio.js`, `public/biome-audio.js`: weapon/material routing and the six regional music tracks.
- `public/edition.js`, `public/paper.js`: independent visual edition selector and paper treatment.
- `public/style.css`, `public/index.html`: immersive responsive UI.
- `THIRD_PARTY_NOTICES.md`, `public/audio/CREDITS.txt`: music, sample, font and tooling licenses with original source links.

## Git and rollback

Public source: [Ninot1Quyi/doodle-survivors](https://github.com/Ninot1Quyi/doodle-survivors). Sites deployment configuration belongs to this checkout; remove its project binding when deploying your own copy.

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

All 63 active weapon keys route to reviewed CC0 samples, grouped as cut, paper, ink, fire, electric, crush, frost, nature or music. Matching actions deliberately share suitable sources. The 67 weapon files include two additional page takes and two additional real-whip takes. Pencil launches use a short recorded swish; stones, paper, fire, electricity and ink use material-appropriate contact recordings. Weapon launches have a ten-voice budget; held beams use a sustained loop rather than restarting a one-shot every damage tick. Chest reels use a rhythmic spin, rising stop notes and a separate jackpot jingle. Three matching upgradeable results automatically grant three levels, capped by the item's maximum. Escape opens a pause menu with a return-to-main-menu button.

Source licenses and per-file provenance are in `public/audio/`; design research and validation are in [docs/AUDIO_WEAPON_IDENTITIES.md](docs/AUDIO_WEAPON_IDENTITIES.md) and [docs/weapon-timbre-audit.md](docs/weapon-timbre-audit.md). Waveform, decoding and trigger tests do not by themselves certify subjective listening quality.

```sh
node scripts/test-weapon-voices.cjs
node scripts/verify-weapon-timbres.cjs
node scripts/test-boss-choreography.cjs
node scripts/test-rewards.cjs
```
