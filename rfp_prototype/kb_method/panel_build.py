"""The method knowledge base, measured (Nov 13 2026, Adam's key metric): builds a blind panel file per RFI with three answers to
each Adobe requirement, shuffled: the AI writer's (from the live run), the method knowledge base's and today's catalog answer
(both from eval_answers.js). The key, which answer is which, is written beside it for unblinding after the judges score.

python3 sow/rfp_prototype/kb_method/panel_build.py <rfp source .html or .txt> <ai answers .json> <no-AI answers .json> <out dir> <tag>
"""
import json, os, re, sys, html as H

src, ai_path, kb_path, out, tag = sys.argv[1:6]
raw = open(src, encoding='utf-8').read()
rfp = H.unescape(re.sub(r'<[^>]+>', ' ', raw.split('<body>')[1] if '<body>' in raw else raw))
rfp = re.sub(r'\n\s*\n+', '\n', re.sub(r'[ \t]+', ' ', rfp)).strip()
ai = {a['ref']: a for a in json.load(open(ai_path))['answers'] if a.get('model') == 'claude-opus-5-5'}
kb = {r['ref']: r for r in json.load(open(kb_path)) if r.get('kb')}
refs = [r for r in kb if r in ai]
ORDERS = [('ai', 'kb', 'catalog'), ('kb', 'catalog', 'ai'), ('catalog', 'ai', 'kb'), ('kb', 'ai', 'catalog'), ('ai', 'catalog', 'kb'), ('catalog', 'kb', 'ai')]
body = lambda t: (t or '').split('\nAdobe sources')[0].strip()
parts, key = ['THE RFP (as the client issued it)\n' + rfp + '\n\n'], {}
for i, r in enumerate(refs):
    order = ORDERS[i % len(ORDERS)]
    text = {'ai': body(ai[r]['answer']), 'kb': body(kb[r]['kb']), 'catalog': body(kb[r]['catalog'])}
    key[r] = dict(zip('ABC', order))
    lim = kb[r].get('limit')
    parts.append(f'=== {r}' + (f' (word limit {lim})' if lim else '') + f': {kb[r]["question"]}\n\n' + '\n\n'.join(f'--- Answer {L}\n{text[o]}' for L, o in zip('ABC', order)) + '\n\n')
os.makedirs(out, exist_ok=True)
open(os.path.join(out, f'{tag}_panel.txt'), 'w').write(''.join(parts))
json.dump(key, open(os.path.join(out, f'{tag}_key.json'), 'w'), indent=1)
print(f'{tag}: {len(refs)} requirements with all three answers')
