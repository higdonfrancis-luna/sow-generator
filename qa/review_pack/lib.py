"""Shared helpers for checking the catalog against Adobe's pages (Nov 12 2026).

- catalog(): sow/canvas/catalog.json.
- templates(): the SOW tool's template services (sow/index.html, const CATALOG), which hold the description of the 42
  services the canvas catalog lists by name and hours only.
- scope_of(id): what the partner does for a service, wherever it is written.
- fetch(url): the page as Adobe serves it now: its HTTP status, where it ended up after redirects, and its text with the
  tags stripped and spacing collapsed. Pages are cached outside the repo. Only hosts this session may read are fetched.
- has(text, quote): is the quote on the page word for word (quotes, dashes and spacing normalized; an ellipsis joins parts).
"""
import hashlib
import html
import json
import os
import re
import subprocess
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(tempfile.gettempdir(), 'review_pack_pages')
os.makedirs(CACHE, exist_ok=True)
BLOCKED = ('business.adobe.com', 'www.adobe.com')
_cat = _tpl = None


def catalog():
    global _cat
    if _cat is None:
        _cat = json.load(open(os.path.join(SOW, 'canvas', 'catalog.json'), encoding='utf-8'))
    return _cat


def templates():
    global _tpl
    if _tpl is None:
        s = open(os.path.join(SOW, 'index.html'), encoding='utf-8').read()
        arr, _ = json.JSONDecoder().raw_decode(s, s.index('[', s.index('const CATALOG')))
        _tpl = {t['id']: t for t in arr}
    return _tpl


def scope_of(i):
    l = catalog()['lines'][i]
    t = templates().get(i, {})
    return l.get('scope') or t.get('scope') or ''


def norm(s):
    s = html.unescape(s)
    for a, b in (('’', "'"), ('‘', "'"), ('“', '"'), ('”', '"'), (' ', ' '), ('​', ''), ('–', '-'), ('—', '-'), ('‑', '-')):
        s = s.replace(a, b)
    return re.sub(r'\s+', ' ', s).strip().lower()


def fetch(url):
    """-> {'status': int, 'final': str, 'text': str, 'blocked': bool}"""
    url = url.split('#')[0]
    host = url.split('/')[2] if '//' in url else ''
    if host in BLOCKED:
        return {'status': 0, 'final': url, 'text': '', 'blocked': True}
    key = hashlib.sha1(url.encode()).hexdigest()
    f, m = os.path.join(CACHE, key + '.html'), os.path.join(CACHE, key + '.meta')
    if not (os.path.exists(f) and os.path.exists(m) and os.path.getsize(f) > 500):
        r = subprocess.run(['curl', '-sS', '-L', '-m', '60', '-o', f, '-w', '%{http_code} %{url_effective}', url], capture_output=True, text=True)
        open(m, 'w').write(r.stdout.strip() or '0 ' + url)
    status, final = (open(m).read().split(' ', 1) + [url])[:2]
    t = open(f, encoding='utf-8', errors='ignore').read() if os.path.exists(f) else ''
    t = re.sub(r'<script.*?</script>|<style.*?</style>|<!--.*?-->', ' ', t, flags=re.S | re.I)
    return {'status': int(status) if status.isdigit() else 0, 'final': final, 'text': norm(re.sub(r'<[^>]+>', ' ', t)), 'blocked': False}


def has(text, quote):
    want = norm(quote)
    parts = [x.strip() for x in re.split(r'\s*(?:\.\.\.|…|\[\.\.\.\])\s*', want) if len(x.strip()) > 8]
    return bool(parts) and all(x in text for x in parts)
