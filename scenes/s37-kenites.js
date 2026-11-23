// 37 · The peoples of the land: a walled hill town in the morning haze.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 2, 0], "target": [-20, 3, -100], "fov": 24};
const B = {"pos": [3, 2.2, -12], "target": [-14, 3.4, -100], "fov": 22};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's37-kenites', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.25, uSunDir: [0.8, 0.22, -0.5], uSunCol: [5.0, 4.1, 3.0], uHaze: 0.0016, uSkyline: 3, uSkyAz: -2.7942, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
