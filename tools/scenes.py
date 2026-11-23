"""The film's scenes, authored in one table: writes docs/plan.json, scenes/<name>.js and
scenes/<name>.lyric.js, then runs tools/plan.py (cuts on measured beats -> film.json) and adds the
film-wide settings (samples, gates, overlay reasons).  python3 tools/scenes.py
Each scene is one world setting, one eased camera move (A -> B) and one lyric plane."""
import json, os, subprocess, textwrap

NIGHT = dict(uNight=1, uStars=1, uSunDir=[-0.35, 0.55, -0.5], uSunCol=[0.3, 0.36, 0.58], uSunDisc=0, uHaze=0.0016, uHills=0.45)
DAWN = dict(uNight=0.35, uDusk=0.8, uStars=0.35, uSunDir=[0.95, 0.03, -0.3], uSunCol=[2.2, 1.2, 0.6], uHaze=0.002)
MORNING = dict(uNight=0, uDusk=0.25, uSunDir=[0.8, 0.22, -0.5], uSunCol=[5.0, 4.1, 3.0], uHaze=0.0016)
NOON = dict(uNight=0, uDusk=0.0, uSunDir=[0.3, 0.75, -0.45], uSunCol=[5.6, 5.1, 4.4], uHaze=0.0012)
AFTERNOON = dict(uNight=0, uDusk=0.35, uSunDir=[-0.7, 0.3, -0.55], uSunCol=[5.2, 3.9, 2.6], uHaze=0.0016)
SUNSET = dict(uNight=0, uDusk=1, uSunDir=[-0.95, 0.025, -0.3], uSunCol=[4.2, 1.7, 0.6], uHaze=0.0022)
PROMISE = '[-260, 380, -900, 2.6]'   # the promise star, a lamp far in the sky

def U(*dicts, **kw):
    d = {}
    for x in dicts: d.update(x)
    d.update(kw)
    return d

S = []
def scene(slug, at, about, uniforms, A, B, exposure=1.0, lamps='[]', update='', lyric=None, samples=None, hold=None, words=''):
    S.append(dict(slug=slug, at=at, about=about, uniforms=uniforms, A=A, B=B, exposure=exposure, lamps=lamps, update=update, lyric=lyric, samples=samples, hold=hold, words=words))

TENTLAMP = '[0.5, 0.45, 0.4, 4.5]'
FIRE = '[2.2, 0.18, 4.0, 2.6]'   # the camp fire before the tent

# ---------------- Verse 1: the vision in the tent, the grief of no heir ----------------
scene('title', '0s', 'Night over the hill country. The promise star is the first light; the title stands on the horizon.',
      U(NIGHT, uCount=0.0, uStarGain=0.8), dict(pos=[0, 1.2, 30], target=[-6, 6, -40], fov=46), dict(pos=[0, 2.2, 22], target=[-6, 9, -40], fov=46),
      exposure=1.7, lamps=f'[{PROMISE}]', update="u.uStarGain.value = 0.45 + 0.55 * ease.inOut3(x(t) * 1.4);",
      lyric=dict(lines=[], title=True, plane="standing(inView(from, 0, -0.05, 60), from, 0.9, 3)"))
scene('camp', '7.0s', 'The black tent alone on the plain, lamplight at its door, the hills dark under the stars.',
      U(NIGHT, uTentOn=1, uTentYaw=0.25), dict(pos=[-9, 1.0, 16], target=[0, 1.2, 0], fov=38), dict(pos=[-5.5, 0.9, 11.5], target=[0, 1.3, 0], fov=38),
      exposure=1.9, lamps=f'[{TENTLAMP}, {PROMISE}]', lyric=dict(lines=[], gauge='GENESIS 15', plane="standing(inView(from, 0, 0.42, 30), from, 0.4, 3)"))
scene('vision', 0, 'At the open door of the tent: the lamp, and a gold light coming down on the roof (the vision).',
      U(NIGHT, uTentOn=1, uTentYaw=0.0), dict(pos=[1.2, 1.1, 7.5], target=[0, 1.1, 0], fov=36), dict(pos=[0.4, 1.05, 5.6], target=[0, 1.2, 0], fov=36),
      exposure=1.8, lamps=f'[{TENTLAMP}, [0, 7, 1.2, 0], {PROMISE}]',
      update="u.uLI.value[1] = 9.0 * ease.inOut3((t - P.from - 0.5) / 3.5);",
      lyric=dict(lines=['The Lord’s word came'], plane="standing(inView(from, 0, 0.55, 14), from, 0.62, 3)"))
scene('shield', 1, 'A ring of gold lamps rises round the tent in the dark: "I am your shield".',
      U(NIGHT, uTentOn=1), dict(pos=[0, 5.5, 17], target=[0, 0.4, 0], fov=42), dict(pos=[5, 4.5, 15], target=[0, 0.6, 0], fov=42),
      exposure=1.8, lamps='[' + ', '.join(f'[{6*__import__("math").cos(a*0.785):.2f}, 0.6, {6*__import__("math").sin(a*0.785):.2f}, 0]' for a in range(7)) + f', {TENTLAMP}]',
      update="for (let i = 0; i < 7; i++) u.uLI.value[i] = 1.6 * ease.out3((t - P.from - 0.4 - i * 0.28) / 0.6);",
      lyric=dict(lines=['Do not fear'], plane="standing(inView(from, 0, 0.58, 22), from, 0.7, 3)"))
scene('reward', 2, 'The camera rises over the camp; the ring of light holds and the stars brighten.',
      U(NIGHT, uTentOn=1), dict(pos=[3, 3.0, 12], target=[0, 0.8, 0], fov=44), dict(pos=[4, 9.0, 16], target=[0, 0.3, -2], fov=44),
      exposure=1.8, lamps='[' + ', '.join(f'[{6*__import__("math").cos(a*0.785):.2f}, 0.6, {6*__import__("math").sin(a*0.785):.2f}, 1.6]' for a in range(7)) + f', {TENTLAMP}]',
      update="u.uStarGain.value = 1 + 0.6 * ease.inOut3(x(t));",
      lyric=dict(lines=['your reward'], plane="standing(inView(from, 0, 0.6, 30), from, 0.7, 3)"))
scene('door', 3, 'Abram at the door of his tent, a silhouette against the lamp, asking.',
      U(NIGHT, uTentOn=1, uFigOn=1, uFig=[0.7, 0, 2.5], uFigYaw=0.35, uFigLook=0.4), dict(pos=[-4.5, 0.7, 8], target=[0.6, 1.2, 2], fov=34), dict(pos=[-3.2, 0.75, 6.8], target=[0.6, 1.25, 2], fov=34),
      exposure=1.8, lamps=f'[{TENTLAMP}, [0.2, 1.4, -0.3, 1.8], {PROMISE}]',
      lyric=dict(lines=['Abram said, “Master', 'what will you give'], plane="standing(inView(from, 0.05, 0.56, 16), from, 0.7, 3)"))
scene('childless', 5, 'Abram seated alone by a small fire beside the tent; no one else at the fire.',
      U(NIGHT, uTentOn=1, uTentYaw=-0.3, uFigOn=1, uFigSit=1, uFig=[3.2, 0, 3.6], uFigYaw=-2.2), dict(pos=[8.5, 1.3, 9.5], target=[2.6, 0.6, 3], fov=36), dict(pos=[7.0, 1.0, 8.6], target=[2.4, 0.7, 3], fov=36),
      exposure=1.8, lamps='[[2.4, 0.15, 3.0, 2.2], [0.3, 0.45, 0.5, 1.6]]',
      lyric=dict(lines=['I depart without', 'This Eliezer'], plane="standing(inView(from, 0, 0.55, 18), from, 0.72, 3)"))
