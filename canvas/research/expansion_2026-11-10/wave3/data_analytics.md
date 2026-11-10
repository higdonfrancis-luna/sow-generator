# Wave 3, analytics data (Adobe Analytics, Audience Manager): research trail

Checked Nov 10 2026. Research only: nothing in the tool, the catalog or the site was changed, nothing was built and nothing was committed. The data is in `data_analytics.json` beside this file. Connections from these two products to Adobe Campaign, Adobe Advertising and Marketo Measure belong to another wave 3 helper and are listed under "For the other helper", not written here.

## Summary

Two products with 15 services, and 15 connections with 26 services (41 services in all). Hours are our own estimates for a mid-market client; Adobe publishes none.

| Product | id | Services | Starting | Optional | Monthly |
|---|---|---|---|---|---|
| Adobe Analytics (Adobe Analytics) | `aa` | 8 | 6 | 2 | 1 |
| Audience Manager (Adobe Audience Manager) | `aam` | 7 | 5 | 2 | 1 |

| Connection | id | Kind | Services | Label |
|---|---|---|---|---|
| Adobe Analytics + Target | `aa-target` | native | XL01, XL02, XL03 | Analytics for Target (A4T): Analytics is the reporting source for Target activities, with every Analytics metric and segment on the report |
| Adobe Analytics + Real-Time CDP | `aa-rtcdp` | platform | XL04, XL05, XL06 | The Analytics source connector streams report suite data into Experience Platform datasets and Real-Time Customer Profile |
| Adobe Analytics + Customer Journey Analytics | `aa-cja` | platform | XL07, XL08 | Report suite data reaches CJA through the Analytics source connector; Analytics projects and components migrate to CJA data views |
| Adobe Analytics + Journey Optimizer | `aa-ajo` | platform | XL09 | Report suite events, streamed through the Analytics source connector, trigger journeys through rule-based events |
| Adobe Analytics + Marketo Engage | `aa-marketo` | native | XL10 | Marketo Web Personalization adds organization, industry, segment and web campaign data to Analytics reports |
| Adobe Analytics + AEM Sites | `aa-aemsites` | native | XL11 | An IMS-authenticated Analytics configuration in AEM as a Cloud Service, with the Analytics extension in tags sending page data |
| Adobe Analytics + AEM Assets | `aa-aemassets` | native | XL12 | Assets Insights shows image impressions and clicks in AEM Assets, read from an Analytics report suite |
| Adobe Analytics + Edge Delivery Services | `aa-eds` | extension | XL13 | Adobe's martech plugin sends Edge Delivery page views and events through Web SDK to an Analytics report suite |
| Adobe Analytics + Adobe Commerce | `aa-commerce` | extension | XL14, XL15 | Commerce's Data Connection extension sends storefront events through a datastream to an Analytics report suite |
| Adobe Analytics + Coworker | `aa-cw` | native | XL16, XL17 | Coworker Chat answers questions from Adobe Analytics report suites, with the user's own Analytics permissions |
| Adobe Analytics + Audience Manager | `aa-aam` | native | XL18, XL19, XL20 | Audience Analytics: Analytics forwards hits to Audience Manager server side, and Audience Manager segments show as dimensions in Analytics |
| Audience Manager + Real-Time CDP | `aam-rtcdp` | platform | XL21, XL22, XL23 | Audience Manager source connector and Experience Cloud Audiences destination, used in the order Adobe's guide to moving to Real-Time CDP sets out |
| Audience Manager + Target | `aam-target` | native | XL24 | Audience Manager segments appear in Target's audience list through the Experience Cloud ID service and Profiles and Audiences |
| Audience Manager + Marketo Engage | `aam-marketo` | native | XL25 | Marketo lists become Audience Manager traits and a segment; only list membership is shared, for people Marketo has matched to an Experience Cloud ID |
| Audience Manager + Real-Time CDP Collaboration | `aam-collab` | native | XL26 | Collaboration sources eligible first-party Audience Manager segments on a schedule, for overlap analysis and activation |

Neither product is itself under an early or limited label on Adobe's pages. Both carry a lifecycle question for Adam (below): Audience Manager because Adobe points its customers to Real-Time CDP, Adobe Analytics because Adobe calls Customer Journey Analytics its next generation. No Brand Visibility connection is written for Adobe Analytics (Adam, Nov 10 2026).

## How this was researched

- Started from this morning's map-level pass (`../platform_data_campaign.json`, the `aa` and `aam` entries), then read each source page again in full, plus the setup, prerequisite and product description pages it links to.
- The tables of contents of the Analytics guides (implementation, admin, components, tools, export, integration, tech notes) and of the Audience Manager guide were downloaded and read for scope: 1,276 entries.
- Sources: experienceleague.adobe.com (Analytics, Audience Manager, Target, Experience Platform, Customer Journey Analytics, Journey Optimizer, Marketo Engage, AEM as a Cloud Service, Commerce, Coworker, Real-Time CDP Collaboration, the discontinued products list, one support article), helpx.adobe.com (the Adobe Analytics product description) and www.aem.live (the martech integration page).
- Every page was downloaded with `curl -sS -L -m 45`, tags stripped and spacing collapsed, and each quote matched word for word, the way `../verify_quotes.py` and `../wave1/verify_wave1.py` do. `python3 sow/canvas/research/expansion_2026-11-10/wave1/verify_wave1.py sow/canvas/research/expansion_2026-11-10/wave3/data_analytics.json` runs on the JSON as it is.
- **Quote check: 170 quotes in the JSON and 24 more in this trail, 194 in all on 81 pages, all found, none unverified.** A made-up sentence was run through the same check to confirm it fails.
- Service ids (AN, AU, XL) were checked by script against `sow/canvas/catalog.json` and every JSON under `sow/canvas/research/`: no id and no prefix repeats. No connection pair in this file is already in the catalog.
- Voice checks run by script on every card field: no "the client", no "clients", no bare "your", no lifecycle labels, dates or version numbers, no prerequisite that opens with or follows a colon with "confirm", no "prove it" in the client-voice fields, `sow_prereq` in the Client's voice, no em or en dashes.
- Each downloaded page was also scanned for lifecycle wording (beta, limited, early access, coming soon, deprecated, end of life); the hits are in "Lifecycle questions for Adam" and "Left out, and why".
- business.adobe.com was tried once with curl for the two product pages; the connection closed without returning a page both times, so they are listed under "Pages not read" and were not tried again. www.adobe.com was not needed. One helpx address returned Adobe's page-not-found screen. Nothing was done to get around a block.

## Lifecycle questions for Adam

1. **Audience Manager: no end date from Adobe, but Adobe points customers to Real-Time CDP. How should the tool show it?**

   - Adobe: "There are no plans to modify the current Audience Manager Data Management Platform (DMP). However, the deprecation of third-party cookies will likely create scale challenges for most DMP users." (https://experienceleague.adobe.com/en/docs/discontinued/using/device-co-op)
   - Adobe: "As your organization evolves to use Adobe Real-Time CDP, explore these considerations to prepare your data and to become aware of critical differences between the two technologies." (https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp)
   - Adobe: "Adobe strongly recommends that segments activated in Audience Manager to people-based destinations get pushed to Real-Time CDP via the Audience Manager Source Connector, to then activate through Real-Time CDP." (https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp)
   - Adobe: "Decommissioning Adobe Audience Manager (AAM) is a complex process that requires careful consideration of its impact on existing integrations and audience strategies." (https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-25631)
   - What was found: Audience Manager is not on Adobe's list of discontinued products, and no page gives an end date. The Audience Manager guide's table of contents now opens with the guide to Real-Time CDP and two Web SDK migration pages. Adobe support publishes an article on switching an instance off at contract end. The sentence about no plans to modify sits on the Device Co-op end-of-life page.
   - *Recommendation: Show Audience Manager as one box, written for organizations that already run it. Its own services are a health check, Web SDK data collection, taxonomy, first-party onboarding, export controls and monthly operations; the move sits on the Audience Manager + Real-Time CDP card (XL21 to XL23). No card says the product is ending, because Adobe does not say so; the product note says Adobe publishes a guide for moving to Real-Time CDP.*

2. **Adobe Analytics: current, with Customer Journey Analytics described as the next generation and a one-time license for customers who move. Does any card need to say so?**

   - Adobe: "Customer Journey Analytics is Adobe's next-generation Analytics solution that lets you use the power of Analysis Workspace with data from Adobe Experience Platform." (https://experienceleague.adobe.com/en/docs/analytics/analyze/admin-overview/analytics-overview)
   - Adobe: "Adobe Analytics - Evolution is designated for Customers migrating from Adobe Analytics Foundation, Select, Prime, or Ultimate to Customer Journey Analytics Foundation, Select, Prime, or Ultimate." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
   - Adobe: "The Adobe Analytics Foundation Pack for Experience Cloud offering is designated for end-of-life status." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
   - Adobe: "This information is especially valuable as you begin preparations to upgrade to Customer Journey Analytics." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/analytics-inventory)
   - What was found: No end date for Adobe Analytics on Experience League or helpx; the release notes are current and add features each month. Select, Prime and Ultimate are sold. Only the Foundation Pack is closed to purchases and renewals. The 1.4 API and the old Report Builder add-in are retired; nothing here rests on them.
   - *Recommendation: Show Adobe Analytics as a current product with no lifecycle wording. The upgrade story lives where it already does: the existing CJA line CJ03 and the new Adobe Analytics + Customer Journey Analytics card. The Evolution license and the Foundation Pack are listed as tiers so a partner checks what a client holds.*

3. **Features under a label one level down, left out or worded around.**

   - Adobe: "The functionality described in this article is in the Limited Testing phase of release and might not be available yet in your environment." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/migrate-projects-aa-cja)
   - Adobe: "This functionality will be deprecated after February 28, 2027." (https://experienceleague.adobe.com/en/docs/analytics/components/classifications/classifications-overview)
   - Adobe: "You can't change the mappings, start, or end dates during the beta release." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/experience-cloud-destinations/create-analytics-destination)
   - What was found: Project migration with Coworker is in limited testing (left out; XL08 uses the Analytics interface). Coworker inside the Analytics interface is marked coming soon (left out; XL16 uses the Coworker workspace, marked available). Legacy classification methods are being retired (AN02 uses classification sets). One sentence on the Audience Manager page for Analytics destinations still mentions a beta release in the manual segment mapping step; the Audience Analytics pages carry no label, so XL19 is kept and uses automatic mapping.
   - *Recommendation: No action beyond what is written. If Adam reads the stale sentence on the Analytics destination page as a label, XL19 can drop manual segment mapping from its scope; it does not mention it today.*

## Product: Adobe Analytics (`aa`)

**Title:** Adobe Analytics. **What:** Adobe's web and app analytics product. It collects data from sites and apps into report suites, and teams analyze that data in Analysis Workspace, with exports, alerts and reporting tools around it. Source: https://experienceleague.adobe.com/en/docs/analytics/analyze/admin-overview/analytics-overview

