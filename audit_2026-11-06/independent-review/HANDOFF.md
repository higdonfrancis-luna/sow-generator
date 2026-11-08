# Nov 8 2026: the scrub finished on branch `claude/peaceful-dijkstra-u3yns7`

ChatGPT's spend limit ended its run after the commits below. Claude Code continued on `claude/peaceful-dijkstra-u3yns7`, which starts from this branch's last commit (`ce4823f`): twelve more copy rules for the forward-looking lines the first pass missed, the problem picker's note, a stricter `sow/qa/check_product_copy.py` (any release label, forecast, release-label talk, month and year, quarter or dated version in shipped copy fails) and a browser crawl, `sow/qa/check_rendered_copy.js`, that reads both pages and the downloads the way a partner would. Details in `sow/README.md` ("Product and service copy") and `docs/sessions/2026-11-08.md`. Nothing merged or deployed; `abv-partner-plays` is untouched.

---

# Earlier continuation (Nov 8, ChatGPT): product-copy scrub validated

Work branch: `claude/determined-brahmagupta-clez60`. Continue its existing history. Do not merge or deploy without Adam’s instruction.

Adam’s current copy instruction supersedes release-status and feature-release timing wording in the older review proposals. Customer-facing product/service descriptions, the canvas and problem picker, inherited prerequisites, the SOW, saved drafts and exports omit beta, Early Access, Early Adopter, Limited Availability, coming-soon and product-release date language. Keep the actual supported configuration, access, licensing and tenant-enablement requirements. Do not infer general availability from this editorial policy.

The fully tested application/test commit is `55e5bad20d438a8879e4aaf1376ea94f8eca0756`. All **14 validation suites passed**: https://github.com/higdonfrancis-luna/warroom/actions/runs/42455493071. The follow-up commit contains documentation/evidence only. No merge or deployment was performed.

Read `implementation/RELEASE_COPY_SCRUB.md` and `implementation/product-copy-validation.json` for the policy and exact results. Rules live in `sow/product_copy_rules.json`; the Python build adapter and inlined JavaScript apply the same policy. Existing Client project dates, site-launch timelines, quantities, hours and rates are preserved. The original audit and research remain available internally for provenance.

Both `python3 sow/qa/check_product_copy.py` and `python3 sow/qa/check_citation_review.py` pass. Repeat application/builds are byte-identical. The historical paragraph assertion compares its reference wording after the approved copy policy while retaining its 6/6/5 paragraph, edit-box, preview, CSV, downloaded-document and PDF checks.

Earlier implementation/review handoffs follow for provenance.

---

# Historical citation implementation handoff

Work branch: `claude/determined-brahmagupta-clez60`. Continue its history; do not reset it. Review, import and implementation commits remain separate. Adam authorized implementation. Merging and deployment remain on hold.

The reconciled checkpoint-11 proposal is applied: **338 field changes across 142 records**, with all 278 reviewed dispositions accounted for. The estimates and cadences for all 203 services are unchanged. Concept labels and completion requirements are preserved. The received files, checkpoint exports and review evidence remain intact.

The fully tested application/test commit is `44e27b10e82be5fd15bdf12f86cae5cce6849cd3`. **All 13 validation suites passed** in https://github.com/higdonfrancis-luna/warroom/actions/runs/42450957543, including the ten original Node suites, check.py, the citation manifest check and the new citation/draft/download browser suite. The final commit after that adds documentation and validation evidence only.

Read `implementation/README.md`, `implementation/local-validation.json` and `implementation/browser-validation.json` for build instructions and exact results. The implementation preserves reconciled changes across rebuilds, refreshes unedited older draft defaults, retains partner edits and estimates, and carries supporting citations into the SOW and exports. Optional Brand Visibility prerequisites/references follow the selected product context. Inherited availability instructions render as Client-owned conditions without dropping route qualifications.

