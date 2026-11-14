# Round 5 for ChatGPT: make the RFI Builder's output reliable (Nov 14 2026)

You are doing the heavy lifting; Claude Code wrote this brief and will review and merge your work. Adam Higdon (Adobe, partner sales) owns the tool. Read this whole file before you start, then work the tasks in order. Push after every task.

## Why this round

Adam dropped a fictional bank RFP (Briarhaven Community Bank, `fixtures/Briarhaven_Community_Bank_RFP.pdf`) into the RFI Builder and downloaded the Word proposal. Five auditors scored it 2 out of 10 (`sow/reviews/briarhaven_2026-11-14_audit.md`: read it first). The PDF is clean: 32 numbered questions, A.1 to H.3, in 8 sections with word limits. The tool found 24 rows, kept a code on 3, glued the page header into questions and merged several questions into one. Everything after the reader worked on broken input, so the Word proposal answered 2 requirements.

Adam's rule for this round: **no AI**. Everything you build is deterministic code in the browser. The tool must not call any model or service.

## Setup

- Repository `higdonfrancis-luna/warroom`. Start a branch named **`chatgpt/round5`** from the tip of `claude/amazing-volta-go9ton` (this file is on it). Push only to `chatgpt/round5`. Never push to any other branch, never merge, never open a pull request.
- Build: `python3 sow/canvas/build.py` then `python3 sow/build_site.py` (builds `sow/site/`, the page the tests drive). Rebuild after every source change.
- Browser tests use Playwright with Chromium (`require('playwright')`). The review harness `sow/rfp_prototype/review_2026-11-09/harness.js` drops a file or text into the built page and returns what it found; read its header comment.
- The RFI Builder's source: `sow/rfp_readers.js` (PDF, Word and Excel readers), `sow/rfp_finder.js` (finds and sorts questions), `sow/rfp_answers.js` (drafts answers), `sow/rfp_ui.js` (the screen), `sow/rfp_proposal.js` (the Word proposal, `contentOf`), `sow/patch_step49.py` (puts the tab into the page). Knowledge: `sow/rfp_method.json`, `sow/rfp_facts.json`, `sow/canvas/catalog.json`.

## Rules (Adam's, non-negotiable)

1. **Surgical edits.** Change only what a task needs. Never delete or rewrite working code you do not have to touch. When you remove something, remove all of it: no dead code, nothing commented out.
2. **No em dashes or en dashes** anywhere, in code, text, tests or docs. Use commas, colons or "to".
3. **No AI, no network.** Nothing in the page may fetch anything except the files it already loads.
4. **Nothing ruled out leaks.** When an RFI rules a product out (Briarhaven declines Real-Time CDP, Journey Optimizer, Workfront and Adobe Analytics), that product must not appear in any answer, list, licensing line or download.
5. **No release labels.** Never write beta, early access, limited availability, coming soon or a release date about an Adobe feature. A license the client must own is a prerequisite and stays.
6. **No screen redesigns.** Do not change buttons, piles, menus, downloads or layout. Those need a mockup and Adam's yes, and Claude does them separately. If a task seems to need a screen change, write it down in `ROUND5.md` and move on.
7. **Every existing suite keeps passing.** Before each push run the suites listed under each task plus `node sow/test_rfp.js`, `node sow/test_rfp_part3.js`, `node sow/test_rfp_kb_round2.js`, `node sow/test_rfp_step75.js`, `node sow/test_rfp_step81.js`, `node sow/test_rfp_step89.js`, `node sow/test_rfp_step90.js` and every `node sow/test_rfp_round4_*.js`. If a suite fails because it encoded the old wrong behavior, change only that check, say why in a comment, and list it in `ROUND5.md`.
8. Write commit messages as one plain line ending in `[skip netlify]`.

## The yardstick

