// The words of s14-children, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s14-children.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Then he said, \u201cSo shall"],
  plane: (from) => standing(inView(from, 0, 0.5, 40), from, 0.72, 2.6),
});
