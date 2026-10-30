# CJA hub research: Real-Time CDP, Journey Optimizer, Target and CJA (Oct 30 2026)

Research for the architecture canvas (phase 2 in `sow/CANVAS_CONCEPT.md`): service lines for four more products and the three connections that feed CJA, each tied to an Adobe page and a quote from it. The data is in `cja_hub.json` next to this file. Since Oct 30 these lines are on the Build canvas prototype (`sow/canvas/`), not in the live tool. The research itself is unchanged.

## Summary

| Group | Lines | On by default | Base hours with default lines |
|---|---|---|---|
| Real-Time CDP (RT) | 6 | 6 | 408 one-time, 32 a month |
| Journey Optimizer (JO) | 6 | 5 (IP warmup optional) | 328 one-time, 40 a month |
| Target (TG) | 5 | 4 (Recommendations optional) | 232 one-time, 40 a month |
| Customer Journey Analytics (CJ) | 6 | 0 (client may already own CJA) | 0; 416 one-time if every line is on |
| Real-Time CDP and CJA (RC) | 2 | 2 | 80 one-time |
| Journey Optimizer and CJA (JC) | 2 | 2 | 88 one-time |
| Target and CJA (TC) | 3 | 2 (A4T transition optional) | 72 one-time |

- 10 candidate integrations for later, each with a source.
- Check on Brand Visibility and Sites Optimizer: **no**. Adobe markets them together, but no Adobe page documents a direct integration between the two products. Details below.
- Hours are our own estimates for a mid-market client. Adobe publishes no hours for any of this work.

## How the lines were built

- Every line maps to a task Adobe's docs describe customers or implementers doing (getting-started paths by role, the Experience Platform end-to-end workflow, the CJA quick start, the Target welcome kit and developer guide).
- Experience League pages were downloaded on Oct 30 2026 and every quote in the JSON was checked word for word against the page text with a script (whitespace and curly quotes normalized). All quotes are 20 words or fewer.
- business.adobe.com and adobe.com PDFs refused direct downloads from the research machine, so those were read through a fetch tool and quoted as it returned them. They back only the Brand Concierge candidates and the Brand Visibility and Sites Optimizer check, never a service line.
- Hours follow the tool's catalog: connection lines 24 to 48 at base here, product lines 32 to 160 at base, monthly lines 32 to 40 at base. Low is roughly 0.5 to 0.6 of base and high roughly 2 times base, as in the existing catalog.
- Default on: core whenever the product or connection is added. All CJA product lines are off, since the client may already own CJA. The existing CJA line C06, Audiences that act on the data, is not repeated.

## Searches run

1. Experience League Real-Time CDP implementation guide get started steps
2. Experience League Journey Optimizer get started configuration steps administrators
3. Experience League Customer Journey Analytics implementation guide steps connection data view
4. Experience League Target reporting in Customer Journey Analytics A4T for CJA
5. "LLM Optimizer" "Sites Optimizer" integration Experience League
6. Adobe Brand Visibility Sites Optimizer opportunities shared integration docs
7. Customer Journey Analytics Real-Time CDP audiences import Experience Platform audiences into CJA
8. Experience League Customer Journey Analytics stitching enable in connection field-based graph-based
9. "Sites Optimizer" site:experienceleague.adobe.com brand-visibility
10. "LLM Optimizer" "Sites Optimizer" same opportunities deploy AEM "Experience Success"
11. Adobe blog LLM Optimizer and AEM Sites Optimizer together SEO GEO
12. experienceleague.adobe.com/en/docs/llm-optimizer "Sites Optimizer"
13. Brand Visibility "deploy" optimizations "Experience Manager Sites" recommendations author Experience League
14. Experience League Target Developer Guide implement Target using Adobe Experience Platform Web SDK steps
15. Experience League Adobe Target Recommendations plan and implement entity feed criteria design
16. Experience League Adobe Target activities overview A/B test experience targeting automated personalization guide
17. Customer Journey Analytics "Real-Time CDP" profile attributes profile snapshot dataset connection Experience League
18. Experience League "Analyze Experience Platform audiences in Customer Journey Analytics" audience analysis use cases
19. aem.live Edge Delivery Services Adobe Target integration martech plugin Web SDK
20. Experience League Customer Journey Analytics Content Analytics AEM Sites Edge Delivery configure
21. Experience League Brand Concierge Real-Time Customer Profile Experience Platform data Journey Optimizer integration
22. Experience League Coworker Real-Time CDP Journey Optimizer agents audience journey Experience Platform
23. Experience League Adobe Commerce data Customer Journey Analytics connection data view commerce events dashboard
24. Experience League Customer Journey Analytics intelligent alerts schedule projects share recurring

## Pages read

### Real-Time CDP and Experience Platform