**Notes:** These lines cover a new or inherited Adobe Analytics setup: the solution design, report suites and variables, data collection through Web SDK and tags, Analysis Workspace, access and privacy labels, exports and a monthly service. New implementations are written for Web SDK with tags, the path Adobe's page calls the most direct; AN06 is for an organization that still runs the Analytics tag extension or AppMeasurement. Adobe describes Customer Journey Analytics as its next-generation analytics product and sells a one-time license for customers who move to it; the move itself is the existing CJA line CJ03 and the Adobe Analytics + Customer Journey Analytics connection, not a line here. Classification work uses classification sets, because Adobe's page says the older classification methods are being retired. Brand Visibility is not connected to Adobe Analytics in this tool, by Adam's decision. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An Adobe Analytics license (Select, Prime or Ultimate), which sets how many variables and which features each report suite has. Adobe: "Adobe Analytics Product(s) and Service(s) include but are not limited to Adobe Analytics (Foundation Pack for Experience Cloud, Select, Prime, and Ultimate), Adobe Analytics Evolution (Select, Prime, and Ultimate), and all applicable Add-ons." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
- Access to Adobe Analytics granted to your client's administrators in the Admin Console. Adobe: "Ensure that a system-level administrator has granted you access to Adobe Analytics via the CX Enterprise Admin Console." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/c-new-report-suite/t-create-a-report-suite)
- A solution design document agreed before the data layer and tags work starts. Adobe: "Make sure that you are prepared with a solution design document before approaching development teams in your organization." (https://experienceleague.adobe.com/en/docs/analytics/implementation/prepare/data-layer)
- Site developers who build and maintain the data layer on your client's pages. Adobe: "Your site development team is primarily responsible for making sure the data layer object populates with correct values." (https://experienceleague.adobe.com/en/docs/analytics/implementation/prepare/data-layer)
- For data feeds: a storage bucket on Amazon S3, Google Cloud Platform or Azure. Adobe: "A bucket configured on Amazon S3, Google Cloud Platform, Azure RBAC, or Azure SAS." (https://experienceleague.adobe.com/en/docs/analytics/export/analytics-data-feed/data-feed-overview)

### Tiers

- **Adobe Analytics Select, Prime and Ultimate:** The three packages Adobe sells. Each report suite has up to 75 props, 1,000 events and 150 processing rules on all three, 200 eVars on Select and Prime and 250 on Ultimate. Select does not include Contribution Analysis; Ultimate adds Cross-Device Analytics and a streaming media allowance. Adobe: "For purposes of clarity, Adobe Analytics - Select does not include a license to access or use and Customer agrees that it will not access or use Contribution Analysis" (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
- **Adobe Analytics Foundation Pack for Experience Cloud:** A volume-limited package that some AEM as a Cloud Service customers hold. Adobe no longer sells or renews it, and it has no Report Builder, Contribution Analysis, Customer Attributes or Advertising Analytics. Check which package your client holds before scoping AN04 and AN07. Adobe: "As such, as of January 1, 2024, Adobe is not offering any purchases, upsells, or renewals of this offering." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
- **Adobe Analytics Evolution:** A one-time license for a customer that is moving from Adobe Analytics to Customer Journey Analytics, with the same limits as the customer's earlier Adobe Analytics package. Where your client holds it, the move that line CJ03 covers is already under way. Adobe: "Adobe Analytics - Evolution is only available for licensing one time during the migration period from Adobe Analytics to Customer Journey Analytics and cannot be renewed." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| AN01 | Solution design and measurement plan | one-time | 24 | 48 | 96 | yes |  |
| AN02 | Report suites, variables and marketing channels | one-time | 32 | 56 | 104 | yes |  |
| AN03 | Data layer and Web SDK data collection | one-time | 60 | 120 | 240 | yes |  |
| AN04 | Analysis Workspace projects and components | one-time | 40 | 64 | 120 | yes |  |
| AN05 | Access, privacy labels and team training | one-time | 24 | 40 | 72 | yes |  |
| AN06 | Move an existing tags setup to Web SDK | one-time | 40 | 80 | 160 | optional |  |
| AN07 | Data feeds and Data Warehouse exports | one-time | 16 | 32 | 56 | optional | Also needs a cloud storage bucket on Amazon S3, Google Cloud Platform or Azure |
| AN08 | Monthly analysis and implementation review | monthly | 16 | 32 | 56 | yes |  |

- **AN01 Solution design and measurement plan.** Run KPI and business-question workshops with your client's stakeholders, map each requirement to a dimension or metric and its Analytics variable, and write the solution design document your client's team keeps current. Evidence: "A solution design document (also known as a solution design reference or business requirements document) is in essence the blueprint of your analytics implementation." (https://experienceleague.adobe.com/en/docs/analytics/implementation/prepare/solution-design)
- **AN02 Report suites, variables and marketing channels.** Create the development and production report suites, enable and name the conversion variables, success events and props from the solution design, add processing rules and bot rules, and configure marketing channels and classification sets for campaign tracking codes. Evidence: "Plan ahead by making a list of all your channels, so that all of your visitor hits are categorized to the right channel." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/marketing-channels/c-channels)
- **AN03 Data layer and Web SDK data collection.** Specify the data layer with your client's developers, set up the datastream, the tags property and the Web SDK extension, map data elements to Analytics variables, and validate in development before publishing to production. Evidence: "This implementation path is the most straightforward and typically the recommended path for new Web SDK implementations." (https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/web-sdk/web-sdk-tag-extension)
- **AN04 Analysis Workspace projects and components.** Build the agreed Analysis Workspace projects for your client's priority questions, with the segments, calculated metrics and alerts behind them, and save company templates the team reuses. Evidence: "Analysis Workspace allows you to build analyses quickly to gather insights and then share those insights with others." (https://experienceleague.adobe.com/en/docs/analytics/analyze/analysis-workspace/home)
- **AN05 Access, privacy labels and team training.** Set up product profiles in the Admin Console with the report suites, tools and components each team needs, assign identity and sensitivity labels to the report suite's variables, and train your client's analysts and business users on Analysis Workspace. Evidence: "Product profiles are permission presets that product admins can assign to users within an organization." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-console/permissions/product-profile)
- **AN06 Move an existing tags setup to Web SDK.** Move your client's Adobe Analytics tag extension setup to the Web SDK with Adobe's upgrade assistant: choose the rules and data elements, map the Analytics variables to XDM, review the Web SDK actions it adds, then test the new library and compare reports before publishing. Evidence: "The Web SDK upgrade assistant helps you plan and execute the migration of your Adobe Analytics tags extension to the Adobe Experience Platform Web SDK." (https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/web-sdk/upgrade-assistant/overview)
- **AN07 Data feeds and Data Warehouse exports.** Set up the cloud account and location, create the hourly or daily data feed with the agreed columns, and schedule the Data Warehouse requests your client's data team needs. Evidence: "Data feeds are a powerful way to get raw data out of Adobe Analytics." (https://experienceleague.adobe.com/en/docs/analytics/export/analytics-data-feed/data-feed-overview)
- **AN08 Monthly analysis and implementation review.** Each month, analyze your client's priority journeys and campaigns and report findings and next steps, and after each site release check that the metrics and dimensions behind the top KPIs still collect correctly. Evidence: "If you consistently do this Focused Review after each website release, you'll find that your bi-annual Full Reviews are much easier." (https://experienceleague.adobe.com/en/docs/analytics/implementation/review/focused-review)

## Product: Audience Manager (`aam`)

**Title:** Adobe Audience Manager. **What:** Adobe's data management platform. It collects audience data from sites, apps and offline files, builds traits and segments from it, and sends those segments to ad platforms and to other Adobe products. Source: https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/overview/aam-overview

**Notes:** Adobe has announced no end date for Audience Manager and says it has no plans to change the product, but it warns that the loss of third-party cookies limits what a data management platform can reach, and it publishes a guide for moving to Real-Time CDP. So these lines are written for an organization that already runs Audience Manager: a health check, data collection moved to Web SDK, a tidy taxonomy, first-party data onboarding, destinations under export controls and a monthly service. The move itself (which segments go, the source connector, audiences sent back) is the Audience Manager + Real-Time CDP connection. No line sells third-party data from Audience Marketplace or a new Audience Manager rollout. People-Based Destinations is a premium capability your client buys from Adobe. Adobe publishes no product description for Audience Manager on helpx, so no packages are listed. Hours are our own estimates for a mid-market client; Adobe publishes none.

### Prerequisites

- An active Audience Manager license and instance. Adobe: "You need an Audience Manager license to enable the Data Management Platform use cases mentioned above." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-experience-platform/aam-aep-audience-sharing)
- User accounts managed in the Adobe Admin Console. Adobe: "Once the migration is complete, Audience Manager administrators will manage users and groups exclusively in the Admin Console" (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/administration/admin-console-migration)
- Administrator permissions in Audience Manager for whoever creates data sources and destinations. Adobe: "Administrator permissions are required to create a data source." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/data-sources/manage-datasources)
- A trait taxonomy and folder structure agreed before new data is integrated. Adobe: "Before the integration process begins, remember to create traits and a folder structure in the Audience Manager UI." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/data-integration-methods)
- For People-Based Destinations: the premium capability bought from Adobe. Adobe: "Please contact your Adobe representative to take advantage of this premium feature." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/people-based/people-based-destinations-prerequisites)

### Tiers

- **People-Based Destinations:** A premium capability on top of Audience Manager that sends first-party segments to Facebook, Google Customer Match and LinkedIn by hashed identifiers. Line AU06 needs it. Adobe: "People-Based Destinations is a premium capability that enhances your Audience Manager experience by allowing you to activate your first-party audience segments in people-based environments" (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/people-based/people-based-destinations-prerequisites)

### Services

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| AU01 | Audience Manager health check and inventory | one-time | 24 | 40 | 72 | yes |  |
| AU02 | Data collection moved to Web SDK | one-time | 24 | 48 | 96 | yes |  |
| AU03 | Trait and segment taxonomy cleanup | one-time | 24 | 40 | 80 | yes |  |
| AU04 | First-party data onboarding from offline files | one-time | 24 | 48 | 80 | optional |  |
| AU05 | Destinations and data export controls | one-time | 24 | 40 | 72 | yes |  |
| AU06 | People-based destinations and profile merge rules | one-time | 24 | 40 | 72 | optional | Needs People-Based Destinations |
| AU07 | Monthly audience operations | monthly | 12 | 24 | 40 | yes |  |

- **AU01 Audience Manager health check and inventory.** Review your client's traits, segments, destinations and data sources against the account limits, list unused signals and the segments no destination uses, and report what to keep, fix or retire. Evidence: "Audience Manager sets a maximum limit on the number of traits, segments, destinations, and algorithmic models that you can create for an account." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/administration/usage-limits)
- **AU02 Data collection moved to Web SDK.** Create the datastream with the Audience Manager service, add the Web SDK extension to your client's tags property, rebuild the Audience Manager rules on the data object, and check that traits still qualify before the old extension is removed. Evidence: "Adobe recommends following this implementation path when you have an existing implementation using the Adobe Audience Manager tag extension." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/migrate-to-web-sdk/dil-extension-to-web-sdk)
- **AU03 Trait and segment taxonomy cleanup.** Reorganize your client's traits into a logical folder hierarchy with naming rules, rebuild the segments that still matter on first-party traits, and retire duplicates and segments nobody activates. Evidence: "Before the integration process begins, remember to create traits and a folder structure in the Audience Manager UI." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/data-integration-methods)
- **AU04 First-party data onboarding from offline files.** Set up the data source and ID synchronization, agree the inbound file format and schedule with your client's CRM or data team, and check that the onboarded records qualify for the right traits. Evidence: "An overview for technical and non-technical customers who want to bring data from other systems (offline) into Audience Manager." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/sending-audience-data/batch-data-transfer-process/batch-data-transfer-overview)
- **AU05 Destinations and data export controls.** Review each destination with your client and its ad partners, set data export controls on data sources and export labels on destinations, and map the agreed segments to each destination. Evidence: "Data Export Controls prevent you from sending data to destinations when this action violates data privacy or data use agreements." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/data-export-controls)
- **AU06 People-based destinations and profile merge rules.** Set up the hashed email data source, the profile merge rule for authenticated profiles and the Facebook, Google Customer Match or LinkedIn destination, so your client's first-party segments reach social platforms without third-party cookies. Evidence: "Use People-Based Destinations to send first-party audience segments to people-based environments." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/people-based/people-based-destinations-overview)
- **AU07 Monthly audience operations.** Each month, review trait, segment and destination reports, fix failed inbound and outbound transfers, retire stale segments and add or change segments as campaigns need them. Evidence: "A General report returns performance data on traits, segments, and destinations." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/reporting/reports-overview)

## Connections with services

### Adobe Analytics + Target (`aa-target`)

**Kind:** native. **Label:** Analytics for Target (A4T): Analytics is the reporting source for Target activities, with every Analytics metric and segment on the report.

**How:** Analytics for Target (A4T) makes Adobe Analytics the reporting source for a Target activity: Target sends the activity and experience a visitor saw to Analytics server to server, and every Analytics metric and segment is available on the activity's report in both products. Analytics can also supply the behavioral data for Target Recommendations. Source: https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4t

**Gain:** One set of numbers for every test. Your client's testing team and analysts read test results from the same data, so nobody reconciles two reports, and a metric or segment that was not chosen before the test started is still available after it ends.

**Flows:**

- Target to Adobe Analytics: The activity and experience each visitor saw, and activity conversions, sent server to server on the same hit (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/reporting)
- Adobe Analytics to Target: Analytics metrics, calculated metrics and segments, used as goal metrics and report audiences on the activity (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4t)
- Adobe Analytics to Target: View-based and purchase-based behavioral data from product variables, as a daily feed for Recommendations criteria (https://experienceleague.adobe.com/en/docs/target/using/recommendations/criteria/use-adobe-analytics-with-recommendations)

**Availability:** Adobe says the account must be provisioned for the integration before A4T is used, and that provisioning can take up to five business days. Automated Personalization activities are not supported. Adobe: "Before you can begin using A4T, you must request that your account is provisioned for the integration." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/before-implement)

**Prerequisites:**

