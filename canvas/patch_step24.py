"""Step 24 on the Build canvas (Nov 2 2026), with sow/patch_step24.py: ChatGPT's second pass, F2. Start over also
clears the SOW steps' older storage key (partner-services-focused-v2), so an engagement saved by an earlier version
can't come back after Start over; the rate and size stay, as the dialog says.
Run once on the step 23 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step24.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'partner-services-focused-v2' not in html, 'run this on the step 23 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


rep("if(ask.k==='over'){try{localStorage.removeItem(TOOL_KEY);localStorage.removeItem(HANDOFF);}catch(e){}",
    "if(ask.k==='over'){try{localStorage.removeItem(TOOL_KEY);localStorage.removeItem('partner-services-focused-v2');localStorage.removeItem(HANDOFF);}catch(e){}")
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 24 applied: Start over clears the older SOW key too')
