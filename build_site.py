"""Assemble the one website in sow/site/ (Oct 31 2026): the Build canvas is the front page and the SOW tool is its
Scope, Services and Statement of work steps at /sow/. Deploy sow/site/ to abvsow.netlify.app.

    python3 sow/canvas/build.py     # first, if the canvas changed
    python3 sow/build_site.py
    node sow/test_site.js           # click-tests the assembled site over a local web server
"""
import os, shutil

SOW = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(SOW, 'site')
os.makedirs(os.path.join(SITE, 'sow'), exist_ok=True)
shutil.copyfile(os.path.join(SOW, 'canvas', 'index.html'), os.path.join(SITE, 'index.html'))
shutil.copyfile(os.path.join(SOW, 'index.html'), os.path.join(SITE, 'sow', 'index.html'))
headers = open(os.path.join(SITE, '_headers'), encoding='utf-8').read()
if '/sow/index.html' not in headers:
    headers = headers.rstrip('\n') + '\n/sow/index.html\n  Cache-Control: no-cache\n/sow/\n  Cache-Control: no-cache\n'
    open(os.path.join(SITE, '_headers'), 'w', encoding='utf-8').write(headers)
for f in ['index.html', 'sow/index.html', '_headers', 'robots.txt']:
    print(f, os.path.getsize(os.path.join(SITE, f)), 'bytes')
