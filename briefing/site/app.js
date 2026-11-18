(()=>{'use strict';
const D=window.BRIEF_DATA,$=id=>document.getElementById(id),fmt=n=>Number(n).toLocaleString('en-US');
if(!D){$('app-error').hidden=false;return;}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=s=>{try{const u=new URL(s);return /^https?:$/.test(u.protocol)?u.href:'#';}catch{return '#';}};
const srcLink=(path,line)=>D.repositoryUrl+'/blob/'+D.commit+'/'+path+(line?'#L'+line:'');
const P=Object.fromEntries(D.products.map(p=>[p.id,p]));
// Keep deep links usable when supporting detail is collapsed.
function revealDetails(target){
 if(!target)return;
 for(let node=target;node;node=node.parentElement){if(node.tagName==='DETAILS')node.open=true;}
}
function fragmentTarget(hash){
 if(!hash||hash==='#')return null;
 try{return $(decodeURIComponent(hash.slice(1)));}catch{return null;}
}
function followFragment(){const target=fragmentTarget(location.hash);if(!target)return;revealDetails(target);requestAnimationFrame(()=>target.scrollIntoView());}
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const link=event.target.closest('a[href^="#"]');if(!link||link.target==='_blank')return;
 const target=fragmentTarget(link.getAttribute('href'));if(!target)return;
 revealDetails(target);
 // Native fragment navigation preserves browser history and keyboard behavior.
 if(link.hash===location.hash)requestAnimationFrame(()=>target.scrollIntoView());
});
window.addEventListener('hashchange',followFragment);
if(location.hash)followFragment();
document.querySelectorAll('.snapshot-link').forEach(a=>a.href=D.repositoryUrl+'/commit/'+D.commit);
document.querySelectorAll('.evidence-link').forEach(a=>a.href=D.evidenceLinks[a.dataset.evidence]||D.repositoryUrl+'/commit/'+D.commit);
document.querySelectorAll('.evidence-link,.snapshot-link').forEach(a=>{a.target='_blank';a.rel='noopener';});
$('validation-headline').textContent=D.validation.passed+'/'+D.validation.total+' core regression suites passed';
$('validation-description').textContent='Exact source snapshot '+D.commit.slice(0,7)+'. Word export: '+D.validation.wordChecks+' checks passed, including zero external requests during the tested export. The generated application reproduces byte-for-byte.';

$('validation-scope').textContent=D.validation.scope+'. These 35 core suites were rerun against the pinned snapshot; the repository contains 57 top-level JavaScript test files. Full results are in the evidence manifest.';
$('workflow-metrics').innerHTML=[['requirements imported',D.workflow.requirements],['Adobe products selected',D.workflow.products],['services carried forward',D.workflow.services],['AI-worker requests',D.workflow.workerRequests]].map(([label,n])=>'<div><strong>'+fmt(n)+'</strong><span>'+label+'</span></div>').join('');

// The architecture is an explorable implementation map, with immutable evidence links.
function architecture(id){const n=D.architecture[id]||D.architecture.match;
 document.querySelectorAll('[data-node]').forEach(b=>{b.classList.toggle('active',b.dataset.node===id);b.setAttribute('aria-pressed',String(b.dataset.node===id));});
 $('arch-detail').innerHTML='<div><p class="micro">COMPONENT DETAIL</p><h3>'+esc(n.title)+'</h3></div><div><p>'+esc(n.text)+'</p>'+n.files.map(f=>'<a class="code-link" href="'+esc(srcLink(f.path,f.line))+'" target="_blank" rel="noopener">'+esc(f.path)+(f.line?':'+f.line:'')+' →</a>').join('')+'</div>';
}
document.querySelectorAll('[data-node]').forEach(b=>b.addEventListener('click',()=>architecture(b.dataset.node)));architecture('match');

