# Round 6 for ChatGPT: the RFI Builder's screen and downloads (Nov 15 2026)

Round 5 is merged: the reader is reliable and Word carries everything. This round cleans up what partners see, from Adam's own test of the Briarhaven bank RFP (`sow/reviews/briarhaven_2026-11-14_audit.md`, section 5, "Your UI questions"). His words: "I don't understand the sort thing", "why would you add another product there?", "maybe it should be in alphabetical order", and on the downloads: the HTML files "will confuse people", "why do we need this twice", the checklist "would probably be better in PDF or even Excel", and "we should probably remove download Excel if you put in a PDF".

## Setup

- Start a branch **`chatgpt/round6`** from the tip of `claude/amazing-volta-go9ton`. Push only there.
- Every rule in `sow/rfp_prototype/chatgpt_round5/TASKS.md` applies (surgical, no dead code, no dashes, no AI or network, nothing ruled out leaks, no release labels, every suite passes). Rule 6 there (no screen changes) is lifted for exactly the changes below, and only after Adam approves the pictures.
- Keep `check_reader.js` at 152 of 152 and `check_parity.js` at 0 losses.
- Adam's design rules: Adobe red (#EB1000) on white, solid readable text (never faded or low-opacity), clean line icons, no emoji, plain short wording. Match the page as it is.

## Stop 1: pictures first

Before changing any code, make PNG mockups of each change below, drawn on the real page (build the site, open `sow/site/sow/index.html#rfi`, drop `sow/rfp_prototype/chatgpt_round5/fixtures/Briarhaven_Community_Bank_RFP.pdf`, and edit the page in the browser to show the proposed result; screenshot at 1440 wide). Put them in `sow/mockups/nov15_round6/` with a short `README.md` naming each picture and the one-line change it shows, push, and **stop**. Write "WAITING FOR ADAM" at the top of `ROUND6.md`. Do not build until Adam says yes; he may change items.

## The changes

1. **No "To sort" pile.** Every question lands in Adobe products or Your firm. A question the classifier is unsure about goes to Your firm (the partner writes it), never to a third pile. Broken fragments that are not questions go to Not picked up. Remove the To sort filter, the "Sort first" row action, the `unsure` kind and all their code. A saved draft that still holds `unsure` questions opens with them under Your firm.
2. **"Drawn from" shows what the question names.** For "Describe your proposed AEM Sites approach for deposit, mortgage enquiry and small-business journeys" the panel must show AEM Sites, not "No match" and "+ Add a product". When a draft is empty because the client ruled out a product the words pointed at, say so in one plain line (for example "Your client rules out Journey Optimizer, so this answer draws on AEM Sites only.") instead of "No match".
3. **The "+ Add a product" list.** Order: first "In this RFI" (the products the RFI names), then the other Adobe products A to Z, then outside systems A to Z. Products the client rules out are not in the list.
4. **The long-row note.** "This line is very long: it may be several requirements run together. Build with Adobe RFI Agent splits a line like this." names a button that no longer exists. Make it: "This line is very long: it may hold several requirements."
5. **Downloads.** The menu keeps:
   - **Full proposal, in Word**: always (the one document to print or send).
   - **Your filled-in workbook, in Excel**: only when the client's RFI was a spreadsheet; it writes the answers back into the client's own workbook (today's write-back). Not offered for a PDF or Word RFI.
   - **My checklist, in Excel**: replaces the HTML checklist. One row per item, columns: Ref, Question (short), Type (License, Ask your client, Confirm with Adobe, Assumption), Item, In the response (Yes or No), Done (empty, for the partner to tick). Items that apply to the whole RFI (such as the client's ruled-out products) appear once at the top, not on every question. Partner voice, as today.
   - Remove **Answers, to print** (HTML) and the generic **Answers, in Excel** for PDF and Word RFIs, with all their code. The Word proposal now carries every answer.

## Stop 2: build and test (after Adam's yes)

- Build the approved changes. Add `sow/rfp_prototype/chatgpt_round6/test_round6.js` checking each: no `unsure` kind anywhere after reading Briarhaven and all 19 keys; the AEM Sites question shows AEM Sites in Drawn from; the Add a product list order and no ruled-out product; the note's new wording; the menu items for a PDF RFI (Word, checklist) and for an Excel RFI (Word, workbook, checklist); the checklist workbook's columns and that whole-RFI items appear once.
- Update any existing suite that checked the removed downloads or the To sort pile, only where it encoded the old design, and list each in `ROUND6.md`.
- Take screenshots of the built result in `sow/mockups/nov15_round6/built_*.png`.
- Run the grader, the parity check and every suite, record them in `ROUND6.md`, push, and write "ROUND 6 DONE" at its top.
