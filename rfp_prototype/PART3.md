# RFP Builder, part three: sourced Adobe facts (first step)

Part three gives hosting, security, residency, SSO, uptime, privacy and licensing questions a sourced answer. Today these questions get the capability box: one Trust Center link and an empty answer. This first step does three things, and nothing in the prototype is built or changed:

- It lists what the four test RFPs ask in this area.
- It gathers the facts, with sources, from Adobe's public pages for the catalog's 14 Adobe products.
- It shows Adam a mockup of one answered hosting question.

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

## Questions for Adam

1. **The picture:** is the 2.6 answer the right shape?
2. **Licensing:** how each product is metered (per 1,000 profiles, per million rows and so on) is close to pricing, which the tool leaves out. Proposed: licensing facts go to the partner note, never the client's answer, except "needs its own license" lines like AEM Forms.
3. **A fifth test RFP** with SSO, uptime, a named region, encryption, GDPR and consent questions, since the four ask only two in this area. Proposed: yes.
4. **Trust Center:** for the ten products whose certification lists are only on the Trust Center, Adam could save that page (or its PDF) into the repo and the facts come from his copy. Otherwise they stay "Confirm with Adobe".

## Not done

Nothing in `sow/rfp_answers.js`, the catalog or the prototype site has changed. Building waits for Adam's yes on the picture.
