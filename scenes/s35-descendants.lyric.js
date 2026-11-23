// The words of s35-descendants, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s35-descendants.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["\u201cTo your descendants"],
  plane: (from) => standing(inView(from, 0, -0.5, 80), from, 0.82, 3),
  ink: '34, 22, 14', gaugeInk: '34, 22, 14',
  shade: 0.85,
});
