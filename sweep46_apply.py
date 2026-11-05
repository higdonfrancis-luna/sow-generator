"""Step 46, part 2: apply the client sweep decided in sweep46_decisions.json (one decision per wording in
sweep46_occurrences.json: change, with its replacement, or keep) to the SOW steps and the canvas sources. Run once on
the step 45 files, then canvas/build.py and build_site.py.
- the SOW catalog: each changed service text keeps its earlier wording in PRIOR46 (with the neutral swaps of the time
  applied, as saved engagements on Create your own play hold them), so an unedited saved engagement takes the new
  wording and an edited one keeps the partner's words; a neutral swap changes on both sides, so it still applies
- the SOW page and the canvas page: in place, outside the earlier-wording records
- the canvas data: each changed string in place in its file, so nothing else in the file moves

    python3 sow/sweep46_apply.py
"""
import itertools, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
occ = {o['id']: o for o in json.load(open(os.path.join(HERE, 'sweep46_occurrences.json'), encoding='utf-8'))}
dec = {d['id']: d for d in json.load(open(os.path.join(HERE, 'sweep46_decisions.json'), encoding='utf-8'))}
assert set(dec) == set(occ), 'a decision for every wording'
for d in dec.values():
    assert d['action'] in ('change', 'keep') and (d['action'] == 'keep' or d.get('replacement')), d
    assert not re.search('[–—]', d.get('replacement') or ''), d
changes = [(occ[i], dec[i]['replacement']) for i in dec if dec[i]['action'] == 'change']

# every place, grouped by what it is
cat_edits, page_edits, tpl_edits, data_edits = {}, [], [], {}
for o, new in changes:
    for w in o['where']:
        if 'catalog' in w:
            cat_edits.setdefault(json.dumps(w['catalog']), []).append((w['at'], o['match'], new))
        elif w['file'] == 'sow/index.html':
            page_edits.append((w['offset'], o['match'], new))
        elif w['file'] == 'sow/canvas/template.html':
            tpl_edits.append((w['offset'], o['match'], new))
        else:
            data_edits.setdefault((w['file'], json.dumps(w['path'])), []).append((w['at'], o['match'], new))


def splice(text, edits):
    for (a, b), old, new in sorted(edits, key=lambda e: -e[0][0]):
        assert text[a:b] == old, (text[a - 20:b + 20], old)
        text = text[:a] + new + text[b:]
    return text


# 1. the SOW page, outside the catalog (offsets are in the file before any change)
path = os.path.join(HERE, 'index.html')
html = open(path, encoding='utf-8').read()
assert 'PRIOR46' not in html, 'run this once on the step 45 SOW page'
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
assert all(not (m.start() <= a < m.end()) for (a, _), _, _ in page_edits)
html = splice(html, page_edits)
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
by = {c['id']: c for c in CAT}
TEXT = ('scope', 'deliverable', 'acceptance', 'assumptions', 'exclusions', 'basis')


def get(p):
    o = by[p[0]]
    for k in p[1:]:
        o = o[k]
    return o


def put(p, v):
    o = by[p[0]]
    for k in p[1:-1]:
        o = o[k]
    o[p[-1]] = v


# 2. the SOW catalog: earlier wording first (with every neutral swap of the time), then the new wording
old_cat = json.loads(raw)
oby = {c['id']: c for c in old_cat}


def variants(c, key, t):
    flags = list((c.get('neutral') or {}).keys())
    out = {t}
    for n in range(1, len(flags) + 1):
        for fs in itertools.combinations(flags, n):
            v = t
            for f in fs:
                for o, w in (c['neutral'][f].get(key) or []):
                    v = w.join(v.split(o))
            out.add(v)
    return out


PRIOR = {}
for pk, edits in cat_edits.items():
    p = json.loads(pk)
    cur = get(p)
    put(p, splice(cur, edits))
    key = p[-1] if p[1] != 'neutral' else None
    if key in TEXT:
        PRIOR.setdefault(p[0], {}).setdefault(key, set()).update(variants(oby[p[0]], key, cur))
