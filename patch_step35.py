"""Step 35 of the SOW tool (Nov 3 2026, overnight; Adam: "keep working until you're complete"): what a verification of
step 34 confirmed (two breakers and a skeptic each). The SOW steps' half; the canvas's half is canvas/patch_step35.py.
- The one-time catch-up for browsers from the live site (step 13) let the SOW steps win outright, so it undid changes a
  partner made on the live canvas after the last Save and continue: a line turned on or off there, a size picked there,
  a rate typed there (CJA with Content improvements turned off, Large and $210: $267,120 on the live site, $219,600 after
  the catch-up). On the live site those changes were waiting for the next Save and continue. Now, whichever page opens
  first, a canvas saved before this version adds them to the engagement once, as that Save and continue would have: the
  canvas's own line choices for its play, a size it picked (not Typical, its default) and a rate typed there (not $150,
  its default); everything else stays as the SOW steps hold it. The next save marks the canvas current.
- An interrupted catch-up (Stop, Back, a dropped connection) left a hidden page and, through its session flag, turned
  the catch-up off for good in that browser. The flag is gone: the trip back carries ?synced=1 instead, which also stops
  any loop, and an interrupted trip simply runs again on the next load. Both pages hide themselves from the head, before
  anything paints, so a slow connection no longer flashes the picker and an empty Define the engagement form; this page
  shows itself again after 15 seconds if anything stops it. An address like sow/?sync=build opened later, with the canvas
  already current, just shows these steps.
- The size-reset notice for drafts from before October 31 no longer contradicts a size the partner then picked on the
  canvas: a size handed over from the canvas clears it.
- The FSI Scope note followed the discovery-to-answer workflow (step 34) but still stated Implement Brand Concierge from
  the answer alone. When that service doesn't match the answer, the note now says so, in the readiness list's words.
- With a 17-pixel scrollbar and the fallback font together, 1101 to 1115 pixels still put Print / PDF alone under the
  heading's row: the heading sits above the buttons below 1140 pixels (was 1100).
Run once on the step 34 file; every anchor must appear exactly once.

    python3 patch_step35.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'SYNC_BACK' in html and 'OLD_CANVAS' not in html, 'run this on the step 34 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# the catch-up's trip through this page paints nothing, and the page shows itself again if anything stops it
rep('<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">',
    '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">'
    "<script>/* the canvas's one-time catch-up passes through here (step 35): nothing paints, and the page shows itself again if anything stops it */\n"
    "try{if(/[?&]sync=build(&|$)/.test(location.search)){const c=JSON.parse(localStorage.getItem('abv-sow-build-v1')||'null');"
    "if(c&&typeof c==='object'&&!Array.isArray(c)&&c.v!==2){document.documentElement.style.visibility='hidden';setTimeout(()=>{document.documentElement.style.visibility='';},15000);}}}catch(e){}</script>")

# a canvas saved before this version adds its own waiting changes once, whichever page opens first; the catch-up returns marked
rep("if(SYNC_BACK){save();reloading=true;document.documentElement.style.visibility='hidden';location.replace('../');}",
    "/* a canvas saved by the live site before this version (step 35): its own changes since the last Save and continue (lines it turned on or off, a size it picked, a rate typed there) were waiting\n"
    "   for the next Save and continue, so they join the engagement now, once, whichever page opens first; the next save gives the canvas this engagement and marks it current */\n"
    "const OLD_CANVAS=(()=>{try{const c=JSON.parse(localStorage.getItem(CANVAS_KEY)||'null');return c&&typeof c==='object'&&!Array.isArray(c)&&c.v!==2?c:null;}catch(e){return null;}})();\n"
    "if(OLD_CANVAS){const c=OLD_CANVAS,n=Number(c.rate);\n"
    " if(validSize(c.size)&&c.size!=='typical'&&c.size!==state.size){state.sizeManual=true;applySize(c.size);delete state.sizeNote;}\n"
    " if(Number.isFinite(n)&&n>0&&n!==150)state.rate=globalRate(n);\n"
    " if(c.play===state.play&&c.ls&&typeof c.ls==='object'&&!Array.isArray(c.ls)){const est=state.estimates[state.play]||{};for(const s of catalog().filter(x=>x.plays.includes(state.play)&&!isCustom(x))){const v=c.ls[baseId(s)];if(typeof v==='boolean'&&est[s.id])est[s.id].on=v;}}}\n"
    "if(SYNC_BACK&&OLD_CANVAS){save();reloading=true;document.documentElement.style.visibility='hidden';location.replace('../?synced=1');}\n"
    "else if(SYNC_BACK)document.documentElement.style.visibility='';")

# a size handed over from the canvas is the partner's choice, so the old size-reset notice no longer applies
rep("if(validSize(h.size)&&h.size!==state.size){state.sizeManual=true;applySize(h.size);}",
    "if(validSize(h.size)&&h.size!==state.size){state.sizeManual=true;applySize(h.size);delete state.sizeNote;}")

# the FSI note says when Implement Brand Concierge doesn't match the answer, in the readiness list's words
rep(" /* the note follows the discovery-to-answer workflow's own choice, which the partner can change on Services (step 34) */\n"
    " const c04=!!state.estimates.fsi?.C04?.on;\n"
    " $('fsi-note').textContent={new:",
    " /* the note follows the services' own choices, which the partner can change on Services: the discovery-to-answer workflow (step 34) and Implement Brand Concierge (step 35) */\n"
    " const c04=!!state.estimates.fsi?.C04?.on,f02=!!state.estimates.fsi?.F02?.on;\n"
    " $('fsi-note').textContent=(state.fsiState==='healthy'?f02:!f02)?{new:'Brand Concierge is not live yet, but Implement Brand Concierge is off: add it on the Services step, or change the answer.',"
    "healthy:'Implement Brand Concierge is on, but the experience is live and healthy: remove it on the Services step, or change the answer.',"
    "remediate:'The live experience needs fixes first, but Implement Brand Concierge is off: add it on the Services step and rewrite its scope as the remediation work, or change the answer.'}[state.fsiState]:{new:")

# room for a scrollbar and the fallback font together
rep("@media(max-width:1100px){.document-actions{flex-direction:column;align-items:flex-start}}",
    "@media(max-width:1140px){.document-actions{flex-direction:column;align-items:flex-start}}")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 35 applied: the live canvas\'s waiting changes join once, a stopped catch-up retries and nothing flashes, '
      'the size notice, the FSI note on Implement Brand Concierge, the 1140-pixel breakpoint')
