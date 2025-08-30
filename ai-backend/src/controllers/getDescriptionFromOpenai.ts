import { Context } from "hono";
import { jobDescriptionPrompt } from "../lib/prompt/description";
import { callOpenAI } from "../utils/openai";
import { callGemini } from "../utils/callGemini";

const cleanMarkdownResponse = (text: string): string => {
  if (!text) return text;

  return (
    text
      // Remove any HTML tags that might have slipped in
      .replace(/<[^>]*>/g, "")
      // Ensure proper heading format
      .replace(/^([A-Z][^#\n]*?)$/gm, (match, heading) => {
        // Skip if it's already a heading or looks like a paragraph
        if (
          heading.includes("#") ||
          heading.length > 80 ||
          heading.includes(".")
        ) {
          return match;
        }
        return `### ${heading}`;
      })
      // Fix the main title (should be single #)
      .replace(/^### (.*Developer at.*)/m, "# $1")
      // Clean up multiple newlines
      .replace(/\n\n\n+/g, "\n\n")
      // Ensure proper spacing
      .trim()
  );
};

const getDescriptionFromOpenai = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { jobTitle, companyName, location, skillsRequired } = body;

    // Safety: validate required fields
    if (!jobTitle || !companyName || !location || !skillsRequired) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Validate skillsRequired is an array
    if (!Array.isArray(skillsRequired)) {
      return c.json({ error: "skillsRequired must be an array" }, 400);
    }

    // Check if GEMINI_API_KEY_NEW is available
    if (!c.env.GEMINI_API_KEY_NEW) {
      console.error("GEMINI_API_KEY_NEW is not set");
      return c.json({ error: "AI service configuration error" }, 500);
    }

    const prompt = jobDescriptionPrompt(body);

    //const Rawresult = await callOpenAI(prompt, c.env.OPENAI_API_KEY);
    const Rawresult = await callGemini(prompt, c.env.GEMINI_API_KEY_NEW);
    //console.log(c.env.GEMINI_API_KEY)

    const result = cleanMarkdownResponse(Rawresult);

    return c.json({
      result,
    });
  } catch (error) {
    console.error("AI error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return c.json(
      { error: `Something went wrong while generating the description: ${errorMessage}` },
      500
    );
  }
};



export default getDescriptionFromOpenai;
