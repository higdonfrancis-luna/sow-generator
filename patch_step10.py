"""Step 10 of the SOW tool (Oct 30 2026, 2:36 pm; Adam: "let's add start over", from mockups/start_over.png): a Start over
button in the top bar, next to Save draft and Open draft, asks in an Adobe-red box and then clears every step (client, scope,
services, rate, notes, partner name) back to a blank SOW on the Scope step. "New opportunity" under More, which kept the
partner name, rate and size, is removed with its handler, so there aren't two buttons doing nearly the same thing.
Run once on the step 9 file; every anchor must appear exactly once.

    python3 patch_step10.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


# the button, and New opportunity out of More
rep('<button id="open-draft">Open draft</button>',
    '<button id="open-draft">Open draft</button><button id="start-over" class="start-over">Start over</button>')
rep('<button id="new-draft">New opportunity</button>', '')

# styles, next to the existing modal styles
rep('.modal[hidden]{display:none}',
    '.modal[hidden]{display:none}.top-actions button.start-over{border-color:var(--red);color:var(--red)}'
    '.modal-card.start-over-card{width:520px;border-top:6px solid var(--red)}.start-over-card h2{font-size:22px;margin:0 0 10px}'
    '.start-over-card p{font-size:16px;line-height:1.45;margin:0}.start-over-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}')

# the confirm box, before the service library
rep('<div class="modal" id="service-modal"',
    '<div class="modal" id="start-over-modal" role="dialog" aria-modal="true" aria-labelledby="start-over-title" hidden>'
    '<div class="modal-card start-over-card"><h2 id="start-over-title">Start over?</h2>'
    '<p>This clears every step: client, scope, services, rate and notes. Save a draft first if you want to keep this one.</p>'
    '<div class="start-over-actions"><button id="start-over-cancel">Cancel</button>'
    '<button class="primary" id="start-over-confirm">Clear everything</button></div></div></div>'
    '<div class="modal" id="service-modal"')

# the handlers replace New opportunity's
rep("$('new-draft').onclick=()=>{if(!window.confirm('Start a new opportunity? Save the current draft first if you need to keep it.'))return;"
    "const {partner,rate,currency}=state;const size=state.size,sizeManual=state.sizeManual;"
    "state=normalize({...blank(),partner,rate,currency,size,sizeManual});go('scope');toast('New opportunity. Partner name and rate retained.');};",
    "$('start-over').onclick=()=>{$('start-over-modal').hidden=false;$('start-over-confirm').focus();};"
    "const closeStartOver=()=>{$('start-over-modal').hidden=true;};"
    "$('start-over-cancel').onclick=closeStartOver;"
    "$('start-over-modal').onclick=e=>{if(e.target===e.currentTarget)closeStartOver();};"
    "$('start-over-confirm').onclick=()=>{closeStartOver();state=normalize(blank());save();go('scope');toast('Started over. Every step is blank.');};")
rep("document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('service-modal').hidden)closeLibrary();});",
    "document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('service-modal').hidden)closeLibrary();"
    "if(e.key==='Escape'&&!$('start-over-modal').hidden)closeStartOver();});")

assert 'new-draft' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 10 applied')
