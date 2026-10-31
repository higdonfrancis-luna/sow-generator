# AEM Sites and AEM Assets: research trail (Oct 31 2026)

Adam (Oct 31): add AEM Sites and AEM Assets to Create your own play; AEM Assets connects with Workfront and with AEM Sites, and CJA pulls in data from AEM Sites. Data file: `aem_sites_assets.json`. Five researchers took four pairs each; a skeptic per batch re-downloaded every page and re-checked every quote and claim. Their fixes are applied in the data file.

## Result

| Pair | Documented? | Lines (default marked *) |
|---|---|---|
| aemassets-workfront | Yes | XB12*, AXA01, AXA02, AXA03 |
| aemsites-cja | Yes | AXA04*, AXA05*, AXA06 |
| aemsites-rtcdp | Yes | AXA07*, AXA08 |
| aemsites-target | Yes | AXB02*, AXB03 |
| aemassets-marketo | Yes | AXB05*, AXB06 |
| aemsites-bv | Yes | AXC01*, AXC03 |
| aemsites-so | Yes | AXC05*, AXC06, AXC07, AXC08 |
| aemsites-eds | Yes | AXD01*, AXD02*, AXD03, AXD04, AXD07 |
| aemassets-eds | Yes | AXD05*, AXD06 |
| aemsites-cw | Yes | AXD08*, AXD09, AXD10 |
| aemassets-cw | Yes | AXD11*, AXD12 |
| aemsites-workfront | Yes | AXE01, AXE02 |
| aemsites-bc | Yes | AXE03* |
| aemassets-cja | No | |
| aemassets-target | No | |
| aemassets-bv | No | |
| aemassets-rtcdp | No | |
| aemassets-bc | No | |
| aemsites-marketo | No | |
| aemassets-so | No | |

Already documented on Oct 30 and kept: aemsites-aemassets (XC01, XC02), aemsites-ajo, aemassets-ajo, commerce-aemsites, commerce-aemassets (`portal_omnichannel_b2b.json`).

## Changes from the skeptics, applied

- XB12 (Workfront to AEM Assets integration) moved from workfront-eds to aemassets-workfront, with Workfront's AEM Assets integration page as its source; workfront-eds now holds only XB13 (Edge Delivery forms into Workfront Fusion), with its how, gain and flows rewritten to match.
- aemassets-workfront: linked folders and project template workflows apply in Workfront's classic Documents area only; the Workfront Planning fields on assets (Limited Availability, needs GenStudio for Performance Marketing) are left out.
- aemsites-cja: the how cites the AEM Web SDK tutorial for the mechanism; AXA04 adds the dataset to the CJA connection and data view.
- aemsites-rtcdp: AXA07 is only the profile work (8/16/32); the Tags property on AEM pages comes with RT02 or AXA04, so it isn't counted twice.
- aemsites-target: AXB01 dropped (TG01 already implements Target with Web SDK); AXB03 cites AEM's Exporting Content Fragments to Adobe Target page.
- aemsites-bv: AXC02 dropped (repeats C03 and C05) and AXC04 dropped (repeats C07); AXC03 no longer allowlists Spacecat (L02 covers it).
- aemsites-so: the gain says speed fixes arrive as pull requests.
- aemsites-eds: AXD07 moved here from aemassets-eds (the steps run in the AEM author that authors the site); the how tells partners to take SI02 out when every page runs on Edge Delivery.
- Coworker lines trimmed where they repeated CW02, A05, SI01 or AS02; AXD11 quotes an AEM Assets sentence.
- aemsites-marketo and aemassets-so are not documented: the first is AEM Forms work, the second a DAM route any AEM Sites site has.

## Flagged, not changed

- Shared setup still counts more than once in some big builds: XC01 (Page Editor) and AXD05 (Universal Editor) both set up DAM pickers when AEM Sites, AEM Assets and Edge Delivery are all on; AXE03 and XA12 are the same Composer feature when AEM Sites, Edge Delivery and Brand Concierge are all on; CW-AEM (cw-eds) and AXD08 overlap when Coworker, Edge Delivery and AEM Sites are all on.
- SO1, the general Sites Optimizer setup, sits on so-eds, so an AEM Sites plus Sites Optimizer build without Edge Delivery counts only AXC05. Moving SO1 to the Sites Optimizer product would fix it but would take the so-eds line off the AEM play.
- C07 (routing through a customer CDN, on bv-commerce) is not specific to Commerce; a Brand Visibility product line would serve any site.

## Batch A: researcher's trail

# Batch A: AEM Assets + Workfront, AEM Sites + CJA, AEM Assets + CJA, AEM Sites + Real-Time CDP

Checked Oct 31 2026. Hours are our own estimates for a mid-market client; Adobe publishes none. Line ids AXA01 to AXA08.

## Summary

| Pair | Result | Lines |
|---|---|---|
| AEM Assets + Workfront (`aemassets-workfront`) | Documented, with services | AXA01, AXA02, AXA03 (all optional). Its core line is XB12, now on workfront-eds; move it here (see notes) |
| AEM Sites + CJA (`aemsites-cja`) | Documented, through Web SDK and Experience Platform | AXA04, AXA05 default; AXA06 optional |
| AEM Assets + CJA | Not documented | none |
| AEM Sites + Real-Time CDP (`aemsites-rtcdp`) | Documented, through Web SDK and Experience Platform | AXA07 default; AXA08 optional |

## Searches run

1. experienceleague Workfront Experience Manager Assets as a Cloud Service native integration configure metadata mapping linked folders
2. experienceleague "Customer Journey Analytics" "AEM Sites" Web SDK integrate data collection tutorial
3. experienceleague AEM Sites "Real-Time CDP" audiences personalization integration Experience Platform AEM as a Cloud Service
4. experienceleague "AEM Assets" "Customer Journey Analytics" asset performance
5. "Experience Manager" "No current integration, interactions performed on Experience Manager sites are collected via the Experience Platform Web and Mobile SDK"
6. experienceleague AEM Sites personalization Experience Platform audiences Target Web SDK tutorial "AEM" "Real-Time CDP" experience-manager-learn
7. experienceleague Workfront Planning connect records "Experience Manager Assets"
8. experienceleague Workfront Fusion "Adobe Experience Manager Assets modules"
9. experienceleague blueprint content supply chain Workfront "AEM Assets" architecture reference
10. experienceleague "enhanced connector" migrate native integration Workfront "Experience Manager Assets" transition
11. "Customer Journey Analytics" "Experience Manager" AEM site Web SDK data view connection WKND experienceleague
12. experienceleague Coworker "AEM" "Customer Journey Analytics" implementation Web SDK WKND plan implementation
13. AEM Sites Universal Editor OR "Sites console" analytics insights "Customer Journey Analytics" integration 2026 Adobe
14. "Dynamic Media" viewer events "Web SDK" OR "Customer Journey Analytics" experienceleague AEM Assets tracking
15. "Assets Insights" "Customer Journey Analytics" OR "Experience Platform" AEM as a Cloud Service asset impressions clicks
16. AEM ContextHub "Experience Platform" audiences segments personalization AEM as a Cloud Service experienceleague
17. experienceleague "Edge Network Server API" OR "server-side" Experience Platform profile "Experience Manager" personalization AEM
18. "Dynamic Media" "Customer Journey Analytics" Adobe video viewer streaming media
19. "AEM Assets" OR "Experience Manager Assets" "Customer Journey Analytics" integration site:experienceleague.adobe.com
20. Workfront AEM Assets 2026 release native integration new features approval status metadata sync Content Advisor Workfront release notes

Also probed directly: the Experience Cloud integrations guide has pair pages for AEM with Analytics, Target and Workfront (200) but none for AEM with Real-Time CDP, Experience Platform or CJA (404 on every guessed path); the old blueprint URL for Experience Platform and applications returns 404 and its new location shows diagrams only.

## Pages downloaded and checked

