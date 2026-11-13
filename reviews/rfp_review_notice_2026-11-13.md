# RFP deliverable review notice

Adam clarified that the source collection includes Adobe-owned publications beyond Experience League. The notice therefore says **Adobe-published sources**, without asserting that Adobe approved the generated response.

The shared wording is:

> Draft recommendations based on Adobe-published sources and the service catalog.
>
> Review all responses, cited sources, selected services, assumptions, effort and pricing thoroughly before sharing with a client. Confirm that the proposed scope and commitments meet the client's requirements.
>
> Publication of the source material does not mean Adobe has reviewed or approved this deliverable.

## Where it appears

- Beside the RFI download controls, in the printable response, and in the partner checklist.
- On a separate **Review before sharing** sheet in response and client-workbook XLSX exports. The sheet opens by default. Original worksheet indices, response columns and source numbering remain intact. A similarly named client sheet is preserved with a unique name for the added sheet.
- In a new column in CSV writeback, without shifting the client's rows or inserting caveats into response cells. Repeated downloads do not add columns to the in-memory workbook.
- In the Word proposal's opening notice, alongside the existing AI disclosure. The sources section now asks the reader to check support for each claim instead of asserting that every product statement is supported.

The notice sheet uses the existing context-sheet structure so importing it again does not create extra requirements. The Word title spacing is tightened to accommodate the longer cover notice.

## Word and Excel provenance

The attached Briarhaven Word file declares that it was written by AI. `rfp_proposal.js` always calls `/rfi/propose` for a plan and five written parts. Local code renders the file and builds the standard services and hours table from the catalog.

Excel export makes no AI call. It exports the current answers, which may be catalog-composed, manually edited, or previously generated through the optional AI answer feature. The attachment alone does not establish which path produced every Excel answer.

Two existing Word issues are recorded for separate follow-up: `proposalPack()` limits the supplied catalog to five Adobe products, whereas Briarhaven requested six; four proposal-writing parts receive only the first 8,000 characters of source text, plus the requirement list. The uploaded proposal describes Target as custom work and says the RFP is incomplete. These observations do not establish run-level causation. Neither limitation is fixed by this notice change.

No live AI call, deployment, change to the uploaded files, or reading of the third held-out RFI/key was performed.

## Validation

All **35 suites** pass, including 17 new checks covering actual downloads, preserved responses and unrelated sheets, source references, worksheet-name collisions, no-citation responses, reimport, values-only XLSX fallback and repeat CSV exports. The existing Word suite passes all 37 checks with the expanded notice.

The initial run needed focused reruns: two browser actions timed out under concurrent load; exact worksheet-name assertions needed the additional notice sheet; the response-language check now tests answer sections separately from the explicit review notice. A build/source comparison was restored after the method builder removed a trailing newline; the original, semantically identical catalog was retained and the site was repatched. All affected checks passed on rerun without weakening answer, source or original-cell checks.

Visual inspection covered desktop and mobile notices, printable HTML/PDF, and the rendered Word cover and sources page. The expanded Word notice fits on the cover. These checks validate notice placement, not the accuracy or completeness of the proposal content. An unusual source XLSX lacking a styles part still gets the notice, but its wrapping is not guaranteed. Existing answer-generation limitations remain as documented above and in the Briarhaven review.

`git diff --check` passes. Generated site content matches the checked source; catalog content, hours and AI-worker code are unchanged.
