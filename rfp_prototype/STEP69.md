# RFI Builder step 69: beating Adobe's AI draft with no AI (Nov 10, 2026)

Adam downloaded this tool's answers to the bank RFP again and set them beside the draft from the tool Adobe has, which uses
AI. Ours was stronger wherever it answered, and three of its eight product answers were blank: he had not approved them, and
nothing told him they would come out empty. Asked whether the RFI Builder should use AI, he said: "Let's see what we could do
with what we build versus what Adobe built because Adobe is using AI today if we can perform them without AI and basically
run this for free for our partners that helps me get this approved". Then, leaving for the evening: "work until they're all
fixed nonstop and then give me the zip file when you're done". That was taken as his yes to build every row of the plan he
had been shown (`sow/mockups/nov10_rfi_no_ai/no_ai_plan.png`).

Nothing here uses a model. The RFP is still read in the partner's browser and nothing is sent anywhere.

## The seven gaps and what was built

| Where Adobe's draft was ahead | As built |
|---|---|
| Three answers came out blank | Once the partner has chosen some answers, the summary says which drafted ones are not chosen and will be blank in the downloads ("3 answers about Adobe products are not marked "Use this answer" and will be blank in the downloads: 2.6, 2.7, 2.8."). An answer left out on purpose is not listed, and the warning goes when the drafts box is ticked |
| "Unapproved by who?" (Adam) | Approve reads **Use this answer**, an approved row reads **In your response**, the summary says "5 of 8 answers about Adobe products and 0 of 6 firm answers are in your response", the Excel's status says Final, and a draft is marked "Draft, not yet reviewed". The hand-off counts "chosen answers" |
| No note that the answers are suggestions | "Your call. These answers are suggested drafts, drawn from Adobe's public documentation. Review and edit every answer: you are responsible for what you send to your client." above the questions |
| Never names the client | The client's name is read from the RFP's title lines, or the file's name, when it reads as an organization (Bank, Credit Union, University, Department, Inc and so on); the Client name on the Scope step comes before those, and a box in the summary lets the partner change or empty it. Each answer names the client once, in the first sentence it keeps that opens "We would" or "We will". The name's words are set aside before an answer is fitted to a word limit |
| AEM Sites: no discovery step, no list of what the client must provide | An opening sentence ("We would start with discovery: ...") backed by three quotes from Adobe's readiness guidance, and four asks that come with it. The sentence is marked `extra`: it never takes the place of one of an answer's four sentences, and under a word limit it gives way to the services. On the bank's 300 words the sentence fits and the asks do not; they stay on the partner's checklist, and show in the answer where there is room |
| Answers run 225 to 292 words; Adobe's 105 to 168 | A **Shorter answers** setting in the summary fits every answer to 170 words (or the RFP's own limit where that is lower), with the same rules that fit an answer to an RFP's limit. The panel says the setting is on and what was left out |
| Says little about a bank's own controls | Where the RFP is from a bank or an insurer, the response says once who approves regulated content and once how customer data is used, each in the answer of its kind with the most room, never in an answer that already speaks of it, and (for the line on regulated content) never in an answer that explains how a product works. Both give way to the services under a word limit: on the bank's 300 words the line on customer data fits, in 2.7, and the line on regulated content does not |
| A question that names no product is not drafted | More of what an RFP calls the work is known to the sorter and to the matcher (online forms and applications, page speed, organic search, marketing attribution, web analytics, asset management and more), and Photoshop, Illustrator, InDesign and Premiere Pro are read as Creative Cloud. A question that names Adobe Analytics, Marketo Measure, Marketing Campaign Analytics or Content Analytics no longer brings Customer Journey Analytics in on a general word such as "report" |
| Opening sentences for seven products only | 153 more, for the 26 products that had none: each product now has a sentence for what it is, one for its part in a "which products" answer, and two to four for what an RFP asks about it. 291 quotes from Adobe's pages back them, gathered by three researchers and checked word for word against the live pages twice (their check and this session's) |

## The bank RFP now

