// 43 · The tent and the whole counted sky; the camera rises slowly as the last fifth hangs.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-6, 0.4, 10.5], "target": [0, 3, -10], "fov": 50};
const B = {"pos": [-6, 2.2, 12], "target": [0, 6, -10], "fov": 50};
const LAMPS = [[0.5, 0.45, 0.4, 4.5], [2.2, 0.18, 4.0, 2.6], [-260, 380, -900, 2.6]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's43-end', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uCount: 0.6, uStarGain: 1.4, uMilky: 1.2 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uCount.value = 0.6 + 0.4 * ease.inOut3(x(t)); u.uExp.value = 1.0 - 0.9 * ease.inOut3((t - P.to + 2.5) / 2.5);
    },
    post: (t) => grade(t, { exposure: 1.9 }),
  };
};
