# Brand Visibility wording pass: as built (step 58, Nov 10 2026)

Adam: "YES: the Brand Visibility wording pass in sow/bv_copy_review_2026-11-10/PROPOSAL.md (no trial wording, no Adobe
Analytics as a Brand Visibility feed)."

Two rules for every word a partner or a client reads in the tool:

1. **No Brand Visibility trial.** The tool speaks of a Brand Visibility license. Nothing says trial, free trial or paid offer.
2. **Brand Visibility connects with Customer Journey Analytics.** Adobe Analytics is not named as a way to feed Brand Visibility.

Sites Optimizer's own trial wording and Coworker's "Try Before You Buy, a trial or the Agentic SKU" are unchanged.

## What a partner or a client reads now

"Card" is the canvas card the partner reads; "SOW" is what the client reads. All 14 rows of the proposal, as built.

| # | Where | Now reads |
|---|---|---|
| T1 | Brand Visibility + CJA, first prerequisite (card and SOW) | A Brand Visibility license (CJA's page requires it for the source) |
| T2 | Brand Visibility + Edge Delivery Services, first prerequisite (card and SOW) | Brand Visibility license; for the one-click route, users with the Adobe LLM Optimizer Users product profile |
| T3 | AEM Sites + Brand Visibility, first prerequisite (card and SOW) | Brand Visibility license; users need the Adobe LLM Optimizer Users product profile |
| T4 | Brand Visibility + Adobe Commerce, first prerequisite (card and SOW) | Adobe Commerce storefront and a Brand Visibility license |
| T5 | Search data + Brand Visibility, Availability (card and SOW) | GA4 is included with the Brand Visibility license. |
| T6 | AEM Sites + Brand Visibility, Availability (card) | Not stated by Adobe; confirm your client's deployment allowance and supported opportunity types before optimization begins. |
| T7 | AEM Sites + Brand Visibility, Availability (SOW) | Not stated by Adobe. The Client confirms its licensed deployment allowance and supported opportunity types before optimization begins. |
| T8 | Service L03, Automated optimization deployment pilot, Assumptions | ... the selected URLs are inside them. The Client confirms its licensed deployment allowance and enablement for the selected opportunity type. Adobe generates an impact analysis ... |
| T9 | Optimize at Edge availability note | No change on screen: see below |
| T10 | Service C01, Connect Brand Visibility and CJA measurement, Assumptions | ... the Client holds a Brand Visibility license, the CJA integration is enabled for the organization, ... |
| A1 | Service C01, Assumptions | The integration is available (Brand Visibility's AI-agent data reaches CJA as an Experience Platform dataset through the Adobe Brand Visibility source, which the Client adds to a CJA connection and data view), the Client holds ... |
| A2 | Search data + Brand Visibility, how it works (card) | ... Google Analytics 4 can fill the Business Impact tab, as CJA can. |
| A3 | Search data, recommendation (card) | GA4 can fill the Business Impact tab when your client does not have CJA. |
| A4 | Service SD1, Search Console and GA4 connections, Scope | Connect Search Console, and GA4 where your client does not have CJA, to ... |

## Where the build differs from the proposal

The proposal quoted three sentences from older wording that an earlier copy rule had already rewritten on screen. The rule is the
same; the starting text was not what the proposal showed.

- **T8 (L03).** The trial sentence was already gone from the screen (the Nov 7 pass). What was left was "The paid offer is
  assumed." That sentence is removed.
- **T9.** The "Trial limits conflict ..." note was never on screen: an earlier rule already turned it into the sentence the
  AEM Sites + Brand Visibility card shows, which is T6 and T7. Nothing more to change.
- **T10 and A1 (C01).** The shipped sentence was longer than the proposal's. It explained how the AI-agent data reaches CJA and
  then said "Adobe Analytics can feed only Brand Visibility's referral reporting on the Business Impact tab". Only the Adobe
  Analytics clause is removed; the explanation of the CJA route stays, because it is what the client has to set up.

Two spots the proposal's list missed, changed under rule 1:

- The package tag on the Search data + Brand Visibility card: "Needs paid Brand Visibility" is now "Needs a Brand Visibility
  license".
- The same tag on the service SD1 (Search Console and GA4 connections): on the canvas "Needs a Brand Visibility license", in
  the SOW "Assumes your client has a Brand Visibility license."

For Adam to decide (not changed): with the trial over, every Brand Visibility play has a Brand Visibility license, so those two
tags now say something that is always true. Taking the tags off is a screen change and would get a mockup first.

## How it is built

- `sow/patch_step58.py` (run once) edits `sow/product_copy_rules.json` and the Assumptions of the two service templates C01
  and L03 in `sow/index.html`. Nothing else in the page is edited by hand; `canvas/build.py` and `build_site.py` rebuild the
  rest from the rules.
- In the rules:
  - `replacements` gains 13 pairs, each an old sentence or clause and its new wording, and the older pair that ended in
    "The paid offer is assumed." now ends without it.
  - `connection_overrides`: Brand Visibility + CJA (prerequisite), AEM Sites + Brand Visibility (availability), and a new entry
    for Search data + Brand Visibility (its tag).
  - `connection_top`: Brand Visibility + Adobe Commerce names its first prerequisite by the new text.
  - `line_tiers` is new (read by `product_copy.sow_view`, eight lines of Python): the tag of the service SD1.
- **Saved work.** The page runs the same 13 pairs over a saved engagement when it opens (browser storage or a draft file). A
  line the partner never edited takes the new wording and is not shown as "Scope edited". A line the partner edited keeps their
  own words; only an old sentence inside it is replaced.
- Research files (`sow/canvas/research/`) are unchanged: they record what Adobe's pages said when they were read.

## Checks

- `python3 sow/qa/check_product_copy.py` has both rules: it fails on a Brand Visibility trial, free trial or paid offer, or a
  sentence that names Adobe Analytics with Brand Visibility or the Business Impact tab, anywhere in the 44 templates, the 159
  service definitions, the canvas catalog or the problem picker. It found 35 such sentences in the step 57 build and none now.
- `node sow/test_step58.js` (22 checks, ALL STEP 58 CHECKS PASSED): the five connection cards and the Add outside system menu on
  screen; all 299 cards, products and services as data; two engagements saved on the step 57 build
  (`sow/qa/step58_fixtures/`, captured from commit 0cfc619: the CJA play with Search data, and Create your own play with Brand
  Visibility and AEM Sites) opened on this build, with the new wording, the same choices and hours, no "Scope edited", and a
  statement of work without trial wording; and an edited line that keeps the partner's words.
- Updated on purpose, five checks that quoted the old sentences:
  - `sow/test_rfp.js`: three (the RFI Builder's "Adobe licenses this proposal includes" now lists "A Brand Visibility license
    (CJA's page requires it for the source)").
  - `sow/test_rfp_step54.js`: one (the same line).
  - `sow/check.py`: one (the C01 line reads "the Client holds a Brand Visibility license").
- Everything else is listed with its result in `docs/sessions/2026-11-10_steps_58_59.md`.

## Flagged, not changed

- `sow/apply_review.py` stops with "Review input drift: C02.scope" on the branch as it was handed over (before step 58): the
  step 53 template rewordings sit on top of the texts its manifest expects. Step 58 does not use it. It needs a fix before the
  next change that does.
