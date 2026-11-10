"""Step 66 canvas data (Nov 10 2026, Adam's answers to sow/canvas/research/expansion_2026-11-10/wave3/WAVE3_PROPOSAL.md): wave 3
of the catalog expansion, cut down to what partners sell. Adobe Analytics, Marketo Measure, Acrobat and Acrobat Services, and
Acrobat Sign join the Create your own play picker.

Adam: Audience Manager "is kind of like dead really between CDP and CDP collaborations"; Adobe Campaign "Leave it out" ("we're
trying to move everyone off of adobe campaign over the journey optimizer"); Marketo Measure "people still buy it"; the
Coworker cards "Let's just skip those"; AEM Guides "Leave AEM Guides out"; Adobe Advertising "I don't even get paid on that";
Acrobat "if you feel there's some use cases we can keep that". Adobe Analytics has no Brand Visibility line (his call of the
morning).

1. research/wave3_data_analytics.json, research/wave3_campaign_advertising.json and research/wave3_documents.json hold the
   four products and the 20 connections between them and the products already in the tool. The four products and 29
   connections Adam left out (and Adobe Analytics + Coworker) are listed in each file under `left_out`, with his words; the
   full research stays in expansion_2026-11-10/wave3/.
2. catalog_map.json: the four products get a name and a place on Create your own play.
3. research/connection_types.json: what each of the 20 connections is, Adobe's availability and the prerequisites, with the
   evidence quotes, and the statement of work's conditions (`sow_availability`, `sow_prereqs`).
4. ../product_copy_rules.json, connection_client: the client-voice how and gain of the 20 connections, for the RFI Builder.

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step66.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
WAVE3 = os.path.join(HERE, 'research', 'expansion_2026-11-10', 'wave3')
FOUR = ['aa', 'mmeasure', 'acrobat', 'acrobatsign']
OUT = {'aam': 'Audience Manager: "kind of like dead really between CDP and CDP collaborations. There\'s no reason to use audience anymore."',
       'campaign': 'Adobe Campaign: "Leave it out". "We\'re trying to move everyone off of adobe campaign over the journey optimizer."',
       'advertising': 'Adobe Advertising: "I don\'t even get paid on that like I don\'t even know how long that\'ll exist."',
       'aemguides': 'AEM Guides: "Leave AEM Guides out". "No one really buys that either."'}
NO_COWORKER = 'The Coworker cards of this wave: "Let\'s just skip those. It\'s a waste of our time."'


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data, indent=1, ascii_only=True):
    # each file keeps the layout it already has, so the change shows as the lines that changed (build.py checks the catalog for dashes)
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=indent, ensure_ascii=ascii_only) + '\n')


map_path = os.path.join(HERE, 'catalog_map.json')
cmap = load(map_path)
have = {p['id'] for p in cmap['products']}
assert not have & set(FOUR), 'step 66 is already applied'

# ---- 1. the research, cut to Adam's four ----
files = {}
for name in ('data_analytics.json', 'campaign_advertising.json', 'documents.json'):
    d = load(os.path.join(WAVE3, name))
    for p in d['products']:
        if p['id'] not in FOUR:
            d['left_out'].append({'what': p['name'] + ' as a product, with its %d services' % len(p['lines']), 'why': 'Adam, Nov 10 2026. ' + OUT[p['id']]})
    d['products'] = [p for p in d['products'] if p['id'] in FOUR]
    kept = []
    for c in d['connections']:
        ends = {c['a'], c['b']}
        gone = sorted(ends & set(OUT))
        if gone or 'cw' in ends:
            d['left_out'].append({'what': 'The connection %s, with its %d services' % (c['id'], len(c['lines'])),
                                  'why': 'Adam, Nov 10 2026. ' + (OUT[gone[0]] if gone else NO_COWORKER)})
            continue
        assert ends & set(FOUR) and ends <= have | set(FOUR), c['id']
        c.pop('note', None)          # a note to the builder, not card text
        kept.append(c)
    d['connections'] = kept
    files[name] = d
    save(os.path.join(HERE, 'research', 'wave3_' + name), d)

# ---- 2. the four products on Create your own play ----
custom = next(p for p in cmap['plays'] if p['id'] == 'custom')
# every product's lines draw clean here with all 32 on, and a full canvas keeps a scale of about 0.6 (test_canvas.js);
# the top row, where outside systems sit, put boxes under the focus bar on a phone
PLACE = {'aa': [6, 4], 'mmeasure': [3, 5], 'acrobat': [4, 5], 'acrobatsign': [5, 5]}
assert set(PLACE) == set(FOUR)
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

# ---- 3. what each connection is ----
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
        entry = {'kind': c['kind'], 'label': c['label'], 'availability': c['availability'], 'prereqs': prereqs, 'evidence': evidence}
        if c.get('sow_availability'):
            assert ' your ' not in ' ' + c['sow_availability'].lower() + ' ', c['id']
            entry['sow_availability'] = c['sow_availability']
        for card, sow in (c.get('sow_prereq') or {}).items():
            assert prereqs.count(card) == 1 and ' your ' not in sow, (c['id'], card)
            entry.setdefault('sow_prereqs', {})[str(prereqs.index(card))] = sow
        types['connections'][c['id']] = entry
        # ---- 4. the same connection in the client's voice ----
        client = c['client']
        rules['connection_client'][c['id']] = {'how': client['how'], 'gain': client['gain'], 'note': client.get('note', '')}
        added.append(c['id'])
assert len(added) == 20 and not any('cw' in i.split('-') for i in added), added
save(types_path, types)
save(rules_path, rules, indent=2, ascii_only=False)
print('step 66 data applied: four products on Create your own play, 20 connections:', ', '.join(added))
