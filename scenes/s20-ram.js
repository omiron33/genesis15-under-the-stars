// 20 · The ram follows, and a dove and a pigeon cross the morning sky.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [2.5, 0.5, 5.5], "target": [0, 1.0, -1], "fov": 36};
const B = {"pos": [-0.5, 0.55, 5.8], "target": [-1, 1.4, -1], "fov": 36};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's20-ram', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.25, uSunDir: [-0.2, 0.12, -1], uSunCol: [4.5, 3.0, 1.8], uHaze: 0.0016, uAnimOn: 1, uAnim: [0, 0, 0], uAnimWalk: 1, uAnimKinds: [2, -1, -1], uBirds: 2, uBirdC: [0, 3.8, -5], uBirdR: 3, uBirdSpread: 0.6 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uAnim.value.set(1.8 - 3.0 * x(t), 0, 0); u.uAnimYaw.value = 3.14;
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
