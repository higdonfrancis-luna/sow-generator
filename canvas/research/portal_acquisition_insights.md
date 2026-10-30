# Customer Acquisition and Content Reporting & Insights: research trail

Checked Oct 30 2026. Data file: `portal_acquisition_insights.json`. Hours are our own estimates for a mid-market client; Adobe publishes none.

The two plays come from Adobe's FY26 partner portal guides (summary in `internal/sales_plays/README.md`, Adobe internal, used for context only and not cited). Every line and connection below rests on public Adobe pages.

| Play | Products on the canvas |
|---|---|
| Customer Acquisition | Real-Time CDP (`rtcdp`), Real-Time CDP Collaboration (`collab`), Mix Modeler (`mmm`), Customer Journey Analytics (`cja`), Content Analytics (`ca`) |
| Content Reporting & Insights | Content Analytics (`ca`), GenStudio for Performance Marketing (`gspm`) |

New product lines: CO01 to CO06 (Collaboration), MM01 to MM06 (Mix Modeler), GS01 to GS06 (GenStudio for Performance Marketing). Connection lines: XD01 to XD15. Content Analytics product lines were left to the other helper (`portal_omnichannel_b2b.*`); Real-Time CDP (RT01 to RT06), CJA (CJ01 to CJ06) and `rtcdp-cja` (RC01 to RC03) were already in the catalog and were not redone.

## Headline findings

1. **Mix Modeler is now Adobe Marketing Campaign Analytics.** Every page in its Experience League guide (updated Oct 29 2026) says "Adobe Marketing Campaign Analytics is the evolution and rebranding of Adobe Mix Modeler." business.adobe.com titles it "Marketing Campaign Analytics (formerly Mix Modeler)". Doc URLs still use `/mix-modeler/`.
2. **Collaboration's exports to CJA and Mix Modeler look like "Coming soon".** The only source is a product page bullet ending in an asterisk; the page's only asterisk footnote reads "Coming soon". Experience League has no export step. Both pairs are kept as documented with `no_services: true`, with a suggestion to hide them for now.
3. **Content Analytics does not require CJA, per Adobe's product page**, yet Experience League runs its configuration and reporting inside CJA. The cja-ca lines assume a CJA license with the client's own journey data.
4. **Collaboration is now documented for EMEA as well** as the US, Canada, Australia and New Zealand.
5. **The Experience Platform Meta Ads source page names Mix Modeler, CJA, GenStudio for Performance Marketing and Content Analytics together** as users of one governed paid media source. That is the clearest public link between GenStudio and Content Analytics.

## Searches run

1. experienceleague Real-Time CDP Collaboration end-to-end workflow get started
2. experienceleague Mix Modeler get started overview harmonized data model plan
3. experienceleague GenStudio for Performance Marketing administrator get started setup
4. experienceleague Content Analytics GenStudio for Performance Marketing insights integration
5. experienceleague Mix Modeler "use scoring data" Customer Journey Analytics
6. experienceleague Real-Time CDP Collaboration measurement Customer Journey Analytics OR "Mix Modeler"
7. experienceleague Content Analytics overview Customer Journey Analytics configure Content Analytics
8. "Marketing Campaign Analytics" Adobe Mix Modeler rebrand
9. "Content Analytics" "GenStudio for Performance Marketing" experienceleague.adobe.com
10. Adobe Content Analytics GenStudio insights attributes paid media Meta "Content Analytics" GenStudio integration
11. experienceleague Real-Time CDP Collaboration "Experience Platform" destination configure activate audiences Audience Portal
12. "Real-Time CDP Collaboration" "Customer Journey Analytics"
13. "Real-Time CDP Collaboration" "Mix Modeler" OR "Marketing Campaign Analytics"
14. experienceleague Real-Time CDP Collaboration source measurement data conversion events attribution
15. experienceleague real-time-cdp-collaboration export campaign performance measurement data Experience Platform dataset
16. Adobe blog Real-Time CDP Collaboration measurement Customer Journey Analytics Mix Modeler export impressions
17. experienceleague mix-modeler models "scoring data" dataset Experience Platform Customer Journey Analytics connection
18. experienceleague Content Analytics paid media Meta Google source connector configuration channels
19. business.adobe.com Content Analytics GenStudio "Content Analytics" product page insights
20. experienceleague Content Analytics audiences create publish Real-Time CDP content attributes
21. experienceleague "Marketing Campaign Analytics" paid media "Content Analytics" OR "Google Ads" OR "Meta Ads" source connector summary
22. experienceleague GenStudio "Content Analytics" content supply chain insights tutorial measure activate
23. helpx.adobe.com legal product-descriptions Real-Time CDP Collaboration product description
24. experienceleague mix-modeler access control permissions sandbox Admin Console product profile
25. experienceleague mix-modeler harmonize-data marketing touchpoints conversions dataset rules build models
26. experienceleague "Content Analytics" audience OR audiences "Customer Journey Analytics" publish content attributes segment
27. experienceleague Real-Time CDP lookalike audiences overview seed audience availability
28. "Content Analytics" "Real-Time CDP Collaboration" OR "Collaboration" Adobe experienceleague content attributes clean room
29. experienceleague Content Analytics reporting template Workspace "Content Analytics template" conversions journeys