scene('heir', 7, 'Across the camp, the servant\'s tent with its own lamp: the home-born heir.',
      U(NIGHT, uTentOn=1, uTent=[0, 0, 0], uTentYaw=0.6), dict(pos=[-14, 1.6, 14], target=[0, 1.0, 0], fov=34), dict(pos=[-9, 1.4, 14.5], target=[0, 1.0, 0], fov=34),
      exposure=1.8, lamps='[[0.4, 0.45, 0.5, 2.2], [-7, 0.3, -6, 1.2], [6, 0.3, -9, 1.0]]',
      lyric=dict(lines=['son of Masek', 'is my heir'], plane="standing(inView(from, 0, 0.55, 22), from, 0.8, 3)"))
scene('grieved', 9, 'Close over dry, cracked ground by lamplight: nothing grows. The seed that is not there.',
      U(NIGHT, uCrack=1, uHills=0.6), dict(pos=[0, 0.55, 3.2], target=[0, 0.0, -1.5], fov=40), dict(pos=[0, 0.45, 1.6], target=[0, 0.0, -2.5], fov=40),
      exposure=1.8, lamps='[[1.6, 0.6, -0.8, 2.2]]',
      lyric=dict(lines=['Abram said, “I am grieved', 'you have given me no seed'], plane="lying([0, 0.02, -1.9], from, 0.78, 3, 0.45)"))
scene('inherit', 11, 'Abram, standing, looks across to the servant\'s tent; between them the empty ground.',
      U(NIGHT, uTentOn=1, uTent=[-10, 0, -8], uTentYaw=0.9, uFigOn=1, uFig=[0, 0, 0], uFigYaw=3.6), dict(pos=[1.6, 1.5, 3.4], target=[-6, 1.0, -6], fov=36), dict(pos=[2.4, 1.6, 3.0], target=[-7, 1.0, -6.5], fov=36),
      exposure=1.8, lamps='[[-9.6, 0.45, -7.6, 2.2]]',
      lyric=dict(lines=['My home-born servant', 'will inherit'], plane="standing(inView(from, 0.1, 0.5, 20), from, 0.75, 3)"))

# ---------------- Pre-chorus and chorus: the stars ----------------
scene('voice', 13, 'The voice: the promise star flares and the camera tilts from the tent up into the sky.',
      U(NIGHT, uTentOn=1, uStarGain=1.2), dict(pos=[-6, 0.8, 12], target=[0, 1.3, 0], fov=44), dict(pos=[-6, 0.8, 12], target=[-2, 9, -10], fov=44),
      exposure=1.8, lamps=f'[{TENTLAMP}, [-260, 380, -900, 0]]', update="u.uLI.value[1] = 2.0 + 5.0 * ease.inOut3((t - P.from - 1.0) / 3.0);",
      lyric=dict(lines=['At once the Lord’s voice'], plane="standing(inView(from, 0, 0.52, 30), from, 0.7, 3)"))
scene('not-heir', 14, 'Abram at the door, looking up; above him the gold star.',
      U(NIGHT, uTentOn=1, uFigOn=1, uFig=[0.6, 0, 2.6], uFigYaw=0.2, uFigLook=1, uStarGain=1.3), dict(pos=[3.2, 0.5, 6.5], target=[0.2, 2.6, 0], fov=40), dict(pos=[2.4, 0.45, 5.6], target=[0.0, 3.0, 0], fov=40),
      exposure=1.8, lamps=f'[{TENTLAMP}, [-60, 90, -200, 5]]',
      lyric=dict(lines=['He will not be your heir', 'One born from you', 'will be your heir'], plane="standing(inView(from, 0, 0.45, 22), from, 0.72, 2.2)"), hold='three short lines of one promise, sung without a break')
scene('outside', 17, 'He is brought outside: from behind the tent\'s edge, the figure stands under the whole sky.',
      U(NIGHT, uTentOn=1, uTentYaw=0.0, uFigOn=1, uFig=[1.4, 0, 6.5], uFigYaw=3.14, uFigLook=1, uStarGain=1.4, uMilky=1.0), dict(pos=[3.9, 1.0, 3.6], target=[1.2, 1.6, 10], fov=46), dict(pos=[2.6, 1.1, 2.9], target=[1.0, 2.4, 12], fov=46),
      exposure=1.9, lamps=f'[{TENTLAMP}]',
      lyric=dict(lines=['He brought Abram outside'], plane="standing(inView(from, 0, -0.45, 24), from, 0.72, 3)"))
scene('count', 18, 'The camera tilts up from Abram to the Milky Way; star after star turns gold as they are counted.',
      U(NIGHT, uFigOn=1, uFig=[0, 0, 0], uFigYaw=3.14, uFigLook=1, uStarGain=1.5, uMilky=1.2), dict(pos=[0.5, 0.6, -2.6], target=[0, 1.6, 4], fov=50), dict(pos=[0.5, 0.6, -2.6], target=[0.2, 7.5, 6], fov=50),
      exposure=1.9, update="u.uCount.value = 0.35 * ease.inOut3((t - P.from - 1.2) / (P.to - P.from - 1.6));",
      lyric=dict(lines=['Look up at heaven', 'if you can number'], plane="standing(inView(from, 0, -0.55, 30), from, 0.75, 2.4)"), samples=16)
scene('children', 20, 'Wide: Abram small on a rise, the whole sky gold with counted stars.',
      U(NIGHT, uFigOn=1, uFig=[0, 0.0, 0], uFigYaw=3.14, uFigLook=1, uStarGain=1.5, uMilky=1.2, uHills=1.2), dict(pos=[-3, 0.6, -12], target=[0, 4, 8], fov=56), dict(pos=[-1.5, 0.5, -10], target=[0, 6, 8], fov=56),
      exposure=1.9, update="u.uCount.value = 0.35 + 0.65 * ease.inOut3((t - P.from) / (P.to - P.from - 1.0));",
      lyric=dict(lines=['Then he said, “So shall'], plane="standing(inView(from, 0, -0.5, 40), from, 0.72, 3)"))
scene('believed', 21, 'Abram close, a still silhouette against the counted sky; one star above him burns gold.',
      U(NIGHT, uFigOn=1, uFig=[0, 0, 0], uFigYaw=2.6, uFigLook=0.7, uCount=1.0, uStarGain=1.3, uMilky=1.1), dict(pos=[1.8, 0.9, -3.2], target=[0, 1.7, 0], fov=38), dict(pos=[1.3, 0.8, -2.5], target=[0, 1.8, 0], fov=38),
      exposure=1.9, lamps='[[-30, 70, 90, 4]]',
      lyric=dict(lines=['Abram believed God', 'and God counted it'], plane="standing(inView(from, 0, -0.55, 10), from, 0.8, 2.6)"))

# ---------------- Verse 2: the land, the animals, the pieces ----------------
scene('chaldeans', 23, 'Before dawn: far in the east the ziggurat of Ur stands on the horizon; Abram faces it.',
      U(DAWN, uSkyline=1, uSkyAz=0.0, uFigOn=1, uFig=[0, 0, 0], uFigYaw=-1.9, uHills=0.5), dict(pos=[-4, 1.1, 1.6], target=[30, 1.2, -6], fov=34), dict(pos=[-3.3, 1.2, 0.6], target=[30, 1.6, -9], fov=34),
      exposure=1.5,
      lyric=dict(lines=['He said, “I am God', 'from the land of the Chaldeans'], plane="standing(inView(from, 0, 0.45, 40), from, 0.74, 2.4)"))