- Licenses for both Adobe Analytics and Target. Adobe: "To use Analytics as the reporting source for Target, both you and your company must have access to Analytics and to Target." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4t)
- The account provisioned for A4T by Adobe, which your client requests with Adobe's integrations provisioning form. Adobe: "Before you implement A4T, you must be provisioned for Analytics and Target." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4timplementation) Statement of work: Adobe confirms that the Client's account is provisioned for Analytics for Target before this service starts.
- Web SDK with a datastream, or at.js with the Experience Cloud Visitor ID service and AppMeasurement at the minimum releases Adobe names on its page. Adobe: "The process varies depending on whether you implement A4T with the Adobe Experience Platform Web SDK or with at.js." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4timplementation)
- Users who hold both an Analytics and a Target account, with access to the report suite and to the Web Services Access group. Adobe: "Access to the Web Services Access group in Analytics is required to be able to use Analytics as the reporting source for Target." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/account-reqs)
- For Recommendations from Analytics data: product variables implemented in Analytics. Adobe: "Regular eVars and Props are not sufficient for this handshake to happen automatically between Analytics and Target." (https://experienceleague.adobe.com/en/docs/target/using/recommendations/criteria/use-adobe-analytics-with-recommendations)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL01 | A4T provisioning and implementation | one-time | 16 | 32 | 64 | yes |  |
| XL02 | Test reporting in Analysis Workspace | one-time | 16 | 24 | 48 | yes |  |
| XL03 | Analytics data for Target Recommendations | one-time | 16 | 32 | 56 | optional |  |

- **XL01 A4T provisioning and implementation.** Request A4T provisioning with your client, set up user access to the report suite, enable Analytics in the datastream or bring the page libraries to the releases Adobe requires, set the reporting source in Target, and check that Target and Analytics hits share the same ID. Evidence: "Several steps are required when implementing Adobe Analytics as the reporting source for Adobe Target (A4T)." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4timplementation)
- **XL02 Test reporting in Analysis Workspace.** Build your client's test readout in Analysis Workspace with the Analytics for Target panel, agree the success metrics and segments each activity reports on, and explain how A4T counts entrants so both teams read results the same way. Evidence: "In Analysis Workspace, use the Analytics for Target panel to analyze your Target activities and experiences with lift & confidence." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/reporting)
- **XL03 Analytics data for Target Recommendations.** Implement the product variables Recommendations needs in Analytics, create the Analytics classifications feed in Target, map its columns to Recommendations fields, and test a criteria that uses Analytics as its behavioral data source. Evidence: "Using Adobe Analytics as the behavioral data source lets clients use the view-based and purchase-based behavioral data from Analytics in Adobe Target Recommendations activities." (https://experienceleague.adobe.com/en/docs/target/using/recommendations/criteria/use-adobe-analytics-with-recommendations)

**Client voice.** How: Adobe Analytics becomes the reporting source for your Target activities. Target tells Analytics which activity and experience each visitor saw, and every Analytics metric and segment is available on the activity's report in both products. Gain: Your testing team and your analysts read test results from the same data, and a metric or segment you did not choose before a test started is still available after it ends.

### Adobe Analytics + Real-Time CDP (`aa-rtcdp`)

**Kind:** platform. **Label:** The Analytics source connector streams report suite data into Experience Platform datasets and Real-Time Customer Profile.

**How:** The Analytics source connector streams a copy of report suite data into an Experience Platform dataset in XDM format, where it can build Real-Time Customer Profiles and audiences. In the other direction, the Experience Cloud Audiences destination sends Real-Time CDP audiences to Adobe Analytics where your client also licenses Audience Manager. Source: https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/analytics

**Gain:** Web behavior in the customer profile without new tagging. The behavior your client already collects in report suites starts building profiles and audiences in Real-Time CDP, with 13 months of history, and the existing Analytics implementation and reports stay as they are.

**Flows:**

- Adobe Analytics to Real-Time CDP: Report suite hits, streamed as XDM experience events into the data lake and Real-Time Customer Profile, with a 13-month backfill in production sandboxes (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics)
- Real-Time CDP to Adobe Analytics: Real-Time CDP audiences, sent through the Experience Cloud Audiences destination (needs an Audience Manager license) (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

**Availability:** Not stated by Adobe for the source connector. Adobe says the Experience Cloud Audiences destination is available to Real-Time CDP Prime and Ultimate customers, and that sending audiences to Adobe Analytics needs an Audience Manager license. Adobe: "This destination is available to Adobe Real-Time Customer Data Platform Prime and Ultimate customers." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

**Statement of work condition for availability:** The Client holds Real-Time CDP Prime or Ultimate and an Audience Manager license where Real-Time CDP audiences are sent to Adobe Analytics.

**Prerequisites:**

- Licenses for Adobe Analytics and Real-Time CDP, with the report suite mapped to the same organization as the Experience Platform sandbox. Adobe: "You can ingest report suites from any region (United States, United Kingdom, or Singapore) as long as they are mapped to the same organization as the Experience Platform sandbox instance in which the source connection is being created in." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics)
- One dataflow for each report suite: a report suite can be ingested by a single active dataflow, in a single sandbox. Adobe: "A report suite can be ingested using only a single active dataflow." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics)
- A schema with the Adobe Analytics ExperienceEvent Template field group, default or custom. Adobe: "With a custom schema, you can choose any available schema for your Analytics data, as long as that schema has the Adobe Analytics ExperienceEvent Template field group." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics)
- Variables that mean the same thing across report suites, or Data Prep mappings that resolve the conflicts, before more than one report suite is enabled for Profile. Adobe: "Data from multiple report suites can be enabled for Real-Time Customer Profile only if there are no data conflicts, such as two custom properties (eVars, lists and props) that have different meaning." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics)
- For audiences sent to Adobe Analytics: Real-Time CDP Prime or Ultimate, an Audience Manager license and the Visitor ID service. Adobe: "To send audiences from Real-Time CDP to Adobe Analytics through the Experience Cloud Audiences destination, you must have an Audience Manager license." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL04 | Analytics source connector and field mapping | one-time | 24 | 40 | 80 | yes |  |
| XL05 | Identities and privacy labels for Analytics data | one-time | 16 | 24 | 48 | optional |  |
| XL06 | Real-Time CDP audiences in Analytics reports | one-time | 16 | 24 | 40 | optional | Needs Real-Time CDP Prime or Ultimate |

- **XL04 Analytics source connector and field mapping.** Create the source dataflow for each agreed report suite, choose the default or a custom schema, map eVars, props and events to named XDM fields with Data Prep, and check the live data and the history backfill in the dataset. Evidence: "The connector streams report suite data into a Platform dataset in real time, converting it to XDM format." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/analytics)
- **XL05 Identities and privacy labels for Analytics data.** Review the report suite's privacy labels, mark the matching schema fields as identities, apply data usage labels by hand, and agree with your client how privacy requests are handled for the Analytics dataset before it is enabled for Profile. Evidence: "Experience Platform does not automatically copy labels from Adobe Analytics." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/analytics)
- **XL06 Real-Time CDP audiences in Analytics reports.** Where your client also licenses Audience Manager, connect the Experience Cloud Audiences destination, choose which Real-Time CDP audiences to share, and check that they arrive in Audience Manager and show in Analytics. Evidence: "Use this destination to activate audiences from Real-Time CDP to Audience Manager and Adobe Analytics." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

**Client voice.** How: A connector streams a copy of your Adobe Analytics report suite data into Adobe Experience Platform, where it builds customer profiles and audiences in Real-Time CDP. Your Analytics implementation and reports stay as they are. Gain: The web and app behavior you already collect starts feeding profiles and audiences, with 13 months of history, and without new tagging on your site.

### Adobe Analytics + Customer Journey Analytics (`aa-cja`)

**Kind:** platform. **Label:** Report suite data reaches CJA through the Analytics source connector; Analytics projects and components migrate to CJA data views.

**How:** Report suite data reaches Customer Journey Analytics through the Analytics source connector: one dataflow for each report suite lands the data in an Experience Platform dataset, and a CJA connection and data view make it reportable beside other channels. Adobe Analytics administrators can then re-create Analytics projects and their components in CJA with the Component migration tool. Source: https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aa-data-in-cja

**Gain:** Report suite data in cross-channel analysis. Your client keeps its Adobe Analytics reports running while the same data, with 13 months of history, becomes available in CJA beside call center, store or CRM data, and the projects analysts rely on are re-created instead of rebuilt by hand.

**Flows:**

- Adobe Analytics to Customer Journey Analytics: Report suite data, as an Experience Platform dataset added to a CJA connection, with 13 months of history (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/analytics)
- Adobe Analytics to Customer Journey Analytics: Analysis Workspace projects with their segments, calculated metrics and date ranges, re-created against a CJA data view (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/component-migration)

**Availability:** Not stated by Adobe for the source connector. Adobe says analysis across more than one report suite needs the CJA Select package, and that project migration in the Analytics interface is for Adobe Analytics administrators. Adobe: "You must have the Select package in order to perform data analysis across more than one report suite." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aa-data-in-cja)

**Statement of work condition for availability:** The Client holds the Customer Journey Analytics package that allows analysis across more than one report suite where more than one is in scope.

**Prerequisites:**

- Licenses for Adobe Analytics and Customer Journey Analytics, with Analytics deployed on at least one site. Adobe: "You have Adobe Analytics licensed and deployed on one or more of your websites, using any of the documented implementation methods:" (https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/analytics)
- For more than one report suite in a connection: the CJA Select package. Adobe: "You must have the Select package in order to perform data analysis across more than one report suite." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aa-data-in-cja)
- Report suite variables aligned, or a Data Prep mapping, before report suites are combined. Adobe: "Plan ahead to bring variables into alignment across those report suites." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/aa-to-cja)
- For project migration: Adobe Analytics administrator rights, a connection and data view that already hold the report suite data, and an agreed mapping of dimensions and metrics for the whole organization. Adobe: "It's important that your organization decides how dimensions and metrics will be mapped before any projects are migrated." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/prepare-component-migration)
- Projects on base report suites only: panels on a virtual report suite cannot be migrated. Adobe: "Panels that use a virtual report suite can't be migrated." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/prepare-component-migration)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL07 | Report suite data in CJA | one-time | 24 | 40 | 80 | yes |  |
| XL08 | Project and component migration to CJA | one-time | 16 | 32 | 64 | optional |  |

- **XL07 Report suite data in CJA.** Create a source dataflow for each agreed report suite, resolve prop and eVar differences across report suites with Data Prep, add the datasets to a CJA connection with the right person ID, and define the data view's dimensions and metrics. Evidence: "Create a dataflow for each report suite you wish to use in Adobe Experience Platform and Customer Journey Analytics." (https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aa-data-in-cja)
- **XL08 Project and component migration to CJA.** Run the Analytics inventory, agree with your client how dimensions and metrics map for the whole organization, remove the panels CJA does not support, migrate the agreed projects in batches and check each one against its original. Evidence: "Adobe Analytics administrators can migrate Adobe Analytics projects and their associated components to Customer Journey Analytics." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/component-migration)

**Client voice.** How: Your Adobe Analytics report suite data flows into Adobe Experience Platform and from there into Customer Journey Analytics, where it sits beside your other channels. Your Analytics projects and their segments and metrics can then be re-created in Customer Journey Analytics. Gain: You keep your Adobe Analytics reports running while the same data, with 13 months of history, becomes available for cross-channel analysis, and the projects your analysts rely on are re-created instead of rebuilt by hand.

### Adobe Analytics + Journey Optimizer (`aa-ajo`)

**Kind:** platform. **Label:** Report suite events, streamed through the Analytics source connector, trigger journeys through rule-based events.

**How:** Web behavior that Adobe Analytics already captures can trigger journeys: the Analytics source connector is enabled for a report suite, Adobe enables the Journey Optimizer environment to use that data source, and a rule-based event on the Analytics schema starts or advances a journey. Source: https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics

**Gain:** Journeys that start from what people do on the site. A cart addition, a search or a form start that your client already tracks in Adobe Analytics can start a follow-up journey, without tagging the site a second time.

**Flows:**

- Adobe Analytics to Journey Optimizer: Report suite events, streamed through the Analytics source connector as experience events that rule-based journey events listen for (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)

**Availability:** Adobe says the Journey Optimizer environment must be enabled by Adobe to use an Adobe Analytics data source, on request to Adobe Customer Care, and that this applies to rule-based events only. Adobe: "Once this configuration is done, contact Adobe to enable your Journey Optimizer environment to use this data source." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)

**Statement of work condition for availability:** Adobe has enabled the Client's Journey Optimizer environment to use the Adobe Analytics data source.

**Prerequisites:**

- Licenses for Adobe Analytics and Journey Optimizer. Adobe: "You can leverage all of the web behavioral event data which you are already capturing through Adobe Analytics or Web SDK, and streaming into Adobe Experience Platform, in order to trigger journeys and automate experiences for your customers." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)
- The Analytics source connector enabled for the report suite, on a default or custom schema. Adobe: "This enables the Analytics source connector for that report suite." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)
- The Journey Optimizer environment enabled by Adobe Customer Care for the Analytics data source, requested with the organization ID and the data source ID. Adobe: "Once you have a confirmation that your environment is ready, you can use Adobe Analytics data in your journeys." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics) Statement of work: Adobe confirms that the Client's Journey Optimizer environment is enabled for the Adobe Analytics data source before this service starts.
- Rule-based events: this route does not apply to other event types. Adobe: "This section only applies for rule-based events and customers who need to use Adobe Analytics or Web SDK data." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL09 | Analytics events as journey triggers | one-time | 16 | 32 | 56 | yes |  |

- **XL09 Analytics events as journey triggers.** Enable the source connector for the agreed report suite, raise the enablement request with Adobe for your client, define the rule-based events and their profile identifier on the Analytics schema, and test the first journey they trigger. Evidence: "This enables the Analytics source connector for that report suite. Whenever the data comes in, it is transformed into an Experience event and sent into Adobe Experience Platform." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)

**Client voice.** How: The web behavior you already capture in Adobe Analytics streams into Adobe Experience Platform, and Journey Optimizer listens for the events you choose, such as a cart addition, to start or advance a journey. Gain: A cart addition, a search or a form start that you already track can start a follow-up journey, without tagging your site a second time.

### Adobe Analytics + Marketo Engage (`aa-marketo`)

**Kind:** native. **Label:** Marketo Web Personalization adds organization, industry, segment and web campaign data to Analytics reports.

**How:** Marketo Web Personalization (Real-Time Personalization) writes each visitor's organization, industry, segment and web campaign into conversion variables, events and props in an Adobe Analytics report suite, set up in Analytics admin and switched on in the Web Personalization account settings. Source: https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics

