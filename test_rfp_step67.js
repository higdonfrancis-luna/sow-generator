// RFI Builder step 67 (Nov 10 2026): the writer. Run from the repo root after python3 sow/build_site.py:
//   node sow/test_rfp_step67.js
// Adam read this tool's response to the bank RFP beside one from Adobe's own tool and asked for ours to be the better one.
// These checks drive the built page and hold what was built for that: an answer opens with sentences backed by quotes from
// Adobe's pages (rfp_facts.json "explain"); services come in delivery order and are said in full once across the response;
// a licensing question gets a Licensing section; an after-launch answer names the product behind each service; where the
// RFP states a word limit every answer is fitted under it and the partner is told what was left out; and the client's own
// workbook comes back with its formatting kept and the Adobe sources on a sheet of their own.
// Step 93 removed the AI path; no check here used it, so none went: the catalog writer's own checks read it through C and catalogOnScreen, the rest read the knowledge-base answer on screen.
const {open} = require(__dirname + '/rfp_prototype/review_2026-11-09/harness.js');
const fs = require('fs'), FIX = __dirname + '/qa/rfp_fixtures';
const FACTS = JSON.parse(fs.readFileSync(__dirname + '/rfp_facts.json', 'utf8'));
let fails = 0;
const ok = (c, m, d = '') => { console.log((c ? '✅ ' : '❌ ') + m + (c || !d ? '' : '  [' + String(d).slice(0, 600) + ']')); if (!c) fails++; };
const naive = t => String(t).split(/\s+/).filter(Boolean).length;
(async () => {
  const h = await open();
  // what the client reads for a question: the sections, the plain text without its sources, the fit and the partner's confirm list
  // step 93: W reads the answer on screen (the method knowledge base's five parts where it has one); C reads the catalog writer's
  // own answer, the fallback where the knowledge base has none, for the checks that hold that writer's behaviour
  const W = (label, cat) => h.eval(([l, cat]) => { const q = RFPBuilder.state.questions.find(x => x.label === l); let d = q.draft || (q.draft = RFPAnswers.compose(q)); if (cat) { d = Object.assign({}, RFPAnswers.compose(q)); delete d.ai; } const w = RFPAnswers.written(d, q);
    return {sections: w.sections, heads: w.sections.map(s => s[0]), body: RFPAnswers.plain(d, q).split('\n\nAdobe sources for the product facts above')[0], sources: w.sources, confirm: d.confirm || [], lines: d.m.lines, products: d.m.products, brief: {lines: w.brief.lines, asks: [...w.brief.asks]}, inLic: [...w.inLic],
      fit: w.fit && {limit: w.fit.limit, max: w.fit.max, words: w.fit.words, tight: w.fit.tight, cutLines: w.fit.cutLines, cutAsk: [...w.fit.cutAsk], cutPoints: w.fit.cutPoints, cutFacts: w.fit.cutFacts}}; }, [label, !!cat]);
  const C = label => W(label, true);
  // step 93: the panel and badges on screen show the catalog writer's fit only where no knowledge-base answer stands, so the
  // checks on that fit take the knowledge-base answer off every Adobe question first, as if the knowledge base held none
  const catalogOnScreen = () => h.eval(() => { for (const q of RFPBuilder.state.questions) if (q.kind === 'adobe') { RFPAnswers.hasAnswer(q); if (q.draft) delete q.draft.ai; } });
  const sec = (w, head) => (w.sections.find(s => s[0] === head) || [null, []])[1];

  // ---- the sentences themselves
  const E = FACTS.explain || [];
  ok(E.length >= 30 && E.filter(x => x.kind !== 'note').every(x => x.text && x.src.length > 0), 'every explain sentence the client can read has at least one Adobe source (' + E.length + ' entries)');
  ok(E.every(x => x.src.every(i => /^https:\/\/(?:experienceleague|developer|helpx)\.adobe\.com\/|^https:\/\/www\.aem\.live\//.test(FACTS.sources[i].url) && FACTS.sources[i].title)), 'every one of those sources is an Adobe page with a title');
  ok(E.every(x => !/—|–/.test((x.text || '') + (x.confirm || '') + (x.licensing || []).join(' '))) && E.filter(x => x.kind === 'note').every(x => !x.text && x.confirm), 'no dash in any of them, and a note carries only its caution for the partner');
  ok(FACTS.statements.some(s => s.short === '') && FACTS.statements.filter(s => s.short).every(s => naive(s.short) < naive(s.text) + 1), 'the knowledge base carries a shorter wording of its longer sentences, and leaves a few out of the shorter answer');

  // ---- the bank RFP: "Keep each answer under 300 words"
  let r = await h.file(FIX + '/bank_rfp.xlsx');
  const lim = await h.eval(() => RFPAnswers.limitOf(RFPBuilder.state.questions.find(q => q.label === '2.1')));
  ok(lim && lim.n === 300 && lim.max === 299, 'the RFP\'s own instruction is read as the word limit: under 300, so 299 at most', JSON.stringify(lim));
  const A = {}, K = {}; for (const l of ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']) { A[l] = await W(l); K[l] = await C(l); }
  ok(Object.values(A).every(w => naive(w.body) <= 294 && w.fit && w.fit.words <= 294 && w.fit.limit === 300), 'every drafted answer is under the limit with a few words to spare, counting every token, bullets included', JSON.stringify(Object.entries(A).map(([l, w]) => [l, naive(w.body)])));
  ok(Object.values(A).every(w => !/We would deliver this with/.test(w.body)), 'no answer opens with "We would deliver this with": each opens with the answer');

  // 2.1 approach and migration
  let w = A['2.1'], ap = sec(w, 'Our approach').join(' ');
  // step 69: the answer names the client once, in its first sentence that opens "We would" or "We will"
  ok(/^For Northbridge Mutual Bank, we would implement AEM Sites as a Cloud Service/.test(sec(w, 'Our approach')[0]) && /From an existing AEM instance, Adobe's Content Transfer Tool moves it across\. From another CMS, we would export the content/.test(ap) && /content freeze for the final content top-up/.test(ap) && /rollback criteria/.test(ap), '2.1 opens with the approach, says how content moves from AEM and from another CMS, and covers the freeze, testing, cutover and rollback', ap.slice(0, 300));
  const work21 = sec(K['2.1'], 'What we would do'), at = re => work21.findIndex(t => re.test(t));
  ok(at(/Cloud Manager/) < at(/Core Components/) && at(/Core Components/) < at(/Content Transfer Tool/) && at(/Content Transfer Tool/) < at(/train authors/), '2.1 lists its services in delivery order: environments, build, migration, training', work21.map(t => t.slice(0, 40)).join(' | '));
  ok(w.confirm.some(c => /^AEM Sites migration from another CMS: /.test(c)), '2.1 tells the partner, not the client, that Adobe\'s tools cover AEM sources and Edge Delivery targets only');

  // 2.2 asks for what we need
  w = K['2.2'];
  ok(sec(w, 'What we would do').length === 1 && sec(w, 'What we would need from you').length >= 5 && sec(w, 'What we would need from you').length === 9 - w.fit.cutAsk.length && w.fit.cutAsk.length > 0 && sec(w, 'What we would need from you').some(t => /^Your Customer Journey Analytics package/.test(t)) && !/further items?|Plus \d+ more/.test(w.body), '2.2 keeps its service and the asks that fit, the license ask among them, with no filler line for the rest', JSON.stringify(sec(w, 'What we would need from you').map(t => t.slice(0, 30))));
  ok(!/\bABV\b/.test(Object.values(A).map(x => x.body).join(' ')), 'the client reads "Brand Visibility", never our shorthand for it');

  // 2.3 Brand Concierge
  w = A['2.3']; ap = sec(w, 'Our approach').join(' ');
  ok(/^Brand Concierge answers only from the knowledge sources you configure/.test(sec(w, 'Our approach')[0]) && /say it does not have the information/.test(ap) && /anonymous visitors/.test(ap) && /Questions about a customer's own account would go to your secure channels/.test(ap) && /golden set/.test(ap), '2.3 says what it answers from, what it does outside them, that it serves anonymous visitors, and how it is tested');
  ok(/for the agreed banking products:\n  - connect and curate/.test(w.body) && !/banking or insurance/.test(w.body) && (w.body.match(/\n  - /g) || []).length === 7, '2.3 names the bank\'s own industry and sets the long setup sentence out as seven steps');
  ok(!w.confirm.some(c => /customer's own account|Brand Concierge handoff|Confirm with Adobe|until Adobe confirms/i.test(c)), '2.3 (Nov 12, no caveats): no caution about account questions or the handoff is left for the partner', JSON.stringify(w.confirm));

  // 2.4 how Brand Visibility shows it
  w = A['2.4']; ap = sec(w, 'Our approach').join(' ');
  ok(/^Brand Visibility runs the prompts you choose/.test(sec(w, 'Our approach')[0]) && /ChatGPT, Google AI Overviews, Google AI Mode, Microsoft Copilot, Google Gemini and Perplexity/.test(ap) && /opens the full AI answer behind a prompt/.test(ap) && /percentage of prompts where your brand is mentioned/.test(ap), '2.4 answers the question: how prompts are run, the platforms Adobe lists, what each answer shows and what the dashboards report');
  ok(sec(w, 'What we would do').length === 1 && w.brief.lines.length === 1 && w.fit.cutLines.length === 0 && !w.confirm.some(c => /^Brand Visibility platforms: /.test(c)), '2.4 keeps one setup service for a how-does-it-work question, with no note to confirm the platforms by edition (Nov 12, no caveats)', JSON.stringify([sec(w, 'What we would do').length, w.brief.lines]));
  ok(sec(w, 'After launch').length === 0 && !/prompt portfolio|refresh four existing pages|our answer to/.test(w.body) && sec(w, 'What we would need from you').length === 1 && /named reviewers/.test(sec(w, 'What we would need from you')[0]), '2.4 does not repeat the monthly work that 2.5 says in full, and asks only for what its one service needs', JSON.stringify([sec(w, 'After launch'), sec(w, 'What we would need from you')]));

  // 2.5 after launch
  w = A['2.5']; const after = sec(w, 'After launch');
  ok(after.length >= 5 && after.every(t => /^(?:AEM Sites|Customer Journey Analytics|Brand Concierge|Brand Visibility|Target|Real-Time CDP|AEM Forms|Marketo Engage): /.test(t)) && after.every(t => /each month|monthly/i.test(t)), '2.5 says which product each monthly service is for, and that it is monthly', after.map(t => t.slice(0, 45)).join(' | '));
  ok(sec(w, 'Our approach').join('|') === 'After launch we provide these services each month, product by product.' && ['Target: ', 'Customer Journey Analytics: ', 'Brand Concierge: '].every(p => after.some(t => t.startsWith(p))) && !w.products.includes('eds'), '2.5 draws on the products the other answers propose (Edge Delivery is not one: the RFP names AEM Sites), under one short opening line', sec(w, 'Our approach').join('|'));
  ok(after.some(t => /maintain the prompt portfolio/.test(t)) && after.some(t => /refresh four existing pages/.test(t)), '2.5 is where the Brand Visibility monthly work is said in full');

  // 2.6 hosting and security, in the shorter wording
  w = A['2.6'];
  const all26 = w.sections.flatMap(s => s[1]).join('\n'), nums = [...all26.matchAll(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g)].map(m => Number([...m[0]].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).join('')));
  ok(w.fit.tight && w.fit.cutFacts === 0 && ['AEM Sites: ', 'Customer Journey Analytics and Real-Time CDP: ', 'Brand Visibility: ', 'Marketo Engage: ', 'Target: '].every(p => sec(w, 'Where your data is hosted').some(t => t.startsWith(p))), '2.6 fits by using the shorter wording, with every product\'s hosting still in it and no sentence dropped', JSON.stringify(w.fit));
  ok(/SOC 2 Type 2, SOC 3, ISO 27001/.test(all26) && /GLBA ready/.test(all26) && /For Brand Visibility, Brand Concierge and AEM Forms, we will get the hosting region and certifications from Adobe in writing before you sign\./.test(all26) && !/Edge Delivery/.test(all26), '2.6 keeps the certifications and the GLBA line, names the products Adobe\'s list does not cover and says how they will be, and has no product the response does not propose');
  ok(Math.max(...nums) === w.sources.length && new Set(nums).size === w.sources.length && nums[0] === 1, '2.6\'s source numbers run from 1 with no gap and match the sources it still cites (' + w.sources.length + ')', JSON.stringify([Math.max(...nums), w.sources.length]));

  // 2.7 forms into Marketo, and licensing
  w = A['2.7']; ap = sec(w, 'Our approach').join(' ');
  // Round 5: verify the consent check without guaranteeing a compliance outcome.
  ok(/^There are two documented routes\. The simpler one: forms built in Marketo Engage are embedded/.test(sec(w, 'Our approach')[0]) && /^The fuller one: AEM Forms adaptive forms/.test(sec(w, 'Our approach')[1]) && /prefill does not work with the embed code/.test(ap) && /consent wording/.test(ap) && sec(w, 'Our approach').length === 3 && sec(w, 'Our approach')[2] === 'Test cases will verify proposed data uses against the consent rules your team approves.',   // step 69: a bank's RFP gets one line on how customer data is used, in the answer with the most room
    '2.7 opens with the two routes, the simpler one first, with its limit and the consent wording, and nothing else in the approach but the line on customer data');
  const lic = sec(w, 'Licensing this needs');
  ok(w.heads.indexOf('Licensing this needs') === 1 && lic.length === 2 && /^Embedded Marketo forms: your Marketo Engage subscription, with no AEM Forms license\.$/.test(lic[0]) && /^Adaptive forms with the Submit to Marketo Engage action: a Marketo Engage license and an AEM Forms license/.test(lic[1]) && !/may only author forms in a spreadsheet/.test(w.body), '2.7 answers "what licensing does that need" in a Licensing section, route by route, without the plain license list repeating it', JSON.stringify(lic));
  w = K['2.7'];
  ok(sec(w, 'What we would do').length === 1 && /Marketo Engage data model/.test(sec(w, 'What we would do')[0]) && !/Edge Delivery|The proposal also uses the documented connection/.test(w.body) && sec(w, 'What we would need from you').length === 0, '2.7 keeps the one service that sets the adaptive forms route up, with no Edge Delivery work and no connection prerequisites listed as client needs');

  w = A['2.7'];
  await catalogOnScreen(); await h.select(r.questions.findIndex(q => q.label === '2.7')); const p27 = await h.panel(), b27 = await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-asks .rfp-badge')].map(b => b.textContent));
  ok(/The question asks how it works, so under the limit the answer keeps to that and one service\. Not in it: \d services? \(/.test(p27) && b27.includes('In the response, under Licensing') && b27.includes('Not in the response: the answer keeps to how it works') && !b27.includes('Left out to fit the word limit'), '2.7\'s panel says why services and asks are not in the answer (the question asks how it works, not room), and badges the license ask as answered under Licensing', JSON.stringify(b27));
  ok(w.sources.every(x => !/Onboard to AEM Forms|Adaptive Form template/.test(x.title)) && w.sources.some(x => /Embed a Form on Your Website/.test(x.title)), '2.7 lists the sources of what is in the answer, not of the services left out', w.sources.map(x => x.title).join(' | '));
  // 2.8 which products, and how results are measured
  w = A['2.8']; ap = sec(w, 'Our approach').join(' ');
  ok(/^For Northbridge Mutual Bank, we would use Real-Time CDP, Target and Customer Journey Analytics\. Real-Time CDP brings known and anonymous customer data together/.test(sec(w, 'Our approach')[0]) && /Target delivers the personalized experiences on the site and tests them\./.test(sec(w, 'Our approach')[0]), '2.8 opens with the three products and what each is for');
  ok(/A customer becomes known when they sign in/.test(ap) && /hashed email/.test(ap) && sec(w, 'Our approach').length === 5 && /same-page and next-page personalization/.test(ap) && /lift over the baseline, and the confidence in it/.test(ap) && /never use personalization to decide eligibility or pricing/.test(ap), '2.8 says how a customer is known, how audiences reach Target, how results are measured and what stays out of personalization');
  ok(sec(w, 'What we would do')[0] && /Adobe Target destination/.test(sec(w, 'What we would do')[0]) && w.confirm.some(c => /^Target reporting in Customer Journey Analytics: /.test(c)), '2.8 puts the personalization connection\'s service first and tells the partner which activity types the reporting covers');

  // ---- the panel says what the limit did
  const i22 = r.questions.findIndex(q => q.label === '2.2'); await h.select(i22);
  let panel = await h.panel();
  ok(/This RFI asks for under 300 words an answer\. This answer is \d+\./.test(panel) && /Left out to fit: \d asks?/.test(panel) && /The services stay in your statement of work list and the asks in your checklist\./.test(panel) && !/Not repeated here/.test(panel), 'the panel says the RFI\'s limit, the answer\'s length and what was left out to fit', (panel.match(/This RFI asks[^]*?checklist\./) || [''])[0]);
  const badges = await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-asks .rfp-badge')].map(b => b.textContent));
  ok(badges.filter(b => b === 'Left out to fit the word limit').length === K['2.2'].fit.cutAsk.length && badges.filter(b => b === 'In the response').length === 9 - K['2.2'].fit.cutAsk.length, 'an ask the limit left out is badged "Left out to fit the word limit"', JSON.stringify(badges));
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(1) .rfp-tick'); await h.page.waitForTimeout(120);
  const badges2 = await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-asks .rfp-badge')].map(b => b.textContent));
  // Planning hours also need space in the answer. The freed words can recover one of several omitted asks.
  const cutBefore = badges.map((b, i) => b === 'Left out to fit the word limit' ? i : -1).filter(i => i > 0);
  const cutAfter = badges2.filter(b => b === 'Left out to fit the word limit').length;
  ok(badges[0] === 'In the response' && badges2[0] === 'Not in the response' && badges2.length === badges.length &&
    cutBefore.some(i => badges2[i] === 'In the response') && cutAfter < cutBefore.length &&
    badges2.filter(b => b === 'In the response').length >= badges.filter(b => b === 'In the response').length,
    'unticking the original ask recovers a previously omitted ask and the response retains at least as many asks within its limit', JSON.stringify([badges, badges2]));
  await h.page.click('#rfp-answer .rfp-asks li:nth-child(1) .rfp-tick'); await h.page.waitForTimeout(80);
  await h.page.click('#rfp-edit-btn'); await h.page.fill('#rfp-edit', Array(320).fill('word').join(' ')); await h.page.click('#rfp-save-edit'); await h.page.waitForTimeout(120);
  panel = await h.panel();
  ok(/Your edited answer is 320 words\. This RFI asks for under 300, so shorten it with Edit\./.test(panel), 'an edited answer over the limit is counted and flagged, never cut for the partner');

  // ---- the client's workbook, as the client made it
  r = await h.file(FIX + '/bank_rfp.xlsx');
  await h.eval(() => { for (const q of RFPBuilder.state.questions) if (q.kind === 'adobe') { q.draft = q.draft || RFPAnswers.compose(q); q.status = 'used'; } });
  const shown21 = await h.eval(() => { const q = RFPBuilder.state.questions.find(x => x.label === '2.1'); return RFPAnswers.plain(q.draft, q).split('\n\nAdobe sources for the product facts above')[0]; });
  const [dl] = await Promise.all([h.page.waitForEvent('download'), h.eval(() => RFPAnswers.writeBack())]);
  const out = [...fs.readFileSync(await dl.path())], orig = [...fs.readFileSync(FIX + '/bank_rfp.xlsx')];
  const B = await h.eval(([o, n]) => { const X = window.XLSX, dec = new TextDecoder(), part = (bytes, p) => { const z = X.CFB.read(new Uint8Array(bytes), {type: 'array'}), f = X.CFB.find(z, p); return f ? dec.decode(new Uint8Array(f.content)) : ''; };
    const wb = X.read(new Uint8Array(n), {type: 'array'}), q = wb.Sheets.Questions, cells = xml => xml.match(/<c\b[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g) || [];
    const oSheet = part(o, '/xl/worksheets/sheet1.xml'), nSheet = part(n, '/xl/worksheets/sheet1.xml');
    return {d5o: (/<c\b[^>]*? r="D5"[^>]*>/.exec(oSheet) || [''])[0], names: wb.SheetNames, d9: q.D9 && q.D9.v, d14: q.D14 && q.D14.v, d6: q.D6 ? q.D6.v : '', src: X.utils.sheet_to_json(wb.Sheets['Adobe sources'], {header: 1}),
      keptCells: cells(oSheet).filter(c => !/ r="D(?:9|1[0-6])"/.test(c)).every(c => nSheet.includes(c)), nCells: cells(oSheet).length,
      d5: (/<c\b[^>]*? r="D5"[^>]*>/.exec(nSheet) || [''])[0], d9tag: (/<c\b[^>]*? r="D9"[^>]*>/.exec(nSheet) || [''])[0], col: (/<col\b[^>]*min="4"[^>]*\/>/.exec(nSheet) || [''])[0],
      xfs: [Number((/<cellXfs count="(\d+)"/.exec(part(o, '/xl/styles.xml')) || [])[1]), Number((/<cellXfs count="(\d+)"/.exec(part(n, '/xl/styles.xml')) || [])[1])], styles: part(n, '/xl/styles.xml'), other: part(o, '/xl/worksheets/sheet2.xml') === part(n, '/xl/worksheets/sheet2.xml')}; }, [orig, out]);
  const raw = Buffer.from(out).toString('latin1');
  ok(/-answered\.xlsx$/.test(dl.suggestedFilename()) && B.names.join(',') === 'Questions,Submission,Adobe sources,Review before sharing' && B.other, 'the bank\'s workbook comes back with its own sheets, the second untouched, and an Adobe sources sheet at the end', B.names.join(','));
  ok(B.keptCells && B.nCells > 40 && B.d5 === B.d5o && / s="\d+"/.test(B.d5), 'every cell the client wrote is in the file exactly as it was, header style included (' + B.nCells + ' cells)', B.d5);
  ok(B.xfs[1] > B.xfs[0] && new RegExp('<alignment[^>]*wrapText="1"[^>]*vertical="top"').test(B.styles) && / s="\d+"/.test(B.d9tag) && /width="110"/.test(B.col), 'each answer cell wraps and sits at the top of its row, through a style added to the workbook, and the answer column is wide enough to read', JSON.stringify([B.xfs, B.d9tag, B.col]));
  // step 93: 2.1's cell is the answer on screen, its sources left for the sheet (it no longer opens with the catalog's sentence)
  ok(/^Our approach\n- /.test(B.d9) && B.d9 === shown21 && !/Adobe sources for the product facts above/.test(B.d9 + B.d14) && /[¹²³]/.test(B.d14) && B.d6 === '' && naive(B.d14) <= 294, 'the cells hold the answers alone, 2.6 with its source numbers, and a firm question is left empty');
  const s26 = B.src.filter(x => x[0] === '2.6');
  ok(B.src[0].join('|') === 'Question|No.|Adobe source|Link' && s26.length === A['2.6'].sources.length && s26[0][1] === '1' && /^https:\/\//.test(s26[0][3]) && B.src.some(x => x[0] === '2.4' && /brand-visibility/.test(x[3])), 'the Adobe sources sheet lists each answer\'s sources, 2.6\'s numbered to match its cell', JSON.stringify(s26.slice(0, 2)));
  ok(!/Sh33tJ5/.test(raw), 'nothing of the reader\'s own is left in the client\'s file');
  // Round 6 gives writeback one fixed menu description. The file checks above verify the formatting.
  ok((await h.page.textContent('#rfp-writeback')).includes("Your answers written back into the client's own workbook."), 'the menu identifies the client workbook');

  // ---- an RFP with no word limit keeps everything
  const bankText = fs.readFileSync(FIX + '/bank_rfp.txt', 'utf8');   // the text version of the bank RFP carries no instruction line
  r = await h.text(bankText);
  const noLimit = await h.eval(() => RFPAnswers.limitOf(RFPBuilder.state.questions.find(q => q.label === '2.2')));
  w = await C('2.2'); const w26 = await W('2.6'), w24 = await C('2.4');
  ok(!/\d+ words/i.test(bankText) && noLimit === null && w.fit === null && sec(w, 'What we would need from you').length === 9, 'without the instruction there is no limit: 2.2 keeps its nine asks and nothing is left out', JSON.stringify([noLimit, sec(w, 'What we would need from you').length]));
  ok(w26.fit === null && /as capacity and your entitlements allow/.test(w26.body) && /meaning the service can be used in a way that helps you meet your legal obligations/.test(w26.body) && /We will attach Adobe's current certification list/.test(w26.body) && w26.sources.length >= 12, 'and 2.6 is in its full wording with every source', String(w26.sources.length));
  await catalogOnScreen(); await h.select(r.questions.findIndex(q => q.label === '2.4')); panel = await h.panel();
  ok(sec(w24, 'What we would do').length === 2 && sec(w24, 'After launch').length === 0 && /Not repeated here, because your answer to 2\.5 says it in full: Monthly prompt and performance review; Content improvements for search and AI\./.test(panel), 'services are still said once: 2.4 keeps both setup services, leaves the monthly work to 2.5, and the panel tells the partner where it is');
  const off24 = await h.eval(() => [...document.querySelectorAll('#rfp-answer .rfp-asks .rfp-badge')].map(b => b.textContent));
  ok(off24.some(b => b === 'Not in the response: its service is not in this answer') && off24.some(b => b === 'In the response'), 'an ask that came with a service said in another answer is badged as not in this response', JSON.stringify(off24));

  // ---- the ways an RFP states a limit; a question's own limit wins
  r = await h.text('Responses are limited to 120 words each.\n\n1. Describe how Brand Visibility shows where our brand appears in AI answers.\n\n2. Describe your approach to implementing Adobe Experience Manager Sites, including migration of our existing content (maximum 200 words).');
  const l1 = await h.eval(() => RFPBuilder.state.questions.map(q => RFPAnswers.limitOf(q)));
  const b1 = await h.eval(() => RFPBuilder.state.questions.map(q => { const d = RFPAnswers.compose(q); return RFPAnswers.plain(d, q).split('\n\nAdobe sources')[0]; }));
  ok(l1.length === 2 && l1[0].max === 120 && l1[1].max === 200 && naive(b1[0]) <= 118 && naive(b1[1]) <= 197 && naive(b1[1]) > 120, '"limited to 120 words" sets the RFP\'s limit and a question\'s own "(maximum 200 words)" wins for that question', JSON.stringify([l1.map(x => x && x.max), b1.map(naive)]));
  const forms = await h.eval(() => ['a 500-word limit applies', 'Word limit: 250', 'no more than 150 words', 'fewer than 400 words', 'at most 90 words', 'our site has 300 pages and 40 words of legal text'].map(t => { const x = RFPAnswers.limitIn(t); return x ? x.max : null; }));
  ok(forms.join(',') === '500,250,150,399,90,', 'the limit is read from "500-word limit", "Word limit: 250", "no more than 150 words", "fewer than 400 words" and "at most 90 words", and not from a sentence that only mentions words', forms.join(','));

  // ---- a long setup sentence becomes a list only when it clearly is one
  const lf = await h.eval(() => ['F02', 'FP10', 'AN06', 'SI01'].map(id => RFPAnswers.listify(RFPAnswers.doLine(id)).split('\n  - ').length - 1));
  ok(lf.join(',') === '7,0,0,0', 'only a sentence of five steps or more is set out as a list (F02 in seven; the shorter ones stay sentences)', lf.join(','));

  console.log(fails ? fails + ' STEP 67 CHECK(S) FAILED' : 'ALL STEP 67 CHECKS PASSED');
  await h.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
