// 15 · Abram close, a still silhouette against the counted sky; one star above him burns gold.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [1.4, 0.35, -2.6], "target": [0, 1.9, 0], "fov": 40};
const B = {"pos": [1.1, 0.35, -2.2], "target": [0, 2.0, 0], "fov": 40};
const LAMPS = [[-6, 14, 18, 4]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's15-believed', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.25, uFigOn: 1, uFig: [0, 0, 0], uFigYaw: 2.6, uFigLook: 0.7, uCount: 1.0, uStarGain: 1.3, uMilky: 1.1 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.9 }),
  };
};
