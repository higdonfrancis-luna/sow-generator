// Composes the three boards from the captured pictures, at true size (CSS pixels = real pixels), rendered at 2x.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const OUT=__dirname,img=n=>'file://'+path.join(OUT,n),mail=JSON.parse(fs.readFileSync(path.join(OUT,'mail.json'),'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const FONT='<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">';
const BASE_CSS=`*{box-sizing:border-box}body{margin:0;background:#fff;color:#1c1c1c;font-family:'Source Sans 3',sans-serif}
.board{padding:36px 40px 44px}.eye{color:#d40e00;font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase}
h1{font-size:34px;line-height:1.15;margin:6px 0 10px}.lead{font-size:19px;line-height:1.45;margin:0 0 26px;max-width:1180px}
h2{font-size:22px;margin:30px 0 12px;padding-top:18px;border-top:2px solid #1c1c1c}
.tag{display:inline-block;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:3px;margin:0 0 8px}
.tag.now{background:#1c1c1c;color:#fff}.tag.new{background:#eb1000;color:#fff}
.cap{font-size:17px;line-height:1.45;margin:8px 0 22px;max-width:1180px}.cap b{font-weight:700}
.shot{display:block;border:1.5px solid #1c1c1c;border-radius:6px;background:#fff}
.cols{display:flex;gap:40px;align-items:flex-start}.col{flex:0 0 auto}`;
async function render(b,html,file,{width,selector}={}){const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:2});const p=await ctx.newPage();
  const f=path.join(OUT,file.replace('.png','.html'));fs.writeFileSync(f,html);await p.goto('file://'+f);await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  if(selector)await (await p.$(selector)).screenshot({path:path.join(OUT,file)});else await p.screenshot({path:path.join(OUT,file),fullPage:true});await ctx.close();}
const size=async(b,n)=>{const ctx=await b.newContext();const p=await ctx.newPage();await p.goto(img(n));const s=await p.evaluate(()=>({w:document.images[0].naturalWidth/2,h:document.images[0].naturalHeight/2}));await ctx.close();return s;};

