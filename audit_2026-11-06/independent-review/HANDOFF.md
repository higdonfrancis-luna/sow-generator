# Independent SOW citation review: handoff

Branch `claude/determined-brahmagupta-clez60`, started from audit commit `38f863f` (Adam's yes, Nov 7 2026). Application snapshot under review: `abv-partner-plays` at `497dc76` (unchanged since the audit as of Nov 7).

## Where things stand

- **Stage 1, import: done.** ChatGPT's checkpoint-10 resume package is here, byte-for-byte unchanged (49 files). The 28 `original-generator/` files are byte-identical to `497dc76` and are not committed twice; `IMPORT_MANIFEST.json` lists every received file with its SHA-256, and `python3 restore_original_generator.py` writes the 28 back so every package reference resolves and `verify_package.py` passes.
- **Stage 2, independent review: starting from checkpoint 10.** 143 scope-reviewed, 135 pending (103 Concepts, 32 connections). URL task ledger: 143 tasks (18 closed, 27 partial, 1 conflict, 97 open). Zero Claude full-page reads in CP10.
- **Stage 3, implementation: not started.** No application code changed.

## Read in this order

1. `RESPONSE_FOR_CLAUDE.txt`: ChatGPT's CP10 instructions.
2. `RECONCILIATION.html` and `checkpoint-10-proposed-wording.json`: CP10 decisions.
3. `NEXT_BATCH.json`: first source reads and the starting set of pending records.
4. `REVIEW_STATE.json` and `source-lookups.json`: per-record and per-URL state; read by ID.
5. `review-progress/`: the five CP10 exports, unchanged. Later checkpoints go in new files beside them.

## Rules kept from the package

- Scope review, Claude's own full-page evidence and accepted ChatGPT evidence stay in separate fields.
- Settled corrections stay unless new primary-source evidence contradicts them; any change records the evidence and reason.
- Partner hours, rates and quantities are partner estimates, not Adobe claims.