- [Real-Time Customer Data Platform documentation](https://experienceleague.adobe.com/en/docs/real-time-customer-data-platform) (docs landing)
- [Adobe Real-Time CDP Documentation](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/home) (guide home; cited for RT05)
- [Real-Time Customer Data Platform overview](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-intro/overview) (product "what")
- [Getting started with Real-Time Customer Data Platform](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-intro/get-started) (sample implementation; read, not cited)
- [Adobe Experience Platform end-to-end example workflow](https://experienceleague.adobe.com/en/docs/experience-platform/landing/getting-started/end-to-end-tutorial) (RT06)
- [Getting Started with Adobe Experience Platform for Data Architects and Data Engineers](https://experienceleague.adobe.com/en/docs/platform-learn/getting-started-for-data-architects-and-data-engineers/overview) (shared foundation note)
- [Best practices for data modeling](https://experienceleague.adobe.com/en/docs/experience-platform/xdm/schema/best-practices) (RT01)
- [Identity Service overview](https://experienceleague.adobe.com/en/docs/experience-platform/identity/home)
- [Source connectors overview](https://experienceleague.adobe.com/en/docs/experience-platform/sources/home) (RT02)
- [Real-Time Customer Profile overview](https://experienceleague.adobe.com/en/docs/experience-platform/profile/home)
- [Merge policies overview](https://experienceleague.adobe.com/en/docs/experience-platform/profile/merge-policies/overview) (RT03)
- [Segmentation Service overview](https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/home)
- [Activation overview](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/ui/activate/activation-overview) (RT04)
- [Data Governance overview](https://experienceleague.adobe.com/en/docs/experience-platform/data-governance/home)
- [Access control overview](https://experienceleague.adobe.com/en/docs/experience-platform/access-control/home)
- [Sandboxes overview](https://experienceleague.adobe.com/en/docs/experience-platform/sandbox/home)
- [Dataflows overview](https://experienceleague.adobe.com/en/docs/experience-platform/dataflows/home)
- [Data collection overview](https://experienceleague.adobe.com/en/docs/experience-platform/collection/home)

### Journey Optimizer

- [Get started with Adobe Journey Optimizer](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/get-started-landing-page)
- [Understanding Journey Optimizer](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/essentials/understanding-ajo) (product "what")
- [Get started for system administrators](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/administrator) (JO01)
- [Get started for data engineer](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/data-engineer) (JO02)
- [Get started for Marketers](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/marketer) (JO04, JO06)
- [Get started with channels configuration](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configuration/get-started-configuration)
- [Subdomain delegation in Journey Optimizer](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configuration/delegate-subdomains/about-subdomain-delegation)
- [Get started with IP warmup plans](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configuration/implement-ip-warmup-plan/ip-warmup-gs) (JO03)
- [Get started with deliverability](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/monitor/deliverability/deliverability)
- [Create your first journey](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/orchestrate-journeys/create-journey/journey-gs) (JO05)
- [Get started with all time report](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/reporting/channel-report/report-gs-cja) (Journey Optimizer reporting runs on CJA)

### Target

- [Adobe Target Business Practitioner Guide](https://experienceleague.adobe.com/en/docs/target/using/target-home)
- [Introduction to Target](https://experienceleague.adobe.com/en/docs/target/using/introduction/intro) (product "what")
- [Implement Target](https://experienceleague.adobe.com/en/docs/target/using/implement-target/implementing-target) (points to the developer guide)
- Target welcome kit, chapters [1](https://experienceleague.adobe.com/en/docs/target/using/introduction/welcome/target-welcome-kit-1) to [9](https://experienceleague.adobe.com/en/docs/target/using/introduction/welcome/target-welcome-kit-9); [Chapter 3: Develop your testing and personalization ideas](https://experienceleague.adobe.com/en/docs/target/using/introduction/welcome/target-welcome-kit-3) is cited for TG03 and TG05, chapters 2, 7 and 8 were read for activity types, first activities and results readouts
- [Adobe Target Developer Guide](https://experienceleague.adobe.com/en/docs/target-dev/developer/overview)
- [Adobe Experience Platform Web SDK (Target Developer Guide)](https://experienceleague.adobe.com/en/docs/target-dev/developer/client-side/aep/aep-web-sdk-overview)
- [Set up Adobe Target with Platform Web SDK](https://experienceleague.adobe.com/en/docs/platform-learn/implement-web-sdk/applications-setup/setup-target) (TG01)
- [Prepare to implement Target](https://experienceleague.adobe.com/en/docs/target-dev/developer/implementation/before-implement/prepare-to-implement-target) (read, not cited: Adobe's pre-implementation questionnaires, written for Adobe-led projects)
- [Before you implement](https://experienceleague.adobe.com/en/docs/target-dev/developer/implementation/before-implement/considerations-before-you-implement-target)
- [Plan and implement Recommendations (Target guide)](https://experienceleague.adobe.com/en/docs/target/using/recommendations/plan-implement) and [Plan and implement Recommendations (developer guide)](https://experienceleague.adobe.com/en/docs/target-dev/developer/recommendations) (TG04)
- [Create audiences](https://experienceleague.adobe.com/en/docs/target/using/audiences/create-audiences/audiences)
- [Administer Target overview](https://experienceleague.adobe.com/en/docs/target/using/administer/administrating-target)
- [Enterprise user permissions](https://experienceleague.adobe.com/en/docs/target/using/administer/manage-users/enterprise/property-channel)
- [Configure enterprise permissions](https://experienceleague.adobe.com/en/docs/target/using/administer/manage-users/enterprise/properties-overview) (TG02)
- [Target reporting in Adobe Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/target/using/integrate/cja/target-reporting-in-cja) (Target and CJA connection, TC01, TC02)
- [Use offer decisions](https://experienceleague.adobe.com/en/docs/target/using/integrate/ajo/offer-decision) (candidate)

### Customer Journey Analytics

- [Customer Journey Analytics overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-overview) (product "what")
- [Quick start guide](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-getting-started) (CJ01, CJ02, CJ04, CJ05)
- [Upgrade from Adobe Analytics to Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations) (CJ03)
- [Perform advanced analysis](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/perform-adv-analysis) (CJ06)
- [Stitching overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/overview), [Graph-based stitching](https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/gbs) and [Request stitching](https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/use-stitching) (supporting CJ02 and RC02)
- [Create or edit a connection](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/create-connection) and [Create or edit a data view](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/create-dataview)
- [Integrate Adobe solutions with Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/overview)
- [Integrate Journey Optimizer](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/ajo) (Journey Optimizer and CJA connection, JC01)
- [Target reporting](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/at) (TC03)
- [Audience analysis overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/audience-analysis-overview) (Real-Time CDP and CJA connection, RC01), [Configure audience analysis](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/audience-analysis-configure), [Analyze Experience Platform audiences in Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/analyze-audiences), [Audience Analysis use cases](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/audience-analysis-use-cases), and the tutorial [Get started with Audience Analysis](https://experienceleague.adobe.com/en/docs/customer-journey-analytics-learn/tutorials/connections/get-started-with-audience-analysis)
- [Create and publish audiences](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish) (the existing C06 line)
- [Consistency of metrics and audience membership](https://experienceleague.adobe.com/en/docs/analytics-platform/using/troubleshooting/consistency-rcdp-cja) (RC02)
- [Ingest and use Experience Platform audiences](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-ingestion/ingest-aep-segments) (Adobe's older interim method, before audience analysis)
- [Customer Journey Analytics landing page](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/landing) and [Content Analytics overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics) (read, not used)
- Blueprints: [Adobe Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/architecture-diagrams/customer-insights/cja) and [Adobe Customer Journey Analytics & Adobe Journey Optimizer integration](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/architecture-diagrams/customer-insights/cja-ajo-integration) (JC02 and a candidate)

### Candidates

- [Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection)
- [Data Connection Introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview), [Use Adobe Journey Optimizer to send an abandoned cart email](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo), [Create an audience in Real-Time CDP using Commerce event data](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/create-audience)
- [Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration) (aem.live) and the tutorial [AEM Edge Delivery Services MarTech plugin](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/assetmgmt/assetm1/ex5)
- [Adobe CX Enterprise Coworker overview](https://experienceleague.adobe.com/en/docs/coworker/content/home) and [Coworker Unlocked: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26)
- [Adobe Brand Concierge documentation](https://experienceleague.adobe.com/en/docs/brand-concierge/content/home) and [Integrations for CX and Commerce, Adobe Brand Concierge](https://business.adobe.com/products/brand-concierge/integrations.html) (read through the fetch tool)

### Brand Visibility and Sites Optimizer (the check)

- Brand Visibility: [home](https://experienceleague.adobe.com/en/docs/brand-visibility/using/home), [overview](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/overview), [What's new](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/whats-new), [Quick Start](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/quick-start), [best practices](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/best-practices), [Dashboards overview](https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/dashboards-overview), [Optimization opportunities](https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/opportunities/opportunities-overview), [Optimize at Edge](https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/overview), [Brand Visibility University](https://experienceleague.adobe.com/en/docs/brand-visibility-learn/tutorials/overview), [release notes](https://abv.adobe.com/articles/release-notes), [Adobe news, June 17 2026](https://news.adobe.com/news/2026/06/introducing-adobe-brand-visibility)
- Sites Optimizer: [AEM Sites Optimizer home](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/home), [documentation overview](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/overview), [basics](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/basics), [opportunities](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/overview), [opportunity types](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/opportunity-types/overview), [settings](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings), [release notes](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/release-notes), [Deploying to author](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/deploying-to-author)
- Marketing together: [Win Visibility in the AI Era with Adobe LLM Optimizer & Sites Optimizer](https://experienceleague.adobe.com/en/docs/ultimate-success/ultimate-success-webinar-library/hidden/ai-visibility), [From SEO to GEO: Optimizing AEM Sites for Web Performance and AI Discovery](https://experienceleague.adobe.com/en/docs/ultimate-success/ultimate-success-webinar-library/hidden/optimize-aem-for-geo)
- Through the fetch tool: [Brand visibility solutions page](https://business.adobe.com/solutions/brand-visibility.html), [Brand Visibility product page](https://business.adobe.com/products/brand-visibility.html), [Sites Optimizer product page](https://business.adobe.com/products/experience-manager/sites/optimizer.html), [Brand Visibility security overview](https://www.adobe.com/cc-shared/assets/pdf/trust-center/ungated/whitepapers/experience-cloud/adobe-brand-visibility-security-overview.pdf), [Sites Optimizer security overview](https://www.adobe.com/cc-shared/assets/pdf/trust-center/ungated/whitepapers/experience-cloud/adobe-aem-sites-optimizer-security-overview.pdf)
- Community, not docs: [Why we created LLM Optimizer](https://experienceleaguecommunities.adobe.com/adobe-experience-manager-sites-8/why-we-created-llm-optimizer-227991) (an Adobe post; says LLM Optimizer doesn't require AEM; nothing on Sites Optimizer)

### Pages that failed or don't exist

- Guessed paths that returned 404: `experience-platform/rtcdp/overview`, `target/using/administer/permissions/properties-overview`, `journey-optimizer/using/audience/about-audiences`, `commerce/data-connection/ajo/overview`, `commerce/data-connection/cja`, and two guessed CJA scheduling and alerts paths. The right pages were found by search where they exist.
- The old CJA with Real-Time CDP blueprint URL redirects to a 404; the blueprint now lives at `blueprints-learn/architecture/architecture-diagrams/customer-insights/cja`.
- Commerce's "Use LLM Optimizer with Commerce" page shows up in search only in localized paths; the English `commerce/llmo-integration/overview` path returned 404 on Oct 30.
- Target welcome kit chapter 10 doesn't exist (the kit has 9 chapters). Experience League's table-of-contents API returned 502.

## Line by line: page and quote

### Real-Time CDP (rtcdp)

What it is, in Adobe's words ([overview](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/intro/rtcdp-intro/overview)): "helps companies bring together known and anonymous data from multiple enterprise sources in order to create customer profiles".

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| RT01 | Data model, schema and identity design | one-time | 40 / 80 / 160 | yes | [Best practices for data modeling](https://experienceleague.adobe.com/en/docs/experience-platform/xdm/schema/best-practices) | "it is important to follow best practices for data modeling when designing your schemas" |
| RT02 | Data sources and ingestion setup | one-time | 80 / 160 / 320 | yes | [Source connectors overview](https://experienceleague.adobe.com/en/docs/experience-platform/sources/home) | "You can ingest data from a variety of sources such as Adobe applications, cloud-based storages, databases, and many others." |
| RT03 | Profile and merge policy configuration | one-time | 24 / 40 / 80 | yes | [Merge policies overview](https://experienceleague.adobe.com/en/docs/experience-platform/profile/merge-policies/overview) | "merge policies are the rules that Experience Platform uses to determine how data will be prioritized" |
| RT04 | Audience build and destination activation | one-time | 40 / 80 / 160 | yes | [Activation overview](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/ui/activate/activation-overview) | "After you configure your destination, you can activate audiences in multiple ways" |
| RT05 | Governance, access and sandbox setup | one-time | 24 / 48 / 96 | yes | [Adobe Real-Time CDP Documentation](https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/home) | "assist your team with the right permissions, access controls, and sandbox configurations" |
| RT06 | Monthly audience and dataflow operations | monthly | 16 / 32 / 56 | yes | [Adobe Experience Platform end-to-end example workflow](https://experienceleague.adobe.com/en/docs/experience-platform/landing/getting-started/end-to-end-tutorial) | "Experience Platform allows you to track how data is being processed through the use of dataflows" |

Also on the pages: the RT-CDP guide home names governance as a core pillar ("Know that you are managing data while staying compliant with various regulations, restrictions, and policies applicable to data use"), and the Sources overview gives RT06 its urgency: "Source ingestion dataflows that fail continuously for 30 days will automatically be disabled."

### Journey Optimizer (ajo)

What it is ([Understanding Journey Optimizer](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/essentials/understanding-ajo)): "building on Adobe Experience Platform to connect customer data, content creation, and journey orchestration".

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| JO01 | Access, sandbox and channel setup | one-time | 32 / 64 / 120 | yes | [Get started for system administrators](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/administrator) | "Define all the technical parameters required for email, mobile messages, push notifications, web push, direct mail, and other channels" |
| JO02 | Journey events, data sources and actions | one-time | 40 / 80 / 160 | yes | [Get started for data engineer](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/data-engineer) | "to be able to send messages in journeys, you must configure Data Sources, Events and Actions" |
| JO03 | IP warmup plan execution | one-time | 16 / 32 / 64 | no | [Get started with IP warmup plans](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configuration/implement-ip-warmup-plan/ip-warmup-gs) | "To avoid being marked as spam, you can progressively increase the volume sent using the IP warmup plan feature." |
| JO04 | Content templates and personalization | one-time | 40 / 64 / 120 | yes | [Get started for Marketers](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/marketer) | "Create reusable content templates and fragments to maintain brand consistency." |
| JO05 | First journeys and campaigns | one-time | 60 / 120 / 240 | yes | [Create your first journey](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/orchestrate-journeys/create-journey/journey-gs) | "Build multi-step customer journeys to initiate a sequence of interactions, offers, and messages across channels in real time." |
| JO06 | Monthly journey operations and optimization | monthly | 24 / 40 / 72 | yes | [Get started for Marketers](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/by-role/marketer) | "Monitor and optimize. Track performance and improve results over time" |

Notes on the pages: Adobe's recommended subdomain method is full delegation, where "Adobe will then configure all DNS records required for Adobe Journey Optimizer", so JO01's hours are for channel setup, not DNS work. IP warmup "can only be enabled on production-type sandboxes", and the warmup sheet is one you "upload the Excel sheet prepared with the help of your deliverability consultant", so JO03 is running the plan, not writing it.

### Target (target)

What it is ([Introduction to Target](https://experienceleague.adobe.com/en/docs/target/using/introduction/intro)): "offers comprehensive tools to personalize customer experiences across web, mobile sites, apps, social media, and other digital channels".

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| TG01 | Target implementation with Web SDK | one-time | 60 / 120 / 240 | yes | [Set up Adobe Target with Platform Web SDK](https://experienceleague.adobe.com/en/docs/platform-learn/implement-web-sdk/applications-setup/setup-target) | "Configure a datastream to enable Target functionality" |
| TG02 | Users, workspaces and audiences setup | one-time | 16 / 32 / 56 | yes | [Configure enterprise permissions](https://experienceleague.adobe.com/en/docs/target/using/administer/manage-users/enterprise/properties-overview) | "create workspaces, user groups, and properties; update your Target implementation to include the at_property parameter" |
| TG03 | Testing roadmap and first activities | one-time | 40 / 80 / 160 | yes | [Chapter 3: Develop your testing and personalization ideas](https://experienceleague.adobe.com/en/docs/target/using/introduction/welcome/target-welcome-kit-3) | "Rank and schedule activities based on business alignment, level of effort, and potential impact." |
| TG04 | Recommendations catalog and setup | one-time | 60 / 120 / 240 | no | [Plan and implement Recommendations](https://experienceleague.adobe.com/en/docs/target-dev/developer/recommendations) | "Set up your Recommendations catalog of products or content that you want to recommend to your users." |
| TG05 | Monthly test design, build and analysis | monthly | 24 / 40 / 72 | yes | [Chapter 3: Develop your testing and personalization ideas](https://experienceleague.adobe.com/en/docs/target/using/introduction/welcome/target-welcome-kit-3) | "establish a formal, repeatable process for coming up with ideas for testing and personalization activities" |

Notes on the pages: "Properties and Permissions functionality is available as part of the Target Premium solution." Recommendations, Auto-Target and Automated Personalization are Target Premium features too, which is why TG04 is optional and TG02 shrinks for a Target Standard client.

### Customer Journey Analytics (cja)

What it is ([overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-overview)): "Adobe's next-generation Analytics solution that lets you use the power of Analysis Workspace with data from Adobe Experience Platform".

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| CJ01 | CJA data preparation in Experience Platform | one-time | 40 / 80 / 160 | no | [Quick start guide](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-getting-started) | "Use Adobe Experience Data Model (XDM) to standardize customer experience data and define schemas" |
| CJ02 | Connections, data views and stitching | one-time | 40 / 80 / 160 | no | [Quick start guide](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-getting-started) | "A connection lets you integrate datasets from Adobe Experience Platform into Workspace." |
| CJ03 | Adobe Analytics upgrade to CJA | one-time | 80 / 160 / 320 | no | [Upgrade from Adobe Analytics to Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations) | "a new implementation of the Experience Platform Web SDK, which is the preferred data collection method" |
| CJ04 | Workspace projects and dashboards | one-time | 40 / 64 / 120 | no | [Quick start guide](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-getting-started) | "analyze the data you have brought in using the power and flexibility of Analysis Workspace" |
| CJ05 | User onboarding and training | one-time | 16 / 32 / 64 | no | [Quick start guide](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-b2c-overview/cja-getting-started) | "give your users ample time (3 - 6 months) to become familiar with the key differences" |
| CJ06 | Monthly journey analysis and insights | monthly | 16 / 32 / 64 | no | [Perform advanced analysis](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/perform-adv-analysis) | "Advanced analysis leverages features like Flow diagrams, Attribution, Fallout diagrams, and dimension breakdowns." |

CJ02's stitching part rests on the stitching pages: "Request stitching through Adobe is no longer required and this method is deprecated." Stitching is now turned on in the Connections UI. Adobe's stitching page says field-based stitching needs CJA Select or higher and graph-based stitching needs "Customer Journey Analytics Prime package or higher (for graph-based stitching)".

## Connections: how they connect, and what Adobe does itself

### Real-Time CDP and CJA (rtcdp-cja)

How: both apps read the same Experience Platform data. Audience analysis brings Real-Time CDP audience membership from Profile datasets into a CJA connection as new dimensions ([Audience analysis overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/audience-analysis-overview)), and audience publishing sends CJA audiences back to Real-Time Customer Profile ([Create and publish audiences](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish)).

What Adobe does itself:
- "Customer Journey Analytics creates a new lookup dataset, then automatically adds the lookup dataset and the profile dataset" to the chosen connection, creates the audience dimensions and configures the chosen data views.
- "An Audience overview template is available in Customer Journey Analytics."
- Publishing: "Audience publishing to Real-Time Customer Profile, including automatic creation of the streaming segment".
- Audience data refreshes nightly: "Audience data is reprocessed and generated each night".

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| RC01 | Real-Time CDP audience analysis in CJA | one-time | 16 / 32 / 64 | yes | [Audience analysis overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/audience-analysis-overview) | "Audience analysis allows you to ingest audience membership data from Experience Platform Profile datasets into a Customer Journey Analytics connection." |
| RC02 | Identity and audience count alignment | one-time | 24 / 48 / 96 | yes | [Consistency of metrics and audience membership](https://experienceleague.adobe.com/en/docs/analytics-platform/using/troubleshooting/consistency-rcdp-cja) | "Real-time CDP and Customer Journey Analytics do not share the same definition of a person today." |

The existing line C06, Audiences that act on the data, is the reverse direction (CJA audiences into Real-Time CDP) and belongs on this connection too. It is also how CJA audiences reach Journey Optimizer: once published, "it can be used in other Experience Platform applications, such as Adobe Journey Optimizer".

### Journey Optimizer and CJA (ajo-cja)

How: "Journey Optimizer supports using Customer Journey Analytics as the reporting engine." When CJA reporting is enabled for Journey Optimizer, "automatically a connection and data view are created for the specific sandbox" ([Integrate Journey Optimizer](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/ajo)).

What Adobe does itself, and what's left:
- The plumbing is Adobe's: the AJO Enabled Connection with the Journey Optimizer datasets, and its data view with every "(AJO)" dimension and metric already set up, including derived fields and context labels.
- Adobe warns against touching them: "Modifying any of the automatically configured values for the connection and data view does have consequences" for Journey Optimizer reporting.
- Journey Optimizer's own reports already run on CJA ([Get started with all time report](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/reporting/channel-report/report-gs-cja)), even for clients who don't own CJA. Clients who do own CJA need the data view setting "Set as default data view in Adobe Journey Optimizer" and CJA audience permissions.
- So the partner work is the reporting beyond Journey Optimizer's own reports, and only for clients who own CJA: putting journey data next to web, app and offline data, and the analysis on top.

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| JC01 | Journey data in the main CJA connection | one-time | 24 / 48 / 80 | yes | [Integrate Journey Optimizer](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/ajo) | "Or you can add Journey Optimizer datasets to an existing connection." |
| JC02 | Journey and experiment analysis in CJA | one-time | 24 / 40 / 80 | yes | [Adobe Customer Journey Analytics & Adobe Journey Optimizer integration](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/architecture-diagrams/customer-insights/cja-ajo-integration) | "Customer Journey Analytics data views and analysis provide campaign and journey insight." |

### Target and CJA (target-cja)

How: Target reporting in CJA "enables you to measure and report on Adobe Target activities directly in Customer Journey Analytics" ([Target reporting](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/at)). The activity picks CJA as its reporting source and a sandbox; "the preferred implementation method is having Adobe Experience Platform and Target implemented through the Adobe Experience Platform Web SDK" ([Target reporting in Adobe Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/target/using/integrate/cja/target-reporting-in-cja)).

What Adobe does itself, and the limits:
- Adobe creates the lookup: "a lookup dataset named Adobe Target Classification Events is created in the corresponding sandbox".
- No ready-made report: "Activity reports must be built in Customer Journey Analytics." This is the main difference from A4T: "This integration is not the same as Adobe Analytics for Target (A4T)."
- "Auto-Target and Automated Personalization activities do not yet support Customer Journey Analytics as the reporting source."
- "The reporting source cannot be changed after a Target activity goes live." One reporting source per activity.

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| TC01 | Target reporting setup in CJA | one-time | 24 / 40 / 72 | yes | [Target reporting in Adobe Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/target/using/integrate/cja/target-reporting-in-cja) | "configure persistence for the Activity Name and Activity ID dimensions" |
| TC02 | Experiment reports in Workspace | one-time | 16 / 32 / 64 | yes | [Target reporting in Adobe Customer Journey Analytics](https://experienceleague.adobe.com/en/docs/target/using/integrate/cja/target-reporting-in-cja) | "Activity reports must be built in Customer Journey Analytics." |
| TC03 | A4T to CJA reporting transition | one-time | 16 / 24 / 48 | no | [Target reporting](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/at) | "This functionality is comparable to what is performed in Adobe Analytics (AA) via Analytics for Target (A4T)" |

## Work shared across products (count once)

- **Experience Platform foundation.** Real-Time CDP, Journey Optimizer and CJA share schemas, datasets, identities, sandboxes and permissions. Adobe's Data Architect tutorial says "Platform services are critical foundations of those applications". With two or more of them on the canvas, count RT01, RT02, RT05, the schema and dataset part of JO02, the sandbox and role part of JO01, and CJ01 once. This fits the canvas concept's "work counted once" group.
- **Web SDK.** Adobe's CJA upgrade page recommends one Web SDK implementation and lists the benefit "Consolidate implementation for Adobe CX Enterprise data collection between other CX Enterprise products (AJO, RTCDP, and so forth)". TG01, the web part of RT02 and CJ03 share the same tags and datastream; use the low end of whichever comes second.
- **Identity.** Graph-based stitching in CJA uses the same Experience Platform identity graph as Real-Time CDP: "The persistent ID is used to query the identity graph from the Experience Platform Identity Service". RC02 is where the two are lined up.

## Candidate integrations for later

Not in today's catalog and not one of the three connections above. No service lines written.

| A | B | What | Source | Quote |
|---|---|---|---|---|
| Real-Time CDP | Target | Audiences and profile attributes shared to Target through the Adobe Target destination | [Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection) | "Adobe Target is a personalization connection in the Adobe Experience Platform destinations catalog." (Aug 2026: "now available to organizations with Adobe Journey Optimizer, in addition to organizations with Real-Time CDP") |
| Real-Time CDP | Journey Optimizer | Real-Time CDP audiences used in journeys | [Adobe Customer Journey Analytics & Adobe Journey Optimizer integration](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/architecture-diagrams/customer-insights/cja-ajo-integration) | "Real-Time CDP audiences are available for Journey Optimizer journey execution and personalization." |
| Journey Optimizer | Target | Journey Optimizer offer decisions inside Target activities | [Use offer decisions](https://experienceleague.adobe.com/en/docs/target/using/integrate/ajo/offer-decision) | "Add offer decisions created in Adobe Journey Optimizer to Target activities (manual A/B Test or Experience Targeting)" |
| Commerce | Real-Time CDP | Data Connection sends Commerce data to Experience Platform; Audience Activation brings audiences back | [Data Connection Introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview) | "This extension allows you to build audiences in Real-Time CDP and deploy those audiences to your Commerce store" |
| Commerce | Journey Optimizer | Commerce events trigger journeys such as abandoned cart | [Use Adobe Journey Optimizer to send an abandoned cart email](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo) | "Learn how to deliver a personalized re-engagement email or notification if a cart or browser session has been abandoned." |
| Commerce | CJA | Commerce event data in CJA | [Data Connection Introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview) | "use it in downstream Adobe DX products such as Real-Time CDP, Customer Journey Analytics" |
| AEM Sites on Edge Delivery | Target (or Journey Optimizer) | Martech integration: Web SDK, Analytics and Target or Journey Optimizer personalization on Edge Delivery sites | [Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration) | "The stack combines Adobe Experience Platform WebSDK, Adobe Analytics, Adobe Target or Adobe Journey Optimizer" |
| Brand Concierge | Real-Time CDP | Conversations use real-time customer, account and buying group profiles | [Integrations for CX and Commerce, Adobe Brand Concierge](https://business.adobe.com/products/brand-concierge/integrations.html) (product page, read through the fetch tool) | "Integrate Adobe Real-Time CDP with Brand Concierge to:" then "Automatically connect to customer, account, and buying group profiles in real time." |
| Brand Concierge | CJA | Conversation data combined with CJA data | [Integrations for CX and Commerce, Adobe Brand Concierge](https://business.adobe.com/products/brand-concierge/integrations.html) (product page, read through the fetch tool) | "Combine Brand Concierge conversation data with Adobe Customer Journey Analytics data to:" |
| Coworker | Real-Time CDP (and Journey Optimizer) | Coworker Chat inside Real-Time CDP and Journey Optimizer (also CJA and Target) for audience and journey work | [Adobe CX Enterprise Coworker overview](https://experienceleague.adobe.com/en/docs/coworker/content/home) | "Coworker Chat is available now in the following applications:" (list includes Real-Time CDP, Journey Optimizer, CJA, Target); Experience League Live: "CX Enterprise Coworker extends the value of Real-Time CDP and Journey Optimizer" |

Left out because the catalog already has them: Brand Visibility with CJA (C01), Edge Delivery (C03, L03), Commerce (C02), Brand Concierge (C04) and Sites Optimizer (O03); Sites Optimizer with Edge Delivery (SO1); Coworker with CJA, AEM and Brand Concierge (CW-CJA, CW-AEM, CW-FSI). The Brand Concierge docs add only a general line: "Deep Adobe integrations enable rapid setup for brands working with AEM, AEP, or Commerce".

## The check: does Adobe document a direct Brand Visibility and Sites Optimizer integration?

**No.** Adobe markets them together, but no public Adobe page documents a product-to-product integration (shared data, a connector, a setting, or opportunities that pass from one to the other).

Marketing them together:
- Adobe's brand visibility solutions page (fetch tool) lists both in one suite: "The full product suite includes Adobe Experience Manager Sites, Adobe Experience Manager Sites Optimizer, ..." and "Together, these products cover every stage of brand visibility". The same FAQ says each product "offers standalone value".
- Ultimate Success webinar ([Win Visibility in the AI Era with Adobe LLM Optimizer & Sites Optimizer](https://experienceleague.adobe.com/en/docs/ultimate-success/ultimate-success-webinar-library/hidden/ai-visibility)): "combining LLM Optimizer and Sites Optimizer enables a holistic approach to digital optimization".

No integration documented:
- None of the 11 Brand Visibility pages read (docs, Optimize at Edge, opportunities, tutorials, release notes, June 2026 launch news) mentions Sites Optimizer. Optimize at Edge "is an edge-based deployment capability in Adobe Brand Visibility" with its own CDN setup.
- None of the 8 Sites Optimizer pages read mentions Brand Visibility or LLM Optimizer. The settings page, "the central hub for configuring your Sites Optimizer experience", has two connections only: Google Search Console and Connect to AEM Sites.
- The Brand Visibility product page (fetch tool) names its native integrations: "Adobe Brand Visibility integrates natively with Adobe Analytics and Customer Journey Analytics." It can also "send recommendations straight to Adobe Experience Manager Sites" (that's AEM Sites, not Sites Optimizer). The Sites Optimizer product page mentions Brand Visibility only in site navigation.
- The two security overviews (fetch tool) don't mention each other. Both list Adobe IMS sign-in, the AEM Experience Hub and AEM operational telemetry: shared Adobe services, not a link between the products.

## What I couldn't find, gaps and conflicts

- **Hours.** No Adobe page gives hours or team sizes for any of this work. All hours are our estimates. Scope quantities (starting journeys, audiences, activities, destinations) are illustrative; Adobe recommends no starting counts.
- **A Real-Time CDP implementation checklist.** There's no single checklist page. The lines rest on the Experience Platform end-to-end workflow, the Data Architect tutorial and the component overviews.
- **Real-Time CDP on CJA's integrations list.** CJA's [integrations overview](https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/overview) ("Following is a list of some of the available integrations:") lists Adobe Analytics, Target, Adobe Advertising, Journey Optimizer, Decision Management and Customer AI, but not Real-Time CDP. The link is documented on the audience analysis and audience publishing pages instead.
- **Counts won't match.** Adobe says consistency of metrics and audience membership between Real-Time CDP and CJA cannot be guaranteed (different person definitions, datasets, retention and latency). RC02 sets expectations; it can't promise matching numbers.
- **Naming slip on Adobe's page.** The CJA Journey Optimizer page says "The data view has the name AJO Enable Data View (sandbox name)." while its table says AJO Enabled Data View.
- **Commerce and CJA.** No CJA-side guide for Commerce data was found; the candidate rests on the Commerce Data Connection page.
- **Brand Concierge integrations** are documented on Adobe's product page, not on Experience League.
- **CJA monthly work.** No Adobe page describes a monthly analytics routine; CJ06 rests on the advanced analysis page (flow, fallout, attribution). Guessed pages for scheduled projects and alerts returned 404.

## Flags (not changed)

- The existing SO1 line (Sites Optimizer setup) cites the opportunity types page. The Sites Optimizer [settings page](https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings) has a more specific source, Connect to AEM Sites: "This following guide explains how to connect your existing Edge Delivery Services (EDS) site to AEM Sites Optimizer." It needs the site's code repository and access to its content source (SharePoint or Google Drive).
- The Adobe Target destination is now offered to Journey Optimizer organizations too (Aug 2026 changelog), so Real-Time CDP isn't required for the Real-Time CDP and Target candidate's destination.
