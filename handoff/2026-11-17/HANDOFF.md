# Handoff: November 17, 2026

Read this first in the new chat. Everything below is on GitHub, so a new account with access to the repository can pick it up.

## Where everything is

- **Repository:** `higdonfrancis-luna/sow-generator`
- **Branch:** `claude/zealous-edison-oko1nm`. All the work is here. `main` is untouched.
- **Draft pull request:** https://github.com/higdonfrancis-luna/sow-generator/pull/1. It stays a draft. Merge only when Adam says go.
- **How to start the new chat:** pick the repository above, then say: *"Read handoff/2026-11-17/HANDOFF.md on branch claude/zealous-edison-oko1nm and continue from there."* The new session may be given its own branch name. Fetch this branch and build on it.

## How Adam works (follow these)

- **Pictures before approval.** Confirm exactly what you will build, show mockups, and ask before building or changing code. Invisible fixes are the only exception.
- **Be surgical.** Never delete or override existing content unless you are sure it must go. Leave no dead code.
- **Be positive and upbeat** in every message.
- **The change test:** change something when it helps partners understand how the products work together and how much money they can make.
- **Evidence standard:** only what an official Adobe-branded website documents (experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com, www.adobe.com, business.adobe.com, news.adobe.com). On screen, show evidence as links only, with no extra explanation text.
- **Step 86 rule:** publish every connection and feature as available. Add no "confirm with Adobe" caveats. Licenses, technical prerequisites and real product limits stay.
- **Security and conduct:**
  - Never cite internal Adobe material.
  - Never use partners.adobe.com or the certification APIs.
  - Never spoof a User-Agent or request headers.
  - business.adobe.com blocks automated tools, so use text Adam pastes.
  - Never put Adam's personal details in requests to outside services.
- **Customer data (propensity project):** never commit it to GitHub. Upload it straight into the chat. Only summary numbers may ever reach the tool. The site is hosted behind an Adobe login.
- **Commits:**
  - `git add` with explicit paths.
  - The subject line ends with `[skip netlify]`, a long-standing convention.
  - Work on the branch above, and never push to `main` without Adam's go.

## Update from the second session (Nov 17, later)

- **Branch:** this session works on `claude/sow-generator-handoff-517tq8`, built on top of `claude/zealous-edison-oko1nm`. Fetch it and build on it.
- **Network:** the personal cloud environment `sow-generator` allows experienceleague.adobe.com, helpx.adobe.com and news.adobe.com, so quotes can be checked live with `curl` (WebFetch does not reach them).
- **Nothing in the tool changed.** Everything below is work in progress and waits for Adam's yes on the pictures.
- **Adam does not read service codes.** Say "the Coworker Chat on Adobe Analytics service", not "XL27".

| Item | State |
|---|---|
| A. Figma connects to four more products | **Saved** as commit 0b4e21b (Adam: "Yes, add those"). 162 connections, 569 services. The Express service went in as "Figma designs imported into Adobe Express" at 8 / 16 / 32 hours. `figma/apply_figma.py`, `figma/FIX_ROUND.md` and `figma/pictures/` are the record. |
| B. Coworker evidence tab | Fix round done. Pictures, a preview and the brief zip were sent. Waiting for Adam's yes. |
| C. Propensity | Adam's direction: the ranked Add product list goes on the **ready-made plays**; Create your own play stays freeform. He made more decisions on Nov 17 (see "Decided by Adam" below). Mockups on the Brand Visibility + CJA play: `propensity/mockups/p1_play_goal_question.png`, `p3_play_ranked_with_sample_numbers.png`, `p3_list_only.png` and `p3_list_phone.png`. There is no p2: the list without numbers was removed. A new tab for the brief, "Propensity to buy", explains the method (`propensity/method_page/`). Both were reviewed by independent reviewers. Waiting for Adam's picks and his data. |
| Small item 1 (the Coworker Chat on Adobe Analytics service ticked for new quotes) | **Dropped.** Adam would rather steer clients to Customer Journey Analytics, so the service stays available and not ticked. Nothing to build. |
| Small item 2 (one phrase, "Ask Adobe") | Adam said yes to the picture (`small_items/item2_ask_adobe_today_vs_proposed.png`): two short lists, "Ask Adobe:" and "Good to know:". **Built and saved as `5acc994`** (README note of Nov 17; real screen: `small_items/built/ask_adobe_built_bank_2_6.png`). |

