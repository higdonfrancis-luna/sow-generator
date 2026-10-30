# Architecture canvas: concept (Oct 30 2026)

Status: a clickable prototype of the Build tab is in `canvas/` (Oct 30; see `canvas/README.md`). It isn't deployed, and the live tool at abvsow.netlify.app doesn't have the canvas.

## Adam's idea (Oct 30, 2:43 pm)

The SOW tool starts as a blank canvas. You pick a product and it drops onto the canvas with its services. Pick a second product and it drops in too, bringing its own services plus the services that integrate the two. Keep going, to 15 products or more: services for every product and for every connection between them. Hover a product to see its line items. Each connection has an "i" in the middle, and hovering it shows the integration services. The point: a partner goes from an idea to "I can make $5 million in services" in minutes, and the customer sees the architecture being built. Once the architecture is set, the next screen is today's SOW tool, with services by product plus the integration services. A possible later step is the customer's own systems (AWS, Azure, databases, an S3 bucket) and the services that go with them.

## Adam's refinements (Oct 30, 3:02 and 3:07 pm)

- Keep the canvas clean: only product names on it. Services, hours and fees show only when you hover a product or the "i" on a connection. The canvas is for visual people; the statement of work is the busy, detailed view.
- Adding a product connects it automatically to the products it integrates with.
- In a hover card, X removes a service line and a check brings it back; the product's or connection's subtotal and the overall total update.
- Keep from the first mockup: the rate and Small / Typical / Large at the top, and the total adding up on the right.
- The canvas isn't a replacement for the SOW; it shows the potential services revenue as you add building blocks.
- The canvas is the first thing you see, about the whole page. Save, then on to the next tab. Four tabs: Build, Scope, Services, Statement of work.
- Open question from Adam: does Build fill in Services automatically, and does removing a line on Services change Build?

Revised mockups:

- `mockups/build_clean.png` (source `build_clean.html`): the Build tab. Add product and Start from a play at the top left, rate and size in the middle, the total on the right; product names and "i" dots only on a full-width canvas; a product hover card with X and check (one line removed, so Edge Delivery Services shows 2 of 3 services, $180,000, and the total $852,600); a connection hover card in the strip below; Save and continue.
- `mockups/build_sync.png` (source `build_sync.html`): the proposed answer to his question.

## Proposed: one list underneath, two views (answer to Adam's sync question)

- Today's tool already keeps one list of service lines in the browser; the canvas would be a second view of the same list, so Build and Services can't disagree.
- Build decides the products; both pages decide the services. Adding a product adds its lines and its connections' lines; removing it takes them out, and adding it back restores them as they were left.
- X a line on either page and it's off on both; check it and it's back with its hours. New hours set on Services show in the canvas hover cards. Rate and size apply everywhere.
- The Services library offers lines for products on the canvas, plus custom lines; new products are added on Build.
- A product with every line X'd stays on the canvas: the client may already own it (CJA in the cross-sell play).
- The statement of work reads the same list, grouped by product, connection and work counted once, with the architecture picture at the top.

## Prototype (Oct 30, 3:31 pm; Adam: "go ahead and build what you're thinking")

- `canvas/index.html`, built by `python3 sow/canvas/build.py`, checked by `node sow/canvas/test_canvas.js` (47 checks, ALL CANVAS CHECKS PASSED). A separate page; the live tool is untouched.
- Ten products and 11 connections: the seven from today's catalog plus Real-Time CDP, Journey Optimizer and Target, researched from Experience League (`canvas/research/cja_hub.json` and the research trail `cja_hub.md`: 24 searches, a page and a quote behind every line). CJA takes five connections (Brand Visibility, Coworker, Real-Time CDP, Journey Optimizer, Target), each with its own line, i and services. 68 lines, every one with a source.
- Each of the four plays totals exactly what the live tool gives for that play (Play 3: $484,800 at $150, Typical). All ten products: $1,113,000 year one at $150, Typical.
- Where the data lives: a JSON catalog in the repo, built into the page; lines from the live tool are read from its own catalog so the two can't drift. A Worker and D1 only if people outside the repo need to submit services through a form (details in `canvas/README.md`).
- Flagged from the research, not changed: Adobe documents no direct integration between Brand Visibility and Sites Optimizer (marketed together only), so no line joins them; Real-Time CDP, Journey Optimizer and CJA share one Experience Platform setup, so each product counting its own setup double counts some of it when they're together (a "counted once" group would fix it); Adobe builds the Journey Optimizer to CJA plumbing itself, so those lines are reporting work; C06 (CJA audiences to Real-Time Customer Profile) could sit on the Real-Time CDP and CJA connection, but it stays on CJA so Play 1 matches the live tool; SO1 could cite Sites Optimizer's "Connect to AEM Sites" settings section.

