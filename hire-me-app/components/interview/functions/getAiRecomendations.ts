import openai from "@/lib/openAi/init";
import { interviewEvaluationPrompt } from "../prompts/interviewEvaluationPrompt";

// ✅ Define the type for AI recommendations
export type AiRecommendations = {
  transcriptSummary: string;
  interviewScore: number; // 0–100
  aiRecommendation: "STRONGLY_HIRE" | "HIRE" | "NEUTRAL" | "REJECT";
  strongPoints: string[];
  weakPoints: string[];
  aiSuggestions: string[] ; // Optional suggestions
};

export const getAiRecommendations = async (
  conversation: { role: string; text: string }[],
  suspiciousActivities: string[],
  description: string
): Promise<AiRecommendations> => {
  try {
    const input = `
${interviewEvaluationPrompt}

INTERVIEW TRANSCRIPT:
${JSON.stringify(conversation, null, 2)}

SUSPICIOUS ACTIVITIES:
${JSON.stringify(suspiciousActivities)}

JOB DESCRIPTION:
${description}

⚠️ Return ONLY a valid JSON object in this exact format:
{
  "transcriptSummary": string,
  "interviewScore": number (0-100),
  "aiRecommendation": "STRONGLY_HIRE" | "HIRE" | "NEUTRAL" |  "REJECT",
  "strongPoints": string[],
  "weakPoints": string[],
  "aiSuggestions": string[]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ already a smaller/cheaper model
      messages: [{ role: "system", content: input }],
      max_tokens: 400, // ✅ limit token usage
      temperature: 0.7, // deterministic output
    });

    const rawOutput = response.choices[0].message?.content || "{}";

    // ✅ Safe JSON parse (remove code fences, etc.)
    const cleaned = rawOutput.replace(/```json|```/g, "").trim();
    const parsed: AiRecommendations = JSON.parse(cleaned);
    console.log("AI Recommendations:", parsed);
    return parsed;
  } catch (error) {
    console.error("Error generating AI recommendations:", error);

    // ✅ Safe fallback
    return {
      transcriptSummary: "",
      interviewScore: 0,
      aiRecommendation: "REJECT",
      strongPoints: [],
      weakPoints: [],
      aiSuggestions: [],
    };
  }
};
