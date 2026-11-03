# Licenses and attribution

The root MIT license covers the original game source, documentation and original procedural Canvas artwork. It does not replace the separate licenses of bundled third-party assets below. Retain these notices when redistributing the game.

| Files | Source / author | License | Modifications |
| --- | --- | --- | --- |
| `dist/audio/music.mp3` | “Master of the Feast” — Kevin MacLeod ([incompetech.com](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400019)) | [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) | Recording retained; runtime volume and loop crossfade are applied by the game. |
| `dist/audio/*.ogg` | [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds) — Kenney | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | Trimming, filtering, fades, normalization, pitch changes and premixing; per-clip records are included in the provenance JSON files. |
| `dist/fonts/PaperHand-*` | Modified subset of [LXGW WenKai Lite](https://github.com/lxgw/LxgwWenKai-Lite), including upstream Klee attribution | SIL Open Font License 1.1, copied in [`dist/fonts/OFL.txt`](dist/fonts/OFL.txt) | Renamed to PaperHand, subsetted, supplemented with original UI symbols and converted to WOFF2. |

Music attribution: “Master of the Feast” — Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0: https://creativecommons.org/licenses/by/4.0/

Full sound credits: [`dist/audio/CREDITS.txt`](dist/audio/CREDITS.txt). Original sound license: [`dist/audio/KENNEY-LICENSE.txt`](dist/audio/KENNEY-LICENSE.txt). Processing provenance: [`MIX-PROVENANCE.json`](dist/audio/MIX-PROVENANCE.json) and [`WARM-IMPACT-PROVENANCE.json`](dist/audio/WARM-IMPACT-PROVENANCE.json).

Font source revision, rebuilding instructions and modification details are in [`dist/fonts/README.md`](dist/fonts/README.md) and [`font-manifest.json`](dist/fonts/font-manifest.json). Font copyrights and reserved names remain in the bundled OFL notice and font metadata.

Rakuworld by SETO is a visual/gameplay reference only. Its code, extracted artwork, sound, reference videos and branding are not distributed as game assets in this repository. Referencing it does not imply affiliation or endorsement.
