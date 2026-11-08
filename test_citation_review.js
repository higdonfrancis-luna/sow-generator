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
  const refs=await p.evaluate(()=>CapabilityReferences.list({source:'javascript:alert(1)',references:[{url:'https://example.com/x',title:'<script>bad</script>'},{url:'https://example.com/x',title:'duplicate'},{url:'http://example.com',title:'insecure'}]}));
  assert.equal(refs.length,1);
  await p.click('[data-step="services"]');
  assert(await p.locator('.capability-references').count()>0,'supporting references are discoverable');
  await p.click('[data-step="document"]');
  const csv=await Promise.all([p.waitForEvent('download'),p.click('#export-csv')]);const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'review-citations-'));const file=path.join(tmp,'services.csv');await csv[0].saveAs(file);
  assert(fs.readFileSync(file,'utf8').includes('Capability references'));
  const [sow]=await Promise.all([p.waitForEvent('download'),p.click('#download-sow')]);const sowFile=path.join(tmp,'sow.html');await sow.saveAs(sowFile);assert(fs.readFileSync(sowFile,'utf8').includes('Capability references'));
  const rendered=await p.evaluate(()=>{const lines=selectedLines();return {html:window.SOWDocument?SOWDocument.render({},lines,{}):'',lines:lines.filter(l=>l.references?.length).length};});
  assert(rendered.lines>0);assert(rendered.html.includes('Capability references'));
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: citation handoff, older drafts, partner edits, safe references and CSV export.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
