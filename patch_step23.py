"""Step 23 of the SOW tool (Nov 2 2026): the last verification (11 agents on step 22; 9 confirmed, none refuted). Each
fix has a check in sow/test_review_nov2.js; the canvas half is sow/canvas/patch_step23.py.
- A partner who deletes a context phrase from a line's text (for example the Optimize at Edge sentence in the AEM
  build's assumptions) keeps the edit: only this play's own wording counts as the catalog's. On Create your own play,
  where Brand Visibility can come and go, the texts are reworded once when it does, and edits stay.
- A page reloading to catch up with another tab takes no click or key at all (Enter on a focused Build or Save and
  continue no longer writes the old state back).
Run once on the step 22 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step23.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'reloadNow' in html and 'rewordAt' not in html, 'run this on the step 22 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# only this play's own wording counts as the catalog's
rep("/* a text in any context's wording (with or without Brand Visibility, in or outside financial services) still counts as the catalog's */\n"
    "function variants(s,k,t){if(!s||!s.neutral||typeof t!=='string')return [t];const fl=Object.keys(s.neutral),out=new Set([t]);for(let m=1;m<1<<fl.length;m++){let x=t;fl.forEach((f,i)=>{if(m&1<<i)for(const [o,w] of (s.neutral[f][k]||[]))x=x.split(o).join(w);});out.add(x);}return [...out];}\n",
    "/* the catalog's wording of a text, as stored and as this play reads it; a partner who deletes a context phrase has edited it */\n"
    "function variants(s,k,t,p){return typeof t!=='string'?[t]:[...new Set([t,neutralize(s,p,t,k)])];}\n")
rep("flatMap(x=>variants(s,k,x))", "flatMap(x=>variants(s,k,x,p))")
rep("flatMap(x=>variants(c,key,x))", "flatMap(x=>variants(c,key,x,p))")

# Create your own play: Brand Visibility coming or going rewords the catalog texts once; edits stay
rep("function applyHandoff(){let h=null;", "function applyHandoff(){const wasBV=CUSTOM_BV;let h=null;")
rep(" syncBands(p);\n try{localStorage.removeItem(HANDOFF);}catch(e){}}\n",
    " /* Brand Visibility came or went on your own play: each text still in the catalog's wording for before takes the wording for now */\n"
    " if(p==='custom'&&wasBV!==CUSTOM_BV)rewordAt(wasBV);\n"
    " syncBands(p);\n try{localStorage.removeItem(HANDOFF);}catch(e){}}\n"
    "function rewordAt(was){const now=CUSTOM_BV;for(const s of catalog().filter(x=>x.plays.includes('custom'))){const r=state.estimates.custom[s.id];if(!r||isCustom(s)||!s.neutral)continue;\n"
    " for(const k of TEXT_KEYS){CUSTOM_BV=was;const old=[s[k],...BAND_ORDER.map(x=>bandText(s,x,k))].filter(x=>typeof x==='string').map(x=>neutralize(s,'custom',x,k));CUSTOM_BV=now;if(old.includes(r[k]))r[k]=lineText(s,'custom',r.band,k);}}}\n")

# a page reloading to catch up takes no click or key
rep("const reloadNow=()=>{reloading=true;document.documentElement.style.pointerEvents='none';location.reload();};",
    "const reloadNow=()=>{reloading=true;document.documentElement.style.pointerEvents='none';location.reload();};\n"
    "for(const t of ['click','keydown','input','change','submit'])document.addEventListener(t,e=>{if(reloading){e.preventDefault();e.stopImmediatePropagation();}},true);")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 23 applied: context edits kept, no input while catching up')
