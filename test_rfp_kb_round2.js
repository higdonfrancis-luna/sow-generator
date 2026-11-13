// The method knowledge base, round 2 (Nov 13 2026, Adam's key metric: how close answers written with no AI come to the AI's):
// 1. the knowledge base: every service carries the phrases an RFI uses for its work, and the topic playbook gives a sourced method
//    for five common asks the catalog has no service for;
// 2. the phrases pick the service a question asks for (the insurer RFP: the site build, the Compliance approval workflow, the
//    go-live plan), and a whole-site build question leads with the site build;
// 3. a topic answers accessibility, page speed, the client's own CDN, A/B testing without Adobe Target and consent, and never a
//    question it is not about (testing with Adobe Target or in an RFI that has it, campaign performance, a forms RFI's own
//    accessibility service, CDN logs for Brand Visibility, email tests in Journey Optimizer); where two match, the one asked about
//    wins; a topic's own hours are counted once (a month after launch); the consent topic names back the laws the question names;
// 4. hours: each answer's services are settled once, every service's hours are counted in one answer only, one whole workstream
//    per phase, and every "estimated in our answer to" points to an answer that counts that service; a connection's services ride
//    along only where the question names both its products; a product a service also needs, not chosen by the client, is named
//    with its license;
// 5. the answers keep the house rules (no dashes, no ask-Adobe wording, within the word limit), and Tallgrass's migration off its
//    own CMS still keeps today's answer.
// No AI is called. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_kb_round2.js
const fs = require('fs'), path = require('path');
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
let fails = 0, n = 0;
const ok = (c, m, d = '') => { n++; console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 700) + ']')); if (!c) fails++; };
const KB = JSON.parse(fs.readFileSync(path.join(__dirname, 'rfp_method.json'), 'utf8'));
const DEMO = path.join(__dirname, 'rfp_prototype/demo');
const TOPIC_IDS = ['accessibility', 'consent_privacy', 'own_cdn', 'page_performance', 'testing_without_target'];

// what the page's knowledge base does with every Adobe question of the loaded RFI
const survey = h => h.eval(() => {
  const qs = RFPBuilder.state.questions.filter(q => q.kind === 'adobe'), LN = RFP_CAT.lines;
  return qs.map(q => {
    const d = RFPAnswers.compose(q), plan = d ? RFPAnswers.kbPlan(q, d) : null, five = d ? RFPAnswers.method(q, d) : null;
    const w = five ? RFPAnswers.written(Object.assign({}, d, {ai: five}), q) : null, lim = RFPAnswers.limitOf(q);
    const text = w ? w.sections.map(([hd, it]) => hd + '\n' + it.join('\n')).join('\n') : '';
    const homes = plan ? Object.fromEntries(plan.ids.map(id => { const hq = RFPAnswers.homeOfLine(id); return [id, hq ? hq.label : null]; })) : {};
    const points = [...text.matchAll(/It (?:sits beside|is part of) our (.+?), estimated in our answer to ([A-Z]\.\d+)\./g)].map(m => ({name: m[1], ref: m[2], id: Object.keys(LN).find(k => LN[k].name === m[1]) || null}));
    return {ref: q.label, topic: plan && plan.topic ? plan.topic.id : null, ids: plan ? plan.ids : [], homes, text, points, words: text.split(/\s+/).filter(Boolean).length, limit: lim ? lim.max : null, method: !!five};
  });
});

