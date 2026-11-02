"""Step 21 on the Build canvas (Nov 2 2026), with sow/patch_step21.py: findings of the last verification pass.
- Create your own play hands over even with no products yet, so a fresh pick reaches the SOW steps through Back.
- A canvas with nothing saved takes the rate, size, term and currency from the SOW steps (an engagement started there).
- Two tabs: a canvas that comes back into view after another tab changed the tool reloads first.
- Outside the FSI play a line shows the name the SOW steps use (no financial-services wording): build.py now stores
  that name (nname) beside the catalog name.
- Create your own play starts the discovery-to-answer workflow (C04) off, as FSI with a new concierge does: Implement
  Brand Concierge's tests take the Brand Visibility questions, and the SOW steps flag the pair as overlapping.
Run once on the step 20 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step21.py sow/canvas/template.html
"""
import json
import os
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'function publish(' in html and 'lineName' not in html, 'run this on the step 20 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
# a canvas with nothing saved takes the rate, size, term and currency the SOW steps hold (an engagement started there)
rep("if(CUSTOM&&st.play===CUSTOM.id&&!st.on.length&&Array.isArray(s.recover))st.on=CUSTOM.products.filter(id=>P[id]&&s.recover.includes(P[id].name));}}catch(e){}",
    "if(CUSTOM&&st.play===CUSTOM.id&&!st.on.length&&Array.isArray(s.recover))st.on=CUSTOM.products.filter(id=>P[id]&&s.recover.includes(P[id].name));}\n"
    "  else{const t=JSON.parse(localStorage.getItem(TOOL_KEY)||'null');if(t&&typeof t==='object'){if(Number(t.rate)>0)st.rate=Number(t.rate);if(['small','typical','large'].includes(t.size))st.size=t.size;if(Number.isInteger(t.months)&&t.months>=1&&t.months<=120)st.months=t.months;if(['USD','EUR','GBP','CAD','AUD'].includes(t.currency))st.cur=t.currency;}}}catch(e){}")
rep("function publish(){const pl=play();if(!pl||!prods().length)return false;",
    "function publish(){const pl=play();if(!pl||(!prods().length&&!pl.custom))return false;")
rep("const save=(pub=true)=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}if(pub)publish();};",
    "let lastSaved=null;\n"
    "const save=(pub=true)=>{try{const j=JSON.stringify(st);localStorage.setItem(KEY,j);lastSaved=j;}catch(e){}if(pub)publish();};\n"
    "/* another tab changed this tool: come back to the latest instead of writing over it */\n"
    "const stale=()=>{try{const s=localStorage.getItem(KEY);return lastSaved!==null&&s!==null&&s!==lastSaved;}catch(e){return false;}};\n"
    "window.addEventListener('focus',()=>{if(stale())location.reload();});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&stale())location.reload();});")
rep("function row(l,extra){const L=LN[l],on=lineOn(l),off=!on&&!extra;",
    "/* outside the FSI play a line reads as on the SOW steps, without its financial-services wording */\n"
    "const lineName=l=>{const L=LN[l],pl=play();return L.nname&&!(pl&&pl.id==='fsi')?L.nname:L.name;};\n"
    "function row(l,extra){const L={...LN[l],name:lineName(l)},on=lineOn(l),off=!on&&!extra;")
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)

here = os.path.dirname(os.path.abspath(path))
# Create your own play starts C04 off
mp = os.path.join(here, 'catalog_map.json')
raw = open(mp, encoding='utf-8').read()
cmap = json.loads(raw)
assert json.dumps(cmap, ensure_ascii=False, indent=1) + '\n' == raw
cp = next(p for p in cmap['plays'] if p['id'] == 'custom')
assert 'off' not in cp
cp['off'] = ['C04']
open(mp, 'w', encoding='utf-8').write(json.dumps(cmap, ensure_ascii=False, indent=1) + '\n')

# build.py keeps the name a line has outside financial services
bp = os.path.join(here, 'build.py')
b = open(bp, encoding='utf-8').read()
old = ("        lines[lid] = {'id': lid, 'name': clean(x['name']), 'unit': x['unit'], 'low': x['low'], 'base': x['base'], 'high': x['high'],\n"
       "                      'url': x['source'], 'src': clean(x.get('sourceTitle') or x['source']), 'origin': 'sow'}\n")
assert b.count(old) == 1
new = old + ("        # the name outside the FSI play, as the SOW steps show it there (their neutral 'fsi' name pairs)\n"
             "        nname = x['name']\n"
             "        for o, w in (x.get('neutral') or {}).get('fsi', {}).get('name', []):\n"
             "            nname = nname.replace(o, w)\n"
             "        if nname != x['name']:\n"
             "            lines[lid]['nname'] = clean(nname)\n")
b = b.replace(old, new)
open(bp, 'w', encoding='utf-8').write(b)
print('canvas step 21 applied: empty-canvas hand-over, two-tab guard, neutral names, C04 off on your own play')
