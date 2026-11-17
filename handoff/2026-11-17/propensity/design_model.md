# What they buy next: the client's goal first, then an honest propensity to buy

Design for Adam's boss's idea (Nov 17) and Adam's follow-up ("before we even recommend the next product, it should ask: what are you trying to accomplish?"). Angle: the most accurate method. That means one small, checked model per product, combined with the goal the partner picks once, so that any set of products on the canvas gets a number at once in the browser, and 0.80 really means about 8 in 10.

Status: design only. Nothing in the live tool or in build26 changed. A working prototype of the offline training and checks, and of the in-browser scoring, is in `nbp/proto/`. It was tested on synthetic data, which is invented and labeled as such everywhere. No Adobe data and no WARROOM data was read.

---

## 1. In plain words

1. **Ask the goal once.** The first time a partner asks "what's next?" on a canvas, the tool asks: *What is your client trying to accomplish?* The partner taps one of the 23 problems the first page already offers. If they built the canvas from the problem box, the tool already knows the goal and never asks. The answer stays with the canvas until they change it or start over.
2. **The goal decides which products are on the list, and their order.** The tool already knows, for certain, which products each problem calls for and which products connect. Products that solve the goal come first, then products that build on it, then products that connect to it. Everything else sits under "Other products". Every next product resolves to the first goal, as Adam asked.
3. **Adobe's sales data decides the number.** For each product there is one small model trained on Adobe customers: "of customers who have these products, in this industry, how many bought this product within a year?" The model adds up a nudge for each product on the canvas, so any combination gets a number at once, including combinations no customer has. The page runs this; it needs no server.
4. **Every number is checked before partners see it.** We pretend it is a year ago, train only on what was known then, and compare the tool's numbers with what customers then bought. If the tool said about 0.3, about 3 in 10 must have bought. Products that fail, are too new, or have too little history show no number and say why.
5. **The goal can move the number only once it can be measured.** The sales data doesn't record why a customer bought. Until a few hundred deals are tagged with one of the 23 goals, the goal orders the list and writes the "why", and the number comes from sales data alone. A guessed weight never changes a number that looks measured.
6. **Partners never see an account.** Training happens offline. Only model weights and rounded totals of at least 20 customers go into the page. No names, no ARR, no states.

What to expect: honest 12-month numbers for enterprise software are usually small. As an illustration (not data), a 0.12 can be a strong signal when the usual rate is 0.03. The first real backtest will show the actual range. The tool never shows a number above the highest range the backtest has proven (for example, "0.30 or more").

---

## 2. The one-time goal question

### Where it appears

| How the partner got to the canvas | What happens |
|---|---|
| **The problem box on the first page** ("Not sure which play? Start from your client's problem") | **Build this** saves the problem as the canvas's goal. The question is never asked. If the box heard two problems (its "Two problems here" case), both are kept and the one it led with comes first. |
| **A play card** (the five Brand Visibility plays, Adobe Coworker) | The first time the partner opens **What they buy next**, the panel opens on the question. The problems that lead to this play come first (from `problems.json` → `play`: Coworker → "My client's team is buried in routine work"; Brand Visibility + CJA → "My client can't tie AI traffic to revenue"; and so on), then **See all problems**, grouped by the five headings the first page uses. |
| **Create your own play** | The first time the partner opens **Add product**, the menu opens on the same question above the product list. |

One tap answers it. The partner can also type the problem; the tool reuses the first page's matcher (`bpAsk` / `bpScore`) to suggest the closest of the 23. **None of these** is allowed: the list is then ranked by sales data alone, under the note "No goal picked: ranked by sales data alone". **Skip for now** leaves the menu working as it does today, without numbers, so the question never blocks adding a product.

### Asked once per canvas

The question shows only while the canvas has no goal. Adding, removing, reopening the menu, reloading the page or going to the SOW steps and back never asks again.

### How the answer is kept

- New canvas state: `st.goal = {id: "ai-traffic-revenue", also: [], from: "problem-box" | "asked"}` and `st.industry = "fsi" | null`.
- `save()` already writes `st` to the browser (key `abv-sow-build-v1`), so the goal survives reloads. On load, an id that isn't in `problems.json` any more is dropped, the same way the page drops unknown play ids today.
- The handoff to the SOW steps (`publish()` → `abv-sow-handoff`) gains a `goal` field. That way Save draft files keep it, Open draft restores it, and the SOW can say what the client is trying to fix (optional).
- **Start over** clears it. **Change play** keeps it, because it is the same client.

