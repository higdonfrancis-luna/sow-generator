# Wave 3, Adobe Campaign, Adobe Advertising and Marketo Measure: research trail

Checked Nov 10 2026. Research only: nothing in the tool, the catalog or the site was changed, nothing was built and nothing was committed. The data is in `campaign_advertising.json` beside this file. Adobe Analytics (`aa`) and Audience Manager (`aam`) as products belong to the other wave 3 helper; this file holds every connection that has `campaign`, `advertising` or `mmeasure` on one side, including the ones to `aa` and `aam`.

## Summary

Three products with 24 services, and 21 connections with 32 services (56 services in all). Hours are our own estimates for a mid-market client; Adobe publishes none.

| Product | id | Services | Starting | Optional | Monthly |
|---|---|---|---|---|---|
| Adobe Campaign (Adobe Campaign v8 (Managed Cloud Services)) | `campaign` | 8 | 6 | 2 | 1 |
| Adobe Advertising (Adobe Advertising (DSP; Search, Social, & Commerce; Creative)) | `advertising` | 8 | 5 | 3 | 1 |
| Marketo Measure (Adobe Marketo Measure (formerly Bizible)) | `mmeasure` | 8 | 7 | 1 | 1 |

| Connection | id | Kind | Services | Label |
|---|---|---|---|---|
| Adobe Campaign + Real-Time CDP | `campaign-rtcdp` | platform | XM01, XM02, XM03 | Destination sends Real-Time CDP audiences and attributes to Campaign; a source connector returns delivery and tracking logs |
| Adobe Campaign + Journey Optimizer | `campaign-ajo` | native | XM04 | A Campaign action in a journey sends email, push or SMS through Campaign's Transactional messaging |
| Adobe Campaign + Adobe Analytics | `campaign-aa` | extension | XM05, XM06 | Web Analytics connectors add-on sends email campaign results to a report suite; Experience Cloud Triggers start emails from site behavior |
| Adobe Campaign + Target | `campaign-target` | native | XM07 | Dynamic image served by Target inside a Campaign email, chosen when the email is opened |
| Adobe Campaign + AEM Sites | `campaign-aemsites` | native | XM08, XM09 | Email content authored and approved in AEM Sites, pulled into Campaign deliveries, with language copies for multilingual sends |
| Adobe Campaign + AEM Assets | `campaign-aemassets` | native | XM10 | Asset picker in Campaign's email designer on an AEM Assets as a Cloud Service repository |
| Adobe Campaign + Workfront | `campaign-workfront` | extension | XM11 | Workfront Fusion's Adobe Campaign modules create, read and update Campaign records and react to Campaign events |
| Adobe Campaign + GenStudio for Performance Marketing | `campaign-gspm` | native | XM12 | GenStudio email experiences imported into Campaign's email designer; Campaign templates exported to GenStudio as HTML |
| Adobe Campaign + Coworker | `campaign-cw` | native | XM13 | Coworker Chat finds, creates and updates Campaign deliveries, and inspects, validates and troubleshoots workflows |
| Adobe Campaign + Adobe Advertising | `campaign-advertising` | extension | XM14 | A Campaign workflow sends an email list to Search, Social, & Commerce, which builds a Google Ads customer match audience |
| Adobe Campaign + Audience Manager | `campaign-aam` | native | XM15 | Shared audiences imported into Campaign as lists, and Campaign lists exported as shared audiences |
| Adobe Advertising + Adobe Analytics | `advertising-aa` | native | XM16, XM17, XM18 | Analytics for Advertising: ad click-throughs and view-throughs tracked in Analytics, and Analytics events and segments used for bidding and remarketing |
| Adobe Advertising + Customer Journey Analytics | `advertising-cja` | platform | XM19, XM20 | Two-way data sharing: Advertising performance in CJA through Experience Platform datasets, and attribution back to Adobe Advertising |
| Adobe Advertising + Real-Time CDP | `advertising-rtcdp` | platform | XM21, XM22 | Adobe Advertising DSP destination shares Real-Time CDP audiences with a DSP account, as universal IDs, cookies or mobile ad IDs |
| Adobe Advertising + Audience Manager | `advertising-aam` | native | XM23, XM24 | Audience Manager segments imported into DSP and Search, Social, & Commerce for targeting; DSP ad exposure sent to Audience Manager by event pixels |
| Adobe Advertising + Target | `advertising-target` | native | XM25 | Ad click and exposure signals shared with Target for A/B tests on landing pages, read in Analytics for Target |
| Adobe Advertising + AEM Assets | `advertising-aemassets` | native | XM26 | Approved Experience Manager images added to Advertising Creative libraries as standard creatives |
| Adobe Advertising + GenStudio for Performance Marketing | `advertising-gspm` | native | XM27 | GenStudio display ad experiences imported into Advertising Creative libraries as HTML5 creatives |
| Marketo Measure + Marketo Engage | `mmeasure-marketo` | native | XM28, XM29 | Direct API connection: Marketo people, program memberships and activities become touchpoints in Marketo Measure |
| Marketo Measure + Real-Time CDP | `mmeasure-rtcdp` | platform | XM30, XM31 | Marketo Measure destination exports B2B datasets from Experience Platform to Marketo Measure Ultimate |
| Marketo Measure + Adobe Analytics | `mmeasure-aa` | native | XM32 | B2B Customer Attributes: Marketo Measure account and revenue attributes on Adobe Analytics visitor profiles |

None of the three products is itself under an early or limited label on Adobe's pages. Each has a lifecycle point that needs Adam's call, raised under "Lifecycle points" and "Open questions for Adam".

## How this was researched

- Started from this morning's map-level pass (`../platform_data_campaign.json`), then read each source page again in full, plus the setup, prerequisite and lifecycle pages it links to.
- Sources: experienceleague.adobe.com (Campaign v8 console guide, Campaign Web guide, Campaign Classic v7 guide for audience sharing and triggers, Journey Optimizer, Experience Platform destinations and sources, Workfront Fusion, Coworker, the four Adobe Advertising guides, the Marketo Measure guide, Marketo Engage) and helpx.adobe.com (support periods table, the Campaign Managed Cloud Services product description).
- Every page was downloaded with `curl -sS -L -m 45`, tags stripped and spacing collapsed, and each quote matched word for word with `../wave1/verify_wave1.py`, run on the JSON as it is. A quote that joins passages with an ellipsis must have every part on the page.
- **Quote check: 232 quotes on 95 pages, all found, none unverified.** A made-up quote was run through the same check to confirm it fails.
- Service ids (CG, AV, MZ, XM) were checked by script against `sow/canvas/catalog.json` and every JSON under `sow/canvas/research/`: no id repeats, and none of the 21 connection ids exists in the catalog in either order.
- Voice checks run by script on every card field (scope, how, label, availability, prerequisites, gain, flows, client, statement of work lines): no "the client", no "clients", no bare "your", no lifecycle labels, no dates or version numbers, no prerequisite that opens with or follows a colon with "confirm", no "prove it" in the client voice, no "your" in a statement of work line, no em or en dashes anywhere in the file.
- business.adobe.com was tried once with curl for the three product pages, as the brief allows. No page came back. It was not retried and nothing was done to get around it.

## Lifecycle points

1. **Adobe Campaign: three versions, and Adobe's pages support writing for v8.** Campaign Classic FAQ: "Campaign v8 is Adobe's strategic platform, ideal for organizations needing high-volume campaigns, modern web UI, cloud-native benefits, and long-term support. Campaign Classic v7 will reach End of Support in the coming years." The Campaign Web FAQ answers "Does this mean there is an end of support for Adobe Campaign Classic v7?" by pointing to Adobe's support periods table, whose row reads "Campaign Classic 7 3/31/2017 12/31/2030 N/A" (version, general availability, end of core support, end of extended support). Campaign Standard: "Adobe Campaign Standard users are now eligible to transition to Adobe Campaign Managed Cloud Services v8." No end date for Campaign Standard was found, and its release notes are current (release 26.2, page updated Oct 22 2026). Every connection page read is in the Campaign v8 or Campaign Web guide, except audience sharing and the detail of Experience Cloud Triggers, which Adobe keeps in the Campaign Classic v7 guide and links from the v8 pages. Pages: `campaign-classic/using/getting-started/faq/faq-campaign-classic-v7`, `campaign-web/v8/start/faq`, `campaign-web/v8/start/acs-migration`, helpx `support/programs/eol-matrix.html`. *Written as one box for v8, with one optional line (CG07) for a client still on Classic or Standard.*
2. **Campaign v8 is only a managed service, and there is no migration tool.** "For now, Campaign v8 is only available as a Managed Cloud Service, and cannot be deployed on an on-premise or hybrid environments." and "Automated migration from an existing Campaign Classic v7 environment is not yet available." Page: `campaign/campaign-v8/new/v7-to-v8`. CG07 is a manual inventory and plan; no card repeats Adobe's forward-looking words.
3. **Marketo Measure: two editions, and release notes that stop in 2024.** The page titled Current Release Notes (updated Oct 7 2026) is headed "Release Notes: 2024" and says "See below for all the new and updated features for our 2024 releases." No end-of-life statement was found on Experience League or helpx, and Marketo Measure is not on Adobe's discontinued list (this morning's pass). The editions differ in setup: "The direct CRM and Marketo Engage connections are no longer available for Ultimate." and "There is no migration path for existing Tier 1/2/3 users." Pages: `marketo-measure/using/release-notes/current`, `marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview`. *Written as one box for the tiers, with Ultimate as the Real-Time CDP connection. A question for Adam.*
4. **Adobe Advertising: no label on the product, several on features.** Left out: ChatGPT conversational ads (the DSP guide files them under "Conversational Ads (Beta)") and the AI Assistant's agent features (each marked "(Beta feature)"). The Search, Social, & Commerce guide files its whole new interface under the heading "(Beta) NEW USER INTERFACE", while the page under it says "You can now perform most tasks, from the new user interface (UI)." AV05 rests on the implementation overview page outside that heading. The native Customer Journey Analytics integration was listed on 8 September 2025 as "(Beta feature)" and again on 9 June 2026 with no label, so it is written up (XM19, XM20). Page: `advertising/integrations/home`.
5. **Coworker with Campaign v8: documented, but Campaign is on neither of Adobe's lists.** The Coworker Chat workflows page has a Campaign v8 section with ten workflows: "Use Coworker Chat to find and update deliveries, manage assets, explore the data model, and inspect, validate, and troubleshoot workflows in Adobe Campaign v8." The Coworker overview's list under "Coworker Chat is available now in the following applications:" and the Chat overview's list under "The following CX Enterprise applications are compatible with Coworker Chat:" name Real-Time CDP, Journey Optimizer, Customer Journey Analytics, Adobe Analytics, Target, AEM, Workfront and Marketo Engage, and not Campaign. Pages: `coworker/content/chat/use-cases/workflows`, `coworker/content/home`, `coworker/content/chat/overview`. Written up with a statement of work condition; a question for Adam.
6. **Audience Manager connections depend on Adam's call on Audience Manager itself** (the other helper's lifecycle question). On the Campaign side the only setup guide is in the Campaign Classic v7 guide, marked "Applies to: Campaign Classic v7", and the Campaign v8 page says "Learn more about Audience sharing between Campaign and Experience Cloud solutions in Campaign Classic v7 documentation." On the Advertising side the pages are current (updated June and October 2026).
7. **Small labels kept off the cards:** the earlier Real-Time CDP destination card for DSP is marked "Legacy" by Adobe (XM21 uses the current card and says so without the label); Marketo Measure's cross-domain tracking and view-through attribution are deprecated; custom activity types in Marketo Measure Ultimate are "not supported yet".

## Product: Adobe Campaign (`campaign`)

**Title:** Adobe Campaign v8 (Managed Cloud Services). **What:** Adobe's cross-channel campaign management product: email, SMS, push, direct mail and transactional messages sent from its own customer database, with workflows that build audiences and move data. These lines are written for Campaign v8, which Adobe runs as a Managed Cloud Service with a console application and a Web user interface. Source: https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/get-started

**Notes:** One box, written for Campaign v8. Adobe's pages support v8 as the version to write for: the Campaign Classic FAQ calls v8 Adobe's strategic platform, and the Campaign Web pages say Campaign Standard users may move to v8. Adobe's own statements on Campaign Classic v7 and Campaign Standard are quoted in the trail, not on any card. CG07 is the one line for a client still on an earlier version. Campaign v8 is a managed service: Adobe sets the environment, installs add-ons and switches on each connection to another Adobe product, so partner work is the configuration and build around what Adobe provisions. Administration sits in the console application; the Web user interface is for marketers. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An Adobe Campaign v8 Managed Cloud Services license; Adobe sets the environment and its first configuration. Adobe: "With Campaign Managed Cloud Services, your environment and initial configuration is set by Adobe, according to the terms of your license agreement." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/config/implement/implement)
- Add-ons and capabilities that were not provisioned, requested through your client's Adobe Transition Manager. Adobe: "If you need to use a Campaign add-on or a specific capability which has not been provisioned for you, you must contact your Adobe Transition Manager." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/config/implement/implement)
- Users who sign in with an Adobe ID, added in the Admin Console to product profiles that match Campaign operator groups. Adobe: "Permissions are granted through Adobe Admin Console and Campaign Client Console." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/permissions/gs-permissions)
- Connections to other Adobe products switched on by Adobe on request. Adobe: "As a Managed Cloud Services user, contact Adobe to connect Campaign with Adobe Experience Cloud services and solutions." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/integration)
- For transactional messages: Transactional messaging configured in the environment by Adobe. Adobe: "As a Managed Cloud Services user, contact Adobe to configure Campaign Transactional messaging in your environment." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/send/real-time/transactional)
- For the Web user interface: the minimum Campaign release Adobe names on its FAQ page, with sign-in through Adobe's identity system. Adobe: "To access the new user interface, Adobe Campaign version 8.6 is required, and Adobe Identity Management System (IMS) is mandatory." (https://experienceleague.adobe.com/en/docs/campaign-web/v8/start/faq)

### Tiers

- **Campaign v8 Managed Cloud Services:** The version and offering these lines assume. Adobe hosts and monitors the environment; your client's team and its partner configure and run it. Adobe: "Adobe Campaign v8 is available as a Managed Cloud Service." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/v7-to-v8)
- **Campaign FDA or Enterprise (FFDA) deployment:** Two deployment models. Which one your client holds decides where data sits and which capabilities are present, so check it before CG02. Adobe: "Two deployment models are available: Campaign FDA deployment (P1-P3) and Campaign Enterprise (FFDA) deployment (P4)." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/architecture/architecture)
- **Add-ons installed by Adobe:** Some capabilities are packages Adobe installs on request, such as the Web Analytics connectors add-on that the Adobe Analytics connection needs. Adobe: "The Web Analytics connector add-on must be installed on your environment, through the dedicated package." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aa)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| CG01 | Access, operator groups and Control Panel setup | one-time | 16 | 32 | 56 | yes |  |
| CG02 | Data model extension and profile loading | one-time | 40 | 80 | 160 | yes |  |
| CG03 | Channel settings and deliverability setup | one-time | 24 | 48 | 96 | yes |  |
| CG04 | Delivery, campaign and workflow templates with typology rules | one-time | 32 | 56 | 104 | yes |  |
| CG05 | First campaigns, with training | one-time | 40 | 72 | 128 | yes |  |
| CG06 | Transactional messages from events | one-time | 24 | 48 | 88 | optional |  |
| CG07 | Transition plan from Campaign Classic or Campaign Standard | one-time | 40 | 80 | 160 | optional |  |
| CG08 | Monthly campaign operations | monthly | 24 | 40 | 72 | yes |  |

