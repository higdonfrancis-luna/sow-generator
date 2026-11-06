# SOW citation audit

Completed November 6, 2026 (UTC).

Repository: `higdonfrancis-luna/warroom`. Branch reviewed: `abv-partner-plays`. Commit: `497dc76691964ca5997561084fd81066acf96cba`.

## Findings

All 203 services and 75 connection records were reviewed. The current citations need improvement or clarification on 81 service records and 49 connection records. These counts describe evidence quality, not invalid service offerings.

| Current citation support | Services | Connections |
|---|---:|---:|
| Direct support | 122 | 26 |
| Partial support | 77 | 48 |
| Background only | 3 | 1 |
| No supporting source found | 1 | 0 |
| Unable to verify | 0 | 0 |

## Scope

- 159 Concepts and 44 SOW templates.
- 201 canvas services plus SOW-only CW00 and X01.
- All 75 connection descriptions, data directions, prerequisites and attached source/flow links.
- 190 distinct original URLs. 188 returned readable page content. The old Commerce overview has a verified replacement; the security PDF remains unverified.
- Application code, Concept labels, hours, prices and deployment were not changed.

## The Workspace example

CJ04 should link primarily to [Create Projects](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/create-projects). Keep the service and Concept label. Scope browser Analysis Workspace projects explicitly; include [mobile scorecards](https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/create-scorecard) only when the engagement actually includes that deliverable.

## High-priority findings

### A05: Governance and change management

Adobe documents agents for AEM as a Cloud Service and Edge Delivery Services and supports automated brand checks. This service commits to configured checks without confirming the client's Governance Agent access, policy setup and supported checking workflow.

**Correction:** Add: "Before committing to configured automated checks, confirm Governance Agent access and the supported workflow for the Client's AEM or Edge Delivery authoring route; configure the agreed brand policy and validate checks on the agreed templates. If that capability is unavailable, scope a partner-run standards, review and approval process and revise the automated-check deliverable and acceptance criteria before delivery." Add Overview of Agents in AEM and How to Import a Brand Policy.

- [S076: Governance Agent Overview | Adobe Experience Manager](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agents/governance/overview), Brand Governance
- [S216: Overview of Agents in AEM](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agents/overview), Accessing Agents; Limitations
- [S214: How to Import a Brand Policy](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/brand-governance/how-to-import-a-brand-policy), Import a Brand Policy

### XA03: Journey Optimizer Decisioning and recommendations

The blueprint supports next-best-offer logic but mixes current Decisioning with legacy Decision Management terminology and placements. Behavioral recommendations are a distinct pattern on another page. The capabilities exist; the citation and implementation vocabulary need separation.

**Correction:** Replace the lead citation with Get started with Decisioning and add Behavioral recommendation. Replace scope with: “Configure decision items and collections, eligibility rules, ranking methods, selection strategies and decision policies using RTCDP audiences and attributes. Where included, configure behavioral recommendation strategies and validate the required catalog and behavioral signals.” Keep legacy placements only in explicitly scoped Decision Management work.

- [S030: Offer Decisioning | Adobe Journey Optimizer](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/offer-decisioning), Use case overview; applications; related documentation
- [S249: Get started with Decisioning](https://experienceleague.adobe.com/en/docs/journey-optimizer/using/decisioning/experience-decisioning/gs-experience-decisioning), Decisioning key steps
- [S204: Behavioral recommendation](https://experienceleague.adobe.com/en/docs/blueprints-learn/architecture/use-case-patterns/personalization-patterns/behavioral-recommendation), Use case overview; applications

### aemsites-bv: AEM Sites + Brand Visibility

The managed-CDN setup is substantiated, but the cited security PDF could not be retrieved. The automatically configured AEM telemetry feed therefore remains unverified in this audit.

**Correction:** Keep the verified edge route. Mark the automatic AEM-to-Brand-Visibility telemetry flow "Requires Adobe confirmation" and remove "set up automatically" from an unqualified promise until a readable Adobe implementation reference or customer-specific confirmation is recorded. Add Optimize at Edge for source-change behavior and a current product-description citation for the optimization allowance.

- [S049: Optimize at Edge - AEM Cloud Service Managed CDN (Fastly) | Adobe Brand Visibility](https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/aemcs-managed-cdn), Managed-CDN setup
- [S050: Optimize at Edge | Adobe Brand Visibility](https://experienceleague.adobe.com/en/docs/brand-visibility/using/resources/optimize-at-edge/overview), Content-change FAQ
- [S183: Internal Error ()](https://www.adobe.com/cc-shared/assets/pdf/trust-center/ungated/whitepapers/experience-cloud/adobe-brand-visibility-security-overview.pdf), Unretrievable PDF
- [S271: Adobe Trust Center: Resources](https://www.adobe.com/trust/resources.html), Access requirements
- [S269: Adobe Brand Visibility: Product Description](https://helpx.adobe.com/legal/product-descriptions/adobe-brand-visibility.html), Optimizations

## How to use the complete audit

Open `sow-citation-audit-report.html` for the searchable report. `sow-citation-audit-data.json` contains every record, the exact current scope, current citations, evidence sections, recommendations, retrieval status, and snapshot hashes. The Excel workbook provides filterable Services, Connections and Sources tables with a formula-linked summary.

Verdicts assess the citations currently attached to the catalog, not a hypothetical corrected version. Direct support validates the documented capability and service fit; it does not mean Adobe endorses partner hours, prices or outcomes. Existing manual-workflow qualifications count. Generic partner work such as X01 executive workshops does not need an invented Adobe capability citation.

The audit is a point-in-time documentation assessment. Customer-tenant behavior, contract entitlements, effort estimates and regulatory suitability were not tested. Unretrievable material is not treated as proof of an absent capability.

## Implementation handoff

1. Apply the exact row-level changes to the authored catalog and SOW source, preserving saved-state migration and build conventions.
2. Use primary and supporting citations for compound offerings. Do not force all claims behind one generic landing-page link.
3. Keep Concept unchanged. Distinguish partner delivery plans and estimates from documented product capabilities.
4. Resolve the visible verification exceptions before relying on them in a customer SOW.
5. Regenerate and run the repository's required checks if application changes are later authorized.

This commit contains audit findings only.
