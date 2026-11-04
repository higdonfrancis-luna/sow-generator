"""Step 41 data (Nov 4 2026, Adam: "yes" to the fixes from the step 40 review, sow/review_step40_2026-11-04/FINDINGS.md):
- refine chips that say the client already has a product carry `owned` (the canvas turns off the services that stand it up)
- the financial services problem needs an industry word (`requires`) and keeps "accounts, policies or rates" in its chip;
  chatbot and concierge words move to "Visitors can't find answers on my client's site"
- more keywords (short words only in context) for common phrasings; the slow-site chip keeps the reviewed meaning
- refine notes are full sentences; Brand Visibility to CJA without the CDN box says it needs CDN logs
Run once on the step 40 problems.json, then build.py and build_site.py.

    python3 sow/canvas/data_step41.py sow/canvas/problems.json
"""
import json, sys
path = sys.argv[1]
doc = json.load(open(path, encoding='utf-8'))
P = {p['id']: p for p in doc['problems']}
assert not any('requires' in p for p in doc['problems']), 'run this on the step 40 problems.json'


def chip(pid, text):
    hits = [r for r in P[pid]['refine'] if r['chip'] == text]
    assert len(hits) == 1, (pid, text)
    return hits[0]


# 1. chips that say the client already has a product
OWNED = {
    'ai-answers-missing': {"My client owns Customer Journey Analytics": ['cja'], "My client's site runs on Edge Delivery Services": ['eds'], "My client sells online with Adobe Commerce": ['commerce']},  # an online store has its storefront
    'organic-traffic-falling': {"My client's pages are authored in AEM Sites": ['aemsites'], "My client's images live in AEM Assets": ['aemassets']},
    'slow-website': {"My client already owns AEM Sites": ['aemsites'], "My client's site forms should feed Marketo": ['marketo']},
    'seo-fix-backlog': {"My client's site is on AEM Sites, not Edge Delivery": ['aemsites']},
    'product-pages-ai': {"My client's storefront runs on Edge Delivery": ['eds', 'storefront'], "My client's product images live in AEM Assets": ['aemassets', 'commerce-media']},
    'fsi-complex-questions': {"My client runs Marketo Engage": ['marketo'], "My client's site is on AEM Sites": ['aemsites'], "My client licenses CJA": ['cja']},
    'site-visitors-cant-find-answers': {"My client sells online with Adobe Commerce": ['commerce']},  # an online store has its storefront
    'team-busywork': {"My client owns CJA": ['cja'], "My client runs AEM Sites": ['aemsites'], "My client runs Marketo Engage": ['marketo'], "My client runs Workfront": ['workfront']},
    'slow-reporting': {"My client's journeys run in Journey Optimizer": ['ajo']},
    'same-site-for-everyone': {"My client's site runs on Edge Delivery": ['eds'], "My client runs Marketo lists": ['marketo']},
    'disconnected-messages': {"My client's email images come from AEM Assets": ['aemassets'], "My client's B2B data lives in Marketo": ['marketo']},
    'content-too-slow': {"My client's campaigns run in Marketo": ['marketo']},
    'off-brand-assets': {"My client's email runs in Marketo": ['marketo'], "My client's product images are in Commerce": ['commerce'], "My client's site runs on Edge Delivery": ['eds']},
    'cant-see-what-works': {"My client's leads are in Marketo": ['marketo'], "My client's orders are in Adobe Commerce": ['commerce']},
    'customer-data-silos': {"My client's leads are in Marketo": ['marketo'], "My client's orders are in Adobe Commerce": ['commerce'], "My client's site runs on Edge Delivery": ['eds']},
    'storefront-hard-to-update': {"My client's product images are in AEM Assets": ['aemassets', 'commerce-media']},
}
n = 0
# two problems start from a setup whose site already exists: Brand Concierge on the client's Edge Delivery site, and the
# Commerce storefront on Edge (its storefront build replaces the AEM Sites implementation)
P['site-visitors-cant-find-answers']['owned'] = ['eds']
P['site-visitors-cant-find-answers']['note'] = "This assumes your client's site already runs on Edge Delivery Services, so the services that build it start off; turn them back on with the check on the canvas if it doesn't."
P['storefront-hard-to-update']['off'] = ['A01']
P['storefront-hard-to-update']['note'] = 'The Commerce storefront build on Edge takes the place of an AEM Sites implementation, so that service starts off.'
for pid, chips in OWNED.items():
    for text, ids in chips.items():
        r = chip(pid, text)
        assert all(i in r['add'] or i in ('storefront', 'commerce-media') for i in ids), (pid, text)
        r['owned'] = ids
        n += 1

# 2. financial services needs an industry word, which unlocks it without scoring (so "an insurance client wants
#    personalization" stays personalization); chatbot and concierge words go to the general site-answers problem
fsi, site = P['fsi-complex-questions'], P['site-visitors-cant-find-answers']
move = ['concierge', 'chatbot', 'conversational', 'ai assistant on site', 'customer questions', 'call deflection']
industry = ['financial services', 'insurance', 'bank', 'credit union']
for k in move + industry:
    assert k in fsi['keywords'], k
