# Wave 3, data, campaign and documents: proposal for Adam's yes (Nov 10 2026)

Nothing is built. The picture is `sow/mockups/nov10_wave3/wave3_cards.png`: real cards, drawn on a scratch copy of the tool
with this research (`node sow/mockups/nov10_wave3/wave3_mock.js <scratch canvas folder>`).

## What it would add

Eight products on Create your own play and in the RFI Builder. The six plays on the front page stay as they are.

| Product | Services | Starting | Optional | Menu heading |
|---|---|---|---|---|
| Adobe Analytics | 8 | 6 | 2 | Data & analytics |
| Audience Manager | 7 | 5 | 2 | Data & analytics |
| Adobe Campaign (written for v8) | 8 | 6 | 2 | Campaign management |
| Adobe Advertising | 8 | 5 | 3 | Campaign management |
| Marketo Measure | 8 | 7 | 1 | Campaign management |
| AEM Guides | 10 | 7 | 3 | Content & workflows |
| Acrobat and Acrobat Services | 12 | 3 | 9 | Document productivity (new) |
| Acrobat Sign | 14 | 6 | 8 | Document productivity (new) |

75 product services and 81 connection services across 49 connections. The catalog would go from 28 Adobe products, 124
connections and 406 services to 36, 173 and 562.

569 quotes were checked word for word on Adobe's pages on Nov 10 (`wave1/verify_wave1.py` on the three files: 170, 232
and 167 found, 0 not found). The trails are `data_analytics.md`, `campaign_advertising.md` and `documents.md`. Hours are
our own estimates for a mid-market client; Adobe publishes none.

Brand Visibility has no line to Adobe Analytics, as you decided, and none of the eight connects to Brand Visibility.

## Questions, each with a recommendation

1. **Audience Manager.** Adobe gives no end date ("There are no plans to modify the current Audience Manager Data
   Management Platform") and publishes a guide for moving its segments to Real-Time CDP. **Recommend: one box, written for
   clients who already run it** (health check, cleanup, monthly operations), with the move on the Audience Manager +
   Real-Time CDP card. No card says it is ending, and the tool sells no new Audience Manager rollout.
2. **Adobe Campaign.** Adobe calls v8 its "strategic platform"; Classic v7 has a support end date and Standard clients are
   "eligible to transition". **Recommend: one box written for v8,** with one optional service for a client still on Classic
   or Standard. No card carries a support date.
3. **Marketo Measure.** Its release notes stop at 2024, and there is no path from the older tiers to Ultimate. Adobe states
   no end of life. **Recommend: one box, and ask the Marketo team whether it is still sold to new customers before it is
   built.** It can wait a build without holding the other seven.
4. **Three Coworker cards to hold or keep.** Coworker + Campaign is documented but Campaign is on neither of Adobe's lists
   of Coworker applications. Coworker in AEM Guides shows no beta label on its pages, but Adobe's legal notice still calls
   the Guides assistant "the Beta". Coworker + Adobe Analytics is documented plainly. **Recommend: keep Analytics, hold
   Campaign and AEM Guides** until the Coworker product team answers (it joins the open Workfront question).
5. **Adobe Advertising is largely set up by Adobe's own teams** ("Adobe or one of its affiliate agencies works with each
   advertiser"). **Recommend: still a box,** because its Analytics, Customer Journey Analytics and Real-Time CDP
   connections are partner work.
6. **Acrobat as one box** (the apps, which are IT work, and the Acrobat Services APIs, where the partner hours are), with
   three starting services and the API work optional. **Recommend: yes.**
7. **Small calls, all recommended as drawn:**
   - Adobe Analytics + Customer Journey Analytics gets two small services beside the existing upgrade service (CJ03); a
     statement of work picks one route.
   - AEM Forms and Experimentation Accelerator already have a service that needs Adobe Analytics; they get a line to it.
   - The existing AEM Forms e-signature service (AF08) moves onto the new Acrobat Sign + AEM Forms connection.
   - Acrobat Sign + Marketo Engage is shown as a route through the client's CRM.
   - Campaign + Audience Manager is dropped (Adobe documents it for Classic v7 only); Advertising + Audience Manager stays.

## Left out, under your rules

Beta, preview or coming: Coworker inside the Analytics interface, Coworker project migration, ChatGPT conversational ads and
the Advertising AI Assistant, four AEM Guides features Adobe enables on request, the Express AI Assistant in Acrobat, and
what MAX announced for Acrobat in Google Workspace. Ending: Acrobat Sign's embedded Power Automate, the Analytics
Foundation Pack, Audience Manager's Device Co-op, Campaign Classic and Standard as their own boxes. Not connections because
Adobe documents no setup: Adobe Analytics with Content Analytics, Marketing Campaign Analytics or Brand Concierge; Marketo
Measure with Target or Adobe Advertising; Acrobat with Creative Cloud, Frame.io or AEM Assets.

## Flagged

- **business.adobe.com would not load** for any helper (one try each, not worked around). If Adobe states the sales status
  of Audience Manager or Marketo Measure anywhere, it is there.
- **Overlaps a statement of work should settle:** three Adobe Analytics cards each start with the same source connector
  (count it once); Advertising + Customer Journey Analytics beside the existing ad platforms card (the same ad cost could
  arrive twice); Marketo Measure + Real-Time CDP beside Marketo Engage + Real-Time CDP.
- **Adobe switches on much of this wave.** Twelve Campaign and Advertising connections and six Analytics and Audience
  Manager connections carry a statement of work condition ("Adobe confirms ... before this service starts").
- **The canvas.** With 36 products a full canvas would be drawn smaller again (62% today with 28). A fix should be decided
  before this wave is built: a canvas that scrolls at a readable size, or only the clicked product's neighbors shown.

## If yes

One step: the data, a Document productivity heading in the menu, the RFI Builder's names (Adobe Analytics, Campaign,
Audience Manager, Advertising, Marketo Measure, AEM Guides and Acrobat Sign leave its "not in this catalog" list), a test
suite, the as-built picture, every suite and the copy check, a zip for Proto.
