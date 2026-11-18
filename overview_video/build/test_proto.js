// Open the Proto zip the way a visitor would and click play.
//   node build/test_proto.js <url where the unzipped files are served> [folder for pictures]
const { chromium } = require('playwright');
(async () => {
  const [url, shots] = process.argv.slice(2);
  let fails = 0;
  const check = (ok, text) => { console.log((ok ? '✅ ' : '❌ ') + text); if (!ok) fails++; };
  const browser = await chromium.launch();
  for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2 });
    const errs = [], bad = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    if (shots) await page.screenshot({ path: `${shots}/proto_${name}.png` });
    const info = await page.evaluate(async () => {
      const v = document.getElementById('v'), img = new Image();
      img.src = v.poster; await img.decode();
      return { poster: [img.naturalWidth, img.naturalHeight], font: document.fonts.check('700 20px "Source Sans 3"'), scroll: document.documentElement.scrollWidth > innerWidth,
        can: v.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"'), box: v.getBoundingClientRect().width / v.getBoundingClientRect().height };
    });
    check(info.poster[0] === 1920 && info.poster[1] === 1080, `${name}: the poster loads at 1920 x 1080`);
    check(info.font, `${name}: Source Sans 3 loads from the zip`);
    check(!info.scroll, `${name}: no sideways scrolling`);
    check(Math.abs(info.box - 16 / 9) < 0.01, `${name}: the player is 16 by 9`);
    check(await page.evaluate(() => !document.getElementById('v').controls), `${name}: before play, only the poster shows (the browser's controls come with the video)`);
    await page.locator('#play').click();
    await page.waitForTimeout(1500);
    const after = await page.evaluate(() => { const v = document.getElementById('v'); return { hidden: document.getElementById('play').hidden, t: v.currentTime, paused: v.paused, controls: v.controls }; });
    if (info.can) check(after.hidden && after.controls && after.t > 0.3 && !after.paused, `${name}: one click on the poster starts the video (${after.t.toFixed(1)} s in)`);
    else console.log(`   ${name}: this test browser has no MP4 decoder, so playback itself was not tested here`);
    const real = errs.filter(e => info.can || !/MEDIA|media|supported|ERR_/.test(e));
    check(real.length === 0 && bad.length === 0, `${name}: no errors and no missing files` + (real.length || bad.length ? ' ' + JSON.stringify(real.concat(bad)) : ''));
    await page.close();
  }
  await browser.close();
  console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nALL PAGE CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})();