**Decided by this session (Adam: "I'll leave that to you")**
- The tool's evidence sentences stay as they are. The evidence field is never shown on screen. 12 of the 46 evidence-page rows quote a different sentence from the same Adobe page than the tool holds, by design: the page picks the line that shows the work, the tool keeps the line that backs its own card wording (for example "native connection" on Coworker + GenStudio) and its RFI write-ups. Both sentences are word for word on the same Adobe page.
- The Support and Services link reads "Adobe Support and Services (business.adobe.com)" (Adam: "sounds good").

**Decided by Adam (Nov 17, propensity)**
- **The ranked next-best-product list goes in BOTH places: the ready-made plays and Create your own play.** Adam, Nov 17 late: "that's the only reason I set up this propensity scoring. My boss wants to know with the ready-made plays [the] next best product opportunities, same thing with building your own play ... especially with Coworker and Brand Visibility ... so both places." This replaces his earlier guess that Create your own play would stay freeform. **Add product comes back to the ready-made plays** (it was taken off on Nov 14).
- **The ranked list is BUILT but NOT SAVED (Nov 18).** It sits uncommitted in the working copy `.claude/worktrees/wf_ef730937-03c-7` and as `scratchpad/build_out/ranked/ranked.patch` (10 source files against `4ac133d`; plan `PLAN.md`, real screens in `final/`, the summary numbers table and its two counting scripts in `numbers/`). All suites passed there (new suite `test_next_product.js`, 122 checks). It is held back on purpose: the patch carries the summary numbers from Adam's files, and Adam sees the real screens first. Waiting on him: (1) counts inside a group can read 0, 10 or 20 of a group of 30 or more, rounded down to 10 (no group under 30 is in the file): fine to save?; (2) Coworker and Brand Visibility do not suggest each other, because the tool's files hold no documented connection between them (each sits under "Not tied to this goal" on the other's play); (3) the brief's page promises a hold-back check and the data owner's sign-off before partners see numbers; (4) the Adobe Coworker play offers no outside systems, so Brand Visibility added there has no CDN services. The pictures hold real numbers: do not commit them before his yes.
- **The ranked list build was started (started Nov 18, early)** in an isolated working copy, from commit `4ac133d`: a plan, the summary numbers counted twice from Adam's files, the build, two reviews and a fix round. Nothing of it is in the tool until its patch (`scratchpad/build_out/ranked/ranked.patch`, lost if the session's machine is recycled) is applied, tested and committed. Adam sees the real screens before it is saved.
- Both answers for the ranked list are in (Nov 18, early). (1) GitHub: "Don't worry about the GitHub stuff. I'm gonna move it to Adobe's instance as soon as this gets approved and I'll make it private." Read by this session as: summary numbers may sit in the tool's code; still summary only, no company named, small groups hidden, and never the customer files themselves. (2) The play keeps its name when a product is added: "I guess it would keep its name if they add other products". He asked where the name lives: it shows at the top of the Build canvas and at the top of the SOW steps (`propensity/mockups/play_name_where_it_shows.png`); the statement of work's own title is "Services for" plus the product names, and its opening objective is the play's.
- The "never go backwards" rules on Create your own play's Add product menu are approved from the picture and **built and saved as `711d693`**. The rules the tool follows are in `canvas/never_suggest.json` (README note of Nov 17; real screens in `propensity/built/`). With Edge Delivery Services on the canvas the menu already offered no traditional AEM Publish, so that rule shows no "Not suggested" line. Journey Optimizer B2B Edition does not hold Target back (only Journey Optimizer does, as his rule is written).
- **Never go backwards.** "Any newer product that offers the same functionality that an older product did: they're not going to go backwards." His rules, his words, the tool's product ids and what the tool pairs today are in `propensity/never_suggest_rules.json`. Set: Customer Journey Analytics stops Adobe Analytics; Journey Optimizer stops Target, while the tool keeps pairing the two for clients who own both (his "leave that one as is", as this session read it and told him). The rules also apply on Create your own play: the product moves to a "Not suggested" line (`propensity/mockups/own_play_menu_today_vs_proposed.png`, approved). No rule between Marketo Engage and Journey Optimizer: "they need each other", especially the B2B edition. AEM Sites with Edge Delivery Services stops AEM Sites with traditional AEM Publish ("they probably do not want to go backwards to traditional AEM publish"); Sites Optimizer alone does not. Adobe Campaign and Commerce on-premises are not in the tool. Built on Create your own play (`711d693`); the ranked list is not built yet.
- **No list before the data.** Partners never see the list without numbers. The list ships only after the customer data is loaded and checked. The "Day one" line in section C below no longer holds, and `propensity/hybrid/run_day_one.js` describes a view that will not ship.
- `propensity/design_transparent.md` was written before these decisions.
- **How long the data takes.** On file, as estimates only (`propensity/design_transparent.md`, section 12): 1 to 2 weeks on Adam's side (export, mapping review, data-owner sign-off) and about 7 to 10 working days of build, of which 2 to 3 days are the counting step. That estimate assumed a prototype that was not saved with the project. Adam's file lists one row per company per product, which is what the counting needs. He has not uploaded it yet.

