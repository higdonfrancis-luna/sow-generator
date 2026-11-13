# The method knowledge base: brief for each batch (Nov 13 2026)

Adam (Nov 13): build out the knowledge base for every service, then test the answers it gives against the AI-written ones. The
RFI Builder will build each answer from this knowledge base with no AI at run time, in the same five parts the AI writes (our
approach, how we would do it, what you get, timeline and effort, risk we manage). The page adds the client's own facts (name,
timeline, sizes, systems, industry) and the hours; each entry here supplies the method.

## Input

`batches/batch_NN.json`: one entry per service in the partner's catalog, with its material:
- `name`, `owner` (the Adobe product, or the two products or systems a connection service joins), `unit` (one-time or monthly),
  `hours` (low, base, high: typical planning hours), `license` (what the client must license, if anything);
- `scope` (what the partner does), `adobe_quote` (a sentence checked word for word on the Adobe page), `source` (that page);
- for the plays' own services, `template_deliverable`, `template_acceptance`, `template_assumptions`, `template_exclusions`,
  `template_basis`;
- for connection services, `connection_how` (how the two work together);
- `product_facts`: sentences already checked on Adobe's pages about the products involved.

## Output

`drafts/batch_NN.json`: a JSON array with one object per input service, in the input order, each:

```
{"id": "...",
 "steps": ["...", ...],        3 to 6 steps, in order (see sizes below)
 "deliverables": ["...", ...], 2 to 5, named things the client receives
 "asks": ["...", ...],         0 to 3, what we need from the client (access, people, decisions, data)
 "risk": "...",                one sentence: the main risk of this work and how we handle it
 "outcome": "...",             one sentence: what the client has when it is done
 "kind": "workstream" | "task",
 "phase": "discovery" | "build" | "launch" | "after launch",
 "thin": true                  only when the material is too thin to say anything specific (see below)
}
```

Sizes, by `hours.base`: under 24 hours, 3 steps; 24 to 120, 3 or 4; 120 to 400, 4 or 5; over 400, 5 or 6. A monthly service
describes the monthly cycle (what happens each month) and its phase is "after launch".

`kind`: "workstream" for a whole piece of work that several questions in an RFI draw on (a site build, a migration program,
discovery and architecture, launch and cutover, a whole implementation of a product), usually 200 hours or more; "task" for the
rest. `phase`: where the work sits in a project (discovery, build, launch with training and cutover, after launch).

## The rules

1. **Adobe facts come from the material only.** Every Adobe product name, feature name, capability, limit or number in an entry
   must appear in that entry's own `scope`, `adobe_quote`, template fields, `connection_how` or `product_facts`. Use Adobe's
   names exactly as the material writes them. Never add a feature, setting, limit or number about Adobe that is not there.
2. **Our own practice is ours to describe**: inventories, workshops, mapping sheets, pilots, sampling, test sets, sign-offs,
   runbooks, cutover and rollback plans, acceptance checks, training sessions, reports. Make it concrete.
3. **Voice**: the partner speaking to the client. "We" is the partner, "you" and "your team" the client. Steps start with a verb
   ("Agree", "Map", "Set up"). Never "the Client", "your client" or "the partner". No client name and no client numbers: the page
   adds those.
4. **Plain words**: no em dashes and no en dashes (use a comma or a colon). No marketing words (seamless, robust, cutting-edge,
   world-class, best-in-class, leverage, unlock, empower, streamline, synergy). No promise of results (rankings, traffic,
   revenue) beyond what the work itself controls.
5. **Everything is available** (Adam's rule): never write beta, early access, limited availability, coming soon, a release date,
   "confirm with Adobe", "not stated by Adobe", or that we will get, obtain, check or verify anything with or from Adobe. A
   license the client must own is a prerequisite: leave it to the page, which names it from `license`.
6. **No prices, rates or hours** in the text: the page adds the hours.
7. **Lengths**: a step 10 to 30 words; a deliverable 2 to 10 words; an ask 6 to 20 words; the risk and the outcome 12 to 30
   words each.
8. **Thin material**: where the material says little beyond the service's name, write what the name plainly means with our own
   practice around it, add no Adobe detail, and set `"thin": true`.
9. Where the `scope` speaks to "the Client" or tells the partner to "confirm" something with the client, turn it into a step
   ("Agree with your data team ...") or an ask.

`examples.json` shows three finished entries: OX3 (a task with rich material), CJ05 (training), F02 (a whole workstream).
