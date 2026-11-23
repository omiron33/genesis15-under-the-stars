// 28 · Years pass over Egypt: the sun runs across the sky again and again above the pyramids.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 1.6, 0], "target": [-60, 3, 0], "fov": 40};
const B = {"pos": [0, 1.8, 0], "target": [-60, 4, -4], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's28-four-hundred', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.4, uSunDir: [0.3, 0.75, -0.45], uSunCol: [4.6, 3.6, 2.4], uHaze: 0.0025, uSkyline: 2, uSkyAz: -1.5708, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      const a = (t - P.from) * 2.2; const s = Math.sin(a), c = Math.cos(a); u.uSunDir.value.set(-0.3, 0.12 + 0.55 * Math.abs(s), -0.8 * c); u.uNight.value = 0.0; u.uDusk.value = 0.35 + 0.5 * (1 - Math.abs(s));
    },
    post: (t) => grade(t, { exposure: 0.62 }),
  };
};
