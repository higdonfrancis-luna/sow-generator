const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
async function shot(on,out,hover){const p=await b.newPage({viewport:{width:1920,height:1100}});
 await p.addInitScript(([k,on])=>{localStorage.setItem(k,JSON.stringify({on,ls:{},rate:200,size:'base'}));},['abv-build-canvas-prototype-v1',on]);
 await p.goto('file://'+require('path').resolve('canvas/index.html'));await p.waitForTimeout(900);
 if(hover){await p.click('.ib[data-c="'+hover+'"]');await p.waitForTimeout(600);}
 await p.screenshot({path:out});await p.close();}
const all=['rtcdp','ajo','target','cja','marketo','workfront','bv','so','commerce','eds','bc','cw'];
await shot(['rtcdp','ajo','target'],'mockups/conn_rtcdp_ajo_target.png','rtcdp-ajo');
await shot(['ajo','bc'],'mockups/conn_no_services.png','ajo-bc');
await shot(['marketo','workfront'],'mockups/conn_marketo_workfront.png','marketo-workfront');
await shot(all,'mockups/conn_all12.png');
await shot(['rtcdp','ajo','target','cja','commerce','eds'],'mockups/conn_six.png');
await b.close();})();
