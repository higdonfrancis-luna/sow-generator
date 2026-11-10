"""Checks research facts against Adobe's live pages. Usage: python3 verify.py facts.json
facts.json: {"facts": [{"key": "...", "product": "...", "url": "https://...", "title": "...", "quote": "...", "supports": "..."}]}
Each quote must appear word for word (case and whitespace aside) in the page's visible text. Pages are cached in ../pages/."""
import hashlib, html, json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); PAGES = os.path.join(HERE, '..', 'pages')
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
def norm(t):
    t = str(t).replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('‑', '-').replace(' ', ' ')
    return re.sub(r'\s+', ' ', t).strip().lower()
def page_text(url):
    f = os.path.join(PAGES, hashlib.sha1(url.encode()).hexdigest()[:16] + '.html')
    if not os.path.exists(f) or os.path.getsize(f) < 2000:
        subprocess.run(['curl', '-sS', '-L', '-m', '40', '-A', UA, '-o', f, url], check=False)
    raw = open(f, encoding='utf-8', errors='replace').read() if os.path.exists(f) else ''
    raw = re.sub(r'(?is)<(script|style|noscript)\b.*?</\1>', ' ', raw)
    raw = re.sub(r'(?s)<[^>]+>', ' ', raw)
    return norm(html.unescape(raw))
d = json.load(open(sys.argv[1], encoding='utf-8')); bad = 0
for f in d['facts']:
    ok = f['url'].startswith(('https://experienceleague.adobe.com/', 'https://www.aem.live/', 'https://developer.adobe.com/', 'https://helpx.adobe.com/'))
    text = page_text(f['url']) if ok else ''
    hit = ok and len(norm(f['quote'])) >= 25 and norm(f['quote']) in text
    print(('✅ ' if hit else '❌ ') + f.get('key', '?') + ' | ' + f['url'][-70:] + ('' if hit else '  [quote not on the page: ' + f['quote'][:80] + ']'))
    bad += 0 if hit else 1
print('ALL QUOTES FOUND' if not bad else str(bad) + ' QUOTES NOT FOUND'); sys.exit(1 if bad else 0)
