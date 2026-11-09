# Step 56: work is kept (as built, Nov 10 2026)

Adam said "go" to steps 55 and 56 on Nov 10. The plan is step 56 in section D of `review_2026-11-09/RESPONSE.md`; it closes findings 7.2, 7.3 and 7.4 (the per-line control), and the hand-off half of the skeptics' 6.6 (an untick that the statement of work ignored). The as-built screens are in `sow/mockups/nov10_third_batch/`.

## What the partner sees

- **The work stays in this tab.** The RFP, every decision, typed answer, tick, note and service tick live in the tab's session storage (`abv-rfp-work-v1`) and come back after a reload or a trip to another step or to Build, with the open answer, the filter and the drafts box. They clear when the tab closes and on Start over. The intro says so: "Nothing is uploaded or stored on a server: your work stays in this tab until you close it or start over, and Save my work keeps a copy as a file." The client's workbook is the dropped file itself, so "Write answers into the workbook" waits for the file to be dropped again after a reload.
- **A warning before the tab closes** when there is work on the page (a decision, a typed answer, a note or a tick). A trip to Build or the tool's own Start over does not warn.
- **A firm answer is kept as it is typed**, approval or not, and comes back when the partner returns to the question or reloads.
- **The RFP travels inside Save draft.** The tool's Save draft writes the RFP snapshot into the draft file as `rfp`; Open draft brings it back ("Draft opened, with its RFP and answers on the RFP Builder tab.") beside the tool's own draft, whose shape is unchanged.
- **The services behind each answer** are listed at the end of the partner's note, each with a tick box: "Services behind this answer, for the statement of work. Untick one to leave it out of Add to my statement of work; the response is unchanged." The summary bar's count follows, and so does the hand-off. The ticks are kept per question.
- **The hand-off previews, then merges.** Add to my statement of work opens "Add to my statement of work?" with one line ("This adds 3 services from 2 approved answers to Your own play on the Services step (Customer Journey Analytics and Brand Visibility). Your rate, size, term and currency stay as they are, and nothing already in the statement of work is removed.") and Cancel or Add them. Added, the RFP's services join Your own play beside what the tool already holds: the rate, size, term and currency are untouched, a service the partner turned on in the tool stays on with its hours, products already on the canvas stay, and a second hand-off adds the new answers' services without resetting anything. A prerequisite unticked on an approved answer stays out of the text of the research lines the hand-off creates (the tool's own template lines keep their template text).
- **Save my work and Open my work**, for two people splitting an RFP. Save my work downloads `<rfp name>-rfp-work.json`, the whole snapshot. Open my work with nothing on screen opens it; with the same RFP on screen it merges the file's decisions, answers, pile changes and product picks into the rows that have none here (notes, ticks and service ticks merge too, this screen's winning) and says how many came over; with a different RFP it asks before replacing ("Replace the RFP on screen? The file holds a different RFP (other.docx, 12 questions) ..."); a file that is not a Save my work file is refused with a plain message.

## Files

- `sow/rfp_ui.js`: `SKEY`, `snapshot`, `persist` (on every render), `restore`, `restoreSession`, `merge`, `sameRfp`.
- `sow/rfp_answers.js`: the firm input handler, the service tick boxes in `noteHTML` and their handler, `selectedLineIds`, `handoffPlan`, `previewSow`, `droppedPrereqs`, the merging `toSow`, the leave warning, the Save draft and Open draft wrappers, Save my work and Open my work, `onRestore`, `restoreSession()` at load.
- `sow/patch_step49.py`: the hidden file input `#rfp-work-file`, the hand-off and replace confirmations, the intro sentence.

## Checks

`node sow/test_rfp_step55.js` covers both steps (44 checks). `node sow/test_rfp.js` now checks that nothing from the RFP reaches the browser's lasting storage while the session storage holds the work under its one key.
