"""Step 34 of the SOW tool (Nov 3 2026, overnight, while Adam slept; he asked to "keep working until you're complete"):
what a verification of step 33 confirmed, most of it about the work partners saved on the live site (step 13), which
carries over when this version is deployed. None of it was caused by step 33; it is fixed before the deploy.
- The front page opened first after the deploy: a browser from the live site keeps its rate and service choices in the
  SOW steps, but the canvas reads only its own state, which the live site saved without them (and with the old $150
  default, which the canvas rightly ignores). So the rate went blank and the services chosen on the SOW steps (the FSI
  discovery-to-answer workflow, the Commerce deployment pilot, lines added on Services) went off at the next Save and
  continue. Now the canvas sends such a browser through the SOW steps once (sow/?sync=build): they hand their rate and
  choices to the canvas, exactly as the Build tab does, and come straight back. The same outcome as opening the SOW first.
  This page's half: SYNC_BACK. The size-reset notice that catch-up skips shows on the next visit to these steps.
- Research lines (service concepts) from the live site kept the live site's wording, and after a trip to Build their
  unedited texts read "Scope edited" (on a typical Create your own play, dozens of lines; on CJA, CJA data
  preparation). Now, when the canvas hands a line over again with new wording, a text still in the old copy's wording
  takes the new one, and an edited one is kept, the same rule step 33 gave catalog copies.
- Two plays in one browser that take the same canvas line (CANVAS-C05 on CJA and AEM, for example): a reload kept only
  the first play's copy, so the second play lost the line, its choice and its rate (drafts too). Each play now keeps its
  own copy, and a line that leaves one play's canvas waits there even when another play still has it.
- Create your own play with the retired Technical SEO and AI-search improvements on: it became a concept, then waited
  for a product that no longer exists, and left the SOW while Build kept counting it. It now becomes the partner's own
  service with its edits, as on the fixed plays since November 1.
- Sites Optimizer setup, Monthly SEO fixes and Implement Brand Concierge (and the other lines with two references)
  showed one reference on Create your own play: canvas copies now keep the second one.
- The FSI Scope note said the discovery-to-answer workflow was off while it was on (every FSI play from the live site,
  and any FSI play where the partner adds it on Services). The note now follows that service's own choice.
- The four Statement of work buttons: the heading sits above them below 1100 pixels (was 1000), which leaves room for a
  scrollbar and for the fallback font when Google Fonts is blocked, and on phones (560 pixels and below) they share two
  even rows that can never push a button past the screen's edge with large text (the grid could).
Run once on the step 33 file; every anchor must appear exactly once.

    python3 patch_step34.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'sow-end' in html and 'SYNC_BACK' not in html, 'run this on the step 33 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# each play keeps its own copy of a canvas line; the retired O03's canvas copy is not loaded (its row moves below)
rep("  if(!c||typeof c!=='object'||!/^CANVAS-[\\w-]{1,80}$/.test(c.id)||seen.has(c.id)||typeof c.name!=='string'||!Array.isArray(c.plays)||!c.plays.every(p=>validPlay(p)))continue;",
    "  if(!c||typeof c!=='object'||!/^CANVAS-[\\w-]{1,80}$/.test(c.id)||c.id==='CANVAS-O03'||seen.has(c.id)||typeof c.name!=='string'||!Array.isArray(c.plays)||!c.plays.length||!c.plays.every(p=>validPlay(p))||d.canvas.some(x=>x.id===c.id&&x.plays.some(q=>c.plays.includes(q))))continue;")
rep("  else d.canvas.push(canvasLine({...c,concept:true},c.plays));\n  seen.add(c.id);\n }",
    "  else d.canvas.push(canvasLine({...c,concept:true},c.plays));\n }")
# two plays' copies of one catalog line: the wording each was saved with counts as unedited
rep("copied[c.id]=Object.fromEntries(['scope','deliverable','acceptance','assumptions','exclusions'].map(k=>[k,[c[k],",
    "copied[c.id]=Object.fromEntries(['scope','deliverable','acceptance','assumptions','exclusions'].map(k=>[k,[...(copied[c.id]?.[k]||[]),c[k],")
# Create your own play's copy of the retired O03 becomes the partner's own service, like the fixed plays' O03
rep("for(const p of Object.keys(PLAYS)){const o=s.estimates?.[p]?.O03;if(!o||",
    "for(const p of Object.keys(PLAYS)){const o=s.estimates?.[p]?.O03||s.estimates?.[p]?.['CANVAS-O03'];if(!o||")
# the size-reset notice the front page's catch-up skipped shows on the next visit
rep("if(s.v14!==true&&s.sizeManual!==true&&d.size!=='typical'){d.size='typical';d.sizeNote=true;}",
    "if(s.v14!==true&&s.sizeManual!==true&&d.size!=='typical'){d.size='typical';d.sizeNote=true;}if(s.sizeNote===true)d.sizeNote=true;")
# canvas copies keep a second reference
rep("sourceTitle:text(c.sourceTitle,''),concept,bands:",
    "sourceTitle:text(c.sourceTitle,''),source2:typeof c.source2==='string'&&/^https:\\/\\//.test(c.source2)?c.source2:'',sourceTitle2:text(c.sourceTitle2,''),concept,bands:")
# the readiness list reads this play's copy of a line
rep("base=catalog().find(x=>x.id===s.id);", "base=catalog().find(x=>x.id===s.id&&x.plays.includes(state.play));")
# a line that left this play's canvas waits even when another play has it; a line handed over with new wording takes it where unedited
rep(" for(const c of before)if(!state.canvas.some(x=>x.id===c.id)){if(h.fresh===true)delete state.estimates[p][c.id];else state.canvas.push({...c,locked:true});}",
    " for(const c of before)if(!state.canvas.some(x=>x.id===c.id&&x.plays.includes(p))){if(h.fresh===true)delete state.estimates[p][c.id];else state.canvas.push({...c,locked:true});}\n"
    " /* a line handed over again with new wording (a research line from an earlier version): a text still in its old copy's wording takes the new one; an edited one is kept (step 34) */\n"
    " {const old=new Map(before.map(c=>[c.id,c])),now=CUSTOM_BV;\n"
    "  for(const n of state.canvas.filter(c=>c.plays.includes(p))){const o=old.get(n.id),r=(state.estimates[p]||{})[n.id];if(!o||!r)continue;\n"
    "   for(const k of TEXT_KEYS){const known=[];for(const bv of [wasBV,now]){CUSTOM_BV=bv;known.push(...[o[k],...BAND_ORDER.map(b=>bandText(o,b,k))].filter(x=>typeof x==='string').flatMap(x=>variants(o,k,x,p)));}CUSTOM_BV=now;if(known.includes(r[k]))r[k]=lineText(n,p,r.band,k);}}}")
# the front page's one-time catch-up: hand the rate and choices to the canvas, as the Build tab does, and go straight back
rep("{const q=new URLSearchParams(location.search).get('play');",
    "/* the front page sends a browser from before step 34 here once (sync=build): these steps hand their rate and choices to the canvas and go straight back */\n"
    "const SYNC_BACK=new URLSearchParams(location.search).get('sync')==='build';\n"
    "{const q=new URLSearchParams(location.search).get('play');")
rep("document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play&&state.handoffAt>0)syncCanvas(true);location.href='../';}});",
    "document.addEventListener('click',e=>{if(e.target.closest('[data-build]')){save();if(canvasPlay()!==state.play&&state.handoffAt>0)syncCanvas(true);location.href='../';}});\n"
    "if(SYNC_BACK){save();reloading=true;document.documentElement.style.visibility='hidden';location.replace('../');}")

# the FSI note follows the discovery-to-answer workflow's own choice
rep(" $('fsi-note').textContent={new:'This engagement implements Brand Concierge (Implement Brand Concierge is on), and its golden-answer tests include the Brand Visibility discovery questions. The separate discovery-to-answer workflow is off; add it if the customer also wants the question-to-source map and its refresh workflow.',healthy:'This engagement builds on the live Brand Concierge experience: the discovery-to-answer workflow maps the Brand Visibility questions to approved sources and tests the handoff. Implement Brand Concierge is off.',remediate:",
    " /* the note follows the discovery-to-answer workflow's own choice, which the partner can change on Services (step 34) */\n"
    " const c04=!!state.estimates.fsi?.C04?.on;\n"
    " $('fsi-note').textContent={new:'This engagement implements Brand Concierge (Implement Brand Concierge is on), and its golden-answer tests include the Brand Visibility discovery questions. '+(c04?'The separate discovery-to-answer workflow is on too, for the question-to-source map and its refresh workflow.':'The separate discovery-to-answer workflow is off; add it if the customer also wants the question-to-source map and its refresh workflow.'),"
    "healthy:c04?'This engagement builds on the live Brand Concierge experience: the discovery-to-answer workflow maps the Brand Visibility questions to approved sources and tests the handoff. Implement Brand Concierge is off.':'This engagement builds on the live Brand Concierge experience. Implement Brand Concierge is off, and so is the discovery-to-answer workflow; add it to map the Brand Visibility questions to approved sources and test the handoff.',remediate:")

# the four Statement of work buttons: heading above below 1100 pixels; two even rows on phones that wrap instead of overflowing
rep("@media(max-width:1000px){.document-actions{flex-direction:column;align-items:flex-start}}@media(max-width:520px){.document-actions .top-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}}",
    "@media(max-width:1100px){.document-actions{flex-direction:column;align-items:flex-start}}@media(max-width:560px){.document-actions .top-actions{width:100%}.document-actions .top-actions button{flex:1 1 calc(50% - 4px)}}")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 34 applied: the front page catches up once, research lines take new wording where unedited, each play keeps its own canvas copy, '
      'the retired O03 on your own play is kept, second references, the FSI note, the four buttons')
