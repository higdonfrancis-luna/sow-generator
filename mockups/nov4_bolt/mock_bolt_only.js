// Mockup (Nov 4 2026, Adam): the Integrate pill is too long (it can run under a box), so the connection shows only the
// lightning bolt in a round button the size of the old i, and the hint at the bottom of the page explains it, with the
// same bolt. Not built.   node sow/mockups/nov4_bolt/mock_bolt_only.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', '..', 'site', 'index.html'), OUT = __dirname;
const CSS = `.ib{width:30px;height:30px;padding:0;justify-content:center;border-radius:50%}.ib span{display:none}.ib svg{width:15px;height:15px}
.hint .bolt{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:2px solid #EB1000;border-radius:50%;color:#EB1000;background:#fff;vertical-align:-6px;margin-right:6px}
.hint .bolt svg{width:12px;height:12px}.hint b{font-weight:700}`;
(async () => { const b = await chromium.launch();
  for (const [name, s] of [['bolt_only_cja_coworker.png', {play: 'custom', on: ['cja', 'cw']}], ['bolt_only_aem.png', {play: 'aem', out: ['cdn']}]]) {
    const p = await (await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2})).newPage();
    await p.goto(PAGE); await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, ...s})), s); await p.reload(); await p.waitForTimeout(1100);
    await p.evaluate(css => { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      const h = document.getElementById('hint'), bolt = document.querySelector('.ib svg') ? document.querySelector('.ib svg').outerHTML : '';
      const lead = h.textContent.split('. Click')[0];
      h.innerHTML = `<span class="bolt">${bolt}</span><b>Click a lightning bolt to see how two products integrate</b> and the services between them. ${lead}. Click a product to see its services; X takes a line out, the check brings it back.`; }, CSS);
    await p.waitForTimeout(200); await p.screenshot({path: path.join(OUT, name)}); await p.context().close(); }
  await b.close(); })();