| Key | Page | URL | Use |
|---|---|---|---|
| wf_aacs_config | Experience League: Configure the Experience Manager Assets as a Cloud Service integration (Workfront) | https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/configure-integrations/configure-aacs-integration | source |
| wf_migrate_native | Experience League: Migrate from the legacy or enhanced connector to the native AEM Assets integration (Workfront) | https://experienceleague.adobe.com/en/docs/workfront/using/documents/migrate-from-legacy-enhanced-connectors/migrate-to-workfont-integration | source |
| wf_fusion_aemassets_canon | Experience League: Adobe Experience Manager Assets modules (Workfront Fusion) | https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/aem-assets-modules | source |
| wfp_connect_records | Experience League: Connect records (Workfront Planning) | https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-records/connect-records | source |
| aem_rn_2026_6 | Experience League: 2026.6.0 Release Notes for AEM as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/release-notes/release-notes/2026/2026-6-0 | source |
| cw_accel_insights2 | Experience League: Accelerate data insights with Coworker, AEM and CJA | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/accelerate-data-insights | source |
| sites_websdk | Experience League: Integrate AEM Sites and Experience Platform Web SDK | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform/web-sdk | source |
| sites_aa_websdk | Experience League: Integrate AEM Sites and Adobe Analytics with Platform Web SDK | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform/analytics-using-web-sdk | source |
| cc_dl_extending | Experience League: Extending the Adobe Client Data Layer (Core Components) | https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/developing/data-layer/extending | source |
| aem_pers_behavioral | Experience League: Behavioral Targeting (AEM as a Cloud Service tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/behavioral-targeting | source |
| aem_pers_known | Experience League: Known-user personalization (AEM as a Cloud Service tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/known-user-personalization | source |
| cw_video_eng.json | Adobe video captions for Accelerate data insights with Coworker, AEM and CJA | https://video.tv.adobe.com/vc/3504567/eng.json | checks and notes |
| aem_pers_tags | Experience League: Integrate Tags in Adobe Experience Platform (AEM as a Cloud Service tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/setup/integrate-adobe-tags | checks and notes |
| el_integrations_matrix | Experience League: AEM as a Cloud Service integrations with Adobe Experience Cloud | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/integrations/experience-cloud | checks and notes |
| aem_wf_integrations | Experience League: Experience Manager Assets integration with Adobe Workfront | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integrations/workfront-integrations | checks and notes |
| il_aem_workfront | Experience League: Integrate Experience Manager with Workfront | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/integrations-between-applications/experience-manager/experience-manager-workfront | checks and notes |
| wf_aem_overview | Experience League: Overview of Adobe Experience Manager Assets integrations (Workfront) | https://experienceleague.adobe.com/en/docs/workfront/using/documents/wf-aem-integrations/wf-aem-essentials/aem-asset-integrations | checks and notes |
| wf_link_aem | Experience League: Use Adobe Experience Manager with Workfront and Adobe cloud storage | https://experienceleague.adobe.com/en/docs/workfront/using/review-and-approve-work/native-integrations/link-aem-assets-cloud-storage | checks and notes |
| wf_proof_linked | Experience League: Proof a linked asset for Experience Manager Assets or Assets Essentials | https://experienceleague.adobe.com/en/docs/workfront/using/documents/wf-aem-integrations/wf-aem-essentials/proof-linked-asset-aem | checks and notes |
| wf_fusion_aem_workflows | Experience League: Use Workfront Fusion to convert a Workfront issue to a project that includes AEM workflows | https://experienceleague.adobe.com/en/docs/workfront/using/documents/wf-aem-integrations/wf-aem-essentials/use-fusion-to-create-project-with-workflows | checks and notes |
| aem_wf_metadata_map | Experience League: Configure asset metadata mapping between Workfront and Experience Manager Assets | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integrations/configure-asset-metadata-mapping | checks and notes |
| wf_26q1_integrations | Experience League: First Quarter 2026 Integrations enhancements (Workfront) | https://experienceleague.adobe.com/en/docs/workfront/using/product-announcements/product-releases/release-26-q1/26-q1-integrations | checks and notes |
| as_insights | Experience League: Assets Insights | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights | checks and notes |
| tags_asset_insights_ext | Experience League: AEM Asset Insights extension overview (Tags) | https://experienceleague.adobe.com/en/docs/experience-platform/tags/extensions/client/asset-insights/overview | checks and notes |
| dm_tags | Experience League: Integrate Dynamic Media Viewers with Adobe Analytics and Experience Platform Tags | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/tags | checks and notes |
| as_hub_insights | Experience League: Assets Insights in Content Hub | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-hub/insights-content-hub | checks and notes |

## AEM Assets + Workfront (`aemassets-workfront`)

What Adobe says: Workfront's configuration page lists what the native integration does: "Push assets and metadata from Adobe Workfront to Experience Manager Assets", "Link assets from Experience Manager Assets to your projects and tasks in Workfront", and workflows on project templates ("When a Project is created using a Project Template to which a workflow is assigned, the actions defined in the workflow are triggered."). The AEM side agrees: "Adobe offers to integrate Workfront and Adobe Experience Manager Assets natively" and "This integration has become the required method for connecting these two solutions." Adobe's AEM integrations list ticks Workfront for AEM Assets only, and the integrations guide says "AEM and Workfront streamline content production, allowing seamless import of managed content from Workfront to AEM for efficient organization and access, ensuring timely and high-quality digital asset delivery."

How: Workfront's native integration connects projects to an AEM Assets as a Cloud Service repository: teams send finished documents with mapped project metadata to AEM, link AEM assets to projects and tasks, and project templates can create linked folders and publish assets automatically. (Experience League: Configure the Experience Manager Assets as a Cloud Service integration (Workfront), https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/configure-integrations/configure-aacs-integration)

Gain: **Finished work lands in the DAM.** Work completed in Workfront projects moves into AEM Assets with its project metadata, in folders made for each project, so teams find and reuse it instead of uploading it again or recreating it.

Flows:
- Workfront to AEM Assets: Documents and mapped project metadata, sent to linked folders and optionally published (Experience League: Configure the Experience Manager Assets as a Cloud Service integration (Workfront), https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/configure-integrations/configure-aacs-integration)
- AEM Assets to Workfront: AEM assets linked to Workfront projects and tasks (Experience League: Configure the Experience Manager Assets as a Cloud Service integration (Workfront), https://experienceleague.adobe.com/en/docs/workfront/using/administration-and-setup/configure-integrations/configure-aacs-integration)
- Workfront to AEM Assets: Workfront Planning campaign fields, shown read-only on asset properties for search (Experience League: 2026.6.0 Release Notes for AEM as a Cloud Service, https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/release-notes/release-notes/2026/2026-6-0)
- Quotes behind the flows: "Metadata maps when an asset is pushed from Workfront for the first time." and "Publish assets that are sent to Adobe Experience Manager Assets" (Workfront configuration page); "campaign metadata fields, including Campaign, Region, Channel, Persona, and Product, are now available in asset properties under a dedicated read-only Campaign tab" (AEM 2026.6.0 release notes).

Lines:
- **AXA01 Move from the old Workfront connector** (optional): one-time, 24 / 40 / 80 hours. For clients still on the legacy or enhanced connector: move existing linked folders and documents to the native integration, validate the critical use cases, then uninstall the old connector, which cannot run alongside the native one.
  - Quote: "It will be important to validate all critical use cases intended to be used through the native integration prior to uninstalling the legacy or enhanced connector." (Experience League: Migrate from the legacy or enhanced connector to the native AEM Assets integration (Workfront), https://experienceleague.adobe.com/en/docs/workfront/using/documents/migrate-from-legacy-enhanced-connectors/migrate-to-workfont-integration)
- **AXA02 Fusion automations with AEM Assets** (optional): one-time, 24 / 48 / 80 hours. Where the native integration stops short, set up the server-to-server credentials with write access and build Workfront Fusion scenarios with the AEM Assets connector, such as metadata updates, asset imports from a URL, or scenarios that start when an asset changes in AEM.
  - Quote: "With the Adobe Experience Manager Assets connector for Adobe Workfront Fusion, you can create, upload, and update assets, and copy or move folders and assets." (Experience League: Adobe Experience Manager Assets modules (Workfront Fusion), https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/aem-assets-modules)
- **AXA03 Planning campaigns linked to AEM assets** (optional): one-time, 8 / 16 / 32 hours. For clients on Workfront Planning, connect record types such as campaigns to AEM Assets, choose the lookup fields to show, agree how teams link images, folders and Content Fragments to records, and map Planning fields so they show on the linked assets in AEM.
  - Quote: "After you create a connection between a record type and Adobe Experience Manager objects, you can connect individual records to Experience Manager objects." (Experience League: Connect records (Workfront Planning), https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-records/connect-records)

Left out on purpose: the core setup (connect the repository, map metadata on both sides, linked folder trees, create-folder and publish workflows) is XB12 on workfront-eds; repeating it here would double count, so the notes recommend moving XB12 to this connection. The AEM-side metadata schema ("After configuring the asset metadata mapping in Adobe Workfront, you must use the same mapping in Experience Manager Assets as a Cloud Service application to display appropriate metadata results for the image.") is part of that same mapping job. No proofing line: on Adobe cloud storage "Review and approval workflows are not supported for linked AEM assets.", and proofing linked assets is "not available in the new Documents area."

Verdict: documented, with services.

## AEM Sites + CJA (`aemsites-cja`)

The question asked: CJA gets AEM Sites data only through Web SDK and Experience Platform datasets. Does an Adobe page describe that route with AEM Sites by name? Yes, two:
- AEM Sites tutorial, Integrate AEM Sites and Experience Platform Web SDK: "This foundational step is essential for integrating Adobe Experience Cloud products, such as Adobe Analytics, Target, or recent innovative products like Real-Time Customer Data Platform, Customer Journey Analytics, and Journey Optimizer." It connects the Tags property to AEM ("After linking the tag property, the WKND site is able to load the tag property's JavaScript library onto the web pages using the tags in Adobe Experience Platform cloud service configuration.") and stores the data in Experience Platform ("The pageview data collected using Web SDK is stored in the Experience Platform data lake as datasets."). It stops at the dataset.
- Coworker page, Accelerate data insights with Coworker, AEM and CJA (Oct 28 2026): Coworker "helps turn a data insights goal into a connected implementation workflow across Adobe Experience Manager (AEM), Adobe Experience Platform (AEP), Web SDK, and Customer Journey Analytics (CJA)" "until WKND website engagement data is available for analysis in CJA". Its video captions (which spell WKND as 'weekend'): "I'm starting with the weekend site running on AEM as a cloud service.", "I wanted to collect page views and CTA interactions and make that behavior available for analysis in customer journey analytics", "This required configuration of tags in Adobe Experience Platform, as well as changes to the AEM implementation.", "I created the connection in CJA", "I can see page views by page name and CTA clicks by CTA label."

Against it: Adobe's AEM integrations list (Sept 22 2026) has a Customer Journey Analytics row that is blank for Sites, Assets and Forms, and the CJA guide never mentions Experience Manager (Oct 31 re-check). So this is a documented route through Experience Platform, not a product connector.

How: CJA reads AEM Sites data through Experience Platform, not a direct connector: a Tags property connected in AEM sends page views and CTA clicks from the AEM data layer with Web SDK into an Experience Platform dataset, and a CJA connection and data view make it reportable. (Experience League: Accelerate data insights with Coworker, AEM and CJA, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/accelerate-data-insights)

Gain: **AEM pages in the full customer journey.** Content and marketing teams see AEM page views and CTA clicks in CJA next to the client's other channels, so they know which pages and calls to action move people toward conversion.

Flows:
- AEM Sites to CJA: Page views and CTA clicks from the AEM site, through Web SDK and an Experience Platform dataset (Experience League: Accelerate data insights with Coworker, AEM and CJA, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/accelerate-data-insights)

Lines:
- **AXA04 AEM page data collection for CJA**: one-time, 16 / 32 / 64 hours. Connect the Tags property to AEM through its IMS and cloud configurations, build data elements from the AEM Core Components data layer (page name, site section, host), send page views with Web SDK, and check that they reach the dataset CJA reads.
  - Quote: "Rule: Send data to Platform Edge Network whenever a WKND webpage is visited using the Adobe Client Data Layer triggered cmp:show event." (Experience League: Integrate AEM Sites and Experience Platform Web SDK, https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform/web-sdk)
- **AXA05 CTA click tracking from the AEM data layer**: one-time, 8 / 16 / 32 hours. Add a Tags rule on the data layer's click event for the site's buttons and teaser CTAs, send the CTA ID and name with Web SDK, and check the clicks in the dataset before they are added to the CJA data view.
  - Quote: "The Dataset created in the previous tutorial is reused to verify that the pageview and CTA click data is ingested into the Experience Platform Dataset." (Experience League: Integrate AEM Sites and Adobe Analytics with Platform Web SDK, https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/integrations/experience-platform/analytics-using-web-sdk)
- **AXA06 Custom components in the data layer** (optional): one-time, 16 / 32 / 64 hours. Where the site has custom components, enable the data layer for them and extend their models with the author fields reporting needs, so their views and clicks reach CJA with that detail.
  - Quote: "You can extend the Core Components with custom dialog options that allow content authors to enter additional information related to the Data Layer." (Experience League: Extending the Adobe Client Data Layer (Core Components), https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/developing/data-layer/extending)

Left out on purpose: XDM schema and dataset design (CJ01), the CJA connection, data view and stitching (CJ02) and Workspace projects (CJ04) are already on the CJA product. No flow from CJA back to AEM Sites is documented.

Verdict: documented, with services.

## AEM Assets + CJA

Not documented. Searched: Adobe's AEM as a Cloud Service integrations list (Sept 22 2026), whose Customer Journey Analytics row is blank for AEM Sites, Assets and Forms. AEM Assets pages: Assets Insights (needs an Adobe Analytics license), Assets Insights in Content Hub (Content Hub's own usage data), Integrate Dynamic Media Viewers with Adobe Analytics and Experience Platform Tags (viewer events are open to any tag extension, CJA is never named). Experience Platform Tags: the AEM Asset Insights extension (needs the Adobe Analytics tag extension). Earlier crawls from the Oct 31 Content Analytics re-check: 'Experience Manager' never appears in the CJA guide and 'Customer Journey Analytics' never appears in the AEM Assets guide. Web searches: AEM Assets or Experience Manager Assets with Customer Journey Analytics on Experience League; Assets Insights with CJA or Experience Platform; Dynamic Media viewers with Web SDK or CJA; Dynamic Media with CJA streaming media. Asset impressions and clicks reach Adobe Analytics, and CJA could take them through the Analytics source connector, but no Adobe page describes AEM Assets data in CJA.

Checked quotes: "You must have an Adobe Analytics license to use this feature." (Assets Insights); "tag extension for Adobe Experience Platform must be installed into the same web property" (AEM Asset Insights extension, about the Adobe Analytics extension); "you can use the events and data exposed by the viewers with any other Experience Platform Tags extension that comes from Adobe or a third-party" (Dynamic Media viewers, generic); "Assets Insights in Content Hub delivers a clear, data-driven view of how digital assets perform across marketing campaigns, channels, and regions." (Content Hub, own usage data).

Verdict: not documented.

## AEM Sites + Real-Time CDP (`aemsites-rtcdp`)

What Adobe says: the AEM Sites Web SDK tutorial names Real-Time CDP as the next application ("you are ready to advance the Experience Platform implementation using applications like Real-Time Customer Data Platform (Real-Time CDP), Customer Journey Analytics (CJA), and Adobe Journey Optimizer (AJO)"). The AEM personalization tutorials do the work in Experience Platform: "The AEP's various solutions are used to collect, manage, and harvest behavioral data to create audiences." "The dataset must be enabled for Profile to allow audience creation and personalization." "In this tutorial, you learn about identity stitching and build a customer profile in Adobe Experience Platform." On the AEM side: "The Tags (aka Launch) integration enables you to deploy the Adobe Web SDK and inject custom JavaScript for data collection and personalization into your AEM pages." The way back to AEM pages runs through Target: "These audiences are then activated in Adobe Target." and "Integrate Adobe Target and export personalized offers to Adobe Target".

How: Real-Time CDP builds profiles and audiences from AEM Sites behavior: a Tags property connected in AEM sends page views, and the login ID of known visitors, with Web SDK to profile-enabled Experience Platform datasets. Adobe's AEM tutorials then share those audiences with Adobe Target to personalize AEM pages with Experience Fragments. (Experience League: Behavioral Targeting (AEM as a Cloud Service tutorial), https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/behavioral-targeting)

Gain: **Site behavior builds the profile.** Every visit to the AEM site adds to the customer profile, so audiences reflect what people browse and read; with Target in place, the same audiences personalize AEM pages.

Flows:
- AEM Sites to Real-Time CDP: Page views and login status from AEM pages, sent with Web SDK to profile-enabled datasets (Experience League: Known-user personalization (AEM as a Cloud Service tutorial), https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/known-user-personalization)
- Real-Time CDP to AEM Sites (needs target): Audiences shared through the Adobe Target destination, which Target uses to show AEM Experience Fragments on AEM pages (Experience League: Behavioral Targeting (AEM as a Cloud Service tutorial), https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/behavioral-targeting)
- Quotes behind the flows: "The logical diagram shows the user interaction with the WKND site and how behavioral and transactional data are collected and fed into the Experience Platform." (Known-user personalization); "Using activities in Adobe Target, personalized experiences are delivered to the users that match the audiences criteria." (Behavioral Targeting).

Lines:
- **AXA07 AEM site behavior into profiles**: one-time, 16 / 32 / 64 hours. Inject the Tags property into AEM pages through the IMS and cloud configurations, send page views from the AEM data layer with Web SDK to a profile-enabled dataset, and check that visits build profiles under the agreed identities.
  - Quote: "To create audiences based on behavioral data, it is necessary to collect and store data when users visit or interact with your website." (Experience League: Behavioral Targeting (AEM as a Cloud Service tutorial), https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/behavioral-targeting)
- **AXA08 Known visitors from the AEM login** (optional): one-time, 16 / 24 / 48 hours. Where the site has a login, make the AEM user ID available to Tags and send it in Web SDK's identity map under the client's own namespace, so site visits join CRM or order data in one profile.
  - Quote: "Enhance the WKND site Login functionality to store the user id in the browser's session storage." (Experience League: Known-user personalization (AEM as a Cloud Service tutorial), https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/known-user-personalization)

Left out on purpose: schemas and identity design (RT01), generic ingestion (RT02), merge policy (RT03), audiences and destinations (RT04), sharing audiences to Target (XA05, XA06) and exporting Experience Fragments to Target (an aemsites-target task) already sit elsewhere or belong to another pair.

Verdict: documented, with services.

## Quote check

Every page above was downloaded with curl on Oct 31 2026 and every quote in this batch (JSON, trail and notes) was checked by script against the page text, with whitespace and curly quotes normalized: 70 targeted checks passed, 0 failed, and a second pass found all 43 distinct quoted passages in this file on the downloaded pages. A test with three made-up quotes failed all three, as it should.


## Batch B: researcher's trail

# Batch B: AEM Sites and AEM Assets with Target and Marketo Engage

Checked Oct 31 2026. Hours are our own estimates for a mid-market client; Adobe publishes none. Every page below was downloaded with curl from experienceleague.adobe.com, converted to text, and every quote was checked against that text by script (127 checks passed, 0 failed).

## Summary

| Pair | Verdict | Lines |
|---|---|---|
| AEM Sites + Target (`aemsites-target`) | Documented, with services | AXB01 and AXB02 on by default, AXB03 optional |
| AEM Assets + Target | Not documented | none |
| AEM Sites + Marketo Engage (`aemsites-marketo`) | Documented only through AEM Forms (separate license) | AXB04 optional |
| AEM Assets + Marketo Engage (`aemassets-marketo`) | Documented, with services | AXB05 on by default, AXB06 optional |

No pair landed in 'documented, but no services'. None of Adam's named pairs (AEM Assets with Workfront or AEM Sites, CJA with AEM Sites) is in batch B.

## Searches run

1. experienceleague AEM as a Cloud Service integrating with Adobe Target Experience Fragments export
2. experienceleague AEM as a Cloud Service Marketo Engage integration Sites forms
3. Marketo Engage AEM Assets as a Cloud Service integration email designer select images
4. Adobe Target AEM Assets integration select images Visual Experience Composer experienceleague
5. experienceleague AEM Cloud Service export Content Fragments to Adobe Target JSON offers
6. experienceleague Dynamic Media Adobe Target integration AEM Assets as a Cloud Service
7. experienceleague integrations-learn experience manager target integration use cases
8. Marketo Engage release notes Adobe Experience Manager Assets email designer Dynamic Media OpenAPI
9. "Marketo" "AEM Sites" form component OR embed Experience League Adobe documentation cloud service
10. Marketo Engage email designer AEM Content Fragments OR "Experience Fragments" Adobe Experience Manager Sites content in emails
11. experienceleague create or add an Adaptive Form to AEM Sites page submit action Marketo Engage
12. Marketo Engage "Adobe Experience Cloud integrations" Experience Manager Target Analytics list experienceleague marketo product-docs
13. Adobe Target offers images "Dynamic Media" OR "AEM Assets" image offer URL experienceleague target documentation
14. Adobe Target release notes 2026 "Experience Manager" assets OR "Content Advisor" OR "asset selector"
15. experienceleague AEM Assets "Content Advisor" overview integrated applications Journey Optimizer Express Workfront Target
16. "Dynamic Media" "Adobe Target" site:experienceleague.adobe.com experience-manager-cloud-service assets
17. Marketo Engage release notes "Experience Manager Assets" Email Designer integration 2025
18. AEM as a Cloud Service ContextHub Audience Manager segments OR "Experience Cloud audiences" personalization Sites experienceleague
19. "Marketo" "Experience Fragments" OR "Universal Editor" OR "Edge Delivery" AEM Sites integration Adobe blog OR experienceleague 2025 2026
20. experienceleague Adobe Target "image offers" content library assets folder "Experience Manager"

## AEM Sites + Target (`aemsites-target`): documented, with services

Searches 1, 5, 7, 18. Pages read: AEM's Integrating with Adobe Target, Exporting Experience Fragments to Adobe Target, Content Fragments overview, Personalization and Content Targeting, Managing Audiences; the AEM as a Cloud Service tutorials Integrate Adobe Target, Integrate Tags, Personalization Overview, Experimentation (A/B Testing), Behavioral Targeting, Known-user Personalization and Integrate AEM Headless and Target; Target's Integrate Target with AEM, AEM Experience Fragments and Content Fragments overview, AEM Experience Fragments, AEM Content Fragments and Manage code and image offers; the integrations page Integrate Target with Experience Manager. The older tutorial URL for exporting fragments to Target (sites/integrations/target/export-experience-fragment-target) now redirects to the Personalization Overview.

- How: AEM's integration page: "For the export of Experience Fragments and/or Content Fragments to Target, you need the Adobe Target Configuration, including the IMS Integration." Adobe's integrations page lists "AEM Sites and Target" through "Experience Platform Web SDK tags extension or alloy.js", "When you want to personalize AEM web site experiences."
- Flows: Target imports each fragment "as an HTML or JSON offer" (Experience Fragments) or "as a JSON offer" (Content Fragments) and "looks for Experience Fragments to import every ten minutes". Back on the page, the A/B tutorial's Web SDK response "should include the personalization decisions made by Adobe Target, indicating which variation was served."
- AXB01: "By adding the Adobe Target extension to Experience Platform Launch, you can use the features of Adobe Target on AEM web pages." The Tags tutorial: the integration "enables you to deploy the Adobe Web SDK and inject custom JavaScript for data collection and personalization into your AEM pages."
- AXB02: Experience Fragments "can then be used as offers in Target activities, to test and personalize experiences at scale." Setup steps from the tutorial ("configure an Adobe Developer Console project using OAuth server-to-server authentication", "create a legacy Adobe Target configuration in AEM") and the export page (Link Externalizer on author, export format, workspace and externalizer domain, "It has to be an Experience Fragment Web variation."). Target's page asks for "a small piece of HTML and not a full HTML page".
- AXB03: "Content Fragments that exist under the configured AEM Assets folder hierarchy can be exported to Adobe Target as Content Fragment Offers." The integration "must be granted the Editor product role in Adobe Admin Console". Target consumes them "using the Form-Based Experience Composer only."
- Overlap check: Target's product lines (TG01 Web SDK implementation, TG03 and TG05 activities) are not repeated; AXB01 is only the AEM side of loading Tags. target-eds (XA22) covers Edge Delivery pages through the martech plugin. aemsites-ajo (XC05 to XC07) covers Content Fragments for Journey Optimizer, not Target.
- Verdict: documented. Content Fragments are "A Sites feature." and "Stored as Assets", so the Content Fragment export sits here, not on an AEM Assets pair.

## AEM Assets + Target: not documented

Searches 4, 6, 13, 14, 15, 16, 20. Pages read: Target's Integrate Target with AEM, AEM Experience Fragments and Content Fragments overview, Manage code and image offers, Dynamic Media Classic (formerly Scene7) configuration and Upload or delete image offers; AEM's Integrate AEM Assets with downstream applications, Dynamic Media with OpenAPI capabilities and Exporting Experience Fragments to Adobe Target; the Experience Cloud Integrations page.

- Target names its AEM integration as fragments only: it "lets you use Experience Fragments (XFs) and Content Fragments (CFs) created in AEM in Target activities". The offers library filters by "AEM Type: Content Fragments and Experience Fragments."
- Target's image library integrates with "Adobe Dynamic Media Classic (formerly Scene7)" for images "uploaded to the Adobe Experience Cloud assets folder", which is not AEM Assets as a Cloud Service.
- AEM Assets' downstream page offers Search and Delivery APIs and Content Advisor and names no Target integration.
- In fragment export, "only a reference is exported to Target. The asset itself remains stored in AEM Assets and is delivered from the AEM publish instance." That is an AEM Sites feature carrying DAM images, already covered by `aemsites-target`.
- The Experience Cloud Integrations page shares CX Enterprise assets with Target, and its link "Configuring AEM Assets integration with CX Enterprise and Creative Cloud" now points to the docs home page.
- Only community threads and an Ideas request ask for DAM access inside Target's Visual Experience Composer.
- Verdict: not documented.

## AEM Sites + Marketo Engage (`aemsites-marketo`): documented only through AEM Forms

Searches 2, 9, 10, 11, 12, 19. Pages read: the integrations pages Integrate Marketo Engage with Experience Manager and Integrate Experience Manager with Marketo Engage; AEM Forms' Integrate Marketo Engage with AEM Forms, Integrate an Adaptive Form with Marketo Engage, Configure Marketo Engage data source for existing Adaptive Forms, Configure the submit action to Marketo Engage for existing forms, Submit Actions Supported in Adaptive Forms based on Core Components, Add an Adaptive Form to an AEM Sites page (two versions) and Submit actions for Edge Delivery Services forms; Marketo's Adobe Experience Cloud Integrations Overview, Send a List to Adobe Experience Cloud, Configuring Adobe Experience Manager Integration and Importing Assets with Adobe Experience Manager.

- Both integrations pages name only "Experience Manager Forms and Marketo Engage".
- AEM Forms ties the two to Sites pages: "Adobe recommends using Core Components to add Adaptive Forms to an AEM Sites Page or to create standalone Adaptive Forms.", and the same page lists "Submit to Marketo enagage" (Adobe's spelling). "With AEM Forms, you can seamlessly add a form to your AEM Sites page."
- Flows: "Adaptive Forms editor provides the Submit to Marketo Engage submit action to send Adaptive Forms data to Adobe Marketo Engage for processing." In the other direction, Marketo lead fields "are displayed in the Data Model Objects tab of the Content Browser" to build the form.
- AXB04: "The Cloud configuration connects your Experience Manager instance to the Adobe Marketo Engage instance." Credentials come from LaunchPoint and the REST API Identity URL.
- Routes not used: Send a List names "Adobe Experience Manager" among destination applications, with no AEM page on using those audiences; Marketo's Design Studio import from AEM "only works with on-premise implementations of AEM and is not supported for AEM Cloud Service implementations"; the Munchkin code is already on MK01; no Adobe page puts AEM Content Fragments or Experience Fragments into Marketo emails.
- A search snippet said Edge Delivery Services forms cannot connect to Marketo Engage; the current pages do not say that, and the Edge Delivery submit actions page still lists "Submit to Marketo Engage" for forms built in Universal Editor (XB09's source).
- Verdict: documented through AEM Forms, a product not on the canvas, the same way as `marketo-eds`. The line is optional.

## AEM Assets + Marketo Engage (`aemassets-marketo`): documented, with services

Searches 3, 8, 17. Pages read: Marketo's Work with Experience Manager assets, Email Designer overview, January 2025 release notes, Configuring Adobe Experience Manager Integration and Importing Assets with Adobe Experience Manager; AEM's Dynamic Media with OpenAPI capabilities and the Service credentials tutorial.

- How: AEM Assets "is natively integrated with Marketo Engage, so you can easily access Assets as a Cloud Service to discover and use digital assets to populate your messages." The January 2025 release brought the new Email Designer, which can "access images from Adobe Experience Manager cloud services."
- Flows: "the latest changes in Assets as a Cloud Service automatically propagate to live email campaigns through linked references", and "the email authors are notified about the image changes" when images in use are modified or deleted.
- AXB05: "Before you can use this capability, you must first link AEM Cloud Services with Adobe Marketo Engage." Prerequisites on the page: licenses for Assets as a Cloud Service and Dynamic Media, "Dynamic Media with Open API is enabled", Delivery tier repositories only, the same IMS org, a service credential certificate, users in "Assets Consumer Users and/or Assets Users Product profiles". The Email Designer needs the subscription "migrated to the Adobe Identity Management System (IMS)".
- AXB06: "you can designate AEM Assets as the source for assets when you create or view details for an email, email template, or visual fragment." Deleted images "appear with a broken reference in your emails."
- Overlap check: AS01 (DAM users and access) and AS05 (Content Hub approvals) stay on the AEM Assets product; Dynamic Media with OpenAPI activation already sits on XC13 and is a prerequisite of XC01, so AXB05 only confirms it is on. The B2B Edition's own repository link is XC17 on `ajob2b-aemassets`.
- Ruled out: the older Design Studio import supports "Adobe Experience Manager versions 6.4 and 6.5" only and copies images.
- Verdict: documented.

## Pages downloaded and checked

| Key | Page | URL | Use |
|---|---|---|---|
| aem_int_target | Integrating with Adobe Target | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-target | source |
| aem_xf_target | Exporting Experience Fragments to Adobe Target | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/experience-fragments-target | source |
| learn_cf_target | Integrate AEM Headless and Target | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/integrations/target | source |
| learn_ab | Experimentation (A/B Testing) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/experimentation | source |
| learn_pers_target | Integrate Adobe Target (tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/setup/integrate-adobe-target | support |
| learn_tags | Integrate Tags in Adobe Experience Platform (tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/setup/integrate-adobe-tags | support |
| learn_sites_target_ov | Personalization Overview (tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/overview | support |
| learn_behav | Behavioral Targeting (tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/behavioral-targeting | read |
| learn_known | Known-user Personalization (tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/personalization/use-cases/known-user-personalization | read |
| il_target_aem | Integrate Target with Experience Manager | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/integrations-between-applications/target/target-experience-manager | support |
| tg_aem_int | Integrate Target with Adobe Experience Manager (AEM) | https://experienceleague.adobe.com/en/docs/target/using/integrate/aem/aem-target-integration | support |
| tg_aem_xf | AEM Experience and Content Fragments (short page) | https://experienceleague.adobe.com/en/docs/target/using/experiences/offers/aem-experience-fragments | read |
| tg_xf_cf_overview | AEM Experience Fragments and Content Fragments overview | https://experienceleague.adobe.com/en/docs/target/using/integrate/aem/fragments/aem-experience-and-content-fragments | support |
| tg_xf_aem | AEM Experience Fragments (Target) | https://experienceleague.adobe.com/en/docs/target/using/integrate/aem/fragments/experience-fragments-aem | source |
| tg_cf_aem | AEM Content Fragments (Target) | https://experienceleague.adobe.com/en/docs/target/using/integrate/aem/fragments/content-fragments-aem | source |
| tg_manage_content | Manage code and image offers (Target) | https://experienceleague.adobe.com/en/docs/target/using/experiences/offers/manage-content | support |
| tg_assets_upload | Upload or delete image offers (Target) | https://experienceleague.adobe.com/en/docs/target/using/experiences/offers/assets-upload | read |
| tg_scene7 | Dynamic Media Classic (formerly Scene7) configuration (Target) | https://experienceleague.adobe.com/en/docs/target/using/administer/scene7-settings | support |
| aem_cf_overview | Working with Content Fragments (overview) | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/administering/content-fragments/overview | support |
| aem_pers_overview | Personalization and Content Targeting | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/authoring/personalization/overview | support |
| aem_audiences | Managing Audiences | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/authoring/personalization/audiences | support |
| as_downstream | Integrate AEM Assets with downstream applications | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-dynamic-media-open-apis | support |
| dm_openapi_overview | Dynamic Media with OpenAPI capabilities | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/dynamic-media-open-apis-overview | support |
| ec_integrations | Experience Cloud Integrations | https://experienceleague.adobe.com/en/docs/core-services/interface/administration/integrations | support |
| mkto_aem_assets | Work with Experience Manager assets (Marketo Engage) | https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/aem-assets | source |
| mkto_ed_overview | Email Designer overview (Marketo Engage) | https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/email-marketing/email-designer/overview | support |
| mkto_rn_jan25 | Marketo Engage Release Notes, January 2025 | https://experienceleague.adobe.com/en/docs/marketo/using/release-notes/previous-releases/2025/release-notes-jan-25 | support |
| aem_service_creds | Service credentials (AEM tutorial linked from the Marketo page) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/getting-started-with-aem-headless/authentication/service-credentials | read |
| mkto_aem_config | Configuring Adobe Experience Manager Integration (Marketo Engage) | https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/miscellaneous/configuring-adobe-experience-manager-integration | support |
| mkto_import_aem | Importing Assets with Adobe Experience Manager (Marketo Engage) | https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/importing-assets-with-adobe-experience-manager | support |
| mkto_ec_overview | Adobe Experience Cloud Integrations Overview (Marketo Engage) | https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/adobe-experience-cloud-integrations-overview | support |
| mkto_send_list | Send a List to Adobe Experience Cloud (Marketo Engage) | https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud | support |
| il_mkto_aem | Integrate Marketo Engage with Experience Manager | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/integrations-between-applications/marketo/marketo-experience-manager | support |
| il_aem_mkto | Integrate Experience Manager with Marketo Engage | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/integrations-between-applications/experience-manager/experience-manager-marketo | support |
| aemforms_mkto_cfg | Integrate Marketo Engage with AEM Forms | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/set-submit-action/integrate-adaptive-form-with-market-engage/integrate-form-to-marketo-engage | source |
| aemforms_mkto | Integrate an Adaptive Form with Marketo Engage | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/set-submit-action/integrate-adaptive-form-with-market-engage/integrate-adaptive-form-with-marketo-engage | support |
| aemforms_mkto_ds | Configure Marketo Engage data source for existing Adaptive Forms | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/set-submit-action/integrate-adaptive-form-with-market-engage/use-marketo-engage-data-source-in-form | source |
| forms_mkto_submit | Configure the submit action to Marketo Engage for existing forms | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/set-submit-action/integrate-adaptive-form-with-market-engage/submit-adaptive-form-to-marketo-engage | source |
| forms_submit_cc | Submit Actions Supported in Adaptive Forms based on Core Components | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/set-submit-action/configure-submit-actions-core-components | source |
| forms_in_sites | Add an Adaptive Form to an AEM Sites page or Experience Fragment | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/adaptive-forms-authoring/create-or-add-an-adaptive-form-to-aem-sites-page | support |
| forms_embed_sites | Add an Adaptive Form to an AEM Sites page (Core Components version) | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/embed-adaptive-form-aem-sites | read |
| eds_forms_submit | Submit actions for Edge Delivery Services forms | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/set-submit-action/configure-submit-action-eds-forms | support |

A guessed URL for Marketo's Audience Manager integration page (marketo-integration-with-adobe-audience-manager) returned 404; it was not needed.


## Batch C: researcher's trail

# Batch C: AEM Sites and AEM Assets with Brand Visibility and Sites Optimizer

Checked Oct 31 2026. Every cited page was downloaded with curl into a scratch folder and converted to text; each line quote, the key claim behind each connection and flow, and the facts used in the notes were checked by script against that text (whitespace and curly quotes normalized): 63 checks passed, 0 failed. Hours are our own estimates for a mid-market client; Adobe publishes none.

| Pair | Verdict | Lines |
|---|---|---|
| AEM Sites + Brand Visibility (`aemsites-bv`) | Documented, with services | AXC01, AXC02 (default); AXC03, AXC04 (optional) |
| AEM Assets + Brand Visibility | Not documented | none |
| AEM Sites + Sites Optimizer (`aemsites-so`) | Documented, with services | AXC05 (default); AXC06, AXC07, AXC08 (optional) |
| AEM Assets + Sites Optimizer (`aemassets-so`) | Documented, with services (thin) | AXC09 (optional) |

## How the research ran

1. Downloaded every page in the Brand Visibility table of contents (61 pages, from `/en/toc/brand-visibility-help-main-toc.plain.html`) and every page in the Sites Optimizer table of contents (45 pages, from `/en/toc/experience-manager-sites-optimizer-help-main-toc.plain.html`), then searched them for AEM, Experience Manager, Cloud Service, author, Dispatcher, Cloud Manager, DAM, Digital Asset Management, Dynamic Media, asset, image and alt text.
2. Downloaded the AEM as a Cloud Service table of contents and pulled the pages on CDN, traffic filter rules, log forwarding, Operational Telemetry, SEO, Experience Hub and the agentic capabilities, plus seven AEM Assets pages, and searched them for Brand Visibility, LLM Optimizer and Sites Optimizer.
3. Downloaded the helpx product descriptions for Sites Optimizer and LLM Optimizer, the Brand Visibility and Sites Optimizer security overviews (adobe.com PDFs), two Adobe news releases (news.adobe.com), two Ultimate Success webinar pages with their video transcripts, and the transcripts of four Sites Optimizer videos (alt text, broken backlinks, Core Web Vitals and the trial).
4. Web searches (below) to find pages outside the two tables of contents.

Web searches run:

1. "LLM Optimizer" OR "Brand Visibility" Adobe "AEM Sites" deploy to author recommendations Experience Manager
2. "Sites Optimizer" "missing alt text" AEM Assets DAM deploy alt text experienceleague
3. "LLM Optimizer" "Experience Manager Assets" OR "AEM Assets" images AI visibility
4. experienceleague "AEM as a Cloud Service" "Operational Telemetry" Sites Optimizer enable data collection
5. experienceleague.adobe.com experience-manager-cloud-service "Sites Optimizer"
6. "edgeoptimize" OR "Edge Optimize" AEM as a Cloud Service CDN configuration LLM Optimizer agentic traffic
7. experienceleague AEM Cloud Service "log forwarding" "LLM Optimizer" OR "Brand Visibility" CDN logs agentic traffic AEM managed CDN
8. helpx.adobe.com legal product-descriptions "LLM Optimizer" OR "Brand Visibility" Adobe product description
9. "Brand Visibility" Adobe "Experience Manager Sites" "send recommendations" OR "natively integrated" AEM Sites author
10. "Sites Optimizer" alt text "asset metadata" OR "dc:description" OR "AEM Assets" DAM writes alt text AEM
11. "Sites Optimizer" "AEM Assets" OR "Experience Manager Assets" OR "Dynamic Media" image optimization opportunity
12. business.adobe.com AEM Sites compare "Brand Visibility" "Sites Optimizer" AI citation visibility signals

## AEM Sites + Brand Visibility (`aemsites-bv`): documented, with services

Pages read: Brand Visibility Optimize at Edge overview and its AEM Cloud Service Managed CDN (Fastly) guide, the six bring-your-own-CDN guides, Quick Start, Brands Management, Customer Configuration, Agentic Traffic, Referral Traffic, log forwarding overview and Fastly guide, all opportunity pages, release notes; Brand Visibility security overview (October 2026); LLM Optimizer product description; Adobe news of Apr 20 and Jun 17 2026; Ultimate Success webinars "From SEO to GEO: Optimizing AEM Sites for Web Performance and AI Discovery" and "Win Visibility in the AI Era with Adobe LLM Optimizer & Sites Optimizer" (pages and transcripts); AEM pages on the CDN, traffic filter rules, log forwarding, Operational Telemetry and Experience Hub.

What Adobe documents:
- Optimize at Edge has its own guide for the AEM Cloud Service Managed CDN (Fastly): "This configuration routes agentic traffic (requests from AI bots and LLM user agents) to the Edge Optimize backend service (live.edgeoptimize.net)." The overview: "For AEM Cloud Service managed Fastly customers, the routing setup is self-serve and can be completed directly in the Adobe Brand Visibility UI." The guide's troubleshooting checks the CDN type ("Requested CDN type aem-cs-fastly does not match the detected CDN for this domain").
- The overview's FAQ says Optimize at Edge is not only for Edge Delivery sites, and the webinar Q&A confirms Recover Content Visibility "works on non-edge delivery service AEM sites as well".
- The Brand Visibility security overview lists AEM operational telemetry as an input to the Referral Traffic dashboard, "automatically configured if the customer is using Adobe Experience Manager as a Cloud Service".
- Brand Visibility pauses content fixes when the source page changes and relies on the page's Last-Modified header to notice; routing must sit on the outer CDN.
- Not documented: Brand Visibility writing fixes into AEM author. Its fixes go to the edge for AI agents, or to the Adobe Commerce catalog. AEM log forwarding for the managed CDN has no page of its own (the log forwarding pages cover customer CDNs).

Verdict: documented. Lines are written for the site on the AEM publish tier; bv-eds (C03) keeps the Edge Delivery workflow.

## AEM Assets + Brand Visibility: not documented

Pages read: the same 61 Brand Visibility pages (no AEM Assets, DAM or Dynamic Media), the LLM Optimizer product description, the Brand Visibility security overview (no DAM among its data sources), the Jun 17 2026 news release, both webinars and transcripts, and AEM Assets pages on Content Advisor in other apps, Assets Insights, AI-generated metadata, Dynamic Media with OpenAPI delivery and Assets with Edge Delivery.

Verdict: not documented. The only link is the news release calling Brand Visibility "a native integration with Adobe Experience Manager" for content "from web experiences and campaign content to digital assets and commerce catalogs", a co-mention with no data flow or setup.

## AEM Sites + Sites Optimizer (`aemsites-so`): documented, with services

Pages read: all 45 Sites Optimizer pages (basics, settings, trial, permissions, every opportunity page, Deploying to author, Preparing code patches, Preflight overview, setup and audits, release notes); Sites Optimizer product description; Sites Optimizer security overview (March 2026); AEM Operational Telemetry page; transcripts of the alt text, broken backlinks, Core Web Vitals and trial videos.

What Adobe documents:
- License: "AEM Sites Optimizer must be licensed for use with AEM Sites as a Cloud Service or AEM Sites Managed Services".
- Sites Optimizer lists "all the production AEM sites registered in Cloud Manager" and reads AEM's Operational Telemetry for Core Web Vitals.
- Fixes go to author, never live: "AEM Sites Optimizer applies the selected optimizations into the authoring environment only"; on AEM as a Cloud Service alt text "Writes updates directly via the Content API with versioning and fallback support"; the videos show alt text on the image components and redirects in the page properties, then the author publishes.
- Setup on AEM: the delivery type setting (Edge Delivery Services, AEM Cloud Service or AEM Managed Services), allow rules for the scanner in the Cloud Manager traffic filter rules and IP allow lists, code fixes as pull requests on Cloud Manager repositories, Preflight in the Page Editor (AEM 2026.7.0 or later) and the Universal Editor, Multi Site Manager and language copy handling.

Verdict: documented. Lines cover the AEM Cloud Service route; the Edge Delivery route (source documents, the Connect to AEM Sites settings guide, the Sidekick Preflight plugin) belongs to so-eds.

## AEM Assets + Sites Optimizer (`aemassets-so`): documented, with services (thin)

Pages read: the Sites Optimizer missing alt text and Deploying to author pages, release notes, the alt text video transcript, the AEM Assets pages above, and the Core Components image page.

What Adobe documents: the missing alt text page lists three deploy routes, "Edge Delivery Services", "AEM as a Cloud Service" and "Digital Asset Management (optional)", the last with "Updates asset-level alt text where applicable", and says updates may go to "asset metadata". The Deploying to author page says mechanics differ for "Digital Asset Management". Neither names AEM Assets or gives setup steps; in AEM the DAM is AEM Assets, and the Core Components image page shows image alt text can come from the asset's dc:description in the DAM.

Verdict: documented, thin. One optional line.

## Pages downloaded and checked

Pages marked source are cited in the JSON; the rest back the notes and the not-documented check.

| Page | URL | Use |
|---|---|---|
| Experience League: Optimize at Edge, AEM Cloud Service Managed CDN (Fastly) | https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/aemcs-managed-cdn | source |
| Experience League: Brand Visibility, Optimize at Edge | https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/overview | source |
| Adobe: Brand Visibility Security Overview (October 2026, PDF) | https://www.adobe.com/cc-shared/assets/pdf/trust-center/ungated/whitepapers/experience-cloud/adobe-brand-visibility-security-overview.pdf | source |
| Experience League: Sites Optimizer, Deploying to author | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/deploying-to-author | source |
| Experience League: Sites Optimizer, Missing alt text opportunity | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/missing-alt-text | source |
| Experience League: Sites Optimizer basics | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/basics | source |
| Experience League: Sites Optimizer, Core Web Vitals opportunity | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/core-web-vitals | source |
| Experience League: Sites Optimizer release notes | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/release-notes | source |
| Experience League: Sites Optimizer trial | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/trial | source |
| Experience League: Sites Optimizer Preflight setup | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/preflight/setup | source |
| Experience League: Brand Visibility Quick Start | https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/quick-start | notes |
| Experience League: Sites Optimizer settings | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/settings | notes |
| Experience League: Sites Optimizer, Preparing code patches | https://experienceleague.adobe.com/en/docs/experience-manager-sites-optimizer/content/documentation/opportunities/preparing-code-patches | notes |
| Adobe: AEM Sites Optimizer Security Overview (March 2026, PDF) | https://www.adobe.com/cc-shared/assets/pdf/trust-center/ungated/whitepapers/experience-cloud/adobe-aem-sites-optimizer-security-overview.pdf | notes |
| helpx: Adobe Experience Manager Sites Optimizer product description | https://helpx.adobe.com/legal/product-descriptions/adobe-experience-manager-sites-optimizer.html | notes |
| helpx: Adobe LLM Optimizer product description | https://helpx.adobe.com/legal/product-descriptions/adobe-llm-optimizer.html | not-documented check |
| Experience League: Operational Telemetry for AEM as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/operational-telemetry-for-aem-as-a-cloud-service | notes |
| Experience League: Core Components, Image | https://experienceleague.adobe.com/en/docs/experience-manager-core-components/using/wcm-components/image | notes |
| Experience League: From SEO to GEO (Ultimate Success webinar, page and transcript) | https://experienceleague.adobe.com/en/docs/ultimate-success/ultimate-success-webinar-library/hidden/optimize-aem-for-geo | notes |
| Experience League: Win Visibility in the AI Era with Adobe LLM Optimizer & Sites Optimizer (page and transcript) | https://experienceleague.adobe.com/en/docs/ultimate-success/ultimate-success-webinar-library/hidden/ai-visibility | notes |
| Adobe news: Introducing Adobe Brand Visibility (Jun 17 2026) | https://news.adobe.com/news/2026/06/introducing-adobe-brand-visibility | not-documented check |
| Adobe news: Adobe Introduces Brand Visibility Solution (Apr 20 2026) | https://news.adobe.com/news/2026/04/adobe-introduces-brand-visibility-solution | not-documented check |

Also read, not cited: the other Brand Visibility and Sites Optimizer pages in both tables of contents; AEM pages on CDN, traffic filter rules including WAF, log forwarding, pipeline-free URL redirects, SEO and URL management, Experience Hub, Health Assessment, CDN configuration snippets, CDN traffic configuration, CDN performance, agentic capabilities, Content Optimization and Discovery use cases, AI-generated metadata; AEM Assets overview, Content Advisor in other apps, Assets Insights, Assets with Edge Delivery, Dynamic Media with OpenAPI delivery, metadata mapping, remote assets with Sites; transcripts of the Sites Optimizer alt text, broken backlinks, Core Web Vitals and trial videos.

Failed or empty: business.adobe.com pages returned 503 to the fetch tool on Oct 31 (not used); the old `/en/docs/llm-optimizer/` paths now serve the same Brand Visibility pages; the LLM Optimizer table of contents and `opportunity-types/preflight` returned 404; Experience League's table of contents API returned 502.


## Batch D: researcher's trail

# Batch D: AEM Sites + Edge Delivery, AEM Assets + Edge Delivery, AEM Sites + Coworker, AEM Assets + Coworker

Checked Oct 31 2026. Hours are our own estimates for a mid-market client; Adobe publishes none. Line ids AXD01 to AXD12. Quotes are cited by page key (see Pages read). Each line's own source and quote are in the JSON.

## Summary

| Pair | Verdict | Default lines | Optional lines |
|---|---|---|---|
| `aemsites-eds` | Documented, with services | AXD01, AXD02 | AXD03, AXD04 |
| `aemassets-eds` | Documented, with services | AXD05 | AXD06, AXD07 |
| `aemsites-cw` | Documented, with services | AXD08 | AXD09, AXD10 |
| `aemassets-cw` | Documented, with services | AXD11 | AXD12 |

No pair in this batch was undocumented, and none was documented without services.

## Searches run

1. experienceleague AEM authoring with Edge Delivery Services Universal Editor publish content from AEM author
2. experienceleague AEM as a Cloud Service CDN origin selectors route traffic to Edge Delivery Services AEM publish same domain
3. Adobe AEM Sites migrate existing AEM Sites author publish to Edge Delivery Services Experience Modernization
4. aem.live Edge Delivery Services existing AEM Sites same domain hybrid header footer fragment consume content AEM publish
5. experienceleague experience-manager-learn edge-delivery-services developing universal-editor build a block component model definition filters tutorial
6. AEM Assets Sidekick plugin Edge Delivery Services document authoring select assets experienceleague
7. Dynamic Media with OpenAPI Edge Delivery Services blocks aem.live delivery URL images video
8. experienceleague "agentic capabilities" AEM "Coworker Chat" Sites content production governance discovery agentic capability
9. experienceleague "Experience Production" agent AEM Sites Coworker create pages Page Editor Universal Editor "Edge Delivery"
10. experienceleague Coworker "AEM Assets" Content Hub discovery onboarding agentic capability Coworker Chat assets

Links were then followed from the pages found. Every page was downloaded with curl and converted to text. Redirecting Experience League URLs are listed at their final address; the Experience League AEM authoring pages for Edge Delivery redirect to aem.live.

## Pages read

| Key | Page | URL |
|---|---|---|
| eds_overview | Experience League: Edge Delivery Services overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/overview |
| live_aem_authoring | aem.live: Authoring with AEM Sites for Edge Delivery Services | https://www.aem.live/docs/aem-authoring |
| live_publishing | aem.live: How content is published from AEM Sites authoring to Edge Delivery Services | https://www.aem.live/docs/publishing-from-authoring |
| el_learn_new_site | Experience League: Create an AEM site (Edge Delivery Services with the Universal Editor tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/edge-delivery-services/developing/universal-editor/2-new-aem-site |
| el_learn_new_block | Experience League: Create a new block (Edge Delivery Services with the Universal Editor tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/edge-delivery-services/developing/universal-editor/5-new-block |
| live_ue_tutorial | aem.live: Set Up AEM Sites as a Content Source | https://www.aem.live/developer/ue-tutorial |
| live_ue_blocks | aem.live: Creating Blocks Instrumented for use with the Universal Editor | https://www.aem.live/developer/universal-editor-blocks |
| live_path_mapping | aem.live: Path mapping for AEM authoring as your content source | https://www.aem.live/developer/authoring-path-mapping |
| live_repoless_msm | aem.live: Multi site management with AEM authoring as your content source | https://www.aem.live/developer/repoless-multisite-manager |
| live_repoless_env | aem.live: Repoless stage and prod environments with AEM authoring as your content source | https://www.aem.live/developer/repoless-environments |
| live_repoless_authoring | aem.live: Reusing code across sites with AEM authoring as your content source | https://www.aem.live/developer/repoless-authoring |
| live_cf_overlay | aem.live: Publishing AEM Content Fragments to Edge Delivery Services | https://www.aem.live/developer/content-fragment-overlay |
| cdn_traffic | Experience League: Configuring Traffic at the CDN | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/content-delivery/cdn-configuring-traffic |
| ema_overview | Experience League: Experience Modernization Agent overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agents/brand-experience/modernization/overview |
| ema_aem_authoring | Experience League: Getting Started with the Experience Modernization Agent for AEM Authoring Projects | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agents/brand-experience/modernization/getting-started-aem-authoring |
| as_eds_integrate2 | Experience League: Integrate AEM Assets while authoring content for Edge Delivery Services | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/integrate-aem-assets-edge-delivery-services/integrate-aem-assets-edge-delivery-services |
| kb_static_images | Experience League: Imported images render as static instead of responsive assets in AEM Edge Delivery Services | https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-41503 |
| live_ue_assets | aem.live: Publishing pages with AEM Assets | https://www.aem.live/docs/universal-editor-assets |
| live_assets_sidekick | aem.live: Adobe Experience Manager Assets Sidekick Plugin | https://www.aem.live/docs/aem-assets-sidekick-plugin |
| live_assets_sidekick_config | aem.live: Configuring Adobe Experience Manager Assets Sidekick Plugin | https://www.aem.live/developer/configuring-aem-assets-sidekick-plugin |
| dev_asset_picker | Adobe Developer: Universal Editor Custom Content Advisor (custom asset picker) | https://developer.adobe.com/uix/docs/extension-manager/extension-developed-by-adobe/configurable-asset-picker/ |
| dmoa_overview | Experience League: Dynamic Media with OpenAPI capabilities | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/dynamic-media-open-apis-overview |
| dm_eds_howto | Experience League: Using Dynamic Media in Edge Delivery Services (video) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/sites/document-authoring/how-to/using-dynamic-media |
| cwuc_author_pages | Experience League: Author AEM Sites pages with Coworker | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/brand-visibility/author-web-pages |
| cwuc_landing_page | Experience League: Create and refine an AEM landing page with Coworker | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/brand-visibility/create-and-refine-aem-landing-page |
| cwuc_onboard_assets | Experience League: Onboard your brand in AEM Assets (Coworker) | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/brand-visibility/onboard-aem-assets |
| cwuc_brand_compliance | Experience League: Check content for brand compliance with Coworker Chat | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/brand-visibility/brand-compliance |
| cwuc_generate_assets | Experience League: Generate marketing assets with Coworker Chat | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/brand-visibility/generate-assets |
| cwuc_data_insights | Experience League: Accelerate data insights with Coworker, AEM and CJA | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/accelerate-data-insights |
| cwuc_experimentation | Experience League: Accelerate experimentation with Coworker, AEM and Target | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/optimization/accelerate-experimentation |
| cw_aem_skills | Experience League: Coworker Chat workflows | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows |
| cw_aem_learn | Experience League: CX Enterprise Coworker and AEM | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/coworker/aem-in-coworker |
| cw_home | Experience League: Adobe CX Enterprise Coworker overview | https://experienceleague.adobe.com/en/docs/coworker/content/home |
| cw_chat_overview | Experience League: Coworker Chat overview | https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview |
| cw_chat_ui | Experience League: Get started with Coworker Chat | https://experienceleague.adobe.com/en/docs/coworker/content/chat/ui-guide |
| aem_agentic_overview | Experience League: Agentic Capabilities in AEM through CX Enterprise Coworker | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/overview |
| aem_agents_overview | Experience League: Overview of Agents in AEM | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agents/overview |
| ac_content_create | Experience League: Content Create Skill | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/experience-production/content-create |
| ac_content_update | Experience League: Content Update Skill | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/experience-production/content-update |
| ac_figma_vcf | Experience League: Figma to Visual Content Fragments Skill | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/experience-production/figma-to-visual-content-fragments |
| ac_development | Experience League: Development Agentic Capabilities Overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/development/use-cases |
| ac_discovery | Experience League: Content Discovery Agentic Capabilities Overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/content-advisor/discovery/use-cases |
| ac_content_opt | Experience League: Content Optimization Agentic Capabilities Overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/content-advisor/content-optimization/use-cases |
| ac_brand_gov | Experience League: Brand Governance Agentic Capabilities Overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-governance/use-cases |
| as_onboard_agent | Experience League: Onboarding Agentic Capabilities Overview | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-experience/onboarding/use-cases |
| aem_integrations_list | Experience League: AEM as a Cloud Service integrations with Adobe Experience Cloud | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/integrations/experience-cloud |

Also read: aem.live taxonomy and author authentication pages, the Governance Agent overview. The AEM integrations list has no Coworker or Edge Delivery rows. Not found (404): an older AEM Assets and Edge Delivery URL, an AEM learning page on the Sidekick plugin, aem.live configuration templates, a Universal Editor tutorial overview.

## AEM Sites + Edge Delivery Services (`aemsites-eds`)

Searches 1 to 5. Pages: eds_overview, live_aem_authoring, live_publishing, el_learn_new_site, el_learn_new_block, live_ue_tutorial, live_ue_blocks, live_path_mapping, live_repoless_msm, live_repoless_env, live_repoless_authoring, live_cf_overlay, cdn_traffic, ema_overview, ema_aem_authoring.

Verdict: documented, with services. Edge Delivery Services is part of AEM, and AEM Sites can be its content source: pages are managed in the Sites console, edited in the Universal Editor and published from AEM to Edge Delivery, and AEM Sites and Edge Delivery pages can share one domain.
- eds_overview: "Edge Delivery Services are part of Adobe Experience Manager."
- eds_overview: "Edge Delivery Services and AEM Sites can co-exist on the same domain, which is a common use case for larger websites."
- eds_overview: "Additionally, your AEM Sites pages can seamlessly consume content from Edge Delivery Services, and the reverse is also true."
- live_aem_authoring: "Content that you author with the Universal Editor and persist to AEM is published to Edge Delivery Services."
- live_aem_authoring: "The AEM Sites console is used for content management such as creating new pages, Experience Fragments, Content Fragments, etc."

Flows:
- aemsites to eds, live_publishing: "When using the Universal Editor to author AEM content, publishing a page is as simple as clicking the Publish button in the Universal Editor."
- eds to aemsites, live_aem_authoring: "AEM renders the HTML but includes the scripts, styles, icons and other resources from Edge Delivery Services."

Lines: AXD01 AEM Sites as the Edge Delivery content source (16/32/56, default, el_learn_new_site); AXD02 Blocks set up for the Universal Editor (24/48/96, default, el_learn_new_block); AXD03 Localized Edge Delivery sites with MSM (24/40/80, optional, live_repoless_msm); AXD04 AEM publish and Edge Delivery on one domain (16/32/64, optional, cdn_traffic). Scope details:
- AXD01, live_ue_tutorial: "Now that you have your GitHub project, you need to link the repository to your AEM authoring instance."
- AXD01, live_ue_tutorial: "You need to configure access control so it has privileges to publish."
- AXD01, live_aem_authoring: "To use AEM authoring as your content source, you need to set up your project's path mapping."
- AXD01, live_repoless_env: "You may wish to set up a site for your production environment separate from your staging environment."
- AXD02, live_ue_blocks: "create blocks instrumented for the Universal Editor when using AEM authoring as your content source"
- AXD03, live_repoless_msm: "In order to leverage MSM on Edge Delivery Services with AEM authoring, you must enable the repoless feature."
- AXD03, live_repoless_msm: "There is a 1:1 relationship between AEM MSM sites and aem.live sites with a shared Git repository and code base."
- AXD04, cdn_traffic: "Content delivered by Edge Delivery Services would benefit from rules deployed via config pipeline, including traffic filter rules or request/response transformations."
- AXD04, cdn_traffic: "make sure to configure push invalidation in managed mode"

## AEM Assets + Edge Delivery Services (`aemassets-eds`)

Searches 6, 7 and 1. Pages: as_eds_integrate2, live_ue_assets, live_assets_sidekick, live_assets_sidekick_config, dev_asset_picker, kb_static_images, dm_eds_howto, dmoa_overview, live_publishing, live_path_mapping.

Verdict: documented, with services. AEM Assets plugs into Edge Delivery authoring: the AEM Assets Sidekick plugin in Word or Google Docs, or a custom asset picker in the Universal Editor, lets authors insert approved assets, delivered as copies or by Dynamic Media with OpenAPI reference.
- as_eds_integrate2: "When AEM Assets integrates with your Document-Based Authoring tools, such as Microsoft Word or Google Docs, it provides an asset selector in your authoring tool."
- as_eds_integrate2: "Set up the Universal Editor to integrate with AEM Assets."

Flows:
- aemassets to eds, as_eds_integrate2: "Governance (references vs. copies of the asset), which helps with auto-propagation of asset lifecycle events like expiration, deletion, and updates."

Lines: AXD05 AEM Assets picker for site authors (16/24/48, default, as_eds_integrate2); AXD06 Responsive Dynamic Media images on Edge Delivery (16/32/64, optional, kb_static_images); AXD07 Publishing DAM assets to Edge Delivery (8/16/32, optional, live_ue_assets). Scope details:
- AXD05, dev_asset_picker: "For assets hosted in AEM Assets, the component model can be configured to use Dynamic Media with OpenAPI capabilities via URL references, or Edge Delivery Media Bus."
- AXD05, live_assets_sidekick: "must be entitled to an Experience Manager Assets environment by assigning them to the respective product profile."
- AXD05, live_assets_sidekick_config: "To enable the Assets plugin in your Sidekick, you must create a configuration in your project's GitHub."
- AXD06, live_assets_sidekick_config: "you'd also need to ensure appropriate handling in your site's front-end code to convert such image links to <picture/> tag with appropriate srcset"
- AXD06, live_assets_sidekick: "Rich media optimization and delivery (e.g., adaptive video streaming OOTB, and original asset delivery for PDFs)"
- AXD07, live_ue_assets: "If you use private asset folders, make sure you grant access to the folder to the technical account."
- AXD07, live_ue_assets: "Additional configuration is needed, however, when you want to publish assets to a site individually, that are not referenced by a site."
- AXD07, live_ue_assets: "In the latter case AEM Assets will create static renditions that will automatically be used instead of the original asset, when the original asset exceeds the supported limits."

## AEM Sites + Coworker (`aemsites-cw`)

Searches 8 and 9. Pages: cwuc_author_pages, cwuc_landing_page, cw_aem_skills, cw_aem_learn, aem_agentic_overview, aem_agents_overview, ac_content_create, ac_content_update, ac_figma_vcf, ac_development, ac_discovery, ac_brand_gov, cwuc_brand_compliance, cw_home, cw_chat_overview, cw_chat_ui.

Verdict: documented, with services. Coworker Chat works in AEM Sites: from a plain-language prompt it drafts and updates pages, on Page Editor sites as on Edge Delivery sites, and AEM's agentic capabilities in Coworker also build Visual Content Fragments from Figma and help developers with Cloud Manager and the Dispatcher.
- cwuc_author_pages: "Use Adobe CX Enterprise Coworker to author AEM Sites pages by describing what you want in plain language."
- cwuc_author_pages: "This video shows Coworker authoring a page on a Page Editor-based site. Coworker works the same way on sites delivered with Edge Delivery Services."
- ac_figma_vcf: "In AEM, the AEM user can start with an initial prompt to use Coworker to recreate the approved design in AEM."
- ac_development: "collaborates with Coworker Chat to help traditional AEM Java-stack developers and administrators create, debug, deploy, and optimize code more efficiently"

Flows:
- cw to aemsites, cw_aem_skills: "Perform bulk actions across multiple pages at the same time such as removing, replacing, or adding content elements to keep experiences accurate and current."
- aemsites to cw, ac_discovery: "It intelligently searches across Assets, Content Fragments, and AEM Sites pages to deliver relevant materials such as images, videos, PDF documents, and articles."

Lines: AXD08 Coworker page drafts from reference pages (16/32/56, default, ac_content_create); AXD09 Coworker for AEM developers and operations (8/16/32, optional, ac_development); AXD10 Visual Content Fragments from Figma (16/24/48, optional, ac_figma_vcf). Scope details:
- AXD08, ac_content_create: "After you choose to edit the page in AEM, it opens in your authoring environment; for example, the Universal Editor or the Page Editor."
- AXD08, cwuc_landing_page: "use an existing Adobe Experience Manager page as a template, confirm the destination, apply campaign content and SEO metadata, and refine imagery and copy in the Universal Editor"
- AXD09, ac_development: "AI can make mistakes so review suggested actions before applying them, particularly for destructive operations."
- AXD09, ac_development: "Click Troubleshoot with AI on a failed pipeline execution in Cloud Manager"
- AXD09, ac_development: "The AEM Dispatcher Insights skill helps you understand how your Dispatcher and Apache web tier handle requests in AEM as a Cloud Service."
- AXD10, ac_figma_vcf: "The Figma user needs to create an access token in Figma and store it in the AEM service."
- AXD10, ac_figma_vcf: "The creation process also includes capabilities that allow reusing existing content models or fragments when already available."

## AEM Assets + Coworker (`aemassets-cw`)

Searches 8 and 10. Pages: as_onboard_agent, cwuc_onboard_assets, cw_aem_skills, ac_discovery, ac_content_opt, ac_content_update, cwuc_generate_assets, aem_agentic_overview, aem_agents_overview, cw_home, cw_chat_overview, cw_chat_ui.

Verdict: documented, with services. AEM's Onboarding, Content Discovery and Content Optimization capabilities work through Coworker Chat: Coworker sets up folders, tags and metadata forms in AEM Assets once the user confirms, finds approved assets by metadata or theme, and makes channel-ready renditions with Dynamic Media with OpenAPI.
- as_onboard_agent: "collaborates with Coworker Chat to help you configure Adobe Experience Manager Assets using natural language"
- cwuc_onboard_assets: "Discover how to use Coworker to efficiently configure your digital asset management (DAM) in Adobe Experience Manager Assets."
- ac_discovery: "The Content Discovery Agentic Capability of Adobe Experience Manager (AEM) as a Cloud Service collaborates with Coworker Chat to deliver AEM content on demand"
- ac_content_opt: "producing optimized variations using core Dynamic Media with OpenAPI capabilities"

Flows:
- cw to aemassets, as_onboard_agent: "It recommends appropriate approaches based on the user's context and requires confirmation before making changes"
- aemassets to cw, ac_discovery: "Based on your prompt, the agentic capability returns curated results along with asset metadata and delivery URLs, ready to be embedded in other applications."

Lines: AXD11 Coworker Skills for DAM work (24/40/72, default, cw_aem_skills); AXD12 DAM metadata ready for Coworker search (16/24/48, optional, ac_discovery). Scope details:
- AXD11, as_onboard_agent: "Designs and creates custom metadata forms"
- AXD11, ac_content_opt: "Quickly produces renditions tailored for specific platforms like Instagram Stories, web banners, or other marketing touchpoints"
- AXD11, ac_discovery: "Flag assets missing organizational metadata standards to support governance"
- AXD12, as_onboard_agent: "Requires the property to be indexed first."

## Quotes behind the notes

- live_aem_authoring: "Content Fragments from AEM instances without Edge Delivery Services can be integrated into Edge Delivery Services using this Early Access technology."
- live_cf_overlay: "you can publish AEM Content Fragments to Edge Delivery Services as self-contained semantic HTML."
- ema_overview: "Supports migrations from a wide range of CMS platforms, legacy AEM, or design systems (like Figma) into production-capable Edge Delivery Services projects"
- ema_overview: "Multisite inheritance (MSM)"
- ema_overview: "Isolation of content/experience fragments"
- ema_aem_authoring: "For AEM authoring projects using the Universal Editor, preparation of the Experience Modernization Agent differs from the standard Edge Delivery flow."
- dmoa_overview: "To access Dynamic Media with OpenAPI capabilities, you must have licences for:"
- live_assets_sidekick: "Dynamic Media with OpenAPI is now in an Early Adopter program."
- live_assets_sidekick_config: "Using non-image assets such as Videos and PDF documents is in an Early Adopter program."
- live_assets_sidekick: "Adobe Experience Manager Assets Essentials"
- live_assets_sidekick: "you can implement a project-based plugin using the asset selector from version 6.5"
- dmoa_overview: "To enable Dynamic Media with OpenAPI capabilities on AEM as a Cloud Service, submit an Adobe Support ticket with the following details:"
- cw_aem_skills: "Adobe Experience Manager (AEM) - AEM Sites"
- cw_aem_skills: "Adobe Experience Manager (AEM) - AEM Assets"
- cw_aem_skills: "on <aem path> update all pages that contain copy "MyBarista" to "BrewPass""
- cw_home: "Adobe's enterprise support or professional services team configures Coworker for your environment, sets up integrations with your Adobe applications, and defines governance and approval workflows."
- cw_home: "Licensed through your Adobe account team."
- aem_agents_overview: "You may have the option to access AEM Agents through the Try Before You Buy program, which is rolling out in phases."
- aem_agents_overview: "Connect with your CSM or TAM to discuss access via the Agentic SKU if that aligns with your roadmap and evaluation plans."
- ac_discovery: "Editing or writing metadata is not supported (Use OneAEM MCP)."
- ac_content_opt: "Dynamic Media with OpenAPI enabled on AEM as a Cloud Service environment."
- cw_aem_learn: "for example page views and CTA clicks from your AEM hosted websites."
- cwuc_data_insights: "a connected implementation workflow across Adobe Experience Manager (AEM), Adobe Experience Platform (AEP), Web SDK, and Customer Journey Analytics (CJA)"
- cwuc_experimentation: "streamline experimentation on Adobe Experience Manager (AEM) Sites using Adobe Target"

## Quote check

Every quote in this trail and every line evidence was checked by script against the downloaded page text (whitespace and curly quotes normalized): 86 passed, 0 failed.

## Batch E: researcher's trail

# Batch E research trail

Checked Oct 31 2026. Pairs: AEM Sites + Workfront, AEM Assets + Real-Time CDP, AEM Sites + Brand Concierge, AEM Assets + Brand Concierge. Pages are in `aem_research/batch_E/pages` (text in `text/`), and `scripts/verify_batch_E.py` checked every quote: 171 checks passed, 0 failed.

## Web searches run

1. experienceleague AEM as a Cloud Service "Content AI" index configure Brand Concierge
2. "Brand Concierge" "AEM Assets" OR "Experience Manager Assets"
3. "Brand Concierge" AEM Sites release notes experienceleague "Content AI"
4. "Brand Concierge" "Experience Manager" site:experienceleague.adobe.com
5. business.adobe.com Brand Concierge integrations "Adobe Experience Manager" "Sites" conversations current content changes
6. "Brand Concierge" "Assets" integration images product cards "Experience Manager Assets" OR "Dynamic Media" adobe
7. "Real-Time CDP" "AEM Assets" OR "Experience Manager Assets" integration experienceleague
8. Experience Platform destination "Adobe Experience Manager" audiences Dynamic Media personalization experienceleague
9. "Experience Platform" "Experience Manager Assets" audiences OR profiles OR segments personalization assets "Real-Time Customer Profile"
10. "Dynamic Media" "Real-Time CDP" OR "Experience Platform" audiences personalized images experienceleague Experience Manager
11. Workfront "AEM Sites" OR "Experience Manager Sites" integration pages content fragments experienceleague workfront
12. experienceleague.adobe.com/en/docs/workfront "Experience Manager Sites" integration Workfront tasks pages review
13. "Universal Editor" Workfront extension AEM Sites tasks "Early Access" OR "early adopter" experienceleague
14. AEM as a Cloud Service release notes Workfront "Universal Editor" OR "Content Fragment" Workfront task integration 2026
15. Universal Editor extensions Adobe "Page Lock" "Workflows" "Page Properties" extension manager experienceleague list
16. experienceleague "AEM MCP server" OR "Experience Manager MCP server" sites pages content fragments tools cloud service
17. "Workfront" "Content Advisor" content fragments AEM 2026 release notes "Workfront"
18. experienceleague workfront "Content Advisor" Experience Manager Assets integration content fragments link Workfront

Also walked: the Brand Concierge docs table of contents (21 Brand Concierge pages pulled), the AEM Content AI table of contents (its 4 pages), the Workfront Fusion apps index (Adobe connectors: AEM Assets, AEM Forms and AEM MCP, no AEM Sites connector) and Adobe's list of Universal Editor extensions on developer.adobe.com. Web fetch only: the Experience League Community post "Introducing Adobe Brand Concierge" (Nov 11 2025). business.adobe.com (Brand Concierge product page, integrations page, How Adobe Brand Concierge works blog) returned 503 every time; search snippets only.

## AEM Sites + Workfront (aemsites-workfront): documented, optional services AXE01 and AXE02

Against: the AEM as a Cloud Service integrations grid (Sept 22 2026) ticks Workfront under AEM Assets only; Workfront's article index 'Workfront and Experience Manager Assets Integrations' (Sept 25 2026) lists Assets integrations only; Integrations Learn 'Integrate Experience Manager with Workfront' pairs Workfront with AEM Assets (enhanced connector) and Assets Essentials (native connector); the two Workfront and AEM event pages are about AEM Assets.

For: AEM's 'Page Editor and Universal Editor' page (Oct 9 2026) marks 'Workfront integration' unavailable in the Page Editor and available in the Universal Editor 'as an extension', and says the Universal Editor's extension framework includes 'integrations with GenAI, Workfront, and more'. The One Adobe tutorial '1.2.4 Workfront + AEM Sites' (Oct 16 2026) sets the plugin up in AEM Extension Manager for the Universal Editor (IMS_ENV, WORKFRONT_INSTANCE_URL, SHOW_CUSTOM_FORMS) and builds two Workfront task custom forms (Content Fragment and Integration ID; Preview and Publish URL), and says the plugin is Early Access; its module overview calls it 'the plugin that connects Adobe Experience Manager Cloud Service Sites with Adobe Workfront'. Workfront Fusion's 'Adobe Experience Manager MCP modules' page (Sept 25 2026) works 'across areas like sites, digital assets, content fragments', including reading a page's content and updating a page or publishing content, and AEM's 'Using MCP with AEM as a Cloud Service' page (Oct 29 2026) lists Workfront Fusion among supported MCP applications, with page and content fragment create, read, update and delete. AEM's Content Advisor page lists Workfront Workflow and Workfront Planning as apps that search Content Fragments, which need an AEM Sites environment; Workfront's Q2 2026 overview ties Content Advisor to its AEM Assets integration, so that flow needs aemassets.

Not used: the Content Fragments workflows extension (starts AEM workflows, no Workfront); the 'Extending the Universal Editor' page (no Workfront in its extension list); Adobe's Reference Demo utility page (a demo framework that starts a Workfront Fusion review flow from the Universal Editor, not product docs); Workfront quarterly integration release notes (Q1 2026 covers the AEM Assets selector; other quarter URLs returned 404).

Verdict: documented. AXE01 (Universal Editor extension, Early Access) and AXE02 (Fusion with the AEM MCP connector) are optional; no line is default.

## AEM Assets + Real-Time CDP: not documented

Pages: AEM integrations grid (Real-time CDP row blank for Sites, Assets and Forms); AEM Assets overview (integrations: Dynamic Media with OpenAPI, Content Advisor, Workfront, Figma, Express, Creative Cloud; no Experience Platform or Real-Time CDP); Content Advisor apps page; AEM Assets downstream integrations page; Experience Platform sources catalog (Adobe sources: Audience Manager, Analytics, Campaign, Commerce, Data Collection, Customer Attributes and Marketo; no AEM) and Adobe destinations overview (no AEM); Experience Platform 'Integrations with Experience Cloud applications' (its video captions cover Analytics, Audience Manager, Campaign, Marketo, Target and Commerce, never AEM); Integrations Learn content management use cases; Use Case Patterns. Two blueprint URLs returned 404.

Verdict: not documented. Journey Optimizer joins the two (aemassets-ajo, rtcdp-ajo) and AEM Sites pages feed Real-Time CDP through Web SDK (aemsites-rtcdp), but no Adobe page describes AEM Assets and Real-Time CDP working together.

## AEM Sites + Brand Concierge (aemsites-bc): documented, default service AXE03

Pages: Brand Concierge 'Create and manage knowledge sources' (Oct 2 2026): an 'AEM Sites (Content AI index)' knowledge source for customers on AEM Sites as a Cloud Service with Content AI enabled; select an index 'populated from the AEM Sites as a Cloud Service instance'; 'A separate crawl or refresh step is not required.' 'Manage a concierge' and 'Skills and Integrations Framework': Content AI Search 'Searches AEM Sites content', recommended for the Site Advisory skill, and typically only one of Knowledge Base Search or Content AI Search is needed. 'Build and test your first Brand Concierge': product cards from 'either an AEM Sites or Content AI connection, or a spreadsheet of products'. Release notes (March 2026): Site Advisor AEM Configuration in Composer. FAQ: Adobe Experience Manager content among data sources. AEM Content AI pages (introduction, Control your Content Sources, Get Started with Content AI Search, Developer Console setup): sources live on the Content AI Configuration tab in Cloud Manager, existing indexes for Pages, Assets or Content Fragments can be made searchable (ACLs bypassed), or a site can be crawled with exclusions and a refresh frequency.

Checked and left out: Brand Concierge deployment pages (script in page code or a tag manager on any site, no AEM steps), the developer guide (Web SDK and Web Client, no AEM), the One Adobe Brand Concierge exercise (Edge Delivery custom block, already XA11 on bc-eds), the Brand Concierge use case pattern (no AEM).

Verdict: documented, one direction (AEM Sites to Brand Concierge). AXE03 is default.

## AEM Assets + Brand Concierge: not documented

Pages: every Brand Concierge page above (no AEM Assets, DAM or Dynamic Media; the developer guide's 'assets' setting holds icons); AEM Assets overview, Content Advisor apps page and the AEM integrations grid (no Brand Concierge); AEM Content AI pages (sources can index assets, but Brand Concierge documents only its AEM Sites knowledge source).

Verdict: not documented. The Nov 2025 Community post (read with a web fetch) says Brand Concierge integrates natively with AEM to pull approved content fragments and assets, without naming AEM Assets or giving setup; it is not product documentation.

## Pages downloaded

| Key | Page | URL |
|---|---|---|
| ue_page_vs | Page Editor and Universal Editor | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/page-editor-universal-editor |
| oa_wf_sites | 1.2.4 Workfront + AEM Sites (One Adobe tutorial) | https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/wfplanning/wfpl2/ex4 |
| oa_wf_overview | 1.2 Workflow Management with Adobe Workfront (One Adobe tutorial) | https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/wfplanning/wfpl2/workfront |
| oa_wf_ex2 | 1.2.2 Proofing with Workfront (One Adobe tutorial) | https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/wfplanning/wfpl2/ex2 |
| fusion_aem_mcp | Adobe Experience Manager MCP modules (Workfront Fusion) | https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/aem-mcp-modules |
| fusion_index | Fusion applications and their modules: article index | https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/apps-and-modules-toc |
| fusion_aemassets | Adobe Experience Manager Assets modules (Workfront Fusion) | https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/aem-assets-modules |
| aem_mcp | Using MCP with AEM as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/using-mcp-with-aem-as-a-cloud-service |
| aem_mcp_learn | AEM MCP Server (tutorial) | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/ai/mcp-servers/overview |
| as_ca_apps | Use Content Advisor to access AEM content in Adobe and non-Adobe applications | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-advisor/integrate-adobe-non-adobe-applications |
| aem_rn_2026_4 | 2026.4.0 Release Notes for AEM as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/release-notes/release-notes/2026/2026-4-0 |
| wf_26q2_overview | Workfront Second Quarter 2026 release overview | https://experienceleague.adobe.com/en/docs/workfront/using/product-announcements/product-releases/release-26-q2/26-q2-release-overview |
| wf_rn_26-q1_int | Workfront Q1 2026 integrations release notes | https://experienceleague.adobe.com/en/docs/workfront/using/product-announcements/product-releases/release-26-q1/26-q1-integrations |
| wf_aem_integrations_idx | Workfront and Experience Manager Assets Integrations: article index | https://experienceleague.adobe.com/en/docs/workfront/using/documents/wf-aem-integrations/wf-experience-manager-integrations |
| wfp_connect_overview | Workfront Planning: connect record types overview | https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-architecture/connect-record-types-overview |
| wfp_connect_records | Workfront Planning: connect records | https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-records/connect-records |
| kb_cf_license | Content fragments not included in AEM Assets license (KB) | https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-26616 |
| il_aem_workfront | Integrate Experience Manager with Workfront (Integrations Learn) | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/integrations-between-applications/experience-manager/experience-manager-workfront |
| il_content_mgmt | Application integrations for content management (Integrations Learn) | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/solution-categories/content-management |
| il_pairs | Integration configurations by application (Integrations Learn) | https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/integrations-between-applications/overview |
| ev_aem_wf_2025 | A New Era of Collaboration with AEM and Workfront (event) | https://experienceleague.adobe.com/en/docs/events/the-perfect-blend/2025/aem-and-workfront |
| ev_wf_aem_skill | Streamlining Creative Workflows with Workfront + AEM (event) | https://experienceleague.adobe.com/en/docs/events/the-skill-exchange-recordings/workfront/aug2025/workflows-workfront-aem |
| ue_extending | Extending the Universal Editor | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/extending |
| dev_uix_adobe_ext | Extensions developed by Adobe (developer.adobe.com) | https://developer.adobe.com/uix/docs/extension-manager/extension-developed-by-adobe/ |
| dev_cf_workflows | Content Fragments workflows extension (developer.adobe.com) | https://developer.adobe.com/uix/docs/extension-manager/extension-developed-by-adobe/content-fragments-workflows/ |
| refdemo_invoke | Invoke External Service Extension (Adobe Reference Demo) | https://referencedemo.adobe.com/utilities/invoke-external-service-extension |
| aem_integrations_list | AEM as a Cloud Service integrations with Adobe Experience Cloud | https://experienceleague.adobe.com/en/docs/experience-manager-learn/cloud-service/integrations/experience-cloud |
| as_overview | Introducing Assets as a Cloud Service | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview |
| as_downstream | Integrate AEM Assets with downstream applications | https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/dynamicmedia/dynamic-media-open-apis/integrate-dynamic-media-open-apis |
| aep_sources_home | Experience Platform sources overview | https://experienceleague.adobe.com/en/docs/experience-platform/sources/home |
| aep_dest_adobe | Experience Platform Adobe destinations overview | https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/overview |
| aep_ec_integrations | Experience Platform integrations with Experience Cloud applications | https://experienceleague.adobe.com/en/docs/experience-platform/landing/ecosystem/experience-cloud-integrations |
| vid_32553_captions | Captions of that page's video | https://video.tv.adobe.com/vc/32553/eng.json |
| bp_ucp | Use Case Patterns | https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/overview |
| bp_bc | Brand Concierge conversational experience pattern | https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/conversational-experience-patterns/brand-concierge-conversational-experience |
| bc_ks | Create and manage knowledge sources for Brand Concierge | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/knowledge-sources/knowledge-sources |
| bc_mgmt | Manage a concierge | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/concierge-management/concierge-management |
| bc_skills | Skills and Integrations Framework | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/skills-and-integrations |
| bc_first | Build and test your first Brand Concierge | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/overview/first-brand-concierge |
| bc_rn | Brand Concierge current release notes | https://experienceleague.adobe.com/en/docs/brand-concierge/content/release-notes/current |
| bc_faq | Brand Concierge FAQ | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/brand-concierge-faq |
| bc_overview | Brand Concierge help | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/overview |
| bc_ov_ov | Brand Concierge overview | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/overview/overview |
| bc_home | Brand Concierge documentation home | https://experienceleague.adobe.com/en/docs/brand-concierge/content/home |
| bc_deploy_doc | Deploy a concierge | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/deployment/deployment |
| bc_deploy_gs | Deploy the concierge (video page) | https://experienceleague.adobe.com/en/docs/brand-concierge/content/getting-started/deploy-the-concierge |
| bc_devguide | Developer and customization guide | https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/developer-customization-guide |
| bc_datastream | Learn about datastream IDs | https://experienceleague.adobe.com/en/docs/brand-concierge/content/getting-started/learn-about-datastream-ids |
| bc_create_first, bc_visual, bc_golive_* | Get-started video pages and the go-live guide (no AEM content) | https://experienceleague.adobe.com/en/docs/brand-concierge/content/go-live-guide/welcome |
| oa_ai | Agentic AI Tech Labs overview (One Adobe tutorial) | https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/ai |
| oa_bc_ex1, oa_bc_ex2 | One Adobe Brand Concierge exercises | https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/agents/agents4/ex2 |
| cai_intro | AEM Content AI introduction | https://experienceleague.adobe.com/en/docs/experience-manager-content-ai/using/introduction |
| cai_sources | Set up and manage your Content AI Sources | https://experienceleague.adobe.com/en/docs/experience-manager-content-ai/using/contentsources |
| cai_search | Get Started with AEM Content AI Search | https://experienceleague.adobe.com/en/docs/experience-manager-content-ai/using/site-search |
| cai_adc | Set up an Adobe Developer Console project for Content AI | https://experienceleague.adobe.com/en/docs/experience-manager-content-ai/using/setup-adc-project |


