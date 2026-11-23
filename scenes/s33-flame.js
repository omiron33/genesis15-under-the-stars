// 33 · Full dark. In the black between the rows, a flame appears: a smoking furnace and a lamp of fire.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 1.2, 9], "target": [0, 0.8, -2], "fov": 38};
const B = {"pos": [0, 1.1, 7], "target": [0, 0.9, -2.5], "fov": 38};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's33-flame', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.04, 0.05, 0.09], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uStarGain: 0.5, uPiecesOn: 1, uFire: [0, 0, -3.2], uTorch: [0.3, 1.3, -4.6] },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uFireOn.value = t > P.from + 1.0 ? 1 : 0; u.uTorchOn.value = t > P.from + 3.4 ? 1 : 0; u.uSmoke.value = ease.inOut3((t - P.from - 1.0) / 2.0);
    },
    post: (t) => grade(t, { exposure: 1.5 }),
  };
};
