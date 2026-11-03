"""Step 36 on the Build canvas (Nov 3 2026, overnight): what a focused verification of step 35 confirmed about the
one-time catch-up's trip (the SOW steps' half, including the end of step 35's merge, is sow/patch_step36.py).
- The trip carries the time it started (sow/?sync=build&t=...), and the way back carries the time it ended
  (?synced=...). Only a mark under two minutes old skips the catch-up, so an address like /?synced=1 from the browser's
  history no longer skips it for a canvas that still needs it (its hand-over then cleared the engagement's rate).
- The 20-second reload of a stopped trip runs once per tab: on a connection whose first byte took over 20 seconds it
  restarted the trip forever; now the second attempt waits as long as it takes.
- With no engagement saved on the SOW steps (no catch-up), a rate typed on the live canvas is kept (not its $150
  default, which the Oct 31 audit dropped); it was lost when the front page opened first.
Run once on the step 35 template, then build.py and build_site.py.

    python3 sow/canvas/patch_step36.py sow/canvas/template.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'window.CATCHUP=true' in html and 'sync=build&t=' not in html, 'run this on the step 35 template'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# the trip is time-marked both ways; a stopped trip reloads by itself once per tab
rep("<script>/* a canvas saved by the live site before this version, with an engagement on the SOW steps: those steps catch it up once, before anything paints (step 35); a stopped trip runs again */\n"
    "try{if(!/[?&]synced=1(&|$)/.test(location.search)){const s=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');if(s&&typeof s==='object'&&!Array.isArray(s)&&s.v!==2){"
    "const t=JSON.parse(localStorage.getItem('partner-sow-studio-v6')||'null');if(t&&typeof t==='object'&&[2,3,4].includes(t.version)){"
    "window.CATCHUP=true;document.documentElement.style.visibility='hidden';location.replace('sow/?sync=build');setTimeout(()=>location.reload(),20000);}}}}catch(e){}</script>",
    "<script>/* a canvas saved by the live site before this version, with an engagement on the SOW steps: those steps catch it up once, before anything paints (steps 35 and 36).\n"
    "   The trip carries the time it started and comes back with the time it ended; only a fresh mark skips it. A stopped trip runs again by itself once per tab, and on any later load */\n"
    "try{const m=/[?&]synced=(\\d+)/.exec(location.search);if(!(m&&Math.abs(Date.now()-Number(m[1]))<120000)){const s=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');if(s&&typeof s==='object'&&!Array.isArray(s)&&s.v!==2){"
    "const t=JSON.parse(localStorage.getItem('partner-sow-studio-v6')||'null');if(t&&typeof t==='object'&&[2,3,4].includes(t.version)){"
    "window.CATCHUP=true;document.documentElement.style.visibility='hidden';location.replace('sow/?sync=build&t='+Date.now());"
    "try{if(!sessionStorage.getItem('abv-sow-retried')){sessionStorage.setItem('abv-sow-retried','1');setTimeout(()=>location.reload(),20000);}}catch(e){}}}}}catch(e){}</script>")
# back from the trip, any mark is taken off the address
rep("/* back from the one-time catch-up (step 35): the address loses its mark */\n"
    "if(/[?&]synced=1(&|$)/.test(location.search))try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}",
    "/* back from the one-time catch-up (steps 35 and 36): the address loses its mark */\n"
    "if(/[?&]synced=\\d+/.test(location.search))try{history.replaceState(null,'',location.pathname+location.hash);}catch(e){}")
# a rate typed on the live canvas is kept; only its $150 default is dropped (with an engagement saved, the catch-up gives the engagement's rate first)
rep("rate:s.v===2&&Number(s.rate)>0?Number(s.rate):0", "rate:Number(s.rate)>0&&(s.v===2||Number(s.rate)!==150)?Number(s.rate):0")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 36 applied on the canvas: the trip is time-marked both ways, the stopped-trip reload runs once per tab, a typed live-canvas rate is kept')
