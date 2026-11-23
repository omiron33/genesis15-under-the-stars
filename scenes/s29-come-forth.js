// 29 · Night in the desert: a long column of lamps comes out towards us, carrying much.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [3, 2.2, 14], "target": [-2, 0.5, -10], "fov": 40};
const B = {"pos": [2, 1.8, 10], "target": [-2, 0.6, -10], "fov": 40};
const LAMPS = [[-3.00, 1.0, -30.0, 0.9], [-2.85, 1.0, -26.8, 0.9], [-2.70, 1.0, -23.6, 0.9], [-2.55, 1.0, -20.4, 0.9], [-2.40, 1.0, -17.2, 0.9], [-2.25, 1.0, -14.0, 0.9], [-2.10, 1.0, -10.8, 0.9], [-1.95, 1.0, -7.6, 0.9]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's29-come-forth', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 1, uStars: 1, uSunDir: [-0.35, 0.55, -0.5], uSunCol: [0.3, 0.36, 0.58], uSunDisc: 0, uHaze: 0.0016, uHills: 0.8 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      for (let i = 0; i < 8; i++) { u.uL.value[i * 3 + 2] = -30 + i * 3.2 + (t - P.from) * 1.6; u.uL.value[i * 3] = -3 + i * 0.15 + Math.sin(i * 1.7) * 0.6; }
    },
    post: (t) => grade(t, { exposure: 1.8 }),
  };
};