- **CG01 Access, operator groups and Control Panel setup.** Define your client's operator groups and named rights in the Campaign console, match them to product profiles in the Admin Console, set folder permissions, and set up Control Panel for IP allow lists, SFTP keys and subdomains. Evidence: "Step 1: Define your operator groups and assign them permissions in Campaign Client Console." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/permissions/gs-permissions)
- **CG02 Data model extension and profile loading.** Design your client's data model on Campaign's built-in tables, extend schemas or add tables where needed, and build the workflows that load, reconcile and update profiles from files or source systems. Evidence: "You can extend existing schemas or create new schemas from scratch." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/config/implement/implement)
- **CG03 Channel settings and deliverability setup.** Configure your client's email, SMS and push channels with their external accounts, sender settings and tracking, set up sending subdomains in Control Panel, and agree the list and sending practices that protect deliverability. Evidence: "Define settings: grant access, share the client console, configure channels (email, push, sms)." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/config/implement/implement)
- **CG04 Delivery, campaign and workflow templates with typology rules.** Build your client's delivery templates for each channel, its campaign and workflow templates, and the typology rules that control fatigue and filter sends, so marketers start from approved settings. Evidence: "You need to configure and adapt templates to your needs and make them available to end-users." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/config/implement/implement)
- **CG05 First campaigns, with training.** Build your client's first cross-channel campaigns: audience workflows, personalized deliveries, proofs, approvals and scheduling. Train marketers on the Web user interface and administrators on the Campaign console, with a short guide to which tasks sit in which. Evidence: "Adobe Campaign lets you design and orchestrate targeted and personalized campaigns on multiple channels: email, direct mail, SMS, push notification." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/campaigns/campaigns)
- **CG06 Transactional messages from events.** Define the event types your client's systems send, build and publish the transactional message templates, and test event processing and delivery from end to end. Evidence: "Transactional messaging (Message Center) is a Campaign module designed for managing trigger messages." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/send/real-time/transactional)
- **CG07 Transition plan from Campaign Classic or Campaign Standard.** Where your client runs Campaign Classic v7 or Campaign Standard, inventory its data model, workflows, templates and integrations, map each to Campaign v8, list what v8 handles differently or does not carry over, and plan the cutover with Adobe's transition team. Evidence: "As a former Campaign Classic user, note that most of the Campaign Classic v7 features are available with Campaign v8, except a small set of them, listed in this section." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/v7-to-v8)
- **CG08 Monthly campaign operations.** Each month, build and send the agreed campaigns, monitor workflows and deliveries, review delivery and deliverability reports, and tune templates, typology rules and audiences. Evidence: "To avoid this, coordinate the scheduling of deliveries with the other members of your team to ensure the best performance." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/send/delivery-best-practices)

## Product: Adobe Advertising (`advertising`)

**Title:** Adobe Advertising (DSP; Search, Social, & Commerce; Creative). **What:** Adobe's ad buying suite, in three parts: Advertising DSP for display, video, connected TV, audio and native ads; Search, Social, & Commerce for search, shopping, social and performance max campaigns across ad networks; and Advertising Creative for personalized ad experiences. Source: https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/intro/about

**Notes:** One box for the three parts; each line carries a tag for the part it needs. Adobe's own teams do much of the setup: Adobe or an affiliate agency launches Search, Social, & Commerce with each advertiser, and Adobe's account and implementation teams switch on the integrations with Analytics, Audience Manager, Real-Time CDP and Experience Manager. Partner lines are the planning, tagging, structure, audiences, reporting and running of campaigns around that. The word Commerce in Search, Social, & Commerce means commerce ad campaigns; Adobe documents no connection to the Adobe Commerce product. ChatGPT conversational ads and the AI Assistant's agent features carry a label that Adam's rule excludes (see left_out), and the Search, Social, & Commerce guide files its new user interface under a labelled heading, so AV05 rests on the implementation overview page outside it. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An Adobe Advertising account for each part in scope, launched with Adobe or one of its affiliate agencies. Adobe: "Adobe or one of its affiliate agencies works with each advertiser to launch its online advertising portfolios and to track any additional ad campaigns." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview)
- Enough account credit in DSP to run the whole campaign. Adobe: "Make sure your account has enough credit to run the entire campaign." (https://experienceleague.adobe.com/en/docs/advertising/dsp/campaign-management/campaigns/campaign-launch-checklist)
- An administrator who invites the team, because new DSP users start with read-only access. Adobe: "New users have read-only access by default." (https://experienceleague.adobe.com/en/docs/advertising/dsp/admin/users/user-invite)
- For Search, Social, & Commerce: access credentials and tracking options for each ad network account to sync. Adobe: "Synchronize with the account by a) creating a corresponding account record in Search, Social, & Commerce that contains the account access credentials and tracking options and b) setting the account status to enabled." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview)
- Conversion tracking tags on your client's site, or a daily feed of conversion data. Adobe: "Depending on the implementation, this may involve adding conversion tracking tags to the appropriate webpages and/or setting up a daily feed drop for conversion data that you've collected using your own method." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview)
- For Search, Social, & Commerce optimization: at least 14 days of click and revenue data before a portfolio launches. Adobe: "The implementation team then gathers and validates click and revenue data for at least 14 days and validates the portfolio settings." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview)

### Tiers

- **Advertising DSP:** The demand-side platform for display, video, connected TV, audio and native ads. Lines AV01, AV03 and AV04 need it. Adobe: "Deliver connected experiences across all advertising channels: paid search, display, video, connected TV (CTV), audio, and native." (https://experienceleague.adobe.com/en/docs/advertising/dsp/introduction/dsp-about)
- **Advertising Search, Social, & Commerce:** Portfolio-based management of search, shopping and social campaigns across ad networks. Line AV05 needs it. Adobe: "Search, Social, & Commerce automates and optimizes bid and budget management for ad campaigns across ad networks within the boundaries of an advertiser's business objectives, metrics, budget, and other business constraints." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/intro/about)
- **Advertising Creative:** Creative libraries and ad experiences, usable in Advertising DSP or another buying platform. Line AV06 needs it. Adobe: "As part of Adobe Advertising, Advertising Creative is a self-service platform for automating real-time, personalized ad experiences and optionally optimizing your ads at the creative element level." (https://experienceleague.adobe.com/en/docs/advertising/creative/introduction/creative-about)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| AV01 | DSP users and campaign structure | one-time | 24 | 40 | 72 | yes | Advertising DSP |
| AV02 | Conversion tracking and custom goals | one-time | 24 | 40 | 80 | yes |  |
| AV03 | First-party segments and reusable audiences | one-time | 24 | 40 | 72 | yes | Advertising DSP |
| AV04 | Private inventory deals | one-time | 16 | 32 | 56 | optional | Advertising DSP |
| AV05 | Search, Social, & Commerce accounts, tracking and portfolios | one-time | 40 | 72 | 128 | yes | Search, Social, & Commerce |
| AV06 | Creative libraries and ad experiences | one-time | 32 | 56 | 104 | optional | Advertising Creative |
| AV07 | Custom reports and scheduled delivery | one-time | 16 | 24 | 48 | optional | Advertising DSP |
| AV08 | Monthly campaign and portfolio management | monthly | 24 | 40 | 80 | yes |  |

- **AV01 DSP users and campaign structure.** Invite your client's DSP users and set their access, then build the campaign, package and placement structure with budgets, flight dates, frequency caps and the brand safety and viewability options each campaign reports on. Evidence: "Each campaign can contain one or more packages, each of which includes a set of placements." (https://experienceleague.adobe.com/en/docs/advertising/dsp/campaign-management/campaign-management-overview)
- **AV02 Conversion tracking and custom goals.** Define your client's conversion metrics, deploy and test the tracking tags, build weighted custom objectives from the metrics, and check that each package or portfolio optimizes toward the right goal. Evidence: "You can also use an advertiser's conversion metrics to create custom objectives, which are used to optimize packages." (https://experienceleague.adobe.com/en/docs/advertising/dsp/admin/conversion-metrics-manage)
- **AV03 First-party segments and reusable audiences.** Create custom DSP segments with their tracking tags for site visitors and ad exposure, combine first-party and third-party segments into reusable audiences, and attach them to placements as targets or exclusions. Evidence: "Collect your own first-party audience data by creating and implementing DSP segments." (https://experienceleague.adobe.com/en/docs/advertising/dsp/audiences/audience-about)
- **AV04 Private inventory deals.** Set up your client's private deals with publishers by deal ID, attach them to placements and ads, and check delivery and pricing against what was negotiated. Evidence: "If you have direct relationships with publishers, you can streamline your media buying process and workflow by using your own private deals, which feature negotiated inventory and pricing, in your Advertising DSP placements." (https://experienceleague.adobe.com/en/docs/advertising/dsp/inventory/private-inventory/private-inventory-about)
- **AV05 Search, Social, & Commerce accounts, tracking and portfolios.** Sync your client's ad network accounts, set up click and conversion tracking, agree the objectives and metrics, and build the portfolios that group campaigns for bid and budget optimization, with the baseline period before each portfolio launches. Evidence: "Set up portfolios configured to meet your objective and business goals, with the appropriate campaigns." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview)
- **AV06 Creative libraries and ad experiences.** Build your client's creative libraries and bundles, set up ad experiences with decision tree targeting by audience and location, and export the ad tags to Advertising DSP or another buying platform. Evidence: "Experiences with decision tree targeting: Creative allows you to configure personalized ad experiences throughout the customer journey using a decision tree model." (https://experienceleague.adobe.com/en/docs/advertising/creative/creative-experiences/experience-about)
- **AV07 Custom reports and scheduled delivery.** Build the custom reports your client's team needs from Adobe's templates or from scratch, schedule them, and set up the report destinations they are delivered to. Evidence: "Custom reports allow you to customize the content and delivery of your report data using the campaign dimensions (such as the advertiser, placement, sites, or geos) and the metrics that matter most to you." (https://experienceleague.adobe.com/en/docs/advertising/dsp/custom-reports/report-about)
- **AV08 Monthly campaign and portfolio management.** Each month, review performance by package, placement and portfolio, adjust budgets, objectives, audiences and creative, add or pause campaign components, and report results against your client's goals. Evidence: "Continue to monitor and analyze the performance of each portfolio by viewing alerts, performance data for each portfolio and its component campaigns, customizable reports, and (some roles) simulations." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview)

## Product: Marketo Measure (`mmeasure`)

**Title:** Adobe Marketo Measure (formerly Bizible). **What:** Adobe's B2B marketing attribution product: it tracks web sessions and ad spend, ties touchpoints to leads, contacts and opportunities in the CRM, and reports which channels drive pipeline and revenue. These lines are written for the tiers that connect directly to a CRM and to Marketo Engage; Marketo Measure Ultimate takes its data through Experience Platform and is written up as the Real-Time CDP connection. Source: https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview

**Notes:** Two editions that are set up differently. Tiers 1 to 3 connect straight to Salesforce or Microsoft Dynamics and to Marketo Engage, and can write touchpoints back to the CRM; MZ01 to MZ08 are written for them. Marketo Measure Ultimate has no direct CRM or Marketo Engage connection, takes B2B data through Experience Platform, writes nothing back to the CRM, and has no migration path from the tiers, so it is the mmeasure-rtcdp connection. Adobe's current release notes page covers 2024 releases only; that is raised for Adam in the trail and stated on no card. Cross-domain tracking and view-through attribution are deprecated and no line rests on them. The CRM and the ad platforms are outside systems the tool already draws (crm, ads); MZ02 and MZ04 carry that work on the product. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- A Marketo Measure subscription, with the Adobe Admin Console provisioned for its users. Adobe: "The first step to using Marketo Measure is to create and sign in to your provisioned Adobe Admin Console." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/getting-started-with-marketo-measure/adobe-admin-console-setup)
- Salesforce or Microsoft Dynamics as the CRM, with the Marketo Measure package installed or a dedicated connected user for the packageless route. Adobe: "Through the standard Marketo Measure installation, you are required to install a Salesforce Package or a Microsoft Dynamics Managed Solution." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/getting-started-with-marketo-measure/marketo-measure-crm-packageless-integration)
- The Marketo Measure JavaScript on every tracked page, and every domain claimed in the Admin Console. Adobe: "Make sure you've claimed all appropriate domains in the Adobe Admin Console in addition to deploying the Marketo Measure JavaScript." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-tracking/setting-up-tracking/adding-marketo-measure-script)
- A decision on sandbox or production before Salesforce is connected, because a production connection cannot be moved back to a sandbox. Adobe: "Once your Marketo Measure account is connected to a Salesforce production instance, you cannot move backwards and connect to a sandbox." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/marketo-measure-and-salesforce/marketo-measure-salesforce-package-installation-and-set-up)
- Spend data for every channel: connected ad accounts, CRM campaign costs or uploads. Adobe: "To have accurate and comprehensive ROI reporting across all of your channels and subchannels, you must make sure you have the appropriate spend data being pulled into Marketo Measure." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketing-spend/spend-management/spend-management-methods)
- For Marketo Measure Ultimate: B2B data brought in through Experience Platform, because the direct CRM and Marketo Engage connections do not exist there. Adobe: "The direct CRM and Marketo Engage connections are no longer available for Ultimate." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview)

### Tiers

- **Marketo Measure Tiers 1 to 3:** The editions these lines assume: a direct connection to Salesforce or Microsoft Dynamics and to Marketo Engage. Which attribution models a subscription includes depends on the tier. Adobe: "This article outlines the migration process for users moving from the Tier 1 or 2 subscription to Marketo Measure Ultimate." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/migration-from-tier-to-marketo-measure-ultimate)
- **Marketo Measure Ultimate:** The edition that takes B2B data from nearly any source through Experience Platform. It is a new implementation, set up through the Real-Time CDP connection (XM30, XM31). Adobe: "Marketers are expected to bring their B2B data (for example, Account, Opportunity, Contact, Lead, Campaign, Campaign Member, Activity) through AEP." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| MZ01 | Admin Console users and tracking script rollout | one-time | 16 | 32 | 56 | yes |  |
| MZ02 | CRM package and connection | one-time | 24 | 48 | 88 | yes | Also needs Salesforce or Microsoft Dynamics |
| MZ03 | Online and offline channel mapping | one-time | 24 | 40 | 80 | yes |  |
| MZ04 | Ad platform connections and spend data | one-time | 16 | 32 | 56 | yes | Also needs ad platform accounts |
| MZ05 | Stage mapping and attribution model setup | one-time | 24 | 40 | 72 | yes |  |
| MZ06 | Discover dashboards for marketing and sales | one-time | 16 | 32 | 56 | yes |  |
| MZ07 | Data warehouse access and BI report template | one-time | 16 | 32 | 64 | optional | Also needs Power BI or Tableau |
| MZ08 | Monthly attribution upkeep | monthly | 12 | 20 | 32 | yes |  |

- **MZ01 Admin Console users and tracking script rollout.** Add your client's admins and users in the Adobe Admin Console, claim each domain, and deploy the Marketo Measure JavaScript on every page and form of every tracked site, hardcoded or through a tag manager. Test that sessions and form fills are captured. Evidence: "Having the Marketo Measure JavaScript deployed correctly and comprehensively across your entire site(s) will ensure that the session data collected produces accurate touchpoint data." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-tracking/setting-up-tracking/best-practices-for-implementing-marketo-measure-javascript)
- **MZ02 CRM package and connection.** Install the Marketo Measure package in your client's Salesforce or Microsoft Dynamics sandbox and then in production, or set up the packageless route with a dedicated connected user. Connect the CRM, and set permission sets and page layouts. Evidence: "Through the standard Marketo Measure installation, you are required to install a Salesforce Package or a Microsoft Dynamics Managed Solution." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/getting-started-with-marketo-measure/marketo-measure-crm-packageless-integration)
- **MZ03 Online and offline channel mapping.** Agree your client's UTM conventions, write the online channel rules and the offline channel mapping to CRM campaign types, set the campaign sync rules that turn campaign members into touchpoints, and check touchpoints land in the right channel and subchannel. Evidence: "To have accurate reporting, marketing channels must be set up to reflect your organization's UTM strategy." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/channel-tracking-and-setup/online-channels/online-custom-channel-setup)
- **MZ04 Ad platform connections and spend data.** Connect your client's ad accounts with the right roles, set up tagging on ad URLs, switch on CRM campaign costs where used, and load spend for the channels that have no connection. Evidence: "Any Ad Account that you have connected to Marketo Measure through an API has its spend automatically pulled into Marketo Measure for ROI reporting." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketing-spend/spend-management/spend-management-methods)
- **MZ05 Stage mapping and attribution model setup.** Order your client's lead, contact and opportunity stages in Stage Mapping, choose the stages and weights for the custom attribution model where the subscription includes it, and review touchpoint and segment settings with marketing and sales operations. Evidence: "The validity of your Marketo Measure data relies on these stages being ordered correctly so that Marketo Measure can accurately understand your funnel and the progression of records throughout said funnel." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/advanced-marketo-measure-features/custom-attribution-models/best-practices-for-stage-mapping)
- **MZ06 Discover dashboards for marketing and sales.** Walk your client's teams through the Discover dashboards, agree the filters and segments each group reads, and set the short list of revenue, pipeline and return views that leadership sees each month. Evidence: "Every dashboard has a range of filters, accompanied by the following controls for seamless navigation and customization." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-discover-ui/dashboards/discover-dashboard-basics)
- **MZ07 Data warehouse access and BI report template.** Give your client's analysts access to the data warehouse reader account, connect Adobe's Power BI or Tableau report template, and adapt it to your client's channels and date ranges. Evidence: "This is a read-only account that's available for your organization, not just an individual user." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-data-warehouse/data-warehouse-access-reader-account)
- **MZ08 Monthly attribution upkeep.** Each month, enable touchpoints for new CRM campaigns, load new spend, review channel mapping against new UTM values and domains, and report attributed pipeline and revenue by channel. Evidence: "Marketo Measure pulls almost everything that it needs from your CRM on a daily basis, but there are a few maintenance tasks you should schedule regularly to keep Marketo Measure humming along and outputting the most accurate information possible." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/miscellaneous/other-related-resources/marketo-measure-maintenance)

