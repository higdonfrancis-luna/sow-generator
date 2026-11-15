ROUND 6B DONE

# RFI Builder screen and downloads

Adam approved the six pictures in `sow/mockups/nov15_round6/`. This build starts at `b3b9096b601eac5e72d1293edd4b7a6c7b8b4ae4` on `claude/amazing-volta-go9ton`. The destination is `chatgpt/round6`. This checkout had no configured origin transport. The authenticated GitHub source tip, trees and blobs supplied the local tracking ref used by `git checkout -b chatgpt/round6 origin/claude/amazing-volta-go9ton`.

## What changed

| Approved change | Built behavior |
| --- | --- |
| Two question piles | Every recovered question goes to Adobe products or Your firm. A question without sufficient Adobe evidence opens for the partner to write. Detached fragments, including “and” and “in accordance with the”, go to Not picked up. A complete request such as “And describe how you would supply the evidence” survives. Saved and merged work with the former third pile opens under Your firm. |
| Drawn from | Briarhaven A.1 opens with AEM Sites selected. The line below explains that the client rules out Journey Optimizer. A refusal that blocks a documented route explains why the catalog has no draft. A fact question keeps its own explanation of what the catalog covers. Removing the last product manually clears the selection without blaming a client exclusion. |
| Add a product | The native selector groups permitted products under “In this RFI”, “Other Adobe products, A to Z” and “Outside systems, A to Z”. It orders the displayed names as in the approved picture. Named outside systems stay in the outside-systems group. A product already selected or ruled out is absent. |
| Long rows | The row reads “This line is very long: it may hold several requirements.” The full requirement remains available on the page and in the proposal. |
| Downloads | Word is the client proposal. A spreadsheet with a recognized response column also offers writeback into the client's file. The partner checklist is a real Excel workbook, with the six approved columns, a blank Done column and whole-RFI items first. The partner's checklist opens on its working sheet. The separate review notice is preserved. The XLSX header is bold and uses a light gray fill. The response HTML, checklist HTML and generic answer workbook exporters were removed. |

The source changes are in `sow/rfp_finder.js`, `sow/rfp_ui.js`, `sow/rfp_answers.js` and `sow/patch_step49.py`. The checked-in combined page was rebuilt with `python3 sow/canvas/build.py` followed by `python3 sow/build_site.py`.

## Verification

**40 of 40 Round 6 and RFI verification commands passed** on the final built page, Git blob `a5779ff68aa3574b08c7eaccf82eb49b4b1bcf0b`.

| Release check | Result |
| --- | --- |
| Reader | 152 of 152 checks passed across 19 documents. Briarhaven retained all 32 questions, with 28 Adobe product questions and four firm questions. |
| Parity against the source tip | 68 inputs, zero losses, zero corrections, zero improvements and zero other changes. |
| Round 6 acceptance | All seven groups passed, including real PDF, Word, Excel, CSV and legacy saved-work inputs. |
| Word, RFI and SOW handoff regressions | All 37 additional commands in the release group passed, including every Round 5b and Round 5c item. |

The new `test_round6.js` drives the file picker, question controls, native selector, saved-work restore, and the actual downloads. It checks the seven cases listed below. It reads the downloaded Word XML and opens each Excel workbook with openpyxl.

| Acceptance group | Evidence checked |
| --- | --- |
| piles | Unknown questions open under Your firm, fragments remain recoverable, complete requests survive, and old saved work opens and merges. |
| productPanel | Briarhaven A.1 shows AEM Sites, the exact scope explanation, and correctly grouped eligible options. |
| noMatch | The page distinguishes an excluded route, a mixed permitted/excluded question, and a genuinely unmatched question. |
| longNote | The row displays the approved sentence and the expand control still reveals the full text. |
| checklistAndWord | The PDF and Word menus offer two formats. The downloaded XLSX has the six columns, unique whole-RFI rows, Yes/No reflecting saved and skipped facts, and blank Done cells. The downloaded DOCX contains the edited text and tracks the omitted answer. |
| spreadsheet | The menu offers Word, the client's workbook and the partner checklist. The actual response cells receive the chosen answer and other original cells remain intact. |
| keysAndKinds | All 19 original fixture documents go through the file reader. Their questions have one of the two permitted kinds. |

