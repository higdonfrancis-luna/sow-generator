// Statement of Work Generator and RFI Builder: a first look (about 1:12).
// window.render(t) draws the exact frame at t seconds: a pure function of t, no timers, no transitions.
// Times inside a scene come from the spoken words (build/timeline.js), so a re-recorded line moves only its scene.
// The screens are captures of the real tool (shots/, made by build/capture.js); positions below are in the
// captures' CSS pixels, as measured in shots/rects.json.
(function () {
  const TL = window.TIMELINE;
  const S = Object.fromEntries(TL.scenes.map(s => [s.id, s]));
  const stage = document.getElementById('stage');
  const CUES = [];
  const cue = (t, name, gain = 1) => CUES.push({ t: +t.toFixed(3), name, gain });

  // ---------------------------------------------------------------- helpers
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const io = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const out = x => 1 - Math.pow(1 - x, 3);
  const back = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, x) => a + (b - a) * x;
  const $ = id => document.getElementById(id);
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  // when the nth match of a word is spoken in a scene (absolute seconds)
  function at(sid, w, nth = 1) {
    const hit = S[sid].words.filter(x => x[0].replace(/[^\w'-]/g, '').toLowerCase() === w.toLowerCase())[nth - 1];
    if (!hit) throw new Error(`no word "${w}" (${nth}) in ${sid}`);
    return hit[1];
  }
  const set = (el, o, tf) => { el.style.opacity = o; if (tf !== undefined) el.style.transform = tf; };
  // pop in: fade and overshoot scale, starting at t0
  const pop = (el, t, t0, d = 0.35) => { const x = seg(t, t0, t0 + d); set(el, clamp(x * 2.5), `scale(${lerp(0.82, 1, back(x))})`); };
  // rise in: fade and slide up
  const rise = (el, t, t0, d = 0.4, dy = 26) => { const x = out(seg(t, t0, t0 + d)); set(el, x, `translateY(${(1 - x) * dy}px)`); };
  // a ring that lands at t0 and stays until t1
  const ringOn = (el, t, t0, t1) => { const x = seg(t, t0, t0 + 0.3); const y = seg(t, t1, t1 + 0.25); set(el, clamp(x * 3) * (1 - y), `scale(${lerp(1.25, 1, out(x))})`); };
  // a character's small hop on a beat
  const hops = (t, beats, h = 26) => beats.reduce((y, b) => { const x = seg(t, b, b + 0.42); return x > 0 && x < 1 ? y - h * Math.sin(Math.PI * x) : y; }, 0);

  const ICON = {
    doc: '<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h6"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };
  const panel = (id, x, y, w, h, label, cls = '') =>
    `<div class="panel ${cls}" id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">` +
    (label ? `<div class="top"><i></i><span class="lbl">${label}</span><span class="tag">FROM THE TOOL</span></div>` : '') +
    `<div class="view" style="height:${h - (label ? 54 : 0)}px"></div></div>`;
  const img = (id, src) => `<img class="shot" id="${id}" src="../shots/${src}">`;
  // show the part of a capture that starts at (x, y) and is w CSS pixels wide, in a view viewW wide
  const look = (el, natW, x, y, w, viewW) => { const s = viewW / w; el.style.width = natW * s + 'px'; el.style.transform = `translate(${-x * s}px,${-y * s}px)`; return s; };

  // ---------------------------------------------------------------- the stage
  const NAME1 = 'Statement of Work Generator';
  const NAME2 = 'and RFI Builder';
  stage.innerHTML = `
  <div class="bar"></div>
  <div class="eyebrow">Statement of Work Generator and RFI Builder · a first look</div>
  <div class="title" id="title"></div>

  <div class="scene" id="sc1">
    <img class="char" id="c1partner" src="../art/partner.png" style="left:150px;top:290px;height:620px">
    ${['Brand Visibility', 'Sites Optimizer', 'Brand Concierge', 'Coworker'].map((n, i) => `
    <div class="tile" id="tile${i}" style="left:${520 + i * 330}px;top:300px"><h4>${n}</h4>
      <div class="slot" id="slot${i}a">Services <span>?</span></div>
      <div class="slot" id="slot${i}b">Hours <span>?</span></div>
      <div class="slot" id="slot${i}c">Worth <span>?</span></div></div>`).join('')}
    <div class="lock" id="lock"><div class="k">A FIRST LOOK</div>
      <div class="n"><span id="lk1">${NAME1}</span><br><span id="lk2">${NAME2}</span></div><div class="rule" id="lkrule"></div></div>
    ${panel('p1', 1180, 300, 650, 520, 'The first page')}
    <img class="char" id="c1scout" src="../art/scout.png" style="left:880px;top:600px;height:310px">
  </div>

  <div class="scene" id="sc2">
    ${panel('p2', 96, 190, 1330, 720, 'The first page')}
    ${panel('p2b', 250, 520, 1000, 330, 'Or start here', 'red')}
    <div class="note" id="n2a" style="left:1470px;top:230px;width:360px"><b>Ready-made plays</b>Brand Visibility, Coworker, Brand Concierge, GenStudio</div>
    <div class="note" id="n2b" style="left:1470px;top:400px;width:360px"><b>Your client's problem</b>"My client is missing from AI answers"</div>
    <div class="note" id="n2c" style="left:1470px;top:545px;width:360px"><b>On the canvas</b>The play's products and how they connect</div>
    <img class="char" id="c2scout" src="../art/scout.png" style="left:1600px;top:690px;height:235px">
  </div>

  <div class="scene" id="sc3">
    ${panel('p3', 96, 190, 1090, 720, 'Build · the products on a canvas')}
    ${panel('p3c', 1230, 190, 600, 720, '', 'red')}
    <div class="pill" id="pl3a" style="left:700px;top:742px">${ICON.clock}Planning hours on every service</div>
    <div class="pill" id="pl3b" style="left:700px;top:822px">${ICON.link}From Adobe's public documentation</div>
  </div>

  <div class="scene" id="sc4">
    <div class="sub">Every connection and service is sourced from Adobe's public documentation.</div>
    <div class="big" id="big0" style="left:150px;top:350px"><div class="n" id="num0">0</div><div class="l">Adobe products</div><div class="s">to put on the canvas</div></div>
    <div class="big" id="big1" style="left:720px;top:350px"><div class="n" id="num1">0</div><div class="l">connections</div><div class="s">between them</div></div>
    <div class="big" id="big2" style="left:1290px;top:350px"><div class="n" id="num2" style="color:#EB1000">0</div><div class="l">partner services</div><div class="s">with planning hours and a source</div></div>
    <img class="char" id="c4buddy" src="../art/buddy.png" style="left:860px;top:715px;height:200px">
  </div>

  <div class="scene" id="sc5">
    ${panel('p5', 96, 190, 1000, 720, 'Build · Brand Visibility + Sites Optimizer and Edge Delivery Services')}
    <div class="money" id="m5" style="left:1130px;top:200px;width:700px">
      <div class="k">IMPLEMENTATION + 12-MONTH TERM</div>
      <div class="v" id="m5v">$0</div>
      <div class="row" id="m5a"><span>The build</span><b>$271,200 one-time</b></div>
      <div class="row" id="m5b"><span>The monthly work</span><b>$18,000 a month</b></div>
      <div class="row" id="m5c"><span>First-year total</span><b>$487,200</b></div>
      <div class="e">Example: a Typical size engagement at $150 an hour, 13 services. Illustrative fees, not a quote.</div>
    </div>
    <div class="note" id="n5" style="left:1130px;top:740px;width:700px"><b>Your own rate</b>No Adobe pricing in the tool. Change any line and the total moves.</div>
    <img class="char" id="c5partner" src="../art/partner.png" style="left:770px;top:625px;height:290px">
  </div>

  <div class="scene" id="sc6">
    ${panel('p6', 96, 190, 1330, 720, 'Statement of work')}
    <div class="note" id="n6a" style="left:1470px;top:230px;width:360px"><b>For every service</b>Scope, deliverables, acceptance and fees</div>
    <div class="note" id="n6b" style="left:1470px;top:385px;width:360px"><b>Out the door</b>Print or save as PDF, or export the services as a CSV</div>
    <div class="note" id="n6c" style="left:1470px;top:230px;width:360px"><b>Drop in the RFI</b>Word, Excel, PDF or text</div>
    <div class="note" id="n6d" style="left:1470px;top:385px;width:360px"><b>Drafted answers</b>Each with Adobe's sources, for you to review</div>
    <div class="filechip" id="chip6">${ICON.doc}Client RFI.docx</div>
    <img class="char" id="c6scout" src="../art/scout.png" style="left:1600px;top:690px;height:235px">
  </div>

  <div class="scene" id="sc7">
    <div class="step" id="st0" style="left:150px;top:215px"><small>1 · SEE THE SERVICES</small><h3>The work behind every Adobe product</h3><p>569 services, each with a source</p></div>
    <div class="arrow" id="ar0" style="left:664px;top:318px;width:46px"></div>
    <div class="step" id="st1" style="left:710px;top:215px"><small>2 · SEE WHAT THEY'RE WORTH</small><h3>Hours and fees at your own rate</h3><p>Change any line</p></div>
    <div class="arrow" id="ar1" style="left:1224px;top:318px;width:46px"></div>
    <div class="step red" id="st2" style="left:1270px;top:215px"><small>3 · PROPOSE IT</small><h3>A statement of work on your paper</h3><p>And drafted answers for the RFI</p></div>
    <div class="final" id="fin" style="top:490px"><div class="n"><span id="fn1">${NAME1}</span><br><span id="fn2">${NAME2}</span></div><div class="for" id="fnfor">FOR ADOBE PARTNERS</div></div>
    <img class="char" id="c7scout" src="../art/scout.png" style="left:150px;top:540px;height:370px">
    <img class="char" id="c7buddy" src="../art/buddy.png" style="left:370px;top:690px;height:215px">
    <img class="char" id="c7partner" src="../art/partner.png" style="left:1590px;top:520px;height:395px">
  </div>

  <div id="ripple"></div>
  <svg id="cursor" viewBox="0 0 24 24"><path d="M4 2l15 9.5-6.6 1.3L16 20l-3.2 1.5-3.5-7.2L4 19z" fill="#1a1a1a" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>
  <div class="cap" id="cap"></div>
  <img class="logo" src="../art/adobe_logo.png">
  <div class="credit" id="credit">Character art created with Adobe Firefly</div>`;

  // views inside the panels
  const view = id => $(id).querySelector('.view');
  view('p1').innerHTML = img('i1', 'front_full.png');
  view('p2').innerHTML = img('i2front', 'front_full.png') + img('i2canvas', 'canvas_empty.png') +
    '<div class="cover" id="cv2"></div>' + ['cdn', 'bv', 'so', 'eds'].map(k => `<div class="piece" id="pc_${k}"></div>`).join('') +
    '<div class="ring" id="r2play"></div>';
  view('p2b').innerHTML = img('i2prob', 'front_full.png') + '<div class="ring" id="r2chip"></div>';
  view('p3').innerHTML = img('i3', 'canvas_empty.png') + ['a', 'b', 'c'].map(k => `<div class="ring round" id="r3${k}"></div>`).join('');
  view('p3c').innerHTML = img('i3card', 'card.png') + '<div class="ring" id="r3row"></div><div class="ring" id="r3ref"></div>';
  view('p5').innerHTML = ['canvas_empty', 'canvas_r1', 'canvas_r15', 'canvas_r150'].map((f, i) => img('i5_' + i, f + '.png')).join('') +
    '<div class="abs" style="left:0;top:262px;width:140px;height:44px;background:#fff"></div><div class="ring" id="r5rate"></div><div class="ring" id="r5fees"></div>';
  view('p6').innerHTML = img('i6canvas', 'canvas_rate.png') + img('i6sow', 'sow_top.png') + img('i6fees', 'sow_fees.png') +
    img('i6rfi0', 'rfi_empty.png') + img('i6rfi1', 'rfi_answered.png') +
    '<div class="ring" id="r6total"></div><div class="ring" id="r6src"></div><div class="ring" id="r6found"></div>';

  // ---------------------------------------------------------------- scene windows
  const ids = TL.scenes.map(s => s.id);
  const start = i => (i === 0 ? 0 : S[ids[i]].at);
  const sceneAlpha = (t, i) => {
    const fadeIn = i === 0 ? 1 : seg(t, start(i) - 0.34, start(i) - 0.04);
    const fadeOut = i + 1 < ids.length ? seg(t, start(i + 1) - 0.62, start(i + 1) - 0.36) : 0;
    return fadeIn * (1 - fadeOut);
  };
  const TITLES = [
    [0, 'Behind every Adobe product is services work'],
    [S.s2_play.at - 0.4, "Pick a play, or start from your client's problem"],
    [S.s3_connect.at - 0.4, 'Every line is a connection. Click one for the services.'],
    [S.s4_scale.at - 0.4, "What's inside"],
    [S.s5_money.at - 0.4, 'Enter your rate. The hours become dollars.'],
    [S.s6_sow.at - 0.4, 'One click to a statement of work'],
    [at('s6_sow', 'Have') - 0.35, 'Have an RFI? Drop it in.'],
    [S.s7_close.at - 0.4, 'The services, the hours and the fees'],
  ];

  // cursor path: [time, x, y] in stage pixels; it glides between points and is hidden outside them
  const CUR = [];
  const CLICKS = [];
  const curAt = (t, x, y) => CUR.push([t, x, y]);
  const click = (t) => { CLICKS.push(t); cue(t, 'click', 0.9); };

  // ---------------------------------------------------------------- scene 1: the question, then the name
  const T1 = S.s1_intro.at;
  const t1tiles = [0, 1, 2, 3].map(i => at('s1_intro', 'every') + i * 0.24);
  const t1q = [at('s1_intro', 'Which'), at('s1_intro', 'How'), at('s1_intro', 'What')];
  const t1here = at('s1_intro', "Here's");
  const t1name = at('s1_intro', 'Statement'), t1and = at('s1_intro', 'and');
  t1tiles.forEach(t => cue(t, 'pop', 0.7));
  t1q.forEach(t => cue(t, 'tick', 0.9));
  cue(t1here - 0.1, 'whoosh', 0.6); cue(t1name, 'chime', 0.7);
  function scene1(t) {
    const leave = seg(t, t1here - 0.15, t1here + 0.3);
    const pin = out(seg(t, 0.15, 0.85));
    set($('c1partner'), pin * (1 - leave), `translate(${(1 - pin) * -120 - leave * 80}px,${hops(t, t1q, 18)}px)`);
    for (let i = 0; i < 4; i++) {
      const x = seg(t, t1tiles[i], t1tiles[i] + 0.35);
      set($('tile' + i), clamp(x * 2.5) * (1 - leave), `scale(${lerp(0.82, 1, back(x))}) translateY(${-leave * 30}px)`);
      ['a', 'b', 'c'].forEach((k, j) => rise($('slot' + i + k), t, t1q[j] + i * 0.07, 0.3, 14));
    }
    rise($('lock'), t, t1here + 0.15, 0.45, 30);
    rise($('lk1'), t, t1name - 0.1, 0.4, 20);
    rise($('lk2'), t, t1and - 0.05, 0.4, 20);
    $('lkrule').style.width = 700 * out(seg(t, t1and + 0.2, t1and + 0.9)) + 'px';
    const pp = out(seg(t, t1here + 0.5, t1here + 1.1));
    set($('p1'), pp, `translateY(${(1 - pp) * 60}px)`);
    look($('i1'), 1280, 0, lerp(0, 440, io(seg(t, t1name, t1name + 3.2))), 1280, 650);
    const sc = out(seg(t, t1name + 0.2, t1name + 0.7));
    set($('c1scout'), sc, `translateY(${(1 - sc) * 40 + hops(t, [t1name + 0.7, t1and + 0.5], 22)}px)`);
  }

  // ---------------------------------------------------------------- scene 2: pick a play, or the client's problem
  const T2 = S.s2_play.at;
  const V2 = 1330, s2 = V2 / 1280;                              // whole width of the capture
  const FRONT_Y = 905;                                          // "Choose a play to start" at the top of the view
  const CANVAS_Y = 140;
  const P2 = (x, y, vy) => [96 + x * s2, 190 + 54 + (y - vy) * s2];
  const t2pick = at('s2_play', 'ready-made'), t2or = at('s2_play', 'or'), t2prob = at('s2_play', "client's");
  const t2and = at('s2_play', 'and'), t2land = at('s2_play', 'products');
  const PLAY3 = [772, 1049, 231, 238];
  const NODES = { cdn: [378, 477, 177, 72], bv: [378, 593, 177, 59], so: [378, 708, 177, 59], eds: [679, 582, 224, 80] };
  const t2node = { cdn: t2land, bv: t2land + 0.22, so: t2land + 0.44, eds: t2land + 0.66 };
  const t2lines = t2land + 1.0;
  curAt(T2 - 0.2, ...P2(1040, 1500, FRONT_Y)); curAt(T2 + 0.25, ...P2(440, 1190, FRONT_Y));
  curAt(t2pick + 0.55, ...P2(PLAY3[0] + 120, PLAY3[1] + 150, FRONT_Y)); curAt(t2and + 0.3, ...P2(PLAY3[0] + 120, PLAY3[1] + 150, FRONT_Y));
  click(t2and + 0.05);
  cue(t2pick, 'pop', 0.6); cue(t2or + 0.1, 'whoosh', 0.5); cue(t2prob, 'pop', 0.6);
  Object.values(t2node).forEach(t => cue(t, 'land', 0.8)); cue(t2lines, 'swell', 0.5);
  function scene2(t) {
    const sw = io(seg(t, t2and + 0.12, t2and + 0.5));            // first page to canvas
    look($('i2front'), 1280, 0, FRONT_Y, 1280, V2); $('i2front').style.opacity = 1 - sw;
    look($('i2canvas'), 1280, 0, CANVAS_Y, 1280, V2); $('i2canvas').style.opacity = sw;
    $('p2').querySelector('.lbl').textContent = sw > 0.5 ? 'Build · the products on a canvas' : 'The first page';
    // the canvas starts empty; each product lands, then the lines appear
    const cv = $('cv2'), cy = (396 - CANVAS_Y) * s2;
    Object.assign(cv.style, { left: '0px', top: cy + 'px', width: V2 + 'px', height: (666 - cy) + 'px' });
    cv.style.opacity = sw > 0 ? 1 - seg(t, t2lines, t2lines + 0.4) : 0;
    for (const k in NODES) {
      const [x, y, w, h] = NODES[k], m = 8, el = $('pc_' + k);
      Object.assign(el.style, { left: (x - m) * s2 + 'px', top: (y - m - CANVAS_Y) * s2 + 'px', width: (w + 2 * m) * s2 + 'px', height: (h + 2 * m) * s2 + 'px',
        backgroundImage: 'url(../shots/canvas_empty.png)', backgroundSize: V2 + 'px auto', backgroundPosition: `${-(x - m) * s2}px ${-(y - m) * s2}px` });
      const x1 = seg(t, t2node[k], t2node[k] + 0.4);
      set(el, sw > 0 ? clamp(x1 * 3) * (1 - seg(t, t2lines + 0.3, t2lines + 0.4)) : 0, `translateY(${(1 - out(x1)) * -40}px) scale(${lerp(0.8, 1, back(x1))})`);
    }
    const r = $('r2play'), m = 6;
    Object.assign(r.style, { left: (PLAY3[0] - m) * s2 + 'px', top: (PLAY3[1] - m - FRONT_Y) * s2 + 'px', width: (PLAY3[2] + 2 * m) * s2 + 'px', height: (PLAY3[3] + 2 * m) * s2 + 'px' });
    ringOn(r, t, t2pick + 0.5, t2and + 0.1);
    // the client's problem box, laid over the first page while it is spoken
    const pb = seg(t, t2or + 0.05, t2or + 0.4), pe = seg(t, t2and - 0.25, t2and + 0.02);
    set($('p2b'), clamp(pb * 2.5) * (1 - pe), `scale(${lerp(0.9, 1, back(pb))}) translateY(${pe * 20}px)`);
    const sb = look($('i2prob'), 1280, 36, 446, 1080, 1000);
    const rc = $('r2chip');
    Object.assign(rc.style, { left: (55 - 36 - 5) * sb + 'px', top: (601 - 446 - 5) * sb + 'px', width: 253 * sb + 'px', height: 46 * sb + 'px' });
    ringOn(rc, t, t2prob, t2and);
    pop($('n2a'), t, t2pick); pop($('n2b'), t, t2prob); pop($('n2c'), t, t2land + 0.1);
    set($('c2scout'), 1, `translateY(${hops(t, [t2pick + 0.5, t2prob + 0.4, t2land + 0.7])}px)`);
  }

  // ---------------------------------------------------------------- scene 3: a connection and its services
  const T3 = S.s3_connect.at;
  const V3 = 1090, W3 = 760, s3 = V3 / W3, X3 = 290, Y3 = 400;
  const P3 = (x, y) => [96 + (x - X3) * s3, 190 + 54 + (y - Y3) * s3];
  const BOLTS = { a: [455, 553, 23, 23], b: [605, 607, 23, 23], c: [605, 672, 23, 23] };
  const t3bolt = { a: at('s3_connect', 'line'), b: at('s3_connect', 'connection'), c: at('s3_connect', 'between') };
  const t3click = at('s3_connect', 'one'), t3serv = at('s3_connect', 'services'), t3hours = at('s3_connect', 'planning');
  const t3docs = at('s3_connect', "Adobe's");
  const CARD = 600 / 460;                                       // the card capture is 460 wide
  const CARD_SCROLL = 947 * CARD - 720;
  curAt(t3click - 1.0, ...P3(930, 760)); curAt(t3click - 0.12, ...P3(BOLTS.b[0] + 14, BOLTS.b[1] + 15)); curAt(t3click + 1.2, ...P3(BOLTS.b[0] + 14, BOLTS.b[1] + 15));
  click(t3click);
  Object.values(t3bolt).forEach(t => cue(t, 'pulse', 0.6));
  cue(t3click + 0.08, 'whoosh', 0.7); cue(t3serv + 0.25, 'pop', 0.7); cue(t3hours, 'pop', 0.7); cue(t3docs, 'chime', 0.6);
  function scene3(t) {
    look($('i3'), 1280, X3, Y3, W3, V3);
    for (const k in BOLTS) {
      const [x, y, w, h] = BOLTS[k], m = 9, el = $('r3' + k);
      Object.assign(el.style, { left: (x - m - X3) * s3 + 'px', top: (y - m - Y3) * s3 + 'px', width: (w + 2 * m) * s3 + 'px', height: (h + 2 * m) * s3 + 'px' });
      const stay = k === 'b' ? t3docs + 3 : t3bolt[k] + 0.9;
      ringOn(el, t, t3bolt[k], stay);
    }
    const ci = out(seg(t, t3click + 0.08, t3click + 0.55));
    set($('p3c'), clamp(ci * 3), `translateX(${(1 - ci) * 700}px)`);
    const sc = io(seg(t, t3serv - 0.35, t3serv + 0.75)) * CARD_SCROLL;
    look($('i3card'), 460, 0, sc / CARD, 460, 600);
    const row = $('r3row'), ref = $('r3ref');
    Object.assign(row.style, { left: 12 * CARD + 'px', top: 816 * CARD - sc + 'px', width: 436 * CARD + 'px', height: 49 * CARD + 'px', borderRadius: '12px' });
    Object.assign(ref.style, { left: 12 * CARD + 'px', top: 868 * CARD - sc + 'px', width: 250 * CARD + 'px', height: 24 * CARD + 'px', borderRadius: '10px' });
    ringOn(row, t, t3serv + 0.75, t3docs - 0.1);
    ringOn(ref, t, t3docs, t3docs + 4);
    pop($('pl3a'), t, t3hours); pop($('pl3b'), t, t3docs);
  }

  // ---------------------------------------------------------------- scene 4: what is inside
  const T4 = S.s4_scale.at;
  const COUNTS = [[33, at('s4_scale', 'Thirty-three')], [162, at('s4_scale', 'One')], [569, at('s4_scale', 'Five')]];
  COUNTS.forEach(([, t]) => { cue(t, 'pop', 0.8); cue(t + 0.05, 'rise', 0.5); });
  function scene4(t) {
    COUNTS.forEach(([n, t0], i) => {
      pop($('big' + i), t, t0 - 0.05, 0.4);
      $('num' + i).textContent = Math.round(n * out(seg(t, t0, t0 + 0.75)));
    });
    const b = out(seg(t, T4 - 0.2, T4 + 0.3));
    set($('c4buddy'), b, `translateY(${(1 - b) * 40 + hops(t, COUNTS.map(c => c[1] + 0.6), 30)}px)`);
  }

  // ---------------------------------------------------------------- scene 5: the rate, then the money
  const T5 = S.s5_money.at;
  const V5 = 1000, W5 = 880, s5 = V5 / W5, X5 = 400, Y5 = 130;
  const P5 = (x, y) => [96 + (x - X5) * s5, 190 + 54 + (y - Y5) * s5];
  const t5enter = at('s5_money', 'enter'), t5rate = at('s5_money', 'hourly');
  const t5keys = [t5rate, t5rate + 0.24, t5rate + 0.48];
  const t5become = at('s5_money', 'hours'), t5build = at('s5_money', 'build'), t5month = at('s5_money', 'monthly'), t5total = at('s5_money', 'first-year');
  const RATE = [824, 149, 84, 37], FEES = [790, 215, 460, 168];
  curAt(T5 - 0.3, ...P5(1100, 560)); curAt(t5enter + 0.35, ...P5(RATE[0] + 52, RATE[1] + 24)); curAt(t5keys[2] + 0.5, ...P5(RATE[0] + 52, RATE[1] + 24)); curAt(t5keys[2] + 1.0, ...P5(RATE[0] + 150, RATE[1] + 90));
  click(t5enter + 0.45);
  t5keys.forEach(t => cue(t, 'tick', 1));
  cue(t5become - 0.1, 'rise', 0.8); cue(t5become + 0.95, 'chime', 0.9); cue(t5build, 'pop', 0.6); cue(t5month, 'pop', 0.6); cue(t5total, 'sparkle', 0.7);
  function scene5(t) {
    const typed = t5keys.filter(k => t >= k).length;
    for (let i = 0; i < 4; i++) { const el = $('i5_' + i); look(el, 1280, X5, Y5, W5, V5); el.style.opacity = i === typed ? 1 : 0; }
    const place = (el, [x, y, w, h], m) => Object.assign(el.style, { left: (x - m - X5) * s5 + 'px', top: (y - m - Y5) * s5 + 'px', width: (w + 2 * m) * s5 + 'px', height: (h + 2 * m) * s5 + 'px' });
    place($('r5rate'), [754, 149, 216, 37], 8); place($('r5fees'), FEES, 6);
    ringOn($('r5rate'), t, t5enter, t5become - 0.1);
    ringOn($('r5fees'), t, t5become, T5 + 60);
    pop($('m5'), t, t5become - 0.1, 0.45);
    $('m5v').textContent = money(487200 * out(seg(t, t5become, t5become + 0.95)));
    [['m5a', t5build], ['m5b', t5month], ['m5c', t5total]].forEach(([id, t0]) => {
      const x = seg(t, t0, t0 + 0.25), el = $(id);
      el.style.borderColor = x > 0 ? '#EB1000' : '#1a1a1a';
      el.style.background = x > 0 ? '#EB1000' : '#fff';
      el.style.color = x > 0 ? '#fff' : '#1a1a1a';
      el.style.transform = `scale(${1 + 0.035 * Math.sin(Math.PI * x)})`;
    });
    pop($('n5'), t, t5total + 0.9);
    const pa = out(seg(t, t5become + 0.3, t5become + 0.8));
    set($('c5partner'), pa, `translateY(${(1 - pa) * 40 + hops(t, [t5become + 0.95, t5total + 0.3], 28)}px)`);
  }

  // ---------------------------------------------------------------- scene 6: the statement of work, then the RFI
  const T6 = S.s6_sow.at;
  const V6 = 1330, s6 = V6 / 1280;
  const P6 = (x, y, vx, vy, s) => [96 + (x - vx) * s, 190 + 54 + (y - vy) * s];
  const t6click = at('s6_sow', 'click'), t6sow = at('s6_sow', 'statement'), t6paper = at('s6_sow', 'paper'), t6ready = at('s6_sow', 'ready');
  const t6have = at('s6_sow', 'Have'), t6drop = at('s6_sow', 'Drop'), t6draft = at('s6_sow', 'drafted'), t6src = at('s6_sow', "Adobe's");
  const DOCW = 1040, DOCX = 120;                                // the document, zoomed
  const sD = V6 / DOCW;
  curAt(T6 - 0.35, ...P6(700, 420, 0, 0, s6)); curAt(t6click - 0.08, ...P6(348, 104, 0, 0, s6)); curAt(t6click + 0.5, ...P6(348, 104, 0, 0, s6));
  click(t6click);
  cue(t6click + 0.1, 'whoosh', 0.6); cue(t6paper, 'pop', 0.6); cue(t6paper + 0.95, 'chime', 0.6);
  cue(t6have - 0.3, 'whoosh', 0.6); cue(t6drop + 0.3, 'thunk', 0.9); cue(t6draft, 'swell', 0.6); cue(t6src, 'chime', 0.6);
  function scene6(t) {
    const toSow = io(seg(t, t6click + 0.08, t6click + 0.45));
    const zoom = io(seg(t, t6click + 0.5, t6sow + 0.5));
    const toFees = io(seg(t, t6sow + 0.9, t6sow + 1.3));
    const toRfi = io(seg(t, t6have - 0.3, t6have + 0.1));
    const answered = io(seg(t, t6drop + 0.35, t6drop + 0.7));
    // the canvas, then the statement of work page, then a closer look at the document
    look($('i6canvas'), 1280, 0, 0, 1280, V6); $('i6canvas').style.opacity = 1 - toSow;
    const w = lerp(1280, DOCW, zoom), x = lerp(0, DOCX, zoom), y = lerp(0, 395, zoom);
    look($('i6sow'), 1280, x, y, w, V6); $('i6sow').style.opacity = toSow * (1 - toFees) * (1 - toRfi);
    // the fees table, scrolling to the total
    const fy = lerp(40, 560, io(seg(t, t6paper, t6paper + 1.0)));
    look($('i6fees'), 1280, DOCX, fy, DOCW, V6); $('i6fees').style.opacity = toFees * (1 - toRfi);
    const rt = $('r6total');
    Object.assign(rt.style, { left: (905 - DOCX) * sD + 'px', top: (955 - fy) * sD + 'px', width: 250 * sD + 'px', height: 54 * sD + 'px' });
    ringOn(rt, t, t6paper + 0.95, t6have - 0.35);
    // the RFI Builder: empty, a file dropped in, then the answers
    const ry = lerp(180, 470, io(seg(t, t6drop + 0.75, t6draft + 0.1))) + 110 * io(seg(t, t6src - 0.55, t6src));
    look($('i6rfi0'), 1280, 0, ry, 1280, V6); $('i6rfi0').style.opacity = toRfi * (1 - answered);
    look($('i6rfi1'), 1280, 0, ry, 1280, V6); $('i6rfi1').style.opacity = toRfi * answered;
    const chip = $('chip6'), cx = out(seg(t, t6have + 0.5, t6drop + 0.3));
    const [zx, zy] = P6(640, 400, 0, 180, s6);
    set(chip, clamp(seg(t, t6have + 0.5, t6have + 0.7)) * (1 - seg(t, t6drop + 0.35, t6drop + 0.55)), `translate(${zx - 120}px,${lerp(zy - 330, zy - 20, cx)}px) rotate(${lerp(-7, 0, cx)}deg)`);
    const rf = $('r6found'), rs = $('r6src');
    Object.assign(rf.style, { left: (24) * s6 + 'px', top: (504 - ry) * s6 + 'px', width: 700 * s6 + 'px', height: 36 * s6 + 'px', borderRadius: '10px' });
    Object.assign(rs.style, { left: (662) * s6 + 'px', top: (1066 - ry) * s6 + 'px', width: 420 * s6 + 'px', height: 82 * s6 + 'px' });
    ringOn(rf, t, t6draft, t6src - 0.1); ringOn(rs, t, t6src, t6src + 5);
    $('p6').querySelector('.lbl').textContent = toRfi > 0.5 ? 'RFI Builder' : (toSow > 0.5 ? 'Statement of work' : 'Build');
    const hide = 1 - seg(t, t6have - 0.5, t6have - 0.2);
    pop($('n6a'), t, t6sow + 0.3); $('n6a').style.opacity *= hide;
    pop($('n6b'), t, t6paper); $('n6b').style.opacity *= hide;
    pop($('n6c'), t, t6have + 0.25); pop($('n6d'), t, t6draft);
    set($('c6scout'), 1, `translateY(${hops(t, [t6sow + 0.5, t6paper + 0.95, t6drop + 0.4, t6src + 0.2])}px)`);
  }

  // ---------------------------------------------------------------- scene 7: the close
  const T7 = S.s7_close.at;
  const t7 = [at('s7_close', 'See', 1), at('s7_close', 'See', 2), at('s7_close', 'Then')];
  const t7name = at('s7_close', 'Statement'), t7and = at('s7_close', 'and'), t7for = at('s7_close', 'for');
  t7.forEach(t => cue(t, 'pop', 0.8)); cue(t7name - 0.1, 'swell', 0.7); cue(t7for, 'sparkle', 0.8);
  function scene7(t) {
    t7.forEach((t0, i) => pop($('st' + i), t, t0 - 0.05, 0.4));
    [['ar0', t7[1]], ['ar1', t7[2]]].forEach(([id, t0]) => set($(id), seg(t, t0 - 0.25, t0 - 0.1), `scaleX(${out(seg(t, t0 - 0.25, t0 + 0.05))})`));
    set($('fin'), 1);
    rise($('fn1'), t, t7name - 0.1, 0.45, 24); rise($('fn2'), t, t7and - 0.05, 0.45, 24);
    pop($('fnfor'), t, t7for, 0.4);
    [['c7scout', t7[0], 0], ['c7buddy', t7[1], 0.15], ['c7partner', t7[2], 0.3]].forEach(([id, t0, d]) => {
      const x = out(seg(t, t0 + 0.1, t0 + 0.55));
      set($(id), x, `translateY(${(1 - x) * 50 + hops(t, [t7name + 0.2 + d, t7for + 0.1 + d, t7for + 1.3 + d], 30)}px)`);
    });
    $('credit').style.opacity = seg(t, t7for + 0.6, t7for + 1.0);
  }

  // ---------------------------------------------------------------- every frame
  const SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7];
  CUR.sort((a, b) => a[0] - b[0]);
  // groups of cursor points more than 2 s apart are separate appearances
  function cursor(t) {
    const c = $('cursor'), r = $('ripple');
    let i = CUR.findIndex(p => p[0] > t);
    let a = 0, pos = null;
    if (i > 0 && CUR[i][0] - CUR[i - 1][0] < 2.5) {
      const p = CUR[i - 1], q = CUR[i], x = io(seg(t, p[0], q[0]));
      pos = [lerp(p[1], q[1], x), lerp(p[2], q[2], x)];
      const first = i - 1 === 0 || p[0] - CUR[i - 2][0] >= 2.5, last = i + 1 >= CUR.length || CUR[i + 1][0] - q[0] >= 2.5;
      a = Math.min(first ? seg(t, p[0], p[0] + 0.2) : 1, last ? 1 - seg(t, q[0] - 0.2, q[0]) : 1);
    }
    c.style.opacity = a;
    if (pos) c.style.transform = `translate(${pos[0]}px,${pos[1]}px)`;
    const k = CLICKS.filter(x => t >= x && t < x + 0.45).pop();
    if (k !== undefined && pos) {
      const x = seg(t, k, k + 0.45);
      r.style.opacity = (1 - x) * 0.9; r.style.left = pos[0] + 4 + 'px'; r.style.top = pos[1] + 4 + 'px'; r.style.transform = `scale(${lerp(0.3, 1.25, out(x))})`;
    } else r.style.opacity = 0;
  }
  function caption(t) {
    const el = $('cap'), c = TL.captions.find(x => t >= x.t0 && t < x.t1);
    if (!c) { el.style.opacity = 0; return; }
    if (el.textContent !== c.text) el.textContent = c.text;
    el.style.opacity = Math.min(seg(t, c.t0, c.t0 + 0.12), 1 - seg(t, c.t1 - 0.12, c.t1));
  }
  function title(t) {
    const el = $('title');
    let i = 0;
    TITLES.forEach((x, j) => { if (t >= x[0]) i = j; });
    const [t0, text] = TITLES[i], next = TITLES[i + 1];
    if (el.textContent !== text) el.textContent = text;
    const a = (i === 0 ? seg(t, 0.1, 0.5) : seg(t, t0 + 0.05, t0 + 0.4)) * (next ? 1 - seg(t, next[0] - 0.3, next[0]) : 1);
    set(el, a, `translateY(${(1 - out(a)) * 14}px)`);
  }
  window.render = function (t) {
    SCENES.forEach((fn, i) => {
      const a = sceneAlpha(t, i), el = $('sc' + (i + 1));
      el.style.opacity = a;
      el.style.visibility = a > 0 ? 'visible' : 'hidden';
      if (a > 0) fn(t);
    });
    $('credit').style.opacity = t >= T7 ? seg(t, t7for + 0.6, t7for + 1.0) : 0;
    title(t); caption(t); cursor(t);
  };
  window.CUES = CUES.sort((a, b) => a.t - b.t);
  window.READY = (async () => {
    await document.fonts.load('400 20px "Source Sans 3"'); await document.fonts.load('600 20px "Source Sans 3"'); await document.fonts.load('700 20px "Source Sans 3"');
    await Promise.all([...document.images].map(i => (i.complete ? i.decode().catch(() => {}) : new Promise(r => { i.onload = i.onerror = r; }))));
    window.render(0);
    return { frames: TL.frames, fps: TL.fps, duration: TL.duration };
  })();
})();
