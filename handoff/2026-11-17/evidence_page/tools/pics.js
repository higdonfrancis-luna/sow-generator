const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=process.argv[2],out=process.argv[3];
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.csv':'text/csv'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';const f=path.join(root,p);if(!f.startsWith(root)||!fs.existsSync(f)){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
(async()=>{await new Promise(r=>srv.listen(0,r));const base='http://127.0.0.1:'+srv.address().port;const b=await chromium.launch();
async function shot(name,sel,w,h){const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});const p=await c.newPage();
 await p.goto(base+'/coworker-evidence.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 if(sel){await p.evaluate(s=>{const hd=document.querySelector('.masthead').getBoundingClientRect().bottom;const e=document.querySelector(s);const y=e.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:Math.max(0,y-hd-28),behavior:'instant'})},sel);await p.waitForTimeout(400)}
 const pos=await p.evaluate(s=>s?Math.round(document.querySelector(s).getBoundingClientRect().top):0,sel);
 await p.screenshot({path:`${out}/${name}.png`});console.log(name,'section top at',pos);await c.close()}
await shot('1_top',null,1440,1000);
await shot('2_adobe_says','#adobe-asks',1440,760);
await shot('3_process','#process',1440,1010);
await shot('4_evidence_coworker','#evidence',1440,1960);
await shot('5_notes_aem_assets','#g-aemassets-cw',1440,640);
await shot('6_brand_concierge_note','#g-cw-bc',1440,520);
await shot('7_brand_visibility_plays','#g-plays-cja-aem-fsi',1440,520);
await shot('8_phone_top',null,390,844);
await b.close();srv.close()})();
