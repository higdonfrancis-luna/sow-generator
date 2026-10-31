# Create your own play: five ways to handle many lines (Oct 31 2026)

Adam (Oct 31): the picker gets seven cards, the six plays from the live SOW tool plus **Create your own play**, the free canvas from Oct 30. On a big custom build the lines turn into spaghetti ("we'll have to work through that"). Five designers each mocked up one approach on the real catalog (20 products, 57 documented connections), and two judges scored them: one with Adam's eyes (pictures, readability, his rules), one with the builder's eyes (effort, risk, tests). Nothing here is built.

Baselines, today's router: `baseline_8.png` (8 products, 15 lines, about 12 crossings) and `baseline_20.png` (20 products, 57 lines, hundreds of crossings). The eight-product set is Real-Time CDP, Journey Optimizer, CJA, Content Analytics, Brand Visibility, Adobe Commerce, AEM Sites and AEM Assets.

| Option | Files | What it does | Adam's eyes | Builder's eyes |
|---|---|---|---|---|
| Focus view | `focus_*.png` | On a busy canvas each box shows its connection count; pointing at or clicking a product draws only its lines and i dots and names what it connects to in a bar. Under 10 connections every line draws as today. | 30, first | 31, first |
| Small builds only | `cap_*.png` | Up to five products, a lead product, and an Add product menu that lists connected products first ("Connects to 2 on your canvas"). | 27 | 21 |
| Connections list | `panel_*.png` | Boxes only; a list on the right names every connection; pointing at a row draws that one line. | 26 | 23 |
| Grid view | `matrix_*.png` | A Canvas and Grid switch; the grid has a cell for each pair with an i and its dollars. | 25 | 24 |
| Arrange for me | `autolayout_*.png` | Every line shows; the canvas places the products itself to cut crossings. | 23 | 20 |

Scores are out of 40 (clarity at 8 products, clarity at 20, fits the look, effort).

## Recommendation (both judges agree)

1. **Small builds keep every line**, exactly as today. All six launched plays stay pixel for pixel the same.
2. **Big builds switch to Focus view** (at 10 connections, usually six or more products). Each box says how many connections it has; pointing at or clicking a product draws just its lines, with 0 crossings in all 28 product views checked (at most 6 lines on the eight-product set, 12 on all 20). The total always counts every connection, shown or not.
3. **The Add product menu from Small builds, without the five-product limit**: products that connect to the canvas come first, each tagged "Connects to N on your canvas", and pointing at one outlines what it would join. Mockup without the limit: `../custom_add_menu.png`.

Why not the others: a five-product limit splits the eight-product build into two SOWs and drops 6 connections ($56,400 at $150, Typical) from both; Arrange for me is still spaghetti at 20 (76 crossings), adds about 690 lines of code and freezes the page about 2.3 seconds; the Connections list is a long scroll at 20 and, as built, changed the six launched plays; the Grid view is a new chart to learn and puts fees on the canvas, against the names-only rule.

Build order, after Adam's yes: Focus view first, then the menu. Fix before handing back: the focus bar on a phone (its name tags spill below it), and on a 20-product canvas Journey Optimizer's card covers some of its i dots until the pointer leaves.

The pictures to show Adam: `../custom_focus_8_rest.png`, `../custom_focus_8_cja.png`, `../custom_focus_20_cja.png`, `../custom_add_menu.png`.

## Sources

`src/` keeps the designers' code for the build: `focus_patch.py` (Focus view as anchored edits to the prototype; written against a scratch build that had "Eight products" and "All products" plays), and `add_menu_ui.js`, `add_menu.css`, `add_menu_shot.js` (the Add product menu from Small builds). They ran against scratch copies, not the repo, so expect to adapt paths and anchors.
