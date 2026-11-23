// The words of s30-peace, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s30-peace.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["You will go to your fathers", "nourished in a good"],
  plane: (from) => standing(inView(from, 0, -0.58, 14), from, 0.74, 2.6),
});
