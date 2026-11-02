# 涂鸦幸存者 / Doodle Survivors

Single-player browser survival game. Vanilla JavaScript, Canvas 2D and sampled Web Audio; no generated images, image assets, dependencies or build step.

## Run

Serve `dist/` using a static HTTP server, for example `python3 -m http.server 4173 --directory dist`.

Controls: WASD / arrows to move, Space to dash, E to cast the charged ink storm, P / Escape to pause, F to toggle fullscreen. Touch joystick and ability buttons are supported.

Firepower mode starts with pencil volleys, orbiting pages, chain lightning and tornadoes. Growth mode starts with pencils. Defeat elites for chests, select upgrades, avoid telegraphed beetle charges and boss attacks. Survive three minutes and defeat the boss to win.

## Verification

`node test-mechanics.cjs` checks state transitions, player movement, dash cooldown, damage protection, XP and upgrades, ultimate charge, defeat/restart, boss spawn and victory conditions, and a full-duration scripted simulation with extra health. It is a stability test, not evidence of human completion or balance.

Browser QA covers start, movement, abilities, upgrade cards, pause and actual recorded background music playback. Audio credits and license links are in the sound settings and `dist/audio/CREDITS.txt`.

## Art and source

`dist/art.js`: original procedurally drawn frames, textures, characters, weapons and environment.
`dist/game.js`: game loop, collision grid, enemies, progression, effects and input.
`dist/audio.js`: licensed recorded music, sampled Foley effects, gain control and polyphony limiting.

Reference: the visual/gameplay presentation in Rakuworld by SETO. This independent prototype does not use original game source, extracted assets or branding.
