"""Step 65 canvas data (Nov 10 2026, Adam: "yes to both" after the Adobe MAX announcement, see
research/expansion_2026-11-10/wave2/MAX_2026-11-10.md): one optional service on Firefly Creative Production, 3D digital twin
workflows (FP10), written for the three starter templates Adobe's help page documents today with no beta or preview label.
What MAX announced beyond them (changing a product's labels and materials) is not in it.

Ideation space, the second "yes", is not added: Adobe documents it under Workfront Planning, and every page says it is "not
yet generally available" and "available only as part of the Ideation space Beta program". It is recorded under `left_out` in
research/wave2_content_tools.json, with Adobe's words, for when the label goes.

The research is research/expansion_2026-11-10/wave2/max_followup.json (25 quotes checked).

Run once from the repo root, then rebuild:

    python3 sow/canvas/data_step65.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
load = lambda path: json.load(open(path, encoding='utf-8'))


def save(path, data):
    open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=1, ensure_ascii=True) + '\n')


found = load(os.path.join(HERE, 'research', 'expansion_2026-11-10', 'wave2', 'max_followup.json'))

# ---- FP10 on Firefly Creative Production ----
path = os.path.join(HERE, 'research', 'wave2_firefly_family.json')
firefly = load(path)
product = next(p for p in firefly['products'] if p['id'] == 'fireflycp')
assert [l['id'] for l in product['lines']] == ['FP%02d' % n for n in range(1, 10)], 'step 65 is already applied'
src = found['fp10']
assert src['id'] == 'FP10' and src['default'] is False and not found['fp10_labels']
line = {k: src[k] for k in ('id', 'name', 'unit', 'low', 'base', 'high', 'default', 'scope', 'evidence', 'source')}
# the tag on the card reads "Also needs ...": the model is your client's to supply, and this service does not create it
line['ext'] = 'a USDZ 3D model of each product'
OLD, NEW = 'set the camera angles, render settings and background prompts,', 'set the camera angles, render settings and background prompts the templates offer,'
assert line['scope'].count(OLD) == 1
line['scope'] = line['scope'].replace(OLD, NEW)
product['lines'].append(line)
gone = [x for x in firefly['left_out'] if x['what'].startswith('3D digital twin workflows')]
assert len(gone) == 1
firefly['left_out'].remove(gone[0])
save(path, firefly)

# ---- Ideation space stays out, on the record ----
path = os.path.join(HERE, 'research', 'wave2_content_tools.json')
tools = load(path)
label = found['ideation']['labels'][0]
assert found['ideation']['service'] is None and 'not yet generally available' in label['quote']
assert not any('Ideation space' in x['what'] for x in tools['left_out'])
tools['left_out'].append({
    'what': 'Ideation space for Adobe Workfront Planning (announced at Adobe MAX on Nov 10 2026): an AI canvas that turns ideas into a campaign brief',
    'why': "Adam said yes to adding it if Adobe documents it without a label. Adobe documents it, and every page carries a beta notice, so no "
           "service is written. Recheck when the notice goes; what it will need is in expansion_2026-11-10/wave2/max_followup.json.",
    'url': label['url'], 'quote': label['quote']})
save(path, tools)
print('step 65 data applied: FP10 (3D digital twin workflows) on Firefly Creative Production; Ideation space recorded as left out')
