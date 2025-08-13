export type ApplycationType = {
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



// model JobApplication {
//   id           String     @id @default(uuid())
//   jobId        String    
//   candidateId  String     

//   job          Job        @relation(fields: [jobId], references: [id])
//   candidate    Candidate? @relation(fields: [candidateId], references: [id])

//   createdAt    DateTime   @default(now())
//   status       ApplicationStatus
//   feedback     String?    @db.VarChar(500)
//   resumeUrl    String  
//   resumeText   String?  
//   resumeOverview String? // Summary of the resume text
//   matchedSkills String[] // Skills that matched the job requirements
//   unmatchedSkills String[] // Skills that did not match the job requirements
//   score        Int?      // Score based on resume matching
// }