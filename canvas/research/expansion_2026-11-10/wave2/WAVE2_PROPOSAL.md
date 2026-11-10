# Wave 2, GenStudio and creative: proposal for Adam's yes (Nov 10 2026)

Nothing is built. The picture is `sow/mockups/nov10_wave2/wave2_cards.png`: real cards, drawn on a scratch copy of the tool
with this research (`node sow/mockups/nov10_wave2/wave2_mock.js <scratch canvas folder>`).

## What it would add

Seven products on Create your own play and in the RFI Builder, under a new menu heading, **Creativity & design**. The six
plays on the front page stay as they are.

| Product | Services | Starting | Optional |
|---|---|---|---|
| Adobe Express | 8 | 6 | 2 |
| Creative Cloud (one box) | 7 | 5 | 2 |
| Frame.io | 8 | 5 | 3 |
| Workfront Planning | 8 | 6 | 2 |
| Firefly Creative Production (includes the Firefly Services APIs) | 9 | 6 | 3 |
| Firefly Custom Models | 7 | 5 | 2 |
| Brand Intelligence | 8 | 5 | 3 |

55 product services and 46 connection services across 26 connections. The catalog would go from 21 Adobe products, 98
connections and 304 services to 28, 124 and 405.

Every service links to its Adobe page. 323 quotes were checked word for word on Adobe's pages on Nov 10 (184 in
`content_tools.json`, 139 in `firefly_family.json`; `wave1/verify_wave1.py` on both: 0 not found). The research trails are
`content_tools.md` and `firefly_family.md`. Hours are our own estimates for a mid-market client; Adobe publishes none.

## Questions, each with a recommendation

1. **Brand Intelligence only works with Adobe's own engineers.** Adobe's product description requires "Adobe
   Forward-Deployed Engineering resources", and they load the brand's data. The partner services sit around that work
   (gathering brand sources, building the checks into the client's tools, the Workfront AI Reviewer, training). Your rule is
   nothing about Adobe Consulting Services. **Recommend: in,** with that requirement first on the card. It is the creative
   brand-check product, and partners will be asked about it. Out if you would sooner not show a product a partner cannot
   stand up alone.
2. **Firefly Custom Models** is in beta for individual and teams plans only; the enterprise plan carries no label.
   **Recommend: in, written for enterprise plans only,** with the plan as the first prerequisite and no label on the card.
3. **Frame.io + Workfront (unified review and approval)** is the heart of the Frame.io story, and Adobe says the Frame.io
   viewer is the default for Workfront reviews. One Adobe page says the new approval functionality "is only available for
   specific accounts", and Adobe's representative checks the contract. **Recommend: keep it,** with that as a condition in
   the statement of work.
4. **Firefly Creative Production and Firefly Services: one box or two?** Firefly Services customers are entitled to
   Creative Production. **Recommend: one box,** named Firefly Creative Production, saying it includes the APIs.
5. **Creative Cloud's own services are IT work** (Admin Console, packages, sharing policy). **Recommend: keep them,**
   because every Creative Cloud connection depends on packages and profiles.
6. **Three small calls, all recommended as drawn:** Express + Frame.io keeps its own small card (one service); Frame.io +
   AEM Assets is shown as running through Workfront; GenStudio + Custom Models stays out while GenStudio's image screen
   carries a Beta badge.

## Left out, under your rule on beta and dates

Firefly Graph and capsules, the Adobe Express API, Express Run brand check, Frame.io Access Groups, Planning Designer,
custom models in Photoshop, the Lightroom API (end-of-life notice), Express inside AEM Sites' Generate Variations (on the
version Adobe is retiring). Not connections because Adobe documents none: any of the seven with Brand Visibility, Coworker
with the Firefly products, Brand Intelligence with Firefly Creative Production (a licensing prerequisite only).

## Flagged

- **help.frame.io could not be read** (refused by this session's network settings, not worked around). Frame.io's four
  setup services (workspaces, shares, watermarking, metadata) rest on the feature list in Adobe's product description, not
  on how-to pages, and the direct Frame.io to AEM Assets export is unconfirmed. Allowing that host in the environment's
  network settings would let these be checked before the build.
- **Firefly Graph (beta) may be replacing Workflow Builder.** The services are written on the Workflow Builder pages as
  Adobe has them today, to be rechecked on build day.
- **Overlaps to settle at build time:** Frame.io + AEM Assets and Planning + AEM Assets use the same Workfront and AEM
  Assets integration as the existing AEM Assets + Workfront card; Express + Workfront and Express + Frame.io are the same
  approval on two viewers; Express templates for GenStudio sits beside GenStudio's own template service.
- **The Workfront AI Reviewer card for Brand Intelligence** rests on a page that opens with a Preview notice; in the page
  the notice marks a different section. That it needs the Validate add-on is our reading, not Adobe's words.
- With ten or more connections on a canvas the tool shows lines only for the product clicked. That is how it works today;
  wave 2 makes it more common.

## If yes

One step: the data (`data_step64.py`), Creativity & design added to the menu's groups, the RFI Builder's names, a test
suite, the as-built picture, every suite and the copy check, a zip for Proto.
