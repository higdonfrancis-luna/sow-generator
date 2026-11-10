# Step 61, as built: AEM Forms joins the tool (Nov 10 2026)

Wave 1 of the catalog expansion. Adam: "yes" to build AEM Forms, and his answers to the five questions. Built and tested in
`sow/site/`. The six plays on the front page are unchanged; AEM Forms is on Create your own play and in the RFI Builder.

Picture of the built cards: `sow/mockups/nov10_wave1_aem_forms/as_built_aem_forms.png` (redraw it with
`node sow/mockups/nov10_wave1_aem_forms/as_built.js sow/site`). The proposal picture Adam said yes to is
`aem_forms_cards.png` in the same folder.

## Adam's answers, and what each became

| Question | Adam | Built |
|---|---|---|
| Forms history search (the Washington State RFP asked; Adobe documents nothing, because AEM Forms keeps no submissions) | "Leave the gap" | Nothing added. In the RFI Builder that question goes to the partner |
| PDF form conversion, which outputs the older component type | "Keep it, with the caveat" | AF10 stays optional. Its scope ends: "The service produces forms on Foundation Components, the earlier of Adobe's two component sets for adaptive forms, so converted forms are maintained with that set's editor." Evidence is Adobe's sentence on the conversion page. The scope shows on the Services step and in the statement of work; the canvas card lists service names only |
| An optional accessibility review service | yes | AF18, Form accessibility review, optional, 16 / 32 / 64 hours, on Adobe's "Creating accessible Adaptive Forms" page. It reviews Adobe's five checks (accessible names, labels, text equivalents, contrast, keyboard) against the standard the Client names, and promises a review and fixes, not a certificate |
| Shorten the long tag | yes | "Needs the Forms Communications add-on" on the four document generation services (AF12 to AF15) |
| The two existing services that overlap | "Retire both" (asked a second time, because each was the only service on its connection) | "Site forms that submit to Marketo" (XB09) and "Site form requests into Workfront" (XB13) are out of the catalog, and so are their two connections: Marketo Engage + Edge Delivery Services and Workfront + Edge Delivery Services. The work is AEM Forms + Marketo Engage and AEM Forms + Workfront |

## What is in the tool now

- **The catalog:** 15 Adobe products (was 14), 9 outside systems, 79 connections (75, plus 6, minus 2) and 232 services
  (201, plus 33, minus 2).
- **AEM Forms** ("AEM Forms as a Cloud Service" on its card): 8 starting services and 10 optional ones. E-signature says
  "Also needs Acrobat Sign Solutions" and form analytics "Also needs Adobe Analytics", because those two products are not
  in the tool.
- **Six connections,** each with its kind, Adobe's availability in Adobe's terms, what it needs first and its services:
  AEM Sites (3 services), Edge Delivery Services (3), Real-Time CDP (2), Marketo Engage (2), Workfront through Workfront
  Fusion (2) and Coworker (3). AEM Forms + Coworker carries the Coworker license line and the eligibility line the other
  Coworker connections carry. There is no Brand Visibility connection: Adobe documents none.
- **The problem picker:** the chip "My client's site forms should feed Marketo" (on the slow-site problem) relied on the
  retired connection. It adds AEM Forms and Marketo Engage now, so the canvas draws AEM Forms + Edge Delivery Services and
  AEM Forms + Marketo Engage. Adding AEM Forms turns on its eight starting services, which the chip did not do before.
- **The RFI Builder:** AEM Forms is no longer on the "not in this catalog" list. A question that names AEM Forms (or
  Experience Manager Forms, Adobe Forms, adaptive forms) is answered from its services, and forms that feed Marketo Engage
  or start work in Workfront from the two connections. Topic words bring it in beside a named product: online form, web
  form, site form, digital form, fillable form, PDF form, form submission, form builder, forms portal, electronic signature,
  e-signature, document generation, digital enrollment. The six connections have client-voice wording for drafted answers.
- **Saved work:** a statement of work (in the browser or a draft file) that used a retired service keeps it as the
  partner's own service, with the name, wording, hours, rate and choice it was saved with, and a note that the tool retired
  it on November 10, 2026. A copy that was only on offer, never used, is dropped. A saved canvas with Marketo Engage and
  Edge Delivery Services opens without the line between them.

## Files

| File | What changed |
|---|---|
| `sow/canvas/data_step61.py` | The data step, run once: the research edits, the product on the map, the six connection records, the two retirements, the client-voice wording, the chip |
| `sow/canvas/research/aem_forms.json` | The wave 1 research, moved here from `expansion_2026-11-10/wave1/` (where `build.py` did not read it), with the short tag, AF10's caveat and AF18 |
| `sow/canvas/catalog_map.json` | The product `aemforms`, and its place on Create your own play, `[4, 3]` |
| `sow/canvas/research/connection_types.json` | Six connections added with their evidence quotes; `marketo-eds`, `workfront-eds` and the XB09 and XB13 line records removed |
| `sow/canvas/research/marketo_workfront.json` | The two retired connections removed; a note says why |
| `sow/product_copy_rules.json` | The retired connections' rules removed; `connection_client` for the six new ones |
| `sow/canvas/problems.json` | The chip adds AEM Forms and Marketo Engage |
| `sow/canvas/review_amendments.py` | The Nov 6 audit's amendments for the two retired connections are skipped by name (the audit record itself is unchanged) |
| `sow/patch_step61.py`, `sow/index.html` | A statement of work that used a retired canvas service keeps it as the partner's own service |
| `sow/rfp_answers.js` | AEM Forms in the names and topic words; off the not-covered list |
| `sow/test_step61.js`, `sow/qa/step61_fixtures/` | The step's suite (40 checks), with saved work captured from the step 60 build |

## Checks changed on purpose

- `sow/qa/check_product_copy.py`: 190 service definitions and 79 connections (were 159 and 75).
- `sow/test_rfp_step52.js` and `sow/rfp_prototype/review_2026-11-09/recheck.js`, check 4.4: AEM Forms is answered with AEM
  Forms services; AEM Guides stands in as the product the catalog does not cover.
- `sow/test_rfp_step52.js`, check 4.7: the bank RFP's "site forms that feed Marketo" is answered from AEM Forms + Marketo
  Engage.

## Flagged, not changed

- **AXB04** (AEM Sites + Marketo Engage, optional) also rests on AEM Forms, the way XB09 did. It was not one of the two Adam
  retired, so it stays. It overlaps AEM Forms + Marketo Engage when both are on a canvas.
- **`sow/qa/citation_estimate_baseline.json`** still lists XB09 and XB13. It is the Nov 6 audit's record, read only by
  `check_citation_review.py`, which has failed since before Nov 10.
- **The research trail's smaller questions** (where the Forms Portal sits, 17 or fewer product services, Azure Storage as an
  outside system, the monthly service's opening word) were not asked again and are built as the research had them.
- **Hours are our own estimates** for a mid-market client. Adobe publishes none.
