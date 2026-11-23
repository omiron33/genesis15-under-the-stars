// The words of s40-evites, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s40-evites.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["the Evites"],
  plane: (from) => standing(inView(from, 0, -0.5, 40), from, 0.7, 3),
});
