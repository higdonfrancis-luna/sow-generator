# ABV partner services tool: review bundle (November 2, 2026)

This is the current version of the partner services tool, for a final review. It replaces what your two earlier audits looked at:
- the October 31 adversarial audit, which reviewed the October 31 zip
- the November 1 services and pricing audit, which reviewed that same October 31 zip, before any fixes.

Please review this version only. The live site (abvsow.netlify.app) still runs the October 31 version until this one is deployed, so test the `site/` folder in this bundle.

## How to open it

Serve `site/` with any static web server (for example `python3 -m http.server` inside `site/`) and open it in a browser. The front page is the Build canvas; the Scope, Services and Statement of work steps are at `/sow/`. The SOW steps also open on their own from `site/sow/index.html`. The canvas starts with no rate: enter one.

## What's in the bundle

| Path | What it is |
|---|---|
| `site/` | The built site, exactly what will be deployed |
| `docs/PROPOSAL.md` | The answer to your services and pricing audit, with Adam's decisions and what is built |
| `docs/PRICE_CHECK.md` | Every service's hours and the public prices found for comparison (internal) |
| `docs/CHANGE_LOG.md` | The answer to your October 31 audit, issue by issue |
| `docs/UNRESOLVED.md` | What rewriting couldn't settle, with who owns each item |
| `docs/CONNECTIONS.md` | All 59 canvas connections: type, Adobe's availability, prerequisites |
| `mockups/` | The service map by play, who owns SEO versus AI-answer work, and the step 1a before and after |

## What changed since your audits

From the October 31 audit (details in `docs/CHANGE_LOG.md`):
- Fees are illustrative: planning hours times the partner's own approved rate. No default rate, no rate range, no cost or margin model.
- Every service names the quantity behind its Small, Typical and Large hours. The prompt count, entered as a number, sets only the three prompt services.
- Lines that only the canvas has arrive in the SOW as service concepts, and the SOW can't be issued until they are written up.
- Every canvas connection is typed (native, shared-platform data path, supported extension, partner-designed workflow) with Adobe's availability and prerequisites.
- The FSI play asks whether Brand Concierge is new, live and healthy, or needs fixes, and carries the operating model the customer owns.

From the services and pricing audit (details in `docs/PROPOSAL.md`):
- One owner for each piece of work. Brand Visibility's services own AI-answer work only; Adobe says its edge fixes reach only ChatGPT, Perplexity and Claude. Sites Optimizer's monthly fixes own changes to the AEM site, including the site fixes Brand Visibility flags.
- "Technical SEO and AI-search improvements" is retired. The content line is now "Content improvements for search and AI", one line counted once.
- A service turned on or off on the Services step now carries back to the canvas, so a trip through Build keeps it.
- The front page shows only the masthead until a play is picked.

## Settled decisions (please don't reopen)

These are the owner's calls, made after reading your audits:
- No hourly rate range and no default rate: partners enter their own approved rate.
- The hours stay as they are. There is no outside delivery estimate.
- CJA audiences and Coworker's one plugin stay as starting services, because the plays' video and deck sell them.
- The plays deck keeps "A monthly readout that ties AI to revenue".
- No line saying the tool is "for joint validation". The site already says the hours are planning assumptions, not a quote.
- Nothing the tool shows or puts in a SOW mentions Adobe Consulting Services. (Earlier wording of one Brand Concierge sentence survives only as hidden data that lets saved drafts update to the new wording.)

## Still open, not in this version

- Commerce's deployment pilot as an add-on, Brand Concierge's question mapping folded into the build for a new concierge, and a gate on Coworker for financial services customers (step 1b in `docs/PROPOSAL.md`).
- "What Adobe does on its own" lines on five more cards (step 1c).
- Create your own play: research services starting off, with "Discovery required" (steps 2a and 2b).
- An existing-site answer for the AEM play and a CJA "today" answer (step 4).

## What would help most

1. Bugs: try to break the round trip between the canvas and the SOW steps, saved drafts, totals, and the downloaded SOW and CSV.
2. Services: anything still charged twice in a play, or a starting service that doesn't belong.
3. Claims: anything in the SOW text that says more than Adobe's documentation supports.

For each problem, give the play, the service or screen, what goes wrong, and the exact fix.
