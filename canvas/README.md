# Build canvas (prototype)

A clickable prototype of the SOW tool's proposed first tab, **Build** (Adam's idea, Oct 30 2026; concept and mockups in `../CANVAS_CONCEPT.md`). Partners add products to a canvas, the products connect themselves, and hovering a product or the **i** on a connection shows its services. Each line has an X to take it out and a check to bring it back, and the total at the top right follows every change.

This is a separate page. The live tool (`../index.html`, abvsow.netlify.app) is untouched.

## Files

| File | What it is |
|---|---|
| `index.html` | The built prototype: one self-contained page, with fonts, logo and catalog inlined. Open it in any browser. |
| `template.html` | The page source. Edit this, not `index.html`. |
| `catalog_map.json` | Hand-kept map: products (name, group, grid position), connections (which two products, how they connect, the source, the route of the line), which service lines belong to each and which are on by default, and the four plays. |
| `research/*.json`, `research/*.md` | Services researched from Adobe's public docs, each line with its page and a short quote, plus the research trail (searches run, pages read). |
| `build.py` | Merges the live tool's catalog, the map and the research into `catalog.json`, then writes `index.html`. |
| `catalog.json` | The merged catalog the page uses (built; don't edit). |
| `test_canvas.js` | The click test (✅/❌). |

```
python3 sow/canvas/build.py        # after any change to the map, the research or the template
node sow/canvas/test_canvas.js     # must end with ALL CANVAS CHECKS PASSED
```

## Where the services data lives (Adam's question, Oct 30)

**A JSON catalog in this repo, inlined into the page when it's built. No Worker or D1 for now.**

- **One source of truth with the live tool.** Lines the live SOW tool already has (L01, C01, A01 and so on) are read from its own catalog, so names, hours and sources can't drift apart. The test proves it: each of the four plays on the canvas totals exactly what the live tool gives for that play.
- **Every line carries its source.** A line without an Adobe source is left out of the build (today only X01, Executive alignment workshops, which has none in the live tool). When someone at Adobe asks where a service came from, the card links straight to the page, and `research/*.md` shows the searches and quotes behind it.
- **Changes are reviewed and kept.** Every edit to the catalog is a Git commit with a note, which is the audit trail. Nothing is written from the page.
- **Private, free, and fast.** The page needs no server, nothing a partner types leaves their browser, and it works offline.
- **When to move to a Worker and D1:** if people outside this repo need to propose or edit services through a form (for example, product teams answering "tell me what the services should be"), if the catalog grows past a few thousand lines, or if usage tracking is wanted. The JSON shape here would load into D1 tables as is: products, connections and lines.

## Data model

- **Product:** `id`, `name`, `group` (the Add product menu), `pos` ([column, row] on the grid), `lines` (on by default), `more` (optional, under "More services").
- **Connection:** `id`, `a`, `b` (two product ids), `how` (one sentence on how they connect) plus its `source`, `route` (how the line is drawn: `h`, `v`, `over` or `under`), `lines`, `more`. Many connections can meet at one product. CJA, for example, takes Brand Visibility, Coworker, Real-Time CDP, Journey Optimizer and Target, each with its own line, **i** and services.
- **Line:** `name`, `unit` (one-time or monthly), `low`, `base` and `high` hours (Small, Typical, Large), `url` and `src` (its source), and `origin` (`sow` for lines from the live tool, `research` for new ones). Hours are estimates; Adobe publishes none.
- A line belongs to exactly one product or connection. Connection lines count only when both products are on the canvas.

## How the canvas behaves

- Only product names and **i** dots show on the canvas. Services, hours and fees appear only in the hover cards.
- Hover shows a card; clicking keeps it open. In the card, X takes a line out (it shows Removed and the check brings it back), More services adds optional lines, and every source link opens Adobe's page.
- Removing a product takes its services and its connections' services out of the total. Adding it back restores them as they were left, which is the "one list underneath" rule in `../CANVAS_CONCEPT.md`.
- Rate and customer size sit at the top, and the total (year one, with one-time and monthly) on the right.
- Start from a play adds that play's products. Start over clears the canvas but keeps the rate and size.
- The other tabs (Scope, Services, Statement of work) are placeholders in this prototype.

## Adding services

1. Research the product or connection from Experience League first, then other Adobe pages. Record each line's page and a short quote.
2. Add it to a file in `research/`, in the same shape as `research/cja_hub.json`, or add an existing live-tool line id to the right product or connection in `catalog_map.json`.
3. Give a new product a free grid position in `catalog_map.json`, and give each new connection a route.
4. Run the build and the test.
