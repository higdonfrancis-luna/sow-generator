"""Step 12 of the SOW tool (Oct 31 2026; Adam, on the duplicate Launch heading flagged Oct 30: "That's no good"): the Services
step groups its lines by stage, Launch, then Connect, then Optimize, so each heading shows once. Before, a heading was drawn
each time the stage changed down the list, so an optional Launch line added after Connect lines (for example Coworker shared
setup on the CJA play) got a second Launch heading at the bottom, and Coworker on its own showed Launch, Connect, Launch,
Optimize because CW05 is a Launch line listed after CW07. Lines keep their order inside each stage.
Run once on the step 11 file; the anchor must appear exactly once.

    python3 patch_step12.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
old = " const lines=placeCustom(selectedLines());let last='';"
new = " const placed=placeCustom(selectedLines()),lines=OWN_ORDER.flatMap(st=>placed.filter(s=>stageOf(s)===st));let last='';"
assert html.count(old) == 1, f'anchor found {html.count(old)} times'
open(path, 'w', encoding='utf-8').write(html.replace(old, new))
print('step 12 applied')
