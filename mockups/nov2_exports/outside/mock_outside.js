// Mockup: outside (non-Adobe) systems on the Build canvas, CJA play. A scratch copy of the real built canvas with
// the proposed catalog entries and look injected; nothing in the repo changes. Content comes from content.json.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const OUT=__dirname,SRC='/home/user/warroom/sow/site',MOCK=path.join(OUT,'site_mock');
const C=JSON.parse(fs.readFileSync(path.join(OUT,'content.json'),'utf8'));
fs.rmSync(MOCK,{recursive:true,force:true});fs.cpSync(SRC,MOCK,{recursive:true});
let t=fs.readFileSync(path.join(MOCK,'index.html'),'utf8');
const m=t.match(/const CAT=(\{.*?\});\n/s);const CAT=JSON.parse(m[1]);
for(const p of C.products)CAT.products.push({id:p.id,name:p.name,title:p.name,lines:[],more:[],outside:true});
for(const c of C.connections)CAT.connections.push(c);
for(const [id,l] of Object.entries(C.lines))CAT.lines[id]=l;
const play=CAT.plays.find(p=>p.id===C.play);play.products=C.playProducts;play.pos=C.pos;
t=t.replace(m[0],'const CAT='+JSON.stringify(CAT)+';\n');
// the look: an outside system is a dashed box with a dark top bar and an OUTSIDE ADOBE tag
const css=`.node.out{border-style:dashed;border-top:6px solid var(--ink);padding-top:14px}.node.out::before{content:'OUTSIDE ADOBE';position:absolute;left:0;right:0;top:6px;text-align:center;font-size:10.5px;letter-spacing:1.3px;font-weight:700;color:var(--ink)}
.it2 .sys{grid-column:1/-1;display:block;font-size:14px;line-height:19px;font-weight:400;color:var(--ink);margin:2px 0 4px}.outhd p{margin:4px 0 0}#add-btn.outbtn{background:#fff;color:var(--ink);border:2px solid var(--ink)}`;
t=t.replace('</style>',css+'\n</style>');
// mark outside nodes when they are drawn
t=t.replace("n.dataset.p=p.id;","n.dataset.p=p.id;if(p.outside)n.classList.add('out');");
t=t.replace("partner:'Partner-designed workflow'};","partner:'Partner-designed workflow',outside:'Outside system'};");
fs.writeFileSync(path.join(MOCK,'index.html'),t);

const server=http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0].split('#')[0]);if(u.endsWith('/'))u+='index.html';const f=path.join(MOCK,u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,r));const BASE=`http://localhost:${server.address().port}/`;const b=await chromium.launch();const rep={};
const p=await (await b.newContext({viewport:{width:1440,height:960},deviceScaleFactor:2})).newPage();p.on('pageerror',e=>rep.err=(rep.err||'')+e.message);
await p.goto(BASE);await p.waitForTimeout(300);await p.click(`#picker [data-play="${C.play}"]`);await p.waitForTimeout(600);await p.fill('#rate','150');await p.evaluate(()=>document.activeElement.blur());await p.mouse.move(5,5);await p.waitForTimeout(400);
rep.total=(await p.textContent('#t-big')).trim();
await p.screenshot({path:path.join(OUT,'m_canvas.png'),clip:{x:0,y:0,width:1440,height:C.canvasHeight||820}});
// the Add outside system menu (the same control Create your own play uses for products)
await p.evaluate(C2=>{const w=document.getElementById('addwrap');w.hidden=false;const btn=document.getElementById('add-btn');btn.lastChild&&0;
  btn.classList.add('outbtn');btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>Add outside system <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';const menu=document.getElementById('add-menu');
  menu.innerHTML=`<div class="hd outhd"><div class="k">Add an outside system</div><p>${C2.menuIntro}</p></div><div class="g">Connects to this play</div>`+C2.menu.map(x=>`<button class="it2" role="menuitem"><span class="nm">${x.name}</span><span class="ctag">${x.to}</span><span class="sys">${x.systems}</span></button>`).join('');
  menu.hidden=false;btn.setAttribute('aria-expanded','true');if(typeof placeAdd==='function')placeAdd();},C);
await p.waitForTimeout(300);
const mb=await p.evaluate(()=>{const w=document.getElementById('addwrap').getBoundingClientRect(),m=document.getElementById('add-menu').getBoundingClientRect();return {x:Math.min(w.x,m.x),y:Math.min(w.y,m.y),r:Math.max(w.right,m.right),b:Math.max(w.bottom,m.bottom)};});
await p.screenshot({path:path.join(OUT,'m_menu.png'),clip:{x:Math.max(0,mb.x-16),y:Math.max(0,mb.y-16),width:mb.r-mb.x+32,height:mb.b-mb.y+32}});
await p.evaluate(()=>{document.getElementById('add-menu').hidden=true;document.getElementById('addwrap').hidden=true;});
// the two connection cards
await p.setViewportSize({width:1440,height:1500});await p.addStyleTag({content:'#card{max-height:none!important}'});await p.waitForTimeout(200);
for(const c of C.connections){await p.evaluate(id=>document.querySelector(`.ib[data-c="${id}"]`).click(),c.id);await p.waitForTimeout(500);
  for(const d of await p.$$('#card details:not([open]) > summary'))await d.click();await p.waitForTimeout(200);
  const card=await p.$('#card');await p.evaluate(()=>document.getElementById('card').scrollTop=0);
  await card.screenshot({path:path.join(OUT,`m_card_${c.id}.png`)});rep[c.id]=await p.evaluate(()=>document.getElementById('card').scrollHeight);
  await p.evaluate(()=>hideCard(true));await p.waitForTimeout(200);}
console.log(JSON.stringify(rep));await b.close();server.close();})();
