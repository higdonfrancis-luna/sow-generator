# Audit fixes: change log, issue by issue

October 31, 2026. Response to the "ABV Partner Plays: Adversarial Readiness Audit" of the same day (`ABV_Partner_Plays_Adversarial_Audit_2026-10-31.html`, in this folder). The open assumptions that rewriting can't settle are in `UNRESOLVED.md`; every canvas connection is listed in `CONNECTIONS.md`.

## What's in the revised package

- `abvsow-site-audit-fixes.zip`: the whole site (the Build canvas front page, and the Scope, Services and Statement of work steps at `/sow/`), in the same layout as the audited zip. Nothing has been deployed; abvsow.netlify.app still runs SOW step 12.
- Source on GitHub, branch `abv-partner-plays`: `sow/index.html` (the SOW steps, built by `sow/patch_step14.py` from `sow/estimating_bands.json` and `sow/step14_text.json`), `sow/canvas/` (the canvas), `sow/site/` (the built site).
- Every Adobe fact used below was rechecked on Experience League on October 31, 2026; the pages and quotes are in `sow/canvas/research/audit_classification_2026-10-31.json`.

How to check it yourself (from the repo root):

```
python3 sow/check.py sow/index.html      # 138 checks on the SOW steps
node sow/canvas/test_canvas.js           # 140 checks on the canvas, all seven plays
node sow/test_site.js                    # 38 checks: the one site, end to end, including a stale-build check
```

## How the fixes were checked

1. A fact checker confirmed 13 Adobe facts the fixes depend on, each with a quote from Experience League.
2. Four classifiers typed all 59 canvas connections from Adobe's pages. Skeptics then re-checked every classification (the first two missed 14 connections because their input was cut short, so two more checked those); they corrected 20.
3. After the fixes were built, four independent testers each took a group of the audit's findings and tried to break the fixes on the built site, including the downloaded SOW file, old saved drafts and phone widths. A completeness critic compared the whole audit with this change log. Their findings were fixed in three more rounds and are folded into the sections below; the last round answered the critic's 18 gaps, listed at the end of this log.

## Summary

| # | Audit finding | Status | What changed, in one line |
|---|---|---|---|
| B1 | Fees presented as what a partner makes | Fixed | "Illustrative services fees", planning hours times the partner's approved rate; no cost, margin or profit implied; no rate range and no default rate |
| B2 | One more prompt doubles unrelated hours; "200 prompts across 3 markets" read as 2003 | Fixed | A number field sets only the three prompt services; every service names the quantity behind its hours; departures from a band need a written reason |
| B3 | The optimization pilot contradicts its citation | Fixed | One quantity (20 to 50 High Potential URLs); deployment and rollback are the acceptance; Adobe's impact analysis is reviewed when Adobe generates it |
| B4 | Bot traffic is not person-level revenue attribution | Fixed | The CJA connection shows four separate measures; nothing ties a person to an AI mention |
| B5 | Fastly does not mean CDN readiness is done | Fixed | "CDN readiness and routing where required", in the Commerce play's default scope, with one routing owner |
| B6 | Native integrations mixed with partner workflows | Fixed | Every connection is typed, with Adobe's availability and the prerequisites; each type draws its own line, with a legend |
| B7 | Concierge profile personalization needs qualification | Fixed | The anonymous experience is the baseline; the profile line can't be issued without Adobe's written confirmation |
| B8 | Activity types and entitlements not enforced | Fixed | Supported Target activities only; Real-Time CDP or Journey Optimizer unlocks CJA audiences in Target; AEM Forms and Fusion shown as also needed |
| H1 | Expanded catalog lacks SOW specificity | Fixed | Research lines are service concepts that can't be exported until their scope states the quantity as a number, their deliverable and a testable acceptance criterion are written, and the customer's confirmations are added; placeholder text doesn't count |
| H2 | New builds, existing estates and reused work mixed | Fixed for FSI and Coworker; open for other estates | FSI asks whether Brand Concierge is new, live and healthy, or needs fixes, flags contradictions and carries the answer to the canvas; overlapping Coworker Skills need a distinct scope; other plays' estates are UNRESOLVED 7 |
| H3 | "Year one" and delay treatment | Fixed | "Implementation + 12-month term" (or the term entered, on the canvas too); the commercial terms must be written, not TBD, before the SOW is issued |
| H4 | FSI operating model incomplete | Fixed | The FSI SOW carries the operating model the customer owns, names the documented handoff route and its 30-day chat retention, and requires a named operating owner, reviewers and the handoff |
| D1 | ABV text leaks into other SOWs | Fixed | Dependencies, outcomes, titles and FSI or Brand Visibility wording follow the selected services; tested on the downloaded file |

