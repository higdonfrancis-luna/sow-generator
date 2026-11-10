# Content Analytics, Experimentation Accelerator and Journey Optimizer B2B Edition (wave 1 recheck): research trail

Checked Nov 10 2026. Data file: `sow/canvas/research/expansion_2026-11-10/wave1/portal_omnichannel_b2b.json`, a full replacement for the Oct 30 file `sow/canvas/research/portal_omnichannel_b2b.json`. The brief is `BRIEF_RECHECK.md` in this folder; the source rules are in `../BRIEF.md`.

In scope: the products Content Analytics (`ca`), Journey Optimizer Experimentation Accelerator (`xa`) and Journey Optimizer B2B Edition (`ajob2b`), the connections `ajo-xa` and `ajob2b-aemassets`, and the new pairs named for this pass. Out of scope and copied through untouched: AEM Sites, AEM Assets and the connections `aemsites-aemassets`, `aemassets-ajo`, `aemsites-ajo`, `commerce-aemsites` and `commerce-aemassets` (they are already in the tool).

Hours are our own estimates for a mid-market client, on the scale of the Oct 30 lines. Adobe publishes none. No hours changed in this pass.

Nothing else in the repo was changed, the Oct 30 files were not edited, nothing was committed and no build script was run.

## Lifecycle: is any of the three products itself under an early label?

No. None of the three products is described by Adobe as beta, early access, limited availability or coming soon. Adobe's words on each:

- Content Analytics: "Content Analytics is licensed as a standalone product, but the configuration happens within Experience Platform and Customer Journey Analytics." (Experience League: Configure Content Analytics (Standalone), https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)
- Experimentation Accelerator: "Journey Optimizer Experimentation Accelerator requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview)
- Journey Optimizer B2B Edition: "Adobe Journey Optimizer B2B Edition is built on Adobe Experience Platform, including Real-Time CDP B2B." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)

Two places where Adobe's own pages disagree about the status of a feature that one of the new pairs would rest on. Both are left out of the lines and are questions for Adam below (two smaller disagreements, on person journeys and variant split paths in the B2B Edition, are under Left out):

- **Coworker for Journey Optimizer B2B Edition.** The B2B Edition guide documents Coworker journey skills and audience skills as available: "CX Coworker provides a set of AI skills that includes a subset for the B2B journey lifecycle." (Experience League: Journey Skills for B2B, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/ai-capabilities/coworker-skills/journey-agent) Coworker's own overview says: "The B2B editions of Real-Time CDP, Adobe Journey Optimizer, and Customer Journey Analytics are coming soon." (Experience League: Adobe CX Enterprise Coworker Overview, https://experienceleague.adobe.com/en/docs/coworker/content/home)
- **Applying an accelerator suggestion inside Target.** The accelerator page describes it without a label: "the suggested changes will instead be loaded into Adobe Target" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor) Target's page for the matching tab says: "The AI insights feature is currently available as a beta feature." (Experience League: AI insights in the Activity Overview (Target), https://experienceleague.adobe.com/en/docs/target/using/activities/ai-insights)

## Summary

| Product | id | Lines | Default | Optional |
|---|---|---|---|---|
| Content Analytics | `ca` | 6 | CA01, CA02, CA05, CA06 | CA03, CA04 |
| Journey Optimizer Experimentation Accelerator | `xa` | 6 | EX01, EX02, EX03, EX05, EX06 | EX04 |
| Journey Optimizer B2B Edition | `ajob2b` | 6 | JB01, JB02, JB03, JB04, JB05, JB06 |  |

| Line | Service | Unit | Low / base / high | Default | Also needs | Needs |
|---|---|---|---|---|---|---|
| CA01 | Content Analytics readiness and prerequisites | one-time | 16 / 32 / 56 | yes |  |  |
| CA02 | Guided configuration and Tags rollout | one-time | 32 / 64 / 120 | yes |  |  |
| CA03 | Experience versioning on web pages | one-time | 8 / 16 / 40 | optional |  |  |
| CA04 | Paid media channel setup | one-time | 16 / 40 / 80 | optional |  |  |
| CA05 | Content Analytics reporting and training | one-time | 16 / 32 / 56 | yes |  |  |
| CA06 | Monthly content performance insights | monthly | 8 / 16 / 32 | yes |  |  |
| EX01 | Accelerator access, roles and sandboxes | one-time | 8 / 16 / 32 | yes |  |  |
| EX02 | Experiment program and hypothesis playbook | one-time | 24 / 40 / 72 | yes |  |  |
| EX03 | Hypotheses and treatment details per test | one-time | 8 / 16 / 40 | yes |  |  |
| EX04 | Primary metrics from CJA or Adobe Analytics | one-time | 8 / 16 / 32 | optional | Customer Journey Analytics or Adobe Analytics as the reporting source |  |
| EX05 | Training on insights and opportunities | one-time | 8 / 16 / 24 | yes |  |  |
| EX06 | Monthly experiment review and backlog | monthly | 8 / 16 / 32 | yes |  |  |
| JB01 | B2B schemas, XDM fields and events | one-time | 40 / 72 / 140 | yes |  |  |
| JB02 | Email domains and deliverability setup | one-time | 24 / 48 / 80 | yes |  |  |
| JB03 | Buying groups and solution interests | one-time | 32 / 56 / 100 | yes |  |  |
| JB04 | First account journeys and email content | one-time | 60 / 100 / 180 | yes |  |  |
| JB05 | User roles, access and team enablement | one-time | 16 / 32 / 56 | yes |  |  |
| JB06 | Monthly buying group and journey reviews | monthly | 16 / 24 / 40 | yes |  |  |
| XC08 | Content experiments in Journey Optimizer | one-time | 24 / 40 / 80 | yes |  |  |
| XC09 | Turn opportunities into AJO tests | one-time | 16 / 24 / 48 | yes |  |  |
| XC17 | Connect AEM Assets to AJO B2B Edition | one-time | 16 / 32 / 56 | yes |  | AEM Assets as a Cloud Service with Dynamic Media |
| XC18 | Re-link email images to AEM Assets | one-time | 16 / 32 / 64 | optional |  |  |
| XH01 | Coworker Chat on Content Analytics data | one-time | 8 / 16 / 32 | yes |  |  |
| XH02 | Content question playbook and team enablement | one-time | 8 / 16 / 24 | yes |  |  |
| XH03 | Accelerator access for Target teams | one-time | 8 / 16 / 24 | yes |  |  |
| XH04 | Target A/B activities reviewed in the accelerator | one-time | 8 / 16 / 32 | yes |  |  |
| XH05 | Marketo Engage connection for journey actions | one-time | 8 / 16 / 32 | yes |  |  |
| XH06 | Account journeys coordinated with Marketo campaigns | one-time | 16 / 32 / 56 | yes |  |  |
| XH07 | Shared email limits with Marketo Engage | one-time | 8 / 16 / 24 | optional |  |  |
| XH08 | Account data readiness for journey entry | one-time | 16 / 32 / 64 | yes |  | Real-Time CDP B2B Edition or B2P Edition |
| XH09 | Journey audiences for paid media destinations | one-time | 16 / 24 / 48 | optional |  | Real-Time CDP B2B Edition or B2P Edition |
| XH10 | Journey and buying group data in Experience Platform | one-time | 16 / 32 / 56 | optional |  | Real-Time CDP B2B Edition or B2P Edition |
| XH11 | Journey audiences into Adobe Target | one-time | 16 / 24 / 48 | yes |  | Real-Time CDP B2B Edition or B2P Edition |

| Connection | Status | Kind | Availability in Adobe's terms | Lines (default first) |
|---|---|---|---|---|
| Journey Optimizer + Experimentation Accelerator (`ajo-xa`) | From Oct 30, rechecked | native | Adobe's page says the accelerator "requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." | XC08, XC09 |
| Journey Optimizer B2B Edition + AEM Assets (`ajob2b-aemassets`) | From Oct 30, rechecked | native | Not stated by Adobe; the page says access depends on your client's contract and configuration. | XC17, XC18 (optional) |
| Content Analytics + Coworker (`ca-cw`) | New in this pass | native | Adobe's Coworker overview lists Customer Journey Analytics among the applications where Coworker Chat is available now, licensed through the Adobe account team; the content questions run on a data view configured for Content Analytics. | XH01, XH02 |
| Experimentation Accelerator + Target (`xa-target`) | New in this pass | native | Adobe's page says the accelerator "requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." | XH03, XH04 |
| Journey Optimizer B2B Edition + Marketo Engage (`ajob2b-marketo`) | New in this pass | native | Not stated by Adobe; the setup checklist lists connecting a Marketo Engage instance for journey actions as an optional step. | XH05, XH06, XH07 (optional) |
| Journey Optimizer B2B Edition + Real-Time CDP (`ajob2b-rtcdp`) | New in this pass | platform | Adobe's page says account audiences "are only available in the B2B Edition of Real-Time Customer Data Platform and the B2P Edition of Real-Time Customer Data Platform". | XH08, XH09 (optional), XH10 (optional) |
| Journey Optimizer B2B Edition + Target (`ajob2b-target`) | New in this pass | platform | Not stated by Adobe; the page says activation needs Adobe Target configured as a destination in Real-Time CDP. | XH11 |
| Content Analytics + AEM Sites, AEM Assets, Edge Delivery Services, Journey Optimizer, Experimentation Accelerator | Not documented | | | none |
| Experimentation Accelerator + AEM Sites, AEM Assets | Not documented | | | none |
| Journey Optimizer B2B Edition + Adobe Commerce, AEM Sites, Workfront | Not documented | | | none |
| Journey Optimizer B2B Edition + Coworker | Left out: Adobe's pages disagree | | | none |
| Journey Optimizer B2B Edition + Customer Journey Analytics | Left out: rests on the web channel, which Adobe labels Beta | | | none |

Totals in scope: 18 product lines across 3 products and 15 connection lines across 7 connections (4 from Oct 30, 11 new with ids XH01 to XH11). The file as a whole holds 5 products and 12 connections; the other 2 products and 5 connections are the Oct 30 entries, unchanged.

## What changed since Oct 30

No service was dropped: all 22 Oct 30 line quotes in scope are still on their pages, word for word. No hours changed.

| What | Change | Why |
|---|---|---|
| `checked` | Changed to 2026-11-10 | Recheck date. |
| `ca` product | Notes rewritten; `title`, `prereqs` (9), `prereq_sources` and `tiers` (4) added | Experience League now states the standalone license in so many words, and Adobe's product description says the Customer Journey Analytics add-on is no longer sold. The Oct 30 note leaned on a business.adobe.com page that cannot be read here. |
| CA04 Paid media channel setup | Scope changed: names Google Ads and Meta Ads. Hours unchanged | Adobe keeps Pinterest, Snapchat and TikTok in a testing phase, so the line is scoped to the two networks without a label. The other three are in `left_out`. |
| CA01, CA02, CA03, CA05, CA06 | Unchanged | Quotes found; scopes still match the pages. |
| `xa` product | Notes rewritten; `title`, `prereqs` (7), `prereq_sources` and `tiers` (2) added | Adobe's product description adds that the accelerator is not compatible with the Journey Optimizer Starter packages. Target is now a connection, so the old note "Target is not on this play" is gone. |
| EX04 Primary metrics from CJA or Adobe Analytics | `ext` added: Customer Journey Analytics or Adobe Analytics as the reporting source | The line only applies with one of those as the reporting source, and Adobe Analytics is not a product in the tool. |
| EX01, EX02, EX03, EX05, EX06 | Unchanged | Quotes found; scopes still match the pages. |
| `ajob2b` product | Notes rewritten; `title`, `prereqs` (8), `prereq_sources` and `tiers` (3) added | The Oct 30 note said the web channel is in beta, which a partner must not read; it moved to `left_out`. The note now uses Adobe's current architecture wording (separate systems, a dedicated Marketo Engage instance) and names Real-Time CDP B2B Edition as a requirement. |
| JB01 B2B schemas, XDM fields and events | Scope changed: "managed and relational XDM fields" is now "managed and updatable XDM fields". Hours unchanged | Adobe's XDM page calls the relational tab a beta feature release, and custom object filters are badged Beta. |
| JB02, JB03, JB04, JB05, JB06 | Unchanged | Quotes found; scopes still match the pages. JB04 was already scoped to account journeys with email. |
| `ajo-xa` | `availability`, `availability_source`, `prereqs` (6), `prereq_sources`, `kind`, `label` and `client` added. How, gain, flows and lines XC08 and XC09 unchanged | Brief steps 4 and 7. |
| `ajob2b-aemassets` | `availability`, `availability_source`, `prereqs` (7), `prereq_sources`, `kind`, `label` and `client` added; XC17 gets `tier` AEM Assets as a Cloud Service with Dynamic Media. How, gain, flows and scopes unchanged | Brief steps 4, 5 and 7. New caveat: the product description allows one repository while the guide describes several. |
| `ca-cw` (XH01, XH02) | Added | Adobe documents Coworker Chat answering content questions from Content Analytics data, with prerequisites and steps. Not documented on Oct 30. |
| `xa-target` (XH03, XH04) | Added | Adobe documents Target A/B activities in the accelerator, with a separate permission route for Target users. Oct 30 noted Target but had no connection because Target was not on the play. |
| `ajob2b-marketo` (XH05, XH06, XH07) | Added | Adobe documents the Marketo Engage connection for journey actions with setup steps, and shared email limits. |
| `ajob2b-rtcdp` (XH08, XH09, XH10) | Added | Adobe documents the B2B Edition as a Real-Time CDP B2B Edition destination, with account audiences in and datasets back. |
| `ajob2b-target` (XH11) | Added. Not one of the pairs named for this pass | The B2B Edition guide documents it with setup steps, and Target is a product in the tool. |
| `not_documented` | Eight Oct 30 pairs reconfirmed with today's searches; two added (Content Analytics + Edge Delivery Services, B2B Edition + Workfront). Each now has a `why`, and a quote where one helps | Brief step 6. |
| `left_out` | New list, 14 entries | Brief step 3. |
| `notes` | Notes 1 to 4, 11 and 12 (the in-scope ones) rewritten without lifecycle labels; seven added. Notes 5 to 10, 13 and 14 are word for word as on Oct 30 | Names, lifecycle wording and the new connections. |
| `pages_not_read` | New list | Brief output. |
| B2B Edition + Coworker | Checked, not added | Adobe's pages disagree (see the top of this trail). |
| Content Analytics + AEM Sites, AEM Assets, Edge Delivery Services | Checked again, still not documented | See Not documented. |

