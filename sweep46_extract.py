"""Step 46, part 1: list every "customer" a partner reads on the canvas and the SOW steps, for the client sweep.
Writes sweep46_occurrences.json (one entry per distinct wording, with every place it appears). Left out on purpose:
the earlier-wording records (PRIOR*, PREVIOUS_SCOPES: saved engagements are matched against them), Adobe's quotes and
page titles, source URLs, research notes, and the problem box's match keywords (partners may type "customer").

    python3 sow/sweep46_extract.py
"""
import glob, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
CAN = os.path.join(HERE, 'canvas')
SPAN = re.compile(r"\b(?:(?:the|The|a|A|an|An|your|Your|each|Each|every|Every|that|That|this|This)\s+)?(?:customers?|Customers?|clients?|Clients?)(?:'s|\\'s)?\b")
occ = {}


def add(key, text, s, e, where):
    w = (text[max(0, s - 160):s], text[s:e], text[e:e + 160])
    k = '|'.join(w)
    o = occ.setdefault(k, {'before': w[0], 'match': w[1], 'after': w[2], 'where': [], 'kind': key})
    o['where'].append(where)


# 1. the SOW steps: the catalog (every text field, the bands and the neutral pairs)
html = open(os.path.join(HERE, 'index.html'), encoding='utf-8').read()
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
cat = json.loads(m.group(1))
SKIP = {'source', 'source2', 'sourceTitle', 'sourceTitle2', 'id', 'outside', 'stage', 'unit', 'plays'}


def walk(o, path, kind):
    if isinstance(o, dict):
        for k, v in o.items():
            if k not in SKIP:
                walk(v, path + [k], kind)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk(v, path + [i], kind)
    elif isinstance(o, str):
        for x in SPAN.finditer(o):
            add(kind, o, x.start(), x.end(), {'file': 'sow/index.html', 'catalog': path, 'at': [x.start(), x.end()]})


for c in cat:
    walk(c, [c['id']], 'sow_document')
# 2. the SOW steps' page and script, outside the catalog and the earlier-wording records
rest_spans = [(m.start(), m.end())]
for r in re.finditer(r'const (PRIOR\w*|PREVIOUS_SCOPES)=', html):
    j = html.index(';\n', r.start())
    rest_spans.append((r.start(), j))
for x in SPAN.finditer(html):
    if any(a <= x.start() < b for a, b in rest_spans):
        continue
    # code: a property (state.customer), an object key (customer:'' after a comma or a brace) or a call; a sentence
    # ending in "the customer:" is text
    if html[x.start() - 1] == '.' or html[x.end():x.end() + 1] == '(' or (html[x.end():x.end() + 1] == ':' and html[x.start() - 1] in ',{'):
        continue
    add('sow_page', html, x.start(), x.end(), {'file': 'sow/index.html', 'offset': [x.start(), x.end()]})

# 3. the canvas: the page and the data fields it shows
tpl = open(os.path.join(CAN, 'template.html'), encoding='utf-8').read()
for x in SPAN.finditer(tpl):
    add('canvas_page', tpl, x.start(), x.end(), {'file': 'sow/canvas/template.html', 'offset': [x.start(), x.end()]})
SHOWN = {'how', 'label', 'availability', 'prereqs', 'text', 'what', 'name', 'scope', 'systems', 'sub', 'title_play', 'rec', 'covered', 'tier', 'why', 'problem', 'chip', 'note', 'answer'}


def walk2(o, path, f):
    if isinstance(o, dict):
        for k, v in o.items():
            walk2(v, path + [k], f)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk2(v, path + [i], f)
    elif isinstance(o, str):
        keys = [p for p in path if isinstance(p, str)]
        # step 47: client and clients are listed too, and a connection's gain title
        if not keys or (keys[-1] not in SHOWN and not (keys[-1] == 'title' and 'gain' in keys)) or 'keywords' in keys or 'evidence' in keys:
            return
        for x in SPAN.finditer(o):
            add('canvas_data', o, x.start(), x.end(), {'file': f, 'path': path, 'at': [x.start(), x.end()]})


for f in ['catalog_map.json', 'problems.json'] + [os.path.relpath(p, CAN) for p in sorted(glob.glob(os.path.join(CAN, 'research', '*.json')))]:
    if os.path.basename(f).startswith(('audit_classification', 'outside_systems', 'content_analytics_recheck')):
        continue
    d = json.load(open(os.path.join(CAN, f), encoding='utf-8'))
    walk2(d, [], 'sow/canvas/' + f)
items = []
for i, (k, o) in enumerate(occ.items()):
    o['id'] = f'c{i:04d}'
    items.append(o)
json.dump(items, open(os.path.join(HERE, 'sweep46_occurrences.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(items), 'distinct wordings,', sum(len(o['where']) for o in items), 'places;', Counter(o['kind'] for o in items))
