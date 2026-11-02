const {chromium}=require('playwright');const fs=require('fs'),path=require('path');const OUT=__dirname,img=n=>'file://'+path.join(OUT,n);
(async()=>{const b=await chromium.launch();const sz={};
{const c=await b.newContext();const p=await c.newPage();for(const n of ['m_canvas_crop.png','m_menu.png','m_card_cdn-bv.png','m_card_dwh-cja.png']){await p.goto(img(n));sz[n]=await p.evaluate(()=>({w:document.images[0].naturalWidth/2,h:document.images[0].naturalHeight/2}));}await c.close();}
const html=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box}body{margin:0;background:#fff;color:#1c1c1c;font-family:'Source Sans 3',sans-serif}.board{padding:36px 40px 44px;width:1520px}
.eye{color:#d40e00;font-weight:700;letter-spacing:2px;font-size:14px;text-transform:uppercase}h1{font-size:34px;line-height:1.15;margin:6px 0 10px}
.lead{font-size:19px;line-height:1.45;margin:0 0 22px;max-width:1240px}h2{font-size:22px;margin:28px 0 12px;padding-top:16px;border-top:2px solid #1c1c1c}
.cols{display:flex;gap:40px;align-items:flex-start}.shot{display:block;border:1.5px solid #1c1c1c;border-radius:6px}.cap{font-size:17px;line-height:1.45;margin:10px 0 0;max-width:1240px}
.panel{flex:1;font-size:17px;line-height:1.45}.panel h3{font-size:19px;margin:0 0 8px}.panel ul{margin:0 0 16px;padding-left:20px}.panel li{margin:6px 0}.panel b{font-weight:700}.panel p{margin:0 0 12px}</style></head><body><div class="board">
<div class="eye">Partner SOW tool · mockup, not built</div><h1>Outside systems on the Build canvas</h1>
<p class="lead">Off by default in every play. A partner adds the customer's own systems with <b>Add outside system</b>. Each one connects only through a route Adobe documents, and brings its services and what the customer owns. Shown on the CJA play with a CDN and a data warehouse added.</p>
<h2>The canvas</h2><img class="shot" src="${img('m_canvas_crop.png')}" width="${sz['m_canvas_crop.png'].w}">
<p class="cap">Outside systems are dashed boxes with a dark top and an OUTSIDE ADOBE tag, so nobody mistakes them for Adobe products. The total includes their services once added.</p>
<h2>Adding one, and its card</h2><div class="cols"><div><img class="shot" src="${img('m_menu.png')}" width="${sz['m_menu.png'].w}"><p class="cap" style="max-width:${sz['m_menu.png'].w}px">The menu lists only systems that connect to the play's products, with the systems Adobe names for each route.</p></div>
<div><img class="shot" src="${img('m_card_cdn-bv.png')}" width="${sz['m_card_cdn-bv.png'].w}"><p class="cap" style="max-width:${sz['m_card_cdn-bv.png'].w}px">The customer's IT team sets up log forwarding, as the SOW says today, so the partner lines start off. They come on if the partner does that work.</p></div></div>
<h2>A data warehouse, with its license note</h2><div class="cols"><div><img class="shot" src="${img('m_card_dwh-cja.png')}" width="${sz['m_card_dwh-cja.png'].w}"></div>
<div class="panel"><h3>First version: four outside systems for the CJA play, checked against Adobe's pages</h3><ul>
<li><b>CDN to Brand Visibility.</b> Log forwarding guides for Akamai, Cloudflare, Amazon CloudFront, Fastly and Imperva; files from any other CDN or log store. Without it the Agentic Traffic dashboard can't display metrics.</li>
<li><b>Data warehouse to CJA.</b> Data Mirror keeps Snowflake, Google BigQuery or Azure Databricks tables in sync; it needs CJA Select, Prime or Ultimate. Other warehouse connectors need separate licensing.</li>
<li><b>Cloud storage to CJA.</b> Amazon S3, Azure Blob Storage, Azure Data Lake Storage Gen2, Google Cloud Storage and SFTP, through Experience Platform sources; included with a CJA license.</li>
<li><b>CRM to CJA.</b> Salesforce and Microsoft Dynamics 365 through Experience Platform sources; included with a CJA license.</li></ul>
<h3>Rules</h3><ul><li>Only routes Adobe documents, each with its source link.</li><li>License needs show on the card. No software prices.</li><li>The customer's own work shows under Before it works and in the SOW's dependencies.</li><li>No double counting: Brand Visibility setup already coordinates log forwarding.</li></ul>
<p>Hours shown are proposed planning assumptions. The other plays' routes (Edge Delivery, Real-Time CDP, Journey Optimizer, AEM Assets, Marketo) are being checked the same way.</p></div></div>
</div></body></html>`;
fs.writeFileSync(path.join(OUT,'board_outside.html'),html);
const p=await (await b.newContext({viewport:{width:1520,height:900},deviceScaleFactor:2})).newPage();await p.goto('file://'+path.join(OUT,'board_outside.html'));await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await (await p.$('.board')).screenshot({path:path.join(OUT,'outside_systems_mockup.png')});await b.close();})();
