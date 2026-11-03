# Paper-magic sound palette — soft15

The user reported that the upgrade cue and repeated enemy contacts sounded mismatched, scratchy and distorted. This revision keeps the identity of each action while making the sound palette lighter and more consistent with the paper-cutout fantasy world.

- Short ascending pizzicato replaces the previous upgrade cue; collection cues belong to the same friendly family.
- Repeated contacts use bounded, short, elastic recordings instead of torn-book, electrical-noise and brittle-break textures. Three variants remain for each contact family, and every accepted hit onset keeps its own voice.
- The common SFX path uses a gentle -4 dB high shelf at 3.5 kHz and a 9.2 kHz low-pass. The contact path rolls off above 5.2 kHz. A 150 Hz high-pass keeps low thumps from dominating.
- Contact onsets fade in over 7 ms, rewards over 12 ms, and other short effects over 5 ms. Sustained beams continue to follow the visible attack's lifetime.
- Weapon identities remain separate. Fire/electric/crush launch gain is moderated, and tonal samples avoid random detuning. This is a shared mix treatment, not replacing every weapon with one generic sound.
- Fusion, event, healing, confirmation and damage feedback no longer stack the old mismatched legacy layers. Damage remains distinct from positive rewards. Chest stops retain their progression; the jackpot no longer adds a second overlapping reveal layer.
- Sample URLs carry `20261103-soft15`, so a refreshed game requests the revised audio instead of reusing an older cached file.
- Home statistics now explicitly say 全球局数 and 全球时长.

## Verification

`node scripts/test-impact-audio.cjs` checks simultaneous weapon voices, reward/damage playback through overlays, no duplicate impact feedback and the sampled mixer routes. `node scripts/test-weapon-voices.cjs` checks all 63 active attack identities through real combat triggers.

`scripts/browser-audio-style-qa.cjs` records the actual game audio bus for rewards, material contacts, defeats and an eight-weapon / 12-contact / sustained-beam pressure sequence at 100% SFX volume. The before and after JSON reports are in `qa/audio-style-before.json` and `qa/audio-style-after.json`; captures are local QA files, not shipped production assets.

The old version's measured peak was 0.7051 with zero sampled values at or above 0.999 in this scenario. This test did not establish digital clipping in the old mixer. The complaint is therefore addressed through source selection, spectral/attack shaping and removal of inconsistent layers rather than merely turning the master volume down. The waveform test does not certify subjective listening preference or cover all possible devices and concurrent effects.

Detailed offline edits, source hashes, author links and sample measurements are retained beside the audio assets. All revised source samples retain their original licenses.

Final browser pressure run: 153 samples decoded with no failed files; 272 contact onsets emitted with zero rejected; peak 0.5324, zero sampled clipping readings, no page errors. The 0.7051 before peak and 0.5324 after peak are from the same scripted schedule, including the stress section at 100% SFX volume. Capture timing can introduce small run-to-run differences.
