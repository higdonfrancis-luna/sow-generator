# Experience League sweep: missing products and services

Checked 19 Nov 2026. This builds on PRODUCT_COVERAGE.md (17 Nov) and does not repeat it. Eight areas were swept: Commerce, AEM, Experience Platform, Analytics, Journeys and Campaign, Marketo and Workfront, Content and Creative, and AI. Each area then had a skeptic pass. Every item below comes from an Adobe page saved in `ai_hosts/pages`, and its quote was matched word for word with `found()`. Full quotes and page addresses are in each area's report and its `VERIFY.md` under this folder. Nothing in the tool was changed.

"Judgment" marks a ranking or opinion that is mine, not Adobe's.

---

## 1. Coverage: every product area

**In** = the tool has it (product id). **Missing** = partner work, no card or line. **Not partner work** = licence capacity, retired, or delivered by Adobe.

| Area | In the tool | Missing (partner work) | Not partner work |
|---|---|---|---|
| **Commerce** | commerce (all hosting types; B2B CE06; Live Search CE05; Catalog Service; Payment Services, generic only in CE03; Product Recommendations, no line; Merchandising Services/CCDM, no line; Page Builder, Staging, price rules, no line; Fastly, New Relic, scan and patch tools, partly in CE07), commerce-rtcdp (Data Connection, Audience Activation), commerce-aemassets, commerce-eds, commerce-aemsites (CIF), commerce-crm (App Builder, starter kit) | Move to Commerce as a Cloud Service (tools and steps); ERP / order system outside box; HIPAA-Ready add-on; Optimizer and Intelligence (already in PRODUCT_COVERAGE) | Experimentation add-on (PaaS; product not named by Adobe) |
| **AEM** | aemsites (CS, 6.5 LTS, 6.5), eds, aemassets (incl. Content Hub AS05), aemforms (incl. EDS Submissions add-on), so (incl. Preflight), CIF, Content AI (only via AXE03), desktop app (XJ21), App Builder (inside SI09, XC16) | AEM Screens; Extended Security / Healthcare / Customer Managed Keys; Content Automation by FFS; Dynamic Media Classic move; Learning Manager (sold as AEM Sites add-on); Guides and Modernization Agent (already in PRODUCT_COVERAGE) | Assets Essentials (standalone renewal only), Brand Portal (maintenance mode), Asset Share (Content Hub replaces it), extra publish region / 99.99% SLA, environment and storage add-ons, Personalized Media (renewal only), Document Security for Office (6.5) |
| **Experience Platform** | rtcdp (B2C, B2B, B2P; Prime, Ultimate), collab, cja, ajo, mmm, data collection under aa, Customer Attributes (only CR1, XM32) | Event forwarding (a line on rtcdp; a box only for AEP Collection Enterprise); Privacy and Security Shield / Healthcare Shield; Profile Orchestration; Audience Manager Expanded Activation; Process Manager (beta); Customer AI, computed attributes, look-alikes, Mobile SDK, Edge Network API (included features with no line); Data Distiller and Federated Audience Composition (already in PRODUCT_COVERAGE) | Attribution AI (no longer sold), AEP Intelligence (old pack), Visitor ID Service (old), Audience Library, Growth Credits and other capacity |
| **Analytics** | aa (all tiers; Evolution licence, not named), cja (Report Builder named, not priced), ca, mmm | CJA B2B Edition; Streaming Media add-ons (aa and cja); Conversation Insights (CJA, beta); Data Repair API; Adobe Advertising (DSP, Search Social & Commerce, Analytics for Advertising); Audience Manager with People-Based Destinations | Live Stream and Predictive Workbench add-ons, Extended Data Capacity, Advertising Creative (media-team work) |
| **Journeys and Campaign** | ajo (all packages; Decisioning only as XA03 on rtcdp-ajo; Orchestrated campaigns only as DW2), xa, ajob2b, target (incl. Recommendations), Target MCP (connections, no lines) | Journey Optimizer Loyalty; Adobe Campaign v8 / v7 / Standard with its add-ons (Campaign already in PRODUCT_COVERAGE); Shields; AJO B2B In-CRM Insights; Target AI activities (Auto-Target, Automated Personalization) | Message Export, High Throughput, Rapid Delivery, Deliverability packages (Adobe-delivered), capacity add-ons |
| **Marketo and Workfront** | marketo (incl. Lifecycle Modeler, sandbox, Veeva named), mmeasure (Tier 1, 2, Ultimate), moptimizer, mqualifier, workfront (incl. Proof legacy), planning | Dynamic Chat; Sales Insight / Sales Insight Actions; Target Account Management; Interactive Webinars; Workfront Data Connect (only WP06 today); dedicated IP and deliverability; Website Personalization and Predictive Content; Sales Connect; Advanced BI Analytics; Workspaces; custom objects; mobile push; Learning Manager; Fusion (already in PRODUCT_COVERAGE) | Performance packages, Database Encryption (now standard), extra retention, instances, users, API calls; Workfront Goals (no longer sold); Scenario Planner and HIPAA / BYOK (features, not add-ons) |
| **Content and Creative** | gspm (incl. App Builder extensions and Experience API as features), creativecloud (incl. Dimension, XD), express, fireflycp (incl. Substance 3D API), frameio, acrobat (Services APIs), acrobatsign | Substance 3D Collection for enterprise | Adobe Stock (too thin for a box), Premium Learning (Adobe-delivered training), Firefly Graph (a note on FP04) |
| **AI** | cw (Chat; Projects, no line; Coworker for AI Platforms CW08; MCP servers and skills), bc, bv | Adobe LLM Apps; Coworker Projects (line); Adobe Pass (TV sign-in, niche); Coworker for teams and the Copilot Marketing Agent (already in PRODUCT_COVERAGE) | Experience Platform Agents / AI Assistant (replaced by Coworker), AI Credits (licence) |

