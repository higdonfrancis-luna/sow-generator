# Gemini 4 Argon review (as pasted by Adam, Nov 9 2026)

Verdict: C+ (Strong B+ for architecture and catalog discipline; D+ for real-world RFP survival)

Note on evaluation method: I inspected and executed your exact JavaScript logic (findQuestions, classify, readSheet, match, compose, rfp, toSow, and Save draft) against realistic procurement inputs.

The core thesis—turning a static, zero-egress, Experience League–sourced SOW catalog into a client-voiced RFP drafter—is genuinely smart. When a question happens to be phrased as an imperative verb or question mark and names two Adobe products, the output is remarkably grounded, free of marketing fluff, and honest about prerequisites.

However, real RFPs do not look like a list of polite questions. Enterprise RFPs are spreadsheets of declarative "The solution must..." statements, compliance matrices, and multi-column tables. Against those, your parser silently drops 50% to 80% of the requirements, your Excel reader shreds multi-column rows into unlinked fragments, your regex voice-converter leaks internal partner cautions ("confirm with Adobe") directly into client-facing text, and your "zero-storage" promise has a fatal data-loss trap when a partner clicks "Add to my statement of work" or "Save draft".

## A. Adversarial Grade: Breaking the Parser, Matcher, Voice, and State

1. Declarative requirements ("The solution shall / Vendor must") are silently dropped
  - Severity: Critical (Blocker)
  - Exact input that triggers it:
    REQ-101: The proposed CDP must ingest batch data from Snowflake and streaming events from Web SDK.
    3.2.4 Vendor shall configure role-based access control and development and production sandboxes in Adobe Experience Platform.
    4.1 Ability to export Experience Fragments from AEM Sites to Adobe Target as HTML or JSON offers.
  - What happens: findQuestions() returns 0 questions found. Because none of these contain a ? and none begin a sentence with your ASKS regex (describe|explain|provide|list|...), const asks = /\?/.test(body) || ... evaluates to false and every single requirement is discarded without warning.
  - What I expected: At least 60% of enterprise RFP rows are declarative statements ("The system must...", "Vendor will...", "Support for...", or numbered rows in a functional matrix). Any numbered/coded line (REQ-101, 3.2.4) or line containing modal requirement verbs (must|shall|should|will|ability to|support for|capable of) should be captured.

2. Multi-column Excel compliance matrices are shredded by readSheet()
  - Severity: Critical (Blocker)
  - Exact input that triggers it: An .xlsx file with standard procurement columns:
    | Req ID | Category | Requirement Description | Mandatory / Desirable | Vendor Compliance (Y/N/P) | Vendor Response |
    | `REQ-04` | `Analytics` | `Describe how Customer Journey Analytics joins paid media data with web conversions.` | `Mandatory` | | |
  - What happens: In readSheet(), your loop only merges a cell with the next cell if it matches /^\(?[A-Za-z]?\d{0,3}(\.\d+)*[.)]?$/ (which REQ-04 fails because of the hyphen and 3 letters). Every other cell is pushed as a separate line. paragraphs() then flushes on every newline or capital letter. Result: REQ-04, Analytics, and Mandatory are dropped, the requirement loses its ID (REQ-04) and its Mandatory tag, and if the "Category" cell happens to say "Explain how you handle security" while the "Requirement" cell says "System must support SSO", it captures the category header and drops the requirement!
  - What I expected: Sheet ingestion should detect column headers (ID, Section/Category, Requirement/Question, Priority/M/D, Compliance, Response) and keep each row intact as a structured object {label: 'REQ-04', category: 'Analytics', priority: 'Mandatory', text: '...'}.

3. Sub-questions (a, b, c) are orphaned from their parent context and fail product matching
  - Severity: High
  - Exact input that triggers it:
    12. We are implementing Adobe Journey Optimizer and Real-Time CDP.
    a) Describe how you will configure sandboxes, roles, and sending subdomains.
    b) How will you execute the IP warmup plan?
    c) Explain how audiences and profile attributes flow into journeys.
  - What happens:
    1. Line 12. has no ? and no ASKS verb, so it is discarded.
    2. a) is captured with label a, but because the parent sentence naming Journey Optimizer and Real-Time CDP was thrown away, detect(q) only sees "sandboxes", which aliases to rtcdp (JO01 is missed!).
    3. b) has "IP warmup", which is not in ALIASES at all (detect(q) returns []), so it outputs: "No match in the catalog for this question."—even though JO03 (IP warmup plan execution) is literally in your catalog!
  - What I expected: Sub-items (a), b), 12.1, bullet points) must inherit the parent stem's text/product context, and ALIASES.ajo should include 'ip warmup', 'subdomains', 'quiet hours', and 'orchestrated campaigns'.

