# Outside systems on the Build canvas (proposal, November 2 2026)

Adam (Nov 2): "what are your thoughts about partners being able to add data ingestions and from data lakes, data warehouse, however the heck external data comes into the adobe products from the outside. maybe we don't add it to the plays out of the box. but it allows partners to add other pieces to the architecture that are not just adobe products."

Status: proposed with a mockup, not built. Mockup: `sow/mockups/nov2_exports/outside_systems_mockup.png` (made from a scratch copy of the real canvas by `sow/mockups/nov2_exports/outside/mock_outside.js` and `board_outside.js`, with the wording in `content.json`).

## Recommendation

Yes. Getting the customer's own data into the Adobe products is in almost every real SOW, it is often the longest item (CDN log forwarding already is, for every Brand Visibility play), and it is work partners are good at. Showing it on the canvas makes the architecture honest and puts that work, and what the customer's IT owns, into the SOW.

## How it would work

- **Off by default** in every play. Nothing changes until a partner adds an outside system.
- **Add outside system**, a button on every play (not only Create your own play). Its menu lists only the outside systems that connect to the play's products, each with the systems Adobe names for that route.
- **Generic boxes, not brands:** CDN, Data warehouse, Cloud storage, CRM. Drawn as dashed boxes with a dark top bar and an OUTSIDE ADOBE tag, so nobody mistakes them for Adobe products.
- **Only routes Adobe documents.** Each connection has its card: an Outside system label, how it connects, license needs (on the Availability line), the customer's own tasks under Before it works, and the Experience League link.
- **Services with planning hours** (low, typical, high) on each connection, flowing to the Services step and the SOW like any other connection line. The customer's own tasks go to the SOW's Dependencies and risks.
- **No software prices** (Adam's rule) and **no double counting:** Brand Visibility setup (L02) already has the partner confirm CDN log forwarding with the customer's IT team, so the CDN box's partner lines start off and come on only when the partner does the CDN-side work itself.

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

## The wider research (being checked)

Researchers read Adobe's documentation for every product on the canvas and found 230 routes from outside systems (`sow/canvas/research/outside_systems.json`, with the page and an exact quote for each). Among them: bring-your-own CDN for Edge Delivery Services and a customer-managed CDN in front of AEM Sites; Experience Platform sources and Federated Audience Composition (querying Snowflake, BigQuery, Databricks, Redshift, Synapse, Microsoft Fabric, Oracle, Teradata and Vertica in place) for Real-Time CDP and Journey Optimizer; bulk import into AEM Assets from Azure, Amazon S3, Google Cloud, Dropbox and OneDrive; Marketo Engage's native Salesforce and Microsoft Dynamics sync; Target customer attributes and recommendations feeds; the Commerce integration starter kit for ERP, OMS and CRM; Brand Concierge knowledge sources; Coworker for teams connectors. A second reader is re-checking every route against its page (workflow `wf_a57e111c-14f`). The CJA routes above and the Brand Visibility log forwarding pages are already checked. Only checked routes go into the tool.

## Decisions for Adam

1. The concept: off by default, the Add outside system button on every play, generic boxes, documented routes only.
2. The first step: the four outside systems in the table above, plus the CDN box on every Brand Visibility play (the same route), with their services.
