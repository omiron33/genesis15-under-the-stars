// 06 · Abram seated alone by a small fire beside the tent; no one else at the fire.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [6.8, 0.6, 7.0], "target": [2.4, 0.8, 3.2], "fov": 36};
const B = {"pos": [6.2, 0.55, 7.4], "target": [2.4, 0.85, 3.2], "fov": 36};
const LAMPS = [[2.4, 0.25, 3.0, 7.0], [0.3, 0.45, 0.5, 3.0]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's06-childless', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uTentYaw: -0.3, uFigOn: 1, uFigSit: 1, uFig: [3.2, 0, 3.6], uFigYaw: -2.2 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 2.0 }),
  };
};
