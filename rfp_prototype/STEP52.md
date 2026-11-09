# Step 52: honest piles and matching (as built, Nov 10 2026)

Approved with the first batch on Nov 10 (see `STEP50.md`), together with decision 3, the pile names. The plan is step 52 in section D of `review_2026-11-09/RESPONSE.md`.

## The piles

- **Names (decision 3).** "Adobe services" is now "Adobe products" and "Not sure" is "To sort", on the filters, the row tags and the pile menu. Every filter shows its count, and "Not picked up" (step 50) sits beside them. As in picture 4, "Clear" stays for now: the "To review" filter and "Start over" with a confirmation come with step 55, the review flow, as planned.
- **Always the firm's.** References, case studies, résumés, the firm's certifications ("are you SOC 2 certified", "their Adobe certifications"), pricing model, your rates and fees, not-to-exceed, the MSA, insurance coverage, staffing ("a certified AEM project manager", "the architect who will lead", "developers assigned"), the firm's experience ("Describe your experience implementing ...") and the firm's own tools ("Do you use generative AI tools such as ChatGPT in delivering services?"). These win even when a product is named.
- **The firm's only without a product.** Pricing, costs, insurance, legal, invoices, payment terms, change requests, employees, our team, time zone, escalation, discount, quality assurance and the like. "How does Adobe Commerce handle B2B pricing?" is about the product; "Provide your payment terms" is the firm's. All 16 of the reviewers' product questions and the verifiers' ten more now land in Adobe products, and the six firm controls stay in Your firm.
- **To sort.** A question or requirement that names no Adobe product goes to To sort unless it asks for an approach to work this catalog scopes, or names the work an Adobe product does in a strong phrase ("A/B testing", "marketing automation", "a customer data platform"). A yes/no or fact question with no product ("Do you support SSO?", "Where will the solution be hosted?") goes to To sort. To sort rows say "Sort first", are never drafted, never counted as Adobe answers, never opened first, and go into the downloads as blanks ("To sort: not drafted"; in the Excel "To sort: still to answer").

## The matcher

| Finding | What it does now |
|---|---|
| 4.1 Topic words | Product names and topic words are separate lists. A draft starts from a product the question names, or its stem or section names. A topic word only adds the second product of a documented connection to a named one ("AI shopping assistants" on Adobe Commerce gives Brand Visibility + Commerce), or picks the products when the question asks which to use ("Which Adobe products would you use ...?"), or names the work in a strong phrase in an approach question ("report on the full customer journey"). "target" and "Commerce" count only as Adobe Target or Adobe Commerce, or capitalised mid-sentence ("connect AEM Sites to Target", "reach Commerce product pages"); "targeting" never does. |
| 4.2 The firm's tools | A firm question (see the piles), so never a Brand Visibility proposal. |
| 4.3 Adobe Analytics | Drafts only the upgrade line (CJ03) and proposes Customer Journey Analytics; the partner's note says Adobe Analytics is not in this catalog. |
| 4.4 Products not covered | AEM Forms, Adobe Campaign, Audience Manager, AEM Guides, AEM Screens, Adobe Express, GenStudio, Firefly, Frame.io, Mix Modeler, Adobe Advertising, Marketo Measure, Acrobat Sign and Adobe Learning Manager are named as "Not in this catalog", with a box for the partner's own answer. The longest name wins, so "aem" never scores inside "AEM Forms" or "AEM Assets". |
| 4.5 Negation | A product the client rules out ("We will not use Adobe Target", "instead of Marketo") is dropped, and the partner's note or the No match panel says so. |
| 4.6 Ties | The connection whose two products the question names most strongly wins. Retail Q3 gets Commerce + AEM Assets. |
| 4.7 Lines that ignore the client | The words of the products the question names are not evidence for a line ("analytics" in Customer Journey Analytics no longer pulls the Adobe Analytics upgrade); beside a matched connection a product's own line needs a distinctive word of its own name in the question; products the RFP says the client runs get no setup, upgrade or launch lines. Bank 2.2 is C01 alone; bank 2.7 is the site forms that feed Marketo (XB09) alone. |
| 4.8 Answers with nothing in them | No line means No match, never one empty sentence. The ongoing-services answer names only the products that have monthly lines. A question about ongoing support under a product's lot gets that product's monthly lines. |
| 4.9 Capability and hosting questions | A yes/no or fact question (is, are, does, can, where, what languages, how many, what is the uptime), or a requirement about hosting, security, compliance, SSO, uptime, retention or languages, gets the box Adam approved: "A capability question, not answered from this catalog", with the Adobe Trust Center for hosting and security questions, Adobe's Brand Concierge security overview for Brand Concierge, the product's own page from the catalog, and a box for the partner's answer. |
| 4.10 Ownership | Step 50: read from every paragraph, product names only. |
| 4.11 Aliases | ABV, LLMO, AEP and Adobe Experience Platform are names (Experience Platform maps to Real-Time CDP, whose lines are the platform work). A migration word (migrate, move, import, transfer, upgrade) lifts the migration lines: the WordPress and legacy DAM question now draws the asset and content migration lines. "rebuild" alone no longer means a site. |
| 4.12 Several products | Every named product is kept, up to six lines are drafted, the approach names the other documented connections between them, and the partner's note names the pairs the catalog has no connection for. |
| 4.13 Durations | "How many weeks to implement ...?" adds "Our planning estimate: about N hours of our work for the services above, at a typical size", from the catalog's hours. The sources heading reads "Adobe sources for the product facts above". |
| 4.14 Sources | Every drafted line's own page comes first, then the lines' references, then the connections' sources; the list is never shorter than the number of lines. |
| C12 Drawn from | Each product chip has an × to take it out, and "+ Add a product" adds one; the answer is drafted again from the partner's choice, which is kept on the question. Drafts with no catalog match show the same row, so a wrong No match is one click from a draft. |

