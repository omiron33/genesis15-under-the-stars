// 07 · Across the camp, the servant's tent with its own lamp: the home-born heir.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-9, 0.4, 9], "target": [0, 1.5, 0], "fov": 34};
const B = {"pos": [-6.5, 0.4, 9.5], "target": [0, 1.5, 0], "fov": 34};
const LAMPS = [[0.4, 0.45, 0.5, 4.5], [-7, 0.3, -6, 1.6], [6, 0.3, -9, 1.4]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's07-heir', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uTent: [0, 0, 0], uTentYaw: 0.6 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 2.0 }),
  };
};
