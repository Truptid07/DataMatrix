import genAI from "../config/geminiClient.js";

export const chatWithData = async (req, res) => {
  try {
    const { question, fileData, language } = req.body;

    const languageMap = {
      en: "English",
      hi: "Hindi",
      fr: "French",
      es: "Spanish",
      de: "German",
    };

    const langName = languageMap[language] || "English";

    if (!question || !fileData) {
      return res.status(400).json({ error: "Missing question or file data" });
    }

    const prompt = `
You are a helpful and expert data analyst.

Please answer the user's question based on the dataset provided below. Respond in ${langName} and use beginner-friendly, plain language.

Here is the user's question:
"${question}"

Here is the dataset:
${JSON.stringify(fileData.slice(0, 100), null, 2)}

Analyze the data and provide a clear, concise, and human-readable explanation. Focus on patterns, insights, and reasons found in the data.

Do NOT include any code or JSON in the response. Provide a plain language explanation only.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    console.log("Received fileData with", fileData.length, "rows");

    return res.status(200).json({ answer: responseText });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return res.status(500).json({ error: "Failed to analyze data" });
  }
};