## How quotes were checked

- Experience League pages were downloaded and converted to text, and every Experience League quote in the JSON (product `what`, all line `evidence`) was script-checked against the downloaded text: all matched.
- business.adobe.com pages refuse script downloads from this environment, so they were read through WebFetch, and each quote used was rechecked with a second WebFetch asking whether the exact string is present (all present). These are marked "WebFetch" below.
- The helpx GenStudio for Performance Marketing product description could not be read (the fetch permission request timed out): https://helpx.adobe.com/legal/product-descriptions/adobe-genstudio-for-performance-marketing---product-description.html

## Pages read

### Real-Time CDP Collaboration

| Page | URL |
|---|---|
| Adobe Real-Time CDP Collaboration overview | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/home |
| End-to-end workflow | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/end-to-end-workflow |
| Quick start guide | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/quick-start-guide |
| Collaboration Starter overview | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/starter-overview |
| Collaboration use cases | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/overview/use-cases |
| Source and manage audiences | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/onboard-audiences |
| Configure and manage your account | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-account |
| Access control overview | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/permissions/overview |
| Manage roles through Permissions | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/permissions/manage-roles |
| Configure Adobe Experience Platform as a destination | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/destinations/experience-platform |
| Activate audiences | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/activate |
| Discover overlaps and compare audiences | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/collaborator-connections/discover |
| Measure performance | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/collaborator-connections/measure |
| Add and manage measurement data | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/onboard-measurement-data |
| Create and manage projects | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/manage-projects |
| Establishing connections with collaborators | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/connect/establishing-connections |
| Manage connections | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/connect/manage-connections |
| (Beta) Create expansion audiences in Expand | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/collaborate/collaborator-connections/expand |
| Latest Collaboration release notes | https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/latest |
| Collaboration measurement tutorial (video page) | https://experienceleague.adobe.com/en/docs/platform-learn/tutorials/collaboration/collaboration-measurement-setup-and-report-creation |
| Real-Time CDP Collaboration product page (WebFetch) | https://business.adobe.com/products/real-time-customer-data-platform/collaboration.html |
| Introducing new innovations in Real-Time CDP Collaboration, Adobe blog, Oct 6 2025 (WebFetch; no CJA or Mix Modeler mention) | https://business.adobe.com/blog/introducing-new-innovations-in-real-time-cdp-collaboration-that-drive-impact |

### Mix Modeler (Marketing Campaign Analytics)

