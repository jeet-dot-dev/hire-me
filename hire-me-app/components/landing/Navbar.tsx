"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const { status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  /** ────────── handlers ────────── */
  const handleSignIn = () => router.push("/auth/login");
  const handleSignUp = () => router.push("/auth/register");
  const handleLogout = () => signOut({ callbackUrl: "/" });

  const isAuthenticated = status === "authenticated";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full min-h-[80px] bg-[#020202] backdrop-blur-md  flex items-center justify-between px-6 z-50 `}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      style={{
        transition: "top 0.3s ease-in-out",
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo3.png" alt="Hire-me" width={150} height={20} />
      </div>

      {/* Center Navigation (Desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white hover:text-black rounded-full cursor-pointer text-[17px] transition-all duration-300"
          onClick={() => scrollToSection("home")}
        >
          Home
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white hover:text-black rounded-full cursor-pointer text-[17px] transition-all duration-300"
          onClick={() => scrollToSection("features")}
        >
          Features
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white hover:text-black rounded-full cursor-pointer text-[17px] transition-all duration-300"
          onClick={() => scrollToSection("how-it-works")}
        >
          How it works
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white hover:text-black rounded-full cursor-pointer text-[17px] transition-all duration-300"
          onClick={() => scrollToSection("pricing")}
        >
          Pricing
        </Button>
      </div>

      {/* Auth Button */}
      <div className="hidden md:block">
        <Button
          className="rounded-full bg-white text-[17px] text-black cursor-pointer hover:bg-gradient-to-r hover:from-[#94725d] hover:to-white transition-all duration-300"
          onClick={isAuthenticated ? handleLogout : handleSignIn}
        >
          {isAuthenticated ? "Logout" : "Login"}
        </Button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden pr-2 ">
        <button
          className="text-black flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} strokeWidth={2} className="text-white" />
          ) : (
            <Menu size={24} strokeWidth={2} className="text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-black border-l border-gray-700/30 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(118, 93, 82, 0.1)",
        }}
      >
        <div className="flex justify-end p-6 border-b border-gray-700/30 bg-black">
          <button
            className="text-white p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col items-start px-6 py-6 gap-4 bg-black">
          <Button
            variant="ghost"
            className="text-white text-lg w-full justify-start hover:bg-white/10  cursor-pointer hover:text-white rounded-lg py-3 transition-all duration-300"
            onClick={() => {
              setMenuOpen(false);
              scrollToSection("home");
            }}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-white text-lg w-full justify-start hover:bg-white/10  cursor-pointer hover:text-white rounded-lg py-3 transition-all duration-300"
            onClick={() => {
              setMenuOpen(false);
              scrollToSection("features");
            }}
          >
            Features
          </Button>
          <Button
            variant="ghost"
            className="text-white text-lg w-full justify-start hover:bg-white/10  cursor-pointer hover:text-white rounded-lg py-3 transition-all duration-300"
            onClick={() => {
              setMenuOpen(false);
              scrollToSection("pricing");
            }}
          >
            Pricing
          </Button>
          <Button
            variant="ghost"
            className="text-white text-lg w-full justify-start hover:bg-white/10  cursor-pointer hover:text-white rounded-lg py-3 transition-all duration-300"
            onClick={() => {
              setMenuOpen(false);
              scrollToSection("how-it-works");
            }}
          >
            How it works
          </Button>

          <div className="w-full space-y-4 mt-6 pt-6 border-t border-gray-700/30">
            <Button
              className="rounded-lg bg-gradient-to-r from-[#8d675a] to-[#896a59] hover:from-[#896a59] hover:to-[#8d675a] text-lg text-white cursor-pointer transition-all duration-300 w-full py-3"
              onClick={() => {
                setMenuOpen(false);
                if (isAuthenticated) {
                  handleLogout();
                } else {
                  handleSignIn();
                }
              }}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </Button>
            {!isAuthenticated && (
              <Button
                variant="secondary"
                className="rounded-lg text-lg text-black cursor-pointer border-[#896a59] hover:bg-[#896a59] hover:text-white transition-all duration-300 w-full py-3"
                onClick={() => {
                  setMenuOpen(false);
                  handleSignUp();
                }}
              >
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
