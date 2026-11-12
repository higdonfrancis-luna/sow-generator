# Prompt to continue the review (ChatGPT, second pass)

Upload the new `catalog_for_review.json` in the same chat as the first pass, and paste everything below the line.

---

Thank you. Your first pass was useful and I am verifying each finding against Adobe's pages now. Please continue the same review, with the same rules and the same four tables, from where you stopped.

**Use the attached file from now on. It replaces the one you had.** Two things changed:

1. **The empty descriptions were a fault in my export, not in the catalog.** 42 services now carry their full `what_the_partner_does`, plus a `deliverable` and `assumptions` field. Please drop the finding about 42 empty descriptions, and re-read the six services you reviewed that had blank descriptions (for example `C06`, `C01`).
2. **55 services still have an empty `quote_it_rests_on`.** That is known: they cite their Adobe page but no sentence was stored. Do not report it again. Where you can, propose the exact sentence from the cited page.

**Where to pick up**

- You covered the first four products (Real-Time CDP, Journey Optimizer, Target, Customer Journey Analytics) and every connection touching them: 59 of 150 connections and 122 of 517 services.
- **Start at product 5, Brand Visibility,** and work through the remaining products in the file's order, with every connection not yet checked.
- If you run out of room, stop at a product boundary and tell me which product is next. I will ask you to continue.

**Three things I would like you to weigh as you go**

1. **Where integration work should live.** Some integration services sit on a product (for example CRM sync under Marketo Engage, Acrobat Sign under AEM Forms) while others sit on the connection. Tell me each place where the same work could be billed twice because of this.
2. **Anything Adobe labels beta, limited availability, limited release, early access or labs today.** If a service or connection rests on one, list it in Table A. These are out by decision.
3. **Products with thin or no services of their own.** Adobe Commerce has none: its work sits on its connections. Say what core implementation work a partner would sell that is missing.

Keep the evidence rule: every finding needs the URL of an Adobe page you opened and a short exact quote from it. Start your answer with the same five lines of counts, and end with **Could not verify** and **Not checked**.
