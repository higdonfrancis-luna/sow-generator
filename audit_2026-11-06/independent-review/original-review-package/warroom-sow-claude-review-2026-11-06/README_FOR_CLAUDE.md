# Independent review of the Warroom SOW citation audit

## Your task

Independently check whether the Adobe documentation linked from the SOW generator substantiates the services and connections being recommended. Then challenge the accompanying audit's findings and proposed fixes. Do not assume that either the generator or the audit is correct. This is a review request; do not implement changes or deploy the application.

The user accepts the **Concept** label. Leave it unchanged. The question is whether the citations support the actual product capabilities and service scope, not whether every service is an Adobe-authored commercial offering.

## Snapshot and scope

- Repository: `higdonfrancis-luna/warroom`
- Application branch: `abv-partner-plays`
- Application commit: `497dc76691964ca5997561084fd81066acf96cba`
- Audit commit: `38f863ffe09109a07d589fcc242f4213a18a82f5`
- Audit date: November 6, 2026 (UTC)
- Expected coverage: 203 distinct services, including 159 Concepts and 44 SOW templates; 75 connection records; 190 distinct original citation URLs.
- The canvas contains 201 services. The SOW catalog adds `CW00` and `X01`. Do not count the same service twice when it appears in both places.
- The audit also records 85 additional supporting or replacement URLs, for a 275-URL source ledger.

Use the packaged source as the original version being judged. A live website or current branch may have changed. Historical README entries describe earlier builds and counts; derive current coverage from the supplied source and the snapshot manifest.

## Read these files

1. `original-generator/sow/canvas/catalog.json`: the complete authored canvas catalog, service definitions, connection prerequisites, flow directions and source links.
2. `original-generator/sow/index.html`: the SOW catalog and the code that turns services into scope, deliverables, acceptance criteria and assumptions. Distinguish current definitions from old wording retained for saved-draft migration.
3. `audit-results/sow-citation-audit-data.json`: all 278 review rows, original records, current citations, evidence summaries, recommendations and source retrieval status. This is the audit to examine, not independent proof.
4. `audit-results/FINDINGS.md`: the audit's executive summary.
5. `audit-results/sow-citation-audit-report.html` and `audit-results/sow-citation-audit.xlsx`: alternative ways to navigate the same findings. You do not need to read all three representations separately.

The package is a focused copy of the SOW source, build inputs and compiled site, not the whole Warroom repository or its history. No audit fixes have been applied to the application.

Use `SNAPSHOT.json` to verify the included files against their repository commits. You can run `python3 verify_package.py` from this folder; it only reads the package and checks hashes, inventory and citation coverage. The two exact repository files have these SHA-256 hashes:

| File | SHA-256 |
|---|---|
| `sow/index.html` | `74f4e563882198e5eb8c042ebe429ad5ad0cb5055dbc8a681f241d43c3b0ff1d` |
| `sow/canvas/catalog.json` | `a17b0b8a7654d169b4647e748baf67bc768aa81b2b41cf461be1d6682c77da06` |

### A provenance detail

The final audit JSON records SHA-256 hashes for its downloaded working copies of the two core source files. Each working copy contains one extra final newline compared with the exact GitHub file. The package includes the exact GitHub bytes, so those two hashes differ. `SNAPSHOT.json` records both hashes and the relationship; `verify_package.py` checks it. The parsed data and application logic are unchanged. The four audit deliverables are preserved byte for byte from the published audit commit.

### Optional supporting files

- `review-inputs/original-records.json` is a convenient extraction of all original service and connection records. It has been compared with the pinned application source. It is a reading aid, not an independent replacement for the source.
- `review-inputs/original-citations.json` maps the 190 original URLs to record IDs.
- `original-generator/sow/canvas/research/`, `catalog_map.json`, `problems.json`, `template.html` and `build.py` show how the canvas is assembled. Original research notes are claims to check, not independent proof.
- `original-generator/sow/site/` contains the original compiled two-page website. No rebuild is required for inspection. A local web server rooted in that directory preserves the relative navigation between the canvas and SOW steps. Application browser behavior has not been newly certified by this handoff package.
- Original SOW README files provide development history. Some historical counts and deployment notes are outdated; the pinned catalogs are authoritative for this review. Historical patch scripts, old audit caches and unrelated Warroom material are omitted.

## How to review

Read the original record and its qualifications before accepting the audit's conclusion. Assess the current attached citations as one source set, including supporting links and `flows[*].source.url`. A top-level link alone may not describe the complete evidence attached to a connection.

For every record, check the material claims: product, capability, integration direction, implementation route, deliverable, prerequisite, edition or entitlement, and any automation or availability promise. A working link, matching title or general product overview is not sufficient when the service promises a specific implementation.

