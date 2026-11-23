# Under the Stars (Genesis 15)

Built with the Ark engine: https://github.com/omiron33/ark-video-studio

A code-rendered lyric film of Genesis 15: the word of the Lord to Abram in a vision, the grief of
having no heir, the stars he is told to count, the faith counted to him as righteousness, the
heifer, the she-goat and the ram laid in two rows, the great darkness, the four hundred years, and
the smoking furnace and lamp of fire that pass between the pieces as the Lord makes his covenant.

[Listen at TechnoChristianity](https://technochristianity.com/music/?work=genesis-15) · [More films on YouTube](https://www.youtube.com/@technochristianity)

## How it is made

Built the Genesis 8 way: 44 short scenes cut on measured beats, one world for the whole film, and
the lyrics set as their own sharp type layer on planes placed in that world.

- `lib/world.js`: the film's one raymarched world (the hill country, the sky with the stars that
  Abram counts, one sun or moon, the tent, Abram as a robed silhouette, the beasts, the pieces, the
  birds, the oak, the firepot and the lamp of fire, far cities on the horizon).
- `lib/look.js`: the palette that builds across the song and the grade. `lib/type.js`: the two
  typefaces (EB Garamond, Inter Tight) and the three voices (narrator, Abram, and God in promise
  gold, the one glowing signal colour).
- `scenes/sNN-*.js` and `scenes/sNN-*.lyric.js`: one picture and one lyric layer per scene,
  generated from the authored table in `tools/scenes.py`.
- `data/lyrics.json`, `data/audio.json`: sung words force-aligned to the separated vocal and
  checked against local Whisper (machine estimates), and the measured beats (74 BPM).
- `docs/BRIEF.md`: the design system. `docs/STORYBOARD.md`: the scene table with cut times.

## Rendering

Place the original 48 kHz stereo recording at `media/song.wav` (not in this repository). Each scene
module is a raymarched GLSL world plus a lyric layer, keyed to `data/lyrics.json`; `film.json` lists
the scenes, their cut times on measured beats, and the finish: 1920 × 1080 at 60 fps, 8 sub-frames
(16 on the fast-motion scenes), CRF 12. A fast review draft renders the same scenes at 30 fps with
2 sub-frames. `python3 tools/scenes.py` regenerates the scene modules and `film.json` from the
authored table.

## License

Source code is released under the [MIT License](LICENSE). The song recording and the finished film are
separate media releases; the source-code license does not grant any rights to the recording, its
lyrics as a recorded work, or the rendered film.
