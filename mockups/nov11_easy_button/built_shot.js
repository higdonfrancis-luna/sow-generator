// As built (step 79): the round Build Answers with AI button, its reading and undo states, and Start over in the header.
const path = require('path'); const {open} = require(path.resolve(__dirname, '../../rfp_prototype/review_2026-11-09/harness.js'));
const DOC = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.',
  '3.1 Describe how you would create a form data model for our data sources in AEM Forms.', '3.2 Describe how you would convert 300 existing forms to adaptive forms in AEM Forms.',
  '3.3 Describe how you would train our staff on AEM Forms.', '4.1 Provide three references from similar projects.', '4.2 Describe your project management approach.'].join('\n\n');
(async () => { const h = await open({scale: 2}), p = h.page;
  await p.route('https://warroom-assistant.adam-d1a.workers.dev/rfi/read', async r => { await new Promise(x => setTimeout(x, 2500)); r.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({items: [{kind: 'adobe', ref: '3.1', text: 'Create a form data model for our data sources in AEM Forms.'}, {kind: 'firm', ref: '4.1', text: 'Provide three references.'}]})}); });
  await p.setViewportSize({width: 1280, height: 880}); await p.goto(p.url().split('#')[0] + '#rfi'); await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(t => RFPBuilder.load('RFP 2123-778 AEM Implementation.pdf', t), DOC); await p.waitForTimeout(300);
  const clip = {x: 0, y: 0, width: 1280, height: 880};
  await p.screenshot({path: path.join(__dirname, 'built_ready.png'), clip});
  await p.click('#rfp-ai'); await p.waitForTimeout(1300); await p.screenshot({path: path.join(__dirname, 'built_reading.png'), clip});
  await p.waitForFunction(() => /Undo/.test(document.getElementById('rfp-ai').textContent)); await p.waitForTimeout(300); await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({path: path.join(__dirname, 'built_undo.png'), clip});
  await h.close(); })().catch(e => { console.error(e); process.exit(1); });
