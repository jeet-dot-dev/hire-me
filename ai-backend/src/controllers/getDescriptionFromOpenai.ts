import { Context } from "hono";
import { jobDescriptionPrompt } from "../lib/prompt/description";
import { callOpenAI } from "../utils/openai";

const getDescriptionFromOpenai = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { jobTitle, companyName, location, skillsRequired, experienceNeeded } = body;

    // Safety: validate required fields
    if (!jobTitle || !companyName || !location || !skillsRequired) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = jobDescriptionPrompt({
      jobTitle,
      companyName,
      location,
      skillsRequired,
      experienceNeeded,
    });

    const result = await callOpenAI(prompt);

    return c.json({ result });
  } catch (error) {
    console.error("AI error:", error);
    return c.json({ error: "Something went wrong while generating the description." }, 500);
  }
};

export default getDescriptionFromOpenai;
