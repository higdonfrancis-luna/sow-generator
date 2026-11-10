# Real-Time CDP Collaboration, Marketing Campaign Analytics and GenStudio for Performance Marketing: recheck trail

Checked Nov 10 2026. Data file: `portal_acquisition_insights.json` in this folder, a full replacement for `sow/canvas/research/portal_acquisition_insights.json` (Oct 30), which was not edited. Brief: `BRIEF_RECHECK.md`. Source rules: `../BRIEF.md`. Format and level of care: `aem_forms.md` and `../../aem_forms.json`.

Research only. Nothing else in the repo was changed, no build script was run, nothing was committed. Hours are our own estimates for a mid-market client; Adobe publishes none.

## First, a question for Adam: is Real-Time CDP Collaboration under a label your rule excludes?

Adobe's words, checked on the pages today:

- The guide puts a badge reading **Limited Availability** beside the product name on 46 of its 52 pages. The badge links to the product description on helpx.adobe.com, which says nothing about availability.
- 33 of the 52 pages open with this banner: "Adobe Real-Time Customer Data Platform (CDP) Collaboration is currently available in the United States, Canada, Australia, New Zealand, and across Europe, the Middle East, and Africa, with global availability coming soon." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/home)
- The same guide's release notes say, for February 2025, that Collaboration "is now generally available in the United States." and then add regions: "Real-Time CDP Collaboration is now available to customers in Australia and New Zealand" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest), "Real-Time CDP Collaboration is now available to customers in Canada" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest), "Real-Time CDP Collaboration is now available to customers in Europe, the Middle East, and Africa" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest). For March 2026: "Measurement reporting is now generally available in Collaboration." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest)
- The oldest entry on that page was never updated and still says: "Adobe Real-Time CDP Collaboration is currently available to US customers only." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest)

How we read it: the badge and the banner are about regions, not about an early program. In the regions listed, Adobe calls the product generally available. But the words on the page are "Limited Availability" and "coming soon", which are two of the phrases in the rule.

What the file does until Adam decides: all six product lines and the Real-Time CDP connection are written up, no card or SOW wording carries either phrase, and the regions are a prerequisite ("Your client's organization in one of the regions Adobe lists"). If the answer is "leave it out", the whole product, `rtcdp-collab` and its nine lines come out and nothing else in the file depends on them.

## Summary

| Product | id | Lines | Default | Optional |
|---|---|---|---|---|
| Real-Time CDP Collaboration | `collab` | 6 | CO01, CO02, CO04, CO05, CO06 | CO03 |
| Marketing Campaign Analytics | `mmm` | 6 | MM01, MM02, MM03, MM04, MM05, MM06 | none |
| GenStudio for Performance Marketing | `gspm` | 6 | GS01, GS02, GS03, GS04, GS05, GS06 | none |

| Line | Service | Unit | Low / base / high | Default | Also needs | Needs |
|---|---|---|---|---|---|---|
| CO01 | Collaboration access and roles setup | one-time | 16 / 24 / 40 | yes |  |  |
| CO02 | Account, branding and match key setup | one-time | 24 / 40 / 64 | yes |  |  |
| CO03 | Audience sourcing from cloud data sources | one-time | 24 / 48 / 96 | optional | a cloud data source such as Amazon S3, Google Cloud Storage or Snowflake |  |
| CO04 | Collaborator connections and first projects | one-time | 24 / 40 / 72 | yes |  |  |
| CO05 | Overlap and measurement reporting enablement | one-time | 16 / 32 / 56 | yes |  |  |
| CO06 | Monthly collaboration operations | monthly | 12 / 20 / 32 | yes |  |  |
| MM01 | Access, roles and sandbox setup | one-time | 16 / 24 / 40 | yes |  |  |
| MM02 | Marketing data ingestion and schemas | one-time | 60 / 120 / 240 | yes |  |  |
| MM03 | Harmonized data, touchpoints and conversions | one-time | 40 / 80 / 140 | yes |  |  |
| MM04 | Model build, training and validation | one-time | 40 / 80 / 140 | yes |  |  |
| MM05 | Budget plans and team enablement | one-time | 24 / 40 / 72 | yes |  |  |
| MM06 | Monthly data refresh, rescoring and plans | monthly | 16 / 24 / 40 | yes |  |  |
| GS01 | Provisioning, roles and Brands permissions | one-time | 16 / 24 / 40 | yes |  |  |
| GS02 | Brand, product and persona guidelines | one-time | 32 / 56 / 96 | yes |  |  |
| GS03 | Channel templates and approved assets | one-time | 40 / 80 / 160 | yes |  |  |
| GS04 | Paid media connections and activation setup | one-time | 24 / 32 / 56 | yes |  |  |
| GS05 | Editor training and first campaign launch | one-time | 16 / 32 / 56 | yes |  |  |
| GS06 | Monthly content refresh from Insights | monthly | 12 / 20 / 32 | yes |  |  |

| Connection | Kind | Availability in Adobe's terms | Lines (low / base / high) |
|---|---|---|---|
| Real-Time CDP + Real-Time CDP Collaboration (`rtcdp-collab`) | native | Adobe's release notes say Collaboration is automatically available to Real-Time CDP Prime and Ultimate customers in the regions where it is offered: the United States, Canada, Australia, New Zealand, and Europe, the Middle East and Africa. Confirm your client's region and license with Adobe. | XD01 Experience Platform audience sourcing (24 / 40 / 72); XD02 Experience Platform destination setup (16 / 32 / 56); XD03 Conversion data for Collaboration measurement (24 / 40 / 72, optional) |
| Real-Time CDP + Marketing Campaign Analytics (`rtcdp-mmm`) | platform | Not stated by Adobe. The use cases page names the step and gives no setup: no Adobe page describes moving a segment from Marketing Campaign Analytics to Real-Time CDP. | XD04 Lookalike audiences from top consumer segments (24 / 40 / 72); XD05 Real-Time CDP conversion data for campaign models (16 / 24 / 48, optional) |
| Real-Time CDP + Content Analytics (`rtcdp-ca`) | platform | Not stated by Adobe for Content Analytics by name. Adobe documents audience publishing from Customer Journey Analytics, where Content Analytics reports, to Real-Time Customer Profile, and the Content Analytics license includes audience publishing. | XD06 Content engagement audiences for activation (16 / 32 / 56, optional) |
| Marketing Campaign Analytics + Customer Journey Analytics (`mmm-cja`) | platform | Not stated by Adobe for the route these lines use: scoring saves the scores as Experience Platform datasets, and a Customer Journey Analytics connection can add any such dataset. | XD07 Touchpoint scores in CJA connections (24 / 40 / 72); XD08 Incrementality dashboards in Workspace (24 / 40 / 64); XD09 CJA event data reuse in campaign models (16 / 32 / 56, optional) |
| Marketing Campaign Analytics + Content Analytics (`mmm-ca`) | platform | Not stated by Adobe for the two together. Adobe's Meta Ads source page describes one governed source of Meta data for several applications. | XD10 Shared paid media data for campaign models and Content Analytics (16 / 32 / 64); XD11 Monthly channel and creative review (8 / 12 / 20, optional, monthly) |
| Customer Journey Analytics + Content Analytics (`cja-ca`) | native | Not stated by Adobe; Content Analytics is licensed as a standalone product and configured inside Experience Platform and Customer Journey Analytics. | XD12 Content Analytics in existing data views (16 / 24 / 48); XD13 Content journey and conversion analysis (24 / 40 / 72) |
| Content Analytics + GenStudio for Performance Marketing (`ca-gspm`) | platform | Not stated by Adobe. The Meta Ads source page says the source feeds GenStudio and Content Analytics; neither product's own guide names the other. | XD14 Tracking keys on GenStudio-activated ads (16 / 24 / 48); XD15 Monthly attribute insights to new variants (8 / 16 / 24, monthly) |
| Workfront + GenStudio for Performance Marketing (`workfront-gspm`) | native | Not stated by Adobe; the Workfront guide files it under its native integrations, and a Workfront administrator switches it on in Setup. | XG01 Workfront Proof approvals for GenStudio content (16 / 24 / 48); XG02 Proof approval templates for content reviews (16 / 32 / 56) |
| AEM Assets + GenStudio for Performance Marketing (`aemassets-gspm`) | native | Not stated by Adobe; the page gives the setup steps and says the repository must be in the same organization as GenStudio. | XG03 AEM Assets Content Hub connection for GenStudio (16 / 24 / 48); XG04 Approved assets and filters for creators (16 / 32 / 64) |
| Journey Optimizer + GenStudio for Performance Marketing (`ajo-gspm`) | extension | Not stated by Adobe; the app is listed as Free on Adobe Exchange and your client's organization approves the request. | XG05 Journey Optimizer templates in GenStudio (16 / 32 / 56) |
| Marketo Engage + GenStudio for Performance Marketing (`marketo-gspm`) | extension | Not stated by Adobe; the app is listed as Free on Adobe Exchange and your client's organization approves the request. | XG06 Marketo Engage templates in GenStudio (16 / 24 / 48) |
| Real-Time CDP + GenStudio for Performance Marketing (`rtcdp-gspm`) | native | Adobe's page says the Audiences feature needs onboarding by the Adobe team before it appears in GenStudio. | XG07 Real-Time CDP audiences in GenStudio content creation (16 / 24 / 40) |
| Coworker + GenStudio for Performance Marketing (`cw-gspm`) | native | Adobe's page says the AI assistant capabilities are generally available to customers enabled for GenStudio for Performance Marketing, and that your client's organization controls whether the Coworker connection is on. | XG08 Coworker prompts for GenStudio reporting and drafts (16 / 24 / 40) |

Totals: 18 product lines across 3 products, and 23 connection lines across 13 connections (7 kept from Oct 30 with 15 lines, 6 new with 8 lines). Two Oct 30 connections with no services were taken out. Every connection also has a `kind`, a draft `label`, `prereqs` with a quote for each, and a `client` entry in the client's voice.

## What changed since Oct 30

