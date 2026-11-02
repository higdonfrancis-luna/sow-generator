"""Step 21 of the SOW tool (Nov 2 2026): the last verification pass (a workflow of 28 agents: the earlier reviewer's
scripts re-run, three independent breakers, an adversarial re-check of every finding, a completeness critic). Every
finding was reproduced twice; each fix has a check in sow/test_review_nov2.js. The canvas half is
sow/canvas/patch_step21.py.
- A product taken off Create your own play and added back keeps the Services edits on its lines (the hours, text,
  rate and choice of a line wait with it, out of these steps), unless the play was picked again.
- Picking Create your own play again with no products yet reaches these steps too (the canvas hands over an empty
  canvas), so Back can't bring the old engagement back.
- The generic Coworker Skills are "kept" beside specialized Skills only when the partner keeps them, so the order of
  adding products no longer changes the total.
- Old drafts (version 2 and 3, or 4 before hours were flagged) keep hours that match no band as the partner's hours,
  with a reason asked, instead of resetting them to the band.
- A new engagement takes the rate, size, term and currency the canvas holds (after Start over there, or Back), and a
  canvas with nothing saved takes them from the SOW steps.
- The step is kept in the address, so Back returns to the step the partner left.
- A canvas hand-over is applied when it is new, not only when its clock time is later.
- Wording switches back fully when Brand Visibility returns to Create your own play, even on a line with one edited
  text.
- Rates keep two decimals, like hours; the partner's own service takes hours like 12.25.
- Live but needs fixes: the advice no longer offers "remove it" (the readiness list then asks to add it back).
- No services and no rate: the totals ask for a rate, as on the canvas.
- Two tabs: a tab that comes back into view after another tab changed the tool reloads, so it never writes over the
  newer state.
Run once on the step 20 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step21.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'globalRate' in html and 'function variants(' not in html, 'run this on the step 20 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# lines whose product left the canvas wait with their edits; picking the play again starts them over
rep(" const before=state.canvas.filter(c=>c.plays.includes(p)).map(c=>c.id);\n", " const before=state.canvas.filter(c=>c.plays.includes(p));\n")
rep(" for(const id of before)if(!state.canvas.some(c=>c.id===id))delete state.estimates[p][id];\n",
    " /* a line whose product left the canvas waits, out of these steps, with its choice and its edits, and comes back with the product; picking the play again starts it over */\n"
    " for(const c of before)if(!state.canvas.some(x=>x.id===c.id)){if(h.fresh===true)delete state.estimates[p][c.id];else state.canvas.push({...c,locked:true});}\n")
rep("if(managed.has(id))r.on=!!(l&&(l.lock===true?l.want:l.on));else if(h.fresh===true)r.on=STARTERS[p].includes(s.id);}\n",
    "if(managed.has(id)){if(l)r.on=!!(l.lock===true?l.want:l.on);}else if(h.fresh===true)r.on=STARTERS[p].includes(s.id);}\n")

# a hand-over is new when its time differs (a clock set back still counts)
rep("if(!h||typeof h!=='object'||!validPlay(h.play)||!Array.isArray(h.lines)||!(Number(h.at)>state.handoffAt))return;",
    "if(!h||typeof h!=='object'||!validPlay(h.play)||!Array.isArray(h.lines)||!Number.isFinite(Number(h.at))||Number(h.at)===state.handoffAt)return;")

# the generic Coworker Skills are kept beside specialized Skills only by the partner's choice; a waiting line is not on the canvas
rep("special=lines.some(x=>SPECIAL_SKILLS.includes(baseId(x))&&est[x.id].on);",
    "special=lines.some(x=>!x.locked&&SPECIAL_SKILLS.includes(baseId(x))&&est[x.id].on);")
rep("if(id==='CW03'){c.keep.CW03=on;if(on||!special)c.ls.CW03=on;continue;}",
    "if(id==='CW03'){if(special)c.keep.CW03=on;else delete c.keep.CW03;if(on||!special)c.ls.CW03=on;continue;}")

# a new engagement takes the canvas's rate, size, term and currency (the canvas does the same the other way, canvas/patch_step21.py)
rep("{const q=new URLSearchParams(location.search).get('play');if(validPlay(q))state.play=q;}\napplyHandoff();",
    "{const q=new URLSearchParams(location.search).get('play');if(validPlay(q))state.play=q;}\n"
    "/* a new engagement takes the rate, size, term and currency the canvas already holds (after Start over there, or Back) */\n"
    "try{if(!localStorage.getItem(KEY)&&!localStorage.getItem(OLD_KEY)){const c=JSON.parse(localStorage.getItem(CANVAS_KEY)||'null');if(c&&typeof c==='object'&&c.v===2){if(Number(c.rate)>0)state.rate=globalRate(c.rate);if(validSize(c.size))state.size=c.size;if(Number.isInteger(c.months)&&c.months>=1&&c.months<=120)state.months=c.months;if(['USD','EUR','GBP','CAD','AUD'].includes(c.cur))state.currency=c.cur;}}}catch(e){}\n"
    "applyHandoff();")

# old drafts keep hours that match no band as the partner's
rep("r.hoursEdited=original.hoursEdited===true;",
    "r.hoursEdited=original.hoursEdited===true||(typeof original.hoursEdited!=='boolean'&&!isCustom(c)&&!BAND_ORDER.some(b=>sizeHours(c,b)===r.hours));")

# a text in any context's wording still counts as the catalog's
rep("/* a line takes its band's hours unless the partner typed them, and its band's wording in each of the five texts the partner has not rewritten */\n",
    "/* a text in any context's wording (with or without Brand Visibility, in or outside financial services) still counts as the catalog's */\n"
    "function variants(s,k,t){if(!s||!s.neutral||typeof t!=='string')return [t];const fl=Object.keys(s.neutral),out=new Set([t]);for(let m=1;m<1<<fl.length;m++){let x=t;fl.forEach((f,i)=>{if(m&1<<i)for(const [o,w] of (s.neutral[f][k]||[]))x=x.split(o).join(w);});out.add(x);}return [...out];}\n"
    "/* a line takes its band's hours unless the partner typed them, and its band's wording in each of the five texts the partner has not rewritten */\n")
rep("const known=[s[k],...BAND_ORDER.map(x=>bandText(s,x,k))].filter(x=>typeof x==='string').flatMap(x=>[x,neutralize(s,p,x,k)]);",
    "const known=[s[k],...BAND_ORDER.map(x=>bandText(s,x,k))].filter(x=>typeof x==='string').flatMap(x=>variants(s,k,x));")
rep("...(PRIOR19[c.id]?.[key]||[])].filter(x=>typeof x==='string').flatMap(x=>[x,neutralize(c,p,x,key)]);",
    "...(PRIOR19[c.id]?.[key]||[])].filter(x=>typeof x==='string').flatMap(x=>variants(c,key,x));")

# rates keep two decimals; own services take any hours
rep("const globalRate=v=>{const r=amount(v,'');return r===''||!(r>0)?'':r;};\n",
    "const globalRate=v=>{const r=amount(v,'');return r===''||!(r>0)?'':cents(r);};\n"
    "const lineRate=v=>{const r=amount(v,'');return r===''?'':cents(r);};\n")
rep("r[k]=k==='hours'?cents(Number(amount(node.value,0)||0)):k==='rate'?amount(node.value,''):text(node.value);",
    "r[k]=k==='hours'?cents(Number(amount(node.value,0)||0)):k==='rate'?lineRate(node.value):text(node.value);")
rep("r.rate=amount(original.rate,'');r.cadence=", "r.rate=lineRate(original.rate);r.cadence=")
rep('<input name="own-hours" type="number" min="0" step="0.5" value="16" required>', '<input name="own-hours" type="number" min="0" step="any" value="16" required>')
rep('<input id="custom-hours" type="number" min="0" step="0.5" value="16" required>', '<input id="custom-hours" type="number" min="0" step="any" value="16" required>')

# advice that leads somewhere
rep("so rewrite its scope to the remediation work, or remove it.')", "so rewrite its scope to the remediation work, or change the answer on the Scope step.')")

# no services and no rate: ask for a rate, as the canvas does
rep("function totals(){let oneHours=0,monthHours=0,oneFee=0,monthFee=0,missingOne=0,missingMonth=0;for(const l of selectedLines()){",
    "function totals(){let oneHours=0,monthHours=0,oneFee=0,monthFee=0,missingOne=0,missingMonth=0;const sel=selectedLines();if(!sel.length&&state.rate===''){missingOne=1;missingMonth=1;}for(const l of sel){")

# the step stays in the address, so Back returns to it
rep("function go(next){step=next;render();", "function go(next){step=next;try{history.replaceState(null,'','#'+next);}catch(e){}render();")

# two tabs: coming back into view after another tab changed the tool reloads first
rep("function save(){try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.removeItem(OLD_KEY);syncCanvas();}",
    "let lastSaved=null;\nfunction save(){try{const j=JSON.stringify(state);localStorage.setItem(KEY,j);lastSaved=j;localStorage.removeItem(OLD_KEY);syncCanvas();}")
rep("window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});\n",
    "window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});\n"
    "/* another tab changed this tool (these steps, or a new canvas hand-over): come back to the latest instead of writing over it */\n"
    "const stale=()=>{try{const s=localStorage.getItem(KEY),h=JSON.parse(localStorage.getItem(HANDOFF)||'null');return (lastSaved!==null&&s!==null&&s!==lastSaved)||(!!h&&typeof h==='object'&&Number.isFinite(Number(h.at))&&Number(h.at)!==state.handoffAt);}catch(e){return false;}};\n"
    "window.addEventListener('focus',()=>{if(stale())location.reload();});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&stale())location.reload();});\n")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 21 applied: findings of the last verification pass')
