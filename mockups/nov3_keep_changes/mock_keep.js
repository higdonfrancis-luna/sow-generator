// Mockup (Nov 3 2026, UNRESOLVED item 23): the one-time prompt a partner from the live site would see on Build after the
// deploy, when the live canvas held changes made after the last Save and continue. Drawn with the canvas's own dialog.
//   node sow/mockups/nov3_keep_changes/mock_keep.js
const {chromium} = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site'), OUT = __dirname;
const server = http.createServer((req, res) => { let u = decodeURIComponent(req.url.split('?')[0].split('#')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(SITE, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; } res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); fs.createReadStream(f).pipe(res); });
const show = () => {
  const d = document.getElementById('confirm');
  document.getElementById('confirm-title').textContent = 'Keep the changes you made on Build?';
  document.getElementById('confirm-text').innerHTML =
    'Your saved statement of work is back. Before this update, you also changed these on Build without pressing Save and continue:' +
    '<ul style="margin:10px 0 6px 18px;padding:0;line-height:1.6"><li>Content improvements for search and AI: <b>off</b></li><li>Delivery size: <b>Large</b> (saved: Typical)</li><li>Rate: <b>$210</b> an hour (saved: $150)</li></ul>' +
    'Total with these changes: <b>$267,120</b>. Saved total: <b>$219,600</b>.';
  document.getElementById('confirm-no').textContent = 'Keep my saved SOW';
  document.getElementById('confirm-yes').textContent = 'Keep these changes';
  d.hidden = false;
};
(async () => {
  await new Promise(r => server.listen(0, r)); const BASE = `http://localhost:${server.address().port}/`; const b = await chromium.launch();
  for (const [w, h, name] of [[1440, 900, 'keep_changes_desktop.png'], [390, 844, 'keep_changes_phone.png']]) {
    const p = await (await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 2})).newPage();
    await p.goto(BASE); await p.waitForTimeout(400); await p.click('#picker [data-play="cja"]'); await p.waitForTimeout(500); await p.fill('#rate', '150'); await p.waitForTimeout(300);
    await p.evaluate(show); await p.waitForTimeout(300); await p.screenshot({path: path.join(OUT, name)}); await p.context().close(); }
  await b.close(); server.close();
})();
