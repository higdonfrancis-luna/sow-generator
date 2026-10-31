"""Build canvas, audit fixes (Oct 31 2026; change log in sow/audit_2026-10-31/CHANGE_LOG.md):
- Fees: no default rate (the partner enters an approved rate); the total reads "Illustrative fees: implementation +
  12-month term"; the switch is Delivery size, which sets planning bands.
- Connections say what they are: a type badge (native integration, shared-platform data path, supported extension or
  partner-designed workflow), Adobe's availability where it is not general, and the prerequisites, from
  research/connection_types.json. Partner-designed workflows draw as dashed lines; the card's flow list is
  "How it connects".
- Lines that need one of several products (needs_any, for example Journey Optimizer or Real-Time CDP for CJA audiences
  in Target) unlock with either.
- Specialized Coworker Skills on a connection replace the generic Skills package (CW03) unless the partner keeps it for
  distinct Skills.
- Lines from Adobe documentation research are tagged Concept, and the hand-off carries their connection's
  prerequisites to the SOW steps, where they are service concepts until written.
Run once on template.html; every anchor must appear exactly once.

    python3 patch_audit_ui.py template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


# styles
rep('.edge.hot{stroke:var(--red);stroke-width:4}',
    '.edge.hot{stroke:var(--red);stroke-width:4}\n.edge.pw{stroke-dasharray:9 7}')
rep('.none{font-size:15.5px;line-height:21px;margin:2px 0 10px}',
    '.none{font-size:15.5px;line-height:21px;margin:2px 0 10px}\n'
    '.card .kind{margin:0 0 8px;font-size:15px;line-height:20px}.card .kind b{display:inline-block;font-size:11.5px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;border:1.5px solid var(--ink);border-radius:3px;padding:1px 6px;margin:0 6px 2px 0}.card .kind b.pw{border-style:dashed}\n'
    '.card .avail{font-size:15px;line-height:20px;margin:0 0 8px;color:var(--dred);font-weight:600}\n'
    '.card details.pre{margin:0 0 8px;font-size:15px;line-height:20px}.card details.pre summary{cursor:pointer;font-weight:700;list-style:none}.card details.pre summary::-webkit-details-marker{display:none}.card details.pre ul{margin:4px 0 0 18px;padding:0}.card details.pre li{margin:2px 0}\n'
    '.ln .cpt{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.2px solid var(--ink);border-radius:3px;padding:0 5px;margin-left:6px;vertical-align:1px}\n'
    '.ln .rep{display:block;font-size:12.5px;font-weight:700;color:var(--dred);margin-top:2px}')

# toolbar: no default rate, Delivery size, illustrative fees
rep("let st={play:null,on:[],ls:{},rate:150,size:'typical'};", "let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical'};")
rep(",ls:s.ls||{}};}catch(e){}", ",ls:s.ls||{},keep:s.keep&&typeof s.keep==='object'?s.keep:{}};}catch(e){}")
rep('<div class="rate">Customer size <span class="seg" id="size">',
    '<div class="rate" title="Sets each service\'s planning band; the Services step shows what each band assumes">Delivery size <span class="seg" id="size">')
rep('<div class="total" aria-live="polite"><div class="k">Services on this canvas, year one</div>',
    '<div class="total" aria-live="polite"><div class="k">Illustrative fees: implementation + 12-month term</div>')
rep("if(!st.rate){$('t-big').textContent='$ ___';$('t-sub').textContent='Enter your rate to see your dollars.';}\n  else{$('t-big').textContent=money(t.yr);$('t-sub').textContent=money(t.one)+' one-time + '+money(t.mon)+' a month';}",
    "if(!st.rate){$('t-big').textContent='$ ___';$('t-sub').textContent='Enter your approved rate to see illustrative fees.';}\n  else{$('t-big').textContent=money(t.yr);$('t-sub').textContent=money(t.one)+' one-time + '+money(t.mon)+' a month for 12 months';}")
rep('<p>Products connect themselves where Adobe documents a connection.</p>',
    '<p>Products connect where Adobe documents a connection or a partner workflow; each connection says which.</p>')
rep("Hover a product or an i to see its services; X takes a line out, the check brings it back.`:'';}",
    "Hover a product or an i to see its services; X takes a line out, the check brings it back.${conns().some(c=>c.kind==='partner')?' Dashed lines are partner-designed workflows.':''}`:'';}")

# connection types on the lines
rep("path.setAttribute('class','edge');", "path.setAttribute('class','edge'+(g.c.kind==='partner'?' pw':''));")
rep("if(!shownC.has(g.c.id)){path.style.strokeDasharray=len;", "if(!shownC.has(g.c.id)&&g.c.kind!=='partner'){path.style.strokeDasharray=len;")

# needs_any, and specialized Coworker Skills replace the generic package
rep("const met=l=>(LN[l].needs||[]).every(has);",
    """const anyOk=a=>!(a&&a.length)||a.some(has);
