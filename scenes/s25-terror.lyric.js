// The words of s25-terror, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s25-terror.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["a great and gloomy", "The Lord said to Abram"],
  plane: (from) => standing(inView(from, 0, 0.45, 12), from, 0.72, 2.6),
});
