# ChatGPT's tasks for round 2 of the method knowledge base (Nov 13 2026)

You are helping build the knowledge base behind an RFI response tool for Adobe implementation partners (Adam Higdon's SOW
generator and RFI Builder). The tool answers a client's RFI with no AI at run time: it matches each question to services in a
partner's catalog and builds the answer from each service's method entry. Round 1 scored 4.2 out of 10 with no AI, against 7.5 for
AI-written answers; the biggest loss was matching a question to the wrong service. Round 2 adds phrases for matching and a short
topic playbook. Your work is the independent check: a test RFI we never tuned on, a blind judge, and a second set of phrases.

Work on a new branch, `chatgpt/kb-round2`, created from the latest `claude/amazing-volta-go9ton`, and write only inside
`sow/rfp_prototype/kb_method/chatgpt_round2/`. Do the tasks in this order and commit after each one (and after each phrase batch),
with a one-line message. Do not change any other file.

## Task 1: a fresh test RFI

The two test RFIs we have (a retailer and an insurer) were written by the same model that tunes the tool, so their scores may
flatter it. Write a third one, the way a real client's procurement and IT teams would, so the tool can be tested on questions it
has never seen.

**Do not read** `sow/rfp_answers.js`, `sow/rfp_method.json`, the `phrases/` or `batches/` folders, or the demo RFIs in
`sow/rfp_prototype/demo/`: the point is that the questions are not written to the tool's words.

**Write** `chatgpt_round2/test_rfi.txt`, plain text:
- A fictional client (an invented name that is not a real company), in an industry other than retail and insurance: for example
  a manufacturer that sells through dealers, a health system, a university or a travel company.
- A short background section with the client's own facts: the systems they run today (CMS, CRM, data warehouse, BI tool, CDN,
  contact center), sizes (pages, documents, users, markets), the timeline, and anything they rule out ("We will not license ...").
- Sections A, B, C and so on, each starting with a heading and a line such as "Responses in this section are limited to 250
  words." Number every requirement with its section letter ("A.1", "A.2").
- 24 to 30 requirements in all: about 18 about implementing and running Adobe products, 3 or 4 about the vendor itself
  (references, team, method), 3 or 4 about security and hosting. Pick 3 to 5 products from this list and name them as a client
  would: Real-Time CDP, Journey Optimizer, Target, Customer Journey Analytics, Brand Visibility, Sites Optimizer, Adobe Commerce,
  Edge Delivery Services, Brand Concierge, Coworker, Marketo Engage, Workfront, AEM Sites, AEM Assets, AEM Forms, Journey
  Optimizer B2B Edition, Adobe Analytics, Acrobat Sign, GenStudio for Performance Marketing.