| Page | URL |
|---|---|
| Marketing Campaign Analytics guide | https://experienceleague.adobe.com/en/docs/mix-modeler/using/overview |
| Marketing Campaign Analytics overview | https://experienceleague.adobe.com/en/docs/mix-modeler/using/get-started/about |
| Marketing Campaign Analytics workflow | https://experienceleague.adobe.com/en/docs/mix-modeler/using/get-started/workflow |
| Marketing Campaign Analytics use cases | https://experienceleague.adobe.com/en/docs/mix-modeler/using/use-cases |
| Ingest data overview | https://experienceleague.adobe.com/en/docs/mix-modeler/using/ingest-data/overview |
| Datasets | https://experienceleague.adobe.com/en/docs/mix-modeler/using/ingest-data/datasets |
| Harmonize datasets overview | https://experienceleague.adobe.com/en/docs/mix-modeler/using/harmonize-data/overview |
| Dataset rules | https://experienceleague.adobe.com/en/docs/mix-modeler/using/harmonize-data/dataset-rules |
| Models overview | https://experienceleague.adobe.com/en/docs/mix-modeler/using/models/overview |
| Build models | https://experienceleague.adobe.com/en/docs/mix-modeler/using/models/build |
| Use scoring data | https://experienceleague.adobe.com/en/docs/mix-modeler/using/models/scoring-data |
| Plans overview | https://experienceleague.adobe.com/en/docs/mix-modeler/using/plans/overview |
| Access controls | https://experienceleague.adobe.com/en/docs/mix-modeler/using/data-governance/access-controls |
| Administration | https://experienceleague.adobe.com/en/docs/mix-modeler/using/administration |
| Current release notes | https://experienceleague.adobe.com/en/docs/mix-modeler/using/releases/latest |
| End-to-end demo (video page) | https://experienceleague.adobe.com/en/docs/mix-modeler-learn/tutorials/intro/demo |
| Mix Modeler product description, effective Aug 13 2024 (WebFetch) | https://helpx.adobe.com/legal/product-descriptions/mix-modeler.html |
| Marketing Campaign Analytics product page (WebFetch) | https://business.adobe.com/products/adobe-analytics/marketing-campaign-analytics.html |
| Marketing Campaign Analytics paid media analysis (WebFetch) | https://business.adobe.com/products/adobe-analytics/marketing-campaign-analytics/paid-media-analysis.html |
| Applications built on Experience Platform (lists Mix Modeler) | https://experienceleague.adobe.com/en/docs/platform-learn/tutorials/intro-to-platform/native-applications |

### GenStudio for Performance Marketing

| Page | URL |
|---|---|
| User guide home | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/home |
| Get started | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/get-started |
| Provision GenStudio for Performance Marketing | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/product-provisioning |
| User roles and permissions | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/user-roles |
| Configure Brand permissions | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/configure-brand-permissions |
| Concepts | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/intro/concepts |
| Add guidelines | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/add-guidelines |
| Brands | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/guidelines/brands |
| Work with templates | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/use-templates |
| Customize a template | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/templates/customize-template |
| Manage assets and experiences | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/content/manage-assets |
| Reviews and approvals | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/approve/overview |
| Connect a paid media account | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/settings/connect-channel |
| Activate overview | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/overview |
| Activate a Meta ad | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/activation/paid-media-ads/activate-meta-ad |
| Insights overview | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/overview |
| Ads tags overview | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/ad-tags |
| Release notes | https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/release-notes |
| GenStudio for Performance Marketing Insights product page (WebFetch; no Content Analytics mention) | https://business.adobe.com/products/genstudio-for-performance-marketing/insights.html |
| Adobe GenStudio product page (WebFetch) | https://business.adobe.com/products/genstudio.html |

### Content Analytics, CJA and Experience Platform (for connections)

| Page | URL |
|---|---|
| Content Analytics overview | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics |
| Content Analytics guided configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided |
| Content Analytics paid media automatic configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media |
| Content Analytics reporting | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report |
| Adobe Content Analytics product page (WebFetch) | https://business.adobe.com/products/adobe-analytics/content-analytics.html |
| CJA audience publishing overview | https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/audiences-overview |
| CJA create and publish audiences | https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish |
| CJA connections overview | https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/overview |
| Meta Ads source (Experience Platform) | https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/meta-ads |
| Google Ads (V2) source (Experience Platform) | https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/advertising/google-ads |
| Look-alike audiences guide (Experience Platform) | https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/ui/lookalike-audiences |
| Application and Intelligent Services built on Experience Platform | https://experienceleague.adobe.com/en/docs/experience-platform/landing/ecosystem/application-intelligent-services |

