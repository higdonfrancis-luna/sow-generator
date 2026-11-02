// The "counted once" rule on the scratch canvas: when the product's own data service is on, the outside system's
// ingestion line shows as covered by it and adds nothing, the way generic Skills already show as replaced.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const OUT=__dirname,MOCK=path.join(OUT,'site_mock');let t=fs.readFileSync(path.join(MOCK,'index.html'),'utf8');
const rep=(a,b)=>{if(t.split(a).length!==2)throw new Error('anchor '+a.slice(0,60));t=t.replace(a,b);};
rep("const replaced=l=>l==='CW03'&&!st.keep.CW03&&specialOn();","const replaced=l=>(l==='OX3'&&!st.keep.OX3&&lineOn('CJ01'))||(l==='CW03'&&!st.keep.CW03&&specialOn());");
rep('<span class="rep">Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.</span>',
    '<span class="rep">${l===\'OX3\'?\'Covered by CJA data preparation in Experience Platform, which is on. Check to keep it for work that service doesn\\\'t cover.\':\'Replaced by the specialized Skills on this canvas. Check to keep it for distinct Skills.\'}</span>');
fs.writeFileSync(path.join(MOCK,'index_cov.html'),t);
const server=http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0].split('#')[0]);if(u.endsWith('/'))u+='index_cov.html';const f=path.join(MOCK,u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,r));const BASE=`http://localhost:${server.address().port}/`;const b=await chromium.launch();const rep2={};
const p=await (await b.newContext({viewport:{width:1440,height:1500},deviceScaleFactor:2})).newPage();p.on('pageerror',e=>rep2.err=(rep2.err||'')+e.message);
await p.goto(BASE);await p.waitForTimeout(300);await p.click('#picker [data-play="cja"]');await p.waitForTimeout(600);await p.fill('#rate','150');await p.evaluate(()=>document.activeElement.blur());await p.mouse.move(5,5);
await p.addStyleTag({content:'#card{max-height:none!important}'});await p.waitForTimeout(300);
const shoot=async name=>{await p.evaluate(()=>document.querySelector('.ib[data-c="dwh-cja"]').click());await p.waitForTimeout(500);
  for(const d of await p.$$('#card details:not([open]) > summary'))await d.click();await p.waitForTimeout(200);
  const box=await p.evaluate(()=>{const c=document.getElementById('card'),s=[...c.querySelectorAll('.sec')].find(x=>/services on this connection/i.test(x.textContent)),r=c.getBoundingClientRect(),q=s.getBoundingClientRect();return {x:r.x,y:q.y-12,w:r.width,h:r.bottom-q.y+12};});
  await p.screenshot({path:path.join(OUT,name),clip:{x:box.x,y:box.y,width:box.w,height:box.h}});
  rep2[name]={total:(await p.textContent('#t-big')).trim(),sub:(await p.textContent('#t-sub').catch(()=>'')).trim()};
  await p.evaluate(()=>hideCard(true));await p.waitForTimeout(200);};
await shoot('cov_off.png');
// the partner turns on CJA's own data preparation (a full data build)
await p.evaluate(()=>{st.ls.CJ01=true;save&&save();});await p.reload();await p.waitForTimeout(700);await p.addStyleTag({content:'#card{max-height:none!important}'});await p.mouse.move(5,5);await p.waitForTimeout(300);
rep2.cj01=await p.evaluate(()=>lineOn('CJ01'));
await shoot('cov_on.png');
console.log(JSON.stringify(rep2));await b.close();server.close();})();
