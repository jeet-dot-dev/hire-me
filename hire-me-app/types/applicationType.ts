export type ApplicationType = {
    id: string;
    jobId: string;
    candidateId: string;
    createdAt: Date;
    status: 'Pending' | 'Accepted' | 'Rejected';
    feedback: string|null;
    resumeUrl: string;
    resumeText: string|null;
    resumeOverview: string|null; // Summary of the resume text
    matchedSkills: string[]; // Skills that matched the job requirements
    unmatchedSkills: string[]; // Skills that did not match the job requirements
    score: number|null; // Score based on resume matching
}



type TranscriptMessage = {
  role: "recruiter" | "candidate";
  text: string;
};

export type ApplicationTypeFull = {
  id: string;
  jobId: string;
  candidateId: string;

  createdAt: Date;
  status: "Pending" | "Accepted" | "Rejected";
  feedback: string | null;
  resumeUrl: string;
  resumeText: string | null;
  resumeOverview: string | null;
  matchedSkills: string[];
  unmatchedSkills: string[];
  score: number | null;

  // Interview fields
  isInterviewDone: boolean;

  // 👇 FIX: store as an array of TranscriptMessage
  transcript: TranscriptMessage[] | null;

  transcriptSummary: string | null;
  interviewScore: number | null;
  aiRecommendation: string | null;
  strongPoints: string[];
  weakPoints: string[];
  aiSuggestions: string[];
  suspiciousActivities: string[];
  interviewDuration: number | null;
};
