# Omnichannel Content Activation and B2B Commerce: research trail

Checked Oct 30 2026. Data file: `portal_omnichannel_b2b.json`. Hours are our own estimates for a mid-market client; Adobe publishes none.

The two plays come from Adobe's FY26 partner portal sales play guides (Adobe internal, summarized in `internal/sales_plays/README.md`, used for context only and not cited). Every service and connection below rests on public Adobe pages, mostly Experience League.

## Summary

| Play | Products |
|---|---|
| Omnichannel Content Activation | AEM Sites, AEM Assets, Journey Optimizer, Content Analytics, Experimentation Accelerator |
| B2B Commerce | Adobe Commerce, AEM Sites, AEM Assets, Journey Optimizer B2B Edition |

| Product | id | Lines | Default | Optional |
|---|---|---|---|---|
| AEM Sites | `aemsites` | 6 | SI01, SI02, SI04, SI05, SI06 | SI03 |
| AEM Assets | `aemassets` | 6 | AS01, AS02, AS03, AS04, AS06 | AS05 |
| Content Analytics | `ca` | 6 | CA01, CA02, CA05, CA06 | CA03, CA04 |
| Journey Optimizer Experimentation Accelerator | `xa` | 6 | EX01, EX02, EX03, EX05, EX06 | EX04 |
| Journey Optimizer B2B Edition | `ajob2b` | 6 | JB01, JB02, JB03, JB04, JB05, JB06 | none |

| Connection | Result | Lines |
|---|---|---|
| AEM Sites + AEM Assets (`aemsites-aemassets`) | Documented, with services | XC01, XC02 |
| AEM Assets + Journey Optimizer (`aemassets-ajo`) | Documented, with services | XC03, XC04 |
| AEM Sites + Journey Optimizer (`aemsites-ajo`) | Documented, with services | XC05, XC06, XC07 |
| Journey Optimizer + Experimentation Accelerator (`ajo-xa`) | Documented, with services | XC08, XC09 |
| Adobe Commerce + AEM Sites (`commerce-aemsites`) | Documented, with services | XC10, XC11, XC12 |
| Adobe Commerce + AEM Assets (`commerce-aemassets`) | Documented, with services | XC13, XC14, XC15, XC16 |
| Journey Optimizer B2B Edition + AEM Assets (`ajob2b-aemassets`) | Documented, with services | XC17, XC18 |
| Content Analytics + AEM Sites | Not documented | none |
| Content Analytics + AEM Assets | Not documented | none |
| Content Analytics + Journey Optimizer | Not documented | none |
| Content Analytics + Experimentation Accelerator | Not documented | none |
| AEM Sites + Experimentation Accelerator | Not documented | none |
| AEM Assets + Experimentation Accelerator | Not documented | none |
| Adobe Commerce + Journey Optimizer B2B Edition | Not documented | none |
| Journey Optimizer B2B Edition + AEM Sites | Not documented | none |

No pair landed in 'documented, but no services inferable'.

## Searches run

1. experienceleague Content Analytics guided configuration implementation Customer Journey Analytics
2. experienceleague Journey Optimizer Experimentation Accelerator get started
3. experienceleague Journey Optimizer B2B Edition get started administrator setup
4. "Content Analytics" AEM Assets integration experienceleague asset attributes
5. "Content Analytics" "Journey Optimizer" experienceleague email content attributes
6. Adobe Content Analytics product page business.adobe.com
7. Adobe Content Analytics AEM Assets asset performance insights "Content Analytics" Experience Manager
8. experienceleague content analytics configuration AEM Sites "Experience Manager" web channel Content Analytics extension tags
9. experienceleague "Content Analytics" FAQ customer journey analytics assets experiences limitations
10. Adobe blog Content Analytics AEM Assets Journey Optimizer "Content Analytics" announcement Summit
11. "Content Analytics" "Experimentation Accelerator"
12. "Content Analytics" "Experience Manager Sites" OR "AEM Sites" adobe content performance pages attributes
13. "Experimentation Accelerator" AEM Sites OR "Experience Manager" experiments adobe
14. news.adobe.com "Content Analytics" Adobe Experience Cloud measure AI-generated content Experience Manager Assets
15. experienceleague AEM as a Cloud Service integrate Adobe Experience Platform Tags property Cloud Services configuration Sites
16. aem.live "Content Analytics" OR experienceleague "Content Analytics" "Edge Delivery Services"
17. "Journey Optimizer B2B" "Experience Manager Sites" OR "AEM Sites" OR "Edge Delivery" web experience landing page
18. "Journey Optimizer B2B" Adobe Commerce integration B2B commerce account journeys buying groups
19. "Journey Optimizer B2B Edition" "Adobe Commerce"
20. experienceleague Commerce Data Connection B2B events requisition list negotiable quote Experience Platform
21. experienceleague blueprint Adobe Commerce B2B Journey Optimizer account based buying group commerce events Real-Time CDP B2B
22. "Journey Optimizer B2B" "Content Fragments" OR "Experience Manager Sites" experienceleague
23. experienceleague Journey Optimizer "Adobe Experience Manager Assets" integration asset picker email designer AEM Assets as a Cloud Service
24. experienceleague Journey Optimizer content experiment get started create content experiment campaign treatments success metric
25. experienceleague Adobe Commerce AEM Assets integration for Commerce install configure product images sync
26. experienceleague AEM Commerce Integration Framework CIF as a Cloud Service connect Adobe Commerce getting started
27. experienceleague CIF core components client-side components cart checkout GraphQL Adobe Commerce AEM storefront
28. experienceleague Commerce AEM Assets integration migrate media files to the AEM Assets DAM
29. experienceleague AEM as a Cloud Service use assets in AEM Sites Dynamic Media with OpenAPI remote assets Universal Editor asset selector
30. experienceleague AEM Sites "Connected Assets" cloud service share DAM assets between Sites and Assets deployments
31. experienceleague AEM as a Cloud Service onboarding journey overview system administrator Cloud Manager program
32. experienceleague AEM as a Cloud Service go-live checklist
33. experienceleague AEM as a Cloud Service migration journey Content Transfer Tool Best Practices Analyzer
34. experienceleague "Experience Manager Sites" overview cloud service "content management system" what is AEM Sites
35. experienceleague AEM Assets as a Cloud Service bulk import assets from cloud storage metadata schemas processing profiles
36. experienceleague AEM Assets Onboarding Agent OR "Content Hub" configuration user interface deploy