**Gain:** Web analytics read by company and industry. Your client's analysts see which organizations and industries visit, what they read and which web campaigns convert them, inside the Analytics reports they already use.

**Flows:**

- Marketo Engage to Adobe Analytics: Organization, industry, Web Personalization segment and web campaign impressions and conversions, as eVars, events and props (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics)

**Availability:** Not stated by Adobe. The integration is switched on in the Web Personalization account settings and needs variables enabled in the report suite. Adobe: "The integration uses the JavaScript API that Adobe Analytics offers." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics)

**Prerequisites:**

- Marketo Engage with Web Personalization (Real-Time Personalization) and its tag on the site. Adobe: "This document enables the integration between Marketo Real-Time Personalization (RTP) and Adobe Adobe Analytics." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics)
- Free conversion variable, success event and traffic variable slots in the report suite, enabled in Analytics admin. Adobe: "Custom conversion variables (eVar), custom events (event) and traffic variables are used in the integration. All must be enabled from within AA admin." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics)
- The same slot numbers set in the Web Personalization account settings. Adobe: "Assign the Conversion, Event and Traffic Variables slot numbers to match the slot numbers created in AA" (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics)
- For Marketo lists in Analytics reports instead: an Audience Manager license, which that route depends on. Adobe: "For users that own both Adobe Audience Manager and Adobe Analytics, this integration will enable audiences to be shared from Marketo to your Adobe Analytics Report Suites" (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL10 | Web Personalization data in Analytics reports | one-time | 16 | 24 | 40 | yes |  |

- **XL10 Web Personalization data in Analytics reports.** Reserve and enable the eVars, events and props in your client's report suite, switch the integration on in the Web Personalization account settings with matching slots, and build the organization, industry and web campaign reports in Analysis Workspace. Evidence: "Analyze your web analytics from a B2B perspective by viewing organization, industry and Marketo Real-Time Personalization (RTP) campaign data within your Adobe Analytics account." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics)

**Client voice.** How: Marketo Web Personalization adds each visitor's organization, industry, segment and web campaign to your Adobe Analytics report suite, so that data shows in your Analytics reports. Gain: Your analysts see which organizations and industries visit your site, what they read and which web campaigns convert them, inside the reports they already use.

### Adobe Analytics + AEM Sites (`aa-aemsites`)

**Kind:** native. **Label:** An IMS-authenticated Analytics configuration in AEM as a Cloud Service, with the Analytics extension in tags sending page data.

**How:** AEM as a Cloud Service connects to a report suite through an Analytics cloud configuration that uses IMS authentication, and the site is tagged through a tags property that carries the Adobe Analytics extension, with rules that send page data to Analytics. Source: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics

**Gain:** Page activity tracked from the first release. Your client's AEM pages report views and interactions to Adobe Analytics through tags, so marketers change tracking without a code release, and the AEM configuration ties the site to its report suite.

**Flows:**

- AEM Sites to Adobe Analytics: Page views and interactions from AEM pages, sent by tags rules to the report suite (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)

**Availability:** Not stated by Adobe. The page applies to AEM as a Cloud Service and says IMS authentication is required. Adobe: "IMS authentication is required to integrate Adobe Analytics with AEM as a Cloud Service." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)

**Prerequisites:**

- AEM as a Cloud Service and an Adobe Analytics license with a report suite for the site. Adobe: "Integrating Adobe Analytics and AEM as a Cloud Service lets you track your web page activity." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)
- An IMS configuration in AEM, set up with server-to-server OAuth. Adobe: "IMS integrations are now configured with S2S OAuth" (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)
- A tags property for the site with the Adobe Analytics extension. Adobe: "In Adobe Launch, a property is created where the Adobe Analytics extension can be configured and rules are created to send data to Adobe Analytics." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)
- IMS and tags in place of the older Analytics frameworks in AEM, which no longer work. Adobe: "As a result, legacy frameworks that use user credentials no longer work. Migrate to the IMS-based configuration in the Touch UI and Adobe Launch." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL11 | Analytics configuration and tags on AEM Sites | one-time | 24 | 40 | 72 | yes |  |

- **XL11 Analytics configuration and tags on AEM Sites.** Create the IMS and Analytics cloud configurations in AEM, attach them to your client's site, set up the tags property with the Adobe Analytics extension and rules built on the AEM data layer, and check page views in the report suite. Evidence: "The integration requires: using the Touch UI to create an Analytics configuration in AEM as a Cloud Service." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics)

**Client voice.** How: Your AEM site is connected to an Adobe Analytics report suite, and a tags property with the Adobe Analytics extension sends page views and interactions from your pages to Analytics. Gain: Your pages report to Adobe Analytics from the first release, and your marketers change tracking in tags without a code release.

### Adobe Analytics + AEM Assets (`aa-aemassets`)

**Kind:** native. **Label:** Assets Insights shows image impressions and clicks in AEM Assets, read from an Analytics report suite.

**How:** Assets Insights reads impressions and clicks for images from an Adobe Analytics report suite that has AEM Assets Reporting enabled, through the Analytics API with a server-to-server credential, and shows usage scores on each image and folder in AEM Assets. Source: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights

**Gain:** Know which images earn their place. Your client's content team sees how often each image is shown and clicked on its sites, and uses that to choose, retire and relicense assets on evidence.

**Flows:**

- Adobe Analytics to AEM Assets: Impressions and clicks for each image, fetched on a schedule and shown as scores and trends (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)
- AEM Assets to Adobe Analytics: Asset ID, asset source and clicked asset ID dimensions, and asset impression and click events, in the report suite (https://experienceleague.adobe.com/en/docs/analytics/integration/aem-assets-reporting)

**Availability:** Adobe says an Adobe Analytics license is required, and that insights are provided for images only. Adobe: "You must have an Adobe Analytics license to use this feature." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)

**Prerequisites:**

- AEM Assets as a Cloud Service and an Adobe Analytics license. Adobe: "You must have an Adobe Analytics license to use this feature." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)
- AEM Assets Reporting enabled on the report suite used for Assets Insights. Adobe: "Enables Analytics to collect impressions and clicks on Assets served up from AEM Asset Insights." (https://experienceleague.adobe.com/en/docs/analytics/integration/aem-assets-reporting)
- An Adobe Developer Console project with the Adobe Analytics API and a server-to-server OAuth credential. Adobe: "Add the Adobe Analytics API to the project." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)
- Images only: other asset types get no insights. Adobe: "Insights are supported and provided only for images." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL12 | Assets Insights setup and first report | one-time | 16 | 32 | 56 | yes |  |

- **XL12 Assets Insights setup and first report.** Enable AEM Assets Reporting on the report suite, create the server-to-server credential with the Analytics API, configure Assets Insights in AEM, add the tracking to your client's pages, and show the content team how to read scores in the Insights view. Evidence: "Experience Manager Assets fetches usage data about digital assets deployed on third-party websites directly from Adobe Analytics." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)

**Client voice.** How: AEM Assets reads impressions and clicks for your images from an Adobe Analytics report suite and shows them as scores on each image and folder. Gain: Your content team sees how often each image is shown and clicked on your sites, and chooses, retires and relicenses assets on evidence.

### Adobe Analytics + Edge Delivery Services (`aa-eds`)

**Kind:** extension. **Label:** Adobe's martech plugin sends Edge Delivery page views and events through Web SDK to an Analytics report suite.

**How:** On an Edge Delivery Services site, Adobe's martech plugin loads Web SDK, the Adobe Client Data Layer and tags in a way that protects page speed, and sends page views and custom events through a datastream to an Adobe Analytics report suite once the page has rendered. Source: https://www.aem.live/developer/martech-integration

**Gain:** Analytics on a fast site, without slowing it down. Your client's Edge Delivery pages report to Adobe Analytics after the page has rendered, so tracking does not cost the page speed the site was built for.

**Flows:**

