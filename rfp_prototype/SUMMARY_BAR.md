# RFP Builder: the summary bar, two buttons and a Download menu (Nov 9, 2026)

Adam, on the seven buttons under the questions: "there are just so many options here right?", then, from the picture
`sow/mockups/summary_bar/summary_bar.png`: "the big red button and the download and that is it". Built in the prototype only
(`sow/rfp_prototype/site/`); the live SOW tool is unchanged.

## As built

- **Two buttons:** the red **Add to my statement of work** and **Download**.
- **The Download menu** holds the four downloads, each with a line saying what you get:
  - **Your answers in [the client's file]:** the client's own workbook, with the answers in its response column. Values only; its formatting is not kept. Shown only when the RFP came in as a spreadsheet.
  - **Response document:** every question and answer, ready to print or save as PDF.
  - **Response as a new Excel:** one row per question, with a Sources sheet.
  - **My checklist (for you, not the client):** what to ask your client and confirm with Adobe.
- **The checklist is named for what it is.** It was "Download questions for your client", which read as something to send. The file is now `[RFP]-checklist.html`, titled "[RFP]: your checklist".
- **Save my work and Open my work** are two links beside the counts.
- **One shorter line:** the drafts box reads "Include the answers not yet approved in the downloads, marked as drafts.", and the long note under the buttons is gone; the workbook choice carries its own description.
- **How the menu behaves:**
  - Download opens and closes it, and the first choice takes the keyboard focus.
  - A choice runs and closes the menu. So does a click elsewhere, and Escape, which returns the focus to Download.
  - On a phone, the open menu fits the screen.
- **Nothing was removed.** Every button keeps its id and its action, so saved work, the hand-off and every download behave as before.

## Files

- `sow/rfp_answers.js`: the summary bar (`summary`), the menu's opening and closing (`dlMenu` and three listeners), and the checklist's title and file name (`asksDoc` and the `rfp-download-asks` action).
- `sow/patch_step49.py`: the bar and menu styles. The style for the old note under the buttons (`.rfp-wb-note`) went with the note.

## Checks

- `node sow/test_rfp_summary_bar.js`: 16 checks, ALL SUMMARY BAR CHECKS PASSED.
- The nine RFP suites all pass (67, 49, 37, 52, 68, 73, 61, recheck 41, part three 42). Seven test clicks now open the Download menu first, as a person would: three in `test_rfp.js` and two each in `test_rfp_step51.js` and `test_rfp_step55.js`. The checks that name the checklist and the workbook choice use the new names.
