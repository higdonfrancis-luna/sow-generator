"""Step 4 of the SOW tool (Oct 29 2026, from Mike's review): a dollar figure from the start. Until the partner enters
a rate, the three totals show the range at $100 to $300 an hour (the partner-rate benchmarks Adam approved); once a
rate is entered they collapse to the partner's own figure. The SOW document keeps its own "complete the rates" note.
Run once on the step 3 file; every anchor must appear exactly once.

    python3 patch_step4.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# ---- the rate field and its hint
rep('id="service-rate" type="number" min="0" step="1" placeholder="Enter your rate">', 'id="service-rate" type="number" min="0" step="1" placeholder="Your rate">')
rep('data-meta="rate" placeholder="Enter your rate">', 'data-meta="rate" placeholder="Your rate">')
rep('<span class="hint">Hours scale with the size of the customer; lines you edit keep your hours. Fees are hours × your rate, which you can override on any service.</span>',
    '<span class="hint" id="rate-hint"></span>')

# ---- totals: the range at $100 to $300 an hour for every line without a rate
rep("const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,minimumFractionDigits:0,maximumFractionDigits:2}).format(v);",
    "const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:state.currency,minimumFractionDigits:0,maximumFractionDigits:2}).format(v);\n"
    "const RATE_RANGE=[100,300];\n"
    "const feeAt=(l,rate)=>l.fee===null?l.hours*rate:l.fee;\n"
    "const rangeText=(lines,months)=>RATE_RANGE.map(rate=>money(lines.reduce((sum,l)=>sum+feeAt(l,rate)*(l.cadence==='monthly'?months:1),0))).join(' to ');\n"
    "const rateRangeText=()=>RATE_RANGE.map(money).join(' to ')+' an hour';")
rep("function renderTotals(){const t=totals();$('totals').innerHTML=[['One-time services',t.oneFee,t.oneHours.toLocaleString('en-US')+' estimated hours'],['Monthly services',t.monthFee,t.monthHours.toLocaleString('en-US')+' hours a month'],['Services total',t.totalFee,t.monthHours>0?'One-time work plus '+state.months+' months of recurring services':'One-time services only']].map(([label,value,note])=>'<div class=\"total-card\"><span>'+label+'</span><strong>'+(value===null?'Enter rates':money(value))+'</strong><small>'+esc(note)+'</small></div>').join('');}",
    "function renderTotals(){const t=totals(),lines=selectedLines(),one=lines.filter(l=>l.cadence!=='monthly'),month=lines.filter(l=>l.cadence==='monthly'),at=' at '+rateRangeText();$('rate-hint').textContent='Partner rates run about '+rateRangeText()+'. Enter yours and the ranges become your figures. Hours scale with the customer size; lines you edit keep your hours.';$('totals').innerHTML=[['One-time services',t.oneFee,rangeText(one,1),t.oneHours.toLocaleString('en-US')+' estimated hours'+(t.oneFee===null?at:'')],['Monthly services',t.monthFee,rangeText(month,1),t.monthHours.toLocaleString('en-US')+' hours a month'+(t.monthFee===null?at:'')],['Services total',t.totalFee,rangeText(lines,state.months),t.monthHours>0?'One-time work plus '+state.months+' months of recurring services':'One-time services only']].map(([label,value,range,note])=>'<div class=\"total-card\"><span>'+label+'</span><strong'+(value===null?' class=\"range\"':'')+'>'+(value===null?range:money(value))+'</strong><small>'+esc(note)+'</small></div>').join('');}")
rep(".total-card strong{display:block;font-size:30px;margin:6px 0 4px;letter-spacing:-.5px}", ".total-card strong{display:block;font-size:30px;margin:6px 0 4px;letter-spacing:-.5px}.total-card strong.range{font-size:24px}")

assert '–' not in html and '—' not in html
assert 'Enter rates' not in html and 'Enter your rate' not in html
open(path, 'w', encoding='utf-8').write(html)
print('patched', path, len(html), 'chars')
