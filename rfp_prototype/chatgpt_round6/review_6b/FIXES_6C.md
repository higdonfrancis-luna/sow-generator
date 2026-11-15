# Round 6c for ChatGPT: the last fix before ship (Nov 15 2026)

Adam: "if we fix them, we have to fix them then ship and we're done." This is the final round on this project. Work on `chatgpt/round6` from 553e913. Bring this file in with `git checkout origin/claude/amazing-volta-go9ton -- sow/rfp_prototype/chatgpt_round6/review_6b/FIXES_6C.md`. Every rule in `../TASKS.md` still applies. Keep `check_reader.js` at 152 of 152 and `check_parity.js` at 0 losses. No screen design changes.

## Why

Claude's review of 6b (two skeptics per finding) confirmed that the new name list behind the ruled-out note (`namedForScopeNote`, with `noteNameKey`, `noteProducts`, `noteAliases`, `noteNamesByLength`, `noteNamePattern` in `sow/rfp_answers.js`) misreads ordinary words and misses real names: "Target dates ..." at the start of a sentence shows "Your client rules out Target"; "Adobe Experience Platform", "AEP" and "Analysis Workspace" lost their note and now say "No match in the catalog"; "a coworker on our team" shows the Coworker note; `p.short` is null for every product, so part of that code never runs.

The drafter already reads product names correctly. `RFPAnswers.detectAll(text).named` (names, not topic words) gives, on 553e913: A.1's "journeys" sentence `[aemsites]` (Journey Optimizer is only a topic), "Target dates ..." `[aemsites]`, "AEP" and "Adobe Experience Platform" `[rtcdp]`, "Analysis Workspace" `[aa]`, "Explain how Target would run A/B tests" `[aemsites, target]`, "AJO" `[ajo]`, "Commerce data" `[aemsites, commerce]`. Its one slip is lowercase "a coworker" `[cw]`.

## Item 1: one name reader

In `scopeNote`, take the ruled-out products from the drafter's own reading: `[...detectAll(q.text).named].filter(id => excluded.has(id))`. Remove `namedForScopeNote` and every helper and table that only it used (all five named above), with no leftover code or comments. Keep the rest of `scopeNote` as 6b left it.

## Item 2: "coworker" in lowercase is an ordinary word

In the product detection that `detect` and `detectAll` use, the product Coworker is named only by "Coworker" with a capital C or "Adobe Coworker". Lowercase "coworker" or "coworkers" is not the product. This also affects drafting; run parity and every suite and report any draft that changes.

## Test (add to `test_round6.js`, failing first)

Paste an RFI that starts "We will not license Adobe Target, Journey Optimizer, Real-Time CDP, Adobe Analytics, Coworker or Adobe Commerce." and then these twelve numbered questions. Check the `#rfp-scope-note` line for each:

| # | Question | Note |
|---|---|---|
| 1 | Describe your proposed AEM Sites approach for deposit, mortgage enquiry and small-business journeys. | none |
| 2 | Target dates for the AEM Sites launch must be confirmed in week one. | none |
| 3 | Target Audience: describe how AEM Sites pages will serve small-business owners. | none |
| 4 | Explain how Target would run A/B tests on AEM Sites pages. | names Target |
| 5 | Describe how you would use Adobe Experience Platform for profiles. | "Your client rules out Real-Time CDP, so the catalog cannot draft an answer to this request." |
| 6 | Describe how you would use AEP for profiles. | same as 5 |
| 7 | Describe how Analysis Workspace would be used for reporting. | names Adobe Analytics |
| 8 | Describe how a coworker on our team would approve pages. | none |
| 9 | Describe how you would use Coworker in Workfront. | names Coworker |
| 10 | Describe how Commerce data would feed AEM Sites. | names Adobe Commerce |
| 11 | Describe how you would use AJO for journeys. | names Journey Optimizer |
| 12 | How would we meet our target dates? | none |

Keep the Briarhaven A.1 check from 6b (no note).

## Done

Run the grader, parity and every suite (the long `test_review_nov2.js` needs about 17 minutes; give it 25). Add a "Round 6c" section to `ROUND6.md`, push to `chatgpt/round6` only, and write "ROUND 6C DONE" at its top. Claude then merges and ships.
