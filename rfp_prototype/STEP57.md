# Step 57: the RFI Builder, with a front door (Nov 10, 2026)

Adam, on proto.adobe.io/sow-generator: "you can't get to the tab until you click through a few things", then "why wouldn't
you just have RFP builder?", "it's RFI" ("the RFP might be a combination of the RFI builder plus the statement of work"), and
"build our new zip". Pictures: `sow/mockups/rfp_front_door/rfi_front_door.png`, `rfi_only_empty.png`, `rfi_only_loaded.png`.

## As built

- **The front door.** The first page (the play picker) has a second box under "Not sure which play? Start from your client's problem", in the same style:
  - The box reads "Have an RFI? Start from it": drop your client's RFI and get drafted answers about Adobe products, with Adobe's sources; answering an RFP, start here for its questions, then add the services to your statement of work to scope and price it.
  - Its red **Open the RFI Builder** button links to `sow/index.html#rfi`.
  - It is in the canvas template (`sow/canvas/patch_step57.py`), so `canvas/index.html` and `site/index.html` stay one file.
- **The RFI Builder on its own.** Arriving on `#rfi` turns on RFI-only mode (`body.rfi-only`, set in `rfp_ui.js`):
  - Hidden: the step tabs, the play heading, Change play, and Save draft, Open draft and Start over.
  - Shown: its own heading, "RFI Builder: Answer an RFI", and a **Back to the first page** button.
  - The page's own step switch moves the address to `#rfp`, and a reload there keeps the mode (a mark in the tab's session storage). Arriving on any other step clears the mark and shows the full tool.
  - Leaving through Back to the first page gives no leave-this-page warning: the work is kept in the tab, and going back in through the door finds it.
- **The hand-off opens the full tool.** Add to my statement of work (`toSow` in `rfp_answers.js`) turns RFI-only mode off, then applies the services and opens Services as before.
- **The Build page's tabs.** The Build page's own step row gets an **RFI Builder** tab after Statement of work. It hands the play over and opens the RFI Builder inside the full tool, like the other tabs. Before this, a partner on the Build page reached the RFI Builder only through Scope.
- **The name partners read is RFI.**
  - The page: the tab, the panel heading ("Answer an RFI from the catalog"), the intro (it now ends "Answering an RFP? Answer its questions here, then Add to my statement of work to scope and price it."), the drop zone, the paste box, Start over and Replace.
  - The messages and toasts: the status line's hint, the file-size and storage messages, the merge and draft messages, the hand-off toast, the knowledge-base answer's "The products your other answers in this RFI propose", and the note's "Per the RFI your client already runs".
  - The fallback name for a pasted RFI.
  - The "Where the answers come from" page (republished at the same claude.ai link; the Proto zip rebuilt).
  - Code names (`rfp_*.js`, `#rfp`, `RFPBuilder`) and comments are unchanged.
- **Unchanged:** a partner who starts from a play still has the RFI Builder as the fifth tab, with the play and the full tool around it.

## Files

- `sow/canvas/patch_step57.py`, which edits `canvas/template.html`: the door, its styles, the Build page's tab and its step entry.
- `sow/patch_step49.py`:
  - the RFI-only heading and Back to the first page in the page's top bar;
  - the RFI-only styles;
  - the RFI wording in the tab, the panel and the confirmations.
- `sow/rfp_ui.js`: `rfiOnly`, how the page starts in that mode, Back to the first page, and the RFI wording in its messages.
- `sow/rfp_answers.js`: the hand-off turns the mode off; leaving through Back gives no warning; the RFI wording in its messages.

## Checks

- `node sow/test_rfi_front_door.js`: 19 checks, ALL FRONT DOOR CHECKS PASSED. It covers the door, the RFI-only view, a reload, the hand-off to the full tool, every other arrival, Back to the first page with no warning and the work kept, the Build page's fifth tab, and a 390-pixel phone.
- Updated on purpose for the new names, in seven checks:
  - `test_rfp.js`: the tab name.
  - `test_rfp_step55.js`: three messages.
  - `test_rfp_part3.js`: the "products ... in this RFI" line.
  - `test_site.js`: the Build page has five tabs.
- Everything else passes unchanged:
  - the ten RFP Builder suites;
  - `test_site.js` (48), the drafts, the canvas (169) and the problem picker;
  - steps 45 to 47 and the product copy check;
  - the review suite and the copy crawl.
