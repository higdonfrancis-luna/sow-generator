# Catalog expansion map: research brief (Nov 10 2026)

Adam's ask (Nov 10): take the catalog "to the next level" with the Adobe products it is missing (Experience Manager and
Experience Platform families, GenStudio, creative, documents). The plays on the front page stay as they are (the four Brand
Visibility plays, Brand Visibility on its own, Coworker on its own); new products go into the Create your own play picker and
the RFI Builder. The CRO's ask was to sell more Brand Visibility, so each product's tie to Brand Visibility is looked for first.

This pass is **map level only**: what each product is, whether Adobe documents a connection to Brand Visibility, and which
products already in the catalog Adobe documents it connecting to. No service lines and no hours yet (those come wave by wave).

## Products already in the catalog (ids)

`bv` Brand Visibility, `so` Sites Optimizer, `eds` Edge Delivery Services, `aemsites` AEM Sites, `aemassets` AEM Assets,
`commerce` Adobe Commerce, `bc` Brand Concierge, `cw` Coworker (CX Enterprise Coworker), `cja` Customer Journey Analytics,
`rtcdp` Real-Time CDP, `ajo` Journey Optimizer, `target` Target, `marketo` Marketo Engage, `workfront` Workfront.

Researched on Oct 30, not on the canvas yet (see `../portal_omnichannel_b2b.md`, `../portal_acquisition_insights.md`):
`ca` Content Analytics, `xa` Journey Optimizer Experimentation Accelerator, `ajob2b` Journey Optimizer B2B Edition,
`collab` Real-Time CDP Collaboration, `mmm` Mix Modeler (now Marketing Campaign Analytics), `gspm` GenStudio for Performance Marketing.

## Rules

1. **Sources.** Adobe's public documentation: experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com, www.aem.live.
   For Frame.io and Semrush their own help or developer sites count, marked as the vendor's own site.
2. **Blocked hosts.** business.adobe.com and www.adobe.com cannot be read from this session. Never work around a block: no
   changed User-Agent or headers, no proxies, no caches or archive copies. Note the page as not read and move on.
3. **Documented means described.** A connection is documented only when an Adobe page describes the integration between the
   two products by name (what moves, or what the user sets up). Two products sitting on the same platform, or both appearing
   in one marketing list, is not a connection. Do not infer.
4. **Every claim carries a URL and a verbatim quote** (about 8 to 40 words). Verify each quote yourself: download the page with
   `curl -sS -m 40 <url>` (Experience League and helpx serve the text in the HTML), strip tags, collapse whitespace, and
   confirm the exact string is there. Set `"verified": true` only then. A quote seen only through a WebFetch summary is
   `"verified": false`.
5. **Look for the Brand Visibility tie first** for every product (search the product's docs for "Brand Visibility" and
   "LLM Optimizer", its earlier name, and search the Brand Visibility docs for the product). Record `documented: false` with the
   searches run when nothing is found. A "no" is a useful answer.
6. **Lifecycle matters.** Note a rename, an announced end of life, a product folded into another, or regional limits, with the
   source. Keep Adobe's own words in the quote.
7. **No em dashes** anywhere in what you write.
8. **Write only inside this folder** (`sow/canvas/research/expansion_2026-11-10/`): your one JSON file and nothing else. Do not
   edit any other file in the repo, do not commit, do not push.
9. **Time box.** Map level: roughly ten minutes a product. Stop at what Adobe documents; do not design services.

## Output: one JSON file per family

```json
{
  "checked": "2026-11-10",
  "family": "aem_documents",
  "products": [
    {
      "id": "aemforms",
      "name": "the current official name",
      "docs": "URL of the product's documentation home",
      "what": {"text": "one plain sentence, our words", "url": "...", "quote": "...", "verified": true},
      "status": "current | renamed | end of life announced | part of another product | not found",
      "status_note": "plain words, empty when current",
      "status_source": {"url": "...", "quote": "...", "verified": true},
      "bv": {"documented": false, "how": "", "url": "", "quote": "", "verified": false},
      "connections": [
        {"to": "aemsites", "to_name": "AEM Sites", "how": "one plain sentence: what moves or what is set up",
         "kind": "built-in integration | connector or API | shared setup | tutorial only",
         "url": "...", "quote": "...", "verified": true}
      ],
      "checked_not_documented": ["cja", "marketo"],
      "searches": ["the searches you ran"],
      "notes": ["anything a partner or Adam should know, each with its source URL"]
    }
  ],
  "pages_not_read": [{"url": "...", "why": "..."}]
}
```

`to` may be a catalog id, one of the six researched ids, or another product in this expansion (use a short id of your own
and give `to_name`). List in `checked_not_documented` every catalog product you looked for and found nothing on.
