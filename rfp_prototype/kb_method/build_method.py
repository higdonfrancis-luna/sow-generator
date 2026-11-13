"""The method knowledge base (Nov 13 2026, Adam: "build out the knowledge base ... then start testing the output versus our
knowledge base"): checks every entry and writes sow/rfp_method.json, which the RFI Builder carries to write answers with no AI.

Reads the source batches (batches/batch_NN.json: each service's material) and the entries (reviewed/batch_NN.json where a batch
has been reviewed, else drafts/batch_NN.json). Every entry must pass, or nothing is written:
  - one entry per service, in the shape BRIEF.md sets, with the number of steps its hours call for;
  - no dashes, marketing words, prices, hours, release labels or ask-Adobe wording; partner voice, never "the Client";
  - every Adobe product name an entry uses is in its own material (a failure otherwise); a capitalised feature name (Cloud
    Manager, Data Mirror) the material does not carry is a warning, and every warning goes to the review of its batch.

Run from the repo root: python3 sow/rfp_prototype/kb_method/build_method.py [--report]
  --issues writes reviews/batch_NN_issues.txt (the checker's findings) for every drafted batch, for its review (REVIEW.md).
"""
import json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
OUT = os.path.join(ROOT, 'sow', 'rfp_method.json')
CAT = json.load(open(os.path.join(ROOT, 'sow', 'canvas', 'catalog.json')))
PRODUCTS = sorted({p['name'] for p in CAT['products'] if not p.get('outside')}, key=len, reverse=True)

BANNED = [
    (re.compile('[—–]'), 'a dash'),
    (re.compile(r'\b(?:seamless(?:ly)?|robust|cutting-edge|world-class|best-in-class|leverag\w*|unlock\w*|empower\w*|streamlin\w*|synerg\w*)\b', re.I), 'a marketing word'),
    (re.compile(r'\b(?:beta|early access|early adopter|limited availability|limited release|coming soon|general availability|generally available)\b', re.I), 'a release label'),
    (re.compile(r'\bconfirm(?:ed|s|ing)? (?:[\w\'-]+ ){0,6}with Adobe\b|\bnot stated by Adobe\b|\bfrom Adobe in writing\b|\bin writing from Adobe\b|\bAdobe[\'’]s written\b|\b(?:obtain|get|secure|seek)\b[^.]{0,60}\bfrom Adobe\b', re.I), 'ask-Adobe wording'),
    (re.compile(r'[$€£]\s?\d|\bper hour\b|\bhourly rate\b|\b\d[\d,]*\s*(?:hours?|hrs?)\b', re.I), 'a price or hours'),
    (re.compile(r'\b(?:the Client|your client|the partner|our client)\b', re.I), 'the wrong voice'),
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
    out = {'checked': '2026-11-13', 'services': {i: {k: entries[i][k] for k in ('steps', 'deliverables', 'asks', 'risk', 'outcome', 'kind', 'phase')} for i in sorted(entries)}}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f'ALL METHOD CHECKS PASSED: sow/rfp_method.json written, {len(entries)} services')


if __name__ == '__main__':
    main()
