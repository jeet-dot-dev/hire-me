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
import { ApplicationTypeFull } from "@/types/applicationType";
import { JobFormDataUI } from "@/zod/job";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [application, setApplication] = useState<ApplicationTypeFull>();
  const [job, setJob] = useState<JobFormDataUI>();
  const [isChecking, setIsChecking] = useState(true);
  const [alreadyDone, setAlreadyDone] = useState(false);

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

  // ✅ Mark interview as started
  useEffect(() => {
    if (!application?.id || application.isInterviewDone) return;

    const startInterview = async () => {
      try {
        const res = await fetch("/api/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: application.id }),
        });

        if (!res.ok) throw new Error("Failed to mark interview as started");

        const data = await res.json();
        console.log("Interview marked as started ✅", data);
      } catch (error) {
        console.error("Error marking interview started:", error);
      }
    };

    startInterview();
  }, [application?.id, application?.isInterviewDone]);

  // ✅ Check if already completed
  useEffect(() => {
    if (!application) return;

    if (application.isInterviewDone) {
      toast.error("Interview already completed for this application.");
      setAlreadyDone(true);
      router.replace("/candidate/dashboard/jobs");
    }

    setIsChecking(false);
  }, [application, router]);

  // ✅ Hooks must always run (no matter what)
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
        const msg =
          "⚠️ Tab switching or minimizing detected! Please stay on the interview tab.";
        toast.error(msg);
        logSuspiciousActivity(msg);
      }
    };

    const handleBlur = () => {
      const msg = "⚠️ Chrome minimized or switched to another app!";
      toast.error(msg);
      logSuspiciousActivity(msg);
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const logSuspiciousActivity = (msg: string) => {
    const existing = sessionStorage.getItem("suspiciousActivities");
    const activities = existing ? JSON.parse(existing) : [];

    activities.push({
      message: msg,
      timestamp: new Date().toISOString(),
    });

    sessionStorage.setItem("suspiciousActivities", JSON.stringify(activities));
  };

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

  // ✅ Handle rendering states
  if (isChecking) {
    return (
      <div className="flex items-center w-full bg-black justify-center h-screen text-white">
        <p>Sorry ! your interview is over </p>
      </div>
    );
  }

  if (alreadyDone) {
    return null; // router.replace will redirect
  }

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

  // ✅ Main UI
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
        <ChatSection
          isJoining={isJoining}
          application={application}
          job={job}
          timeLeft={getInterviewDuration()}
        />
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
