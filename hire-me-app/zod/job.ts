import { z } from "zod";

export const jobSchema = z.object({
  id:z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().optional().nullable(),
  jobType: z.enum(["Remote", "Onsite", "Hybrid"]),
  description: z.string().min(1, "Description is required"),
  skillsRequired: z.array(z.string()).min(1, "At least one skill is required"),
  interviewDuration: z.number().min(10, "Duration must be at least 10 minute"),
  interviewInstruction: z.string().optional().nullable(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  industry: z.string().optional().nullable(),
  jobLevel: z.enum(["INTERN","ENTRY", "MID", "SENIOR","LEAD"]).optional().nullable(),
  experienceNeeded: z.number().optional().nullable(),
  contact: z.string().optional().nullable(),
  expireAt: z.coerce.date().optional().nullable(),
});



export type JobFormData = z.infer<typeof jobSchema>;


