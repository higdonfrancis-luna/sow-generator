# ABV partner services tool: one more review (November 2, 2026, second pass)

Thank you for your November 2 review. All ten of your findings were real, and they are fixed. This bundle is the version after that work. Please review this version only. The live site (abvsow.netlify.app) still runs the October 31 version until this one is deployed, so test the `site/` folder in this bundle.

## How to open it

Serve `site/` with any static web server (for example `python3 -m http.server` inside `site/`) and open it in a browser. The front page is the Build canvas; the Scope, Services and Statement of work steps are at `/sow/`. The two pages share state in the browser's local storage, so open both from the same server.

## What's in the bundle

| Path | What it is |
|---|---|
| `site/` | The built site, exactly what will be deployed |
| `docs/RESPONSE.md` | The answer to your November 2 review, finding by finding, and what the later checks found and fixed |
| `docs/UNRESOLVED.md` | What rewriting couldn't settle, with who owns each item (item 21 is a decision waiting for the owner) |
| `docs/PROPOSAL.md` | The answer to your services and pricing audit, with the owner's decisions |
| `docs/CHANGE_LOG.md` | The answer to your October 31 audit |
| `tests/test_review_nov2.js` | The 122 browser checks behind these fixes (real pages, saved drafts, downloaded HTML and CSV). Read it to see what is already covered |
| `mockups/canvas_one_total_before_after.png` | The one visible change on Build, before and after, at real size |

## What changed since your review

- **Your ten findings (step 17):** an opened draft brings its play, products and choices to the Build canvas, even in an empty browser; services added on Services survive a trip through Build; a cleared rate stays cleared; Build, Services, the SOW and the CSV show one total (each line's own band, typed hours, line rate and cadence, in the SOW's currency); a band change updates every text the partner hasn't rewritten; old quantities keep their hours and wait for review; the retired SEO line beside Sites Optimizer's monthly fixes must say how it differs; money is kept in cents; and the Sites Optimizer, CJA audience, L03, C03 and F02 wording follows Adobe's pages (see the sources in `RESPONSE.md`).
- **Step 1b (step 18):** Commerce starts without the deployment pilot ($228,000 becomes $222,000 at Typical, $150 an hour, 12 months); FSI with a new concierge starts without the separate question mapping, whose questions go into the build's tests ($308,400 becomes $300,000). No hours changed.
- **Independent checks after that (steps 19 to 23):** a second read of the new wording against 13 Adobe pages, a reviewer who tried to break the round trip in a browser, and three verification workflows (53 agents in all, each finding reproduced twice). They found more defects, most of them older than your review, and each is fixed with a check that failed first. Highlights:
  - A line waiting for a product on Create your own play isn't offered on Services. A product taken off and added back brings its lines back with their edits.
  - Change play now starts that play over completely; the Scope details, rate and size stay.
  - The browser's Back button keeps canvas edits, because the canvas hands over on every change.
  - Two tabs no longer write over each other: a tab that comes back into view after the other changed the tool reloads first.
  - An edit to any of a line's five texts is kept, including a deleted phrase.
  - Rates and hours keep two decimals.

## Settled decisions (please don't reopen)

- No hourly rate range and no default rate: partners enter their own approved rate.
- The hours stay as they are. There is no outside delivery estimate.
- CJA audiences and Coworker's one plugin stay as starting services, because the plays' video and deck sell them.
- The plays deck keeps "A monthly readout that ties AI to revenue".
- No line saying the tool is "for joint validation". The site already says the hours are planning assumptions, not a quote.
- Nothing the tool shows or puts in a SOW mentions Adobe Consulting Services.
- Change play clears every service choice and edit for that play; the Scope details, rate and size stay. Start over on the canvas clears the play, the service choices and the Scope details but keeps the rate and size; Start over on the SOW steps clears everything.

## Known and left on purpose (please don't re-report)

Each was reproduced, and none of them loses saved work:
- A browser that used the tool before this update, and a draft saved before it with a line waiting for a product, show two totals until one trip between Build and the SOW steps.
- On Create your own play, taking the specialized Coworker Skills out on Services leaves the generic Skills off. Generic Skills kept beside specialized ones also lose that mark through Save draft and Open draft while the specialized ones wait for their product. One click adds them back in both cases.
- With two tabs open, a change in one makes each tab reload once when it next comes into view, so typing not yet added (a half-typed own service) and an open card are lost. A half-typed own service is also lost on the browser's Back button.
- Still open from earlier, and listed in `PROPOSAL.md` and `UNRESOLVED.md`: the FSI Coworker eligibility gate, research services starting off on Create your own play, pair warnings for custom combinations, and existing-estate questions for the AEM and CJA plays.

## A decision the owner hasn't made yet

Download template (under More on the SOW steps) saves the SOW steps as one file. Since the Build canvas became the front page, that copy can't pick a play, and its Build, Change play and Start over buttons lead nowhere offline. Your view on keeping or removing it is welcome.

## What would help most

1. **Bugs.** Try to break the trip between Build and the SOW steps: saved drafts, totals, the downloaded SOW and CSV, the browser's Back and Forward buttons, Change play and Start over, and Create your own play with products added and removed.
2. **Services.** Anything still charged twice in a play's starting services, or a starting service that doesn't belong.
3. **Claims.** Anything in the SOW text that says more than Adobe's documentation supports.
4. **Readability.** Anything on either page that is hard to read. The new note under a changed line on Build ("Set on the Services step", "Set by the prompt count on the Scope step") is the newest text.

For each problem, give the play, the screen or service, the exact steps, what goes wrong, how serious it is for a partner, and the exact fix.
