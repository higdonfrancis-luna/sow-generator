# Step 53: client-safe wording (as built, Nov 10 2026)

Adam approved this as decision 2 on Nov 10 from `sow/mockups/nov9_review_decisions/decision2_catalog_wording.png`, then said "yes go ahead with 53 and 54". The plan is step 53 in section D of `review_2026-11-09/RESPONSE.md`. Part of it changes the catalog, so the live tool's canvas and SOW change too and ship with the product's next deploy; the as-built screens are in `sow/mockups/nov10_second_batch/`.

## The connection cards: a client-voice version of how and gain

A connection card's how and gain were written for the partner: they say "your client", keep Adobe's lifecycle labels (Legacy, maintenance mode, co-innovation, "not currently offered to health care, finance") and tell the partner what to confirm or prove. The drafted answer ran that text through a pronoun swap and sent it to the client. Now each card can carry a client-voice version, `sowHow` and `sowGain`, that the draft prefers, and a `sowNote` holding the cautions the client version leaves out, which the partner reads in the note: under Confirm with Adobe when it is about Adobe, otherwise as a line of its own ("Not in the client's text: ..."). A ticked ask reaches the client in the SOW's own client wording (the connection's `sowPrereqs`, matched to the partner's prerequisite by its words, since the two lists are not always in the same order), so no lifecycle word rides into "What we would need from you" either. They live in `sow/product_copy_rules.json` as `connection_client` {id: {how, gain, note}} and `sow/product_copy.py` writes them into `sow/canvas/catalog.json` at build, the same way the SOW's own client wording for availability and prerequisites is applied. The canvas card itself is unchanged: the partner still reads Adobe's labels there.

A sweep of all 75 cards through the voice rewrite found 29 whose client text carried a label or a caution (the review named ten); Brand Visibility + CJA (finding 5.4) made 30. The wording was drafted by helpers working in batches of three cards, each batch checked twice (facts kept, voice and rules) and sent back once where a checker found a problem; three items were still open after the second pass and were fixed by hand (a hedge on Brand Concierge + CJA, a long first sentence on Real-Time CDP + Edge Delivery, a missing comma on Commerce + AEM Assets), and Coworker + Workfront was set to the SOW's own client sentence, as in Adam's picture: "Adobe confirms that Coworker is available to your organization before this service starts." The rule for the client text: the partner speaks as "we" to "you"; every product fact, route, license and measured number of the original is kept; where Adobe documents no route or marks one Legacy, the text states what Adobe documents and that we confirm the route with Adobe before the work starts, without the label; the removed caution goes into the note. Journey Optimizer + Brand Concierge has no services behind it, so it drafts nothing for the client and the No match panel tells the partner what Adobe says.

## The sentence builder and the voice rewrite (finding 5.3)

Thirty of 201 service lines came out broken ("We will where ...", "We will for ...", "We will the agreed dashboards"). `doLine` now keeps a leading setting clause and puts "we will" after it: "Where you are on Analytics for Target today, we will choose ..."; "For a CDN without an Adobe guide, or logs kept in a log store such as Splunk or Elasticsearch, we will build ..."; "Using the agreed Optimize at Edge route, we will check ...". The voice rewrite (`rfp`) also turns the partner as an object into "us" ("a handoff managed by us", "between Adobe, you and us"), partner compounds into "our", "you and your client" into "we and you" (finding 5.6), "Client-provided" into "your", "Client authorization" into "your authorization", and conjugates does, authorizes, authors and the other verbs the catalog uses. A sweep of every line is in `test_rfp_step53.js`.

## Catalog changes that also change the live tool (decision 2)

| Where | Change |
|---|---|
| `line_scopes` (research lines BI1, BI2, AD1, AD2) | each scope starts with a verb: "Set up Query Service and data view permissions ...", "Build the agreed dashboards ...", "Authorize the Experience Platform advertising sources for the agreed ad accounts (...) once your client's ad admins approve access ...", "Build derived fields ..." |
| `template_overrides` (SOW templates O05, C05, C03, C02, CW01, O09, and their small and large size bands) | no partner compound or Client-provided phrase: "improvements ... in the Client's existing CMS" with "Design and make"; "Set up and manage a handoff ..."; "create a validation sheet"; "the responsibility split between Adobe, the Client and the partner"; "using approved footage and assets the Client provides ... uploading once the Client authorizes it" |
| `replacements` | the reference titled "Adobe: customer-journey-analytics.html" reads "Adobe: Customer Journey Analytics product description" (finding 4.14) |

`sow/apply_review.py` records each template override's old and new text as prior wording, so a partner's saved draft that holds the old default scope takes the new one and is not shown as "Scope edited". The product was rebuilt (`apply_review.py`, `canvas/build.py`, `build_site.py`); `sow/site/` holds the built pages, not deployed.

## The client's copy of the response (finding 5.5)

"Download RFP response" is now the client's copy: titled "Response to <the client's file>", no intro about the partner, no status tags, and a skipped answer prints as a blank. The sources heading reads "Adobe sources for the product facts above".

## Checks

- `node sow/test_rfp_step53.js`: 34 checks, ALL STEP 53 CHECKS PASSED (every line a sentence; the voice rules; eleven cards drafting without a label or caution, with the caution in the note; no partner or Client word in any drafted response of the four made-up RFPs; the client copy).
- `python3 sow/qa/check_product_copy.py` now also checks that every `sowHow` and `sowGain` carries no lifecycle label and no partner or Client word (30 cards).
- `node sow/qa/check_rendered_copy.js` now also reads the RFP Builder prototype: every drafted answer, the downloaded response and the checklist for the four made-up RFPs, and fails on a partner or Client word or a lifecycle label in what the client reads.
- `python3 sow/qa/check_citation_review.py`, `python3 sow/check.py sow/index.html` (144) and the rest of the product's suites: see the session note.

## Flagged, not done

- `check.py` needs the Python Playwright package; this session installed it with `pip3 install --break-system-packages playwright==1.63.0` and runs it with `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. A fresh session may need the same.
- The gain text of Brand Visibility + CJA for the client says "Any lift is measured with a test, not assumed"; the partner's note keeps the fuller caution that ordinary referrer reporting shows the visits without Brand Visibility.