scene('land', 25, 'Sunrise: the camera cranes up over the hill country as the land is given.',
      U(MORNING, uSunDir=[0.9, 0.08, -0.4], uSunCol=[4.0, 2.6, 1.5], uHills=1.4), dict(pos=[0, 2, 0], target=[40, 2, -60], fov=46), dict(pos=[0, 18, 4], target=[60, 0, -70], fov=46),
      exposure=1.0, update="u.uSunDir.value.set(0.9, 0.05 + 0.08 * x(t), -0.4);",
      lyric=dict(lines=['to give you this land'], plane="standing(inView(from, 0, -0.45, 60), from, 0.78, 3)", ink='38, 26, 18'))
scene('how-know', 26, 'Morning on a hill: Abram looks out over the land, the camera moving round behind him.',
      U(MORNING, uFigOn=1, uFig=[0, 0, 0], uFigYaw=-2.4, uHills=1.3), dict(pos=[-2.5, 1.4, -3.2], target=[20, 0.5, 20], fov=40), dict(pos=[-3.4, 1.6, -1.2], target=[24, 0, 18], fov=40),
      exposure=1.0,
      lyric=dict(lines=['Abram said, “Master', 'how can I know'], plane="lying([3.5, 0.02, 4.2], from, 0.7, 2.6, 0.5)", ink='34, 22, 14'))
scene('heifer', 28, 'The heifer and the she-goat walk along a ridge against the low sun, led to Abram.',
      U(MORNING, uSunDir=[-0.2, 0.12, -1], uSunCol=[4.5, 3.0, 1.8], uAnimOn=1, uAnim=[-1, 0, 0], uAnimWalk=1, uAnimKinds=[0, 1, -1], uFlat=[0, 0, 0]), dict(pos=[-2, 0.6, 9], target=[0, 1.0, -2], fov=34), dict(pos=[1.5, 0.6, 9], target=[2.5, 1.0, -2], fov=34),
      exposure=1.0, update="u.uAnim.value.set(-3.5 + 4.5 * x(t), 0, 0);",
      lyric=dict(lines=['He said, “Bring me a heifer', 'in her third year', 'a she-goat'], plane="lying([0.5, 0.02, 4.6], from, 0.82, 2.0, 0.45)", ink='36, 24, 16'))
scene('ram', 31, 'The ram follows, and a dove and a pigeon cross the morning sky.',
      U(MORNING, uSunDir=[-0.2, 0.12, -1], uSunCol=[4.5, 3.0, 1.8], uAnimOn=1, uAnim=[0, 0, 0], uAnimWalk=1, uAnimKinds=[2, -1, -1], uBirds=2, uBirdC=[0, 3.2, -4], uBirdR=4, uBirdSpread=0.6), dict(pos=[2.5, 0.5, 5.5], target=[0, 1.0, -1], fov=36), dict(pos=[-0.5, 0.55, 5.8], target=[-1, 1.4, -1], fov=36),
      exposure=1.0, update="u.uAnim.value.set(1.8 - 3.0 * x(t), 0, 0); u.uAnimYaw.value = 3.14;",
      lyric=dict(lines=['and a ram', 'a dove and a pigeon'], plane="lying([0, 0.02, 3.1], from, 0.8, 2.2, 0.45)", ink='36, 24, 16'), samples=16)
scene('cut', 33, 'High above: the halves laid in two rows facing each other, a path between; Abram at the end.',
      U(NOON, uPiecesOn=1, uPieces=[0, 0, 0], uFigOn=1, uFig=[0, 0, -4.6], uFigYaw=0), dict(pos=[0.5, 12, 9], target=[0, 0, 0.5], fov=36), dict(pos=[-0.5, 9.5, 7.5], target=[0, 0, 0.2], fov=36),
      exposure=0.95,
      lyric=dict(lines=['Abram brought them', 'and laid each half'], plane="lying([0, 0.02, 3.6], from, 0.8, 2.4, 0.9)", ink='30, 20, 12'))
scene('birds', 35, 'Birds of prey wheel above the pieces in the afternoon; the birds he did not divide lie whole.',
      U(AFTERNOON, uPiecesOn=1, uBirds=6, uBirdC=[0, 9, 0.5], uBirdR=6), dict(pos=[3, 0.4, 8.5], target=[0, 4, 0], fov=46), dict(pos=[1.5, 0.45, 7.5], target=[0, 2.5, 0], fov=46),
      exposure=1.0, update="u.uBirdDive.value = 0.5 * ease.inOut3(x(t));",
      lyric=dict(lines=['But he did not divide', 'Birds came down'], plane="standing(inView(from, 0, -0.62, 20), from, 0.74, 2.6)", ink='30, 20, 12', shade=0.4), samples=16)
scene('sat', 37, 'Abram sits beside the pieces with his staff and keeps watch; the birds dive and turn away.',
      U(AFTERNOON, uSunDir=[-0.8, 0.15, -0.5], uPiecesOn=1, uFigOn=1, uFigSit=1, uFig=[2.8, 0, 0.6], uFigYaw=-1.57, uBirds=4, uBirdC=[0, 3.5, 0.5], uBirdR=5, uBirdDive=0.4), dict(pos=[7.5, 1.0, 6.5], target=[1.2, 1.0, 0.2], fov=38), dict(pos=[6.5, 0.9, 4.0], target=[1.2, 1.1, 0.4], fov=38),
      exposure=1.0, hold='Abram keeps watch through two lines while the birds come and go',
      lyric=dict(lines=['upon the divided pieces', 'Abram sat down'], plane="standing(inView(from, 0, 0.6, 18), from, 0.72, 2.6)"), samples=16)

# ---------------- Bridge: sunset, the great darkness, the four hundred years ----------------
scene('sunset', 39, 'The sun touches the hills; Abram is a seated silhouette by the pieces.',
      U(SUNSET, uPiecesOn=1, uFigOn=1, uFigSit=1, uFig=[2.8, 0, 0.6], uFigYaw=-1.9), dict(pos=[9, 0.5, 2.5], target=[-30, 1.5, -8], fov=40), dict(pos=[10.5, 0.45, 1.0], target=[-30, 1.2, -10], fov=40),
      exposure=1.05, update="u.uSunDir.value.set(-0.95, 0.03 - 0.025 * x(t), -0.3);",
      lyric=dict(lines=['At sunset a trance'], plane="standing(inView(from, 0, -0.62, 14), from, 0.7, 3)"))
scene('terror', 40, 'A great darkness comes down; the light drains from the sky as the camera closes on Abram.',
      U(SUNSET, uPiecesOn=1, uFigOn=1, uFigSit=1, uFig=[2.8, 0, 0.6], uFigYaw=-1.9, uSunDisc=0), dict(pos=[6.5, 0.7, 3.5], target=[2.8, 0.8, 0.6], fov=38), dict(pos=[5.0, 0.75, 2.4], target=[2.8, 0.9, 0.6], fov=38),
      exposure=1.2, update="const k = ease.inOut3(x(t)); u.uNight.value = 0.2 + 0.7 * k; u.uSunCol.value.set(2.0 * (1 - k) + 0.06, 0.8 * (1 - k) + 0.07, 0.3 * (1 - k) + 0.12); u.uSunDir.value.set(-0.95, -0.02, -0.3);",
      lyric=dict(lines=['a great and gloomy', 'The Lord said to Abram'], plane="standing(inView(from, 0, 0.58, 12), from, 0.72, 2.6)"))