const met=l=>(LN[l].needs||[]).every(has)&&anyOk(LN[l].needs_any);
/* what a locked line still needs: every product in needs, and one of needs_any */
const missing=x=>{const m=(x.needs||[]).filter(n=>!has(n)).map(n=>[n]);if(!anyOk(x.needs_any))m.push(x.needs_any);return m;};
const missText=m=>m.map(g=>g.map(n=>esc(P[n].name)).join(' or ')).join(' and ');
const SPECIAL=['CW-CJA','CW-AEM','CW-FSI','AXD11','XA25','XA26','XA27'];
const specialOn=()=>conns().some(c=>all(c).some(l=>SPECIAL.includes(l)&&lineOn(l)&&met(l)));
const replaced=l=>l==='CW03'&&!st.keep.CW03&&specialOn();""")
rep("const counted=l=>lineOn(l)&&met(l);", "const counted=l=>lineOn(l)&&met(l)&&!replaced(l);")
rep("if(!met(l)){const miss=(L.needs||[]).filter(n=>!has(n));return `<div class=\"ln lock${play().custom?' can':''}\" data-l=\"${l}\"><span class=\"nm\">${esc(L.name)}",
    "if(!met(l)){const mm=missing(L),miss=mm.map(g=>g[0]);return `<div class=\"ln lock${play().custom?' can':''}\" data-l=\"${l}\"><span class=\"nm\">${esc(L.name)}")
rep("<span class=\"need\">Needs ${miss.map(n=>esc(P[n].name)).join(' and ')}${play().custom?' on the canvas':', which is not in this play'}</span>",
    "<span class=\"need\">Needs ${missText(mm)}${play().custom?' on the canvas':', which is not in this play'}</span>")
rep("  const f=!st.rate?'':off?'Removed':(extra?'+':'')+money(fee(l))+(L.unit==='monthly'?' a month':'');\n  return `<div class=\"ln${off?' off':''}\" data-l=\"${l}\"><span class=\"nm\">${esc(L.name)}<a class=\"src\" href=\"${esc(L.url)}\" target=\"_blank\" rel=\"noopener\" title=\"Source: ${esc(L.src)}\" aria-label=\"Source: ${esc(L.src)}\">${I.ext}</a></span>",
    "  const cpt=L.origin==='research'?'<span class=\"cpt\" title=\"A service concept from Adobe documentation: the SOW steps ask for its deliverable and acceptance criteria\">Concept</span>':'';\n"
    "  if(replaced(l))return `<div class=\"ln off\" data-l=\"${l}\"><span class=\"nm\">${esc(L.name)}<a class=\"src\" href=\"${esc(L.url)}\" target=\"_blank\" rel=\"noopener\" title=\"Capability reference: ${esc(L.src)}\" aria-label=\"Capability reference: ${esc(L.src)}\">${I.ext}</a><span class=\"rep\">Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.</span></span><span class=\"hr\">${hrs(l)} h</span><span class=\"fee\"></span><button class=\"tg add\" data-keep=\"${l}\" aria-label=\"Keep ${esc(L.name)} for distinct Skills\">${I.check}</button></div>`;\n"
    "  const f=!st.rate?'':off?'Removed':(extra?'+':'')+money(fee(l))+(L.unit==='monthly'?' a month':'');\n  return `<div class=\"ln${off?' off':''}\" data-l=\"${l}\"><span class=\"nm\">${esc(L.name)}${cpt}<a class=\"src\" href=\"${esc(L.url)}\" target=\"_blank\" rel=\"noopener\" title=\"Capability reference: ${esc(L.src)}\" aria-label=\"Capability reference: ${esc(L.src)}\">${I.ext}</a></span>")
rep("const {t,n}=ownerTotal(o),defOff=main.filter(l=>!lineOn(l)).length;", "const {t,n}=ownerTotal(o),defOff=main.filter(l=>met(l)&&(!lineOn(l)||replaced(l))).length;")

# the connection card says what kind of connection it is
rep("  if(k==='c'){\n    if(o.gain)h+=",
    "  if(k==='c'){\n    if(o.kind)h+=`<p class=\"kind\"><b class=\"${o.kind==='partner'?'pw':''}\">${esc(KIND[o.kind])}</b>${esc(o.label||'')}</p>`;\n"
    "    if(o.availability&&!/^generally available/i.test(o.availability))h+=`<p class=\"avail\">Availability: ${esc(o.availability)}</p>`;\n"
    "    if(o.prereqs&&o.prereqs.length)h+=`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>Before it works (${o.prereqs.length}) ${I.chev}</summary><ul>${o.prereqs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`;\n"
    "    if(o.gain)h+=")
rep("if(o.flows&&o.flows.length)h+=`<div class=\"sec\">How the data flows</div>`+o.flows.map(f=>{const ok=(f.needs||[]).every(has);",
    "if(o.flows&&o.flows.length)h+=`<div class=\"sec\">How it connects</div>`+o.flows.map(f=>{const ok=(f.needs||[]).every(has)&&anyOk(f.needs_any);")
rep("${ok?'':` <em>Needs ${f.needs.map(n=>esc(P[n].name)).join(' and ')}${play().custom?' on the canvas':', which is not in this play'}.</em>`}",
    "${ok?'':` <em>Needs ${missText(missing(f))}${play().custom?' on the canvas':', which is not in this play'}.</em>`}")
rep("const P=Object.fromEntries(CAT.products.map(p=>[p.id,p]));",
    "const P=Object.fromEntries(CAT.products.map(p=>[p.id,p]));\nconst KIND={native:'Native integration',platform:'Shared-platform data path',extension:'Supported extension',partner:'Partner-designed workflow'};")

# keep the generic Skills package for distinct Skills
rep("  const t=e.target.closest('[data-t]');if(t){",
    "  const kp=e.target.closest('[data-keep]');if(kp){st.keep[kp.dataset.keep]=true;pinned=true;save();refreshCard();totalsUI();hintUI();return;}\n  const t=e.target.closest('[data-t]');if(t){")

# the hand-off carries a research line's connection prerequisites to the SOW steps
rep("lines.push({id:l,on:counted(l),name:L.name,unit:L.unit,low:L.low,base:L.base,high:L.high,url:L.url,src:L.src,scope:L.scope||'',stage:L.unit==='monthly'?'Optimize':conn?'Connect':'Launch'});",
    "lines.push({id:l,on:counted(l),name:L.name,unit:L.unit,low:L.low,base:L.base,high:L.high,url:L.url,src:L.src,scope:L.scope||'',stage:L.unit==='monthly'?'Optimize':conn?'Connect':'Launch',prereqs:L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites Adobe documents for '+P[o.a].name+' + '+P[o.b].name+': '+o.prereqs.join('; ')+'.':''});")

assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas audit fixes applied')