## Connections with services

### Adobe Campaign + Real-Time CDP (`campaign-rtcdp`)

**Kind:** platform. **Label:** Destination sends Real-Time CDP audiences and attributes to Campaign; a source connector returns delivery and tracking logs.

**How:** Experience Platform sends Real-Time CDP audiences and profile attributes to Campaign v8 through the Adobe Campaign Managed Cloud Services destination, where audiences arrive as lists for deliveries. A source connector of the same name returns Campaign's delivery and tracking logs to Experience Platform. Source: https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aep/ac-aep

**Gain:** CDP audiences in Campaign, and Campaign results back in the profile. Your client's marketers send to audiences built on the full customer profile without rebuilding them in Campaign, and sends, opens and clicks return to Experience Platform, where they sharpen the next audience.

**Flows:** Real-Time CDP to Adobe Campaign: Audiences from the Segmentation Service with their mapped fields, and updates to chosen attributes on profiles already in Campaign. Adobe Campaign to Real-Time CDP: Delivery logs and tracking logs (sends, opens, clicks), ingested in batches into Experience Event datasets.

**Availability:** Not stated by Adobe; the destination page names a minimum Campaign release. Adobe: "This integration works with Adobe Campaign version 8.4 or higher."

**Prerequisites:**

- Campaign v8 at or above the minimum release Adobe names on the destination page. Adobe: "This integration works with Adobe Campaign version 8.4 or higher."
- Audiences built in the Segmentation Service; other audience origins are not supported by this destination. Adobe: "Audiences generated through the Experience Platform Segmentation Service."
- No more than 25 audiences per Campaign instance and 20 mapped fields per audience, unless the Campaign options are raised. Adobe: "You can activate a maximum of 25 audiences to this destination."
- Destination permissions in Experience Platform for whoever connects and activates. Adobe: "To connect to the destination, you need the View Destinations and Manage Destinations access control permissions."
- Activation no more often than every three hours. Adobe: "The activation frequency is 3 hours minimum."
- For attribute sync: the profiles already present in Campaign's database. Adobe: "Profile attributes sync is available for profiles that are already present in Adobe Campaign database."
- For the logs: a delivery log schema and a tracking log schema with their datasets, created before the source is connected. Adobe: "You must apply the Campaign Delivery Logs field group to your delivery logs schema and the Campaign Tracking Logs field group to your tracking logs schema."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM01 | Real-Time CDP audiences into Campaign | one-time | 16 | 32 | 56 | yes |  |
| XM02 | Campaign delivery and tracking logs into Experience Platform | one-time | 16 | 32 | 64 | yes |  |
| XM03 | Profile attribute sync from Real-Time CDP | one-time | 8 | 16 | 32 | optional |  |

- **XM01 Real-Time CDP audiences into Campaign.** Connect the Adobe Campaign Managed Cloud Services destination with audience sync, choose the target mapping, map the identity, the fields and the deduplication key, activate the agreed audiences, and check they arrive in Campaign as lists. Evidence: "Audience sync: Use this option to send Adobe Experience Platform audiences over to Adobe Campaign." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/email-marketing/adobe-campaign-managed-services)
- **XM02 Campaign delivery and tracking logs into Experience Platform.** Create the delivery log and tracking log schemas and datasets, connect the Adobe Campaign Managed Cloud Services source, choose the fields to bring over, and check that sends, opens and clicks reach Experience Platform. Evidence: "The Adobe Campaign Managed Cloud Services source connector allows you to ingest delivery and tracking log data from Adobe Campaign v8 into Adobe Experience Platform." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/campaign)
- **XM03 Profile attribute sync from Real-Time CDP.** Set up a second destination connection with profile sync, so agreed attributes such as consent values stay current on profiles already in Campaign. Evidence: "Profile sync (Update only): Use this option to bring Adobe Experience Platform profile attributes into Adobe Campaign and have a sync process in place so that they can be updated on a regular basis." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/email-marketing/adobe-campaign-managed-services)

**Client voice.** How: Audiences from your Real-Time CDP arrive in Adobe Campaign as lists, ready for your email, SMS, push and direct mail sends, and chosen profile attributes stay in step. Campaign's sends, opens and clicks flow back into Experience Platform. Gain: Your marketers reach audiences built on your full customer profile without rebuilding them in Campaign, and what each send achieved feeds your next audience.

### Adobe Campaign + Journey Optimizer (`campaign-ajo`)

**Kind:** native. **Label:** A Campaign action in a journey sends email, push or SMS through Campaign's Transactional messaging.

**How:** A journey in Journey Optimizer sends an email, push notification or SMS through Campaign's Transactional messaging: a Campaign action in the journey passes the event and its personalization fields to a published transactional template in Campaign. Source: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/adobe-solutions/acc-action

**Gain:** Journeys that send through Campaign. Your client keeps Campaign's templates, sender settings and delivery for one-to-one messages, and gets Journey Optimizer's real-time journeys on top, without moving sending to a new channel setup.

**Flows:** Journey Optimizer to Adobe Campaign: One event per person with its payload of personalization fields, sent to a Campaign transactional template.

**Availability:** Journey Optimizer's page says an integration is available for Campaign v7 or v8, set up by Adobe when requested. Adobe: "An integration is available if you have Adobe Campaign v7 or v8."

**Prerequisites:**

- The connection between the two environments set up by Adobe, at provisioning or on a request to Journey Optimizer support. Adobe: "When requested, the connection between the Journey Optimizer and Adobe Campaign environments is setup by Adobe at provisioning time." Statement of work condition: Adobe sets up the connection between the Client's Journey Optimizer and Campaign environments before this service starts.
- Transactional messaging configured in Campaign. Adobe: "The Transactional Messaging feature must be configured."
- Campaign at or above the minimum build Adobe names on its use case page. Adobe: "In order to use this integration, you must have Campaign v7/v8 build 9125 or higher."
- One-to-one use cases only, because the connection is capped at 4,000 messages per five minutes with no throttling. Adobe: "The system caps the number of messages that can be sent over to 4,000 per 5 minutes, based on the current Campaign SLA."
- No Campaign action in a journey that starts from a Read Audience or Audience Qualification activity. Adobe: "Campaign v7/v8 actions cannot be used with Read Audience or Audience Qualification activities."
- One action configured in Journey Optimizer for each Campaign template. Adobe: "You need to configure one action in Journey Optimizer for each template you wish to use from Adobe Campaign."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM04 | Campaign transactional messages from journeys | one-time | 16 | 32 | 56 | yes |  |

- **XM04 Campaign transactional messages from journeys.** Create and publish the event types and transactional templates in Campaign, configure one Campaign action per template in Journey Optimizer with its payload, and test a journey that sends through Campaign. Evidence: "In Journey Optimizer, you must configure one action per transactional message." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/adobe-solutions/acc-action)

**Client voice.** How: Your journeys in Journey Optimizer send email, push or SMS through Adobe Campaign: each message uses a transactional template you publish in Campaign, filled with the details of the event that started it. Gain: You keep Campaign's templates and delivery for one-to-one messages and add real-time journeys on top, without setting up sending a second time.

### Adobe Campaign + Adobe Analytics (`campaign-aa`)

**Kind:** extension. **Label:** Web Analytics connectors add-on sends email campaign results to a report suite; Experience Cloud Triggers start emails from site behavior.

**How:** Through the Web Analytics connectors add-on, Campaign sends the indicators and attributes of its email campaigns to an Adobe Analytics report suite each day, and tracked links carry the campaign and delivery identifiers so site activity is tied to the email. Separately, Experience Cloud Triggers pass behaviors that Analytics detects on the site, such as an abandoned cart, to Campaign, which sends an email in near real time. Source: https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aa

**Gain:** Email results in Analytics, and site behavior that starts an email. Your client's analysts see what each email campaign did on the site beside every other channel, and marketers follow up on behaviors such as an abandoned cart within the hour.

**Flows:** Adobe Campaign to Adobe Analytics: Email campaign indicators (sent, opened, clicked, bounced, unsubscribed) and campaign attributes, sent once a day. Adobe Analytics to Adobe Campaign: Triggers for defined site behaviors, such as a cart abandonment, passed through the pipeline.

**Availability:** Not stated by Adobe. The connector is an add-on that Adobe installs, and Adobe implements Triggers for Managed Cloud Services environments. Adobe: "The Web Analytics connector add-on must be installed on your environment, through the dedicated package."

**Prerequisites:**

- The Web Analytics connectors add-on installed on the Campaign environment by Adobe. Adobe: "The Web Analytics connector add-on must be installed on your environment, through the dedicated package." Statement of work condition: Adobe installs the Web Analytics connectors add-on on the Client's Campaign environment before this service starts.
- A report suite with two conversion variables, ten success events and a classification set, created before the Campaign external account. Adobe: "Since the migration to the Adobe Analytics 2.0 API, you also need to create a Classification set in Adobe Analytics before you configure your external account in Campaign."
- Adobe Analytics product profile permissions on those components for the user who configures the external account. Adobe: "this means that you are missing a permission for this newly created component in the Product profile associated to the user."
- Email deliveries only: the connector does not work with Transactional messaging. Adobe: "Adobe Analytics Connector is not compatible with Transactional messaging (Message Center)."
- A day's delay accepted, because the indicators are sent once a day. Adobe: "This workflow is triggered at 4am every day and it can take 24 hours for the data to be sent to Analytics."
- For triggered emails: Experience Cloud Triggers implemented with Campaign by Adobe. Adobe: "As a Managed Cloud Services user, contact Adobe to implement Experience Cloud triggers with Campaign." Statement of work condition: Adobe implements Experience Cloud Triggers with the Client's Campaign environment before this service starts.

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM05 | Adobe Analytics connector for email campaigns | one-time | 24 | 40 | 72 | yes |  |
| XM06 | Triggered emails from site behavior | one-time | 24 | 48 | 88 | optional |  |

- **XM05 Adobe Analytics connector for email campaigns.** Create or choose the report suite, set up the conversion variables, success events and classification set in Adobe Analytics, configure the Web Analytics external account in Campaign with the tracked domains, and reference it in your client's delivery templates. Evidence: "This integration sends indicators and attributes of email campaigns delivered by Adobe Campaign to Adobe Analytics." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aa)
- **XM06 Triggered emails from site behavior.** With Adobe, set up Experience Cloud Triggers for the agreed behaviors such as cart abandonment, define each trigger in Adobe Analytics, map its data to Campaign, and build and test the email each trigger starts. Evidence: "Triggers are processed in Adobe Campaign to send emails in near real time." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-triggers)

**Client voice.** How: Adobe Campaign sends the results of your email campaigns to Adobe Analytics each day, and links in your emails carry the campaign so site visits are tied to it. Behaviors that Analytics detects on your site, such as an abandoned cart, can start an email from Campaign. Gain: Your analysts see what each email did on your site beside every other channel, and your marketers follow up on key behaviors while they are fresh.

### Adobe Campaign + Target (`campaign-target`)

**Kind:** native. **Label:** Dynamic image served by Target inside a Campaign email, chosen when the email is opened.

**How:** A Campaign email carries an image served by Target: when the recipient opens the email, a call to Target picks the version by rules set beforehand, such as the recipient's location or a field passed from Campaign. A default image shows when no rule applies. Source: https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-at

**Gain:** Email images chosen at open time. Your client's emails show the image that fits each recipient at the moment of opening, managed with the same Target audiences and offers the site uses.

**Flows:** Adobe Campaign to Target: A call at open time with the location name and the Campaign fields mapped as decision parameters. Target to Adobe Campaign: The image version chosen by the Experience Targeting activity, or the default image.

**Availability:** Not stated by Adobe. Adobe says the integration supports static images only. Adobe: "The integration only supports static images. The other types of content cannot be personalized." Statement of work wording: Static images only: other types of email content are not personalized through this connection.

**Prerequisites:**

- Adobe switches the connection on for the Campaign environment, on request. Adobe: "As a Managed Cloud Services user, contact Adobe to connect Campaign with Adobe Experience Cloud services and solutions." Statement of work condition: Adobe enables the connection for the Client's Campaign environment before this service starts.
- Static images only; other content in the email is not personalized by Target. Adobe: "The integration only supports static images. The other types of content cannot be personalized."
- Redirect offers, audiences and an Experience Targeting activity created in Target for each image location. Adobe: "In Adobe Target, we need to create an Experience Targeting activity, define the different experiences, and associate them with the corresponding offers."
- Where Target uses Enterprise permissions: the matching property entered in the image settings. Adobe: "If you use Enterprise permissions in your settings in Adobe Target, add the corresponding property in this field."
- Target visitor segments used only where the data carries no legal restriction. Adobe: "Segments linked to the visitor ID in Adobe Target, only if the data used is not subject to legal limitations"

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM07 | Target dynamic images in Campaign emails | one-time | 16 | 32 | 56 | yes |  |

- **XM07 Target dynamic images in Campaign emails.** Insert the Target-served image in your client's email templates with its default image and location name, create the redirect offers, audiences and Experience Targeting activity in Target, and test the rendering for each case. Evidence: "Connect Campaign and Target to include an offer from Adobe Target in an Adobe Campaign email delivery." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-at)

**Client voice.** How: An image in your Adobe Campaign email is served by Adobe Target. When a recipient opens the email, Target picks the version that fits your rules, such as their location, and shows a default image otherwise. Gain: Your emails show the right image for each recipient at the moment they open, using the audiences and offers you already manage in Target.

### Adobe Campaign + AEM Sites (`campaign-aemsites`)

**Kind:** native. **Label:** Email content authored and approved in AEM Sites, pulled into Campaign deliveries, with language copies for multilingual sends.

**How:** Email content is authored as a page in AEM Sites from the Adobe Campaign Email template, with Campaign personalization fields, and approved in AEM. A Campaign delivery then pulls that content through an external account, and language copies in AEM become the language variants of a multilingual delivery. Source: https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aem

**Gain:** Emails authored where the website is authored. Your client's content team builds and approves email content with the same tools, components and brand rules as the website, and marketers send it from Campaign without copying HTML.

**Flows:** AEM Sites to Adobe Campaign: Approved email pages and their language copies, pulled into a delivery and refreshed on request. Adobe Campaign to AEM Sites: Personalization fields from Campaign, available to authors as components in the email page.

**Availability:** Not stated by Adobe. Campaign's Web interface connects to AEM as a Cloud Service through an external account set in the Campaign console. Adobe: "This connection is managed through a dedicated External Account configured in the Adobe Campaign client console."

**Prerequisites:**

- Experience Manager integrated with the Campaign environment by Adobe. Adobe: "As a Managed Cloud Services user, contact Adobe to integrate Adobe Experience Manager with Campaign." Statement of work condition: Adobe integrates Experience Manager with the Client's Campaign environment before this service starts.
- An external account for the AEM author environment, configured in the Campaign client console. Adobe: "This connection is managed through a dedicated External Account configured in the Adobe Campaign client console."
- Email pages approved in AEM through the Approve for Adobe Campaign workflow before Campaign can use them. Adobe: "From the first dropdown, select Approve Adobe Campaign as the workflow model, and click Start workflow."
- A refresh in Campaign after each change in AEM, because content is not synchronized automatically. Adobe: "Note that content is not automatically synchronized."
- For multilingual sends: language copies created and approved in AEM first. Adobe: "Adobe Experience Manager content with language copies already created and approved."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM08 | Email content from AEM in Campaign deliveries | one-time | 24 | 40 | 80 | yes |  |
| XM09 | Multilingual emails from AEM language copies | one-time | 16 | 24 | 48 | optional |  |

