# RFI Builder step 70: a plain summary bar (Nov 10 2026)

Adam, on the bar under the RFI Builder's answers: "There's a lot going on here". Then, one mockup at a time
(`sow/mockups/nov10_summary_options/`): "when answers are not chosen why don't we just create without them and a partner
can add manually", "if they're missing stuff then they're missing stuff ... that's not on us", "0-6 firm answers sounds
off", "instead of back to the first page, how about back to the homepage?", "what if they want to go back and fill in
their answers that they missed?", and on Shorter answers "can they just edit it and delete the stuff that they don't
want?". His "go" was to `summary_options.png` and `after_click.png`.

## What changed

1. **The counts, one a line, in plain words.** "5 of 8 Adobe product questions are answered.", "0 of 6 questions about
   your firm are answered.", "16 services selected for the statement of work." A kind with no questions has no line; one
   question is said in the singular; a full count reads "All 8 ...".
2. **A link to what is left.** Beside a count, "Go to the 3 that are left" lists only the questions of that kind with no
   decision (not chosen, not left out) and opens the first. A line above the list says what is showing, with Show all
   questions. A chosen or left-out question drops off the list; Next to review moves on. The link goes away when none
   are left.
3. **The drafts tick box is removed**, with the code behind it. A download holds the answers marked "Use this answer";
   every other question is blank (the Excel's status still says "Draft, not included").
4. **The blank-answers warning (step 69) is removed.** The count and its link do that job.
5. **The Shorter answers tick box (step 69) is removed**, with `SHORT` and `targetOf`. An RFI's own word limit is still
   obeyed, with the shorter wording of each fact where needed. A partner shortens an answer with Edit.
6. **The client's name stays** on the bar.
7. **Open draft opens a Save my work file.** Adam saved his RFI work, chose it with Open draft and "nothing happened"
   (a short message at the foot of the page). Now, on any step of the tool, the file opens on the RFI Builder tab the
   way Open my work would (same RFI: merge; another RFI: ask first); on the home page it opens the RFI Builder on its
   own with the work in it. A file that is neither still gets the tool's message.
8. **"Back to the home page"** in place of "Back to the first page".

An older Save draft or Save my work file with the drafts box or Shorter answers ticked opens as before; the two settings
are ignored.

## Files

`sow/patch_step70.py` (run once; it edits `rfp_answers.js`, `rfp_ui.js`, `patch_step49.py` and `canvas/template.html`),
then `python3 sow/canvas/build.py && python3 sow/build_site.py`.

## Checks

`node sow/test_rfp_step70.js` (41). Older checks changed on purpose: `test_rfp_step55.js` (the drafts box checks became
"no drafts box", and the write-back check undoes a choice in place of unticking the box), `test_rfp_step69.js` (the
warning and Shorter answers checks are gone; 41 checks), and the bar's wording in `test_rfp.js`, `test_rfp_step52.js`
and `test_rfi_front_door.js`.

As built: `sow/mockups/nov10_summary_options/as_built_bar.png` and `as_built_left.png`.

## Flagged, not changed

- Save my work and Open my work are still on the bar beside Save draft and Open draft at the top. Adam was asked whether
  he wants one pair; no answer yet.
- The step 69 comparison workbook (`step69_compare/after_step69.xlsx`) was made before this step; its answers do not
  change.
