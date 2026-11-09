// Follow-up checks for cluster c1_finder: the panel text for a "No match" sub-question (C1.3 b), the full drafts behind
// C1.7 (does anything mention a timeline, staffing or experience), and the empty ongoing-services draft behind C1.4 2.2.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
(async () => {
  const h = await open(); const out = {};
  await h.text('12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\na) Describe how you will configure sandboxes, roles, and sending subdomains.\nb) How will you execute the IP warmup plan?\nc) Explain how audiences and profile attributes flow into journeys.');
  await h.select(0); out.panel_a = await h.panel();
  await h.select(1); out.panel_b = await h.panel();
  const r7 = {};
  for (const [k, t] of [['timeline_staffing', 'Describe your approach to implementing AEM Sites, including a timeline and staffing plan.'], ['experience_banks', 'Describe your experience implementing Adobe Experience Manager Sites for banks.']]) {
    const r = await h.text(t); const d = r.questions[0].draft;
    r7[k] = {text: t, kind: r.questions[0].kind, lines: d.lines, plain: d.plain, mentions: {timeline: /timeline/i.test(d.plain), staff: /staff/i.test(d.plain), experience_or_reference: /\b(experience|reference|client|bank)s?\b/i.test(d.plain.replace(/Experience (Manager|League|Platform|Cloud|Fragment)/g, ''))}};
  }
  out.C17 = r7;
  const r4 = await h.text('Lot 1: Adobe Experience Manager Sites\n1.1 Describe your implementation approach.\n1.2 Describe your approach to ongoing support.\nLot 2: Customer Journey Analytics\n2.1 Describe your implementation approach.\n2.2 Describe your approach to ongoing support.');
  out.C14_q22 = r4.questions[2]; await h.select(2); out.C14_q22_panel = await h.panel();
  await h.select(0); out.C14_q11_panel = await h.panel();
  fs.writeFileSync(path.join(__dirname, 'out_followup.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1)); console.log('page errors:', JSON.stringify(h.errors));
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
