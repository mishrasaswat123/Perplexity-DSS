export function generateRecommendation(input) {
  const macro = input?.macro || {};
  const portfolio = input?.currentPortfolio || {};

  const rate = Number(macro.interestRates ?? 0);
  const liquidity = String(macro.liquidity ?? "neutral").toLowerCase();
  const crude = Number(macro.crude ?? 0);
  const fiiFlow = Number(macro.fiiFlow ?? 0);

  const score =
    (rate > 7 ? -2 : rate > 6 ? -1 : 1) +
    (liquidity === "tight" ? -2 : liquidity === "easy" ? 2 : 0) +
    (crude > 85 ? -1 : crude < 75 ? 1 : 0) +
    (fiiFlow > 0 ? 1 : fiiFlow < 0 ? -1 : 0);

  let confidence = "medium";
  let horizon = "medium-term";
  let insight = "Macro conditions are mixed.";
  let rebalance = [];
  let reasons = [];

  if (score >= 3) {
    confidence = "high";
    insight = "Risk assets look supported.";
    rebalance = [{ sector: "equity", action: "overweight", by: "5%" }];
    reasons = ["Rates are supportive", "Liquidity is constructive", "Macro score is positive"];
  } else if (score <= -2) {
    confidence = "high";
    insight = "Defensive positioning is more attractive.";
    rebalance = [{ sector: "equity", action: "underweight", by: "5%" }];
    reasons = ["Rates or liquidity are unfavorable", "Macro score is negative", "Defensive stance preferred"];
  } else {
    confidence = "medium";
    rebalance = [{ sector: "equity", action: "neutral", by: "0%" }];
    reasons = ["Signals are balanced", "No strong portfolio shift", "Wait for confirmation"];
  }

  return {
    insight,
    rebalance,
    confidence,
    horizon,
    currentPortfolio: portfolio,
    targetPortfolio: portfolio,
    reasons
  };
}