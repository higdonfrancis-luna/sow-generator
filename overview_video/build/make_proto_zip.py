"""Make the zip Adam uploads to Adobe Proto: the watch page with index.html at the root.

    python3 build/make_proto_zip.py        (run from the overview_video folder)

Puts proto/index.html, proto/poster.png, the web copy of the video, the Adobe logo and the font
files side by side at the root of out/SOW_Generator_First_Look_Proto.zip, then checks the zip.
"""
import hashlib
import os
import re
import sys
import zipfile

ZIP = 'out/SOW_Generator_First_Look_Proto.zip'
FILES = {
    'index.html': 'proto/index.html',
    'poster.png': 'proto/poster.png',
    'sow-generator-and-rfi-builder-first-look.mp4': 'out/SOW_Generator_and_RFI_Builder_First_Look_web.mp4',
    'adobe_logo.png': 'art/adobe_logo.png',
    'source-sans-3-latin-400-normal.woff2': 'fonts/source-sans-3-latin-400-normal.woff2',
    'source-sans-3-latin-600-normal.woff2': 'fonts/source-sans-3-latin-600-normal.woff2',
    'source-sans-3-latin-700-normal.woff2': 'fonts/source-sans-3-latin-700-normal.woff2',
}
fails = 0


def check(ok, text):
    global fails
    print(('✅ ' if ok else '❌ ') + text)
    fails += 0 if ok else 1


def main():
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, src in FILES.items():
            # the video is already compressed; store it as it is
            z.write(src, name, compress_type=zipfile.ZIP_STORED if name.endswith('.mp4') else zipfile.ZIP_DEFLATED)
    z = zipfile.ZipFile(ZIP)
    names = z.namelist()
    html = z.read('index.html').decode('utf-8')
    check('index.html' in names and all('/' not in n for n in names), f'index.html is at the root of the zip, with {len(names) - 1} files beside it and no folders')
    check(z.testzip() is None, 'the zip opens and every file in it reads back whole')
    refs = set(re.findall(r'(?:src|poster)="([^"]+)"', html)) | set(re.findall(r'url\(([^)]+)\)', html))
    check(refs == set(names) - {'index.html'}, f'the page uses every file in the zip and nothing else ({len(refs)} files)')
    check(not re.search(r'https?://', html), 'the page loads nothing from another website')
    for name, src in FILES.items():
        same = hashlib.sha256(z.read(name)).hexdigest() == hashlib.sha256(open(src, 'rb').read()).hexdigest()
        check(same, f'{name} in the zip is the current {src}')
    check('noindex' in html, 'the page asks search engines not to list it')
    check(chr(0x2014) not in html and chr(0x2013) not in html, 'no em or en dashes on the page')
    check('Internal' not in html and 'Confidential' not in html, 'no "Internal" or "Confidential" label on a page meant for partners')
    size = os.path.getsize(ZIP) / 1e6
    check(size < 25, f'the zip is {size:.1f} MB')
    print(f'\n{ZIP}: ALL ZIP CHECKS PASSED' if not fails else f'\n{fails} CHECK(S) FAILED')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
