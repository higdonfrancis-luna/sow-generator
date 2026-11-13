# Round 4: Tasks 8 through 11

On the four seen RFIs, method coverage rose from **56/74 to 67/74**. Fresh paired blind scores rose from **5.33 to 5.73/10** on the original 55 questions, and from **4.45 to 5.46/10** on the expanded 69-question implementation set. Eleven answers scored lower than their Round 3 predecessors. This is an improvement with material remaining gaps, not evidence yet of performance on an unseen RFI.

Work branch: `chatgpt/kb-round2`. Starting application state: `100fc7cfa318d537a2f673b24998993f6914d48a`, already containing Claude `759b4b357b488f3ce657602ea21e624d95bf4f25`. The latest Claude branch was checked before work and was already merged.

The third RFI and its key were not opened or evaluated. Task 12 was not performed. No site deployment or AI-worker change was made.

## Diagnosis

`ROUND4_DIAGNOSIS.md`, `ROUND4_DIAGNOSIS.json` and `round4_baseline_trace.json` cover all 74 target implementation requirements: 55 previously scored, 18 without a method answer, and one answered but not scored. The browser reproduced all 56 existing keyed method answers byte for byte and all 18 missing answers. There were no page errors.

The summed positive AI gap was 146.25 points. The attributed shares were sub-asks 57.41875, lead selection 44.88125, tailoring 19.5875, trimming 16.31875 and exclusions 8.04375. These are analyst allocations of observed gaps, not causal estimates. Sorting had no scored cost because omitted answers were absent from the old panels. Cedar B.6 already beat the AI in the baseline. Its native approval lead remains, but the fresh judge penalized the added supporting work; that regression is reported below.

## Changes and commits

| Commit | Files and functions | Change and reason |
| --- | --- | --- |
| `5dbee7e` | `ROUND4_DIAGNOSIS.md`, `.json`, `round4_baseline_trace.json` | Record every scored requirement and missing method answer, reproduce the page behavior, and distinguish missing content from fitting losses. |
| `cfab5d0` | `sow/rfp_answers.js`: `scan`, `detectAll`, `scopeEvidence`, `compose`; `sow/rfp_finder.js`: final classification pass | Recover unnamed implementation requests only from strong service/topic evidence within the RFI's named products. Preserve firm, security and fact-shaped questions and avoid reading a previous document's scope. |
| `d994ffd` | `sow/rfp_answers.js`: `kbProhibited`, `kbExclusions`, `kbPermitted`, `kbAllowedMatch`, `kbChoices`, plus selection and rendering callers | Honor product and category prohibitions, including dependencies and alternative prerequisites. Missing ownership is not a prohibition. Credential/access requirements, positive coordinated clauses, product lists and third-person refusals have regression coverage. |
| `8d69af1` | `sow/rfp_answers.js`: `fitMethodAnswer`, knowledge-base branch of `written` | Rank method evidence against the request before removing lines. Keep effort, prerequisites, licensing, laws and explicit milestones; remove repeated background and redundant cross-references first. The saved AI fitting branch is unchanged. |
| `b55a18c` | `sow/rfp_answers.js`: `rfiMilestones`, `rfiLaunch`, `phaseLine`, `factOfSentence`, `backgroundOwners`, `toldUs` | Use approval, pilot and main-launch milestones at the precision supplied. Retain concrete client facts while dropping generic goals and request echoes. Invalidate caches on background edits and identical-document reopening. |
| `7bfa04d` | `panel_build.py`, `capture_coverage.js`, `aggregate_round4.py` and their tests | Preserve the old default panel behavior, expose missing responses, distinguish implementation requirements from security questions, and aggregate paired scores on fixed cohorts. |
| `c833354` | `sow/rfp_answers.js`: `connectionFits`, `kbDirectionalMatch`, `byPhrases`, `kbPlan`, `methodItems`, `method`; `phrases_batch_90.json` | Favor the requested lead, admit supporting work with service-specific evidence, preserve implementation steps from multiple relevant services, and include their sources. Respect cadence and connection direction without adding optional neighboring services. Reject unsupported reverse routes, while preserving multi-leg supported routes. |
| `c85e13e` | `sow/rfp_answers.js`: `scopeEvidence`, `compose`, `kbDraft`; exclusion regression suite | Recover an allowed service for one explicitly named product after excluded connections empty the match. Keep the stronger threshold for unnamed work and multi-product requests. Prevent a product prohibition from triggering an unrelated licensing fact sheet. The unsupported Journey Optimizer/Brand Concierge pair still produces no draft. |

No catalog, AI-worker or other site-page source was changed. Methods still draw their implementation statements from existing service-owned entries. New phrases describe general requests, not client names or requirement references.

## Verification

Every implementation commit was built with:

```sh
python3 sow/canvas/build.py && python3 sow/build_site.py
```

Every required JavaScript suite was then run: all `sow/test_rfp*.js` and `sow/test_step91.js`. Each commit's build output and per-suite exit codes are retained under `test_logs/`.

