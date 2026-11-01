"""Step 15 of the SOW tool (Nov 1 2026, Adam: yes): one owner for each piece of work, so SEO and AI-answer work are
never charged twice (sow/services_review_2026-11-01/PROPOSAL.md, step 1a).
- "Technical SEO and AI-search improvements" (O03) retires from every play. A saved draft that had it on, or edited
  it, keeps it as the partner's own service; untouched rows go.
- "Content improvements for priority questions" (O02) becomes "Content improvements for search and AI": the one
  content line, each page change logged once.
- Owner sentences: the monthly review (O01) is the one readout and says where its findings go; Sites Optimizer's
  monthly fixes (SO2) take the site fixes Brand Visibility flags, in the same allowance, with no separate report;
  Sites Optimizer setup (SO1) and Brand Visibility setup (L02) share one access request; the migration (A02) says
  rankings are not guaranteed.
- Implement Brand Concierge (F02) no longer quotes Adobe's FAQ on Adobe consultants (Adam's rule: nothing about
  Adobe Consulting Services); Adobe's timing figures stay.
- Drafts keep their text when it was the step 14 wording: those texts are known, so they follow the new wording.
Run once on the step 14 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step15.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'Technical SEO and AI-search improvements' in html and 'const PRIOR_TEXT=' in html, 'run this on the step 14 file'


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
O03 = BY['O03']
prior = {}  # id -> key -> [step 14 texts, base and bands], so drafts saved with them follow the new wording


def keep_old(lid, key):
    c = BY[lid]
    olds = [c[key]] + [c['bands'][b][key] for b in ('small', 'large') if key in c['bands'][b]]
    prior.setdefault(lid, {}).setdefault(key, [])
    for o in olds:
        if o not in prior[lid][key]:
            prior[lid][key].append(o)


def append(lid, key, sentence):
    keep_old(lid, key)
    c = BY[lid]
    assert sentence not in c[key]
    c[key] = c[key] + ' ' + sentence
    for b in ('small', 'large'):
        if key in c['bands'][b]:
            c['bands'][b][key] = c['bands'][b][key] + ' ' + sentence


def replace_in(lid, key, old, new):
    keep_old(lid, key)
    c = BY[lid]
    assert c[key].count(old) == 1, (lid, key, old)
    c[key] = c[key].replace(old, new)
    for b in ('small', 'large'):
        if key in c['bands'][b]:
            assert c['bands'][b][key].count(old) == 1, (lid, b, key, old)
            c['bands'][b][key] = c['bands'][b][key].replace(old, new)


# O03 retires
CAT = [c for c in CAT if c['id'] != 'O03']

# O02: the one content line
BY['O02']['name'] = 'Content improvements for search and AI'
append('O02', 'scope', 'Each page change is logged once and tagged search, AI or both.')

# O01: the one monthly readout, and where its findings go
append('O01', 'assumptions', "This is the one monthly readout. Where Sites Optimizer's monthly fixes are in scope, it includes their search "
       "results, and they produce no separate report. Edge fixes chosen here go live only where an edge route is in place; otherwise "
       "they are listed for a pilot or as change requests. Findings that need a change to the site itself go to Sites Optimizer's "
       "monthly fixes where those are in scope, and otherwise to the customer's web team.")

# SO1: one access request, each product connects its own
SO1_BV = "Brand Visibility connects its own Search Console link; one access request to the customer covers both. "
append('SO1', 'assumptions', SO1_BV + "Access for Adobe's scanner is confirmed here and its IP addresses are allowed in the CDN, firewall or Cloud Manager traffic filters.")
# without Brand Visibility in the engagement, Sites Optimizer setup requests the scanner's access itself
assert 'neutral' not in BY['SO1']
BY['SO1']['neutral'] = {'bv': {'assumptions': [[SO1_BV, ''], ["Access for Adobe's scanner is confirmed here", "Access for Adobe's scanner is requested here"]]}}

# SO2: every site fix in one allowance, reported in the monthly review
replace_in('SO2', 'scope', ' alongside the Brand Visibility review', ' in the Brand Visibility review')
replace_in('SO2', 'deliverable', 'Monthly fix log and a short search results report.', "Monthly fix log and the month's search results.")
BV_FIXES = (", and the site fixes Brand Visibility flags (robots.txt rules for AI crawlers, redirects for pages AI agents can't reach) "
            "are made by hand in the site's configuration or redirect sheet, within the same allowance")
append('SO2', 'assumptions', "These are the month's site fixes in one allowance: Sites Optimizer's approved fixes land in authoring and "
       "people publish them" + BV_FIXES + ".")
n = BY['SO2'].setdefault('neutral', {}).setdefault('bv', {})
assert n.get('scope') == [[' alongside the Brand Visibility review', '']], n
n['scope'] = [[' in the Brand Visibility review', '']]
n['assumptions'] = [[BV_FIXES, '']]

# L02: crawler access requested once per site
append('L02', 'assumptions', "Crawler access is requested once per site, here: Adobe's scanner (Spacecat/1.0, which Sites Optimizer also uses) "
       "and the AI crawlers in robots.txt and bot rules. The edge-optimization user agent is allowed by whichever service sets up the edge route.")

# A02: no ranking promise
append('A02', 'exclusions', 'Search rankings are not guaranteed.')

# F02: Adobe's timing figures stay; the consultants clause goes (Adam's rule)
replace_in('F02', 'assumptions', ', with Adobe consultants handling prompt engineering in the background. These hours',
           '. These hours')

blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob and 'consultants' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')

# ---------- drafts: step 14 texts are known, so they follow the new wording; a used O03 becomes the partner's own line ----------
o03 = {k: O03[k] for k in ('name', 'base', 'scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions')}
rep("const PRIOR_TEXT=", "const PRIOR15=" + json.dumps(prior, ensure_ascii=False) + ";\n"
    "/* Technical SEO and AI-search improvements retired on Nov 1 2026; a draft that used it keeps it as the partner's own service */\n"
    "const O03_RETIRED=" + json.dumps(o03, ensure_ascii=False) + ";\n"
    "const PRIOR_TEXT=")
rep("PREVIOUS_SCOPES[c.id]?.[key],PRIOR_TEXT[c.id]?.[key]].filter(x=>typeof x==='string')",
    "PREVIOUS_SCOPES[c.id]?.[key],PRIOR_TEXT[c.id]?.[key],...(PRIOR15[c.id]?.[key]||[])].filter(x=>typeof x==='string')")
rep(" const catalog=[...CATALOG,...d.custom,...d.canvas];\n",
    " for(const p of Object.keys(PLAYS)){const o=s.estimates?.[p]?.O03;if(!o||typeof o!=='object'||!(o.on===true||o.hoursEdited===true||o.scopeChanged===true))continue;\n"
    "  const id='CUSTOM-O03-'+p;if(seen.has(id))continue;const base=amount(o.hours,O03_RETIRED.base);\n"
    "  d.custom.push({id,name:O03_RETIRED.name,stage:'Optimize',base,low:0,high:base,unit:'monthly',plays:[p],scope:text(o.scope,O03_RETIRED.scope),deliverable:text(o.deliverable,O03_RETIRED.deliverable),acceptance:text(o.acceptance,O03_RETIRED.acceptance),assumptions:text(o.assumptions,O03_RETIRED.assumptions),exclusions:text(o.exclusions,O03_RETIRED.exclusions),basis:'Kept from this draft: the tool retired this service on November 1, 2026, so it is now your own service.',retired:{on:o.on===true,rate:amount(o.rate,'')}});seen.add(id);}\n"
    " const catalog=[...CATALOG,...d.custom,...d.canvas];\n")
rep("   d.estimates[p][c.id]=r;\n  }\n",
    "   if(c.retired){r.on=c.retired.on;r.rate=c.retired.rate;r.hours=c.base;delete c.retired;}\n   d.estimates[p][c.id]=r;\n  }\n")

# ---------- O03 leaves the code that lists services ----------
rep("if(has('O02','O03','O04','O05','O07','O08','O09','C03','C05','A02','SO2'))", "if(has('O02','O04','O05','O07','O08','O09','C03','C05','A02','SO2'))")
rep("noPages:!lines.some(l=>['O02','O03','O05','A02','C03','C05','SO2'].includes(baseId(l)))", "noPages:!lines.some(l=>['O02','O05','A02','C03','C05','SO2'].includes(baseId(l)))")
code = html[html.index('</style>'):]
assert "'O03'" not in code and '"O03"' not in code.replace('const O03_RETIRED', ''), 'O03 is still referenced'

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 15 applied:', len(CAT), 'services;', sum(len(v) for v in prior.values()), 'fields with earlier wording kept for drafts')
