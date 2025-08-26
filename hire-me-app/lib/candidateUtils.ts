import { prisma } from "@/lib/prisma";

export async function ensureCandidateProfile(userId: string, userEmail?: string, userName?: string) {
  try {
    // Check if candidate profile already exists
    let candidate = await prisma.candidate.findUnique({
      where: { userId },
      include: {
        education: true,
        skills: true,
        socials: true,
      },
    });

    // If no profile exists, create a basic one
    if (!candidate) {
      // Extract first name and last name from userName or email
      const fallbackName = userName || userEmail?.split('@')[0] || 'User';
      const nameParts = fallbackName.split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      candidate = await prisma.candidate.create({
        data: {
          userId,
          firstName,
          lastName,
          about: null,
          ProfilePic: null,
          resumeUrl: null,
          wishListedJobs: [],
          interviewCredits: 3, // Default free tier credits
        },
        include: {
          education: true,
          skills: true,
          socials: true,
        },
      });
    }

    return candidate;
  } catch (error) {
    console.error('Error ensuring candidate profile:', error);
    return null;
  }
}

export function isProfileComplete(candidate: {
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  resumeUrl?: string | null;
  education?: Array<unknown>;
  skills?: Array<unknown>;
} | null): boolean {
  if (!candidate) return false;
  
  // Check if essential profile fields are filled
  const hasBasicInfo = !!(candidate.firstName && candidate.lastName);
  const hasAbout = !!(candidate.about && candidate.about.length > 10);
  const hasResume = !!candidate.resumeUrl;
  const hasEducation = !!(candidate.education && candidate.education.length > 0);
  const hasSkills = !!(candidate.skills && candidate.skills.length > 0);

  // Profile is considered "complete" if at least basic info + one of (about, resume, education, skills)
  return hasBasicInfo && (hasAbout || hasResume || hasEducation || hasSkills);
}
