// Step 91 (Nov 13 2026, Adam: "yes, build 1 and 2", item 1 of sow/rfp_prototype/kb_method/ROUND3_PROPOSAL.md): six services for
// the catalog gaps ChatGPT's test RFI found, each researched on Adobe's pages, re-checked by a second reader and fixed
// (sow/canvas/research/gaps_2026-11-13/): SI07 to SI10 on AEM Sites (page review and approval workflow; language copies and local
// corrections; nightly ERP or PIM data into pages; content migration from another CMS), AS07 on AEM Assets (document versions,
// expiry and replacement) and MK07 on Marketo Engage (email program and preference migration). Optional, in no play, hours ours.
// Run from the repo root after python3 sow/canvas/build.py and python3 sow/build_site.py:
//   node sow/test_step91.js
const fs = require('fs'), path = require('path');
const {open} = require(path.join(__dirname, 'rfp_prototype', 'review_2026-11-09', 'harness.js'));
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas', 'catalog.json'), 'utf8'));
const KB = JSON.parse(fs.readFileSync(path.join(__dirname, 'rfp_method.json'), 'utf8'));
const GAPS = path.join(__dirname, 'canvas', 'research', 'gaps_2026-11-13');
const OWN = {aemsites: ['SI07', 'SI08', 'SI09', 'SI10'], aemassets: ['AS07'], marketo: ['MK07']}, ALL = Object.values(OWN).flat();
const CAVEATS = /limited availability|coming soon|\bbeta\b|\blabs\b|early access|early adopter|generally available|not stated by Adobe|confirm (?:\w+ ){0,5}with Adobe|Consulting Services/i;
(async () => {
  // 1. the catalog
  const L = CAT.lines, P = Object.fromEntries(CAT.products.map(p => [p.id, p])), adobe = CAT.products.filter(p => !p.outside).length;
  // Nov 15 2026 (19b0363, the reviewed canvas) added one connection after this step, Edge Delivery Services + Customer Journey Analytics (eds-cja), with one
  // optional service of its own, EDC01 "Measure Edge Delivery page and block interactions": 152 connections and 532 services, and still 34 Adobe products
  // and 9 outside systems
  const edc = CAT.connections.find(c => c.id === 'eds-cja');
  // Nov 17 2026 (Adam: "yes for both"): Brand Intelligence + Creative Cloud and Brand Intelligence + Coworker, two connections with no services: 157 connections
  // Nov 17 2026 (Adam: "yes!"): 26 Coworker services, all optional (CW09 to CW11 on Coworker, 23 on its connections), and the new
  // Coworker + Adobe Analytics connection (cw-aa) with one of them: 158 connections and 563 services
  // Nov 17 2026: Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models (canvas/research/wave6_figma.json), four connections with six optional services, XF01 to XF06
  ok(adobe === 34 && CAT.products.length - adobe === 10 && CAT.connections.length === 162 && Object.keys(L).length === 569 &&
    !!edc && edc.a === 'eds' && edc.b === 'cja' && edc.lines.join() === '' && edc.more.join() === 'EDC01' && !!L.EDC01 && L.EDC01.name === 'Measure Edge Delivery page and block interactions',
    'the catalog holds 34 Adobe products, 10 outside systems, 162 connections and 569 services (Figma connects to AEM Assets, GenStudio for Performance Marketing, Adobe Express and Firefly Custom Models, with six optional services; Coworker added 26 optional services, three of its own and 23 on its connections, and Coworker + Adobe Analytics with one of them; Brand Intelligence added Creative Cloud and Coworker, with no services of their own; Coworker added two optional services, Coworker set up in an AI platform and Workfront Fusion scenarios with Coworker; Brand Intelligence added Frame.io, Firefly Creative Production and Figma, each with one optional service; this step\'s six; the reviewed canvas added Edge Delivery Services + Customer Journey Analytics with one optional service, EDC01)',
    [adobe, CAT.products.length - adobe, CAT.connections.length, Object.keys(L).length, edc ? [edc.a, edc.b, edc.lines.join('+'), edc.more.join('+')].join('/') : 'no eds-cja', (L.EDC01 || {}).name || 'no EDC01'].join());
  ok(Object.entries(OWN).every(([pid, ids]) => ids.every(i => L[i] && (P[pid].more || []).includes(i) && !(P[pid].lines || []).includes(i))), 'each new service is an optional line on its product (AEM Sites, AEM Assets, Marketo Engage), not ticked by default');
  ok(!JSON.stringify(CAT.plays).match(new RegExp('"(?:' + ALL.join('|') + ')"')), 'no play turns one on');
  ok(ALL.every(i => ['one-time', 'monthly'].includes(L[i].unit) && L[i].low <= L[i].base && L[i].base <= L[i].high), 'each has a billing unit and small, typical and large hours in order', ALL.map(i => i + ' ' + L[i].low + '/' + L[i].base + '/' + L[i].high).join(', '));
  ok(ALL.every(i => /^https:\/\/(?:experienceleague\.adobe\.com|www\.aem\.live|developer\.adobe\.com|helpx\.adobe\.com)\//.test(L[i].url) && L[i].evidence && L[i].scope), 'each carries its scope, Adobe\'s words and the Adobe page they are on');
  ok(ALL.every(i => ![L[i].name, L[i].scope, L[i].evidence, L[i].ext || '', L[i].tier || ''].some(t => CAVEATS.test(t) || /[—–]|\$\d/.test(t))), 'no release label, ask-Adobe wording, price or dash in any of them');
  ok(L.SI09.tier === 'Adobe Developer App Builder access' && /translation service provider/.test(L.SI08.ext) && /Azure Blob Storage or Amazon S3/.test(L.SI10.ext), 'what the client must license or provide is named as a prerequisite (App Builder access, a translation provider, cloud storage for Bulk Import)');
  ok(/^Where your client is moving from a CMS other than AEM\b/.test(L.SI10.scope) && /^Where your client is moving from AEM on-premise or Adobe Managed Services/.test(L.SI03.scope), 'the two migrations say which move each is for: SI10 from another CMS, SI03 from an older AEM');

  // 2. the research behind them
  const R = Object.fromEntries(ALL.map(i => [i, JSON.parse(fs.readFileSync(path.join(GAPS, i + '.json'), 'utf8'))]));
  ok(ALL.every(i => R[i].other_pages.length >= 2 && R[i].other_pages.every(o => o.quote && /^https:\/\//.test(o.url)) && R[i].checker_changes.length > 0 && R[i].hours_reasoning && R[i].notes), 'each research file has its quotes and pages, the second reader\'s changes, the hours reasoning and notes for Adam');

  // 3. the method knowledge base
  ok(ALL.every(i => KB.services[i] && KB.services[i].steps.length >= 3 && KB.services[i].phrases.length >= 6), 'each has a method entry and the phrases an RFI uses for its work', ALL.filter(i => !KB.services[i]).join());
  // the catalog is 532 services since 19b0363 (EDC01), so covering all of them is 532 entries, one for every catalog service; a count of 531 would pass
  // here while EDC01 has no method entry, and the RFI Builder then has no steps, deliverables or phrases to answer its question from
  // Nov 17 2026: batch 14 gives EDC01, XK14 to XK16, CW08 and XB16 their entries (537), and batch 15 the 26 Coworker services of the same
  // day (563); a service added later with no entry is named here
  const noMethod = Object.keys(L).filter(i => !KB.services[i]);
  ok(Object.keys(KB.services).length === 569 && !noMethod.length, 'the knowledge base covers all 569 services', Object.keys(KB.services).length + ' entries for ' + Object.keys(L).length + ' services; no entry for ' + (noMethod.join() || 'none'));

  // 4. the RFI Builder, with no AI: the questions the holdout asked lead with the new services
  const h = await open();
  const lead = async text => { await h.text(text); return h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.kind === 'adobe'); if (!q) return null; const d = RFPAnswers.compose(q); const p = d && RFPAnswers.kbPlan(q, d); return p ? (p.topic ? 'topic:' + p.topic.id : p.ids[0]) : null; }); };
  const cases = [
    ['SI07', '1. How would authors and reviewers approve a page before it goes live on our AEM Sites website? Include the treatment of an urgent correction outside office hours.'],
    ['SI08', '1. Explain how our three language versions on AEM Sites would be maintained across five markets, and how a local correction survives when the central team publishes a later update.'],
    ['SI09', '1. Describe how nightly ERP specification files would reach product pages on our AEM Sites website without exposing trade pricing or stock data.'],
    ['SI10', '1. Describe how you would move our public websites from Drupal to AEM Sites and show that retained content and inbound links survived the move.'],
    ['AS07', '1. Explain how an approved replacement document in AEM Assets would reach every public page that uses it, and how a withdrawn safety certificate is kept off new pages.'],
    ['MK07', '1. Describe the migration of our active email programmes, subscription choices and suppression records into Marketo Engage.'],
  ];
  for (const [want, text] of cases) { const got = await lead(text); ok(got === want, want + ' answers: "' + text.slice(3, 90) + '..."', got); }
  let got = await lead('1. Describe how you would move our websites from AEM 6.5 on-premise to AEM Sites as a Cloud Service.');
  ok(got === 'SI03', 'a move from an older AEM still leads with the Content Transfer Tool, not the migration from another CMS', got);
  got = await lead('1. We have chosen AEM Sites with Edge Delivery Services. Describe how you would move our Drupal website onto the new site.');
  ok(got === 'A02', 'on an RFI for Edge Delivery Services, moving another CMS is the SEO-safe migration onto Edge Delivery (A02)', got);
  got = await lead('1. Explain how a website enquiry would pass through Marketo Engage and Salesforce to the right sales team, including a failed transfer that leaves an enquiry unanswered.');
  ok(got !== 'MK07', '"a failed transfer" of an enquiry is not a migration: no email program migration there', got);
  // the services reach the holdout RFI's answers
  await h.file(path.join(__dirname, 'rfp_prototype', 'kb_method', 'chatgpt_round2', 'test_rfi.txt'));
  const V = await h.eval(() => Object.fromEntries(RFPBuilder.state.questions.filter(q => q.kind === 'adobe').map(q => { const d = RFPAnswers.compose(q), p = d && RFPAnswers.kbPlan(q, d); return [q.label, p ? (p.topic ? 'topic:' + p.topic.id : p.ids[0]) : null]; })));
  ok(V['A.1'] === 'SI10' && V['C.1'] === 'MK07', 'on Vennor Quay, the Drupal move (A.1) and the email migration (C.1) now get answers from the new services', JSON.stringify(V));
  if (h.errors.length) ok(false, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `❌ ${fails} of ${n} STEP 91 CHECKS FAILED` : `ALL STEP 91 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
