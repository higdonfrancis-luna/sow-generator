"""Step 18 of the SOW tool (Nov 2 2026): the starting services of two plays, step 1b of the services review
(sow/services_review_2026-11-01/PROPOSAL.md), the one default overlap ChatGPT's Nov 2 review still found.
Adam: "you're in charge". No hours change; the services stay in the plays as add-ons.
- Commerce: the automated deployment pilot (L03) becomes an add-on (an optional button on Services, and under More
  services on the canvas). Commerce already starts with its own edge pilot on product pages (C02), on the route the
  CDN line (C07) sets up. Add L03 when the customer wants Adobe's impact analysis on a supported opportunity.
- FSI: when Brand Concierge is new, or live but needs fixes, the build (F02) tests the Brand Visibility discovery
  questions in its golden-answer set, so the separate discovery-to-answer workflow (C04) starts off; it starts on
  only when the concierge is live and healthy. Both on now asks the partner to say how they differ, or remove one.
- The canvas starts with the same services (sow/canvas/patch_step18.py).
At Typical and $150 an hour for 12 months: Commerce $228,000 becomes $222,000; FSI with a new concierge $308,400
becomes $300,000.
Run once on the step 17 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step18.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const PRIOR17=' in html and 'PRIOR18' not in html, 'run this on the step 17 file'


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
prior = {}

# F02 tests the Brand Visibility discovery questions in its golden-answer set (outside Brand Visibility the words go)
Q = ' (with the priority discovery questions from the Brand Visibility program)'
f02 = BY['F02']
old_scopes = [f02['scope'], f02['bands']['large']['scope']]
prior['F02'] = {'scope': old_scopes}
for holder in (f02, f02['bands']['large']):
    assert holder['scope'].count('build the golden-answer test set and the refusal') == 1
    holder['scope'] = holder['scope'].replace('build the golden-answer test set and the refusal', 'build the golden-answer test set' + Q + ' and the refusal')
assert 'bv' not in f02['neutral']
f02['neutral']['bv'] = {'scope': [[Q, '']]}

blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')
rep("const PRIOR17=", "const PRIOR18=" + json.dumps(prior, ensure_ascii=False) + ";\nconst PRIOR17=")
rep("...(PRIOR17[c.id]?.[key]||[])].filter(x=>typeof x==='string')", "...(PRIOR17[c.id]?.[key]||[]),...(PRIOR18[c.id]?.[key]||[])].filter(x=>typeof x==='string')")

# starting services
rep("commerce:['L01','L02','L03','C02','C07','O01','O02']", "commerce:['L01','L02','C02','C07','O01','O02']")
rep("fsi:['L01','L02','F02','C04','O01','O02']", "fsi:['L01','L02','F02','O01','O02']")

# the FSI answer sets both lines: the build, or the workflow on a live and healthy concierge
rep("function applyFsiState(){const r=state.estimates.fsi&&state.estimates.fsi.F02;if(!r)return;r.on=state.fsiState!=='healthy';renderScope();"
    "toast(state.fsiState==='healthy'?'Implement Brand Concierge is off: the experience is live and healthy.':state.fsiState==='remediate'?'Implement Brand Concierge stays on: edit its scope to the remediation work.':'Implement Brand Concierge is on.');}",
    "function applyFsiState(){const e=state.estimates.fsi,r=e&&e.F02;if(!r)return;r.on=state.fsiState!=='healthy';if(e.C04)e.C04.on=state.fsiState==='healthy';renderScope();"
    "toast(state.fsiState==='healthy'?'Implement Brand Concierge is off and the discovery-to-answer workflow is on: the experience is live and healthy.':state.fsiState==='remediate'?'Implement Brand Concierge stays on: edit its scope to the remediation work, with the Brand Visibility questions in its tests.':'Implement Brand Concierge is on, with the Brand Visibility questions in its tests.');}")
rep("if(state.play==='fsi'&&state.estimates.fsi.F02)state.estimates.fsi.F02.on=state.fsiState!=='healthy';",
    "if(state.play==='fsi'&&state.estimates.fsi.F02){state.estimates.fsi.F02.on=state.fsiState!=='healthy';if(state.estimates.fsi.C04)state.estimates.fsi.C04.on=state.fsiState==='healthy';}")
rep("$('fsi-note').textContent={new:'This engagement implements Brand Concierge (Implement Brand Concierge is on), then maps discovery questions to approved sources and tests the handoff.',"
    "healthy:'This engagement builds on the live Brand Concierge experience: discovery questions, approved sources and the handoff. Implement Brand Concierge is off.',"
    "remediate:'The live experience needs fixes first. Implement Brand Concierge stays on: edit its scope to the remediation work before issuing.'}[state.fsiState];",
    "$('fsi-note').textContent={new:'This engagement implements Brand Concierge (Implement Brand Concierge is on). Its golden-answer tests include the Brand Visibility discovery questions, so the separate discovery-to-answer workflow starts off.',"
    "healthy:'This engagement builds on the live Brand Concierge experience: the discovery-to-answer workflow maps the Brand Visibility questions to approved sources and tests the handoff. Implement Brand Concierge is off.',"
    "remediate:'The live experience needs fixes first. Implement Brand Concierge stays on: edit its scope to the remediation work, with the Brand Visibility discovery questions in its tests, before issuing.'}[state.fsiState];")

# both on: say how they differ, or remove one
rep("/* charge both only with a distinct scope: specialized Coworker Skills replace generic Skills, and the shared setup replaces its separate packages */\n"
    "const SPECIAL_SKILLS=['CW-CJA','CW-AEM','CW-FSI','AXD11','XA25','XA26','XA27'];\n"
    "const OVERLAPS=[['CW03',SPECIAL_SKILLS]];",
    "/* charge both only with a distinct scope: specialized Coworker Skills replace generic Skills, the shared setup replaces its separate packages, and a Brand Concierge build already tests the Brand Visibility questions the discovery-to-answer workflow maps */\n"
    "const SPECIAL_SKILLS=['CW-CJA','CW-AEM','CW-FSI','AXD11','XA25','XA26','XA27'];\n"
    "const OVERLAPS=[['CW03',SPECIAL_SKILLS],['C04',['F02']]];")

# the Commerce pilot is one click away on Services
rep("state.play==='commerce'?['C07','O04','O07','O08','O09','X01']", "state.play==='commerce'?['C07','L03','O04','O07','O08','O09','X01']")
rep("X01:'Executive alignment workshops',", "X01:'Executive alignment workshops',L03:'Automated deployment pilot',")

assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 18 applied: Commerce deployment pilot is an add-on; FSI question mapping starts only for a live and healthy concierge')