---

## 2. Missing products ranked by partner work

The ranking is judgment, based on how much build and run work Adobe's pages describe. Items already ranked in PRODUCT_COVERAGE.md are only listed where this sweep adds something.

### Add

**1. Move to Adobe Commerce as a Cloud Service** (lines on the Commerce card, not a box). Adobe's docs say custom code is rebuilt as App Builder apps, the storefront is rebuilt on Edge Delivery, data is loaded in and integrations are rebuilt. It is also one of two ways out of the On Cloud upgrade deadlines (section 4).
- Migration assessment and plan: "Every Adobe Commerce as a Cloud Service migration begins with an assessment." (commerce/cloud-service/migration/overview)
- Size by Adobe's complexity rating; High means 12 to 24 months (…/migration-tools/assessment)
- Rebuild custom code as App Builder apps, "typically the most significant engineering effort" (…/migration/overview)
- Review the code made by the Commerce Developer Agent before production (developer.adobe.com/commerce/extensibility/developer-agent)
- Data migration: store settings are rebuilt by hand first, then the bulk tool, Early Access through Adobe's CDE team (…/bulk-data/migration-tool)
- Custom-table data from outside extensions needs a custom App Builder build (…/migration/overview)
- Storefront rebuild (reuse XA18) and integration rebuild (…/migration/overview)
- Cutover and retiring the old platform (…/migration/overview)
- Adobe names partners in the work: "collaborative activities between Adobe, partners, and customer engineering teams" (…/migration/overview)

**2. Adobe LLM Apps** (new box or AEM Sites lines). Lets a brand offer actions such as product search, stock checks or bookings inside ChatGPT and Claude. Free to all AEM Sites Cloud Service clients for now; Adobe says app calls will later count toward AEM Sites content requests, with the rate not yet announced. Catalog has 0 mentions.
- Review the actions Adobe suggests from the website before deployment (llm-apps/…/build-first-app/creating-actions)
- Connect the handlers to the client's real systems; they start on sample data and are not linked to "production APIs, live inventory, payment services, or booking systems" (same page)
- Brand the widgets on Edge Delivery (…/customize-generated-app/widgets)
- Code in the client's own repositories in Cloud Manager, if wanted (…/build-first-app/create-app)
- Deploy to Stage, test through the MCP server address, then Production (…/deploy-and-test/deploy-your-app)
- Analytics setup: send events to Adobe Analytics or CJA through a datastream the client owns (…/measure-your-app/analytics-setup)
- Ongoing review of trigger counts, success and abandonment rates (llm-apps/using/overview). Monthly cadence is judgment.
- Connects to: aemsites, eds, aa, cja, commerce, chatgpt, claude.

**3. ERP / order system** (new outside box, connection commerce-erp). Adobe's developer docs use the ERP as their main Commerce integration example.
- Order and customer sync to the ERP with Commerce events (developer.adobe.com/commerce/extensibility/events)
- Live stock, price, tax or payment checks with webhooks (…/webhooks)
- Back-office integration on the starter kit (…/starter-kit/integration)
- Admin screens to set up and watch the sync, with the Admin UI SDK (…/admin-ui-sdk)

**4. Event forwarding** (a line on rtcdp; a box only for AEP Collection Enterprise clients). Corrects PRODUCT_COVERAGE item 11: it is a standard feature of every Real-Time CDP package (500 outgoing calls per profile a year). Catalog has 0 mentions.
- Edge property, datastream link, rules and extensions (experience-platform/tags/event-forwarding/getting-started)
- Each non-Adobe endpoint, for example Meta's conversion API (same page)
- Testing before go-live, which Adobe puts on the client (helpx AEP Collection Enterprise product description)

**5. Privacy and Security Shield / Healthcare Shield** (optional lines on rtcdp, ajo, cja). Must be bought with each Real-Time CDP, Journey Optimizer and CJA licence. The tool names Healthcare Shield only as a prerequisite.
- Customer-managed key setup in Azure Key Vault or AWS KMS (experience-platform/…/customer-managed-keys/overview); cannot be undone, so a client sign-off step
- Consent policies and enforcement on activation, only with a Shield (experience-platform/data-governance/enforcement/auto-enforcement)
- Test that profiles without consent are left out of each destination (same page)

**6. Journey Optimizer Loyalty** (lines on the ajo card). Paid add-on for loyalty challenges. Today only XA39, which needs Coworker.
- Loyalty setup: reward fulfillment, event mapping, product inventory, exclusions (journey-optimizer/…/loyalty-challenges/configure-integrate-loyalty/loyalty-admin)
- Reward provider link to the client's loyalty platform (same page)
- Monthly review of challenge dashboards (…/loyalty-challenges/get-started)