fsi['keywords'] = [k for k in fsi['keywords'] if k not in move + industry] + ['account questions', 'policy questions', 'rate questions', 'call & account', 'call & rate',
    'call & policy', 'call & claim', 'call & portfolio', 'call & loan', 'call instead', 'leave the site', 'complicated questions', 'find answers', 'call center', 'self service',
    'chatbot', 'concierge', 'conversational', 'assistant & site']
fsi['requires'] = ['financial', 'fsi', 'finserv', 'insurance', 'insurer', 'insured', 'bank', 'credit union', 'wealth', 'mortgage', 'lender', 'lending', 'borrower', 'policyholder',
                   'brokerage', 'fintech', 'investor', 'investment firm', 'investment management', 'asset manager', 'asset management', 'annuity', 'card issuer', 'cardholder',
                   'retirement', 'loan & call', 'claim & call']
assert fsi['chip'] == "My client's customers call instead of finding answers"
fsi['chip'] = "My client's banking or insurance customers call about accounts, policies or rates"
fsi['specializes'] = 'site-visitors-cant-find-answers'  # with an industry word, it leads over the general site-answers problem
site['keywords'] = site['keywords'] + [k for k in move + ['chat', 'call center'] if k not in site['keywords']]

# 3. more keywords. Plurals, endings and spelling variants are handled by the page's word stems, and small words like
#    "are" don't break a phrase. "a & b" needs both anywhere in the question, so a short word only counts in context
#    ("show up" only with AI or ChatGPT, "slow" only with the site or a page)
more = {
    'ai-answers-missing': ['ai visibility', 'show up in ai', 'llm', 'ai answer', 'ai generated answer', 'appear & ai', 'chatgpt answer', 'show up & ai', 'show up & chatgpt', 'come up & ai',
                           'come up & chatgpt', 'mention & chatgpt', 'mention & llm', 'category & ai', 'category & chatgpt', 'recommend & ai', 'gemini', 'claude', 'copilot',
                           'large language model', 'gpt'],
    'ai-traffic-revenue': ['ai sale', 'sale from ai', 'revenue from ai', 'ai referred', 'ai conversion', 'chatgpt revenue', 'chatgpt sale', 'revenue & ai',
                           'revenue & chatgpt', 'sale & ai', 'sale & chatgpt', 'roi & ai', 'prove & ai'],
    'organic-traffic-falling': ['rank higher', 'rank & google', 'rank & search', 'rank & seo', 'rank & page', 'visitor & google', 'traffic & google', 'search traffic', 'organic search', 'organic traffic', 'ai overviews', 'search engine traffic', 'optimized for search'],
    'slow-website': ['rebuild & site', 'replatform & site', 'site speed', 'load time', 'page load', 'slow & site', 'slow & website', 'slow & page', 'speed & site', 'speed & page', 'load & site', 'load & page', 'sitecore'],
    'seo-fix-backlog': ['backlog', 'seo fix', 'dev & seo', 'developer & seo'],
    'team-busywork': ['automate', 'repetitive', 'routine', 'routine work', 'manual work', 'manual task'],
    'slow-reporting': ['slow & report', 'report & day', 'pull & report', 'real time & dashboard'],
    'same-site-for-everyone': ['personalize', 'personalized', 'same content'],
    'disconnected-messages': ['email & calendar', 'message & calendar', 'message & trigger', 'build & journey'],
    'abandoned-carts': ['cart', 'abandon', 'shopping cart'],
    'content-too-slow': ['speed to market', 'approval', 'creative production', 'content calendar', 'launch & late'],
    'off-brand-assets': ['logo', 'brand guideline', 'brand identity'],
    'b2b-leads-go-cold': ['sale team', 'sale rep', 'sales and marketing', 'marketing engagement'],
    'cant-see-what-works': ['page & conversion', 'channel & conversion', 'channel & drive', 'channel & work'],
    'product-pages-ai': ['product & wrong', 'product & chatgpt', 'price & chatgpt'],
    'site-visitors-cant-find-answers': ['find & site'],
    'storefront-hard-to-update': ['merchandiser', 'merchandising', 'store & dev', 'store & developer', 'update & store'],
}
for pid, ks in more.items():
    P[pid]['keywords'] = P[pid]['keywords'] + [k for k in ks if k not in P[pid]['keywords']]
SWAP = {('ai-answers-missing', 'ai overviews'): None, ('ai-answers-missing', 'ai search'): 'visible & ai', ('content-too-slow', 'time to market'): 'market & launch', ('disconnected-messages', 'push'): 'push notification', ('customer-data-silos', 'identity'): 'identity resolution'}
for (pid, k), new in SWAP.items():
    ks = P[pid]['keywords']; assert ks.count(k) == 1, (pid, k)
    P[pid]['keywords'] = [x for x in ks if x != k] + ([new] if new else [])