| What | Change | Why |
|---|---|---|
| Mix Modeler (`mmm`), the product | Renamed Marketing Campaign Analytics in every name and scope; id unchanged | Adobe renamed it. The guide moved to /en/docs/marketing-campaign-analytics/ and every old address redirects. |
| MM01 to MM06, XD04, XD05, XD07, XD08, XD09 | Source addresses changed | The old /mix-modeler/ addresses redirect; the file now cites the current ones. |
| MM04 Model build, training and validation | Scope: "or full funnel modeling" removed. Hours unchanged | Adobe's pages disagree: the release notes list it as generally available, the Models overview page still carries the limited testing note. Left out until they agree. |
| MM06 Monthly data refresh, rescoring and plans | Evidence replaced | Adobe reworded the sentence. Was "data may be added to the model which requires you to rescore the model manually."; now "Also, when data is added to the model, a manual rescore of the model is required." |
| CO03 Audience sourcing from cloud data sources | Scope names Azure storage and Databricks Delta Share as well; `ext` added. Hours unchanged | Adobe added self-service sources since the quick start was written. The service needs a cloud source that is not an Adobe product. |
| GS03 Channel templates and approved assets | Scope: LinkedIn removed (now email, Meta and display). Hours unchanged | Both pages for creating a LinkedIn experience carry Adobe's Beta badge. |
| XD03 Conversion data for Collaboration measurement | Evidence replaced | The Oct 30 sentence is still on the page but Adobe's text now has a non-breaking hyphen in "Real-Time", so it no longer matches word for word. Replaced with the sentence that opens the same section. |
| XD04 | Renamed "Lookalike audiences from top consumer segments"; `tier` Real-Time CDP Prime or Ultimate added | Current product name; look-alike audiences are a Real-Time CDP entitlement. |
| XD05, XD09 | Renamed (no "MMM" or "Mix Modeler"); scopes use the current name | Current product name. |
| XD07, XD08 | Scopes use the current name | Current product name. |
| XD06 Content engagement audiences for activation | Evidence and source replaced; `needs: cja` removed | The Oct 30 source was Adobe's Content Analytics product page on business.adobe.com, which cannot be read today. Now cites the Customer Journey Analytics audience publishing page. The Content Analytics product description lists audience publishing (25 refreshing audiences) among its own limits, so a separate Customer Journey Analytics license is not what the line needs. |
| XD10 | Renamed "Shared paid media data for campaign models and Content Analytics"; scope uses the current name; evidence and source replaced | The Oct 30 source was a business.adobe.com page. Now cites the Experience League Meta Ads source page. |
| XD11 Monthly channel and creative review | Scope uses the current name; evidence and source replaced | The Oct 30 source was a business.adobe.com page. Now cites the Model insights page. |
| XD15 Monthly attribute insights to new variants | Evidence and source replaced | The Oct 30 source was a business.adobe.com page. Now cites the Meta Ads source page, which names GenStudio and Content Analytics together. |
| `collab-mmm`, `collab-cja` | Dropped from the connections; listed under `left_out` | Adobe still documents no export on Experience League. The only source was a product-page bullet whose footnote read Coming soon, on a page that cannot be read today. |
| `rtcdp-ca`, `mmm-ca` | Connection source moved to Experience League; `how` reworded to say what Adobe documents; `source_note` added | Their Oct 30 sources were business.adobe.com pages. No Experience League page names the two products of either pair together, and `mmm-ca` now says plainly that no data passes between the two applications. |
| `ca-gspm` | One flow source replaced; `source_note` added | Same reason. The Meta Ads source page backs the connection by name. |
| All 7 kept connections | `kind`, `label`, `availability`, `prereqs`, `prereq_sources` and `client` added | Step 4 and step 7 of the brief. |
| All 3 products | `title`, `status`, `notes`, `prereqs`, `prereq_sources`, `tiers` added | Step 5 of the brief. |
| `workfront-gspm` (XG01, XG02) | Added | Workfront Proof takes over GenStudio review and approval. Set aside on Oct 30 because Workfront was not on that canvas. |
| `aemassets-gspm` (XG03, XG04) | Added | Approved assets from an AEM Assets Content Hub repository appear in GenStudio Content. Set aside on Oct 30 for the same reason. |
| `ajo-gspm` (XG05) | Added | An Adobe Exchange app brings Journey Optimizer email templates into GenStudio. Documented with setup steps; not one of the pairs the brief named. |
| `marketo-gspm` (XG06) | Added | An Adobe Exchange app brings Marketo Engage email templates into GenStudio. Documented with setup steps; not one of the pairs the brief named. |
| `rtcdp-gspm` (XG07) | Added | Real-Time CDP audiences as a choice in GenStudio's Create, after Adobe's team onboards the feature. Not one of the pairs the brief named. |
| `cw-gspm` (XG08) | Added | GenStudio's tools are a native connection in Coworker. Not one of the pairs the brief named. |
| `not_documented` | `collab-ca` kept; six entries added | Step 6 of the brief: every other product in the tool was looked for. |
| `left_out` | New list, 12 entries | Step 3 of the brief. |
| Unchanged | CO01, CO02, CO04, CO05, CO06, GS01, GS02, GS04, GS05, GS06, XD01, XD02, XD12, XD13, XD14 | Each quote was found again on its page and nothing in Adobe's text calls for a change. |
| Hours | None changed | No scope changed enough to move an estimate. |

## How this was researched

1. Downloaded the tables of contents of the three guides and every page in them with plain `curl -sS -L -m 45`, default headers: Real-Time CDP Collaboration (52 pages), Marketing Campaign Analytics (35), the GenStudio for Performance Marketing user guide (96) and extensibility guide (10). All 193 returned 200.
2. Checked every Oct 30 quote against the page it cites, the way `../verify_quotes.py` does (script and style blocks dropped, tags replaced by a space, entities unescaped, curly quotes straightened, whitespace collapsed, lower-cased, exact substring). Of 36 quotes (3 product descriptions, 18 product lines, 15 connection lines): 30 found unchanged, 2 no longer found (MM06, XD03), 4 on business.adobe.com and so not read (XD06, XD10, XD11, XD15).
3. Searched the three guides by script for lifecycle wording (beta, early access, limited availability, limited testing, coming soon, pre-release, private preview) and for the name of every product in the tool.
4. To look from the other side, downloaded the whole Customer Journey Analytics guide (454 pages) and the whole Coworker guide (70 pages) and searched them for the three products. Read the Workfront page for the proof integration, the AEM Assets Content Hub deploy, overview and approval pages, the Experience Platform Meta Ads, Google Ads and look-alike audience pages, Adobe's page on how Experience Platform and its applications work together, and five product descriptions on helpx.adobe.com (Real-Time CDP Collaboration, Mix Modeler, GenStudio for Performance Marketing, Customer Journey Analytics, Adobe Content Analytics).
5. Three web searches limited to experienceleague.adobe.com and helpx.adobe.com, for a product description under the new name, for Marketing Campaign Analytics with Journey Optimizer, and for Collaboration with Customer Journey Analytics or Marketing Campaign Analytics. None turned up a page the crawl had missed.
6. Wrote the file, then checked every quote in it by script.

Quote check: 191 quotes in the JSON (3 product descriptions, 41 line evidences, prerequisites, tiers, availability, status, not-documented and left-out entries): 191 found on their pages, 0 not found. Two more entries carry the Oct 30 product-page sentence for `collab-mmm` and `collab-cja`; they are marked `verified: false` because the host cannot be read. This trail prints 39 more quotes that are not in the JSON: 39 found, 0 not found. In all, 230 quotes checked and 230 found. 747 pages were downloaded in all, tables of contents included.

No blocked host was fetched and no block was worked around. Nothing was read through WebFetch.

## Products: what each needs

### Real-Time CDP Collaboration (`collab`)

Collaboration is a clean room: two parties match audiences on hashed keys, see overlaps, send audiences to each other and measure campaigns, and neither sees the other's records. Every activity uses Collaboration Credits, and the two parties agree in the connection settings how the credits are split. An advertiser account can source 25 audiences and a publisher account 250, and no audience under 1,000 members can be activated. The role (advertiser or publisher) and the region of an account cannot be changed after setup, and match keys cannot be added to a connection once it is established, so CO02 starts with the match key strategy. Measurement (CO05, XD03) only shows in a project when the Measurement use case was chosen in the connection settings, and attribution reports need the advertiser's conversion data, which today can come from Experience Platform only. One use case, Expansion Models, is left out of these lines: see left_out. Hours are our own estimates for a mid-market client; Adobe publishes none.

Prerequisites, each with Adobe's sentence:

- An active Real-Time CDP Collaboration license, or a Real-Time CDP Prime or Ultimate license in a region where Adobe offers Collaboration. "An active Real-Time CDP Collaboration license." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide)
- Your client's organization in one of the regions Adobe lists: the United States, Canada, Australia, New Zealand, or Europe, the Middle East and Africa. "Adobe Real-Time Customer Data Platform (CDP) Collaboration is currently available in the United States, Canada, Australia, New Zealand, and across Europe, the Middle East, and Africa" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/home)
- Collaboration Credits on the order: every sourcing, activation and measurement activity uses them. "Customer may use a total of up to the total number of Collaboration Credits licensed in the applicable Sales Order for any combination of Collaboration Activities" (https://helpx.adobe.com/legal/product-descriptions/real-time-customer-data-platform-collaboration.html)
- System or product administrator access to Experience Platform, to set up roles and users. "System or product administrator access to Adobe Experience Platform" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide)
- A match key strategy agreed before account setup: keys cannot be added to a connection after it is established. "While you can remove unwanted match keys during the connection setup, match keys cannot be added after a connection has been established." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-account)
- Brand name, description, logo (SVG) and a team contact email for the account. "Access to branding assets, such as your organization" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide)
- At least one collaborator (a publisher, another brand or an advertising platform) willing to connect. "This connection process involves sending or receiving invitations, reviewing and submitting connection settings (such as use cases and credit consumption), and confirming the connection." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide)
- No more than 25 sourced audiences for an advertiser account or 250 for a publisher account, and at least 1,000 members in any audience that is activated. "Customer may not activate a Collaboration Audience with less than 1,000 audience members." (https://helpx.adobe.com/legal/product-descriptions/real-time-customer-data-platform-collaboration.html)

Tiers and add-ons:

- **Real-Time CDP Collaboration: Base**: The license itself, sold as one unit. It allows up to five Collaboration accounts, used to separate business units, brands or geographies. "Customer is entitled to up to five Collaboration Accounts" (https://helpx.adobe.com/legal/product-descriptions/real-time-customer-data-platform-collaboration.html)
- **Real-Time CDP Collaboration: Credits**: The add-on that pays for activity. The product description's table sets the rate for each activity per million records: 2 for audience management, 0 for audience insights, 500 for an on-demand activation, 100 for a recurring one and 50 for measurement. "Collaboration Credits means the metric licensed by Customer in the Sales Order and used to initiate and execute Real-Time CDP Collaboration Activities." (https://helpx.adobe.com/legal/product-descriptions/real-time-customer-data-platform-collaboration.html)
- **Real-Time CDP Prime or Ultimate**: Adobe's release notes say Collaboration is automatically available to Real-Time CDP Prime and Ultimate customers in each region it has launched in. The quick start still lists an active Collaboration license as a prerequisite, so confirm on the order. "It is automatically available to Real-Time CDP Prime and Ultimate customers in these regions." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest)
- **Collaboration Starter**: A no-cost way in for a party without a license: a licensed partner in the same region invites it and pays the credits. A Starter account sources from Amazon S3 only, holds 10 audiences and 50 million identities, refreshes each audience once every 6 days and cannot set up destinations to outside platforms. "You must be invited by a partner who holds a Real-Time CDP Prime, Ultimate, or Collaboration license." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/starter-overview)

### Marketing Campaign Analytics (`mmm`)

Marketing Campaign Analytics joins marketing mix modeling, which works on summary data such as weekly spend by channel, with multi-touch attribution, which works on event data, and turns the models into budget plans. Most of the effort is data: every channel's spend, the conversions and the outside factors have to be in Experience Platform datasets with a date, a granularity and a channel before anything can be modeled, which is why MM02 and MM03 carry the most hours. Multi-touch attribution is optional and is switched on per model; the event-level scores that the Customer Journey Analytics and Real-Time CDP lines use exist only for models that have it on. Rescoring a model does not update a plan built on it: a new plan is needed, which MM06 allows for. Two features are left out of these lines (full funnel modeling, and the switch that sends scores to Customer Journey Analytics through a connection and data view Adobe creates): see left_out. Hours are our own estimates for a mid-market client; Adobe publishes none.

Prerequisites, each with Adobe's sentence:

- A Marketing Campaign Analytics license, sized by the number of conversions a year your client wants to measure (the product description still calls it Mix Modeler). "Customer may generate up to the number of Conversions authorized in the Sales Order." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)
- An Experience Platform sandbox for it; the license includes up to 5 sandboxes and 10 active models. "Mix Modeler includes up to 5 Sandboxes." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)
- Spend and marketing effort data for every channel in scope, with a date, a granularity and a channel on every row. "Channel is a mandatory field in the underlying schema for all marketing effort / spend data ingested as datasets." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview)
- Conversion data (orders, revenue, leads) for the same period, and any internal or external factors your client wants in the model. "One or more marketing touchpoints (channels) comprised of summary-level data, marketing touchpoint data (event data) or both." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/overview)
- Enough history: a model is trained on at least one year of data, and Adobe's default is the last two years. "You have to select a data range with a minimum of one year." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/train-score)
- A Permissions role with the Marketing Campaign Analytics resource, a sandbox and dataset and schema permissions. "Add the Adobe Marketing Campaign Analytics resource to the list of resources for the role." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/administration)
- For data from Amazon Redshift, Google BigQuery, Snowflake and similar sources: the Advanced Enterprise Source Connectors add-on. "Customer may not import data from Advanced Enterprise Source Connectors unless licensed separately." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)
- No more than 30 marketing touchpoints for one conversion in a model. "Customer may configure Mix Modeler Model to analyze the impact of up to 30 independent Marketing Touchpoints on a specified Conversion." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)

