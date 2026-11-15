"""Build the Build-tab prototype: merge the live SOW tool's catalog, the canvas map and the research into catalog.json,
then write a self-contained index.html from template.html (fonts and logo inlined, so it works offline and in a preview).

    python3 canvas/build.py

Sources of truth:
- sow/index.html CATALOG: names, hours, units and sources of every line the live tool already has (L01, C01, ...).
- sow/canvas/catalog_map.json: which product or connection each line belongs to, what is on by default, and the plays (products and places).
- sow/canvas/research/*.json: new products, connections and lines researched from Adobe's public docs, each with its source.
A line without a source is left out, so every line on the canvas can be traced to a page.
"""
import base64, glob, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
sys.path.insert(0, SOW)

from review_amendments import apply_catalog
from product_copy import tree as public_copy, runtime as copy_runtime, sow_view, connection_notes, plain
DASHES = re.compile('[–—]')


def clean(s):
    return DASHES.sub(',', s).strip() if isinstance(s, str) else s


def scope_runtime(html):
    marker = '<script id="canvas-scope-runtime">'
    with open(os.path.join(HERE, 'catalog_map.json'), encoding='utf-8') as source:
        presets = {p['id']: {'products': p['products'], 'startingOutside': p.get('ostart', [])}
                   for p in json.load(source)['plays'] if not p.get('custom')}
    with open(os.path.join(HERE, 'scope-choices.js'), encoding='utf-8') as source:
        script = marker + '\n' + source.read() + 'const CanvasPresets = ' + json.dumps(presets) + ';\n</script>'
    if marker in html:
        return re.sub(re.escape(marker) + r'.*?</script>', lambda _: script, html, count=1, flags=re.S)
    anchor = '<script id="capability-references-runtime">'
    assert html.count(anchor) == 1
    return html.replace(anchor, script + '\n' + anchor, 1)


