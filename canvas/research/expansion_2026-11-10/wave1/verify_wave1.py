"""Check every quote in the wave 1 recheck files against the page it cites (Nov 10 2026), the way ../verify_quotes.py does:
each page is downloaded once, its tags stripped and its spacing collapsed, and the quote must be there word for word.
A service's quote is its `evidence`, on its `source.url`. Run from the repo root:

    python3 sow/canvas/research/expansion_2026-11-10/wave1/verify_wave1.py [file.json ...]

With no file named it checks the two recheck files in this folder. Entries marked "verified": false (a page this session
cannot open) are counted and listed, not fetched. Nothing is done to get around a blocked host.
"""
import hashlib, html, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(tempfile.gettempdir(), 'expansion_pages')
os.makedirs(CACHE, exist_ok=True)
BLOCKED = ('business.adobe.com', 'www.adobe.com')
FILES = sys.argv[1:] or [os.path.join(HERE, f) for f in ('portal_acquisition_insights.json', 'portal_omnichannel_b2b.json')]


def norm(s):
    s = html.unescape(s)
    for a, b in (('’', "'"), ('‘', "'"), ('“', '"'), ('”', '"'), (' ', ' '), ('​', ''), ('‑', '-')):
        s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip().lower()


def page(url):
    url = url.split('#')[0]
    f = os.path.join(CACHE, hashlib.sha1(url.encode()).hexdigest() + '.html')
    if not os.path.exists(f) or os.path.getsize(f) < 500:
        subprocess.run(['curl', '-sS', '-L', '-m', '45', '-o', f, url], capture_output=True)
    t = open(f, encoding='utf-8', errors='ignore').read() if os.path.exists(f) else ''
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S | re.I)
    return norm(re.sub(r'<[^>]+>', ' ', t))


def pairs(node, path=''):
    """Every (url, quote) in the file: a {url, quote} object anywhere, and a service's evidence on its source."""
    if isinstance(node, dict):
        if node.get('quote') and node.get('url'):
            yield path, node['url'], node['quote'], node.get('verified')
        if node.get('evidence') and isinstance(node.get('source'), dict) and node['source'].get('url'):
            yield path + '.evidence', node['source']['url'], node['evidence'], None
        for k, v in node.items():
            yield from pairs(v, f'{path}.{k}' if path else k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from pairs(v, f'{path}[{(v.get("id") if isinstance(v, dict) else None) or i}]')


ok = bad = skipped = 0
for f in FILES:
    for path, url, quote, verified in pairs(json.load(open(f, encoding='utf-8'))):
        host = url.split('/')[2] if '//' in url else ''
        if host in BLOCKED or verified is False:
            skipped += 1
            print(f'NOT READ  {os.path.basename(f)} {path}: {host}')
            continue
        want = norm(quote)
        parts = [x.strip() for x in re.split(r'\s*(?:\.\.\.|…|\[\.\.\.\])\s*', want) if len(x.strip()) > 12] or [want]
        if all(x in page(url) for x in parts):
            ok += 1
        else:
            bad += 1
            print(f'NOT FOUND {os.path.basename(f)} {path}\n    {url}\n    {quote[:200]}')
print(f'{ok} quotes found on their pages, {bad} not found, {skipped} on pages this session cannot read')
sys.exit(1 if bad else 0)
