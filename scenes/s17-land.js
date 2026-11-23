// 17 · Sunrise: the camera cranes up over the hill country as the land is given.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 2, 0], "target": [50, 3, -40], "fov": 46};
const B = {"pos": [0, 16, 4], "target": [70, 1, -50], "fov": 46};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's17-land', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.55, uSunDir: [0.9, 0.06, -0.4], uSunCol: [5.0, 3.0, 1.4], uHaze: 0.0016, uHills: 1.4 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      u.uSunDir.value.set(0.9, 0.05 + 0.08 * x(t), -0.4);
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
