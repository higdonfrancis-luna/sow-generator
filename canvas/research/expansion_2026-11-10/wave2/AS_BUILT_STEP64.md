# Step 64, as built (Nov 10 2026): wave 2, GenStudio and creative

Adam's answers to `WAVE2_PROPOSAL.md`: "Add firefly custom models don't worry about the beta"; Brand Intelligence "Include
it"; "frame. Io plus work front is good to go"; Firefly Creative Production and Firefly Services "One box makes sense";
Creative Cloud's services "sure"; and help.frame.io allowed in the environment so Frame.io's own pages could be read.

## What is in the tool

Seven products on Create your own play and in the RFI Builder. The six plays on the front page are unchanged.

| Product | Services | Starting | Optional | Menu heading |
|---|---|---|---|---|
| Adobe Express | 8 | 6 | 2 | Creativity & design |
| Creative Cloud (one box) | 7 | 5 | 2 | Creativity & design |
| Firefly Creative Production (includes the Firefly Services APIs) | 9 | 6 | 3 | Creativity & design |
| Firefly Custom Models (written for enterprise plans) | 7 | 5 | 2 | Creativity & design |
| Frame.io | 8 | 5 | 3 | Content & workflows |
| Workfront Planning | 8 | 6 | 2 | Content & workflows |
| Brand Intelligence | 8 | 5 | 3 | AI & agents |

55 product services and 46 connection services across 26 connections (the list is the table at the foot of
`sow/mockups/nov10_wave2/as_built_wave2.png`). The catalog is 28 Adobe products, 9 outside systems, 124 connections and 405
services.

## How it was built

- `sow/canvas/data_step64.py`: the two research files become `research/wave2_content_tools.json` and
  `research/wave2_firefly_family.json`; the seven products get a place on Create your own play (two new columns at the
  right); 26 entries in `research/connection_types.json`; 26 client-voice entries in `product_copy_rules.json` for the RFI
  Builder.
- `sow/canvas/patch_step64.py`: the menu's groups in `canvas/template.html` (a new heading, Creativity & design, third as
  on Adobe's menu), the names and topic words in `rfp_answers.js`, and three names in `rfp_finder.js`. Adobe Express and
  Frame.io leave the RFI Builder's "not in this catalog" list; Firefly on its own stays on it.
- `node sow/test_step64.js` (37 checks).
- Picture: `sow/mockups/nov10_wave2/as_built_wave2.png` (`node sow/mockups/nov10_wave2/wave2_mock.js sow/canvas built`).

## What the Frame.io help pages changed

`frameio_help_recheck.json`: all 330 English pages of help.frame.io were read, and 95 quotes checked word for word.

- **FR03** (review shares and security settings): limiting shares to authorized domains is Secure Sharing, which Frame.io
  says is for Enterprise Prime. The scope now says "where the plan includes Secure Sharing".
- **XJ15** (Workfront-linked projects): a Workfront project template can send its projects to a Frame.io workspace other
  than Workfront Linked Projects, and projects cannot be moved later. The scope now covers that choice.
- **Frame.io + AEM Assets** now describes two routes: through Workfront (with metadata), and Frame.io's direct export
  (no Workfront, no metadata). The services are the Workfront route's; the direct export is a prerequisite line.
- Confirmed as written: FR02, FR04, FR05, and the Prime and Select tiers.

## Wording changed for the copy rules

- Two version numbers are gone from the cards, because the copy check reads them as release dates: AEM Assets + Firefly
  Creative Production says "on the minimum release Adobe names on its page", and the direct export says "the minimum
  release Frame.io names". The service's link goes to the page with the number.
- "projects are planned in Workfront" reads "projects are managed in Workfront" (the check reads "are planned" as a
  forecast).
- Workfront Planning + Coworker: the card keeps Adobe's note on the industries Coworker is not offered to; the statement
  of work says Coworker is enabled and offered to the Client's organization, confirmed with Adobe first.
- Five cards tell the partner to have Adobe verify something; the statement of work carries each as a condition
  ("Adobe confirms ... before this service starts").

## Tests changed on purpose

- `canvas/test_canvas.js`: the rule that connection bolts sit apart measured 28 pixels on screen. The canvas is drawn
  smaller as products are added, bolts included, so the rule now measures against the canvas scale (39 on the stage, which
  is the same 28 pixels at the 21-product scale). The drawing's spacing is unchanged.
- `test_step61.js`, `test_step62.js`, `test_step63.js`, `qa/check_product_copy.py`: the catalog counts and the menu's
  headings.

## Flagged, not changed

- **A canvas with all 28 products is drawn at 62% on a 1600 pixel screen** (72% with 21). Names are still readable; wave 3
  would shrink it again. Worth a look before wave 3: a larger canvas that scrolls, or hiding products with no line to the
  one clicked.
- **Brand Intelligence needs Adobe's forward-deployed engineers** to load the brand data; the card says "Adobe Brand
  Intelligence licensed and onboarded" first. The partner services sit around that work.
- **The Workfront AI Reviewer card for Brand Intelligence** rests on a page that opens with a Preview-environment notice
  (in the page it marks a different section), and that it needs the Validate add-on is our reading. help.frame.io says
  nothing about Brand Intelligence or AI Reviewer comments.
- **Firefly Creative Production + Frame.io** rests on Adobe's page alone; Frame.io's help pages do not mention it. The
  statement of work says Adobe confirms the Frame.io source first.
- **Firefly Graph (beta) may be replacing Workflow Builder.** The services follow the Workflow Builder pages as Adobe has
  them today.
- **Frame.io documents more Creative Cloud ties than the card names** (After Effects panel, Lightroom, Frame.io Drive for
  Photoshop, Illustrator and InDesign). The card covers Premiere Pro. Easy to add as optional services.
- **Overlaps a statement of work should settle:** Frame.io + AEM Assets and Planning + AEM Assets use the same Workfront
  and AEM Assets integration as AEM Assets + Workfront; Express + Workfront and Express + Frame.io are one approval on
  two viewers; Express templates for GenStudio sits beside GenStudio's own template service.
- **Left out under the beta rule:** GenStudio + Custom Models, Firefly Graph and capsules, the Express API, Express Run
  brand check, Frame.io Access Groups, Inbox and webhooks, Planning Designer, custom models in Photoshop.
- **No knowledge-base facts for the seven** (hosting, certifications), so those RFI questions go to Confirm with Adobe, as
  for AEM Forms.
- **Hours are our own estimates** for a mid-market client. Adobe publishes none.