| State | Required suites | Result |
| --- | ---: | --- |
| Reproduced baseline | 24 | All passed |
| Sorting | 25 | All passed |
| Exclusions, including review regressions | 26 | All passed |
| Trimming | 27 | All passed |
| Tailoring, including identical-document reopening | 28 | All passed |
| Lead selection and supporting methods | 29 | All passed |
| Final permitted-service recovery | 29 | All passed |

Additional measurement checks: six `test_panel_build.py` tests and eight `test_aggregate_round4.py` tests passed. Default panels and keys were byte-identical to the old builder for all four known RFIs. The tests reject duplicate or missing references, invalid numeric scores and a shrinking original cohort.

The new focused browser suites cover sorting (20 checks), exclusions (33 after the final recovery cases), trimming (17), tailoring (20) and lead/sub-asks (17). Two existing Round 2 assertions changed, with explanatory comments: a repeated Snowflake background opener is optional if the source remains in the substantive answer; an accessibility answer must retain WCAG 2.2 AA without requiring an echoed opener. Their content safeguards remain.

One Step 72 status assertion initially raced its fixed 500 ms wait while browser measurement ran concurrently. Its printed failure detail already showed the eventual expected status; an isolated rerun passed. The test now waits for observable AI-reading completion, with an explanatory comment, before the unchanged exact status assertion. The subsequent complete 29-suite run passed. No application change was made for this timing issue.

The environment used Playwright with Chromium 153 headless shell. The ordinary Chromium binary could not start under this runtime's restrictions; the headless binary ran inside the same sandbox. Missing baseline fixtures were restored to the repository's exact versions, including the pinned security PDF, before baseline checks passed. No fixture change is part of these commits. Tests block the live AI-writing endpoint.

## Blind measurement

Runtime source was frozen at `c85e13e664ed3ecedb9287a356c98320f622bb0e`. `eval_answers.js` was rerun on all four prescribed files. Four-arm panels were built in `scores_round4/`: saved AI writing, Round 4 no-AI, saved Round 3 no-AI, and the current catalog path. A no-AI arm uses its recorded method answer, else its recorded catalog fallback, else an explicit missing-answer marker.

Four new judge conversations, each started without parent history, read only their assigned panel. They did not read source code, answer keys, prior scores or answer-source files. They used the Task 2/4/6 rubric, 1 to 10, with a missing response receiving 1. There is one judge per RFI, so these are subjective text evaluations, not a new technical product audit or a statistical confidence estimate. No implementation changes were made after these panels were frozen.

The primary comparison rescored the same **55 original references** with the same fresh judge evaluating both old and new answers. The expanded comparison contains **69 actually AI-written implementation requirements**, including previously missing no-AI answers. The two extra AI-written security questions in the 71-row AI population are tracked separately for coverage and excluded from implementation scoring. All 276 answer scores were validated before unblinding.

### Same 55 questions, paired fresh judging

| RFI | Questions | AI | Round 3 rescored | Round 4 | Change | Catalog |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Cedar | 24 | 7.46 | 5.58 | 5.77 | +0.19 | 4.00 |
| Tallgrass | 14 | 7.46 | 6.68 | 7.07 | +0.39 | 3.89 |
| Vennor | 8 | 7.44 | 4.62 | 5.56 | +0.94 | 4.06 |
| Virelune | 9 | 6.50 | 3.17 | 3.67 | +0.50 | 2.61 |
| **Pooled** | **55** | **7.30** | **5.33** | **5.73** | **+0.40** | **3.75** |

On this set, Round 4 won 24 comparisons, tied 20 and lost 11. Its mean still trails the AI by 1.57 points.

### Expanded implementation set, including absent answers

| RFI | Questions | AI | Round 3 rescored | Round 4 | Change | Catalog |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Cedar | 24 | 7.46 | 5.58 | 5.77 | +0.19 | 4.00 |
| Tallgrass | 14 | 7.46 | 6.68 | 7.07 | +0.39 | 3.89 |
| Vennor | 16 | 6.72 | 2.81 | 5.19 | +2.38 | 3.28 |
| Virelune | 15 | 6.97 | 2.30 | 3.77 | +1.47 | 2.50 |
| **Pooled** | **69** | **7.18** | **4.45** | **5.46** | **+1.01** | **3.49** |

This set has 34 wins, 24 ties and 11 losses. Pooled means give each requirement equal weight. Equal-RFI means, paired per-question differences and every judge's reason are retained in `scores_round4/results.json`. Changing the denominator changes the mean; the expanded overall score must not be compared directly with the historical complete-case average.

### Historical Round 3 scores, for context only

The earlier four-judge averages were Cedar 5.02, Tallgrass 6.00, Vennor 3.97 and Virelune 2.44 for the method path. Their corresponding AI means were 7.45, 7.63, 7.31 and 6.58. Those historical judges differ from this round's fresh judges. The paired tables above are the before/after comparison; subtracting historical averages from new averages would mix judge effects with implementation effects.

