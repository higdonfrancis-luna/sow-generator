"""Step 36 of the SOW tool (Nov 3 2026, overnight; Adam: "keep working until you're complete"): what a focused
verification of step 35 confirmed (a breaker and a skeptic for each of two lenses). The SOW steps' half; the canvas's
half is canvas/patch_step36.py.
- Step 35's merge is gone. It added a live canvas's non-default values (line choices, a size, a rate) to the engagement,
  but the live site keeps those values after every Save and continue and records no time, so they can't be told apart
  from values the partner changed on these steps later: it undid later Services work (a line added back, $190 typed,
  Small picked, a rate cleared, cents), mixed another customer's canvas into a draft opened on the live site (A's $175,
  Large and line choices in B's SOW), and moved one play's rate and size into another. Back to step 34's rule: the saved
  engagement wins, whichever page opens first. Changes made on the live canvas after the last Save and continue are not
  carried over (UNRESOLVED item 23; a one-time choice for the partner is proposed there for Adam).
- The trip carries the time it started (sow/?sync=build&t=...): only a trip under two minutes old hides this page and
  goes back, and it goes back even when another tab caught the canvas up first, so two tabs opened together both end on
  the canvas. An old or unmarked address just shows these steps.
- If the trip stalls (Stop on the way back, or before this page finished loading), this page loads again as the plain
  SOW steps 30 seconds after the trip reached it (step 35 showed it after 15 seconds but ignored every click, and on a
  very slow connection showed the empty form mid-load). Any plain load of these steps hands the engagement to the
  canvas anyway, so a stalled trip still ends caught up.
- With no engagement saved yet, a rate the partner typed on the live canvas (not its $150 default) and its size are
  taken, as the canvas now takes them too.
Run once on the step 35 file; every anchor must appear exactly once.

    python3 patch_step36.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'OLD_CANVAS' in html and 'sync=build&t=' not in html, 'run this on the step 35 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# only a fresh trip hides this page; if the way back is stopped, it loads again as the plain SOW steps
rep("<script>/* the canvas's one-time catch-up passes through here (step 35): nothing paints, and the page shows itself again if anything stops it */\n"
    "try{if(/[?&]sync=build(&|$)/.test(location.search)){const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');if(c&&typeof c==='object'&&!Array.isArray(c)&&c.v!==2){document.documentElement.style.visibility='hidden';setTimeout(()=>{document.documentElement.style.visibility='';},15000);}}}catch(e){}</script>",
    "<script>/* the canvas's one-time catch-up passes through here (steps 35 and 36): a trip it just started (marked under two minutes ago) paints nothing, and if the trip stalls the page loads again as the plain SOW steps */\n"
    "try{const q=new URLSearchParams(location.search);if(q.get('sync')==='build'&&Math.abs(Date.now()-Number(q.get('t')))<120000){document.documentElement.style.visibility='hidden';setTimeout(()=>location.replace(location.pathname+location.hash),30000);}}catch(e){}</script>")
rep("/* the front page sends a browser from before step 34 here once (sync=build): these steps hand their rate and choices to the canvas and go straight back */\n"
    "const SYNC_BACK=new URLSearchParams(location.search).get('sync')==='build';",
    "/* the front page sends a browser from before step 34 here once (sync=build, with the time the trip started): these steps hand the engagement to the canvas and go straight back; an old or unmarked address just shows these steps (step 36) */\n"
    "const SYNC_BACK=(()=>{const q=new URLSearchParams(location.search);return q.get('sync')==='build'&&Math.abs(Date.now()-Number(q.get('t')))<120000;})();")
# step 35's merge goes: the saved engagement wins; the trip saves only for a canvas still unmarked and always goes back, marked
rep("/* a canvas saved by the live site before this version (step 35): its own changes since the last Save and continue (lines it turned on or off, a size it picked, a rate typed there) were waiting\n"
    "   for the next Save and continue, so they join the engagement now, once, whichever page opens first; the next save gives the canvas this engagement and marks it current */\n"
    "const OLD_CANVAS=(()=>{try{const c=JSON.parse(localStorage.getItem(CANVAS_KEY)||'null');return c&&typeof c==='object'&&!Array.isArray(c)&&c.v!==2?c:null;}catch(e){return null;}})();\n"
    "if(OLD_CANVAS){const c=OLD_CANVAS,n=Number(c.rate);\n"
    " if(validSize(c.size)&&c.size!=='typical'&&c.size!==state.size){state.sizeManual=true;applySize(c.size);delete state.sizeNote;}\n"
    " if(Number.isFinite(n)&&n>0&&n!==150)state.rate=globalRate(n);\n"
    " if(c.play===state.play&&c.ls&&typeof c.ls==='object'&&!Array.isArray(c.ls)){const est=state.estimates[state.play]||{};for(const s of catalog().filter(x=>x.plays.includes(state.play)&&!isCustom(x))){const v=c.ls[baseId(s)];if(typeof v==='boolean'&&est[s.id])est[s.id].on=v;}}}\n"
    "if(SYNC_BACK&&OLD_CANVAS){save();reloading=true;document.documentElement.style.visibility='hidden';location.replace('../?synced=1');}\n"
    "else if(SYNC_BACK)document.documentElement.style.visibility='';\n",
    "/* the catch-up (steps 34 to 36): a canvas saved before this version takes the engagement these steps hold (its rate, size and every choice), as their Build tab gives it, and the trip goes back marked.\n"
    "   The saved engagement wins: the live site kept no record of when its canvas changed, so a canvas value can't be told apart from one changed here later, or from another customer's draft */\n"
    "if(SYNC_BACK){try{const c=JSON.parse(localStorage.getItem(CANVAS_KEY)||'null');if(c&&typeof c==='object'&&!Array.isArray(c)&&c.v!==2)save();}catch(e){}reloading=true;document.documentElement.style.visibility='hidden';location.replace('../?synced='+Date.now());}\n")
# with no engagement saved yet, a rate typed on the live canvas (not its $150 default) and its size are taken
rep("if(c&&typeof c==='object'&&c.v===2){if(Number(c.rate)>0)state.rate=globalRate(c.rate);if(validSize(c.size))state.size=c.size;if(Number.isInteger(c.months)&&c.months>=1&&c.months<=120)state.months=c.months;if(['USD','EUR','GBP','CAD','AUD'].includes(c.cur))state.currency=c.cur;}}}catch(e){}",
    "if(c&&typeof c==='object'&&c.v===2){if(Number(c.rate)>0)state.rate=globalRate(c.rate);if(validSize(c.size))state.size=c.size;if(Number.isInteger(c.months)&&c.months>=1&&c.months<=120)state.months=c.months;if(['USD','EUR','GBP','CAD','AUD'].includes(c.cur))state.currency=c.cur;}"
    "else if(c&&typeof c==='object'&&!Array.isArray(c)){const n=Number(c.rate);if(n>0&&n!==150)state.rate=globalRate(n);if(validSize(c.size))state.size=c.size;}}}catch(e){}")

for gone in ('OLD_CANVAS', "synced=1'", 'c.ls[baseId(s)]'):
    assert gone not in html, f'{gone} is still in the file'
assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 36 applied: the merge is gone (the saved engagement wins), the trip is time-marked, a stalled trip reloads the plain SOW steps, '
      'a typed live-canvas rate is kept with no engagement saved')
