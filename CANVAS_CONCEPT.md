# Architecture canvas: concept (Oct 30 2026)

Status: idea and mockups only. Nothing is built, and the live tool at abvsow.netlify.app is unchanged.

## Adam's idea (Oct 30, 2:43 pm)

The SOW tool starts as a blank canvas. You pick a product and it drops onto the canvas with its services. Pick a second product and it drops in too, bringing its own services plus the services that integrate the two. Keep going, to 15 products or more: services for every product and for every connection between them. Hover a product to see its line items. Each connection has an "i" in the middle, and hovering it shows the integration services. The point: a partner goes from an idea to "I can make $5 million in services" in minutes, and the customer sees the architecture being built. Once the architecture is set, the next screen is today's SOW tool, with services by product plus the integration services. A possible later step is the customer's own systems (AWS, Azure, databases, an S3 bucket) and the services that go with them.

## Mockups

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