After the searches, every cited page was downloaded with curl into a scratch folder and converted to text, and each quote was checked against that text by script (whitespace and curly quotes normalized): 733 checks passed, 0 failed.

## Pages downloaded and checked

Pages marked source are cited in the JSON; the rest back the not-documented checks and the notes.

| Key | Page | URL | Use |
|---|---|---|---|
| si_onboard | Experience League: AEM as a Cloud Service Onboarding Journey Introduction | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/overview | source |
| si_wknd | Experience League: Get started with AEM Sites - WKND tutorial | https://experienceleague.adobe.com/en/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/overview | source |
| si_ctt | Experience League: Overview to Content Transfer Tool | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/migration-journey/cloud-migration/content-transfer-tool/overview-content-transfer-tool | source |
| si_golive | Experience League: Go-Live Checklist | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/go-live-checklist | source |
| si_ue | Experience League: Universal Editor Introduction | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction | source |
| si_postgolive | Experience League: Post Go-Live | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/migration-journey/post-go-live | source |
| as_overview | Experience League: Introducing Assets as a Cloud Service for Digital Asset Management in AEM | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview | source |
| as_onboard_agent | Experience League: Onboarding Agentic Capabilities Overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/onboarding/use-cases | source |
| as_bulk | Experience League: Bulk import assets using Assets view | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/assets-view/bulk-import-assets-view | source |
| as_add | Experience League: Add your digital assets to Adobe Experience Manager. | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/add-assets | source |
| as_hub_deploy | Experience League: Deploy Content Hub | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/deploy-content-hub | source |
| as_reports | Experience League: Reports about usage and sharing | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/admin/asset-reports | source |
| as_remote_sites | Experience League: Integrate remote AEM Assets with AEM Sites | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-remote-approved-assets-with-sites | source |
| as_dmoa | Experience League: Dynamic Media with OpenAPI capabilities | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/dynamic-media-open-apis-overview | source |
| as_connected | Experience League: Use Connected Assets to share DAM assets in Sites | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/admin/use-assets-across-connected-assets-instances | source |
| ca_overview | Experience League: Content Analytics Overview | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics | source |
| ca_config | Experience League: Configure Content Analytics | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration | source |
| ca_guided | Experience League: Content Analytics Guided Configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided | checks and notes |
| ca_manual | Experience League: Content Analytics Manual Configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/manual | source |
| ca_paid | Experience League: Content Analytics Paid Media Automatic Configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media | source |
| ca_report | Experience League: Content Analytics Reporting | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report | source |
| ca_news | Adobe newsroom: Adobe Unveils Innovations in Adobe Experience Cloud for Brands to Personalize and Measure AI-generated Content | https://news.adobe.com/news/2024/09/091624-aec-analytics | checks and notes |
| xa_overview | Experience League: Journey Optimizer Experimentation Accelerator | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview | source |
| xa_access | Experience League: Journey Optimizer Experimentation Accelerator | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access | source |
| xa_bp | Experience League: Journey Optimizer Experimentation Accelerator best practices | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-best-practices | source |
| xa_monitor | Experience League: Journey Optimizer Experimentation Accelerator monitor | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor | source |
| xa_ajo_gs | Experience League: Journey Optimizer Experimentation Accelerator | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/experiment-accelerator-gs | checks and notes |
| ajo_exp_gs | Experience League: Get started with content experiment | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/get-started-experiment | source |
| sites_ctx_exp | Experience League: Contextual Experimentation in AEM as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/contextual-experimentation | checks and notes |
| jb_overview | Experience League: Adobe Journey Optimizer B2B Edition Documentation | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview | source |
| jb_setup | Experience League: Setup checklist | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate | source |
| jb_onboard | Experience League: Onboarding Guidance for Administrators and Marketers | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/get-started | checks and notes |
| jb_si | Experience League: Solution Interests | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/solution-interests | source |
| jb_journeys | Experience League: Journey management | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journeys-overview | source |
| jb_dash | Experience League: Intelligent Dashboard | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/dashboards/intelligent-dashboard | source |
| jb_aepevents | Experience League: Select Experience Events and Fields | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/configure-aep-events | checks and notes |
| jb_web_cfg | Experience League: Web channel configurations | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-web | checks and notes |
| jb_marketo_act | Experience League: Activate Marketo Engage to Support Journey Actions | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect | checks and notes |
| jb_assets | Experience League: Assets | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/assets-overview | checks and notes |
| jb_aem_assets | Experience League: Work with Experience Manager Assets | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets | source |
| jb_aem_repo | Experience League: Configure Experience Manager Asset Repositories | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories | source |
| jb_email_tpl | Experience League: Email Templates | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-templates | source |
| bp_bg | Experience League: Buying Group-Based Marketing & Journey Management | https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/b2b-patterns/buying-group-marketing | checks and notes |
| ajo_combine | Experience League: Combine solutions and apps to manage your content | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/content-integrations | source |
| ajo_assets | Experience League: Use Assets in Journey Optimizer | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/assets | source |
| ajo_aem_frag | Experience League: AEM Content Fragments | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/aem/aem-fragments | source |
| ajo_content_advisor | Experience League: Access Adobe Experience Manager Content Advisor | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/aem-content-advisor | checks and notes |
| sites_cf_ajo | Experience League: Using Content Fragments with Adobe Journey Optimizer | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/content-fragments-with-journey-optimizer | source |
| ajo_cf_ext | Experience League: Using the Content Fragments AJO External References Extension | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/extension-content-fragment-ajo-external-references | source |
| cc_intro | Experience League: Introduction and overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/introduction | source |
| cif_gs | Experience League: Getting started with AEM Commerce as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/cif-storefront/storefront/getting-started | source |
| cm_assets_ov | Experience League: AEM Assets Integration for Commerce | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/overview | source |
| cm_assets_cfgaem | Experience League: Configure the AEM Assets Project | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/configure-aem | source |
| cm_assets_sync | Experience League: Configure the integration | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/setup-synchronization | source |
| cm_assets_meta | Experience League: Commerce metadata in AEM Assets | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/metadata | source |
| cm_assets_migrate | Experience League: Migrate media files to AEM | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/migrate-data | source |
| cm_assets_selector | Experience League: Manual asset selection | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/synchronize/asset-selector-integration | checks and notes |
| dc_rn | Experience League: Release Notes | https://experienceleague.adobe.com/en/docs/commerce/data-connection/release-notes | checks and notes |

