"""OpenAI TTS client through WARROOM's warroom-assistant worker.
The worker holds the OpenAI API key; nothing secret lives here.

    python3 openai_client.py tts  <script.json> <out_dir> [scene_id ...]

script.json: {"voice": "echo", "model": "tts-1-hd", "scenes": [{"id": "s00", "text": "..."}, ...]}
A scene's optional "say" is what the voice reads when a word needs respelling (the captions
keep "text"), for example "Chat G P T" so the voice spells out the letters.
"""
import json
import os
import sys

import requests

WORKER = 'https://warroom-assistant.adam-d1a.workers.dev'
TIMEOUT = 60


def tts(text, voice='echo', model='tts-1-hd', speed=1.0, out_path='out.mp3'):
    """Call OpenAI TTS through the worker. Returns audio bytes directly as MP3."""
    r = requests.post(
        WORKER + '/openai/tts',
        json={'text': text, 'voice': voice, 'model': model, 'speed': speed},
        timeout=TIMEOUT,
    )
    r.raise_for_status()

    # Worker returns raw MP3 bytes
    with open(out_path, 'wb') as f:
        f.write(r.content)
    return len(r.content)


def main():
    mode = sys.argv[1]
    if mode == 'tts':
        script = json.load(open(sys.argv[2], encoding='utf-8'))
        out_dir = sys.argv[3]
        only = set(sys.argv[4:])
        os.makedirs(out_dir, exist_ok=True)

        voice = script.get('voice', 'echo')
        model = script.get('model', 'tts-1-hd')
        speed = script.get('speed', 1.0)

        for s in script['scenes']:
            if only and s['id'] not in only:
                continue
            out = os.path.join(out_dir, s['id'] + '.mp3')
            n = tts(s.get('say', s['text']), voice=voice, model=model, speed=speed, out_path=out)
            print(f"{s['id']}: {n} bytes -> {out}")
    else:
        sys.exit('mode must be tts')


if __name__ == '__main__':
    main()
