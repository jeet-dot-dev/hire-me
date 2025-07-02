"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
// shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Sonner toast import
import { toast } from "sonner";

// Define the two possible user roles
type Role = "RECRUITER" | "CANDIDATE";

export default function LoginPage() {
  // State for tracking which role the user selected (starts as null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for error messages and loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Next.js router for programmatic navigation
  const router = useRouter();

  // Function to handle role selection (RECRUITER or CANDIDATE)
  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role); // Set the selected role
    setError(""); // Clear any existing errors when switching roles
  };

  // Function to handle credentials-based login (email + password)
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Show loading state
    setError(""); // Clear any existing errors

    // Attempt to sign in using NextAuth credentials provider
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Don't auto-redirect, we'll handle it manually
    });

    // Check if login failed
    if (result?.error) {
      toast.error("Invalid email, password, or role mismatch.");
    } else {
      // Login successful - fetch the user's session to get their role
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      // Redirect user based on their role
      if (role === "RECRUITER") {
        toast.success("Logged in!");
        router.push("/recruiter/dashboard");
      } else if (role === "CANDIDATE") {
        toast.success("Logged in!");
        router.push("/candidate/dashboard");
      } else {
        // User exists but has no role assigned
        toast.error("No role assigned to this account.");
      }
    }

    setLoading(false); // Hide loading state
  };

  // Function to handle OAuth login (Google or GitHub)
  const handleOAuthLogin = (provider: "google" | "github") => {
    // Make sure user selected a role first
    if (!selectedRole) {
      toast.error("Please select a role first.");
      return;
    }

    // Store the selected role in a short-lived cookie (6 minutes)
    // This helps the OAuth callback know what role the user intended
    Cookies.set("oauth_role", selectedRole, { expires: 0.004 });
    
    // Initiate OAuth flow with the selected provider
    signIn(provider);
  };

  // Function to go back to role selection screen
  const goBack = () => {
    setSelectedRole(null); // Reset role selection
    setError(""); // Clear errors
    setEmail(""); // Clear form inputs
    setPassword("");
  };

  // Step 1: Role Selection Screen
  // Show this when no role is selected yet
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">
              Login to Your Account
            </CardTitle>
            <CardDescription className="text-base text-zinc-400">
              Select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Button to select CANDIDATE role */}
            <Button
              onClick={() => handleRoleSelection("CANDIDATE")}
              variant="outline"
              className="w-full h-12 bg-transparent border-2 text-white transition-colors"
            >
              Login as Candidate
            </Button>
            
            {/* Button to select RECRUITER role */}
            <Button
              onClick={() => handleRoleSelection("RECRUITER")}
              variant="outline"
              className="w-full h-12 bg-transparent border-2 text-white transition-colors"
            >
               Login as Recruiter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Login Form Screen
  // Show this after user has selected a role
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardHeader>
          {/* Back button to return to role selection */}
          <Button
            onClick={goBack}
            variant="ghost"
            className="text-zinc-400 hover:text-zinc-200 text-sm w-fit p-0 h-auto hover:bg-transparent"
          >
            ← Back to role selection
          </Button>

          {/* Header showing selected role and title */}
          <div className="text-center space-y-2">
            <CardTitle className="text-zinc-400 mt-4">
              Sign in to your {selectedRole.toLowerCase()} account
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Credentials Login Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            {/* Email Input Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-200">Password</Label>
                <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-zinc-200">
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white cursor-pointer text-black hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Separator between credentials and OAuth login */}
          <div className="relative">
            <Separator className="bg-zinc-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-zinc-900 px-2 text-sm text-zinc-400">or</span>
            </div>
          </div>

          {/* OAuth Login Buttons */}
          <div className="space-y-3">
            {/* Google OAuth Button */}
            <Button
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              variant="outline"
              className="w-full flex cursor-pointer items-center justify-center bg-white text-black border-white hover:bg-zinc-200"
            >
              Sign in with Google
            </Button>

            {/* GitHub OAuth Button */}
            <Button
              onClick={() => handleOAuthLogin("github")}
              disabled={loading}
              variant="outline"
              className="w-full flex cursor-pointer items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0... (replace with full GitHub SVG path)" />
              </svg>
              Sign in with GitHub
            </Button>
          </div>

          {/* Link to Registration Page */}
          <p className="text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-white hover:underline">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}