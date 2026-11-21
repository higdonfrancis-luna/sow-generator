# Audit before the hand-over to Adobe teammates: November 21, 2026

Adam asked eight questions before he submits the tool. This is the record: what was checked, how, what it found, what was changed the same day, and what waits for his call. The build audited is the one on Adobe Proto (version 9, branch `claude/sow-generator-handoff-517tq8`); the site rebuilt from source byte for byte before the checks. The changes are on branch `claude/great-lovelace-z309ti`. Nothing has gone to Proto or to `main`.

The catalog: **36 Adobe products, 18 outside systems, 217 connections, 632 services** (308 on product cards, 324 on connections). None of these counts changed today.

## The short answers

| # | Question | Answer | Changed today |
|---|---|---|---|
| 1 | Missing products, and levels | No product a partner sells today is missing by accident. Six names on Adobe's partner and certification portals are not in the tool, all known and left out or queued. Levels were not shown anywhere. | Levels now show beside every certification and, where Adobe states one, every training link |
| 2 | Smaller packages and add-ons | Handled three ways: 9 pickers on 8 products, 85 services tagged with the package they need, 2 notes. About 20 add-ons from the Nov 19 list are still not in. | Nothing; list below |
| 3 | Missing connections | 103 pairs Adobe documents that the tool does not draw: 16 worth real partner work, 39 medium, 48 small. | Nothing; proposals in section 3 |
| 4 | Full list of services | Every product and 169 of 217 connections have services. The Nov 19 list of about 120 service gaps is mostly still open. | Nothing; list below |
| 5 | The two cross-sell plays | The owned product's own services started unticked, as intended. Its outside-system services started ticked: 272 hours on the Customer Journey Analytics play, 520 on the Adobe Commerce play. | Adam: "go". They now start unticked, one click to add. Saved quotes keep their totals |
| 6 | Citation links | Every service and connection has an Adobe link, and no link is dead. 28 stored quotes were no longer on their page and 59 older services had no stored quote. | 87 quotes replaced or added. 630 of 632 services now hold a quote that is on its page word for word; the other 2 sit on pages only Adam's pastes can check |
| 7 | Training links | All 36 products have the box. Every certification Adobe offers for these products is listed. 141 of 143 public training links are live. | Commerce Optimizer and Commerce Intelligence now link the Adobe Commerce hub page; a broken build step for the training data is repaired |
| 8 | Make "Get your team ready" jump out | Built from the pictures in `mockups/nov21_training/` after Adam's "go". | A menu in the top bar of both pages, a red link on each product card, the box filled and outlined in red |

---

## 1. Products and levels

