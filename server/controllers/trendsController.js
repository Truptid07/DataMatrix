import genAI from "../config/geminiClient.js";
import { linearRegression, getTrendDirection } from "../utils/stats.js";

export const detectTrend = async (req, res) => {
  try {
    const { fileData } = req.body;

    if (!fileData || !Array.isArray(fileData) || fileData.length === 0) {
      return res.status(400).json({ error: "No file data provided." });
    }

    // Format the data into a prompt
    const prompt = `
You are a data analyst AI. Analyze the dataset below and provide the overall trend.
Your response should be concise and clearly indicate the trend (e.g., increasing, decreasing, fluctuating, stable).
Example format: "The data shows an increasing trend in revenue over time."

Data:
${JSON.stringify(fileData.slice(0, 100))}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // As a fallback: detect numeric trend using regression
    const numericKeys = Object.keys(fileData[0]).filter(
      (key) => typeof fileData[0][key] === "number"
    );

    let fallbackTrend = null;
    if (numericKeys.length >= 1) {
      const key = numericKeys[0]; // Analyze first numeric column
      const y = fileData.map((row) => row[key]);
      const x = y.map((_, i) => i);
      const { slope } = linearRegression(x, y);
      fallbackTrend = getTrendDirection(slope);
    }

    return res.status(200).json({
      aiTrend: text,
      fallbackTrend,
    });
  } catch (err) {
    console.error("Trend detection error:", err.message);
    return res.status(500).json({ error: "Failed to detect trend." });
  }
};