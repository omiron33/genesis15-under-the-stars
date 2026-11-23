// 18 · Morning on a hill: Abram looks out over the land, the camera moving round behind him.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [-3.4, 1.5, -2.6], "target": [22, 0.5, 20], "fov": 40};
const B = {"pos": [-3.8, 1.6, -1.0], "target": [24, 0.3, 18], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's18-how-know', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.25, uSunDir: [0.8, 0.22, -0.5], uSunCol: [5.0, 4.1, 3.0], uHaze: 0.0016, uFigOn: 1, uFig: [0, 0, 0], uFigYaw: -2.4, uHills: 1.3 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.0 }),
  };
};