4. Voice converter (rfp()) leaks internal partner instructions and skepticism into client-facing proposals
  - Severity: High (Embarrassing in front of a procurement team)
  - Exact input that triggers it:
      - Input 1: "How does Brand Concierge trigger follow-up journeys in Adobe Journey Optimizer?"
      - Input 2: "How does Brand Concierge use AEM Sites for product cards in answers?"
      - Input 3: "How does Brand Visibility enrich product detail pages in Adobe Commerce?"
  - What happens: compose() pulls m.conn.how and m.conn.gain.text into Our approach ("Your response to the client"). Because RFP_CAT was written as partner-facing guidance, it contains phrases that rfp() does not scrub:
      - Input 1 drafts to the client: "Adobe's product page describes Journey Optimizer follow-up after concierge conversations, but Experience League documents no setup... Not a documented capability: a visitor who showed intent in a concierge conversation could get a follow-up by email, SMS or other channels, if Adobe confirms a route for you."
      - Input 3 (bv-commerce / C02 / AXC05) leaks imperatives directed at the partner ("confirm with Adobe", "so confirm", "prove it in a pilot", "Named by Adobe, setup not documented; confirm with Adobe").
      - In F02 (Implement Brand Concierge), if assumptions or basis is ever referenced, or in XA10, internal scoping warnings appear.
  - What I expected: A strict split between client-safe prose and partner-only warnings. If a connection is undocumented (ajo-bc), Our approach should state cleanly what the documented alternative is (Marketo Engage / sales handoff) and put "Adobe's product page markets AJO follow-up, but Experience League documents no setup; confirm with Adobe before committing" inside Notes for you, not for the client.

5. Grammar collisions in rfp() produce broken English
  - Severity: Medium
  - Exact input that triggers it:
      - Any question matching dwh-cja ("How do we bring Snowflake data warehouse tables into Customer Journey Analytics?")
      - Any question matching CW-CJA or CW-AEM
      - Any question matching marketo-workfront (XB01)
  - What happens:
    1. dwh-cja prereq has "At setup, you and your client assign...". rfp() converts "your client" to "you", producing: "At setup, you and you assign responsibility..."
    2. rfp() only replaces \bthe Client\b (capital C) with you, and \byour client\b with you, but misses lowercase \bthe client\b and \bthe customer\b. Thus O04 outputs "the partner does not edit articles about the client directly", CW-CJA outputs "these Skills cover the client's agreed AI-channel measures", and marketo-ajo outputs "provisioned for the customer".
    3. doLine() prepends "We will " and lowercases the first letter of scope. For BI2, scope is a noun phrase ("The agreed dashboards built on CJA data views..."), so What we would do reads: "We will the agreed dashboards built on CJA data views..." (Same for AD2: "We will derived fields that read...").
  - What I expected: AD2 and BI2 scopes should begin with verbs ("Create derived fields...", "Build the agreed dashboards..."), and rfp() should handle "you and your client" → "we and you" and case-insensitive client/customer.

6. Over-eager keyword aliases draft confident Adobe answers for non-Adobe or architectural questions
  - Severity: High
  - Exact input that triggers it:
      - Input 1: "How will you migrate our existing WordPress CMS and legacy DAM into the new platform?"
      - Input 2: "Do you support single sign-on (SSO) with Okta and SAML 2.0, and where is data hosted in the EU?"
      - Input 3: "How will you track project issues, risks, and weekly status reports during the rebuild?"
  - What happens:
      - Input 1: "wordpress" is in ALIASES.cms (Other CMS site, which only has Brand Concierge tag-manager lines CM1/CM2!). "cms" is in ALIASES.aemsites, and "dam" is in ALIASES.aemassets. It matches cms + aemassets + aemsites and drafts an answer about Dynamic Media with OpenAPI (XC01) or Brand Concierge scripts (CM1), completely missing content/asset migration (SI03, AS03, A02)!
      - Input 3: "rebuild" is in ALIASES.eds (Edge Delivery Services) and "report" is in ALIASES.cja. So a PM question about weekly status reports is classified as adobe and answered with Edge Delivery Services + CJA!
  - What I expected:
    1. Remove generic English words ("rebuild", "measure", "report on", "new site", "by asking", "routine work", "leads") from ALIASES, or weight them at 0.5 so they only trigger when paired with an Adobe/domain noun.
    2. When a question asks about migrating (migrat|move|import|transfer), boost SI03, A02, AS03, CJ03, XC15, AXA01 instead of default isDefault setup lines.

