# Stage 14 verification — 2026-11-03

Before changing the camera, the complete combat/audio work was preserved in local Git commit `4c682d34be4eb3b96fd38ac44ea2027fc7e2d59e`.

## Implemented behavior

- Core attacks have timed behaviors: staggered pencil volleys, returning scissors, expanding book sweeps, chained lightning, seeking paper winds, accelerating fire and delayed ink blossoms. Presentation uses trajectories, ribbons, geometry and unfolding particles rather than enlarged inventory icons.
- Authored sample families replace dull contact sounds. Contact events alternate three short variants, routed by weapon material, with a separate defeat outcome. A bounded 12-voice contact group releases old tails without suppressing fresh onsets; ordinary voice concurrency remains bounded.
- Real whip recordings and firecracker recordings replace mismatched launch sounds. Inspiration and supply-parcel cues use dedicated reward samples. Persistent beam audio follows construct lifetime, including rainbow beams; pause, hidden-page, settings and menu transitions release sustained sources.
- Six licensed biome tracks use equal-power crossfades, a 2.5-second region dwell and a seven-second switch guard. Each region retains its playback position. Loop boundaries also crossfade.
- The default run schedules five guardians in order, each with four action patterns and a half-health variation. Telegraph geometry and collision use the same locked world coordinates. Defeating an owner removes its projectiles and attacks immediately.
- Ground projection uses a 0.74 vertical factor. Characters and props are compensated at their ground anchor. Collision coordinates remain unchanged. Camera work includes height offsets, death effects, falling objects, lightning, rain, book pages, shadows, labels and foreground occlusion.
- The home screen keeps modes, play, controls, journal, edition links, totals and GitHub while replacing redundant explanatory copy with compact icons.

## Evidence

- All 13 `scripts/test-*.cjs` suites (excluding the helper) passed, including combat, rewards, weapon voices, target/telegraph geometry, camera-adjacent rendering and frame scheduling. `scripts/test-global-stats.mjs` passed.
- `scripts/verify-weapon-timbres.cjs`: 63 weapon keys, nine material categories, 67 Ogg launch files, source/output hashes and processing envelopes verified.
- `scripts/browser-stage14-qa.cjs`: 153 audio samples decoded without failure; real attacks emitted pencil, book, scissors, whip, firecracker and rainbow cues. Each of five bosses reached its warning, paused without advancing, and cleared its attacks on defeat. Canvas ground scale was 0.7400000095; upright scale was 1; no page errors.
- `scripts/browser-camera-qa.cjs`: 49 advanced weapon presentations rendered in warning/active phases. Sprite entrances, nested transforms and rotated parents preserved aspect. Lightning landed within 0.0001 screen units of the expected ground point. No page errors.
- Boss integration tests run each guardian through 1,600 simulation frames, exercise all four patterns, and check dead-owner cleanup through the real `hit()` path.
- Home screen checked at 1360×900, 390×844 and 844×390 without overflow, missing IDs or interaction errors.
- `scripts/browser-kinetic-qa.cjs` exercises eight simultaneous launch voices, nine consecutive contacts, an audible sustained loop seam, actual rainbow beam pause/resume/end, and all six biome transitions. Its report is `qa/kinetic13-browser.json`; the filename is retained for the earlier test harness, but a rerun covers current files.
- Production Vinext build completed successfully. Publication and GitHub sync are reported separately after their respective native/Git read-back checks.

## Limits

Audio decoding, waveform measurements and captured output confirm playback, not personal listening preference. The local recording is produced from the game mixer; music and sound effects retain their separate attribution/license requirements. Headless browser and deterministic simulation checks are not a guarantee of frame rate on every device. The camera is an orthographic 2D projection adjustment, not a change to a 3D engine. Strong effects remain local and respect the reduced-effects setting.
