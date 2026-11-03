# Outside systems on the Build canvas (proposed November 2, built November 3 2026)

Adam (Nov 2): "what are your thoughts about partners being able to add data ingestions and from data lakes, data warehouse, however the heck external data comes into the adobe products from the outside. maybe we don't add it to the plays out of the box. but it allows partners to add other pieces to the architecture that are not just adobe products."

Status: built as step 27 (Nov 3; Adam: "I like it", "yes", and "create an SVG image of it that looks like whatever a database or a data warehouse or a CDN would look like"), tested in `sow/site/`, not deployed (the same Netlify block). What was built, and where it differs from the proposal below, is under [Built as step 27](#built-as-step-27-november-3) at the end. The proposal is kept as written. Mockup: `sow/mockups/nov2_exports/outside_systems_mockup.png` (made from a scratch copy of the real canvas by `sow/mockups/nov2_exports/outside/mock_outside.js` and `board_outside.js`, with the wording in `content.json`).

## Recommendation

Yes. Getting the customer's own data into the Adobe products is in almost every real SOW, it is often the longest item (CDN log forwarding already is, for every Brand Visibility play), and it is work partners are good at. Showing it on the canvas makes the architecture honest and puts that work, and what the customer's IT owns, into the SOW.

## How it would work

- **Off by default** in every play. Nothing changes until a partner adds an outside system.
- **Add outside system**, a button on every play (not only Create your own play). Its menu lists only the outside systems that connect to the play's products, each with the systems Adobe names for that route.
- **Generic boxes, not brands:** CDN, Data warehouse, Cloud storage, CRM. Drawn as dashed boxes with a dark top bar and an OUTSIDE ADOBE tag, so nobody mistakes them for Adobe products.
- **Only routes Adobe documents.** Each connection has its card: an Outside system label, how it connects, license needs (on the Availability line), the customer's own tasks under Before it works, and the Experience League link.
- **Services with planning hours** (low, typical, high) on each connection, flowing to the Services step and the SOW like any other connection line. The customer's own tasks go to the SOW's Dependencies and risks.
- **No software prices** (Adam's rule) and **no double counting:** Brand Visibility setup (L02) already has the partner confirm CDN log forwarding with the customer's IT team, so the CDN box's partner lines start off and come on only when the partner does the CDN-side work itself.

## Counted once (Adam: "are we being redundant?")

Adding an outside system must never charge twice for work an existing service already covers. Rule: an outside system's own line counts only when no service on the canvas already covers that work; when one does, the line shows as covered, adds nothing, and can be kept on purpose for work that service doesn't cover. It reuses the tool's existing "replaced" behavior (generic Coworker Skills replaced by specialized ones). Mockup: `sow/mockups/nov2_exports/outside_counted_once.png` (`outside/mock_covered.js`), on the CJA play at $150 an hour: with CJA's own data preparation off (the play assumes an existing CJA customer), Warehouse tables into CJA adds $8,400 and the total is $228,000; with it turned on, the warehouse line is covered and adds $0, and the total is $231,600 (data preparation's $12,000, counted once).

Where existing services already cover the work (checked in `catalog.json`):

| Outside system to product | Covered by | Starts |
|---|---|---|
| Data warehouse, cloud storage or CRM to CJA | CJ01 CJA data preparation in Experience Platform (schemas, datasets and ingestion) and CJ02 Connections, data views and stitching | Off in the CJA play (More services), so the outside line counts unless the partner turns them on |
| CRM to Marketo Engage | MK02 CRM sync and field mapping | On when Marketo is added |
| Data warehouse, cloud storage or CRM to Real-Time CDP | RT02 Data sources and ingestion setup | On when Real-Time CDP is added |
| Any source to Journey Optimizer | JO02 Journey events, data sources and actions | On when Journey Optimizer is added |
| CDN to Brand Visibility | L02 Brand Visibility setup and baseline (gets log forwarding done with the customer's IT team); in the Commerce play, C07 CDN readiness and routing covers Optimize at Edge routing on the CDN | On, so the CDN lines start off and count only when the partner does the CDN-side work itself |

## First version, shown on the CJA play (checked against Adobe's pages)

| Outside system | Connects to | Route | Systems Adobe names | License | Source |
|---|---|---|---|---|---|
| CDN | Brand Visibility | Log forwarding: Brand Visibility generates the storage credentials and path; the customer's CDN team creates the log job in its CDN console. "Without CDN log forwarding, the Agentic Traffic dashboard cannot display metrics." Logs are processed in a daily run. | Akamai, Cloudflare, Amazon CloudFront (console or AWS CLI), Fastly, Imperva; any other CDN or a log store (for example Splunk or Elasticsearch) through newline-delimited JSON files in Adobe's format | None named | [Log forwarding overview](https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview), [Other providers](https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/other) |
| Data warehouse | CJA | Data Mirror: a warehouse source with change data capture keeps inserts, updates and deletes in sync in relational datasets that the CJA connection joins on a person or account ID. Each warehouse has its own change-tracking switch. | Snowflake, Google BigQuery, Azure Databricks | CJA Select, Prime or Ultimate. The warehouse connectors otherwise need separate licensing: "Customer may not import data from Advanced Enterprise Source Connectors unless used as part of AEP Data Mirror functionality or licensed separately." Experience Platform's page still calls Data Mirror a limited release; CJA's release notes list general availability on June 17, 2026. | [CJA and Data Mirror](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-mirror/relational), [Data Mirror overview](https://experienceleague.adobe.com/en/docs/experience-platform/xdm/data-mirror/overview), [CJA product description](https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html) |
| Cloud storage | CJA | Experience Platform cloud storage source (batch files) into a dataset, then the CJA connection and data view | Amazon S3, Azure Blob Storage, Azure Data Lake Storage Gen2, Google Cloud Storage, SFTP, and others in the sources catalog | Included with a CJA license (non-Adobe sources may be configured into CJA through the UI and API). CJA Foundation allows one event dataset per connection. | [CJA ingestion through sources](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/sources), [Sources overview](https://experienceleague.adobe.com/en/docs/experience-platform/sources/home) |
| CRM | CJA | Experience Platform CRM source (batch) into profile, lookup or event datasets | Salesforce, Microsoft Dynamics 365 (also SugarCRM and Veeva CRM in the catalog) | Included with a CJA license | [Sources overview](https://experienceleague.adobe.com/en/docs/experience-platform/sources/home) |

## Proposed services (planning assumptions, to be finalized at build)

| Line | Connection | Unit | Hours (low, typical, high) | Starts |
|---|---|---|---|---|
| CDN log forwarding, set up by the partner: create the log job in the customer's CDN console with Adobe's fields and format, validate the test file, confirm the dashboards fill | CDN + Brand Visibility | One-time | 8, 16, 32 | Off (L02 already confirms it with the customer's IT team) |
| Log export from another CDN or log store: build and schedule the export in Adobe's file format | CDN + Brand Visibility | One-time | 24, 40, 72 | Off |
| Warehouse tables into CJA: relational schemas, the source with change data capture, mapping and schedule, the connection join and data view fields, counts checked against the warehouse | Data warehouse + CJA | One-time | 32, 56, 96 | On when the box is added |
| Data pipeline monitoring: watch the dataflows, fix failed runs (Adobe disables a source dataflow that fails for 30 days), report ingestion against the CJA limit | Data warehouse + CJA | Monthly | 2, 4, 8 | Off |

Cloud storage and CRM lines follow the same pattern and come with the full research below.

## The wider research (checked as each route is built)

Researchers read Adobe's documentation for every product on the canvas and found 230 routes from outside systems (`sow/canvas/research/outside_systems.json`, with the page and an exact quote for each). Among them: bring-your-own CDN for Edge Delivery Services and a customer-managed CDN in front of AEM Sites; Experience Platform sources and Federated Audience Composition (querying Snowflake, BigQuery, Databricks, Redshift, Synapse, Microsoft Fabric, Oracle, Teradata and Vertica in place) for Real-Time CDP and Journey Optimizer; bulk import into AEM Assets from Azure, Amazon S3, Google Cloud, Dropbox and OneDrive; Marketo Engage's native Salesforce and Microsoft Dynamics sync; Target customer attributes and recommendations feeds; the Commerce integration starter kit for ERP, OMS and CRM; Brand Concierge knowledge sources; Coworker for teams connectors. The CJA routes above and the Brand Visibility log forwarding pages are checked. A second reader's re-check of the rest (workflow `wf_a57e111c-14f`) was stopped twice by container restarts, so each remaining route is checked against its page when a step that uses it is built. Only checked routes go into the tool.

## Decisions for Adam

1. The concept: off by default, the Add outside system button on every play, generic boxes, documented routes only. **Approved Nov 2 ("I like it").**
2. The first step: the four outside systems in the table above, plus the CDN box on every Brand Visibility play (the same route), with their services. **Approved Nov 3 ("yes"), with line icons for each system.**

## Built as step 27 (November 3)

Patches, run once in this order on the step 26 files: `python3 sow/patch_step27.py sow/index.html` (the SOW steps), `python3 sow/canvas/outside_step27.py` (the boxes, connections and places in `catalog_map.json` and `research/connection_types.json`), `python3 sow/canvas/patch_step27.py sow/canvas/template.html` (the canvas), then `python3 sow/canvas/build.py` and `python3 sow/build_site.py`.

**On the canvas**

- **Add outside system** sits in the toolbar of the five Brand Visibility plays (CJA, Commerce, AEM, FSI and Brand Visibility on its own). Coworker and Create your own play don't have it. Its menu lists only the systems that connect to the play's products, each with its icon, the product it connects to and the systems Adobe documents for that route. None is on when a play starts, so every play's starting total is unchanged.
- **The boxes:** dashed, with a dark top bar, a solid OUTSIDE ADOBE tag and a line icon drawn for this (stroke only, in the box's text color): a globe for the CDN, a database cylinder for the data warehouse, a cloud for cloud storage and a contact card for the CRM. The CDN sits under Brand Visibility (left of it in the AEM play, where under Edge Delivery Services its line crossed Sites Optimizer's); the warehouse sits under CJA, and cloud storage and the CRM to its right. A box's card says what it is, the systems Adobe documents and what it connects to, with Remove from canvas.
- **The lines:** the CDN line draws solid (native log forwarding), the three CJA lines dotted (through Experience Platform). Each i is labelled Outside system, with how it connects, the license on the Availability line (none is named for the CDN), what the customer does first under Before it works, what you get, the services and the Experience League page.

**The services** (five, each sourced; hours low, typical, high)

| Line | Connection | Unit | Hours | Starts | Source |
|---|---|---|---|---|---|
| OX1 CDN log forwarding, set up by the partner | CDN + Brand Visibility | One-time | 8, 16, 32 | Off: Brand Visibility setup (L02) already gets it done with the customer's IT team | [Log forwarding overview](https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview) |
| OX2 Log export from another CDN or log store | CDN + Brand Visibility | One-time | 24, 40, 72 | Off | [Other providers](https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/other) |
| OX3 Warehouse tables into CJA | Data warehouse + CJA | One-time | 32, 56, 96 | On when the box is added | [CJA and Data Mirror](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-mirror/relational), [CJA product description](https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html) |
| OX4 Cloud storage files into CJA | Cloud storage + CJA | One-time | 24, 40, 72 | On when the box is added | [CJA ingestion through sources](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/sources) |
| OX5 CRM data into CJA | CRM + CJA | One-time | 24, 40, 72 | On when the box is added | [Sources overview](https://experienceleague.adobe.com/en/docs/experience-platform/sources/home), [CJA ingestion through sources](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/sources) |

At $150 an hour, Typical, the CJA play stays $219,600; the data warehouse adds $8,400, cloud storage $6,000, the CRM $6,000 and the CDN nothing until the partner turns on one of its services.

**Counted once.** While CJA data preparation in Experience Platform (CJ01) is on, it covers OX3, OX4 and OX5: they show as covered ("Covered by CJA data preparation in Experience Platform, which is on. Check to keep it for work that service does not cover.") and add nothing. A partner can keep one on purpose; on the Statement of work step a kept one must then say in its scope how it differs, or go, before the SOW can be issued, the same review the generic Coworker Skills get beside specialized ones. Connections, data views and stitching (CJ02) is named in OX4 and OX5's assumptions (it covers adding their datasets to the connection) but doesn't switch them off.

**On the SOW steps.** A service on an outside system counts, and shows under Add service, only while that system is on the canvas. The engagement keeps the systems for each play through the hand-over, saved drafts and the canvas restore (a draft without them, as drafts were saved before, opens with none; a hand-edited draft keeps only the systems the play offers). Change play and Start over clear them. Dependencies and risks give the customer's part for each system on the canvas, and say the partner sets up CDN log forwarding (with the CDN team's access and change approval) when OX1 or OX2 is on.

**Not built from the proposal:** the monthly data pipeline monitoring line (2, 4 or 8 hours a month). The first step adds one-time setup only; it can come next if Adam wants it.

**Found and fixed while testing, before handing over:** the menu ran past the right edge between 768 and 900 pixels wide (it now shifts left like the Add product menu); the AEM play's CDN line crossed Sites Optimizer's (the CDN moved left of Brand Visibility); after a trip to Services and back, adding a system left its services off (back on Build, a service whose system isn't on the canvas now keeps no choice there); and the CDN line in Dependencies and risks appeared only beside L02 or C01 (it now also appears for OX1 or OX2 alone).

**Checks:** `node sow/test_review_nov2.js` has 29 step 27 checks (S27), among them the totals, counted once, the round trip, drafts, the library, Change play and Start over, layout with no box on another, no i on a box and no crossing lines at 1600, 1024, 768 and 390 pixels, the menu on screen from 1600 to 320 pixels, and phone taps. They fail on the step 26 build, and the layout, menu, round-trip and overlap checks fail on the first step 27 build. `test_canvas.js` and `check.py` count the outside systems' products, connections and sources.
