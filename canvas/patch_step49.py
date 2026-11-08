"""Step 49 (Nov 8 2026): the RFP Builder tab on the canvas's step strip. With a product on the canvas it hands over
like the other steps; with none it opens the SOW tool's RFP Builder directly, since an RFP needs no play yet.

    python3 sow/canvas/patch_step49.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()

def replace(old, new):
    global html
    assert html.count(old) == 1, old[:80]
    html = html.replace(old, new, 1)

replace('<button data-tab="sow">Statement of work</button></nav>',
        '<button data-tab="sow">Statement of work</button><button data-tab="rfp">RFP Builder</button></nav>')
replace("const STEP={scope:'scope',services:'services',sow:'document'}",
        "const STEP={scope:'scope',services:'services',sow:'document',rfp:'rfp'}")
replace("document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(STEP[b.dataset.tab])handoff(STEP[b.dataset.tab]);}));",
        "document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(b.dataset.tab==='rfp'&&!prods().some(p=>!p.outside)){location.href='sow/index.html#rfp';return;}if(STEP[b.dataset.tab])handoff(STEP[b.dataset.tab]);}));")
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 49 applied: RFP Builder on the step strip')
