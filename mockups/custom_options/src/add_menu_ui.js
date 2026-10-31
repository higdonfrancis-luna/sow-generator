/* ---------- own play: the bar on the canvas, the Add product menu, the lead picker ---------- */
let noOpen=false;
const list=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
function ownUI(){const o=own(),m=$('add-menu');$('ownbar').hidden=!o;
  if(!o){m.hidden=true;$('canvas').classList.remove('menu-open');return;}
  const n=o.prods.length,full=n>=CAP,b=$('add-btn');
  b.className=full?'btn full-btn':'add';b.innerHTML=full?`Play is full ${I.chev}`:`${I.plus} Add product ${I.chev}`;
  $('meter').innerHTML=Array.from({length:CAP},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('');
  $('count').textContent=`${n} of ${CAP} products`;
  m.classList.toggle('isfull',full);if(!m.hidden)m.innerHTML=menuHTML();}
function menuHTML(){const o=own(),n=o.prods.length;
  if(n>=CAP)return `<div class="full"><div class="k">Play is full</div><h4>Five products is the most one play holds</h4>`+
    `<p>To quote more products, start a second SOW.</p>`+
    `<div class="acts"><button class="primary" id="second-sow">Start a second SOW</button><span>This one stays saved.</span></div>`+
    `<p class="sm">To swap a product, hover it and choose Remove from canvas.</p></div>`;
  const rest=CAT.products.filter(p=>!o.prods.includes(p.id)).map(p=>({p,to:o.prods.filter(q=>linkOf(p.id,q))}));
  const yes=rest.filter(x=>x.to.length).sort((a,b)=>b.to.length-a.to.length||a.p.name.localeCompare(b.p.name));
  const no=rest.filter(x=>!x.to.length).sort((a,b)=>a.p.name.localeCompare(b.p.name)),left=CAP-n;
  let h=`<div class="hd"><div class="k">Add a product</div><p>${left} more fit${left===1?'s':''} in this play. Connected products come first.</p></div>`;
  if(yes.length)h+=`<div class="g">Connects to your canvas</div>`+yes.map(x=>`<button class="it2" data-add="${x.p.id}" role="menuitem"><span class="nm">${esc(x.p.name)}</span><span class="ctag">Connects to ${x.to.length} on your canvas</span><span class="to">Lines to ${esc(list(x.to.map(id=>P[id].name)))}</span></button>`).join('');
  if(no.length)h+=`<details class="nocon"${noOpen?' open':''}><summary>${no.length} more do not connect to your canvas yet ${I.chev}</summary>`+no.map(x=>`<button class="it2" data-add="${x.p.id}" role="menuitem"><span class="nm">${esc(x.p.name)}</span></button>`).join('')+`</details>`;
  return h;}
function openAdd(on){const m=$('add-menu');if(on&&!own())return;const was=!m.hidden;m.hidden=!on;
  $('add-btn').setAttribute('aria-expanded',!!on);$('canvas').classList.toggle('menu-open',!!on);
  if(on){hideCard(true);m.innerHTML=menuHTML();}else preview(null);if(was!==!!on)fit();}
function preview(id){document.querySelectorAll('.node.pre').forEach(n=>n.classList.remove('pre'));const o=own();if(!id||!o)return;
  o.prods.filter(q=>linkOf(id,q)).forEach(q=>{const n=document.querySelector(`.node[data-p="${q}"]`);if(n)n.classList.add('pre');});}
function addProd(id){const o=own();if(!o||o.prods.length>=CAP||o.prods.includes(id))return;o.prods.push(id);render();}
function removeProd(id){const o=own();if(!o||id===o.lead)return;o.prods=o.prods.filter(x=>x!==id);hideCard(true);render();}
$('add-btn').addEventListener('click',e=>{e.stopPropagation();openAdd($('add-menu').hidden);});
$('add-menu').addEventListener('click',e=>{e.stopPropagation();
  const a=e.target.closest('[data-add]');if(a){addProd(a.dataset.add);return;}
  if(e.target.closest('#second-sow')){toast('Prototype: in the real tool, this SOW is saved and a second one opens on the play picker, with the same rate and size.');return;}
  const sm=e.target.closest('summary');if(sm)setTimeout(()=>{noOpen=sm.parentElement.open;},0);});
$('add-menu').addEventListener('mouseover',e=>{const it=e.target.closest('[data-add]');preview(it?it.dataset.add:null);});
$('add-menu').addEventListener('mouseleave',()=>preview(null));
$('lead-grid').innerHTML=CAT.products.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<button class="pc-card lead-card" data-lead="${p.id}"><b>${esc(p.name)}</b><span class="chips"><span>Connects to ${DEG[p.id]} product${DEG[p.id]===1?'':'s'}</span></span></button>`).join('');
function showLead(on){$('picker-main').hidden=!!on;$('lead-view').hidden=!on;$('picker').scrollTop=0;}
function startOwn(id){st.play='own';st.own={lead:id,prods:[id]};st.ls={};moreOpen={};showLead(false);render();openAdd(true);}
/* states for the screenshots: capDemo('interact' | 'cap8' | 'cap20') */
window.capDemo=function(name){const S={interact:['bv','cja','commerce'],cap8:['bv','cja','commerce','rtcdp','ajo'],cap20:['rtcdp','ajo','cja','target','commerce']}[name];
  hideCard(true);openAdd(false);st.play='own';st.own={lead:S[0],prods:S.slice()};st.ls={};moreOpen={};showLead(false);render();};
window.capInfo=()=>{const o=own();if(!o)return null;const L=LAY();return{products:o.prods.length,connections:conns().length,lines:L.routes.length,crossings:L.cross.length,around:L.around,shape:L.shape};};
