// Draw the poster for the watch page: the video's closing frame with a play button and the length.
//   node build/render_poster.js        (run from the overview_video folder; writes proto/poster.png)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const tl = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'timeline.json'), 'utf8'));
  const len = `${Math.floor(tl.duration / 60)}:${String(Math.round(tl.duration % 60)).padStart(2, '0')}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(__dirname, '..', 'anim/animate.html'));
  await page.evaluate(() => window.READY);
  await page.evaluate(t => window.render(t), tl.duration - 0.5);
  await page.evaluate(len => {
    const add = html => document.getElementById('stage').insertAdjacentHTML('beforeend', html);
    add(`<div style="position:absolute;left:890px;top:806px;width:140px;height:140px;border-radius:50%;background:#EB1000;border:6px solid #fff;box-shadow:0 10px 28px rgba(0,0,0,.30)">
      <div style="position:absolute;left:49px;top:35px;border-left:46px solid #fff;border-top:29px solid transparent;border-bottom:29px solid transparent"></div></div>`);
    add(`<div style="position:absolute;right:92px;top:985px;background:#1a1a1a;color:#fff;font-size:22px;font-weight:700;border-radius:8px;padding:3px 12px">${len}</div>`);
  }, len);
  await page.screenshot({ path: path.resolve(__dirname, '..', 'proto/poster.png') });
  console.log('proto/poster.png', len);
  await browser.close();
})();
