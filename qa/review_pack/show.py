#!/usr/bin/env python3
"""Print catalog entries as the tool holds them. Run from the repo root:

    python3 sow/qa/review_pack/show.py RT05 rtcdp-target cja      # services, connections or products, by id
    python3 sow/qa/review_pack/show.py --find "recommendations"   # every service or connection whose text has the words
    python3 sow/qa/review_pack/show.py --between rtcdp crm        # the connection between two products, if there is one
    python3 sow/qa/review_pack/show.py --ids                      # every product and connection id
"""
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import catalog, templates, scope_of

c = catalog()
L = c['lines']
P = {p['id']: p for p in c['products']}
K = {k['id']: k for k in c['connections']}


def owner(i):
    for p in c['products']:
        if i in p.get('lines', []) + p.get('more', []):
            return 'product ' + p['id'] + ' (' + p['name'] + ')'
    for k in c['connections']:
        if i in k.get('lines', []) + k.get('more', []):
            return 'connection ' + k['id']
    return 'no owner'


def service(i, indent=''):
    l, t = L[i], templates().get(i, {})
    starting = any(i in o.get('lines', []) for o in c['products'] + c['connections'])
    print(f"{indent}SERVICE {i}: {l['name']}  [{l['unit']}; hours {l['low']}/{l['base']}/{l['high']}; {'starts selected' if starting else 'optional'}; under {owner(i)}]")
    print(f"{indent}  what the partner does: {scope_of(i) or '(none written)'}")
    for k in ('deliverable', 'assumptions', 'basis'):
        if t.get(k):
            print(f"{indent}  {k}: {t[k] if isinstance(t[k], str) else json.dumps(t[k])}")
    print(f"{indent}  Adobe page: {l.get('src', '')} | {l['url']}")
    print(f"{indent}  quote it rests on: {l.get('evidence') or '(none stored)'}")


def connection(i):
    k = K[i]
    print(f"CONNECTION {i}: {P[k['a']]['name']} + {P[k['b']]['name']}  [type {k.get('kind')}]")
    for f in ('label', 'how', 'availability'):
        print(f"  {f}: {k.get(f, '')}")
    print('  prerequisites:', json.dumps(k.get('prereqs', []), ensure_ascii=False))
    print('  Adobe pages:', json.dumps([k.get('source')] + k.get('references', []), ensure_ascii=False))
    for s in k.get('lines', []) + k.get('more', []):
        if s in L:
            service(s, '  ')


def product(i):
    p = P[i]
    print(f"PRODUCT {i}: {p['name']}  [{'outside system' if p.get('outside') else 'Adobe product'}]")
    print('  connections:', ', '.join(k['id'] for k in c['connections'] if i in (k['a'], k['b'])))
    for s in p.get('lines', []) + p.get('more', []):
        if s in L:
            service(s, '  ')


a = sys.argv[1:]
if not a:
    print(__doc__)
elif a[0] == '--ids':
    print('products:', ', '.join(f"{p['id']}={p['name']}" for p in c['products']))
    print('connections:', ', '.join(sorted(K)))
elif a[0] == '--between':
    hits = [k['id'] for k in c['connections'] if {k['a'], k['b']} == set(a[1:3])]
    print('connection:', hits or 'none in the catalog')
    for h in hits:
        connection(h)
elif a[0] == '--find':
    words = [w.lower() for w in a[1:]]
    for i, l in L.items():
        text = (l['name'] + ' ' + scope_of(i) + ' ' + l.get('evidence', '')).lower()
        if all(w in text for w in words):
            service(i)
    for k in c['connections']:
        text = json.dumps(k, ensure_ascii=False).lower()
        if all(w in text for w in words):
            print('CONNECTION', k['id'], '|', k.get('label', ''))
else:
    for i in a:
        if i in L:
            service(i)
        elif i in K:
            connection(i)
        elif i in P:
            product(i)
        else:
            print(i, ': not in the catalog')
        print()
