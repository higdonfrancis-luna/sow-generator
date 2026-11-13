# ChatGPT's tasks for round 2 of the method knowledge base (Nov 13 2026)

You are helping build the knowledge base behind an RFI response tool for Adobe implementation partners (Adam Higdon's SOW
generator and RFI Builder). The tool answers a client's RFI with no AI at run time: it matches each question to services in a
partner's catalog and builds the answer from each service's method entry. Round 1 scored 4.2 out of 10 with no AI, against 7.5 for
AI-written answers; the biggest loss was matching a question to the wrong service. Your two tasks feed round 2.

Work on a new branch, `chatgpt/kb-round2`, created from `claude/amazing-volta-go9ton`, and write only inside
`sow/rfp_prototype/kb_method/chatgpt_round2/`. Commit after each batch, with a one-line message. Do not change any other file.

## Task 1: how RFIs ask for each service

**Read:** `sow/rfp_prototype/kb_method/batches/batch_01.json` to `batch_12.json` (each service's id, name, owner product or
connection, scope, Adobe quote, play template) and `sow/rfp_method.json` (each service's steps, deliverables and outcome, keyed by
id under `services`).

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

When both tasks are done, write `chatgpt_round2/DONE.md` with one line per output file.
