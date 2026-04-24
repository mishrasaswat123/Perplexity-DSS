function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function normalizePortfolio(portfolio = {}) {
  const equity = clampPercent(portfolio.equity);
  const debt = clampPercent(portfolio.debt);
  const total = equity + debt || 100;
  return {
    equity: Number(((equity / total) * 100).toFixed(1)),
    debt: Number(((debt / total) * 100).toFixed(1))
  };
}

export function generateRecommendation(input = {}) {
  const macro = input.macro || {};
  const currentPortfolio = normalizePortfolio(input.currentPortfolio || {});

  const rate = Number(macro.interestRates ?? 0);
  const liquidity = String(macro.liquidity ?? "neutral").toLowerCase();
  const crude = Number(macro.crude ?? 0);
  const fiiFlow = Number(macro.fiiFlow ?? 0);

  let score = 0;
  if (rate <= 6) score += 2;
  else if (rate <= 7) score += 1;
  else score -= 2;

  if (liquidity === "easy") score += 2;
  else if (liquidity === "neutral") score += 0;
  else if (liquidity === "tight") score -= 2;

  if (crude < 75) score += 1;
  else if (crude > 85) score -= 1;

  if (fiiFlow > 0) score += 1;
  else if (fiiFlow < 0) score -= 1;

  let confidence = "medium";
  let horizon = "medium-term";
  let insight = "Macro conditions are balanced.";
  let rebalance = [];
  let reasons = [];
  let targetPortfolio = { ...currentPortfolio };

  if (score >= 4) {
    confidence = "high";
    horizon = "6-12 months";
    insight = "Risk assets look supported, so equity can be modestly increased.";
    targetPortfolio = { equity: 65, debt: 35 };
    rebalance = [
      { asset: "equity", action: "overweight", from: currentPortfolio.equity, to: 65, delta: "+5" },
      { asset: "debt", action: "underweight", from: currentPortfolio.debt, to: 35, delta: "-5" }
    ];
    reasons = [
      "Rates are supportive",
      "Liquidity is constructive",
      "Macro score is strongly positive"
    ];
  } else if (score <= -2) {
    confidence = "high";
    horizon = "3-6 months";
    insight = "Defensive positioning is more attractive, so equity should be reduced.";
    targetPortfolio = { equity: 50, debt: 50 };
    rebalance = [
      { asset: "equity", action: "underweight", from: currentPortfolio.equity, to: 50, delta: "-10" },
      { asset: "debt", action: "overweight", from: currentPortfolio.debt, to: 50, delta: "+10" }
    ];
    reasons = [
      "Rates or liquidity are unfavorable",
      "Macro score is negative",
      "Capital preservation is preferred"
    ];
  } else {
    confidence = "medium";
    horizon = "3-6 months";
    insight = "Signals are mixed, so maintain a balanced allocation.";
    targetPortfolio = { ...currentPortfolio };
    rebalance = [
      { asset: "equity", action: "neutral", from: currentPortfolio.equity, to: currentPortfolio.equity, delta: "0" },
      { asset: "debt", action: "neutral", from: currentPortfolio.debt, to: currentPortfolio.debt, delta: "0" }
    ];
    reasons = [
      "Signals are balanced",
      "No strong macro conviction",
      "Wait for clearer confirmation"
    ];
  }

  return {
    insight,
    rebalance,
    confidence,
    horizon,
    currentPortfolio,
    targetPortfolio,
    reasons
  };
}