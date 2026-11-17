"""No customer-facing release labels, forecasts or product-release dates; Client dates are kept.

Reads the data the two pages ship: the SOW tool's 48 templates (with their size bands and the name and
assumption pairs applied outside a play), the 159 research service definitions, the canvas catalog and the
problem picker. The rendered pages and downloads are checked separately by check_rendered_copy.js.
"""
import json
from pathlib import Path
import re
import sys

SOW = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SOW))
from product_copy import scrub

# release-status labels, forecasts and talk about release labels
LABELS = re.compile(r"\bbeta\b|early access|early adopter|limited availability|limited release|coming soon|not yet available|not available yet"
                    r"|\bdon't yet\b|\bdo not yet\b|\bnot yet support|\b(?:is|are|was|were) planned\b|planned for a future|future release"
                    r"|differ on its rollout|staged beta rollout|rolling out in|has rolled out|until adobe marks|once adobe documents|release label|\bno label\b|carries no (?:published )?(?:availability )?(?:status|label)"
                    r"|status is not stated|not generally available|technical preview|public preview|private preview|\bpre-?release\b", re.I)
# a month and year, a dated day, a quarter or a dated version number: product copy never needs one (Client dates are typed by the partner)
DATES = re.compile(r"(?:January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+\d{1,2},?)?\s+20\d\d"
                   r"|\bQ[1-4]\s+20\d\d\b|\b20\d\d\.\d{1,2}(?:\.\d+)?\b|\b(?:from|since|on|as of|until|before|after)\s+20\d\d\b", re.I)
SKIP = ('evidence', 'checked', 'note', 'keywords', 'requires')   # provenance, matching words and file notes: never shown

found = []


def check(value, path=''):
    if isinstance(value, dict):
        for k, v in value.items():
            if k in SKIP:
                continue
            if k == 'neutral':   # [old, new] pairs: the new text is shown, the old text only has to match
                for play, fields in v.items():
                    for field, pairs in fields.items():
                        for i, pair in enumerate(pairs):
                            check(pair[1], f'{path}.neutral.{play}.{field}[{i}].new')
                continue
            check(v, path + '.' + k)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            check(v, path + f'[{i}]')
    elif isinstance(value, str) and not value.startswith(('https://', 'http://')):
        for rx, kind in ((LABELS, 'label'), (DATES, 'date')):
            m = rx.search(value)
            if m:
                found.append((kind, path, m.group(0), value[max(0, m.start() - 70):m.end() + 70]))


html = (SOW / 'index.html').read_text()
templates = json.loads(re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1))
canvas = json.loads((SOW / 'canvas/catalog.json').read_text())
concepts = json.loads(re.search(r'const REVIEW_CONCEPTS=(.*?);</script>', html, re.S).group(1).replace('<\\/', '</'))
problems = json.loads((SOW / 'canvas/problems.json').read_text())
check(templates, 'templates')
check(concepts, 'concepts')
check(canvas, 'canvas')
check(problems['problems'], 'problem picker')
for kind, path, word, context in found:
    print(f'❌ {kind}: {path} <{word}> ...{context}...')
