import express from "express";
import cors from "cors";
import { generateRecommendation } from "./decisionEngine.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/recommend", (req, res) => {
  try {
    const result = generateRecommendation(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});