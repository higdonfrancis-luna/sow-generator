"""Step 47 on the SOW steps, the content pass (Nov 5 2026, Adam: "yes, fix all 45"; items from sow/audit_2026-11-05/FINDINGS.md;
the canvas half is sow/canvas/data_step47.py and sow/canvas/patch_step47_content.py):
- 5: Coworker services print no partner instructions: the eligibility check is an assumption ("Assumes Adobe confirms that
  Coworker is available to the Client's organization"), the usage review is agreed through change control, the reuse
  note and "sales plays" go; the partner tips move to each service's basis (shown in the Add service list, never printed).
  On the FSI play each Coworker service asks, in Before you issue, for Adobe's written confirmation; a service whose
  assumptions still say "confirm eligibility" or "before proposing" is listed there too
- 6: a research service's prefilled assumptions written before step 47 ("Connection: <kind>. Availability: ...") take
  the new SOW version, and any text the partner added after them is kept
- 7: the statement of work says "the Client" even where a research text still said "the client"
- 11: Brand Visibility services print no estimating notes, play names or tool hints (O02, F02, C07, L03); F02's comparison
  with Adobe's FAQ moves to its basis
- 12: Prompt strategy states one quantity: no "(200 is the usual start)" or "Adjust the prompt count"; the license fit is
  an assumption; the coverage line no longer prints the band it sets; the Scope hint says to stay within the license
- 14: the AEM and Commerce SOWs mention the deployment pilot only when it is in them (the dependency and C07)
- 16: C06 says it needs Real-Time CDP or Journey Optimizer (an Also needs tag on the canvas, and its first assumption)
- 17 and 18: C01, C06 and OX3 are tagged CJA Select or higher, SO1 Sites Optimizer Ultimate; C01 and C06 assume CJA
  Select, Prime or Ultimate (derived fields are not in CJA Foundation)
- 37: "one existing video that appears"
- 45: C01 says how Brand Visibility's AI-agent data reaches CJA without claiming it reaches CJA only
Changed service wording keeps its earlier text in PRIOR47 (extended here, defined by patch_step47_sow.py), so an unedited
saved engagement takes the new wording.
Run once on the SOW page after patch_step47_sow.py, then build_site.py.

    python3 sow/patch_step47_content.py sow/index.html
"""
import json, re, sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'const PRIOR47=' in html, 'run patch_step47_sow.py first'
assert 'COWORKER_CONFIRM' not in html, 'run this once'


def rep(old, new, n=1):
    global html
    assert html.count(old) == n, (html.count(old), old[:90])
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
DASHES = len(re.findall('[–—]', html))

m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
by = {c['id']: c for c in CAT}
PRIOR = {}


def at(sid, keys):
    keys = (keys,) if isinstance(keys, str) else keys
    o = by[sid]
    for k in keys[:-1]:
        o = o[k]
    return o, keys[-1]


def keep(sid, key, t):
    lst = PRIOR.setdefault(sid, {}).setdefault(key, [])
    if t not in lst:
        lst.append(t)


def sub(sid, keys, old, new):
    """replace old with new in one text of a service, keeping the earlier text"""
    o, k = at(sid, keys)
    t = o[k]
    assert t.count(old) == 1, (sid, keys, old)
    keep(sid, k, t)
    o[k] = t.replace(old, new)


def tip(sid, text):
    """a partner tip in the basis, which the Add service list shows and the SOW never prints"""
    assert text not in by[sid]['basis']
    by[sid]['basis'] = by[sid]['basis'].rstrip() + ' ' + text


# 5: Coworker: no partner instructions in the SOW
ASSUMES = " Assumes Adobe confirms that Coworker is available to the Client's organization."
sub('CW01', 'assumptions', ' Adobe says Coworker is not currently available to organizations in health care, finance or some other industries; confirm eligibility with Adobe first.', ASSUMES)
sub('CW00', 'assumptions',
    'A specialized workflow package is separately selected or already implemented. Reuse the foundation across sales plays and reduce work already completed. '
    'Adobe says Coworker is not currently available to organizations in health care, finance or some other industries; confirm eligibility with Adobe first.',
    'A specialized Skills package is included in this statement of work or already implemented. Discovery, context and training already delivered under '
    'another statement of work are not repeated.' + ASSUMES)
