"use client";
import React from "react";
import {
  FileText,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  AlertTriangle,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Badge component since we can't import it
// const Badge = ({ children, className = "" }) => (
//   <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}>
//     {children}
//   </span>
// );

type InterviewUIProps = {
  transcriptSummary: string | null;
  aiRecommendation: string | null;
  strongPoints: string[] | null;
  weakPoints: string[] | null;
  aiSuggestions: string[] | null;
  suspiciousActivities: string[] | null;
};

const SectionCard = ({
  title,
  icon: Icon,
  children,
  description,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  description?: string;
}) => (
  <div className="bg-black rounded-xl shadow-2xl border border-white/20 overflow-hidden relative group hover:border-white/30 transition-all duration-300">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-3">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "16px 16px",
        }}
      ></div>
    </div>

    <div className="relative">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-md"></div>
            <div className="relative p-2 bg-white/10 rounded-lg border border-white/20">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-white/60 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const InterviewUI = ({
  transcriptSummary,
  aiRecommendation,
  strongPoints,
  weakPoints,
  aiSuggestions,
  suspiciousActivities,
}: InterviewUIProps) => {
  const totalPoints = (strongPoints?.length || 0) + (weakPoints?.length || 0);
  const strongPercentage =
    totalPoints > 0
      ? Math.round(((strongPoints?.length || 0) / totalPoints) * 100)
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="bg-black rounded-xl border border-white/20 p-6 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
              <div className="relative p-3 bg-white/10 rounded-full border border-white/20">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Interview Analysis
              </h1>
              <p className="text-white/70 text-sm">
                Comprehensive AI-powered evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {strongPercentage}%
              </div>
              <div className="text-xs text-white/60">Strong Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{totalPoints}</div>
              <div className="text-xs text-white/60">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {aiSuggestions?.length || 0}
              </div>
              <div className="text-xs text-white/60">Suggestions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Transcript Summary */}
        <SectionCard
          title="Interview Summary"
          icon={FileText}
          description="AI-generated overview of the conversation"
        >
          {transcriptSummary ? (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                {transcriptSummary}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                No transcript summary available
              </p>
            </div>
          )}
        </SectionCard>

        {/* AI Recommendation */}
        <SectionCard
          title="AI Recommendation"
          icon={Bot}
          description="Intelligent hiring decision support"
        >
          {aiRecommendation ? (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                <p className="text-white/90 text-sm leading-relaxed">
                  {aiRecommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                No AI recommendation available
              </p>
            </div>
          )}
        </SectionCard>

        {/* Strong & Weak Points Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strong Points */}
          <SectionCard
            title="Strong Points"
            icon={ThumbsUp}
            description="Candidate's key strengths identified"
          >
            {strongPoints && strongPoints.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-sm">
                    Identified strengths
                  </span>
                  <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {strongPoints.length}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {strongPoints.map((point, idx) => (
                    <Badge
                      key={idx}
                      className="bg-white text-black border border-white px-3 py-1.5 rounded-full font-medium hover:bg-white/90 transition-all duration-200 hover:scale-105 shadow-sm"
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ThumbsUp className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 text-sm">
                  No strong points identified
                </p>
              </div>
            )}
          </SectionCard>

          {/* Weak Points */}
          <SectionCard
            title="Areas for Improvement"
            icon={ThumbsDown}
            description="Points that need development"
          >
            {weakPoints && weakPoints.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-sm">
                    Improvement areas
                  </span>
                  <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                    {weakPoints.length}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {weakPoints.map((point, idx) => (
                    <Badge
                      key={idx}
                      className="bg-white/10 text-white border border-white/30 px-3 py-1.5 rounded-full font-medium hover:bg-white/20 transition-all duration-200 hover:scale-105 shadow-sm backdrop-blur-sm whitespace-normal break-words max-w-full text-xs sm:text-sm leading-snug"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ThumbsDown className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 text-sm">
                  No weak points identified
                </p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* AI Suggestions */}
        <SectionCard
          title="AI Suggestions"
          icon={Lightbulb}
          description="Actionable recommendations for improvement"
        >
          {aiSuggestions && aiSuggestions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white/80 text-sm">
                  Improvement suggestions
                </span>
                <div className="bg-white text-black px-2 py-1 rounded-full text-xs font-semibold">
                  {aiSuggestions.length}
                </div>
              </div>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-full p-1 mt-1">
                        <Lightbulb className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed flex-1">
                        {suggestion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                No AI suggestions available
              </p>
            </div>
          )}
        </SectionCard>

        {/* Suspicious Activities */}
        <SectionCard
          title="Security Analysis"
          icon={Shield}
          description="Potential integrity concerns detected"
        >
          {suspiciousActivities && suspiciousActivities.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm">
                  Flagged activities
                </span>
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                  {suspiciousActivities.length}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {suspiciousActivities.map((activity, idx) => (
                  <Badge
                    key={idx}
                    className="bg-white/20 text-white border border-white/40 px-3 py-1.5 rounded-full font-medium hover:bg-white/30 transition-all duration-200 hover:scale-105 shadow-sm backdrop-blur-sm whitespace-normal break-words max-w-full text-xs sm:text-sm"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">
                No suspicious activities detected
              </p>
              <p className="text-white/30 text-xs mt-1">
                Interview appears secure and authentic
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Summary Footer */}
      <div className="bg-black rounded-xl border border-white/20 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent 25%, white 25%, white 50%, transparent 50%, transparent 75%, white 75%, white)`,
              backgroundSize: "12px 12px",
            }}
          ></div>
        </div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-white/70" />
            <div className="text-center sm:text-left">
              <p className="text-white/80 text-sm">
                Analysis complete with{" "}
                <span className="font-semibold">
                  {strongPoints?.length || 0}
                </span>{" "}
                strengths and{" "}
                <span className="font-semibold">
                  {aiSuggestions?.length || 0}
                </span>{" "}
                improvement suggestions
              </p>
              <p className="text-white/60 text-xs">
                {suspiciousActivities && suspiciousActivities.length > 0
                  ? `${suspiciousActivities.length} security concern(s) flagged`
                  : "Interview integrity verified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${strongPercentage}%` }}
              ></div>
            </div>
            <span className="text-white font-semibold text-sm">
              {strongPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewUI;
