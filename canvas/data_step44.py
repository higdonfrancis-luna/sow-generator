"""Step 44 data (Nov 4 2026, Adam: bring in the CDN and data sources on any play): Create your own play offers the four
outside systems, each placed beside the product it connects to on that play's grid (packed like its products); and the
problem notes that said only the CJA play offers a CDN box now say to add it.
Run once on the step 43 catalog_map.json and problems.json, then build.py.

    python3 sow/canvas/data_step44.py sow/canvas/catalog_map.json sow/canvas/problems.json
"""
import json, sys
mpath, ppath = sys.argv[1], sys.argv[2]
m = json.load(open(mpath, encoding='utf-8'))
own = [p for p in m['plays'] if p.get('custom')][0]
assert 'outside' not in own, 'run this once on the step 43 catalog_map.json'
# beside the product each connects to: the CDN above Brand Visibility, the data warehouse above CJA, cloud storage and CRM beside it
own['outside'] = ['cdn', 'dwh', 'cstore', 'crm']
own['opos'] = {'cdn': [2, 0], 'dwh': [1, 0], 'cstore': [1, -1], 'crm': [0, -1]}
taken = {tuple(v) for v in own['pos'].values()}
assert not taken & {tuple(v) for v in own['opos'].values()}, 'an outside system would sit on a product'
json.dump(m, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

d = json.load(open(ppath, encoding='utf-8'))
OLD = "Brand Visibility's CJA source needs CDN logs, which only the CJA play offers as a CDN box."
NEW = "Brand Visibility's CJA source needs CDN logs; add the CDN with Add outside system."
n = 0
for p in d['problems']:
    for r in p['refine']:
        if r.get('note') and OLD in r['note']:
            # the readouts chip keeps the CDN box now, so its CDN sentence goes; the others say how to add it
            r['note'] = r['note'].replace(' ' + OLD, '') if r['note'].startswith('This needs CJA B2C edition.') else r['note'].replace(OLD, NEW)
            n += 1
silos = [p for p in d['problems'] if p['id'] == 'customer-data-silos'][0]
a = "CRM and warehouse feeds are outside systems, which the canvas offers on the CJA play only."
assert silos['why'].count(a) == 1
silos['why'] = silos['why'].replace(a, 'CRM and warehouse feeds come in as outside systems through CJA, with Add outside system.')
assert n == 4 and OLD not in json.dumps(d, ensure_ascii=False)
json.dump(d, open(ppath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('step 44 data: four outside systems on Create your own play;', n, 'notes updated')
