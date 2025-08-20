"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, MessageCircle, Clock, User, Users } from "lucide-react";

type TranscriptMessage = {
  role: "Recruiter" | "Candidate" | string;
  text: string;
};

const TranscriptUI = ({ transcript }: { transcript: TranscriptMessage[] }) => {
  const [showAll, setShowAll] = useState(false);
  const limit = 5;

  const visibleTranscript = showAll ? transcript : transcript.slice(0, limit);

  const handleDownload = () => {
    if (!transcript || transcript.length === 0) {
      alert("No transcript data available to download");
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const content = transcript
      .map((msg, idx) => `[${idx + 1}] ${msg.role}: ${msg.text}`)
      .join("\n\n");

    const header = `Interview Transcript\nGenerated: ${new Date().toLocaleString()}\nTotal Messages: ${transcript.length}\n${"=".repeat(50)}\n\n`;
    const finalContent = header + content;

    const blob = new Blob([finalContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `interview-transcript-${timestamp}.txt`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getMessageStats = () => {
    if (!transcript || transcript.length === 0) return { recruiterCount: 0, candidateCount: 0 };
    
    const recruiterCount = transcript.filter(msg => 
      msg.role.toLowerCase() === "recruiter"
    ).length;
    
    const candidateCount = transcript.length - recruiterCount;
    
    return { recruiterCount, candidateCount };
  };

  const { recruiterCount, candidateCount } = getMessageStats();

  if (!transcript || transcript.length === 0) {
    return (
      <div className="min-w-full  mx-auto bg-black rounded-xl shadow-2xl border border-white/20">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
            <MessageCircle className="relative h-16 w-16 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">No Transcript Available</h3>
          <p className="text-white/70 max-w-md leading-relaxed">
            The interview transcript will appear here once the conversation begins. 
            All messages will be captured and displayed in real-time.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
            <Clock className="h-4 w-4" />
            <span>Waiting for interview to start...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto bg-black rounded-xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="relative bg-black border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                <MessageCircle className="relative h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Interview Transcript
              </h2>
            </div>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white/80">{transcript.length} total messages</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                <User className="h-3 w-3 text-white" />
                <span className="text-white/80">{recruiterCount} recruiter</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
                <Users className="h-3 w-3 text-white" />
                <span className="text-white/80">{candidateCount} candidate</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white text-black hover:bg-white/90 border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Download className="h-4 w-4" /> 
            <span className="hidden xs:inline">Download Transcript</span>
            <span className="xs:hidden">Download</span>
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative bg-black p-6 space-y-6 min-h-[400px] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative space-y-4">
          {visibleTranscript.map((msg, idx) => {
            const isRecruiter = msg.role.toLowerCase() === "recruiter";
            return (
              <div
                key={idx}
                className={`flex ${
                  isRecruiter ? "justify-start" : "justify-end"
                } animate-in slide-in-from-bottom duration-500`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] group ${
                    isRecruiter ? "mr-12" : "ml-12"
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] ${
                      isRecruiter
                        ? "bg-white/10 text-white rounded-bl-md border-white/20"
                        : "bg-white text-black rounded-br-md border-white"
                    }`}
                  >
                    {/* Role Header */}
                    <div className={`flex items-center gap-2 mb-3 ${
                      isRecruiter ? "text-white/80" : "text-black/70"
                    }`}>
                      {isRecruiter ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Users className="h-3 w-3" />
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {msg.role}
                      </span>
                      <div className={`w-1 h-1 rounded-full ${
                        isRecruiter ? "bg-white/60" : "bg-black/60"
                      }`}></div>
                    </div>
                    
                    {/* Message Text */}
                    <p className="leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                  
                 
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show More / Show Less */}
      {transcript.length > limit && (
        <div className="bg-black p-6 border-t border-white/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300 border-white/30 text-white hover:text-white bg-white/5 backdrop-blur-sm group"
          >
            <div className="flex items-center gap-2">
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 group-hover:animate-bounce" />
                  <span className="font-medium">Show Less</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {transcript.length - limit} hidden
                  </span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 group-hover:animate-bounce" />
                  <span className="font-medium">Show More Messages</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-full text-black">
                    +{transcript.length - limit}
                  </span>
                </>
              )}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TranscriptUI;