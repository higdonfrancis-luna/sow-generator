# Six services for the catalog gaps the holdout RFI found (Nov 13 2026)

Adam (Nov 13): "yes, build 1 and 2", item 1 of `sow/rfp_prototype/kb_method/ROUND3_PROPOSAL.md`: the test RFI written by ChatGPT
(Vennor Quay Motionworks, `sow/rfp_prototype/kb_method/chatgpt_round2/test_rfi.txt`) asked for work the partner's catalog has no
service for, so 8 of its 18 implementation questions got no draft without AI. Each new service is researched on Adobe's public
pages, checked by a second reader, and written the way step 85's Adobe Commerce services were
(`sow/canvas/research/commerce_2026-11-12/commerce_services.json` and its `STEP85.md` are the standard to match). Hours are our
estimates; Adam reviews them before anything is uploaded.

## The services

| Id | Product | Service | The RFI asks it answers |
|---|---|---|---|
| SI07 | AEM Sites | Page review and approval workflow | "How would authors and reviewers approve a page before it goes live? Include the treatment of safety wording, an urgent correction outside office hours and evidence showing who approved the published version." |
| SI08 | AEM Sites | Language copies and local corrections across markets | "Explain how our three language versions would be maintained across five markets. Show how a shared product page could receive a local correction without losing that correction when the central team publishes a later update." (for sites not on Edge Delivery Services; AXD03 covers Edge Delivery) |
| SI09 | AEM Sites | Product data from ERP or PIM files onto product pages | "Describe how nightly ERP specification files would reach product pages without exposing trade pricing or stock data. Explain what happens when a file is late, incomplete or contains a value that conflicts with an approved manual." |
| SI10 | AEM Sites | Content migration from another CMS into AEM Sites | "Describe how you would move our public websites from Drupal to AEM Sites, including how you would decide which pages to retain, merge or retire and demonstrate that retained content and inbound links survived the move." (for sites not on Edge Delivery Services; A02 covers Edge Delivery, SI03 covers moving off an older AEM) |
| AS07 | AEM Assets | Document versions, expiry and replacement on published pages | "Explain how an approved replacement document would reach every public page that uses it. Include how editors would preview the replacement, find affected pages and recover the previous document if the replacement is wrong." and "verify that a withdrawn safety certificate cannot still be selected for a new web page" (AS02 already covers folders, tags and metadata forms) |
| MK07 | Marketo Engage | Email program and preference migration from another platform | "Describe the migration of our active email programmes, subscription choices and suppression records into Marketo Engage. How would you settle conflicting preferences and prove that the first migrated campaign excludes people who should not receive it?" |

The questions are examples of the asks; write each service for any client that needs that work, not for Vennor Quay.

## Write, per service, `sow/canvas/research/gaps_2026-11-13/<ID>.json`

```
{"id": "SI07", "owner": "aemsites",
 "name": "...",                        a short service name, as the catalog's names read (sow/canvas/catalog.json lines)
 "unit": "one-time" | "monthly",
 "scope": "...",                       what the partner does, 1 to 3 sentences, in the catalog's voice ("your client")
 "evidence": "...", "source_url": "...", "source_title": "...",   the main Adobe quote, word for word, and its page
 "other_pages": [{"url": "...", "title": "...", "quote": "..."}],  2 to 5 more quotes that carry the scope's Adobe facts
 "low": n, "base": n, "high": n, "hours_reasoning": "...",       our estimate, set beside the catalog's comparable services
 "ext": "...", "tier": "...",          what else the client must license or provide, if anything (empty when nothing)
 "notes": "...",                       for Adam: which forms of the product the pages cover, overlaps and boundaries
 "method": {"steps": [...], "deliverables": [...], "asks": [...], "risk": "...", "outcome": "...", "kind": "task" | "workstream", "phase": "..."},
 "phrases": [...],                     6 to 10 short phrases (2 to 8 words) an RFI uses when it asks for this work
 "checker_changes": []                 left empty by the writer; the checker records what it changed
}
```

## The rules

1. **Every Adobe fact is quoted.** The scope and the method's steps name only Adobe features, settings, limits and numbers that
   the evidence or the other pages carry. Fetch each page with curl (follow redirects, a browser-style User-Agent) and copy each
   quote word for word. Pages: experienceleague.adobe.com, www.aem.live, developer.adobe.com, helpx.adobe.com.
2. **The method** follows `sow/rfp_prototype/kb_method/BRIEF.md` exactly (the client's voice: "we" the partner, "you" the
   client; steps start with a verb; 3 to 6 steps by hours; 2 to 5 deliverables; up to 3 asks; lengths; no hours or prices in the
   text), with `examples.json` beside it as the standard.
3. **Everything is available** (Adam's rule 12): never a beta, early access, limited availability or coming-soon label, a
   release date, "confirm with Adobe" or "not stated by Adobe"; never hold a feature back for such a label. A license or add-on
   the client must own is a prerequisite and goes in `ext` or `tier`.
4. **Plain words**: no em dashes or en dashes, no marketing words (seamless, robust, cutting-edge, world-class, best-in-class,
   leverage, unlock, empower, streamline, synergy), no promise of results beyond the work.
5. **No overlap**: read the product's existing services in `sow/canvas/catalog.json` and the knowledge base's entries in
   `sow/rfp_method.json`; the new service does what none of them does, and `notes` says where its boundary with each neighbour is.
6. **Hours**: low, typical and high for a mid-size client, set beside two or three comparable services in the catalog and said so
   in `hours_reasoning`.
