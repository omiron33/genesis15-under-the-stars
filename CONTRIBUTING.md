# Contributing to Under the Stars (Genesis 15)

Pull requests are welcome: bug fixes, documentation, new scene ideas and tooling.

Every pull request needs an approving review from Shane Fisher (@omiron33), the code owner, before it can be merged. Please work on a branch or a fork and open a pull request against `main`.

## Guidelines

- Every frame must be a pure function of song time: no wall-clock time or unseeded randomness.
- Words belong to the world: cut them into a surface in the scene rather than laying them over the picture.
- Scene timings come from `docs/plan.json` through `tools/plan.py`; do not hand-edit `film.json` or `docs/STORYBOARD.md`.
- No realistic faces drawn in code: depict people through silhouette, gesture and form.
- The original recording (`media/song.wav`) is not in this repository and must never be committed.