Tiers and add-ons:

- **Mix Modeler (the license, under the product's former name)**: Licensed per 1,000,000 conversions a year. Includes 10 active models, 5 sandboxes, 5 terabytes of data lake storage and limited Query Service and data export. "It includes 10 Active Models. More models may be acquired by adding Mix Modeler Model Capacity Pack(s)." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)
- **Mix Modeler Model Capacity pack**: An add-on: each pack adds 10 active models. "Each Pack includes 10 active models." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)
- **Advanced Enterprise Source Connectors**: An add-on needed to bring in data from Amazon Redshift, Apache Kafka, Azure Event Hubs, AWS Kinesis, Azure Synapse Analytics, Google BigQuery, Google Pub/Sub and Snowflake. "Advanced Enterprise Source Connectors means Amazon Redshift, Apache Kafka, Azure EventHub, AWS Kinesis, Azure Synapse Analytics, Google BigQuery, Google PubSub, and Snowflake." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)
- **Profile, Identity and Segmentation services (not included)**: A client that licenses the product on its own may not use Experience Platform's profile, identity or segmentation services. Audiences and lookalikes (XD04) therefore need Real-Time CDP. "Customer is not licensed to, and must not access or use the Profile Service, Identity Service or Segmentation Service components in Adobe Experience Platform unless licensed separately by Customer." (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html)

### GenStudio for Performance Marketing (`gspm`)

GenStudio generates ad and email variants from templates, brand guidelines and approved assets, routes them through review, sends approved ads to the ad platforms switched off for a last check there, and reports how each creative performs. Nothing can be generated until the brand guidelines are in, and nothing can be activated or measured until an ad account is connected, so GS02 and GS04 come before any campaign. Activation needs the campaign and the ad set to exist in the ad platform already: GenStudio does not create them. The first connection brings in six months of history, which can take one to five days, and channel data is kept for 13 months. The base license is 10 power users, 20 collaborators, 5 brands and 60,000 generative actions a year. GS03 covers email, Meta and display templates only; creating LinkedIn experiences is left out: see left_out. Insights runs on Experience Platform and Customer Journey Analytics components that Adobe creates and manages for GenStudio: they are not your client's own Customer Journey Analytics, and resetting the production sandbox removes them. Hours are our own estimates for a mid-market client; Adobe publishes none.

Prerequisites, each with Adobe's sentence:

- A GenStudio for Performance Marketing license; the base includes 10 power users, 20 collaborator users, 5 brands, 2 terabytes of storage and 60,000 generative actions a year. "Customer may use up to 10 Power Users and 20 Collaborator Users." (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)
- An Adobe system administrator to assign licenses in the Admin Console; the default product profiles must not be changed. "Altering the default product profiles can seriously disrupt your GenStudio for Performance Marketing deployment." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/product-provisioning)
- Brand, product and persona guidelines ready to upload or enter: editors cannot start until the brand is set up. "Content editors and collaborators cannot begin their work until the foundational elements of your organization's brand identity are established." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/get-started)
- A user group and an Admin Console project for Brands permissions, set up by the system administrator. "System administrators must complete additional set-up tasks before collaborators can edit or create Brands." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/get-started)
- For each ad platform: an ad account with full permission to manage campaigns and ads, connected by a system manager or editor. "A GenStudio system manager or editor must connect the ad account for each paid ad channel before you can activate an ad experience to that channel." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/overview)
- Campaigns and ad sets already created in the ad platform: GenStudio does not create them. "The target Meta campaign and ad set must already exist in Meta Ads Manager." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-meta-ad)
- One to five days for the first import of six months of history from a newly connected ad account. "The full data ingestion process may take one to five days depending on the volume of data in your account." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/settings/connect-channel)

Tiers and add-ons:

- **GenStudio for Performance Marketing: Base**: 10 power users, 20 collaborator users, 5 brands, 2 terabytes of storage, 60,000 generative actions a year and 25 million rows of Insights data a year. "Customer may use up to 60,000 Generative Actions per year." (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)
- **Add-on packs**: More power users (packs of 5, each with 30,000 more generative actions a year), collaborator users (packs of 5), brands, generative actions (packs of 10,000), Insights rows (packs of 1,000,000) and storage (per terabyte). "Each Pack of 5 Power Users includes up to 30,000 additional Generative Actions per year." (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)
- **Adobe Developer App Builder**: One pack comes with licenses started or renewed on or after April 7, 2025. The Journey Optimizer and Marketo template apps are managed under App Builder applications in Adobe Exchange, so check this on older contracts. "Customers renewing or starting a new license to GenStudio for Performance Marketing on or after April 7, 2025 will also receive one Pack of Adobe Developer App Builder for their applicable License Term" (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)
- **Adobe Express (included)**: Power users can use Adobe Express inside GenStudio and the Express application; collaborator users can use the Express application. "via its Power Users and Collaborator Users, may access and use certain features and functionalities of the Adobe Express application directly." (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)

## Connections: what each needs

### Real-Time CDP + Real-Time CDP Collaboration (`rtcdp-collab`), native

Label: Collaboration sources audiences and conversion data from a Real-Time CDP sandbox and sends collaborator audiences back to Audience Portal.

How: Collaboration links a Real-Time CDP sandbox as a data connection to source its audiences and conversion datasets, and its Experience Platform destination sends collaborator audiences back to Audience Portal.

Availability: Adobe's release notes say Collaboration is automatically available to Real-Time CDP Prime and Ultimate customers in the regions where it is offered: the United States, Canada, Australia, New Zealand, and Europe, the Middle East and Africa. Confirm your client's region and license with Adobe. "It is automatically available to Real-Time CDP Prime and Ultimate customers in these regions." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest)

Prerequisites:

- A Real-Time CDP sandbox that holds the audiences to share, which the Collaboration user can access. "You can only select a sandbox that your user has access to." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- A role with the View Profiles and View Segments permissions for whoever sources the audiences. "the user(s) managing audience onboarding will need to be assigned a role containing the following Profile Management resource permissions" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/permissions/overview)
- Match keys trimmed, lowercased and SHA256-hashed; plain-text identifiers can be hashed during mapping when the source is Experience Platform. "Hashed match keys must be SHA256-hashed" (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide)
- Marketing actions and consent rules chosen when the data connection is created. "You are also required to provide consent for data sourced from Experience Platform to be used for data collaboration." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/onboard-audiences)
- The Experience Platform destination created before a collaborator activates; a destination cannot be edited, only deleted and created again. "You cannot update a destination after it has been created." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- Hashed match keys mapped to identity namespaces that accept hashed values, such as Email (SHA256, lowercased). "Hashed match keys must be mapped to a target namespace that supports hashed values." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- Each match key arrives in Audience Portal as its own audience, and your client applies its own data usage labels to them. "Currently, each match key activates to Experience Platform as a separate audience." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- Arriving audiences expire after 1 to 30 days, as set on the destination. "You can choose to set the expiration anywhere from 1 to 30 days." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- For attribution reports: the Measurement use case chosen in the connection settings, and a conversion event dataset in Experience Platform. "At this time, Adobe Experience Platform is the only supported data source." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-measurement-data)

Lines:

- **XD01 Experience Platform audience sourcing** (one-time, 24 / 40 / 72, default): Create the Experience Platform data connection, pick the sandbox, set marketing actions and consent rules, map identities and profile attributes to match keys with hashing, schedule refreshes and select the audiences. Evidence: "Any settings that you configure for an Experience Platform data connection are applied to all audiences sourced from that connection." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/onboard-audiences)
- **XD02 Experience Platform destination setup** (one-time, 16 / 32 / 56, default): Create the Experience Platform destination before collaborators activate, map match keys to hashed identity namespaces, set linked keys and expiration, verify audiences in Audience Portal and apply data usage labels. Evidence: "You must configure Experience Platform as a destination before your collaborator activates an audience." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- **XD03 Conversion data for Collaboration measurement** (one-time, 24 / 40 / 72, optional): Source the conversion event dataset from Experience Platform, map identities to match keys, enrich events with Real-Time Customer Profile attributes, and set the duplication key and conditions for attribution reports. Evidence: "As an advertiser, you can upload your measurement data containing conversion events to Collaboration for use in campaign measurement reports." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-measurement-data)

For the client: Real-Time CDP Collaboration links to your Real-Time CDP sandbox. It takes the audiences you choose, matched on hashed keys under your consent rules, and brings the audiences a collaborator shares with you back into Audience Portal. Your audiences meet a publisher's or another brand's audiences without either side seeing the other's records. You see the overlap, and the audiences a collaborator sends you arrive in Real-Time CDP for you to activate and measure.

### Real-Time CDP + Marketing Campaign Analytics (`rtcdp-mmm`), platform

Label: A shared Experience Platform data path: the models reuse event data, and the partner reads touchpoint scores to build look-alike audiences. Adobe documents no export of segments.

How: Marketing Campaign Analytics is built on Experience Platform and models event datasets ingested there, and Adobe's use case turns its touchpoint scores into lookalikes of top consumer segments in Real-Time CDP.

Availability: Not stated by Adobe. The use cases page names the step and gives no setup: no Adobe page describes moving a segment from Marketing Campaign Analytics to Real-Time CDP. "Create and activate lookalikes to top consumer segments using Real-Time Customer Data Platform." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/use-cases)

Prerequisites:

