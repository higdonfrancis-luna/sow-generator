/*
 * SOW canvas adapter — proposed integration, not installed in the application.
 * Verified against higdonfrancis-luna/warroom commit
 * b9ce1ed20f5ab5a6d338931d3a10a119d6244fd2.
 *
 * Inline this file into the EXISTING canvas application <script>, immediately
 * before its final render() call. Load knowledge-explorer.js first.
 * Add syncKnowledgeExplorer() after save() at the end of render().
 * See INTEGRATION.md before applying to Claude's current working branch.
 */

let knowledgeExplorer = null;

function canAddKnowledgeProduct(id) {
  const currentPlay = play();
  if (!currentPlay || !P[id] || has(id)) return false;

  // Match the existing custom-play product menu. Do not add arbitrary IDs.
  if (currentPlay.custom && !P[id].outside && currentPlay.products.includes(id)) {
    return true;
  }

  // A play's outside menu includes outside systems AND supported Adobe add-ons.
  if (!(currentPlay.outside || []).includes(id)) return false;

  // Match outMenuHTML()'s disabled-row rule, not only addOutside()'s looser guard.
  return CAT.products.some(product =>
    !product.outside &&
    linked(id, product.id) &&
    (currentPlay.custom
      ? st.on.includes(product.id)
      : currentPlay.products.includes(product.id))
  );
}

function addKnowledgeProduct(id) {
  // Recheck at activation time. Duplicate or stale requests have no effect.
  if (!canAddKnowledgeProduct(id)) return false;
  const currentPlay = play();
  if (currentPlay.custom && !P[id].outside && currentPlay.products.includes(id)) {
    addProduct(id);
  } else {
    addOutside(id);
  }
  // These host commands already render, save, publish and maintain selection.
  // Do not write st, localStorage, service choices, rates or totals here.
  return has(id);
}

function syncKnowledgeExplorer() {
  const region = document.getElementById('knowledge-model-section');
  if (region) region.hidden = !play() || !knowledgeExplorer;
  if (knowledgeExplorer) knowledgeExplorer.sync();
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
      getPlayName: () => (play() ? play().label : ''),
      // prods() covers fixed plays, custom products, add-ons and outside systems.
      // st.on alone only covers the custom-play Adobe products.
      getCanvasProductIds: () => prods().map(product => product.id),
      canAddProduct: canAddKnowledgeProduct,
      onAddProduct: addKnowledgeProduct
      // Omit onInspectService: the explorer can show catalog service details.
      // No service-specific host navigation API was verified in this snapshot.
    });
  }
}
