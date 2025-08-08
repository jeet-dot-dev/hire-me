export function createResumeAnalysisPrompt(
  resumeText: string,
  jobDescription: string,
  skillsRequired: string[]
): string {
  return `
You are a professional resume analyzer. Analyze the resume against the job requirements and return a JSON response with the following structure:

{
  "resumeOverview": "Brief 2-3 sentence summary of candidate's background and experience",
  "matchedSkills": ["skill1", "skill2"],
  "unmatchedSkills": ["skill3", "skill4"],
  "score": 85
}

**ANALYSIS CRITERIA:**

**Skills Matching (30% of score):**
- Compare resume skills against required skills: ${skillsRequired.join(', ')}
- Look for exact matches, synonyms, and related technologies
- Consider different skill naming conventions (e.g., "JavaScript" vs "JS", "ReactJS" vs "React")

**Experience Relevance (40% of score):**
- Years of relevant experience mentioned
- Industry alignment with job requirements
- Progressive career growth
- Leadership/management experience if applicable

**Projects & Achievements (20% of score):**
- Quality and relevance of projects described
- Technical complexity and impact
- Open source contributions
- Certifications and awards

**Education & Training (10% of score):**
- Relevant degree/certifications
- Continuous learning evidence
- Training programs completed

**Job Requirements:**
${jobDescription}

**Skills Required:**
${skillsRequired.join(', ')}

**Resume to Analyze:**
${resumeText}

**IMPORTANT RULES:**
1. Return ONLY valid JSON - no additional text or formatting
2. Keep resumeOverview under 100 words
3. Score range: 0-100 (be realistic, not overly generous)
4. Match skills case-insensitively and consider variations
5. Include partial skill matches in matchedSkills if closely related
6. If a required skill is not found in resume, add to unmatchedSkills

JSON Response:`;
}