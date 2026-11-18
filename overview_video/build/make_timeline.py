"""Build the timeline for the overview video from the measured recordings.

    python3 build/make_timeline.py        (run from the overview_video folder)

Reads script.json, audio/speech.json (measure_speech.py) and audio/words.json (align_words.py).
Writes build/timeline.json, build/timeline.js (window.TIMELINE for the animation) and captions.srt.
Every time inside a scene is measured from that scene's recording, so re-recording one line
only moves that scene and the ones after it.
"""
import json
import re

FPS = 30
LEAD = 1.0                      # picture before the first word
# quiet time after each line, while the screen finishes what the line described
HOLD = {'s1_intro': 1.0, 's2_play': 1.3, 's3_connect': 1.5, 's4_scale': 1.1, 's5_money': 2.2, 's6_sow': 1.5, 's7_close': 4.6}
MAX_CAPTION = 64                # characters on one caption line
KEEP_TOGETHER = ('Statement of Work Generator', 'RFI Builder', 'statement of work')   # never split across two captions


def balanced(ws):
    """Split one sentence into caption lines of even length, at a comma when one is near the middle."""
    text = ' '.join(x[0] for x in ws)
    if len(text) <= MAX_CAPTION:
        return [ws]
    best, cut = None, None
    for i in range(1, len(ws)):
        left = ' '.join(x[0] for x in ws[:i])
        right = ' '.join(x[0] for x in ws[i:])
        score = abs(len(left) - len(right)) - (24 if ws[i - 1][0].endswith(',') else 0)
        if any(k in text and k not in left and k not in right for k in KEEP_TOGETHER):
            score += 40
        if best is None or score < best:
            best, cut = score, i
    return balanced(ws[:cut]) + balanced(ws[cut:])


def chunks(words):
    """Captions: one per sentence, and a long sentence split into even lines."""
    out, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r'[.?!:]$', w[0]):
            out += balanced(cur)
            cur = []
    if cur:
        out += balanced(cur)
    return out


def stamp(t):
    ms = int(round(t * 1000))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


def main():
    script = json.load(open('script.json', encoding='utf-8'))
    speech = json.load(open('audio/speech.json', encoding='utf-8'))
    words = json.load(open('audio/words.json', encoding='utf-8'))
    t = LEAD
    scenes, audio, spoken, captions = [], [], [], []
    for s in script['scenes']:
        sid = s['id']
        sp = speech[sid]
        w = [[x[0], round(t + x[1], 3), round(t + x[2], 3)] for x in words[sid]]
        end = t + sp['off']
        scenes.append({'id': sid, 'at': round(t, 3), 'speechEnd': round(end, 3), 'end': round(end + HOLD[sid], 3), 'words': w})
        audio.append({'file': f'audio/{sid}.wav', 'from': 0, 'to': sp['dur'], 'at': round(t, 3)})
        spoken.append([round(t + sp['on'], 3), round(end, 3)])
        cs = chunks(w)
        for i, c in enumerate(cs):
            t0 = c[0][1]
            t1 = cs[i + 1][0][1] if i + 1 < len(cs) else end + 0.35
            captions.append({'t0': round(t0, 3), 't1': round(t1, 3), 'text': ' '.join(x[0] for x in c)})
        t = end + HOLD[sid]
    duration = round(t, 3)
    frames = int(round(duration * FPS))
    by = {s['id']: s for s in scenes}
    tl = {'fps': FPS, 'duration': frames / FPS, 'frames': frames, 'scenes': scenes, 'audio': audio, 'speech': spoken,
          'captions': captions,
          'music': {'grooveOn': by['s2_play']['at'], 'liftAt': by['s7_close']['at']}}
    json.dump(tl, open('build/timeline.json', 'w', encoding='utf-8'), indent=1)
    open('build/timeline.js', 'w', encoding='utf-8').write('window.TIMELINE = ' + json.dumps(tl) + ';\n')
    with open('captions.srt', 'w', encoding='utf-8') as f:
        for i, c in enumerate(captions, 1):
            f.write(f"{i}\n{stamp(c['t0'])} --> {stamp(c['t1'])}\n{c['text']}\n\n")
    print(f"{duration:.2f} s, {frames} frames, {len(captions)} captions")
    for s in scenes:
        print(f"  {s['id']:<11} {s['at']:6.2f} to {s['end']:6.2f}")
    for c in captions:
        print(f"  {c['t0']:6.2f} {c['text']}")


if __name__ == '__main__':
    main()
