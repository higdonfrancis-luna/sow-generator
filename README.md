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
| `check.py` | Checks: `python3 check.py index.html [screenshot folder]` prints ✅/❌ lines and must end with ALL CHECKS PASSED. Needs Playwright. |
| `adobe_logo.png` | The logo the patch embeds (the same file as `exec/web_video/adobe_logo.png`). |

## How the numbers work

Every service has starting hours (`base`) and a planning range (`low` to `high`) in the catalog at the top of `index.html`. A fee is hours times the partner's rate, which can be overridden on any line. One-time services add up once; monthly services multiply by the recurring months. The totals show one-time, monthly and the services total.

## Steps

1. **Done, Oct 29 2026:** six templates in deck order, Adobe red restyle with the logo, one planning note instead of 27 repeated disclaimers, and a source link on every service (all 28 services point at Experience League or Adobe pages; every link checked, the Adobe product page could not be reached from the build machine).
2. **Next:** the services the plays promise partners and that the ChatGPT catalog lacked, with starting hours (Small / Typical / Large): Implement AEM Sites on Edge Delivery 480 / 960 / 1,920; SEO-safe content migration 120 / 240 / 480; launch, QA and hypercare 60 / 120 / 240; Implement Brand Concierge 320 / 640 / 1,280; CJA audiences that act on the data 24 / 48 / 96; CDN readiness for Commerce stores not on Fastly (optional) 24 / 56 / 120; package Coworker skills and connections as a plugin 16 / 32 / 64; Coworker skill maintenance and adoption program (monthly) 16 / 32 / 56. Prompt strategy, setup and the monthly review rescaled for 200 prompts: 64, 48 and 40 hours (Small 40, 32, 24; Large 120, 96, 72). The AEM objective still describes an existing site and changes here too.
3. **Then:** a customer-size switch (Small, Typical, Large) that picks each service's low, base or high hours.

## Sources checked on Oct 29 2026

- [Brand Visibility Quick Start](https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/quick-start): no recommended prompt count; onboarding generates a small set; trials up to 100 prompts (200 before April 1 2026), one domain, 50 URLs per opportunity type.
- [Adobe Brand Visibility product description](https://helpx.adobe.com/lt/legal/product-descriptions/adobe-brand-visibility.html) (effective Aug 21 2026): prompts per year as authorized in the sales order, up to 10 LLMs, 1,000 optimizations a year, a project is one domain.
- The 12 source pages in the catalog, checked with a browser-style request: all Experience League and news pages return 200 (a deliberately wrong path returns 404); business.adobe.com could not be reached from the build machine.
