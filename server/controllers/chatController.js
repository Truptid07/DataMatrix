import genAI from "../config/geminiClient.js";

export const chatWithData = async (req, res) => {
  try {
    const { question, fileData } = req.body;

    if (!question || !fileData) {
      return res.status(400).json({ error: "Missing question or file data" });
    }

    const prompt = `
You are a helpful and expert data analyst.
Here's the user's question: "${question}"

Here is the dataset:
${JSON.stringify(fileData.slice(0, 100), null, 2)} 

Analyze the data and provide a clear, concise, human-readable explanation. Focus on insights, reasons, or patterns found in the dataset.
Do NOT include any code or JSON. Just plain explanation.
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
