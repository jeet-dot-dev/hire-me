"use client";
import React from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";

const candidateSteps = [
  {
    id: 1,
    title: "Create Your Profile",
    description:
      "Build a comprehensive profile showcasing your skills, experience, and career goals. Upload your resume and let our AI optimize it for maximum visibility.",
    image: "/assets/video.png",
    buttonText: "Profile Tutorial",
  },
  {
    id: 2,
    title: "AI-Powered Matching",
    description:
      "Our intelligent system analyzes your profile and matches you with relevant job opportunities that align with your skills and preferences.",
    image: "/assets/video.png",
    buttonText: "Matching Guide",
  },
];

const recruiterSteps = [
  {
    id: 1,
    title: "Create Job Posting",
    description:
      "Post detailed job requirements and let our AI help optimize your job description to attract the best candidates in your industry.",
    image: "/assets/video.png",
    buttonText: "Posting Guide",
  },
  {
    id: 2,
    title: "Smart Candidate Sourcing",
    description:
      "Access our advanced search tools to find candidates that match your specific requirements beyond just keywords and resume scanning.",
    image: "/assets/video.png",
    buttonText: "Sourcing Tutorial",
  },
];

const HowItWorks = () => {
  const [role, setRole] = React.useState("Candidate");
  const currentSteps = role === "Candidate" ? candidateSteps : recruiterSteps;

  return (
   <section id="how-it-works">
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
            How it works
          </Badge>
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
        </div>

        <div className="flex flex-col gap-16 mt-5 max-w-6xl mx-auto px-6">
          {currentSteps.map((step, index) => (
            <div
              key={step.id}
              className={`max-w-full flex flex-col lg:flex-row justify-around items-center mt-5 gap-8 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 max-w-md">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <div className="flex-1 max-w-md flex flex-col justify-around items-start text-white p-4">
                <h1 className="text-3xl font-bold mb-4">{step.title}</h1>
                <p className="text-muted-foreground pb-5 leading-relaxed">
                  {step.description}
                </p>
                <Button className="bg-white text-black hover:bg-[#94725d] cursor-pointer hover:text-white rounded-3xl px-6">
                  {step.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