- Edge Delivery Services to Adobe Analytics: Page views, page metadata and custom events, sent through Web SDK and a datastream to the report suite (https://www.aem.live/developer/martech-integration)

**Availability:** Not stated on the aem.live page. The tool's Target and Real-Time CDP cards for Edge Delivery describe the same plugin as available through AEM Engineering. Adobe: "The stack combines Adobe Experience Platform WebSDK, Adobe Analytics, Adobe Target or Adobe Journey Optimizer, Adobe Client Data Layer and Adobe Experience Platform Tags." (https://www.aem.live/developer/martech-integration)

**Prerequisites:**

- The aem-martech plugin installed in the site's code repository from Adobe's GitHub project, which the tool's other Edge Delivery cards describe as coming through AEM Engineering. Adobe: "Follow the technical steps documented in the aem-martech GitHub repository" (https://www.aem.live/developer/martech-integration) Statement of work: Adobe confirms that the aem-martech plugin is available for the Client's Edge Delivery site before this service starts.
- Adobe Analytics, and Target or Journey Optimizer, which the plugin guide lists together. Adobe: "Before you can leverage this plugin, please make sure you have access to:" (https://www.aem.live/developer/martech-integration)
- A datastream connected to the Analytics report suite. Adobe: "Datastream in the Adobe Experience Platform to connect to your Adobe Target and Adobe Analytics solutions" (https://www.aem.live/developer/martech-integration)
- A tags container with the Adobe Client Data Layer extension, and without the Web SDK or Analytics extensions, which the plugin adds itself. Adobe: "you do not add the Adobe Experience Platform Web SDK, the Adobe Analytics or the Adobe Target extensions." (https://www.aem.live/developer/martech-integration)
- A consent platform connected to the plugin, which holds consent as pending by default. Adobe: "This library defaults user consent to pending to comply with privacy regulations." (https://www.aem.live/developer/martech-integration)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL13 | Analytics on Edge Delivery pages | one-time | 24 | 40 | 72 | yes |  |

- **XL13 Analytics on Edge Delivery pages.** Install and configure the martech plugin in your client's site repository, connect the datastream to the report suite, set up the tags container and the data layer events, connect the consent platform, and check page views in Analytics and the effect on page speed. Evidence: "Once the page is fully rendered, the Adobe Analytics instrumentation is done and key business events are captured." (https://www.aem.live/developer/martech-integration)

**Client voice.** How: A plugin from Adobe loads the Web SDK and tags on your Edge Delivery pages after they render and sends page views and events through a datastream to your Adobe Analytics report suite. Gain: Your Edge Delivery pages report to Adobe Analytics without giving up the page speed the site was built for.

### Adobe Analytics + Adobe Commerce (`aa-commerce`)

**Kind:** extension. **Label:** Commerce's Data Connection extension sends storefront events through a datastream to an Analytics report suite.

**How:** The Data Connection extension (the Experience Platform connector) sends Adobe Commerce storefront events to the Edge Network, and a datastream with the Adobe Analytics service forwards them to a report suite, on a schema that carries the Adobe Analytics commerce field group. Source: https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce

**Gain:** Storefront behavior in the reports the business already reads. Product views, cart additions and orders from your client's Commerce store show up in Adobe Analytics without hand-built tagging on each storefront page.

**Flows:**

- Adobe Commerce to Adobe Analytics: Storefront and order events, sent by the Data Connection extension through a datastream to the report suite (https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview)

**Availability:** Not stated by Adobe. The tutorial is written for Adobe Commerce cloud projects and says self-hosted projects can vary. Adobe: "These instructions are for Adobe Commerce Cloud hosted projects. Self-hosted can vary to some degree, but the overall process should be similar." (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)

**Prerequisites:**

- Adobe Commerce with the Data Connection extension installed and configured. Adobe: "Follow the individual instructions here and return when completed to finish the remaining steps Install and configure the Experience Platform connector" (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)
- Access to Adobe Analytics for the organization, and a report suite for the Commerce data. Adobe: "Verify that your organization has (and you have) access to Adobe Analytics." (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)
- An XDM schema with the Adobe Analytics ExperienceEvent Commerce field group. Adobe: "Select the Adobe Analytics ExperienceEvent Commerce by checking the box" (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)
- A datastream with the Adobe Analytics service and the report suite ID. Adobe: "Click Add Service and choose Adobe Analytics in the drop-down field." (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL14 | Commerce storefront events into a report suite | one-time | 24 | 48 | 80 | yes |  |
| XL15 | Commerce reports in Analysis Workspace | one-time | 16 | 24 | 48 | optional |  |

- **XL14 Commerce storefront events into a report suite.** Install and configure the Data Connection extension with your client's Commerce team, build the schema with the Analytics commerce field group, create the datastream to the report suite, and check product, cart and order events in Analytics. Evidence: "Create a new report suite in Adobe Analytics, or identify the ID of the report suite that you will be pushing Commerce data into." (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)
- **XL15 Commerce reports in Analysis Workspace.** Build your client's first commerce project in Analysis Workspace on the new data: product performance, cart and checkout fallout and revenue by marketing channel. Evidence: "Finally, to view your Commerce data, you will need to navigate to Analysis Workspace in Adobe Analytics, create a project, choose your report suite, and add freeform tables and other visualizations to report on and analyze your Commerce data." (https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce)

**Client voice.** How: An Adobe Commerce extension sends your storefront events, such as product views, cart additions and orders, through a datastream to your Adobe Analytics report suite. Gain: Your store's behavior shows up in the Adobe Analytics reports your business already reads, without hand-built tagging on each storefront page.

### Adobe Analytics + Coworker (`aa-cw`)

**Kind:** native. **Label:** Coworker Chat answers questions from Adobe Analytics report suites, with the user's own Analytics permissions.

**How:** Coworker Chat queries Adobe Analytics report suites from a plain-language prompt through the Adobe Analytics integration, with the user's own Analytics permissions: it pulls metrics and segments, runs funnels and forecasts, looks for the cause of a change, and opens a visualization in Analysis Workspace. Source: https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview

**Gain:** Answers from Analytics for people who do not build reports. Your client's marketers ask a question in plain words and get the chart and the reason behind a change, and analysts spend less time on one-off requests.

**Flows:**

- Adobe Analytics to Coworker: Metrics, dimensions, segments and report suites the user can already see, queried by Coworker Chat (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
- Coworker to Adobe Analytics: Visualizations from a chat, opened as a new Analysis Workspace project (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-chat)

**Availability:** Adobe says Coworker Chat is generally available, lists Adobe Analytics among its compatible applications, and licenses it through the Adobe account team. Adobe: "Coworker Chat is generally available." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview)

**Prerequisites:**

- Adobe's Workfront documentation says Coworker in Workfront is not currently available to health care and finance organizations; Adobe states no such limit for this connection, so confirm eligibility with Adobe for your client. Adobe: "Coworker is not currently available to organizations in health care, finance, or some other industries with sensitive data." (https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview) Statement of work: Adobe confirms that Coworker is available to the Client's organization before this service starts.
- Coworker Chat licensed for your client's organization through the Adobe account team, and set up by Adobe's onboarding. Adobe: "Licensing: Contact your Adobe account representative or sales team to confirm you have the right licenses and entitlements." (https://experienceleague.adobe.com/en/docs/coworker/content/home) Statement of work: Adobe confirms that Coworker Chat is licensed and enabled for the Client's organization before this service starts.
- The Adobe Analytics integration connected in Coworker for each user. Adobe: "Select the Integrations tab, then make sure that cja-mcp and aa-mcp are available in your list of connected servers." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-chat)
- View access in Adobe Analytics to the report suites and components each user asks about. Adobe: "Coworker Chat inherits permissions from Customer Journey Analytics or Adobe Analytics." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
- A preferred report suite stored in Coworker's memory, where a user has access to several. Adobe: "It's a good practice to add your preferred data views or report suites as preferences in Coworker's memory." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-chat)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL16 | Coworker Chat on Analytics report suites | one-time | 8 | 16 | 32 | yes |  |
| XL17 | Vetted prompts and skills for Analytics questions | one-time | 16 | 24 | 40 | yes |  |

- **XL16 Coworker Chat on Analytics report suites.** Check that the Adobe Analytics integration is connected in Coworker Chat, give your client's pilot users view access to the right report suites, store each user's preferred report suite in memory, and test funnel, comparison and cause-of-change questions against Analysis Workspace. Evidence: "Coworker Chat accesses data from your Customer Journey Analytics data views or Adobe Analytics report suites, allowing you to explore data and get answers with natural-language prompts." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
- **XL17 Vetted prompts and skills for Analytics questions.** Work with an analyst your client names as its Coworker champion to write and test a library of prompts and skills that use only the approved metrics, segments and report suites, and train business users to ask and check answers. Evidence: "Create a library of vetted prompts and skills that correlate with the data and components that are available to users." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)

**Client voice.** How: Coworker Chat reads your Adobe Analytics report suites with each user's own permissions. Your teams ask a question in plain words, and Coworker pulls the metrics, runs the funnel or looks for the cause of a change, and can open the result in Analysis Workspace. Gain: Your marketers get an answer and the reason behind a change without building a report, and your analysts spend less time on one-off requests.

### Adobe Analytics + Audience Manager (`aa-aam`)

**Kind:** native. **Label:** Audience Analytics: Analytics forwards hits to Audience Manager server side, and Audience Manager segments show as dimensions in Analytics.

**How:** With server-side forwarding, each hit Analytics receives is passed to Audience Manager in real time, so no separate Audience Manager call is made from the page. Through Audience Analytics, the visitor's Audience Manager segments come back on the same hit and appear as audience dimensions in Analytics. Analytics segments can also be published to the Experience Cloud for use in Audience Manager. Source: https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam

**Gain:** Audiences in the reports, and one less call on the page. Your client's analysts break any report down by Audience Manager segment, such as CRM or ad-exposure audiences, and the page makes one fewer call because Analytics forwards its data to Audience Manager.

**Flows:**

- Adobe Analytics to Audience Manager: Every Analytics hit, forwarded server side in real time for trait qualification (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/server-side-forwarding/ssf)
- Audience Manager to Adobe Analytics: Segment IDs for the visitor, returned on the same hit and shown as Audience ID and Audience Name dimensions (https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam)
- Adobe Analytics to Audience Manager: Published Analytics segments, with membership shared to Audience Manager (https://experienceleague.adobe.com/en/docs/analytics/components/segmentation/segmentation-workflow/seg-publish)

**Availability:** Not stated by Adobe beyond the prerequisites: a customer of both products, on the same Adobe organization, with server-side forwarding in place. Adobe: "You are a customer of both Audience Manager and Adobe Analytics." (https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam)

**Prerequisites:**

- Licenses for both Audience Manager and Adobe Analytics, with report suites mapped to the same Adobe organization. Adobe: "Adobe Audience Manager and Adobe Analytics report suites are mapped to the same Adobe organization." (https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam)
- The Visitor ID service on the site, at the minimum release Adobe names on its page. Adobe: "You need to implement the Visitor ID Service before server-side forwarding will work." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/server-side-forwarding/ssf-requirements)
- Server-side forwarding with the Audience Management module, and no separate Audience Manager page code. Adobe: "You use server-side forwarding and have implemented the Audience Management module (no DIL code)" (https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam)
- An Audience Manager administrator, because other roles cannot create an Analytics destination. Adobe: "To configure an Analytics destination, your Audience Manager user must have Admin permissions." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/experience-cloud-destinations/create-analytics-destination)
- For published Analytics segments: the report suite enabled for the Experience Cloud and the Segment Publishing permission. Adobe: "Before you can publish segments, your Admin needs to assign the Segment Publishing permission to a product profile in the Admin Console" (https://experienceleague.adobe.com/en/docs/analytics/components/segmentation/segmentation-workflow/seg-publish)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL18 | Server-side forwarding to Audience Manager | one-time | 16 | 32 | 56 | yes |  |
| XL19 | Audience Manager segments in Analytics reports | one-time | 16 | 24 | 40 | yes |  |
| XL20 | Analytics segments published to Audience Manager | one-time | 8 | 16 | 32 | optional |  |

- **XL18 Server-side forwarding to Audience Manager.** Check the Visitor ID service on your client's site, replace the separate Audience Manager page code with the Audience Management module in step with turning server-side forwarding on for each report suite, and verify the forwarded hits and the consent setting. Evidence: "Current Audience Manager customers who use Analytics should migrate to server-side forwarding." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/server-side-forwarding/ssf)
- **XL19 Audience Manager segments in Analytics reports.** Configure the Analytics destination in Audience Manager, map the report suites and the segments to share under your client's data export controls, and build the first Analysis Workspace views on the audience dimensions. Evidence: "Segments are shared from Adobe Audience Manager to Analytics in real time, to inform audience discovery, segmentation, and optimization." (https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam)
- **XL20 Analytics segments published to Audience Manager.** Choose with your client which Analytics segments to publish within the limit for each report suite, set the audience creation window, and check that each one arrives in Audience Manager with its membership, ready for activation. Evidence: "Use these segments to activate audiences in Audience Manager to all downstream destinations." (https://experienceleague.adobe.com/en/docs/analytics/components/segmentation/segmentation-workflow/seg-publish)

**Client voice.** How: Adobe Analytics forwards each hit to Audience Manager from its own servers, and Audience Manager returns the visitor's segments on the same hit, so they show as audience dimensions in your Analytics reports. Analytics segments can also be published for use in Audience Manager. Gain: Your analysts break any report down by audience, such as CRM or ad-exposure audiences, and your pages make one fewer call.

### Audience Manager + Real-Time CDP (`aam-rtcdp`)

**Kind:** platform. **Label:** Audience Manager source connector and Experience Cloud Audiences destination, used in the order Adobe's guide to moving to Real-Time CDP sets out.

**How:** Adobe's guide for moving from Audience Manager to Real-Time CDP starts with sorting segments by whether Real-Time CDP can rebuild them. The Audience Manager source connector then streams first-party traits and segments into Experience Platform, and the Experience Cloud Audiences destination sends Real-Time CDP audiences back to Audience Manager for the destinations and data that still live there. Source: https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp

**Gain:** A planned move off cookie-based audiences. Your client keeps activating the audiences that work today while it rebuilds them on first-party identities in Real-Time CDP, in an order Adobe's own guide sets out, without a gap in campaigns.

**Flows:**

- Audience Manager to Real-Time CDP: First-party traits and segments, and real-time and profile data, streamed through the Audience Manager source connector (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/audience-manager)
- Real-Time CDP to Audience Manager: Real-Time CDP audiences, which appear in Audience Manager as signals, traits and segments (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

**Availability:** Adobe says the Experience Cloud Audiences destination is available to Real-Time CDP Prime and Ultimate customers and can be configured on one sandbox for each organization. The source connector is self-service. Adobe: "This destination is available to Adobe Real-Time Customer Data Platform Prime and Ultimate customers." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

**Statement of work condition for availability:** The Client holds Real-Time CDP Prime or Ultimate where Real-Time CDP audiences are sent back to Audience Manager.

**Prerequisites:**

- Licenses for both Audience Manager and Real-Time CDP. Adobe: "You need the Audience Manager source connector and the Experience Cloud Audiences destination in Experience Platform to enable audience sharing between Audience Manager and Adobe Experience Platform." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-experience-platform/aam-aep-audience-sharing)
- A reviewed profile allowance: each segment sent from Audience Manager adds its population to the Real-Time CDP profile count. Adobe: "This means that selecting all segments can potentially lead to a Profile count in excess of your license usage entitlement." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/audience-manager)
- A custom identity namespace created when the source connector asks for one on first setup. Adobe: "Create a custom namespace in Identity Service with the specified identity symbol" (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/audience-manager)
- For audiences sent back to Audience Manager: Real-Time CDP Prime or Ultimate, and one sandbox chosen for the destination. Adobe: "Currently, you can configure the Experience Cloud Audiences destination on a single sandbox per organization." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)
- Where the older audience-sharing integration is in use: Adobe Customer Care disables it first, and exports pause until the new connection is made. Adobe: "you must contact Customer Care to disable the legacy integration before using this destination." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences) Statement of work: Adobe confirms that the earlier audience-sharing integration is disabled for the Client's organization before this service starts.

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL21 | Segment triage for the move to Real-Time CDP | one-time | 24 | 40 | 80 | yes |  |
| XL22 | Audience Manager source connector | one-time | 16 | 32 | 56 | yes |  |
| XL23 | Real-Time CDP audiences back to Audience Manager | one-time | 16 | 24 | 40 | optional | Needs Real-Time CDP Prime or Ultimate |

- **XL21 Segment triage for the move to Real-Time CDP.** Break your client's Audience Manager segments down to their signals, traits and data sources, sort them into the three groups Adobe recommends (send as they are, rebuild with data gaps, cannot be rebuilt), and agree the order in which destinations move. Evidence: "As you consider the evolution from Audience Manager to Real-Time CDP, now is a critical time to analyze your Audience Manager segments and determine what the signals, traits, and rules are that make up those segments." (https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp)
- **XL22 Audience Manager source connector.** Set up the source connector with only the agreed traits and segments, create the identity namespace it asks for, enable the right datasets for Profile, and watch the profile count against your client's allowance as segments arrive. Evidence: "The Adobe Audience Manager source streams first-party data collected in Adobe Audience Manager for activation in Adobe Experience Platform." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/audience-manager)
- **XL23 Real-Time CDP audiences back to Audience Manager.** Connect the Experience Cloud Audiences destination, choose which Real-Time CDP audiences Audience Manager still needs for cookie-based destinations or modeling, and check that they arrive as traits and segments. Evidence: "Segments that have rules that can be supported in Real-Time CDP but have activation dependencies to Audience Manager could be sent to Audience Manager via the Experience Cloud Audiences destination card." (https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp)

**Client voice.** How: We sort your Audience Manager segments by whether Real-Time CDP can rebuild them. A connector then streams your first-party traits and segments into Adobe Experience Platform, and Real-Time CDP audiences can be sent back to Audience Manager for the destinations that still need it. Gain: You keep activating the audiences that work today while you rebuild them on first-party identities in Real-Time CDP, without a gap in your campaigns.

### Audience Manager + Target (`aam-target`)

**Kind:** native. **Label:** Audience Manager segments appear in Target's audience list through the Experience Cloud ID service and Profiles and Audiences.

**How:** With the Experience Cloud ID service on the site and Profiles and Audiences provisioned by Adobe, every Audience Manager segment appears in Target's audience list and can be used to target an activity. Source: https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration

**Gain:** Personalization for audiences built from every source. Your client's Target activities reach audiences built in Audience Manager from site, CRM and other sources, not only from what Target sees on the page.

**Flows:**

- Audience Manager to Target: All Audience Manager segments, listed in Target with Experience Cloud as their source (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)

**Availability:** Adobe says the integration needs the Experience Cloud ID service and provisioning for Profiles and Audiences, which Adobe Customer Care sets up on request. Adobe: "If you're not provisioned for Profiles and Audiences, contact Customer Care to get started." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)

**Statement of work condition for availability:** Adobe has provisioned Profiles and Audiences for the Client's organization.

**Prerequisites:**

- Licenses for both Audience Manager and Target. Adobe: "This integration lets you send Audience Manager segments to Adobe Target." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)
- The Experience Cloud ID service on the site. Adobe: "The Experience Cloud service. If you're not using this service, see the implementation guides to get started." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)
- Profiles and Audiences provisioned for the organization by Adobe Customer Care. Adobe: "Profiles and Audiences. If you're not provisioned for Profiles and Audiences, contact Customer Care to get started." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration) Statement of work: Adobe confirms that Profiles and Audiences is provisioned for the Client's organization before this service starts.
- An agreed short list of segments for Target, because every Audience Manager segment appears there. Adobe: "All of your Audience Manager segments will appear in Target shortly after you complete these steps in the implementation process." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL24 | Audience Manager segments in Target activities | one-time | 16 | 24 | 40 | yes |  |

