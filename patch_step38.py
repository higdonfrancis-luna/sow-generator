"""Step 38 of the SOW tool (Nov 3 2026, Adam: "yes" to the CDN proposal in sow/cdn_review_2026-11-03/PROPOSAL.md,
points 1 to 3, and the CDN question mocked up in sow/mockups/nov3_cdn/).
- The AEM play's Scope step asks "Which CDN serves the site?": Not known yet (the default), Adobe-managed CDN, or the
  customer's own CDN. Its note says what each means, and the SOW's Dependencies and risks follow it: on Adobe's managed
  CDN, the Edge Delivery build turns on Brand Visibility's edge routing and the log-forwarding route is confirmed with
  Adobe in week one; with the customer's own CDN (or until discovery confirms), a "Customer CDN" line says its IT or CDN
  team adds the routing rules, allows Adobe's edge user agent and creates the log job in an agreed change window.
  Adobe documents the one-click route only for AEM as a Cloud Service's managed CDN, so the note asks to confirm it for
  an Edge Delivery site.
- One owner for CDN log forwarding: Brand Visibility setup and baseline registers it in Brand Visibility and confirms
  the logs arrive once the customer's CDN team has created the log job; CDN log forwarding, set up by the partner, is
  only that hands-on job in the CDN console (no longer the registration, and it accepts on the job being active).
- One owner for edge routing on the AEM play: Implement AEM Sites on Edge Delivery turns on the routing on Adobe's
  managed CDN and allows the AdobeEdgeOptimize/1.0 user agent; the deployment pilot says so instead of setting it up
  again.
- Hours and starting totals don't change. Unedited earlier wording takes the new wording (PRIOR38).
Run once on the step 37 file; every anchor must appear exactly once.

    python3 patch_step38.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert "one-time services only'" in html and 'cdnRoute' not in html, 'run this on the step 37 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
by = {c['id']: c for c in CAT}
PRIOR = {}


def change(cid, key, old, new, band=None):
    c = by[cid]
    holder = c['bands'][band] if band else c
    cur = holder[key]
    assert cur.count(old) == 1, (cid, key, band, old)
    PRIOR.setdefault(cid, {}).setdefault(key, []).append(cur)
    holder[key] = cur.replace(old, new)


LOG_OLD = "get CDN log forwarding enabled with the customer's IT team"
LOG_NEW = "register CDN log forwarding in Brand Visibility and confirm the logs arrive once the customer's CDN team has created the log job"
change('L02', 'scope', LOG_OLD, LOG_NEW)
change('L02', 'scope', LOG_OLD, LOG_NEW, 'small')
change('L02', 'scope', LOG_OLD, LOG_NEW, 'large')
change('L02', 'assumptions', 'CDN log forwarding is customer IT work and often the longest item;',
       "The customer's CDN team creates the log job in its CDN console (unless CDN log forwarding, set up by the partner, is selected), and it is often the longest item;")
change('OX1', 'scope', "register the CDN on Brand Visibility's CDN Configuration page and create the log-forwarding job", 'create the log-forwarding job')
change('OX1', 'scope', ', then confirm the logs arrive.', ', with the storage details Brand Visibility issues.')
change('OX1', 'acceptance', 'Brand Visibility receives the access logs for each agreed domain, and the Agentic Traffic dashboard displays metrics.',
       'The log-forwarding job is active in the CDN console for each agreed domain.')
change('OX1', 'assumptions', 'Brand Visibility setup and baseline already agrees the date with the customer\'s IT team;',
       'Brand Visibility setup and baseline registers CDN log forwarding, agrees the date with the customer\'s IT team and confirms the logs arrive;')
A01_OLD = "Routing is self-serve in Brand Visibility only on AEM as a Cloud Service's managed Fastly CDN; on any other CDN the CDN team adds the rules."
A01_NEW = ("Routing is self-serve in Brand Visibility on AEM as a Cloud Service's managed Fastly CDN, and this service turns it on there and allows the AdobeEdgeOptimize/1.0 user agent in robots.txt and bot rules; "
           "Adobe documents the self-serve route for AEM as a Cloud Service, so it is confirmed for the Edge Delivery site with Adobe. On any other CDN the CDN team adds the rules.")
change('A01', 'assumptions', A01_OLD, A01_NEW)
pair = by['A01']['neutral']['bv']['assumptions'][0]
assert pair[0].endswith(A01_OLD) and pair[1] == ''
pair[0] = pair[0][:-len(A01_OLD)] + A01_NEW
change('L03', 'assumptions', "set up self-serve in Brand Visibility, as part of this pilot, for AEM as a Cloud Service sites on Adobe's managed Fastly CDN;",
       "set up self-serve in Brand Visibility, as part of this pilot, for AEM as a Cloud Service sites on Adobe's managed Fastly CDN (on the AEM play, Implement AEM Sites on Edge Delivery turns it on);")

blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')

BRACES = html.count('{') - html.count('}')
# earlier wording, unedited, takes the new wording
rep('const PRIOR32=', '/* step 38: the CDN wording before one owner per task */\nconst PRIOR38=' + json.dumps(PRIOR, ensure_ascii=False) + ';\nconst PRIOR32=')
rep("...(PRIOR32[baseId(c)]?.[key]||[]),", "...(PRIOR32[baseId(c)]?.[key]||[]),...(PRIOR38[baseId(c)]?.[key]||[]),")

# the CDN question on the AEM play's Scope step
rep('<div class="form-card" id="fsi-context" hidden>',
    '<div class="form-card" id="cdn-context" hidden><h3>Where the site is served</h3><label class="wide">Which CDN serves the site?<select data-meta="cdnRoute">'
    '<option value="unknown">Not known yet: confirm in discovery</option><option value="managed">Adobe-managed CDN (Cloud Manager)</option>'
    '<option value="own">The customer\'s own CDN (Akamai, Cloudflare, Fastly, CloudFront or other)</option></select></label><p class="hint" id="cdn-note"></p></div>\n'
    '<div class="form-card" id="fsi-context" hidden>')
rep("d.rate=globalRate(s.rate);", "d.rate=globalRate(s.rate);d.cdnRoute=['managed','own','unknown'].includes(s.cdnRoute)?s.cdnRoute:'unknown';")
rep("$('fsi-context').hidden=state.play!=='fsi';",
    "$('fsi-context').hidden=state.play!=='fsi';$('cdn-context').hidden=state.play!=='aem';$('cdn-note').textContent=CDN_NOTE[state.cdnRoute]||CDN_NOTE.unknown;")
rep("if(k==='fsiState')applyFsiState();save();}", "if(k==='fsiState')applyFsiState();if(k==='cdnRoute')renderScope();save();}")
rep('function dependencyList(lines){',
    "/* the AEM play's CDN answer (step 38) */\n"
    "const CDN_NOTE={managed:'Brand Visibility\\'s edge fixes turn on with one switch in Brand Visibility on Adobe\\'s managed CDN; Implement AEM Sites on Edge Delivery does it. Adobe documents the one-click route for AEM as a Cloud Service; confirm it for an Edge Delivery site with Adobe (abv-at-edge@adobe.com).',"
    "own:'The customer\\'s own CDN is the outer CDN, so Adobe\\'s guidance is that the customer\\'s IT or CDN team adds the edge routing rules, allows Adobe\\'s edge user agent and creates the log-forwarding job. The partner prepares and checks them, and does them only with access the customer grants: for the log job, add the CDN box on Build and its CDN log forwarding service.',"
    "unknown:'Confirm in discovery which CDN serves the site. Until then the SOW lists the customer\\'s CDN team as a dependency.'};\n"
    'function dependencyList(lines){')
rep(" if(has('L02','C01','OX1','OX2'))out.push(",
    " const aemCdn=state.play==='aem'&&has('A01','L02')?state.cdnRoute:'';\n"
    " if(aemCdn==='managed')out.push('Adobe\\'s managed CDN serves the site: Implement AEM Sites on Edge Delivery turns on Brand Visibility\\'s edge routing there, and the CDN log-forwarding route for the Edge Delivery site is confirmed with Adobe in week one. CDN log forwarding gates Brand Visibility\\'s AI-agent and referral traffic data.');\n"
    " else if(aemCdn)out.push('Customer CDN. '+(aemCdn==='unknown'?'Until discovery confirms which CDN serves the site, the customer\\'s own CDN is assumed. ':'')+'The customer\\'s own CDN sits in front of the site. Its IT or CDN team adds the Optimize at Edge routing rules, allows the AdobeEdgeOptimize/1.0 user agent in robots.txt and bot rules, and '+(has('OX1','OX2')?'gives the partner access and approval to create the log-forwarding job':'creates the log-forwarding job in its CDN console')+', in an agreed change window, as Adobe\\'s guidance describes. A missed window moves the deployment pilot and the AI-traffic baseline.');\n"
    " if((!aemCdn||has('OX1','OX2'))&&has('L02','C01','OX1','OX2'))out.push(")
rep(" else if(has('L03','C02'))out.push('Optimize at Edge routing is applied", " else if(has('L03','C02')&&!aemCdn)out.push('Optimize at Edge routing is applied")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 38 applied: the CDN question on the AEM play, one owner for log forwarding and for edge routing, the Customer CDN dependency')