## Existing checks updated

Only assertions or inputs that depended on the former pile, menu, note, or downloads were migrated. Word assertions inspect document paragraphs, tables and requirements-matrix destinations. Workbook assertions inspect the saved cells and source sheets.

| Suite or harness | Reason for the change |
| --- | --- |
| `check_reader.js` | The eighth check on each key now explicitly accepts only Adobe products and Your firm. Counts, references, order, sections, limits, text and expected kinds retain their original grade. |
| `test_rfp.js` | Checks the manual fallback, the actual Word answers and matrix, the partner checklist and the original bank workbook with question-linked sources. |
| `test_rfp_part3.js` | Checks Word citations and the corresponding numbered sources in a client workbook. |
| `test_rfp_round4_sorting.js` and `recheck.js` | The isolated editorial or manual question now belongs to Your firm. |
| `test_rfp_step51.js` | Checks the updated pile counts and original client columns, including requirements, priorities, compliance and responses. |
| `test_rfp_step52.js` | Checks the two pile choices, default answer action, and partner field and To write status in Word. |
| `test_rfp_step53.js` | Checks the Word cover, approved and omitted answers, client wording and skipped client-workbook cell. |
| `test_rfp_step54.js` | Checks internal wording on the page, typed facts and ticked asks in Word/writeback, four checklist types, and the edit and skip flags in the actual checklist. |
| `test_rfp_step55.js` | Checks the updated filter counts and approved and omitted responses in Word and in the client's original workbook. |
| `test_rfp_step67.js` | Checks the approved writeback menu wording. The worksheet formatting, XML, source references and untouched cells retain their original tests. |
| `test_rfp_step69.js` and `test_rfp_step70.js` | Check approval and undo through the filled-in client workbook and Word matrix. |
| `test_rfp_step72.js` | Explicitly places unmatched technical questions in Adobe products before testing the manual product matcher. |
| `test_rfp_step74.js` | Checks the two valid piles, exact long-row note and complete requirement in Word. |
| `test_rfp_step75.js` and `test_rfp_step81.js` | Verify the approved menu order and wording and the real Word download. |
| `test_rfp_step88.js` | Measures the actual Word answer against the word limit and checks default vs approved coverage against the Word matrix. |
| `test_rfp_summary_bar.js` | Checks PDF and workbook menus, keyboard focus, escape, and checklist file download. |
| `test_rfp_review_notice.js` | Tests the review notice on the page and in the actual checklist and client workbook, including their different opening sheets. |
| `test_word_complete.js` | Compares Word coverage to the actual on-screen answer controls. |
| `test_word_fit.js` | Scans Word, the partner workbook and client writeback for prohibited content. The single explicitly negative Whole RFI row is checked against the fixture's exact exclusion list. |
| `test_round5b.js` | Checks verbatim questions, saved edits, conflict refusals and client business-intelligence wording in the retained downloads. |
| `test_round5c.js` | Checks repeated and missing references in Word, the checklist and a real multi-sheet client workbook. |
| `review_2026-11-09/harness.js` | Shared readers now click the corresponding menu controls and inspect the saved Word document or Excel workbook. |
| `sow/qa/check_rendered_copy.js` | The RFI copy audit now scans actual Word paragraphs and tables plus real checklist cells. |

## Screenshots

