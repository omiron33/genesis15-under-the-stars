// 38 · Ridge after ridge in the noon light, a town on each skyline.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 6, 0], "target": [-40, 2, -90], "fov": 40};
const B = {"pos": [-4, 6.5, -6], "target": [-50, 3, -90], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's38-chettites', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.3, uSunDir: [0.3, 0.75, -0.45], uSunCol: [4.6, 3.8, 2.6], uHaze: 0.0012, uSkyline: 3, uSkyAz: -2.8734, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 0.62 }),
  };
};
