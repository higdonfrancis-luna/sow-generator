// Mockups for Adam (Nov 2): getting the SOW out, short paragraphs, phone Build cards.
// Every "now" picture is the real built site; every "proposed" picture is the real page with the proposed change injected.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const {execFileSync}=require('child_process');
const SITE='/home/user/warroom/sow/site',OUT=__dirname,PARAS=JSON.parse(fs.readFileSync(path.join(OUT,'paras.json'),'utf8'));
const server=http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0].split('#')[0]);if(u.endsWith('/'))u+='index.html';const f=path.join(SITE,u);if(!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(f).pipe(res);});
let BASE;const shot=n=>path.join(OUT,n);const wait=(p,ms=400)=>p.waitForTimeout(ms);
async function start(b,play,{w=1440,h=900,mobile=false}={}){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:mobile,hasTouch:mobile});const p=await ctx.newPage();
  p.on('pageerror',e=>console.log('PAGE ERROR',e.message));
  await p.goto(BASE);await wait(p);await p.click(`#picker [data-play="${play}"]`);await wait(p);await p.fill('#rate','150');await wait(p,250);return {ctx,p};}
async function toSow(p){await p.click('#save');await p.waitForURL('**/sow/#scope');await wait(p);
  await p.evaluate(()=>{state.customer='Northwind Bank';state.partner='Contoso Digital';state.terms='Time and materials, invoiced monthly in arrears; five business days to review each deliverable; changes by written change order under the master services agreement.';save();});}
const PHONE_CSS='@media (max-width:600px){.ln{grid-template-columns:auto 1fr 30px;row-gap:3px}.ln .nm{grid-column:1/-1}.ln .hr{text-align:left}.ln.lock{grid-template-columns:auto 1fr}.ln.lock.can{grid-template-columns:auto 1fr auto}}';

