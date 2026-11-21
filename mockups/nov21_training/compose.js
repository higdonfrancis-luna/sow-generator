// Puts the card as it is today beside the proposed card, for one picture to compare.  node compose.js <folder with the pictures>
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const DIR=path.resolve(process.argv[2]||'out');
const b64=f=>'data:image/png;base64,'+fs.readFileSync(path.join(DIR,f)).toString('base64');
const page=`<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#fff;font-family:'Source Sans 3',Arial,sans-serif;color:#1C1C1C}
.wrap{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:26px 30px 30px;width:1100px}
h1{grid-column:1/-1;font-size:24px;margin:0 0 2px}
.k{font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#3A3A3A;margin:0 0 8px}
.k.red{color:#C40000}
img{width:100%;display:block;border:1px solid #D9D9D9;border-radius:10px}
ul{margin:10px 0 0;padding-left:20px;font-size:16px;line-height:23px}
</style><div class="wrap"><h1>Product card: "Get your team ready"</h1>
<div><p class="k">Today</p><img src="${b64('0_today_card.png')}"><ul><li>One outlined box at the foot of the card, below every service</li><li>No level shown</li></ul></div>
<div><p class="k red">Proposed</p><img src="${b64('2_card_jump_link_and_box.png')}"><ul><li>A red link under the product name jumps to the box and opens it</li><li>The box is filled and outlined in red, and says which levels exist</li></ul></div></div>`;
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1160,height:900},deviceScaleFactor:2})).newPage();
 await p.setContent(page);await p.waitForTimeout(300);const el=await p.$('.wrap');await el.screenshot({path:path.join(DIR,'2b_card_today_vs_proposed.png')});await b.close();console.log('ok');})();
