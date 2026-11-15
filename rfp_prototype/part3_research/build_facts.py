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

    python3 rfp_prototype/part3_research/build_facts.py

Offline builds check the exact normalized PDF quotations against verified_pdf_quotes.json.
To verify changed PDF quotations and refresh that record, set SOW_SECURITY_OVERVIEW_PDF
to the source PDF and run this script with pdftotext installed.
"""
import hashlib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(SOW, 'rfp_facts.json')
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
# The original reference PDF stays outside the standalone repository. Its four checked
# quotations have a small verification record so clean checkouts can rebuild offline.
# Set SOW_SECURITY_OVERVIEW_PDF to revalidate against the full authoritative document.
receipt_path = os.path.join(HERE, 'verified_pdf_quotes.json')
source_override = os.environ.get('SOW_SECURITY_OVERVIEW_PDF')
pdf_path = source_override or os.path.join(os.path.dirname(SOW), pdf['path'])
if source_override or os.path.isfile(pdf_path):
    pdf_text = norm(subprocess.run(['pdftotext', '-layout', pdf_path, '-'], capture_output=True, text=True, check=True).stdout)
    verified_pdf_quotes = set()
    print('Checking security overview quotations against the supplied PDF.')
else:
    pdf_text = None
    with open(receipt_path, encoding='utf-8') as f:
        receipt = json.load(f)
    if receipt['url'] != pdf['url']:
        raise ValueError('Source URL changed; verify PDF quotations against SOW_SECURITY_OVERVIEW_PDF')
    verified_pdf_quotes = set(receipt['quote_sha256'])
    print('Checking security overview quotations against the verified PDF record.')
trust = S['trust']   # Adobe's Trust Center compliance list, as Adam copied it (this session cannot open www.adobe.com)
trust_text = norm(open(os.path.join(SOW, trust['path'].removeprefix('sow/')), encoding='utf-8').read())

fails = []
def ok(c, m):
    print(('✅ ' if c else '❌ ') + m)
    if not c: fails.append(m)

def source_of(q):
    if q.startswith('pdf:'):
        quote = norm(q[4:])
        digest = hashlib.sha256(quote.encode()).hexdigest()
        if pdf_text is not None and quote and quote in pdf_text:
            verified_pdf_quotes.add(digest)
        return pdf['url'] if digest in verified_pdf_quotes else None
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
    e = {k: st[k] for k in ('for', 'kind', 'when', 'first', 'text', 'licensing', 'confirm', 'asks', 'extra') if k in st}
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
# step 69: an ask that comes with a sentence has the partner's wording and the client's, and the client's never says "your client"
ok(all(isinstance(a, dict) and a.get('text') and a.get('client') and 'your client' not in a['client'].lower() and 'your client' in a['text'].lower() for x in explain for a in x.get('asks', [])), 'every ask that comes with an explain sentence is worded for the partner and for the client')
# the release-status words sow/qa/check_rendered_copy.js forbids anywhere a partner or client can read: a note for the partner is read too
STATUS = re.compile(r"\bbeta\b|early access|limited availability|limited release|coming soon|not yet available|not available yet|\bdon't yet\b|\bdo not yet\b|\bnot yet support|future release|not generally available|technical preview|public preview|private preview|\btrial\b", re.I)
ok(not any(STATUS.search(x.get('text', '') + ' ' + x.get('confirm', '') + ' ' + ' '.join(x.get('licensing', []))) for x in explain), 'no explain sentence or partner note carries a release-status or trial word')
ok(not any(re.search(r'\b(?:legacy|beta|limited availability|maintenance mode|co-innovation|trial|paid)\b', x.get('text', ''), re.I) for x in explain), 'no explain sentence the client reads carries a lifecycle, trial or paid-offer word')
if fails:
    sys.exit('❌ rfp_facts.json not written: ' + str(len(fails)) + ' check(s) failed')
if pdf_text is not None:
    with open(pdf_path, 'rb') as f:
        document_sha = hashlib.sha256(f.read()).hexdigest()
    receipt = {'url': pdf['url'], 'document_sha256': document_sha, 'quote_sha256': sorted(verified_pdf_quotes)}
    with open(receipt_path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(receipt, indent=2) + '\n')
data = {'checked': S['checked'], 'topics': S['topics'], 'sources': sources, 'statements': out, 'explain': explain, 'confirm': S['confirm'], 'asks': S['asks']}
json.dump(data, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ALL FACT CHECKS PASSED: sow/rfp_facts.json written, ' + str(len(out)) + ' sentences, ' + str(len(explain)) + ' explain sentences, ' + str(len(sources)) + ' Adobe sources')
