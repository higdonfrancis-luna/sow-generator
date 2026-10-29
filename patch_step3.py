"""Step 3 of the SOW tool rebuild (Oct 29 2026): a customer-size switch (Small, Typical, Large) that picks each catalog
service's low, base or high hours. Lines the partner edited keep their hours; custom services keep theirs; the size is
saved with the draft. Run once on the step 2 file; every anchor must appear exactly once.

    python3 patch_step3.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# ---- CSS for the switch
rep(".estimate-strip label{width:140px}",
    ".estimate-strip label{width:140px}.size-field{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600}.size-switch{display:flex;border:1.5px solid var(--ink);border-radius:4px;overflow:hidden}.size-switch button{border:0;border-right:1.5px solid var(--ink);border-radius:0;padding:9px 16px;font-size:15px}.size-switch button:last-child{border-right:0}.size-switch button[aria-pressed=true],.size-switch button[aria-pressed=true]:hover{background:var(--ink);color:#fff}")

# ---- the switch in the services strip
rep('<label>Recurring months<input id="service-months" type="number" min="1" max="120" step="1"></label><span class="hint">Fees are estimated hours × your rate. You can override the rate on any service.</span></div>',
    '<label>Recurring months<input id="service-months" type="number" min="1" max="120" step="1"></label><div class="size-field"><span id="size-label">Customer size</span><div class="size-switch" id="size-switch" role="group" aria-labelledby="size-label"><button type="button" data-size="small">Small</button><button type="button" data-size="typical">Typical</button><button type="button" data-size="large">Large</button></div></div><span class="hint">Hours scale with the size of the customer; lines you edit keep your hours. Fees are hours × your rate, which you can override on any service.</span></div>')

# ---- state: the size, and hours per size
rep("const newLine=(s,on)=>({on,hours:s.base,rate:'',",
    "const SIZES={small:'low',typical:'base',large:'high'};\nconst validSize=v=>Object.prototype.hasOwnProperty.call(SIZES,v);\nconst isCustom=s=>/^CUSTOM/.test(s.id);\nconst sizeHours=(s,size)=>isCustom(s)?s.base:s[SIZES[size]];\nconst newLine=(s,on,size='typical')=>({on,hours:sizeHours(s,size),hoursEdited:false,rate:'',")
rep("const blank=()=>({version:4,play:'cja',", "const blank=()=>({version:4,play:'cja',size:'typical',")
rep(" d.rate=amount(s.rate,'');d.currency=", " d.size=validSize(s.size)?s.size:'typical';d.rate=amount(s.rate,'');d.currency=")
rep("const original=s.estimates?.[p]?.[c.id],r=newLine(c,STARTERS[p].includes(c.id));",
    "const original=s.estimates?.[p]?.[c.id],r=newLine(c,STARTERS[p].includes(c.id),d.size);")
rep("r.on=typeof original.on==='boolean'?original.on:r.on;r.hours=amount(original.hours,c.base);if(r.hours==='')r.hours=0;",
    "r.on=typeof original.on==='boolean'?original.on:r.on;r.hours=amount(original.hours,r.hours);if(r.hours==='')r.hours=0;r.hoursEdited=original.hoursEdited===true;")

# ---- edited lines keep their hours; reset follows the size; custom lines keep theirs
rep("r[k]=k==='hours'?Number(amount(node.value,0)||0):k==='rate'?amount(node.value,''):te",
    "if(k==='hours')r.hoursEdited=true;r[k]=k==='hours'?Number(amount(node.value,0)||0):k==='rate'?amount(node.value,''):te")
rep("state.estimates[state.play][c.id]={...newLine(c,true),rate:prior.rate};", "state.estimates[state.play][c.id]={...newLine(c,true,state.size),rate:prior.rate};")
rep("state.custom.push(s);state.estimates[state.play][s.id]=newLine(s,true);", "state.custom.push(s);state.estimates[state.play][s.id]=newLine(s,true,state.size);")

# ---- the switch itself: every template, every catalog line the partner has not edited
rep("$('service-months').onchange=e=>e.target.value=state.months;\n",
    "$('service-months').onchange=e=>e.target.value=state.months;\n"
    "function renderSize(){for(const b of document.querySelectorAll('#size-switch button'))b.setAttribute('aria-pressed',b.dataset.size===state.size?'true':'false');}\n"
    "$('size-switch').onclick=e=>{const b=e.target.closest('[data-size]');if(!b||b.dataset.size===state.size)return;state.size=b.dataset.size;for(const p of Object.keys(PLAYS))for(const s of catalog().filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(r&&!r.hoursEdited&&!isCustom(s))r.hours=sizeHours(s,state.size);}renderSize();renderRows();renderTotals();save();toast('Hours set for a '+b.textContent.toLowerCase()+' customer. Lines you edited keep your hours.');};\n")
rep(" renderScope();$('service-rate').value=state.rate;$('service-currency').value=state.currency;$('service-months').value=state.months;",
    " renderScope();$('service-rate').value=state.rate;$('service-currency').value=state.currency;$('service-months').value=state.months;renderSize();")

# ---- the editor's basis line and the library show hours by size
rep("""<div class="basis"><b>Starting scope:</b> '+esc(s.basis)+' '+s.base+' hours to start; planning range '+s.low+' to '+s.high+' hours.</div>""",
    """<div class="basis"><b>Starting scope:</b> '+esc(s.basis)+(isCustom(s)?' Partner-defined hours.':' Hours by customer size: Small '+s.low+', Typical '+s.base+', Large '+s.high+'.')+'</div>""")
rep("""<p>'+s.base+' planning hours · '+(s.unit==='monthly'?'monthly':'one-time')""",
    """<p>'+sizeHours(s,state.size)+' planning hours · '+(s.unit==='monthly'?'monthly':'one-time')""")
rep("""<button class="reset-line" data-reset="'+esc(s.id)+'">Restore reference scope and hours</button>""",
    """<button class="reset-line" data-reset="'+esc(s.id)+'">Restore starting scope and hours</button>""")

# ---- new opportunity keeps the size the partner chose
rep("state=normalize({...blank(),partner,rate,currency});", "const size=state.size;state=normalize({...blank(),partner,rate,currency,size});")

assert '–' not in html and '—' not in html
open(path, 'w', encoding='utf-8').write(html)
print('patched', path, len(html), 'chars')
