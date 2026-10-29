"""Step 5 of the SOW tool (Oct 29 2026, Adam's review of the live totals, option B): the customer-size switch moves out
of the rate strip into a sentence directly above the totals, which says what the numbers are and that they change:
"Starting estimate for a [Small | Typical | Large] customer at $100 to $300 an hour. Enter your rate or change any
line and these figures update." Once a rate is entered the sentence names it. Run once on the step 4 file.

    python3 patch_step5.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# ---- CSS: the caption row; the switch keeps its look, sized for a sentence
rep(".size-field{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600}.size-switch{display:flex;",
    ".estimate-caption{display:flex;align-items:center;flex-wrap:wrap;gap:10px 12px;margin:0 0 12px;font-size:16px;line-height:1.4}.estimate-caption b{font-weight:700}.size-switch{display:inline-flex;")
rep(".size-switch button{border:0;border-right:1.5px solid var(--ink);border-radius:0;padding:9px 16px;font-size:15px}",
    ".size-switch button{border:0;border-right:1.5px solid var(--ink);border-radius:0;padding:6px 14px;font-size:15px}")

# ---- markup: the switch leaves the strip and sits in the caption above the totals
rep('<div class="size-field"><span id="size-label">Customer size</span><div class="size-switch" id="size-switch" role="group" aria-labelledby="size-label"><button type="button" data-size="small">Small</button><button type="button" data-size="typical">Typical</button><button type="button" data-size="large">Large</button></div></div><span class="hint" id="rate-hint"></span></div>\n<div class="totals" id="totals"></div>',
    '<span class="hint" id="rate-hint"></span></div>\n<div class="estimate-caption"><span>Starting estimate for a</span><div class="size-switch" id="size-switch" role="group" aria-label="Customer size"><button type="button" data-size="small">Small</button><button type="button" data-size="typical">Typical</button><button type="button" data-size="large">Large</button></div><span id="estimate-caption-tail"></span></div>\n<div class="totals" id="totals"></div>')

# ---- copy: the strip hint is about rates; the caption tail says what the numbers are and what changes them
rep("$('rate-hint').textContent='Partner rates run about '+rateRangeText()+'. Enter yours and the ranges become your figures. Hours scale with the customer size; lines you edit keep your hours.';",
    "$('rate-hint').textContent='Partner rates run about '+rateRangeText()+'. Fees are hours × your rate; you can override the rate on any line.';"
    "$('estimate-caption-tail').innerHTML=state.rate!==''?'customer at <b>'+esc(money(Number(state.rate)))+' an hour</b>. Change the size, your rate or any line and these figures update.':'customer at <b>'+esc(rateRangeText())+'</b>. Enter your rate or change any line and these figures update.';")

# ---- the size toast: the caption now says it, so keep the toast short
rep("toast('Hours set for a '+b.textContent.toLowerCase()+' customer. Lines you edited keep your hours.');", "toast('Hours set for a '+b.textContent.toLowerCase()+' customer. Lines you edited keep your hours.');", 1)

# ---- mobile: the caption wraps; the strip no longer needs the size column
rep(".line-costs{grid-template-columns:1fr 1fr}.line-fee{text-align:left}.totals{grid-template-columns:1fr}",
    ".line-costs{grid-template-columns:1fr 1fr}.line-fee{text-align:left}.estimate-caption{font-size:15px}.totals{grid-template-columns:1fr}")

assert '–' not in html and '—' not in html
assert 'size-field' not in html and 'size-label' not in html
open(path, 'w', encoding='utf-8').write(html)
print('patched', path, len(html), 'chars')
