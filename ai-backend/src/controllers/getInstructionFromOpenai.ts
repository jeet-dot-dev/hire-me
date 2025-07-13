import { Context } from "hono";
import { interviewInstructionPrompt } from "../lib/prompt/instructions";
import { callOpenAI } from "../utils/openai"; 

const getInstructionFromOpenai = async (c: Context) => {
  try {
    const body = await c.req.json();

    const { jobTitle, jobLevel, interviewDuration, skillsRequired } = body;

    // Validate required fields
    if (!jobTitle || !interviewDuration || !skillsRequired) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const prompt = interviewInstructionPrompt({
      jobTitle,
      jobLevel,
      interviewDuration,
      skillsRequired,
    });

    const result = await callOpenAI(prompt);

    return c.json({ result });
  } catch (error) {
    console.error("AI error:", error);
    return c.json({ error: "Something went wrong while generating the interview instructions." }, 500);
  }
};

export default getInstructionFromOpenai;