assert not found, f'{len(found)} release label(s) or date(s) in shipped product copy'
# step 61 (Nov 10 2026): AEM Forms adds 33 researched services and six connections; XB09 and XB13 retire with their two connections
# step 62 (Nov 10 2026): the six products researched on Oct 30 add 72 services and 19 connections
# step 64 (Nov 10 2026): wave 2, GenStudio and creative, adds 101 services and 26 connections; step 65 adds one service (FP10); step 66, wave 3, adds 74 services and 20 connections
# step 85 (Nov 12 2026): Adobe Commerce gets seven services of its own (CE01 to CE07) and Adobe Commerce + CRM (commerce-crm) with one (XR01):
# step 91 (Nov 13 2026): six services for the catalog gaps the holdout RFI found (SI07 to SI10, AS07, MK07):
# 489 research services, 151 connections, 531 canvas services
# Coworker review: CW08 (Coworker set up in an AI platform) adds a template and a canvas service; XB16 (Workfront Fusion scenarios
# with Coworker) adds a service definition and a canvas service
# Nov 17 2026 (Adam: "yes for both"): Brand Intelligence + Creative Cloud and Brand Intelligence + Coworker add two connections and
# no service
# Nov 17 2026 (Adam: "yes!"): 26 Coworker services. Three are Coworker's own (CW09 to CW11), templates and canvas services; 23 sit
# on Coworker's connections as service definitions and canvas services, one of them (XL27) on the new Coworker + Adobe Analytics
# connection (cw-aa)
# Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models: four connections, and six
# service definitions and canvas services (XF01 to XF06)
assert len(templates) == 48 and len(concepts) == 523 and len(canvas['connections']) == 162 and len(canvas['lines']) == 569, (len(templates), len(concepts), len(canvas['connections']), len(canvas['lines']))
NOV17 = ['CW09', 'CW10', 'CW11', 'XA28', 'XA29', 'XA30', 'XA31', 'XL27', 'XA32', 'XA33', 'XA34', 'XA35', 'XA36', 'XA37', 'XA38', 'XA39', 'XA40',
         'AXD13', 'AXD14', 'AXD15', 'AXD16', 'XB17', 'XB18', 'XB19', 'XQ09', 'XQ10']
assert all(i in canvas['lines'] for i in NOV17) and all((i in concepts) == (not i.startswith('CW')) for i in NOV17), 'a Nov 17 Coworker service is missing'
assert any(x['id'] == 'cw-aa' and x['more'] == ['XL27'] for x in canvas['connections']), 'Coworker + Adobe Analytics is missing, or its service no longer starts off'
assert all(i in concepts and i in canvas['lines'] for i in ('CE01', 'CE02', 'CE03', 'CE04', 'CE05', 'CE06', 'CE07', 'XR01')), 'a step 85 Commerce service is missing'
assert any(x['id'] == 'commerce-crm' for x in canvas['connections']), 'Adobe Commerce + CRM is missing'

# step 58 (Nov 10 2026, Adam: "trial for brand visibility is over now", and Brand Visibility is not pitched with Adobe Analytics):
# nothing shipped says trial, free trial or paid offer about Brand Visibility, and no sentence names Adobe Analytics as a way to
# feed Brand Visibility. Sites Optimizer's and Coworker's own trial wording stays (different products), as do Adobe's page titles.
TRIAL = re.compile(r"\btrials?\b|\bpaid (?:Brand Visibility )?offer(?:ing)?\b|\bpaid Brand Visibility\b", re.I)
# Nov 17 2026: Coworker trial value sprint (CW11) is Coworker's own trial, Adobe's usage-bound CX Enterprise Coworker Trial, in the
# words of its verified text; no Brand Visibility trial comes with it
TRIAL_OK = re.compile(r"Sites Optimizer trial|Trial sites authored in Google Drive or SharePoint need the ASO-EDS-Autofix-Users IMS group"
                      r"|Adobe's trial page says headless delivery is not supported"
                      r"|Coworker trial|trial's AI credits|Adobe decides trial eligibility|the trial is not open to customers|The trial gives a one-time allotment"
                      r"|for the whole trial|what Adobe enables for the trial", re.I)
AA_FEED = re.compile(r"Brand Visibility|Business Impact|LLM Optimizer")


def strings(value, path=''):
    if isinstance(value, dict):
        for k, v in value.items():
            if k in SKIP:
                continue
            if k == 'neutral':
                for play, fields in v.items():
                    for field, pairs in fields.items():
                        for i, pair in enumerate(pairs):
                            yield f'{path}.neutral.{play}.{field}[{i}].new', pair[1]
                continue
            yield from strings(v, path + '.' + k)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            yield from strings(v, path + f'[{i}]')
    elif isinstance(value, str) and not value.startswith(('https://', 'http://')):
        yield path, value


