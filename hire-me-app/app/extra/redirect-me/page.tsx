import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/authConfig";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

async function performRedirect(session: Session) {
  const role = session.user?.role;

  if (!role) {
    return redirect("/login");
  }

  if (role === "RECRUITER") {
    return redirect("/recruiter/dashboard");
  } else if (role === "CANDIDATE") {
    const isHaveProfile = await prisma.candidate.findUnique({
      where: { userId: session.user.id }
    });
    if (isHaveProfile) {
      return redirect("/candidate/dashboard");
    }
    return redirect("/candidate/dashboard/profile/form");
  } else {
    return redirect("/login");
  }
}

export default async function RedirectPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user) {
    return redirect("/auth/login");
  }

  // Perform redirect logic
  await performRedirect(session);

  // This component will show briefly while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hire-me
          </h1>
          <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Setting up your workspace...
          </h2>
          <p className="text-gray-400">
            {session.user.role === "RECRUITER" 
              ? "Taking you to your recruitment dashboard" 
              : "Preparing your candidate experience"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-white h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
