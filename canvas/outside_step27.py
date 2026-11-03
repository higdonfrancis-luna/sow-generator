"""Step 27 data (Nov 3 2026): outside systems on the Build canvas, with Adam's yes. Adds to catalog_map.json the four
outside systems (CDN, Data warehouse, Cloud storage, CRM), their connections to Brand Visibility and CJA with the
services from sow/patch_step27.py, and each Brand Visibility play's outside systems and their places; and adds the four
connections' type (Outside system), line style, availability and the customer's prerequisites to
research/connection_types.json. Every route is checked against Adobe's pages (sow/canvas/OUTSIDE_SYSTEMS.md).
Run once, after sow/patch_step27.py; then build.py and build_site.py.

    python3 sow/canvas/outside_step27.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MAP = os.path.join(HERE, 'catalog_map.json')
TYPES = os.path.join(HERE, 'research', 'connection_types.json')
cmap = json.load(open(MAP, encoding='utf-8'))
types = json.load(open(TYPES, encoding='utf-8'))
assert not any(p.get('outside') for p in cmap['products']), 'run this once'

LF = 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview'
DM = 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-mirror/relational'
CJA_SRC = 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/sources'
AEP_SRC = 'https://experienceleague.adobe.com/en/docs/experience-platform/sources/home'
src = lambda u, t: {'url': u, 'title': t}

cmap['products'] += [
    {'id': 'cdn', 'name': 'CDN', 'outside': True, 'icon': 'cdn', 'systems': 'Akamai, Cloudflare, Amazon CloudFront, Fastly, Imperva, or any other through files', 'lines': [], 'more': []},
    {'id': 'dwh', 'name': 'Data warehouse', 'outside': True, 'icon': 'dwh', 'systems': 'Snowflake, Google BigQuery, Azure Databricks; Amazon Redshift and Azure Synapse Analytics with separate licensing', 'lines': [], 'more': []},
    {'id': 'cstore', 'name': 'Cloud storage', 'outside': True, 'icon': 'cloud', 'systems': 'Amazon S3, Azure Blob Storage, Azure Data Lake Storage Gen2, Google Cloud Storage, SFTP', 'lines': [], 'more': []},
    {'id': 'crm', 'name': 'CRM', 'outside': True, 'icon': 'crm', 'systems': 'Salesforce, Microsoft Dynamics 365', 'lines': [], 'more': []},
]
cmap['connections'] += [
    {'id': 'cdn-bv', 'a': 'cdn', 'b': 'bv', 'lines': [], 'more': ['OX1', 'OX2'],
     'how': "Brand Visibility generates the storage credentials and path; the customer's CDN team creates the log job in its CDN console. Adobe has guides for Akamai, Cloudflare, Amazon CloudFront, Fastly and Imperva, and any other CDN or log store can upload files in Adobe's format. Without it, the Agentic Traffic dashboard can't display metrics.",
     'source': src(LF, 'Experience League: Brand Visibility, CDN log forwarding'),
     'gain': {'title': 'AI-agent and referral traffic', 'text': 'Which AI agents read which pages, and the visits AI answers send.'},
     'flows': [{'from': 'cdn', 'to': 'bv', 'what': "Access logs, on the CDN's schedule", 'needs': [], 'source': src(LF, 'Experience League: Brand Visibility, CDN log forwarding')}]},
    {'id': 'dwh-cja', 'a': 'dwh', 'b': 'cja', 'lines': ['OX3'], 'more': [],
     'how': 'With Data Mirror, a Snowflake, Google BigQuery or Azure Databricks source keeps inserts, updates and deletes in sync in relational datasets, which the CJA connection joins on a person or account ID.',
     'source': src(DM, 'Experience League: CJA and Data Mirror'),
     'gain': {'title': 'Warehouse data in CJA', 'text': 'Orders, accounts and other warehouse facts next to web and AI-referred traffic.'},
     'flows': [{'from': 'dwh', 'to': 'cja', 'what': 'Warehouse tables, kept in sync row by row', 'needs': [], 'source': src(DM, 'Experience League: CJA and Data Mirror')}]},
    {'id': 'cstore-cja', 'a': 'cstore', 'b': 'cja', 'lines': ['OX4'], 'more': [],
     'how': 'An Experience Platform cloud storage source loads the files on a schedule into a dataset, which the CJA connection reads.',
     'source': src(CJA_SRC, 'Experience League: CJA, ingest data through sources'),
     'gain': {'title': 'File feeds in CJA', 'text': 'Data the customer already exports to files, next to web and AI-referred traffic.'},
     'flows': [{'from': 'cstore', 'to': 'cja', 'what': 'Files, on a schedule', 'needs': [], 'source': src(CJA_SRC, 'Experience League: CJA, ingest data through sources')}]},
    {'id': 'crm-cja', 'a': 'crm', 'b': 'cja', 'lines': ['OX5'], 'more': [],
     'how': 'An Experience Platform CRM source loads the agreed objects incrementally into datasets, which the CJA connection joins on an ID the web data also carries.',
     'source': src(AEP_SRC, 'Experience League: Experience Platform sources'),
     'gain': {'title': 'CRM data in CJA', 'text': 'Accounts, opportunities and activities next to web and AI-referred traffic.'},
     'flows': [{'from': 'crm', 'to': 'cja', 'what': 'CRM objects, loaded incrementally', 'needs': [], 'source': src(AEP_SRC, 'Experience League: Experience Platform sources')}]},
]
places = {'cja': {'cdn': [0, 1], 'dwh': [1, 1], 'cstore': [2, 1], 'crm': [2, 0]},
          'commerce': {'cdn': [0, 1]}, 'aem': {'cdn': [-1, 0]}, 'fsi': {'cdn': [0, 1]}, 'abv': {'cdn': [0, 1]}}
# (in the AEM play the CDN sits left of Brand Visibility: under Edge Delivery Services its line crossed Sites Optimizer's)
for pl in cmap['plays']:
    if pl['id'] in places:
        pl['outside'] = list(places[pl['id']])
        pl['opos'] = places[pl['id']]
cmap['note'] += (" Outside systems (step 27): products marked 'outside' are systems the customer runs outside Adobe. A play lists the"
                 " ones a partner can add ('outside') and their places ('opos'); none is on when the play starts.")

LIC = 'Included with a CJA license'
types['connections'].update({
    'cdn-bv': {'kind': 'outside', 'line': 'native', 'label': "The customer's CDN sends its access logs to Brand Visibility",
               'availability': '',
               'prereqs': ["The customer's CDN team creates the log job in its CDN console, or gives the partner access to do it",
                           'A Brand Visibility user who can manage the CDN configuration',
                           "For a CDN without an Adobe guide, or a log store, an export in Adobe's file format with the exact field names"]},
    'dwh-cja': {'kind': 'outside', 'line': 'platform', 'label': 'Warehouse tables come into Experience Platform datasets that a CJA connection reads',
                'availability': 'Needs CJA Select, Prime or Ultimate (Data Mirror), or separately licensed warehouse connectors',
                'prereqs': ['CJA Select, Prime or Ultimate for Data Mirror; otherwise separately licensed warehouse connectors',
                            "Warehouse credentials, Adobe's IP addresses allowed, and change tracking turned on for each table",
                            'Experience Platform rights to manage sources, schemas and datasets in the CJA sandbox']},
    'cstore-cja': {'kind': 'outside', 'line': 'platform', 'label': 'Files in cloud storage come into Experience Platform datasets that a CJA connection reads',
                   'availability': LIC,
                   'prereqs': ['Access to the storage location (credentials or a role) and files in a format Experience Platform reads',
                               "Adobe's IP addresses allowed where the storage needs it",
                               'Experience Platform rights to manage sources, schemas and datasets in the CJA sandbox']},
    'crm-cja': {'kind': 'outside', 'line': 'platform', 'label': 'CRM objects come into Experience Platform datasets that a CJA connection reads',
                'availability': LIC,
                'prereqs': ['A CRM API user, and the objects and fields agreed with the CRM administrator',
                            "Adobe's IP addresses allowed where the CRM needs it",
                            'Experience Platform rights to manage sources, schemas and datasets in the CJA sandbox']},
})
for path, obj in ((MAP, cmap), (TYPES, types)):
    s = json.dumps(obj, ensure_ascii=False, indent=1)
    assert '—' not in s and '–' not in s
    open(path, 'w', encoding='utf-8').write(s + '\n')
print('outside systems added to catalog_map.json and connection_types.json')
