// The words of s33-flame, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s33-flame.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["As the sun went down", "a smoking furnace"],
  plane: (from) => standing(inView(from, 0, 0.6, 14), from, 0.74, 2.6),
});
