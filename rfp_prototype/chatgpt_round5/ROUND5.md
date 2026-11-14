# Round 5: RFI Builder reliability

Starting commit: `484f12a7` on `claude/amazing-volta-go9ton`. The audit's panel rated the original Briarhaven Word proposal 2/10. Its reader found 24 rows and retained only three printed references.

## Task 1: test pack and baseline

`make_fixtures.py` renders `fixtures_source.json` using ReportLab, python-docx and openpyxl. The 18 fictional procurements in `fixtures/` have 226 requirements, with one key each in `gold/`. The 12 PDFs include genuine cross-page continuations, two-column pages, numbered lists, tables and paragraphs containing several independent asks. The three Word files include native list numbering and a table. The three Excel forms use actual rows for the response cells. Separate extraction and inspection of the printed pages, Word numbering and workbook rows verified each question's text, order, reference, section and limit. Rebuilding reproduced the exact bytes of all 18 documents.

The supplied grader skipped text, section, limit and classification checks on missing references and could not match unnumbered asks. `check_reader.js` now compares these in document order, checks literal null limits, and requires complete coverage for the four fields. The eight checks per key use the same criteria before and after the reader work. The original reader passes **37 of 152 checks**.

| Key | Questions | Original rows | Before / 8 | After / 8 |
| --- | ---: | ---: | ---: | ---: |
| bellwater-city | 16 | 16 | 3 | 8 |
| bracken-pier-insurance | 14 | 14 | 3 | 8 |
| briarhaven | 32 | 24 | 0 | 8 |
| brindlewick-pharma | 12 | 12 | 4 | 8 |
| cedarspan-telecom | 12 | 12 | 1 | 8 |
| copper-mere-bank | 12 | 2 | 1 | 8 |
| copper_tide_media | 12 | 6 | 3 | 8 |
| elmglass_power | 12 | 6 | 2 | 8 |
| flintmere-software | 12 | 12 | 3 | 8 |
| kestrel_bend_university | 12 | 12 | 0 | 8 |
| lantern_cove_travel | 12 | 11 | 1 | 8 |
| larkspur-meals | 12 | 13 | 1 | 8 |
| marlow-motor | 12 | 12 | 3 | 8 |
| northmere_waterways | 12 | 12 | 2 | 8 |
| reedhaven-mutual | 13 | 2 | 1 | 8 |
| silverfen_health | 12 | 12 | 2 | 8 |
| snowcap-orchard-assurance | 12 | 13 | 0 | 8 |
| stoneford-valve-works | 13 | 13 | 3 | 8 |
| willow-quay-outfitters | 14 | 14 | 4 | 8 |

### Verification

Both prescribed Python builds passed. All 12 shared suites passed. Each later task reruns these suites.

- `test_rfp.js`
- `test_rfp_kb_round2.js`
- `test_rfp_part3.js`
- `test_rfp_round4_exclusions.js`
- `test_rfp_round4_sorting.js`
- `test_rfp_round4_subasks.js`
- `test_rfp_round4_tailoring.js`
- `test_rfp_round4_trimming.js`
- `test_rfp_step75.js`
- `test_rfp_step81.js`
- `test_rfp_step89.js`
- `test_rfp_step90.js`

No screen changes in this task.

## Task 2: reader, step 98

`sow/rfp_readers.js` groups PDF glyphs by physical line, removes repeated page edges, and reads table cells and page continuations in position. It distinguishes two-column prose from response tables. Word lists keep their native numbers and restart values. Excel sections include merged heading rows, and response records retain their worksheet coordinates. `sow/rfp_finder.js` preserves a numbered requirement as one response, splits independent unnumbered requests, carries headings and context, and calculates file, section and row limits. The pile classifier uses the actual procurement question and surrounding section. `sow/rfp_answers.js` uses the resolved budget and retains its historical fallback for older saves.

All 19 files scored **8/8**, up from 37/152 to **152/152**. All 258 requirements matched their wording, references, order, section, limit and pile. The browser also retained instructions and milestones as context. An independent check compared all 77 printed priorities in the tagged documents. The supplied Briarhaven PDF contains no printed priority values.

Both builds and the 12 shared suites passed. The additional suites `test_rfp_step50.js`, `test_rfp_step51.js`, `test_rfp_step52.js`, `test_rfp_context_sheets.js` and `test_rfp_step74.js` passed. The word-limit checks in `test_rfp_step67.js` also passed. No existing tests or screen layout needed changes.

## Task 3: complete Word proposal, step 97

