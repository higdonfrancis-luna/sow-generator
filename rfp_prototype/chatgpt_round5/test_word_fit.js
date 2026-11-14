// Inspect actual downloads, using the issued RFI keys and the independent delivery catalog.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {open} = require('../review_2026-11-09/harness.js');
const {downloadWord, tableIn, technicalBodies} = require('./test_word_complete.js');
const catalog = require('../../canvas/catalog.json');
const fixtures = {
  briarhaven: {cms: ['A.2', 'Drupal'], warehouse: ['D.3', 'Snowflake']},
  'copper-mere-bank': {cms: ['A.2', 'Sitecore'], warehouse: ['B.1', 'Snowflake']},
  lantern_cove_travel: {cms: ['2.', 'Drupal'], warehouse: ['6.', 'Snowflake']},
  'bellwater-city': {cms: ['B.1', 'Drupal']}
};
const forbidden = {
  rtcdp: /\b(?:real[ -]?time (?:customer data platform|cdp)|rt[ -]?cdp)\b|\/real-time-customer-data-platform\b/i,
  ajo: /\b(?:journey[ -]optimizer|ajo)\b/i,
  workfront: /\bworkfront(?:[ -]fusion)?\b/i,
  aa: /\badobe[ -]analytics\b|experienceleague\.adobe\.com\/(?:[a-z]{2}\/)?docs\/analytics\//i,
  target: /\badobe[ -]target\b|experienceleague\.adobe\.com\/(?:[a-z]{2}\/)?docs\/target\//i
};
const productById = new Map(catalog.products.map(p => [p.id, p]));
const lineByName = new Map(Object.values(catalog.lines).map(service => [service.name, service]));
const members = obj => [...obj.lines || [], ...obj.more || []];
function owners(id) {
  const direct = catalog.products.filter(p => members(p).includes(id)).map(p => [p.id]);
  const connected = catalog.connections.filter(c => members(c).includes(id)).map(c => [c.a, c.b]);
  return [...direct, ...connected];
}
function hours(value) {
  assert.match(String(value), /^\s*[\d,]+(?:\s+(?:a|per) month)?\s*$/i, 'Unrecognized printed hour value: ' + value);
  return Number(String(value).replace(/,/g, '').match(/\d+/)[0]);
}
function add(totals, monthly, amount) { totals[monthly ? 1 : 0] += amount; }
function noExcluded(text, ids, where) {
  for (const id of ids) assert.doesNotMatch(text, forbidden[id], where + ' leaks ' + id);
}
function archiveParts(file, pattern) {
  const entries = execFileSync('unzip', ['-Z1', file], {encoding:'utf8'}).trim().split('\n').filter(n => pattern.test(n));
  // unzip treats square brackets as glob syntax.
  return entries.map(name => [name, execFileSync('unzip', ['-p', file, name.replace(/\[/g, '[[]')], {encoding:'utf8', maxBuffer:32e6})]);
}
// Keep checking all parts and links. Only remove literal client text at its designated quote location.
async function excludeSourceQuotes(h, markup, type, questions) {
  return h.eval(([markup,type,questions])=>{
    const doc = new DOMParser().parseFromString(markup,type==='html'?'text/html':'application/xml');
    const issued = new Map(questions.map(q=>[q.label,q.text]));
    if(type==='html'){
      for(const heading of doc.querySelectorAll('section > h3')){
        if(questions.some(q=>heading.textContent===(q.label?q.label+' ':'')+q.text))heading.textContent='';
      }
    }else if(type==='word'){
      const w='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
      const all=(el,tag)=>Array.from(el.getElementsByTagNameNS(w,tag));
      const words=el=>all(el,'t').map(t=>t.textContent).join('');
      const clear=el=>all(el,'t').forEach(t=>{t.textContent='';});
      for(const p of all(doc,'p')){
        if(all(p,'pStyle')[0]?.getAttributeNS(w,'val')==='Heading2'&&
          questions.some(q=>q.label&&words(p)===q.label+'  '+q.text))clear(p);
      }
      for(const table of all(doc,'tbl')){
        const [head,...rows]=all(table,'tr');
        const columns=all(head,'tc').map(words), source=columns.indexOf('Requirement');
        if(columns[0]!=='Ref'||source<0)continue;
        for(const row of rows){
          const cells=all(row,'tc');
          if(words(cells[source])===issued.get(words(cells[0])))clear(cells[source]);
        }
      }
    }else if(type==='excel'){
      // The generic response workbook has Number, Section, Question, Mandatory, Response.
      for(const row of doc.getElementsByTagNameNS('*','row')){
        const cells=Array.from(row.getElementsByTagNameNS('*','c'));
        const cell=col=>cells.find(c=>c.getAttribute('r')===col+row.getAttribute('r'));
        const ref=cell('A'), question=cell('C');
        if(ref&&question&&issued.get(ref.textContent)===question.textContent){
          for(const t of question.querySelectorAll('v, t'))t.textContent='';
        }
      }
    }
    return new XMLSerializer().serializeToString(doc);
  },[markup,type,questions]);
}
async function checkArchive(h, file, gold, where) {
  for (const [part, raw] of archiveParts(file, /(?:\.xml|\.rels)$/i)) {
    const type=part==='word/document.xml'?'word':part==='xl/worksheets/sheet1.xml'?'excel':'';
    const xml=type?await excludeSourceQuotes(h,raw,type,gold.questions):raw;
    noExcluded(xml, gold.products_excluded, where + '/' + part);
    noExcluded(xml.replace(/<[^>]+>/g, ''), gold.products_excluded, where + '/' + part);
  }
}
async function readServices(h) {
  return h.eval(() => RFPBuilder.state.questions.map(q => {
    const a = RFPAnswers.proposalAnswer(q);
    return {ref:q.label, services:a?.services || [], typed:a?.text != null};
  }));
}
function checkScope(key, gold, selected, doc) {
  const bodies = technicalBodies(doc, gold.questions.map(q => q.label));
  gold.questions.forEach((q, i) => {
    if (q.kind !== 'adobe') return;
    const chosen = selected[i].services;
    const allowed = new Set(q.products);
    for (const id of chosen) {
      const possibilities = owners(id);
      assert.ok(possibilities.some(group => group.every(p => productById.get(p)?.outside || allowed.has(p))), key + ' ' + q.label + ' uses out-of-scope ' + id + ' (' + JSON.stringify(possibilities) + ')');
    }
    if (q.products.length === 1 && !selected[i].typed) {
      // A named product without a matching catalog service gets an explicit discovery estimate.
      assert.ok(bodies.has(q.label) && (chosen.length || /Estimate in discovery/i.test(bodies.get(q.label).paragraphs.join(' '))),
        key + ' ' + q.label + ' needs scoped work or an explicit discovery estimate');
    }
  });
  for (const [ref, name] of Object.values(fixtures[key])) {
    const text = bodies.get(ref)?.paragraphs.join(' ') || '';
    assert.ok(text.includes(name), key + ' ' + ref + ' needs the client system ' + name);
    assert.doesNotMatch(text, /Content Transfer Tool|BigQuery|Databricks|AEM\s*6\.5|Adobe Experience Manager\s*6\.5/i, key + ' ' + ref + ' proposes another estate');
  }
  if (key === 'briarhaven') {
    const chosen = selected.find(q => q.ref === 'C.1').services;
    assert.ok(chosen.length && chosen.every(id => members(productById.get('aemforms')).includes(id)), 'C.1 must draw only on AEM Forms build services');
    assert.doesNotMatch(bodies.get('C.1').paragraphs.join(' '), /Analysis Workspace|Adobe Target|Customer Journey Analytics/i);
  }
}
function checkLedger(key, gold, doc, selected) {
  const effort = tableIn(doc, 'Services and effort', 'Service');
  const totals = [0, 0], printedTotals = [0, 0], byRef = new Map();
  const printed = new Set();
  const expected = new Set(selected.flatMap(q => q.services));
  for (const row of effort) {
    const name = row.Service, amount = hours(row['Planning hours']);
    if (/^Total,/.test(name)) { add(printedTotals, /monthly/i.test(name), amount); continue; }
    const line = lineByName.get(name);
    assert.ok(line, key + ': unknown catalog service ' + name);
    assert.ok(!printed.has(line.id), key + ': duplicated service ' + line.id);
    printed.add(line.id);
    const monthly = line.unit === 'monthly';
    assert.equal(monthly, /month/i.test(row['Planning hours']), key + ': unit of ' + name);
    assert.equal(amount, line.base, key + ': catalog hours for ' + name);
    const ref = row['Counted in'];
    assert.ok(selected.some(q => q.ref === ref && q.services.includes(line.id)), key + ': unowned charge for ' + name + ' at ' + ref);
    if (!byRef.has(ref)) byRef.set(ref, [0, 0]);
    add(byRef.get(ref), monthly, amount);
    add(totals, monthly, amount);
  }
  assert.deepEqual(printed, expected, key + ': service table must contain the complete deduplicated approved scope');
  assert.deepEqual(printedTotals, totals, key + ': published service totals');
  const stats = doc.blocks.find(b => b.rows?.[0].some(cell => cell.includes('catalog services')))?.rows[0] || [];
  const stat = label => stats.find(c => c.includes(label))?.split('\n')[0];
  assert.equal(hours(stat('catalog services')), printed.size, key + ': overview service count');
  for (const [i,title] of ['one-time planning hours','planning hours a month'].entries())
    assert.equal(stat(title) ? hours(stat(title)) : 0, totals[i], key + ': overview ' + title);
  const matrix = tableIn(doc, 'Requirements matrix', 'Ref'), bodies = technicalBodies(doc, matrix.map(r => r.Ref));
  assert.deepEqual(matrix.map(r => r.Ref), gold.questions.map(q => q.label), key + ': source order in the matrix');
  for (const row of matrix) {
    const charge = byRef.get(row.Ref) || [0,0];
    assert.deepEqual([hours(row['One-time hours'] || '0'), hours(row['Monthly hours'] || '0')], charge, key + ' ' + row.Ref + ': matrix charge');
    let estimate = bodies.get(row.Ref)?.paragraphs.filter(s => /Planning estimate:/i.test(s)).join(' ') || '';
    // Edited answers keep the partner's exact text. Their selected catalog estimate sits in its own table.
    if (selected.some(q=>q.ref===row.Ref&&q.typed)) {
      const blocks=doc.sections.find(s=>s.number===bodies.get(row.Ref)?.section)?.blocks||[];
      const start=blocks.findIndex(b=>b.style==='Heading2'&&b.text.startsWith(row.Ref+' '));
      const after=start<0?[]:blocks.slice(start+1);
      const end=after.findIndex(b=>b.style==='Heading2');
      const table=(end<0?after:after.slice(0,end)).find(b=>b.rows?.[0]?.[0]==='Catalog effort for this requirement');
      if(table)estimate=table.rows[1][0];
    }
    const quoted = (pattern) => { const m = pattern.exec(estimate); return m ? hours(m[1]) : 0; };
    const once = quoted(/([\d,]+)\s+(?:hours?\s+one-time|one-time\s+hours?)/i);
    const monthly = quoted(/([\d,]+)\s+hours?\s+(?:a|per) month/i);
    assert.deepEqual([once,monthly], charge, key + ' ' + row.Ref + ': answer hours: ' + estimate);
  }
  return matrix;
}
async function actualDownload(h, id) {
  if (await h.page.isHidden('#rfp-dl-menu')) await h.page.click('#rfp-download-menu');
  const [file] = await Promise.all([h.page.waitForEvent('download', {timeout:12000}), h.page.locator('#' + id).press('Enter')]);
  await h.page.locator('#rfp-dl-menu').waitFor({state:'hidden'});
  return file.path();
}
async function otherDownloads(h, gold, key) {
  for (const id of ['rfp-download','rfp-download-asks']) {
    const file = await actualDownload(h,id);
    noExcluded(await excludeSourceQuotes(h,fs.readFileSync(file,'utf8'),'html',gold.questions),gold.products_excluded,key + '/' + id);
  }
  await checkArchive(h,await actualDownload(h,'rfp-download-xlsx'),gold,key + '/response workbook');
  if (gold.file.endsWith('.xlsx')) {
    // The returned customer workbook is a separate download with its original response column.
    const btn=h.page.locator('#rfp-writeback');
    assert.ok(await btn.count(), key + ': the customer workbook can be filled');
    // The original workbook can name a declined product. Compare its original cells and inspect all generated text.
    const returned = fs.readFileSync(await actualDownload(h,'rfp-writeback'));
    const original = fs.readFileSync(path.join(__dirname,gold.file));
    const changed = await h.eval(([before,after])=>{
      const read=bytes=>XLSX.read(Uint8Array.from(bytes),{type:'array'});
      const old=read(before), filled=read(after), generated=[];
      for(const name of filled.SheetNames)for(const [addr,cell] of Object.entries(filled.Sheets[name])){
        if(addr.startsWith('!'))continue;
        const orig=old.Sheets[name]?.[addr];
        if(orig&&orig.v===cell.v)continue;
        if(orig&&orig.v!==''&&orig.v!=null)throw Error('Original cell changed: '+name+'!'+addr);
        if(typeof cell.v==='string')generated.push(cell.v);
      }
      for(const name of old.SheetNames)for(const [addr,cell] of Object.entries(old.Sheets[name]))
        if(!addr.startsWith('!')&&cell.v!=null&&cell.v!==''&&filled.Sheets[name]?.[addr]?.v!==cell.v)
          throw Error('Original cell lost: '+name+'!'+addr);
      return generated;
    }, [[...original],[...returned]]);
    assert.ok(changed.length);
    noExcluded(changed.join(' '),gold.products_excluded,key + '/filled workbook answers and sources');
  }
}
async function rejectCorruption(h) {
  const p=h.page;
  const reason=await h.eval(async()=>{
    const c=RFPProposal.contentOf(RFPAnswers.proposalPack());
    const table=c.sections.find(s=>s.title==='Requirements matrix').blocks.find(b=>b.type==='table');
    const col=table.columns.indexOf('One-time hours');
    table.rows[0][col]=String(Number(table.rows[0][col])+1);
    try { await RFPProposal.build(c); return ''; } catch(e) {return e.message;}
  });
  assert.ok(reason,'Word creation accepted a changed matrix total');
  await h.eval(()=>{
    const getPack=RFPAnswers.proposalPack;
    RFPAnswers.proposalPack=()=>{const p=structuredClone(getPack()); for(const group of [...p.products,...p.connections])for(const row of group.services)row.hours++;return p;};
  });
  const files=[]; const record=d=>files.push(d.suggestedFilename());p.on('download',record);
  try {
    if(await p.isHidden('#rfp-dl-menu'))await p.click('#rfp-download-menu');
    await p.click('#rfp-download-proposal');
    await p.waitForFunction(()=>document.querySelector('#rfp-progress-text')?.textContent.includes('The proposal was not written.'));
    assert.deepEqual(files,[], 'A mismatched pack reached Downloads');
  } finally {p.off('download',record);}
}
async function run() {
  const h=await open();
  try {
    for (const key of Object.keys(fixtures)) {
      const gold=require('./gold/'+key+'.json');
      await h.file(path.join(__dirname,gold.file));
      const doc=await downloadWord(h), selected=await readServices(h);
      await checkArchive(h,doc.filePath,gold,key);
      checkScope(key,gold,selected,doc);
      checkLedger(key,gold,doc,selected);
      await otherDownloads(h,gold,key);
      console.log('PASS '+key+' Word scope, catalog hours and downloads');
    }
    await h.text([
      'Section A: Store operations',
      'A.1 Describe the Adobe Commerce storefront launch and checkout configuration.',
      'A.2 Describe your ongoing monthly Adobe Commerce operational support and maintenance retainer.'
    ].join('\n\n'));
    const recurring = checkLedger('Commerce implementation and support', {questions:[{label:'A.1'}, {label:'A.2'}]},
      await downloadWord(h), await readServices(h));
    assert.ok(hours(recurring[0]['One-time hours']) > 0 && hours(recurring[1]['Monthly hours']) > 0,
      'The mixed-cadence proposal must exercise nonzero implementation and support totals');
    const gold=require('./gold/briarhaven.json');
    await h.file(path.join(__dirname,gold.file));
    const index=ref=>gold.questions.findIndex(q=>q.label===ref);
    await h.setStatus(index('C.1'),'used');
    await h.setAnswer(index('A.2'),'Our migration editor will reconcile the Drupal inventory with the signed redirect register.');
    await h.setStatus(index('A.3'),'skipped');
    const doc=await downloadWord(h);
    const matrix=checkLedger('Briarhaven approved selection',gold,doc,await readServices(h));
    assert.equal(matrix[index('A.3')]['Answered in'],'To write');
    assert.doesNotMatch(matrix[index('A.2')]['Answered in'],/to write/i);
    assert.ok(technicalBodies(doc,gold.questions.map(q=>q.label)).get('A.2').paragraphs.join(' ').includes('signed redirect register'));
    await rejectCorruption(h);
    assert.deepEqual(h.errors,[]);
    console.log('PASS approved, edited and omitted answers, corrupt matrix and pack refused');
  } finally {await h.close();}
}
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
