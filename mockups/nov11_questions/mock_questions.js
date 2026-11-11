// Mockup only (Nov 11 2026): the front page's client problems, today and grouped by use case with four Marketo questions added.
// Nothing in the tool changes: the grouped view is drawn into the built page in the browser.
//   node sow/mockups/nov11_questions/mock_questions.js
const {chromium} = require('playwright'), path = require('path');
const NEW = {q1: 'My client\'s sales reps research and email every lead by hand', q2: 'My client\'s website chats never reach a salesperson', o1: 'My client sends every lead down the same nurture path', o2: 'My client\'s ad audiences are out of date'};
const GROUPS = [
  ['Get found in AI and search', ['ai-answers-missing', 'ai-traffic-revenue', 'organic-traffic-falling', 'seo-fix-backlog', 'product-pages-ai']],
  ['Website and online store', ['slow-website', 'storefront-hard-to-update', 'site-visitors-cant-find-answers', 'same-site-for-everyone', 'fsi-complex-questions']],
  ['Leads and sales', ['b2b-leads-go-cold', 'q1', 'q2', 'o1', 'o2']],
  ['Customer messages and data', ['disconnected-messages', 'abandoned-carts', 'customer-data-silos', 'cant-see-what-works']],
  ['Content and team productivity', ['content-too-slow', 'off-brand-assets', 'team-busywork', 'slow-reporting']]];
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1280, height: 900}, deviceScaleFactor: 2});
  await p.goto('file://' + path.resolve(__dirname, '../../site/index.html')); await p.waitForSelector('.bp-chips');
  await p.click('.bp-chip.red'); await p.waitForTimeout(200);
  await (await p.$('#bp')).screenshot({path: path.join(__dirname, 'questions_today.png')});
  await p.evaluate(([G, NEW]) => { const box = document.querySelector('.bp-chips'), chip = id => { const i = PROBS.findIndex(x => x.id === id); return NEW[id] ? `<button type="button" class="bp-chip" style="position:relative">${NEW[id]}<span style="margin-left:8px;font-size:11px;font-weight:700;color:#EB1000;letter-spacing:.04em">NEW</span></button>` : bpChip(i); };
    box.style.display = 'block';
    box.innerHTML = G.map(([h, ids]) => `<div style="margin:18px 0 0"><div style="font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#EB1000;margin:0 0 8px">${h}</div><div style="display:flex;flex-wrap:wrap;gap:8px">${ids.map(chip).join('')}</div></div>`).join('') + '<div style="margin:18px 0 0"><button type="button" class="bp-chip red">Show fewer problems</button></div>'; }, [GROUPS, NEW]);
  await (await p.$('#bp')).screenshot({path: path.join(__dirname, 'questions_grouped.png')});
  await b.close(); })().catch(e => { console.error(e); process.exit(1); });
