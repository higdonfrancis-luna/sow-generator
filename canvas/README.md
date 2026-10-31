# Build canvas (prototype)

A clickable prototype of the SOW tool's proposed first tab, **Build** (Adam's idea, Oct 30 2026; concept and mockups in `../CANVAS_CONCEPT.md`). Partners choose one of ten plays, the play puts its products on the canvas already connected, and hovering a product or the **i** on a connection shows its services (play picker built Oct 31; screenshots `../mockups/play_picker_built.png`, `play_omnichannel_built.png`, `play_acquisition_built.png`). Each line has an X to take it out and a check to bring it back, and the total at the top right follows every change.

This is a separate page. The live tool (`../index.html`, abvsow.netlify.app) is untouched.

## Files

| File | What it is |
|---|---|
| `index.html` | The built prototype: one self-contained page, with fonts, logo and catalog inlined. Open it in any browser. |
| `template.html` | The page source. Edit this, not `index.html`. |
| `catalog_map.json` | Hand-kept map: products (name, title, short name), connections (which two products, how they connect, the source), which service lines belong to each and which are on by default, and the ten plays (section, label, subtitle, each product's place on the grid, optional lines a play turns on). |
| `research/*.json`, `research/*.md` (`cja_hub`, `connections_value`, `connections_more`: 19 more pairs among the ten products; `marketo_workfront`: two products and 11 connections; `portal_omnichannel_b2b` and `portal_acquisition_insights`: the partner portal plays' eight products and their connections) | Services researched from Adobe's public docs, each line with its page and a short quote, plus the research trail (searches run, pages read). |
| `build.py` | Merges the live tool's catalog, the map and the research into `catalog.json`, then writes `index.html`. |
| `catalog.json` | The merged catalog the page uses (built; don't edit). |
| `test_canvas.js` | The click test (✅/❌). |

```
python3 sow/canvas/build.py        # after any change to the map, the research or the template
node sow/canvas/test_canvas.js     # must end with ALL CANVAS CHECKS PASSED
```

## Where the services data lives (Adam's question, Oct 30)

**A JSON catalog in this repo, inlined into the page when it's built. No Worker or D1 for now.**

- **One source of truth with the live tool.** Lines the live SOW tool already has (L01, C01, A01 and so on) are read from its own catalog, so names, hours and sources can't drift apart. The test proves it: the four Brand Visibility plays and the two solo plays each total exactly what the live tool gives.
- **Every line carries its source.** A line without an Adobe source is left out of the build (today only X01, Executive alignment workshops, which has none in the live tool). When someone at Adobe asks where a service came from, the card links straight to the page, and `research/*.md` shows the searches and quotes behind it.
- **Changes are reviewed and kept.** Every edit to the catalog is a Git commit with a note, which is the audit trail. Nothing is written from the page.
- **Private, free, and fast.** The page needs no server, nothing a partner types leaves their browser, and it works offline.
- **When to move to a Worker and D1:** if people outside this repo need to propose or edit services through a form (for example, product teams answering "tell me what the services should be"), if the catalog grows past a few thousand lines, or if usage tracking is wanted. The JSON shape here would load into D1 tables as is: products, connections and lines.

## Data model

- **Product:** `id`, `name` (on the canvas), `title` (optional, the card heading), `short` (optional, chips and flows), `lines` (on by default), `more` (optional, under "More services").
- **Play:** `id` (the six shared with the live tool use its ids), `section` (Brand Visibility plays, Sell on its own, Adobe sales plays), `label`, `sub`, `pos` (each product's [column, row]; halves are fine), `products`, and optionally `on` (optional lines this play starts with: Brand Visibility on its own turns on C05, as the live tool does). A product shows only if a play has it, and a connection only if one play has both its products; Target, Marketo Engage and Workfront are in no play, so they and their connections are left out of the build but keep their research.
- **Connection:** `id`, `a`, `b` (two product ids), `how` (one sentence on how they connect) plus its `source`, `lines`, `more`. Many connections can meet at one product, each with its own line, **i** and services. Lines route themselves from the play's places.
- **Line:** `name`, `unit` (one-time or monthly), `low`, `base` and `high` hours (Small, Typical, Large), `url` and `src` (its source), and `origin` (`sow` for lines from the live tool, `research` for new ones). Hours are estimates; Adobe publishes none.
- A line belongs to exactly one product or connection. Connection lines count only when both products are on the canvas.
- A connection can also carry `gain` (what you get together: a headline and a sentence) and `flows` (one per direction: `from`, `to`, `what`, `source`, and optionally `needs`). The card shows them above the services, and the hovered line gets an arrow at each end data flows to.
- A connection Adobe documents but lists no services for carries `no_services: true` (today: Journey Optimizer + Brand Concierge). It still needs `how`, `gain`, `flows` and a source; its **i** says Experience League lists no services and points to adding your own on the Services tab.
- Routing: neighbors get a straight or curved line, and anything farther runs through the gaps between columns and rows, with lanes so lines in one gap stay apart. The **i** moves along its line until it clears products and other **i** dots.
- A line can carry `needs` (product ids). It counts only when those products are in the play; otherwise its card says the product is not in this play. The build leaves out a line whose needs no play can meet (today XC12, CIF to Edge Delivery transition plan, which needs Edge Delivery Services, not in B2B Commerce).

## How the canvas behaves

- Only product names and **i** dots show on the canvas. Services, hours and fees appear only in the hover cards.
- Hover shows a card; clicking keeps it open. In the card, X takes a line out (it shows Removed and the check brings it back), More services adds optional lines, and every source link opens Adobe's page.
- It opens on the play picker: ten cards in three groups (Brand Visibility plays, Sell on its own, Adobe sales plays from the partner portal), each with its product chips, and the line "One play per statement of work. To quote a second play, start a second SOW." The red Choose a play button in the toolbar lists the same plays.
- A play's products land in its own hand-laid places. Partners toggle services but can't add or remove products.
- The toolbar then shows the play's name and Change play. Change play asks first, then clears the canvas and every service choice and opens the picker; rate and size stay. Start over does the same.
- Rate and customer size sit at the top, and the total (year one, with one-time and monthly) on the right.
- The other tabs (Scope, Services, Statement of work) are placeholders in this prototype.

## Adding services

1. Research the product or connection from Experience League first, then other Adobe pages. Record each line's page and a short quote.
2. Add it to a file in `research/`, in the same shape as `research/cja_hub.json`, or add an existing live-tool line id to the right product or connection in `catalog_map.json`.
3. Give a new product a free grid position in `catalog_map.json`, and give each new connection a route.
4. Run the build and the test.
