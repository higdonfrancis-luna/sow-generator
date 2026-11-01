"""Build canvas, front page (Adam, Nov 1 2026): until a play is picked, only the masthead (Adobe logo and
"Partner services statement of work") sits above "Choose a play to start"; the steps, the rate, the delivery size,
the total and Start over show once a play is picked. The "Choose a play" dropdown is gone: plays are picked from the
boxes, and Change play goes back to them. After a reload, the products sit where the layout puts them (Adam, Nov 1).
Run once on template.html after patch_audit_ui3.py; every anchor must appear exactly once.

    python3 patch_picker.py template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
BRACES = html.count('{') - html.count('}')
assert '/*CATALOG*/null' in html, 'run this on template.html, not the built index.html'
assert 'const termText=' in html, 'run this after patch_audit_ui3.py'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


# styles: the dropdown's rules go; while the boxes show, the steps, toolbar and Start over wait
rep('.drop{position:relative}\n'
    '.menu{position:absolute;top:calc(100% + 6px);left:0;z-index:50;background:#fff;border:2px solid var(--ink);border-radius:8px;padding:8px 0;min-width:330px}\n'
    '.menu[hidden]{display:none}\n'
    '.menu .g{font-size:12.5px;font-weight:700;letter-spacing:1.4px;color:var(--ink2);padding:10px 18px 3px;text-transform:uppercase}\n'
    '.menu button.it{display:flex;align-items:center;gap:10px;width:100%;border:0;background:none;text-align:left;padding:7px 18px;font-size:16.5px;line-height:21px}\n'
    '.menu button.it:hover,.menu button.it:focus-visible{background:var(--soft);outline:none}\n',
    'body.picking .tabs,body.picking .toolbar{display:none}\n'
    '/* while the boxes show, Start over keeps its place unseen, so the masthead keeps its height when a play is picked; at 520px and narrower, where it can wrap to a row of its own, it goes, with the spacer before it */\n'
    'body.picking #start-over{visibility:hidden}\n@media (max-width:520px){body.picking #start-over,body.picking .masthead .sp{display:none}}\n')

# markup: the page starts on the boxes, so a slow first load never shows the steps or the toolbar; no dropdown in the toolbar
rep('</style></head><body>\n', '</style></head><body class="picking">\n')
start = html.index('  <div class="drop" id="choose">')
end = html.index('\n', start) + 1
assert html[start:end].rstrip().endswith('<div class="menu" id="play-menu" hidden></div></div>'), html[start:end][-80:]
html = html[:start] + html[end:]

# script: the page knows when the boxes are showing; the dropdown's code goes
rep("function render(){\n  setLayout();", "function render(){\n  document.body.classList.toggle('picking',!play());\n  setLayout();")
rep("$('save').hidden=!ps.length;$('choose').hidden=!!pl;$('playname').hidden=!pl;", "$('save').hidden=!ps.length;$('playname').hidden=!pl;")
start = html.index("$('play-menu').innerHTML=sections.map(")
end = html.index('\n', start) + 1
html = html[:start] + html[end:]
rep("function openMenu(open){$('play-menu').hidden=!open;$('play-btn').setAttribute('aria-expanded',!!open);}\n"
    "$('play-btn').addEventListener('click',e=>{e.stopPropagation();openMenu($('play-menu').hidden);});\n", '')
rep("st.keep={};moreOpen={};fsel=null;fhov=null;openMenu(false);render();", "st.keep={};moreOpen={};fsel=null;fhov=null;render();")
rep("if(on){hideCard(true);openMenu(false);m.innerHTML=menuHTML();", "if(on){hideCard(true);m.innerHTML=menuHTML();")
rep("$('play-menu').addEventListener('click',pick);\n", '')
rep('/* the picker and the toolbar menu list the plays in their sections */', '/* the picker lists the plays in their sections */')
rep("document.addEventListener('click',()=>{openMenu(false);openAdd(false);", "document.addEventListener('click',()=>{openAdd(false);")
rep("if(e.key==='Escape'){openMenu(false);openAdd(false);", "if(e.key==='Escape'){openAdd(false);")
# the steps show only once a play is picked, so the only way to hand off without services is a play with none on it
rep("function handoff(step){const pl=play();if(!pl||!prods().length){toast(pl?'Add a product to the canvas first.':'Choose a play first.');return;}",
    "function handoff(step){const pl=play();if(!prods().length){toast('Add a product to the canvas first.');return;}")

# after a reload (or a trip back from the SOW steps) the products sat 25 to 30 px low until the next resize: lay out once the total is drawn, since the total's height sets the toolbar's
rep("  fit();totalsUI();hintUI();", "  totalsUI();hintUI();fit();")

for gone in ('play-menu', 'play-btn', "'choose'", 'openMenu', '.drop', '.menu', 'Choose a play first', 'toolbar menu'):
    assert gone not in html, f'{gone} is still in the page'
assert html.count('{') - html.count('}') == BRACES, 'the change left braces unbalanced'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('front page: masthead only until a play is picked; no play dropdown')