7. FIRM regex hijacks technical Adobe questions that mention "team", "resources", or "costs"
  - Severity: Medium-High
  - Exact input that triggers it:
      - "How can our marketing team use Adobe Coworker to draft journeys and check anomalies?"
      - "How do we join ad spend and campaign costs with web conversions in Customer Journey Analytics?"
  - What happens: classify(q) checks if (FIRM.test(q)) return 'firm'; before if (ADOBE.test(q)).
      - Because FIRM matches \b(your|the|our) (project |proposed |delivery |account |core |leadership )?(firm|company|organization|agency|team|staff|personnel|consultants|resources)\b, "our marketing team" (if phrased "our team") or "your delivery team" forces the question into Your firm!
      - Because FIRM matches \bcosts?\b, asking about "campaign costs" or "cost per web order" (AD2) forces a pure CJA paid-media question into Your firm!
  - What I expected: If ADOBE.test(q) is true, only classify as firm if the question is specifically about firm credentials/commercials (case stud|references|rate card|hourly rate|certif|years in business|insurance|msa|resumes), not bare words like our team or costs.

8. Silent data loss: RFP work vanishes on refresh, "Save draft", or "Add to my statement of work"
  - Severity: High
  - Exact input that triggers it:
    1. Partner drops an RFP with 60 questions, spends 45 minutes editing 15 answers, typing 20 client facts, and writing 10 firm answers.
    2. Partner clicks "Save draft" in the top masthead (or accidentally hits Cmd+R / F5, or clicks "Build" in the tab bar).
  - What happens:
      - Clicking "Save draft" serializes state (partner-sow-studio-v6), which does not include rfp. The partner thinks their 45 minutes of RFP work is in the .json draft file. It is not.
      - Clicking "Build" navigates to ../index.html, wiping the rfp memory object completely.
      - Clicking "Add to my statement of work" overwrites state.play = 'custom' and fresh: true, wiping any services the partner had previously configured on custom play without a confirmation dialog.
  - What I expected: "Zero server upload" does not mean "ephemeral RAM that dies if you click the first tab." Keep rfp in sessionStorage (or include an opt-in checkbox on Save draft: "Include RFP questions and drafted answers in this draft file"), and add a beforeunload warning when rfp.questions.length > 0.

9. Truncation ceiling: RFPs with >300 requirement rows or >900-character questions are silently clipped
  - Severity: Medium
  - Exact input that triggers it: Any enterprise spreadsheet RFP with 350 rows (common when Security, Architecture, Functional, and Commercial tabs are in one .xlsx workbook), or a scenario-based question over 900 characters (if (p.length < 12 || p.length > 900) continue;).
  - What happens: findQuestions() silently breaks at 300 and skips any paragraph over 900 characters. No warning is shown in #rfp-status.
  - What I expected: Raise the cap to at least 1,000 rows for spreadsheets, raise paragraph length to 2,500 chars, and if any rows are skipped due to limits, state it in #rfp-status.

## B. What Is Missing for a Systems Integrator (The Whole RFP Week)

Top 5 Missing Capabilities (Ranked by SI Impact)

Rank 1: Compliance Matrix & Requirement Traceability Mode (Supported / Partial / Partner-Built / Out of Scope)
  - Who uses it: Solution Architect & Proposal Manager (Monday–Wednesday).
  - What it solves: Almost every enterprise RFP requires a compliance code column (Yes / Fully Supported, Partial / Workaround, Custom / Partner-Built, No) alongside the narrative response. Right now, your catalog already knows whether a capability is native (Adobe creates the CJA connection), requires a specific tier (CJA Select or higher), is a partner-managed workflow (no native connector assumed), or is undocumented (ajo-bc), but it doesn't output a compliance status!
  - How it works: Derive a suggested compliance badge from the matched catalog item (e.g., Native / Documented, Requires Tier / Add-on, Partner-Built Workflow, Not Documented — Confirm with Adobe), let the partner set the client's exact compliance code (Yes / Partial / No), and export it as a dedicated column in Download response as Excel.
  - Tech needed: 100% static browser JS (using existing RFP_CAT metadata).
  - Size: Small (1–2 days).

