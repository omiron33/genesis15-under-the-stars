// The words of s22-birds, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s22-birds.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["But he did not divide", "Birds came down"],
  plane: (from) => standing(inView(from, 0, -0.55, 20), from, 0.7, 2.6),
  ink: '30, 20, 12', gaugeInk: '30, 20, 12',
  shade: 0.85,
});