- Real-Time CDP Prime or Ultimate on the same Experience Platform sandbox: Prime includes 5 active look-alike audiences in production sandboxes and Ultimate 20. "Real-Time CDP Prime customers are entitled to 5 active Look-alike audiences in production sandboxes" (https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/lookalike-audiences)
- A model with multi-touch attribution turned on: only those models save event-level touchpoint scores. "additional event score data are persisted within a dataset in Experience Platform" (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/scoring-data)
- The top segments rebuilt as audiences in Experience Platform on the default merge policy; audiences made outside it are not eligible. "The base audience must be created within Experience Platform. Externally-generated audiences are not eligible for look-alike insights." (https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/lookalike-audiences)
- Look-alike features switched on for the environment: Adobe turns them off after months without use and Customer Care turns them back on. "Look-alike insights and Look-alike audiences are automatically disabled for environments that show low usage." (https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/lookalike-audiences)
- Identities set up on each event dataset the models use. "Ensure you have set up identities properly for each of the event datasets." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/harmonize-data/overview)

Lines:

- **XD04 Lookalike audiences from top consumer segments** (one-time, 24 / 40 / 72, default, needs Real-Time CDP Prime or Ultimate): Read the touchpoint scores to find the highest-value consumer segments, rebuild them as base audiences in Experience Platform on the default merge policy, then create lookalike audiences and activate them. Evidence: "Create and activate lookalikes to top consumer segments using Real-Time Customer Data Platform." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/use-cases)
- **XD05 Real-Time CDP conversion data for campaign models** (one-time, 16 / 24 / 48, optional): Reuse the conversion and event datasets already ingested for Real-Time CDP, such as CRM, commerce and web data, as Marketing Campaign Analytics event inputs, checking identities on each event dataset. Evidence: "Ensure you have set up identities properly for each of the event datasets." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/harmonize-data/overview)

For the client: Marketing Campaign Analytics and Real-Time CDP both work on your Experience Platform data. The models use event data you already collect, and we read the touchpoint scores to find the customer segments that respond best and build them as audiences in Real-Time CDP. You see which customer segments respond best to marketing and reach more people like them with look-alike audiences in Real-Time CDP.

### Real-Time CDP + Content Analytics (`rtcdp-ca`), platform

Label: Audiences built on Content Analytics data are published from Customer Journey Analytics to Real-Time Customer Profile.

How: Content Analytics adds its content events and attributes to a Customer Journey Analytics data view, and audiences built on that data view are published to Real-Time Customer Profile, where Real-Time CDP activates them.

Availability: Not stated by Adobe for Content Analytics by name. Adobe documents audience publishing from Customer Journey Analytics, where Content Analytics reports, to Real-Time Customer Profile, and the Content Analytics license includes audience publishing. "You can create and publish audiences discovered in Customer Journey Analytics to Real-Time Customer Profile in Adobe Experience Platform for customer targeting and personalization." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/audiences-overview)

Prerequisites:

- Content Analytics configured on a data view with web or mobile content events; its paid media data is summary data, which Adobe says not to combine with event data. "do not combine summary datasets with event data" (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report)
- Audience publishing within the Content Analytics license: 25 refreshing audiences. "Audience Publishing 25 refreshing audiences" (https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html)
- Real-Time CDP on the same sandbox: a Content Analytics license on its own does not include Experience Platform's profile and segmentation services. "Identity Service, Profile Service, Segmentation Service" (https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html)
- The Manage Profiles permission in Experience Platform for the administrator who publishes. "Administrators also need the Manage Profiles permission in Adobe Experience Platform." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/audiences-overview)
- Audience definitions without calculated metrics, which audiences cannot include. "Audiences cannot include calculated metrics." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish)

Lines:

- **XD06 Content engagement audiences for activation** (one-time, 16 / 32 / 56, optional): Build segments on Content Analytics asset and experience attributes in Workspace, publish them as audiences to Real-Time Customer Profile, and set up their activation in Real-Time CDP. Evidence: "You can create and publish audiences discovered in Customer Journey Analytics to Real-Time Customer Profile in Adobe Experience Platform for customer targeting and personalization." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/audiences-overview)

For the client: Content Analytics reports inside Customer Journey Analytics. We build audiences there from the content and creative attributes people engaged with and publish them to your Real-Time Customer Profile, where Real-Time CDP activates them. You group people by the content they responded to and reach them through your Real-Time CDP destinations and campaigns.

Source note: On Oct 30 this connection and XD06 cited Adobe's Content Analytics product page on business.adobe.com ("Create activation-ready audiences from content engagement and immediately share them across other Adobe products."). That host cannot be read from this session, so the sentence was not rechecked and the source is now the Customer Journey Analytics audience publishing page. No Experience League page names Content Analytics with Real-Time CDP.

### Marketing Campaign Analytics + Customer Journey Analytics (`mmm-cja`), platform

Label: Model and touchpoint scores are saved as Experience Platform datasets that a Customer Journey Analytics connection adds; the same event data feeds both.

How: Marketing Campaign Analytics writes model and touchpoint scores to Experience Platform datasets that a Customer Journey Analytics connection can add, and can reuse the Adobe Analytics or Customer Journey Analytics event data a client already has.

Availability: Not stated by Adobe for the route these lines use: scoring saves the scores as Experience Platform datasets, and a Customer Journey Analytics connection can add any such dataset. "As part of scoring a model, scoring data is persisted within a dataset in Experience Platform." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/scoring-data)

Prerequisites:

- Customer Journey Analytics and Marketing Campaign Analytics on the same Experience Platform sandbox. "how Marketing Campaign Analytics can produce output data for its own interface but also for other solutions, like Customer Journey Analytics" (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/get-started/workflow)
- A model that has been trained and scored: the score datasets are written by scoring. "As part of scoring a model, scoring data is persisted within a dataset in Experience Platform." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/scoring-data)
- Multi-touch attribution turned on for the model, for event-level scores by person. "additional event score data are persisted within a dataset in Experience Platform" (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/scoring-data)
- A rescore after the granular reporting fields change, so the scores carry the new dimensions. "Rescoring is required for any existing model to reflect the updated granular dimensions in the score data." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/overview)
- For event data reuse: the web and app events already collected through the Adobe Analytics source connector, the Web or Mobile SDK or the Edge Network API. "Data collected using the Experience Platform Web SDK, Mobile SDK, or Edge Network Server API for collecting customer interactions on web, mobile, or any other type of device." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview)

Lines:

- **XD07 Touchpoint scores in CJA connections** (one-time, 24 / 40 / 72, default): Add the Marketing Campaign Analytics aggregate and event score datasets to a Customer Journey Analytics connection, set the person ID for event scores, and build data view metrics and dimensions for scores, channels and touchpoints. Evidence: "Export incremental touchpoint scores into Customer Journey Analytics or external BI tools." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/use-cases)
- **XD08 Incrementality dashboards in Workspace** (one-time, 24 / 40 / 64, default): Build Workspace projects that break incremental and influenced scores down by segment, campaign and journey, next to Customer Journey Analytics conversion metrics. Evidence: "Perform granular analysis and build advanced dashboards using touchpoint scores." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/use-cases)
- **XD09 CJA event data reuse in campaign models** (one-time, 16 / 32 / 56, optional): Map the web and app event datasets already behind Customer Journey Analytics into Marketing Campaign Analytics dataset rules as touchpoints and conversions, and align conversion definitions so both applications report matching totals. Evidence: "Apply existing investments in Adobe Analytics or Customer Journey Analytics to fast-track deployment." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/use-cases)

For the client: Marketing Campaign Analytics saves its model and touchpoint scores as datasets in Experience Platform. We add those datasets to your Customer Journey Analytics connection, and the models reuse the event data Customer Journey Analytics already holds. You analyze incremental touchpoint scores by segment and journey in Customer Journey Analytics, next to your conversion metrics.

### Marketing Campaign Analytics + Content Analytics (`mmm-ca`), platform

Label: Both read the paid media datasets that one set of Experience Platform sources creates; nothing passes between the two applications.

How: Both read paid media data that Experience Platform paid media sources bring in. Marketing Campaign Analytics models channel and campaign contribution from it, and Content Analytics reads the same ad data down to the creative attribute. No data passes between the two applications.

Availability: Not stated by Adobe for the two together. Adobe's Meta Ads source page describes one governed source of Meta data for several applications. "Use a single, governed source for Meta data across applications such as Adobe Mix Modeler, Customer Journey Analytics, and GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads)

Prerequisites:

- Experience Platform paid media sources (Meta Ads, Google Ads) connected in the sandbox both applications use, by a user with the View Sources and Manage Sources permissions. "You must have both View Sources and Manage Sources permissions enabled for your account in order to connect your Meta Ads account to Experience Platform." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads)
- The Paid media channel enabled in the Content Analytics configuration; it is not available for deployments on AWS. "The paid media channel is not available for Customer Journey Analytics and Experience Platform deployments on AWS." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- For Google Ads: Adobe's page says the source is available as part of the Customer Journey Analytics SKU, so confirm it is on your client's order. "The Google Ads source is available as part of the Customer Journey Analytics SKU." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/google-ads)
- Paid media spend mapped into Marketing Campaign Analytics dataset rules with a date, a granularity and a channel. "Channel is a mandatory field in the underlying schema for all marketing effort / spend data ingested as datasets." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview)
- Tracking keys mapped in Content Analytics before paid media data can be tied to site orders or revenue. "The correlation between your experience event data and paid media data requires customer-specific tracking-key mapping and reporting configuration." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
- Adobe's confirmation of how the paid media datasets reach Marketing Campaign Analytics: the Meta Ads page says via Snowflake, and Snowflake is one of the source connectors the product description licenses separately. "Feeds standardized ad datasets to Adobe Mix Modeler via Snowflake to train media mix models across channels and simulate budget shifts." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads)

Lines:

- **XD10 Shared paid media data for campaign models and Content Analytics** (one-time, 16 / 32 / 64, default): Use one set of Experience Platform paid media sources for both applications by mapping the paid media summary datasets into Marketing Campaign Analytics dataset rules and aligning channel and campaign naming with Content Analytics. Evidence: "Use a single, governed source for Meta data across applications such as Adobe Mix Modeler, Customer Journey Analytics, and GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads)
- **XD11 Monthly channel and creative review** (monthly, 8 / 12 / 20, optional): Each month, read Marketing Campaign Analytics channel and campaign incrementality next to Content Analytics attribute performance, and recommend budget shifts and creative changes for paid media. Evidence: "To focus on the contribution of paid media channels only, select Paid media" (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/insights)

For the client: Marketing Campaign Analytics and Content Analytics both read the paid media data that your Experience Platform sources bring in from the ad platforms. One shows which channels and campaigns earn incremental return, the other which creative attributes perform inside them. You change paid media budget and creative together, working from one set of ad data.

Source note: On Oct 30 this connection, XD10 and XD11 cited two Marketing Campaign Analytics product pages on business.adobe.com. That host cannot be read from this session, so those sentences were not rechecked; the sources are now Experience League pages. No Experience League page names Marketing Campaign Analytics and Content Analytics together.

### Customer Journey Analytics + Content Analytics (`cja-ca`), native

Label: Content Analytics is configured from inside Customer Journey Analytics and adds its content events and attributes to a chosen connection and data views.

How: Content Analytics is configured from CJA's Data Management menu: it adds content events and attributes to a chosen CJA connection and data views, where they join behavioral and conversion data in Workspace.

