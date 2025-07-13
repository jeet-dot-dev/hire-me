import { z } from "zod";

/* ─── Helpers ─────────────────────────────────────────────── */
const CURRENT_YEAR = new Date().getFullYear();
const yearSchema = z.preprocess(
  (v) => (typeof v === "string" ? Number(v) : v),
  z
    .number()
    .int()
    .gte(1900)
    .lte(CURRENT_YEAR + 10)
);

/* ─── Enums ───────────────────────────────────────────────── */
const socialPlatformEnum = z.enum([
  "GITHUB",
  "LINKEDIN",
  "PORTFOLIO",
  "TWITTER",
  "DEVFOLIO",
]);

/* ─── Sub‑schemas aligned with your front‑end objects ─────── */

/** Education block (accepts `null` for `endYear` and optional `id`) */
export const educationSchema = z
  .object({
    id: z.string().optional(), // you supply Date.now().toString()
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    startYear: yearSchema,
    endYear: yearSchema.nullable().optional(), // ← allows null
    grade: z.string().optional(),
  })
  .refine(
    ({ startYear, endYear }) => endYear == null || endYear >= startYear, // handles null/undefined
    {
      path: ["endYear"],
      message: "End year cannot be earlier than start year",
    }
  );

/** Social link (case‑insensitive platform, optional id) */
export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.preprocess(
    (v) => (typeof v === "string" ? v.toUpperCase() : v),
    socialPlatformEnum
  ),
  url: z.string().url("Must be a valid URL"),
});

const imageKeySchema = z
  .string()
  .min(1)
  .regex(
    /^[\w./-]+\.(jpe?g|png|webp|gif)$/i,
    'Must be an object key like "images/xyz.jpeg"'
  );

const pdfKeySchema = z
  .string()
  .min(1)
  .regex(/^[\w./-]+\.(pdf)$/i, 'Must be a PDF key like "pdfs/xyz.pdf"');

/* ─── Top‑level Candidate payload ─────────────────────────── */
export const candidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  about: z.string().max(1_000).optional(),

  /** ⬇️ exactly your state keys ⬇️ */
  profilePicture: imageKeySchema.optional(),
  resume: pdfKeySchema.optional(),

  education: z.array(educationSchema).optional(),
  skills: z
    .array(z.string().min(1, "Skill name cannot be empty"))
    .max(50, "You can add up to 50 skills")
    .optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type CandidateDTO = z.infer<typeof candidateSchema>;