## Coverage

| RFI | Fixed implementation denominator | Round 3 methods | Round 4 methods |
| --- | ---: | ---: | ---: |
| Cedar | 24 | 24 | 24 |
| Tallgrass | 14 | 14 | 14 |
| Vennor | 18 | 8 | 15 |
| Virelune | 18 | 10 | 14 |
| **Total** | **74** | **56 (75.7%)** | **67 (90.5%)** |

Cedar and Tallgrass use their fixed 24- and 14-question implementation panels. Vennor and Virelune use their independent authored keys, each with 18 Adobe implementation requirements. Raw reader totals also contain non-implementation questions and unnumbered background rows; they are not the denominator above. The old statement that Virelune had 21 Adobe questions mixed a different AI-run population with implementation requirements.

Thirteen previously missing method answers were recovered. Two previously produced but misleading methods were withdrawn: Virelune A.5 depended on the excluded asset product, and B.6 used the warehouse connection in the wrong direction. C.1 now uses the permitted Target method TG03. This yields the net gain of eleven methods. All 67 covered implementation requirements have a method answer; no unrelated fact fallback is counted as recovered coverage.

The original 55-question set now has 53 method answers because it includes those two withdrawn responses. The 69-question expanded implementation set has 63 method answers, versus 55 before. All numbered method texts from the independent coverage capture exactly match `eval_answers.js`. Every generated method answer with a stated limit fits it, including the three unnumbered rows in the raw output: 70 word-limit checks passed. `scores_round4/verification.json` records these checks and hashes the frozen panels and outputs.

### Seven requirements still without a method

| RFI / ref | Remaining gap |
| --- | --- |
| Vennor D.2 | Anonymous visit through enquiry to Salesforce outcome, with Snowflake and identity ambiguities: no matching scoped method. |
| Vennor E.2 | Mobile page performance, launch load and stale safety information while retaining Akamai: still in To sort. |
| Vennor E.4 | Practical author/reviewer/operator readiness: still in Your firm under the conservative firm guard. |
| Virelune A.2 | Drupal content inventory, migration rehearsals and reconciliation: no permitted replacement method for the matched migration route. |
| Virelune A.5 | Downloadable documents without a new asset-management license: the excluded Assets method and unrelated licensing fallback are withheld. |
| Virelune B.2 | Forms to Dynamics 365 with duplicates, failures and submission investigation: no matched delivery method. |
| Virelune B.6 | Website/form/signing measures out to Snowflake for Power BI: no documented outbound route in the matched methods. |

## Limits and remaining work

The four measured RFIs informed diagnosis and fixes, so this round cannot establish generalization. The separately committed third RFI remains unseen for Task 12, which was not performed.

The fresh judges found eleven regressions:

| RFI / ref | Round 3 rescored | Round 4 | Change |
| --- | ---: | ---: | ---: |
| Cedar B.6 | 7.5 | 5.0 | -2.5 |
| Cedar D.1 | 6.5 | 4.0 | -2.5 |
| Vennor B.1 | 5.0 | 3.0 | -2.0 |
| Virelune A.1 | 4.5 | 3.0 | -1.5 |
| Virelune A.5 | 2.5 | 1.0 | -1.5 |
| Cedar B.2 | 7.0 | 6.0 | -1.0 |
| Cedar C.1 | 5.5 | 4.5 | -1.0 |
| Cedar D.3 | 5.5 | 4.5 | -1.0 |
| Virelune B.6 | 2.0 | 1.0 | -1.0 |
| Tallgrass B.5 | 8.0 | 7.5 | -0.5 |
| Vennor D.3 | 6.5 | 6.0 | -0.5 |

The largest quality risk is still selection of adjacent work. Cedar B.6 retains SI07 as its lead but expands to five services, diluting the native approval method. Cedar D.1 admits Concierge work beside CJA connection/stitching; Vennor B.1 admits the SI09 ERP feed beside asset migration; Virelune A.1 still leads with instance access/setup instead of the requested site-design decisions. Cedar's brand-visibility and Salesforce answers also carry neighboring work. These are visible in the saved service lists and the judge reasons. They were not retuned after blind scoring. The A.5 and B.6 score drops partly reflect replacing misleading answers with explicit absences, a deliberate constraint correction rather than a claimed content improvement.

Source-owned method selection does not create procedures absent from the evidence. Applicant identity/account recovery, explicit duplicate/superseded-document policies and detailed leaver handling still need reviewed partner practices. Deliverables named in a response can also exceed the method's actual procedural detail. No unsupported native connector, identity-recovery feature or automated deduplication claim was added to fill these gaps.

The sorting guard remains conservative, as Vennor E.2 and E.4 demonstrate. The raw reader can still produce unnumbered draft rows. The catalog, factual source coverage, AI worker and other site pages were left unchanged. The report and all per-question results expose these limits for Claude's review; no deployment was performed.
