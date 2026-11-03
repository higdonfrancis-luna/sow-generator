# Start from the customer's problem: the problem list (draft, Nov 3 2026)

Phase 1 of the "Start from the customer's problem" idea (mockups in `sow/mockups/nov3_problem/`). Each problem maps to products, connections and services already in the canvas catalog (`sow/canvas/catalog.json`), drafted by one agent and checked by a skeptic against the catalog and sources. Machine-readable copy: `problems.json`. Built Nov 3 as step 40 from `sow/canvas/problems.json`, which rewords every problem and chip in the partner's voice (partners ask on behalf of their clients) and turns each refine chip into products added or removed; this draft stays as the review record.

## 1. When people ask ChatGPT or Perplexity about our category, we don't come up, or a competitor does.
- **Recommended:** play `abv`: Brand Visibility, CDN (outside)
- **Connections:** `cdn-bv`
- **Why:** Brand Visibility tracks how the brand shows up for the prompts buyers ask AI assistants. With the customer's CDN forwarding its logs, it also shows which AI agents read which pages and the visits AI answers send; without them the Agentic Traffic dashboard shows no metrics.
- **Refine:** "They own Customer Journey Analytics" (Switches to the CJA play: adds cja and bv-cja); "Site runs on Edge Delivery Services" (Switches to the AEM play: adds so, eds, bv-eds and so-eds (Sites Optimizer is licensed with AEM Sites as a Cloud Service or Managed Services)); "They sell online with Adobe Commerce" (Switches to the Commerce play: adds commerce and bv-commerce); "Financial services or insurance" (Switches to the FSI play: adds bc and bv-bc)
- **Matches on:** chatgpt, perplexity, ai answers, ai search, not showing up in ai, llm visibility, generative engine optimization, geo, aeo, ai overviews, competitors cited, brand mentions in ai
- **Sources:** https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 2. We can't tell whether traffic from AI assistants turns into sales or leads.
- **Recommended:** play `cja`: Brand Visibility, Customer Journey Analytics, CDN (outside)
- **Connections:** `bv-cja`, `cdn-bv`
- **Why:** Brand Visibility sends aggregate AI-agent activity from CDN logs into CJA through an Experience Platform source, and AI-referred visits and conversions come from CJA's own web data. The data is aggregate, so nothing ties a person to an AI mention, and lift comes only from a test.
- **Refine:** "Deals close in a CRM" (Adds crm and crm-cja so CRM objects join the web data on a shared ID); "Revenue sits in Snowflake, BigQuery or Databricks" (Adds dwh and dwh-cja (Data Mirror)); "Offline results arrive as file drops" (Adds cstore and cstore-cja); "Leadership wants readouts on request" (Switches to Create your own play: adds cw and cw-cja (CJA B2C edition); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas with the CRM, warehouse and cloud storage boxes)
- **Matches on:** ai traffic, ai referrals, chatgpt traffic, ai revenue, roi of ai visibility, attribution, conversions from ai, prove ai impact, business impact
- **Sources:** https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/bv/bv https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 3. Our organic search traffic is dropping as AI overviews answer the question before anyone clicks.
- **Recommended:** play `aem`: Brand Visibility, Sites Optimizer, Edge Delivery Services, CDN (outside)
- **Connections:** `bv-eds`, `so-eds`, `cdn-bv`
- **Why:** Edge Delivery Services builds search in on day one, and Sites Optimizer finds SEO and performance issues as the site grows and, with the Ultimate package, deploys approved fixes to the site's source for the team to publish. Brand Visibility's edge fixes reach the AI assistants Adobe supports at the CDN without changing what people and search engines see.
- **Refine:** "Pages are authored in AEM Sites" (Switches to Create your own play: adds aemsites with aemsites-eds, aemsites-so and aemsites-bv; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Images live in AEM Assets" (Switches to Create your own play: adds aemassets and aemassets-eds; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Need many pages updated quickly" (Switches to Create your own play: adds cw and cw-eds for bulk changes authors review; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas)
- **Matches on:** seo, organic traffic down, search rankings, google ai overviews, zero click, search and ai, found in search, lost traffic
- **Sources:** https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/aemcs-managed-cdn https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 4. Our website is slow, scores poorly on Core Web Vitals and is hard to change.
- **Recommended:** play `aem`: Brand Visibility, Sites Optimizer, Edge Delivery Services, CDN (outside)
- **Connections:** `bv-eds`, `so-eds`, `cdn-bv`
- **Why:** Edge Delivery Services builds a fast, search-ready site, and Sites Optimizer finds SEO and performance issues as it grows and, with the Ultimate package, deploys approved fixes for people to publish. Brand Visibility serves the AI assistants Adobe supports a fuller version of the same pages.
- **Refine:** "They already own AEM Sites" (Switches to Create your own play: adds aemsites and aemsites-eds so AEM stays the content source; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "They also need testing and personalization" (Switches to Create your own play: adds target and target-eds (Web SDK recommended); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Site forms should feed Marketo" (Switches to Create your own play: adds marketo and marketo-eds (AEM Forms needs its own license); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas)
- **Matches on:** slow site, page speed, core web vitals, lighthouse, site performance, replatform, website rebuild, migration, hard to update
- **Sources:** https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/aemcs-managed-cdn https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 5. We have a long list of SEO and content fixes and no developer time to make them.
- **Recommended:** play `aem`: Brand Visibility, Sites Optimizer, Edge Delivery Services, CDN (outside)
- **Connections:** `so-eds`, `bv-eds`, `cdn-bv`
- **Why:** Sites Optimizer connects to the Edge Delivery site's code repository and content source and, with the Ultimate package, deploys approved SEO and content fixes to the source documents or authoring, where the team reviews and publishes them. Brand Visibility covers the AI side of the same pages.
- **Refine:** "Site is on AEM Sites, not Edge Delivery" (Switches to Create your own play: adds aemsites with aemsites-so (fixes land in AEM author) and aemsites-bv, and eds leaves the canvas; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Authors want to make changes by asking" (Switches to Create your own play: adds cw and cw-eds; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas)
- **Matches on:** seo backlog, broken links, metadata, seo audit, technical seo, developer bottleneck, content fixes, site health
- **Sources:** https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/aemcs-managed-cdn https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 6. AI shopping answers get our product details wrong or leave our products out.
- **Recommended:** play `commerce`: Brand Visibility, Adobe Commerce, CDN (outside)
- **Connections:** `bv-commerce`, `cdn-bv`
- **Why:** Brand Visibility compares the Commerce catalog with what AI agents can read on each product page, then serves the AI assistants Adobe supports the missing variants, specifications and attributes at the CDN, with no change to the storefront or the catalog.
- **Refine:** "Storefront runs on Edge Delivery" (Switches to Create your own play: adds eds with commerce-eds and bv-eds; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Want shopping help on the site" (Switches to Create your own play: adds bc with bc-commerce and bv-bc (catalog discovery and comparison; cart and checkout are planned); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Product images live in AEM Assets" (Switches to Create your own play: adds aemassets and commerce-aemassets; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas)
- **Matches on:** product pages, pdp, ai shopping, product details wrong, catalog, ecommerce ai, chatgpt shopping, product attributes
- **Sources:** https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/opportunities/enrich-product-detail-pages https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 7. Our customers have complicated questions about accounts, policies or rates, and they leave the site or call instead.
- **Recommended:** play `fsi`: Brand Visibility, Brand Concierge, CDN (outside)
- **Connections:** `bv-bc`, `cdn-bv`
- **Why:** Brand Concierge answers on the brand's own site from customer-approved sources. Partners check that the questions Brand Visibility tracks in AI assistants are covered by those sources, and test the concierge's answers against them.
- **Refine:** "They run Marketo Engage" (Switches to Create your own play: adds marketo and marketo-bc so engagement becomes Marketo activities; the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Site is on AEM Sites" (Switches to Create your own play: adds aemsites and aemsites-bc (Content AI index); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "They license CJA" (Switches to Create your own play: adds cja and cja-bc to see conversations next to the journey (confirm the data use with Adobe); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas); "Want conversation summaries" (Switches to Create your own play: adds cw and cw-bc (not on Coworker's compatible applications list; confirm); the CDN box is offered only on the Brand Visibility plays, so it leaves the canvas)
- **Matches on:** financial services, insurance, bank, credit union, concierge, chatbot, conversational, ai assistant on site, customer questions, call deflection
- **Sources:** https://experienceleague.adobe.com/en/docs/brand-concierge/content/home https://experienceleague.adobe.com/en/docs/brand-visibility/using/log-forwarding/log-forwarding-overview

## 8. Visitors can't find answers on our site and give up.
- **Recommended:** Create your own play: Brand Concierge, Edge Delivery Services
- **Connections:** `bc-eds`
- **Why:** Brand Concierge loads on an Edge Delivery site in a block the partner builds and can crawl the site's sitemap or URL list as its knowledge source, so it answers from the published site content.
- **Refine:** "Also want to show up in AI assistants" (Adds bv with bv-bc and bv-eds); "They sell online with Adobe Commerce" (Adds commerce and bc-commerce); "Financial services or insurance" (Switches to the FSI play: bv and bc with bv-bc, the CDN box offered; eds leaves the canvas)
- **Matches on:** site search, find answers, faq, self service, chat on site, conversational search, help visitors, bounce
- **Sources:** https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2

## 9. Our marketing team spends too much time on routine work inside Adobe apps.
- **Recommended:** play `coworker`: Coworker
- **Connections:** 
- **Why:** Coworker works inside the client's Adobe apps, so the services depend on which apps they own; each chip below adds a documented connection.
- **Refine:** "They own CJA" (Switches to Create your own play: adds cja and cw-cja); "They run AEM Sites" (Switches to Create your own play: adds aemsites and aemsites-cw); "They run Marketo Engage" (Switches to Create your own play: adds marketo and marketo-cw); "They run Workfront" (Switches to Create your own play: adds workfront and workfront-cw (Adobe says Coworker is not currently offered to health care, finance or some other industries))
- **Matches on:** productivity, busywork, ai agent, coworker, save time, automation, small team, do more with less
- **Sources:** https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview

## 10. Leaders wait days for the same reports, and analysts spend their week rebuilding them.
- **Recommended:** Create your own play: Coworker, Customer Journey Analytics
- **Connections:** `cw-cja`
- **Why:** Coworker Chat reads CJA directly, and partner-built Skills turn the client's agreed measures in a validated data view into a repeatable readout. It needs CJA B2C edition and a Coworker Chat license.
- **Refine:** "Include the AI channel" (Adds bv and bv-cja (its CJA source needs CDN logs, which only the CJA play offers as a CDN box)); "Journeys run in Journey Optimizer" (Adds ajo and ajo-cja)
- **Matches on:** reporting, dashboards, analyst backlog, readouts, weekly report, self service analytics, insights faster
- **Sources:** https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows

## 11. Our website shows every visitor the same thing.
- **Recommended:** Create your own play: Real-Time CDP, Target, AEM Sites
- **Connections:** `rtcdp-target`, `aemsites-target`, `aemsites-rtcdp`
- **Why:** AEM Sites behavior builds Real-Time CDP profiles, Real-Time CDP shares audiences with Target, and AEM exports Experience and Content Fragments to Target as offers.
- **Refine:** "Site runs on Edge Delivery" (Adds eds with target-eds and rtcdp-eds); "Measure lift on the whole journey" (Adds cja and target-cja); "They run Marketo lists" (Adds marketo and marketo-target (needs Adobe organization mapping))
- **Matches on:** personalization, personalize, one size fits all, a/b testing, testing, targeting, known customers, relevance
- **Sources:** https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/personalization/adobe-target-connection https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-target https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/known-user-personalization

## 12. Our emails and messages go out on a calendar, not when the customer actually does something.
- **Recommended:** Create your own play: Real-Time CDP, Journey Optimizer
- **Connections:** `rtcdp-ajo`
- **Why:** Journey Optimizer and Real-Time CDP share Experience Platform profiles, identities and audiences, so journeys can start from what the customer does.
- **Refine:** "Measure journeys end to end" (Adds cja and ajo-cja); "Email images come from AEM Assets" (Adds aemassets and aemassets-ajo); "B2B data lives in Marketo" (Adds marketo and marketo-ajo); "Reuse site content in messages" (Adds aemsites and aemsites-ajo)
- **Matches on:** journeys, triggered messages, real time, omnichannel, email, push, sms, orchestration, next best message
- **Sources:** https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/batch-outbound-message-activation

## 13. Shoppers leave items in their carts and we never follow up.
- **Recommended:** Create your own play: Adobe Commerce, Journey Optimizer, Real-Time CDP
- **Connections:** `commerce-ajo`, `commerce-rtcdp`, `rtcdp-ajo`
- **Why:** Commerce events sent through Data Connection reach Journey Optimizer to start email or push journeys such as abandoned cart, and Audience Activation brings Real-Time CDP audiences back into Commerce (Commerce on Cloud or on-premises).
- **Refine:** "See shopping in the full journey" (Adds cja and commerce-cja); "Test store content" (Adds target and target-commerce (to prove in a pilot)); "AI assistants misread product pages" (Adds bv and bv-commerce)
- **Matches on:** abandoned cart, cart abandonment, win back, ecommerce, shoppers, conversion rate, retargeting
- **Sources:** https://experienceleague.adobe.com/en/docs/commerce/data-connection/use-cases/using-ajo https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/batch-outbound-message-activation

## 14. Content takes too long to get from request to launch.
- **Recommended:** Create your own play: Workfront, AEM Assets, AEM Sites
- **Connections:** `aemassets-workfront`, `aemsites-workfront`, `aemsites-aemassets`
- **Why:** Workfront sends finished work with mapped metadata into AEM Assets, Sites authors use approved assets from a remote AEM Assets environment in pages, and Universal Editor content can link to Workfront tasks where Adobe enables the Early Access plugin.
- **Refine:** "Campaigns run in Marketo" (Adds marketo with marketo-workfront and aemassets-marketo); "Approved work feeds journeys" (Adds ajo with workfront-ajo (Workfront Fusion license) and aemassets-ajo); "Teams want to work by asking" (Adds cw with workfront-cw and aemassets-cw)
- **Matches on:** content supply chain, approvals, workflow, creative requests, project management, review cycles, time to market, dam
- **Sources:** https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/configure-integrations/configure-aacs-integration https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/page-editor-universal-editor https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-remote-approved-assets-with-sites

## 15. Teams keep using old or off-brand images across the site and email.
- **Recommended:** Create your own play: AEM Assets, AEM Sites, Journey Optimizer
- **Connections:** `aemsites-aemassets`, `aemassets-ajo`
- **Why:** Sites authors place approved assets from a remote AEM Assets environment through Dynamic Media with OpenAPI, and Journey Optimizer's Email Designer picks assets from the same repository, depending on the contract.
- **Refine:** "Email runs in Marketo" (Adds marketo and aemassets-marketo); "Product images in Commerce" (Adds commerce and commerce-aemassets (synced by SKU)); "Site runs on Edge Delivery" (Adds eds and aemassets-eds)
- **Matches on:** brand consistency, off brand, outdated images, asset management, dam, digital assets, brand governance, single source of truth
- **Sources:** https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-remote-approved-assets-with-sites https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/content-integrations

## 16. Our B2B leads go cold, and marketing and sales don't see the same picture of the buyer.
- **Recommended:** Create your own play: Marketo Engage, Real-Time CDP
- **Connections:** `marketo-rtcdp`
- **Why:** The Marketo Engage source brings people and activity data into Experience Platform, and the Marketo Engage destination sends Real-Time CDP people audiences back to Marketo; using all Marketo datasets needs Real-Time CDP B2B Edition.
- **Refine:** "Site forms should feed Marketo" (Adds eds and marketo-eds); "Concierge conversations as lead activity" (Adds bc and marketo-bc); "Report marketing next to web data" (Adds cja and marketo-cja); "Personalize the site for Marketo lists" (Adds target and marketo-target)
- **Matches on:** b2b, lead nurturing, lead scoring, marketo, mql, demand gen, account based, buying group, pipeline
- **Sources:** https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/marketo/marketo

## 17. We can't see which channels and pages actually drive results.
- **Recommended:** Create your own play: Customer Journey Analytics, AEM Sites, Journey Optimizer
- **Connections:** `aemsites-cja`, `ajo-cja`
- **Why:** CJA reads AEM Sites page views and clicks through Experience Platform, and Journey Optimizer data lands in datasets that CJA reports on when CJA reporting is enabled.
- **Refine:** "Leads in Marketo" (Adds marketo and marketo-cja); "Orders in Adobe Commerce" (Adds commerce and commerce-cja); "Include AI assistants as a channel" (Adds bv and bv-cja); "Measure tests too" (Adds target and target-cja)
- **Matches on:** measurement, attribution, cross channel, analytics, customer journey, marketing roi, which channel works, reporting across tools
- **Sources:** https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform/web-sdk https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/ajo

## 18. Our customer data is scattered across the website, email, CRM and the warehouse.
- **Recommended:** Create your own play: Real-Time CDP, Customer Journey Analytics, AEM Sites, Journey Optimizer
- **Connections:** `aemsites-rtcdp`, `rtcdp-ajo`, `rtcdp-cja`
- **Why:** AEM Sites behavior builds Real-Time CDP profiles, Journey Optimizer shares the same Experience Platform profiles, identities and audiences, and audience analysis brings Real-Time CDP audiences into a CJA connection while CJA audiences go back to the profile. CRM and warehouse feeds are outside systems, which the canvas offers on the CJA play only.
- **Refine:** "Leads in Marketo" (Adds marketo and marketo-rtcdp); "Orders in Adobe Commerce" (Adds commerce and commerce-rtcdp); "Site runs on Edge Delivery" (Adds eds and rtcdp-eds)
- **Matches on:** customer data, cdp, single view, 360, data silos, profiles, first party data, identity, audiences
- **Sources:** https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/known-user-personalization https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/campaign-orchestration-patterns/batch-outbound-message-activation https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/audience-analysis/audience-analysis-overview

## 19. Our online store is slow and marketers need developers to change it.
- **Recommended:** Create your own play: Adobe Commerce, Edge Delivery Services
- **Connections:** `commerce-eds`
- **Why:** The Adobe Commerce storefront runs on Edge Delivery Services, which serves pages built for speed while drop-ins request catalog and shopping data from Commerce, and authors edit content as documents. Drop-ins need Commerce as a Cloud Service or Commerce Optimizer.
- **Refine:** "Product pages wrong in AI answers" (Adds bv with bv-commerce and bv-eds); "Product images in AEM Assets" (Adds aemassets with commerce-aemassets and aemassets-eds); "Shopping help on the site" (Adds bc with bc-commerce and bc-eds)
- **Matches on:** storefront, headless commerce, store speed, merchandising, ecommerce site, replatform store, marketers edit store
- **Sources:** https://experienceleague.adobe.com/developer/commerce/storefront/get-started/architecture
