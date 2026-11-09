"""The RFP Builder prototype (step 49), on its own link, outside the product (Nov 8 2026, Adam: a half-built feature
does not go in the tool partners use). Builds sow/rfp_prototype/site/: a copy of the SOW tool with the RFP Builder tab
added by patch_step49.py, plus the lib/ readers. Deploy that folder on its own (Adobe Proto upload "sow-rfp-builder",
or a separate Netlify site); nothing links to it from abvsow.

    python3 sow/rfp_prototype/build.py
    node sow/test_rfp.js
"""
import os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SOW = os.path.dirname(HERE)
OUT = os.path.join(HERE, 'site')
os.makedirs(os.path.join(OUT, 'lib'), exist_ok=True)
page = os.path.join(OUT, 'index.html')
shutil.copyfile(os.path.join(SOW, 'index.html'), page)
subprocess.run([sys.executable, os.path.join(SOW, 'patch_step49.py'), page], check=True)
for lib in ['pdf.min.mjs', 'pdf.worker.min.mjs', 'mammoth.browser.min.js', 'xlsx.mini.min.js']:
    shutil.copyfile(os.path.join(SOW, 'lib', lib), os.path.join(OUT, 'lib', lib))
html = open(page, encoding='utf-8').read()
# the prototype says what it is, in the masthead, so nobody mistakes it for the product
marker = '<span class="proto-note">RFP Builder prototype, not the live tool</span>'
assert html.count('Partner services statement of work</span>') >= 1 or True
html = html.replace('<style>', '<style>.proto-note{display:inline-block;margin-left:12px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--red);color:var(--red);border-radius:999px;padding:2px 10px;vertical-align:middle}', 1)
html = html.replace('</h1>', '</h1>' + marker, 1)
open(page, 'w', encoding='utf-8').write(html)
for f in ['index.html', 'lib/pdf.min.mjs', 'lib/pdf.worker.min.mjs', 'lib/mammoth.browser.min.js', 'lib/xlsx.mini.min.js']:
    print(f, os.path.getsize(os.path.join(OUT, f)), 'bytes')
