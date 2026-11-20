// End-to-end citation propagation, saved defaults, partner edits and downloads.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),os=require('os'),assert=require('assert/strict');
const site=path.join(__dirname,'site');
(async()=>{
 const server=http.createServer((req,res)=>{const u=req.url.split('?')[0].split('#')[0];const file=path.join(site,u.endsWith('/')?u+'index.html':u);if(!file.startsWith(site)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(file));});
 await new Promise(r=>server.listen(0,r));const base='http://localhost:'+server.address().port;
 const browser=await chromium.launch();
 try{
  const p=await browser.newPage({acceptDownloads:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/');await p.click('#picker [data-play="cja"]');
  // Full source set survives the Build-to-SOW handoff.
  await p.click('#save');await p.waitForURL('**/sow/index.html#scope');
  const carried=await p.evaluate(()=>state.canvas.filter(c=>c.references.length).map(c=>({id:c.id,n:c.references.length})));
  assert(carried.length>0,'supporting citations reach the SOW');
  // Opening an older draft upgrades untouched catalog defaults, preserves client edits.
  const migration=await p.evaluate(()=>{
   const raw=JSON.parse(JSON.stringify(state)),id='CJ04',cur=REVIEW_CONCEPTS[id];
   raw.canvas=[{id:'CANVAS-'+id,name:'Workspace projects and dashboards',scope:'Build the agreed Workspace projects and dashboards.',assumptions:'Old prerequisite.',unit:'one-time',low:16,base:24,high:48,plays:['cja'],concept:true,source:cur.source}];
   raw.estimates.cja['CANVAS-'+id]={on:true,band:'typical',hours:37,hoursEdited:true,rate:211,cadence:'one-time',scope:raw.canvas[0].scope,deliverable:'Client-approved deliverable: four projects',acceptance:'Client approval of four projects',assumptions:'Old prerequisite. Client confirmed access on Nov 7.',exclusions:'Client-specific exclusion'};
   const next=normalize(raw),c=next.canvas.find(c=>c.id==='CANVAS-'+id),r=next.estimates.cja['CANVAS-'+id];
   return {definition:c,row:r,current:cur};
  });
  assert.equal(migration.row.scope,migration.current.scope);
  assert.equal(migration.row.hours,37);assert.equal(migration.row.rate,211);
  assert.equal(migration.row.deliverable,'Client-approved deliverable: four projects');
  assert(migration.row.assumptions.endsWith('Client confirmed access on Nov 7.'));
  assert(migration.definition.references.length>1);
  assert(await p.evaluate(()=>Object.values(REVIEW_CONCEPTS).every(c=>!/(^|[;.(:]\s*|\bso\s+)(confirm|prove it)\b/i.test(docVoice(c.assumptions)))),'concept prerequisites are Client-owned conditions, not partner instructions');
  const scrubbed=await p.evaluate(()=>{
   const raw=JSON.parse(JSON.stringify(state));raw.startDate='2026-11-07';
   const id='CUSTOM-RELEASE',scope='Configure the beta connector. The feature is expected to be released in June 2027. Keep 12 fields.';
   const line={id,name:'Connector setup',scope,deliverable:'12 mapped fields',acceptance:'Client approval',assumptions:'Client access',exclusions:'Additional work',unit:'one-time',stage:'Connect',plays:[raw.play],low:7,base:7,high:7};
   raw.custom.push(line);raw.estimates[raw.play][id]={on:true,hours:7,rate:211,band:'typical',scope,deliverable:line.deliverable,acceptance:line.acceptance,assumptions:line.assumptions,exclusions:line.exclusions};
   const clean=normalize(raw);return {row:clean.estimates[raw.play][id],definition:clean.custom.find(c=>c.id===id),date:clean.startDate};
  });
  assert(!/beta|June 2027|expected to be released/i.test(JSON.stringify(scrubbed)));
  assert(scrubbed.row.scope.includes('12 fields'));assert.equal(scrubbed.row.hours,7);assert.equal(scrubbed.row.rate,211);assert.equal(scrubbed.date,'2026-11-07');
  const refs=await p.evaluate(()=>CapabilityReferences.list({source:'javascript:alert(1)',references:[{url:'https://example.com/x',title:'<script>bad</script>'},{url:'https://example.com/x',title:'duplicate'},{url:'http://example.com',title:'insecure'}]}));
  assert.equal(refs.length,1);
  await p.click('[data-step="services"]');
  assert(await p.locator('.capability-references').count()>0,'supporting references are discoverable');
  await p.click('[data-step="document"]');
  const csv=await Promise.all([p.waitForEvent('download'),p.click('#export-csv')]);const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'review-citations-'));const file=path.join(tmp,'services.csv');await csv[0].saveAs(file);
  assert(fs.readFileSync(file,'utf8').includes('Capability references'));
  // step 68 (Nov 10 2026): the statement of work carries the references only as an appendix the partner ticks; the CSV keeps them.
  // Download SOW (an .html file) was removed on Nov 13 (Print / PDF covers it; Adam, Nov 14), so the preview Print / PDF prints is read
  assert(!(await p.textContent('#sow-preview')).includes('Appendix: Adobe capability references'),'no appendix unless the partner asks for it');
  await p.check('#sow-refs');await p.waitForTimeout(200);assert((await p.textContent('#sow-preview')).includes('Appendix: Adobe capability references'));
  const rendered=await p.evaluate(()=>{const lines=selectedLines();return {html:window.SOWDocument?SOWDocument.render({sowReferences:true},lines,{}):'',plain:window.SOWDocument?SOWDocument.render({},lines,{}):'',lines:lines.filter(l=>l.references?.length).length};});
  assert(rendered.lines>0);assert(rendered.html.includes('Appendix: Adobe capability references'));assert(!/capability references/i.test(rendered.plain));
  // Nov 17 (Adam: "this is a proof point"): Adobe Support and Services is proof for the partner. The partner's screens show it under
  // the Coworker services (the canvas, the Services step); what the client reads leaves it out (the statement of work's appendix,
  // the services CSV, the RFI Builder's answers and their sources)
  const SUPPORT='https://business.adobe.com/support/adobe-support-and-services.html',CW_HOME='https://experienceleague.adobe.com/en/docs/coworker/content/home';
  // the Coworker Skills service for CJA reporting (CW-CJA) cites it too, on the Coworker + CJA card and on the Services step
  const x=await browser.newPage();x.on('pageerror',e=>errors.push(e.message));
  await x.goto(base+'/');await x.click('#picker [data-play="custom"]');await x.waitForTimeout(300);
  for(const id of ['cja','cw']){if(await x.isHidden('#add-menu'))await x.click('#add-btn');await x.$eval(`#add-menu [data-add="${id}"]`,e=>{const d=e.closest('details');if(d)d.open=true;});await x.click(`#add-menu [data-add="${id}"]`);await x.waitForTimeout(300);}
  await x.keyboard.press('Escape');await x.waitForTimeout(150);await x.click('button.ib[data-c="cw-cja"]');await x.waitForTimeout(400);
  assert.equal((await x.$$(`#card .ln[data-l="CW-CJA"] a[href="${SUPPORT}"]`)).length,1,'the Coworker + CJA card cites Adobe Support and Services under CW-CJA');
  await x.keyboard.press('Escape');await x.waitForTimeout(150);await x.click('#save');await x.waitForURL('**/sow/index.html#scope');
  await x.click('[data-step="services"]');await x.waitForTimeout(300);
  assert.equal((await x.$$(`.service-card[data-line="CANVAS-CW-CJA"] a[href="${SUPPORT}"]`)).length,1,'and the Services step cites it under CW-CJA');
  await x.click('[data-step="document"]');await x.waitForTimeout(300);
  const xcsv=await Promise.all([x.waitForEvent('download'),x.click('#export-csv')]);const xfile=path.join(tmp,'custom.csv');await xcsv[0].saveAs(xfile);
  await x.check('#sow-refs');await x.waitForTimeout(200);const xdoc=await x.innerHTML('#sow-preview');
  assert(fs.readFileSync(xfile,'utf8').includes('Coworker Skills for CJA reporting')&&!fs.readFileSync(xfile,'utf8').includes(SUPPORT)&&xdoc.includes('Appendix: Adobe capability references')&&!xdoc.includes(SUPPORT),'what the canvas hands over keeps it out of the CSV and the appendix');
  const w=await browser.newPage({acceptDownloads:true});w.on('pageerror',e=>errors.push(e.message));
  await w.goto(base+'/');await w.click('#picker [data-play="coworker"]');await w.waitForTimeout(300);
  await w.dblclick('.node[data-p="cw"]');await w.waitForTimeout(400);
  const onCanvas=await w.$$eval('#card .ln',(rows,u)=>rows.filter(r=>[...r.querySelectorAll('a')].some(a=>a.href===u)).map(r=>r.dataset.l),SUPPORT);
  assert.deepEqual(onCanvas.slice().sort(),['CW01','CW02','CW03','CW04','CW05','CW06','CW07','CW08','CW09','CW10','CW11'],'the Coworker card on the canvas cites it under each of its eleven services (CW09 to CW11 since Nov 17): '+onCanvas.join());
  await w.keyboard.press('Escape');await w.waitForTimeout(200);await w.click('#save');await w.waitForURL('**/sow/index.html#scope');
  await w.click('[data-step="services"]');await w.waitForTimeout(300);
  const onCards=await w.$$eval('.service-card',(cards,u)=>cards.filter(c=>c.querySelector(`.capability-references a[href="${u}"]`)).map(c=>c.dataset.line),SUPPORT);
  assert(onCards.length>=4&&onCards.every(id=>/^CW(?:0[1-9]|1[01])$/.test(id)),'the Services step cites it under the Coworker services: '+onCards.join());
  await w.click('[data-step="document"]');await w.waitForTimeout(300);
  const wcsv=await Promise.all([w.waitForEvent('download'),w.click('#export-csv')]);const wfile=path.join(tmp,'coworker.csv');await wcsv[0].saveAs(wfile);const wtext=fs.readFileSync(wfile,'utf8');
  await w.check('#sow-refs');await w.waitForTimeout(200);const appendix=await w.innerHTML('#sow-preview');
  assert(wtext.includes(CW_HOME)&&!wtext.includes(SUPPORT)&&!wtext.includes('Adobe Support and Services'),'the Coworker services CSV keeps its other references and leaves Adobe Support and Services out');
  assert(appendix.includes('Appendix: Adobe capability references')&&appendix.includes(CW_HOME)&&!appendix.includes(SUPPORT)&&!appendix.includes('Adobe Support and Services'),'the statement of work\'s appendix leaves it out');
  const r=await (await browser.newContext()).newPage();r.on('pageerror',e=>errors.push(e.message));r.on('dialog',d=>d.accept());
  await r.goto(base+'/sow/index.html#rfp');await r.waitForTimeout(400);
  await r.evaluate(()=>RFPBuilder.load('pasted.txt','1. Describe the services you would provide to deploy Adobe CX Enterprise Coworker for our marketing team.'));await r.waitForTimeout(200);
  const rfi=await r.evaluate(()=>{const q=RFPBuilder.state.questions[0],d=q&&(q.draft||RFPAnswers.compose(q));return d?{lines:d.m.lines,sources:(d.sources||[]).map(s=>s.url),plain:RFPAnswers.plain(d,q)}:null;});
  assert(rfi&&rfi.lines.includes('CW01')&&rfi.sources.includes(CW_HOME)&&!rfi.sources.includes(SUPPORT)&&!rfi.plain.includes(SUPPORT)&&!rfi.plain.includes('Adobe Support and Services'),'the RFI Builder\'s answer on the Coworker services cites its Adobe sources but not Adobe Support and Services: '+JSON.stringify(rfi&&{lines:rfi.lines,sources:rfi.sources}));
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: citation handoff, older drafts, partner edits, safe references and CSV export; Adobe Support and Services on the partner\'s screens only.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
