"""Step 48, Change play (Nov 5 2026, Adam: "Let's fix what we know that needs to be fixed and then we have to be ready to
ship it"): Change play next to the play title on the Scope, Services and Statement of work steps only went back to the
canvas with the same play, so the presenter had to click Change play a second time. Those steps now come back with
?change=play (sow/patch_step48_sow.py), and the canvas opens its own "Change the play?" confirm (Choose another play),
then takes the mark off the address so a reload doesn't ask again. Run once on the step 47 template, then build.py and
../build_site.py.

    python3 sow/canvas/patch_step48_changeplay.py [path, default sow/canvas/template.html]
"""
import os
import sys
p = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'template.html')
html = open(p, encoding='utf-8').read()
old = "render();\ndocument.fonts&&document.fonts.ready.then(()=>{window.READY=true;});"
assert html.count(old) == 1 and 'change=play' not in html, 'run this once on the step 47 template'
html = html.replace(old, "render();\n"
                    "/* step 48: Change play on the SOW steps comes back with ?change=play and opens this page's own Change the play? confirm */\n"
                    "if(/[?&]change=play\\b/.test(location.search)){try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}if(!reloading&&play())ask('change');}\n"
                    "document.fonts&&document.fonts.ready.then(()=>{window.READY=true;});")
assert '—' not in html and '–' not in html
open(p, 'w', encoding='utf-8').write(html)
print('step 48 Change play: the canvas opens its Change the play? confirm when the SOW steps ask for it')
