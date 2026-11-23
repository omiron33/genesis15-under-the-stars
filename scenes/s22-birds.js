// 22 · Birds of prey wheel above the pieces in the afternoon; the birds he did not divide lie whole.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [3, 0.4, 8.5], "target": [0, 4, 0], "fov": 46};
const B = {"pos": [1.5, 0.45, 7.5], "target": [0, 2.5, 0], "fov": 46};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's22-birds', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.35, uSunDir: [-0.7, 0.3, -0.55], uSunCol: [5.2, 3.9, 2.6], uHaze: 0.0016, uPiecesOn: 1, uBirds: 6, uBirdC: [0, 9, 0.5], uBirdR: 6 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uBirdDive.value = 0.5 * ease.inOut3(x(t));
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
