"""Step 39 of the SOW tool (Nov 3 2026, Adam: "yes" to the fix): links name the page file. Adobe Proto, where Adam hosts
the tool for coworkers, serves only exact file names: an address ending in a folder (../ or sow/) returned
{"error":"object not found: .../v1/sow/"}, which a colleague hit on Save and continue. Netlify serves a folder's
index.html by itself, so the tool worked there. These steps now go back to the canvas at ../index.html (the Build tab and
the catch-up's way back); canvas/patch_step39.py does the same for the canvas's links to sow/index.html and renames
Save and continue to Continue. Works on Netlify and Proto alike.
Run once on the step 38 file.

    python3 patch_step39.py index.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert "location.href='../'" in html and "'../index.html" not in html, 'run this on the step 38 file'
n = html.count("location.href='../'")
assert n == 2, n
html = html.replace("location.href='../'", "location.href='../index.html'")
old = "location.replace('../?synced='+Date.now())"
assert html.count(old) == 1
html = html.replace(old, "location.replace('../index.html?synced='+Date.now())")
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 39 applied: the SOW steps link back to ../index.html')
