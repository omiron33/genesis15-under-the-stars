// The words of s13-count, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s13-count.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Look up at heaven", "if you can number"],
  plane: (from) => standing(inView(from, 0, 0.45, 30), from, 0.7, 2.4),
  anchorAt: 0.7,
});
