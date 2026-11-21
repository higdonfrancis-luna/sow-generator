"""Audit of Nov 21 2026, step 3: write the refreshed Adobe quotes into the files the build reads. Run once, from the repository root:

    python3 audit_2026-11-21/tools/apply_quotes.py <folder with the saved pages>

It reads audit_2026-11-21/data/quote_picks.json: for each service or connection quote that was not on its page (or was never stored), a sentence
that is on the cited page today, picked by one reader, checked by a second, and proved here once more with found() before anything is written.

  services with a stale quote   the line's own "evidence" in its canvas/research/*.json file, edited as text (some of those files do not round-trip)
  the three Commerce copies     canvas/research/commerce_2026-11-12/commerce_services.json, which test_step85.js compares with the catalog
  connection quotes             canvas/research/connection_types.json
  13 outside-system services    an "evidence" key in canvas/research/outside_step45.json
  46 statement-of-work services canvas/live_evidence.json, which canvas/build.py reads (their definitions live in index.html, which holds no quotes)

Then build (python3 canvas/build.py, python3 build_site.py) and run verify_quotes.py again.
"""
import glob, hashlib, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(os.path.dirname(HERE)); PAGES = os.path.abspath(sys.argv[1])
sys.path.insert(0, os.path.join(REPO, 'handoff', '2026-11-17', 'evidence_page', 'tools'))
from verify import found  # noqa: E402

R = lambda *p: os.path.join(REPO, *p)
picks = json.load(open(os.path.join(os.path.dirname(HERE), 'data', 'quote_picks.json'), encoding='utf-8'))
cat = json.load(open(R('canvas', 'catalog.json'), encoding='utf-8'))
page = lambda u: os.path.join(PAGES, hashlib.sha1(u.split('#')[0].encode()).hexdigest()[:12] + '.html')
SHIPS_CHANGED = re.compile(r'[–—]|\bbeta\b|early access|early adopter|limited availability|limited release|coming soon', re.I)   # the build rewrites these, so a quote holding one would stop matching

services = {p['id']: p for p in picks['picks'] if p['kind'] == 'service'}
connections = [p for p in picks['picks'] if p['kind'] == 'connection']
for p in picks['picks']:
    assert found(p['quote'], page(p['url'])), ('not on its page', p['key'])
    assert not SHIPS_CHANGED.search(p['quote']), ('the build would rewrite it', p['key'])
for sid, p in services.items():
    assert cat['lines'][sid]['url'] == p['url'], ('picked from another page than the service cites', sid)

# 1. services whose stored quote went stale: the line-level "evidence" in the research file that holds the line
stale = {sid: p for sid, p in services.items() if p['old_quote']}
done = set()
for path in sorted(glob.glob(R('canvas', 'research', '*.json'))):
    if os.path.basename(path).startswith(('connection_types', 'audit_classification', 'outside_systems')):
        continue
    rows = open(path, encoding='utf-8').read().split('\n')
    changed = False
    for i, row in enumerate(rows):
        m = re.search(r'"id": "([A-Za-z0-9-]+)"', row)
        if not m or m.group(1) not in stale:
            continue
        sid = m.group(1)
        for j in range(i + 1, min(i + 40, len(rows))):   # the line's own evidence is the first one after its id (some files write a line over several rows)
            if re.search(r'"id": "', rows[j]):
                break
            e = re.match(r'^(\s*)"evidence": (".*"),?\s*$', rows[j])
            if e:
                held = json.loads(e.group(2))
                assert held in (stale[sid]['old_quote'], stale[sid]['quote']), (sid, 'the file holds another quote than the audit read')
                rows[j] = e.group(1) + '"evidence": ' + json.dumps(stale[sid]['quote'], ensure_ascii=False) + (',' if rows[j].rstrip().endswith(',') else '')
                assert sid not in done, (sid, 'found twice')
                done.add(sid); changed = changed or held != stale[sid]['quote']
                break
    if changed:
        open(path, 'w', encoding='utf-8').write('\n'.join(rows))
assert done == set(stale), sorted(set(stale) - done)

# 2. the copies test_step85.js compares with the catalog
path = R('canvas', 'research', 'commerce_2026-11-12', 'commerce_services.json')
copies = json.load(open(path, encoding='utf-8'))
for sid in sorted(set(copies['services']) & set(stale)):
    assert copies['services'][sid]['evidence'] in (stale[sid]['old_quote'], stale[sid]['quote']), sid
    copies['services'][sid]['evidence'] = stale[sid]['quote']
open(path, 'w', encoding='utf-8').write(json.dumps(copies, indent=1, ensure_ascii=False))

# 3. connection quotes, in the order the audit read them
path = R('canvas', 'research', 'connection_types.json')
types = json.load(open(path, encoding='utf-8'))
for p in sorted(connections, key=lambda p: p['row']):
    hits = [e for e in types['connections'][p['id']]['evidence'] if e.get('url') == p['url'] and e.get('quote') == p['old_quote']]
    assert hits or any(e.get('quote') == p['quote'] for e in types['connections'][p['id']]['evidence']), ('no such quote on the connection', p['key'])
    if hits:
        hits[0]['quote'] = p['quote']
open(path, 'w', encoding='utf-8').write(json.dumps(types, indent=1, ensure_ascii=False) + '\n')

# 4. the outside-system services researched on Nov 4, which never had a quote
path = R('canvas', 'research', 'outside_step45.json')
outside = json.load(open(path, encoding='utf-8'))
added = set()
for owner in outside.get('products', []) + outside.get('connections', []):
    for line in owner.get('lines', []):
        if line['id'] in services and not services[line['id']]['old_quote']:
            assert line.get('evidence') in (None, '', services[line['id']]['quote']), line['id']
            line['evidence'] = services[line['id']]['quote']; added.add(line['id'])
open(path, 'w', encoding='utf-8').write(json.dumps(outside, indent=1, ensure_ascii=False) + '\n')

# 5. the statement-of-work services, whose definitions live in index.html
live = {sid: {'url': p['url'], 'quote': p['quote']} for sid, p in sorted(services.items()) if not p['old_quote'] and sid not in added}
assert all(cat['lines'][sid]['origin'] == 'sow' for sid in live), [sid for sid in live if cat['lines'][sid]['origin'] != 'sow']
note = ('Nov 21 2026: one Adobe sentence, word for word, from the page each statement-of-work service cites. These services are defined in index.html, '
        'which holds no quotes, so canvas/build.py reads them from here. Each was matched on its page with found() (audit_2026-11-21). The quote is never shown on screen.')
with open(R('canvas', 'live_evidence.json'), 'w', encoding='utf-8') as f:
    json.dump({'_note': note, 'services': live}, f, indent=1, ensure_ascii=False)
    f.write('\n')
print(len(done), 'stale service quotes replaced;', len(connections), 'connection quotes replaced;', len(added), 'outside-system quotes added;', len(live), 'statement-of-work quotes written')
