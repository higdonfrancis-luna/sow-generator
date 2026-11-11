// RFI Builder step 79 (Nov 11 2026, Adam: "start over moved to next to back to homepage", "move the Build with AI
// button more centered", "can it look like the famous staples 'Easy Button'?", then "A sounds good" to
// sow/mockups/nov11_easy_button/option_a_round.png). The AI reader is stubbed here.
// Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step79.js
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const DOC = ['Request for Proposals 77-A: AEM Forms Implementation', 'The Division is replacing its forms software with AEM Forms. AEM Forms will be hosted by Adobe.',
  '3.1 Describe how you would create a form data model for our data sources in AEM Forms.', '3.2 Describe how you would convert 300 existing forms to adaptive forms in AEM Forms.',
  '4.1 Provide three references from similar projects.'].join('\n\n');
(async () => {
  const h = await open(), p = h.page;
  await p.route('https://warroom-assistant.adam-d1a.workers.dev/rfi/read', async r => { await new Promise(x => setTimeout(x, 1500));
    r.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({items: [{kind: 'adobe', ref: '3.1', text: 'Create a form data model for our data sources in AEM Forms.'}, {kind: 'firm', ref: '4.1', text: 'Provide three references.'}]})}); });
  const box = sel => p.$eval(sel, e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return {x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width / 2, vis: e.offsetParent !== null && s.display !== 'none', radius: s.borderRadius, bg: s.backgroundImage, color: s.color, op: s.opacity, text: e.textContent, shadow: s.boxShadow}; });

  // 1. the RFI Builder on its own (from the front door): nothing loaded yet
  await p.goto(p.url().split('#')[0] + '#rfi'); await p.reload(); await p.waitForTimeout(500);
  ok(!(await box('#rfp-clear')).vis && (await box('#rfi-back')).vis, 'with no RFI loaded there is no Start over; Back to the home page is in the header');

  // 2. an RFI is loaded: Start over beside Back to the home page; one round button, centered
  await p.evaluate(t => RFPBuilder.load('division_rfp.txt', t), DOC); await p.waitForTimeout(300);
  const so = await box('#rfp-clear'), back = await box('#rfi-back'), ai = await box('#rfp-ai'), cap = await box('#rfp-ai-cap'), drop = await box('#rfp-drop'), filters = await box('.rfp-filters');
  ok(so.vis && so.text === 'Start over' && await p.$eval('#rfp-clear', e => e.parentElement.classList.contains('topbar') && e.nextElementSibling.id === 'rfi-back'), 'Start over is in the header, just before Back to the home page');
  ok(Math.abs(so.y - back.y) < 3 && so.x + so.w <= back.x && back.x - (so.x + so.w) < 40 && so.x > 800, 'the two sit side by side at the top right', JSON.stringify([so.x, so.y, back.x, back.y]));
  ok(!await p.$('.rfp-ai-row #rfp-clear') && (await p.$$('#rfp-clear')).length === 1, 'Start over is no longer beside the AI button, and there is one of it');
  ok(ai.text === 'Build Answers with AI' && Math.abs(ai.w - 190) < 1 && Math.abs(ai.h - 190) < 1 && ai.radius === '50%', 'Build Answers with AI is a round button, 190 pixels across', JSON.stringify([ai.w, ai.h, ai.radius]));
  ok(/radial-gradient/.test(ai.bg) && /235, 16, 0/.test(ai.bg) && ai.color === 'rgb(255, 255, 255)' && ai.op === '1' && ai.shadow !== 'none', 'it is Adobe red with white words, raised on a gray base, nothing dimmed', ai.bg.slice(0, 120));
  ok(Math.abs(ai.cx - drop.cx) < 2, 'it is centered on the page, under the drop box', JSON.stringify([ai.cx, drop.cx]));
  ok(ai.y > drop.y + drop.h && cap.y > ai.y + ai.h && cap.y + cap.h < filters.y && cap.text === 'Reads the RFI and drafts your answers' && Math.abs(cap.cx - ai.cx) < 2 && cap.op === '1', 'it sits between the drop box and the filters, with one line under it saying what it does', JSON.stringify([ai.y, cap.y, filters.y, cap.text]));
  ok(await p.$eval('#rfp-ai', b => b.tagName === 'BUTTON' && !b.disabled) && await p.evaluate(() => { const b = document.getElementById('rfp-ai'); b.focus(); return document.activeElement === b; }), 'it is a real button that takes the keyboard');

  // 3. while it reads, and after
  await p.click('#rfp-ai'); await p.waitForTimeout(500);
  const busy = await box('#rfp-ai');
  ok(/^Reading with AI… 0:0\d$/.test(busy.text) && busy.radius === '50%' && busy.color === 'rgb(28, 28, 28)' && busy.op === '1' && (await box('#rfp-ai-cap')).text === 'Keep this tab open' && await p.$eval('#rfp-ai', b => b.disabled), 'while it reads the button stays round, counts the time in solid dark words, and the line under it says Keep this tab open', JSON.stringify([busy.text, busy.color]));
  await p.waitForFunction(() => /Undo AI reading/.test(document.getElementById('rfp-ai').textContent), null, {timeout: 20000}); await p.waitForTimeout(200);
  const undo = await box('#rfp-ai');
  ok(undo.text === 'Undo AI reading' && undo.h < 70 && undo.radius !== '50%' && undo.bg === 'none' && undo.color === 'rgb(28, 28, 28)' && Math.abs(undo.cx - drop.cx) < 2 && !(await box('#rfp-ai-cap')).vis, 'after a reading, Undo AI reading is a plain centered button, not the round one, with no line under it', JSON.stringify([undo.text, undo.h, undo.radius]));
  await p.click('#rfp-ai'); await p.waitForTimeout(200); const yes = await p.$('#rfp-replace-go'); if (yes && await yes.isVisible()) await yes.click(); await p.waitForTimeout(200);
  ok((await box('#rfp-ai')).text === 'Build Answers with AI' && (await box('#rfp-ai')).radius === '50%' && (await box('#rfp-ai-cap')).vis, 'undoing it brings the round button back');

  // 4. Start over still asks first and clears the RFI
  await p.click('#rfp-clear'); await p.waitForTimeout(150);
  ok(await p.isVisible('#rfp-start-over-modal'), 'Start over still asks before it clears');
  await p.click('#rfp-clear-confirm'); await p.waitForTimeout(200);
  ok((await h.eval(() => RFPBuilder.state.questions.length)) === 0 && !(await box('#rfp-clear')).vis, 'and then the RFI is gone and so is the Start over button');

  // 5. a phone: nothing runs off the side
  await p.setViewportSize({width: 390, height: 800}); await p.evaluate(t => RFPBuilder.load('division_rfp.txt', t), DOC); await p.waitForTimeout(300);
  const m = await box('#rfp-ai');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1) && m.x >= 0 && m.x + m.w <= 390 && (await box('#rfp-clear')).vis, 'on a phone the round button and Start over fit the screen', JSON.stringify([m.x, m.w]));
  await p.setViewportSize({width: 1500, height: 1100});

  // 6. the RFI Builder as a tab of the full tool: Start over shows only on that tab with an RFI loaded
  await p.goto(p.url().split('#')[0]); await p.reload(); await p.waitForTimeout(500);
  const tab = await h.eval(() => { const t = [...document.querySelectorAll('[role="tab"],.steps button,.steps a')].find(x => /RFI Builder/.test(x.textContent)); if (t) t.click(); return !!t; }); await p.waitForTimeout(300);
  await p.evaluate(t => RFPBuilder.load('division_rfp.txt', t), DOC); await p.waitForTimeout(300);
  const onTab = await p.isVisible('#rfp-panel') ? (await box('#rfp-clear')).vis : null;
  const other = await h.eval(() => { const t = [...document.querySelectorAll('[role="tab"],.steps button,.steps a')].find(x => /Services/.test(x.textContent)); if (t) t.click(); return !!t; }); await p.waitForTimeout(300);
  ok(tab && onTab === true && other && !(await box('#rfp-clear')).vis, 'in the full tool, the RFI\'s Start over shows on the RFI Builder tab only', JSON.stringify([tab, onTab, other]));

  ok(!h.errors.length, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? '\n' + fails + ' STEP 79 CHECKS FAILED' : '\nALL STEP 79 CHECKS PASSED (' + n + ')'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
