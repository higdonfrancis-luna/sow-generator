# Prompt for an outside review of the RFP Builder prototype (Nov 9 2026)

Paste everything below the line into another model. Attach: `rfp_builder_prototype_2026-11-09.zip` (the page and its `lib/` folder; it runs from any static host or by opening `index.html`), `try/Northbridge_Mutual_Bank_RFP_2026.xlsx` (a made-up RFP to try), and the screenshots in `sow/mockups/nov9_ask_client/` (`built_tab_loaded.png`, `built_fact_typed.png`, `built_firm_typed.png`). If the model cannot run a page, the screenshots and the downloaded files are enough for the grading; the ideas need no running copy.

---

You are an adversarial reviewer. I work at Adobe on partner sales. My partners are systems integrators who implement Adobe Experience Cloud products (AEM Sites, Customer Journey Analytics, Real-Time CDP, Journey Optimizer, Target, Adobe Commerce, Marketo Engage, Workfront, Brand Visibility, Brand Concierge, Coworker). They win work by answering RFPs and RFIs, and they tell us the Adobe-product questions are the slow part: what the product does, how two products connect, what the client must have in place, what the implementation and run work is, and where the proof sits in Adobe's documentation.

We built a tool for them, the Partner services statement of work generator. A partner picks a play, puts Adobe products on a canvas, turns services on and off, enters their own hourly rate, and downloads a statement of work. Every service line carries a source link to Adobe Experience League or adobe.com. The attached prototype adds a fifth tab, RFP Builder. Grade that tab, and then tell us what is missing.

What the RFP Builder does today:

1. The partner drops the client's RFP (PDF, Word, Excel, CSV or text) or pastes the text. The file is read in the browser only. Nothing is uploaded, stored or sent anywhere, and there is no AI call. Everything is plain JavaScript over a catalog the page carries: 23 products, 75 documented product-to-product connections, about 200 sourced service lines.
2. It finds the questions and sorts them into three piles: Adobe services (it can draft these), Your firm (references, rates, team, legal; the partner writes these) and Not sure. The partner can move a question between piles.
3. Clicking an Adobe-services question shows a drafted answer in the partner's voice to the client ("we would", "you"): Our approach (how the products work or connect, from Adobe's pages), What we would do (the service lines, as "We will ..."), After launch (the monthly services), What you have in place (facts the partner types in, see 5), and Sources (Adobe pages only).
4. Under the response sits a boxed note for the partner, not for the client. It splits the connection's prerequisites into Part of this proposal (a license the play sells, for example the paid Brand Visibility offering when the client owns CJA) and Ask your client for (CDN log access, an Experience Platform user, a CJA administrator, data fields, acceptances).
5. Each Ask your client for item has a field. What the partner types lands in the response under What you have in place. Blank fields stay out of the response and on a separate checklist download.
6. Your firm questions have a text box. Use this answer, Edit, Skip and Next question on every answer.
7. Downloads: the RFP response as a document (every question in the RFP's order, drafted answers, typed firm answers, blanks for what is unwritten), the same response as an Excel workbook (a Response sheet with Number, Question, Response, Status, and a Sources sheet), and Questions for your client (the partner's checklist, never sent to the client).
8. Add to my statement of work carries the services behind the used answers into the SOW generator's Services step, so the proposal and the SOW come from the same catalog.

Rules we work under, so do not propose breaking them: no software pricing anywhere (partners price their own work only); nothing says a feature is in beta or gives a release date; no Adobe Consulting Services; sources are Adobe's public pages; partner-facing text leads with facts and sources and never sounds like a pitch; the client's documents never leave the browser; it runs as a static page on Adobe's internal prototype host (no server today). A server-side knowledge base or an AI call is possible later, but say what it would add that a static page cannot, not just that it would be nicer.

Planned next and not built: a static, sourced knowledge base for the questions the catalog cannot answer, such as where data is hosted, security certifications, accessibility, uptime and support terms, data retention and license packages.

Please do three things.

A. Grade it, hard. Try to break the question finder with real RFP shapes (numbered requirements with no question mark, tables with a Response column, compliance matrices with Yes/No/Partial, questions split across cells or pages, sub-questions a, b, c, mandatory versus desirable tags, appendices). Try to make it draft a wrong or overconfident answer. Judge the drafted answers as a procurement reader would: are they specific, sourced, honest about what the client has to supply, and free of filler? Judge the voice: are we ever talking to the wrong person? Give each finding a severity, the exact input that triggers it, and what you expected instead.

B. Tell us what is missing for a systems integrator filling out an RFP. Think about their whole week: intake and go/no-go, requirement traceability, compliance matrices, answer reuse across RFPs, team review and sign-off, pricing sections (theirs, not Adobe's), assumptions and exclusions, timelines and staffing plans, references and case studies, security questionnaires, the formats procurement portals demand, and what happens after the submission. For each idea: who uses it, what it saves them, whether it can be done in the browser from Adobe's public documentation or needs a server or an AI model, and roughly how big it is. Rank your top five.

C. Tell us what you would change about what is already there. Labels, order, what should be on by default, what the first-time partner will misread. Be concrete. Prefer "rename X to Y because Z" over general advice.

Output: a short verdict, then A, B and C as numbered lists. Quote exact UI text when you refer to it. If you could not run the page, say so and grade from the screenshots and the downloaded files.
