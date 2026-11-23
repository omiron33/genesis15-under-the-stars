// The words of s16-chaldeans, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s16-chaldeans.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["He said, \u201cI am God", "from the land of the Chaldeans"],
  plane: (from) => standing(inView(from, -0.35, -0.5, 30), from, 0.55, 2.4),
});
