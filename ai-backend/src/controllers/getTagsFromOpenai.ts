import { Context } from "hono";
import { tagsPrompt } from "../lib/prompt/tags"; 
import { callOpenAI } from "../utils/openai"; 

const getTagsFromOpenai = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { jobTitle, skillsRequired, industry } = body;

    if (!jobTitle || !skillsRequired) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = tagsPrompt({
      jobTitle,
      skillsRequired,
      industry,
    });

    const aiResponse = await callOpenAI(prompt);

    // Attempt to parse JSON response from OpenAI
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(aiResponse);
    } catch (err) {
      console.warn("Failed to parse AI response as JSON. Returning raw text.");
    }

    return c.json({ result: parsedTags.length ? parsedTags : aiResponse });
  } catch (error) {
    console.error("AI Error (tags):", error);
    return c.json({ error: "Failed to generate tags" }, 500);
  }
};

export default getTagsFromOpenai;
