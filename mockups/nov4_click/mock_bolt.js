// Mockup (Nov 4 2026, Adam): a lightning bolt on the connection pills. A: "Integrate" with the bolt (Adam's idea);
// B: the bolt with the service count. Line bolt icon, smaller type. Not built.
//   node sow/mockups/nov4_click/mock_bolt.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, 'click_prototype.html'), OUT = __dirname;
const BOLT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" style="vertical-align:-2px;margin-right:4px"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>';
(async () => { const b = await chromium.launch();
  for (const [name, mode] of [['bolt_integrate.png', 'A'], ['bolt_services.png', 'B']]) {
    const p = await (await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2})).newPage();
    await p.goto(PAGE); await p.evaluate(() => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, play: 'custom', on: ['rtcdp', 'ajo', 'commerce']}))); await p.reload(); await p.waitForTimeout(1000);
    await p.evaluate(([bolt, mode]) => { document.querySelector('.proto').textContent = mode === 'A' ? 'Option A: Integrate' : 'Option B: bolt + service count';
      const s = document.createElement('style'); s.textContent = '.ib.pill{font-size:13px;padding:0 11px;height:28px;line-height:23px}'; document.head.appendChild(s);
      document.querySelectorAll('.ib').forEach(el => { if (mode === 'B') { el.innerHTML = bolt + el.textContent; el.style.marginLeft = -(el.offsetWidth - 28) / 2 + 'px'; return; }
        /* A: drawn over the pill, so the prototype's count refresh leaves it alone */
        const o = el.cloneNode(false); o.removeAttribute('data-c'); o.className = 'ib pill'; o.innerHTML = bolt + 'Integrate'; o.style.marginLeft = '0'; el.style.visibility = 'hidden'; el.parentNode.appendChild(o);
        o.style.left = el.style.left; o.style.top = el.style.top; o.style.marginLeft = -(o.offsetWidth - 28) / 2 + 'px'; });
    }, [BOLT, mode]);
    await p.waitForTimeout(150); await p.screenshot({path: path.join(OUT, name), clip: {x: 380, y: 440, width: 700, height: 300}}); await p.context().close(); }
  await b.close(); })();
