# PaperHand — offline game font subset

PaperHand is an independently renamed, modified subset of **LXGW WenKai Lite**
(Regular and Medium), distributed under the **SIL Open Font License 1.1**.
The complete upstream copyright notices, Reserved Font Names and license are in
[OFL.txt](OFL.txt). Copyright/author/license records are also retained in each font.

Official upstream: https://github.com/lxgw/LxgwWenKai-Lite
Pinned source commit: `3bca1fc0a0e00f6627f4c8bee60ef07778ab1820`

Changes:

- Subset to every character in the current `dist/**/*.js`, `dist/**/*.html` and
  `dist/**/*.css`, printable ASCII, and additional common Chinese punctuation.
- Rename the family, full names, PostScript names and unique IDs to **PaperHand**.
  The upstream Reserved Font Names are not used as the modified primary names.
- Add six original geometric UI symbol glyphs absent from the upstream font:
  return/refresh arrows, skull, fullscreen corners, and two four-point stars.
- Convert the regular and medium outlines to WOFF2 for offline browser delivery.
  The regular subset is also kept as a TTF for local preview/reuse. Full original
  TTFs are build inputs cached outside the repository, not shipping assets.

These modified fonts remain entirely under OFL-1.1. The independent game and its
other artwork do not become subject to the font license. No endorsement by the
upstream font authors is implied.

## Integration

Add this before the game rules in `style.css` and remove the online font import:

```css
@font-face {
  font-family: PaperHand;
  src: url('./fonts/PaperHand-Regular.woff2') format('woff2');
  font-style: normal;
  font-weight: 100 499;
  font-display: swap;
}
@font-face {
  font-family: PaperHand;
  src: url('./fonts/PaperHand-Medium.woff2') format('woff2');
  font-style: normal;
  font-weight: 500 900;
  font-display: swap;
}
```

Both ranges select fixed outlines: Regular or Medium, not a variable font.
Use `PaperHand, serif` for all DOM text and Canvas fonts. CSS `font` shorthands and
more-specific edition rules must also be replaced; setting only body is not enough.
Before first Canvas text drawing, await `document.fonts.load('400 16px PaperHand')`
and `document.fonts.load('700 16px PaperHand')` so baked text does not use a system
fallback. DOM text can swap as the assets load.

## Rebuild and verify

With Python `fonttools` and `brotli` installed:

```sh
python dist/fonts/subset-fonts.py
```

The script downloads only SHA-256-verified files from the pinned official source,
retains attribution, builds the renamed fonts, and verifies glyph coverage and
family names. Run again after adding game text. `font-manifest.json` records source
URLs, input/output hashes, file sizes, glyph counts, and any missing characters.
