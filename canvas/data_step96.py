"""Step 96 data (Nov 14 2026, Adam: "for these plays that are already built out it should just be the products that are in that
play. That's why we have the one create your own play so I don't think we should allow them to add additional products", then
"you can proceed"): a built play offers outside systems only. AEM Assets, the one Adobe product a built play offered ('addons'
on the AEM play, from step 45), leaves the AEM play's menu. A saved draft that already has it keeps it: the play lists it under
'kept' (Adobe products a saved canvas keeps, never offered), with its place on the canvas and its Remove button.
Run once on the step 95 catalog_map.json; then build.py and build_site.py.

    python3 sow/canvas/data_step96.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MAP = os.path.join(HERE, 'catalog_map.json')
cmap = json.load(open(MAP))
done = 0
for pl in cmap['plays']:
    addons = pl.pop('addons', None)
    if not addons:
        continue
    pl['outside'] = [o for o in pl['outside'] if o not in addons]
    pl['kept'] = addons
    done += 1
assert done == 1 and [p for p in cmap['plays'] if p['id'] == 'aem'][0]['kept'] == ['aemassets'], done
cmap['note'] = cmap['note'].replace("Step 45: a play's 'addons' are Adobe products a partner can add from the same menu (AEM Assets on the AEM play); 'ostart'", "Step 45: 'ostart'")
cmap['note'] += (" Step 96: a built play offers outside systems only; 'kept' lists Adobe products a saved canvas keeps but the"
                 " play no longer offers (AEM Assets on the AEM play).")
open(MAP, 'w', encoding='utf-8').write(json.dumps(cmap, ensure_ascii=False, indent=1) + '\n')
print('step 96 data: AEM Assets is no longer offered on the AEM play; a saved draft keeps it')
