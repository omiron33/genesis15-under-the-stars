// The words of s41-jebusites, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s41-jebusites.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["and the Jebusites"],
  plane: (from) => standing(inView(from, 0, -0.5, 40), from, 0.7, 3),
});
