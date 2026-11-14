ROUND 5B DONE

ROUND 5 DONE

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

## Task 5: blind Word review

Three independent simulated procurement evaluators each received only one issued RFI and four anonymous Word files. The files came from the ordinary Word download control following a fresh upload, with no partner edits, approvals or invented supplier details. Briarhaven tested a coded PDF, Copper Tide Media Guild tested an uncoded PDF, and the City of Bellwater Sound tested an Excel response form. The original exports in `blind/` are unchanged. The four application snapshots and their assets matched their respective Git commits.

A separate draw shuffled A through D for each client. We saved all 12 overall scores and rationales, 72 criterion scores and 240 individual requirement ratings in `judge_round5.json` before reading `blind/version_key.json`. The SHA-256 of the sealed scores was `a5102b5530b7fb41227c4763703570c4399dc62af076538293102e8a842c9314`. Each overall score is the evaluator's judgment, not the average of the six criterion scores. Each row below gives the original blind label and score out of 10.

| Issued procurement | Before, 484f12a | Reader, ca012d9 | Word, 133a9b4 | Scope and effort, 8b06916 |
| --- | ---: | ---: | ---: | ---: |
| Briarhaven Community Bank | D, 1.6 | B, 4.0 | C, 3.1 | A, 4.1 |
| Copper Tide Media Guild | C, 1 | D, 1 | A, 3 | B, 3 |
| City of Bellwater Sound | C, 3 | D, 3 | A, 3 | B, 4 |

The bank's original score here was 1.6/10. The separate audit reported 2/10. Its final draft accounted for 32 requirements and contained 28 Adobe answers. The reviewer could trace planning hours and verify the Drupal and Snowflake steps, but found no test plan for 450 sessions, timed suspension of an experiment or three-year cost view. The media reviewer found the two earliest proposals identical in visible content, with empty matrices. The final media draft answered eight Adobe requirements but missed the duplicate-tape acceptance test and quoted hours where the client requested eight-hour desk shifts. The city reviewer found useful Drupal migration and Snowflake reconciliation steps, but no adequate permit-correction rehearsal, street-name status search or rescheduled-hearing workflow. The unassisted exports also leave supplier responses for the partner to complete.

Both prescribed builds, all 34 browser suites listed in Task 4 and all 152 reader checks passed again before the fifth push. All 12 anonymous files opened as intact Word packages. This judging task changed no application files. The limited scores reflect the remaining work on the substance of the answers.

## Round 5b

The independent review and its six files were imported from `claude/amazing-volta-go9ton` at `8639c464`. The application started at `186e9475`. Each numbered case in `test_round5b.js` was run against the current build and failed before its implementation changed. The review documents are separate from the original 19 answer keys.

### Group 1: reader and response limits

| Item | Reproduced failure | Verified repair |
| --- | --- | --- |
| 1 | Kingsfold's later chapters inherited chapter 1. | All 13 questions have the printed chapter in the reader and Word matrix. Answered questions route to the correct Word section. |
| 2 | The Harrow Lake Overview heading hid both supplier questions. | Both questions survive with their wording and section. All 11 requests are present. Background and instructions remain inspectable in Not picked up. |
| 3 | The wrapped Drupal background split off from question 1.3. | PDF and pasted continuations stay with their requirement. Real letter headings still start a section. |
| 4 | The reader and writer missed a 120-word maximum. | Document, section and question budgets recognize the review's variants. The suite checks actual generated response lengths and legacy null limits. |
| 5 | Cedar Prairie's section names included the opening words of a word-limit instruction. | Reader and Word checks compare the six clean section names and preserve the six original budgets. |

The changes are in `sow/rfp_readers.js`, `sow/rfp_finder.js` and `sow/rfp_answers.js`. An independent multi-file browser check passed 92 assertions about question text and limit isolation, including uploads in both orders. Each group runs both prescribed builds, the 32 `sow/test_rfp*.js` suites, `test_word_complete.js`, `test_word_fit.js`, `test_round5b.js` and `check_reader.js`. Group 1 passed all 36 commands, including all 152 reader checks. No existing test expectations changed in Group 1.

### Group 2: proposal references and service hours

