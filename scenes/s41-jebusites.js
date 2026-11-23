// 41 · Before dawn, the hill of the Jebusites, and above it the promise star once more.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 0.8, 20], "target": [0, 6, -100], "fov": 30};
const B = {"pos": [0, 1.0, 10], "target": [0, 8, -100], "fov": 30};
const LAMPS = [[0, 140, -900, 3.0]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's41-jebusites', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0.75, uDusk: 0.35, uStars: 0.6, uSunDir: [0.95, -0.02, -0.3], uSunCol: [0.4, 0.4, 0.6], uHaze: 0.002, uSkyline: 3, uSkyAz: 3.1416, uCityLamps: 0.6, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.5 }),
  };
};
