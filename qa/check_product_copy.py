"""No customer-facing release labels, forecasts or product-release dates; Client dates are kept.

Reads the data the two pages ship: the SOW tool's 44 templates (with their size bands and the name and
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
assert len(templates) == 44 and len(concepts) == 159 and len(canvas['connections']) == 75, (len(templates), len(concepts), len(canvas['connections']))

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
# Nov 8 (Adam: "number three"): the SOW keeps the condition, the partner's canvas card keeps Adobe's label
CLIENT = re.compile(r"not currently (?:offered|available)|not offered to health care|sensitive-data organizations|health care, finance|health care and finance|maintenance mode|co-innovation|limited number of customers|current scope|Legacy offer route|as Legacy", re.I)
sow_lines = [(x['id'], x.get('sowAvailability') or x.get('availability') or '') for x in canvas['connections']]
sow_lines += [(x['id'], p) for x in canvas['connections'] for p in (x.get('sowPrereqs') or x.get('prereqs') or [])]
# step 53 (Nov 10): the client-voice how and gain the RFP Builder drafts from carry no lifecycle label either
sow_lines += [(x['id'] + '.' + k, x.get(k) or '') for x in canvas['connections'] for k in ('sowHow', 'sowGain')]
sow_lines += [(k, v.get('assumptions', '')) for k, v in concepts.items()]
labelled = [(i, t) for i, t in sow_lines if CLIENT.search(t)]
assert not labelled, f'the SOW still carries a lifecycle label: {labelled[:3]}'
partner = sum(1 for x in canvas['connections'] for p in x.get('prereqs', []) if 'health care' in p)
assert partner >= 10, f'the partner cards lost the Coworker eligibility note ({partner} left)'
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
    partner_text += [(lid + '.' + k, l.get(k) or '') for k in ('name', 'nname', 'ext', 'tier')]
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
CLIENTVOICE = re.compile(r"\bthe Client\b|\bClient's|\byour client\b|\bpartner\b|partner-|confirm(?:ed|s|ing)?(?: [a-z']+){0,4} with Adobe|\bconfirm it\b|prove it|—|–", re.I)
client_text = [(x['id'] + '.' + k, x.get(k) or '') for x in canvas['connections'] for k in ('sowHow', 'sowGain')]
leaked_client = [(w, t[:100]) for w, t in client_text if CLIENTVOICE.search(t)]
assert not leaked_client, f'partner wording in a client-voice how or gain: {leaked_client[:3]}'
client_cards = sum(1 for x in canvas['connections'] if x.get('sowHow'))
assert not leaked, f'SOW voice on a partner surface: {leaked[:3]}'
print(f'PASS: {len(templates)} templates, {len(concepts)} service definitions, {len(canvas["connections"])} connections, '
      f'{len(canvas["lines"])} canvas lines and {len(problems["problems"])} problems carry no release label, forecast or release date; '
      'Client dates and quantities survive the draft scrub. The SOW carries no lifecycle label; the partner cards keep the Coworker eligibility note and never speak in the Client\'s voice; '
      f'{client_cards} connections carry a client-voice how and gain for the RFP Builder with no label or partner word.')
