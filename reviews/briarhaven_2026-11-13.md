# Briarhaven RFP review and interface fixes

Built on `claude/amazing-volta-go9ton` at `d48929f479ec931d286bf99fe149a332160a70aa` for `chatgpt/kb-round2`. No deployment. The existing saved engagement and uploaded files were not changed.

## What Adam saw

- Commerce already has seven standalone services (`CE01` to `CE07`). All are optional, so its card could show zero selected services with every available service hidden under a closed disclosure.
- The old **Removed** label meant an ordinary catalog service was off. It did not establish that the user had removed it.
- The RFI handoff uses checked services from Adobe answers marked **Use this answer**, merging them with existing SOW work. Service checkboxes start checked. A product can enter through a selected connection endpoint without any of its standalone services being selected. Connection services are counted separately.
- The supplied workbook preserves all 32 requirements. It contains 23 substantive responses, six placeholder responses of unknown provenance, and three blanks. Several responses select unrelated work or contradict explicit exclusions.
- The supplied SOW includes ten Adobe products instead of the requested six, 42 selected services, and 42 open items. Thirty-nine services are marked as concepts. Its $600,000 arithmetic is consistent with 2,704 one-time hours and 108 monthly hours for 12 months at $150/hour; that does not validate the scope or estimates.

## Changes

| Area | Change |
|---|---|
| `sow/canvas/template.html` | Prominent Explore one product / Show all connections controls on crowded canvases. The latter displays existing catalog connections among the selected nodes. Switching views changes no product, service, rate or fee. |
| Product and connection cards | Off services say Not selected and the action says Add; names remain readable. Available services open initially when no main rows are visible. An explicit user collapse persists. Footers distinguish product services from connection services. |
| `sow/index.html`, `sow/patch_step49.py` | Remove the redundant HTML SOW download and its handler. Keep Services CSV and clearly label Print / Save PDF. Preserve draft markers and the open-item checklist. Update the build's style-block anchor after removing the HTML template. |
| `sow/rfp_readers.js`, `sow/rfp_finder.js` | Recognize narrative label/value context sheets structurally. Retain all their text for constraints and background, without promoting instructions to response questions. Real requirement tables, coded rows and question-like cells retain their existing path. |
| `sow/rfp_answers.js` | Recognize bounded lists of declined/not-included products and direct without-product conditions, while preserving feature, access and ownership distinctions. Apply exclusions to factual replies and stale no-AI handoffs as well as method/service selection. |
| Commerce matching | Generic product pages and product catalogs no longer prove an ecommerce requirement. Explicit Commerce, storefront, ecommerce, checkout and cart signals remain. |

The catalog remains 43 products, 151 connections and 531 services. No catalog service, research fact, hours estimate, AI worker or live site was changed.

## Validation

- Normal canvas and site builds passed, including fact and method checks.
- All **34 suites** passed: every `sow/test_rfp*.js`, `sow/test_step91.js`, `sow/test_site.js` and `sow/test_canvas_views.js`.
- New coverage: 17 canvas checks, 13 context-sheet checks, 35 bounded-exclusion checks and nine product-evidence checks. Includes keyboard/mobile behavior, unchanged selection/fees, seven optional Commerce services, one-click pricing exactly once, manual collapse, negative/affirmative refusal examples, factual answers and stale handoffs.
- The site test now verifies the print handler and draft marker in place of the removed HTML download. Its optional Google font stylesheet is fulfilled locally so network availability does not masquerade as a script failure; script errors still fail the test.
- Two test runs initially lacked fixtures in the partial local checkout. The existing TSV and Northbridge fixtures were restored and both suites passed. No fixture or assertion was changed to hide a failure.
- A new assertion initially mistook a conditional shared licensing fact for a product recommendation. It now permits only that bounded conditional clause; forbidden selected products, dependencies, service IDs and every other prose mention remain checked.
- `git diff --check` passed.

Fresh browser execution of the original sample workbook:

| Measure | Before | After |
|---|---:|---:|
| Questions emitted | 37 | 32 |
| Background/requirement paragraphs retained | 66 | 66 |
| Adobe products in an all-approved-drafts handoff | 10 | 6 |
| Selected services in that simulation | 44 | 32 |
| Browser errors | 0 | 0 |

The six resulting products are AEM Sites, AEM Assets, AEM Forms, Acrobat Sign, Customer Journey Analytics and Target. This simulation approves every available Adobe service draft; it is not a reconstruction of Adam's exact 42-service saved engagement and is not a quality score.

## Remaining answer limitations

This change does not make every RFP answer complete. In the full-workbook rerun, A.3 still matches Forms work to a website-navigation question, B.3 still matches Sites/CJA collection to an asset-preparation question, and D.1 incorrectly recovers signing work for a CJA-design question. In the smaller isolated exclusion test, D.1 instead falls back to permitted CJA licensing facts, also without a suitable implementation method. These are remaining lead-selection and coverage gaps. Other questions still need supplier-written responses and client-specific acceptance criteria. The richer method writer remains a separately tested path; this change does not silently enable it for partners.

Existing SOW work is deliberately preserved by merge. To evaluate the corrected matching, import the RFP into a fresh draft; existing selections are not silently deleted. Claude should review these changes before Adam uploads a new package to Proto. No held-out third RFI or key was opened or used in this review.
