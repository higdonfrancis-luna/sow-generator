# What they buy next: the design a skeptical boss can check by hand

Design only. Nothing in the tool or the live checkout changed. Every number marked SAMPLE in this
document comes from made-up accounts (a seeded random model in `nbp/tools`), not from Adobe data.

## In one paragraph

The tool asks one question per canvas: **what is your client trying to fix?** The partner picks one of
the 23 preloaded problems (or types it, and the first page's matcher finds it). That answer is kept with
the canvas and never asked again. From then on, every time a product goes on or comes off the canvas, the
tool lists every other product in order: first the products that **solve the goal**, then the ones that
**build on it**, then the ones that **connect to it**, then the rest. Next to each product is one number
between 0 and 1, the propensity: *of the customers who own everything on your canvas, the share that also
own this product*. The count of customers sits next to it (for example "25 of the 673 customers who own CJA", SAMPLE). When
too few customers own the whole combination, the tool leaves out one product at a time (products not tied
to the goal first) and says which. Every number has a "How this number was worked out" line with three or
four lines of arithmetic that anyone can redo on a calculator from counts shipped in the page.

## 1. The one-time goal question (problem first)

**Where it appears.** There are three ways onto a canvas, and the question appears only where the tool
doesn't already know the goal:

| How the partner got here | What happens |
|---|---|
| First page: "Not sure which play? Start from your client's problem", then **Build this** | The problem they picked is the goal. No question. (Today the matched problem, `bp.hits[bp.i]`, is not saved with the canvas when they press Build this; it would be saved as the goal.) |
| Picked a play directly (a Brand Visibility play, Adobe Coworker, Create your own play) | Asked the first time they open **What they buy next** (or the Add product menu on Create your own play). On an empty Create your own play the menu already opens by itself on wide screens, so the question is the first thing they see. |
| Opened an older draft that has no goal | Asked the first time they open the list. |

**What it looks like.** At the top of the list, before any product:

> **What is your client trying to fix?** You answer once for this canvas. Every suggestion after this follows it.
> [chips: the play's own problems first, e.g. on Adobe Coworker "My client's team is buried in routine work"; then the 6 starter problems; then **See all 23 problems** grouped as on the first page: Get found in AI and search, Website and online store, Leads and sales, Customer messages and data, Content and team productivity]
> [Or describe it: ______ ] (the same no-AI matcher the first page uses; the top match comes back as a chip to confirm)
> [None of these fits] (allowed, but then the list is labeled "No goal: ranked only by what similar customers own")

**Asked once, kept, changed.**
- Kept as `st.goal` (the problem's id) with the rest of the canvas in the browser (the existing `abv-sow-build-v1`
  record), in Save draft / Open draft, and in the handoff to the Scope, Services and SOW steps.
- Shown as a pill on the toolbar: **Goal: My client can't tie AI traffic to revenue · Change**.
- **Change** reopens the chips; the list re-ranks at once; the products on the canvas stay.
- **Change play** keeps the goal (it is about the client, like the rate, size and client details that already stay).
  **Start over** clears it.
- If a later build drops or renames a problem, a saved id that no longer exists counts as unanswered and is asked again.
- If the first page heard two problems, the lead one becomes the goal and the panel offers the other as
  "Also heard: ... (switch)".

**What the goal decides (fit), from the tool's own files, no data needed:**

| Fit group | Rule | Source |
|---|---|---|
| Solves the goal | The goal's own products | `problems.json` `products` |
| Builds on the goal | Products its refine chips add; the chip text is the reason ("My client's leaders want readouts on request") | `problems.json` `refine[].add` |
| Connects to the goal | Products with a documented connection to a product that solves it; the reason names the connection and its kind (native, platform, extension, partner) | `catalog.json` `connections` |
| Not tied to this goal | Everything else, still listed (folded) with numbers | |

Across the 23 goals this gives 1 to 4 products that solve, 1 to 5 that build on, 1 to 20 that connect
(`nbp/out/goal_tiers.json`). Example, "My client can't tie AI traffic to revenue": solves **Brand Visibility,
CJA**; builds on **Coworker**; connects **AEM Sites (either delivery), Brand Concierge, Commerce, Real-Time CDP,
Journey Optimizer, Target, Marketo Engage, Marketing Campaign Analytics, Content Analytics, Adobe Analytics**;
20 others not tied.

**Order of the list:** fit group first, then the number (highest first), then the bigger customer group, then
the name. On screen each fit group is its own heading, so the order explains itself: a product at 0.64 under
"Connects to the goal" sits below one at 0.04 under "Solves the goal" (SAMPLE numbers), and the headings say why. This is how
"every product after that resolves to the initial business problem": the goal never changes, so as products
are added the next one still comes from the goal's own groups first.

**Honest note for Adam.** The ownership data has no goals in it, so in version 1 the goal decides *what is
listed and in what order* (and which products are kept when a combination is rare, section 4), but it cannot
change the number itself. Your example works like this: goal "can't tie AI traffic to revenue", client owns
CJA, so **Brand Visibility comes first** (it solves the goal). Its number is likely to be low today (SAMPLE: 0.04,
25 of the 673 CJA owners) because it is new (the tool marks its play New) and few customers have had time to buy
it. When owners of the canvas products own a product noticeably more often than customers overall (1.2 times or
more), a line under it says so; in the SAMPLE data the gap for Brand Visibility is small (0.037 against 0.032), so
no such line shows, which is the honest answer. When the partner then adds Brand Visibility, only 25 made-up
customers own both, so the next list leaves Brand Visibility out of the count and says so (section 4). The number
becomes goal-specific only once goals are recorded next to outcomes (data level 3, section 7).

**The boss's question: "if they have Coworker, what should they already own, and what should they buy?"**
On the Adobe Coworker play the suggested goal is that play's own problem, "My client's team is buried in routine
work". Its refine chips already name what the client should own for Coworker to help ("My client owns CJA",
"runs AEM Sites", "runs Marketo Engage", "runs Workfront"), so those four come first under "Builds on the goal",
ranked by how often Coworker owners own them (SAMPLE: AEM Sites 0.60, Marketo Engage 0.37, CJA 0.26, Workfront 0.25,
from 48 made-up Coworker owners). The other products with a documented Coworker connection follow under "Connects to
the goal" (SAMPLE: Adobe Analytics 0.81, then Target 0.59). Add one, and the list re-ranks for Coworker plus that product.

## 2. The number, in plain words

For one product X and the products on the canvas:

1. **The group.** Count the customers who own everything on the canvas (Adobe products only; outside systems
   such as CDN or CRM are not in the data and are ignored).
2. **Too few?** If fewer than **30** customers own them all, leave one product out and count again. Leave out
   products that neither solve nor build on the goal first, then the goal's own; within each, the product the
   fewest customers own goes first. Repeat until the group has 30 or more. If nothing is left, the group is all
   customers.
3. **The share.** Of that group, how many also own X. Share = owners of X / group size.
4. **Smoothing.** Add **10** pretend customers who behave like the next bigger group on the same ladder (the group
   with one product fewer):
   `number = (owners of X + 10 x bigger group's number) / (group size + 10)`.
   The bigger group's number is worked out the same way, down to all customers, where it is simply
   owners of X / all customers. With 700 real customers the 10 pretend ones barely move the number; with 40
   they pull it toward the bigger group, which is the honest thing to do with few customers.
5. **Shown:** two decimals, the boss's scale (0.99 almost certain, 0.50 a toss-up), with the same number in words
   ("47 in 100", SAMPLE).

**Worked example, SAMPLE numbers (made-up accounts).** Goal "My client can't tie AI traffic to revenue",
canvas CJA + Adobe Analytics (the client owns both). 539 made-up customers own both, so nothing is left out. On the
way down the ladder Adobe Analytics goes first (it connects to the goal but does not solve or build on it), so the
next bigger group is the CJA owners. Brand Visibility solves the goal:
```
Everyone:                                95 of 3,000                    = 0.0317
Own CJA:                       (25 + 10 x 0.0317) / (673 + 10)          = 0.0371
Own Adobe Analytics and CJA:   (19 + 10 x 0.0371) / (539 + 10)          = 0.0353   -> shown 0.04
```
Target connects to the goal, same canvas:
```
Everyone:                             1,001 of 3,000                    = 0.3337
Own CJA:                      (305 + 10 x 0.3337) / (673 + 10)          = 0.4514
Own Adobe Analytics and CJA:  (256 + 10 x 0.4514) / (539 + 10)          = 0.4745   -> shown 0.47
```
The counts in those lines (95, 3,000, 25, 673, 19, 539, ...) are exactly what the page ships; a calculator is
enough to check every number on screen. Each step is rounded to 4 decimals before the next step uses it, so redoing
a printed line gives exactly the printed result: a script redid all 99 printed lines in the SAMPLE outputs from the
printed numbers alone with no mismatch (`nbp/tools/hand_check.js`, `nbp/out/hand_check_synthetic.txt`;
`nbp/out/doc_examples_synthetic.txt` has these examples and more).

**Where 30 and 10 come from.** They are starting values. The split-half check (section 5) is run with a few
choices (20/30/50 customers, 0/5/10/20/50 pretend customers) and the best ones are written into the data
file, so the page shows them in "How this number was worked out".

**Why counting and not a model.** A statistical model trained on the same footprint (a regression or a
tree model) might rank a little better, and its weights would also fit in the page, but nobody can redo its
number by hand from a count of customers. Counting with a ladder is the method a skeptic can audit line by
line. The same split-half check can score a model later; only if it wins by a wide margin is a switch worth
the loss of the hand check.

## 3. Any combination: 1 to 5 or more products

- The offline step finds **every product set that at least 30 customers own in full** (all sizes up to 6) and
  stores, for each, how many customers own the set and how many of them own each other product. A subset of
  such a set is owned by at least as many customers, so every smaller step of every ladder is always there.
- **Empty canvas:** the group is all customers; the goal's groups still order the list.
- **1 product:** almost always its own row (any product with 30+ owners).
- **2 to 4 products:** the exact row when 30+ customers own the combination; otherwise the ladder.
- **5 or more:** usually the ladder; the page names what it left out. There is no limit: a 10-product canvas
  walks at most 11 steps (10 products down to everyone).
- AEM Sites with Edge Delivery and AEM Sites with traditional Publish are one product line in the data and one
  row in the list (the Add product menu already treats them as one offering and asks which delivery).
- A canvas product with no ownership data (e.g. if Sites Optimizer is not its own line in WARROOM) is left out
  of the count, and the page says so.
- Every add or remove re-ranks everything; the goal stays. "And after that?": the partner adds the top
  product and the next one moves up. An optional **Show the path** link previews the next three picks in a row
  (add the top pick, re-rank, repeat) without touching the canvas.

## 4. Rare combinations

- The ladder (section 2, step 2) is the back-off, and the row says so in words. Adam's own example shows it
  (SAMPLE run, goal "can't tie AI traffic to revenue"): after Brand Visibility goes on a CJA canvas, only 25 made-up
  customers own both, so the list says "Fewer than 30 customers own all of your canvas products, so this leaves out
  Brand Visibility" and uses the 673 CJA owners. On a 5-product canvas (CJA, Brand Visibility, AEM Forms, Acrobat
  Sign, Workfront) it leaves out AEM Forms, Acrobat Sign and Workfront first (not tied to the goal), then Brand
  Visibility, and again uses the 673 CJA owners.