**Customer data (Nov 17, evening)**
- Adam uploaded two Excel files into the chat: one for the digital experience products, one for the creative and document products. One row per company per product, one quarter, no purchase dates. **Nothing from them is in this repository, and nothing may be: the repository is public.** No counts, no shares, no scripts that read the files.
- A first look was done in the session's private workspace (which does not survive the session) and given to Adam as a private report. To redo it, ask Adam to upload the two files again.
- Name matches Adam confirmed for his files: LLM Optimizer is Brand Visibility; Agent Orchestrator is Coworker; Mix Modeler is Marketing Campaign Analytics; GenStudio base packages is GenStudio for Performance Marketing; Journey is Journey Optimizer; Firefly Services counts under Firefly Creative Production (the umbrella product). Firefly Design Intelligence is **not** Brand Intelligence. Adobe Campaign, Audience Manager, AEM Guides and Learning Manager are in the files and not in the tool. The files do not tell Edge Delivery from traditional AEM Publish, or the Commerce editions, apart.
- What the first look means for the design, to settle with Adam before anything is built: (1) count "similar customers" inside the client's kind of company, because ownership differs sharply by segment; (2) the fall-back for rare combinations reads low and needs a visible "rough" mark or a better rule; (3) "owns" in these files means a product line above a yearly-spend floor, so the tool must say so; (4) the creative and document file is too narrow for numbers; (5) the newest products have too few owners for a number of their own, so the goal order has to carry them; (6) both files end with the export tool's note that some data may have been omitted: Adam to check with the report's owner.
- The propensity tab now says a first look was taken and that none of its numbers are on the page.

**Adam on the data and the number (Nov 17, late)**
- The rows he removed from the files were the smaller ones, mostly zero-dollar rows where the customer owned nothing.
- No segment question in the tool. "Can we have it behind the scenes and no one could see it"; the segments may change in December; and "no propensity to buy score is ever perfect. It's directional at best." So: the partner is not asked for a segment, the number is presented as a guide, and segments are used only when the numbers are prepared and checked. A private mockup with a segment question was drawn and is dropped.
- **Decided (Adam: "Above looks good"):** a new product with too few owners leads its heading with "No number yet"; established products show a number, called a guide; numbers from a rare combination are marked rough; no numbers for creative and document products for now. Picture: `propensity/mockups/p3_list_only.png`. Not built.
- **Never show a dollar figure to partners.** Adam: "I'm not gonna mention $50,000 or more to them." The counts come from product lines above the size floor of his files; that stays a note for whoever prepares the numbers, not text in the tool.
- **Segments stay behind the scenes** (confirmed twice). No segment names in the tool.
- He has not said whether real counts may go on the brief's tab. Default: they wait, and they never go to GitHub.

