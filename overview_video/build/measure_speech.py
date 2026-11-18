"""Measure where the narrator is speaking in each narration clip: speech start, speech end and pauses.

    python3 build/measure_speech.py [out.json]        (run from the video folder)

Reads audio/<id>.wav for every scene in script.json and writes
audio/speech.json (or out.json). make_timeline.py uses these to place the clips and time
the captions.
"""
import json
import sys
import wave

import numpy as np


def measure(path):
    with wave.open(path) as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    if ch > 1:
        x = x.reshape(-1, ch).mean(1)
    hop = int(sr * 0.01)
    fr = len(x) // hop
    db = 20 * np.log10(np.sqrt((x[:fr * hop].reshape(fr, hop) ** 2).mean(1) + 1e-12))
    voiced = db > db.max() - 38
    idx = np.where(voiced)[0]
    pauses, i = [], idx[0]
    while i < idx[-1]:
        if voiced[i]:
            i += 1
            continue
        j = i
        while j < idx[-1] and not voiced[j]:
            j += 1
        if (j - i) * 0.01 >= 0.12:
            pauses.append([round(i * 0.01, 2), round(j * 0.01, 2)])
        i = j
    return {'dur': round(len(x) / sr, 3), 'on': round(idx[0] * 0.01, 2), 'off': round((idx[-1] + 1) * 0.01, 2),
            'pauses': pauses, 'sr': sr, 'ch': ch, 'sw': sw}


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'audio/speech.json'
    ids = [s['id'] for f in ('script.json',) for s in json.load(open(f, encoding='utf-8'))['scenes']]
    res = {sid: measure(f'audio/{sid}.wav') for sid in ids}
    json.dump(res, open(out, 'w', encoding='utf-8'), indent=1)
    for sid, r in res.items():
        print(f"{sid:<10} {r['dur']:6.2f} s, speech {r['on']:.2f}-{r['off']:.2f}, {len(r['pauses'])} pauses")


if __name__ == '__main__':
    main()
