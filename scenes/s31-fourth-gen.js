// 31 · Dusk: four lamps are lit one after another along the ground, the four generations.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-0.6, 0.8, 4.6], "target": [0, 0.5, 0], "fov": 40};
const B = {"pos": [0.6, 0.75, 4.2], "target": [0.1, 0.5, 0], "fov": 40};
const LAMPS = [[-2.4, 0.25, 0, 0], [-0.8, 0.25, 0, 0], [0.8, 0.25, 0, 0], [2.4, 0.25, 0, 0]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's31-fourth-gen', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0.45, uDusk: 0.8, uSunDir: [-0.95, -0.01, -0.3], uSunCol: [0.9, 0.4, 0.2], uHaze: 0.0022, uSunDisc: 0 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      for (let i = 0; i < 4; i++) u.uLI.value[i] = 2.0 * ease.out3((t - P.from - 0.6 - i * 1.15) / 0.5);
    },
    post: (t) => grade(t, { exposure: 1.4 }),
  };
};
