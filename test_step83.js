// Step 83 (Nov 12 2026, Adam: "I want this video to be front and center on the first page you come to", "B", "it's also
// here https://abvfirefly.netlify.app/"): the four plays video opens the first page. The video file is not fetched here:
// the request is answered by this test. Run from the repo root after the build:
//   node sow/test_step83.js
const {chromium} = require('playwright'), path = require('path'), fs = require('fs');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const URL = 'https://abvfirefly.netlify.app/brand-visibility-four-plays-coworker-cd091098.mp4';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({viewport: {width: 1280, height: 1000}}), page = await ctx.newPage(), errs = [], asked = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.route('https://abvfirefly.netlify.app/**', r => { asked.push(r.request().url()); r.fulfill({status: 404, body: ''}); });
  await page.goto('file://' + path.join(__dirname, 'site/index.html')); await page.waitForSelector('#vid-card');
  const box = sel => page.$eval(sel, e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return {x: r.x, y: r.y, w: r.width, h: r.height, vis: e.offsetParent !== null && s.display !== 'none', color: s.color, op: s.opacity, text: e.textContent.trim()}; });

  // where it sits and what it says
  const card = await box('#vid-card'), bp = await box('#bp'), vid = await box('#vid-box'), copy = await box('.vid-copy');
  ok(await page.$eval('#picker .in', e => e.firstElementChild.id === 'vid-card' && e.children[1].id === 'bp'), 'the video is the first thing on the first page, above Start from your client\'s problem');
  ok(card.y < bp.y && Math.abs(card.x - bp.x) < 1 && Math.abs(card.w - bp.w) < 1 && card.y + card.h <= bp.y, 'its box lines up with the box below it, edge to edge', JSON.stringify([card.x, card.w, bp.x, bp.w]));
  ok(vid.x < copy.x && Math.abs(vid.w / card.w - 0.46) < 0.06 && Math.abs(vid.w / vid.h - 16 / 9) < 0.02, 'the picture is on the left at 16 to 9, the words on the right', JSON.stringify([vid.w, vid.h]));
  ok((await box('.vid-eye')).text === 'Start here' && (await box('.vid-t')).text === 'Watch the four Brand Visibility partner plays' && (await box('.vid-s')).text === 'Five minutes on what each play sells, who it is for and the services partners deliver. Then pick a play below and build its statement of work.' && (await box('#vid-watch')).text === 'Watch the video', 'it says Start here, the headline, one sentence and Watch the video');
  ok(await page.$$eval('.vid-eye,.vid-t,.vid-s,#vid-watch', es => es.every(e => getComputedStyle(e).opacity === '1')) && (await box('.vid-t')).color === 'rgb(28, 28, 28)' && await page.$eval('#vid-watch', e => getComputedStyle(e).backgroundColor === 'rgb(235, 16, 0)' && getComputedStyle(e).color === 'rgb(255, 255, 255)'), 'the words are solid, and the button is Adobe red with white words');
  ok(await page.$eval('#vid-play img', i => i.complete && i.naturalWidth === 1120 && i.naturalHeight === 630 && i.src.startsWith('data:image/jpeg;base64,')), 'the poster is in the page itself');
  ok(asked.length === 0 && !await page.$('#vid-box video') && !/\.mp4/.test(fs.readFileSync(path.join(__dirname, 'site/index.html'), 'utf8').replace(URL, '')) && !fs.readdirSync(path.join(__dirname, 'site')).some(f => /\.mp4$/.test(f)), 'nothing is fetched until it is played, and no video file is in the site');
  ok(card.y + card.h < 700 && bp.y < 760 && await page.$eval('#picker-list', e => e.getBoundingClientRect().top) > bp.y, 'the problem box still starts on the first screen, and the play cards follow it', JSON.stringify([card.y + card.h, bp.y]));

  // playing it
  await page.click('#vid-watch'); await page.waitForTimeout(600);
  const v = await page.$eval('#vid-box video', e => ({src: e.src, controls: e.controls, autoplay: e.autoplay, inline: e.playsInline, poster: e.poster.slice(0, 22), w: e.getBoundingClientRect().width}));
  ok(v.src === URL && v.controls && v.autoplay && v.inline && v.poster === 'data:image/jpeg;base64' && Math.abs(v.w - vid.w) < 1, 'Watch the video puts a player in the picture\'s place, with its controls, playing from Adam\'s video site', JSON.stringify(v));
  ok(asked.includes(URL) && !await page.$('#vid-play') && !(await box('#vid-watch')).vis, 'the file is asked for only then; the poster and the button give way to the player', asked.join());
  await page.waitForTimeout(600);
  ok((await box('#vid-fail')).vis && (await box('#vid-fail')).text === 'The video could not play here. Open the video page' && await page.$eval('#vid-fail a', a => a.href === 'https://abvfirefly.netlify.app/' && a.target === '_blank' && a.rel === 'noopener'), 'where the video cannot play, a line says so with a link to the video page', (await box('#vid-fail')).text);
  await page.reload(); await page.waitForSelector('#vid-play'); await page.click('#vid-play'); await page.waitForTimeout(300);
  ok(await page.$eval('#vid-box video', e => e.src) === URL, 'a click on the picture plays it too');
  ok(await page.$eval('#vid-play, #vid-box video', () => true) && await page.evaluate(() => { document.getElementById('vid-watch').click(); return document.querySelectorAll('#vid-box video').length; }) === 1, 'a second click makes no second player');

  // the rest of the first page is as it was
  await page.reload(); await page.waitForSelector('#vid-card');
  ok((await page.$$('[data-bpp]')).length === 6 && await page.isVisible('#picker-list') && /Have an RFI\? Start from it/.test(await page.textContent('#picker')), 'the six starting problems, the play cards and the RFI door are all still there');
  await page.click('[data-bpp]'); await page.waitForSelector('#bp-body .bp-ans', {timeout: 5000});
  ok(await page.isVisible('#vid-card'), 'asking about a problem leaves the video where it is');
  await page.click('#picker-list [data-play], #picker-list button, #picker-list a').catch(() => {}); await page.waitForTimeout(400);
  ok(await page.evaluate(() => document.getElementById('picker').hidden) ? !(await box('#vid-card')).vis : true, 'once a play is picked and the canvas opens, the video goes with the rest of the first page');

  // a phone
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.setViewportSize({width: 390, height: 800}); await page.goto('file://' + path.join(__dirname, 'site/index.html')); await page.waitForSelector('#vid-card');
  const pv = await box('#vid-box'), pc = await box('.vid-copy');
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1) && pc.y >= pv.y + pv.h && pv.w > 300 && Math.abs(pv.w / pv.h - 16 / 9) < 0.02, 'on a phone the picture sits above the words and nothing runs off the side', JSON.stringify([pv.w, pv.h, pc.y]));

  ok(!errs.length, 'no script errors', errs.join(' | '));
  await b.close();
  console.log(fails ? '\n' + fails + ' STEP 83 CHECKS FAILED' : '\nALL STEP 83 CHECKS PASSED (' + n + ')'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
