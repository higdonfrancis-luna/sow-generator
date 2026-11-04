// Mockup (Nov 4 2026, Adam: "go"): the seven "add now" outside systems from research/blindspots_2026-11-04.md on the
// canvas, injected at runtime into a copy of the built page (nothing built): ad platforms and BI tools on CJA, content
// source and search data on Edge Delivery / Sites Optimizer / Brand Visibility, the CRM to Marketo and Target, the data
// warehouse to Real-Time CDP and Journey Optimizer, another CMS to Brand Concierge. Services and hours are the
// researchers' planning estimates; sources still need a live check.   node sow/mockups/nov4_outside_more/mock_more.js
const {chromium} = require('playwright'); const path = require('path');
const PAGE = 'file://' + path.join(__dirname, '..', '..', 'site', 'index.html'), OUT = __dirname;
function inject() {
  const sv = d => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  Object.assign(I, {ads: sv('<path d="M3 10v4h3l6 4V6l-6 4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>'), bi: sv('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    doc: sv('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>'), search: sv('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'), cms: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11"/>')});
  const prod = (id, name, icon, systems) => { const p = {id, name, title: name, outside: true, icon, systems, lines: [], more: []}; CAT.products.push(p); P[id] = p; };
  prod('ads', 'Ad platforms', 'ads', 'Google Ads, Meta, Pinterest, Snapchat, TikTok, or any other through a CSV export');
  prod('bi', 'BI tools', 'bi', 'Power BI, Tableau, Looker, or Excel through Report Builder');
  prod('csrc', 'Content source', 'doc', 'Microsoft SharePoint or Google Drive');
  prod('search', 'Search data', 'search', 'Google Search Console and Google Analytics 4');
  prod('cms', 'Website on another CMS', 'cms', 'Any CMS, with the client\'s tag manager');
  const line = (id, name, unit, low, base, high, url) => { LN[id] = {id, name, unit, low, base, high, url, src: 'Experience League', origin: 'research', scope: ''}; DEF[id] = true; };
  const conn = (id, a, b, kind, label, url, lines, more = []) => { const c = {id, a, b, kind: 'outside', line: kind, label, how: label, source: {url, title: 'Experience League'}, lines, more, availability: 'Source to re-check live before it is built.', prereqs: ['The client grants access to the system', 'The client names an owner on its side', 'Adobe documents the route (re-check live)'], gain: {title: '', text: ''}, flows: []}; C.push(c); CBY[id] = c; };
  const EL = 'https://experienceleague.adobe.com/en/docs/';
  line('AD1', 'Ad platform data into CJA', 'one-time', 16, 32, 56, EL + 'experience-platform/sources/connectors/advertising/google-ads');
  line('AD2', 'Paid, organic and AI-referred traffic report', 'one-time', 8, 16, 32, EL + 'analytics-platform/using/cja-usecases/data-views/summary-data');
  conn('ads-cja', 'ads', 'cja', 'platform', 'Ad accounts authorized as Experience Platform sources; paid media datasets join site conversions in CJA', EL + 'experience-platform/sources/connectors/advertising/google-ads', ['AD1', 'AD2']);
  line('BI1', 'BI extension setup and number check', 'one-time', 16, 24, 48, EL + 'analytics-platform/using/cja-dataviews/bi-extension');
  line('BI2', 'Executive dashboards in the client\'s BI tool', 'one-time', 24, 48, 96, EL + 'analytics-platform/using/cja-dataviews/bi-extension');
  conn('cja-bi', 'cja', 'bi', 'platform', 'BI tools read CJA data views live through the BI extension (CJA Select or higher)', EL + 'analytics-platform/using/cja-dataviews/bi-extension', ['BI1', 'BI2']);
  line('CS1', 'Content source setup with the client\'s Microsoft 365 or Google admin', 'one-time', 8, 16, 32, EL + 'experience-manager-cloud-service/content/implementing/using-cloud-manager/edge-delivery-sites/configure-content-source');
  line('CS2', 'Sites Optimizer write-back to the content source', 'one-time', 8, 12, 24, EL + 'experience-manager-edge-delivery/using/publish/setup-customer-sharepoint');
  conn('csrc-eds', 'csrc', 'eds', 'native', 'Edge Delivery reads the client\'s SharePoint or Google Drive folder', EL + 'experience-manager-cloud-service/content/implementing/using-cloud-manager/edge-delivery-sites/configure-content-source', ['CS1']);
  conn('csrc-so', 'csrc', 'so', 'native', 'Sites Optimizer writes approved fixes back into the documents', EL + 'experience-manager-edge-delivery/using/publish/setup-customer-sharepoint', ['CS2']);
  line('SD1', 'Search Console and GA4 connections for Brand Visibility', 'one-time', 4, 8, 16, EL + 'brand-visibility/using/dashboards/brands-management');
  conn('search-bv', 'search', 'bv', 'native', 'Search Console queries become suggested prompts; GA4 fills the Business Impact tab', EL + 'brand-visibility/using/dashboards/brands-management', ['SD1']);
  conn('search-so', 'search', 'so', 'native', 'Sites Optimizer\'s own Search Console connection (already in Sites Optimizer setup)', EL + 'experience-manager-sites-optimizer/content/documentation/settings', []);
  line('CR1', 'Customer Attributes from the CRM into Target', 'one-time', 16, 32, 56, EL + 'target/using/audiences/visitor-profiles/working-with-customer-attributes');
  conn('crm-marketo', 'crm', 'marketo', 'native', 'Native Salesforce or Dynamics sync (Marketo\'s CRM sync and field mapping, MK02)', EL + 'marketo/using/product-docs/crm-sync/salesforce-sync/understanding-the-salesforce-sync', []);
  conn('crm-target', 'crm', 'target', 'platform', 'Customer Attributes: a CRM or point of sale file keyed on the customer ID', EL + 'target/using/audiences/visitor-profiles/working-with-customer-attributes', ['CR1']);
  line('DW1', 'Warehouse tables into Experience Platform', 'one-time', 40, 80, 140, EL + 'experience-platform/sources/home');
  line('DW2', 'Data Mirror for orchestrated campaigns', 'one-time', 32, 56, 96, EL + 'experience-platform/xdm/data-mirror/overview');
  conn('dwh-rtcdp', 'dwh', 'rtcdp', 'platform', 'Warehouse tables copied into Experience Platform on a schedule, or queried in place', EL + 'experience-platform/sources/home', ['DW1']);
  conn('dwh-ajo', 'dwh', 'ajo', 'platform', 'Data Mirror brings row-level changes Journey Optimizer\'s orchestrated campaigns use', EL + 'experience-platform/xdm/data-mirror/overview', ['DW2']);
  line('CM1', 'Web SDK and Brand Concierge client through the client\'s tag manager', 'one-time', 16, 32, 64, EL + 'brand-concierge/content/documentation/brand-concierge-faq');
  line('CM2', 'Website Links knowledge source and refresh', 'one-time', 8, 16, 32, EL + 'brand-concierge/content/documentation/knowledge-sources/knowledge-sources');
  conn('cms-bc', 'cms', 'bc', 'platform', 'Brand Concierge runs on any site through a tag manager; the site is read as a knowledge source', EL + 'brand-concierge/content/documentation/brand-concierge-faq', ['CM1', 'CM2']);
  // offer them on the plays, beside the product they connect to
  const place = (pl, id, near) => { const all = {...pl.pos, ...(pl.opos || {})}, used = new Set(Object.values(all).map(v => v.join())), [c, r] = all[near];
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1], [2, 0], [-2, 0]]) { const k = [c + dc, r + dr]; if (!used.has(k.join())) { pl.opos = {...(pl.opos || {}), [id]: k}; break; } }
    pl.outside = [...(pl.outside || []), id]; };
  const add = (play, id, near) => { const pl = PLAYS[play]; if (pl && (pl.products.includes(near) || (pl.outside || []).includes(near))) place(pl, id, near); };
  add('cja', 'ads', 'cja'); add('cja', 'bi', 'cja'); add('aem', 'csrc', 'eds'); add('aem', 'search', 'bv'); add('fsi', 'cms', 'bc');
  for (const p of ['cja', 'commerce', 'fsi', 'abv']) add(p, 'search', 'bv');
  const own = PLAYS.custom; for (const [id, near] of [['ads', 'cja'], ['bi', 'cja'], ['csrc', 'eds'], ['search', 'bv'], ['cms', 'bc']]) place(own, id, near);
  UNI = {k: '', s: new Set()}; pkKey = '';
}
(async () => { const b = await chromium.launch();
  const open = async (s, h = 900) => { const p = await (await b.newContext({viewport: {width: 1440, height: h}, deviceScaleFactor: 2})).newPage(); await p.goto(PAGE);
    await p.evaluate(s => localStorage.setItem('abv-sow-build-v1', JSON.stringify({v: 2, rate: 150, ...s})), {...s, out: []}); await p.reload(); await p.waitForTimeout(900);
    await p.evaluate(`(${inject})()`); await p.evaluate(out => { st.out = out; render(); }, s.out || []); await p.waitForTimeout(900); return p; };
  let p = await open({play: 'cja', out: ['cdn', 'ads', 'bi', 'crm']}, 1000);
  await p.click('.ib[data-c="ads-cja"]'); await p.waitForTimeout(500); await p.screenshot({path: path.join(OUT, 'more_cja.png')}); await p.context().close();
  p = await open({play: 'aem', out: ['cdn', 'csrc', 'search']}, 1000); await p.screenshot({path: path.join(OUT, 'more_aem.png')}); await p.context().close();
  p = await open({play: 'custom', on: ['marketo', 'target', 'rtcdp', 'ajo'], out: ['crm', 'dwh']}, 1000); await p.click('.node[data-p="crm"]'); await p.waitForTimeout(900);
  await p.click('#card [data-close]').catch(() => {}); await p.waitForTimeout(300); await p.screenshot({path: path.join(OUT, 'more_own_play.png')}); await p.context().close();
  p = await open({play: 'cja', out: []}, 1100); await p.click('#out-btn'); await p.waitForTimeout(400); await p.screenshot({path: path.join(OUT, 'more_menu_cja.png')}); await p.context().close();
  await b.close(); })();