- **XM08 Email content from AEM in Campaign deliveries.** Configure the external account to your client's AEM author environment, set up the Adobe Campaign Email template and its approval workflow in AEM Sites, and build the delivery template that pulls AEM content with Campaign personalization fields. Evidence: "Integration between Adobe Campaign and Adobe Experience Manager allows you to manage the content of your email deliveries as well as your forms directly in Adobe Experience Manager." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aem)
- **XM09 Multilingual emails from AEM language copies.** Set up language copies of your client's email content in AEM, enable the multilingual option on the delivery template, choose the default language, and test each variant against recipient language. Evidence: "The Adobe Experience Manager integration enables you to create multilingual email deliveries using Adobe Experience Manager language copies." (https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/aem-multilingual)

**Client voice.** How: Your team authors and approves email content as pages in AEM Sites, with personalization fields from Adobe Campaign. Campaign pulls the approved content into a delivery, and your language copies in AEM become the language versions of the email. Gain: Your content team builds emails with the same tools and brand rules as your website, and your marketers send them from Campaign without copying HTML.

### Adobe Campaign + AEM Assets (`campaign-aemassets`)

**Kind:** native. **Label:** Asset picker in Campaign's email designer on an AEM Assets as a Cloud Service repository.

**How:** Campaign's Web interface opens an AEM Assets as a Cloud Service repository: marketers upload and manage assets from Campaign, and an asset picker in the email designer places them in email content. Source: https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/aem-assets

**Gain:** Approved assets in every email. Your client's marketers pick images from the DAM inside the email designer instead of uploading copies, so emails use the approved, current asset.

**Flows:** AEM Assets to Adobe Campaign: Folders and assets from the chosen repository, shown in the asset picker of the email designer. Adobe Campaign to AEM Assets: New assets uploaded from Campaign into a folder of the repository.

**Availability:** Not stated by Adobe.

**Prerequisites:**

- An AEM Assets as a Cloud Service environment connected to Campaign's Web interface. Adobe: "Additionally, with the new Campaign Web user interface, you can connect your Adobe Experience Manager as a Cloud Service environment to achieve the following use cases:"
- The external account for Experience Manager configured in the Campaign client console. Adobe: "This connection is managed through a dedicated External Account configured in the Adobe Campaign client console."
- Access to the repository and its folders for the marketers who build emails. Adobe: "Under Assets Management, click Assets, and choose the repository for your assets in Adobe Campaign."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM10 | AEM Assets picker for Campaign emails | one-time | 8 | 16 | 32 | yes |  |

- **XM10 AEM Assets picker for Campaign emails.** Connect your client's AEM Assets repository to Campaign's Web interface, agree the folders marketers use and who may upload, and test picking, placing and replacing approved assets in an email. Evidence: "From Adobe Campaign, select the Asset picker menu from the left pane of the email designer." (https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/aem-assets)

**Client voice.** How: Your AEM Assets repository opens inside Adobe Campaign. Your marketers browse or search your approved assets in the email designer and drop them into an email, and can upload new assets to a folder from Campaign. Gain: Your emails use approved, current images from your DAM instead of uploaded copies.

### Adobe Campaign + Workfront (`campaign-workfront`)

**Kind:** extension. **Label:** Workfront Fusion's Adobe Campaign modules create, read and update Campaign records and react to Campaign events.

**How:** Workfront Fusion has Adobe Campaign modules: a scenario starts on an event in Campaign, or creates, reads, updates and searches Campaign records and makes custom API calls, so work managed in Workfront and campaigns built in Campaign stay in step. Source: https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-workfront

**Gain:** Campaign work that follows the Workfront plan. Requests and approvals in Workfront create or update the matching records in Campaign, and Campaign events report back, so your client's teams stop retyping between the two.

**Flows:** Workfront to Adobe Campaign: Records created or updated in Campaign by a Fusion scenario, for example when a request is approved. Adobe Campaign to Workfront: Campaign events and record data that start a scenario or update Workfront work.

**Availability:** Not stated by Adobe. The connection runs through Workfront Fusion. Adobe: "Steps to configure this integration are detailed in Adobe Workfront documentation."

**Prerequisites:**

- Workfront Fusion, included in some Workfront packages and bought separately with others. Adobe: "If your organization has a Select or Prime Workfront package that does not include Workfront Automation and Integration, your organization must purchase Adobe Workfront Fusion."
- The Fusion IP addresses added to the Campaign allow list. Adobe: "You must add the Fusion IP addresses to Adobe Campaign."
- A server-to-server connection to Campaign v8, with credentials from the Adobe Developer Console. Adobe: "If you are connecting to Campaign version 8 or higher, you must create a server-to-server connection."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM11 | Workfront Fusion scenarios for Campaign | one-time | 24 | 40 | 80 | yes | Also needs Workfront Fusion |

- **XM11 Workfront Fusion scenarios for Campaign.** Create the server-to-server connection to Campaign in Workfront Fusion, add the Fusion addresses to the Campaign allow list, and build the agreed scenarios, such as creating or updating Campaign records when a Workfront request is approved. Evidence: "With the Adobe Campaign modules, you can start an Adobe Workfront Fusion scenario based on events in your Adobe Campaign v7/v8 account, create, read, or update records, search for records using criteria you set, and perform custom API calls." (https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-campaign-classic-connector)

**Client voice.** How: Workfront Fusion connects Workfront and Adobe Campaign. Automated scenarios create or update records in Campaign when work moves in Workfront, and events in Campaign update the work in Workfront. Gain: Your campaign work in Campaign follows your plan in Workfront, and your teams stop retyping between the two.

### Adobe Campaign + GenStudio for Performance Marketing (`campaign-gspm`)

**Kind:** native. **Label:** GenStudio email experiences imported into Campaign's email designer; Campaign templates exported to GenStudio as HTML.

**How:** A Campaign email template is exported as HTML and uploaded to GenStudio for Performance Marketing, where the team creates on-brand email variations. In Campaign's email designer, marketers browse the GenStudio experiences and import one into a delivery for personalization and sending. Source: https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/genstudio

**Gain:** GenStudio email variations, sent from Campaign. Your client's content team produces on-brand email variations in GenStudio, and the Campaign team picks them up in the email designer without a file hand-off.

**Flows:** Adobe Campaign to GenStudio for Performance Marketing: An email template exported as HTML from the email designer. GenStudio for Performance Marketing to Adobe Campaign: Email experiences, browsed and imported into the email designer by product, persona or brand.

**Availability:** Adobe says the capability is available for the email channel only. Adobe: "This capability is available for the email channel only." Statement of work wording: Email channel only.

**Prerequisites:**

- GenStudio for Performance Marketing, and Campaign's Web interface with its email designer. Adobe: "On the Email Designer home page, select Import HTML and click the Adobe GenStudio for Performance Marketing button."
- Email only; other Campaign channels are not covered. Adobe: "This capability is available for the email channel only."
- Email variations built in GenStudio from a Campaign template, so they open in the email designer and not in compatibility mode. Adobe: "GenStudio experiences created without a Adobe Campaign template are imported into compatibility mode."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM12 | GenStudio email experiences in Campaign | one-time | 16 | 24 | 48 | yes |  |

- **XM12 GenStudio email experiences in Campaign.** Export your client's Campaign email template to GenStudio for Performance Marketing as an HTML template, agree how variations are named and saved, and import the finished experiences into Campaign deliveries for personalization and sending. Evidence: "On the Email Designer home page, select Import HTML and click the Adobe GenStudio for Performance Marketing button." (https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/genstudio)

**Client voice.** How: Your Campaign email template is shared with GenStudio for Performance Marketing, where your team creates on-brand variations. Your marketers then browse those variations inside Campaign's email designer and bring one into an email to personalize and send. Gain: Your content team produces on-brand email variations, and your Campaign team uses them without a file hand-off.

### Adobe Campaign + Coworker (`campaign-cw`)

**Kind:** native. **Label:** Coworker Chat finds, creates and updates Campaign deliveries, and inspects, validates and troubleshoots workflows.

**How:** Coworker Chat works on Campaign v8 from a prompt: it finds and inspects deliveries, campaigns and workflows, creates and updates deliveries from templates, prepares a delivery without sending it, manages assets, validates and troubleshoots workflows, and explores or extends the data model. It can also save approved email content back to Campaign. Source: https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows

**Gain:** Campaign work by asking. Your client's team finds a delivery, checks why a workflow failed or drafts a delivery from a template by describing it, which shortens routine work in a product with a steep learning curve.

**Flows:** Coworker to Adobe Campaign: Deliveries created or updated, workflow commands, uploaded assets and schema changes, made on the user's behalf. Adobe Campaign to Coworker: Deliveries, campaigns, workflows, their logs and health, and the data model, read to answer a prompt.

**Availability:** Adobe's Coworker Chat workflows page has a Campaign v8 section. Adobe's two lists of the applications Coworker Chat works with do not name Campaign. Adobe: "Use Coworker Chat to find and update deliveries, manage assets, explore the data model, and inspect, validate, and troubleshoot workflows in Adobe Campaign v8." Statement of work wording: Adobe confirms that Coworker Chat works with Campaign v8 in the Client's organization before this service starts.

**Prerequisites:**

- Adobe's Workfront documentation says Coworker in Workfront is not currently available to health care and finance organizations; Adobe states no such limit for this connection, so confirm eligibility with Adobe for your client. Adobe: "Coworker is not currently available to organizations in health care, finance, or some other industries with sensitive data." Statement of work condition: Adobe confirms that Coworker is available to the Client's organization before this service starts.
- Coworker Chat working with Campaign v8 in your client's organization, which Adobe's lists of compatible applications do not name. Adobe: "The following CX Enterprise applications are compatible with Coworker Chat:" Statement of work condition: Adobe confirms that Coworker Chat works with the Client's Campaign v8 environment before this service starts.
- A CX Enterprise Coworker license, with Coworker configured for the environment by Adobe's onboarding team. Adobe: "Onboarding: Adobe's enterprise support or professional services team configures Coworker for your environment, sets up integrations with your Adobe applications, and defines governance and approval workflows."
- Roles and access to Coworker assigned to the team in the Admin Console. Adobe: "Access: Assign roles and access to Coworker features for your teams in the Admin Console."
- A named reviewer for prompts that start workflows or change the data model, because those skills act on the live environment. Adobe: "Drive a workflow through a lifecycle command (start, pause, stop, resume, or wakeup), and reconfigure a delivery activity inside a workflow"

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM13 | Coworker prompts for Campaign deliveries and workflows | one-time | 16 | 24 | 40 | yes |  |

- **XM13 Coworker prompts for Campaign deliveries and workflows.** Write and test the prompts your client's team uses most, such as finding and updating deliveries, preparing a delivery without sending it, and validating and troubleshooting workflows, and agree which actions need a person's review first. Evidence: "Use Coworker Chat to find and update deliveries, manage assets, explore the data model, and inspect, validate, and troubleshoot workflows in Adobe Campaign v8." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows)

**Client voice.** How: Your team asks Coworker Chat to work in Adobe Campaign: find and update deliveries, draft a delivery from a template, prepare it without sending, and check or troubleshoot workflows. Adobe confirms that Coworker Chat works with your Campaign environment before this service starts. Gain: Your team gets routine Campaign work done by describing it, and finds the cause of a failed workflow faster.

### Adobe Campaign + Adobe Advertising (`campaign-advertising`)

**Kind:** extension. **Label:** A Campaign workflow sends an email list to Search, Social, & Commerce, which builds a Google Ads customer match audience.

**How:** A workflow in Campaign extracts an email list and sends it by SFTP to Advertising Search, Social, & Commerce, which creates a Google Ads customer match audience from it and keeps the audience updated each day. Source: https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/campaign-management/management/campaigns/audiences-and-targets/audiences/google-audience-from-campaign-email-list

**Gain:** Email lists as Google Ads audiences. Your client targets or excludes its known customers in Google Ads campaigns from the lists it already keeps in Campaign, refreshed daily without manual uploads.

**Flows:** Adobe Campaign to Adobe Advertising: An email list extracted by a scheduled workflow and transferred by SFTP, with later additions and removals.

**Availability:** Adobe limits it to Google Ads accounts that are eligible for customer match, and says instructions may vary by Campaign version. Adobe: "Google Ads accounts that are eligible for customer match only" Statement of work wording: For Google Ads accounts that are eligible for customer match; Adobe supplies the workflow package for the Client's Campaign version before this service starts.

**Prerequisites:**

- A Google Ads account that is eligible for customer match. Adobe: "Google Ads accounts that are eligible for customer match only"
- The workflow package for your client's Campaign version, supplied by the Adobe account team. Adobe: "To do so, you need access to your Campaign instance and an XML file containing the required workflow, which your Adobe Account Team will give you." Statement of work condition: Adobe supplies the workflow package for the Client's Campaign version before this service starts.
- Credentials for an SFTP account provided by Search, Social, & Commerce. Adobe: "Obtain credentials for an Advertising Search, Social, & Commerce-provided SFTP account."
- Google's customer match rules and limits met for the list, as Google documents them. Adobe: "See Google Ads documentation on how customer match works and limitations."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM14 | Google Ads customer match audience from a Campaign list | one-time | 16 | 24 | 48 | yes | Search, Social, & Commerce |

- **XM14 Google Ads customer match audience from a Campaign list.** Create the SFTP external account in Campaign, install the workflow package from Adobe's account team, set the query filters, audience name and schedule, and check the audience reaches Google Ads through Search, Social, & Commerce. Evidence: "You can create a Google Ads customer match audience from an email list within Adobe Campaign by setting up an account link and a workflow in Campaign." (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/campaign-management/management/campaigns/audiences-and-targets/audiences/google-audience-from-campaign-email-list)

**Client voice.** How: A scheduled workflow in Adobe Campaign sends your chosen email list to Adobe Advertising, which creates a customer match audience in Google Ads from it and keeps it updated each day. Gain: You target or exclude your known customers in Google Ads from the lists you already keep in Campaign, without manual uploads.

### Adobe Campaign + Audience Manager (`campaign-aam`)

**Kind:** native. **Label:** Shared audiences imported into Campaign as lists, and Campaign lists exported as shared audiences.

**How:** Campaign imports shared audiences from Audience Manager or Experience Cloud Audiences as lists, and exports its own lists as shared audiences from a workflow activity. Recipients are matched by visitor ID or by a declared ID. Adobe documents the setup in the Campaign Classic v7 guide, which the Campaign v8 page points to. Source: https://experienceleague.adobe.com/en/docs/campaign-classic/using/integrating-with-adobe-experience-cloud/audience-sharing/sharing-audiences-with-adobe-experience-cloud

**Gain:** Web audiences in Campaign, and Campaign lists on the web. Your client sends to audiences defined by site behavior in Audience Manager, and makes Campaign lists available to the other Experience Cloud products that read shared audiences.

**Flows:** Audience Manager to Adobe Campaign: Shared audiences and segments, imported into Campaign as lists. Adobe Campaign to Audience Manager: Lists exported as shared audiences by the Update shared audience activity of a workflow.

**Availability:** Not stated for Campaign v8. The Campaign v8 page sends readers to the Campaign Classic v7 guide for audience sharing, and Adobe provisions the integration on request. Adobe: "Learn more about Audience sharing between Campaign and Experience Cloud solutions in Campaign Classic v7 documentation." Statement of work wording: Adobe confirms that audience sharing with Audience Manager is supported for the Client's Campaign v8 environment and provisions it before this service starts.

**Prerequisites:**

- Audience sharing with Audience Manager supported and provisioned by Adobe for your client's Campaign v8 environment. Adobe: "Once you have submitted this request, Adobe will proceed to the provisioning of the integration for you and contact you to provide details and information that you have to finalize the configuration:" Statement of work condition: Adobe confirms that audience sharing with Audience Manager is supported for the Client's Campaign v8 environment, and provisions it, before this service starts.
- Adobe's identity system in use, which audience sharing requires. Adobe: "To share audiences with Adobe Experience Cloud solutions, you need to implement Adobe Identity Management System."
- Import and export external accounts on Amazon S3, in place of the older FTP addresses. Adobe: "you need to adapt your implementation accordingly and move to Amazon Simple Storage Service (S3) connector to import or export data."
- The visitor ID service on your client's site, or a declared ID that matches a Campaign reconciliation key. Adobe: "Declared ID: this type of identifier reconciles all types of data with elements from the Adobe Campaign database."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM15 | Shared audiences between Campaign and Audience Manager | one-time | 24 | 40 | 72 | optional |  |

