export const jobDescriptionPrompt = (data: {
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
Generate a comprehensive, professional job description in Markdown format for the following position. Use proper Markdown syntax and make it visually appealing and well-structured:

IMPORTANT: Use proper Markdown syntax:
- Use # for main title (only one #)
- Use ### for section headings (three ###)
- Use - for bullet points
- Use 1. 2. 3. for numbered lists
- Use **text** for bold text
- Use *text* for italic text
- Always add blank lines between sections

**Job Details:**
- Job Title: ${data.jobTitle}
- Company: ${data.companyName}
- Location: ${data.location}
- Skills Required: ${data.skillsRequired.join(", ")}
${data.experienceNeeded ? `- Experience Needed: ${data.experienceNeeded} years` : ''}
${data.jobLevel ? `- Job Level: ${data.jobLevel}` : ''}
${data.industry ? `- Industry: ${data.industry}` : ''}
${data.salary ? `- Salary: ${data.salary}` : ''}
${data.contact ? `- Contact: ${data.contact}` : ''}

**Requirements:**
1. Create a complete job description with the following sections:
   - Job title as main heading
   - Company overview (if industry is provided, incorporate it)
   - Job summary/overview
   - Key responsibilities (use numbered list)
   - Required qualifications (use bullet points)
   - Preferred qualifications (use bullet points)
   - Experience requirements (if provided)
   - Skills required (use bullet points)
   - Salary information (if provided)
   - Contact information (if provided)
   - Application instructions

2. Use proper Markdown formatting:
   - # for main title
   - ### for section headings
   - - for bullet points
   - 1. for numbered lists
   - **text** for bold emphasis
   - *text* for italic emphasis

3. Make it professional, engaging, and comprehensive
4. Ensure the content is relevant to the job level (${data.jobLevel || 'not specified'})
5. Include modern workplace benefits and company culture elements
6. Return only clean Markdown content without HTML tags

Generate a complete, ready-to-use job description in Markdown format that can be easily displayed on a frontend.
`;