## First mockups (Oct 30, 2:43 pm)

- `mockups/canvas_concept.png` (source `canvas_concept.html`): the Architecture step. A product picker with the four plays as starting points, products in lanes, an "i" on every connection, hover cards for a product and a connection, a running total at the partner's rate and the customer's size, a Show fees switch for customer workshops, the work counted once, and a dashed lane for the customer's cloud later.
- `mockups/canvas_flow.png` (source `canvas_flow.html`): how it builds (1, 2, 3, then 6 products), then the Services step grouped by product, connection and work counted once, with the architecture picture at the top of the SOW document.

Render either one from `sow/mockups/` with `node shot.js canvas_concept.html canvas_concept.png 1350` (or `canvas_flow.html canvas_flow.png 1400`). Both use the video's Source Sans 3 fonts and `../adobe_logo.png`.

## How the mockup numbers work

Every service, hour and dollar comes from today's catalog in `index.html`, at Typical hours, $150 an hour, year one (one-time plus 12 months).

| Kind | Item | Catalog lines | Year one |
|---|---|---|---|
| Product | Brand Visibility | L01, L02, O01, O02 | $204,000 |
| Product | Edge Delivery Services on AEM Sites | A01, A02, A03 | $198,000 |
| Product | Sites Optimizer | SO2 | $28,800 |
| Product | Customer Journey Analytics | C06 | $7,200 |
| Product | Brand Concierge | F02, FSI01 | $153,600 |
| Product | Coworker | CW00, CW07, CW06 | $72,600 |
| Connection | Brand Visibility + CJA | C01 | $8,400 |
| Connection | Brand Visibility + Edge Delivery Services | C03, L03 | $14,400 |
| Connection | Sites Optimizer + Edge Delivery Services | SO1 | $3,600 |
| Connection | Brand Visibility + Sites Optimizer | O03 | $100,800 |
| Connection | Brand Visibility + Brand Concierge | C04 | $8,400 |
| Connection | Coworker + CJA | CW-CJA | $8,400 |
| Connection | Coworker + Edge Delivery Services | CW-AEM | $9,600 |
| Connection | Coworker + Brand Concierge | CW-FSI | $10,800 |
| Counted once | Discovery and solution architecture; governance and change management | A04, A05 | $42,000 |
| Total | 6 products, 8 connections, 25 services | | $870,600 ($438,600 one-time + $36,000 a month) |

The steps in the flow mockup: Brand Visibility alone $204,000 (4 services); plus Edge Delivery Services $458,400 (11, including the connection and the work counted once); plus CJA $474,000 (13).

The catalog already fits the model: today's Connect group (C01, C03, C04, CW-CJA, CW-AEM, CW-FSI) is integration services, and the four plays are four starting architectures.

## Design ideas proposed to Adam

1. Draw a line only where Adobe documents a real integration. Fifteen products would mean 105 possible pairs; the real connections are far fewer, which keeps the canvas readable and every line sourced, as every service is today.
2. Three kinds of services: per product, per connection, and counted once per engagement (discovery, project management, governance), so adding a product doesn't repeat discovery.
3. The four plays become one-click starting architectures.
4. Show fees off hides the money for a customer workshop; the architecture picture goes at the top of the SOW document.
5. The customer size switch still applies, so a Scale client doesn't get enterprise hours.
6. Same rules as today: services only (no software pricing), the partner's own rate, and nothing leaves the browser (no database).
7. The customer's cloud (AWS, Azure, Snowflake and the like) is a later phase, limited to connectors Adobe documents.

## Possible phases

1. The canvas for the seven products the catalog already covers (Brand Visibility, CJA, Commerce, Edge Delivery Services on AEM Sites, Sites Optimizer, Brand Concierge, Coworker) and the connections the plays describe, feeding today's Services step grouped by product, connection and work counted once. Best shown first as a clickable mockup.
2. More Adobe products (for example Real-Time CDP, Journey Optimizer, Marketo Engage, Target, AEM Assets, Workfront, GenStudio), each researched from Adobe's docs with services, hours and a source per line. The big lift is this content, not the code.
3. The customer's cloud and data.

## Open questions for Adam

- Does the canvas become the first step of abvsow.netlify.app, or its own site, since it goes beyond Brand Visibility?
- Which products come after the seven?