### How it is changed

At the top of the panel and of the Add product menu there is a chip: **Goal: My client can't tie AI traffic to revenue · Change**. Change reopens the list with the current goal marked. Changing the goal re-ranks the list and never touches the canvas. The industry sits beside the chip as a small optional choice, "Industry: Not sure ▾". The financial-services problem pre-fills Financial services.

---

## 3. How the goal enters when the sales data has no problem labels

WARROOM's account records have the product footprint, ARR, industry and state, but not why anyone bought. So the data can't measure how much a goal raises the chance of buying a product. The design keeps two things apart: what we know for certain (the goal's products and the documented connections) and what we measure (the number). They are joined only in ways that don't fake a measurement.

### Stage 1, now: the goal picks and orders the candidates

Each product's **goal fit** is computed from the tool's own files (`nbp/proto/goal_tiers.py`, run on the real `problems.json` and `catalog.json`):

| Tier | Meaning | Source |
|---|---|---|
| 1 Solves the goal | the goal's own products | `problems.json` → `products` |
| 2 Builds on the goal | products the goal's refine chips add | `problems.json` → `refine[].add` |
| 3 Connects to the goal | products with a documented connection to a tier-1 product | `catalog.json` → `connections` |
| Not tied to the goal | everything else | collapsed under "Other products" |

Outside systems (CDN, CRM, warehouse and the rest) are never ranked, because nobody buys them from Adobe. Each goal ties between 7 and 26 of the 34 Adobe products (median 18), so the goal cuts the list roughly in half before any number is involved. The full table is in the appendix.

**Order:**
1. Tier 1 in the order the goal lists its products. This is the setup that solves the problem, and its products may be too new to have a number.
2. Tier 2, highest number first.
3. Tier 3, highest number first.
4. "Other products", collapsed, highest number first.

Inside tiers 2 to 4, a product with no number comes after the numbered ones.

**Adam's example, checked against the real files.** Goal "My client can't tie AI traffic to revenue", client already has CJA. The list starts with **Brand Visibility** (tier 1), then **Coworker** (tier 2, from the refine chip "My client's leaders want readouts on request"), then the 11 Adobe products that connect to Brand Visibility or CJA, ranked by number. Brand Visibility is first because the goal calls for it, and the number beside it is whatever the sales data honestly supports, including "too new to score".

**The boss's example.** Coworker play, goal "My client's team is buried in routine work". First come the four apps that goal's refine chips name: AEM Sites, CJA, Marketo Engage and Workfront. These are also the documented answer to "what should they already own?". Then come the 13 other products Coworker connects to. Once Coworker has enough buyers to be scored, its own model answers the same question from sales data. The products with the biggest nudge toward Coworker are what its buyers tended to own first, and the About these numbers page can list them (aggregate only).

### After the first product: the canvas carries the goal

Once the goal's products are on the canvas, the model already conditions on them. "Customers who have Brand Visibility and CJA" are, in effect, customers who went down this goal's path. So each next number reflects that path without anyone tagging it, and the goal keeps filtering and ordering the list.

### Stage 2, when deals are tagged: the goal moves the number, measured

The goal's effect on the chance to buy becomes measurable once a few hundred **won and lost** opportunities are tagged with one of the 23 goals. Lost ones are needed because won deals alone can't show how much the goal raises buying. Three possible sources, in order of preference:

1. a use-case field on Adobe opportunities, if one exists, mapped once to the 23 goals;
2. a one-time tagging of about 300 recent opportunities by the account teams;
3. the tool's own SOW files, which will carry the goal id, matched offline to what the client later bought.

The goal then enters the model as **one learned nudge per tier**: three numbers in all, shared by every product. They are fitted on the tagged deals on top of the sales-data number (the sales-data score is held fixed as a starting point, a standard "offset"), pulled toward zero when the data is thin, recalibrated, and checked on tagged deals held back. They ship only if the check passes. Before that, no guessed "goal multiplier" ever touches a number.

---

## 4. What the number means

| Data available | The number | Wording on the page (example numbers, not data) |
|---|---|---|
| **Purchase dates** (a start date per product, or yearly footprint snapshots for 3 or more years) | chance the client buys the product **within 12 months**, given the products on the canvas and the industry | "0.34 · about 1 in 3 similar clients bought it within a year" |
| **Only today's footprint** (no dates) | share of similar customers who **own** the product today | "0.62 · owned by about 6 in 10 similar customers". The panel title says "How common each product is among customers like this", not "propensity to buy". |

The canvas is read as the client's footprint once this SOW is delivered. The panel says so: "Assumes your client has everything on the canvas." The order in which products were added never matters; only the set does.

---

## 5. The math in plain words

**For each product** (34 small models, trained offline):

1. **Start** from how often customers in the client's industry buy the product in a year.
2. **Add a nudge for each product on the canvas.** Owning CJA might raise the chance of buying Brand Visibility; owning something unrelated adds about nothing. The nudges are learned from all customers at once, so two products that are always sold together don't get counted twice.
3. **Pull every nudge toward zero unless many customers back it up.** This is shrinkage, and how hard it pulls is chosen by testing on held-out customers. A product owned by 15 customers can barely move anything.
4. **Turn the total into a number between 0 and 1** with the logistic curve.
5. **Correct it on held-out data** so that 0.3 means 3 in 10. This is calibration: two numbers per product that stretch or squeeze the scale. The pipeline also tries a finer, step-shaped correction and keeps whichever holds up in the backtest.
6. **Give a range** from how sure each nudge is (80% of the time the true rate falls inside it). Rare products and rare combinations get wide ranges.

**Then the goal** sorts the products into tiers (section 3). **In the page**, for each product not on the canvas: add up the start value and the nudges of the canvas products, apply the curve and the correction, and work out the range. That is a few hundred multiplications per product.

**For the implementer.** This is L2-penalized logistic regression, one model per product. The inputs are up to 33 owned flags (the other catalog products, each held by at least 20 accounts) plus one-hot industry groups. The penalty is chosen by 5-fold cross-validation grouped by account, on log-loss. Calibration is Platt or isotonic on out-of-fold predictions, whichever holds on the test year; isotonic only with at least 50 buyers. The range comes from the Laplace covariance (inverse penalized Hessian): `z ± 1.28·√(xᵀΣx)`, passed through the calibration. When the industry is "Not sure", the page averages the industry-specific numbers, weighted by industry share. Gradient-boosted trees are run in the backtest as a challenger. They replace the logistic model only if they are clearly better on the held-out year; they are bigger to ship and harder to explain. Pairwise interactions (for example "Real-Time CDP *and* CJA together") are added only where at least 50 customers own both and the backtest improves. A "years since the product's first sale" input is tried the same way. It lets a model follow a new product's ramp-up instead of being flagged "off" for it, and it stays only if the held-out year agrees.

**Size.** ARR is Adobe spend, and a partner can't know it, so it isn't a page input. A footprint the partner can't enter would make the page's input differ from the training input. The training checks whether an ARR band would add much. If it would, a partner-answerable size question (company revenue band) is added only if WARROOM holds such a field. The number of products on the canvas already carries much of size.

---

## 6. Any combination of 1 to 5 or more products

- The model **adds** one nudge per canvas product. It never needs a table of combinations: 34 products make about 17 billion possible canvases, and no table could hold them, but the sum works for any of them.
- **One product:** the number is mostly the industry start plus that product's nudge. Expect modest numbers.
- **Two to five products:** the nudges add up, and because the model learned them together, correlated products don't double-count. The range narrows when the combination is common and widens when it isn't.
- **More than the training ever saw** (for example, 12 products): the model still answers, but the range widens and the number can't pass the display cap. Footprint-size buckets are part of the calibration check, so the backtest shows whether large footprints are over-confident.
- **Outside systems** on the canvas don't change any number; they still feed the "why" through their documented connections.
- **The permutations change every time**, as the boss put it: each add or remove re-scores all 34 products in well under a millisecond.

---

## 7. Rare combinations and new products

| Case | What the page does |
|---|---|
| The exact combination is rare | The number still comes from the individual nudges. The customer count reads "Fewer than 20 customers have all of these; the number combines what each product shows on its own." The range is wide. |
| A canvas product is rare (few owners) | Shrinkage keeps its nudge near zero, so the number leans on the other products and the industry. The "why" won't cite it. |
| The candidate product is **new**: fewer than 30 buyers in the training years. Brand Visibility, Brand Concierge, Coworker and the other agentic products may well be here at first | No number: "New product: too few sales yet to score." It still ranks by goal (tier 1 first), with the goal and connection "why". This is likely what Adam's own example shows at first, and the design says so rather than inventing a number. |
| Fewer than 10 buyers in the test year | "Not checked yet: no number." |
| The test year disagrees with the model (said total and bought total too far apart, for example a product still ramping up after launch) | "Recent sales don't match the pattern: no number this quarter." The "years since first sale" input (section 5) is the planned fix for ramp-ups. |
| The model can't tell the product's buyers apart (AUC under 0.6) | "No pattern by product mix: no number." |
| Any number above the highest proven range | Shown as "0.30 or more", with the cap set by the backtest. |

Each quarter's retraining moves new products from "too new" to "scored" as their sales history builds.

---

## 8. Proving the numbers are honest

### The backtest (with purchase dates)

Pretend it is November 2025. Train on footprints at earlier cutoffs (Nov 2022, 2023 and 2024), each with what customers bought in the following 12 months. Then score every customer as of Nov 2025 and compare with what they actually bought by Nov 2026. Nothing from the test year is used in training; the script refuses to run otherwise. After the check passes, the shipped model is refitted on all complete years.

### Without dates (snapshot only)

Train on 4 in 5 customers and check on the 1 in 5 held out:

- **calibration:** of held-out customer-product pairs where the tool said about 0.6, do about 6 in 10 own the product?
- **hide one:** hide one product a held-out customer owns; is it in the tool's top 3?

This proves "how common among similar customers", not timing.

### What is checked, and the gates

1. **Calibration table: does 0.3 mean 3 in 10?** Group every customer-product pair by what the tool said (0 to 0.02, 0.02 to 0.05, 0.05 to 0.1, 0.1 to 0.2, 0.2 to 0.3, 0.3 to 0.5, 0.5 to 0.7, 0.7 to 1). In each group, compare the average said with the share who bought. A group passes when the gap is within chance (95% range), or less than 1 point plus a tenth of the number. That means 0.30 may really be 0.26 to 0.34.
2. **Display cap.** Walk up the scale; the cap is the top of the last group that passed with at least 100 pairs. The page never shows a number above it.
3. **Better than the simple ways.** The Brier score must beat "each product's overall rate". The share of customers whose actual purchase was in the top 3 must beat both "most popular products" and "customers with product Y bought X". If the model doesn't beat the simple ways, the simple way ships instead.
4. **Per product:** at least 30 buyers in training, at least 10 in the test year, said total within 3 standard deviations of bought total, and AUC of at least 0.6. Otherwise the product shows no number and says why (section 7).
5. **Slices:** the calibration table is also run by industry and by footprint size, so the tool isn't right on average but wrong for small footprints.
6. **Every quarter,** on each data refresh, the whole check reruns and the page shows the date and result.

### What the synthetic test showed about the method

This is synthetic data, invented, not Adobe's. These findings are about the method, not about Adobe products.

- Out of the box, the finer step-shaped correction (isotonic) was over-confident at the top of the scale in the held-out year. The two-number correction (Platt) held in every group with enough pairs. That is why the pipeline compares the two and keeps the one that holds.
- Products still ramping up after launch were under-predicted in the test year. The "said vs bought total" gate caught them automatically, and the page would show no number for them.
- A few products' models ranked buyers no better than chance. The AUC gate removed their numbers.
- The top of the scale had too few pairs to prove anything. The display cap turned those numbers into "0.30 or more".
- The model beat both simple baselines on top-3 hits. That says nothing about how much it will beat them on real data; the first real backtest will.

### What partners see about the proof

An **About these numbers** link opens a page with the calibration table (rounded counts), the top-3 result against the simple ways, the training date, the population ("about N Adobe customers, rounded to 100") and the rules above. Every item is aggregate.

---

## 9. What the partner sees next to each product

### Where

- **Create your own play:** the Add product menu (`menuHTML` / `listHTML`) gets a ranked section on top, "What they buy next, for your client's goal", holding tiers 1 to 3. Below it, today's browse groups ("Connects to your canvas", then Adobe's headings) stay for every other product, so each product appears once and the Find box still searches them all.
- **Every play, prebuilt plays too:** a new toolbar button, **What they buy next**, beside Add product and Change play, opens the same list as a panel. On a prebuilt play, **Add** asks once: "Adding a product makes this your own play, starting from the products on it. Your service choices stay." It then switches to Create your own play with the play's products, line choices and outside systems kept. There is precedent: refine chips already move a setup to Create your own play.

