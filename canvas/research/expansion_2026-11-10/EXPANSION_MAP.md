# Catalog expansion map (Nov 10 2026)

Research and pictures only. Nothing in the tool, the catalog or the RFI Builder changed. The map is for Adam, not for partners:
it is not part of the site that goes to Proto. Adam saw it on Nov 10 ("looks great") and made two calls, recorded below.

## The ask

Adam, Nov 10, with screenshots of Adobe's GenStudio page and the business.adobe.com product menu: "We're actually missing a
lot now that I think about [it] ... What are your thoughts on taking this to the next level? ... we're talking a lot a lot more
connections." Then: keep the six plays on the front page (the CRO's ask was to sell more Brand Visibility) and put the other
products in the Create your own play picker. Then: "yes, make the map and the picker mockup".

## What was made

| File | What it is |
|---|---|
| `sow/mockups/nov10_expansion/expansion_map.png` (and `.html`) | The one-page map: every product, where it stands, its tie to Brand Visibility, what Adobe documents it connecting to, the plays it reaches, the proposed wave |
| `sow/mockups/nov10_expansion/picker_first_product.png` | Mockup: the Add product menu on an empty canvas, grouped under Adobe's menu headings, with a Find a product box |
| `sow/mockups/nov10_expansion/picker_on_canvas.png` | Mockup: the same menu with Brand Visibility and AEM Sites on the canvas (connected products first, the rest under the headings) |
| `sow/mockups/nov10_expansion/picker_find.png` | Mockup: typing in the Find a product box |
| `aem_documents.json`, `genstudio_creative.json`, `platform_data_campaign.json`, `brand_visibility_side.json` | The research, one file per family: each claim with its page and a word-for-word quote |
| `plan.json` | The proposal: headings, waves, the connections left off the map and why |
| `expansion_map.json` | One row per product, as the map shows it |
| `BRIEF.md` | The rules the research followed |

Rebuild, from the repo root:

    python3 sow/canvas/research/expansion_2026-11-10/verify_quotes.py     # every quote against its live page
    python3 sow/canvas/research/expansion_2026-11-10/build_map.py         # the map page and the picker's data
    node sow/canvas/research/expansion_2026-11-10/render_map.js           # the map picture
    node sow/mockups/nov10_expansion/picker_mock.js                       # the three picker pictures (needs sow/site/ built)

## How it was checked

- Four helpers read Adobe's public documentation, one family each (Experience League, helpx, developer.adobe.com, aem.live).
- Every claim carries a page and a quote. `verify_quotes.py` downloads each page again and looks for the quote word for word:
  **413 quotes found, 0 not found** (Nov 10).
- A connection is on the map only when an Adobe page describes it. Tutorial walkthroughs, bare mentions and anything Adobe
  marks as coming soon are left out. Six more pairs were left out by hand, each with its reason in `plan.json` (`drop`).
- This is a map-level pass. Each wave's own research reads the pages again and writes the services, with sources, before
  anything is built.

## Adam's calls (Nov 10)

1. **Brand Visibility connects with CJA, not Adobe Analytics.** "i would say that brand visibility can connect with cja, i
   wouldn't pitch it with aa. let's say not available." Adobe documents the integration (finding 1 below), but the tool will
   show no Brand Visibility line for Adobe Analytics. `plan.json` drops the pair and the map says "Not available".
2. **Semrush is left out.** "semrush concerns me. i think we are really trying to move away from that and pitch brand
   visibility." Claude agreed: Semrush's only documented role is the data inside Brand Visibility, which the license already
   includes, and its own documentation is not on Adobe's sites. It gets no box in the picker.
3. **The Brand Visibility trial is over.** The trial-size flag below is closed. The tool's remaining trial wording is listed for
   his yes in `sow/bv_copy_review_2026-11-10/PROPOSAL.md`, with the Adobe Analytics wording.

## The numbers

- Adobe products in the picker: 28 today (14 before wave 1 was built as steps 61 and 62; 21 before wave 2 was built as step 64), 36 with the proposal (8 still to add). Four more are "not yet" and one is left out.
- Connections Adobe documents between them: 113 today (59 before wave 1, 82 before wave 2), 166 with the proposal.
- Brand Visibility's connections: 5, unchanged (CJA, Adobe Commerce, AEM Sites, Edge Delivery Services, Brand Concierge).

## Headline findings

1. **Adobe Analytics has a documented integration with Brand Visibility.** Brand Visibility connects to one report suite and
   shows what AI-referred visits are worth, in the paid offering. Adobe Analytics also connects to 10 other products already in the
   tool, and Coworker has worked in it since Nov 2 2026. Adam's call: not pitched (see above).
   Source: https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/adobe-analytics-integration
2. **Semrush is inside Brand Visibility.** Semrush Enterprise AIO supplies the data behind Brand Visibility's dashboards, and
   Adobe's product description says the Brand Visibility license includes it. Semrush's own documentation is on semrush.com,
   which this session's network settings do not allow, so nothing beyond Adobe's pages was read.
3. **AEM Forms** (the product in the Washington State RFP) connects to AEM Sites, Edge Delivery Services, Real-Time CDP,
   Marketo Engage, Workfront, Coworker, Acrobat Sign and Adobe Analytics. No tie to Brand Visibility is documented.
