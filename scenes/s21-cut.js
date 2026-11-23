// 21 · High above: the halves laid in two rows facing each other, a path between; Abram at the end.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0.4, 1.6, 9.5], "target": [0, 0.4, 0], "fov": 36};
const B = {"pos": [-0.4, 2.4, 8.0], "target": [0, 0.3, 0], "fov": 36};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's21-cut', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.35, uSunDir: [-0.7, 0.3, -0.55], uSunCol: [5.2, 3.9, 2.6], uHaze: 0.0016, uPiecesOn: 1, uPieces: [0, 0, 0], uFigOn: 1, uFig: [0, 0, -4.6], uFigYaw: 0 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 0.95 }),
  };
};
