export const tagsPrompt = (data: {
  jobTitle: string;
  companyName: string;
  location: string;
  skillsRequired: string[];
  experienceNeeded?: number;
  jobLevel?: "JUNIOR" | "MID" | "SENIOR" | undefined;
  industry?: string;
  contact?: string;
  salary?: string;
}) => `
Generate 6-10 highly relevant, searchable tags for this job posting. Create tags that job seekers would actually search for and that accurately represent this position.

Job Details:
- Title: ${data.jobTitle}
- Company: ${data.companyName}
- Location: ${data.location}
- Required Skills: ${data.skillsRequired.join(", ")}
- Experience Level: ${data.experienceNeeded ? `${data.experienceNeeded} years` : "Not specified"}
- Job Level: ${data.jobLevel || "Not specified"}
- Industry: ${data.industry || "Not specified"}
- Salary: ${data.salary || "Not specified"}

Tag Guidelines:
- Use lowercase only
- Maximum 2 words per tag
- Include mix of: technical skills, job level, industry, location type, work style
- Prioritize commonly searched terms
- Include both specific technologies and general categories
- No special characters or spaces within tags
- Use hyphens for compound terms (e.g., "full-stack", "machine-learning")

Examples of good tags:
- Technical: "react", "nodejs", "python", "aws", "docker"
- Level: "junior", "senior", "lead", "entry-level"
- Type: "frontend", "backend", "full-stack", "devops"
- Industry: "fintech", "healthcare", "saas", "startup"
- Work: "remote", "hybrid", "onsite"
- General: "development", "engineering", "design"

Return ONLY a valid JSON array of strings, no other text:
["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"]
`;