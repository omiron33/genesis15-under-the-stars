// The words of s19-heifer, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s19-heifer.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["He said, \u201cBring me a heifer", "in her third year", "a she-goat"],
  plane: (from) => standing(inView(from, 0, -0.42, 14), from, 0.75, 2.0),
  ink: '36, 24, 16', gaugeInk: '36, 24, 16',
  shade: 0.85,
});
