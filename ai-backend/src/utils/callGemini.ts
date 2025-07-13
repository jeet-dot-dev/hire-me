import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  // ✅ Use "models/gemini-2.5-flash" for the full model path
  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text().trim();
}
