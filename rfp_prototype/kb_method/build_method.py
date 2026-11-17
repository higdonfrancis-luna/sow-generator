"""The method knowledge base (Nov 13 2026, Adam: "build out the knowledge base ... then start testing the output versus our
knowledge base"): checks every entry and writes sow/rfp_method.json, which the RFI Builder carries to write answers with no AI.

Reads the source batches (batches/batch_NN.json: each service's material) and the entries (reviewed/batch_NN.json where a batch
has been reviewed, else drafts/batch_NN.json). Every entry must pass, or nothing is written:
  - one entry per service, in the shape BRIEF.md sets, with the number of steps its hours call for;
  - no dashes, marketing words, prices, hours, release labels or ask-Adobe wording; partner voice, never "the Client";
  - every Adobe product name an entry uses is in its own material (a failure otherwise); a capitalised feature name (Cloud
    Manager, Data Mirror) the material does not carry is a warning, and every warning goes to the review of its batch.

Round 2 (Nov 13): each service also carries the phrases an RFI uses for its work (phrases/claude_batch_NN.json, and ChatGPT's
chatgpt_round2/phrases_batch_NN.json where they exist: 2 to 10 words each, no dashes or marketing words, merged without
repeats), which the page uses to pick the service a question asks for; and the topic playbook (playbook/topic_<id>.json, under
playbook/BRIEF.md) gives a sourced method for common asks the catalog has no service for. A topic must pass the same checks as an
entry, every service it draws on must exist, and every fact must carry its quote and page.

Run from the repo root: python3 sow/rfp_prototype/kb_method/build_method.py [--report]
  --issues writes reviews/batch_NN_issues.txt (the checker's findings) for every drafted batch, for its review (REVIEW.md).
"""
import json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(SOW, 'rfp_method.json')
CAT = json.load(open(os.path.join(SOW, 'canvas', 'catalog.json')))
PRODUCTS = sorted({p['name'] for p in CAT['products'] if not p.get('outside')}, key=len, reverse=True)

BANNED = [
    (re.compile('[—–]'), 'a dash'),
    (re.compile(r'\b(?:seamless(?:ly)?|robust|cutting-edge|world-class|best-in-class|leverag\w*|unlock\w*|empower\w*|streamlin\w*|synerg\w*)\b', re.I), 'a marketing word'),
    (re.compile(r'\b(?:beta|early access|early adopter|limited availability|limited release|coming soon|general availability|generally available)\b', re.I), 'a release label'),
    (re.compile(r'\bconfirm(?:ed|s|ing)? (?:[\w\'-]+ ){0,6}with Adobe\b|\basks? Adobe\b(?![\'’]s| data\b| (?:Analytics|Commerce|Express)\b)|\bnot stated by Adobe\b|\bfrom Adobe in writing\b|\bin writing from Adobe\b|\bAdobe[\'’]s written\b|\b(?:obtain|get|secure|seek)\b[^.]{0,60}\bfrom Adobe\b', re.I), 'ask-Adobe wording'),
    (re.compile(r'[$€£]\s?\d|\bper hour\b|\bhourly rate\b|\b\d[\d,]*\s*(?:hours?|hrs?)\b', re.I), 'a price or hours'),
    (re.compile(r'\b(?:the Client|your client|the partner|our client)(?![\w-])', re.I), 'the wrong voice'),   # 'the client-side libraries' is not the voice
]
KINDS = {'workstream', 'task'}
PHASES = {'discovery', 'build', 'launch', 'after launch'}
words = lambda t: len(str(t).split())


def steps_for(base):
    if base < 24: return (3, 3)
    if base <= 120: return (3, 4)
    if base <= 400: return (4, 5)
    return (5, 6)


def material(src):
    parts = [src.get('name', ''), ' '.join(src.get('owner', [])), src.get('scope', ''), src.get('adobe_quote', ''),
             ' '.join(src.get('connection_how', [])), ' '.join(src.get('product_facts', [])), src.get('license', '')]
    parts += [v for k, v in src.items() if k.startswith('template_') and isinstance(v, str)]
    return ' '.join(parts)


