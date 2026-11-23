// Genesis 15's one world: the hill country under one sky. Every scene of the film is this shader with
// different switches: the land (a raymarched heightfield), the sky (day, dusk or night, with the
// stars that Abram is told to count), one sun (or the moon standing in for it), and the few things
// the chapter names: the tent, Abram as a robed silhouette, the beasts, the divided pieces, the birds,
// the oak, the smoking firepot and the lamp of fire, and lamps far off. Distant cities and Egypt are
// silhouettes on the horizon. Written for this film.
import { keys, ease } from '/engine.js';

export const WORLD_UNIFORMS = {
  uSunDir: [0.4, 0.3, -0.85], uSunCol: [6.0, 5.2, 4.3], uSunDisc: 1,
  uNight: 0, uDusk: 0, uStars: 0, uCount: 0, uMilky: 0.7, uStarGain: 1,
  uHaze: 0.0012, uFlat: [0, 0, 0], uHills: 1, uExp: 1,
  uSkyline: 0, uSkyAz: 0, uCityLamps: 0,
  uTent: [0, 0, 0], uTentOn: 0, uTentYaw: 0, uTentDoor: 1,
  uFig: [0, 0, 0], uFigOn: 0, uFigRim: [1.0, 0.66, 0.38], uFigYaw: 0, uFigSit: 0, uFigLook: 0,
  uPieces: [0, 0, 0], uPiecesOn: 0, uPiecesYaw: 0,
  uFire: [0, 0, 0], uFireOn: 0, uTorch: [0, 0, 0], uTorchOn: 0, uSmoke: 1,
  uAnim: [0, 0, 0], uAnimOn: 0, uAnimYaw: 0, uAnimWalk: 0, uAnimKinds: [0, 1, 2],
  uBirdC: [0, 6, 0], uBirds: 0, uBirdR: 6, uBirdDive: 0, uBirdSpread: 1,
  uOak: [0, 0, 0], uOakOn: 0,
  uCrack: 0, uSeeds: 0,
  uLampCol: [1.0, 0.6, 0.26],
  uL: new Array(24).fill(0), uLI: new Array(8).fill(0),
};

