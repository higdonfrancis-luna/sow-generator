"""Step 22 on the Build canvas (Nov 2 2026), with sow/patch_step22.py: findings of the focused verification of step 21.
- A play just picked shows its lines at their starting hours, rates and cadence (the SOW steps reset that play's
  edits when they take the hand-over), and the Change play dialog says edits are cleared too.
- The canvas hands over only when something changed, so switching tabs with no change doesn't make the other tab
  reload; Save and continue always hands over.
- Two tabs: Start over in another tab is seen; a page reloading to catch up takes no more input.
Run once on the step 21 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step22.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'lineName' in html and 'reloadNow' not in html, 'run this on the step 21 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# a play just picked: no Services edits shown until the SOW steps take the fresh hand-over (they reset them)
rep("const effOf=id=>{const e=st.eff&&st.eff.plays&&st.eff.plays[st.play];",
    "const effOf=id=>{if(st.fresh)return null;const e=st.eff&&st.eff.plays&&st.eff.plays[st.play];")
rep("'One play per statement of work, so this clears the canvas and every service choice. Your rate and size stay.'",
    "'One play per statement of work, so this clears the canvas and every service choice and edit. Your rate, size and Scope details stay.'")

# hand over only on a change; Save and continue always hands over
rep("let lastSaved=null;\nconst save=(pub=true)=>{try{const j=JSON.stringify(st);localStorage.setItem(KEY,j);lastSaved=j;}catch(e){}if(pub)publish();};",
    "let lastSaved=null,reloading=false;\n"
    "const reloadNow=()=>{reloading=true;document.documentElement.style.pointerEvents='none';location.reload();};\n"
    "const save=(pub=true)=>{if(reloading)return;if(pub)publish();try{const j=JSON.stringify(st);localStorage.setItem(KEY,j);lastSaved=j;}catch(e){}};")
rep("const stale=()=>{try{const s=localStorage.getItem(KEY);return lastSaved!==null&&s!==null&&s!==lastSaved;}catch(e){return false;}};",
    "const stale=()=>{try{const s=localStorage.getItem(KEY);return lastSaved!==null&&s!==lastSaved;}catch(e){return false;}};")
rep("window.addEventListener('focus',()=>{if(stale())location.reload();});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&stale())location.reload();});",
    "window.addEventListener('focus',()=>{if(!reloading&&stale())reloadNow();});document.addEventListener('visibilitychange',()=>{if(!reloading&&document.visibilityState==='visible'&&stale())reloadNow();});")
rep("function publish(){const pl=play();",
    "/* a short signature of what is handed over, so an unchanged canvas doesn't hand over again */\n"
    "const sigOf=t=>{let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36)+'.'+t.length.toString(36);};\n"
    "function publish(force){const pl=play();")
rep("  try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines,managed:[...universe()],fresh:!!st.fresh,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));return true;}catch(e){return false;}}",
    "  const body={v:1,play:pl.id,size:st.size,rate:st.rate||'',lines,managed:[...universe()],fresh:!!st.fresh,products:prods().map(p=>p.id),names:prods().map(p=>p.name)},sig=sigOf(JSON.stringify(body));\n"
    "  if(!force&&sig===st.pubSig)return true;\n"
    "  try{localStorage.setItem(HANDOFF,JSON.stringify({...body,at:Date.now()}));st.pubSig=sig;return true;}catch(e){return false;}}")
rep("  save(false);if(!publish()){toast(", "  save(false);if(!publish(true)){toast(")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 22 applied: fresh picks show starting values, hand-over only on change, two-tab fixes')
