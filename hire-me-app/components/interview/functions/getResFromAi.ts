import openai from "@/lib/openAi/init";
import { createResumeAnalysisPrompt } from "../prompts/resumeAnalyzePrompt";

export interface ResumeAnalysisResult {
  resumeOverview: string;
  matchedSkills: string[];
  unmatchedSkills: string[];
  score: number;
}

export interface JobData {
  description: string;
  skillsRequired: string[];
}

export async function getResumeAnalysis(
  resumeText: string,
  job: JobData
): Promise<ResumeAnalysisResult | null> {
  try {
    //console.log("Starting resume analysis...");

    // Validate inputs
    if (!resumeText || !job.description) {
      throw new Error("Resume text and job description are required");
    }

    // Ensure skillsRequired is an array
    const skillsRequired = Array.isArray(job.skillsRequired)
      ? job.skillsRequired
      : [];

    if (skillsRequired.length === 0) {
      console.warn("No skills required specified for this job");
    }

    // Create the analysis prompt
    const prompt = createResumeAnalysisPrompt(
      resumeText, // Limit resume text to avoid token limits
      job.description.slice(0, 1500), // Limit job description
      skillsRequired
    );

    //console.log("Calling OpenAI API...");

    // Call OpenAI API with token limits
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Small, cost-effective model
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume analyzer. Return only valid JSON responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500, // Limit response tokens
      temperature: 0.3, // Lower temperature for more consistent results
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // console.log("AI Response received:", responseText.substring(0, 200) + "...");

    // Parse JSON response
    let analysisResult: ResumeAnalysisResult;

    try {
      analysisResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Raw response:", responseText);

      // Fallback: try to extract data with regex if JSON parsing fails
      const fallbackResult = extractFallbackData(responseText, skillsRequired);
      if (fallbackResult) {
        return fallbackResult;
      }

      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate the response structure
    const validatedResult = validateAnalysisResult(
      analysisResult,
      skillsRequired
    );

    //  // console.log("Analysis completed successfully:", {
    //     score: validatedResult.score,
    //     matchedSkills: validatedResult.matchedSkills.length,
    //     unmatchedSkills: validatedResult.unmatchedSkills.length,
    //   });

    return validatedResult;
  } catch (error) {
    console.error("Resume analysis failed:", error);

    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }

    // Return null instead of throwing to allow graceful handling
    return null;
  }
}

// Validate and sanitize the AI response
function validateAnalysisResult(
  result: unknown,
  skillsRequired: string[]
): ResumeAnalysisResult {
  const res = result as Record<string, unknown>;
  return {
    resumeOverview:
      typeof res.resumeOverview === "string"
        ? res.resumeOverview.slice(0, 300) // Limit length
        : "Unable to generate resume overview",

    matchedSkills: Array.isArray(res.matchedSkills)
      ? res.matchedSkills.filter((skill: unknown) => typeof skill === "string")
      : [],

    unmatchedSkills: Array.isArray(res.unmatchedSkills)
      ? res.unmatchedSkills.filter((skill: unknown) => typeof skill === "string")
      : skillsRequired, // Default to all skills as unmatched

    score:
      typeof res.score === "number" &&
      res.score >= 0 &&
      res.score <= 100
        ? Math.round(res.score)
        : 0,
  };
}

// Fallback data extraction if JSON parsing fails
function extractFallbackData(
  responseText: string,
  skillsRequired: string[]
): ResumeAnalysisResult | null {
  try {
    // Try to extract score with regex
    const scoreMatch = responseText.match(/(?:score|rating)[\s:]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    return {
      resumeOverview:
        "Analysis completed but detailed overview unavailable due to parsing error.",
      matchedSkills: [],
      unmatchedSkills: skillsRequired,
      score: Math.min(Math.max(score, 0), 100),
    };
  } catch {
    return null;
  }
}
