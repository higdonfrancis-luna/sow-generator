# RFI Builder step 72: Read with AI (Nov 11 2026)

Adam dropped a 36-page government RFP into the RFI Builder (Washington State DSHS, RFP 2123-778) and the downloaded
response was a wall of blanks, one of them a 1,500-word block: "Doesn't seem to be rendering correctly. This might be a
good use case for AI ... maybe it should just be AI". The comparison (`sow/mockups/nov11_ai_reading/ai_reading.png`):
the tool's rules found 47 items and drafted 10 answers; an AI reading listed 182 real requirements. His calls: "we're in
beta right now ... if AI would help, we should add an AI model", his Amazon Bedrock key on the WARROOM worker ("if this
goes into production, they could use a different key"), "yes, use sonnet 5", "just have a button say Read with AI", "go".

## What is built

1. **Read with AI**, one button beside Start over (`rfp_ui.js`). It sends the RFI's name and text to the reader and puts
   the list that comes back in place of the tool's own: each line with its reference in the document, sorted into Adobe
   products or Your firm; what the AI set aside, and up to five notes from it, go under Not picked up. The status line
   says "read with AI". While it reads the button says so and cannot be pressed again. The same button, **Undo Read with
   AI**, brings the tool's own list back. Either way it asks first when there are decisions on the list. Save my work, Save
   draft and a reload keep the AI's list and the list to go back to. If the reader refuses, finds nothing or cannot be
   reached, a message says so and nothing changes.
2. **The answers are not AI.** They are written by `rfp_answers.js` from the catalog and Adobe's pages, as before.
3. **What leaves the browser.** The intro now reads: "Nothing is uploaded or stored on a server, unless you choose Read
   with AI, which sends the RFI's text to an AI model to list what it asks for". Nothing is sent until the button is
   pressed.
4. **The reader** is one address, `AI_URL` in `rfp_ui.js`: the route `/rfi/read` on the worker `warroom-assistant`
   (`sow/ai_reading/warroom-assistant-worker.js`, the live code of Nov 11 plus 74 lines). It answers only calls whose
   origin is proto.adobe.io, takes up to 400,000 characters, asks Claude Sonnet 5 on Amazon Bedrock (the worker's own
   secret) for a tab-separated list, treats the document as data, and stores nothing. Another key or model: point
   `AI_URL` at another reader that returns `{items: [{kind, ref, text}], notes, truncated}`.
5. **A no-AI fix beside it** (`rfp_answers.js`): a line in the Adobe products pile that names no product draws on the
   products the RFI is about (named in three or more of its paragraphs, the two named most), and only where a service's
   own name answers the line: two of its distinctive words, or one with the line's other words in the service's scope when
   the line is short (a long paragraph shares words with any service by chance). Common words (each, document, workflow,
   template, build, design, create) and the products' own names do not count. The panel says so. On the helper model's Washington State list this takes the
   drafted answers from 48 to 69 of 129; looser rules drafted 123 (many wrong) and gave a response due date a forms
   service on the tool's own reading, and were not kept.

## The worker is live (Nov 11, Adam: "deploy the worker")

The first deploy was stopped by this session's safety check on production changes until Adam said "deploy the worker".
Three code-only deploys followed: the route; then without `temperature` and with `maxTokens` 16384 (the model refused
the first request with 400); then reading the model's reply as a stream (`converse-stream`), because a long document's
reply took longer than the two minutes a single reply may take (524). The route keeps its own reply alive with spaces
until the list is ready, so the page's `r.json()` reads it as before. After each deploy the bindings and secrets were
compared with the list taken beforehand (unchanged) and `/brief` was smoke-tested with a browser-style User-Agent.

Measured on the live route with the Washington State RFP (79,323 characters): 48 seconds; 32 requirements about Adobe
products, 30 about the firm, 6 groups set aside and 2 notes (one: the scored questions are in Attachment D, which is not
in the file). The live model groups sub-items more than the helper model used for the first comparison (which listed 129
and 53), so the list is shorter and each line fuller. The tool's writer drafts 22 of the 32, against 10 answers from the
rules' own reading.

## Checks

`node sow/test_rfp_step72.js` (33), with a stand-in for the reader: no call leaves the machine in the tests.

## Flagged

- The no-AI fix reaches only lines already in the Adobe products pile. Without Read with AI the finder still puts a line
  that names no product under To sort.
- A long reading takes minutes; the request is one call, with no progress shown beyond the button's label.
- The worker answers any site on its other routes (the open "worker lock" item); this route checks the origin, which
  keeps other sites' pages out but is not a login.
- The RFI's text goes to Adam's worker and Bedrock account under his key: fine for the beta on his word; a production
  owner should point `AI_URL` at their own.
