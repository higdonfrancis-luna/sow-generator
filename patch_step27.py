"""Step 27 of the SOW tool (Nov 3 2026): outside systems, with Adam's yes ("I like it", then "yes"). The Build canvas can
now add systems the customer runs outside Adobe (sow/canvas/patch_step27.py); these are the SOW steps' half.
- Five services, each sourced to Adobe's pages (sow/canvas/OUTSIDE_SYSTEMS.md): CDN log forwarding set up by the
  partner and a log export from another CDN or log store (every Brand Visibility play; they start off, since Brand
  Visibility setup already gets log forwarding done with the customer's IT team); warehouse tables, cloud storage
  files and CRM data into CJA (the CJA play).
- The engagement keeps which outside systems are on the canvas, per play (state.outside), through the hand-over,
  drafts and the canvas restore. A service on an outside system counts, and is offered under Add service, only while
  that system is on the canvas; back on Build it keeps no choice there until its system is added.
- Counted once: when CJA data preparation in Experience Platform is on, it covers the three CJA source services, so
  the canvas shows them as covered and they stay off here unless the partner keeps them on purpose; one kept on
  beside data preparation must say how it differs before the SOW is issued, as the generic Coworker Skills do.
- The SOW's Dependencies and risks say what the customer's teams do for each outside system on the canvas, and who
  sets up CDN log forwarding when the partner does it.
Run once on the step 24 file (sow/index.html); every anchor must appear exactly once.

    python3 patch_step27.py index.html
"""
import json
import re
import sys

path = sys.argv[1]
html = open(path, encoding='utf-8').read()
assert 'PRIOR24' in html and '"outside"' not in html and 'outsideOk' not in html, 'run this on the step 24 file'


def rep(old, new, count=1):
    global html
    n = html.count(old)
    assert n == count, f'anchor found {n} times, expected {count}: {old[:90]!r}'
    html = html.replace(old, new)


m = re.search(r'<script>const CATALOG=(\[.*?\]);</script>', html)
raw = m.group(1)
CAT = json.loads(raw)
assert json.dumps(CAT, ensure_ascii=False) == raw
assert not {'OX1', 'OX2', 'OX3', 'OX4', 'OX5'} & {c['id'] for c in CAT}

LF = 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview'
LF_OTHER = 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/other'
DM = 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-mirror/relational'
CJA_PD = 'https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html'
CJA_SRC = 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/sources'
AEP_SRC = 'https://experienceleague.adobe.com/en/docs/experience-platform/sources/home'
BV_PLAYS = ['cja', 'commerce', 'aem', 'fsi', 'abv']
COVERS = ' When CJA data preparation in Experience Platform is also in this SOW, it covers this work; when Connections, data views and stitching is, it covers adding {} to the connection.'

