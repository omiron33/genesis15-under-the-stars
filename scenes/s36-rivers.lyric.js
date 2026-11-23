// The words of s36-rivers, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s36-rivers.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["from Egypt\u2019s river"],
  plane: (from) => standing(inView(from, 0, -0.4, 60), from, 0.8, 3),
  ink: '34, 22, 14', gaugeInk: '34, 22, 14',
  shade: 0.85,
  anchorAt: 0.6,
});
