const {chromium}=require('playwright');
const X='<svg width="12" height="12" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>';
const CK='<svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="#EB1000" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PL='<svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#1C1C1C" stroke-width="2.8" stroke-linecap="round"/></svg>';
const EXT='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const RINGS='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EB1000" stroke-width="2.4"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>';
(async()=>{const b=await chromium.launch();
async function scene(file,fn){const p=await b.newPage({viewport:{width:1920,height:1300}});await p.goto('file://'+process.cwd()+'/index.html');await p.waitForTimeout(250);
 await p.click('#add-btn');for(const id of ['bv','cja','rtcdp','ajo','target']){await p.click(`#add-menu [data-p="${id}"]`);await p.waitForTimeout(120);}
 await p.mouse.click(10,1290);await p.waitForTimeout(700);
 await p.evaluate(()=>{const s=document.getElementById('stage');s.style.transition='none';s.style.transform='translate(90px,150px) scale(1)';
  const css=document.createElement('style');css.textContent=`
  .ucchip{position:absolute;right:200px;top:18px;display:flex;align-items:center;gap:9px;border:2px solid #EB1000;border-radius:999px;background:#fff;padding:8px 16px;font-weight:700;font-size:16px;color:#1C1C1C;z-index:45}
  .ucpanel{position:absolute;right:200px;top:66px;width:640px;z-index:45;background:#fff;border:2px solid #1C1C1C;border-top:6px solid #EB1000;border-radius:8px;padding:12px 18px 12px}
  .ucpanel .k{font-size:13px;font-weight:700;letter-spacing:1.5px;color:#C40000;text-transform:uppercase}
  .ucpanel h4{font-size:20px;margin:3px 0 2px}.ucpanel .how{font-size:15px;line-height:20px;color:#3A3A3A;margin:0 0 6px}
  .ucg{font-size:12.5px;font-weight:700;letter-spacing:1.4px;color:#3A3A3A;margin:10px 0 2px}
  .ucr{display:grid;grid-template-columns:1fr auto 30px;gap:10px;align-items:center;padding:6px 6px;border-top:1px solid #D9D9D9;font-size:15.5px;line-height:20px}
  .ucr.hov{background:#F5F5F5;border-radius:4px}
  .ucr .pt{display:flex;gap:5px;flex-wrap:nowrap}.ucr .pt span{font-size:12px;font-weight:600;border:1.2px solid #3A3A3A;border-radius:3px;padding:0 5px;line-height:17px}
  .ucr b{font-weight:700}
  .ucx{margin:2px 0 8px 6px;padding:2px 0 6px 12px;border-left:3px solid #EB1000}
  .ucx .src{display:inline-flex;align-items:center;gap:5px;font-size:13.5px;color:#3A3A3A;margin:2px 0 4px}
  .ucx .ln{grid-template-columns:1fr 50px 90px}
  .tagx{display:inline-block;font-size:10.5px;font-weight:700;letter-spacing:1.1px;border:1.5px solid #EB1000;color:#EB1000;border-radius:3px;padding:0 5px;margin-left:6px;vertical-align:1px}
  .hull{position:absolute;border:3px dashed #EB1000;border-radius:14px;pointer-events:none}
  .hull-l{position:absolute;font-weight:700;font-size:15px;color:#C40000;white-space:nowrap}
  .band{position:absolute;border:2.5px dashed #1C1C1C;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font-weight:700;font-size:15.5px}
  .band.hot{border-color:#EB1000;border-style:solid}
  .fcard{position:absolute;width:480px;z-index:45;background:#fff;border:2px solid #1C1C1C;border-top:6px solid #EB1000;border-radius:8px;padding:12px 18px}
  .fcard .k{font-size:13px;font-weight:700;letter-spacing:1.5px;color:#C40000;text-transform:uppercase}.fcard h4{font-size:20px;margin:3px 0 4px}
  .fcard .how{font-size:15px;line-height:20px;color:#3A3A3A;margin:0 0 8px}
  .fcard .used{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 6px;font-size:14px;align-items:center}.fcard .used span{font-size:12.5px;font-weight:600;border:1.2px solid #3A3A3A;border-radius:3px;padding:0 6px}
  .fcard .ln{grid-template-columns:1fr 50px 90px}
  .fcard .sub{font-size:12.5px;font-weight:700;letter-spacing:1.4px;color:#3A3A3A;margin:12px 0 2px}
  .fcard .rep{display:grid;grid-template-columns:1fr auto;gap:10px;font-size:15px;padding:5px 0;border-top:1px solid #D9D9D9}
  `;document.head.appendChild(css);});
 await fn(p);await p.screenshot({path:file});await p.close();}

// A: use cases light up
await scene('/tmp/claude-0/uc/A.png',async p=>{await p.evaluate(({X,CK,PL,EXT,RINGS})=>{
  const cv=document.getElementById('canvas'),st=document.getElementById('stage');
  const row=(n,prods,on,hov)=>`<div class="ucr${hov?' hov':''}"><b>${n}</b><div class="pt">${prods.map(x=>`<span>${x}</span>`).join('')}</div><button class="tg${on?'':' add'}">${on?X:PL}</button></div>`;
  const R='Real-Time CDP',J='Journey Optimizer',T='Target';
  const svc=(n,h,tag)=>`<div class="ln"><span class="nm">${n}${tag?`<span class="tagx">${tag}</span>`:''}</span><span class="hr">${h} h</span><span class="fee">$${(h*150).toLocaleString('en-US')}</span></div>`;
  const chip=document.createElement('div');chip.className='ucchip';chip.innerHTML=RINGS+'9 use cases unlocked';cv.appendChild(chip);
  const pn=document.createElement('div');pn.className='ucpanel';pn.innerHTML=`<div class="k">Use cases on this canvas</div><h4>Unlocked by Real-Time CDP, Journey Optimizer and Target</h4><p class="how">From Adobe's use case patterns. Add the ones the client wants; hover one to light up its products.</p>
   <div class="ucg">CAMPAIGNS AND JOURNEYS (4)</div>${row('Batch outbound message activation',[R,J])}${row('Event-triggered messaging',[R,J])}${row('Multi-step orchestrated journey',[R,J],true,true)}
   <div class="ucx"><span class="src">Experience League: Multi-step orchestrated journey ${EXT}</span>
    ${svc('Use case design and success measures',24)}${svc('Audiences and events for the journey',40)}${svc('Journey build across channels',64)}${svc('End-to-end test and launch',32)}${svc('First readout in CJA',16,'CJA ON CANVAS')}
    <div class="ft" style="font-size:15px"><span>5 services, example hours</span><span>$26,400</span></div></div>
   ${row('Cross-channel journey with decisioning',[R,J])}
   <div class="ucg">PERSONALIZATION (5)</div>${row('Anonymous visitor web personalization',[R,J])}${row('Known-visitor web and app personalization',[R,J])}${row('Offer decisioning',[R,J])}${row('Behavioral recommendation',[R,J])}${row('Audience sharing with Target',[R,T],true)}
   <div class="ft" style="margin-top:6px"><span>2 added, example hours</span><span>+$34,800</span></div>`;cv.appendChild(pn);
  const h=document.createElement('div');h.className='hull';h.style.cssText+='left:-16px;top:62px;width:262px;height:252px';st.appendChild(h);
  const l=document.createElement('div');l.className='hull-l';l.style.cssText='left:-14px;top:36px';l.textContent='Multi-step orchestrated journey';st.appendChild(l);
  document.getElementById('t-big').textContent='$637,200';document.getElementById('t-sub').textContent='$248,400 one-time + $32,400 a month';
  document.getElementById('hint').textContent='5 products, 4 connections, 9 use cases unlocked. Hover a product, an i or a use case to see its services.';
 },{X,CK,PL,EXT,RINGS});});

// B: shared setup counted once
await scene('/tmp/claude-0/uc/B.png',async p=>{await p.evaluate(({EXT})=>{
  const cv=document.getElementById('canvas'),st=document.getElementById('stage');
  const band=document.createElement('div');band.className='band hot';band.style.cssText+='left:-16px;top:476px;width:632px;height:50px';
  band.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB1000" stroke-width="2.4" stroke-linecap="round"><path d="M3 18h18M5 18V9M12 18V6M19 18v-7"/></svg>Shared Experience Platform setup, counted once';st.appendChild(band);
  const ln=(n,h)=>`<div class="ln"><span class="nm">${n}<a class="src" href="#">${EXT}</a></span><span class="hr">${h} h</span><span class="fee">$${(h*150).toLocaleString('en-US')}</span></div>`;
  const fc=document.createElement('div');fc.className='fcard';fc.style.cssText='left:1130px;top:120px';
  fc.innerHTML=`<div class="k">Shared setup, counted once</div><h4>Experience Platform setup</h4><p class="how">Real-Time CDP, Journey Optimizer and CJA work from the same Experience Platform data, so this setup is done once for all three.<a class="src" href="#" style="margin-left:6px">${EXT}</a></p>
   <div class="used">Shared by <span>Real-Time CDP</span><span>Journey Optimizer</span><span>CJA</span></div>
   ${ln('Data model, schema and identity design',80)}${ln('Data sources and ingestion setup',160)}${ln('Governance, access and sandbox setup',48)}
   <div class="ft"><span>3 services, counted once</span><span>$43,200</span></div>
   <div class="sub">LINES THAT PARTLY REPEAT THIS TODAY</div>
   <div class="rep"><span>Journey Optimizer: Access, sandbox and channel setup</span><b>64 h</b></div>
   <div class="rep"><span>Journey Optimizer: Journey events, data sources and actions</span><b>80 h</b></div>
   <div class="rep"><span>CJA (optional): CJA data preparation in Experience Platform</span><b>80 h</b></div>
   <p class="how" style="margin:8px 0 0">Proposed: with the shared setup on the canvas, these keep only their own part, so the same work isn't counted twice.</p>`;cv.appendChild(fc);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('style','position:absolute;left:0;top:0;width:1920px;height:1100px;pointer-events:none;z-index:44');
  svg.innerHTML='<path d="M706 651 H1080 V420 H1128" fill="none" stroke="#EB1000" stroke-width="2.5" stroke-dasharray="6 5"/>';cv.appendChild(svg);
  document.getElementById('hint').textContent='5 products, 4 connections. Hover the shared setup band to see what is counted once.';
 },{EXT});});
await b.close();})();
