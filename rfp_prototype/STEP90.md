# Step 90: hours per answer, and the license named (Nov 13 2026)

The blind panel on the insurer RFP (step 89) marked the AI answers down on two things. Adam asked to hear more, then: "yes build
both and deploy the worker".

## 1. Hours per answer

**Before.** Answers quoted the hours of a bigger service they were part of: the accessibility answer (B.3) said "Site build (960
hours) and governance setup (120 hours) give a planning estimate of 1,080 hours", the Akamai answer (B.5) 1,240 hours, so the
960-hour site build appeared in four answers and a buyer adding them up saw over 4,000 hours for one website. Where no catalog
service covered the work, the answer said it was "sized once scope is agreed" (the Genesys handoff, the Salesforce direction,
reviewer training), which gave the panel nothing to hold the vendor to.

**Built (the writer's brief, `RFI_ANSWER_RULES` item 4).** A service's hours are quoted only when the question is about that
whole piece of work. When a question covers only part of a bigger service that other questions also draw on (a site build,
discovery, launch, a whole implementation), the answer names that service and does not repeat its hours. Every answer still says
what its work takes: its own services' hours, the writer's own short range for work no service covers ("about 40 to 80 hours"),
or that it adds no hours of its own. Never a bracketed field and never "sized later". The statement of work was never affected:
it counts each service once.

## 2. The license named

**Before.** C.3 and C.5 routed the handoff to an agent "through Adobe Marketo Qualifier", D.5 suggested "AEM Forms adaptive
forms", and B.6 built the Compliance workflow in Workfront: products the insurer had not chosen, presented as if included.

**Built.**
- Each request carries the products the RFI names (`rfi_products`: chosen or already in use), and the writer is told to say once,
  in Timeline and effort, when the answer uses any other Adobe product: "This uses Adobe Marketo Qualifier, which is licensed
  separately."
- The page checks every written answer (`licenseLines` in `rfp_answers.js`): a product the answer names by its full name, or whose
  service the answer rests on, that the RFI does not name gets that line, unless the writer already said it. Not counted: a
  product the answer rules out ("Adobe Target is not licensed in this phase"), one named only to compare ("what differs from Adobe
  Analytics", "unlike", "migrating from"), and "Adobe Experience Platform", which runs under every Customer Journey Analytics
  answer and is not Real-Time CDP.
- The word limit cuts other items before the license line.
- A license is a prerequisite, not a caveat (rule 12), so it stays.

## Live (worker deployed Nov 13, 01:52 UTC, code only, 8 bindings unchanged; rollback = the code at commit cecb021)

| | Insurer form, Nov 12 | Insurer form, Nov 13 |
|---|---|---|
| Answers quoting a whole service's hours | 9 | 3 (C.3 is the Brand Concierge implementation question itself; C.1 and F.4 quote their own services) |
| Answers that leave work "sized later" | 8 | 0 |
| The writer's own ranges for uncovered work | 0 | 8 |
| License lines | 0 | B.6 Workfront, C.3 and C.5 Marketo Qualifier |
| Answers over their word limit | 0 | 0 |

The insurer PDF and Tallgrass match: no "sized later" anywhere; Tallgrass gives its migration a range ("about 120 to 200 hours").
C.5 now reads: "The Concierge handoff setup is part of our Implement Brand Concierge service and adds no hours of its own. The
Genesys Cloud bridge is a planning estimate of about 40 to 80 hours. This uses Adobe Marketo Qualifier, which is licensed
separately." Answers: `step90_live/`.

One false line was found on the live run and fixed before the zip: Tallgrass's analyst training answer says it will "cover what
differs from Adobe Analytics", and the page added "This uses Adobe Analytics, which is licensed separately." A name that follows
a comparison word no longer counts; a product the answer relies on is still caught through its services.

## Seen, not changed

- The matcher's alias "experience platform" (Real-Time CDP) also matches "digital experience platform", a common RFP phrase:
  the insurer RFP's title counted as naming Real-Time CDP. The license check ignores it; the matcher itself is unchanged, so a
  question about a "digital experience platform" is still read as Real-Time CDP.

Checks: `node sow/test_rfp_step90.js` (18, the writer stubbed); `test_rfp_step88.js` follows the request's new field.
