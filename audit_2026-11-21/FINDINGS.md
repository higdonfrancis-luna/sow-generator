# Audit before the hand-over to Adobe teammates: November 21, 2026

Adam asked eight questions before he submits the tool. This is the record: what was checked, how, what it found, and what waits for his call. Nothing in the tool was changed. The build checked is the one on Adobe Proto (version 9, branch `claude/sow-generator-handoff-517tq8`); the site rebuilt from source byte for byte before the checks.

The catalog today: **36 Adobe products, 18 outside systems, 217 connections, 632 services** (308 on product cards, 324 on connections).

## The short answers

| # | Question | Answer |
|---|---|---|
| 1 | Missing products, and levels | No product a partner sells today is missing by accident. Six names on Adobe's partner and certification portals are not in the tool, all known and left out or queued. Levels are not shown anywhere, and the training links lean beginner. |
| 2 | Smaller packages and add-ons | Handled three ways: 9 pickers on 8 products, 85 services tagged with the package they need, 2 notes. About 20 add-ons from the Nov 19 list are still not in. |
| 3 | Missing connections | See section 3. |
| 4 | Full list of services | Every product and 169 of 217 connections have services. The Nov 19 list of about 120 service gaps is mostly still open. |
| 5 | The two cross-sell plays | The owned product's own services start unticked, as intended. Its outside-system services start ticked: 272 hours on the Customer Journey Analytics play, 520 hours on the Adobe Commerce play. Needs Adam's call. |
| 6 | Citation links | Every service and connection has an Adobe link, and no link is dead. 543 of 573 stored quotes still match the live page word for word; 28 need a look; 59 older services have a link and no stored quote. |
| 7 | Training links | All 36 products have the box. Every certification Adobe offers for these products is listed. 141 of 143 public training links are live. Three products have no Partner Experience Hub page link. |
| 8 | Make "Get your team ready" jump out | Pictures drawn, waiting for Adam's yes: `mockups/nov21_training/`. |

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

**Levels.** Adobe uses three ladders, and the tool shows none of them as a label:

| Where | Adobe's levels | In the tool today |
|---|---|---|
| Courses on the Certification Portal | Foundations, Professional, Expert | One link per product to its courses; no level named |
| Certifications | Professional, Expert, Master (and Qualified Credentials) | Listed in level order; the level is only inside the long name |
| Experience League training | Beginner, Intermediate, Experienced | Not shown |

- Full ladders (Professional, Expert and Master): AEM Sites, Adobe Analytics, Adobe Commerce, Marketo Engage. Two rungs: Customer Journey Analytics, Real-Time CDP, Journey Optimizer, Target, Workfront. One: AEM Assets, Journey Optimizer B2B Edition, Acrobat, Acrobat Sign.
- Adobe states a level on 70 of the 143 public training links. 60 of them cover Beginner, 27 Intermediate, 8 Experienced. For 14 products every link with a stated level is Beginner only, among them Real-Time CDP, Journey Optimizer, Customer Journey Analytics, Adobe Analytics, Marketo Engage and Workfront. A delivery team needs more than the beginner path, so these are worth a second pick each.
- The mockup in section 8 shows the level beside each certification and training link.

Not read: the course cards on the Certification Portal (which courses exist at which level for each product). They load separately from the public page. Adam's paste of that page with "Show 60" would settle it.

## 2. Smaller packages, add-ons and components

**How the tool handles them today.**

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

Built since Nov 19, for the record: the Commerce version picker, Commerce Optimizer, Commerce Intelligence, the four back-office systems, the move to Commerce as a Cloud Service, the seven other pickers, the upgrade to AEM 6.5 LTS, Workfront environment promotion, financial setup and Data Connect, and six Brand Concierge services.

## 3. Connections

**What the tool has.** 143 connections between Adobe products and 74 to outside systems. Every one has an Adobe source, and each of its data flows has one too.

**The search for missing connections is not finished.** Three research passes were reading Experience League for documented connections the tool does not draw (data and journeys; content, creative and documents; AI and Commerce). They stopped on a usage limit after about 360 pages, before writing their results. This section is filled in when they resume.

Known from earlier notes, and already decided: Adobe Analytics + Brand Visibility stays out (Adam, Nov 10); Marketing Campaign Analytics + Content Analytics stays out; no Adobe page pairs Coworker with Brand Visibility (checked Nov 18, being re-checked).

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

## 5. The two cross-sell plays

**Adam's rule:** on Brand Visibility + Customer Journey Analytics and Brand Visibility + Adobe Commerce the client already owns the second product, so the play needs the Brand Visibility services and the connection services, not the work to implement Customer Journey Analytics or Adobe Commerce.

**How it was checked.** Each play was opened in the built site on a fresh browser at Typical size and $150 an hour, and every service was read as ticked or not (`tools/play_defaults.js`, result in `data/play_defaults.json`).

