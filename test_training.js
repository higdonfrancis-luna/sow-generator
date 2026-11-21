// Get trained and certified (named "Get your team ready" until Nov 21 2026): the training and certification box on each product card. Run after the normal canvas/site build:
//   node test_training.js
// TRAINING_TEST_SITE points the browser checks at another built site/.
// Nov 21 2026 (Adam: "I need it to jump out more", then "go" to mockups/nov21_training/): a menu in the top bar of both pages with Adobe's two
// training portals and, on a play, the canvas's products; a link under each product card's name; the box filled and outlined in red; and the level
// Adobe states beside each certification and training link (canvas/research/training_2026-11-21/levels.json). Sections 5 and 6 check them.
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const SITE = path.resolve(process.env.TRAINING_TEST_SITE || path.join(__dirname, 'site'));
const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'training.json'), 'utf8'));
const NOV21 = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'research', 'training_2026-11-21', 'levels.json'), 'utf8'));
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
const NAME = Object.fromEntries(CAT.products.map(p => [p.id, p.name]));
function expected(id) {
  const t = DATA.products[id], shown = t.closest ? DATA.products[t.closest].exams : t.exams, certs = shown.filter(e => !e.credential);
  const own = !t.closest && certs.length, levels = own ? [...new Set(certs.map(e => e.level))] : [];
  return {
    courseRow: t.courses ? t.courses + ' courses on the Certification PortalSkill levels on the portal: ' + DATA.courseLevels.join(', ') : '',
    tags: [...shown.map(e => e.credential ? '' : e.level), ...t.training.map(x => (x.level || []).join(' to '))],
    status: (own ? own + ' certification' + (own === 1 ? '' : 's') + ' (' + levels.join(', ') + ')' : t.closest && certs.length ? 'No certification of its own' : 'No certification yet') + ', partner and public training',
    rows: [...(t.hub ? ['Partner hub'] : []), 'Partner training', 'Certification', ...(t.courses ? ['Adobe courses'] : []), 'Public training'],
    hubLinks: [...(t.hub ? [[DATA.hub + t.hub.slug, t.hub.name + ' on the Partner Experience Hub']] : []), ...(t.hubSearch ? [[DATA.hubSearch + t.hubSearch, 'Decks, sales plays and webinars for ' + NAME[id]]] : [])],
    links: [...(t.hub ? [[DATA.hub + t.hub.slug, t.hub.name + ' on the Partner Experience Hub']] : []), ...(t.hubSearch ? [[DATA.hubSearch + t.hubSearch, 'Decks, sales plays and webinars for ' + NAME[id]]] : []), [DATA.catalog, 'On-demand trainings'],
      ...shown.map(e => [e.url, clean(e.title) + (e.id ? ' (' + e.id + ')' : '')]),
      ...(t.courses ? [[DATA.courses + encodeURIComponent(t.courses), t.courses + ' courses on the Certification Portal']] : []), ...t.training.map(x => [x.url, KIND[x.kind] + ': ' + clean(x.title)])],
    hint: t.filter ? 'Under Products, tick ' + t.filter : 'Search for ' + t.search,
    lead: own ? '' : t.closest && certs.length ? 'No certification of its own. The closest are the ' + NAME[t.closest] + ' certifications:' : shown.length ? 'No certification yet. Adobe offers this instead:' : 'No certification yetAdobe has not released one for this product.',
    exams: shown.map(e => [clean(e.title) + (e.id ? ' (' + e.id + ')' : ''), ...(e.credential ? ['A Qualified Credential, which Adobe does not count as a certification'] : []), ...(e.partner === false ? ['Adobe says this one does not count toward partner requirements'] : [])])
  };
}