scene('know', 42, 'Night has come: Abram sits in the dark, faint stars returning over the pieces.',
      U(NIGHT, uPiecesOn=1, uFigOn=1, uFigSit=1, uFig=[2.8, 0, 0.6], uFigYaw=-1.9, uStarGain=0.6), dict(pos=[-3, 3.5, 9], target=[1, 0.5, 0], fov=44), dict(pos=[-1, 4.2, 10], target=[1, 0.4, 0], fov=44),
      exposure=1.7,
      lyric=dict(lines=['Know for certain', 'your seed will be strangers'], plane="standing(inView(from, 0, 0.55, 20), from, 0.74, 2.4)"))
scene('strangers', 44, 'Far off at dusk, Egypt: pyramids on the horizon, and a line of far lamps that are not at home.',
      U(SUNSET, uDusk=0.9, uNight=0.3, uSunDir=[-0.95, 0.01, 0.1], uSunCol=[2.5, 1.0, 0.4], uSkyline=2, uSkyAz=0.1, uHills=0.3), dict(pos=[0, 1.4, 0], target=[-60, 2.2, 6], fov=34), dict(pos=[0, 1.6, 0], target=[-60, 2.4, -6], fov=34),
      exposure=1.2, lamps='[' + ', '.join(f'[{-38 + i*0.9:.1f}, 0.6, {-4 + i*1.6:.1f}, 0.5]' for i in range(8)) + ']',
      lyric=dict(lines=['in a land not their own', 'They will be enslaved'], plane="standing(inView(from, 0, -0.55, 40), from, 0.74, 2.4)"), hold='two lines of the same exile, one image of Egypt')
scene('four-hundred', 46, 'Years pass over Egypt: the sun runs across the sky again and again above the pyramids.',
      U(NOON, uSkyline=2, uSkyAz=0.0, uHills=0.3, uHaze=0.0025), dict(pos=[0, 1.6, 0], target=[-60, 3, 0], fov=40), dict(pos=[0, 1.8, 0], target=[-60, 4, -4], fov=40),
      exposure=1.0,
      update="const a = (t - P.from) * 2.2; const s = Math.sin(a), c = Math.cos(a); u.uSunDir.value.set(-0.3, 0.12 + 0.55 * Math.abs(s), -0.8 * c); u.uNight.value = 0.0; u.uDusk.value = 0.35 + 0.5 * (1 - Math.abs(s));",
      lyric=dict(lines=['for four hundred years', 'I will judge the nation'], plane="standing(inView(from, 0, -0.5, 30), from, 0.76, 2.4)", ink='30, 20, 12',
                 extra="(ctx, t, H) => { const y = Math.min(400, Math.floor(400 * ease.inOut3((t - P.from) / (P.to - P.from - 0.8)))); gauge(ctx, `YEAR ${y}`, 1920, H * 0.86, { size: 64, alpha: 0.9, ink: '30, 20, 12' }); }"))
scene('come-forth', 48, 'Night in the desert: a long column of lamps comes out towards us, carrying much.',
      U(NIGHT, uHills=0.8), dict(pos=[3, 2.2, 14], target=[-2, 0.5, -10], fov=40), dict(pos=[2, 1.8, 10], target=[-2, 0.6, -10], fov=40),
      exposure=1.8, lamps='[' + ', '.join(f'[{-3 + i*0.15:.2f}, 1.0, {-30 + i*3.2:.1f}, 0.9]' for i in range(8)) + ']',
      update="for (let i = 0; i < 8; i++) { u.uL.value[i * 3 + 2] = -30 + i * 3.2 + (t - P.from) * 1.6; u.uL.value[i * 3] = -3 + i * 0.15 + Math.sin(i * 1.7) * 0.6; }",
      lyric=dict(lines=['Afterward they will come', 'with great possessions'], plane="standing(inView(from, 0, 0.55, 26), from, 0.72, 2.6)"))
scene('peace', 50, 'Evening under the oak: an old man\'s rest, quiet light through the leaves.',
      U(AFTERNOON, uDusk=0.6, uSunDir=[-0.8, 0.1, -0.3], uSunCol=[4.0, 2.4, 1.2], uOakOn=1, uOak=[0, 0, 0], uFigOn=1, uFigSit=1, uFig=[1.4, 0, 1.2], uFigYaw=0.8), dict(pos=[9, 1.6, 10], target=[0, 2.6, 0], fov=40), dict(pos=[7, 1.4, 11], target=[0, 2.8, 0], fov=40),
      exposure=1.05,
      lyric=dict(lines=['You will go to your fathers', 'nourished in a good'], plane="standing(inView(from, 0, -0.58, 14), from, 0.74, 2.6)"))
scene('fourth-gen', 52, 'Dusk: four lamps are lit one after another along the ground, the four generations.',
      U(SUNSET, uDusk=0.8, uNight=0.45, uSunDisc=0, uSunDir=[-0.95, -0.01, -0.3], uSunCol=[0.9, 0.4, 0.2]), dict(pos=[-4, 0.8, 4.5], target=[0, 0.4, 0], fov=40), dict(pos=[4, 0.8, 4.8], target=[0.5, 0.4, 0], fov=40),
      exposure=1.4, lamps='[[-2.4, 0.25, 0, 0], [-0.8, 0.25, 0, 0], [0.8, 0.25, 0, 0], [2.4, 0.25, 0, 0]]',
      update="for (let i = 0; i < 4; i++) u.uLI.value[i] = 2.0 * ease.out3((t - P.from - 0.6 - i * 1.15) / 0.5);",
      lyric=dict(lines=['In the fourth generation'], plane="standing(inView(from, 0, 0.5, 9), from, 0.72, 3)"))
scene('amorites', 53, 'The Amorites\' walled hill under the moon, its lamps lit: their measure not yet full.',
      U(NIGHT, uSkyline=3, uSkyAz=0.0, uCityLamps=1, uHills=0.4, uStarGain=0.7), dict(pos=[0, 1.6, 30], target=[0, 3, -100], fov=30), dict(pos=[0, 1.6, 20], target=[0, 3.5, -100], fov=30),
      exposure=1.7, hold='the line ends and the instrumental turns toward the fire; the city waits',
      lyric=dict(lines=['for the Amorites'], plane="standing(inView(from, 0, -0.5, 40), from, 0.7, 3)"))

# ---------------- Verse 3: the fire between the pieces ----------------
scene('flame', 54, 'Full dark. In the black between the rows, a flame appears: a smoking furnace and a lamp of fire.',
      U(NIGHT, uStarGain=0.5, uSunCol=[0.04, 0.05, 0.09], uPiecesOn=1, uFire=[0, 0, -3.2], uTorch=[0.3, 1.3, -4.6]), dict(pos=[0, 1.2, 9], target=[0, 0.8, -2], fov=38), dict(pos=[0, 1.1, 7], target=[0, 0.9, -2.5], fov=38),
      exposure=1.5, update="u.uFireOn.value = t > P.from + 1.0 ? 1 : 0; u.uTorchOn.value = t > P.from + 3.4 ? 1 : 0; u.uSmoke.value = ease.inOut3((t - P.from - 1.0) / 2.0);",
      lyric=dict(lines=['As the sun went down', 'a smoking furnace'], plane="standing(inView(from, 0, 0.6, 14), from, 0.74, 2.6)"), samples=16)
