import { CandidateProfilePage } from "@/components/custom/Candidate/Profile/CandidateProfilePage";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function page() {
  const session = await auth();
  if(!session || !session.user){
    return <div className="text-white p-10">Unauthorized</div>;
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
    education : candidate.education ?? [],
    skills : candidate.skills ?? [],
    socials : candidate.socials ?? []
  }

   return (
    <div className="dark">
      <CandidateProfilePage candidate={candidateProp} />
    </div>
  );
}