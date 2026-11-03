'use strict';
// Pure, local world-space boss choreography. Inputs own all timing and collision geometry.
// No globals from the simulation, DOM, sprite registry, filters or temporary canvases.
const BossChoreographyArt = (() => {
  const TAU = Math.PI * 2, PAPER = '#fff0d0', INK = '#695474', DANGER = '#e46b75';
  const themes = {
    rose: { color: '#dca6c3', accent: '#a9c3a0' },
    crab: { color: '#e4aa96', accent: '#d4bb8e' },
    owl: { color: '#c3b3d8', accent: '#e0ccb0' },
    ink: { color: '#bca1d0', accent: '#d2b78b' },
    clock: { color: '#d5bd91', accent: '#b8a1d0' },
    serpent: { color: '#a6c9bd', accent: '#e2c08c' },
    moon: { color: '#b1c5e3', accent: '#d7b7d4' }
  };
  function theme(kind) {
    if (kind === 'bossRose' || kind === 'bossFrog') return 'rose';
    if (kind === 'bossCrab') return 'crab';
    if (kind === 'bossOwl') return 'owl';
    if (kind === 'bossClock') return 'clock';
    if (kind === 'bossSerpent') return 'serpent';
    if (kind === 'bossMoon' || kind === 'bossCloud') return 'moon';
    return themes[kind] ? kind : 'ink';
  }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const finite = (...v) => v.every(Number.isFinite);
  const ease = t => t * t * (3 - 2 * t);
  function line(g, color, w, alpha = 1) {
    g.strokeStyle = color; g.lineWidth = w; g.globalAlpha = alpha;
    g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke();
  }
  function ring(g, r, aspect, angle, color, w, alpha = 1, a = 0, b = TAU) {
    g.beginPath(); g.ellipse(0, 0, Math.max(.01, r), Math.max(.01, r * aspect), angle, a, b);
    line(g, color, w, alpha);
  }
  function shard(g, x, y, r, a, color, alpha = 1) {
    g.save(); g.translate(x, y); g.rotate(a);
    g.beginPath(); g.moveTo(-r, 0); g.lineTo(-r * .3, -r * .6);
    g.lineTo(r, -r * .25); g.lineTo(r * .45, r * .7); g.closePath();
    g.fillStyle = color; g.globalAlpha = alpha; g.fill(); line(g, INK, .7, alpha * .55);
    g.beginPath(); g.moveTo(-r * .45, 0); g.lineTo(r * .45, -r * .08);
    line(g, PAPER, .8, alpha * .65); g.restore();
  }
  function petal(g, x, y, length, a, color, alpha = 1) {
    g.save(); g.translate(x, y); g.rotate(a);
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(length * .2, -length * .4, length, 0);
    g.quadraticCurveTo(length * .2, length * .4, 0, 0); g.closePath();
    g.fillStyle = color; g.globalAlpha = alpha; g.fill(); line(g, INK, .75, alpha * .5);
    g.beginPath(); g.moveTo(length * .2, 0); g.lineTo(length * .75, 0);
    line(g, PAPER, 1, alpha * .7); g.restore();
  }
  function crescent(g, x, y, radius, angle, color, alpha = 1) {
    g.save(); g.translate(x, y); g.rotate(angle);
    g.beginPath(); g.moveTo(radius * .35, -radius);
    g.bezierCurveTo(-radius * 1.3, -radius, -radius * 1.25, radius, radius * .5, radius * .7);
    g.quadraticCurveTo(-radius * .6, radius * .3, -radius * .25, -radius * .3);
    g.quadraticCurveTo(-radius * .1, -radius * .7, radius * .35, -radius);
    g.closePath(); g.globalAlpha = alpha; g.fillStyle = color; g.fill(); line(g, INK, .8, alpha * .55); g.restore();
  }
  function gear(g, x, y, r, angle, color, alpha = 1) {
    g.save(); g.translate(x, y); g.rotate(angle);
    ring(g, r * .75, 1, 0, color, Math.max(2, r * .17), alpha);
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8;
      g.beginPath(); g.moveTo(Math.cos(a) * r * .65, Math.sin(a) * r * .65);
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r); line(g, color, Math.max(2, r * .23), alpha);
    }
    ring(g, r * .35, 1, 0, PAPER, 1, alpha * .8); g.restore();
  }
  function phaseData(p) {
    const phase = ({ charge: 'windup', active: 'cast', recovery: 'recover' })[p.phase] || p.phase || 'windup';
    const u = clamp(Number.isFinite(p.progress) ? p.progress : (p.age || 0) / Math.max(.001, p.duration || 1));
    const weight = phase === 'windup' ? ease(u) : phase === 'recover' ? 1 - ease(u) : Math.sin(Math.PI * (.25 + u * .65));
    return { phase, u, weight };
  }
  /**
   * pose(ctx,{kind,x,y,phase:'windup'|'cast'|'recover',progress,age,duration,
   *   scale=1,facing=1,reduced=false,sprite?:{img,w,h}})
   * Returns {offsetX,offsetY,rotation,scaleX,scaleY} for callers drawing their own body.
   * Passing sprite draws that body once, followed by themed hands/cape/casting overlays.
   * Body stays anchored at its feet; overlay radius <= 120*scale, height <= 230*scale.
   */
  function pose(g, p = {}) {
    const { x, y, scale = 1, facing = 1, reduced = false } = p;
    if (!g || !finite(x, y, scale) || scale <= 0) return null;
    const key = theme(p.kind), c = themes[key], { phase, u, weight: k } = phaseData(p);
    const direction = facing < 0 ? -1 : 1, casting = phase === 'cast', recovering = phase === 'recover';
    const motion = reduced ? .28 : 1, crouch = phase === 'windup' ? k : recovering ? (1 - u) * .5 : -Math.sin(Math.PI * u) * .5;
    const body = {
      offsetX: casting ? direction * Math.sin(Math.PI * u) * 7 * scale * motion : 0,
      offsetY: (crouch * 5 - (key === 'moon' ? k * 8 : 0)) * scale * motion,
      rotation: (casting ? -.05 : .025) * k * direction * motion,
      scaleX: 1 + crouch * .035 * motion,
      scaleY: 1 - crouch * .04 * motion
    };
    g.save(); g.translate(x + body.offsetX, y + body.offsetY); g.scale(direction * scale, scale);
    if (p.sprite?.img && finite(p.sprite.w, p.sprite.h)) {
      g.save(); g.rotate(body.rotation * direction); g.scale(body.scaleX, body.scaleY);
      g.drawImage(p.sprite.img, -p.sprite.w / 2, -p.sprite.h, p.sprite.w, p.sprite.h); g.restore();
    }
    const hands = 48 + k * (casting ? 40 : 16), height = -85 - k * 30;
    // Hands visibly gather inward while charging, open during casting and settle in recovery.
    for (let side of [-1, 1]) {
      const hx = side * hands, hy = height + (recovering ? u * 22 : 0);
      g.beginPath(); g.moveTo(side * 40, -95);
      g.quadraticCurveTo(side * (51 + k * 12), hy + 22, hx, hy);
      line(g, c.color, 12, .88); line(g, PAPER, 3, .7);
      if (key === 'crab') {
        g.save(); g.translate(hx, hy); g.rotate(side * (.3 + k * .4));
        g.beginPath(); g.moveTo(-12, 12); g.bezierCurveTo(-31, -5, -23, -33, -8, -24);
        g.lineTo(0, -9); g.lineTo(11, -27); g.bezierCurveTo(26, -19, 27, 1, 12, 13); g.closePath();
        g.globalAlpha = .92; g.fillStyle = c.color; g.fill(); line(g, INK, 1.2, .8);
        g.beginPath(); g.moveTo(-15, 0); g.lineTo(-13, -15); line(g, PAPER, 2, .8); g.restore();
      } else if (key === 'owl') {
        for (let j = 0; j < 5; j++) petal(g, hx * .6, hy + 12, 28 + j * 4,
          side < 0 ? Math.PI + .2 + j * .17 - k * .15 : -.2 - j * .17 + k * .15, j % 2 ? c.color : c.accent, .88);
      } else if (key === 'clock') gear(g, hx, hy, 12 + k * 5, reduced ? side * .3 : side * u * 1.2, c.accent, .9);
      else if (key === 'rose') {
        for (let j = 0; j < 5; j++) petal(g, hx, hy, 12 + k * 7, j * TAU / 5 + side * u * motion, c.color, .9);
      } else if (key === 'moon') crescent(g, hx, hy, 16 + k * 5, side * .25, c.accent, .9);
      else if (key === 'serpent') {
        g.beginPath(); g.moveTo(hx - 10, hy + 3); g.quadraticCurveTo(hx, hy - 20, hx + 13, hy - 1);
        line(g, c.color, 9, .9); line(g, PAPER, 2, .8);
      } else {
        for (let j = 0; j < 4; j++) shard(g, hx + Math.cos(j * 1.8) * 10, hy + Math.sin(j * 1.8) * 9, 7, j + u * motion, c.color, .9);
      }
    }
    // Upper-body identity cue: crown / halo / winding ring, deliberately slower than attack timing.
    g.save(); g.translate(0, -166 - k * 9 * motion);
    if (key === 'crab') {
      for (let side of [-1, 1]) petal(g, side * 10, 5, 21, side < 0 ? -1.9 : -1.2, c.accent, .8);
    } else if (key === 'owl') {
      ring(g, 27, .6, 0, c.accent, 1.7, .65);
      for (let side of [-1, 1]) petal(g, side * 17, 6, 25, side < 0 ? -2 : -1.1, c.color, .85);
    } else if (key === 'clock') {
      gear(g, 0, 0, 26, reduced ? 0 : u * .45, c.color, .75);
      g.beginPath(); g.moveTo(0, -16); g.lineTo(0, 0); g.lineTo(13, 7); line(g, PAPER, 2, .9);
    } else if (key === 'serpent') {
      for (let side of [-1, 1]) petal(g, side * 15, 3, 28, side < 0 ? -2 : -1.1, c.accent, .8);
    } else if (key === 'moon') {
      crescent(g, 0, 0, 24, -.25, c.accent, .8);
      ring(g, 35, .4, .3, c.color, 1.6, .6);
    } else if (key === 'rose') {
      for (let j = 0; j < 6; j++) petal(g, 0, 0, 25, j * TAU / 6, c.color, .7);
    } else {
      g.beginPath(); g.moveTo(-26, 9); g.lineTo(-29, -13); g.lineTo(-12, -3);
      g.lineTo(0, -23); g.lineTo(13, -3); g.lineTo(28, -14); g.lineTo(25, 9); g.closePath();
      g.fillStyle = c.accent; g.globalAlpha = .85; g.fill(); line(g, INK, 1, .7);
    }
    g.restore();
    // Paper folds travel from shoulders toward the hands; no screen shake or opacity flashing.
    if (k > .1) for (let i = 0; i < (reduced ? 3 : 7); i++) {
      const a = i * TAU / 7, rr = 20 + k * 19;
      shard(g, Math.cos(a) * rr, -100 + Math.sin(a) * rr * .6, 2 + k * 2, a, PAPER, k * .65);
    }
    g.restore(); return body;
  }
  function field(g, key, r, u, angle, reduced, color) {
    const c = themes[key], a = angle, bloom = ease(clamp(u * 2.2)), fade = Math.min(1, (1 - u) * 3);
    const radius = r * (.18 + bloom * .8), t = reduced ? 0 : u;
    if (key === 'rose') {
      const count = reduced ? 6 : 9;
      for (let i = 0; i < count; i++) {
        const aa = a + i * TAU / count, ex = Math.cos(aa) * radius, ey = Math.sin(aa) * radius;
        g.beginPath(); g.moveTo(0, 0);
        g.bezierCurveTo(Math.cos(aa - .25) * radius * .45, Math.sin(aa - .25) * radius * .45,
          Math.cos(aa + .18) * radius * .8, Math.sin(aa + .18) * radius * .8, ex, ey);
        line(g, c.accent, Math.max(2, r * .027), fade * .85); line(g, PAPER, 1, fade * .7);
        for (let j = 0; j < 3; j++) petal(g, ex, ey, Math.min(17, r * .12) * (1 - u * .4),
          aa + j * TAU / 3 + t * .4, color, fade * .8);
        petal(g, ex * .58, ey * .58, Math.min(12, r * .08), aa - .6, c.accent, fade * .7);
      }
    } else if (key === 'crab') {
      // Two wide pincer faces approach from opposite sides, close, then shed paper fragments.
      const closing = ease(clamp(u * 2.5)), gap = r * (.68 - closing * .39);
      g.save(); g.rotate(a);
      for (let side of [-1, 1]) {
        g.save(); g.translate(side * gap, 0); g.scale(side, 1);
        g.beginPath(); g.moveTo(-r * .09, -r * .43);
        g.bezierCurveTo(r * .48, -r * .54, r * .51, r * .49, -r * .09, r * .43);
        g.lineTo(r * .06, r * .16); g.lineTo(-r * .1, r * .1);
        g.lineTo(r * .1, -r * .07); g.lineTo(-r * .08, -r * .17); g.closePath();
        g.fillStyle = color; g.globalAlpha = fade * .55; g.fill(); line(g, INK, 1.2, fade * .7);
        g.beginPath(); g.moveTo(r * .13, -r * .31);
        g.quadraticCurveTo(r * .37, 0, r * .13, r * .31); line(g, PAPER, 3, fade * .9); g.restore();
      }
      if (u > .32) for (let i = 0; i < (reduced ? 4 : 8); i++) {
        const aa = i * TAU / (reduced ? 4 : 8), travel = r * (.18 + (u - .32) * .75);
        shard(g, Math.cos(aa) * travel, Math.sin(aa) * travel, Math.min(8, r * .07), aa + t, c.accent, fade);
      }
      g.restore();
    } else if (key === 'owl') {
      // Open wings unfold into an aimed fan of long feather blades.
      const n = reduced ? 5 : 9;
      for (let i = 0; i < n; i++) {
        const aa = a + (i / (n - 1) - .5) * 2.5;
        const tip = radius * .92, root = radius * .19;
        g.save(); g.rotate(aa); g.translate(root, 0);
        petal(g, 0, 0, tip - root, 0, i % 2 ? color : c.accent, fade * .75);
        g.beginPath(); g.moveTo((tip - root) * .12, 0); g.lineTo((tip - root) * .92, 0);
        line(g, PAPER, 1.7, fade * .95);
        for (let j = 1; j < 5; j++) {
          const xx = (tip - root) * j / 6, h = (tip - root) * .1 * Math.sin(j / 6 * Math.PI);
          g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx + h, -h); g.moveTo(xx, 0); g.lineTo(xx + h, h);
          line(g, INK, .65, fade * .35);
        }
        g.restore();
      }
    } else if (key === 'ink') {
      for (let i = 0; i < (reduced ? 6 : 10); i++) {
        const aa = a + i * TAU / (reduced ? 6 : 10), rr = radius * (.88 + .1 * Math.sin(i * 4));
        g.save(); g.rotate(aa); g.beginPath(); g.moveTo(radius * .16, -r * .025);
        g.bezierCurveTo(rr * .5, -r * .13, rr * .7, -r * .035, rr, 0);
        g.lineTo(rr * .78, r * .07); g.lineTo(rr * .67, r * .025);
        g.lineTo(rr * .4, r * .11); g.closePath(); g.fillStyle = color; g.globalAlpha = fade * .6; g.fill();
        line(g, INK, 1.2, fade * .65); g.beginPath(); g.moveTo(rr * .32, -.5); g.lineTo(rr * .83, -r * .025);
        line(g, PAPER, 1.6, fade * .9); g.restore();
        shard(g, Math.cos(aa) * rr * 1.1, Math.sin(aa) * rr * 1.1, Math.min(6, r * .04), aa + t * 2, color, fade);
      }
    } else if (key === 'clock') {
      ring(g, radius * .9, 1, 0, color, 3, fade * .65);
      ring(g, radius * .78, 1, 0, PAPER, 1.3, fade * .8);
      for (let i = 0; i < 12; i++) {
        const aa = a + i * TAU / 12;
        g.beginPath(); g.moveTo(Math.cos(aa) * radius * .72, Math.sin(aa) * radius * .72);
        g.lineTo(Math.cos(aa) * radius * .86, Math.sin(aa) * radius * .86);
        line(g, i % 3 ? c.accent : PAPER, i % 3 ? 1.4 : 3, fade * .9);
      }
      for (let i = 0; i < 4; i++) {
        const aa = a + i * TAU / 4;
        g.save(); g.rotate(aa); g.beginPath(); g.moveTo(0, 0);
        g.lineTo(radius * .7, -r * .035); g.lineTo(radius, 0); g.lineTo(radius * .7, r * .035); g.closePath();
        g.fillStyle = color; g.globalAlpha = fade * .65; g.fill(); line(g, PAPER, 1, fade * .8); g.restore();
        gear(g, Math.cos(aa) * radius * .66, Math.sin(aa) * radius * .66,
          Math.min(17, r * .11), -t + i, c.accent, fade * .8);
      }
    } else if (key === 'serpent') {
      // A local coiling energy dragon with visibly connected scales and open jaws.
      const n = reduced ? 9 : 16;
      g.save(); g.rotate(a);
      for (let i = 0; i < n; i++) {
        const f = i / (n - 1), xx = (f * 1.7 - .85) * radius;
        const yy = Math.sin(f * TAU - t * 1.4) * radius * .31;
        const s = (5 + Math.sin(f * Math.PI) * 8) * Math.min(1.3, r / 110);
        shard(g, xx, yy, s, Math.cos(f * TAU - t * 1.4) * .5, i % 2 ? color : c.accent, fade * .9);
        if (i < n - 1) {
          const nf = (i + 1) / (n - 1); g.beginPath(); g.moveTo(xx, yy);
          g.lineTo((nf * 1.7 - .85) * radius, Math.sin(nf * TAU - t * 1.4) * radius * .31);
          line(g, PAPER, 1.8, fade * .8);
        }
      }
      const hx = radius * .85, hy = Math.sin(TAU - t * 1.4) * radius * .31, jaw = Math.min(25, r * .16);
      petal(g, hx - jaw * .2, hy - 3, jaw, -.35, color, fade); petal(g, hx - jaw * .2, hy + 3, jaw, .35, c.accent, fade);
      g.restore();
    } else {
      ring(g, radius * .8, .8, -.2, c.color, 1.5, fade * .5);
      for (let i = 0; i < (reduced ? 5 : 8); i++) {
        const aa = a + i * TAU / (reduced ? 5 : 8) + t * .55;
        const rr = radius * (.72 + i % 2 * .16);
        crescent(g, Math.cos(aa) * rr, Math.sin(aa) * rr,
          Math.min(22, r * .14) * (1 - u * .3), aa + Math.PI * .5, i % 2 ? color : c.accent, fade * .85);
        shard(g, Math.cos(aa - .12) * rr * .85, Math.sin(aa - .12) * rr * .85, 3, aa, PAPER, fade * .75);
      }
    }
    // A stable danger accent, not a rapid flash; actual telegraph geometry is rendered separately.
    ring(g, radius, .96, 0, DANGER, 1.2, fade * .32);
  }
  /**
   * attack(ctx,{kind,type,x,y,angle=0,r=90,age=0,duration=.85,reduced=false,color?,
   *   spots?:[{x,y,r,delay?}]})
   * With spots, draws only those supplied collision sites, respecting each delay.
   * Without spots, renders a single local field at x/y. Clipped to each site's radius*1.22+8.
   * Does not simulate damage or add warning timing. Call only for the real active effect lifetime.
   */
  function attack(g, p = {}) {
    const { x, y, angle = 0, r = 90, age = 0, duration = .85, reduced = false } = p;
    if (!g || !finite(age, duration, angle, r) || duration <= 0 || r <= 0 || age < 0) return;
    const key = theme(p.kind), color = p.color || themes[key].color;
    function at(xx, yy, rr, delay = 0) {
      if (!finite(xx, yy, rr, delay) || rr <= 0) return;
      const local = age - delay; if (local < 0 || local >= duration) return;
      g.save(); g.translate(xx, yy);
      g.beginPath(); g.arc(0, 0, rr * 1.22 + 8, 0, TAU); g.clip();
      field(g, key, rr, clamp(local / duration), angle, reduced, color); g.restore();
    }
    if (Array.isArray(p.spots) && p.spots.length) {
      for (let i = 0; i < Math.min(16, p.spots.length); i++) {
        const s = p.spots[i]; if (s) at(s.x, s.y, s.r, s.delay || 0);
      }
    } else if (finite(x, y)) at(x, y, r);
  }
  return Object.freeze({ pose, attack });
})();
