"""Step 48 on the SOW steps (Nov 5 2026, Adam: "Let's fix what we know that needs to be fixed and then we have to be ready
to ship it"). Two fixes from the demo rehearsal; the canvas half of the second is sow/canvas/patch_step48_changeplay.py.

1. Download a marked draft. Download SOW, Print / PDF and Services CSV refused to run while "Before you issue this SOW"
   listed open items, which looked broken in a demo. Now, while items remain open, they produce the statement of work
   marked as a draft: a banner at the top of the document (on screen, printed and in the downloaded file) says
   "Draft, not ready to issue" and the number of open items, the file names end in -DRAFT, and the Services CSV carries
   the same mark in its first row. A toast says the download is a draft. With no open items, everything is as before.
   The red list no longer pushes the document down: it folds into a collapsed details element between the buttons and
   the document, whose summary reads "12 items to finish before you issue this SOW" (open it to see the list).
2. Change play next to the play title goes back to the canvas with ?change=play, and the canvas opens its own
   "Change the play?" confirm (Choose another play), so one click changes the play. The Build tab is unchanged.

Run once on the step 47 SOW page, then build_site.py.

    python3 sow/patch_step48_sow.py sow/index.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'DRAFT_MARK' not in html, 'run this once on the step 47 SOW page'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# 1. the list folds into a collapsed details element above the document, below the buttons
rep('<section id="document-panel" class="panel" role="tabpanel" hidden><div class="readiness" id="readiness" hidden></div><div class="document-actions">',
    '<section id="document-panel" class="panel" role="tabpanel" hidden><div class="document-actions">')
rep('<div id="sow-preview"></div></section>',
    '<details class="readiness" id="readiness" hidden></details><div id="sow-preview"></div></section>')
rep('.readiness{border:2px solid var(--red);border-radius:6px;padding:14px 18px;margin:0 0 18px;background:#fff}.readiness h3{font-size:17px;margin:0 0 6px}',
    '.readiness{border:2px solid var(--red);border-radius:6px;padding:10px 16px;margin:0 0 14px;background:#fff}.readiness summary{cursor:pointer;font-size:16px;font-weight:700;color:var(--ink)}.readiness[open] summary{margin-bottom:8px}'
    '.sow-not-ready{margin:0 0 20px;padding:10px 14px;border:2px solid #EB1000;border-radius:8px;background:#fff;color:#1C1C1C;font-size:15px;font-weight:700}')
# printing shows the marked draft, not the list (the banner carries the count)
rep('@media print{body.not-ready #sow-preview{display:none}}', '@media print{#readiness{display:none!important}}')
rep("function renderReadiness(){const list=issues(),box=$('readiness');box.hidden=!list.length;document.body.classList.toggle('not-ready',list.length>0);box.innerHTML=list.length?'<h3>Before you issue this SOW</h3><ul>'+list.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class=\"hint\">Download, Print and CSV export open once these are done. Save draft works anytime.</p>':'';return list;}\n"
    "function ready(){if(!renderReadiness().length)return true;if(step!=='document')go('document');toast('Finish the items under Before you issue this SOW first.');return false;}",
    "function renderReadiness(){const list=issues(),box=$('readiness');box.hidden=!list.length;box.innerHTML=list.length?'<summary>'+(list.length===1?'1 item':list.length+' items')+' to finish before you issue this SOW</summary><ul>'+list.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class=\"hint\">Until these are done, Download SOW, Print / PDF and Services CSV mark the statement of work as a draft, not ready to issue. Save draft works anytime.</p>':'';return list;}\n"
    "/* step 48: with items still open, the exports go out marked as a draft instead of refusing to run */\n"
    "const DRAFT_MARK=n=>'Draft, not ready to issue: '+n+(n===1?' open item.':' open items.');\n"
    "const draftDoc=(doc,n)=>n?doc.replace('<article class=\"sow-document\" aria-label=\"Statement of work preview\">',m=>m+'<p class=\"sow-not-ready\" role=\"note\">'+DRAFT_MARK(n)+'</p>'):doc;\n"
    "const draftToast=n=>{if(n)toast('Downloaded as a draft. Finish the '+(n===1?'item':n+' items')+' under Before you issue this SOW to issue it.');};")
rep("function renderDocument(){$('sow-preview').innerHTML=SOWDocument.render(docState(),selectedLines(),totals());renderReadiness();}",
    "function renderDocument(){const n=renderReadiness().length;$('sow-preview').innerHTML=draftDoc(SOWDocument.render(docState(),selectedLines(),totals()),n);}")
rep("$('download-sow').onclick=()=>{if(!ready())return;const body=SOWDocument.render(docState(),selectedLines(),totals()),css=document.querySelector('style').textContent;download(slug()+'.html',",
    "$('download-sow').onclick=()=>{const n=renderReadiness().length,body=draftDoc(SOWDocument.render(docState(),selectedLines(),totals()),n),css=document.querySelector('style').textContent;download(slug()+(n?'-DRAFT':'')+'.html',")
rep("'<'+ '/body></html>','text/html');};",
    "'<'+ '/body></html>','text/html');draftToast(n);};")
rep("$('print-sow').onclick=()=>{renderDocument();if(!ready())return;window.print();};",
    "$('print-sow').onclick=()=>{renderDocument();window.print();};")
rep("$('export-csv').onclick=()=>{if(!ready())return;const header=",
    "$('export-csv').onclick=()=>{const n=renderReadiness().length,header=")
rep("download(slug()+'.csv','\\uFEFF'+[header,...rows].map(r=>r.map(cell).join(',')).join('\\r\\n'),'text/csv;charset=utf-8');};",
    "download(slug()+(n?'-DRAFT':'')+'.csv','\\uFEFF'+[...(n?[[DRAFT_MARK(n)]]:[]),header,...rows].map(r=>r.map(cell).join(',')).join('\\r\\n'),'text/csv;charset=utf-8');draftToast(n);};")

# 2. Change play next to the play title asks the canvas to open its Change the play? confirm
rep('<button data-build>Change play</button></header>', '<button data-build data-change>Change play</button></header>')
rep("document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play&&(state.handoffAt>0||(!!e.target.closest('.steps [data-build]')&&hasWork(state.play))))syncCanvas(true);location.href='../index.html';}});",
    "/* step 48: Change play comes back with ?change=play, and the canvas opens its own Change the play? confirm */\n"
    "document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play&&(state.handoffAt>0||(!!e.target.closest('.steps [data-build]')&&hasWork(state.play))))syncCanvas(true);location.href='../index.html'+(e.target.closest('[data-change]')?'?change=play':'');}});")

assert html.count('{') - html.count('}') == BRACES
assert 'ready()' not in html and "'not-ready'" not in html and 'body.not-ready' not in html and '<h3>Before you issue' not in html
assert '—' not in html and '–' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 48 applied on the SOW steps: open items export a marked draft, the list folds up, and Change play opens the canvas confirm')
