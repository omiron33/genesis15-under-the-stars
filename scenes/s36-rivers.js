// 36 · Sweeping west to east across the land: Egypt's pyramids at one edge of the world.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 9, 0], "target": [-60, 2, -30], "fov": 46};
const B = {"pos": [0, 10, 0], "target": [-25, 2, -60], "fov": 46};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's36-rivers', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.4, uSunDir: [0.8, 0.22, -0.5], uSunCol: [5.0, 3.8, 2.4], uHaze: 0.0016, uSkyline: 2, uSkyAz: -2.0344, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
