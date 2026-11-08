# Customer-facing product copy

Adam requested that service and product descriptions omit beta labels and dates
or promises about when product features may be released. The customer-facing
copy also omits Early Access, Early Adopter, Limited Availability, release-history
conflicts and coming-soon language. These are replaced with the applicable
Client access, supported configuration and enablement prerequisites.

The policy applies to the canvas and problem picker, service definitions, inherited connection
assumptions, SOW preview, saved drafts and downloads. The original audit and
research evidence remain available for internal provenance.

`sow/product_copy_rules.json` contains the reviewed wording replacements and
narrow product-release timing patterns. `sow/product_copy.py` applies them during
review application and builds. The same rules are embedded with
`sow/product_copy.js` in both standalone pages to clean older service text when a
draft is opened or saved. Client names, project dates, site launch timelines,
quantities, effort and rates are preserved.

Validation:

```sh
python3 sow/qa/check_product_copy.py
python3 sow/qa/check_citation_review.py
```

The browser citation/draft/export suite also checks an older custom service with
beta and feature-release timing text, preserving its quantity, hours, rate and
Client start date. Historical template migration was checked across 1,665
text cases. The regular browser workflow runs the original suites plus the
citation and product-copy checks.

The historical paragraph comparison applies the copy policy to its reference text before comparing words. It still requires the same paragraph counts and tests the edit box, preview, CSV, downloaded SOW and PDF layout.

All 14 validation suites passed on `55e5bad20d438a8879e4aaf1376ea94f8eca0756`: https://github.com/higdonfrancis-luna/warroom/actions/runs/42455493071. Exact suite results and local checks are recorded in `product-copy-validation.json`. Nothing was merged or deployed.
