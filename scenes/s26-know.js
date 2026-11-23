// 26 · Night has come: Abram sits in the dark, faint stars returning over the pieces.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [6.5, 0.3, 3.2], "target": [2.8, 1.0, 0.6], "fov": 40};
const B = {"pos": [5.8, 0.3, 2.4], "target": [2.8, 1.1, 0.6], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's26-know', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.25, uPiecesOn: 1, uFigOn: 1, uFigSit: 1, uFig: [2.8, 0, 0.6], uFigYaw: -1.9, uStarGain: 0.8 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 2.0 }),
  };
};
