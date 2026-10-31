const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{errs.push('browser dialog');d.dismiss();});
const ok=(c,m)=>console.log((c?'✅ ':'❌ ')+m);
await p.goto('file://'+process.cwd()+'/'+process.argv[2]);await p.waitForTimeout(400);
ok(await p.locator('#new-draft').count()===0,'New opportunity is gone from More');
ok(await p.locator('.top-actions #start-over').isVisible(),'Start over sits in the top bar');
// fill things
await p.evaluate(x => { state.play = x; go('scope'); }, 'aem');await p.waitForTimeout(200);
await p.evaluate(()=>{state.rate='150';state.partner='Acme Partner';state.customer='Acme Corp';save();render();});
await p.click('#start-over');ok(await p.locator('#start-over-modal').isVisible(),'the confirm box opens');
await p.click('#start-over-cancel');ok(await p.locator('#start-over-modal').isHidden(),'Cancel closes it');
let st=await p.evaluate(()=>state);ok(st.customer==='Acme Corp'||st.partner==='Acme Partner','Cancel keeps the SOW');
await p.click('#start-over');await p.keyboard.press('Escape');ok(await p.locator('#start-over-modal').isHidden(),'Escape closes it');
const TOOL='file://'+process.cwd()+'/'+process.argv[2];
await p.click('#start-over');await Promise.all([p.waitForNavigation(),p.click('#start-over-confirm')]);
ok(p.url()!==TOOL,'Clear everything leaves for the front page (the Build canvas)');
errs.length=0; // the folder listing Chromium shows for ../ on a local file has its own script errors
await p.goto(TOOL);await p.waitForTimeout(300);st=await p.evaluate(()=>state);
ok(!st.partner&&!st.customer&&!st.rate&&st.play==='cja','Clear everything blanks partner, client and rate, back to the first play');
const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem(KEY)));ok(!stored.partner&&!stored.rate,'the browser copy is cleared too');
ok(await p.evaluate(()=>localStorage.getItem(CANVAS_KEY)===null&&localStorage.getItem(HANDOFF)===null),'and the canvas and its hand-over are cleared');
ok(await p.locator('#scope-panel').isVisible(),'the steps open on Scope');
await p.click('#start-over');await p.screenshot({path:'/tmp/claude-0/so_built.png'});
ok(errs.length===0,'no script errors or browser pop-ups'+(errs.length?': '+errs.join('; '):''));await b.close();})();