FSI_OLD = (" Adobe's Coworker in Workfront page says Coworker is not currently available to organizations in health care, finance or some other industries, "
           "so confirm eligibility with Adobe before proposing this to a bank or insurer.")
pairs = by['CW-FSI']['neutral']['fsi']['assumptions']
old_pair = [" before proposing this to a bank or insurer.", " before proposing it to an organization in those industries."]
assert pairs.count(old_pair) == 1
neutral_old = by['CW-FSI']['assumptions']
for a, b in pairs:
    assert neutral_old.count(a) == 1
    neutral_old = neutral_old.replace(a, b)
keep('CW-FSI', 'assumptions', neutral_old)
sub('CW-FSI', 'assumptions', FSI_OLD, ASSUMES)
pairs.remove(old_pair)
sub('CW06', 'assumptions', ' Review usage after three months and reset the band to the actual update volume and value.',
    ' The partner and the Client review usage after three months; any change to the monthly hours is agreed through change control.')
sub('CW07', 'assumptions', " Reuse across clients is the partner's choice.", '')
sub('CW05', 'exclusions', 'duplicate training across sales plays', 'training already delivered under another statement of work')
ELIG_TIP = "Before proposing it, confirm with Adobe that Coworker is available to your client's organization (Adobe says it is not currently offered to some industries, including health care and finance)."
tip('CW01', ELIG_TIP)
tip('CW00', ELIG_TIP + ' Reduce the hours for work already delivered under another statement of work.')
tip('CW-FSI', ELIG_TIP)
tip('CW05', 'Reduce the hours for training already delivered under another statement of work.')
tip('CW06', 'After three months, review the usage with your client and resize the band to the actual update volume and value.')
tip('CW07', "Reuse of the plugin across your clients is agreed in your commercial terms.")
# 11: no estimating notes, play names or tool hints in the SOW
sub('O02', 'assumptions', ' The page mix and volume can be changed before pricing the service.', '')
F02_OLD = ("Adobe's Brand Concierge FAQ puts a basic setup at about 3 to 5 days, an advanced implementation at about 2 to 4 weeks and go-live at about 6 to 9 weeks. "
           "These hours are the partner's planning assumption for the work around that setup (approved sources and reviewers, conversation and disclosure design, "
           "the handoff, the golden-answer and refusal tests and the staged rollout) and are not yet reconciled with Adobe's figures or an independent delivery estimate.")
sub('F02', 'assumptions', F02_OLD, "These hours cover the partner's work around Adobe's setup: approved sources and reviewers, conversation and disclosure design, "
    "the handoff, the golden-answer and refusal tests and the staged rollout.")
tip('F02', "Adobe's Brand Concierge FAQ puts a basic setup at about 3 to 5 days, an advanced implementation at about 2 to 4 weeks and go-live at about 6 to 9 weeks; "
    "these hours are a planning assumption for the work around that setup, not yet reconciled with Adobe's figures or an independent delivery estimate.")
sub('C07', 'assumptions', 'When an existing setup is confirmed ready, the Small band covers confirming and verifying it.', 'Where an existing setup is confirmed ready, this service confirms and verifies it.')
sub('L03', 'assumptions', '(on the AEM play, Implement AEM Sites on Edge Delivery turns it on)', '(where Implement AEM Sites on Edge Delivery is part of this engagement, it turns the route on)')
sub('L03', 'assumptions', 'or covered by CDN readiness and routing in the Commerce play)', 'or set up by CDN readiness and routing)')
sub('L03', 'assumptions', ' This package is selected only when automated deployment is required.', '')
# 12: one prompt quantity in the SOW
sub('L01', 'scope', 'Run two discovery workshops and curate 200 to 1,000 prompts in up to three markets or languages (200 is the usual start), covering agreed customer intents, three competitors and five business measures. Adjust the prompt count to the Client\'s license.',
    'Run two discovery workshops and curate 200 to 1,000 prompts in up to three markets or languages, covering agreed customer intents, three competitors and five business measures.')
