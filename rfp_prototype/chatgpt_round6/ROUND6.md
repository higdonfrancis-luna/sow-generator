ROUND 6 DONE

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
