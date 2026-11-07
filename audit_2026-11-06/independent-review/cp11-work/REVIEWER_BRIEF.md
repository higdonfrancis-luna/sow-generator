# Brief: independent citation review, one family

You are one of eight reviewers finishing an independent review of a citation audit of a partner SOW generator (Adobe partner services catalog). ChatGPT audited all 278 records (203 services, 75 connections). A first Claude review settled 143; you finish your family's share of the remaining 135 and close the open source checks. Read-only on the repository: do NOT edit anything under /home/user/warroom. Write only your results file.

## Files (R = /home/user/warroom/sow/audit_2026-11-06/independent-review)

- Your packet: `SCRATCH/packets/<family>.json`. `records[]` holds every record for you, with `work` = `scope_review_and_source_checks` (pending; full review) or `source_checks_only` (scope already settled; only close its source tasks). Each record carries the catalog record, the cited URLs with a cached page file for each, the original audit (`original_audit`: verdict, priority, finding, gaps, exact_fix, recommended_sources), the checkpoint-10 master row (`cp10_master_row`: latest position/verdict/priority/correction and history), the queue entry (`cp10_queue`: open/partial URLs and notes) and `review_state`. `url_tasks[]` are the source tasks you must close, each with `cached_page` and any `cp10_first_source_read` instructions (sections to read).
- Cached pages: `SCRATCH/pages/<hash>.txt`. Line 1 is JSON metadata (url, http, effective_url, last_update = Adobe's "Last update", title); the rest is the full page body text fetched Nov 7 2026. `SCRATCH/pages_index.json` maps URL to hash. Use `grep`/`sed` on them; don't load giant pages whole if you only need a section.
- If you need an Adobe page that is not cached (for example a recommended source, or a page that a cached page points to for a prerequisite), fetch it: `curl -sSL -A "Mozilla/5.0" <url> -o SCRATCH/extra_<family>/<name>.html` and strip tags. Experience League and www.aem.live work. helpx.adobe.com legal pages and business.adobe.com refuse automated access: record them as `unreachable`, never try to get around a block.
- Rules and decisions you must respect: `R/RESPONSE_FOR_CLAUDE.txt` (read first, short), `R/checkpoint-10-proposed-wording.json`, and earlier accepted amendments in `R/previous-reconciliations/` (`checkpoint-5-bv-bc-proposed-wording.json`, `checkpoint-6-XA10-proposed-wording.json`, `checkpoint-7-corrections.json`, `checkpoint-8-proposed-wording.json`, `checkpoint-9-proposed-wording.json`). `grep` them for each of your record IDs; an accepted amendment that corrects or withdraws an original audit recommendation wins over the original audit.
- How the catalog works (field meanings: `scope`, `assume`, `needs`, `availability`, `flows`, `gain`; Concept vs SOW template; inherited connection qualifications): `R/original-review-package/warroom-sow-claude-review-2026-11-06/README_FOR_CLAUDE.md`.

## What to do for each pending record (scope review)

1. Read the catalog record and its parent connection (for Concepts, the connection's `needs`/prerequisites are inherited; a Concept does not have to repeat them).
2. Read the cited page bodies (and the audit's recommended sources). Identify each material Adobe claim: capability, prerequisite, limitation, availability, flow direction.
3. Decide whether the original audit is right: `Agree`, `Partly agree` or `Disagree`. Challenge it where it is too strict or wrong, and look for problems it missed.
4. Give the current verdict using the audit's scale: `Direct support`, `Partial support`, `Background only`, `No supporting source found`, `Unable to verify`; and a priority `none|low|medium|high` (high = SOW promises something Adobe doesn't do or misses a blocking prerequisite; medium = material qualification or citation gap; low = wording or better-citation only).
5. If a fix is needed, give the exact correction: which field, current text, proposed text, and source URL(s). Keep fixes minimal. Prefer the audit's `exact_fix` when it is right; amend it when it isn't.

## Rules (from the package; non-negotiable)

- Adobe docs substantiate capabilities and prerequisites. Partner hours, rates, quantities and delivery methods are partner estimates; never mark them unsupported.
- The Concept label is accepted. Concepts inherit published connection qualifications.
- Do not infer GA from missing Beta wording. Do not invent universal Adobe approval gates. Do not apply one route's restriction to an unrelated route (e.g. destination dedup rules are not source-ingestion rules).
- Preserve settled decisions (anything in `cp10_master_row.current_*` for reviewed records, and the accepted amendments) unless the primary page you read contradicts them; then record the quote, the URL, the page's last-update date and why in `settled_change`.
- Only claim what you read. For each piece of evidence say whether it came from the full cached body. Never relabel ChatGPT's checks as yours.
- No em dashes or en dashes in any proposed catalog text (use commas, colons or "to").

## Source tasks

For each `url_tasks[]` entry: read the cached body (the named sections when given), check each claim it supports for each listed record, and set `new_status`: `closed` (full body read and every mapped claim resolved), `partial` (body read but a mapped claim needs another page you could not reach), `conflict` (body contradicts the catalog or a settled decision; explain), `unreachable` (page could not be retrieved). A redirect to a new canonical page is fine: note the effective URL.

## Output

Write `SCRATCH/results/<family>.json` (valid JSON, check with `python3 -c "import json;json.load(open(...))"`):

```
{"family": "<family>",
 "records": [{"id": "", "entity_type": "service|connection", "work": "scope_review|source_checks_only",
   "scope_review": "complete|pending", "pending_reason": "",
   "position": "Agree|Partly agree|Disagree", "verdict": "", "priority": "none|low|medium|high",
   "correction": "one or two sentences, plain, what should change (empty if none)",
   "catalog_edits": [{"field": "scope|assume|needs|availability|src|url|source2|how|gain|flows[i].needs|...", "current": "exact current text", "proposed": "exact new text", "sources": ["url"], "reason": ""}],
   "evidence": [{"url": "", "effective_url": "", "last_update": "", "sections": "", "depth": "full-body", "claim": "", "result": "supports|partly|contradicts|silent", "quote": "exact quote, 30 words max"}],
   "settled_change": null,
   "notes": ""}],
 "url_tasks": [{"url": "", "new_status": "closed|partial|conflict|unreachable", "last_update": "", "sections_read": "", "claims": [{"record": "", "claim": "", "result": "supports|partly|contradicts|silent", "quote": ""}], "remaining": ""}]}
```

Every pending record in your packet and every url_task must appear exactly once. For `source_checks_only` records, include them in `records` with `work: "source_checks_only"`, keep `position/verdict/priority` equal to the settled `cp10_master_row.current_*` values unless `settled_change` explains otherwise, and add only evidence.

When finished, reply with: counts (records reviewed, verdict changes vs original audit, edits proposed, url_tasks by new status), the three most important findings, and anything you could not resolve. Keep the reply under 300 words; the detail goes in the file.