(async () => {
  // 1. the data itself
  const adobe = CAT.products.filter(p => !p.outside).map(p => p.id).sort();
  ok(JSON.stringify(Object.keys(DATA.products).sort()) === JSON.stringify(adobe), `training.json has one entry for each of the ${adobe.length} Adobe products on the canvas, and no others`);
  const RECORD = name => JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'research', 'training_2026-11-16', name), 'utf8'));
  const COURSE_FILTERS = RECORD('course_filters.json').filters, HUB_SEARCH = RECORD('hub_search_links.json'), HUB = RECORD('partner_hub_links.json'), OWNER = RECORD('owner_links.json');
  const RESEARCH = Object.fromEntries(RECORD('research.json').products.map(p => [p.id, p]));
  const LEVELS = ['Professional', 'Expert', 'Master', 'Qualified'];   // the order the generator lists a product's exams in
  const TRAINING_HOSTS = ['experienceleague.adobe.com', 'certification.adobe.com', 'developer.adobe.com', 'www.aem.live', 'help.frame.io', 'helpx.adobe.com', 'business.adobe.com', 'www.youtube.com'];
  const bad = [];
  for (const [id, t] of Object.entries(DATA.products)) {
    if (('filter' in t) === ('search' in t)) bad.push(id + ': exactly one of filter or search');
    if ((t.hub ? t.hub.slug : undefined) !== (HUB.confirmed[id] || NOV21.family_hub_pages[id])) bad.push(id + ': hub page is not the one the owner confirmed, or its family\'s');
    if ('filter' in t && !HUB.training_catalog_filters.includes(t.filter)) bad.push(id + ': "' + t.filter + '" is not a Products filter on the training catalog');
    if (t.closest && (t.exams.length || !DATA.products[t.closest] || !DATA.products[t.closest].exams.length)) bad.push(id + ': closest must name a product with a certification or credential, and replace none of its own');
    if (t.training.length < 2 || t.training.length > 5) bad.push(id + ': 2 to 5 training links');
    if ('courses' in t && !COURSE_FILTERS.includes(t.courses)) bad.push(id + ': "' + t.courses + '" is not a filter on the course catalog');
    if (t.hubSearch !== HUB_SEARCH.confirmed[id] || ('hubSearch' in t) === (id in HUB_SEARCH.none)) bad.push(id + ': hub search "' + t.hubSearch + '" is not the one the owner confirmed');
    if (t.hubSearch && (!t.hub || !/^(filters=yes&products=caas:products\/[a-z0-9-]+|term=[A-Za-z0-9+-]+)$/.test(t.hubSearch))) bad.push(id + ': hub search form, or no hub row to hold it');
    for (const e of t.exams) {
      if ((e.level || '') !== (e.credential ? '' : RESEARCH[id === 'eds' ? 'aemsites' : id].exams.find(r => r.portal_url === e.url).level)) bad.push(id + ': level of ' + e.title);
      if (!e.url.startsWith('https://certification.adobe.com/certification/') || /#/.test(e.url)) bad.push(id + ': exam address ' + e.url);
      if (e.id && !/^AD0-[A-Z]\d{3}$/.test(e.id)) bad.push(id + ': exam id ' + e.id);
      if (/beta|retired|retiring/i.test(e.title)) bad.push(id + ': release label in ' + e.title);
    }
    for (const x of t.training) {
      if (JSON.stringify(x.level) !== JSON.stringify((NOV21.training_levels[id] || {})[x.url])) bad.push(id + ': level of ' + x.url);
      if (x.level && !(x.level.length && x.level.every(l => ['Beginner', 'Intermediate', 'Experienced'].includes(l)))) bad.push(id + ': level words ' + x.level);
      if (!KIND[x.kind]) bad.push(id + ': kind ' + x.kind);
      if (!TRAINING_HOSTS.includes(new URL(x.url).host) || !x.url.startsWith('https://')) bad.push(id + ': training address ' + x.url);
    }
    if (!RESEARCH[id]) { bad.push(id + ': not in research.json'); continue; }
    const exams = [...RESEARCH[id === 'eds' ? 'aemsites' : id].exams].sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level))
      .map(e => [e.official_title.replace(/\s*\(Beta\)$/, ''), e.portal_url, e.exam_id || '', e.credential_type === 'qualified credential', e.counts_toward_partner_requirements === 'no']);
    if (JSON.stringify(t.exams.map(e => [e.title, e.url, e.id || '', !!e.credential, e.partner === false])) !== JSON.stringify(exams)) bad.push(id + ': exams differ from research.json');
    if (t.closest && RESEARCH[id].nearest_certification !== t.closest) bad.push(id + ': closest is not the product research.json names');
    const found = Object.fromEntries(RESEARCH[id].training.map(x => [x.url, x]));   // an owner entry with only an address keeps the kind and title research.json has for it
    const training = [...(OWNER.courses_found[id] ? [OWNER.courses_found[id]] : []), ...(OWNER.training[id] || RESEARCH[id].training).map(x => x.title ? x : found[x.url] || x)].map(x => [x.kind, x.title, x.url]);
    if (JSON.stringify(t.training.map(x => [x.kind, x.title, x.url])) !== JSON.stringify(training)) bad.push(id + ': training links differ from the record');
    const urls = [...t.exams, ...t.training].map(l => l.url);
    if (new Set(urls).size !== urls.length) bad.push(id + ': a link is listed twice');
  }
  ok(bad.length === 0, 'every entry has a search term or a Products filter the training catalog has, the hub page and hub search the owner confirmed, addresses on the hosts the record uses, the same exams with their titles and notes, the same closest product and the same training links with their kinds and titles as the research record, known link kinds, no release labels and no repeated link; each certification carries its level from the research record and each training link the level Adobe states on its page, where it states one', bad.join(' | '));
  ok(JSON.stringify(DATA.courseLevels) === '["Foundations","Professional","Expert"]' && Object.values(DATA.products).flatMap(t => t.training).filter(x => x.level).length === 70 &&
    JSON.stringify(Object.keys(DATA.products).filter(id => DATA.products[id].hub && !HUB.confirmed[id]).sort()) === '["aco","cintel"]' && DATA.products.aco.hub.slug === 'commerce' && DATA.products.cintel.hub.slug === HUB.confirmed.commerce,
    'the course catalog\'s three skill levels are in the data, 70 training links carry a level, and Commerce Optimizer and Commerce Intelligence take the Adobe Commerce hub page the owner confirmed');
  ok(Object.values(DATA.products).filter(t => t.hubSearch).length === 31 && JSON.stringify(Object.keys(HUB_SEARCH.none).sort()) === '["aco","brandintel","ca","cintel","cja"]',
    'thirty-one products carry a hub search link; Customer Journey Analytics, Content Analytics and Brand Intelligence carry none, as the README says, and nor do Commerce Optimizer and Commerce Intelligence (Nov 19 2026), which the owner has not checked on the hub');
  ok(DATA.hubSearch + DATA.products.bc.hubSearch === 'https://partners.adobe.com/digitalexperience/home/search/?filters=yes&products=caas:products/brand-concierge' && DATA.hubSearch + DATA.products.eds.hubSearch === 'https://partners.adobe.com/digitalexperience/home/search/?term=edge+delivery',
    'a hub search link has the form of the addresses the owner copied from the hub');
  ok(Object.values(DATA.products).filter(t => t.courses).length === 20, 'twenty products carry an Adobe courses link, as the README says');
  ok(JSON.stringify(Object.keys(DATA.products).filter(id => DATA.products[id].closest).sort()) === '["aco","aemforms","ca","cintel","collab","fireflycm","mmeasure","moptimizer","mqualifier","planning","so"]',
    'eleven products show another product\'s list as the closest, as the README says (Commerce Optimizer and Commerce Intelligence show Adobe Commerce\'s since Nov 19 2026)');
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
        moreOpen = {}; render();
      }, {products, outside});
      await p.waitForTimeout(250);
    };
    const snapshot = () => p.evaluate(() => JSON.stringify({selected: [...prods(), ...conns()].flatMap(o => all(o)).filter(counted), choices: st.ls, totals: totals()}));
    const read = () => p.evaluate(() => { const c = document.querySelector('#card'), d = c.querySelector('details.ready'); if (!d) return null;
      const cb = c.getBoundingClientRect(), db = d.getBoundingClientRect(), sb = d.querySelector('summary').getBoundingClientRect(), text = e => e.textContent.replace(/\s+/g, ' ').trim();
      const rowOf = label => [...d.querySelectorAll('.rr')].find(r => text(r.querySelector('b')) === label), cert = rowOf('Certification').querySelector('div');
      return {open: d.open, text: text(d), status: text(d.querySelector('.rs')), rows: [...d.querySelectorAll('.rr > b')].map(text),
        links: [...d.querySelectorAll('a')].map(a => [a.getAttribute('href'), text(a), a.target, a.rel, (s => !!s && s.getBoundingClientRect().width > 0 && s.getAttribute('aria-label') === 'opens in a new tab')(a.querySelector('svg'))]),
        chevronHidden: d.querySelector('summary .chv').getAttribute('aria-hidden') === 'true',
        tags: [...d.querySelectorAll('.rr li')].filter(li => rowOf('Certification').contains(li) || rowOf('Public training').contains(li)).map(li => (g => g ? text(g) : '')(li.querySelector('.lv'))),
        look: (s => [s.borderTopColor, s.borderTopWidth, getComputedStyle(d.querySelector('summary')).backgroundColor])(getComputedStyle(d)),
        jump: (j => j ? [text(j), j.previousElementSibling && j.previousElementSibling.id] : null)(c.querySelector('button.trjump')),
        courseRow: rowOf('Adobe courses') ? text(rowOf('Adobe courses').querySelector('div')) : '',
        hubLinks: rowOf('Partner hub') ? [...rowOf('Partner hub').querySelectorAll('a')].map(a => [a.getAttribute('href'), text(a)]) : [], hubLinkTops: rowOf('Partner hub') ? [...rowOf('Partner hub').querySelectorAll('a')].map(a => Math.round(a.getBoundingClientRect().top)) : [],
        hint: text(rowOf('Partner training').querySelector('small')), lead: [...cert.childNodes].filter(n => n.nodeName !== 'UL').map(n => n.textContent).join('').replace(/\s+/g, ' ').trim(),
        exams: [...cert.querySelectorAll('li')].map(li => [...li.querySelectorAll('a, small')].map(text)),
        note: !!c.querySelector('.connection-note'), foot: !!d.previousElementSibling && !d.previousElementSibling.matches('button.rm') && [...c.children].slice([...c.children].indexOf(d) + 1).every(e => e.matches('button.rm')),
        stacked: [...d.querySelectorAll('.rr')].every(r => r.querySelector('div').getBoundingClientRect().top >= r.querySelector('b').getBoundingClientRect().bottom - 1),
        headingInView: sb.top >= cb.top - 1 && sb.bottom <= cb.bottom + 1, visible: Math.round(Math.min(db.bottom, cb.bottom) - Math.max(db.top, cb.top)), height: Math.round(db.height), cardHeight: Math.round(cb.height),
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
        !box.links.every(l => l[2] === '_blank' && l[3] === 'noopener' && l[4]) && 'a link does not open in a new tab, or its new-tab icon is not shown or not named for screen readers',
        !box.chevronHidden && 'the heading\'s arrow is not hidden from screen readers',
        JSON.stringify(box.hubLinks) !== JSON.stringify(want.hubLinks) && 'Partner hub row ' + JSON.stringify(box.hubLinks),
        box.hubLinkTops.length === 2 && box.hubLinkTops[1] <= box.hubLinkTops[0] && 'the hub search link is not on its own line under the hub page',
        box.hint !== want.hint && 'hint "' + box.hint + '"',
        box.text.includes('sign-in') && 'a sign-in note is back',
        !box.text.startsWith('Get trained and certified' + want.status) && 'heading "' + box.text.slice(0, 40) + '"',
        /[–—]|beta|retired|retiring/i.test(box.text) && 'a dash or a release label in the box',
        box.courseRow !== want.courseRow && 'the Adobe courses row is not its link and the portal\'s skill levels: "' + box.courseRow + '"',
        JSON.stringify(box.tags) !== JSON.stringify(want.tags) && 'level tags ' + JSON.stringify(box.tags),
        JSON.stringify(box.look) !== '["rgb(235, 16, 0)","2px","rgb(255, 244, 242)"]' && 'the box is not outlined in red with a filled heading ' + JSON.stringify(box.look),
        !(box.jump && box.jump[1] === 'card-heading' && box.jump[0].startsWith('Get trained and certified') && box.jump[0].endsWith('courses and training')) && 'no link under the product\'s name ' + JSON.stringify(box.jump),
        box.lead !== want.lead && 'certification text "' + box.lead + '"',
        JSON.stringify(box.exams) !== JSON.stringify(want.exams) && 'certifications and their notes ' + JSON.stringify(box.exams),
        !box.foot && 'the box is not at the foot of the card, above Remove',
        !(box.open && box.headingInView && box.visible >= Math.min(box.height, box.cardHeight - 60)) && 'the opened box is not brought into view ' + JSON.stringify([box.visible, box.height, box.cardHeight]),
        box.sideways && 'sideways scroll',
        await snapshot() !== before && 'opening the box changed services or fees'
      ].filter(Boolean);
      if (problems.length) wrong.push(id + ': ' + problems.join('; '));
    }
    ok(wrong.length === 0, `on all ${adobe.length} product cards the box sits at the foot of the card, starts closed, states the certification position in the approved words, and opens in view with exactly the links in training.json, each in a new tab, changing no fees`, wrong.join(' | '));

    // 3. particular cases a partner would notice
    await seed(['eds']);
    await p.dblclick('.node[data-p="eds"] .offering-title');
    const offering = await read();
    ok(offering && offering.status.startsWith(DATA.products.aemsites.exams.length + ' certifications'), 'the AEM Sites with Edge Delivery Services card carries the AEM Sites certifications as its own', offering && offering.status);
    await p.evaluate(() => { pinned = true; showCard('p', 'aemsites'); });
    ok(await read() === null, 'the Cloud Manager and author training card inside that offering does not repeat the box');
    await seed(['bv', 'cja']);
    await p.dblclick('.node[data-p="bv"]');
    await p.click('#card details.ready > summary');
    ok((await read()).lead === 'No certification yetAdobe has not released one for this product.', 'a product with no certification says so plainly', (await read()).lead);
    await p.click('#card [data-t="L01"]');
    ok((await read()).open, 'the box stays open while the partner removes a service on the same card');
    await p.keyboard.press('Escape');
    await p.dblclick('.node[data-p="bv"]');
    ok((await read()).open, 'and is still open when the same card is opened again, like the other expanding lists');
    await p.dblclick('.node[data-p="cja"]');
    const other = await read();
    ok(other && !other.open, 'opening the box on one product leaves it closed on the others');
    await p.dblclick('.node[data-p="bv"]');
    let reached = false;
    for (let i = 0; i < 60 && !reached; i++) { await p.keyboard.press('Tab'); reached = await p.evaluate(() => document.activeElement.matches('#card details.ready > summary')); }
    const ring = reached && await p.evaluate(() => (s => s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor)(getComputedStyle(document.activeElement)));
    if (reached) await p.keyboard.press('Enter');
    ok(reached && ring === 'solid 2px rgb(28, 28, 28)' && !(await read()).open, 'Tab reaches the heading, which shows a focus ring, and Enter closes it', JSON.stringify([reached, ring]));
    await seed(['bv'], ['cdn']);
    await p.evaluate(() => { pinned = true; showCard('p', 'cdn'); });
    ok(await read() === null, 'an outside system card has no training box');
    await p.evaluate(() => openRoute(CBY['cdn-bv']));
    ok(await read() === null, 'a connection card has no training box');
    await seed(['aa', 'target']);
    await p.evaluate(() => openRoute(CBY['aa-target']));
    ok(await p.isVisible('#card') && await read() === null, 'nor has a connection between two Adobe products');

    // 5. the link under a product's name opens the box, in view, and changes no fees
    await seed(['aemsites']);
    const fees0 = await snapshot();
    await p.evaluate(() => { pinned = true; showCard('p', 'aemsites'); });
    await p.click('#card button.trjump');
    await p.waitForTimeout(200);
    const jumped = await read();
    ok(jumped.open && jumped.headingInView && await p.evaluate(() => document.activeElement.matches('#card details.ready > summary')) && await snapshot() === fees0,
      'the link under a product\'s name opens the box, brings its heading into view and moves the keyboard there, changing no fees', JSON.stringify([jumped.open, jumped.headingInView]));

    // 6. the menu in the top bar
    const menu = () => p.evaluate(() => { const m = document.querySelector('#tr-menu'), text = e => e.textContent.replace(/\s+/g, ' ').trim();
      return {open: !m.hidden, expanded: document.querySelector('#tr-btn').getAttribute('aria-expanded'), links: [...m.querySelectorAll('a')].map(a => [a.getAttribute('href'), text(a.querySelector('b')), a.target, a.rel]),
        rows: [...m.querySelectorAll('[data-tr]')].map(r => [r.dataset.tr, text(r)]), left: Math.round(m.getBoundingClientRect().left), right: Math.round(m.getBoundingClientRect().right), wide: innerWidth}; });
    const PORTALS = [['https://certification.adobe.com/courses/', 'Adobe courses', '_blank', 'noopener'], ['https://partners.adobe.com/digitalexperience/learn/on-demand-trainings#resources', 'Partner on-demand trainings', '_blank', 'noopener']];
    await p.evaluate(() => { hideCard(true); st = {...st, play: 'aem', on: [], out: ['cdn'], ls: {}, keep: {}, fresh: true, pubSig: null, decisions: {authoring: ''}}; render(); });
    await p.waitForTimeout(250);
    await p.click('#tr-btn');
    const onPlay = await menu();
    ok(onPlay.open && onPlay.expanded === 'true' && JSON.stringify(onPlay.links) === JSON.stringify(PORTALS) && JSON.stringify(onPlay.rows.map(r => r[0])) === '["bv","so","eds"]' &&
      onPlay.rows[2][1] === 'AEM Sites with Edge Delivery Services' + DATA.products.eds.exams.length + ' certifications' && onPlay.rows[0][1] === 'Brand VisibilityTraining links' && onPlay.left >= 16 && onPlay.right <= onPlay.wide - 16,
      'the Get trained and certified button in the top bar opens a menu with Adobe courses and Partner on-demand trainings, each in a new tab, then one row for each Adobe product on the canvas and none for an outside system', JSON.stringify(onPlay));
    await p.click('#tr-menu [data-tr="eds"]');
    await p.waitForTimeout(250);
    const fromMenu = await read();
    ok(fromMenu && fromMenu.open && fromMenu.headingInView && !(await menu()).open && await p.evaluate(() => card.id === 'eds'), 'a product\'s row closes the menu and opens that product\'s card with its box open and in view');
    await p.keyboard.press('Escape');
    await p.click('#tr-btn');
    await p.keyboard.press('Escape');
    ok(!(await menu()).open && await p.evaluate(() => document.activeElement.id === 'tr-btn'), 'Escape closes the menu and returns to its button');
    await p.click('#tr-btn');
    await p.click('#add-btn');
    ok(!(await menu()).open && await p.isVisible('#add-menu'), 'opening Add product closes it, so one menu is open at a time');
    await p.keyboard.press('Escape');
    const heights = [];
    for (const width of [1440, 1280, 1180, 1024, 900, 768, 390]) { await p.setViewportSize({width, height: 844}); await p.waitForTimeout(350);
      heights.push([width, await p.evaluate(() => [Math.round(document.querySelector('.masthead').getBoundingClientRect().height), document.documentElement.scrollWidth > innerWidth + 1])]); }
    ok(heights.every(([w, [h, sideways]]) => !sideways && h === (w === 390 ? 106 : 69)), 'the top bar keeps its height from a wide screen to a phone: the button\'s name shortens to Training, then to its cap alone', JSON.stringify(heights));
    await p.click('#tr-btn');
    const small = await menu();
    ok(small.open && small.left >= 16 && small.right <= small.wide - 16 && await p.evaluate(() => document.querySelector('#tr-btn').getAttribute('aria-label') === 'Get trained and certified'), 'on a phone the menu stays inside the screen and the button keeps its name for screen readers', JSON.stringify([small.left, small.right, small.wide]));
    await p.keyboard.press('Escape');
    await p.setViewportSize({width: 1440, height: 900});
    const first = await browser.newPage({viewport: {width: 1440, height: 900}});
    first.on('pageerror', e => errors.push(e.message));
    await first.goto('http://localhost:' + server.address().port + '/');
    await first.waitForFunction(() => window.READY);
    await first.click('#tr-btn');
    ok(await first.evaluate(PORTALS => { const m = document.querySelector('#tr-menu'); return !m.hidden && !m.querySelector('[data-tr]') && JSON.stringify([...m.querySelectorAll('a')].map(a => a.getAttribute('href'))) === JSON.stringify(PORTALS.map(l => l[0])) &&
      document.querySelector('#trwrap').nextElementSibling.id === 'save-draft' && getComputedStyle(document.querySelector('#save-draft')).display === 'none'; }, PORTALS), 'on the first page the menu holds the two portals only, and its button sits before Open draft');
    await first.goto('http://localhost:' + server.address().port + '/sow/index.html#scope');
    await first.waitForTimeout(900);
    await first.click('#tr-btn');
    const steps = await first.evaluate(() => { const m = document.querySelector('#tr-menu'), text = e => e.textContent.replace(/\s+/g, ' ').trim();
      return {open: !m.hidden, links: [...m.querySelectorAll('a')].map(a => [a.getAttribute('href'), text(a.querySelector('b')), a.target, a.rel]), levels: text(m).includes('skill level: Foundations, Professional, Expert.'), next: document.querySelector('#trwrap').nextElementSibling.id}; });
    await first.keyboard.press('Escape');
    ok(steps.open && JSON.stringify(steps.links) === JSON.stringify(PORTALS) && steps.levels === (DATA.courseLevels.join(', ') === 'Foundations, Professional, Expert') && steps.next === 'save-draft' && await first.evaluate(() => document.querySelector('#tr-menu').hidden),
      'the Scope, Services, Statement of work and RFI Builder page has the same button before Save draft, with the same two portals and skill levels, and Escape closes it', JSON.stringify(steps));
    await first.close();

    // 4. a fixed play and a phone
    await p.evaluate(() => { hideCard(true); st = {...st, play: 'aem', on: [], out: ['cdn'], ls: {}, keep: {}, fresh: true, pubSig: null, decisions: {authoring: ''}}; render(); });
    await p.waitForTimeout(250);
    await p.dblclick('.node[data-p="so"]');
    const fixed = await read();
    ok(fixed && !fixed.open && fixed.note && fixed.foot && fixed.status === expected('so').status, 'the box is on product cards in the fixed plays too, closed, and at the foot of the card under the note about connection services', JSON.stringify(fixed && [fixed.open, fixed.note, fixed.foot, fixed.status]));
    await p.setViewportSize({width: 390, height: 844});
    await p.waitForTimeout(600);   // the page re-places its card shortly after a resize
    await seed(['cja']);
    await p.evaluate(() => { pinned = true; showCard('p', 'cja'); });
    await p.locator('#card details.ready > summary').scrollIntoViewIfNeeded();
    await p.click('#card details.ready > summary');
    await p.waitForTimeout(200);
    const phone = await read();
    ok(phone.open && phone.headingInView && !phone.sideways && phone.stacked && phone.visible >= phone.cardHeight - 60, 'on a phone the opened box keeps its heading in view, stacks each row, fills the card and causes no sideways scroll', JSON.stringify(phone && [phone.headingInView, phone.sideways, phone.stacked, phone.visible, phone.cardHeight]));
    await p.click('#card details.ready > summary');
    await p.waitForTimeout(200);
    const shut = await read();
    ok(!shut.open && shut.headingInView, 'closing the box leaves its heading in view');
    ok(errors.length === 0, 'no browser errors', errors.join('; '));
  } finally { await browser.close(); server.close(); }
  if (fails) { console.error(fails + ' checks failed'); process.exitCode = 1; } else console.log('ALL TRAINING CHECKS PASSED');
})().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