- Keeping the goal's products to the last means a rare canvas is still judged on the products that matter for
  the goal.
- When the ladder reaches all customers: "Too few customers own these products together, so this is the share
  of all customers."
- The bar is drawn lighter (marked "rough") when the group has fewer than 100 customers or a product was left out.
- Smoothing (step 4) keeps a group of 30 to 100 from showing extreme numbers like 0.00 or 1.00 from a handful of
  customers.
- In the SAMPLE run, 62 of the 91 canvases the first page builds (each problem plus each refine chip) needed to
  leave something out, mostly because new products are rare. Expect the same with real data; the wording above
  is therefore the normal case, not an edge case.

## 5. Proving the numbers are honest

1. **Hand check (any time).** Every number opens to its arithmetic (section 2). The shipped counts file is
   readable: the row `"aa+cja": [539, ...]` is the 539 customers in the example (SAMPLE). A one-page "check pack"
   gives the boss five worked examples to redo; `nbp/out/run_proto_synthetic.txt` shows the format on made-up data.
2. **Split-half check (works with today's footprint only).** Build the counts from a random half of the
   customers; check the other half, which the counts never saw. For each canvas (every combination at least 10
   held-back customers own, plus every canvas the first page builds) the question is: "we said this number;
   of the held-back customers who own that canvas, what share own the product?" One check = one held-back
   customer, one canvas, one product. Results by band:
   `said 0.2-0.3: 239,563 checks, average said 0.247, share who own it 0.266` (SAMPLE, `nbp/out/check_split_synthetic.txt`).
   Reported separately for rare combinations (where products were left out), so the back-off is checked too: in the
   SAMPLE it runs a little low there (said 0.247, share 0.277), exactly the kind of thing this check exists to show.
   The same check picks the two settings: in the SAMPLE, minimum groups of 20, 30 and 50 customers scored almost the
   same (Brier score 0.0955, 0.0954, 0.0953; lower is better) and 0 to 100 pretend customers changed only the fourth
   decimal, so 30 and 10 stay unless the real data says otherwise (`nbp/out/min20`, `nbp/out/min50`).
3. **Must beat the simple list.** The same check is run for "share of all customers" (no canvas, no goal) and
   for a hide-one test (hide a product each customer owns; is it in the top 3?). If the canvas-based numbers do
   not beat the simple list, the page says so. In the SAMPLE data they beat it only slightly (top 3: 56% vs 53%),
   which is exactly the kind of result the boss should see before trusting the numbers.
4. **Real backtest (needs dates or a second snapshot).** Rebuild the counts as they stood 12 months ago; for each
   customer and each product they did not own then, did they buy it in the next 12 months? Same script, same
   page code, only the outcome changes. This is the test of "propensity to *buy*".
5. **Published.** A "How good are these numbers?" link shows the latest check (date, number of checks, the band
   table) to everyone. Only aggregates.
6. **Rules before partners see numbers:** every band with 500+ checks within 0.05 of what was said; beats the
   simple list; privacy check passes (section 8); data owner signs off. If the first two fail, the page keeps the
   goal ordering and shows only the share of all customers, labeled as such.

## 6. What the partner sees next to each product

![Mockup with sample numbers](mockup_transparent.png)
(`nbp/mockup_transparent.html`; every number on it is labeled SAMPLE on the picture.)

One row:
- **Rank**, and a **Next** badge on the first row.
- **Name** and the **fit tag** (Solves the goal / Builds on the goal / Connects to the goal / Not tied).
- **The number**, two decimals ("0.47", SAMPLE; anything under 0.005 shows as "under 0.01", never 0.00), and a **bar** from 0 to 1 with a thin mark at the share among all
  customers (so the bar shows at a glance whether this canvas raises or lowers it). Lighter bar = rough.
- **Customer count:** "256 of the 539 customers who own Adobe Analytics and CJA own it." (SAMPLE)
- **Short why** (one or two lines, all from the tool's files): the fit reason (the goal, the refine chip text, or
  the documented connection and its kind), "Lines to CJA on your canvas", and, when it is 1.2x or more different,
  "Customers who own Adobe Analytics and CJA own it 1.4 times as often as customers overall" (SAMPLE).
- **Left out** line when the ladder was used.
- **How this number was worked out** (folded): the arithmetic lines.
- **Add** (Create your own play) or **Add in Create your own play** (prebuilt plays, which cannot hold extra
  products: it moves the products and outside systems to Create your own play after a confirmation, as the first
  page's refine chips already do with "That moves the setup to Create your own play").
- Header of the list: the goal pill, the group ("Customers who own Adobe Analytics and CJA: 539", SAMPLE), the data date
  and population (in the form "Adobe Scale accounts, <month of the data>"), and one sentence: "Propensity is the share of customers
  who own everything on your canvas who also own the product. It is for planning, not a forecast."

Where it lives: on Create your own play, inside the Add product menu (a "Ranked for your client's goal" view on top,
today's grouped "All products" view one click away, the find box searches both). On every play, a **What they buy
next** button in the toolbar opens the same list.

## 7. Data needed

| Level | Data | What it unlocks |
|---|---|---|
| 1 (today) | One row per Scale account: the Adobe products it owns now (yes/no, from the per-product ARR breakdown: ARR above a small floor Adam picks = owns, so trials and leftovers don't count). A throwaway row key to count; no names, no ARR in the export. The snapshot date. | Everything above. The number means "share of similar customers who own it". |
| 1 | A mapping table: each WARROOM product line to one of the tool's 34 products (or "not in the tool"); tool products with no line marked "No ownership data". Adam reviews it once. | Correct numbers. |
| 0 (already in the tool) | `problems.json`: the 23 goals, their products and refine chips. `catalog.json`: 158 documented connections and the services. | The fit groups and the why text. |
| 2 | The month each account first owned each product, or the same export saved every month from now on (two snapshots 12 months apart are enough). | A true "bought within 12 months" number and the real backtest. Same page, same arithmetic, new label. |
| 3 | Goals next to outcomes: the goal travels in each SOW draft; if Adam collects SOWs and which products closed, or maps an opportunity "use case" field once to the 23 goals. | The number itself becomes goal-specific: "of clients with this goal who own CJA, the share that bought Brand Visibility". |
| later | Industry, only if every industry group still has 30+ customers. Never state. | An industry filter with the same ladder. |

**Version 1 with only today's footprint (no dates, no goal labels):** all of sections 1 to 6 work. The number is
labeled honestly as ownership ("47 of every 100 customers who own Adobe Analytics and CJA own Target", SAMPLE), not as a purchase
forecast; it cannot tell what was bought first. The split-half check proves the numbers match reality as ownership
shares. Start saving the monthly export now; in 6 to 12 months level 2 is possible with no other change.

## 8. Data protection

- **Offline, on Adam's machine:** the export (account-level) goes in; only counts come out. ARR is used only to
  decide "owns" and dropped. Names, account ids, ARR, industry and state never leave that step.
- **What ships:** product ids, then for each product set owned in full by 30+ customers: the group size and the
  number of those who own each product. No group smaller than 30 and no field other than these. The counts inside a
  group can be small ("10 of the 539", SAMPLE); they never point to an account, but the data owner can ask for them rounded
  (below).
- **Build check (`nbp/tools/nb_table.py`, `check_shippable`):** fails the build on any unknown field or product, any
  set under 30, any count larger than its group, or text that looks like money, ARR or an e-mail.
- **The page is reachable by URL** (Netlify; the site's own files only ask search engines not to index it, and they
  set no password). Anyone with the link can read the counts.
  Even counts are Adobe-internal (a line like "539 customers own Adobe Analytics and CJA" tells a partner how many
  customers own a pair), so the data owner must approve
  showing them, or the site gets a password or Adobe sign-in first. If coarser numbers are required, the offline
  step rounds the counts in the file (e.g. to the nearest 10) and the page computes from the rounded counts, so the
  hand check still works exactly.
- Partners never see an account. A group is never smaller than 30 customers.

## 9. Runtime in the static page

- The counts file is embedded at build time, like the catalog and problems today (`const NEXTBUY=/*NEXTBUY*/null;`,
  replaced by `build.py`). No server, no network call, works offline; everyone with the same build sees the same numbers.
- Size (SAMPLE runs, 3,000 made-up accounts): 35 KB at 3.4 products per account, 138 KB at 4.9, 731 KB at 7.0
  (12, 41 and 209 KB gzipped). The page is 1.48 MB today.
- Speed (SAMPLE, Node 22): a full ranking of every product for a canvas of 1 to 8 products takes about 0.1 ms (0.05 to 0.11 ms in the latest SAMPLE runs, on the 1,192-set table and on the largest,
  5,800 sets, while a browser test suite was running on the same machine).
  It runs on every add, remove and goal change; no worker or cache needed.
- Code (prototype `nbp/tools/nextbuy.js`, about 120 lines): `goalFit`, `rank`, `explain`. The page code and the
  check scripts call the same functions, so what is checked is what partners see.
- Data refresh: rerun the offline step monthly, rebuild, redeploy; the date on screen changes. A note appears if the
  data is older than 6 months.

## 10. Where it plugs in (for the build)

- `st.goal` beside `st.play`/`st.on`, validated on load against `PROBS`; set in the first page's Build this handler;
  kept by Change play; cleared in the Start over branch of `confirm-yes`; added to the draft format on the SOW steps.
- Create your own play: `menuHTML()`/`listHTML()` get the goal question or the ranked view on top.
- Every play: a toolbar button beside Change play opening the same list (`addwrap` is hidden on prebuilt plays today).
- Prebuilt plays: Add moves to Create your own play the way `pick()` with `data-start` does, carrying products and
  outside systems, after a confirmation.
- Tests (Playwright, like the other suites): asked once; kept through reload, draft save/open and Change play;
  cleared by Start over; order follows the fit groups; ladder text for a rare canvas; the page source contains no
  field but counts.

## 11. Risks

1. Owning is not buying: version 1 says what similar customers own, not what they bought next or why. Labeled as such; level 2 fixes it.
2. New products look weak: Brand Visibility, Coworker and Brand Concierge are likely to have low numbers because they are new. The goal keeps them on top and the "times as often" line shows the signal.
3. Popular products look strong everywhere (Analytics, AEM Sites, Acrobat). Goal-first order keeps them from crowding out the answer; the check must beat the plain most-owned list.
4. Product mapping errors make wrong numbers (one AEM Sites line for two deliveries; Sites Optimizer, Experimentation Accelerator, RT-CDP Collaboration may not be separate lines).
5. Scale accounts only: a partner's client may not look like them. The population is named on screen.
6. Confidentiality: aggregate counts are readable by anyone with the URL. Needs data-owner sign-off or access control.
7. Over-trust: a number like 0.80 may be quoted to a client as a forecast. Labeled "for planning, not a forecast".
8. Small real gain: in the SAMPLE data the canvas-based numbers beat the plain list only slightly. If real data is the same, the goal ordering carries the value and the page should say the numbers add little.
9. Editorial fit: "Solves" and "Builds on" come from problems.json, written by Adam's team. Every reason names its source, so it can be checked and changed.
10. Products that replace each other (a refine chip swaps Journey Optimizer for Marketo email) could both be suggested; the swap note from that chip should show.
11. Stale data: shown date, monthly refresh, warning after 6 months.
12. Goals outside the 23: the matcher offers the nearest; "None of these fits" gives an unranked-by-goal list, labeled.
13. Too few accounts: with a few hundred Scale accounts most combinations fall back to one product or to everyone (the SAMPLE half of 1,500 made-up accounts kept 530 sets, the full 3,000 kept 1,192). The page still works and says so, but the numbers say less. Adam's first export answers this in minutes: count the sets with 30+ customers.

## 12. Effort

| Piece | Days |
|---|---|
| Offline step: read the export, map products, build counts, safety check, split-half and hide-one checks, one-page report (prototype exists) | 2 to 3 |
| Goal question, pill, keeping and clearing it, draft format | 1.5 to 2 |
| Ranked list in the Add product menu, toolbar panel on every play, rows with number, bar, count, why, arithmetic, move to Create your own play | 2 to 3 |
| Playwright suites and the check pack for the boss | 1.5 to 2 |
| **Total build** | **about 7 to 10 working days** |
| Adam's side: export, mapping review, data-owner sign-off | 1 to 2 weeks elapsed |
| Level 2 (dates or snapshots), once the data exists | about 2 more days |

## 13. Decisions for Adam

1. Show exact customer counts to partners, or rounded (nearest 10)? (Data owner.)
2. Password or Adobe sign-in on the site before any counts ship?
3. Allow "None of these fits", or always require a goal?
4. On prebuilt plays, may Add move the canvas to Create your own play (with a confirmation), or only show the list?
5. Name on screen: "Propensity to buy" (the boss's words, with the definition line) or "Owned by similar customers" until level 2?

## Files

- `nbp/design_transparent.md` (this file), `nbp/mockup_transparent.html` and `.png` (sample numbers, labeled).
- `nbp/tools/goal_tiers.py` -> `nbp/out/goal_tiers.json`: the fit groups for all 23 goals from the real files.
- `nbp/tools/nb_table.py`: builds the counts and the shipping check. `nbp/tools/synth_and_table.py`: SYNTHETIC accounts.
- `nbp/tools/nextbuy.js`: the browser logic. `nbp/tools/run_proto.js` -> `nbp/out/run_proto_synthetic.txt`: worked examples and timing.
- `nbp/tools/check_split.js` -> `nbp/out/check_split_synthetic.txt`: split-half calibration, hide-one ranking, back-off rate.
- `nbp/tools/edge_cases.js` -> `nbp/out/edge_cases_synthetic.txt`: no goal, outside systems, AEM Sites as one row, a product with no ownership data.
- `nbp/tools/doc_examples.js` -> `nbp/out/doc_examples_synthetic.txt`: every worked example quoted above, recomputed.
- `nbp/out/min20`, `nbp/out/min50`: the same check with minimum groups of 20 and 50; `nbp/out/size_d0.5`, `nbp/out/size_d1.0`
  and `nbp/out/timing_largest_table.txt`: file sizes and speed at 3.4 and 7.0 products per account.
- The made-up accounts are reproducible: the same seed gives byte-identical accounts and tables on every run.
- Everything runs from the read-only build: `python3 -I nbp/tools/synth_and_table.py <build26/wt> nbp/out 3000 7 30 6 0.7`, then the `.js` scripts with `node <script> <build26/wt> <table>` (`check_split.js` takes the half table and the held-back half file).
