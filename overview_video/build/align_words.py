"""Find when every word of the narration is spoken, so captions and animation beats can be
timed to the words themselves.

    python3 build/align_words.py        (run from the video folder)

Reads script.json and audio/<scene>.wav and writes audio/words.json:
{scene id: [[word, start, end], ...]} in seconds from the start of that scene's clip.
Uses PocketSphinx forced alignment (pip install --break-system-packages pocketsphinx).
Re-run it after re-recording any line, then run make_timeline.py.
"""
import json
import re
import subprocess

from pocketsphinx import Decoder

# How the aligner should hear words that are not in its dictionary, or that are read as letters.
SPELL = {'chatgpt': 'chat g p t', 'cja': 'c j a', 'aem': 'a e m', "aem's": 'a e m s', 'ai': 'a i', 'cdn': 'c d n',
         'html': 'h t m l', '100': 'one hundred', '140': 'one hundred forty', '26': 'twenty six', '95': 'ninety five', 'javascript': 'java script', 'lighthouse': 'light house',
         'cloudfront': 'cloud front', 'on-prem': 'on prem', 'non-adobe': 'non adobe', 'adobe-managed': 'adobe managed',
         'fastly': 'fast lee', 'akamai': 'aka my', 'seo': 's e o', 'faqs': 'f a q s', 'faq': 'f a q', 'ai-ready': 'a i ready', 'off-site': 'off site', 'sign-off': 'sign off', 'high-value': 'high value', 'cross-sell': 'cross sell',
         'metadata': 'meta data', 'sitemaps': 'site maps', 'roundups': 'round ups', 'cx': 'c x', 'kpis': 'k p i s',
         'rfi': 'r f i', 'thirty-three': 'thirty three', 'sixty-two': 'sixty two', 'sixty-nine': 'sixty nine', 'ready-made': 'ready made', 'first-year': 'first year'}
LETTERS = {'IT': 'i t'}       # capitalized words read letter by letter
EXTRA = {'prem': 'P R EH M', 'lee': 'L IY', 'aka': 'AA K AH', 'cloudflare': 'K L AW D F L EH R',
         'perplexity': 'P ER P L EH K S AH T IY', 'storefronts': 'S T AO R F R AH N T S',
         'pipelines': 'P AY P L AY N Z', 'optimizer': 'AA P T AH M AY Z ER', 'crawlers': 'K R AO L ER Z',
         'redirects': 'R IY D ER EH K T S', "concierge's": 'K AA N S IY EH R ZH IH Z', 'figma': 'F IH G M AH', 'lovesac': 'L AH V S AE K'}


def tokens(word):
    bare = re.sub(r"[^\w'\-]", '', word)
    if bare in LETTERS:
        return LETTERS[bare].split()
    low = bare.lower()
    return SPELL.get(low, low).split()


def align(wav, text):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-ar', '16000', '-ac', '1', '-f', 's16le', '-'],
                         check=True, capture_output=True).stdout
    words = text.split()
    toks, owner = [], []
    for i, w in enumerate(words):
        for t in tokens(w):
            toks.append(t)
            owner.append(i)
    d = Decoder(samprate=16000, bestpath=False, beam=1e-120, wbeam=1e-100, pbeam=1e-120, lpbeam=1e-100, lponlybeam=1e-100)
    for k, v in EXTRA.items():
        if d.lookup_word(k) is None:
            d.add_word(k, v, True)
    missing = sorted({t for t in toks if d.lookup_word(t) is None})
    if missing:
        raise SystemExit(f'add these to SPELL or EXTRA: {missing}')
    d.set_align_text(' '.join(toks))
    d.start_utt()
    d.process_raw(raw, full_utt=True)
    d.end_utt()
    segs = [(re.sub(r'\(\d+\)$', '', s.word), s.start_frame / 100, (s.end_frame + 1) / 100)
            for s in d.seg() if s.word not in ('<s>', '</s>', '<sil>', '(NULL)')]
    if [w for w, _, _ in segs] != toks:
        raise SystemExit(f'alignment failed for {wav}')
    out = []
    for i, w in enumerate(words):
        mine = [s for s, o in zip(segs, owner) if o == i]
        out.append([w, round(mine[0][1], 2), round(mine[-1][2], 2)])
    return out


def main():
    script = json.load(open('script.json', encoding='utf-8'))
    res = {}
    for s in script['scenes']:
        # a 'say' that only spells out what SPELL already spells (AEM read as "A E M") aligns against 'text' as it is
        if 'say' in s and [t for w in s['say'].split() for t in tokens(w)] != [t for w in s['text'].split() for t in tokens(w)]:
            raise SystemExit(f"{s['id']} has a respelled 'say'; align against what the voice says and map it back to 'text'")
        res[s['id']] = align(f"audio/{s['id']}.wav", s['text'])
        print(f"{s['id']:<10} {len(res[s['id']]):3d} words, {res[s['id']][0][1]:.2f}-{res[s['id']][-1][2]:.2f} s")
    json.dump(res, open('audio/words.json', 'w', encoding='utf-8'), indent=1)


if __name__ == '__main__':
    main()
