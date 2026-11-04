"""Step 45 data (Nov 4 2026, Adam: "go", on the mockups in sow/mockups/nov4_outside_v2/ and nov4_cdn_recommended/):
- five more outside systems, each checked live (research/blindspots_live_2026-11-04.md): Ad platforms, BI tools, Search
  data, Authoring documents (Word or Google Docs in your client's SharePoint or Google Drive) and Website on another
  CMS, with their connections and services (research/outside_step45.json); and the CRM and the data warehouse connect
  to Marketo Engage, Target, Real-Time CDP and Journey Optimizer on Create your own play
- AEM Assets offered on the AEM play as an Adobe product a partner can add ('addons'), beside Edge Delivery Services
- the CDN starts on the canvas in every Brand Visibility play ('ostart'), with CDN log forwarding on; the CDN and Search
  data are tagged Recommended ('recommend', with each system's reason in 'rec')
- a "Needs [package]" tag ('tier') on the connections and services that need a higher package: assume the top
  package, the tag is the check and the upsell
- the problem notes that said to add the CDN say it belongs on the canvas
Run once on the step 44 catalog_map.json, connection_types.json and problems.json; then build.py and build_site.py.

    python3 sow/canvas/data_step45.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MAP = os.path.join(HERE, 'catalog_map.json')
TYPES = os.path.join(HERE, 'research', 'connection_types.json')
RES = os.path.join(HERE, 'research', 'outside_step45.json')
PROBS = os.path.join(HERE, 'problems.json')
cmap = json.load(open(MAP, encoding='utf-8'))
types = json.load(open(TYPES, encoding='utf-8'))
probs = json.load(open(PROBS, encoding='utf-8'))
assert not os.path.exists(RES) and not any(p['id'] == 'ads' for p in cmap['products']), 'run this once on the step 44 files'

EL = 'https://experienceleague.adobe.com/en/docs/'
src = lambda path, title: {'url': EL + path, 'title': 'Experience League: ' + title}
GADS = src('experience-platform/sources/connectors/advertising/google-ads', 'Experience Platform, Google Ads source')
PAID = src('analytics-platform/using/cja-usecases/data-ingestion/paid-media', 'CJA, paid media use case')
DEST = src('experience-platform/destinations/catalog/advertising/overview', 'Experience Platform, advertising destinations')
BIX = src('analytics-platform/using/cja-dataviews/bi-extension', 'CJA, BI extension')
BRANDS = src('brand-visibility/using/dashboards/brands-management', 'Brand Visibility, brands management')
AEMSP = {'url': 'https://www.aem.live/docs/setup-customer-sharepoint', 'title': 'aem.live: SharePoint as a content source'}
ASO = src('experience-manager-sites-optimizer/content/documentation/settings', 'Sites Optimizer, settings')
CSRC = src('experience-manager-cloud-service/content/implementing/using-cloud-manager/edge-delivery-sites/configure-content-source', 'Edge Delivery Services, content source')
BCDEP = src('brand-concierge/content/documentation/deployment/deployment', 'Brand Concierge, deployment')
BCKS = src('brand-concierge/content/documentation/knowledge-sources/knowledge-sources', 'Brand Concierge, knowledge sources')
MKSF = src('marketo/using/product-docs/crm-sync/salesforce-sync/understanding-the-salesforce-sync', 'Marketo Engage, Salesforce sync')
TCA = src('target/using/audiences/visitor-profiles/working-with-customer-attributes', 'Target, Customer Attributes')
AEPSRC = src('experience-platform/sources/home', 'Experience Platform sources')
OCDATA = src('journey-optimizer/using/campaigns/orchestrated-campaigns/data-configuration/schemas-datasets/ingest-data', 'Journey Optimizer, orchestrated campaign data')


def line(id, name, low, base, high, source, scope, tier=''):
    l = {'id': id, 'name': name, 'unit': 'one-time', 'low': low, 'base': base, 'high': high, 'default': True, 'source': source, 'scope': scope}
    if tier:
        l['tier'] = tier
    return l


def conn(id, a, b, how, source, lines):
    return {'id': id, 'a': a, 'b': b, 'how': how, 'source': source, 'lines': lines}


# the five outside systems (each reads "Outside Adobe" on its box)
cmap['products'] += [
    {'id': 'ads', 'name': 'Ad platforms', 'outside': True, 'icon': 'ads', 'systems': 'Google Ads, Meta, Pinterest, Snapchat, TikTok; LinkedIn and The Trade Desk as Real-Time CDP destinations', 'lines': [], 'more': []},
    {'id': 'bi', 'name': 'BI tools', 'outside': True, 'icon': 'bi', 'systems': 'Power BI, Tableau, Looker, or Excel through Report Builder', 'lines': [], 'more': []},
    {'id': 'search', 'name': 'Search data', 'outside': True, 'icon': 'search', 'systems': 'Google Search Console and Google Analytics 4', 'lines': [], 'more': [],
     'rec': 'Search Console queries suggest prompts to track. GA4 can fill the Business Impact tab when your client has neither CJA nor Adobe Analytics.'},
    {'id': 'csrc', 'name': 'Authoring documents', 'outside': True, 'icon': 'doc', 'systems': "Word or Google Docs in your client's SharePoint or Google Drive", 'lines': [], 'more': []},
    {'id': 'cms', 'name': 'Website on another CMS', 'outside': True, 'icon': 'cms', 'systems': "Any CMS, with your client's tag manager", 'lines': [], 'more': []},
]
cdn = [p for p in cmap['products'] if p['id'] == 'cdn'][0]
cdn['rec'] = 'Adobe says the Agentic Traffic dashboard needs CDN logs. Take the CDN off if your client already forwards them.'
# CDN log forwarding starts on whenever the CDN is on the canvas (the log export from another CDN stays optional)
cdnbv = [c for c in cmap['connections'] if c['id'] == 'cdn-bv'][0]
assert cdnbv['lines'] == [] and cdnbv['more'] == ['OX1', 'OX2']
cdnbv['lines'], cdnbv['more'] = ['OX1'], ['OX2']

research = {
    'about': "Step 45 (Nov 4 2026): outside systems checked live on Experience League (research/blindspots_live_2026-11-04.md). Hours are planning estimates; Adobe publishes none for these routes.",
    'checked': '2026-11-04',
    'products': [],
    'connections': [
        conn('ads-cja', 'ads', 'cja', "Google Ads, Pinterest, Snapchat and TikTok sources come with CJA (Adobe states no license line for Meta Ads, so confirm it). Experience Platform creates the paid media datasets itself, and ad spend joins web conversions through the campaign, ad group and ad IDs in landing page URLs, at the aggregate level.", GADS, [
            line('AD1', "Ad platform sources into CJA, with your client's ad admins", 16, 32, 56, GADS, "For the agreed ad accounts (Google Ads, Meta, Pinterest, Snapchat or TikTok): your client's ad admins approve access in each network; the partner authorizes the Experience Platform advertising sources, which create the paid media datasets, and adds them to the CJA connection and data view as summary data."),
            line('AD2', 'Ad spend joined to web conversions: ROAS and cost per web order', 16, 32, 56, PAID, "Derived fields that read the network and campaign IDs from landing page URLs, summary data groups, and Workspace reports for web ROAS, cost per web order and the gap between what the networks report and what the site records.", 'CJA Select or higher')]),
        conn('ads-rtcdp', 'ads', 'rtcdp', 'Audiences go out to Google, Meta, LinkedIn, TikTok, The Trade Desk and other ad platforms through Real-Time CDP destinations. CJA audiences reach ad platforms this way too.', DEST, [
            line('AD3', 'Ad platform destinations: account access, hashed identities and match-rate checks', 8, 16, 32, DEST, "For the agreed ad platforms: connect each destination with your client's ad account access, choose the identities to send (hashed email, phone or device IDs), activate a first audience and check the match rate each platform reports.")]),
        conn('cja-bi', 'cja', 'bi', 'Power BI, Tableau, Looker, Jupyter and RStudio (the tools Adobe supports) read CJA data views live through the BI extension, as aggregate data, up to 50,000 rows a query; Report Builder brings them into Excel.', BIX, [
            line('BI1', 'BI extension setup and number check', 16, 24, 48, BIX, "Query Service and data view permissions with your client's admin, the connection from each agreed BI tool, and a check that its numbers match Analysis Workspace.", 'CJA Select or higher'),
            line('BI2', "Executive dashboards in your client's BI tool", 24, 48, 96, BIX, "The agreed dashboards built on CJA data views within the BI extension's limits (aggregate data, 50,000 rows a query, a 30-day default range).", 'CJA Select or higher')]),
        conn('search-bv', 'search', 'bv', 'Search Console queries suggest prompts to track (a person picks them; none are added automatically), and Google Analytics 4 can fill the Business Impact tab, as CJA or Adobe Analytics can. Both connect with a Google sign-in.', BRANDS, [
            line('SD1', 'Search Console and GA4 connections, and prompts picked from search queries', 4, 8, 16, BRANDS, "Connect Search Console, and GA4 where your client has neither CJA nor Adobe Analytics, to each agreed brand with someone on your client's side who has the right Google permissions, then review the suggested queries and pick the prompts to track by brand and market.", 'paid Brand Visibility')]),
        {**conn('search-so', 'search', 'so', "Sites Optimizer has its own Search Console connection, set up as part of Sites Optimizer's setup.", ASO, []), 'no_services': True},
        conn('csrc-eds', 'csrc', 'eds', "Authors write pages in Word or Google Docs in your client's SharePoint or Google Drive, and Edge Delivery publishes them as pages. This applies only when your client authors in documents; with Experience Workspace or AEM Sites, authoring stays in Adobe.", CSRC, [
            line('CS1', "Document authoring setup with your client's Microsoft 365 or Google admin, and author training", 8, 16, 32, AEMSP, "Plan the site and root folder with your client's IT, run Adobe's app registration and site grant with their Microsoft 365 admin (or share the Google Drive folder), set the site configuration, check preview and publish in Sidekick, and train the authors.")]),
        conn('csrc-so', 'csrc', 'so', "Sites Optimizer writes approved fixes back into the documents, and authors still publish from Sidekick. SharePoint on your client's own domain needs a second app registration; Google Drive needs only a folder share.", ASO, [
            line('CS2', 'Sites Optimizer write-back to SharePoint or Google Drive', 4, 8, 16, ASO, "Connect Sites Optimizer to the documents (an app registration with a client secret on your client's SharePoint, or a Google Drive folder share), check the connection, deploy one pilot fix, and plan the secret's rotation.", 'Sites Optimizer Ultimate')]),
        conn('cms-bc', 'cms', 'bc', "Brand Concierge runs on any site through your client's tag manager or page templates, and reads the site as a knowledge source. Adobe calls deployment a short, one-time configuration for each site.", BCDEP, [
            line('CM1', "Brand Concierge script and surface rules through your client's tag manager", 4, 8, 16, BCDEP, "Add the Brand Concierge script through your client's tag manager or page templates, choose the component or full-page install, write the surface rules and test an included and an excluded page."),
            line('CM2', 'Website Links knowledge source and refresh', 2, 4, 8, BCKS, "Choose the sitemap, URLs or CSV for the site, set the refresh schedule, and fix the failed URLs the Fix Issues report lists.")]),
        {**conn('crm-marketo', 'crm', 'marketo', "Salesforce, Microsoft Dynamics or Veeva syncs with Marketo Engage. Map the fields right the first time: Adobe says a new sync needs a new Marketo instance.", MKSF, []), 'no_services': True},
        conn('crm-target', 'crm', 'target', 'Customer Attributes: a CRM file keyed on the customer ID, uploaded in the browser or by FTP, and subscribed to Target. The Target Bulk Profile Update API is the other way in, and works in Target only.', TCA, [
            line('CR1', 'Customer Attributes from the CRM into Target', 16, 32, 56, TCA, "Export the agreed attributes from the CRM, line up the customer ID with how the site identifies visitors, create the Customer Attributes source, subscribe it to Target and set up the file feed within Adobe's limits.", 'Target Premium for over 5 attributes')]),
        conn('dwh-rtcdp', 'dwh', 'rtcdp', 'Snowflake, Google BigQuery or Azure Databricks tables are copied into Experience Platform on a schedule, for Real-Time CDP profiles and audiences.', AEPSRC, [
            line('DW1', 'Warehouse tables into Experience Platform', 40, 80, 140, AEPSRC, "Connect the warehouse source with your client's data team (allowed IP addresses, the agreed tables), map them to schemas, set incremental loading and the schedule, and check the first load.", 'Real-Time CDP Ultimate or the Advanced Enterprise connectors')]),
        conn('dwh-ajo', 'dwh', 'ajo', "Data Mirror brings row-level changes from the warehouse that Journey Optimizer's orchestrated campaigns use.", OCDATA, [
            line('DW2', 'Data Mirror for orchestrated campaigns', 32, 56, 96, OCDATA, "Design the relational schemas, turn on change tracking in your client's tables with their data team, set up the source and plan how deletes are handled at the source.", 'a Journey Optimizer Campaigns package')]),
    ],
}
for c in research['connections']:
    cmap['connections'].append({'id': c['id'], 'a': c['a'], 'b': c['b'], 'lines': [], 'more': []})

PRE_ADS = ["Your client's ad admins approve access in each network (a Google developer token, a Meta app, TikTok business verification)",
           'Landing page URLs carry campaign, ad group and ad IDs', 'Sending CJA audiences back out to ad platforms needs Real-Time CDP']
types['connections'].update({
    'ads-cja': {'kind': 'outside', 'line': 'platform', 'label': 'Ad platform data comes into CJA through Experience Platform advertising sources',
                'availability': 'Google Ads (V2, the card without the Beta label) and Meta Ads show no beta label; Pinterest, Snapchat and TikTok are beta. Adobe lists these sources for Azure-hosted Experience Platform only.',
                'prereqs': PRE_ADS, 'tier': 'CJA Select or higher to join ad spend to web conversions'},
    'ads-rtcdp': {'kind': 'outside', 'line': 'platform', 'label': 'Audiences go out to ad platforms through Real-Time CDP destinations',
                  'availability': 'Generally available, except destinations marked beta (Snapchat Ads, The Trade Desk CRM).',
                  'prereqs': ["Your client grants access to each ad account", 'Your client picks the identities to send (hashed email, phone or device IDs)']},
    'cja-bi': {'kind': 'outside', 'line': 'platform', 'label': 'BI tools read CJA data views through the BI extension',
               'availability': 'Generally available. Aggregate data only, up to 50,000 rows a query.',
               'prereqs': ["Your client's admin grants Query Service and data view permissions", 'Your client names an owner for each dashboard'], 'tier': 'CJA Select or higher for the BI extension (Report Builder comes with every CJA package)'},
    'search-bv': {'kind': 'outside', 'line': 'native', 'label': 'Search Console and GA4 connect to Brand Visibility with a Google sign-in',
                  'availability': 'Generally available. GA4 is not on the free trial.',
                  'prereqs': ['Someone with Owner or Full permission on the Search Console property signs in with Google', 'For GA4, a property your client owns'], 'tier': 'paid Brand Visibility'},
    'search-so': {'kind': 'outside', 'line': 'native', 'label': "Sites Optimizer's own Search Console connection",
                  'availability': 'Generally available.', 'prereqs': ['Administrative access to Google Search Console for the domain'],
                  'covered': "This is part of Sites Optimizer's setup, so there is no separate service here."},
    'csrc-eds': {'kind': 'outside', 'line': 'native', 'label': 'Edge Delivery publishes the documents authors write',
                 'availability': 'Generally available.',
                 'prereqs': ["Your client's Microsoft 365 or Google admin approves Adobe's access to the folder", 'Authors preview and publish from Sidekick']},
    'csrc-so': {'kind': 'outside', 'line': 'native', 'label': 'Sites Optimizer writes approved fixes back into the documents',
                'availability': 'Generally available.',
                'prereqs': ["On your client's own SharePoint domain, their Microsoft 365 admin registers the app and grants it write access; on Google Drive, your client shares the folder; on Adobe's SharePoint domain, nothing is needed"], 'tier': 'Sites Optimizer Ultimate'},
    'cms-bc': {'kind': 'outside', 'line': 'platform', 'label': 'Brand Concierge runs on any site through a tag manager',
               'availability': 'Brand Concierge is generally available; Brand Concierge for the Web SDK is in beta.',
               'prereqs': ["Your client's web team installs the script", 'Legal reviews the consent banner for chat data before go-live']},
    'crm-marketo': {'kind': 'outside', 'line': 'native', 'label': 'The CRM syncs natively with Marketo Engage',
                    'availability': 'Generally available.',
                    'prereqs': ['A Salesforce or Dynamics admin sets up a dedicated sync user', 'Sales, marketing and the CRM admin agree a data dictionary'],
                    'covered': 'The CRM sync and field mapping service sits on Marketo Engage itself.'},
    'crm-target': {'kind': 'outside', 'line': 'platform', 'label': 'CRM attributes reach Target through Customer Attributes',
                   'availability': 'Generally available.',
                   'prereqs': ['Visitors are identified on the site with a customer ID', 'A Customer Attributes product profile in the Admin Console'], 'tier': 'Target Premium for over 5 attributes'},
    'dwh-rtcdp': {'kind': 'outside', 'line': 'platform', 'label': 'Warehouse tables come into Experience Platform for Real-Time CDP',
                  'availability': 'Generally available.',
                  'prereqs': ["Your client allows Adobe's IP addresses in the warehouse"], 'tier': 'Real-Time CDP Ultimate or the Advanced Enterprise connectors'},
    'dwh-ajo': {'kind': 'outside', 'line': 'platform', 'label': "Data Mirror feeds Journey Optimizer's orchestrated campaigns",
                'availability': 'Generally available with the Campaigns package.',
                'prereqs': ["Change tracking is turned on in your client's tables", 'Your client manages deletes at the source'], 'tier': 'a Journey Optimizer Campaigns package'},
})
types['connections']['dwh-cja']['tier'] = 'CJA Select or higher'

# each play: the systems it offers and their places; the CDN starts on in every Brand Visibility play
BV = ['cja', 'commerce', 'aem', 'fsi', 'abv']
add = {'cja': {'ads': [2, 0], 'bi': [2, 1], 'search': [-1, 0]},
       'commerce': {'search': [-1, 0]},
       'aem': {'search': [-1, 0], 'csrc': [1, 1], 'aemassets': [2, 0]},
       'fsi': {'search': [-1, 0], 'cms': [2, 0]},
       'abv': {'search': [-1, 0]},
       'custom': {'ads': [-1, 0], 'bi': [2, -1], 'search': [4, 1], 'csrc': [4, 2], 'cms': [5, 0]}}
for pl in cmap['plays']:
    for k, v in add.get(pl['id'], {}).items():
        pl['outside'].append(k)
        pl['opos'][k] = v
    if pl['id'] in BV:
        pl['ostart'] = ['cdn']
        pl['recommend'] = ['cdn', 'search']
    if pl['id'] == 'custom':
        pl['recommend'] = ['cdn', 'search']
    if pl['id'] == 'aem':
        pl['addons'] = ['aemassets']
cmap['note'] += (" Step 45: a play's 'addons' are Adobe products a partner can add from the same menu (AEM Assets on the AEM play); 'ostart'"
                 " lists the outside systems on the canvas when the play starts (the CDN in every Brand Visibility play); 'recommend' tags"
                 " systems Recommended, with each one's reason in its 'rec'. A line or connection's 'tier' is the package it needs.")

OLD = "Brand Visibility's CJA source needs CDN logs; add the CDN with Add outside system."
NEW = "Brand Visibility's CJA source needs CDN logs, so the CDN belongs on the canvas."
n = 0
for p in probs['problems']:
    for r in p['refine']:
        if r.get('note') and OLD in r['note']:
            r['note'] = r['note'].replace(OLD, NEW)
            n += 1
assert n == 3 and OLD not in json.dumps(probs, ensure_ascii=False), n

for path, obj in ((MAP, cmap), (TYPES, types), (RES, research), (PROBS, probs)):
    s = json.dumps(obj, ensure_ascii=False, indent=1)
    assert '—' not in s and '–' not in s
    open(path, 'w', encoding='utf-8').write(s + '\n')
print('step 45 data: five outside systems,', len(research['connections']), 'connections, AEM Assets on the AEM play, the CDN on from the start;', n, 'notes updated')