**What holds.** Customer Journey Analytics starts with 0 of its 8 services ticked. Adobe Commerce starts with 0 of its 16. Brand Visibility starts with its 4, and the Brand Visibility connection, CDN and search data services are ticked.

**What does not fit the rule.** The outside systems that belong to the owned product start on the canvas with their services ticked, since the Nov 18 "outside systems on from the start" rule and the Nov 20 defaults:

| Play | Starts at (one-time) | Brand Visibility work | The owned product's outside-system work, ticked |
|---|---|---|---|
| Brand Visibility + Customer Journey Analytics | 464 hours, $69,600 | 192 hours, $28,800 | **272 hours, $40,800**: Warehouse tables into CJA (56), Cloud storage files into CJA (40), CRM data into CJA (40), Ad platform sources into CJA (32), Ad spend joined to web conversions (32), BI extension setup (24), Executive dashboards in the BI tool (48) |
| Brand Visibility + Adobe Commerce | 776 hours, $116,400 | 256 hours, $38,400 | **520 hours, $78,000**: Commerce to CRM integration (120), Commerce to ERP integration (120), Product data from the PIM into Commerce (80), Commerce to order management integration (120), Stock and shipment sync with the warehouse system (80) |

A client who already runs Adobe Commerce already has its ERP and order system connected, and a client who already owns Customer Journey Analytics already has its data sources in. So two thirds of the Commerce play's starting estimate, and more than half of the Customer Journey Analytics play's, is work the rule says the play does not need.

**Proposed, waiting for Adam:** on these two plays only, keep those outside systems on the canvas (the art of the possible) and start their services unticked, one click to add. The plays would open at $28,800 and $38,400 one-time, plus the same $15,600 a month. Saved quotes keep their totals: this needs a saved-defaults flag of its own, and `combinedDefaultsVersion` stays as it is.

## 6. Citation links

**How it was checked.** Every distinct address in the catalog, the training data, the problem finder and the RFI knowledge base (979) was fetched live on Nov 21 with a plain request (`tools/fetch_all.py`, result in `data/link_check.json`). Every stored quote was then matched against its page with the project's own matcher, `found()` (`tools/verify_quotes.py`, result in `data/quote_check.json`).

**Links.**

