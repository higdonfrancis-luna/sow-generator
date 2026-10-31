# Unresolved assumptions

October 31, 2026. What the audit fixes could not settle by rewriting. Each item says who can close it. The change log is `CHANGE_LOG.md`.

Suggested positioning until these close (the audit's own words): "a partner services design prototype grounded in Adobe's documented capabilities. The scopes, effort bands and fees are planning assumptions for joint validation."

## Delivery economics (for Deloitte and the partner delivery leads)

1. **The hours are planning assumptions.** Every service now names the quantity behind its Small, Typical and Large hours (`sow/estimating_bands.json`), but none of those hours comes from delivery actuals or an independent estimate. The file records the estimate owner as "Not yet assigned" and the confidence as low. Still missing per service: the roles, hours per role, complexity and maturity assumptions, and a named estimate owner. Suggested step, from the audit: give Deloitte two realistic client briefs (estate, maturity, scope units, acceptance criteria) and have their delivery leads estimate before they see these numbers, then reconcile.
2. **The band quantities are ours.** For example, the Typical site build assumes up to 10 templates, 30 blocks, 3 integrations and 50 pages for 960 hours; the Typical Brand Concierge build assumes up to 3 product lines, 15 sources, 3 journeys and 150 test conversations for 640 hours. They make each estimate testable; they are not Adobe guidance. The prompt thresholds (under 200, 200 to 1,000, 1,001 to 3,000) and market thresholds (one, two or three, four to six) extend the October 29 size definitions; Adobe recommends no prompt count. Bands still step at their edges (1,000 to 1,001 prompts doubles the setup service's hours), and AI engines and review cadence are not separate inputs.
3. **No cost, margin or overrun model.** The tool shows fees (hours times the partner's rate) and says so. Staffing mix, delivery cost, presales, overruns and margin stay in each partner's own private model. The audit's stress test applies: at a $90 loaded cost, 104 hours billed at $150 is a 40% contribution, and 25% if the work takes 130 hours.
4. **Recurring work carries most of the value.** Standalone Brand Visibility's monthly program is 89% of its displayed total, and Coworker adoption is 384 hours a year. Every monthly service uses one term (12 months by default) with no ramp, start month or stop rule; the canvas always shows a 12-month term, while the SOW steps use the term entered. Coworker adoption now carries a three-month usage review; the rest needs an agreed backlog, operating owner and renewal criteria per customer, ideally from two or three paid pilots that track actual effort.
5. **Shared setup can still count twice on a canvas-built play.** Overlapping Coworker Skills are caught, but data-collection setup that several connections need (datastream, Web SDK, the martech plugin, consent) can be charged on more than one line (for example TG01, XA06, XA22, XA23, XA24). Overlapping lines also stay in the totals until rewritten; only export waits. The new, live-and-healthy or needs-fixes question is asked for Brand Concierge in the FSI play only, not for other applications.

## Adobe availability (for the Adobe product and solution owners)

6. **Capabilities to confirm for each client's tenant, edition and region:**
   - Real-Time CDP context in Brand Concierge replies: Limited Availability in the October 27 release notes, while the FAQ (same day) says the current scope is anonymous visitors with no live profile lookup. The tool treats the anonymous experience as the baseline and asks for Adobe's written confirmation before the profile line is issued.
   - Brand Concierge human handoff: the October 27 handoff page documents live chat and meeting booking through Adobe Marketo Qualifier, while the Brand Concierge home page (January 2026) still calls handoff upcoming.
   - Brand Concierge analytics: the built-in dashboard lists no purchase or revenue measure, while the FAQ's metric table mentions purchase rates for assisted and unassisted visits; and Adobe documents no route for analyzing concierge data in the client's own CJA.
   - Journey Optimizer follow-up after a concierge conversation: on Adobe's product page, but not documented on Experience League (the FAQ's roadmap line is partly outdated).
   - The deployment pilot: Adobe lists edge auto-optimization as Early Access for select opportunities, and its trial limits conflict (10 pages in the Optimize at Edge FAQ, 50 URLs for trials from April 1, 2026 in the Quick Start).
   - AEM agents in Coworker: Try Before You Buy, a trial or the Agentic SKU, confirmed with the CSM or TAM.
   - Early Access: Sites Optimizer Core Web Vitals pull requests and Dispatcher redirects; the Workfront plugin for the Universal Editor.
   - Legacy: Journey Optimizer offer decisions in Target activities.
   - Coming soon: the B2B editions of CJA, Real-Time CDP and Journey Optimizer in Coworker, and Coworker's in-product panels in Real-Time CDP and Journey Optimizer.
   - Coworker for financial services: Adobe's Coworker in Workfront page says Coworker isn't currently offered to finance, health care and some other organizations, while Adobe's licensing deck uses a bank and an insurer as examples. This touches the FSI play's Coworker services.
   - 29 of the 59 canvas connections, where Adobe states no availability at all; their cards say "Not stated by Adobe; confirm for the client's tenant."
7. **Edge routing for Commerce and Edge Delivery.** Brand Visibility's self-serve routing is documented only for AEM as a Cloud Service's managed Fastly CDN, and it checks the detected CDN. Adobe documents no Brand Visibility routing path for Adobe Commerce on cloud infrastructure; the Fastly VCL route there is an inference from Commerce's own VCL documentation. Confirm with Adobe (abv-at-edge@adobe.com) the path and effort for Commerce on cloud Fastly and for a CDN in front of it, and whether an Edge Delivery site on Adobe's managed CDN is detected for self-serve routing. The AEM play confirms the CDN route in discovery.

## Commercial decisions (for Adam)

8. **The AEM play's total is mostly a web program.** Its 1,600 hours of discovery, site build, migration, launch and governance are $240,000 at $150, about half the play's total. The audit suggests two offers, or showing total program services, ABV-attributable scope and work already contracted separately. Not changed; it's a positioning call.
9. **What to demonstrate.** The six fixed plays are the reviewed set. Create your own play holds 146 lines from Adobe documentation research; they arrive as service concepts that can't be exported until written, their hours are placeholder bands, and the canvas total says how much of it they are.
10. **Buying intent is untested.** Buyer, budget, trigger, current agency or internal owner, competing solution, and new spend versus replacement are outside what the tool can show.
11. **The $100 to $300 rate range** was removed because it has no source in the package (it reverses your October 29 call). It can come back with a named source.

## Evidence and interface still to complete

12. **Per-service evidence records.** The connections carry Adobe's quotes (`sow/canvas/research/connection_types.json`), and the facts behind the corrected SOW text are cited in the change log. A full record for each of the 184 lines (claim, URL, document date, checked date, passage, what it proves and doesn't) is not done.
13. **Legacy implementation pages** (for example the Analytics for Target transition and AEM 6.5 notes) should be qualified for the client's installed estate. The Brand Visibility security overview PDF, which the audit couldn't retrieve, was checked on October 31 and is available.
14. **The canvas on phones and in other currencies.** Below 900 pixels wide the hint, and with it the line-style legend, is hidden, and the i dots are small to tap. The canvas shows US dollars; the currency chosen on the Services step applies to the SOW only.

## Contract and compliance

15. The statement of work is a draft for the partner's own commercial and legal review. Section 8 must be written before the SOW is issued; nothing in the tool is legal advice. In the FSI play, compliance decisions stay with the customer's reviewers, and live chat conversations are kept for 30 days in Marketo Qualifier, which each customer checks against its own record-keeping rules.
