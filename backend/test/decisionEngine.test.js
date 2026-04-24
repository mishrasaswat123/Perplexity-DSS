import test from "node:test";
import assert from "node:assert/strict";
import { generateRecommendation } from "../decisionEngine.js";

test("returns required output contract", () => {
  const result = generateRecommendation({
    macro: {
      interestRates: 6.5,
      liquidity: "neutral",
      crude: 80,
      fiiFlow: 10
    },
    currentPortfolio: {
      equity: 60,
      debt: 40
    }
  });

  assert.equal(typeof result.insight, "string");
  assert.ok(Array.isArray(result.rebalance));
  assert.equal(typeof result.confidence, "string");
  assert.equal(typeof result.horizon, "string");
  assert.equal(typeof result.currentPortfolio, "object");
  assert.equal(typeof result.targetPortfolio, "object");
  assert.ok(Array.isArray(result.reasons));
});

test("positive macro score produces a higher-risk allocation", () => {
  const result = generateRecommendation({
    macro: {
      interestRates: 5.5,
      liquidity: "easy",
      crude: 70,
      fiiFlow: 20
    },
    currentPortfolio: {
      equity: 60,
      debt: 40
    }
  });

  assert.equal(result.confidence, "high");
  assert.equal(result.horizon, "6-12 months");
  assert.deepEqual(result.targetPortfolio, { equity: 65, debt: 35 });
  assert.equal(result.rebalance[0].asset, "equity");
  assert.equal(result.rebalance[0].action, "overweight");
});

test("negative macro score produces a defensive allocation", () => {
  const result = generateRecommendation({
    macro: {
      interestRates: 7.5,
      liquidity: "tight",
      crude: 90,
      fiiFlow: -15
    },
    currentPortfolio: {
      equity: 60,
      debt: 40
    }
  });

  assert.equal(result.confidence, "high");
  assert.equal(result.horizon, "3-6 months");
  assert.deepEqual(result.targetPortfolio, { equity: 50, debt: 50 });
  assert.equal(result.rebalance[0].asset, "equity");
  assert.equal(result.rebalance[0].action, "underweight");
});