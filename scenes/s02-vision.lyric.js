// The words of s02-vision, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s02-vision.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["The Lord\u2019s word came"],
  plane: (from) => standing(inView(from, 0, 0.55, 14), from, 0.62, 3),
});
