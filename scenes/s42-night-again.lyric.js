// The words of s42-night-again, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s42-night-again.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: [],
  plane: (from) => standing(inView(from, 0, -0.5, 40), from, 0.6, 3),
  gauge: false,
});
