"""Step 29 on the Build canvas (Nov 3 2026): what a focused verification of step 28 confirmed, on the canvas.
The SOW steps' half is sow/patch_step29.py.
- A choice made on the canvas for an outside system's service (a line taken out, or one added) now reaches the
  engagement even after the system is removed: the hand-over carries the lines of the play's outside systems that are
  off the canvas, waiting, with the partner's choice. Added again, the system comes back the same after a trip to
  Services, the Back button, another tab or a draft opened elsewhere (step 28 lost the canvas's choice on those paths).
- Safari and Firefox on a Mac clear the focus when a button is pressed, so once the focus was inside the Add outside
  system menu, one click on its button closed the menu on the press and opened it again on the click. A press inside
  the menu or on its button no longer counts as the focus leaving.
Run once on the step 28 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step29.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert "$('outwrap').addEventListener('focusout'" in html and 'outDown' not in html, 'run this on the step 28 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# the hand-over carries the choice for the services of outside systems off the canvas
rep("L.ext?'Also needs '+L.ext+'.':''].filter(Boolean).join(' ')});}}\n",
    "L.ext?'Also needs '+L.ext+'.':''].filter(Boolean).join(' ')});}}\n"
    "  /* outside systems off the canvas (step 29): their services wait with the partner's choice, so the engagement keeps it while the system is off */\n"
    "  if(!pl.custom){const seen=new Set(lines.map(x=>x.id)),ids=[...pl.products,...(pl.outside||[])];\n"
    "    for(const x of (pl.outside||[]).filter(id=>!has(id)))for(const c of C.filter(c=>(c.a===x||c.b===x)&&ids.includes(c.a)&&ids.includes(c.b)))for(const l of all(c)){if(seen.has(l))continue;seen.add(l);const L=LN[l];\n"
    "      lines.push({id:l,on:false,lock:true,want:lineOn(l),name:L.name,unit:L.unit,low:L.low,base:L.base,high:L.high,url:L.url,src:L.src,scope:L.scope||'',stage:L.unit==='monthly'?'Optimize':'Connect',prereqs:''});}}\n")

# a press inside the menu or on its button is not the focus leaving
rep("$('outwrap').addEventListener('focusout',e=>{if(!$('out-menu').hidden&&!$('outwrap').contains(e.relatedTarget))openOut(false);});",
    "/* a press inside the menu or on its button is not the focus leaving (Safari and Firefox on a Mac clear the focus on a press) */\n"
    "let outDown=false;$('outwrap').addEventListener('pointerdown',()=>{outDown=true;});\n"
    "for(const t of ['pointerup','pointercancel'])document.addEventListener(t,()=>setTimeout(()=>{outDown=false;},0),true);document.addEventListener('keydown',()=>{outDown=false;},true);\n"
    "$('outwrap').addEventListener('focusout',e=>{if(!outDown&&!$('out-menu').hidden&&!$('outwrap').contains(e.relatedTarget))openOut(false);});")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 29 applied: choices for outside systems off the canvas reach the engagement; a press in the menu keeps it open')
