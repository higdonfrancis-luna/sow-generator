# Partner services statement of work tool

A single HTML file partners open to scope the services behind a Brand Visibility play, see the hours, enter their own hourly rate and read what they'd make. It answers open item 8 of the Workstream 2 responses (Oct 27 2026): an editable SOW tool where a partner changes the scenario and the economics update live.

Adam's rules for it (Oct 29 2026):

- Six templates: the four sales plays in deck order (CJA, Commerce, AEM Sites on Edge Delivery, Brand Concierge for FSI), then "Brand Visibility on its own" and "Coworker on its own". The two on-its-own templates live only in this tool, not in the deck or the video.
- Partners care about the work and the hours. No software pricing anywhere in the tool; the partner enters a rate ($100 to $300 an hour, their call) and the tool does the math.
- Hours are starting estimates that change with the size of the customer. Partners change any line.
- 200 prompts is the starting point partners change. Adobe's docs recommend no number: onboarding generates a small set of prompts, trials include up to 100 (200 before April 1 2026), and the license is sold by the number of prompts in the sales order (sources below).
- Adobe red (#EB1000), black and white, Source Sans 3 like the video page, the Adobe logo in the masthead. The SOW document itself carries the partner's name and no Adobe logo: it's the partner's paper to its customer.
- Nothing about Adobe Consulting Services.

## Files

| File | What it is |
|---|---|
| `index.html` | The tool. One file, no backend; drafts save in the browser and as JSON. "Download template" saves a clean copy of the tool, "Download SOW" the finished document, "Services CSV" the lines. |
| `chatgpt_original.html` | The file ChatGPT built (Oct 28 2026), kept so step 1 can be reproduced. |
| `patch_step1.py` | Step 1, applied to the original: `python3 patch_step1.py index.html` after copying `chatgpt_original.html` to `index.html`. Every anchor must appear exactly once. |
| `patch_step2.py` | Step 2, applied after step 1: `python3 patch_step2.py index.html`. The new services and their hours live in this script. |
| `patch_step3.py` | Step 3, applied after step 2: `python3 patch_step3.py index.html`. The customer-size switch. |
| `check.py` | Checks: `python3 check.py index.html [screenshot folder]` prints ✅/❌ lines and must end with ALL CHECKS PASSED. Needs Playwright. |
| `adobe_logo.png` | The logo the patch embeds (the same file as `exec/web_video/adobe_logo.png`). |

## How the numbers work

Every one of the 35 services has starting hours (`base`) and a planning range (`low` to `high`) in the catalog at the top of `index.html`. The customer-size switch (Small, Typical, Large) sets every unedited catalog line to its low, base or high hours across all six templates; a line the partner edits keeps its hours until "Restore starting scope and hours", and custom services keep theirs. The size is saved with the draft. A fee is hours times the partner's rate, which can be overridden on any line. One-time services add up once; monthly services multiply by the recurring months. The totals show one-time, monthly and the services total.

## Steps

1. **Done, Oct 29 2026:** six templates in deck order, Adobe red restyle with the logo, one planning note instead of 27 repeated disclaimers, and a source link on every service (all 28 services point at Experience League or Adobe pages; every link checked, the Adobe product page could not be reached from the build machine).
2. **Done, Oct 29 2026 (Adam: "looks great go"):** the services the plays promise partners and that the ChatGPT catalog lacked, with starting hours (low / base / high): Implement AEM Sites on Edge Delivery 480 / 960 / 1,920; SEO-safe content migration 120 / 240 / 480; launch, QA and hypercare 60 / 120 / 240; Implement Brand Concierge 320 / 640 / 1,280; audiences that act on the data (CJA) 24 / 48 / 96; CDN readiness for Commerce stores not on Fastly (optional) 24 / 56 / 120; package Skills and connections as a plugin 16 / 32 / 64; Coworker adoption and Skill maintenance (monthly, reworked from the maintenance line) 16 / 32 / 56. Prompt strategy, setup and the monthly review rescaled for 200 starting prompts: 64, 48 and 40 hours (low 40, 32, 24; high 120, 96, 72). The AEM play's objective is a new site on Edge Delivery, and its C03 workflow line no longer assumes an existing site. Starting selections: AEM adds the three build lines, FSI the Brand Concierge build, CJA the audiences, Coworker on its own the plugin and the monthly adoption line; the commerce CDN line and the Coworker connection line are optional. The browser-storage key moved to v5 so the new hours show; JSON drafts still open. At $150 an hour the starting selections come to: CJA and Commerce $32,400 plus $15,600 a month; AEM $223,200 plus $15,600 a month ($410,400 in year one); FSI $121,200 plus $15,600 a month ($308,400); Brand Visibility on its own $22,800 plus $15,600 a month; Coworker on its own $23,400 plus $4,800 a month ($81,000).
3. **Done, Oct 29 2026 (Adam: "go"):** the customer-size switch in the services strip. At $150 an hour the AEM play runs from about $229,800 in year one for a Small customer through $410,400 Typical to $759,600 Large.
4. **Hosting (Oct 29, 1:39 am):** Adam hosts it on Adobe Proto (proto.adobe.io, where WARROOM lives): he uploads a zip holding only `index.html` at its root (`cd sow && python3 -c "import zipfile; zipfile.ZipFile('sow.zip','w',zipfile.ZIP_DEFLATED).write('index.html','index.html')"`), by hand, since Claude can't reach Proto. The tool is one file, so nothing else goes in the zip; the font loads from Google Fonts and falls back to Arial if Proto blocks it. Open question: whether partners outside Adobe can open a Proto link; if not, Proto is the home for teammates and `abvscale.netlify.app/sow` serves partners when Adam says deploy. A Claude artifact was judged a preview only: its sandbox can block the draft saving and the download buttons.

## Sources checked on Oct 29 2026

- [Brand Visibility Quick Start](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/quick-start): no recommended prompt count; onboarding generates a small set; trials up to 100 prompts (200 before April 1 2026), one domain, 50 URLs per opportunity type.
- [Adobe Brand Visibility product description](https://helpx.adobe.com/lt/legal/product-descriptions/adobe-brand-visibility.html) (effective Aug 21 2026): prompts per year as authorized in the sales order, up to 10 LLMs, 1,000 optimizations a year, a project is one domain.
- The 12 source pages in the catalog, checked with a browser-style request: all Experience League and news pages return 200 (a deliberately wrong path returns 404); business.adobe.com could not be reached from the build machine.
