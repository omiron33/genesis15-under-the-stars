// The words of s34-passed, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s34-passed.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["passed between", "That day the Lord made"],
  plane: (from) => standing(inView(from, 0, 0.55, 16), from, 0.68, 2.4),
});