| Built view | Input and capture |
| --- | --- |
| [Two question piles](../../mockups/nov15_round6/built_1_no_to_sort.png) | Briarhaven PDF, 32 questions. |
| [Drawn from](../../mockups/nov15_round6/built_2_drawn_from.png) | Briarhaven A.1 with AEM Sites and the Journey Optimizer scope line. |
| [Add a product](../../mockups/nov15_round6/built_3_add_product_list.png) | Three scroll positions of the same open Chromium selector, showing all three groups. |
| [Long-row note](../../mockups/nov15_round6/built_4_long_note.png) | A 162-word pasted A.1 sample crosses the note threshold. |
| [Download menus](../../mockups/nov15_round6/built_5_downloads.png) | Two actual menus, for the Briarhaven PDF and a bank spreadsheet. |
| [My checklist in Excel](../../mockups/nov15_round6/built_6_checklist_excel.png) | The exported Briarhaven XLSX. The working sheet opens first and its header is bold with a light gray fill. |

## Suite inventory

The Round 6 build commands and suites run from the repository root. Browser tests use the built page and the checked-in fixtures. The new suite also uses Python's openpyxl to read the downloaded spreadsheet independently of the application's spreadsheet library.

| Group | Commands or files |
| --- | --- |
| Reader and parity | `node sow/rfp_prototype/chatgpt_round5/check_reader.js` and `node sow/rfp_prototype/chatgpt_round5/check_parity.js`. The parity base is a detached worktree at the source commit above. |
| Round-specific suites | `test_round6.js`, `test_word_complete.js`, `test_word_fit.js`, `test_round5b.js`, `test_round5c.js`. |
| SOW handoff | `sow/test_step91.js`. |
| RFI suites (32) | `sow/test_rfp.js`, `test_rfp_part3.js`, `test_rfp_bounded_exclusions.js`, `test_rfp_context_sheets.js`, `test_rfp_kb_round2.js`, `test_rfp_product_evidence.js`, `test_rfp_review_notice.js`, `test_rfp_summary_bar.js`, the Round 4 exclusions, sorting, subasks, tailoring and trimming suites, and RFI steps 50, 51, 52, 53, 54, 55, 67, 69, 70, 72, 74, 75, 76, 78, 79, 81, 88, 89 and 90. |
| Additional top-level suites (26, including Step 91 above) | `test_canvas_views.js`, `test_citation_review.js`, `test_drafts.js`, `test_own_service.js`, `test_review_nov2.js`, `test_rfi_front_door.js`, `test_site.js`, `test_start_over.js` and steps 45, 46, 47, 58, 59, 61, 62, 63, 64, 66, 68, 71, 77, 83, 85, 86, 91 and 95. The walkthroughs use the checked-in Source Sans 3 weights for their Google Fonts requests. |
| Additional checks | `sow/canvas/test_canvas.js`, `sow/canvas/test_problems.js`, `sow/check.py`, `sow/qa/check_product_copy.py`, `sow/qa/check_citation_review.py`, `sow/qa/check_rendered_copy.js`, the November 9 `recheck.js`, and `kb_method/test_aggregate_round4.py` and `test_panel_build.py`. |

The historical `tests_step*.py` files edit prior test programs. The separate `sow/qa/review_pack/check_all.py` is a live Adobe URL and quotation crawler. Neither is an offline application test.

**25 of 26 additional top-level suites passed** on the final page, including the complete November 2 walkthrough. Step 47 reproduced its two starting-branch failures, detailed below. These 26 suites overlap the 40-command release group at Step 91.

The standalone canvas suite passed all 170 checks using a local copy of the SOW page's external font. The canvas kept its normal browser caching. Without the local font, both the source and candidate reported the same external-resource console error. The problem picker passed all 516 checks. The historical RFI recheck passed all 42. The knowledge-base suites passed eight aggregation cases and six panel-build cases. Product-copy QA passed for 44 templates, 489 definitions, 151 connections and 531 canvas services.

Three older audits could not pass unmodified on the starting branch or on this branch. The original SOW checker and the full rendered-copy checker wait for the retired SOW HTML download control `#download-sow`. The RFI portion of the rendered-copy checker passed independently on 24 answers, four actual Word proposals and four actual Excel checklists. The historical Python citation-count checker expects 203 service/template IDs and 75 connections. Both branches contain 533 unique IDs and 151 connections.