`proposalAnswer` in `sow/rfp_answers.js` reads the current draft, approval and edit state. `contentOf` and the Word builder in `sow/rfp_proposal.js` use that answer, preserve typed lines, give uncoded asks a collision-free reference to replace, and route every row in RFI order. The matrix records both the original section and the actual destination or `To write`. The same path handles firm-only RFIs. An approved edit over its budget stops the download and identifies the row so the partner can shorten it without losing the text.

The original audited Word had two Adobe answers. After the reader repair and this export change the unmarked Briarhaven document contains all 24 available Adobe drafts, and its matrix includes all 32 requirements. A controlled approval run produces three answers: one approved draft, one edited response and one typed supplier response. The omitted row stays in the matrix. Across all 19 fresh RFIs the unmarked proposal routes 174 draft answers and accounts for all 258 requirements.

`test_word_complete.js` drives the actual approval and export controls, opens the downloaded DOCX and compares Word paragraphs and tables with screen choices. Both builds, that test, the 12 shared suites and all 152 reader checks passed. Two previous expectations in `test_rfp_step75.js` changed: a blank supplier placeholder is now `To write`, and a firm-only RFI can download a proposal. The updated checks inspect destinations and the actual firm-only Word document.

Screen observation for Claude and Adam: at the test viewport the download confirmation can cover the download menu until the partner closes it. The test uses the existing Close control.

## Task 4: service scope, proposal effort and client fit, steps 99 to 101

The audited bank proposal quoted 216 and 112 hours in individual answers while its services table showed 96. In `sow/rfp_answers.js`, `planningEffort` now selects catalog services for answered requirements and allocates each service once. `contentOf` and `validateEffort` in `sow/rfp_proposal.js` use that list for the cover, answers, services table and matrix, preserve monthly versus one-time units, and refuse to build an inconsistent Word file. The old five-product cap is gone.

The answer writer resolves a requirement's named products first and uses section products when a question names none. It drops prohibited products before selecting services and falls back to the named product's own build services. It checks source titles, URLs, licensing prerequisites, editable responses and output text against the client's scope. A conflicting partner edit is flagged before download. Briarhaven C.1 uses Forms, A.2 describes migration from Drupal, and D.3 uses Snowflake. The bank's four excluded products are absent throughout the Word package, including its links. The two shorter migration facts in `part3_research/statements.json` and derived `rfp_facts.json` preserve discovery, its source, and the estimate under the word cap.

`sow/rfp_finder.js` separates two adjacent unnumbered technical and commercial requests while retaining numbered multi-part requirements. `portableWork` and the save/restore matching in `rfp_ui.js` retain approvals and exclusions when saving and reopening partner work without disclosing the excluded names. An additional browser check saved and restored all 32 bank questions and matched decisions back to the original file.

The new `test_word_fit.js` uses the real Word download for Briarhaven, Copper Mere Bank, Lantern Cove Travel and Bellwater City. All 72 matrix rows passed scope and effort checks. Additional cases exercised both effort units, edited and omitted answers, and deliberately corrupted estimates that blocked export. Checks on the HTML downloads and Excel included Bellwater's filled response workbook. The source workbook was preserved. `test_word_complete.js` now exposes its downloaded file path for package inspection.

Both builds passed. The reader remained at **152/152** and all **34 browser suites** passed. In addition to the 12 shared suites and both Word suites, the other existing suites that ran were:

`test_rfp_bounded_exclusions.js`, `test_rfp_context_sheets.js`, `test_rfp_product_evidence.js`, `test_rfp_review_notice.js`, `test_rfp_step50.js`, `test_rfp_step51.js`, `test_rfp_step52.js`, `test_rfp_step53.js`, `test_rfp_step54.js`, `test_rfp_step55.js`, `test_rfp_step67.js`, `test_rfp_step69.js`, `test_rfp_step70.js`, `test_rfp_step72.js`, `test_rfp_step74.js`, `test_rfp_step76.js`, `test_rfp_step78.js`, `test_rfp_step79.js`, `test_rfp_step88.js`, `test_rfp_summary_bar.js`.

Changes to previous expectations are limited to these checks:

- `test_rfp.js` and `test_rfp_step54.js` check the actual license prerequisite without promising to quote it. Steps 54 and 67 now verify which optional ask was removed and which previously omitted ask fits once the required planning estimate is included in the budget.
- `test_rfp_kb_round2.js` requires Cedar's experimentation method while excluding its declined product. Step 75 checks the bank's declined product is absent even from the scope summary.
- Steps 67, 69 and 76 check a concrete consent acceptance test in place of an unverified guarantee. `test_rfp_round4_sorting.js` adds a technical and a supplier question sharing one uncoded line.

No screen layout or controls changed in this task.
