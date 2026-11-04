"""Step 45 on the SOW steps (Nov 4 2026, Adam: "go"; the canvas half is sow/canvas/patch_step45.py):
- the engagement keeps the new outside systems on the canvas (Ad platforms, BI tools, Search data, Authoring documents,
  Website on another CMS) and AEM Assets added on the AEM play, so going back to Build brings them back. Their services
  are research lines, which come over with the hand-over as service concepts, so the catalog does not change.
- CDN log forwarding (OX1) starts on whenever the CDN is on the canvas, and a new engagement starts every Brand
  Visibility play with the CDN on, as the canvas does, so a play's totals match on both sides (a saved one keeps its own).
- on Create your own play, an outside system's catalog service counts only with the Adobe product it connects to (CJA
  for the warehouse, cloud storage and CRM services; Brand Visibility for the CDN ones), as the canvas counts it.
Run once on the step 44 SOW page, then build_site.py.

    python3 sow/patch_step45.py sow/index.html
"""
import sys
path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'OUTSIDE_MORE' not in html, 'run this once on the step 44 SOW page'


def rep(old, new):
    global html
    assert html.count(old) == 1, old[:90]
    html = html.replace(old, new)


BRACES = html.count('{') - html.count('}')
rep("function outsideAllowed(p,id){return CATALOG.some(c=>c.outside===id&&c.plays.includes(p));}",
    "/* step 45: systems on the canvas whose services are research lines (concepts), and AEM Assets added on the AEM play, by the plays that offer them */\n"
    "const OUTSIDE_MORE={ads:['cja','custom'],bi:['cja','custom'],search:['cja','commerce','aem','fsi','abv','custom'],csrc:['aem','custom'],cms:['fsi','custom'],aemassets:['aem']};\n"
    "function outsideAllowed(p,id){return CATALOG.some(c=>c.outside===id&&c.plays.includes(p))||(OUTSIDE_MORE[id]||[]).includes(p);}")
rep("const OUT_START=['OX3','OX4','OX5']", "const OUT_START=['OX1','OX3','OX4','OX5']")
# on Create your own play a system's service counts only with the Adobe product it connects to, as on the canvas: since step 45
# a warehouse or a CRM can sit there without CJA (beside Real-Time CDP, Journey Optimizer, Marketo or Target), and a CDN without Brand Visibility
rep("const outsideOk=s=>!s.outside||outsideOn(s.outside);",
    "const OUT_WITH={OX1:'bv',OX2:'bv',OX3:'cja',OX4:'cja',OX5:'cja'};\n"
    "const outsideOk=s=>!s.outside||(outsideOn(s.outside)&&(state.play!=='custom'||!OUT_WITH[s.id]||(state.customProducts||[]).includes(OUT_WITH[s.id])));")
# a new engagement starts every Brand Visibility play with the CDN on the canvas, as the canvas does (a saved one keeps its own)
rep("canvas:[],outside:{},handoffAt:0});", "canvas:[],outside:{cja:['cdn'],commerce:['cdn'],aem:['cdn'],fsi:['cdn'],abv:['cdn']},handoffAt:0});")
assert html.count('{') - html.count('}') == BRACES
assert '—' not in html
open(path, 'w', encoding='utf-8').write(html)
print('step 45 applied on the SOW steps: the new outside systems are kept, and CDN log forwarding starts on with the CDN')
