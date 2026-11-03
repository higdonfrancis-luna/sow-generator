"""Step 33 of the SOW tool (Nov 3 2026, overnight, while Adam slept; he asked to "keep working until you're complete"):
what an independent verification of steps 30 to 32 confirmed (three breakers and a skeptic per lens).
- Create your own play keeps each catalog service as a canvas copy (CANVAS-SO1 and so on) holding its own copy of the
  wording. A browser or draft from an earlier version kept that old copy, so the line kept the old wording (step 32's
  paragraphs never reached SO1, SO2 and F02 there), and after a trip to Build the refreshed copy made every unedited
  line read "Scope edited". The live site (step 13) has 14 such lines on a typical Create your own play. Now a canvas
  copy of a catalog line takes the catalog's current wording when it loads, the wording it was saved with counts as
  unedited for its line, and the earlier wordings of a catalog line (PRIOR lists) count for its canvas copy too.
- The AEM play's printed SOW put its footer line alone on a last page once SO1 and SO2 grew (step 32). The Approval
  section and the footer now print together.
- With four buttons (step 31), Print / PDF sat alone on a second row at 390 to 480 and 790 to 990 pixels. The
  Statement of work step's heading now sits above its buttons below 1000 pixels, and on phones the four buttons form
  two even rows.
Run once on the step 32 file; every anchor must appear exactly once.

    python3 patch_step33.py index.html
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'PRIOR32' in html and 'sow-end' not in html, 'run this on the step 32 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')

# a canvas copy of a catalog line takes the catalog's current wording; the wording it was saved with counts as unedited
rep(" for(const c of (Array.isArray(s.canvas)?s.canvas:[]).slice(0,400)){",
    " /* a canvas copy of a catalog line takes the catalog's current wording when it loads; the wording it was saved with counts as unedited for its line (step 33) */\n"
    " const copied={};\n"
    " for(const c of (Array.isArray(s.canvas)?s.canvas:[]).slice(0,400)){")
rep("  d.canvas.push(canvasLine({...c,concept:!CATALOG.some(x=>x.id===c.id.replace(/^CANVAS-/,''))},c.plays));seen.add(c.id);",
    "  const t=CATALOG.find(x=>x.id===c.id.replace(/^CANVAS-/,''));\n"
    "  if(t){const q=c.plays[0];copied[c.id]=Object.fromEntries(['scope','deliverable','acceptance','assumptions','exclusions'].map(k=>[k,[c[k],...BAND_ORDER.map(b=>c.bands&&c.bands[b]&&typeof c.bands[b][k]==='string'?c.bands[b][k]:null)].filter(x=>typeof x==='string')]));\n"
    "   d.canvas.push(canvasLine({...t,id:c.id,name:neutralize(t,q,t.name,'name'),basis:neutralize(t,q,t.basis,'basis'),source:t.source,sourceTitle:t.sourceTitle,locked:c.locked===true},c.plays));}\n"
    "  else d.canvas.push(canvasLine({...c,concept:true},c.plays));\n"
    "  seen.add(c.id);")
# the earlier wordings of a catalog line count for its canvas copy too
rep("known=[c[key],...BAND_ORDER.map(b=>bandText(c,b,key)),PREVIOUS_SCOPES[c.id]?.[key],PRIOR_TEXT[c.id]?.[key],...(PRIOR15[c.id]?.[key]||[]),...(PRIOR17[c.id]?.[key]||[]),...(PRIOR18[c.id]?.[key]||[]),...(PRIOR19[c.id]?.[key]||[]),...(PRIOR24[c.id]?.[key]||[]),...(PRIOR32[c.id]?.[key]||[])]",
    "known=[c[key],...BAND_ORDER.map(b=>bandText(c,b,key)),PREVIOUS_SCOPES[baseId(c)]?.[key],PRIOR_TEXT[baseId(c)]?.[key],...(PRIOR15[baseId(c)]?.[key]||[]),...(PRIOR17[baseId(c)]?.[key]||[]),...(PRIOR18[baseId(c)]?.[key]||[]),...(PRIOR19[baseId(c)]?.[key]||[]),...(PRIOR24[baseId(c)]?.[key]||[]),...(PRIOR32[baseId(c)]?.[key]||[]),...(copied[c.id]?.[key]||[])]")

# the Approval section and the footer print together
rep("    html += section(9, 'Approval', approval, 'sow-approval');\n"
    "    html += '<footer class=\"sow-doc-footer\"><span>' + text(s.sowId, 'Statement of work') + '</span><span>Draft for review</span></footer></article>';",
    "    html += '<div class=\"sow-end\">' + section(9, 'Approval', approval, 'sow-approval');\n"
    "    html += '<footer class=\"sow-doc-footer\"><span>' + text(s.sowId, 'Statement of work') + '</span><span>Draft for review</span></footer></div></article>';")
rep(".sow-approval{break-inside:avoid}", ".sow-approval,.sow-end{break-inside:avoid}")

# the four Statement of work buttons stay on one row, or two even rows on phones
rep("@media(max-width:780px){.estimate-strip small{white-space:normal}.size-field{min-width:0;max-width:100%}}\n</style>",
    "@media(max-width:780px){.estimate-strip small{white-space:normal}.size-field{min-width:0;max-width:100%}}\n"
    "@media(max-width:1000px){.document-actions{flex-direction:column;align-items:flex-start}}@media(max-width:520px){.document-actions .top-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}}\n</style>")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 33 applied: canvas copies take the current wording, the footer prints with Approval, the buttons wrap evenly')
