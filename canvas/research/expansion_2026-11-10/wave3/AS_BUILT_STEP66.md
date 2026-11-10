# Step 66, as built (Nov 10 2026): wave 3, cut to what partners sell

Adam's answers to `WAVE3_PROPOSAL.md`, in his words:

- Audience Manager: "kind of like dead really between CDP and CDP collaborations. There's no reason to use audience anymore."
- Adobe Campaign: "We're trying to move everyone off of adobe campaign over the journey optimizer so it's not a huge
  priority"; asked a second time: "Leave it out".
- Marketo Measure: "people still buy it. It's kind of a weak analytics tool but people still buy it."
- Coworker + Analytics and Coworker + Campaign: "Let's just skip those. It's a waste of our time."
- AEM Guides: "No one really buys that either"; asked a second time: "Leave AEM Guides out".
- Adobe Advertising: "I don't even get paid on that like I don't even know how long that'll exist."
- Acrobat: "if you feel there's some use cases we can keep that."
- The canvas with 36 products: "There's zero chance anyone would ever buy 36 products at a time." No canvas change.

## What is in the tool

Four products on Create your own play and in the RFI Builder. The six plays on the front page are unchanged.

| Product | Services | Starting | Optional | Menu heading |
|---|---|---|---|---|
| Adobe Analytics | 8 | 6 | 2 | Data & analytics |
| Marketo Measure | 8 | 7 | 1 | Campaign management |
| Acrobat and Acrobat Services (one box) | 12 | 3 | 9 | Document productivity (new) |
| Acrobat Sign | 14 | 6 | 8 | Document productivity (new) |

42 product services and 32 connection services across 20 connections (the list is the table at the foot of
`sow/mockups/nov10_wave3/as_built_wave3.png`). The catalog is 32 Adobe products, 9 outside systems, 144 connections and 480
services.

Adobe Analytics has no Brand Visibility line (Adam's call of the morning) and no Coworker card. The RFI Builder still names
Adobe Campaign, Audience Manager and AEM Guides as not in this catalog.

## How it was built

- `sow/canvas/data_step66.py`: the three research files, cut to the four products and their 20 connections, become
  `research/wave3_data_analytics.json`, `wave3_campaign_advertising.json` and `wave3_documents.json`. What Adam left out
  (four products, 28 connections to them, and Adobe Analytics + Coworker) is listed in each under `left_out` with his
  words; the full research stays in this folder.
- `sow/canvas/patch_step66.py`: the menu's groups (a sixth heading, Document productivity), the names in `rfp_answers.js`
  and `rfp_finder.js`, and one fix to the canvas's lines (below).
- `node sow/test_step66.js` (34 checks).
- Picture: `sow/mockups/nov10_wave3/as_built_wave3.png` (`node sow/mockups/nov10_wave3/wave3_mock.js sow/canvas built`).

## A fix the build needed: lanes close up on a very busy box

With Adobe Analytics and Marketo Measure on, Real-Time CDP has 17 connections and routes 16 of them down one side of its
box in the focus view. The lines leave in lanes 10 apart, and with more than 14 the innermost lane landed on the box's own
edge, so that line could not be drawn (a console error, and one missing line). The lanes now close up when a side holds
more than 14 lines; a box with 14 or fewer draws exactly as before. Found by `canvas/test_canvas.js` and `test_step62.js`.

## Two more fixes, found by the full run on this build

- **The RFI Builder's old Adobe Analytics rule is removed** (`sow/patch_step66_rfi.py`). While Adobe Analytics was outside
  the catalog, a question that named it was drafted as the upgrade to Customer Journey Analytics with a note saying
  "Adobe Analytics is not in this catalog". It is a product now, so a question about it is answered from its own services
  and the rule could never fire. `test_rfp_step52.js` and `recheck.js` check 4.3 were changed on purpose.
- **The four boxes moved from a new bottom row to a new column at the right.** With a sixth row the canvas scrolled up
  and down on a 768 pixel screen, and cards there covered the bolts of the product they belonged to (`test_step47.js` at
  768 by 1024, with every product on). A first fix, a scroll margin that kept boxes clear of the Continue button, made card
  placement worse and was taken out. In the new column every card opens clear of its box and bolts from 768 to 1920
  pixels wide.
- **One check in `test_step47.js` was changed on purpose:** before it clicks a box it brings the box to the middle of the
  canvas. Brought only as far as the edge, a bottom-row box could rest under the Continue button on a 768 pixel screen,
  and the test's forced click pressed Continue. A partner on a tablet can meet the same thing, a box partly under the
  Continue button until the canvas is scrolled; that was so before this step and is not changed.
- One failure in that run was not real: the Adobe Express card measured short at 1920 by 1080 while other work was running
  on the machine. It passes on a clean rerun.

## Where the four boxes sit

Marketo Measure in the last free place of the old grid (bottom right), and Acrobat, Acrobat Sign and Adobe Analytics in a
new column at the right. Every product's lines draw clean there with all 32 on, and a full canvas is drawn at 54% on a
1600 pixel screen (62% with 28). Adam on the size of a full canvas: "There's zero chance anyone would ever buy 36 products
at a time."


## Tests changed on purpose

`test_step61.js` to `test_step64.js` and `qa/check_product_copy.py`: the catalog counts, the menu's headings, and AEM Forms'
seven connections (Acrobat Sign joined its six).

## Flagged, not changed

- **The existing AEM Forms service "E-signature with Acrobat Sign" (AF08)** stays on AEM Forms with its tag "Also needs
  Acrobat Sign Solutions". The new Acrobat Sign + AEM Forms connection adds one service (signing on Foundation Components
  forms) and does not repeat it. Moving AF08 onto the connection was proposed and not done.
- **AEM Forms and Experimentation Accelerator each have a service that needs Adobe Analytics** (AF09, EX04). They keep
  their "Also needs" tags; no line to Adobe Analytics was drawn for them.
- **Adobe Analytics + Customer Journey Analytics** has two small services beside the existing upgrade service (CJ03, on
  Customer Journey Analytics). A statement of work should carry one route.
- **Three Adobe Analytics cards start with the same source connector** (Real-Time CDP, Customer Journey Analytics, Journey
  Optimizer): count it once.
- **Adobe Analytics + Real-Time CDP** names Audience Manager as a license one optional service needs. Audience Manager is
  not a product in the tool; the tag says so.
- **Marketo Measure**: its release notes stop at 2024 and Adobe states no end of life. Built on Adam's "people still buy
  it". Marketo Measure + Real-Time CDP is for the Ultimate edition only, and the card says so.
- **Acrobat Sign + Marketo Engage** runs through the client's CRM (Salesforce or Dynamics), shown as "also needs".
- **business.adobe.com would not load** for the helpers, so plan and packaging statements rest on Adobe's help pages.
- **No knowledge-base facts for the four** (hosting, certifications), so those RFI questions go to Confirm with Adobe.
- **Hours are our own estimates** for a mid-market client. Adobe publishes none.
