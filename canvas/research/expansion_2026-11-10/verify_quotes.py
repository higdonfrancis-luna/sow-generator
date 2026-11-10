"""Check every quote in this folder's family files against the page it cites (Nov 10 2026). Each page is downloaded once,
its tags stripped and its spacing collapsed, and the quote must be there word for word. Run from the repo root:

    python3 sow/canvas/research/expansion_2026-11-10/verify_quotes.py

Prints one line per quote that is not found, then a count. Pages are kept in a cache folder beside the system temp files,
not in the repo. Only the hosts this session may read are fetched; nothing is done to get around a blocked host.
"""
import hashlib
import html
import json
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(tempfile.gettempdir(), 'expansion_pages')
os.makedirs(CACHE, exist_ok=True)
FAMILIES = ['aem_documents', 'genstudio_creative', 'platform_data_campaign', 'brand_visibility_side']
BLOCKED = ('business.adobe.com', 'www.adobe.com')

def norm(s):
    s = html.unescape(s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace(' ', ' ').replace('​', '')
    return re.sub(r'\s+', ' ', s).strip().lower()

def page(url):
    url = url.split('#')[0]
    f = os.path.join(CACHE, hashlib.sha1(url.encode()).hexdigest() + '.html')
    if not os.path.exists(f) or os.path.getsize(f) < 500:
        subprocess.run(['curl', '-sS', '-L', '-m', '45', '-o', f, url], capture_output=True)
    if not os.path.exists(f):
        return ''
    t = open(f, encoding='utf-8', errors='ignore').read()
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S | re.I)
    return norm(re.sub(r'<[^>]+>', ' ', t))

def quotes(node, path=''):
    """Every {url, quote} pair anywhere in a product entry."""
    if isinstance(node, dict):
        if node.get('quote') and node.get('url'):
            yield path, node
        for k, v in node.items():
            yield from quotes(v, f'{path}.{k}' if path else k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from quotes(v, f'{path}[{i}]')

ok = bad = skipped = 0
for fam in FAMILIES:
    f = os.path.join(HERE, fam + '.json')
    if not os.path.exists(f):
        print('missing', fam)
        continue
    for p in json.load(open(f, encoding='utf-8'))['products']:
        for path, q in quotes(p):
            host = q['url'].split('/')[2] if '//' in q['url'] else ''
            if host in BLOCKED:
                skipped += 1
                print(f'NOT READ  {fam} {p["id"]} {path}: {host} is blocked here')
                continue
            text = page(q['url'])
            want = norm(q['quote'])
            # a quote may join two passages with an ellipsis: each part must be on the page
            parts = [x.strip() for x in re.split(r'\s*(?:\.\.\.|…|\[\.\.\.\])\s*', want) if len(x.strip()) > 12]
            if parts and all(x in text for x in parts):
                ok += 1
            else:
                bad += 1
                print(f'NOT FOUND {fam} {p["id"]} {path} claimed={q.get("verified")}\n    {q["url"]}\n    {q["quote"][:220]}')
print(f'{ok} quotes found on their pages, {bad} not found, {skipped} on hosts this session cannot read')
sys.exit(1 if bad else 0)
