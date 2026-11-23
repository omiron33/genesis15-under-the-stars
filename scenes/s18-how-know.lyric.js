// The words of s18-how-know, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s18-how-know.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["Abram said, \u201cMaster", "how can I know"],
  plane: (from) => standing(inView(from, 0.4, -0.45, 18), from, 0.58, 2.2),
  ink: '34, 22, 14', gaugeInk: '34, 22, 14',
  shade: 0.85,
});
