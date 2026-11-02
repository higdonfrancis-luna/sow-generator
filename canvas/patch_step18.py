"""Step 18 on the Build canvas (Nov 2 2026): the same starting services as the SOW steps (sow/patch_step18.py).
A play can now turn a line off at the start ('off' in catalog_map.json, beside 'on'): Commerce starts without the
automated deployment pilot (L03), and FSI without the discovery-to-answer workflow (C04), which the SOW steps turn
on when Brand Concierge is live and healthy. Such a line sits under More services on its card.
Run once on the step 17 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step18.py sow/canvas/template.html
"""
import json
import os
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'effOf' in html and '.off||' not in html, 'run this on the step 17 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
rep("/* a line's starting state: on by default, or turned on by the play (Brand Visibility on its own starts with C05) */\n"
    "const defOf=id=>DEF[id]||((play()||{}).on||[]).includes(id);",
    "/* a line's starting state: on by default unless the play turns it off (Commerce starts without L03, FSI without C04), or turned on by the play (Brand Visibility on its own starts with C05) */\n"
    "const defOf=id=>{const pl=play()||{};return (!!DEF[id]&&!(pl.off||[]).includes(id))||(pl.on||[]).includes(id);};")
rep("const main=[...o.lines,...o.more.filter(l=>defOf(l))],listed=[...main,...o.more.filter(l=>!defOf(l)&&lineOn(l))],extra=o.more.filter(l=>!defOf(l)&&!lineOn(l));",
    "const main=all(o).filter(l=>defOf(l)),listed=[...main,...all(o).filter(l=>!defOf(l)&&lineOn(l))],extra=all(o).filter(l=>!defOf(l)&&!lineOn(l));")
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)

# the plays that start a line off
mp = os.path.join(os.path.dirname(os.path.abspath(path)), 'catalog_map.json')
raw = open(mp, encoding='utf-8').read()
cmap = json.loads(raw)
assert json.dumps(cmap, ensure_ascii=False, indent=1) + '\n' == raw
for pl in cmap['plays']:
    assert 'off' not in pl
    if pl['id'] == 'commerce':
        pl['off'] = ['L03']
    if pl['id'] == 'fsi':
        pl['off'] = ['C04']
cmap['note'] = cmap['note'].replace("and any optional lines it turns on from the start ('on').",
                                    "any optional lines it turns on from the start ('on') and any starting lines it turns off ('off').")
assert "('off')" in cmap['note']
open(mp, 'w', encoding='utf-8').write(json.dumps(cmap, ensure_ascii=False, indent=1) + '\n')

# build.py checks an 'off' line is a starting line of the play
bp = os.path.join(os.path.dirname(os.path.abspath(path)), 'build.py')
b = open(bp, encoding='utf-8').read()
old = ("        for l in pl.get('on', []):\n"
       "            assert any(l in o['more'] for o in mine), f\"play {pl['id']} turns on {l}, which is not an optional line in the play\"\n")
assert b.count(old) == 1
b = b.replace(old, old + "        for l in pl.get('off', []):\n"
              "            assert any(l in o['lines'] for o in mine), f\"play {pl['id']} turns off {l}, which is not a starting line in the play\"\n")
open(bp, 'w', encoding='utf-8').write(b)
print('canvas step 18 applied: Commerce starts without L03, FSI without C04')
