"""Build the Build-tab prototype: merge the live SOW tool's catalog, the canvas map and the research into catalog.json,
then write a self-contained index.html from template.html (fonts and logo inlined, so it works offline and in a preview).

    python3 sow/canvas/build.py

Sources of truth:
- sow/index.html CATALOG: names, hours, units and sources of every line the live tool already has (L01, C01, ...).
- sow/canvas/catalog_map.json: which product or connection each line belongs to, what is on by default, and the plays (products and places).
- sow/canvas/research/*.json: new products, connections and lines researched from Adobe's public docs, each with its source.
A line without a source is left out, so every line on the canvas can be traced to a page.
"""
import base64, glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
ROOT = os.path.dirname(SOW)
DASHES = re.compile('[–—]')


def clean(s):
    return DASHES.sub(',', s).strip() if isinstance(s, str) else s


def main():
    html = open(os.path.join(SOW, 'index.html'), encoding='utf-8').read()
    live = {x['id']: x for x in json.loads(re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1))}
    cmap = json.load(open(os.path.join(HERE, 'catalog_map.json'), encoding='utf-8'))
    research = [json.load(open(p, encoding='utf-8')) for p in sorted(glob.glob(os.path.join(HERE, 'research', '*.json')))]

    lines, warnings = {}, []

    def add_live(lid):
        x = live[lid]
        if not x.get('source'):
            warnings.append(f'{lid} has no source in the live tool, left out')
            return False
        lines[lid] = {'id': lid, 'name': clean(x['name']), 'unit': x['unit'], 'low': x['low'], 'base': x['base'], 'high': x['high'],
                      'url': x['source'], 'src': clean(x.get('sourceTitle') or x['source']), 'origin': 'sow'}
        return True

    def add_research(r):
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
                    (p['lines'] if rl.get('default') else p['more']).append(rl['id'])
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
                    (c['lines'] if rl.get('default') else c['more']).append(rl['id'])

    # what each connection is (audit, Oct 31 2026): native integration, shared-platform data path, supported extension or
    # partner-designed workflow, with Adobe's availability and the prerequisites; wording corrections ride along
    types_path = os.path.join(HERE, 'research', 'connection_types.json')
    types = json.load(open(types_path, encoding='utf-8'))['connections'] if os.path.exists(types_path) else {}
    for c in connections:
        t = types.get(c['id'])
        if not t:
            continue
        assert t['kind'] in ('native', 'platform', 'extension', 'partner'), c['id']
        c['kind'], c['label'] = t['kind'], clean(t['label'])
        c['availability'], c['prereqs'] = clean(t.get('availability', '')), [clean(x) for x in t.get('prereqs', [])]
        if t.get('evidence'):
            c['evidence'] = [{'url': e['url'], 'quote': clean(e['quote'])} for e in t['evidence']]
        for k in ('how',):
            if t.get(k):
                c[k] = clean(t[k])
        if t.get('gain'):
            c['gain'] = {'title': clean(t['gain']['title']), 'text': clean(t['gain']['text'])}
        for i, w in (t.get('flows') or {}).items():
            f = c['flows'][int(i)]
            for k in ('what', 'needs', 'needs_any'):
                if k in w:
                    f[k] = clean(w[k]) if k == 'what' else list(w[k])

    # keep the products in a play, and the connections between two products of one play
    plays = cmap['plays']
    inplay = {x for pl in plays for x in pl['products']}
    keep_p = [p for p in products if p['id'] in inplay]
    kept = {p['id'] for p in keep_p}
    together = lambda a, b: any(a in pl['products'] and b in pl['products'] for pl in plays)
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
        if not any(set(home + lines[l].get('needs', []) + ([a] if a else [])) <= set(pl['products']) for pl in plays for a in anyof):
            o['lines'] = [x for x in o['lines'] if x != l]
            o['more'] = [x for x in o['more'] if x != l]
            warnings.append(f"{l} left out: it needs {' and '.join(lines[l]['needs'])}, which no play puts with {o['id']}")
    for pl in plays:
        assert set(pl['pos']) == set(pl['products']), f"play {pl['id']} needs a place for each product"
        assert len({tuple(v) for v in pl['pos'].values()}) == len(pl['pos']), f"play {pl['id']} has two products in one place"
        mine = [o for o in keep_p + keep_c if o['id'] in pl['products'] or (o.get('a') in pl['products'] and o.get('b') in pl['products'])]
        for l in pl.get('on', []):
            assert any(l in o['more'] for o in mine), f"play {pl['id']} turns on {l}, which is not an optional line in the play"
        for p in pl['products']:
            if len(pl['products']) > 1 and not any(p in (c['a'], c['b']) for c in mine if 'a' in c):
                warnings.append(f"{p} has no documented connection in play {pl['id']}")
    used = {l: lines[l] for o in keep_p + keep_c for l in o['lines'] + o['more']}
    cat = {'checked': max([c for c in checked if c] or ['']), 'products': keep_p, 'connections': keep_c,
           'lines': used, 'plays': plays}
    blob = json.dumps(cat, ensure_ascii=False)
    assert not DASHES.search(blob), 'an en or em dash slipped into the catalog'
    open(os.path.join(HERE, 'catalog.json'), 'w', encoding='utf-8').write(json.dumps(cat, ensure_ascii=False, indent=1) + '\n')

    tpl = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
    b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
    fonts = os.path.join(ROOT, 'video', 'fonts', 'source-sans-3-latin-{}-normal.woff2')
    out = (tpl.replace('/*CATALOG*/null', blob)
              .replace('{{FONT400}}', b64(fonts.format(400))).replace('{{FONT600}}', b64(fonts.format(600))).replace('{{FONT700}}', b64(fonts.format(700)))
              .replace('{{LOGO}}', b64(os.path.join(SOW, 'adobe_logo.png'))))
    assert '{{' not in out and '/*CATALOG*/' not in out
    open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(out)
    for w in warnings:
        print('note:', w)
    print(f"built: {len(keep_p)} products, {len(keep_c)} connections, {len(used)} lines, {len(plays)} plays")


if __name__ == '__main__':
    main()