## How this was researched

1. Read the Oct 30 file and trail, the Oct 31 Content Analytics recheck, and this morning's map-level entries for the three products in `../platform_data_campaign.json` and `../genstudio_creative.json`.
2. Downloaded every page again with plain `curl -sS -L -m 45`, default headers: the ten pages of the Content Analytics section of the Customer Journey Analytics guide plus the Tags extension page and the How it works tutorial; the four Experimentation Accelerator pages and the Journey Optimizer page for it; all 133 pages in the Journey Optimizer B2B Edition guide's table of contents (`https://experienceleague.adobe.com/en/toc/journey-optimizer-b2b-help-user`), all returned; the Coworker overview, chat overview, interface guide and the four analytics and content performance pages; three Adobe Marketo Optimizer pages; the Experience Platform account audiences page; Target's AI insights page; Journey Optimizer's content experiment and AI pages; the central release notes; and Adobe's product descriptions on helpx.adobe.com for Content Analytics, Customer Journey Analytics, the accelerator, the B2B Edition and Marketo Optimizer.
3. Read the pages behind each service and connection in full, then searched every downloaded page by script for beta, early access, limited availability, coming soon, pre-release, limited testing and Adobe's AVAILABILITY notes, and for the names of the products already in the tool.
4. Web searches (limited to experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com and www.aem.live) for: the accelerator with Target; the B2B Edition with Marketo Engage; the B2B Edition with Workfront; Content Analytics with AEM Sites, AEM Assets and Edge Delivery Services; Content Analytics inside the AEM as a Cloud Service guide. The www.aem.live documentation index (237 pages) was searched by script for Content Analytics.
5. Wrote the entries, then checked every quote by script: page downloaded with curl, script and style blocks dropped, every tag replaced by a space, entities unescaped, curly quotes straightened, whitespace collapsed, lower-cased, and the quote must be a substring (a quote joined with an ellipsis must have each part on the page). This is the same method as `../verify_quotes.py`.
6. Proved by script that the out-of-scope entries equal the Oct 30 file (see the end of this trail), and that no new id repeats one in `sow/canvas/catalog.json` or any other research file.

Quote check, Oct 30 quotes: the 22 line quotes in scope (CA01 to CA06, EX01 to EX06, JB01 to JB06, XC08, XC09, XC17, XC18) were checked against fresh downloads: 22 found, 0 not found, so no service lost its backing. Quote check, this file: 144 quotes on the in-scope entries of the JSON (33 line evidences, 72 prerequisites, 9 tiers, 7 availability sentences, 9 not-documented and 14 left-out quotes), 144 found on their pages, 0 not found. This trail prints 37 more checked quotes in its notes: 37 found, 0 not found. Counting each quote once (several are used in more than one place): 122 distinct quotes in the JSON plus 37 in this trail, 159 in all, 159 found and 0 not found.

No blocked host was fetched and no block was worked around. Pages that could not be read are listed at the end.

## Products

### Content Analytics (`ca`)

Name in the tool: Content Analytics. Title: Adobe Content Analytics.

What: Content Analytics helps marketers to understand how content impacts the key performance indicators that a business has defined. (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)

Notes: Adobe licenses Content Analytics as a product of its own, but it is set up and read inside Experience Platform and Customer Journey Analytics, so the work happens in the Customer Journey Analytics interface (Data Management, Content Analytics Configuration) whether or not your client owns Customer Journey Analytics. It needs Experience Platform Web SDK, Mobile SDK or source connectors for data. Each sandbox allows one configuration and one connection. Featurization supports English only, Content Analytics is not a HIPAA-Ready service, and Privacy and Security Shield labels and customer managed keys do not cover its experiences and assets. CA04 covers Google Ads and Meta Ads, and the paid media channel is not offered on Experience Platform deployments on AWS; the other ad networks are in left_out. Adobe's own guide says to plan 4 to 6 hours for the first setup of the standalone product, plus testing. Hours are our own estimates for a mid-market client; Adobe publishes none.

Prerequisites for the product:
- A Content Analytics license: Adobe sells it as a standalone product and sets it up inside Experience Platform and Customer Journey Analytics.
  - Quote: "Content Analytics is licensed as a standalone product, but the configuration happens within Experience Platform and Customer Journey Analytics." (Experience League: Configure Content Analytics (Standalone), https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)
- Data collected with the Experience Platform Edge Network (Web SDK, Mobile SDK or Server API) or through Experience Platform source connectors.
  - Quote: "These content experience events require the data to be collected with the Experience Platform Edge Network (Web SDK, Mobile SDK, Server API) or through Experience Platform source connectors." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- The featurization service's User Agent and IP address allow-listed on your client's site, so the service can read the pages and images.
  - Quote: "You have allow-listed the User Agent and IP address for the featurization service that is used in Content Analytics." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- A Customer Journey Analytics Product Administrator role with permission to manage connections and data views, plus Experience Platform and Data Collection permissions.
  - Quote: "You have a Customer Journey Analytics Product Administrator role, with the additional permissions to manage connections and to manage data views." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- One Content Analytics configuration for each sandbox.
  - Quote: "You can only have one Content Analytics configuration per sandbox in your organization." (Experience League: Content Analytics Guided Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- For page (experience) reporting: pages whose text can be reproduced from the page URL and does not depend on cookies or personalization.
  - Quote: "The text content seen by any given user can be reproduced using the page URL and does not depend on cookies or other personalization mechanisms." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- English content: the featurization service supports English only.
  - Quote: "Content Analytics supports featurization in English only." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- Not for regulated health data: Content Analytics is not a HIPAA-Ready service.
  - Quote: "Also, Content Analytics is not a HIPAA-Ready service." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- Access is given by data view: there is no Content Analytics permission of its own.
  - Quote: "There is no Content Analytics permission that you can configure to enable or disable Content Analytics access for individual users or groups of users." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)

Tiers and add-ons:
- **Adobe Content Analytics (standalone license)**: The product Adobe sells today, licensed per million Content Rows of Data. Clients without a Customer Journey Analytics license also get Analytics Behavioral Rows of Data. All six lines assume it.
  - Quote: "Analytics Behavioral Rows of Data are Core Data and are only available to Customers that have licensed Adobe Content Analytics without an accompanying Customer Journey Analytics (Foundation, Select, Prime, or Ultimate) license." (Adobe: Adobe Content Analytics product description, https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html)
- **Content Analytics as a Customer Journey Analytics add-on (no longer sold)**: Adobe no longer licenses Content Analytics as an add-on to Customer Journey Analytics, and an existing add-on cannot be renewed. A client that has the add-on moves to the standalone product at renewal.
  - Quote: "Customers who wish to license Adobe Content Analytics must purchase the standalone version of Adobe Content Analytics." (Adobe: Customer Journey Analytics product description, https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html)
- **Limits in the standalone license**: One connection for each sandbox, 15 data views for each connection and five sandboxes, which caps how many brands or sites one license can report on separately.
  - Quote: "Connections 1 connection per Sandbox ... Data Views 15 per connection" (Adobe: Adobe Content Analytics product description, https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html)
- **Paid media channel**: Needs Experience Platform source connectors to the ad networks and is not offered on Customer Journey Analytics and Experience Platform deployments on AWS. CA04 needs it.
  - Quote: "The paid media channel is not available for Customer Journey Analytics and Experience Platform deployments on AWS." (Experience League: Content Analytics Guided Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)

Lines:
- **CA01 Content Analytics readiness and prerequisites**: one-time, 16 / 32 / 56 hours. Confirm Web SDK or Mobile SDK data collection, allow-list the featurization service's user agent and IP, set CJA and data collection permissions, and agree which pages and assets to analyze.
  - Quote: "You have allow-listed the User Agent and IP address for the featurization service that is used in Content Analytics." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- **CA02 Guided configuration and Tags rollout**: one-time, 32 / 64 / 120 hours. Run the guided configuration (sandbox, connection, data views, web and mobile channels, experience capture, exclusion rules that keep personal data out), implement it and publish the Tags property.
  - Quote: "Only when you manually publish the Tags property is your Content Analytics configuration effectively deployed and data collection started." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
- **CA03 Experience versioning on web pages** (optional): one-time, 8 / 16 / 40 hours. Where page experiences are captured, add the adobe.getContentExperienceVersion function to the analyzed pages so page changes are recorded as new experiences.
  - Quote: "you should consider implementing versioning to ensure new experiences (changes to your web page) are properly collected" (Experience League: Content Analytics Manual Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/manual)
- **CA04 Paid media channel setup** (optional): one-time, 16 / 40 / 80 hours. Connect Google Ads and Meta Ads through Experience Platform's source connectors, enable the paid media channel on their datasets, then map tracking keys so ad content links to site conversions.
  - Quote: "The correlation between your experience event data and paid media data requires customer-specific tracking-key mapping and reporting configuration." (Experience League: Content Analytics Paid Media Automatic Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
- **CA05 Content Analytics reporting and training**: one-time, 16 / 32 / 56 hours. Set up the Content Analytics Workspace template and core freeform reports with thumbnails and previews, and train analysts and content teams to read attribute insights.
  - Quote: "A specific Workspace template is available, so you can immediately access a pre-populated Workspace project with relevant content insights." (Experience League: Content Analytics Reporting, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report)
- **CA06 Monthly content performance insights**: monthly, 8 / 16 / 32 hours. Each month, review which assets and attributes drive engagement and conversion, flag underused or overused assets, and feed the findings into the content plan.
  - Quote: "These insights help you to see whether assets are underused or overused on your web and mobile properties." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)

### Journey Optimizer Experimentation Accelerator (`xa`)

Name in the tool: Journey Optimizer Experimentation Accelerator. Title: Adobe Journey Optimizer Experimentation Accelerator.

What: Journey Optimizer Experimentation Accelerator provides a centralized platform for managing, analyzing, and optimizing experiments from Adobe Target and Journey Optimizer. (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview)

Notes: It has a paid license of its own and needs an active Adobe Target or Journey Optimizer license; Adobe's product description says it is not compatible with Journey Optimizer Prime Starter or Ultimate Starter. It lists Journey Optimizer experiments and Target A/B activities (connections ajo-xa and xa-target). Insights and opportunities are limited to experiments with text-based changes, and they appear only after the hypothesis and treatment details are confirmed and the test reaches statistical significance. The primary metric can be changed only where Customer Journey Analytics or Adobe Analytics is the reporting source, and the change stays in the accelerator. The Experimentation Agent in AI Assistant comes with the accelerator license and is not costed here. Hours are our own estimates for a mid-market client; Adobe publishes none.

Prerequisites for the product:
- A paid Experimentation Accelerator license.
  - Quote: "Journey Optimizer Experimentation Accelerator requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview)
- An active Adobe Target or Journey Optimizer license.
  - Quote: "To use Adobe Journey Optimizer Experimentation Accelerator, Customer must maintain an active license to Adobe Target and/or Adobe Journey Optimizer." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)
