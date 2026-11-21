// Mockup only (Nov 21 2026): draws the proposed "Get your team ready" changes on the real built page, without changing the tool.
//   node training_mock.js <repo root> <output folder>
// 1. a "Get your team ready" menu in the top bar of every page: Adobe's two training portals, then the products on the canvas
// 2. a jump link under each product card's name, and a bolder training box
// 3. the level Adobe publishes beside each certification and training link
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(process.argv[2]||'.'),OUT=path.resolve(process.argv[3]||'.'),ORIGIN='https://training-mock.test/';
const LEVELS=JSON.parse(fs.readFileSync(path.join(__dirname,'levels.json'),'utf8'));
const CSS=`
.trwrap{position:relative;display:inline-flex}
.trbtn .cap{color:var(--red);display:inline-flex}
#tr-menu{left:auto;right:0;width:min(430px,calc(100vw - 32px));max-height:none}
#tr-menu a.it2,#tr-menu button.it2{text-decoration:none;cursor:pointer;padding:7px 18px}
#tr-menu .it2 b{font-weight:700}
#tr-menu .it2 .sys{grid-column:1/-1;display:block;font-size:14.5px;line-height:19px;color:var(--ink2);margin-top:1px}
#tr-menu .it2 .cnt{font-size:13.5px;color:var(--ink2);white-space:nowrap}
#tr-menu .it2 svg.ext{margin-left:5px;vertical-align:-1px}
.card .trjump{display:inline-flex;align-items:center;gap:7px;margin:0 0 9px;border:1.5px solid var(--red);background:#FFF4F2;color:var(--dred);border-radius:999px;padding:4px 12px 4px 9px;font-weight:700;font-size:14.5px;line-height:20px}
.card .trjump .n{font-weight:400;color:var(--ink)}
.card details.ready{border:2px solid var(--red);background:#fff;padding:0;overflow:hidden}
.card details.ready>summary{background:#FFF4F2;padding:10px 12px;column-gap:10px;font-size:17px}
.card details.ready>summary .cap{background:var(--red);color:#fff;border-radius:999px;width:30px;height:30px;align-items:center;justify-content:center;grid-row:1/3}
.card details.ready>summary .rs{color:var(--ink);font-size:14px}
.card details.ready .rr{padding:8px 12px}
.card details.ready .rr:first-of-type{margin-top:0}
.card .lv{display:inline-block;font-size:11.5px;line-height:16px;font-weight:700;letter-spacing:.3px;color:var(--ink);background:#fff;border:1.5px solid var(--ink);border-radius:999px;padding:0 7px;margin:0 7px 2px 0;vertical-align:1px;white-space:nowrap}
.card .lv.none{border-color:var(--line);color:var(--ink2);font-weight:600}
@media(max-width:900px){#tr-menu{left:0;right:auto}}
`;
const CAP='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>';
const EXT='<svg class="ext" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const CHEV='<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
// the top-bar menu: the two portals, then one row per Adobe product on the canvas
const topBar=(open)=>p=>p.evaluate(({CSS,CAP,EXT,CHEV,open})=>{
  if(!document.getElementById('tr-css')){const s=document.createElement('style');s.id='tr-css';s.textContent=CSS;document.head.appendChild(s);}
  document.getElementById('tr-wrap')?.remove();
  const count=id=>{const t=TRAIN.products[id],shown=t.closest?TRAIN.products[t.closest].exams:t.exams,own=!t.closest?shown.filter(e=>!e.credential).length:0;
    return own?own+' certification'+(own===1?'':'s'):'Training links';};
  const onCanvas=document.body.classList.contains('picking')?[]:prods().filter(o=>!o.outside&&TRAIN.products[o.id]);
  const w=document.createElement('div');w.className='trwrap';w.id='tr-wrap';
  w.innerHTML=`<button class="btn trbtn" id="tr-btn" aria-haspopup="true" aria-expanded="${open}"><span class="cap">${CAP}</span>Get your team ready ${CHEV}</button>`+
   `<div class="addmenu" id="tr-menu" role="menu"${open?'':' hidden'}><div class="hd"><div class="k">Get your team ready</div><p>Where your team trains and certifies on Adobe products.</p></div>`+
   `<div class="g">Adobe's training portals</div>`+
   `<a class="it2" href="${TRAIN.courses.replace('#filters=','')}" target="_blank" rel="noopener"><span><b>Adobe courses</b>${EXT}<span class="sys">Certification Portal. Filter by product and by skill level: Foundations, Professional, Expert.</span></span></a>`+
   `<a class="it2" href="${TRAIN.catalog}" target="_blank" rel="noopener"><span><b>Partner on-demand trainings</b>${EXT}<span class="sys">Partner Experience Hub. Filter by product.</span></span></a>`+
   (onCanvas.length?`<div class="g">For the products on this canvas</div>`+onCanvas.map(o=>`<button class="it2" data-tr="${o.id}"><span>${o.title||o.name}</span><span class="cnt">${count(o.id)}</span></button>`).join(''):'')+`</div>`;
  const mh=document.querySelector('header.masthead'),before=document.body.classList.contains('picking')?mh.querySelector('.draft-actions'):document.getElementById('save-draft');
  mh.insertBefore(w,before.hidden||getComputedStyle(before).display==='none'?mh.querySelector('.draft-actions'):before);
},{CSS,CAP,EXT,CHEV,open});
// the product card: a jump link under the name, the bolder box, the levels
const cardMock=(id,openBox)=>p=>p.evaluate(({id,openBox,LEVELS,CAP})=>{
  const card=document.querySelector('.card'),d=card.querySelector('details.ready'),t=TRAIN.products[id];
  const src=t.closest||(TRAIN.products[id].exams.length?id:null),lev=LEVELS[id],exLev={...((LEVELS.aemsites||{}).exams),...Object.assign({},...Object.values(LEVELS).map(v=>v.exams))};
  const shown=t.closest?TRAIN.products[t.closest].exams:t.exams,certs=shown.filter(e=>!e.credential),own=!t.closest&&certs.length;
  const lv=[...new Set(certs.map(e=>exLev[e.url]).filter(Boolean))];
  const parts=[own?`${own} certification${own===1?'':'s'}${lv.length?': '+lv.join(', '):''}`:'No certification yet',t.courses?'Adobe courses':null,`${t.training.length} public trainings`].filter(Boolean);
  d.querySelector('summary .rs').textContent=parts.join(' · ');
  if(!card.querySelector('.trjump')){const j=document.createElement('button');j.className='trjump';j.innerHTML=`${CAP}Get your team ready <span class="n">${own?own+' certification'+(own===1?'':'s')+', ':''}courses and training</span>`;
    card.querySelector('#card-heading').insertAdjacentElement('afterend',j);}
  d.querySelectorAll('.rr').forEach(r=>{const label=r.querySelector('b').textContent;
    if(label==='Certification'||label==='Public training')r.querySelectorAll('a.out').forEach(a=>{if(a.previousElementSibling&&a.previousElementSibling.classList.contains('lv'))return;
      const L=label==='Certification'?[exLev[a.href]].filter(Boolean):(lev.training[a.href]||[]);
      if(L.length){const s=document.createElement('span');s.className='lv';s.textContent=L.join(' to ');a.insertAdjacentElement('beforebegin',s);}});
    if(label==='Adobe courses'&&!r.querySelector('small')){const s=document.createElement('small');s.textContent='Skill levels on the portal: Foundations, Professional, Expert';r.querySelector('div').appendChild(s);}});
  d.open=!!openBox;
},{id,openBox,LEVELS,CAP});
(async()=>{const b=await chromium.launch();
 const ctxFor=async(w,h,dsf=2,extra={})=>{const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:dsf,...extra});
  await ctx.route('https://abvfirefly.netlify.app/**',r=>r.fulfill({status:404,body:''}));
  await ctx.route(ORIGIN+'**',async r=>{let u=decodeURIComponent(new URL(r.request().url()).pathname);if(u.endsWith('/'))u+='index.html';const f=path.join(ROOT,'site',u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory())return r.fulfill({status:404,body:''});await r.fulfill({path:f});});return ctx;};
 const open=async(ctx,play)=>{const p=await ctx.newPage();await p.goto(ORIGIN+'index.html');await p.waitForFunction('window.READY===true');
  if(play){await p.click(`#picker [data-play="${play}"]`);await p.waitForTimeout(700);await p.keyboard.press('Escape');await p.fill('#rate','150');await p.waitForTimeout(300);}return p;};
 const shot=async(p,name,clip)=>{await p.mouse.move(2,2).catch(()=>{});await p.evaluate(()=>document.activeElement&&document.activeElement.blur());return p.screenshot({path:path.join(OUT,name),...(clip?{clip}:{})});};
 // today, for comparison
 { const p=await open(await ctxFor(1440,1000),'aem');await p.dblclick('[data-p="eds"]');await p.waitForTimeout(600);
   await p.evaluate(()=>{const c=document.querySelector('.card');c.style.maxHeight='none';c.style.overflow='visible';});await p.waitForTimeout(200);
   let r=await p.evaluate(()=>{const c=document.querySelector('.card').getBoundingClientRect();return {x:c.x,y:c.y,w:c.width,h:c.height};});
   await p.setViewportSize({width:1440,height:Math.ceil(Math.max(1000,r.y+r.h+60))});await p.waitForTimeout(250);
   r=await p.evaluate(()=>{const c=document.querySelector('.card').getBoundingClientRect();return {x:c.x,y:c.y,w:c.width,h:c.height};});
   await shot(p,'0_today_card.png',{x:Math.max(0,r.x-24),y:Math.max(0,r.y-24),width:r.w+48,height:r.h+48});await p.close(); }
 // 1. the top bar with the menu open, on a play
 { const p=await open(await ctxFor(1440,900),'aem');await topBar(true)(p);await p.waitForTimeout(200);await shot(p,'1_top_bar_menu_open.png',{x:0,y:0,width:1440,height:560});
   await topBar(false)(p);await shot(p,'1b_top_bar_closed.png',{x:0,y:0,width:1440,height:200});await p.close(); }
 // 2 and 3. the product card: jump link and bolder box, closed and open
 { const p=await open(await ctxFor(1440,1100),'aem');await topBar(false)(p);await p.dblclick('[data-p="eds"]');await p.waitForTimeout(600);await cardMock('eds',false)(p);await p.waitForTimeout(200);
   await p.evaluate(()=>{const c=document.querySelector('.card');c.style.maxHeight='none';c.style.overflow='visible';});await p.waitForTimeout(200);
   let r=await p.evaluate(()=>{const c=document.querySelector('.card').getBoundingClientRect();return {x:c.x,y:c.y,w:c.width,h:c.height};});
   await p.setViewportSize({width:1440,height:Math.ceil(Math.max(1100,r.y+r.h+60))});await p.waitForTimeout(250);
   r=await p.evaluate(()=>{const c=document.querySelector('.card').getBoundingClientRect();return {x:c.x,y:c.y,w:c.width,h:c.height};});
   await shot(p,'2_card_jump_link_and_box.png',{x:Math.max(0,r.x-24),y:Math.max(0,r.y-24),width:r.w+48,height:r.h+48});
   await cardMock('eds',true)(p);await p.evaluate(()=>{const c=document.querySelector('.card');c.style.maxHeight='none';c.style.overflow='visible';});await p.waitForTimeout(250);
   r=await p.evaluate(()=>{const d=document.querySelector('.card details.ready').getBoundingClientRect(),c=document.querySelector('.card').getBoundingClientRect();return {x:c.x,y:d.y,w:c.width,h:d.height,sy:window.scrollY};});
   await p.setViewportSize({width:1440,height:Math.ceil(Math.max(1100,r.y+r.h+60))});await p.waitForTimeout(200);
   r=await p.evaluate(()=>{const d=document.querySelector('.card details.ready').getBoundingClientRect(),c=document.querySelector('.card').getBoundingClientRect();return {x:c.x,y:d.y,w:c.width,h:d.height};});
   await shot(p,'3_box_open_with_levels.png',{x:Math.max(0,r.x-8),y:Math.max(0,r.y-16),width:r.w+16,height:r.h+40});await p.close(); }
 // 4. the first page
 { const p=await open(await ctxFor(1440,900),null);await topBar(true)(p);await p.waitForTimeout(200);await shot(p,'4_first_page_menu_open.png',{x:0,y:0,width:1440,height:430});await p.close(); }
 // 5. a phone
 { const p=await open(await ctxFor(390,844,3,{isMobile:true,hasTouch:true}),'aem');await topBar(true)(p);await p.waitForTimeout(250);await shot(p,'5_phone_menu_open.png',{x:0,y:0,width:390,height:520});await p.close(); }
 await b.close();console.log('pictures written to',OUT);})();
