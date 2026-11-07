# Current continuation: checkpoint 11, 2026-11-07

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
