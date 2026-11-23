// 11 · Abram at the door, looking up; above him the gold star.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [1.6, 0.9, 6.8], "target": [-0.4, 2.6, -2], "fov": 42};
const B = {"pos": [1.3, 0.85, 6.2], "target": [-0.6, 3.2, -2], "fov": 42};
const LAMPS = [[0.5, 0.9, 0.4, 7.0], [-60, 90, -200, 5]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's11-not-heir', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uFigOn: 1, uFig: [0.6, 0, 3.2], uFigYaw: 3.0, uFigLook: 1, uStarGain: 1.3 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 2.0 }),
  };
};
