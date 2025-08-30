import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGemini(prompt: string, apiKey: string): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not provided");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use the correct model name for Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response) {
      throw new Error("No response from Gemini API");
    }

    const text = response.text();
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Gemini API failed: ${errorMessage}`);
  }
}
