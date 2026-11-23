// 35 · Morning over the promised land from high above, the sun up, the hills going on and on.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 30, 0], "target": [90, 6, -100], "fov": 48};
const B = {"pos": [10, 34, -10], "target": [110, 4, -110], "fov": 48};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's35-descendants', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.45, uSunDir: [0.85, 0.12, -0.5], uSunCol: [5.0, 3.6, 2.0], uHaze: 0.0016, uHills: 1.5 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
