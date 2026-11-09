# RFP Builder, part three: sourced Adobe facts (first step)

Part three gives hosting, security, residency, SSO, uptime, privacy and licensing questions a sourced answer. Today these questions get the capability box: one Trust Center link and an empty answer. This first step does three things, and nothing in the prototype is built or changed:

- It lists what the four test RFPs ask in this area.
- It gathers the facts, with sources, from Adobe's public pages for the catalog's 14 Adobe products.
- It shows Adam a mockup of one answered hosting question.

Adam said yes to the mockup, and the knowledge base is now built in the prototype: see "As built" at the end.

The three "Left as built" choices in `STEP55.md` stand as they are.

## What the four test RFPs ask in this area

| Test RFP | # | Question | Topic | Today |
|---|---|---|---|---|
| Bank (text and Excel) | 2.6 | Where is our data hosted, and what security certifications apply to the Adobe products you propose? | Hosting, residency, certifications | Capability box with one link. The question names no product, so Drawn from is empty |
| Bank (Excel only) | 2.7 | ... how would site forms on the new site feed Marketo, and what licensing does that need? | Licensing | Answered from the catalog: Submit to Marketo Engage, and AEM Forms needs its own license |
| Manufacturer (PDF) | B.5 | Describe the governance model you propose for Real-Time CDP data and consent. | Privacy, consent | Answered from the catalog's governance and sandbox service lines; nothing on consent, Privacy Service or retention |
| Manufacturer (PDF) | A.3, C.2 | Professional liability insurance; IP ownership of deliverables | The firm's own terms | Your firm pile (right: not Adobe facts) |
| Bank | 3.3 | Acceptance of our master services agreement | The firm's own terms | Your firm pile (right) |
| Retailer (Word) | none | | | |

No test RFP asks about SSO, uptime, encryption on its own, a named region, or GDPR. The outside reviewers' inputs did (Nov 9 review, finding 4.9): "Where is Brand Concierge data hosted, and is it encrypted at rest?" and "Does Real-Time CDP support data residency in Australia?". A fifth test RFP would cover these (see the questions for Adam).

The bank's other answers propose eight products, read from each answer's Drawn from: AEM Sites, Edge Delivery Services, Real-Time CDP, Customer Journey Analytics, Target, Marketo Engage, Brand Visibility and Brand Concierge. Question 2.6 asks about "the Adobe products you propose", so its answer draws on those.

## The research

There is one file per topic in `part3_research/`. Each fact has the exact URL, a short quote copied from the page, the page date and a status. The quotes were checked by script against the page text fetched on Nov 9, 2026. Claude also re-checked ten key quotes by hand: the CJA region and no-move lines, the AEM primary region, the Brand Concierge residency line, the Edge Delivery certifications and encryption, the AEM Sites 99.99% option and the Commerce SLA split.

| File | Facts | Checked on the page | From search snippets only |
|---|---|---|---|
| `hosting.json` (hosting and residency) | 92 | 85 | 7 |
| `security.json` (certifications, encryption, SSO), plus 9 shared | 74 | 65 | 9 |
| `uptime_privacy_licensing.json`, plus 15 shared and 35 for B.5 and 2.7 | 161 | 158 | 3 |

"Unverified" facts come from search snippets of www.adobe.com pages that this session can't open. They are kept in the files, marked, and none of them is in the mockup.

### What is well covered

- **Hosting and residency:**
  - Real-Time CDP and CJA: the customer chooses the region at provisioning and data can't be moved later; the Azure and AWS regions are listed.
  - AEM Sites: the primary region is chosen at creation and can't be changed; up to three extra publish regions; Fastly CDN.
  - Edge Delivery: US for work in progress, global for published content, and a sovereign option.
  - Target: the cluster locations.
  - Marketo: AWS, a single region and the data centers.
  - Commerce: SaaS versus PaaS, AWS, Azure and Fastly.
- **Certifications:**
  - AEM as a Cloud Service, which includes Edge Delivery: ISO 9001, ISO 27017, CSA STAR Level 2, IRAP, CSA CAIQ, SOC 2, SOC 3 and SOC 2 + HIPAA.
  - Commerce SaaS: SOC 2 Type II, ISO 27001 and PCI DSS.
  - HIPAA readiness by product. Not HIPAA-ready: Brand Visibility, Sites Optimizer and Universal Editor.
