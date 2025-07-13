import { Context } from "hono";
import { tagsPrompt } from "../lib/prompt/tags"; 
import { callOpenAI } from "../utils/openai"; 
import { callGemini } from "../utils/callGemini";

const getTagsFromOpenai = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { jobTitle, companyName, location, skillsRequired } = body;

    if (!jobTitle || !skillsRequired) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = tagsPrompt(body);

    const aiResponse = await callGemini(prompt, c.env.GEMINI_API_KEY);

    console.log("Raw AI Response:", aiResponse);

    // Clean and parse the AI response
    let parsedTags: string[] = [];
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      console.log("Cleaned Response:", cleanedResponse);

      // Try to parse as JSON
      const parsed = JSON.parse(cleanedResponse);
      
      // Ensure it's an array of strings
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        parsedTags = parsed;
      } else {
        throw new Error("Response is not an array of strings");
      }

    } catch (parseError) {
      console.warn("Failed to parse AI response as JSON:", parseError);
      console.warn("Raw response:", aiResponse);
      
      // Fallback: try to extract tags from text
      const fallbackTags = extractTagsFromText(aiResponse);
      if (fallbackTags.length > 0) {
        parsedTags = fallbackTags;
      } else {
        // Return error if we can't extract any tags
        return c.json({ error: "Failed to generate valid tags" }, 500);
      }
    }

    console.log("Final parsed tags:", parsedTags);

    return c.json({ result: parsedTags });
  } catch (error) {
    console.error("AI Error (tags):", error);
    return c.json({ error: "Failed to generate tags" }, 500);
  }
};

// Helper function to extract tags from text as fallback
const extractTagsFromText = (text: string): string[] => {
  try {
    // Look for array-like patterns in the text
    const arrayMatch = text.match(/\[([^\]]+)\]/);
    if (arrayMatch) {
      // Extract items from array string
      const items = arrayMatch[1]
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item.length > 0);
      
      return items;
    }

    // Look for quoted strings
    const quotedItems = text.match(/"([^"]+)"/g);
    if (quotedItems) {
      return quotedItems.map(item => item.replace(/"/g, ''));
    }

    return [];
  } catch (error) {
    console.warn("Fallback extraction failed:", error);
    return [];
  }
};

export default getTagsFromOpenai;