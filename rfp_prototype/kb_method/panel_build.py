"""The method knowledge base, measured (Nov 13 2026, Adam's key metric): builds a blind panel file per RFI with three answers to
each Adobe requirement, shuffled: the AI writer's (from the live run), the method knowledge base's and today's catalog answer
(both from eval_answers.js). The key, which answer is which, is written beside it for unblinding after the judges score.

python3 sow/rfp_prototype/kb_method/panel_build.py <rfp source .html or .txt> <ai answers .json> <no-AI answers .json> <out dir> <tag> [<earlier no-AI answers .json>]

Round 2 (Nov 13): with an earlier round's no-AI answers as the sixth argument, each requirement shows four answers, A to D (the AI's,
this round's knowledge base, the earlier round's and today's catalog answer), in eight rotating orders, so the same judge scores the
earlier round against this one; a requirement is shown only where every answer exists. Round 3 (Nov 13): where the earlier round had
no knowledge-base answer, its answer is what the tool gave with no AI then, the catalog's, so a requirement only the new round
answers (a migration off another CMS) is scored too.
"""
import json, os, re, sys, html as H

src, ai_path, kb_path, out, tag = sys.argv[1:6]
prior_path = sys.argv[6] if len(sys.argv) > 6 else None
raw = open(src, encoding='utf-8').read()
rfp = H.unescape(re.sub(r'<[^>]+>', ' ', raw.split('<body>')[1] if '<body>' in raw else raw))
rfp = re.sub(r'\n\s*\n+', '\n', re.sub(r'[ \t]+', ' ', rfp)).strip()
ai = {a['ref']: a for a in json.load(open(ai_path))['answers'] if a.get('model') == 'claude-opus-5-5'}
kb = {r['ref']: r for r in json.load(open(kb_path)) if r.get('kb')}
prior = {r['ref']: r for r in json.load(open(prior_path)) if r.get('kb') or r.get('catalog')} if prior_path else None
refs = [r for r in kb if r in ai and (prior is None or r in prior)]
ORDERS = [('ai', 'kb', 'catalog'), ('kb', 'catalog', 'ai'), ('catalog', 'ai', 'kb'), ('kb', 'ai', 'catalog'), ('ai', 'catalog', 'kb'), ('catalog', 'kb', 'ai')]
if prior is not None:
    ORDERS = [('ai', 'kb', 'kb_prior', 'catalog'), ('kb', 'kb_prior', 'catalog', 'ai'), ('kb_prior', 'catalog', 'ai', 'kb'), ('catalog', 'ai', 'kb', 'kb_prior'),
              ('kb_prior', 'kb', 'ai', 'catalog'), ('ai', 'catalog', 'kb_prior', 'kb'), ('catalog', 'kb_prior', 'kb', 'ai'), ('kb', 'ai', 'catalog', 'kb_prior')]
body = lambda t: (t or '').split('\nAdobe sources')[0].strip()
parts, key = ['THE RFP (as the client issued it)\n' + rfp + '\n\n'], {}
for i, r in enumerate(refs):
    order = ORDERS[i % len(ORDERS)]
    text = {'ai': body(ai[r]['answer']), 'kb': body(kb[r]['kb']), 'catalog': body(kb[r]['catalog'])}
    if prior is not None: text['kb_prior'] = body(prior[r].get('kb') or prior[r]['catalog'])
    key[r] = dict(zip('ABCD', order))
    lim = kb[r].get('limit')
    parts.append(f'=== {r}' + (f' (word limit {lim})' if lim else '') + f': {kb[r]["question"]}\n\n' + '\n\n'.join(f'--- Answer {L}\n{text[o]}' for L, o in zip('ABCD', order)) + '\n\n')
os.makedirs(out, exist_ok=True)
open(os.path.join(out, f'{tag}_panel.txt'), 'w').write(''.join(parts))
json.dump(key, open(os.path.join(out, f'{tag}_key.json'), 'w'), indent=1)
print(f'{tag}: {len(refs)} requirements with all {len(ORDERS[0])} answers')