(async()=>{await new Promise(r=>server.listen(0,r));BASE=`http://localhost:${server.address().port}/`;const b=await chromium.launch();const report={};

/* ---------- A. getting the SOW out (CJA play) ---------- */
{const {ctx,p}=await start(b,'cja');await toSow(p);await p.click('[data-step="document"]');await wait(p,500);
 report.readiness=await p.evaluate(()=>renderReadiness().length);
 // now: header with More open, and the SOW step's own buttons
 await p.click('header details.more summary');await wait(p,200);
 await p.mouse.move(600,700);await wait(p,150);await p.screenshot({path:shot('a_now.png'),clip:{x:0,y:0,width:1440,height:310}});
 await p.click('header details.more summary');await wait(p,200);
 // today's PDF (Print / PDF), page 1
 await p.pdf({path:shot('a_today.pdf'),printBackground:true,preferCSSPageSize:true});
 execFileSync('pdftoppm',['-r','192','-f','1','-l','1','-png',shot('a_today.pdf'),shot('a_pdf')]);
 // the email text, written from the tool's own lines and totals
 const mail=await p.evaluate(()=>{const m=n=>'$'+Number(n).toLocaleString('en-US',{maximumFractionDigits:2});const T=totals();
   const play=document.querySelector('.play-title, #play-title, h1')?.textContent.trim();
   const lines=selectedLines().map(l=>'- '+l.name+': '+m(l.fee)+(l.cadence==='monthly'?' a month':' one-time'));
   const subject='Draft SOW for '+state.customer+': '+play;
   const body=['Hello,','','Attached is the draft statement of work from '+state.partner+' for '+state.customer+': '+play+'.','','Services',...lines,'',
     'Illustrative fees at '+m(state.rate||selectedLines()[0].rate)+' an hour: '+m(T.oneFee)+' one-time plus '+m(T.monthFee)+' a month for '+T.months+' months, '+m(T.totalFee)+' for the implementation and the '+T.months+'-month term.',
     'The hours are planning assumptions, not a quote. Please review the attached SOW and send us any changes.','','Thank you,',state.partner].join('\n');
   return {subject,body,play,slug:slug()};});
 report.mail=mail;
 const mailto='mailto:?subject='+encodeURIComponent(mail.subject)+'&body='+encodeURIComponent(mail.body.replace(/\n/g,'\r\n'));
 report.mailtoLength=mailto.length;
 // proposed: Download template gone, Services CSV beside the other exports, Email SOW added
 await p.evaluate(()=>{document.querySelector('header details.more').remove();const acts=document.querySelector('#document-panel .top-actions'),mk=t=>{const x=document.createElement('button');x.textContent=t;return x;};
   acts.insertBefore(mk('Services CSV'),document.getElementById('download-sow'));acts.insertBefore(mk('Email SOW'),document.getElementById('print-sow'));});
 await p.mouse.move(600,700);await wait(p,200);await p.screenshot({path:shot('a_new.png'),clip:{x:0,y:0,width:1440,height:310}});
 // proposed: the Email SOW dialog, in the style of the Start over dialog
 await p.evaluate(m=>{const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');const css=document.createElement('style');css.textContent='.email-card{width:640px!important}.email-card .mail-box{border:1.5px solid var(--ink);border-radius:6px;background:#f5f5f5;padding:12px 14px;margin:14px 0 4px;font-size:15px;line-height:1.45;max-height:300px;overflow:auto;white-space:pre-wrap}.email-card .mail-box b{display:block;margin-bottom:8px}.email-card .start-over-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:16px}';document.head.appendChild(css);
   const d=document.createElement('div');d.className='modal';d.id='email-modal';d.innerHTML='<div class="modal-card start-over-card email-card"><h2>Email this SOW</h2><p>Your email opens with this subject and summary already written. Attach the PDF, then send it from your own email. Nothing is sent from this site.</p><div class="mail-box"><b>Subject: '+esc(m.subject)+'</b>'+esc(m.body)+'</div><div class="start-over-actions"><button>Copy text</button><button>Save as PDF</button><button class="primary">Open email</button></div></div>';document.body.appendChild(d);},mail);
 await wait(p,300);const box=await p.$eval('#email-modal .modal-card',e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
 await p.screenshot({path:shot('a_dialog.png'),clip:{x:box.x,y:box.y,width:box.width,height:box.height}});
 fs.writeFileSync(shot('mail.json'),JSON.stringify(mail,null,1));
 await ctx.close();}

/* ---------- B. the three long assumptions, as the PDF lays them out ---------- */
for(const [play,ids] of [['aem',['SO1','SO2']],['fsi',['F02']]]){const {ctx,p}=await start(b,play);await toSow(p);await p.click('[data-step="document"]');await wait(p,500);
 report['ready_'+play]=await p.evaluate(()=>renderReadiness().map(x=>typeof x==='string'?x:(x.text||x.label||JSON.stringify(x)).slice(0,120)));
 await p.setViewportSize({width:673,height:1000});await p.emulateMedia({media:'print'});await p.evaluate(()=>document.body.classList.remove('not-ready'));await wait(p,300);
 const block=async(id,file)=>{const h=await p.evaluateHandle(name=>{const s=[...document.querySelectorAll('#sow-preview .sow-service')].find(x=>x.querySelector('h3').textContent.includes(name));return [...s.querySelectorAll('.sow-detail')].find(d=>d.querySelector('h4').textContent==='Assumptions');},await p.evaluate(i=>selectedLines().find(l=>l.id===i).name,id));
   await h.asElement().screenshot({path:shot(file)});const r=await h.evaluate(e=>Math.round(e.getBoundingClientRect().height));return r;};
 for(const id of ids){report['h_now_'+id]=await block(id,'b_now_'+id+'.png');}
 await p.evaluate(([play,P])=>{for(const [id,paras] of Object.entries(P)){const r=state.estimates?.[play]?.[id];if(r)r.assumptions=paras.join('\n\n');}renderDocument();document.body.classList.remove('not-ready');},[play,PARAS]);await wait(p,300);
 for(const id of ids){report['h_new_'+id]=await block(id,'b_new_'+id+'.png');}
 report['name_'+play]=await p.evaluate(ids=>ids.map(i=>selectedLines().find(l=>l.id===i).name),ids);
 await ctx.close();}

/* ---------- C. phone Build cards, and desktop unchanged ---------- */
{const {ctx,p}=await start(b,'aem',{w:390,h:844,mobile:true});
 // a line changed on Services, and the prompt count changed on Scope, so both notes show
 await toSow(p);await p.fill('[data-cover="promptCount"]','2000');await p.press('[data-cover="promptCount"]','Tab');await wait(p,300);
 await p.click('[data-step="services"]');await wait(p,500);
 const target=await p.evaluate(()=>{const ids=['O02','L02','C03'];for(const i of ids){const e=document.querySelector(`article.service-card[data-line="${i}"] input[data-line-field="hours"]`);if(e)return {id:i,hours:e.value};}return null;});
 report.phoneEdit=target;
 const inp=`article.service-card[data-line="${target.id}"] input[data-line-field="hours"]`;await p.fill(inp,String(Number(target.hours)+8));await p.press(inp,'Tab');await wait(p,300);
 await p.click('.steps [data-build]');await p.waitForURL(u=>!u.pathname.includes('/sow'));await wait(p,700);
 const openBV=async()=>{await p.evaluate(()=>document.querySelector('.node[data-p="bv"]').click());await wait(p,500);await p.evaluate(()=>{const c=document.getElementById('card');window.scrollTo(0,c.getBoundingClientRect().top+scrollY-16);});await wait(p,300);};
 await openBV();report.phoneCardLines=await p.evaluate(()=>[...document.querySelectorAll('#card .ln')].map(l=>l.innerText.replace(/\s+/g,' ').trim()));
 await p.screenshot({path:shot('c_now.png')});
 await p.addStyleTag({content:PHONE_CSS});await wait(p,300);await p.evaluate(()=>{const c=document.getElementById('card');window.scrollTo(0,c.getBoundingClientRect().top+scrollY-16);});await wait(p,300);
 await p.screenshot({path:shot('c_new.png')});
 report.phoneWidth=await p.evaluate(()=>document.documentElement.scrollWidth);
 await ctx.close();}
{const {ctx,p}=await start(b,'aem');await wait(p,300);await p.evaluate(()=>document.querySelector('.node[data-p="bv"]').click());await wait(p,500);
 const c=await p.$('#card');await c.screenshot({path:shot('d_before.png')});await p.addStyleTag({content:PHONE_CSS});await wait(p,300);await c.screenshot({path:shot('d_after.png')});
 report.desktopSame=Buffer.compare(fs.readFileSync(shot('d_before.png')),fs.readFileSync(shot('d_after.png')))===0;
 await ctx.close();}
console.log(JSON.stringify(report,null,1));await b.close();server.close();})();