## Product lines

### Real-Time CDP Collaboration (`collab`)

`what`: "With Adobe Real-Time CDP Collaboration, you can discover, activate, and measure high-value audiences without relying on third-party cookies." (Collaboration overview)

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| CO01 | Collaboration access and roles setup | one-time | 16 / 24 / 40 | yes | "Your organization's access roles determine what users can see and do in Collaboration." | Quick start guide |
| CO02 | Account, branding and match key setup | one-time | 24 / 40 / 64 | yes | "Define your account's role in Collaboration, provide branding assets, and configure match keys to align audiences across connections." | Quick start guide |
| CO03 | Audience sourcing from cloud data sources | one-time | 24 / 48 / 96 | no | "Cloud-based audience files must follow the required schema outlined in the Audience Specification PDF." | Quick start guide |
| CO04 | Collaborator connections and first projects | one-time | 24 / 40 / 72 | yes | "involves sending or receiving invitations, reviewing and submitting connection settings (such as use cases and credit consumption)" | Quick start guide |
| CO05 | Overlap and measurement reporting enablement | one-time | 16 / 32 / 56 | yes | "Get insight into overlap percentages and the number of overlapping identities between your audiences and those of your collaborators." | Collaboration use cases |
| CO06 | Monthly collaboration operations | monthly | 12 / 20 / 32 | yes | "You can add or remove audiences and update the refresh schedule directly in Collaboration." | Quick start guide |

Default one-time base: 136 hours (184 with CO03). Sourcing from Experience Platform and the Experience Platform destination are in the `rtcdp-collab` connection, since that is where the two products meet. CO03 is for audiences held outside Experience Platform.

Availability: Limited Availability badge on every page; "currently available in the United States, Canada, Australia, New Zealand, and across Europe, the Middle East, and Africa, with global availability coming soon." Requires "An active Real-Time CDP Collaboration license" (quick start). Starter users join free only on invitation from a partner with a Real-Time CDP Prime, Ultimate or Collaboration license, in the same region (Starter overview).

### Mix Modeler, now Marketing Campaign Analytics (`mmm`)

`what`: "Marketing Campaign Analytics is an Adobe Experience Cloud application that measures campaigns and optimizes planning holistically across all channels: paid, earned, and owned." (Marketing Campaign Analytics guide)

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| MM01 | Access, roles and sandbox setup | one-time | 16 / 24 / 40 | yes | "For Marketing Campaign Analytics to function properly, you must set the correct permissions." | Administration |
| MM02 | Marketing data ingestion and schemas | one-time | 60 / 120 / 240 | yes | "Date and granularity are mandatory fields in the underlying schema for all aggregate data ingested as datasets" | Ingest data overview |
| MM03 | Harmonized data, touchpoints and conversions | one-time | 40 / 80 / 140 | yes | "Set up dataset rules to map fields from your aggregate (factor or summary) or experience event datasets to harmonized fields." | Harmonize datasets overview |
| MM04 | Model build, training and validation | one-time | 40 / 80 / 140 | yes | "Retraining and rescoring are an iterative process as new findings and information emerge and adjustments are needed" | Models overview |
| MM05 | Budget plans and team enablement | one-time | 24 / 40 / 72 | yes | "Plans in Marketing Campaign Analytics allow you to allocate budgets by business unit and channel." | Plans overview |
| MM06 | Monthly data refresh, rescoring and plans | monthly | 16 / 24 / 40 | yes | "data may be added to the model which requires you to rescore the model manually." | Models overview |

Default one-time base: 344 hours. MM06 also rests on the Plans overview: "If a model that you have used for your plan is scored on new data, you need to create a new plan".

