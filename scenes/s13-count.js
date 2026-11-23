// 13 · The camera tilts up from Abram to the Milky Way; star after star turns gold as they are counted.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0.6, 0.3, -2.2], "target": [0, 1.7, 4], "fov": 52};
const B = {"pos": [0.6, 0.3, -2.2], "target": [0.1, 4.2, 5], "fov": 52};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's13-count', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.25, uFigOn: 1, uFig: [0, 0, 0], uFigYaw: 3.14, uFigLook: 1, uStarGain: 1.8, uMilky: 1.2 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uCount.value = 0.35 * ease.inOut3((t - P.from - 1.2) / (P.to - P.from - 1.6));
    },
    post: (t) => grade(t, { exposure: 1.9 }),
  };
};
