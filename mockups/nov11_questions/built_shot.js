// As built (step 77): See all problems on the built page, and one new problem's answer.
const {chromium} = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2});
  await p.goto('file://' + path.resolve(__dirname, '../../site/index.html')); await p.waitForSelector('.bp-chips');
  await p.click('[data-bpa="all"]'); await (await p.$('#bp')).screenshot({path: path.join(__dirname, 'built_grouped.png')});
  await p.click('[data-bpp="19"]'); await p.waitForSelector('#bp-body .bp-ans'); await p.waitForTimeout(1200);
  await (await p.$('#bp')).screenshot({path: path.join(__dirname, 'built_answer_qualifier.png')});
  await b.close(); })();
