// The words of s39-amorites-list, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s39-amorites-list.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["the Amorites, the Chananites"],
  plane: (from) => standing(inView(from, 0, -0.45, 45), from, 0.6, 3),
  ink: '30, 20, 12', gaugeInk: '30, 20, 12',
  shade: 0.85,
  anchorAt: 0.5,
});