# the few service texts that already said "client" in lower case take the capital the rest of the SOW now has
# (two readers of the swept SOWs found them: O04, CW-CJA, CW-AEM)
CAP = [('articles about the client directly', 'articles about the Client directly'), ("cover the client's agreed AI-channel measures", "cover the Client's agreed AI-channel measures"),
       ('cover only the client-specific steps', 'cover only the Client-specific steps')]


def capwalk(o, path):
    if isinstance(o, dict):
        for k, v in o.items():
            if not k.startswith('source'):
                capwalk(v, path + [k])
    elif isinstance(o, list):
        for i, v in enumerate(o):
            capwalk(v, path + [i])
    elif isinstance(o, str) and any(a in o for a, _ in CAP):
        new = o
        for a, b in CAP:
            new = new.replace(a, b)
        put(path, new)
        key = path[-1] if path[1] != 'neutral' else None
        if key in TEXT:
            old = get_old(path)
            PRIOR.setdefault(path[0], {}).setdefault(key, set()).update(variants(oby[path[0]], key, old))
        capped.append(path[0])


def get_old(p):
    o = oby[p[0]]
    for k in p[1:]:
        o = o[k]
    return o


capped = []
for c in CAT:
    capwalk(c, [c['id']])
assert sorted(set(capped)) == ['CW-AEM', 'CW-CJA', 'O04'], capped
# a neutral swap still finds its text: its 'from' side is in the line's new wording somewhere
for c in CAT:
    for f, keys in (c.get('neutral') or {}).items():
        for key, pairs in keys.items():
            texts = [c.get(key) or ''] + [b.get(key) or '' for b in (c.get('bands') or {}).values() if isinstance(b, dict)]
            for o, w in pairs:
                assert any(o in t for t in texts), (c['id'], f, key, o[:80])
PRIOR = {cid: {k: sorted(v) for k, v in keys.items()} for cid, keys in PRIOR.items()}
blob = json.dumps(CAT, ensure_ascii=False)
html = html.replace('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')
BR = html.count('{') - html.count('}')
anchor = 'const PRIOR38='
assert html.count(anchor) == 1
html = html.replace(anchor, '/* step 46: the service wording before "the Client" (unedited earlier wording takes the new wording) */\nconst PRIOR46=' + json.dumps(PRIOR, ensure_ascii=False) + ';\n' + anchor)
use = '...(PRIOR38[baseId(c)]?.[key]||[]),'
n = html.count(use)
assert n >= 1
html = html.replace(use, use + '...(PRIOR46[baseId(c)]?.[key]||[]),')
assert html.count('{') - html.count('}') == BR
assert not re.search('[–—]', blob)
open(path, 'w', encoding='utf-8').write(html)

# 3. the canvas page
tp = os.path.join(HERE, 'canvas', 'template.html')
tpl = open(tp, encoding='utf-8').read()
open(tp, 'w', encoding='utf-8').write(splice(tpl, tpl_edits))

# 4. the canvas data: each changed string replaced where it sits in its file
files = {}
for (f, pk), edits in data_edits.items():
    fp = os.path.join(ROOT, f)
    if fp not in files:
        files[fp] = [open(fp, encoding='utf-8').read(), json.loads(open(fp, encoding='utf-8').read())]
    d = files[fp][1]
    o = d
    for k in json.loads(pk):
        o = o[k]
    files[fp].append((o, splice(o, edits)))
for fp, (text, d, *pairs) in files.items():
    for old, new in pairs:
        a, b = json.dumps(old, ensure_ascii=False)[1:-1], json.dumps(new, ensure_ascii=False)[1:-1]
        assert text.count(a) >= 1, (fp, old[:80])
        text = text.replace(a, b)
    json.loads(text)
    open(fp, 'w', encoding='utf-8').write(text)
print(f'step 46 applied: {len(changes)} wordings changed in {sum(len(o["where"]) for o, _ in changes)} places; {len(PRIOR)} services keep their earlier wording in PRIOR46')