No service's hours were lowered or raised to answer the audit; the one exception is a research concept whose scope was narrowed to what its reference supports (the monthly Marketo line), and its placeholder hours follow. At $150 an hour and Typical, the default totals are unchanged for five plays; Commerce rises from $219,600 to $228,000 because CDN readiness and routing is now in its default scope (B5).

## B1. Fees were presented as what a partner makes

Audit: "The live heading 'What a partner makes on this play' sits above hours multiplied by rates... The $100 to $300 partner-rate statement has no provenance."

Changed:
- SOW steps: the heading is "Illustrative services fees", with "Planning hours × your rate of $150 an hour. These are fees, not profit: no cost, margin or overrun is modeled." Before a rate: "Enter your approved rate to see illustrative fees". The rate hint is "Use your approved rate card." The $100 to $300 range is gone from the code.
- The statement of work's fee section is "5. Illustrative services fees": "Illustrative services fees: planning hours × the partner's hourly rates. The hours are planning assumptions tied to the quantities in section 3 and are confirmed by the partner's delivery lead before approval. No cost, margin or overrun is modeled." The fee column is "Illustrative fee", the total "Illustrative services total", and the fine print "This is an illustration of services fees, not a quote." No "Estimated" label is left in the tool, the SOW or the CSV.
- The CSV's columns are "Planning hours", "Illustrative fee per period" and "Illustrative term fee", with a fee-basis column saying what the fees are and a total row labeled with the term.
- Each service card says next to its hours: "Hours: a partner planning assumption, not from Adobe." (a placeholder band on a concept; the partner's own once a concept is written), so the Adobe capability reference beside it no longer reads as backing the hours.
- Canvas: no default rate, and a rate saved by the old version (its $150 default) is not reused. The rate takes cents (187.50 is no longer read as 1,875). The total reads "Illustrative fees: implementation + 12-month term" (or the term entered in the SOW steps), with "Hours are planning assumptions, not a quote." under it. Card footers show one-time and monthly fees apart instead of one blended figure.
- The rate, delivery size and monthly term set in the SOW steps carry back to the canvas, so a trip to Build no longer overwrites them and the canvas and the SOW show the same total.

Flag for Adam: removing the range reverses your October 29 call ("100 to 300 is perfect"). It can come back with a named source.

## B2. One additional prompt could double unrelated implementation hours

Audit: "200 prompts selects Small; 201 selects Typical. That switches EDS implementation from 480 to 960 hours... The free-text parser also reads '200 prompts across 3 markets' as 2003."

Changed:
- "Prompts to monitor" and "Markets or languages monitored" are number fields, read as numbers (1e3 is 1,000; old free-text counts read their first number, so "200 prompts across 3 markets" is 200).
- The prompt count sets only the services whose work scales with prompts: prompt strategy (L01), setup and baseline (L02) and the monthly review (O01). Fewer than 200 prompts is Small, 200 to 1,000 Typical, 1,001 to 3,000 Large (printed under the field); two or three markets raise the band to at least Typical, four to six to Large. Above 3,000 prompts or six markets the partner sets those services' hours and gives the reason. 200 is now Typical, which is what those services' own scope text always said.
- The global switch is "Delivery size". It sets every other service's band and is never set by the prompt count. Each card has its own band picker.
- Every one of the 40 services names the concrete quantity its Small, Typical and Large hours assume (`sow/estimating_bands.json`), in the units the audit named: templates, blocks, integrations and pages for the site build; pages, redirects and rewriting for migration; products, sources, journeys, handoffs and test conversations for Brand Concierge; URLs per deployment for the pilot. Small and Large rewrite the scope, deliverable and acceptance text where counts change (for example, content improvements at Large: "Refresh eight existing pages and create two new answer/knowledge pages"; Coworker Skills at Small: "one reusable Skill").
- Hours typed by the partner, or a prompt service's band that departs from the prompt count, show a "Reason for the change" field on the card; the SOW can't be issued until it holds a real reason (15 characters or more), and the SOW prints it in that service's "Estimate basis". Typed hours equal to a band's hours simply take that band.
- Every service in the SOW has an "Estimate basis" line: its band, hours and quantity, or the partner's own hours and reason.
- Old drafts, from the browser or opened from a file, are re-banded on opening, and drafts whose size the old version took from the prompt text go back to Typical, with a message saying so.

Tested: check.py: 200, 201, 150 and 1,500 prompts move only L01, L02 and O01 while the site build, migration and content lines stay at 960, 240 and 64 hours; four markets set Large; 5,000 prompts asks for the partner's hours; a card band survives the switch; an old draft from the audited version opens re-banded at Typical.

## B3. The optimization pilot contradicted its own citation

Adobe (Impact Measurement Engine, updated October 30, 2026): an impact analysis is generated only for eligible deployments that "Include at least 20 URLs from the High Potential URLs filter in a single deployment" and are for a supported opportunity (Recover Content Visibility, Add Table of Contents, Add LLM-friendly Summaries); "If these criteria aren't met, your pages will still be optimized but the corresponding Strategy with impact analysis may not be generated"; Recover Content Visibility "typically" completes "in about two weeks"; only pages with enough data are measured.

Changed (L03):
- One quantity: Typical is one deployment of 20 to 50 URLs chosen with the High Potential URLs filter. Small (fewer than 20 URLs) says no impact analysis is expected, in its scope and its deliverable; Large is two deployments.
- Acceptance is deployment and verified rollback; the impact analysis "is reviewed when available; it is not an acceptance condition, because Adobe generates it only for eligible deployments and measures only pages with enough data".
- Assumptions name the trial limits (Adobe's pages give 10 pages, or 50 URLs for trials from April 1, 2026) and Adobe's note that edge auto-optimization is Early Access for select opportunities.
- Product-page enrichment (C02) is not among the engine's supported opportunities, so its results are measured with the agreed analytics. The monthly review (O01) reads the engine's results only when a deployment pilot is in scope.

## B4. Visibility and bot traffic are not person-level revenue attribution

Adobe (Brand Visibility integration, CJA, updated October 13, 2026): the dataset "does not contain any PII such as a user identifier, prompts, or responses"; "You do not need the Brand Visibility dataset for this human traffic." The dataset reference: "You cannot perform a person-level join from this dataset."

Changed:
- Canvas, Brand Visibility + CJA: "AI visibility tied to revenue" is now "AI-agent activity and observed referral outcomes": "Four separate measures. AI-agent activity (from CDN logs) and monitored visibility (tracked prompts) are what Brand Visibility adds; AI-referred visits and conversions come from the client's CJA web data, which ordinary referrer reporting can show without it; lift comes only from a test. The data is aggregate: nothing ties a person to an AI mention." The connection is typed as a shared-platform data path (agent traffic reaches CJA as an Experience Platform dataset).
- C01 delivers "an initial report of AI-agent activity and AI-referred visits and conversions, kept as separate measures", and says Adobe Analytics can feed Brand Visibility's referral reporting while the AI-agent dataset reaches CJA only. C06 builds its audiences from AI-referred visitors in the existing web data.
- The SOW's dependencies keep the four measures separate whenever Brand Visibility and measurement services are selected; lift is claimed only from a tested comparison. The monthly review's acceptance says the same.
- The research line "Rank AI sources by the value they send" is now "...by the visits and conversions they send".

## B5. Fastly does not automatically mean CDN readiness is complete

Adobe (Optimize at Edge, updated August 26, 2026): "For AEM Cloud Service managed Fastly customers, the routing setup is self-serve... For customers using other CDN providers, your IT/CDN team needs to complete the required setup." Adobe's guides cover Fastly (bring your own CDN, with VCL snippets), Akamai, Cloudflare, CloudFront, Azure Front Door and Apache; routing goes on the outer CDN.

Changed (C07):
- Renamed "CDN readiness and routing where required"; the blanket "stores on Fastly don't need this" is gone.
- One routing owner, stated the same way in the scope, the assumptions and the SOW's dependencies: the partner prepares and tests the rules, the customer's CDN team (or the partner, with delegated access) applies them in the agreed change window, and the hosting owner approves.
- Small confirms and verifies a setup already in place and adds rules only where a check fails; its scope and deliverable say so.
- In the Commerce play's default scope. Its assumptions say Adobe documents self-serve routing only for AEM's managed Fastly CDN and no edge route for Adobe Commerce on cloud infrastructure, so the plan puts the routing rules on the outer CDN (for a store served straight from Commerce's Fastly service, that service) and the partner confirms the route and effort with Adobe (abv-at-edge@adobe.com) before the change window. Commerce drafts saved before this change get it back when the pilot or enrichment is on.

## B6. The canvas mixed native integrations with partner-managed workflows

Changed:
- All 59 connections are typed from Adobe's pages: 31 native integrations, 16 shared-platform data paths (through Experience Platform or another shared Adobe service such as Audience Manager), 8 supported extensions and 4 partner-designed workflows. The evidence quotes are in `sow/canvas/research/connection_types.json`.
- Each type draws its own line (solid native, dotted shared-platform, dash-dot extension, dashed partner workflow), and the hint gives the legend for the lines on the canvas. On phones and narrow windows, where the hint is hidden, the legend shows under the total.
- Each card shows the type, a one-line label, Adobe's availability (always, in red when it is a status to watch such as Limited Availability, Early Access, Legacy or not documented), the corrected "how it connects" text, and the prerequisites under "Before it works" (the first two shown, the rest one click away). "How the data flows" is now "How it connects".
- Brand Visibility + Brand Concierge: "Partner-managed question-to-approved-source workflow; no native connector assumed" (the audit's wording).
- Edge Delivery: edge fixes reach only the AI assistants Adobe supports (ChatGPT, Perplexity and Claude) and change no page people or search engines see; lasting fixes are made where the site is authored. Routing is self-serve only on AEM's managed Fastly CDN (A01, bv-eds, aemsites-bv). The AEM and Commerce play cards name those assistants and say search engines, Google included, see the page as published ("Built for search, readable by AI assistants"; "Product pages AI assistants can read").
- The picker says "each connection says whether Adobe documents it or a partner designs it", instead of products being "already connected".
- Lines from research that arrive in the SOW steps start their assumptions with the connection's type and availability, then its prerequisites.

## B7. Concierge profile personalization needed explicit qualification

Adobe: the release notes (October 27, 2026) list the Real-Time CDP integration as "Limited Availability"; the FAQ says "In the current scope, Concierge is focused on anonymous visitors."

Changed:
- Real-Time CDP + Brand Concierge shows "Availability: Limited Availability for Real-Time CDP context in replies; the FAQ says the current scope is anonymous visitors." Its gain is "Conversation events for audiences; profile answers gated".
- The profile-context line (XA09) is optional; its scope starts "Once Adobe confirms in writing that the Limited Availability Real-Time CDP integration is enabled for this tenant, use case and region", and the SOW can't be issued with it until its assumptions record that confirmation (a date or reference).
- F02: "The baseline is the anonymous, public-information experience; profile-based answers are not assumed." When the profile line is scoped, F02 says profile answers are only as scoped there, after Adobe's written confirmation.
- The conversation-signal line (XA08) uses only the events Adobe documents (clicks, form submissions, booked meetings, live chats) under the client's own Experience Platform license.

## B8. Supported activity types and entitlements

Adobe: "Auto-Target and Automated Personalization activities do not yet support Customer Journey Analytics as the reporting source" (October 27, 2026). "The Adobe Target destination is now available to organizations with Adobe Journey Optimizer, in addition to organizations with Real-Time CDP" (October 21, 2026). Edge Delivery forms built in the Universal Editor need "AEM Forms as a Cloud Service: An active author instance with a Forms license" (October 9, 2026).

Changed:
- Target + CJA: "Supported Target activities report in CJA... Auto-Target and Automated Personalization don't yet." The Target reporting setup (TC01) confirms before each launch that the activity type is supported and its reporting source is CJA with the agreed data view.
- CJA audiences for Target (TC04) unlock with Real-Time CDP or Journey Optimizer (a "needs one of" rule), and the locked line offers both. Commerce storefront events (XA20) unlock with Real-Time CDP, Journey Optimizer or CJA.
- Edge Delivery forms lines say "Also needs AEM Forms as a Cloud Service" (and "and Workfront Fusion" for the Workfront line) on the canvas, locked or not, and carry it into the SOW. They start off; they count in the total only once the partner adds them (UNRESOLVED 19).

## H1. The expanded catalog lacked the original SOW's specificity

Changed:
- Lines that only the canvas has arrive in the SOW steps as "Service concept, not quote-ready", with an empty deliverable and acceptance and assumptions that start with the connection's type, availability and prerequisites.
- A concept clears only when its scope is rewritten with the quantity as a number (new text that includes a number), its deliverable is written, its acceptance criterion has a number to test (a count, date or threshold), and its assumptions add what the customer confirmed to the prefilled prerequisites. Placeholder text (TBD, TBC, n/a, "to be confirmed later") doesn't count anywhere a rewrite is required. Until then "Before you issue this SOW" lists it with what is still missing, and Download, Print and CSV export wait; the browser's own print shows only that list. Once written, a concept reads as a partner-written service with the partner's hours, and "the quantity is in the scope" is then true by construction.
- What a partner writes on a concept survives a trip back to Build. Drafts from the audited version re-mark research lines as concepts.
- The canvas total says how much of it is service concepts with placeholder hours, and the Create your own play card says services from research arrive as concepts to write up.
- For the executive demo, the six fixed plays are the reviewed set (UNRESOLVED 14).

## H2. New builds, existing estates and reusable work were mixed

Changed:
- FSI Scope asks "Brand Concierge today": not live yet (Implement Brand Concierge on), live and healthy (off), or live but needs fixes (on, and its scope must be rewritten to the remediation work). The SOW flags a live-and-healthy answer with the build on, and a not-live answer with it off, whichever way the lines changed. The answer reaches the canvas: with Brand Concierge live and healthy, Implement Brand Concierge is off there too, so the canvas total matches and a trip through Build no longer turns its 640 hours back on. C04 no longer assumes an existing deployment.
- The other plays don't ask about the customer's existing CJA, catalog, AEM estate or Coworker applications; they assume a healthy one (UNRESOLVED 7).
- Coworker: on the canvas, specialized Skills on a connection (CJA, AEM, FSI, DAM, audience, journey or Target Skills) replace the generic Skills package, which shows "Replaced by the specialized Skills" and can be kept for distinct Skills; the choice resets with the play. In the SOW steps, keeping both needs the generic package's scope rewritten to say how it differs.
- Partner-written Coworker Skills on top of Adobe's shipped skills are named as such (audience, journey, Target and DAM Skills).

## H3. "Year one" and delay treatment

Changed:
- The total is "Implementation + 12-month term" (or the months entered); the SOW calls it an operating term.
- Section 8's placeholder lists what the partner completes under its agreement (billing model, invoicing schedule, review windows, dependency deadlines and what happens when they slip, pause and restart terms, change control, the governing agreement), and the SOW can't be issued until the commercial terms are written (40 characters or more of real text; "TBD" doesn't count).
- "Delays extend the optimization timeline, not the fee" is gone; delays are "handled through the change-control and pause terms in section 8".

## H4. FSI operating model

Adobe: live chat and meeting booking "route through Adobe Marketo Qualifier (formerly Sales Qualifier)"; "Live chat conversations are retained for 30 days" (October 27, 2026). The pre-go-live checklist scores a "golden evaluation set" and plans a gradual rollout, "such as 5% of target pages" (October 6, 2026).

Changed:
- The FSI statement of work carries "Operating model the customer owns": a named operating owner; current source versions with owners and review dates; a golden-answer test set run before launch and after changes; refusal and escalation scenarios; failure handling; source-change triggers; handoff ownership, naming Marketo Qualifier as the documented route (another platform is confirmed with Adobe first) and its 30-day chat retention; a controlled rollout.
- The FSI Scope step asks for the Brand Concierge operating owner. The FSI SOW always prints the products, the owner, the approved sources and reviewers, and the handoff, and can't be issued until the owner, the reviewers and the handoff are named (placeholders don't count); the named owner leads the operating model. The handoff placeholder suggests the documented route.
- The canvas card for Brand Visibility + Brand Concierge no longer says "Approved answers to AI-era questions": it is "Approved sources and tested answers for AI-era questions", with answers tested against the approved sources.
- F02's assumptions quote Adobe's own effort statements (basic setup about 3 to 5 days, advanced about 2 to 4 weeks, go-live about 6 to 9 weeks, Adobe consultants handling prompt engineering) and say its hours cover the partner's work around that setup, not yet reconciled with Adobe's figures (UNRESOLVED 6).
- F02 builds the golden-answer set and the refusal and escalation scenarios with the customer's reviewers, completes Adobe's pre-go-live checks and launches in stages; acceptance includes those tests passing. Compliance decisions stay with the customer.

## D1. ABV text leaked into other SOWs

Changed:
- Dependencies come from the selected services: CDN log forwarding only with setup or CJA services (naming CJA only when it is selected), edge routing only with deployment, enrichment or CDN services, Coworker enablement only with Coworker services.
- Wording that belongs to a context reads neutrally outside it: financial-services sentences appear only in the FSI play, and Brand Visibility sentences only when Brand Visibility is in the engagement (for example the site build, launch and Sites Optimizer lines in a canvas-built play without Brand Visibility).
- The SOW title names the products ("Services for Edge Delivery Services, Sites Optimizer, Brand Concierge and Customer Journey Analytics") instead of tool names, and the custom objective no longer mentions the Build canvas. The default exclusions no longer exclude the "platform rebuilds" the AEM play sells, and the pages row prints only with content services.
- Stage outcomes: Launch is built from the selected services; Optimize reads "fixes deployed each month; visibility and referral movement reported against named peers".
- Customer-facing text no longer carries service IDs or "do not charge twice" notes.
- Tested on the downloaded statement of work as well as the preview.

## Other corrections from the audit

- Off-site: authority work (O04) picks sources "from those AI answers cite for the agreed prompts", proposes Wikipedia changes on the talk page with the paid-contribution disclosure Wikipedia requires and excludes undisclosed paid editing; community work (O07) starts from the threads AI answers cite; YouTube work (O08) aligns videos that appear in the AI answers and says what happens to the hours in a month with none; every count is "a capacity limit, not an outcome".
- Measurement: the monthly review keeps a stable trend cohort apart from discovery prompts and notes sampling limits (O01); the impact test uses matched untreated pages or a staged comparison, its Small band is a staged comparison rather than a before-and-after, and it cites Adobe's Impact Measurement Engine as Adobe's own method (O06).
- Coworker: the play covers Coworker Chat in licensed, eligible applications; Coworker for teams is out of scope; Adobe's note that Coworker is not currently offered to health care, finance or some other industries is on the Coworker play's first service, the shared Coworker setup, the FSI review Skills and every Coworker connection.
- Capability references: links say "Capability reference", not "Source", in the SOW steps and everywhere on the canvas (service rows, locked rows, connection flows); two old URLs were replaced with Adobe's current pages; C03 no longer cites a press release.
- What the product does and what the hours cover: the monthly review (O01) says Brand Visibility runs the prompts, reports visibility and citations and lists opportunities on its own, and the hours cover the judgment around it; content improvements (O02) say edge optimizations reach only the AI assistants Adobe supports and leave the page unchanged, so the hours cover lasting page changes; the Sites Optimizer services (SO1, SO2) say deploying fixes needs the Ultimate package, and with Prime (identify and suggest only) the approved fixes are applied by hand (UNRESOLVED 5).
- The monthly Marketo line was "Monthly campaign operations and instance care", but its reference (Adobe's inherited-instance audit tutorial) covers only the review. It is now "Monthly Marketo instance review", with placeholder hours that follow the narrower scope (8, 16 or 24 a month).
- Small print in the statement of work is larger: concept notes 13 px; the fine print, table text and headers, fee captions, context notes and footer 12 px (9 pt or more when printed).
- The AEM play's objective no longer promises to "get it into AI answers"; Brand Visibility tracks and improves how the site appears in them.
- The Brand Visibility security overview PDF, which the audit couldn't retrieve, downloads and supports the AEM telemetry flow.

## Connection wording

`CONNECTIONS.md` lists all 59 connections with their type, Adobe's availability, the number of prerequisites and what changed in their wording (58 of 59 corrected; Journey Optimizer + CJA needed none). The pattern of the corrections:

- Conditions moved onto the card: Live Search for Brand Concierge's Commerce catalog; Commerce on Cloud or on-premises and Real-Time CDP Prime or Ultimate for Audience Activation; Dynamic Media with OpenAPI for live renditions; the Image v3 and Teaser v2 components for remote assets; AEM agent access for Coworker in AEM; Write MCP tools for Coworker in Workfront; ECID-matched people only for Marketo lists in Target.
- Statuses named: Limited Availability (Real-Time CDP context in Brand Concierge), Early Access (Sites Optimizer pull requests and Dispatcher redirects, the Workfront plugin for the Universal Editor), Legacy (Journey Optimizer offer decisions in Target), not documented (Journey Optimizer follow-up from Brand Concierge, concierge data in the client's own CJA), co-innovation (the Edge Delivery martech plugin), maintenance mode (CIF Core Components), coming soon (Coworker's in-product panels and B2B editions).
- Automatic-sounding claims made precise: Sites Optimizer deploys to authoring and people publish; Workfront Fusion links are scenarios the partner builds; Coworker acts after approval only where Plan mode or the client's gates require it; Marketo gets an engagement activity, not each conversation; Content Fragments reach journeys in about five minutes only for unitary journeys.
- Measured costs stated: the Edge Delivery martech plugin adds up to 1.2 seconds of mobile Largest Contentful Paint when Target or Journey Optimizer changes the page (Adobe's tests).
- Causal claims removed: "lead to purchases" and "move people toward conversion" became "come before conversions" and "purchase paths".
- 31 research lines renamed, rescoped, re-houred or given needs (for example "Conversation impact reporting in CJA" is now "Conversation-to-purchase analysis in the client's CJA (separate license)", audience activation for Commerce is optional until the client is on Commerce on Cloud or on-premises, and the monthly Marketo line is the instance review its reference supports).

## Flagged, not changed

- Plays deck, slide 1 (`video/mockups/deck_slide1_financial.html` and the built deck): "Prove AI pays" and "A monthly readout that ties AI to revenue" make the claim B4 corrects. A wording that would match: "A monthly readout of AI-agent activity and AI-referred visits and conversions, kept as separate measures." Not changed; it's your deck.
- The video and the deck say Play 3 is "found in search and AI"; the canvas card now says "Built for search, readable by AI assistants" and names the assistants Adobe's edge fixes reach.
- The AEM play total includes the whole site build; the audit suggests showing the ABV-attributable scope apart from the web program (UNRESOLVED 13).
- A positioning line ("for joint validation") on the site and in the SOW is your call (UNRESOLVED 16).
- Services turned on or off on the Services step return to the canvas's choices after the next trip through Build; only the rate, size, term and the FSI answer flow back (UNRESOLVED 19).

## Final round: the completeness critic's 18 gaps

After the re-test, a completeness critic compared every audit finding with the built site and this log. What each gap led to:

| Gap | Critic's finding | What changed, or where it is recorded |
|---|---|---|
| 1 | No "prototype for joint validation" positioning on the site | Your call (UNRESOLVED 16) |
| 2 | The SOW and CSV still said "Estimated" | Illustrative throughout (B1) |
| 3 | Only the prompt dimensions are inputs; a one-prompt cliff remains | The field prints where the bands change; the rest recorded (UNRESOLVED 2) |
| 4 | Placeholder text cleared concepts and "TBD" cleared the terms; the SOW could say "the quantity is in the scope" falsely | A number in the rewritten scope and the acceptance, the customer's confirmations added, placeholders rejected (H1, H3) |
| 5 | The FSI answer didn't reach the canvas; no estate question elsewhere | The answer reaches the canvas (H2); other estates recorded (UNRESOLVED 7) |
| 6 | "Approved answers" overclaimed; no operating owner captured | Retitled; the owner is asked and required (H4) |
| 7 | Canvas flow links still said "Source" | "Capability reference" everywhere (Other corrections) |
| 8 | The CTO's question on partner value versus product automation | O01, O02, SO1 and SO2 say what the product does and what the hours cover; recorded (UNRESOLVED 5) |
| 9 | Adobe's Brand Concierge effort statements beside F02's 640 hours | Quoted in F02's assumptions; recorded (UNRESOLVED 6) |
| 10 | The customer's break-even was not recorded | UNRESOLVED 8 |
| 11 | Per-play proof points missing | UNRESOLVED 9; the CJA card says which measures need Brand Visibility (B4) |
| 12 | Four Adobe questions missing; C07 presented an inference as documentation | Added to UNRESOLVED 11; C07 says Adobe documents no Commerce route (B5) |
| 13 | The canvas ignored the term entered in the SOW steps; no tiers or stop criteria | The canvas uses the term (B1); tiers and expand and stop criteria recorded (UNRESOLVED 4) |
| 14 | The monthly Marketo line's reference covered only half of it | Narrowed to the instance review (Other corrections) |
| 15 | "AI agents" read as all AI search; Sites Optimizer fixes promised without the Ultimate condition | The assistants are named (B6); the Ultimate condition is on SO1 and SO2 |
| 16 | The estimate caveat was hidden in the collapsed editor | A line next to the hours on every card (B1) |
| 17 | Lines that need products outside the canvas are priced on two boxes | "Also needs" on locked rows too; they start off; the rest recorded (UNRESOLVED 19) |
| 18 | Small print in the SOW; no legend on phones | Larger SOW small print (Other corrections); the legend shows under the total on phones (B6) |