- **XL24 Audience Manager segments in Target activities.** Check the ID service and request provisioning with your client, confirm the segments show in Target's audience list, agree naming so testers find the right ones, and use them in the first targeted activity. Evidence: "All of your Audience Manager segments will appear in Target shortly after you complete these steps in the implementation process." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)

**Client voice.** How: Your Audience Manager segments appear in Target's audience list, so a Target activity can be aimed at any of them. Gain: Your personalization reaches audiences built from site, CRM and other sources, not only from what Target sees on the page.

### Audience Manager + Marketo Engage (`aam-marketo`)

**Kind:** native. **Label:** Marketo lists become Audience Manager traits and a segment; only list membership is shared, for people Marketo has matched to an Experience Cloud ID.

**How:** A Marketo static list sent to the Experience Cloud is written to Audience Manager as two traits, one on hashed email and one on the Experience Cloud ID, plus a segment with the list's name; a synced list keeps the membership up to date. Source: https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud

**Gain:** Known leads in advertising audiences. Your client's Marketo lists, such as open opportunities or event registrants, become Audience Manager segments it can target or suppress in advertising and on the site.

**Flows:**

- Marketo Engage to Audience Manager: List membership only, as a hashed-email trait, an Experience Cloud ID trait and a segment named after the list (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)

**Availability:** Adobe says a HIPAA-ready deployment of Marketo Engage cannot use this feature. Adobe: "A HIPAA-ready deployment of a Marketo Engage instance cannot use this feature." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)

**Statement of work condition for availability:** The Client's Marketo Engage instance is not a HIPAA-ready deployment.

**Prerequisites:**

- Marketo Engage and Audience Manager in the same Adobe organization, with Adobe organization mapping set up in Marketo by an organization administrator. Adobe: "For the integration to work, Marketo and your other Adobe applications must be in the same org." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/set-up-adobe-organization-mapping)
- A Marketo Engage instance that is not a HIPAA-ready deployment. Adobe: "A HIPAA-ready deployment of a Marketo instance cannot use this integration." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/set-up-adobe-organization-mapping)
- Marketo's Munchkin script and Adobe's visitor ID code loaded together on the pages that matter, so people are matched. Adobe: "For the best possible results, it is recommended that you load Marketo's munchkin.js tracking script in parallel with Adobe's visitor.js tracking code on all of the pages you are interested in tracking for marketing purposes." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)
- Lists that hold people with a matched Experience Cloud ID: an empty or unmatched list is not shared. Adobe: "If a list is empty, or has no people with ECID values, the list name will not be pushed to be referenced outside of Marketo." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL25 | Marketo lists as Audience Manager segments | one-time | 16 | 24 | 40 | yes |  |

- **XL25 Marketo lists as Audience Manager segments.** Set up Adobe organization mapping and the cookie sync, send the agreed Marketo lists as synced lists to an Audience Manager folder, check the traits and segment each one creates and the match rate, and map the segments to your client's destinations. Evidence: "Marketo will also create a segment in your Audience Manager Instance using the ECID trait as the sole segmentation criterion." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)

**Client voice.** How: A Marketo list you send to the Experience Cloud becomes traits and a segment in Audience Manager. Only list membership is shared, for the people Marketo has matched to an Adobe visitor ID. Gain: Your Marketo lists, such as open opportunities or event registrants, become audiences you can target or suppress in advertising and on your site.

### Audience Manager + Real-Time CDP Collaboration (`aam-collab`)

**Kind:** native. **Label:** Collaboration sources eligible first-party Audience Manager segments on a schedule, for overlap analysis and activation.

**How:** Real-Time CDP Collaboration connects to an Audience Manager instance in the same Adobe organization and, on a schedule your client sets, sources eligible first-party segments for overlap analysis and activation in collaboration projects. Source: https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing

**Gain:** Existing segments ready for partner collaboration. Your client brings the first-party segments it already has in Audience Manager into Collaboration, and starts overlap analysis with partners without rebuilding those audiences first.

**Flows:**

- Audience Manager to Real-Time CDP Collaboration: Membership of eligible first-party segments, by Demdex ID, GAID or IDFA, refreshed every one to six days (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)

**Availability:** Adobe says only segments built from first-party data and created or updated in the last 13 months can be sourced, and that both products must be under the same Adobe organization. Adobe: "Only segments built from first-party data sources are eligible." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)

**Prerequisites:**

- An active Audience Manager contract and instance, and a Collaboration account that has finished onboarding. Adobe: "An active Adobe Audience Manager contract and a provisioned Audience Manager instance." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)
- Both under the same Adobe organization: sourcing across organizations is not supported. Adobe: "Your Audience Manager instance and Collaboration account provisioned under the same Adobe IMS Organization. Cross-organization sourcing is not supported." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)
- Segments built on first-party traits only, created or updated in the last 13 months. Adobe: "Only segments that were created or updated within the last 13 months are available for sourcing." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)
- Consent and opt-outs enforced in Audience Manager before the connection is made, because Adobe does not apply them again afterwards. Adobe: "Adobe does not re-apply consent rules after data leaves Audience Manager." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)
- A refresh interval no shorter than the segments' own refresh, since each refresh uses Collaboration credits. Adobe: "Setting a Collaboration refresh interval shorter than this may consume Collaboration credits without updated results." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)

| id | Service | Unit | Low | Base | High | Starts with | Needs |
|---|---|---|---|---|---|---|---|
| XL26 | Audience Manager segments sourced into Collaboration | one-time | 16 | 24 | 40 | yes |  |

- **XL26 Audience Manager segments sourced into Collaboration.** Check consent handling and segment eligibility in your client's Audience Manager, create the data connection in Collaboration, set the refresh schedule and dates, select the agreed segments, and confirm they are ready for overlap analysis. Evidence: "After you create the connection, Collaboration retrieves audience membership from Adobe Audience Manager on a recurring schedule and makes those audiences available for overlap analysis and activation within your collaboration projects." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)

**Client voice.** How: Real-Time CDP Collaboration connects to your Audience Manager and, on a schedule you set, brings in your eligible first-party segments for overlap analysis and activation with partners. Gain: You start collaborating with partners on the first-party segments you already have, without rebuilding those audiences first.

## Not connections

