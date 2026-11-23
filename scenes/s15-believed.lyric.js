// The words of s15-believed, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s15-believed.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Abram believed God", "and God counted it"],
  plane: (from) => standing(inView(from, -0.22, 0.5, 10), from, 0.6, 2.4),
});
