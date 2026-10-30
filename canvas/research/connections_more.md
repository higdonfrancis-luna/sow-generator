# More connections research (Oct 30 2026)

Research for the Build canvas prototype (`sow/canvas/`): which other pairs of the ten canvas products Adobe documents a connection for, and the partner services each connection supports. The data is in `connections_more.json` next to this file. The eleven connections already done (bv-cja, bv-eds, so-eds, bv-bc, bv-commerce, cw-cja, cw-eds, cw-bc, rtcdp-cja, ajo-cja, target-cja) were not redone.

## Summary

- Documented with services: 18 pairs, 27 lines (XA01 to XA27).
- Documented without services: 1 pair (ajo-bc).
- Not documented: 6 pairs (cja-eds, cw-commerce, cw-bv, cw-so, target-bv, ajo-bv).
- Hours are our own estimates for a mid-market client. Adobe publishes no hours.

| Connection | Lines | On by default | Base hours, default lines | Base hours, all lines |
|---|---|---|---|---|
| Real-Time CDP and Journey Optimizer (`rtcdp-ajo`) | 4 | 2 | 112 | 240 |
| Real-Time CDP and Target (`rtcdp-target`) | 2 | 1 | 40 | 72 |
| Journey Optimizer and Target (`ajo-target`) | 1 | 1 | 32 | 32 |
| Real-Time CDP and Brand Concierge (`rtcdp-bc`) | 2 | 1 | 48 | 80 |
| Journey Optimizer and Brand Concierge (`ajo-bc`) | 0 | 0 | 0 | 0 |
| Customer Journey Analytics and Brand Concierge (`cja-bc`) | 1 | 1 | 40 | 40 |
| Brand Concierge and Edge Delivery Services (`bc-eds`) | 2 | 2 | 64 | 64 |
| Brand Concierge and Adobe Commerce (`bc-commerce`) | 1 | 1 | 40 | 40 |
| Adobe Commerce and Real-Time CDP (`commerce-rtcdp`) | 2 | 2 | 120 | 120 |
| Adobe Commerce and Journey Optimizer (`commerce-ajo`) | 1 | 1 | 48 | 48 |
| Adobe Commerce and Customer Journey Analytics (`commerce-cja`) | 1 | 1 | 48 | 48 |
| Adobe Commerce and Edge Delivery Services (`commerce-eds`) | 3 | 2 | 168 | 192 |
| Target and Adobe Commerce (`target-commerce`) | 1 | 0 | 0 | 40 |
| Target and Edge Delivery Services (`target-eds`) | 1 | 1 | 48 | 48 |
| Journey Optimizer and Edge Delivery Services (`ajo-eds`) | 1 | 1 | 48 | 48 |
| Real-Time CDP and Edge Delivery Services (`rtcdp-eds`) | 1 | 1 | 32 | 32 |
| Coworker and Real-Time CDP (`cw-rtcdp`) | 1 | 1 | 48 | 48 |
| Coworker and Journey Optimizer (`cw-ajo`) | 1 | 1 | 48 | 48 |
| Coworker and Target (`cw-target`) | 1 | 0 | 0 | 40 |

## How the research was done

- Started from the candidate list in `cja_hub.md`, then the Use Case Patterns page and its pattern pages, then each product's own docs.
- Every Experience League, aem.live and Commerce storefront page cited was downloaded on Oct 30 2026, and every quote was checked word for word against the page text with a script (whitespace, curly quotes and spaces before punctuation normalized). All quotes are 20 words or fewer.
- business.adobe.com refused direct downloads (HTTP/2 stream error), so the Brand Concierge integrations page and blog were read through a fetch tool and quoted as it returned them. They back only the Journey Optimizer and Brand Concierge pair, which has no service lines.
- A pair counts as documented when an Adobe page describes the two products working together. Service lines are tied to a setup step or task that a page describes or clearly implies.

## Searches run

1. Brand Concierge Customer Journey Analytics conversation data experienceleague.adobe.com
2. Brand Concierge Journey Optimizer integration experienceleague
3. Brand Concierge Edge Delivery Services aem.live embed web agent
4. Brand Concierge Adobe Commerce catalog product advisor integration experienceleague
5. Adobe Commerce storefront Edge Delivery Services experienceleague.adobe.com developer commerce storefront
6. Adobe Commerce data Customer Journey Analytics experienceleague commerce events report CJA dashboard
7. Adobe Commerce Adobe Target personalization integration experienceleague Commerce storefront Target
8. CX Enterprise Coworker Adobe Commerce OR "Brand Visibility" OR "Sites Optimizer" Coworker integration
9. Edge Delivery Services Web SDK Experience Platform data collection Real-Time CDP Customer Journey Analytics tutorial-one-adobe AEM
10. Customer Journey Analytics Content Analytics Edge Delivery Services AEM sites experienceleague configure
11. aem.live "Real-Time CDP" OR "Customer Journey Analytics" Edge Delivery Services Web SDK datastream
12. tutorial-one-adobe Edge Delivery Services website Web SDK tags implement data collection citisignal aem.live
13. "Brand Visibility" OR "LLM Optimizer" Adobe Target OR "Journey Optimizer" integration experienceleague
14. Adobe Target Edge Delivery Services experimentation aem.live Target integration
15. Adobe Commerce Audience Activation extension Real-Time CDP audiences cart price rules experienceleague

## Pages read

