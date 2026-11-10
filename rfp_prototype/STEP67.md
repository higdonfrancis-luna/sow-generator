# Step 67: the writer (Nov 10, 2026)

Adam ran the same bank RFP through this tool and through a tool Adobe has, and asked which response was better. The honest
answer was that Adobe's read better as a draft to send and ours held the stronger content. Adam: "I want ours to be better
than theirs. I trust you to do whatever it takes to make it better. But it has to be better."

Branch `claude/sweet-planck-i4z4pw`, started from `claude/amazing-volta-go9ton` and merged with its wave 3 work (that
session's SOW step 66), so the site here holds both. Nothing is deployed or uploaded.

## The result

Three rounds of blind scoring. Each round, two fresh evaluators acted as a bank's procurement panel and scored the two
responses question by question without knowing which vendor was which (the two got the vendors in opposite order).

| Round | Ours wins | Adobe's wins | Notes |
|---|---|---|---|
| 1, after the first build | 7 and 7 | 1 and 1 | One gave Adobe 2.8 on a tie-break, the other 2.7 |
| 2, after their criticisms were fixed | 7 and 7 | 1 and 1 | Both gave Adobe 2.7, the forms answer |
| 3, after the second set of fixes | 8 and 8 | 0 and 0 | Totals 328 to 264 of 400 in one panel's scoring |

The three workbooks are in `step67_compare/`: `before_step67_adam.xlsx` (this tool before the step, as Adam downloaded it),
`adobe_tool_draft_1.xlsx` (Adobe's tool), `after_step67.xlsx` (this tool now, from `rfp_prototype/try/` with every drafted
answer approved). Pictures of the panel as built are in `sow/mockups/nov10_step67/`.

## Why Adobe's read better, and what changed

| What the comparison showed | As built |
|---|---|
| Ours opened with "We would deliver this with Brand Visibility" and a list of services; Adobe's answered the question | An answer opens with sentences that answer the question, each backed by quotes checked on Adobe's pages (`rfp_facts.json`, `explain`). "Which products would you use" opens with the products and what each is for |
| Four of eight answers were over the RFP's 300-word limit | The RFP's own limit is read ("under 300 words", "maximum 250 words", "500-word limit"; a question's own limit wins). Each answer is fitted under it with a few words to spare, counting every token. The panel tells the partner the count and what was left out |
| Two bullets of 2.5 repeated 2.4 word for word | A service is said in full once in the response: in the after-launch answer when it is monthly work, else in the first answer that draws on it. The panel tells the partner where |
| "na" in the firm answers | That was typed by Adam, not the tool. Unanswered firm questions stay empty |
| 2.6 was 800 words with 23 links in the cell | The knowledge base carries a shorter wording of its longer sentences, used under a limit. Sources leave the cell (see the workbook below) |
| The file came back without the bank's formatting; Adobe's kept it | An .xlsx comes back as the client made it: the answers are written into the file's own XML, each answer cell wraps at the top of its row, the answer column is widened, and the Adobe sources go on a new last sheet |
| "banking or insurance products" in a bank's RFP | A line written for both names the client's own industry where the RFP shows it |
| One 90-word sentence for the Brand Concierge setup | A sentence that lists five steps or more after a colon is set out as a short list |

From the blind evaluators' criticisms, also built:

- **Licensing.** A question that asks about licensing gets a Licensing section. Where the answer explains two routes, the
  section says what each route needs (bank 2.7: embedded Marketo forms need no AEM Forms license; adaptive forms need both).
- **A how-does-it-work question** ("Describe how Brand Visibility shows ...", "How would Brand Concierge answer ...") keeps
  to the explanation and the one service that sets it up, under a limit. The panel says so, apart from what the limit left out.
- **An ask goes where its service goes.** An ask that came with a service is in the response only when that service is.
- **After launch.** The answer draws on every product the response proposes (it used to take only the products the questions
  name), says which product each monthly service is for, and says it is monthly.
- **Edge Delivery is not assumed.** Where the RFP names AEM Sites and never Edge Delivery, "the new site" no longer brings
  Edge Delivery Services into an answer (it was in bank 2.7 and so in 2.5 and 2.6).
- **Products Adobe's list does not cover** are named in the hosting and security answer, with what we will do about them.
- **No filler.** The sentence that only listed other connections goes in last, so it is the first thing a limit drops; the
  connection's own text is left out where the opening sentences already explain the pair; a bracket already said in the same
  answer is not said again; "ABV" reads "Brand Visibility".
- **Delivery order.** Services are listed in the order they are delivered, not the order they matched.

## The sentences and their evidence

- `part3_research/explain.json`: 150 facts, each a quote copied from an Adobe page with its URL and page date, gathered by
  four researchers (Brand Visibility, Brand Concierge, AEM Sites migration with Marketo forms, personalization and
  measurement) and checked word for word against the live pages by script on Nov 10 2026. The researchers' files, with what
  they could not find and their cautions, are in `step67_research/` with the checker (`verify.py`).
- `part3_research/statements.json`, `explain`: 31 entries. "for" names the products the draft must hold; "when" lists the
  words that call for the sentence; kind "what" is what a product is, "role" is its part in a "which products" answer, and
  "note" is a caution for the partner alone. `build_facts.py` finds every quote among the verified facts and stops if one is
  missing.
- Covered so far: Brand Visibility, Brand Concierge, AEM Sites, Marketo Engage with AEM Forms, Real-Time CDP, Target and
  Customer Journey Analytics. A product without sentences still opens "We would deliver this with ...", as before.

Cautions the research raised, which reach the partner under Confirm with Adobe and never the client:

- **Brand Visibility platforms.** The list of six with Perplexity and Microsoft Copilot is on the Brand Presence (Trial)
  page; the AI Visibility page lists four, and the Semrush-powered page names none.
- **Brand Concierge and a customer's own account.** Adobe's FAQ says the current scope is anonymous visitors.
- **Brand Concierge handoff.** Live chat and meeting booking run on Adobe Marketo Qualifier, framed as handoff to sales.
- **AEM Sites migration.** Adobe documents the Content Transfer Tool for AEM sources only, and its importer tooling for Edge
  Delivery Services targets only.
- **Target reporting in Customer Journey Analytics** covers A/B activities; Auto-Target and Automated Personalization do not
  support it yet.

## Files

- `sow/rfp_answers.js`: `explainFor` (the opening sentences), `written` (what the client reads: said once, licensing, the
  fit), `limitIn` and `limitOf`, `listify`, `inOrder`, `proposalProducts`, `fillXlsx` and `writeBackKept` (the workbook),
  the panel's notes and badges; the matcher's after-launch and connection-order changes.
- `sow/rfp_readers.js`: the workbook's own bytes are kept for the write-back.
- `sow/rfp_prototype/part3_research/`: `explain.json`, `statements.json` (the `explain` list and the `short` wordings),
  `build_facts.py`.
- `sow/site/`: rebuilt by `python3 sow/build_site.py`.

## Checks

- `node sow/test_rfp_step67.js`: 50 checks, ALL STEP 67 CHECKS PASSED.
- Updated on purpose, all passing: `test_rfp.js` (67), `test_rfp_step51.js` (37), `test_rfp_step52.js` (its 4.8),
  `test_rfp_step54.js` (73), `test_rfp_step55.js` (61), `test_rfp_part3.js` (43), `test_rfp_summary_bar.js` (16).
- Unchanged and passing: `test_rfp_step50.js` (49), `test_rfp_step53.js` (68), `test_rfi_front_door.js` (19),
  `test_site.js` (48), `test_step61.js` to `test_step64.js`, `test_step66.js`, `python3 sow/qa/check_product_copy.py`.
- `node sow/qa/check_rendered_copy.js` (about an hour, 932 views): its first run on this build found two of the new notes for the partner using release-status words ("Limited Availability", "do not yet"). Both are reworded, and `build_facts.py` now stops on those words in any explain sentence or note.
- **Failing before this step, not from it:** three "4.3 Adobe Analytics" checks (two in `test_rfp_step52.js`, one in
  `rfp_prototype/review_2026-11-09/recheck.js`). They fail on `claude/amazing-volta-go9ton` as it stands: its step 66 made
  Adobe Analytics a product in the catalog, and these older checks still expect it to be outside.

## Flagged, not changed

- **The catalog pairs the Universal Editor with a Core Components build.** AEM Sites' services train authors on the
  Universal Editor (SI05) and build from the Project Archetype with Core Components and editable templates (SI02). Five of
  six evaluators asked which editor authors would use. This is catalog wording, so it is Adam's call.
- **Catalog wording the evaluators found hard to read:** "five business measures" (never defined), "an eligible deployment
  pilot", "Each page change is logged once and tagged search, AI or both", and the Adobe administrator terms in the
  connection prerequisites (dataflow, datastream, derived field).
- **The 30-day chat retention ask** ("so you confirm your own record-keeping needs") reads as a problem handed to the bank.
- **No service levels or support hours** in the after-launch answer: the catalog holds none.
- **Other products have no opening sentences yet** (Commerce, Journey Optimizer, Workfront, Coworker and the rest).
- **A CSV or an old .xls** still comes back values only, with a knowledge-base answer's sources in the cell.

## To send Adam's zip again

Zip the files of `sow/site/` with `index.html` at the zip's root (zips are not kept in git).
