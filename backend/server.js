import express from "express";
import { generateRecommendation } from "./decisionEngine.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/recommend", (req, res) => {
  const result = generateRecommendation(req.body);
  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});