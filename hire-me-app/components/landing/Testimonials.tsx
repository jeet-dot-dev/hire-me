"use client";
import React, { useState } from "react";
import { Badge } from "../ui/badge";

import { AnimatedTestimonials } from "@/src/components/ui/animated-testimonials";

export function AnimatedTestimonialsDemo({ role }: { role: string }) {
  const candidateTestimonials = [
    {
      quote:
        "HireMe transformed my job search experience. The AI-powered matching connected me with my dream role in just 2 weeks. The interview preparation tools were incredibly helpful!",
      name: "Sarah Chen",
      designation: "Software Engineer at TechFlow",
      src: "/testimonials/recruiter1.jpg",
    },
    {
      quote:
        "Finally found my perfect role through HireMe! The resume optimization suggestions and interview coaching helped me stand out. Got 3 offers within a month!",
      name: "James Kim",
      designation: "Data Scientist at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The platform made job hunting so much easier. I loved how the AI suggested roles that perfectly matched my skills and career goals. Landing interviews became effortless!",
      name: "Maria Garcia",
      designation: "UX Designer at CreativeHub",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "HireMe's interview practice feature was a game-changer. The AI feedback helped me improve my responses and build confidence. I aced every interview after using it!",
      name: "David Park",
      designation: "Product Manager at InnovateCorp",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "As a recent graduate, HireMe helped me navigate the job market with confidence. The personalized job recommendations and application tracking made everything organized and stress-free.",
      name: "Alex Johnson",
      designation: "Junior Developer at StartupTech",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const recruiterTestimonials = [
    {
      quote:
        "As a recruiter, HireMe has revolutionized how I find top talent. The candidate screening process is 70% faster, and the quality of matches has improved dramatically.",
      name: "Michael Rodriguez",
      designation: "Senior Recruiter at InnovateSphere",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The platform's analytics and bulk hiring features have streamlined our recruitment process. We've reduced time-to-hire by 50% while maintaining high-quality standards.",
      name: "Emily Watson",
      designation: "HR Director at CloudScale",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "HireMe's candidate database and filtering tools have made talent acquisition so much easier. The AI recommendations consistently deliver qualified candidates that fit our culture.",
      name: "Lisa Thompson",
      designation: "Talent Acquisition Manager at FutureNet",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The automated candidate scoring and interview scheduling features have transformed our hiring workflow. We can now focus on building relationships rather than administrative tasks.",
      name: "Robert Chen",
      designation: "VP of Talent at TechGlobal",
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "HireMe's advanced search filters and AI-powered candidate matching have significantly improved our hiring success rate. We're finding better fits faster than ever before.",
      name: "Amanda Foster",
      designation: "Head of Recruitment at FinanceForward",
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const testimonials =
    role === "Candidate" ? candidateTestimonials : recruiterTestimonials;

  return <AnimatedTestimonials testimonials={testimonials} />;
}

const Testimonials = () => {
  const [role, setRole] = useState("Candidate");
  return (
    <div>
      <div className="relative bg-black w-full flex items-center flex-col justify-center py-16 overflow-hidden">
        {/* Animated Background Orbs with golden touch */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Content with relative positioning */}
        <div className="relative z-10 w-full flex items-center flex-col justify-center">
          {/* Enhanced Badge */}
          <Badge className="px-5 py-3 rounded-3xl font-bold mb-6">
            <span className="w-3 h-3 rounded-full bg-[#94725d] mr-2 animate-pulse"></span>
            Testimonials
          </Badge>
          {/* Role Selector */}
          <div className="flex  items-center bg-black/20 rounded-full p-2 mb-6 border border-white/10 backdrop-blur-sm">
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
          <div className="">
            <AnimatedTestimonialsDemo role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
