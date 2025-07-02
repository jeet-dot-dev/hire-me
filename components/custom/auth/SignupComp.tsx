"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
// shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Define the two possible user roles
type Role = "CANDIDATE" | "RECRUITER";

export default function SignupComp() {
  // State for tracking which role the user selected (starts as null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Next.js router for programmatic navigation
  const router = useRouter();

  // Function to handle role selection (CANDIDATE or RECRUITER)
  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role); // Set the selected role
    setError(""); // Clear any existing errors when switching roles
  };

  // Function to handle OAuth registration (Google or GitHub)
  const handleOAuthRegister = (provider: "google" | "github") => {
    // Make sure user selected a role first
    if (!selectedRole) {
      toast.error("Please select a role first.");
      return;
    }

    // Store the selected role in a short-lived cookie (6 hours max)
    // This helps the OAuth callback know what role the user intended
    Cookies.set("oauth_role", selectedRole, { expires: 0.1 });

    // Initiate OAuth flow with the selected provider
    signIn(provider);
  };

  // Function to handle form submission for credentials-based registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedRole) return; // Exit if no role selected

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true); // Show loading state
    setError(""); // Clear any existing errors

    try {
      // Send registration request to API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
      });

      if (response.ok) {
        // Registration successful - automatically sign in the user
        toast.success("Account created successfully!");
        await signIn("credentials", {
          redirect: true,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          callbackUrl: "/dashboard",
        });
      } else {
        // Registration failed - show error message
        const data = await response.json();
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Function to go back to role selection screen
  const goBack = () => {
    setSelectedRole(null); // Reset role selection
    // Clear all form data
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError(""); // Clear errors
  };

  // Step 1: Role Selection Screen
  // Show this when no role is selected yet
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Join Us
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Choose your account type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Button to select CANDIDATE role */}
            <Button
              onClick={() => handleRoleSelection("CANDIDATE")}
              variant="outline"
              className="w-full h-auto px-6 py-4 bg-transparent border-2 text-white hover:bg-[#18181a] cursor-pointer  transition-all group"
            >
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold  text-white mb-1">
                  Register as Candidate
                </h3>
                <p className="text-sm text-zinc-600">
                  I&apos;m looking for a job
                </p>
              </div>
            </Button>

            {/* Button to select RECRUITER role */}
            <Button
              onClick={() => handleRoleSelection("RECRUITER")}
              variant="outline"
              className="w-full h-auto px-6 py-4 bg-transparent border-2text-left cursor-pointer  hover:bg-[#18181a] transition-all group"
            >
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Register as Recruiter
                </h3>
                <p className="text-sm text-zinc-200">
                  I want to hire talent
                </p>
              </div>
            </Button>
          </CardContent>

          {/* Link to Login Page */}
          <CardContent className="pt-0">
            <p className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white hover:underline">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Registration Form Screen
  // Show this after user has selected a role
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-5">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardHeader>
          {/* Back button to return to role selection */}
          <Button
            onClick={goBack}
            variant="ghost"
            className="text-zinc-400 hover:text-zinc-200 text-sm w-fit p-0 h-auto hover:bg-transparent mb-4"
          >
            ← Back to role selection
          </Button>

          {/* Header showing selected role and title */}
          <div className="text-center space-y-2">
            <CardTitle className="text-zinc-400">
              Create your {selectedRole.toLowerCase()} account
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-200">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            {/* Email Input Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            {/* Confirm Password Input Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-200">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
              />
            </div>

            {/* Submit Button with role-based styling */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${
                selectedRole === "RECRUITER"
                  ? "bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                  : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
              } text-white`}
            >
              {loading
                ? "Creating account..."
                : `Create ${selectedRole.toLowerCase()} account`}
            </Button>
          </form>

          {/* Separator between form and OAuth registration */}
          <div className="relative">
            <Separator className="bg-zinc-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-zinc-900 px-2 text-sm text-zinc-400">or</span>
            </div>
          </div>

          {/* OAuth Registration Buttons */}
          <div className="space-y-3">
            {/* Google OAuth Button */}
            <Button
              onClick={() => handleOAuthRegister("google")}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center bg-white text-black border-white hover:bg-zinc-200"
            >

              Sign up with Google
            </Button>

            {/* GitHub OAuth Button */}
            <Button
              onClick={() => handleOAuthRegister("github")}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
            >
             
                
              Sign up with GitHub
            </Button>
          </div>

          {/* Link to Login Page */}
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:underline">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
