"use client";
import React, { useEffect, useRef, useState } from "react";
import { ApplicationType } from "@/types/applicationType";
import { JobFormDataUI } from "@/zod/job";
import { useChat } from "@/hooks/chat/useChat";
import ChatHeader from "./ChatInterViewComps/chatHeader";
import ChatMessages from "./ChatInterViewComps/ChatMessages";
import ChatInput from "./ChatInterViewComps/ChatInput";
import { useRouter } from "next/navigation";
import ResumeLoader from "@/components/loaders/ResumeLoader";
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
    playTTS,
    stopAllAudio,
    showChatLoading,
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
  const messagesRef = useRef(messages);
  
  // Keep messages ref updated
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
          // Step 1: Stop any current audio and play end message
          stopAllAudio();
          
          const endMsg =
            "Sorry your time is over. Now we are forwarding you to the result page. You will be notified if you get selected. Thank you.";

          // Add message and play audio
          playTTS(endMsg);

          // Wait for audio to finish (approximate time based on message length)
          const estimatedDuration = endMsg.length * 80; // ~80ms per character
          await new Promise((resolve) =>
            setTimeout(resolve, estimatedDuration)
          );

          // Step 2: Show loading state
          setLoading(true);

          // Step 3: Save interview data - use ref to get latest messages without triggering rerun
          const suspiciousActivities = sessionStorage.getItem(
            "suspiciousActivities"
          );
          const suspicious = suspiciousActivities
            ? JSON.parse(suspiciousActivities)
            : [];

          const response = await fetch(`/api/interview/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              applicationId: application.id,
              jobId: job.id,
              conversation: messagesRef.current,
              suspiciousActivities: suspicious,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save interview data");
          }

          // Clean up session storage
          sessionStorage.removeItem("suspiciousActivities");
          sessionStorage.clear();
          
          // Step 4: Navigate to result page after saving is complete
          // Small delay to ensure loading state is visible
          timer = setTimeout(() => {
            router.replace(`/application/${application.id}/interview/result`);
          }, 500);
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
  }, [
    timeLeft,
    application.id,
    job.id,
    router,
    playTTS,
    stopAllAudio,
  ]);

  // Play welcome message once per session
  useEffect(() => {
    const hasPlayedSession = sessionStorage.getItem("welcomePlayed");

    if (hasPlayedRef.current || hasPlayedSession) return; // ⛔ already played
    setIsRecruiterTyping(true);

    hasPlayedRef.current = true; // ✅ block StrictMode double-run
    sessionStorage.setItem("welcomePlayed", "true"); // ✅ block refresh replay

    const playWelcomeMsg = async () => {
      const welcomeMsg = `Hello, welcome to the platform Hire-me. Myself Jenny, today I am taking your interview for the 
    ${job.companyName} for ${job.jobTitle} position. Before starting the Interview please follow these rules:
    1. Don't turn off your mic or video. 
    2. Don't switch tabs or minimize the application.
    3. This interview is ${job.interviewDuration}mins long.
    So if you are ready, let's start with your introduction.
  `;

      playTTS(welcomeMsg);
      setIsRecruiterTyping(false);
    };

    playWelcomeMsg();
  }, [
    job.companyName,
    job.jobTitle,
    job.interviewDuration,
    setMessages,
    setIsRecruiterTyping,
    playTTS,
  ]);

  const msg = [
    "Evaluating your interview",
    "It will take some time. Please wait",
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen absolute">
        <ResumeLoader msg={msg} />
      </div>
    );
  }

  return (
    <div className="chat h-[450px] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl shadow-2xl border border-gray-600 flex flex-col overflow-hidden">
      <ChatHeader isRecruiterTyping={isRecruiterTyping} />
      <ChatMessages
        isRecruiterTyping={isRecruiterTyping}
        messages={messages}
        messagesEndRef={messagesEndRef}
        showChatLoading={showChatLoading}
      />
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
