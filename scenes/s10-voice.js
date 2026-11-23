// 10 · The voice: the promise star flares and the camera tilts from the tent up into the sky.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-6, 0.8, 12], "target": [0, 1.3, 0], "fov": 44};
const B = {"pos": [-6, 0.8, 12], "target": [-2, 5.5, -10], "fov": 44};
const LAMPS = [[0.5, 0.45, 0.4, 4.5], [-260, 380, -900, 0]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's10-voice', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uStarGain: 1.2 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uLI.value[1] = 2.0 + 5.0 * ease.inOut3((t - P.from - 1.0) / 3.0);
    },
    post: (t) => grade(t, { exposure: 1.8 }),
  };
};
