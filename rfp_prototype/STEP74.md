# RFI Builder step 74: long lines (Nov 11 2026)

Adam, looking at the tool's own reading of the Washington State RFP (before Build Answers with AI): "It's crazy. This one
answer is so long and then I don't even see the question." One row was about 1,200 words, the PDF's whole scope of work
run together; the panel repeated it as a heading and the answer was far below the screen. He said to build both fixes
(`sow/mockups/nov11_ai_reading/long_row.png`).

## What changed

1. **A long numbered run is split, with no AI** (`rfp_finder.js`, `splitRun`). A line of 150 words or more that carries
   its own numbering, "(1) ... (2) ...", becomes one line per number, labelled with the parent's label and the number
   ("d (7)"). The words before the first number stay a line of their own. A short heading just before a "(1)" (eight
   words or fewer, after the last semicolon or full stop) is taken off the line before and leads the lines under it
   ("Design/Setup activities: Work with agency staff ..."). "fifteen (15)" and "three (3) years" are numbers said twice,
   not items. A part of a run that was about an Adobe product stays in Adobe products unless it is plainly about the firm.
2. **A line that is still long is shown short** (`rfp_ui.js`, `longHTML`): more than 60 words shows its first 40 and
   "Show all N words", in the list and above its answer; Show less closes it. Over 150 words the row also says it may be
   several requirements run together, and that Build Answers with AI splits it. Only the display is short: the question,
   the answer's matching and the downloads keep every word.

## Measured on the Washington State RFP, the tool's own reading

| | Before | After |
|---|---|---|
| Lines found | 47 | 94 |
| About Adobe products | 11 | 56 |
| Answers drafted | 10 | 36 |
| Longest line | about 1,200 words | 195 words |

## Checks

`node sow/test_rfp_step74.js` (20).

## Flagged

- Lines from different lists inside one run share labels ("d (1)" appears several times); the heading in the text tells
  them apart.
- A run numbered some other way ("a.", "i.") is not split; it is shown short, and Build Answers with AI splits it.
- 26 lines of this RFP are still To sort (sub-items such as "Identify and contain Milestones;" on lines of their own).
