// The words of s17-land, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s17-land.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["to give you this land"],
  plane: (from) => standing(inView(from, 0, -0.45, 60), from, 0.82, 2.6),
  ink: '38, 26, 18', gaugeInk: '38, 26, 18',
  shade: 0.85,
});
