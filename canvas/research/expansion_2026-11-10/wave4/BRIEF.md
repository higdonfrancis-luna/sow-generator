# Wave 4, the Marketo family: service-level research brief (Nov 10 2026)

Adam, Nov 10: "should we add these two products?" (Adobe Marketo Qualifier and Adobe Marketo Optimizer, both on Experience
League), then "go" on the research. Research and pictures only in this pass: nothing in the tool changes until he has seen
the cards and said yes.

Products: Adobe Marketo Qualifier (`mqualifier`) and Adobe Marketo Optimizer (`moptimizer`). They will join the Create your
own play picker and the RFI Builder; the six plays on the tool's front page do not change.

Start pages:
- https://experienceleague.adobe.com/en/docs/marketo-qualifier/using/home
- https://experienceleague.adobe.com/en/docs/marketo-optimizer/user/guide-overview

## Read first

- `../BRIEF.md`: the source rules, blocked hosts, the quote check, no em dashes.
- `../wave2/BRIEF.md`: "What to write, for each product in your scope" and "Output" apply here unchanged (the fields of a
  product, a service, a connection; the two files to write).
- `../wave1/BRIEF_RECHECK.md`, steps 3 to 7: the lifecycle rule, what each connection and product needs, the client voice.
- `../wave3/BRIEF.md`: "Adam's calls that bind this wave" and "What the build of wave 2 taught" apply here unchanged.
- `../../wave3_documents.json` and `../wave3/documents.md`: a finished file and trail from wave 3, built into the tool as
  step 66. Match its shape and its level of care.

## The tool today

32 Adobe products (ids in `../../../catalog.json`, `products`), among them Marketo Engage `marketo`, Marketo Measure
`mmeasure`, Journey Optimizer B2B Edition `ajob2b`, Real-Time CDP `rtcdp`, Coworker `cw`, Brand Concierge `bc`, and the
outside systems a CRM `crm` (Salesforce, Microsoft Dynamics 365) and ad platforms `ads`.

## What is known, and what to settle from Adobe's public pages

- Adobe's page: Marketo Qualifier "is part of the Marketo product family, alongside Marketo Engage, Marketo Optimizer, and
  Marketo Measure". It connects to Salesforce or Microsoft Dynamics 365, Outlook, and can sync outreach activities to
  Marketo. Smart audience is labelled Beta on the page: leave it out and list it.
- Marketo Optimizer's setup checklist has admins create a Journey Optimizer B2B Edition product profile and Experience
  Platform permissions. Adam's read (from Adobe material that is not public, so not quotable): it is its own product that
  runs on the client's Marketo Engage data. It is NOT a rename of Journey Optimizer B2B Edition in this tool: write it as
  its own product, and say in the trail, with quotes, what the public pages say about how the two relate and what a client
  needs first (a Marketo Engage subscription? Experience Platform? sandboxes?).
- Each connection needs setup that Adobe documents on a public page. Candidates to check, no more: `mqualifier` with
  `marketo`, `crm`, `moptimizer`, `bc`; `moptimizer` with `marketo`, `cw` (its Coworker chat and skills), `ads`
  (destinations), `crm`, `mmeasure`, `aemassets` (Marketo Engage image assets). Outlook and WhatsApp are not products in
  the tool: they are services on the product.
- No sales claims: no conversion figures, no "in a day", nothing a public Adobe documentation page does not state.
- Hours are our own estimates for a mid-market client; Adobe publishes none.

## Ids

Given in your prompt. Check them by script against `../../../catalog.json` and every JSON file under
`sow/canvas/research/`: no repeats.

## Hosts

experienceleague.adobe.com, helpx.adobe.com, developer.adobe.com are open. business.adobe.com and www.adobe.com have
answered with a bot check or an error before: try once with curl, and if the page that comes back is not the article, list
it under `pages_not_read` and move on. Never work around a refusal or a bot check.

Check every quote the way `../verify_quotes.py` does before you finish (the checker in `../wave1/verify_wave1.py` runs on
your JSON as is). Write only the two files named in your prompt. Do not commit. Do not run any build script or test. No em
dashes or en dashes anywhere.
