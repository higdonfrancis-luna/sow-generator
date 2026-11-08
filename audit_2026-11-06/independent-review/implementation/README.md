# Reconciled citation implementation

The checkpoint-11 review is implemented on `claude/determined-brahmagupta-clez60`.
The immutable proposal contains 338 field amendments across 142 of the 278 reviewed
records. Review/import history and the received checkpoint exports are preserved.

`sow/apply_review.py` applies the template decisions to `sow/index.html` and retains
previous template defaults in `PRIOR_REVIEW`. The canvas builder applies concept and
connection amendments from the same manifest after assembling the original research
inputs. Input drift fails the build instead of silently overwriting a new decision.

Rebuild from the repository root:

```sh
python3 sow/apply_review.py
python3 sow/canvas/build.py
python3 sow/build_site.py
python3 sow/qa/check_citation_review.py
```

The generated pages remain self-contained. Their citation renderer is authored in
`sow/references.js` and inlined by the canvas builder. Supporting references are
expandable on cards and retained in handoffs, saved drafts, CSV and downloaded SOWs.
The printed/downloaded SOW lists its capability references in each service.

Opening an older draft refreshes unedited template/concept defaults and current
capability references. Partner-written scope, deliverables, acceptance, exclusions,
hours and rates are preserved. A partner note appended to an older concept
prerequisite is retained after the updated prerequisite text.

All 203 service estimate bands and cadences are unchanged. The 159 service concepts
keep their Concept treatment and completion requirements. Main, the application
branch and the original audit branch are not updated by this work.

Validation evidence belongs beside this file. A queued/running browser workflow is
not a passing result. Merging and deployment require Adam's later instruction.

## Observed validation

All 13 suites passed on application/test commit
`44e27b10e82be5fd15bdf12f86cae5cce6849cd3` in
https://github.com/higdonfrancis-luna/warroom/actions/runs/42450957543.
`browser-validation.json` records the exact suite exit codes and durations.
`local-validation.json` records manifest, estimate, migration, safe-reference,
optional-product-context, contract-wording, CSV and repeat-build checks.

The older baseline's waiting-card height failure was fixed by adjusting note line
height while keeping its full-width layout and readable text. Original citation
checks were updated to include expandable supporting links. Contract-prose checks
exclude quoted documentation titles and accept the official bring-your-own Git
term. Draft history checks now require unedited older scopes to refresh when the
draft opens. Existing navigation, totals, saved-work, containment and PDF checks
remain in the passing run.

The final follow-up commit contains documentation/evidence only. No merge or
deployment was performed.
