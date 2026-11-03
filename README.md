# 星纸漫游 · Paper Stargazer

A single-player, hand-drawn paper survival game.

Source: https://github.com/Ninot1Quyi/doodle-survivors

Game source and original procedural artwork are MIT-licensed; bundled music, sound recordings and fonts retain their separate licenses. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Original Canvas 2D artwork, vanilla JavaScript, sampled Foley and licensed instrumental music. The Canvas game runs without a build; shared play statistics use a Vinext Worker and Cloudflare D1.

## Play locally (game only; shared statistics unavailable)

```sh
git clone https://github.com/Ninot1Quyi/doodle-survivors.git
cd doodle-survivors
python3 -m http.server 4174 --bind 127.0.0.1 --directory public
```

- Adventure edition: `http://localhost:4174/?edition=adventure`
- Handmade paper edition (default): `http://localhost:4174/?edition=paper`

WASD / arrows move, Space dashes, E casts a charged storm, C opens the fusion journal, B trades at a nearby paper shop, P / Escape pauses, F toggles fullscreen. Touch joystick and ability buttons work on touch devices.

Choose **火力开局** for four starting weapons, or **从零成长** for a pencil-only start. Complete the five-guardian sequence and reach six minutes to finish the run; continue into an endless run if desired. The map has no finite boundary.

## Content

42 base weapons, 21 evolved weapons, eight charms, eight weapon slots. Max two matching base weapons at level V, then select the fusion card at a level-up or visit a workshop. Ingredients are consumed and the evolved weapon starts at V, with three additional levels through VIII. The journal shows every recipe and current ingredient progress.

36 non-boss enemy types, eight elite modifiers, five scheduled guardians with four attacks each, six kinds of repeat-proof world encounters, 39 pickup items and touch-open supply parcels. Movement, stationary activation, guarding, healing, attraction, storm charging and treasure rewards use actual game simulation.

Six authored regions have distinct large landmarks, plants, passive fantasy animals and their own Kevin MacLeod music tracks: mushroom forest, whale lake, moon greenhouse, paper-city ruins, flowering dunes and kite fields. Region changes crossfade between tracks; the full attribution and edits are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

A lower oblique Canvas view compresses ground depth while keeping paper characters upright. Animated beam cores, blade ribbons, burst petals and moving orbit hoops track actual attack lifetimes. Guardians telegraph their locked geometry, perform the attack, and recover before acting again. Cloud, rain and thunder weather, brief hurt feedback, cached scenery focus and cause-dependent death animations keep the paper style. Settings can reduce effects and optionally enable scenery focus; scenery is clear by default. The compact cover retains mode selection, start, journal, shared statistics and the GitHub link; keyboard/touch diagrams replace long instructions.

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

The public GitHub repository preserves the original development commits and release tags. Deployment-specific configuration is not needed to run the game locally. Game-only hosting serves `public/` directly; the full statistics backend requires the build described below. `dist/` contains generated output and is not committed.

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

Requires a modern browser with Canvas 2D and Web Audio. Python 3 is sufficient for game-only serving. Node.js >=22.13.0 and npm are required for the full backend and verification scripts. Optional font rebuilding requires Python `fonttools` and `brotli` as documented in `public/fonts/README.md`. Audio reprocessing scripts require their documented source pack and local audio tooling; neither is needed to play the included distribution.

This project was developed with AI coding assistance. Contributions should preserve third-party notices, keep simulation and presentation checks distinct, and describe any browser testing actually performed. Do not commit credentials, deployment account configuration, reference footage or captured gameplay recordings.

## Full local game with shared statistics

The included `.openai/hosting.json` contains only generic bindings (`DB`, no R2); it has no owner project ID or credentials. Use Node.js >=22.13.0:

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_public_stepford_cuckoos.sql
npm start
```

Open the local URL printed by Wrangler (normally `http://127.0.0.1:8787`). Apply the migration once to a fresh local database. Reusing `.wrangler/state` retains local counts; it does not connect to the public game's production database. Build output and database state are ignored by Git.

