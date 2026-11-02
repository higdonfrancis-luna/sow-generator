"""Step 17 on the Build canvas (Nov 2 2026, ChatGPT's last review of the bundle; Adam: "you're in charge"). The SOW
steps' half is sow/patch_step17.py.
- B01 A draft opened on the SOW steps gives the canvas its play and products; when only the products' names were
  saved, the canvas matches them by name.
- B02 The handoff names every line the canvas manages in this play (managed) and whether the play was just picked
  (fresh), so the Services step keeps the services added there that the canvas doesn't show.
- B04 The total uses each line's own settings from the Services step (a band set on its card or by the prompt
  count, typed hours, a line rate, a cadence), plus the services added on the Services step, so Build and Services
  show the same total. A line set on the Services step, or by the prompt count, says so on its card.
- Money in cents and in the SOW's currency, as on the SOW steps: cents show only when there are any.
Run once on the step 16 template (sow/canvas/template.html), then build.py and build_site.py.

    python3 sow/canvas/patch_step17.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'body class="picking"' in html and 'effOf' not in html, 'run this on the step 16 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

rep("let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',months:12,v:2};",
    "let st={play:null,on:[],ls:{},keep:{},rate:0,size:'typical',months:12,v:2,eff:null,fresh:false,cur:'USD'};")
rep("try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object')st={...st,...s,play:PLAYS[s.play]?s.play:null,on:Array.isArray(s.on)&&CUSTOM?s.on.filter(id=>CUSTOM.products.includes(id)):[],ls:s.ls||{},keep:s.keep&&typeof s.keep==='object'?s.keep:{},rate:s.v===2&&Number(s.rate)>0?Number(s.rate):0,months:Number.isInteger(s.months)&&s.months>=1&&s.months<=120?s.months:12,v:2};}catch(e){}",
    "try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&typeof s==='object'){st={...st,...s,play:PLAYS[s.play]?s.play:null,on:Array.isArray(s.on)&&CUSTOM?s.on.filter(id=>CUSTOM.products.includes(id)):[],ls:s.ls&&typeof s.ls==='object'?s.ls:{},keep:s.keep&&typeof s.keep==='object'?s.keep:{},rate:s.v===2&&Number(s.rate)>0?Number(s.rate):0,months:Number.isInteger(s.months)&&s.months>=1&&s.months<=120?s.months:12,v:2,eff:s.eff&&typeof s.eff==='object'&&s.eff.plays&&typeof s.eff.plays==='object'?s.eff:null,fresh:s.fresh===true,cur:['USD','EUR','GBP','CAD','AUD'].includes(s.cur)?s.cur:'USD'};delete st.recover;\n"
    "  /* a draft opened on the SOW steps names its products when their ids weren't saved: match them by name */\n"
    "  if(CUSTOM&&st.play===CUSTOM.id&&!st.on.length&&Array.isArray(s.recover))st.on=CUSTOM.products.filter(id=>P[id]&&s.recover.includes(P[id].name));}}catch(e){}")
rep("const money=n=>'$'+Math.round(n).toLocaleString('en-US');",
    "/* in the SOW's currency (US dollars until the Services step picks another), with cents only when there are any */\n"
    "const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:st.cur||'USD',minimumFractionDigits:Math.round(Math.abs(n)*100)%100?2:0,maximumFractionDigits:2}).format(n);")
rep("const hrs=id=>LN[id][st.size==='small'?'low':st.size==='large'?'high':'base'];\nconst fee=id=>hrs(id)*st.rate;\n",
    "/* each line's hours, rate and cadence: the Services step's own settings for it when it has any (a band set on its card or by the prompt count, typed hours, a line rate, a cadence), else the size and the rate here */\n"
    "const SZ={small:'low',typical:'base',large:'high'};\n"
    "const cents=v=>Math.round(Number((Number(v)*100).toPrecision(15)))/100;\n"
    "const effOf=id=>{const e=st.eff&&st.eff.plays&&st.eff.plays[st.play];return e&&e[id]&&typeof e[id]==='object'?e[id]:null;};\n"
    "const hrs=id=>{const e=effOf(id);if(e&&Number.isFinite(e.h))return e.h;return LN[id][SZ[e&&SZ[e.b]?e.b:st.size]||'base'];};\n"
    "const ownRate=id=>{const e=effOf(id);return e&&Number.isFinite(e.r)?e.r:null;};\n"
    "const priced=id=>ownRate(id)!==null||st.rate>0;\n"
    "const unitOf=id=>{const e=effOf(id);return e&&(e.m===0||e.m===1)?(e.m?'monthly':'one-time'):LN[id].unit;};\n"
    "const fee=id=>{const r=ownRate(id);return cents(hrs(id)*(r===null?st.rate:r));};\n"
    "/* why a line's hours, rate or cadence differ from what this canvas alone would use: set on the Services step, or the band the prompt count sets on the Scope step */\n"
    "const setNote=id=>{const e=effOf(id);if(!e)return '';const band=!!SZ[e.b]&&e.b!==st.size;\n"
    "  if(Number.isFinite(e.h)||Number.isFinite(e.r)||((e.m===0||e.m===1)&&(e.m?'monthly':'one-time')!==LN[id].unit)||(band&&!e.p))return 'Set on the Services step';return band?'Set by the prompt count on the Scope step':'';};\n")
rep("function totals(){let one=0,mon=0,n=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)){n++;if(LN[l].unit==='monthly')mon+=fee(l);else one+=fee(l);}return{one,mon,yr:one+st.months*mon,n};}\n"
    "function ownerTotal(o){let one=0,mon=0,n=0;for(const l of all(o))if(counted(l)){n++;if(LN[l].unit==='monthly')mon+=fee(l);else one+=fee(l);}",
    "/* the lines this play's canvas can show: those of its products and of the connections between them */\n"
    "let UNI={k:'',s:new Set()};\n"
    "function universe(){const pl=play();if(!pl)return new Set();if(UNI.k===pl.id)return UNI.s;const ids=new Set(pl.products),s=new Set();\n"
    "  for(const o of [...CAT.products.filter(p=>ids.has(p.id)),...C.filter(c=>ids.has(c.a)&&ids.has(c.b))])for(const l of all(o))s.add(l);UNI={k:pl.id,s};return s;}\n"
    "/* services added on the Services step that this canvas doesn't show (from the catalog, or the partner's own): still in the engagement and its total, unless the play was just picked again */\n"
    "function extras(){const e=!st.fresh&&st.eff&&st.eff.plays&&st.eff.plays[st.play];if(!e||typeof e!=='object')return [];const u=universe();\n"
    "  return Object.keys(e).filter(id=>e[id]&&e[id].o&&!u.has(id)).map(id=>{const x=e[id],z=Array.isArray(x.z)?x.z:LN[id]?[LN[id].low,LN[id].base,LN[id].high]:[0,0,0],own=Number.isFinite(x.r);\n"
    "   const h=Number.isFinite(x.h)?x.h:Number(z[['small','typical','large'].indexOf(SZ[x.b]?x.b:SZ[st.size]?st.size:'typical')])||0;\n"
    "   return {id,h,m:x.m===1,fee:cents(h*(own?x.r:st.rate)),priced:own||st.rate>0};});}\n"
    "function totals(){let one=0,mon=0,n=0,miss=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)){n++;if(!priced(l)&&hrs(l)>0)miss++;if(unitOf(l)==='monthly')mon+=fee(l);else one+=fee(l);}\n"
    "  const x=extras();for(const e of x){if(!e.priced&&e.h>0)miss++;if(e.m)mon+=e.fee;else one+=e.fee;}\n"
    "  one=cents(one);mon=cents(mon);return{one,mon,yr:cents(one+st.months*mon),n,x:x.length,miss};}\n"
    "function ownerTotal(o){let one=0,mon=0,n=0;for(const l of all(o))if(counted(l)){n++;if(unitOf(l)==='monthly')mon+=fee(l);else one+=fee(l);}")
rep("const conceptShare=()=>{let s=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)&&LN[l].origin==='research')s+=fee(l)*(LN[l].unit==='monthly'?st.months:1);return s;};",
    "const conceptShare=()=>{let s=0;for(const o of [...prods(),...conns()])for(const l of all(o))if(counted(l)&&LN[l].origin==='research'&&!(effOf(l)&&effOf(l).w))s+=fee(l)*(unitOf(l)==='monthly'?st.months:1);return s;};")
rep("function totalsUI(){const t=totals();$('t-k').textContent='Illustrative fees: implementation + '+st.months+'-month term';\n"
    "  if(!st.rate){$('t-big').textContent='$ ___';",
    "function totalsUI(){const t=totals(),blank=t.miss>0||(!st.rate&&!(t.n+t.x));$('t-k').textContent='Illustrative fees: implementation + '+st.months+'-month term';\n"
    "  if(blank){$('t-big').textContent=money(0).replace(/[0-9.,\\s]/g,'')+' ___';")
rep("  const cs=conceptShare();$('t-note').textContent=st.rate&&cs?money(cs)+' of this is service concepts with placeholder hours.':'Hours are planning assumptions, not a quote.';",
    "  const cs=conceptShare(),xs=t.x?(t.x===1?'1 service':t.x+' services')+' added on the Services step '+(t.x===1?'is':'are')+' in this total. ':'';\n"
    "  $('t-note').textContent=xs+(!blank&&cs?money(cs)+' of this is service concepts with placeholder hours.':'Hours are planning assumptions, not a quote.');")
rep("  const f=!st.rate?'':off?'Removed':(extra?'+':'')+money(fee(l))+(L.unit==='monthly'?' a month':'');",
    "  const f=!priced(l)?'':off?'Removed':(extra?'+':'')+money(fee(l))+(unitOf(l)==='monthly'?' a month':'');")
rep("aria-label=\"Capability reference: ${esc(L.src)}\">${I.ext}</a></span><span class=\"hr\">${hrs(l)} h</span><span class=\"fee\">${f}</span>",
    "aria-label=\"Capability reference: ${esc(L.src)}\">${I.ext}</a>${setNote(l)?'<span class=\"svc\">'+setNote(l)+'</span>':''}</span><span class=\"hr\">${hrs(l)} h</span><span class=\"fee\">${f}</span>")
# the note about services added on Services wraps inside the total box instead of widening it past the controls
rep(".total{margin-left:auto;border:1px solid var(--line);border-top:6px solid var(--red);border-radius:8px;padding:5px 18px 7px;min-width:390px}",
    ".total{margin-left:auto;border:1px solid var(--line);border-top:6px solid var(--red);border-radius:8px;padding:5px 18px 7px;min-width:390px;max-width:460px}")
rep(".total{margin-left:0;min-width:0;width:100%}", ".total{margin-left:0;min-width:0;width:100%;max-width:none}")
rep(".need{display:block;font-size:12.5px;font-weight:700;color:var(--dred);margin-top:2px}",
    ".need{display:block;font-size:12.5px;font-weight:700;color:var(--dred);margin-top:2px}\n.svc{display:block;font-size:12.5px;font-weight:600;color:var(--ink);margin-top:2px}")
rep("st.play=b.dataset.play;st.on=[];st.ls={};st.keep={};moreOpen={};",
    "st.play=b.dataset.play;st.on=[];st.ls={};st.keep={};st.fresh=true;moreOpen={};")
rep("if(ask.k==='over')try{localStorage.removeItem(TOOL_KEY);localStorage.removeItem(HANDOFF);}catch(e){}st.play=null;",
    "if(ask.k==='over'){try{localStorage.removeItem(TOOL_KEY);localStorage.removeItem(HANDOFF);}catch(e){}st.eff=null;st.cur='USD';}st.play=null;")
rep("rate:st.rate||'',lines,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));}catch(e){toast('This browser blocks saving, so the next step can\\'t open with your choices.');return;}\n"
    "  save();location.href='sow/#'+step;}",
    "rate:st.rate||'',lines,managed:[...universe()],fresh:!!st.fresh,products:prods().map(p=>p.id),names:prods().map(p=>p.name)}));}catch(e){toast('This browser blocks saving, so the next step can\\'t open with your choices.');return;}\n"
    "  st.fresh=false;save();location.href='sow/#'+step;}")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('canvas step 17 applied: the canvas shows the engagement the SOW steps hold')
