// Mockup v2 (Nov 4 2026, Adam: "redraw it all again where it needs to be fixed or we want to add things"). Nothing built:
// injected at runtime into a copy of the built page. Changes from nov4_outside_more/: the facts from the live check
// (research/blindspots_live_2026-11-04.md), "Content source" renamed Authoring documents, AEM Assets offered on the AEM
// play, Ad platforms out through Real-Time CDP destinations on Create your own play, and a "Needs [package]" tag (assume
// the top package; the tag is the check and the upsell). Hours are planning estimates.
//   node sow/mockups/nov4_outside_v2/mock_v2.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', '..', 'site', 'index.html'), OUT = __dirname;
function inject() {
  const sv = d => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  Object.assign(I, {ads: sv('<path d="M3 10v4h3l6 4V6l-6 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>'), bi: sv('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    doc: sv('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>'), search: sv('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'), cms: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11"/>')});
  const prod = (id, name, icon, systems) => { const p = {id, name, title: name, outside: true, icon, systems, lines: [], more: []}; CAT.products.push(p); P[id] = p; };
  prod('ads', 'Ad platforms', 'ads', 'Google Ads, Meta, Pinterest, Snapchat, TikTok, or any other through a CSV export');
  prod('bi', 'BI tools', 'bi', 'Power BI, Tableau, Looker, or Excel through Report Builder');
  prod('csrc', 'Authoring documents', 'doc', 'Word or Google Docs in the client\'s SharePoint or Google Drive');
  prod('search', 'Search data', 'search', 'Google Search Console and Google Analytics 4');
  prod('cms', 'Website on another CMS', 'cms', 'Any CMS, with the client\'s tag manager');
  P.aemassets.systems = 'Images, video and brand files authors pull into pages';
  const line = (id, name, unit, low, base, high, url) => { LN[id] = {id, name, unit, low, base, high, url, src: 'Experience League', origin: 'research', scope: ''}; DEF[id] = true; };
  const conn = (id, a, b, kind, label, url, lines, availability, prereqs) => { const c = {id, a, b, kind: 'outside', line: kind, label: '', how: label, source: {url, title: 'Experience League'}, lines, more: [], availability, prereqs, gain: null, flows: []}; C.push(c); CBY[id] = c; };
  const EL = 'https://experienceleague.adobe.com/en/docs/';
  // ad platforms into CJA: the sources come with CJA; the join to web conversions needs CJA Select or higher
  line('AD1', 'Ad platform sources into CJA, with the client\'s ad admins', 'one-time', 16, 32, 56, EL + 'experience-platform/sources/connectors/advertising/google-ads');
  line('AD2', 'Ad spend joined to web conversions: ROAS and cost per web order', 'one-time', 16, 32, 56, EL + 'analytics-platform/using/cja-usecases/data-views/summary-data');
  conn('ads-cja', 'ads', 'cja', 'platform', 'Google Ads, Pinterest, Snapchat and TikTok sources come with CJA; ad spend joins web conversions through campaign IDs in landing page URLs',
    EL + 'experience-platform/sources/connectors/advertising/google-ads', ['AD1', 'AD2'], 'Google Ads and Meta Ads are live; Pinterest, Snapchat and TikTok are beta. Listed for Azure-hosted Experience Platform only.',
    ['The client\'s ad admins approve access in each network (Google developer token, Meta app, TikTok business verification)', 'Landing page URLs carry campaign, ad group and ad IDs', 'Sending CJA audiences back out to ad platforms needs Real-Time CDP']);
  // BI tools out of CJA
  line('BI1', 'BI extension setup and number check', 'one-time', 16, 24, 48, EL + 'analytics-platform/using/cja-dataviews/bi-extension');
  line('BI2', 'Executive dashboards in the client\'s BI tool', 'one-time', 24, 48, 96, EL + 'analytics-platform/using/cja-dataviews/bi-extension');
  conn('cja-bi', 'cja', 'bi', 'platform', 'Power BI, Tableau and Looker read CJA data views live through the BI extension', EL + 'analytics-platform/using/cja-dataviews/bi-extension', ['BI1', 'BI2'],
    'Generally available. Aggregate data only, up to 50,000 rows a query.', ['The client\'s admin grants Query Service and data view permissions', 'The client names an owner for each dashboard']);
  // authoring documents: Edge Delivery publishes what authors write in Word or Google Docs
  line('CS1', 'Document authoring setup with the client\'s Microsoft 365 or Google admin, and author training', 'one-time', 8, 16, 32, EL + 'experience-manager-cloud-service/content/implementing/using-cloud-manager/edge-delivery-sites/configure-content-source');
  line('CS2', 'Sites Optimizer write-back to SharePoint or Google Drive', 'one-time', 8, 12, 24, EL + 'experience-manager-edge-delivery/using/publish/setup-customer-sharepoint');
  conn('csrc-eds', 'csrc', 'eds', 'native', 'Authors write pages in Word or Google Docs; Edge Delivery publishes them as pages', EL + 'experience-manager-cloud-service/content/implementing/using-cloud-manager/edge-delivery-sites/configure-content-source', ['CS1'],
    'Generally available. Only when your client authors in documents; with Experience Workspace or AEM Sites, authoring stays in Adobe.', ['The client\'s Microsoft 365 or Google admin approves Adobe\'s access', 'Authors preview and publish from Sidekick']);
  conn('csrc-so', 'csrc', 'so', 'native', 'Sites Optimizer writes approved fixes back into the documents; authors still publish', EL + 'experience-manager-edge-delivery/using/publish/setup-customer-sharepoint', ['CS2'],
    'Generally available.', ['SharePoint on the client\'s own domain needs a second app registration; Google Drive needs only a folder share']);
  // search data
  line('SD1', 'Search Console and GA4 connections, and prompts picked from search queries', 'one-time', 4, 8, 16, EL + 'brand-visibility/using/dashboards/brands-management');
  conn('search-bv', 'search', 'bv', 'native', 'Search Console queries suggest prompts to track; GA4 fills the Business Impact tab', EL + 'brand-visibility/using/dashboards/brands-management', ['SD1'],
    'Generally available.', ['Someone with Owner or Full permission on the Search Console property signs in with Google', 'Queries are never added automatically: a person picks the prompts']);
  conn('search-so', 'search', 'so', 'native', 'Sites Optimizer\'s own Search Console connection (already part of Sites Optimizer setup)', EL + 'experience-manager-sites-optimizer/content/documentation/settings', [], 'Generally available.', []);
  // website on another CMS, for Brand Concierge (hours cut to Adobe's "short, one-time configuration")
  line('CM1', 'Brand Concierge script and surface rules through the client\'s tag manager', 'one-time', 4, 8, 16, EL + 'brand-concierge/content/documentation/brand-concierge-faq');
  line('CM2', 'Website Links knowledge source and refresh', 'one-time', 2, 4, 8, EL + 'brand-concierge/content/documentation/knowledge-sources/knowledge-sources');
  conn('cms-bc', 'cms', 'bc', 'platform', 'Brand Concierge runs on any site through the client\'s tag manager; the site is read as a knowledge source', EL + 'brand-concierge/content/documentation/brand-concierge-faq', ['CM1', 'CM2'],
    'Brand Concierge is generally available; Brand Concierge for the Web SDK is in beta.', ['The client\'s web team installs the script', 'Legal reviews the consent banner for chat data before go-live']);
  // CRM to Marketo and Target
  line('CR1', 'Customer Attributes from the CRM into Target', 'one-time', 16, 32, 56, EL + 'target/using/audiences/visitor-profiles/working-with-customer-attributes');
  conn('crm-marketo', 'crm', 'marketo', 'native', 'Salesforce, Dynamics or Veeva sync. Map the fields right the first time: a new sync means a new Marketo instance', EL + 'marketo/using/product-docs/crm-sync/salesforce-sync/understanding-the-salesforce-sync', ['MK02'],
    'Generally available.', ['A Salesforce or Dynamics admin sets up a dedicated sync user', 'Sales, marketing and the CRM admin agree a data dictionary']);
  conn('crm-target', 'crm', 'target', 'platform', 'Customer Attributes: a CRM file keyed on the customer ID, used in Target only', EL + 'target/using/audiences/visitor-profiles/working-with-customer-attributes', ['CR1'],
    'Generally available.', ['Visitors are identified on the site with a customer ID', 'A Customer Attributes product profile in the Admin Console']);
  // data warehouse to Real-Time CDP and Journey Optimizer
  line('DW1', 'Warehouse tables into Experience Platform', 'one-time', 40, 80, 140, EL + 'experience-platform/sources/home');
  line('DW2', 'Data Mirror for orchestrated campaigns', 'one-time', 32, 56, 96, EL + 'experience-platform/xdm/data-mirror/overview');
  conn('dwh-rtcdp', 'dwh', 'rtcdp', 'platform', 'Snowflake, BigQuery or Databricks tables copied into Experience Platform on a schedule', EL + 'experience-platform/sources/home', ['DW1'],
    'Generally available.', ['The client allowlists Adobe\'s IP addresses in the warehouse', 'Deletes are managed at the source, by the client']);
  conn('dwh-ajo', 'dwh', 'ajo', 'platform', 'Data Mirror brings row-level changes Journey Optimizer\'s orchestrated campaigns use', EL + 'experience-platform/xdm/data-mirror/overview', ['DW2'],
    'Generally available with the Campaigns package.', ['Change tracking is turned on in the client\'s tables']);
  // ad platforms out: audiences through Real-Time CDP destinations
  line('AD3', 'Ad platform destinations: account access, hashed identities and match-rate checks', 'one-time', 8, 16, 32, EL + 'experience-platform/destinations/catalog/advertising/overview');
  conn('ads-rtcdp', 'ads', 'rtcdp', 'platform', 'Audiences go out to Google, Meta, LinkedIn, TikTok, The Trade Desk and more through Real-Time CDP destinations', EL + 'experience-platform/destinations/catalog/advertising/overview', ['AD3'],
    'Generally available, except destinations marked beta (Snapchat Ads, The Trade Desk CRM).', ['The client grants access to each ad account', 'The client picks the identities to send (hashed email, phone or device IDs)']);
  // the Needs [package] tag: assume the top package; the tag is the check and the upsell
  const TIER = {AD2: 'CJA Select or higher', BI1: 'CJA Select or higher', BI2: 'CJA Select or higher', CS2: 'Sites Optimizer Ultimate', SD1: 'paid Brand Visibility',
    CR1: 'Target Premium for over 5 attributes', DW1: 'Real-Time CDP Ultimate', DW2: 'a Journey Optimizer Campaigns package'};
  const CTIER = {'ads-cja': 'CJA Select or higher', 'cja-bi': 'CJA Select or higher', 'csrc-so': 'Sites Optimizer Ultimate', 'search-bv': 'paid Brand Visibility',
    'crm-target': 'Target Premium for over 5 attributes', 'dwh-rtcdp': 'Real-Time CDP Ultimate or the Advanced Enterprise connectors', 'dwh-ajo': 'a Journey Optimizer Campaigns package'};
  const css = document.createElement('style'); css.textContent = '.tier{display:inline-block;font-size:12px;line-height:16px;font-weight:700;color:#B40000;background:#fff;border:1.5px solid #EB1000;border-radius:10px;padding:1px 8px;margin:3px 0 0;white-space:normal}'
    + '.ln .nm .tier{display:table;margin-top:4px}.card .tierp{margin:2px 0 8px;font-size:13.5px;line-height:19px;color:#1C1C1C}.card .tierp .tier{font-size:13px;margin:0 0 3px}';
  document.head.appendChild(css);
  const row0 = row; row = (l, e) => { const h = row0(l, e); if (!TIER[l]) return h; const i = h.indexOf('</a>', h.indexOf('<a class="src"')) + 4; return h.slice(0, i) + `<span class="tier">Needs ${TIER[l]}</span>` + h.slice(i); };
  const card0 = cardHTML; cardHTML = (k, id) => { const h = card0(k, id); return k === 'c' && CTIER[id] ? h.replace('</h4>', `</h4><p class="tierp"><span class="tier">Needs ${CTIER[id]}</span><br>Check what your client owns. If they don't have it, it's an upsell for Adobe.</p>`) : h; };
  // offer them on the plays, at a set spot beside the product they connect to
  const at = (play, id, pos) => { const pl = PLAYS[play]; pl.opos = {...(pl.opos || {}), [id]: pos}; pl.outside = [...(pl.outside || []).filter(x => x !== id), id]; };
  at('cja', 'ads', [2, 0]); at('cja', 'bi', [2, 1]);
  at('aem', 'search', [-1, 0]); at('aem', 'csrc', [1, 1]); at('aem', 'aemassets', [2, 0]);
  at('fsi', 'cms', [2, 0]);
  for (const p of ['cja', 'commerce', 'fsi', 'abv']) { const pl = PLAYS[p], used = new Set(Object.values({...pl.pos, ...pl.opos}).map(v => v.join())), [c, r] = pl.pos.bv;
    for (const k of [[c - 1, r], [c, r + 1], [c - 1, r + 1], [c, r - 1]]) if (!used.has(k.join())) { at(p, 'search', k); break; } }
  const own = PLAYS.custom; for (const [id, pos] of [['ads', [3, -1]], ['bi', [4, 0]], ['csrc', [2, 1]], ['search', [-1, 0]], ['cms', [4, 1]]]) { own.opos[id] = pos; own.outside.push(id); }
  // the menu: Adobe products that connect to the play sit in their own group (AEM Assets on the AEM play)
  const menu0 = outMenuHTML; outMenuHTML = () => { const pl = play(), ad = (pl.outside || []).filter(id => !P[id].outside && !has(id)); if (!ad.length) return menu0();
    const keep = pl.outside; pl.outside = keep.filter(id => P[id].outside); let h = menu0(); pl.outside = keep;
    return h.replace('Add an outside system', 'Add a product or system') + '<div class="g">Adobe products that connect to this play</div>' + ad.map(id => `<button class="it2" data-out="${id}" role="menuitem"><span class="nm">${esc(P[id].name)}</span><span class="ctag">Connects to Edge Delivery Services</span><span class="sys">${esc(P[id].systems || '')}</span></button>`).join(''); };
  const ob = document.getElementById('out-btn'); if ((play().outside || []).some(id => !P[id].outside)) for (const n of ob.childNodes) if (n.nodeType === 3 && /Add outside system/.test(n.textContent)) n.textContent = 'Add product or system ';
  UNI = {k: '', s: new Set()}; pkKey = '';
}
(async () => { const b = await chromium.launch();
  const open = async (s, h = 1000) => { const p = await (await b.newContext({viewport: {width: 1440, height: h}, deviceScaleFactor: 2})).newPage(); await p.goto(PAGE);
    await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, ...s})), {...s, out: []}); await p.reload(); await p.waitForTimeout(900);
    await p.evaluate(`(${inject})()`); await p.evaluate(out => { st.out = out; render(); }, s.out || []); await p.waitForTimeout(900); return p; };
  const shot = async (s, file, click, h, first) => { const p = await open(s, h); if (first) { await p.click(first); await p.waitForTimeout(700); await p.click('#card [data-close]').catch(() => {}); await p.waitForTimeout(300); } if (click) { await p.click(click); await p.waitForTimeout(600); } await p.screenshot({path: path.join(OUT, file)}); await p.context().close(); };
  if (process.argv[2] !== 'probe') await shot({play: 'cja', out: ['cdn', 'ads', 'bi', 'search']}, 'v2_cja_ads.png', '.ib[data-c="ads-cja"]');
  if (process.argv[2] !== 'probe') await shot({play: 'cja', out: ['cdn', 'ads', 'bi', 'search']}, 'v2_cja_bi.png', '.ib[data-c="cja-bi"]');
  if (process.argv[2] !== 'probe') await shot({play: 'aem', out: ['cdn', 'search', 'csrc', 'aemassets']}, 'v2_aem.png');
  if (process.argv[2] !== 'probe') await shot({play: 'aem', out: ['cdn', 'search', 'csrc', 'aemassets']}, 'v2_aem_documents.png', '.ib[data-c="csrc-so"]');
  if (process.argv[2] !== 'probe') await shot({play: 'aem', out: ['cdn', 'search', 'csrc', 'aemassets']}, 'v2_aem_assets.png', '.ib[data-c="aemassets-eds"]');
  if (process.argv[2] !== 'probe') await shot({play: 'aem', out: ['cdn']}, 'v2_aem_menu.png', '#out-btn', 1100);
  if (process.argv[2] !== 'probe') await shot({play: 'fsi', out: ['cdn', 'cms', 'search']}, 'v2_fsi_cms.png', '.ib[data-c="cms-bc"]');
  if (process.argv[2] !== 'probe') await shot({play: 'custom', on: ['rtcdp', 'ajo', 'marketo', 'target'], out: ['crm', 'dwh', 'ads']}, 'v2_own_play.png', '.ib[data-c="dwh-rtcdp"]', 1100, '.node[data-p="dwh"]');
  if (process.argv[2] === 'probe') { const p = await open({play: 'custom', on: ['rtcdp', 'ajo', 'marketo', 'target'], out: ['crm', 'dwh', 'ads']}); console.log(await p.evaluate(() => [st.on, st.play, [...document.querySelectorAll('.node')].map(e => e.dataset.p), [...document.querySelectorAll('.ib')].map(e => e.dataset.c), st.out, has('dwh'), PLAYS.custom.opos])); }
  await b.close(); })();