for b in ('small', 'large'):
    sub('L01', ('bands', b, 'scope'), " Adjust the prompt count to the Client's license.", '')
sub('L01', 'assumptions', 'Shared strategy work is reused across related domains.', "Shared strategy work is reused across related domains. The agreed prompt count fits within the Client's Brand Visibility license.")
# 14: the deployment pilot only where it is in the SOW
for keys in ('scope', ('bands', 'small', 'scope')):
    sub('C07', keys, 'verify one page ahead of the deployment pilot', 'verify one page before the first optimization goes live through the route')
for keys in ('deliverable', ('bands', 'small', 'deliverable')):
    sub('C07', keys, 'the handoff to the deployment pilot.', 'the handoff of the verified route for the first edge deployment.')
sub('C07', 'exclusions', 'the deployment pilot itself (a separate service)', 'the optimizations deployed through the route (separate services)')
# 16 and 17: what C01, C06, OX3 and SO1 need
DERIVED = ' The Client has licensed CJA Select, Prime or Ultimate (derived fields are not included in CJA Foundation).'
sub('C06', 'assumptions', "The Client's Experience Platform has Real-Time Customer Profile, where CJA publishes audiences.",
    "The Client licenses Real-Time CDP or Journey Optimizer, because CJA audience publishing to Real-Time Customer Profile needs one of them; CJA alone does not license Profile Service." + DERIVED)
# 45: how the AI-agent data reaches CJA, without "only"
sub('C01', 'assumptions', "(Adobe Analytics can feed Brand Visibility's referral reporting, but the AI-agent dataset reaches CJA only)",
    "(Brand Visibility's AI-agent data reaches CJA as an Experience Platform dataset through the Adobe Brand Visibility source, which the Client adds to a CJA "
    "connection and data view; Adobe Analytics can feed only Brand Visibility's referral reporting on the Business Impact tab)")
sub('C01', 'assumptions', 'Client application owners provide access and approve metric definitions.', 'Client application owners provide access and approve metric definitions.' + DERIVED)
for sid, k, v in [('C06', 'ext', 'Real-Time CDP or Journey Optimizer'), ('C01', 'tier', 'CJA Select or higher'), ('C06', 'tier', 'CJA Select or higher'),
                  ('OX3', 'tier', 'CJA Select or higher'), ('SO1', 'tier', 'Sites Optimizer Ultimate')]:
    assert k not in by[sid], (sid, k)
    by[sid][k] = v
# 37
sub('O08', ('bands', 'small', 'scope'), 'Align one existing video that appear in', 'Align one existing video that appears in')

new_raw = json.dumps(CAT, ensure_ascii=False)
for bad in ('confirm eligibility', 'before proposing', 'sales play', "partner's choice", 'reset the band', 'usual start', 'Adjust the prompt count', 'Small band',
            'the AEM play', 'the Commerce play', 'reaches CJA only', 'video that appear in'):
    for c in CAT:
        for k in ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions'):
            assert bad not in c.get(k, ''), (c['id'], k, bad)
            for b in ('small', 'typical', 'large'):
                assert bad not in ((c.get('bands') or {}).get(b) or {}).get(k, ''), (c['id'], b, k, bad)
assert not re.search('[–—]', new_raw)
html = html[:m.start(1)] + new_raw + html[m.end(1):]

# the earlier texts join PRIOR47 (one record of the step 47 wording changes)
pm = re.search(r'const PRIOR47=(\{.*?\});\n', html)
P47 = json.loads(pm.group(1))
for sid, keys in PRIOR.items():
    for k, lst in keys.items():
        if k == 'basis':
            continue
        cur = P47.setdefault(sid, {}).setdefault(k, [])
        cur.extend(x for x in lst if x not in cur)
