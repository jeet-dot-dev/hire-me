"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface FormDataType {
  password: string;
  confirmPassword: string;
}

const Page = () => {
  // For demo purposes - in real app these would come from Next.js hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState<FormDataType>({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");

  // handleInputChange func
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  // onsubmit func
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError("");
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match. Please try again");
        toast.error("Passwords do not match. Please try again");
        setLoading(false);
        return;
      }

      const response = await axios.post("/api/auth/update-password", {
        password: formData.password,
        token,
      });
      if (response.status === 200) {
        toast.success("Password updated successfully! Redirecting to login...");
        router.push("/auth/login");
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        "Failed to update password. Please check your internet connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="min-h-screen bg-black bg-cover flex items-center justify-center p-4"
        style={{
          backgroundImage:
            "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
        }}
      >
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              Invalid Reset Link
            </h1>
            <p className="text-muted-foreground text-sm">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <Button
            onClick={() => router.push("/auth/reset-password")}
            className="w-full"
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black flex bg-cover items-center justify-center p-4"
      style={{
        backgroundImage:
          "url('https://pub-e8254eef37b34b8c92dffe1a5f1c9a49.r2.dev/Hire-me-assets/authBgImage.webp')",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Set up a New Password
          </h1>
          <p className="text-muted-foreground text-sm">
            Your password must be different from your previous one.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              New password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-zinc-500" />
                ) : (
                  <Eye className="h-4 w-4 text-zinc-500" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Enter your password again"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-zinc-500" />
                ) : (
                  <Eye className="h-4 w-4 text-zinc-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center p-3 bg-red-950/50 border border-red-800/50 rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>

        <Button
          variant="link"
          onClick={() => router.push("/auth/login")}
          className="w-full text-zinc-400 hover:text-zinc-300 transition-colors text-sm cursor-pointer"
        >
          ← Back to login
        </Button>
      </div>
    </div>
  );
};

export default Page;
