/* Warroom Knowledge Explorer. Browser-global + CommonJS; no dependencies or network calls. */
(function (global, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (global && global.document) global.WarroomKnowledgeExplorer = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var sequence = 0;
  const nodeLabels = {
    rtcdp: ['RT-CDP'], ajo: ['AJO'], target: ['Target'],
    cja: ['CJA'], bv: ['Brand', 'Visibility'], so: ['Sites', 'Optimizer'],
    commerce: ['Adobe', 'Commerce'], aco: ['Commerce', 'Optimizer'], cintel: ['Commerce', 'Intelligence'],
    eds: ['Edge', 'Delivery'], bc: ['Brand', 'Concierge'], cw: ['Coworker'],
    marketo: ['Marketo', 'Engage'], workfront: ['Workfront'], aemsites: ['AEM', 'Sites'],
    aemassets: ['AEM', 'Assets'], aemforms: ['AEM', 'Forms'], ajob2b: ['AJO B2B'],
    xa: ['Experiment', 'Accelerator'], ca: ['Content', 'Analytics'], collab: ['RT-CDP', 'Collab.'],
    mmm: ['Campaign', 'Analytics'], gspm: ['GenStudio'], express: ['Adobe', 'Express'],
    frameio: ['Frame.io'], creativecloud: ['Creative', 'Cloud'], planning: ['Workfront', 'Planning'],
    fireflycp: ['Firefly', 'Production'], fireflycm: ['Firefly', 'Models'], brandintel: ['Brand', 'Intelligence'],
    aa: ['Adobe', 'Analytics'], mmeasure: ['Marketo', 'Measure'], acrobat: ['Acrobat'],
    acrobatsign: ['Acrobat', 'Sign'], mqualifier: ['Marketo', 'Qualifier'], moptimizer: ['Marketo', 'Optimizer'],
    cdn: ['CDN'], dwh: ['Data', 'warehouse'], cstore: ['Cloud', 'storage'],
    crm: ['CRM'], ads: ['Ad', 'platforms'], bi: ['BI tools'],
    search: ['Search', 'data'], csrc: ['Authoring', 'docs'], cms: ['Other CMS'],
    figma: ['Figma'], chatgpt: ['ChatGPT'], claude: ['Claude'],
    copilot: ['Microsoft', 'Copilot'], erp: ['ERP'], pim: ['PIM'],
    oms: ['Order', 'mgmt.'], wms: ['Warehouse', 'mgmt.'], ocp: ['Other', 'commerce']
  };
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
  function otherEnd(connection, id) {
    return connection.a === id ? connection.b : connection.a;
  }

  // Fixed Adobe positions let partners compare products without chasing moving labels.
  // The free slots are spaced for a circle plus its selection ring and canvas dot.
  function outsideSlots(positions) {
    const occupied = Object.values(positions), slots = [];
    for (let row = 0, y = 35; y <= 535; row++, y += 55) {
      for (let x = 35 + (row % 2) * 31.5; x <= 825; x += 63) {
        if (occupied.every(p => Math.hypot(x - p.x, y - p.y) >= 65)) slots.push({x, y});
      }
    }
    return slots;
  }

  // Penalize a route that would disappear behind a circle and look like a connection to it.
  function overlapWithLine(point, start, end) {
    const dx = end.x - start.x, dy = end.y - start.y;
    const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy);
    if (t <= 0 || t >= 1) return 0;
    return Math.max(0, 31 - Math.hypot(point.x - start.x - t * dx, point.y - start.y - t * dy));
  }

  function visibleMap(catalog, adobe, fixed, slots, focus, canvasIds, overview) {
    const anchors = new Set(focus ? [focus] : canvasIds.filter(id => !catalog.byId[id].outside));
    const connections = catalog.connections.filter(c => {
      if (focus) return c.a === focus || c.b === focus;
      if (overview) return !catalog.byId[c.a].outside && !catalog.byId[c.b].outside;
      return (anchors.has(c.a) && (anchors.has(c.b) || catalog.byId[c.b].outside)) ||
             (anchors.has(c.b) && catalog.byId[c.a].outside);
    });
    const owners = new Map();
    for (const c of connections) {
      const outside = catalog.byId[c.a].outside ? c.a : c.b;
      if (!catalog.byId[outside].outside) continue;
      if (!owners.has(outside)) owners.set(outside, new Set());
      owners.get(outside).add(otherEnd(c, outside));
    }
    const systems = Array.from(owners.keys(), id => catalog.byId[id]).sort((a, b) => a.name.localeCompare(b.name));
    const positions = Object.assign(Object.create(null), fixed);
    const remaining = slots.slice(), obstacles = Object.values(fixed);
    const drawn = connections.filter(c => fixed[c.a] && fixed[c.b]).map(c => [fixed[c.a], fixed[c.b]]);
    let height = 570;
    for (const system of systems) {
      // If the catalog outgrows the ring, add space below it without moving Adobe products.
      if (!remaining.length) {
        for (let x = 55; x <= 805; x += 75) remaining.push({x, y:height + 35});
        height += 75;
      }
      const from = Array.from(owners.get(system.id), id => fixed[id]);
      let best = 0, bestCost = Infinity;
      remaining.forEach((slot, index) => {
        let cost = drawn.reduce((sum, [a,b]) => sum + 7 * overlapWithLine(slot, a, b), 0);
        for (const start of from) {
          cost += Math.hypot(slot.x - start.x, slot.y - start.y);
          cost += obstacles.reduce((sum, p) => sum + 7 * overlapWithLine(p, start, slot), 0);
        }
        if (cost < bestCost) { best = index; bestCost = cost; }
      });
      positions[system.id] = remaining.splice(best, 1)[0];
      obstacles.push(positions[system.id]);
      for (const start of from) drawn.push([start, positions[system.id]]);
    }
    return {products:adobe.concat(systems), systems, connections, positions, height, anchors};
  }

  function mount(root, options) {
    if (!root || !root.ownerDocument || typeof root.replaceChildren !== 'function') throw new TypeError('mount() needs a DOM host element.');
    const o = options || {}, catalog = normalizeCatalog(o.catalog);
    if (typeof o.getCanvasProductIds !== 'function') throw new TypeError('getCanvasProductIds is required.');
    const doc = root.ownerDocument, uid = 'wke-' + (++sequence);
    const adobe = catalog.products.filter(p => !p.outside);
    const fixed = layoutProducts(adobe, catalog.connections), slots = outsideSlots(fixed);
    const sortedAdobe = adobe.slice().sort((a, b) => a.name.localeCompare(b.name));
    let canvas = {ids:[], unknownIds:[]}, noCanvas = false, stateError = '', notice = '', destroyed = false;
    let focus = '', system = '', selectedService = '', cachedMap, mapKey = '';
    const expanded = new Set();
    root.classList.add('wke');

    function readCanvas() {
      noCanvas = typeof o.hasCanvas === 'function' && !o.hasCanvas();
      try { canvas = canvasSelection(catalog, o.getCanvasProductIds()); stateError = ''; }
      catch (_) { canvas = {ids:[], unknownIds:[]}; stateError = 'Canvas selection is unavailable.'; }
    }
    function currentMap() {
      const ids = noCanvas ? [] : canvas.ids;
      const key = JSON.stringify([noCanvas, focus, ids]);
      if (mapKey !== key) {
        cachedMap = visibleMap(catalog, adobe, fixed, slots, focus, ids, noCanvas);
        mapKey = key;
      }
      return cachedMap;
    }
    function captureFocus() {
      return root.contains(doc.activeElement) ? doc.activeElement.getAttribute('data-focus-key') : null;
    }
    function control(key) {
      return Array.from(root.querySelectorAll('[data-focus-key]')).find(el => el.dataset.focusKey === key);
    }
    function rememberDetails() {
      root.querySelectorAll('details[data-disclosure]').forEach(el => {
        if (el.open) expanded.add(el.dataset.disclosure); else expanded.delete(el.dataset.disclosure);
      });
    }
    function openAttr(key) { return expanded.has(key) ? ' open' : ''; }
    function link(s) {
      return s.url ? '<a href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(s.title)+' <span aria-hidden="true">↗</span></a>' : '';
    }

    function graphMarkup(map) {
      const members = new Set(noCanvas ? [] : canvas.ids);
      const near = new Set(focus ? map.connections.map(c => otherEnd(c, focus)) : []);
      const edges = map.connections.map(c => {
        const a = map.positions[c.a], b = map.positions[c.b];
        const external = catalog.byId[c.a].outside || catalog.byId[c.b].outside;
        const picked = c.a === system || c.b === system;
        const classes = ['wke-edge', (noCanvas && !focus) || (system && !picked) ? 'wke-edge-faint' : 'wke-edge-active'];
        if (external) classes.push('wke-edge-outside');
        if (picked) classes.push('wke-edge-detail');
        if (c.kind === 'partner') classes.push('wke-edge-partner');
        return '<line class="'+classes.join(' ')+'" data-edge="'+escapeHTML(c.id)+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"/>';
      }).join('');
      const nodes = map.products.map(p => {
        const point = map.positions[p.id], inPlay = members.has(p.id), highlighted = map.anchors.has(p.id);
        const words = nodeLabels[p.id] || [p.short || p.name.replace(/^Adobe /,'').slice(0,13)];
        const pressed = p.id === (system || focus), key = escapeHTML(p.id);
        const classes = ['wke-node'];
        if (highlighted) classes.push('wke-node-focus');
        if (near.has(p.id)) classes.push('wke-node-near');
        if (p.outside) classes.push('wke-node-outside');
        const caption = escapeHTML(p.name) + (inPlay ? ', on my canvas' : '');
        const lines = words.map((word, i) => '<tspan x="0" y="'+((i - (words.length - 1) / 2) * 11.5)+'">'+escapeHTML(word)+'</tspan>').join('');
        return '<g class="'+classes.join(' ')+'" role="button" tabindex="0" data-action="focus-product" data-id="'+key+'" data-focus-key="node-'+key+'" aria-label="Explore '+caption+'" aria-pressed="'+pressed+'" transform="translate('+point.x+','+point.y+')">'+
          '<title>'+caption+'</title><circle class="wke-node-circle" r="'+(highlighted ? 30 : 27)+'"/><text class="'+(words.some(w => w.length > 8) ? 'wke-node-small' : '')+'" text-anchor="middle" dominant-baseline="central">'+lines+'</text>'+
          (inPlay ? '<circle class="wke-on-canvas" cx="22" cy="-22" r="5"/>' : '')+'</g>';
      }).join('');
      const label = focus ? 'Direct connections for '+catalog.byId[focus].name : noCanvas ? 'Connections between Adobe products' : 'Direct connections for the products on my canvas';
      return '<div class="wke-graph-scroll" tabindex="0" data-focus-key="graph" aria-label="Product map. Scroll horizontally on small screens.">'+
        '<svg class="wke-graph" viewBox="0 0 860 '+map.height+'" role="group" aria-label="'+escapeHTML(label)+'">'+edges+nodes+'</svg></div>';
    }

    function chooserMarkup() {
      const choices = sortedAdobe.map(p => '<option value="'+escapeHTML(p.id)+'"'+(p.id === focus ? ' selected' : '')+'>'+escapeHTML(p.name)+'</option>').join('');
      return '<div class="wke-choice"><div class="wke-choice-label"><label for="'+uid+'-product">Adobe product</label>'+
        (focus && noCanvas ? '<button type="button" class="wke-clear" data-action="reset" data-focus-key="clear">Clear</button>' : '')+
        '</div><select id="'+uid+'-product" data-control="product" data-focus-key="chooser"><option value="">'+(noCanvas ? 'Choose a product' : 'Overview of my play')+'</option>'+choices+'</select></div>';
    }
    function productButtons(products) {
      return '<ul class="wke-product-list">'+products.map(p => '<li><button type="button" data-action="focus-product" data-id="'+escapeHTML(p.id)+'" data-focus-key="list-'+escapeHTML(p.id)+'">'+escapeHTML(p.name)+'<span aria-hidden="true">→</span></button></li>').join('')+'</ul>';
    }
    function overview(map) {
      if (noCanvas) {
        const examples = ['aemsites','commerce'].map(id => catalog.byId[id]).filter(Boolean);
        return examples.length ? '<h4>Try a product</h4>'+productButtons(examples) : '<p class="wke-lead">Choose an Adobe product to see its connections.</p>';
      }
      let name = '';
      try { name = typeof o.getPlayName === 'function' ? String(o.getPlayName() || '') : ''; } catch (_) {}
      const own = adobe.filter(p => map.anchors.has(p.id));
      const empty = canvas.ids.length ? 'Add an Adobe product above to see its outside systems.' : 'Nothing is on your canvas yet. Add a product above, or explore a product here.';
      return '<p class="wke-eyebrow">Your play</p><h3>'+escapeHTML(name || 'Your canvas')+'</h3>'+
        (own.length ? '<h4>Adobe products on your canvas</h4>'+productButtons(own) : '<p class="wke-lead">'+empty+'</p>')+
        (map.systems.length ? '<h4>Connected outside systems</h4>'+productButtons(map.systems) : '');
    }
    function relationshipList(rows, owner) {
      return '<ul class="wke-connections">'+rows.map(c => {
        const other = catalog.byId[otherEnd(c, owner)], key = 'relationship-'+escapeHTML(c.id);
        return '<li><details data-relationship="'+escapeHTML(c.id)+'" data-disclosure="'+key+'"'+openAttr('relationship-'+c.id)+'><summary data-focus-key="'+key+'"'+
          (other.outside && focus ? ' data-action="inspect-system" data-id="'+escapeHTML(other.id)+'"' : '')+'>'+escapeHTML(other.name)+'</summary>'+
          '<div class="wke-relationship"><span class="wke-kind">'+escapeHTML(kindNames[c.kind] || c.kind || 'Type not supplied')+'</span>'+
          (c.label ? '<p class="wke-relationship-label">'+escapeHTML(c.label)+'</p>' : '')+(c.how ? '<p>'+escapeHTML(c.how)+'</p>' : '')+
          (c.prereqs.length ? '<h4>Prerequisites</h4><ul>'+c.prereqs.map(x=>'<li>'+escapeHTML(x)+'</li>').join('')+'</ul>' : '')+link(c.source)+
          (c.services.length ? '<p class="wke-small">'+c.services.length+' catalog service'+(c.services.length === 1 ? '' : 's')+' for this relationship.</p>' : '')+'</div></details></li>';
      }).join('')+'</ul>';
    }
    function group(key, label, body) {
      return '<details class="wke-group" data-disclosure="'+key+'"'+openAttr(key)+'><summary data-focus-key="'+key+'">'+escapeHTML(label)+'</summary>'+body+'</details>';
    }
    function servicesMarkup(p) {
      if (!p.services.length) return '';
      if (!p.services.includes(selectedService)) selectedService = p.services[0];
      const s = catalog.services[selectedService];
      return group('services', 'Product services ('+p.services.length+')',
        '<div class="wke-services"><label for="'+uid+'-service">Inspect a product service</label><select id="'+uid+'-service" data-control="service" data-focus-key="service">'+
        p.services.map(id => '<option value="'+escapeHTML(id)+'"'+(id === selectedService ? ' selected' : '')+'>'+escapeHTML(catalog.services[id].name)+'</option>').join('')+
        '</select><p class="wke-service-id">'+escapeHTML(s.id)+'</p><p class="wke-small">'+escapeHTML(s.scope || 'Open the source for the scope of this service.')+'</p>'+link({url:s.url,title:s.sourceTitle})+
        (typeof o.onInspectService === 'function' ? '<button class="wke-inspect" type="button" data-action="inspect-service" data-focus-key="inspect-service">Inspect service in the SOW builder →</button>' : '<p class="wke-small">Service details are read-only in this explorer.</p>')+'</div>');
    }
    function inspectorMarkup(map) {
      const owner = focus || system;
      if (!owner) return overview(map);
      const p = catalog.byId[owner];
      const related = map.connections.filter(c => c.a === owner || c.b === owner).sort((a,b) =>
        catalog.byId[otherEnd(a,owner)].name.localeCompare(catalog.byId[otherEnd(b,owner)].name));
      const membership = noCanvas ? '' : '<p class="wke-membership">'+(canvas.ids.includes(owner) ? 'On my canvas' : 'Not on my canvas')+'</p>';
      const heading = (p.outside ? '<p class="wke-eyebrow">Outside system</p>' : '')+'<h3>'+escapeHTML(p.name)+'</h3>'+membership;
      if (p.outside) return heading+'<h4>Connected on this play</h4>'+relationshipList(related,owner)+servicesMarkup(p);
      const outside = related.filter(c => catalog.byId[otherEnd(c,owner)].outside);
      const internal = related.filter(c => !catalog.byId[otherEnd(c,owner)].outside);
      const a = map.systems.length, b = new Set(internal.map(c=>otherEnd(c,owner))).size;
      return heading+'<div class="wke-counts"><div><strong>'+a+'</strong><span>outside system'+(a===1?'':'s')+'</span></div><div><strong>'+b+'</strong><span>connected Adobe product'+(b===1?'':'s')+'</span></div></div>'+
        (outside.length ? '<h4>Outside systems</h4>'+relationshipList(outside,owner) : '<p class="wke-small">This product has no direct outside-system connections in the catalog.</p>')+
        (internal.length ? group('adobe-connections', 'Connected Adobe products ('+b+')', relationshipList(internal,owner)) : '')+servicesMarkup(p);
    }

    function render(focusKey, center) {
      if (destroyed) return;
      const map = currentMap();
      const scroll = root.querySelector('.wke-graph-scroll')?.scrollLeft;
      const inspectorScroll = root.querySelector('.wke-inspector')?.scrollTop || 0;
      const unknown = canvas.unknownIds.length ? ' '+canvas.unknownIds.length+' canvas product IDs could not be found.' : '';
      const legend = '<div class="wke-legend"><span><i class="wke-adobe-key"></i>Adobe product</span>'+
        (map.systems.length ? '<span><i class="wke-outside-key"></i>Outside system</span>' : '')+
        (noCanvas ? '' : '<span><i class="wke-canvas-key"></i>On my canvas</span>')+
        (map.connections.some(c=>c.kind==='partner') ? '<span><i class="wke-partner-key"></i>Partner-designed relationship</span>' : '')+'</div>';
      const resetButton = '<button class="wke-reset'+(focus||system?' wke-reset-away':'')+'" type="button" data-action="reset" data-focus-key="reset">Reset to my play</button>';
      root.innerHTML = '<p class="wke-status" role="status" aria-live="polite">'+escapeHTML(stateError || notice)+escapeHTML(unknown)+'</p>'+legend+
        '<div class="wke-stage'+(noCanvas?' wke-stage-browse':'')+'">'+(noCanvas?'':resetButton)+'<div class="wke-layout">'+chooserMarkup()+graphMarkup(map)+
        '<aside class="wke-inspector" aria-label="Product and connection details">'+inspectorMarkup(map)+'</aside></div></div>'+
        '<p class="wke-footnote">Explore each connection for its prerequisites and Adobe source. Your service selections determine the scope and estimate.</p>';
      const port = root.querySelector('.wke-graph-scroll');
      if (center || scroll == null) {
        const x = focus ? fixed[focus].x : 430;
        port.scrollLeft = x * root.querySelector('svg').getBoundingClientRect().width / 860 - port.clientWidth / 2;
      } else port.scrollLeft = scroll;
      root.querySelector('.wke-inspector').scrollTop = center ? 0 : inspectorScroll;
      if (focusKey) (control(focusKey) || control('chooser')).focus({preventScroll:true});
    }
    function reset(key) {
      focus = ''; system = ''; selectedService = ''; notice = ''; expanded.clear(); render(key, true);
    }
    function inspectSystem(id, key) {
      const map = currentMap();
      if (!map.systems.some(p => p.id === id)) return;
      rememberDetails();
      const next = system === id ? '' : id;
      for (const c of map.connections) {
        if (system && (c.a === system || c.b === system)) expanded.delete('relationship-'+c.id);
        if (next && (c.a === next || c.b === next)) expanded.add('relationship-'+c.id);
      }
      system = next; notice = ''; render(key);
      if (system && key === 'node-'+id) {
        const related = new Set(map.connections.filter(c => c.a === id || c.b === id).map(c => c.id));
        const row = Array.from(root.querySelectorAll('details[data-relationship][open]')).find(d => related.has(d.dataset.relationship));
        const first = row?.querySelector('summary');
        if (!first) return;
        const panel = root.querySelector('.wke-inspector');
        if (panel.scrollHeight > panel.clientHeight) panel.scrollTop += first.getBoundingClientRect().top - panel.getBoundingClientRect().top - 12;
        else first.scrollIntoView({block:'nearest'});
      }
    }
    function select(id, key) {
      const p = catalog.byId[id];
      if (!p) return;
      if (p.outside) { inspectSystem(id,key); return; }
      focus = id; system = ''; selectedService = ''; notice = ''; expanded.clear(); render(key,true);
    }
    function onClick(event) {
      event.stopPropagation();
      const el = event.target.closest?.('[data-action]');
      if (!el || !root.contains(el)) return;
      const key = el.dataset.focusKey;
      if (el.dataset.action === 'focus-product') select(el.dataset.id,key);
      else if (el.dataset.action === 'inspect-system') { event.preventDefault(); inspectSystem(el.dataset.id,key); }
      else if (el.dataset.action === 'reset') reset(key);
      else if (el.dataset.action === 'inspect-service' && typeof o.onInspectService === 'function') {
        const id = selectedService;
        Promise.resolve().then(() => o.onInspectService(id)).catch(() => {
          if (!destroyed) { notice = 'Service details could not be opened. Use the SOW builder’s service list.'; rememberDetails(); render('inspect-service'); }
        });
      }
    }
    function onChange(event) {
      const el = event.target;
      if (el.dataset.control === 'product') {
        if (el.value) select(el.value,'chooser'); else reset('chooser');
      } else if (el.dataset.control === 'service') {
        rememberDetails(); selectedService = el.value; render('service');
      }
    }
    function onKey(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (event.target.tagName === 'SELECT') return;
        if (system) inspectSystem(system, 'node-'+system);
        else if (focus) reset(noCanvas ? 'chooser' : 'reset');
        return;
      }
      const el = event.target.closest?.('g[data-action="focus-product"]');
      if (el && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); select(el.dataset.id,el.dataset.focusKey);
      }
    }
    root.addEventListener('click',onClick); root.addEventListener('change',onChange); root.addEventListener('keydown',onKey);
    readCanvas(); render();
    return {
      sync() {
        if (destroyed) return;
        const key = captureFocus(), previous = canvas.ids;
        readCanvas();
        const changed = previous.length !== canvas.ids.length || previous.some(id => !canvas.ids.includes(id));
        if (changed && focus && !canvas.ids.includes(focus)) { reset(key); return; }
        rememberDetails();
        if (system && !currentMap().systems.some(p=>p.id === system)) { system = ''; expanded.clear(); }
        render(key);
      },
      reset() { if (!destroyed) { readCanvas(); reset(captureFocus()); } },
      focusProduct(id) { if (!destroyed) select(id,captureFocus()); },
      destroy() {
        if (destroyed) return;
        destroyed = true; root.removeEventListener('click',onClick); root.removeEventListener('change',onChange); root.removeEventListener('keydown',onKey);
        root.replaceChildren(); root.classList.remove('wke');
      }
    };
  }
  return {mount:mount,normalizeCatalog:normalizeCatalog,canvasSelection:canvasSelection,layoutProducts:layoutProducts,safeURL:safeURL,escapeHTML:escapeHTML};
}));