Availability: Not stated by Adobe; Content Analytics is licensed as a standalone product and configured inside Experience Platform and Customer Journey Analytics. "Content Analytics is licensed as a standalone product, but the configuration happens within Experience Platform and Customer Journey Analytics." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)

Prerequisites:

- A standalone Adobe Content Analytics license: Adobe no longer sells it as an add-on to Customer Journey Analytics. "As of February 2026, Adobe Content Analytics is no longer available to be licensed as an Add-on to Customer Journey Analytics and is ineligible for renewal for any future Sales Order." (https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html)
- A Customer Journey Analytics Product Administrator role with permission to manage connections and data views. "You have a Customer Journey Analytics Product Administrator role, with the additional permissions to manage connections and to manage data views." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- One Content Analytics configuration for each sandbox. "You can only have one Content Analytics configuration per sandbox in your organization." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- Pages that can be reproduced from their URL, without cookies or personalization changing the text. "The text content seen by any given user can be reproduced using the page URL and does not depend on cookies or other personalization mechanisms." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- English content: featurization supports English only. "Content Analytics supports featurization in English only." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- Not for HIPAA workloads: Adobe says Content Analytics is not a HIPAA-Ready service. "Also, Content Analytics is not a HIPAA-Ready service." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)

Lines:

- **XD12 Content Analytics in existing data views** (one-time, 16 / 24 / 48, default): Review what adding Content Analytics changes in your client's existing CJA data views, check person IDs and stitching so content events join existing journeys, and reconcile its components with existing segments and metrics. Evidence: "a Selected data views dialog that informs you about implications of including Content Analytics for the selected data views" (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- **XD13 Content journey and conversion analysis** (one-time, 24 / 40 / 72, default): Extend the Content Analytics Workspace template with flow, fallout and attribution panels that tie assets, experiences and attributes to conversions and journey stages. Evidence: "when combined with all other data available in Experience Platform, you can gain additional insights on your content journeys" (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)

For the client: Content Analytics is set up from inside Customer Journey Analytics. It adds content events and the attributes of your assets and pages to the connection and data views you choose, where they sit beside your behavioral and conversion data. You see which assets, pages and attributes lead to conversions and later journey steps, not only impressions and clicks.

### Content Analytics + GenStudio for Performance Marketing (`ca-gspm`), platform

Label: Ads made and activated in GenStudio are measured in Content Analytics through the Experience Platform Meta Ads source; the two products do not exchange data directly.

How: GenStudio for Performance Marketing creates and activates ads to channels such as Meta, and Content Analytics reads those channels' ad data through Experience Platform paid media sources to tie the creative to outcomes.

Availability: Not stated by Adobe. The Meta Ads source page says the source feeds GenStudio and Content Analytics; neither product's own guide names the other. "Feeds this data to GenStudio / Content Analytics to" (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads)

Prerequisites:

- The Meta ad accounts GenStudio activates into also connected as an Experience Platform Meta Ads source in the Content Analytics sandbox. "For the paid media channel, all the supported ad platforms that are connected in the configured sandbox are automatically included in Content Analytics." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- The Paid media channel enabled in Content Analytics; it is not available for deployments on AWS. "The paid media channel is not available for Customer Journey Analytics and Experience Platform deployments on AWS." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- Meta is the channel both cover: Content Analytics reads Meta and Google Ads data, and GenStudio's LinkedIn and Campaign Manager 360 ads do not reach it. "Paid media data is collected into datasets daily from source connectors (to Google and Meta, for example)." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- A tracking ID and URL parameter convention applied when ads are activated. "Destination URL, URL Parameters, Tracking ID (used as the Meta ad name)" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-meta-ad)
- Tracking keys mapped in Content Analytics before ad data can be tied to site outcomes. "The correlation between your experience event data and paid media data requires customer-specific tracking-key mapping and reporting configuration." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
- GenStudio's own Insights data stays separate: it sits in components Adobe manages for GenStudio and is not your client's Content Analytics data. "GenStudio for Performance Marketing uses Customer Journey Analytics (CJA) to aggregate multiple data sources by creating a connection to one or more AEP datasets." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/data-management)

Lines:

- **XD14 Tracking keys on GenStudio-activated ads** (one-time, 16 / 24 / 48, default): Confirm the ad accounts GenStudio activates into are connected as Experience Platform paid media sources for Content Analytics, then agree a tracking ID and URL parameter convention and apply it at activation. Evidence: "Destination URL, URL Parameters, Tracking ID (used as the Meta ad name)" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-meta-ad)
- **XD15 Monthly attribute insights to new variants** (monthly, 8 / 16 / 24, default): Each month, pull the strongest and weakest creative attributes from Content Analytics, turn them into GenStudio prompts and briefs, generate and approve variants, and retire weak ads. Evidence: "evaluate how different creatives, formats, or messages perform in Meta and correlate Meta performance with content variants created or managed in Adobe Experience Manager or GenStudio" (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads)

For the client: The ads we create and activate in GenStudio run in your Meta ad accounts. Content Analytics reads those accounts' ad data through Experience Platform and ties each creative, down to its attributes, to outcomes. You learn which creative attributes work and put that into the next round of ads.

Source note: On Oct 30 XD15 and one flow cited Adobe's GenStudio product page on business.adobe.com. That host cannot be read from this session, so the sentence was not rechecked; the source is now the Experience League Meta Ads source page, which names GenStudio and Content Analytics together.

### Workfront + GenStudio for Performance Marketing (`workfront-gspm`), native

Label: Workfront Proof runs GenStudio's review and approval with templates, stages and version comparison.

How: Workfront Proof takes over GenStudio's review and approval: Workfront proof templates define the approval stages, reviewers comment and decide in the proofing viewer, and the decisions show in GenStudio for final approval and publishing.

Availability: Not stated by Adobe; the Workfront guide files it under its native integrations, and a Workfront administrator switches it on in Setup. "The integration must be enabled in the Workfront Setup area." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio)

Prerequisites:

- Workfront and GenStudio in the same Adobe organization, with each user in only one Workfront instance in it. "Workfront and GenStudio for Performance Marketing must be deployed to the same Identity Management system (IMS) organization." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio)
- Any Workfront package, with a Standard or Plan license and edit access to projects. "Edit access to Projects" (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio)
- A Workfront system administrator to switch on proof approvals for GenStudio in Setup. "You must be a system administrator to enable this integration." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio)
- Each reviewer added to GenStudio as a user in the Admin Console. "You must have GenStudio for Performance Marketing, and you must be added to the product as a user in the Admin Console." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio)
- A Workfront Proof license for the content creators who start proofs. "Requires a Workfront Proof license." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/proof-integration)
- The Adobe Workfront web viewer browser extension installed by reviewers. "Install the Adobe Workfront Web Viewer extension" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/proof-integration)
- Content in the formats GenStudio supports: proofs are limited to them. "Proofs reviewed in this integration are limited to the formats supported by GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/proof-integration)

Lines:

- **XG01 Workfront Proof approvals for GenStudio content** (one-time, 16 / 24 / 48, default): Switch on proof approvals for GenStudio in Workfront Setup, confirm both products sit in the same organization and reviewers are users of both, match GenStudio roles to Workfront license types, have reviewers install the Workfront web viewer extension, and run a test review from request to decision. Evidence: "The integration must be enabled in the Workfront Setup area." (https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio)
- **XG02 Proof approval templates for content reviews** (one-time, 16 / 32 / 56, default): Design single-stage and multi-stage proof templates in Workfront with reviewers, approvers, proof roles and deadlines for each kind of content, attach them to the Workfront projects editors choose from in GenStudio, and train editors and approvers on the proofing viewer. Evidence: "Workfront Proof approval templates provide preformatted steps that can streamline the proof approval workflow." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/proof-integration)

For the client: Workfront Proof takes over review and approval of the content created in GenStudio. Your approval templates set the stages and the reviewers, your reviewers comment and decide in the Workfront proofing viewer, and the decision shows in GenStudio before anything is published. Every generated ad and email passes your approval chain, with versions compared side by side and comments and decisions kept on record.

### AEM Assets + GenStudio for Performance Marketing (`aemassets-gspm`), native

Label: Approved assets in an AEM Assets Content Hub repository appear in GenStudio Content, read-only.

How: Assets approved in an AEM Assets Content Hub repository in the same organization appear in GenStudio Content, where creators pick the repository from the Location list and use the assets as inputs for new experiences. GenStudio reads the repository and cannot write to it.

Availability: Not stated by Adobe; the page gives the setup steps and says the repository must be in the same organization as GenStudio. "Administrators should verify that the AEM Assets Content Hub repository is within the same organization as GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo)

Prerequisites:

- AEM Assets as a Cloud Service with Content Hub enabled in Cloud Manager. "Follow the Deploy Content Hub self-service process to enable Content Hub for your existing AEM Assets in Cloud Manager." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo)
- Administrative access to the Admin Console and to AEM Assets as a Cloud Service. "The following steps require administrative access to Admin Console and AEM Assets as a Cloud Service." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo)
- The Content Hub repository in the same Adobe organization as GenStudio. "Administrators should verify that the AEM Assets Content Hub repository is within the same organization as GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo)
- GenStudio users or a user group added to the Content Hub product profile; Assets Ultimate includes 250 Content Hub Limited users and Assets Prime 50. "You can access and use Content Hub with up to 250 Content Hub Limited users for Assets Ultimate and 50 Content Hub users for Assets Prime" (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/deploy-content-hub)
- Assets marked Approved in AEM Assets: only those reach Content Hub. "Only assets marked Approved on Experience Manager Assets as a Cloud Service become available for distribution on Content Hub" (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/deploy-content-hub)
- The repository is read-only from GenStudio: drafts, new assets and metadata save to GenStudio's own repository. "The AEM repository is read-only, which means that you can access the content but you cannot save drafts, new assets, or metadata to the AEM repository." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/manage-assets)
- Expired or license-restricted assets may not be usable in Create. "An AEM repository may enforce certain licensing requirements, such as asset expiration." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/manage-assets)

Lines:

- **XG03 AEM Assets Content Hub connection for GenStudio** (one-time, 16 / 24 / 48, default, needs Content Hub on AEM Assets as a Cloud Service): Enable Content Hub for your client's AEM Assets in Cloud Manager where it is not already on, add GenStudio users or a user group to the Content Hub product profile in the Admin Console, check both sit in the same organization, and verify the Location list shows the repository in GenStudio Content. Evidence: "In the Admin Console, add a GenStudio for Performance Marketing user or user group to the AEM Assets Content Hub product profile." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo)
- **XG04 Approved assets and filters for creators** (one-time, 16 / 32 / 64, default, needs Content Hub on AEM Assets as a Cloud Service): Set up the approval fields in the AEM Assets metadata schema, approve the assets creators need for Content Hub, configure Content Hub's filters, asset details and search so creators find them in GenStudio, and check expiry dates on licensed assets. Evidence: "Approve assets for use in AEM Assets Content Hub, which makes them available in GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo)

For the client: GenStudio connects to your AEM Assets Content Hub repository. The assets you have approved there show up in GenStudio's Content library, where your creators choose them as the starting point for new ads and emails. GenStudio reads the repository and does not write to it. Your creators build from the assets you have already approved, with no copies to download and upload.

