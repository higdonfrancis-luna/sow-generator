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
