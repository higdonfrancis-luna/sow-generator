"""Step 71 (the Marketo family): puts the opening sentences and quotes for Marketo Qualifier and Marketo Optimizer into the
RFI Builder's knowledge base, the way step 69 did for the other products.

    python3 sow/rfp_prototype/step71_research/merge.py            (from the repo root; safe to run again)
    python3 sow/build_site.py

Each research file in this folder ({"facts": [...], "explain": [...], "cautions": [...]}, checked by ../step67_research/verify.py)
gives: its quotes to part3_research/explain.json (under the product's name, status "verified"), its pages' titles to
part3_research/statements.json ("titles"), and its sentences to the end of statements.json ("explain"). A sentence already
there (same text) is not added twice. The cautions stay in the research files: what a partner must not promise is already
on the catalog's cards and reaches the partner's note from there.
"""
import glob, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
PART3 = os.path.join(HERE, '..', 'part3_research')
SOW = os.path.join(HERE, '..', '..')
names = {p['id']: p['name'] for p in json.load(open(os.path.join(SOW, 'canvas', 'catalog.json'), encoding='utf-8'))['products']}


def load(path):
    raw = open(path, encoding='utf-8').read()
    return json.loads(raw), '\\u' in raw


def save(path, data, ascii_only):
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=1, ensure_ascii=ascii_only) + '\n')


explain, e_ascii = load(os.path.join(PART3, 'explain.json'))
state, s_ascii = load(os.path.join(PART3, 'statements.json'))
BANNED = re.compile(r'\b(?:beta|trial|legacy|paid|limited availability|maintenance mode|co-innovation|early access|preview|coming soon|not yet|is planned|will be available)\b|[–—]', re.I)
VOICE = re.compile(r'\b(?:the client|your client|the partner)\b', re.I)
added_f = added_s = 0
for path in sorted(glob.glob(os.path.join(HERE, '*.json'))):
    d = json.load(open(path, encoding='utf-8'))
    quotes = {}
    for f in d['facts']:
        assert f['product'] in names, (path, f['product'])
        group = explain['products'].setdefault(names[f['product']], {'facts': []})
        quotes.setdefault(f['product'], []).append(f['quote'])
        if not any(x['quote'] == f['quote'] and x['url'] == f['url'] for x in group['facts']):
            group['facts'].append({'claim': f['supports'], 'quote': f['quote'], 'url': f['url'], 'updated': f.get('updated', ''), 'status': 'verified'})
            added_f += 1
        state['titles'].setdefault(f['url'], f['title'])
    for e in d['explain']:
        assert e['for'] and all(i in names for i in e['for']) and e.get('text') and e.get('q'), (path, e)
        assert (e.get('kind') in ('what', 'role')) != bool(e.get('when')), (path, e['text'][:60])
        assert not BANNED.search(e['text']) and not VOICE.search(e['text']) and len(e['text'].split()) <= 45, (path, e['text'])
        mine = [q for i in e['for'] for q in quotes.get(i, [])]
        assert all(len(q) >= 25 and any(q in full for full in mine) for q in e['q']), (path, e['text'][:60])
        if not any(x.get('text') == e['text'] for x in state['explain']):
            state['explain'].append({k: e[k] for k in ('for', 'kind', 'when', 'text', 'confirm', 'q') if k in e})
            added_s += 1
save(os.path.join(PART3, 'explain.json'), explain, e_ascii)
save(os.path.join(PART3, 'statements.json'), state, s_ascii)
print('merged: ' + str(added_f) + ' quotes and ' + str(added_s) + ' sentences added; the knowledge base holds ' + str(len(state['explain'])) + ' explain entries')
