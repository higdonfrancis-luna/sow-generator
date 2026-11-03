"""Step 28 of the SOW tool (Nov 3 2026): what an independent verification of step 27 confirmed, on the SOW steps
(four reviewers tried to break it in a browser, in the code and against Adobe's pages; a skeptic re-ran each finding).
The canvas's half is sow/canvas/patch_step28.py, the data sow/canvas/data_step28.py.
- Use starting scope keeps the starting services of the outside systems on the canvas (it turned the warehouse,
  cloud storage and CRM services off while their boxes stayed: $240,000 became $219,600).
- An outside system's services keep the engagement's choice on every path: a line starts as it does on the canvas
  (OX3 to OX5 on, OX1 and OX2 off), and back on Build the canvas takes the line's choice whether its system is on or
  not, so a system removed and added again comes back the same after a trip to Services or a draft opened elsewhere.
- Wording checked against Adobe's pages: the warehouse service is Data Mirror only (Snowflake, Google BigQuery or
  Azure Databricks, CJA Select, Prime or Ultimate), with what each warehouse's source needs (BigQuery's dataset for
  temporary tables, Databricks' Spark configuration) and who turns on change tracking (the customer); JSON and Parquet
  files must already be in XDM format; CJA Foundation's one event dataset per connection on the CRM too; which of these
  sources Adobe lists for Experience Platform on AWS; domains already onboarded in Brand Visibility for CDN logs;
  the log export's basis at its Typical band; and the CJA product description as the source for "included with a
  CJA license".
- No service says another covers it while both are charged: a kept source service says it covers only the work CJA
  data preparation doesn't, and the claim that Connections, data views and stitching covers adding the datasets is
  gone (each service adds its own datasets to whichever connection the SOW has).
- CDN log forwarding has one owner throughout: the customer's IT team owns the change; with OX1 the partner creates
  the log job in the CDN console with the team's access and change approval, and with OX2 the partner builds an export
  that the customer's team runs.
Run once on the step 27 file; every anchor must appear exactly once.

    python3 patch_step28.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'outsideOk' in html and 'OUT_START' not in html, 'run this on the step 27 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


# the five services' wording
m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
by = {c['id']: c for c in CAT}
CJA_PD = 'https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html'
PD_TITLE = 'Adobe: CJA product description'
OLD_COVERS = (' When CJA data preparation in Experience Platform is also in this SOW, it covers this work; when Connections, '
              'data views and stitching is, it covers adding {} to the connection.')
COVERS = ' When CJA data preparation in Experience Platform is also in this SOW, this service covers only the work that service does not.'
CONNECTION = 'the CJA connection (the existing connection, or the one Connections, data views and stitching sets up)'


def swap(cid, key, old, new):
    t = by[cid][key]
    assert t.count(old) == 1, (cid, key, old)
    by[cid][key] = t.replace(old, new)


# OX1: the customer's IT team owns the change; domains must be onboarded
swap('OX1', 'assumptions', "The customer gives the partner access to its CDN console and approves the change. Brand Visibility setup and baseline already agrees the date and the access with the customer's IT team;",
     "The customer's IT team owns the change: it gives the partner access to its CDN console and approves the change. Each agreed domain is already onboarded in Brand Visibility (Adobe notes that CDN-based capabilities are unavailable until a domain is). Brand Visibility setup and baseline already agrees the date with the customer's IT team;")
# OX2: the basis follows its Typical band; domains must be onboarded
assert by['OX2']['basis'] == "One CDN without an Adobe guide, or one log store, sending one domain's access logs."
by['OX2']['basis'] = 'Up to three domains from one CDN without an Adobe guide, or from one log store.'
swap('OX2', 'assumptions', "The customer's logs contain the fields Adobe requires,",
     "Each agreed domain is already onboarded in Brand Visibility. The customer's logs contain the fields Adobe requires,")
# OX3: Data Mirror only; the customer turns on change tracking; what each warehouse's source needs
swap('OX3', 'basis', 'Up to five tables from one Snowflake, Google BigQuery or Azure Databricks warehouse.',
     'Up to five tables from one Snowflake, Google BigQuery or Azure Databricks warehouse, through Data Mirror.')
swap('OX3', 'scope', "For the agreed tables: turn on change tracking for each table with the customer's data team, create",
     "For the agreed tables: confirm with the customer's data team that change tracking is on for each table, create")
swap('OX3', 'scope', 'add the datasets to the existing CJA connection with their join,', 'add the datasets to ' + CONNECTION + ' with their join,')
swap('OX3', 'assumptions', 'The customer has CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation) or separately licensed warehouse connectors, and Data Mirror is enabled for the organization.',
     'The customer has CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation), and Data Mirror is enabled for the organization.')
swap('OX3', 'assumptions', "The customer's data team provides credentials, allows Adobe's IP addresses and turns on change tracking for each table (each warehouse has its own setting).",
     "The customer's data team gives the access the source needs (for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster's Spark configuration), allows Adobe's IP addresses where the warehouse needs it and turns on change tracking for each table (each warehouse has its own setting).")
swap('OX3', 'assumptions', 'Amazon Redshift and Azure Synapse Analytics need separately licensed connectors, without Data Mirror.',
     'Other warehouses, such as Amazon Redshift or Azure Synapse Analytics, need separately licensed source connectors without Data Mirror, and a service of their own. On Experience Platform running on AWS, Adobe lists Google BigQuery and Snowflake as sources, not Azure Databricks.')
swap('OX3', 'assumptions', OLD_COVERS.format('these datasets'), COVERS)
swap('OX3', 'exclusions', "Changes to the customer's warehouse or tables,", "Changes to the customer's warehouse or tables (the customer turns on change tracking),")
# OX4: files Experience Platform reads; the license source; AWS
swap('OX4', 'scope', 'add the dataset to the existing CJA connection and its fields', 'add the dataset to ' + CONNECTION + ' and its fields')
swap('OX4', 'assumptions', 'Included with a CJA license.', "Included with a CJA license (Adobe's product description lets the customer configure non-Adobe sources into CJA).")
swap('OX4', 'assumptions', 'files in a format Experience Platform reads (delimited, JSON or Parquet)', 'delimited files, or JSON or Parquet files already in XDM format')
swap('OX4', 'assumptions', 'CJA Foundation allows one event dataset per connection.',
     'CJA Foundation allows one event dataset per connection. On Experience Platform running on AWS, Adobe lists Amazon S3 among these sources; the others are listed for Azure.')
swap('OX4', 'assumptions', OLD_COVERS.format('this dataset'), COVERS)
by['OX4']['source2'], by['OX4']['sourceTitle2'] = CJA_PD, PD_TITLE
# OX5: the Foundation limit; the license source; AWS
swap('OX5', 'scope', 'add the datasets to the existing CJA connection and their fields', 'add the datasets to ' + CONNECTION + ' and their fields')
swap('OX5', 'assumptions', 'Included with a CJA license.', "Included with a CJA license (Adobe's product description lets the customer configure non-Adobe sources into CJA).")
swap('OX5', 'assumptions', "and Adobe's IP addresses are allowed where needed.",
     "and Adobe's IP addresses are allowed where needed. CJA Foundation allows one event dataset per connection. On Experience Platform running on AWS, Adobe lists Salesforce as a source, not Microsoft Dynamics 365.")
swap('OX5', 'assumptions', OLD_COVERS.format('these datasets'), COVERS)
by['OX5']['source2'], by['OX5']['sourceTitle2'] = CJA_PD, PD_TITLE
blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')

BRACES = html.count('{') - html.count('}')

# the outside systems' services that start on when their system is added, as on the canvas
rep("fsi:['L01','L02','F02','O01','O02']};",
    "fsi:['L01','L02','F02','O01','O02']};\n"
    "/* outside systems (step 28): the services that start on when their system is added, as on the canvas */\n"
    "const OUT_START=['OX3','OX4','OX5'];")
rep("r=newLine(c,STARTERS[p].includes(c.id),d.size,p);", "r=newLine(c,STARTERS[p].includes(c.id)||OUT_START.includes(c.id),d.size,p);")
rep("(state.estimates[p][s.id]=newLine(s,false,state.size,p))", "(state.estimates[p][s.id]=newLine(s,OUT_START.includes(s.id),state.size,p))")
# Use starting scope keeps the starting services of the outside systems on the canvas
rep("for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id);",
    "for(const s of entries())row(s).on=STARTERS[state.play].includes(s.id)||OUT_START.includes(s.id);")
# back on Build, the canvas takes the line's choice whether its system is on or not
rep("  /* a service on an outside system that is not on the canvas keeps no choice there: added later, the system brings its starting services */\n"
    "  if(!outsideOk(s))continue;if(id==='CW03')",
    "  /* a service on an outside system that is not on the canvas: the canvas takes the engagement's choice (the starting one unless the partner changed it), so the system added again comes back the same on every path */\n"
    "  if(!outsideOk(s)){c.ls[id]=on;delete c.keep[id];continue;}if(id==='CW03')")
# one owner for CDN log forwarding
rep("if(has('L02','C01','OX1','OX2'))out.push((has('OX1','OX2')?'CDN log forwarding is set up by the partner, with access and change approval from the customer\\'s CDN team':'CDN log forwarding is set up by the customer\\'s IT team')+'. It gates",
    "if(has('L02','C01','OX1','OX2'))out.push((has('OX1')?'CDN log forwarding is the customer\\'s IT team\\'s change: the partner creates the log job in the CDN console with the team\\'s access and change approval'+(has('OX2')?', and builds a log export in Adobe\\'s file format that the customer\\'s team runs':''):has('OX2')?'CDN log forwarding comes through a log export the partner builds in Adobe\\'s file format and the customer\\'s team runs':'CDN log forwarding is set up by the customer\\'s IT team')+'. It gates")
# what the customer's data team does for each warehouse's source
rep(" if(outsideOn('dwh'))out.push('Data warehouse: the customer\\'s data team gives read access to the agreed tables, allows Adobe\\'s IP addresses and turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate; other warehouse connectors need separate licensing.');",
    " if(outsideOn('dwh'))out.push('Data warehouse: the customer\\'s data team gives the access the source needs (for Google BigQuery, a dataset for temporary tables; for Azure Databricks, a SAS token in the cluster\\'s Spark configuration), allows Adobe\\'s IP addresses where the warehouse needs it and turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate.');")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 28 applied: starting scope, choices on every path, wording checked against Adobe, one owner for CDN log forwarding')
