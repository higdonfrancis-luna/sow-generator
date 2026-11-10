# Wave 1, the six products researched on Oct 30: proposal (Nov 10 2026)

Proposed, not built. Adam: "yes, let's keep going" to the recheck and the cards. Waiting for his yes and his answers below.

- Picture (real cards, drawn on a scratch copy of the tool): `sow/mockups/nov10_wave1_six/six_cards.png`
  (`node sow/mockups/nov10_wave1_six/six_mock.js <scratch canvas folder>`).
- Research, as full replacements for the two Oct 30 files: `portal_acquisition_insights.json` and
  `portal_omnichannel_b2b.json` in this folder, each with its trail (`*_recheck.md`).
- Quote check: `python3 sow/canvas/research/expansion_2026-11-10/wave1/verify_wave1.py`. On Nov 10: 355 quotes found on
  Adobe's pages. Not read: two entries on business.adobe.com (left out for that reason). Three not found, all on services
  that are **already in the tool** and were out of this recheck's scope (see Flagged).

## What it would add

| Product | Services | Connections it brings |
|---|---|---|
| GenStudio for Performance Marketing | 6 | Workfront, AEM Assets, Content Analytics, and four more below |
| Content Analytics | 6 (4 starting, 2 optional) | Customer Journey Analytics, Real-Time CDP, Coworker, GenStudio, Marketing Campaign Analytics |
| Marketing Campaign Analytics (formerly Mix Modeler) | 6 | Customer Journey Analytics, Real-Time CDP, Content Analytics |
| Real-Time CDP Collaboration | 6 (5 starting, 1 optional) | Real-Time CDP |
| Journey Optimizer B2B Edition | 6 | AEM Assets, Marketo Engage, Real-Time CDP, Target |
| Experimentation Accelerator | 6 (5 starting, 1 optional) | Journey Optimizer, Target |

With everything in: 36 product services and 38 connection services across 20 connections. The catalog would go from 15 to
21 Adobe products, 79 to 99 connections and 232 to 306 services. The six plays on the front page stay as they are.

## What changed since Oct 30

- All 40 Oct 30 service quotes in scope were checked: 34 still on their pages, 2 reworded by Adobe (replaced), 4 on a page
  this session cannot open (replaced with Experience League sentences). No service was dropped and no hours changed.
- Mix Modeler is Marketing Campaign Analytics in every name, and its sources use the new addresses.
- Left out, because Adobe labels the feature early or its own pages disagree: LinkedIn creation in GenStudio, full funnel
  modeling in Marketing Campaign Analytics, three paid media sources in Content Analytics (Google and Meta stay), applying
  an accelerator suggestion inside Target, the web channel and custom objects in Journey Optimizer B2B Edition, Coworker for
  the B2B edition. Each is listed with Adobe's words in the trails.
- Collaboration with CJA and with Marketing Campaign Analytics are out: Adobe documents nothing for either.
- Added at service level: GenStudio + Workfront, GenStudio + AEM Assets, Content Analytics + Coworker, Experimentation
  Accelerator + Target, Journey Optimizer B2B Edition + Marketo Engage, + Real-Time CDP, + Target, and four one-service
  GenStudio connections (Journey Optimizer, Marketo Engage, Real-Time CDP, Coworker).

## Questions for Adam, each with a recommendation

1. **Real-Time CDP Collaboration: in or out?** Adobe's guide badges it "Limited Availability" and says it is "currently
   available in the United States, Canada, Australia, New Zealand, and across Europe, the Middle East, and Africa, with
   global availability coming soon". Its release notes call it generally available in those regions. Nothing the tool says
   would carry either phrase; the regions would be its first prerequisite. Recommended: in.
2. **GenStudio's four extra connections** (one service each): Journey Optimizer and Marketo Engage (an Adobe Exchange app
   brings their email templates in), Real-Time CDP (audiences as a choice in Create, after Adobe's team onboards it), and
   Coworker (GenStudio's page says it is a native Coworker connection; Coworker's own guide never names GenStudio).
   Recommended: keep the first three, hold Coworker until Coworker's guide names it.
3. **Marketing Campaign Analytics + Content Analytics.** No data passes between the two; both read the same paid media
   data. A line on the canvas would suggest more. Recommended: leave this connection out. Content Analytics + Real-Time CDP
   and + GenStudio stay, each saying it is shared data.
4. **Content Analytics + Coworker.** Adobe's pages ask for Customer Journey Analytics data views and do not say whether the
   standalone Content Analytics license is enough. Recommended: in, with "confirm with Adobe" as a prerequisite.
5. **Journey Optimizer B2B Edition + Target** was not on the list, but Adobe documents it with setup steps (one service).
   Recommended: keep.

## To settle when building

- Two prerequisites (GenStudio + Journey Optimizer, + Marketo Engage) give a date ("licenses started or renewed on or after
  April 7, 2025"). The copy check stops on it, as it should; they get reworded without the date.
- Journey Optimizer B2B Edition needs the B2B (or B2P) edition of Real-Time CDP, and the tool has one Real-Time CDP box.
  Its three Real-Time CDP services carry the tag "Needs Real-Time CDP B2B Edition or B2P Edition".
- The Marketing Campaign Analytics card is titled "Adobe Marketing Campaign Analytics (formerly Mix Modeler)", as
  `catalog_map.json` has had it since Oct 30.
- Places on Create your own play, connection types, client-voice wording and the copy rules, as step 61 did for AEM Forms.
- The grouped picker (`sow/mockups/nov10_expansion/picker_*.png`) becomes worth building at 21 products.

## Flagged, not changed

Three services already in the tool cite a sentence Adobe has since reworded, so their evidence quote is no longer on the
page (the services and their links still stand; the quote is not shown to partners): "AEM Assets repository in Journey
Optimizer" (XC03), "Content Fragments for Journey Optimizer" (XC05) and "Connect AEM Sites to Commerce with CIF" (XC10).
They were outside this recheck. A recheck of every Oct 30 quote in the tool would find any others.