- Mix the kinds of question a real RFI has: build and migration, integrations with the client's own systems, data and
  reporting, compliance, accessibility, performance, testing, training, go-live, and monthly support after launch. Some
  questions should name the product, some only the work ("How would authors and reviewers approve a page before it goes
  live?").

**Also write** `chatgpt_round2/test_rfi_key.json`: for each requirement, `{"ref": "A.1", "kind": "adobe" | "firm" | "security",
"asks_for": "one plain sentence on the work it asks for"}`. The key is for unblinding later; the tool never reads it.

## Task 2: an independent judge of round 1

**Read only** `sow/rfp_prototype/kb_method/scores_2026-11-13/cedar_panel.txt` and `tallgrass_panel.txt`. Do not open the
`*_key.json` files, `judges.json` or the answer files in that folder: the scoring must be blind.

Each panel file holds an RFP and, for each requirement, three answers labelled A, B and C. Act as the client's evaluation panel and
score every answer from 1 to 10 as a whole, weighing: whether it answers the requirement asked; a specific, credible method;
statements about Adobe products that look accurate rather than vague or invented; tailoring to the client's own situation;
deliverables, timeline and effort you could hold the vendor to; and the section's stated word limit. Be tough and fair: a 10 is
rare. Score each answer on its own merits, not by its position.

**Output:** `chatgpt_round2/judge_cedar.json` and `judge_tallgrass.json`, each `{"scores": [{"ref": "B.1", "A": n, "B": n,
"C": n, "why": "one sentence"}, ...], "notes": ["up to five patterns you saw"]}`.

## Task 3: how RFIs ask for each service

**Read:** `sow/rfp_prototype/kb_method/batches/batch_01.json` to `batch_12.json` (each service's id, name, owner product or
connection, scope, Adobe quote, play template) and `sow/rfp_method.json` (each service's steps, deliverables and outcome, keyed by
id under `services`). Do not read the `phrases/` folder: your phrases should be your own wording.

**Write**, for every service in a batch, 6 to 10 short phrases (2 to 8 words each) that a client's RFI or RFP would use when it
asks for that work, the way a procurement or IT team writes a requirement or question. Examples of the kind:
- for a Compliance publishing workflow: "approval before publishing", "compliance review of web content", "reviewer sign-off
  workflow", "regulated content approval";
- for Akamai or another customer CDN in front of Edge Delivery: "configure our existing CDN", "cache purge on publish",
  "security headers at the CDN", "keep our CDN in front of the site".

Rules:
- Specific to that service's own work, so that the phrase points to this service and not to its neighbours. No phrase that fits
  any service ("implementation services", "best practices", "project management", "support", "training" alone).
- Mix business wording and technical wording, as different readers write RFIs.
- Name a client system (Snowflake, Salesforce, Power BI, Akamai, Genesys, Drupal) only when the service is about that kind of
  system.
- No claims about what an Adobe product does, no marketing words, no em dashes or en dashes.

**Output:** `chatgpt_round2/phrases_batch_NN.json`, one per batch, a JSON object: `{"<service id>": ["phrase", ...], ...}` with
every id of that batch.

When the three tasks are done, write `chatgpt_round2/DONE.md` with one line per output file.

## Task 4, only when Adam asks: judge round 2

Claude will post new blind panels in `sow/rfp_prototype/kb_method/scores_round2/` (the two RFIs above and your test RFI). Score them
the same way as Task 2, without opening any key, judges or answer file there, into `chatgpt_round2/judge_round2_<name>.json`.

## Round 3 (Nov 13 2026, Adam: "yes"): Tasks 5 and 6

Round 3 added six services and made the answers written with no AI fit the client better. It was tuned on the insurer and
Tallgrass RFIs and on what your Vennor Quay RFI showed, so Vennor Quay is no longer a clean test. Task 5 gives a new one and Task 6
a second blind judge. Do Task 5 first, before you open anything for Task 6, and if you can, in a new conversation that has not seen
the earlier panels.

## Task 5: a second fresh test RFI

The same as Task 1, with these differences:
- **Do not read** what Task 1 lists, nor anything in `sow/rfp_prototype/kb_method/scores_2026-11-13/`, `scores_round2/` or
  `scores_round3/`, nor your own `judge_*.json` files: they hold the tool's answers, and the questions must not be written to its
  words.
- A new fictional client in a new industry: a health system, a university or a travel company (not manufacturing, retail or
  insurance).
- At least two of its 3 to 5 products are ones the earlier test RFIs did not name. They named AEM Sites, AEM Assets, Edge Delivery
  Services, Customer Journey Analytics, Marketo Engage, Brand Visibility, Brand Concierge and Coworker; not yet named are, for
  example, Real-Time CDP, Journey Optimizer, Target, Workfront, AEM Forms, Adobe Commerce, Sites Optimizer, Adobe Analytics,
  Acrobat Sign, GenStudio for Performance Marketing and Journey Optimizer B2B Edition.
- **Write** `chatgpt_round2/test_rfi_2.txt` and `chatgpt_round2/test_rfi_2_key.json`, in the same format as Task 1.

## Task 6: judge round 3 blind

First merge the latest `claude/amazing-volta-go9ton` into your branch: the round 3 panels are in
`sow/rfp_prototype/kb_method/scores_round3/`. **Read only** `cedar_panel.txt`, `tallgrass_panel.txt` and `vennor_panel.txt` there;
do not open the `*_key.json` files, the answer files or anything else in that folder. Each requirement has four answers, A to D.
Score them the same way as Task 4, into `chatgpt_round2/judge_round3_cedar.json`, `judge_round3_tallgrass.json` and
`judge_round3_vennor.json`, each `{"scores": [{"ref": "B.1", "A": n, "B": n, "C": n, "D": n, "why": "one sentence"}, ...],
"notes": ["up to five patterns you saw"]}`.

When both are done, add one line per new file to `DONE.md`.

## Round 4 (Nov 13 2026, Adam: "OK sure"): ChatGPT diagnoses and builds; Claude reviews and merges

Round 3 is measured (`sow/rfp_prototype/kb_method/scores_round3/`). Twelve blind judges, out of 10: AI 7.48, no AI round 3
**5.14**, no AI round 2 4.59, catalog 2.93 (your Task 6 agreed: 7.65, 5.98, 5.35, 3.78). On your university RFI, run once with no
tuning: AI 6.58, no AI 2.44, round 2 1.92, catalog 1.86, and only 11 of its 21 Adobe questions get a no-AI draft. The goal of this
round: raise the no-AI score and coverage on RFIs the tool has not seen, not only on the ones it was tuned on.

**Evidence**, all in `scores_round3/`: `<rfi>_panel.txt` and `<rfi>_key.json` (key letters to arms: ai, kb = no AI round 3,
kb_prior = round 2, catalog), `judges.json` (twelve judges' scores and reasons for cedar, tallgrass, vennor) and
`virelune_judges.json`, `results.json` and `virelune_results.json`, `<rfi>_no_ai_answers.json` (each Adobe question's no-AI answer,
its services and topic), `ai_answers_<rfi>.json` (the AI's answers and the services it used). The RFI files: cedar =
`sow/rfp_prototype/demo/Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx`, tallgrass =
`sow/rfp_prototype/demo/Tallgrass_Home_and_Garden_Inc_RFP.pdf`, vennor = `chatgpt_round2/test_rfi.txt`, virelune =
`chatgpt_round2/test_rfi_2.txt`. How the no-AI writer works: `sow/rfp_prototype/kb_method/README.md`, then `sow/rfp_answers.js`
(`kbPlan`, `byPhrases`, `topicOf`, `method`, `topicAnswer`, `toldUs`, `licenseLines`, `fitOptions`, `phaseLine`) and
`sow/rfp_finder.js` (which pile a question lands in).

**What changes for you this round.** You may now edit, on `chatgpt/kb-round2` after merging the latest
`claude/amazing-volta-go9ton`: `sow/rfp_answers.js` and `sow/rfp_finder.js` (the no-AI path and the sorting only), the knowledge
base under `sow/rfp_prototype/kb_method/` (`phrases/`, `reviewed/`, `playbook/`, `build_method.py`) and new tests under `sow/`. Do
not edit the catalog (`sow/canvas/`), the AI worker (`sow/ai_reading/`), the site's other pages, or anything outside `sow/`; do not
deploy or upload anything. Adam's rules, from `CLAUDE.md` at the repo root: surgical edits on unique anchors, never delete working
code unless it must go, no dead or commented-out code, no em or en dashes, never label anything beta or coming soon, and his step
87 rule (answer as if the client owns none of the products). Claude reviews every change before it reaches Adam.

**How to build and check, from the repo root:** `python3 sow/canvas/build.py && python3 sow/build_site.py`, then
`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` (or your own Chromium) with `node sow/test_rfp_kb_round2.js`, `node sow/test_step91.js`
and every `node sow/test_rfp*.js`; each must still pass, and a check you change must say why in its comment. Measure with
`node sow/rfp_prototype/kb_method/eval_answers.js <rfi file> <out.json>` on all four RFIs.

**Keep one RFI unseen.** Do Task 7 first, in a new conversation, before reading any of the evidence above.

## Task 7: a third fresh test RFI, kept unseen

The same as Task 5: a new industry (a health system or a travel company), at least two products none of the four test RFIs name,
written without reading the tool or any scores folder. Write `chatgpt_round2/test_rfi_3.txt` and `test_rfi_3_key.json`, commit, and
then do not use it for anything until Task 12.

## Task 8: diagnose

For every question in the four panels, say why the no-AI round 3 answer trails the AI's, from the judges' reasons and the answer
texts, and reproduce the cause in the page (which service led and why, which line was cut, which words sorted it). Do the same for
every Adobe question the AI answered that gets no no-AI draft. Write `chatgpt_round2/ROUND4_DIAGNOSIS.md`: a table of causes with
the points each costs (the gap times its share, summed), most costly first, and for each a fix that would hold on any RFI.

## Task 9: build the fixes, most valuable first, one commit each

Claude's reading of the judges, to confirm or correct in Task 8:
1. **Sorting.** Questions that name the work and no product land in To sort or Your firm and get no draft (Vennor A.2, A.3, A.4,
   B.2, B.3; Virelune A.3, B.5, C.3, C.5). Sort a question into the Adobe pile when the knowledge base's phrases point to a service
   or topic of a product the RFI names, strongly enough; firm questions (references, team, method, pricing) must stay firm.
2. **What the client rules out.** "We will not license a customer data platform", "without assuming a new asset-management
   license": a service on a ruled-out product, or needing one, must not lead or ride along, and the answer must not lean on it
   (Virelune C.1 led with Real-Time CDP, A.5 with AEM Assets). The AI path already reads these since step 89; reuse that reading.
3. **The right lead.** Answers to a neighbouring question: author training for a publishing model (Virelune A.4), a Submission PDF
   or Adobe Analytics for form journeys (B.1), translation under a consent question (C.2), data into CJA when the RFI asks for
   measures out to Snowflake (B.6), lead scoring for enquiry routing (Vennor C.2), AI-referred audiences for event collection
   (Vennor D.1), generic Brand Concierge setup for a Genesys handoff (insurer C.5).
4. **The trim.** When an answer runs over its word limit, cut the lowest-value lines first ("It sits beside ..., estimated in our
   answer to ...", license repeats) and keep the method's own steps and deliverables (insurer B.7 lost its results readout,
   Tallgrass A.2 its stage testing step).
5. **Sub-asks.** The judges reward one point per part of the question. Where a question lists parts the lead service's method does
   not cover (duplicates, superseded manuals, account recovery, leavers), consider method steps keyed to words in the question,
   from the service's own Adobe facts only; never invent a product claim.
6. **Openers and dates.** No "You told us" that repeats the question or generic background; place work against the RFI's own
   milestones where it gives them (Virelune: March, June, 16 August 2027).

## Task 10: re-measure

Rerun `eval_answers.js` on cedar, tallgrass, vennor and virelune; build four-arm panels with `panel_build.py` (AI, no AI round 4,
no AI round 3 as the prior, catalog) in `scores_round4/`; judge them blind in a new conversation that has not seen the code or the
answers' sources, the same way as Task 6. Write the scores into `chatgpt_round2/ROUND4.md`.

## Task 11: write it up

`chatgpt_round2/ROUND4.md`: what was changed (file, function, why), the tests run and their results, the scores before and after
per RFI, coverage before and after, and anything you saw and did not change. Add the new files to `DONE.md`.

## Task 12: the unseen RFI

Only after Task 11: run `eval_answers.js` on `test_rfi_3.txt` once, with no changes, and report its no-AI coverage and, if Adam
asks, a blind score. This is the honest test of whether round 4 generalizes.
