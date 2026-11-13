# The topic playbook: brief (Nov 13 2026)

Round 1 of the method knowledge base (`../README.md`) lost most where an RFI asked for work the partner's catalog has no service
for, so the tool answered with the nearest service's text: accessibility got site-setup steps, Core Web Vitals got authoring
steps, A/B testing without Adobe Target got nothing useful, consent and privacy got audience activation. The playbook gives the
RFI Builder a short, sourced method for each of these common asks, with no AI at run time. The page uses a topic when a question
matches its triggers and is about one of its products; the answer then reads: what the client told us, the topic's method, the
services it sits beside, the hours, the risk.

One file per topic, `topic_<id>.json`:

```
{"id": "accessibility",
 "title": "Accessibility",
 "triggers": ["WCAG", "accessibility", ...],  5 to 12 words or short phrases an RFI uses for exactly this ask; matched as whole
                                               words, any case. Specific: "performance" alone would fire on "campaign
                                               performance", so write "page speed", "Core Web Vitals", "site performance".
                                               "Akamai + CDN" needs both words anywhere in the question.
 "products": ["eds", "aemsites"],              catalog product ids the topic applies to (see below)
 "draws_on": {"eds": ["A01", "A03"], ...},     per product, the catalog services whose work this sits beside (the build, the QA)
 "steps": [...],                               4 or 5 steps, in order
 "deliverables": [...],                        3 or 4 named things the client receives
 "asks": [...],                                1 or 2 things we need from the client
 "risk": "...", "outcome": "...",              one sentence each
 "phase": "discovery" | "build" | "launch" | "after launch",
 "hours": {"low": n, "base": n, "high": n},    our planning estimate for the work this topic adds on top of the services it
                                               draws on (whole hours; a typical mid-size site), or null when it adds none
 "facts": [{"for": ["eds"], "text": "...", "quote": "...", "url": "...", "title": "..."}]   2 to 5 Adobe facts; title is
                                               the page's own title, as the answer's source list shows it
                                               ("aem.live: BYO CDN Setup", "Experience League: setConsent (Web SDK)")
}
```

Two optional keys: `"unless_products": ["target"]`, products the topic stands aside for when the question names one, the RFI has
chosen one or the question is about one (A/B testing without Adobe Target); and `"echo_laws": true`, for a topic whose first step
maps the laws behind the work (consent and privacy): the answer then names back the laws the question names (the Gramm-Leach-Bliley
Act, HIPAA).

The page picks a topic only where no service of the catalog answers the question (the lead service is a task its phrases clearly
match, or a phrase of it says the same words), and where two topics match, the one in the question's asking sentence. A topic's
own hours are counted once, in the first answer it gives; after launch they are hours a month.

Product ids: `eds` Edge Delivery Services, `aemsites` AEM Sites, `aemforms` AEM Forms, `commerce` Adobe Commerce, `cja` Customer
Journey Analytics, `rtcdp` Real-Time CDP, `ajo` Journey Optimizer, `aa` Adobe Analytics, `bc` Brand Concierge, `marketo` Marketo
Engage, `target` Adobe Target. Service ids and names are in `sow/canvas/catalog.json` (`lines`; each product's `lines` and `more`).

## The rules

1. **Adobe facts are quoted.** Every statement about what an Adobe product does, supports, includes or measures is a fact in
   `facts`, built on a quote copied word for word from a public Adobe page: Experience League (experienceleague.adobe.com),
   aem.live (www.aem.live), Adobe Developer (developer.adobe.com) or Adobe Help (helpx.adobe.com). Fetch the page with curl and
   copy the quote from it; never write a quote from memory. The `text` says no more than the quote does, in the partner's voice.
   Steps, deliverables, the risk and the outcome name no Adobe feature, setting, limit or number that is not in a fact.
2. **Our own practice is ours to describe**: audits, test plans, checklists, sampling, pilots, sign-offs, runbooks, release
   gates, training. Make it concrete and correct for the topic (WCAG 2.2 AA, Core Web Vitals and the like are public standards;
   describe them accurately).
3. **Voice**: the partner speaking to the client. "We" is the partner, "you" and "your team" the client. Steps start with a verb.
   Never "the Client", "your client" or "the partner". No client name.
4. **Plain words**: no em dashes and no en dashes. No marketing words (seamless, robust, cutting-edge, world-class,
   best-in-class, leverage, unlock, empower, streamline, synergy). No promise of results beyond what the work controls.
5. **Everything is available** (Adam's rule): never write beta, early access, limited availability, coming soon, a release date,
   "confirm with Adobe", "not stated by Adobe", or that we will get or check anything with or from Adobe. Never hold back a
   feature because Adobe labels it in any of those ways, and never show the label.
6. **No prices or rates.** Hours only in `hours`, never in the text.
7. **Lengths**: a step 10 to 30 words; a deliverable 2 to 10 words; an ask 6 to 20 words; the risk and the outcome 12 to 30
   words; a fact's text 10 to 40 words.
8. **For any RFI**, not one client: no client's numbers, systems or industry unless the topic is about that kind of system (a
   consent topic may name a consent management platform; a CDN topic may name Akamai, Cloudflare, Fastly and Amazon CloudFront).
