"""Step 22 of the SOW tool (Nov 2 2026): findings of the focused verification of step 21 (14 agents; 11 confirmed by a
second agent each, none refuted). Each fix has a check in sow/test_review_nov2.js. The canvas half is
sow/canvas/patch_step22.py.
- Picking a play again (Change play) starts its services over completely, on every path: each line returns to its
  starting text, band, hours and rate, not only its on or off choice (the partner's own services stay under Add
  service, off). The canvas says so in its Change play dialog.
- An edit to a line's Assumptions or Excluded work alone is kept through reloads, trips and products leaving and
  returning: a band change replaces only texts that are still the catalog's.
- The generic Coworker Skills kept beside specialized Skills stay kept while those Skills wait for a product.
- Old drafts without hours flags keep hours that equal another band, as that band (a draft that saved a size keeps
  the size reset it had).
- Two tabs: these steps no longer rewrite the canvas's "play just picked" mark when it is already spent, so switching
  tabs with no change doesn't reload them; Start over in another tab is seen; a page reloading to catch up takes no
  more input; a ?play= link applies its play once.
- A draft whose canvas had no products opens with a message that fits; the empty Services step on Create your own play
  points to Build and to the partner's own services.
Run once on the step 21 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step22.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'function variants(' in html and 'reloadNow' not in html, 'run this on the step 21 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# Change play starts the play's services over, on every path
rep(" /* the canvas sets on or off only the lines it shows; a service added here that the canvas doesn't show keeps its choice, unless the play was just picked again */\n",
    " /* the play picked again starts over: every line back to its starting text, band, hours and rate (the partner's own services stay under Add service, off) */\n"
    " if(h.fresh===true)for(const id of Object.keys(state.estimates[p]||{}))if(!/^CUSTOM/.test(id))delete state.estimates[p][id];\n"
    " /* the canvas sets on or off only the lines it shows; a service added here that the canvas doesn't show keeps its choice, unless the play was just picked again */\n")

# a partner's text in any of the five fields is kept; only the catalog's own texts follow a band
rep("if(!r.scopeChanged||known.includes(r[k]))r[k]=lineText(s,p,b,k);}}", "if(known.includes(r[k]))r[k]=lineText(s,p,b,k);}}")
rep("     if(known.includes(o))r[key]=lineText(c,p,r.band,key);else{r[key]=o;if(['scope','deliverable','acceptance'].includes(key))edited=true;}}",
    "     if(known.includes(o))r[key]=lineText(c,p,r.band,key);else{r[key]=o;edited=true;}}")

# the generic Coworker Skills stay kept while the specialized Skills wait for their product
rep("special=lines.some(x=>!x.locked&&SPECIAL_SKILLS.includes(baseId(x))&&est[x.id].on);",
    "special=lines.some(x=>!x.locked&&SPECIAL_SKILLS.includes(baseId(x))&&est[x.id].on),waiting=lines.some(x=>x.locked&&SPECIAL_SKILLS.includes(baseId(x))&&est[x.id].on);")
rep("if(id==='CW03'){if(special)c.keep.CW03=on;else delete c.keep.CW03;if(on||!special)c.ls.CW03=on;continue;}",
    "if(id==='CW03'){if(special)c.keep.CW03=on;else if(!waiting)delete c.keep.CW03;if(on||!special)c.ls.CW03=on;continue;}")

# old drafts without hours flags keep hours that equal another band, as that band
rep("r.bandSet=original.bandSet===true;",
    "r.bandSet=original.bandSet===true;if(typeof original.hoursEdited!=='boolean'&&!s.size&&!isCustom(c)&&!r.hoursEdited&&r.band!==d.size&&sizeHours(c,r.band)===r.hours)r.bandSet=true;")

# the canvas's play-just-picked mark: spent once, not rewritten when already spent
rep("if(c.play===state.play)delete c.fresh;", "if(c.play===state.play&&c.fresh===true)c.fresh=false;")

# two tabs: Start over in another tab is seen; a page reloading to catch up takes no more input
rep("let lastSaved=null;\nfunction save(){try{",
    "let lastSaved=null,reloading=false;\nconst reloadNow=()=>{reloading=true;document.documentElement.style.pointerEvents='none';location.reload();};\nfunction save(){if(reloading)return;try{")
rep("return (lastSaved!==null&&s!==null&&s!==lastSaved)", "return (lastSaved!==null&&s!==lastSaved)")
rep("window.addEventListener('focus',()=>{if(stale())location.reload();});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&stale())location.reload();});",
    "window.addEventListener('focus',()=>{if(!reloading&&stale())reloadNow();});document.addEventListener('visibilitychange',()=>{if(!reloading&&document.visibilityState==='visible'&&stale())reloadNow();});")

# a ?play= link applies its play once
rep("{const q=new URLSearchParams(location.search).get('play');if(validPlay(q))state.play=q;}",
    "{const q=new URLSearchParams(location.search).get('play');if(validPlay(q))state.play=q;if(location.search)try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}}")

# messages that fit an empty canvas
rep("toast(state.play==='custom'&&!state.customProducts.length&&!state.customNames.length?'Draft opened. Its products could not be read: add them again on the Build canvas.':'Draft opened. Build shows its play and service choices.')",
    "toast(state.play==='custom'&&!state.customProducts.length&&!state.customNames.length?'Draft opened with no products on the canvas: add them on Build and their services come back as they were.':'Draft opened. Build shows its play and service choices.')")
rep("'<div class=\"empty\">No services selected. Add a service or use the starting scope.</div>'",
    "(state.play==='custom'?'<div class=\"empty\">No services yet. Add products on the Build canvas, or add your own service.</div>':'<div class=\"empty\">No services selected. Add a service or use the starting scope.</div>')")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 22 applied: findings of the step 21 verification')
