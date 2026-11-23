// 14 · Wide: Abram small on a rise, the whole sky gold with counted stars.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-1.0, 0.25, -4.5], "target": [0, 2.4, 8], "fov": 56};
const B = {"pos": [-0.6, 0.25, -3.8], "target": [0, 3.5, 8], "fov": 56};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's14-children', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.2, uFigOn: 1, uFig: [0, 0.0, 0], uFigYaw: 3.14, uFigLook: 1, uStarGain: 1.8, uMilky: 1.2 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uCount.value = 0.35 + 0.65 * ease.inOut3((t - P.from) / (P.to - P.from - 1.0));
    },
    post: (t) => grade(t, { exposure: 1.9 }),
  };
};
