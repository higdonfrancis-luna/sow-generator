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
replace(TAB, TAB + '<button role="tab" data-step="rfp" aria-controls="rfp-panel">RFI Builder</button>')

# 1b. step 57 (Nov 10 2026, Adam: "why wouldn't you just have RFP builder?", yes to sow/mockups/rfp_front_door/rfi_only_empty.png):
# from the first page's front door (#rfi) the RFI Builder opens on its own. Its heading and Back to the home page show only
# in that mode (body.rfi-only, set by rfp_ui.js); the play heading, Change play, the steps and the SOW draft buttons hide.
TOPBAR = '<header class="topbar"><div><p class="eyebrow">Play</p><h1 id="play-title"></h1></div><button data-build data-change>Change play</button></header>'
replace(TOPBAR, '<header class="topbar"><div><p class="eyebrow">Play</p><h1 id="play-title"></h1></div><div class="rfi-top"><p class="eyebrow">RFI Builder</p><h1>Answer an RFI</h1></div><button data-build data-change>Change play</button><button type="button" id="rfp-clear" class="rfp-clear">Start over</button><button type="button" id="rfi-back" class="rfi-back">Back to the home page</button></header>')

# 2. the panel, after the Statement of work panel
DOC_END = '<div id="sow-preview"></div></section>'
PANEL = '''<section id="rfp-panel" class="panel" role="tabpanel" hidden><div class="section-intro"><h2>Answer an RFI from the catalog</h2><p>The answers provided are suggested drafts, drawn from Adobe’s public documentation. Review every suggestion provided for accuracy.</p></div>
<div class="rfp-drop" id="rfp-drop"><b>Drop the RFI here, or choose a file</b><span>PDF, Word (.docx), Excel (.xlsx), CSV or text</span><div class="row"><button type="button" class="primary" id="rfp-choose">Choose file</button><button type="button" id="rfp-paste-btn">Paste text instead</button><button type="button" id="rfp-open-work-empty">Open my work</button></div><input type="file" id="rfp-file" accept=".pdf,.docx,.xlsx,.xls,.csv,.tsv,.txt,.md,application/pdf,text/plain" multiple hidden></div>
<div id="rfp-paste" hidden><textarea id="rfp-text" rows="9" placeholder="Paste the RFI text here, questions and all" aria-label="RFI text"></textarea><div class="next-row"><button type="button" id="rfp-paste-cancel">Cancel</button><button type="button" class="primary" id="rfp-paste-go">Find the questions</button></div></div>
<p class="hint rfp-status" id="rfp-status" aria-live="polite"></p>
<div id="rfp-results" hidden><div class="rfp-ai-row"><button type="button" class="primary" id="rfp-ai">Build Answers with AI</button></div><div class="rfp-filters" role="group" aria-label="Show questions"><button type="button" data-rfp-filter="all" aria-pressed="true">All</button><button type="button" data-rfp-filter="adobe" aria-pressed="false">Adobe products</button><button type="button" data-rfp-filter="firm" aria-pressed="false">Your firm</button><button type="button" data-rfp-filter="unsure" aria-pressed="false">To sort</button><button type="button" data-rfp-filter="review" aria-pressed="false">To review</button><button type="button" data-rfp-filter="notpicked" aria-pressed="false">Not picked up</button></div><p class="rfp-left-note" id="rfp-left-note" hidden></p><div class="rfp-grid"><ol class="rfp-list" id="rfp-questions"></ol><aside class="rfp-answer" id="rfp-answer" aria-live="polite"><p class="hint">Pick a question on the left to see its drafted answer.</p></aside></div><div class="rfp-summary" id="rfp-summary" hidden></div></div>
<input type="file" id="rfp-work-file" accept=".json,application/json" hidden>
<div class="modal" id="rfp-start-over-modal" role="dialog" aria-modal="true" aria-labelledby="rfp-start-over-title" hidden><div class="modal-card start-over-card"><h2 id="rfp-start-over-title">Start over?</h2><p>This clears the RFI, its questions and every answer, tick and note on this tab. Save my work first if you want to keep them.</p><div class="start-over-actions"><button type="button" id="rfp-clear-cancel">Cancel</button><button type="button" class="primary" id="rfp-clear-confirm">Clear the RFI</button></div></div></div>
<div class="modal" id="rfp-handoff-modal" role="dialog" aria-modal="true" aria-labelledby="rfp-handoff-title" hidden><div class="modal-card start-over-card"><h2 id="rfp-handoff-title">Add to my statement of work?</h2><p id="rfp-handoff-text"></p><div class="start-over-actions"><button type="button" id="rfp-handoff-cancel">Cancel</button><button type="button" class="primary" id="rfp-handoff-go">Add them</button></div></div></div>
<div class="modal" id="rfp-replace-modal" role="dialog" aria-modal="true" aria-labelledby="rfp-replace-title" hidden><div class="modal-card start-over-card"><h2 id="rfp-replace-title">Replace the RFI on screen?</h2><p id="rfp-replace-text"></p><div class="start-over-actions"><button type="button" id="rfp-replace-cancel">Cancel</button><button type="button" class="primary" id="rfp-replace-go">Replace it</button></div></div></div></section>'''
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
/* step 73: Build Answers with AI and Start over, on a row of their own above the filters */
.rfp-ai-row{display:flex;flex-direction:column;align-items:center;gap:10px;margin:22px 0}
.rfp-ai-row button{margin:0}
/* step 79 (Adam: "can it look like the famous staples 'Easy Button'?", then "a bezzeled pill would be fine. east button too big"): one wide beveled button, centered */
.rfp-ai-row #rfp-ai{min-height:64px;border-radius:40px;padding:18px 56px;font-size:21px;font-weight:700;color:#fff;border:0;background:linear-gradient(#F72A1B,#EB1000 55%,#D40E00);box-shadow:0 6px 0 #9E0B00,0 12px 18px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.35);cursor:pointer}
.rfp-ai-row #rfp-ai:active:not(:disabled){transform:translateY(4px);box-shadow:0 2px 0 #9E0B00,0 6px 10px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.35)}
.rfp-ai-row #rfp-ai:focus-visible{outline:3px solid #1C1C1C;outline-offset:4px}
.rfp-ai-row #rfp-ai:disabled{background:#fff;color:#1C1C1C;cursor:default;box-shadow:0 0 0 2px #1C1C1C,0 6px 0 #9A9A9A,0 12px 18px rgba(0,0,0,.2)}
.rfp-ai-row #rfp-ai.undo{min-height:48px;border-radius:8px;padding:12px 26px;font-size:16px;font-weight:600;color:#1C1C1C;background:#fff;border:1.5px solid #1C1C1C;box-shadow:none;transform:none}
.topbar .rfp-clear{display:none;flex:none;margin:4px 0 0 auto}
body:has(#rfp-panel:not([hidden]) #rfp-results:not([hidden])) .topbar .rfp-clear{display:inline-block}
.topbar .rfi-back{flex:none;margin-top:4px}
@media(max-width:700px){body.rfi-only .topbar{flex-wrap:wrap}}
.rfp-list{list-style:none;margin:0;padding:0}
.rfp-list li{display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:start;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:0 0 8px;font-size:15px;line-height:1.45;background:#fff}
.rfp-list li[hidden]{display:none}
.rfp-tag{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--red);color:var(--red);border-radius:999px;padding:2px 8px;white-space:nowrap;margin-top:2px}
.rfp-list li[data-kind=firm] .rfp-tag{border-color:var(--ink);color:var(--ink)}
.rfp-list li[data-kind=unsure] .rfp-tag{border-style:dashed;border-color:var(--ink);color:var(--ink)}
.rfp-q b{margin-right:6px}
.rfp-kind{font:inherit;font-size:13px;border:1.5px solid var(--line);border-radius:10px;padding:4px 8px;background:#fff;color:var(--ink)}
@media (max-width:700px){.rfp-list li{grid-template-columns:1fr}}
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
.rfp-answer ol.rfp-sources{margin:4px 0 0 22px;padding:0}.rfp-answer ol.rfp-sources li{font-size:14px}
.rfp-kb-from{font-size:14px;margin:0 0 8px}.rfp-kb-checked{display:inline-block;border:1.5px solid var(--red);color:var(--red);border-radius:999px;padding:1px 10px;font-size:13px;font-weight:700}
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
/* step 75: one line at the foot of the window while a proposal is written */
.rfp-progress{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:60;background:#1C1C1C;color:#fff;font-size:15.5px;font-weight:700;line-height:1.4;padding:12px 20px;border-radius:10px;max-width:calc(100vw - 32px);box-shadow:0 6px 24px rgba(0,0,0,.25)}
.rfp-progress.done{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;font-weight:400;width:min(860px,calc(100vw - 32px))}
.rfp-progress.done[hidden]{display:none}
.rfp-progress.done span{flex:1 1 380px}
.rfp-progress.done button{flex:none;margin:0;min-height:40px;padding:8px 16px;border:1.5px solid #fff;border-radius:8px;background:#fff;color:#1C1C1C;font:inherit;font-weight:700;cursor:pointer}
.rfp-progress.done #rfp-progress-close{background:#1C1C1C;color:#fff}
/* step 74: Show all and Show less on a long line */
#rfp-results .rfp-more{border:0;background:none;padding:0;min-height:0;margin-left:4px;font:inherit;font-weight:700;color:var(--red);text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.rfp-make{white-space:nowrap;align-self:center}
/* step 51: writing the answers back into the client's workbook */
/* step 57: the RFI Builder on its own (from the first page's front door) until Add to my statement of work hands off */
.rfi-top,.rfi-back{display:none}body.rfi-only .rfi-top{display:block}body.rfi-only .rfi-back{display:inline-block}
body.rfi-only .topbar > div:first-child,body.rfi-only .topbar [data-change],body.rfi-only .steps,body.rfi-only #save-draft,body.rfi-only #open-draft,body.rfi-only #start-over,body.rfi-only #rfp-panel .section-intro h2{display:none!important}
/* the fifth tab: on a phone the step row wraps when the five tabs do not fit, so the page never scrolls sideways (Nov 9 merge; test_review_nov2.js S24/F5) */
@media(max-width:780px){.steps{flex-wrap:wrap;row-gap:0}}
/* the summary bar (Nov 9, sow/mockups/summary_bar/summary_bar.png): counts with Save and Open as links, the red button and one Download menu */
.rfp-sum-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 20px}
.rfp-sum-head p{flex:1 1 420px;min-width:0}
.rfp-work-links{display:flex;gap:18px;margin-bottom:6px}
#rfp-summary .rfp-link{border:0;background:none;padding:0;min-height:0;font-size:15px;font-weight:700;color:var(--red);text-decoration:underline;text-underline-offset:2px;cursor:pointer}
.rfp-dl{position:relative;display:inline-block}
#rfp-dl-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:20;width:min(440px,calc(100vw - 48px));border:1.5px solid var(--ink);border-radius:14px;background:#fff;padding:6px 0;box-shadow:0 8px 24px rgba(0,0,0,.12);display:flex;flex-direction:column}
#rfp-dl-menu[hidden]{display:none}
#rfp-dl-menu button{display:block;width:100%;text-align:left;white-space:normal;border:0;border-radius:0;background:#fff;color:var(--ink);padding:10px 16px;min-height:0;cursor:pointer}
#rfp-dl-menu button.sep{border-top:1.5px solid var(--line);margin-top:4px;padding-top:12px}
#rfp-dl-menu button:hover,#rfp-dl-menu button:focus-visible{background:var(--soft)}
#rfp-dl-menu button:focus-visible{outline:2px solid var(--red);outline-offset:-2px}
#rfp-dl-menu button b{display:block;font-size:15px;font-weight:700}
#rfp-dl-menu button span{display:block;font-size:14px;font-weight:400}
#rfp-dl-menu button *{pointer-events:none}
/* step 52: the capability box, editable Drawn from chips, the firm's part of a two-part question */
.rfp-cap{border:1.5px solid var(--red);border-radius:14px;padding:14px 18px;margin:12px 0}
.rfp-cap h4{color:var(--red);margin-top:0}
.rfp-cap p{margin:0 0 6px}
.rfp-chip button{border:0;background:none;padding:0 0 0 6px;margin:0;font:inherit;font-weight:700;cursor:pointer;color:inherit;min-height:0}
.rfp-add{font:inherit;font-size:12.5px;border:1.5px dashed var(--ink);border-radius:999px;padding:1px 8px;background:#fff;color:var(--ink);width:auto;max-width:100%;margin:2px 0}
.rfp-cap a{color:var(--red)}
.rfp-firm-part{border:1.5px solid var(--ink);border-radius:14px;padding:12px 18px;margin-top:14px}
.rfp-firm-part h4{margin-top:0}
/* step 54: the partner's note in four lists, a tick box on every ask, the response told what we need */
.rfp-internal{font-size:13.5px;margin:0 0 10px}
.rfp-partner-note ul{list-style:disc;margin:4px 0 10px 18px;padding:0}
.rfp-asks{list-style:none !important;margin-left:0 !important}
.rfp-asks li{display:block;margin:0 0 6px}
.rfp-asks label{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:start;font-size:15px;line-height:1.5;cursor:pointer}
.rfp-tick{width:18px;height:18px;margin:5px 0 0;accent-color:var(--red)}
.rfp-badge{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid var(--red);color:var(--red);border-radius:999px;padding:1px 8px;margin-left:8px;vertical-align:1px;white-space:nowrap}
.rfp-badge.off{border-color:var(--ink);color:var(--ink)}
.rfp-asks .rfp-fact{margin:4px 0 8px 30px;width:calc(100% - 30px)}
.rfp-edited{font-size:14px;font-weight:600;margin:0 0 10px}
/* steps 55 and 56: rows open from the keyboard, the services behind an answer */
.rfp-list li:focus-visible{outline:3px solid var(--red);outline-offset:2px}
/* step 70: one count a line on the summary bar, and the line above the list when it shows what is left */
.rfp-count{display:block;line-height:1.9}.rfp-count .rfp-link{margin-left:8px}
.rfp-left-note{margin:0 0 12px;font-size:15.5px;font-weight:700;color:#1C1C1C;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}
.rfp-client{display:flex;flex-direction:row;flex-wrap:wrap;gap:8px 12px;align-items:center;font-size:15px;font-weight:400;line-height:1.5;margin:14px 0 16px}
.rfp-client input{flex:1 1 260px;max-width:420px;min-width:0;font:inherit;font-size:15px;padding:6px 10px;border:1.5px solid #1C1C1C;border-radius:8px;color:#1C1C1C;background:#fff}
.rfp-lines{list-style:none !important;margin-left:0 !important}
.rfp-lines li{display:block;margin:0 0 4px}
.rfp-lines label{display:grid;grid-template-columns:22px 1fr;gap:8px;align-items:start;font-size:15px;line-height:1.5;cursor:pointer}
.rfp-line{width:18px;height:18px;margin:5px 0 0;accent-color:var(--red)}
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
        'connections': [{k: v for k, v in c.items() if k in ('id', 'a', 'b', 'label', 'how', 'gain', 'sowHow', 'sowGain', 'sowNote', 'availability', 'sowAvailability', 'prereqs', 'sowPrereqs', 'lines', 'more', 'source', 'flows', 'tier')} for c in catalog['connections']],
        'lines': {k: {kk: vv for kk, vv in v.items() if kk != 'evidence'} for k, v in catalog['lines'].items()}}
CAT_SCRIPT = '<script id="rfp-catalog">const RFP_CAT=' + json.dumps(slim, ensure_ascii=False).replace('</', '<\\/') + ';</script>\n'
# part three: the knowledge base, sow/rfp_facts.json, built by rfp_prototype/part3_research/build_facts.py (build_site.py runs it first)
FACTS = json.load(open(os.path.join(HERE, 'rfp_facts.json'), encoding='utf-8'))
CAT_SCRIPT += '<script id="rfp-facts">const RFP_FACTS=' + json.dumps(FACTS, ensure_ascii=False).replace('</', '<\\/') + ';</script>\n'
SCRIPT = inline('rfp_finder.js', 'rfp-finder') + inline('rfp_readers.js', 'rfp-readers') + inline('rfp_ui.js', 'rfp-builder')
ANSWERS = inline('rfp_answers.js', 'rfp-answers') + inline('rfp_proposal.js', 'rfp-proposal')   # step 75: Download proposal
END = "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script></body></html>"
replace(END, "render();sizeNotice();if(loadFailed)toast(LOAD_FAILED);\n</script>\n" + CAT_SCRIPT + SCRIPT + ANSWERS + "</body></html>")

open(path, 'w', encoding='utf-8').write(html)
print('step 49 applied: RFP Builder tab, panel, styles, finder and answers')