bv_copy = []
for name, data in (('templates', templates), ('concepts', concepts), ('canvas', canvas), ('problem picker', problems['problems'])):
    for path, text in strings(data, name):
        for m in TRIAL.finditer(text):
            around = text[max(0, m.start() - 90):m.end() + 90]
            if not TRIAL_OK.search(around):
                bv_copy.append(('trial', path, around))
        for sentence in re.split(r'(?<=[.;])\s+', text):
            if 'Adobe Analytics' in sentence and AA_FEED.search(sentence):
                bv_copy.append(('Adobe Analytics as a Brand Visibility feed', path, sentence[:200]))
for kind, path, context in bv_copy:
    print(f'❌ {kind}: {path} ...{context}...')
assert not bv_copy, f'{len(bv_copy)} Brand Visibility trial or Adobe Analytics feed sentence(s) in shipped product copy'
# a saved draft that holds an old sentence takes the new one when it opens (the page runs the same scrub)
for old, now in (("The paid Brand Visibility offering, not the free trial (CJA's page requires it for the source)", "A Brand Visibility license (CJA's page requires it for the source)"),
                 ("Availability: GA4 is included in the paid Brand Visibility offer and is not available on the free trial.", "Availability: GA4 is included with the Brand Visibility license."),
                 ("the Client is on the paid Brand Visibility offer (trial workspaces cannot connect), the CJA integration", "the Client holds a Brand Visibility license, the CJA integration"),
                 ("a CJA connection and data view; Adobe Analytics can feed only Brand Visibility's referral reporting on the Business Impact tab), the Client", "a CJA connection and data view), the Client"),
                 ("inside them. The paid offer is assumed. The Client confirms its licensed deployment allowance and enablement", "inside them. The Client confirms its licensed deployment allowance and enablement"),
                 ("Connect Search Console, and GA4 where the Client has neither CJA nor Adobe Analytics, to each", "Connect Search Console, and GA4 where the Client does not have CJA, to each"),
                 ("connections are managed per onboarded URL. Assumes the Client has paid Brand Visibility.", "connections are managed per onboarded URL."),
                 ("per onboarded URL. Assumes your client has a Brand Visibility license.", "per onboarded URL.")):
    assert scrub(old) == now, (old, scrub(old))

# the runtime scrub for saved drafts: cleans old product wording, keeps the Client's own dates and numbers
keep = 'Client kickoff: November 7, 2026. Deliver 12 pages in two weeks.'
assert scrub(keep) == keep
cleaned = scrub('Configure the beta connector. The feature is expected to be released in June 2027. Keep 12 fields.')
assert not LABELS.search(cleaned) and 'June 2027' not in cleaned and '12 fields' in cleaned, cleaned
assert '12 fields' in scrub('Configure the beta connector. Keep 12 fields.')
site = 'The Client site is scheduled to be launched in June 2027.'
assert scrub(site) == site
for old in ('Catalog discovery and comparison are generally available; cart and checkout actions are planned.',
            'so follow-up programs can start from it; topics and summaries are planned for a future release.',
            "Auto-Target and Automated Personalization don't yet support CJA as the reporting source.",
            "Confirm Coworker is enabled for the subscription (Adobe's pages differ on its rollout) and the Gen-AI terms are accepted",
            "Adobe's pages give no release label for these connections. GA4 is included in the paid Brand Visibility offer"):
    assert not LABELS.search(scrub(old)), (old, scrub(old))
