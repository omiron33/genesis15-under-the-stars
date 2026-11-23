// The words of s03-shield, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s03-shield.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Do not fear"],
  plane: (from) => standing(inView(from, 0, 0.58, 22), from, 0.7, 3),
});
