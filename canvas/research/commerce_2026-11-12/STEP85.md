# Step 85: Adobe Commerce gets services of its own (Nov 12 2026)

Adam, on the outside review's finding that Adobe Commerce had no services of its own: "Yeah, we should add Services around Adobe Commerce customers. I don't know why I never thought of that", then "It looks like the right 8" to the list.

## What was built

Seven optional services on the Adobe Commerce product and one new connection, Adobe Commerce + CRM, with one optional service. The catalog is 34 Adobe products, 9 outside systems, 151 connections and 525 services.

| Id | Service | Billing | Hours (small / typical / large) | Needs | Adobe page |
|---|---|---|---|---|---|
| CE01 | Store structure and Admin setup | one-time | 16 / 32 / 64 |  | [Store and site structure](https://experienceleague.adobe.com/en/docs/commerce-admin/stores-sales/site-store/stores) |
| CE02 | Catalog import | one-time | 16 / 40 / 96 |  | [Options for importing a catalog](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/cloud-infrastructure-and-self-hosted/catalog-and-products/catalog-import) |
| CE03 | Checkout, payment, tax and delivery settings | one-time | 24 / 40 / 80 |  | [Configuration reference guide](https://experienceleague.adobe.com/en/docs/commerce-admin/config/guide-overview) |
| CE04 | Inventory sources and stocks setup | one-time | 16 / 32 / 64 |  | [Introduction to Inventory Management](https://experienceleague.adobe.com/en/docs/commerce-admin/inventory/introduction) |
| CE05 | Live Search setup | one-time | 24 / 48 / 96 | Adobe Commerce 2.4.4 or later on cloud infrastructure or on-premises | [Set up for success with Live Search](https://experienceleague.adobe.com/en/docs/commerce/live-search/install) |
| CE06 | B2B buyer and purchasing setup | one-time | 24 / 48 / 96 | the Adobe Commerce B2B extension | [Enable B2B features](https://experienceleague.adobe.com/en/docs/commerce-admin/b2b/enable-basic-features) |
| CE07 | Monthly maintenance and upgrades | monthly | 16 / 32 / 56 |  | [Maintenance phase](https://experienceleague.adobe.com/en/docs/commerce-operations/implementation-playbook/best-practices/maintenance/overview) |
| XR01 | Commerce to CRM integration | one-time | 60 / 120 / 240 | Adobe Developer App Builder access | [Install Adobe Commerce integration starter kit](https://developer.adobe.com/commerce/extensibility/starter-kit/integration/create-integration) |

- All eight start unticked, on Create your own play and in the RFI Builder. No play turns one on.
- **The Commerce play:** the seven product services also show on the Commerce play's Adobe Commerce card as optional lines, because a product card is the same on every play. Totals do not change until one is ticked. Flagged to Adam.
- **Adobe Commerce + CRM** is an outside connection (drawn as a native route) that says plainly it is a partner-built integration on Adobe's Commerce integration starter kit in App Builder. It has six prerequisites, flows in both directions, client wording for the RFI Builder, and no availability line.
- Hours are our own estimates, set beside comparable services already in the catalog. Adam has not reviewed them yet.

## How it was researched

One agent drafted each service from Adobe's public pages; a second re-checked the quote, the scope and the hours. A script then found every quote word for word on its page (`sow/qa/review_pack/lib.py`): 8 of 8 main quotes, 43 of 43 supporting quotes, 6 of 6 for the connection. The full record, with each checker's changes, is `commerce_services.json` in this folder.

## Notes from the research, for Adam

- **Store structure and Admin setup:** Adobe's Admin pages cover Adobe Commerce on cloud infrastructure and on-premises. Adobe says multi-store and multi-site installations must also be configured on the server; that server work is not in this scope or these hours. No existing catalog service covers store structure, currencies or Commerce Admin roles, so there is no overlap.
- **Catalog import:** Adobe's tutorial sits under Commerce on cloud infrastructure and self-hosted (on-premises), so the scope is true for those two forms; Commerce as a Cloud Service and Commerce Optimizer are not covered by the pages read. Product images and videos are outside this service (Adobe says they are uploaded separately); XC15 covers media. No existing catalog service repeats this one.
- **Checkout, payment, tax and delivery settings:** Optional, one-time. No existing catalog service covers tax, checkout, shipping or payment settings. Adobe's configuration reference marks only Advanced > Admin and System as PaaS only, so the Sales tabs apply to cloud infrastructure, on-premises and Commerce as a Cloud Service; not written for Commerce Optimizer. Adobe's sandbox sentences name PayPal and Payment Services. Carrier and payment provider accounts are the client's.
- **Inventory sources and stocks setup:** Covers the Commerce Admin (Adobe says the module is installed with Adobe Commerce, so no extra license). One field on Add a source applies only to Adobe Commerce as a Cloud Service and Commerce Optimizer. The distance algorithm's Google Maps option needs your client's Google API key and billing account; the offline option needs geocodes imported by command line. No existing catalog service overlaps.
- **Live Search setup:** Adobe's install page covers Adobe Commerce on cloud infrastructure and on-premises only; the Composer, API key and sync steps do not apply to Commerce as a Cloud Service or Commerce Optimizer. The license holder generates the API keys. XA13 only confirms attributes and facets for Brand Concierge, so little overlap. Widget styling and headless event collection are not included.
- **B2B buyer and purchasing setup:** Optional. Sourced for Adobe Commerce on cloud infrastructure and on-premises: Adobe's B2B install page is marked for those two forms. Installing the extension is not in the scope. Company roles and approval rules are made in the company administrator's storefront account, so the scope tests them. No existing catalog service overlaps.
- **Monthly maintenance and upgrades:** Optional, monthly. True for Adobe Commerce on cloud infrastructure and on-premises, the forms Adobe's patch, upgrade and indexer pages cover; not written for Adobe Commerce as a Cloud Service or Commerce Optimizer. Hours cover planning and testing an upgrade, not carrying it out. No existing catalog service overlaps: Adobe Commerce has no product services yet.
- **Commerce to CRM integration:** Adobe's page covers Adobe Commerce on cloud infrastructure and on-premises (PaaS) and Adobe Commerce as a Cloud Service (SaaS), one at a time; Commerce Optimizer is not mentioned. Adobe supports the kit's basic functionality only, so the partner supports the custom code. The kit names no CRM product. No overlap with an existing service (XC16 is asset matching only). Starts optional.

## Files

- `sow/canvas/data_step85.py`: writes `research/step85_commerce.json`, the connection's entry in `research/connection_types.json` and its client wording in `product_copy_rules.json`.
- `node sow/test_step85.js` (25 checks): the catalog, the two cards, the hand-off to the statement of work, the Commerce play, and four RFI questions.
- Pictures of the built cards: `sow/mockups/nov12_commerce/`.
