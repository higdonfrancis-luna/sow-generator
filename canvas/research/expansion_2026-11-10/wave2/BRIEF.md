# Wave 2, GenStudio and creative: service-level research brief (Nov 10 2026)

Adam, Nov 10: "do these and then start wave 2". Research and pictures only in this pass: nothing in the tool changes until
he has seen the cards and said yes.

Wave 2 products: Adobe Express, Frame.io, Creative Cloud (one box for the apps), Workfront Planning, Firefly Creative
Production (which includes the Firefly Services APIs), Firefly Custom Models and Brand Intelligence. They will join the
Create your own play picker and the RFI Builder; the six plays on the tool's front page do not change.

## Read first

- `../BRIEF.md`: the source rules, blocked hosts, the quote check, no em dashes.
- `../wave1/aem_forms.md` ("How this was researched", "Left out, and why", "Open questions for Adam") and
  `../../aem_forms.json`: the format and the level of care to match. AEM Forms was built from it.
- `../wave1/BRIEF_RECHECK.md`, steps 3 to 7: the lifecycle rule, what each connection and product needs, the client voice.
  They apply here unchanged.
- `../genstudio_creative.json` and `../brand_visibility_side.json` (the `brandintel` entry): this morning's map-level pass on
  these products, with the connections Adobe documents and the pages. Start from it.
- `../../portal_acquisition_insights.json`: GenStudio for Performance Marketing as built today, for the scale of services
  and hours and for the shape of a finished file.

## The tool today

Products: Brand Visibility, Sites Optimizer, Edge Delivery Services, AEM Sites, AEM Assets, AEM Forms, Adobe Commerce, Brand
Concierge, Coworker, Customer Journey Analytics, Real-Time CDP, Journey Optimizer, Target, Marketo Engage, Workfront, GenStudio
for Performance Marketing (`gspm`), Content Analytics (`ca`), Marketing Campaign Analytics (`mmm`), Real-Time CDP
Collaboration (`collab`), Journey Optimizer B2B Edition (`ajob2b`), Experimentation Accelerator (`xa`). Ids for the rest are
in `../BRIEF.md`; AEM Forms is `aemforms`.

## What to write, for each product in your scope

1. **The product:** `id`, `name`, `title`, `what` (with its page), `notes`, `prereqs` with `prereq_sources`, `tiers`.
2. **Its services:** about six (four to eight), as partner work a client would pay for: setup and access, the main build,
   governance or templates, training, and a monthly service where the product has ongoing work. Each with `id`, `name`,
   `unit` (`one-time` or `monthly`), `low` / `base` / `high` hours (our own estimates for a mid-market client, on the scale
   of the existing lines), `default` (true for what a typical engagement starts with), `scope` (one or two sentences, verb
   first, partner voice, "your client"), `evidence` (a word-for-word quote from the source page), `source` (url and title),
   and `ext` or `tier` where it needs a product outside the tool or a package.
3. **Its connections** to products in the tool, and to the other wave 2 products, where Adobe documents the connection at
   setup level: `id` (`a-b`), `a`, `b`, `how`, `source`, `gain` (title and text, partner voice: "your client", never a bare
   "your"), `flows`, `kind`, `label`, `availability`, `availability_source`, `prereqs`, `prereq_sources`, one to three
   services, and `client` (`how`, `gain`, in the client's voice). Where a prerequisite tells the partner to confirm
   something with Adobe, also give `sow_prereq`: the same point as a condition for the statement of work ("Adobe confirms
   ... before this service starts"), keyed by the prerequisite's text.
4. **Left out and not documented**, with Adobe's words and pages, as wave 1 did.

Voice rules that the tool's checks enforce: a card never says "the client", "clients" or a bare "your" (it says "your
client"); nothing a partner or client reads says beta, early access, limited availability, coming soon, "is planned", or
gives a release date; a prerequisite does not open with, or follow a colon with, "confirm".

A connection between two wave 2 products is written once, by the helper whose scope lists it first.

## Output

Two files in this folder, named in your prompt: the JSON (structure as `../../aem_forms.json`: `checked`, `products`,
`connections`, `not_documented`, `left_out`, `pages_not_read`) and a trail (`.md`): summary tables, how it was researched and
the quote check's counts, left out and why, what a partner would get wrong (with quotes), open questions for Adam (few,
plain words, each with your recommendation), pages read and not read.

Check every quote the way `../verify_quotes.py` does before you finish. Write nothing else in the repo. Do not commit. Do
not run any build script. No em dashes anywhere.
