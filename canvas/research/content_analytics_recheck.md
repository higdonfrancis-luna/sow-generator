# Content Analytics re-check (Oct 31 2026)

Adam (Oct 31) thought Content Analytics might connect to the other products in Omnichannel Content Activation and that the Oct 30 search might have missed it. Five researchers each took one pair and tried to find what the first search missed. Data file: `content_analytics_recheck.json` (summaries, every quote with its page, near misses, what was searched).

## Result

| Pair | Documented by Adobe? |
|---|---|
| Content Analytics + AEM Sites | No |
| Content Analytics + AEM Assets | No |
| Content Analytics + Journey Optimizer | No |
| Content Analytics + Experimentation Accelerator | No |
| Content Analytics + Edge Delivery Services | No |

## What the researchers found

- **Content Analytics measures any website and any DAM the same way.** It goes on a site through a Tags property or its JavaScript library, and its featurization service reads each page and image by URL. Adobe's own webinar: "it works with any CMS or digital asset management platform." So it works on an AEM Sites or Edge Delivery site, and with images served from AEM Assets, but no data passes between the products and neither product's docs names the other.
- **Journey Optimizer only through CJA.** Content Analytics adds dimensions and metrics to a CJA data view; CJA can publish audiences to Experience Platform; Journey Optimizer can use them in a journey. Adobe documents each step separately and never names Content Analytics audiences in Journey Optimizer.
- **Edge Delivery, in code only.** Adobe's Content Analytics JavaScript library (github.com/adobe/content-analytics) recognizes Edge Delivery's experimentation variants and credits content to the variant the visitor saw. No Adobe page describes it.
- **Experimentation Accelerator** takes experiments only from Journey Optimizer and Target and uses its own AI on each treatment; it does not use Content Analytics.
- **Licensing (off-pair):** the CJA product description says "As of February 2026, Adobe Content Analytics is no longer available to be licensed as an Add-on to Customer Journey Analytics and is ineligible for renewal for any future Sales Order." The Standalone configuration page: "Content Analytics is licensed as a standalone product, but the configuration happens within Experience Platform and Customer Journey Analytics."
- **One page this container could not read:** business.adobe.com's AEM Sites Content insights page (https://business.adobe.com/products/experience-manager/sites/content-insights.html). Search snippets describe AI attribute-level insights; one researcher judged it AEM's older Content Insight reporting (fed by Adobe Analytics), another suggested Adam open it to see whether it names Content Analytics.

## For the canvas

- Keep Content Analytics connected only where Adobe documents it: CJA, Real-Time CDP, Marketing Campaign Analytics and GenStudio for Performance Marketing.
- The Content Analytics card could say it measures any site, AEM included, citing the webinar line, without drawing a connection.
