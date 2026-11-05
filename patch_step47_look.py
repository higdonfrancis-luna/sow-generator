"""Step 47, the look (Nov 5 2026, Adam on the mockup in mockups/nov5_look/: "That rounding is so much better. I mean, it
looks like actual software"): rounder corners on both pages. Cards, panels, play boxes, product boxes, the fee box,
menus and dialogs 16px; buttons, fields and the size switches 12px; small tags and chips are pills. Round things stay
round, the tabs stay flat, and nothing else changes (colors, spacing, sizes, layout, fonts: Source Sans 3 already loads
on both pages). One block at the end of each page's stylesheet, so it reads as one change. Run once on the step 47
files, then canvas/build.py and build_site.py.

    python3 sow/patch_step47_look.py
"""
import os
import re
HERE = os.path.dirname(os.path.abspath(__file__))
NOTE = '/* step 47: rounder corners (Adam, Nov 5: "That rounding is so much better") */\n'

CANVAS = (NOTE +
          '.node,.card,.total,.pc-card,.bp,.bp-box,.addmenu,.modal .box{border-radius:16px}\n'
          '.btn,.add,.rate input,.seg,.rm,.addp,.save,.modal .primary,.bp-go,.bp-build,.bp-alt,.toast{border-radius:12px}\n'
          '.card .kind b,.ln .cpt,.flow .pc,.pc-card .chips span,.ctag,.fbar .chip,.node .cn,.bp-p,.rec,.tier{border-radius:999px}\n')
SOW = (NOTE +
       'button,input,select,textarea,.size-switch,.scope-editor .basis,#toast{border-radius:12px}\n'
       '.form-card,.estimate-strip,.total-card,.service-card,.readiness,.empty,.service-extensions,.modal-card,.own,.own-form,.sow-draft{border-radius:16px}\n'
       '.stage-head .tag,.concept-tag,.sow-flag,.custom-tag{border-radius:999px}\n'
       '@media screen{.sow-document{border-radius:16px}}\n')

for rel, block in (('canvas/template.html', CANVAS), ('index.html', SOW)):
    p = os.path.join(HERE, rel)
    html = open(p, encoding='utf-8').read()
    assert 'rounder corners (Adam, Nov 5' not in html, 'run this once'
    # the page's own stylesheet ends where its body starts (the SOW steps also carry a download template with its own)
    ends = [m.start() for m in re.finditer(r'</style></head>\s*<body', html)]
    i = ends[0]   # the page's own; on the SOW steps a later one sits inside the download template's script
    html = html[:i] + block + html[i:]
    assert '—' not in block and '–' not in block
    open(p, 'w', encoding='utf-8').write(html)
print('step 47 look applied: rounder corners on the canvas and the SOW steps')