# Nov 8 (Adam: "number three"): the SOW carries no lifecycle label. Since step 86 (Nov 12) the partner's canvas card carries none either.
CLIENT = re.compile(r"not currently (?:offered|available)|not offered to health care|sensitive-data organizations|health care, finance|health care and finance|maintenance mode|co-innovation|limited number of customers|current scope|Legacy offer route|as Legacy", re.I)
sow_lines = [(x['id'], x.get('sowAvailability') or x.get('availability') or '') for x in canvas['connections']]
sow_lines += [(x['id'], p) for x in canvas['connections'] for p in (x.get('sowPrereqs') or x.get('prereqs') or [])]
# step 53 (Nov 10): the client-voice how and gain the RFP Builder drafts from carry no lifecycle label either
sow_lines += [(x['id'] + '.' + k, x.get(k) or '') for x in canvas['connections'] for k in ('sowHow', 'sowGain')]
sow_lines += [(k, v.get('assumptions', '')) for k, v in concepts.items()]
labelled = [(i, t) for i, t in sow_lines if CLIENT.search(t)]
assert not labelled, f'the SOW still carries a lifecycle label: {labelled[:3]}'
# step 86 (Nov 12 2026, Adam: "don't provide any caveats"): the partner cards carry no Coworker eligibility note and no lifecycle label
# either, and every Coworker connection keeps the license or technical prerequisite that stood beside the note.
# Nov 17 (Adam: "2, yes"): one exception. The Workfront + Coworker card's how text ends with Adobe's own two sentences from its
# Workfront help, word for word and in quotation marks, with no "confirm with Adobe" beside them. The how text is the partner half of
# the how and sowHow pair, so the note never reaches what the Client reads (checked above: sowHow, sowGain, the SOW's availability and
# prerequisites, and the service definitions).
ADOBE_NOTE = ('Adobe\'s Workfront help says: "CX Enterprise Coworker is not currently available to organizations in health care, finance, '
              'or some other industries with sensitive data. AI Assistant is available to these organizations."')
ELIGIBILITY = re.compile(CLIENT.pattern + r"|confirm eligibility|regulated industries|industries with sensitive data|outside health care|Try Before You Buy|through the Adobe account team", re.I)
card_lines = [(x['id'] + '.' + k, x.get(k) or '') for x in canvas['connections'] for k in ('label', 'availability', 'how', 'tier', 'covered', 'sowAvailability', 'sowNote')]
card_lines += [(x['id'] + '.' + k, p) for x in canvas['connections'] for k in ('prereqs', 'sowPrereqs') for p in (x.get(k) or [])]
noted = [(i, t) for i, t in card_lines if ADOBE_NOTE in t]
assert [i for i, t in noted] == ['workfront-cw.how'] and noted[0][1].endswith(' ' + ADOBE_NOTE) and noted[0][1].count(ADOBE_NOTE) == 1, \
    f"Adobe's industry note belongs once, word for word, at the end of the Workfront + Coworker card's how text, and nowhere else on a card: {[i for i, t in noted]}"
partner = [(i, t) for i, t in card_lines if ELIGIBILITY.search(t.replace(ADOBE_NOTE, '') if i == 'workfront-cw.how' else t)]
assert not partner, f'a connection card still carries the Coworker eligibility note or a lifecycle label: {partner[:3]}'
# and no other shipped text holds Adobe's sentence: no service, template, problem or other connection field
ADOBE_WORDS = re.compile(r'not currently (?:offered|available) to (?:organizations in )?health care', re.I)
copies = [(path, text[:90]) for name, data in (('templates', templates), ('concepts', concepts), ('canvas', canvas), ('problem picker', problems['problems']))
          for path, text in strings(data, name) if ADOBE_WORDS.search(text)]
