// Mockup (Nov 4 2026, Adam): click to open instead of hover, and an "i" that says what it is. Frames: the canvas today,
// the canvas with service-count pills and counts on the boxes, and a card opened by a click. Not built.
//   node sow/mockups/nov4_click/mock_click.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', '..', 'site', 'index.html'), OUT = __dirname;
const SETUP = () => { localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, play: 'custom', on: ['rtcdp', 'ajo', 'commerce']})); };
const CSS = `
.ib.pill{width:auto;height:30px;border-radius:15px;padding:0 12px;font-size:14px;line-height:25px;white-space:nowrap;box-shadow:0 0 0 4px #F4F4F4}
.node .cnt{display:block;font-size:13px;font-weight:600;color:#C40000;margin-top:2px}
.node{flex-direction:column;gap:0;cursor:pointer}
.mk-tag{position:absolute;font:600 13px/1.3 inherit;color:#1C1C1C;background:#FFF4C2;border:1.5px solid #1C1C1C;border-radius:6px;padding:5px 9px;z-index:60;max-width:250px}`;
async function after(p) {
  await p.evaluate(css => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    const n = l => l === 1 ? '1 service' : l + ' services';
    document.querySelectorAll('.ib').forEach(b => { const c = C.find(x => x.id === b.dataset.c), k = all(c).filter(counted).length;
      b.classList.add('pill'); b.textContent = n(k); b.style.marginLeft = -(b.offsetWidth - 28) / 2 + 'px'; });
    document.querySelectorAll('#stage .node').forEach(e => { const o = P[e.dataset.p], k = all(o).filter(counted).length; const sp = document.createElement('span'); sp.className = 'cnt'; sp.textContent = k ? n(k) : 'Services on its connections'; e.appendChild(sp); });
    document.getElementById('hint').textContent = document.getElementById('hint').textContent.replace('Hover a product or an i to see its services', 'Click a product or a connection to see its services');
  }, CSS);
}
(async () => { const b = await chromium.launch();
  const mk = async () => { const c = await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 2}); const p = await c.newPage(); await p.goto(PAGE); await p.evaluate(SETUP); await p.reload(); await p.waitForTimeout(900); return p; };
  let p = await mk(); await p.screenshot({path: path.join(OUT, 'click_today.png')}); await p.context().close();
  p = await mk(); await after(p); await p.waitForTimeout(200); await p.screenshot({path: path.join(OUT, 'click_pills.png')}); await p.context().close();
  p = await mk(); await after(p); await p.waitForTimeout(200);
  const pill = p.locator('.ib').first(); await pill.click(); await p.waitForTimeout(500);
  await p.evaluate(() => { const card = document.getElementById('card').getBoundingClientRect(), x = document.querySelector('#card [data-close]');
    const t = document.createElement('div'); t.className = 'mk-tag'; t.textContent = 'Opened by a click. Stays open until X, a click elsewhere or Escape; hovering does nothing.';
    t.style.left = Math.max(10, card.left - 270) + 'px'; t.style.top = (card.top + 8) + 'px'; document.body.appendChild(t); });
  await p.screenshot({path: path.join(OUT, 'click_open.png')}); await p.context().close();
  await b.close(); })();
