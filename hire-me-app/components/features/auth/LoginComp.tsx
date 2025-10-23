"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
// shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Sonner toast import
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

// Define the two possible user roles
type Role = "RECRUITER" | "CANDIDATE";

export default function LoginPage() {
  // State for tracking which role the user selected (starts as null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for loading state
  const [loading, setLoading] = useState(false);

  // Next.js router for programmatic navigation
  const router = useRouter();

  // Function to handle role selection (RECRUITER or CANDIDATE)
  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role); // Set the selected role
  };

  // Function to handle credentials-based login (email + password)
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Show loading state

    // Attempt to sign in using NextAuth credentials provider
    const result = await signIn("credentials", {
      email,
      password,
      role: selectedRole,
      redirect: false, // Don't auto-redirect, we'll handle it manually
    });
    console.log(result);

    if (result?.error === "Please verify your email before login") {
      router.push("/auth/verify-email");
    }

    // Check if login failed
    if (result?.error) {
      toast.error(result?.error);
    } else {
      // Login successful - fetch the user's session to get their role
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      // Redirect user based on their role
      if (role === "RECRUITER") {
        toast.success("Welcome back! Redirecting to your dashboard...");
        router.push("/recruiter/dashboard");
      } else if (role === "CANDIDATE") {
        toast.success("Welcome back! Redirecting to your dashboard...");
        router.push("/candidate/dashboard");
      } else {
        // User exists but has no role assigned
        toast.error("Account setup incomplete. Please contact support.");
      }
    }

    setLoading(false); // Hide loading state
  };

  // Function to handle OAuth login (Google or GitHub)
  const handleOAuthLogin = (provider: "google" | "github") => {
    // Make sure user selected a role first
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }

    // Show loading toast to indicate authentication process started
    const providerName = provider === "google" ? "Google" : "GitHub";
    toast.loading(`Connecting to ${providerName}...`, {
      description: "Please wait while we redirect you to authenticate"
    });
    setLoading(true);

    // Store the selected role in a short-lived cookie (6 minutes)
    // This helps the OAuth callback know what role the user intended
    Cookies.set("oauth_role", selectedRole, { expires: 0.004 });

    // Initiate OAuth flow with the selected provider
    signIn(provider);
  };

  // Function to go back to role selection screen
  const goBack = () => {
    setSelectedRole(null); // Reset role selection
    setEmail(""); // Clear form inputs
    setPassword("");
  };

  // Step 1: Role Selection Screen
  // Show this when no role is selected yet
  if (!selectedRole) {
    return (
   <div
  className="min-h-screen flex items-center justify-center bg-black bg-cover px-4 relative"
  style={{
    backgroundImage:
      "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
  }}
>
  {/* Top-left Back to Home */}
  <div className="absolute top-6 left-6 z-10">
    <Link
      href="/"
      className="inline-flex items-center text-white hover:text-zinc-300 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      <span className="text-sm font-medium">Back to Home</span>
    </Link>
  </div>




  {/* Auth Card */}
  <Card className="max-w-md w-full bg-transparent border-0">
    <CardHeader className="text-center">
      <CardTitle className="text-3xl font-bold text-white">
        Login to Hire-me
      </CardTitle>
      <CardDescription className="text-base text-zinc-400">
        Select your role to continue
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Candidate Button */}
      <Button
        onClick={() => handleRoleSelection("CANDIDATE")}
        variant="outline"
        className="w-full h-12 bg-transparent border-2 border-muted-foreground text-white hover:bg-white transition-colors cursor-pointer"
      >
        Login as Candidate
      </Button>

      {/* Recruiter Button */}
      <Button
        onClick={() => handleRoleSelection("RECRUITER")}
        variant="outline"
        className="w-full h-12 bg-transparent border-2 border-muted-foreground text-white hover:bg-white transition-colors cursor-pointer"
      >
        Login as Recruiter
      </Button>
    </CardContent>
    <CardContent className="pt-0">
      <p className="text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-white hover:underline">
          Sign up
        </Link>
      </p>
    </CardContent>
  </Card>
</div>

    );
  }

  // Step 2: Login Form Screen
  // Show this after user has selected a role
  return (
    <div
      className="min-h-screen flex items-center bg-cover justify-center bg-black px-4"
      style={{
        backgroundImage:
          "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
      }}
    >
      <Card className="max-w-md w-full border-0  relative overflow-hidden bg-transparent rounded-2xl">
        <CardHeader className="relative z-10">
          <Button
            onClick={goBack}
            variant="ghost"
            className="md:text-zinc-500 text-white hover:text-zinc-300 text-sm w-fit p-0 h-auto hover:bg-transparent cursor-pointer"
          >
            ← Back to role selection
          </Button>

          <div className="text-center space-y-2">
            <CardTitle className="text-white mt-4 text-lg font-medium">
              Sign in to your {selectedRole.toLowerCase()} account
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium hover:bg-zinc-300 disabled:bg-zinc-700 cursor-pointer disabled:text-zinc-400"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <Separator className="bg-zinc-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-[#0e0e0e] px-2 text-sm text-zinc-500">
                or
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              variant="secondary"
              className="w-full flex cursor-pointer  items-center justify-center gap-2 bg-white hover:text-white text-black border-white hover:bg-[#1a1a1a]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.7 0 6.3 1.6 7.8 3L36.3 9C33.2 6.2 29.1 4.5 24 4.5 15.7 4.5 8.8 9.8 6.3 17.1l6.9 5.3C14.6 16.4 18.8 13.5 24 13.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 43.5c5.4 0 9.8-1.8 13.1-4.8l-6.4-5c-1.7 1.1-4 1.9-6.7 1.9-5.2 0-9.5-3.4-11.1-8.1l-6.9 5.3C8.9 38.4 15.8 43.5 24 43.5z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M43.6 24.5c0-1.3-.1-2.3-.3-3.5H24v7h11.1c-.5 2.3-1.9 4.2-3.8 5.5l6.4 5C41.9 35.7 43.6 30.4 43.6 24.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12.9 28.4c-.4-1.1-.7-2.2-.7-3.4s.3-2.3.7-3.4l-6.9-5.3c-1.4 2.8-2.3 6-2.3 9.3s.9 6.5 2.3 9.3l6.9-5.3z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => handleOAuthLogin("github")}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center cursor-pointer justify-center gap-2 bg-[#1a1a1a] text-white border border-zinc-700 hover:bg-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to GitHub...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.26c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 00-1.34-1.76c-1.09-.75.08-.74.08-.74a2.52 2.52 0 011.84 1.23 2.56 2.56 0 003.49 1 2.53 2.53 0 01.76-1.6c-2.66-.3-5.46-1.33-5.46-5.93a4.64 4.64 0 011.23-3.21 4.3 4.3 0 01.12-3.17s1-.32 3.3 1.23a11.43 11.43 0 016 0c2.28-1.55 3.28-1.23 3.28-1.23a4.3 4.3 0 01.12 3.17 4.63 4.63 0 011.23 3.21c0 4.61-2.8 5.62-5.48 5.92a2.86 2.86 0 01.82 2.22v3.3c0 .32.21.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-white hover:underline">
              Sign up here
            </Link>
          </p>

          <p className="text-center text-xs text-zinc-600">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