// All relationships and services below come from the audited catalog snapshot.
let selected='bv',allConnections=true;const graph=$('catalog-graph');
const degree=id=>D.connections.filter(c=>c.a===id||c.b===id).length;
const root=D.products.find(p=>p.id==='bv')||D.products[0];
const rest=D.products.filter(p=>p!==root).sort((a,b)=>degree(b.id)-degree(a.id)||a.name.localeCompare(b.name));
const positions={[root.id]:{x:425,y:270}};
rest.forEach((p,i)=>{const inner=i<14,index=inner?i:i-14,count=inner?14:rest.length-14,a=-Math.PI/2+index/count*Math.PI*2;positions[p.id]={x:425+Math.cos(a)*(inner?158:323),y:270+Math.sin(a)*(inner?133:222)};});
const shortNames={eds:'Edge',cw:'Coworker',marketo:'Marketo',ajob2b:'AJO B2B',xa:'Experiment',ca:'Content',collab:'Collab',mmm:'Campaign',gspm:'GenStudio',csrc:'Authoring',cms:'CMS',express:'Express',frameio:'Frame.io',creativecloud:'Creative',planning:'Planning',fireflycp:'Firefly CP',fireflycm:'Firefly CM',brandintel:'Brand Intel',mmeasure:'Measure',acrobat:'Acrobat',mqualifier:'Qualifier',moptimizer:'M Optimizer',aemsites:'Sites',aemassets:'Assets',aemforms:'Forms',rtcdp:'RT-CDP',ajo:'AJO',cja:'CJA',aa:'Analytics',bv:'BV',so:'Optimizer',acrobatsign:'Sign',workfront:'Workfront',commerce:'Commerce',bc:'Concierge',crm:'CRM',dwh:'Warehouse',bi:'BI',cdn:'CDN',ads:'Ads',search:'Search',cstore:'Storage',dam:'DAM'};
const short=p=>shortNames[p.id]||p.short||p.name.replace(/^Adobe /,'').split(/\s+/).map((x,i,a)=>a.length>2?x[0]:x).join(' ').slice(0,10);
const products=[...D.products].sort((a,b)=>Number(a.outside)-Number(b.outside)||a.name.localeCompare(b.name));
$('product-select').innerHTML=products.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+(p.outside?' · outside system':'')+'</option>').join('');
function selectProduct(id){selected=P[id]?id:root.id;$('product-select').value=selected;drawGraph();inspectProduct();}
function drawGraph(){
 const near=new Set([selected,...D.connections.filter(c=>c.a===selected||c.b===selected).map(c=>c.a===selected?c.b:c.a)]);
 const edges=D.connections.filter(c=>positions[c.a]&&positions[c.b]&&(allConnections||c.a===selected||c.b===selected)).map(c=>{const a=positions[c.a],b=positions[c.b],on=c.a===selected||c.b===selected;return '<line class="graph-edge'+(on?' selected':'')+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"/>';}).join('');
 const nodes=D.products.map(p=>{const at=positions[p.id],on=p.id===selected,neighbor=near.has(p.id),label=short(p);return '<g class="graph-node'+(on?' selected':'')+(neighbor?' neighbor':'')+(p.outside?' outside':'')+(!neighbor&&!allConnections?' dimmed':'')+'" data-product="'+esc(p.id)+'" role="button" tabindex="0" aria-label="Explore '+esc(p.name)+'" aria-pressed="'+on+'" transform="translate('+at.x+','+at.y+')"><title>'+esc(p.name)+'</title><circle r="'+(on?28:23)+'"/><text text-anchor="middle" dominant-baseline="central"'+(label.length>8?' style="font-size:9px"':'')+'>'+esc(label)+'</text></g>';}).join('');
 graph.innerHTML=edges+nodes;
 graph.querySelectorAll('[data-product]').forEach(n=>{n.addEventListener('click',()=>selectProduct(n.dataset.product));n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const id=n.dataset.product;selectProduct(id);graph.querySelector('[data-product="'+id+'"]')?.focus();}});});
 $('map-mode').setAttribute('aria-pressed',String(allConnections));$('map-mode').textContent=allConnections?'Show selected product only':'Show all 151 connections';
}
function inspectProduct(){const p=P[selected],connections=D.connections.filter(c=>c.a===selected||c.b===selected).sort((a,b)=>P[a.a===selected?a.b:a.a].name.localeCompare(P[b.a===selected?b.b:b.a].name));const lines=[...new Set(p.services)].filter(id=>D.services[id]);
 $('product-inspector').innerHTML='<p class="micro">'+(p.outside?'OUTSIDE SYSTEM':'ADOBE PRODUCT')+'</p><h3>'+esc(p.name)+'</h3><div class="product-counts"><div><strong>'+connections.length+'</strong><span>catalog relationships</span></div><div><strong>'+lines.length+'</strong><span>product services</span></div></div><p class="micro">CONNECTED TO</p><ul class="connection-list">'+connections.map(c=>{const other=P[c.a===selected?c.b:c.a];return '<li><button data-connection="'+esc(c.id)+'" aria-expanded="false">'+esc(other.name)+'<span aria-hidden="true">+</span></button><div class="connection-detail" hidden>'+esc(c.how||'See the source for the documented relationship.')+(c.source?.url?'<a href="'+esc(url(c.source.url))+'" target="_blank" rel="noopener">'+esc(c.source.title||'Open Adobe source')+' →</a>':'')+'</div></li>';}).join('')+'</ul>'+(lines.length?'<button class="text-link" id="inspect-product-service" style="margin-top:22px;font-size:12px">Inspect a product service →</button>':'<p class="small-note" style="margin-top:18px">Work may be represented on its connections.</p>');
 $('product-inspector').querySelectorAll('[data-connection]').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));b.nextElementSibling.hidden=open;b.querySelector('span').textContent=open?'+':'−';}));
 $('inspect-product-service')?.addEventListener('click',()=>{selectService(lines[0]);revealDetails($('trace'));$('trace').scrollIntoView({behavior:'smooth'});});
}
$('product-select').addEventListener('change',e=>selectProduct(e.target.value));$('map-mode').addEventListener('click',()=>{allConnections=!allConnections;drawGraph();});selectProduct(selected);

