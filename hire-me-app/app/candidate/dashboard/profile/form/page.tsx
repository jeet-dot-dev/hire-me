// app/candidate/dashboard/profile/page.tsx
import React, { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CandidateProfileForm } from "@/components/features/Candidate/Profile/CandidateProfileForm";
import FullScreenLoader from "@/components/loaders/FullScreenLoader";
import { CandidateProfile } from "@/types/candidate";

async function CandidateProfileFormLoader() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  const userId = session.user.id;
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    include: {
      education: true,
      skills: true,
      socials: true,
    },
  });

  const candidateProp: CandidateProfile = candidate
    ? {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        about: candidate.about ?? undefined, // <- fix here
        profilePicture: candidate.ProfilePic ?? undefined,
        resume: candidate.resumeUrl ?? undefined,
        education: candidate.education.map((e) => ({
          id: e.id,
          degree: e.degree,
          institution: e.institution,
          startYear: e.startYear,
          endYear: e.endYear,
          grade: e.grade ?? undefined, // optional field fix
        })),
        skills: candidate.skills.map((s) => s.name),
        socialLinks: candidate.socials.map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        })),
      }
    : {
        firstName: "",
        lastName: "",
        about: undefined,
        profilePicture: undefined,
        resume: undefined,
        education: [],
        skills: [],
        socialLinks: [],
      };

  const mode = candidate ? "edit" : "create";

  return <CandidateProfileForm initialData={candidateProp} mode={mode} />;
}

export default function page() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <CandidateProfileFormLoader />
    </Suspense>
  );
}
