# The method knowledge base: brief for each batch's review (Nov 13 2026)

A first pass drafted one entry per service (`drafts/batch_NN.json`) from each service's material (`batches/batch_NN.json`) under
`BRIEF.md`. You are the second, independent pass. Your job is accuracy first, then the brief's rules.

## Read

1. `BRIEF.md` (the rules the entries must meet) and `examples.json` (the standard).
2. `batches/batch_NN.json` (each service's material: the only source of Adobe facts).
3. `drafts/batch_NN.json` (the entries to review).
4. `reviews/batch_NN_issues.txt` (what the checker found: ❌ lines must be fixed; ⚠️ lines are names or lengths to look at).

## Do, for every entry

1. **Every Adobe claim against the material.** Read each step, deliverable, ask, risk and outcome. Any Adobe product name,
   feature name, setting, capability, limit or number that is not in that service's own material (`scope`, `adobe_quote`,
   template fields, `connection_how`, `product_facts`, `name`, `owner`) comes out: rewrite the sentence from the material's own
   words, or as our own practice with no Adobe detail. Our own practice (workshops, inventories, pilots, test sets, sign-offs,
   runbooks, reports) stays.
2. **Every ⚠️ name** in the issues file: keep it only if the material carries it (a product or feature name exactly as Adobe
   writes it there) or it is a common term (a file type, a standard, a system the client named such as Salesforce). Otherwise
   rewrite.
3. **Every ❌ line**: fix it (step counts by hours, dashes, marketing words, release labels, ask-Adobe wording, prices or hours
   in the text, the wrong voice, a product not in the material).
4. **Sense**: the steps are in a sensible order and match the service's name and hours; the deliverables are things the client
   receives; the asks are what we need from the client; the risk names one real risk of this work and how we handle it; the
   outcome is what the client has when it is done, with no promise of results beyond the work.
5. Keep what is right. Do not shorten good entries or make them generic.

## Write

`reviewed/batch_NN.json`: the full array, every entry (changed or not), same shape and order as the draft. Read it back and
check it is valid JSON with one entry per service and no em dash or en dash anywhere. Change no other file.

Your final reply: one line, "batch NN: E entries, C changed", nothing else.
