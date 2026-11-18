// Capture the tool's real screens for the overview video.
//   node build/capture.js <base url of the built site> <rfi sample file> [out dir]
// Writes shots/*.png (2x) and shots/rects.json (where things are on each screen, in CSS pixels).
// The built site is the tool repository's site/ folder served locally (python3 -m http.server).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const OUT = path.resolve(process.argv[4] || path.resolve(__dirname, '..', 'shots'));
const PLAY = 'Brand Visibility + Sites Optimizer and Edge Delivery';
(async () => {
  const [base, rfi] = process.argv.slice(2);
  const b = await chromium.launch();
  const rects = {};
  const rectOf = (p, fn, arg) => p.evaluate(fn, arg);
  const byText = ([src, sel]) => { const r = new RegExp(src); const c = [...document.querySelectorAll(sel || '*')].filter(x => x.offsetParent && r.test((x.innerText || '').trim())); c.sort((a, b2) => a.innerText.length - b2.innerText.length); if (!c[0]) return null; const q = c[0].getBoundingClientRect(); return [Math.round(q.x + scrollX), Math.round(q.y + scrollY), Math.round(q.width), Math.round(q.height)]; };

  // A. first page, whole (it scrolls inside its own frame, so the window is tall)
  let p = await b.newPage({ viewport: { width: 1280, height: 2300 }, deviceScaleFactor: 2 });
  await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  await p.screenshot({ path: OUT + '/front_full.png' });
  rects.front = {
    problem: await rectOf(p, byText, ['^Not sure which play', 'h1,h2,h3,h4,div,p']),
    chip: await rectOf(p, byText, ['^My client is missing from AI answers$', 'button,a']),
    rfi: await rectOf(p, byText, ['^Have an RFI', 'h1,h2,h3,h4,div,p']),
    choose: await rectOf(p, byText, ['^Choose a play to start$', 'h1,h2,h3,h4,div,p']),
    play3: await rectOf(p, byText, ['^' + PLAY.replace(/[+]/g, '\\+'), 'button,a']),
    own: await rectOf(p, byText, ['^Create your own play', 'button,a']),
  };
  await p.close();

  // B. the canvas, no rate
  p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  await p.locator('button, a', { hasText: PLAY }).first().click(); await p.waitForTimeout(2200);
  await p.screenshot({ path: OUT + '/canvas_empty.png' });
  const rate = p.locator('input[aria-label="Your approved hourly rate"]');
  const box = async l => { const q = await l.boundingBox(); return q && [Math.round(q.x), Math.round(q.y), Math.round(q.width), Math.round(q.height)]; };
  rects.canvas = {
    rate: await box(rate),
    fees: await rectOf(p, byText, ['^ILLUSTRATIVE FEES', 'div,section,aside']),
    bv: await rectOf(p, byText, ['^Brand Visibility\\s*4 services$', 'div,g,button']),
    so: await rectOf(p, byText, ['^Sites Optimizer\\s*1 service$', 'div,g,button']),
    eds: await rectOf(p, byText, ['^AEM Sites with Edge Delivery Services\\s*Page authoring', 'div,g']),
    cdn: await rectOf(p, byText, ['^OUTSIDE ADOBE\\s*Existing CDN', 'div,g,button']),
    bolt_bv_eds: await box(p.locator('button[aria-label="Services that connect Brand Visibility and AEM Sites with Edge Delivery Services"]')),
    bolt_so_eds: await box(p.locator('button[aria-label="Services that connect Sites Optimizer and AEM Sites with Edge Delivery Services"]')),
    bolt_cdn_bv: await box(p.locator('button[aria-label="Services that connect Existing CDN and Brand Visibility"]')),
    size: await rectOf(p, byText, ['^Small\\s*Typical\\s*Large$', 'div,span,fieldset']),
  };
  // C. typing the rate
  await rate.click();
  for (const part of ['1', '15', '150']) { await rate.fill(part); await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}/canvas_r${part}.png` }); }
  await p.keyboard.press('Tab'); await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/canvas_rate.png' });
  rects.canvas.feesText = await p.evaluate(() => { const m = document.body.innerText.match(/ILLUSTRATIVE FEES[\s\S]{0,160}/); return m && m[0]; });
  await p.close();

  // D. the connection card, whole (tall window)
  p = await b.newPage({ viewport: { width: 1280, height: 1500 }, deviceScaleFactor: 2 });
  await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  await p.locator('button, a', { hasText: PLAY }).first().click(); await p.waitForTimeout(2200);
  await p.locator('input[aria-label="Your approved hourly rate"]').fill('150'); await p.keyboard.press('Tab'); await p.waitForTimeout(600);
  await p.locator('button[aria-label="Services that connect Brand Visibility and AEM Sites with Edge Delivery Services"]').click(); await p.waitForTimeout(1200);
  const cardBox = await p.evaluate(() => { const c = [...document.querySelectorAll('div.card')].filter(x => x.offsetParent && /^CONNECTION/.test((x.innerText || '').trim())); const q = c[0].getBoundingClientRect(); return { x: q.x, y: q.y, width: q.width, height: q.height }; });
  await p.screenshot({ path: OUT + '/card.png', clip: cardBox });
  const rel = r => r && [r[0] - Math.round(cardBox.x), r[1] - Math.round(cardBox.y), r[2], r[3]];
  rects.card = {
    size: [Math.round(cardBox.width), Math.round(cardBox.height)],
    services: rel(await rectOf(p, byText, ['^SERVICES ON THIS CONNECTION$', 'div,h3,h4,p,span'])),
    together: rel(await rectOf(p, byText, ['^WHAT YOU GET TOGETHER$', 'div,h3,h4,p,span'])),
    how: rel(await rectOf(p, byText, ['^HOW IT CONNECTS$', 'div,h3,h4,p,span'])),
    refs: rel(await rectOf(p, byText, ['^Supporting references \\(8\\)$', 'summary,div,span,button'])),
    total: rel(await rectOf(p, byText, ['^1 connection service selected', 'div,p,span'])),
  };
  await p.close();

  // E. the statement of work
  p = await b.newPage({ viewport: { width: 1280, height: 1900 }, deviceScaleFactor: 2 });
  await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForTimeout(1200);
  await p.locator('button, a', { hasText: PLAY }).first().click(); await p.waitForTimeout(2200);
  await p.locator('input[aria-label="Your approved hourly rate"]').fill('150'); await p.keyboard.press('Tab'); await p.waitForTimeout(600);
  await p.locator('button, a', { hasText: /^Statement of work$/ }).first().click(); await p.waitForTimeout(2500);
  // two parts of the long page: the top of the document, and section 5 with the fees table
  const feesY = await p.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3,h4')].find(x => x.offsetParent && /^5\.\s*Illustrative services fees/.test(x.innerText.trim())); return Math.round(h.getBoundingClientRect().y + scrollY); });
  await p.screenshot({ path: OUT + '/sow_top.png', fullPage: true, clip: { x: 0, y: 0, width: 1280, height: 2150 } });
  await p.screenshot({ path: OUT + '/sow_fees.png', fullPage: true, clip: { x: 0, y: feesY - 73, width: 1280, height: 1150 } });
  rects.sow = {
    feesY,
    title: await rectOf(p, byText, ['^STATEMENT OF WORK$', 'div,p,span,h1,h2,h3']),
    buttons: await rectOf(p, byText, ['^Print / Save PDF$', 'button,a']),
    csv: await rectOf(p, byText, ['^Services CSV$', 'button,a']),
    fees: await rectOf(p, byText, ['^\\d+\\.\\s*(Fees|Services and fees|Fee summary)', 'h1,h2,h3,h4,div']),
    height: await p.evaluate(() => document.documentElement.scrollHeight),
    heads: await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4')].filter(x => x.offsetParent && /^\d+\./.test(x.innerText.trim())).map(x => [x.innerText.trim().slice(0, 50), Math.round(x.getBoundingClientRect().y + scrollY)])),
  };
  await p.close();

  // F. the RFI Builder: empty, then a sample RFI answered
  p = await b.newPage({ viewport: { width: 1280, height: 1420 }, deviceScaleFactor: 2 });
  await p.goto(base + '/sow/index.html#rfp', { waitUntil: 'load' }); await p.waitForTimeout(1500);
  await p.screenshot({ path: OUT + '/rfi_empty.png' });
  await p.locator('input[type=file]').first().setInputFiles(rfi); await p.waitForTimeout(6000);
  await p.screenshot({ path: OUT + '/rfi_answered.png' });
  rects.rfi = {
    drop: await rectOf(p, byText, ['^Drop the RFI here, or choose a file', 'div,section']),
    found: await rectOf(p, byText, ['questions found\\.', 'div,p,span']),
    answer: await rectOf(p, byText, ['^YOUR RESPONSE TO THE CLIENT$', 'div,p,span,h3,h4']),
    sources: await rectOf(p, byText, ['^ADOBE SOURCES FOR THE PRODUCT FACTS ABOVE$', 'div,p,span,h3,h4']),
    q1: await rectOf(p, byText, ['^ADOBE PRODUCTS\\s*Q1', 'div,li,button']),
    foundText: await p.evaluate(() => { const m = document.body.innerText.match(/[^\n]*questions found\.[^\n]*/); return m && m[0]; }),
  };
  await p.close();
  fs.writeFileSync(OUT + '/rects.json', JSON.stringify(rects, null, 1));
  console.log(JSON.stringify(rects, null, 1));
  await b.close();
})();
