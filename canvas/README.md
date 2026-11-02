# Build canvas (prototype)

A clickable prototype of the SOW tool's proposed first tab, **Build** (Adam's idea, Oct 30 2026; concept and mockups in `../CANVAS_CONCEPT.md`). Partners choose one of seven cards: the six plays of the live SOW tool, which put their products on the canvas already connected, or **Create your own play**, where they add any of 14 products and the products connect themselves where Adobe documents a connection. Hovering a product or the **i** on a connection shows its services. A busy canvas (10 connections or more) switches to focus view: one product's lines at a time. Built Oct 31 (Adam: "Yes, build that"); mockups `../mockups/play_picker_seven.png`, `../mockups/custom_focus_*.png`, `../mockups/custom_add_menu.png`, and the five options weighed in `../mockups/custom_options/`.

This is a separate page. The live tool (`../index.html`, abvsow.netlify.app) is untouched.

## Files

| File | What it is |
|---|---|
| `index.html` | The built prototype: one self-contained page, with fonts, logo and catalog inlined. Open it in any browser. |
| `template.html` | The page source. Edit this, not `index.html`. |
| `catalog_map.json` | Hand-kept map: products (name, title, short name), connections (which two products, how they connect, the source), which service lines belong to each and which are on by default, and the seven plays: the six fixed plays and Create your own play (section, label, subtitle, each product's place on the grid, optional lines a play turns on). |
| `research/*.json`, `research/*.md` (`cja_hub`, `connections_value`, `connections_more`: 19 more pairs among the ten products; `marketo_workfront`: two products and 11 connections; `portal_omnichannel_b2b` and `portal_acquisition_insights`: the partner portal plays' eight products and their connections) | Services researched from Adobe's public docs, each line with its page and a short quote, plus the research trail (searches run, pages read). |
| `build.py` | Merges the live tool's catalog, the map and the research into `catalog.json`, then writes `index.html`. |
| `catalog.json` | The merged catalog the page uses (built; don't edit). |
| `test_canvas.js` | The click test (✅/❌). |
| `patch_picker.py`, `patch_step17.py`, `patch_step18.py`, `patch_step20.py`, `patch_step21.py`, `patch_step22.py`, `patch_step23.py`, `patch_step24.py`, `patch_step25.py` | One-time patches on `template.html`: the masthead-only front page (Nov 1); the canvas shows the engagement the SOW steps hold, with each line's own settings, the services added on Services and the SOW's currency, and an opened draft's play and products (Nov 2); a play can start a line off (`off` in `catalog_map.json`: Commerce without L03, FSI without C04); the canvas hands over on every change, waiting lines keep their choice, the FSI answer sets the starting services, Start over resets the term (step 20); an empty Create your own play hands over too, a tab coming back into view after another changed the tool reloads, names outside FSI read neutrally (`nname` from `build.py`), and your own play starts C04 off (step 21); a play just picked shows starting values, and the canvas hands over only when something changed (step 22); a re-pick keeps the prompt count's bands, every pick hands over afresh, and a page catching up takes no input (step 23); Start over also clears the SOW steps' older storage key (step 24); on phones a line's name and notes take the full row, with the hours, fee and X beneath (step 25). |

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
- **Play:** `id` (the six shared with the live tool use its ids), `section` (Brand Visibility plays, Sell on its own, Build your own), `label`, `sub`, `pos` (each product's [column, row]; halves are fine), `products`, and optionally `on` (optional lines this play starts with: Brand Visibility on its own turns on C05, as the live tool does). A product shows only if a play has it, and a connection only if one play has both its products; Target, Marketo Engage and Workfront are in no play, so they and their connections are left out of the build but keep their research.
- **Create your own play** is the play with `custom: true` (id `custom`, `title` "Your own play" for the toolbar): `products` lists what a partner can add and `pos` gives each its place on a 5 by 4 grid (the Oct 30 places). The canvas packs the chosen products together by dropping empty columns and rows, so a small build sits close and adding a product moves the others as little as possible. It offers 14 products: the 12 researched on Oct 30 (Adam, Oct 31: "Let's go with the 12 for now") plus AEM Sites and AEM Assets, added the same day at Adam's ask with every pairing to the others researched and checked (`research/aem_sites_assets.md`); AEM Sites sits at [3, 2] and AEM Assets at [2, 3]. The other six partner portal products (Content Analytics, Experimentation Accelerator, Journey Optimizer B2B Edition, Real-Time CDP Collaboration, Marketing Campaign Analytics, GenStudio for Performance Marketing) keep their research but stay out until their pairings with the 14 are checked.
- **Connection:** `id`, `a`, `b` (two product ids), `how` (one sentence on how they connect) plus its `source`, `lines`, `more`. Many connections can meet at one product, each with its own line, **i** and services. Lines route themselves from the play's places.
- **Line:** `name`, `unit` (one-time or monthly), `low`, `base` and `high` hours (Small, Typical, Large), `url` and `src` (its source), and `origin` (`sow` for lines from the live tool, `research` for new ones). Hours are estimates; Adobe publishes none.
- A line belongs to exactly one product or connection. Connection lines count only when both products are on the canvas.
- A connection can also carry `gain` (what you get together: a headline and a sentence) and `flows` (one per direction: `from`, `to`, `what`, `source`, and optionally `needs`). The card shows them above the services, and the hovered line gets an arrow at each end data flows to.
- A connection Adobe documents but lists no services for carries `no_services: true` (today: Journey Optimizer + Brand Concierge). It still needs `how`, `gain`, `flows` and a source; its **i** says Experience League lists no services and points to adding your own on the Services tab.
- Routing: neighbors get a straight or curved line, and anything farther runs through the gaps between columns and rows, with lanes so lines in one gap stay apart. The **i** moves along its line until it clears products and other **i** dots.
- A line can carry `needs` (product ids). It counts only when those products are on the canvas. In a fixed play its card says the product is not in this play; in Create your own play the card offers an Add button for the missing product. The build leaves out a line whose needs no play can meet.

## How the canvas behaves

- Only product names and **i** dots show on the canvas. Services, hours and fees appear only in the hover cards.
- Hover shows a card; clicking keeps it open. In the card, X takes a line out (it shows Removed and the check brings it back), More services adds optional lines, and every source link opens Adobe's page.
- It opens on the play picker: seven cards in three groups (Brand Visibility plays, Sell on its own, Build your own), the six plays with their product chips and Create your own play with "14 products to choose from", and the line "One play per statement of work. To quote a second play, start a second SOW." Until a play is picked, only the masthead (the Adobe logo and "Partner services statement of work") sits above the cards: no steps, toolbar or Start over, and no play dropdown; each play is picked from its card (Adam, Nov 1).
- A fixed play's products land in its own hand-laid places. Partners toggle services but can't add or remove products.
- **Create your own play** opens on an empty canvas with the Add product menu open. Before anything is on the canvas, each product says how many of the others it connects to. After that, products that connect to the canvas come first, each tagged "Connects to N on your canvas" (pointing at one names its lines and outlines the products it would join), and the rest wait under "N more do not connect to your canvas yet". The menu stays open to add more. A product card has Remove from canvas; adding the product back restores its services as they were left. Choices are kept in the browser, so a reload keeps the build.
- **Focus view** (from the five options weighed Oct 31, `../mockups/custom_options/README.md`): with 10 connections or more on the canvas, lines hide at rest and each box says how many connections it has. Pointing at a product draws only its lines (a star router, so they don't cross), clicking keeps them, and a bar names what it connects to, with Clear (Escape or a click on the empty canvas also clears). The total always counts every connection. Clicking a product pins its card beside the box (on the side and at the height that cover the fewest of its lines and i dots), so the pointer can reach X, More services and Remove from canvas. The six fixed plays have at most two connections, so they never switch.
- On Create your own play every i dot sits on its own line at the spot farthest from the other lines (the same placement focus view uses); the six fixed plays keep their Oct 30 placement. On a narrow screen the Add product menu stays on screen and doesn't open by itself, and the focus bar wraps its names onto their own row.
- Once a play is picked, the steps (Build, Scope, Services, Statement of work), Start over and the toolbar appear: the play's name and Change play (and Add product on your own play). Change play asks first, then clears the canvas and every service choice and goes back to the cards; rate and size stay. Start over does the same and also clears everything in the SOW steps.
- Your rate and Delivery size sit at the top of the toolbar, and the illustrative fees (implementation plus the monthly fees for the term) on the right.
- Since Oct 31 this page is the site's front page. Save and continue and the Scope, Services and Statement of work tabs hand the play, size, rate and every service line on the canvas to the SOW tool at `sow/` (`../patch_step13.py`); `python3 ../build_site.py` assembles the site.

## Adding services

1. Research the product or connection from Experience League first, then other Adobe pages. Record each line's page and a short quote.
2. Add it to a file in `research/`, in the same shape as `research/cja_hub.json`, or add an existing live-tool line id to the right product or connection in `catalog_map.json`.
3. Give a new product a place in the plays that use it in `catalog_map.json` (and in Create your own play's `pos` if partners can add it).
4. Run the build and the test.
