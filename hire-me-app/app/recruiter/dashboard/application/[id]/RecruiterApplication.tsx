  "use client";

  import { Button } from "@/components/ui/button";
  import { ApplicationWithJob, TranscriptMessage } from "@/types/applicationType";
  import { ArrowLeft, Eye } from "lucide-react";
  import { useRouter } from "next/navigation";
  import React from "react";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
  import ResumeUI from "./ResumeUI";
  import { Badge } from "@/components/ui/badge";
  import InterviewUI from "./InterviewUI";
  import TranscriptUI from "./TranscriptUI";
  import Actions from "./Actions";
  import { toast } from "sonner";

  const RecruiterApplication = ({
    application,
  }: {
    application: ApplicationWithJob;
  }) => {
    const router = useRouter();

    function formatDate(dateString: string | Date): string {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const getDaySuffix = (d: number) => {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };
      return `${day}${getDaySuffix(day)} ${month}, ${year}`;
    }

    return (
      <div className="w-full min-h-screen bg-black text-white flex flex-col p-4 sm:p-6">
        {/* Header Section */}
        <section className="flex items-center gap-3 sm:gap-4 mb-6">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-full cursor-pointer"
            onClick={() => router.back()}
            size="icon"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">
              Job Application Details
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Submitted on {formatDate(application.createdAt)}
            </p>
          </div>
        </section>

        {/* Job Details */}
        <section className="bg-zinc-900/80 p-4 sm:p-6 rounded-2xl shadow-lg shadow-black/30 flex flex-col lg:flex-row justify-between gap-6 border border-zinc-800">
          <div className="flex-1">
            <h2 className="text-lg sm:text-2xl font-bold">
              {application.job.jobTitle}
            </h2>
            <p className="text-gray-400 text-sm">{application.job.companyName}</p>

            {/* Status Badge */}
            <Badge
              className={`mt-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
                application.status === "Accepted"
                  ? "bg-green-600 text-white"
                  : application.status === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-yellow-600 text-black"
              }`}
            >
              {application.status}
            </Badge>

            {/* Info */}
            <div className="mt-4 sm:mt-6 space-y-3 text-xs sm:text-sm text-gray-300 border-t border-gray-800 pt-3 sm:pt-4">
              <p className="flex flex-wrap items-center gap-1 sm:gap-2">
                📄 <span className="font-semibold">Resume:</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px]">
                  {application.resumeUrl}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1 shrink-0"
                  onClick={() => {
                    if (application.resumeUrl) {
                      const resumeUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${application.resumeUrl}`;

                      console.log(process.env.NEXT_PUBLIC_R2_PUBLIC_URL);
                      window.open(resumeUrl, "_blank");
                    } else {
                      toast.error("Resume not uploaded.");
                    }
                  }}
                >
                  <Eye className="h-4 w-4" /> View
                </Button>
              </p>
              <p>
                💬 <span className="font-semibold">Preferred Language:</span> En
              </p>
              <p>
                🗓 <span className="font-semibold">Submitted:</span>{" "}
                {formatDate(application.createdAt)}
              </p>
            </div>
          </div>

          {/* Scores */}
          <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4 w-full lg:w-auto">
            <div className="text-center lg:text-right flex-1">
              <p className="text-xs sm:text-sm text-gray-400">Resume Score</p>
              <div className="w-full sm:w-44 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                  style={{ width: `${application.score || 0}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">
                {application.score || 0}%
              </p>
            </div>

            <div className="text-center lg:text-right flex-1">
              <p className="text-xs sm:text-sm text-gray-400">Interview Score</p>
              <div className="w-full sm:w-44 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  style={{ width: `${application.interviewScore || 0}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">
                {application.interviewScore || 0}%
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mt-6">
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="bg-zinc-900 rounded-xl p-1 shadow-inner shadow-black/40 flex overflow-x-auto no-scrollbar">
              <TabsTrigger
                value="resume"
                className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white hover:bg-zinc-800 transition"
              >
                Resume
              </TabsTrigger>
              <TabsTrigger
                value="interview"
                className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white hover:bg-zinc-800 transition"
              >
                Interview
              </TabsTrigger>
              <TabsTrigger
                value="qa"
                className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white hover:bg-zinc-800 transition"
              >
                Q&A
              </TabsTrigger>
              <TabsTrigger
                value="actions"
                className="flex-1 min-w-fit text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white hover:bg-zinc-800 transition"
              >
                Actions
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 sm:mt-6">
              <TabsContent value="resume">
                <ResumeUI
                  resumeOverview={application.resumeOverview}
                  matchedSkills={application.matchedSkills}
                  unmatchedSkills={application.unmatchedSkills}
                />
              </TabsContent>
              <TabsContent value="interview">
                <InterviewUI
                  transcriptSummary={application.transcriptSummary}
                  aiRecommendation={application.aiRecommendation}
                  strongPoints={application.strongPoints}
                  weakPoints={application.weakPoints}
                  aiSuggestions={application.aiSuggestions}
                  suspiciousActivities={application.suspiciousActivities}
                />
              </TabsContent>
              <TabsContent value="qa">
                <TranscriptUI transcript={(application.transcript as TranscriptMessage[] | null) ?? []} />
              </TabsContent>
              <TabsContent value="actions">
                <Actions
                  applicationId={application.id}
                  jobId={application.jobId}
                  status={
                    application.status as "Pending" | "Accepted" | "Rejected"
                  }
                />
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </div>
    );
  };

  export default RecruiterApplication;
