md
# Advisor Brain DSS

Manual decision-support MVP.

## Structure

- backend/
- frontend/
- .github/workflows/

## Backend

### Install
```bash
cd backend
npm install
Run
bash
npm start
Test
bash
npm test
API
json
POST /api/recommend
Example body:
{
  "macro": {
    "interestRates": 6.5,
    "liquidity": "neutral",
    "crude": 80,
    "fiiFlow": 10
  },
  "currentPortfolio": {
    "equity": 60,
    "debt": 40
  }
}
Output contract
{
  "insight": "...",
  "rebalance": [],
  "confidence": "...",
  "horizon": "...",
  "currentPortfolio": {},
  "targetPortfolio": {},
  "reasons": []
}

text
This format is correct for GitHub Markdown, including fenced code blocks for commands and JSON examples [1][2][3].