- **XM15 Shared audiences between Campaign and Audience Manager.** With the integration provisioned by Adobe, configure the import and export external accounts, the data source and the visitor ID service, then import the agreed shared audiences as Campaign lists and export Campaign lists as shared audiences from a workflow. Evidence: "Import shared audiences/segments from different Adobe Experience Cloud solutions into Adobe Campaign." (https://experienceleague.adobe.com/en/docs/campaign-classic/using/integrating-with-adobe-experience-cloud/audience-sharing/sharing-audiences-with-adobe-experience-cloud)

**Client voice.** How: Audiences from Audience Manager arrive in Adobe Campaign as lists you can send to, and lists from Campaign are shared back as audiences your other Adobe products can use. Adobe confirms that this is supported for your Campaign environment before this service starts. Gain: You send to audiences defined by what people do on your site, and your Campaign lists reach your other channels.

### Adobe Advertising + Adobe Analytics (`advertising-aa`)

**Kind:** native. **Label:** Analytics for Advertising: ad click-throughs and view-throughs tracked in Analytics, and Analytics events and segments used for bidding and remarketing.

**How:** Analytics for Advertising ties the two products together. Click-through and view-through visits from ads are tracked in an Adobe Analytics report suite with Adobe Advertising's dimensions, metrics and cost. In the other direction, Analytics success events become conversion metrics for bidding, and Analytics segments become remarketing audiences in DSP, Creative and search. Source: https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview

**Gain:** Paid media and site behavior in one report. Your client's analysts see what ad spend did on the site in Analysis Workspace, and the media team bids on the same conversion events the business already measures, without extra pixels.

**Flows:** Adobe Advertising to Adobe Analytics: Click-through and view-through IDs on site visits, with campaign names down to placement and ad, and clicks, impressions and cost. Adobe Analytics to Adobe Advertising: Standard and custom success events as conversion metrics, and published segments for remarketing.

**Availability:** Not stated by Adobe. Adobe says its Adobe Advertising implementation team sets up the integration. Adobe: "The Adobe Advertising implementation team sets up the integration."

**Prerequisites:**

- The integration set up by Adobe's implementation team, started through the Adobe account team. Adobe: "Contact your Adobe Account Team, who will complete the initial configuration necessary to begin and will help you plan your implementation and data usage based on your organization's needs." Statement of work condition: Adobe sets up Analytics for Advertising for the Client's accounts before this service starts.
- The report suite ID and the organization ID given to Adobe's implementation team. Adobe: "The Analytics report suite ID to use for reporting on paid media activity and for feeding site activity for optimization and reporting in Adobe Advertising"
- Experience Platform Web SDK or the visitor ID service, with Analytics data collection, on your client's site. Adobe: "Adobe Experience Platform Web SDK: alloy.js"
- For DSP view-through visits: the DSP JavaScript snippet on the site's pages. Adobe: "(Advertising DSP customers) An Advertising DSP JavaScript snippet deployed in your webpages to track view-through visits."
- For Analytics segments: the Experience Cloud ID Service enabled on the advertiser account. Adobe: "To access the Analytics segments, an advertiser account must enable the Experience Cloud ID Service."
- Standard and custom events only for bidding; calculated metrics cannot be mapped. Adobe: "You can't map calculated metrics from Analytics into Adobe Advertising."
- A site without server-side forwarding of Analytics where view-through tracking is wanted. Adobe: "View-through tracking isn't supported for advertisers using a server-side forwarding implementation of Analytics."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM16 | Analytics for Advertising tracking setup | one-time | 24 | 40 | 72 | yes |  |
| XM17 | Paid media reports in Analysis Workspace | one-time | 16 | 32 | 56 | yes |  |
| XM18 | Analytics events and segments for bidding and remarketing | one-time | 16 | 32 | 56 | optional |  |

- **XM16 Analytics for Advertising tracking setup.** With Adobe's implementation team, agree the report suite and the attribution lookback windows, deploy the Analytics for Advertising JavaScript and the DSP view-through snippet through tags, and check that click-through and view-through IDs reach Analytics. Evidence: "The integration allows advertisers to track click-through and view-through site interactions in their Analytics instances, allowing brands to see how their advertising spend leads to site engagement and critical business objectives." (https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview)
- **XM17 Paid media reports in Analysis Workspace.** Build Analysis Workspace projects on the Adobe Advertising dimensions and metrics, such as site entry by campaign, placement and ad with clicks, impressions and cost, and set Marketing Channels rules so paid traffic is classified once. Evidence: "You can access paid media dimensional and event data, which include Adobe Advertising campaign entity names (down to placements and ads) and their associated metrics, such as clicks, impressions, and cost." (https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview)
- **XM18 Analytics events and segments for bidding and remarketing.** Choose the Analytics success events that become conversion metrics and weighted objectives in Adobe Advertising, publish the Analytics segments used for remarketing, and check both arrive and are in use. Evidence: "You can use your standard events and custom events from Analytics to build weighted objectives in Adobe Advertising." (https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview)

**Client voice.** How: Visits that come from your ads are tracked in Adobe Analytics with the campaign, placement and ad behind them and their cost. Your Analytics success events feed bidding in Adobe Advertising, and your Analytics segments become remarketing audiences. Gain: Your analysts see what ad spend did on your site in one report, and your media team bids on the conversion events your business already measures.

### Adobe Advertising + Customer Journey Analytics (`advertising-cja`)

**Kind:** platform. **Label:** Two-way data sharing: Advertising performance in CJA through Experience Platform datasets, and attribution back to Adobe Advertising.

**How:** Adobe Advertising shares data with Customer Journey Analytics in both directions. Where Analytics for Advertising is in place, the same data gains CJA visualizations. Where it is not, Web SDK tracks site events and ad click and view IDs into an Experience Platform dataset, Adobe Advertising adds a summary dataset and a lookup dataset each day, and a CJA connection and data view report on them; attribution data returns to Adobe Advertising for optimization. Source: https://experienceleague.adobe.com/en/docs/advertising/integrations/customer-journey-analytics/overview

**Gain:** Ad performance inside the customer journey. Your client reads campaign, placement and keyword performance beside every other channel in CJA, and attribution from CJA informs bidding, without Adobe Analytics in between.

**Flows:** Adobe Advertising to Customer Journey Analytics: Campaign performance at campaign, ad group, package, placement and keyword level, as daily summary and lookup datasets, with site events carrying ad IDs. Customer Journey Analytics to Adobe Advertising: Attribution data used for optimization and reporting in Adobe Advertising.

**Availability:** Not stated by Adobe. Adobe says its account team completes the first configuration. Adobe: "Contact your Adobe Account Team, who will complete the initial configuration necessary to begin and will help you plan your implementation and data usage based on your organization's needs."

**Prerequisites:**

- The first configuration completed by the Adobe account team, which also validates the tracking. Adobe: "(Advertisers without Analytics for Advertising) Collaboration with your Adobe Account Team, who will complete various tasks during setup." Statement of work condition: Adobe completes the first configuration of the integration for the Client's accounts before this service starts.
- Web SDK and its Tags extension at or above the minimum versions Adobe names on the prerequisites page. Adobe: "Adobe Experience Platform Web SDK Version 2.36 or higher."
- Adobe Tags for deployment: a standalone Web SDK or another tag manager is not supported. Adobe: "Only Adobe Tags are supported. Support isn't available for standalone Experience Platform Web SDK (alloy.js) or third-party tag managers."
- Experience Platform schemas, datasets and a datastream, with an administrator who can create them. Adobe: "These technologies require support from your Experience Platform site administrator."
- A CJA administrator for the connection and a web analyst for the data view and reports. Adobe: "You'll need support from your internal web analyst to set up a connection to your dataset and configure reporting."
- Reporting from the launch date only, because no historical data is included. Adobe: "Data transfer and attribution begin after the launch; no historical data is included."
- Where Analytics for Advertising is already in place: none of the Web SDK setup tasks. Adobe: "These tasks aren't necessary for advertisers with Analytics for Advertising."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM19 | Web SDK data collection for Adobe Advertising | one-time | 32 | 56 | 96 | yes |  |
| XM20 | Advertising datasets, data view and reports in CJA | one-time | 24 | 40 | 72 | yes |  |

- **XM19 Web SDK data collection for Adobe Advertising.** Add the Adobe Advertising field group to the event schema, create the dataset and the datastream with the Adobe Advertising service, make the custom Web SDK build with the Advertising component in Adobe Tags, and validate the three datasets with Adobe's account team. Evidence: "Use the Adobe Experience Platform Web SDK extension in Adobe Tags to send your organization's website data to your Experience Platform datastream." (https://experienceleague.adobe.com/en/docs/advertising/integrations/customer-journey-analytics/set-up)
- **XM20 Advertising datasets, data view and reports in CJA.** Add the event, summary and lookup datasets to a CJA connection, set up the data view with the Adobe Advertising dimensions and metrics, and build the paid media reports your client's team reads in Workspace. Evidence: "Based on your event dataset, Adobe Advertising creates two additional datasets: 1) a summary dataset with the related summary data (such as aggregated clicks and aggregated impressions) and 2) a lookup dataset (with dimensions/classification metadata, such as Adobe Advertising campaign name)." (https://experienceleague.adobe.com/en/docs/advertising/integrations/customer-journey-analytics/set-up)

**Client voice.** How: Your Adobe Advertising campaigns report into Customer Journey Analytics. Your site events carry the ad that brought each visit, daily performance and cost data arrive as datasets, and attribution from CJA returns to Adobe Advertising to guide bidding. Gain: You read ad performance beside every other channel in the customer journey, and your bidding follows the outcomes you measure in CJA.

### Adobe Advertising + Real-Time CDP (`advertising-rtcdp`)

**Kind:** platform. **Label:** Adobe Advertising DSP destination shares Real-Time CDP audiences with a DSP account, as universal IDs, cookies or mobile ad IDs.

**How:** Real-Time CDP shares first-party audiences with an Advertising DSP account or advertiser through the Adobe Advertising DSP destination. Hashed emails are converted to universal IDs for targeting without cookies; ECIDs, Adobe Advertising cookies and mobile ad IDs are shared as they are. Source: https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/advertising/adobe-advertising-dsp-connection

**Gain:** CDP audiences in programmatic buying. Your client targets and suppresses ads with the same audiences it uses in every other channel, on browsers with and without cookies, with no audience rebuilt by hand in DSP.

**Flows:** Real-Time CDP to Adobe Advertising: Audiences with hashed email, ECID and Adobe Advertising cookie, or mobile ad IDs, received by a Real-Time CDP source in DSP.

**Availability:** Not stated by Adobe. Adobe's account team creates the Real-Time CDP source in DSP and shares its key. Adobe: "A Real-Time CDP source in DSP to receive audiences for campaign activation. Your Adobe Account Team will create the source using your organization ID."

**Prerequisites:**

- A Real-Time CDP source in DSP, created by the Adobe account team from your client's organization ID. Adobe: "A Real-Time CDP source in DSP to receive audiences for campaign activation. Your Adobe Account Team will create the source using your organization ID." Statement of work condition: Adobe creates the Real-Time CDP source in the Client's DSP account and shares its source key before this service starts.
- The source key for the DSP account or advertiser, shared by Adobe's DSP account team. Adobe: "Your DSP account team will share this key with you."
- For RampID: audience sharing settings switched on in DSP by the Adobe account team. Adobe: "Your Adobe Account Team will perform this configuration."
- For RampID and UID2.0: profiles that hold hashed email addresses. Adobe: "For RampID and UID2.0, profiles must contain hashed email IDs."
- For cookies: third-party ID syncing set up through Web SDK datastreams or the visitor ID service. Adobe: "ID syncing is a prerequisite to share third-party cookies."
- The current Adobe Advertising DSP connection card, which takes the place of the earlier card that supports hashed emails only. Adobe: "This connection replaces the Legacy Adobe Advertising DSP connection, which supports only hashed email addresses."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM21 | Real-Time CDP audiences to Advertising DSP | one-time | 16 | 32 | 56 | yes | Advertising DSP |
| XM22 | Universal ID setup for targeting without cookies | one-time | 16 | 24 | 48 | optional | Advertising DSP |

- **XM21 Real-Time CDP audiences to Advertising DSP.** With the source key from Adobe's account team, connect the Adobe Advertising DSP destination, map hashed email, ECID or mobile ad IDs, set up ID syncing for cookies, activate the agreed audiences, and check the segments appear in DSP for placements. Evidence: "The Adobe Advertising Demand-Side Platform (DSP) destination allows users to share both authenticated and unauthenticated first-party audiences with a DSP account or specific advertiser within an account." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/advertising/adobe-advertising-dsp-connection)
- **XM22 Universal ID setup for targeting without cookies.** Where your client targets without cookies, register with the universal ID partner, deploy its code on the site so conversions match to views, and set the audience source in DSP that converts hashed emails to universal IDs. Evidence: "Create an audience source to import audiences to your DSP account or an advertiser account." (https://experienceleague.adobe.com/en/docs/advertising/dsp/audiences/sources/sources-workflows/source-adobe-rtcdp)

**Client voice.** How: Audiences from your Real-Time CDP are shared with your Adobe Advertising DSP account. Hashed email addresses are converted to universal IDs so you can reach people on browsers without cookies; cookie and mobile IDs are shared as they are. Gain: You target and suppress ads with the same audiences you use in your other channels, without rebuilding them in the ad platform.

### Adobe Advertising + Audience Manager (`advertising-aam`)

**Kind:** native. **Label:** Audience Manager segments imported into DSP and Search, Social, & Commerce for targeting; DSP ad exposure sent to Audience Manager by event pixels.

**How:** DSP and Search, Social, & Commerce import Audience Manager segments, with their taxonomy and counts, for use as targets and exclusions in placements, creative experiences and Google Ads audiences. In the other direction, Audience Manager event pixels on DSP ads send impression and click signals to Audience Manager, where they become traits and segments. Source: https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/overview

**Gain:** Audience Manager segments in ad buying, and ad exposure back as a signal. Your client's media team buys against the segments the data team already maintains, and uses who saw which ad for frequency management, retargeting and sequencing.

**Flows:** Audience Manager to Adobe Advertising: Segments with metadata, hierarchy and membership, synced in near real time after the first import. Adobe Advertising to Audience Manager: Impression and click events from DSP ads, sent by event pixels as signals for traits.

**Availability:** Not stated by Adobe. Adobe's account and data operations teams run the import. Adobe: "The Adobe account and data operations teams perform the following steps."

**Prerequisites:**

- The import requested through the Adobe account team, whose data operations team runs it. Adobe: "The Adobe Account Team should submit a request to the data operations team to import the organization's Audience Manager segments using the Advertising DSP native API integration." Statement of work condition: Adobe imports the Client's Audience Manager segments into Adobe Advertising before this service starts.
- The Experience Cloud ID Service on every page of your client's sites, at or above the version Adobe names. Adobe: "The advertiser must implement the Adobe CX Enterprise Identity (ECID) Service version 2.0 or higher."
- One organization ID shared by Audience Manager and the Adobe Advertising account. Adobe: "The ID must be the same as the one used for the organization's Audience Manager account."
- A site audience that is not mostly Safari users, which Adobe lists as a condition. Adobe: "The advertiser's website visitors don't include a high volume of Apple Safari users."
- For exposure data: cookie-based environments only, since the pixels do not capture mobile apps or connected TV. Adobe: "The pixels don't capture events that occur in environments without cookies, such as mobile apps and connected TV (CTV)."
- For exposure data: the added Audience Manager server calls allowed for under your client's Audience Manager contract. Adobe: "However, you pay standard Audience Manager ingestion costs based on server calls, per your Audience Manager contract."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM23 | Audience Manager segments for ad targeting | one-time | 16 | 32 | 56 | yes |  |
| XM24 | DSP exposure data into Audience Manager | one-time | 16 | 32 | 64 | optional | Advertising DSP |

- **XM23 Audience Manager segments for ad targeting.** With Adobe's account team, import your client's Audience Manager segments into DSP or Search, Social, & Commerce, trim the destinations to the segments in use, and attach them to placements, reusable audiences or Google Ads audiences. Evidence: "To access Adobe audiences in DSP or Creative, you must import the audiences into DSP." (https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/import-audiences)
- **XM24 DSP exposure data into Audience Manager.** Add Audience Manager impression and click event pixels with DSP macros to your client's ads and placements, build rule-based traits and segments from the signals, and use them for frequency management and retargeting. Evidence: "Advertising DSP customers with Adobe Audience Manager can use Audience Manager event pixels to capture impression-level data and click-level data from DSP campaigns." (https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/media-data-ingestion/overview)

**Client voice.** How: Your Audience Manager segments are imported into Adobe Advertising, where your media team uses them to target or exclude ads. Impressions and clicks from your display ads flow back to Audience Manager as signals for new segments. Gain: Your media team buys against the segments your data team already maintains, and you use who saw which ad to manage frequency and retargeting.

### Adobe Advertising + Target (`advertising-target`)

**Kind:** native. **Label:** Ad click and exposure signals shared with Target for A/B tests on landing pages, read in Analytics for Target.

**How:** Ad click and exposure signals from Adobe Advertising are shared with Target, so an A/B test activity can show landing page experiences that match the ad a visitor clicked or saw. The test is read in Analysis Workspace with Analytics for Target. Source: https://experienceleague.adobe.com/en/docs/advertising/integrations/target/ab-tests-dsp

**Gain:** Landing pages that continue the ad. Your client tests whether a site experience that matches the ad message lifts conversion, with the ad, the experience and the result in one Analytics report.

**Flows:** Adobe Advertising to Target: Placement keys in click-through URLs, and exposure segments built from ad impressions, used as Target audiences.

**Availability:** Not stated by Adobe. The use case rests on two other integrations, and on Audience Manager for view-through tests. Adobe: "This use case requires the following products and integrations:"

**Prerequisites:**

- Analytics for Advertising and Analytics for Target both in place, so Adobe Analytics is needed. Adobe: "Analytics for Target (A4T) is a cross-solution integration that lets advertisers create Target activities based on Analytics conversion metrics and audience segments and then measure the results using Analytics as the reporting source."
- For view-through tests: Audience Manager, to build the exposure segment from ad impressions. Adobe: "Audience Manager (required for view-through testing only)"
- The placement key for each click-through URL, retrieved by the Adobe account team. Adobe: "Contact your Adobe Account Team to retrieve the required placement key and finalize the setup, and to make sure that each click-through URL is populated with the placement key."
- For DSP ads served through an outside ad server: the tracking macros added to each ad's click-through URL. Adobe: "Within Flashtalking or Google Campaign Manager 360, manually update the click-through URL for each ad to include the macros required to capture AMO ID variables."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM25 | Target A/B tests for ad traffic | one-time | 24 | 40 | 72 | yes |  |

- **XM25 Target A/B tests for ad traffic.** Add the placement key macros to click-through URLs, build the Target audiences from ad click and exposure signals, set up the A/B activity that mirrors the ad message on the landing page, and build the Analytics for Target panel that reads the result. Evidence: "Adobe Advertising and Adobe Target make it even easier for marketers to deliver a personalized and connected experience across paid media and on-site messaging." (https://experienceleague.adobe.com/en/docs/advertising/integrations/target/ab-tests-dsp)

**Client voice.** How: Signals from your ads are shared with Adobe Target, so a visitor who clicked or saw a given ad can be shown a landing page experience that matches it. You read the test in Adobe Analytics. Gain: You learn whether continuing the ad message on your site lifts conversion, with the ad, the experience and the result in one report.

### Adobe Advertising + AEM Assets (`advertising-aemassets`)

**Kind:** native. **Label:** Approved Experience Manager images added to Advertising Creative libraries as standard creatives.

**How:** Advertising Creative adds approved images from an Experience Manager asset library to its Creative Libraries as standard creatives, once the DSP account holds the Experience Manager organization ID. Source: https://experienceleague.adobe.com/en/docs/advertising/creative/home

**Gain:** Approved images in ad creative. Your client's ad team builds creatives from approved DAM images instead of downloads, so ads carry current, rights-cleared artwork.

**Flows:** AEM Assets to Adobe Advertising: Approved image assets, added to a creative library as standard creatives.

**Availability:** Not stated by Adobe. Adobe's account team sets the Experience Manager organization ID on the DSP account. Adobe: "Contact your Adobe Account Team to configure this setting."

**Prerequisites:**

- The Experience Manager organization ID set on the associated DSP account by the Adobe account team. Adobe: "Before you can upload your existing Experience Manager image assets to your Creative Libraries, the advertiser account settings for your associated DSP account must specify the organization ID for the Experience Manager account." Statement of work condition: Adobe sets the Experience Manager organization ID on the Client's DSP account before this service starts.
- Advertising Creative, with a DSP account linked to it. Adobe: "You can now add images from your Adobe Experience Manager asset library to your Creative Libraries so that you can use them within ad experiences."
- Images approved in the Experience Manager library, and a sign-in to it for whoever adds creatives. Adobe: "For approved images in an Experience Manager library connected to your DSP account, do the following:"

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM26 | AEM images in Creative Libraries | one-time | 8 | 16 | 32 | yes | Advertising Creative |

- **XM26 AEM images in Creative Libraries.** Have Adobe's account team set the Experience Manager organization ID on the DSP account, agree which approved image folders your client's creative team uses, and test adding AEM images to a creative library as standard creatives. Evidence: "You can now add images from your Adobe Experience Manager asset library to your Creative Libraries so that you can use them within ad experiences." (https://experienceleague.adobe.com/en/docs/advertising/creative/home)

**Client voice.** How: Approved images from your Experience Manager asset library are added to your creative libraries in Adobe Advertising, where your team uses them in ad experiences. Gain: Your ads are built from approved, current images in your DAM instead of downloaded copies.

### Adobe Advertising + GenStudio for Performance Marketing (`advertising-gspm`)

**Kind:** native. **Label:** GenStudio display ad experiences imported into Advertising Creative libraries as HTML5 creatives.

**How:** Advertising Creative imports display ad experiences from GenStudio for Performance Marketing into a creative library. Each creative variant becomes its own HTML5 creative, which the team groups in bundles and uses in ad experiences. Source: https://experienceleague.adobe.com/en/docs/advertising/creative/home

**Gain:** GenStudio display ads into ad experiences. Display ads your client's team creates in GenStudio reach Advertising Creative without export and upload, ready for targeting by audience.

**Flows:** GenStudio for Performance Marketing to Adobe Advertising: Display ad experiences, each variant imported as a separate HTML5 creative.

**Availability:** Not stated by Adobe. Adobe says advertisers with GenStudio for Performance Marketing can import display ad experiences. Adobe: "Advertisers with Adobe GenStudio for Performance Marketing can now import display ad experiences from GenStudio to your creative libraries."

**Prerequisites:**

- GenStudio for Performance Marketing and Advertising Creative, with a GenStudio sign-in for whoever imports. Adobe: "Advertisers with Adobe GenStudio for Performance Marketing can now import display ad experiences from GenStudio to your creative libraries."
- Display ad experiences only. Adobe: "Standard display creatives include image and HTML5 creatives, including creatives imported from Adobe Experience Manager and Adobe GenStudio for Performance Marketing."
- Click URLs and settings entered per creative after import, because each variant arrives as a separate creative. Adobe: "Each creative variant in an imported experience is imported as a separate HTML5 creative."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM27 | GenStudio display ads in Creative Libraries | one-time | 8 | 16 | 32 | yes | Advertising Creative |

- **XM27 GenStudio display ads in Creative Libraries.** Import your client's GenStudio display ad experiences into a creative library, set the click URLs and tracking for each creative, group them in bundles, and attach the bundles to ad experiences. Evidence: "Advertisers with Adobe GenStudio for Performance Marketing can now import display ad experiences from GenStudio to your creative libraries." (https://experienceleague.adobe.com/en/docs/advertising/creative/home)

**Client voice.** How: Display ads your team creates in GenStudio for Performance Marketing are imported into your creative libraries in Adobe Advertising, where each variant can be used in an ad experience. Gain: Your display ads go from creation to ad buying without export and upload.

### Marketo Measure + Marketo Engage (`mmeasure-marketo`)

**Kind:** native. **Label:** Direct API connection: Marketo people, program memberships and activities become touchpoints in Marketo Measure.

**How:** Marketo Measure connects to a Marketo Engage instance through its REST API. It downloads Marketo people and ties them to tracked web sessions, and it turns program memberships and chosen activities into touchpoints by rules, with program costs and channels carried over. Source: https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-marketo/marketo-measure-integrations-with-marketo/marketo-engage-programs-integration

**Gain:** Marketo programs in the attribution picture. Email, nurture and event programs that the website script never sees get credit beside paid and web channels, and people still held in Marketo are attributed before they reach the CRM.

**Flows:** Marketo Engage to Marketo Measure: People, program memberships, selected activities and program period costs, read through the Marketo API.

**Availability:** Adobe's programs page says: all tiers. It does not apply to Marketo Measure Ultimate, which has no direct Marketo Engage connection. Adobe: "Any paid Marketo Measure subscription" Statement of work wording: For Marketo Measure Tiers 1 to 3; Marketo Measure Ultimate takes Marketo Engage data through Experience Platform.

**Prerequisites:**

- Marketo Measure Tiers 1 to 3; Ultimate has no direct Marketo Engage connection. Adobe: "The direct CRM and Marketo Engage connections are no longer available for Ultimate."
- An API-only user role and a custom service in Marketo Engage for the connection. Adobe: "Create an API Only User role for the Marketo Measure/Marketo Engage connection."
- A production Marketo Engage instance and a production Salesforce or Microsoft Dynamics instance. Adobe: "Production Salesforce or Microsoft Dynamics instance"
- Marketo people sync and Marketo programs switched on in Marketo Measure settings. Adobe: "Marketo People Sync Enabled (Marketo Measure Settings)"
- The CRM lead and contact IDs on each Marketo person, so duplicates are detected. Adobe: "In order for us to detect these duplicates, make sure your Marketo-Salesforce or Marketo-Dynamics sync is populating the Lead and Contact Ids on the Marketo Person."
- One period cost entry per month on each Marketo program. Adobe: "Marketo Measure supports only one Period Cost entry per month."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM28 | Marketo Engage connection and people sync | one-time | 8 | 16 | 32 | yes |  |
| XM29 | Touchpoints from Marketo programs and activities | one-time | 16 | 32 | 56 | yes |  |

- **XM28 Marketo Engage connection and people sync.** Create the API-only user and custom service in Marketo Engage, connect it in Marketo Measure, switch on people sync, and check that Marketo people map to tracked web sessions without duplicates against the CRM. Evidence: "The Marketo people integration allows Marketo Measure to start downloading people from Marketo and begin to tie their tracked sessions to the individual and map touchpoints to their engagements." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-marketo/marketo-measure-integrations-with-marketo/marketo-engage-people-integration)
- **XM29 Touchpoints from Marketo programs and activities.** Write the program rules and activity rules that decide which memberships and activities become touchpoints, set the touchpoint date for each, map Marketo program channels to your client's Marketo Measure channels, and test against real programs. Evidence: "Through the Marketo Measure integration with Marketo Engage Programs, our customers can begin to create touchpoints for attribution tracking from the Marketo Program Memberships." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-marketo/marketo-measure-integrations-with-marketo/marketo-engage-programs-integration)

**Client voice.** How: Marketo Measure connects to your Marketo Engage instance. It reads your people, program memberships and chosen activities, and turns them into touchpoints by rules we agree with you, with program costs and channels carried over. Gain: Your email, nurture and event programs get credit beside your paid and web channels, and people still in Marketo are attributed before they reach your CRM.

### Marketo Measure + Real-Time CDP (`mmeasure-rtcdp`)

**Kind:** platform. **Label:** Marketo Measure destination exports B2B datasets from Experience Platform to Marketo Measure Ultimate.

**How:** Marketo Measure Ultimate takes its B2B data from Experience Platform: accounts, opportunities, contacts, leads, campaigns, campaign members and activities are ingested from the CRM and marketing automation sources into B2B datasets, and the Marketo Measure destination exports those datasets to Marketo Measure. Adobe describes it as an integration with Real-Time CDP B2B or B2P Edition. Source: https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/marketo-measure-ultimate

**Gain:** Attribution on the same B2B data as the CDP. Your client attributes revenue across more than one CRM or marketing automation system, and across sources beyond Salesforce and Dynamics, from the same Experience Platform data its Real-Time CDP uses.

**Flows:** Real-Time CDP to Marketo Measure: Datasets on B2B classes (accounts, opportunities, persons, campaigns, campaign members, activities), one per class for each source.

**Availability:** Adobe says the destination card is only available to Marketo Measure Ultimate customers. Adobe: "The destination card is only available to Marketo Measure Ultimate customers." Statement of work wording: For Marketo Measure Ultimate only.

**Prerequisites:**

- Marketo Measure Ultimate, set up as a new implementation because Adobe gives no migration path from the tiers. Adobe: "There is no migration path for existing Tier 1/2/3 users."
- An Experience Platform sandbox mapped in Marketo Measure settings first, a choice that cannot be changed in the application later. Adobe: "Once the sandbox-mapping selection is saved, you cannot change it in the application."
- Datasets on B2B classes only, one dataset per class for each source, each in one dataflow. Adobe: "You can include each dataset in only one dataflow to the Marketo Measure destination."
- Account keys in the format Marketo Measure requires; the default Marketo Engage source mapping has to be changed first. Adobe: "Before you export Marketo Engage data to Marketo Measure, update your Marketo Engage source mapping to remove the .mkto_org suffix."
- Every stage mapped by hand for each dataset, because stages are not imported from the data. Adobe: "We don't automatically import stages from user data, so all stages must be mapped manually."
- Reporting from the data warehouse or Discover, since Ultimate writes nothing back to the CRM. Adobe: "Ultimate does not push data back to the CRM."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM30 | B2B schemas and dataflows for Marketo Measure Ultimate | one-time | 40 | 72 | 128 | yes | Marketo Measure Ultimate |
| XM31 | Marketo Measure destination and stage mapping | one-time | 24 | 40 | 72 | yes | Marketo Measure Ultimate |

- **XM30 B2B schemas and dataflows for Marketo Measure Ultimate.** Create the B2B schemas, bring accounts, opportunities, contacts, leads, campaigns and activities from your client's CRM and marketing automation sources into Experience Platform datasets, and check each record against Marketo Measure's data requirements. Evidence: "Marketers are expected to bring their B2B data (for example, Account, Opportunity, Contact, Lead, Campaign, Campaign Member, Activity) through AEP." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview)
- **XM31 Marketo Measure destination and stage mapping.** Map the Experience Platform sandbox in Marketo Measure, connect the Marketo Measure destination, activate one dataset per dataflow, correct the key formats that Marketo Measure rejects, and map stages, campaign member rules and activity rules for each dataset. Evidence: "Use the Marketo Measure destination to export business-to-business (B2B) data from Adobe Experience Platform to Marketo Measure." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/marketo-measure-ultimate)

**Client voice.** How: Your B2B data, such as accounts, opportunities, contacts, leads and campaigns, is brought into Experience Platform from your CRM and marketing systems and exported to Marketo Measure Ultimate, which attributes revenue across them. Gain: You attribute revenue across more than one CRM or marketing system, on the same data your Real-Time CDP uses.

### Marketo Measure + Adobe Analytics (`mmeasure-aa`)

**Kind:** native. **Label:** B2B Customer Attributes: Marketo Measure account and revenue attributes on Adobe Analytics visitor profiles.

**How:** Marketo Measure fills an Experience Cloud Customer Attributes source with B2B attributes for known web visitors: account names, attributed revenue by model, deepest funnel stage and open opportunities, plus chosen CRM account fields. Adobe Analytics subscribes to the source, so the attributes can be used in segments and reports. Source: https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics

**Gain:** Account and revenue context on web analytics. Your client's analysts segment site traffic by target account, funnel stage or attributed revenue, and see which content engages the visitors who go on to buy.

**Flows:** Marketo Measure to Adobe Analytics: Account name, attributed revenue by attribution model, deepest funnel stage, open opportunities and selected CRM account attributes, uploaded to a Customer Attributes source.

**Availability:** Adobe says it is available to all customers that use both Adobe Analytics and Marketo Measure. Adobe: "It's available for free to all customers that use Adobe Analytics and Marketo Measure."

**Prerequisites:**

- Active subscriptions to both Marketo Measure and Adobe Analytics. Adobe: "You must have active subscriptions to both Marketo Measure and Adobe Analytics."
- A Customer Attributes source created in the Experience Cloud console, with its alias ID and FTP details. Adobe: "Create a new Customer Attributes Data Source in your Experience Cloud console."
- Room under your client's contractual attribute limit in Adobe Analytics, which each subscribed attribute counts against. Adobe: "The attributes surfaced via this integration count against your contractual attribute limits in Adobe Analytics and Adobe Target."
- The full attribute list agreed before setup, because adding one later means deleting and recreating the connection. Adobe: "Similarly, to add attributes to the integration, you must delete the existing connection and create a new one with the desired attributes added to the configuration."

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XM32 | B2B attributes from Marketo Measure in Adobe Analytics | one-time | 16 | 24 | 48 | yes |  |

- **XM32 B2B attributes from Marketo Measure in Adobe Analytics.** Create the Customer Attributes source, connect it in Marketo Measure with the account attributes to share, validate the schema with readable names, subscribe Adobe Analytics, and build your client's first account-based segments and reports. Evidence: "The B2B Customer Attributes integration enables mutual users of Marketo Measure and Adobe Analytics to enrich their Adobe Analytics user profiles with valuable metadata derived from the Marketo Measure attribution engine and through its sync capability with CRMs (Microsoft Dynamics and Salesforce)." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics)

**Client voice.** How: Marketo Measure shares account names, attributed revenue, funnel stage and open opportunities for your known web visitors with Adobe Analytics, where they can be used in segments and reports. Gain: Your analysts segment site traffic by target account, funnel stage or revenue, and see which content engages the visitors who go on to buy.

## Not connections

- **mmeasure-target.** No setup of its own. The Customer Attributes source that Marketo Measure fills for Adobe Analytics can also be subscribed to by Target, and Adobe's page names Target only as a second subscription choice, with no steps or use case. It is a note on mmeasure-aa, not a connection. Adobe: "You can configure Subscriptions for Adobe Analytics or Adobe Target." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics)
- **mmeasure-advertising.** Not documented. Marketo Measure's ad platform connections are to outside ad networks; Adobe Advertising is not one of them, and the Adobe Advertising guides do not name Marketo Measure. The ad platform work sits on the product as MZ04. Adobe: "Marketo Measure has API connections with Google AdWords, Microsoft BingAds, Facebook Ads and DoubleClick Campaign Manager." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/api-connections/utilizing-marketo-measures-api-connections/integrated-ad-platforms)
- **advertising-marketo.** A bullet only. Marketo Engage's overview says static lists sent to Experience Cloud can be used in Adobe Advertising Cloud, the product's earlier name, with no setup steps for Advertising on either side. Adobe: "This integration includes: Adobe Analytics, Adobe Target, Adobe Experience Manager, Adobe Audience Manager and Adobe Advertising Cloud." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/adobe-experience-cloud-integrations-overview)
- **advertising-commerce.** Not a connection. The word Commerce in Search, Social, & Commerce means commerce ad campaigns such as shopping ads. No Adobe page describes an integration with the Adobe Commerce product. Adobe: "Advertising Search, Social, & Commerce for search, shopping, social, audience network, and performance max channels" (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/intro/about)
- **advertising with ajo, workfront, aemsites, eds, aemforms, bc, cw, bv, so, mmm, collab, ajob2b, xa, ca, express, creativecloud, frameio, planning, fireflycp, fireflycm, brandintel, mmeasure.** Not documented. Adobe's DSP overview names five products it integrates with, and the Advertising integrations guide has chapters for Analytics, Audience Manager, Target and Customer Journey Analytics only. Experience Manager images and GenStudio display ads are documented in the Creative guide. This morning's map-level pass searched the four Advertising tables of contents and each of the other products' guides and found nothing more; nothing new was found here. Adobe: "Integrations with Adobe Analytics, Adobe Customer Journey Analytics, Adobe Audience Manager, Adobe Target, and Adobe Experience Platform" (https://experienceleague.adobe.com/en/docs/advertising/dsp/introduction/dsp-about)
- **campaign with cja, commerce, marketo, bc, eds, so, bv, mmm, collab, ajob2b, xa, ca, express, creativecloud, frameio, planning, fireflycp, fireflycm, brandintel, mmeasure.** Not documented. Campaign v8's own list of Adobe products it connects with has seven names, and the Campaign Web guide adds Experience Manager as a Cloud Service and GenStudio for Performance Marketing. Campaign's delivery and tracking logs can reach Customer Journey Analytics only by way of Experience Platform datasets (the campaign-rtcdp connection); no page sets up Campaign with Customer Journey Analytics by name. Adobe: "Campaign v8 can connect with the following Adobe solutions." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/integration)
- **campaign-aemforms.** A word, not a connection. Campaign's Experience Manager page says the integration manages email content as well as forms in Experience Manager, but its steps cover email pages and assets only, and no AEM Forms page names Campaign. Adobe: "Integration between Adobe Campaign and Adobe Experience Manager allows you to manage the content of your email deliveries as well as your forms directly in Adobe Experience Manager." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aem)
- **mmeasure with cja, ajo, ajob2b, workfront, aemsites, aemassets, aemforms, eds, commerce, bc, cw, bv, so, mmm, collab, xa, ca, gspm, campaign, aam and the creative products.** Not documented. The Marketo Measure guide's Adobe chapter covers Adobe Analytics, the tags extension for the tracking script and the Experience Cloud interface; its Marketo chapter covers Marketo Engage; the Ultimate chapter covers Experience Platform. This morning's map-level pass searched the other products' guides for Marketo Measure and Bizible and found nothing. Adobe: "Marketo Measure Integrations with Adobe Analytics" (https://experienceleague.adobe.com/en/toc/marketo-measure-help)