License notes: the helpx product description (effective Aug 13 2024, still under the Mix Modeler name) says "Privacy and Security Shield must be licensed with" Mix Modeler among other platform applications, "Mix Modeler includes up to 5 Sandboxes", and "It includes 10 Active Models." Check current terms. Full funnel modeling: the Models overview still carries a Limited Testing note, while the Oct 2026 release notes list it as generally available on Oct 29 2026.

### GenStudio for Performance Marketing (`gspm`)

`what`: "GenStudio for Performance Marketing is an application built on Adobe's generative AI platform. It enables marketing teams to create, manage, and optimize campaign content for paid media, email, and display ads." (User guide home)

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| GS01 | Provisioning, roles and Brands permissions | one-time | 16 / 24 / 40 | yes | "System administrators must complete additional set-up tasks before collaborators can edit or create Brands." | Get started |
| GS02 | Brand, product and persona guidelines | one-time | 32 / 56 / 96 | yes | "Content editors and collaborators cannot begin their work until the foundational elements of your organization's brand identity are established." | Get started |
| GS03 | Channel templates and approved assets | one-time | 40 / 80 / 160 | yes | "Adapt your HTML template using the Handlebars templating language." | Work with templates |
| GS04 | Paid media connections and activation setup | one-time | 24 / 32 / 56 | yes | "A GenStudio system manager or editor must connect the ad account for each paid ad channel before you can activate" | Activate overview |
| GS05 | Editor training and first campaign launch | one-time | 16 / 32 / 56 | yes | "the quality and success of generated content partially depend on the quality of the brand guidelines your organization has uploaded" | User roles and permissions |
| GS06 | Monthly content refresh from Insights | monthly | 12 / 20 / 32 | yes | "Find content that is not performing well and use the integrated generative AI to create variations immediately" | Insights overview |

Default one-time base: 224 hours. Availability from the release notes: generation in 12 GA languages plus 5 in Beta, translation into 40+ languages, text features for English ads only. Insights covers Meta, LinkedIn, TikTok, DV360 and Innovid; Insights 2.0 covers only Meta and LinkedIn. Activation to Meta needs the campaign and ad set to exist already: "GenStudio for Performance Marketing does not currently create campaigns or ad sets."

## Connections

### rtcdp-collab: documented, with services

- **How:** Collaboration links a Real-Time CDP sandbox as a data connection to source its audiences and conversion datasets, and its Experience Platform destination sends collaborator audiences back to Audience Portal. Source: quick start, "Use Collaboration to link a sandbox that contains audiences".
- **Gain:** Your audiences meet partner audiences.
- **Flows:**
  - rtcdp to collab: audiences from a linked sandbox, with match keys, consent and governance applied (Source and manage audiences: "Source fields are identity namespaces and attributes from Experience Platform.").
  - collab to rtcdp: collaborator audiences land in Audience Portal with Collaboration as their origin (Experience Platform destination: "it will be available in Audience Portal in Experience Platform with Real-Time CDP Collaboration as the origin").

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD01 | Experience Platform audience sourcing | one-time | 24 / 40 / 72 | yes | "Any settings that you configure for an Experience Platform data connection are applied to all audiences sourced from that connection." | Source and manage audiences |
| XD02 | Experience Platform destination setup | one-time | 16 / 32 / 56 | yes | "You must configure Experience Platform as a destination before your collaborator activates an audience." | Configure Experience Platform as a destination |
| XD03 | Conversion data for Collaboration measurement | one-time | 24 / 40 / 72 | no | "You can also choose to enrich your event dataset with attributes from Real-Time Customer Profile by mapping join keys" | Add and manage measurement data |

XD03 is off by default because the quick start calls measurement optional; attribution reports need it. That page also says "At this time, Adobe Experience Platform is the only supported data source."

### rtcdp-mmm: documented, with services

