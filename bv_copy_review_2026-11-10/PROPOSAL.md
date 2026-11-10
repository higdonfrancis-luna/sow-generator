# Brand Visibility wording: the trial and Adobe Analytics (proposed Nov 10 2026)

**Built on Nov 10 2026 as step 58 (Adam: "YES").** What was built, and the three places where the shipped wording was not what
this proposal quoted, are in `AS_BUILT.md` beside this file. The text below is the proposal as Adam approved it.

Adam, Nov 10: "trial for brand visibility is over now", and "brand visibility can connect with cja, i wouldn't pitch it with
aa. let's say not available."

Two rules for every word a partner or a client reads in the tool:

1. **No Brand Visibility trial.** The tool speaks of a Brand Visibility license. Nothing says trial, free trial or paid offer.
2. **Brand Visibility connects with Customer Journey Analytics.** Adobe Analytics is not named as a way to feed Brand Visibility.

Sites Optimizer's own trial wording and Coworker's "Try Before You Buy, a trial or the Agentic SKU" stay as they are: they are
different products. Say so if those should change too.

## The changes

Each line shows only the words that change. "Card" is what the partner reads on the canvas; "SOW" is what the client reads.

### Rule 1: the trial

| # | Where | Today | Proposed |
|---|---|---|---|
| T1 | Brand Visibility + CJA, first prerequisite (card and SOW) | The paid Brand Visibility offering, not the free trial (CJA's page requires it for the source) | A Brand Visibility license (CJA's page requires it for the source) |
| T2 | Brand Visibility + Edge Delivery Services, first prerequisite (card and SOW) | ... the Adobe LLM Optimizer Users product profile (trial users need the LLMO Admin IMS group) | ... the Adobe LLM Optimizer Users product profile |
| T3 | AEM Sites + Brand Visibility, first prerequisite (card and SOW) | ... the Adobe LLM Optimizer Users product profile (trial users: the LLMO Admin IMS group) | ... the Adobe LLM Optimizer Users product profile |
| T4 | Brand Visibility + Adobe Commerce, first prerequisite (card and SOW) | Adobe Commerce storefront and a Brand Visibility license (trials get one opportunity, Recover Content Visibility by default) | Adobe Commerce storefront and a Brand Visibility license |
| T5 | Search data + Brand Visibility, Availability (card) | GA4 is included in the paid Brand Visibility offer and is not available on the free trial. | GA4 is included with the Brand Visibility license. |
| T6 | AEM Sites + Brand Visibility, Availability (card) | Not stated by Adobe; trial workspaces have tighter deployment limits, so assume the paid offer and confirm your client's deployment allowance and supported opportunity types before optimization begins. | Not stated by Adobe; confirm your client's deployment allowance and supported opportunity types before optimization begins. |
| T7 | AEM Sites + Brand Visibility, Availability (SOW) | Not stated by Adobe. The paid Brand Visibility offer is assumed, because trial workspaces have tighter deployment limits. | Not stated by Adobe. The Client confirms its licensed deployment allowance and supported opportunity types before optimization begins. |
| T8 | Service L03, Automated optimization deployment pilot, Assumptions (all five plays) | ... Trial workspaces have tighter deployment limits (Adobe's pages give 10 pages, or 50 URLs for trials from April 1, 2026), so the paid offer is assumed. Adobe lists edge auto-optimization as ... | ... Adobe lists edge auto-optimization as ... (the trial sentence is removed) |
| T9 | Optimize at Edge availability note (card) | Not stated by Adobe. Trial limits conflict: one opportunity on up to 10 pages (Optimize at Edge FAQ), or up to 50 URLs for one opportunity type for trials from April 1, 2026 (Quick Start). | Not stated by Adobe. |
| T10 | Service C01, Connect Brand Visibility and CJA measurement, Assumptions | ... the Client is on the paid Brand Visibility offer (trial workspaces cannot connect), ... | ... the Client holds a Brand Visibility license, ... |

### Rule 2: Adobe Analytics

| # | Where | Today | Proposed |
|---|---|---|---|
| A1 | Service C01, Assumptions (the short and the long form) | The integration is available (Adobe Analytics can feed Brand Visibility's referral reporting, but the AI-agent dataset reaches CJA only), ... | The integration is available, ... |
| A2 | Search data + Brand Visibility, how it works (card) | ... Google Analytics 4 can fill the Business Impact tab, as CJA or Adobe Analytics can. | ... Google Analytics 4 can fill the Business Impact tab, as CJA can. |
| A3 | Search data, recommendation (card) | GA4 can fill the Business Impact tab when your client has neither CJA nor Adobe Analytics. | GA4 can fill the Business Impact tab when your client does not have CJA. |
| A4 | Service SD1, Search Console and GA4 connections, Scope | Connect Search Console, and GA4 where your client has neither CJA nor Adobe Analytics, to ... | Connect Search Console, and GA4 where your client does not have CJA, to ... |

## How it would be built

- One patch, as step 58, on the copy rules (`sow/product_copy_rules.json`) and the service templates in `sow/index.html`, each
  edit on an anchor that appears once.
- Today's wording is recorded as prior wording, the way steps 53 and earlier did it, so a saved draft or a browser that holds
  the old sentence takes the new one without showing "Scope edited".
- The RFI Builder's note ("Adobe licenses this proposal includes") follows the catalog, so it says "A Brand Visibility license".
- Checks: `sow/qa/check_product_copy.py` gains the two rules; the suites that quote the old sentences are updated on purpose and
  listed; everything else must pass unchanged. Then `sow/site/` is rebuilt and zipped for Proto.

## Not touched

- Adobe's own page titles and links (for example "Sites Optimizer Trial").
- The CJA upgrade service ("Adobe Analytics upgrade to CJA") and every Adobe Analytics mention that is not about Brand Visibility.
