import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function RedirectPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return redirect("/auth/login");
  }

  const role = session.user.role;

  if (!role) {
    return redirect("/login");
  }

 

  if (role === "RECRUITER") {
    return redirect("/recruiter/dashboard");
  } else if (role === "CANDIDATE") {
     const isHaveProfile = await prisma.candidate.findUnique({where  : {userId : session.user.id}});
     if(isHaveProfile){
        return redirect("/candidate/dashboard/profile");
     }
    return redirect("/candidate/dashboard/profile/form")
  } else {
    return redirect("/login");
  }
}