- `gold/briarhaven.json` is the hand-checked answer key: every question's code, exact text, section, word limit, pile (`adobe` or `firm`), the products it is about, the outside systems it names, the products the RFI rules out, the milestones, the lines that are instructions and not questions, and strings that must never appear inside a question.
- `node sow/rfp_prototype/chatgpt_round5/check_reader.js` grades the reader against every key in `gold/` (or `check_reader.js briarhaven` for one). Today it scores **0 of 8** on Briarhaven. Your target is all checks passing on every key.
- Product ids used in keys: rtcdp, ajo, target, cja, bv, so, commerce, eds, bc, cw, marketo, workfront, aemsites, aemassets, aemforms, ajob2b, xa, ca, collab, mmm, gspm, express, frameio, creativecloud, planning, fireflycp, fireflycm, brandintel, aa, mmeasure, acrobat, acrobatsign, mqualifier, moptimizer. Outside systems: cdn, dwh, cstore, crm, ads, bi, search, csrc, cms.

## Task 1: the test pack (do this first)

Write **18 fictional RFIs and RFPs** and an answer key for each, so the reader is tested on layouts it has never seen, not tuned to one file.

- Put the files in `fixtures/` and the keys in `gold/`, one key per file, in exactly the shape of `gold/briarhaven.json` (same field names; `limit` may be null when the RFI gives none; `kind` is `adobe` for questions about Adobe products or their implementation and `firm` for questions about the supplier itself: team, references, commercials, company facts).
- Generate them with a script you commit (`make_fixtures.py`, using reportlab for PDF, python-docx for Word, openpyxl for Excel), so they can be rebuilt. Fictional clients only, and say so on the first page.
- Mix: 12 PDF, 3 Word (.docx), 3 Excel (.xlsx). Industries: two banks, two insurers, retail, a manufacturer, a university, a state agency, a hospital network, travel, media, a utility, a software company, a nonprofit, a telecom, an automaker, a pharma company, a city.
- Layouts, each used at least twice across the pack: running headers and footers on every page; a Ref | Requirement | Priority table with Mandatory and Desirable tags; codes at the left margin (A.1) and codes in a column; numbered lists without codes (1., 2.); several asks in one paragraph ("Describe ... Explain ... Provide ..."); requirements that break across pages; two-column pages; a constraints section and instructions that are not questions; word limits per section and per question; a client that rules products out ("we will not license Target"); outside systems named (Salesforce, Snowflake, Sitecore, Akamai and so on); an Excel response form with columns for Ref, Requirement, Mandatory, Response.
- Each RFI names 2 to 6 products from the list above and has 12 to 40 questions. Write the requirements in the voice of a real procurement team. Do not copy Briarhaven's sentences.
- Check each key against its own file by hand: every question present, text exact, nothing extra.
- Done when: 18 files and 18 keys are pushed, `make_fixtures.py` rebuilds them byte-for-byte or nearly, and `check_reader.js` runs over all 19 keys (it will fail; record today's score per key in `ROUND5.md` as the baseline).

## Task 2: the reader (step 98)

Make the reader find the questions the way a careful person would.

- Running headers and footers: find lines that repeat on most pages (title, reference, page numbers) and remove them before finding questions.
- Codes: a code at the left margin or in a code column belongs to the requirement beside it, and the requirement runs until the next code or the next section heading, across line and page breaks. Do not read a table as two columns of prose.
- Sections: a heading such as "A Public website" or "Section 3: Analytics" sets `question.section` for the questions under it. A word limit in the heading ("200 words per response") or the instructions ("Limit each response to 200 words, except Section F at 250 words") sets `question.limit` as a number. A limit written on the question itself wins.
- Several asks in one numbered requirement stay one requirement (the RFI numbered them together). Several unnumbered asks in one paragraph become one question each.
- Constraints, instructions, milestones and background are context, not questions. Keep them where the answer writer can read them (the existing `context` path), and never in the question list.
- Excel and Word: keep each row or numbered item as it is today; add `section` and `limit` where the file gives them.
- Every question lands in Adobe products or Your firm as the key says. Leave the To sort pile in the code (removing it is a screen change for Adam), but the reader should not put a real question there.
- Done when: `check_reader.js` passes on every key, `node sow/test_rfp_step50.js`, `_step51.js`, `_step52.js`, `node sow/test_rfp_context_sheets.js` and `node sow/test_rfp_step74.js` pass, and `ROUND5.md` shows each key's score before and after. If one or two keys cannot pass without breaking others, stop at the best overall result and explain the conflict.

## Task 3: Word carries everything the partner approved (step 97)

The Word proposal is the one document a client receives. Today `contentOf` in `sow/rfp_proposal.js` keeps only questions that carry a code and rebuilds every answer from scratch.

- Take every question. One without a code gets a reference such as Q7, shown in the proposal as "[Q7: replace with the RFI's reference]".
- Use the answer the partner chose on screen: the drafted answer when marked "Use this answer", the partner's edited text when edited, nothing when "Leave out" (the question still appears in the matrix as not answered). Typed answers to firm questions go into About our firm under their own codes.
- When the partner has marked nothing, use each question's draft as today, so the proposal is never empty.
- The requirements matrix lists every question, in the RFI's order, with its code, section, the section of the proposal that answers it, and "To write" where nothing does.
- Each answer respects its question's `limit`.
- Add `sow/rfp_prototype/chatgpt_round5/test_word_complete.js`: Briarhaven in, Word out; the number of answers in Word equals the number of answered questions on screen, every A.1 to H.3 code is in the matrix, an edited answer appears word for word, a left-out question has no answer, a typed firm answer appears under its code.
- Done when that test passes and `node sow/test_rfp_step75.js` and `_step81.js` pass.

## Task 4: answers that fit and agree (steps 99 to 101)

Read the audit's findings 3 to 6 before you start.

- **One list of services and hours.** The cover's counts, each answer's hours, the Services and effort table and the matrix come from one list. Remove the five-product cap. The download refuses to save if they disagree.
- **Each answer draws on the products its question names**, or its section's products when it names none. Words such as "journey", "test" or "audience" count toward a product only next to that product's name. Remove ruled-out products before choosing services, then choose again; if a named product has nothing left, use that product's own build services, never another product's.
- **Nothing wrong for this client.** Remove ruled-out products from every sentence in every download (Workfront Fusion, "an Adobe Analytics source connection", Real-Time CDP in licensing lines). Use the RFI's own facts to choose a branch: Drupal is another CMS (so no Content Transfer Tool), Snowflake is the warehouse (so no BigQuery or Databricks details), a new AEM build has no AEM 6.5 notes. Instruction lines ("Distinguish included work ...") are rules the answers follow, never questions.
- Add `sow/rfp_prototype/chatgpt_round5/test_word_fit.js`: Briarhaven in; no ruled-out product name anywhere in the Word file; C.1's answer draws only on AEM Forms; A.2's mentions Drupal and not the Content Transfer Tool; D.3's mentions Snowflake and not BigQuery; the hours agree on every page. Run the same checks on three keys from your pack.
- Done when the new test passes and every suite in the rules passes.

## Task 5: blind judging

After tasks 2, 3 and 4, judge the Word proposals blind, as in round 3 (`sow/rfp_prototype/kb_method/chatgpt_round2/` has the earlier judge files).

- Make Briarhaven's Word proposal and two from your pack with the code before your round (tip of `claude/amazing-volta-go9ton`) and after each task. Label them A, B, C, D in a shuffled order and keep the key in a separate file you do not open until scoring is done.
- Score each 1 to 10 as a bank or company evaluation panel would: answers the question asked, specific method, accuracy about Adobe products, fits the client, follows the RFI's structure and limits, nothing ruled out.
- Save scores and one sentence per score in `judge_round5.json`, then unblind in `ROUND5.md`.

## Report

Keep `sow/rfp_prototype/chatgpt_round5/ROUND5.md` up to date as you go: per task what you changed (files and functions), the before and after scores, every suite you ran and its result, anything you could not do and why, and any screen change you think is needed (for Claude and Adam). Push after each task. When all five are done, write "ROUND 5 DONE" at the top of `ROUND5.md`.
