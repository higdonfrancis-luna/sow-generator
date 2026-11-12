#!/usr/bin/env python3
"""Every link and every stored quote in the catalog, against Adobe's pages as they are served now (Nov 12 2026).

For each of the 517 services: does its page answer, does it redirect, and is the quote the service rests on still on the
page word for word. For each of the 150 connections: do its pages answer. Writes out/link_quote_check.json and prints a
summary. Run from the repo root (a few minutes the first time; pages are cached):

    python3 sow/qa/review_pack/check_all.py
"""
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import catalog, fetch, has, HERE

c = catalog()
L = c['lines']
urls = sorted({l['url'].split('#')[0] for l in L.values()} | {r['url'].split('#')[0] for k in c['connections'] for r in [k['source']] + k.get('references', [])})
with ThreadPoolExecutor(8) as ex:
    pages = dict(zip(urls, ex.map(fetch, urls)))


def link(u):
    p = pages[u.split('#')[0]]
    moved = p['final'].rstrip('/') != u.split('#')[0].rstrip('/')
    return {'url': u, 'status': p['status'], 'final': p['final'] if moved else '', 'blocked': p['blocked'], 'empty': len(p['text']) < 400}


services = []
for i, l in L.items():
    r = dict(id=i, name=l['name'], origin=l['origin'], **link(l['url']))
    r['quote'] = l.get('evidence', '')
    r['quote_found'] = None if not r['quote'] or r['blocked'] else has(pages[l['url'].split('#')[0]]['text'], r['quote'])
    services.append(r)
connections = [{'id': k['id'], 'pages': [link(r['url']) for r in [k['source']] + k.get('references', [])]} for k in c['connections']]
out = {'services': services, 'connections': connections}
json.dump(out, open(os.path.join(HERE, 'out', 'link_quote_check.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

bad = [s for s in services if s['status'] != 200 and not s['blocked']]
moved = [s for s in services if s['final']]
missing = [s for s in services if s['quote_found'] is False]
noquote = [s for s in services if not s['quote']]
cbad = [(k['id'], p) for k in connections for p in k['pages'] if p['status'] != 200 and not p['blocked']]
cmoved = [(k['id'], p) for k in connections for p in k['pages'] if p['final']]
print(f"{len(urls)} pages read. Services: {len(services)}; page not answering {len(bad)}; redirected {len(moved)}; quote stored {len(services) - len(noquote)}, of which not on the page now {len(missing)}; no quote stored {len(noquote)}.")
print(f"Connection pages: not answering {len(cbad)}; redirected {len(cmoved)}.")
for s in bad:
    print('NOT ANSWERING', s['id'], s['status'], s['url'])
for s in moved:
    print('REDIRECTED   ', s['id'], s['url'], '->', s['final'])
for s in missing:
    print('QUOTE GONE   ', s['id'], '|', s['quote'][:110], '|', s['url'])
for i, p in cbad:
    print('CONNECTION PAGE NOT ANSWERING', i, p['status'], p['url'])
for i, p in cmoved:
    print('CONNECTION PAGE REDIRECTED   ', i, p['url'], '->', p['final'])
