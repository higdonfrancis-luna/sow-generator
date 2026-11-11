# Steps 77 and 78 (Nov 11 2026)

Adam: "What if we added a few questions to our pre populated questions around either Marketo optimizer and qualifier?
Also, could we arrange the questions in a way by use cases", then, on the picture
`sow/mockups/nov11_questions/questions_grouped.png`: "yes, build it and maybe also build the other fixes as well you
discussed, speed etc and we can deploy all at once".

## Step 77: four Marketo questions, and the questions grouped by use case

The front page's "Start from your client's problem" has 23 problems (19 before).

| New problem | Setup |
|---|---|
| My client's sales reps research and email every lead by hand | Marketo Qualifier, Marketo Engage, a CRM |
| My client's website chats never reach a salesperson | Brand Concierge, Marketo Qualifier |
| My client sends every lead down the same nurture path | Marketo Optimizer, Marketo Engage |
| My client's ad audiences are out of date | Marketo Optimizer, Marketo Engage, ad platforms |

Each uses only connections the catalog has held since step 71; its "why" restates the connection's wording and its
sources are the connections' Adobe pages. Where Marketo Engage is in the setup the client is taken to run it already, so
its stand-up services start off. Each has its own keywords, so a typed problem finds it.

See all problems lists the 23 under five headings: Get found in AI and search (5), Website and online store (5), Leads
and sales (5), Customer messages and data (4), Content and team productivity (4). The starting row of six is unchanged.
Adam did not pick a Marketo problem for the starting row, so none was added.

`sow/canvas/data_step77.py` (problems.json: the four problems and a `group` on every problem), `sow/canvas/patch_step77.py`
(template.html: `BP_GROUPS`, `BP_ORDER`, `bpStartHTML`), `node sow/test_step77.js` (25). Pictures as built:
`sow/mockups/nov11_questions/built_grouped.png`, `built_answer_qualifier.png`.

## Step 78: Build Answers with AI reads a long RFI in parts

A long RFI is cut between paragraphs into parts of about 7,000 characters (12 at most) and the parts are read at the same
time (`aiParts`, `aiCall` in `sow/rfp_ui.js`). Each later part carries the RFI's opening and the lines just before it, so
the reader knows the document and its numbering. The lists are joined in the RFI's order. A part is tried twice; a part
that fails twice stops the reading and leaves the tool's own list; a part with nothing to answer is left out. A short RFI
is one call, as before.

The worker's `/rfi/read` takes `part`, `parts` and `context` and tells the reader to list nothing from the context
(`sow/ai_reading/warroom-assistant-worker.js`). **Deployed Nov 11** (Adam: "deploy the worker"): a code-only deploy, the live
code equals the repo file, bindings and secrets unchanged, `/rfi/read` and `/rfi/propose` answer 403 without Proto's
Origin and `/brief` answers as before. With the context, the Washington State RFP read in 61 seconds with 192 lines
(142 Adobe, 50 firm), 72 Adobe answers drafted, no line repeated, and references that carry their section ("A.h(7)").
Times vary from run to run with the model: 40 and 61 seconds in two runs.

Washington State RFP on the live reader, before the worker change, from the built page:

| | One call (step 72) | In parts |
|---|---|---|
| Time | 48 seconds here, about 3 minutes for Adam on Proto | 40 seconds |
| Lines | 62 (32 Adobe, 30 firm) | 176 (121 Adobe, 55 firm) |
| Adobe answers drafted | 22 | 58 |

The list is fuller because each part is read closely: the 30 development items under 3.h come out one by one. That
answers the open question from step 72 (whether the AI should split every sub-item out): in parts, it does. It is more
lines to go through; the count links and filters from step 70 are there for that.

Also in step 78, with no AI: "maintenance" in a line that asks for documentation, training, a manual or knowledge
transfer no longer makes it a question about after-launch services (`isOngoing` in `sow/rfp_answers.js`). "Provide
training and knowledge transfer documentation identifying setup, use, maintenance and administration" now gets the
training service, not four monthly services. "Ongoing maintenance" and "monthly maintenance" are unchanged.

`node sow/test_rfp_step78.js` (17, reader stubbed).
