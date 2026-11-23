// The words of s10-voice, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s10-voice.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["At once the Lord\u2019s voice"],
  plane: (from) => standing(inView(from, 0, 0.3, 30), from, 0.72, 2.6),
  anchorAt: 0.5,
});
