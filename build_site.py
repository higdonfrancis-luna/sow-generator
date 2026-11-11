"""Assemble the one website in sow/site/ (Oct 31 2026): the Build canvas is the front page and the SOW tool is its
Scope, Services, Statement of work and RFP Builder steps at /sow/. Since Nov 9 2026 the site lives on Adobe Proto
(proto.adobe.io/sow-generator; Adam uploads a zip of sow/site/), and abvsow.netlify.app is being turned off.

    python3 sow/canvas/build.py     # first, if the canvas changed
    python3 sow/build_site.py
    node sow/test_site.js           # click-tests the assembled site over a local web server
    node sow/test_rfp.js            # and the RFP Builder suites: test_rfp_step50.js to _step55.js, test_rfp_part3.js,
                                    # test_rfp_summary_bar.js and rfp_prototype/review_2026-11-09/recheck.js
"""
import os, shutil, subprocess, sys

SOW = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(SOW, 'site')
os.makedirs(os.path.join(SITE, 'sow'), exist_ok=True)
shutil.copyfile(os.path.join(SOW, 'canvas', 'index.html'), os.path.join(SITE, 'index.html'))
shutil.copyfile(os.path.join(SOW, 'index.html'), os.path.join(SITE, 'sow', 'index.html'))
# Nov 9 2026 (Adam: "I think we can merge it"): the RFP Builder, tried out as a separate prototype since Nov 8, is the SOW tool's
# fifth tab. The knowledge base is checked and written first; patch_step49.py adds the tab to the copy here (sow/index.html stays
# the SOW tool's own source); the four file readers sit beside the page in sow/lib/ and load only when the tab opens.
subprocess.run([sys.executable, os.path.join(SOW, 'rfp_prototype', 'part3_research', 'build_facts.py')], check=True)
subprocess.run([sys.executable, os.path.join(SOW, 'patch_step49.py'), os.path.join(SITE, 'sow', 'index.html')], check=True)
LIBS = ['pdf.min.mjs', 'pdf.worker.min.mjs', 'mammoth.browser.min.js', 'xlsx.mini.min.js', 'docx.iife.js']   # docx.iife.js (docx 9.7.1, MIT): the Word builder behind Download proposal, step 75
os.makedirs(os.path.join(SITE, 'sow', 'lib'), exist_ok=True)
for lib in LIBS:
    shutil.copyfile(os.path.join(SOW, 'lib', lib), os.path.join(SITE, 'sow', 'lib', lib))
headers = open(os.path.join(SITE, '_headers'), encoding='utf-8').read()
if '/sow/index.html' not in headers:
    headers = headers.rstrip('\n') + '\n/sow/index.html\n  Cache-Control: no-cache\n/sow/\n  Cache-Control: no-cache\n'
    open(os.path.join(SITE, '_headers'), 'w', encoding='utf-8').write(headers)
for f in ['index.html', 'sow/index.html', '_headers', 'robots.txt'] + ['sow/lib/' + lib for lib in LIBS]:
    print(f, os.path.getsize(os.path.join(SITE, f)), 'bytes')
