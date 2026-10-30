"""Step 9 of the SOW tool (Oct 30 2026, 11:21 am; Adam: the play is "Brand Visibility + Sites Optimizer and Edge Delivery Services",
three products, and the SOW should call Sites Optimizer out more): the AEM template is renamed, its objective names all three, and the
two Sites Optimizer lines (SO1 setup, SO2 monthly SEO fixes) move from optional into the starting scope.
Run once on the step 8 file; every anchor must appear exactly once.

    python3 patch_step9.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


rep("aem:{group:'Sales plays',label:'Brand Visibility + AEM Sites on Edge Delivery',short:'New sales pursuit',objective:'Build the site on AEM Sites with Edge Delivery Services so it is found in search and in AI answers, then turn Brand Visibility findings into the content and technical improvements that keep it there.'}",
    "aem:{group:'Sales plays',label:'Brand Visibility + Sites Optimizer and Edge Delivery Services',short:'Three products, new sales pursuit',objective:'Build the site on AEM Sites with Edge Delivery Services, keep it right for search with Sites Optimizer, and get it into AI answers with Brand Visibility, then turn their findings into the content and technical improvements that keep it there.'}")
rep("aem:['L01','L02','A04','A01','A02','A03','A05','C03','O01','O02']", "aem:['L01','L02','A04','A01','A02','A03','A05','SO1','C03','O01','SO2','O02']")
rep("state.play==='aem'?['SO1','SO2','O04','O07','O08','O09','X01']:", "")
import json, re
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
catalog = json.loads(m.group(1))
assert len(catalog) == 40
by = {x['id']: x for x in catalog}
catalog = [x for x in catalog if x['id'] not in ('SO1', 'SO2')]
ids = [x['id'] for x in catalog]
catalog.insert(ids.index('C03'), by['SO1'])                    # Connect, before the workflow line
ids = [x['id'] for x in catalog]
catalog.insert(ids.index('O01') + 1, by['SO2'])                # Optimize, after the monthly review
html = html[:m.start(1)] + json.dumps(catalog, ensure_ascii=False) + html[m.end(1):]
open(path, 'w', encoding='utf-8').write(html)
print('step 9 applied')
