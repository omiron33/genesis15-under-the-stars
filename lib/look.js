// The film's look: one palette that builds across the song, one signal colour, and the grade.
//   night of grief (indigo)  ->  the counted stars (indigo and gold)  ->  dawn over the land (ochre)
//   ->  sunset and the great darkness (crimson to black)  ->  the fire between the pieces (ember)
//   ->  morning over the promised land (gold)
// The signal colour is promise gold: it is the only thing that glows (the lamp in the tent, the
// counted stars, the fire that passes between the pieces, and God's own words).
import { keys, ease, clamp01 } from '/engine.js';

export const SIGNAL = '255, 206, 122';
export const BONE = '242, 234, 220';

// 0 night of grief .. 1 counted stars .. 2 dawn .. 3 sunset/darkness .. 4 fire .. 5 morning
export function act(t) {
  return keys(t, [[0, 0], [77, 0], [82, 1], [100, 1], [104, 2], [150, 2], [156, 3], [210, 3], [214, 4], [228, 4], [232, 5], [290, 5]], (x) => x);
}
const GAINS = [
  [0.93, 0.97, 1.07],   // indigo
  [0.97, 0.97, 1.03],   // indigo and gold
  [1.04, 0.99, 0.93],   // ochre
  [1.06, 0.95, 0.92],   // crimson
  [1.05, 0.97, 0.9],    // ember
  [1.04, 1.0, 0.93],    // gold
];
export function grade(t, extra = {}) {
  const a = act(t), i = Math.min(4, Math.floor(a)), f = a - i;
  const g = GAINS[i].map((v, k) => v + (GAINS[i + 1][k] - v) * f);
  return {
    exposure: 1, saturation: 0.88 + 0.03 * a, contrast: 1.05,
    lift: [0.006, 0.007, 0.012], gain: g,
    grain: 0.03, vignette: 0.5, ca: 0.3, bloom: 0.08, threshold: 1.1,
    ...extra,
  };
}
export { keys, ease, clamp01 };
