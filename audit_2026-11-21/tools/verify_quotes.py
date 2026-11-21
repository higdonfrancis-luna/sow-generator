"""Audit of Nov 21 2026, step 2: match every stored Adobe quote against the page it cites, word for word, with the project's
own matcher (handoff/2026-11-17/evidence_page/tools/verify.py, found()). Run fetch_all.py first.

    python3 audit_2026-11-21/tools/verify_quotes.py <folder with the saved pages>

Writes audit_2026-11-21/data/quote_check.json:
  services     every service's quote (canvas/catalog.json, lines[].evidence) against lines[].url
  references   quotes on a service's supporting references
  connections  every connection's evidence quotes (canvas/research/connection_types.json)
A quote that is not found gets a diagnosis: the longest run of the quote that is on the page, the share of its words the page
holds, and whether the address now redirects. Nothing in the tool is changed.
"""
import json, sys, os, re, hashlib, difflib

HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(HERE)); PAGES = os.path.abspath(sys.argv[1])
sys.path.insert(0, os.path.join(REPO, 'handoff', '2026-11-17', 'evidence_page', 'tools'))
from verify import found, page_text, page_text_spaced, norm  # noqa: E402

cat = json.load(open(os.path.join(REPO, 'canvas', 'catalog.json'), encoding='utf-8'))
types = json.load(open(os.path.join(REPO, 'canvas', 'research', 'connection_types.json'), encoding='utf-8'))
log = json.load(open(os.path.join(os.path.dirname(HERE), 'data', 'link_check.json'), encoding='utf-8'))
P = {p['id']: p for p in cat['products']}
fn = lambda u: os.path.join(PAGES, hashlib.sha1(u.split('#')[0].encode()).hexdigest()[:12] + '.html')
status = lambda u: log.get(u, {}).get('status')

owner = {}
for p in cat['products']:
    for l in p['lines'] + p.get('more', []):
        owner[l] = p['name']
for c in cat['connections']:
    for l in c.get('lines', []) + c.get('more', []):
        owner[l] = P[c['a']]['name'] + ' + ' + P[c['b']]['name']


def diagnose(url, quote):
    """why a quote is not on its page: how much of it is there, and whether the page moved"""
    text, q = page_text_spaced(fn(url)), norm(quote)
    m = difflib.SequenceMatcher(None, text, q, autojunk=False).find_longest_match(0, len(text), 0, len(q))
    words = re.findall(r"[A-Za-z']{4,}", q)
    lower = text.lower()
    flat = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower())
    final = log[url].get('final', '')
    return {'page_title': page_text(fn(url))[1], 'longest_run': text[m.a:m.a + m.size].strip(), 'run_share': round(m.size / max(1, len(q)), 2),
            'word_share': round(sum(1 for w in words if w.lower() in lower) / max(1, len(words)), 2),
            # the same words, differing only in capitals, punctuation or an invisible character: the sentence is still there
            'same_words': flat(q.rstrip('.')) in flat(re.sub(r'[​‌‍﻿]', '', text)),
            'redirected_to': final if final.split('#')[0].rstrip('/') != url.split('#')[0].rstrip('/') else ''}


out = {'services': [], 'references': [], 'connections': []}
for lid, l in cat['lines'].items():
    row = {'id': lid, 'name': l['name'], 'on': owner[lid], 'url': l['url']}
    if not l.get('evidence'):
        row['result'] = 'no stored quote'
    elif status(l['url']) != '200':
        row.update(result='not checkable', why=log.get(l['url'], {}).get('why', status(l['url'])))
    elif found(l['evidence'], fn(l['url'])):
        row['result'] = 'found'
    else:
        row.update(result='not found', quote=l['evidence'], **diagnose(l['url'], l['evidence']))
    out['services'].append(row)
    for r in l.get('references') or []:
        if r.get('quote'):
            ok = status(r['url']) == '200'
            out['references'].append({'id': lid, 'url': r['url'], 'result': ('found' if found(r['quote'], fn(r['url'])) else 'not found') if ok else 'not checkable'})
for cid, t in types['connections'].items():
    for e in t.get('evidence') or []:
        row = {'id': cid, 'url': e.get('url')}
        if not e.get('quote') or status(e.get('url')) != '200':
            row['result'] = 'not checkable'
        elif found(e['quote'], fn(e['url'])):
            row['result'] = 'found'
        else:
            row.update(result='not found', quote=e['quote'], **diagnose(e['url'], e['quote']))
        out['connections'].append(row)

count = lambda rows: {k: sum(1 for r in rows if r['result'] == k) for k in sorted({r['result'] for r in rows})}
out['counts'] = {k: count(v) for k, v in out.items()}
with open(os.path.join(os.path.dirname(HERE), 'data', 'quote_check.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=1, ensure_ascii=False)
    f.write('\n')
print(json.dumps(out['counts'], indent=1))
for r in out['services']:
    if r['result'] == 'not found':
        print(('SAME WORDS ' if r['same_words'] else 'REWORDED   ') + r['id'], '|', r['name'], '|', r['on'])
