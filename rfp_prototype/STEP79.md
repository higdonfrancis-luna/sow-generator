# RFI Builder step 79: the big button, Start over, and Write answer (Nov 11 2026)

Adam, on a screenshot of the RFI Builder: "start over moved to next to back to homepage or som where else. move the Build
with AI button more centered under the questions. can it look like the famous staples 'Easy Button'?" Two pictures were
drawn (`sow/mockups/nov11_easy_button/option_a_round.png`, `option_b_wide.png`). He said "A sounds good", and on seeing
the round button built: "a bezzeled pill would be fine. east button too big. write answers, yes. why would we want them
to see an answer that was not written?" So the round button was built and then taken out, with its code.

## What changed

- **Build Answers with AI is one wide beveled pill**, centered between the drop box and the filters: Adobe red, white
  words, a lighter top edge and a darker raised base. It presses down when clicked.
- **While it reads** the pill turns white with solid dark words and counts the time; the line above it says to keep the
  tab open.
- **After a reading**, Undo AI reading is a plain, smaller centered button.
- **Start over sits in the header, just before Back to the home page.** It shows only on the RFI Builder with an RFI
  loaded (in the full tool, only on the RFI Builder tab). It still asks before it clears. On a phone the header wraps.
- **A line with no answer says Write answer.** An Adobe products line the catalog has no drafted answer for, and the
  partner has not written one for, says "Write answer" where it said "See answer"; once the partner writes one it says
  "See answer". On the Washington State RFP read with AI (191 lines), 71 say See answer and 120 say Write answer, and a
  click on a row still takes well under a tenth of a second.

`sow/patch_step49.py` (the header button, the row, the styles), `sow/rfp_ui.js` (`noDraft`, the undo class),
`sow/rfp_answers.js` (`hasAnswer`), `node sow/test_rfp_step79.js` (21). As built:
`sow/mockups/nov11_easy_button/built_ready.png`, `built_reading.png`, `built_undo.png`.

## Told to Adam

- Build Answers with AI works on an Excel RFI too, but Excel is already read row by row with no AI, and after an AI
  reading the lines no longer carry their cells, so writing the answers into the client's own workbook skips them
  ("Response as a new Excel" still works).
