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


export type JobType = {
  id: string;
  recruiterId: string;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date | null;
  isDelete: boolean;

  jobTitle: string;
  companyName: string;
  location: string;
  salary: string | null;
  jobType: "Remote" | "Onsite" | "Hybrid"; // 👈 match your enum
  description: string;
  skillsRequired: string[];
  interviewDuration: number;
  interviewInstruction: string | null;
  tags: string[];
  status: boolean;
  industry: string | null;
  jobLevel: "INTERN"|"ENTRY"|"MID"|"SENIOR"|"LEAD"|null ; // 👈 match your enum
  experienceNeeded: number | null;
  contact: string | null;
  shareLink: string | null;
};


export type ApplicationWithJob = ApplicationTypeFull & {
  job: JobType;
};
