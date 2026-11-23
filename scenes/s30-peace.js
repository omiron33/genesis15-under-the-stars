// 30 · Evening under the oak: an old man's rest, quiet light through the leaves.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [7, 1.0, 7], "target": [0.6, 1.8, 0.6], "fov": 40};
const B = {"pos": [5.8, 0.9, 7.6], "target": [0.6, 1.9, 0.6], "fov": 40};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's30-peace', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 0.6, uSunDir: [-0.8, 0.1, -0.3], uSunCol: [4.0, 2.4, 1.2], uHaze: 0.0016, uOakOn: 1, uOak: [0, 0, 0], uFigOn: 1, uFigSit: 1, uFig: [1.4, 0, 1.2], uFigYaw: 0.8 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      
    },
    post: (t) => grade(t, { exposure: 1.05 }),
  };
};
