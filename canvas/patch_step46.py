"""Step 46 on the Build canvas (Nov 4 2026): the package a service needs rides along to the SOW steps as an assumption
the statement of work can print ("Assumes your client has Sites Optimizer Ultimate.", which the SOW steps read as
"the Client"); the check and the upsell stay on the canvas, for the partner. Run once on the step 45 template, after
sweep46_apply.py, then build.py and build_site.py.

    python3 sow/canvas/patch_step46.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
old = "L.tier?'Needs '+L.tier+': check what your client owns; if they don\\'t have it, it is an upsell for Adobe.':''"
assert html.count(old) == 1, 'run this once on the step 45 template'
html = html.replace(old, "L.tier?'Assumes your client has '+L.tier+'.':''")
open(path, 'w', encoding='utf-8').write(html)
print('step 46 applied on the canvas: the package a service needs reaches the SOW as an assumption')