(async()=>{const b=await chromium.launch();
/* the partner's own email app, as Email SOW would open it (generic, no product look) */
const CLIP='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/></svg>';
const LINE=d=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2.2" stroke-linecap="round">${d}</svg>`;
await render(b,`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#fff;font-family:Carlito,sans-serif;color:#1c1c1c}
.win{width:640px;border:1.5px solid #1c1c1c;border-radius:8px;overflow:hidden;box-shadow:0 10px 30px #0002;background:#fff}
.bar{display:flex;justify-content:space-between;align-items:center;background:#e9e9e9;padding:9px 14px;font-size:16px;font-weight:700;border-bottom:1.5px solid #1c1c1c}.ctl{display:flex;gap:14px}
.row{display:flex;gap:12px;padding:9px 14px;border-bottom:1px solid #c8c8c8;font-size:16px}.row label{width:58px;font-weight:700}
.att{margin:10px 14px 0;display:inline-flex;gap:8px;align-items:center;border:1.5px dashed #eb1000;border-radius:5px;padding:5px 10px;font-size:15px}.att em{font-style:normal;font-weight:700;color:#d40e00}
.body{padding:12px 14px 6px;font-size:16px;line-height:1.42;white-space:pre-wrap}.foot{padding:6px 14px 14px}.send{background:#1c1c1c;color:#fff;border:0;border-radius:4px;font:700 15px Carlito,sans-serif;padding:8px 18px}</style></head><body>
<div class="win"><div class="bar"><span>New message</span><span class="ctl">${LINE('<path d="M5 12h14"/>')}${LINE('<rect x="5" y="5" width="14" height="14" rx="1"/>')}${LINE('<path d="M6 6l12 12M18 6L6 18"/>')}</span></div>
<div class="row"><label>To</label><span></span></div><div class="row"><label>Subject</label><span>${esc(mail.subject)}</span></div>
<div class="att">${CLIP}${esc(mail.slug)}.pdf <em>the partner attaches the PDF</em></div>
<div class="body">${esc(mail.body)}</div><div class="foot"><button class="send">Send</button></div></div></body></html>`,'a_compose.png',{width:720,selector:'.win'});

/* board A: getting the SOW out */
const dlg=await size(b,'a_dialog.png'),cmp=await size(b,'a_compose.png');
await render(b,`<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE_CSS}
.list{font-size:17px;line-height:1.45;margin:0;padding:0;list-style:none;max-width:780px}.list li{padding:12px 0;border-top:1px solid #c8c8c8}.list li:first-child{border-top:0;padding-top:0}.list b{display:block;font-size:18px}
.list .new b::after{content:'NEW';margin-left:8px;font-size:12px;letter-spacing:1.5px;background:#eb1000;color:#fff;padding:2px 6px;border-radius:3px;vertical-align:2px}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · mockup, not built</div><h1>Getting the finished SOW out</h1>
<p class="lead">Partners can already take their SOW with them three ways: <b>Download SOW</b>, <b>Print / PDF</b> and <b>Services CSV</b>. There is no email option yet. <b>Download template</b> is something else: a blank copy of the builder, not their SOW.</p>
<h2>The Statement of work step</h2>
<span class="tag now">Now</span><img class="shot" src="${img('a_now.png')}" width="1440"><p class="cap">Download template and Services CSV sit under More (shown open).</p>
<span class="tag new">Proposed</span><img class="shot" src="${img('a_new.png')}" width="1440"><p class="cap">Download template goes. Services CSV moves beside Download SOW, so the More menu goes. <b>Email SOW</b> is new.</p>
<h2>Email SOW</h2>
<div class="cols"><div class="col" style="width:${dlg.w}px"><span class="tag new">Proposed</span><img src="${img('a_dialog.png')}" width="${dlg.w}" style="display:block;border-radius:8px;box-shadow:0 10px 30px #0003"><p class="cap"><b>1.</b> Email SOW opens this. The summary is written from the SOW's own services and fees. <b>Copy text</b> is for partners who use email in a browser.</p></div>
<div class="col" style="width:${cmp.w}px"><span class="tag new">What opens</span><img src="${img('a_compose.png')}" width="${cmp.w}" style="display:block"><p class="cap"><b>2.</b> Open email opens the partner's own email app (Outlook, Gmail or Mail) with this filled in. They attach the PDF and send it themselves. A website can't attach a file to an email, and nothing about the client leaves their computer.</p></div></div>
<h2>What each one gives</h2>
<div class="cols"><div class="col"><span class="tag now">Print / PDF today, page 1</span><img class="shot" src="${img('a_pdf-1.png')}" width="560"></div>
<div class="col" style="flex:1"><ul class="list">
<li><b>Download SOW</b>${esc(mail.slug)}.html: the SOW as a web page that opens in any browser.</li>
<li><b>Print / PDF</b>A PDF of the same SOW (page 1 at left). Proposed: the file is named ${esc(mail.slug)}.pdf; today it takes the site's page title.</li>
<li><b>Services CSV</b>${esc(mail.slug)}.csv: each service's hours, rate, fee and texts, for a spreadsheet.</li>
<li class="new"><b>Email SOW</b>Opens the partner's own email with the subject and summary written. They attach the PDF.</li>
<li><b>Save draft</b>${esc(mail.slug)}.json: for picking the work back up with Open draft, not for sending.</li></ul></div></div>
</div></body></html>`,'board_sow_out.png',{width:1520});

/* board B: short paragraphs */
const rows=[['SO1','Sites Optimizer setup','AEM play'],['SO2','Monthly SEO fixes with Sites Optimizer','AEM play'],['F02','Implement Brand Concierge','FSI play']];
await render(b,`<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE_CSS}.pane{width:708px;padding:14px 16px;border:1.5px solid #1c1c1c;border-radius:6px}.pane img{display:block}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · mockup, not built</div><h1>The three longest descriptions, in short paragraphs</h1>
<p class="lead">Same words, only paragraph breaks. These are the Assumptions of three services, about 250 words each, as the PDF lays them out. The breaks would also show in the edit box on the Services step, the downloaded SOW and the CSV.</p>
${rows.map(([id,name,play])=>`<h2>${esc(name)} <span style="font-weight:400">(${play})</span></h2><div class="cols"><div class="col"><span class="tag now">Now</span><div class="pane"><img src="${img('b_now_'+id+'.png')}" width="673"></div></div><div class="col"><span class="tag new">Proposed</span><div class="pane"><img src="${img('b_new_'+id+'.png')}" width="673"></div></div></div>`).join('')}
<p class="cap" style="margin-top:22px">The PDF gets a little longer: about a third of a page in the AEM play, a tenth in the FSI play. The facts and the hours don't change.</p>
</div></body></html>`,'board_paragraphs.png',{width:1560});

/* board C: phones */
await render(b,`<!doctype html><html><head><meta charset="utf-8">${FONT}<style>${BASE_CSS}.phone{border:10px solid #1c1c1c;border-radius:34px;overflow:hidden;width:410px}.phone img{display:block}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · mockup, not built</div><h1>Phones: the service cards on Build</h1>
<p class="lead">Only at phone width (600 pixels and narrower). Each service's name and note get a full row; hours, fee and the X sit beneath. Brand Visibility card, AEM play, with one line changed on Services and the prompt count changed on Scope.</p>
<div class="cols" style="gap:60px"><div class="col"><span class="tag now">Now</span><div class="phone"><img src="${img('c_now.png')}" width="390"></div></div><div class="col"><span class="tag new">Proposed</span><div class="phone"><img src="${img('c_new.png')}" width="390"></div></div></div>
<p class="cap" style="margin-top:22px"><b>Desktop: unchanged.</b> Checked: with this change the desktop card is the same, pixel for pixel.</p>
</div></body></html>`,'board_phone.png',{width:1000});
await b.close();})();
