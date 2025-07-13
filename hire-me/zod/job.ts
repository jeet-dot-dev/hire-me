import { z } from "zod";

export const jobSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  salary: z.string().optional(),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "INTERNSHIP"]),
  description: z.string().min(1, "Description is required"),
  skillsRequired: z.array(z.string()).min(1, "At least one skill is required"),
  interviewDuration: z.number().min(10, "Duration must be at least 10 minute"),
  interviewInstruction: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  industry: z.string().optional(),
  jobLevel: z.enum(["JUNIOR", "MID", "SENIOR"]).optional(),
  experienceNeeded: z.number().optional(),
  contact: z.string().optional(),
  expireAt: z.coerce.date().optional(),
});



export type JobFormData = z.infer<typeof jobSchema>;


