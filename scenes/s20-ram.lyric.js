// The words of s20-ram, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s20-ram.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["and a ram", "a dove and a pigeon"],
  plane: (from) => standing(inView(from, 0, 0.5, 12), from, 0.75, 2.4),
  ink: '36, 24, 16', gaugeInk: '36, 24, 16',
  shade: 0.85,
});
