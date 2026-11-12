#!/usr/bin/env python3
"""Read an Adobe page as it is served now, and look for words on it. Run from the repo root:

    python3 sow/qa/review_pack/page_text.py URL                       # status, final address, length
    python3 sow/qa/review_pack/page_text.py URL --find "exact quote"  # is the quote there word for word? (repeatable)
    python3 sow/qa/review_pack/page_text.py URL --grep "word"         # every passage around a word (repeatable)
    python3 sow/qa/review_pack/page_text.py URL --dump                # the whole text

The text is lower-cased with tags stripped and spacing collapsed; curly quotes and dashes are made plain.
"""
import re
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import fetch, has, norm

a = sys.argv[1:]
if not a:
    print(__doc__)
    sys.exit(0)
p = fetch(a[0])
print(f"status {p['status']} | final address {p['final']} | {len(p['text'])} characters" + (' | BLOCKED HOST: not read' if p['blocked'] else ''))
i = 1
while i < len(a):
    if a[i] == '--find':
        print(('FOUND    ' if has(p['text'], a[i + 1]) else 'NOT FOUND') + ' | ' + a[i + 1])
        i += 2
    elif a[i] == '--grep':
        w = norm(a[i + 1])
        hits = [m.start() for m in re.finditer(re.escape(w), p['text'])]
        print(f'{len(hits)} passages with "{w}"')
        for h in hits[:12]:
            print('  ...' + p['text'][max(0, h - 220):h + 320] + '...')
        i += 2
    elif a[i] == '--dump':
        print(p['text'])
        i += 1
    else:
        i += 1
