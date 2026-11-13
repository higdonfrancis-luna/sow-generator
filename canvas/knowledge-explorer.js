/* Warroom Knowledge Explorer. Browser-global + CommonJS; no dependencies or network calls. */
(function (global, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (global && global.document) global.WarroomKnowledgeExplorer = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var sequence = 0;
  var shortNames = {eds:'Edge',cw:'Coworker',marketo:'Marketo',ajob2b:'AJO B2B',xa:'Experiment',ca:'Content',collab:'Collab',mmm:'Campaign',gspm:'GenStudio',csrc:'Authoring',cms:'CMS',express:'Express',frameio:'Frame.io',creativecloud:'Creative',planning:'Planning',fireflycp:'Firefly CP',fireflycm:'Firefly CM',brandintel:'Brand Intel',mmeasure:'Measure',acrobat:'Acrobat',mqualifier:'Qualifier',moptimizer:'M Optimizer',aemsites:'Sites',aemassets:'Assets',aemforms:'Forms',rtcdp:'RT-CDP',ajo:'AJO',cja:'CJA',aa:'Analytics',bv:'BV',so:'Optimizer',acrobatsign:'Sign',workfront:'Workfront',commerce:'Commerce',bc:'Concierge',crm:'CRM',dwh:'Warehouse',bi:'BI',cdn:'CDN',ads:'Ads',search:'Search',cstore:'Storage',dam:'DAM'};
  var kindNames = {native:'Native',platform:'Platform',extension:'Extension',partner:'Partner-designed',outside:'Outside system'};
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function safeURL(value) {
    try { var u = new URL(String(value || '')); return /^https?:$/.test(u.protocol) ? u.href : ''; }
    catch (_) { return ''; }
  }
  function strings(values) {
    return Array.isArray(values) ? values.filter(function (v) { return typeof v === 'string' && v.length; }) : [];
  }
  function unique(values) { return Array.from(new Set(values)); }
  function source(value) {
    return value && typeof value === 'object' ? {url:safeURL(value.url),title:String(value.title || 'Open source')} : {url:'',title:''};
  }
  function normalizeCatalog(raw) {
    if (!raw || !Array.isArray(raw.products) || !Array.isArray(raw.connections)) throw new TypeError('A canonical catalog with products and connections is required.');
    var records = raw.lines && typeof raw.lines === 'object' ? raw.lines : {};
    var services = Object.create(null), products = [], byId = Object.create(null), connections = [], seenEdges = new Set();
    Object.keys(records).forEach(function (id) {
      var s = records[id];
      if (!s || typeof s !== 'object') return;
      services[id] = {id:id,name:String(s.name || id),scope:String(s.scope || ''),url:safeURL(s.url),sourceTitle:String(s.src || 'Open source')};
    });
    raw.products.forEach(function (p) {
      if (!p || typeof p.id !== 'string' || !p.id || byId[p.id]) return;
      var item = {id:p.id,name:String(p.name || p.title || p.id),short:String(p.short || ''),outside:!!p.outside,services:unique(strings(p.lines).concat(strings(p.more))).filter(function (id) { return !!services[id]; })};
      byId[item.id] = item; products.push(item);
    });
    raw.connections.forEach(function (c, index) {
      if (!c || typeof c.a !== 'string' || typeof c.b !== 'string' || !byId[c.a] || !byId[c.b] || c.a === c.b) return;
      var id = typeof c.id === 'string' && c.id ? c.id : 'relationship-' + index;
      if (seenEdges.has(id)) return;
      seenEdges.add(id);
      connections.push({id:id,a:c.a,b:c.b,how:String(c.how || ''),kind:String(c.kind || ''),label:String(c.label || ''),prereqs:strings(c.prereqs).slice(),source:source(c.source),services:unique(strings(c.lines).concat(strings(c.more))).filter(function (sid) { return !!services[sid]; })});
    });
    if (!products.length) throw new TypeError('The catalog has no valid products.');
    return {products:products,byId:byId,connections:connections,services:services};
  }
  function canvasSelection(catalog, values) {
    var supplied = values instanceof Set ? Array.from(values) : values;
    if (!Array.isArray(supplied)) throw new TypeError('getCanvasProductIds() must return an array or Set of product IDs.');
    var ids = unique(strings(supplied));
    return {ids:ids.filter(function (id) { return !!catalog.byId[id]; }),unknownIds:ids.filter(function (id) { return !catalog.byId[id]; })};
  }
  function selectView(catalog, canvasIds, mode) {
    var chosen = new Set(canvasIds);
    return {products:catalog.products.filter(function (p) { return mode === 'catalog' || chosen.has(p.id); }),connections:catalog.connections.filter(function (c) { return mode === 'catalog' || (chosen.has(c.a) && chosen.has(c.b)); })};
  }
  function layoutProducts(products, connections) {
    var positions = Object.create(null);
    if (!products.length) return positions;
    var degrees = Object.create(null);
    products.forEach(function (p) { degrees[p.id] = 0; });
    connections.forEach(function (c) { if (degrees[c.a] != null) degrees[c.a]++; if (degrees[c.b] != null) degrees[c.b]++; });
    var ordered = products.slice().sort(function (a,b) { return degrees[b.id]-degrees[a.id] || a.name.localeCompare(b.name); });
    var center = ordered.find(function (p) { return p.id === 'bv'; }) || ordered[0];
    positions[center.id] = {x:430,y:285};
    var rest = ordered.filter(function (p) { return p.id !== center.id; });
    var innerCount = rest.length > 22 ? Math.min(14, Math.ceil(rest.length / 3)) : rest.length;
    rest.forEach(function (p,i) {
      var inner = i < innerCount, index = inner ? i : i-innerCount, count = inner ? innerCount : rest.length-innerCount;
      var angle = -Math.PI/2 + index/count*Math.PI*2;
      var rx = rest.length <= 2 ? 175 : rest.length > 22 ? (inner ? 164 : 345) : 300;
      var ry = rest.length <= 2 ? 155 : rest.length > 22 ? (inner ? 144 : 239) : 225;
      positions[p.id] = {x:430+Math.cos(angle)*rx,y:285+Math.sin(angle)*ry};
    });
    return positions;
  }
  function mount(root, options) {
    if (!root || !root.ownerDocument || typeof root.replaceChildren !== 'function') throw new TypeError('mount() needs a DOM host element.');
    var o = options || {}, catalog = normalizeCatalog(o.catalog);
    if (typeof o.getCanvasProductIds !== 'function') throw new TypeError('getCanvasProductIds is required.');
    var doc = root.ownerDocument, uid = 'wke-' + (++sequence), destroyed = false, mode = o.initialMode === 'catalog' ? 'catalog' : 'solution';
    var selected = '', showAll = true, canvas = {ids:[],unknownIds:[]}, stateError = '', notice = '', busy = false;
    var expanded = new Set(), selectedService = '';
    root.classList.add('wke');
    function readCanvas() {
      try { canvas = canvasSelection(catalog, o.getCanvasProductIds()); stateError = ''; }
      catch (error) { canvas = {ids:[],unknownIds:[]}; stateError = 'Canvas selection is unavailable. Reconnect the canvas state before adding products.'; }
    }
    function view() { return selectView(catalog, canvas.ids, mode); }
    function resolveFocus() {
      var data = view();
      if (!data.products.some(function (p) { return p.id === selected; })) selected = data.products.find(function (p) { return p.id === 'bv'; })?.id || data.products[0]?.id || '';
    }
    function captureFocus() {
      var el = doc.activeElement;
      return root.contains(el) ? el.getAttribute('data-focus-key') : null;
    }
    function restoreFocus(key) {
      if (!key) return;
      var target = Array.from(root.querySelectorAll('[data-focus-key]')).find(function (el) { return el.getAttribute('data-focus-key') === key; });
      (target || root.querySelector('[data-focus-key="product"]') || root.querySelector('[data-focus-key="mode-solution"]'))?.focus({preventScroll:true});
    }
    function short(p) {
      return shortNames[p.id] || p.short || p.name.replace(/^Adobe /,'').slice(0,13);
    }
    function link(s, caption) {
      return s.url ? '<a href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(caption || s.title)+' <span aria-hidden="true">↗</span></a>' : '';
    }
    function allowed(id) {
      if (!id || canvas.ids.includes(id) || stateError || typeof o.onAddProduct !== 'function' || typeof o.canAddProduct !== 'function') return false;
      try { return o.canAddProduct(id) === true; } catch (_) { return false; }
    }
    function graphMarkup(data) {
      var positions = layoutProducts(data.products,data.connections), near = new Set([selected]);
      data.connections.forEach(function (c) { if(c.a===selected)near.add(c.b); if(c.b===selected)near.add(c.a); });
      var edges = data.connections.filter(function(c) { return mode==='solution' || showAll || c.a===selected || c.b===selected; }).map(function(c) {
        var a=positions[c.a],b=positions[c.b],active=c.a===selected||c.b===selected;
        return '<line class="wke-edge'+(active?' wke-edge-active':'')+(c.kind==='partner'?' wke-edge-partner':'')+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"/>';
      }).join('');
      var nodes=data.products.map(function(p) {
        var at=positions[p.id],focused=p.id===selected,inSolution=canvas.ids.includes(p.id),label=short(p);
        return '<g class="wke-node'+(focused?' wke-node-focus':'')+(near.has(p.id)?' wke-node-near':'')+(p.outside?' wke-node-outside':'')+(!near.has(p.id)&&mode==='catalog'&&!showAll?' wke-node-muted':'')+'" role="button" tabindex="0" data-action="focus-product" data-id="'+escapeHTML(p.id)+'" data-focus-key="node-'+escapeHTML(p.id)+'" aria-label="Explore '+escapeHTML(p.name)+(inSolution?', on my canvas':'')+'" aria-pressed="'+focused+'" transform="translate('+at.x+','+at.y+')"><title>'+escapeHTML(p.name)+(inSolution?' · on my canvas':'')+'</title><circle class="wke-node-circle" r="'+(focused?31:27)+'"/><text class="'+(label.length>10?'wke-node-small':'')+'" text-anchor="middle" dominant-baseline="central">'+escapeHTML(label)+'</text>'+(inSolution?'<circle class="wke-on-canvas" cx="23" cy="-23" r="5"/>':'')+'</g>';
      }).join('');
      return '<div class="wke-graph-scroll" tabindex="0" aria-label="Product connection graph. Scroll horizontally on small screens."><svg class="wke-graph" viewBox="0 0 860 570" role="group" aria-label="'+(mode==='solution'?'Products on my canvas':'Catalog product relationships')+'">'+edges+nodes+'</svg></div>';
    }
    function inspectorMarkup(data) {
      if (!selected) return '';
      var p=catalog.byId[selected],related=data.connections.filter(function(c) {return c.a===selected||c.b===selected;}).sort(function(a,b) {
        return catalog.byId[a.a===selected?a.b:a.a].name.localeCompare(catalog.byId[b.a===selected?b.b:b.a].name);
      });
      var inSolution=canvas.ids.includes(p.id);
      var list=related.map(function(c) {
        var other=catalog.byId[c.a===selected?c.b:c.a],key='relationship-'+c.id,open=expanded.has(c.id);
        return '<li><details data-relationship="'+escapeHTML(c.id)+'"'+(open?' open':'')+'><summary data-focus-key="'+escapeHTML(key)+'">'+escapeHTML(other.name)+'</summary><div class="wke-relationship"><span class="wke-kind">'+escapeHTML(kindNames[c.kind] || (c.kind?'Catalog type: '+c.kind:'Type not supplied'))+'</span>'+(c.label?'<p class="wke-relationship-label">'+escapeHTML(c.label)+'</p>':'')+(c.how?'<p>'+escapeHTML(c.how)+'</p>':'')+(c.prereqs.length?'<h4>Prerequisites</h4><ul>'+c.prereqs.map(function(x){return '<li>'+escapeHTML(x)+'</li>';}).join('')+'</ul>':'')+link(c.source)+(c.services.length?'<p class="wke-small">'+c.services.length+' catalog service'+(c.services.length===1?'':'s')+' for this relationship.</p>':'')+'</div></details></li>';
      }).join('');
      if (!p.services.includes(selectedService)) selectedService=p.services[0] || '';
      var service=catalog.services[selectedService];
      return '<aside class="wke-inspector" aria-label="Selected product details"><p class="wke-eyebrow">'+(p.outside?'Outside system':'Adobe product')+'</p><h3>'+escapeHTML(p.name)+'</h3><p class="wke-membership">'+(inSolution?'On my canvas':'Not on my canvas')+'</p><div class="wke-counts"><div><strong>'+related.length+'</strong><span>relationships'+(mode==='solution'?' in my solution':' in the catalog')+'</span></div><div><strong>'+p.services.length+'</strong><span>available product services</span></div></div>'+(allowed(p.id)?'<button class="wke-add" type="button" data-action="add" data-focus-key="add"'+(busy?' disabled':'')+'>'+ (busy?'Adding…':'Add product to canvas')+'</button>':'')+'<h4>Connected to</h4>'+(related.length?'<ul class="wke-connections">'+list+'</ul>':'<p class="wke-small">'+(mode==='solution'?'No catalog relationships connect this product to the other products on your canvas. Explore the catalog to discover more.':'No relationships are recorded for this product.')+'</p>')+(service?'<div class="wke-services"><label for="'+uid+'-service">Inspect a product service</label><select id="'+uid+'-service" data-control="service" data-focus-key="service">'+p.services.map(function(id){return '<option value="'+escapeHTML(id)+'"'+(id===selectedService?' selected':'')+'>'+escapeHTML(catalog.services[id].name)+'</option>';}).join('')+'</select><p class="wke-service-id">'+escapeHTML(service.id)+'</p><p class="wke-small">'+escapeHTML(service.scope || 'No scope description is included in this catalog record. Open the source for context.')+'</p>'+link({url:service.url,title:service.sourceTitle})+(typeof o.onInspectService==='function'?'<button class="wke-inspect" type="button" data-action="inspect-service" data-focus-key="inspect-service">Inspect service in the SOW builder →</button>':'<p class="wke-small">Service details are read-only in this explorer.</p>')+'</div>':'')+'</aside>';
    }
    function render(focusKey) {
      if(destroyed)return;
      resolveFocus();
      var data=view(),choices=data.products.slice().sort(function(a,b){return Number(a.outside)-Number(b.outside)||a.name.localeCompare(b.name);});
      var unknown=canvas.unknownIds.length?' '+canvas.unknownIds.length+' canvas product ID'+(canvas.unknownIds.length===1?' is':'s are')+' absent from this catalog and omitted.':'';
      root.innerHTML='<div class="wke-heading"><div><p class="wke-eyebrow">Knowledge model</p><h2>Explore the products behind your solution.</h2></div><p>See how products connect, inspect the evidence and discover delivery services.</p></div><div class="wke-controls"><div class="wke-modes" role="group" aria-label="Knowledge explorer view"><button type="button" data-action="mode" data-mode="solution" data-focus-key="mode-solution" aria-pressed="'+(mode==='solution')+'">My solution</button><button type="button" data-action="mode" data-mode="catalog" data-focus-key="mode-catalog" aria-pressed="'+(mode==='catalog')+'">Explore the catalog</button></div>'+(choices.length?'<label class="wke-product-label" for="'+uid+'-product">Explore a product or system<select id="'+uid+'-product" data-control="product" data-focus-key="product">'+choices.map(function(p){return '<option value="'+escapeHTML(p.id)+'"'+(p.id===selected?' selected':'')+'>'+escapeHTML(p.name)+(p.outside?' · outside system':'')+'</option>';}).join('')+'</select></label>':'')+(mode==='catalog'&&choices.length?'<button class="wke-view-toggle" type="button" data-action="connections" data-focus-key="connections" aria-pressed="'+showAll+'">'+(showAll?'Focus on selected product':'Show all '+catalog.connections.length+' relationships')+'</button>':'')+'</div><p class="wke-summary">'+(mode==='solution'?canvas.ids.length+' product'+(canvas.ids.length===1?'':'s')+' on your canvas · '+data.connections.length+' catalog relationship'+(data.connections.length===1?'':'s')+' between them.':catalog.products.length+' product'+(catalog.products.length===1?' or system':'s and systems')+' · '+catalog.connections.length+' catalog relationship'+(catalog.connections.length===1?'':'s')+'. Browsing does not change your canvas.')+'</p><p class="wke-status" role="status" aria-live="polite">'+escapeHTML(stateError || notice)+escapeHTML(unknown)+'</p>'+(data.products.length?'<div class="wke-legend"><span><i class="wke-adobe-key"></i>Adobe product</span><span><i class="wke-outside-key"></i>Outside system</span><span><i class="wke-canvas-key"></i>On my canvas</span><span><i class="wke-partner-key"></i>Partner-designed relationship</span></div><div class="wke-layout">'+graphMarkup(data)+inspectorMarkup(data)+'</div>':'<div class="wke-empty"><h3>'+(stateError?'Canvas view unavailable.':canvas.unknownIds.length?'No matching products in this catalog.':'Your canvas is empty.')+'</h3><p>'+(stateError?'Reconnect the canvas selection to mirror your solution. You can still explore the catalog.':canvas.unknownIds.length?'The canvas selection uses IDs that this catalog does not contain. Reconcile the catalog version before adding products.':'Choose a starting play or add products on the canvas. You can also explore the catalog here.')+'</p><button type="button" data-action="mode" data-mode="catalog" data-focus-key="empty-explore">Explore the catalog →</button></div>')+'<p class="wke-footnote">Relationships describe catalog knowledge, not a guarantee of a deployed integration. Inspect each relationship’s type, prerequisites and source. Browsing and inspecting services do not add scope or change estimates.</p>';
      restoreFocus(focusKey);
    }
    function select(id,key) {
      if(!view().products.some(function(p){return p.id===id;}))return;
      selected=id;selectedService='';notice='';render(key);
    }
    function setMode(value, key) {
      if(value!=='solution'&&value!=='catalog')throw new TypeError('Mode must be solution or catalog.');
      mode=value;notice='';render(key);
    }
    function add() {
      var id=selected;if(busy||!allowed(id))return;
      busy=true;notice='';render('add');
      Promise.resolve().then(function(){return o.onAddProduct(id);}).then(function(){
        if(destroyed)return;
        readCanvas();busy=false;notice=canvas.ids.includes(id)?catalog.byId[id].name+' is now on your canvas.':'The canvas has not added this product. Complete any required canvas selection or confirmation.';render('add');
      },function(){if(destroyed)return;readCanvas();busy=false;notice='The product could not be added. Your canvas remains the source of truth; try the canvas controls.';render('add');});
    }
    function onClick(event) {
      var el=event.target.closest?.('[data-action]');if(!el||!root.contains(el))return;
      var action=el.getAttribute('data-action'),key=el.getAttribute('data-focus-key');
      if(action==='focus-product')select(el.getAttribute('data-id'),key);
      else if(action==='mode')setMode(el.getAttribute('data-mode'),key);
      else if(action==='connections'){showAll=!showAll;render(key);}
      else if(action==='add')add();
      else if(action==='inspect-service'&&typeof o.onInspectService==='function'){
        try { Promise.resolve(o.onInspectService(selectedService)).catch(function(){if(!destroyed){notice='Service details could not be opened. Use the SOW builder’s service list.';render('inspect-service');}}); }
        catch(_){notice='Service details could not be opened. Use the SOW builder’s service list.';render('inspect-service');}
      }
    }
    function onChange(event) {
      var el=event.target;if(el.getAttribute('data-control')==='product')select(el.value,'product');
      else if(el.getAttribute('data-control')==='service'){selectedService=el.value;render('service');}
    }
    function onKey(event) {
      var el=event.target.closest?.('[data-action="focus-product"]');
      if(el&&root.contains(el)&&(event.key==='Enter'||event.key===' ')){event.preventDefault();select(el.getAttribute('data-id'),el.getAttribute('data-focus-key'));}
    }
    function onToggle(event) {
      var el=event.target;if(!el.hasAttribute?.('data-relationship'))return;
      var id=el.getAttribute('data-relationship');if(el.open)expanded.add(id);else expanded.delete(id);
    }
    root.addEventListener('click',onClick);root.addEventListener('change',onChange);root.addEventListener('keydown',onKey);root.addEventListener('toggle',onToggle,true);
    readCanvas();render();
    return {
      sync:function(){if(destroyed)return;var key=captureFocus();readCanvas();render(key);},
      setMode:function(value){if(destroyed)return;setMode(value,captureFocus());},
      focusProduct:function(id){if(destroyed)return;select(id,captureFocus());},
      destroy:function(){if(destroyed)return;destroyed=true;root.removeEventListener('click',onClick);root.removeEventListener('change',onChange);root.removeEventListener('keydown',onKey);root.removeEventListener('toggle',onToggle,true);root.replaceChildren();root.classList.remove('wke');}
    };
  }
  return {mount:mount,normalizeCatalog:normalizeCatalog,canvasSelection:canvasSelection,selectView:selectView,layoutProducts:layoutProducts,safeURL:safeURL,escapeHTML:escapeHTML};
}));
