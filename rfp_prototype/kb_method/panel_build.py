"""The method knowledge base, measured (Nov 13 2026, Adam's key metric): builds a blind panel file per RFI with three answers to
each Adobe requirement, shuffled: the AI writer's (from the live run), the method knowledge base's and today's catalog answer
(both from eval_answers.js). The key, which answer is which, is written beside it for unblinding after the judges score.

python3 sow/rfp_prototype/kb_method/panel_build.py <rfp source .html or .txt> <ai answers .json> <no-AI answers .json> <out dir> <tag> [<earlier no-AI answers .json>] [--include-missing] [--requirement-key <JSON>]

Round 2 (Nov 13): with an earlier round's no-AI answers as the sixth argument, each requirement shows four answers, A to D (the AI's,
this round's knowledge base, the earlier round's and today's catalog answer), in eight rotating orders, so the same judge scores the
earlier round against this one; a requirement is shown only where every answer exists. Round 3 (Nov 13): where the earlier round had
no knowledge-base answer, its answer is what the tool gave with no AI then, the catalog's, so a requirement only the new round
answers (a migration off another CMS) is scored too.

Round 4: --include-missing retains every numbered requirement with a real AI-written answer, including requirements that the
no-AI path failed to sort or draft. Each no-AI arm uses its recorded method answer, else its recorded catalog answer, else an
explicit missing-answer marker. The default remains the earlier complete-case panel. Scores on the original panel refs and on
the expanded refs must be reported separately; an expanded panel is not a like-for-like comparison to the old overall score.
Where an independent authored requirement key exists, --requirement-key restricts either panel mode to its Adobe implementation
requirements; security and supplier questions stay outside the primary implementation-quality comparison.
"""
import argparse, json, os, re, html as H

parser = argparse.ArgumentParser(description=__doc__)
for name in ('src', 'ai_path', 'kb_path', 'out', 'tag'):
    parser.add_argument(name)
parser.add_argument('prior_path', nargs='?')
parser.add_argument('--include-missing', action='store_true')
parser.add_argument('--requirement-key', help='Authored requirement key; retain only requirements marked adobe')
args = parser.parse_args()
src, ai_path, kb_path, out, tag, prior_path = args.src, args.ai_path, args.kb_path, args.out, args.tag, args.prior_path
include_missing = args.include_missing
adobe_refs = None
if args.requirement_key:
    if re.search(r'test_rfi_3(?:_key)?\.', args.requirement_key):
        parser.error('The held-out RFI key must not be opened')
    requirements = json.load(open(args.requirement_key, encoding='utf-8'))
    if not isinstance(requirements, list) or not requirements:
        parser.error('--requirement-key must contain a nonempty list of ref/kind requirements')
    refs_seen = set()
    for requirement in requirements:
        if not isinstance(requirement, dict) or not isinstance(requirement.get('ref'), str) or not requirement['ref'].strip() or requirement.get('kind') not in ('adobe', 'firm', 'security'):
            parser.error('--requirement-key has an invalid ref/kind requirement')
        if requirement['ref'] in refs_seen:
            parser.error('--requirement-key has a duplicate reference: ' + requirement['ref'])
        refs_seen.add(requirement['ref'])
    adobe_refs = {requirement['ref'] for requirement in requirements if requirement['kind'] == 'adobe'}
raw = open(src, encoding='utf-8').read()
rfp = H.unescape(re.sub(r'<[^>]+>', ' ', raw.split('<body>')[1] if '<body>' in raw else raw))
rfp = re.sub(r'\n\s*\n+', '\n', re.sub(r'[ \t]+', ' ', rfp)).strip()
ai = {a['ref']: a for a in json.load(open(ai_path))['answers'] if a.get('model') == 'claude-opus-5-5'}
kb = {r['ref']: r for r in json.load(open(kb_path)) if include_missing or r.get('kb')}
prior = {r['ref']: r for r in json.load(open(prior_path)) if include_missing or r.get('kb') or r.get('catalog')} if prior_path else None
# Empty/background labels are not requirements; an AI-file catalog or knowledge-base fallback never enters ai above.
refs = [r for r in ai if str(r).strip() and re.search(r'\d', str(r))] if include_missing else [r for r in kb if r in ai and (prior is None or r in prior)]
if adobe_refs is not None: refs = [ref for ref in refs if ref in adobe_refs]
ORDERS = [('ai', 'kb', 'catalog'), ('kb', 'catalog', 'ai'), ('catalog', 'ai', 'kb'), ('kb', 'ai', 'catalog'), ('ai', 'catalog', 'kb'), ('catalog', 'kb', 'ai')]
if prior is not None:
    ORDERS = [('ai', 'kb', 'kb_prior', 'catalog'), ('kb', 'kb_prior', 'catalog', 'ai'), ('kb_prior', 'catalog', 'ai', 'kb'), ('catalog', 'ai', 'kb', 'kb_prior'),
              ('kb_prior', 'kb', 'ai', 'catalog'), ('ai', 'catalog', 'kb_prior', 'kb'), ('catalog', 'kb_prior', 'kb', 'ai'), ('kb', 'ai', 'catalog', 'kb_prior')]
body = lambda t: (t or '').split('\nAdobe sources')[0].strip()
MISSING = 'No answer was produced for this requirement.'
def actual(row):
    return body(row.get('kb')) or body(row.get('catalog')) or MISSING
parts, key = ['THE RFP (as the client issued it)\n' + rfp + '\n\n'], {}
for i, r in enumerate(refs):
    order = ORDERS[i % len(ORDERS)]
    current = kb.get(r, {})
    if include_missing:
        text = {'ai': body(ai[r]['answer']) or MISSING, 'kb': actual(current), 'catalog': body(current.get('catalog')) or MISSING}
        if prior is not None: text['kb_prior'] = actual(prior.get(r, {}))
    else:
        text = {'ai': body(ai[r]['answer']), 'kb': body(kb[r]['kb']), 'catalog': body(kb[r]['catalog'])}
        if prior is not None: text['kb_prior'] = body(prior[r].get('kb') or prior[r]['catalog'])
    key[r] = dict(zip('ABCD', order))
    lim = current.get('limit')
    if include_missing and lim is None: lim = ai[r].get('limit')
    question = (current.get('question') or ai[r].get('question') or (prior or {}).get(r, {}).get('question') or '') if include_missing else current['question']
    parts.append(f'=== {r}' + (f' (word limit {lim})' if lim else '') + f': {question}\n\n' + '\n\n'.join(f'--- Answer {L}\n{text[o]}' for L, o in zip('ABCD', order)) + '\n\n')
os.makedirs(out, exist_ok=True)
open(os.path.join(out, f'{tag}_panel.txt'), 'w').write(''.join(parts))
json.dump(key, open(os.path.join(out, f'{tag}_key.json'), 'w'), indent=1)
print(f'{tag}: {len(refs)} requirements, {len(ORDERS[0])} arms including missing responses' if include_missing else f'{tag}: {len(refs)} requirements with all {len(ORDERS[0])} answers')
