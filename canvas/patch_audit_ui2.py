"""Build canvas, audit fixes, part 2 (Oct 31 2026), after patch_audit_ui.py:
- Availability shows on the card only when Adobe gives a status to watch (Limited Availability, Early Access, Beta,
  Legacy, roadmap, coming soon, Try Before You Buy); "not stated" moves into Before it works, to keep cards short.
- A connection card that can't sit beside both products sits beside its i instead of on top of it.
- The hand-off to the SOW steps names the products on the canvas.
Run once on template.html after patch_audit_ui.py; every anchor must appear exactly once.

    python3 patch_audit_ui2.py template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


rep(".card .avail{font-size:15px;line-height:20px;margin:0 0 8px;color:var(--dred);font-weight:600}",
    ".card .avail{font-size:15px;line-height:20px;margin:0 0 8px;color:var(--dred);font-weight:600}.card details.pre li.na{font-style:normal;font-weight:600}")
rep("    if(o.availability&&!/^generally available/i.test(o.availability))h+=`<p class=\"avail\">Availability: ${esc(o.availability)}</p>`;\n"
    "    if(o.prereqs&&o.prereqs.length)h+=`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>Before it works (${o.prereqs.length}) ${I.chev}</summary><ul>${o.prereqs.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`;\n",
    "    const watch=o.availability&&WATCH.test(o.availability),quiet=o.availability&&!watch&&!/^generally available/i.test(o.availability)?[o.availability]:[];\n"
    "    if(watch)h+=`<p class=\"avail\">Availability: ${esc(o.availability)}</p>`;\n"
    "    const pre=[...quiet.map(x=>['na','Availability: '+x]),...(o.prereqs||[]).map(x=>['',x])];\n"
    "    if(pre.length)h+=`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>Before it works (${pre.length}) ${I.chev}</summary><ul>${pre.map(([c,x])=>`<li${c?` class=\"${c}\"`:''}>${esc(x)}</li>`).join('')}</ul></details>`;\n")
rep("const KIND={native:'Native integration',platform:'Shared-platform data path',extension:'Supported extension',partner:'Partner-designed workflow'};",
    "const KIND={native:'Native integration',platform:'Shared-platform data path',extension:'Supported extension',partner:'Partner-designed workflow'};\n"
    "/* statuses worth showing on the card itself; anything else waits under Before it works */\n"
    "const WATCH=/limited availability|early access|early adopter|beta|legacy|roadmap|coming soon|planned|try before you buy|co-innovation|maintenance mode|not currently|not documented|conflict/i;")
rep("  let left=a.right-cv.left+14;if(left+w>cv.width-10)left=a.left-cv.left-14-w;if(left<10)left=Math.max(10,Math.min(cv.width-w-10,a.left-cv.left));",
    "  let left=a.right-cv.left+14;if(left+w>cv.width-10)left=a.left-cv.left-14-w;\n"
    "  /* a connection whose two products fill the width: the card sits beside its i, not on top of it */\n"
    "  if(left<10&&card.k==='c'){const ir=el.getBoundingClientRect();left=ir.right-cv.left+14;if(left+w>cv.width-10)left=ir.left-cv.left-14-w;}\n"
    "  if(left<10)left=Math.max(10,Math.min(cv.width-w-10,a.left-cv.left));")

# re-test fixes: the rate takes cents and is never read back while typed; a rate saved before the fix (the old $150 default) is not reused;
# card footers split one-time and monthly fees; the total says the hours are planning assumptions
rep("$('rate').addEventListener('input',e=>{const v=e.target.value.replace(/[^0-9]/g,'').slice(0,4);e.target.value=v;st.rate=v?parseInt(v,10):0;save();totalsUI();refreshCard();});",
    "$('rate').addEventListener('input',e=>{let v=e.target.value.replace(/[^0-9.]/g,'');const i=v.indexOf('.');if(i>=0)v=v.slice(0,i+1)+v.slice(i+1).replace(/[.]/g,'').slice(0,2);v=v.slice(0,7);e.target.value=v;const n=parseFloat(v);st.rate=Number.isFinite(n)&&n>0?n:0;save();totalsUI();refreshCard();});")
rep("$('rate').value=st.rate?st.rate:'';", "if(document.activeElement!==$('rate'))$('rate').value=st.rate?st.rate:'';")
rep('<input id="rate" inputmode="numeric" autocomplete="off" aria-label="Your hourly rate in dollars">', '<input id="rate" inputmode="decimal" autocomplete="off" aria-label="Your approved hourly rate">')
rep("let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical'};", "let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',v:2};")
rep(",keep:s.keep&&typeof s.keep==='object'?s.keep:{}};}catch(e){}", ",keep:s.keep&&typeof s.keep==='object'?s.keep:{},rate:s.v===2&&Number(s.rate)>0?Number(s.rate):0,v:2};}catch(e){}")
rep("function ownerTotal(o){let t=0,n=0;for(const l of all(o))if(counted(l)){n++;t+=yr(l);}return{t,n};}",
    "function ownerTotal(o){let one=0,mon=0,n=0;for(const l of all(o))if(counted(l)){n++;if(LN[l].unit==='monthly')mon+=fee(l);else one+=fee(l);}return{n,fees:one&&mon?money(one)+' + '+money(mon)+' a month':mon?money(mon)+' a month':money(one)};}")
rep("const {t,n}=ownerTotal(o),", "const {n,fees}=ownerTotal(o),")
rep("const yr=id=>LN[id].unit==='monthly'?fee(id)*12:fee(id);\n", "")
rep("<span>${st.rate?money(t):''}</span></div>`;", "<span>${st.rate?fees:''}</span></div>`;")
rep('<div class="big" id="t-big"></div><div class="sub" id="t-sub"></div></div>', '<div class="big" id="t-big"></div><div class="sub" id="t-sub"></div><div class="sub" id="t-note">Hours are planning assumptions, not a quote.</div></div>')
# the total says how much of it is service concepts with placeholder hours; the keep choice for generic Skills resets with the play
rep("$('t-big').textContent=money(t.yr);$('t-sub').textContent=money(t.one)+' one-time + '+money(t.mon)+' a month for 12 months';}",
    "$('t-big').textContent=money(t.yr);$('t-sub').textContent=money(t.one)+' one-time + '+money(t.mon)+' a month for 12 months';}\n  const cs=conceptShare();$('t-note').textContent=st.rate&&cs?money(cs)+' of this is service concepts with placeholder hours.':'Hours are planning assumptions, not a quote.';")
rep("function totalsUI(){const t=totals();", "/* fees, with 12 months of monthly fees, of the lines from Adobe documentation research (service concepts) */\nconst conceptShare=()=>{let s=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)&&LN[l].origin==='research')s+=fee(l)*(LN[l].unit==='monthly'?12:1);return s;};\nfunction totalsUI(){const t=totals();")
rep("st.on=[];st.ls={};", "st.on=[];st.ls={};st.keep={};", 2)

# re-test fixes, round 2: each connection type draws its own line, with a legend; availability always shows; the first prerequisites show
# without a click; the corrected how-it-connects text is on the card; the hand-off carries the type and availability into the SOW;
# a line can say what else it needs beyond the boxes; a locked line offers every product that unlocks it
rep(".edge.pw{stroke-dasharray:9 7}", ".edge.pw{stroke-dasharray:9 7}.edge.pf{stroke-dasharray:1.5 6;stroke-linecap:round}.edge.ex{stroke-dasharray:14 5 3 5}")
rep("path.setAttribute('class','edge'+(g.c.kind==='partner'?' pw':''));", "path.setAttribute('class','edge'+(EDGE[g.c.kind]||''));")
rep("if(!shownC.has(g.c.id)&&g.c.kind!=='partner'){path.style.strokeDasharray=len;", "if(!shownC.has(g.c.id)&&!EDGE[g.c.kind]){path.style.strokeDasharray=len;")
rep("${conns().some(c=>c.kind==='partner')?' Dashed lines are partner-designed workflows.':''}`:'';}",
    "${legend()}`:'';}")
rep("const WATCH=", "const EDGE={partner:' pw',platform:' pf',extension:' ex'};\n/* the hint names the line styles on the canvas */\nconst legend=()=>{const ks=[...new Set(conns().map(c=>c.kind).filter(Boolean))];return ks.length?' Lines: '+['native','platform','extension','partner'].filter(k=>ks.includes(k)).map(k=>({native:'solid native integration',platform:'dotted shared-platform data path',extension:'dash-dot supported extension',partner:'dashed partner-designed workflow'})[k]).join(', ')+'.':'';};\nconst WATCH=")
rep(".card .kind b.pw{border-style:dashed}", ".card .kind b.pw{border-style:dashed}.card .kind b.pf{border-style:dotted}.card .avail.plain{color:var(--ink);font-weight:400}.card ul.pre{margin:0 0 4px 18px;padding:0;font-size:15px;line-height:20px}.card ul.pre li{margin:2px 0}.ln.lock.can .addb{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}")
rep("    if(o.kind)h+=`<p class=\"kind\"><b class=\"${o.kind==='partner'?'pw':''}\">${esc(KIND[o.kind])}</b>${esc(o.label||'')}</p>`;\n",
    "    if(o.kind)h+=`<p class=\"kind\"><b class=\"${o.kind==='partner'?'pw':o.kind==='platform'?'pf':''}\">${esc(KIND[o.kind])}</b>${esc(o.label||'')}</p>`;\n")
rep("    const watch=o.availability&&WATCH.test(o.availability),quiet=o.availability&&!watch&&!/^generally available/i.test(o.availability)?[o.availability]:[];\n"
    "    if(watch)h+=`<p class=\"avail\">Availability: ${esc(o.availability)}</p>`;\n"
    "    const pre=[...quiet.map(x=>['na','Availability: '+x]),...(o.prereqs||[]).map(x=>['',x])];\n"
    "    if(pre.length)h+=`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>Before it works (${pre.length}) ${I.chev}</summary><ul>${pre.map(([c,x])=>`<li${c?` class=\"${c}\"`:''}>${esc(x)}</li>`).join('')}</ul></details>`;\n",
    "    if(o.availability)h+=`<p class=\"avail${WATCH.test(o.availability)?'':' plain'}\">Availability: ${esc(o.availability)}</p>`;\n"
    "    if(o.how&&o.flows&&o.flows.length)h+=`<p class=\"how\">${esc(o.how)}</p>`;\n"
    "    const pre=o.prereqs||[];\n"
    "    if(pre.length)h+=`<div class=\"sec\">Before it works</div><ul class=\"pre\">${pre.slice(0,2).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`+(pre.length>2?`<details class=\"pre\" data-more=\"pre:${o.id}\"${moreOpen['pre:'+o.id]?' open':''}><summary>${pre.length-2} more ${I.chev}</summary><ul>${pre.slice(2).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`:'');\n")
rep("The play puts its products on the canvas, already connected, with the services on.", "The play puts its products and starting services on the canvas; each connection says whether Adobe documents it or a partner designs it.")
rep("prereqs:L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites Adobe documents for '+P[o.a].name+' + '+P[o.b].name+': '+o.prereqs.join('; ')+'.':''});",
    "prereqs:[L.origin==='research'&&conn?'Connection: '+(KIND[o.kind]||'not typed')+'. Availability: '+(o.availability||'not stated'):'',L.origin==='research'&&conn&&o.prereqs&&o.prereqs.length?'Prerequisites for '+P[o.a].name+' + '+P[o.b].name+': '+o.prereqs.join('; ')+'.':'',L.ext?'Also needs '+L.ext+'.':''].filter(Boolean).join(' ')});")
rep("if(!met(l)){const mm=missing(L),miss=mm.map(g=>g[0]);return", "if(!met(l)){const mm=missing(L);return")
rep("${play().custom?`<button class=\"addp\" data-addp=\"${miss[0]}\">Add ${esc(short(miss[0]))}</button>`:''}",
    "${play().custom?`<span class=\"addb\">${mm[0].map(n=>`<button class=\"addp\" data-addp=\"${n}\">Add ${esc(short(n))}</button>`).join('')}</span>`:''}")
rep("<span class=\"nm\">${esc(L.name)}${cpt}<a class=", "<span class=\"nm\">${esc(L.name)}${cpt}${L.ext?`<span class=\"need\">Also needs ${esc(L.ext)}</span>`:''}<a class=")

# the hand-off names the products on the canvas, so a custom SOW reads as a customer document and leaves out Brand Visibility text when it isn't there
rep("try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines}));}",
    "try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));}")

assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas audit fixes, part 2, applied')
