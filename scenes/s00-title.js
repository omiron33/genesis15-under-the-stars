// 00 · Night over the hill country. The promise star is the first light; the title stands on the horizon.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 1.2, 30], "target": [-6, 6, -40], "fov": 46};
const B = {"pos": [0, 2.2, 22], "target": [-6, 9, -40], "fov": 46};
const LAMPS = [[-260, 380, -900, 2.6]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's00-title', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uCount: 0.0, uStarGain: 0.8 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uStarGain.value = 0.45 + 0.55 * ease.inOut3(x(t) * 1.4);
    },
    post: (t) => grade(t, { exposure: 1.7 }),
  };
};
