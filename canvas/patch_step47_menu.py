"""Step 47, the menu (Nov 5 2026): clicking a box or a lightning bolt closes the Add product menu as it already closed the
Add outside system menu, so the card it opens is never under the menu (on a phone the menu covered the whole card; found
while checking step 47's tests). Run once on the step 47 template, then build.py and ../build_site.py.

    python3 sow/canvas/patch_step47_menu.py
"""
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template.html')
html = open(p, encoding='utf-8').read()
old = "el.addEventListener('click',e=>{e.stopPropagation();if(!$('out-menu').hidden)openOut(false);"
assert html.count(old) == 1, 'run this once on the step 47 template'
html = html.replace(old, "el.addEventListener('click',e=>{e.stopPropagation();if(!$('out-menu').hidden)openOut(false);if(!$('add-menu').hidden)openAdd(false);")
open(p, 'w', encoding='utf-8').write(html)
print('step 47 menu: a box or bolt click closes the Add product menu')
