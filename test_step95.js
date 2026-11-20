// The catalog ring follows the play above it. Browsing a direct connection is read-only.
const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const catalog = require('./canvas/catalog.json');
const products = new Map(catalog.products.map(p=>[p.id,p]));
const sorted = list => Array.from(list).sort();
const url = 'file://'+path.join(__dirname,'site','index.html');
const root = '#knowledge-model-root';
const node = (p,id) => p.locator(root+' .wke-node[data-id="'+id+'"]');
const reset = p => p.locator(root+' .wke-reset').click();
const choose = (p,id) => p.locator('#picker [data-play="'+id+'"]').click();
const add = (p,id) => p.evaluate(id=>addProduct(id),id);
const remove = (p,id) => p.evaluate(id=>removeProduct(id),id);
const snapshot = p => p.evaluate(()=>JSON.stringify({
  st,products:prods().map(p=>p.id),edges:conns().map(c=>c.id),totals:totals(),focus:fsel,allEdges:showAllEdges,
  card,pinned,cardHidden:document.getElementById('card').hidden,storage:{...localStorage}
}));
const edgeIds = (p,selector='.wke-edge') => p.locator(root+' '+selector).evaluateAll(ls=>ls.map(l=>l.dataset.edge).sort());
const visibleOutside = p => p.locator(root+' .wke-node-outside').evaluateAll(ns=>ns.map(n=>n.dataset.id).sort());
const heading = p => p.locator(root+' .wke-inspector h3').innerText();
const selected = p => p.locator(root+' .wke-node[aria-pressed="true"]').evaluateAll(ns=>ns.map(n=>n.dataset.id));
async function verifyPlay(p) {
  const ids=await p.evaluate(()=>displayProducts().map(n=>n.id));
  const adobe=new Set(ids.filter(id=>!products.get(id).outside));
  const edges=catalog.connections.filter(c=>(adobe.has(c.a)&&(adobe.has(c.b)||products.get(c.b).outside)) ||
    (adobe.has(c.b)&&products.get(c.a).outside));
  const outside=new Set(edges.flatMap(c=>[c.a,c.b]).filter(id=>products.get(id).outside));
  assert.deepEqual(await edgeIds(p),sorted(edges.map(c=>c.id)));
  assert.deepEqual(await visibleOutside(p),sorted(outside));
  assert.deepEqual(await p.locator(root+' .wke-node-focus').evaluateAll(ns=>ns.map(n=>n.dataset.id).sort()),sorted(adobe));
  assert.deepEqual(await p.locator(root+' .wke-on-canvas').evaluateAll(ns=>ns.map(n=>n.parentNode.dataset.id).sort()),
    sorted(ids.filter(id=>adobe.has(id)||outside.has(id))));
  assert.equal(await heading(p),await p.evaluate(()=>play().title||play().label));
}