4. **Brand Intelligence is not about AI search.** It checks creative work against brand rules, sits in the Firefly help, and
   connects to Workfront and Frame.io. No tie to Brand Visibility.
5. **Two names in Adobe's menu have no public documentation yet:** Firefly Foundry and GenStudio for Commerce Media Networks.
6. **No other new product has a documented tie to Brand Visibility.** The helpers searched each product's documentation for
   Brand Visibility and LLM Optimizer, and the Brand Visibility guide for each product.
7. **Paid placement in AI answers is new and sits beside Brand Visibility.** Adobe Advertising's DSP runs ChatGPT ads (Oct 29
   2026) and GenStudio for Performance Marketing creates and activates them. Adobe does not connect either to Brand Visibility.

## The proposal

**Headings.** Adobe's own menu: AI & agents, Content & workflows, Creativity & design, Data & analytics, Campaign management,
Document productivity. Products Adobe's menu does not list (Customer Journey Analytics, Target, Edge Delivery Services and
others) are placed under the nearest heading; that placement is Claude's and is Adam's to change.

**Waves** (after Adam's calls).

| Wave | Products | Why |
|---|---|---|
| 1, built Nov 10 as steps 61 and 62 (`wave1/AS_BUILT.md`, `wave1/AS_BUILT_STEP62.md`) | AEM Forms, GenStudio for Performance Marketing, Content Analytics, Marketing Campaign Analytics, Real-Time CDP Collaboration, Journey Optimizer B2B Edition, Experimentation Accelerator | The Washington State RFP's product, and the six products researched on Oct 30 with services and sources (a recheck, then build) |
| 2 | Adobe Express, Firefly Creative Production, Frame.io, Creative Cloud (one box), Workfront Planning, Firefly Custom Models, Brand Intelligence | The GenStudio story |
| 3 | Adobe Analytics, Adobe Campaign, Adobe Advertising, Audience Manager, AEM Guides, Acrobat and Acrobat Services, Marketo Measure, Acrobat Sign | The rest of Experience Cloud, plus Acrobat |
| Not yet | Adobe Learning Manager, AEM Screens, GenStudio for Commerce Media Networks, Firefly Foundry | No public documentation yet, or a product Adobe is narrowing |
| Left out | Semrush | Adam's call |

The first version of the map (commit bbc153e) had four waves with Adobe Analytics and Semrush first, for their documented ties
to Brand Visibility. Adam's calls put Adobe Analytics in wave 3 with no Brand Visibility line and took Semrush out.

**The picker.** Same menu, same rows and tags as today. Added: Adobe's headings (each opens and closes, with its count), and a
Find a product box. With products on the canvas, the ones that connect still come first. The red NEW tags are only in the
pictures, to show which products are proposed.

## Flags for the tool as it is today (not fixed)

1. **Trial size (closed Nov 10: Adam says the Brand Visibility trial is over).** Brand Visibility's Quick Start says trials activated on or after April 1 2026 get up to 100 prompts (earlier
   trials keep 200), one domain, and fixes on up to 50 URLs for one opportunity type. The tool's starting point is 200 prompts.
   https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/quick-start
2. **Two Adobe pages disagree on the Adobe Analytics integration (moot after Adam's call not to pitch it).** Brand Visibility's release notes (Apr 3 2026) call it
   generally available. The Adobe Analytics release notes list a Brand Visibility integration with the documentation link to
   follow and the rollout to be decided. Confirm with the product team before partners pitch it.
   https://experienceleague.adobe.com/en/docs/analytics/release-notes/latest
3. **Measuring AI traffic through Adobe Analytics undercounts.** Brand Visibility uses the Analytics referrer type
   "Conversational AI tools", and Adobe says tools such as ChatGPT often send no referrer.
4. **CDN lists.** Optimize at Edge has routing guides for Azure Front Door and Apache HTTP Server; Imperva appears only under
   log forwarding. Worth a look against the CDN card.
5. **Mix Modeler's pages moved.** Every `/en/docs/mix-modeler/` address now redirects to `/en/docs/marketing-campaign-analytics/`.
   The Oct 30 research cites the old addresses (not in the product).
6. **Adobe Marketo Optimizer** is a new, separately documented product (guide updated Oct 21 2026). Not on this map.
7. **Coworker** now names AEM Forms (four workflows) and Adobe Campaign v8 (ten workflows), beyond the ten products the
   catalog connects it to.

## Not read

- business.adobe.com and www.adobe.com: cannot be read from this session. Nothing was done to get around that. The product
  list is Adam's screenshots of Adobe's menu.
- semrush.com, help.frame.io and news.adobe.com: refused by this session's network settings. Semrush's and Frame.io's own
  help pages would need those sites allowed in the Claude Code environment (Adam's call).

## Waiting for Adam

1. Yes or changes to the three waves and the headings.
2. Yes or changes to the picker mockup (the headings, and whether to keep the Find a product box).
3. Yes to the Brand Visibility wording pass (`sow/bv_copy_review_2026-11-10/PROPOSAL.md`: 10 trial sentences, 4 Adobe Analytics sentences).
4. Yes to removing Engagement title from the Scope step (`sow/mockups/nov10_engagement_title/engagement_title.png`).
5. help.frame.io: allowed by Adam on Nov 10, and read for wave 2 (`wave2/frameio_help_recheck.json`).
6. The optional nudge to add Brand Visibility on a play built without it (not mocked up yet).