assert len(copies) == 1 and copies[0][1] == noted[0][1][:90], f"Adobe's industry note is shipped somewhere other than the Workfront + Coworker card: {copies}"
KEPT = {'cw-cja': ['Coworker Chat license', 'CJA B2C edition'],
        'cw-eds': ['Coworker Chat license', 'AEM as a Cloud Service with Edge Delivery Services (not AEM 6.5 on-premises)', 'AEM agent access through the Agentic SKU'],
        'cw-bc': ['Coworker Chat license', 'Brand Concierge conversation datasets in Experience Platform, with Query Service access'],
        'aemforms-cw': ["CX Enterprise Coworker license, configured by Adobe's onboarding team"],
        'aemsites-cw': ["CX Enterprise Coworker license, configured by Adobe's onboarding team", 'AEM agent access through the Agentic SKU'],
        'aemassets-cw': ['AEM Assets as a Cloud Service, plus AEM agent access (the Agentic SKU)'],
        'cw-rtcdp': ['CX Enterprise Coworker license', 'Real-Time CDP B2C Edition'],
        'cw-ajo': ['CX Enterprise Coworker license', 'Journey Optimizer B2C Edition'],
        'cw-target': ['CX Enterprise Coworker license', 'Adobe Target; Target Premium if Recommendations work is in scope'],
        'marketo-cw': ['Core Gen-AI terms and the supplemental terms accepted', 'If Coworker Chat across applications is in scope: a license for it'],
        'workfront-cw': ['Workfront Standard license (any Workfront package)',
                         "CX Enterprise Coworker license for your client's organization; Adobe's support or professional services team configures Coworker, its Adobe app integrations and its governance and approval workflows"],
        'cw-gspm': ["CX Enterprise Coworker for your client's organization, with the GenStudio connection made available by the organization"],
        'ca-cw': ['Coworker Chat licensed for your client', 'The standard (B2C) edition of Customer Journey Analytics'],
        'planning-cw': ['Coworker enabled for the organization by the main Workfront administrator'],
        'moptimizer-cw': ['The conversational experience permission for each user who works in Coworker, plus the Manage or View permission of every feature a skill touches'],
        # Nov 17: a connection with no services of its own, so nothing prints its prerequisites in a statement of work
        'cw-brandintel': ['Coworker Chat license', 'Adobe Brand Intelligence licensed and onboarded, with the Validate add-on'],
        # Nov 17 (Adam: "yes!"): Coworker + Adobe Analytics, with its licenses, Adobe's aa-mcp integration and the MCP permission items
        'cw-aa': ['Coworker Chat license', 'Adobe Analytics license',
                  "The aa-mcp integration in Coworker's list of connected servers (Customizations, Integrations tab); if it is not listed, add it with Add server",
                  'MCP Read-only Access, or MCP Full Access to also create segments, calculated metrics or projects, in an Adobe Analytics product profile for each user; product administrators get full MCP access automatically']}
cards = {x['id']: x for x in canvas['connections']}
assert sorted(KEPT) == sorted(x['id'] for x in canvas['connections'] if 'cw' in (x['a'], x['b'])), 'the Coworker connections changed'
lost = [(i, p) for i, ps in KEPT.items() for p in ps if p not in cards[i].get('prereqs', [])]
assert not lost, f'a Coworker card lost a license or technical prerequisite: {lost[:3]}'
# the statement of work prints its own list where a connection has one: it must hold one line for each line of the card, licenses included
short = [i for i in KEPT if cards[i].get('sowPrereqs') and len(cards[i]['sowPrereqs']) != len(cards[i]['prereqs'])]
assert not short, f'a Coworker connection prints fewer prerequisites in the statement of work than on its card: {short}'
unlicensed = [i for i in KEPT if cards[i].get('sowPrereqs') and i != 'planning-cw' and not any(re.search(r'licens|terms accepted|permission', p, re.I) for p in cards[i]['sowPrereqs'])]
assert not unlicensed, f'a Coworker connection lost its license line in the statement of work: {unlicensed}'
# Nov 8 (Adam: audit the voice): the partner's surfaces speak to the partner ("you", "your client"); "the Client" belongs to the SOW
SOWVOICE = re.compile(r"\bthe Client\b(?! ID)|\bClient's|\bThe Client\b")
partner_text = []
for x in canvas['connections']:
    partner_text += [(x['id'] + '.' + k, x.get(k) or '') for k in ('label', 'availability', 'how', 'tier', 'covered')]
    partner_text += [(x['id'] + f'.prereqs[{i}]', p) for i, p in enumerate(x.get('prereqs', []))]
    partner_text += [(x['id'] + '.gain.' + k, (x.get('gain') or {}).get(k, '')) for k in ('title', 'text')]
    partner_text += [(x['id'] + f'.flows[{i}]', f['what']) for i, f in enumerate(x.get('flows', []))]
