"""Step 39 on the Build canvas (Nov 3 2026, Adam: "rename it to continue" and "yes" to the Proto fix): the canvas's links
name the SOW page file (sow/index.html) so Adobe Proto, which serves only exact file names, finds it; and Save and
continue is now Continue (the work is saved in the browser as the partner goes; Save draft keeps a file).
Run once on the step 38 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step39.py sow/canvas/template.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert "location.href='sow/#'+step" in html, 'run this on the step 38 template'
for old, new in [("location.href='sow/#'+step", "location.href='sow/index.html#'+step"),
                 ("location.replace('sow/?sync=build&t='+Date.now())", "location.replace('sow/index.html?sync=build&t='+Date.now())"),
                 ('<button class="save" id="save">Save and continue &rarr;</button>', '<button class="save" id="save">Continue &rarr;</button>'),
                 ("/* focus view: below the bar, and clear of Save and continue */", "/* focus view: below the bar, and clear of Continue */")]:
    assert html.count(old) == 1, old
    html = html.replace(old, new)
assert 'Save and continue' not in html and '—' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 39 applied on the canvas: links to sow/index.html, Continue')
