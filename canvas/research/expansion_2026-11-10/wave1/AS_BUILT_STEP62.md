# Step 62, as built: the six products researched on Oct 30 join the tool (Nov 10 2026)

The rest of wave 1 of the catalog expansion. Adam: "yes, let's keep going" to the recheck and the cards, then his answers to
the five questions in `SIX_PROPOSAL.md`. Built and tested in `sow/site/`. The six plays on the front page are unchanged; the
six products are on Create your own play and in the RFI Builder.

Picture of the built cards: `sow/mockups/nov10_wave1_six/as_built_six.png` (redraw it with
`node sow/mockups/nov10_wave1_six/six_mock.js sow/canvas built`). The proposal picture Adam answered from is `six_cards.png`
in the same folder.

## Adam's answers, and what each became

| Question | Adam | Built |
|---|---|---|
| Real-Time CDP Collaboration, which Adobe badges "Limited Availability" for its regions | in | In, with 6 services and Real-Time CDP as its connection. Nothing the tool says carries the badge's words; the regions (the United States, Canada, Australia, New Zealand, and Europe, the Middle East and Africa) are among what the connection needs first |
| GenStudio's four extra connections | "if they exist, yes" | All four are in, one service each: Journey Optimizer, Marketo Engage, Real-Time CDP and Coworker. Each rests on an Adobe page with setup steps. The Coworker one carries the eligibility line every Coworker connection carries |
| Marketing Campaign Analytics + Content Analytics | "I go with your recommendation" | Left out: no line on the canvas, and its two services (XD10, XD11) are not in the catalog. The research file records why |
| Content Analytics + Coworker | in. He asked where Content Analytics lives: it has no screen of its own; it is licensed on its own and set up and read inside Customer Journey Analytics, where Coworker works | In, with 2 services. Its second prerequisite says Adobe's pages do not say whether the standalone license is enough, so confirm it with Adobe |
| Journey Optimizer B2B Edition + Target | "keep it" | In, with 1 service |

## What is in the tool now

- **The catalog:** 21 Adobe products (was 15), 9 outside systems, 98 connections (79, plus 19) and 304 services (232, plus
  72).
- **The six,** each with six services of its own: GenStudio for Performance Marketing, Content Analytics (4 starting, 2
  optional), Marketing Campaign Analytics (formerly Mix Modeler; its card is titled with both names), Real-Time CDP
  Collaboration (5 and 1), Journey Optimizer B2B Edition, Experimentation Accelerator (5 and 1).
- **19 connections,** 36 services: GenStudio with Workfront, AEM Assets, Content Analytics, Journey Optimizer, Marketo
  Engage, Real-Time CDP and Coworker; Content Analytics with Customer Journey Analytics, Real-Time CDP and Coworker;
  Marketing Campaign Analytics with Customer Journey Analytics and Real-Time CDP; Collaboration with Real-Time CDP; Journey
  Optimizer B2B Edition with AEM Assets, Marketo Engage, Real-Time CDP and Target; Experimentation Accelerator with Journey
  Optimizer and Target. None connects to Brand Visibility: Adobe documents none.
- **Tags:** "Needs Real-Time CDP B2B Edition or B2P Edition" on Journey Optimizer B2B Edition's three Real-Time CDP services,
  "Needs Content Hub on AEM Assets as a Cloud Service" on GenStudio + AEM Assets, "Needs Real-Time CDP Prime or Ultimate" on
  the lookalike audiences service. "Also needs" on Collaboration's cloud sources and the accelerator's reporting source.
- **Left out, with Adobe's words in the research files:** everything Adobe keeps under an early label or where its own pages
  disagree (LinkedIn creation in GenStudio, full funnel modeling, three paid media sources in Content Analytics, applying an
  accelerator suggestion inside Target, the web channel and custom objects in Journey Optimizer B2B Edition, Coworker for the
  B2B edition), and the two Collaboration pairs Adobe does not document. No card says limited availability, coming soon,
  beta or early access.
- **The RFI Builder:** GenStudio and Mix Modeler are off the "not in this catalog" list. Questions that name any of the six
  are sorted as Adobe products and answered from their services and connections; a question that still says Mix Modeler is
  answered as Marketing Campaign Analytics; Journey Optimizer B2B Edition is told apart from Journey Optimizer. The 19
  connections have client-voice wording. Topic words bring a product in beside a named one: ad creative and ad variation
  (GenStudio), content performance (Content Analytics), marketing mix, media mix and budget plan (Marketing Campaign
  Analytics), clean room and data collaboration (Collaboration), buying group and account-based marketing (B2B Edition).

## Files

| File | What changed |
|---|---|
| `sow/canvas/data_step62.py` | The data step, run once |
| `sow/canvas/research/portal_acquisition_insights.json`, `portal_omnichannel_b2b.json` | Replaced by the rechecked files from `expansion_2026-11-10/wave1/` (which stay there as the recheck's record, with their trails). In the first, `mmm-ca` moved to `left_out` and two prerequisites lost a date |
| `sow/canvas/catalog_map.json` | The six placed on Create your own play |
| `sow/canvas/research/connection_types.json` | 19 connections with their evidence quotes |
| `sow/product_copy_rules.json` | `connection_client` for the 19 |
| `sow/rfp_answers.js`, `sow/rfp_finder.js` | The six in the names, topic words and the question sorter; GenStudio and Mix Modeler off the not-covered list |
| `sow/test_step62.js` | The step's suite (31 checks) |

## Checks changed on purpose

- `sow/qa/check_product_copy.py`: 262 service definitions and 98 connections.
- `sow/test_step61.js`: the catalog's counts and the 21 products in the Add product menu.

## Flagged, not changed

- **The Add product menu is one list of 21 products.** The grouped menu with a Find a product box
  (`sow/mockups/nov10_expansion/picker_*.png`) is drawn and not built.
- **Three services already in the tool cite a sentence Adobe has since reworded** (XC03, XC05, XC10). Their links still
  stand; the quote is not shown to partners.
- **Journey Optimizer B2B Edition needs the B2B or B2P edition of Real-Time CDP,** and the tool has one Real-Time CDP box.
  The tag says so on the connection's services; the product card does not.
- **Hours are our own estimates** for a mid-market client. Adobe publishes none.
