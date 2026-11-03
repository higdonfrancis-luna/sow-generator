"""Step 30 of the SOW tool (Nov 3 2026, Adam: "ok" to option A on sow/mockups/nov3_overlap/counted_once_overlap.png):
counted once becomes the overlap review. The covering is removed from the SOW steps' half (the canvas's half is
sow/canvas/patch_step30.py): CJA data preparation in Experience Platform no longer turns the three CJA source services
off on the canvas, and the canvas restore no longer writes covered or kept states. Every service counts, and the
existing review (OVERLAPS) asks each source service beside CJA data preparation to say how it differs, or go, before
the SOW is issued. The services' assumptions already say each covers only the work CJA data preparation does not.
Run once on the step 29 file; every anchor must appear exactly once.

    python3 patch_step30.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const COVER=' in html and "['OX3',['CJ01']]" in html, 'run this on the step 29 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
rep("/* counted once: CJA data preparation in Experience Platform covers the three CJA source services */\n"
    "const COVER={OX3:'CJ01',OX4:'CJ01',OX5:'CJ01'};", "")
rep("\n  if(COVER[id]){const cov=lines.some(x=>baseId(x)===COVER[id]&&est[x.id].on);if(cov)c.keep[id]=on;else delete c.keep[id];if(on||!cov)c.ls[id]=on;continue;}c.ls[id]=on;}}",
    "c.ls[id]=on;}}")
rep("if(!outsideOk(s)){c.ls[id]=on;delete c.keep[id];continue;}", "if(!outsideOk(s)){c.ls[id]=on;continue;}")
assert 'COVER' not in html, 'the covering must be gone completely'
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 30 applied: the covering is gone; the overlap review asks how each source service differs from CJA data preparation')