As an additional diagnostic, the full rendered-copy check passed across 974 views when its scratch copy used the current Print / Save PDF action. Those views included all six template plays, seven canvas-to-SOW handoffs and the RFI exports. The original obsolete SOW control assertion remains visible in the results above.

The complete Step 47 canvas suite recorded **105 passes and two failures on each branch**. Both failures are the existing item 26 hit-target checks at 768 CSS pixels. The selected connection points sit under the floating toolbar, view toggle or Continue button. The six built-in plays passed the additional 31-card check. The custom-play diagnostic located 56 intercepted targets and found none behind an open product card. The tested canvas file is byte-identical on the two branches (`bbbb1b358f78d0936e81b062bc258c70749ad51f`).

## Round 6b

This review starts at Round 6 commit `e0c07f60c85e89bed65fa79969a359c045c2fe7a` on `chatgpt/round6`. [FIXES.md](review_6b/FIXES.md) was checked out unchanged from `claude/amazing-volta-go9ton` at `58985f097fee4a3745e438c59822482cd4eb97f3`. The review file's Git blob is `5e53b7518f10a44ce0021411e37fed440bc8e445`. The local checkout had no origin transport, so the source and branch refs were fetched through authenticated GitHub access.

The interrupted run saved the first failing and passing checks for all seven items. Its last application build was reproduced byte for byte before the final verification pass. That pass caught additional false-positive exclusion notes and strengthened the checks on the actual CSV and Word downloads.

### Changes and failing checks

Each item was taken in order. To run an individual regression, use `node sow/rfp_prototype/chatgpt_round6/test_round6.js review6b1`, replacing the final digit with the item number. Running the script without an argument exercises all 14 groups.

| Item | What failed before the fix | What the final check verifies |
| --- | --- | --- |
| 1. Exclusion note | Briarhaven A.1 named only AEM Sites, but “journeys” raised a Journey Optimizer exclusion note. Additional negative cases exposed ordinary terms being treated as product names. | A.1 has its AEM Sites chip and no exclusion note. Explicit “Journey Optimizer” and “AJO” still show the note. References to a target audience, a report suite, analytics strategy, a digital experience platform, adaptive forms or Photoshop do not name their associated Adobe product. Adobe Workfront Planning is recognized separately from Workfront. The change is confined to the panel note. |
| 2. Checklist note helper | The checklist still cloned each draft to clear an `excluded` field the helper no longer reads. Its comment also described obsolete behavior. | `checklistRows()` now passes the draft directly to `extraLines(d)`. The downloaded checklist retains one whole-RFI exclusion row and its question-specific asks. |
| 3. Comply column | The reader imported unused `comply` values and the finder copied them onto each question. | The column header still identifies a Requirement/Comply table. The compliance column never becomes the answer column. Original CSV compliance values survive writeback, and a saved draft carrying the legacy field restores its approved answer, including after reload. The answers-file header now describes the current downloads. |
| 4. CSV source list | Removing the numbered list from an answer that must carry its own sources escaped the old Part 3 check. | Part 3 reads an actual CSV writeback. The bank's 2.6 answer cell contains its numbered sources. Moving the source list to 2.5 makes the check fail even though the file still contains all the same source text. |
| 5. Word citations for 2.6 | Removing superscripts from 2.6 escaped the old document-wide count when another answer retained valid citations. | The Word reader inspects actual superscript runs by paragraph. Only 2.6's answer contributes to its citation check. Removing its superscript formatting fails even when another answer still has valid citations. |
| 6. Whole-document client copy | An internal phrase placed outside the inspected answer escaped the old check. | The client-voice, partner-note and 5.5 status checks cover every paragraph and table cell. All 36 injected cases, twelve phrases in three locations, are detected. The unrelated lifecycle check keeps its original answer-body scope. |
| 7. Split-row classification | Swapping a technical row from Adobe products to Your firm could still satisfy the old pile-membership check. | In the real eight-row AEM Forms fixture, only the status-report part belongs to Your firm. Swapping the pile on any one of the eight rows fails. |

