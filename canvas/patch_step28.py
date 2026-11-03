"""Step 28 on the Build canvas (Nov 3 2026): what an independent verification of step 27 confirmed, on the canvas.
The SOW steps' half is sow/patch_step28.py, the places and wording sow/canvas/data_step28.py.
- The Add outside system menu works like a menu from the keyboard: Escape and adding a system put the focus back on
  the button, Remove from canvas too, and the menu closes when the focus leaves it (it stayed open over the boxes the
  focus moved to).
- While the menu is open, hovering a box or an i opens no card under it, and a click on one closes the menu first.
- With every outside system on, the menu's note sits in its header, indented like the rest.
- On a 320-pixel phone each name stays on one line beside its icon, with "Connects to" beneath.
- On a phone held sideways the menu shows its items (its height cap left none in full), and the page scrolls to the rest.
- The Outside system badge on a connection card follows the line's style: dotted for the warehouse, cloud storage and
  CRM, solid for the CDN.
- Remove from canvas clears a kept line's keep with the system, as the SOW steps do, so the system added again comes
  back the same on every path.
Run once on the step 27 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step28.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'outMenuHTML' in html and "$('outwrap').addEventListener('focusout'" not in html, 'run this on the step 27 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
FOCUS = "$('out-btn').focus({preventScroll:true});"

# focus goes back to the button after adding, removing or Escape; the menu closes when the focus leaves it
rep("if(!(st.out||[]).includes(id))st.out=[...(st.out||[]),id];openOut(false);render();}",
    "if(!(st.out||[]).includes(id))st.out=[...(st.out||[]),id];openOut(false);render();" + FOCUS + "}")
rep("function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);hideCard(true);render();}",
    "function removeOutside(id){st.out=(st.out||[]).filter(x=>x!==id);for(const c of C.filter(c=>c.a===id||c.b===id))for(const l of all(c))delete st.keep[l];hideCard(true);render();" + FOCUS + "}")
rep("document.addEventListener('keydown',e=>{if(e.key==='Escape'){openAdd(false);openOut(false);const had=!!card;",
    "document.addEventListener('keydown',e=>{if(e.key==='Escape'){const outOpen=!$('out-menu').hidden;openAdd(false);openOut(false);if(outOpen)" + FOCUS + "const had=!!card;")
rep("$('out-menu').addEventListener('click',e=>{e.stopPropagation();const a=e.target.closest('[data-out]');if(a)addOutside(a.dataset.out);});",
    "$('out-menu').addEventListener('click',e=>{e.stopPropagation();const a=e.target.closest('[data-out]');if(a)addOutside(a.dataset.out);});\n"
    "$('outwrap').addEventListener('focusout',e=>{if(!$('out-menu').hidden&&!$('outwrap').contains(e.relatedTarget))openOut(false);});")
rep('<div class="addmenu" id="out-menu" role="menu" hidden></div>', '<div class="addmenu" id="out-menu" role="menu" tabindex="-1" hidden></div>')

# while the menu is open, no card opens under it; a click on a box or an i closes it first
rep("  el.addEventListener('mouseenter',e=>{if(touchy(e))return;\n    if(fv()){clearTimeout(fT);",
    "  el.addEventListener('mouseenter',e=>{if(touchy(e)||!$('out-menu').hidden)return;\n    if(fv()){clearTimeout(fT);")
rep("  el.addEventListener('click',e=>{e.stopPropagation();\n    if(fv()&&k==='p'){",
    "  el.addEventListener('click',e=>{e.stopPropagation();if(!$('out-menu').hidden)openOut(false);\n    if(fv()&&k==='p'){")

# every system on: the note sits in the header, like the Add product menu's
rep("  if(!rest.length)return h+`<p class=\"none\">Every outside system for this play is on your canvas.</p>`;",
    "  if(!rest.length)return `<div class=\"hd\"><div class=\"k\">Add an outside system</div><p>Every outside system for this play is on your canvas.</p></div>`;")

# the badge follows the line's style
rep("<p class=\"kind\"><b class=\"${o.kind==='partner'?'pw':o.kind==='platform'?'pf':''}\">",
    "<p class=\"kind\"><b class=\"${(o.line||o.kind)==='partner'?'pw':(o.line||o.kind)==='platform'?'pf':''}\">")

# a 320-pixel phone keeps each name on one line; a phone held sideways shows the items
rep(".card h4 svg{vertical-align:-4px;margin-right:7px}.btn.outadd{display:flex;align-items:center;gap:8px}\n</style>",
    ".card h4 svg{vertical-align:-4px;margin-right:7px}.btn.outadd{display:flex;align-items:center;gap:8px}\n"
    "#out-menu:focus{outline:none}#out-menu{max-height:max(270px,min(640px,calc(100vh - 230px)))}\n"
    "@media (max-width:360px){#out-menu .it2{grid-template-columns:1fr}#out-menu .it2 .nm{white-space:nowrap}#out-menu .it2 .ctag{justify-self:start;margin-top:2px}}\n</style>")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 28 applied: the menu from the keyboard, no card under it, the note, phones, the badge, keeps on removal')