(async()=>{
  const browser=await chromium.launch(), errors=[];
  try {
    const fresh=async(width=1600,height=950)=>{
      const p=await browser.newPage({viewport:{width,height}});
      p.on('pageerror',e=>errors.push(e.message));
      await p.goto(url); await p.waitForFunction(()=>window.READY);
      return p;
    };
    const p=await fresh(); await choose(p,'aem');
    const sec=await p.locator('#knowledge-model-section').evaluate(s=>({
      visible:!s.hidden,stats:!!s.querySelector('.km-stats'),first:s.firstElementChild.id,
      oldControls:s.querySelectorAll('.wke-heading,.wke-modes,.wke-summary,[data-action="mode"]').length
    }));
    assert.deepEqual(sec,{visible:true,stats:true,first:'knowledge-model-root',oldControls:0});
    const cont=await p.evaluate(()=>{
      const s=document.getElementById('save').getBoundingClientRect(),c=document.getElementById('canvas').getBoundingClientRect();
      return {top:Math.round(s.top-c.top),right:Math.round(c.right-s.right),text:document.getElementById('save').innerText.trim()};
    });
    assert.deepEqual(cont,{top:18,right:30,text:'Continue →'});
    await verifyPlay(p);
    await node(p,'target').click();
    assert.deepEqual(await edgeIds(p),sorted(catalog.connections.filter(c=>c.a==='target'||c.b==='target').map(c=>c.id)));
    assert.equal(await p.locator('.wke-membership').innerText(),'Not on my canvas');
    await reset(p); await verifyPlay(p);
    await node(p,'bv').click();
    assert.equal(await p.locator('.wke-membership').innerText(),'On my canvas');
    assert.deepEqual(await edgeIds(p),sorted(catalog.connections.filter(c=>c.a==='bv'||c.b==='bv').map(c=>c.id)));
    await node(p,'search').click();
    assert(await p.locator(root+' details[data-relationship="bv-search"][open] a,'+root+' details[data-relationship="search-bv"][open] a').isVisible());
    assert.equal(await p.locator(root+' .wke-add').count(),0);
    await p.locator('.wke-reset').focus(); await p.keyboard.press('Enter');
    assert.equal(await p.evaluate(()=>document.activeElement.dataset.focusKey),'reset');
    await verifyPlay(p);
    console.log('PASS ready-made play, selected and suggested relationships, membership, keyboard reset and Continue');

    await p.locator('#change-play').click(); await p.locator('#confirm-yes').click(); await choose(p,'custom');
    await p.keyboard.press('Escape'); await verifyPlay(p);
    assert.match(await p.locator('.wke-inspector').innerText(),/Nothing is on your canvas yet/);
    await add(p,'aemsites');
    assert.deepEqual(await visibleOutside(p),['chatgpt','claude','copilot']);
    await add(p,'commerce'); await verifyPlay(p);
    const both=await visibleOutside(p);
    assert.deepEqual(both,['chatgpt','claude','copilot','crm','erp','oms','pim','wms']);
    await add(p,'cja');
    assert.equal(await node(p,'crm').count(),1);
    await node(p,'crm').focus(); await p.keyboard.press('Enter');
    assert.equal(await heading(p),'CRM');
    const crmRelations=catalog.connections.filter(c=>[c.a,c.b].includes('crm') && [c.a,c.b].some(id=>['cja','commerce'].includes(id)));
    assert.deepEqual(await edgeIds(p,'.wke-edge-detail'),sorted(crmRelations.map(c=>c.id)));
    assert.deepEqual(await p.locator('.wke-connections details').evaluateAll(ds=>ds.map(d=>d.dataset.relationship).sort()),sorted(crmRelations.map(c=>c.id)));
    assert.equal(await p.locator('.wke-inspector .wke-membership').innerText(),'Not on my canvas');
    await remove(p,'commerce');
    assert.deepEqual(await selected(p),['crm']);
    assert.deepEqual(await edgeIds(p,'.wke-edge-detail'),sorted(crmRelations.filter(c=>[c.a,c.b].includes('cja')).map(c=>c.id)));
    assert.equal(await node(p,'erp').count(),0); assert.equal(await node(p,'pim').count(),0);
    await remove(p,'cja'); await verifyPlay(p);
    assert.equal(await node(p,'crm').count(),0);
    console.log('PASS AEM Sites with Commerce, a shared CRM shown once, and removing its first and last supporting products');

    for(const id of ['cja','rtcdp','ajo','target','marketo','bv']) await add(p,id);
    await p.evaluate(()=>{addOutside('crm');addOutside('cdn');});
    await p.fill('#rate','150'); await p.locator('.node[data-p="bv"]').click(); await p.locator('#fb-svc').click();
    await p.waitForFunction(()=>!document.getElementById('card').hidden);
    const before=await snapshot(p);
    await node(p,'cja').focus(); await p.keyboard.press('Space');
    assert.deepEqual(await selected(p),['cja']);
    assert.equal(await p.evaluate(()=>document.activeElement.dataset.id),'cja');
    const read=p.locator('.wke-inspector');
    const cjaEdges=catalog.connections.filter(c=>c.a==='cja'||c.b==='cja');
    assert.deepEqual(await edgeIds(p),sorted(cjaEdges.map(c=>c.id)));
    assert.deepEqual(await read.locator('details[data-relationship]').evaluateAll(ds=>ds.map(d=>d.dataset.relationship).sort()),sorted(cjaEdges.map(c=>c.id)));
    await read.locator('details[data-relationship="copilot-cja"] summary').click();
    await read.locator('details[data-disclosure="services"] > summary').click();
    const ids=[...new Set([...products.get('cja').lines,...products.get('cja').more])];
    assert.deepEqual(await read.locator('[data-control="service"] option').evaluateAll(os=>os.map(o=>o.value)),ids);
    await read.locator('[data-control="service"]').selectOption(ids[1]);
    assert.equal(await read.locator('.wke-service-id').innerText(),ids[1]);
    assert(await read.locator('[data-relationship="copilot-cja"][open] a').isVisible());
    await node(p,'aemassets').click();
    assert(!await node(p,'crm').count());
    await reset(p);
    await node(p,'crm').click(); assert.equal(await read.locator('.wke-membership').innerText(),'On my canvas');
    await reset(p); await verifyPlay(p);
    assert.equal(await snapshot(p),before,'reading sources and switching products changed the quote or upper canvas');
    console.log('PASS reading connection evidence and services preserves a priced quote, stored state, totals and open canvas card');

    await node(p,'cja').click(); await add(p,'aemassets');
    assert.deepEqual(await selected(p),['cja']);
    await node(p,'aemforms').click(); await remove(p,'aemassets');
    await verifyPlay(p);
    await node(p,'cja').click(); await remove(p,'cja'); await verifyPlay(p);
    await node(p,'cja').click(); await add(p,'cja');
    assert.deepEqual(await selected(p),['cja']); assert.equal(await read.locator('.wke-membership').innerText(),'On my canvas');
    await p.reload(); await p.waitForFunction(()=>window.READY); await verifyPlay(p);
    const saved=await snapshot(p); await node(p,'commerce').click(); await node(p,'erp').click(); await reset(p);
    assert.equal(await snapshot(p),saved);
    await p.locator('#start-over').click(); await p.locator('#confirm-yes').click(); await choose(p,'custom');
    await verifyPlay(p); assert.deepEqual(await visibleOutside(p),[]);
    console.log('PASS canvas edits, saved play reload, Change play and Start over');
    await p.close();

    for(const [w,h] of [[360,640],[375,667],[390,844],[768,1024],[820,600]]) {
      const m=await fresh(w,h); await choose(m,'custom');
      for(const id of ['rtcdp','cja','ajo','aemsites','target','marketo']) await add(m,id);
      await m.keyboard.press('Escape');
      const g=await m.evaluate(()=>{
        const s=document.getElementById('save').getBoundingClientRect(),c=document.getElementById('canvas').getBoundingClientRect();
        return {focus:!document.getElementById('fbar').hidden,bottom:Math.round(c.bottom-s.bottom),inside:s.top>=c.top&&s.bottom<=c.bottom,
          wide:document.documentElement.scrollWidth, faded:[...document.querySelectorAll('#knowledge-model-section *')].filter(e=>+getComputedStyle(e).opacity<1).length};
      });
      assert(g.focus&&g.inside&&g.bottom===18&&g.wide<=w&&!g.faded,JSON.stringify({w,h,g}));
      assert(await m.locator('.wke-reset').isVisible()); await m.close();
    }
    assert.deepEqual(errors,[]);
    console.log('PASS five phone and tablet sizes, readable map, contained horizontal scroll and canvas controls');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