- **How:** Mix Modeler is built on Experience Platform and models the event datasets ingested there ("Customers can use any kind of data that is ingested into Experience Platform as datasets", Ingest data overview), and Adobe's use case turns its touchpoint scores into lookalikes in Real-Time CDP (use cases).
- **Gain:** Spend insight becomes new audiences.
- **Flows:**
  - rtcdp to mmm: event datasets already in Experience Platform, used as touchpoints and conversions (Ingest data overview).
  - mmm to rtcdp: top consumer segments from touchpoint scores, activated as lookalikes (use cases).

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD04 | Lookalike audiences from MMM top segments | one-time | 24 / 40 / 72 | yes | "Create and activate lookalikes to top consumer segments using Real-Time Customer Data Platform." | Marketing Campaign Analytics use cases |
| XD05 | Real-Time CDP conversion data for MMM | one-time | 16 / 24 / 48 | no | "Ensure you have set up identities properly for each of the event datasets." | Harmonize datasets overview |

Look-alike limits (Look-alike audiences guide): "Real-Time CDP Prime customers are entitled to 5 active Look-alike audiences in production sandboxes", Ultimate 20; the base audience "must be created within Experience Platform" on the default merge policy.

### rtcdp-ca: documented, with services (through CJA)

- **How:** Content Analytics reports in CJA, so audiences built from content engagement are published through CJA audience publishing to Real-Time Customer Profile, where Real-Time CDP activates them.
- **Sources:** Content Analytics product page (WebFetch): "Create activation-ready audiences from content engagement and immediately share them across other Adobe products." CJA audience publishing overview: "You can create and publish audiences discovered in Customer Journey Analytics to Real-Time Customer Profile in Adobe Experience Platform for customer targeting and personalization."
- **Gain:** Content engagement becomes audiences.
- **Flows:** ca to rtcdp only: audiences built from content engagement, published to Real-Time Customer Profile (`needs: ["cja"]`). No documented flow the other way.

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD06 | Content engagement audiences for activation | one-time | 16 / 32 / 56 | no | "Create activation-ready audiences from content engagement and immediately share them across other Adobe products." | Content Analytics product page (WebFetch) |

XD06 carries `needs: ["cja"]` and is off by default, because it is unclear whether a Content Analytics license without CJA includes audience publishing.

### collab-mmm: documented on a product page only, no services

- **How:** Adobe's Collaboration product page says campaign performance data can be exported to measurement tools including Mix Modeler; Experience League does not describe the export.
- **Quote (WebFetch):** "Export campaign performance data to measurement partners and tools, including Adobe Customer Journey Analytics" and "Adobe Mix Modeler for deeper analysis and media planning." The two fragments are joined by "and" in one bullet under "Understand and improve campaign performance." The bullet ends with an asterisk; the page's only asterisk footnote reads "Coming soon".
- **Gain:** Clean room results inform media plans.
- **Flow:** collab to mmm: campaign performance data exported for deeper analysis and media planning.
- **No services:** no Experience League page describes the export, so none are inferred. Consider hiding this line until Adobe documents it.

### collab-cja: documented on a product page only, no services

- Same bullet and caveat as collab-mmm.
- **Gain:** Partner campaign results beside journeys.
- **Flow:** collab to cja: campaign performance data exported for analysis next to customer journeys.
- **Also checked:** the Collaboration Measure, measurement data and release notes pages have no export or CJA mention; the Oct 2025 Collaboration blog post has no CJA or Mix Modeler mention.

### mmm-cja: documented, with services

- **How:** Mix Modeler writes model and touchpoint scores to Experience Platform datasets that a CJA connection can add, and can reuse the client's Adobe Analytics or CJA event data.
- **Sources:**
  - Use scoring data: "As part of scoring a model, scoring data is persisted within a dataset in Experience Platform."
  - Workflow: "Marketing Campaign Analytics can produce output data for its own interface but also for other solutions, like Customer Journey Analytics".
  - CJA connections overview: "You can combine multiple Experience Platform datasets into a single connection."
  - Marketing Campaign Analytics product page (WebFetch): "Connect campaign reporting and macro-level insights from Marketing Campaign Analytics with rich behavioral data and outcomes in Customer Journey Analytics".
