// Mockup (Nov 4 2026, Adam): 1) the bolt always sits in the middle of its line, between the two products; 2) Add outside
// system on Create your own play too, listing every outside system: those that connect to a product on the canvas can be
// added, the others say which product they need. Not built.   node sow/mockups/nov4_bolt/mock_center_outside.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', '..', 'site', 'index.html'), OUT = __dirname;
const CSS = `.ib{width:30px;height:30px;padding:0;justify-content:center;border-radius:50%}.ib span{display:none}.ib svg{width:15px;height:15px}`;
const centre = () => document.querySelectorAll('.ib').forEach(b => { const e = document.querySelector(`.edge[data-c="${b.dataset.c}"]`); if (!e) return; const q = e.getPointAtLength(e.getTotalLength() / 2); b.style.left = q.x + 'px'; b.style.top = q.y + 'px'; });
(async () => { const b = await chromium.launch();
  const open = async (s, h = 900) => { const p = await (await b.newContext({viewport: {width: 1440, height: h}, deviceScaleFactor: 2})).newPage(); await p.goto(PAGE);
    await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 200, size: 'large', ...s})), s); await p.reload(); await p.waitForTimeout(1100);
    await p.evaluate(([css, c]) => { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); new Function(c)(); }, [CSS, `(${centre})()`]); await p.waitForTimeout(150); return p; };
  let p = await open({play: 'custom', on: ['cja', 'cw']}); await p.screenshot({path: path.join(OUT, 'centre_cja_coworker.png'), clip: {x: 0, y: 330, width: 1440, height: 570}}); await p.context().close();
  p = await open({play: 'custom', on: ['cja', 'commerce']}); await p.screenshot({path: path.join(OUT, 'centre_cja_commerce.png'), clip: {x: 0, y: 330, width: 1440, height: 570}}); await p.context().close();
  // the menu on Create your own play, with CJA and Commerce on the canvas
  p = await open({play: 'custom', on: ['cja', 'commerce']}, 900);
  await p.evaluate(() => { const w = document.getElementById('outwrap'), add = document.getElementById('addwrap'); w.hidden = false; add.after(w);
    const rows = [['dwh', 'Connects to CJA', true], ['cstore', 'Connects to CJA', true], ['crm', 'Connects to CJA', true], ['cdn', 'Connects to Brand Visibility: add it first', false]];
    const m = document.getElementById('out-menu');
    m.innerHTML = `<div class="hd"><div class="k">Add an outside system</div><p>Systems the customer already runs. Each connects through a route Adobe documents.</p></div><div class="g">Connects to your products</div>` +
      rows.map(([id, tag, okk]) => `<button class="it2" role="menuitem" ${okk ? '' : 'disabled style="opacity:1;cursor:not-allowed;background:#F4F4F4"'}><span class="nm">${P[id].icon && I[P[id].icon] ? I[P[id].icon] : ''}${P[id].name}</span><span class="ctag"${okk ? '' : ' style="color:#3A3A3A;border-color:#3A3A3A"'}>${tag}</span><span class="sys">${P[id].systems || ''}</span></button>`).join('');
    m.hidden = false; placeAdd(); });
  await p.waitForTimeout(300); await p.screenshot({path: path.join(OUT, 'outside_on_own_play.png')}); await p.context().close();
  await b.close(); })();
