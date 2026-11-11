"""Step 71 (Nov 11 2026): the Marketo family. Adam, Nov 10: "should we add these two products?" (Adobe Marketo Qualifier and
Adobe Marketo Optimizer), "go" on the research, then "looks great, yes" to sow/mockups/nov10_wave4/wave4_cards.png and the
five recommendations in canvas/research/expansion_2026-11-10/wave4/WAVE4_PROPOSAL.md (Marketo Optimizer added with no
release label in anything a partner or client reads; Marketo Qualifier + Brand Concierge kept; Coworker shown as a
connection; a Marketo Engage subscription first on Optimizer's card; no line between the two).

1. research/wave4_*.json: the two research files, as build.py reads them.
2. catalog_map.json: the two products get a name and a place on Create your own play.
3. research/connection_types.json and product_copy_rules.json: what each of the six connections is, and the same in the
   client's voice. A connection to an outside system (a CRM, ad platforms) is an outside connection drawn as its route.

Run once from the repo root, then canvas/patch_step71.py, then rebuild:

    python3 sow/canvas/data_step71.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
WAVE4 = os.path.join(HERE, 'research', 'expansion_2026-11-10', 'wave4')
TWO = ('mqualifier', 'moptimizer')
OUTSIDE = {'crm', 'ads'}


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data, indent=1, ascii_only=True):
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n')


map_path = os.path.join(HERE, 'catalog_map.json')
cmap = load(map_path)
have = {p['id'] for p in cmap['products']}
assert not have & set(TWO), 'step 71 is already applied'

# ---- 1. the research ----
files = {}
for name in ('marketo_qualifier.json', 'marketo_optimizer.json'):
    d = load(os.path.join(WAVE4, name))
    assert [p['id'] for p in d['products']] in (['mqualifier'], ['moptimizer']), name
    for c in d['connections']:
        assert {c['a'], c['b']} & set(TWO) and {c['a'], c['b']} <= have | set(TWO), c['id']
        c.pop('note', None)          # a note to the builder, not card text
    files[name] = d
    save(os.path.join(HERE, 'research', 'wave4_' + name), d)

# ---- 2. the two products on Create your own play ----
custom = next(p for p in cmap['plays'] if p['id'] == 'custom')
# the two free places in the top row, beside Brand Concierge, whose hand-off Marketo Qualifier takes
PLACE = {'moptimizer': [6, 0], 'mqualifier': [7, 0]}
taken = [tuple(v) for v in list(custom['pos'].values()) + list(custom['opos'].values())]
for d in files.values():
    for p in d['products']:
        pid = p['id']
        assert tuple(PLACE[pid]) not in taken, pid
        entry = {'id': pid, 'name': p['name']}
        if p['title'] != p['name']:
            entry['title'] = p['title']
        entry.update({'lines': [], 'more': []})
        cmap['products'].append(entry)
        custom['products'].append(pid)
        custom['pos'][pid] = PLACE[pid]
save(map_path, cmap)

# ---- 3. what each connection is, and the same in the client's voice ----
types_path = os.path.join(HERE, 'research', 'connection_types.json')
types = load(types_path)
rules_path = os.path.join(SOW, 'product_copy_rules.json')
rules = load(rules_path)
added = []
for d in files.values():
    for c in d['connections']:
        assert c['id'] not in types['connections'] and c['id'] not in rules['connection_client'], c['id']
        prereqs = list(c['prereqs'])
        evidence = [{'url': s['url'], 'quote': s['quote']} for s in c.get('prereq_sources', []) if s.get('url') and s.get('quote')]
        src = c.get('availability_source') or {}
        if src.get('url') and src.get('quote'):
            evidence.append({'url': src['url'], 'quote': src['quote']})
        entry = {'kind': 'outside', 'line': c['kind']} if {c['a'], c['b']} & OUTSIDE else {'kind': c['kind']}
        entry.update({'label': c['label'], 'availability': c['availability'], 'prereqs': prereqs, 'evidence': evidence})
        if c.get('sow_availability'):
            assert ' your ' not in ' ' + c['sow_availability'].lower() + ' ', c['id']
            entry['sow_availability'] = c['sow_availability']
        for card, sow in (c.get('sow_prereq') or {}).items():
            assert prereqs.count(card) == 1 and ' your ' not in sow, (c['id'], card)
            entry.setdefault('sow_prereqs', {})[str(prereqs.index(card))] = sow
        types['connections'][c['id']] = entry
        client = c['client']
        rules['connection_client'][c['id']] = {'how': client['how'], 'gain': client['gain'], 'note': client.get('note', '')}
        added.append(c['id'])
assert sorted(added) == ['crm-mqualifier', 'moptimizer-ads', 'moptimizer-cw', 'moptimizer-marketo', 'mqualifier-bc', 'mqualifier-marketo'], added
save(types_path, types)
save(rules_path, rules, indent=2, ascii_only=False)
print('step 71 data applied: two products on Create your own play, six connections:', ', '.join(added))
