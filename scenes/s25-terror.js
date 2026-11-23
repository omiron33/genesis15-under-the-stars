// 25 · A great darkness comes down; the light drains from the sky as the camera closes on Abram.
import { WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease } from '/song/lib/world.js';
import { grade } from '/song/lib/look.js';

const A = {"pos": [6.5, 0.7, 3.5], "target": [2.8, 0.8, 0.6], "fov": 38};
const B = {"pos": [5.0, 0.75, 2.4], "target": [2.8, 0.9, 0.6], "fov": 38};
const LAMPS = [];

export default (P) => {
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {
    name: 's25-terror', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) { return world(fc); }`,
    uniforms: { ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), uNight: 0, uDusk: 1, uSunDir: [-0.95, 0.025, -0.3], uSunCol: [4.2, 1.7, 0.6], uHaze: 0.0022, uPiecesOn: 1, uFigOn: 1, uFigSit: 1, uFig: [2.8, 0, 0.6], uFigYaw: -1.9, uSunDisc: 0 },
    camera: (t) => cam(P, t, A, B),
    update(t, u) {
      setLamps(u, LAMPS);
      const k = ease.inOut3(x(t)); u.uNight.value = 0.2 + 0.7 * k; u.uSunCol.value.set(2.0 * (1 - k) + 0.06, 0.8 * (1 - k) + 0.07, 0.3 * (1 - k) + 0.12); u.uSunDir.value.set(-0.95, -0.02, -0.3);
    },
    post: (t) => grade(t, { exposure: 1.5 }),
  };
};