scene('passed', 56, 'The furnace and the lamp pass down the path between the pieces, toward us, and on.',
      U(NIGHT, uStarGain=0.6, uSunCol=[0.04, 0.05, 0.09], uPiecesOn=1, uFireOn=1, uTorchOn=1), dict(pos=[0, 1.6, 8.5], target=[0, 0.8, 0], fov=40), dict(pos=[4.5, 2.6, 7.5], target=[0, 1.0, 1.5], fov=40),
      exposure=1.5, hold='the fire passes the whole length of the pieces as the covenant is made',
      update="const z = -3.2 + 8.5 * ease.inOut3(x(t)); u.uFire.value.set(0, 0, z); u.uTorch.value.set(0.25, 1.25, z - 1.4);",
      lyric=dict(lines=['passed between', 'That day the Lord made'], plane="standing(inView(from, 0, 0.6, 16), from, 0.76, 2.4)"), samples=16)

# ---------------- The grant and the peoples ----------------
scene('descendants', 58, 'Morning over the promised land from high above, the sun up, the hills going on and on.',
      U(MORNING, uHills=1.5), dict(pos=[0, 30, 0], target=[80, 4, -120], fov=48), dict(pos=[10, 34, -10], target=[100, 2, -130], fov=48),
      exposure=1.0,
      lyric=dict(lines=['“To your descendants'], plane="standing(inView(from, 0, -0.5, 80), from, 0.76, 3)", ink='34, 22, 14'))
scene('rivers', 59, 'Sweeping west to east across the land: Egypt\'s pyramids at one edge of the world.',
      U(MORNING, uSkyline=2, uSkyAz=0.0, uHills=0.7), dict(pos=[0, 8, 0], target=[-60, 2, -40], fov=46), dict(pos=[0, 9, 0], target=[60, 2, -40], fov=46),
      exposure=1.0,
      lyric=dict(lines=['from Egypt’s river'], plane="standing(inView(from, 0, -0.55, 60), from, 0.8, 3)", ink='34, 22, 14'))
scene('kenites', 60, 'The peoples of the land: a walled hill town in the morning haze.',
      U(MORNING, uSkyline=3, uSkyAz=0.15, uHills=0.5), dict(pos=[0, 2, 0], target=[-20, 3, -100], fov=32), dict(pos=[3, 2.2, -3], target=[-10, 3.2, -100], fov=32),
      exposure=1.0,
      lyric=dict(lines=['“The Kenites', 'and the Kedmoneans'], plane="standing(inView(from, 0, -0.5, 50), from, 0.74, 2.6)", ink='34, 22, 14'))
scene('chettites', 62, 'Ridge after ridge in the noon light, a town on each skyline.',
      U(NOON, uSkyline=3, uSkyAz=-0.15, uHills=0.6), dict(pos=[0, 6, 0], target=[-40, 2, -90], fov=40), dict(pos=[-4, 6.5, -6], target=[-50, 3, -90], fov=40),
      exposure=0.95,
      lyric=dict(lines=['the Chettites', 'and the Raphaim'], plane="standing(inView(from, 0, -0.52, 50), from, 0.74, 2.6)", ink='30, 20, 12'))
scene('amorites-list', 64, 'A quick sweep along a ridge line in the afternoon.',
      U(AFTERNOON, uSkyline=3, uSkyAz=0.2, uHills=0.6), dict(pos=[0, 3, 0], target=[60, 3, -80], fov=38), dict(pos=[2, 3.2, -4], target=[30, 3, -90], fov=38),
      exposure=1.0,
      lyric=dict(lines=['the Amorites, the Chananites'], plane="standing(inView(from, 0, -0.5, 45), from, 0.76, 3)", ink='30, 20, 12'))
scene('evites', 65, 'Evening: lamps come on in the towns on the far hills.',
      U(SUNSET, uDusk=0.7, uNight=0.4, uSunDisc=0, uSunDir=[-0.95, 0.005, -0.3], uSunCol=[1.6, 0.7, 0.3], uSkyline=3, uSkyAz=-0.1, uCityLamps=1, uHills=0.5), dict(pos=[0, 2, 0], target=[0, 3, -100], fov=34), dict(pos=[0, 3.2, -6], target=[6, 3, -100], fov=34),
      exposure=1.3,
      lyric=dict(lines=['the Evites'], plane="standing(inView(from, 0, -0.5, 40), from, 0.7, 3)"))
scene('jebusites', 66, 'Before dawn, the hill of the Jebusites, and above it the promise star once more.',
      U(DAWN, uSkyline=3, uSkyAz=0.0, uCityLamps=0.6, uHills=0.5, uSunDir=[0.95, -0.02, -0.3]), dict(pos=[0, 1.4, 20], target=[0, 4, -100], fov=30), dict(pos=[0, 1.6, 10], target=[0, 6, -100], fov=30),
      exposure=1.5, lamps='[[0, 300, -900, 3.0]]',
      lyric=dict(lines=['and the Jebusites'], plane="standing(inView(from, 0, -0.5, 40), from, 0.7, 3)"), hold='the last name and the instrumental after it')
scene('night-again', '272s', 'Night returns over the land: Abram small on a hill, the stars turning gold again one by one.',
      U(NIGHT, uFigOn=1, uFig=[0, 0, 0], uFigYaw=3.14, uFigLook=1, uStarGain=1.4, uMilky=1.2, uHills=1.2), dict(pos=[-6, 0.5, -16], target=[0, 5, 8], fov=56), dict(pos=[-4, 0.6, -14], target=[0, 7, 8], fov=56),
      exposure=1.9, update="u.uCount.value = 0.6 * ease.inOut3(x(t));",
      lyric=dict(lines=[], plane="standing(inView(from, 0, -0.5, 40), from, 0.6, 3)", gauge='GENESIS 15:5'), hold='the outro: the stars return')
scene('end', '281s', 'The tent and the whole counted sky; the camera rises slowly as the last fifth hangs.',
      U(NIGHT, uTentOn=1, uCount=0.6, uStarGain=1.4, uMilky=1.2), dict(pos=[-8, 1.2, 14], target=[0, 3, -10], fov=50), dict(pos=[-8, 3.5, 16], target=[0, 7, -10], fov=50),
      exposure=1.9, lamps=f'[{TENTLAMP}, {PROMISE}]', update="u.uCount.value = 0.6 + 0.4 * ease.inOut3(x(t)); u.uExp.value = 1.0 - 0.9 * ease.inOut3((t - P.to + 2.5) / 2.5);",
      lyric=dict(lines=[], plane="standing(inView(from, 0, 0.05, 40), from, 0.9, 3)", gauge=False, end=True), hold='the last held chord')


# ---------------- revisions after the first review stills ----------------
def redo(slug, **kw):
    s = next(x for x in S if x['slug'] == slug)
    for k, v in kw.items():
        if k == 'U': s['uniforms'].update(v)
        elif k == 'lyric': s['lyric'].update(v)
        else: s[k] = v
lo = lambda sy, dist, frac=0.72, aspect=2.6: f"standing(inView(from, 0, {sy}, {dist}), from, {frac}, {aspect})"
redo('camp', A=dict(pos=[-8, 0.35, 15], target=[0, 1.6, 0], fov=38), B=dict(pos=[-5, 0.35, 11], target=[0, 1.7, 0], fov=38), lamps=f'[{TENTLAMP}, {FIRE}, {PROMISE}]', exposure=2.0)
redo('vision', lamps=f'[{TENTLAMP}, {FIRE}, {PROMISE}]', update="u.uLI.value[0] = 4.5 + 5.0 * ease.inOut3((t - P.from - 0.5) / 3.0);",
     A=dict(pos=[1.6, 0.5, 8.5], target=[0, 1.2, 0], fov=36), B=dict(pos=[0.8, 0.5, 6.6], target=[0, 1.3, 0], fov=36), exposure=2.0)
