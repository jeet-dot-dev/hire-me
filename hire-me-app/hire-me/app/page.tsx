"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";


const Navbar = () => {
  const { data: session, status } = useSession(); // auth state
  const router = useRouter();
  type roleType = "candidate" | "recruiter";
  const [role, SetRole] = useState<roleType>("candidate");
  /** ────────── handlers ────────── */
  const handleSignIn = () => router.push("/auth/login"); // or signIn()
  const handleSignUp = () => router.push("/auth/register"); // registration page
  const handleLogout = () => signOut({ callbackUrl: "/" }); // back to landing

  const isAuthenticated = status === "authenticated";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* brand */}
        <h1 className="text-2xl font-bold text-white">Hire Me</h1>

        {/* auth buttons */}
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            className="flex items-center rounded-full px-6 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleSignIn}
              className="flex items-center rounded-full px-6 py-2 text-white hover:bg-white/10"
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button
              onClick={handleSignUp}
              className="rounded-full px-6 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
  
    </nav>
  );
};

export default function Home() {
  const { data: session, status } = useSession(); // auth state
  const router = useRouter();
  type roleType = "candidate" | "recruiter";
  const [role, SetRole] = useState<roleType>("candidate");
  const isAuthenticated = status === "authenticated";
  useEffect(() => {
    if (!session) return;
    const Role = session?.user?.role;
    if (!Role) return;
    SetRole(Role.toLocaleLowerCase() as roleType);
  }, [session]);
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-24 flex items-center justify-center">
        <div className="text-center text-white space-y-2">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-gray-400">Your content goes here</p>
          {isAuthenticated && (
            <div
              className="mt-5 px-4 py-3 bg-[#2a2a2c] rounded-2xl cursor-pointer"
              onClick={() => router.push(`${role}/dashboard`)}
            >
              Go to Dashboard
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
