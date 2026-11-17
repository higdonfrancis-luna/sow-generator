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
      const ref = {url:url.href,title:root.ProductCopy ? root.ProductCopy.scrub(title) : title};
      if (r.partner === true) ref.partner = true;
      out.push(ref);
    }
    return out;
  }
  /* Nov 17: a reference marked partner (Adobe Support and Services on the Coworker services) is proof for the partner. The
     partner's screens show it; what the client reads (the statement of work's appendix, the services CSV) uses forClient */
  const forClient = subject => list(subject).filter(r => !r.partner);
  const link = r => '<a href="'+escape(r.url)+'" target="_blank" rel="noopener">'+escape(r.title)+'</a>';
  function supporting(subject, includePrimary = false) {
    const refs = list(subject).slice(includePrimary ? 0 : 1);
    return refs.length ? '<details class="capability-references"><summary>Supporting references ('+refs.length+')</summary><ul>'+refs.map(r=>'<li>'+link(r)+'</li>').join('')+'</ul></details>' : '';
  }
  function html(subject) {
    const refs = list(subject);
    return refs.length ? '<p class="service-source">Capability reference: '+link(refs[0])+'</p>'+supporting(subject) : '';
  }
  /* step 68: in the statement of work the references sit in an appendix, each service's under its own heading */
  function documentHTML(subject, heading) {
    const refs = forClient(subject);
    return refs.length ? '<div class="sow-detail"><h4>'+escape(heading)+'</h4><ul>'+refs.map(r=>'<li>'+link(r)+'</li>').join('')+'</ul></div>' : '';
  }
  function inContext(subject, brandVisibility) {
    return {references:list(subject).filter(r => brandVisibility || !r.url.includes('/brand-visibility/'))};
  }
  root.CapabilityReferences = {list, forClient, supporting, html, documentHTML, inContext};
})(globalThis);
