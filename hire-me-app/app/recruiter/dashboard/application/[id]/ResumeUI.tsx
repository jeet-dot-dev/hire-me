import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, TrendingUp, Award, AlertTriangle } from "lucide-react";

const ResumeUI = ({
  resumeOverview,
  matchedSkills,
  unmatchedSkills,
}: {
  resumeOverview: string | null;
  matchedSkills: string[];
  unmatchedSkills: string[];
}) => {
  const totalSkills = matchedSkills.length + unmatchedSkills.length;
  const matchPercentage = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Stats */}
      <div className="bg-black rounded-xl border border-white/20 p-6 shadow-2xl overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
              <div className="relative p-3 bg-white/10 rounded-full border border-white/20">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Resume Analysis</h1>
              <p className="text-white/70 text-sm">Comprehensive skill matching and overview</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{matchPercentage}%</div>
              <div className="text-xs text-white/60">Match Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalSkills}</div>
              <div className="text-xs text-white/60">Total Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Overview */}
      <div className="bg-black rounded-xl border border-white/20 shadow-2xl overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 25%, white 25%, white 50%, transparent 50%, transparent 75%, white 75%, white)`,
            backgroundSize: '8px 8px'
          }}></div>
        </div>
        
        <div className="relative">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Resume Overview</h2>
                <p className="text-white/60 text-sm">Professional summary and key highlights</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {resumeOverview ? (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
                <p className="text-white/90 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {resumeOverview}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50">No resume overview available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills Analysis Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="bg-black rounded-xl border border-white/20 shadow-2xl overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }}></div>
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white text-black rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Matched Skills</h3>
                    <p className="text-white/60 text-sm">Skills that align with requirements</p>
                  </div>
                </div>
                <div className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                  {matchedSkills.length}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill, index) => (
                    <Badge
                      key={skill}
                      className="bg-white text-black border border-white px-3 py-1.5 rounded-full font-medium hover:bg-white/90 transition-all duration-200 hover:scale-105 shadow-sm"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">No matched skills found</p>
                  <p className="text-white/30 text-xs mt-1">Skills will appear here when matches are detected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unmatched Skills */}
        <div className="bg-black rounded-xl border border-white/20 shadow-2xl overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }}></div>
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 border border-white/30 rounded-lg">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Skills Gap</h3>
                    <p className="text-white/60 text-sm">Skills that need development</p>
                  </div>
                </div>
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                  {unmatchedSkills.length}
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {unmatchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {unmatchedSkills.map((skill, index) => (
                    <Badge
                      key={skill}
                      className="bg-white/10 text-white border border-white/30 px-3 py-1.5 rounded-full font-medium hover:bg-white/20 transition-all duration-200 hover:scale-105 shadow-sm backdrop-blur-sm"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">No skill gaps identified</p>
                  <p className="text-white/30 text-xs mt-1">All required skills are present</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-black rounded-xl border border-white/20 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 25%, white 25%, white 50%, transparent 50%, transparent 75%, white 75%, white)`,
            backgroundSize: '12px 12px'
          }}></div>
        </div>
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full border border-white/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-white/80 text-sm">
                <span className="font-semibold">{matchedSkills.length}</span> skills matched, 
                <span className="font-semibold"> {unmatchedSkills.length}</span> skills to develop
              </p>
              <p className="text-white/60 text-xs">
                Keep improving to reach 100% skill match
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${matchPercentage}%` }}
              ></div>
            </div>
            <span className="text-white font-semibold text-sm">{matchPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUI;