# Audit fixes: change log, issue by issue

October 31, 2026. Response to the "ABV Partner Plays: Adversarial Readiness Audit" of the same day (`ABV_Partner_Plays_Adversarial_Audit_2026-10-31.html`, in this folder). The open assumptions that rewriting can't settle are in `UNRESOLVED.md`.

## What's in the revised package

- `abvsow-site-audit-fixes.zip`: the whole site (the Build canvas front page, and the Scope, Services and Statement of work steps at `/sow/`). It is the same layout as the audited zip; drag it into Netlify to deploy. Nothing has been deployed; abvsow.netlify.app still runs SOW step 12.
- Source on GitHub, branch `abv-partner-plays`: `sow/index.html` (the SOW steps), `sow/canvas/` (the canvas), `sow/site/` (the built site).
- Every Adobe fact used below was rechecked on Experience League on October 31, 2026; the pages and quotes are listed with each item.

How to check it yourself (from the repo root):

```
python3 sow/check.py sow/index.html      # 122 checks on the SOW steps
node sow/canvas/test_canvas.js           # the canvas, all seven plays
node sow/test_site.js                    # the one site, end to end
```

## Summary

| # | Audit finding | Status | What changed, in one line |
|---|---|---|---|
| B1 | Fees presented as what a partner makes | Fixed | "Illustrative services fees", planning hours times the partner's approved rate; no cost, margin or profit implied; the $100 to $300 range and the canvas's $150 default are gone |
| B2 | One more prompt doubles unrelated hours; "200 prompts across 3 markets" read as 2003 | Fixed | A number field sets only the three prompt services; every service names the quantity behind its Small, Typical and Large hours; typed hours must be explained |
| B3 | The optimization pilot contradicts its citation | Fixed | One quantity (20 to 50 High Potential URLs); deployment and rollback are the acceptance; Adobe's impact analysis is reviewed when Adobe generates it |
| B4 | Bot traffic is not person-level revenue attribution | Fixed | The CJA connection now reads "AI-agent activity and observed referral outcomes", and the SOW reports four measures separately |
| B5 | Fastly does not mean CDN readiness is done | Fixed | "CDN readiness and routing where required", on by default in the Commerce play, scoped from the real CDN setup |
| B6 | Native integrations mixed with partner workflows | Fixed | Every connection is typed (native, shared-platform, supported extension, partner-designed) with availability and prerequisites; partner workflows draw dashed |
| B7 | Concierge profile personalization needs qualification | Fixed | The anonymous experience is the baseline; profile context is gated on Adobe's written confirmation |
| B8 | Activity types and entitlements not enforced | Fixed | Target claims limited to supported activities; CJA audiences unlock with Real-Time CDP or Journey Optimizer; Forms and Fusion shown as prerequisites |
| H1 | Expanded catalog lacks SOW specificity | Fixed | Research lines are "Service concept, not quote-ready"; Download, Print and CSV wait until each has a deliverable, acceptance and assumptions |
| H2 | New builds, existing estates and reused work mixed | Fixed | FSI asks new, live and healthy, or live but needs fixes; overlapping Coworker packages need a distinct scope or drop out |
| H3 | "Year one" and delay treatment | Fixed | "Implementation + 12-month term"; section 8 lists billing, review windows, dependency deadlines, pause and restart and change control |
| H4 | FSI operating model incomplete | Fixed | The FSI SOW carries the operating model the customer owns, and the handoff and its 30-day chat retention are qualified |
| D1 | ABV text leaks into other SOWs | Fixed | Dependencies and stage outcomes come from the play and the selected services; tested on the downloaded file |

Hours were not lowered or raised to answer the audit. The default totals at $150 an hour, Typical, are unchanged for five plays; Commerce rises from $219,600 to $228,000 because CDN readiness and routing is now part of its default scope (B5).

## B1. Fees were presented as what a partner makes

Audit: "The live heading 'What a partner makes on this play' sits above hours multiplied by rates... The $100 to $300 partner-rate statement has no provenance."

Changed:
- SOW steps: the heading is "Illustrative services fees". Under it: "Planning hours × your rate of $150 an hour. These are fees, not profit: no cost, margin or overrun is modeled." Before a rate is entered: "Enter your approved rate to see illustrative fees".
- The rate hint is "Use your approved rate card." The $100 to $300 range is removed from the code (`RATE_RANGE` is gone).
- The Services intro says the hours are "assumptions to confirm with your delivery lead, not a quote".
- The statement of work's fee section opens: "Illustrative services fees: planning hours × the partner's hourly rates. The hours are planning assumptions tied to the quantities in section 3 and are confirmed by the partner's delivery lead before approval. No cost, margin or overrun is modeled."
- Canvas: no default rate (it was $150). The total reads "Illustrative fees: implementation + 12-month term".

Flag for Adam: removing the range reverses your October 29 call ("100 to 300 is perfect"). The audit's point is that the range has no source in the package; if Adobe or a partner publishes one, it can come back with that source named.

Tested: check.py (no rate range anywhere on the Services step; heading and captions), test_canvas.js (a fresh canvas has no rate).

## B2. One additional prompt could double unrelated implementation hours

Audit: "200 prompts selects Small; 201 selects Typical. That switches EDS implementation from 480 to 960 hours... The free-text parser also reads '200 prompts across 3 markets' as 2003."

Changed:
- "Prompts to monitor" is a number field. A second number field, "Markets or languages monitored", sits beside it.
- The prompt count sets only the three services whose work scales with prompts: prompt strategy (L01), setup and baseline (L02) and the monthly review (O01). Fewer than 200 prompts is Small, 200 to 1,000 Typical, more than 1,000 Large; two or three markets raise the band to at least Typical, four or more to Large. 200 is now Typical, which is what those services' own scope text always said.
- The global switch is now "Delivery size". It sets every other service's band and is never set by the prompt count.
- Every one of the 40 services names the concrete quantity its Small, Typical and Large hours assume (`sow/estimating_bands.json`), in the units the audit named: templates, blocks, integrations and pages for the site build; pages, redirects and rewriting for migration; products, sources, journeys, handoffs and test conversations for Brand Concierge; URLs per deployment for the pilot; and so on. The card shows the band and its quantity; Small and Large rewrite the deliverable text so it matches the hours (for example, content improvements at Large: "Refresh eight existing pages and create two new answer/knowledge pages").
- Each card has its own band picker, so a small build with a large migration can be scoped honestly.
- Typed hours are kept and flagged ("Your hours: 300 (the Large band assumes 480). Note why in Assumptions."). The SOW can't be issued until the reason is recorded in that service's assumptions.
- Each service in the SOW now has an "Estimate basis" line: its band, hours and quantity, or the partner's own hours and where the reason is.
- Old drafts with a free-text prompt count read the first number only: "200 prompts across 3 markets" is 200.

Tested: check.py: 200, 201, 150 and 1,500 prompts move only L01, L02 and O01, while the site build, migration and content lines stay at 960, 240 and 64 hours; four markets set Large; a card's band survives the switch; typed hours ask for a reason; the parser reads 200, not 2003.

Open: the quantities are partner planning assumptions written to make each estimate testable, not delivery actuals or Adobe guidance (UNRESOLVED 1 and 2).

## B3. The optimization pilot contradicted its own citation

Audit: "L03's starting basis is up to 10 URLs; its scope is at least 20 eligible URLs and an Impact Measurement Engine report after two weeks."

Adobe (Impact Measurement Engine, updated October 30, 2026): an impact analysis is generated only for eligible deployments that "Include at least 20 URLs from the High Potential URLs filter in a single deployment" and are for a supported opportunity (Recover Content Visibility, Add Table of Contents, Add LLM-friendly Summaries); "If these criteria aren't met, your pages will still be optimized but the corresponding Strategy with impact analysis may not be generated"; Recover Content Visibility "typically" completes "in about two weeks"; the analysis uses "a representative subset" of the URLs.

Changed (L03):
- One quantity: Typical is one deployment of 20 to 50 URLs chosen with the High Potential URLs filter. Small (fewer than 20 URLs) says no impact analysis is expected; Large is two deployments.
- Acceptance is deployment and verified rollback. The impact analysis "is reviewed when available; it is not an acceptance condition".
- The two weeks is described as Adobe's typical time for one opportunity type, not a delivery date.
- Product-page enrichment (C02): Adobe does not list Enrich Product Detail Pages as a supported opportunity, so its results are measured with the agreed analytics.
- The monthly review (O01) reads the engine's results "for eligible deployments" only.

## B4. Visibility and bot traffic are not person-level revenue attribution

Adobe (Brand Visibility integration, CJA, updated October 13, 2026): the dataset "does not contain any PII such as a user identifier, prompts, or responses"; for AI-referred people, "You do not need the Brand Visibility dataset for this human traffic." The dataset reference says "You cannot perform a person-level join from this dataset. The join operates at the URL and host level."

Changed:
- Canvas, Brand Visibility + CJA: "AI visibility tied to revenue" is now "AI-agent activity and observed referral outcomes": "See which pages AI agents read and which AI assistants refer visitors who convert, as separate measures. The data is aggregate: nothing ties a person to an AI mention." The connection text says what goes where: aggregate agent activity by URL and host into CJA; referral visits and conversions from CJA's own web data.
- The SOW lists, whenever CJA, measurement or testing services are selected: "AI-agent activity, monitored visibility, observed referral conversions and tested lift are reported as separate measures."
- C01 and C06 say referral visits come from a derived field on AI referring domains in the existing web data; C01 keeps its exclusion of person-level linkage.

## B5. Fastly does not automatically mean CDN readiness is complete

Adobe (Optimize at Edge, updated August 26, 2026): "For AEM Cloud Service managed Fastly customers, the routing setup is self-serve... For customers using other CDN providers, your IT/CDN team needs to complete the required setup." Adobe's guides cover Fastly (bring your own CDN, with VCL snippets), Akamai, Cloudflare, CloudFront, Azure Front Door and Apache; routing goes on the outer CDN.

Changed (C07):
- Renamed "CDN readiness and routing where required". The blanket "stores on Fastly don't need this" is gone.
- Scope: confirm the topology and the outer CDN, add the routing rules for that CDN with the hosting owner, allow Adobe's edge user agent through robots.txt and firewall or bot rules, keep AI-agent caching separate, test failover and rollback, verify one page.
- Small covers confirming and verifying a setup that is already in place, so work is excluded only once readiness is verified.
- On by default in the Commerce play (Adobe Commerce on cloud infrastructure runs its own Fastly service, which is not the self-serve AEM route). This adds $8,400 to the Commerce default at $150.

## B6. The canvas mixed native integrations with partner-managed workflows

Changed:
- Every one of the 59 connections is classified, from Adobe's pages, as a native integration, a shared-platform data path (through Experience Platform), a supported extension, or a partner-designed workflow, then checked by two independent skeptics. The card shows the type, Adobe's availability where it isn't general, and the prerequisites under "Before it works". Results: `sow/canvas/research/connection_types.json` (with the evidence quotes) and `audit_classification_2026-10-31.json`.
- Partner-designed workflows draw as dashed lines, and the hint says so.
- The card's "How the data flows" is now "How it connects", since some connections move no data.
- Brand Visibility + Brand Concierge: "Partner-managed question-to-approved-source workflow; no native connector assumed" (the audit's wording).
- Edge Delivery: edge fixes reach AI agents only and change no page people see; lasting fixes are published in AEM through the authoring workflow. Routing is self-serve only on AEM's managed Fastly CDN (A01, bv-eds, aemsites-bv).
- The picker and empty canvas no longer say products "connect themselves where Adobe documents a connection"; they say each connection says which kind it is.
- Wording that said more than the source was corrected across the canvas (see "Connection wording" below).

## B7. Concierge profile personalization needed explicit qualification

Adobe: the release notes (October 27, 2026) list the Real-Time CDP integration as "Limited Availability"; the FAQ says "In the current scope, Concierge is focused on anonymous visitors... not from a live lookup of identity or journey state in Real-Time CDP."

Changed:
- Real-Time CDP + Brand Concierge: "The baseline is anonymous visitors"; profile context in replies "needs written confirmation from Adobe for the tenant, use case and region"; availability on the card: Limited Availability. The gain is now "Conversation events for audiences; profile answers gated".
- The conversation-signal line (XA08) uses only the events Adobe documents (clicks, form submissions, booked meetings, live chats) under the client's own Experience Platform license. The profile-context line (XA09) stays optional.
- F02 (Implement Brand Concierge): "The baseline is the anonymous, public-information experience; profile-based answers are not assumed."

## B8. Supported activity types and entitlements

Adobe: "Auto-Target and Automated Personalization activities do not yet support Customer Journey Analytics as the reporting source" (Target reporting in CJA, October 27, 2026). "The Adobe Target destination is now available to organizations with Adobe Journey Optimizer, in addition to organizations with Real-Time CDP" (Adobe Target connection, October 21, 2026). Edge Delivery forms built in the Universal Editor need "AEM Forms as a Cloud Service: An active author instance with a Forms license" (October 9, 2026).

Changed:
- Target + CJA: "Every Target test" is now "Supported Target activities report in CJA... Auto-Target and Automated Personalization don't yet."
- CJA audiences for Target (TC04) unlock with Real-Time CDP or Journey Optimizer (a new "needs one of" rule on lines and flows), and cite the Target destination page instead of the use-case patterns page.
- Workfront + Edge Delivery forms: AEM Forms and Workfront Fusion are listed as prerequisites under "Before it works", so two product boxes are no longer the only test.

## H1. The expanded catalog lacked the original SOW's specificity

Changed:
- Lines that only the canvas has (from Adobe documentation research) arrive in the SOW steps as "Service concept, not quote-ready", with an empty deliverable and acceptance criteria, and assumptions that start with the prerequisites Adobe documents for their connection.
- "Before you issue this SOW" lists what is missing. Download, Print and CSV export wait until each concept has a deliverable, acceptance criteria and assumptions; Save draft works anytime. The statement of work marks each concept.
- On the canvas these lines carry a "Concept" tag.
- For the executive demo, the six fixed plays are the reviewed set; Create your own play is a design tool for concepts (UNRESOLVED 9).

## H2. New builds, existing estates and reusable work were mixed

Changed:
- FSI Scope asks "Brand Concierge today": not live yet (Implement Brand Concierge on), live and healthy (off), or live but needs fixes (on, and the SOW waits until its scope is edited to the remediation work). The Scope text follows the answer; C04 no longer assumes an existing deployment.
- Coworker: on the canvas, specialized Skills on a connection (CJA, AEM, FSI, DAM, audience, journey or Target Skills) replace the generic Skills package, which shows "Replaced by the specialized Skills" and can be kept for distinct Skills with one click. In the SOW steps, overlapping packages (generic and specialized Skills; the shared setup and its separate discovery, access and training packages) need a scope that says how they differ before the SOW is issued.

## H3. "Year one" and delay treatment

Changed:
- The total is "Implementation + 12-month term" (or the months entered), in the SOW steps and on the canvas; the SOW calls it an operating term.
- Section 8's placeholder lists what the partner completes under its agreement: billing model, invoicing schedule, review windows, dependency deadlines and what happens when they slip, pause and restart terms, change control and the governing agreement.
- "Delays extend the optimization timeline, not the fee" is gone; delays are "handled through the change-control and pause terms in section 8".

## H4. FSI operating model

Adobe: live chat and meeting booking "route through Adobe Marketo Qualifier (formerly Sales Qualifier)" and need representatives with a connected calendar or chat availability; "Live chat conversations are retained for 30 days" (October 27, 2026). The pre-go-live checklist includes scoring a "golden evaluation set" and a gradual rollout, "such as 5% of target pages" (October 6, 2026).

Changed:
- The FSI statement of work carries "Operating model the customer owns": a named operating owner; current source versions with owners and review dates; a golden-answer test set run before launch and after changes; refusal and escalation scenarios; failure handling; source-change triggers; handoff ownership and retention; a controlled rollout. Ownership and compliance decisions stay with the customer, as before.
- F02 builds the golden-answer set and the refusal and escalation scenarios with the customer's reviewers, completes Adobe's pre-go-live checks and launches in stages; acceptance includes those tests passing.
- F02 qualifies the handoff: the documented route is Marketo Qualifier; another chat or contact-center platform is confirmed with Adobe first; the customer confirms its record-keeping needs against the 30-day chat retention.

## D1. ABV text leaked into other SOWs

Changed:
- "Dependencies and risks" is built from the selected services: CDN log forwarding only with setup or CJA services, edge routing only with deployment, enrichment or CDN services, Coworker enablement only with Coworker services, and so on.
- Stage outcomes follow the play: Coworker's Launch is "workflows agreed, access and context checked, Skills tested and the pilot accepted"; a canvas-built play gets neutral outcomes; the AEM and FSI plays name the site build and Brand Concierge.
- Tested on the downloaded statement of work as well as the preview (check.py downloads it).

## Other corrections from the audit

- Capability references: links say "Capability reference", not "Source", in the SOW steps and on the canvas.
- Old URLs replaced with Adobe's current pages (both still redirected): Journey Optimizer with Marketo Engage, and the inherited Marketo instance audit.
- C03 cited a press release calling Brand Visibility "a native integration with AEM"; it now cites the Optimize at Edge page and says the publishing step is partner-designed.
- Off-site authority (O04) picks sources "from those AI answers cite for the agreed prompts"; action counts are "a capacity limit, not an outcome". YouTube work (O08) targets videos that appear in, or compete for, the tracked answers.
- Measurement design: the monthly review keeps a stable trend cohort apart from discovery prompts, records market, language, engine and configuration changes, and notes sampling limits (O01); the impact test uses matched untreated pages or a staged comparison where feasible and records concurrent changes (O06).
- Coworker: the play covers Coworker Chat in licensed, eligible applications; Coworker for teams is out of scope (CW02). CJA and AEM Skills cover only what Adobe's shipped skills don't (CW-CJA, CW-AEM); the FSI review Skills need their own evaluation (CW-FSI); adoption is reviewed after three months and the band reset to actual volume (CW06).
- The AEM play's objective no longer promises to "get it into AI answers"; it says Brand Visibility tracks and improves how the site appears in them.

## Connection wording

`CONNECTIONS.md` lists all 59 connections with their type, Adobe's availability, the number of prerequisites on the card and what changed in their wording (58 of 59 corrected; Journey Optimizer + CJA needed none). The pattern of the corrections:

- Conditions moved onto the card: Live Search for Brand Concierge's Commerce catalog; Platform-as-a-Service Commerce and Real-Time CDP Prime or Ultimate for Audience Activation; Dynamic Media with OpenAPI for live renditions; the Image v3 and Teaser v2 components for remote assets; AEM agent access for Coworker in AEM; Write MCP tools for Coworker in Workfront; ECID-matched people only for Marketo lists in Target.
- Statuses named: Limited Availability (Real-Time CDP context in Brand Concierge), Early Access (Sites Optimizer pull requests and Dispatcher redirects, the Workfront plugin for the Universal Editor), Legacy (Journey Optimizer offer decisions in Target), roadmap (Journey Optimizer follow-up from Brand Concierge), co-innovation (the Edge Delivery martech plugin), maintenance mode (CIF Core Components), coming soon (Coworker's in-product panels and B2B editions).
- Automatic-sounding claims made precise: Sites Optimizer deploys to author and people publish; Workfront Fusion links are scenarios the partner builds; Coworker acts after approval only where Plan mode or the client's gates require it; Marketo gets an engagement activity, not each conversation; Content Fragments reach journeys in about five minutes only for unitary journeys.
- Measured costs stated: the Edge Delivery martech plugin adds up to 1.2 seconds of mobile Largest Contentful Paint when Target or Journey Optimizer changes the page (Adobe's tests).
- Causal claims removed: "lead to purchases" and "move people toward conversion" became "come before conversions" and "purchase paths".
- Research lines renamed or rescoped where their names said more than Adobe documents (25 lines; for example "Conversation impact reporting in CJA" is now "Conversation-to-purchase analysis in the client's CJA (separate license)", and the audience activation line for Commerce is optional until the client is on Commerce on Cloud or on-premises).
- Every Coworker connection carries Adobe's note that Coworker is not currently offered to health care, finance or some other industries.

## Flagged, not changed

- Plays deck, slide 1 (`video/mockups/deck_slide1_financial.html`, and the built deck): "A monthly readout that ties AI to revenue" makes the claim B4 corrects on the canvas. Not changed; it's your deck.
- The video and the deck say Play 3 is "found in search and AI"; the canvas card now says "Built for search, readable by AI agents".
- The AEM play total includes the whole site build; the audit suggests showing the ABV-attributable scope apart from the web program (UNRESOLVED 7).
