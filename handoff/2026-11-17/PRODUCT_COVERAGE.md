# What the tool is missing, and where versions change the work

Checked 19 Nov 2026. Every quote behind this note was matched word for word on a saved Adobe page (168 of 168, plus 6 of 6 for Federated Audience Composition). Nothing in the tool was changed. Full quotes: VERIFY.md and verify/quote_checks.json in this folder.

---

## 1. Missing products, ranked by partner-services value

**Add**

1. **Adobe Commerce Optimizer.** A SaaS layer for catalog, search, recommendations and merchandising, with an optional Edge Delivery storefront, that sits on top of a commerce backend: Adobe Commerce, Salesforce Commerce Cloud or another system.
   Services: instance setup, the connector from Adobe Commerce, catalog loading, catalog views and price books, merchandising, the storefront or a headless front end, and the cart and checkout hand-off. **Add.**
2. **Adobe Campaign (v8, plus clients still on Classic v7 and Campaign Standard).** Adobe's long-standing tool for email, SMS, push and direct mail campaigns, with its own customer database.
   Services: data model, import workflows, templates, deliverability, CRM connectors, and moves from v7 or Campaign Standard to v8 (Adobe has no automated v7 move yet). **Add.**
3. **AEM Guides.** Adobe's system for technical documentation in DITA, built on AEM. It publishes to Sites, PDF, HTML5 and other formats.
   Services: setup, information model, review and translation workflows, output templates, migration estimate, training, and the Guides connection for Claude. Only with AEM Assets Ultimate or Enterprise. **Add.**
4. **Federated Audience Composition.** A paid add-on to Real-Time CDP and Journey Optimizer Prime or Ultimate. It builds audiences straight from the client's data warehouse without copying the data in.
   Services: warehouse connection and IP allow-listing, the federated data model, first compositions and audiences. Gives dwh-rtcdp and dwh-ajo a new route that does not copy data. **Add.**
5. **Data Distiller.** A paid add-on that runs scheduled SQL on Experience Platform data.
   Services: derived datasets and traits, scheduled query pipelines, exports to the warehouse, monthly upkeep. **Add.**
6. **Adobe Commerce Intelligence** (formerly Magento Business Intelligence). Adobe's BI service for commerce: data warehouse and dashboards on top of the Commerce database and outside sources.
   Services: database connection, outside sources such as Salesforce and Google Ads, warehouse table sync, dashboards, exports, Import API scripts. **Add.**
7. **AEM Experience Modernization Agent.** Adobe's AI agent that moves sites onto Edge Delivery from another CMS, from older AEM sites or from static sites. Cloud Service only.
   Services: migration with the agent, rebuilding analytics and consent tags (the agent drops the old scripts), forms and product-page add-ons. Make it a line on the Edge Delivery card and its incoming connections, not a box. **Add (as lines).**
8. **Adobe Marketing Agent for Microsoft 365 Copilot.** Lets people ask about Experience Platform audiences, journeys and CJA data from inside Copilot.
   Services: one rollout line (tenant settings, publishing the agent, Adobe access, starter prompts, training). New connections copilot-rtcdp and copilot-ajo. **Add.**

**Maybe**

9. **Other commerce platform (outside box).** A box for a commerce backend that is not Adobe's, such as Salesforce Commerce Cloud.
   Services: Salesforce catalog connector, plus the cart and checkout hand-off. Needed if Optimizer is added. **Maybe (yes if Optimizer goes in).**
10. **AEM Dynamic Media.** Image and video resizing and delivery on AEM Assets. The tool already has 63 mentions in connection lines; what is missing is the base setup on the Assets side.
    Services: enablement, presets, Smart Crop, image and spin sets, delivery URLs. Optional lines on the AEM Assets card. **Maybe.**
11. **Real-Time CDP Connections (event forwarding).** Adobe's servers forward web and app events to ad platforms, such as Meta's Conversions API.
    Services: event forwarding rules, conversion APIs, testing. **Maybe.**
