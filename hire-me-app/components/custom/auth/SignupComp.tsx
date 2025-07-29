"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import EmailVerificationNotice from "../Email/ui/EmailVerificationNotice"; // ✅ import added

// shadcn/ui component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
     import { ArrowLeft } from "lucide-react"; // if not imported already
import Link from "next/link";
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
        if(data.error === "Account created but email is not varified "){
          toast.error(data.error)
          router.push("/auth/verify-email");
          return 
        }
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
      <div className="min-h-screen flex items-center justify-center bg-black  bg-cover px-4 pt-5"
         style={{
          backgroundImage:
            "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
        }}
      >
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


<div
  className="min-h-screen flex flex-col items-center justify-center bg-black px-4 bg-cover"
  style={{
    backgroundImage:
      "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
  }}
>
  {/* Back Button */}
  <div className="absolute top-6 left-6">
    <Link
      href="/"
      className="inline-flex items-center text-white hover:text-zinc-300 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      <span className="text-sm font-medium">Back to Home</span>
    </Link>
  </div>

  {/* Auth Card */}
  <Card className="max-w-md w-full border-0 bg-transparent rounded-2xl  shadow-lg mt-10">
    <CardHeader className="text-center">
      <CardTitle className="text-3xl font-bold text-white mb-2">
        Get interview-ready with AI
      </CardTitle>
      <CardDescription className="text-zinc-400">
        Choose your account type
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      {/* Candidate Button */}
      <Button
        onClick={() => handleRoleSelection("CANDIDATE")}
        variant="outline"
        className="group cursor-pointer w-full h-auto px-6 py-4 bg-transparent border border-zinc-600 text-white hover:bg-zinc-900/50 hover:border-zinc-400 transition-all duration-200 rounded-xl"
      >
        <div className="text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:underline">
            Register as Candidate
          </h3>
          <p className="text-sm text-zinc-500">I want to get hired</p>
        </div>
      </Button>

      {/* Recruiter Button */}
      <Button
        onClick={() => handleRoleSelection("RECRUITER")}
        variant="outline"
        className="group w-full cursor-pointer h-auto px-6 py-4 bg-transparent border border-zinc-600 text-white hover:bg-zinc-900/50 hover:border-zinc-400 transition-all duration-200 rounded-xl"
      >
        <div className="text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:underline">
            Register as Recruiter
          </h3>
          <p className="text-sm text-zinc-500">I want to hire talent</p>
        </div>
      </Button>
    </CardContent>

    <CardContent className="pt-0">
      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-white hover:underline">
          Sign in
        </Link>
      </p>
    </CardContent>
  </Card>
</div>

    );
  }

  // Step 2: Registration Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-black px-4 pt-5"
          style={{
        backgroundImage:
          "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
      }}
    >
      <Card className="max-w-md w-full bg-transparent border-0">
        <CardHeader>
          <Button
            onClick={goBack}
            variant="ghost"
            className="text-zinc-400 cursor-pointer hover:text-zinc-200 text-sm w-fit p-0 h-auto hover:bg-transparent mb-4"
          >
            ← Back to role selection
          </Button>
          <div className="text-center space-y-2">
            <CardTitle className="text-zinc-100">
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
                className="text-white"
                placeholder="John Doe"
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
                className="text-white"
                placeholder="JohnDoe@gmail.com"
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
                  className="text-white"
                placeholder="********"
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
                className="text-white"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full cursor-pointer ${
                selectedRole === "RECRUITER"
                ? "bg-zinc-800 hover:bg-zinc-700"
      : "bg-zinc-900 hover:bg-zinc-700"
              } text-white transition-colors`}
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
              variant="secondary"
              className="w-full flex cursor-pointer  items-center justify-center gap-2 bg-white hover:text-white text-black border-white hover:bg-[#1a1a1a]"
            >
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
              Sign in with Google
            </Button>

            <Button
              onClick={() => handleOAuthRegister("github")}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center cursor-pointer justify-center gap-2 bg-[#1a1a1a] text-white border-0 hover:bg-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.26c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 00-1.34-1.76c-1.09-.75.08-.74.08-.74a2.52 2.52 0 011.84 1.23 2.56 2.56 0 003.49 1 2.53 2.53 0 01.76-1.6c-2.66-.3-5.46-1.33-5.46-5.93a4.64 4.64 0 011.23-3.21 4.3 4.3 0 01.12-3.17s1-.32 3.3 1.23a11.43 11.43 0 016 0c2.28-1.55 3.28-1.23 3.28-1.23a4.3 4.3 0 01.12 3.17 4.63 4.63 0 011.23 3.21c0 4.61-2.8 5.62-5.48 5.92a2.86 2.86 0 01.82 2.22v3.3c0 .32.21.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign in with GitHub
            </Button>
          </div>
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


//  <div className="space-y-3">
//             <Button
//               onClick={() => handleOAuthRegister("google")}
//               disabled={loading}
//               variant="outline"
//               className="w-full bg-white text-black"
//             >
//               Sign up with Google
//             </Button>
//             <Button
//               onClick={() => handleOAuthRegister("github")}
//               disabled={loading}
//               variant="outline"
//               className="w-full bg-zinc-800 text-white"
//             >
//               Sign up with GitHub
//             </Button>
//           </div>