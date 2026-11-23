// The words of s38-chettites, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s38-chettites.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["the Chettites", "and the Raphaim"],
  plane: (from) => standing(inView(from, 0, -0.5, 50), from, 0.62, 2.6),
  ink: '30, 20, 12', gaugeInk: '30, 20, 12',
  shade: 0.85,
});
