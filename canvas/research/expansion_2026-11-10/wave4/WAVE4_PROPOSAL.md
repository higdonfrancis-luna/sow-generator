# Wave 4, the Marketo family: proposal for Adam's yes (Nov 10 2026)

Nothing is built. The picture is `sow/mockups/nov10_wave4/wave4_cards.png`: real cards, drawn on a scratch copy of the tool
with this research (`node sow/mockups/nov10_wave4/wave4_mock.js <scratch canvas folder>`).

## What it would add

Two products on Create your own play and in the RFI Builder, under Campaign management beside Marketo Engage and Marketo
Measure. The six plays on the front page stay as they are.

| Product | Services | Starting | Optional |
|---|---|---|---|
| Marketo Qualifier | 8 | 7 | 1 |
| Marketo Optimizer | 13 | 7 | 6 |

Six connections with 16 services: Marketo Qualifier with Marketo Engage, a CRM (Salesforce or Microsoft Dynamics 365) and
Brand Concierge; Marketo Optimizer with Marketo Engage, Coworker and ad platforms. The catalog would go from 32 Adobe
products, 144 connections and 480 services to 34, 150 and 517.

130 quotes were checked word for word on Adobe's pages on Nov 10 (`wave1/verify_wave1.py`: 57 and 73 found, 0 not found).
The trails are `marketo_qualifier.md` and `marketo_optimizer.md`. Hours are our own estimates; Adobe publishes none.
Nothing comes from Adobe's internal seller material.

## Questions, each with a recommendation

1. **Adobe's guide calls the current Marketo Optimizer release a Beta release** (on 11 of its 58 pages, with an "upcoming
   General Availability release"), while Adobe also publishes a product description for it. **Recommend: add it, with no
   label in anything a partner or client reads,** the same call as Firefly Custom Models, and recheck the guide on build day.
2. **Marketo Qualifier + Brand Concierge is documented in the Brand Concierge guide,** not the Qualifier guide (it also
   gives the earlier name, Sales Qualifier). **Recommend: keep it.** It ties Qualifier to the FSI play.
3. **Coworker is built into Marketo Optimizer.** **Recommend: show it as a connection,** as Coworker with Marketo Engage is
   shown today.
4. **What must a client own first?** Optimizer's pages assume one connected Marketo Engage instance; Qualifier's say it
   "supports Marketo Engage and Marketo Optimizer" and state no license rule. **Recommend: Optimizer's card lists a Marketo
   Engage subscription first; Qualifier's card says nothing about what it is sold with.** Ask the product team once.
5. **No line between Qualifier and Optimizer.** Adobe says they can be used together but documents no setup.
   **Recommend: no line.**

## Left out, under Adam's rules

Qualifier: Smart audience (Beta), Google mail and calendar (named once, only Outlook is documented), the Outlook email
plugin (named, not documented). Optimizer: Scoring Studio (under Labs), the AEM Assets, Content Fragments and Express
integrations ("planned for a future release"), Coworker commands marked "Coming soon", and 14 smaller items, each with
Adobe's words in the JSON.

## Flagged

- Adobe says Marketo Optimizer is "not HIPAA compliant and not HIPAA-ready"; it is a prerequisite on the card.
- Two places where Adobe's Qualifier pages disagree with each other (what it writes to the CRM; whether email is sent
  before approval). The cards promise neither side.
- Optimizer's first service overlaps in part with Journey Optimizer B2B Edition's access service if both are on one canvas.

## If yes

One step: the data, the two places on the canvas, the menu, the RFI Builder's names, a test suite, the as-built picture,
every suite and the copy check, a zip for Proto.