**How it was checked.** The 36 products were compared with three of Adobe's own lists: the product descriptions page (91 entries, https://helpx.adobe.com/legal/product-descriptions.html, read Nov 21), the product filters on the Certification Portal's course catalog (21, read from the public page Nov 21, the same 21 as on Nov 16) and the Products filter on the partner training catalog (20, from Adam's screenshots of Nov 16 and Nov 21).

**In the portals, not in the tool.**

| Name | Where Adobe lists it | State |
|---|---|---|
| Adobe Campaign | Both portals; two certifications (Campaign Classic Business Practitioner Expert, Developer Expert) | Left out on Adam's call (Nov 10); queued on Nov 20 behind his paste of its business.adobe.com overview |
| Adobe Advertising | Partner training catalog; two certifications (DSP and Search) | Left out on Adam's call (Nov 10) |
| Audience Manager | Partner training catalog | Left out on Adam's call (Nov 10) |
| Learning Manager | Partner training catalog | A maybe on the Nov 19 list |
| Adobe Stock | Partner training catalog | Skipped on the Nov 19 list as too thin for a box |
| Customer Journey Analytics B2B Edition | Certification Portal filter | On the Nov 19 list to add, as a picker or services on Customer Journey Analytics |
| Adobe Experience Platform | Both portals | In the tool through Real-Time CDP, Journey Optimizer and Customer Journey Analytics, which is how Adobe sells it |

Teammates who check the tool against the partner portal will notice Adobe Campaign first: it is the only one in both portals with certifications of its own.

Everything else on the product descriptions page that is not in the tool is either older or outside what partners implement here (ColdFusion, Connect, Primetime, Media Server, Digital Publishing, InDesign Server, Fonts, Journey Orchestration, Magento Commerce Starter, Order Management for Commerce, Attribution AI) or an add-on covered in section 2.

**Decided by Adam, Nov 21:** Semrush stays out. It will be folded into Brand Visibility.

**Levels.** Adobe uses three ladders:

| Where | Adobe's levels | In the tool since today |
|---|---|---|
| Courses on the Certification Portal | Foundations, Professional, Expert | Named under each product's Adobe courses link and in the top-bar menu |
| Certifications | Professional, Expert, Master (and Qualified Credentials) | A tag beside each certification, and in the box's heading: "6 certifications (Professional, Expert, Master)" |
| Experience League training | Beginner, Intermediate, Experienced | A tag beside each training link where Adobe states a level (70 of 143) |

- Full ladders (Professional, Expert and Master): AEM Sites, Adobe Analytics, Adobe Commerce, Marketo Engage. Two rungs: Customer Journey Analytics, Real-Time CDP, Journey Optimizer, Target, Workfront. One: AEM Assets, Journey Optimizer B2B Edition, Acrobat, Acrobat Sign.
- **The training picks lean beginner.** Of the 70 links with a stated level, 60 cover Beginner, 27 Intermediate, 8 Experienced. For 14 products every link with a stated level is Beginner only, among them Real-Time CDP, Journey Optimizer, Customer Journey Analytics, Adobe Analytics, Marketo Engage and Workfront. A delivery team needs more than the beginner path, so these are worth a second pick each. Not changed today.

Not read: the course cards on the Certification Portal (which courses exist at which level for each product). They load separately from the public page. Adam's paste of that page with "Show 60" would settle it.

## 2. Smaller packages, add-ons and components

**How the tool handles them.**

- **Pickers (9, on 8 products):** Adobe Commerce (on-premises, on Cloud, Cloud Service), Workfront (bought before or after March 12, 2026; and the Workflow package), Journey Optimizer, AEM Assets, AEM Sites, Target, Frame.io, Marketo Engage.
- **Tags on services (85 of 632):** the package or add-on a service needs, for example "Needs Customer Journey Analytics Select or higher" (12 services), "Needs the PDF Services API" (10), the Brand Intelligence add-ons (11), "Needs the Forms Communications add-on" (4).
- **Notes (2):** Commerce Optimizer and Creative Cloud.

**Where a product is thinner than Adobe's own description because a component is not in the tool.** All of these are on the Nov 19 lists (`handoff/2026-11-17/PRODUCT_COVERAGE.md` and `EXPERIENCE_LEAGUE_SWEEP.md`), each with an Adobe page, and none has been built since:

| Product | Component not in the tool |
|---|---|
| Real-Time CDP, Journey Optimizer, Customer Journey Analytics | Data Distiller; Federated Audience Composition; event forwarding; Privacy and Security Shield and Healthcare Shield (named only as a prerequisite) |
| Customer Journey Analytics | B2B Edition; streaming media (one service, on the Coworker line) |
| Journey Optimizer | Loyalty (one service, needs Coworker); Decisioning sits only on the Real-Time CDP line |
| Marketo Engage | Dynamic Chat, Sales Insight, Target Account Management, Interactive Webinars |
| AEM Assets | Dynamic Media base setup (named in 88 places, set up nowhere) |
| AEM Sites | Adobe LLM Apps; the Experience Modernization Agent; AEM Guides and AEM Screens as products |
| Adobe Commerce | Payment Services onboarding; Product Recommendations setup |
| Coworker | Coworker Projects; Coworker for teams |
| Microsoft Copilot | The Adobe Marketing Agent (lines to Real-Time CDP and Journey Optimizer) |

**Products with editions and no picker or note:** Real-Time CDP (Prime or Ultimate; B2C, B2B, B2P: only 9 connection services are tagged), Adobe Analytics (Foundation to Ultimate: nothing tagged), AEM Forms (the AEM Sites picker for Cloud Service or 6.5 does not reach the Forms card), Marketo Measure (Tier 1, Tier 2, Ultimate), Real-Time CDP Collaboration (Starter).

Built between Nov 19 and Nov 20, for the record: the Commerce version picker, Commerce Optimizer, Commerce Intelligence, the four back-office systems, the move to Commerce as a Cloud Service, the seven other pickers, the upgrade to AEM 6.5 LTS, Workfront environment promotion, financial setup and Data Connect, and six Brand Concierge services.

## 3. Connections

**What the tool has.** 143 connections between Adobe products and 74 to outside systems. Every one has an Adobe source, and each of its data flows has one too.

**How it was checked.** Three research passes read about 230 pages of Experience League and Adobe's developer and help sites for connections the tool does not draw (data and journeys; content, creative and documents; AI and Commerce). Each finding carries an Adobe sentence, and all 144 sentences were matched on their pages a second time with `found()` after the passes finished. Result: `data/connection_gaps.json`. Proposals only: none is in the tool, and each needs its services, hours and Adam's yes.

**103 documented pairs the tool does not draw:** 16 with real partner work behind them, 39 medium, 48 small. 33 more pairs are documented and already priced another way (a service on a product card or on another connection), and 69 pairs were checked and found not documented.

**The 16 that carry real partner work.**

| Pair | What Adobe documents | Source |
|---|---|---|
| AEM Sites + the client's own CDN | The client keeps its own CDN or firewall in front of AEM as a Cloud Service and points it at Adobe's CDN | [Adobe page](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/content-delivery/cdn) |
| Edge Delivery Services + the client's own CDN | An Edge Delivery site served through the client's CDN, with Adobe's guides for Cloudflare, Akamai, Fastly and CloudFront | [Adobe page](https://www.aem.live/docs/byo-cdn-setup) |
| Real-Time CDP + CRM | Salesforce or Dynamics data into Experience Platform, and audiences back to the CRM. The CRM has a line to Customer Journey Analytics today, not to Real-Time CDP | [Adobe page](https://experienceleague.adobe.com/en/docs/experience-platform/sources/home) |
| Real-Time CDP + Cloud storage | Files from S3, Azure, Google Cloud Storage or SFTP into Experience Platform, and audiences and datasets back out | [Adobe page](https://experienceleague.adobe.com/en/docs/experience-platform/destinations/catalog/cloud-storage/overview) |
| Customer Journey Analytics + Search data | Google Analytics 4 history and live data into Customer Journey Analytics: a migration project | [Adobe page](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/third-party/ga/overview) |
| Marketo Engage + Ad platforms | Lists to Facebook, LinkedIn and Google; leads in from LinkedIn and Facebook lead forms; offline conversions | [Adobe page](https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/demand-generation/ad-network-integrations/understanding-ad-network-integrations) |
| Coworker + Journey Optimizer B2B Edition | Coworker builds account and person journeys and answers questions about live ones | [Adobe page](https://experienceleague.adobe.com/en/docs/journey-optimizer-b2b/user/ai-capabilities/coworker-skills/journey-agent) |
| AEM Forms + CRM | Forms that read from and write to Dynamics 365 or Salesforce through Adobe's ready-made configurations | [Adobe page](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/forms/integrate/use-form-data-model/configure-msdynamics) |
| Acrobat Sign + CRM | Acrobat Sign inside Microsoft Dynamics 365. The Salesforce package is a service on the card today with no line to the CRM box | [Adobe page](https://helpx.adobe.com/sign/web/integrations/microsoft-dynamics/microsoft-dynamics-install.html) |
| Workfront + CRM | Requests, projects and status exchanged with Salesforce through Workfront Fusion | [Adobe page](https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/third-party-app-connectors/salesforce-modules) |
| AEM Sites + Other commerce platform | AEM Sites showing a non-Adobe catalog through the Commerce Integration Framework | [Adobe page](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/content-and-commerce/cif-storefront/integrations/third-party) |
| Frame.io + Cloud storage | Frame.io storing media in the client's own S3 bucket | [Adobe page](https://help.frame.io/en/articles/9179936-storage-connect-for-frame-io) |
| Brand Concierge + the client's mobile app (new box) | Brand Concierge inside iOS and Android apps through Adobe's mobile SDK | [Adobe page](https://developer.adobe.com/client-sdks/edge/adobe-brand-concierge/) |
| Marketo Engage + Webinar and event platforms (new box) | Registrations out to Zoom, ON24, Webex or GoToWebinar and attendance back | [Adobe page](https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/demand-generation/events/understanding-events/event-partners) |
| Adobe Commerce + Payment gateway (new box) | Adobe's checkout starter kit for an outside payment gateway | [Adobe page](https://developer.adobe.com/commerce/extensibility/starter-kit/checkout/payment-use-cases) |
| Workfront + Jira (new box) | Tasks and issues synced with Jira through Fusion | [Adobe page](https://experienceleague.adobe.com/en/docs/workfront-fusion/using/references/apps-and-their-modules/third-party-app-connectors/jira-modules-new) |

**Around the three lead products.**

- **Brand Visibility + Coworker: Adobe now documents it, as a manual hand-off.** Three Brand Visibility opportunity pages (YouTube, Reddit, cited web sources), each last updated Nov 20, say a person downloads the Brand Visibility brief and attaches it in Coworker Chat to draft the deliverable. There is still no Coworker skill, plugin or connector for Brand Visibility. This overturns the Nov 18 finding that no Adobe page pairs the two. It would be a dashed line (a partner workflow), not a native one. [Adobe page](https://experienceleague.adobe.com/en/docs/brand-visibility/using/dashboards/opportunities/youtube-sentiment-analysis)
- **Brand Visibility:** nothing documented with Sites Optimizer, AEM Assets, Target, Journey Optimizer, Real-Time CDP, GenStudio, Marketo Engage, Workfront, Content Analytics or Commerce Optimizer. The tool is complete here.
- **Coworker:** documented and not drawn: Journey Optimizer B2B Edition, Experimentation Accelerator and Marketing Campaign Analytics. Nothing for Commerce, Sites Optimizer, Express, Frame.io, Creative Cloud, Firefly, Acrobat or Marketo Measure.
- **Brand Concierge:** the mobile app is the only gap. No contact-centre platform is documented; live chat runs through Marketo Qualifier, which the tool has.

**Medium, between boxes the tool already has (24):** AEM Assets, AEM Forms and Edge Delivery Services each with another CMS; Acrobat Sign + ERP (NetSuite); Adobe Analytics + Ad platforms and + CRM; Commerce Optimizer + ERP; Coworker + Experimentation Accelerator and + Marketing Campaign Analytics; Creative Cloud + GenStudio for Performance Marketing (the Photoshop plugin); GenStudio for Performance Marketing + AEM Sites and + CRM; Journey Optimizer + Cloud storage (direct mail files); Journey Optimizer B2B Edition + CRM; Marketing Campaign Analytics + Adobe Analytics; Marketo Optimizer + Customer Journey Analytics; Microsoft Copilot + Marketo Engage; Other commerce platform + Real-Time CDP; Real-Time CDP Collaboration + Ad platforms (Amazon Marketing Cloud); Sites Optimizer + AEM Forms.

**Outside systems Adobe documents that have no box (the medium ones):** Microsoft Power Automate (AEM Forms, Acrobat Sign); Microsoft 365 (Acrobat); an identity provider and a log and monitoring platform (AEM Sites); ServiceNow and an HR system (Acrobat Sign); tax provider and shipping carrier (Adobe Commerce); SMS providers, the client's mobile app (Journey Optimizer); consent platforms and other marketing platforms (Real-Time CDP); document storage such as Box, Dropbox and Google Drive (Workfront). Small ones include Slack and Google Gemini.

**Decided earlier, so not counted as gaps:** ChatGPT, Claude and Microsoft Copilot with Adobe Analytics (Adam, Nov 18: Customer Journey Analytics only); Adobe Analytics + Brand Visibility (Nov 10); Marketing Campaign Analytics + Content Analytics. AEM Sites + Adobe Campaign waits on Adobe Campaign itself.

**Worth knowing before any of these is built.**

- Workfront's packaged apps for Salesforce, Jira, Outlook and Google Workspace are withdrawn: Adobe's pages say each "is no longer available" and point to Fusion. Any new Workfront line to those systems is a Fusion line.
- Adobe's pages disagree on the AI assistants. The general connector page shows Journey Optimizer in ChatGPT and says its Copilot Studio steps apply to any Adobe connector; the Journey Optimizer page lists Claude only, and the Target page lists Claude and ChatGPT only. The tool follows the product pages.
- Two existing lines price one direction only: Data warehouse + Real-Time CDP prices data coming in (Adobe also documents Snowflake and Databricks as destinations), and Cloud storage + Customer Journey Analytics prices files coming in (Adobe also documents exports).
- One existing connection quote can no longer be proven: AEM Assets + Firefly Creative Production cites a Firefly help page that Adobe folded into its Creative Production overview, which no longer mentions AEM. The connection needs a new source page.

Not reached: Adobe's AI registry listing (a script-driven page), the remaining Acrobat Sign connectors, Express social and ad add-ons, and the individual Fusion connector pages beyond Salesforce and Jira.

## 4. Services

- Every Adobe product has services of its own, from 1 (Sites Optimizer, with 6 more on its connections) to 18 (AEM Forms).
- 169 connections carry services. 48 are drawn with none: 40 are AI assistant lines (Adam, Nov 18: lines that sell no hours are fine), and 8 are Search data + Sites Optimizer, CRM + Marketo Engage (the CRM sync is on the Marketo card), Journey Optimizer + Brand Concierge, Creative Cloud + Brand Intelligence, Coworker + Brand Intelligence, Adobe Analytics + Cloud storage, GenStudio for Performance Marketing + Ad platforms, and Commerce Optimizer + Sites Optimizer.
- No service is orphaned, defined twice or missing its link.

**Not the full list yet.** Section 3 of `EXPERIENCE_LEAGUE_SWEEP.md` (Nov 19) lists about 120 one-line service gaps on products already in the tool, each with its Adobe page. A re-check of 65 of them against today's catalog found about 10 built (listed at the end of section 2) and the rest still open. The larger ones by the work Adobe's pages describe:

- **Adobe Commerce:** go-live on Cloud (Fastly, DNS, TLS), security scan and load testing, Payment Services, Product Recommendations, promotions.
- **AEM Sites:** code refactoring for the move to Cloud Service, the client's own CDN in front of AEM, advanced networking, log forwarding, headless delivery.
- **Real-Time CDP:** event forwarding, consent, Privacy Service, sandbox moves, Customer AI, computed attributes, look-alike audiences.
- **Adobe Analytics:** mobile app tracking, server-side collection, ad platform data.
- **Journey Optimizer:** Decisioning on its own card, transactional campaigns from the client's order system, app work for push and in-app, migration from another platform.
- **Target:** the move from at.js to Web SDK, server-side Target, Auto-Target.
- **Marketo Engage and Workfront:** the add-ons in section 2, workspaces, custom objects, resource management, document integrations.
- **GenStudio for Performance Marketing:** its five App Builder extension points (asset source, template, translation, compliance, content fragment) have no service.

## 5. The two cross-sell plays

**Adam's rule:** on Brand Visibility + Customer Journey Analytics and Brand Visibility + Adobe Commerce the client already owns the second product, so the play needs the Brand Visibility services and the connection services, not the work to implement Customer Journey Analytics or Adobe Commerce.

**How it was checked.** Each play was opened in the built site on a fresh browser at Typical size and $150 an hour, and every service was read as ticked or not (`tools/play_defaults.js`, result in `data/play_defaults.json`).

**What held.** Customer Journey Analytics started with 0 of its 8 services ticked, Adobe Commerce with 0 of its 16. Brand Visibility started with its 4, and the Brand Visibility connection, CDN and search data services were ticked.

**What did not fit the rule.** The outside systems of the owned product started with their services ticked:

| Play | Before (one-time) | The owned product's outside-system work that was ticked | Now (one-time) |
|---|---|---|---|
| Brand Visibility + Customer Journey Analytics | 464 hours, $69,600 | 272 hours, $40,800: Warehouse tables into CJA (56), Cloud storage files into CJA (40), CRM data into CJA (40), Ad platform sources into CJA (32), Ad spend joined to web conversions (32), BI extension setup (24), Executive dashboards in the BI tool (48) | **192 hours, $28,800** |
| Brand Visibility + Adobe Commerce | 776 hours, $116,400 | 520 hours, $78,000: Commerce to CRM integration (120), Commerce to ERP integration (120), Product data from the PIM into Commerce (80), Commerce to order management integration (120), Stock and shipment sync with the warehouse system (80) | **256 hours, $38,400** |

Monthly work is unchanged at 104 hours, $15,600. Over 12 months the plays open at $216,000 (was $256,800) and $225,600 (was $303,600).

**Changed today, on Adam's "go".**

- On these two plays only, the outside systems stay on the canvas from the start and their services to the owned product start unticked, one click to add. Every other play, and Create your own play, is as it was.
- A quote saved before today reopens with the services and total it was saved with, on Build, through Services and back. The change has its own saved flag (`ownedOutsideDefaults`); `combinedDefaultsVersion` is still 1.
- A client question that names one of those systems still ticks its service: the chips "closes deals in a CRM", "revenue data sits in Snowflake" and "offline results arrive as files" on "My client can't tie AI traffic to revenue".
- The rule's data is `owned_outside` in `canvas/catalog_map.json`; the rule is `startingService` in `canvas/scope-choices.js`.
- Proof: `node test_commerce_versions.js`, section 9 (eight new checks), and the totals in `canvas/test_canvas.js`.

## 6. Citation links

**How it was checked.** Every distinct address in the catalog, the training data, the problem finder and the RFI knowledge base (979) was fetched live on Nov 21 with a plain request (`tools/fetch_all.py`, result in `data/link_check.json`). Every stored quote was then matched against its page with the project's own matcher, `found()` (`tools/verify_quotes.py`; the result before today's fixes is `data/quote_check_before.json`, after is `data/quote_check.json`).

**Links.**

- 632 of 632 services have an Adobe link, and 217 of 217 connections have a source.
- 948 of 979 addresses answer. **None is dead.**
- 16 certification pages send a visitor who is not signed in to Adobe's sign-in page. They open for a signed-in partner.
- 15 could not be tested: 7 on business.adobe.com (Adam's pastes only), 4 on www.adobe.com (not reachable from this session), 3 on partners.adobe.com, 1 on YouTube.
- 14 addresses redirect. 13 land on the same page at a new address. One lands on a general page because its own page is gone: the Commerce cloud regions page in the RFI knowledge base (`commerce-operations/implementation-playbook/infrastructure/cloud/regions`). Not changed today, since a link is something a partner sees.

**Quotes behind the services.**

| | Before | After today |
|---|---|---|
| On the page word for word | 543 | **630** |
| Not on the page | 28 | 0 |
| No quote stored | 59 | 0 |
| On business.adobe.com, checked against Adam's pastes only | 2 | 2 |

- The 28: fourteen held a sentence from the service's earlier page (the link was corrected on Nov 7 and the sentence was not), seven differed from Adobe's sentence only in capitals or punctuation, and seven sat on pages Adobe has since reworded. Two of them, "Connect Sites Optimizer to AEM author" and "Measure Edge Delivery page and block interactions", held a summary, not Adobe's words.
- The 59 were the original statement-of-work services and the first outside-system services, among them all 11 Brand Visibility services, all 11 Coworker services and the 5 Edge Delivery services: the ones the lead plays open with.
- How each new sentence was chosen: one reader picked it from the page saved that day, a second reader checked it independently, and `found()` proved it a third time before it was written (`data/quote_picks.json`, `tools/apply_quotes.py`). 59 of the 99 state the capability or step itself; 38 back part of the service; each is marked.
- The quotes are never shown on screen. The 46 for the statement-of-work services live in the new `canvas/live_evidence.json`, because `index.html`, where those services are defined, holds no quotes.

**Two services whose Adobe page now says something different. For Adam: the wording a partner reads may need a change.**

- **Brand Concierge block on Edge Delivery** (Brand Concierge + Edge Delivery Services). Adobe's deployment page now describes an installed script and page rules that decide where the concierge appears, not a custom block.
- **A4T to CJA reporting transition** (Target + Customer Journey Analytics). Adobe's page now says "This integration is not the same as Adobe Analytics for Target (A4T). The implementation and supported activity types are different."

**Quotes behind the connections:** 1,122 of the 1,123 that can be checked are on their page (1,110 before; 12 replaced today). The one left is AEM Assets + Firefly Creative Production (section 3). 103 are on paste-only pages.

Not checked: the quotes inside the RFI knowledge base (its links were).

## 7. Training links

**How it was checked.** The training data (`canvas/training.json`) was read for all 36 products; every public link was fetched; the certifications were compared with Adobe's public list of the certifications it offers (https://certification.adobe.com/certifications/learn-more, read Nov 21). Result in `data/training_check.json`, as found before today's changes.

| Row in the box | Coverage |
|---|---|
| Partner hub page | 33 of 36 before; **35 today**: Commerce Optimizer and Commerce Intelligence, added on Nov 20 after the training round, now link the Adobe Commerce page Adam confirmed. Brand Intelligence has none (Adobe has no page) |
| Decks, sales plays and webinars (hub search) | 31 of 36. None for Customer Journey Analytics, Content Analytics, Brand Intelligence, Commerce Optimizer and Commerce Intelligence |
| Partner training | 36 of 36: 18 say which product to tick, 18 say what to search for. The catalog's "Adobe Experience Platform" filter is not used; it would fit Real-Time CDP and Real-Time CDP Collaboration |
| Certification | **Complete.** Adobe offers 47; the 38 for products in the tool are all listed, and nothing listed is off Adobe's list. The 9 not listed are Advertising (2), Campaign Classic (2), Captivate, ColdFusion and three Japanese-language versions |
| Adobe courses | 20 of 36. The portal has five filters the tool does not use; two would add a row: Adobe Experience Platform (for Real-Time CDP, Journey Optimizer and Customer Journey Analytics) and Adobe GenStudio |
| Public training | 143 links, 4 a product on most. 141 are live; 2 cannot be tested (a YouTube video and a business.adobe.com page, both on Brand Intelligence) |

**Found and repaired:** `python3 canvas/data_training.py`, the step that writes the training data from its record, had stopped working when the two Commerce products were added on Nov 19. It runs again and writes the same data as before, plus today's additions.

The Partner Experience Hub pages need a partner sign-in, so they were not opened. Adam confirmed each one while signed in on Nov 16. Open with Adam: his paste of the partner training catalog's full filter list (his screenshot stops at Learning Manager).

## 8. Making "Get your team ready" jump out

Built on Adam's "go" to the pictures in `mockups/nov21_training/`, then renamed **"Get trained and certified"** the same day (Adam: "Get your team ready is kind of vague. Nobody knows what that means"). The pictures drawn before the build carry the old name; the `built_` ones carry the new one.

1. **A "Get trained and certified" menu in the top bar of every page.** It holds the two links Adam asked for, Adobe courses on the Certification Portal and Partner on-demand trainings on the Partner Experience Hub. On a play it adds one row for each Adobe product on the canvas, which opens that product's card with its box open. The Scope, Services, Statement of work and RFI Builder page has the same button with the two links.
2. **On each product card:** a red link under the product's name that opens the box and brings it into view, and the box itself filled and outlined in red.
3. **Levels:** beside each certification, beside each training link where Adobe states one, in the box's heading, and the portal's three skill levels under Adobe courses.

Two things differ from the pictures:

- **The button shortens so the top bar keeps its height.** Its full name shows from 1280 pixels wide; below that it reads "Training", and below 1180 pixels (900 on the statement-of-work page) it is the graduation cap alone, with its full name kept for screen readers. On a few phone and tablet widths the bar is 5 to 9 pixels taller than before; at a handful of single widths (near 620 and 700 pixels) it wraps to a second row.
- **"Saved in this browser as you go" now hides below 1100 pixels wide** (it was 900), to make room.

Checks: `node test_training.js`, 33 checks (23 before).

---

## Still open, in order

1. **Adam's wording call on the two services in section 6** (Brand Concierge block on Edge Delivery; A4T to CJA reporting transition).
2. **Which of the 16 connections in section 3 to build**, and whether Brand Visibility + Coworker goes in as a partner workflow line.
3. **A line ready for "where is Adobe Campaign?"**, or the paste that unblocks it.
4. **Intermediate and advanced training picks** for the 14 products whose links stop at Beginner.
5. **The Nov 19 lists** of add-ons and service gaps (sections 2 and 4).
6. **A new Proto package.** `site/` no longer matches the version 9 zip.

## How to run the checks again

```
python3 audit_2026-11-21/tools/fetch_all.py <a folder outside the repository>
python3 audit_2026-11-21/tools/verify_quotes.py <the same folder>
node audit_2026-11-21/tools/play_defaults.js cja commerce
```

The session needs network access to experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com, www.aem.live, news.adobe.com, help.frame.io and certification.adobe.com. The personal cloud environment `sow-generator`, made on Nov 21, allows them.
