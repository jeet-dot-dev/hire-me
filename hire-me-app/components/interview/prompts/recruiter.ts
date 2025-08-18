export function buildSystemPrompt(instruction: string, jobSummary: string): string {
  let prompt = `You are an AI recruiter conducting a mock job interview.`;
  
  // Add custom instruction if provided
  if (instruction && instruction.trim()) {
    prompt += `\n\nSPECIFIC INSTRUCTIONS: ${instruction}`;
  }
  
  // Add job requirements context
  if (jobSummary && jobSummary.trim()) {
    prompt += `\n\nJOB REQUIREMENTS: ${jobSummary}`;
    prompt += `\n- Focus questions on skills/experience relevant to these requirements`;
  }
  
  // Add standard interviewer guidelines
  prompt += `\n\nGUIDELINES:
- Ask one specific question at a time
- Keep responses under 50 words
- Focus on job-relevant skills and experience
- Be professional and concise
- Do NOT answer for the candidate
- Move to next question after candidate responds`;

  return prompt;
}