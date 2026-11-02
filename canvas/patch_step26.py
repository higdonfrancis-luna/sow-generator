"""Step 26 on the Build canvas (Nov 2 2026), with Adam's yes ("1 and 2 ok") on two issues the step 25 checks found, both
older than step 25:
1. Desktop, Create your own play: a line waiting for a product (its Add buttons beside it) squeezed its name and note
   into a 66 to 71 pixel column, 275 to 335 pixels tall. It now takes the phone arrangement at every width: the name and
   note across the row, the hours and Add buttons beneath (about 110 pixels). Every other desktop line is unchanged.
2. Phones and tablets: a tap opened a card under the finger during the tap (the hover path), so the same tap could land
   on whatever part of the card was there: a line's X, the close button or a reference link. On a touch screen a card
   now opens and pins only through the tap's click; a real mouse still opens cards on hover, as before.
Run once on the step 25 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step26.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert '.ln .tg::after' in html and 'touchy' not in html, 'run this on the step 25 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# 1. a waiting line stacks at every width (the phone rule keeps only the plain waiting line, which this now covers)
rep(".ln.lock.can{grid-template-columns:1fr 50px auto}",
    ".ln.lock.can{grid-template-columns:auto 1fr;row-gap:3px}.ln.lock.can .nm{grid-column:1/-1}.ln.lock.can .hr{text-align:left}")
rep(".ln.lock,.ln.lock.can{grid-template-columns:auto 1fr}", ".ln.lock{grid-template-columns:auto 1fr}")

# 2. on a touch screen the hover path stays out of the way; the tap's click opens and pins the card
rep("function hook(el,k,id){",
    "/* touch screens: a tap opens and pins a card through its click; only a real mouse opens one on hover */\n"
    "const HOVER=matchMedia('(hover: hover)');\n"
    "const touchy=e=>!HOVER.matches||!!(e&&e.sourceCapabilities&&e.sourceCapabilities.firesTouchEvents);\n"
    "function hook(el,k,id){")
rep("  el.addEventListener('mouseenter',()=>{\n    if(fv()){clearTimeout(fT);if(k==='p'){clearTimeout(hideT);intend(id);return;}}",
    "  el.addEventListener('mouseenter',e=>{if(touchy(e))return;\n    if(fv()){clearTimeout(fT);if(k==='p'){clearTimeout(hideT);intend(id);return;}}")
rep("  el.addEventListener('mousemove',()=>{if(k==='p'&&fv()&&fsel&&fsel!==id&&fhov!==id)intend(id);});",
    "  el.addEventListener('mousemove',e=>{if(touchy(e))return;if(k==='p'&&fv()&&fsel&&fsel!==id&&fhov!==id)intend(id);});")
rep("  el.addEventListener('mouseleave',()=>{\n    if(fv()){clearTimeout(dwellT);leaveSoon();}",
    "  el.addEventListener('mouseleave',e=>{if(touchy(e))return;\n    if(fv()){clearTimeout(dwellT);leaveSoon();}")
rep("$('card').addEventListener('mouseenter',()=>{clearTimeout(hideT);clearTimeout(fT);});",
    "$('card').addEventListener('mouseenter',e=>{if(touchy(e))return;clearTimeout(hideT);clearTimeout(fT);});")
rep("$('card').addEventListener('mouseleave',()=>{if(fv())leaveSoon();if(!pinned)hideT=setTimeout(()=>hideCard(),260);});",
    "$('card').addEventListener('mouseleave',e=>{if(touchy(e))return;if(fv())leaveSoon();if(!pinned)hideT=setTimeout(()=>hideCard(),260);});")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 26 applied: waiting lines stack on desktop; a tap on a touch screen opens and pins a card')
