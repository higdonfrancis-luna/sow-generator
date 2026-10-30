const {chromium}=require('playwright');(async()=>{const [,,src,out,h]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:+h}});
await p.goto('file://'+require('path').resolve(src));await p.waitForFunction(()=>window.PLACED===true);await p.waitForTimeout(200);await p.screenshot({path:out});await b.close();})();
