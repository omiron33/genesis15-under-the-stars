// The words of s21-cut, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s21-cut.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Abram brought them", "and laid each half"],
  plane: (from) => standing(inView(from, 0, 0.62, 14), from, 0.7, 2.6),
  ink: '30, 20, 12', gaugeInk: '30, 20, 12',
  shade: 0.85,
});