for p in doc['problems']:
    assert len(p['keywords']) == len(set(p['keywords'])), p['id']
assert P['slow-website']['chip'] == "My client's site is slow and losing search traffic"
P['slow-website']['chip'] = "My client's website is slow"
w = P['seo-fix-backlog']
assert w['why'].startswith("Sites Optimizer connects to the Edge Delivery site's code repository") and w['why'].endswith('Brand Visibility covers the AI side of the same pages.')
w['why'] = ("Sites Optimizer, with the Ultimate package, deploys approved SEO and content fixes to the source documents or authoring, where your client's team reviews and publishes them. "
            "On an Edge Delivery site it connects to the code repository and content source. Brand Visibility covers the AI side of your client's pages.")
w = P['team-busywork']
assert w['why'].count("each chip below adds a documented connection") == 1
w['why'] = w['why'].replace("each chip below adds a documented connection", "each app adds a documented connection")
b2b = chip('b2b-leads-go-cold', "My client's site forms should feed Marketo")
b2b['chip'] = 'My client wants new site forms that feed Marketo'
b2b['note'] = 'AEM Forms needs its own license.'
chip('content-too-slow', "My client's approved work feeds journeys")['chip'] = 'My client wants approved work to feed journeys'
chip('cant-see-what-works', 'My client wants tests measured too')['chip'] = 'My client wants to start testing too'
mk = chip('off-brand-assets', "My client's email runs in Marketo")
mk['remove'] = ['ajo']
mk['note'] = 'Marketo sends the email, so Journey Optimizer leaves the setup.'

# 4. refine notes as full sentences; Brand Visibility to CJA without the CDN box says it needs CDN logs
NOTES = {
    ('ai-traffic-revenue', "My client's revenue data sits in Snowflake, BigQuery or Databricks"): ('Through Data Mirror.', 'The warehouse data comes in through Data Mirror.'),
    ('ai-traffic-revenue', "My client's leaders want readouts on request"): ('Needs CJA B2C edition.', "This needs CJA B2C edition. Brand Visibility's CJA source needs CDN logs, which only the CJA play offers as a CDN box."),
    ('abandoned-carts', "My client wants to test store content"): ('Prove it in a pilot.', 'Adobe documents no setup for Commerce events in Target, so prove it in a pilot.'),
    ('organic-traffic-falling', "My client needs many pages updated quickly"): ("For bulk changes your client's authors review.", "Coworker makes bulk changes that your client's authors review."),
    ('slow-website', "My client also needs testing and personalization"): ('Web SDK recommended.', 'Adobe recommends the Web SDK.'),
    ('organic-traffic-falling', "My client's pages are authored in AEM Sites"): (None, "The Edge Delivery build and migration stay on: they move your client's existing AEM site to Edge Delivery."),
    ('slow-website', "My client already owns AEM Sites"): ('AEM stays the content source.', "AEM stays the content source. The Edge Delivery build and migration stay on: they move your client's existing AEM site to Edge Delivery."),
    ('product-pages-ai', "My client wants shopping help on the site"): ('Catalog discovery and comparison; cart and checkout are planned.', 'Brand Concierge covers catalog discovery and comparison; cart and checkout are planned.'),
    ('fsi-complex-questions', "My client runs Marketo Engage"): ('Engagement becomes Marketo activities.', 'Concierge engagement becomes Marketo activities.'),
    ('fsi-complex-questions', "My client's site is on AEM Sites"): ('Through the Content AI index.', "Brand Concierge answers from AEM's Content AI index."),
    ('fsi-complex-questions', "My client licenses CJA"): ('Confirm the data use with Adobe.', "Confirm with Adobe that the concierge conversation data can be used in your client's CJA. Brand Visibility's CJA source needs CDN logs, which only the CJA play offers as a CDN box."),
    ('slow-reporting', "My client wants the AI channel included"): ('Its CJA source needs CDN logs, which only the CJA play offers as a CDN box.', "Brand Visibility's CJA source needs CDN logs, which only the CJA play offers as a CDN box."),
    ('same-site-for-everyone', "My client runs Marketo lists"): ('Needs Adobe organization mapping.', 'This needs Adobe organization mapping.'),
    ('content-too-slow', "My client wants approved work to feed journeys"): ('Needs a Workfront Fusion license.', 'This needs a Workfront Fusion license.'),
    ('off-brand-assets', "My client's product images are in Commerce"): ('Synced by SKU.', 'Images sync to Commerce by SKU.'),
}
for (pid, text), (old, new) in NOTES.items():
    r = chip(pid, text)
    assert r.get('note') == old, (pid, text, r.get('note'))
    r['note'] = new
r = chip('cant-see-what-works', "My client wants AI assistants included as a channel")
assert 'note' not in r
r['note'] = "Brand Visibility's CJA source needs CDN logs, which only the CJA play offers as a CDN box."

assert '—' not in json.dumps(doc, ensure_ascii=False)
json.dump(doc, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'step 41 data: {n} chips marked owned, financial services needs an industry word, keywords and notes updated')
