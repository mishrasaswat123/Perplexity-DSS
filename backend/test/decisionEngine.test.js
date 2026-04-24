import test from "node:test";
import assert from "node:assert/strict";
import { generateRecommendation } from "../decisionEngine.js";

test("returns required output contract", () => {
  const result = generateRecommendation({
    macro: { interestRates: 6.5, liquidity: "neutral", crude: 80, fiiFlow: 10 },
    currentPortfolio: { equity: 60, debt: 40 }
  });

  assert.ok(result.insight);
  assert.ok(Array.isArray(result.rebalance));
  assert.ok(result.confidence);
  assert.ok(result.horizon);
  assert.ok(result.currentPortfolio);
  assert.ok(result.targetPortfolio);
  assert.ok(Array.isArray(result.reasons));
});