### Journey Optimizer + GenStudio for Performance Marketing (`ajo-gspm`), extension

Label: An Adobe Exchange app brings Journey Optimizer email templates into GenStudio's Create.

How: The Journey Optimizer for GenStudio app from Adobe Exchange lets authors choose Journey Optimizer content templates when they create email experiences in GenStudio. GenStudio leaves Journey Optimizer's personalization syntax as it is, so the email can go on being used in Journey Optimizer.

Availability: Not stated by Adobe; the app is listed as Free on Adobe Exchange and your client's organization approves the request. "Select Free to request the app for your organization." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)

Prerequisites:

- Journey Optimizer and GenStudio in the same Adobe organization. "Organizations that use Adobe Journey Optimizer (AJO) and GenStudio for Performance Marketing in the same IMS organization can install the Journey Optimizer for GenStudio app from Adobe Exchange." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)
- A system administrator to approve the app request and complete the deployment. "After a system administrator approves the app and completes deployment, authors can choose AJO content templates while creating email experiences in GenStudio" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)
- An Adobe Developer Console project with the Journey Optimizer API and OAuth credentials. "Create a project in the Adobe Developer Console that provides OAuth credentials for the Journey Optimizer API." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)
- Journey Optimizer permissions for the technical account, granted in Experience Platform Permissions. "the technical account tied to the OAuth credentials must be granted Journey Optimizer permissions in Adobe Experience Platform > Permissions" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)
- One deployment for each sandbox, with the sandbox name entered in lowercase. "Enter the sandbox name in all lowercase" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)
- Field placeholders in the Journey Optimizer email templates where generated content goes: generation fails without them. "A template can be selected without those fields, but experience generation fails if the placeholders GenStudio for Performance Marketing expects are missing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio)
- Adobe Developer App Builder on the GenStudio contract (one pack comes with licenses started or renewed on or after April 7, 2025). "Customers renewing or starting a new license to GenStudio for Performance Marketing on or after April 7, 2025 will also receive one Pack of Adobe Developer App Builder for their applicable License Term" (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)

Lines:

- **XG05 Journey Optimizer templates in GenStudio** (one-time, 16 / 32 / 56, default): Request and approve the Journey Optimizer for GenStudio app in Adobe Exchange, create the Developer Console project with the Journey Optimizer API, deploy the app for each sandbox, grant the technical account its Journey Optimizer role, add the field placeholders GenStudio expects to the email templates, and test an email experience. Evidence: "To use AJO templates from your Journey Optimizer library inside GenStudio (including the AJO Template tab when you create email experiences), your organization must install and configure the Journey Optimizer for GenStudio app from Adobe Exchange." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates)

For the client: An Adobe app connects GenStudio to your Journey Optimizer template library. Your authors choose a Journey Optimizer email template when they create an email in GenStudio, and your personalization fields stay as they are. Generated email content fits the templates you already send from, so it goes into your journeys without rebuilding.

### Marketo Engage + GenStudio for Performance Marketing (`marketo-gspm`), extension

Label: An Adobe Exchange app brings Marketo Engage email templates into GenStudio's Create.

How: The Marketo for GenStudio app from Adobe Exchange lets authors choose Marketo Engage email templates when they create email experiences in GenStudio. GenStudio leaves Marketo's token syntax as it is, so the email can go on being used in Marketo Engage.

Availability: Not stated by Adobe; the app is listed as Free on Adobe Exchange and your client's organization approves the request. "Select Free to request the app for your organization." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)

Prerequisites:

- Marketo Engage and GenStudio in the same Adobe organization. "Organizations that use Marketo Engage and GenStudio for Performance Marketing in the same IMS organization can install the Marketo for GenStudio app from Adobe Exchange." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)
- Marketo Product Admin access, to create and retrieve the credentials. "To create and retrieve those credentials, you must have Marketo Product Admin access" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)
- An API-only user whose role has the Access API and Access Design Studio permissions, and a LaunchPoint service. "with the following permissions added: Access API and Access Design Studio" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)
- The instance's REST API base URL and its Identity URL. "You will also need the Marketo Engage Identity URL that your Exchange deployment screen requests" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)
- Emails made in GenStudio's standard Email experience flow: the integration does not support the new email editor experience. "This integration does NOT support emails created with the new email editor experience." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)
- For templates outside the default workspace: that workspace's ID. "if you need to fetch templates from a different workspace" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio)
- Adobe Developer App Builder on the GenStudio contract (one pack comes with licenses started or renewed on or after April 7, 2025). "Customers renewing or starting a new license to GenStudio for Performance Marketing on or after April 7, 2025 will also receive one Pack of Adobe Developer App Builder for their applicable License Term" (https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html)

Lines:

- **XG06 Marketo Engage templates in GenStudio** (one-time, 16 / 24 / 48, default): Request and approve the Marketo for GenStudio app in Adobe Exchange, create the API-only user, role and LaunchPoint service in Marketo Engage, deploy the app with the instance's REST and Identity URLs, add the field placeholders GenStudio expects to the email templates, and test an email experience. Evidence: "To use Marketo templates from your Marketo Engage library inside GenStudio (including the Marketo Templates tab when you create email experiences), your organization must install and configure Marketo for GenStudio from Adobe Exchange." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates)

For the client: An Adobe app connects GenStudio to your Marketo Engage templates. Your authors choose a Marketo email template when they create an email in GenStudio, and your Marketo tokens stay as they are. Generated email content fits the Marketo Engage templates you already send from.

### Real-Time CDP + GenStudio for Performance Marketing (`rtcdp-gspm`), native

Label: Real-Time CDP audience definitions become an Audience choice in GenStudio's Create, after Adobe's team onboards the feature.

How: Once Adobe's team has onboarded the feature, audiences from Real-Time CDP appear as an Audience choice in GenStudio's Create, so content is generated for a specific customer segment. Adobe imports the audience definitions and converts them for GenStudio.

Availability: Adobe's page says the Audiences feature needs onboarding by the Adobe team before it appears in GenStudio. "The Audiences feature requires onboarding by the Adobe team to appear in GenStudio." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines)

Prerequisites:

- Organizational access to Real-Time CDP. "Organizational access to Adobe Real-Time Customer Data Platform" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines)
- The audiences already built in your client's Real-Time CDP sandboxes. "Existing audiences already configured in RTCDP sandboxes" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines)
- Adobe's team to run the onboarding, which Adobe says typically takes a few days. "This process typically takes a few days to complete." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines)

Lines:

- **XG07 Real-Time CDP audiences in GenStudio content creation** (one-time, 16 / 24 / 40, default): Check that the audiences your client wants exist in its Real-Time CDP sandboxes with clear names, ask Adobe to run the audience onboarding, confirm the Audience list appears in Create, and train editors to use audiences with personas. Evidence: "Audiences provide targeted customer segments from Adobe Real-Time Customer Data Platform (RTCDP), bringing precise targeting data into your content generation workflow." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines)

For the client: Your Real-Time CDP audiences appear as a choice when your team creates content in GenStudio, once Adobe has brought the audience definitions in. The content is then written for that customer segment. Ads and emails are written for the customer segments you already target, alongside your personas.

### Coworker + GenStudio for Performance Marketing (`cw-gspm`), native

Label: GenStudio's Insights, Create and Activate tools as a native connection in Coworker.

How: GenStudio's tools are a native connection in CX Enterprise Coworker. In a Coworker conversation a user asks for ad performance, assembles a draft from a template or a recommendation and shares it for review, and publishes an approved experience to a connected channel, within that user's own GenStudio permissions.

Availability: Adobe's page says the AI assistant capabilities are generally available to customers enabled for GenStudio for Performance Marketing, and that your client's organization controls whether the Coworker connection is on. "AI assistant capabilities are generally available to customers enabled for GenStudio for Performance Marketing." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/overview)

Prerequisites:

- CX Enterprise Coworker for your client's organization, with the GenStudio connection made available by the organization. "Your organization controls availability, so you do not enter the direct MCP server URL." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants)
- An Adobe account with access to GenStudio: the connection uses that user's identity and permissions. "The connection uses your Adobe identity and respects your existing product permissions." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/overview)
- One Adobe organization for each connection. "Each connection is scoped to one Adobe Identity Management System (IMS) organization." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/overview)
- Paid media accounts connected in GenStudio: the assistant sees only what the user can already view. "You can access only the organizations, paid media accounts, campaigns, and data that your account can already view." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/overview)
- Channel cover differs by task: publishing from a conversation covers Meta, LinkedIn and Google Campaign Manager 360. "Activate covers Meta, LinkedIn, and Google Campaign Manager 360." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/overview)

Lines:

- **XG08 Coworker prompts for GenStudio reporting and drafts** (one-time, 16 / 24 / 40, default): Confirm the GenStudio tools show in Coworker for your client's organization, write and test a prompt set for performance summaries, best and worst ads and drafts from a recommendation, agree who may publish from a conversation, and train the team. Evidence: "GenStudio for Performance Marketing tools are managed as a native connection in Adobe CX Enterprise Coworker." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants)

For the client: Coworker connects to GenStudio with each person's own sign-in and permissions. In a conversation your team asks how ads are performing, assembles a draft from a template or a recommendation and sends it for review, and publishes an approved ad to a connected channel. Your team gets performance answers and first drafts by asking, and approvals still run through GenStudio's review.

## Not connections