### One row

```
Journey Optimizer                                  0.12  [bar 0 to 1, with a pale 0.08-0.17 range]   [Add]
Connects to the goal · Native integration with Customer Journey Analytics
Customers with CJA bought it 3 times as often as those without (9 vs 3 in 100, last year)
Based on 560 customers who have CJA
```
(The numbers above are samples, not data. In the same list, Brand Visibility sits above it in tier 1, possibly reading "New product: too few sales yet to score".)

- **The number:** two decimals, in the boss's style (.34, .99), with "about 1 in 3" as its tooltip and spoken label (no hover needed on phones; the words are on the About page too). Below 0.05 it reads "under 0.05"; above the cap, "0.30 or more". In snapshot mode the wording is "owned by about 6 in 10 similar customers".
- **The bar** always runs from 0 to 1, so a small number looks small. The faint band is the 80% range.
- **The why** (one line, no more than three parts, each from a real source):
  - **Goal part.** Tier 1: "Solves the goal", with the goal's own why sentence when it names the product (as the problem box does now). Tier 2: the refine chip ("Builds on the goal: your client's leaders want readouts on request"). Tier 3: "Connects to Brand Visibility", with the connection's kind and label from `catalog.json`.
  - **Data part:** the canvas product that pulls this one up most, with its plain rates from the rounded totals ("Customers with CJA bought it 3 times as often…"). It is shown only when both groups have at least 20 customers and 10 buyers.