redo('door', lamps=f'[{TENTLAMP}, [0.2, 1.4, -0.3, 3.0], [3.0, 0.2, 5.0, 2.4]]', A=dict(pos=[-4.0, 0.45, 8], target=[0.6, 1.4, 2], fov=34), B=dict(pos=[-2.9, 0.45, 6.8], target=[0.6, 1.45, 2], fov=34), exposure=2.0)
redo('childless', lamps='[[2.4, 0.15, 3.0, 4.0], [0.3, 0.45, 0.5, 2.6]]', A=dict(pos=[7.0, 0.8, 8.0], target=[2.6, 0.9, 3], fov=36), B=dict(pos=[6.0, 0.7, 7.2], target=[2.5, 0.9, 3], fov=36), exposure=2.0)
redo('heir', A=dict(pos=[-14, 0.4, 14], target=[0, 1.6, 0], fov=34), B=dict(pos=[-9, 0.4, 14.5], target=[0, 1.6, 0], fov=34), lamps='[[0.4, 0.45, 0.5, 4.5], [-7, 0.3, -6, 1.6], [6, 0.3, -9, 1.4]]', exposure=2.0)
redo('inherit', A=dict(pos=[1.6, 0.6, 3.4], target=[-6, 1.6, -6], fov=36), B=dict(pos=[2.4, 0.6, 3.0], target=[-7, 1.6, -6.5], fov=36), lamps='[[-9.6, 0.45, -7.6, 4.0], [1.5, 0.2, 1.5, 1.6]]', exposure=2.0)
redo('voice', lyric=dict(plane=lo(-0.25, 30)), B=dict(pos=[-6, 0.8, 12], target=[-2, 5.5, -10], fov=44))
redo('not-heir', lamps=f'[{TENTLAMP}, [-60, 90, -200, 5], [2.6, 0.3, 4.6, 2.0]]', A=dict(pos=[3.2, 0.3, 6.5], target=[0.2, 1.7, 0], fov=40), B=dict(pos=[2.4, 0.3, 5.6], target=[0.0, 2.1, 0], fov=40), exposure=2.0, lyric=dict(plane=lo(0.5, 22, 0.72, 2.2)))
redo('outside', lyric=dict(plane=lo(0.5, 24)), U=dict(uFig=[1.4, 0, 7.5], uHills=0.25), A=dict(pos=[3.4, 0.25, 3.6], target=[1.3, 2.2, 12], fov=46), B=dict(pos=[2.4, 0.25, 3.2], target=[1.1, 2.8, 12], fov=46), lamps=f'[{TENTLAMP}, [1.0, 0.25, 4.2, 1.4]]')
redo('count', U=dict(uHills=0.25), A=dict(pos=[0.5, 0.35, -2.6], target=[0, 1.8, 4], fov=50), B=dict(pos=[0.5, 0.35, -2.6], target=[0.2, 6.5, 6], fov=50))
redo('children', U=dict(uHills=0.2), A=dict(pos=[-2.2, 0.3, -9], target=[0, 3, 8], fov=56), B=dict(pos=[-1.2, 0.3, -7.5], target=[0, 4.5, 8], fov=56))
redo('believed', U=dict(uHills=0.25), A=dict(pos=[1.8, 0.5, -3.2], target=[0, 1.9, 0], fov=38), B=dict(pos=[1.3, 0.45, -2.5], target=[0, 2.0, 0], fov=38), lyric=dict(plane=lo(-0.42, 10, 0.8)))
redo('chaldeans', U=dict(uSkyAz=0.0), A=dict(pos=[-7, 1.0, 3.0], target=[30, 1.6, -6], fov=34), B=dict(pos=[-6.2, 1.1, 2.2], target=[30, 1.9, -8], fov=34))
redo('how-know', lyric=dict(plane=lo(-0.45, 18)))
redo('heifer', lyric=dict(plane=lo(-0.55, 14, 0.8, 2.0)))
redo('ram', lyric=dict(plane=lo(-0.55, 12, 0.8, 2.4)))
redo('cut', U=dict(**AFTERNOON), A=dict(pos=[0.4, 1.6, 9.5], target=[0, 0.4, 0], fov=36), B=dict(pos=[-0.4, 2.4, 8.0], target=[0, 0.3, 0], fov=36), lyric=dict(plane=lo(0.55, 14)))
redo('sat', lyric=dict(plane=lo(-0.55, 14)))
redo('terror', lyric=dict(plane=lo(0.45, 12)), exposure=1.5)
redo('know', U=dict(uStarGain=0.8, uHills=0.25), A=dict(pos=[6.5, 0.3, 3.2], target=[2.8, 1.0, 0.6], fov=40), B=dict(pos=[5.8, 0.3, 2.4], target=[2.8, 1.1, 0.6], fov=40), exposure=2.0)
redo('strangers', lamps='[' + ', '.join(f'[{-24 + i*0.9:.1f}, 0.6, {-2 + i*1.2:.1f}, 0.8]' for i in range(8)) + ']')
redo('four-hundred', exposure=0.85)
redo('fourth-gen', lyric=dict(plane=lo(0.4, 20)), A=dict(pos=[-2.5, 0.8, 4.5], target=[0, 0.4, 0], fov=40), B=dict(pos=[2.5, 0.8, 4.8], target=[0.5, 0.4, 0], fov=40))
redo('passed', lyric=dict(plane=lo(0.55, 16)))
redo('amorites', A=dict(pos=[0, 1.0, 30], target=[0, 3, -100], fov=30), B=dict(pos=[0, 1.0, 20], target=[0, 3.5, -100], fov=30))
redo('night-again', U=dict(uHills=0.2), A=dict(pos=[-4, 0.3, -12], target=[0, 4, 8], fov=56), B=dict(pos=[-3, 0.3, -10], target=[0, 5.5, 8], fov=56))
redo('end', A=dict(pos=[-8, 0.4, 14], target=[0, 3, -10], fov=50), B=dict(pos=[-8, 2.5, 16], target=[0, 6, -10], fov=50), lamps=f'[{TENTLAMP}, {FIRE}, {PROMISE}]')
redo('chettites', lyric=dict(plane=lo(-0.5, 50, 0.62)))
redo('amorites-list', lyric=dict(plane=lo(-0.45, 45, 0.6, 3)), B=dict(pos=[1, 3.1, -2], target=[45, 3, -85], fov=38))
redo('fourth-gen', lyric=dict(plane=lo(0.35, 12, 0.66, 3)), A=dict(pos=[-1.5, 0.8, 4.6], target=[0, 0.4, 0], fov=40), B=dict(pos=[1.5, 0.8, 4.8], target=[0.3, 0.4, 0], fov=40))
redo('passed', lyric=dict(plane="standing(inView(from, -0.08, 0.55, 16), from, 0.62, 2.4)"))
redo('rivers', A=dict(pos=[0, 8, 0], target=[-60, 2, -40], fov=46), B=dict(pos=[0, 9, 0], target=[-5, 2, -70], fov=46), lyric=dict(plane=lo(-0.4, 60, 0.7, 3)))
redo('come-forth', lyric=dict(plane=lo(0.45, 26)))
redo('fourth-gen', A=dict(pos=[-0.6, 0.8, 4.6], target=[0, 0.5, 0], fov=40), B=dict(pos=[0.6, 0.75, 4.2], target=[0.1, 0.5, 0], fov=40))
redo('rivers', B=dict(pos=[0, 9, 0], target=[-45, 2, -50], fov=46), lyric=dict(anchorAt=0.6, plane=lo(-0.4, 60, 0.6, 3)))

