// As built (step 81): the Download menu with four plain lines.
const path = require('path'); const {open} = require(path.resolve(__dirname, '../../rfp_prototype/review_2026-11-09/harness.js'));
(async () => { const h = await open({scale: 2}), p = h.page; await p.setViewportSize({width: 1100, height: 900});
  await p.goto(p.url().split('#')[0] + '#rfi'); await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(() => RFPBuilder.load('division_rfp.txt', 'Request for Proposals 77-A: AEM Forms Implementation\n\n3.1 Describe how you would create a form data model for our data sources in AEM Forms.\n\n4.1 Provide three references from similar projects.')); await p.waitForTimeout(300);
  await h.setStatus(0, 'used'); await p.waitForTimeout(200); await p.click('#rfp-download-menu'); await p.waitForTimeout(200);
  const b = await (await p.$('#rfp-dl-menu')).boundingBox(), t = await (await p.$('#rfp-download-menu')).boundingBox(), sy = await p.evaluate(() => window.scrollY);
  await p.screenshot({path: path.join(__dirname, 'built_menu.png'), fullPage: true, clip: {x: Math.max(0, b.x - 24), y: t.y + sy - 16, width: b.width + 48, height: b.y + b.height - t.y + 36}});
  await h.close(); })().catch(e => { console.error(e); process.exit(1); });