| Item | Reproduced failure | Verified repair |
| --- | --- | --- |
| 6 | Restarted numbering caused the Word exporter to reject the whole proposal. | Internal row identities keep calculations distinct. Readers see the RFI's original reference, qualified by section or source where needed. Both repeated section and repeated file references produce a Word document. |
| 7 | Editing Cedar Prairie B.1 dropped two services and unticking a B.2 service left its 240 hours in Word. | B.1 plus B.2 retain six services and 1,032 hours across the edit. Unticking A02 produces the same five services and 792 hours in Word and the actual SOW handoff. A 120-word edit remains exactly 120 words; its hours still appear in the matrix. |
| 8 | The bank's 32 training hours appeared under A.5 and the C.5 load test inherited a Form Data Model estimate. | Word counts work under the requirement that describes it: training in A.1, cutover in F.2, asset expiry and replacement in B.4, and the testing roadmap in E.1. C.5 says “Estimate in discovery” and books zero hours. D.2 books zero monthly hours. |

The reader preserves the source filename for multi-file references. The Word builder uses row identities to validate the matrix, service table and answers. The answer writer shares approved service ticks with the SOW handoff. For automatic proposals it checks evidence against the catalog, respects the answer's word budget and charges a service only once. An independent check across all 19 original inputs found zero automatically charged services among their answers' omitted service lines. A three-file browser check also verified individual service hours, including one-time and monthly amounts, through an actual transfer to the SOW.

Two expectations in `test_word_fit.js` changed. A single-product question may explicitly require discovery with no catalog charge. An edited answer can report accounting separately so the partner's text stays verbatim. The test still checks the numerical amount against the matrix and service table. Both builds and all 36 verification commands passed, including 152 of 152 reader checks.

### Group 3: preserved source questions and private work

| Item | Reproduced failure | Verified repair |
| --- | --- | --- |
| 9 | Opening saved work changed Cedar Prairie B.7 from “Adobe Target” to “declined product”. | The client's full question round-trips unchanged through Save my work and Save draft, then appears verbatim in the screen, printed answers, checklist, Excel and Word. The filled workbook retains the original question cell. |
| 10 | A partner who wrote “without Adobe Target” could neither save progress nor download the response. | Both save formats retain any partner draft, including a positive conflicting proposal and its rate. Client exports allow an explicit exclusion, but still flag a later affirmative mention in the same answer. |

`portableWork` in `sow/rfp_answers.js` preserves original data and keeps scope metadata separately. Earlier masked saves can still merge their decisions against the original RFI. The answer writer and Word builder separate client-supplied fields from generated responses. Workbook write-back leaves the client's original cells intact. Partner-answer validation checks individual mentions, while checks on generated service selections and source links remain in place.

In `test_word_fit.js`, package checks now allow the exact original requirement only in its matching Word heading, matrix cell, printed HTML heading or Excel question cell. Generated text and links retain their exclusion checks. The Bellwater write-back check now requires the client's original worksheet values, including its issued exclusion, to match the source workbook. Added responses and sources are still examined for prohibited names. Both builds and all 36 verification commands passed, including 152 of 152 reader checks.

### Group 4: client-facing language and licensing wording

Item 11's new check failed on the approved bank proposal's dashboard service name. Generated Word, HTML and Excel responses now use client-facing wording. Briarhaven's approved service is “Executive dashboards in Power BI” at the catalog's 48 hours. An unspecified or ambiguous BI tool stays generic. The catalog's service ID, hours and unit remain the accounting authority. Client questions and partner edits retain their exact wording.

The service selector distinguishes translations within one site from local sites or market rollouts. The tests cover a single US site with Spanish pages, a procurement that explicitly excludes country sites, and an RFI that asks for separate country sites and local corrections. The single-site bank receives an AEM language-copy approach. A separate fresh Word check verified that an explicit UK/France rollout still receives the multi-market service. The client-facing summary and cover use direct language while retaining the existing draft review notice and win-themes placeholder.

The partner note and checklist again use “Adobe licenses this proposal includes (Adobe quotes them)”. Their original licensing assertions in `test_rfp.js` and `test_rfp_step54.js` were restored and run before the wording was changed back. Both suites failed on the changed label and passed after the restoration.