Keep two questions separate:

1. Does the **original citation set** support the original record as scoped?
2. Do the **proposed citations and wording changes** resolve the identified gap without inventing a requirement or unnecessarily narrowing a legitimate service?

A better proposed link does not retroactively make the original citation sufficient. Conversely, a weak link does not establish that the underlying capability or service is invalid. Read `exact_fix` before interpreting `recommended_sources`; a recommended URL can be a supporting addition rather than a replacement for every existing citation.

Open the primary Adobe sources yourself when browsing is available. Record the URL, page title, relevant section, access date and a short explanation of what it supports. The audit's internal `ref_id` and `web_refs` values are not portable citations; use the actual URLs and stable source IDs. Distinguish documentation changes since November 6 from errors in the original audit when dates can be established.

If you cannot browse or a source is inaccessible, say so. You can still review source-to-audit consistency, coverage and logic, but cannot certify the live documentation independently. Retrieval failure does not prove a capability is absent or that a specific page requires a particular login, agreement or entitlement.

## Judgment rules

- Credit qualifications already present: pilots, manual processes, limited availability, tenant confirmation, customer dependencies and `no_services` flags.
- Hours, prices, quantities and recurring cadence are partner estimates. A capability citation does not certify them. Assess whether the work is plausible and accurately described, without demanding Adobe documentation for the partner's rate or consulting method.
- Ordinary advisory, training and change-management services need honest provenance, not an invented product citation or blanket Adobe written approval.
- Check product variants, current versus legacy terminology, licensing assumptions and integration directions. Do not equate a marketing integration page with an implementation guide.
- Some offerings legitimately need multiple citations. Do not force compound scope behind one generic link.
- The audit's verdicts and priorities are proposals. Disagree with them when evidence warrants it, and explain the practical consequence.

## Cases that warrant particular scrutiny

Start with `CJ04`, `A05`, `XA03` and `aemsites-bv`, then continue through all 278 records. Include rows the audit marks Direct support so the review can detect omissions as well as false positives.

- `CJ04`: distinguish browser Analysis Workspace projects from mobile Analytics dashboards scorecards. Do not add mobile delivery unless explicitly scoped.
- `A05`: independently check agent access, policy setup and the supported authoring workflow. The final audit explicitly acknowledges both AEM as a Cloud Service and Edge Delivery Services; it does not impose a blanket AEM Cloud authoring requirement on all EDS work.
- `XA03`: check current Journey Optimizer Decisioning versus legacy Decision Management terminology and the separate behavioral-recommendation pattern.
- `aemsites-bv`: the automatic telemetry claim depends on a PDF the audit could not retrieve. The audit treats that claim as unverified, not disproved.
- `XA21`: credit the existing Commerce pilot qualification; check whether Target Premium is being required unnecessarily for ordinary tests.
- `XA08` and `rtcdp-bc`: distinguish separately licensed event collection and profile mapping from the qualified Limited Availability context route. Do not introduce a universal written-approval requirement for all downstream uses.
- `X01` and `ajo-bc`: the former is partner advisory work; the latter already withholds implementation services. Check that the audit's labels and priorities do not imply otherwise.

These points explain the final audit's reasoning; they are not instructions to agree with it.

## Requested output

Return an independent review with a row for every record:

| Type and ID | Agree / disagree / partly agree / unable to verify | Your support verdict | Your priority | Evidence URL and section | Reason | Corrected wording or citation, if needed |
|---|---|---|---|---|---|---|

Summarize material disagreements, new issues the audit missed, proposed fixes that do not solve the gap, and unresolved documentation conflicts. State exactly how many records and URLs you independently checked, and how many remain unverified. Distinguish the number of records from the number of unique URLs.

If context or tool limits require batches, keep a checkpoint keyed by record type and ID and continue until all 278 records are accounted for. Do not describe a sample or a review of only flagged rows as a complete independent audit.

## Working with the package in Claude

If the interface accepts ZIP archives and can read extracted files, upload the ZIP and begin with this README. If it does not, unzip it locally. First attach this README, `audit-results/FINDINGS.md`, `audit-results/sow-citation-audit-data.json`, `original-generator/sow/canvas/catalog.json` and `original-generator/sow/index.html`. If the interface cannot read HTML source, attach `review-inputs/original-records.json` as a convenient text-data substitute and disclose that the original HTML has not yet been inspected. Additional source files can be attached as needed.

Do not load every duplicate representation into one context. Use the JSON for detailed review, the HTML report for visual navigation or the workbook for filtering. Work by record ID in manageable batches. A live site can supplement UI inspection, but it is not proof that the deployed version matches this snapshot and it may conceal optional or conditional records.
