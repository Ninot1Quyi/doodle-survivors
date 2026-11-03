# Licenses and attribution

The root MIT license covers the original game source, documentation and original procedural Canvas artwork. It does not replace the separate licenses of bundled third-party assets below. Retain these notices when redistributing the game.

| Files | Source / author | License | Modifications |
| --- | --- | --- | --- |
| `public/audio/music.mp3` | “Master of the Feast” — Kevin MacLeod ([incompetech.com](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400019)) | [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) | Recording retained; runtime volume and loop crossfade are applied by the game. |
| Legacy `public/audio/*.ogg`, excluding `slot*.ogg` | [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds) — Kenney | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | Trimming, filtering, fades, normalization, pitch changes and premixing; per-clip records are included in the provenance JSON files. |
| `public/audio/weapons/*.ogg` and `public/audio/slot*.ogg` | Kenney Impact Sounds, [RPG Audio](https://kenney.nl/assets/rpg-audio), [Digital Audio](https://kenney.nl/assets/digital-audio), [Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds), [Music Jingles](https://kenney.nl/assets/music-jingles), and [Dustyroom Free Casual Game Sounds](https://dustyroom.com/free-casual-game-sounds/) | CC0 1.0 Universal | Leading-silence trimming, gain adjustment, 3 ms fade-in and OGG encoding. Each source file and output hash is recorded in `WEAPON-AUDIO-PROVENANCE.json`. |
| `public/fonts/PaperHand-*` | Modified subset of [LXGW WenKai Lite](https://github.com/lxgw/LxgwWenKai-Lite), including upstream Klee attribution | SIL Open Font License 1.1, copied in [`public/fonts/OFL.txt`](public/fonts/OFL.txt) | Renamed to PaperHand, subsetted, supplemented with original UI symbols and converted to WOFF2. |

Music attribution: “Master of the Feast” — Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0: https://creativecommons.org/licenses/by/4.0/

Full sound credits: [`public/audio/CREDITS.txt`](public/audio/CREDITS.txt). Original sound license: [`public/audio/KENNEY-LICENSE.txt`](public/audio/KENNEY-LICENSE.txt). Processing provenance: [`MIX-PROVENANCE.json`](public/audio/MIX-PROVENANCE.json) and [`WARM-IMPACT-PROVENANCE.json`](public/audio/WARM-IMPACT-PROVENANCE.json).

The voices12 release adds 71 sound files: 63 weapon identities, two alternate book-page takes and six chest cues. Per-file source pack, source SHA-256, output SHA-256 and processing are recorded in [`WEAPON-AUDIO-PROVENANCE.json`](public/audio/WEAPON-AUDIO-PROVENANCE.json). Original notices are retained in [`LICENSE-rpg-audio.txt`](public/audio/LICENSE-rpg-audio.txt), [`LICENSE-digital-audio.txt`](public/audio/LICENSE-digital-audio.txt), [`LICENSE-sci-fi-sounds.txt`](public/audio/LICENSE-sci-fi-sounds.txt), [`LICENSE-music-jingles.txt`](public/audio/LICENSE-music-jingles.txt), and [`LICENSE-Dustyroom.pdf`](public/audio/LICENSE-Dustyroom.pdf). The Impact Sounds notice listed above also applies to its weapon sample.

Font source revision, rebuilding instructions and modification details are in [`public/fonts/README.md`](public/fonts/README.md) and [`font-manifest.json`](public/fonts/font-manifest.json). Font copyrights and reserved names remain in the bundled OFL notice and font metadata.

Rakuworld by SETO is a visual/gameplay reference only. Its code, extracted artwork, sound, reference videos and branding are not distributed as game assets in this repository. Referencing it does not imply affiliation or endorsement.

## Bundled deployment tooling

- `scripts/vite/sites-vite-plugin.ts`: OpenAI, MIT; full notice in [`scripts/vite/sites-vite-plugin.LICENSE`](scripts/vite/sites-vite-plugin.LICENSE).
- `vendor/shadcn-tailwind-4.13.0.css`: shadcn, MIT; full notice in [`vendor/shadcn-tailwind-4.13.0.LICENSE.md`](vendor/shadcn-tailwind-4.13.0.LICENSE.md).
- Runtime and build packages are pinned by `package-lock.json` and retain their own package licenses when installed. This project's MIT license does not relicense those dependencies.
