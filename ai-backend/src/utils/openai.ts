import OpenAI from "openai";

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
export async function callOpenAI(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}