Rank 2: Scope-to-Answer Quantity Sync (Bridge Scope & Services into the RFP prose)
  - Who uses it: Lead Solution Architect & Delivery Lead (Wednesday–Thursday).
  - What it solves: Right now, Add to my statement of work only pushes one way (RFP -> SOW). The drafted RFP answers always quote the generic Typical band text (e.g., "200 to 1,000 prompts in up to three markets", "four page refreshes and one new page"), even if the partner already set the engagement to Large, entered 2,500 prompts, or customized the service scope on the Services tab! Worse, a procurement team will compare the RFP response text against the SOW table and spot contradictions.
  - How it works: Read the active band (Small / Typical / Large) and any edited service scopes/quantities from state.estimates when composing doLine(id), and show the planning hours ("48 planning hours, Typical band") inside Notes for you, not for the client on each question so the architect can see the labor impact while clicking Use this answer.
  - Tech needed: 100% static browser JS (reads state already in memory).
  - Size: Small (1–2 days).

Rank 3: Write Back into the Client's Original Excel Workbook (Round-Trip .xlsx)
  - Who uses it: Proposal Manager (Thursday–Friday).
  - What it solves: Procurement portals (Ariba, Coupa, Scout, Bonfire) reject vendor-created spreadsheets. If a client sends a 5-tab .xlsx with locked formatting, dropdown validations, and formulas, the SI must paste answers back into Column F of that exact file. Your current Download response as Excel generates a brand-new 2-tab sheet, forcing a soul-crushing 3-hour copy-paste marathon on Friday afternoon.
  - How it works: When an .xlsx file is dropped, let the partner pick which sheet(s), which column holds the Question, and which column should receive the Response (and Sources). Keep the SheetJS workbook object in memory, write the approved answers directly into the target cells of the original sheet, and download the modified workbook.
  - Tech needed: 100% static browser JS (xlsx.mini.min.js is already loaded).
  - Size: Medium (3–4 days).

Rank 4: Local Reusable "Firm Boilerplate & Case Study" Pack (Import/Export JSON)
  - Who uses it: Partner Sales Lead / Bid Manager across multiple RFPs.
  - What it solves: You rightly separate Your firm questions (company overview, Adobe specialization tier, certified headcount, governance methodology, QA approach, 3 case studies, rate card). But an SI answers those exact same 25 firm questions on every single RFP! Having to type them from scratch into ephemeral textareas every time makes the Your firm pile a dead end.
  - How it works: Allow the partner to save and load a local firm-profile.json file (never uploaded to Adobe) containing reusable snippets for common Your firm categories (Certifications, AEM/CJA/RTCDP Case Studies, PM Methodology, QA/Testing, Support SLA, Commercial Terms) and auto-suggest them when classify() hits those sub-patterns.
  - Tech needed: 100% static browser JS (local JSON file import/export).
  - Size: Medium (3–4 days).

Rank 5: Bid Go/No-Go & Red-Flag Summary Card (Before Answering Question 1)
  - Who uses it: Partner Practice Lead / Sales Director (Monday morning intake).
  - What it solves: Before spending 40 hours on an RFP, an SI needs a 5-minute Go/No-Go readout: Which Adobe products is this RFP actually asking for? Are there regulated-industry traps (e.g., Coworker in FSI/Healthcare)? Are there undocumented connections (ajo-bc)? What license tiers (CJA Prime, RTCDP Ultimate, Sites Optimizer Ultimate, AEM Forms, Workfront Fusion) is the client assuming?
  - How it works: Immediately after load(), render a collapsible RFP Intake Summary above the question list showing: 1. Detected Adobe products & outside systems (with question counts). 2. Delivery & Licensing Red Flags aggregated from all matched connections (e.g., "3 questions touch Coworker + Workfront/Marketo: confirm industry eligibility with Adobe if client is in finance/healthcare", "2 questions require CJA Prime for graph-based stitching"). 3. Rough order-of-magnitude (ROM) hours & fee range if all matched services are included at the current Small / Typical / Large setting.
  - Tech needed: 100% static browser JS.
  - Size: Small–Medium (2–3 days).

Other High-Value Missing Pieces (and When You Need AI / Server)

