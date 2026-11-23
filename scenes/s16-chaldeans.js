// 16 · Before dawn: far in the east the ziggurat of Ur stands on the horizon; Abram faces it.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-7, 1.0, 3.0], "target": [30, 1.6, -6], "fov": 34};
const B = {"pos": [-6.2, 1.1, 2.2], "target": [30, 1.9, -8], "fov": 34};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's16-chaldeans', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0.35, uDusk: 0.8, uStars: 0.35, uSunDir: [0.95, 0.03, -0.3], uSunCol: [2.2, 1.2, 0.6], uHaze: 0.002, uSkyline: 1, uSkyAz: 1.8094, uFigOn: 1, uFig: [0, 0, 0], uFigYaw: -1.9, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.5 }),
  };
};
