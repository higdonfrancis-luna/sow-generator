// Get your team ready: the training and certification box on each product card. Run after the normal canvas/site build:
//   node test_training.js
// TRAINING_TEST_SITE points the browser checks at another built site/.
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.resolve(process.env.TRAINING_TEST_SITE || path.join(__dirname, 'site'));
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'training.json'), 'utf8'));
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'catalog.json'), 'utf8'));
let fails = 0;
const ok = (yes, message, detail = '') => { console.log((yes ? '✅ ' : '❌ ') + message + (yes || !detail ? '' : ': ' + detail)); if (!yes) fails++; };
const server = http.createServer((req, res) => {
  const file = path.join(SITE, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!file.startsWith(SITE + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain');
  fs.createReadStream(file).pipe(res);
});

// what the box should say about certification, worked out from the data alone
const KIND = {'learning path': 'Learning path', course: 'Course', playlist: 'Playlist', tutorial: 'Tutorial', documentation: 'Guide', video: 'Video', 'product page': 'Product page'};
const clean = title => title.replace(/\s*[–—]\s*/g, ', ').trim();
function expected(id) {
  const t = DATA.products[id], shown = t.closest ? DATA.products[t.closest].exams : t.exams, certs = shown.filter(e => !e.credential);
  const own = !t.closest && certs.length;
  return {
    status: (own ? own + ' certification' + (own === 1 ? '' : 's') : t.closest && certs.length ? 'No certification of its own' : 'No certification yet') + ', partner and public training',
    rows: [...(t.hub ? ['Partner hub'] : []), 'Partner training', 'Certification', ...(t.courses ? ['Adobe courses'] : []), 'Public training'],
    links: [...(t.hub ? [[DATA.hub + t.hub.slug, t.hub.name + ' on the Partner Experience Hub']] : []), [DATA.catalog, 'On-demand trainings'],
      ...shown.map(e => [e.url, clean(e.title) + (e.id ? ' (' + e.id + ')' : '')]),
      ...(t.courses ? [[DATA.courses + encodeURIComponent(t.courses), t.courses + ' courses on the Certification Portal']] : []), ...t.training.map(x => [x.url, KIND[x.kind] + ': ' + clean(x.title)])],
    hint: t.filter ? 'Under Products, tick ' + t.filter : 'Search for ' + t.search,
    certificationText: own ? '' : t.closest && certs.length ? 'No certification of its own. The closest are the ' : shown.length ? 'No certification yet. Adobe offers this instead:' : 'No certification yet',
    notes: shown.filter(e => e.credential).length + shown.filter(e => e.partner === false).length
  };
}

(async () => {
  // 1. the data itself
  const adobe = CAT.products.filter(p => !p.outside).map(p => p.id).sort();
  ok(JSON.stringify(Object.keys(DATA.products).sort()) === JSON.stringify(adobe), `training.json has one entry for each of the ${adobe.length} Adobe products on the canvas, and no others`);
  const COURSE_FILTERS = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'research', 'training_2026-11-16', 'course_filters.json'), 'utf8')).filters;
  const TRAINING_HOSTS = ['experienceleague.adobe.com', 'certification.adobe.com', 'developer.adobe.com', 'www.aem.live', 'help.frame.io', 'helpx.adobe.com', 'business.adobe.com', 'www.youtube.com'];
  const bad = [];
  for (const [id, t] of Object.entries(DATA.products)) {
    if (('filter' in t) === ('search' in t)) bad.push(id + ': exactly one of filter or search');
    if (t.hub && !/^[a-z-]+(\/[a-z-]+)?$/.test(t.hub.slug)) bad.push(id + ': hub slug');
    if (t.closest && (t.exams.length || !DATA.products[t.closest] || !DATA.products[t.closest].exams.length)) bad.push(id + ': closest must name a product with a certification or credential, and replace none of its own');
    if (t.training.length < 2 || t.training.length > 5) bad.push(id + ': 2 to 5 training links');
    if ('courses' in t && !COURSE_FILTERS.includes(t.courses)) bad.push(id + ': "' + t.courses + '" is not a filter on the course catalog');
    for (const e of t.exams) {
      if (!e.url.startsWith('https://certification.adobe.com/certification/') || /#/.test(e.url)) bad.push(id + ': exam address ' + e.url);
      if (e.id && !/^AD0-[A-Z]\d{3}$/.test(e.id)) bad.push(id + ': exam id ' + e.id);
      if (/beta|retired|retiring/i.test(e.title)) bad.push(id + ': release label in ' + e.title);
    }
    for (const x of t.training) {
      if (!KIND[x.kind]) bad.push(id + ': kind ' + x.kind);
      if (!TRAINING_HOSTS.includes(new URL(x.url).host) || !x.url.startsWith('https://')) bad.push(id + ': training address ' + x.url);
    }
    const urls = [...t.exams, ...t.training].map(l => l.url);
    if (new Set(urls).size !== urls.length) bad.push(id + ': a link is listed twice');
  }
  ok(bad.length === 0, 'every entry has a filter or a search term, valid Adobe addresses, known link kinds, no release labels and no repeated link', bad.join(' | '));
  ok(DATA.hub === 'https://partners.adobe.com/digitalexperience/products/' && DATA.catalog === 'https://partners.adobe.com/digitalexperience/learn/on-demand-trainings#resources',
    'the partner hub and training catalog addresses are the ones the owner confirmed while signed in');
  ok(DATA.courses === 'https://certification.adobe.com/courses/#filters=' && DATA.courses + encodeURIComponent(DATA.products.bc.courses) === 'https://certification.adobe.com/courses/#filters=Adobe%20Brand%20Concierge',
    'a product\'s course catalog link has the form the owner confirmed for Brand Concierge');

  // 2. the box on every product card
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch(), errors = [];
  try {
    const p = await browser.newPage({viewport: {width: 1440, height: 900}});
    p.on('pageerror', e => errors.push(e.message));
    await p.goto('http://localhost:' + server.address().port + '/');
    await p.waitForFunction(() => window.READY);
    const seed = async (products, outside = []) => {
      await p.evaluate(({products, outside}) => {
        hideCard(true); openAdd(false); openOut(false);
        st = {...st, play: 'custom', on: products, out: outside, ls: {}, keep: {}, rate: 185, eff: null, decisions: {authoring: 'universal'}, fresh: true, pubSig: null};
        fsel = null; showAllEdges = false; moreOpen = {}; render();
      }, {products, outside});
      await p.waitForTimeout(250);
    };
    const snapshot = () => p.evaluate(() => JSON.stringify({selected: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted), choices: st.ls, totals: totals()}));
    const read = () => p.evaluate(() => { const c = document.querySelector('#card'), d = c.querySelector('details.ready'); if (!d) return null;
      const cb = c.getBoundingClientRect(), db = d.getBoundingClientRect(), sb = d.querySelector('summary').getBoundingClientRect(), text = e => e.textContent.replace(/\s+/g, ' ').trim();
      const rowOf = label => [...d.querySelectorAll('.rr')].find(r => text(r.querySelector('b')) === label);
      return {open: d.open, text: text(d), status: text(d.querySelector('.rs')), rows: [...d.querySelectorAll('.rr > b')].map(text),
        links: [...d.querySelectorAll('a')].map(a => [a.getAttribute('href'), text(a), a.target, a.rel]),
        hint: text(rowOf('Partner training').querySelector('small')), certification: text(rowOf('Certification').querySelector('div')),
        notes: d.querySelectorAll('.rr li small').length, headingInView: sb.top >= cb.top - 1 && sb.bottom <= cb.bottom + 1, visible: Math.round(Math.min(db.bottom, cb.bottom) - Math.max(db.top, cb.top)), height: Math.round(db.height), cardHeight: Math.round(cb.height),
        sideways: c.scrollWidth > c.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth + 1}; });

    const wrong = [];
    for (const id of adobe) {
      await seed([id]);
      const before = await snapshot();
      await p.evaluate(id => { pinned = true; showCard('p', id); }, id);
      const closed = await read();
      if (!closed || closed.open) { wrong.push(id + ': the box is missing or starts open'); continue; }
      await p.click('#card details.ready > summary');
      await p.waitForTimeout(120);
      const box = await read(), want = expected(id);
      const linksMatch = JSON.stringify(box.links.map(l => l.slice(0, 2))) === JSON.stringify(want.links);
      const problems = [
        closed.status !== want.status && 'status "' + closed.status + '" not "' + want.status + '"',
        JSON.stringify(box.rows) !== JSON.stringify(want.rows) && 'rows ' + box.rows.join(','),
        !linksMatch && 'links ' + JSON.stringify(box.links.map(l => l.slice(0, 2))),
        !box.links.every(l => l[2] === '_blank' && l[3] === 'noopener') && 'a link does not open in a new tab',
        box.hint !== want.hint && 'hint "' + box.hint + '"',
        box.text.includes('sign-in') && 'a sign-in note is back',
        !box.certification.startsWith(want.certificationText) && 'certification text "' + box.certification.slice(0, 80) + '"',
        box.notes !== want.notes && 'notes ' + box.notes + ' not ' + want.notes,
        !(box.open && box.headingInView && box.visible >= Math.min(box.height, box.cardHeight - 60)) && 'the opened box is not brought into view ' + JSON.stringify([box.visible, box.height, box.cardHeight]),
        box.sideways && 'sideways scroll',
        await snapshot() !== before && 'opening the box changed services or fees'
      ].filter(Boolean);
      if (problems.length) wrong.push(id + ': ' + problems.join('; '));
    }
    ok(wrong.length === 0, `on all ${adobe.length} product cards the box starts closed, states the certification position, and opens in view with exactly the links in training.json, each in a new tab, changing no fees`, wrong.join(' | '));

    // 3. particular cases a partner would notice
    await seed(['eds']);
    await p.click('.node[data-p="eds"] .offering-title');
    const offering = await read();
    ok(offering && offering.status.startsWith(DATA.products.aemsites.exams.length + ' certifications'), 'the AEM Sites with Edge Delivery Services card carries the AEM Sites certifications as its own', offering && offering.status);
    await p.evaluate(() => { pinned = true; showCard('p', 'aemsites'); });
    ok(await read() === null, 'the Cloud Manager and author training card inside that offering does not repeat the box');
    await seed(['bv']);
    await p.click('.node[data-p="bv"]');
    await p.click('#card details.ready > summary');
    ok((await read()).certification === 'No certification yetAdobe has not released one for this product.', 'a product with no certification says so plainly', (await read()).certification);
    await p.click('#card [data-t="L01"]');
    ok((await read()).open, 'the box stays open while the partner removes a service on the same card');
    await p.keyboard.press('Escape');
    await p.click('.node[data-p="bv"]');
    ok((await read()).open, 'and is still open when the same card is opened again, like the other expanding lists');
    await p.focus('#card details.ready > summary');
    await p.keyboard.press('Enter');
    ok(!(await read()).open, 'Enter on the heading closes it from the keyboard');
    await seed(['bv'], ['cdn']);
    await p.evaluate(() => { pinned = true; showCard('p', 'cdn'); });
    ok(await read() === null, 'an outside system card has no training box');
    await p.evaluate(() => openRoute(CBY['cdn-bv']));
    ok(await read() === null, 'a connection card has no training box');

    // 4. a fixed play and a phone
    await p.evaluate(() => { hideCard(true); st = {...st, play: 'aem', on: [], out: ['cdn'], ls: {}, keep: {}, fresh: true, pubSig: null, decisions: {authoring: ''}}; render(); });
    await p.waitForTimeout(250);
    await p.click('.node[data-p="so"]');
    ok((await read()).status === expected('so').status, 'the box is on product cards in the fixed plays too');
    await p.setViewportSize({width: 390, height: 844});
    await p.waitForTimeout(600);   // the page re-places its card shortly after a resize
    await seed(['cja']);
    await p.evaluate(() => { pinned = true; showCard('p', 'cja'); });
    await p.locator('#card details.ready > summary').scrollIntoViewIfNeeded();
    await p.click('#card details.ready > summary');
    await p.waitForTimeout(200);
    const phone = await read();
    ok(phone.open && phone.headingInView && !phone.sideways && phone.visible >= phone.cardHeight - 60, 'on a phone the opened box keeps its heading in view, fills the card and causes no sideways scroll', JSON.stringify(phone && [phone.headingInView, phone.sideways, phone.visible, phone.cardHeight]));
    ok(errors.length === 0, 'no browser errors', errors.join('; '));
  } finally { await browser.close(); server.close(); }
  if (fails) { console.error(fails + ' checks failed'); process.exitCode = 1; } else console.log('ALL TRAINING CHECKS PASSED');
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
