// Cluster c8_check (the skeptic): independent re-runs of every contested verdict (NOT_REPRODUCED or PARTLY).
// Run: node /home/user/warroom/sow/rfp_prototype/review_2026-11-09/verification/c8_check/contested.js
// Writes out_<id>.json beside this file. Everything runs through the shipped page via harness.js.
const fs = require('fs'), path = require('path');
const {open} = require('/home/user/warroom/sow/rfp_prototype/review_2026-11-09/harness.js');
const HERE = __dirname, FX = path.join(HERE, 'fixtures');
const save = (name, obj) => fs.writeFileSync(path.join(HERE, name), JSON.stringify(obj, null, 1));
const slim = q => ({label: q.label, text: q.text, kind: q.kind, products: q.draft ? q.draft.products.map(p => p.id) : null, conn: q.draft ? q.draft.conn : null,
  lines: q.draft ? q.draft.lines.map(l => l.id) : null, sections: q.draft ? q.draft.sections : null, sells: q.draft ? q.draft.sells : null, asks: q.draft ? q.draft.asks : null,
  plain300: q.draft ? q.draft.plain.slice(0, 300) : null});
const brief = r => ({status: r.status, count: r.count, questions: r.questions.map(slim)});

(async () => {
  const h = await open(); const page = h.page;
  const panelOf = async i => { await h.select(i); return page.evaluate(() => document.getElementById('rfp-answer').textContent); };

  // ================= C1.3 sub-questions
  {
    const out = {};
    const paste = '12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\na) Describe how you will configure sandboxes, roles, and sending subdomains.\nb) How will you execute the IP warmup plan?\nc) Explain how audiences and profile attributes flow into journeys.';
    out.exact = {paragraphs: await h.paragraphs(paste), find: await h.find(paste), result: brief(await h.text(paste))};
    out.exact.panel_a300 = (await panelOf(0)).slice(0, 300);
    out.exact.panel_b300 = (await panelOf(1)).slice(0, 300);
    out.detect = {};
    for (const s of ['Describe how you will configure sandboxes, roles, and sending subdomains.', 'How will you execute the IP warmup plan?', 'sandboxes', 'ip warmup', 'sending subdomains', 'We are implementing Adobe Journey Optimizer and Real-Time CDP.'])
      out.detect[s] = await h.detect(s);
    out.aliases = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; const m = /const ALIASES=\{([\s\S]*?)\};/.exec(src); const txt = m ? m[1] : ''; return {has_sandbox: /sandbox/i.test(txt), has_ip_warmup: /ip warmup/i.test(txt), has_subdomain: /subdomain/i.test(txt), rtcdp_line: (txt.match(/rtcdp:\[[^\]]*\]/) || [''])[0], ajo_line: (txt.match(/ajo:\[[^\]]*\]/) || [''])[0]}; });
    out.jo03 = await h.eval(() => { const p = RFP_CAT.products.find(x => x.id === 'ajo'); return {lines: p.lines, more: p.more, JO03: RFP_CAT.lines.JO03 ? {name: RFP_CAT.lines.JO03.name, scope: RFP_CAT.lines.JO03.scope} : null}; });
    out.b_with_parent = brief(await h.text('How will you execute the IP warmup plan for Adobe Journey Optimizer?'));
    out.b_with_parent_natural = brief(await h.text('12. We are implementing Adobe Journey Optimizer and Real-Time CDP. How will you execute the IP warmup plan?'));
    out.stem_with_colon = brief(await h.text('12. We are implementing Adobe Journey Optimizer and Real-Time CDP:\na) Describe how you will configure sandboxes, roles, and sending subdomains.\nb) How will you execute the IP warmup plan?'));
    out.stem_variants = {};
    for (const [k, t] of Object.entries({'a. b. c.': '12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\na. Describe how you will configure sandboxes, roles, and sending subdomains.\nb. How will you execute the IP warmup plan?',
      '(a) (b)': '12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\n(a) Describe how you will configure sandboxes, roles, and sending subdomains.\n(b) How will you execute the IP warmup plan?',
      '12.1 12.2': '12. We are implementing Adobe Journey Optimizer and Real-Time CDP.\n12.1 Describe how you will configure sandboxes, roles, and sending subdomains.\n12.2 How will you execute the IP warmup plan?',
      'stem as a question': '12. We are implementing Adobe Journey Optimizer and Real-Time CDP. Describe how you will:\na) configure sandboxes, roles, and sending subdomains;\nb) execute the IP warmup plan.'}))
      out.stem_variants[k] = {paragraphs: await h.paragraphs(t), result: brief(await h.text(t))};
    const inline = '4.1 Describe: a) data ingestion; b) identity resolution; c) activation.';
    out.inline = {paragraphs: await h.paragraphs(inline), result: brief(await h.text(inline))};
    const roman = '5. Describe how you would:\n(i) migrate content to AEM Sites\n(ii) connect AEM Sites to Target\n(iii) train our authors';
    out.roman_as_given = {paragraphs: await h.paragraphs(roman), find: await h.find(roman), result: brief(await h.text(roman))};
    const roman2 = '5. Describe how you would:\n(i) Describe how you would migrate content to AEM Sites.\n(ii) Explain how you would connect AEM Sites to Target.\n(iii) Describe how you would train our authors.';
    out.roman_with_verbs = {paragraphs: await h.paragraphs(roman2), result: brief(await h.text(roman2))};
    out.roman_question_marks = brief(await h.text('5. Describe how you would:\n(i) migrate content to AEM Sites?\n(ii) connect AEM Sites to Target?\n(iii) train our authors?'));
    out.label_strip_rule = await h.eval(() => { const src = document.getElementById('rfp-builder').textContent; return (src.match(/label=m\[0\][^;]*;/) || [''])[0]; });
    save('out_C1.3.json', out); console.log('C1.3 done');
  }

  // ================= C2.2 the REQ-04 row
  {
    const out = {};
    for (const f of ['c22_req04.xlsx', 'c22_trap.xlsx', 'c22_matrix.xlsx', 'c22_matrix_numeric.xlsx', 'c22_two_col.xlsx']) {
      const r = await h.file(path.join(FX, f));
      out[f] = brief(r);
    }
    // the raw reader text of the matrix, through the page's own readSheet (copied from the built page), to show the lines paragraphs() sees
    const html = fs.readFileSync('/home/user/warroom/sow/rfp_prototype/site/index.html', 'utf8');
    const block = html.slice(html.indexOf('async function readPdf(file){'), html.indexOf('const KIND={adobe:'));
    await page.evaluate(code => { window.__rd = new Function('LIB', code + '\nreturn {readPdf, readSheet, readDocx};')('lib/'); }, block);
    const raw = async (file, type) => page.evaluate(async ([b64, name, type]) => { const f = new File([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], name, {type}); const n = name.toLowerCase(); try { if (n.endsWith('.pdf')) return await window.__rd.readPdf(f); if (/\.(xlsx|csv)$/.test(n)) return await window.__rd.readSheet(f); return await f.text(); } catch (e) { return 'READER ERROR ' + e.message; } }, [fs.readFileSync(file).toString('base64'), path.basename(file), type]);
    out.raw = {};
    for (const f of ['c22_req04.xlsx', 'c22_matrix.xlsx']) { const t = await raw(path.join(FX, f), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); out.raw[f] = {text: t, paragraphs: await h.paragraphs(t)}; }
    out.numbering_rule = await h.eval(() => { const src = document.getElementById('rfp-builder').textContent; return (src.match(/if\(\/\^[^\n]*?cells\[i\]\.length<=8[^\n]*?\n/) || [''])[0].slice(0, 400); });
    out.rule_tests = await h.eval(() => { const re = /^\(?[A-Za-z]?\d{0,3}(\.\d+)*[.)]?$/; return Object.fromEntries(['REQ-04', 'REQ-05', '4.2', 'Q3', 'A.2', 'R-1', 'M', 'D', 'Y', 'Mandatory', '1'].map(s => [s, re.test(s) && s.length <= 8])); });
    save('out_C2.2.json', out); console.log('C2.2 done');
  }

  // ================= C2.4 quoted multiline CSV cell
  {
    const out = {};
    const raw = async (file, type) => page.evaluate(async ([b64, name, type]) => { const f = new File([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], name, {type}); try { return await window.__rd.readSheet(f); } catch (e) { return 'READER ERROR ' + e.message; } }, [fs.readFileSync(file).toString('base64'), path.basename(file), type]);
    for (const f of ['c24_multiline.csv', 'c24_two_sentences_numeric.csv', 'c24_two_sentences_coded.csv', 'c24_two_sentences.xlsx']) {
      const type = f.endsWith('.csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const t = await raw(path.join(FX, f), type);
      out[f] = {raw: t, paragraphs: await h.paragraphs(t), result: brief(await h.file(path.join(FX, f)))};
    }
    out.sheetjs_rows = await page.evaluate(async b64 => { const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0)); const wb = XLSX.read(bytes, {type: 'array'}); return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1, raw: false, defval: ''}); }, fs.readFileSync(path.join(FX, 'c24_multiline.csv')).toString('base64'));
    save('out_C2.4.json', out); console.log('C2.4 done');
  }

  // ================= C3.2 certified AEM project manager and references
  {
    const out = {};
    for (const t of ['The bidder shall provide a certified AEM project manager and three public-sector references.',
      'Provide a certified AEM project manager and three public-sector references.',
      'Will the bidder provide a certified AEM project manager and three public-sector references?',
      'The bidder shall provide a certified AEM project manager.',
      'Provide a certified AEM project manager.',
      'Describe the certified AEM project manager and architects you would assign to our project.',
      'How many Adobe-certified AEM developers will staff this engagement?']) {
      const r = await h.text(t);
      out[t] = {classify: await h.classify(t), find_count: (await h.find(t)).length, result: brief(r), regex: await h.eval(s => { const src = document.getElementById('rfp-builder').textContent; const get = n => new RegExp(src.match(new RegExp('const ' + n + '=/(.*)/i;'))[1], 'i'); const F = get('FIRM'), A = get('ADOBE'), W = get('WORK'); return {FIRM: (F.exec(s) || [null])[0], ADOBE: (A.exec(s) || [null])[0], WORK: (W.exec(s) || [null])[0]}; }, t)};
    }
    save('out_C3.2.json', out); console.log('C3.2 done');
  }

  // ================= C4.11 shorthand and over-eager aliases
  {
    const out = {detect: {}};
    for (const s of ['Describe your approach to implementing ABV for our brand.', 'How would you set up AEP sandboxes?', 'How would you configure Adobe Experience Platform sandboxes and roles?',
      'How would LLMO report our AI citations?', 'How would LLMO report on our AI citations?', 'Describe your LLMO reporting.', 'How does LLMO measure our visibility in AI answers?', 'What is your LLMO approach?', 'How would you use LLMO to improve our visibility in AI answers?', 'How would LLMO help us show up in AI answers?'])
      out.detect[s] = {detect: await h.detect(s), classify: await h.classify(s)};
    out.alias_keys = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; const m = /const ALIASES=\{([\s\S]*?)\};/.exec(src); return {has_abv: /'abv'/.test(m[1]), has_aep: /'aep'/.test(m[1]), has_experience_platform: /experience platform/.test(m[1]), has_llmo: /llmo/.test(m[1]), has_wordpress: /wordpress/.test(m[1]), has_rebuild: /'rebuild'/.test(m[1]), has_report: /'report'/.test(m[1]), has_report_on: /'report on'/.test(m[1])}; });
    const g = ['How will you migrate our existing WordPress CMS and legacy DAM into the new platform?', 'Do you support single sign-on (SSO) with Okta and SAML 2.0, and where is data hosted in the EU?', 'How will you track project issues, risks, and weekly status reports during the rebuild?'];
    out.gemini = [];
    for (const t of g) { const r = await h.text(t); out.gemini.push({text: t, classify: await h.classify(t), detect: await h.detect(t), result: brief(r), firm_hit: await h.eval(s => { const src = document.getElementById('rfp-builder').textContent; const F = new RegExp(src.match(/const FIRM=\/(.*)\/i;/)[1], 'i'); return (F.exec(s) || [null])[0]; }, t)}); }
    // Gemini 3 moved to the Adobe pile by the partner: what gets drafted
    out.gemini3_as_adobe = await h.eval(t => { const q = {text: t, kind: 'adobe'}; const d = RFPAnswers.compose(q); return d ? {products: d.m.products, conn: d.m.conn ? d.m.conn.a + '+' + d.m.conn.b : null, lines: d.m.lines, plain300: RFPAnswers.plain(d, q).slice(0, 300)} : null; }, g[2]);
    // Gemini 1: the scores of the migration lines the reviewer expected
    out.gemini1_scores = await h.eval(t => { const names = {}; for (const id of ['SI03', 'AS03', 'A02']) names[id] = RFP_CAT.lines[id] ? RFP_CAT.lines[id].name : null; return {names, detect_products: RFPAnswers.detect(t), cms_product: RFP_CAT.products.find(p => p.id === 'cms'), aemassets_lines: RFP_CAT.products.find(p => p.id === 'aemassets').lines, aemsites_lines: RFP_CAT.products.find(p => p.id === 'aemsites').lines}; }, g[0]);
    save('out_C4.11.json', out); console.log('C4.11 done');
  }

  // ================= C4.13 how many weeks
  {
    const out = {};
    for (const t of ['How many weeks to implement AEM Sites?', 'How long does an AEM Sites implementation take?', 'What is your proposed timeline for implementing AEM Sites, in weeks?']) {
      const r = await h.text(t); const q = r.questions[0];
      out[t] = {result: brief(r), duration_in_draft: q && q.draft ? (q.draft.plain.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve)[- ](week|day|month|hour)s?\b|\bweek (one|\d)\b|\bwithin \d+|\btimeline\b/gi) || []) : null};
    }
    // every string doLine can print (line scope, SOW template scope fallback, line name) and every connection how/gain, scanned for durations
    out.duration_scan = await h.eval(() => {
      const re = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve)[- ](week|day|month|hour|business day)s?\b|\bweek (one|\d)\b|\bwithin \d+/gi;
      const hits = [];
      const TPL = Object.fromEntries((typeof CATALOG !== 'undefined' ? CATALOG : []).map(t => [t.id, t]));
      for (const [id, L] of Object.entries(RFP_CAT.lines)) { const s = L.scope || (TPL[id] || {}).scope || L.name; const m = s.match(re); if (m) hits.push({kind: 'line', id, phrases: m, text: s}); }
      for (const c of RFP_CAT.connections) { for (const [k, v] of [['how', c.how || ''], ['gain', (c.gain || {}).text || '']]) { const m = v.match(re); if (m) hits.push({kind: 'conn.' + k, id: c.id, phrases: m, text: v}); } }
      return {lines: Object.keys(RFP_CAT.lines).length, hits};
    });
    save('out_C4.13.json', out); console.log('C4.13 done');
  }

  // ================= C5.2 partner cautions reaching the client
  {
    const CAUT = /confirm with Adobe|so confirm|prove it in a pilot|prove in a pilot|proven in a pilot|pilot item|validated in a pilot|Named by Adobe|documents no setup|Not a documented capability|not documented|confirm(?:s|ed)? (?:it|this|that)|if Adobe confirms|confirm for your client|before (?:committing|promising)|do not promise/gi;
    const out = {inputs: []};
    for (const t of ['How does Brand Concierge trigger follow-up journeys in Adobe Journey Optimizer?', 'How does Brand Concierge use AEM Sites for product cards in answers?', 'How does Brand Visibility enrich product detail pages in Adobe Commerce?']) {
      const r = await h.text(t); const q = r.questions[0]; const d = q.draft;
      const approach = d ? (d.sections.find(s => s[0] === 'Our approach') || [null, []])[1] : [];
      const all = d ? d.sections.map(s => s[1].join('\n')).join('\n') : '';
      out.inputs.push({text: t, conn: d && d.conn, lines: d && d.lines.map(l => l.id), approach, cautions_in_approach: approach.join('\n').match(CAUT) || [], cautions_in_all_sections: all.match(CAUT) || [], sells: d && d.sells, asks: d && d.asks,
        availability_field: await h.eval(c => { const x = RFP_CAT.connections.find(k => k.a + '+' + k.b === c); return x ? {availability: x.availability, sowAvailability: x.sowAvailability || null} : null; }, d && d.conn)});
    }
    out.named_by_adobe_in_catalog = await h.eval(() => JSON.stringify(RFP_CAT).includes('Named by Adobe'));
    out.named_by_adobe_in_page = await h.eval(() => document.documentElement.outerHTML.includes('Named by Adobe'));
    // sweep: for each connection, a question naming both products, through the page; cautions in Our approach only
    const conns = await h.eval(() => RFP_CAT.connections.map(c => ({id: c.id, a: c.a, b: c.b, an: RFP_CAT.products.find(p => p.id === c.a).name, bn: RFP_CAT.products.find(p => p.id === c.b).name})));
    out.sweep = []; out.sweep_missed = [];
    for (const c of conns) {
      const t = `How does ${c.an} work with ${c.bn}?`;
      const r = await h.text(t); const q = r.questions[0]; const d = q && q.draft;
      const got = d && d.conn;
      if (got !== c.a + '+' + c.b) { out.sweep_missed.push({id: c.id, asked: t, got}); continue; }
      const approach = (d.sections.find(s => s[0] === 'Our approach') || [null, []])[1].join('\n');
      const m = approach.match(CAUT);
      if (m) out.sweep.push({id: c.id, phrases: m, approach});
    }
    // the connections the probe question missed: compose() directly on the connection's own words
    out.sweep_missed_direct = [];
    for (const miss of out.sweep_missed) {
      const d = await h.eval(id => { const c = RFP_CAT.connections.find(k => k.id === id); return {how: c.how || '', gain: (c.gain || {}).text || ''}; }, miss.id);
      const m = (await h.voice(d.how + '\n' + d.gain)).match(CAUT);
      if (m) out.sweep_missed_direct.push({id: miss.id, phrases: m, how: d.how, gain: d.gain});
    }
    save('out_C5.2.json', out); console.log('C5.2 done', 'sweep hits', out.sweep.length, 'missed', out.sweep_missed.length);
  }

  // ================= C5.3 doLine grammar and leftover partner/Client words
  {
    const out = {};
    const all = await h.eval(() => Object.keys(RFP_CAT.lines).map(id => ({id, out: RFPAnswers.doLine(id)})));
    // the word after "We will " or ": we will " or "Each month we will "
    const VERBISH = /^(a|an|the|your|our|their|its|where|if|for|when|once|after|with|in|using|derived|query|on|at|by|from|to|of|as|per|via)$/i;
    const flagged = [];
    for (const l of all) {
      const m = /(?:^|: )(?:[Ww]e will|Each month we will) ([^\s,.;:()]+)/.exec(l.out);
      const w = m ? m[1] : null;
      if (!m || VERBISH.test(w)) flagged.push({id: l.id, firstWord: w, out: l.out.slice(0, 200)});
    }
    out.doLine = {total: all.length, flagged_count: flagged.length, flagged, first_words: Object.entries(all.reduce((acc, l) => { const m = /(?:^|: )(?:[Ww]e will|Each month we will) ([^\s,.;:()]+)/.exec(l.out); const w = m ? m[1].toLowerCase() : '(none)'; acc[w] = (acc[w] || 0) + 1; return acc; }, {})).sort((x, y) => y[1] - x[1])};
    // the verifier's 30 ids, checked one by one against my flags
    const theirs = ['TC03', 'AXA02', 'AXA03', 'AXA08', 'AXC01', 'AXD06', 'AXE01', 'AXE02', 'XC04', 'XC16', 'AD3', 'AXB03', 'AXC06', 'AXC08', 'AXD04', 'AXD07', 'XA15', 'XA18', 'XC12', 'XA09', 'XC10', 'OX1', 'XA08', 'XA10', 'AXE03', 'L03', 'BI2', 'AD2', 'BI1', 'AD1'];
    out.doLine.theirs_not_in_mine = theirs.filter(id => !flagged.some(f => f.id === id));
    out.doLine.mine_not_in_theirs = flagged.filter(f => !theirs.includes(f.id)).map(f => f.id);
    // third-person verbs after we/you after rfp(): "we does", "we authorizes", "you has"
    out.agreement = all.map(l => ({id: l.id, hits: l.out.match(/\b(?:[Ww]e|[Yy]ou) (does|has|is|was|authorizes|configures|confirms|[a-z]{3,}ses|[a-z]{3,}zes)\b/g) || []})).filter(x => x.hits.length);
    // partner / the Client / the customer left in text that reaches the client
    const RE = /\bpartner[a-z-]*|\b[Tt]he [Cc]lient\b|\bthe customer\b|\bClient\b/g;
    const scopes = all.map(l => ({kind: 'line.scope', id: l.id, text: l.out, hits: l.out.match(RE) || []})).filter(x => x.hits.length);
    const connText = await h.eval(() => RFP_CAT.connections.map(c => ({id: c.id, how: RFPAnswers.rfp(c.how || ''), gain: RFPAnswers.rfp((c.gain || {}).text || '')})));
    const conns = []; for (const c of connText) for (const k of ['how', 'gain']) { const m = c[k].match(RE); if (m) conns.push({kind: 'conn.' + k, id: c.id, text: c[k], hits: m}); }
    out.voice = {client_reaching_hits: [...scopes, ...conns]};
    // Gemini's three examples
    out.gemini_examples = {
      O04: all.find(l => l.id === 'O04').out,
      cw_cja_gain: connText.find(c => c.id === 'cw-cja').gain,
      marketo_ajo_prereqs: await h.eval(() => RFP_CAT.connections.find(c => c.id === 'marketo-ajo').prereqs),
    };
    out.rfp_rules_for_partner = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return (src.match(/\.replace\(\/\\bThe partner's[^\n]*/) || [''])[0].slice(0, 400); });
    save('out_C5.3.json', out); console.log('C5.3 done', 'flagged', flagged.length);
  }

  // ================= C5.6 you and you
  {
    const out = {};
    const t = 'How do we bring Snowflake data warehouse tables into Customer Journey Analytics?';
    const r = await h.text(t); const q = r.questions[0];
    const panel = await panelOf(0);
    const doc = await h.doc(), asks = await h.asks();
    out.exact = {conn: q.draft && q.draft.conn, lines: q.draft && q.draft.lines.map(l => l.id), asks: q.draft && q.draft.asks, sells: q.draft && q.draft.sells,
      you_and_you: {panel: panel.includes('you and you'), doc: doc.includes('you and you'), asksDoc: asks.includes('you and you'), sections: JSON.stringify(q.draft && q.draft.sections).includes('you and you')},
      you_and_your_client: {panel: panel.includes('you and your client'), asksDoc: asks.includes('you and your client')}};
    out.prereqs = await h.eval(() => { const c = RFP_CAT.connections.find(k => k.id === 'dwh-cja'); return {count: c.prereqs.length, index_of_you_and_your_client: c.prereqs.findIndex(p => p.includes('you and your client')), text: c.prereqs.find(p => p.includes('you and your client')), sowPrereq: (c.sowPrereqs || []).find(p => /Client and partner/.test(p)) || null}; });
    out.rfp_of_prereq = await h.voice(out.prereqs.text);
    out.cap_rule = await h.eval(() => { const src = document.getElementById('rfp-answers').textContent; return (src.match(/if\(m\.conn\)need=[^\n]*/) || [''])[0].slice(0, 200); });
    // every connection prereq that would read badly through rfp(), in case the cap or the voice path ever changes
    out.latent = await h.eval(() => { const bad = []; for (const c of RFP_CAT.connections) (c.prereqs || []).forEach((p, i) => { const v = RFPAnswers.rfp(p); if (/\byou and you\b|\byour you\b|\byou's\b/.test(v)) bad.push({id: c.id, i, shown: i < 6, out: v}); }); return bad; });
    save('out_C5.6.json', out); console.log('C5.6 done');
  }

  // ================= C6.3 the note's boxes
  {
    const out = {};
    for (const t of ['How would Brand Concierge answer our customers\' questions about accounts and rates?', 'How would Coworker give our leaders readouts on request?', 'How would Coworker work inside Workfront for our campaign managers?',
      'Describe how Brand Visibility shows where our brand appears in ChatGPT answers.', 'How does Adobe Commerce connect to AEM Sites?', 'Our product images live in AEM Assets. How do approved images reach Commerce product pages?']) {
      const r = await h.text(t); const q = r.questions[0]; const d = q.draft;
      out[t] = {conn: d && d.conn, products: d && d.products.map(p => p.id), lines: d && d.lines.map(l => l.id), sells: d && d.sells, asks: d && d.asks};
    }
    out.quotes = {
      coworker_configures: Object.entries(out).filter(([k, v]) => v && v.sells && v.sells.some(s => /configures Coworker/.test(s))).map(([k]) => k),
      cif_add_on_under_asks: Object.entries(out).filter(([k, v]) => v && v.asks && v.asks.some(s => /CIF add-on provisioned by Adobe/.test(s))).map(([k]) => k),
      shared_strategy_under_asks: Object.entries(out).filter(([k, v]) => v && v.asks && v.asks.some(s => /Shared strategy work is reused/.test(s))).map(([k]) => k),
      client_has_licensed_bc_under_sells: Object.entries(out).filter(([k, v]) => v && v.sells && v.sells.some(s => /The Client has licensed Brand Concierge/.test(s))).map(([k]) => k),
    };
    out.where_coworker_sentence_lives = await h.eval(() => RFP_CAT.connections.filter(c => (c.prereqs || []).some(p => /configures Coworker/.test(p))).map(c => c.id));
    save('out_C6.3.json', out); console.log('C6.3 done');
  }

  // ================= C7.6 the badge
  {
    const out = {};
    for (const w of [1500, 1024, 390, 320]) {
      await page.setViewportSize({width: w, height: 900}); await page.waitForTimeout(100);
      out['w' + w] = await page.evaluate(() => { const g = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), text: e.textContent.trim().slice(0, 60)}; };
        const n = document.querySelector('.proto-note'), cs = n ? getComputedStyle(n) : null; const h1 = document.getElementById('play-title');
        return {eyebrow: g('.topbar .eyebrow'), h1: g('#play-title'), note: g('.proto-note'), changePlay: g('.topbar button'), noteDisplay: cs && cs.display, noteMarginLeft: cs && cs.marginLeft, h1Display: getComputedStyle(h1).display, parentOfNote: n && n.parentElement.tagName + '.' + n.parentElement.className, prevSibling: n && n.previousElementSibling && n.previousElementSibling.tagName, docScrollWidth: document.documentElement.scrollWidth, viewport: innerWidth, overflowX: document.documentElement.scrollWidth > innerWidth}; });
      await page.screenshot({path: path.join(HERE, `shot_C7.6_${w}.png`), clip: {x: 0, y: 0, width: w, height: 300}});
    }
    await page.setViewportSize({width: 1500, height: 1100});
    out.css = await h.eval(() => { const src = document.documentElement.outerHTML; return (src.match(/\.proto-note\{[^}]*\}/) || [''])[0]; });
    out.html = await h.eval(() => { const n = document.querySelector('.proto-note'); return n.parentElement.outerHTML.slice(0, 400); });
    save('out_C7.6.json', out); console.log('C7.6 done');
  }

  if (h.errors.length) { console.log('PAGE ERRORS', h.errors); save('out_page_errors_contested.json', h.errors); }
  await h.close();
})().catch(e => { console.error(e); process.exit(1); });
