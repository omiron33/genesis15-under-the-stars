// The words of s09-inherit, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s09-inherit.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["My home-born servant", "will inherit"],
  plane: (from) => standing(inView(from, 0, 0.5, 20), from, 0.72, 2.6),
});