const services=Object.values(D.services).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));let serviceId='AF03';
$('service-select').innerHTML=services.map(s=>'<option value="'+esc(s.id)+'">'+esc(s.id+' · '+s.name)+'</option>').join('');
function selectService(id){serviceId=D.services[id]?id:services[0].id;$('service-select').value=serviceId;const s=D.services[serviceId],m=s.method||{},owned=D.products.filter(p=>p.services.includes(s.id)).map(p=>p.name);const li=items=>(items||[]).map(t=>'<li>'+esc(t)+'</li>').join('');
 $('service-content').innerHTML='<div class="service-title"><span class="service-id">'+esc(s.id)+'</span><div><h3>'+esc(s.name)+'</h3><p>'+esc(owned.join(' · ')||'Connection service')+' · '+(s.unit==='monthly'?'Monthly planning effort':'One-time planning effort')+'</p></div></div><div class="method-section"><h4>Scope from the catalog</h4><p>'+esc(s.scope)+'</p></div><div class="method-section"><h4>Implementation method</h4><ol>'+li(m.steps)+'</ol></div><div class="method-section"><h4>Defined deliverables</h4><ul>'+li(m.deliverables)+'</ul><details><summary>Client inputs and delivery risk</summary><ul style="margin-top:12px">'+li(m.asks)+'</ul>'+(m.risk?'<p><strong>Risk:</strong> '+esc(m.risk)+'</p>':'')+'</details></div><div class="method-section"><h4>Primary Adobe source</h4>'+(s.url?'<a href="'+esc(url(s.url))+'" target="_blank" rel="noopener">'+esc(s.src||s.url)+' →</a>':'<p>See the evidence inventory for source context.</p>')+'<p class="small-note" style="margin-top:10px">Delivery steps and planning hours are catalog judgments. A product citation does not establish the service estimate.</p></div>';
 $('copy-status').textContent='';$('term-label').hidden=s.unit!=='monthly';$('estimate-title').textContent=s.unit==='monthly'?'Monthly service estimate':'One-time service estimate';calculate();
}
function calculate(){const s=D.services[serviceId],hours=Number(s[$('size-select').value])||0,rate=Math.max(0,Math.min(100000,Number($('rate-input').value)||0)),monthly=s.unit==='monthly',months=Math.max(1,Math.min(120,Math.floor(Number($('months-input').value)||1)));const total=hours*rate*(monthly?months:1);$('calc-formula').textContent=fmt(hours)+(monthly?' hours / month × ':' hours × ')+new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(rate)+' / hour'+(monthly?' × '+months+' months':'');$('calc-total').textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(total);}
$('service-select').addEventListener('change',e=>selectService(e.target.value));['size-select','rate-input','months-input'].forEach(id=>$(id).addEventListener('input',calculate));selectService(serviceId);
$('copy-record').addEventListener('click',async()=>{const s=D.services[serviceId];try{await navigator.clipboard.writeText(JSON.stringify({snapshot:D.commit,service:s},null,2));$('copy-status').textContent='Record copied.';}catch{$('copy-status').textContent='Clipboard access is unavailable. Download the evidence manifest below.';}});

