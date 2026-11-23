# Genesis 15, Under the Stars: director brief

**Mode:** code-only GLSL, 1920×1080 at 60 fps, 8 samples (16 on the fast-motion scenes: the
stars counted, the ram and the birds, the birds of prey, the firepot). Built the Genesis 8 way
(2026-11-23): short scenes cut on beats,
one design system, lyrics as their own sharp type layer, one fast draft and one critic pass.

## Design system

- **Running motif: the promise light.** One point of gold light is in the film from the first
  frame: the promise star over the hills in the title, the lamp in Abram's tent, the ring of light
  of "I am your shield", the stars that turn gold one by one as Abram counts them, the morning star,
  the four lamps of the four generations, the firepot and the lamp of fire that pass between the
  pieces, and the star above the hill of the Jebusites at the end. The gauge's small four-pointed
  star carries it into the type.
- **Palette that builds:** night of grief (indigo, `lib/look.js` act 0) → the counted stars
  (indigo and gold) → dawn over the land (ochre) → sunset and the great darkness (crimson to black)
  → the fire between the pieces (ember) → morning over the promised land (gold).
- **Signal colour:** promise gold (255, 206, 122). Only the signal glows.
- **Two typefaces:** EB Garamond for every sung word; Inter Tight, tracked capitals, for the
  annotation (GENESIS 15:v, YEAR n).
- **Three voices:** the narrator (roman, bone), Abram (italic, warm bone), God (small capitals in
  promise gold).
- **One world library:** `lib/world.js`, written for this film. Raymarched hill country, one sun (the
  moon at night), soft shadows, haze, stars with a Milky Way, and the things the chapter names.
- **Grade:** grain 0.03, bloom 0.08, vignette 0.5, ACES (the engine's film finish).
- **People:** Abram only as a robed silhouette and gesture (standing with his staff, seated by the
  pieces, looking up). The Israelites of the coming-forth are far lamps in a column.
- **Theology:** the covenant is God's alone: the firepot and the lamp of fire pass between the
  pieces while Abram sits in the trance. No blood in the pieces scene: the halves are dark, covered
  forms in two rows. Genesis 15:6, faith counted as righteousness, is the still centre of the film.

## Arc

| Time | Act | Where |
|---|---|---|
| 0–62 | Grief | The tent at night: the vision, the shield of light, "what will you give me?", no heir. |
| 63–102 | Promise | The voice; brought outside; the stars counted; Abram believed. |
| 102–154 | Covenant asked | Dawn: Ur on the horizon, the land, the beasts brought, the pieces laid, the birds. |
| 154–212 | Darkness | Sunset, the great darkness, Egypt and the four hundred years, the coming-forth, peace, the fourth generation, the Amorites. |
| 212–229 | Fire | The smoking furnace and the lamp of fire pass between the pieces. |
| 229–290 | Grant | Morning over the land, from Egypt's river; the peoples' towns; the hill of the Jebusites; the stars again. |

The scene table, with every cut, is `tools/scenes.py` → `film.json` and `docs/STORYBOARD.md`.
