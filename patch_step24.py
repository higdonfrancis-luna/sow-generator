"""Step 24 of the SOW tool (Nov 2 2026): ChatGPT's second pass on the bundle (sow/review_2026-11-02/
ABV_Pass2_Verification_2026-11-02.html). Its four substantive findings and the mobile overflow are fixed, each with a
check in sow/test_review_nov2.js that failed first; the canvas half is sow/canvas/patch_step24.py.
- F1 The retired technical SEO line (O03) kept from a draft moves with its whole row: its choice, hours, line rate,
  cadence (a one-time line stays one-time), texts and reason, through the same migration as every other line, so a
  version 2 or 3 quantity multiplies its hours once and asks for review; the quantity note doesn't count as the
  distinct scope the overlap review asks for, so both reviews apply.
- F3 Change play rebuilds the partner's own services from their definitions (off, and kept under Add service), so
  re-adding one brings back the service as written, not the old engagement's hours, rate or text.
- F4 Launch, QA and hypercare (A03) excludes support beyond the hypercare period its Included work states (one, two or
  four weeks by band), instead of "beyond the two weeks".
- F5 On phones the delivery-size help on the Services step wraps instead of widening the page.
- Smaller: SO1 and SO2 also cite Adobe's code-patch page and L03 the Optimize at Edge overview; a rate that rounds to
  zero (0.004) is no rate.
Run once on the step 23 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step24.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'rewordAt' in html and 'PRIOR24' not in html, 'run this on the step 23 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
BY = {c['id']: c for c in CAT}

# F4: the exclusion follows the hypercare period of the band
a03 = BY['A03']
OLD_A03 = 'New features, content changes after launch, and support beyond the two weeks of hypercare.'
assert a03['exclusions'] == OLD_A03 and 'exclusions' not in a03['bands']['small'] and 'exclusions' not in a03['bands']['large']
a03['exclusions'] = 'New features, content changes after launch, and support beyond the hypercare period stated in Included work.'
prior = {'A03': {'exclusions': [OLD_A03]}}

# references a partner can follow for the newer claims
CODE = 'https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/preparing-code-patches'
for lid in ('SO1', 'SO2'):
    assert 'source2' not in BY[lid]
    BY[lid]['source2'] = CODE
    BY[lid]['sourceTitle2'] = 'Experience League: Sites Optimizer code patches'
assert 'source2' not in BY['L03']
BY['L03']['source2'] = 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/overview'
BY['L03']['sourceTitle2'] = 'Experience League: Brand Visibility, Optimize at Edge'

blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')
rep("const PRIOR19=", "const PRIOR24=" + json.dumps(prior, ensure_ascii=False) + ";\nconst PRIOR19=")
rep("...(PRIOR19[c.id]?.[key]||[])].filter(x=>typeof x==='string')", "...(PRIOR19[c.id]?.[key]||[]),...(PRIOR24[c.id]?.[key]||[])].filter(x=>typeof x==='string')")

BRACES = html.count('{') - html.count('}')

# F1: the retired line's whole row moves to its new id and takes the common migration
rep("const id='CUSTOM-O03-'+p;if(seen.has(id))continue;const base=amount(o.hours,O03_RETIRED.base);",
    "const id='CUSTOM-O03-'+p;if(seen.has(id))continue;let base=amount(o.hours,O03_RETIRED.base);if(base==='')base=0;")
rep("unit:'monthly',plays:[p],scope:text(o.scope,O03_RETIRED.scope)",
    "unit:o.cadence==='one-time'?'one-time':'monthly',plays:[p],scope:text(o.scope,O03_RETIRED.scope)")
rep("retiredFrom:'O03',retired:{on:o.on===true,rate:amount(o.rate,'')}});seen.add(id);}",
    "retiredFrom:'O03'});seen.add(id);(moved[p]=moved[p]||{})[id]=o;}")
rep(" for(const p of Object.keys(PLAYS)){const o=s.estimates?.[p]?.O03;",
    " /* the retired line's whole row (choice, hours, rate, cadence, texts, reason) moves to its new id and takes the same migration as every other line, quantity included */\n"
    " const moved={};\n"
    " for(const p of Object.keys(PLAYS)){const o=s.estimates?.[p]?.O03;")
rep("const original=s.estimates?.[p]?.[c.id],r=newLine(c,STARTERS[p].includes(c.id),d.size,p);",
    "const original=s.estimates?.[p]?.[c.id]||moved[p]?.[c.id],r=newLine(c,STARTERS[p].includes(c.id),d.size,p);")
rep("   if(c.retired){r.on=c.retired.on;r.rate=c.retired.rate;r.hours=c.base;delete c.retired;}\n", "")

# F3: Change play rebuilds own services from their definitions
rep(" /* 2. the play picked again: the partner's own services start off too, and stay under Add service */\n"
    " if(h.fresh===true)for(const s of state.custom.filter(x=>x.plays.includes(p))){const r=state.estimates[p][s.id];if(r)r.on=false;}\n",
    " /* the play picked again: the partner's own services start off, rebuilt from their definitions, and stay under Add service */\n"
    " if(h.fresh===true)for(const s of state.custom.filter(x=>x.plays.includes(p)))state.estimates[p][s.id]=newLine(s,false,state.size,p);\n")

# the quantity note from an earlier draft is not the partner's distinct scope: the overlap review and the quantity review stay independent
rep("if(o.length&&!realEdit(r.scope,lineText(base,state.play,r.band,'scope')))",
    "if(o.length&&!realEdit(String(r.scope).split('\\n'+IMPORT_NOTE)[0],lineText(base,state.play,r.band,'scope')))")

# a rate that rounds to zero is no rate
rep("const globalRate=v=>{const r=amount(v,'');return r===''||!(r>0)?'':cents(r);};",
    "const globalRate=v=>{const r=amount(v,'');if(r==='')return '';const c=cents(r);return c>0?c:'';};")

# F5: the delivery-size help wraps on phones
rep("\n</style></head><body>",
    "\n@media(max-width:780px){.estimate-strip small{white-space:normal}.size-field{min-width:0;max-width:100%}}\n</style></head><body>")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert 'if(c.retired)' not in html and 'retired:{' not in html and html.count("retiredFrom:'O03'") == 2
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 24 applied: ChatGPT second pass fixes')