# capitalised names of two or more words, or one word with a capital inside (CJA, OAuth), not at the start of a sentence
NAME = re.compile(r'(?<![.:!?]\s)(?<!^)\b((?:[A-Z][\w.\'&-]*[A-Z0-9][\w.&-]*|[A-Z][a-z][\w-]*)(?:\s+(?:[A-Z][\w.&-]+|of|for|and|on|in|to|the))*\s+[A-Z][\w.&-]+|[A-Z][a-z]+[A-Z][\w]*|[A-Z]{2,}[\w]*)')
COMMON = {'Adobe', 'API', 'APIs', 'URL', 'URLs', 'CSV', 'PDF', 'PDFs', 'JSON', 'HTML', 'CSS', 'SEO', 'UAT', 'QA', 'KPI', 'KPIs', 'ID', 'IDs',
          'SSO', 'SAML', 'DNS', 'CDN', 'CRM', 'BI', 'AI', 'FAQ', 'FAQs', 'IT', 'UTM', 'GDPR', 'HIPAA', 'SKU', 'SKUs', 'ROI', 'OK', 'B2B', 'B2C',
          'RACI', 'SLA', 'SLAs', 'CMS', 'DAM', 'XDM', 'ECID', 'CTA', 'CTAs', 'A/B', 'AB', 'UX', 'UI', 'US', 'EU', 'PII', 'WCAG', 'SFTP', 'HTTP',
          'HTTPS', 'REST', 'OAuth', 'JavaScript', 'GitHub', 'Lighthouse', 'Excel', 'Word', 'PowerPoint', 'Google', 'Microsoft', 'Salesforce',
          'Snowflake', 'BigQuery', 'Databricks', 'Power BI', 'Tableau', 'Looker', 'SharePoint', 'Jira', 'Slack', 'Teams', 'Okta'}


def check(entry, src):
    fails, warns = [], []
    i = src['id']
    base = src['hours']['base']
    for k in ('steps', 'deliverables', 'asks', 'risk', 'outcome', 'kind', 'phase'):
        if k not in entry: fails.append(f'{i}: no {k}')
    if fails: return fails, warns
    lo, hi = steps_for(base)
    if not (lo <= len(entry['steps']) <= hi + 1): fails.append(f'{i}: {len(entry["steps"])} steps for {base} hours (want {lo} to {hi})')
    if not 2 <= len(entry['deliverables']) <= 5: fails.append(f'{i}: {len(entry["deliverables"])} deliverables')
    if not 0 <= len(entry['asks']) <= 3: fails.append(f'{i}: {len(entry["asks"])} asks')
    if entry['kind'] not in KINDS: fails.append(f'{i}: kind {entry["kind"]}')
    if entry['phase'] not in PHASES: fails.append(f'{i}: phase {entry["phase"]}')
    if src['unit'] == 'monthly' and entry['phase'] != 'after launch': fails.append(f'{i}: a monthly service outside "after launch"')
    texts = [('step', t) for t in entry['steps']] + [('deliverable', t) for t in entry['deliverables']] + [('ask', t) for t in entry['asks']] + [('risk', entry['risk']), ('outcome', entry['outcome'])]
    span = {'step': (6, 36), 'deliverable': (1, 12), 'ask': (4, 24), 'risk': (8, 38), 'outcome': (8, 38)}
    mat = material(src)
    for kind, t in texts:
        if not isinstance(t, str) or not t.strip(): fails.append(f'{i}: an empty {kind}'); continue
        a, b = span[kind]
        if not a <= words(t) <= b: warns.append(f'{i}: a {kind} of {words(t)} words: {t[:80]}')
        for re_, what in BANNED:
            if re_.search(t): fails.append(f'{i}: {what} in a {kind}: {t[:120]}')
        for p in PRODUCTS:
            if re.search(r'(?<![\w-])' + re.escape(p) + r'(?![\w-])', t) and p not in mat:
                fails.append(f'{i}: {p} is not in its material: {t[:120]}')
        for m in NAME.finditer(t):
            name = m.group(1).strip().rstrip('.')
            if name in COMMON or any(name == p or name in p for p in PRODUCTS) or name in mat: continue
            if all(w in COMMON or w in mat or w.lower() in mat.lower() for w in re.split(r'\s+', name)): continue
            warns.append(f'{i}: the name "{name}" is not in its material: {t[:120]}')
    return fails, warns


