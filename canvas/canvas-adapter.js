/* The explorer reads the current play from the Build canvas after each canvas render. */
let knowledgeExplorer = null;
let knowledgeExplorerPlay = null;
function syncKnowledgeExplorer() {
  const region = document.getElementById('knowledge-model-section');
  if (region) {
    region.hidden = !knowledgeExplorer;
    // Nov 19 (Adam): the map also sits open at the bottom of the first page, where there is no canvas yet; a play moves it back under the canvas.
    // It moves only when its place changes, so a click inside it keeps its focus.
    const slot = play() ? document.body : document.getElementById('picker-map');
    if (region.parentNode !== slot) { if (play()) document.querySelector('.sow-canvas-screen').after(region); else slot.append(region); }
    region.setAttribute('aria-label', play() ? 'Your play in the product catalog' : 'How every product connects');
  }
  if (!knowledgeExplorer) return;
  // step 95: a new play (Change play, Start over) opens the ring on that play, not on a product clicked under the last one
  if (st.play !== knowledgeExplorerPlay) { knowledgeExplorerPlay = st.play; knowledgeExplorer.reset(); }
  else knowledgeExplorer.sync();
}

{
  const root = document.getElementById('knowledge-model-root');
  if (root && window.WarroomKnowledgeExplorer) {
    // step 94: the services written as SOW templates keep their wording on the SOW step; the build hands it to the explorer, which
    // shows it where the catalog line has no scope of its own. The canvas's own CAT is not changed.
    const TEMPLATE_SCOPE = /*KM_TEMPLATE_SCOPE*/{};
    const lines = Object.fromEntries(Object.entries(CAT.lines).map(([id, line]) => [id, line.scope || !TEMPLATE_SCOPE[id] ? line : Object.assign({}, line, {scope: TEMPLATE_SCOPE[id]})]));
    // Nov 17 (Adam: "2, yes"): Adobe's industry note belongs to the partner's Workfront + Coworker card only, so the explorer, which
    // prints every relationship's how text, gets that card's text without the note. The canvas's own CAT is not changed.
    const CARD_ONLY = {'workfront-cw': / Adobe's Workfront help says: "[^"]*"$/};
    const connections = CAT.connections.map(c => CARD_ONLY[c.id] ? Object.assign({}, c, {how: String(c.how || '').replace(CARD_ONLY[c.id], '')}) : c);
    knowledgeExplorer = window.WarroomKnowledgeExplorer.mount(root, {
      catalog: Object.assign({}, CAT, {lines, connections}),
      // step 95 (Adam, Nov 14): the ring follows the play built above; its name heads the panel beside it
      getPlayName: () => (play() ? play().title || play().label : ''),
      // the first page has no canvas: the map marks nothing as on it and has no Reset to my play
      hasCanvas: () => !!play(),
      // Match the offerings and outside systems visible on Build, including saved canvases.
      getCanvasProductIds: () => displayProducts().map(product => product.id)
      // Omit onInspectService: the explorer can show catalog service details.
      // No service-specific host navigation API was verified in this snapshot.
    });
  }
}
