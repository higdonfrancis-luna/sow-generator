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
2. **RFI Builder, partner-only notes box:** rename the heading "Confirm with Adobe:" to "Adobe's part:". This finishes step 86. Clients never see this box.
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
  - On every canvas (the plays and Create your own play), first ask once: "What is your client trying to accomplish?", using the 23 preloaded problems in `canvas/problems.json`.
  - Then an "Add product" list ranked by propensity to buy, shown as **.91**-style numbers, which re-ranks as products are added and always resolves to that first goal.
  - Example: the client owns Customer Journey Analytics and "can't tie AI traffic to revenue", so Brand Visibility ranks first.
- **Files:** two finished designs (`design_transparent.md`, `design_model.md`) and the start of a third, hybrid one (`hybrid/`).
- **The plan to propose:**
  - Day one, rank by what the tool knows for certain: the products each goal calls for, plus documented connections and services.
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
