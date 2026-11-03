"""Step 31 of the SOW tool (Nov 3 2026, Adam: "ok" to removing Download template, after "if they could download it that
would be super helpful then they could email it to people shared internally, whatever give it to their customers"):
partners take the finished SOW with Download SOW, Print / PDF and Services CSV, all on the Statement of work step.
- Download template is gone: it saved a copy of the tool itself (Partner_SOW_Builder.html), which no longer works
  offline since the Build canvas became the front page (it can't pick a play). Its button, its handler and the page
  copy it saved (CLEAN_HTML) are removed.
- Services CSV moves beside Download SOW on the Statement of work step, so the More menu in the top bar goes, with its
  styles; the top bar keeps Save draft, Open draft and Start over. As mocked up on November 2
  (sow/mockups/nov2_exports/sow_out_email.png, without the Email SOW button Adam passed on).
Run once on the step 30 file; every anchor must appear exactly once.

    python3 patch_step31.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'id="download-tool"' in html and 'OUT_START' in html, 'run this on the step 30 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
# the More menu and Download template leave the top bar
rep('<details class="more"><summary>More</summary><div><button id="download-tool">Download template</button><button id="export-csv">Services CSV</button></div></details>', '')
# Services CSV sits beside Download SOW on the Statement of work step
rep('<button data-go="services">Edit services</button><button id="download-sow">Download SOW</button>',
    '<button data-go="services">Edit services</button><button id="export-csv">Services CSV</button><button id="download-sow">Download SOW</button>')
# the template download and the page copy it saved
rep("$('download-tool').onclick=()=>download('Partner_SOW_Builder.html',CLEAN_HTML,'text/html');\n", '')
rep("const CLEAN_HTML='<!doctype html>'+document.documentElement.outerHTML;\n", '')
# the More menu's styles
rep('.top-actions button,.more summary{font-size:14px;white-space:nowrap}.more{position:relative}.more summary{list-style:none;border:1.5px solid var(--ink);border-radius:4px;background:#fff;padding:9px 14px;font-weight:600}.more summary::-webkit-details-marker{display:none}.more>div{position:absolute;right:0;top:46px;background:#fff;padding:8px;border:1px solid var(--line);border-radius:4px;box-shadow:0 8px 30px #1c1c1c22;z-index:10;width:200px}.more button{display:block;border:0;text-align:left;width:100%}',
    '.top-actions button{font-size:14px;white-space:nowrap}')

for gone in ('download-tool', 'Download template', 'CLEAN_HTML', 'Partner_SOW_Builder', 'class="more"', '.more'):
    assert gone not in html, f'{gone} is still in the file'
assert html.count('id="export-csv"') == 1
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 31 applied: Download template and the More menu are gone; Services CSV sits beside Download SOW')