[Built Briarhaven A.1 panel](../../mockups/nov15_round6/built_2_drawn_from_6b.png). On this fixture the AEM Sites chip, its styling and the complete rendered answer panel match the starting commit after removing the single exclusion note.

The package checks use the same assertions as `sow/test_rfp_part3.js`, `sow/test_rfp.js`, `sow/test_rfp_step53.js` and `sow/test_rfp_step74.js`. The shared Word test reader preserves the numbered superscripts and their paragraph boundaries. The actual CSV had 18 numbered sources in 2.6's own cell. In the Word citation fixture, 2.6 had 19 superscript references to 18 distinct sources, and a separate security answer retained 12 references after the 2.6 mutation.

### Final verification

The builds used `python3 sow/canvas/build.py` followed by `python3 sow/build_site.py`. The final RFI page has Git blob `cfe91fb82caccb5d51a8512794c3880b792734bc`. The reader and parity graders are unchanged. Parity compares the real built page with a detached worktree at the review's source commit.

| Release group | Final result |
| --- | --- |
| Reader grader | **152/152** across all 19 documents. |
| Parity grader | **68 inputs, 0 losses, 0 other changes**, with no corrections or improvements relative to the review source. |
| RFI verification | **40/40 commands passed**. These are the 32 `sow/test_rfp*.js` suites, Word completeness and fit, Round 5b, Round 5c, all 14 groups in `test_round6.js`, the reader and parity graders, and Step 91. |
| Briarhaven export comparison | The full 1,970-character A.1 response matches `e0c07f6`. The Word documents have identical text, formatting and hyperlink destinations. Their 43 generated hyperlink relationship identifiers differ. Resolving the identifiers to their destinations produced identical document XML. |

The separate application suites use the same inventory as the original Round 6. The tables below give Round 6b results. Step 91 appears in both the RFI and top-level groups and counts once in the combined total.

**70 of 74 distinct suite commands passed.** All 40 RFI release commands passed. Of the 26 additional top-level suites in the inventory above, 25 passed, including all 229 checks in the November 2 walkthrough. Step 47 reproduced its two tablet failures. Six of the nine standalone and QA commands passed. All four failing commands reproduced their starting-branch results.

| Additional standalone or QA command | Round 6b result |
| --- | --- |
| `sow/canvas/test_canvas.js` | Passed 170 checks. The SOW page used the checked-in Source Sans 3 font files. |
| `sow/canvas/test_problems.js` | Passed 516 checks. |
| `sow/rfp_prototype/kb_method/test_aggregate_round4.py`, `test_panel_build.py` | Passed eight aggregation tests and six panel-build tests. |
| `sow/qa/check_product_copy.py` | Passed for 44 templates, 489 definitions, 151 connections and 531 services. |
| `sow/rfp_prototype/review_2026-11-09/recheck.js` | Passed 42 checks. |
| `sow/qa/check_citation_review.py` | Reproduced its starting-branch failure. It expects 203 service/template IDs and 75 connections. Both branches have 533 IDs and 151 connections. |
| `sow/check.py sow/index.html` | Reproduced its starting-branch timeout waiting for the retired SOW HTML download control, after 125 checks passed. |
| `sow/qa/check_rendered_copy.js` | Reproduced its starting-branch timeout on the same retired SOW download. Its RFI block passed independently on 24 answers, four Word proposals and four native Excel checklists. |

The full rendered-copy diagnostic passed on 974 views when a scratch copy of the audit selected the current Print / Save PDF action. It covered six SOW plays, seven canvas handoffs and the RFI downloads. The unmodified audit result is reported separately above.

Step 47 recorded 105 passes and two failures. At a tablet width of 768 CSS pixels, the two failing checks found connection targets covered by canvas controls. The complete Step 47 output matched the starting release byte for byte. Both builds used the same canvas file (`bbbb1b358f78d0936e81b062bc258c70749ad51f`).
