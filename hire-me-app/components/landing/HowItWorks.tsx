"use client";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";

const candidateSteps = [
  {
    id: 1,
    title: "Create Your Profile",
    description:
      "Build your professional profile with skills, education, and experience. Upload your resume (PDF/DOCX) and our system automatically extracts text for AI-powered job matching and interview preparation.",
    video: "/testimonials/profile.mkv",
    buttonText: "Profile Tutorial",
  },
  {
    id: 2,
    title: "Apply & Take AI Interviews",
    description:
      "Apply to jobs with one click and get instant AI resume analysis with skill matching scores. Take live AI interviews with real-time speech recognition and get detailed feedback on your performance.",
    video: "/testimonials/jobapply.mkv",
    buttonText: "Interview Guide",
  },
];

const recruiterSteps = [
  {
    id: 1,
    title: "Create Job Posting",
    description:
      "Create professional job postings with AI-generated descriptions and automatic skill extraction. Our AI analyzes your basic requirements and generates comprehensive job content using OpenAI and Google Gemini.",
    video: "/testimonials/createjob.mkv",
    buttonText: "AI Creation Guide",
  },
  {
    id: 2,
    title: "Review Applications",
    description:
      "Get AI-powered resume screening with skill matching, scoring, and comprehensive candidate evaluation. Review detailed interview transcripts, candidate analysis, and hiring recommendations in one dashboard.",
    video: "/testimonials/result.mkv",
    buttonText: "Review Tutorial",
  },
];

const VideoPlayer = ({ src }: { src: string }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      if (isInView && !isZoomed) {
        videoRef.current.play().catch((error) => {
          // Handle autoplay restrictions
          console.log("Autoplay prevented:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, isZoomed]);

  // Handle video loaded event to ensure it starts playing
  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        if (isInView && !isZoomed) {
          video.play().catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      };

      video.addEventListener("loadeddata", handleLoadedData);
      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [isInView, isZoomed]);

  const handleVideoClick = () => {
    setIsZoomed(true);
  };

  const handleCloseZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
  };

  return (
    <>
      <div ref={ref} className="flex-1 max-w-md">
        <motion.video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-auto rounded-lg shadow-lg border border-white/10 cursor-pointer"
          onClick={handleVideoClick}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 sm:p-4"
            onClick={handleCloseZoom}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[95vh] sm:max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseZoom}
                className="absolute -top-8 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 p-2"
              >
                <X size={24} className="sm:w-8 sm:h-8" />
              </button>
              <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-lg shadow-2xl max-h-[85vh] sm:max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HowItWorks = () => {
  const [role, setRole] = React.useState("Candidate");
  const currentSteps = role === "Candidate" ? candidateSteps : recruiterSteps;

  const handleButtonClick = (buttonText: string) => {
    toast(`${buttonText} feature is coming soon! 🚀`, {
      description: "We're working hard to bring you this amazing experience.",
    });
  };

  return (
    <section id="how-it-works">
      <div className="relative bg-black w-full flex items-center flex-col justify-center py-16 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#94725d]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#b8956d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

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
              <VideoPlayer src={step.video} />
              <div className="flex-1 max-w-md flex flex-col justify-around items-start text-white p-4">
                <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                  {step.title}
                </h1>
                <p className="text-muted-foreground pb-5 leading-relaxed text-sm lg:text-base">
                  {step.description}
                </p>
                <Button
                  className="bg-white text-black hover:bg-[#94725d] cursor-pointer hover:text-white rounded-3xl px-6"
                  onClick={() => handleButtonClick(step.buttonText)}
                >
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