## Left out, and why

- **Brand Visibility with Adobe Analytics, and any line that feeds Adobe Analytics data to Brand Visibility.** Adam, Nov 10 2026: Brand Visibility is not pitched with Adobe Analytics; it connects with Customer Journey Analytics. None of the three Adobe Analytics connections in this file (campaign-aa, advertising-aa, mmeasure-aa) touches Brand Visibility, and none of the three products has a documented tie to it. Adobe: "The Adobe Analytics integration connects Adobe Brand Visibility with your organization's Adobe Analytics data so you can measure how AI-driven discovery translates into real website engagement and business outcomes." (https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/adobe-analytics-integration)
- **Campaign Classic v7 as a box or as services of its own.** One box, written for Campaign v8. Adobe calls v8 its strategic platform and says Campaign Classic v7 will reach End of Support. The only line for a client on Classic is CG07, the transition plan. Adobe: "Campaign v8 is Adobe's strategic platform, ideal for organizations needing high-volume campaigns, modern web UI, cloud-native benefits, and long-term support. Campaign Classic v7 will reach End of Support in the coming years." (https://experienceleague.adobe.com/en/docs/campaign-classic/using/getting-started/faq/faq-campaign-classic-v7)
- **The end of core support date for Campaign Classic v7, on any card.** Adam's rule: no dates on what partners or clients read. Adobe's support periods table gives the date (the row reads: version, general availability, end of core support, end of extended support). It is quoted here and in the trail only. Adobe: "Campaign Classic 7 3/31/2017 12/31/2030 N/A" (https://helpx.adobe.com/support/programs/eol-matrix.html)
- **Campaign Standard as a box or as services of its own.** Adobe's pages point Campaign Standard users to Campaign v8 and publish an adoption guide. No end date was found. The only line for a client on Standard is CG07. Adobe: "Adobe Campaign Standard users are now eligible to transition to Adobe Campaign Managed Cloud Services v8." (https://experienceleague.adobe.com/en/docs/campaign-web/v8/start/acs-migration)
- **An automated migration from Campaign Classic v7 to v8.** Adobe says it does not exist today, in forward-looking words. CG07 is written as a manual inventory and plan, and says nothing about a tool. Adobe: "Automated migration from an existing Campaign Classic v7 environment is not yet available." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/v7-to-v8)
- **Journey Optimizer with Campaign Standard.** A separate integration from the Campaign v7/v8 action. Left out with Campaign Standard itself; campaign-ajo covers the v8 action only. Adobe: "You can also set up an integration with Adobe Campaign Standard to send messages in your journeys." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/ajo-integrations)
- **Administration in Campaign's Web user interface.** Adobe describes it in forward-looking words. CG01 to CG04 place administration in the client console, and CG05 teaches which tasks sit where; no card says what the Web interface will gain. Adobe: "Typical administration tasks are not available in this initial version but will be addressed in subsequent versions." (https://experienceleague.adobe.com/en/docs/campaign-web/v8/start/get-started)
- **Surveys, coupons, web tracking and Marketing Resource Management in Campaign.** Not available on the Enterprise (FFDA) deployment of Campaign v8, so no line is written on them for either deployment. Adobe: "Please note that some capabilities are not available in the context of an Enterprise (FFDA) deployment of Campaign, such as:" (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/v7-to-v8)
- **Campaign landing pages that read and update Experience Platform profiles.** Documented, not costed. It is a custom build on Experience Platform APIs with JavaScript in Campaign, better sold as the partner's own service than as a standard line on campaign-rtcdp. Adobe: "Send back updated profile attributes to Adobe Experience Platform to update the corresponding attributes based on what has been filled and submitted in the landing pages." (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aep/ac-aep-landing-pages)
- **ChatGPT conversational ads in Advertising DSP.** Adobe labels the feature Beta in the DSP guide's table of contents and on its pages. No line rests on it. Adobe: "The Conversational Ads Beta > Accounts tab lists the OpenAI accounts for the selected advertiser." (https://experienceleague.adobe.com/en/docs/advertising/dsp/conversational-ads/account-manage)
- **AI Assistant agent features in Advertising DSP (audience builder, troubleshooting, reports by prompt).** Each is marked as a Beta feature. AV03 and AV07 build audiences and reports the standard way. Adobe: "(Beta feature) Generate reusable audiences, which can include any first-party and third-party segments that are available to you, and even other saved audiences." (https://experienceleague.adobe.com/en/docs/advertising/dsp/ai-assistant/ai-assistant-about)
- **The new user interface of Search, Social, & Commerce, as the thing a line is written on.** The guide's table of contents files the new interface, with its portfolio, account and campaign pages, under a Beta heading. AV05 rests on the implementation overview page, which sits outside that heading and describes the work whichever interface is used. Raised for Adam. Adobe: "(Beta) NEW USER INTERFACE" (https://experienceleague.adobe.com/en/toc/advertising-help-search-social-commerce)
- **The earlier Real-Time CDP destination card for Advertising DSP.** Adobe marks the earlier card Legacy and says to use the new one. XM21 uses the current Adobe Advertising DSP connection, and no card uses Adobe's label. Adobe: "The best practice is to use the new Adobe Advertising DSP connection." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/advertising/adobe-advertising-cloud-dsp-connection-legacy)
- **Google Ads customer match audiences from Adobe Analytics and Audience Manager segments.** Documented, not costed as its own line. It is for opted-in advertisers and rides on the Audience Manager import (XM23) or the Analytics segments in XM18; the Campaign email list route is XM14. Adobe: "Opted-in advertisers can create Google Ads customer match audiences using user IDs from a) Analytics segments that are shared with Adobe CX Enterprise and b) Audience Manager segments that have Search, Social, & Commerce as a destination" (https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/campaign-management/management/campaigns/audiences-and-targets/audiences/google-audience-from-adobe-audience)
- **Audience Analytics for Adobe Advertising customers.** It is the integration between Audience Manager and Adobe Analytics, which belongs to the helper researching those two products. Adobe Advertising only adds its data to it. Adobe: "Adobe Advertising customers with Adobe Audience Analytics can send both Adobe Advertising-tracked data and Audience Manager segments to Analytics for enriched insights about site activity." (https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/overview)
- **Cross-domain tracking and view-through attribution in Marketo Measure.** Adobe deprecated both because they rely on third-party cookies. MZ01 and MZ04 do not include them. Adobe: "As a result, Adobe is deprecating Marketo Measure functions which rely on third-party cookies; specifically, Cross-Domain Tracking and View-through Attribution, which use the Google/DoubleClick impression cookie." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-tracking/setting-up-tracking/marketo-measure-cookies)
- **A migration service from Marketo Measure Tiers to Ultimate.** Adobe gives no migration path: Ultimate is a new implementation, with only tracked web data moved by Adobe on request. XM30 and XM31 are written as a new setup, and say so in the prerequisites. Adobe: "There is no migration path for existing Tier 1/2/3 users." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview)
- **Lead-to-account matching and predictive engagement score with Marketo Measure Ultimate.** Not available in Ultimate, so XM30 and XM31 do not promise them. Adobe: "Marketo Measure ABM ML services (Lead-to-Account Matching and Predictive Engagement Score) are not available for Marketo Measure Ultimate." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview)
- **Custom activity types in Marketo Measure Ultimate.** Adobe says they are not supported, in forward-looking words. XM31 maps activities to the available types. Adobe: "Custom activities are not supported yet." (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/implementation-guide)

