"""Step 23 on the Build canvas (Nov 2 2026), with sow/patch_step23.py: the last verification of step 22.
- A play picked again keeps the bands the prompt count sets (the Scope details stay), so Build and Services agree
  before the first trip; only the Services edits wait for the SOW steps to clear them.
- Every pick and Start over hands the canvas over afresh, so picking the same play after Start over reaches the SOW
  steps.
- A page reloading to catch up with another tab takes no click or key at all.
Run once on the step 22 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step23.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'reloadNow' in html and "e.p&&e.b?{b:e.b,p:1}" not in html, 'run this on the step 22 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
rep("const effOf=id=>{if(st.fresh)return null;const e=st.eff&&st.eff.plays&&st.eff.plays[st.play];return e&&e[id]&&typeof e[id]==='object'?e[id]:null;};",
    "/* a play just picked keeps only the bands the prompt count sets (the Scope details stay); the SOW steps clear its Services edits */\n"
    "const effOf=id=>{const all=st.eff&&st.eff.plays&&st.eff.plays[st.play],e=all&&all[id]&&typeof all[id]==='object'?all[id]:null;if(!e)return null;return st.fresh?(e.p&&e.b?{b:e.b,p:1}:null):e;};")
rep("st.ls={};st.keep={};st.fresh=true;moreOpen={};", "st.ls={};st.keep={};st.fresh=true;st.pubSig=null;moreOpen={};")
rep("st.months=12;}st.play=null;", "st.months=12;}st.pubSig=null;st.play=null;")
rep("const reloadNow=()=>{reloading=true;document.documentElement.style.pointerEvents='none';location.reload();};",
    "const reloadNow=()=>{reloading=true;document.documentElement.style.pointerEvents='none';location.reload();};\n"
    "for(const t of ['click','keydown','input','change','submit'])document.addEventListener(t,e=>{if(reloading){e.preventDefault();e.stopImmediatePropagation();}},true);")
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 23 applied: prompt bands on a re-pick, a fresh hand-over on every pick, no input while catching up')