NEW = [
    {'id': 'OX1', 'stage': 'Connect', 'base': 16, 'low': 8, 'high': 32, 'plays': BV_PLAYS, 'unit': 'one-time', 'outside': 'cdn',
     'name': 'CDN log forwarding, set up by the partner',
     'basis': 'Up to three domains on one CDN that has an Adobe log forwarding guide.',
     'scope': "With access and change approval from the customer's CDN team, register the CDN on Brand Visibility's CDN Configuration page and create the log-forwarding job in the CDN console, following Adobe's guide for that CDN (Akamai, Cloudflare, Amazon CloudFront, Fastly or Imperva), then confirm the logs arrive.",
     'deliverable': 'A working log-forwarding job for each agreed domain, with a short record of its settings.',
     'acceptance': 'Brand Visibility receives the access logs for each agreed domain, and the Agentic Traffic dashboard displays metrics.',
     'assumptions': "The customer gives the partner access to its CDN console and approves the change. Brand Visibility setup and baseline already agrees the date and the access with the customer's IT team; this service is the hands-on CDN work when the customer asks the partner to do it.",
     'exclusions': 'Other CDN changes, and CDNs without an Adobe guide or logs kept elsewhere (see Log export from another CDN or log store).',
     'source': LF, 'sourceTitle': 'Experience League: Brand Visibility, CDN log forwarding',
     'bands': {'driver': 'Domains and CDNs', 'small': {'qty': 'One domain on one CDN'}, 'typical': {'qty': 'Up to 3 domains on one CDN'}, 'large': {'qty': 'Up to 10 domains, or two CDNs'}}},
    {'id': 'OX2', 'stage': 'Connect', 'base': 40, 'low': 24, 'high': 72, 'plays': BV_PLAYS, 'unit': 'one-time', 'outside': 'cdn',
     'name': 'Log export from another CDN or log store',
     'basis': "One CDN without an Adobe guide, or one log store, sending one domain's access logs.",
     'scope': 'For a CDN without an Adobe guide, or logs kept in a log store such as Splunk or Elasticsearch: build and schedule an export that writes the access logs as newline-delimited JSON with the field names and types Adobe specifies, and uploads them to the dated location Brand Visibility provides.',
     'deliverable': 'A scheduled export, its documentation and one validated day of logs.',
     'acceptance': "A day of logs uploads without skipped lines and shows in Brand Visibility's reports after Adobe's daily processing.",
     'assumptions': "The customer's logs contain the fields Adobe requires, and the customer runs the scheduler or serverless function that sends them (Adobe's examples are AWS Lambda and Azure Functions). Adobe processes uploaded logs near the end of each UTC day; malformed lines may be skipped.",
     'exclusions': 'Changes to the CDN or the log store, and log retention.',
     'source': LF_OTHER, 'sourceTitle': 'Experience League: Brand Visibility, other log providers',
     'bands': {'driver': 'Domains and log sources', 'small': {'qty': 'One domain from one source'}, 'typical': {'qty': 'Up to 3 domains from one source'}, 'large': {'qty': 'Up to 10 domains, or two sources'}}},
    {'id': 'OX3', 'stage': 'Connect', 'base': 56, 'low': 32, 'high': 96, 'plays': ['cja'], 'unit': 'one-time', 'outside': 'dwh',
     'name': 'Warehouse tables into CJA',
     'basis': 'Up to five tables from one Snowflake, Google BigQuery or Azure Databricks warehouse.',
     'scope': "For the agreed tables: turn on change tracking for each table with the customer's data team, create the relational schemas (a primary key and a version, plus a timestamp for event data), set up the Experience Platform source with change data capture (Data Mirror), map the fields and set the schedule, add the datasets to the existing CJA connection with their join, and add their fields to the data view.",
     'deliverable': 'Synced datasets for the agreed tables in the CJA connection and data view, with a mapping record.',
     'acceptance': 'Record counts in CJA match the warehouse for an agreed day, and an update and a delete made in the warehouse show in CJA after the next sync.',
     'assumptions': "The customer has CJA Select, Prime or Ultimate (Data Mirror is not in CJA Foundation) or separately licensed warehouse connectors, and Data Mirror is enabled for the organization. The customer's data team provides credentials, allows Adobe's IP addresses and turns on change tracking for each table (each warehouse has its own setting). Mirrored changes count toward the CJA ingestion limit. Amazon Redshift and Azure Synapse Analytics need separately licensed connectors, without Data Mirror." + COVERS.format('these datasets'),
     'exclusions': "Changes to the customer's warehouse or tables, licenses, and new CJA connections or data views.",
     'source': DM, 'sourceTitle': 'Experience League: CJA and Data Mirror', 'source2': CJA_PD, 'sourceTitle2': 'Adobe: CJA product description',
     'bands': {'driver': 'Warehouse tables', 'small': {'qty': 'Up to 2 tables'}, 'typical': {'qty': 'Up to 5 tables'}, 'large': {'qty': 'Up to 12 tables, or two warehouses'}}},
    {'id': 'OX4', 'stage': 'Connect', 'base': 40, 'low': 24, 'high': 72, 'plays': ['cja'], 'unit': 'one-time', 'outside': 'cstore',
     'name': 'Cloud storage files into CJA',
     'basis': 'Up to three file feeds from one cloud storage location.',
     'scope': 'For the agreed file feeds in Amazon S3, Azure Blob Storage, Azure Data Lake Storage Gen2, Google Cloud Storage or SFTP: create the schema and dataset, set up the Experience Platform cloud storage source (authentication, files, mapping and schedule), add the dataset to the existing CJA connection and its fields to the data view, and check the first loads.',
     'deliverable': 'Scheduled dataflows for the agreed feeds, their datasets in the CJA connection and data view, and a mapping record.',
     'acceptance': 'The first scheduled loads succeed, and the records in CJA match the source files for an agreed day.',
     'assumptions': "Included with a CJA license. The customer provides the storage location, credentials and files in a format Experience Platform reads (delimited, JSON or Parquet), and allows Adobe's IP addresses where needed. CJA Foundation allows one event dataset per connection." + COVERS.format('this dataset'),
     'exclusions': "Building the customer's exports into storage, new CJA connections or data views, and file cleanup.",
     'source': CJA_SRC, 'sourceTitle': 'Experience League: CJA, ingest data through sources',
     'bands': {'driver': 'File feeds', 'small': {'qty': 'One feed'}, 'typical': {'qty': 'Up to 3 feeds'}, 'large': {'qty': 'Up to 8 feeds, or two locations'}}},
    {'id': 'OX5', 'stage': 'Connect', 'base': 40, 'low': 24, 'high': 72, 'plays': ['cja'], 'unit': 'one-time', 'outside': 'crm',
     'name': 'CRM data into CJA',
     'basis': 'Up to four objects from one Salesforce or Microsoft Dynamics 365 CRM.',
     'scope': 'For the agreed CRM objects (for example contacts, accounts, opportunities and activities): set up the Experience Platform CRM source with an API user, map each object to a schema (profile, lookup or event data keyed on an ID the web data also carries), schedule incremental loads, add the datasets to the existing CJA connection and their fields to the data view, and check the first loads.',
     'deliverable': 'Scheduled CRM dataflows, their datasets in the CJA connection and data view, and a mapping record.',
     'acceptance': 'The first loads succeed, and record counts in CJA match the CRM for an agreed day.',
     'assumptions': "Included with a CJA license. The customer's CRM administrator provides an API user and agrees the objects and fields, and Adobe's IP addresses are allowed where needed." + COVERS.format('these datasets'),
     'exclusions': 'CRM configuration or data cleanup, and new CJA connections or data views.',
     'source': AEP_SRC, 'sourceTitle': 'Experience League: Experience Platform sources', 'source2': CJA_SRC, 'sourceTitle2': 'Experience League: CJA, ingest data through sources',
     'bands': {'driver': 'CRM objects', 'small': {'qty': 'Up to 2 objects'}, 'typical': {'qty': 'Up to 4 objects'}, 'large': {'qty': 'Up to 8 objects, or two CRMs'}}},
]
CAT.extend(NEW)
blob = json.dumps(CAT, ensure_ascii=False)
assert '—' not in blob and '–' not in blob
rep('<script>const CATALOG=' + raw + ';</script>', '<script>const CATALOG=' + blob + ';</script>')