12. **Workfront Fusion.** Adobe's automation tool. It shows up in connection lines but has no card.
    Services: scenario builds, connections, monthly monitoring. **Maybe.**
13. **Firefly Services.** Adobe's creative APIs (Firefly, Photoshop, Lightroom, InDesign, Content Tagging). Today they sit inside the Firefly Creative Production card.
    Services: credentials, automation builds, tagging into AEM Assets. A client with only the APIs can't find them today. **Maybe.**
14. **Adobe Advertising (DSP; Search, Social & Commerce).** Adobe's media-buying products, including ChatGPT Ads.
    Services: tracking work (Analytics or CJA link, AMO ID codes on landing pages, Target tests for ad traffic). **Maybe.**
15. **Audience Manager.** Adobe's older audience platform for advertising.
    Services: mainly moving clients to Real-Time CDP (first-party data only). **Maybe.**
16. **Adobe Learning Manager.** Adobe's learning management system.
    Services: setup, CRM and HR connectors, AEM Assets link. Its buyers are learning and HR teams, so it only fits if you want a wider audience. **Maybe.**

**Skip:** AEM Screens (niche, no docs found), Customer AI (make it a Real-Time CDP line instead), Experience Platform Agents and AI Assistant (replaced by Coworker), Account Qualification Agent (only a video title, nothing to price).

---

## 2. Versions that change the work

"Picker" means a choice inside the box that hides or resizes services. "Note" means a short line on the card.

