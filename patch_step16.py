"""Step 16 of the SOW tool (Nov 1 2026, Adam: yes): every service turned on or off on the Services step is the Build
canvas's choice too, so a trip back to Build keeps it, and the canvas and the Services step show the same total.
Before, only the rate, size, term and the FSI "Brand Concierge today" answer carried back, and each trip from the
canvas brought back the canvas's checkmarks. The partner's own services live only in the SOW steps. The generic
Coworker Skills package (CW03) keeps the canvas's "replaced by the specialized Skills" state unless the partner
keeps it on.
Run once on the step 15 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step16.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const PRIOR15=' in html, 'run this on the step 15 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


rep("/* the rate, size and term set here are the canvas's too, so a trip back to Build keeps them and both show the same total; in the FSI play the canvas's Implement Brand Concierge follows the Services step (off when Brand Concierge is live and healthy) */",
    "/* the rate, size, term and every service choice set here are the canvas's too, so a trip back to Build keeps them and both show the same total; the partner's own services live only here */")
rep(" const f=state.estimates.fsi&&state.estimates.fsi.F02;if(c.play==='fsi'&&state.play==='fsi'&&f){c.ls=c.ls&&typeof c.ls==='object'?c.ls:{};if(f.on)delete c.ls.F02;else c.ls.F02=false;}\n",
    " const est=state.estimates[state.play];if(c.play===state.play&&est){c.ls=c.ls&&typeof c.ls==='object'?c.ls:{};c.keep=c.keep&&typeof c.keep==='object'?c.keep:{};\n"
    "  const lines=catalog().filter(x=>x.plays.includes(state.play)&&!isCustom(x)&&est[x.id]),special=lines.some(x=>SPECIAL_SKILLS.includes(baseId(x))&&est[x.id].on);\n"
    "  for(const s of lines){const id=baseId(s),on=!!est[s.id].on;if(id==='CW03'){c.keep.CW03=on;if(on||!special)c.ls.CW03=on;continue;}c.ls[id]=on;}}\n")

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 16 applied: Services choices carry back to the canvas')