| Capability | Who Uses It | What It Saves | Static JS vs. Server / AI | Size |
|---|---|---|---|---|
| 6. Multi-author split & merge (Section assignment) | Bid Manager + SMEs (AEM architect, CJA architect, Legal) | In real life, one person doesn't answer an RFP. Let the Bid Manager export/merge `.rfp-draft.json` files so the AEM lead and CJA lead can work in parallel and merge their `used` answers. | Static browser JS (JSON merge by question hash/index) | Small (2 days) |
| 7. Consolidated Assumptions, Exclusions & Dependencies Appendix | Solution Architect & Commercial Lead | Every RFP response requires a "Vendor Assumptions" section. You already generate `dependencyList()` in the SOW tab—let the partner append a deduplicated Assumptions & Prerequisites section to the downloaded RFP response. | Static browser JS | Small (1 day) |
| 8. Semantic Question Decomposition & Custom Tailoring | Solution Architect | A client asks a 4-part compound question with industry jargon ("How do we suppress credit-card offers in mobile push within 5 seconds of an in-branch application?"). Keyword matching grabs generic `XA01`/`XA02`, whereas an LLM grounded strictly on `RFP_CAT` + `CATALOG` can synthesize a tailored paragraph and cite the exact Experience League URLs. | Requires LLM API (with strict RAG over your `RFP_CAT` JSON so it cannot hallucinate features or prices) | Medium (1 week) |

## C. Concrete Changes to What Is Already There

1. Rename the filter button "Not sure" ([data-rfp-filter="unsure"]) to "Needs triage (N)" and show counts on all filter buttons. Why: "Not sure" sounds like the tool is broken or lacking confidence. Showing All (42), Adobe services (28), Your firm (9), Needs triage (5) gives the bid manager immediate progress visibility.
2. Add a "Needs review" filter button (or split Adobe services into Unreviewed vs. Used). Why: Once an RFP has 80 Adobe questions, clicking through to find which 12 you haven't reviewed yet requires scrolling the entire <ol class="rfp-list">.
3. Change "Used, keep it" (#rfp-use when q.status === 'used') to "Approved ✓ (click to unapprove)" or keep the button as "Approved ✓" and let it toggle. Why: Right now, once a partner clicks "Use this answer", there is no way to un-use it other than clicking "Skip" (which marks it "Skipped" in the downloaded document!).
4. Stop auto-including unreviewed drafts in "Download RFP response" (#rfp-download) and "Download response as Excel" (#rfp-download-xlsx) without a warning. Why: In responseDoc() and responseRows(), any question the partner never even clicked on (!q.status) is exported with its full auto-drafted answer and tagged "Draft, not yet reviewed". If a partner approves 10 answers and exports, they will accidentally hand 50 unreviewed, potentially mismatched drafts to a client. Default to exporting only Used answers (with a checkbox: "Include unreviewed drafts marked as Draft").
5. Fix the broken <span class="proto-note"> layout in .topbar. Why: In <header class="topbar"><div><p class="eyebrow">Play</p><h1 id="play-title"></h1><span class="proto-note">RFP Builder prototype, not the live tool</span></div>, <h1> is a block element, so .proto-note drops onto a new line with a margin-left: 12px overhang instead of sitting inline next to the title or eyebrow. Put .proto-note inside <p class="eyebrow"> or <h1 id="play-title">.
6. Warn before "Add to my statement of work" (#rfp-to-sow) overwrites the current SOW play. Why: Clicking #rfp-to-sow immediately switches state.play to 'custom' (Your own play) and sets fresh: true, blowing away any selection on custom and hiding the play the partner started in. Show a 1-step confirmation or preview: "This will switch your SOW to 'Your own play' with 6 products and 14 services from your approved RFP answers."
7. Let the partner add or remove individual service lines inside the RFP answer card before clicking "Use this answer". Why: match() picks up to 4 service lines (m.lines), which both write the "What we would do" bullets and get turned on in the SOW when #rfp-to-sow is clicked. If match() includes 3 right lines and 1 irrelevant line (e.g., it includes C06 when the client only asked about C01), the partner has no way to uncheck C06 without manually editing raw text—and even if they edit the text, toSow() still reads q.draft.m.lines and turns C06 on in the SOW! Render each matched service line under Drawn from with a checkbox ([x] Connect Brand Visibility and CJA measurement (56h)).
8. Auto-save rfpState into sessionStorage (and optionally into Save draft JSON) and add a beforeunload guard. Why: Clicking <button role="tab" data-build>Build</button> right next to Scope navigates away to ../index.html and permanently destroys the entire uploaded RFP and every typed answer. Saving to sessionStorage keeps your promise that "the list clears when you close the page/tab" while surviving a round-trip to the Build canvas!
