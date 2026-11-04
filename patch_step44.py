"""Step 44 on the SOW steps (Nov 4 2026, Adam: bring in the CDN and data sources on any play): the outside-system
services (OX1 to OX5) count on Create your own play too, so an outside system handed over from its canvas keeps its
services here (outsideAllowed reads these plays). Run once on the step 43 SOW page, then build_site.py.

    python3 sow/patch_step44.py sow/index.html
"""
import re, sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
n = 0
for lid in ['OX1', 'OX2', 'OX3', 'OX4', 'OX5']:
    m = re.search(r'\{"id": "' + lid + r'".*?"plays": (\[[^\]]*\])', html, re.S)
    assert m and '"custom"' not in m.group(1), f'{lid}: run this once on the step 43 SOW page'
    new = m.group(1)[:-1] + ', "custom"]'
    html = html[:m.start(1)] + new + html[m.end(1):]
    n += 1
assert '—' not in html
open(path, 'w', encoding='utf-8').write(html)
print(f'step 44 applied on the SOW steps: {n} outside-system services count on Create your own play')
