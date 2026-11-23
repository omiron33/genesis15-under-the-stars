// 23 · Abram sits beside the pieces with his staff and keeps watch; the birds dive and turn away.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [7.5, 1.0, 6.5], "target": [1.2, 1.0, 0.2], "fov": 38};
const B = {"pos": [6.5, 0.9, 4.0], "target": [1.2, 1.1, 0.4], "fov": 38};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's23-sat', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.35, uSunDir: [-0.8, 0.15, -0.5], uSunCol: [5.2, 3.9, 2.6], uHaze: 0.0016, uPiecesOn: 1, uFigOn: 1, uFigSit: 1, uFig: [2.8, 0, 0.6], uFigYaw: -1.57, uBirds: 4, uBirdC: [0, 3.5, 0.5], uBirdR: 5, uBirdDive: 0.4 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