- **The customer count:** for example "Based on 560 customers who have CJA" (sample number). This counts customers who own all the canvas products, rounded to 10, for canvases of up to 3 products, shown only at 20 or more. Otherwise it reads "Fewer than 20 customers have all of these…".
- **Unscored products** show the reason in place of the number (section 7), and keep their goal and connection why and their Add button.
- **The panel header:** "Goal: … · Change", "Industry: Not sure ▾", "From Adobe sales data, trained Nov 2026 on about N customers, checked against 2025-26 purchases · About these numbers".
- **With no data file loaded (today):** goal order and the why only, no numbers, and "Numbers appear once Adobe's sales data is loaded and checked." The page never shows a placeholder number.

There is a sketch of the panel in `nbp/proto/mockup_panel.html`. Every number in it is labeled on the picture as a sample.

---

## 10. Data needed

**Already in the tool:** the goal fit (`problems.json`: each goal's products and refine products; `catalog.json`: 158 documented connections). This is all of stage 1's ordering and why.

**From Adam's account export (WARROOM), kept off the repo and the site:**

1. One row per account in the training population (for example, Adobe Scale accounts): a random key (never the account name) and the industry, mapped to about 8 to 10 groups with at least 20 accounts each.
2. The product footprint: which of the tool's 34 Adobe products each account has. WARROOM product names are mapped to the tool's ids, editions are collapsed (CJA Select, Prime and Ultimate count as CJA), and bundles count as each product in them.
3. **For a real 12-month propensity:** a start date per product per account (and end date if dropped), or yearly snapshots of the footprint for the last 3 or 4 years. One question settles which version ships: *does WARROOM keep per-product ARR or contract start dates by year?* Per-product ARR by fiscal year is enough to rebuild yearly snapshots.
4. A mapping table from WARROOM product and SKU names to tool ids, checked by Adam.
5. **Later, for the goal to move the number:** about 300 won and lost opportunities tagged with one of the 23 goals (section 3, stage 2).

**What works with only today's footprint (no dates, no problem labels):** the goal question, tiers, order and why, all from the tool's own files. On top of that, the same per-product models trained on "owns it", which give honest "owned by N in 10 similar customers" numbers checked on held-out customers. What it can't give is "chance to buy within a year". The page says so, and the wording changes when dates arrive.

**Never needed and never shipped:** account names, ARR values (offline at most, to test whether size adds anything), states, contacts.

---

## 11. Data protection

- **Training is offline,** on a machine where Adam may hold the export. The export never enters the repo, the build or the site.
- **What ships** (`propensity.json`, inlined into the page by `build.py`):
  - per product: a start value, about 40 weights, a covariance table for the range, and a two-number calibration;
  - the status of each product;
  - rounded, suppressed totals: customer counts for canvases of up to 3 products, and pair rates for the "why";
  - the backtest summary.
  It holds no account keys, names, ARR, states or account-level dates.
- **Small-count rules:** no count under 20 customers ships (and no buyer count under 10). Counts are rounded to 10, and the customer counts are never split by industry. Industries are coarse groups (the script refuses a group under 20 accounts), and state isn't used. A product gets a model only with at least 30 buyers. A product or industry is used as an input only when at least 20 accounts have it; otherwise it is left out, so no weight rests on a handful of accounts.
- **Automatic leak check:** the training script refuses to write the file if any account key, any ARR value, a forbidden field (`arr`, `account…`, `name`, `state`, `revenue`), or any unrounded or small count would ship. This is built and passing in `nbp/proto/train_propensity.py`.
- **Approval first:** even aggregate install-base rates are Adobe-confidential business data. Before any partner sees a number, Adam gets data-governance or legal sign-off on exactly what ships. Until then, an **internal build** (Adobe staff, counts shown) and a **partner build** (numbers only, counts shown as ranges or hidden) can be produced from the same file by a build switch. If approval requires it, the partner build is hosted behind the partner login rather than on a public URL.

---

## 12. Runtime in the static page

- `build.py` inlines `propensity.json` the way it already inlines the catalog: `const PROP = /*PROPENSITY*/null;`. If the file is absent, the page runs in "goal order only" mode.
- Size: about 170 to 240 KB in the synthetic test with 34 products, most of it the covariance tables. The page is already about 1.4 MB.
- Speed: measured at **about 0.15 ms per canvas change** for all 34 products, with ranges and the "Not sure" industry averaging (5,000 random canvases of 1 to 6 products, in node, `nbp/proto/score.js`). It re-scores on every add, remove, goal change or industry change.
- No network calls, no accounts, nothing sent anywhere. Goal tiers are computed in the page from `problems.json` and the catalog, which the page already has.

---

## 13. Risks

1. **Snapshot data measures ownership, not buying.** "6 in 10 similar customers own it" overstates the near-term chance for a client who has gone years without it. Mitigation: the snapshot wording, and get dates (or yearly snapshots) before saying "propensity to buy".
2. **New products have no history.** Brand Visibility, Coworker, Brand Concierge and the other agentic products may show "too new to score" at first. That includes the first product in Adam's own example and the boss's Coworker question. Mitigation: they still rank by goal with a documented why, and each quarterly retrain moves them to scored as sales build.
3. **Expectations.** Honest 12-month numbers are likely to be mostly well under 0.5. A tool built to show ".99" would have to lie. Mitigation: say this to the boss up front, and use the order, the why and the plain pair rates to carry the comparison.
4. **No goal labels yet.** The goal can't change the number until tagged deals exist. Adam's "the problem drives the propensity" is met at first through order and eligibility. Mitigation: start collecting tagged won and lost opportunities now (section 3).
5. **Permission to use account data for a partner-facing tool,** even as aggregates. Mitigation: sign-off before launch, internal and partner builds, partner-login hosting.
6. **Re-identification through small groups** (a rare product in a small industry). Mitigation: suppression at 20, rounding, coarse industries, no state or ARR, and the automatic leak check.
7. **Product mapping errors:** SKU names, editions and bundles mapped to the wrong tool id give wrong numbers. Some tool products are options of one license that sales data can't tell apart. Edge Delivery and traditional AEM Publish are both AEM Sites; `problems.json` notes that Sites Optimizer "is licensed with AEM Sites as a Cloud Service or Managed Services". Mitigation: a mapping table Adam reviews; a test that every mapped SKU lands on one id; and products that are options of one license share one model, with the number shown once on the AEM Sites offering.
8. **Population mismatch:** the model learns from Adobe Scale accounts, while partners' clients may be smaller or newer. Mitigation: name the population on the page, and check calibration by footprint size.
9. **Bundled products** score near the top only because they are sold together, which is not news to a partner. Mitigation: map bundles explicitly, and let the why say "usually sold together" when the pair rate is near 1.
10. **Drift and feedback:** launches, renames and the tool's own suggestions change buying. Mitigation: quarterly retrain and backtest, the training date shown on the page, and backtests kept on data from before the tool launched.
11. **Misreading a number as a promise.** Mitigation: "about 1 in 3 similar clients bought it within a year — not a forecast for this client" under the panel title, and the range band on every bar.
12. **The canvas mixes owned and proposed products.** The numbers assume the SOW is delivered. Mitigation: the panel says so.

---

## 14. Effort

These are estimates; data access and approval time are not counted.

| Work | Days |
|---|---|
| Export from WARROOM, map product names to the 34 ids, check dates | 2 to 4 (Adam plus someone with access) |
| Adapt the tested prototype pipeline to the real export, first backtest, review with Adam, set gates | 3 to 5 |
| Data-protection review: decide what ships, internal vs partner build | 1 to 2 of work, plus approval time |
| Page: goal question and state (`st.goal`, `st.industry`, handoff, drafts, Start over) | 2 to 3 |
| Page: ranked list in Add product, the What they buy next panel on every play, the prebuilt-play add flow, no-data mode | 3 to 4 |
| Page: About these numbers | 1 |
| Click tests (a new suite, plus updating the suites that check the Add product menu) | 2 to 3 |
| **v1 total** | **14 to 22 working days, about 3 to 4 weeks**, with dated or snapshot data, whichever exists |
| Stage 2 (the goal moves the number) | about 1 week once about 300 tagged opportunities exist |
| Quarterly refresh | about half a day: rerun the script, read the report, rebuild |

---

## 15. What was built and checked for this design (`nbp/proto/`)

| File | What it is | Checked |
|---|---|---|
| `goal_tiers.py` → `out/goal_tiers.json`, `out/goal_tiers_table.md` | Goal fit for all 23 goals from the real `problems.json` and `catalog.json`. No numbers, no sales data. | Adam's example ranks Brand Visibility first; the Coworker example gives AEM Sites, CJA, Marketo and Workfront first |
| `train_propensity.py` | Offline training in numpy only. Two modes (dated, snapshot), per-product shrinkage chosen by grouped cross-validation, Platt or isotonic calibration, the backtest, the calibration table with display cap, baselines, product gates, the rare-input and small-industry rules, the export with suppression and rounding, and the automatic leak check. | Runs in about 23 s (dated) and 8 s (snapshot) on 3,000 synthetic accounts; the leak check passes; no account key in the output |
| `synthetic_accounts.py` → `synthetic/` | **SYNTHETIC** accounts and holdings with invented buying rules, used only to test the code | Labeled synthetic in the files and in the output |
| `out_dated/`, `out_snapshot/` | `propensity.json` and `backtest_report.md` from the synthetic run. **The numbers are invented.** | Calibration table passes in every group with enough pairs; cap 0.30 (dated) and 0.70 (snapshot) |
| `out_cal_isotonic/`, `out_cal_platt/` | The same dated run with each calibration, for the comparison in section 8. Synthetic. | Isotonic misses at 0.30 to 0.50 (said 0.36, bought 0.26, 100 pairs); Platt holds in every group it can judge |
| `score.js` | The in-browser scoring: tiers, numbers, ranges, the why pair and the customer count | About 0.15 ms per canvas change |
| `mockup_panel.html` | A sketch of the panel: goal chip, industry, tiers, number, bar with range, why, count, and the no-number states. Every number is labeled SAMPLE on the picture. | Layout sketch only |

Not in the prototype yet: the tree challenger, pairwise interactions, the calibration slices by industry and footprint size, and the stage-2 goal nudge. These are designed above and get built against the real export.

---

## Appendix: goal fit for the 23 preloaded goals (from the real files)

Adobe products only; outside systems are never ranked. Tier 1 is in the goal's own order, which is the order the list uses. Tier 3 is "connects to a tier-1 product", and the last column is the number of products not tied to the goal (of 34).

| Goal (chip) | Leads to play | 1 Solves the goal | 2 Builds on the goal | 3 Connects to the goal | Not tied |
|---|---|---|---|---|---|
| My client is missing from AI answers | abv | Brand Visibility | Brand Concierge, CJA, Commerce, Edge Delivery, Sites Optimizer | 1 product | 27 |
| My client can't tie AI traffic to revenue | cja | Brand Visibility, CJA | Coworker | 11 products | 20 |
| My client's search traffic is dropping to AI overviews | aem | Brand Visibility, Sites Optimizer, Edge Delivery | AEM Assets, AEM Sites, Coworker | 8 products | 20 |
| My client's website is slow | aem | Brand Visibility, Sites Optimizer, Edge Delivery | AEM Forms, AEM Sites, Marketo, Target | 8 products | 19 |
| My client has an SEO backlog and no developers | aem | Brand Visibility, Sites Optimizer, Edge Delivery | AEM Sites, Coworker | 9 products | 20 |
| My client's products are wrong in AI shopping answers | commerce | Brand Visibility, Commerce | AEM Assets, Brand Concierge, Edge Delivery | 6 products | 23 |
| My client's banking or insurance customers call about accounts, policies or rates | fsi | Brand Visibility, Brand Concierge | AEM Sites, CJA, Marketo | 6 products | 23 |
| Visitors can't find answers on my client's site | custom | Brand Concierge, Edge Delivery | Brand Visibility, Commerce | 12 products | 18 |
| My client's team is buried in routine work | coworker | Coworker | AEM Sites, CJA, Marketo, Workfront | 13 products | 16 |
| My client's team spends too long pulling reports | custom | Coworker, CJA | Brand Visibility, Journey Optimizer | 17 products | 13 |
| My client's site shows everyone the same thing | custom | Real-Time CDP, Target, AEM Sites | CJA, Edge Delivery, Marketo | 18 products | 10 |
| My client's messages go out on a calendar | custom | Real-Time CDP, Journey Optimizer | AEM Assets, AEM Sites, CJA, Marketo | 17 products | 11 |
| My client never follows up on abandoned carts | custom | Commerce, Journey Optimizer, Real-Time CDP | Brand Visibility, CJA, Target | 18 products | 10 |
| My client's content takes too long to launch | custom | Workfront, AEM Assets, AEM Sites | Coworker, Journey Optimizer, Marketo | 20 products | 8 |
| My client's teams use off-brand images | custom | AEM Assets, AEM Sites, Journey Optimizer | Commerce, Edge Delivery, Marketo | 20 products | 8 |
| My client's B2B leads go cold | custom | Marketo, Real-Time CDP | Brand Concierge, CJA, Edge Delivery, Target | 18 products | 10 |
| My client can't see which channels work | custom | CJA, AEM Sites, Journey Optimizer | Brand Visibility, Commerce, Marketo, Target | 16 products | 11 |
| My client's customer data is scattered | custom | Real-Time CDP, CJA, AEM Sites, Journey Optimizer | Commerce, Edge Delivery, Marketo | 19 products | 8 |
| My client's store is slow and hard to change | custom | Commerce, Edge Delivery | AEM Assets, Brand Concierge, Brand Visibility | 9 products | 20 |
| My client's sales reps research and email every lead by hand | custom | Marketo Qualifier, Marketo | Brand Concierge, Marketo Optimizer | 14 products | 16 |
| My client's website chats never reach a salesperson | custom | Brand Concierge, Marketo Qualifier | Marketo | 8 products | 23 |
| My client sends every lead down the same nurture path | custom | Marketo Optimizer, Marketo | Coworker | 15 products | 16 |
| My client's ad audiences are out of date | custom | Marketo Optimizer, Marketo | Coworker | 15 products | 16 |
