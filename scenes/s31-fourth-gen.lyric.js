// The words of s31-fourth-gen, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s31-fourth-gen.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["In the fourth generation"],
  plane: (from) => standing(inView(from, 0, 0.35, 12), from, 0.66, 3),
});