BRACES = html.count('{') - html.count('}')

# the engagement keeps the outside systems on the canvas, per play
rep("customProducts:[],v14:true,briefs:{},estimates:{},custom:[],canvas:[],handoffAt:0}",
    "customProducts:[],v14:true,briefs:{},estimates:{},custom:[],canvas:[],outside:{},handoffAt:0}")
rep("d.customProducts=Array.isArray(s.customProducts)?s.customProducts.filter(x=>typeof x==='string'&&/^[\\w-]{1,40}$/.test(x)).slice(0,30):[];",
    "d.customProducts=Array.isArray(s.customProducts)?s.customProducts.filter(x=>typeof x==='string'&&/^[\\w-]{1,40}$/.test(x)).slice(0,30):[];d.outside=normOutside(s.outside);")
# the hand-over says which are on
rep(" if(validSize(h.size)&&h.size!==state.size){state.sizeManual=true;applySize(h.size);}",
    " state.outside=state.outside&&typeof state.outside==='object'?state.outside:{};state.outside[p]=Array.isArray(h.outside)?[...new Set(h.outside.filter(x=>typeof x==='string'&&outsideAllowed(p,x)))]:[];\n"
    " if(validSize(h.size)&&h.size!==state.size){state.sizeManual=true;applySize(h.size);}")