## Also read, not cited

| Page | URL |
|---|---|
| Content Analytics data collection | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/datacollection |
| Content Analytics JavaScript library | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/tags-agnostic |
| Content Analytics components | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/components |
| Content Analytics: How it works (tutorial) | https://experienceleague.adobe.com/en/docs/customer-journey-analytics-learn/tutorials/content-analytics/how-it-works |
| Introduction to Content Analytics (tutorial) | https://experienceleague.adobe.com/en/docs/customer-journey-analytics-learn/tutorials/content-analytics/introduction-to-content-analytics |
| Current Customer Journey Analytics release notes | https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/latest |
| AEM Assets Insights (uses Adobe Analytics) | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights |
| Assets Insights in Content Hub | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/insights-content-hub |
| Use Content Advisor in Adobe and non-Adobe applications (AEM Assets) | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-advisor/integrate-adobe-non-adobe-applications |
| Work with Dynamic Media | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media |
| Configure and use asset microservices | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-microservices-configure-and-use |
| Introduction to AEM as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/overview/introduction |
| AEM onboarding: AEM User Tasks | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/aem-users |
| AEM onboarding: Create a Program | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/create-program |
| AEM onboarding: Developer and Deployment Manager Tasks | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/developers |
| Getting started with the migration journey | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/migration-journey/getting-started |
| Multi Site Manager and Live Copy | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/reusing-content/msm/overview |
| Content Fragments overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/overview |
| Integrating tags in Experience Platform and AEM | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform-data-collection-tags/overview |
| Create a tags Cloud Service configuration in AEM Sites | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform-data-collection-tags/create-aem-launch-cloud-service |
| Experimentation Agent overview | https://experienceleague.adobe.com/en/docs/journey-optimizer-learn/tutorials/experimentation/experimentation-agent-overview |
| Create a content experiment (Journey Optimizer) | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/content-experiment |
| Integrate with other solutions (Journey Optimizer) | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/ajo-integrations |
| Journey Optimizer B2B Edition overview | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition |
| B2B Edition buying groups | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/buying-groups-overview |
| B2B Edition web experiences (beta) | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journey-content/web-channel/web-experiences |
| B2B Edition landing page configuration | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-landing-pages |
| B2B Edition In-CRM Insights | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/incrm-insights |
| B2B Edition XDM field management | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/xdm-field-management |
| B2B Edition fragments | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/visual-fragments/fragments |
| B2B Edition release notes | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes |
| Commerce AEM Assets integration: manage assets | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/manage-assets |
| Commerce AEM Assets integration: default automatic matching | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/synchronize/default-match |
| Commerce AEM Assets integration: custom automatic matching | https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/synchronize/custom-match |
| Adobe Commerce as a Cloud Service overview | https://experienceleague.adobe.com/en/docs/commerce/cloud-service/overview |

## business.adobe.com pages (read with a web fetch only)

These pages refuse direct downloads from this environment, so their wording could not be script-checked. None is a line source; they only corroborate or rule out connections.

| Page | URL | What it says |
|---|---|---|
| Adobe Content Analytics product page | https://business.adobe.com/products/adobe-analytics/content-analytics.html | FAQ 'Is Adobe Experience Manager Assets required to use Content Analytics?' answered 'No. As long as assets can be tagged, the choice of Digital Asset Management (DAM) system doesn't matter.' FAQ 'Is Adobe Customer Journey Analytics required?' answered 'No.' Integration cards name only Customer Journey Analytics and Marketing Campaign Analytics. |
| AEM Sites product page | https://business.adobe.com/products/experience-manager/sites/aem-sites.html | Headline 'AI-powered Enterprise CMS'; mentions Commerce product pages enriched with content, and Journey Optimizer only alongside Real-Time CDP profiles. No Content Analytics. |
| AEM Assets product page | https://business.adobe.com/products/experience-manager/assets/aem-assets.html | Describes AEM Assets as an intelligent DAM that acts as a content advisor; no named product integrations in body text. |
| Experimentation Accelerator product URL | https://business.adobe.com/products/journey-optimizer/experimentation-accelerator.html | Now shows the Journey Optimizer page; its integration cards include 'Journey Optimizer + Adobe Experience Manager Assets'. No accelerator text. |
| Journey Optimizer B2B Edition content and personalization page | https://business.adobe.com/products/journey-optimizer-b2b-edition/content-and-personalization.html | 'Design personalized content for buying group members using assets from Experience Manager Assets'. Commerce and AEM Sites appear only in navigation. |

## Products

### AEM Sites (`aemsites`)

