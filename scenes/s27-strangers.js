// 27 · Far off at dusk, Egypt: pyramids on the horizon, and a line of far lamps that are not at home.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 1.4, 0], "target": [-60, 2.2, 6], "fov": 34};
const B = {"pos": [0, 1.6, 0], "target": [-60, 2.4, -6], "fov": 34};
const LAMPS = [[-24.0, 0.6, -2.0, 0.8], [-23.1, 0.6, -0.8, 0.8], [-22.2, 0.6, 0.4, 0.8], [-21.3, 0.6, 1.6, 0.8], [-20.4, 0.6, 2.8, 0.8], [-19.5, 0.6, 4.0, 0.8], [-18.6, 0.6, 5.2, 0.8], [-17.7, 0.6, 6.4, 0.8]];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's27-strangers', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0.3, uDusk: 0.9, uSunDir: [-0.95, 0.01, 0.1], uSunCol: [2.5, 1.0, 0.4], uHaze: 0.0022, uSkyline: 2, uSkyAz: -1.3711, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.2 }),
  };
};