## Documented, but not costed

- **Campaign's CRM connectors (Salesforce, Microsoft Dynamics), Federated Data Access to outside databases, and the X (Twitter) channel.** Adobe documents all three on the Campaign integrations page. They connect to systems outside Adobe; the tool's outside boxes (`crm`, `dwh`) could carry them later.
- **Campaign REST APIs.** Present in v8 for clients moving from Campaign Standard. A custom integration on them is the partner's own service.
- **Campaign Web's Generate Content and Brands.** Present in the Campaign Web guide; not read for labels or licensing in this pass, so no line.
- **Marketo Measure's tags extension.** The tracking script can be loaded through Experience Platform tags; it is one of the deployment routes inside MZ01, not a line.
- **Marketo Measure with Target.** The Customer Attributes source can be subscribed to by Target as well as Adobe Analytics. One sentence on Adobe's page, no setup; it is a note on `mmeasure-aa`.
- **Analytics for Advertising's Marketing Channels rules, and conversion metrics from eVars and props.** Covered inside XM17 and XM18.
- **Search, Social, & Commerce A/B tests with Target.** The search version of the DSP test in XM25 (click-through only); the same line covers it.
- **Universal IDs from other customer data platforms, and LiveRamp segments sent straight to DSP.** Adobe documents both; they involve products outside the tool.

## What a partner would get wrong

1. **Campaign v8 cannot be installed on the client's own servers.** "For now, Campaign v8 is only available as a Managed Cloud Service, and cannot be deployed on an on-premise or hybrid environments." A client on Campaign Classic on-premise is looking at a move to Adobe's cloud first.
2. **Adobe, not the partner, switches on almost every Campaign connection.** "As a Managed Cloud Services user, contact Adobe to connect Campaign with Adobe Experience Cloud services and solutions." The same holds for Transactional messaging, the Web Analytics add-on, Triggers and Experience Manager. Partner hours start after that.
3. **Built-in packages, schemas and reports are off limits.** "You are not allowed to modify installed built-in packages, built-in schemas, or reports." Extensions, yes; changes to what Adobe ships, no.
4. **The Web interface is for marketers; administration is in the console.** "This new Web user interface primarily serves the needs of business practitioners." A team that expects one interface for everything will be surprised (CG05 covers it).
5. **Journey Optimizer through Campaign is for one-to-one messages only.** "The system caps the number of messages that can be sent over to 4,000 per 5 minutes, based on the current Campaign SLA. For this reason, Journey Optimizer should only be used in unitary use cases (individual events, not audiences)." And a Campaign action cannot follow Read Audience or Audience Qualification.
6. **The Real-Time CDP destination for Campaign has tight defaults.** "You can activate a maximum of 25 audiences to this destination.", 20 fields per audience, activation every three hours at most, Segmentation Service audiences only, and attribute sync only for profiles already in Campaign.
7. **The Adobe Analytics connector does not cover transactional messages, and data arrives a day later.** "Adobe Analytics Connector is not compatible with Transactional messaging (Message Center)." and "This workflow is triggered at 4am every day and it can take 24 hours for the data to be sent to Analytics." Restarting that workflow resends everything.
8. **Target in a Campaign email changes one image.** "The integration only supports static images. The other types of content cannot be personalized."
9. **AEM content in a Campaign email does not update by itself.** "Note that content is not automatically synchronized." And once unlinked: "After unlinking, you cannot refresh content from Adobe Experience Manager or create new variants."
10. **Campaign + Workfront is Workfront Fusion.** There is no built-in link; Fusion is included in some Workfront packages and bought separately with others.
11. **Adobe or its agencies launch Search, Social, & Commerce.** "Adobe or one of its affiliate agencies works with each advertiser to launch its online advertising portfolios and to track any additional ad campaigns." A portfolio also needs a baseline first: "The implementation team then gathers and validates click and revenue data for at least 14 days and validates the portfolio settings."
12. **Adobe's teams set up the Advertising integrations.** "The Adobe Advertising implementation team sets up the integration." (Analytics for Advertising); "The Adobe account and data operations teams perform the following steps." (Audience Manager); "Your Adobe Account Team will create the source using your organization ID." (Real-Time CDP). Each of those cards carries a statement of work condition.
13. **Analytics for Advertising has limits a media team will not expect.** "You can't map calculated metrics from Analytics into Adobe Advertising.", "Analytics conversions are currently tracked and attributed only to a visitor on the same device.", and "View-through tracking isn't supported for advertisers using a server-side forwarding implementation of Analytics."
14. **The native CJA route needs Adobe Tags and starts with no history.** "Only Adobe Tags are supported. Support isn't available for standalone Experience Platform Web SDK (alloy.js) or third-party tag managers." and "Data transfer and attribution begin after the launch; no historical data is included." A client that already has Analytics for Advertising needs none of that setup.
15. **Commerce in Search, Social, & Commerce is not Adobe Commerce.** It means commerce ad campaigns such as shopping ads.
16. **Audience Manager exposure pixels miss apps and connected TV, and add server calls.** "The pixels don't capture events that occur in environments without cookies, such as mobile apps and connected TV (CTV)." and "you pay standard Audience Manager ingestion costs based on server calls, per your Audience Manager contract."
17. **A Marketo Measure connection to Salesforce production is one-way.** "Once your Marketo Measure account is connected to a Salesforce production instance, you cannot move backwards and connect to a sandbox. Also, a Marketo Measure account can only be connected to one Salesforce production instance."
18. **Channel rules lock for a week.** "Once the file is uploaded, you cannot change any of the rules for seven days." A wrong channel upload costs seven days.
19. **Marketo Measure Ultimate is a different product to set up.** No direct CRM or Marketo Engage connection, nothing written back to the CRM ("Ultimate does not push data back to the CRM."), every stage mapped by hand, and "There is no migration path for existing Tier 1/2/3 users." The sandbox choice is permanent: "Once the sandbox-mapping selection is saved, you cannot change it in the application."
20. **Marketo Engage data from the standard Experience Platform source is rejected by Marketo Measure Ultimate until the mapping is changed.** "If you use the Adobe Marketo Engage source to ingest data into Experience Platform, the default mapping for accountKey.sourceKey is not compatible with the Marketo Measure destination." The dataflow still shows success in Experience Platform.
21. **Adding one attribute to the Marketo Measure and Adobe Analytics connection means rebuilding it**, and each attribute counts against the Analytics limit. "Similarly, to add attributes to the integration, you must delete the existing connection and create a new one with the desired attributes added to the configuration."