**ChatGPT and Claude as outside systems (Adam, Nov 18)**
- His words: "we never looked at adding Anthropic and OpenAI MCP connectors as outside systems... this was I think a pretty big miss. I guess add this to what we need to do. I guess you'll have to go through every single play and see where these fit in... I'll leave it to you in your expertise." He also asked "what else are we missing?" among outside systems.
- He uploaded research made by another AI assistant (`Adobe-AI-SOW-RFI-Claude-Handoff.zip`: 87 records, a start note and a page). It is a set of leads, not evidence: about a quarter of its sources are on sites outside the evidence standard (claude.com, openai.com, github.com, blog.adobe.com, aem.live, semrush, two on partners.adobe.com, which must never be opened). The upload is unpacked in the session scratchpad under `ai_hosts/upload/` and is not in the repository.
- Status: every record is being checked word for word on Adobe's own pages, two sweeps look for other missing outside systems, and a proposal with pictures follows (scratchpad `ai_hosts/PROPOSAL.md`, `proposal_data.json`, `pictures/`; lost if the machine is recycled before they are copied into `handoff/`). Nothing is built. Adam approves from the pictures first.
- The session's network environment now also allows developer.adobe.com and www.adobe.com (approved by Adam, Nov 18). business.adobe.com still needs text Adam pastes.

