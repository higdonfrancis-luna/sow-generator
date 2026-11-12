// As built (step 83): the first page with the plays video, and what the real video file does when played from here.
const {chromium} = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2});
  await p.goto('file://' + path.resolve(__dirname, '../../site/index.html')); await p.waitForSelector('#vid-card');
  await p.screenshot({path: path.join(__dirname, 'built_first_page.png')});
  await p.click('#vid-watch'); await p.waitForTimeout(9000);
  console.log(JSON.stringify(await p.$eval('#vid-box video', v => ({ready: v.readyState, error: v.error && v.error.code, duration: v.duration, time: v.currentTime, w: v.videoWidth}))));
  await b.close(); })().catch(e => { console.error(e); process.exit(1); });
