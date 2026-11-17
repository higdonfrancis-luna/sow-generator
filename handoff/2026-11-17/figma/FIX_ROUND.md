# Figma connects to four more Adobe products: fix round result (Nov 17, 2026)

Nothing is committed or pushed. The change sits, built, in the worktree
`/home/user/sow-generator/.claude/worktrees/agent-a115982e122ed319d`, on top of `1be5fa5`
(the tip of `origin/claude/zealous-edison-oko1nm`; `4c34da0` is `main`, which has no handoff folder).

## Files here

- `apply_figma.py`: re-applies the whole change by content, fixes included. `python3 apply_figma.py <checkout>` (it builds twice).
  It is the interrupted round-1 script, finished, with every claim cut back to quotes in `quotes_verified.json`.
- `figma.patch`: `git diff` against `1be5fa5` for the source files, the four new files and the root `index.html`
  (the build also writes product copy into that file, so its lines are long and the patch is 2.4 MB).
  It leaves out the build outputs `canvas/catalog.json`, `canvas/index.html`, `rfp_method.json` and `site/`:
  run `python3 canvas/build.py` and `python3 build_site.py` twice after applying it.
- Pictures, all at 2x:
  - `0_canvas_figma_four_lines.png`: Create your own play with the four products and Figma, four new lines.
  - `0_menu_figma_tag.png`: Figma in the Add outside system menu, its tag on three lines inside rounded corners.
  - `1_card_figma-aemassets.png`, `2_card_figma-gspm.png`, `3_card_figma-express.png`, `4_card_figma-fireflycm.png`:
    each connection card with every section open (how it works, before it works, what you get, how it connects,
    the Adobe links, the services). Picture aid only: the card scrolls in the tool, so its height limit was lifted to show all of it at once.
  - `5_rfi_figma_in_passing_keeps_express_services.png`: an Adobe Express question that mentions Figma in passing keeps EP01 to EP04, with no Figma line.
  - `6_rfi_figma_with_aem_assets.png`: "AEM Assets inside Figma" is answered from Figma + AEM Assets (XF01, XF02).

## Counts

162 connections and 569 services (158 and 563 before). RFI write-ups are batch 16.

## What each finding's fix was

1. High, Custom Models card: it promises only the custom models a designer has created. The share and Generator prerequisite,
   reference and steps are gone, and XF06 no longer shares models.
2. High, RFI Builder: Figma counts as named only where one sentence ties it to a product it connects to
   (`TIED` in `rfp_answers.js`). Six new checks in `test_step64.js` keep the product's own services
   (EP01 to EP04, GS04 and GS05, AS02 and AS03, FM01 to FM03, AXD10, WF01), with no Figma line or box.
   The unconnected Figma box on Build goes away with it.
3. Medium, Express gain: now "editable Express elements, so the team can keep editing them in Express".
4. Medium, one plugin as two connections: both cards name the Firefly Enterprise and GenStudio plugin,
   and the Custom Models card says it is the same plugin.
5. Medium, long "how it works" texts: two or three sentences each. A check holds them to three.
6. Low: the menu tag keeps its words inside its corners; XF04 states its Photoshop need once (its own note);
   "check for newer versions in AEM"; Express prerequisites merged; no semicolons inside a prerequisite;
   "the Figma account of each person who imports"; "rasterize individual elements where they must keep their appearance";
   unused quotes removed and the "how" and "gain" quotes written into the research file.
7. Low, XF05 and EP03: XF05 ends at handing the corrected designs over. It is renamed
   "Figma designs imported into Adobe Express" at 8 / 16 / 32 hours (was "turned into Express templates", 16 / 24 / 48),
   because building locked templates is EP03. This is the one choice that changes hours, so it needs Adam's eye.
8. Not changed: at 768 px the map draws no lines. That was there before this change.

## Final wording on the four cards

**Figma + AEM Assets**
- Label: Adobe's AEM Assets Connector places AEM Assets files on the Figma canvas and saves designs back to AEM Assets
- How: Adobe's AEM Assets Connector opens as a panel in Figma. Designers search AEM Assets, place images, videos, GIFs and SVGs on the Figma canvas, bring in newer versions with Check for updates, and upload a selected item or a whole page to an AEM Assets folder.
- What you get, "AEM Assets inside Figma": Your client's designers place AEM Assets files on the Figma canvas, check for newer versions in AEM, and save new or edited designs back to an AEM Assets folder without switching between tools.
- Services: XF01 AEM Assets Connector rollout for Figma designers (8 / 16 / 32), XF02 Save-back folders and export settings for Figma designs (8 / 16 / 32)

