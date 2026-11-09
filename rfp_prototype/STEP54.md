# Step 54: the client is told what we need (as built, Nov 10 2026)

Adam approved this as decision 1 on Nov 10 ("it looks good to me") from `sow/mockups/nov9_review_decisions/decision1_client_needs.png`, then said "yes go ahead with 53 and 54". The plan is step 54 in section D of `review_2026-11-09/RESPONSE.md`; the as-built screens are in `sow/mockups/nov10_second_batch/`.

## What the partner sees

The note under each drafted answer, "Notes for you, not for the client", now opens with "Internal. Nothing in this box goes into the downloads, except what you tick or type." and holds four lists:

| List | What lands in it | Rule |
|---|---|---|
| Adobe licenses this proposal includes (Adobe quotes them) | a license, offering, package, edition, add-on or trial for a product the RFP does not say the client owns ("The paid Brand Visibility offering, not the free trial", "Coworker Chat license through the Adobe account team"), and a matched line's "also needs" ("Also needs Real-Time CDP or Journey Optimizer, licensed separately.") | `LICENSE` words, product not owned |
| Ask your client | everything the client supplies or confirms: access, people, fields, acceptances, and a matched line's tier ("Your Customer Journey Analytics package: CJA Select or higher.") | everything not caught by the other three |
| Confirm with Adobe | what only Adobe can do or confirm: provisioning, Adobe's onboarding or support team, a Support ticket, a route Adobe does not document, and the caution a client-voice card leaves out (step 53's `sowNote`) | `ADOBE_DOES` |
| Assumptions behind this answer | scope statements and exclusions ("Pilot users are a training scope, not a software seat limit", "Magento Open Source is not supported"), the connection's availability line, and a license the RFP says the client already has | `ASSUMPTION`; no field |

There is no six-item cap any more (finding 6.2): bank 2.2 shows all nine of its prerequisites; before, three were shown nowhere. The note speaks to the partner: "the Client" reads "your client" there (finding 6.4).

Every ask has a tick box, on by default, a badge, and an empty field whose placeholder is "What your client told you" (the old pre-filled "Will confirm with the client" looked like typed text):

- Ticked: badge "In the response". The item goes into the response under **What we would need from you**, in the client's voice ("Your ad admins approve access in each network"); where the connection has the SOW's own client wording for the prerequisite (`sowPrereqs`), that wording is used, matched to the partner's item by its words because the two lists are not always in the same order.
- Unticked: badge "Not in the response". The item stays on the checklist only.
- A note typed in the field: badge "Answered by your note below", the tick box greys out, and the item moves to **What you already have in place, as confirmed with your team**, led by the ask's subject ("CDN access logs: Akamai serves both sites; your IT team confirmed log forwarding can be enabled."). The field keeps focus while the response updates.

The response's order is Our approach, What we would do, After launch, What you already have in place, What we would need from you, Adobe sources. Ticks and notes are kept per question when the partner moves between questions.

After Edit (the partner saved their own words), the note says "You edited this answer, so ticks and what you type here no longer change it. Edit it again to add them." (finding 6.5, option b). The fields stay, so the checklist still records what the client said.

## What the skeptics found, and what changed

A round of skeptics on the built page (two per review finding) found gaps in the first build of this step, all closed: ticks and typed notes were stored by position, so after the partner took a product out or added one through the Drawn from chips they attached to a different ask (now keyed by the ask's own words, and a note whose ask is gone no longer reaches the client); a drafted answer with no connection took every template assumption as an ask, so scope statements ("The prompt count is the service scope") were ticked by default and reached the client (now only ask-shaped sentences are asks); when the answer named a second documented connection its prerequisites were never offered (now every connection the answer uses contributes its prerequisites and availability); a prerequisite whose SOW wording says "is confirmed with Adobe" reached the client (now sorted under Confirm with Adobe); an emptied edit printed the full draft again (now it leaves the answer out); after an edit the badges still said "In the response" (now "Not in the edited answer", in the checklist too); "we already license Brand Visibility and Customer Journey Analytics" marked only the first as owned (now both); a pair whose services are all optional lines drafted nothing (now it drafts from the first of them); "Is there anything you need from us ...?" was read as a yes/no capability question (now it lists the asks); a note typed about "the client" reached the client in those words (now "your"); and a license's "A or B" need counted as a license to sell even when the RFP said the client runs one of the two (now "Already in place per the RFP").

## The downloads

- **Download RFP response** carries the two client sections for each answer and nothing else from the note.
- **Download questions for your client** (the partner's checklist) now lists the four lists per question, and marks each ask "In the response as what we would need from you", "Not in the response", or "Client says: ..."; its intro says exactly what does reach the response.
- **Download response as Excel** and **Write answers into the client's workbook** carry the response text with both client sections.

## Files

- `sow/rfp_answers.js`: `noteItems` (the four lists), `subjectOf`, `facts`, `needs`, `sectionsOf`, `noteHTML`, `badgeHTML`, `refreshItem`, `partnerVoice`, the tick and fact handlers, `asksDoc`.
- `sow/patch_step49.py`: the step 54 styles (`.rfp-internal`, `.rfp-tick`, `.rfp-badge`, the ask rows).

## Checks

`python3 sow/rfp_prototype/build.py`, then `node sow/test_rfp_step54.js`: 46 checks, ALL STEP 54 CHECKS PASSED (the skeptics' cases included), on bank 2.2 (nine asks, tick, untick, type, order, focus, the Brand Visibility caution as a line of its own), a Brand Concierge question (partner voice), Coworker + CJA (Confirm with Adobe), Coworker + Workfront (the asks reach the client as themselves; the eligibility caution once), the manufacturer's Coworker question (assumptions), retail Q8 (a line's also-needs and tier), Edit, both downloads, the Excel, and moving between questions. `node sow/test_rfp.js` had 13 checks updated where steps 53 and 54 change behaviour on purpose (the response now carries what we would need from you; the placeholder; the headings; the client copy of the download).

## Flagged, not done

- A catalog sentence that mixes a license with duties ("The Client has licensed Brand Concierge and supplies the approved content, current product facts, reviewers and the handoff destination") still lands whole under the licenses list. Splitting those sentences is a catalog change; the plan noted it under finding 6.3.
- The subject of an ask is cut by a simple word rule, so a few read oddly ("Sending CJA audiences back out: ..."). The partner can edit the answer.