- **Gain:** Incrementality inside journey analysis.
- **Flows:**
  - mmm to cja: aggregate and event-level touchpoint scores saved as Experience Platform datasets (Use scoring data).
  - cja to mmm: existing Adobe Analytics or CJA event data, reused to fast-track modeling (use cases).

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD07 | Touchpoint scores in CJA connections | one-time | 24 / 40 / 72 | yes | "Export incremental touchpoint scores into Customer Journey Analytics or external BI tools." | Use cases |
| XD08 | Incrementality dashboards in Workspace | one-time | 24 / 40 / 64 | yes | "Perform granular analysis and build advanced dashboards using touchpoint scores." | Use cases |
| XD09 | CJA event data reuse in Mix Modeler | one-time | 16 / 32 / 56 | no | "Apply existing investments in Adobe Analytics or Customer Journey Analytics to fast-track deployment." | Use cases |

Event-level scores exist only when multi-touch attribution is turned on for the model (Use scoring data).

### mmm-ca: documented, with services

- **How:** both read paid media data that Experience Platform paid media connectors ingest, and Adobe positions channel and campaign insight from Marketing Campaign Analytics alongside attribute insight from Content Analytics.
- **Sources (WebFetch):**
  - Marketing Campaign Analytics product page: "Align channel- and campaign-level insight from Marketing Campaign Analytics with content and attribute-level insight in Adobe Content Analytics to improve proactive paid media optimizations."
  - Paid media analysis page: "Leverage ingested paid media data in other Adobe Analytics products for additional insights, such as Adobe Content Analytics or Adobe Customer Journey Analytics".
  - Content Analytics product page (WebFetch) says the same from its side.
- **Corroborated on Experience League:**
  - Meta Ads source: "Use a single, governed source for Meta data across applications such as Adobe Mix Modeler, Customer Journey Analytics, and GenStudio for Performance Marketing."
  - Content Analytics paid media: "Paid media requires the configuration of Experience Platform source connectors to your ad publishers."
- **Gain:** Channel ROI meets creative attributes.
- **Flows:**
  - mmm to ca: paid media data ingested for campaign modeling, reused for content insight (paid media analysis page).
  - ca to mmm: creative attribute findings read next to channel and campaign incrementality (product page).

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD10 | Shared paid media data for MMM and CA | one-time | 16 / 32 / 64 | yes | "Adobe Marketing Campaign Analytics connects to paid media data via Adobe Experience Platform paid media connectors and ETL partners" | Paid media analysis (WebFetch) |
| XD11 | Monthly channel and creative review | monthly | 8 / 12 / 20 | no | "Align channel- and campaign-level insight from Marketing Campaign Analytics with content and attribute-level insight" | Product page (WebFetch) |

### cja-ca: documented, with services

- **How:** Content Analytics is configured from CJA's Data Management menu. It adds content events and attributes to a chosen CJA connection and data views, where they join behavioral and conversion data in Workspace.
- **Sources:**
  - Guided configuration: "Select Data Management > Content Analytics Configuration from the main menu in Customer Journey Analytics."
  - Overview: "You can use the Content Analytics data, together with behavioral data and other lookup data, in a Customer Journey Analytics setup".
- **Gain:** Content tied to journeys and conversions.
- **Flows:**
  - ca to cja: content events and asset and experience attributes added to connection and data views.
  - cja to ca: behavioral and conversion data, so content can be tied to outcomes and ROI (both from the overview).

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD12 | Content Analytics in existing data views | one-time | 16 / 24 / 48 | yes | "a Selected data views dialog that informs you about implications of including Content Analytics for the selected data views" | Guided configuration |
| XD13 | Content journey and conversion analysis | one-time | 24 / 40 / 72 | yes | "when combined with all other data available in Experience Platform, you can gain additional insights on your content journeys" | Overview |