- Not Journey Optimizer Prime Starter or Ultimate Starter: the accelerator is not compatible with them.
  - Quote: "Experimentation Accelerator is not compatible with Adobe Journey Optimizer Prime Starter or Ultimate Starter." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)
- Sandbox access and the View Experiments and Manage Experiment Metadata permissions for the people who use it.
  - Quote: "you need access to the sandbox and following related permission" (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- Experiments with text-based changes: insights and opportunities are limited to them.
  - Quote: "Opportunities feature is limited to experiments with text-based changes." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- A hypothesis and confirmed treatment details on each experiment, and statistical significance, before insights appear.
  - Quote: "for Experiment insights to be generated, you need to confirm hypothesis and treatment details and statistical significance to be reached." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- People, not bots or automated systems, as the source of inputs.
  - Quote: "Customer may not use any bots or other automated systems as the source of inputs." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)

Tiers and add-ons:
- **Journey Optimizer Experimentation Accelerator (its own license)**: Licensed per package on top of Adobe Target or Journey Optimizer. The package covers experiment insights, experiment opportunities, the experiment inventory and experiment summaries. Every line assumes it.
  - Quote: "To use Adobe Journey Optimizer Experimentation Accelerator, Customer must maintain an active license to Adobe Target and/or Adobe Journey Optimizer." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)
- **Journey Optimizer Starter packages**: A client on Journey Optimizer Prime Starter or Ultimate Starter cannot add the accelerator.
  - Quote: "Experimentation Accelerator is not compatible with Adobe Journey Optimizer Prime Starter or Ultimate Starter." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)

Lines:
- **EX01 Accelerator access, roles and sandboxes**: one-time, 8 / 16 / 32 hours. Add the Experiment accelerator resource to roles with View Experiments or Manage Experiment Metadata, assign the sandboxes, and add users.
  - Quote: "Add the Experiment accelerator resource, then select View Experiments and/or Manage Experiment Metada from the drop-down menu." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- **EX02 Experiment program and hypothesis playbook**: one-time, 24 / 40 / 72 hours. Set up your client's testing playbook: hypothesis format, primary and secondary metrics, sample size and run time, segmentation rules and how learnings are recorded.
  - Quote: "A strong hypothesis includes what you’re changing, what you expect to happen, and why." (https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-best-practices, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-best-practices)
- **EX03 Hypotheses and treatment details per test**: one-time, 8 / 16 / 40 hours. Add a hypothesis and confirm the treatment details and screenshots for each running experiment, which the accelerator needs before it generates insights and opportunities.
  - Quote: "for Experiment insights to be generated, you need to confirm hypothesis and treatment details and statistical significance to be reached." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **EX04 Primary metrics from CJA or Adobe Analytics** (optional): one-time, 8 / 16 / 32 hours. Also needs Customer Journey Analytics or Adobe Analytics as the reporting source. Where CJA or Adobe Analytics is the reporting source, choose and import the primary metric for each experiment; changes stay in the accelerator.
  - Quote: "Changing the primary metric applies to teams that use Customer Journey Analytics or Adobe Analytics as the reporting source" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **EX05 Training on insights and opportunities**: one-time, 8 / 16 / 24 hours. Train marketers and analysts to read experiment outcomes, insights and AI opportunities, including learning and conversion potential, and to share results.
  - Quote: "The Opportunities panel displays AI-generated recommendations designed to enhance test performance and align with broader business objectives and KPIs." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **EX06 Monthly experiment review and backlog**: monthly, 8 / 16 / 32 hours. Each month, review the experiments list and KPIs, pick the opportunities worth testing next, and keep the test backlog and learnings log current.
  - Quote: "The KPI section provides key metrics, including the total number of experiments created and the number currently in progress" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

### Journey Optimizer B2B Edition (`ajob2b`)

Name in the tool: Journey Optimizer B2B Edition. Title: Adobe Journey Optimizer B2B Edition.

What: Adobe Journey Optimizer B2B Edition lets marketing and sales teams orchestrate account-based experiences and qualify buying groups for specific products across the entire customer lifecycle. (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview)

Notes: Built on Experience Platform with Real-Time CDP B2B: Experience Platform is the data store for accounts, people and opportunities, and the B2B Edition owns the account journeys, buying groups and buying group roles. Each subscription comes with a dedicated Marketo Engage instance that supplies entitlements and backend services such as email delivery, sender configuration and branding domains; it is separate from your client's production Marketo Engage instance and does not store the journeys. Audience membership is evaluated once a day, so qualifying accounts enter a published journey within 24 hours. These lines cover account journeys with email; the parts of the product the lines leave out are in left_out. Marketo Engage journey actions, the Real-Time CDP data path and Target audiences are costed on the connections ajob2b-marketo, ajob2b-rtcdp and ajob2b-target. Adobe Marketo Optimizer is a different product with its own guide. Hours are our own estimates for a mid-market client; Adobe publishes none.

Prerequisites for the product:
- A Journey Optimizer B2B Edition license, sized by Engageable Businessperson Profiles.
  - Quote: "Customer may store and process up to the number of Profiles authorized in the Sales Order." (Adobe: Adobe Journey Optimizer B2B Edition product description, https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html)
- Real-Time CDP B2B Edition (or B2P Edition): the B2B schemas only qualify for Real-Time Customer Profile with it.
  - Quote: "you must have access to Adobe Real-Time Customer Data Platform B2B Edition" (Experience League: B2B Namespaces and schemas, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/namespaces-schemas)
- The dedicated Marketo Engage instance that comes with each subscription, set up for email tracking and deliverability.
  - Quote: "A dedicated Marketo Engage instance supports each Journey Optimizer B2B Edition subscription." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
