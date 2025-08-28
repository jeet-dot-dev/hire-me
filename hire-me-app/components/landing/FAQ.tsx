"use client";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { X, Plus } from "lucide-react";

// Add custom CSS for animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

const candidateFAQs = [
  {
    id: 1,
    question: "How does the AI resume analysis work?",
    answer:
      "Upload your resume and our AI analyzes it against job requirements using OpenAI technology. You'll get instant skill matching, a comprehensive score, detailed feedback, and see which skills you have versus what's missing for each job.",
  },
  {
    id: 2,
    question: "How do AI interviews work?",
    answer:
      "Take live AI interviews with real-time speech recognition using OpenAI Whisper. The AI generates personalized questions based on your resume and the job role, providing comprehensive analysis including strengths, weaknesses, and improvement suggestions.",
  },
  {
    id: 3,
    question: "How many free interviews do I get?",
    answer:
      "Every candidate gets 3 free interview attempts. Each interview consumes 1 credit, and you can track your remaining credits on your dashboard. Additional interviews will be available with premium plans.",
  },
  {
    id: 4,
    question: "Can I apply to jobs unlimited on the free plan?",
    answer:
      "Yes! You can browse and apply to unlimited job opportunities on our platform for free. The only limitation is the 3 interview credits, but job applications themselves are unrestricted.",
  },
  {
    id: 5,
    question: "What file formats are supported for resume upload?",
    answer:
      "We support PDF and DOCX formats for resume uploads. Our system uses PDF.js and Mammoth.js to reliably extract text from various document formats and encoding types for AI analysis.",
  },
  {
    id: 6,
    question: "How do I track my job applications?",
    answer:
      "Your dashboard shows all applications with status tracking (pending, accepted, rejected), interview results, resume scores, and performance analytics. You can view detailed results for each application including AI feedback.",
  },
];

const recruiterFAQs = [
  {
    id: 1,
    question: "How does the AI job description generator work?",
    answer:
      "Create professional, engaging job descriptions instantly using AI. Input basic job requirements and our system generates comprehensive content with proper formatting, requirements, and compelling company messaging using OpenAI and Google Gemini.",
  },
  {
    id: 2,
    question: "What resume screening features are available?",
    answer:
      "Get AI-powered resume analysis with skill matching, scoring, and comprehensive candidate evaluation reports. See matched vs unmatched skills, match percentages, and detailed AI-generated candidate overviews for each application.",
  },
  {
    id: 3,
    question: "How do I review AI interview results?",
    answer:
      "Access detailed AI-generated interview transcripts, candidate analysis, identified strengths and weaknesses, hiring recommendations, and suspicious activity detection. All data is organized in comprehensive tabs for easy review.",
  },
  {
    id: 4,
    question: "Can I manage multiple job postings?",
    answer:
      "Yes! Create unlimited job postings with AI-generated descriptions and skill tags. Manage all applications in one dashboard with application tracking, candidate profiles, and status management across all your active positions.",
  },
  {
    id: 5,
    question: "How does the skill extraction feature work?",
    answer:
      "Our AI automatically extracts relevant technical and soft skills from job descriptions using advanced tag generation. This ensures accurate skill matching when candidates apply and helps with better candidate-job alignment.",
  },
  {
    id: 6,
    question: "What analytics and insights do I get?",
    answer:
      "View comprehensive candidate analytics including interview scores, skill match percentages, detailed performance metrics, application status tracking, and AI-generated hiring recommendations to make informed decisions.",
  },
];

const FAQ = () => {
  const [role, setRole] = useState("Candidate");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const currentFAQs = role === "Candidate" ? candidateFAQs : recruiterFAQs;
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
            FAQ
          </Badge>
          {/* Role Selector */}
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

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto px-6 w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {role === "Candidate"
                  ? "Get answers to common questions about our platform and services for job seekers"
                  : "Find answers to questions about our recruiting platform and hiring tools"}
              </p>
            </div>

            <div className="space-y-4">
              {currentFAQs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-black/20 rounded-2xl p-6 transition-all duration-300 hover:bg-black/30 backdrop-blur-sm"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                    }
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === faq.id ? (
                        <X className="w-5 h-5 text-[#8a6956] transition-transform duration-300" />
                      ) : (
                        <Plus className="w-5 h-5 text-[#8a6956] transition-transform duration-300" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFAQ === faq.id
                        ? "max-h-96 opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
