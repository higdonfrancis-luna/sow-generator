"""Build canvas, audit fixes, part 2 (Oct 31 2026), after patch_audit_ui.py:
- Availability shows on the card only when Adobe gives a status to watch (Limited Availability, Early Access, Beta,
  Legacy, roadmap, coming soon, Try Before You Buy); "not stated" moves into Before it works, to keep cards short.
- A connection card that can't sit beside both products sits beside its i instead of on top of it.
Run once on template.html after patch_audit_ui.py; every anchor must appear exactly once.

    python3 patch_audit_ui2.py template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


rep(".card .avail{font-size:15px;line-height:20px;margin:0 0 8px;color:var(--dred);font-weight:600}",
    ".card .avail{font-size:15px;line-height:20px;margin:0 0 8px;color:var(--dred);font-weight:600}.card details.pre li.na{font-style:normal;font-weight:600}")
rep("    if(o.availability&&!/^generally available/i.test(o.availability))h+=`<p class=\"avail\">Availability: ${esc(o.availability)}</p>`;\n"
    "    if(o.prereqs&&o.prereqs.length)h+=`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>Before it works (${o.prereqs.length}) ${I.chev}</summary><ul>${o.prereqs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`;\n",
    "    const watch=o.availability&&WATCH.test(o.availability),quiet=o.availability&&!watch&&!/^generally available/i.test(o.availability)?[o.availability]:[];\n"
    "    if(watch)h+=`<p class=\"avail\">Availability: ${esc(o.availability)}</p>`;\n"
    "    const pre=[...quiet.map(x=>['na','Availability: '+x]),...(o.prereqs||[]).map(x=>['',x])];\n"
    "    if(pre.length)h+=`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>Before it works (${pre.length}) ${I.chev}</summary><ul>${pre.map(([c,x])=>`<li${c?` class=\"${c}\"`:''}>${esc(x)}</li>`).join('')}</ul></details>`;\n")
rep("const KIND={native:'Native integration',platform:'Shared-platform data path',extension:'Supported extension',partner:'Partner-designed workflow'};",
    "const KIND={native:'Native integration',platform:'Shared-platform data path',extension:'Supported extension',partner:'Partner-designed workflow'};\n"
    "/* statuses worth showing on the card itself; anything else waits under Before it works */\n"
    "const WATCH=/limited availability|early access|early adopter|beta|legacy|roadmap|coming soon|planned|try before you buy|co-innovation|maintenance mode|not currently|conflict/i;")
rep("  let left=a.right-cv.left+14;if(left+w>cv.width-10)left=a.left-cv.left-14-w;if(left<10)left=Math.max(10,Math.min(cv.width-w-10,a.left-cv.left));",
    "  let left=a.right-cv.left+14;if(left+w>cv.width-10)left=a.left-cv.left-14-w;\n"
    "  /* a connection whose two products fill the width: the card sits beside its i, not on top of it */\n"
    "  if(left<10&&card.k==='c'){const ir=el.getBoundingClientRect();left=ir.right-cv.left+14;if(left+w>cv.width-10)left=ir.left-cv.left-14-w;}\n"
    "  if(left<10)left=Math.max(10,Math.min(cv.width-w-10,a.left-cv.left));")

assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas audit fixes, part 2, applied')
