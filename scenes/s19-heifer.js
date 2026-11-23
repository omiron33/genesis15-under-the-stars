// 19 · The heifer and the she-goat walk along a ridge against the low sun, led to Abram.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-2, 0.6, 9], "target": [0, 1.0, -2], "fov": 34};
const B = {"pos": [1.5, 0.6, 9], "target": [2.5, 1.0, -2], "fov": 34};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's19-heifer', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.25, uSunDir: [-0.2, 0.12, -1], uSunCol: [4.5, 3.0, 1.8], uHaze: 0.0016, uAnimOn: 1, uAnim: [0.2, 0, 0], uAnimWalk: 1, uAnimKinds: [0, 1, -1], uFlat: [0, 0, 0] },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uAnim.value.set(-3.5 + 4.5 * x(t), 0, 0);
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
