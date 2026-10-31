"""Build canvas, audit fixes, part 3 (Oct 31 2026), after patch_audit_ui2.py, from the independent re-test's
completeness critic (sow/audit_2026-10-31/CHANGE_LOG.md):
- The canvas total uses the operating term entered in the SOW steps (12 months until one is entered), so the front
  page and the SOW show the same total; the label and the monthly line say the term.
- Links on connection flows, plain connection text and locked rows say "Capability reference", like the service rows.
- Locked rows also say what else a line needs outside the canvas.
- On phones and narrow windows, where the hint is hidden, the line-style legend shows under the total.
Run once on template.html after patch_audit_ui2.py; every anchor must appear exactly once.

    python3 patch_audit_ui3.py template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


# styles: the legend under the total, on narrow screens only
rep('.hint{position:absolute;left:30px;bottom:22px;margin:0;font-size:15.5px;color:var(--ink2);max-width:calc(100% - 330px)}',
    '.hint{position:absolute;left:30px;bottom:22px;margin:0;font-size:15.5px;color:var(--ink2);max-width:calc(100% - 330px)}\n'
    '.total .lgd{display:none}\n@media (max-width:900px){.total .lgd{display:block;margin-top:4px}}')

# the total names the term
rep('<div class="total" aria-live="polite"><div class="k">Illustrative fees: implementation + 12-month term</div><div class="big" id="t-big"></div><div class="sub" id="t-sub"></div><div class="sub" id="t-note">Hours are planning assumptions, not a quote.</div></div>',
    '<div class="total" aria-live="polite"><div class="k" id="t-k">Illustrative fees: implementation + 12-month term</div><div class="big" id="t-big"></div><div class="sub" id="t-sub"></div><div class="sub" id="t-note">Hours are planning assumptions, not a quote.</div><div class="sub lgd" id="t-legend"></div></div>')

# the term comes from the SOW steps (12 months until one is entered there)
rep("let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',v:2};",
    "let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',months:12,v:2};")
rep("rate:s.v===2&&Number(s.rate)>0?Number(s.rate):0,v:2};}catch(e){}",
    "rate:s.v===2&&Number(s.rate)>0?Number(s.rate):0,months:Number.isInteger(s.months)&&s.months>=1&&s.months<=120?s.months:12,v:2};}catch(e){}")
rep("return{one,mon,yr:one+12*mon,n};}", "return{one,mon,yr:one+st.months*mon,n};}")
rep("/* fees, with 12 months of monthly fees, of the lines from Adobe documentation research (service concepts) */\n"
    "const conceptShare=()=>{let s=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)&&LN[l].origin==='research')s+=fee(l)*(LN[l].unit==='monthly'?12:1);return s;};",
    "/* fees, with the term's monthly fees, of the lines from Adobe documentation research (service concepts) */\n"
    "const conceptShare=()=>{let s=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)&&LN[l].origin==='research')s+=fee(l)*(LN[l].unit==='monthly'?st.months:1);return s;};")
rep("function totalsUI(){const t=totals();\n",
    "const termText=()=>st.months+(st.months===1?' month':' months');\n"
    "function totalsUI(){const t=totals();$('t-k').textContent='Illustrative fees: implementation + '+st.months+'-month term';\n")
rep("$('t-sub').textContent=money(t.one)+' one-time + '+money(t.mon)+' a month for 12 months';}",
    "$('t-sub').textContent=money(t.one)+' one-time + '+money(t.mon)+' a month for '+termText();}")

# the legend, for narrow screens where the hint is hidden
rep("function hintUI(){const n=totals().n,pl=play();\n",
    "function hintUI(){const n=totals().n,pl=play();$('t-legend').textContent=pl?legend().trim():'';\n")

# capability references, not "Source", on every link
rep('title="Source: ', 'title="Capability reference: ', 3)
rep('aria-label="Source: ', 'aria-label="Capability reference: ', 3)

# locked rows say what else the line needs, as open rows do
rep("<span class=\"need\">Needs ${missText(mm)}${play().custom?' on the canvas':', which is not in this play'}</span></span>",
    "<span class=\"need\">Needs ${missText(mm)}${play().custom?' on the canvas':', which is not in this play'}</span>${L.ext?`<span class=\"need\">Also needs ${esc(L.ext)}</span>`:''}</span>")

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('canvas audit fixes, part 3 applied')
