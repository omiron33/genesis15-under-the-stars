// 32 · The Amorites' walled hill under the moon, its lamps lit: their measure not yet full.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 1.0, 16], "target": [0, 3.0, -100], "fov": 16};
const B = {"pos": [0, 1.0, 8], "target": [0, 3.4, -100], "fov": 16};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's32-amorites', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.35, 0.42, 0.66], uSunDisc: 0, uHaze: 0.0016, uHills: 0.15, uSkyline: 3, uSkyAz: 3.1416, uCityLamps: 1.6, uStarGain: 0.7 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.7 }),
  };
};