Final verification: both prescribed builds passed. All eleven new cases passed together. All 34 prior browser suites passed, including both Word suites. The 19 original answer keys still scored **152 of 152**. No new gold keys were added. This round did not repeat the blind scoring.

A local Chromium timing check during Group 2 measured 821 ms to open a synthetic 100-requirement paste, compared with 344 ms at Group 1. Opening its first answer took 303 ms, compared with 69 ms. These are single-machine development measurements, not a production benchmark.

Still open outside this review: the original Cedar Prairie PDF contains some priority tags adjoining reference codes without a space. Some rows in its C and D sections consequently receive generated references. The six section names and limits fixed in item 5 have independent coverage; the workbook keeps the original references. The separate bid-content review still owns the bank's load-test method, three-year cost view and timed experiment suspension.

## Round 5c

The starting application was `02c73933`. The four review files came from `claude/amazing-volta-go9ton` at `c74f5d16`. Both prescribed builds reproduced the committed base RFI page byte for byte in a detached worktree. All comparisons use the browser reader on each built page.

### Starting parity

On the Tallgrass PDF, the base kept all 20 answers under 250 words. Round 5b found the same 20 questions and lost all 20 limits. It also lost both Lakeshore limits and 28 limits across the seven pasted wordings with and without a section heading. The two context pastes went from two and one genuine requests, respectively, to zero. On the lettered PDF, Round 5b added a false question A and lost both the heading and the limit of A.1 and A.2.

The unchanged Step 91 suite started at 20 of 21. Its language-version question across five markets selected SI06 in place of SI08. The review assigns this existing failure to item 14.

The comparison includes supporting files in the four directories. HTML source documents are compared using their visible text. The JSON report retains both readers' rows and the reason for each difference. For example, the base split a follow-up sentence out of Cedar Prairie E.4. The new reader keeps that entire sentence inside the numbered requirement. A cap explicitly confined to section A does not apply to B.1, even where the base carried it forward. Those distinctions matter alongside the raw row counts.

Across 68 inputs the base produced 581 rows and the starting branch produced 624. Thirty inputs failed starting parity. The 163 losses comprised 122 effective word caps, 36 sections, three missing questions and two count decreases on the same missing-question cases. The comparison also recorded 207 source-verified corrections, 351 improvements and 60 other differences. Running the base against itself yielded zero differences in all four categories. Eight independent comparator checks verified detection of lost or relaxed limits, labels, sections and rows, including repeated references across different files.

### Group 1. Word limits

| Item | Failing check before the change | Result |
| --- | --- | --- |
| 1 | Tallgrass lost all 20 limits after a chapter change. | All 20 retain a maximum of 249. The check also verifies the length of the actual generated answers. |
| 2 | Instructions to Respondents lost 90 at the next heading even when the limit applied throughout the file. | The published wording, an unquantified instruction and a response-guidance heading carry 90 into the requirements. An explicit section-only limit stays local. |
| 3 | “Maximum 300 words per question” yielded two null limits. A saved question could not recover a 95-word instruction. | Seven variants pass both with and without headings. Section limits override document defaults. Historical saves recover limits from their source, including rows missing their section or position. Explicit exemptions and unrelated files retain no limit. |
| 4 | The issued PDF gave A.1 and A.2 an empty section. | All three numbered requirements carry their printed headings. Both A rows get 100, and B.1 stays uncapped. The two alternate instruction wordings also pass. |

The finder resolves document and section instructions and preserves explicit exemptions. The answer writer recovers missing budgets from source paragraphs, bounded by file and section. The PDF reader emits a lettered heading as a heading even when it could also be read as a reference. The checks cover a numbered request that contains its own length instruction and the different treatment required for a standalone budget instruction.

Group 1 verification passed both builds, the 32 top-level RFP suites, both Word suites, all Round 5b cases, items 1 to 4, and 152 of 152 reader checks. A separate check passed 92 file and section isolation comparisons, including a heading's 170-word budget followed by an uncapped section. Parity fell from 163 losses to five, all from the three missing context requests and their two count decreases assigned to item 8. Step 91 retained its one baseline failure assigned to item 14. No existing test expectations changed.
