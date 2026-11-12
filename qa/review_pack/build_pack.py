#!/usr/bin/env python3
"""A pack for an outside model to check the catalog (Nov 12 2026, Adam: "I wanted to run by it what we've found in
Experience League ... and see if it can QA all of the integrations and services ... and make sure we're not missing
anything. ... I was just going to upload my latest files to it. Can you give me some kind of prompt").

Writes sow/qa/review_pack/out/: catalog_for_review.json (the catalog with only what a reviewer needs: every product's
services and every connection, each with its Adobe page and the quote it rests on) and PROMPT.md. Everything in it comes
from public Adobe pages plus our own hour estimates; nothing internal is included.

Run from the repo root: python3 sow/qa/review_pack/build_pack.py"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
from lib import templates, scope_of   # the 42 template services keep their description in the SOW tool, not in catalog.json
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)
c = json.load(open(os.path.join(SOW, 'canvas', 'catalog.json'), encoding='utf-8'))
L = c['lines']
PUBLIC = ('experienceleague.adobe.com', 'helpx.adobe.com', 'www.aem.live', 'developer.adobe.com', 'business.adobe.com')


def service(i, starting):
    l = L[i]
    host = re.sub(r'^https?://([^/]+).*', r'\1', l['url'])
    assert host in PUBLIC, (i, host)
    t = templates().get(i, {})
    extra = {k: t[k] for k in ('deliverable', 'assumptions') if t.get(k)}
    return {'id': i, 'name': l['name'], 'what_the_partner_does': scope_of(i), **extra, 'billing': l['unit'],
            'hours_small_typical_large': [int(l['low']), int(l['base']), int(l['high'])], 'starts_selected': starting,
            'adobe_page': {'title': l.get('src', ''), 'url': l['url']}, 'quote_it_rests_on': l.get('evidence', '')}


def services(o):
    return [service(i, True) for i in o.get('lines', []) if i in L] + [service(i, False) for i in o.get('more', []) if i in L]


name = {p['id']: p['name'] for p in c['products']}
products = [{'id': p['id'], 'name': p['name'], 'kind': 'outside system (not Adobe)' if p.get('outside') else 'Adobe product', 'services': services(p)} for p in c['products']]
connections = []
for k in c['connections']:
    refs = [k['source']] + [r for r in k.get('references', []) if r.get('url') != k['source'].get('url')]
    for r in refs:
        assert re.sub(r'^https?://([^/]+).*', r'\1', r['url']) in PUBLIC, (k['id'], r['url'])
    connections.append({'id': k['id'], 'between': [name[k['a']], name[k['b']]], 'type': k.get('kind', ''), 'one_line': k.get('label', ''), 'how_it_works': k.get('how', ''),
                        'what_must_be_true_first': k.get('prereqs', []), 'availability_as_adobe_states_it': k.get('availability', ''),
                        'adobe_pages': [{'title': r.get('title', ''), 'url': r['url']} for r in refs], 'services': services(k)})
pack = {
    'about': 'Catalog of the Adobe partner statement-of-work tool, exported for review on 2026-11-12. Sources checked up to ' + str(c['checked']) + '. Hours are our own planning estimates; Adobe publishes none.',
    'counts': {'adobe_products': sum(1 for p in products if p['kind'] == 'Adobe product'), 'outside_systems': sum(1 for p in products if p['kind'] != 'Adobe product'), 'connections': len(connections), 'services': len(L)},
    'left_out_on_purpose': [
        'Adobe Campaign, Adobe Advertising, Audience Manager, AEM Guides, AEM Screens, Adobe Learning Manager, Firefly Foundry, GenStudio for Commerce Media Networks: not in the catalog by decision.',
        'Brand Visibility with Adobe Analytics: Adobe documents it; we show no connection by decision (Brand Visibility is paired with Customer Journey Analytics).',
        'Semrush and other third-party SEO suites: left out by decision.',
        'Anything Adobe labels beta, early access, limited availability, labs or coming soon: left out by decision, and no such label is shown. Marketo Optimizer and Firefly Custom Models are included with no label by decision.',
        'Adobe Consulting Services, software prices and license fees: never mentioned by decision.',
        'Connections between Coworker and the wave 3 products (Adobe Analytics, Marketo Measure, Acrobat, Acrobat Sign): skipped by decision.',
    ],
    'connection_types': {'native': 'a documented product-to-product integration', 'platform': 'works through Adobe Experience Platform', 'extension': 'needs an add-on, extension or app', 'outside': 'connects to a non-Adobe system', 'partner': 'no Adobe integration: a partner designs and builds it'},
    'products': products, 'connections': connections,
}
assert all(s['what_the_partner_does'] for o in products + connections for s in o['services']), 'every service says what the partner does'
assert pack['counts']['services'] == sum(len(p['services']) for p in products) + sum(len(k['services']) for k in connections), 'every service sits under one product or one connection'
json.dump(pack, open(os.path.join(OUT, 'catalog_for_review.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('catalog_for_review.json', os.path.getsize(os.path.join(OUT, 'catalog_for_review.json')), 'bytes', pack['counts'])