What (Adobe's words, trimmed to one line; the key phrase is script-checked on the page): Sites in AEM as a Cloud Service: create, manage, and deliver digital experiences. (Experience League: AEM as a Cloud Service Onboarding Journey Introduction, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/overview)

Notes: Adobe now recommends Edge Delivery Services for new Sites projects; the canvas models that as the separate eds product. These lines cover a Sites build on the traditional author and publish setup.

- **SI01 Cloud Manager program, pipelines and access**: one-time, 24 / 48 / 96 hours. Assign AEM product profiles in the Admin Console, create the production program and environments in Cloud Manager, set up Git access and the first deployment pipelines.
  - Quote: "Cloud Manager - Set up programs and environments, access Git, and create pipelines to manage and deploy custom code." (Experience League: AEM as a Cloud Service Onboarding Journey Introduction, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/overview)
- **SI02 Site build with components and templates**: one-time, 200 / 400 / 800 hours. Build the site from the AEM Project Archetype or a Site Template, with Core Components, editable templates, client-side libraries and the custom components the design needs.
  - Quote: "The tutorial covers fundamental topics like project setup, Core Components, Editable Templates, Client-side libraries, and component development" (Experience League: Get started with AEM Sites - WKND tutorial, https://experienceleague.adobe.com/en/docs/experience-manager-learn/getting-started-wknd-tutorial-develop/overview)
- **SI03 Content migration with Content Transfer Tool** (optional): one-time, 60 / 120 / 240 hours. For clients moving from AEM on-premise or Adobe Managed Services: extract and ingest content with the Content Transfer Tool in Cloud Acceleration Manager, then run differential top-ups before go-live.
  - Quote: "migration of existing content from a source AEM instance (on-premise or AMS) to the target AEM Cloud Service instance" (Experience League: Overview to Content Transfer Tool, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/migration-journey/cloud-migration/content-transfer-tool/overview-content-transfer-tool)
- **SI04 Go-live checklist and cutover**: one-time, 40 / 80 / 140 hours. Work through Adobe's go-live checklist: a production pipeline with functional and UI tests, Dispatcher validation, CDN, SSL and DNS, performance and security tests on stage, notification profiles and traffic filter rules.
  - Quote: "Run an end-to-end production pipeline with functional and UI testing to ensure an always current AEM product experience." (Experience League: Go-Live Checklist, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/onboarding/journey/go-live-checklist)
- **SI05 Author training on the Universal Editor**: one-time, 16 / 32 / 56 hours. Train authors to edit pages and content in the Universal Editor and hand over authoring guides for the site's components and templates.
  - Quote: "It enables authors to perform what-you-see-is-what-you-get (WYSIWYG) editing of any headless or headful experience." (Experience League: Universal Editor Introduction, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction)
- **SI06 Monthly releases, monitoring and logs**: monthly, 16 / 24 / 40 hours. Each month, ship code through Cloud Manager pipelines, check the automatic AEM version updates, review logs and the Developer Console, and fix issues found after go-live.
  - Quote: "monitor for issues and improve performance after the migration is complete" (Experience League: Post Go-Live, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/migration-journey/post-go-live)

### AEM Assets (`aemassets`)

What (Adobe's words, trimmed to one line; the key phrase is script-checked on the page): Adobe Experience Manager (AEM) Assets as a Cloud Service is a cloud-native, Platform-as-a-Service (PaaS) solution for Digital Asset Management (DAM) and Dynamic Media. (Experience League: Introducing Assets as a Cloud Service for Digital Asset Management in AEM, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview)

Notes: Dynamic Media is licensed separately from AEM Assets. Adobe's AEM Onboarding Agentic Capability (through Coworker Chat) automates some of the setup in AS01 to AS03, and access starts by emailing Adobe, so hours may shrink where a client has it.

- **AS01 DAM onboarding, users and access**: one-time, 16 / 32 / 56 hours. Add users to the Admin Console, create user groups and attach the AEM Assets product profiles, and confirm the Cloud Manager program and environments for the DAM.
  - Quote: "Adds users to the Adobe Admin Console organization, creates user groups, and attaches product profiles to groups." (Experience League: Onboarding Agentic Capabilities Overview, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/onboarding/use-cases)
- **AS02 Folder structure, tags and metadata forms**: one-time, 40 / 72 / 140 hours. Design the folder hierarchy under /content/dam, the controlled tag taxonomy and the custom metadata forms, so assets are findable and ready to reuse in every channel.
  - Quote: "Designs and creates folder hierarchies under /content/dam and controlled tag taxonomies under /content/cq:tags" (Experience League: Onboarding Agentic Capabilities Overview, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/onboarding/use-cases)
- **AS03 Asset and metadata migration**: one-time, 40 / 80 / 200 hours. Bulk import the existing library from cloud storage (Azure, AWS, Google Cloud, Dropbox or OneDrive) and load metadata for existing assets from CSV files.
  - Quote: "import large numbers of assets directly from an external data source into AEM Assets in a single, streamlined operation" (Experience League: Bulk import assets using Assets view, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/assets-view/bulk-import-assets-view)
- **AS04 Processing profiles and renditions**: one-time, 16 / 32 / 64 hours. Configure processing profiles on upload folders for the renditions, metadata and image processing each channel needs, plus any post-processing workflows.
  - Quote: "Several asset processing profiles can be configured on the folder, into which assets are uploaded, to add specific metadata, renditions" (Experience League: Add your digital assets to Adobe Experience Manager., https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/add-assets)
- **AS05 Content Hub portal for approved assets** (optional): one-time, 16 / 32 / 64 hours. Deploy Content Hub, set user, contributor and administrator roles, configure the portal, and set up the approval step that releases assets to it.
  - Quote: "Only assets marked Approved on Experience Manager Assets as a Cloud Service become available for distribution on Content Hub" (Experience League: Deploy Content Hub, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/deploy-content-hub)
- **AS06 Monthly DAM administration and reporting**: monthly, 8 / 16 / 32 hours. Each month, review asset reports on usage and sharing, tidy metadata and tags, update processing profiles and manage user access.
  - Quote: "The reports provide useful information about your system’s usage, how users interact with assets, and which assets are shared." (Experience League: Reports about usage and sharing, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/admin/asset-reports)

### Content Analytics (`ca`)

What (Adobe's words, trimmed to one line; the key phrase is script-checked on the page): Content Analytics helps marketers to understand how content impacts the key performance indicators that a business has defined. (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)

Notes: Experience League runs Content Analytics setup inside the Customer Journey Analytics interface (a CJA connection, data views and a Workspace template) and needs Experience Platform Web SDK, Mobile SDK or source connectors for data. Adobe's product page says neither a CJA license nor AEM Assets is required. Featurization is English only, Content Analytics is not HIPAA-ready, Privacy and Security Shield labels do not cover its experiences and assets, and each sandbox allows one configuration.

- **CA01 Content Analytics readiness and prerequisites**: one-time, 16 / 32 / 56 hours. Confirm Web SDK or Mobile SDK data collection, allow-list the featurization service's user agent and IP, set CJA and data collection permissions, and agree which pages and assets to analyze.
  - Quote: "You have allow-listed the User Agent and IP address for the featurization service that is used in Content Analytics." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- **CA02 Guided configuration and Tags rollout**: one-time, 32 / 64 / 120 hours. Run the guided configuration (sandbox, connection, data views, web and mobile channels, experience capture, exclusion rules that keep personal data out), implement it and publish the Tags property.
  - Quote: "Only when you manually publish the Tags property is your Content Analytics configuration effectively deployed and data collection started." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- **CA03 Experience versioning on web pages** (optional): one-time, 8 / 16 / 40 hours. Where page experiences are captured, add the adobe.getContentExperienceVersion function to the analyzed pages so page changes are recorded as new experiences.
  - Quote: "you should consider implementing versioning to ensure new experiences (changes to your web page) are properly collected" (Experience League: Content Analytics Manual Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/manual)
- **CA04 Paid media channel setup** (optional): one-time, 16 / 40 / 80 hours. Enable the paid media channel on the ad datasets from Experience Platform's ad network source connectors, then map tracking keys so ad content links to site conversions.
  - Quote: "The correlation between your experience event data and paid media data requires customer-specific tracking-key mapping and reporting configuration." (Experience League: Content Analytics Paid Media Automatic Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
- **CA05 Content Analytics reporting and training**: one-time, 16 / 32 / 56 hours. Set up the Content Analytics Workspace template and core freeform reports with thumbnails and previews, and train analysts and content teams to read attribute insights.
  - Quote: "A specific Workspace template is available, so you can immediately access a pre-populated Workspace project with relevant content insights." (Experience League: Content Analytics Reporting, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report)
- **CA06 Monthly content performance insights**: monthly, 8 / 16 / 32 hours. Each month, review which assets and attributes drive engagement and conversion, flag underused or overused assets, and feed the findings into the content plan.
  - Quote: "These insights help you to see whether assets are underused or overused on your web and mobile properties." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)

### Journey Optimizer Experimentation Accelerator (`xa`)

What (Adobe's words, trimmed to one line; the key phrase is script-checked on the page): Journey Optimizer Experimentation Accelerator provides a centralized platform for managing, analyzing, and optimizing experiments from Adobe Target and Journey Optimizer. (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview)

Notes: Add-on: it needs a paid license of its own and works with Journey Optimizer or Adobe Target experiments (Target is not on this play). Opportunities are limited to experiments with text-based changes. Changing the primary metric works only when CJA or Adobe Analytics is the reporting source.

- **EX01 Accelerator access, roles and sandboxes**: one-time, 8 / 16 / 32 hours. Add the Experiment accelerator resource to roles with View Experiments or Manage Experiment Metadata, assign the sandboxes, and add users.
  - Quote: "Add the Experiment accelerator resource, then select View Experiments and/or Manage Experiment Metada from the drop-down menu." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- **EX02 Experiment program and hypothesis playbook**: one-time, 24 / 40 / 72 hours. Set up the client's testing playbook: hypothesis format, primary and secondary metrics, sample size and run time, segmentation rules and how learnings are recorded.
  - Quote: "A strong hypothesis includes what you’re changing, what you expect to happen, and why." (Experience League: Journey Optimizer Experimentation Accelerator best practices, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-best-practices)
- **EX03 Hypotheses and treatment details per test**: one-time, 8 / 16 / 40 hours. Add a hypothesis and confirm the treatment details and screenshots for each running experiment, which the accelerator needs before it generates insights and opportunities.
  - Quote: "for Experiment insights to be generated, you need to confirm hypothesis and treatment details and statistical significance to be reached." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **EX04 Primary metrics from CJA or Adobe Analytics** (optional): one-time, 8 / 16 / 32 hours. Where CJA or Adobe Analytics is the reporting source, choose and import the primary metric for each experiment; changes stay in the accelerator.
  - Quote: "Changing the primary metric applies to teams that use Customer Journey Analytics or Adobe Analytics as the reporting source" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **EX05 Training on insights and opportunities**: one-time, 8 / 16 / 24 hours. Train marketers and analysts to read experiment outcomes, insights and AI opportunities, including learning and conversion potential, and to share results.
  - Quote: "The Opportunities panel displays AI-generated recommendations designed to enhance test performance and align with broader business objectives and KPIs." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **EX06 Monthly experiment review and backlog**: monthly, 8 / 16 / 32 hours. Each month, review the experiments list and KPIs, pick the opportunities worth testing next, and keep the test backlog and learnings log current.
  - Quote: "The KPI section provides key metrics, including the total number of experiments created and the number currently in progress" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

### Journey Optimizer B2B Edition (`ajob2b`)

What (Adobe's words, trimmed to one line; the key phrase is script-checked on the page): Adobe Journey Optimizer B2B Edition lets marketing and sales teams orchestrate account-based experiences and qualify buying groups for specific products across the entire customer lifecycle. (Experience League: Adobe Journey Optimizer B2B Edition Documentation, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview)

Notes: Built on Experience Platform, and still relies on Marketo Engage entitlements and email delivery through an attached Marketo Engage instance. The web channel is in beta. Marketo Engage journey actions (lists and request campaigns) are an optional extra not costed here.

- **JB01 B2B schemas, XDM fields and events**: one-time, 40 / 72 / 140 hours. Generate the B2B namespaces and schemas with Adobe's utility, choose the managed and relational XDM fields for journeys and personalization, and select the Experience Platform events journeys listen to.
  - Quote: "Run the Namespaces and Schemas generation utility in Postman and confirm namespaces and schemas are created." (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- **JB02 Email domains and deliverability setup**: one-time, 24 / 48 / 80 hours. In the attached Marketo Engage instance, set up tracking CNAMEs, branding domains, DKIM, SPF, DMARC and MX records and IP allowlists, then email settings and communication limits in the B2B Edition.
  - Quote: "configure the email tracking and deliverability in the attached Marketo Engage production instance" (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- **JB03 Buying groups and solution interests**: one-time, 32 / 56 / 100 hours. Define solution interests and role templates with sales, build account audiences, and run the buying group creation jobs that fill each buying group.
  - Quote: "Before you create buying groups, you should know what you are selling and who you want to target." (Experience League: Solution Interests, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/solution-interests)
- **JB04 First account journeys and email content**: one-time, 60 / 100 / 180 hours. Build the first account journeys for acquisition or cross-sell, with personalized email templates, visual fragments and journey nodes, then test and publish them.
  - Quote: "Tailor your journeys for each buying group and buying group member using automated engagement across email, SMS, events, and more." (Experience League: Journey management, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journeys-overview)
- **JB05 User roles, access and team enablement**: one-time, 16 / 32 / 56 hours. Create the product profile and user groups in the Admin Console, configure B2B user roles, add users, and walk marketers through Adobe's onboarding guidance.
  - Quote: "configure Journey Optimizer B2B Edition and Marketo Engage access for your team and users." (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- **JB06 Monthly buying group and journey reviews**: monthly, 16 / 24 / 40 hours. Each month, review the Intelligent Dashboard and journey results, refresh buying groups and audiences, and tune journeys and content.
  - Quote: "The Intelligent Dashboard provides a comprehensive view of buying group and account metrics, helping you to monitor and strategize" (Experience League: Intelligent Dashboard, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/dashboards/intelligent-dashboard)

## Connections with services

### AEM Sites + AEM Assets (`aemsites-aemassets`)

How: Dynamic Media with OpenAPI lets Sites authors use approved assets from a remote AEM Assets environment in the Page Editor and Content Fragments; Adobe recommends it over the older Connected Assets. (Experience League: Integrate remote AEM Assets with AEM Sites, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-remote-approved-assets-with-sites)

Gain: **One governed library for every page.** Authors place approved, brand-safe images from the DAM straight onto pages and fragments, and changes to approved assets reach the live site without re-uploading.

Flows:
- AEM Assets to AEM Sites: Approved assets and metadata, delivered by URL to pages and Content Fragments (Experience League: Dynamic Media with OpenAPI capabilities, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/dynamic-media-open-apis-overview)
- AEM Sites to AEM Assets: Page references, so DAM users see where each asset is used (Experience League: Use Connected Assets to share DAM assets in Sites, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/admin/use-assets-across-connected-assets-instances)

Lines:
- **XC01 Connect Sites to the DAM with OpenAPI**: one-time, 16 / 32 / 64 hours. Set the asset delivery repository and IMS client variables in Cloud Manager, configure the Image v3 component and HTTPS, and confirm authors can pick remote assets.
  - Quote: "Set up the following environment variables for AEM as a Cloud Service" (Experience League: Integrate remote AEM Assets with AEM Sites, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-remote-approved-assets-with-sites)
- **XC02 Image modifiers and smart crops for pages** (optional): one-time, 24 / 40 / 80 hours. Set up the image modifiers and smart crops each page component uses, so every placement gets the right size and format from the DAM.
  - Quote: "on-the-fly image transformation using URL parameters known as image modifiers" (Experience League: Dynamic Media with OpenAPI capabilities, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/dynamic-media-open-apis-overview)

### AEM Assets + Journey Optimizer (`aemassets-ajo`)

How: AEM Assets is natively integrated with Journey Optimizer: marketers pick assets from an Assets as a Cloud Service repository in the Email Designer, and approved Dynamic Media renditions stay current when assets change in AEM. (Experience League: Combine solutions and apps to manage your content, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/content-integrations)

Gain: **On-brand assets in every message.** Marketers drop DAM images straight into emails and messages, and approved Dynamic Media renditions update in journey content when the asset changes in AEM.

Flows:
- AEM Assets to Journey Optimizer: Assets and approved Dynamic Media renditions for email and message content (Experience League: Combine solutions and apps to manage your content, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/content-integrations)
- Journey Optimizer to AEM Assets: Assets uploaded from the Journey Optimizer Assets tab, stored in AEM folders (Experience League: Use Assets in Journey Optimizer, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/assets)

Lines:
- **XC03 AEM Assets repository in Journey Optimizer**: one-time, 16 / 24 / 48 hours. Add marketers to the Assets Cloud Services product profiles, select the Assets as a Cloud Service repository in Journey Optimizer, and set up campaign asset folders.
  - Quote: "Before using Adobe Experience Manager Assets as a Cloud Service, you must add users to Assets Cloud Services." (Experience League: Use Assets in Journey Optimizer, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/assets)
- **XC04 Dynamic Media renditions in journey content** (optional): one-time, 16 / 32 / 56 hours. For clients with Dynamic Media, set up the approved renditions and smart crops marketers pick in Content Advisor, so journey content always uses the latest version.
  - Quote: "Dynamic media allowing you to seamlessly select and use approved dynamic media renditions within Journey Optimizer" (Experience League: Combine solutions and apps to manage your content, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/content-integrations)

### AEM Sites + Journey Optimizer (`aemsites-ajo`)

How: Content Fragments in AEM Sites, tagged for a Journey Optimizer sandbox and published, are pulled into Journey Optimizer campaigns and journeys through the Content Fragment Management API. (Experience League: Using Content Fragments with Adobe Journey Optimizer, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/content-fragments-with-journey-optimizer)

Gain: **Author once, reuse in every journey.** Content teams write product and campaign copy once in AEM, and Journey Optimizer reuses the published fragments in email, SMS, web and other channels, personalized per profile.

Flows:
- AEM Sites to Journey Optimizer: Published Content Fragments, refreshed in journeys within about five minutes (Experience League: AEM Content Fragments, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/aem/aem-fragments)
- Journey Optimizer to AEM Sites: Campaign, journey and template references for previews inside AEM (Experience League: Using the Content Fragments AJO External References Extension, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/extension-content-fragment-ajo-external-references)

Lines:
- **XC05 Content Fragments for Journey Optimizer**: one-time, 24 / 48 / 96 hours. Allow the Content Fragment API in the Dispatcher, create the ajo-enabled tag for each sandbox, model channel-ready fragments, and publish them for campaigns and journeys.
  - Quote: "Content Fragments must be tagged with the Journey Optimizer-specific tag (ajo-enabled:{OrgId}/{SandboxName})." (Experience League: AEM Content Fragments, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/aem/aem-fragments)
- **XC06 Personalized fragments and variations**: one-time, 16 / 32 / 64 hours. Add placeholders to fragment text and map them to profile or contextual attributes in Journey Optimizer, and set up fragment variations for audiences or channels.
  - Quote: "To enable real-time personalization, all placeholders used within a Content fragment must be explicitly declared by the user as parameters" (Experience League: AEM Content Fragments, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/combine/aem/aem-fragments)
- **XC07 AJO references and previews in AEM** (optional): one-time, 8 / 16 / 24 hours. Enable the AJO External References extension so authors see and preview the campaigns, journeys and templates that use a fragment before they change it.
  - Quote: "fetching references to Content Fragment from all organizations and sandboxes associated with predefined tags" (Experience League: Using the Content Fragments AJO External References Extension, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/extension-content-fragment-ajo-external-references)

### Journey Optimizer + Experimentation Accelerator (`ajo-xa`)

How: Experimentation Accelerator automatically lists the content experiments in Journey Optimizer campaigns and journeys, adds AI insights and opportunities, and opens a chosen opportunity back in the campaign's Content Experimentation panel. (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)

Gain: **Every test analyzed, next test suggested.** Journey Optimizer experiments land in one view with lift and confidence, and AI suggests the next treatment to try, which opens straight back in the campaign.

Flows:
- Journey Optimizer to Experimentation Accelerator: Experiments from campaigns and journeys in the enabled sandbox, included automatically (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- Experimentation Accelerator to Journey Optimizer: Chosen opportunity, opened in the campaign's Content Experimentation panel (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

Lines:
- **XC08 Content experiments in Journey Optimizer**: one-time, 24 / 40 / 80 hours. Set up content experiments in campaigns and journeys, with the identity namespace for random assignment, the treatments and the success metrics, so they flow into the accelerator.
  - Quote: "as part of configuring every campaign with a content experiment, you must choose an identity namespace" (Experience League: Get started with content experiment, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/get-started-experiment)
- **XC09 Turn opportunities into AJO tests**: one-time, 16 / 24 / 48 hours. Agree how an accepted opportunity becomes a new treatment: open it in the campaign's Content Experimentation panel, build and check the variant, and relaunch.
  - Quote: "this action will open the Content Experimentation Panel within that campaign" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

### Adobe Commerce + AEM Sites (`commerce-aemsites`)

How: The Commerce Integration Framework (CIF) add-on, an extra module on AEM Sites as a Cloud Service, connects AEM to the Adobe Commerce GraphQL endpoint so authors can search, browse and use product data in AEM. (Experience League: Getting started with AEM Commerce as a Cloud Service, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/cif-storefront/storefront/getting-started)

Gain: **Product data inside the content editor.** Authors find real products from the Commerce catalog while building pages, so content-rich shopping experiences use live product data instead of copied details.

Flows:
- Adobe Commerce to AEM Sites: Catalog and product data over GraphQL for authoring tools and CIF components (Experience League: Getting started with AEM Commerce as a Cloud Service, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/cif-storefront/storefront/getting-started)

Lines:
- **XC10 Connect AEM Sites to Commerce with CIF**: one-time, 24 / 40 / 80 hours. Once Adobe provisions the CIF add-on, set the COMMERCE_ENDPOINT variable for each environment in Cloud Manager and the CIF configuration for store view and catalog root.
  - Quote: "you must provide the GraphQL endpoint URL by way of a Cloud Manager environment variable. The variable name is COMMERCE_ENDPOINT." (Experience League: Getting started with AEM Commerce as a Cloud Service, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/cif-storefront/storefront/getting-started)
- **XC11 Product-enriched content experiences**: one-time, 32 / 56 / 112 hours. Build the commerce-specific content (product teasers, category and campaign content, Content Fragments) that authors assemble from products they search and browse in AEM.
  - Quote: "a seamless integration of your product data into AEM (Search, browse, and find products within the AEM UI)" (Experience League: Introduction and overview, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/introduction)
- **XC12 CIF to Edge Delivery transition plan** (optional; needs `eds`): one-time, 24 / 40 / 80 hours. For existing CIF storefronts, plan a phased move to Edge Delivery with Commerce drop-in components, running Edge Delivery and CIF pages side by side.
  - Quote: "start by moving only a subset of pages to Edge Delivery and running Edge Delivery and CIF pages" (Experience League: Introduction and overview, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/introduction)

### Adobe Commerce + AEM Assets (`commerce-aemassets`)

How: The AEM Assets Integration for Commerce links approved AEM Assets to Commerce products by SKU or custom rules and syncs them into the catalog; merchandisers can also pick DAM assets inside the Commerce Admin. (Experience League: AEM Assets Integration for Commerce, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/overview)

Gain: **Approved product images, synced by SKU.** Merchandisers manage product images once in AEM Assets; approved images tagged with SKUs reach Commerce products automatically, most within five minutes, keeping storefronts accurate and on brand.

Flows:
- AEM Assets to Adobe Commerce: Approved images and videos matched to product SKUs, with roles and alt text (Experience League: Commerce metadata in AEM Assets, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/metadata)
- Adobe Commerce to AEM Assets: Existing Commerce media files migrated into the AEM Assets DAM (Experience League: Migrate media files to AEM, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/migrate-data)

Lines:
- **XC13 Set up AEM Assets for Commerce metadata**: one-time, 16 / 32 / 56 hours. Enable the Commerce integration in Cloud Manager (or install the assets-commerce package on older releases), activate Dynamic Media with OpenAPI, and set the approval metadata schema.
  - Quote: "enable the integration in Cloud Manager by setting an environment variable and activating Dynamic Media with OpenAPI capabilities" (Experience League: Configure the AEM Assets Project, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/configure-aem)
- **XC14 Connect Commerce and set SKU matching**: one-time, 16 / 32 / 64 hours. Set IMS permissions and the AEM Assets Integration settings in the Commerce Admin, choose Match by product SKU, set the Visualization Owner and start the first sync.
  - Quote: "matches the SKU in the asset metadata with the Commerce product SKU" (Experience League: Configure the integration, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/setup-synchronization)
- **XC15 Migrate Commerce media to AEM Assets**: one-time, 24 / 48 / 120 hours. Move existing product and category media from Commerce into AEM Assets, tag SKUs, roles and positions, and approve, keeping Commerce as Visualization Owner until the sync completes.
  - Quote: "provide built-in features to streamline media file migration from Commerce to the AEM Assets digital asset management system" (Experience League: Migrate media files to AEM, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/migrate-data)
- **XC16 Custom asset matching with App Builder** (optional): one-time, 24 / 56 / 120 hours. Where SKU matching is not enough, build custom matching logic in Adobe Developer App Builder that maps assets to products.
  - Quote: "Implementing custom matching requires developing custom code in Adobe Developer App Builder to define how assets are matched with products." (Experience League: Configure the integration, https://experienceleague.adobe.com/en/docs/commerce/aem-assets-integration/get-started/setup-synchronization)

### Journey Optimizer B2B Edition + AEM Assets (`ajob2b-aemassets`)

How: Journey Optimizer B2B Edition connects to AEM Assets as a Cloud Service repositories with service credentials, so designers use DAM images in emails, templates and visual fragments through linked references. (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)

Gain: **DAM images in every B2B email.** Designers pull images from AEM Assets into account journey emails; DAM updates flow to live emails, and authors see which journeys use a changed image.

Flows:
- AEM Assets to Journey Optimizer B2B Edition: Images by linked reference; DAM changes propagate to live email campaigns (Experience League: Work with Experience Manager Assets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets)
- Journey Optimizer B2B Edition to AEM Assets: Asset usage information, exchanged over the repository connection (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)

Lines:
- **XC17 Connect AEM Assets to AJO B2B Edition**: one-time, 16 / 32 / 56 hours. Generate service credentials in the AEM Headless Developer Console, add each repository and certificate in the B2B Edition, add users to the Assets product profiles, and plan the yearly certificate renewal.
  - Quote: "Generate service credentials for the desired environment on the AEM Headless Developer Console" (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
- **XC18 Re-link email images to AEM Assets** (optional): one-time, 16 / 32 / 64 hours. For email templates imported with images, upload those images to AEM Assets and change the image links in the email design space, since imports land in the Marketo Engage asset store.
  - Quote: "upload them separately in that app interface and change the image links in the email design space" (Experience League: Email Templates, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-templates)

## Not documented

- **Content Analytics + AEM Sites**: Content Analytics overview, configuration, guided and manual configuration, data collection, JavaScript library, reporting, components and paid media pages (no mention of Experience Manager); CJA current release notes; Adobe's Content Analytics product page and 2024 launch release; web searches for Content Analytics with AEM Sites and with Edge Delivery Services. Content Analytics instruments any site through a Tags property or its JavaScript library, but no Adobe page ties it to AEM Sites.
- **Content Analytics + AEM Assets**: Same Content Analytics pages as above; AEM Assets Insights and Content Hub Insights pages (both use Adobe Analytics or Content Hub usage data, not Content Analytics); Adobe's Content Analytics product page, whose FAQ says AEM Assets is not required because any DAM works if assets can be tagged.
- **Content Analytics + Journey Optimizer**: Content Analytics channel list (web, mobile and paid media only, no email or journeys); Journey Optimizer content integration pages; web searches for Content Analytics with Journey Optimizer.
- **Content Analytics + Experimentation Accelerator**: Experimentation Accelerator overview, access, best practices and monitor pages (sources are Journey Optimizer and Target experiments; reporting sources are CJA or Adobe Analytics); Content Analytics pages; web search for both names together.
- **AEM Sites + Experimentation Accelerator**: Experimentation Accelerator pages (only Target and Journey Optimizer experiments are listed); AEM Sites Contextual Experimentation page (AEM's own experimentation rail, which does not mention the accelerator); web search for Experimentation Accelerator with AEM.
- **AEM Assets + Experimentation Accelerator**: Experimentation Accelerator monitor page (treatment images are generated automatically or uploaded from local files, no DAM link); AEM Assets and Dynamic Media pages; web search.
- **Adobe Commerce + Journey Optimizer B2B Edition**: Journey Optimizer B2B Edition overview, setup checklist, Experience Platform events, buying groups and journeys pages (no Commerce mention); Buying group-based marketing blueprint (no Commerce); Commerce Data Connection release notes (B2B requisition list events reach Experience Platform); web searches for both names together. A route through Experience Platform is possible but undocumented, see notes.
- **Journey Optimizer B2B Edition + AEM Sites**: Journey Optimizer B2B Edition web channel configuration (beta, any site with Web SDK), landing page configuration (its own pages), visual fragments, email templates and release notes; Adobe's B2B Edition content and personalization page (names AEM Assets only); web searches for B2B Edition with AEM Sites, Content Fragments or Edge Delivery.

## Notes and caveats

- Content Analytics has no documented connection to any other product in the Omnichannel play. Its documented partner is Customer Journey Analytics, which is not in this play. On the canvas it will sit alone unless cja is added.
- Content Analytics also appears in the Customer Acquisition and Content Reporting and Insights plays, which another helper is researching; the ca lines here may need merging with theirs.
- Experience League sets Content Analytics up inside Customer Journey Analytics (Data Management, Content Analytics Configuration, with CJA admin permissions), while Adobe's product page FAQ answers 'Is Adobe Customer Journey Analytics required?' with 'No.' No needs id was added; confirm the client's entitlement before quoting.
- Experimentation Accelerator is an add-on with its own paid license and needs Journey Optimizer or Adobe Target. Its Experience League overview was last updated Oct 22 2025, and Adobe's old business.adobe.com accelerator page now shows the Journey Optimizer page.
- commerce-aemsites: Adobe says the CIF storefront and CIF Core Components are in maintenance mode and should not be used in new projects, and recommends Edge Delivery with the Adobe Commerce Storefront (the eds product, connection commerce-eds). The CIF add-on is still the documented way to bring product data into AEM authoring for headless builds. It is an extra module provisioned by Adobe through the sales rep.
- commerce-aemsites has one data flow (Commerce to AEM). The CIF pages describe AEM calling the Commerce GraphQL endpoint but do not describe data written back to Commerce.
- commerce-aemassets requires licenses for Adobe Commerce, AEM Assets and AEM Dynamic Media; Commerce on Cloud (PaaS) needs 2.4.5 or later; Commerce and AEM Assets must be in the same IMS organization; configuration works at the global scope only. Adobe states the integration itself has no additional cost. Custom matching needs App Builder.
- aemsites-aemassets: when Sites and Assets run in the same AEM environment they share one repository and no connection setup is needed; XC01 applies when the DAM is a separate environment. Dynamic Media with OpenAPI needs AEM Assets as a Cloud Service and AEM Dynamic Media licenses.
- aemassets-ajo: Journey Optimizer is replacing its Asset Selector and Content Fragment selector with AEM Content Advisor; existing integrations keep working during the transition. The Dynamic Media part is only for Dynamic Media as a Cloud Service customers.
- aemsites-ajo: for healthcare customers the Content Fragment integration needs the Journey Optimizer Healthcare Shield and AEM Extended Security for Healthcare add-ons.
- ajob2b-aemassets needs AEM Assets as a Cloud Service and Dynamic Media licenses with Dynamic Media with OpenAPI enabled, works only with Delivery tier repositories, supports images only, allows one DAM source at a time when authoring, and its certificates expire every 365 days.
- commerce-ajob2b possible route, not documented: Commerce Data Connection sends storefront and B2B requisition list events to Experience Platform, and the B2B Edition can listen to profile-enabled Experience Platform events ingested by streaming. That needs Experience Platform (Real-Time CDP) and no Adobe page describes it end to end.
- Hours are our estimates for a mid-market client; Adobe publishes none. Monthly lines (SI06, AS06, CA06, EX06, JB06) are inferred from Adobe's ongoing tasks (post go-live monitoring, asset reports, insight reviews, experiment KPIs, dashboards); Adobe publishes no monthly service list.
- Quotes were script-checked against downloaded copies of every cited page (whitespace and curly quotes normalized). business.adobe.com pages could not be downloaded from this environment and were read with a web fetch only; none is cited as a line source.

## Before merging into the canvas

- `build.py` reads every `research/*.json` and stops if a product id is missing from `catalog_map.json`. Add `aemsites`, `aemassets`, `ca`, `xa` and `ajob2b` there (names, groups, grid positions) before the next build.
- The file's `plays` block lists the two plays; `build.py` ignores it, so the play picker needs its own entries in `catalog_map.json`.
- Each product carries a `notes` string (add-on and license caveats); `build.py` ignores it.
