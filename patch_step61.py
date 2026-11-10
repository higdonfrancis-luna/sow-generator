"""Step 61 (Nov 10 2026, Adam: "Retire both"): a statement of work saved with one of the two services retired when AEM
Forms joined the tool keeps it.

"Site forms that submit to Marketo" (XB09) and "Site form requests into Workfront" (XB13) were services from the canvas,
so a statement of work that used one holds a copy of it. They are no longer in the catalog (sow/canvas/data_step61.py), and
the next trip through Build would have dropped that copy. When a saved state or a draft opens now, a copy that was in use
(turned on, or with edited hours or wording) becomes the partner's own service, with the name, wording, hours, rate and
choice it was saved with, the same way step 34 kept the retired technical SEO service. A copy that was only on offer, never
used, is dropped.

Run once on the step 60 SOW page, then build the canvas and the site.

    python3 sow/patch_step61.py sow/index.html
    python3 sow/canvas/build.py && python3 sow/build_site.py
"""
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'RETIRED_CANVAS' not in html, 'step 61 is already in this page'


def rep(old, new):
    global html
    assert html.count(old) == 1, (old[:90], html.count(old))
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
PARENS = html.count('(') - html.count(')')

# 1. the two retired canvas services, by the id their copy carries in a statement of work
rep('const O03_RETIRED=',
    "/* step 61: canvas services retired when AEM Forms became a product (Site forms that submit to Marketo, Site form requests into Workfront) */\n"
    "const RETIRED_CANVAS=['CANVAS-XB09','CANVAS-XB13'];\n"
    'const O03_RETIRED=')
# 2. their canvas copy is not loaded as a canvas service (its row moves below, like the retired O03's)
rep("||c.id==='CANVAS-O03'||seen.has(c.id)||typeof c.name!=='string'",
    "||c.id==='CANVAS-O03'||RETIRED_CANVAS.includes(c.id)||seen.has(c.id)||typeof c.name!=='string'")
# 3. a copy that was in use becomes the partner's own service, and its whole row moves with it
rep(' for(const line of [...d.custom,...d.canvas])ProductCopy.service(line);',
    " /* step 61: a retired canvas service this statement of work used stays, as the partner's own service, with the wording and the row it was saved with */\n"
    " for(const c of (Array.isArray(s.canvas)?s.canvas:[]).slice(0,400)){\n"
    "  if(!c||typeof c!=='object'||!RETIRED_CANVAS.includes(c.id)||typeof c.name!=='string'||!Array.isArray(c.plays))continue;\n"
    "  for(const p of c.plays.filter(p=>validPlay(p))){const o=s.estimates?.[p]?.[c.id];if(!o||typeof o!=='object'||!(o.on===true||o.hoursEdited===true||o.scopeChanged===true))continue;\n"
    "   const id='CUSTOM-'+c.id.replace(/^CANVAS-/,'')+'-'+p;if(seen.has(id))continue;let base=amount(o.hours,amount(c.base,16));if(base==='')base=0;\n"
    "   const scope=text(o.scope,text(c.scope,'')||text(c.name,'',180));\n"
    "   d.custom.push({id,name:text(c.name,'',180),stage:['Launch','Connect','Optimize'].includes(c.stage)?c.stage:'Connect',base,low:0,high:base,unit:(o.cadence||c.unit)==='monthly'?'monthly':'one-time',plays:[p],scope,"
    "deliverable:text(o.deliverable,'')||scope,acceptance:text(o.acceptance,'')||OWN_NEW.acceptance,assumptions:text(o.assumptions,'')||OWN_NEW.assumptions,exclusions:text(o.exclusions,'')||'Work outside the described scope.',"
    "basis:'Kept from this draft: the tool retired this service on November 10, 2026, so it is now your own service.'});seen.add(id);(moved[p]=moved[p]||{})[id]=o;}}\n"
    ' for(const line of [...d.custom,...d.canvas])ProductCopy.service(line);')

assert html.count('{') - html.count('}') == BRACES and html.count('(') - html.count(')') == PARENS, 'braces or parentheses no longer balance'
open(path, 'w', encoding='utf-8').write(html)
print('step 61 applied: a statement of work that used a retired canvas service keeps it as the partner\'s own service')
