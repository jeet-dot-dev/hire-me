"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import EmailVerificationNotice from "../Email/ui/EmailVerificationNotice"; // ✅ import added

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
import { toast } from "sonner";

type Role = "CANDIDATE" | "RECRUITER";

export default function SignupComp() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [emailToCheck, setEmailToCheck] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRoleSelection = (role: Role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleOAuthRegister = (provider: "google" | "github") => {
    if (!selectedRole) {
      toast.error("Please select a role first.");
      return;
    }

    Cookies.set("oauth_role", selectedRole, { expires: 0.1 });
    signIn(provider);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");

    try {
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
        toast.success("Account created! Please verify your email.");
        setEmailToCheck(formData.email);
        setShowVerificationNotice(true);
        return; // ✅ stop here and show verification UI
      } else {
        const data = await response.json();
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedRole(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  // ✅ Step 0: Show email verification UI if user just registered
  if (showVerificationNotice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-5">
        <EmailVerificationNotice
          email={emailToCheck}
          onVerified={async () => {
            toast.success("Email verified! Logging in...");
            await signIn("credentials", {
              email: formData.email,
              password: formData.password,
              role:selectedRole,
              redirect: true,
              callbackUrl: "/dashboard",
            });
          }}
        />
      </div>
    );
  }

  // Step 1: Role selection
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
            <Button
              onClick={() => handleRoleSelection("CANDIDATE")}
              variant="outline"
              className="w-full h-auto px-6 py-4 bg-transparent border-2 text-white hover:bg-[#18181a]"
            >
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Register as Candidate
                </h3>
                <p className="text-sm text-zinc-600">I&apos;m looking for a job</p>
              </div>
            </Button>
            <Button
              onClick={() => handleRoleSelection("RECRUITER")}
              variant="outline"
              className="w-full h-auto px-6 py-4 bg-transparent border-2 text-white hover:bg-[#18181a]"
            >
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Register as Recruiter
                </h3>
                <p className="text-sm text-zinc-600">I want to hire talent</p>
              </div>
            </Button>
          </CardContent>
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

  // Step 2: Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-5">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
        <CardHeader>
          <Button
            onClick={goBack}
            variant="ghost"
            className="text-zinc-400 hover:text-zinc-200 text-sm w-fit p-0 h-auto hover:bg-transparent mb-4"
          >
            ← Back to role selection
          </Button>
          <div className="text-center space-y-2">
            <CardTitle className="text-zinc-400">
              Create your {selectedRole.toLowerCase()} account
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-200">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-200">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${
                selectedRole === "RECRUITER"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading
                ? "Creating account..."
                : `Create ${selectedRole.toLowerCase()} account`}
            </Button>
          </form>

          <div className="relative">
            <Separator className="bg-zinc-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-zinc-900 px-2 text-sm text-zinc-400">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleOAuthRegister("google")}
              disabled={loading}
              variant="outline"
              className="w-full bg-white text-black"
            >
              Sign up with Google
            </Button>
            <Button
              onClick={() => handleOAuthRegister("github")}
              disabled={loading}
              variant="outline"
              className="w-full bg-zinc-800 text-white"
            >
              Sign up with GitHub
            </Button>
          </div>
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