| Product | Versions | What changes | How to show it |
|---|---|---|---|
| Adobe Commerce | On-premises / On Cloud / Cloud Service | Live Search, B2B and maintenance shrink or go away on Cloud Service; several connections are on one side only. Details in section 3. | **Picker** |
| Workfront | Classic with Proof / V2 with unified review | On V2 only, Proof does not exist, so workfront-gspm (XG01/XG02) and express-workfront (XJ04/XJ05) don't work. **Most important fix in this list.** | **Picker** |
| Frame.io | Legacy / V4 Select / V4 Prime | FR06 must be rebuilt on V4 (old tokens can't move). DRM and watermarking (FR04) need Prime. Legacy integrations stop on V4. | **Picker** |
| Journey Optimizer | Select / Prime / Ultimate | Select has no real-time journeys, so event-triggered work in JO02 and JO05 needs Prime. Offer Decisioning needs Ultimate. Prime can come without email, which removes email setup and IP warmup. | **Picker** |
| Target | Standard / Premium | Standard: no Recommendations (TG04), and no properties work in TG02. The tool already flags Premium in places. | **Picker** (mostly hides TG04) |
| AEM Assets | Prime / Ultimate (Enterprise renewals only) | Prime has one environment and can't be customized: custom code in AS04 is out, AS01 shrinks, no Guides. | **Picker** |
| AEM Sites and Forms | Cloud Service / 6.5 LTS (Managed Services or on-premises) / older 6.5 | On 6.5, SI06 becomes service-pack installs. New missing service: the upgrade to 6.5 LTS. Universal Editor works on 6.5 LTS. Assistant connections need Cloud Service release 26309+. | **Picker** |
| Marketo Engage | Growth / Select / Prime / Ultimate | Select has no sandbox or Lifecycle Modeler (affects MK04). CRM sync speed rises by tier (MK02, MK07). Marketo Measure comes only with Ultimate. | **Picker** |
| Workfront Workflow | Select / Prime / Ultimate / Fusion bundle | Prime adds environment promotion and localization; Ultimate adds Data Connect and financials. | **Picker** |
| Adobe Campaign (if added) | v8 / Classic v7 / Campaign Standard | Each starts a different project (new build or a hands-on move). Sending logs back to Real-Time CDP needs v8.4+. | **Picker** |
| Commerce Optimizer | Optimizer / Optimizer Headless | Headless has no Edge storefront: XA18-XA20 and the eds connection drop out; a custom front end needs its own estimate. | Note |
| Dynamic Media | Prime / Ultimate | Smart Crop, presets and sets need Ultimate. | Note |
| Forms on Edge Delivery | Sites only / Sites + Forms | Without AEM Forms, only spreadsheet-authored forms. | Note |
| Real-Time CDP | Prime / Ultimate; B2C, B2B, B2P | Custom destinations (Destination SDK) need Ultimate. Mostly noted already. | Note |
| Analytics | Foundation / Select / Prime / Ultimate | Media tracking, Contribution Analysis, Customer Attributes depend on the package. | Note |
| Brand Intelligence | Validate / Instruct to Assemble / Simulate | Each BN line needs its add-on (most need Validate). | Note |
| Coworker | Chat / for teams / Projects / not yet moved | Coworker for teams is a separate product with different services (brand kit, contact lists, HubSpot, Salesforce, Databricks). Adobe says its own team does onboarding. | Note |
| Brand Visibility | Trial / with Semrush | Semrush adds real search-demand data to L01 and O01. | Note |
| Workfront Planning, CDP Collaboration Starter, Creative Cloud Pro vs Standard | | Small differences; Creative Cloud evidence is weak. | Note |

No change needed: CJA editions, Sites Optimizer trial, GenStudio license date (already in the tool).

---

## 3. Commerce in detail

### Proposed version picker in the Commerce box

Three options: **On-premises / On Cloud / Cloud Service**. Managed Services goes in the On Cloud note.

| Service | On-premises | On Cloud | Cloud Service |
|---|---|---|---|
| CE01 Store setup, CE03 Checkout, CE04 Inventory | yes | yes | yes |
| CE02 Catalog import | yes | yes | yes, check import methods |
| CE05 Live Search | full job (2.4.4+) | full job | configuration only; Adobe installs it |
| CE06 B2B | install and setup | install and setup | smaller; already installed |
| CE07 Maintenance and upgrades | yes, plus hosting | yes (six patches and one minor release a year) | no (Adobe upgrades it; 30-day sandbox window) |

If the client also uses the Optimizer connector, CE05 goes away on every version.

Connections by version:
- **commerce-eds:** Cloud Service, or with Optimizer. Not plain on-premises or On Cloud.
- **commerce-rtcdp:** Adobe's setup steps cover on-premises and On Cloud; Audience Activation is On Cloud and on-premises only. Confirm for Cloud Service. commerce-ajo, commerce-cja, aa-commerce and target-commerce use the same data route.
- **bc-commerce (Brand Concierge):** Adobe names On Cloud and needs Live Search, which the Optimizer connector removes. Confirm before offering with Optimizer.
- **commerce-aemsites, bv-commerce:** Cloud Service not covered on Adobe's pages. Confirm.
- Cloud Service does not run the older Luma storefront.

### Commerce Optimizer as its own box

Two packages: **Optimizer** (with Edge Delivery storefront) and **Optimizer Headless** (without). Cart, checkout, accounts and orders stay on the backend.

Services:
- Instance and user setup (sandboxes matched to test systems, production to production)
- Connector from Adobe Commerce 2.4.7+ (on-premises or On Cloud): uninstall Live Search, Product Recommendations and Catalog Service, install, set scopes, first sync. A separate B2B connector carries shared catalogs
- Or catalog loading through Adobe's Data Ingestion API or the Salesforce Commerce Connector
- Catalog views, policies, price books
- Merchandising: facets, synonyms, rules, recommendations
- Edge Delivery storefront (XA18/XA19/XA20, Optimizer package only), or a custom headless front end (Headless)
- Hand-off to a non-Adobe cart and checkout with API Mesh and App Builder (Adobe calls this a custom implementation)

Connections: commerce (connector), eds (Optimizer package only), aemassets (Product Visuals), so (Opportunities need Sites Optimizer Ultimate), and a new outside box, Other commerce platform.

**The storefront opportunity.** The connector is small (Adobe says there is no custom connector to build). The big jobs are the Edge Delivery storefront, or a custom front end, and the checkout hand-off when the backend isn't Adobe's. Adobe also pitches Optimizer to merchants who keep their current backend and only want a new storefront, so this can be sold with no Adobe Commerce at all, for example on top of Salesforce Commerce Cloud. That is the clearest new work for partners in this area.

### Commerce Intelligence as its own box

Sold as an upgrade or in an Intelligence Bundle with Commerce On Cloud (75 seats, up to 5 standard integrations, 1,000 Import API requests a month) or on-premises. Separate from Experience Platform and CJA.

Services: connect the Commerce database (SSH tunnel) and pick tables; add sources (Salesforce, Google Ads, Zendesk); warehouse table sync and calculated columns; dashboards and reports; scheduled email summaries and CSV or Excel export; Import API scripts.

Connections: commerce (on-premises and On Cloud; Cloud Service not documented), crm (Salesforce), ads (Google Ads). Don't offer it with Cloud Service or Optimizer until Adobe confirms.

No bundle option is needed: placing both boxes covers it.

### ChatGPT's four claims

- **(a) Held.** The Optimizer Connector is a native, first-party link between Adobe Commerce (cloud or on-premises) and Optimizer. Adobe adds that it needs 2.4.7+, that Live Search and the related extensions must be removed first, and that B2B shared catalogs need a separate connector.
- **(b) Not stated by Adobe.** The claim about the size and ownership of the partner job is partner judgment. Adobe does say the connector is small, the Edge storefront is only in the full Optimizer package, and a non-Adobe checkout is a custom build. No Adobe page says who does the work.
- **(c) Held, with limits.** There is an Intelligence Bundle for Commerce On Cloud (and one for on-premises). Managed Services offers Intelligence only as an upgrade. The Cloud Service and Optimizer product descriptions don't mention it.
- **(d) Held.** Commerce Intelligence is Adobe's BI platform (formerly Magento Business Intelligence) that reads the Commerce database and outside sources.

---

## 4. Pages to paste from business.adobe.com

Adobe blocks automated tools on that site, so these need you. The first three matter most:

1. Commerce Intelligence product page: does it work with Cloud Service and Optimizer?
2. Adobe Commerce compare or plans page: how Adobe positions on-premises, On Cloud, Cloud Service and Optimizer
3. Adobe Campaign overview: is v8 still sold to new clients beside Journey Optimizer?
4. Journey Optimizer packages comparison
5. Target Standard vs Premium
6. AEM Assets Prime vs Ultimate
7. Creative Cloud for enterprise Pro vs Standard (the evidence today is weak)
8. Commerce Optimizer product page (only if you want Adobe's wording on who implements it)
9. Dynamic Media, AEM Guides, Audience Manager (still sold new?), Marketo Growth, Acrobat Sign Solutions vs for business, Firefly Services packaging, Brand Visibility packages, Coworker for teams after 31 Dec 2026, Adobe Advertising

---

## 5. Suggested order of work

1. **Workfront V2 fix:** flag or hide workfront-gspm and express-workfront for V2-only clients. Small and stops wrong quotes today.
2. **Commerce:** the version picker, then the Optimizer box, the Other commerce platform box and Commerce Intelligence. Paste pages 1 and 2 first.
3. **The other main pickers:** Journey Optimizer, AEM Assets, AEM Sites 6.5 LTS (with a new 6.5 LTS upgrade service), Target, Frame.io, Marketo.
4. **Experience Platform add-ons:** Federated Audience Composition, Data Distiller, the Copilot Marketing Agent connections.
5. **Content products:** Adobe Campaign (after paste 3), AEM Guides, Modernization Agent lines on Edge Delivery.
6. **Card notes** from section 2.
7. **The maybes**, once the pastes answer the open questions.