- DNS access for the tracking CNAME, branding domains, DKIM, SPF, DMARC and MX records.
  - Quote: "configure the email tracking and deliverability in the attached Marketo Engage production instance" (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- An Experience Platform API credential and Postman, to run Adobe's namespace and schema utility.
  - Quote: "The Postman automation utility is required for generating B2B namespaces and schemas." (Experience League: B2B Namespaces and schemas, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/namespaces-schemas)
- An Account Name on every account record: accounts without one are left out of account journeys.
  - Quote: "The Account Name attribute for account records must contain a value to be included in account journeys." (Experience League: Account Audiences (Journey Optimizer B2B Edition), https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/account-audience-overview)
- Daily timing accepted: audience membership is evaluated once a day.
  - Quote: "Journey Optimizer B2B Edition evaluates account and person audience membership once per day, triggered by a batch job scheduler." (Experience League: Data availability and sync timing, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/data-availability-timing)
- Limits to plan for, such as 100 account journeys active at one time.
  - Quote: "The maximum number of Account Journeys that can be active at any one time is 100." (Adobe: Adobe Journey Optimizer B2B Edition product description, https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html)

Tiers and add-ons:
- **Adobe Journey Optimizer B2B Edition (license)**: Licensed per 1,000 Engageable Businessperson Profiles, which are the businessperson profiles brought in from Real-Time CDP. Every line assumes it.
  - Quote: "Engageable Businessperson Profile means any Businessperson Profile ingested from Adobe Real-time Customer Data Platform into Adobe Journey Optimizer B2B Edition." (Adobe: Adobe Journey Optimizer B2B Edition product description, https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html)
- **Marketo Engage functionality included with the license**: Where your client does not buy Marketo Engage separately, the license includes limited Marketo Engage functionality to run the B2B Edition: one production instance and one test sandbox. JB02 is done in that instance.
  - Quote: "Customer shall have access to one (1) Test Sandbox instance and one (1) Production Instance per Marketo Engage subscription." (Adobe: Adobe Journey Optimizer B2B Edition product description, https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html)
- **Real-Time CDP B2B Edition or B2P Edition**: Account audiences, which every account journey starts from, exist only in these two editions of Real-Time CDP.
  - Quote: "Account audiences are only available in the B2B Edition of Real-Time Customer Data Platform and the B2P Edition of Real-Time Customer Data Platform" (Experience League: Account Audiences (Experience Platform), https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/account-audiences)

Lines:
- **JB01 B2B schemas, XDM fields and events**: one-time, 40 / 72 / 140 hours. Generate the B2B namespaces and schemas with Adobe's utility, choose the managed and updatable XDM fields for journeys, buying groups and personalization, and select the Experience Platform events journeys listen to.
  - Quote: "Run the Namespaces and Schemas generation utility in Postman and confirm namespaces and schemas are created." (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- **JB02 Email domains and deliverability setup**: one-time, 24 / 48 / 80 hours. In the attached Marketo Engage instance, set up tracking CNAMEs, branding domains, DKIM, SPF, DMARC and MX records and IP allowlists, then email settings and communication limits in the B2B Edition.
  - Quote: "configure the email tracking and deliverability in the attached Marketo Engage production instance" (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- **JB03 Buying groups and solution interests**: one-time, 32 / 56 / 100 hours. Define solution interests and role templates with sales, build account audiences, and run the buying group creation jobs that fill each buying group.
  - Quote: "Before you create buying groups, you should know what you are selling and who you want to target." (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/solution-interests, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/solution-interests)
- **JB04 First account journeys and email content**: one-time, 60 / 100 / 180 hours. Build the first account journeys for acquisition or cross-sell, with personalized email templates, visual fragments and journey nodes, then test and publish them.
  - Quote: "Tailor your journeys for each buying group and buying group member using automated engagement across email, SMS, events, and more." (Experience League: Journey management, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journeys-overview)
- **JB05 User roles, access and team enablement**: one-time, 16 / 32 / 56 hours. Create the product profile and user groups in the Admin Console, configure B2B user roles, add users, and walk marketers through Adobe's onboarding guidance.
  - Quote: "configure Journey Optimizer B2B Edition and Marketo Engage access for your team and users." (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- **JB06 Monthly buying group and journey reviews**: monthly, 16 / 24 / 40 hours. Each month, review the Intelligent Dashboard and journey results, refresh buying groups and audiences, and tune journeys and content.
  - Quote: "The Intelligent Dashboard provides a comprehensive view of buying group and account metrics, helping you to monitor and strategize" (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/dashboards/intelligent-dashboard, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/dashboards/intelligent-dashboard)

## Connections with services

### Journey Optimizer + Experimentation Accelerator (`ajo-xa`)

From Oct 30. How, gain, flows and line scopes are unchanged; the availability, prerequisites, kind, label and client wording are new.

How: Experimentation Accelerator automatically lists the content experiments in Journey Optimizer campaigns and journeys, adds AI insights and opportunities, and opens a chosen opportunity back in the campaign's Content Experimentation panel. (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)

Gain: **Every test analyzed, next test suggested.** Journey Optimizer experiments land in one view with lift and confidence, and AI suggests the next treatment to try, which opens straight back in the campaign.

Flows:
- Journey Optimizer to Experimentation Accelerator: Experiments from campaigns and journeys in the enabled sandbox, included automatically (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- Experimentation Accelerator to Journey Optimizer: Chosen opportunity, opened in the campaign's Content Experimentation panel (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

Kind: native. Draft label for the card: Journey Optimizer experiments listed automatically; a chosen opportunity opens back in the campaign.

Availability: Adobe's page says the accelerator "requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." Quote: "Journey Optimizer Experimentation Accelerator requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview)

Prerequisites to check before selling it:
- A paid Experimentation Accelerator license on top of Journey Optimizer, and not a Journey Optimizer Starter package.
  - Quote: "Experimentation Accelerator is not compatible with Adobe Journey Optimizer Prime Starter or Ultimate Starter." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)
- Experiments set up in the sandbox enabled for the accelerator: those are included automatically.
  - Quote: "Experiments set up in your enabled organisation's sandbox are automatically included." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- The Experiment accelerator resource on each user's role, with View Experiments or Manage Experiment Metadata.
  - Quote: "Add the Experiment accelerator resource, then select View Experiments and/or Manage Experiment Metada from the drop-down menu." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- An identity namespace chosen for every campaign that has a content experiment.
  - Quote: "as part of configuring every campaign with a content experiment, you must choose an identity namespace" (Experience League: Get started with content experiment, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/get-started-experiment)
- Experiments with text-based changes: opportunities are limited to them.
  - Quote: "Opportunities feature is limited to experiments with text-based changes." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- A confirmed hypothesis and treatment details on each experiment before opportunities are generated.
  - Quote: "for Experiment opportunities to be generated, you first need to confirm hypothesis and treatment details" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

Client wording:
- How: The Experimentation Accelerator lists the content experiments in your Journey Optimizer campaigns and journeys, adds AI insights and suggested next tests, and opens a suggestion you choose back in the campaign's Content Experimentation panel.
- Gain: Your Journey Optimizer experiments sit in one view with lift and confidence. The accelerator suggests the next treatment to try, and we help your team turn the suggestions you accept into new tests.

Lines:
- **XC08 Content experiments in Journey Optimizer**: one-time, 24 / 40 / 80 hours. Set up content experiments in campaigns and journeys, with the identity namespace for random assignment, the treatments and the success metrics, so they flow into the accelerator.
  - Quote: "as part of configuring every campaign with a content experiment, you must choose an identity namespace" (Experience League: Get started with content experiment, https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/get-started-experiment)
- **XC09 Turn opportunities into AJO tests**: one-time, 16 / 24 / 48 hours. Agree how an accepted opportunity becomes a new treatment: open it in the campaign's Content Experimentation panel, build and check the variant, and relaunch.
  - Quote: "this action will open the Content Experimentation Panel within that campaign" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

### Journey Optimizer B2B Edition + AEM Assets (`ajob2b-aemassets`)

From Oct 30. How, gain, flows and line scopes are unchanged; the availability, prerequisites, kind, label and client wording are new.

How: Journey Optimizer B2B Edition connects to AEM Assets as a Cloud Service repositories with service credentials, so designers use DAM images in emails, templates and visual fragments through linked references. (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)

Gain: **DAM images in every B2B email.** Designers pull images from AEM Assets into account journey emails; DAM updates flow to live emails, and authors see which journeys use a changed image.

Flows:
- AEM Assets to Journey Optimizer B2B Edition: Images by linked reference; DAM changes propagate to live email campaigns (Experience League: Work with Experience Manager Assets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets)
- Journey Optimizer B2B Edition to AEM Assets: Asset usage information, exchanged over the repository connection (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)

Kind: native. Draft label for the card: AEM Assets repository connected with service credentials; DAM images in B2B emails.

Availability: Not stated by Adobe; the page says access depends on your client's contract and configuration. Quote: "Depending on your contract and configuration, Adobe Experience Manager Assets as a Cloud Service can be accessed directly from Adobe Journey Optimizer B2B Edition when designing visual content." (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)

Prerequisites to check before selling it:
- Licenses for AEM Assets as a Cloud Service and Dynamic Media, with Dynamic Media with OpenAPI enabled.
  - Quote: "Licenses for AEM Assets as a Cloud Service and Dynamic Media license are pre-requisites for the integration." (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
- A Delivery tier repository; an Author tier repository has to be converted through Adobe Experience Manager Support.
  - Quote: "The integration is limited to repositories from the Delivery tier" (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
- Service credentials from the AEM Headless Developer Console, with a certificate that is replaced every 365 days.
  - Quote: "The certificates expire every 365 days." (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
- Users added to the Assets Consumer Users or Assets Users product profiles.
  - Quote: "An administrator must add users who need access to Assets to the Assets Consumer Users or/and Assets Users Product profiles." (Experience League: Work with Experience Manager Assets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets)
- Images only: no other asset type is supported.
  - Quote: "Currently, only image assets from Adobe Experience Manager Assets are supported in Adobe Journey Optimizer B2B Edition." (Experience League: Work with Experience Manager Assets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets)
- One asset source at a time when authoring.
  - Quote: "Adobe Journey Optimizer B2B Edition supports access to one digital asset management source at a time when authoring content." (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
- Adobe's product description allows one Experience Manager repository, although the guide describes adding more: confirm with Adobe before planning several.
  - Quote: "Adobe Journey Optimizer B2B Edition can connect to one Adobe Experience Manager Repository." (Adobe: Adobe Journey Optimizer B2B Edition product description, https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html)

Client wording:
- How: Journey Optimizer B2B Edition connects to your AEM Assets as a Cloud Service repository with service credentials, so your designers use images from your DAM in emails, templates and visual fragments through linked references.
- Gain: Your designers pull images from AEM Assets into account journey emails. A change to an image in the DAM reaches live emails, and authors see which journeys use an image that was changed or deleted.

Lines:
- **XC17 Connect AEM Assets to AJO B2B Edition**: one-time, 16 / 32 / 56 hours. Needs AEM Assets as a Cloud Service with Dynamic Media. Generate service credentials in the AEM Headless Developer Console, add each repository and certificate in the B2B Edition, add users to the Assets product profiles, and plan the yearly certificate renewal.
  - Quote: "Generate service credentials for the desired environment on the AEM Headless Developer Console" (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
- **XC18 Re-link email images to AEM Assets** (optional): one-time, 16 / 32 / 64 hours. For email templates imported with images, upload those images to AEM Assets and change the image links in the email design space, since imports land in the Marketo Engage asset store.
  - Quote: "upload them separately in that app interface and change the image links in the email design space" (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-templates, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-templates)

### Content Analytics + Coworker (`ca-cw`)

New in this pass.

How: Coworker Chat answers questions about content performance from Content Analytics data: its analyze-content skill runs every query against the Customer Journey Analytics data views that are configured for Content Analytics, under the permissions of the person asking. (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)

Gain: **Content answers by asking.** Marketers ask which images, themes or messages drive engagement and revenue and get an analysis that pairs the right metric with assets or pages, without building the Workspace report themselves.

Flows:
- Content Analytics to Coworker: Content Analytics metrics, dimensions and AI-generated attributes in a configured data view, read by Coworker Chat under the user's permissions (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)

Kind: native. Draft label for the card: Coworker Chat answers content questions from Content Analytics data.

Availability: Adobe's Coworker overview lists Customer Journey Analytics among the applications where Coworker Chat is available now, licensed through the Adobe account team; the content questions run on a data view configured for Content Analytics. Quote: "Coworker Chat is available now in the following applications" (Experience League: Adobe CX Enterprise Coworker Overview, https://experienceleague.adobe.com/en/docs/coworker/content/home)

Prerequisites to check before selling it:
- Coworker Chat licensed for your client through the Adobe account team.
  - Quote: "Contact your Adobe account representative or sales team to confirm you have the right licenses and entitlements." (Experience League: Adobe CX Enterprise Coworker Overview, https://experienceleague.adobe.com/en/docs/coworker/content/home)
- Adobe's onboarding done: Adobe configures Coworker and its integrations with your client's Adobe applications.
  - Quote: "Adobe's enterprise support or professional services team configures Coworker for your environment, sets up integrations with your Adobe applications, and defines governance and approval workflows." (Experience League: Adobe CX Enterprise Coworker Overview, https://experienceleague.adobe.com/en/docs/coworker/content/home)
- Coworker Chat connected to your client's Customer Journey Analytics data views.
  - Quote: "Coworker Chat connected to your Customer Journey Analytics data views." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)
- The standard (B2C) edition of Customer Journey Analytics, the edition Adobe lists as compatible with Coworker Chat.
  - Quote: "The following CX Enterprise applications are compatible with Coworker Chat ... Customer Journey Analytics B2C edition" (Experience League: Adobe CX Enterprise Coworker Chat Overview, https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview)
- A data view configured for Content Analytics, so CA01 and CA02 come first.
  - Quote: "A data view that's configured for Content Analytics." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)
- View access to that data view for each person: Coworker Chat inherits their Customer Journey Analytics permissions.
  - Quote: "Coworker Chat inherits your permissions from Customer Journey Analytics." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)
- Outside the skill: setting up Content Analytics, content it does not collect, and paid media content.
  - Quote: "Setting up or configuring Content Analytics ... Content that Content Analytics doesn't collect ... Paid media content" (Experience League: Analyze Analytics Data with Adobe CX Enterprise Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
- Images named by URL or asset ID: Coworker cannot find an image by its role on the page.
  - Quote: "Coworker can't identify an image by its role on the page, such as a hero image or a banner." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)

Client wording:
- How: Coworker Chat answers your team's questions about content performance from your Content Analytics data. It runs each question against your Customer Journey Analytics data views that are configured for Content Analytics, with each person's own permissions.
- Gain: Your marketers ask which images, themes or messages drive engagement and revenue and get an analysis back, without building the report themselves. We set up the access and the prompts your team reuses.

Lines:
- **XH01 Coworker Chat on Content Analytics data**: one-time, 8 / 16 / 32 hours. Check that the Customer Journey Analytics integration is connected in Coworker Chat, give your client's content team view access to the data view configured for Content Analytics, store that data view as a preference in Coworker's memory, and compare the first answers with the Content Analytics Workspace template.
  - Quote: "Use Adobe CX Enterprise Coworker Chat to get accurate answers about your content from Adobe Content Analytics." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)
- **XH02 Content question playbook and team enablement**: one-time, 8 / 16 / 24 hours. Write the prompts your client's content team will reuse for attribute, revenue, channel and audience questions, teach the habits that keep answers reliable (say assets or experiences, name the metric and the date range, give an image's URL or asset ID), and agree how the findings feed the content plan.
  - Quote: "When you ask about a specific image, include its URL or asset ID." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)

### Experimentation Accelerator + Target (`xa-target`)

New in this pass.

How: Experimentation Accelerator lists the A/B activities in your client's Adobe Target organization beside the Journey Optimizer experiments, in the Journey Optimizer production sandbox, and people with only a Target license open it from the Apps switcher. (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)

Gain: **Target tests in the same view.** A/B activities from Target appear with their primary metric, lift and confidence beside Journey Optimizer experiments, so one team reviews every test and what it taught.

Flows:
- Target to Experimentation Accelerator: A/B activities in the Target organization, listed in the Journey Optimizer production sandbox (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)

Kind: native. Draft label for the card: Target A/B activities listed in the accelerator beside Journey Optimizer experiments.

Availability: Adobe's page says the accelerator "requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." Quote: "Journey Optimizer Experimentation Accelerator requires a paid license for customers and integrates seamlessly with either Adobe Target or Adobe Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview)

Prerequisites to check before selling it:
- A paid Experimentation Accelerator license and an active Adobe Target license.
  - Quote: "To use Adobe Journey Optimizer Experimentation Accelerator, Customer must maintain an active license to Adobe Target and/or Adobe Journey Optimizer." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)
- A/B activities: Adobe's pages name A/B activities and no other Target activity type.
  - Quote: "All A/B activities in your Target organization are included in the production sandbox of Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- Target in the same organization: its experiments are listed in the Journey Optimizer production default sandbox linked to the same IMS organization.
  - Quote: "Adobe Target experiments available in the Journey Optimizer production default sandbox linked to the same IMS organization." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- For people with only a Target license: an Admin Console profile under Adobe Experience Platform with the experimentation-accelerator permission and the sandboxes, and the Apps switcher as the only way in.
  - Quote: "Note that users with only a Target license can access it only through the Apps switcher." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- The reporting source decided before a test is published: with Target as the only reporting source, the primary metric cannot be changed afterwards.
  - Quote: "If your organization uses only Adobe Target as the reporting source, you cannot change the primary metric after the test is published." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- A metric changed in the accelerator stays there: it is not written back to Target.
  - Quote: "They are not written back to Adobe Target or Adobe Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- Experiments with text-based changes: insights and opportunities are limited to them.
  - Quote: "Experimentation Insights feature is limited to experiments with text-based changes." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

Client wording:
- How: The Experimentation Accelerator lists the A/B activities from your Adobe Target organization beside your Journey Optimizer experiments. People with only a Target license open it from the Apps switcher.
- Gain: Your Target tests appear in one view with their primary metric, lift and confidence, so your team reviews every test, and what it taught, in one place.

Lines:
- **XH03 Accelerator access for Target teams**: one-time, 8 / 16 / 24 hours. Create Admin Console profiles under Adobe Experience Platform with the experimentation-accelerator permission (one to view experiments, one to manage experiment metadata), add the sandboxes and your client's Target users, and show them how to open the accelerator from the Apps switcher.
  - Quote: "Users added to this profile can now access Journey Optimizer Experimentation Accelerator from the app switcher." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
- **XH04 Target A/B activities reviewed in the accelerator**: one-time, 8 / 16 / 32 hours. Check that your client's Target A/B activities appear in the accelerator, filter the list by source, and agree the reporting source and primary metric for each test before it is published, since a test that reports only in Target keeps its metric.
  - Quote: "If your organization uses only Adobe Target as the reporting source, you cannot change the primary metric after the test is published." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)

### Journey Optimizer B2B Edition + Marketo Engage (`ajob2b-marketo`)

New in this pass.

How: Each B2B Edition subscription runs on a dedicated Marketo Engage instance that supplies entitlements and backend services such as email delivery, and an administrator can also connect your client's existing Marketo Engage instances so that journeys add people to or remove them from Marketo static lists and add them to request campaigns. (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)

Gain: **Account journeys and Marketo campaigns in step.** Account journeys hand people to the lead-based campaigns your client already runs in Marketo Engage, and Marketo smart lists can leave out people who are in a buying group, so the two do not send over each other.

Flows:
- Journey Optimizer B2B Edition to Marketo Engage: People added to or removed from static lists and added to request campaigns by journey actions (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
- Marketo Engage to Journey Optimizer B2B Edition: Email delivery, sender configuration and branding domains, from the dedicated Marketo Engage instance (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)

Kind: native. Draft label for the card: Journey actions add people to Marketo lists and request campaigns.

Availability: Not stated by Adobe; the setup checklist lists connecting a Marketo Engage instance for journey actions as an optional step. Quote: "5. Connect Marketo Engage instance to support journey actions (optional)" (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)

Prerequisites to check before selling it:
- A Marketo Engage subscription of your client's own for journey actions: the dedicated instance that comes with the B2B Edition is separate from the production instance.
  - Quote: "This dedicated instance is separate from your production Marketo Engage instance" (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
- A custom service created in Marketo Engage by an administrator, which gives the Munchkin ID, Client ID and Client Secret.
  - Quote: "an administrator first creates a custom service in Marketo Engage, which provides the credentials needed for authentication" (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
- The custom service's role permissions decide which Marketo workspaces, lists and campaigns marketers can see.
  - Quote: "The role permissions assigned in the custom service govern Marketo Engage workspace visibility for assets, such as lists and campaigns." (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
- An update policy chosen for people who match more than one Marketo record.
  - Quote: "the selected update policy determines the person records in Marketo Engage to select if multiple identifiers exist in the unified person profile" (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
- People who already exist in Marketo Engage: a journey action does not create a person record.
  - Quote: "A journey action does not create a new person record in Marketo Engage when a matching record does not exist." (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
- For shared email limits: Adobe Support enables the sharing with your client's Marketo Engage instance.
  - Quote: "Contact Adobe Support or open a Support ticket to enable the sharing of communication limits between Journey Optimizer B2B Edition and one or more Marketo Engage instances." (Experience League: Email Channel Configurations, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-emails)
- Marketo data reaches journeys through Experience Platform, not through this connection (see marketo-rtcdp).
  - Quote: "Experience Platform provides a unified view of data from your connected Marketo Engage instances and CRM systems." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)

Client wording:
- How: Your Journey Optimizer B2B Edition subscription runs on its own Marketo Engage instance for email delivery. We also connect your existing Marketo Engage instance, so account journeys add people to or remove them from Marketo lists and add them to request campaigns.
- Gain: Your account journeys hand people to the campaigns you already run in Marketo Engage, and your Marketo smart lists can leave out people who are in a buying group, so the two do not send over each other.

Lines:
- **XH05 Marketo Engage connection for journey actions**: one-time, 8 / 16 / 32 hours. Create the custom service in your client's Marketo Engage instance with role permissions that limit which workspaces, lists and campaigns it shows, add the connection in the B2B Edition with the Munchkin ID, Client ID and Client Secret, choose the update policy for people who match more than one record, and test each action.
  - Quote: "an administrator first creates a custom service in Marketo Engage, which provides the credentials needed for authentication" (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
- **XH06 Account journeys coordinated with Marketo campaigns**: one-time, 16 / 32 / 56 hours. Design how account journeys hand people to Marketo Engage: a static list for each solution interest, the request campaigns that journeys start, and the smart list filters in Marketo that hold back people already in a buying group, then build and test the journey actions.
  - Quote: "Then, on a split path by buying group, use the Add to Marketo list action from a journey node." (Experience League: Take an Action, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journey-nodes/action-nodes)
- **XH07 Shared email limits with Marketo Engage** (optional): one-time, 8 / 16 / 24 hours. Set the email communication limit rules in the B2B Edition, raise the request with Adobe to share them with your client's Marketo Engage instance, and test that an email over the limit is held back whichever product sends it.
  - Quote: "To use shared communication limits, define the rules in Journey Optimizer B2B Edition and extend the sharing of these limits to the Marketo Munchkin codes." (Experience League: Email Channel Configurations, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-emails)

### Journey Optimizer B2B Edition + Real-Time CDP (`ajob2b-rtcdp`)

New in this pass.

How: Journey Optimizer B2B Edition is built on Experience Platform with Real-Time CDP B2B and works as a Real-Time CDP B2B Edition destination: account and people audiences are built with Real-Time CDP account segmentation and activated when a journey is published, and account, person, buying group and journey data is written back to Experience Platform datasets. (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)

Gain: **One account record behind every journey.** Journeys run on the accounts, people and opportunities already unified in Real-Time CDP, audiences refresh daily, and buying group and journey results come back to Experience Platform for reporting.

Flows:
- Real-Time CDP to Journey Optimizer B2B Edition: Account and people audiences from account segmentation, activated when a journey is published (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
- Journey Optimizer B2B Edition to Real-Time CDP: Account, person, buying group and journey information, written to Experience Platform datasets (Experience League: Exported Experience Platform Datasets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/aep-exported-datasets)
- Journey Optimizer B2B Edition to Real-Time CDP: People added by a journey to an external customer audience, for Real-Time CDP destinations (Experience League: Take an Action, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journey-nodes/action-nodes)

Kind: platform. Draft label for the card: Built on Real-Time CDP B2B: account audiences in, journey and buying group data back.

Availability: Adobe's page says account audiences "are only available in the B2B Edition of Real-Time Customer Data Platform and the B2P Edition of Real-Time Customer Data Platform". Quote: "Account audiences are only available in the B2B Edition of Real-Time Customer Data Platform and the B2P Edition of Real-Time Customer Data Platform" (Experience League: Account Audiences (Experience Platform), https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/account-audiences)

Prerequisites to check before selling it:
- Real-Time CDP B2B Edition or B2P Edition: standard Real-Time CDP does not have account audiences.
  - Quote: "Account audiences are only available in the B2B Edition of Real-Time Customer Data Platform and the B2P Edition of Real-Time Customer Data Platform" (Experience League: Account Audiences (Experience Platform), https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/account-audiences)
- The B2B namespaces and schemas generated, with Adobe's standard relationships between account, person and opportunity.
  - Quote: "Your Experience Platform B2B entities must use the standard relationships outlined in the B2B namespaces and schemas guide" (Experience League: B2B Namespaces and schemas, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/namespaces-schemas)
- An Account Name on every account record: accounts without one are left out of account journeys.
  - Quote: "The Account Name attribute for account records must contain a value to be included in account journeys." (Experience League: Account Audiences (Journey Optimizer B2B Edition), https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/account-audience-overview)
- Daily timing: audience membership is evaluated once a day, and a change to audience criteria applies at the next cycle.
  - Quote: "Changes to audience criteria take effect in the next daily evaluation cycle." (Experience League: Data availability and sync timing, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/data-availability-timing)
- For events that journeys listen to: profile-enabled Experience Event schemas.
  - Quote: "Using Experience Events and fields in Journey Optimizer B2B Edition requires profile-enabled Experience Event schemas." (Experience League: Select Experience Events and Fields, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/configure-aep-events)
- Events that the B2B Edition writes to Experience Platform can be used in batch audiences only.
  - Quote: "Events that Journey Optimizer B2B Edition generates in Experience Platform can only be used in batch audiences." (Experience League: Data availability and sync timing, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/data-availability-timing)
- A dataset in Experience Platform is not, on its own, available for audiences.
  - Quote: "A dataset's presence in Experience Platform does not, by itself, mean it is available for segmentation." (Experience League: Exported Experience Platform Datasets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/aep-exported-datasets)
- External customer audiences take up to 48 hours to fill and need a destination connected in Experience Platform.
  - Quote: "it can take up to 48 hours for those profiles to populate in the external audience" (Experience League: Take an Action, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journey-nodes/action-nodes)

Client wording:
- How: Journey Optimizer B2B Edition is built on Adobe Experience Platform with Real-Time CDP B2B. Your account and people audiences are built with Real-Time CDP account segmentation and activated when a journey is published, and journey and buying group data is written back to Experience Platform.
- Gain: Your journeys run on the accounts, people and opportunities already unified in Real-Time CDP. Audiences refresh once a day, and journey and buying group results come back to Experience Platform for your reporting.

Lines:
- **XH08 Account data readiness for journey entry**: one-time, 16 / 32 / 64 hours. Needs Real-Time CDP B2B Edition or B2P Edition. Check that your client's account, person and opportunity data in Real-Time CDP uses Adobe's standard B2B relationships and is enabled for Profile, that every account record carries an Account Name, and plan journey entry around the daily audience evaluation.
  - Quote: "The Account Name attribute for account records must contain a value to be included in account journeys." (Experience League: Account Audiences (Journey Optimizer B2B Edition), https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/account-audience-overview)
- **XH09 Journey audiences for paid media destinations** (optional): one-time, 16 / 24 / 48 hours. Needs Real-Time CDP B2B Edition or B2P Edition. Add the Add to external customer audience action to account journeys, create the external audiences, and connect each one to a destination in Experience Platform so buying group members can be reached on a paid media channel.
  - Quote: "Use this action to push people to an external audience that can be activated across a paid media channel to target members of buying groups further." (Experience League: Take an Action, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journey-nodes/action-nodes)
- **XH10 Journey and buying group data in Experience Platform** (optional): one-time, 16 / 32 / 56 hours. Needs Real-Time CDP B2B Edition or B2P Edition. Map the datasets the B2B Edition writes to Experience Platform (people, accounts, buying groups, journey membership and activity events) to your client's reporting, and document which fields arrive empty and how old the data can be.
  - Quote: "Adobe Journey Optimizer B2B Edition makes account, person, buying group, and journey information available in Adobe Experience Platform." (Experience League: Exported Experience Platform Datasets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/aep-exported-datasets)

### Journey Optimizer B2B Edition + Target (`ajob2b-target`)

New in this pass.

How: An account journey adds people to an external customer audience, and that audience is activated to the Adobe Target destination in Real-Time CDP, so the people a journey qualifies appear as an audience in Target for web activities. (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)

Gain: **Web personalization for the buying group.** People a journey has qualified become a Target audience, so the website shows them the experience that matches where their account is in the journey.

Flows:
- Journey Optimizer B2B Edition to Target: People from account journeys, as an external customer audience activated through the Adobe Target destination in Real-Time CDP (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)

Kind: platform. Draft label for the card: People a journey qualifies sent to Target as an audience through Real-Time CDP.

Availability: Not stated by Adobe; the page says activation needs Adobe Target configured as a destination in Real-Time CDP. Quote: "Activating the external audience to Adobe Target requires that you have configured Adobe Target as a destination in Real-time Customer Data Platform (RTCDP)." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)

Prerequisites to check before selling it:
- Adobe Target configured as a destination in Real-Time CDP.
  - Quote: "Activating the external audience to Adobe Target requires that you have configured Adobe Target as a destination in Real-time Customer Data Platform (RTCDP)." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)
- Email Address used as an identity in your client's Real-Time CDP implementation.
  - Quote: "Using activation through a journey requires that your implementation of RTCDP uses Email Address as an identity." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)
- Permissions: the Destinations permissions in Experience Platform and the Approver role in Target.
  - Quote: "These steps require the following permissions for your assigned user role" (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)
- Up to 48 hours for people to appear in the external audience after they reach the journey node.
  - Quote: "it can take up to 48 hours for those profiles to populate in the external audience" (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)
- Target activities that use the audience: it arrives in Target Audiences and your client's Target team builds on it.
  - Quote: "Upon activation, you can see the audience in Adobe Target Audiences and use it in Adobe Target activities." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)

Client wording:
- How: An account journey adds people to an audience, and we activate that audience to Adobe Target through the Target destination in Real-Time CDP. The people your journey qualifies then appear as an audience in Target.
- Gain: The people a journey has qualified become a Target audience, so your website can show them the experience that matches where their account is in the journey.

Lines:
- **XH11 Journey audiences into Adobe Target**: one-time, 16 / 24 / 48 hours. Needs Real-Time CDP B2B Edition or B2P Edition. Add the Add to external customer audience action to your client's account journeys, activate each external audience to the Adobe Target destination in Real-Time CDP with Email Address as the identity, and confirm the audience appears in Target Audiences for the Target team to use.
  - Quote: "Upon activation, you can see the audience in Adobe Target Audiences and use it in Adobe Target activities." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)

## Not documented

- **Content Analytics + AEM Sites** (`ca`, `aemsites`): Still not documented. Content Analytics measures any website the same way; Adobe describes no data passing to or from AEM Sites. Searched: Nov 10 2026 recheck: the ten pages of the Content Analytics section of the Customer Journey Analytics guide (overview, configuration, guided, manual, standalone, data collection, paid media, JavaScript library, reporting, components), the Adobe Content Analytics Tags extension page, the How it works tutorial and Adobe's product description, searched by script for Experience Manager, AEM, Edge Delivery, aem.live, DAM and digital asset management: no match. Web searches limited to Adobe's documentation hosts for Content Analytics with AEM Sites, AEM Assets and Edge Delivery Services, and for Content Analytics inside the AEM as a Cloud Service guide: no page returned. Content Analytics goes on any site through a Tags property or its JavaScript library and reads each page by URL, so it works on an AEM Sites site, but no Adobe page ties the two products together.
  - Nearest quote: "These content experience events require the data to be collected with the Experience Platform Edge Network (Web SDK, Mobile SDK, Server API) or through Experience Platform source connectors." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- **Content Analytics + AEM Assets** (`ca`, `aemassets`): Still not documented. The identity and featurization services work from the public URL of each image, whichever DAM serves it. Searched: Same Content Analytics pages and searches as for AEM Sites (no match for Experience Manager, AEM, DAM or digital asset management). Content Analytics identifies each image by its URL and a perceptual ID that it creates itself; no page describes reading asset metadata from AEM Assets or writing attributes back to it.
  - Nearest quote: "That process consists of a retrieval service that revisits the public-facing versions of the configured URLs that define the interactions and the HTML that defines the experience." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
- **Content Analytics + Edge Delivery Services** (`ca`, `eds`): Not documented on Adobe's documentation sites. Searched: Same Content Analytics pages and searches (no match for Edge Delivery or aem.live). The www.aem.live documentation index (237 pages) searched by script for Content Analytics: no match. The Oct 31 recheck found that the Content Analytics JavaScript library on GitHub recognizes Edge Delivery experimentation variants; GitHub is not one of the allowed sources and no Adobe documentation page describes it, so it was not read again.
  - Nearest quote: "Use this library when you want to implement Content Analytics without Adobe Experience Platform Tags." (Experience League: Content Analytics JavaScript Library, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/tags-agnostic)
- **Content Analytics + Journey Optimizer** (`ca`, `ajo`): Still not documented. Searched: Same Content Analytics pages, searched by script for Journey Optimizer: no match. The channels are web, mobile and paid media; email and journeys are not among them.
  - Nearest quote: "In the Channels section, you select the channels you want to enable for Content Analytics." (Experience League: Content Analytics Guided Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
- **Content Analytics + Experimentation Accelerator** (`ca`, `xa`): Still not documented. The accelerator takes experiments from Journey Optimizer and Target and uses Customer Journey Analytics or Adobe Analytics as reporting sources. Searched: Experimentation Accelerator overview, access, best practices and monitor pages, the Journey Optimizer page for the accelerator and Adobe's product description (no mention of Content Analytics); the Content Analytics pages (no mention of the accelerator or of experiments).
  - Nearest quote: "The Experiments tab centralizes the tracking and analysis of tests from Adobe Journey Optimizer and Adobe Target." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **AEM Sites + Experimentation Accelerator** (`aemsites`, `xa`): Still not documented. Searched: Experimentation Accelerator overview, access, best practices and monitor pages and Adobe's product description: only Target and Journey Optimizer experiments are listed, and Experience Manager is not named.
  - Nearest quote: "all available experiments from Journey Optimizer and Adobe Target are listed in a consolidated view" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **AEM Assets + Experimentation Accelerator** (`aemassets`, `xa`): Still not documented. Searched: Experimentation Accelerator monitor page: treatment images are generated automatically or uploaded from local files; no link to a DAM.
  - Nearest quote: "you can select Add image or Replace image to upload a preferred screenshot from your local files" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- **Adobe Commerce + Journey Optimizer B2B Edition** (`commerce`, `ajob2b`): Still not documented. Searched: All 133 pages of the Journey Optimizer B2B Edition guide, downloaded and searched by script for Commerce: the only matches are Commerce event names in the engagement score weighting list (Commerce Checkouts, Commerce Purchases and similar). No page describes an Adobe Commerce integration. A route through Experience Platform events is possible but not documented, see notes.
- **Journey Optimizer B2B Edition + AEM Sites** (`ajob2b`, `aemsites`): Still not documented. Searched: All 133 pages of the Journey Optimizer B2B Edition guide searched by script for Experience Manager Sites, AEM Sites and Edge Delivery: no match apart from AEM Assets. The web channel personalizes any site that runs the Experience Platform Web SDK, and Adobe labels that channel as an early release (see left_out). Landing pages are the B2B Edition's own pages.
  - Nearest quote: "Currently, only image assets from Adobe Experience Manager Assets are supported in Adobe Journey Optimizer B2B Edition." (Experience League: Work with Experience Manager Assets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets)
- **Journey Optimizer B2B Edition + Workfront** (`ajob2b`, `workfront`): Not documented. The B2B Edition has external action nodes for calling outside services, but no Adobe page describes Workfront with it. Searched: All 133 pages of the Journey Optimizer B2B Edition guide searched by script for Workfront: no match. Web search limited to Adobe's documentation hosts for Journey Optimizer B2B Edition with Workfront: the results are the Workfront Fusion modules for Journey Optimizer, which do not name the B2B Edition, and Adobe's blueprints for Marketo Engage with Workfront.
  - Nearest quote: "marketers can add External action and External split path nodes to make outbound requests to external services during account journey execution" (Experience League: Journey Optimizer B2B Edition Release Notes, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes)

## Left out, and why

Brief step 3: a service that rests on a feature Adobe keeps in an early or limited program is left out and listed here with Adobe's words. Four entries are cases where two Adobe pages disagree.

| What | Why | Adobe's words | Page |
|---|---|---|---|
| Content Analytics paid media from Pinterest, Snapchat and TikTok | Adobe keeps these three ad networks in a testing phase, so CA04 is scoped to Google Ads and Meta Ads. | "Pinterest, Snapchat, and TikTok are in the Limited Testing phase of release and might not be available yet in your environment." | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media |
| The Google Ads (beta) source card in Experience Platform | Adobe's Content Analytics guide warns against it. CA04 uses the standard Google Ads source. | "Do not use Setup in the Google Ads (beta) card." | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided |
| Applying an accelerator opportunity inside Adobe Target (the AI insights tab in Target's Activity Overview) | Target's own page labels the tab a beta feature, although the accelerator's page describes the hand-off without a label. The xa-target lines stop at listing and reviewing Target tests in the accelerator. | "The AI insights feature is currently available as a beta feature." | https://experienceleague.adobe.com/en/docs/target/using/activities/ai-insights |
| Journey Optimizer B2B Edition web channel: web experiences, the Personalize web experience action and the web reports built in Customer Journey Analytics | Adobe labels the channel Beta in the setup checklist and on the action. So there is no web line, no connection to AEM Sites or Edge Delivery through it, and no connection to Customer Journey Analytics (the guide names its reporting only for web experience reports). | "Web (Beta) channel configuration for Journey Optimizer B2B Edition" | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate |
| Relational schemas and custom objects in the B2B Edition (journey filters, buying group role conditions, email personalization) | Adobe's XDM field page calls the relational tab a beta feature release, and the journey and personalization pages badge the custom object filters as Beta. JB01 therefore covers the standard XDM fields and events only; its Oct 30 scope named relational fields. | "In this beta feature release, only Account and People many-to-one Custom Objects are supported." | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/xdm-field-management |
| Coworker Chat for Journey Optimizer B2B Edition (journey skills and audience skills for B2B accounts and people) | Adobe's pages disagree. The B2B Edition guide documents the skills as currently available in the Coworker app, while Coworker's own overview and its list of compatible applications say the B2B editions are coming soon. Left out until the pages agree, so there is no ajob2b-cw connection. | "The B2B editions of Real-Time CDP, Adobe Journey Optimizer, and Customer Journey Analytics are coming soon." | https://experienceleague.adobe.com/en/docs/coworker/content/home |
| Person journeys in the B2B Edition | Adobe's pages disagree. The release notes say person journeys were previously Beta and are in early deployment for general availability, while the journeys dashboard page still badges them as a beta feature. JB04 covers account journeys. | "Person journeys (Previously Beta, early deployment for general availability)" | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes |
| Variant split paths in B2B journeys | Adobe's pages disagree. The B2B Edition release notes say the nodes were previously Beta for account journeys, while the central release notes list split path nodes with variants as Beta. Not used in any line. | "Split path journey nodes with variants (Beta) for A/B testing" | https://experienceleague.adobe.com/en/docs/release-notes/experience-cloud/current |
| Brands and the brand alignment score in the B2B Edition | A public beta that needs a user agreement. | "This capability is currently available as a public beta." | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/brands/brands-overview |
| Generated landing page content in the B2B Edition | Adobe's page says the capability is in its Beta version. | "This capability is available in its Beta version and subject to change without prior notice." | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/landing-pages/generate-content-landing-pages |
| Script Builder for email personalization in the B2B Edition | A limited beta release for select customers. It matters for clients moving personalization logic over from Marketo Engage. | "Script Builder is currently available to select customers as a limited beta release for emails in account journeys only" | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/personalization/script-builder |
| Advanced HTML mode for B2B Edition email templates | In Limited Availability. | "This feature is currently in Limited Availability and is not available to all users." | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-template-advanced-html |
| The executionMetadata personalization helper in the B2B Edition | In Limited Availability. | "This capability is in Limited Availability. Contact your Adobe representative to gain access." | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/personalization/personalization-helper-functions |
| GenStudio for Performance Marketing email experiences imported into B2B Edition emails | The B2B Edition release notes list the integration as Limited Availability. GenStudio for Performance Marketing is rechecked in the other wave 1 file; no ajob2b-gspm connection is written here. | "Integration with GenStudio for Performance Marketing (Limited Availability)" | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes |

## Documented, but not costed

Real, documented pieces of work that did not get a line in this pass. Ask and they can be added.

- Content Analytics for a mobile app (the mobile channel in the guided configuration, with the Mobile SDK extension) (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided).
- Content Analytics without Tags, through the Content Analytics JavaScript library (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/tags-agnostic).
- The Paid media Content Analytics Workspace template (CA05 names the main template only) (https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report).
- The Experimentation Agent in Journey Optimizer's AI Assistant, which comes with the accelerator license (https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/ai-features).
- B2B Edition SMS and WhatsApp channels (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-sms).
- B2B Edition landing pages and forms (the pages and forms themselves carry no label; generated landing page content does) (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/landing-pages/landing-pages).
- LinkedIn Account Matched Audiences from account journeys (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/linkedin-account-matched-audiences).
- In-CRM Insights for Salesforce and Dynamics (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/incrm-insights).
- External action and external split path nodes that call outside services (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-external-actions).
- Intent data, engagement score weighting and buying group stages (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/intent-data).
- Image editing with Adobe Express inside the B2B Edition (Adobe Express is not a product in the tool; this morning's map has the link) (https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/internal-dam/image-edit-adobe-express).

## What surprised us, or what a partner would get wrong

1. *Content Analytics.* **It is sold on its own but set up inside Customer Journey Analytics.** A partner who hears "standalone" will look for a separate product screen. There is none: the setup is a schema, a datastream, a Tags property, a connection, a data view and a Workspace project, and Adobe's own guide budgets half a day for the first pass.
   - "Content Analytics is licensed as a standalone product, but the configuration happens within Experience Platform and Customer Journey Analytics." (Experience League: Configure Content Analytics (Standalone), https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)
   - "Plan 4-6 hours for the initial setup, plus additional time to test and validate the setup." (Experience League: Configure Content Analytics (Standalone), https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)
   - "Although you are only interested in the functionality of Content Analytics, for that functionality to work properly, you still require access and permissions for other Experience Platform products." (Experience League: Configure Content Analytics (Standalone), https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)
2. *Content Analytics.* **The add-on to Customer Journey Analytics is gone.** A client that bought Content Analytics as an add-on cannot renew it that way. (The date is Adobe's, in its product description; it stays out of anything a partner or client reads.)
   - "As of February 2026, Adobe Content Analytics is no longer available to be licensed as an Add-on to Customer Journey Analytics and is ineligible for renewal for any future Sales Order." (Adobe: Customer Journey Analytics product description, https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html)
3. *Content Analytics.* **One configuration and one connection for each sandbox.** A client with several brands in one sandbox cannot run a configuration for each.
   - "You can only have one Content Analytics configuration per sandbox in your organization." (Experience League: Content Analytics Guided Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
   - "Connections 1 connection per Sandbox ... Data Views 15 per connection" (Adobe: Adobe Content Analytics product description, https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html)
4. *Content Analytics.* **Switching on paid media does not tie ads to revenue.** The tie is separate work (CA04), and the reports show association, not cause.
   - "Enabling paid media does not automatically connect the paid media data to your site's orders, bookings, or revenue." (Experience League: Content Analytics Paid Media Automatic Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
   - "These reports can reveal associations between creative attributes and performance, not prove that an attribute caused a result." (Experience League: Content Analytics Paid Media Automatic Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
5. *Content Analytics.* **Paid media is Google and Meta for now, and not on AWS.** Three more networks carry a testing label, and Adobe warns against one of the two Google Ads source cards.
   - "Pinterest, Snapchat, and TikTok are in the Limited Testing phase of release and might not be available yet in your environment." (Experience League: Content Analytics Paid Media Automatic Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media)
   - "The paid media channel is not available for Customer Journey Analytics and Experience Platform deployments on AWS." (Experience League: Content Analytics Guided Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
   - "Do not use Setup in the Google Ads (beta) card." (Experience League: Content Analytics Guided Configuration, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided)
6. *Content Analytics.* **The event schema cannot be extended.** No bot detection, geolocation or device lookup field groups, and no identifier for field-based stitching.
   - "The schema used for Content Analytics event data is system-owned." (Experience League: Configure Content Analytics, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration)
7. *Content Analytics.* **English only, and not for regulated health data.**
   - "Content Analytics supports featurization in English only." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
   - "Also, Content Analytics is not a HIPAA-Ready service." (Experience League: Content Analytics Overview, https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics)
8. *Content Analytics + Coworker.* **Coworker reads Content Analytics; it does not set it up, and it skips paid media.** The skill's own table lists what is out of scope, and it needs an image's URL or asset ID.
   - "Answer general or specific questions about your content using Content Analytics data in Customer Journey Analytics" (Experience League: Analyze Analytics Data with Adobe CX Enterprise Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
   - "Setting up or configuring Content Analytics ... Content that Content Analytics doesn't collect ... Paid media content" (Experience League: Analyze Analytics Data with Adobe CX Enterprise Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview)
   - "Coworker can't identify an image by its role on the page, such as a hero image or a banner." (Experience League: Ask Questions About Your Content with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions)
9. *Experimentation Accelerator.* **It cannot be added to the Journey Optimizer Starter packages.**
   - "Experimentation Accelerator is not compatible with Adobe Journey Optimizer Prime Starter or Ultimate Starter." (Adobe: Journey Optimizer Experimentation Accelerator product description, https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html)
10. *Experimentation Accelerator.* **Insights and opportunities only come for text changes, and only after someone fills in the hypothesis.** An image or layout test gets a results table and nothing more.
   - "Opportunities feature is limited to experiments with text-based changes." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
   - "for Experiment insights to be generated, you need to confirm hypothesis and treatment details and statistical significance to be reached." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
11. *Experimentation Accelerator.* **Changing the primary metric wipes the insights, stays in the accelerator, and is not possible for a Target-only test.**
   - "When you change the primary metric, previously generated insights and opportunities are cleared and regenerated." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
   - "They are not written back to Adobe Target or Adobe Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
   - "If your organization uses only Adobe Target as the reporting source, you cannot change the primary metric after the test is published." (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
12. *Experimentation Accelerator + Target.* **Target tests show up in the Journey Optimizer production sandbox, even for a client that has only Target, and only A/B activities are named.** Target-only users have one way in.
   - "All A/B activities in your Target organization are included in the production sandbox of Journey Optimizer." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
   - "Note that users with only a Target license can access it only through the Apps switcher." (Experience League: Journey Optimizer Experimentation Accelerator, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access)
13. *Experimentation Accelerator + Target.* **The accelerator's page and Target's page do not agree on how finished the hand-off is.** The accelerator says a suggestion loads into Target's workflow; Target's page for the matching tab carries a beta label.
   - "the suggested changes will instead be loaded into Adobe Target" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
   - "The AI insights feature is currently available as a beta feature." (Experience League: AI insights in the Activity Overview (Target), https://experienceleague.adobe.com/en/docs/target/using/activities/ai-insights)
14. *Experimentation Accelerator.* **The Experimentation Agent rides on the accelerator license.** It lives in Journey Optimizer's AI Assistant, not in Coworker, and is not costed.
   - "The Experimentation Agent is available with the Journey Optimizer Experimentation Accelerator license and requires View Experiments and Manage Experiment Metadata permissions." (Experience League: Work with AI (Journey Optimizer), https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/ai-features)
15. *Journey Optimizer B2B Edition.* **It is not Marketo with a new face.** The B2B Edition and Marketo Engage are separate systems. The Marketo Engage instance that comes with the subscription is plumbing for entitlements and email delivery; it is not the client's production Marketo and holds no journeys.
   - "Journey Optimizer B2B Edition and Marketo Engage run on separate systems, each with its own data store." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
   - "This instance does not store your account journeys, audiences, or buying groups." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
   - "Account journeys do not appear in Marketo Engage, and they are only usable in Journey Optimizer B2B Edition." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
16. *Journey Optimizer B2B Edition.* **It needs Real-Time CDP B2B Edition (or B2P).** A client on standard Real-Time CDP has no account audiences to start a journey from.
   - "Journey Optimizer B2B Edition functions as an Adobe Real-Time CDP B2B Edition destination." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
   - "Account audiences are only available in the B2B Edition of Real-Time Customer Data Platform and the B2P Edition of Real-Time Customer Data Platform" (Experience League: Account Audiences (Experience Platform), https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/account-audiences)
17. *Journey Optimizer B2B Edition.* **Nothing is instant.** Audiences are evaluated once a day, accounts enter a journey within 24 hours, data written back takes up to four hours, and an external audience can take 48 hours to fill.
   - "Qualifying accounts enter a published journey within 24 hours." (Experience League: Adobe Journey Optimizer B2B Edition Overview, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition)
   - "Design journeys with the understanding that audience membership is refreshed daily, not in real time." (Experience League: Data availability and sync timing, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/data-availability-timing)
   - "it can take up to 48 hours for those profiles to populate in the external audience" (Experience League: Take an Action, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journey-nodes/action-nodes)
18. *Journey Optimizer B2B Edition.* **An account without a name never enters a journey.**
   - "The Account Name attribute for account records must contain a value to be included in account journeys." (Experience League: Account Audiences (Journey Optimizer B2B Edition), https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/account-audience-overview)
19. *Journey Optimizer B2B Edition + Marketo Engage.* **Journey actions only touch people who already exist in Marketo, and what marketers can pick depends on the custom service's role.**
   - "A journey action does not create a new person record in Marketo Engage when a matching record does not exist." (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
   - "The role permissions assigned in the custom service govern Marketo Engage workspace visibility for assets, such as lists and campaigns." (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
   - "Marketo Engage actions executed from a journey do not apply to the REST API limits for the connected Marketo Engage instance." (Experience League: Activate Marketo Engage to Support Journey Actions, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect)
20. *Journey Optimizer B2B Edition + Marketo Engage.* **Shared email limits are a support request, not a switch.**
   - "Contact Adobe Support or open a Support ticket to enable the sharing of communication limits between Journey Optimizer B2B Edition and one or more Marketo Engage instances." (Experience League: Email Channel Configurations, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-emails)
21. *Journey Optimizer B2B Edition.* **Adobe Marketo Optimizer is a different product.** It pairs with one Marketo Engage instance, syncs leads with it directly and does not need Real-Time CDP. A partner who mixes the two up will scope the wrong data work.
   - "Each Marketo Optimizer instance is paired with one Marketo Engage instance." (Experience League: Data Architecture (Marketo Optimizer), https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/data-foundation/data-architecture)
   - "Marketo Optimizer does not require Real-Time Customer Data Platform, Real-Time Customer Profile, or segmentation." (Experience League: Data Architecture (Marketo Optimizer), https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/data-foundation/data-architecture)
   - "Marketo Engage leads and activities flow into Marketo Optimizer automatically." (Experience League: Interoperability with Marketo Engage (Marketo Optimizer), https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/data-foundation/marketo-interoperability)
   - "Adobe Marketo Optimizer is a B2B customer journey orchestration application that enables marketing and sales teams to act as a coordinated revenue team" (Adobe: Adobe Marketo Optimizer product description, https://helpx.adobe.com/legal/product-descriptions/adobe-marketo-optimizer.html)
22. *Journey Optimizer B2B Edition + AEM Assets.* **One repository or several?** Adobe's product description says one; the guide walks through adding another.
   - "Adobe Journey Optimizer B2B Edition can connect to one Adobe Experience Manager Repository." (Adobe: Adobe Journey Optimizer B2B Edition product description, https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html)
   - "You can add another repository by repeating steps 3-4." (Experience League: Configure Experience Manager Asset Repositories, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories)
23. *Journey Optimizer B2B Edition + Coworker.* **Two Adobe guides, two answers.** The B2B Edition guide documents Coworker journey skills and audience skills as available; Coworker's own pages list the B2B editions as coming soon. No connection is written.
   - "Use the CX Enterprise Coworker app interface for all chat workflows other than generating content." (Experience League: AI Capabilities in Journey Optimizer B2B Edition, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/ai-capabilities/ai-overview)
   - "CX Coworker provides a set of AI skills that includes a subset for the B2B journey lifecycle." (Experience League: Journey Skills for B2B, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/ai-capabilities/coworker-skills/journey-agent)
   - "The B2B editions of Real-Time CDP, Adobe Journey Optimizer, and Customer Journey Analytics are coming soon." (Experience League: Adobe CX Enterprise Coworker Overview, https://experienceleague.adobe.com/en/docs/coworker/content/home)
   - "Adobe Journey Optimizer B2B Edition (coming soon)" (Experience League: Adobe CX Enterprise Coworker Chat Overview, https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview)
24. *Journey Optimizer B2B Edition.* **Several pieces a partner would expect to sell carry early labels.** The web channel, custom objects, brands, generated landing page content, Script Builder and advanced HTML are all labelled, and person journeys are labelled on one page and not on another. The lines stay on account journeys with email.
   - "Web (Beta) channel configuration for Journey Optimizer B2B Edition" (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
   - "In this beta feature release, only Account and People many-to-one Custom Objects are supported." (Experience League: XDM Field Management, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/xdm-field-management)
   - "Person journeys (Previously Beta, early deployment for general availability)" (Experience League: Journey Optimizer B2B Edition Release Notes, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes)
   - "With person journeys, your marketing operations are not reliant on Marketo Engage or workarounds for Adobe Campaign/B2C tool chains so that they can support B2B use cases." (Experience League: Journey management, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journeys-overview)
25. *Journey Optimizer B2B Edition + Real-Time CDP.* **The data written back has holes.** The buying group stage fields are empty, and a dataset being there does not make it usable for audiences.
   - "buyingGroupStage is currently blank. Do not use it to filter or group buying groups by stage." (Experience League: Exported Experience Platform Datasets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/aep-exported-datasets)
   - "A dataset's presence in Experience Platform does not, by itself, mean it is available for segmentation." (Experience League: Exported Experience Platform Datasets, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/aep-exported-datasets)
26. *Journey Optimizer B2B Edition + Target.* **The Target audience needs email as an identity and runs through Real-Time CDP.**
   - "Using activation through a journey requires that your implementation of RTCDP uses Email Address as an identity." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)
   - "Activating the external audience to Adobe Target requires that you have configured Adobe Target as a destination in Real-time Customer Data Platform (RTCDP)." (Experience League: Adobe Target External Audiences, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience)

## Open questions for Adam

1. **Coworker with Journey Optimizer B2B Edition.** Adobe's B2B guide shows Coworker skills for B2B journeys and audiences as available. Coworker's own pages say the B2B editions are coming soon. It is left out for now. Leave it out until Adobe's pages agree, or ask the Coworker team which page is right?
2. **Real-Time CDP B2B Edition.** Journey Optimizer B2B Edition only works with the B2B (or B2P) edition of Real-Time CDP. The tool has one Real-Time CDP box. Is a "Needs Real-Time CDP B2B Edition or B2P Edition" tag on the lines enough, or should the card say it first?
3. **B2B Edition + Target.** This pair was not on the list, but Adobe documents it with setup steps, so it is written up with one service (XH11). Keep it?
4. **Accelerator + Target.** The two services cover getting Target teams in and reviewing Target tests in the accelerator. Applying a suggestion inside Target is left out, because Target's own page labels that tab a beta feature. Is that the right line to draw?
5. **Content Analytics + Coworker for clients with only the standalone license.** Adobe's Coworker pages ask for Customer Journey Analytics data views. They do not say whether a client who bought Content Analytics on its own, without Customer Journey Analytics, can use Coworker with it. Show the connection with a "confirm with Adobe" prerequisite, or hold it?

Smaller points, no answer needed now: EX04 (the primary metric from Customer Journey Analytics or Adobe Analytics) could become an `xa-cja` connection if you want that line drawn on the canvas; and when `ca-cw` merges, it should carry the catalog's standard Coworker eligibility prerequisite, as the other Coworker connections do.

## Other things seen, with Adobe's words

- Coworker Chat is licensed through the Adobe account team: "Licensed through your Adobe account team." (Experience League: Adobe CX Enterprise Coworker Overview, https://experienceleague.adobe.com/en/docs/coworker/content/home)
- Adobe's central release notes on the Content Analytics skill in Coworker (the date is Adobe's and stays out of partner and client text): "CX Enterprise Coworker: ask questions about your content using Content Analytics data (General Availability) (November 3)" (Experience League: Central Release Notes, https://experienceleague.adobe.com/en/docs/release-notes/experience-cloud/current)
- Coworker Chat comes as a full-page workspace and, in some applications, inside the product: "Coworker Chat is available as an immersive experience, a full-page workspace, and as an in-product experience in some CX Enterprise applications." (Experience League: Get Started with Coworker Chat, https://experienceleague.adobe.com/en/docs/coworker/content/chat/ui-guide)
- The B2B Edition setup checklist on the architecture: "Journey Optimizer B2B Edition and Marketo Engage are not on the same system or the same data store." (Experience League: Setup checklist, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate)
- What Adobe Marketo Optimizer is: "Adobe Marketo Optimizer is an AI-first marketing automation solution that empowers marketers and business development representatives (BDRs) to bring their lead, account, and buying group journeys together" (Experience League: Adobe Marketo Optimizer Documentation, https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/guide-overview)
- The release note behind ajob2b-target: "Activate audience to Adobe Target" (Experience League: Journey Optimizer B2B Edition Release Notes, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes)
- The release note behind the smart list filters named in XH06: "Buying group filters for Marketo Engage smart lists" (Experience League: Journey Optimizer B2B Edition Release Notes, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes)
- The sentence behind EX04 and its ext: "Changing the primary metric applies to teams that use Customer Journey Analytics or Adobe Analytics as the reporting source" (Experience League: Journey Optimizer Experimentation Accelerator monitor, https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor)
- The one place the B2B Edition guide names Customer Journey Analytics reporting, on the web channel: "you can also build reports using the Adobe Customer Journey Analytics (which requires a product subscription)" (Experience League: Web Experience Design, https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journey-content/web-channel/web-experience-design)
- Who the standalone Content Analytics guide is for: "This configuration guide is for customers that have licensed the standalone Adobe Content Analytics package." (Experience League: Configure Content Analytics (Standalone), https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone)

## Pages downloaded and checked

Every page below was downloaded on Nov 10 2026 and is cited in the JSON or in this trail.

| Page | URL | Times cited in this trail |
|---|---|---|
| Adobe: Adobe Content Analytics product description | https://helpx.adobe.com/legal/product-descriptions/adobe-content-analytics.html | 3 |
| Adobe: Adobe Journey Optimizer B2B Edition product description | https://helpx.adobe.com/legal/product-descriptions/adobe-journey-optimizer-b2b.html | 6 |
| Adobe: Adobe Marketo Optimizer product description | https://helpx.adobe.com/legal/product-descriptions/adobe-marketo-optimizer.html | 1 |
| Adobe: Customer Journey Analytics product description | https://helpx.adobe.com/legal/product-descriptions/customer-journey-analytics.html | 2 |
| Adobe: Journey Optimizer Experimentation Accelerator product description | https://helpx.adobe.com/legal/product-descriptions/journey-optimizer-experimentation-accelerator.html | 8 |
| Experience League: AI Capabilities in Journey Optimizer B2B Edition | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/ai-capabilities/ai-overview | 1 |
| Experience League: AI insights in the Activity Overview (Target) | https://experienceleague.adobe.com/en/docs/target/using/activities/ai-insights | 3 |
| Experience League: Account Audiences (Experience Platform) | https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/types/account-audiences | 4 |
| Experience League: Account Audiences (Journey Optimizer B2B Edition) | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/account-audience-overview | 4 |
| Experience League: Activate Marketo Engage to Support Journey Actions | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/marketo-actions-connect | 10 |
| Experience League: Adobe CX Enterprise Coworker Chat Overview | https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview | 2 |
| Experience League: Adobe CX Enterprise Coworker Overview | https://experienceleague.adobe.com/en/docs/coworker/content/home | 7 |
| Experience League: Adobe Journey Optimizer B2B Edition Overview | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/about-journey-optimizer-b2b-edition | 12 |
| Experience League: Adobe Marketo Optimizer Documentation | https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/guide-overview | 1 |
| Experience League: Adobe Target External Audiences | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/audiences/target-external-audience | 11 |
| Experience League: Advanced HTML Mode for Email Template Design | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-template-advanced-html | 1 |
| Experience League: Analyze Analytics Data with Adobe CX Enterprise Coworker Chat | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/analytics-overview | 3 |
| Experience League: Ask Questions About Your Content with Coworker Chat | https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/data-insights/content-performance/ask-content-questions | 9 |
| Experience League: B2B Namespaces and schemas | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/namespaces-schemas | 3 |
| Experience League: Central Release Notes | https://experienceleague.adobe.com/en/docs/release-notes/experience-cloud/current | 2 |
| Experience League: Configure Content Analytics | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/configuration | 7 |
| Experience League: Configure Content Analytics (Standalone) | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/standalone | 6 |
| Experience League: Configure Experience Manager Asset Repositories | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/configurations/configure-aem-repositories | 9 |
| Experience League: Content Analytics Guided Configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/guided | 7 |
| Experience League: Content Analytics JavaScript Library | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/tags-agnostic | 1 |
| Experience League: Content Analytics Manual Configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/manual | 1 |
| Experience League: Content Analytics Overview | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/content-analytics | 9 |
| Experience League: Content Analytics Paid Media Automatic Configuration | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/configuration/paid-media | 5 |
| Experience League: Content Analytics Reporting | https://experienceleague.adobe.com/en/docs/analytics-platform/using/content-analytics/report/report | 1 |
| Experience League: Data Architecture (Marketo Optimizer) | https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/data-foundation/data-architecture | 2 |
| Experience League: Data availability and sync timing | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/data-availability-timing | 4 |
| Experience League: Email Channel Configurations | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/admin/channels/configure-channels-emails | 3 |
| Experience League: Exported Experience Platform Datasets | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/data/aep-exported-datasets | 5 |
| Experience League: Generate landing page content | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/landing-pages/generate-content-landing-pages | 1 |
| Experience League: Get Started with Coworker Chat | https://experienceleague.adobe.com/en/docs/coworker/content/chat/ui-guide | 1 |
| Experience League: Get started with content experiment | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/content-management/content-experiment/get-started-experiment | 2 |
| Experience League: Helper functions list | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/personalization/personalization-helper-functions | 1 |
| Experience League: Interoperability with Marketo Engage (Marketo Optimizer) | https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/data-foundation/marketo-interoperability | 1 |
| Experience League: Journey Optimizer B2B Edition Release Notes | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/release-notes | 6 |
| Experience League: Journey Optimizer Experimentation Accelerator | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/overview | 5 |
| Experience League: Journey Optimizer Experimentation Accelerator | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-access | 13 |
| Experience League: Journey Optimizer Experimentation Accelerator monitor | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/monitor/experiment-accelerator-monitor | 26 |
| Experience League: Journey Skills for B2B | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/ai-capabilities/coworker-skills/journey-agent | 2 |
| Experience League: Journey management | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journeys-overview | 2 |
| Experience League: Script Builder | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/personalization/script-builder | 1 |
| Experience League: Select Experience Events and Fields | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/configure-aep-events | 1 |
| Experience League: Setup checklist | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/setup-ultimate | 8 |
| Experience League: Take an Action | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journeys/journey-nodes/action-nodes | 5 |
| Experience League: Use Brands for Content Generation and Consistency | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/brands/brands-overview | 1 |
| Experience League: Web Experience Design | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/journey-content/web-channel/web-experience-design | 1 |
| Experience League: Work with AI (Journey Optimizer) | https://experienceleague.adobe.com/en/docs/journey-optimizer/using/get-started/ai-features | 1 |
| Experience League: Work with Experience Manager Assets | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/assets/aem-assets | 4 |
| Experience League: XDM Field Management | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/get-started/admin-setup/xdm-field-management | 2 |
| https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-best-practices | https://experienceleague.adobe.com/en/docs/experimentation-accelerator/using/get-started/experiment-accelerator-best-practices | 1 |
| https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/solution-interests | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/accounts/buying-groups/solution-interests | 1 |
| https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-templates | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/content-management/templates/email-templates/email-templates | 1 |
| https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/dashboards/intelligent-dashboard | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/dashboards/intelligent-dashboard | 1 |
| https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview | https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/guide-overview | 1 |

Also downloaded and searched, not cited: the other pages of the Journey Optimizer B2B Edition guide (133 pages in all, listed at `https://experienceleague.adobe.com/en/toc/journey-optimizer-b2b-help-user`), the Experimentation Accelerator best practices page (cited in the JSON for EX02 only), the Journey Optimizer content experiment pages, the Journey Optimizer and Target release notes, the Adobe Target product description, the Journey Optimizer product description, the Content Analytics data collection, components, Tags extension and How it works pages, the Coworker analytics get-started page, and the www.aem.live documentation index.

## Pages not read

- https://business.adobe.com/: Blocked host. The Content Analytics, Experimentation Accelerator and Journey Optimizer B2B Edition product pages, and the AEM Sites content insights page that the Oct 31 recheck could not read either, were not attempted.
- https://www.adobe.com/: Blocked host. The Content Analytics security overview (a PDF under the Trust Center) and the generative AI licensing terms that the product descriptions link to were not attempted.
- https://github.com/adobe/content-analytics: GitHub is not one of the allowed sources. The Content Analytics JavaScript library's own repository and the B2B namespace and schema utility on GitHub were not read.
- https://video.tv.adobe.com/: Overview videos linked from the Coworker, Experimentation Accelerator and B2B Edition pages are on a host outside the allowed list. Not watched.
- https://developer.adobe.com/journey-optimizer-b2b-apis/: Not downloaded: no line depends on the B2B Edition APIs. External actions are listed under documented, not costed, in the trail.
- https://experienceleague.adobe.com/en/docs/platform-learn/tutorials/destinations/target/configure-the-target-destination: The tutorial the Target external audiences page links to for setting up the Target destination was not read; the ajob2b-target prerequisites come from the B2B Edition page itself.

## Out-of-scope entries: proof they are unchanged

Checked by script on the file as written. For each out-of-scope entry the parsed object equals the Oct 30 object, the keys are in the same order, the entry's text block (as the file is written, indent 1) is byte for byte the same, and that block occurs exactly once in each file:

```
product    aemsites             equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=5145 lines=SI01..SI06 (6)
product    aemassets            equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=5172 lines=AS01..AS06 (6)
connection aemsites-aemassets   equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=3208 lines=XC01..XC02 (2)
connection aemassets-ajo        equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=3080 lines=XC03..XC04 (2)
connection aemsites-ajo         equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=3947 lines=XC05..XC07 (3)
connection commerce-aemsites    equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=3666 lines=XC10..XC12 (3)
connection commerce-aemassets   equal=True key_order=True bytes_equal=True block_in_old=True block_in_new=True bytes=4392 lines=XC13..XC16 (4)
order of products True
order of first 7 connections True
plays identical True
out-of-scope and general notes (4 to 9, 12, 13) identical True
ALL OUT-OF-SCOPE ENTRIES BYTE-IDENTICAL
new ids ['XH01', 'XH02', 'XH03', 'XH04', 'XH05', 'XH06', 'XH07', 'XH08', 'XH09', 'XH10', 'XH11']
files scanned 21 | clashes [] | duplicates inside file False
all line ids unique in file True 59
```

## Before merging into the canvas

- The JSON keeps the Oct 30 structure (`lines` inside each product and connection, `no_services` on connections) and adds the fields the brief asks for. `catalog.json` uses line ids with a separate `lines` table, `sowHow`, `sowGain`, `sowPrereqs` and `needs` on flows; the `client` entries here are the draft for `connection_client` in `sow/product_copy_rules.json`.
- Product ids `ca`, `xa` and `ajob2b` and the new connection ids need placing in `catalog_map.json` before `build.py` will run.
- `ajob2b-target` has `needs: ["rtcdp"]` on its flow, in the catalog's own style, because the audience travels through the Target destination in Real-Time CDP.
- `ca-cw` should take the catalog's standard Coworker prerequisites (license through the account team, Adobe onboarding, the eligibility line) in the wording the other Coworker connections use.
- Content Analytics' other connections (`cja-ca`, `rtcdp-ca`, `mmm-ca`, `ca-gspm`) are in `portal_acquisition_insights.json` and its recheck, not here.
- The availability sentences quote Adobe and carry no program labels. The `left_out` list, the `why` fields under `not_documented` and this trail do carry Adobe's labels; they are for Adam, not for the tool.