(async () => {
  // 1. the knowledge base
  const S = KB.services, ids = Object.keys(S), cat = JSON.parse(fs.readFileSync(path.join(__dirname, 'canvas/catalog.json'), 'utf8'));
  const counts = ids.map(id => (S[id].phrases || []).length), total = counts.reduce((a, b) => a + b, 0);
  ok(ids.length === Object.keys(cat.lines).length && Math.min(...counts) >= 6 && total >= 4000, 'every one of the catalog\'s services carries at least six phrases an RFI uses for its work', ids.length + ' services, ' + total + ' phrases, fewest ' + Math.min(...counts));
  ok(ids.every(id => S[id].phrases.every(p => !/[—–]/.test(p) && p.split(/\s+/).length >= 2 && p.split(/\s+/).length <= 10)), 'every phrase is 2 to 10 words, with no dash');
  const T = KB.topics || [];
  ok(T.map(t => t.id).sort().join() === TOPIC_IDS.join(), 'the playbook holds the five topics: accessibility, consent and privacy, your own CDN, page speed, A/B testing without Adobe Target', T.map(t => t.id).join());
  ok(T.every(t => t.facts.length >= 2 && t.facts.every(f => f.quote && /^https:\/\/(?:experienceleague\.adobe\.com|www\.aem\.live|developer\.adobe\.com|helpx\.adobe\.com)\//.test(f.url) && f.for.length)), 'every topic fact carries its quote and an Adobe page (Experience League, aem.live, Adobe Developer or Adobe Help)');
  ok(T.every(t => Object.values(t.draws_on).flat().every(l => cat.lines[l])), 'every service a topic sits beside is in the catalog');
  const tt = T.find(t => t.id === 'testing_without_target');
  ok(tt && (tt.unless_products || []).includes('target'), 'the testing topic stands aside when the question is about Adobe Target');
  ok(T.every(t => [t.risk, t.outcome, ...t.steps, ...t.deliverables, ...t.asks, ...t.facts.map(f => f.text)].every(x => !/[—–]|\bbeta\b|early access|coming soon|confirm(?:ed)? with Adobe|not stated by Adobe/i.test(x))), 'no topic has a dash, a release label or ask-Adobe wording');

  // 2 to 5, on the insurer RFP (its own Excel response form)
  const h = await open();
  await h.file(path.join(DEMO, 'Cedar_Prairie_Mutual_Insurance_Company_Response_Form.xlsx'));
  const C = await survey(h), at = r => C.find(x => x.ref === r) || {ids: [], points: [], homes: {}};
  ok(at('B.1').ids[0] === 'A01' && !at('B.1').ids.includes('SI02'), 'B.1 ("build our new public website on AEM Sites with Edge Delivery Services") leads with the site build, and not a second whole build beside it', at('B.1').ids.join());
  ok(at('B.2').ids[0] === 'A02', 'B.2 (the Drupal migration) leads with the SEO-safe content migration', at('B.2').ids.join());
  ok(at('B.6').ids[0] === 'A05', 'B.6 (Compliance approves every page before it is published) leads with governance, roles and approvals, not the Universal Editor setup', at('B.6').ids.join());
  ok(at('B.8').ids[0] === 'SI04', 'B.8 (go-live, redirects and rollback) leads with the go-live checklist and cutover', at('B.8').ids.join());
  ok(at('D.2').ids[0] === 'OX3' && at('D.4').ids[0] === 'BI1' && at('F.1').ids[0] === 'SI05', 'D.2 Snowflake, D.4 Power BI and F.1 training keep their services');
  const topics = {'B.3': 'accessibility', 'B.4': 'page_performance', 'B.5': 'own_cdn', 'B.7': 'testing_without_target', 'D.6': 'consent_privacy'};
  for (const [r, t] of Object.entries(topics)) ok(at(r).topic === t, r + ' is answered from the ' + t.replace(/_/g, ' ') + ' topic', at(r).topic + ' ' + at(r).ids.join());
  ok(C.filter(x => x.topic).length === 5, 'no other insurer question is answered from a topic', C.filter(x => x.topic).map(x => x.ref + ':' + x.topic).join());
  ok(!['B.2', 'B.8'].some(r => at(r).ids.some(id => ['AXD01', 'AXD02'].includes(id))) && at('D.5').ids.includes('XB07'), 'a connection\'s services ride along only where the question names both its products: no Universal Editor setup in the migration (B.2) or go-live (B.8) answers, and Marketo + CJA reporting stays with "connect Marketo Engage ... to Customer Journey Analytics" (D.5)', ['B.2', 'B.8', 'D.5'].map(r => r + ':' + at(r).ids.join('+')).join(' '));
  ok(/WCAG/.test(at('B.3').text) && /Akamai/.test(at('B.5').text) && /Adobe Target|Target/.test(at('B.7').text), 'the topic answers speak to what was asked: WCAG, the client\'s Akamai, testing without Target', [at('B.3').text.slice(0, 200), at('B.5').text.slice(0, 200)].join(' | '));
  // hours once, and every pointer true
  const counted = {};
  for (const x of C) for (const id of x.ids) if (x.homes[id] === x.ref) (counted[id] = counted[id] || []).push(x.ref);
  const twice = Object.entries(counted).filter(([, refs]) => refs.length > 1);
  const used = [...new Set(C.flatMap(x => x.ids))], homeless = used.filter(id => !counted[id]);
  ok(!twice.length && !homeless.length, 'every service an answer uses has its hours counted in exactly one answer, its home', JSON.stringify({twice, homeless}));
  const bad = C.flatMap(x => x.points.filter(p => !p.id || !at(p.ref).ids.includes(p.id) || at(p.ref).homes[p.id] !== p.ref).map(p => x.ref + ' -> ' + p.ref + ' ' + p.name));
  ok(C.some(x => x.points.length) && !bad.length, 'every "estimated in our answer to" names an answer that counts that service', bad.join(' | '));
  ok(!C.some(x => x.topic && /Planning estimate: [\d,]+ hours/.test(x.text)), 'a topic answer counts none of the services it sits beside (its own hours are a range)');
  // the house rules
  const kb = C.filter(x => x.method);
  ok(kb.length >= 22, 'the knowledge base answers at least 22 of the insurer\'s Adobe questions', kb.length);
  ok(kb.every(x => !/[—–]|confirm(?:ed)? with Adobe|not stated by Adobe|\bthe Client\b|\byour client\b/i.test(x.text)), 'no answer has a dash, ask-Adobe wording or the wrong voice', kb.filter(x => /[—–]|confirm(?:ed)? with Adobe|not stated by Adobe|\bthe Client\b|\byour client\b/i.test(x.text)).map(x => x.ref).join());
  ok(kb.every(x => !x.limit || x.words <= x.limit), 'every answer is within its section\'s word limit', kb.filter(x => x.limit && x.words > x.limit).map(x => x.ref + ' ' + x.words + '/' + x.limit).join());

  // Tallgrass: the same services as round 1, no topic, and the migration off its own CMS keeps today's answer
  await h.file(path.join(DEMO, 'Tallgrass_Home_and_Garden_Inc_RFP.pdf'));
  const G = await survey(h), g = r => G.find(x => x.ref === r) || {ids: []};
  const want = {'A.1': 'SI01', 'A.2': 'SI02', 'A.4': 'SI04', 'A.5': 'SI05', 'B.1': 'CJ01', 'B.2': 'CJ02', 'B.3': 'OX3', 'B.4': 'CJ04', 'B.5': 'BI1', 'B.6': 'CJ05', 'C.2': 'SI06', 'C.3': 'CJ06'};
  const off = Object.entries(want).filter(([r, id]) => g(r).ids[0] !== id).map(([r, id]) => r + ' ' + g(r).ids[0] + ' (want ' + id + ')');
  ok(!off.length && ['AXA04', 'AXA05'].includes(g('C.1').ids[0]), 'Tallgrass: every requirement keeps its service', off.join(', ') + ' C.1 ' + g('C.1').ids[0]);
  ok(!g('A.3').method, 'Tallgrass A.3 (moving 1,200 pages off its own CMS) keeps today\'s answer: the catalog has no service for that move');
  ok(g('C.1').ids.includes('AXA04'), 'Tallgrass C.1 (page views and clicks on the AEM Sites website for CJA) keeps the page data collection service', g('C.1').ids.join());
  ok(!G.some(x => x.topic), 'no Tallgrass question is answered from a topic', G.filter(x => x.topic).map(x => x.ref + ':' + x.topic).join());

  // 3. a topic never takes a question it is not about
  const one = async (text, name) => { await h.text(text); return (await survey(h))[0] || {}; };
  let r = await one('1. Describe how you would set up Adobe Target A/B tests on the new AEM Sites pages built on Edge Delivery Services.');
  ok(r.topic !== 'testing_without_target', 'testing with Adobe Target is not the without-Target topic', r.topic);
  r = await one('1. Describe how you would report campaign performance by channel in Customer Journey Analytics.');
  ok(!r.topic, 'campaign performance reporting is not the page speed topic', r.topic);
  r = await one('1. Describe how you would make our AEM Forms adaptive forms accessible to screen reader users and conform to WCAG 2.2 Level AA.');
  ok(!r.topic, 'a forms RFI\'s accessibility question keeps the forms accessibility service', r.topic + ' ' + (r.ids || []).join());
  r = await one('1. Describe how you would write alt text and meta descriptions for search engines on our new AEM Sites pages built on Edge Delivery Services.');
  ok(r.topic !== 'accessibility', 'an SEO question that says "alt text" is not the accessibility topic', r.topic);
  r = await one('1. Our new site runs on AEM Sites with Edge Delivery Services. Describe how Core Web Vitals will be met when the site is served through our current CDN.');
  ok(r.topic === 'page_performance', 'where two topics match, the one the question asks about wins (Core Web Vitals, served through our CDN)', r.topic);
  r = await one('1. Describe how you would forward our Akamai CDN logs to Brand Visibility for our AEM Sites website.');
  ok(r.topic !== 'own_cdn', 'CDN logs for Brand Visibility keep their own service, not the CDN topic', r.topic + ' ' + (r.ids || []).join());
  r = await one('1. Our new AEM Sites website on Edge Delivery Services must be WCAG-compliant. Describe how you would test it.');
  ok(r.topic === 'accessibility', '"WCAG-compliant", with its hyphen, is the accessibility topic', r.topic);
  r = await one('1. We do not use Adobe Target. Describe how you would run split tests on our Journey Optimizer emails and report them in Customer Journey Analytics.');
  ok(r.topic !== 'testing_without_target', 'split tests on Journey Optimizer emails are not the page testing topic', r.topic);
  await h.text('1. Our AEM Sites website runs on Edge Delivery Services, and we use Adobe Target for personalization.\n2. Describe how you would run A/B tests on the new AEM Sites home page.');
  let all = await survey(h);
  ok(all.every(x => x.topic !== 'testing_without_target'), 'in an RFI that has chosen Adobe Target, an A/B testing question is not the without-Target topic', all.map(x => x.ref + ':' + x.topic).join());
  await h.text('A.1 Describe how you would make our new AEM Sites website on Edge Delivery Services conform to WCAG 2.2 Level AA.\nA.2 Describe how accessibility would be checked on our AEM Sites website before each release.');
  all = await survey(h);
  const [a1, a2] = all;
  ok(a1 && a2 && a1.topic === 'accessibility' && a2.topic === 'accessibility' && /Planning estimate: about [\d,]+ to [\d,]+ hours/.test(a1.text) && /Its hours are counted in our answer to A\.1\./.test(a2.text) && !/Planning estimate/.test(a2.text), 'a topic\'s own hours are counted once, in the first answer it gives; the next answer points there', a2 && a2.text.slice(-400));
  ok(/You named the Gramm-Leach-Bliley Act: we map what it requires of your data with your privacy and legal team/.test(at('D.6').text), 'D.6 names back the law the insurer named (the Gramm-Leach-Bliley Act)', at('D.6').text.slice(0, 400));
  ok(/This runs every month from the month after launch\./.test(at('B.7').text) && /Planning estimate: about [\d,]+ to [\d,]+ hours a month\./.test(at('B.7').text), 'an after-launch topic (A/B testing) gives its hours a month', at('B.7').text.slice(-500));
  r = await one('1. We will use Customer Journey Analytics. Describe how you would build audiences in Customer Journey Analytics that our marketing team can act on.');
  ok(/This also needs Real-Time CDP or Journey Optimizer, licensed separately\./.test(r.text), 'CJA audiences name the product they publish into when the RFI has not chosen it, as the AI writer does since step 90', r.ids.join() + ' ' + r.text.slice(-300));
  r = await one('1. We use Customer Journey Analytics and Real-Time CDP. Describe how you would build audiences in Customer Journey Analytics that our marketing team can act on.');
  ok(r.ids.includes('C06') && !/This also needs Real-Time CDP/.test(r.text), 'no such line when the RFI has chosen Real-Time CDP', r.ids.join() + ' ' + r.text.slice(-300));
  if (h.errors.length) ok(false, 'no page errors', h.errors.join(' | '));
  await h.close();
  console.log(fails ? `❌ ${fails} of ${n} KB ROUND 2 CHECKS FAILED` : `ALL KB ROUND 2 CHECKS PASSED (${n})`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
