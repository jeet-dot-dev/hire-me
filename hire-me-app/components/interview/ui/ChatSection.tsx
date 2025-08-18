"use client";
import React, { useEffect, useRef, useState } from "react";
import { ApplicationType } from "@/types/applicationType";
import { JobFormDataUI } from "@/zod/job";
import { useChat } from "@/hooks/chat/useChat";
import ChatHeader from "./ChatInterViewComps/chatHeader";
import ChatMessages from "./ChatInterViewComps/ChatMessages";
import ChatInput from "./ChatInterViewComps/ChatInput";
import { useRouter } from "next/navigation";
import { playTTS } from "@/hooks/chat/playTTS";
import ResumeLoader from "@/components/scaleton-loaders/ResumeLoader";
import { toast } from "sonner";

const ChatSection = ({
  isJoining,
  application,
  job,
  timeLeft,
}: {
  isJoining: boolean;
  application: ApplicationType;
  job: JobFormDataUI;
  timeLeft: string;
}) => {
  const {
    messages,
    isRecruiterTyping,
    input,
    setInput,
    isRecording,
    startRecording,
    stopRecording,
    sendMessage,
    messagesEndRef,
    setMessages,
    setIsRecruiterTyping,
  } = useChat({ isJoining, job, application, timeLeft });
  const router = useRouter();

  // 🚀 Guard against double run (StrictMode) + refresh
  const hasPlayedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  // Handle interview end
  const hasEndedRef = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (sessionStorage.getItem("interviewEnded") === "true") {
      router.replace(`/application/${application.id}/interview/result`);
      return;
    }

    if (timeLeft === "00:00") {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      sessionStorage.setItem("interviewEnded", "true");

      const handleEnd = async () => {
        try {
          // Step 1: Play end message and update UI
          const endMsg =
            "Sorry your time is over. Now we are forwarding you to the result page. You will be notified if you get selected. Thank you.";

          // First, add the message to chat
          setMessages((prev) => [...prev, { role: "recruiter", text: endMsg }]);
          
          // Then play the audio and wait for it to complete
          await playTTS(endMsg);

          // Step 2: Show loading only after audio finishes
          setLoading(true);

          // Step 3: Save interview data
          const suspiciousActivities = sessionStorage.getItem("suspiciousActivities");
          const suspicious = suspiciousActivities ? JSON.parse(suspiciousActivities) : [];

          const response = await fetch(`/api/interview/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              applicationId: application.id,
              jobId: job.id,
              conversation: messages,
              suspiciousActivities: suspicious,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save interview data');
          }

          // Clean up session storage
          sessionStorage.removeItem("suspiciousActivities");
          sessionStorage.clear();

          // Step 4: Navigate to result page after saving is complete
          timer = setTimeout(() => {
            router.push(`/application/${application.id}/interview/result`);
          }, 1000); // Small delay to show loading state
          
        } catch (err) {
          toast.error("Internal server error. Please try later");
          console.error("Failed to save interview:", err);
          setLoading(false); // Reset loading state on error
          hasEndedRef.current = false; // Allow retry
          sessionStorage.removeItem("interviewEnded"); // Allow retry
        }
      };

      handleEnd();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, application.id, job.id, messages, router, setMessages]);

  // Play welcome message once per session
  useEffect(() => {
    const hasPlayedSession = sessionStorage.getItem("welcomePlayed");

    if (hasPlayedRef.current || hasPlayedSession) return; // ⛔ already played

    hasPlayedRef.current = true; // ✅ block StrictMode double-run
    sessionStorage.setItem("welcomePlayed", "true"); // ✅ block refresh replay
    setIsRecruiterTyping(true);
    
    const playWelcomeMsg = async () => {
      const welcomeMsg = `Hello, welcome to the platform Hire-me. Myself Jenny, today I am taking your interview for the 
        ${job.companyName} for ${job.jobTitle} position. Before starting the Interview please follow these rules:
        1. Don't turn off your mic or video. 
        2. Don't switch tabs or minimize the application.
        3. This interview is ${job.interviewDuration}mins long.
        So if you are ready, let's start with your introduction.
      `;

      await playTTS(welcomeMsg);
      setMessages((prev) => [...prev, { role: "recruiter", text: welcomeMsg }]);
      setIsRecruiterTyping(false);
    };

    playWelcomeMsg();
  }, [
    job.companyName,
    job.jobTitle,
    job.interviewDuration,
    setMessages,
    setIsRecruiterTyping,
  ]);

  const msg = ["Evaluating your interview", "It will take some time. Please wait"];
  
  if (loading) {
    return <div className="w-full min-h-screen absolute">
       <ResumeLoader msg={msg} />
    </div>;
  }

  return (
    <div className="chat h-[450px] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl shadow-2xl border border-gray-600 flex flex-col overflow-hidden">
      <ChatHeader isRecruiterTyping={isRecruiterTyping} />
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      <ChatInput
        input={input}
        setInput={setInput}
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatSection;