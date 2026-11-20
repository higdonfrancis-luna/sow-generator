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
    // Nov 19 2026 (Adam approved the pickers): the version a client has of Workfront and of Adobe Commerce, picked inside their boxes.
    // What each version makes unavailable is in the catalog ('versions'). A canvas saved before the pickers gets the version that keeps its services and totals.
    // New keys: the scope questions' old answers (commerce, workfront) stay dropped.
    workfrontVersion: {label: 'Workfront version', options: [
      ['before', 'Bought before March 12, 2026'], ['after', 'Bought after March 12, 2026']
    ]},
    commerceVersion: {label: 'Commerce version', options: [
      ['', 'Choose a version'], ['onprem', 'On-premises'], ['paas', 'On Cloud'], ['saas', 'Cloud Service']
    ]},
    ajoPackage: {label: 'Journey Optimizer package', clearable: true, options: [
      ['', 'Choose a package'], ['select', 'Select'], ['prime', 'Prime'], ['ultimate', 'Ultimate'], ['starter', 'Ultimate Starter']
    ]},
    assetsPackage: {label: 'AEM Assets package', clearable: true, options: [
      ['', 'Choose a package'], ['prime', 'Prime'], ['ultimate', 'Ultimate']
    ]},
    sitesDeployment: {label: 'AEM Sites deployment', clearable: true, options: [
      ['', 'Choose a deployment'], ['cloud', 'Cloud Service'], ['lts', '6.5 LTS'], ['v65', '6.5']
    ]},
    targetEdition: {label: 'Target edition', clearable: true, options: [
      ['', 'Choose an edition'], ['standard', 'Standard'], ['premium', 'Premium']
    ]},
    frameVersion: {label: 'Frame.io version', clearable: true, options: [
      ['', 'Choose a version'], ['legacy', 'Legacy'], ['v4select', 'V4 Select'], ['v4prime', 'V4 Prime']
    ]},
    marketoPackage: {label: 'Marketo Engage package', clearable: true, options: [
      ['', 'Choose a package'], ['growth', 'Growth'], ['select', 'Select'], ['prime', 'Prime'], ['ultimate', 'Ultimate']
    ]},
    workflowPackage: {label: 'Workflow package', clearable: true, options: [
      ['', 'Choose a package'], ['select', 'Select'], ['prime', 'Prime'], ['ultimate', 'Ultimate'], ['fusion', 'Ultimate + Fusion']
    ]}
  };
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
      if (choice.options.some(([id]) => id === value)) result[key] = value;
    }
    // An unanswered choice on a saved quote is distinct from a pre-dropdown draft.
    for (const key of ['authoring', 'commerceVersion']) if (Object.hasOwn(values || {}, key) && !result[key]) result[key] = '';
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
    // Quotes saved before the picker used Workfront Proof.
    if (!Object.hasOwn(result, 'workfrontVersion')) result.workfrontVersion = 'before';
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
    // The Commerce to Edge Delivery connection already scopes the storefront build.
    if (id === 'ACO09' && hasProduct('commerce') && !hasProduct('ocp')) return false;
    if (hasProduct('aemsites') && hasProduct('eds')) {
      if (['SI02', 'SI04', 'SI06', 'SI13'].includes(id)) return false;
      if (['AXA04', 'AXA05'].includes(id) && !selected('AXD04')) return false;
      if (id === 'AXC01' && hasProduct('bv') && selected('A01')) return false;
    }
    return catalogDefault;
  }
  function newDecisions() {
    return {authoring: '', workfrontVersion: 'after', commerceVersion: 'saas',
      ...Object.fromEntries(Object.entries(choices).filter(([, choice]) => choice.clearable).map(([key]) => [key, '']))};
  }
  function startingService(id, catalogDefault, play, useNewDefaults) {
    if (!useNewDefaults) return catalogDefault;
    if (CanvasServiceDefaults.off[play]?.includes(id)) return false;
    return catalogDefault || CanvasServiceDefaults.on.includes(id);
  }
  function versionReason(versions, id, decisions, hasProduct) {
    for (const [key, version] of Object.entries(versions)) {
      if (!hasProduct(version.product)) continue;
      for (const gate of version.gates) {
        if (gate.ids.includes(id) && (!gate.when || gate.when.includes(decisions[key]))
            && (!gate.only || !gate.only.includes(decisions[key]))
            && (!gate.with || hasProduct(gate.with)) && !(gate.unless && hasProduct(gate.unless))) return gate.reason;
      }
    }
    return '';
  }
  const commerceNames = {onprem: 'Adobe Commerce on-premises', paas: 'Adobe Commerce on Cloud', saas: 'Adobe Commerce as a Cloud Service'};
  return {choices, normalize, restoreDecisions, hasProduct, defaultSelection, newDecisions, startingService,
    versionReason, commerceNames, trackingOverlap, trackingNote, authoringText};
})();
