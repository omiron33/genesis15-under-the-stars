// 05 · Abram at the door of his tent, a silhouette against the lamp, asking.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-4.0, 0.45, 8], "target": [0.6, 1.4, 2], "fov": 34};
const B = {"pos": [-2.9, 0.45, 6.8], "target": [0.6, 1.45, 2], "fov": 34};
const LAMPS = [[0.5, 0.45, 0.4, 4.5], [0.2, 1.4, -0.3, 3.0], [3.0, 0.2, 5.0, 2.4]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's05-door', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uFigOn: 1, uFig: [0.7, 0, 2.5], uFigYaw: 0.35, uFigLook: 0.4 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 2.0 }),
  };
};