`step69_compare/after_step69.xlsx` (made by `step69_compare/make_after.js`): all eight product answers, each under the
bank's 300 words, the bank named in six of them, a discovery step in 2.1, the line on customer data in 2.7, and the Adobe
sources on their own sheet.

## Scored blind against Adobe's draft

Two fresh evaluators, each acting as the bank's procurement panel, scored the two responses question by question on five
criteria without knowing which vendor was which (they got the vendors in opposite order). Both chose this tool's response
on all eight questions: 318 to 267 and 321 to 271, of 400. Three were close (2.1, 2.4, 2.7).

What they liked in Adobe's draft and still found thinner in ours: consent, subprocessors, service levels and accessibility.
What they marked ours down for: footnote numbers in 2.6 whose sources are on another sheet, no service levels in the
after-launch answer, "200 to 1,000 prompts" as too wide a range to price, "five business measures" never defined, the
services of 2.1 and 2.7 describing one route only, and answers close to the word limit. Both called the line on regulated
content off topic where it first landed, in the Brand Visibility answer; it no longer goes into an answer that explains how
a product works.

## Files

- `sow/rfp_answers.js`: `blankWarn`, `targetOf` and `limitSays` (Shorter answers), `detectOrg` and `clientOrg` (the name),
  `controlsFor` and `controlHomes` (a bank's controls), the `extra` and `asks` of an opening sentence in `explainFor`,
  `compose` and `written`, the wider `TOPICS` and `NAMES`, and the wording.
- `sow/rfp_finder.js`: the wider `ADOBE_TOPIC` and `ADOBE_NAME`. `sow/rfp_ui.js`: the two settings are kept with the work.
- `sow/patch_step49.py`: the note above the questions and the styles.
- `sow/rfp_prototype/part3_research/`: `explain.json` (291 more quotes, and four for the discovery sentence),
  `statements.json` (155 more entries), `build_facts.py` (passes `asks` and `extra` through, and checks the asks).
- `sow/rfp_prototype/step69_research/`: the brief, the three research files, and `merge.py`, which puts them into the
  knowledge base and can be run again.

## Checks

- `node sow/test_rfp_step69.js`: 50 checks, ALL STEP 69 CHECKS PASSED.
- Updated on purpose: `test_rfp.js`, `test_rfp_step52.js`, `test_rfp_step54.js`, `test_rfp_step55.js`,
  `test_rfp_step67.js`, `test_rfp_part3.js` (the new wording, the client's name at the start of an answer, the line on
  customer data in 2.7, and one ask fewer under the bank's limit because the name takes four words).

## Flagged, not changed

- **Under a 300-word limit the new needs list for AEM Sites does not fit** beside four services and four opening sentences.
  It is on the partner's checklist, and in the answer where an RFP gives more room.
- **The word "signature" still sends a question to Your firm** (the sorter reads it as a contract matter), so a signature
  question is drafted from Acrobat Sign only when it names the product.
- **"Electronic signature" and "e-signature" without a product name still draw AEM Forms**, as before Acrobat Sign was a
  product. One phrase can point to one product.
- **helpx.adobe.com refused the researchers' browser-style requests and answered plain ones.** The quotes from it were
  read the way the repo's own checker reads pages, with no disguise, and all were found. Acrobat's own apps (plans, Admin
  Console, AI Assistant) have no sentences, because those pages could not be read by one researcher.
- **The cautions the researchers wrote (about 130)** stay in the research files. What a partner must not promise already
  reaches the partner's note from the catalog's cards.
- **Real-Time CDP Collaboration**: every Adobe page for it carries a limited-availability badge and a list of regions. Its
  sentences say nothing of that; the catalog's card and statement of work condition do (step 62).
- **The sorter is still unsure about most of the Washington State RFP's lines** (procurement dates, and sub-items that
  need their parent's context). The lines about online forms are now drafted. The rest needs the RFP's PDF.
- **The platform list in the Brand Visibility answer** (ChatGPT, Perplexity and four more) comes from Adobe's Brand Presence
  page, which the step 67 notes say is the trial's page. Adam said the trial is over; the list should be confirmed for the
  current edition.