- **Encryption:** Edge Delivery, Experience Platform, Commerce and Marketo, plus customer-managed keys for Experience Platform and AEM.
- **SSO:**
  - Admin Console Federated ID over SAML 2.0 (Okta included) or OIDC (Microsoft Entra ID).
  - AEM's sign-in covers authors only, not site visitors.
  - Marketo's SSO goes through a support ticket.
- **Uptime:**
  - AEM Sites 99.99% is a separate license and needs an Additional Publish Region.
  - Commerce: 99.99% infrastructure and 99.9% application on PaaS, 99.9% on SaaS.
  - AEM backups: point in time for 24 hours, 7 days of backups.
- **Privacy:**
  - The full governance and consent picture for Real-Time CDP: labels, policies, enforcement, IAB TCF 2.0, Privacy Service and retention.
  - Consent enforcement needs the paid Shield add-on.
  - Retention periods for Journey Optimizer, Target and Marketo.
- **Licensing:** each product's editions and how it is metered (no prices), and the AEM Forms license that form submission needs.

### Gaps

- **Certification lists** for Real-Time CDP, Journey Optimizer, CJA, Target, Marketo, Workfront, Brand Visibility, Sites Optimizer, Brand Concierge and Coworker are only on the Adobe Trust Center (www.adobe.com). www.adobe.com was added to this environment's allowed hosts this session. It still answers this session's plain requests with a bot check (403), and Claude did not try to get around it.
- **Hosting regions** for Brand Visibility, Sites Optimizer and Coworker: no Adobe page says where they run.
- **Uptime figures:** none found for Experience Platform apps, Marketo, Workfront, Brand Visibility, Brand Concierge or Coworker. Adobe's SLA PDFs are on www.adobe.com.
- **Coworker:** nothing on encryption, certifications or whether it trains on customer data.

### Where Adobe's pages disagree

- **Brand Concierge region:** the FAQ (Oct 27, 2026) says personal data "stays local in line with applicable regional regulations". The March 2026 security overview says every part runs in US-East. In the mockup this stays out of the client's answer and goes to "Confirm with Adobe".
- **Brand Concierge training:** the FAQ says it is "trained on your organization's content and customer data". The security overview says Adobe does not use customer data to train it.
- **Target hosting:** the same page says "Adobe-owned and Adobe-leased data centers" and "hosted on AWS". The mockup says only the cluster cities.
- **Experience Platform regions** differ between pages (Switzerland, and India as IND1 or IND2).
- **Workfront EU clusters** are listed differently in two tables.
- **Edge Delivery certifications** print "ISO 20018:2019", probably meant as ISO 27018. The mockup leaves it out.
- **Commerce uptime** depends on the deployment model, so answers have to say which one.

## The mockup

Files: `sow/mockups/part3_kb/answer_2_6.png`, with the HTML beside it. Today's panel (from the built prototype) is on the left, the proposed panel on the right. How the proposed answer works:

- **Drawn from** is filled with the products the RFP's other answers propose, because the question names none.
- **Your response to the client** has three parts:
  - Where your data is hosted: one line per product, each with a numbered Adobe source.
  - Security certifications and encryption.
  - The numbered sources, under the heading "Adobe's public pages, checked Nov 9, 2026".
- **Only facts checked on the page reach the client.** A fact where Adobe's pages disagree, or one with no Adobe page, goes to the partner note under "Confirm with Adobe before you send".
- **Ask your client** gets one item with the existing type-in field: which region the data must stay in, since the region is chosen at setup and can't be moved.
- **Approve, Leave out and Next to review** work as they do today.

## Questions for Adam, and where they landed

1. **The picture:** Adam said yes, and it is built (below).
2. **Licensing:** built as proposed. How a product is licensed and metered (editions, per 1,000 profiles and so on) goes to the partner's note under "Adobe licenses this proposal includes", never the client's answer. Only "needs its own license" sentences reach the client (AEM Forms for site forms, Sites Optimizer only with AEM Sites, the Shield add-on for consent enforcement, Brand Concierge's other Experience Platform features, Coworker's underlying products).
3. **A fifth test RFP:** not added as a fixture file, because every earlier suite loops over `expected.json`. The new suite asks the same questions (SSO with Okta, uptime, a named region, encryption, GDPR, opt-outs, HIPAA, licensing) as pasted questions instead. A fixture file is still open if Adam wants one to try by hand.
4. **Trust Center:** still open. The ten products whose certification lists are only on the Trust Center are named under Confirm with Adobe. If Adam saves that page or its PDF into the repo, their certifications can come from his copy.

## As built