These lines stay on the CJA side and were checked against the other helper's Content Analytics lines in `portal_omnichannel_b2b.json`:
- Tracking-key mapping between paid media and site conversions is left to CA04 (paid media channel setup), so no cja-ca line repeats it. A draft line for it was dropped to avoid counting the hours twice. Its quote, from the paid media page, still backs XD14: "The correlation between your experience event data and paid media data requires customer-specific tracking-key mapping and reporting configuration."
- XD12 covers only the review of the client's existing data views, which CA02's guided configuration run does not.
- XD13 extends the template that CA05 sets up.

Caveat: the Content Analytics product page answers "Is Adobe Customer Journey Analytics required?" with "No."

### ca-gspm: documented, with services

- **How:** GenStudio for Performance Marketing creates and activates ads to channels such as Meta, and Content Analytics reads those channels' ad data through Experience Platform paid media connectors to tie the creative to outcomes.
- **Sources:**
  - Meta Ads source (Experience League): "Feeds this data to GenStudio / Content Analytics to: evaluate how different creatives, formats, or messages perform in Meta and correlate Meta performance with content variants created or managed in Adobe Experience Manager or GenStudio."
  - Adobe GenStudio product page (WebFetch): "With Adobe Content Analytics and Adobe GenStudio for Performance Marketing, teams can improve creative performance and conversions by understanding what's working down to the attribute level."
  - Content Analytics product page FAQ (WebFetch): "GenStudio for Performance Marketing is for creating, activating, and optimizing paid media content at scale." It continues: Content Analytics "is for measuring how that content performs and tying it to business outcomes".
- **Gain:** Create, measure, then create better.
- **Flows:**
  - gspm to ca: ads activated to Meta and other channels, ingested back as paid media experiences (Meta Ads source).
  - ca to gspm: attribute-level findings on what works, used to brief new variants (GenStudio product page).

| Id | Line | Unit | Low / base / high | Default | Quote | Page |
|---|---|---|---|---|---|---|
| XD14 | Tracking keys on GenStudio-activated ads | one-time | 16 / 24 / 48 | yes | "Destination URL, URL Parameters, Tracking ID (used as the Meta ad name)" | Activate a Meta ad |
| XD15 | Monthly attribute insights to new variants | monthly | 8 / 16 / 24 | yes | "teams can improve creative performance and conversions by understanding what's working down to the attribute level" | Adobe GenStudio product page (WebFetch) |

XD14 pairs GenStudio's activation fields with Content Analytics' tracking-key requirement (quoted under cja-ca). It applies the convention on the GenStudio side, while CA04 maps the keys in Content Analytics. Today the overlap is mainly Meta: Content Analytics paid media covers Meta and Google (Pinterest, Snapchat, TikTok in Limited Testing), while GenStudio activates to Meta, LinkedIn, Campaign Manager 360 and more. The paid media channel "is not available for Customer Journey Analytics and Experience Platform deployments on AWS."

## Not documented

| Pair | What was searched |
|---|---|
| collab and ca | Collaboration overview, use cases, quick start, sourcing, activation, measurement and release notes pages (no Content Analytics mention); Collaboration product page (no Content Analytics); Content Analytics overview, guided configuration, paid media and reporting pages and product page (no Collaboration mention); searches 6, 12, 13 and 28. |

## Other things noticed

- Collaboration has a Beta Expand tab that builds expansion audiences from a collaborator's population; it is not used in these lines.
- Collaboration says "full reporting functionality may require backend enablement", and cloud destinations are set up by Adobe on request; self-serve destinations are Experience Platform only.
- Content Analytics: featurization is English only, it is "not a HIPAA-Ready service", and Privacy and Security Shield labeling does not cover its experiences and assets.
- The Google Ads (V2) source page says "The Google Ads source is available as part of the Customer Journey Analytics SKU." The Meta Ads source was listed as Beta in search results, and its page says it feeds Mix Modeler "via Snowflake", which is unclear.
- GenStudio's own Insights also reports on creative attributes for paid social; Adobe's Content Analytics FAQ separates the two roles as quoted above.
