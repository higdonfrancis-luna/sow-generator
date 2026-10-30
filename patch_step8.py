"""Step 8 of the SOW tool (Oct 30 2026, 12:20 am; Adam: "ok" to the Sites Optimizer proposal, docs/sessions/2026-10-29_sites_optimizer_and_eds.md):
two optional AEM lines for AEM Sites Optimizer, the separately licensed add-on that finds and fixes SEO issues on AEM Sites,
Edge Delivery included: setup (16 / 24 / 40 hours) and the monthly SEO fixes (8 / 16 / 24 hours a month). Optional, because the
customer licenses Sites Optimizer separately; offered on the AEM play only, since it needs AEM Sites.
Run once on the step 7 file; every anchor must appear exactly once.

    python3 patch_step8.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:70]!r}'
    html = html.replace(old, new)


OPPS = 'https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/opportunity-types/traffic-acquisition'
TITLE = 'Experience League: Sites Optimizer opportunity types'
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
catalog = json.loads(m.group(1))
assert len(catalog) == 38
catalog += [
    {'id': 'SO1', 'stage': 'Connect', 'base': 24, 'low': 16, 'high': 40, 'plays': ['aem'], 'unit': 'one-time', 'name': 'Sites Optimizer setup',
     'basis': 'One site: Sites Optimizer connected, roles set, and the first SEO opportunities reviewed with the team.',
     'scope': 'Activate Sites Optimizer on the production site, connect Google Search Console, set who can suggest and who can deploy, and review the first SEO opportunities (broken backlinks, metadata, structured data, sitemap issues, Core Web Vitals) with the customer to agree what to fix first.',
     'deliverable': 'Configured Sites Optimizer, the roles and approvals model, and a prioritized list of the first SEO fixes.',
     'acceptance': 'The customer can see and approve opportunities, and the first agreed fixes are deployed.',
     'assumptions': 'The customer has licensed Sites Optimizer for AEM Sites (Edge Delivery, Cloud Service or Managed Services) and the site is a public production site. Hours scale with the number of sites.',
     'exclusions': 'The Sites Optimizer license, fixes outside the agreed opportunity types, and changes to systems outside AEM.',
     'source': OPPS, 'sourceTitle': TITLE},
    {'id': 'SO2', 'stage': 'Optimize', 'base': 16, 'low': 8, 'high': 24, 'plays': ['aem'], 'unit': 'monthly', 'name': 'Monthly SEO fixes with Sites Optimizer',
     'basis': 'One site: each month, review Sites Optimizer\'s new SEO opportunities, approve and deploy the fixes, and report the results.',
     'scope': 'Each month, review new SEO opportunities in Sites Optimizer, approve or edit the suggested fixes with the content owner, deploy them, and report search traffic and Core Web Vitals movement alongside the Brand Visibility review.',
     'deliverable': 'Monthly fix log and a short search results report.',
     'acceptance': 'The agreed fixes for the month are deployed and reported.',
     'assumptions': 'Sites Optimizer is licensed and set up. Hours scale with the number of opportunities and sites.',
     'exclusions': 'The license, new content creation (see the content program), and development outside AEM.',
     'source': OPPS, 'sourceTitle': TITLE},
]
html = html[:m.start(1)] + json.dumps(catalog, ensure_ascii=False) + html[m.end(1):]
rep("const choices=state.play==='coworker'?['CW04','X01']:", "const choices=state.play==='coworker'?['CW04','X01']:state.play==='aem'?['SO1','SO2','O04','O07','O08','O09','X01']:")
rep("X01:'Executive alignment workshops'};", "X01:'Executive alignment workshops',SO1:'Sites Optimizer setup',SO2:'Monthly SEO fixes with Sites Optimizer'};")
open(path, 'w', encoding='utf-8').write(html)
print('step 8 applied: 40 services')
