# Step 51: spreadsheets, tables and PDFs read as rows (as built, Nov 10 2026)

Approved with the first batch on Nov 10 (see `STEP50.md`). The plan is step 51 in section D of `review_2026-11-09/RESPONSE.md`.

## What the readers do now

| Finding | What it does now |
|---|---|
| 2.1 A compliance matrix | A sheet is read by its header row: the reader looks in the first 30 rows for a row with a Requirement or Question column and at least one more it knows (Req ID or #, Section or Category, Priority or Mandatory / Desirable, Comply, Response or Vendor response). Every row below it with text is one item, with the client's ID, section and priority. A repeated header (a second block of the same table) is skipped. Rows above the header (title, instructions) are read as paragraphs. The two-sheet matrix gives the eight rows FR-01 to SEC-02, and the status line reads exactly as in Adam's picture: "requirements.xlsx: 8 requirements found on 2 sheets (Requirements, Security). 4 about Adobe products, 4 to sort. 6 mandatory, 2 desirable. Nothing was skipped." |
| 2.1 Pasted tables | Tab-separated text (two or more lines with tabs), or comma-separated text whose first line is a header the reader knows, goes through the same row reader. |
| 2.2 No header row | The longest text column is the requirement, with an ID column to its left and a priority column beside it when their cells look like IDs and M/D values. Gemini's REQ-04 row keeps its ID and its Mandatory tag. |
| 2.3 Word tables | Word files are read through mammoth's HTML: paragraphs as text, tables row by row through the same header rule, lists as bullets, in the document's order. The heading above a table becomes its rows' section. |
| 2.4 CSV | A line break inside a quoted cell is collapsed; coded IDs (R-1) are labels. |
| 2.5 PDFs | Letters are joined by their positions, so a header drawn one letter at a time or letter-spaced by a browser reads as words. A line that repeats in the top or bottom three lines of most pages (page numbers aside) is a running header or footer and is dropped. Pages join with one line break, so a question that runs onto the next page stays whole. A page with a clear gap down the middle and several lines on both sides sharing baselines is read left column, then right column; a title across both columns comes first. A PDF with no text at all says "has no text layer (it looks like a scan), so nothing in it could be read. Run it through text recognition, or paste the text." |
| 2.6 Several files | The file chooser takes several files and a drop reads every file, in turn, under its own name. The status line starts "first.pdf and 1 more" and says "Read 2 files." Each question remembers its file. |
| A8 Old .xls | "This is the older .xls format, which the browser cannot open. Open it in Excel, save it as .xlsx, and drop it again." No internal error reaches the page. |
| 7.9 The Excel export | The Response sheet's columns are Number, Section, Question, Mandatory or desirable, Response, Comply, Status. Comply carries the client's own Comply cell when the RFP had one (usually blank, for the partner to fill). |

## Writing the answers back into the client's workbook

When the RFP came in as a workbook (or CSV) with a Response column, the summary bar shows "Write answers into <the client's file>" and a line under it: "Writes the answers you used into the Vendor response column of your client's own workbook, on each question's row. Values only: the workbook's formatting is not kept." It writes only answers the partner used (Use, Save and use after Edit, or a typed firm or capability answer), on each question's own row, in the column whose header reads Response, Vendor response, Answer, Comments and the like. Everything else in the client's workbook stays as it was, both sheets included. A CSV comes back as CSV. A text, Word or PDF RFP has no workbook, so the button is not offered.

The plan asked for a picture of the write-back choice (which sheet, which column). It was not drawn: the column is found by its header and named on the button, so there is no choice to make. If Adam wants a picker for workbooks with two response columns, that is a small follow-up.

## Known limits

- With no header row, the longest text column wins, so in the review's "trap" row the Category text ("Explain how you handle security") is longer than the requirement and is read as the question. With the header row present, it is read correctly.
- SheetJS's small build reads and writes values only: the client's cell formatting, merged cells and column widths are not kept in the written-back copy.
- Two-column detection needs at least three lines on each side; a page with a short second column is read as one column.

## Files

- `sow/rfp_readers.js`: the readers and the shared table rule (`table`, `rowsFromDelimitedText`, `parseCsv`).
- `sow/rfp_ui.js`: every dropped file read in turn.
- `sow/rfp_answers.js`: the Excel columns and `writeBack()`.
- `sow/patch_step49.py`: the file chooser takes several files and .tsv; the write-back note's style.

## Checks

`python3 sow/rfp_prototype/build.py`, then `node sow/test_rfp_step51.js`: 37 checks, ALL STEP 51 CHECKS PASSED. They use the review's test files (`review_2026-11-09/verification/c2_readers/fixtures/`) and read the written-back workbook with the page's own SheetJS. `node sow/test_rfp.js` had two checks updated for the new Excel columns (the header row and the column positions).