Adam: "yes" to the 2.6 picture. Built in the prototype only (`sow/rfp_prototype/site/`); the live SOW tool is unchanged.

**The knowledge base**
- `part3_research/statements.json` holds 76 sentences written for the client, 9 Confirm with Adobe lines and 4 client asks. Each sentence lists the quotes behind it, and the 79 source titles are the pages' own titles, with the product added where a title was generic.
- `part3_research/build_facts.py` finds every quote among the facts marked verified in the three research files (or, for a quote marked `pdf:`, in the text of Adobe's Brand Concierge security overview in `abc/internal/`), takes each sentence's sources from the facts it matched, and writes `sow/rfp_facts.json`. It stops if a quote is not found, a source has no title, or a sentence has an em dash. `python3 sow/rfp_prototype/build.py` runs it first, and `sow/patch_step49.py` puts the file into the page as `RFP_FACTS`.

**How an answer is put together** (`kbDraft` in `sow/rfp_answers.js`)
- **Topics:** hosting, certifications, HIPAA, encryption, single sign-on, uptime, privacy and licensing, each found by its own words in the question. Single sign-on needs a word like SSO, SAML or Okta, so "after they log in" (a site visitor) is not a sign-in question.
- **Which questions:** fact questions (and requirements on these topics) try the knowledge base before the capability box. A question the catalog finds no services for tries it before No match.
- **Products:** the ones the question names; else the ones its section names; else the Adobe products the RFP's other answers draw on, in the order they first appear. The Drawn from chips work as before, so taking a product out redrafts without it.
- **The response:**
  - One bullet per product with its name in bold, and a numbered superscript for each Adobe source. General lines (Admin Console sign-in, status.adobe.com) come first.
  - Our own sentences come last: "We will attach Adobe's current certification list ...", shown only when a product has none here, and "Adobe licenses each product ...".
  - The sources come as a numbered list under "Adobe sources for the product facts above".
- **The partner's note:**
  - Confirm with Adobe holds every disagreement between Adobe's pages that touches the answer's products, and names each product the pages say nothing about for that topic.
  - Ask your client holds the topic's ask (region, identity provider, uptime targets, consent platform), ticked, so it reaches the response as "What we would need from you".
- **No sourced fact, no answer:** if no product in the question has a sourced sentence on the topic, the old capability box stays. Coworker hosting, Brand Concierge FedRAMP, languages, WCAG and author limits all still get the box.
- **The panel** adds "The products your other answers in this RFP propose" (when they were) and a red "Adobe's public pages, checked Nov 9, 2026" badge.

**Downloads**
- The client copy keeps the numbered lines and numbered sources.
- The Excel keeps the numbers in the Response column, and its Sources sheet numbers each answer's rows to match.
- The write-back into the client's own workbook keeps the numbered sources in the cell, since that workbook has no sources sheet.

**Wording rule found on the way:** "a limited number of customers" (AWS on Experience Platform) is one of the lifecycle phrases the client never reads. The client sentence names AWS as an option Adobe offers, and Adobe's words sit under Confirm with Adobe.

**Checks**
- `python3 sow/rfp_prototype/build.py` prints ALL FACT CHECKS PASSED.
- `node sow/test_rfp_part3.js`: 38 checks, ALL PART 3 CHECKS PASSED.
- The eight earlier suites all pass, 448 checks: `test_rfp.js` 67, steps 50 to 55 (49, 37, 52, 68, 73, 61) and `recheck.js` 41. Five checks changed on purpose, because those questions now get the knowledge base instead of the capability box:
  - `test_rfp_step52.js`: bank 2.6, the reviewers' 4.9 inputs, and the box check, which now uses "Is Brand Concierge FedRAMP authorized?".
  - `test_rfp_step55.js`: 2.6 is now a draft in the Excel.
  - `recheck.js`: 4.9.
- The harness (`review_2026-11-09/harness.js`) now passes `kb` and `confirm` back to the tests.
- `node sow/qa/check_rendered_copy.js` (about an hour) prints ALL RENDERED COPY CHECKS PASSED, 14 checks, on the built prototype. It read the 24 drafted answers of the four test RFPs, 2.6 included, the four client copies and the four checklists, and found no partner or Client word and no lifecycle label.

Pictures: `sow/mockups/part3_kb/answer_2_6.png` (the approved mockup) and `built_answer_2_6.png` (the built panel).

**Not done**
- Merging knowledge-base privacy facts into catalog answers such as manufacturer B.5, which still drafts the governance services only.
- A fifth fixture file.
- The Trust Center certification lists.