- **Real-Time CDP Collaboration + ca** (`collab-ca`): Carried over from Oct 30 and checked again: neither guide names the other. Searched: All 52 pages of the Collaboration guide (no Content Analytics); the 10 Content Analytics pages of the Customer Journey Analytics guide (no Collaboration); the product pages on business.adobe.com were read on Oct 30 and not today.
- **Real-Time CDP Collaboration + ajo, target, marketo, workfront, aemsites, aemassets, aemforms, commerce, eds, bv, so, bc, cw** (`collab-others`): The Collaboration guide names no other product in the tool. Audiences a collaborator sends arrive in Experience Platform's Audience Portal, and Adobe says only that they can then be used in campaigns: it names no application. That is the same platform, not a connection. Two things the guide does document are outside the tool: sourcing audiences from Adobe Audience Manager, and connecting to Amazon Marketing Cloud. Searched: All 52 pages of the Collaboration guide, searched by script for Journey Optimizer, Customer Journey Analytics, Target, Marketo, Workfront, Experience Manager, Commerce, Brand Visibility, LLM Optimizer, Sites Optimizer, Brand Concierge, Coworker, AI Assistant, Mix Modeler, Marketing Campaign Analytics, Content Analytics, GenStudio, Adobe Advertising and Adobe Analytics. The 70 pages of the Coworker guide, searched for Collaboration. Web search limited to experienceleague.adobe.com and helpx.adobe.com. Quote: "These audiences can then be used in campaigns and customer engagement." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform)
- **Marketing Campaign Analytics + ajo** (`mmm-ajo`): Same platform only. Adobe's overview of Experience Platform applications puts both in one example workflow and says the Marketing Campaign Analytics step is planning, with no data passing to Journey Optimizer. Searched: All 35 pages of the Marketing Campaign Analytics guide (Journey Optimizer is not named); web search limited to experienceleague.adobe.com for the two names together; Adobe's page on how Experience Platform and its applications work together. Quote: "It is not the step for email or for day-to-day audience builds." (https://experienceleague.adobe.com/en/docs/experience-platform/landing/getting-started/apps-overview)
- **Marketing Campaign Analytics + cw** (`mmm-cw`): Coworker has an implementation guide skill that writes an onboarding plan for Marketing Campaign Analytics. Adobe says these skills do not access Adobe systems, so it is a planning aid and not a connection. Searched: The 70 pages of the Coworker guide, searched for Marketing Campaign Analytics and Mix Modeler (3 pages, all about the planning skill). Quote: "These skills don't access your Adobe systems or make any changes." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/implementation-guide)
- **Marketing Campaign Analytics + target, marketo, workfront, aemsites, aemassets, aemforms, commerce, eds, bv, so, bc, gspm, collab** (`mmm-others`): The Marketing Campaign Analytics guide names Experience Platform, Real-Time CDP, Customer Journey Analytics, Adobe Analytics and (as a filter value only) Audience Manager. Nothing else in the tool is named. Adobe Analytics is a documented data source, but it is not a product in the tool. Searched: All 35 pages of the Marketing Campaign Analytics guide, searched by script for every product name in the tool. Quote: "Data collected using the Adobe Analytics source connector." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview)
- **GenStudio for Performance Marketing + cja** (`gspm-cja`): Not a connection your client sets up. GenStudio's Insights runs on Experience Platform datasets and a Customer Journey Analytics connection that Adobe creates and manages for GenStudio. Nothing reaches your client's own Customer Journey Analytics, and the guide warns against deleting those components. Searched: All 96 pages of the GenStudio user guide and 10 of the extensibility guide; all 454 pages of the Customer Journey Analytics guide, where GenStudio appears once, as a value in the data views list. Quote: "Resetting the production sandbox in AEP deletes all data connections and causes Insights to stop working." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/data-management)
- **GenStudio for Performance Marketing + target, commerce, eds, aemforms, bv, so, bc** (`gspm-others`): Not named in the GenStudio guides. Commerce appears once, in the name of a TikTok ad category on an Insights page. Searched: All 96 pages of the GenStudio user guide and 10 of the extensibility guide, searched by script for every product name in the tool.

## Left out, and why

Step 3 of the brief: a service or a pair that rests on a feature Adobe keeps under an early or limited label is left out and listed here. The words are Adobe's own.

| What | Why | Adobe's words | Page |
|---|---|---|---|
| Real-Time CDP Collaboration + Marketing Campaign Analytics: campaign performance data exported for media planning | Kept on Oct 30 as a connection with no services, because the only source was one bullet on Adobe's Collaboration product page, marked with an asterisk whose footnote read Coming soon. That page is on business.adobe.com and could not be read today. Experience League still documents no export: none of the 52 Collaboration pages names Marketing Campaign Analytics or Mix Modeler, and none of the 35 Marketing Campaign Analytics pages names Collaboration. Taken out of the connections under Adam's rule until Adobe documents it. | "Export campaign performance data to measurement partners and tools, including Adobe Customer Journey Analytics and Adobe Mix Modeler for deeper analysis and media planning. (read on Oct 30, not today)" | https://business.adobe.com/products/real-time-customer-data-platform/collaboration.html |
| Real-Time CDP Collaboration + Customer Journey Analytics: campaign performance data exported for analysis | Same bullet and the same footnote as collab-mmm. No Collaboration page names Customer Journey Analytics, and the 454 pages of the Customer Journey Analytics guide do not name Collaboration. Taken out of the connections under Adam's rule until Adobe documents it. | "Export campaign performance data to measurement partners and tools, including Adobe Customer Journey Analytics and Adobe Mix Modeler for deeper analysis and media planning. (read on Oct 30, not today)" | https://business.adobe.com/products/real-time-customer-data-platform/collaboration.html |
| Collaboration: the Expansion Models use case and the Expand section of a project (audiences expanded from a collaborator's population) | Adobe labels the use case Beta. CO04 and CO05 cover Discover, Activate and Measure only. | "Expansion Models (Beta) This use case grants access to the Expand section and all available functionality." | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/overview |
| Collaboration: conversion data sourced from cloud storage | Adobe says it is coming soon, so XD03 sources conversion data from Experience Platform, the only source the measurement page supports. | "Sourcing conversion data from cloud storage is coming soon." | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-adlogs/configure-gcs-adlog-sourcing |
| Marketing Campaign Analytics: full funnel modeling | Adobe's pages disagree. The release notes list it with a general availability date of October 29, 2026, while the Models overview page, updated after that, still carries the limited testing note over the section. Taken out of MM04's scope until the pages agree. | "The functionality described in this section is in the Limited Testing phase of release and might not be available yet in your environment." | https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/overview |
| Marketing Campaign Analytics: the Enable scores for Customer Journey Analytics setting, with the connection, data view and Workspace template Adobe creates | The section that describes it on the Build models page carries the limited testing note, although the Models overview page and the Customer Journey Analytics templates page mention the setting and the template without it. XD07 and XD08 therefore use the route Adobe documents without a label: the score datasets are added to a connection by hand. Where a client already has the setting, XD07 is mostly done for them. | "Both the connection and data view are system-owned." | https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/build |
| GenStudio: creating LinkedIn experiences | Both pages for creating a LinkedIn experience carry Adobe's Beta badge, although the pages for LinkedIn templates, connecting a LinkedIn Ads account and activating to LinkedIn do not. GS03 therefore names email, Meta and display templates; GS04 still connects the LinkedIn account, which Insights uses. | "This feature is currently in Beta, so some functionality may be limited or subject to change." | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/create-linkedin |
| GenStudio: Campaigns (the campaign timeline and campaign objects) | All three Campaigns pages carry Adobe's Beta badge. No line depends on it. | "This feature is currently in Beta, so some functionality may be limited or subject to change." | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/campaigns/overview |
| GenStudio: banner experiences, starter templates and image variants | Each page carries Adobe's Beta badge. GS03 builds your client's own templates and does not rely on starter templates. | "This feature is currently in Beta, so some functionality may be limited or subject to change." | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/starter-templates |
| GenStudio: content fragment swap from AEM Content Fragments (a possible GenStudio + AEM Sites connection) | Adobe's pages disagree and one carries a coming soon note: the email page says the swap works for email on the Canvas and that Horizon support is coming soon, the release notes describe it on the Horizon canvas, and the extensibility guide describes the same extension as reading a third-party repository. No page gives setup steps for connecting an AEM repository. Not written up as a connection. | "Content fragment swap is available for email experiences on the Canvas today. Horizon channel support is coming soon." | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/email-experiences |
| GenStudio: content generation in the five languages Adobe lists as Beta | Adobe's release notes separate 12 generally available languages from 5 Beta ones. No line names a language. | "This feature currently supports 12 GA languages and 5 Beta languages" | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes |
| Content Analytics: paid media data from Pinterest, Snapchat and TikTok | Adobe marks these three networks as in limited testing, so XD10, XD14 and XD15 rest on Meta and Google Ads only. | "Pinterest, Snapchat, and TikTok are in the Limited Testing phase of release and might not be available yet in your environment." | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media |

## Documented without a label, but not costed

Real, documented work that did not get a line in this pass. Ask and it can be added.

- Collaboration: cloud storage destinations set up by the client (Amazon S3, Snowflake, Google Cloud Storage, Azure Blob Storage, SFTP, Data Landing Zone). XD02 covers the Experience Platform destination only (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/overview).
- Collaboration: sourcing first-party segments from Adobe Audience Manager, which is not a product in the tool (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing).
- Collaboration: connecting to Amazon Marketing Cloud and its measurement reports, for clients with an Amazon Ads account approved for it (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/connect/ad-platform-connections/amc).
- Collaboration: ad exposure logs sourced from Azure or Google Cloud Storage for measurement (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-adlogs/configure-gcs-adlog-sourcing).
- Collaboration Starter: inviting a party that has no license, and running its side of the collaboration (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/starter-overview).
- Marketing Campaign Analytics: granular incrementality reporting fields and channel adstock settings, which MM04 could name (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/build).
- GenStudio: Adobe Express templates, the Figma plugin and GenStudio Photoshop, translation of approved experiences, and activation to Amazon Ads, Innovid, TikTok, YouTube, ChatGPT and The Trade Desk. GS04 names Meta, LinkedIn and Campaign Manager 360, the three with their own account connection pages (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/settings/connect-channel).
- GenStudio: its tools offered to assistants other than Coworker (Claude, ChatGPT, Codex, Writer, Microsoft Copilot) through a remote connection (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants).
- GenStudio: custom extensions built with App Builder for compliance checks, translation or an outside asset library (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/home).

## What surprised us, or what a partner would get wrong

### Real-Time CDP Collaboration

1. **"Automatically available" does not mean free.** The release notes say Collaboration is automatically available to Real-Time CDP Prime and Ultimate customers, the quick start lists an active Collaboration license as a prerequisite, and the product description sells a Base and Credits. Every activity uses credits, and the two parties agree the split in the connection settings. A party invited through Starter pays nothing: "The collaborator who invited you covers all credit usage associated with your activities." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/starter-overview)
2. **Three choices cannot be undone.** "The Region is automatically set based on your Adobe Experience Cloud account. This cannot be changed at anytime." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-account) and "the Role is not editable after the initial setup." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-account) Match keys cannot be added to a connection after it is established (quoted in the prerequisites). CO02 exists to get these right the first time.
3. **One weak match key fails the whole activation.** "if one (or more) match key has no overlaps, no audience counts, or falls below threshold, the entire activation will fail." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest)
4. **Publishers wait to be found.** "Currently, only advertisers can browse publishers. Publishers cannot browse or initiate connections with advertisers." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide)
5. **Measurement may need Adobe.** "While the Measure workspace is available in the UI, full reporting functionality may require backend enablement." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide) Conversion data can come from Experience Platform only, which is why XD03 sits on the Real-Time CDP connection.
6. **The guide disagrees with itself on destinations.** The use cases page: "To set up a cloud data warehouse destination, please contact your Adobe representative." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/use-cases) The July 2026 release note: "You can now configure and manage supported cloud storage destinations directly from the Activation workspace and use them to activate received audiences." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest)
7. **Some sources depend on the region.** "If GCS sourcing is not yet available in your region, contact your Adobe account representative to confirm a timeline." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-gcs-audience-sourcing)

### Marketing Campaign Analytics

