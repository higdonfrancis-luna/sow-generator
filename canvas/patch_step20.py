"""Step 20 on the Build canvas (Nov 2 2026), with sow/patch_step20.py: round-trip defects an independent reviewer
reproduced.
1. The hand-over says which lines wait for a product ("Needs ...") and the partner's choice for them, so the SOW steps
   keep that choice instead of turning the line off.
3. Start over resets the term to 12 months (it clears the Scope details, where the term is set).
4. The starting services follow the SOW steps' FSI answer ("Live and healthy": Implement Brand Concierge off, the
   discovery-to-answer workflow on), so picking FSI again matches the answer.
6. Every change hands the canvas over (not only Save and continue), so the browser's Back button to the SOW steps
   keeps canvas edits; a page restored from the back/forward cache reloads.
Run once on the step 18 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step20.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert '.off||' in html and 'function publish(' not in html, 'run this on the step 18 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

rep("let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',months:12,v:2,eff:null,fresh:false,cur:'USD'};",
    "let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',months:12,v:2,eff:null,fresh:false,cur:'USD',def:null};")
rep("fresh:s.fresh===true,cur:['USD','EUR','GBP','CAD','AUD'].includes(s.cur)?s.cur:'USD'};delete st.recover;",
    "fresh:s.fresh===true,cur:['USD','EUR','GBP','CAD','AUD'].includes(s.cur)?s.cur:'USD',def:s.def&&typeof s.def==='object'?s.def:null};delete st.recover;")
rep("const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}};",
    "/* every change is saved and handed over, so the SOW steps open with the canvas as it is now, even through the browser's Back button */\n"
    "const save=(pub=true)=>{try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}if(pub)publish();};")
rep("/* a line's starting state: on by default unless the play turns it off (Commerce starts without L03, FSI without C04), or turned on by the play (Brand Visibility on its own starts with C05) */\n"
    "const defOf=id=>{const pl=play()||{};return (!!DEF[id]&&!(pl.off||[]).includes(id))||(pl.on||[]).includes(id);};",
    "/* a line's starting state: on by default unless the play turns it off (Commerce starts without L03, FSI without C04), or turned on by the play (Brand Visibility on its own starts with C05);\n"
    "   an answer on the SOW steps can set it too (FSI, Brand Concierge live and healthy: F02 off, C04 on) */\n"
    "const defOf=id=>{const pl=play()||{},d=st.def&&st.def[pl.id];if(d&&typeof d[id]==='boolean')return d[id];return (!!DEF[id]&&!(pl.off||[]).includes(id))||(pl.on||[]).includes(id);};")
rep("if(ask.k==='over'){try{localStorage.removeItem(TOOL_KEY);localStorage.removeItem(HANDOFF);}catch(e){}st.eff=null;st.cur='USD';}st.play=null;",
    "if(ask.k==='over'){try{localStorage.removeItem(TOOL_KEY);localStorage.removeItem(HANDOFF);}catch(e){}st.eff=null;st.cur='USD';st.def=null;st.months=12;}st.play=null;")
rep("function handoff(step){const pl=play();if(!prods().length){toast('Add a product to the canvas first.');return;}\n"
    "  const lines=[];for(const o of [...prods(),...conns()]){const conn='a' in o;for(const l of all(o)){const L=LN[l];\n"
    "    lines.push({id:l,on:counted(l),name:L.name,",
    "/* the hand-over: the play, size, rate and every line (on, or waiting for a product with the partner's choice kept) */\n"
    "function publish(){const pl=play();if(!pl||!prods().length)return false;\n"
    "  const lines=[];for(const o of [...prods(),...conns()]){const conn='a' in o;for(const l of all(o)){const L=LN[l];\n"
    "    lines.push({id:l,on:counted(l),lock:!met(l),want:lineOn(l),name:L.name,")
rep("  try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines,managed:[...universe()],fresh:!!st.fresh,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));}catch(e){toast('This browser blocks saving, so the next step can\\'t open with your choices.');return;}\n"
    "  st.fresh=false;save();location.href='sow/#'+step;}",
    "  try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines,managed:[...universe()],fresh:!!st.fresh,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));return true;}catch(e){return false;}}\n"
    "function handoff(step){if(!prods().length){toast('Add a product to the canvas first.');return;}\n"
    "  save(false);if(!publish()){toast('This browser blocks saving, so the next step can\\'t open with your choices.');return;}\n"
    "  st.fresh=false;save(false);location.href='sow/#'+step;}")
rep("render();\ndocument.fonts&&document.fonts.ready.then(()=>{window.READY=true;});",
    "window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});\nrender();\ndocument.fonts&&document.fonts.ready.then(()=>{window.READY=true;});")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 20 applied: hand-over on every change, waiting lines keep their choice, FSI answer, Start over term')
