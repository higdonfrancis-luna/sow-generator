"""Step 20 of the SOW tool (Nov 2 2026): defects an independent reviewer reproduced in the round trip between the
Build canvas and these steps after step 17 (most were older; each now has a test in sow/test_review_nov2.js). The
canvas half is sow/canvas/patch_step20.py.
1. A line whose products aren't on the canvas (it shows "Needs ..." there) is no longer offered on the Services step,
   and it keeps its on or off choice while it waits, so it comes back as it was when its product returns.
2. Picking the play again on the canvas clears the partner's own services too (they stay under Add service), as
   Change play says it clears every service choice; the canvas already left them out.
4. The FSI answer "Live and healthy" sets the canvas's starting services too (Implement Brand Concierge off, the
   discovery-to-answer workflow on), so picking FSI again keeps them in step with the answer.
5. "Live but needs fixes" with Implement Brand Concierge removed is caught before the SOW is issued.
6. The canvas hands over its state on every change (canvas half), so the browser's Back button no longer loses canvas
   edits; this page clears the canvas's "play just picked" mark once it has applied it, and a page restored from the
   browser's back/forward cache reloads.
7. A global rate of 0 is no rate, here as on the canvas (a line's own rate can still be 0).
8. Build from these steps shows the play picker when the canvas holds no play and this engagement never came from it
   (an empty browser), instead of the default play.
10. Typed hours keep two decimals, so the SOW's fee table multiplies out.
Run once on the step 19 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step20.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const PRIOR19=' in html and 'globalRate' not in html, 'run this on the step 19 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# 1. locked lines: kept with their choice, out of the Services step
rep("concept,bands:c.bands&&typeof c.bands==='object'?c.bands:null};};",
    "concept,bands:c.bands&&typeof c.bands==='object'?c.bands:null,locked:c.locked===true};};")
rep("  state.canvas.push(canvasLine(t?{...t,id:'CANVAS-'+l.id,name:neutralize(t,p,t.name,'name'),basis:neutralize(t,p,t.basis,'basis'),source:t.source,sourceTitle:t.sourceTitle}:"
    "{...l,id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src,concept:true,deliverable:'',acceptance:'',assumptions:typeof l.prereqs==='string'?l.prereqs:'',exclusions:''},[p]));}",
    "  state.canvas.push(canvasLine({...(t?{...t,id:'CANVAS-'+l.id,name:neutralize(t,p,t.name,'name'),basis:neutralize(t,p,t.basis,'basis'),source:t.source,sourceTitle:t.sourceTitle}:"
    "{...l,id:'CANVAS-'+l.id,source:l.url,sourceTitle:l.src,concept:true,deliverable:'',acceptance:'',assumptions:typeof l.prereqs==='string'?l.prereqs:'',exclusions:''}),locked:l.lock===true},[p]));}")
rep("if(managed.has(id))r.on=!!(l&&l.on);else if(h.fresh===true)r.on=STARTERS[p].includes(s.id);}\n",
    "if(managed.has(id))r.on=!!(l&&(l.lock===true?l.want:l.on));else if(h.fresh===true)r.on=STARTERS[p].includes(s.id);}\n"
    " /* 2. the play picked again: the partner's own services start off too, and stay under Add service */\n"
    " if(h.fresh===true)for(const s of state.custom.filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(r)r.on=false;}\n")
rep("const entries=()=>catalog().filter(s=>s.plays.includes(state.play));",
    "/* a line whose products left the canvas (it shows Needs ... there) waits out of these steps, with its choice kept */\n"
    "const entries=()=>catalog().filter(s=>s.plays.includes(state.play)&&!s.locked);")

# 4 and 6: what the canvas also takes from here
rep(" c.rate=state.rate===''?0:Number(state.rate);c.size=state.size;c.months=state.months;c.cur=state.currency;c.v=2;c.eff=canvasEff();\n",
    " c.rate=state.rate===''?0:Number(state.rate);c.size=state.size;c.months=state.months;c.cur=state.currency;c.v=2;c.eff=canvasEff();\n"
    " /* the FSI answer sets the canvas's starting services; the canvas's play-just-picked mark is spent once these steps hold that play */\n"
    " c.def={fsi:state.fsiState==='healthy'?{F02:false,C04:true}:{}};if(c.play===state.play)delete c.fresh;\n")

# 5. live but needs fixes, without the remediation
rep("  if(state.fsiState==='new'&&!on)out.push('Brand Concierge is not live yet, but Implement Brand Concierge is off: add it or change the answer on the Scope step.');",
    "  if(state.fsiState==='new'&&!on)out.push('Brand Concierge is not live yet, but Implement Brand Concierge is off: add it or change the answer on the Scope step.');\n"
    "  if(state.fsiState==='remediate'&&!on)out.push('Brand Concierge is live but needs fixes, and Implement Brand Concierge is off: add it and rewrite its scope as the remediation work, or change the answer on the Scope step.');")

# 7. a global rate of 0 is no rate
rep("const cents=v=>Math.round(Number((Number(v)*100).toPrecision(15)))/100;\n",
    "const cents=v=>Math.round(Number((Number(v)*100).toPrecision(15)))/100;\n"
    "/* the partner's rate: blank, or more than 0 (a line's own rate can be 0) */\n"
    "const globalRate=v=>{const r=amount(v,'');return r===''||!(r>0)?'':r;};\n")
rep("d.rate=amount(s.rate,'');", "d.rate=globalRate(s.rate);")
rep("k==='rate'?amount(node.value,''):text(node.value);if(k==='fsiState')", "k==='rate'?globalRate(node.value):text(node.value);if(k==='fsiState')")
rep("$('service-rate').oninput=e=>{state.rate=amount(e.target.value,'');", "$('service-rate').oninput=e=>{state.rate=globalRate(e.target.value);")
rep("state.rate=h.rate===''||h.rate===null||!Number.isFinite(n)||n<=0?'':amount(n,'');", "state.rate=h.rate===''||h.rate===null||!Number.isFinite(n)?'':globalRate(n);")

# 8. Build shows the picker for an engagement that never came from the canvas
rep("save();if(canvasPlay()!==state.play)syncCanvas(true);location.href='../';",
    "save();if(canvasPlay()!==state.play&&state.handoffAt>0)syncCanvas(true);location.href='../';")

# 10. typed hours keep two decimals
rep("r[k]=k==='hours'?Number(amount(node.value,0)||0):k==='rate'?amount(node.value,''):text(node.value);",
    "r[k]=k==='hours'?cents(Number(amount(node.value,0)||0)):k==='rate'?amount(node.value,''):text(node.value);")
rep("r.hours=amount(original.hours,r.hours);if(r.hours==='')r.hours=0;", "r.hours=amount(original.hours,r.hours);if(r.hours==='')r.hours=0;r.hours=cents(r.hours);")
rep("base=Number(amount(f.querySelector('[name=\"own-hours\"]').value,0)||0)", "base=cents(Number(amount(f.querySelector('[name=\"own-hours\"]').value,0)||0))")
rep("base=Number(amount($('custom-hours').value,0)||0)", "base=cents(Number(amount($('custom-hours').value,0)||0))")

# 6. a page restored from the back/forward cache reloads, so it never writes stale state over the canvas
rep("render();sizeNotice();\n</script>", "window.addEventListener('pageshow',e=>{if(e.persisted)location.reload();});\nrender();sizeNotice();\n</script>")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 20 applied: round-trip defects from the second review')
