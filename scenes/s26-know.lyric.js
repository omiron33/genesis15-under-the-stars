// The words of s26-know, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s26-know.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Know for certain", "your seed will be strangers"],
  plane: (from) => standing(inView(from, 0, 0.55, 20), from, 0.74, 2.4),
});
