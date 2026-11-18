# SOW Generator walkthrough: run of show (about 20 minutes)

The ask: "a quick high-level walkthrough of the SOW generator, focused on HOW you built it, the databases you pulled from, how you connected the data, and how you refined it to where it is today."

The short answer to all four, if you only get one sentence:
**"I'm the builder. I wrote the rules and approved every change, and AI wrote the code. There's no database: it's three knowledge files built from 723 Adobe documentation pages, joined by service IDs, and it got here through 96 small approved steps and a lot of outside review."**

Have open before the call, in this order of tabs:

1. The tool: https://proto.adobe.io/sow-generator/ (Adobe login)
2. The briefing, scrolled to **How it was built** (new section, linked from the top of the page and the menu)
3. GitHub: `higdonfrancis-luna/sow-generator`, open on `canvas/catalog.json`
4. The sample RFP on your desktop: `rfp_prototype/try/Northbridge_Mutual_Bank_RFP_2026.xlsx` (made-up bank, safe to show)

---

## 1. Frame it (1 minute)

Say: "I'll show it working first, then pop the hood. Your four questions map to the four parts of the How it was built page, so you can keep that after the call."

## 2. Show it working (6 minutes)

This answers question 3 (how the data is connected) without saying so yet.

1. On the front page, pick **Brand Visibility + Customer Journey Analytics**.
   - Say: "The products land on the canvas already connected."
2. Click the **lightning bolt** between Brand Visibility and CJA.
   - Say: "This is a connection record: how the two products talk, what the client gains, and Adobe's page that says so."
   - Click the source link: it opens Experience League. "If Adobe doesn't say it, the tool doesn't say it."
3. Click the **Brand Visibility** box to show its services, with hours and a source link on each.
4. Click **Continue**, then on the Scope step leave 200 prompts and Typical size.
5. On Services:
   - Point at Launch, Connect and Optimize.
   - Type a rate, for example 175, and the totals collapse from a range to a number.
   - Say: "No Adobe pricing anywhere. The partner's rate, the partner's paper."
6. On Statement of work, click **Download SOW**.
7. Optional, 2 minutes: open the **RFI Builder** tab.
   - Drop in the Northbridge bank workbook.
   - Open one answer and show its citations, then click **Use this answer**.
   - Click **Add to my statement of work**: "Same service IDs, so the RFP answers turn into SOW lines."

## 3. Pop the hood (8 minutes)

Switch to the briefing's **How it was built** section and walk the four blocks.

**01 How was it built?** Read the five-step loop:

1. An idea or finding
2. A picture first
3. My yes
4. A numbered step
5. Checks, then publish

Then say:

- "That loop ran 96 times."
- "I never wrote code by hand. I wrote the rules in plain English, and the AI did the typing, research and testing."
- "My job was judgment: what to build, what a partner would believe, and what wasn't true."

**02 What data does it use?** This is the "databases" question. Say it straight:

- "There's no database server. There are three files:
  - the catalog (products, connections, services, hours)
  - the facts (security, hosting, licensing)
  - the methods (how each service gets delivered)."
- "AI research agents read Adobe's public docs product by product. Every service was saved with its page and a quote, and a second pass re-checked them. No source, no service."
- "Why files? It's private because it runs in the partner's browser. It's free, it works offline, and every data change is a GitHub commit, so there's an audit trail."

In GitHub, show `canvas/catalog.json`: search for `bv-cja`, the same connection you clicked in the tool. Then search `"C01"` to show its service.

**03 How is the data connected?** Point at the four boxes, product, connection, service and play, joined by IDs. Then say:

- "At build time, Python merges the research into one catalog and checks every ID and source."
- "In the browser, the canvas hands the services to the SOW by ID, and the RFI Builder sends its picks to the same place."

**04 How did it get to here?** Walk the timeline:

- **Oct 28:** ChatGPT's one-page draft
- **Oct 29:** my rules, and live for partners
- **Oct 30 to 31:** the canvas
- **Nov 1 to 5:** hardening, with 28-agent verification and a 45-finding audit
- **Nov 8 to 9:** the RFI Builder, and the move to Proto
- **Nov 10 to 11:** 14 to 34 products, and blind scoring 8 to 0 against an existing Adobe draft
- **Nov 13:** the snapshot, with all 35 core test suites passing

Close on the three lessons:

- pictures before code
- a source for every claim
- a test for every bug

## 4. Close (2 minutes)

Say: "Next is a small partner pilot with real RFPs. A delivery expert reviews every scope before it goes to a client, and we measure Brand Visibility wins against business as usual." That's the briefing's Partner pilot section.

---

## Questions you may get

- **"Did you write any code?"**
  - No. I directed it.
  - ChatGPT wrote the first draft.
  - Claude Code built everything since, and every change was approved from a mockup first.
- **"How long did it take?"**
  - About three weeks, Oct 28 to Nov 13, alongside the day job.
- **"Where do the hours come from?"**
  - They're planning estimates, because Adobe publishes none.
  - Each service has a small, typical and large number, tuned by reviewers.
  - Partners change any line.
- **"Can it be wrong?"**
  - Yes. That's why every line links to its Adobe source and the tool calls itself a starting point.
  - Known limits are listed in the briefing's Evidence section: some requirements pick the wrong lead service, and service-quality review is still needed.
- **"Does anything leave the browser?"**
  - Not in the core workflow.
  - The one exception is an optional "Read with AI" button in the RFI Builder, which calls a separate AI worker.
- **"Who keeps the sources current?"**
  - Today, me. Naming an owner is an open item for the pilot.
- **"How hard is it to add a product?"**
  - A research wave of several products took about a day: research, mockup, my yes, build, tests.
- **"Could my team build one?"**
  - Yes, if they follow the same loop:
    1. Write the rules first.
    2. Approve pictures before code.
    3. Require a source for every fact.
    4. Leave a test behind for every fix.
