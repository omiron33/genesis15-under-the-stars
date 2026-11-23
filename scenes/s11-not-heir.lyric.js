// The words of s11-not-heir, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s11-not-heir.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["He will not be your heir", "One born from you", "will be your heir"],
  plane: (from) => standing(inView(from, 0, 0.55, 22), from, 0.66, 2.2),
});