**Questions waiting for Adam**
1. Answered: he wants Add product back on the ready-made plays, with the ranked list ("both places").
2. Answered: the play keeps its name.
3. His boss's example (the client owns CJA, Brand Visibility comes first) can only show as a ranked list on Create your own play, because the ready-made play with CJA already holds Brand Visibility. On that play the list starts with what comes after: Coworker.
4. The order is by goal first, so a low number can sit above a high one. Confirm that is what he wants to show his boss.
5. Tab name: "Propensity to buy" (his words) while the number means ownership until purchase dates exist. The page says so in its notice.
6. Counting by hand (the page's method) or a statistical model (`propensity/design_model.md`).
7. Exact or rounded customer counts; where the counting is done; who can open the tool (the handoff says behind an Adobe login, the repo configures none).
8. The made-up-accounts test run was not saved with the project. Rebuild it only if his boss asks to see it.
9. (Answered Nov 17: the AEM Sites rule is set, see "Decided by Adam".)
10. If the customer data has no line for a product, should the list leave it out and say so, or show it marked "No data"?

**Coworker evidence fix round, what changed** (`evidence_page/coworker-evidence.html`, `data.json`):
- All 62 quotes on public Adobe pages were matched again, word for word, against a fresh live read of the 45 pages (`evidence_page/tools/fetch_pages.py`, then `verify.py`). The Adobe Support and Services quote stays checked against Adam's paste.
- Better sentences from the same Adobe pages for CW00, CW05, CW09, AXD10, XG08 and XJ33. The links did not change.
- Notes under the four "Partner-written Coworker Skills" rows, and the CW-FSI note gives the old name.
- 283 distinct pages (286 addresses), the heading "Adobe says Coworker needs this work.", and shorter, more exact process steps 4, 5 and 6.
- Its nav now links the new "Propensity to buy" tab.

**The brief's two new tabs, how to rebuild them**
- The brief is not in GitHub. Unzip Adam's `brand-visibility-growth.zip` into a folder, copy in `evidence_page/coworker-evidence.html`, `propensity/method_page/propensity-method.html`, `propensity-mockup.png` and `propensity-mockup-phone.png`, and add the two nav links to its `index.html` after "Evidence" (`evidence_page/brief_nav_change.diff` shows the first; the second is `<a href="propensity-method.html">Propensity to buy</a>` right after it).
- `python3 propensity/method_page/build_method_page.py evidence_page/coworker-evidence.html propensity/method_page/propensity-method.html` rebuilds the propensity tab and copies its picture.
- `evidence_page/tools/package.py` writes the zip and one click-through preview for each tab. The previews embed Adobe fonts: never commit them.
- Pictures: `evidence_page/tools/pics.js`, `propensity/method_page/pics.js`, `propensity/mockups/propensity_mock.js`, `small_items/small_items.js` then `compose.py`.

**"Ask Adobe": what the build would change, once Adam says yes**
- `rfp_answers.js`: the notes box and the checklist download show two lists. "Ask Adobe" holds the notes that tell the partner to ask Adobe; "Good to know" holds the rest. The class `.rfp-confirm` stays.
- Reword to "Ask Adobe": the two Brand Concierge notes and the Experience Platform regions note in `rfp_prototype/part3_research/statements.json` (never edit `rfp_facts.json`; it is built), and "or confirm it with Adobe" in `rfp_answers.js` (the no-connection note).
- Leave alone: the Marketo data center and Workfront cluster notes (the client's own admin has the answer), "Check Adobe's pages", and every note about the client.
- "Ask Adobe" must never reach a client document. The guards that keep partner wording out of the Word proposal, the client workbook and the statement of work do not match the new phrase yet: `rfp_proposal.js`, `qa/rfp_word_copy.js`, `qa/check_product_copy.py`, `rfp_prototype/kb_method/build_method.py`, `test_rfp_step53.js`, `test_rfp_step54.js`, `test_rfp_kb_round2.js`, `test_step86.js`, `rfp_prototype/chatgpt_round6/test_round6.js`. Add it to each.
- **Found on the way, for a later picture:** a few client-read sentences still say "confirmed with Adobe" or similar, which step 86 missed: `index.html` near lines 258 (two, CDN log forwarding), 721 and 737; the partner-read hint near 711 and the grey example near 43; the Adobe Commerce hosting sentence and "from Adobe in writing" in `statements.json`. Bring them to Adam as their own picture.

## Saved today (Nov 17)

| Commit | What |
|---|---|
| 054d3f4 | First page: Adobe names on the plays, the Brand Intelligence card, GenStudio as a family |
| edd8f61 | "New" badge on Adobe Brand Visibility |
| 195de3d, 211fdce | Brand Intelligence connects to Frame.io, Firefly Creative Production and Figma |
| 6a96c44 | Coworker services and proof, the Workfront note, Brand Intelligence with Creative Cloud and Coworker |
| 1f374b6 | Coworker: 26 more services, the Coworker + Adobe Analytics connection, RFI write-ups for all 563 services |
| 5b51f88 | Brand Visibility + Brand Concierge in industry-neutral wording, with Adam's picks A to D (see below). It was applied with `handoff/2026-11-17/neutral/apply_neutral.sh`, which edits by content and then builds. |

**Industry-neutral wording, Adam's picks:**
- A: keep the card line "Two products, new sales pursuit".
- B: keep the banking starting problem on the first page.
- C: the RFI Builder offers "Answer and source review" (FSI01) to any client's RFI.
- D: the operating-model line reads "a product, price or policy change starts a review".

## Small items Adam leaned yes on (build each with a picture first)

1. **Tick "Coworker Chat on Adobe Analytics report suites" (XL27) for new quotes only.** Saved quotes must keep their totals. That needs a new saved-defaults flag in the three places that write a canvas's saved defaults: the canvas page, the SOW steps' syncCanvas and the RFI hand-off. Do not bump `combinedDefaultsVersion`: that would replay older restores on current saves.
2. **RFI Builder, partner-only notes box:** one phrase for asking Adobe. The earlier lean was to rename the heading "Confirm with Adobe:" to "Adobe's part:"; see the update above for the current proposal ("Ask Adobe" and "Good to know"). Clients never see this box.
3. CW11's trial rule stays in the statement of work, which is Adam's pick. Nothing to do.

## In progress, not saved (files in this folder)

### A. Figma connects to four more Adobe products (`figma/`)

- **What:** Figma, already an outside system, gains connections to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, with six optional services, XF01 to XF06. All four routes are verified on Adobe pages (`quotes_verified.json`).
- **State:** built in a scratch copy and reviewed. The fix round was cut off by the usage limit, so nothing is fixed yet and Adam has not seen pictures.
- **Files:**
  - `apply_figma.py` is the reviewed version. It re-applies the change by content.
  - `apply_figma.round1_partial.py` is the interrupted fix attempt, kept for reference only.
  - `figma.patch` is against 6a96c44.
- **Before reusing the script:** it expects the old counts (157 connections, 537 services). Since 1f374b6 the counts are 158 connections and 563 services, so update its count edits first.
- **Fix these first** (details in `review_findings.json`):
  - High: the Firefly Custom Models card implies shared team models work in the Figma plugin, which no Adobe page says.
  - High: in the RFI Builder, any question that mentions Figma swaps the product's own services for the Figma line. The cause is `NAMES` in `rfp_answers.js`.
  - Medium: the Express "what you get" text claims more than Adobe's page.
  - Medium: one plugin shows as two connections.
  - Medium: the "how it works" texts are long.
  - Several low wording items.
- **Then:** rebuild, run the suites, take pictures, and get Adam's yes before saving.

### B. Coworker evidence page for Adam's brief (`evidence_page/`)

- **What Adam asked for:** a separate HTML page that lists every Coworker service (60) in one column and its Adobe source (link plus a word-for-word quote) in the other, with "our process, start to finish". It becomes its own tab, "Coworker evidence", in his Partner growth brief.
- **Files:**
  - `coworker-evidence.html` uses the brief's own stylesheets.
  - `data.json` holds every row and quote, each verified on Nov 17.
  - `brief_nav_change.diff` is the one-line nav link added after "Evidence" in the brief's `index.html`.
- **The brief itself is not in GitHub.** Ask Adam to upload `brand-visibility-growth.zip` again.
- **State:** written and reviewed. The fix round was cut off.
- **Fix before showing Adam** (details in `review_findings.json`):
  - The 286-page count includes 3 duplicates (283 distinct).
  - Process step 5 and step 6 wording.
  - The CW00, AXD10, CW05 and CW09 quotes don't show the service well. Pick better sentences from the same Adobe pages.
  - Four "Partner-written Skills" rows quote a skill Adobe already ships.
  - The heading "Adobe asks for this work." claims a little more than the quotes say.
  - The CW-FSI row should give its old name too.
- **Then:** make a standalone version for preview, take pictures, get Adam's yes, and send back his brief as a zip with the new tab.
- **Do not commit a version with embedded Adobe fonts.** The repository is public, and those fonts are licensed.

### C. Next-product propensity ranking, problem first (`propensity/`)

- **The boss's idea plus Adam's follow-up:**
  - On the ready-made plays (Adam, second session: Create your own play stays freeform), first ask once: "What is your client trying to accomplish?", using the 23 preloaded problems in `canvas/problems.json`.
  - Then an "Add product" list ranked by propensity to buy, shown as **.91**-style numbers, which re-ranks as products are added and always resolves to that first goal.
  - Example: the client owns Customer Journey Analytics and "can't tie AI traffic to revenue", so Brand Visibility ranks first.
- **Files:** two finished designs (`design_transparent.md`, `design_model.md`) and the start of a third, hybrid one (`hybrid/`).
- **The plan to propose:**
  - Day one (overtaken: Adam decided on Nov 17 that partners never see the list without numbers), rank by what the tool knows for certain: the products each goal calls for, plus documented connections and services.
  - With Adam's data, add real propensity: co-ownership rates with a back-off for rare combinations, or a small calibrated model. Backtest it so .80 really means about 8 in 10.
  - Show the customer count next to each number.
- **Data:** Adam found a large data set covering the marketing (digital experience) products and the Creative Cloud products. He will upload it into the chat. Never commit it.
- **Next:** mockups with clearly labeled sample numbers, then the real numbers from his data.

### D. Other open items

- Adam's answers on the earlier review page (a claude.ai artifact on the old account, which the new account may not see). Ask Adam.
- The "Coworker Implementation Case" doc is also on the old account (https://claude.ai/artifact/AcLFJyhHLkPv1UtLwuWt5Z).
- **Before merging to main:** a plain-words list of everything going in. Merge only on Adam's go.

## Build and test

- Build: `python3 canvas/build.py`, then `python3 build_site.py`.
- Run browser test suites **one at a time**. Running them in parallel caused load flakes.
- **Failures that were there before today's work:**
  - `qa/check_rendered_copy.js`: it still clicks the Download SOW button, which was removed on Nov 13.
  - `test_step47.js`: two layout checks at 768 px.
  - `canvas/test_problems.js`: eight refine checks.
  - `check.py`: needs Python Playwright, which the container lacks.