export const WORLD_GLSL = /* glsl */ `
uniform vec3 uFigRim;
uniform vec3 uSunDir, uSunCol, uFlat, uTent, uFig, uPieces, uFire, uTorch, uAnim, uAnimKinds, uBirdC, uOak, uLampCol;
uniform float uSunDisc, uNight, uDusk, uStars, uCount, uMilky, uStarGain, uHaze, uHills, uExp, uSkyline, uSkyAz, uCityLamps;
uniform float uTentOn, uTentYaw, uTentDoor, uFigOn, uFigYaw, uFigSit, uFigLook, uPiecesOn, uPiecesYaw;
uniform float uFireOn, uTorchOn, uSmoke, uAnimOn, uAnimYaw, uAnimWalk, uBirds, uBirdR, uBirdDive, uBirdSpread, uOakOn, uCrack, uSeeds;
uniform float uL[24];
uniform float uLI[8];

// rot() comes from the engine's common GLSL
float gTentY, gFigY, gPiecesY, gFireY, gAnimY, gOakY;   // ground under each thing, once per pixel
vec3 lampPos(int i) { return vec3(uL[i * 3], uL[i * 3 + 1], uL[i * 3 + 2]); }
float flick(float s) { return 0.86 + 0.1 * sin(uTime * 13.0 + s * 7.0) + 0.06 * sin(uTime * 29.0 + s * 3.0); }   // ark-shake-ok: a flame trembling
vec3 SUNDIR() { return normalize(uSunDir); }

// ---------------- the land ----------------
float terrainH(vec2 p) {
  float r = length(p - uFlat.xz);
  float h = (vnoise(p * 0.35) - 0.5) * 0.10 + (vnoise(p * 1.9) - 0.5) * 0.025;
  float sw = smoothstep(6.0, 50.0, r);
  if (sw > 0.0) h += (fbm(p * 0.011 + 7.3, 3) - 0.45) * 7.0 * sw;
  float far = smoothstep(25.0, 260.0, r) * uHills;
  if (far > 0.0) {
    float f = fbm(p * 0.0019 + 3.1, 5);
    h += (f - 0.42) * 190.0 * far + far * 12.0;
  }
  return h;
}
vec3 terrainN(vec3 p, float t) {
  float e = 0.012 + t * 0.0016;
  return normalize(vec3(terrainH(p.xz - vec2(e, 0)) - terrainH(p.xz + vec2(e, 0)), 2.0 * e,
                        terrainH(p.xz - vec2(0, e)) - terrainH(p.xz + vec2(0, e))));
}

// ---------------- things ----------------
float sdCyl(vec3 p, float r, float h) { vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)); }
float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }

// a black goat-hair tent, 7 m by 4 m, open at the front
float sdTent(vec3 p) {
  float sag = 0.16 * (0.5 - 0.5 * cos(p.x * 6.2832 / 3.5));
  float roof = 2.05 - sag - 0.46 * abs(p.z);
  float outer = max(sdBox(p - vec3(0, 1.05, 0), vec3(3.5, 1.05, 2.0)), (p.y - roof) * 0.85);
  float d = abs(outer) - 0.03;
  // the open front, and a lifted flap
  float door = sdBox(p - vec3(0.0, 0.8, 2.0), vec3(2.3 * uTentDoor + 0.001, 0.82, 0.25));
  d = max(d, -door);
  float poles = min(sdCapsule(p, vec3(-1.25, 0, 2.05), vec3(-1.25, 1.95, 2.05), 0.035), sdCapsule(p, vec3(1.25, 0, 2.05), vec3(1.25, 1.95, 2.05), 0.035));
  float ropes = min(sdCapsule(p, vec3(-3.4, 1.15, 2.0), vec3(-4.6, 0.0, 3.4), 0.012), sdCapsule(p, vec3(3.4, 1.15, 2.0), vec3(4.6, 0.0, 3.4), 0.012));
  return min(d, min(poles, ropes));
}

// Abram: a robed figure with head cloth and staff, seen as a silhouette. Feet at y = 0, facing +z.
float sdFigure(vec3 p) {
  float d;
  if (uFigSit > 0.5) {
    float body = sdRoundCone(p, vec3(0, 0.25, -0.05), vec3(0, 0.92, -0.02), 0.34, 0.17);
    float lap = sdEllipsoid(p - vec3(0, 0.22, 0.24), vec3(0.3, 0.19, 0.36));
    float sh = sdEllipsoid(p - vec3(0, 0.92, -0.02), vec3(0.23, 0.09, 0.13));
    vec3 hp = p - vec3(0, 1.1, 0.02); hp.yz = rot(-0.25 * uFigLook) * hp.yz;
    float hood = sdRoundCone(hp, vec3(0, -0.06, -0.05), vec3(0, 0.08, 0.0), 0.15, 0.115);
    d = smin(smin(body, lap, 0.12), sh, 0.06); d = smin(d, hood, 0.04);
    d = min(d, sdCapsule(p, vec3(0.34, 0.0, 0.42), vec3(0.36, 1.75, 0.3), 0.022));
    d = smin(d, sdCapsule(p, vec3(0.2, 0.86, 0.02), vec3(0.34, 0.75, 0.33), 0.055), 0.04);
  } else {
    float robe = sdRoundCone(p, vec3(0, 0.12, 0), vec3(0, 1.36, 0), 0.29, 0.165);
    float sh = sdEllipsoid(p - vec3(0, 1.37, 0), vec3(0.235, 0.1, 0.14));
    vec3 hp = p - vec3(0, 1.56, 0.02); hp.yz = rot(-0.45 * uFigLook) * hp.yz;
    float hood = sdRoundCone(hp, vec3(0, -0.12, -0.05), vec3(0, 0.07, 0.0), 0.155, 0.115);
    d = smin(robe, sh, 0.07); d = smin(d, hood, 0.04);
    d = min(d, sdCapsule(p, vec3(0.33, 0.0, 0.14), vec3(0.35, 1.92, 0.11), 0.022));
    d = smin(d, sdCapsule(p, vec3(0.2, 1.32, 0.02), vec3(0.33, 1.08, 0.13), 0.058), 0.04);
  }
  return d;
}

// the beasts as sculpted silhouettes: 0 heifer, 1 she-goat, 2 ram. Facing +x, feet at y = 0.
float sdBeast(vec3 p, float kind, float ph) {
  float s = kind < 0.5 ? 1.0 : kind < 1.5 ? 0.6 : 0.66;
  p /= s;
  float hd = kind < 0.5 ? 0.0 : 0.08;
  float body = sdEllipsoid(p - vec3(0, 0.95, 0), vec3(0.8, 0.38, 0.32));
  body = smin(body, sdEllipsoid(p - vec3(0.42, 0.98, 0), vec3(0.36, 0.42, 0.3)), 0.2);   // deep chest
  float neck = sdRoundCone(p, vec3(0.62, 1.05, 0), vec3(0.92, 1.12 + hd, 0), 0.2, 0.12);
  float head = sdRoundCone(p, vec3(0.95, 1.16 + hd, 0), vec3(1.2, 0.92 + hd, 0), 0.13, 0.08);
  float d = smin(smin(body, neck, 0.12), head, 0.06);
  for (int i = 0; i < 4; i++) {
    float fx = i < 2 ? 0.5 : -0.52, fz = (i == 0 || i == 2) ? 0.14 : -0.14;
    float sw = sin(ph + (i == 1 || i == 2 ? 3.14 : 0.0)) * 0.13 * uAnimWalk;
    d = smin(d, sdRoundCone(p, vec3(fx, 0.8, fz), vec3(fx + sw, 0.04, fz), 0.09, 0.045), 0.06);
  }
  d = min(d, sdCapsule(p, vec3(-0.78, 1.08, 0), vec3(-0.86, 0.62, 0), 0.028));
  vec3 hq = p - vec3(0.98, 1.26 + hd, 0); hq.z = abs(hq.z);
  if (kind < 0.5) d = min(d, sdCapsule(hq, vec3(0, 0, 0.07), vec3(0.02, 0.09, 0.15), 0.022));
  else if (kind < 1.5) d = min(d, sdCapsule(hq, vec3(-0.02, 0.0, 0.05), vec3(-0.24, 0.16, 0.08), 0.024));
  else { vec3 rq = hq - vec3(-0.08, -0.06, 0.13); rq = rq.yzx; d = smin(d, sdTorus(rq, vec2(0.1, 0.045)), 0.03); }
  return d * s;
}

// a bird: body and two wings that beat (flap -1..1); facing +z
float sdBird(vec3 p, float flap, float sc) {
  p /= sc;
  float body = sdEllipsoid(p, vec3(0.09, 0.075, 0.3));
  vec3 q = p; q.x = abs(q.x);
  q.xy = rot(-flap * 0.7) * q.xy;
  float span = q.x / 0.85;
  float wing = sdBox(q - vec3(0.45, 0.0, -0.02 - 0.05 * span), vec3(0.42, 0.01, 0.15 - 0.07 * span));
  float tail = sdBox(p - vec3(0, 0, -0.34), vec3(0.07 + 0.08 * max(0.0, -p.z - 0.3), 0.008, 0.08));
  return smin(min(body, tail), wing, 0.04) * sc;
}

// the divided pieces: three beasts' halves laid opposite each other in two rows along z, with the
// undivided birds at the end, on flat stones. Shown as dark hide-covered forms (no wound shown).
float sdPieces(vec3 p) {
  float d = 1e9;
  for (int i = 0; i < 3; i++) {
    float z = -2.6 + float(i) * 2.25;
    vec3 s = i == 0 ? vec3(0.44, 0.33, 0.86) : i == 1 ? vec3(0.31, 0.24, 0.58) : vec3(0.34, 0.25, 0.62);
    for (int k = 0; k < 2; k++) {
      float side = k == 0 ? 1.0 : -1.0;
      vec3 q = p - vec3(side * (1.12 + s.x * 0.4), s.y * 0.45, z);
      float h = sdEllipsoid(q, s * vec3(1.0, 0.72, 1.15));
      h = max(h, -(q.x * side) - s.x * 0.45);   // the flat side faces the path
      d = min(d, h);
      vec3 lq = q; lq.z = abs(lq.z) - s.z * 0.55;
      d = smin(d, sdCapsule(lq, vec3(-side * s.x * 0.1, -s.y * 0.15, 0.0), vec3(side * s.x * 0.55, -s.y * 0.35, 0.12 * s.z), 0.05 + 0.04 * s.x), 0.05);   // folded legs
    }
  }
  d = min(d, sdEllipsoid(p - vec3(1.05, 0.09, 4.05), vec3(0.15, 0.1, 0.23)));
  d = min(d, sdEllipsoid(p - vec3(-1.05, 0.09, 4.05), vec3(0.14, 0.09, 0.21)));
  return d;
}
float sdStones(vec3 p) {
  vec3 q = p; q.x = abs(q.x) - 1.35;
  q.z = q.z - clamp(floor(q.z / 1.1 + 0.5), -3.0, 4.0) * 1.1;
  return sdBox(q - vec3(0, 0.0, 0), vec3(0.36, 0.04, 0.38)) - 0.06 + (vnoise(p.xz * 5.0) - 0.5) * 0.06;
}

// the oak: trunk, limbs and a broad canopy
float sdOakTrunk(vec3 p) {
  float d = sdRoundCone(p, vec3(0, 0, 0), vec3(0.15, 3.0, 0), 0.5, 0.28);
  d = smin(d, sdCapsule(p, vec3(0.1, 2.6, 0), vec3(2.2, 4.4, 0.6), 0.16), 0.3);
  d = smin(d, sdCapsule(p, vec3(0.1, 2.7, 0), vec3(-1.9, 4.6, -0.5), 0.15), 0.3);
  d = smin(d, sdCapsule(p, vec3(0.1, 2.9, 0), vec3(0.3, 5.0, 1.6), 0.13), 0.3);
  return d;
}
float sdOakLeaves(vec3 p) {
  float d = sdEllipsoid(p - vec3(0, 5.2, 0.2), vec3(4.6, 1.9, 4.0));
  d = smin(d, sdEllipsoid(p - vec3(2.4, 4.6, 0.6), vec3(2.4, 1.3, 2.2)), 0.8);
  d = smin(d, sdEllipsoid(p - vec3(-2.3, 4.8, -0.6), vec3(2.3, 1.4, 2.3)), 0.8);
  if (d < 1.2) d += (fbm(p * 1.6, 3) - 0.5) * 0.9;
  return d;
}

// the smoking firepot (a clay furnace) and the lamp of fire
float sdPot(vec3 p) {
  float b = sdEllipsoid(p - vec3(0, 0.32, 0), vec3(0.3, 0.32, 0.3));
  b = smin(b, sdCyl(p - vec3(0, 0.62, 0), 0.19, 0.08), 0.06);
  b = max(b, -sdCyl(p - vec3(0, 0.7, 0), 0.15, 0.1));
  return b;
}

vec2 opU(vec2 a, vec2 b) { return a.x < b.x ? a : b; }
// materials: 2 tent, 3 figure, 4 pieces, 5 pot, 6 beast, 7 bird, 8 trunk, 9 leaves, 10 stone
vec2 things(vec3 p) {
  vec2 r = vec2(1e9, 0);
  if (uTentOn > 0.5) {
    vec3 q = p - uTent - vec3(0, gTentY, 0); q.xz = rot(uTentYaw) * q.xz;
    float b = length(q - vec3(0, 1, 0)) - 6.0;
    r = opU(r, b > 0.4 ? vec2(b, -1) : vec2(sdTent(q), 2));
  }
  if (uFigOn > 0.5) {
    vec3 q = p - uFig - vec3(0, gFigY, 0); q.xz = rot(uFigYaw) * q.xz;
    float b = length(q - vec3(0, 0.9, 0)) - 1.4;
    r = opU(r, b > 0.3 ? vec2(b, -1) : vec2(sdFigure(q), 3));
  }
  if (uPiecesOn > 0.5) {
    vec3 q = p - uPieces - vec3(0, gPiecesY, 0); q.xz = rot(uPiecesYaw) * q.xz;
    float b = sdBox(q - vec3(0, 0.4, 0.7), vec3(2.6, 0.7, 4.2));
    if (b > 0.3) r = opU(r, vec2(b, -1));
    else r = opU(r, vec2(sdPieces(q), 4));
  }
  if (uFireOn > 0.5) {
    vec3 q = p - uFire - vec3(0, gFireY, 0);
    float b = length(q - vec3(0, 0.4, 0)) - 0.7;
    r = opU(r, b > 0.2 ? vec2(b, -1) : vec2(sdPot(q), 5));
  }
  if (uAnimOn > 0.5) {
    vec3 q = p - uAnim - vec3(0, gAnimY, 0); q.xz = rot(uAnimYaw) * q.xz;
    for (int i = 0; i < 3; i++) {
      float kind = uAnimKinds[i];
      if (kind < -0.5) continue;
      vec3 qi = q - vec3(-float(i) * 2.6, 0, 0);
      float b = length(qi - vec3(0.1, 0.8, 0)) - 1.5;
      r = opU(r, b > 0.3 ? vec2(b, -1) : vec2(sdBeast(qi, kind, uTime * 4.2 * uAnimWalk + float(i) * 2.1), 6));
    }
  }
  if (uBirds > 0.5) {
    for (int i = 0; i < 8; i++) {
      if (float(i) >= uBirds) break;
      float fi = float(i);
      float ang = uTime * (0.32 + 0.05 * fi) + fi * 2.399;
      float rr = uBirdR * (0.55 + 0.45 * fract(fi * 0.618)) * uBirdSpread;
      float hy = uBirdC.y * (0.7 + 0.5 * fract(fi * 0.37)) * (1.0 - uBirdDive) + uBirdDive * (0.9 + 0.3 * fract(fi * 0.71));
      vec3 c = uBirdC + vec3(cos(ang) * rr, 0, sin(ang) * rr); c.y = hy;
      vec3 q = p - c;
      float b = length(q) - 1.2;
      if (b > 0.3) { r = opU(r, vec2(b, -1)); continue; }
      vec3 fwd = normalize(vec3(-sin(ang), -0.1 * uBirdDive, cos(ang)));
      float yaw = atan(fwd.x, fwd.z);
      q.xz = rot(yaw) * q.xz;
      q.xy = rot(0.35) * q.xy;   // banking into the circle
      float flap = sin(uTime * 7.5 + fi * 1.3) * (0.35 + 0.65 * uBirdDive);   // ark-shake-ok: wings beating
      r = opU(r, vec2(sdBird(q, flap, 0.95), 7));
    }
  }
  if (uOakOn > 0.5) {
    vec3 q = p - uOak - vec3(0, gOakY, 0);
    float b = length(q - vec3(0, 4, 0)) - 7.0;
    if (b > 0.5) r = opU(r, vec2(b, -1));
    else { r = opU(r, vec2(sdOakTrunk(q), 8)); r = opU(r, vec2(sdOakLeaves(q) * 0.7, 9)); }
  }
  return r;
}

// ---------------- the sky ----------------
float skylineElev(vec3 rd) {
  float az = atan(rd.x, rd.z) - uSkyAz;
  az = mod(az + PI, 2.0 * PI) - PI;
  float e = -1.0;
  if (uSkyline > 0.5 && uSkyline < 1.5) {          // Ur of the Chaldeans: a ziggurat and a low wall
    float a = abs(az);
    e = max(e, a < 0.25 ? 0.006 : -1.0);
    e = max(e, a < 0.09 ? 0.02 : -1.0); e = max(e, a < 0.065 ? 0.033 : -1.0); e = max(e, a < 0.04 ? 0.045 : -1.0);
    e = max(e, a < 0.016 ? 0.054 : -1.0);
  } else if (uSkyline > 1.5 && uSkyline < 2.5) {   // Egypt: pyramids beyond the river
    e = max(e, 0.06 - abs(az) * 0.95); e = max(e, 0.042 - abs(az - 0.13) * 0.95); e = max(e, 0.024 - abs(az + 0.1) * 0.95);
  } else if (uSkyline > 2.5) {                     // a walled hill city
    float hill = 0.06 * exp(-az * az / 0.02);
    float wall = abs(az) < 0.12 ? 0.008 + 0.004 * step(0.5, fract(az * 110.0)) + 0.008 * step(0.9, fract(az * 26.0 + 0.3)) : 0.0;
    e = hill + wall * smoothstep(0.0, 0.01, hill);
  }
  return e;
}
vec3 starLayer(vec3 d, float scale, float dens, float seed, float px) {
  vec3 q = d * scale; vec3 id = floor(q); vec3 f = fract(q) - 0.5;
  vec3 h = hash33(id + seed);
  if (h.x > dens) return vec3(0);
  vec3 off = (hash33(id + seed + 7.1) - 0.5) * 0.6;
  vec3 v = f - off; v -= d * dot(v, d);   // distance across the sky, not along the ray
  float pr = max(px * scale * 0.9, 0.012);
  float g = exp(-dot(v, v) / (pr * pr));
  float b = pow(hash11(h.y * 91.7 + h.z), 6.0) * 3.0 + 0.05;
  vec3 col = mix(vec3(0.72, 0.8, 1.0), vec3(1.0, 0.88, 0.74), h.z);
  float counted = step(hash11(h.x * 57.3 + h.z * 3.1), uCount);
  col = mix(col, vec3(1.0, 0.58, 0.16) * 3.2, counted);
  g = mix(g, exp(-dot(v, v) / (pr * pr * 3.0)), counted);
  b = mix(b, max(b, 0.35) * 1.6, counted);
  float tw = 0.85 + 0.15 * sin(uTime * (2.0 + h.z * 3.0) + h.y * 40.0);   // ark-shake-ok: stars twinkling
  return col * b * g * tw;
}
vec3 stars(vec3 d) {
  float px = 2.0 * tan(radians(uFov) * 0.5) / uRes.y;
  vec3 nMW = normalize(vec3(0.35, 0.42, 0.84));
  float band = exp(-pow(dot(d, nMW) / 0.2, 2.0)) * uMilky;
  vec3 c = vec3(0);
  c += starLayer(d, 60.0, 0.07, 1.0, px) * 1.6;
  c += starLayer(d, 150.0, 0.035 + 0.12 * band, 2.0, px) * 0.8;
  c += starLayer(d, 320.0, 0.015 + 0.16 * band, 3.0, px) * 0.4;
  float dust = fbm(d * 9.0, 5);
  c += band * vec3(0.07, 0.075, 0.1) * (0.35 + smoothstep(0.3, 0.75, dust)) * (0.6 + 0.8 * fbm(d * 30.0, 3));
  c *= mix(1.0, 0.35, band * smoothstep(0.55, 0.7, fbm(d * 14.0 + 3.0, 4)));   // dark dust lanes
  return c * uStarGain;
}
vec3 skyBase(vec3 rd, float disc) {
  float y = rd.y;
  vec3 z = mix(mix(vec3(0.13, 0.27, 0.56), vec3(0.08, 0.07, 0.2), uDusk), vec3(0.003, 0.0045, 0.012), uNight);
  vec3 h = mix(mix(vec3(0.62, 0.68, 0.74), vec3(1.1, 0.44, 0.17), uDusk), vec3(0.03, 0.036, 0.062), uNight);
  vec3 c = mix(h, z, pow(sat(y + 0.02), 0.45));
  vec3 sd = SUNDIR();
  float s = max(dot(rd, sd), 0.0);
  c += uSunCol * (0.012 * pow(s, 6.0) + 0.05 * pow(s, 60.0)) * (1.0 - 0.85 * uNight) * (0.5 + uDusk);
  c += uSunCol * smoothstep(0.99985, 0.99993, s) * 6.0 * uSunDisc * disc * (1.0 - uNight);
  if (y < 0.0) c = mix(c, h * 0.6, sat(-y * 6.0));
  return c;
}
vec3 sky(vec3 rd) {
  vec3 c = skyBase(rd, 1.0);
  if (uStars > 0.0) c += stars(rd) * uStars * smoothstep(-0.01, 0.12, rd.y);
  if (uSkyline > 0.5) {
    float e = skylineElev(rd);
    float px = 1.5 * tan(radians(uFov) * 0.5) / uRes.y;
    float m = smoothstep(e + px, e - px, rd.y);
    if (m > 0.0) {
      vec3 h = skyBase(vec3(rd.x, 0.0, rd.z), 0.0);
      vec3 sil = h * 0.42;
      if (uCityLamps > 0.0) {
        float az = atan(rd.x, rd.z) * 900.0;
        float lamp = step(0.86, hash11(floor(az))) * smoothstep(0.35, 0.0, abs(fract(az) - 0.5)) * smoothstep(e - 0.004, e - 0.001, rd.y) * smoothstep(e * 0.3, e * 0.6, rd.y);
        sil += uLampCol * lamp * uCityLamps * 1.5;
      }
      c = mix(c, sil, m);
    }
  }
  return c;
}

// ---------------- light ----------------
float shadow(vec3 ro, vec3 rd) {
  // soft shadow with a jittered start, so the penumbra averages smooth over the sub-frames
  float res = 1.0, ph = 1e10;
  float t = 0.03 + 0.06 * hash12(gl_FragCoord.xy + fract(uTime * 13.7) * 91.0);
  for (int i = 0; i < 44; i++) {
    vec3 p = ro + rd * t;
    vec2 o = things(p);
    float hg = (p.y - terrainH(p.xz)) * 0.6;
    float h = o.y < 0.0 ? hg : min(o.x, hg);
    float stepH = min(o.x, hg);
    float y = h * h / (2.0 * ph); float d = sqrt(max(h * h - y * y, 0.0));
    res = min(res, 12.0 * d / max(t - y, 1e-3));
    ph = h;
    if (res < 0.002 || t > 120.0) break;
    t += clamp(stepH, 0.03, 4.0 + t * 0.12);
  }
  return sat(res);
}
float ao(vec3 p, vec3 n) {
  float o = 0.0, w = 1.0;
  for (int i = 1; i <= 3; i++) {
    float h = 0.08 * float(i * i);
    vec3 q = p + n * h;
    float d = min(things(q).x, q.y - terrainH(q.xz));
    o += w * (h - d); w *= 0.55;
  }
  return sat(1.0 - 1.6 * o);
}
vec3 normalThing(vec3 p) {
  const vec2 k = vec2(1, -1); const float h = 0.002;
  return normalize(k.xyy * things(p + k.xyy * h).x + k.yyx * things(p + k.yyx * h).x + k.yxy * things(p + k.yxy * h).x + k.xxx * things(p + k.xxx * h).x);
}

vec3 albedo(float m, vec3 p, vec3 n) {
  if (m < 1.5) {
    float f = fbm(p.xz * 0.07, 4);
    vec3 sand = vec3(0.46, 0.35, 0.23), stone = vec3(0.52, 0.45, 0.36), scrub = vec3(0.15, 0.13, 0.075);
    vec3 a = mix(sand, stone, smoothstep(0.35, 0.8, f) * 0.7);
    a = mix(a, scrub, smoothstep(0.74, 0.86, vnoise(p.xz * 2.3)) * 0.45 * (1.0 - uCrack));
    a = mix(a, stone * 0.82, smoothstep(0.25, 0.6, 1.0 - n.y));
    a *= 0.85 + 0.3 * vnoise(p.xz * 6.0);
    a = mix(a, vec3(0.2, 0.18, 0.155), 0.75 * uNight);
    if (uCrack > 0.0) {
      float e = voronoiEdge(p.xz * 2.2).x;
      a *= mix(1.0, 0.3, uCrack * (1.0 - smoothstep(0.0, 0.035, e)));
    }
    return a;
  }
  if (m < 2.5) return vec3(0.05, 0.042, 0.036) * (0.9 + 0.15 * step(0.5, fract(p.y * 2.2)));
  if (m < 3.5) {   // Abram's robe: undyed wool, with folds that catch the light
    vec2 d = p.xz - uFig.xz; float fold = 0.5 + 0.5 * sin(atan(d.y, d.x) * 11.0 + p.y * 2.0);
    return vec3(0.2, 0.155, 0.115) * (0.86 + 0.2 * fold);
  }
  if (m < 4.5) return mix(vec3(0.08, 0.06, 0.045), vec3(0.2, 0.15, 0.1), fbm(p * 7.0, 4));
  if (m < 5.5) return vec3(0.45, 0.24, 0.13) * (0.8 + 0.3 * vnoise(p * 30.0));
  if (m < 6.5) return vec3(0.12, 0.09, 0.07);
  if (m < 7.5) return vec3(0.06, 0.05, 0.045);
  if (m < 8.5) return vec3(0.16, 0.12, 0.09) * (0.7 + 0.5 * vnoise(p * vec3(3, 12, 3)));
  if (m < 9.5) return vec3(0.09, 0.13, 0.05) * (0.7 + 0.6 * vnoise(p * 4.0));
  return vec3(0.36, 0.33, 0.29) * (0.7 + 0.4 * vnoise(p * 6.0));
}

// the fire: a volume of flame (over the pot and as the lamp) and its smoke, marched along the view ray
vec4 fireVolume(vec3 ro, vec3 rd, float tmax) {
  vec3 em = vec3(0); float tr = 1.0;
  for (int k = 0; k < 2; k++) {
    float on = k == 0 ? uFireOn : uTorchOn;
    if (on < 0.5) continue;
    vec3 c = k == 0 ? uFire + vec3(0, 0.72, 0) : uTorch;
    float rad = k == 0 ? 0.55 : 0.42;
    float hgt = k == 0 ? 1.3 : 1.0;
    // ray against the flame's bounding sphere
    vec3 oc = ro - (c + vec3(0, hgt * 0.4, 0));
    float bb = dot(oc, rd), cc = dot(oc, oc) - (hgt + 0.3) * (hgt + 0.3);
    float hdisc = bb * bb - cc; if (hdisc < 0.0) continue;
    float t0 = max(-bb - sqrt(hdisc), 0.0), t1 = min(-bb + sqrt(hdisc), tmax);
    if (t1 <= t0) continue;
    float dt = (t1 - t0) / 28.0;
    float jit = hash12(gl_FragCoord.xy + fract(uTime * 3.1) * 41.0);
    for (int i = 0; i < 28; i++) {
      vec3 p = ro + rd * (t0 + (float(i) + jit) * dt) - c;
      float hy = p.y / hgt;
      if (hy < -0.15 || hy > 1.1) continue;
      float w = rad * (1.0 - hy) * (0.55 + 0.45 * smoothstep(-0.15, 0.25, hy));
      vec3 np = p * vec3(5.0, 3.0, 5.0) - vec3(0, uTime * 4.5, 0);
      float n = fbm(np, 4);
      float r = length(p.xz + vec2(sin(uTime * 3.0 + hy * 4.0), cos(uTime * 2.3 + hy * 3.0)) * 0.05 * hy);   // ark-shake-ok: a flame licking
      float tongues = fbm(vec3(p.xz * 7.0, hy * 2.0 - uTime * 3.0), 3);
      float dens = sat((w - r) / max(w, 1e-3) * 1.8 + (n - 0.5) * 2.6 + (tongues - 0.5) * 1.6 - hy * 0.5);
      if (dens <= 0.0) continue;
      float temp = sat(1.15 - hy * 1.1 + (n - 0.5));
      vec3 fc = mix(vec3(1.0, 0.18, 0.02), vec3(1.0, 0.72, 0.32), temp) * (3.0 + 9.0 * temp * temp);
      em += tr * fc * dens * dt * 9.0;
      tr *= exp(-dens * dt * 5.0);
    }
  }
  // smoke from the furnace
  if (uFireOn > 0.5 && uSmoke > 0.0) {
    vec3 c = uFire + vec3(0, 1.2, 0);
    vec3 oc = ro - (c + vec3(0, 2.2, 0));
    float bb = dot(oc, rd), cc = dot(oc, oc) - 3.4 * 3.4;
    float hdisc = bb * bb - cc;
    if (hdisc > 0.0) {
      float t0 = max(-bb - sqrt(hdisc), 0.0), t1 = min(-bb + sqrt(hdisc), tmax);
      float dt = (t1 - t0) / 24.0;
      float jit = hash12(gl_FragCoord.yx + fract(uTime * 5.7) * 13.0);
      for (int i = 0; i < 24; i++) {
        if (t1 <= t0) break;
        vec3 p = ro + rd * (t0 + (float(i) + jit) * dt) - c;
        if (p.y < -0.3 || p.y > 4.6) continue;
        float w = 0.25 + p.y * 0.32;
        vec2 drift = vec2(p.y * p.y * 0.05, 0.0);
        float r = length(p.xz - drift);
        float n = fbm(p * 1.4 - vec3(0, uTime * 0.9, 0), 4);
        float dens = sat((w - r) / w * 1.6 + (n - 0.5) * 2.0) * smoothstep(4.6, 2.5, p.y) * uSmoke * 1.6;
        if (dens <= 0.0) continue;
        vec3 sc = vec3(0.05, 0.045, 0.045) + uLampCol * 0.35 * exp(-max(p.y, 0.0) * 1.3) * float(uFireOn > 0.5);
        float a = 1.0 - exp(-dens * dt * 2.2);
        em += tr * sc * a; tr *= 1.0 - a;
      }
    }
  }
  return vec4(em, tr);
}

vec3 lampLight(vec3 p, vec3 n) {
  vec3 L = vec3(0);
  for (int i = 0; i < 8; i++) {
    if (uLI[i] <= 0.0) continue;
    vec3 d = lampPos(i) - p; float r2 = dot(d, d);
    L += uLampCol * uLI[i] * flick(float(i)) * max(dot(n, d * inversesqrt(r2)), 0.0) / (r2 + 0.15);
  }
  // the fire lights its surroundings
  if (uFireOn > 0.5) { vec3 d = uFire + vec3(0, 1.0, 0) - p; float r2 = dot(d, d); L += vec3(1.0, 0.5, 0.18) * 7.0 * flick(9.0) * max(dot(n, normalize(d)), 0.0) / (r2 + 0.3); }
  if (uTorchOn > 0.5) { vec3 d = uTorch + vec3(0, 0.4, 0) - p; float r2 = dot(d, d); L += vec3(1.0, 0.55, 0.2) * 5.0 * flick(11.0) * max(dot(n, normalize(d)), 0.0) / (r2 + 0.3); }
  return L;
}
vec3 lampGlow(vec3 ro, vec3 rd, float tmax) {
  vec3 g = vec3(0);
  for (int i = 0; i < 8; i++) {
    if (uLI[i] <= 0.0) continue;
    vec3 lp = lampPos(i) - ro; float s = dot(lp, rd);
    if (s < 0.0 || s > tmax + 0.05) continue;
    float a2 = (dot(lp, lp) - s * s) / (s * s);
    g += uLampCol * uLI[i] * flick(float(i)) * (exp(-a2 * 2.0e6) * 6.0 + exp(-a2 * 2.0e4) * 0.12);
  }
  return g;
}

vec3 world(vec2 fc) {
  vec3 ro; vec3 rd = camRay(fc, ro);
  vec3 sd = SUNDIR();
  gTentY = uTentOn > 0.5 ? terrainH(uTent.xz) : 0.0; gFigY = uFigOn > 0.5 ? terrainH(uFig.xz) : 0.0;
  gPiecesY = uPiecesOn > 0.5 ? terrainH(uPieces.xz) : 0.0; gFireY = uFireOn > 0.5 ? terrainH(uFire.xz) : 0.0;
  gAnimY = uAnimOn > 0.5 ? terrainH(uAnim.xz) : 0.0; gOakY = uOakOn > 0.5 ? terrainH(uOak.xz) : 0.0;
  // march land and things together
  float t = 0.02, m = 0.0, hit = -1.0, lastStep = 0.0;
  for (int i = 0; i < 300; i++) {
    vec3 p = ro + rd * t;
    float hT = (p.y - terrainH(p.xz)) * 0.5;
    vec2 o = things(p);
    float eps = 0.0004 * t + 0.0008;
    if (o.x < eps && o.x <= hT) { hit = t; m = o.y; break; }
    if (hT < eps) {   // land: bisect back to the surface so grazing rays don't band
      float a = t - max(lastStep, 0.0), b = t;
      for (int k = 0; k < 8; k++) { float mm = 0.5 * (a + b); vec3 q = ro + rd * mm; if (q.y - terrainH(q.xz) > 0.0) a = mm; else b = mm; }
      hit = a; m = 1.0; break;
    }
    lastStep = max(min(hT, o.x), 0.0025 * t + 0.002);
    t += lastStep;
    if (t > 4200.0 || (p.y > 450.0 && rd.y > 0.0)) break;
  }
  vec3 col;
  float tmax = hit > 0.0 ? hit : 1e5;
  if (hit < 0.0 && rd.y < 0.0) {
    vec3 hd = normalize(vec3(rd.x, 0.0, rd.z));
    col = mix(mix(vec3(0.62, 0.68, 0.74), vec3(1.1, 0.44, 0.17), uDusk), vec3(0.012, 0.016, 0.032), uNight) * 0.55;
  } else if (hit < 0.0) {
    col = sky(rd);
  } else {
    vec3 p = ro + rd * hit;
    if (m < 1.5) p.y = terrainH(p.xz);
    vec3 n = m < 1.5 ? terrainN(p, hit) : normalThing(p);
    vec3 a = albedo(m, p, n);
    float sh = shadow(p + n * 0.03, sd);
    float occ = ao(p, n);
    float dif = max(dot(n, sd), 0.0);
    vec3 skyAmb = mix(mix(vec3(0.32, 0.42, 0.6), vec3(0.35, 0.22, 0.25), uDusk), vec3(0.012, 0.016, 0.03), uNight);
    vec3 bounce = mix(vec3(0.3, 0.22, 0.14), vec3(0.2, 0.1, 0.06), uDusk) * (1.0 - uNight);
    vec3 L = uSunCol * dif * sh + skyAmb * (0.55 + 0.45 * n.y) * occ * 1.4 + bounce * (0.5 - 0.5 * n.y) * occ;
    L += lampLight(p, n) * (0.4 + 0.6 * occ);
    col = a * L;
    if (m > 2.5 && m < 3.5) {   // Abram always reads: a rim of light round his shape and a soft fill
      float rim = pow(1.0 - max(dot(n, -rd), 0.0), 5.0);
      col += uFigRim * rim * (0.12 + 0.3 * uNight) + a * uFigRim * 0.035 * uNight;
    }
    if (m > 4.5 && m < 5.5) col += vec3(1.0, 0.32, 0.07) * (0.25 + 0.8 * smoothstep(0.55, 0.8, vnoise(p * 22.0))) * flick(4.0);
    // a soft sheen on the hide and cloth at grazing light
    if (m > 1.5 && m < 4.5) col += a * uSunCol * 0.25 * pow(1.0 - max(dot(n, -rd), 0.0), 4.0) * sh;
    // haze
    float fogA = 1.0 - exp(-hit * uHaze);
    vec3 hz = skyBase(normalize(vec3(rd.x, max(rd.y, 0.0) * 0.3 + 0.01, rd.z)), 0.0);
    hz += uSunCol * 0.04 * pow(max(dot(rd, sd), 0.0), 8.0) * (1.0 - uNight);
    col = mix(col, hz * 0.82, fogA);
  }
  vec4 fv = fireVolume(ro, rd, tmax);
  col = col * fv.w + fv.rgb;
  col += lampGlow(ro, rd, tmax);
  return col * uExp;
}
`;

// ---- camera helpers ----
export const lerp = (a, b, p) => a.map((v, i) => v + (b[i] - v) * p);
// one eased move from A to B over the scene: mostly eased, never quite stopped at the cuts
export function glide(P, t) {
  const x = Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return 0.25 * x + 0.75 * ease.inOut3(x);
}
export function cam(P, t, a, b, extra = {}) {
  const p = glide(P, t);
  return { pos: lerp(a.pos, b.pos, p), target: lerp(a.target, b.target, p), fov: (a.fov ?? 40) + ((b.fov ?? a.fov ?? 40) - (a.fov ?? 40)) * p, roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * p, ...extra };
}
export function setLamps(u, lamps) {
  const L = u.uL.value, I = u.uLI.value;
  for (let i = 0; i < 8; i++) {
    const l = lamps[i];
    if (l) { L[i * 3] = l[0]; L[i * 3 + 1] = l[1]; L[i * 3 + 2] = l[2]; I[i] = l[3]; } else I[i] = 0;
  }
}
export { keys, ease };