Validation repaired a prerequisite-note spacing failure from the original baseline. Existing tests now inspect primary plus expandable citations, separate documentation titles from contract prose, allow the technical term bring-your-own Git, and require unedited older concept scopes to update on draft opening. All original behavioral, containment, totals, migration and print/PDF assertions still run.

The prior review/import handoff follows for provenance. Its pending implementation/testing instructions are superseded by the completed results above.

---

# Historical checkpoint-11 review handoff, 2026-11-07

Work branch: `claude/determined-brahmagupta-clez60`. Continue its existing history; do not reset it. Main, abv-partner-plays and the original audit branch remain untouched. Adam authorized review and implementation, with no further Step 3 approval required. Do not merge or deploy.

Current scope coverage: **278 reviewed, 0 pending, 278 total**. URL task states: `{"closed":281,"unreachable":2}`. These counts measure different things. The 49 imported files, including the five received exports, still match the import manifest exactly.

Latest exports: `checkpoint-11/warroom-cp11-counts.json`, `checkpoint-11/warroom-review-checkpoint-11.csv`, `checkpoint-11/warroom-review-remaining-ids-cp11.txt`, `checkpoint-11/warroom-record-verification-queue-cp11.csv` and `checkpoint-11/warroom-url-tasks-cp11.csv`. `checkpoint-11/REVIEW_STATE.json` and `checkpoint-11/source-lookups.json` provide structured lookups. Results are in `cp11-work/results/`; regenerate exports with `python3 cp11-work/tools/merge_results.py`.

Completed families: assets, cja, commerce, data_1, data_2, engage_1, engage_2, root, sites_1, sites_2, workfront. Apply reconciled edits only when scope_pending and records_with_unresolved_claim_tasks are both zero. The reviewed proposal and supplemental retained corrections are saved in checkpoint-11. Keep accepted amendments ahead of original audit recommendations. New reviewer evidence records say who read the primary body and how it was retrieved; prior Claude and accepted ChatGPT evidence remains in its original columns.

Application validation must include ten Node suites, check.py, and affected citation/assumption propagation, canvas-to-SOW flow, totals and downloads. Local browser launch is blocked by the execution environment's socket restrictions. The test-only GitHub Actions workflow `Warroom review validation` now provides the permitted browser route on this work branch. Its baseline run is https://github.com/higdonfrancis-luna/warroom/actions/runs/42340198171 at c6a7ffbb42a2cd16ef775c5cfd96ea38762cfa77; record observed outcomes separately, never infer a pass from a scheduled run. The workflow has no deployment step.

The original import and source-cache handoff follows for provenance.

<!-- ORIGINAL CLAUDE HANDOFF -->
# Independent SOW citation review: handoff

