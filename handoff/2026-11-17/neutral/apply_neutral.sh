#!/bin/bash
# The Brand Visibility + Brand Concierge play (id fsi) reads for any industry, and the owner's choice C (Nov 17 2026): the RFI
# Builder offers Brand Concierge's answer and source review (FSI01) in any client's RFI, not only a bank's or an insurer's.
#
# Every edit is made by content: a unique piece of text, or a field of one service in index.html's CATALOG. No edit depends on
# a line number, so the script runs on later commits too. It reads every file first and writes nothing unless every edit finds
# its text exactly once. A file that already holds its change (from a run that was cut off, or from an earlier run) is checked,
# not edited again: every one of its edits must be in it. Each file is written whole through a temporary file, index.html last.
# Then it rebuilds canvas/catalog.json, canvas/index.html, rfp_method.json and site/, also when every file already held the
# change, so a build that was cut off is done again.
#   apply_neutral.sh <checkout>              edit, then build
#   apply_neutral.sh <checkout> --no-build   edit only
# Exit 0: applied, finished, or already applied (then only the builds run). Exit 1: an edit did not find its text, or a file
# holds only part of its change; nothing was written.
set -euo pipefail
REPO="${1:?usage: apply_neutral.sh <checkout> [--no-build]}"
BUILD=1
[ "${2:-}" = "--no-build" ] && BUILD=0
REPO=$(cd "$REPO" && pwd)
set +e
python3 - "$REPO" <<'PY'
import hashlib, json, os, re, shutil, sys

ROOT = sys.argv[1]
TEXT = {}


def read(rel):
    if rel not in TEXT:
        with open(os.path.join(ROOT, rel), encoding='utf-8', newline='') as f:
            TEXT[rel] = f.read()
    return TEXT[rel]


def fail(msg):
    sys.stderr.write('apply_neutral: ' + msg + '\nNothing was written.\n')
    sys.exit(1)


def swap(rel, old, new):
    """replace one piece of text that occurs exactly once in the file; in a file that already holds the change, check it"""
    t = read(rel)
    if rel in DONE:
        if (new and new not in t) or (old in t and old not in new):
            fail(f'{rel} holds only part of the change, not: {(new or old)[:200]!r}')
        return
    n = t.count(old)
    if n != 1:
        fail(f'{rel}: expected this text once, found it {n} times: {old[:200]!r}')
    TEXT[rel] = t.replace(old, new)


def gone(rel, *texts):
    for x in texts:
        if x in read(rel):
            fail(f'{rel}: still holds {x!r} after the edits')


# Each file's own mark of the change. A file with its mark already holds the change (a run that was cut off, or an earlier
# run, wrote it): the edits below check that file instead of editing it, and stop the script if any of them is not in it.
MARK = {
    'index.html': 'const PRIOR_FSI=',
    'canvas/build.py': "for k in ('name', 'scope', 'ext', 'tier')]",
    'canvas/template.html': 'function row(l){const L=LN[l],on=lineOn(l),off=!on;',
    'qa/check_product_copy.py': "for k in ('name', 'ext', 'tier')]",
    'product_copy.py': 'connection; name, scope, ext, tier on a service.',
    'rfp_answers.js': '===l){s=2;first=true;}',
    'rfp_prototype/kb_method/reviewed/batch_02.json': 'flagging possible mismatches on product facts, prices, eligibility or handoffs.',
    'rfp_prototype/kb_method/reviewed/batch_09.json': '"Answer test record"',
    'rfp_prototype/kb_method/reviewed/batch_10.json': '"Current product references for the products in scope"',
    'test_review_nov2.js': "[lineOn('C04'), LN.C04.name, LN.FSI01.name]",
    'test_rfp_step54.js': '!n.asks.some(a => /financial-services reviewers/.test(a.text))',
    'test_rfp_step67.js': "worded for any industry');",
    'test_rfp_step81.js': '  // 3c. Nov 17 2026,',
    'test_step86.js': "play_services: {'CW-FSI': ",
    'test_site.js': '  // 3d. Nov 17 2026:',
}
DONE = {rel for rel, mark in MARK.items() if mark in read(rel)}

# ---------------------------------------------------------------------------------------------------------------------------
# 1. index.html, the service lines (CATALOG). Each line stores the wording the other plays already read (its neutral pairs),
#    without what that wording still kept from finance; the pairs and the play's context flag go. Every id and saved key stays.
H = 'index.html'
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', read(H), re.S)
if not m:
    fail('index.html: no CATALOG')
cat = json.loads(m.group(1))
if json.dumps(cat) != m.group(1):
    fail('index.html: CATALOG is not in the form json.dumps writes, so it cannot be written back unchanged')
S = {x['id']: x for x in cat}

