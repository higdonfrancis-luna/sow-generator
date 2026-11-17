"""Packages Adam's brief with the added tabs.

Usage: python3 -I package.py <site folder> <the brief zip Adam uploaded> <output folder>

The site folder holds the brief's own files plus the added files listed in ADDED.
1. Writes brand-visibility-growth.zip: the uploaded brief's files in their order, then the added files.
2. Writes one click-through preview per added page, with stylesheets, fonts and pictures inlined and the
   links to the brief's other pages switched off. The previews embed Adobe fonts: never commit them.
"""
import base64
import os
import re
import sys
import zipfile

site, brief_zip, out = sys.argv[1:4]
ADDED = ['coworker-evidence.html', 'propensity-method.html', 'propensity-mockup.png']
PAGES = [f for f in ADDED if f.endswith('.html')]

src = zipfile.ZipFile(brief_zip)
names = [n for n in src.namelist() if not n.endswith('/')]
zp = os.path.join(out, 'brand-visibility-growth.zip')
with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
    for n in names + ADDED:
        z.write(os.path.join(site, n), n)
new = zipfile.ZipFile(zp)
changed = [n for n in names if src.read(n) != new.read(n)]
print('zip files', len(new.namelist()), '| changed vs upload:', changed, '| added:', sorted(set(new.namelist()) - set(names)))


def data_uri(path, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())


def font(m):
    return 'url(%s)' % data_uri(os.path.normpath(os.path.join(site, m.group(1))), 'font/woff2')


def sheet(m):
    css = open(os.path.join(site, m.group(1)), encoding='utf-8').read()
    css = re.sub(r'url\(["\']?((?:\./)?fonts/[^"\')]+)["\']?\)', font, css)
    left = [u for u in re.findall(r'url\((?!data:)[^)]*\)', css) if 'svg+xml' not in u and '#' not in u[:6]]
    assert not left, left[:3]
    return '<style>\n%s\n</style>' % css


for page in PAGES:
    t = open(os.path.join(site, page), encoding='utf-8').read()
    t, n = re.subn(r'<link rel="stylesheet" href="([^"]+)">', sheet, t)
    assert n == 4
    t = re.sub(r'<img src="([^":]+\.png)"', lambda m: '<img src="%s"' % data_uri(os.path.join(site, m.group(1)), 'image/png'), t)
    others = [p for p in ['index.html'] + PAGES if p != page]
    sel = ','.join('a[href^="%s"]' % p for p in others)
    k = sum(t.count('href="%s' % p) for p in others)
    t = t.replace('</body>', '<script>document.addEventListener("click",function(e){var a=e.target.closest(\'%s\');if(a)e.preventDefault();});</script>\n</body>' % sel)
    t = t.replace('<title>', '<title>Preview: ', 1)
    sp = os.path.join(out, page.replace('.html', '-preview.html'))
    open(sp, 'w', encoding='utf-8').write(t)
    print('preview', os.path.basename(sp), os.path.getsize(sp), 'bytes | links to other pages switched off:', k)
