const {chromium}=require('playwright');const fs=require('fs'),path=require('path');const OUT=__dirname,img=n=>'file://'+path.join(OUT,n);
(async()=>{const b=await chromium.launch();const sz={};
{const c=await b.newContext();const p=await c.newPage();for(const n of ['w_target-cja_now.png','w_target-cja_new.png','w_commerce-eds_now.png','w_commerce-eds_new.png']){await p.goto(img(n));sz[n]=await p.evaluate(()=>({w:document.images[0].naturalWidth/2,h:document.images[0].naturalHeight/2}));}await c.close();}
const pane=(n,tag,cls)=>`<div class="col"><span class="tag ${cls}">${tag}</span><div class="pane"><img src="${img(n)}" width="${sz[n].w}"></div></div>`;
const html=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box}body{margin:0;background:#fff;color:#1c1c1c;font-family:'Source Sans 3',sans-serif}.board{padding:36px 40px 44px;width:1040px}
.eye{color:#d40e00;font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase}h1{font-size:32px;line-height:1.15;margin:6px 0 10px}
.lead{font-size:19px;line-height:1.45;margin:0 0 22px}h2{font-size:21px;margin:26px 0 12px;padding-top:16px;border-top:2px solid #1c1c1c}
.tag{display:inline-block;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:3px;margin:0 0 8px}.tag.now{background:#1c1c1c;color:#fff}.tag.new{background:#eb1000;color:#fff}
.cols{display:flex;gap:40px;align-items:flex-start}.pane{border:1.5px solid #1c1c1c;border-radius:6px;padding:10px 14px;background:#fff}.pane img{display:block}.cap{font-size:17px;line-height:1.45;margin:18px 0 0}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · flagged, not built</div><h1>Desktop: a service waiting for another product</h1>
<p class="lead">On Create your own play, a service that needs one more product squeezes its name and note into a thin column on desktop. It was like this before today's phone change. Proposed: the same arrangement as on phones, for these lines only.</p>
<h2>Target + Customer Journey Analytics card</h2><div class="cols">${pane('w_target-cja_now.png','Now','now')}${pane('w_target-cja_new.png','Proposed','new')}</div>
<h2>Commerce + Edge Delivery Services card, under More services</h2><div class="cols">${pane('w_commerce-eds_now.png','Now','now')}${pane('w_commerce-eds_new.png','Proposed','new')}</div>
<p class="cap">Three services in the whole tool show this way, all on Create your own play. Every other desktop line stays exactly as it is.</p></div></body></html>`;
fs.writeFileSync(path.join(OUT,'board_wait.html'),html);
const p=await (await b.newContext({viewport:{width:1040,height:900},deviceScaleFactor:2})).newPage();await p.goto('file://'+path.join(OUT,'board_wait.html'));await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await (await p.$('.board')).screenshot({path:path.join(OUT,'board_waiting_line.png')});await b.close();})();
