// The words of s28-four-hundred, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/s28-four-hundred.js';
import { layer, standing, lying, inView, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {
  lines: ["for four hundred years", "I will judge the nation"],
  plane: (from) => standing(inView(from, 0, -0.5, 30), from, 0.76, 2.4),
  ink: '30, 20, 12', gaugeInk: '30, 20, 12',
  shade: 0.85,
  extra: (ctx, t, H) => { const y = Math.min(400, Math.floor(400 * ease.inOut3((t - P.from) / (P.to - P.from - 0.8)))); gauge(ctx, `YEAR ${y}`, 1920, H * 0.86, { size: 64, alpha: 0.9, ink: '30, 20, 12' }); },
});
