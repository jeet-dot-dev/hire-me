import * as z from 'zod';

export const signinSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),

  role: z.enum(["CANDIDATE", "RECRUITER"], {
    errorMap: () => ({ message: "Role must be CANDIDATE or RECRUITER" }),
  }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type SigninSchemaType = z.infer<typeof signinSchema> 