`public/global-stats.js` reports anonymous run IDs and cumulative active play time to `/api/stats`. `app/stats-service.mjs`, `db/schema.ts` and `drizzle/` implement the shared D1 totals. Paused or hidden-page time is excluded. Retries and out-of-order reports are deduplicated. Anonymous totals are usage indicators, not verified unique-player or anti-cheat statistics. See [docs/GLOBAL_STATS.md](docs/GLOBAL_STATS.md) for counting rules and limitations.

```sh
node scripts/test-global-stats.mjs
node scripts/test-impact-audio.cjs
```

For your own hosted deployment, provision your own Worker and D1 binding and apply the migrations; do not reuse another owner's project identifiers or local database files. The deployment helper and vendored dependency licenses are retained alongside their source files and listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Weapon voices and slot rewards

All 63 active weapon keys route to reviewed CC0 samples, grouped as cut, paper, ink, fire, electric, crush, frost, nature or music. Matching actions deliberately share suitable sources. The 67 weapon files include two additional page takes and two additional real-whip takes. Pencil launches use a short recorded swish; stones, paper, fire, electricity and ink use material-appropriate contact recordings. Weapon launches have a ten-voice budget; held beams use a sustained loop rather than restarting a one-shot every damage tick. Chest reels use a rhythmic spin, rising stop notes and a separate jackpot jingle. Three matching upgradeable results automatically grant three levels, capped by the item's maximum. Escape opens a pause menu with a return-to-main-menu button.

The current sound palette uses soft paper, elastic contact and short ascending pizzicato rewards. Shared high-frequency shaping and gentle onsets bring launch, impact, beam and UI voices into one paper-magic mix; individual weapon and continuous-beam identities remain. The home totals are labeled as global run count and global play time. See [the sound-style revision](docs/AUDIO_STYLE15.md).

Source licenses and per-file provenance are in `public/audio/`; design research and validation are in [docs/AUDIO_WEAPON_IDENTITIES.md](docs/AUDIO_WEAPON_IDENTITIES.md) and [docs/weapon-timbre-audit.md](docs/weapon-timbre-audit.md). Waveform, decoding and trigger tests do not by themselves certify subjective listening quality.

```sh
node scripts/test-weapon-voices.cjs
node scripts/verify-weapon-timbres.cjs
node scripts/test-boss-choreography.cjs
node scripts/test-rewards.cjs
```

## Authored encounters and exploration (world16)

The single encounter director introduces 36 ordinary creatures across six families: ink (0:00), garden (0:45), pond (1:40), toys (2:40), dunes (3:50), dream (5:00). Each family introduces basic movement first, then special roles with explicit unlock times. Squads contain one family, with occasional support from the previous family after the introduction. A 24-second rhythm includes a six-second recovery section; bosses reduce ordinary spawn pressure. The in-game journal lists the full roster and base attributes.

Music-box treasure takes three seconds inside a 105-unit world radius. Progress decays at 0.22 seconds per second outside, including unloaded chunks, and resumes on return. Its visible ring matches the interaction radius. World labels, loot names, elite names and exploration instructions now use icons and meters, with detail retained in the journal, tooltips and accessible labels.

Every level's XP requirement is exactly three times the previous live curve: level 1 requires 156 instead of 52; later levels require `6 * round((16 + level * 6.5 + level ** 1.33) * 1.9)`. Overflow carries into the next level.

The oblique ground factor is 0.62, actors remain upright, and architecture has paper foundation faces. This is an authored Canvas projection, not a full 3D engine or a measured reconstruction of another game's camera. See [WORLD16_VERIFICATION.md](docs/WORLD16_VERIFICATION.md), [ENCOUNTER_ROSTER16.md](docs/ENCOUNTER_ROSTER16.md), and [GODOT_COMMUNITY_ASSETS16.md](docs/GODOT_COMMUNITY_ASSETS16.md). Reference-video media and community preview downloads stay outside the shipped game.
