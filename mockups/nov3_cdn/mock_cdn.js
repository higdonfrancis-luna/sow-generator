// Mockup (Nov 3 2026, after Adam's "ok"): a "Which CDN serves the site?" question on the AEM play's Scope step, in the
// style of the FSI "Brand Concierge today" card, and the SOW's Dependencies line for each answer. Not built.
//   node sow/mockups/nov3_cdn/mock_cdn.js
const {chromium} = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site'), OUT = __dirname;
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(SITE, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
const NOTES = {
  managed: 'Brand Visibility\'s edge fixes turn on with one switch in Brand Visibility on Adobe\'s managed CDN; Implement AEM Sites on Edge Delivery does it. Adobe documents the one-click route for AEM as a Cloud Service; confirm it for an Edge Delivery site with Adobe (abv-at-edge@adobe.com).',
  own: 'The customer\'s own CDN is the outer CDN, so Adobe\'s guidance is that the customer\'s IT or CDN team adds the edge routing rules, allows Adobe\'s edge user agent and creates the log-forwarding job. The partner prepares and checks them, and does them only with access the customer grants: add CDN readiness and routing and CDN log forwarding on the Services step if so.',
  unknown: 'Confirm in discovery which CDN serves the site. Until then the SOW lists the customer\'s CDN team as a dependency.'};
const DEP = 'The customer\'s own CDN (Akamai, for example) sits in front of the site. Its IT or CDN team adds the Optimize at Edge routing rules, allows the AdobeEdgeOptimize/1.0 user agent in robots.txt and bot rules, and creates the log-forwarding job in its CDN console, in an agreed change window, as Adobe\'s guidance describes. A missed window moves the deployment pilot and the AI-traffic baseline.';
const card = (sel) => {
  const html = '<div class="form-card" id="cdn-mock" style="margin-top:18px"><h3>Where the site is served</h3><label class="wide">Which CDN serves the site?<select><option' + (sel === 'managed' ? ' selected' : '') + '>Adobe-managed CDN (Cloud Manager)</option><option' + (sel === 'own' ? ' selected' : '') + '>The customer\'s own CDN (Akamai, Cloudflare, Fastly, CloudFront or other)</option><option' + (sel === 'unknown' ? ' selected' : '') + '>Not known yet: confirm in discovery</option></select></label><p class="hint">' + NOTES[sel] + '</p></div>';
  return html; };
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`; const b = await chromium.launch();
  for (const sel of ['managed', 'own']) {
    const p = await (await b.newContext({viewport: {width: 1440, height: 1000}, deviceScaleFactor: 2})).newPage();
    await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="aem"]'); await p.waitForTimeout(500); await p.fill('#rate', '150');
    await p.click('#save'); await p.waitForURL('**/sow/#scope'); await p.waitForTimeout(500);
    await p.evaluate(h => { const f = document.querySelector('#scope-panel .form-card'); f.insertAdjacentHTML('beforebegin', h); }, card(sel));
    const box = await p.$eval('#cdn-mock', e => { e.scrollIntoView({block: 'center'}); const r = e.getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; });
    await p.waitForTimeout(200);
    await p.screenshot({path: path.join(OUT, `cdn_question_${sel}.png`), clip: {x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: Math.min(1440, box.w + 48), height: box.h + 48}});
    if (sel === 'own') {
      await p.click('[data-step="document"]'); await p.waitForTimeout(500);
      const ok = await p.evaluate(d => { const li = [...document.querySelectorAll('#sow-preview li')].find(x => /^CDN log forwarding is set up by the customer/.test(x.textContent)); if (!li) return false;
        li.innerHTML = '<b>Customer CDN.</b> ' + d; li.id = 'dep-mock'; li.style.cssText = 'background:#fff;border-left:4px solid #EB1000;padding:4px 8px;margin-left:-12px'; return true; }, DEP);
      if (ok) { const r = await p.$eval('#dep-mock', e => { e.scrollIntoView({block: 'center'}); const s = e.closest('ul').parentElement.getBoundingClientRect(); return {x: s.x, y: s.y, w: s.width, h: Math.min(s.height, 520)}; });
        await p.waitForTimeout(200); await p.screenshot({path: path.join(OUT, 'cdn_sow_dependency.png'), clip: {x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 16), width: r.w + 32, height: r.h + 32}}); }
      else console.log('no Dependencies heading found');
    }
    await p.context().close(); }
  await b.close(); server.close();
})();