## Overlaps with lines already in the catalog (flagged, not changed)

- **`campaign-rtcdp` (XM01 to XM03) and Real-Time CDP's own RT02 (sources) and RT04 (audiences and destination activation).** XM01 and XM02 are the Campaign-specific destination and source; where RT04 already counts a destination for Campaign, count one.
- **`advertising-rtcdp` XM21 and the outside connection `ads-rtcdp` (AD3, ad platform destinations).** AD3 covers outside ad platforms; XM21 is Adobe's own DSP. Both can sit on one canvas, each for its own destination.
- **`advertising-cja` (XM19, XM20) and the outside connection `ads-cja` (AD1, AD2).** AD1 brings Google, Meta and other ad network data into CJA through Experience Platform sources; XM19 and XM20 bring Adobe Advertising's own data. A client with both would see the same ad cost twice unless the data view separates them: one for the overlap review.
- **`advertising-cja` and `advertising-aa`.** Adobe says a client with Analytics for Advertising needs none of the Web SDK setup for CJA. A statement of work should carry XM16 or XM19, not both.
- **`advertising-target` XM25 and `target-cja` (TC01, TC02).** XM25 reads the test in Analytics for Target; the catalog's Target lines report in CJA. Different reporting routes for the same activity.
- **`mmeasure-rtcdp` XM30 and `marketo-rtcdp` XB04 (Marketo source connector into Platform) and RT01, RT02.** XM30 builds the same B2B schemas and dataflows. Where XB04 is already in scope, XM30 shrinks to the checks against Marketo Measure's data requirements, including the account key mapping that XB04's default would break.
- **`mmeasure-marketo` and Marketo Engage's own MK02 (CRM sync).** No repeat, but XM28 depends on MK02 having put CRM ids on Marketo people.
- **`campaign-gspm` XM12 beside `ajo-gspm` XG05 and `marketo-gspm` XG06.** Sister lines for three sending products; a client has one of them.
- **Marketo Measure's MZ02 and MZ04 and the outside boxes `crm` and `ads`.** The CRM and ad platform work is on the product, as Marketo Engage's CRM sync is. See "Before merging".

## Open questions for Adam

1. **Adobe Campaign: one box written for v8, with one optional line for clients still on Classic or Standard?** Adobe calls v8 its strategic platform, says Campaign Classic v7 "will reach End of Support in the coming years" (its table says end of core support 12/31/2030), and says Campaign Standard users are "now eligible to transition" to v8. *Recommendation: yes. One box, "Adobe Campaign", every line written for v8, and CG07 (the transition plan) as an optional line. No card mentions support dates.*
2. **Marketo Measure: keep it, as one box?** Adobe's "current" release notes cover 2024 only, though the guide was touched in October 2026 and nothing says the product is ending. There are two editions that are set up differently. *Recommendation: keep it, written for the tiers that connect to Salesforce or Dynamics and Marketo Engage, with Ultimate shown as the Real-Time CDP card. Before it is built, ask the Marketo product team in one line whether Marketo Measure is still being sold to new customers.*
3. **Coworker with Campaign: build the card now, or hold it?** Adobe's workflows page documents ten Coworker workflows for Campaign v8, but neither of Adobe's lists of applications that Coworker Chat works with names Campaign. *Recommendation: hold the card back from the first build and add this to the question already open for the Coworker product team. The card is written and ready, with the condition "Adobe confirms that Coworker Chat works with the Client's Campaign v8 environment before this service starts".*
4. **The two Audience Manager cards: follow the decision on Audience Manager itself?** Advertising + Audience Manager is on current Adobe pages. Campaign + Audience Manager is set up only in the Campaign Classic guide, and Real-Time CDP is the documented route for v8. *Recommendation: if Audience Manager goes in centered on the move to Real-Time CDP, keep Advertising + Audience Manager (many DSP clients still run on those segments) and drop Campaign + Audience Manager, pointing those clients to the Campaign + Real-Time CDP card.*
5. **Adobe Advertising: Adobe's own teams and agencies do much of the setup. Still a box?** Adobe launches Search, Social, & Commerce with each advertiser and switches on each integration; the partner work is tagging, structure, audiences, reports and monthly management, which suits agency-type partners. Its newest interface sits under a label in Adobe's guide. *Recommendation: keep it as one box with the three parts as tags, with DSP, tracking, audiences and monthly management as the starting scope, and with the Analytics, CJA and Real-Time CDP cards as the reason it is on the canvas.*

## Before merging into the canvas

- Connection ids put the new product first (`campaign-rtcdp`, `advertising-aa`, `mmeasure-marketo`). `campaign-advertising` is written once, here. `catalog_map.json` will need `campaign`, `advertising` and `mmeasure` placed, and `aa` and `aam` from the other helper before the five connections to them can be drawn (`campaign-aa`, `campaign-aam`, `advertising-aa`, `advertising-aam`, `mmeasure-aa`).
- Kinds: 14 `native`, 4 `platform` (`campaign-rtcdp`, `advertising-cja`, `advertising-rtcdp`, `mmeasure-rtcdp`), 3 `extension` (`campaign-aa` for the add-on, `campaign-workfront` for Workfront Fusion, `campaign-advertising` for the workflow package Adobe supplies), no `partner`. `advertising-target` is marked `native`; it is a documented procedure that rests on two other integrations, so `partner` is arguable.
- `tier` is used on 14 lines (the three parts of Adobe Advertising, and Marketo Measure Ultimate); `ext` on 4 (MZ02, MZ04, MZ07, XM11).
- 12 connections carry `sow_prereq` (14 conditions in all) and 7 carry `sow_availability`.
- The first prerequisite of `campaign-cw` is the standard Coworker sentence from the wave 3 brief, with its statement of work line.
- Marketo Measure's CRM and ad platform work could also be drawn as lines to the outside boxes `crm` and `ads`, the way `crm-marketo` is drawn with no services and a "covered" note pointing at the product line (MZ02, MZ04). Not written as connections here because the brief's scope is Adobe products.
- Adobe's quotes in `evidence`, `prereq_sources`, `availability_source`, `not_documented` and `left_out` keep Adobe's own words, including labels, dates and version numbers; the card fields do not.
- The Campaign evidence quotes for CG03 and the prerequisite quotes for the AEM connections use Adobe's phrase "client console"; the card fields say "Campaign console" so the copy check does not read it as "the client".

## Pages downloaded and checked

- https://experienceleague.adobe.com/en/docs/advertising/creative/creative-experiences/experience-about
- https://experienceleague.adobe.com/en/docs/advertising/creative/creative-libraries/creatives/aem-assets-configure
- https://experienceleague.adobe.com/en/docs/advertising/creative/creative-libraries/creatives/standard-creatives/creative-add-standard
- https://experienceleague.adobe.com/en/docs/advertising/creative/home
- https://experienceleague.adobe.com/en/docs/advertising/creative/introduction/creative-about
- https://experienceleague.adobe.com/en/docs/advertising/dsp/admin/conversion-metrics-manage
- https://experienceleague.adobe.com/en/docs/advertising/dsp/admin/users/user-invite
- https://experienceleague.adobe.com/en/docs/advertising/dsp/ai-assistant/ai-assistant-about
- https://experienceleague.adobe.com/en/docs/advertising/dsp/audiences/audience-about
- https://experienceleague.adobe.com/en/docs/advertising/dsp/audiences/sources/sources-workflows/source-adobe-rtcdp
- https://experienceleague.adobe.com/en/docs/advertising/dsp/campaign-management/campaign-management-overview
- https://experienceleague.adobe.com/en/docs/advertising/dsp/campaign-management/campaigns/campaign-launch-checklist
- https://experienceleague.adobe.com/en/docs/advertising/dsp/conversational-ads/account-manage
- https://experienceleague.adobe.com/en/docs/advertising/dsp/custom-reports/report-about
- https://experienceleague.adobe.com/en/docs/advertising/dsp/introduction/dsp-about
- https://experienceleague.adobe.com/en/docs/advertising/dsp/inventory/private-inventory/private-inventory-about
- https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview
- https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/planning/prerequisites
- https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/import-audiences
- https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/media-data-ingestion/overview
- https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/overview
- https://experienceleague.adobe.com/en/docs/advertising/integrations/customer-journey-analytics/overview
- https://experienceleague.adobe.com/en/docs/advertising/integrations/customer-journey-analytics/prerequisites
- https://experienceleague.adobe.com/en/docs/advertising/integrations/customer-journey-analytics/set-up
- https://experienceleague.adobe.com/en/docs/advertising/integrations/target/ab-tests-dsp
- https://experienceleague.adobe.com/en/docs/advertising/integrations/target/ab-tests-search
- https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/campaign-management/management/campaigns/audiences-and-targets/audiences/google-audience-from-adobe-audience
- https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/campaign-management/management/campaigns/audiences-and-targets/audiences/google-audience-from-campaign-email-list
- https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/getting-started/implemention-overview
- https://experienceleague.adobe.com/en/docs/advertising/search-social-commerce/intro/about
- https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/adobe-analytics-integration
- https://experienceleague.adobe.com/en/docs/campaign-classic/using/getting-started/faq/faq-campaign-classic-v7
- https://experienceleague.adobe.com/en/docs/campaign-classic/using/integrating-with-adobe-experience-cloud/audience-sharing/configuring-shared-audiences-integration-in-adobe-campaign
- https://experienceleague.adobe.com/en/docs/campaign-classic/using/integrating-with-adobe-experience-cloud/audience-sharing/sharing-audiences-with-adobe-experience-cloud
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/aem-assets
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/aem-content
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/aem-multilingual
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/genstudio
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/integrations/integration
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/start/acs-migration
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/start/faq
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/start/get-started
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/architecture/architecture
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/campaigns/campaigns
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/config/implement/implement
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aa
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aem
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aep/ac-aep
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aep/ac-aep-landing-pages
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-at
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-triggers
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-workfront
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/integration
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/v7-to-v8
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/permissions/gs-permissions
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/send/delivery-best-practices
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/send/real-time/transactional
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows
- https://experienceleague.adobe.com/en/docs/coworker/content/home
- https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/marketo-measure-ultimate
- https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/advertising/adobe-advertising-cloud-dsp-connection-legacy
- https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/advertising/adobe-advertising-dsp-connection
- https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/email-marketing/adobe-campaign-managed-services
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/campaign
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/adobe-solutions/acc-action
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/connect-systems/ajo-integrations
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/orchestrate-journeys/about-journey-building/using-adobe-campaign-v7-v8
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/orchestrate-journeys/journey-use-cases/ajo-ac
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/advanced-marketo-measure-features/custom-attribution-models/best-practices-for-stage-mapping
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/api-connections/utilizing-marketo-measures-api-connections/integrated-ad-platforms
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/channel-tracking-and-setup/online-channels/online-custom-channel-setup
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/getting-started-with-marketo-measure/adobe-admin-console-setup
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/getting-started-with-marketo-measure/marketo-measure-crm-packageless-integration
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/configuration-and-setup/marketo-measure-and-salesforce/marketo-measure-salesforce-package-installation-and-set-up
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketing-spend/spend-management/spend-management-methods
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-marketo/marketo-measure-integrations-with-marketo/marketo-engage-people-integration
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-marketo/marketo-measure-integrations-with-marketo/marketo-engage-programs-integration
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-marketo/marketo-measure-integrations-with-marketo/set-up-marketo-connection
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-data-warehouse/data-warehouse-access-reader-account
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-discover-ui/dashboards/discover-dashboard-basics
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-tracking/setting-up-tracking/adding-marketo-measure-script
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-tracking/setting-up-tracking/best-practices-for-implementing-marketo-measure-javascript
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-tracking/setting-up-tracking/marketo-measure-cookies
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/implementation-guide
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/marketo-measure-ultimate-overview
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-ultimate/migration-from-tier-to-marketo-measure-ultimate
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/miscellaneous/other-related-resources/marketo-measure-maintenance
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/adobe-experience-cloud-integrations-overview
- https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/adobe-connectors/adobe-campaign-classic-connector
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview
- https://experienceleague.adobe.com/en/toc/advertising-help-search-social-commerce
- https://experienceleague.adobe.com/en/toc/marketo-measure-help
- https://helpx.adobe.com/support/programs/eol-matrix.html

Also read, not quoted: the tables of contents of the Campaign v8, Campaign Web, Marketo Measure and four Adobe Advertising guides; Campaign's customization, data model best practices, deliverability, reporting, guardrails, external accounts, versions and enhanced security pages; the Campaign Web capability matrix, permissions, approvals and adoption guide pages; the Campaign Standard release notes; the Experience Platform tutorial for the Campaign source; the Journey Optimizer integrations page for the Campaign Standard route; the Advertising pages on Analytics for Advertising JavaScript and metrics, Audience Analytics, DSP optimization, custom objectives, universal IDs, brand safety, report destinations and the Creative dynamic ad workflow; the Marketo Measure pages on the tags extension, Salesforce connection, custom campaign sync, attribution models, custom attribution model, LinkedIn, the Power BI template, data integrity requirements and the Dynamics installation guide.

## Pages not read

- https://business.adobe.com/products/campaign/adobe-campaign.html: Tried once with curl, as the brief allows: no page came back (no HTTP status). Not retried, nothing done to get around it.
- https://business.adobe.com/products/advertising/adobe-advertising.html: Same host, same single attempt, same result.
- https://business.adobe.com/products/marketo/marketo-measure.html: Same host, same single attempt, same result. A statement about Marketo Measure's future that exists only on a marketing page would be missed.
- https://www.adobe.com/: Not attempted; no page on it was needed.
- https://helpx.adobe.com/legal/product-descriptions/adobe-advertising.html: Returned 404, as did the addresses guessed for a Marketo Measure product description. No product description was found for either product, so their package contents rest on the guides. The Campaign Managed Cloud Services product description was found and searched for package and add-on names only.
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/new/campaign-faq-comprehensive: Downloaded (77,000 characters) and not read in full; nothing is quoted from it.
- Search, Social, & Commerce Optimization Guide (inside the product, from the Help menu): Adobe's public guide points to it for portfolios, objectives and tracking details. It is only available inside the product, so AV05 rests on the public implementation overview.
- https://experienceleague.adobe.com/en/toc/advertising-help-search-social-commerce: The Search, Social, & Commerce guide has 607 entries. Its table of contents was read in full; only the introduction, getting started, integration and audience pages were opened.
- https://video.tv.adobe.com/: Videos linked from the Analytics for Advertising, Marketo Measure Ultimate and Coworker pages were not watched; only page text was read.
- https://experienceleague.adobe.com/en/docs/campaign-web/v8/content/ai-assistant/generative-gs: Campaign Web's Generate Content and Brands pages were downloaded and not read for labels or licensing, so no line is written on them.
