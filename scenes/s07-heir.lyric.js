// The words of s07-heir, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s07-heir.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["son of Masek", "is my heir"],
  plane: (from) => standing(inView(from, 0, 0.55, 22), from, 0.8, 3),
});
