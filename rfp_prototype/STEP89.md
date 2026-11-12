# Step 89: what the insurer RFP taught the RFI Builder (Nov 12 2026)

Adam asked for a harder test RFP ("yes, build the insurer RFP and deploy the worker"). Cedar Prairie Mutual
(`demo/Cedar_Prairie_Mutual_Insurance_Company_RFP.pdf` and `_Response_Form.xlsx`: 39 requirements in seven sections, each with
its own word limit) was run live and read seven more times; the findings are `STEP89_PROPOSAL.md`. Adam: "fix number 3", then
"B, yes on 1,2,4 and 5 and deploy worker".

## What is built

**The button (Adam: "we should shrink the ai button, too big", then "B" to `sow/mockups/nov12_rfi_agent/button_options.png`).**
It reads **Build with Adobe RFI Agent** and is the same red pill a third smaller: 44 pixels tall with 16-pixel words (was 64 and
21). It fits on one line on a 360-pixel phone. `patch_step49.py`, `rfp_ui.js`. While it works it still says "Reading with AI…"
and "Writing answers… 3 of 12"; when it is done it says Undo AI reading.

**Fix 1, word limits.** Each answer takes, in order: the limit in its own question; its row's Word limit column on a response
form (a new column the reader recognises: Word limit, Max words, Word count and the like); the limit stated for its own section
("Answer each requirement in this section in 300 words or fewer", held until the next section heading); and the RFI's first
limit as before. The writer is asked for 90 percent of that limit and the page fits the answer to it. On the insurer RFP the
answers now hold to 300, 250, 250, 150 and 200 words by section; Tallgrass keeps its 250. `limitOf`, `sectionLimits`, `paraAt`
in `rfp_answers.js`; the column in `rfp_readers.js` and `rfp_finder.js`.

**Fix 2, response forms keep their rows.** When the RFI is a spreadsheet the page reads row by row with references, the button
keeps those rows (references, Mandatory tags, word limits, and the write-back into the client's own file) and goes straight to
writing. The page reads the form with JavaScript; the AI writes the answers. Nothing is asked first, because nothing on the list
is replaced, and an answer the partner approved, left out or edited is not rewritten. Undo takes the written answers away and
keeps the form. `formRows` and `writeOnly` in `rfp_ui.js`.

**Fix 3, no silent gaps.** The worker reads the reader's list in more layouts (pipes, runs of spaces, a written-out tab,
bullets, code fences) as well as tabs (`readItems`). A part of a long RFI that comes back empty is tried once more; if it is
still empty, the others are kept and the closing message and a note under Not picked up name it: "Part 2 of 2 of this RFI came
back empty from the AI reading (it starts "…"). Check its questions yourself, or undo the AI reading and build the answers
again." (Adam approved "press the button again"; after a reading the button says Undo, so the wording says undo first.)

**Fix 4, questions that name no product, and products the client rules out.**
- The AI reading keeps no section, so a question is now read under the heading it sits under in the RFI ("Describe your go-live
  and cutover plan" under "Section B. Website on AEM Sites with Edge Delivery Services").
- A question that still names no product is written from the products the RFI is about, and the writer picks what applies. A
  question about the firm is not sent, and neither is one the knowledge base answers (certifications, encryption, uptime).
- "AI-generated answers" is Brand Visibility's topic.
- "Without (licensing) Adobe Target" rules Target out as "will not use" does, so no Target service is offered.
- An AI answer that rests on no catalog service is still shown as the answer, with nothing ticked.

**Fix 5, nothing defers a point to Adobe (rule 12).** Both writer briefs say never to write that we will get, obtain, check,
verify or confirm anything with or from Adobe, in writing or otherwise. The page drops any sentence that does, in an answer
(`AI_BANNED`) and in the Word proposal (`BANNED` in `rfp_proposal.js`). Run over every answer written on Nov 12, it took out the
five sentences of that kind and nothing else.

## Live (Nov 12, worker deployed at 23:00 UTC, code only, 8 bindings unchanged; rollback = the code at commit bb24b5e)

| RFI | Adobe questions | Written by Opus 5.5 | Over their limit | Defer to Adobe | Time |
|---|---|---|---|---|---|
| Cedar Prairie PDF (AI reading) | 31 | 27 (4 from the knowledge base) | 0 | 0 | 200 s |
| Cedar Prairie Excel form (rows kept) | 30 | 24 (5 knowledge base, 1 no match) | 0 | 0 | 99 s |
| Tallgrass PDF | 15 | 14 (1 knowledge base) | 0 | 0 | 76 s |

Before step 89 the same PDF got 6 to 9 answers, the form's answers ran 390 to 700 words with made-up references, and B.7 was
offered Target. Now B.7 gets Edge Delivery Services, C.2 Brand Visibility's off-site services, B.8 AEM's go-live service, and
the references stay A.1 to G.2. Answers: `step89_live/`.

## Seen, not changed

- The tool's own reading of the insurer PDF (no AI) misses A.1, C.1 and D.1: the PDF text puts each on the same line as its
  section's limit sentence, which the finder sets aside as an instruction. Some labels lose their space ("A.2(Mandatory)") and
  E.4 splits in two. Build with Adobe RFI Agent reads these correctly.
- On a phone, the question list of the insurer RFP is wider than the screen (508 pixels on a 390-pixel phone), so the page
  scrolls sideways. This was so before step 89.
- When the AI reader rewords a hosting question ("State where ... are hosted"), it can go to the writer instead of the
  knowledge base (E.1 in one PDF run). The written answer was grounded and correct.
- E.6 (is customer data used to train AI models) has no fact in the knowledge base, so on the form it has no drafted answer.
- On a response form the undo button still says Undo AI reading, though nothing was read by AI.

Checks: `node sow/test_rfp_step89.js` (36, reader and writer stubbed; the insurer PDF's reading replays a real one saved in
`demo/cedar_pdf_ai_reading.json`); the step 72, 74, 78, 79 and 88 suites follow the new name and size.
