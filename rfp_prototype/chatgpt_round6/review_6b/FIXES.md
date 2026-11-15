# Round 6b for ChatGPT: fixes after review (Nov 15 2026)

Work on `chatgpt/round6`. Bring this folder in with `git checkout origin/claude/amazing-volta-go9ton -- sow/rfp_prototype/chatgpt_round6/review_6b`. Every rule in `../TASKS.md` still applies; add a failing check to `test_round6.js` for each item before fixing it; keep `check_reader.js` at 152 of 152 and `check_parity.js` at 0 losses. Before building anything not on this list, ask Adam whether he would like to see a mockup first.

## Item 1 (Adam: "Yes")

**The ruled-out note shows only when the question names the ruled-out product.** On Briarhaven A.1 ("Describe your proposed AEM Sites approach for deposit, mortgage enquiry and small-business journeys ...") the panel says "Your client rules out Journey Optimizer, so this answer draws on AEM Sites only." The question never asks for Journey Optimizer; the word "journeys" matched it. Expected: the line appears only when the question's own text names the ruled-out product by name (for example "Describe how you would use Journey Optimizer to ..."); on A.1 there is no line, and nothing else on the panel changes.

## Items 2 to 7: from Claude's review of e0c07f6

The review (five lenses, two skeptics per finding) found no product defect: base and round 6 give identical sorting, Drawn from chips and draft lines on Briarhaven, Tallgrass and Cedar Prairie (PDF and Excel), a byte-identical Word `document.xml`, and a cell-identical client workbook. All 40 RFI suites pass, the reader is 152 of 152 and parity is 0 losses. These six held against both skeptics (item 4 against one); fix each surgically.

### Leftover code (house rule: no dead code)

2. **`extraLines({...d,excluded:null})`** in `checklistRows()` (`sow/rfp_answers.js` about line 1485): `extraLines` no longer reads `excluded`, so call `extraLines(d)`. Also fix the comment above `extraLines` (about line 768), which still says it lists "a product the client rules out".
3. **`comply` is read but nothing uses it.** Its only reader was the removed generic Excel download (`responseRows`). Remove `comply:get(row,'comply')` (`sow/rfp_readers.js` about line 71) and `comply:clean(r.comply)` (`sow/rfp_finder.js` about line 297). Keep the Comply header pattern in `rfp_readers.js` (about line 34) if it still stops a Comply column being taken for the answer column; say so in a comment if kept. Fix the file header comment in `sow/rfp_answers.js` (lines 15 and 16, "The Excel adds Section, Mandatory or desirable and Comply"), which describes the removed download. Check that a saved draft holding `comply` still opens.

### Tests made weaker than the behavior they guard (restore the old strength on the new surfaces)

4. **`sow/test_rfp_part3.js` (about line 68):** the check that text written into a client workbook with no sources sheet (CSV or old .xls) keeps its numbered Adobe sources was deleted, though that write-back still ships (`writeBack()` calls `usedText(q)` with no flag). Restore it: `/Adobe sources for the product facts above\n1\. /` on `RFPAnswers.usedText(q26)`, or better, on a real CSV write-back download.
5. **`sow/test_rfp_part3.js` (about line 69):** the 2.6 citation check now counts superscripts across the whole Word document. Collect them from 2.6's own paragraphs only, as the old check did.
6. **`sow/test_rfp.js` (about line 130) and `sow/test_rfp_step53.js` (about line 95):** the client-voice check (`your client|the Client\b`), the no-partner-notes check (`Notes for you|Ask your client|Adobe licenses this proposal|Confirm with Adobe|Assumptions behind|Internal\.`) and the 5.5 check (`Drafted by the partner|not yet reviewed|Skipped by the partner|No catalog match`) used to read the whole client document and now read one answer body. Run them over the whole Word text (every paragraph and table cell), as `check_rendered_copy.js` does.
7. **`sow/test_rfp_step74.js` (about line 28):** "every part of a run has a recognized pile" can no longer fail. Assert the exact piles instead: of the eight "3 (n)" parts, the status-report part is Your firm and the other seven are Adobe products.

Push to `chatgpt/round6`, add a "Round 6b" section to `ROUND6.md` with the grader, parity and every suite, and write "ROUND 6B DONE" at its top.
