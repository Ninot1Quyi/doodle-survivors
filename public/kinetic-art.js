'use strict';
// Local world-space attack artwork. No simulation state, filters, shadow blur or per-frame canvases.
// age/duration are seconds; coordinates/radii/width are world units. All methods restore context state.
const KineticArt = (() => {
  const TAU = Math.PI * 2;
  const PAPER = '#fff3cb', CORE = '#fffce9', INK = '#6c5788', SECOND = '#e9a9d6';
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const finite = (...values) => values.every(Number.isFinite);
  const noise = (i, t = 0) => Math.sin(i * 12.9898 + t) * .62 + Math.sin(i * 5.371 + t * .7) * .38;
  const easeOut = t => 1 - (1 - t) ** 3;
  function stroke(g, color, width, alpha = 1) {
    g.strokeStyle = color; g.lineWidth = width; g.globalAlpha = alpha;
    g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke();
  }
  function star(g, x, y, r, angle, color, alpha = 1, points = 4) {
    g.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const a = angle + i * Math.PI / points, rr = i % 2 ? r * .25 : r;
      const xx = x + Math.cos(a) * rr, yy = y + Math.sin(a) * rr;
      if (!i) g.moveTo(xx, yy); else g.lineTo(xx, yy);
    }
    g.closePath(); g.globalAlpha = alpha; g.fillStyle = color; g.fill();
    stroke(g, INK, .65, alpha * .5);
  }
  function ellipse(g, x, y, rx, ry, rotation, color, width, alpha, start = 0, end = TAU) {
    g.beginPath(); g.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), rotation, start, end);
    stroke(g, color, width, alpha);
  }
  function chip(g, x, y, size, angle, color, alpha) {
    g.save(); g.translate(x, y); g.rotate(angle);
    g.beginPath(); g.moveTo(-size, -size * .45); g.lineTo(size * .6, -size * .7);
    g.lineTo(size, size * .35); g.lineTo(-size * .7, size * .65); g.closePath();
    g.globalAlpha = alpha; g.fillStyle = color; g.fill(); stroke(g, INK, .6, alpha * .55);
    g.beginPath(); g.moveTo(-size * .4, -.5); g.lineTo(size * .45, size * .1);
    stroke(g, PAPER, .8, alpha * .7); g.restore();
  }
  function localBeam(g, length, width, t, shift, phase) {
    const segments = clamp(Math.ceil(length / 40), 8, 26);
    g.beginPath();
    for (let i = 0; i <= segments; i++) {
      const u = i / segments, envelope = Math.sin(u * Math.PI);
      const y = shift + noise(i + phase, t) * width * envelope;
      if (!i) g.moveTo(0, y); else g.lineTo(length * u, y);
    }
  }
  // Bounding envelope: segment expanded by max(30, width * 3) at both ends.
  function beam(g, { x, y, x2, y2, width = 12, age = 0, color = '#a9b4ff', reduced = false } = {}) {
    if (!g || !finite(x, y, x2, y2, width, age) || width <= 0) return;
    const dx = x2 - x, dy = y2 - y, length = Math.hypot(dx, dy), w = width;
    const t = reduced ? 0 : age * 3.2, speed = reduced ? 0 : age * .35;
    g.save(); g.translate(x, y); g.rotate(Math.atan2(dy, dx));
    // Broad translucent paper strips give luminous volume without a bloom filter.
    for (let layer = 2; layer >= 0; layer--) {
      g.beginPath(); g.moveTo(-w * .2, -w * (.32 + layer * .42));
      g.quadraticCurveTo(length * .45, -w * (.8 + layer * .45), length + w * .2, -w * .25);
      g.lineTo(length + w * .2, w * .25);
      g.quadraticCurveTo(length * .55, w * (.8 + layer * .45), -w * .2, w * (.32 + layer * .42));
      g.closePath(); g.fillStyle = color; g.globalAlpha = layer === 0 ? .34 : .1; g.fill();
    }
    localBeam(g, length, w * .16, t * .42, -w * .4, 3);
    stroke(g, SECOND, w * .48, .7);
    localBeam(g, length, w * .14, -t * .4, w * .32, 9);
    stroke(g, color, w * .62, .9);
    localBeam(g, length, w * .055, t * .3, 0, 2);
    stroke(g, PAPER, w * .36, .98); stroke(g, CORE, Math.max(1.1, w * .12), 1);
    // Crawling zigzag arcs around the sustained solid core.
    for (let side = -1; side <= 1; side += 2) {
      localBeam(g, length, w * .55, t + side * 2, side * w * .64, side * 3);
      stroke(g, color, 2.2, .65); stroke(g, PAPER, .85, .9);
    }
    // Broken parallel wax hatching, moving gently along the direction of attack.
    const count = Math.min(18, Math.max(3, Math.ceil(length / 50)));
    for (let i = 0; i < count; i++) {
      const u = ((i / count + speed) % 1 + 1) % 1, xx = u * length;
      const yy = Math.sin(i * 2.4 + t * .2) * w * .45;
      g.beginPath(); g.moveTo(xx, yy); g.lineTo(Math.min(length, xx + 8 + w), yy - w * .1);
      stroke(g, PAPER, .75, .55);
    }
    ellipse(g, 0, 0, w * .65, w * 1.25, 0, color, 2.2, .7);
    ellipse(g, length, 0, w * .8, w * 1.5, 0, PAPER, 2.4, .95);
    star(g, length, 0, Math.max(10, w * 1.35), t * .12, CORE, .95);
    const sparks = reduced ? 3 : 7;
    for (let i = 0; i < sparks; i++) {
      const a = i * TAU / sparks + .2, travel = reduced ? .35 : ((age * .6 + i * .173) % 1);
      const rr = w * (1 + travel * 1.5), sx = length + Math.cos(a) * rr, sy = Math.sin(a) * rr;
      g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a) * w * .35, sy + Math.sin(a) * w * .35);
      stroke(g, i % 2 ? PAPER : color, 1.4, (1 - travel) * .85);
    }
    g.restore();
  }
  function crescentPath(g, r, angle, spread, thickness) {
    const outer = r, inner = r * (1 - thickness), a = angle - spread, b = angle + spread;
    g.beginPath(); g.moveTo(Math.cos(a) * outer, Math.sin(a) * outer);
    g.arc(0, 0, outer, a, b);
    g.quadraticCurveTo(Math.cos(angle) * inner * 1.15, Math.sin(angle) * inner * 1.15,
      Math.cos(a) * outer, Math.sin(a) * outer);
    g.closePath();
  }
  // Bounding circle: 1.5*r + 10. angle is the attack's forward direction, in radians.
  function cut(g, { x, y, angle = 0, r = 100, age = 0, duration = .65, color = '#d9b3ef', reduced = false } = {}) {
    if (!g || !finite(x, y, angle, r, age, duration) || r <= 0 || duration <= 0 || age < 0 || age >= duration) return;
    const u = age / duration, opened = easeOut(Math.min(1, u * 3.8));
    const fade = Math.min(1, (1 - u) * 2.8), rr = r * (.55 + .45 * opened);
    const spread = .24 + opened * 1.02, tilt = angle + (reduced ? 0 : (u - .5) * .25);
    g.save(); g.translate(x, y);
    // Three solid ribbon slices, expanding along the same attack axis.
    for (let i = reduced ? 1 : 3; i >= 0; i--) {
      crescentPath(g, rr * (1 - i * .085), tilt - i * .045, spread, .23);
      g.fillStyle = i ? color : PAPER; g.globalAlpha = fade * (i ? .11 + (3 - i) * .04 : .95); g.fill();
      stroke(g, i ? SECOND : color, i ? 1 : 2, fade * (i ? .25 : .9));
    }
    crescentPath(g, rr * .98, tilt, spread * .96, .12);
    g.fillStyle = CORE; g.globalAlpha = fade * .85; g.fill();
    // Sketched speed lines follow the cut, never screen axes.
    for (let i = 0; i < 7; i++) {
      const a = tilt + (i / 6 - .5) * spread * 1.5;
      const from = rr * (.4 + i % 2 * .1), to = rr * (.75 + i % 3 * .06);
      g.beginPath(); g.moveTo(Math.cos(a) * from, Math.sin(a) * from);
      g.lineTo(Math.cos(a) * to, Math.sin(a) * to);
      stroke(g, i % 2 ? color : PAPER, 1.1, fade * .6);
    }
    const chips = reduced ? 3 : 9;
    for (let i = 0; i < chips; i++) {
      const a = angle + (i / Math.max(1, chips - 1) - .5) * 2.1;
      const distance = r * (.65 + u * .7), size = Math.min(7, r * .045) * (1 - u * .55);
      chip(g, Math.cos(a) * distance, Math.sin(a) * distance, size,
        a + (reduced ? .3 : u * 2 + i), i % 2 ? color : PAPER, fade * .8);
    }
    g.restore();
  }
  // Bounding circle: 1.42*r + 10. Compression, bloom and debris are continuous phases, no flashes.
  function eruption(g, { x, y, r = 140, age = 0, duration = 1.15, color = '#c8a9ed', reduced = false } = {}) {
    if (!g || !finite(x, y, r, age, duration) || r <= 0 || duration <= 0 || age < 0 || age >= duration) return;
    const u = age / duration, compression = clamp(u / .18, 0, 1);
    const bloom = easeOut(clamp((u - .14) / .52, 0, 1)), fade = Math.min(1, (1 - u) * 2.6);
    const radius = u < .18 ? r * (.2 - compression * .1) : r * (.1 + bloom * .95);
    g.save(); g.translate(x, y);
    if (u < .2) {
      ellipse(g, 0, 0, r * (.32 - compression * .2), r * (.26 - compression * .15), 0, color, 3, .8);
      star(g, 0, 0, radius, (reduced ? 0 : u * 2), PAPER, .85, 6);
      for (let i = 0; i < 6; i++) {
        const a = i * TAU / 6, rr = r * (.38 - compression * .17);
        chip(g, Math.cos(a) * rr, Math.sin(a) * rr, 3, a, color, .7);
      }
    } else {
      const petals = reduced ? 8 : 12;
      for (let i = 0; i < petals; i++) {
        const a = i * TAU / petals, rr = radius * (.83 + .13 * Math.sin(i * 3.4));
        const spread = .17, inner = radius * .23;
        g.beginPath(); g.moveTo(Math.cos(a - spread) * inner, Math.sin(a - spread) * inner);
        g.quadraticCurveTo(Math.cos(a - spread * 1.4) * rr, Math.sin(a - spread * 1.4) * rr,
          Math.cos(a) * rr, Math.sin(a) * rr);
        g.quadraticCurveTo(Math.cos(a + spread * 1.4) * rr, Math.sin(a + spread * 1.4) * rr,
          Math.cos(a + spread) * inner, Math.sin(a + spread) * inner);
        g.closePath(); g.fillStyle = i % 3 ? color : SECOND; g.globalAlpha = fade * .25; g.fill();
        stroke(g, color, 1.4, fade * .75);
        g.beginPath(); g.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        g.lineTo(Math.cos(a) * rr * .89, Math.sin(a) * rr * .89);
        stroke(g, PAPER, 2.2, fade * .85);
        // Broken dry-brush strokes inside each expanding petal.
        g.beginPath(); g.moveTo(Math.cos(a + .04) * rr * .48, Math.sin(a + .04) * rr * .48);
        g.lineTo(Math.cos(a + .04) * rr * .71, Math.sin(a + .04) * rr * .71);
        stroke(g, CORE, .7, fade * .7);
      }
      ellipse(g, 0, 0, radius, radius * .86, 0, color, 5 * (1 - u) + 1, fade * .5);
      ellipse(g, 0, 0, radius * .91, radius * .79, -.06, PAPER, 1.7, fade * .85);
      star(g, 0, 0, r * (.08 + .15 * (1 - bloom)), 0, CORE, fade, 6);
      const n = reduced ? 6 : 14;
      for (let i = 0; i < n; i++) {
        const a = i * TAU / n + .13, travel = r * (.27 + bloom * 1.05);
        chip(g, Math.cos(a) * travel, Math.sin(a) * travel, Math.min(6, r * .035) * (1 - u * .5),
          a + (reduced ? 0 : u * 2), i % 2 ? color : PAPER, fade * .75);
      }
    }
    g.restore();
  }
  // Bounding circle: 1.25*r + 12. angle is the orbital phase (clockwise in Canvas coordinates).
  function orbit(g, { x, y, r = 100, angle = 0, age = 0, color = '#aab9ea', reduced = false } = {}) {
    if (!g || !finite(x, y, r, angle, age) || r <= 0) return;
    const t = reduced ? 0 : age * .28, phase = angle;
    g.save(); g.translate(x, y);
    // Two interlocking elliptical paper hoops create an armillary instrument.
    ellipse(g, 0, 0, r, r * .43, .3, color, 2.5, .75);
    ellipse(g, 0, 0, r * .97, r * .43, -.55, SECOND, 2, .55);
    ellipse(g, 0, 0, r * .97, r * .4, .31, PAPER, .85, .8);
    ellipse(g, 0, 0, r * .82, r * .65, .9, color, 1.3, .3);
    // Graduations and small clipped-paper joints rather than a static ring icon.
    for (let i = 0; i < 16; i++) {
      const a = i * TAU / 16 + .3, rx = Math.cos(a), ry = Math.sin(a);
      g.beginPath(); g.moveTo(rx * r * .93, ry * r * .43);
      g.lineTo(rx * r * 1.02, ry * r * .47);
      stroke(g, i % 4 ? color : PAPER, i % 4 ? .9 : 1.8, .6);
    }
    for (let i = 0; i < 5; i++) {
      const a = phase + i * TAU / 5, xx = Math.cos(a) * r, yy = Math.sin(a) * r * .43;
      const da = .44;
      ellipse(g, 0, 0, r, r * .43, 0, color, 5, .18, a - da, a);
      ellipse(g, 0, 0, r, r * .43, 0, PAPER, 1.5, .75, a - da * .55, a);
      const size = Math.min(13, Math.max(4, r * .075));
      star(g, xx, yy, size, a + t, i % 2 ? PAPER : color, .95, 5);
      if (!reduced) {
        const satellite = a * 1.6 + t, sr = size * 1.9;
        chip(g, xx + Math.cos(satellite) * sr, yy + Math.sin(satellite) * sr * .6,
          2.5, satellite, SECOND, .7);
      }
    }
    star(g, 0, 0, Math.min(10, r * .08), t * .4, PAPER, .8, 4);
    g.restore();
  }
  return Object.freeze({ beam, cut, eruption, orbit });
})();