**Figma + GenStudio for Performance Marketing**
- Label: Adobe's Firefly Enterprise and GenStudio plugin in Figma generates on-brand ad variations in Figma templates and exports them to GenStudio for Performance Marketing
- How: Adobe's Firefly Enterprise and GenStudio plugin adds a GenStudio for Performance Marketing panel to Figma. Designers map the text and image layers of their ad templates to GenStudio fields, generate up to eight on-brand Meta, LinkedIn or Display variations from a brand, persona, product and prompt, translate them, and export them to GenStudio for Performance Marketing as experiences. The plugin also converts Figma frames to Photoshop documents for use with GenStudio Photoshop.
- What you get, "Ad variations where the designers already work": Your client's designers keep building ads in Figma and generate on-brand Meta, LinkedIn and Display variations and translations there, from the brands, personas and products in GenStudio. The results go to GenStudio for Performance Marketing as experiences.
- Services: XF03 Figma ad templates prepared for the GenStudio plugin (16 / 32 / 56), XF04 Figma frames converted for GenStudio Photoshop (8 / 16 / 32; "Also needs GenStudio Photoshop from Adobe Exchange, in Photoshop 25.6.0 or later")

**Figma + Adobe Express**
- Label: The Figma add-on in Adobe Express imports Figma pages, frames or layers as editable Express elements or flattened images
- How: The Figma add-on in Adobe Express connects the user's Figma account and imports a page, frame or layer from a Figma file, as editable Express elements (Native Import) or a flattened image (Rasterize). Gradients, patterns and certain masked or combined shapes can come in as images, and a font Express lacks gets a fallback. The add-on does not change the Figma file.
- What you get, "Figma work reused in Express": Frames your client's designers make in Figma come into Adobe Express as editable Express elements, so the team can keep editing them in Express.
- Service: XF05 Figma designs imported into Adobe Express (8 / 16 / 32)

**Figma + Firefly Custom Models**
- Label: Adobe's Firefly Enterprise and GenStudio plugin for Figma generates images with the custom models a designer has created
- How: Adobe's Firefly Enterprise and GenStudio plugin for Figma, the same plugin as on Figma + GenStudio for Performance Marketing, has a Model menu in Text to image. There the designer picks a custom model they have created, generates images and places them on the Figma canvas.
- What you get, "Custom models on the Figma canvas": Inside Figma, your client's designers generate images in the style or subject of the custom models they have created. The same models also generate in Firefly, Adobe Express and Photoshop.
- Service: XF06 Custom models for Figma designers (8 / 16 / 24)

## Tests, one suite at a time

- Passed: `canvas/test_canvas.js` (180), `test_step64.js` (47, with the three Figma answers and the six in-passing checks),
  `test_review_nov2.js` (229, takes about 20 minutes), `test_step61`, `62`, `66`, `71`, `85`, `91`, every `test_rfp*.js`,
  and the rest of the `test_*.js` files; `qa/check_product_copy.py` and `qa/check_citation_review.py`.
- Failed as before this change: `canvas/test_problems.js` (8 refine checks), `test_step47.js` (2 layout checks at 768 px),
  `qa/check_rendered_copy.js` (the removed Download SOW button), `check.py` (no Python Playwright).
- Not suites: `test_start_over.js` needs a page path as its argument, and the `tests_step4*.py` files are run-once patchers
  that stop on their first anchor. They changed nothing.

## Still needs a live Adobe check

The Adobe sites did not open from this session, so every claim on screen stays within `quotes_verified.json` (V01 to V94).
Three details the earlier review proposed were left off for that reason and can be added once the pages are read:

- XF04's note: "with the Creative Cloud desktop app" (GenStudio Photoshop page).
- XF06's scope: "set the aspect ratio and style reference" (Firefly help, text to image in Figma).
- The prerequisite wording "created in Firefly" (it now reads "Firefly custom models each designer has created").

Two phrases follow the reviewer's own wording and rest on verified quotes, not on a quote of their own:
"so the team can keep editing them in Express" (V50, V62) and "rasterize individual elements" (V56, V57, V64).