# ---------------- cleanup round 1 (3-panel critic, 2026-11-22 night) ----------------
DAYSHADE = 0.85
redo('camp', A=dict(pos=[-6, 0.35, 10.5], target=[0, 1.5, 0], fov=38), B=dict(pos=[-4.2, 0.35, 8.0], target=[0, 1.6, 0], fov=38))
redo('childless', lamps='[[2.4, 0.25, 3.0, 7.0], [0.3, 0.45, 0.5, 3.0]]', A=dict(pos=[5.5, 0.6, 1.5], target=[2.9, 0.9, 3.4], fov=36), B=dict(pos=[5.2, 0.55, 2.3], target=[2.9, 0.95, 3.5], fov=36))
redo('heir', A=dict(pos=[-9, 0.4, 9], target=[0, 1.5, 0], fov=34), B=dict(pos=[-6.5, 0.4, 9.5], target=[0, 1.5, 0], fov=34))
redo('inherit', A=dict(pos=[3.6, 0.7, 5.2], target=[-6, 1.4, -6], fov=36), B=dict(pos=[4.2, 0.7, 4.6], target=[-7, 1.4, -6.5], fov=36), lyric=dict(plane=lo(0.5, 20)))
redo('voice', lyric=dict(anchorAt=0.5, plane=lo(0.3, 30)))
redo('not-heir', U=dict(uFig=[0.6, 0, 3.2], uFigYaw=3.0), A=dict(pos=[1.6, 0.9, 6.8], target=[-0.4, 2.6, -2], fov=42), B=dict(pos=[1.3, 0.85, 6.2], target=[-0.6, 3.2, -2], fov=42), lamps=f'[[0.5, 0.9, 0.4, 7.0], [-60, 90, -200, 5]]', lyric=dict(plane=lo(0.55, 22, 0.66, 2.2)))
redo('outside', lyric=dict(plane=lo(0.55, 24)))
redo('count', A=dict(pos=[0.6, 0.3, -2.2], target=[0, 1.7, 4], fov=52), B=dict(pos=[0.6, 0.3, -2.2], target=[0.1, 4.2, 5], fov=52), U=dict(uStarGain=1.8), lyric=dict(anchorAt=0.7, plane=lo(0.45, 30, 0.7, 2.4)))
redo('children', U=dict(uStarGain=1.8), A=dict(pos=[-1.0, 0.25, -4.5], target=[0, 2.4, 8], fov=56), B=dict(pos=[-0.6, 0.25, -3.8], target=[0, 3.5, 8], fov=56), lyric=dict(plane=lo(0.5, 40)))
redo('believed', A=dict(pos=[1.4, 0.35, -2.6], target=[0, 1.9, 0], fov=40), B=dict(pos=[1.1, 0.35, -2.2], target=[0, 2.0, 0], fov=40), lamps='[[-6, 14, 18, 4]]', lyric=dict(plane="standing(inView(from, -0.45, 0.5, 10), from, 0.5, 2.4)"))
redo('chaldeans', lyric=dict(plane="standing(inView(from, -0.35, -0.5, 30), from, 0.55, 2.4)"))
redo('land', U=dict(uSunDir=[0.9, 0.06, -0.4], uSunCol=[5.0, 3.0, 1.4], uDusk=0.55), A=dict(pos=[0, 2, 0], target=[50, 3, -40], fov=46), B=dict(pos=[0, 16, 4], target=[70, 1, -50], fov=46), lyric=dict(shade=DAYSHADE, plane=lo(-0.45, 60)))
redo('how-know', A=dict(pos=[-3.4, 1.5, -2.6], target=[22, 0.5, 20], fov=40), B=dict(pos=[-3.8, 1.6, -1.0], target=[24, 0.3, 18], fov=40), lyric=dict(shade=DAYSHADE, plane="standing(inView(from, 0.42, -0.45, 18), from, 0.45, 2.2)"))
redo('heifer', lyric=dict(shade=DAYSHADE, plane=lo(-0.42, 14, 0.75, 2.0)), U=dict(uAnim=[0.2, 0, 0]))
redo('ram', U=dict(uBirdR=3, uBirdC=[0, 3.8, -5]), lyric=dict(shade=DAYSHADE, plane=lo(0.5, 12, 0.75, 2.4)))
redo('cut', lyric=dict(shade=DAYSHADE, plane=lo(0.62, 14, 0.7)))
redo('birds', lyric=dict(shade=DAYSHADE, plane=lo(-0.55, 20, 0.7, 2.6)))
redo('sat', lyric=dict(shade=DAYSHADE, plane="standing(inView(from, -0.3, -0.42, 14), from, 0.55, 2.6)"))
redo('strangers', lyric=dict(plane=lo(-0.45, 40, 0.68, 2.4)))
redo('four-hundred', exposure=0.62, U=dict(uSunCol=[4.6, 3.6, 2.4]), lyric=dict(shade=DAYSHADE))
redo('peace', A=dict(pos=[7, 1.0, 7], target=[0.6, 1.8, 0.6], fov=40), B=dict(pos=[5.8, 0.9, 7.6], target=[0.6, 1.9, 0.6], fov=40))
redo('amorites', U=dict(uCityLamps=1.6, uSunCol=[0.35, 0.42, 0.66]), A=dict(pos=[0, 1.0, 16], target=[0, 3.5, -100], fov=26), B=dict(pos=[0, 1.0, 8], target=[0, 4, -100], fov=26))
redo('passed', lyric=dict(plane="standing(inView(from, 0, 0.55, 16), from, 0.55, 2.4)"))
redo('descendants', U=dict(uSunDir=[0.85, 0.12, -0.5], uSunCol=[5.0, 3.6, 2.0], uDusk=0.45), A=dict(pos=[0, 30, 0], target=[90, 6, -100], fov=48), B=dict(pos=[10, 34, -10], target=[110, 4, -110], fov=48), lyric=dict(shade=DAYSHADE))
redo('rivers', U=dict(uDusk=0.4, uSunCol=[5.0, 3.8, 2.4]), A=dict(pos=[0, 9, 0], target=[-60, 2, -30], fov=46), B=dict(pos=[0, 10, 0], target=[-25, 2, -60], fov=46), lyric=dict(shade=DAYSHADE))
redo('kenites', A=dict(pos=[0, 2, 0], target=[-20, 3, -100], fov=24), B=dict(pos=[3, 2.2, -12], target=[-14, 3.4, -100], fov=22), lyric=dict(shade=DAYSHADE))
redo('chettites', exposure=0.62, U=dict(uSunCol=[4.6, 3.8, 2.6], uDusk=0.3), lyric=dict(shade=DAYSHADE))
redo('amorites-list', A=dict(pos=[-15, 3, 0], target=[20, 3, -90], fov=38), B=dict(pos=[15, 3.2, -4], target=[35, 3, -90], fov=38), lyric=dict(shade=DAYSHADE, anchorAt=0.5))
redo('evites', U=dict(uCityLamps=2.0, uNight=0.55))
redo('jebusites', U=dict(uNight=0.75, uDusk=0.35, uStars=0.6, uSunCol=[0.4, 0.4, 0.6]), lamps='[[0, 140, -900, 3.0]]', A=dict(pos=[0, 0.8, 20], target=[0, 6, -100], fov=30), B=dict(pos=[0, 1.0, 10], target=[0, 8, -100], fov=30))
redo('night-again', A=dict(pos=[-2.2, 0.25, -6], target=[0, 3, 8], fov=52), B=dict(pos=[-1.6, 0.25, -5], target=[0, 4, 8], fov=52), lyric=dict(gauge=False))
redo('end', A=dict(pos=[-6, 0.4, 10.5], target=[0, 3, -10], fov=50), B=dict(pos=[-6, 2.2, 12], target=[0, 6, -10], fov=50))

