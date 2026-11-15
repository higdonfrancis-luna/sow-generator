// Shared by the canvas and the SOW, including drafts opened directly on Services.
const CanvasScope = (() => {
  // These are parts of existing service descriptions, not extra billable rows.
  // Replace only the authoring phrases so the selected band, CDN and Brand Visibility wording survives.
  const authoringPhrases = {
    A01: {
      scope: [['set up authoring, the CDN route', {
        '': 'set up the CDN route',
        documents: 'verify that the site renders pages from the configured SharePoint or Google Drive content source and set up the CDN route',
        universal: 'verify that the agreed pages render through Edge Delivery and set up the CDN route'
      }]],
      deliverable: [['configured authoring, CDN route', {
        '': 'CDN route',
        documents: 'verified layouts for document-authored pages, CDN route',
        universal: 'verified page delivery, CDN route'
      }]]
    },
    A02: {
      scope: [['migrate the agreed pages into Edge Delivery documents and blocks', {
        '': 'migrate the agreed pages into the content source confirmed in discovery',
        documents: 'migrate the agreed pages into Word or Google Docs using the agreed Edge Delivery blocks',
        universal: 'migrate the agreed pages into AEM Author using the agreed Edge Delivery blocks'
      }]]
    },
    C03: {
      scope: [['to AEM review and publishing', {
        '': 'to the agreed content review and publishing workflow',
        documents: 'to document review and publishing through Edge Delivery',
        universal: 'to review in AEM Author and publishing through Edge Delivery'
      }]],
      acceptance: [['the approved AEM route', {
        '': 'the agreed publishing workflow',
        documents: 'the document publishing workflow',
        universal: 'the AEM Author publishing workflow'
      }]],
      assumptions: [
        ['the authoring route (AEM or Edge Delivery)', {
          '': 'the source of authored content',
          documents: 'the source document library',
          universal: 'the AEM Author site'
        }],
        ['into AEM itself', {
          '': 'to the source content owners',
          documents: 'to the editors of the source documents',
          universal: 'to the editors in AEM Author'
        }]
      ]
    },
    A05: {
      scope: [
        ['governance checks in AEM', {
          '': 'governance checks for the agreed publishing workflow',
          documents: 'governance checks for document-based publishing',
          universal: 'governance checks for AEM-authored pages'
        }],
        ['training, playbooks, office hours', {
          '': 'training on roles and approvals, playbooks, office hours',
          documents: 'training on governance and approval roles, playbooks, office hours',
          universal: 'training on governance and approval roles, playbooks, office hours'
        }]
      ]
    }
  };
  function authoringText(id, field, text, method) {
    const phrases = authoringPhrases[String(id).replace(/^CANVAS-/, '')]?.[field];
    if (!phrases || typeof text !== 'string') return text;
    for (const [original, byMethod] of phrases) {
      if (Object.hasOwn(byMethod, method)) text = text.replace(original, byMethod[method]);
    }
    return text;
  }
  const choices = {
    authoring: {label: 'Page authoring', options: [
      ['', 'Choose authoring method'], ['universal', 'AEM Universal Editor'],
      ['documents', 'Word or Google Docs']
    ]},
    workfront: {label: 'Workfront approval workflow', options: [
      ['', 'Confirm Unified Approvals'],
      ['unified', 'Unified Approvals on Adobe cloud storage confirmed'],
      ['planned', 'Configure Unified Approvals in the Workfront scope'],
      ['unavailable', 'Unified Approvals unavailable']
    ]},
    commerce: {label: 'Commerce storefront entitlement', options: [
      ['', 'Choose the client’s Commerce license'], ['saas', 'Adobe Commerce as a Cloud Service'],
      ['optimizer', 'Adobe Commerce Optimizer'], ['paas', 'Commerce PaaS or on-premises alone']
    ]},
    cdn: {label: 'CDN log forwarding', options: [
      ['', 'Confirm log forwarding'], ['setup', 'Include partner setup'],
      ['configured', 'Already configured'], ['mixed', 'Set up remaining log sources']
    ]}
  };
  const routes = [
    {choice: 'workfront', products: ['express', 'frameio'], services: ['XJ06']},
    {choice: 'workfront', products: ['frameio', 'aemassets'], services: ['XJ17', 'XJ18']},
    {choice: 'commerce', products: ['commerce', 'eds'], services: ['XA18', 'XA19', 'XA20']},
    {choice: 'cdn', products: ['bv', 'cdn'], services: ['OX1', 'OX2']}
  ];
  const requirements = Object.fromEntries(routes.flatMap(route =>
    route.services.map(id => [id, route.choice])
  ));
  // Services within one workstream can be complementary (for example base page tracking and a new CTA).
  const trackingGroups = [
    ['EDC01'], ['AXA04', 'AXA05', 'AXA06'], ['XA20'], ['XA24'], ['XL11'], ['XL13'], ['XL14'], ['CJ03']
  ];
  const trackingNote = 'Review shared website tracking. Assign each page, event, consent integration and datastream to one owner.';
  function trackingOverlap(isSelected) {
    return trackingGroups.filter(group => group.some(isSelected)).length > 1;
  }
  function normalize(values) {
    const result = {};
    for (const [key, choice] of Object.entries(choices)) {
      const value = values?.[key];
      if (value && choice.options.some(([id]) => id === value)) result[key] = value;
    }
    // An unanswered choice on a saved quote is distinct from a pre-dropdown draft.
    if (Object.hasOwn(values || {}, 'authoring') && !result.authoring) result.authoring = '';
    return result;
  }
  function restoreDecisions(values, actualHas) {
    const result = normalize(values);
    if (!Object.hasOwn(result, 'authoring')) {
      result.authoring = '';
      if (actualHas('eds')) {
        if (actualHas('aemsites')) result.authoring = 'universal';
        else if (actualHas('csrc')) result.authoring = 'documents';
      }
    }
    return result;
  }
  function hasProduct(id, actualHas, decisions) {
    if (actualHas('eds')) {
      if (id === 'aemsites') return decisions?.authoring === 'universal';
      if (id === 'csrc' && decisions?.authoring === 'documents') return true;
    }
    return actualHas(id);
  }
  function defaultSelection(id, catalogDefault, hasProduct, selected, decisions) {
    // Document setup does not establish a Sites Optimizer Ultimate write-back entitlement.
    if (id === 'CS2' && hasProduct('eds') && Object.hasOwn(decisions || {}, 'authoring')) return false;
    if (hasProduct('aemsites') && hasProduct('eds')) {
      if (['SI02', 'SI04', 'SI06'].includes(id)) return false;
      if (['AXA04', 'AXA05'].includes(id) && !selected('AXD04')) return false;
      if (id === 'AXC01' && hasProduct('bv') && selected('A01')) return false;
    }
    return catalogDefault;
  }
  function newDecisions(hasCdn) {
    return hasCdn ? {authoring: '', cdn: 'setup'} : {authoring: ''};
  }
  function allowed(id, values, hasProduct) {
    switch (requirements[id]) {
      case 'workfront': return values?.workfront === 'unified' ||
        (values?.workfront === 'planned' && hasProduct('workfront'));
      case 'commerce': return ['saas', 'optimizer'].includes(values?.commerce);
      case 'cdn': return ['setup', 'mixed'].includes(values?.cdn);
      default: return true;
    }
  }
  return {choices, routes, requirements, normalize, restoreDecisions, hasProduct, defaultSelection, newDecisions, allowed, trackingOverlap, trackingNote, authoringText};
})();
