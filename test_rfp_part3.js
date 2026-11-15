// RFP Builder part three: the knowledge base. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_part3.js
// Drives the built prototype and checks that hosting, security, sign-in, uptime, privacy and licensing questions get sentences
// from sow/rfp_facts.json with numbered Adobe sources (Adam's yes to sow/mockups/part3_kb/answer_2_6.png): products from the
// question, or from the RFP's other answers when it names none; conflicts and gaps sent to Confirm with Adobe, never to the
// client; licensing terms kept in the partner's note; no lifecycle words; questions the knowledge base does not hold still get
// the capability box; and the numbers survive into the downloads.
const {tableIn, technicalBodies} = require('./rfp_prototype/chatgpt_round5/test_word_complete.js');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), FIX = __dirname + '/qa/rfp_fixtures';
const FACTS = JSON.parse(fs.readFileSync(__dirname + '/rfp_facts.json', 'utf8'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 500) + ']')); if (!c) fails++; };
const one = async (h, t) => (await h.text(t)).questions[0];
const prods = q => (q && q.draft ? q.draft.products.map(p => p.id) : []);
const items = q => (q && q.draft ? q.draft.sections.flatMap(s => s[1]) : []);
const SUPS = /[⁰¹²³⁴-⁹]/;
const supNums = t => [...t.matchAll(/[⁰¹²³⁴-⁹,]+(?=\s|$)/g)].flatMap(m => m[0].split(',').filter(Boolean).map(s => Number([...s].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).join(''))));
const LIFECYCLE = /\blegacy\b|maintenance mode|co-innovation|limited number of customers|\bbeta\b|limited availability|not currently (?:offered|available)|—/i;
(async () => {
  const h = await open();
  let r, q;
  // the facts file itself
  ok(FACTS.statements.every(s => s.own || s.src.length > 0), 'every sentence in rfp_facts.json but our own has at least one Adobe source');
  ok(FACTS.sources.every(s => /^https:\/\/(?:experienceleague|helpx|developer|www)\.adobe\.com\/|^https:\/\/www\.aem\.live\//.test(s.url) && s.title), 'every source is an Adobe page with a title');
  ok(FACTS.statements.filter(s => s.client !== false).every(s => !LIFECYCLE.test(s.text)), 'no client sentence carries a lifecycle word or an em dash');
  // 1. the approved picture: bank 2.6 in the workbook
  r = await h.file(FIX + '/bank_rfp.xlsx');
  q = r.questions.find(x => x.label === '2.6');
  ok(q.draft && q.draft.kb && q.draft.lines.length === 0, '2.6 is answered from the knowledge base, with no build plan');
  // step 61 (Nov 10 2026): 2.7's site forms are answered from AEM Forms + Marketo Engage, so AEM Forms is the ninth proposed product
  // step 67: the RFP names AEM Sites and never Edge Delivery, so 2.7's "new site" no longer brings Edge Delivery Services in
  ok(prods(q).join() === 'aemsites,cja,bv,bc,marketo,aemforms,rtcdp,target', '2.6 names no product, so it draws on the eight products the other answers propose, in the order they first appear', prods(q).join());
  ok(q.draft.sections.map(s => s[0]).join('|') === 'Where your data is hosted|Security certifications and encryption', 'the response has the picture\'s two sections', q.draft.sections.map(s => s[0]).join('|'));
  const all = items(q).join('\n'), nums = supNums(all);
  ok(Math.max(...nums) === q.draft.sources.length && new Set(nums).size === q.draft.sources.length, 'every numbered source is cited and every citation has its source (' + q.draft.sources.length + ')', JSON.stringify([Math.max(...nums), q.draft.sources.length]));
  ok(items(q).filter(t => /^(?:AEM Sites|Customer Journey Analytics|Brand Visibility|Marketo Engage|Edge Delivery Services|Target|Brand Concierge|Real-Time CDP)[^:]*: /.test(t)).every(t => SUPS.test(t)), 'every product line carries its source number');
  ok(/AEM Sites: you choose the primary region/.test(all) && /cannot be changed afterwards/.test(all) && /Marketo Engage: stored on AWS in a single region/.test(all) && /Target: runs on central clusters in Oregon, Dublin and Singapore/.test(all), 'the hosting lines say what Adobe\'s pages say (AEM region chosen once, Marketo on AWS in one region, Target clusters)');
  ok(!/Brand Concierge: [^\n]*(?:region|US-East|stays local|hosted)/i.test(all) && q.draft.confirm.some(c => /^Brand Concierge region: /.test(c) && /US-East/.test(c)), 'Brand Concierge\'s hosting stays out of the response and goes to Confirm with Adobe, since Adobe\'s FAQ and security overview disagree');
  ok(/Adobe's Trust Center lists SOC 2 Type 2, SOC 3, ISO 9001, ISO 27001, ISO 27017, ISO 27018, ISO 22301 and CSA STAR Level 2 for Adobe Experience Cloud, which includes these products\.[\u2070\u00b9\u00b2\u00b3\u2074-\u2079,]* The list also marks Adobe Experience Cloud GLBA ready/.test(all) && /^AEM Sites, Customer Journey Analytics, Marketo Engage, Real-Time CDP and Target: Adobe's Trust Center lists/m.test(all), 'the Trust Center\'s Experience Cloud certifications and GLBA ready, for the five proposed products it covers', all.split('\n').find(t => /Trust Center lists SOC/.test(t)));
  ok(!/IRAP|FedRAMP/.test(all) && q.draft.confirm.some(c => /^FedRAMP and IRAP on Adobe's Trust Center list cover named offerings only/.test(c)) && q.draft.sources.some(s => /compliance-list\.html/.test(s.url) && /updated May 21, 2026/.test(s.title)), 'FedRAMP and IRAP, which cover named offerings only, stay out of the response and go to the partner; the Trust Center page is cited with its date');
  ok(/^We will attach Adobe's current certification list/.test(q.draft.sections[1][1].slice(-1)[0]), 'our own Trust Center sentence closes the certifications section');
  ok(q.draft.confirm.some(c => /^Certifications for Brand Visibility, Brand Concierge and AEM Forms: not named on Adobe's Trust Center compliance list/.test(c)), 'the three proposed products the Trust Center list does not name are under Confirm with Adobe', JSON.stringify(q.draft.confirm));
  ok(q.draft.confirm.some(c => /^Where your data is hosted for AEM Forms: not on the Adobe pages this tool holds/.test(c)) && !/AEM Forms: /.test(all), 'AEM Forms has no knowledge-base facts yet, so its hosting goes to Confirm with Adobe and nothing is claimed for it in the response');
  ok(!LIFECYCLE.test(all) && !q.draft.confirm.some(c => /limited number of customers/.test(c)), 'AWS on Experience Platform reaches the client as an option, and no "limited number of customers" caution is left in the partner\'s note (Nov 12, no caveats)');
  ok(q.draft.asks.some(a => /region your client's data must stay in/.test(a)) && /\n\nWhat we would need from you\n- The region your data must stay in/.test(q.draft.plain), 'the region ask is in the note, ticked, and reaches the response as what we would need from you');
  await h.select(q.i);
  const panel = await h.panel();
  ok(/The products your other answers in this RFI propose\./.test(panel) && /Adobe's public pages, checked Nov 9, 2026/.test(panel), 'the panel says where the products came from and when the facts were checked');
  // step 67: the bank RFP asks for under 300 words an answer, so the panel shows the fitted answer and the sources it still cites
  ok(await h.eval(() => document.querySelectorAll('#rfp-answer ol.rfp-sources li').length) === await h.eval(() => { const x = RFPBuilder.state.questions.find(q => q.label === '2.6'); return RFPAnswers.written(x.draft, x).sources.length; }) && await h.eval(() => document.querySelectorAll('#rfp-answer li b').length) > 5, 'the sources are a numbered list and each product line leads with its name in bold');
  ok(!await h.eval(() => !!document.querySelector('#rfp-answer .rfp-cap')), 'no capability box on a question the knowledge base answers');
  // 2. taking a product out redrafts without it
  await h.eval(() => document.querySelector('#rfp-answer [data-rm="target"]').click()); await h.select(q.i);
  q = await h.eval(() => { const x = RFPBuilder.state.questions.find(q => q.label === '2.6'); return {p: x.draft.m.products, t: x.draft.sections.flatMap(s => s[1]).join('\n')}; });
  ok(!q.p.includes('target') && !/^Target: /m.test(q.t) && /AEM Sites: /.test(q.t), 'taking Target out of Drawn from redrafts the answer without Target', JSON.stringify(q.p));
  // 3. downloads keep the numbers with their sources
  await h.eval(() => { const x = RFPBuilder.state.questions.find(q => q.label === '2.6'); x.status = 'used'; });
  const doc=await h.word(),matrix=tableIn(doc,'Requirements matrix','Ref'),body=technicalBodies(doc,['2.6']).get('2.6');
  const listed=doc.sections.find(s=>s.title==='Adobe sources').blocks.map(b=>(/^(\d+)\s/.exec(b.text)||[])[1]).filter(Boolean);
  const xml=require('child_process').execFileSync('unzip',['-p',doc.filePath,'word/document.xml'],{encoding:'utf8'});
  const cited=await h.eval(xml=>{
    const d=new DOMParser().parseFromString(xml,'application/xml'),w='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    return [...d.getElementsByTagNameNS(w,'r')].filter(r=>r.getElementsByTagNameNS(w,'vertAlign')[0]?.getAttributeNS(w,'val')==='superscript')
      .flatMap(r=>r.textContent.trim().split(/,\s*/)).filter(n=>/^\d+$/.test(n));
  },xml);
  ok(body?.paragraphs.length&&matrix.find(r=>r.Ref==='2.6')?.['Answered in']==='Section '+body.section&&
    cited.length>5&&cited.every(n=>listed.includes(n)),'The Word answer contains numbered citations linked to the numbered Adobe source list');
  const workbook=await h.workbook('rfp-writeback'),row=workbook.sheets.Questions.find(r=>r[1]==='2.6');
  const src=workbook.sheets['Adobe sources'].filter(r=>r[0]==='2.6');
  ok(row&&SUPS.test(row[3])&&!/Adobe sources for the product facts above/.test(row[3])&&src.length>5&&
    src.every((r,i)=>Number(r[1])===i+1&&r[2]&&/^https:\/\//.test(r[3])),
    'The bank’s original response cell retains its numbers and the source sheet pairs them with titles and links',JSON.stringify(src.slice(0,2)));
  // 4. the plain bank RFP in text has five proposed products
  r = await h.file(FIX + '/bank_rfp.txt');
  q = r.questions.find(x => x.label === '2.6');
  ok(q.draft && q.draft.kb && prods(q).join() === 'aemsites,cja,bv,bc', 'in the text version of the bank RFP (no Marketo question), 2.6 draws on its four proposed products', prods(q).join());
  // 5. questions that name their products (the reviewers' 4.9 inputs among them)
  q = await one(h, 'Where is Brand Concierge data hosted, and is it encrypted at rest?');
  ok(q.draft && q.draft.kb && prods(q).join() === 'bc' && /TLS 1\.2 or greater/.test(items(q).join()) && /AES 256-bit/.test(items(q).join()) && !/US-East/.test(items(q).join()) && q.draft.confirm.some(c => /^Brand Concierge region/.test(c)), 'Brand Concierge hosting and encryption: encryption from Adobe\'s security overview, the region to confirm with Adobe', JSON.stringify(items(q)));
  ok(q.draft.sources.some(s => /brand-concierge-security-overview/.test(s.url)), 'the Brand Concierge encryption line cites Adobe\'s security overview');
  q = await one(h, 'Does Real-Time CDP support data residency in Australia?');
  ok(q.draft && q.draft.kb && /Australia/.test(items(q).join()) && q.draft.sources.some(s => /multi-cloud/.test(s.url)), 'Real-Time CDP residency in Australia: the hosting locations include Australia, from the multi-cloud page');
  q = await one(h, 'What is the uptime SLA for Adobe Commerce?');
  ok(q.draft && q.draft.kb && /99\.99% for infrastructure and 99\.9% for the application/.test(items(q).join()) && /status\.adobe\.com/.test(items(q).join()) && q.draft.asks.some(a => /uptime and recovery targets/.test(a)), 'Commerce uptime: both deployment models\' figures, the status page, and an ask for the client\'s targets');
  q = await one(h, 'Does AEM Sites support single sign-on with Okta?');
  ok(q.draft && q.draft.kb && /SAML 2\.0 identity provider, such as Okta/.test(items(q).join()) && /not your site's visitors/.test(items(q).join()) && q.draft.asks.some(a => /identity provider/.test(a)), 'AEM Sites single sign-on: SAML 2.0 with Okta, authors only, and an ask for the identity provider', JSON.stringify(items(q)));
  q = await one(h, 'Does Journey Optimizer honor opt-outs and GDPR deletion requests?');
  ok(q.draft && q.draft.kb && /Privacy Service/.test(items(q).join()) && /opt out/.test(items(q).join()), 'Journey Optimizer privacy: Privacy Service requests and opt-outs');
  q = await one(h, 'Is Edge Delivery Services HIPAA-ready?');
  ok(q.draft && q.draft.kb && /Extended Security for Healthcare/.test(items(q).join()), 'Edge Delivery HIPAA: ready with Extended Security for Healthcare');
  q = await one(h, 'Is an AEM Forms license needed for forms on Edge Delivery Services?');
  ok(q.draft && q.draft.kb && /AEM Forms license/.test(items(q).join()) && !/terabyte/.test(items(q).join()) && q.draft.sells.some(s => /terabyte/.test(s)), 'licensing: the needs-its-own-license sentence reaches the client, the licensing terms stay in the partner\'s note', JSON.stringify([items(q), q.draft.sells]));
  q = await one(h, 'Is Coworker hosted in the US?');
  ok(q.draft === null || !q.draft || q.draft.capability, 'a question about a product with no sourced hosting fact (Coworker) keeps the capability box', JSON.stringify(q.draft && [q.draft.kb, q.draft.capability]));
  q = await one(h, 'Is Marketo Engage SOC 2 certified?');
  ok(q.draft && q.draft.kb && /SOC 2 Type 2/.test(items(q).join()) && q.draft.sources.some(s => /compliance-list\.html/.test(s.url)), 'Marketo SOC 2: the Trust Center\'s Experience Cloud list, cited');
  q = await one(h, 'Is Adobe Commerce PCI DSS compliant?');
  ok(q.draft && q.draft.kb && /PCI DSS 4\.0 compliant service provider/.test(items(q).join()), 'Commerce PCI: the Trust Center\'s Commerce on cloud infrastructure line');
  q = await one(h, 'Is Customer Journey Analytics GDPR compliant?');
  ok(q.draft && q.draft.kb && /under Adobe-wide privacy/.test(items(q).join()) && /TrustArc GDPR privacy practices validation/.test(items(q).join()), 'CJA GDPR: Adobe-wide privacy and the TrustArc validation from the Trust Center');
  // 6. questions the knowledge base does not hold
  for (const t of ['What languages does Brand Concierge support?', 'Is AEM Sites WCAG 2.2 AA compliant?', 'How many concurrent authors can AEM Sites support?', 'Is Brand Concierge FedRAMP authorized?', "Can Brand Concierge answer questions about a member's own account balance after they log in?"]) {
    q = await one(h, t);
    ok(q.kind !== 'adobe' || !q.draft || (!q.draft.kb && q.draft.lines.length === 0), '"' + t.slice(0, 60) + '" is not answered from the knowledge base', JSON.stringify(q.draft && [q.draft.kb, q.draft.capability]));
  }
  ok(h.errors.length === 0, 'no script errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `${fails} PART 3 CHECK(S) FAILED` : 'ALL PART 3 CHECKS PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
