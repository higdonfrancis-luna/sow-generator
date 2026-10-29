"""Step 2 of the SOW tool rebuild (Oct 29 2026): the services the plays promise partners that the ChatGPT catalog
lacked, hours rescaled for 200 starting prompts, the AEM play as a new-site pursuit, and a fresh browser-storage key.
Run once on the step 1 file; every anchor must appear exactly once.

    python3 patch_step2.py index.html
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


def service(id, stage, low, base, high, plays, unit, name, basis, scope, deliverable, acceptance, assumptions, exclusions, source, title):
    return {'id': id, 'stage': stage, 'base': base, 'low': low, 'high': high, 'plays': plays, 'unit': unit, 'name': name, 'basis': basis,
            'scope': scope, 'deliverable': deliverable, 'acceptance': acceptance, 'assumptions': assumptions, 'exclusions': exclusions,
            'source': source, 'sourceTitle': title}


EDS_OVERVIEW = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/overview'
EDS_CDN = 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/using-cloud-manager/edge-delivery-sites/introduction-to-edge-delivery-services'
EDS_GO_LIVE = 'https://www.aem.live/docs/go-live-checklist'

NEW = {
    'after L03': [
        service('A01', 'Launch', 480, 960, 1920, ['aem'], 'one-time', 'Implement AEM Sites on Edge Delivery',
                'One site on Edge Delivery Services: the site plan from the SEO and AI strategy, a block library and page templates, build and integrations for the agreed page set.',
                "Turn Brand Visibility findings and the customer's search strategy into the site plan and information architecture; design and build the block library and page templates on Edge Delivery; set up authoring, the Adobe-managed CDN and the agreed integrations; build the agreed pages and switch on Brand Visibility's edge optimizations.",
                'A working Edge Delivery site with templates and blocks, configured authoring, CDN and integrations, Brand Visibility enabled, and a build record.',
                'The agreed pages render on Edge Delivery, meet the agreed performance and quality checks, and the customer accepts the site for migration and launch.',
                'The customer has licensed AEM Sites with Edge Delivery Services and provides brand assets, content owners and approvers. The page set, templates and integrations are confirmed before the build. Hours scale with the number of templates, blocks, pages and integrations.',
                'Content migration, launch and hypercare (separate services), custom back-end systems, commerce storefronts, translation and pages outside the agreed set.',
                EDS_OVERVIEW, 'Experience League: Edge Delivery Services overview'),
        service('A02', 'Launch', 120, 240, 480, ['aem'], 'one-time', 'SEO-safe content migration',
                'One site migration: the agreed pages, redirects, metadata and sitemaps, with crawl and performance checks before launch.',
                'Map the current site to the new one; migrate the agreed pages into Edge Delivery documents and blocks; carry over or rewrite titles, descriptions, headings and structured data; set up redirects, bulk metadata and sitemaps; run crawl, link and Lighthouse checks before launch.',
                'Migrated pages, the redirect map, metadata and sitemap records, and the pre-launch check report.',
                'Every page in the agreed set is migrated, every redirect resolves, and the crawl, link and Lighthouse checks pass the agreed thresholds.',
                'The customer provides access to the current site, its analytics and search data, and reviewers. The build is accepted before migration starts. Hours scale with the number of pages and how much copy is rewritten.',
                'New content, translation, pages outside the agreed set and changes to the site build.',
                EDS_GO_LIVE, 'Adobe Edge Delivery docs: go-live checklist'),
        service('A03', 'Launch', 60, 120, 240, ['aem'], 'one-time', 'Launch, QA and hypercare',
                'One launch: the go-live checklist, DNS and CDN cutover, live checks and two weeks of hypercare.',
                "Run the go-live checklist, cut over DNS and the CDN, verify Brand Visibility, analytics, redirects and forms on the live site, and support the customer's team for two weeks after launch.",
                'The launch record, the post-launch check report and a hypercare log with the fixes made.',
                'The site is live on the agreed domain, the live checks pass, and any open issue from hypercare has an owner and a date.',
                'The build and migration are accepted. The customer controls DNS and names a launch approver.',
                'New features, content changes after launch, and support beyond the two weeks of hypercare.',
                EDS_CDN, 'Experience League: Edge Delivery sites on the Adobe-managed CDN'),
        service('F02', 'Launch', 320, 640, 1280, ['fsi'], 'one-time', 'Implement Brand Concierge',
                'One Brand Concierge experience: approved content sources, conversation design for the agreed products, one handoff route, testing and launch on the agreed pages.',
                "Set up the Brand Concierge experience for the agreed banking or insurance products: connect and curate the approved content sources, design the conversations and guardrails for the agreed questions, configure the brand voice and the required disclosures, connect one handoff route to the customer-designated team, test with the customer's reviewers and launch on the agreed pages.",
                'A live Brand Concierge experience on the agreed pages, the source, guardrail and disclosure configuration, the test records and the launch record.',
                'Customer reviewers approve the sampled answers, disclosures and the handoff, and the experience is live on the agreed pages.',
                'The customer has licensed Brand Concierge and supplies the approved content, current product facts, reviewers and the handoff destination; compliance decisions stay with the customer. Hours scale with the number of products, sources and pages.',
                'New content, legal or compliance advice, a new chat or appointment platform, ongoing answer review (a separate service) and Coworker Skills.',
                'https://experienceleague.adobe.com/en/docs/brand-concierge/content/home', 'Experience League: Brand Concierge'),
    ],
    'after C01': [
        service('C06', 'Connect', 24, 48, 96, ['cja'], 'one-time', 'Audiences that act on the data',
                'One CJA data view: up to five audiences from AI-referred visitors, published to Real-Time Customer Profile, with an activation plan.',
                'Define up to five audiences from AI-referred visits and their outcomes in the CJA data view, publish them to Real-Time Customer Profile, and agree with the customer how each audience is used in its existing channels.',
                'Audience definitions, the published audiences, an activation plan with owners, and the measures to review in the monthly report.',
                'The audiences populate in Real-Time Customer Profile with the agreed definitions, and the customer approves the activation plan.',
                'The Brand Visibility connection to CJA is in place, the customer licenses Real-Time Customer Profile or another supported destination, and channel owners take part. The AI bot data carries no personal identifiers, so audiences come from AI-referred visitors.',
                'New destinations or channels, campaign production, personalization builds and audience work in other tools.',
                'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish', 'Experience League: Publish CJA audiences'),
    ],
    'after C02': [
        service('C07', 'Connect', 24, 56, 120, ['commerce'], 'one-time', 'CDN readiness for stores not on Fastly',
                "One Adobe Commerce store on its own CDN or on-premises: the route for Brand Visibility's edge optimizations, verified on one page.",
                "Confirm how the store serves pages to AI agents and search engines, set up the supported route for Brand Visibility's edge optimizations on the customer's CDN or hosting, and verify it on one page ahead of the deployment pilot.",
                'The documented route, the configured CDN or hosting settings, the one-page verification and the handoff to the deployment pilot.',
                "An approved optimization reaches AI agents through the customer's CDN on the verification page, and the customer's hosting owner accepts the configuration.",
                "The store runs Adobe Commerce on-premises or on a CDN other than Fastly, and the hosting owner provides access and approves the change. Stores on Commerce cloud infrastructure with Fastly don't need this service.",
                'CDN migration or new CDN contracts, replatforming, the deployment pilot itself (a separate service) and store code changes.',
                'https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/overview', 'Experience League: Brand Visibility, Optimize at Edge'),
    ],
    'after CW04': [
        service('CW07', 'Connect', 16, 32, 64, ['coworker', 'cja', 'aem', 'fsi'], 'one-time', 'Package Skills and connections as a plugin',
                "One plugin: the agreed Skills and connections packaged for one organization's marketplace.",
                "Package the agreed Skills and connections as one installable plugin, publish it to a marketplace repository the customer's administrators add, and document how administrators review and install it.",
                'The plugin package, the marketplace repository, the review and install instructions and a version record.',
                "Administrators review the plugin's Skills, install it, and the agreed users see the Skills and connections working.",
                "The Skills and connections are built and tested. Administrators decide whether users may install plugins and which marketplaces to add. Reuse across customers is the partner's choice.",
                'Building the Skills or connections, new MCP servers, custom APIs and platform setup.',
                'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/plugins/what-are-plugins', 'Experience League: What are Coworker plugins?'),
    ],
}

UPDATES = {
    'L01': {'base': 64, 'low': 40, 'high': 120,
            'basis': 'One strategy package: one brand, domain, market and language, with 200 prompts to start.',
            'scope': "Run two discovery workshops and curate 200 prompts to start, covering agreed customer intents, three competitors and five business measures. Adjust the prompt count to the customer's license."},
    'L02': {'base': 48, 'low': 32, 'high': 96,
            'basis': 'One baseline package: one workspace, domain and market, the 200 starting prompts and 10 pilot users.',
            'scope': 'Configure the agreed monitoring portfolio, validate pilot access, and record one baseline for the 200 starting prompts and three competitors.'},
    'O01': {'base': 40, 'low': 24, 'high': 72,
            'basis': 'One monthly review package: one brand, domain and market, with the 200 starting prompts.',
            'scope': 'Maintain the prompt portfolio (200 prompts to start) and three competitors; review up to five prompt changes, prioritize up to 10 actions, and hold one customer review using five business measures.'},
    'C03': {'assumptions': 'The Edge Delivery site is live, or an existing healthy AEM site, with authoring access and a release process. The exact AEM or Edge Delivery route is confirmed before work begins.'},
    'CW06': {'base': 32, 'low': 16, 'high': 56, 'name': 'Coworker adoption and Skill maintenance',
             'basis': 'One monthly package: one team, two Skills, one enablement session, one usage review and up to two minor approved Skill updates.',
             'scope': 'Run the adoption program from the trial to the license: use cases, one enablement session a month, a prompt library and one usage review; make up to two minor approved Skill updates and maintain the prioritized improvement backlog.',
             'deliverable': 'Enablement materials and the prompt library, the usage and adoption summary, the Skill change log with regression checks and the backlog.',
             'acceptance': 'Approved updates pass the agreed checks, the session is delivered, and the review distinguishes observed outcomes from assumptions.',
             'exclusions': 'New workflows, connector or platform builds, major data remediation, 24/7 support and duplicate Brand Visibility performance reporting.'},
}

m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S)
assert m
catalog = json.loads(m.group(1))
assert len(catalog) == 28 and all('scopeText' in s for s in catalog)
for s in catalog:
    s.pop('scopeText')                                   # never read for catalog services
    for key, value in UPDATES.get(s['id'], {}).items():
        assert key in s, (s['id'], key)
        s[key] = value
for anchor, items in NEW.items():
    after = anchor.split()[1]
    index = [s['id'] for s in catalog].index(after) + 1
    catalog[index:index] = items
ids = [s['id'] for s in catalog]
assert len(ids) == len(set(ids)) == 35, ids
assert ids[2:7] == ['L03', 'A01', 'A02', 'A03', 'F02'] and ids[7:9] == ['C01', 'C06'] and ids[9:11] == ['C02', 'C07']
assert ids[ids.index('CW04') + 1] == 'CW07'
html = html[:m.start(1)] + json.dumps(catalog, ensure_ascii=False) + html[m.end(1):]

# ---- the AEM play is a new-site pursuit
rep("objective:'Turn Brand Visibility findings into approved content and technical improvements on the agreed existing AEM site or supported delivery route.'",
    "objective:'Build the site on AEM Sites with Edge Delivery Services so it is found in search and in AI answers, then turn Brand Visibility findings into the content and technical improvements that keep it there.'")

# ---- starting selections per template
rep("const STARTERS={abv:['L01','L02','C05','O01','O02'],coworker:['CW01','CW02','CW03','CW05'],cja:['L01','L02','C01','O01','O02'],commerce:['L01','L02','L03','C02','O01','O02'],aem:['L01','L02','C03','O01','O02'],fsi:['L01','L02','C04','O01','O02']};",
    "const STARTERS={abv:['L01','L02','C05','O01','O02'],coworker:['CW01','CW02','CW03','CW07','CW05','CW06'],cja:['L01','L02','C01','C06','O01','O02'],commerce:['L01','L02','L03','C02','O01','O02'],aem:['L01','L02','A01','A02','A03','C03','O01','O02'],fsi:['L01','L02','F02','C04','O01','O02']};")

# ---- optional services under the list
rep("const choices=state.play==='coworker'?[]:state.play==='fsi'?['O04','O07','O08','O09','FSI01']:['O04','O07','O08','O09'];",
    "const choices=state.play==='coworker'?['CW04']:state.play==='fsi'?['O04','O07','O08','O09','FSI01']:state.play==='commerce'?['C07','O04','O07','O08','O09']:['O04','O07','O08','O09'];")
rep("const labels={O04:'Earned media and authority',O07:'Reddit and communities',O08:'Existing YouTube videos',O09:'New answer video',FSI01:'Financial-services answer review'};",
    "const labels={O04:'Earned media and authority',O07:'Reddit and communities',O08:'Existing YouTube videos',O09:'New answer video',FSI01:'Financial-services answer review',C07:'CDN readiness (stores not on Fastly)',CW04:'Connection or plugin setup'};")

# ---- the scope form's prompt field and a fresh browser-storage key, so the new starting hours show
rep("t.oneHours+' estimated hours'],['Monthly services',t.monthFee,t.monthHours+' hours a month']",
    "t.oneHours.toLocaleString('en-US')+' estimated hours'],['Monthly services',t.monthFee,t.monthHours.toLocaleString('en-US')+' hours a month']")
rep('placeholder="e.g. 200 prompts, reviewed monthly"', 'placeholder="e.g. 200 prompts to start, reviewed monthly; adjust to the customer\'s license"')
rep("const KEY='partner-sow-studio-v4',", "const KEY='partner-sow-studio-v5',")

assert '–' not in html and '—' not in html
assert 'scopeText' not in re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html, re.S).group(1)
open(path, 'w', encoding='utf-8').write(html)
print('patched', path, len(html), 'chars;', len(catalog), 'services')
