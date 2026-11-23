// 24 · The sun touches the hills; Abram is a seated silhouette by the pieces.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [9, 0.5, 2.5], "target": [-30, 1.5, -8], "fov": 40};
const B = {"pos": [10.5, 0.45, 1.0], "target": [-30, 1.2, -10], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's24-sunset', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 1, uSunDir: [-0.95, 0.025, -0.3], uSunCol: [4.2, 1.7, 0.6], uHaze: 0.0022, uPiecesOn: 1, uFigOn: 1, uFigSit: 1, uFig: [2.8, 0, 0.6], uFigYaw: -1.9 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uSunDir.value.set(-0.95, 0.03 - 0.025 * x(t), -0.3);
    },
    post: (t) => grade(t, { exposure: 1.05 }),
  };
};