# a service on an outside system counts, and is offered, only while that system is on the canvas
rep("const entries=()=>catalog().filter(s=>s.plays.includes(state.play)&&!s.locked);",
    "const entries=()=>catalog().filter(s=>s.plays.includes(state.play)&&!s.locked&&outsideOk(s));\n"
    "/* outside systems (step 27): a service on one counts, and is offered under Add service, only while that system is on the canvas */\n"
    "function outsideAllowed(p,id){return CATALOG.some(c=>c.outside===id&&c.plays.includes(p));}\n"
    "function normOutside(v){const o={};if(v&&typeof v==='object'&&!Array.isArray(v))for(const p of Object.keys(v))if(Array.isArray(v[p])){const ids=[...new Set(v[p].filter(x=>typeof x==='string'&&outsideAllowed(p,x)))];if(ids.length)o[p]=ids;}return o;}\n"
    "const outsideOn=id=>((state.outside||{})[state.play]||[]).includes(id);\n"
    "const outsideOk=s=>!s.outside||outsideOn(s.outside);\n"
    "/* counted once: CJA data preparation in Experience Platform covers the three CJA source services */\n"
    "const COVER={OX3:'CJ01',OX4:'CJ01',OX5:'CJ01'};")
# the canvas restore brings them back; a covered service the partner keeps on here stays kept on the canvas
rep("c.on=state.play==='custom'?state.customProducts.slice():[];",
    "c.on=state.play==='custom'?state.customProducts.slice():[];c.out=((state.outside||{})[state.play]||[]).slice();")
rep("if(on||!special)c.ls.CW03=on;continue;}c.ls[id]=on;}}",
    "if(on||!special)c.ls.CW03=on;continue;}\n"
    "  if(COVER[id]){const cov=lines.some(x=>baseId(x)===COVER[id]&&est[x.id].on);if(cov)c.keep[id]=on;else delete c.keep[id];if(on||!cov)c.ls[id]=on;continue;}c.ls[id]=on;}}")
# a covered service kept on beside the one that covers it must say how it differs before the SOW is issued, as the generic Skills do
rep("const OVERLAPS=[['CW03',SPECIAL_SKILLS],['C04',['F02']]];",
    "const OVERLAPS=[['CW03',SPECIAL_SKILLS],['C04',['F02']],['OX3',['CJ01']],['OX4',['CJ01']],['OX5',['CJ01']]];")
# back on Build, a service on an outside system that is not on the canvas keeps no choice there, so adding the system
# later brings its starting services (an explicit off here kept the warehouse line off when the box was added)
rep("for(const s of lines){const id=baseId(s),on=!!est[s.id].on;if(id==='CW03')",
    "for(const s of lines){const id=baseId(s),on=!!est[s.id].on;\n"
    "  /* a service on an outside system that is not on the canvas keeps no choice there: added later, the system brings its starting services */\n"
    "  if(!outsideOk(s))continue;if(id==='CW03')")
# the customer's part for each outside system, and who sets up CDN log forwarding
rep("if(has('L02','C01'))out.push('CDN log forwarding is set up by the customer\\'s IT team. It gates",
    "if(has('L02','C01','OX1','OX2'))out.push((has('OX1','OX2')?'CDN log forwarding is set up by the partner, with access and change approval from the customer\\'s CDN team':'CDN log forwarding is set up by the customer\\'s IT team')+'. It gates")
rep(" if(lines.some(l=>l.concept))out.push('Service concepts are not quote-ready until their quantity, deliverable and acceptance criteria are written.');",
    " if(outsideOn('dwh'))out.push('Data warehouse: the customer\\'s data team gives read access to the agreed tables, allows Adobe\\'s IP addresses and turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate; other warehouse connectors need separate licensing.');\n"
    " if(outsideOn('cstore'))out.push('Cloud storage: the customer gives access to the agreed storage location, keeps the file feeds in an agreed format and allows Adobe\\'s IP addresses where needed.');\n"
    " if(outsideOn('crm'))out.push('CRM: the customer\\'s CRM administrator gives an API user, agrees the objects and fields, and allows Adobe\\'s IP addresses where needed.');\n"
    " if(lines.some(l=>l.concept))out.push('Service concepts are not quote-ready until their quantity, deliverable and acceptance criteria are written.');")

assert html.count('{') - html.count('}') == BRACES, 'braces out of balance'
assert '—' not in html and '–' not in html, 'an em or en dash slipped in'
open(path, 'w', encoding='utf-8').write(html)
print('step 27 applied: outside systems on the SOW steps (5 services, state, hand-over, filter, restore, dependencies)')
