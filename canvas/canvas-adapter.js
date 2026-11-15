/* The explorer reads the current play from the Build canvas after each canvas render. */
let knowledgeExplorer = null;
let knowledgeExplorerPlay = null;
function syncKnowledgeExplorer() {
  const region = document.getElementById('knowledge-model-section');
  if (region) region.hidden = !play() || !knowledgeExplorer;
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
    knowledgeExplorer = window.WarroomKnowledgeExplorer.mount(root, {
      catalog: Object.assign({}, CAT, {lines}),
      // step 95 (Adam, Nov 14): the ring follows the play built above; its name heads the panel beside it
      getPlayName: () => (play() ? play().title || play().label : ''),
      // Match the offerings and outside systems visible on Build, including saved canvases.
      getCanvasProductIds: () => displayProducts().map(product => product.id)
      // Omit onInspectService: the explorer can show catalog service details.
      // No service-specific host navigation API was verified in this snapshot.
    });
  }
}
