"""Build the Build-tab prototype: merge the live SOW tool's catalog, the canvas map and the research into catalog.json,
then write a self-contained index.html from template.html (fonts and logo inlined, so it works offline and in a preview).

    python3 sow/canvas/build.py

Sources of truth:
- sow/index.html CATALOG: names, hours, units and sources of every line the live tool already has (L01, C01, ...).
- sow/canvas/catalog_map.json: which product or connection each line belongs to, what is on by default, positions, plays.
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
        return True

    owners = {}
    products = []
    for p in cmap['products']:
        q = {k: p[k] for k in ('id', 'name', 'group', 'pos') if k in p}
        q['title'] = p.get('title', p['name'])
        if p.get('icon'):
            q['icon'] = p['icon']
        q['lines'] = [l for l in p['lines'] if add_live(l)]
        q['more'] = [l for l in p['more'] if add_live(l)]
        products.append(q)
    connections = []
    for c in cmap['connections']:
        q = {k: c[k] for k in ('id', 'a', 'b', 'route')}
        if 'how' in c:
            q['how'], q['source'] = clean(c['how']), {'url': c['source']['url'], 'title': clean(c['source']['title'])}
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
            assert p, f"research product {rp['id']} is not in catalog_map.json"
            for rl in rp.get('lines', []):
                if add_research(rl):
                    (p['lines'] if rl.get('default') else p['more']).append(rl['id'])
        for rc in r.get('connections', []):
            c = cby.get(rc['id'])
            if not c:
                c = {'id': rc['id'], 'a': rc['a'], 'b': rc['b'], 'route': 'h', 'lines': [], 'more': []}
                connections.append(c)
                cby[c['id']] = c
            c['how'] = clean(rc['how'])
            c['source'] = {'url': rc['source']['url'], 'title': clean(rc['source'].get('title') or rc['source']['url'])}
            for rl in rc.get('lines', []):
                if add_research(rl):
                    (c['lines'] if rl.get('default') else c['more']).append(rl['id'])

    # keep only products and connections that have something to show
    keep_p = [p for p in products if p['lines'] or p['more'] or any(c['lines'] and p['id'] in (c['a'], c['b']) for c in connections)]
    kept = {p['id'] for p in keep_p}
    keep_c = [c for c in connections if c['a'] in kept and c['b'] in kept and (c['lines'] or c['more']) and c.get('how')]
    for c in connections:
        if c not in keep_c:
            warnings.append(f"connection {c['id']} left out (no research yet or a product missing)")
    for p in products:
        if p['id'] not in kept:
            warnings.append(f"product {p['id']} left out (no services yet)")

    # each line belongs to one place only
    seen = {}
    for o in keep_p + keep_c:
        for l in o['lines'] + o['more']:
            assert l not in seen, f'{l} is in both {seen[l]} and {o["id"]}'
            seen[l] = o['id']
    plays = [pl for pl in cmap['plays'] if all(x in kept for x in pl['products'])]
    used = {l: lines[l] for l in seen}
    cat = {'checked': max([c for c in checked if c] or ['']), 'groups': cmap['groups'], 'products': keep_p, 'connections': keep_c,
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