1. **The old name is still everywhere.** "Some of the Experience League content might still refer to Mix Modeler instead of Marketing Campaign Analytics." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/overview) The product description is still titled Mix Modeler, and a client will see AMM in dataset names.
2. **A rescore does not update a plan.** "Rescore of a model does not change any Plans that are already created based on the rescored model." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/train-score) MM06 rebuilds plans each month for that reason.
3. **Multi-touch attribution has limits a client may not expect.** "Multi-touch attribution cannot measure most offline touchpoints such as print ads, billboards, or TV commercials and business factors." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/get-started/about) And a model needs spend: "You cannot set up the model with touchpoints that have overlapping data and there must be at least one touchpoint with spend." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/build)
4. **The route into Customer Journey Analytics is in two states.** Adobe documents a one-click setting that creates a connection, a data view and a Workspace template, under a limited testing note, and warns: "Once you have enabled this setting, you can only disable the setting by deleting the model." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/build) The Models overview page mentions the same setting with no note: "To make score data available to Customer Journey Analytics , select Enable scores for Customer Journey Analytics" (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/overview) and the Customer Journey Analytics templates page lists the template: "View insights from selected models generated by Marketing Campaign Analytics." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/templates/use-templates) XD07 and XD08 are written for the route with no label, adding the score datasets by hand. A partner should check which state the client's environment is in before quoting XD07.
5. **Full funnel modeling: the release notes and the guide disagree.** The release notes row: "You can enable full funnel modeling when you build a a model to show how marketing moves customers through the funnel." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/releases/latest) with a general availability date; the Models overview section still opens with the limited testing note (quoted under Left out). Adobe defines the phase as: "Limited Testing : A phased release begins with testing by internal Adobe users." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/releases/latest)
6. **Privacy and Security Shield is not mandatory.** The Oct 30 note read the product description as requiring it. The sentence is about a client that buys it: "Privacy and Security Shield must be licensed with any and all of the following platform-based applications that Customer licenses" (https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html) It is listed among the add-ons.
7. **Coworker plans the implementation and does nothing else.** "They don't perform the implementation or verify it against a live tenant." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/implementation-guide) The same page uses a tier name found nowhere else in Adobe's documentation: "Get an onboarding plan for Marketing Campaign Analytics (MCA) Essentials that adapts to your ingestion path" (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/implementation-guide)
8. **Snowflake.** The Meta Ads source page says Meta data reaches Mix Modeler via Snowflake (quoted in the `mmm-ca` prerequisites). No Marketing Campaign Analytics page explains that path, and the product description lists Snowflake among the source connectors licensed separately.

### GenStudio for Performance Marketing

1. **Activation does not launch anything.** Activation "then directly delivers it to that channel in an inactive, off status" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/overview) and "GenStudio for Performance Marketing does not currently create campaigns or ad sets." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-meta-ad) Someone still creates the campaign and switches the ad on in the ad platform.
2. **Insights lives on Adobe-managed plumbing.** "Resetting the production sandbox in AEP deletes all data connections and causes Insights to stop working." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/data-management) and "GenStudio for Performance Marketing retains channel data for 13 months." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/settings/connect-channel) A client that also owns Customer Journey Analytics will not find GenStudio's data in it.
3. **GenStudio's own review keeps no record.** "Comments are tied to draft ID and discarded after publication." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/proof-integration) That is the case for Workfront Proof (XG01, XG02). The integration started as a Beta program ("The GenStudio for Performance Marketing and Adobe Workfront Proof integration Beta program launches this month." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes)) and a later release note brings it in without that label ("The Workfront Proof integration brings Proof" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes)); the current page carries no badge, so it is written up.
4. **LinkedIn is half labelled.** The two pages for creating a LinkedIn experience carry the Beta badge; the activation page, with no badge, says: "You can create a LinkedIn experience in GenStudio for Performance Marketing, then select it for activation." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-linkedin-ad) GS03 leaves LinkedIn out; GS04 still connects the account.
5. **The AEM repository is read-only and must be Content Hub.** A client with AEM Assets but without Content Hub enabled sees nothing in GenStudio. Nothing made in GenStudio is saved back to AEM Assets (quoted in the prerequisites).
6. **Templates from Journey Optimizer and Marketo come in; nothing is sent back.** "GenStudio for Performance Marketing detects application-specific patterns and ignores them, preserving the original form for continued use in AJO or Marketo." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates) Adobe documents choosing the templates in GenStudio. It documents no step that returns the finished email to Journey Optimizer or Marketo Engage, so both connections have one flow.
7. **Real-Time CDP audiences are definitions, and Adobe brings them in.** "During onboarding, audience definitions are imported and transformed into a GenStudio-compatible format." (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines) A partner cannot switch this on alone.
8. **Content fragments are described two ways.** The extensibility guide says the extension "replaces text in generated email experiences on the Create Canvas with entries from a connected third-party (3P) repository" (https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/apps/deploy-app) while the release notes speak of the AEM Content Fragment library. Left out.

### Content Analytics, in the connections

1. **Paid media data does not join site data by itself.** "Enabling paid media does not automatically connect the paid media data to your site's orders, bookings, or revenue." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
2. **Two Google Ads cards.** "Do not use Setup in the Google Ads (beta) card." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
3. **A Content Analytics license stands alone.** Its product description gives it its own behavioral data and audience publishing limit: "are only available to Customers that have licensed Adobe Content Analytics without an accompanying Customer Journey Analytics (Foundation, Select, Prime, or Ultimate) license" (https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html) That is why XD06 no longer says it needs Customer Journey Analytics.
4. **Look-alike counts differ by package.** Prime 5 (quoted in the prerequisites), and "Real-Time CDP Ultimate customers are entitled to 20 active Look-alike audiences in production sandboxes" (https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/lookalike-audiences)

## Open questions for Adam

1. **Collaboration and the label.** Adobe calls it generally available in the regions it lists, and badges it Limited Availability because of the regions. In or out? (Details at the top.)
2. **Two connections taken out.** Collaboration with Customer Journey Analytics and with Marketing Campaign Analytics had no services and rested on one product-page bullet with a Coming soon footnote. Experience League still documents nothing, so they are out. If you can open the Collaboration product page, is the asterisk still there?
3. **Four GenStudio connections beyond the two the brief named.** Journey Optimizer, Marketo Engage, Real-Time CDP and Coworker are each documented with setup steps, one service each. Keep them, or hold them for a later pass?
4. **Where Adobe's pages disagree with each other, we left the feature out.** LinkedIn creation in GenStudio (badge on two pages, none on the activation page) and full funnel modeling in Marketing Campaign Analytics (note on the guide page, general availability in the release notes). Is that the right call, or keep them with a "confirm with Adobe" prerequisite?
5. **Three connections are shared data, not integrations.** Content Analytics with Real-Time CDP, Content Analytics with Marketing Campaign Analytics, and Content Analytics with GenStudio work because the products read the same Experience Platform data, and the cards now say so. Keep all three on the canvas with that wording, or fold the first into the existing Customer Journey Analytics audiences line (RC03) and drop the second?

## Pages read

Cited in the JSON (each downloaded today and checked by script):

- https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/audiences-overview
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/implementation-guide
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/deploy-content-hub
- https://experienceleague.adobe.com/en/docs/experience-platform/landing/getting-started/apps-overview
- https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/lookalike-audiences
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/google-ads
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/journey-optimizer-for-genstudio
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/first-party/marketo-for-genstudio
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/home
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/overview
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-meta-ad
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/connect-ai-assistants
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/ai-assistants/overview
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/proof-integration
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/campaigns/overview
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/connect-aem-repo
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/manage-assets
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/create-linkedin
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/create/email-experiences
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/get-started
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/home
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/data-management
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/overview
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/product-provisioning
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/user-roles
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/settings/connect-channel
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/starter-templates
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/administration
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/get-started/workflow
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/harmonize-data/overview
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/build
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/insights
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/overview
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/scoring-data
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/models/train-score
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/overview
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/plans/overview
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/use-cases
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/overview
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/home
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/starter-overview
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/use-cases
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/permissions/overview
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-account
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-measurement-data
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-adlogs/configure-gcs-adlog-sourcing
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/onboard-audiences
- https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/wf-proof-and-genstudio
- https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html
- https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html
- https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html
- https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html
- https://helpx.adobe.com/legal/product-descriptions/real-time-customer-data-platform-collaboration.html

Also downloaded and searched or read: every page of the Real-Time CDP Collaboration guide (52), the Marketing Campaign Analytics guide (35), the GenStudio for Performance Marketing user guide (96) and extensibility guide (10), the Customer Journey Analytics guide (454) and the Coworker guide (70); the AEM as a Cloud Service table of contents, to find the Content Hub pages; and these pages:

- https://experienceleague.adobe.com/en/docs/experience-platform/landing/getting-started/integrations
- https://experienceleague.adobe.com/en/docs/release-notes/experience-cloud/current
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/product-overview
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/approve-assets
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/templates/use-templates
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/manage-dataviews
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/releases/latest
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/get-started/about
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/starter-overview
- https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/ext-guide/apps/deploy-app

Two addresses returned 404 and are not pages: https://helpx.adobe.com/legal/product-descriptions/adobe-marketing-campaign-analytics.html and https://helpx.adobe.com/legal/product-descriptions/marketing-campaign-analytics.html (tried in case the product description had been renamed; it has not).

## Pages not read

- https://business.adobe.com/products/real-time-customer-data-platform/collaboration.html: Blocked host, not attempted. The Oct 30 source for collab-mmm and collab-cja; whether the Coming soon footnote is still there is unknown.
- https://business.adobe.com/products/adobe-analytics/content-analytics.html: Blocked host, not attempted. The Oct 30 source for rtcdp-ca and XD06, and for the FAQ that compares Content Analytics with GenStudio.
- https://business.adobe.com/products/adobe-analytics/marketing-campaign-analytics.html: Blocked host, not attempted. The Oct 30 source for mmm-ca and XD11.
- https://business.adobe.com/products/adobe-analytics/marketing-campaign-analytics/paid-media-analysis.html: Blocked host, not attempted. The Oct 30 source for XD10.
- https://business.adobe.com/products/genstudio.html: Blocked host, not attempted. The Oct 30 source for XD15.
- https://www.adobe.com/legal/terms/enterprise-licensing/genai-ww.html: Blocked host, not attempted. The generative AI terms that the GenStudio product description links to.
- https://video.tv.adobe.com/: Videos embedded in the Collaboration, GenStudio and Marketing Campaign Analytics pages were not watched; only page text was read.
- https://exchange.adobe.com/: Adobe Exchange is not one of the allowed sources. The Journey Optimizer for GenStudio and Marketo for GenStudio listings were not opened; the Free label is quoted from the Experience League pages.
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide: Read, but the Audience Specification PDF and the Collaboration Audience Activation Guide it links to were not opened.
- https://developer.adobe.com/genstudio/: The GenStudio API documentation that the extensibility guide links to was not read; no line depends on the API.
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/ajo-home: The Journey Optimizer, Workfront, Marketo Engage, Real-Time CDP and AEM guides were not crawled in full for mentions of the three products. Each new pair was found from the GenStudio side; the Workfront page for the proof integration and the AEM pages for Content Hub were read. The Coworker guide (70 pages) and the Customer Journey Analytics guide (454 pages) were crawled in full.
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics-learn/tutorials/intro/demo: The tutorial collection read on Oct 30 (then under /mix-modeler-learn/, which now redirects here) was not read again; no line cites it.

## Before merging into the canvas

- `sow/canvas/catalog_map.json` has no place yet for `collab`, `mmm` or `gspm`; `build.py` stops until they are placed (see CLAUDE.md, Oct 30).
- The `client` entries follow the shape of `connection_client` in `sow/product_copy_rules.json` (`how`, `gain`, `note`). They were not run through `sow/qa/check_product_copy.py`.
- New connection ids put the product already in the tool first. Rename if the canvas expects another order.
- `ca` (Content Analytics) is researched in `portal_omnichannel_b2b.json`; this file holds only its connections to the products here and to Real-Time CDP and Customer Journey Analytics.