// Publication counts use unique URLs; individual citation links are a separate measure.
const familyEntries=Object.entries(D.families).sort((a,b)=>b[1]-a[1]);
$('source-bars').innerHTML=familyEntries.map(([name,n])=>'<div class="source-bar"><span class="source-bar-name">'+esc(name)+'</span><div class="source-bar-track" role="img" aria-label="'+esc(name)+': '+n+' of '+D.sources.length+' source URLs"><div class="source-bar-fill" style="width:'+(100*n/D.sources.length)+'%"></div></div><span class="source-bar-count">'+n+'</span></div>').join('')+'<p class="source-bars-note">Share of '+fmt(D.sources.length)+' distinct source URLs across three runtime knowledge files. Source families are grouped by hostname and path.</p>';
$('family-select').innerHTML+=[...familyEntries].map(([n,c])=>'<option value="'+esc(n)+'">'+esc(n)+' ('+c+')</option>').join('');
const layerNames=[...new Set(D.sources.flatMap(s=>Object.keys(s.layers)))].sort();$('layer-select').innerHTML+=layerNames.map(n=>'<option>'+esc(n)+'</option>').join('');
const searchText=s=>[s.title,s.url,s.family,s.searchTerms,...s.pointers.map(p=>p.entity+' '+p.file+' '+p.label)].join(' ').toLowerCase();D.sources.forEach(s=>s.searchText=searchText(s));let sourcePage=0;const pageSize=12;
function sourceResults(){const q=$('source-search').value.trim().toLowerCase(),family=$('family-select').value,layer=$('layer-select').value;return D.sources.filter(s=>(!q||s.searchText.includes(q))&&(!family||s.family===family)&&(!layer||s.layers[layer]));}
function renderSources(){const found=sourceResults(),pages=Math.max(1,Math.ceil(found.length/pageSize));sourcePage=Math.min(sourcePage,pages-1);const list=found.slice(sourcePage*pageSize,(sourcePage+1)*pageSize);
 $('source-count').textContent=fmt(found.length)+' of '+fmt(D.sources.length)+' source URLs'+(found.length?' · showing '+(sourcePage*pageSize+1)+' to '+Math.min((sourcePage+1)*pageSize,found.length):'');
 $('source-list').innerHTML=list.length?list.map(s=>'<article class="source-row"><span class="source-family">'+esc(s.family)+'</span><div><a class="source-title" href="'+esc(url(s.url))+'" target="_blank" rel="noopener">'+esc(s.title||s.url)+' →</a><span class="source-url">'+esc(s.url)+'</span><p class="source-layers">'+esc(Object.keys(s.layers).join(' · '))+'</p><details><summary>Inspect usage in the knowledge files</summary><ul>'+s.pointers.map(p=>'<li><a href="'+esc(srcLink(p.file))+'" target="_blank" rel="noopener">'+esc(p.file)+' →</a><br>'+esc(p.pointer)+' · '+esc(p.label||p.entity||p.layer)+'</li>').join('')+'</ul>'+(s.pointer_count>s.pointers.length?'<p class="source-layers" style="margin-top:8px">'+(s.pointer_count-s.pointers.length)+' additional uses are available in the full evidence inventory.</p>':'')+'</details></div><span class="source-ref-count">'+s.reference_links+' citation'+(s.reference_links===1?'':'s')+'</span></article>').join(''):'<p style="padding:30px 0">No sources match these filters. Try another title, product or publication.</p>';
 $('source-page').textContent='Page '+(sourcePage+1)+' of '+pages;$('sources-prev').disabled=sourcePage===0;$('sources-next').disabled=sourcePage>=pages-1;
}
['source-search','family-select','layer-select'].forEach(id=>$(id).addEventListener('input',()=>{sourcePage=0;renderSources();}));$('sources-prev').addEventListener('click',()=>{sourcePage--;renderSources();});$('sources-next').addEventListener('click',()=>{sourcePage++;renderSources();});renderSources();

const menu=document.querySelector('.menu-toggle'),nav=$('nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);menu.querySelector('span').textContent=open?'+':'−';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.querySelector('span').textContent='+';}));
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}});},{rootMargin:'-90px 0px -65% 0px',threshold:0});['top','revenue','sow-builder','rfi-builder','impact','architecture','scale','knowledge','sources','validation','pilot'].map($).filter(Boolean).forEach(element=>observer.observe(element));}
$('print-brief').addEventListener('click',()=>window.print());
})();
