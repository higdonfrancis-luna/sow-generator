# Wave 1, the six products researched on Oct 30: recheck brief (Nov 10 2026)

Adam, Nov 10: "yes, let's keep going" to rechecking the six products researched on Oct 30 and showing him their cards before
anything is built. Research and pictures only: nothing in the tool changes in this pass.

The six: GenStudio for Performance Marketing (`gspm`), Content Analytics (`ca`), Marketing Campaign Analytics, formerly Mix
Modeler (`mmm`), Real-Time CDP Collaboration (`collab`), Journey Optimizer B2B Edition (`ajob2b`) and Journey Optimizer
Experimentation Accelerator (`xa`). Their Oct 30 research is in `sow/canvas/research/portal_acquisition_insights.json` and
`.md`, and `sow/canvas/research/portal_omnichannel_b2b.json` and `.md`. They will join the Create your own play picker; the
six plays on the tool's front page do not change.

## Read first

- `../BRIEF.md`: the source rules, blocked hosts, the quote check, no em dashes.
- `aem_forms.md` ("How this was researched", "Left out, and why", "Open questions for Adam") and `../../aem_forms.json`:
  the format and the level of care this pass must match. AEM Forms was built from it today.
- `../platform_data_campaign.json` and `../genstudio_creative.json`: the map-level recheck of these six from this morning
  (names, status, new connections). Start from what they found; do not repeat it.

## What to do, for every product and connection in your scope

1. **Recheck every quote.** Download each source page again (`curl -sS -L -m 45`), and check each `evidence` and each quoted
   source the way `../verify_quotes.py` does. Where a page moved (every `/en/docs/mix-modeler/` address now redirects to
   `/en/docs/marketing-campaign-analytics/`), use the current address. Where a quote is gone, find the current sentence on
   Adobe's page that backs the same service, or drop the service and say why.
2. **Names.** Use Adobe's current names in every name and scope (Marketing Campaign Analytics, not Mix Modeler).
3. **Lifecycle.** Adam's rule: nothing a partner or a client reads says beta, early access, limited availability, coming
   soon, or gives a release date. So a service that rests on a feature Adobe keeps in an early or limited program is left
   out and listed under `left_out` with Adobe's words and the page. A product that is itself under such a label (check Real-
   Time CDP Collaboration, which this morning's pass found described as Limited Availability) is a question for Adam: say so
   at the top of your report, with Adobe's exact words and page.
4. **What each connection needs, in Adobe's terms.** For each connection add, as `aem_forms.json` has them: `availability`
   (Adobe's own words about availability, or "Not stated by Adobe."), `prereqs` (short lines, partner voice, "your client"),
   `prereq_sources` (url and quote for each prerequisite), and `availability_source` where Adobe states it. Also add
   `kind` (`native` for a built-in integration, `platform` for a shared Experience Platform data path, `extension` for a
   supported connector or add-on such as Workfront Fusion, `partner` for a workflow the partner designs) and a draft `label`
   (one short phrase for the card, like "Out-of-the-box connector streams form submissions into Experience Platform
   profiles").
5. **What each product needs.** `prereqs`, `prereq_sources` and `tiers` for the product (licenses, add-ons, regions), as
   `aem_forms.json` has them. A service that needs a package or add-on gets a `tier` (it shows as a "Needs ..." tag, so keep
   it short); one that needs a product not in the tool gets an `ext` ("Also needs ...").
6. **New connections to products already in the tool.** The tool has: Brand Visibility, Sites Optimizer, Edge Delivery
   Services, AEM Sites, AEM Assets, AEM Forms, Adobe Commerce, Brand Concierge, Coworker, Customer Journey Analytics, Real-Time
   CDP, Journey Optimizer, Target, Marketo Engage, Workfront. Where Adobe documents one of your products connecting to one of
   these and the Oct 30 research has no connection for the pair, write it up at service level (how, source, gain, flows, one
   to three services with evidence and hours on the scale of the existing lines). Your prompt names the pairs to check.
   A pair Adobe documents only as a bullet with no setup stays out, listed under `not_documented` or `left_out` with why.
7. **Client voice.** For each connection, a `client` entry with `how` and `gain` reworded for the client to read ("your",
   "we"), no partner words and no lifecycle labels, as in `sow/product_copy_rules.json` under `connection_client`.
8. **Hours** stay as they are unless a service's scope changes; say so where you change them. They are our own estimates.
9. **Do not change anything outside your scope.** Entries in the Oct 30 files for products and connections already in the
   tool (AEM Sites, AEM Assets, and connections such as aemsites-aemassets or commerce-aemassets) must stay exactly as they
   are: copy them through untouched.

## Output

Write two files into this folder (`sow/canvas/research/expansion_2026-11-10/wave1/`), named in your prompt:

- a **JSON file**: a full replacement for your Oct 30 research file, same structure, with the rechecked and added fields
  above. `checked` becomes `2026-11-10`. Service ids stay as they are; new services take new ids with the prefix your prompt
  gives you (check no id repeats one in `sow/canvas/catalog.json` or any `sow/canvas/research/*.json`).
- a **trail** (`.md`): a summary table of products, services and connections; **what changed since Oct 30** (one row per
  changed, dropped or added service or connection, with why); how it was researched and the quote check's counts; left out
  and why; what surprised you or what a partner would get wrong, with quotes; open questions for Adam (few, plain words);
  pages read and pages not read.

Write nothing else in the repo. Do not commit. Do not run any build script. No em dashes anywhere.
