// Desktop, Create your own play: a line waiting for a product, now vs the phone arrangement at every width (proposal only)
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const SITE='/home/user/warroom/sow/site',OUT=__dirname;
const server=http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0].split('#')[0]);if(u.endsWith('/'))u+='index.html';const f=path.join(SITE,u);if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(f).pipe(res);});
const FIX='.ln.lock.can{grid-template-columns:auto 1fr;row-gap:3px}.ln.lock.can .nm{grid-column:1/-1}.ln.lock.can .hr{text-align:left}';
(async()=>{await new Promise(r=>server.listen(0,r));const BASE=`http://localhost:${server.address().port}/`;const b=await chromium.launch();const rep={};
for(const [ids,cid,more] of [[['target','cja'],'target-cja',false],[['commerce','eds'],'commerce-eds',true]]){
 const p=await (await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2})).newPage();
 await p.goto(BASE);await p.waitForTimeout(300);await p.click('#picker [data-play="custom"]');await p.waitForTimeout(400);
 for(const id of ids){if(await p.isHidden('#add-menu'))await p.click('#add-btn');if(await p.$(`#add-menu details.nocon [data-add="${id}"]`)&&!(await p.$eval('#add-menu details.nocon',d=>d.open)))await p.click('#add-menu details.nocon summary');await p.click(`#add-menu [data-add="${id}"]`);await p.waitForTimeout(300);}
 await p.fill('#rate','150');await p.keyboard.press('Escape');await p.waitForTimeout(150);
 if(!(await p.isHidden('#add-menu')))await p.click('#add-btn');await p.waitForTimeout(150);
 await p.evaluate(i=>document.querySelector(`.ib[data-c="${i}"]`).click(),cid);await p.waitForTimeout(400);
 if(more)for(const d of await p.$$('#card details:not([open]) > summary'))await d.click();await p.waitForTimeout(200);
 const line=async()=>p.$eval('#card .ln.lock',l=>{const r=l.getBoundingClientRect();l.scrollIntoView({block:'center'});return Math.round(r.height);});
 rep[cid+'_now']=await line();await p.waitForTimeout(200);await (await p.$('#card .ln.lock')).screenshot({path:path.join(OUT,`w_${cid}_now.png`)});
 await p.addStyleTag({content:FIX});await p.waitForTimeout(300);
 rep[cid+'_new']=await line();await p.waitForTimeout(200);await (await p.$('#card .ln.lock')).screenshot({path:path.join(OUT,`w_${cid}_new.png`)});
 rep[cid+'_menuHidden']=await p.isHidden('#add-menu');
 await p.context().close();}
console.log(JSON.stringify(rep));await b.close();server.close();})();