# PRIOR_FSI: every text the page counted as unedited before this change and would not after it, for the eight lines (step 7).
# It was worked out from the texts and wording pairs these lines have at edd8f61 and still have at 6a96c44. If a later commit
# changes them, a saved quote can hold wording PRIOR_FSI does not know, so the script stops: work PRIOR_FSI out again first (the
# known-text tools are in wf5/neutral/tools: known_sets.js on the builds before and after, then known_compare.py).
PRIOR_FSI = json.loads(r'''{
 "F02": {
  "scope": [
   "Set up the Brand Concierge experience for the agreed banking or insurance products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up the handoff (live chat, meeting booking or both) routed to one Client-designated team, build, with the Client's reviewers, the golden-answer test set (including the priority discovery questions from the Brand Visibility program) and the refusal and escalation scenarios, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed banking or insurance products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up two handoff routes, each agreed separately, to two Client-designated teams, build, with the Client's reviewers, the golden-answer test set (including the priority discovery questions from the Brand Visibility program) and the refusal and escalation scenarios, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, connect one handoff route to the customer-designated team, test with the customer's reviewers and launch on the agreed pages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up one supported handoff to the customer-designated team, build the golden-answer test set (with the priority discovery questions from the Brand Visibility program) and the refusal and escalation scenarios with the customer's reviewers, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up one supported handoff to the customer-designated team, build the golden-answer test set and the refusal and escalation scenarios with the customer's reviewers, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up the handoff (live chat, meeting booking or both) routed to one customer-designated team, build the golden-answer test set (with the priority discovery questions from the Brand Visibility program) and the refusal and escalation scenarios with the customer's reviewers, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up two handoff routes, each agreed separately, to two customer-designated teams, build the golden-answer test set (with the priority discovery questions from the Brand Visibility program) and the refusal and escalation scenarios with the customer's reviewers, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up two separately agreed, supported handoff routes to the customer-designated teams, build the golden-answer test set (with the priority discovery questions from the Brand Visibility program) and the refusal and escalation scenarios with the customer's reviewers, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages.",
   "Set up the Brand Concierge experience for the agreed products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, set up two separately agreed, supported handoff routes to the customer-designated teams, build the golden-answer test set and the refusal and escalation scenarios with the customer's reviewers, complete Adobe's pre-go-live checks, and launch on the agreed pages in stages."
  ]
 },
 "C04": {
  "scope": [
   "Map 10 banking or insurance discovery questions from the ABV program to Client-approved Concierge sources. Validate five conversation paths against approved product facts, rates, fees and disclosures, and test one supported handoff to the Client-designated team.",
   "Map 10 discovery questions from the ABV program to Client-approved Concierge sources. Validate five conversation paths against approved product facts and disclosures, and test one supported handoff to the Client-designated team.",
   "Map 20 banking or insurance discovery questions from the ABV program to Client-approved Concierge sources. Validate 10 conversation paths against approved product facts, rates, fees and disclosures, and test one supported handoff to the Client-designated team.",
   "Map 20 discovery questions from the ABV program to Client-approved Concierge sources. Validate 10 conversation paths against approved product facts and disclosures, and test one supported handoff to the Client-designated team.",
   "Map 20 discovery questions from the ABV program to customer-approved Concierge sources. Validate 10 conversation paths against approved product facts and disclosures, and test one existing supported handoff to the customer-designated team.",
   "Map 40 banking or insurance discovery questions from the ABV program to Client-approved Concierge sources. Validate 20 conversation paths against approved product facts, rates, fees and disclosures, and test two supported handoffs to the Client-designated team.",
   "Map 40 discovery questions from the ABV program to Client-approved Concierge sources. Validate 20 conversation paths against approved product facts and disclosures, and test two supported handoffs to the Client-designated team."
  ],
  "deliverable": [
   "Question-to-source map, source ownership and refresh workflow, answer/disclosure test record, human-handoff evidence and named Client review responsibilities."
  ],
  "assumptions": [
   "The Concierge experience (built in Implement Brand Concierge, or already live and healthy), the financial-services use case and the handoff route are approved and available. The Client supplies current authoritative content, source owners, reviewers and applicable review criteria. ABV findings are carried to Concierge through a partner-managed question-to-approved-source workflow; no native connector is assumed. The Client confirms the prerequisites and availability of the selected handoff integration."
  ]
 },
 "O04": {
  "scope": [
   "Prioritize 10 relevant publications, review roundups, directories or other independent sources, chosen from those AI answers cite for the agreed prompts; create two approved evidence-based pitch assets and complete up to 10 Client-authorized outreach actions or sourced correction requests, including Wikipedia where appropriate (Wikipedia changes are proposed on the article's talk page with the paid-contribution disclosure Wikipedia requires; the partner does not edit articles about the Client directly). For financial services, use Client-approved claims and trusted financial outlets.",
   "Prioritize 20 relevant publications, review roundups, directories or other independent sources, chosen from those AI answers cite for the agreed prompts; create four approved evidence-based pitch assets and complete up to 20 Client-authorized outreach actions or sourced correction requests, including Wikipedia where appropriate (Wikipedia changes are proposed on the article's talk page with the paid-contribution disclosure Wikipedia requires; the partner does not edit articles about the Client directly). For financial services, use Client-approved claims and trusted financial outlets.",
   "Prioritize five relevant publications, review roundups, directories or other independent sources, chosen from those AI answers cite for the agreed prompts; create one approved evidence-based pitch asset and complete up to five Client-authorized outreach actions or sourced correction requests, including Wikipedia where appropriate (Wikipedia changes are proposed on the article's talk page with the paid-contribution disclosure Wikipedia requires; the partner does not edit articles about the Client directly). For financial services, use Client-approved claims and trusted financial outlets."
  ],
  "assumptions": [
   "Credible Client evidence and explicit outreach authorization are available. An existing source-priority list and the monthly performance review are reused when included; research and reporting already in another selected service are not repeated here. Client-designated financial-services reviewers approve applicable claims. Publishers and community editors retain all editorial decisions. The action counts are a capacity limit, not an outcome."
  ]
 },
 "CW-FSI": {
  "scope": [
   "Build one Skill to flag potential answer/source mismatches in conversations for human review, including product facts and disclosures against Client-approved references. Use one agreed report format.",
   "Build one Skill to flag potential answer/source mismatches in conversations for human review, including rates, fees and disclosures against customer-approved references. Use one agreed report format.",
   "Build one Skill to flag potential answer/source mismatches in financial-services conversations for human review, including rates, fees and disclosures against Client-approved references. Use one agreed report format.",
   "Build three Skills to summarize conversation themes, flag potential answer/source mismatches and track recurring exceptions for human review, including product facts and disclosures against Client-approved references. Use two agreed report formats.",
   "Build three Skills to summarize conversation themes, flag potential answer/source mismatches and track recurring exceptions for human review, including rates, fees and disclosures against customer-approved references. Use two agreed report formats.",
   "Build three Skills to summarize financial-services conversation themes, flag potential answer/source mismatches and track recurring exceptions for human review, including rates, fees and disclosures against Client-approved references. Use two agreed report formats.",
   "Build two Skills to summarize conversation themes and flag potential answer/source mismatches for human review, including product facts and disclosures against Client-approved references. Use one agreed report format.",
   "Build two Skills to summarize conversation themes and flag potential answer/source mismatches for human review, including rates, fees and disclosures against customer-approved references. Use one agreed report format.",
   "Build two Skills to summarize financial-services conversation themes and flag potential answer/source mismatches for human review, including rates, fees and disclosures against Client-approved references. Use one agreed report format."
  ],
  "assumptions": [
   "Conversation data is accessible through the supported AEP/Query Service route; the Client approves handling, supplies current financial-product references and names reviewers. The CSV route requires Data Distiller. A Coworker foundation is in place. These Skills are partner-built and need their own evaluation; they help reviewers and don't replace the Client's review.",
   "Conversation data is accessible through the supported AEP/Query Service route; the Client approves handling, supplies current product references and names reviewers. The documented CSV route requires Data Distiller. A Coworker foundation is in place. These Skills are partner-built and need their own evaluation; they help reviewers and don't replace the Client's review. Adobe's Coworker in Workfront page says Coworker is not currently available to organizations in health care, finance or some other industries, so confirm eligibility with Adobe before proposing this to a bank or insurer.",
   "Conversation data is accessible through the supported AEP/Query Service route; the customer approves handling, supplies current product references and names reviewers. The documented CSV route requires Data Distiller. A Coworker foundation is in place.",
   "Conversation data is accessible through the supported AEP/Query Service route; the customer approves handling, supplies current product references and names reviewers. The documented CSV route requires Data Distiller. A Coworker foundation is in place. These Skills are partner-built and need their own evaluation; they help reviewers and don't replace the customer's review. Adobe's Coworker in Workfront page says Coworker is not currently available to organizations in health care, finance or some other industries, so confirm eligibility with Adobe before proposing this to a bank or insurer."
  ],
  "exclusions": [
   "New Concierge/AEP setup, ingestion redesign, automated advice or compliance decisions, recurring manual reviews and duplicate content-workflow or generic Skill work.",
   "New Concierge/AEP setup, ingestion redesign, automated financial advice or compliance decisions, recurring manual answer reviews, full-population audits and duplicate content-workflow or generic Skill development."
  ]
 },
 "O07": {
  "assumptions": [
   "Client expertise, approved facts and authorized accounts are available. Contributions follow each community's current rules. Shared source research and monthly reporting are reused when off-site authority or the monthly review is included. Financial-services contributions require the Client's designated review. The contribution count is a capacity limit, not an outcome."
  ]
 },
 "O08": {
  "assumptions": [
   "The Client owns the videos, provides channel access and supplies approved source facts and reviewers. Existing footage can answer the agreed questions without re-recording. The shared opportunity research and monthly report are reused when included. Financial-services content follows the Client's designated review. The channel supports the agreed caption and chapter features. The video count is a capacity limit, not an outcome."
  ]
 },
 "FSI01": {
  "scope": [
   "Review up to 20 sampled Concierge conversations in two scheduled batches against Client-approved financial-product references. Flag potential mismatches involving rates, fees, eligibility, policy conditions, disclosures or handoffs, and route findings to named Client reviewers.",
   "Review up to 20 sampled Concierge conversations in two scheduled batches against Client-approved product references. Flag potential mismatches involving product facts, prices, eligibility, disclosures or handoffs, and route findings to named Client reviewers.",
   "Review up to 20 sampled Concierge conversations in two scheduled batches against customer-approved financial-product references. Flag potential mismatches involving product facts, prices, eligibility, disclosures or handoffs, and route findings to named customer reviewers.",
   "Review up to 40 sampled Concierge conversations in four scheduled batches against Client-approved financial-product references. Flag potential mismatches involving rates, fees, eligibility, policy conditions, disclosures or handoffs, and route findings to named Client reviewers.",
   "Review up to 40 sampled Concierge conversations in four scheduled batches against Client-approved product references. Flag potential mismatches involving product facts, prices, eligibility, disclosures or handoffs, and route findings to named Client reviewers.",
   "Review up to 40 sampled Concierge conversations in four scheduled batches against customer-approved financial-product references. Flag potential mismatches involving product facts, prices, eligibility, disclosures or handoffs, and route findings to named customer reviewers.",
   "Review up to 80 sampled Concierge conversations in eight scheduled batches against Client-approved financial-product references. Flag potential mismatches involving rates, fees, eligibility, policy conditions, disclosures or handoffs, and route findings to named Client reviewers.",
   "Review up to 80 sampled Concierge conversations in eight scheduled batches against Client-approved product references. Flag potential mismatches involving product facts, prices, eligibility, disclosures or handoffs, and route findings to named Client reviewers.",
   "Review up to 80 sampled Concierge conversations in eight scheduled batches against customer-approved financial-product references. Flag potential mismatches involving product facts, prices, eligibility, disclosures or handoffs, and route findings to named customer reviewers."
  ],
  "exclusions": [
   "Full-population monitoring, legal advice or compliance certification, automated financial advice, new data pipelines, Coworker Skill development, content remediation and live-chat operations."
  ]
 },
 "O09": {
  "assumptions": [
   "Usable footage, approved facts, brand assets, rights and channel access are supplied by the Client. Existing question research is reused. For financial services, the Client supplies designated reviewers. Metadata and captions are included here once; YouTube answer-content optimization isn't charged again for the same launch work on this video."
  ]
 }
}''')
GUARD = {'F02': '528f19aef8f55c9c', 'C04': 'c9a839d575d8e78d', 'O04': '2621b074298529e6', 'CW-FSI': 'aa74e125c9aa6573',
         'O07': '2f91f9edfbae1091', 'O08': '095f2d68acd005fb', 'FSI01': 'e31ccc53b6cd1b8d', 'O09': '3ee13a92156aac7f'}


