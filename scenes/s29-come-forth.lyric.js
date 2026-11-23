// The words of s29-come-forth, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s29-come-forth.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Afterward they will come", "with great possessions"],
  plane: (from) => standing(inView(from, 0, 0.45, 26), from, 0.72, 2.6),
});