## What changed in the three made-up RFPs

| Question | Before | After |
|---|---|---|
| Bank 2.2 | CJA + Brand Visibility: C01, C06, CJ03 | C01 (the connection line); the upgrade and the audiences line are gone |
| Bank 2.6 (where is our data hosted) | nothing drafted, counted as an Adobe answer | the capability box |
| Bank 2.7 | XB09, MK05, MK06, A03 | XB09 (the client runs Marketo, so no instance setup; no site go-live) |
| Bank 2.8 (which products for known customers) | Target + CJA: 3 lines | Real-Time CDP, Target and CJA: 6 lines across the three |
| Retail Q1 (product pages for AI shopping assistants) | "We would deliver this with Adobe Commerce." and nothing else | Brand Visibility + Commerce: C02, L03, C07 |
| Retail Q2 (abandoned carts) | No match | Journey Optimizer: JO05, JO01, JO04, JO02 |
| Retail Q3 | AEM Sites + AEM Assets (wrong) | Commerce + AEM Assets: XC14, XC15, XC13 |
| Retail Q4 | XA18, XA19, A01, XA20 | XA18, XA19, XA20 (the storefront lines) |
| Mfg B.2 | OX3, C06, CJ03 | OX3 (warehouse tables into CJA) |
| Mfg B.1, B.3, bank 2.1, 2.4, 2.5, B.4 | | the same lines or one tied line swapped; order follows the catalog where lines tie |

## Flagged, not done

- **Two Adobe links not re-opened here.** The Adobe Trust Center (https://www.adobe.com/trust.html) and Adobe's Brand Concierge security overview (already cited in `abc/internal/README.md`) are on www.adobe.com, which this session's network does not allow. Click each once on Proto before showing the tool.
- **Catalog wording (step 53, decision 2).** A few drafted lines still read badly because of the catalog text, for example AD1 on the compliance matrix's FR-01: "we will your ad admins approve access; we authorizes ...". That is the catalog change Adam approved as decision 2, built in step 53. The reference titled "Adobe: customer-journey-analytics.html" (finding 4.14) is renamed there too.
- **"Clear" and "To review".** Decision 3's "Start over" and "To review" filter come with step 55, as planned.

## Files

- `sow/rfp_finder.js`: the piles (`classify`, `FIRM_ALWAYS`, `FIRM_TOPIC`, `ADOBE_NAME`, `ADOBE_TOPIC`, `FACT`, `firmPart`).
- `sow/rfp_answers.js`: the matcher (`NAMES`, `TOPICS`, `UNCOVERED`, `scan`, `detectAll`, `match`, `compose`), the capability box, the chips, the notes, the downloads.
- `sow/rfp_ui.js`: the pile names and counts, Sort first.
- `sow/patch_step49.py`: the filter labels and the step 52 styles.

## Checks

`python3 sow/rfp_prototype/build.py`, then `node sow/test_rfp_step52.js`: 52 checks, ALL STEP 52 CHECKS PASSED. They replay the reviewers' pile and matcher inputs (`verification/c3_piles/`, `verification/c4_matcher/`). `node sow/test_rfp.js` had two checks updated: the sources heading, and the bank owning CJA and Marketo ("runs Marketo Engage" is ownership since this step).

The cross-step check after the merge, `node sow/rfp_prototype/review_2026-11-09/recheck.js`, replays the headline inputs of all three reviews: 41 checks, ALL RECHECKS PASSED (36 failed before the batch).