- **aa-ca.** Not found. The four pages linked from the Content Analytics overview in the Customer Journey Analytics guide do not name Adobe Analytics (0 mentions); Content Analytics is part of Customer Journey Analytics and reports from a CJA data view. (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- **aa-bc.** A developer note, not a setup. Brand Concierge's web client has an event callback that a page can use to send engagement data to Adobe Analytics or any other system; no page describes a Brand Concierge to Analytics configuration or what a report suite receives. Adobe: "The event callback system lets a page observe Web Client lifecycle events, user interactions, responses, feedback, and errors in real time, useful for sending engagement data to Adobe Analytics, Google Analytics, or other third-party systems." (https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/developer-customization-guide)
- **aa-mmm.** One example in a list, no setup steps. Marketing Campaign Analytics accepts any Experience Platform dataset, and names data from the Analytics source connector as one example. The work is the source connector (XL04 on aa-rtcdp) plus the existing line XD09; a second card would repeat both. Adobe: "Data collected using the Adobe Analytics source connector. And transformed into datasets conforming to the default or a custom version of the Adobe Analytics schema." (https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview)
- **aam-aemsites.** Removed by Adobe. The AEM 6.5 integration overview says the Audience Manager integration was removed in AEM 6.3, and this morning's pass found no AEM as a Cloud Service integration page. Adobe: "The Audience Manager integration has been removed in AEM 6.3." (https://experienceleague.adobe.com/en/docs/experience-manager-65/content/sites/administering/integration/marketing-cloud)
- **aa with Sites Optimizer, Workfront, Workfront Planning, Real-Time CDP Collaboration, Journey Optimizer B2B Edition, GenStudio for Performance Marketing, Adobe Express, Creative Cloud, Frame.io, the Firefly products and Brand Intelligence.** Not documented. This morning's map-level pass searched each product's guide for Adobe Analytics and found no integration page; the Analytics integration guide's table of contents (25 entries) names only Audience Manager, Advertising, Target, Campaign and AEM Assets. Nothing new was found in this pass. Adobe: "This guide focuses on integrating multiple Adobe CX Enterprise solutions, such as Audience Manager, Advertising, or Target." (https://experienceleague.adobe.com/en/docs/analytics/integration/home)
- **aam with every product in the tool other than Real-Time CDP, Target, Adobe Analytics, Marketo Engage and Real-Time CDP Collaboration.** Not documented. The Audience Manager guide's table of contents (344 entries) has integration sections for Experience Platform, Target and Analytics only; this morning's pass searched the Journey Optimizer, Customer Journey Analytics, Commerce, Brand Concierge, Coworker, Workfront, Sites Optimizer and Experimentation Accelerator pages and found no mention. Audience Manager reaches those products only through Experience Platform. (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/implementation-and-integration)

## Left out, and why

- **Adobe Analytics + Brand Visibility (the aa-bv connection).** Adam, Nov 10 2026: Brand Visibility is not pitched with Adobe Analytics, and connects with Customer Journey Analytics. Adobe documents the integration; the tool shows no line and no service feeds Adobe Analytics data to Brand Visibility. Adobe: "The Adobe Analytics integration connects Adobe Brand Visibility with your organization's Adobe Analytics data so you can measure how AI-driven discovery translates into real website engagement and business outcomes." (https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/adobe-analytics-integration)
- **Adobe Analytics + Experimentation Accelerator (the aa-xa connection).** Already in the tool. The existing line EX04, Primary metrics from CJA or Adobe Analytics, covers the one thing Adobe documents for this pair. A second copy is not written; when aa joins the canvas, EX04 can sit on an aa-xa card. Adobe: "Changing the primary metric applies to teams that use Customer Journey Analytics or Adobe Analytics as the reporting source for experiments created in Adobe Target or Adobe Journey Optimizer" (https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **Adobe Analytics + AEM Forms (the aa-aemforms connection).** Already in the tool. The existing AEM Forms line AF09, Form analytics with Adobe Analytics, covers it and names Adobe Analytics as a product outside the tool. A second copy is not written; when aa joins the canvas, AF09 can move to an aa-aemforms card and lose its "Also needs" tag. Adobe: "When an event occurs on an adaptive form, AEM Forms send these data elements to Adobe Analytics." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/integrate-aem-forms-with-adobe-analytics)
- **Migrating Analytics projects to Customer Journey Analytics with Coworker.** Adobe keeps it in a limited testing phase. XL08 uses the Component migration tool in the Adobe Analytics interface, which carries no such label. Adobe: "The functionality described in this article is in the Limited Testing phase of release and might not be available yet in your environment." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/migrate-projects-aa-cja)
- **Coworker inside the Adobe Analytics interface (the in-product experience).** Adobe's table marks the in-product experience for Adobe Analytics as coming soon. XL16 and XL17 use the Coworker workspace, which the same table marks as available. Adobe: "Coworker Chat is available as an immersive experience, a full-page workspace, and as an in-product experience in some CX Enterprise applications." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/ui-guide)
- **Legacy classifications: the classification rule builder and the classification importer.** Adobe says these methods are being retired. AN02 uses classification sets. Adobe: "These methods will be deprecated in the near future and will no longer be accessible." (https://experienceleague.adobe.com/en/docs/analytics/components/classifications/classifications-overview)
- **Adobe Analytics Foundation Pack for Experience Cloud, as something to sell or scope around.** Adobe no longer sells or renews it. It is listed as a tier only so a partner checks what a client holds; the AEM Sites integration page still tells AEM customers they can ask for it. Adobe: "The Adobe Analytics Foundation Pack for Experience Cloud offering is designated for end-of-life status." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
- **Adobe Analytics 1.4 APIs and the older AEM Analytics frameworks.** Shut down by Adobe. No line rests on them; XL11 and XL12 use IMS, server-to-server OAuth and the 2.0 API. Adobe: "Analytics 1.4 APIs August 31, 2026 Adobe Analytics 2.0 APIs" (https://experienceleague.adobe.com/en/docs/discontinued/using/overview)
- **Labs in Adobe Analytics.** Adobe describes Labs as early access to features under evaluation. Nothing is costed on it. Adobe: "You can use Labs to get early access to Adobe Analytics innovations" (https://experienceleague.adobe.com/en/docs/analytics/analyze/labs)
- **Audience Marketplace and third-party data in Audience Manager.** Not a partner service: Adobe's sales specialist activates it and it handles the contracts and billing between data buyers and sellers. It also depends most on third-party cookies, which Adobe warns limit a data management platform. AU03 rebuilds segments on first-party traits. Adobe: "Talk to your Audience Manager sales specialist to get started. They can activate Audience Marketplace for you." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/audience-marketplace/audience-marketplace)
- **Device Co-op in Audience Manager profile merge rules.** Discontinued by Adobe. AU06 uses authenticated profiles and hashed email, not the co-op device graph. Adobe: "All customers are expected to update any co-op Profile Merge Rules to utilize any options other than Device Co-op." (https://experienceleague.adobe.com/en/docs/discontinued/using/device-co-op)
- **The older audience-sharing integration from Experience Platform to Audience Manager.** Replaced by the self-service Experience Cloud Audiences destination, which XL06 and XL23 use. Where a client still has the older one, Adobe Customer Care disables it first; that is a prerequisite on aam-rtcdp, not a line. Adobe: "This destination replaces the legacy audience-sharing integration from Real-Time Customer Data Platform to various CX Enterprise solutions." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)
- **A new Audience Manager implementation.** Adobe's implementation guide describes its own teams leading the phases, and Adobe now publishes a guide for moving to Real-Time CDP. The Audience Manager lines here are for a client that already runs it; this is a question for Adam. Adobe: "Getting started with Audience Manager can take approximately six weeks to three months, depending on your data collection needs." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/implement-audience-manager)
- **Decommissioning Audience Manager at contract end.** Adobe support publishes an article on switching off an instance, including the warning that Target can lose shared audiences. It is the last step of a move that XL21 plans; no separate line is costed until Adam decides whether the tool should sell it. Adobe: "The primary objective is to isolate Adobe Audience Manager and halt any inbound or outbound connections." (https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-25631)
- **Role-based access controls and Audience Optimization reports in Audience Manager.** Both must be switched on by Adobe for the organization. AU01 and AU07 use the general, trend and overlap reports and the standard user groups. Adobe: "Before you can use RBAC, this feature must be enabled by Adobe for your organization." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/administration/administration-overview)
- **Streaming media analytics, Cross-Device Analytics, Live Stream and the Data Repair API.** Documented, not costed in this pass. Each is an add-on or an Ultimate-only feature with its own implementation, outside the starting scope for a mid-market client. Adobe: "Adobe Analytics - Live Stream Add-on includes Live Stream triggers, Live Stream dashboards, and Live Stream data features." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)
- **The Adobe Analytics MCP server for other AI clients.** Documented in the release notes as a permission administrators grant. Coworker uses it (XL16); connecting other AI tools to it is left to the partner's own service. Adobe: "Administrators can now give users read-only access to the Adobe Analytics MCP server." (https://experienceleague.adobe.com/en/docs/analytics/release-notes/latest)

## Documented, but not costed

- **Customer Attributes** (CRM attributes uploaded to the Experience Cloud and used in Analytics). Limited to 3 attributes on Select and 15 on Prime; left to the partner's own service.
- **Report Builder** (the Excel add-in). The old add-in is retired and the new one installs from the Microsoft Store; covered inside AN04 only if the client asks for Excel reports.
- **Virtual report suites and curation.** Part of AN02 and AN04 where the solution design calls for them; not a line of their own.
- **Mobile app data collection with the Mobile SDK.** AN03 is written for web. A client with apps needs the same work again for each app, as the partner's own service or a larger AN03.
- **Look-alike models, Predictive Audiences and Audience Lab in Audience Manager.** Documented features; AU07 keeps existing ones running, and no line builds new ones on a platform the client is likely to leave.
- **Adobe Analytics segments published to the Experience Cloud for Target** (without Audience Manager). The segment publishing page covers it; XL20 is written for the Audience Manager case, and the Target case is the same steps.
- **The Analytics inventory tool.** Used inside XL08; a partner could also offer it alone as a short readiness review before a CJA decision.

## What a partner would get wrong

1. **One report suite is now the better default.** A partner who sets up a report suite for each site or brand out of habit builds work the client will undo. "While separate report suites were important in the past, having a single report suite has become more advantageous." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/c-new-report-suite/t-create-a-report-suite)
2. **The quickest Web SDK path ties the client to the Analytics schema.** That matters the day the client adds Customer Journey Analytics or Real-Time CDP. "This implementation method requires that you use a schema configured for Adobe Analytics." (https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/web-sdk/web-sdk-tag-extension) Adobe's own way around it is the data object, which is the route AN06 takes for an existing setup.
3. **A4T is not a switch.** Adobe has to provision it, it slows every Analytics report by a few minutes, and an activity reports from one source or the other. "After this integration is enabled, you will experience an extra 5-10 minutes of latency in Analytics." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/before-implement) "Use one reporting source or the other. You cannot collect data for a single activity from both sources." (https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4t)
4. **What the Analytics source connector sends is not what the reports show.** It copies hits before visit and visitor processing, so numbers in Experience Platform will not match Analysis Workspace line for line. "As a result, they do not include post-processed context, such as visit number." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/analytics)
5. **Privacy labels do not travel with the data.** A partner who assumes the report suite's labels follow it into Experience Platform leaves the dataset unlabeled, and deletion works differently there. "Experience Platform deletes matching rows instead, which can change reporting metrics." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/analytics)
6. **A report suite gets one dataflow, in one sandbox.** Three cards here (Real-Time CDP, CJA, Journey Optimizer) each start by creating it; it is created once. "Report suites can only be added to a single sandbox." (https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics)
7. **Real-Time CDP audiences reach Adobe Analytics only with an Audience Manager license**, and only on Real-Time CDP Prime or Ultimate. "To send audiences to Adobe Analytics, you need an Audience Manager license." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)
8. **Journeys cannot use Analytics events until Adobe turns the data source on.** The partner raises a request with the organization ID and the data source ID and waits. "This step is only required for Adobe Analytics data sources." (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics)
9. **A mapping made while migrating one project to CJA binds the whole organization.** The decision belongs in a workshop before the first project moves, which is why XL08 starts there. "Any mappings made on one project apply to all future projects across your entire IMS org, regardless of which user is performing the migration." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/prepare-component-migration) A4T, Segment comparison and Contribution Analysis panels do not migrate at all.
10. **Coworker sees exactly what the user sees, and builds nothing in Analytics.** It is not a way around permissions or a way to create segments for people. "You can access only those data views, report suites, dimensions, metrics, and segments available to you in Analysis Workspace." (https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
11. **Turning on server-side forwarding before the old Audience Manager code is removed doubles the data and the bill.** The two changes go out together. "Enabling this setting before removing DIL code will duplicate data and create additional billed server calls to Audience Manager." (https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/server-side-forwarding/ssf)
12. **Audience Manager segments in Analytics never show someone leaving.** A report can show a visitor in two segments that exclude each other. "If a visitor stops qualifying for a segment, this information is not forwarded to Adobe Analytics." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/experience-cloud-destinations/create-analytics-destination)
13. **Analytics segments published for activation are capped**, at 75 for each report suite and 20 million members. "You can publish up to 75 segments per report suite." (https://experienceleague.adobe.com/en/docs/analytics/components/segmentation/segmentation-workflow/seg-publish)
14. **Assets Insights is images only and needs a paid Analytics license**, and it stopped showing new data for anyone still on the old API until it is reconfigured. "Insights are supported and provided only for images." (https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights)
15. **Sending every Audience Manager segment into Real-Time CDP can blow through the profile allowance.** Adobe tells customers not to tick the select-all boxes. "Adobe encourages customers to configure the connection without selecting the Select all segments and Select all traits options, as shown below." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-experience-platform/aam-aep-audience-sharing)
16. **Real-Time CDP will not take every real-time segment Audience Manager has.** "Customers who use real-time segments in Audience Manager may be restricted by the current limitation of 500 streaming segments in Real-Time CDP." (https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp)
17. **Switching from the older audience sharing to the new destination stops exports for a while**, and the new destination works on one sandbox only. "The audience export from Real-Time CDP to your other solutions is stopped in the time between the ticket resolution and the time that a new connection is established through the destination card." (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)
18. **Moving Audience Manager's page code to Web SDK is an Analytics project too.** "Both must be migrated together." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/migrate-to-web-sdk/appmeasurement-to-web-sdk)
19. **Every Audience Manager segment shows up in Target, wanted or not.** Naming and a short list matter more than the setup. "All of your Audience Manager segments will appear in Target shortly after you complete these steps in the implementation process." (https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration)
20. **A Marketo list in Audience Manager is membership only, for matched people.** No lead fields come across, and the list is smaller than it was in Marketo. "No additional Person Attributes are shared to Adobe via this integration." (https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud)
21. **Collaboration takes Audience Manager segments as they are.** Consent is the client's job before the connection, and the identifiers are not converted. "Collaboration does not translate Demdex ID to ECID during sourcing." (https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing)
22. **Switching Audience Manager off can break Target and Analytics.** Adobe's own support article warns about it. "highlighting the importance of consulting with customers before disabling key features such as shared audiences (from Adobe Target) and the Marketing Cloud shared profile (from Adobe Analytics)" (https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-25631)
23. **The Foundation Pack is not a way to get a client started.** The AEM Sites page still tells AEM customers they can ask for it, but Adobe's product description closed it. "As such, as of January 1, 2024, Adobe is not offering any purchases, upsells, or renewals of this offering." (https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html)

## Overlaps with lines already in the catalog (flagged, not changed)

- **aa-cja (XL07, XL08) and CJ03 Adobe Analytics upgrade to CJA.** CJ03 bundles the whole move: Web SDK beside the source connector, API and export changes, project migration. XL07 and XL08 are the two pieces a client needs when it keeps Adobe Analytics and adds CJA. A statement of work should carry CJ03 or these two, not both; CJ03 could move to the aa-cja card as its larger option.
- **aa-target (XL01, XL02) and TC03 A4T to CJA reporting transition; TG04 Recommendations catalog and setup.** TC03 moves a client off A4T and XL01 puts a client on it: opposite directions, so one statement of work should not carry both. XL03 feeds Recommendations from Analytics and assumes TG04 or an existing Recommendations setup.
- **aa-rtcdp (XL04) and RT02 Data sources and ingestion setup; XL07; XL09.** RT02 connects the agreed sources in general; XL04 is the Analytics source in particular. XL07 (CJA) and XL09 (journeys) each create the same source dataflow, and a report suite can have only one, so a statement of work with more than one of XL04, XL07 and XL09 should count the dataflow once.
- **aa-aemsites (XL11) and aa-eds (XL13) and AN03 Data layer and Web SDK data collection; AXA04 AEM page data collection for CJA; XA22 and XA24 on Edge Delivery.** XL11 and XL13 are the AEM-specific and Edge Delivery-specific parts of an Analytics implementation; with AN03 in scope they add the site-side setup only. XL11 documents Adobe's Analytics extension route, where AXA04 uses Web SDK for CJA. XL13 uses the same martech plugin as XA22 and XA24.
- **aa-aemforms (not written) and AF09 Form analytics with Adobe Analytics.** AF09 already covers the pair and carries an "Also needs Adobe Analytics" tag. No second copy.
- **aa-xa (not written) and EX04 Primary metrics from CJA or Adobe Analytics.** EX04 already covers the pair. No second copy.
- **aa-commerce (XL14, XL15) and XA17 Commerce data in CJA reports and the Commerce to Real-Time CDP lines.** All of them start from the Data Connection extension and a datastream. Where that is already in scope, XL14 adds only the Analytics service on the datastream and the report suite.
- **aa-cw (XL16, XL17) and CW-CJA Coworker Skills for CJA reporting; XH01 and XH02 on Content Analytics.** The same Coworker analysis skills serve CJA and Adobe Analytics. A client with both needs one prompt and skill library, not two.
- **aam-marketo (XL25) and XB08 Share Marketo lists with Target.** XB08 sends Marketo lists to the Experience Cloud and uses them in Target; its card already says the lists reach Target through Audience Manager. XL25 is the same send, used in Audience Manager destinations. Count the organization mapping and the list send once.
- **aam-rtcdp (XL21 to XL23) and RT04 Audience build and destination activation.** Rebuilding segments and reconnecting destinations in Real-Time CDP after the triage is RT04's work; XL21 to XL23 stop at the triage, the source connector and the audiences sent back.
- **aa-aam (XL18) and AU02 and AN06 Move an existing tags setup to Web SDK.** Adobe says an AppMeasurement to Web SDK move covers Analytics and Audience Manager together. XL18 is server-side forwarding on the current libraries; AU02 and AN06 are the Web SDK route. A statement of work should pick one route.

