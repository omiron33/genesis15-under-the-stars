// The words of s24-sunset, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s24-sunset.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["At sunset a trance"],
  plane: (from) => standing(inView(from, 0, -0.62, 14), from, 0.7, 3),
});