def issues():
    for f in sorted(glob.glob(os.path.join(HERE, 'drafts', 'batch_*.json'))):
        b = os.path.basename(f); srcs = {s['id']: s for s in json.load(open(os.path.join(HERE, 'batches', b)))['services']}
        ents = {e['id']: e for e in json.load(open(f))}
        lines = []
        for i, s in srcs.items():
            if i not in ents: lines.append(f'❌ {i}: no entry'); continue
            f_, w_ = check(ents[i], s); lines += ['❌ ' + x for x in f_] + ['⚠️  ' + x for x in w_]
        open(os.path.join(HERE, 'reviews', b.replace('.json', '_issues.txt')), 'w').write('\n'.join(lines) + '\n')
        print(f'{b}: {sum(x.startswith("❌") for x in lines)} failures, {sum(x.startswith("⚠") for x in lines)} warnings')


PHRASE_FILES = [os.path.join(HERE, 'phrases', 'claude_batch_*.json'), os.path.join(HERE, 'chatgpt_round2', 'phrases_batch_*.json')]


def phrases_of(srcs):
    """Every service's phrases, from Claude's files and ChatGPT's where they exist, checked and merged without repeats."""
    out, fails = {}, []
    for pat in PHRASE_FILES:
        for f in sorted(glob.glob(pat)):
            for i, ps in json.load(open(f)).items():
                if i not in srcs: fails.append(f'{os.path.basename(f)}: phrases for no service: {i}'); continue
                have = out.setdefault(i, [])
                for p in ps:
                    p = re.sub(r'\s+', ' ', str(p)).strip().rstrip('.')
                    if not 2 <= words(p) <= 10: fails.append(f'{i}: a phrase of {words(p)} words: {p}'); continue
                    bad = [what for re_, what in BANNED[:3] if re_.search(p)]
                    if bad: fails.append(f'{i}: {bad[0]} in a phrase: {p}'); continue
                    if p.lower() not in {x.lower() for x in have}: have.append(p)
    return out, fails


TOPIC_KEYS = ('id', 'title', 'triggers', 'products', 'draws_on', 'steps', 'deliverables', 'asks', 'risk', 'outcome', 'phase', 'hours', 'facts')


