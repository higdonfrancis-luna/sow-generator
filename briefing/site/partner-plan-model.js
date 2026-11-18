(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PartnerPlan = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Planning assumptions only. Close rates describe wins during the target year.
  // Contract value, annualized won value and recognized revenue remain separate.
  const defaultInputs = Object.freeze({
    mode: 'sourced',
    valueBasis: 'annual',
    contractYears: 3,
    recognitionFraction: 0.5,
    tiers: Object.freeze([
      Object.freeze({ name: 'Strategic', partners: 10, dealsPerPartner: 5, dealValue: 400000, closeRate: 0.25 }),
      Object.freeze({ name: 'Midsize', partners: 20, dealsPerPartner: 5, dealValue: 200000, closeRate: 0.25 }),
      Object.freeze({ name: 'Specialist', partners: 20, dealsPerPartner: 5, dealValue: 50000, closeRate: 0.25 })
    ])
  });
  const totalKeys = ['partners', 'targetDeals', 'requiredOpportunities', 'pipelineValue', 'expectedWins', 'closedContractValue', 'annualizedWonValue', 'recognizedRevenue'];
  const tierKeys = ['name', 'partners', 'dealsPerPartner', 'dealValue', 'closeRate'];

  function object(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(label + ' must be an object');
  }
  function number(value, label, maximum) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > maximum) {
      throw new RangeError(label + ' must be a finite number between 0 and ' + maximum);
    }
  }
  function finite(value, label) {
    if (!Number.isFinite(value)) throw new RangeError(label + ' exceeds the supported numeric range');
    return value;
  }

  function calculate(input) {
    if (input === undefined) input = defaultInputs;
    object(input, 'inputs');
    for (const key of Object.keys(input)) {
      if (!Object.prototype.hasOwnProperty.call(defaultInputs, key)) throw new TypeError('Unknown input: ' + key);
    }
    const x = Object.assign({}, defaultInputs, input);
    if (x.mode !== 'sourced' && x.mode !== 'won') throw new RangeError('mode must be sourced or won');
    if (x.valueBasis !== 'annual' && x.valueBasis !== 'tcv') throw new RangeError('valueBasis must be annual or tcv');
    if (!Number.isSafeInteger(x.contractYears) || x.contractYears < 1) throw new RangeError('contractYears must be a positive safe integer');
    number(x.recognitionFraction, 'recognitionFraction', 1);
    if (!Array.isArray(x.tiers)) throw new TypeError('tiers must be an array');

    const warnings = [];
    const tiers = x.tiers.map((tier, index) => {
      const label = 'tiers[' + index + ']';
      object(tier, label);
      for (const key of Object.keys(tier)) if (!tierKeys.includes(key)) throw new TypeError('Unknown tier input: ' + key);
      if (typeof tier.name !== 'string' || !tier.name.trim()) throw new TypeError(label + '.name must be a nonempty string');
      for (const key of ['partners', 'dealsPerPartner', 'dealValue']) number(tier[key], label + '.' + key, Number.MAX_VALUE);
      number(tier.closeRate, label + '.closeRate', 1);

      const targetDeals = finite(tier.partners * tier.dealsPerPartner, label + '.targetDeals');
      const expectedWins = x.mode === 'won' ? targetDeals : finite(targetDeals * tier.closeRate, label + '.expectedWins');
      let requiredOpportunities = targetDeals;
      if (x.mode === 'won') {
        requiredOpportunities = targetDeals === 0 ? 0 : tier.closeRate > 0 ? finite(targetDeals / tier.closeRate, label + '.requiredOpportunities') : null;
      }
      if (requiredOpportunities === null) {
        warnings.push(tier.name + ': a positive won-deal target cannot be supported by a 0% close rate; required opportunities and pipeline are not calculable.');
      }
      const pipelineValue = requiredOpportunities === null ? null : finite(requiredOpportunities * tier.dealValue, label + '.pipelineValue');
      const closedContractValue = finite(expectedWins * tier.dealValue, label + '.closedContractValue');
      const annualizedWonValue = closedContractValue / (x.valueBasis === 'annual' ? 1 : x.contractYears);
      const recognizedRevenue = annualizedWonValue * x.recognitionFraction;
      return Object.assign({}, tier, { targetDeals, requiredOpportunities, pipelineValue, expectedWins, closedContractValue, annualizedWonValue, recognizedRevenue });
    });

    const result = { tiers, warnings };
    for (const key of totalKeys) {
      result[key] = tiers.some(tier => tier[key] === null) ? null : tiers.reduce((sum, tier) => finite(sum + tier[key], 'total ' + key), 0);
    }
    return result;
  }

  return Object.freeze({ defaultInputs, calculate });
});
