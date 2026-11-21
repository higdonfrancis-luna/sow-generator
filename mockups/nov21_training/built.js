// Real screens of the built "Get your team ready" (Nov 21 2026).  node built.js <repo root> <output folder>
const path=require('path'),fs=require('fs');const {chromium}=require('playwright');
const ROOT=path.resolve(process.argv[2]),OUT=path.resolve(process.argv[3]),ORIGIN='https://built.test/';
(async()=>{const b=await chromium.launch();
const ctxFor=async(w,h,x={})=>{const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,...x});await ctx.route('https://abvfirefly.netlify.app/**',r=>r.fulfill({status:404,body:''}));
 await ctx.route(ORIGIN+'**',async r=>{let u=decodeURIComponent(new URL(r.request().url()).pathname);if(u.endsWith('/'))u+='index.html';const f=path.join(ROOT,'site',u);if(!fs.existsSync(f)||fs.statSync(f).isDirectory())return r.fulfill({status:404,body:''});await r.fulfill({path:f});});return ctx;};
const open=async(ctx,play)=>{const p=await ctx.newPage();await p.goto(ORIGIN+'index.html');await p.waitForFunction('window.READY===true');if(play){await p.click(`#picker [data-play="${play}"]`);await p.waitForTimeout(700);await p.keyboard.press('Escape');await p.fill('#rate','150');await p.waitForTimeout(300);}return p;};
{const p=await open(await ctxFor(1440,900),'aem');await p.click('#tr-btn');await p.waitForTimeout(250);await p.mouse.move(700,700);await p.screenshot({path:path.join(OUT,'built_1_top_bar_menu.png'),clip:{x:0,y:0,width:1440,height:560}});
 await p.click('#tr-menu [data-tr="eds"]');await p.waitForTimeout(500);await p.mouse.move(1300,860);await p.screenshot({path:path.join(OUT,'built_3_row_opens_the_box.png')});await p.close();}
{const p=await open(await ctxFor(1440,1100),'aem');await p.dblclick('[data-p="bv"]');await p.waitForTimeout(600);await p.mouse.move(100,1000);await p.screenshot({path:path.join(OUT,'built_2_card_link_and_box.png')});await p.close();}
{const p=await open(await ctxFor(1440,900),'cja');await p.mouse.move(100,880);await p.screenshot({path:path.join(OUT,'built_5_cja_play_starts.png')});await p.close();}
{const p=await open(await ctxFor(390,844,{isMobile:true,hasTouch:true}),'aem');await p.tap('#tr-btn');await p.waitForTimeout(250);await p.screenshot({path:path.join(OUT,'built_4_phone.png'),clip:{x:0,y:0,width:390,height:560}});await p.close();}
await b.close();console.log('written');})();