- [Use Case Patterns](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/overview): the eight Real-Time CDP and Journey Optimizer patterns
- [Pattern pages: batch outbound message activation, event-triggered messaging, multi-step orchestrated journey, cross-channel journey with decisioning, offer decisioning, behavioral recommendation, known-visitor web/app personalization, anonymous visitor web personalization](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/event-triggered-messaging): rtcdp-ajo (each URL is in the JSON)
- [Audience Sharing with Adobe Target pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/audience-sharing-with-target): rtcdp-target
- [Brand Concierge conversational experience pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/conversational-experience-patterns/brand-concierge-conversational-experience): rtcdp-bc, cja-bc
- [Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection): rtcdp-target, ajo-target
- [Use offer decisions (Target guide, Legacy badge)](https://experienceleague.adobe.com/en/docs/target/using/integrate/ajo/offer-decision): ajo-target
- [Adobe Brand Concierge home](https://experienceleague.adobe.com/en/docs/brand-concierge/content/home): context
- [Brand Concierge help](https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/overview): cja-bc
- [Brand Concierge FAQ](https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/brand-concierge-faq): bc-commerce, notes on rtcdp-bc and ajo-bc
- [Brand Concierge current release notes (Oct 27 2026)](https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current): rtcdp-bc, bc-eds, bc-commerce
- [1.4.2 Implement Brand Concierge on your website (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2): bc-eds
- [Brand Concierge and Commerce AI overview (Coming Soon; curl returned 404, read through the fetch tool)](https://experienceleague.adobe.com/en/docs/commerce-learn/ai-and-agentic-commerce/brand-concierge/brand-concierge-and-commerce-ai-overview): note only
- [Brand Concierge integrations (fetch tool)](https://business.adobe.com/products/brand-concierge/integrations.html): ajo-bc
- [How Adobe Brand Concierge works, Mar 17 2026 (fetch tool)](https://business.adobe.com/blog/how-adobe-brand-concierge-works): ajo-bc
- [Data Connection introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview): commerce-rtcdp, commerce-cja
- [Connect Commerce data to Adobe Experience Platform](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data): commerce-rtcdp
- [Types of Commerce data](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/data-ingestion): read, not cited
- [Use Journey Optimizer to send an abandoned cart email](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo): commerce-ajo
- [Create audiences in Real-Time CDP using Commerce event data](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/create-audience): read, supports XA15
- [Audience Activation (PaaS only)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/audience-activation): commerce-rtcdp
- [Adobe Commerce connection (Experience Platform destination)](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-commerce): commerce-rtcdp
- [Create compelling, personalized experiences at scale](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale): commerce-cja, target-commerce
- [Commerce Storefront architecture](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/architecture): commerce-eds
- [Create a storefront](https://experienceleague.adobe.com/en/tools/commerce-storefront/get-started/create-storefront/): commerce-eds
- [Backend options](https://experienceleague.adobe.com/en/tools/commerce-storefront/get-started/backends/): license note
- [Launch checklist](https://experienceleague.adobe.com/en/tools/commerce-storefront/setup/launch/launch-checklist/): commerce-eds
- [SEO overview](https://experienceleague.adobe.com/en/tools/commerce-storefront/setup/seo/): commerce-eds
- [Adobe Experience Platform (storefront)](https://experienceleague.adobe.com/en/tools/commerce-storefront/setup/analytics/adobe-experience-platform/): commerce-eds XA20
- [Configuring Adobe Experience Cloud Integration (aem.live)](https://www.aem.live/developer/martech-integration): target-eds, ajo-eds
- [1.1.5 AEM Edge Delivery Services MarTech plugin (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/assetmgmt/assetm1/ex5): rtcdp-eds
- [Integrate AEM Sites and Experience Platform Web SDK](https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform/web-sdk): read; classic AEM Sites, not Edge Delivery
- [Content Analytics overview and Create configuration tutorial](https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics): cja-eds check (no Edge Delivery mention)
- [Adobe CX Enterprise Coworker overview (Oct 28 2026)](https://experienceleague.adobe.com/en/docs/coworker/content/home): cw-target, onboarding note
- [Coworker Chat overview](https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview): compatible applications list
- [Get started with Coworker Chat](https://experienceleague.adobe.com/en/docs/coworker/content/chat/ui-guide): availability table
- [What are skills in Coworker?](https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills): Coworker lines
- [Coworker Unlocked: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26): cw-rtcdp, cw-ajo
- [CX Enterprise Coworker and AEM](https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/coworker/aem-in-coworker): cw-so check
- [Adobe Unveils CX Enterprise Coworker, Apr 20 2026 (press release PDF)](https://news.adobe.com/news/downloads/pdfs/2026/04/042026-customer-engagement-cx-coworker-release1.pdf): cw-commerce, cw-bv, cw-so checks
- [Brand Visibility overview and What's new](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/overview): target-bv, ajo-bv, cw-bv checks

## Connection by connection: page and quote

### Real-Time CDP and Journey Optimizer (`rtcdp-ajo`)

How they connect: Journey Optimizer runs its journeys, campaigns and decisions on the Real-Time CDP profiles and audiences that live in Experience Platform. [Experience League: Batch outbound message activation pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/batch-outbound-message-activation): "combining audience evaluation in RT-CDP with message authoring and campaign execution in Journey Optimizer"

What you get together: **The right message from one profile.** Every email, push, SMS and web experience is chosen from the same live customer profile and audience, so timing, offers and content follow what each person just did.

Flows:

- Real-Time CDP to Journey Optimizer: Audiences, profile attributes and real-time events for journey entry, conditions and personalization. [Experience League: Known-visitor web/app personalization pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/known-visitor-web-app-personalization): "leverages the full unified profile: historical behavioral data, segment membership, loyalty tier, purchase history, lifecycle stage"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA01 | Triggered and batch messages on CDP data | one-time | 24 / 48 / 96 | yes | [Event-triggered messaging pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/event-triggered-messaging), also [Batch outbound message activation pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/batch-outbound-message-activation) | "Listen for a real-time behavioral or system event, then deliver a contextual message to the triggering profile" |
| XA02 | Multi-step journeys on CDP audiences | one-time | 32 / 64 / 120 | yes | [Multi-step orchestrated journey pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/multi-step-orchestrated-journey), also [Cross-channel journey with decisioning pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/cross-channel-journey-with-decisioning) | "Guide a profile through a branching, multi-touch journey with waits, conditions, and multiple message actions over time." |
| XA03 | Offer decisioning and recommendations | one-time | 40 / 72 / 140 | no | [Offer decisioning pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/offer-decisioning), also [Behavioral recommendation pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/behavioral-recommendation) | "Use centralized decision logic to select the next-best offer or content for a profile across channels." |
| XA04 | Web and app personalization on profiles | one-time | 32 / 56 / 112 | no | [Known-visitor web/app personalization pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/known-visitor-web-app-personalization), also [Anonymous visitor web personalization pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/anonymous-visitor-web-personalization) | "Deliver personalized content, offers, or promotions to an identified visitor based on real-time profile and segment membership" |

- XA01 scope: Set up the client's first event-triggered messages (such as cart, browse or welcome) and scheduled sends that read Real-Time CDP audiences and profile attributes, then test entry, conditions and suppression.
- XA02 scope: Design and build branching, multi-touch journeys that enter from Real-Time CDP audiences or events, with waits, conditions, exit criteria and decision points where the journey picks the channel or content.
- XA03 scope: Build the offer catalog, eligibility rules, ranking strategies and placements in Journey Optimizer Decisioning on Real-Time CDP audiences and attributes, plus behavioral recommendation strategies where the catalog is large.
- XA04 scope: Configure web and app surfaces, edge audiences and content variants so known visitors see content from their profile and anonymous visitors see content from in-session behavior.

### Real-Time CDP and Target (`rtcdp-target`)

How they connect: Real-Time CDP shares audiences and profile attributes with Target through the Adobe Target destination, for web and app personalization. [Experience League: Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection): "Adobe Target is a personalization connection in the Adobe Experience Platform destinations catalog."

What you get together: **Known-customer personalization in Target.** Target activities can use audiences built from CRM, loyalty, purchase and offline data, not just web behavior, and with Web SDK they can act on the same page.

Flows:

- Real-Time CDP to Target: Streaming, batch and edge-evaluated audiences plus selected profile attributes. [Experience League: Audience Sharing with Adobe Target pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/audience-sharing-with-target): "Share and target audiences defined in Real-time Customer Data Platform on websites and mobile apps using Adobe Target"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA05 | Share CDP audiences and attributes to Target | one-time | 24 / 40 / 80 | yes | [Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection) | "share audiences and profile attributes to the Adobe Target connection" |
| XA06 | Edge segmentation for same-page Target | one-time | 16 / 32 / 64 | no | [Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection) | "Edge segmentation works as expected. Same-page and next-page personalization are supported." |

- XA05 scope: Configure the Adobe Target destination and its workspace, choose the audiences and profile attributes to share, and check that they appear in Target for the first activities.
- XA06 scope: Set up the datastream with Target and Experience Platform services and edge segmentation, so audiences qualify in real time for same-page and next-page personalization.

### Journey Optimizer and Target (`ajo-target`)

How they connect: Target activities can serve offer decisions built in Journey Optimizer, and Journey Optimizer organizations can share audiences to Target through the Target destination. [Experience League: Use offer decisions (Target)](https://experienceleague.adobe.com/en/docs/target/using/integrate/ajo/offer-decision): "Add offer decisions created in Adobe Journey Optimizer to Target activities (manual A/B Test or Experience Targeting)"

What you get together: **Test decisioned offers on site.** Offers and eligibility rules managed once in Journey Optimizer appear in Target A/B tests and targeting activities, so the web shows the same next-best offer as email and app.

Flows:

- Journey Optimizer to Target: Offer decisions with their offers and eligibility rules, placed in Target activities. [Experience League: Use offer decisions (Target)](https://experienceleague.adobe.com/en/docs/target/using/integrate/ajo/offer-decision): "Add offer decisions created in Adobe Journey Optimizer to Target activities"
- Journey Optimizer to Target: Experience Platform audiences, through the Target destination. [Experience League: Adobe Target connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection): "The Adobe Target destination is now available to organizations with Adobe Journey Optimizer, in addition to organizations with Real-Time CDP."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA07 | Journey Optimizer offers in Target tests | one-time | 16 / 32 / 64 | yes | [Use offer decisions (Target)](https://experienceleague.adobe.com/en/docs/target/using/integrate/ajo/offer-decision) | "Adobe Target Standard or Adobe Target Premium implemented using the Adobe Experience Platform Web SDK" |

- XA07 scope: Confirm Target runs on the Web SDK, then place Journey Optimizer offer decisions in manual A/B Test or Experience Targeting activities and set up the lift and conversion goals.

### Real-Time CDP and Brand Concierge (`rtcdp-bc`)

How they connect: Brand Concierge runs on Experience Platform with Real-Time CDP providing profile lookup for conversations and taking back intent and sentiment signals for audiences. [Experience League: Brand Concierge conversational experience pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/conversational-experience-patterns/brand-concierge-conversational-experience): "real-time profile lookup for personalized conversations, audience segmentation from conversational signals, and profile enrichment with intent and sentiment data"

What you get together: **Conversations that know and teach.** Concierge answers can draw on the visitor's profile, and what visitors ask, want and feel goes back into profiles and audiences for later marketing.

Flows:

- Real-Time CDP to Brand Concierge: User attributes, behavioral signals and prior interactions as conversation context. [Experience League: Brand Concierge current release notes](https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current): "incorporating Real-Time CDP context, such as user attributes, behavioral signals, and prior interactions"
- Brand Concierge to Real-Time CDP: Intent and sentiment signals from conversations, for profiles and audiences. [Experience League: Brand Concierge conversational experience pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/conversational-experience-patterns/brand-concierge-conversational-experience): "feeds conversational signals back into the customer data platform for downstream personalization and activation"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA08 | Conversation signals into profiles | one-time | 24 / 48 / 88 | yes | [Brand Concierge conversational experience pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/conversational-experience-patterns/brand-concierge-conversational-experience) | "feeds conversational signals back into the customer data platform for downstream personalization and activation" |
| XA09 | Real-Time CDP context in conversations | one-time | 16 / 32 / 64 | no | [Brand Concierge current release notes](https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current) | "incorporating Real-Time CDP context, such as user attributes, behavioral signals, and prior interactions" |

- XA08 scope: Set up the concierge datastream and the schema fields for conversation events, then build the first audiences from intent and sentiment signals for activation.
- XA09 scope: Where the client has the limited-availability Real-Time CDP integration, choose the profile attributes and signals the concierge may use and test the replies against them.

### Journey Optimizer and Brand Concierge (`ajo-bc`)

How they connect: Adobe's product pages say conversational engagement in Brand Concierge can trigger Journey Optimizer follow-up messages across channels. [Adobe for Business: Brand Concierge integrations](https://business.adobe.com/products/brand-concierge/integrations.html): "Trigger timely, personalized follow-up messages across email, SMS, and other channels based on conversational engagement."

What you get together: **Follow-up after the conversation.** A visitor who showed intent in a concierge conversation can get a timely follow-up by email, SMS or other channels, coordinated with sales for B2B.

Flows:

- Brand Concierge to Journey Optimizer: Conversational engagement signals that start follow-up journeys. [Adobe blog: How Adobe Brand Concierge works](https://business.adobe.com/blog/how-adobe-brand-concierge-works): "Enables conversational signals to drive coordinated, cross-channel follow-up, even for complex B2B sales cycles."

No service lines: Only Adobe product and blog pages describe it; Experience League has no setup steps, and the Brand Concierge FAQ lists follow-up and retargeting as roadmap.

### Customer Journey Analytics and Brand Concierge (`cja-bc`)

How they connect: Brand Concierge's built-in analytics dashboard is powered by Customer Journey Analytics, and conversation data can be analyzed with the rest of the customer journey. [Experience League: Brand Concierge help](https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/overview): "an analytics dashboard powered by Customer Journey Analytics for metrics like conversations, sentiment, and engagement"

What you get together: **See what conversations are worth.** Conversation counts, sentiment and engagement sit next to journey and revenue data, so the team sees which conversations lead to purchases and where visitors struggle.

Flows:

- Brand Concierge to Customer Journey Analytics: Conversation, sentiment, feedback and engagement data for dashboards and journey analysis. [Experience League: Brand Concierge help](https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/overview): "View Report Button: Allows you to open a dashboard powered by Customer Journey Analytics"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA10 | Conversation impact reporting in CJA | one-time | 24 / 40 / 80 | yes | [Brand Concierge conversational experience pattern](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/conversational-experience-patterns/brand-concierge-conversational-experience) | "Attribution analysis on conversation-to-purchase journeys" |

- XA10 scope: Extend the built-in dashboard with Workspace reports on conversation-to-purchase journeys, recommendation acceptance and handoff rates from the pattern's KPI list.

### Brand Concierge and Edge Delivery Services (`bc-eds`)

How they connect: Brand Concierge loads on an Edge Delivery Services site through a custom block, and can use the AEM site's content as its knowledge source. [Experience League: Implement Brand Concierge on your website (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2): "In order for Brand Concierge to appear on your website, you need to create a new custom block"

What you get together: **A concierge grounded in your site.** The concierge sits on fast Edge Delivery pages and answers from the same approved site content, so pages and answers stay in step when content changes.

Flows:

- Edge Delivery Services to Brand Concierge: Published site content, ingested as the concierge's knowledge source. [Experience League: Brand Concierge current release notes](https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current): "with AEM website content as the primary knowledge source"
- Brand Concierge to Edge Delivery Services: The concierge chat, delivered in a custom block on site pages. [Experience League: Implement Brand Concierge on your website (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2): "Create a new custom block that will be used to load Brand Concierge on your website."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA11 | Brand Concierge block on Edge Delivery | one-time | 16 / 32 / 64 | yes | [Implement Brand Concierge on your website (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2) | "In order for Brand Concierge to appear on your website, you need to create a new custom block" |
| XA12 | Site content as concierge knowledge source | one-time | 16 / 32 / 56 | yes | [Brand Concierge current release notes](https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current) | "set up knowledge source ingestion directly in Composer, with AEM website content as the primary knowledge source" |

- XA11 scope: Add a Brand Concierge block to the site code, place it on the agreed pages and navigation, and set the surface rules for where the concierge appears.
- XA12 scope: Set up AEM content ingestion in Composer or full-site ingestion from the sitemap, check coverage of priority pages, and plan refreshes when content changes.

### Brand Concierge and Adobe Commerce (`bc-commerce`)

How they connect: Brand Concierge connects to Adobe Commerce through the Adobe Commerce MCP server to discover and compare catalog products in conversation. [Experience League: Brand Concierge frequently asked questions](https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/brand-concierge-faq): "Brand Concierge connects to Adobe Commerce through the Adobe Commerce MCP (Model Context Protocol)."

What you get together: **Shopping help from the live catalog.** Shoppers describe what they need and get product cards and side-by-side comparisons drawn from the store's own catalog.

Flows:

- Adobe Commerce to Brand Concierge: Catalog products and attributes for discovery, product cards and comparisons. [Experience League: Brand Concierge current release notes](https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current): "Commerce catalog discovery and comparison"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA13 | Connect Commerce catalog to Brand Concierge | one-time | 24 / 40 / 80 | yes | [Brand Concierge frequently asked questions](https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/brand-concierge-faq) | "more complex or custom variations may need additional backend work" |

- XA13 scope: Turn on the Commerce catalog integration, map the client's product attributes, test product cards and comparisons, and handle custom catalog variations that need backend work.

### Adobe Commerce and Real-Time CDP (`commerce-rtcdp`)

How they connect: The Data Connection extension sends Commerce storefront, back office and profile data to Experience Platform, and Audience Activation brings Real-Time CDP audiences back into Commerce. [Experience League: Data Connection introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview): "The Data Connection extension connects your Adobe Commerce web instance to the Adobe Experience Platform and the Edge Network."

What you get together: **Store data in, audiences back.** Shopping behavior and orders build richer profiles, and the audiences built from them come back to the store as cart offers, banners and pricing.

Flows:

- Adobe Commerce to Real-Time CDP: Storefront events, back office order events and shopper profile records. [Experience League: Data Connection introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview): "your behavioral, back office, and customer profile data is sent to the Experience Platform edge"
- Real-Time CDP to Adobe Commerce: Real-Time CDP audiences for cart price rules, dynamic blocks and related products. [Experience League: Adobe Commerce connection](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-commerce): "select one or more Real-Time CDP audiences to activate to your Adobe Commerce account"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA14 | Commerce Data Connection to Platform | one-time | 40 / 72 / 140 | yes | [Connect Commerce data to Adobe Experience Platform](https://experienceleague.adobe.com/en/docs/commerce/data-connection/fundamentals/connect-data) | "you must configure both connectors, starting with the Commerce Services connector then finishing with the Data Connection extension" |
| XA15 | Activate CDP audiences in Commerce | one-time | 24 / 48 / 96 | yes | [Audience Activation (Commerce)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/audience-activation) | "lets you activate Real-Time CDP audiences in Adobe Commerce to create unique offers in the cart" |

- XA14 scope: Configure the Commerce Services connector and Data Connection, create the schema, datasets and datastream, turn on storefront, back office and profile data, and check the first events.
- XA15 scope: Set up the Adobe Commerce destination and Audience Activation, then use the first audiences in cart price rules, dynamic blocks or related product rules.

### Adobe Commerce and Journey Optimizer (`commerce-ajo`)

How they connect: Commerce events sent through Data Connection reach Journey Optimizer, which listens for them to start journeys such as abandoned cart. [Experience League: Use Journey Optimizer to send an abandoned cart email](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo): "listening to a checkout event generated from your Commerce instance and responding to that event in Journey Optimizer"

What you get together: **Win back carts in minutes.** Abandoned carts, browses and orders in the store start timely, personalized email, SMS or push journeys instead of generic batch sends.

Flows:

- Adobe Commerce to Journey Optimizer: Storefront and back office events such as addToCart, startCheckout and orderPlaced. [Experience League: Use Journey Optimizer to send an abandoned cart email](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo): "Build an abandoned cart, browse email, or notification using data from storefront and back office events."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA16 | Commerce event journeys, such as cart | one-time | 24 / 48 / 96 | yes | [Use Journey Optimizer to send an abandoned cart email](https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo) | "Learn how to deliver a personalized re-engagement email or notification if a cart or browser session has been abandoned." |

- XA16 scope: Set up the Commerce events as journey events, then build and test abandoned cart and browse journeys that read the cart and order data.

### Adobe Commerce and Customer Journey Analytics (`commerce-cja`)

How they connect: Commerce data sent through Data Connection lands in Experience Platform datasets that Customer Journey Analytics can analyze. [Experience League: Data Connection introduction](https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview): "downstream Adobe DX products such as Real-Time CDP, Customer Journey Analytics, Adobe Analytics, and Journey Optimizer"

What you get together: **Shopping in the full journey.** Store browsing, carts and orders sit next to marketing, web and offline data, so teams see what drives purchases across channels.

Flows:

- Adobe Commerce to Customer Journey Analytics: Storefront, back office and profile datasets, through Experience Platform. [Experience League: Create compelling, personalized experiences at scale (Commerce)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale): "Customer Journey Analytics and Adobe Analytics: Gain insights into the customer and the business."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA17 | Commerce data in CJA reports | one-time | 24 / 48 / 96 | yes | [Create compelling, personalized experiences at scale (Commerce)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale) | "Customer Journey Analytics and Adobe Analytics: Gain insights into the customer and the business." |

- XA17 scope: Add the Commerce event and profile datasets to the CJA connection, define commerce metrics and dimensions in the data view, and build the first purchase and cart reports.

### Adobe Commerce and Edge Delivery Services (`commerce-eds`)

How they connect: The Adobe Commerce storefront runs on Edge Delivery Services, which serves pages and storefront code while drop-ins request catalog and shopping data from Commerce. [Experience League: Commerce Storefront architecture](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/architecture): "Edge Delivery Services delivers page content and storefront code to the shopper's browser. The storefront code then requests Commerce data."

What you get together: **A fast storefront authors can edit.** Pages load fast and rank well, authors edit content as documents, and prices, carts and checkout come live from Commerce.

Flows:

- Adobe Commerce to Edge Delivery Services: Product details, prices, search results and cart data for storefront drop-ins. [Experience League: Commerce Storefront architecture](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/architecture): "Connected Commerce services supply product information and shopping data, such as prices and cart contents."
- Edge Delivery Services to Adobe Commerce: Cart, checkout and account operations from the shopper's browser. [Experience League: Commerce Storefront architecture](https://experienceleague.adobe.com/developer/commerce/storefront/get-started/architecture): "Shopping operations read or update carts, complete checkout, and manage customer accounts and orders."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA18 | Build the Commerce storefront on Edge | one-time | 60 / 120 / 240 | yes | [Create a storefront (Commerce Storefront)](https://experienceleague.adobe.com/en/tools/commerce-storefront/get-started/create-storefront/) | "Create a new storefront project with its own GitHub repository, Commerce connection, and starter content in Document Authoring on DA.live." |
| XA19 | Storefront SEO and launch checklist | one-time | 24 / 48 / 96 | yes | [Commerce Storefront launch checklist](https://experienceleague.adobe.com/en/tools/commerce-storefront/setup/launch/launch-checklist/), also [Commerce Storefront SEO overview](https://experienceleague.adobe.com/en/tools/commerce-storefront/setup/seo/) | "Complete these steps before production traffic reaches your Adobe Commerce Storefront (EDS)." |
| XA20 | Storefront events to Experience Platform (needs rtcdp) | one-time | 16 / 24 / 48 | no | [Commerce Storefront and Adobe Experience Platform](https://experienceleague.adobe.com/en/tools/commerce-storefront/setup/analytics/adobe-experience-platform/) | "send commerce events (product views, purchases, cart actions) directly to the Experience Platform Edge Network" |

- XA18 scope: Create the storefront project, link it to Commerce data, set up the drop-ins and commerce blocks, and style them to the brand.
- XA19 scope: Align catalog URLs, metadata, sitemaps and prerendering with Edge Delivery defaults, then work through the storefront launch checklist and go-live plan.
- XA20 scope: Add the organization and datastream to the storefront configuration and check that product, cart and purchase events reach the Edge Network.

### Target and Adobe Commerce (`target-commerce`)

How they connect: Commerce data shared through Data Connection reaches the Edge Network, where Adobe lists Target for testing and optimizing content, products and offers. [Experience League: Create compelling, personalized experiences at scale (Commerce)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale): "Adobe Target: Test and optimize content, recommended products, offers, navigation, and more."

What you get together: **Tests driven by shopping data.** Target tests and personalizes store content, recommended products and offers using what shoppers browse, add to cart and buy.

Flows:

- Adobe Commerce to Target: Storefront, back office and profile data through the Edge Network. [Experience League: Create compelling, personalized experiences at scale (Commerce)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale): "Share storefront, back office, and customer profile data from Adobe Commerce to the Adobe Experience Platform edge network"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA21 | Target tests on Commerce shopping data | one-time | 24 / 40 / 80 | no | [Create compelling, personalized experiences at scale (Commerce)](https://experienceleague.adobe.com/en/docs/commerce-admin/customers/customers-menu/personalize-scale) | "Adobe Target: Test and optimize content, recommended products, offers, navigation, and more." |

- XA21 scope: Map the Commerce events Target will use, then build the first tests on product, promotion or navigation content in the store.

### Target and Edge Delivery Services (`target-eds`)

How they connect: Adobe's martech plugin for Edge Delivery Services loads Web SDK so Target evaluates personalization and applies page changes as each block renders. [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration): "The personalization rules will be dynamically evaluated server-side by Adobe Target, or Adobe Journey Optimizer"

What you get together: **Personalize without slowing pages.** Target tests and personalization run on Edge Delivery pages with little flicker and a small, measured speed cost.

Flows:

- Target to Edge Delivery Services: Page modifications for matching visitors, applied as each block renders. [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration): "delivered as a list of page modifications that will be applied as the page renders each block"
- Edge Delivery Services to Target: Page and visitor context through Web SDK top and bottom of page events. [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration): "Top and bottom of page events so we can enable personalization early in the page load"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA22 | Target personalization on Edge Delivery | one-time | 24 / 48 / 96 | yes | [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration) | "Datastream in the Adobe Experience Platform to connect to your Adobe Target and Adobe Analytics solutions" |

- XA22 scope: Install and configure the martech plugin with the datastream and tags, turn on Target for the agreed pages, and check flicker and page speed.

### Journey Optimizer and Edge Delivery Services (`ajo-eds`)

How they connect: The same Edge Delivery martech plugin lets Journey Optimizer, instead of or beside Target, personalize pages through Web SDK. [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration): "Real-time personalization through Adobe Target or Adobe Journey Optimizer"

What you get together: **Journey content on fast pages.** Web campaigns from Journey Optimizer appear on Edge Delivery pages, in step with the client's email and app journeys.

Flows:

- Journey Optimizer to Edge Delivery Services: Web campaign content as page modifications, applied as blocks render. [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration): "Adobe Target and Adobe Journey Optimizer: personalizes and optimizes the page with your desired marketing campaigns"
- Edge Delivery Services to Journey Optimizer: Page and visitor events through Web SDK. [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration): "Adobe Experience Platform WebSDK: allows the page to interact with the Adobe Experience Platform services"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA23 | Journey Optimizer web campaigns on Edge | one-time | 24 / 48 / 96 | yes | [aem.live: Configuring Adobe Experience Cloud Integration](https://www.aem.live/developer/martech-integration) | "Adobe Target and Adobe Journey Optimizer: personalizes and optimizes the page with your desired marketing campaigns" |

- XA23 scope: Configure the martech plugin and datastream for Journey Optimizer, set up the web surfaces, and launch and test the first web campaigns.

### Real-Time CDP and Edge Delivery Services (`rtcdp-eds`)

How they connect: Web SDK, loaded on Edge Delivery Services by the martech plugin, sends site events to Experience Platform, where they build Real-Time Customer Profiles. [Experience League: AEM Edge Delivery Services MarTech plugin (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/assetmgmt/assetm1/ex5): "The AEM MarTech plugin helps you quickly set up a complete MarTech stack for your AEM project."

What you get together: **Site behavior in every profile.** What visitors do on Edge Delivery pages lands in their profiles, ready for audiences and activation.

Flows:

- Edge Delivery Services to Real-Time CDP: Site behavior events with ECID, through Web SDK and the datastream. [Experience League: AEM Edge Delivery Services MarTech plugin (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/assetmgmt/assetm1/ex5): "View customer profile in Adobe Experience Platform"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA24 | Edge Delivery site events into profiles | one-time | 16 / 32 / 64 | yes | [AEM Edge Delivery Services MarTech plugin (One Adobe tutorial)](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/assetmgmt/assetm1/ex5) | "View customer profile in Adobe Experience Platform" |

- XA24 scope: Map site events to the XDM schema and datastream through the martech plugin, then check that visits build profiles under the agreed identities.

### Coworker and Real-Time CDP (`cw-rtcdp`)

How they connect: Coworker Chat works in Real-Time CDP, helping teams create, optimize and analyze audiences in natural language with approvals. [Experience League Live: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26): "CX Enterprise Coworker extends the value of Real-Time CDP and Journey Optimizer"

What you get together: **Audiences built by asking.** Marketers describe the audience they need and Coworker drafts, builds and checks it for approval, under the client's permissions.

Flows:

- Real-Time CDP to Coworker: Audience and profile data, read under the user's Adobe permissions. [Experience League: What are skills in Coworker?](https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills): "data access remains governed through connected Adobe applications, permissions, and organizational controls"
- Coworker to Real-Time CDP: Audiences created or changed, after approval. [Experience League Live: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26): "create and optimize audiences, analyze customer journeys, and uncover insights faster"

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA25 | Coworker Skills for audience work | one-time | 24 / 48 / 80 | yes | [Experience League Live: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26) | "create and optimize audiences, analyze customer journeys, and uncover insights faster" |

- XA25 scope: Write and test Skills for the client's recurring audience tasks, such as naming, building, sizing and checking audiences, with approval steps.

### Coworker and Journey Optimizer (`cw-ajo`)

How they connect: Coworker Chat works in Journey Optimizer, helping teams create, optimize and analyze journeys in natural language with approvals. [Experience League Live: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26): "CX Enterprise Coworker extends the value of Real-Time CDP and Journey Optimizer"

What you get together: **Journeys drafted and checked faster.** Marketers ask for a journey or a performance read and Coworker drafts the steps, checks them and reports results for approval.

Flows:

- Journey Optimizer to Coworker: Journey, campaign and performance data, under the user's permissions. [Experience League: What are skills in Coworker?](https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills): "data access remains governed through connected Adobe applications, permissions, and organizational controls"
- Coworker to Journey Optimizer: Journey drafts and changes, after approval. [Experience League Live: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26): "Discover how to streamline audience and journey creation and analysis."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA26 | Coworker Skills for journey work | one-time | 24 / 48 / 80 | yes | [Experience League Live: Audience and Journey B2C capabilities in Coworker](https://experienceleague.adobe.com/en/on-demand-events/exl-live-episode-10-08-26) | "Discover how to streamline audience and journey creation and analysis." |

- XA26 scope: Write and test Skills for the client's recurring journey tasks, such as journey drafts, pre-launch checks and performance summaries, with approval steps.

### Coworker and Target (`cw-target`)

How they connect: Coworker Chat is available in Target, both in its own window and inside the Target interface. [Experience League: Coworker Chat overview](https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview): "The following CX Enterprise applications are compatible with Coworker Chat:"

What you get together: **Test work by asking.** Teams ask Coworker about activities and results inside Target and reuse Skills for routine test setup and reporting.

Flows:

- Target to Coworker: Activity and results data, under the user's permissions. [Experience League: What are skills in Coworker?](https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills): "data access remains governed through connected Adobe applications, permissions, and organizational controls"
- Coworker to Target: Requested actions in Target, after approval. [Experience League: Adobe CX Enterprise Coworker overview](https://experienceleague.adobe.com/en/docs/coworker/content/home): "Ask for insights, content, and actions across Adobe applications in natural language."

| ID | Line | Unit | Low / base / high | Default | Page | Quote |
|---|---|---|---|---|---|---|
| XA27 | Coworker Skills for Target testing | one-time | 16 / 40 / 72 | no | [What are skills in Coworker?](https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/what-are-skills) | "Skills are reusable playbooks that help Adobe CX Coworker perform customer experience orchestration tasks consistently and efficiently." |

- XA27 scope: Write and test Skills for the client's routine Target work, such as test briefs, setup checks and results summaries, with approval steps.

## Not documented

- **Customer Journey Analytics and Edge Delivery Services** (`cja-eds`): Experience League and aem.live for Customer Journey Analytics with Edge Delivery Services (Content Analytics overview and configuration tutorial, AEM Sites Web SDK tutorial, aem.live martech integration). The aem.live martech plugin names Adobe Analytics and Experience Platform, not CJA; Content Analytics pages do not mention Edge Delivery. Site events can reach Experience Platform datasets that CJA reads, but no Adobe page describes the pair.
- **Coworker and Adobe Commerce** (`cw-commerce`): Coworker overview, Coworker Chat overview and compatible applications list, Get started with Coworker Chat, Adobe's April 20 2026 Coworker press release. Commerce is not among the compatible applications.
- **Coworker and Brand Visibility** (`cw-bv`): Coworker compatible applications list and press release; Brand Visibility overview and What's new. Neither side mentions the other.
- **Coworker and Sites Optimizer** (`cw-so`): Coworker compatible applications list (lists AEM, not Sites Optimizer), CX Enterprise Coworker and AEM tutorial, press release. No mention of Sites Optimizer.
- **Target and Brand Visibility** (`target-bv`): Brand Visibility overview, What's new, the CJA Brand Visibility integration, web search for Brand Visibility or LLM Optimizer with Target. Brand Visibility documents CJA and Adobe Analytics only.
- **Journey Optimizer and Brand Visibility** (`ajo-bv`): Same Brand Visibility pages and a web search for Brand Visibility or LLM Optimizer with Journey Optimizer. Nothing found.

## Notes and caveats

- Real-Time CDP and Journey Optimizer: Adobe's Use Case Patterns page lists eight patterns that use both, grouped here as XA01 (event-triggered messaging, batch outbound message activation), XA02 (multi-step orchestrated journey, cross-channel journey with decisioning), XA03 (offer decisioning, behavioral recommendation) and XA04 (known-visitor web/app personalization, anonymous visitor web personalization). Each line cites its main pattern page in 'source' and the second in 'more_sources'. The lines cover only the work that joins the two products; the existing Journey Optimizer product lines (journey events, first journeys and campaigns) still cover the base build.
- Brand Concierge and Real-Time CDP: the docs disagree on timing. The release notes list the Real-Time CDP integration as Limited Availability (April 2026), while the FAQ says the current scope is anonymous visitors, with no live profile lookup. XA09 is optional for that reason. XA08 (conversation signals into profiles) rests on the Use Case Patterns page and the GA datastream configuration in the August 2026 release notes.
- Brand Concierge and Journey Optimizer is documented only on business.adobe.com (integrations page and the Mar 17 2026 blog), read through a fetch tool because direct downloads failed; those quotes are as the tool returned them and were not machine-checked. The FAQ lists lead nurturing and retargeting as roadmap, so no service lines were written.
- Brand Concierge and Commerce: an Experience League Commerce learning page (Brand Concierge and Commerce AI overview) carries a Coming Soon badge for live catalog, cart and checkout in conversation; the FAQ says cart and checkout actions are planned. XA13 covers catalog discovery and comparison only, which the August 2026 release notes list as available.
- Brand Concierge and Edge Delivery: the custom block steps come from Adobe's instructor-led One Adobe tutorial (an Edge Delivery site on aem.live with Universal Editor), not product docs. The AEM content ingestion in Composer is product release notes and says AEM, not Edge Delivery specifically.
- Edge Delivery with Target, Journey Optimizer and Real-Time CDP all use the same martech plugin. If several are on the canvas, the plugin, datastream and tags setup is shared, so the canvas could trim hours when XA22, XA23 and XA24 are all on. The aem.live page lists Adobe Analytics among the plugin's prerequisites, and the One Adobe tutorial says the plugin is available through co-innovation projects with AEM Engineering; the aem.live page itself does not say that.
- Target and Journey Optimizer: the Target page for offer decisions carries a Legacy badge on the Target guide and requires Target on the Web SDK (not at.js). Since August 2026 the Adobe Target destination is also open to Journey Optimizer organizations without Real-Time CDP; XA05 covers that audience sharing when Real-Time CDP is present.
- Commerce and Real-Time CDP: the Audience Activation page carries a PaaS only badge (Commerce on Cloud and on-premises), and the Adobe Commerce destination needs Real-Time CDP Prime or Ultimate. XA14 (Data Connection) is also the prerequisite for XA16 (Journey Optimizer), XA17 (CJA) and XA21 (Target); if Real-Time CDP is not on the canvas, the canvas may need to carry the Data Connection setup on those connections.
- Commerce and Target is the thinnest documented pair: one Commerce page lists Target among the Experience Cloud applications that use Data Connection data, with no setup steps. XA21 is optional.
- Commerce and Edge Delivery: the storefront drop-ins need an Adobe Commerce as a Cloud Service or Adobe Commerce Optimizer license (storefront Backend options page). XA18 overlaps the existing Edge Delivery build line where the site and storefront are one project. XA20 sends storefront events to Experience Platform; 'needs' names Real-Time CDP, but the same events also feed Journey Optimizer and CJA.
- Coworker: Adobe's onboarding team sets up the Coworker integrations with Adobe applications and the governance and approval workflows (Coworker overview), so the Coworker lines are Skills, not integration work. In Real-Time CDP and Journey Optimizer the in-product Coworker experience is Coming soon; the immersive experience is available now. Target has both. No Adobe page gives a Target-specific Coworker use case, so XA27 is optional.
- Every Experience League, aem.live and storefront page cited was downloaded on Oct 30 2026, and every quote except the two business.adobe.com quotes was checked word for word against the page text with a script (whitespace, curly quotes and spaces before punctuation normalized).

## Pages that failed

- business.adobe.com: direct download failed with an HTTP/2 stream error; read through the fetch tool instead.
- `commerce-learn/.../brand-concierge-and-commerce-ai-overview`: curl returned 404; the fetch tool returned a Coming Soon page with no setup steps.
- `commerce/audience-activation/overview` (guessed path): 404; the page lives at `commerce-admin/customers/audience-activation`.
