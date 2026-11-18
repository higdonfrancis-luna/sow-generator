(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.WarroomROI = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Every preset is an illustrative sensitivity case, not an observed result,
  // probability interval, Adobe forecast or industry benchmark. USD throughout.
  const presets = {
    conservative: {
      activePartners: 50, opportunitiesPerPartnerYear: 12, currentSubmitRate: 0.5,
      hoursBefore: 32, hoursAfter: 24, reinvestmentFraction: 0.5,
      baselineWinRate: 0.2, winRateUpliftPp: 0, addedSubmissionWinRate: 0.15,
      ramp: 0.5, licenseARRPerWin: 25000, attribution: 0.25, realization: 0.5,
      rolloutCost: 25000, annualRunBudget: 75000,
      recognitionFraction: 0.5, contributionMargin: 0.75,
      partnerLoadedHourlyCost: 100, cashSavingsFraction: 0,
      delayMonths: 1, irrecoverableShare: 0
    },
    base: {
      activePartners: 100, opportunitiesPerPartnerYear: 18, currentSubmitRate: 0.5,
      hoursBefore: 32, hoursAfter: 16, reinvestmentFraction: 0.5,
      baselineWinRate: 0.2, winRateUpliftPp: 2, addedSubmissionWinRate: 0.2,
      ramp: 0.65, licenseARRPerWin: 50000, attribution: 0.35, realization: 0.65,
      rolloutCost: 50000, annualRunBudget: 150000,
      recognitionFraction: 0.5, contributionMargin: 0.75,
      partnerLoadedHourlyCost: 100, cashSavingsFraction: 0,
      delayMonths: 1, irrecoverableShare: 0
    },
    stretch: {
      activePartners: 200, opportunitiesPerPartnerYear: 24, currentSubmitRate: 0.5,
      hoursBefore: 32, hoursAfter: 12, reinvestmentFraction: 0.5,
      baselineWinRate: 0.2, winRateUpliftPp: 4, addedSubmissionWinRate: 0.2,
      ramp: 0.75, licenseARRPerWin: 75000, attribution: 0.5, realization: 0.75,
      rolloutCost: 100000, annualRunBudget: 300000,
      recognitionFraction: 0.5, contributionMargin: 0.75,
      partnerLoadedHourlyCost: 100, cashSavingsFraction: 0,
      delayMonths: 1, irrecoverableShare: 0
    }
  };

  const defaults = {
    activePartners: 0, opportunitiesPerPartnerYear: 0, currentSubmitRate: 0,
    hoursBefore: 32, hoursAfter: 32, reinvestmentFraction: 0,
    baselineWinRate: 0, winRateUpliftPp: 0, addedSubmissionWinRate: null,
    ramp: 1, licenseARRPerWin: 0, attribution: 0, realization: 1,
    rolloutCost: 0, annualRunBudget: 0,
    recognitionFraction: null, contributionMargin: null,
    partnerLoadedHourlyCost: null, cashSavingsFraction: 0,
    delayMonths: 1, irrecoverableShare: 0
  };

  function assertNumber(name, value, min, max, nullable) {
    if (nullable && value === null) return;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(name + ' must be a finite number from ' + min + ' to ' + max);
    }
  }
  function ratio(n, d) { return d > 0 ? n / d : null; }

  function calculate(input) {
    if (input === undefined) input = {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('inputs must be an object');
    for (const key of Object.keys(input)) {
      if (!Object.prototype.hasOwnProperty.call(defaults, key)) throw new TypeError('Unknown input: ' + key);
    }
    const x = Object.assign({}, defaults, input);
    for (const key of ['activePartners', 'opportunitiesPerPartnerYear', 'hoursBefore', 'licenseARRPerWin', 'rolloutCost', 'annualRunBudget', 'delayMonths']) {
      assertNumber(key, x[key], 0, Number.MAX_VALUE);
    }
    assertNumber('hoursAfter', x.hoursAfter, Number.MIN_VALUE, Number.MAX_VALUE);
    for (const key of ['currentSubmitRate', 'reinvestmentFraction', 'baselineWinRate', 'ramp', 'attribution', 'realization', 'cashSavingsFraction', 'irrecoverableShare']) {
      assertNumber(key, x[key], 0, 1);
    }
    for (const key of ['recognitionFraction', 'contributionMargin', 'addedSubmissionWinRate']) assertNumber(key, x[key], 0, 1, true);
    assertNumber('partnerLoadedHourlyCost', x.partnerLoadedHourlyCost, 0, Number.MAX_VALUE, true);
    assertNumber('winRateUpliftPp', x.winRateUpliftPp, -100, 100);
    const uplift = x.winRateUpliftPp / 100;
    const postToolWinRate = x.baselineWinRate + uplift;
    if (postToolWinRate < -1e-12 || postToolWinRate > 1 + 1e-12) throw new RangeError('baselineWinRate + winRateUpliftPp / 100 must be between 0 and 1');
    const w1 = Math.max(0, Math.min(1, postToolWinRate));
    const wAdded = x.addedSubmissionWinRate === null ? w1 : x.addedSubmissionWinRate;

    function funnel(ramp) {
      const qualifiedOpportunities = x.activePartners * x.opportunitiesPerPartnerYear * ramp;
      const baselineSubmissions = qualifiedOpportunities * x.currentSubmitRate;
      const unsubmittedOpportunities = qualifiedOpportunities - baselineSubmissions;
      const hoursReleased = baselineSubmissions * (x.hoursBefore - x.hoursAfter);
      const hoursAvailableForAdditionalSubmissions = Math.max(0, hoursReleased) * x.reinvestmentFraction;
      const additionalCapacity = hoursAvailableForAdditionalSubmissions / x.hoursAfter;
      const addedSubmissions = Math.min(unsubmittedOpportunities, additionalCapacity);
      const hoursReinvested = addedSubmissions * x.hoursAfter;
      const hoursRemaining = hoursReleased - hoursReinvested;
      const baselineExpectedWins = baselineSubmissions * x.baselineWinRate;
      const incrementalWinsFromMoreSubmissions = addedSubmissions * wAdded;
      const incrementalWinsFromWinRate = baselineSubmissions * uplift;
      const incrementalExpectedWins = incrementalWinsFromMoreSubmissions + incrementalWinsFromWinRate;
      return {
        qualifiedOpportunities, baselineSubmissions, unsubmittedOpportunities,
        hoursReleased, hoursAvailableForAdditionalSubmissions, additionalCapacity,
        addedSubmissions, totalSubmissions: baselineSubmissions + addedSubmissions,
        hoursReinvested, hoursRemaining, baselineExpectedWins,
        incrementalWinsFromMoreSubmissions, incrementalWinsFromWinRate,
        incrementalExpectedWins, totalExpectedWins: baselineExpectedWins + incrementalExpectedWins,
        demandCapApplied: additionalCapacity > unsubmittedOpportunities
      };
    }

    const annual = funnel(x.ramp);
    const steady = funnel(1);
    const attributableIncrementalWins = annual.incrementalExpectedWins * x.attribution;
    const realizedAttributableIncrementalWins = attributableIncrementalWins * x.realization;
    const attributableARRIfAllCohortsRealize = attributableIncrementalWins * x.licenseARRPerWin;
    const modeledYearEndIncrementalARR = attributableARRIfAllCohortsRealize * x.realization;
    const pendingCohortARRPotential = attributableARRIfAllCohortsRealize * (1 - x.realization);
    const firstYearCost = x.rolloutCost + x.annualRunBudget;
    const modeledYearOneSubscriptionRevenue = x.recognitionFraction === null ? null : modeledYearEndIncrementalARR * x.recognitionFraction;
    const modeledYearOneContribution = modeledYearOneSubscriptionRevenue === null || x.contributionMargin === null ? null : modeledYearOneSubscriptionRevenue * x.contributionMargin;
    const modeledNetContribution = modeledYearOneContribution === null ? null : modeledYearOneContribution - firstYearCost;
    const modeledFirstYearROI = modeledNetContribution === null ? null : ratio(modeledNetContribution, firstYearCost);
    const unitContribution = x.recognitionFraction === null || x.contributionMargin === null ? null : x.licenseARRPerWin * x.attribution * x.realization * x.recognitionFraction * x.contributionMargin;
    const rawIncrementalWinsNeeded = unitContribution === null ? null : ratio(firstYearCost, unitContribution);
    const arrContributionFactor = x.recognitionFraction === null || x.contributionMargin === null ? null : x.recognitionFraction * x.contributionMargin;
    const yearEndARRNeeded = arrContributionFactor === null ? null : ratio(firstYearCost, arrContributionFactor);
    const winRateDenominator = x.addedSubmissionWinRate === null ? annual.totalSubmissions : annual.baselineSubmissions;
    const volumeWinsAtZeroUplift = annual.addedSubmissions * (x.addedSubmissionWinRate === null ? x.baselineWinRate : wAdded);
    const breakEvenUplift = rawIncrementalWinsNeeded === null ? null : ratio(rawIncrementalWinsNeeded - volumeWinsAtZeroUplift, winRateDenominator);
    // A threshold below the lowest valid rate means every valid rate covers
    // cost, rather than making the break-even requirement unattainable.
    const breakEvenUpliftFeasible = breakEvenUplift === null ? null : x.baselineWinRate + breakEvenUplift <= 1;
    const breakEvenCoveredAcrossValidRates = breakEvenUplift === null ? null : breakEvenUplift < -x.baselineWinRate;
    const perPartnerContribution = modeledYearOneContribution === null ? null : ratio(modeledYearOneContribution, x.activePartners);

    const monthlyARRCohortPotential = steady.incrementalExpectedWins * x.attribution * x.licenseARRPerWin / 12;
    const delayedCohortARRPotential = monthlyARRCohortPotential * x.delayMonths;
    const grossLaborCapacityValue = x.partnerLoadedHourlyCost === null ? null : annual.hoursReleased * x.partnerLoadedHourlyCost;
    const residualLaborCapacityValue = x.partnerLoadedHourlyCost === null ? null : annual.hoursRemaining * x.partnerLoadedHourlyCost;
    const modeledPartnerCashSavings = residualLaborCapacityValue === null ? null : Math.max(0, residualLaborCapacityValue) * x.cashSavingsFraction;
    const warnings = [];
    if (x.hoursAfter > x.hoursBefore) warnings.push('Hours per proposal increase: residual capacity is negative; the baseline workload requires more labor. The model does not silently create additional submissions.');
    if (annual.incrementalExpectedWins < 0) warnings.push('The assumed win-rate decrease outweighs added volume: modeled Adobe ARR impact is negative.');
    if (x.ramp === 0) warnings.push('No productive adoption in this period; first-year program costs still apply.');
    if (x.attribution === 0) warnings.push('No Adobe commercial outcome is attributed to the tool.');
    if (x.cashSavingsFraction > 0) warnings.push('Partner cash savings require an actual reduction in spend; released employee time alone is capacity.');

    return {
      inputs: x,
      rates: { uplift, postToolWinRate: w1, addedSubmissionWinRate: wAdded },
      annual,
      partner: { grossLaborCapacityValue, residualLaborCapacityValue, modeledPartnerCashSavings },
      adobe: {
        attributableIncrementalWins, realizedAttributableIncrementalWins,
        attributableARRIfAllCohortsRealize, modeledYearEndIncrementalARR, pendingCohortARRPotential,
        modeledYearOneSubscriptionRevenue, modeledYearOneContribution,
        firstYearCost, modeledNetContribution, modeledFirstYearROI,
        arrToFirstYearCostRatio: ratio(modeledYearEndIncrementalARR, firstYearCost)
      },
      breakEven: {
        rawIncrementalWinsNeeded, yearEndARRNeeded,
        winRateUpliftPpNeeded: breakEvenUplift === null ? null : breakEvenUplift * 100,
        minimumValidWinRateUpliftPpNeeded: breakEvenUplift === null ? null : Math.max(-x.baselineWinRate, breakEvenUplift) * 100,
        winRateUpliftFeasible: breakEvenUpliftFeasible,
        coveredAcrossAllValidWinRates: breakEvenCoveredAcrossValidRates,
        activePartnersNeededAtFixedCost: perPartnerContribution === null ? null : ratio(firstYearCost, perPartnerContribution)
      },
      delay: {
        monthlyARRCohortPotential, delayedCohortARRPotential,
        permanentlyForegoneARRPotential: delayedCohortARRPotential * x.irrecoverableShare,
        deferredARRPotential: delayedCohortARRPotential * (1 - x.irrecoverableShare),
        interpretation: 'Annual contract value associated with modeled opportunity cohorts at full assumed adoption. Not monthly revenue, proven loss, or a sales forecast. Irrecoverable share is an explicit assumption; deferred cohorts may shift later.'
      },
      warnings,
      notes: [
        'Qualified opportunities must be unique across the partner portfolio and capable of creating incremental Adobe subscription value. Exclude services-only work, unchanged renewals and deals merely transferred between partners.',
        'Ramp is productive partner exposure during the year; realization is the share of modeled incremental outcomes active by year end. Do not use realization as a second win probability.',
        'Recognition and contribution margin are optional planning assumptions. ARR is annualized contract value, not first-year revenue, cash, profit or multiyear TCV.',
        'Partner capacity and Adobe commercial outcomes have different beneficiaries and must not be summed into an Adobe savings claim.',
        'Fractional submissions and wins represent aggregate expected values, not individual completed proposals or signed contracts.'
      ]
    };
  }

  function buildCostHypothesis(input) {
    const x = Object.assign({ people: 6, months: 6, projectCost: 2000000 }, input || {});
    for (const key of ['people', 'months', 'projectCost']) assertNumber(key, x[key], 0, Number.MAX_VALUE);
    const staffMonths = x.people * x.months;
    const impliedCostPerStaffMonth = ratio(x.projectCost, staffMonths);
    return { inputs: x, staffMonths, impliedCostPerStaffMonth,
      impliedAnnualCostPerStaff: impliedCostPerStaffMonth === null ? null : impliedCostPerStaffMonth * 12,
      status: 'Counterfactual project-cost hypothesis. Not independently validated replacement value, realized savings, or actual Adobe cost.' };
  }

  // Dollar values may be combined only if the other-Adobe input excludes BV.
  // Deal counts also require a separate, explicit cohort overlap statement.
  function calculatePortfolio(input) {
    if (!input || !input.brandVisibility || !input.otherAdobe) throw new TypeError('brandVisibility and otherAdobe input objects are required');
    const brandVisibility = calculate(input.brandVisibility);
    const otherAdobe = calculate(input.otherAdobe);
    const year = input.year === undefined ? 2027 : input.year;
    assertNumber('year', year, 2000, 2200);
    const sharedRolloutCost = input.sharedRolloutCost === undefined ? 0 : input.sharedRolloutCost;
    const sharedAnnualRunBudget = input.sharedAnnualRunBudget === undefined ? 0 : input.sharedAnnualRunBudget;
    assertNumber('sharedRolloutCost', sharedRolloutCost, 0, Number.MAX_VALUE);
    assertNumber('sharedAnnualRunBudget', sharedAnnualRunBudget, 0, Number.MAX_VALUE);
    const cohortRelationship = input.cohortRelationship === undefined ? 'unknown' : input.cohortRelationship;
    if (!['unknown', 'disjoint', 'overlap'].includes(cohortRelationship)) throw new RangeError('cohortRelationship must be unknown, disjoint or overlap');
    const overlappingRealizedAttributableWins = input.overlappingRealizedAttributableWins === undefined ? null : input.overlappingRealizedAttributableWins;
    const bvWins = brandVisibility.adobe.realizedAttributableIncrementalWins;
    const otherWins = otherAdobe.adobe.realizedAttributableIncrementalWins;
    if (overlappingRealizedAttributableWins !== null) assertNumber('overlappingRealizedAttributableWins', overlappingRealizedAttributableWins, 0, Math.max(0, Math.min(bvWins, otherWins)));
    if (cohortRelationship === 'overlap' && overlappingRealizedAttributableWins === null) throw new TypeError('overlap requires overlappingRealizedAttributableWins on the same attribution/realization basis');
    if (cohortRelationship !== 'overlap' && overlappingRealizedAttributableWins !== null) throw new TypeError('An overlap count requires cohortRelationship: overlap');
    let uniqueRealizedAttributableWinEquivalents = null;
    if (bvWins >= 0 && otherWins >= 0) {
      if (cohortRelationship === 'disjoint') uniqueRealizedAttributableWinEquivalents = bvWins + otherWins;
      if (cohortRelationship === 'overlap') uniqueRealizedAttributableWinEquivalents = bvWins + otherWins - overlappingRealizedAttributableWins;
    }
    const valueStreamsDisjoint = input.valueStreamsDisjoint === true;
    const warnings = [];
    if (!valueStreamsDisjoint) warnings.push('Combined dollars suppressed: confirm the other-Adobe stream excludes every dollar of Brand Visibility subscription value.');
    if (cohortRelationship === 'unknown') warnings.push('Combined deal count suppressed: customer/opportunity overlap is unknown. Separate product revenues can coexist on the same deal.');
    const cost = brandVisibility.adobe.firstYearCost + otherAdobe.adobe.firstYearCost + sharedRolloutCost + sharedAnnualRunBudget;
    // BV-first decision gate: can BV alone justify the entire program budget?
    // This comparison does not charge the shared cost twice in combined totals.
    const bvFullCostCase = calculate(Object.assign({}, input.brandVisibility, { rolloutCost: cost, annualRunBudget: 0 }));
    const brandVisibilityInvestmentGate = {
      entireProgramCost: cost,
      modeledBVContribution: bvFullCostCase.adobe.modeledYearOneContribution,
      modeledBVContributionAfterEntireProgramCost: bvFullCostCase.adobe.modeledNetContribution,
      modeledBVOnlyROI: bvFullCostCase.adobe.modeledFirstYearROI,
      breakEven: bvFullCostCase.breakEven,
      interpretation: 'Compare Brand Visibility contribution alone with the entire shared program budget. This is a decision comparison; the budget is charged only once in combined results.'
    };
    const revenueKnown = brandVisibility.adobe.modeledYearOneSubscriptionRevenue !== null && otherAdobe.adobe.modeledYearOneSubscriptionRevenue !== null;
    const contributionKnown = brandVisibility.adobe.modeledYearOneContribution !== null && otherAdobe.adobe.modeledYearOneContribution !== null;
    let combined = null;
    if (valueStreamsDisjoint) {
      const revenue = revenueKnown ? brandVisibility.adobe.modeledYearOneSubscriptionRevenue + otherAdobe.adobe.modeledYearOneSubscriptionRevenue : null;
      const contribution = contributionKnown ? brandVisibility.adobe.modeledYearOneContribution + otherAdobe.adobe.modeledYearOneContribution : null;
      combined = {
        modeledYearEndIncrementalARR: brandVisibility.adobe.modeledYearEndIncrementalARR + otherAdobe.adobe.modeledYearEndIncrementalARR,
        modeledYearOneSubscriptionRevenue: revenue,
        modeledYearOneContribution: contribution,
        firstYearCost: cost,
        modeledNetContribution: contribution === null ? null : contribution - cost,
        modeledFirstYearROI: contribution === null ? null : ratio(contribution - cost, cost),
        uniqueRealizedAttributableWinEquivalents
      };
    }
    return { year, brandVisibility, otherAdobe, combined, brandVisibilityInvestmentGate, cohortRelationship, valueStreamsDisjoint, warnings,
      notes: [
        'Brand Visibility is the primary outcome: incremental BV subscription value only. Other Adobe excludes BV value, services and unchanged existing subscriptions.',
        'The same customer can buy both streams. Distinct license dollars may be added; deal counts need explicit deduplication. Win equivalents are modeled causal contributions, not a count of signed contracts.',
        'This annual approximation uses ramp, realization and recognition assumptions. A financed rollout should replace them with monthly adoption, close and service-start cohorts.'
      ] };
  }

  const portfolioPresets = {};
  const otherOpportunities = { conservative: 6, base: 9, stretch: 12 };
  const otherAnnualValues = { conservative: 50000, base: 75000, stretch: 100000 };
  for (const key of Object.keys(presets)) {
    const s = presets[key];
    portfolioPresets[key] = Object.freeze({
      year: 2027,
      brandVisibility: Object.freeze(Object.assign({}, s, { rolloutCost: 0, annualRunBudget: 0 })),
      otherAdobe: Object.freeze(Object.assign({}, s, {
        opportunitiesPerPartnerYear: otherOpportunities[key], licenseARRPerWin: otherAnnualValues[key],
        rolloutCost: 0, annualRunBudget: 0
      })),
      sharedRolloutCost: s.rolloutCost, sharedAnnualRunBudget: s.annualRunBudget,
      valueStreamsDisjoint: true, cohortRelationship: 'disjoint'
    });
  }

  for (const key of Object.keys(presets)) Object.freeze(presets[key]);
  Object.freeze(presets);
  Object.freeze(portfolioPresets);
  return { calculate, calculatePortfolio, presets, portfolioPresets, buildCostHypothesis, version: '2.0.0' };
});