- 632 of 632 services have an Adobe link, and 217 of 217 connections have a source.
- 948 of 979 addresses answer. **None is dead.**
- 16 certification pages send a visitor who is not signed in to Adobe's sign-in page. They open for a signed-in partner.
- 15 could not be tested: 7 on business.adobe.com (Adam's pastes only), 4 on www.adobe.com (not reachable from this session), 3 on partners.adobe.com, 1 on YouTube.
- 14 addresses redirect. 13 land on the same page at a new address. One lands on a general page because its own page is gone: the Commerce cloud regions page in the RFI knowledge base (`commerce-operations/implementation-playbook/infrastructure/cloud/regions`). Two services cite a Firefly page that Adobe folded into its Creative Production overview (below).

**Quotes behind the services** (573 services hold one):

- **543 match the live page word for word.**
- **7 are the same sentence with a small difference** (capital letters, a full stop where Adobe's sentence runs on, an invisible character): Checkout, payment, tax and delivery settings; B2B buyer and purchasing setup; Access levels and layout templates; Marketo source connector into Platform; Marketo data in CJA reporting; Commerce to CRM integration; Approved assets from review to AEM Assets.
- **21 are not on the page today.** Adobe reworded or moved the page, or the stored sentence was a summary. The link still opens on the right topic; the sentence needs replacing with one that is on the page:
  - Customer Journey Analytics: Analysis Workspace projects
  - Marketo Engage: CRM sync and field mapping
  - Firefly Creative Production: Creative Production access, roles and API credentials; Bulk presets
  - Real-Time CDP + Customer Journey Analytics: Journey audiences from CJA for activation
  - Target + Customer Journey Analytics: A4T to CJA reporting transition (Adobe's page now says "This integration is not the same as Adobe Analytics for Target (A4T)", so the service's wording deserves a read too)
  - AEM Sites + Target: Content Fragment offers for headless apps
  - AEM Sites + Sites Optimizer: Connect Sites Optimizer to AEM author
  - Brand Concierge + Edge Delivery Services: Brand Concierge block on Edge Delivery (Adobe's deployment page now describes an installed script and page rules, not a custom block, so the service's scope deserves a read too); Site content as concierge knowledge source
  - Adobe Commerce + Customer Journey Analytics: Commerce data in CJA reports
  - Target + Edge Delivery Services: Target personalization on Edge Delivery
  - Coworker + Real-Time CDP, + Journey Optimizer, + Target: the three Partner-written Coworker Skills services
  - Edge Delivery Services + Customer Journey Analytics: Measure Edge Delivery page and block interactions
  - Marketo Engage + Real-Time CDP: Real-Time CDP audiences to Marketo lists
  - Marketo Engage + Target: Share Marketo lists with Target
  - Marketo Engage + Brand Concierge: Brand Concierge activity in Marketo programs
  - Marketo Qualifier + Marketo Engage: Marketing Highlights setup; Automatic enrollment from live Marketo activity
- **2 sit on business.adobe.com** and can only be checked against Adam's pastes.
- **59 older services have a link and no stored quote.** These are the original statement-of-work services and the first outside-system services, among them all 11 Brand Visibility services, all 11 Coworker services and the 5 Edge Delivery services. Their links were reviewed in the Nov 6 citation audit. Because these are the services the four lead plays open with, they are the first ones a reviewer will click.

**Quotes behind the connections:** 1,110 of the 1,123 that can be checked match word for word. The 13 that do not are on Adobe Commerce + CRM (3, capital letters), AEM Assets + Firefly Creative Production (2, the folded Firefly page), Marketo Qualifier + Marketo Engage (2), Microsoft Copilot + Coworker (2), and one each on Coworker's lines to Customer Journey Analytics, Journey Optimizer, Marketo Engage and Content Analytics. 103 are on paste-only pages.

Not checked: the quotes inside the RFI knowledge base (its links were).

## 7. Training links

**How it was checked.** The training data (`canvas/training.json`) was read for all 36 products; every public link was fetched; the certifications were compared with Adobe's public list of the certifications it offers (https://certification.adobe.com/certifications/learn-more, read Nov 21). Result in `data/training_check.json`. The project's own suite passes: `node test_training.js`, 23 checks.

| Row in the box | Coverage |
|---|---|
| Partner hub page | 33 of 36. None for Brand Intelligence (Adobe has no page), Commerce Optimizer and Commerce Intelligence (added on Nov 20, after the training round; the Adobe Commerce page Adam confirmed would fit both) |
| Decks, sales plays and webinars (hub search) | 31 of 36. None for Customer Journey Analytics, Content Analytics and the three above |
| Partner training | 36 of 36: 18 say which product to tick, 18 say what to search for. The catalog's "Adobe Experience Platform" filter is not used; it would fit Real-Time CDP and Real-Time CDP Collaboration |
| Certification | **Complete.** Adobe offers 47; the 38 for products in the tool are all listed, and nothing listed is off Adobe's list. The 9 not listed are Advertising (2), Campaign Classic (2), Captivate, ColdFusion and three Japanese-language versions |
| Adobe courses | 20 of 36. The portal has five filters the tool does not use; two would add a row: Adobe Experience Platform (for Real-Time CDP, Journey Optimizer and Customer Journey Analytics) and Adobe GenStudio |
| Public training | 143 links, 4 a product on most. 141 are live; 2 cannot be tested (a YouTube video and a business.adobe.com page, both on Brand Intelligence) |

The Partner Experience Hub pages need a partner sign-in, so they were not opened. Adam confirmed each one while signed in on Nov 16. Open with Adam: his paste of the partner training catalog's full filter list (his screenshot stops at Learning Manager).

## 8. Making "Get your team ready" jump out

Pictures only, drawn on the real built page by `mockups/nov21_training/training_mock.js`. Nothing is built.

1. **A "Get your team ready" menu in the top bar of every page** (`1_top_bar_menu_open.png`, first page `4_first_page_menu_open.png`, phone `5_phone_menu_open.png`). It holds the two links Adam asked for, Adobe courses on the Certification Portal and Partner on-demand trainings on the Partner Experience Hub, and on a play one row for each product on the canvas, which opens that product's box.
2. **On each product card** (`2b_card_today_vs_proposed.png`): a red link under the product's name that jumps to the box and opens it, and the box itself filled and outlined in red.
3. **Levels** (`3_box_open_with_levels.png`): the level beside each certification and each training link where Adobe states one, and the portal's skill levels under Adobe courses.

To build after Adam's yes: the menu on both pages (the canvas and the statement-of-work steps share the top bar's look, not its code), the card link and box in `canvas/template.html`, the levels in `canvas/data_training.py` from the record, and checks in `test_training.js`.

---

## What is worth doing before the hand-over, in order

1. **Adam's call on section 5.** It changes the first number a teammate sees on two of the four lead plays.
2. **The 21 quotes that are not on their page, and the two services whose Adobe page changed its meaning** (Brand Concierge block on Edge Delivery; A4T to CJA reporting transition).
3. **Quotes for the 59 older services,** starting with Brand Visibility and Coworker.
4. **"Get your team ready"** once the pictures have a yes, with the Adobe Commerce hub page on Commerce Optimizer and Commerce Intelligence.
5. **A line ready for "where is Adobe Campaign?"**, or the paste that unblocks it.

## How to run the checks again

```
python3 audit_2026-11-21/tools/fetch_all.py <a folder outside the repository>
python3 audit_2026-11-21/tools/verify_quotes.py <the same folder>
node audit_2026-11-21/tools/play_defaults.js cja commerce
```

The session needs network access to experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com, www.aem.live, news.adobe.com, help.frame.io and certification.adobe.com. The personal cloud environment `sow-generator`, made on Nov 21, allows them.
