import { CandidateProfilePage } from "@/components/features/Candidate/Profile/CandidateProfilePage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ensureCandidateProfile, isProfileComplete } from "@/lib/candidateUtils";
import { IncompleteProfileWelcome } from "@/components/shared/IncompleteProfileWelcome";

export default async function page() {
  const session = await auth();
  if(!session || !session.user){
    return redirect('/auth/login');
  }
  
  const userId = session?.user?.id;
  
  // Ensure candidate profile exists, create if missing
  const candidate = await ensureCandidateProfile(
    userId, 
    session.user.email || undefined, 
    session.user.name || undefined
  );

  if (!candidate) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Error Creating Profile
          </h1>
          <p className="text-gray-400">
            We encountered an error setting up your profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Check if profile is complete enough to show the full profile page
  if (!isProfileComplete(candidate)) {
    return (
      <IncompleteProfileWelcome 
        userName={candidate.firstName || session.user.name || "there"}
        showCompletionPrompt={true}
      />
    );
  }

  const candidateProp = {
    firstName : candidate.firstName,
    lastName : candidate.lastName,
    about : candidate.about,
    profilePic : candidate.ProfilePic,
    resume : candidate.resumeUrl,
    education : candidate.education.map(edu => ({
      ...edu,
      endYear: edu.endYear ?? undefined,
      grade: edu.grade ?? undefined
    })) ?? [],
    skills : candidate.skills ?? [],
    socials : candidate.socials ?? []
  }

   return (
    <div className="dark">
      <CandidateProfilePage candidate={candidateProp} />
    </div>
  );
}