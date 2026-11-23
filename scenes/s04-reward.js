// 04 · The camera rises over the camp; the ring of light holds and the stars brighten.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [3, 3.0, 12], "target": [0, 0.8, 0], "fov": 44};
const B = {"pos": [4, 9.0, 16], "target": [0, 0.3, -2], "fov": 44};
const LAMPS = [[6.00, 0.6, 0.00, 1.6], [4.24, 0.6, 4.24, 1.6], [0.00, 0.6, 6.00, 1.6], [-4.24, 0.6, 4.25, 1.6], [-6.00, 0.6, 0.01, 1.6], [-4.25, 0.6, -4.23, 1.6], [-0.01, 0.6, -6.00, 1.6], [0.5, 0.45, 0.4, 4.5]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's04-reward', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uStarGain.value = 1 + 0.6 * ease.inOut3(x(t));
    },
    post: (t) => grade(t, { exposure: 1.8 }),
  };
};
