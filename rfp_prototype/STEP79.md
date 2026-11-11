# RFI Builder step 79: the round button (Nov 11 2026)

Adam, on a screenshot of the RFI Builder: "start over moved to next to back to homepage or som where else. move the Build
with AI button more centered under the questions. can it look like the famous staples 'Easy Button'?" Two pictures were
drawn (`sow/mockups/nov11_easy_button/option_a_round.png`, `option_b_wide.png`); his answer: "A sounds good".

## What changed

- **Build Answers with AI is one round push button**, 190 pixels across, centered between the drop box and the filters:
  Adobe red with white words on a gray base, with one line under it, "Reads the RFI and drafts your answers". It is the
  spirit of a desk push button in Adobe's red with our own words, not a copy of any other company's design.
- **While it reads** the button stays round, turns white with solid dark words and counts the time; the line under it
  says "Keep this tab open".
- **After a reading**, Undo AI reading is a plain centered button, not the round one (a large red button for undo invites
  a slip). Asked of Adam: plain as built, or round.
- **Start over sits in the header, just before Back to the home page.** It shows only on the RFI Builder with an RFI
  loaded (in the full tool, only on the RFI Builder tab). It still asks before it clears.
- On a phone the header wraps, so nothing runs off the side.

`sow/patch_step49.py` (the header button, the row, the styles), `sow/rfp_ui.js` (the undo class and the line under the
button), `node sow/test_rfp_step79.js` (17). As built: `sow/mockups/nov11_easy_button/built_ready.png`,
`built_reading.png`, `built_undo.png`.

## Asked, waiting for Adam

- A line in the Adobe products pile with no drafted answer says "See answer" and opens on "No match". Proposed: it says
  "Write answer", as the Your firm lines do. Not built.

## Told to Adam

- Build Answers with AI works on an Excel RFI too, but Excel is already read row by row with no AI, and after an AI
  reading the lines no longer carry their cells, so writing the answers into the client's own workbook skips them
  ("Response as a new Excel" still works).
