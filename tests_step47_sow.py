"""Step 47, the SOW-step pass: the earlier checks that test behaviour or wording this pass changed on purpose
(sow/audit_2026-11-05/FINDINGS.md items 9, 13, 15, 20 and 33). Run once on the step 46 checks.
- 13: Download, Print and CSV also wait for the schedule, both parties and a rate, and the SOW no longer prints the
  rates to-do, so the checks that download name the parties and write a schedule (and check.py enters a rate).
- 20: typed hours take a band when the partner leaves the field, so the check leaves the field.
- 9: L02's wording changed, so step 46's earlier-wording check starts from L02's step 46 wording (in PRIOR47).
- 15 and 33: the warehouse dependency, the warehouse box's systems and A03's exclusion have new wording.
- 13: the B07 check's coworker draft has unpriced starter lines, so it enters a rate before its CSV (CW01 keeps its own rate).

    python3 sow/tests_step47_sow.py
"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))


def patch(name, edits):
    p = os.path.join(HERE, name)
    t = open(p, encoding='utf-8').read()
    dashes = t.count('\u2014') + t.count('\u2013')
    for old, new, n in edits:
        assert t.count(old) == n, (name, t.count(old), old[:90])
        t = t.replace(old, new)
    assert t.count('\u2014') + t.count('\u2013') == dashes, 'no new dashes'
    open(p, 'w', encoding='utf-8').write(t)


patch('check.py', [
    ("        check('SOW document still asks for the rates rather than printing a range', note == 1)\n",
     "        rates = await fresh.text_content('#readiness')\n"
     "        check('the SOW prints no to-do for the rates; Before you issue asks for them, and no range is printed (step 47)', note == 0 and 'Hourly rates: enter your rate' in rates, rates[:200])\n", 1),
    ("        await fresh.fill('[data-line=\"O02\"] [data-line-field=\"hours\"]', '64')\n",
     "        await fresh.fill('[data-line=\"O02\"] [data-line-field=\"hours\"]', '64')\n"
     "        await fresh.locator('[data-line=\"O02\"] [data-line-field=\"hours\"]').blur()\n", 1),
    ("check('typed hours equal to a band take that band, with no reason asked'", "check('typed hours equal to a band take that band once the field is left (step 47), with no reason asked'", 1),
    ("        await fresh.fill('[data-meta=\"terms\"]', 'Time and materials, invoiced monthly; 5-day review windows; change control per the MSA.')\n",
     "        await fresh.fill('[data-meta=\"terms\"]', 'Time and materials, invoiced monthly; 5-day review windows; change control per the MSA.')\n"
     "        await fresh.fill('[data-meta=\"customer\"]', 'Acme Co')\n"
     "        await fresh.fill('[data-meta=\"partner\"]', 'Partner Co')\n"
     "        await fresh.fill('[data-meta=\"timeline\"]', 'Weeks 1 to 4: setup and baseline; monthly reviews from week 5.')\n"
     "        await fresh.fill('[data-meta=\"rate\"]', '150')\n", 1),
    ("check('with the reason and the terms written, the SOW is ready to issue'", "check('with the reason, the terms, the parties, the schedule and a rate written, the SOW is ready to issue'", 1),
])

patch('test_step46.js', [
    ("const e = state.estimates.cja, now = e.L02.scope, old = now.split('the Client').join('the customer');",
     "const e = state.estimates.cja, now = e.L02.scope, old = (((PRIOR47.L02 || {}).scope || [])[0] || now).split('the Client').join('the customer');", 1),
])

PARTIES = "state.customer = state.customer || 'Acme Co'; state.partner = state.partner || 'Partner Co'; state.timeline = state.timeline || 'Weeks 1 to 4: setup and baseline; monthly reviews from week 5.';"
patch('test_review_nov2.js', [
    ("state.terms = t;", "state.terms = t; " + PARTIES, 13),
    ("  const csvOf = async p => {",
     "  // step 47: a SOW is issued only with both parties and a schedule, so the checks that download name them\n"
     "  const PARTIES47 = () => { " + PARTIES + " save(); return step; };\n"
     "  const csvOf = async p => {", 1),
    ("const back = await p.evaluate(() => step);", "const back = await p.evaluate(PARTIES47);", 2),
    ("await download(p, async () => { await p.evaluate(() => { const r = state.estimates.coworker.CW01;",
     "await download(p, async () => { await p.evaluate(() => { " + PARTIES + " state.rate = state.rate || 150; const r = state.estimates.coworker.CW01;", 1),
    ("hypercare period stated in Included work", "hypercare period in this service\\'s scope", 2),
    ("Spark configuration), allows Adobe\\'s IP addresses where the warehouse needs it and turns on change tracking for each table. Data Mirror needs CJA Select, Prime or Ultimate',",
     "Spark configuration) and allows Adobe\\'s IP addresses where the warehouse needs it. Change tracking is on for each table; Data Mirror for CJA needs CJA Select, Prime or Ultimate',", 1),
    ("'Snowflake, Google BigQuery or Azure Databricks, through Data Mirror'", "'Snowflake, Google BigQuery or Azure Databricks (Data Mirror for CJA and Journey Optimizer; tables copied on a schedule for Real-Time CDP)'", 2),
])
print('step 47 (SOW pass): the earlier checks follow the intended changes')
