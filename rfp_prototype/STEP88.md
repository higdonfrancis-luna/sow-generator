# Step 88: the AI writes the answers (Nov 12 2026)

## What Adam asked

After running the Tallgrass demo RFP on Proto: "There's no meat on the bones at all ... This is just a lazy, lazy, lazy product ... give them some freaking intelligence." Shown 15 answers written to a brief next to today's (`sow/mockups/nov12_meat/`: an evaluator scored today's 2.5 and the written ones 7.7), he asked "Should we upgrade to Claude 5.5 opus for consistency and quality?" (yes, for the writing; Sonnet 5 stays for the reading), then "go".

## What is built

1. **Build Answers with AI writes every Adobe answer.** After the reader lists the requirements, each Adobe question that needs a plan goes to a new worker route, `POST /rfi/answer`, six at a time. The button reads "Writing answers… 3 of 12 · 0:41" while it works. Fact questions (hosting, certifications, sign-on, uptime) keep their sourced knowledge-base answer; Your firm questions are not sent.
   - The writer gets: the client's name, the RFI's first 9,000 characters, the question and its reference, a word budget (90 percent of the RFI's limit, else 350), up to 24 catalog services that may apply (name, what the partner does, deliverable, typical hours, one-time or monthly, the license the client needs, the Adobe page), the connection where the question is about two products, up to 40 Adobe facts from the knowledge base, and the numbered Adobe pages. No rate or price.
   - The brief (`RFI_ANSWER_RULES` in the worker): Our approach (tied to the client's own facts), How we would do it (4 to 6 concrete steps), What you get, Timeline and effort (typical planning hours added up), Risk we manage. It never invents partner facts (a bracketed field instead), never states availability or release labels, never prices.
   - What comes back is checked in the page (`takeAI` in `sow/rfp_answers.js`): only the services and pages it was given, a catalog id becomes the service's name, a dash becomes a comma, a sentence with a banned word (beta, early access, confirm with Adobe, seamless, robust, a price) is dropped, a list number is taken off. The answer is then fitted to the RFI's word limit: the client asks go first (they stay in the partner's checklist), then the longest section's last item.
   - A question the writer could not answer (tried twice) keeps the catalog's answer. The closing message says how many were written: "Check the list against the document before you answer. 11 of 12 answers were written with AI; the others are drafted from the catalog."
   - The AI answer is kept with the question (Save my work and a reload keep it) and is dropped when the question's text changes or the partner picks other products.
2. **The services the AI's answer rests on are the answer's services,** so they are the ticks that Add to my statement of work carries.
3. **The Word proposal is written by Opus 5.5** (falls back to Sonnet 5), and is now given the outside systems the RFI names: on Tallgrass it gets "Data warehouse + Customer Journey Analytics" (OX3) and "Customer Journey Analytics + BI tools" (BI1, BI2), so Snowflake and Power BI are no longer "custom work". Its brief no longer tells the partner to confirm anything with Adobe, describes Adobe features as available, and lets the partner's own method go uncited.
4. **Answers, to print carries every draft while no answer is marked** (the Excel copy marks them Draft). Once one answer is marked Use this answer, only marked answers print, as before.

## The model

`writerFetch` in the worker asks `us.anthropic.claude-opus-5-5` first and falls back to Sonnet 5 when Bedrock refuses the model (400, 403 or 404), so nothing breaks if Opus 5.5 is not open on Adam's key. Every reply says which model wrote it (`model`), and each answer keeps it (`q.ai.model`).

## Files

- `sow/ai_reading/warroom-assistant-worker.js`: `/rfi/answer`, `handleRfiAnswer`, `writerFetch`, `RFI_ANSWER_RULES`; the proposal uses `writerFetch`. **Not deployed**: waits for Adam's "deploy the worker".
- `sow/rfp_answers.js`: `aiInput`, `takeAI`, `aiOf`, `AI_BANNED`; `compose` and `written` use the AI answer; `noneUsed` and `inResponse` for printing; `proposalPack` finds outside systems.
- `sow/rfp_ui.js`: `writeWithAI`, `writeCall`, `WRITE_URL`, `WRITE_AT_ONCE`, the button's label.
- `sow/rfp_prototype/review_2026-11-09/harness.js`: every check blocks the live writer, so no test sends an RFI out.
- `node sow/test_rfp_step88.js` (27, reader and writer stubbed).

## Still to do

- Deploy the worker (Adam's word), check its bindings, smoke-test the route.
- Run Tallgrass and the Washington State RFP live, score with the evaluator (target 7 or better), and report which model wrote them.
