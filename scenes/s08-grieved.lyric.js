// The words of s08-grieved, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s08-grieved.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Abram said, \u201cI am grieved", "you have given me no seed"],
  plane: (from) => lying([0, 0.02, -1.9], from, 0.78, 3, 0.45),
});
