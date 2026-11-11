# RFI Builder step 73: a plainer top, a bigger AI button, and the lag (Nov 11 2026)

Adam tried Read with AI on Proto with the Washington State RFP and wrote back:

- "Get rid of this" (the long intro) and "put this there instead": "The answers provided are suggested drafts, drawn from
  Adobe's public documentation. Review every suggestion provided for accuracy."
- "The Read with AI button is hidden. Put that button and Start over in place of this text" (the Your call box). "Make
  the Read with AI much more visible. And it should say something like 'Build Answers with AI'."
- "READ WITH AI took forever to load the answers and when it did the page moved so slow ... the latency is significant."
- On a line under the button saying the RFI's text goes to an AI model: "We don't have to put that there because Adobe
  will make the decision as to what they want to use for AI going forward and it might not be any AI or maybe it'll be one
  of their models."

## What changed

1. **The intro** is his one sentence. The long paragraph is gone (what the tool does, where the file is read, Save my
   work, how an RFP is answered).
2. **The Your call box is gone**; its message is the intro now. In its place, on a row of its own above the filters: the
   red **Build Answers with AI** button, large, with **Start over** beside it. The filters row holds only the filters.
3. **The button's names:** Build Answers with AI; while it works, "Reading with AI... 0:32", counting the seconds; then
   **Undo AI reading**.
4. **The lag.** A click on a 60-line list took about four seconds, because every answer worked out again, from every
   question, which products the RFI names, and every question the catalog cannot answer was drafted again on every
   click. Both are now remembered (`contextProducts`, `draftOf` in `rfp_answers.js`): opening a row went from 4.2 seconds
   to 0.17 (0.01 after the first), Use this answer from 3.9 seconds to 0.02. The answers do not change (the RFI suites
   pass unchanged).
5. **The wait for the AI** is the model's own time (48 seconds for the Washington State RFP); the counter on the button
   shows it is working.

`sow/patch_step73.py`; mockup `sow/mockups/nov11_ai_reading/ai_layout.png`; as built `as_built_button.png`.

## Checks

`node sow/test_rfp_step72.js` (33) covers the button, its place and its names. Older checks changed on purpose: the
intro's wording in `test_rfp.js`, `test_rfp_step55.js`, `test_rfp_step69.js` and `test_rfi_front_door.js`.

## Flagged

- **Nothing on the page now says the RFI's text is sent to an AI model** (Adam's call: Adobe decides what AI the tool
  uses in production). Whoever takes it to partners should decide what partners are told.
- **The button's name.** The AI lists what the RFI asks for; the answers are written from the catalog with no AI. "Build
  Answers with AI" is Adam's wording; "Find Questions with AI" was offered.
- The intro no longer says the file is read in the browser or that Save my work keeps a copy.
