"""Step 29 of the SOW tool (Nov 3 2026): what a focused verification of step 28 confirmed, on the SOW steps.
The canvas's half is sow/canvas/patch_step29.py.
- Use starting scope also resets the services of the play's outside systems that are off the canvas, so a system
  added again afterwards starts with its starting services, as it does when the button is pressed with the box on.
Drafts and browser storage from step 27 are not migrated: step 27 was never deployed or sent, so none exist outside
this repo's tests (its stored defaults and wording would otherwise need a PRIOR27 list).
Run once on the step 28 file; every anchor must appear exactly once.

    python3 patch_step29.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'OUT_START' in html and 'step 29' not in html, 'run this on the step 28 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
rep("for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id)||OUT_START.includes(s.id);",
    "for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id)||OUT_START.includes(s.id);"
    "/* step 29: the services of outside systems off the canvas go back to their start too */"
    "for(const s of catalog().filter(x=>x.plays.includes(state.play)&&x.outside&&!outsideOk(x)))if(row(s))row(s).on=OUT_START.includes(s.id);")
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 29 applied: Use starting scope resets the services of outside systems off the canvas')
