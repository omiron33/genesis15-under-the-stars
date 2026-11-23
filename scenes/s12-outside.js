// 12 · He is brought outside: from behind the tent's edge, the figure stands under the whole sky.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [3.4, 0.25, 3.6], "target": [1.3, 2.2, 12], "fov": 46};
const B = {"pos": [2.4, 0.25, 3.2], "target": [1.1, 2.8, 12], "fov": 46};
const LAMPS = [[0.5, 0.45, 0.4, 4.5], [1.0, 0.25, 4.2, 1.4]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's12-outside', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.25, uTentOn: 1, uTentYaw: 0.0, uFigOn: 1, uFig: [1.4, 0, 7.5], uFigYaw: 3.14, uFigLook: 1, uStarGain: 1.4, uMilky: 1.0 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.9 }),
  };
};
