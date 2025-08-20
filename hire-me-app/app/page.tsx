"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  type roleType = "candidate" | "recruiter";
  const [role, SetRole] = useState<roleType>("candidate");
  const [menuOpen, setMenuOpen] = useState(false);

  /** ────────── handlers ────────── */
  const handleSignIn = () => router.push("/auth/login");
  const handleSignUp = () => router.push("/auth/register");
  const handleLogout = () => signOut({ callbackUrl: "/" });

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!session) return;
    const Role = session?.user?.role;
    if (!Role) return;
    SetRole(Role.toLocaleLowerCase() as roleType);
  }, [session]);

  return (
    <div>
      <nav className="w-full min-h-[80px] bg-[#0a0a0a] rounded-t-2xl flex items-center justify-between px-6 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo3.png" alt="Hire-me" width={150} height={20} />
        </div>

        {/* Center Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white hover:text-[#0a0a0a] rounded-4xl cursor-pointer text-[17px]"
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white hover:text-[#0a0a0a] rounded-4xl cursor-pointer text-[17px]"
            onClick={() => {
              if (isAuthenticated) {
                router.push(`/${role}/dashboard`);
              }
            }}
          >
            {isAuthenticated ? "Dashboard" : "Features"}
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white rounded-4xl cursor-pointer text-[17px]"
          >
            Pricing
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white rounded-4xl cursor-pointer text-[17px]"
          >
            How it works
          </Button>
        </div>

        {/* Auth Button */}
        <div className="hidden md:block">
          <Button 
            className="rounded-full bg-white text-[17px] text-black cursor-pointer hover:bg-gray-200 transition"
            onClick={isAuthenticated ? handleLogout : handleSignIn}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </Button>
        </div>

        {/* Slide-out Mobile Menu */}
        {/* Mobile Menu Icon */}
        <div className="md:hidden pr-2">
          <button
            className="text-white flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={24} strokeWidth={2} className="text-white" />
            ) : (
              <Menu size={24} strokeWidth={2} className="text-white" />
            )}
          </button>
        </div>

        {/* Slide-out Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-[#0a0a0a] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button inside menu */}
          <div className="flex justify-end p-4">
            <button
              className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <div className="flex flex-col items-start px-6 gap-6">
            <Button
              variant="ghost"
              className="text-white text-[17px] w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-white text-[17px] w-full justify-start"
              onClick={() => {
                setMenuOpen(false);
                if (isAuthenticated) {
                  router.push(`/${role}/dashboard`);
                }
              }}
            >
              {isAuthenticated ? "Dashboard" : "Features"}
            </Button>
            <Button
              variant="ghost"
              className="text-white text-[17px] w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="text-white text-[17px] w-full justify-start"
              onClick={() => setMenuOpen(false)}
            >
              How it works
            </Button>

            {/* Auth Buttons in Mobile */}
            <div className="w-full space-y-3">
              <Button 
                className="rounded-full bg-white text-[17px] text-black cursor-pointer hover:bg-gray-200 transition w-full"
                onClick={isAuthenticated ? handleLogout : handleSignIn}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </Button>
              {!isAuthenticated && (
                <Button 
                  variant="outline"
                  className="rounded-full text-[17px] text-white border-white hover:bg-white hover:text-black transition w-full"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default function Home() {
  return (
   <div className="min-h-screen bg-black">
  <Navbar />

  <section className="hero">
    <div className="relative w-full min-h-[500px]">
      <Image 
        src="/hero.jpg" 
        alt="hero"
        fill
        className="object-cover"
        priority
      />
    </div>
  </section>
</div>

  );
}
