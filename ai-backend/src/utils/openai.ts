import OpenAI from "openai";

export async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const client = new OpenAI({
    apiKey,
  });

const response = await client.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  max_tokens: 300,
  temperature: 0.7,
});

  return response.choices?.[0]?.message?.content?.trim() || "";
}
