// The Add product menu from the Small builds mockup, without the five-product limit (no meter, no count, no Lead tag)
const {chromium} = require('playwright'); const path = require('path');
const DIR = __dirname, PAGE = 'file://' + path.join(DIR, 'cap.html');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1600, height: 950}}); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(PAGE); await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} }); await p.reload();
  await p.waitForFunction(() => window.READY === true);
  await p.evaluate(() => capDemo('interact')); await p.click('#add-btn');
  await p.addStyleTag({content: '#meter,#count,.leadtag{display:none!important}'});
  await p.mouse.move(3, 3); await p.waitForTimeout(900); await p.hover('#add-menu [data-add="rtcdp"]'); await p.waitForTimeout(400);
  await p.evaluate(() => { const q = document.querySelector('#add-menu .hd p'); if (q) q.textContent = 'Products that connect to your canvas come first.'; });
  await p.waitForTimeout(300);
  await p.screenshot({path: path.join(DIR, 'menu_nocap.png')});
  console.log(errs.length ? errs : 'no errors'); await b.close();
})();
