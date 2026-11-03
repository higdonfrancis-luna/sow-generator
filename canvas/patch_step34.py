"""Step 34 on the Build canvas (Nov 3 2026, overnight; Adam: "keep working until you're complete"): a browser that last
used the live site (step 13) catches up once. The live site saved the canvas without the rate a partner typed and
without the services chosen on the SOW steps (and with its old $150 default, which this canvas rightly ignores); the
SOW steps hold them. Opened first after the deploy, the canvas showed a blank rate and the play's new starting services,
and the next Save and continue cleared the rate and turned off what the partner had chosen on the SOW steps (the FSI
discovery-to-answer workflow, the Commerce deployment pilot, lines added on Services). Now, when the canvas finds a
state saved before this version (no v:2) and the SOW steps hold an engagement, it opens sow/?sync=build once: those
steps hand their rate and choices to the canvas, exactly as their Build tab does, and come straight back (the SOW
steps' half is sow/patch_step34.py). A session flag stops it from ever repeating; a browser without saved SOW steps
keeps today's behavior.
Run once on the step 33 template (no canvas change in steps 31 to 33), then build.py and build_site.py.

    python3 sow/canvas/patch_step34.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const OVERLAP=' in html and 'sync=build' not in html, 'run this on the step 30 to 33 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

rep("const save=(pub=true)=>{if(reloading)return;",
    "/* a browser from before step 34: the SOW steps hold its rate and service choices, so they hand them to this canvas once, as their Build tab does, and come straight back */\n"
    "try{const s=JSON.parse(localStorage.getItem(KEY)||'null'),t=JSON.parse(localStorage.getItem(TOOL_KEY)||'null');"
    "if(s&&typeof s==='object'&&s.v!==2&&t&&typeof t==='object'&&[2,3,4].includes(t.version)&&!sessionStorage.getItem('abv-sow-catchup')){"
    "sessionStorage.setItem('abv-sow-catchup','1');reloading=true;document.documentElement.style.visibility='hidden';location.replace('sow/?sync=build');}}catch(e){}\n"
    "const save=(pub=true)=>{if(reloading)return;")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 34 applied on the canvas: a browser from before this version catches up through the SOW steps once')
