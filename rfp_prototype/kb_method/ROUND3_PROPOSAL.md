# Round 3 of the method knowledge base: proposed, waiting for Adam (Nov 13 2026)

Round 2 took the answers written with no AI from 3.7 to 4.6 out of 10 (the AI: 7.5; today's catalog: 2.7), measured blind by
twelve judges on three RFIs, one of them written by ChatGPT and never tuned on (`README.md`). These are the next steps the judges,
the accuracy audit and that holdout RFI point to, most valuable first. Nothing here is built.

## 1. Fill the catalog gaps the holdout RFI found (changes the catalog, so also the live tool's services)

Vennor Quay asked for work the catalog has no service for, so 8 of its 18 implementation questions got no draft without AI, and
the AI had to write those answers from nothing. Proposed new services, each researched on Adobe's pages with its method entry and
phrases, as with step 85 (hours are our estimates for you to review):
- AEM Sites: page review and approval workflow (publish requests, approvers, an urgent-correction path, the record of who
  approved);
- AEM Sites: language copies and local corrections across markets (live copies that keep a local change when the central page is
  updated), for sites not on Edge Delivery;
- AEM Sites: product data from a nightly ERP or PIM file onto product pages, with checks for late or conflicting files;
- AEM Assets: document metadata and search for model, revision and language, expiry of withdrawn documents, and replacing a
  document everywhere it is used;
- Marketo Engage: moving email programmes, subscription preferences and suppression lists from another email platform;
- and the one flagged since Nov 12: moving a non-AEM site's content into AEM Sites (Tallgrass A.3, Vennor A.1).

## 2. Make the no-AI answers fit the client better (the no-AI writer only)

From the judges' notes and 36 audit misfits:
- **Options the RFI has settled.** Where a step offers choices ("Adobe's managed CDN or your own", "Power BI, Tableau or Looker",
  "Salesforce or Dynamics") and the RFI names one, keep only that one.
- **Edge Delivery go-live.** In an RFI on Edge Delivery Services, use the Edge Delivery launch service, not the AEM as a Cloud
  Service go-live steps (Dispatcher validation, stage sizing), which do not apply to it.
- **"You told us".** Keep it only when it carries a fact about the client; never repeat the question or its instructions (judges
  marked down echoes the answer then ignored).
- **The client's dates.** Place the work on the RFI's own calendar ("before the first market's release on 2 August 2027") instead
  of "during the build".
- **Wrong services still leading** on the insurer RFI (C.1 Brand Visibility measurement, D.1 CJA across channels): more phrases
  or a topic for each.

## 3. Catalog accuracy items the audit confirmed (changes live text)

- The AEM Sites play pairs author training on the Universal Editor (SI05) with a Core Components build (SI02); Adobe's editor
  comparison recommends the Page Editor for Core Components sites and lists the Universal Editor as unavailable there. First
  flagged in step 67.
- The same fixes as the knowledge base where the catalog carries the same words (the BI extension permission, its 30-day default,
  weekly log reviews, Cloud Manager profiles first).

## 4. The live AI writer: no unfilled placeholders (a worker change, then a deploy)

The live AI answers left three bracketed fields the judges marked down: "[NAMED ACCESSIBILITY REVIEWER]", "[SERVICE LEVEL
SCHEDULE]" (Vennor E.1, E.5) and "[SUPPORT HOURS AND RESPONSE TIMES]" (insurer F.3). Step 90 bans a bracketed field for hours
only. Proposed: the writer's rule covers every bracketed field ("a named reviewer on your team"), and the page removes any that
come back.

## 5. Your call: a client that already runs a product

Your rule from step 87 is to answer as if no one owns the products, so a client already running Marketo Engage still gets the
instance setup. The insurer's judges marked that down ("256 hours to set up a Marketo instance the client already runs"). Keep the
rule, or let the RFI's own words ("we use Marketo Engage today") leave the setup out?

## 6. When partners see these answers

The knowledge-base answers beat today's catalog answers on every RFI (4.6 against 2.7). Today partners see the catalog answers until
they click Build with Adobe RFI Agent. Switching what they see is your decision, whenever you are ready.
