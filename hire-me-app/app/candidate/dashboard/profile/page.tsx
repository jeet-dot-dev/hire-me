import { CandidateProfilePage } from "@/components/features/Candidate/Profile/CandidateProfilePage";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if(!session || !session.user){
    return redirect('/auth/login');
  }
  const userId = session?.user?.id;
  const candidate = await prisma.candidate.findUnique({
    where : {userId},
    include:{
      education : true ,
      skills:true,
      socials : true
    }
  })
    if (!candidate) {
    return <div className="text-white p-10">Candidate profile not found.</div>;
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