def topics_of():
    """The topic playbook: each topic in BRIEF.md's shape, under the entries' own rules, its services real and its facts sourced."""
    out, fails = [], []
    lines = CAT['lines']
    pids = {p['id'] for p in CAT['products']}
    for f in sorted(glob.glob(os.path.join(HERE, 'playbook', 'topic_*.json'))):
        t = json.load(open(f)); i = t.get('id', os.path.basename(f))
        miss = [k for k in TOPIC_KEYS if k not in t]
        if miss: fails.append(f'topic {i}: no {", ".join(miss)}'); continue
        if not 4 <= len(t['steps']) <= 5: fails.append(f'topic {i}: {len(t["steps"])} steps')
        if not 3 <= len(t['deliverables']) <= 4: fails.append(f'topic {i}: {len(t["deliverables"])} deliverables')
        if not 1 <= len(t['asks']) <= 2: fails.append(f'topic {i}: {len(t["asks"])} asks')
        if not 2 <= len(t['facts']) <= 5: fails.append(f'topic {i}: {len(t["facts"])} facts')
        if not 5 <= len(t['triggers']) <= 12: fails.append(f'topic {i}: {len(t["triggers"])} triggers')
        if t['phase'] not in PHASES: fails.append(f'topic {i}: phase {t["phase"]}')
        h = t['hours']
        if h is not None and not (isinstance(h, dict) and all(isinstance(h.get(k), int) for k in ('low', 'base', 'high')) and h['low'] <= h['base'] <= h['high']):
            fails.append(f'topic {i}: hours {h}')
        for p in t['products'] + list(t['draws_on']):
            if p not in pids: fails.append(f'topic {i}: no product {p}')
        for p, ids in t['draws_on'].items():
            for l in ids:
                if l not in lines: fails.append(f'topic {i}: no service {l}')
        texts = [('step', x) for x in t['steps']] + [('deliverable', x) for x in t['deliverables']] + [('ask', x) for x in t['asks']] + [('risk', t['risk']), ('outcome', t['outcome'])]
        for fx in t['facts']:
            if not (fx.get('text') and fx.get('quote') and fx.get('title') and str(fx.get('url', '')).startswith('https://') and fx.get('for')): fails.append(f'topic {i}: a fact without its text, quote, page, page title or products'); continue
            texts.append(('fact', fx['text']))
        for kind, x in texts:
            for re_, what in BANNED:
                if re_.search(x): fails.append(f'topic {i}: {what} in a {kind}: {x[:120]}')
        for p in t.get('unless_products', []):
            if p not in pids: fails.append(f'topic {i}: no product {p} to stand aside for')
        out.append({k: t[k] for k in TOPIC_KEYS + tuple(k for k in ('unless_products', 'echo_laws') if k in t)})
    return out, fails


def main():
    if '--issues' in sys.argv: return issues()
    report = '--report' in sys.argv
    srcs, entries, missing, home = {}, {}, [], {}
    for f in sorted(glob.glob(os.path.join(HERE, 'batches', 'batch_*.json'))):
        b = os.path.basename(f)
        for s in json.load(open(f))['services']: srcs[s['id']] = s; home[s['id']] = b
        rev, dra = os.path.join(HERE, 'reviewed', b), os.path.join(HERE, 'drafts', b)
        use = rev if os.path.exists(rev) else dra if os.path.exists(dra) else None
        if not use: missing.append(b); continue
        for e in json.load(open(use)): entries[e['id']] = e
    fails, warns = [], []
    if missing: fails.append('no entries yet for ' + ', '.join(missing))
    for i, s in srcs.items():
        if i not in entries:
            if home[i] not in missing: fails.append(f'{i}: no entry')
            continue
        f_, w_ = check(entries[i], s); fails += f_; warns += w_
    extra = sorted(set(entries) - set(srcs))
    if extra: fails.append('entries for no service: ' + ', '.join(extra))
    thin = sorted(i for i, e in entries.items() if e.get('thin'))
    if report or fails:
        for x in fails[:400]: print('❌ ' + x)
        for x in (warns if report else [])[:400]: print('⚠️  ' + x)
    print(f'{len(entries)} of {len(srcs)} services have an entry; {len(thin)} thin; {len(fails)} failures; {len(warns)} warnings')
    if fails: sys.exit('❌ sow/rfp_method.json not written')
    phrases, pf = phrases_of(srcs)
    topics, tf = topics_of()
    if pf or tf:
        for x in (pf + tf)[:200]: print('❌ ' + x)
        sys.exit('❌ sow/rfp_method.json not written')
    out = {'checked': '2026-11-13', 'services': {i: {**{k: entries[i][k] for k in ('steps', 'deliverables', 'asks', 'risk', 'outcome', 'kind', 'phase')}, **({'phrases': phrases[i]} if phrases.get(i) else {})} for i in sorted(entries)}}
    if topics: out['topics'] = topics
    print(f'{sum(len(v) for v in phrases.values())} phrases for {len(phrases)} services; {len(topics)} topics in the playbook')
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f'ALL METHOD CHECKS PASSED: sow/rfp_method.json written, {len(entries)} services')


if __name__ == '__main__':
    main()
