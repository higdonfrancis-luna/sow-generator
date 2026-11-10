"""RFP Builder part three: builds sow/rfp_facts.json, the knowledge base the prototype page carries, from statements.json.

Every client sentence in statements.json lists the quotes that back it. This script finds each quote among the facts marked
"verified" in hosting.json, security.json and uptime_privacy_licensing.json (checked on Adobe's pages, Nov 9 2026), or, for a
quote that starts with "pdf:", in the text of Adobe's Brand Concierge security overview kept in abc/internal/. The sources of
the matched facts become the sentence's sources. A quote that starts with "trust:" is found in Adam's copy of Adobe's Trust
Center compliance list (trust_center/compliance_list_2026-05-21.md; the page itself blocks this session). It stops when a quote is not found, a source has no title, or a sentence
carries an em dash. Run from the repo root (sow/build_site.py runs it first):

Step 67 (Nov 10 2026): statements.json also holds "explain", the sentences an answer opens with (what a product does, in the words of
the question), each with its quotes, found the same way among the verified facts of explain.json (checked on Adobe's pages Nov 10 2026;
the record is in sow/rfp_prototype/step67_research/). A sentence may carry "short", the same facts in fewer words, which the page uses
when the RFP states a word limit; an empty "short" leaves the sentence out of the shorter answer.

    python3 sow/rfp_prototype/part3_research/build_facts.py
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
OUT = os.path.join(ROOT, 'sow', 'rfp_facts.json')
S = json.load(open(os.path.join(HERE, 'statements.json'), encoding='utf-8'))

def norm(t):
    return re.sub(r'\s+', ' ', str(t).replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('‑', '-')).strip().lower()

facts = []
for name in ('hosting.json', 'security.json', 'uptime_privacy_licensing.json', 'explain.json'):
    d = json.load(open(os.path.join(HERE, name), encoding='utf-8'))
    groups = list(d['products'].values()) + [{'facts': d.get('shared', [])}]
    for g in groups:
        for f in g['facts']:
            if f.get('status') == 'verified' and f.get('url') and f.get('quote'):
                facts.append((norm(f['quote']), f['url']))
pdf = S['pdf']
pdf_text = norm(subprocess.run(['pdftotext', '-layout', os.path.join(ROOT, pdf['path']), '-'], capture_output=True, text=True, check=True).stdout)
trust = S['trust']   # Adobe's Trust Center compliance list, as Adam copied it (this session cannot open www.adobe.com)
trust_text = norm(open(os.path.join(ROOT, trust['path']), encoding='utf-8').read())

fails = []
def ok(c, m):
    print(('✅ ' if c else '❌ ') + m)
    if not c: fails.append(m)

def source_of(q):
    if q.startswith('pdf:'):
        return pdf['url'] if norm(q[4:]) in pdf_text else None
    if q.startswith('trust:'):
        return trust['url'] if norm(q[6:]) in trust_text else None
    n = norm(q)
    for text, url in facts:
        if n in text:
            return url
    return None

titles = S['titles']
sources, index = [], {}
def src_id(url):
    if url not in index:
        index[url] = len(sources)
        sources.append({'url': url, 'title': pdf['title'] if url == pdf['url'] else trust['title'] if url == trust['url'] else titles.get(url, '')})
    return index[url]

out = []
missing_q, missing_title = [], set()
for st in S['statements']:
    srcs = []
    if not st.get('own'):
        if not st.get('q'):
            missing_q.append(st['text'][:60] + ' (no quote)')
        for q in st.get('q', []):
            url = source_of(q)
            if not url:
                missing_q.append(q[:90])
                continue
            if url not in (pdf['url'], trust['url']) and url not in titles:
                missing_title.add(url)
            i = src_id(url)
            if i not in srcs:
                srcs.append(i)
    e = {k: st[k] for k in ('topic', 'for', 'text') }
    for k in ('only', 'own', 'when', 'short'):
        if k in st: e[k] = st[k]
    if st.get('client') is False: e['client'] = False
    e['src'] = srcs
    out.append(e)

explain = []
for st in S.get('explain', []):
    srcs = []
    if not st.get('q') and st.get('kind') != 'note':   # a note is a caution for the partner alone, with no client sentence to back
        missing_q.append(st['text'][:60] + ' (no quote)')
    for q in st.get('q', []):
        url = source_of(q)
        if not url:
            missing_q.append(q[:90])
            continue
        if url not in titles:
            missing_title.add(url)
        i = src_id(url)
        if i not in srcs:
            srcs.append(i)
    e = {k: st[k] for k in ('for', 'kind', 'when', 'first', 'text', 'licensing', 'confirm') if k in st}
    e['src'] = srcs
    explain.append(e)

ok(not missing_q, 'every quote is found among the verified facts or in the security overview' + ('' if not missing_q else ': ' + ' | '.join(missing_q)))
ok(not missing_title, 'every source has a title' + ('' if not missing_title else ': ' + ' | '.join(sorted(missing_title))))
every = [x['text'] for x in out] + [x.get('short', '') for x in out] + [x.get('text', '') for x in explain] + [t for x in explain for t in x.get('licensing', [])] + [x.get('confirm', '') for x in explain] + [c['text'] for c in S['confirm']] + [a['text'] for a in S['asks']] + [a['client'] for a in S['asks']] + list(S['topics'].values())
ok(not any('—' in t for t in every), 'no em dash in any sentence')
ok(all(isinstance(x['for'], list) or x['for'] == '*' for x in out), 'every sentence says which products it speaks for')
ok(all(x['topic'] in S['topics'] for x in out) and all(c['topic'] in S['topics'] or c['topic'] == '*' for c in S['confirm']), 'every sentence has a known topic')
ok(all(isinstance(x['for'], list) and x['for'] and (x.get('kind') == 'note' or (x.get('kind') in ('what', 'role')) != bool(x.get('when'))) for x in explain), 'every explain sentence names its products and is either a kind (what, role, note) or has the words that call for it')
ok(all(bool(x.get('confirm')) and not x.get('text') if x.get('kind') == 'note' else bool(x.get('text')) for x in explain), 'a note carries only its caution for the partner; every other explain sentence has its text')
ok(all(w == w.lower() and w.strip() == w and len(w) > 2 for x in explain for w in x.get('when', [])), 'the words that call for an explain sentence are lower case')
# the release-status words sow/qa/check_rendered_copy.js forbids anywhere a partner or client can read: a note for the partner is read too
STATUS = re.compile(r"\bbeta\b|early access|limited availability|limited release|coming soon|not yet available|not available yet|\bdon't yet\b|\bdo not yet\b|\bnot yet support|future release|not generally available|technical preview|public preview|private preview|\btrial\b", re.I)
ok(not any(STATUS.search(x.get('text', '') + ' ' + x.get('confirm', '') + ' ' + ' '.join(x.get('licensing', []))) for x in explain), 'no explain sentence or partner note carries a release-status or trial word')
ok(not any(re.search(r'\b(?:legacy|beta|limited availability|maintenance mode|co-innovation|trial|paid)\b', x.get('text', ''), re.I) for x in explain), 'no explain sentence the client reads carries a lifecycle, trial or paid-offer word')
if fails:
    sys.exit('❌ rfp_facts.json not written: ' + str(len(fails)) + ' check(s) failed')
data = {'checked': S['checked'], 'topics': S['topics'], 'sources': sources, 'statements': out, 'explain': explain, 'confirm': S['confirm'], 'asks': S['asks']}
json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ALL FACT CHECKS PASSED: sow/rfp_facts.json written, ' + str(len(out)) + ' sentences, ' + str(len(explain)) + ' explain sentences, ' + str(len(sources)) + ' Adobe sources')
