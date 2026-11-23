// 03 · A ring of gold lamps rises round the tent in the dark: "I am your shield".
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 5.5, 17], "target": [0, 0.4, 0], "fov": 42};
const B = {"pos": [5, 4.5, 15], "target": [0, 0.6, 0], "fov": 42};
const LAMPS = [[6.00, 0.6, 0.00, 0], [4.24, 0.6, 4.24, 0], [0.00, 0.6, 6.00, 0], [-4.24, 0.6, 4.25, 0], [-6.00, 0.6, 0.01, 0], [-4.25, 0.6, -4.23, 0], [-0.01, 0.6, -6.00, 0], [0.5, 0.45, 0.4, 4.5]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's03-shield', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.45, uTentOn: 1 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      for (let i = 0; i < 7; i++) u.uLI.value[i] = 1.6 * ease.out3((t - P.from - 0.4 - i * 0.28) / 0.6);
    },
    post: (t) => grade(t, { exposure: 1.8 }),
  };
};
