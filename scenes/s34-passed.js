// 34 · The furnace and the lamp pass down the path between the pieces, toward us, and on.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 1.6, 8.5], "target": [0, 0.8, 0], "fov": 40};
const B = {"pos": [4.5, 2.6, 7.5], "target": [0, 1.0, 1.5], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's34-passed', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.04, 0.05, 0.09], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uStarGain: 0.6, uPiecesOn: 1, uFireOn: 1, uTorchOn: 1 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      const z = -3.2 + 8.5 * ease.inOut3(x(t)); u.uFire.value.set(0, 0, z); u.uTorch.value.set(0.25, 1.25, z - 1.4);
    },
    post: (t) => grade(t, { exposure: 1.5 }),
  };
};
