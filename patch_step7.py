"""Step 7 of the SOW tool (Oct 29 2026, 11:42 pm; Adam on the live tool: "way too much going on here in this beginning part",
then "that looks way better" to mockup A, video/mockups/step7_sow_A_hours_until_rate.png):
- one intro line in place of the subtitle and the planning note
- one strip: your hourly rate (with "Partner rates run about $100 to $300" under it), currency, recurring months and the
  customer size, with "Set from the prompts on the Scope step" under it; the size definitions move to the buttons' tooltips
- the sentence above the totals and the size definitions paragraph are gone
- a heading over the totals, "What a partner makes on this play", with one line under it
- the three totals are One-time implementation, Monthly recurring and Year one (or the number of months set); until a rate
  is entered they show hours, and every service line says "At your rate"; no $100 to $300 ranges anywhere
Run once on the step 6 file; every anchor must appear exactly once.

    python3 patch_step7.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
before = (html.count('{'), html.count('}'), html.count('('), html.count(')'))


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# ---- CSS: drop the rules for what goes, add the size field and the heading over the totals
rep('.planning-note{font-size:14px;border-left:3px solid var(--red);padding:2px 0 2px 12px;margin:0 0 16px;max-width:980px}', '')
rep('.estimate-caption{display:flex;align-items:center;flex-wrap:wrap;gap:10px 12px;margin:0 0 12px;font-size:16px;line-height:1.4}.estimate-caption b{font-weight:700}.size-defs{font-size:14px;margin:-4px 0 14px}',
    '.estimate-strip{align-items:flex-start}.estimate-strip small{display:block;font-size:13px;font-weight:400;white-space:nowrap}.size-field{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600}.earn-head{margin:4px 0 10px}.earn-head h3{font-size:19px;margin:0}.earn-head p{font-size:15px;margin:3px 0 0}')
rep('.estimate-strip .hint{flex:1;min-width:180px;max-width:420px;margin:0;padding-bottom:9px}', '')
rep('.estimate-caption{font-size:15px}', '')

# ---- the Services step's top
rep('<p>Only selected services are shown. Edit the work and hours, or add another service when needed.</p>',
    '<p>Starting hours for the work in this play. Enter your rate and the figures are yours; change any line to fit the customer.</p>')
rep('<p class="planning-note">Hours are starting estimates for the work described, not Adobe requirements. Change any line to fit the customer. You set your own rate.</p>\n', '')
rep('<label>Partner hourly rate<input id="service-rate" type="number" min="0" step="1" placeholder="Your rate"></label>',
    '<label>Your hourly rate<input id="service-rate" type="number" min="0" step="1" placeholder="Enter your rate"><small id="rate-hint"></small></label>')
rep('<span class="hint" id="rate-hint"></span></div>\n<div class="estimate-caption"><span>Starting estimate for a</span><div class="size-switch" id="size-switch" role="group" aria-label="Customer size"><button type="button" data-size="small">Small</button><button type="button" data-size="typical">Typical</button><button type="button" data-size="large">Large</button></div><span id="estimate-caption-tail"></span></div>\n',
    '<div class="size-field">Customer size<div class="size-switch" id="size-switch" role="group" aria-label="Customer size"><button type="button" data-size="small" title="Up to 200 prompts, one market and domain">Small</button><button type="button" data-size="typical" title="200 to 1,000 prompts, up to three markets">Typical</button><button type="button" data-size="large" title="1,000+ prompts, many markets or domains">Large</button></div><small>Set from the prompts on the Scope step</small></div></div>\n')
rep('<p class="size-defs"><b>Small:</b> up to 200 prompts, one market and domain. <b>Typical:</b> 200 to 1,000 prompts, up to three markets. <b>Large:</b> 1,000+ prompts, many markets or domains. Set from the Scope step\'s prompt count; change it here any time.</p>\n',
    '<div class="earn-head"><h3>What a partner makes on this play</h3><p id="earn-caption"></p></div>\n')
rep('data-meta="rate" placeholder="Your rate"', 'data-meta="rate" placeholder="Enter your rate"')

# ---- JS: no ranges; hours until a rate is entered
rep("const feeAt=(l,rate)=>l.fee===null?l.hours*rate:l.fee;\nconst rangeText=(lines,months)=>RATE_RANGE.map(rate=>money(lines.reduce((sum,l)=>sum+feeAt(l,rate)*(l.cadence==='monthly'?months:1),0))).join(' to ');\n", '')
rep("const rateRangeText=()=>RATE_RANGE.map(money).join(' to ')+' an hour';", "const rateRangeText=()=>RATE_RANGE.map(money).join(' to ');")
rep("const lineFeeText=s=>s.fee===null?RATE_RANGE.map(rate=>money(s.hours*rate)).join(' to '):money(s.fee);",
    "const lineFeeText=s=>s.fee===null?'At your rate':money(s.fee);\nconst hrs=n=>n.toLocaleString('en-US')+' hours';")
old_totals = html[html.index('function renderTotals(){'):html.index('\n', html.index('function renderTotals(){'))]
rep(old_totals,
    "function renderTotals(){const t=totals(),m=state.months,span=m===12?'Year one':m+(m===1?' month':' months');"
    "$('rate-hint').textContent='Partner rates run about '+rateRangeText();"
    "$('earn-caption').textContent=t.totalFee===null?'Enter your hourly rate above and these hours become your fees.':state.rate!==''?'At your rate of '+money(Number(state.rate))+' an hour. Change it, the size or any line and these figures update.':'At the rates on each line. Change any line and these figures update.';"
    "const cards=[['One-time implementation',t.oneFee,hrs(t.oneHours),'Estimated hours, one-time',hrs(t.oneHours)],"
    "['Monthly recurring',t.monthFee===null?null:t.monthFee,hrs(t.monthHours)+' a month','Estimated hours, for '+m+(m===1?' month':' months'),hrs(t.monthHours)+' a month, for '+m+(m===1?' month':' months')],"
    "[t.monthHours>0?span:'Total',t.totalFee,hrs(t.oneHours+t.monthHours*m),t.monthHours>0?'One-time work plus '+m+(m===1?' month':' months')+' of recurring services':'One-time services only',t.monthHours>0?'One-time work plus '+m+(m===1?' month':' months')+' of recurring services':'One-time services only']];"
    "$('totals').innerHTML=cards.map(([label,fee,hours,hoursNote,feeNote])=>'<div class=\"total-card\"><span>'+label+'</span><strong>'+esc(fee===null?hours:money(fee)+(label==='Monthly recurring'?' a month':''))+'</strong><small>'+esc(fee===null?hoursNote:feeNote)+'</small></div>').join('');}")
rep("<div class=\"line-fee\"><strong'+(s.fee===null?' class=\"range\"':'')+'>'+lineFeeText(s)+'</strong><small>'+(r.cadence==='monthly'?'per month':'estimated fee')+(s.fee===null?' at '+rateRangeText():'')+'</small></div>",
    "<div class=\"line-fee\"><strong>'+lineFeeText(s)+'</strong><small>'+(r.cadence==='monthly'?'per month':'estimated fee')+'</small></div>")
rep("feeEl.textContent=lineFeeText(s);feeEl.classList.toggle('range',s.fee===null);feeEl.nextElementSibling.textContent=(s.cadence==='monthly'?'per month':'estimated fee')+(s.fee===null?' at '+rateRangeText():'');",
    "feeEl.textContent=lineFeeText(s);feeEl.nextElementSibling.textContent=s.cadence==='monthly'?'per month':'estimated fee';")
rep('.total-card strong.range{font-size:24px}', '')
rep('.line-fee strong.range{font-size:18px}', '')

after = (html.count('{'), html.count('}'), html.count('('), html.count(')'))
assert after[0] == after[1] and after[2] == after[3], f'unbalanced: {after}'
open(path, 'w', encoding='utf-8').write(html)
print('step 7 applied; braces', before[:2], '->', after[:2], 'parens', before[2:], '->', after[2:])
