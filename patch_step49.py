"""Step 49 (Nov 8 2026, Adam: "a fifth tab called RFP Builder", "ok 3"): the RFP Builder tab, part one.

The partner drops a client's RFP or RFI (PDF, Word or text). The page reads it in the browser (pdf.js and mammoth from
lib/, loaded only when the tab opens; nothing is uploaded or stored), finds the questions, and sorts them into three
piles: Adobe services (answered from this catalog in part two), Your firm (references, team, pricing: the partner's),
and Not sure (the partner moves it). Each question's pile can be changed. Nothing about the RFP is saved to browser
storage; the list clears when the page closes.

    python3 sow/patch_step49.py sow/index.html
    python3 sow/canvas/build.py && python3 sow/build_site.py
    node sow/test_rfp.js

Anchors are unique strings in index.html; each is checked to appear once before the edit.
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def once(anchor):
    n = html.count(anchor)
    assert n == 1, f'anchor appears {n} times: {anchor[:80]!r}'


def replace(anchor, new):
    global html
    once(anchor)
    html = html.replace(anchor, new, 1)


# 1. the tab, after Statement of work
TAB = '<button role="tab" data-step="document" aria-controls="document-panel">Statement of work</button>'
replace(TAB, TAB + '<button role="tab" data-step="rfp" aria-controls="rfp-panel">RFP Builder</button>')

# 2. the panel, after the Statement of work panel
DOC_END = '<div id="sow-preview"></div></section>'
PANEL = '''<section id="rfp-panel" class="panel" role="tabpanel" hidden><div class="section-intro"><h2>Answer an RFP from the catalog</h2><p>Drop your client's RFP or RFI. The tool finds the questions and sorts them: the ones about Adobe services it can answer from this catalog, the ones about your firm stay yours. The file is read in your browser only. Nothing is uploaded or stored, and the list clears when you close the page.</p></div>
<div class="rfp-drop" id="rfp-drop"><b>Drop the RFP here, or choose a file</b><span>PDF, Word (.docx), Excel (.xlsx), CSV or text</span><div class="row"><button type="button" class="primary" id="rfp-choose">Choose file</button><button type="button" id="rfp-paste-btn">Paste text instead</button></div><input type="file" id="rfp-file" accept=".pdf,.docx,.xlsx,.xls,.csv,.tsv,.txt,.md,application/pdf,text/plain" multiple hidden></div>
<div id="rfp-paste" hidden><textarea id="rfp-text" rows="9" placeholder="Paste the RFP text here, questions and all" aria-label="RFP text"></textarea><div class="next-row"><button type="button" id="rfp-paste-cancel">Cancel</button><button type="button" class="primary" id="rfp-paste-go">Find the questions</button></div></div>
<p class="hint rfp-status" id="rfp-status" aria-live="polite"></p>
<div id="rfp-results" hidden><div class="rfp-filters" role="group" aria-label="Show questions"><button type="button" data-rfp-filter="all" aria-pressed="true">All</button><button type="button" data-rfp-filter="adobe" aria-pressed="false">Adobe products</button><button type="button" data-rfp-filter="firm" aria-pressed="false">Your firm</button><button type="button" data-rfp-filter="unsure" aria-pressed="false">To sort</button><button type="button" data-rfp-filter="notpicked" aria-pressed="false">Not picked up</button><button type="button" id="rfp-clear">Clear</button></div><div class="rfp-grid"><ol class="rfp-list" id="rfp-questions"></ol><aside class="rfp-answer" id="rfp-answer" aria-live="polite"><p class="hint">Pick a question on the left to see its drafted answer.</p></aside></div><div class="rfp-summary" id="rfp-summary" hidden></div></div></section>'''
replace(DOC_END, DOC_END + '\n' + PANEL)

# 3. the panel switch and the hash route know the new step
replace("for(const name of ['scope','services','document'])$(name+'-panel').hidden=name!==step;",
        "for(const name of ['scope','services','document','rfp'])$(name+'-panel').hidden=name!==step;")
replace("location.hash.slice(1);if(['scope','services','document'].includes(s))step=s;}",
        "location.hash.slice(1);if(['scope','services','document','rfp'].includes(s))step=s;}")

# 4. styles, before the first closing style tag
CSS = '''
/* step 49: RFP Builder */
.rfp-drop{border:2px dashed var(--red);border-radius:16px;padding:26px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;margin:0 0 14px;background:#fff}
.rfp-drop.over{border-style:solid}
.rfp-drop b{font-size:17px}.rfp-drop span{font-size:14px}.rfp-drop .row{display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:center}
#rfp-text{width:100%;box-sizing:border-box;border:1.5px solid var(--line);border-radius:12px;padding:12px;font:inherit;font-size:15px;line-height:1.45}
.rfp-status{min-height:20px}
.rfp-filters{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
.rfp-filters button[aria-pressed=true]{background:var(--red);color:#fff;border-color:var(--red)}
.rfp-filters #rfp-clear{margin-left:auto}
.rfp-list{list-style:none;margin:0;padding:0}
.rfp-list li{display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:start;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 8px;font-size:15px;line-height:1.45;background:#fff}
.rfp-list li[hidden]{display:none}
.rfp-tag{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--red);color:var(--red);border-radius:999px;padding:2px 8px;white-space:nowrap;margin-top:2px}
.rfp-list li[data-kind=firm] .rfp-tag{border-color:var(--ink);color:var(--ink)}
.rfp-list li[data-kind=unsure] .rfp-tag{border-style:dashed;border-color:var(--ink);color:var(--ink)}
.rfp-q b{margin-right:6px}
.rfp-kind{font:inherit;font-size:13px;border:1.5px solid var(--line);border-radius:10px;padding:4px 8px;background:#fff;color:var(--ink)}
@media (max-width:700px){.rfp-list li{grid-template-columns:1fr}.rfp-filters #rfp-clear{margin-left:0}}
.rfp-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;align-items:start}
@media (max-width:1000px){.rfp-grid{grid-template-columns:1fr}}
.rfp-list li{cursor:pointer}.rfp-list li.sel{border:2px solid var(--red);padding:11px 13px}
.rfp-state{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--ink);border-radius:999px;padding:2px 8px;margin:0 0 10px}
.rfp-state.ok{border-color:var(--red);color:var(--red)}
.rfp-list li .rfp-state{margin:4px 0 0;font-size:10px}
.rfp-answer{border:1.5px solid var(--line);border-radius:16px;padding:18px 20px;position:sticky;top:16px;background:#fff}
.rfp-answer h3{font-size:18px;line-height:1.35;margin:0 0 10px}.rfp-answer h3 b{margin-right:6px}
.rfp-answer h4{font-size:12.5px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;margin:16px 0 4px}
.rfp-answer p,.rfp-answer li{font-size:15px;line-height:1.5}.rfp-answer ul{margin:4px 0 0 18px;padding:0}
.rfp-answer .rfp-sources a{color:var(--red)}
.rfp-drawn{font-size:14px;margin:0 0 6px}.rfp-chip{display:inline-block;border:1.5px solid var(--ink);border-radius:999px;padding:1px 9px;font-size:12.5px;font-weight:600;margin:2px 6px 2px 0}.rfp-chip.conn{border-color:var(--red);color:var(--red)}
.rfp-note{font-size:15px;line-height:1.5}
.rfp-voice{font-size:12.5px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--red);margin:12px 0 2px}
.rfp-partner-note{border:1.5px solid var(--ink);border-radius:14px;padding:14px 18px;margin-top:18px}.rfp-partner-note h4{margin-top:0}.rfp-partner-note p{margin:0 0 4px}.rfp-partner-note ul{margin-bottom:8px}
.rfp-open{color:var(--red);font-weight:600;font-size:13.5px;white-space:nowrap;align-self:center}
.rfp-fact,#rfp-firm{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:14.5px;line-height:1.4;color:var(--ink);border:1.5px solid var(--ink);border-radius:10px;padding:7px 10px;margin:6px 0 10px;background:#fff;resize:vertical}
#rfp-firm{font-size:15px;border-radius:12px;padding:10px 12px;margin:10px 0 0}
.rfp-fact::placeholder,#rfp-firm::placeholder{color:#444;opacity:1}
.rfp-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
.rfp-plain,#rfp-edit{white-space:pre-wrap;font:inherit;font-size:15px;line-height:1.5;width:100%;box-sizing:border-box;border:1.5px solid var(--line);border-radius:12px;padding:12px;margin:0}
.rfp-summary{border:1.5px solid var(--line);border-radius:16px;padding:16px 20px;margin-top:18px}.rfp-summary p{margin:0 0 6px;font-size:16px}
/* step 50: the client's ID, a Mandatory or Desirable badge, requirements, Not picked up */
.rfp-pri{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--ink);color:var(--ink);border-radius:999px;padding:1px 8px;margin:0 8px 0 0;vertical-align:1px}
.rfp-pri.mandatory{border-color:var(--red);color:var(--red)}
.rfp-req{display:block;font-size:13px;margin-top:4px}
.rfp-list li.rfp-skip{grid-template-columns:auto 1fr auto;cursor:default}
.rfp-list li.rfp-skip .rfp-tag{border-style:dashed;border-color:var(--ink);color:var(--ink)}
.rfp-list li.rfp-none{display:block}
.rfp-why{display:block;font-size:13px;font-weight:600;margin-top:4px}
.rfp-make{white-space:nowrap;align-self:center}
/* step 51: writing the answers back into the client's workbook */
.rfp-wb-note{font-size:14px;margin:8px 0 0}
/* step 52: the capability box, editable Drawn from chips, the firm's part of a two-part question */
.rfp-cap{border:1.5px solid var(--red);border-radius:14px;padding:14px 18px;margin:12px 0}
.rfp-cap h4{color:var(--red);margin-top:0}
.rfp-cap p{margin:0 0 6px}
.rfp-chip button{border:0;background:none;padding:0 0 0 6px;margin:0;font:inherit;font-weight:700;cursor:pointer;color:inherit;min-height:0}
.rfp-add{font:inherit;font-size:12.5px;border:1.5px dashed var(--ink);border-radius:999px;padding:1px 8px;background:#fff;color:var(--ink);width:auto;max-width:100%;margin:2px 0}
.rfp-cap a{color:var(--red)}
.rfp-firm-part{border:1.5px solid var(--ink);border-radius:14px;padding:12px 18px;margin-top:14px}
.rfp-firm-part h4{margin-top:0}
</style>'''
# the page has two style blocks (the print styles come second); the new rules join the first
assert html.count('</style>') == 2
html = html.replace('</style>', CSS, 1)

# 5. the script, after the page's own script
# The RFP Builder's JavaScript lives in sow/rfp_finder.js (the finder and the piles), sow/rfp_readers.js (PDF, Word,
# spreadsheets) and sow/rfp_ui.js (the screen), split out on Nov 10 2026 for steps 50 to 52; rfp_answers.js is part two.
def inline(name, fid):
    return '<script id="' + fid + '">\n' + open(os.path.join(HERE, name), encoding='utf-8').read() + '</script>\n'

import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
catalog = json.load(open(os.path.join(HERE, 'canvas', 'catalog.json'), encoding='utf-8'))
slim = {'products': [{k: v for k, v in p.items() if k in ('id', 'name', 'title', 'outside', 'lines', 'more')} for p in catalog['products']],
        'connections': [{k: v for k, v in c.items() if k in ('id', 'a', 'b', 'label', 'how', 'gain', 'availability', 'sowAvailability', 'prereqs', 'sowPrereqs', 'lines', 'more', 'source', 'flows', 'tier')} for c in catalog['connections']],
        'lines': {k: {kk: vv for kk, vv in v.items() if kk != 'evidence'} for k, v in catalog['lines'].items()}}
CAT_SCRIPT = '<script id="rfp-catalog">const RFP_CAT=' + json.dumps(slim, ensure_ascii=False).replace('</', '<\\/') + ';</script>\n'
SCRIPT = inline('rfp_finder.js', 'rfp-finder') + inline('rfp_readers.js', 'rfp-readers') + inline('rfp_ui.js', 'rfp-builder')
ANSWERS = inline('rfp_answers.js', 'rfp-answers')
END = "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script></body></html>"
replace(END, "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script>\n" + CAT_SCRIPT + SCRIPT + ANSWERS + "</body></html>")

open(path, 'w', encoding='utf-8').write(html)
print('step 49 applied: RFP Builder tab, panel, styles, finder and answers')