def guarded(sid, keys):
    c = S[sid]
    sel = {'neutral': c.get('neutral'), 'texts': {k: [c.get(k)] + [(c.get('bands') or {}).get(b, {}).get(k) for b in ('small', 'typical', 'large')] for k in sorted(keys)}}
    return hashlib.sha256(json.dumps(sel, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


changed = [sid for sid in GUARD if sid not in S or guarded(sid, PRIOR_FSI[sid]) != GUARD[sid]]
if changed and H not in DONE:   # once index.html holds the change, these lines read the new texts
    fail('CATALOG: ' + ', '.join(changed) + ' changed since 6a96c44 (texts or wording pairs), so PRIOR_FSI must be worked out again')


def edit(sid, path, old, new):
    """replace old with new, once, in the text at path (a key, or bands.<band>.<key>) of one service; check it if index.html
    already holds the change"""
    if sid not in S:
        fail(f'CATALOG has no {sid}')
    node, keys = S[sid], path.split('.')
    for k in keys[:-1]:
        node = node.get(k) if isinstance(node, dict) else None
        if node is None:
            fail(f'CATALOG {sid} has no {path}')
    t = node.get(keys[-1])
    if H in DONE:
        if not isinstance(t, str) or (new and new not in t) or old in t:
            fail(f'index.html holds only part of the change, not CATALOG {sid}.{path}: {(new or old)!r}')
        return
    if not isinstance(t, str) or t.count(old) != 1:
        fail(f'CATALOG {sid}.{path}: expected {old!r} once')
    node[keys[-1]] = t.replace(old, new)


def drop_fsi(sid):
    n = S[sid].get('neutral') or {}
    if H in DONE:   # checked for every line below: none still holds neutral.fsi pairs
        return
    if 'fsi' not in n:
        fail(f'CATALOG {sid} has no neutral.fsi pairs')
    del n['fsi']
    if not n:
        del S[sid]['neutral']


# F02 Implement Brand Concierge: only the products named; its disclosures are the concierge's own notices and stay
for path in ('scope', 'bands.large.scope'):
    edit('F02', path, 'for the agreed banking or insurance products', 'for the agreed products')
drop_fsi('F02')

# C04 discovery-to-answer workflow
edit('C04', 'name', 'Financial-services discovery-to-answer workflow', 'Discovery-to-answer workflow')
edit('C04', 'basis', 'One financial-services Concierge experience', 'One Concierge experience')
for path in ('scope', 'bands.small.scope', 'bands.large.scope'):
    edit('C04', path, 'banking or insurance discovery questions', 'discovery questions')
    edit('C04', path, 'against approved product facts, rates, fees and disclosures,', 'against approved product facts,')
edit('C04', 'deliverable', 'answer/disclosure test record', 'answer test record')
edit('C04', 'assumptions', 'the financial-services use case', 'the use case')
drop_fsi('C04')

# FSI01 monthly answer and source review
edit('FSI01', 'name', 'Financial-services answer and source review', 'Answer and source review')
for path in ('scope', 'bands.small.scope', 'bands.large.scope'):
    edit('FSI01', path, 'against Client-approved financial-product references', 'against Client-approved product references')
    edit('FSI01', path, 'rates, fees, eligibility, policy conditions, disclosures or handoffs', 'product facts, prices, eligibility or handoffs')
edit('FSI01', 'exclusions', 'automated financial advice', 'automated advice')
drop_fsi('FSI01')

# CW-FSI Coworker Skills for answer review
edit('CW-FSI', 'name', 'Coworker Skills for financial-services answer review', 'Coworker Skills for answer review')
for path in ('scope', 'bands.large.scope'):
    edit('CW-FSI', path, 'financial-services conversation themes', 'conversation themes')
edit('CW-FSI', 'bands.small.scope', 'in financial-services conversations', 'in conversations')
for path in ('scope', 'bands.small.scope', 'bands.large.scope'):
    edit('CW-FSI', path, 'including rates, fees and disclosures against Client-approved references', 'checking product facts against Client-approved references')
edit('CW-FSI', 'assumptions', 'supplies current financial-product references', 'supplies current product references')
edit('CW-FSI', 'exclusions', 'automated financial advice', 'automated advice')
drop_fsi('CW-FSI')

# the Brand Visibility off-site services: the sentence only this play read goes
for path in ('scope', 'bands.small.scope', 'bands.large.scope'):
    edit('O04', path, ' For financial services, use Client-approved claims and trusted financial outlets.', '')
edit('O04', 'assumptions', ' Client-designated financial-services reviewers approve applicable claims.', '')
edit('O07', 'assumptions', " Financial-services contributions require the Client's designated review.", '')
edit('O08', 'assumptions', " Financial-services content follows the Client's designated review.", '')
edit('O09', 'assumptions', ' For financial services, the Client supplies designated reviewers.', '')
for sid in ('O04', 'O07', 'O08', 'O09'):
    drop_fsi(sid)

if any('fsi' in (x.get('neutral') or {}) for x in cat):
    fail('CATALOG: a line still holds neutral.fsi pairs')
if H not in DONE:
    TEXT[H] = read(H).replace(m.group(0), '<script>const CATALOG=' + json.dumps(cat) + ';</script>', 1)

# 2. the Scope step: the play's form and the off-site channels example
swap(H, 'approved outreach to financial publishers.', 'approved outreach to industry publishers.')
swap(H, '<h3>Financial services delivery context</h3>', '<h3>Brand Concierge delivery context</h3>')
swap(H, 'placeholder="e.g. Savings account education and appointment requests, or policy education and quote enquiries."',
     'placeholder="e.g. Product questions and quote requests, or service questions and appointment bookings."')
swap(H, 'placeholder="e.g. Head of digital servicing, who owns', 'placeholder="e.g. Head of digital experience, who owns')
swap(H, 'placeholder="Name the approved product sources, owners for rates / fees / disclosures, and client review contacts."',
     'placeholder="Name the approved product sources, the owner of each source, and client review contacts."')

# 3. the play: its line and its objective; a saved quote on the old objective takes the new one
OLD_OBJ = 'Improve AI discovery of the agreed banking, insurance or financial-services offering, align Brand Concierge answers with Client-approved sources and disclosures, and support a measured handoff to the Client-designated team.'
NEW_OBJ = 'Improve AI discovery of the agreed products and services, align Brand Concierge answers with Client-approved sources, and support a measured handoff to the Client-designated team.'
swap(H, "fsi:{group:'Sales plays',label:'Brand Visibility + Brand Concierge',short:'Financial services and insurance',objective:'" + OLD_OBJ + "'}",
     "fsi:{group:'Sales plays',label:'Brand Visibility + Brand Concierge',short:'Two products, new sales pursuit',objective:'" + NEW_OBJ + "'}")
older = "  if(p==='fsi'&&b.objective==='Improve AI discovery of the agreed banking, insurance or financial-services offering, align Brand Concierge answers with customer-approved sources and disclosures, and support a measured handoff to the customer-designated team.')b.objective=PLAYS.fsi.objective;\n"
swap(H, older, older + "  if(p==='fsi'&&b.objective==='" + OLD_OBJ + "')b.objective=PLAYS.fsi.objective;\n")

# 4. the context flag only this play's pairs used
swap(H, "/* wording that belongs to a context: Brand Visibility in the engagement ('bv') or the FSI play ('fsi'); outside it the line reads neutrally */",
     "/* wording that belongs to a context: Brand Visibility in the engagement ('bv'); outside it the line reads neutrally */")
swap(H, "fsi:p==='fsi',", '')

# 5. the statement of work: the coverage label, one operating model for every play, the items to finish
swap(H, "['fsiProducts','Financial-services products and journeys']", "['fsiProducts','Products and customer journeys']")
swap(H, "'Source-change triggers: a rate, fee, eligibility or disclosure change starts a review before the update goes live.'",
     "'Source-change triggers: a product, price or policy change starts a review before the update goes live.'")
swap(H, "const GEN_MODEL=FSI_MODEL.map(x=>x.startsWith('Source-change triggers')?'Source-change triggers: a product, price or policy change starts a review before the update goes live.':x);\n", '')
swap(H, "(state.play==='fsi'?fsiModel():GEN_MODEL)", "(state.play==='fsi'?fsiModel():FSI_MODEL)")
swap(H, "out.push('Financial services delivery context: name the approved sources and reviewers, and the handoff route and outcome, on the Scope step.');",
     "out.push('Brand Concierge delivery context: name the approved sources and reviewers, and the handoff route and outcome, on the Scope step.');")
swap(H, "out.push('Financial services delivery context: name the Brand Concierge operating owner on the Scope step.');",
     "out.push('Brand Concierge delivery context: name the operating owner on the Scope step.');")

# 6. the Services step: the optional-service button
swap(H, "FSI01:'Financial-services answer review'", "FSI01:'Answer and source review'")

# 7. the reopen code reads the older wording of these lines (PRIOR_FSI): a saved quote's untouched texts take the new wording,
#    edited ones stay as typed.
swap(H, "...(PRIOR_REVIEW[baseId(c)]?.[key]||[]),", "...(PRIOR_REVIEW[baseId(c)]?.[key]||[]),...(PRIOR_FSI[baseId(c)]?.[key]||[]),")
anchor = '/* step 32: the single-block wording of the three longest assumptions, before their paragraph breaks */\n'
swap(H, anchor, '/* Nov 16 2026: the Brand Visibility + Brand Concierge wording before the play read for any industry (unedited earlier wording takes the new wording) */\n'
     'const PRIOR_FSI=' + json.dumps(PRIOR_FSI, ensure_ascii=False) + ';\n' + anchor)
gone(H, 'GEN_MODEL', 'Financial services delivery context', 'Financial-services answer review')

# ---------------------------------------------------------------------------------------------------------------------------
# 8. the Build map: one name per line on every play (the second name, nname, and lineName go)
B = 'canvas/build.py'
swap(B, """        # the name outside the FSI play, as the SOW steps show it there (their neutral 'fsi' name pairs)
        nname = x['name']
        for o, w in (x.get('neutral') or {}).get('fsi', {}).get('name', []):
            nname = nname.replace(o, w)
        if nname != x['name']:
            lines[lid]['nname'] = clean(nname)
""", '')
swap(B, "for k in ('name', 'nname', 'scope', 'ext', 'tier')]", "for k in ('name', 'scope', 'ext', 'tier')]")
T = 'canvas/template.html'
swap(T, "/* outside the FSI play a line reads as on the SOW steps, without its financial-services wording */\n"
        "const lineName=l=>{const L=LN[l],pl=play();return L.nname&&!(pl&&pl.id==='fsi')?L.nname:L.name;};\n", '')
swap(T, "function row(l){const L={...LN[l],name:lineName(l)},on=lineOn(l),off=!on;", "function row(l){const L=LN[l],on=lineOn(l),off=!on;")
gone(T, 'lineName', 'nname')
swap('qa/check_product_copy.py', "for k in ('name', 'nname', 'ext', 'tier')]", "for k in ('name', 'ext', 'tier')]")
swap('product_copy.py', 'connection; name, nname, scope, ext, tier on a service.', 'connection; name, scope, ext, tier on a service.')

# ---------------------------------------------------------------------------------------------------------------------------
# 9. the RFI Builder. industry() narrowed 'banking or insurance' to the RFI's industry; no text it acted on remains.
R = 'rfp_answers.js'
swap(R, "// a line written for banks and insurers alike names the client's own industry where the RFP shows it\n"
        r"""function industry(t){if(!/banking or insurance/.test(t))return t;const all=rfpText(),bank=/\b(?:banks?|banking|credit unions?)\b/i.test(all),ins=/\b(?:insurers?|insurance (?:compan\w+|carriers?|groups?|products?)|underwrit\w+|policyholders?)\b/i.test(all);""" "\n"
        r"""  return bank&&!ins?t.replace(/\bbanking or insurance\b/g,'banking'):ins&&!bank?t.replace(/\bbanking or insurance\b/g,'insurance'):t;}""" "\n", '')
swap(R, "const polish=t=>listify(industry(t)),askQ=", "const askQ=")
swap(R, "add(APPROACH,polish(t),", "add(APPROACH,listify(t),")
swap(R, "add(WORK,polish(doLine(id)),", "add(WORK,listify(doLine(id)),")
swap(R, "said({id,text:polish(doLine(id))})", "said({id,text:listify(doLine(id))})")
# choice C: the step 81 rule that gives an after-launch question a product's first monthly service treats FSI01 like any other
# monthly line; isFSI stays for the regulated-content sentence (controlsFor)
swap(R, "    // (Customer Journey Analytics, Brand Concierge); a financial-services line only when the RFP is from that industry\n",
        "    // (Customer Journey Analytics, Brand Concierge), whatever the client's industry (Nov 17 2026: Brand Concierge's answer and\n"
        "    // source review is no longer kept for a bank's or an insurer's RFP)\n")
swap(R, "===l&&(!/^FSI/.test(l)||isFSI())){s=2;first=true;}", "===l){s=2;first=true;}")
gone(R, 'polish', 'industry(', '/^FSI/')
if 'isFSI()' not in read(R):
    fail('rfp_answers.js: isFSI is no longer used; this script expects controlsFor to keep it')

# 10. the RFI Builder's knowledge base (rfp_method.json is built from these by build_site.py)
KB = {
    'rfp_prototype/kb_method/reviewed/batch_09.json': ('C04', [
        ('Map the agreed banking or insurance discovery questions that', 'Map the agreed discovery questions that'),
        ('how the source is refreshed when products, rates, fees or disclosures change.', 'how the source is refreshed when products or prices change.'),
        ('against approved product facts, rates, fees and disclosures, with your reviewers', 'against approved product facts, with your reviewers'),
        ('"Answer and disclosure test record"', '"Answer test record"'),
        ('"An answer that misstates a rate, fee or disclosure:', '"An answer that misstates a product fact or price:')]),
    'rfp_prototype/kb_method/reviewed/batch_02.json': ('FSI01', [
        ('against your approved financial-product references, flagging possible mismatches on rates, fees, eligibility, policy conditions, disclosures or handoffs.',
         'against your approved product references, flagging possible mismatches on product facts, prices, eligibility or handoffs.'),
        ('answers about your financial products, and keep', 'answers about your products, and keep')]),
    'rfp_prototype/kb_method/reviewed/batch_10.json': ('CW-FSI', [
        ('current rates, fees and disclosures for the financial products in scope.', 'current product facts for the products in scope.'),
        ('"Current financial-product references: rates, fees and disclosures"', '"Current product references for the products in scope"')]),
}
for rel, (sid, pairs) in KB.items():
    for old, new in pairs:
        swap(rel, old, new)
    entry = [e for e in json.loads(read(rel)) if e.get('id') == sid]
    if len(entry) != 1 or not all(new.strip('"') in json.dumps(entry[0], ensure_ascii=False) for _, new in pairs):
        fail(f'{rel}: the new wording did not land in the {sid} entry')

# ---------------------------------------------------------------------------------------------------------------------------
# 11. the checks that pinned the old wording
swap('test_review_nov2.js', "[lineOn('C04'), lineName('C04'), lineName('FSI01')]", "[lineOn('C04'), LN.C04.name, LN.FSI01.name]")
swap('test_rfp_step54.js', "n.asks.some(a => /^Your client's designated financial-services reviewers approve/.test(a.text))",
     "!n.asks.some(a => /financial-services reviewers/.test(a.text))")
swap('test_rfp_step67.js', r"""ok(/for the agreed banking products:\n  - connect and curate/.test(w.body) && !/banking or insurance/.test(w.body) && (w.body.match(/\n  - /g) || []).length === 7, '2.3 names the bank\'s own industry and sets the long setup sentence out as seven steps');""",
     r"""ok(/for the agreed products:\n  - connect and curate/.test(w.body) && !/banking or insurance/.test(w.body) && (w.body.match(/\n  - /g) || []).length === 7, '2.3 sets the long setup sentence out as seven steps, worded for any industry');""")
# test_step86.js: the step 86 record keeps CW-FSI's financial-product references, so its assumptions join the later rewrites
X = 'test_step86.js'
swap(X, "for (const f of ['name', 'nname', 'scope', 'ext', 'tier'])", "for (const f of ['name', 'scope', 'ext', 'tier'])")
swap(X, "\n  const LATER = {\n",
     "\n  // Nov 16 2026: the Brand Visibility + Brand Concierge play reads for any industry, so the Coworker Skills for answer review\n"
     "  // (CW-FSI) assume the Client's current product references, where the record has financial-product references.\n"
     "  const LATER = {\n")
block = re.search(r'\n  const LATER = \{\n.*?\n  \};\n', read(X), re.S)
entry = "'CW-FSI': {assumptions: " + json.dumps(S['CW-FSI']['assumptions'], ensure_ascii=False) + "}"
if X in DONE:
    if not block or entry not in block.group(0):
        fail('test_step86.js holds only part of the change, not the CW-FSI entry of its LATER block')
else:
    if not block or "'CW-FSI'" in block.group(0):
        fail('test_step86.js: no LATER block, or it already holds CW-FSI')
    if '\n    play_services: {' in block.group(0):
        new_block = block.group(0).replace('\n    play_services: {', '\n    play_services: {' + entry + ', ', 1)
    else:
        new_block = block.group(0)[:-len('  };\n')] + '    play_services: {' + entry + '},\n  };\n'
    swap(X, block.group(0), new_block)
counts = re.findall(r'later\.length === (\d+)', read(X))
if len(counts) != 1:
    fail('test_step86.js: expected one later.length check')
if X not in DONE:   # one more later rewrite to count (a file that holds the change counts it already)
    swap(X, f'later.length === {counts[0]}', f'later.length === {int(counts[0]) + 1}')
swap(X, ", and the Workfront + Coworker how text that took", ", the Workfront + Coworker how text that took")
swap(X, "(filed in the record as nov17_followup), which read as those rewrites do'",
     "(filed in the record as nov17_followup), and the assumptions of the Coworker Skills for answer review, worded for any industry on Nov 16, which read as those rewrites do'")

# choice C: a retailer's RFI now gets the answer and source review where the step 81 rule offers Brand Concierge's first monthly
# service, and a bank's still does (before the CJA RFI is loaded again for the download checks)
RELOAD = "  await h.text(doc('We have chosen Adobe Experience Manager Sites and Customer Journey Analytics, and neither is set up yet.'), 'cja_rfp.txt');\n\n  // 4. Round 6 keeps two plain menu entries for a text RFI.\n"
swap('test_rfp_step81.js', RELOAD, r"""
  // 3c. Nov 17 2026, with the play's industry-neutral wording: the answer and source review, Brand Concierge's first monthly
  //     service, is offered in any client's RFI. Before, only a bank's or an insurer's RFI got it, and a retailer's after-launch
  //     question about Brand Concierge got the one-time setup. The bank is still read as a bank: its response keeps the sentence
  //     on regulated content.
  const bcRfi = (org, about) => ['Request for Proposal: AI discovery and on-site answers for ' + org, about,
    'We have chosen Adobe Brand Visibility and Adobe Brand Concierge, and neither is set up yet.',
    '1.1 Describe how you would set up Brand Concierge on our website.',
    '1.2 Describe the monthly services you would provide for Brand Concierge after launch.',
    '1.3 Describe the monthly services you would provide after launch.'].join('\n\n');
  for (const [who, org, about] of [['a retailer', 'Northwind Outfitters', 'Northwind Outfitters is a specialty retailer of outdoor clothing and gear, with 120 stores and an online store.'],
    ['a bank', 'Northbridge Bank', 'Northbridge Bank is a regional bank with 80 branches, offering checking, savings and mortgages.']]) {
    const all = await h.text(bcRfi(org, about), org.split(' ')[0].toLowerCase() + '_rfp.txt'), got = await drafts();
    await h.select(all.questions.findIndex(q => q.label === '1.2'));
    const panel = await h.panel(), regulated = all.questions.some(q => q.draft && /regulated content/.test(q.draft.plain));
    ok(got['1.1'].lines.join() === 'F02' && got['1.2'].lines.join() === 'FSI01' && got['1.3'].lines.includes('FSI01') && cat.FSI01.unit === 'monthly' && panel.includes('Answer and source review') && regulated === (who === 'a bank'),
      `${who}'s RFI: the monthly services for Brand Concierge after launch are its answer and source review, also where the question names no product`, JSON.stringify([got['1.1'].lines, got['1.2'].lines, got['1.3'].lines, regulated]));
  }
""" + RELOAD)

# 12. the play's own screens stay worded for any industry (review, Nov 17 2026): a check opens the play with every optional and
#     library service added and reads its Build card, Scope, Services, statement of work and Services CSV
START_OVER = "\n  // 4. Start over clears everything and goes to the front page\n"
swap('test_site.js', START_OVER, r"""
  // 3d. Nov 17 2026: the Brand Visibility + Brand Concierge play reads for any industry. With every optional and library service
  //     added and every text open, its connection card on Build, the Scope step (text and examples), the Services step, the
  //     statement of work and the Services CSV carry no banking, insurance or other finance wording.
  { const q = await fresh(), FIN = /financ|banking|insur|rates?(?:, | \/ )fees?/i, seen = {};
    await q.goto(BASE); await q.waitForTimeout(300); await q.click('#picker [data-play="fsi"]'); await q.waitForTimeout(500);
    await q.click('.ib[data-c="bv-bc"]'); await q.waitForTimeout(300); seen.build = await q.textContent('#card'); await q.click('#card [data-close]'); await q.waitForTimeout(150);
    await q.click('#save'); await q.waitForURL('**/sow/index.html#scope'); await q.waitForTimeout(400);
    seen.scope = await q.$eval('#scope-panel', e => e.innerText + '\n' + [...e.querySelectorAll('[placeholder]')].map(x => x.placeholder).join('\n'));
    await q.click('[data-step="services"]'); await q.waitForTimeout(300);
    for (const id of await q.$$eval('#service-extensions [data-add]', e => e.map(x => x.dataset.add))) { await q.click(`#service-extensions [data-add="${id}"]`); await q.waitForTimeout(200); }
    await q.click('#add-service'); await q.waitForTimeout(150);
    const lib = await q.$$eval('#available-services [data-add]', e => e.map(x => x.dataset.add)); await q.click('#close-modal'); await q.waitForTimeout(150);
    for (const id of lib) { await q.click('#add-service'); await q.waitForTimeout(150); await q.click(`#available-services [data-add="${id}"]`); await q.waitForTimeout(150); await q.click('#close-modal'); await q.waitForTimeout(150); }
    const on = await toolLines(q);
    seen.services = await q.$eval('#service-lines', e => { e.querySelectorAll('details').forEach(x => { x.open = true; }); return e.innerText + '\n' + [...e.querySelectorAll('textarea, input')].map(x => x.value).join('\n'); });
    await q.click('[data-step="document"]'); await q.waitForTimeout(400);
    seen.sow = await q.$eval('#sow-preview', e => e.innerText) + '\n' + await q.textContent('#readiness');
    const [d] = await Promise.all([q.waitForEvent('download'), q.click('#export-csv')]); seen.csv = fs.readFileSync(await d.path(), 'utf8');
    const found = Object.entries(seen).filter(([, t]) => FIN.test(t)).map(([k, t]) => k + ': ' + t.slice(Math.max(0, t.search(FIN) - 60), t.search(FIN) + 40).replace(/\s+/g, ' '));
    ok(['C04', 'FSI01', 'CW-FSI', 'O04', 'O07', 'O08', 'O09'].every(id => on.includes(id)) && !found.length,
      `the Brand Visibility + Brand Concierge play reads for any industry: with all ${on.length} services added, its Build card, Scope, Services, statement of work and Services CSV carry no banking, insurance or finance wording`, found.join(' | ') || on.join(','));
    await q.context().close(); }
""" + START_OVER)

# ---------------------------------------------------------------------------------------------------------------------------
# write the files that do not hold the change yet, each whole through a temporary file, and index.html last: PRIOR_FSI is in
# the checkout only once every other file is. A run that is cut off leaves each file whole, old or new; a second run finishes.
for rel in TEXT:
    if rel not in MARK:
        fail(f'{rel} has no mark of the change in MARK')
    if rel not in DONE and MARK[rel] not in TEXT[rel]:
        fail(f'{rel}: the edits did not write its mark {MARK[rel]!r}')
todo = sorted((rel for rel in TEXT if rel not in DONE), key=lambda rel: (rel == H, rel))
if not todo:
    print('apply_neutral: already applied, every file holds the change; nothing edited')
    sys.exit(10)
for rel in todo:
    path = os.path.join(ROOT, rel)
    with open(path + '.apply_neutral.tmp', 'w', encoding='utf-8', newline='') as f:
        f.write(TEXT[rel])
    shutil.copymode(path, path + '.apply_neutral.tmp')
    os.replace(path + '.apply_neutral.tmp', path)
if DONE:
    print('apply_neutral: an earlier run already changed', len(DONE), 'files:', ', '.join(sorted(DONE)))
print('apply_neutral: edited', len(todo), 'files:', ', '.join(sorted(todo)))
PY
code=$?
set -e
[ "$code" -eq 0 ] || [ "$code" -eq 10 ] || exit 1
if [ "$BUILD" -eq 1 ]; then
  cd "$REPO"
  python3 canvas/build.py
  python3 build_site.py
fi