rep(pm.group(0), 'const PRIOR47=' + json.dumps(P47, ensure_ascii=False) + ';\n')
rep('/* step 47: the wording before the audit fixes (the CDN log job, pointers to sections the SOW does not have) */\n',
    '/* step 47: the wording before the audit fixes (the CDN log job, pointers to sections the SOW does not have, partner notes and tool hints in service texts) */\n')

# 7: the statement of work says the Client, even where a research text still says the client
rep("const docVoice=t=>typeof t==='string'?t.replace(/\\b([Yy])our client\\b/g,(m,y)=>y==='Y'?'The Client':'the Client'):t;",
    "const docVoice=t=>typeof t==='string'?t.replace(/\\b([Yy])our client\\b/g,(m,y)=>y==='Y'?'The Client':'the Client').replace(/\\b([Tt])he client(?![-\\w])/g,(m,t)=>t+'he Client'):t;")
# 6: a research service's prefill from before step 47 takes the SOW version, keeping what the partner added after it
rep("CUSTOM_BV=now;if(known.includes(r[k]))r[k]=lineText(n,p,r.band,k);}}}",
    "CUSTOM_BV=now;if(known.includes(r[k]))r[k]=lineText(n,p,r.band,k);\n"
    "    /* step 47: a prefill from before step 47 (\"Connection: <kind>. Availability: ...\") gives way to the SOW version; what the partner wrote after it stays */\n"
    "    else if(k==='assumptions'&&n.concept&&typeof o[k]==='string'&&/^Connection: /.test(o[k])&&typeof r[k]==='string'&&r[k].startsWith(o[k]))r[k]=lineText(n,p,r.band,k)+r[k].slice(o[k].length);}}}")
# 5: on the FSI play, Adobe's written confirmation that Coworker is available; no partner note left in assumptions
rep(" for(const s of lines)if(baseId(s)==='XA09'){",
    " /* step 47: Coworker isn't offered to some industries, so on the FSI play each Coworker service records Adobe's written confirmation; and no partner note stays in an assumption */\n"
    " const COWORKER_CONFIRM=s=>state.play==='fsi'&&(/^CW/.test(baseId(s))||/\\bCoworker\\b/.test(s.name));\n"
    " for(const s of lines){const r=row(s);if(COWORKER_CONFIRM(s)&&!(/confirm/i.test(r.assumptions)&&/\\d/.test(r.assumptions)))out.push(s.name+': record Adobe\\'s written confirmation (date or reference) that Coworker is available to the Client\\'s organization in its assumptions.');\n"
    "  if(/confirm eligibility|before proposing/i.test(r.assumptions||''))out.push(s.name+': its assumptions still hold a note to you (\"confirm eligibility\" or \"before proposing\"). Rewrite it as an assumption, such as \"Assumes Adobe confirms that Coworker is available to the Client\\'s organization.\"');}\n"
    " for(const s of lines)if(baseId(s)==='XA09'){")
# 12: the coverage line states the prompts, not the band they set; the hint says to stay within the license
rep("+' (sets the prompt services to the '+BAND_NAME[monitoringBand(state.play)]+' band)'", '')
rep('200 is the usual start; Adobe recommends no number.</small>', '200 is the usual start; Adobe recommends no number. Keep it within the prompts the Brand Visibility license allows.</small>')
# 14: the dependency names the deployment pilot only when it is in the SOW
rep("A missed window moves the deployment pilot and the AI-traffic baseline.');", "A missed window moves '+(has('L03')?'the deployment pilot and ':'')+'the AI-traffic baseline.');")

assert html.count('{') - html.count('}') == BRACES
assert len(re.findall('[–—]', html)) == DASHES
open(path, 'w', encoding='utf-8').write(html)
print('step 47 content applied to', path, '; PRIOR47 now records', sum(len(v) for v in P47.values()), 'texts')
