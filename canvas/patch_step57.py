"""Step 57, the front page (Nov 10 2026, Adam: "you can't get to the tab until you click through a few things", then yes to
sow/mockups/rfp_front_door/rfi_front_door.png, "it's RFI", and "build our new zip"): an RFI front door under the
"Not sure which play?" box. It links to the SOW page's #rfi, where the RFI Builder opens on its own (rfp_ui.js). The box reuses
the problem box's own .bp style. The Build page's step row gets an RFI Builder tab after Statement of work. Run once from the repo root, then rebuild:

    python3 sow/canvas/patch_step57.py
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(HERE, 'template.html')
html = open(path, encoding='utf-8').read()
if 'id="rfi-door"' in html:
    raise SystemExit('step 57 is already in template.html')

def replace(old, new):
    global html
    assert html.count(old) == 1, ('anchor not found once', old[:80], html.count(old))
    html = html.replace(old, new)

DOOR = ('<div class="bp rfi-door" id="rfi-door"><div class="rfi-door-text"><h2 class="bp-t">'
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EB1000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>'
        'Have an RFI? Start from it</h2><p class="bp-s">Drop your client\'s RFI (Word, Excel, PDF or text) and get drafted answers about Adobe products, '
        'with Adobe\'s sources. Answering an RFP? Start here for its questions, then add the services to your statement of work to scope and price it.</p></div>'
        '<a class="rfi-door-go" href="sow/index.html#rfi">Open the RFI Builder</a></div>')
replace('<div id="bp-body" aria-live="polite"></div></div><h2>Choose a play to start</h2>',
        '<div id="bp-body" aria-live="polite"></div></div>' + DOOR + '<h2>Choose a play to start</h2>')
replace('.bp-s{margin:6px 0 14px;font-size:15px;color:#3A3A3A}',
        '.bp-s{margin:6px 0 14px;font-size:15px;color:#3A3A3A}'
        '.rfi-door{display:flex;align-items:center;justify-content:space-between;gap:16px 24px;flex-wrap:wrap}.rfi-door-text{flex:1 1 420px;min-width:0}.rfi-door .bp-s{margin:6px 0 0}'
        '.rfi-door-go{display:inline-block;background:#EB1000;color:#fff;border-radius:12px;padding:12px 22px;font-weight:700;font-size:16px;text-decoration:none;white-space:nowrap}'
        '.rfi-door-go:hover{background:#C40D00}.rfi-door-go:focus-visible{outline:2px solid #1C1C1C;outline-offset:2px}')
# the Build page's own step row gets the fifth tab too, so a partner working on a play reaches the RFI Builder in one click
replace('<button data-tab="sow">Statement of work</button></nav>', '<button data-tab="sow">Statement of work</button><button data-tab="rfp">RFI Builder</button></nav>')
replace("const STEP={scope:'scope',services:'services',sow:'document'};", "const STEP={scope:'scope',services:'services',sow:'document',rfp:'rfp'};")
# with five tabs the row wraps on a small screen instead of pushing the page sideways (inside the page's own max-width:900px rule)
replace('.tabs{gap:22px}', '.tabs{gap:22px;flex-wrap:wrap;row-gap:0}')
open(path, 'w', encoding='utf-8').write(html)
print('step 57 applied to the canvas template: the RFI front door and the RFI Builder tab on Build')
