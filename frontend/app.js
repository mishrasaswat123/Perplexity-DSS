const form = document.getElementById("dssForm");
const output = document.getElementById("output");

const API_BASE = "https://perplexity-dss.onrender.com";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const payload = {
    macro: {
      interestRates: Number(data.get("interestRates")),
      liquidity: String(data.get("liquidity")),
      crude: Number(data.get("crude")),
      fiiFlow: Number(data.get("fiiFlow"))
    },
    currentPortfolio: {
      equity: Number(data.get("equity")),
      debt: Number(data.get("debt"))
    }
  };

  output.textContent = "Generating...";

  try {
    const res = await fetch(`${API_BASE}/api/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    output.textContent = JSON.stringify(json, null, 2);
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
  }
});