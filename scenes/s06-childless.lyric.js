// The words of s06-childless, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s06-childless.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["I depart without", "This Eliezer"],
  plane: (from) => standing(inView(from, 0, 0.55, 18), from, 0.72, 3),
});
