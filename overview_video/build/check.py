"""Checks for the overview video. Run from the overview_video folder:

    python3 build/check.py [path to the tool's repository folder]

With the repository path, the numbers said and shown in the video are compared with the tool's own data
(canvas/catalog.json and the built first page). Ends with ALL VIDEO CHECKS PASSED or the count of failures.
"""
import json
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image

NAME = 'SOW_Generator_and_RFI_Builder_First_Look'
fails = 0


def check(ok, text):
    global fails
    print(('✅ ' if ok else '❌ ') + text)
    fails += 0 if ok else 1


def probe(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,r_frame_rate', '-of', 'json', path],
                       capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def loudness(path):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True, check=True)
    return json.loads(r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}') + 1])


def frame(path, t):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', path, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'],
                         capture_output=True, check=True).stdout
    import io
    return np.asarray(Image.open(io.BytesIO(raw)).convert('RGB')).astype(int)


def main():
    repo = sys.argv[1] if len(sys.argv) > 1 else None
    script = json.load(open('script.json', encoding='utf-8'))
    tl = json.load(open('build/timeline.json', encoding='utf-8'))
    words = json.load(open('audio/words.json', encoding='utf-8'))
    anim = open('anim/anim.js', encoding='utf-8').read()
    full, web, srt = f'out/{NAME}.mp4', f'out/{NAME}_web.mp4', f'out/{NAME}.srt'

    # the files
    for f in (full, web, srt):
        check(os.path.exists(f), f'{f} exists')
    for f in (full, web):
        p = probe(f)
        v = [s for s in p['streams'] if s['codec_name'] == 'h264'][0]
        dur = float(p['format']['duration'])
        check(abs(dur - tl['duration']) < 0.15, f'{f}: {dur:.2f} s, the timeline says {tl["duration"]:.2f} s')
        check((v['width'], v['height'], v['r_frame_rate']) == (1920, 1080, '30/1'), f'{f}: 1920 x 1080 at 30 frames a second')
        check(any(s['codec_name'] == 'aac' for s in p['streams']), f'{f}: has an AAC soundtrack')
        m = loudness(f)
        check(abs(float(m['input_i']) + 16) <= 0.5 and float(m['input_tp']) <= -1.0, f'{f}: loudness {m["input_i"]} LUFS (target -16), true peak {m["input_tp"]} dBTP')
    check(60 <= tl['duration'] <= 95, f'length is {int(tl["duration"] // 60)}:{int(tl["duration"] % 60):02d}, between 1:00 and 1:35')
    check(os.path.getsize(web) < 10e6, f'the web copy is {os.path.getsize(web) / 1e6:.1f} MB, under 10 MB')

    # narration and captions
    spoken = ' '.join(s['text'] for s in script['scenes'])
    caps = ' '.join(c['text'] for c in tl['captions'])
    check(spoken == caps, f'the captions carry every spoken word in order ({len(spoken.split())} words)')
    check(all(len(c['text']) <= 64 for c in tl['captions']), 'no caption is longer than 64 characters')
    check(all(a['t1'] <= b['t0'] + 1e-6 for a, b in zip(tl['captions'], tl['captions'][1:])), 'captions never overlap')
    check(open(srt, encoding='utf-8').read() == open('captions.srt', encoding='utf-8').read(), 'the .srt beside the video is the current captions')
    check(all(len(words[s['id']]) == len(s['text'].split()) for s in script['scenes']), 'every word of every recording was found and timed')
    check(all(os.path.exists(f"audio/{s['id']}.mp3") and os.path.exists(f"audio/{s['id']}.wav") for s in script['scenes']), 'all seven recordings are saved (MP3 as the worker returned them, and WAV)')
    check(script['voice'] == 'echo' and script['model'] == 'tts-1-hd', 'the voice is Echo (tts-1-hd)')
    name = 'Statement of Work Generator and RFI Builder'
    check(sum(name in s['text'] for s in script['scenes']) == 2, f'"{name}" is said at the start and at the close')
    for part in ('Statement of Work Generator', 'RFI Builder'):
        check(all(part in c['text'] for c in tl['captions'] if any(w in c['text'] for w in part.split()[-1:]) and part.split()[-1] in ('Generator', 'Builder')),
              f'"{part}" is never split across two captions')
    check('R F I' not in caps, 'captions say RFI, not the spelled-out reading for the voice')
    for label, text in (('script', json.dumps(script, ensure_ascii=False)), ('animation', anim), ('captions', caps)):
        check(chr(0x2014) not in text and chr(0x2013) not in text, f'no em or en dashes in the {label}')

    # the numbers
    rects = json.load(open('shots/rects.json', encoding='utf-8'))
    fees = rects['canvas']['feesText']
    for n in ('$487,200', '$271,200', '$18,000'):
        check(n in fees and n in anim, f'{n} on screen is the tool\'s own figure at $150 an hour')
    check('13 selected services' in fees and '13 services' in anim, 'the 13 services in the example match the tool')
    check(rects['rfi']['foundText'].startswith('retail_rfi.docx: 8 questions found. 5 about Adobe products'), 'the RFI screen is the tool answering the sample retail RFI')
    if repo:
        cat = json.load(open(os.path.join(repo, 'canvas/catalog.json'), encoding='utf-8'))
        page = open(os.path.join(repo, 'site/index.html'), encoding='utf-8').read()
        check(len(cat['connections']) == 162 and 'One hundred sixty-two connections' in spoken and '[162,' in anim, f'162 connections: the catalog has {len(cat["connections"])}')
        check(len(cat['lines']) == 569 and 'Five hundred sixty-nine services' in spoken and '[569,' in anim, f'569 services: the catalog has {len(cat["lines"])}')
        # the first page counts the catalog's Adobe products, with AEM Sites and its Edge Delivery form as one
        adobe = [p for p in cat['products'] if not p.get('outside')]
        shown = len(adobe) - (1 if {'aemsites', 'eds'} <= {p['id'] for p in adobe} else 0)
        check(shown == 33 and 'products to choose from' in page and 'Thirty-three products' in spoken and '[33,' in anim,
              f'33 products: the first page offers {shown} to choose from')
    else:
        print('   (no repository path given: the 33, 162 and 569 were not compared with the tool)')

    # the picture: every scene has content, the red bar is there, and the captions area is drawn while someone speaks
    for s in tl['scenes']:
        t = (s['at'] + s['speechEnd']) / 2
        f = frame(full, t)
        bar = f[100:980, 2:16].reshape(-1, 3).mean(0)
        body = f[190:910, 96:1830]
        cap = f[944:1000, 300:1620]
        check(bar[0] > 200 and bar[1] < 60 and bar[2] < 40, f'{s["id"]} at {t:.1f} s: the red bar is drawn')
        check(body.std() > 25 and (body < 200).any(-1).mean() > 0.03, f'{s["id"]} at {t:.1f} s: the scene has content')
        check((cap < 120).all(-1).mean() > 0.01, f'{s["id"]} at {t:.1f} s: a caption is on screen')
    end = frame(full, tl['duration'] - 0.5)
    check((end[1020:1060, 1400:1830] < 120).all(-1).mean() > 0.01, 'the closing frame carries the Firefly credit')

    print('\nALL VIDEO CHECKS PASSED' if not fails else f'\n{fails} CHECK(S) FAILED')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
