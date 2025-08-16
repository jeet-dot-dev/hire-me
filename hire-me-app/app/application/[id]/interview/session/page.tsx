"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useJoiningSimulation } from "@/hooks/interview/useJoiningSimulation";
import { useInterviewTimer } from "@/hooks/interview/useInterviewTimer";
import { useMediaDevices } from "@/hooks/interview/useMediaDevices";
import { useConnectionQuality } from "@/hooks/interview/useConnectionQuality";
import NavBar from "@/components/interview/ui/NavBar";
import JobInfoCard from "@/components/interview/ui/JobInfoCard";
import VideoSection from "@/components/interview/ui/VideoSection";
import CandidateVideo from "@/components/interview/ui/CandidateVideo";
import ChatSection from "@/components/interview/ui/ChatSection";
import ControlSection from "@/components/interview/ui/ControlSection";
import { ApplicationType } from "@/types/applicationType";
import { JobFormDataUI } from "@/zod/job";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [application, setApplication] = useState<ApplicationType>();
  const [job, setJob] = useState<JobFormDataUI>();
  const [messages, setMessages] = useState<
    { role: "recruiter" | "candidate"; text: string }[]
  >([]);
  const [isRecruiterTyping, setIsRecruiterTyping] = useState(false);
  const [isCandidateTurn, setIsCandidateTurn] = useState(false);

  const router = useRouter();

  // ✅ Load session data
  useEffect(() => {
    const app = sessionStorage.getItem("application");
    const jobData = sessionStorage.getItem("job");
    if (app && jobData) {
      setApplication(JSON.parse(app));
      setJob(JSON.parse(jobData));
    }
  }, []);

  const { micOn, videoOn, toggleMic, toggleVideo } = useMediaDevices(videoRef);
  const connectionQuality = useConnectionQuality();
  const getInterviewDuration = useInterviewTimer(job);

  const joiningSteps = useMemo(
    () => [
      "Connecting to interview room...",
      "Initializing AI recruiter...",
      "Setting up secure connection...",
      "Ready to begin interview!",
    ],
    []
  );

  const { isJoining, joiningStep } = useJoiningSimulation(joiningSteps);

  // ✅ Detect tab switching or minimizing (cheating detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error(
          "⚠️ Tab switching or minimizing detected! Please stay on the interview tab."
        );
      }
    };

    const handleBlur = () => {
      toast.error("⚠️ Chrome minimized or switched to another app!");
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ✅ Warn before closing or refreshing tab
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // ✅ Chrome requires empty string
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ✅ If session expired
  if (!job || !application) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold">Session Expired</h2>
        <p>Please re-upload your details to continue.</p>
        <button
          onClick={() => router.push("/candidate/dashboard/jobs")}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
        >
          Go to Jobs Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <NavBar connectionQuality={connectionQuality} />
      <JobInfoCard
        job={job}
        isJoining={isJoining}
        timeLeft={getInterviewDuration()}
      />
      <div className="mx-5 my-4 grid lg:grid-cols-3 gap-5">
        <VideoSection
          isJoining={isJoining}
          joiningStep={joiningStep}
          joiningSteps={joiningSteps}
        />
        <CandidateVideo ref={videoRef} micOn={micOn} videoOn={videoOn} />
        <ChatSection />
      </div>
      <ControlSection
        micOn={micOn}
        videoOn={videoOn}
        toggleVideo={toggleVideo}
        toggleMic={toggleMic}
      />
    </div>
  );
};

export default Page;
