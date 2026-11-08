/* Shared by the two self-contained pages and their downloadable SOW. */
(function (root) {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function list(subject) {
    const s = subject && typeof subject === 'object' ? subject : {}, out = [], seen = new Set();
    const primary = typeof s.source === 'object' ? s.source : {url:s.source || s.url,title:s.sourceTitle || s.src};
    for (const r of [primary, {url:s.source2,title:s.sourceTitle2}, ...(Array.isArray(s.references) ? s.references : [])]) {
      if (!r || typeof r.url !== 'string') continue;
      let url; try { url = new URL(r.url); } catch (_) { continue; }
      if (url.protocol !== 'https:' || url.username || url.password || seen.has(url.href)) continue;
      seen.add(url.href); const title=typeof r.title === 'string' && r.title.trim() ? r.title.trim() : url.href;
      out.push({url:url.href,title:root.ProductCopy ? root.ProductCopy.scrub(title) : title});
    }
    return out;
  }
  const link = r => '<a href="'+escape(r.url)+'" target="_blank" rel="noopener">'+escape(r.title)+'</a>';
  function supporting(subject, includePrimary = false) {
    const refs = list(subject).slice(includePrimary ? 0 : 1);
    return refs.length ? '<details class="capability-references"><summary>Supporting references ('+refs.length+')</summary><ul>'+refs.map(r=>'<li>'+link(r)+'</li>').join('')+'</ul></details>' : '';
  }
  function html(subject) {
    const refs = list(subject);
    return refs.length ? '<p class="service-source">Capability reference: '+link(refs[0])+'</p>'+supporting(subject) : '';
  }
  function documentHTML(subject) {
    const refs = list(subject);
    return refs.length ? '<div class="sow-detail"><h4>Capability references</h4><ul>'+refs.map(r=>'<li>'+link(r)+'</li>').join('')+'</ul></div>' : '';
  }
  function inContext(subject, brandVisibility) {
    return {references:list(subject).filter(r => brandVisibility || !r.url.includes('/brand-visibility/'))};
  }
  root.CapabilityReferences = {list, supporting, html, documentHTML, inContext};
})(globalThis);
