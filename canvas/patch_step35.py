"""Step 35 on the Build canvas (Nov 3 2026, overnight): the one-time catch-up of step 34, redone after its verification.
- It runs from the page's head, before anything paints: a canvas saved before this version (no v:2), with an
  engagement on the SOW steps, goes straight to sow/?sync=build, so a slow connection no longer flashes the play
  picker and the SOW steps' empty form. The SOW steps add the canvas's own waiting changes to the engagement once (lines
  turned on or off, a size picked, a rate typed on the live canvas after the last Save and continue), hand the
  engagement back and return to ?synced=1 (sow/patch_step35.py).
- No session flag any more: step 34's flag, set before the trip, turned the catch-up off for good after a Stop, a Back
  or a dropped connection, and left a hidden page. Now ?synced=1 stops any loop, an interrupted trip runs again on the
  next load, and a page whose trip was stopped reloads itself after 20 seconds instead of staying blank. The canvas saves
  nothing until the trip is done.
Run once on the step 34 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step35.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert "sessionStorage.getItem('abv-sow-catchup')" in html and 'CATCHUP' not in html, 'run this on the step 34 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# the catch-up starts from the head, before anything paints; a stopped trip reloads after 20 seconds
rep('<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Partner services statement of work</title>',
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    "<script>/* a canvas saved by the live site before this version, with an engagement on the SOW steps: those steps catch it up once, before anything paints (step 35); a stopped trip runs again */\n"
    "try{if(!/[?&]synced=1(&|$)/.test(location.search)){const s=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');if(s&&typeof s==='object'&&!Array.isArray(s)&&s.v!==2){"
    "const t=JSON.parse(localStorage.getItem('partner-sow-studio-v6')||'null');if(t&&typeof t==='object'&&[2,3,4].includes(t.version)){"
    "window.CATCHUP=true;document.documentElement.style.visibility='hidden';location.replace('sow/?sync=build');setTimeout(()=>location.reload(),20000);}}}}catch(e){}</script>\n"
    '<title>Partner services statement of work</title>')
# the step 34 trip and its session flag go; back from the trip, the address loses its mark
rep("/* a browser from before step 34: the SOW steps hold its rate and service choices, so they hand them to this canvas once, as their Build tab does, and come straight back */\n"
    "try{const s=JSON.parse(localStorage.getItem(KEY)||'null'),t=JSON.parse(localStorage.getItem(TOOL_KEY)||'null');if(s&&typeof s==='object'&&s.v!==2&&t&&typeof t==='object'&&[2,3,4].includes(t.version)&&!sessionStorage.getItem('abv-sow-catchup')){sessionStorage.setItem('abv-sow-catchup','1');reloading=true;document.documentElement.style.visibility='hidden';location.replace('sow/?sync=build');}}catch(e){}\n",
    "/* back from the one-time catch-up (step 35): the address loses its mark */\n"
    "if(/[?&]synced=1(&|$)/.test(location.search))try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}\n")
# while the trip is under way the canvas saves nothing and takes no input
rep("let lastSaved=null,reloading=false;", "let lastSaved=null,reloading=window.CATCHUP===true;")

for gone in ('abv-sow-catchup', 'sessionStorage'):
    assert gone not in html, f'{gone} is still in the template'
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 35 applied on the canvas: the catch-up starts from the head, with no session flag, and retries when stopped')
