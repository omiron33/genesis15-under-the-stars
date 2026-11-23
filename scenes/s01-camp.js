// 01 · The black tent alone on the plain, lamplight at its door, the hills dark under the stars.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-6, 0.35, 10.5], "target": [0, 1.5, 0], "fov": 38};
const B = {"pos": [-4.2, 0.35, 8.0], "target": [0, 1.6, 0], "fov": 38};
const LAMPS = [[0.5, 0.45, 0.4, 4.5], [2.2, 0.18, 4.0, 2.6], [-260, 380, -900, 2.6]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's01-camp', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1, uTentYaw: 0.25 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 2.0 }),
  };
};
