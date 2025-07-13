export const interviewInstructionPrompt = (data: {
  jobTitle: string;
  jobLevel?: string;
  interviewDuration: number;
  skillsRequired: string[];
}) => `
Write clear AI-generated interview instructions for a candidate applying for the role of "${data.jobTitle}".

Details:
- Role Level: ${data.jobLevel || "Not specified"}
- Interview Duration: ${data.interviewDuration} minutes
- Skills to assess: ${data.skillsRequired.join(", ")}

Instructions should include:
1. What the candidate should expect
2. How to prepare
3. Structure of the interview
4. Any best practices

Format it in clear paragraphs with bullet points if helpful.
`;
