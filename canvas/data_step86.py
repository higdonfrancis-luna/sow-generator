"""Step 86 (Nov 12 2026): the catalog reads as though everything is available. Adam: "Anything that is in beta or early
access or will be released on this day or next next day leave those alone they're going to come ... publish every
connection every feature every functionality as though it's available and don't provide any caveats", and, of sentences
like "where Adobe has enabled that feature" and "once Adobe confirms in writing": "why would we write that I would strip
those and go".

What goes: wording that a feature's availability is not stated, uncertain or to be confirmed with Adobe; work made
conditional on Adobe enabling or granting something; release stages and programs (and "Generally available."); Adobe's
industry restrictions on Coworker; "Adobe documents ..." framing. What stays: licenses, packages and add-ons the client
must own, technical prerequisites, real limits of a product, and the partner's and client's own project work.

The whole text of each changed field, before and after, is sow/plain_2026-11-12/rewrites.json (145 connections, 17
researched services, 22 play services). This script files it where the build reads it:

1. plain_rules.json: the connections and researched services, applied last by product_copy.plain().
2. sow/index.html and `replacements` in product_copy_rules.json: the 22 play services. Each changed text is set in the
   page's CATALOG, and its old and new wording join the replacement pairs the page applies when a saved draft opens, so a
   draft holding the old sentence takes the new one and is not shown as "Scope edited" (as in step 58).
3. canvas/problems.json: two notes under the first page's client problems said the same things (confirm with Adobe;
   Coworker and health care or finance).

Run once from the repo root, then canvas/patch_step86.py, then rebuild:

    python3 sow/canvas/data_step86.py && python3 sow/canvas/patch_step86.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
load = lambda path: json.load(open(path, encoding='utf-8'))

rec = load(os.path.join(SOW, 'plain_2026-11-12', 'rewrites.json'))
rules_path = os.path.join(SOW, 'product_copy_rules.json')
rules = load(rules_path)
plain_path = os.path.join(SOW, 'plain_rules.json')
assert not os.path.exists(plain_path), 'step 86 is already applied'

# ---- 1. connections and researched services: whole fields, applied last ----
FIELD = {'gain_title': 'gain.title', 'gain_text': 'gain.text', 'flows_what': 'flows'}
plain = {
    'connections': {cid: {FIELD.get(f, f): v for f, v in fields.items()} for cid, fields in rec['connections'].items()},
    'lines': rec['services'],
}

# ---- 2. play services: the template in the page, and a replacement pair so a saved draft follows ----
page_path = os.path.join(SOW, 'index.html')
page = open(page_path, encoding='utf-8').read()
match = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', page, re.S)
catalog = json.loads(match.group(1))
assert json.dumps(catalog, ensure_ascii=False) == match.group(1), 'the page no longer stores CATALOG as plain JSON'
by_id = {t['id']: t for t in catalog}
known = {tuple(p) for p in rules['replacements']}


def pairs(holder, key, before, after, out):
    if isinstance(before, dict):
        assert set(before) == set(after), key
        for k in before:
            pairs(holder[key], k, before[k], after[k], out)
    elif before != after:
        assert isinstance(before, str) and after and holder[key] == before, key
        holder[key] = after
        out.append([before, after])


count = 0
for tid, fields in rec['play_services'].items():
    found = []
    for f, v in fields.items():
        pairs(by_id[tid], f, v['before'], v['after'], found)
    for pair in found:
        assert tuple(pair) not in known
        rules['replacements'].append(pair)
        count += 1
page = page[:match.start(1)] + json.dumps(catalog, ensure_ascii=False) + page[match.end(1):]
open(page_path, 'w', encoding='utf-8').write(page)
# ---- 3. two notes on the first page's client problems ----
prob_path = os.path.join(HERE, 'problems.json')
probs = load(prob_path)
NOTES = {
    ('fsi-complex-questions', 'My client licenses CJA'): ("Confirm with Adobe that the concierge conversation data can be used in your client's CJA. Brand Visibility's CJA source needs CDN logs, so the CDN belongs on the canvas.",
                                                          "Brand Visibility's CJA source needs CDN logs, so the CDN belongs on the canvas."),
    ('team-busywork', 'My client runs Workfront'): ('Adobe says Coworker in Workfront is not currently available to health care, finance or other organizations with sensitive data; confirm eligibility with Adobe.', ''),
}
done = 0
for q in probs['problems']:
    for r in q['refine']:
        rule = NOTES.get((q['id'], r['chip']))
        if rule:
            assert r.get('note') == rule[0], (q['id'], r['chip'])
            if rule[1]:
                r['note'] = rule[1]
            else:
                del r['note']
            done += 1
assert done == len(NOTES)
open(plain_path, 'w', encoding='utf-8').write(json.dumps(plain, indent=1, ensure_ascii=False) + '\n')
open(rules_path, 'w', encoding='utf-8').write(json.dumps(rules, indent=2, ensure_ascii=False) + '\n')
open(prob_path, 'w', encoding='utf-8').write(json.dumps(probs, indent=1, ensure_ascii=True) + '\n')
print('step 86 data applied:', len(plain['connections']), 'connections,', len(plain['lines']), 'researched services,', count, 'texts on', len(rec['play_services']), 'play services', 'and', done, 'first-page notes')
