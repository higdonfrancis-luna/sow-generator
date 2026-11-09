# Step 50: the finder reads requirements (as built, Nov 10 2026)

Adam approved the first batch, steps 50 to 52, on Nov 10 ("it looks good to me") from `sow/mockups/nov9_review_decisions/decision4_first_batch.png`. The plan is section D of `review_2026-11-09/RESPONSE.md`. The earlier session started three builders in separate worktrees; their work was lost when that session ran out of usage, before anything was pushed. This session rebuilt all three steps in one pass, on the split files and hooks the earlier session committed (`rfp_finder.js`, `rfp_readers.js`, `rfp_ui.js`).

## What the finder does now

| Finding | What it does now |
|---|---|
| 1.1 Requirements written as statements | A numbered or coded line with shall, must, should, will, is required to, "ability to", "support for", "capable of" or "Vendor to ..." is a requirement. All ten of the reviewers' statement forms are found. The row says "Requirement, not a question: the answer starts "We would meet this by"", and the drafted answer opens "We would meet this by using ...". |
| 1.1, 1.6 Coded IDs | REQ-101, REQ-001, FR-3.2, SEC-01, R-1, R1., S1., M1, D1, Q3, Item 15, A.1 and four-digit numbers (1000.) are labels. A bare number followed by a lower-case word ("12 regional brands") is not. |
| 1.2 Mandatory and desirable tags | "(M)", "[M]", "[Mandatory]", "MANDATORY:", "Desirable -", a trailing "(Mandatory)", and "[M] 2.5" before the number become a field (`q.priority`), shown as a Mandatory (red) or Desirable (dark) badge on the row and counted in the status line. The tag comes out of the question text. A bare "(D)" with no number after it is a lettered item, not a tag. |
| 1.3 Sub-questions | a), (a), (A), i., (ii) under a numbered stem become their own items labelled "12 a", "5 ii", with the stem kept as context (`q.context`), which the matcher reads, so a) is drafted from the stem's products and b) finds the IP warmup line. Items with no verb join their stem when it ends in a colon ("Describe how you would: migrate ...; connect ..."), and so do bullets. A stem whose items were all read as questions is not kept as a question of its own. "4.1 Describe: a) ...; b) ...; c) ..." on one line stays one item. |
| 1.4 Lots and sections | "Lot 2: ...", "Section 3.", "Part", "Appendix C:", "A. Vendor profile" and a short numbered heading start a section (`q.section`) instead of gluing onto the question before. The duplicate check uses the label and the text together, so 1.1 and 2.1 with the same words are both kept. |
| 1.5 The instruction filter | Only whole-paragraph instructions are set aside ("Instructions: ...", "Please respond to each item", "Submit your response by ...", "Include a signed ..."). "Submit a migration plan ...", "answer all of our members' questions" and "when a deadline is at risk" are questions again. Notices ("Please note ...", "Questions? Contact ...", an email address to contact) are set aside even with a question mark. |
| 1.6 Caps and odd shapes | Up to 1,000 items and 3,000 characters per item (was 300 and 900). Past the limit the rest go to Not picked up and the status line says how many. French, Spanish, Portuguese and similar paragraphs go to Not picked up with "Not in English: this tool reads English questions only". |
| 1.7 Two-part questions | "Describe your approach to AEM Sites and the team you would assign" and "..., including a timeline and staffing plan" stay Adobe questions; the firm's part is kept (`q.firmPart`) and shown under the draft as "Your part to write", and listed in the checklist download. "Describe your experience implementing ..." is a firm question. |
| A8 Line rules | A question mark ends a question, so short unnumbered questions on their own lines stay separate. A line starting "Include ...", "Also ...", "If so ..." continues the request before it. A statement followed by its question on the next line stays one item. Request openers with softeners ("Briefly describe", "In no more than 300 words, outline", "Kindly outline") and respondent forms ("Respondents must describe", "Bidders are asked to explain", "The vendor should describe") are read. "1. Why us?" is read. |
| 4.10 Ownership from any paragraph | The products the client already has are read from every paragraph of the RFP, headings and background included ("The bank licensed Brand Visibility", "runs Marketo Engage", "our online store runs on Adobe Commerce", "our Marketo instance"), and only from product names, never a topic word ("our new site on EDS" is not ownership). |

## Not picked up

Every paragraph the finder sets aside is kept with its reason: no question or requirement in it, a notice or instruction, too long, not in English, over the limit, or a statement with no question under it. Titles and section headings are understood and not listed. The filter row has "Not picked up (N)"; each paragraph there has "Make this a question", which adds it to the list in its place in the RFP, sorted into a pile. The status line ends "Nothing was skipped." or "N paragraphs were not picked up: see Not picked up."

An unnumbered statement ("The bidder shall provide a certified AEM project manager ...") is not read as a requirement on purpose: in prose, "must" and "shall" are everywhere. It lands in Not picked up, one click from being a question.

## Files

- `sow/rfp_finder.js`: the finder (paragraphs, labels, tags, requests, requirements, headings, notices, the session over text and row parts) and the piles (step 52).
- `sow/rfp_ui.js`: the badge, the requirement line, the Not picked up list and button, the status line, the counts on the filters.
- `sow/rfp_answers.js`: "We would meet this by", "Your part to write", ownership from every paragraph.
- `sow/patch_step49.py`: the Not picked up filter button and the step 50 styles. The style placeholders the Nov 10 split left after the closing style tag (they printed "/* step 50 styles */ ..." as text at the top of the page) now sit inside the style block.

## Checks

`python3 sow/rfp_prototype/build.py`, then `node sow/test_rfp_step50.js`: 49 checks, ALL STEP 50 CHECKS PASSED. They replay the reviewers' finder inputs (`review_2026-11-09/verification/c1_finder/inputs.json`) and confirm the three made-up RFPs and the bank workbook still read 12, 8, 10 and 14 questions.