def main():
    html = open(os.path.join(SOW, 'index.html'), encoding='utf-8').read()
    html = scope_runtime(html)
    copy_script = '<script id="product-copy-runtime">\n' + copy_runtime() + '</script>'
    if '<script id="product-copy-runtime">' in html:
        html = re.sub(r'<script id="product-copy-runtime">.*?</script>', lambda _: copy_script, html, count=1, flags=re.S)
    else:
        html = html.replace('<script id="capability-references-runtime">', copy_script + '\n<script id="capability-references-runtime">', 1)
    runtime = '<script id="capability-references-runtime">\n' + open(os.path.join(SOW, 'references.js'), encoding='utf-8').read() + '</script>'
    html = re.sub(r'<script id="capability-references-runtime">.*?</script>', lambda _: runtime, html, count=1, flags=re.S)
    open(os.path.join(SOW, 'index.html'), 'w', encoding='utf-8').write(html)
    live = {x['id']: x for x in json.loads(re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1))}
    cmap = json.load(open(os.path.join(HERE, 'catalog_map.json'), encoding='utf-8'))
    research = [json.load(open(p, encoding='utf-8')) for p in sorted(glob.glob(os.path.join(HERE, 'research', '*.json')))
                if not os.path.basename(p).startswith(('connection_types', 'audit_classification', 'outside_systems'))]

    lines, warnings = {}, []

    def add_live(lid):
        x = live[lid]
        if not x.get('source'):
            warnings.append(f'{lid} has no source in the live tool, left out')
            return False
        lines[lid] = {'id': lid, 'name': clean(x['name']), 'unit': x['unit'], 'low': x['low'], 'base': x['base'], 'high': x['high'],
                      'url': x['source'], 'src': clean(x.get('sourceTitle') or x['source']), 'origin': 'sow'}
        if x.get('references'):
            lines[lid]['references'] = x['references']
        # step 47: the product (ext) and the package (tier) a live service needs, as research lines carry them
        for k in ('ext', 'tier'):
            if x.get(k):
                lines[lid][k] = clean(x[k])
        # the name outside the FSI play, as the SOW steps show it there (their neutral 'fsi' name pairs)
        nname = x['name']
        for o, w in (x.get('neutral') or {}).get('fsi', {}).get('name', []):
            nname = nname.replace(o, w)
        if nname != x['name']:
            lines[lid]['nname'] = clean(nname)
        return True

    types_path = os.path.join(HERE, 'research', 'connection_types.json')
    TYPES = json.load(open(types_path, encoding='utf-8')) if os.path.exists(types_path) else {'connections': {}, 'lines': {}}

    def add_research(r):
        lo = TYPES.get('lines', {}).get(r['id'])
        if lo:
            r = {**r, **{k: v for k, v in lo.items() if k in ('name', 'scope', 'default', 'needs', 'needs_any', 'ext', 'low', 'base', 'high')}}
            if 'url' in lo:
                r['source'] = {'url': lo['url'], 'title': lo['src']}
        for k in ('id', 'name', 'unit', 'low', 'base', 'high'):
            assert k in r, f'research line missing {k}: {r}'
        assert r['unit'] in ('one-time', 'monthly'), r
        if not (r.get('source') or {}).get('url'):
            warnings.append(f"{r['id']} has no source, left out")
            return False
        assert r['id'] not in live and r['id'] not in lines, f"duplicate line id {r['id']}"
        lines[r['id']] = {'id': r['id'], 'name': clean(r['name']), 'unit': r['unit'], 'low': int(r['low']), 'base': int(r['base']),
                          'high': int(r['high']), 'url': r['source']['url'], 'src': clean(r['source'].get('title') or r['source']['url']),
                          'origin': 'research', 'scope': clean(r.get('scope', '')), 'evidence': clean(r.get('evidence', ''))}
        if r.get('needs'):
            lines[r['id']]['needs'] = list(r['needs'])
        if r.get('needs_any'):
            lines[r['id']]['needs_any'] = list(r['needs_any'])
        if r.get('ext'):
            lines[r['id']]['ext'] = clean(r['ext'])
        # step 45: the package a line needs (assume the top package; the tag is the check and the upsell)
        if r.get('tier'):
            lines[r['id']]['tier'] = clean(r['tier'])
        return True

    owners = {}
    products = []
    for p in cmap['products']:
        q = {'id': p['id'], 'name': p['name']}
        q['title'] = p.get('title', p['name'])
        if p.get('icon'):
            q['icon'] = p['icon']
        if p.get('short'):
            q['short'] = p['short']
        # outside systems (step 27): the customer's own systems, offered on a play's canvas, never in a play from the start
        if p.get('outside'):
            q['outside'], q['systems'] = True, clean(p['systems'])
        # step 45: why a system is Recommended
        if p.get('rec'):
            q['rec'] = clean(p['rec'])
        q['lines'] = [l for l in p['lines'] if add_live(l)]
        q['more'] = [l for l in p['more'] if add_live(l)]
        products.append(q)
    connections = []
    for c in cmap['connections']:
        q = {k: c[k] for k in ('id', 'a', 'b')}
        if 'how' in c:
            q['how'], q['source'] = clean(c['how']), {'url': c['source']['url'], 'title': clean(c['source']['title'])}
        if 'gain' in c:
            q['gain'] = {'title': clean(c['gain']['title']), 'text': clean(c['gain']['text'])}
        if 'flows' in c:
            q['flows'] = [{'from': f['from'], 'to': f['to'], 'what': clean(f['what']), 'needs': list(f.get('needs', [])),
                           **({'needs_any': list(f['needs_any'])} if f.get('needs_any') else {}),
                           'source': {'url': f['source']['url'], 'title': clean(f['source']['title'])}} for f in c['flows']]
        q['lines'] = [l for l in c.get('lines', []) if add_live(l)]
        q['more'] = [l for l in c.get('more', []) if add_live(l)]
        connections.append(q)
    pby = {p['id']: p for p in products}
    cby = {c['id']: c for c in connections}

    checked = []
    for r in research:
        checked.append(r.get('checked', ''))
        for rp in r.get('products', []):
            p = pby.get(rp['id'])
            if not p:
                warnings.append(f"research product {rp['id']} is not in catalog_map.json, skipped")
                continue
            for rl in rp.get('lines', []):
                if add_research(rl):
                    (p['lines'] if TYPES.get('lines', {}).get(rl['id'], {}).get('default', rl.get('default')) else p['more']).append(rl['id'])
        for rc in r.get('connections', []):
            c = cby.get(rc['id'])
            if not c:
                if rc['a'] not in pby or rc['b'] not in pby:
                    warnings.append(f"research connection {rc['id']} has a product not in catalog_map.json, skipped")
                    continue
                c = {'id': rc['id'], 'a': rc['a'], 'b': rc['b'], 'lines': [], 'more': []}
                connections.append(c)
                cby[c['id']] = c
            if rc.get('how'):
                c['how'] = clean(rc['how'])
                c['source'] = {'url': rc['source']['url'], 'title': clean(rc['source'].get('title') or rc['source']['url'])}
            if rc.get('gain') and 'gain' not in c:
                c['gain'] = {'title': clean(rc['gain']['title']), 'text': clean(rc['gain']['text'])}
            if rc.get('flows') and 'flows' not in c:
                c['flows'] = [{'from': f['from'], 'to': f['to'], 'what': clean(f['what']), 'needs': list(f.get('needs', [])),
                               **({'needs_any': list(f['needs_any'])} if f.get('needs_any') else {}),
                               'source': {'url': f['source']['url'], 'title': clean(f['source'].get('title') or f['source']['url'])}}
                              for f in rc['flows']]
            if rc.get('no_services'):
                c['no_services'] = True
            for rl in rc.get('lines', []):
                if add_research(rl):
                    (c['lines'] if TYPES.get('lines', {}).get(rl['id'], {}).get('default', rl.get('default')) else c['more']).append(rl['id'])

    # what each connection is (audit, Oct 31 2026): native integration, shared-platform data path, supported extension or
    # partner-designed workflow, with Adobe's availability and the prerequisites; wording corrections ride along
    types = TYPES.get('connections', {})
    for c in connections:
        t = types.get(c['id'])
        if not t:
            continue
        assert t['kind'] in ('native', 'platform', 'extension', 'partner', 'outside'), c['id']
        c['kind'], c['label'] = t['kind'], clean(t['label'])
        # an outside system's connection is labelled Outside system and drawn in the style of its route
        if t['kind'] == 'outside':
            assert t.get('line') in ('native', 'platform'), c['id']
            c['line'] = t['line']
        c['availability'], c['prereqs'] = clean(t.get('availability', '')), [clean(x) for x in t.get('prereqs', [])]
        # step 47: the SOW version of a partner note (a condition with an owner); the card shows the note, the hand-over the SOW version
        if t.get('sow_availability'):
            c['sowAvailability'] = clean(t['sow_availability'])
        if t.get('sow_prereqs'):
            assert all(0 <= int(i) < len(c['prereqs']) for i in t['sow_prereqs']), c['id']
            c['sowPrereqs'] = [clean(t['sow_prereqs'].get(str(i), x)) for i, x in enumerate(c['prereqs'])]
        # step 45: the package a connection needs, and where its work sits when it has no services of its own
        for k in ('tier', 'covered'):
            if t.get(k):
                c[k] = clean(t[k])
        # the evidence quotes stay in research/connection_types.json; the page shows the type, availability and prerequisites
        for k in ('how',):
            if t.get(k):
                c[k] = clean(t[k])
        if t.get('source'):
            c['source'] = {'url': t['source']['url'], 'title': clean(t['source']['title'])}
        if t.get('gain'):
            c['gain'] = {'title': clean(t['gain']['title']), 'text': clean(t['gain']['text'])}
        for i, w in (t.get('flows') or {}).items():
            f = c['flows'][int(i)]
            for k in ('what', 'needs', 'needs_any'):
                if k in w:
                    f[k] = clean(w[k]) if k == 'what' else list(w[k])
            if 'source' in w:
                f['source'] = {'url': w['source']['url'], 'title': clean(w['source']['title'])}

    # keep the products in a play, and the connections between two products of one play
    plays = cmap['plays']
    every = lambda pl: pl['products'] + pl.get('outside', [])
    inplay = {x for pl in plays for x in every(pl)}
    keep_p = [p for p in products if p['id'] in inplay]
    kept = {p['id'] for p in keep_p}
    together = lambda a, b: any(a in every(pl) and b in every(pl) for pl in plays)
    keep_c = [c for c in connections if together(c['a'], c['b']) and (c['lines'] or c['more'] or c.get('no_services')) and c.get('how')]
    for c in connections:
        if c not in keep_c:
            warnings.append(f"connection {c['id']} left out (its products share no play, or no research yet)")
    for p in products:
        if p['id'] not in kept:
            warnings.append(f"product {p['id']} left out (in no play)")

    # each line belongs to one place only
    seen = {}
    for o in keep_p + keep_c:
        for l in o['lines'] + o['more']:
            assert l not in seen, f'{l} is in both {seen[l]} and {o["id"]}'
            seen[l] = o['id']
    for c in keep_c:
        for f in c.get('flows', []):
            assert {f['from'], f['to']} == {c['a'], c['b']}, f"flow on {c['id']} must run between its two products"
            assert all(n in pby for n in f['needs'] + f.get('needs_any', [])), f"flow on {c['id']} needs an unknown product"
    for l in seen:
        assert all(n in pby for n in lines[l].get('needs', []) + lines[l].get('needs_any', [])), f'{l} needs an unknown product'
        o = next(x for x in keep_p + keep_c if x['id'] == seen[l])
        home = [o['id']] if 'a' not in o else [o['a'], o['b']]
        anyof = lines[l].get('needs_any') or [None]
        if not any(set(home + lines[l].get('needs', []) + ([a] if a else [])) <= set(every(pl)) for pl in plays for a in anyof):
            o['lines'] = [x for x in o['lines'] if x != l]
            o['more'] = [x for x in o['more'] if x != l]
            warnings.append(f"{l} left out: it needs {' and '.join(lines[l]['needs'])}, which no play puts with {o['id']}")
    for pl in plays:
        assert set(pl['pos']) == set(pl['products']), f"play {pl['id']} needs a place for each product"
        assert len({tuple(v) for v in pl['pos'].values()}) == len(pl['pos']), f"play {pl['id']} has two products in one place"
        assert set(pl.get('opos', {})) == set(pl.get('outside', []) + pl.get('kept', [])), f"play {pl['id']} needs a place for each outside system and kept product"
        assert all(pby[o].get('outside') for o in pl.get('outside', [])), f"play {pl['id']} lists an outside system that isn't one"
        # step 96: a built play offers outside systems only; 'kept' is an Adobe product a saved canvas keeps, never offered
        assert all(o not in pl.get('outside', []) and not pby[o].get('outside') and o in pl.get('opos', {}) and o not in pl['products'] for o in pl.get('kept', [])), f"play {pl['id']} keeps a product it can't place"
        assert all(o in pl.get('outside', []) for o in pl.get('ostart', []) + pl.get('recommend', [])), f"play {pl['id']} starts or recommends a system it doesn't offer"
        assert len({tuple(v) for v in list(pl['pos'].values()) + list(pl.get('opos', {}).values())}) == len(pl['pos']) + len(pl.get('opos', {})), f"play {pl['id']} puts an outside system on a product's place"
        mine = [o for o in keep_p + keep_c if o['id'] in pl['products'] or (o.get('a') in pl['products'] and o.get('b') in pl['products'])]
        for l in pl.get('on', []):
            assert any(l in o['more'] for o in mine), f"play {pl['id']} turns on {l}, which is not an optional line in the play"
        for l in pl.get('off', []):
            assert any(l in o['lines'] for o in mine), f"play {pl['id']} turns off {l}, which is not a starting line in the play"
        for p in pl['products']:
            if len(pl['products']) > 1 and not any(p in (c['a'], c['b']) for c in mine if 'a' in c):
                warnings.append(f"{p} has no documented connection in play {pl['id']}")
    used = {l: lines[l] for o in keep_p + keep_c for l in o['lines'] + o['more']}
    cat = {'checked': max([c for c in checked if c] or ['']), 'products': keep_p, 'connections': keep_c,
           'lines': used, 'plays': plays}
    apply_catalog(cat)
    cat = plain(sow_view(connection_notes(public_copy(cat))))   # per-connection partner notes, the Client's SOW lines where they differ, then step 86's plain wording
    keep_p, keep_c, used = cat['products'], cat['connections'], cat['lines']
    # step 47: partners see service names, never the internal line IDs, so no shown text may cite one
    ids = re.compile(r'\b(?:' + '|'.join(sorted(map(re.escape, used), key=len, reverse=True)) + r')\b')
    shown = [(p['id'], p.get(k)) for p in keep_p for k in ('name', 'title', 'systems', 'rec')]
    for c in keep_c:
        shown += [(c['id'], c.get(k)) for k in ('how', 'label', 'availability', 'sowAvailability', 'tier', 'covered')]
        shown += [(c['id'], x) for x in c.get('prereqs', []) + c.get('sowPrereqs', []) + [f['what'] for f in c.get('flows', [])]]
        shown += [(c['id'], c['gain'][k]) for k in ('title', 'text') if c.get('gain')]
    shown += [(l, v.get(k)) for l, v in used.items() for k in ('name', 'nname', 'scope', 'ext', 'tier')]
    cited = [(w, ids.search(s).group(0)) for w, s in shown if isinstance(s, str) and ids.search(s)]
    assert not cited, f'shown text cites internal line IDs: {cited}'
    blob = json.dumps(cat, ensure_ascii=False)
    assert not DASHES.search(blob), 'an en or em dash slipped into the catalog'
    open(os.path.join(HERE, 'catalog.json'), 'w', encoding='utf-8').write(json.dumps(cat, ensure_ascii=False, indent=1) + '\n')

    # Opening an older draft directly must use the reviewed concept definitions too.
    # Customer edits live in estimates, separately from these catalog defaults.
    concepts = {}
    for owner in keep_p + keep_c:
        conn = 'a' in owner
        for lid in owner['lines'] + owner['more']:
            line = used[lid]
            if line['origin'] != 'research':
                continue
            refs = [dict(url=line['url'], title=line['src'])] + line.get('references', [])
            if conn:
                refs += [owner.get('source', {})] + owner.get('references', [])
                for flow in owner.get('flows', []):
                    refs += [flow.get('source', {})] + flow.get('references', [])
            assumptions = []
            if conn:
                availability = str(owner.get('sowAvailability') or owner.get('availability') or '')
                if availability:
                    assumptions.append('Availability: ' + availability.rstrip('.') + '.')
                if owner.get('prereqs'):
                    names = {p['id']: p['name'] for p in keep_p}
                    assumptions.append('Prerequisites for ' + names[owner['a']] + ' + ' + names[owner['b']] + ': ' + '; '.join(owner.get('sowPrereqs') or owner['prereqs']).rstrip('.') + '.')
            if line.get('ext'):
                assumptions.append('Also needs ' + line['ext'].rstrip('.') + '.')
            if line.get('tier'):
                assumptions.append('Assumes your client has ' + line['tier'].rstrip('.') + '.')
            concepts[lid] = dict(name=line['name'], scope=line.get('scope', ''), source=line['url'], sourceTitle=line['src'], references=refs, assumptions=' '.join(assumptions))
            if line.get('needs') or line.get('needs_any'):
                concepts[lid]['productPrerequisites'] = {'all': line.get('needs', []), 'any': line.get('needs_any', [])}
            if lid == 'XH11':
                # This service acquired a prerequisite after some drafts were already saved.
                concepts[lid]['activationEndpoints'] = [owner['a'], owner['b']]
    declaration = '<script id="reviewed-concepts">const REVIEW_CONCEPTS=' + json.dumps(concepts, ensure_ascii=False).replace('</', '<\\/') + ';</script>'
    concept_html = open(os.path.join(SOW, 'index.html'), encoding='utf-8').read()
    if '<script id="reviewed-concepts">' in concept_html:
        concept_html = re.sub(r'<script id="reviewed-concepts">.*?</script>', lambda _: declaration, concept_html, count=1, flags=re.S)
    else:
        concept_html = concept_html.replace('<script>const CATALOG=', declaration + '\n<script>const CATALOG=', 1)
    open(os.path.join(SOW, 'index.html'), 'w', encoding='utf-8').write(concept_html)

    tpl = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
    tpl = scope_runtime(tpl)
    if '<script id="product-copy-runtime">' in tpl:
        tpl = re.sub(r'<script id="product-copy-runtime">.*?</script>', lambda _: copy_script, tpl, count=1, flags=re.S)
    else:
        tpl = tpl.replace('<script id="capability-references-runtime">', copy_script + '\n<script id="capability-references-runtime">', 1)
    tpl = re.sub(r'<script id="capability-references-runtime">.*?</script>', lambda _: runtime, tpl, count=1, flags=re.S)
    open(os.path.join(HERE, 'template.html'), 'w', encoding='utf-8').write(tpl)
    b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
    fonts = os.path.join(HERE, 'fonts', 'source-sans-3-latin-{}-normal.woff2')
    # Start from your client's problem (step 40): every product and play a problem names must be on the canvas
    probs = public_copy(json.load(open(os.path.join(HERE, 'problems.json'), encoding='utf-8'))['problems'])
    pids, plids = {p['id'] for p in keep_p}, {p['id'] for p in plays}
    for q in probs:
        assert q['play'] in plids and all(x in pids for x in q['products']), q['id']
        for r in q['refine']:
            assert r.get('play', q['play']) in plids and all(x in pids for x in r['add'] + r.get('remove', [])), (q['id'], r['chip'])
    pblob = json.dumps(probs, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    # step 94: the knowledge explorer below the canvas (ChatGPT's handoff, sow/canvas/knowledge-explorer.*), inlined so the page
    # stays one self-contained file with no new network request
    render_tpl = tpl
    for marker, filename in (('/*KNOWLEDGE_EXPLORER_CSS*/', 'knowledge-explorer.css'), ('/*KNOWLEDGE_EXPLORER_JS*/', 'knowledge-explorer.js'),
                             ('/*KNOWLEDGE_EXPLORER_ADAPTER*/', 'canvas-adapter.js')):
        assert render_tpl.count(marker) == 1, 'Missing or duplicate marker: ' + marker
        asset = open(os.path.join(HERE, filename), encoding='utf-8').read()
        assert ('</script' if filename.endswith('.js') else '</style') not in asset.lower(), 'Unsafe inline asset: ' + filename
        render_tpl = render_tpl.replace(marker, asset)
    # the knowledge base's own counts under the explorer (step 94), from sow/rfp_method.json
    kb = json.load(open(os.path.join(SOW, 'rfp_method.json'), encoding='utf-8'))['services']
    n = lambda k: sum(len(s.get(k) or []) for s in kb.values())
    stat = lambda v, label: '<div><b>' + v + '</b><span>' + label + '</span></div>'
    km = (stat(f"{n('steps'):,}", 'implementation steps') + stat(f"{n('deliverables'):,}", 'defined deliverables') + stat(f"{n('asks'):,}", 'client asks')
          + stat(f"{sum(1 for s in kb.values() if s.get('steps'))} / {len(cat['lines'])}", 'services with method entries'))
    render_tpl = render_tpl.replace('{{KM_STATS}}', km)
    # the SOW step's template wording for the services the catalog keeps no scope for (the explorer shows it)
    sow_src = open(os.path.join(SOW, 'index.html'), encoding='utf-8').read()
    at = sow_src.index('const CATALOG=') + len('const CATALOG=')
    templates, _ = json.JSONDecoder().raw_decode(sow_src[at:])
    tscope = {t['id']: t['scope'] for t in templates if t.get('scope') and t['id'] in cat['lines'] and not cat['lines'][t['id']].get('scope')}
    marker = '/*KM_TEMPLATE_SCOPE*/{}'
    assert render_tpl.count(marker) == 1, marker
    render_tpl = render_tpl.replace(marker, json.dumps(tscope, ensure_ascii=False).replace('</', '<\\/'))
    out = (render_tpl.replace('/*CATALOG*/null', blob).replace('/*PROBLEMS*/null', pblob)
              .replace('{{FONT400}}', b64(fonts.format(400))).replace('{{FONT600}}', b64(fonts.format(600))).replace('{{FONT700}}', b64(fonts.format(700)))
              .replace('{{LOGO}}', b64(os.path.join(SOW, 'adobe_logo.png')))
              .replace('{{VIDEO_POSTER}}', b64(os.path.join(SOW, 'video_poster.jpg'))))
    assert '{{' not in out and '/*CATALOG*/' not in out and '/*PROBLEMS*/' not in out and '/*KNOWLEDGE_EXPLORER_' not in out
    open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
    for w in warnings:
        print('note:', w)
    print(f"built: {len(keep_p)} products, {len(keep_c)} connections, {len(used)} lines, {len(plays)} plays")


if __name__ == '__main__':
    main()