**7. CJA B2B Edition** (picker or lines on cja). Paid add-on; no Real-Time CDP B2B licence needed.
- B2B data model and main account ID, often from the CRM (analytics-platform/…/cja-b2b/cja-b2b-transition)
- New account-based connection, data views and projects; existing connections cannot be switched (same page)
- Account journey reports and training (…/cja-b2b/cja-b2b-edition)

**8. Streaming Media add-ons** (optional lines on aa and cja). Today only inside Coworker line XA31.
- Confirm the add-on is bought (media-analytics/using/media-overview)
- Player tracking with the Media Edge SDK or API (media-analytics/using/implementation/overview)
- Size by media starts (helpx CJA product description)

**9. Marketo Engage add-ons** (lines on the marketo card):
- Dynamic Chat: Admin Console setup and Marketo link; dialogues, live chat routing, meeting booking; chat activity into programs (marketo/…/dynamic-chat/…)
- Sales Insight / Sales Insight Actions: package install in the CRM, sandbox first; Actions setup, needs the Salesforce sync running (marketo/…/marketo-sales-insight/…)
- Target Account Management: account score, CRM field, named accounts, account lists (marketo/…/target-account-management/setup/getting-started-with-tam)
- Interactive Webinars: setup, organization templates, first event (marketo/…/interactive-webinars/get-started-with-interactive-webinars)

**10. Workfront Data Connect** (line on workfront). Paid; included in Workflow Ultimate. Today only for Planning (WP06).
- Snowflake reader account and BI link; export to the client's warehouse (workfront/using/reporting/data-lake/data-lake-overview)

