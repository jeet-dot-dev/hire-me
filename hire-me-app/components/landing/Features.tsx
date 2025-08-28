"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { HoverEffect } from "@/src/components/ui/card-hover-effect";
import {
  FileText,
  Target,
  Mic,
  Star,
  BarChart3,
  Lightbulb,
  Search,
  Zap,
  Calendar,
  Building2,
  TrendingUp,
  Users,
} from "lucide-react";

export function FeatureCardsDemo({ role }: { role: string }) {
  const items = role === "Candidate" ? candidateFeatures : recruiterFeatures;
  return (
    <div className="max-w-6xl mx-auto px-8">
      <HoverEffect items={items} />
    </div>
  );
}

export const candidateFeatures = [
  {
    title: "AI Resume Analysis",
    description:
      "Upload your resume and get instant AI-powered analysis with skill matching, scoring, and detailed feedback against job requirements.",
    link: "#resume-analysis",
    icon: FileText,
  },
  {
    title: "Smart Job Browsing",
    description:
      "Browse available job opportunities with detailed descriptions, skill requirements, and instant one-click application system.",
    link: "#job-browsing",
    icon: Target,
  },
  {
    title: "AI-Powered Interviews",
    description:
      "Take live AI interviews with real-time speech recognition, personalized questions based on your resume and job role.",
    link: "#ai-interviews",
    icon: Mic,
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Discover which skills you have that match the job and identify missing skills to focus your learning efforts.",
    link: "#skill-analysis",
    icon: Star,
  },
  {
    title: "Application Dashboard",
    description:
      "Track all your job applications, view application status, interview results, and performance analytics in one place.",
    link: "#application-dashboard",
    icon: BarChart3,
  },
  {
    title: "Interview Credits System",
    description:
      "Manage your interview attempts with our credit-based system, track usage, and upgrade for unlimited access.",
    link: "#interview-credits",
    icon: Lightbulb,
  },
];

export const recruiterFeatures = [
  {
    title: "AI Job Description Generator",
    description:
      "Create professional, engaging job descriptions instantly using AI. Generate comprehensive content from basic job requirements.",
    link: "#job-generator",
    icon: Search,
  },
  {
    title: "Automated Resume Screening",
    description:
      "AI-powered resume analysis with skill matching, scoring, and comprehensive candidate evaluation reports.",
    link: "#resume-screening",
    icon: Zap,
  },
  {
    title: "AI Interview Results",
    description:
      "Review detailed AI-generated interview transcripts, candidate analysis, strengths, weaknesses, and hiring recommendations.",
    link: "#interview-results",
    icon: Calendar,
  },
  {
    title: "Application Management",
    description:
      "Manage all job applications in one dashboard with application tracking, candidate profiles, and status management.",
    link: "#application-management",
    icon: Building2,
  },
  {
    title: "Smart Skill Extraction",
    description:
      "Automatically extract relevant technical and soft skills from job descriptions using AI-powered tag generation.",
    link: "#skill-extraction",
    icon: TrendingUp,
  },
  {
    title: "Candidate Analytics",
    description:
      "View comprehensive candidate analytics including interview scores, skill match percentages, and detailed performance metrics.",
    link: "#candidate-analytics",
    icon: Users,
  },
];

const Features = () => {
  const [role, setRole] = React.useState("Candidate");

  return (
   <section id="features">
     <div className="relative bg-black w-full flex items-center flex-col justify-center py-16 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#94725d]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#b8956d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#94725d]/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content with relative positioning */}
      <div className="relative z-10 w-full flex items-center flex-col justify-center">
        {/* Enhanced Badge */}
        <Badge className="px-5 py-3 rounded-3xl font-bold mb-6">
          <span className="w-3 h-3 rounded-full bg-[#94725d] mr-2 animate-pulse"></span>
          Features
        </Badge>

        {/* Enhanced Role Selector */}
        <div className="flex items-center bg-black/20 rounded-full p-2 mb-6 border border-white/10 backdrop-blur-sm">
          <div
            onClick={() => setRole("Candidate")}
            className={`px-6 py-3 rounded-full cursor-pointer transition-all duration-300 ${
              role === "Candidate"
                ? "bg-gradient-to-r from-[#080808] to-[#b8956d] text-white font-semibold shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Candidate
          </div>
          <div
            onClick={() => setRole("Recruiter")}
            className={`px-6 py-3 rounded-full cursor-pointer transition-all duration-300 ${
              role === "Recruiter"
                ? "bg-gradient-to-r from-[#080808] to-[#b8956d] text-white font-semibold shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Recruiter
          </div>
        </div>

        {/* Feature Cards */}
        <div className="w-full">
          <FeatureCardsDemo role={role} />
        </div>
      </div>
    </div>
   </section>
  );
};

export default Features;
