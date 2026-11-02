const {chromium}=require('playwright');const fs=require('fs'),path=require('path');const OUT=__dirname,img=n=>'file://'+path.join(OUT,n);
(async()=>{const b=await chromium.launch();const sz={};
{const c=await b.newContext();const p=await c.newPage();for(const n of ['cov_off.png','cov_on.png']){await p.goto(img(n));sz[n]=await p.evaluate(()=>({w:document.images[0].naturalWidth/2,h:document.images[0].naturalHeight/2}));}await c.close();}
const html=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box}body{margin:0;background:#fff;color:#1c1c1c;font-family:'Source Sans 3',sans-serif}.board{padding:36px 40px 40px;width:1080px}
.eye{color:#d40e00;font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase}h1{font-size:32px;line-height:1.15;margin:6px 0 10px}
.lead{font-size:19px;line-height:1.45;margin:0 0 20px}.cols{display:flex;gap:40px;align-items:flex-start}.col{width:${sz['cov_off.png'].w}px}
.tag{display:inline-block;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:3px;margin:0 0 8px;background:#1c1c1c;color:#fff}
.shot{display:block;border:1.5px solid #1c1c1c;border-radius:6px}.cap{font-size:17px;line-height:1.45;margin:10px 0 0}.cap b{font-weight:700}
h2{font-size:21px;margin:28px 0 10px;padding-top:16px;border-top:2px solid #1c1c1c}ul{margin:0;padding-left:20px;font-size:17px;line-height:1.45}li{margin:6px 0}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · mockup, not built</div><h1>Outside systems are counted once</h1>
<p class="lead">An outside system's own line counts only when no service already on the canvas covers that work. When one does, the line shows as covered and adds nothing, the way generic Coworker Skills already show as replaced by specialized ones.</p>
<div class="cols"><div class="col"><span class="tag">CJA's own data preparation off</span><img class="shot" src="${img('cov_off.png')}" width="${sz['cov_off.png'].w}"><p class="cap">The CJA play assumes the customer already uses CJA, so its data-preparation service starts off. Bringing in the warehouse is new work: <b>$8,400</b>. Total <b>$228,000</b>.</p></div>
<div class="col"><span class="tag">Turned on by the partner</span><img class="shot" src="${img('cov_on.png')}" width="${sz['cov_on.png'].w}"><p class="cap">CJA data preparation already includes setting up ingestion, so the warehouse line adds <b>$0</b>. Total <b>$231,600</b>: data preparation's $12,000, counted once.</p></div></div>
<h2>The same rule everywhere an existing service already covers the work</h2><ul>
<li><b>CRM to Marketo Engage:</b> covered by CRM sync and field mapping, which Marketo starts with.</li>
<li><b>Data warehouse, cloud storage or CRM to Real-Time CDP:</b> covered by Data sources and ingestion setup.</li>
<li><b>Any source to Journey Optimizer:</b> covered by Journey events, data sources and actions.</li>
<li><b>CDN to Brand Visibility:</b> Brand Visibility setup already gets log forwarding done with the customer's IT team, so the CDN lines start off and count only when the partner does that CDN work itself.</li></ul>
</div></body></html>`;
fs.writeFileSync(path.join(OUT,'board_covered.html'),html);
const p=await (await b.newContext({viewport:{width:1080,height:900},deviceScaleFactor:2})).newPage();await p.goto('file://'+path.join(OUT,'board_covered.html'));await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await (await p.$('.board')).screenshot({path:path.join(OUT,'outside_counted_once.png')});await b.close();})();
