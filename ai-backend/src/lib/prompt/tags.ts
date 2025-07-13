export const tagsPrompt = (data: {
  jobTitle: string;
  skillsRequired: string[];
  industry?: string;
}) => `
Generate 5 to 10 concise, relevant tags (as an array) based on the following job information:

- Job Title: ${data.jobTitle}
- Skills Required: ${data.skillsRequired.join(", ")}
- Industry: ${data.industry || "Not specified"}

The tags should be lowercase, one or two words max, and useful for filtering/search.
Format the response as a pure JSON array, like: ["frontend", "react", "typescript"]
`;