Updated Nov 7 2026. Branch `claude/determined-brahmagupta-clez60`, started from audit commit `38f863f` (Adam's yes). Application snapshot under review: `abv-partner-plays` at `497dc76`, unchanged since the audit as of Nov 7.

## Where things stand

- **Stage 1, import: done** (commit `fc4f183`). ChatGPT's checkpoint-10 package is here, byte-for-byte unchanged (49 files). The 28 `original-generator/` files are byte-identical to `497dc76`, so they are not committed twice. `IMPORT_MANIFEST.json` lists every received file with its SHA-256. `python3 restore_original_generator.py` writes the 28 files back, so every package reference resolves and `verify_package.py` passes (checked).
- **Stage 2, independent review: prepared, not started.** The counts are still checkpoint 10's: 143 scope-reviewed and 135 pending (103 Concepts, 32 connections). The URL task ledger in `source-lookups.json` has 143 tasks: 18 closed, 27 partial, 1 conflict and 97 open. Eleven review agents were launched on Nov 7 and all of them stopped at once on the account's monthly spend limit, before writing any results. One family was then resumed and finished: **root** (Brand Visibility, search, CDN), in `cp11-work/results/root.json`. It covers 3 pending scope reviews (SD1, search-bv, cdn-bv), source checks for L01, L02, O01, O05 and O06 (settled positions kept), 7 proposed catalog edits, and 4 URL tasks closed plus 1 unreachable (the business.adobe.com product page). It is not yet merged into checkpoint-11 exports, so the official counts are still checkpoint 10's. The other 10 families remain: workfront, assets, commerce, cja, engage_1, engage_2, data_1, data_2, sites_1, sites_2.
- **Stage 3, implementation: not started.** No application code has changed. Nothing is deployed.

## What is ready in `cp11-work/`

- `pages_2026-11-07/`: full body text of all 299 URLs cited anywhere in the package, fetched Nov 7 2026. Line 1 of each file is JSON metadata: url, HTTP status, effective URL after redirects, and Adobe's "Last update" date.
  - `pages_index.json` maps each URL to its file. `urls.txt` is the full list.
  - 288 pages fetched cleanly.
  - Did not fetch:
    - business.adobe.com (3 pages) and the Brand Visibility security overview PDF on www.adobe.com: the connection failed.
    - helpx.adobe.com product descriptions (4 pages): refused automated access. They were not bypassed.
    - aem.live without www: blocked by this environment's proxy.
    - The Commerce Data Connection overview URL: 404.
    - One malformed URL (`.../advertising/{meta-ads`) from the original record text.
  - A few pages are naturally short (video pages).
- `tools/fetch.py <WORK>`: refetches pages into `<WORK>/pages` from `<WORK>/urls.txt`.
- `tools/packets.py <WORK> <this folder>`: builds one review packet per family from the package and the page cache. It uses `source-lookups.json` (the 143-task repaired ledger and the 133-entry record queue) as authoritative.
  - Families: workfront, assets, commerce, cja, engage, data, sites and root.
  - Then `tools/split.py <WORK>` splits data, sites and engage in two, keeping each connection's records together, for 11 packets.
  - All 135 pending records and all 125 non-closed URL tasks are covered.
- `REVIEWER_BRIEF.md`: the exact instructions each reviewer gets, with the output schema.
  - It separates scope review, the reviewer's own full-body evidence and ChatGPT's accepted evidence.
  - It carries the CP10 decisions forward (AWS, the Marketo route boundaries, the aemassets-workfront and enhanced-connector boundaries, AXA03, the English Brand Concierge body).
  - Rule: preserve settled decisions unless a primary page contradicts them.
- `tools/run_suites.sh <label>`: runs the 11 application test files for Stage 3 (`check.py` plus ten Node suites). Set `SUITE_OUT` for the log folder. Run it once on the untouched snapshot first, for a baseline.

## To resume

1. Make a work folder: `W=$(mktemp -d)`. Copy `cp11-work/pages_2026-11-07` to `$W/pages` and `pages_index.json` to `$W/`.
2. `python3 -I cp11-work/tools/packets.py $W .`, then `python3 -I cp11-work/tools/split.py $W`.
3. For each of the 11 packets in `$W/packets/`, a reviewer follows `REVIEWER_BRIEF.md` (replace SCRATCH with `$W`) and writes `$W/results/<family>.json`.
4. Merge the results into checkpoint-11 exports in `review-progress/`, beside the untouched CP10 files: the master CSV with `cp11_*` columns, the pending IDs, the record queue, the URL tasks and the counts JSON. Commit after each family.
5. Then Stage 3: apply the reconciled fixes to `sow/` on this branch in separate commits, and run the suites and `check.py`.

ChatGPT can do steps 3 and 4 from the same files. The page cache gives it the bodies Claude would have read, dated Nov 7.

## Read in this order

1. `RESPONSE_FOR_CLAUDE.txt`: ChatGPT's CP10 instructions.
2. `RECONCILIATION.html` and `checkpoint-10-proposed-wording.json`: the CP10 decisions.
3. `NEXT_BATCH.json`: the first source reads and the starting set of pending records.
4. `REVIEW_STATE.json` and `source-lookups.json`: the state of each record and URL. Read them by ID.
5. `review-progress/`: the five CP10 exports, unchanged.