**11. Adobe Campaign add-ons** (Campaign itself is already Add #2 in PRODUCT_COVERAGE). Build tasks from Adobe's v8 implementation guide (campaign-v8/config/implement/implement): instance setup, data model, subscriptions and landing pages; package promotion between environments (…/architecture). Paid add-ons, each its own setup:
- Transactional Messaging (Message Center): event types, templates, test, publish (…/send/real-time/transactional)
- Interaction offer engine: offer spaces and rendering (…/offers/interaction)
- Distributed Marketing: central campaign catalog for local teams (helpx Campaign product description)
- Enhanced Security: customer keys and VPN (same)
- CRM connector sync for Dynamics 365 or Salesforce (…/connect/ac-crm/crm)
- Federated Data Access to an outside database or Snowflake (…/connect/integration)
- Campaign transactional messages triggered from Journey Optimizer (…/connect/ac-ajo)

### Maybe

12. **AEM Screens** (digital signage, per player, only on AEM Sites or Assets Enterprise). Corrects PRODUCT_COVERAGE, which said no docs: they sit under experience-manager-cloud-service/content/screens-as-cloud-service. Add-on and program setup; Services Provider link, with a CDN rule if publish is IP-limited; projects, channels and locations; player rollout and upkeep, which Adobe leaves to the client.
13. **Extended Security / Healthcare / Customer Managed Keys for AEM** (lines on aemsites, aemforms, aemassets). WAF rules need this licence (…/security/traffic-filter-rules-including-waf); customer keys cannot be undone (helpx AEM product description); HIPAA configuration review (…/compliance/hipaa/hipaa-readiness).
14. **Adobe Commerce HIPAA-Ready** (On Cloud and Managed Services only). Entitlement check and install; review which features it turns off; remove Product Recommendations; audit log setup; HIPAA-ready Data Connection (commerce-admin/start/compliance/hipaa-ready-service/overview).
15. **Conversation Insights** (CJA, Limited Testing). Instrument the agent app (…/conversation-insights/implement); configure in CJA (…/configure); Brand Concierge or own-agent conversations into CJA, a native route for cja-bc. Volume packs.
16. **Adobe Advertising** (already Maybe #14 in PRODUCT_COVERAGE). Adds: move Analytics for Advertising to Web SDK; Advertising with CJA, Adobe account team does first setup; Real-Time CDP audiences into the DSP; conversion metrics and offline conversion uploads; ChatGPT Ads through the DSP (advertising/…).
17. **Audience Manager** (already Maybe #15). Adds: Expanded Activation (experience-platform/expanded-activation/overview), People-Based Destinations (premium), Audience Analytics into aa.
18. **Adobe Learning Manager** (already Maybe #16). Corrections: sold only as an add-on to AEM Sites (helpx AEM product description; renamed ALM Prime 28 Aug 2026, plus ALM Ultimate); the AEM link Adobe documents is AEM Sites, not Assets (no Assets link found, which is absence of proof, not proof). Services: site setup; Workday, Salesforce, ADFS connectors; migration from another LMS; learning site on AEM Sites; paid courses through Commerce; learning data into Marketo; Power BI reports (learning-manager/using/integration/…).
19. **Substance 3D Collection for enterprise.** Shared material libraries and studio configuration rollout; moving off old licence keys; brand material library (SBSAR); plugins for 3D tools and game engines; digitizing materials in Sampler. The Automation Toolkit comes with the plan but has no setup page.
20. **Profile Orchestration** (Real-Time CDP add-on). Product description only, no setup guide.
21. **Process Manager** (beta). Chained ingestion, Data Distiller, segmentation and export flows. Line on rtcdp or a Data Distiller card.
22. **Content Automation by FFS** (AEM Assets add-on). Photoshop API actions on AEM assets. Product description only.
23. **Data Repair API** (aa). Paid. Fix collection first, then repair jobs.
24. **Smaller Marketo add-ons:** dedicated IP and seed testing (Adobe consultants do part of it), Website Personalization and Predictive Content (RTP tag), Sales Connect, Advanced BI Analytics.
25. **Dynamic Media Classic to Dynamic Media move**: a migration line on the Dynamic Media maybe (dynamic-media-classic/using/upgrade/upgrade).
26. **AJO B2B In-CRM Insights**: rollout in Salesforce or Dynamics 365 (new connection crm-ajob2b).

### Skip (judgment)

Assets Essentials (a note on workfront and ajo), Brand Portal, Asset Share, Adobe Stock, Premium Learning, Firefly Graph, Live Stream / Predictive Workbench, Deliverability packages (but trim JO03 warmup, section 4), Attribution AI, Adobe Pass (TV-industry sign-in; REST API v1 and AccessEnabler SDKs end by end of 2026; niche).

---

## 3. Service gaps on products already in the tool

One line each. Page paths are under experienceleague.adobe.com/en/docs unless the host is named.

**Commerce (commerce)**
- One-time upgrade project, including the PHP, MariaDB, OpenSearch, Redis and RabbitMQ upgrades Adobe now requires (commerce-operations/release/planning/security-enforcement-policy). Planning is already in CE07.
- Go-live on Cloud: Fastly, DNS and TLS cutover (commerce-on-cloud/user-guide/launch/checklist)
- Fastly CDN and WAF setup, required for PCI (commerce-on-cloud/user-guide/cdn/fastly)
- Security Scan registration and scheduled scans from UAT (commerce-on-cloud/user-guide/launch/overview)
- Pre-launch load, stress and penetration testing (commerce-on-cloud/user-guide/develop/test/guidance)
- Payment Services onboarding, sandbox to live (commerce/payment-services/get-started/onboard)
- Product Recommendations setup, incl. event collection on non-Luma storefronts (commerce/product-recommendations/admin/create)
- Merchandising Services (CCDM) setup on Cloud Service: catalog views, policies, rules, facets, synonyms (commerce-admin/merchandising-with-ccdm/overview)
- Monthly feed monitoring and resync (commerce/saas-data-export/overview)
- Promotions: cart and catalog price rules, coupons (commerce-admin/marketing/promotions/cart-rules/price-rules-cart)
- On-premises environment build (commerce-operations/installation-guide/overview)
- Move custom extension code to App Builder with the Commerce Developer Agent, outside a full Cloud Service move (developer.adobe.com/commerce/extensibility/developer-agent)

**AEM Sites (aemsites)**
- Code refactoring for the move to Cloud Service: Dispatcher Converter, Repository Modernizer, Index Converter (experience-manager-cloud-service/content/migration-journey/implementation). SI03 moves content only.
- Upgrade to 6.5 LTS with AEM Analyzer (experience-manager-65-lts/…/upgrade-planning). Adds proof to PRODUCT_COVERAGE's gap.
- Advanced networking: VPN, dedicated egress IP, flexible port (…/security/configuring-advanced-networking)
- Log forwarding to Splunk, Datadog and others (…/implementing/developing/log-forwarding)
- AEM Edge Functions at the CDN, included in the licence, also for eds (…/implementing/developing/edge-functions)
- Client's own CDN in front of publish: new connections cdn-aemsites and cdn-eds (…/implementing/content-delivery/cdn)
- Headless delivery to apps with Content Fragments and GraphQL (…/headless/journeys/developer/overview)
- Content AI APIs for the client's own AI search or chat (experience-manager-content-ai/using/introduction)
- AI translation through the client's LLM with style guides, a variant of SI08 (…/translation/ai-translation-integration)
- LLM Apps, if not a box (section 2, item 2)

**Edge Delivery (eds)**
- Generate Variations and Edge Delivery experiments (…/ai-in-aem/generate-variations/generate-variations-integrated-editor)

**Sites Optimizer (so)**
- Preflight in document authoring (Sidekick plugin) and on Managed Services (experience-manager-sites-optimizer/…/preflight/setup)
- One monthly line for engagement, security and Core Web Vitals opportunities; SO2 is SEO only (…/opportunity-types/engagement, security-posture, site-health)

**AEM Assets (aemassets)**
- Smart Tags training on the client's taxonomy (…/assets/manage/smart-tags)
- Upgrade existing clients to Assets Ultimate (…/assets/enable-assets-ultimate)

**Real-Time CDP (rtcdp)**
- Event forwarding line (section 2, item 4)
- Consent from the client's consent platform into profiles, general line (experience-platform/landing/governance-privacy-security/consent/adobe/overview). Exists today only on connection lines.
- Privacy Service setup for access and delete requests on Platform data (experience-platform/privacy/home)
- Moving configuration between sandboxes (experience-platform/sandbox/ui/sandbox-tooling); a Coworker route also exists, needing the Adobe CXO plugin (coworker/…/sandbox-tooling)
- Identity graph linking rules (experience-platform/identity/features/identity-graph-linking-rules/overview)
- Data expiry settings and licence-usage watching without Coworker (experience-platform/landing/license/data-management-best-practices)
- Customer AI propensity models, included (experience-platform/intelligent-services/customer-ai/overview)
- Computed attributes (experience-platform/profile/computed-attributes/overview)
- Look-alike audiences, general line (experience-platform/segmentation/types/lookalike-audiences)
- B2B: account profiles and account audiences for clients without AJO B2B (experience-platform/rtcdp/account/account-profile-overview)
- Add daily health checks to RT06 (experience-platform/run-and-operate/overview)

**Adobe Analytics and data collection (aa)**
- Mobile SDK implementation and Assurance testing; also feeds rtcdp, cja, ajo (platform-learn/implement-mobile-sdk/overview; analytics/implementation/aep-edge/mobile-sdk/overview)
- Move off retired mobile SDKs (developer.adobe.com/client-sdks)
- First-party device IDs on the client's server or CDN (platform-learn/data-collection/edge-network/generate-first-party-device-ids)
- Server-side collection with the Edge Network API (developer.adobe.com/data-collection-apis/docs)
- Advertising Analytics: Google Ads and Microsoft Advertising data, new aa-ads connection (analytics/integration/advertising-analytics/overview)
- Offline data with Data Sources, possible crm-aa (analytics/import/data-sources/overview)
- Bulk Data Insertion API for server-side and history loads (analytics/import/bulk-data-insert)
- Activity Map setup (analytics/analyze/activity-map/activity-map)
- Brand Visibility traffic into Analytics, new aa-bv connection; paid offer only (brand-visibility/using/resources/adobe-analytics-integration)

**Customer Journey Analytics (cja)**
- Full-table exports to cloud storage or Snowflake, outbound cja-cstore / cja-dwh (analytics-platform/…/export/export-cloud; …/exports/manage-exports)
- Report Builder for Excel rollout (analytics-platform/using/cja-reportbuilder/rb-overview)

**Marketing Campaign Analytics (mmm)**
- Full-funnel model setup, GA Oct 2026 (marketing-campaign-analytics/using/models/build; …/releases/latest)
- Channel adstock tuning (same build page)

**Journey Optimizer (ajo)**
- Decisioning on the AJO card; XA03 sits only on rtcdp-ajo (journey-optimizer/…/experience-decisioning-landing-page)
- Move from Decision management to Decisioning (journey-optimizer/using/decisioning/gs-decision)
- Orchestrated campaigns data setup by file or cloud storage; DW2 covers the warehouse route only (…/orchestrated-campaigns/data-configuration/schemas-datasets/gs-schemas)
- API-triggered transactional campaigns from the client's order system (…/api-triggered-campaigns/api-triggered-campaigns)
- App work for push, in-app and code-based experiences (journey-optimizer/using/get-started/by-role/developer)
- Content and journey migration from another platform (journey-optimizer/using/get-started/migrate-content-and-journeys)
- Message archiving to the client's storage (…/configuration/archiving/archiving-overview)
- First design of conflict rules, priority scores and journey capping (…/conflict-prioritization/gs-conflict-prioritization)
- WhatsApp, LINE and iOS Live activities; copy MO09 (…/channels/gs-channels)

**Journey Optimizer B2B (ajob2b)**
- SMS channel: Sinch, Twilio or Infobip (journey-optimizer-b2b/user/admin/channels/configure-channels-sms)
- WhatsApp channel (…/configure-channels-whatsapp)
- In-CRM Insights rollout, crm-ajob2b (…/buying-groups/incrm-insights)
- GenStudio email workflow, new gspm-ajob2b connection (…/genstudio-email-workflow)
- Several Marketo instances behind one B2B Edition raises XH05 (…/admin-setup/setup-ultimate)

**Target (target)**
- Move from at.js 2.x to Web SDK (target-dev/developer/client-side/aep/aep-web-sdk-overview)
- Server-side or hybrid Target, feature flags, on-device decisioning (target-dev/developer/server-side/server-side-overview)
- Target in mobile apps (target-dev/developer/overview)
- AI activities: Auto-Target and Automated Personalization, Premium (target/using/activities/target-activities-guide)
- Hosts, environments, response tokens: add to TG02 (target/using/administer/administrating-target)

**Marketo Engage (marketo)**
- AWS move readiness for clients not yet moved (marketo/using/getting-started/things-to-know/aws-migration)
- Move templates to the new Email Designer (marketo/…/email-designer/overview)
- Workspaces and person partitions design (marketo/…/understanding-workspaces-and-person-partitions)
- Custom objects design (marketo/…/understanding-marketo-custom-objects)
- Veeva CRM sync, on crm-marketo (marketo/…/veeva-crm-sync/understanding-the-veeva-crm-sync)
- Mobile push and in-app messages (marketo/…/mobile-marketing/admin/…)

**Marketo Measure (mmeasure)**
- Move from Tier 1 or 2 to Ultimate (marketo-measure/…/migration-from-tier-to-marketo-measure-ultimate)
- Boomerang stages, Tier 2 (marketo-measure/…/boomerang/setting-up-boomerang-stages)
- Account-based attribution, Tier only (marketo-measure/…/account-based-marketing-overview)
- Snowflake direct share, possible mmeasure-dwh (marketo-measure/…/data-warehouse-access-direct-share)

**Marketo Optimizer (moptimizer)**: Scoring Studio models, a Labs feature (marketo-optimizer/user/data-foundation/marketo-interoperability)

**Marketo Qualifier (mqualifier)**: Smart audience lists, beta (marketo-qualifier/using/smart-audience)

**Workfront (workfront)**
- Rebuild Fusion scenarios built on Proof before the move to Adobe cloud storage (workfront/…/fusion-remediation-for-unified-approvals)
- Data import with Kick-Starts (workfront/…/kick-starts/import-data-via-kickstarts)
- Environment promotion, Prime and Ultimate (workfront/…/testing-environments/environment-promotion)
- Business rules (workfront/…/configure-system-defaults/business-rules)
- Financial management, Ultimate (workfront/…/enterprise-operations-capabilities-overview)
- Resource management (workfront/using/manage-resources/…/get-started-resource-planning)
- Custom localization, Prime and up (workfront/…/configure-custom-localization)
- Scenario Planner (workfront/using/scenario-planner/get-started-with-scenario-planning)
- Document integrations such as SharePoint (workfront/…/configure-document-integrations)

**GenStudio (gspm)**
- Activation to the six newer channels (Amazon Ads, Innovid, TikTok, YouTube, ChatGPT, The Trade Desk), one line per channel (genstudio-for-performance-marketing/user-guide/release-notes)
- The Trade Desk link via the client's Trade Desk account team; ChatGPT and YouTube campaign setup on the channel side (…/activation/paid-media-ads/…)
- Translation of approved content, optionally through the client's translation service (…/create/translate-experiences)
- Custom GenStudio extensions on App Builder (…/ext-guide/apps/deploy-app)
- Experience API and events into the client's systems (developer.adobe.com/genstudio-api/guides/experience-events)
- Guard the Insights data in Experience Platform; a note on GS06 or RT05 (…/insights/data-management)
- Logo swap placeholders, add to GS03 (…/create/logo-swap-setup)

**Creative Cloud (creativecloud)**
- Move from serial numbers to named users; also Acrobat AB01 (creative-cloud-enterprise-learn/…/deploy/cceserial)
- User Sync Tool from Active Directory (…/deploy/nameduserlicensing)

**Firefly Creative Production (fireflycp)**: Substance 3D API cloud renders and 3D composites (developer.adobe.com/firefly-services/docs/s3dapi)

**Coworker (cw)**: Coworker Projects line: project templates, multi-agent workflows, approval gates; limited availability (coworker/content/projects/overview)

**Brand Concierge (bc)**
- Callback events to Adobe Analytics or Google Analytics; cja-bc names them but has no lines, and there is no aa-bc (brand-concierge/content/release-notes/current)
- Extra languages, each its own concierge; limited availability (same page)

---

## 4. Version notes not already in PRODUCT_COVERAGE.md

**Corrections to PRODUCT_COVERAGE.md**
- **Workfront V2:** clients who bought before 12 March 2026 and moved to V2 keep Proof and the Frame viewer, so XG01/XG02 and XJ04/XJ05 still work for them. The fix in order-of-work step 1 should hide those connections only for V2 clients who bought after that date (helpx Workfront product description).
- **Commerce B2B:** included in Pro, a paid add-on on Starter (commerce-on-cloud/…/cloud-architecture).
- **Event forwarding:** included in every Real-Time CDP package, so a line, not a box (helpx RT-CDP B2C product description).
- **CJA:** PRODUCT_COVERAGE says editions need no change, but real-time reporting needs Ultimate (analytics-platform/using/cja-landing). Note on CJ04.
- **AEM Screens:** has docs (section 2, item 12). **Learning Manager:** AEM Sites add-on, not Assets.
- **GenStudio App Builder:** licences starting on or after 7 Apr 2025 include one App Builder pack; earlier licences need extra terms (helpx GenStudio product description). PRODUCT_COVERAGE says this is already in the tool; a text search of catalog.json did not find it. Check.

**Commerce**
- On Cloud security enforcement (in force now): 2.4.4 and 2.4.5 must upgrade or move to Cloud Service by 1 June 2027; 2.4.6 and 2.4.7 by 1 June 2028; third-party stack due 30 Oct 2026 or 31 May 2027. Admin or storefront can be suspended. Not for Cloud Service or on-premises.
- 2.4.6 and 2.4.7 get a free extra year of support; 2.4.4 and 2.4.5 support has ended.
- New Cloud Service instances use CCDM by default, so merchandising moves to Merchandising Services (changes CE05).
- HIPAA-Ready: PaaS only. Experimentation: paid add-on on some PaaS tiers, built in on Cloud Service.
- Payment Services is built in from 2.4.7; older versions install it first.
- The bulk data migration tool is Early Access, through Adobe's CDE team only.

**AEM**
- AEM 6.5: Managed Services support ended 31 Aug 2026; on-premises core support planned to end Feb 2027; 6.5.26 is the last service pack. Reason to sell the 6.5 LTS upgrade now.
- Cloud Service programs more than six months behind need an Adobe-scheduled update (catch-up task in SI06).
- Forms EDS Submissions add-on also excludes Forms Designer and Automated Forms Conversion, so AF10 does not apply.
- App Builder cannot be added to Assets Prime or Essentials, so XC16 is out on Prime.
- Brand Portal not available new on Assets Prime or Ultimate. Screens only on AEM Sites or Assets Enterprise.
- Content AI needs a modernized Cloud Service environment (affects AXE03).
- Sites Optimizer: Preflight on Managed Services needs Adobe IMS sign-in; Forms Optimization and Forms Accessibility are early access.
- Generate Variations needs the Edge Delivery licence. Advanced networking: one option per program, none on sandboxes. 99.99% SLA needs the extra publish region and the SLA add-on on the same program. Personalized Media needs Dynamic Media Enterprise (renewal only).

**Experience Platform**
- Computed attributes: Prime 25 per sandbox, Ultimate 50. Look-alikes: Prime 5, Ultimate 20. Size those lines by package.
- Customer AI is included in Prime and Ultimate (up to 52 insights per profile a year).
- B2B edition: Privacy and Security Shield only, no Healthcare Shield. On AWS, customer keys work only with Privacy and Security Shield.
- Attribution AI is no longer sold.
- AI Credits: Experience Platform Agents need an AI Credits licence; Coworker uses 25 credits per input for now; Adobe's AI monitoring dashboard does not show Coworker use yet (cx-enterprise-ai/…).
- Growth Credits add capacity to Real-Time CDP or Journey Optimizer; Adobe has a guide to overage (release-notes/experience-cloud/current).

**Analytics**
- Analytics Evolution is a one-time licence during the move to CJA and cannot be renewed (note on CJ03).
- CJA backfill beyond 13 months needs Extended Data Capacity (affects CJ03, XL07).
- Advertising Analytics: Select, Prime, Ultimate only, and only for clients without Adobe Advertising.
- Contribution Analysis: Prime has 10 tokens a month; more with Predictive Workbench.
- Activity Map overlay does not work on Web SDK.

**Journeys and Campaign**
- Journey Optimizer Select has no inbound channels (web, in-app, code-based), so XA23, XA07 and any app work need Prime.
- A fourth package, Ultimate Starter, has Offer Decisioning but no business events.
- Orchestrated campaigns (and DW2) need the Campaigns or Campaigns & Journeys package; add both to the picker.
- Decisioning licence is unclear: docs say "available to all customers", the product description lists it under Ultimate and Ultimate Starter. XA07's "Offer Decisioning add-on" tier is not in the current product description. Confirm with Adobe.
- Campaign v8: FDA (P1-P3) or Enterprise FFDA in Snowflake (P4); Adobe sets up the environment, so partner hours are configuration.
- AJO B2B GenStudio route is blocked with either Shield.
- Deliverability Enhanced and Plus include Adobe-made warmup plans: trim JO03.

**Marketo and Workfront**
- Marketo Performance packages include up to 5 dedicated IPs; a standalone dedicated IP requires Deliverability Enhanced or Plus (Adobe consultants, smaller partner share).
- Dynamic Chat Standard: 5 agents, no smart-list targeting; Prime: 25 agents, 100 smart lists.
- Interactive Webinars limits by tier (Select: 12 webinars, 500 seats).
- Marketo Measure Ultimate drops account-based features and CRM write-back; Boomerang is Tier 2 only.
- New Email Designer needs Adobe IMS sign-in first.
- Workfront business-rule automation is Ultimate only. Database Encryption is now standard in every Marketo instance.

**Content**
- Acrobat: Embed API is free; Extract and Accessibility Auto-Tag need paid PDF Services.
- Creative Cloud Pro includes unlimited Adobe Stock standard assets.
- Substance 3D Stager comes only with the 3D Collection plan.
- GenStudio Experience API may change in breaking ways: add a rework allowance.

**AI**
- LLM Apps: free for now; Adobe will announce the metering rate and date.
- Brand Visibility trial cannot connect Adobe Analytics; paid offer only.

---

## 5. Pages to paste from business.adobe.com

Grouped and de-duplicated from all areas. The first five change the most decisions.

1. Journey Optimizer packages: are Campaigns, Campaigns & Journeys and Ultimate Starter sold today, and which package has Decisioning?
2. Adobe Campaign overview: v8 sold new beside Journey Optimizer, and which add-ons are offered (also in PRODUCT_COVERAGE).
3. Privacy and Security Shield / Healthcare Shield: who they are sold to and who does setup.
4. Real-Time CDP Connections / event forwarding: still sold on its own, and its link to AEP Collection Enterprise.
5. Commerce as a Cloud Service migration offer (if a page exists): Adobe-led or partner-led, and who gets the bulk tool.
6. Commerce: HIPAA add-on; Payment Services; B2B add-on price on Starter (https://business.adobe.com/products/magento/b2b-ecommerce.html); the PaaS experimentation add-on.
7. AEM: Screens; Assets Essentials; Content AI (included or paid); Sites Optimizer packages; Extended Security; Learning Manager packages.
8. Analytics: CJA B2B Edition; streaming media add-ons; Conversation Insights release date; Adobe Advertising; Audience Manager (still sold new; Expanded Activation paid?).
9. Real-Time CDP B2B and B2P editions; Customer AI / Intelligent Services; Data Collection (Tags, Web SDK, Mobile SDK).
10. Journey Optimizer Loyalty; Journey Optimizer B2B Edition (In-CRM Insights, SMS, WhatsApp included?); Target Standard vs Premium.
11. Marketo: packages and add-ons sold new; Dynamic Chat beside Brand Concierge; Marketo Measure tiers; Sales Insight and Target Account Management still offered?
12. Workfront plans: Workflow, Planning, Fusion, App Builder, Data Connect.
13. GenStudio (https://business.adobe.com/products/genstudio-for-performance-marketing.html): is per-channel activation in the base licence? Substance 3D for enterprise; Adobe Stock for enterprise.

---

## 6. What was not reached

- **Addresses that return 404:** bare landing pages for many areas (id-service, core-services, experience-cloud, assets-essentials, sites-optimizer, release-information, marketo-optimizer, creative-cloud-enterprise-learn, acrobat-services-learn, substance-3d apps, premium-learning, llm-apps, coworker, brand-concierge, brand-visibility); child or table-of-contents pages were used. Also 404: Commerce New Relic page, Commerce data migration tool overview, HIPAA-Ready install, Experience Platform server API overview and B2B tutorial, Audience Manager to Real-Time CDP move guide, a Data Repair API page.
- **No setup page exists on Experience League** for: Profile Orchestration, Content Automation by FFS, Asset Share, Substance 3D Automation Toolkit, Stager, Modeler. Expanded Activation licensing is not stated.
- **Not opened within the fetch budget:** Commerce Developer MCP, Managed Services, Store Fulfillment, PWA Studio, Page Builder, Content Staging, B2B on Cloud Service; AEM Screens player registration, Guides deep pages, Forms deep pages, aem.live (not an allowed host); Destination SDK, Places, Tags API, B2P details; Media Edge SDK detail, Advertising DSP pixels and packaging; Campaign Classic v7 and Standard docs, AJO SMS and HIPAA pages, Target Recommendations and APIs; Workfront Fusion and App Builder, Lifecycle Modeler, Workfront SSO; GenStudio app building, Insights, CTV; Acrobat Sign OEM tutorials (video only).
- **Not re-checked here:** Commerce Optimizer, Commerce Intelligence, AEM Guides, Modernization Agent, Federated Audience Composition, Data Distiller (all left to PRODUCT_COVERAGE.md).
- **Dropped in skeptic passes:** Payment Services transaction-tier pricing; Dynamic Chat "24 hours" on the setup page (true on the overview page); a CIF version note and an Acrobat signing gap already in the tool; Brand Concierge evaluation sets (F02 covers them); a Brand Visibility ownership gap; wording the pages did not support.
- **No business.adobe.com pages fetched** (by rule).

---

## 7. Suggested order of work

This slots into PRODUCT_COVERAGE.md's seven steps. The step numbers are PRODUCT_COVERAGE's; the order inside each step is judgment.

1. **Workfront V2 fix** (PRODUCT_COVERAGE step 1), narrowed: hide workfront-gspm and express-workfront only for V2 clients who bought after 12 March 2026.
2. **Commerce** (step 2): add the Cloud Service move lines and the upgrade project (deadlines start June 2027), the ERP box, and the go-live, Fastly, Payment Services, Recommendations and Merchandising Services lines. Put the B2B Starter add-on and CCDM notes in the version picker. HIPAA-Ready last.
3. **Main pickers** (step 3): add Journey Optimizer Ultimate Starter and the Campaigns packages, Select's missing inbound channels, the CJA Ultimate real-time note, the AEM 6.5 end-of-support note, and the Decisioning line on the ajo card.
4. **Experience Platform** (step 4): event forwarding line, Shields, Customer AI, computed attributes, look-alikes, consent, Privacy Service, sandbox moves, identity rules. Then Mobile SDK on aa, since it feeds rtcdp, cja and ajo.
5. **New products and add-ons** (step 5, with Campaign, Guides and the Modernization Agent): LLM Apps; Campaign add-ons; Journey Optimizer Loyalty; CJA B2B; Streaming Media; Marketo add-ons (Dynamic Chat, Sales Insight, Target Account Management, Webinars); Workfront Data Connect.
6. **Gaps on existing cards** (alongside step 6, card notes): AEM Sites (code refactoring, CDN connection, networking, logs, headless, Edge Functions), Target (at.js move, server-side, AI activities), GenStudio channels, Workfront admin lines, Marketo Measure Ultimate move, Creative Cloud serials and User Sync, Brand Concierge callbacks, aa-bv.
7. **Maybes** (step 7), after the pastes: Screens, AEM security add-ons, Conversation Insights, Advertising and Audience Manager additions, Learning Manager, Substance 3D, and the smaller add-ons.
