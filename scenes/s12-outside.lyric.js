// The words of s12-outside, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s12-outside.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["He brought Abram outside"],
  plane: (from) => standing(inView(from, 0, 0.55, 24), from, 0.72, 2.6),
});
