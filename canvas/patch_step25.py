"""Step 25 on the Build canvas (Nov 2 2026): phones, from ChatGPT's second pass (readability), with Adam's yes ("OK for
number three"). At 600 pixels and narrower, each service line on a product or connection card gives its name and its
notes ("Set on the Services step", "Needs ...") the full row, with the hours, the fee and the X (or the Add buttons on
Create your own play) on the row beneath. Wider screens are unchanged.
Run once on the step 24 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step25.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert "localStorage.removeItem('partner-services-focused-v2')" in html and '.ln .nm{grid-column:1/-1}' not in html, 'run this on the step 24 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
# last in the stylesheet, so it wins over the line rules above it
rep(".ib.cx{background:var(--red);color:#fff}\n</style>",
    ".ib.cx{background:var(--red);color:#fff}\n"
    "/* phones: a line's name and notes take the full row; the hours, the fee and the X (or the Add buttons) sit beneath */\n"
    "@media (max-width:600px){.ln{grid-template-columns:auto 1fr 30px;row-gap:3px}.ln .nm{grid-column:1/-1}.ln .hr{text-align:left}.ln.lock,.ln.lock.can{grid-template-columns:auto 1fr}}\n"
    "</style>")
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 25 applied: on phones a service line gives its name and notes the full row')