# ---------------- cleanup round 2 ----------------
redo('childless', A=dict(pos=[7.5, 0.7, 1.0], target=[2.6, 0.8, 3.3], fov=36), B=dict(pos=[7.0, 0.65, 1.8], target=[2.6, 0.85, 3.4], fov=36))
redo('believed', lyric=dict(plane="standing(inView(from, -0.4, 0.5, 10), from, 0.62, 2.4)"))
redo('land', lyric=dict(plane=lo(-0.45, 60, 0.82)))
redo('how-know', lyric=dict(plane="standing(inView(from, 0.4, -0.45, 18), from, 0.58, 2.2)"))
redo('rivers', lyric=dict(plane=lo(-0.4, 60, 0.8, 3)))
redo('passed', lyric=dict(plane="standing(inView(from, 0, 0.55, 16), from, 0.68, 2.4)"))
redo('four-hundred', U=dict(uDusk=0.4))
redo('amorites', A=dict(pos=[0, 1.0, 16], target=[0, 3.0, -100], fov=16), B=dict(pos=[0, 1.0, 8], target=[0, 3.4, -100], fov=16), lyric=dict(plane=lo(-0.5, 40, 0.75, 3)))
redo('descendants', lyric=dict(plane=lo(-0.5, 80, 0.82, 3)))
redo('childless', A=dict(pos=[6.8, 0.6, 7.0], target=[2.4, 0.8, 3.2], fov=36), B=dict(pos=[6.2, 0.55, 7.4], target=[2.4, 0.85, 3.2], fov=36))
redo('believed', lyric=dict(plane="standing(inView(from, -0.22, 0.5, 10), from, 0.6, 2.4)"))
for x in S:
    if x['uniforms'].get('uSkyline'):
        x['uniforms']['uHills'] = min(x['uniforms'].get('uHills', 1), 0.15)
        import math
        a, b = x['A']['pos'], x['A']['target']
        x['uniforms']['uSkyAz'] = round(math.atan2(b[0] - a[0], b[2] - a[2]) + x['uniforms'].get('uSkyAz', 0), 4)

# ---------------- write ----------------
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(os.path.join(R, 'scenes'), exist_ok=True)
js = lambda v: json.dumps(v)

def scene_js(i, s):
    name = f"s{i:02d}-{s['slug']}"
    uni = ', '.join(f"{k}: {js(v)}" for k, v in s['uniforms'].items())
    return name, f"""// {i:02d} · {s['about']}
import {{ WORLD_GLSL, WORLD_UNIFORMS, cam, setLamps, keys, ease }} from '/song/lib/world.js';
import {{ grade }} from '/song/lib/look.js';

const A = {js(s['A'])};
const B = {js(s['B'])};
const LAMPS = {s['lamps']};

export default (P) => {{
  const x = (t) => Math.min(1, Math.max(0, (t - P.from) / (P.to - P.from)));
  return {{
    name: '{name}', from: P.from, to: P.to,
    frag: WORLD_GLSL + `vec3 shade(vec2 fc) {{ return world(fc); }}`,
    uniforms: {{ ...WORLD_UNIFORMS, uL: new Array(24).fill(0), uLI: new Array(8).fill(0), {uni} }},
    camera: (t) => cam(P, t, A, B),
    update(t, u) {{
      setLamps(u, LAMPS);
      {s['update']}
    }},
    post: (t) => grade(t, {{ exposure: {s['exposure']} }}),
  }};
}};
"""

def lyric_js(name, s):
    L = s['lyric']
    opts = [f"lines: {js(L['lines'])}", f"plane: (from) => {L['plane']}"]
    if 'ink' in L: opts.append(f"ink: '{L['ink']}', gaugeInk: '{L['ink']}'")
    if 'shade' in L: opts.append(f"shade: {L['shade']}")
    if 'anchorAt' in L: opts.append(f"anchorAt: {L['anchorAt']}")
    if 'gauge' in L: opts.append(f"gauge: {js(L['gauge'])}")
    if 'extra' in L: opts.append(f"extra: {L['extra']}")
    if L.get('title'):
        opts.append("gauge: false, extra: (ctx, t, H) => { titleCard(ctx, H, ease.inOut3((t - P.from - 0.4) / 1.2), ease.inOut3((t - P.from - 1.6) / 1.8), 1 - ease.inOut3((t - P.to + 1.0) / 0.9)); }")
    if L.get('end'):
        opts.append("extra: (ctx, t, H) => { titleCard(ctx, H, ease.inOut3((t - P.to + 7.5) / 1.2), ease.inOut3((t - P.to + 7.0) / 1.8), 1 - ease.inOut3((t - P.to + 1.6) / 1.4)); }")
    return f"""// The words of {name}, drawn as their own layer on a plane placed in its world.
import scene from '/song/scenes/{name}.js';
import {{ layer, standing, lying, inView, gauge, titleCard, ease }} from '/song/lib/type.js';

export default (P) => layer(P, scene(P), {{
  {(',' + chr(10) + '  ').join(opts)},
}});
"""

plan = {'title': 'Under the Stars (Genesis 15)', 'fps': 60, 'tier': 'ultra', 'samples': 8, 'scenes': []}
for f in os.listdir(os.path.join(R, 'scenes')):
    if f.startswith('s') and f[1:3].isdigit(): os.remove(os.path.join(R, 'scenes', f))
for i, s in enumerate(S):
    name, code = scene_js(i, s)
    open(os.path.join(R, 'scenes', name + '.js'), 'w').write(code)
    open(os.path.join(R, 'scenes', name + '.lyric.js'), 'w').write(lyric_js(name, s))
    e = {'at': s['at'], 'slug': s['slug'], 'screen': s['about'], 'purpose': s['about'], 'leaves': 'cut on the beat', 'carries': 'the land and the sky of one world',
         'words': 'on a plane placed in the scene, lit to match', 'overlay': '2026-11-23: overlay lyrics like Genesis 8 / Salt and Light'}
    if s['hold']: e['hold'] = s['hold']
    plan['scenes'].append(e)
os.makedirs(os.path.join(R, 'docs'), exist_ok=True)
json.dump(plan, open(os.path.join(R, 'docs', 'plan.json'), 'w'), indent=1)
os.chdir(R)
r = subprocess.run(['python3', 'tools/plan.py'], capture_output=True, text=True)
print(r.stdout, r.stderr)
film = json.load(open('film.json'))
film['samples'] = 8
film['samplePreset'] = 'dove'
film['lyric'] = {'haloSpread': 9, 'shade': 0.6}
film['gates'] = {'maxCameraOnlySeconds': 1e9, 'restFraction': 0}
film['optOuts'] = {'live': '2026-11-23: Genesis 8 way, live gate off for this film', 'rest-to-rest': '2026-11-23: Genesis 8 way, rest-to-rest warning off for this film'}
for sc, s in zip(film['scenes'], S):
    if s['samples']: sc['samples'] = s['samples']
json.dump(film, open('film.json', 'w'), indent=1)
print(len(S), 'scenes written')
