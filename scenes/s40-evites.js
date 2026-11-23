// 40 · Evening: lamps come on in the towns on the far hills.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [0, 2, 0], "target": [0, 3, -100], "fov": 34};
const B = {"pos": [0, 3.2, -6], "target": [6, 3, -100], "fov": 34};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's40-evites', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0.55, uDusk: 0.7, uSunDir: [-0.95, 0.005, -0.3], uSunCol: [1.6, 0.7, 0.3], uHaze: 0.0022, uSunDisc: 0, uSkyline: 3, uSkyAz: 3.0416, uCityLamps: 2.0, uHills: 0.15 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.3 }),
  };
};
