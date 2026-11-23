// The words of s32-amorites, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s32-amorites.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["for the Amorites"],
  plane: (from) => standing(inView(from, 0, -0.5, 40), from, 0.75, 3),
});
