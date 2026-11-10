// Mockup only (Nov 10 2026, Adam: do partners need the sources in the statement of work, or an option to append them; and
// a caveat that the services are recommendations and the partner decides). Draws both ideas on the built tool by changing
// the page in the browser only: nothing in the tool is changed.
//   node sow/mockups/nov10_sources_caveat/mock.js     writes sources_toggle.png, sources_off.png, sources_on.png, caveat_services.png, caveat_build.png
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site');
const T = {'.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript'};
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(SITE, u); if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, {'Content-Type': T[path.extname(f)] || 'text/plain'}); fs.createReadStream(f).pipe(res); });
const CAVEAT = 'These services and hours are a suggested starting point, drawn from Adobe’s public documentation. They are not requirements. Add, remove, reword and price them as you see fit: you decide what you propose to your client.';
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`;
  const b = await chromium.launch(), p = await (await b.newContext({viewport: {width: 1500, height: 1000}, deviceScaleFactor: 2})).newPage();
  await p.goto(BASE); await p.waitForTimeout(500); await p.click('#picker [data-play="commerce"]'); await p.waitForTimeout(500);
  await p.fill('#rate', '150'); await p.waitForTimeout(200);
  // the Build step, with the caveat under the hint
  await p.evaluate(t => { const n = document.getElementById('t-note'); n.textContent = 'Hours are planning assumptions, not a quote. Services are suggestions: you decide what to propose.'; }, CAVEAT);
  await p.screenshot({path: path.join(__dirname, 'caveat_build.png'), clip: {x: 0, y: 0, width: 1500, height: 520}});
  await p.click('#save'); await p.waitForURL('**/sow/index.html#scope', {timeout: 15000}); await p.waitForTimeout(800);
  // the Services step, with the caveat as a boxed note under the intro
  await p.click('[data-step="services"]'); await p.waitForTimeout(500);
  await p.evaluate(t => { const intro = document.querySelector('#services-panel .service-intro');
    const d = document.createElement('div'); d.style.cssText = 'border:1.5px solid #1C1C1C;border-left:6px solid #EB1000;border-radius:10px;padding:12px 16px;margin:14px 0 4px;font-size:15.5px;line-height:23px;color:#1C1C1C;background:#fff;max-width:980px';
    d.innerHTML = '<b>Your call.</b> ' + t; intro.insertAdjacentElement('afterend', d); window.scrollTo(0, 0); }, CAVEAT);
  await p.screenshot({path: path.join(__dirname, 'caveat_services.png'), clip: {x: 0, y: 0, width: 1500, height: 640}});
  // the Statement of work step: no references under each service, and a tick box that appends them as one appendix
  await p.click('[data-step="document"]'); await p.waitForTimeout(600);
  const state = on => p.evaluate(on => { const doc = document.querySelector('#sow-preview .sow-document'), acts = document.querySelector('#document-panel .top-actions');
    if (!window.__refs) { window.__refs = [];
      for (const d of [...doc.querySelectorAll('.sow-detail')]) { const h = d.querySelector('h4'); if (!h || h.textContent.trim() !== 'Capability references') continue;
        let s = d.parentElement; const title = (s.querySelector('h3') || {}).textContent || ''; window.__refs.push({title, html: d.querySelector('ul').outerHTML}); d.remove(); }
      const lab = document.createElement('label'); lab.id = 'mock-refs'; lab.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:8px;font-size:15.5px;font-weight:600;color:#1C1C1C;margin:0 0 14px auto;justify-content:flex-end';
      lab.innerHTML = '<input type="checkbox" style="width:18px;height:18px;flex:none;margin:0;padding:0;accent-color:#1C1C1C"> Add Adobe capability references as an appendix';
      document.querySelector('#document-panel .document-actions').insertAdjacentElement('afterend', lab); }
    document.querySelector('#mock-refs input').checked = on; const old = document.getElementById('mock-appendix'); if (old) old.remove();
    if (on) { const a = document.createElement('section'); a.id = 'mock-appendix'; a.style.cssText = 'margin-top:28px;padding-top:18px;border-top:1px solid #D9D9D9';
      a.innerHTML = '<h2 style="font-size:20px;margin:0 0 6px">Appendix: Adobe capability references</h2><p style="margin:0 0 10px">Adobe’s public documentation for the capabilities each service uses.</p>' +
        window.__refs.map(r => '<div class="sow-detail"><h4 style="letter-spacing:.4px">' + r.title.replace(/</g, '&lt;') + '</h4>' + r.html + '</div>').join('');
      doc.appendChild(a); }
    return window.__refs.length; }, on);
  const n = await state(false);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200); await p.screenshot({path: path.join(__dirname, 'sources_toggle.png'), clip: {x: 0, y: 0, width: 1500, height: 560}});
  await p.evaluate(() => { const hs = [...document.querySelectorAll('#sow-preview h3')].find(h => /Brand Visibility setup and baseline/.test(h.textContent)); hs.scrollIntoView({block: 'start'}); window.scrollBy(0, -210); });
  await p.waitForTimeout(300); await p.screenshot({path: path.join(__dirname, 'sources_off.png'), clip: {x: 0, y: 0, width: 1500, height: 1000}});
  await state(true);
  await p.evaluate(() => { document.getElementById('mock-appendix').scrollIntoView({block: 'start'}); window.scrollBy(0, -210); });
  await p.waitForTimeout(300); await p.screenshot({path: path.join(__dirname, 'sources_on.png'), clip: {x: 0, y: 0, width: 1500, height: 1000}});
  console.log('written; services with references:', n);
  await b.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
