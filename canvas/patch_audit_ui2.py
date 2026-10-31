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

# the hand-off names the products on the canvas, so a custom SOW reads as a customer document and leaves out Brand Visibility text when it isn't there
rep("try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines}));}",
    "try{localStorage.setItem(HANDOFF,JSON.stringify({v:1,at:Date.now(),play:pl.id,size:st.size,rate:st.rate||'',lines,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));}")

assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('canvas audit fixes, part 2, applied')