for p in canvas['products']:
    partner_text += [(p['id'] + '.' + k, p.get(k) or '') for k in ('title', 'systems', 'rec')]
for lid, l in canvas['lines'].items():
    partner_text += [(lid + '.' + k, l.get(k) or '') for k in ('name', 'ext', 'tier')]
for t in templates:
    partner_text.append((t['id'] + '.basis', t['basis']))
    partner_text += [(t['id'] + f'.bands.{b}.qty', t['bands'][b].get('qty', '')) for b in ('small', 'typical', 'large')]
for i, q in enumerate(problems['problems']):
    partner_text.append((f'problems[{i}]', json.dumps({k: v for k, v in q.items() if k not in ('keywords', 'requires')}, ensure_ascii=False)))
leaked = [(w, t[:100]) for w, t in partner_text if SOWVOICE.search(t)]
PARTNERVOICE = re.compile(r"\byour client\b|\byour company\b", re.I)
sow_text = [(t['id'] + '.' + k, t.get(k, '')) for t in templates for k in ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions')]
sow_text += [(t['id'] + f'.bands.{b}.{k}', t['bands'][b].get(k, '')) for t in templates for b in ('small', 'typical', 'large') for k in ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions')]
leaked_sow = [(w, t[:100]) for w, t in sow_text if PARTNERVOICE.search(t)]
assert not leaked_sow, f'partner voice in a template\'s SOW text: {leaked_sow[:3]}'
# step 53: the client-voice how and gain speak as we and you, with no partner or Client word and no caution aimed at the partner
# "we confirm the route with Adobe before this work starts" is a statement the client may read; "confirm with Adobe" as an instruction is not, and "ask Adobe" never is
CLIENTVOICE = re.compile(r"\bthe Client\b|\bClient's|\byour client\b|\bpartner\b|partner-|(?<!\bwe )(?<!\bWe )(?<!\bis )(?<!\bare )(?<!\bbe )(?<!\bbeen )(?<!\bwas )(?<!\bwere )\bconfirm(?:s|ed|ing)?\b(?: [a-z']+){0,9} with Adobe|\b[Aa]sks? Adobe\b(?!['’]s| data\b| (?:Analytics|Commerce|Express)\b)|\bconfirm it\b|(?:^|[.;:!?] )Confirm\b|prove it|—|–")
client_text = [(x['id'] + '.' + k, x.get(k) or '') for x in canvas['connections'] for k in ('sowHow', 'sowGain')]
leaked_client = [(w, t[:100]) for w, t in client_text if CLIENTVOICE.search(t)]
assert not leaked_client, f'partner wording in a client-voice how or gain: {leaked_client[:3]}'
client_cards = sum(1 for x in canvas['connections'] if x.get('sowHow'))
assert not leaked, f'SOW voice on a partner surface: {leaked[:3]}'
print(f'PASS: {len(templates)} templates, {len(concepts)} service definitions, {len(canvas["connections"])} connections, '
      f'{len(canvas["lines"])} canvas lines and {len(problems["problems"])} problems carry no release label, forecast or release date; '
      'Client dates and quantities survive the draft scrub. Nothing says a Brand Visibility trial or names Adobe Analytics as a Brand Visibility feed. The SOW carries no lifecycle label; the partner cards carry no Coworker eligibility note or lifecycle label (but Adobe\'s own words on the Workfront + Coworker card, Nov 17), keep their Coworker license and technical prerequisites, and never speak in the Client\'s voice; '
      f'{client_cards} connections carry a client-voice how and gain for the RFP Builder with no label or partner word.')
