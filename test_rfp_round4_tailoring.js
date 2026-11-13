// Round 4: dates must come from the current RFI, at the precision it states; useful background must not become ask echoes.
// This test serves the built page with the current source inlined, exposing only the timing/opener helpers inside this test page.
// Synthetic scopes deliberately reuse question objects to exercise changed background and absent dates.
const fs = require('fs'), path = require('path');
const ROOT = process.env.WARROOM_ROOT || path.resolve(__dirname, '..');
const {open} = require(path.join(ROOT, 'sow/rfp_prototype/review_2026-11-09/harness.js'));
let failures = 0, checks = 0;
const ok = (value, message, detail = '') => { checks++; console.log((value ? '✅ ' : '❌ ') + message + (value || !detail ? '' : ' [' + detail + ']')); if (!value) failures++; };
(async () => {
  let source = fs.readFileSync(process.env.RFP_TAILORING_SOURCE || path.join(ROOT, 'sow/rfp_answers.js'), 'utf8');
  const anchor = 'window.RFPAnswers={';
  if (source.split(anchor).length !== 2) throw new Error('Expected one answer export anchor');
  source = source.replace(anchor, 'window.__round4Timing={phaseLine,rfiLaunch,toldUs};\n' + anchor);
  const built = fs.readFileSync(path.join(ROOT, 'sow/site/sow/index.html'), 'utf8');
  const runtime = /<script id="rfp-answers">[\s\S]*?<\/script>/;
  if (!runtime.test(built)) throw new Error('Missing built answer runtime');
  const html = built.replace(runtime, () => '<script id="rfp-answers">\n' + source + '\n</script>');
  const h = await open();
  try {
    await h.page.route('**/index.html*', route => route.fulfill({status: 200, contentType: 'text/html; charset=utf-8', body: html}));
    await h.page.reload();
    await h.page.waitForFunction(() => !!window.__round4Timing);
    await h.text('A.1 Describe how you would implement AEM Sites and its page templates.');
    const phase = async paragraphs => h.eval(paragraphs => {
      RFPBuilder.state.paragraphs = paragraphs;
      RFPBuilder.state.name = 'synthetic-scope.txt';
      RFPBuilder.state.questions = RFPBuilder.state.questions.filter(q => q.label === 'A.1');
      return Object.fromEntries(['discovery', 'build', 'launch', 'after launch'].map(p => [p, window.__round4Timing.phaseLine(p)]));
    }, paragraphs);
    let r = await phase(['We expect mobilisation in January 2028, approval of design and scope by March, a faculty pilot in June and main-site launch by 16 August 2028.']);
    ok(/approval milestone by March/.test(r.discovery) && !/March 2028/.test(r.discovery), 'discovery uses the stated approval month without inventing its year', r.discovery);
    ok(/approval milestone by March/.test(r.build) && /pilot in June/.test(r.build) && /launch by 16 August 2028/.test(r.build), 'build connects approval, pilot and the main launch', r.build);
    ok(/pilot in June/.test(r.launch) && /launch by 16 August 2028/.test(r.launch), 'launch phase connects pilot testing to main cutover', r.launch);
    ok(/month after your launch by 16 August 2028/.test(r['after launch']), 'ongoing work starts relative to the main launch', r['after launch']);
    r = await phase(['Design approval is due by 8 February 2029. A pilot is scheduled for April 2029. Public-site launch is planned for 15 July 2029.']);
    ok(/8 February 2029/.test(r.discovery) && /pilot in April 2029/.test(r.build) && /launch on 15 July 2029/.test(r.launch), 'a changed scope replaces earlier dates and preserves month-only pilot precision', JSON.stringify(r));
    ok(!/2028|August|June/.test(JSON.stringify(r)), 'reused questions do not keep stale milestone dates');
    r = await phase(['We expect a pilot launch on 9 April 2030 and main-site launch by 21 May 2030.']);
    ok(/pilot on 9 April 2030/.test(r.launch) && /launch by 21 May 2030/.test(r.launch), 'pilot launch does not steal the main launch date', r.launch);
    r = await phase(['Our target is to release the first market on 4 September 2031.']);
    ok(Object.values(r).every(x => /your launch on 4 September 2031/.test(x)), 'a single explicit first-market launch remains the fallback for every phase', JSON.stringify(r));
    r = await phase(['Our previous public-site launch was on 2 August 2023. We will launch the replacement on 7 July 2032.']);
    ok(Object.values(r).every(x => /7 July 2032/.test(x)) && !/2023/.test(JSON.stringify(r)), 'a historical launch is not used as the proposed project launch', JSON.stringify(r));
    r = await phase(['Design approval by March. The pilot is in June. Launch timing remains to be agreed.']);
    ok(/approval milestone by March/.test(r.discovery) && /pilot in June/.test(r.launch) && !/20\d\d/.test(JSON.stringify(r)), 'undated years stay unknown and pilot-only plans get no invented full launch date', JSON.stringify(r));
    r = await phase(['Approval, pilot and launch timing will be agreed during discovery.']);
    ok(!/January|February|March|April|May|June|July|August|September|October|November|December|20\d\d/.test(JSON.stringify(r)), 'removing milestones removes all earlier dates', JSON.stringify(r));
    const opener = async (question, paragraphs = []) => h.eval(([question, paragraphs]) => {
      const q = {label: 'A.1', text: question, kind: 'adobe'};
      RFPBuilder.state.questions = [q]; RFPBuilder.state.paragraphs = paragraphs;
      return window.__round4Timing.toldUs(q);
    }, [question, paragraphs]);
    let text = await opener('Propose an approach to loading our shared-drive content into AEM Assets and handling duplicate files and superseded manuals.', ['We hold approximately 42,000 images, drawings, manuals and certificates, totalling 3.2 TB, in shared drives.']);
    ok(/You told us: You hold approximately 42,000 images, drawings, manuals and certificates/.test(text), 'concrete background scale remains when it matches the asset work', text);
    // Reopening identical text creates fresh question objects; cached background owners must belong to those new objects.
    const reopened = await opener('Propose an approach to loading our shared-drive content into AEM Assets and handling duplicate files and superseded manuals.', ['We hold approximately 42,000 images, drawings, manuals and certificates, totalling 3.2 TB, in shared drives.']);
    ok(reopened === text && /42,000/.test(reopened), 'reopening an identical RFI retains its factual opener with fresh question objects', reopened);
    text = await opener('Our acceptance target is WCAG 2.2 AA; distinguish automated checks from manual tests. Explain how you would test AEM Sites.');
    ok(text === 'You told us: Your acceptance target is WCAG 2.2 AA.' && !/distinguish/.test(text), 'acceptance facts survive while appended response instructions are removed', text);
    text = await opener('Describe how you would bring store and loyalty data from our Snowflake data warehouse into Customer Journey Analytics.', ['Our store and loyalty data is in a Snowflake data warehouse.']);
    ok(/Your store and loyalty data is in a Snowflake data warehouse/.test(text), 'a relevant existing-system fact remains', text);
    text = await opener('Our objective is to improve every customer experience. Describe how you would build AEM Sites.');
    ok(text === '', 'generic objectives do not become factual openers', text);
    text = await opener('We need an approach to moving 900 pages into AEM Sites. Describe the migration method.');
    ok(text === '', 'a request does not become a factual opener merely because it contains a number', text);
    text = await opener('Describe how you would migrate our Drupal websites into AEM Sites.', ['Today we use Drupal for public websites, Salesforce for CRM, Snowflake as our data warehouse, Power BI for reporting, Akamai as our CDN and Genesys Cloud for our contact centre.']);
    ok(text === '', 'a long stack recital is not echoed into a narrow migration answer', text);
    text = await opener('Our current site runs on Drupal 9 and contains 900 pages. Describe how you would migrate the content into AEM Sites.');
    ok(/Your current site runs on Drupal 9 and contains 900 pages/.test(text), 'a concrete source-estate fact inside the question remains', text);
    ok(h.errors.length === 0, 'focused browser checks have no page errors', h.errors.join(' | '));
  } finally { await h.close(); }
  console.log(checks + ' tailoring checks; ' + failures + ' failures.');
  if (failures) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
