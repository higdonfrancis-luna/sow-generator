"""Step 28 data (Nov 3 2026): what an independent verification of step 27 confirmed, in the canvas data.
- Places: on a phone the CJA play's cloud storage and CRM boxes, and the AEM play's CDN, added a column, so the whole
  canvas shrank (names about 6 pixels at 390). They now sit in rows above: cloud storage and the CRM above Brand
  Visibility and CJA, the AEM play's CDN above Brand Visibility. No line crosses another; the stage keeps its scale.
- The data warehouse route is Data Mirror, the only route its service builds: Snowflake, Google BigQuery or Azure
  Databricks, with CJA Select, Prime or Ultimate (Adobe's CJA product description: Data Mirror is not included in
  Foundation). Amazon Redshift and Azure Synapse Analytics are advanced enterprise sources without Data Mirror, so
  they are no longer listed for this route.
- What the customer does first, checked against Adobe's source pages: Google BigQuery needs a dataset for temporary
  tables (BigQuery Data Editor on it), Azure Databricks needs a SAS token in the cluster's Spark configuration; JSON and
  Parquet files must already be XDM-compliant; CJA Foundation allows one event dataset per connection (cloud storage
  and CRM too); Brand Visibility's CDN-based capabilities are unavailable until a domain is onboarded.
Run once, after step 27's data (outside_step27.py); then build.py and build_site.py.

    python3 sow/canvas/data_step28.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MAP = os.path.join(HERE, 'catalog_map.json')
TYPES = os.path.join(HERE, 'research', 'connection_types.json')
cmap = json.load(open(MAP, encoding='utf-8'))
types = json.load(open(TYPES, encoding='utf-8'))
P = {p['id']: p for p in cmap['products']}
PL = {p['id']: p for p in cmap['plays']}
T = types['connections']
assert P['dwh']['systems'].endswith('with separate licensing'), 'run this once, after step 27'

# places: rows, not a new column, so a phone keeps the step 26 scale
assert PL['cja']['opos'] == {'cdn': [0, 1], 'dwh': [1, 1], 'cstore': [2, 1], 'crm': [2, 0]}
PL['cja']['opos'] = {'cdn': [0, 1], 'dwh': [1, 1], 'cstore': [0, -1], 'crm': [1, -1]}
assert PL['aem']['opos'] == {'cdn': [-1, 0]}
PL['aem']['opos'] = {'cdn': [0, -1]}

# the data warehouse route is Data Mirror
P['dwh']['systems'] = 'Snowflake, Google BigQuery or Azure Databricks, through Data Mirror'
T['dwh-cja']['availability'] = 'Needs CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation)'
T['dwh-cja']['prereqs'] = [
    'CJA Select, Prime or Ultimate, with Data Mirror enabled for the organization',
    "Warehouse credentials with the access the source needs: for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster's Spark configuration",
    "Adobe's IP addresses allowed where the warehouse needs it, and change tracking turned on for each table",
    'Experience Platform rights to manage sources, schemas and datasets in the CJA sandbox']

# cloud storage and CRM: the Foundation limit, and files Experience Platform reads
FOUNDATION = 'Included with a CJA license; CJA Foundation allows one event dataset per connection'
for cid in ('cstore-cja', 'crm-cja'):
    assert T[cid]['availability'] == 'Included with a CJA license'
    T[cid]['availability'] = FOUNDATION
assert T['cstore-cja']['prereqs'][0].startswith('Access to the storage location')
T['cstore-cja']['prereqs'][0] = 'Access to the storage location (credentials or a role), with delimited files, or JSON or Parquet files already in XDM format'

# the CDN: Brand Visibility reads CDN logs only for onboarded domains
T['cdn-bv']['prereqs'].append('Each agreed domain onboarded in Brand Visibility: CDN-based capabilities are unavailable until it is')

for path, obj in ((MAP, cmap), (TYPES, types)):
    s = json.dumps(obj, ensure_ascii=False, indent=1)
    assert '—' not in s and '–' not in s
    open(path, 'w', encoding='utf-8').write(s + '\n')
print('step 28 data: places on a phone, the Data Mirror route, and what the customer does first')