## For the other helper (Adobe Campaign, Adobe Advertising, Marketo Measure)

Seen while reading; not written here.

- **aa-campaign.** The Adobe Analytics connector sends email campaign indicators and attributes from Campaign v8 to Analytics (Web Analytics connectors add-on). (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aa)
- **aa-campaign.** Experience Cloud Triggers: behaviors detected in Analytics, such as cart abandonment, reach Campaign through the pipeline and trigger emails. The Analytics product description allows rules-based triggers from Analytics to Campaign on every package. (https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-triggers)
- **aa-campaign.** Analytics integration guide pages for Campaign, and the Adobe Campaign setting in report suite admin. (https://experienceleague.adobe.com/en/docs/analytics/integration/adobe-campaign)
- **aa-campaign.** Published Analytics segments reach Campaign with a further 24 hours of latency (stated on the segment publishing page). (https://experienceleague.adobe.com/en/docs/analytics/components/segmentation/segmentation-workflow/seg-publish)
- **aa-advertising.** Analytics for Advertising: click-through and view-through tracking in Analytics, and Analytics segments and events sent to Adobe Advertising. (https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview)
- **aa-advertising.** Advertising Analytics in the Analytics integration guide (paid search data from Google Ads and Microsoft Advertising accounts in a report suite). This is search engine account data, not the Adobe Advertising product; listed so the other helper can rule it in or out. (https://experienceleague.adobe.com/en/docs/analytics/integration/advertising-analytics/overview)
- **aa-mmeasure.** B2B Customer Attributes: Marketo Measure uploads account and attributed revenue attributes to a Customer Attributes source that Analytics subscribes to. (https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics)
- **aam-campaign.** Campaign imports shared audiences as lists and exports lists as shared audiences; Adobe provisions the integration. (https://experienceleague.adobe.com/en/docs/campaign-classic/using/integrating-with-adobe-experience-cloud/audience-sharing/sharing-audiences-with-adobe-experience-cloud)
- **aam-advertising.** Advertising DSP and Search, Social, & Commerce import Audience Manager segments for targeting; DSP can send media exposure data back. (https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/overview)
- **rtcdp-campaign, rtcdp-advertising.** The Experience Cloud Audiences page says Adobe strongly recommends the dedicated Campaign and Advertising DSP destination cards, and that those do not need an Audience Manager license. (https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences)

## Open questions for Adam

1. **Audience Manager: show it, and how?** Adobe gives no end date and says it has no plans to change the product, but it warns that third-party cookies limit it and publishes a guide for moving to Real-Time CDP. *Recommendation: Show it as one box for organizations that already run it, with the move on the Audience Manager + Real-Time CDP card. No card says it is ending. Do not sell new Audience Manager rollouts.*
2. **Adobe Analytics + Customer Journey Analytics: two small services beside the big upgrade line?** The tool already has CJ03 (the full upgrade, 160 hours). The new card adds report suite data in CJA (40 hours) and project migration (32 hours) for a client that keeps both products. *Recommendation: Yes, keep both, and move CJ03 onto the same card as the larger option so a partner picks one route.*
3. **Two pairs are already covered by a line in the tool: AEM Forms (AF09) and Experimentation Accelerator (EX04). Draw the connection lines to Adobe Analytics and reuse those services?** *Recommendation: Yes. Draw aa-aemforms with AF09 (and drop its "Also needs Adobe Analytics" tag) and aa-xa with EX04. Nothing new to write.*
4. **Edge Delivery: the plugin page on aem.live states no availability label, but the tool's Target and Real-Time CDP cards call the same plugin co-innovation through AEM Engineering. Use the same wording on the Adobe Analytics card?** *Recommendation: Yes, keep the three cards consistent, with the statement of work condition that Adobe confirms the plugin for the site.*
5. **Marketing Campaign Analytics and Brand Concierge with Adobe Analytics are left without a line.** Adobe mentions each pair in one sentence and gives no setup. *Recommendation: Leave both out. The campaign analytics work is already XD09 plus the source connector.*

## Before merging into the canvas

- Connection ids put the new product first (`aa-target`, `aam-rtcdp`); `aa-aam` is written once, here. `catalog_map.json` will need `aa` and `aam` placed.
- `sow_prereq` is on 6 connections (`aa-target`, `aa-ajo`, `aa-eds`, `aa-cw`, `aam-rtcdp`, `aam-target`); `sow_availability` is on 6 (`aa-rtcdp`, `aa-cja`, `aa-ajo`, `aam-rtcdp`, `aam-target`, `aam-marketo`).
- `tier` is used on AU06 (People-Based Destinations), XL06 and XL23 (Real-Time CDP Prime or Ultimate); `ext` on AN07 (a cloud storage bucket). XL06 also needs Audience Manager, which is a product in this file, so it is said in the scope and the prerequisites, not as an `ext`.
- Kinds: `native` for built-in integrations, `platform` for the four that run through an Experience Platform source or destination (`aa-rtcdp`, `aa-cja`, `aa-ajo`, `aam-rtcdp`), `extension` for the two that install something (`aa-eds`, the martech plugin; `aa-commerce`, the Data Connection extension).
- The JSON carries three keys beyond wave 2's shape: `for_other_helper`, `lifecycle` and `overlaps`. A build script can ignore them.
- Adobe now writes "CX Enterprise" where it used to write "Experience Cloud" on the Analytics pages; the card fields keep "Experience Cloud", which the Audience Manager, Target and Marketo pages still use. Quotes keep Adobe's words.
- Adobe's quotes in `prereq_sources`, `lifecycle` and `left_out` keep Adobe's own words, including labels and dates; the card fields do not.
- AF09's "Also needs Adobe Analytics" tag and the wording on `marketo-target` ("through Audience Manager") can point at the new products once they are on the canvas.

## Pages downloaded and checked

Every page below carries at least one quote that was matched word for word.

- https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/analytics
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/aa-to-cja
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aa-data-in-cja
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-console/permissions/product-profile
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/analytics-inventory
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/component-migration
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/component-migration/prepare-component-migration
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/c-new-report-suite/t-create-a-report-suite
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/marketing-channels/c-channels
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/server-side-forwarding/ssf
- https://experienceleague.adobe.com/en/docs/analytics/admin/admin-tools/manage-report-suites/edit-report-suite/report-suite-general/server-side-forwarding/ssf-requirements
- https://experienceleague.adobe.com/en/docs/analytics/analyze/admin-overview/analytics-overview
- https://experienceleague.adobe.com/en/docs/analytics/analyze/analysis-workspace/home
- https://experienceleague.adobe.com/en/docs/analytics/analyze/labs
- https://experienceleague.adobe.com/en/docs/analytics/components/classifications/classifications-overview
- https://experienceleague.adobe.com/en/docs/analytics/components/segmentation/segmentation-workflow/seg-publish
- https://experienceleague.adobe.com/en/docs/analytics/export/analytics-data-feed/data-feed-overview
- https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/web-sdk/upgrade-assistant/overview
- https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/web-sdk/web-sdk-tag-extension
- https://experienceleague.adobe.com/en/docs/analytics/implementation/prepare/data-layer
- https://experienceleague.adobe.com/en/docs/analytics/implementation/prepare/solution-design
- https://experienceleague.adobe.com/en/docs/analytics/implementation/review/focused-review
- https://experienceleague.adobe.com/en/docs/analytics/integration/aem-assets-reporting
- https://experienceleague.adobe.com/en/docs/analytics/integration/audience-analytics/mc-audiences-aam
- https://experienceleague.adobe.com/en/docs/analytics/integration/home
- https://experienceleague.adobe.com/en/docs/analytics/release-notes/latest
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/administration/admin-console-migration
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/administration/administration-overview
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/administration/usage-limits
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/audience-marketplace/audience-marketplace
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/data-export-controls
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/data-sources/manage-datasources
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/experience-cloud-destinations/create-analytics-destination
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/people-based/people-based-destinations-overview
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/features/destinations/people-based/people-based-destinations-prerequisites
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/data-integration-methods
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/implement-audience-manager
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-experience-platform/aam-aep-audience-sharing
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/integration-other-solutions/aam-target-integration
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/sending-audience-data/batch-data-transfer-process/batch-data-transfer-overview
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/migrate-to-web-sdk/appmeasurement-to-web-sdk
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/migrate-to-web-sdk/dil-extension-to-web-sdk
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/reporting/reports-overview
- https://experienceleague.adobe.com/en/docs/brand-concierge/content/documentation/developer-customization-guide
- https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/adobe-analytics-integration
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/ui-guide
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-chat
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview
- https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/intelligent-implementation-and-administration/migrate-projects-aa-cja
- https://experienceleague.adobe.com/en/docs/coworker/content/home
- https://experienceleague.adobe.com/en/docs/discontinued/using/device-co-op
- https://experienceleague.adobe.com/en/docs/discontinued/using/overview
- https://experienceleague.adobe.com/en/docs/experience-cloud-kcs/kbarticles/ka-25631
- https://experienceleague.adobe.com/en/docs/experience-manager-65/content/sites/administering/integration/marketing-cloud
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/assets-insights
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/services/integrate-aem-forms-with-adobe-analytics
- https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/sites/integrations/integrating-adobe-analytics
- https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/adobe/experience-cloud-audiences
- https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/evolution/aam-to-rtcdp
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/analytics
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/connectors/adobe-applications/audience-manager
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/analytics
- https://experienceleague.adobe.com/en/docs/experience-platform/sources/ui-tutorials/create/adobe-applications/audience-manager
- https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor
- https://experienceleague.adobe.com/en/docs/integrations-learn/experience-cloud/tutorials/analytics-commerce/analytics-commerce
- https://experienceleague.adobe.com/en/docs/journey-optimizer/using/configure-journeys/events-journeys/about-analytics
- https://experienceleague.adobe.com/en/docs/marketing-campaign-analytics/using/ingest-data/overview
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/adobe-experience-cloud-integrations/set-up-adobe-organization-mapping
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/send-a-list-to-adobe-experience-cloud
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/web-personalization/reporting-for-web-personalization/web-analytics-integrations/integrate-with-adobe-analytics
- https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/setup/source-audiences/configure-aam-audience-sourcing
- https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4t
- https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/a4timplementation
- https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/account-reqs
- https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/before-implement
- https://experienceleague.adobe.com/en/docs/target/using/integrate/a4t/reporting
- https://experienceleague.adobe.com/en/docs/target/using/recommendations/criteria/use-adobe-analytics-with-recommendations
- https://experienceleague.adobe.com/en/docs/workfront/using/adobe-workfront-planning/adobe-workfront-planning-general-information/planning-cx-coworker-overview
- https://helpx.adobe.com/legal/product-descriptions/adobe-analytics.html
- https://www.aem.live/developer/martech-integration

## Pages listed without a quote

Addresses carried over from this morning's map-level pass for the other helper, or pages scanned for a mention that was not there.

- https://experienceleague.adobe.com/en/docs/advertising/integrations/analytics/overview
- https://experienceleague.adobe.com/en/docs/advertising/integrations/audience-manager/overview
- https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics
- https://experienceleague.adobe.com/en/docs/analytics/integration/adobe-campaign
- https://experienceleague.adobe.com/en/docs/analytics/integration/advertising-analytics/overview
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/implementation-integration-guides/implementation-and-integration
- https://experienceleague.adobe.com/en/docs/audience-manager/user-guide/overview/aam-overview
- https://experienceleague.adobe.com/en/docs/campaign-classic/using/integrating-with-adobe-experience-cloud/audience-sharing/sharing-audiences-with-adobe-experience-cloud
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-aa
- https://experienceleague.adobe.com/en/docs/campaign/campaign-v8/connect/ac-triggers
- https://experienceleague.adobe.com/en/docs/commerce/data-connection/overview
- https://experienceleague.adobe.com/en/docs/marketo-measure/using/marketo-measure-and-adobe/marketo-measure-integrations-with-adobe-analytics

## Pages not read

- https://helpx.adobe.com/legal/product-descriptions/adobe-audience-manager.html: Returns Adobe's page-not-found screen. No product description for Audience Manager was found on helpx, so the product has no package list and its license prerequisite is quoted from the audience sharing page.
- https://business.adobe.com/products/analytics/adobe-analytics.html: Tried once with curl: the connection closed without returning a page (an HTTP/2 stream error, no status code). Not tried again. Every fact used here is from Experience League, helpx or aem.live; a marketing-only statement about Adobe Analytics packaging would be missed.
- https://business.adobe.com/products/audience-manager/adobe-audience-manager.html: Tried once with curl, same result: no page returned. Not tried again. If Adobe states Audience Manager's sales status anywhere, it would be on this page.
- https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/core-marketo-concepts/smart-lists-and-static-lists/static-lists/sync-an-audience-from-adobe-experience-cloud: A guessed address for the page on syncing an Experience Cloud audience into Marketo; it returned no article. The Marketo organization mapping page says an audience can be synced from the Experience Cloud, but the how-to page was not found, so aam-marketo is written in one direction only.
- https://github.com/adobe-rnd/aem-martech: The plugin's repository, linked from aem.live for the technical steps. Not opened; XL13 is scoped from the aem.live page.
- https://video.tv.adobe.com/: Videos embedded in the Analytics, Target and Audience Manager pages were not watched; only page text was read.
