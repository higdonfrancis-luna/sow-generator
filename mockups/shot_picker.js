const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [v,out] of [['picker','play_picker.png'],['canvas','play_canvas_omnichannel.png'],['change','play_change.png']]){
 const p=await b.newPage({viewport:{width:1920,height:1100}});
 await p.goto('file://'+require('path').resolve('play_picker_mock.html')+'?view='+v);await p.waitForTimeout(500);
 await p.screenshot({path:out});await p.close();}
await b.close();})();
