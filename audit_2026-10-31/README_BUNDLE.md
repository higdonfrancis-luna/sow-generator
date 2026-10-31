# ABV partner plays: response to the October 31 adversarial audit

This bundle answers "ABV Partner Plays: Adversarial Readiness Audit" (October 31, 2026), issue by issue.

| File | What it is |
|---|---|
| `CHANGE_LOG.md` | Every audit finding, what changed, the Adobe facts behind the change, and how it is tested |
| `UNRESOLVED.md` | What rewriting can't settle: delivery estimates for Deloitte, availability questions for Adobe, commercial calls for Adam |
| `CONNECTIONS.md` | All 59 canvas connections: type, Adobe's availability, prerequisites shown, and what changed in their wording |
| `site/` | The revised website, the same layout as the audited zip (the Build canvas at `/`, the SOW steps at `/sow/`). Also delivered on its own as `abvsow-site-audit-fixes.zip`. |
| `screenshots/` | The changed screens |
| `evidence/` | The planning bands behind every service's hours (`estimating_bands.json`), the corrected SOW text (`step14_text.json`), the connection types with Adobe's quotes (`connection_types.json`), and the fact checks, classifications and skeptics' verdicts (`audit_classification_2026-10-31.json`) |

To try it: serve `site/` from any static web server (for example `python3 -m http.server` inside `site/`) and open it in a browser. The SOW steps also open on their own from `site/sow/index.html`. The canvas starts with no rate: enter one.

Nothing has been deployed. abvsow.netlify.app still runs the earlier SOW tool.

Positioning until the open items close (the audit's own words): "a partner services design prototype grounded in Adobe's documented capabilities. The scopes, effort bands and fees are planning assumptions for joint validation."
