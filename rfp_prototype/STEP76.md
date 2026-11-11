# RFI Builder step 76: four fixes to the answer writer (Nov 11 2026)

Adam: "Fix 1-4 and fix s27". The four were found in his download of the Washington State RFP after Build Answers with AI.
No AI is involved in any of them; no screen changed. All are in `sow/rfp_answers.js`.

## 1. A bare "AEM" follows the RFI

"AEM" or "Adobe Experience Manager" with no product after it used to mean AEM Sites, always. Now it is AEM Sites unless the
RFI names AEM Forms (or AEM Assets) in full more often than it names AEM Sites; then it is that product (`aemHome()`, applied
in `scan`). A line that says "AEM Sites" in full is still AEM Sites.

Washington State RFP with the saved AI reading: lines answered as AEM Sites went from 14 to 1 (the one that says
"AEM Sites Author"). "Provide training for DCS IT staff on the use of AEM" now gets Training for authors, developers and
administrators (AF16), not Author training on the Universal Editor.

## 2. Financial services needs real evidence

The word "insurance" used to mark the client as a bank or insurer, and every public RFP asks the bidder for insurance. Now
the evidence is a bank word as before, words only an insurer uses of itself (policyholders, underwriting, reinsurance,
insurance products), or Insurance / Assurance in the client's name or the file's name (`isFSI()`). "Insurance", "insurer"
and "insurance company" alone no longer count.

## 3. A transfer of knowledge is not a migration

"Transfer of knowledge", "transfer the knowledge" and "knowledge transfer" no longer count as a move, and the word
"transfer" in them no longer matches Content migration with Content Transfer Tool (`KNOWLEDGE`). "Transfer our pages" is
still a migration.

## 4. The office tools a line names are not Adobe services

"Using Microsoft Office products and/or MS Project" is taken out before a line's words are matched to service names
(`OFFICE`), so "MS Project" no longer finds "Forms onboarding, project setup and access". Two words were added to the
list of words too common to prove a service alone: "user" and "project" ("a test plan for user testing" was matched to
Acrobat Sign's "Account, users, groups and sign-in" once fix 1 changed which products the RFI is about).

## Also

S27 in `sow/test_review_nov2.js` now expects the Availability line the Nov 8 card audit put on the CDN card. The tool
did not change.

## Seen, not changed

- "Provide training and knowledge transfer documentation identifying setup, use, maintenance and administration ..." is
  read as an after-launch question because of the word "maintenance", and gets four monthly services.
- "Migrate our forms from AEM 6.5 to AEM Forms as a Cloud Service" does not lead with Migration from AEM 6.5 Forms
  (no word of the question matches the service's name once the product's own words are set aside); "migrate our content
  from AEM 6.5" does.
- Under a heading that names a product, a line with no service words still gets that product's starting services.
- A bank is still read from the word "bank" anywhere in the RFI.

## Checks

`node sow/test_rfp_step76.js` (17).
