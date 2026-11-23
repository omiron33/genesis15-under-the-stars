// 39 · A quick sweep along a ridge line in the afternoon.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-15, 3, 0], "target": [20, 3, -90], "fov": 38};
const B = {"pos": [15, 3.2, -4], "target": [35, 3, -90], "fov": 38};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's39-amorites-list', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.35, uSunDir: [-0.7, 0.3, -0.55], uSunCol: [5.2, 3.9, 2.6], uHaze: 0.0016, uSkyline: 3, uSkyAz: 2.9707, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
