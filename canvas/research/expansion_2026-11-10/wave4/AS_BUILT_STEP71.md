# Step 71, the Marketo family: as built (Nov 11 2026)

Adam, Nov 10: "should we add these two products?", "go" on the research, then "looks great, yes" to
`sow/mockups/nov10_wave4/wave4_cards.png` and the five recommendations in `WAVE4_PROPOSAL.md`.

## What is in the tool

- **Marketo Qualifier** (`mqualifier`): 8 services (MQ01 to MQ08; 7 starting, 1 optional). Connections: Marketo Engage
  (XP01 to XP03), a CRM, as an outside system (XP04, XP05), Brand Concierge (XP06 to XP08).
- **Marketo Optimizer** (`moptimizer`): 13 services (MO01 to MO13; 7 starting, 6 optional). Connections: Marketo Engage
  (XQ01 to XQ03), Coworker (XQ04 to XQ06), ad platforms, as an outside system (XQ07, XQ08).
- The catalog is 34 Adobe products, 9 outside systems, 150 connections, 517 services. The six plays are unchanged.
- Both sit under Campaign management in the Add product menu, after Marketo Engage, and in the top row of the canvas
  beside Brand Concierge.
- The RFI Builder knows both by name ("Sales Qualifier" too, Marketo Qualifier's former name) and has opening sentences
  for each (13 sentences, 52 quotes; `sow/rfp_prototype/step71_research/`).

## Adam's calls, as built

1. Marketo Optimizer is in, with no release label in anything a partner or client reads (Adobe's guide calls the
   current release a Beta release on 11 of its 58 pages). Recheck the guide before a partner launch.
2. Marketo Qualifier + Brand Concierge is kept, sourced from Adobe's Brand Concierge guide.
3. Coworker is a connection on Marketo Optimizer.
4. The Marketo Optimizer + Marketo Engage card lists a Marketo Engage subscription first and Adobe's HIPAA statement
   second, both before the fold. (Product cards show services, not prerequisites, so the two lines sit on the connection
   every Marketo Optimizer statement of work has.) Marketo Qualifier's cards say nothing about what it is sold with.
5. No line between the two.

Journey Optimizer B2B Edition is as it was: Marketo Optimizer is its own product.

## Files

`sow/canvas/data_step71.py`, `sow/canvas/patch_step71.py`, `sow/rfp_prototype/step71_research/merge.py`, then
`python3 sow/canvas/build.py && python3 sow/build_site.py`. Research: `marketo_qualifier.*`, `marketo_optimizer.*` (131
quotes found on Adobe's pages, `wave1/verify_wave1.py`). Picture: `sow/mockups/nov10_wave4/as_built_wave4.png`.

## Checks

`node sow/test_step71.js` (34). Older suites' catalog counts were brought to 34, 150 and 517 on purpose
(`test_step61.js` to `_step66.js`, `test_rfp_step69.js`, `qa/check_product_copy.py`).

## Left out and flagged

Left out under Adam's rules: Smart audience (Beta), Scoring Studio (Labs), the AEM Assets, Content Fragments and Express
integrations ("planned for a future release"), Coworker commands marked "Coming soon", Google mail and calendar for
Qualifier (only Outlook is documented). Flagged: two places where Adobe's Qualifier pages disagree with each other; MO01
overlaps in part with Journey Optimizer B2B Edition's access service if both are on one canvas; nothing is stated publicly
on whether either can be bought without Marketo Engage (ask the product team).
