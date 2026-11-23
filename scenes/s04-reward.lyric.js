// The words of s04-reward, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s04-reward.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["your reward"],
  plane: (from) => standing(inView(from, 0, 0.6, 30), from, 0.7, 3),
});
