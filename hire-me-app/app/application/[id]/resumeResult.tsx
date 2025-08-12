"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, LaptopMinimal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import InterviewCheckScreen from "./InterviewCheckScreen";

type ResumeResultProp = {
  score: number;
  overview: string;
  matchedSkills: string[];
  unmatchedSkills: string[];
};

export default function ResumeResult({
  score,
  overview,
  matchedSkills,
  unmatchedSkills,
}: ResumeResultProp) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showInterviewCheck, setShowInterviewCheck] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const router = useRouter();
  const handleScheduleLater = () => {
    setShowComingSoon(true);
  };

  const closeComingSoon = () => {
    setShowComingSoon(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev >= score) {
            clearInterval(interval);
            return score;
          }
          return prev + 1;
        });
      }, 20);
    }, 800);

    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white space-y-6 relative">
      {/* Back Button - Responsive */}
      <div className="absolute hidden md:block top-4 left-4 sm:top-6 sm:left-6">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-white/20 text-white cursor-pointer transition-colors  px-2 py-1 sm:px-3 sm:py-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm">Back</span>
        </Button>
      </div>

      {/* Enhanced Coming Soon Modal */}
      {showComingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeComingSoon}
        >
          {/* Blurred Background Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="relative bg-gradient-to-br from-white/15 to-white/5 border border-white/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 cursor-pointer text-white/70 hover:text-white hover:bg-white/10 p-1"
              onClick={closeComingSoon}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Content */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                <Calendar className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Coming Soon
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Schedule feature is under development and will be available
                  soon!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showInterviewCheck && <InterviewCheckScreen setShowInterviewCheck={setShowInterviewCheck}/>}

      {/* Score Section */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <span className="text-2xl ">🎯</span>
              Match Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.span
                className={`text-6xl font-bold bg-gradient-to-r from-current to-white bg-clip-text text-transparent ${getScoreColor(score)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
              >
                {animatedScore}%
              </motion.span>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Performance</div>
                <div className={`font-semibold ${getScoreColor(score)}`}>
                  {score >= 80
                    ? "Excellent"
                    : score >= 60
                      ? "Good"
                      : score >= 40
                        ? "Fair"
                        : "Needs Improvement"}
                </div>
              </div>
            </div>
            <div className="relative">
              <Progress
                value={animatedScore}
                className="bg-zinc-800 h-4 overflow-hidden rounded-full"
              />
              <motion.div
                className={`absolute top-0 left-0 h-4 rounded-full ${getProgressColor(score)} opacity-80`}
                initial={{ width: "0%" }}
                animate={{ width: `${animatedScore}%` }}
                transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Overview */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/5 border border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📋 AI Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{overview}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Matched Skills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white/5 border border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                ✅ Top Matching Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {matchedSkills?.length > 0 ? (
                matchedSkills.map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/20 text-white border border-white/30"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-400">No matched skills found</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Missing Skills */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="bg-white/5 border border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                ❌ Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {unmatchedSkills?.length > 0 ? (
                unmatchedSkills.map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/10 text-gray-300 border border-white/20"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-400">All required skills matched!</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex gap-4"
      >
        <Button
          size="lg"
          className="bg-white cursor-pointer text-black hover:bg-gray-200 transition-colors"
          variant="secondary"
          onClick={() => setShowInterviewCheck(true)}
        >
          <LaptopMinimal />
          Procced to Interview
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={handleScheduleLater}
          className="bg-transparent border-white/30 text-white cursor-pointer"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Later
        </Button>
      </motion.div>
    </div>
  );
}
