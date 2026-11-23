// The words of s27-strangers, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s27-strangers.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["in a land not their own", "They will be enslaved"],
  plane: (from) => standing(inView(from, 0, -0.45, 40), from, 0.68, 2.4),
});
