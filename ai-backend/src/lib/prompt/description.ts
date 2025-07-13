export const jobDescriptionPrompt = (data: {
  jobTitle: string;
  companyName: string;
  location: string;
  skillsRequired: string[];
  experienceNeeded?: number;
}) => `
Generate a professional job description for the following:

- Job Title: ${data.jobTitle}
- Company: ${data.companyName}
- Location: ${data.location}
- Skills Required: ${data.skillsRequired.join(", ")}
- Experience Needed: ${data.experienceNeeded || "Not specified"}

Use clear, concise language. Format in bullet points if helpful.
`;
